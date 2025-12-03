import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch } from 'react-router-dom';
import { Layout } from './Layout';
import { Util } from 'appfuture-react';
import { Reportes } from '../../vistas/Reportes/Reportes';
class MenuLayout extends Component {


  /**
  * Buscará un programa por ruta.
  * @param {array} lista
  * @param {string} ruta
  * @return {object} programa
  */
  obtenerPrograma = (lista, ruta) => {
    let programa = '';
    this.buscarPrograma(lista, ruta, (p) => {
      programa = p;
    });
    return programa;
  };

  /**
   * Buscará un programa por ruta y al finalizar si lo encuentra ejecutará un callback.
   * @param {array}
   * @param {string} ruta
   * @param {function} callbackReporteJuanito
   */
  buscarPrograma = (lista, ruta, callback) => {
    lista.filter(p => {
      if ((p.prgIderegistro.prgLocaliza) && p.prgIderegistro.prgLocaliza.endsWith(ruta)) {
          if (typeof callback === 'function') {
          callback(p);
        }
      } else if (p.menuItem) {
                this.buscarPrograma(p.menuItem, ruta, callback);
      }
    });
  };


  /**
   * Obtiene el título del programa actual.
   * @return {string}
   */
  obtenerTituloPrograma = () => {
    const ruta = this.props.location.pathname.substring(1);
    let programaSeleccionado = '';
    const { opcionesMenu } = this.props;
    if (ruta === '' || !Util.validarArreglo(opcionesMenu)) {
      return '';
    }
    programaSeleccionado = this.obtenerPrograma(opcionesMenu, ruta);
      if (typeof programaSeleccionado != 'object') {
      console.log('Acceso a programa no reconocido en el menú', { ruta });
      return '';
    }
    return programaSeleccionado.opcNombre;
  };


  /**
   * Crea un Router a partir de un objeto programa.
   * @return {Component}
   */
  obtenerRouter = (programa) => {
    const prgLocaliza = programa.prgIderegistro.prgLocaliza;
    const ruta = prgLocaliza.substring(prgLocaliza.lastIndexOf('/'));
    for (const llave in this.props.rutasVista) {
      const vista = this.props.rutasVista[llave];
      
      if (vista.url === ruta) {
        return (
          <Route
            path={ruta}
            component={vista.componente}
            key={programa.opcIderegistro}
            titulo={programa.opcNombre}
            exact
          />
        );
      }
    }
  };

  /**
   * Crea una lista de routers dentro de un array recibido...
   */
  crearListaRouters = (lista, programas) => {
    lista.forEach(a => {
      if (a.prgIderegistro && a.prgIderegistro.prgLocaliza) {
        programas.push(this.obtenerRouter(a));
      }

      if (a.menuItem) {
        this.crearListaRouters(a.menuItem, programas);
      }
    });
  };

  /**
   * Crea una lista de routers y los retorna.
   * @return {array}
   */
  obtenerProgramasPermitidos = () => {
    let programas = [];
    this.crearListaRouters(this.props.opcionesMenu, programas);
    return programas;
  };ReporteJuanito

  render() {
    const { opcionesMenu, titulo, sesion, rutasVista } = this.props;
    if (!Util.validarArreglo(this.props.opcionesMenu)) {
      return 'No se recibió una lista de opciones válidas para el menú';
    }
 
    return (
      <Layout
        menu={opcionesMenu}
        tituloPrograma={this.obtenerTituloPrograma()}
        sesion={sesion}
      >   
        <Switch>
          <Route exact path="/:reporte" component={Reportes} sesion={sesion} />
        </Switch>
      </Layout>
    );
  }
}

MenuLayout.propTypes = {
  opciones: PropTypes.array,
  usuario: PropTypes.string,
  actualizarProgramas: PropTypes.func
};

MenuLayout.defaultProps = {};

export default withRouter(MenuLayout);
