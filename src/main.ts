import {ListaNotasPrinter} from './listanotasprinter';
import {ListaNotas} from './listanotas';
import {Nota} from './nota';
// import {Colores} from './nota';
// import * as chalk from 'chalk';
// import * as fs from 'fs';
import * as yargs from 'yargs';

const NotaDSI = new Nota('Óscar Pozo', 'DSI',
    'Llevo bien la asignatura', 'Azul');

const NotasPC = new ListaNotas([NotaDSI]);
const Printer = new ListaNotasPrinter(NotasPC);

Printer.readNota(NotaDSI);

yargs.parse();

yargs.command({
  command: 'add',
  describe: 'Add a new note',
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
      }
    }
  },
});
