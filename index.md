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

También tiene dos *setters* de los únicos dos elementos modificables de la una `Nota` ya creada: el cuerpo y el color.

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

Si el comando recibe correctamente los datos, entonces ejecuta la parte del `handler`.

```typescript
  /**
   * declaración de variables
   */
  han 

```

#### Dificultades

```typescript

```