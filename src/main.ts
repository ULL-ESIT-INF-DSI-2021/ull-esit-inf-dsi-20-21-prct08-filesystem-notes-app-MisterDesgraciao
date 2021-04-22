import {ListaNotasPrinter} from './listanotasprinter';
import {ListaNotas} from './listanotas';
import {Nota} from './nota';
// import * as chalk from 'chalk';
// import * as fs from 'fs';

const NotaDSI = new Nota('Óscar Pozo', 'DSI',
    'Llevo bien la asignatura', 'Azul');

const NotasPC = new ListaNotas([NotaDSI]);
const Printer = new ListaNotasPrinter(NotasPC);

Printer.readNota(NotaDSI);
