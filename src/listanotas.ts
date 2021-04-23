import * as chalk from 'chalk';
import {Nota} from './nota';

/**
 * Clase ListaNotas que almacena objetos de clase Nota
 * en su array.
 */
export class ListaNotas {
  arrayNotas: Nota[] = [];
  /**
   * Constructor de la clase.
   * @param notas Nueva Nota a añadir.
   */
  constructor(notas: Nota[]) {
    this.arrayNotas = notas;
  }

  /**
   * Función que encuentra la posición de la Nota en el array.
   * @param nota Nota a buscar.
   * @returns Posición de la Nota en el array (puede ser -1)
   */
  findNotaPosition(nota: Nota) {
    return this.arrayNotas.indexOf(nota);
  }

  /**
   * Función que comprueba que el título de la Nota se encuentra en el array,
   * es decir, se encuentra una Nota con el mismo Título.
   * @param nuevaNota Nota a comprobar si se haya en el array.
   * @returns Si encuentra una Nota con el mismo tipo (true). Si no (false).
   */
  comprobarTitulo(nuevaNota: Nota): boolean {
    this.arrayNotas.forEach((element) => {
      if (element.titulo === nuevaNota.titulo) {
        console.log(chalk.green(
            'Se ha encontrado una nota con el título.'));
        return true;
      }
    });
    return false;
  }

  /**
   * Función para añadir nueva Nota al array
   * @param nuevaNota Nueva Nota a añadir.
   */
  addNota(nuevaNota: Nota) {
    if (!this.comprobarTitulo(nuevaNota)) {
      this.arrayNotas.push(nuevaNota);
    } else {
      console.log(chalk.red.inverse(
          'ERROR. No se ha podido añadir la Nota. Título repetido.'));
    }
  }

  /**
   * Función para modificar una Nota del Array.
   * Primero comprueba que se encuentra en el
   * array: (su posición debe ser mayor a -1).
   * Después cambia todos los valores.
   * @param nuevaNota Nota de la que copiar los nuevos valores.
   */
  modifyNota(nuevaNota: Nota) {
    const posicion = this.findNotaPosition(nuevaNota);
    if (posicion > -1) {
      this.arrayNotas[posicion].titulo = nuevaNota.titulo;
      this.arrayNotas[posicion].cuerpo = nuevaNota.cuerpo;
      this.arrayNotas[posicion].color = nuevaNota.color;
      console.log(chalk.green.inverse(
          'Nota modificada correctamente.'));
    } else {
      console.log(chalk.red.inverse(
          'ERROR. No se encontró la nota a modificar.'));
    }
  }

  /**
   * Función que primero busca la posición de la Nota.
   * Si la encuentra (posición > -1) entonces la elimina del array.
   * @param notaEliminar Nota a eliminar.
   */
  deleteNota(notaEliminar: Nota) {
    const posicion = this.findNotaPosition(notaEliminar);
    if (posicion > -1) {
      this.arrayNotas.splice(posicion, 1);
      console.log(chalk.green.inverse('Se ha eleminado la nota correctamente'));
    } else {
      console.log(chalk.red.inverse(
          'ERROR. No se encontró la nota a eliminar.'));
    }
  }
}
