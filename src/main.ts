import {Nota} from './nota';
import * as chalk from 'chalk';
import * as fs from 'fs';
import * as yargs from 'yargs';

console.log(chalk.green('Comienza la ejecución!'));

/**
 * Comando 'add' que permite a un usuario añadir una nueva Nota.
 * Requiere obligatoriamente los parámetros de: 'usuario', 'titulo',
 * 'cuerpo' y 'color'.
 *
 * Primero comprueba que esos 4 argumentos son de tipo string.
 * Después comprueba que el color es uno de los
 * 4 soportados (rojo, azul, verde y amarillo).
 *
 * Si la carpeta 'users' no existe, la crea en el punto actual.
 * Si la carpeta del 'usuario' no existe dentro de 'users',
 * también la crea.
 *
 * A continuación, comprueba que ningún otro archivo tenga el mismo Titulo.
 * Si hay alguno que sí, comunica el error.
 * En caso contrario, crea el fichero JSON con los datos otorgados.
 */
yargs.command({
  command: 'add',
  describe: 'Añadir una Nota nueva',
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

        // si no existe alguna la carpeta, se crea.
        if (!fs.existsSync(`./users`)) {
          console.log(chalk.red.inverse('No existe la carpeta users.'));
          console.log(chalk.green.inverse('Creando la carpeta users.'));
          fs.mkdirSync(`./users`);
        }
        if (!fs.existsSync(`./users/${argv.usuario}`)) {
          console.log(chalk.red.inverse(
              `No existe la carpeta ${argv.usuario}.`));
          console.log(chalk.green.inverse(
              `Creando la carpeta ${argv.usuario}.`));
          fs.mkdirSync(`./users/${argv.usuario}`);
        }
        if (fs.existsSync(`./users/${argv.usuario}/${argv.titulo}`)) {
          console.log(chalk.red.inverse('ERROR. El título ya existe.'));
        } else {
          // Transformamos los datos a formato JSON.
          const datos = JSON.stringify(nuevaNota);
          // eslint-disable-next-line max-len
          fs.writeFileSync(`./users/${argv.usuario}/${argv.titulo}.json`, datos);
          console.log(chalk.green('Añadimos la Nota.'));
        }
      } else {
        console.log(chalk.red.inverse('Color no soportado.'));
      }
    } else {
      console.log(chalk.red.inverse('Falta algún dato al comando.'));
    }
  },
});

/**
 * Comando 'modify' que permite al usuario modificar una Nota.
 *
 * Como parámetro obligatorio debe recibir el título de la Nota,
 * para saber qué nota es, y además puede recibir el nuevo cuerpo y/o
 * color de la Nota.
 *
 * Como no sabemos de qué usuario es la Nota, primero leemos los nombres
 * de todas las carpetas dentro de 'users'. Cada carpeta pertenece a un usuario
 * distinto. Por cada carpeta, leemos el contenido dentro de cada una:
 * los archivos JSON. Si el nombre de este coincide con el título, entonces
 * hemos encontrado el archivo a modificar.
 *
 * Leemos los 4 parámetros escritos en el JSON (usuario, título, cuerpo y color)
 * y cambiamos cuerpo y/o color por su nuevo valor.
 * Tenemos el nuevo objeto a introducir.
 *
 * A continuación, borramos el fichero JSON con los datos antiguos. Creamos un
 * nuevo objeto Nota con los nuevos valores y creamos un nuevo fichero JSON
 * con esos nuevos datos.
 */
yargs.command({
  command: 'modify',
  describe: 'Modificar una nota existente.',
  builder: {
    titulo: {
      describe: 'Título de la nota',
      demandOption: true,
      type: 'string',
    },
    cuerpo: {
      describe: 'Cuerpo de la nota',
      demandOption: false,
      type: 'string',
    },
    color: {
      describe: 'Color de la nota',
      demandOption: false,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.titulo === 'string' &&
        (typeof argv.cuerpo === 'string' && argv.cuerpo.length > 0) ||
        (typeof argv.color === 'string' && argv.color.length > 0)) {
      const directorios = fs.readdirSync(`./users`);
      let carpetaUsuario;
      let datos;
      let objeto;
      let modificado: boolean = false;
      directorios.forEach((carpeta) => {
        carpetaUsuario = fs.readdirSync(`./users/${carpeta}`);
        carpetaUsuario.forEach((ficheroJSON) => {
          datos = fs.readFileSync(`./users/${carpeta}/${ficheroJSON}`);
          objeto = JSON.parse(datos.toString());
          if (objeto.titulo === argv.titulo) {
            console.log(chalk.green.inverse('Modificamos el fichero.'));
            if (typeof argv.cuerpo === 'string' && argv.cuerpo.length > 0) {
              objeto.cuerpo = argv.cuerpo;
              console.log(chalk.green('Cambiamos el cuerpo de la Nota.'));
            }
            if (typeof argv.color === 'string' && argv.color.length > 0) {
              objeto.color = argv.color;
              console.log(chalk.green('Cambiamos el color de la Nota.'));
            }
            fs.rmSync(`./users/${carpeta}/${ficheroJSON}`);
            const nuevaNota = new Nota(
                objeto.usuario, objeto.titulo, objeto.cuerpo, objeto.color);
            const datosEscribir = JSON.stringify(nuevaNota);
            fs.writeFileSync(
                `./users/${carpeta}/${ficheroJSON}`, datosEscribir);
            modificado = true;
          }
        });
      });
      if (!modificado) {
        console.log(chalk.red.inverse('ERROR. La nota a modificar no existe.'));
      }
    } else {
      // eslint-disable-next-line max-len
      console.log(chalk.red.inverse('ERROR. Debe introducir un título, un nuevo cuerpo y/o un nuevo color'));
    }
  },
});

/**
 * Comando 'delete' que permite al usuario eliminar una Nota.
 *
 * Como parámetro obligatorio solo recibe el título,
 * para saber que nota eliminar.
 *
 * Comenzamos la búsqueda leyendo el contenido de la carpeta 'users'.
 * Por cada carpeta dentro, leemos el contenido de cada una.
 * Por cada fichero JSON dentro, comparamos el nombre con el título.
 *
 * Cuando coincida uno eliminamos el archivo.
 */
yargs.command({
  command: 'delete',
  describe: 'Eliminar una nota existente.',
  builder: {
    titulo: {
      describe: 'Título de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.titulo === 'string') {
      const directorios = fs.readdirSync(`./users`);
      let carpetaUsuario;
      let datos;
      let objeto;
      let borrado: boolean = false;
      directorios.forEach((carpeta) => {
        carpetaUsuario = fs.readdirSync(`./users/${carpeta}`);
        carpetaUsuario.forEach((ficheroJSON) => {
          datos = fs.readFileSync(`./users/${carpeta}/${ficheroJSON}`);
          objeto = JSON.parse(datos.toString());
          if (objeto.titulo === argv.titulo) {
            fs.rmSync(`./users/${carpeta}/${ficheroJSON}`);
            console.log(chalk.green.inverse(
                `Eliminado el fichero ${ficheroJSON}`));
            borrado = true;
          }
        });
      });
      if (!borrado) {
        console.log(chalk.red.inverse(
            'ERROR. No existe el fichero que se desea borrar'));
      }
    } else {
      console.log(chalk.red.inverse('No es el formato esperado de Titulo'));
    }
  },
});

/**
 * Comando 'list' que muestra todos los Títulos de todas las Notas.
 *
 * No recibe ningún parámetro al ejecutarse.
 *
 * Al igual que los comandos anteriores, inspecciones 'users' para obtener
 * los nombres de las carpetas. Después inspecciona esas carpetas una por una,
 * imprimiendo el título de cada archivo JSON que se encuentra.
 */
yargs.command({
  command: 'list',
  describe: 'Listar todos los títulos de todas las notas.',
  handler() {
    console.log('Los títulos de las Notas son:');
    const directorios = fs.readdirSync(`./users`);
    let fichero;
    let dato;
    let objeto;
    directorios.forEach((usuario) => {
      fichero = fs.readdirSync(`./users/${usuario}`);
      fichero.forEach((nombreDoc) => {
        dato = fs.readFileSync(`./users/${usuario}/${nombreDoc}`);
        objeto = JSON.parse(dato.toString());
        console.log(chalk.green(objeto.titulo));
      });
    });
  },
});

/**
 * Comando 'read' que permite leer el contenido de una Nota con el color
 * especificado.
 *
 * Como único parámetro debe recibir el título de la nota, para localizarla.
 *
 * Obtiene el contenido de la carpeta 'users' para obtener el nombre de las
 * carpetas de usuarios. Por cada una de ellas, vuelve a leer el contenido,
 * esta vez para obtener el título de cada fichero JSON.
 *
 * Una vez encuentra el fichero, procede a imprimir el título y el cuerpo
 * de la Nota con el color que tiene indicado.
 */
yargs.command({
  command: 'read',
  describe: 'Leer una nota en concreto.',
  builder: {
    titulo: {
      describe: 'Título de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    const directorios = fs.readdirSync(`./users`);
    let carpeta;
    let dato;
    let objeto;
    let leido: boolean = false;
    directorios.forEach((carpetaUsuario) => {
      carpeta = fs.readdirSync(`./users/${carpetaUsuario}`);
      carpeta.forEach((nombreDoc) => {
        if (typeof argv.titulo === 'string' &&
            nombreDoc === argv.titulo + '.json') {
          console.log(chalk.green.inverse('La nota dice:'));
          dato = fs.readFileSync(`./users/${carpetaUsuario}/${nombreDoc}`);
          objeto = JSON.parse(dato.toString());
          const colorNota = objeto.color;
          leido = true;
          switch (colorNota) {
            case 'Rojo':
              console.log(chalk.red(objeto.titulo + '.json'));
              console.log(chalk.red(objeto.cuerpo));
              break;
            case 'Verde':
              console.log(chalk.green(objeto.titulo + '.json'));
              console.log(chalk.green(objeto.cuerpo));
              break;
            case 'Azul':
              console.log(chalk.blue(objeto.titulo + '.json'));
              console.log(chalk.blue(objeto.cuerpo));
              break;
            case 'Amarillo':
              console.log(chalk.yellow(objeto.titulo + '.json'));
              console.log(chalk.yellow(objeto.cuerpo));
              break;
            default:
              break;
          }
        }
      });
    });
    if (!leido) {
      console.log(chalk.red.inverse(
          'No se encontró ninguna nota con ese título'));
    }
  },
})
    .parse();
