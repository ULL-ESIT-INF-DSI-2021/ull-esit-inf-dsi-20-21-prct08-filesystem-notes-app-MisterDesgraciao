/* eslint-disable require-jsdoc */

// import { title } from "node:process";

type Colores = 'Rojo' | 'Verde' | 'Azul' | 'Amarillo';

export class Nota {
  usuario: string;
  titulo: string;
  cuerpo: string;
  color: Colores;
  constructor(user: string, title: string, body: string, color: Colores) {
    this.usuario = user;
    this.titulo = title;
    this.cuerpo = body;
    this.color = color;
  }
}
