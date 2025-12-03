import './Menu.scss';
import { Link } from 'react-router-dom';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Util } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../global/rutas_api';

const TIPOS_MENU = {
  PRISMA: 1,
  NOCON: 2,
  REIAL: 3,
  AGAU: 4
};

class Menu extends Component {

  arregloProgramas = [];
  menuOriginal = [...this.props.opciones];

  state = {
    filtro: '',
    opciones: [...this.props.opciones] || [],
  };

  componentDidMount() {
  }

  renderMenu = () => {
    const items = [...this.state.opciones];
    if (!Util.validarArreglo(items)) {
      return <li>No se encontraron opciones</li>;
    }

    let menu = [];
    items.forEach(item => {
      menu.push(this.renderItemMenu(item));
    });
    return menu;
  };

  renderItemMenu = (opcion) => {
    if (opcion.visible === false) {
      return null;
    }

    if (!opcion.menuItem && (opcion.prgIderegistro && opcion.prgIderegistro.prgLocaliza)) {
      if (opcion.visible === false) {
        return null;
      }

      let link = null;
      if (opcion.opcTipo === TIPOS_MENU.NOCON) {
        let rutaPrograma = opcion.prgIderegistro.prgLocaliza;
        rutaPrograma = rutaPrograma.substring(rutaPrograma.lastIndexOf('/'));
        link = <Link to={rutaPrograma} title={opcion.opcDescripcion}>{opcion.opcNombre}</Link>;
      } else {
        link = <a href={opcion.prgIderegistro.prgLocaliza} title={opcion.opcDescripcion}>{opcion.opcNombre}</a>
      }

      return (
        <li key={opcion.opcIderegistro} className='menu__link-opcion'>
          {link}
        </li>
      );
    }

    const opcionesHijas = opcion.menuItem.map(opcionHija => this.renderItemMenu(opcionHija));
    const atributosItem = {
      className: 'menu__titulo-opcion',
      key: opcion.opcIderegistro,
      title: opcion.opcDescripcion,
      onClick: this.mostrarOcultarMenu
    };
    return (
      <li {...atributosItem}>
        <i className="fa fa-caret-down preicon"></i> {opcion.opcNombre}
        <ul className={'menu__subitem' + ((this.state.filtrando) ? ' open' : '')}>
          {opcionesHijas}
        </ul>
      </li>
    );

  };

  mostrarOcultarMenu = (e) => {
    e.stopPropagation();
    const padre = e.target;
    const menu = padre.querySelector('.menu__subitem');
    if (menu.classList && menu.classList.contains('open')) {
      menu.classList.remove('open');
      return;
    }
    menu.classList.add('open');
  };

  onChangeFiltro = (evento) => {
    const filtrando = (evento.currentTarget.value.trim() !== '') ? true : false;
    this.setState({ filtro: evento.currentTarget.value.trim(), filtrando: filtrando });
  };

  onKeyUp = (evento) => {
    // if (evento.charCode === TECLAS.ENTER) {
    this.filtrarMenu();
    // }
  };

  filtrarMenu = () => {
    const filtro = this.state.filtro.trim().toUpperCase();
    if (filtro.length === 0) {
      this.setState({ opciones: [...this.props.opciones] });
      return;
    };
    let opcionesFiltradas = [...this.props.opciones];
    const nuevoMenu = this.crearMenuTemporal(filtro, opcionesFiltradas);
    this.setState({ opciones: nuevoMenu });
  };

  /**
   * Compara dos cadenas, quita los simbolos de acentuación y reemplaza los espacios múltiples para realizar la validación...
   * @param cadena1 {string} : Texto contenedor.
   * @param cadena2 {string} : Texto búsqueda.
   * @return {boolean}
   */
  compararCadenas = (cadena1, cadena2) => {
    cadena1 = cadena1.toLowerCase().replace(/\s+/g, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    cadena2 = cadena2.toLowerCase().replace(/\s+/g, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return cadena1.search(cadena2) > -1;
  };

  crearMenuTemporal = (q, opciones) => {
    let temp = [];
    for (let i = 0; i < opciones.length; i++) {
      let nodoRaiz = opciones[i];
      if (this.compararCadenas(nodoRaiz.opcNombre, q)) {
        temp.push(nodoRaiz);
        continue;
      }
      if (!nodoRaiz.menuItem) {
        continue;
      }
      let nuevoNodoRaiz = {
        opcNombre: nodoRaiz.opcNombre,
        opcIderegistro: nodoRaiz.opcIderegistro,
        opcDescripcion: nodoRaiz.opcDescripcion,
        prgIderegistro: nodoRaiz.prgIderegistro,
        opcTipo: nodoRaiz.opcTipo
      };
      let tempHijos = this.crearMenuTemporal(q, nodoRaiz.menuItem);
      if (tempHijos.length > 0) {
        nuevoNodoRaiz.menuItem = tempHijos;
        temp.push(nuevoNodoRaiz);
      }
    }
    return temp;
  };


  actualizarEstadoVisible = (filtro, items, opcionActual) => {
    filtro = filtro.toString().toUpperCase();
    let contadorOcultos = 0;
    items.forEach(opcion => {
      if (Util.validarArreglo(opcion.menuItem)) {
        this.actualizarEstadoVisible(filtro, opcion.menuItem, opcion);
        return;
      }
      if (opcion.opcNombre && opcion.opcNombre.toUpperCase().indexOf(filtro) === -1) {
        opcion.visible = false;
        contadorOcultos++;
      } else {
        opcion.visible = true;
      }
    });
    if (contadorOcultos >= items.length) {
      opcionActual.visible = false;
    } else {
      opcionActual.visible = true;
    }
  };

  cerrarSesion = () => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_MENU.CERRAR_SESION);
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    if (tipoUsuario && tipoUsuario == 'EXTERNO') {
      location.href = '/achagua/sistema/web/app.php/nominaciones/login';
      return;
    }
    location.href = '/achagua/index.html';
  };

  render() {
    return (
      <div className="menu">
        <div className="menu__info-usuario">
          <p>Bienvenido: </p>
          <p>{(this.props.sesion) ? this.props.sesion.usuario : 'Indefinido'}</p>
          <a href='javascript:;' onClick={this.cerrarSesion}>Cerrar Sesión</a>
        </div>

        <div className="menu__filtro">
          <input type="text"
            className="txtFiltroMenu form-control"
            placeholder="Buscar..."
            autoFocus
            onChange={this.onChangeFiltro}
            onKeyUp={this.onKeyUp}
          />
        </div>

        <div className="menu__arbol">
          <ul className="menu__arbol__opciones">
            {this.renderMenu()}
          </ul>
        </div>
        {/* <div className="divBarraOcultarMenu">
          <button className="btnOcultarMenu" data-visible="true">
            <i className="fa fa-chevron-left"></i> Mostrar u ocultar
          </button>
        </div> */}
      </div>
    );
  }
}

Menu.propTypes = {
  opciones: PropTypes.array,
  usuario: PropTypes.string,
  actualizarProgramas: PropTypes.func
};

Menu.defaultProps = {};

export { Menu };
