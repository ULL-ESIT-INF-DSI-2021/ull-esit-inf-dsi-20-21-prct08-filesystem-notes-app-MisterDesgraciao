/* eslint-disable require-jsdoc */
import * as chalk from 'chalk';
import {ListaNotas} from './listanotas';
import {Nota} from './nota';

/**
 * Clase ListaNotasPrinter.
 * Ejerce de clase impresora (por pantalla) de los datos de
 * todas las Notas almacenadas en el array.
 * Su motivo es cumplir los principios SOLID.
 */
export class ListaNotasPrinter {
  listaNotas: ListaNotas;
  constructor(listaNotas: ListaNotas) {
    this.listaNotas = listaNotas;
  }

  /**
   * Función que recorre el array de Notas y muestra el título.
   */
  listAllTitles() {
    this.listaNotas.arrayNotas.forEach((element) => {
      console.log(element.titulo);
    });
  }

  /**
   * Función que primero localiza si alguna nota tiene el título que se
   * le pasa a la función. Si hay alguna, localiza la posición de la Nota
   * en el array. Después imprime por pantalla, según el color de la Nota,
   * su contenido.
   * @param titulo Título de la Nota a leer.
   */
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
