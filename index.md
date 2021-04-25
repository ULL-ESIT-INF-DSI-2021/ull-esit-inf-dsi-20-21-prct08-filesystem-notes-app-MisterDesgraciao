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

Para el comando `modifiy` mi planteamiento es: hay que incluir obligatoriamente el `título` de la nota, además del `cuerpo` **y/o** `color` a cambiar. Es decir, puedes cambiar el cuerpo, el color o los dos.

Para hacer esto hay que especificar `titulo` como obligatorio, pero `cuerpo` y `color` como opcionales.

```typescript
yargs.command({
  command: 'modify',
  describe: 'Modificar una nota existente.',
  builder: {
    titulo: {
      describe: 'Título de la nota',
      demandOption: true,
      type: 'string',
    },
    cuerpo: {
      describe: 'Cuerpo de la nota',
      demandOption: false,
      type: 'string',
    },
    color: {
      describe: 'Color de la nota',
      demandOption: false,
      type: 'string',
    },
  },
  /**
   * handler...
   */
```

Lo primero que hacemos al entrar al `handler` es comprobar que `titulo` es del formato `string`, y que luego tienen existir `cuerpo` y/o `color`. Esto lo hacemos comprobando que la longitud de la variable sea mayor que cero. Y por último, si el tamaño se cumple, comprobamos que el dato introducido también es de formato `string`.

A continuación, creamos unas cuantas variables que nos servirán más adelante.

Después lo que hacemos es almacenar el contenido de la carpeta **./users** en una variable. Lo que pretendo es iterar sobre esa variable con un `forEach()`, lo cual me permite acceder de manera dinámica a cada **carpeta de usuario**.

Así pues, recibo el nombre de cada una de las carpetas de usuarios y repito la misma operación: almacenar lo que haya dentro de cada en la variable `carpetaUsuario` haciendo uso del `fs.readdirSync()`.

```typescript
  /**
   * parte anterior
   */
  handler(argv) {
      if (typeof argv.titulo === 'string' &&
          (typeof argv.cuerpo === 'string' && argv.cuerpo.length > 0) ||
          (typeof argv.color === 'string' && argv.color.length > 0)) {
        let carpetaUsuario;
        let datos;
        let objeto;
        let modificado: boolean = false;
        const directorios = fs.readdirSync(`./users`);
        directorios.forEach((carpeta) => {
          carpetaUsuario = fs.readdirSync(`./users/${carpeta}`);
          /**
          * parte siguiente
          */
```

Al iterar sobre el contenido de `carpetaUsuario`, lo que estoy haciendo es conseguir el nombre de todos los `ficheroJSON` de cada usuario. Y obtengo los datos usando `fs.readFileSync()` sobre la ruta absoluta del fichero.

Es importante tratar esos datos que hemos leído del `ficheroJSON`, pues están en un formato poco legible. Es por eso que transformo esos datos en un objeto `Nota` con `JSON.parse(datos.toString())`. Ahora `objeto` tiene los datos en un formato reconocible.

Es en este punto en el que compruebo que el título del archivo leído y el de la variable introducida coinciden. En tal caso, primero se imprimen por consola los mensajes correspondientes.

Mi manera de realizar esta modificación del contenido es eliminar el archivo y volverlo a crear. Para ello, creo un nuevo objeto `nuevaNota` con los datos de `objeto`. Elimino el fichero JSON. Transformo a formato JSON con `JSON.stringify(nuevaNota)` sobre la variable `datosEscribir`, y esto se lo paso a `fs.writeFileSync()`.

Por último, comentar que existe un *booleano* `modificado` que simplemente comprueba si se pudo modificar la nota, es decir, si se encontró la nota durante el periodo de búsqueda.

```typescript
          carpetaUsuario.forEach((ficheroJSON) => {
          datos = fs.readFileSync(`./users/${carpeta}/${ficheroJSON}`);
          objeto = JSON.parse(datos.toString());
          if (objeto.titulo === argv.titulo) {
            console.log(chalk.green.inverse('Modificamos el fichero.'));
            if (typeof argv.cuerpo === 'string' && argv.cuerpo.length > 0) {
              objeto.cuerpo = argv.cuerpo;
              console.log(chalk.green('Cambiamos el cuerpo de la Nota.'));
            }
            if (typeof argv.color === 'string' && argv.color.length > 0) {
              objeto.color = argv.color;
              console.log(chalk.green('Cambiamos el color de la Nota.'));
            }
            fs.rmSync(`./users/${carpeta}/${ficheroJSON}`);
            const nuevaNota = new Nota(
                objeto.usuario, objeto.titulo, objeto.cuerpo, objeto.color);
            const datosEscribir = JSON.stringify(nuevaNota);
            fs.writeFileSync(
                `./users/${carpeta}/${ficheroJSON}`, datosEscribir);
            modificado = true;
          }
        });
      });
      if (!modificado) {
        console.log(chalk.red.inverse('ERROR. La nota a modificar no existe.'));
      }
    } else {
      // eslint-disable-next-line max-len
      console.log(chalk.red.inverse('ERROR. Debe introducir un título, un nuevo cuerpo y/o un nuevo color'));
    }
  },
});
```

##### Comando delete

Para el comando `delete`, lo único que necesitamos para poder borrar una nota es su título. 

```typescript
yargs.command({
  command: 'delete',
  describe: 'Eliminar una nota existente.',
  builder: {
    titulo: {
      describe: 'Título de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  /**
   * Continúa...
   */
```

Para la parte del `handler` primero comprobamos que el `titulo` es de tipo *string*. Después declaramos unas variables y guardamos en `directorios` lo que haya dentro de la carpeta **./user** usando `fs.readdirSync()`.

Iteramos sobre capa carpeta y hacemos lo mismo sobre cada archivo de cada carpeta. (Mismo procedimiento que en `modify` para encontrar la nota). Cuando encontremos una coincidencia, simplemente borramos el fichero con `fs.rmSync()`.

Informamos por consola si se pudo borrar la nota deseada, si no existe o si el `titulo` viene en un formato no soportado.

```typescript
  /**
   * ...anterior.
   */
  handler(argv) {
    if (typeof argv.titulo === 'string') {
      const directorios = fs.readdirSync(`./users`);
      let carpetaUsuario;
      let datos;
      let objeto;
      let borrado: boolean = false;
      directorios.forEach((carpeta) => {
        carpetaUsuario = fs.readdirSync(`./users/${carpeta}`);
        carpetaUsuario.forEach((ficheroJSON) => {
          datos = fs.readFileSync(`./users/${carpeta}/${ficheroJSON}`);
          objeto = JSON.parse(datos.toString());
          if (objeto.titulo === argv.titulo) {
            fs.rmSync(`./users/${carpeta}/${ficheroJSON}`);
            console.log(chalk.green.inverse(
                `Eliminado el fichero ${ficheroJSON}`));
            borrado = true;
          }
        });
      });
      if (!borrado) {
        console.log(chalk.red.inverse(
            'ERROR. No existe el fichero que se desea borrar'));
      }
    } else {
      console.log(chalk.red.inverse('No es el formato esperado de Titulo'));
    }
  },
});
```

##### Comando list

El comando `list`, pues usa el mismo procedimiento que los comandos `modify` y `delete` para encontrar la nota: itera sobre las carpetas de dentro de **./users**, y por cada carpeta también itera sobre el contenido de dentro (los ficheros JSON) de cada una. En este caso, simplemente restaura el objeto `Nota` de cada fichero e imprime el `titulo`.

```typescript
yargs.command({
  command: 'list',
  describe: 'Listar todos los títulos de todas las notas.',
  handler() {
    console.log('Los títulos de las Notas son:');
    const directorios = fs.readdirSync(`./users`);
    let fichero;
    let dato;
    let objeto;
    directorios.forEach((usuario) => {
      fichero = fs.readdirSync(`./users/${usuario}`);
      fichero.forEach((nombreDoc) => {
        dato = fs.readFileSync(`./users/${usuario}/${nombreDoc}`);
        objeto = JSON.parse(dato.toString());
        console.log(chalk.green(objeto.titulo));
      });
    });
  },
});
```

##### Comando read

Para el último comando: `read`, también solo necesitamos el `titulo` de la nota para funcionar.

```typescript
yargs.command({
  command: 'read',
  describe: 'Leer una nota en concreto.',
  builder: {
    titulo: {
      describe: 'Título de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  /**
   * Continúa...
   */
```

Llegando al `handler` hacemos primero lo de siempre: leemos **./users** e iteramos sobre su contenido. Ese contenido son las carpetas de usuarios, de las que leemos su contenido e iteramos sobre ello. Entonces vamos comparando que la `Nota` a buscar coincida con alguno de todos los ficheros JSON creado.

Cuando tengamos una coincidencia, leemos los archivos del fichero y los reconvertimos a un objeto `Nota`. De este objeto obtenemos el `colorNota`.

```typescript
  /**
   * ...
   */
  handler(argv) {
    const directorios = fs.readdirSync(`./users`);
    let carpeta;
    let dato;
    let objeto;
    let leido: boolean = false;
    directorios.forEach((carpetaUsuario) => {
      carpeta = fs.readdirSync(`./users/${carpetaUsuario}`);
      carpeta.forEach((nombreDoc) => {
        if (typeof argv.titulo === 'string' &&
            nombreDoc === argv.titulo + '.json') {
          console.log(chalk.green.inverse('La nota dice:'));
          dato = fs.readFileSync(`./users/${carpetaUsuario}/${nombreDoc}`);
          objeto = JSON.parse(dato.toString());
          const colorNota = objeto.color;
          leido = true;
          /**
           * continúa...
           */
```

Este `switch` recibe el argumento `colorNota`, que es el color con el que imprimir la nota. En un principio intenté ejecutar `chalk.colorNota()`, intentando que de alguna manera pudiera usar el contenido de la variable como opción, pero no fue posible.

Al final, este `switch` funciona perfectamente y ha sido la mejor solución.

```typescript
          /**
           * ...
           */
          switch (colorNota) {
            case 'Rojo':
              console.log(chalk.red(objeto.titulo + '.json'));
              console.log(chalk.red(objeto.cuerpo));
              break;
            case 'Verde':
              console.log(chalk.green(objeto.titulo + '.json'));
              console.log(chalk.green(objeto.cuerpo));
              break;
            case 'Azul':
              console.log(chalk.blue(objeto.titulo + '.json'));
              console.log(chalk.blue(objeto.cuerpo));
              break;
            case 'Amarillo':
              console.log(chalk.yellow(objeto.titulo + '.json'));
              console.log(chalk.yellow(objeto.cuerpo));
              break;
            default:
              break;
          }
        }
      });
    });
    if (!leido) {
      console.log(chalk.red.inverse(
          'No se encontró ninguna nota con ese título'));
    }
  },
})
    .parse();
```

Comentar que para hacer funcionar todo esto, no me sirvió la línea `yargs.parse()` que se comenta en el guión de la práctica. Lo que sí funcionaba era poner el `.parse()` al final de algunas declaraciones de los comandos, pero probando me di cuenta que cada declaración de `.parse()` que se haga después del comando implica que, al ejecutar el comando, lo hará el número de veces de `.parse()`.

Esto supuso el problema que ejecutaba el comando veces de más; y si después del comando no había ningún `.parse()`, entonces no hacía nada el comando.

La solución fue color el `.parse()` al final del todo del fichero (el último comando), para que solo ejecutase una vez.

##### Pruebas

Al principio me surgieron bastantes dudas sobre cómo podría realizar las pruebas de sobre el main. No sabía como plantear esto, pues el programa no realiza cambios sobre variables o estructuras de datos de dentro del programa, si no de fuera. La respuesta me vino a través de un compañero, que me dijo que en tutoría le habían comentado que este fichero, efectivamente, tendría pocas pruebas por la imposibilidad de realizarlas sobre los comandos.

Después de pensar un poco, decidí que las pruebas se realicen al final de una ejecución práctica de ejemplo, que modificase la carpeta **./users** para poder buscar valores esperados dentro de ella.

Así pues, los tests consisten en comprobar que las carpetas creadas en la ejecución práctica siguen existiendo: a través del `to.exists` y el `not.null`. Además, aprovechar el comando `fs.readdirSync()` para comprobar la cantidad de carpetas dentro de **./users**.

```typescript
import 'mocha';
import {expect} from 'chai';
import * as fs from 'fs';

describe('Comprobar que los datos existen después de ejecutar.', () => {
  it('Existe el fichero ./users', () => {
    expect('./users').to.exist;
    expect('./users').not.null;
  });
  it('Dentro de ./users hay solo dos carpetas', () => {
    expect(fs.readdirSync('./users').length).to.eql(2);
  });
  it('Existe la carpeta de oscar', () => {
    expect('./users/oscar').to.exist;
    expect('./users/oscar').not.null;
  });
  /**
   * Continúa...
   */
```

En esta continuación, también compruebo como antes que existe el fichero `Viernes.json`. Sin embargo, traté de hacer un par de comprobaciones diferentes:

Comprobar que no existen ni la carpeta `vin diesel` en ./users, ni el fichero `Cangrejo.json` en ninguna carpeta. Para ello, aplico el mismo método que en los comandos: iterar sobre los contenido de cada carpeta, esta vez buscando que **ningún contenido coincida con lo puntuado**.

De esta manera, intento darle un poco más de fiabilidad al programa.

```typescript
  /**
   * ...
   */
  it('Existe la carpeta de bugs bunny', () => {
    expect('./users/bugs bunny').to.exist;
    expect('./users/bugs bunny').not.null;
  });
  it('NO existe la carpeta de Vin Diesel', () => {
    const carpetasUsuario = fs.readdirSync('./users');
    carpetasUsuario.forEach((element) => {
      expect(element).to.not.eql('vin diesel');
    });
  });
  it('Existe el fichero Viernes.json en la carpeta ./users/oscar', () => {
    expect('./users/oscar/Viernes.json').to.exist;
    expect('./users/oscar/Viernes.json').not.null;
  });
  it('NO existe el fichero Cangrejo.json en ninguna carpeta', () => {
    const carpetasUsuario = fs.readdirSync('./users');
    carpetasUsuario.forEach((carpeta) => {
      const ficherosCarpeta = fs.readdirSync(`./users/${carpeta}`);
      ficherosCarpeta.forEach((archivo) => {
        expect(`./users/${carpeta}/${archivo}`).to.not.eql('Cangrejo.json');
      });
    });
  });
});
```

#### Dificultades

Por último, resumir y anotar las dificultades que he tenido en esta práctica:
