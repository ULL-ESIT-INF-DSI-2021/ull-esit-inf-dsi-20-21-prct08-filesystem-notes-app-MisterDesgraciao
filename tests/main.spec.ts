import 'mocha';
import {expect} from 'chai';
import * as fs from 'fs';

describe('Comprobar que los datos existen después de ejecutar.', () => {
  it('Existe el fichero ./users', () => {
    expect('./users').to.exist;
    expect('./users').not.null;
  });
  it('Dentro de ./users hay solo dos carpetas', () => {
    expect(fs.readdirSync('./users').length).to.eql(2);
  });
  it('Existe la carpeta de oscar', () => {
    expect('./users/oscar').to.exist;
    expect('./users/oscar').not.null;
  });
  it('Existe la carpeta de bugs bunny', () => {
    expect('./users/bugs bunny').to.exist;
    expect('./users/bugs bunny').not.null;
  });
  it('NO existe la carpeta de Vin Diesel', () => {
    const carpetasUsuario = fs.readdirSync('./users');
    carpetasUsuario.forEach((element) => {
      expect(element).to.not.eql('vin diesel');
    });
  });
  it('Existe el fichero Viernes.json en la carpeta ./users/oscar', () => {
    expect('./users/oscar/Viernes.json').to.exist;
    expect('./users/oscar/Viernes.json').not.null;
  });
  it('NO existe el fichero Cangrejo.json en ninguna carpeta', () => {
    const carpetasUsuario = fs.readdirSync('./users');
    carpetasUsuario.forEach((carpeta) => {
      const ficherosCarpeta = fs.readdirSync(`./users/${carpeta}`);
      ficherosCarpeta.forEach((archivo) => {
        expect(`./users/${carpeta}/${archivo}`).to.not.eql('Cangrejo.json');
      });
    });
  });
});
