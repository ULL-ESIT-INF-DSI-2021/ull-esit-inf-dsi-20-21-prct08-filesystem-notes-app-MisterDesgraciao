/* eslint-disable require-jsdoc */
import * as chalk from 'chalk';
import {Nota} from './nota';

export class ListaNotas {
  arrayNotas: Nota[] = [];
  constructor(notas: Nota[]) {
    this.arrayNotas = notas;
  }

  findNotaPosition(nota: Nota) {
    return this.arrayNotas.indexOf(nota);
  }

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

  addNota(nuevaNota: Nota) {
    if (!this.comprobarTitulo(nuevaNota)) {
      this.arrayNotas.push(nuevaNota);
    } else {
      console.log(chalk.red.inverse(
          'ERROR. No se ha podido añadir la Nota. Título repetido.'));
    }
  }

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
