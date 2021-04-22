/* eslint-disable require-jsdoc */

// import { title } from "node:process";

type Colores = 'Rojo' | 'Verde' | 'Azul' | 'Amarillo';

export class Nota {
  titulo: string;
  cuerpo: string;
  color: Colores;
  constructor(title: string, body: string, color: Colores) {
    this.titulo = title;
    this.cuerpo = body;
    this.color = color;
  }
}

export class ListaNotas {
  arrayNotas: Nota[] = [];
  constructor(notas: Nota[]) {
    this.arrayNotas = notas;
  }
}
