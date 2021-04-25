# Desarrollo de Sistemas Informáticos.
## Universidad de La Laguna. Tercer año.
## Informe Práctica 8: Aplicación de procesamiento de notas de texto.

Realizado por: **Óscar Ignacio Pozo Fernández**
Correo: **alu0101036526@ull.edu.es**
Enunciados completos en [este link.](https://ull-esit-inf-dsi-2021.github.io/prct08-filesystem-notes-app/)

## Solución implementada

Mi planteamiento inicial consistía en crear primero un sistema de clases que funcionase según el planteamiento del guión. Es decir, hay creadas una clase `Nota`, `ListaNotas` y `ListaNotasPrinter`. Este diseño lo he deshechado porque no es necesario tanta estructura de clases, si no trabajar más a fondo con `yargs`. En este informe comento esos cambios según avanzamos.

La clase `Nota` tiene un type `Colores` donde se concretan los únicos 4 colores que pueden tener las notas. El constructo de la clase es un constructor normal, que almacena los datos en variables de clase de manera **pública** para poder acceder a ellos correctamente más adelante (en los comandos de `yargs`).

```typescript
export type Colores = 'Rojo' | 'Verde' | 'Azul' | 'Amarillo';
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
```

```typescript

```

```typescript

```

```typescript

```

```typescript

```

```typescript

```

```typescript

```