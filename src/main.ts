// import {ListaNotasPrinter} from './listanotasprinter';
// import {ListaNotas} from './listanotas';
import {Nota} from './nota';
import * as chalk from 'chalk';
import * as fs from 'fs';
import * as yargs from 'yargs';
// import { readFile } from 'typedoc/dist/lib/utils';
// import { readFileSync } from 'node:fs';

// const NotaDSI = new Nota('oscarpozo', 'DSI',
//  'Llevo bien la asignatura', 'Azul');

// const NotasPC = new ListaNotas([NotaDSI]);
// const Printer = new ListaNotasPrinter(NotasPC);

// Printer.readNota(NotaDSI.titulo);
console.log(chalk.green('Comienza la ejecución!'));
// yargs.parse();

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
//    .parse();

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
  handler(argv) {
    if (typeof argv.titulo === 'string' &&
        (typeof argv.cuerpo === 'string' && argv.cuerpo.length > 0) ||
        (typeof argv.color === 'string' && argv.color.length > 0)) {
      if (fs.existsSync(`./users/**/${argv.titulo}.json`)) {
        console.log(chalk.green('Modificamos la Nota.'));
        // código para modificar el fichero JSON.
        console.log(`./users/**/${argv.titulo}.json`);
        const objetoNota = fs.readFileSync(`./users/**/${argv.titulo}.json`);
        console.log(objetoNota);
      } else {
        console.log(chalk.red.inverse('ERROR. La nota a modificar no existe.'));
      }
    } else {
      // eslint-disable-next-line max-len
      console.log(chalk.red.inverse('ERROR. Debe introducir un título, un nuevo cuerpo y/o un nuevo color'));
    }
    /*
    if (typeof argv.titulo === 'string' &&
        typeof argv.cuerpo === 'string' &&
        typeof argv.color === 'string') {
      if (argv.color === 'Rojo' ||
          argv.color === 'Verde' ||
          argv.color === 'Azul' ||
          argv.color === 'Amarillo') {
        // const nuevaNota = new Nota(
        //    argv.usuario, argv.titulo, argv.cuerpo, argv.color);
        // NotasPC.modifyNota(nuevaNota);

        if (!fs.existsSync(`./users/${argv.usuario}`)) {
          console.log(chalk.red.inverse('ERROR. No existe la carpeta.'));
        } else {
          if (fs.existsSync(`./users/${argv.usuario}/${argv.titulo}.json`)) {
            console.log(chalk.green('Modificamos la Nota.'));
            // código para modificar el fichero JSON.
          } else {
            console.log(chalk.red.inverse('ERROR. La nota no existe.'));
          }
        }
      } else {
        console.log(chalk.red.inverse('Falta algún dato al comando.'));
      }
    } */
  },
});
//    .parse();

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
//   .parse();

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
//    .parse();


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
