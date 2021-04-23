/* eslint-disable require-jsdoc */
import * as chalk from 'chalk';
import {ListaNotas} from './listanotas';
import {Nota} from './nota';

export class ListaNotasPrinter {
  listaNotas: ListaNotas;
  constructor(listaNotas: ListaNotas) {
    this.listaNotas = listaNotas;
  }

  listAllTitles() {
    this.listaNotas.arrayNotas.forEach((element) => {
      console.log(element.titulo);
    });
  }

  readNota(titulo: string) {
    // Datos de ejemplo para definir valores y que el compilador no se queje.
    let notaLeer = new Nota('oscar', 'hola', 'mundo', 'Rojo');
    this.listaNotas.arrayNotas.forEach((element) => {
      if (element.titulo.search(titulo) > -1) {
        notaLeer = element;
      }
    });
    const posicion = this.listaNotas.findNotaPosition(notaLeer);
    if (posicion > -1) {
      const color = this.listaNotas.arrayNotas[posicion].color;
      switch (color) {
        case 'Rojo':
          console.log(chalk.red(this.listaNotas.arrayNotas[posicion].titulo));
          console.log(chalk.red(this.listaNotas.arrayNotas[posicion].cuerpo));
          break;
        case 'Azul':
          console.log(chalk.blue(this.listaNotas.arrayNotas[posicion].titulo));
          console.log(chalk.blue(this.listaNotas.arrayNotas[posicion].cuerpo));
          break;
        case 'Verde':
          console.log(chalk.green(this.listaNotas.arrayNotas[posicion].titulo));
          console.log(chalk.green(this.listaNotas.arrayNotas[posicion].cuerpo));
          break;
        case 'Amarillo':
          console.log(chalk.yellow(
              this.listaNotas.arrayNotas[posicion].titulo));
          console.log(chalk.yellow(
              this.listaNotas.arrayNotas[posicion].cuerpo));
          break;
        default:
          break;
      }
    } else {
      console.log(chalk.red.inverse(
          'ERROR. No se pudo encontrar la nota a leer.'));
    }
  }
}
