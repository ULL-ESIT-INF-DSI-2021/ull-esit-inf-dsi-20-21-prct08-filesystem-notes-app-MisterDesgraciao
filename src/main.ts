import {ListaNotasPrinter} from './listanotasprinter';
import {ListaNotas} from './listanotas';
import {Nota} from './nota';
import * as chalk from 'chalk';
import * as fs from 'fs';
import * as yargs from 'yargs';

const NotaDSI = new Nota('oscarpozo', 'DSI',
    'Llevo bien la asignatura', 'Azul');

const NotasPC = new ListaNotas([NotaDSI]);
const Printer = new ListaNotasPrinter(NotasPC);

Printer.readNota(NotaDSI.titulo);

yargs.parse();

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
        NotasPC.addNota(nuevaNota);

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
          console.log(chalk.green('Añadimos la nota.'));
        }
      }
    }
  },
});

yargs.command({
  command: 'modify',
  describe: 'Modificar una nota existente.',
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
        NotasPC.modifyNota(nuevaNota);

        if (!fs.existsSync(`./users/${argv.usuario}`)) {
          console.log(chalk.red.inverse('ERROR. No existe la carpeta.'));
        } else {
          if (fs.existsSync(`./users/${argv.usuario}/${argv.titulo}`)) {
            console.log(chalk.green('Modificamos la Nota.'));
            // código para modificar el fichero JSON.
          } else {
            console.log(chalk.red.inverse('ERROR. La nota no existe.'));
          }
        }
      }
    }
  },
});

yargs.command({
  command: 'delete',
  describe: 'Eliminar una nota existente.',
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
        NotasPC.deleteNota(nuevaNota);
        if (!fs.existsSync(`./users/${argv.usuario}`)) {
          console.log(chalk.red.inverse('ERROR. No existe la carpeta.'));
        } else {
          if (fs.existsSync(`./users/${argv.usuario}/${argv.titulo}`)) {
            console.log(chalk.green('Eliminamos la Nota.'));
            // código para eliminar el fichero JSON.
          } else {
            console.log(chalk.red.inverse('ERROR. La nota no existe.'));
          }
        }
      }
    }
  },
});

yargs.command({
  command: 'list',
  describe: 'Listar todos los títulos de todas las notas.',
  handler() {
    Printer.listAllTitles();
    // probablemente también haya que añadir código para mostrar los
    // datos leyendo los títulos de los ficheros JSON.
  },
});


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
    if (typeof argv.titulo === 'string') {
      Printer.readNota(argv.titulo);
      // puede que haga falta código para leer desde fichero JSON
    }
  },
});
