/* eslint-disable require-jsdoc */

import {Nota} from './nota';

export class ListaNotas {
  arrayNotas: Nota[] = [];
  constructor(notas: Nota[]) {
    this.arrayNotas = notas;
  }

  findNota(nota: Nota) {
    const posicion = this.arrayNotas.indexOf(nota);
    if (posicion > -1) {
      return this.arrayNotas[posicion];
    }
  }

  comprobarTitulo(nuevaNota: Nota): boolean {
    this.arrayNotas.forEach((element) => {
      if (element.titulo === nuevaNota.titulo) {
        console.log('Se ha encontrado una nota con el título.');
        return true;
      }
    });
    return false;
  }

  addNota(nuevaNota: Nota) {
    if (!this.comprobarTitulo(nuevaNota)) {
      this.arrayNotas.push(nuevaNota);
    } else {
      console.log(
          'ERROR. No se ha podido añadir la Nota pues el título está repetido');
    }
  }

  modifyNota(nuevaNota: Nota) {
    this.arrayNotas.forEach((element) => {
      if (element.titulo === nuevaNota.titulo) {
        element.titulo = nuevaNota.titulo;
        element.cuerpo = nuevaNota.cuerpo;
        element.color = nuevaNota.color;
      }
    });
  }
}
