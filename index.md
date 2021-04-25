# Desarrollo de Sistemas Informáticos.
## Universidad de La Laguna. Tercer año.
## Informe Práctica 8: Aplicación de procesamiento de notas de texto.

Realizado por: **Óscar Ignacio Pozo Fernández**
Correo: **alu0101036526@ull.edu.es**
Enunciados completos en [este link.](https://ull-esit-inf-dsi-2021.github.io/prct08-filesystem-notes-app/)

## Solución implementada

Mi planteamiento inicial consistía en crear primero un sistema de clases que funcionase según el planteamiento del guión. Es decir, hay creadas una clase `Nota`, `ListaNotas` y `ListaNotasPrinter`. Este diseño lo he deshechado porque no es necesario tanta estructura de clases, si no trabajar más a fondo con `yargs`. En este informe comento esos cambios según avanzamos.

#### Clase Nota

La clase `Nota` tiene un type `Colores` donde se concretan los únicos 4 colores que pueden tener las notas. El constructo de la clase es un constructor normal, que almacena los datos en variables de clase de manera **pública** para poder acceder a ellos correctamente más adelante (en los comandos de `yargs`).

```typescript
export type Colores = 'Rojo' | 'Verde' | 'Azul' | 'Amarillo';
export class Nota {
  usuario: string;
  titulo: string;
  cuerpo: string;
  color: Colores;
  constructor(user: string, title: string, body: string, color: Colores) {
    this.usuario = user;
    this.titulo = title;
    this.cuerpo = body;
    this.color = color;
  }
```

La clase también tiene unos *getters*, cuyo cometido se centra más en hacer comprobaciones con **mocha** durante los tests.

```typescript
getUsuario(): string {
    return this.usuario;
  }

  getTitulo(): string {
    return this.titulo;
  }

  getCuerpo(): string {
    return this.cuerpo;
  }

  getColor(): Colores {
    return this.color;
  }
```

También tiene dos *setters* de los únicos dos elementos modificables de la `Nota` ya creada: el cuerpo y el color.

```typescript
setCuerpo(nuevoCuerpo: string) {
    this.cuerpo = nuevoCuerpo;
  }
setColor(nuevoColor: Colores) {
  this.color = nuevoColor;
}
```

Por último, estos son los tests realizados sobre la clase `Nota`. Me centro en poder comprobar que los objetos instaciados existen, que recibimos los datos correcto de las funciones y que las modificaciones también son correctas.

```typescript
import 'mocha';
import {expect} from 'chai';
import {Nota} from '../src/nota';

describe('Comprobaciones de la clase Nota.', () =>{
  const nuevaNota = new Nota(
      'oscarpozo', 'buenos dias', 'hoy desayuno un bocadillo', 'Amarillo');
  it('El objeto inicializado existe', () => {
    expect(nuevaNota).to.exist;
  });
  it('Crear un nuevo objeto no es nulo.', () => {
    expect(new Nota(
        'oscarpozo', 'buenos dias', 'hoy desayuno un bocadillo',
        'Amarillo')).not.null;
  });
  it('Comprobar getters de la clase Nota', () => {
    expect(nuevaNota.getUsuario()).to.eql('oscarpozo');
    expect(nuevaNota.getTitulo()).to.eql('buenos dias');
    expect(nuevaNota.getCuerpo()).to.eql('hoy desayuno un bocadillo');
    expect(nuevaNota.getColor()).to.eql('Amarillo');
  });
  it('Comprobar que los setters funcionan bien', () => {
    nuevaNota.setColor('Verde');
    expect(nuevaNota.getColor()).to.eql('Verde');
    nuevaNota.setCuerpo('Hoy se desayuna fruta');
    expect(nuevaNota.getCuerpo()).to.eql('Hoy se desayuna fruta');
  });
});
```

#### Clases ListaNotas y ListaNotasPrinter

Al comienzo de la práctica planteé mal la práctica: la enfoqué demasiado al desarrollo orientado a objetos que llevábamos. Es por eso que existen estas dos clases y sus correspondientes ficheros `.spec.ts` (los tests están vacíos). 

El cometido de `ListaNotas` es el de almacenar todos los objetos de clase `Nota` en un array, y tener los métodos descritos en el guión sobre este array.
La clase `ListaNotasPrinter` existe para respetar el principio *Single Responsability Principle*, pues esta clase imprime todos los datos que devuelven las funciones de `ListaNotas`.

Estas dos clases creo que están bien construidas, sin embargo, para esta práctica el enfoque es trabajar con `fs`: sobre comandos y ficheros, por lo que estas dos clases ya no son necesarias.

No las elimino del proyecto para que quede constancia de mi planteamiento y trabajo inicial, y demostrar que he tenido que replantear los elementos a usar en esta práctica, lo que cual me supuso un pequeño problema en ese momento.

#### Fichero main.ts

Este fichero es donde se almacena todo el código sobre los diferentes comandos del programa. Lo primero que quise añadir fue una línea para saber que el programa se logra ejecutar:

```typescript
console.log(chalk.green('Comienza la ejecución!'));
```

##### Comando add

El comando `add` de **yargs** fue el primero que creé, siguiendo el ejemplo del guión. Así pues, el comando recibo el nombre de `add`, y debe recibir los datos `usuario`, `titulo`, `cuerpo`, y `color` en formato *string* y de manera obligatoria para funcionar.

```typescript
yargs.command({
  command: 'add',
  describe: 'Añadir una Nota nueva',
  builder: {
    usuario: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
    titulo: {
      describe: 'Título de la nota',
      demandOption: true,
      type: 'string',
    },
    cuerpo: {
      describe: 'Cuerpo de la nota',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  /**
   * handler...
   */ 
```

Si el comando recibe correctamente los datos, entonces ejecuta la parte del `handler`. Lo primero que hace es comprobar que los valores de `usuario`, `titulo`, `cuerpo`, y `color` son, efectivamente, de tipo de dato *string*, usando `typeof`. Si alguno resulta que no es así, entonces imprimer por consola el mensaje correspondiente.

Lo siguiente que comprueba que es el string de la variable `color` sea alguno de los 4 permitidos. Como no me dejaba hacer la comparación entre `argv.color` y el type `Colores`, mi solución fue crear un if con las cuatro comparaciones. Si falla, comunica el error. Si no, continúa.

Lo siguiente que hace es crear el objeto `Nota` a introducir más adelante.

A continuación, comprueba que existen tanto la carpeta **./user** en el directorio raíz y la carpeta del usuario: `${argv.usuario}` en la carpeta anterior. Si alguna de las dos no existe, la crea y lo comunica por terminal.

```typescript
  /**
   * declaración de variables
   */
  handler(argv) {
    if (typeof argv.usuario === 'string' &&
        typeof argv.titulo === 'string' &&
        typeof argv.cuerpo === 'string' &&
        typeof argv.color === 'string') {
      if (argv.color === 'Rojo' ||
          argv.color === 'Verde' ||
          argv.color === 'Azul' ||
          argv.color === 'Amarillo') {
        const nuevaNota = new Nota(
            argv.usuario, argv.titulo, argv.cuerpo, argv.color);

        // si no existe alguna la carpeta, se crea.
        if (!fs.existsSync(`./users`)) {
          console.log(chalk.red.inverse('No existe la carpeta users.'));
          console.log(chalk.green.inverse('Creando la carpeta users.'));
          fs.mkdirSync(`./users`);
        }
        if (!fs.existsSync(`./users/${argv.usuario}`)) {
          console.log(chalk.red.inverse(
              `No existe la carpeta ${argv.usuario}.`));
          console.log(chalk.green.inverse(
              `Creando la carpeta ${argv.usuario}.`));
          fs.mkdirSync(`./users/${argv.usuario}`);
        }
        /**
         * Continúa...
         */
```

En este punto, lo que hace es comprobar si ya existe alguna nota de este usuario con el mismo título. Si es así, comunica el error por consola y termina.

Si no existe una nota con ese título, entonces usa el objeto `nuevaNota` que creamos al principio. Lo introduce en la función `JSON.stringify()`, que lo que hace es convertir a formato JSON (en string) los datos que reciba. Esto lo almacena en la variable `datos`.

Por último, hace uso de `fs.writeFileSync()` para indicar la dirección y el nombre del fichero a crear y los `datos` a introducir en el mismo. Lo comunica por terminal y termina de ejecutarse.

```typescript
        /**
         * Código anterior.
         */ 
        if (fs.existsSync(`./users/${argv.usuario}/${argv.titulo}`)) {
                  console.log(chalk.red.inverse('ERROR. El título ya existe.'));
                } else {
                  // Transformamos los datos a formato JSON.
                  const datos = JSON.stringify(nuevaNota);
                  // eslint-disable-next-line max-len
                  fs.writeFileSync(`./users/${argv.usuario}/${argv.titulo}.json`, datos);
                  console.log(chalk.green('Añadimos la Nota.'));
                }
              } else {
                console.log(chalk.red.inverse('Color no soportado.'));
              }
            } else {
              console.log(chalk.red.inverse('Falta algún dato al comando.'));
            }
          },
        });
```

##### Comando modify

##### Comando delete

##### Comando list

##### Comando read

#### Dificultades

```typescript

```