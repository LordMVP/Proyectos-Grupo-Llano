import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { actualizarProgramas } from '../../store/actions/AplicacionAcciones';
import './Layout.scss';
import { Menu } from '../menu/Menu';

class Layout extends Component {
  render() {
    const { sesion, actualizarProgramas, tituloPrograma, children } = this.props;
    const _menu = [...this.props.menu];
    return (
      <div className="layout">
        <div className="layout__titulo">
          <h1>Sistema de información de {sesion ? sesion.empresa : 'Sistema de información Prisma'}</h1>
        </div>

        <div className="layout__contenedor-general">
          <div className="layout__contenedor-menu">
            <div className="layout__menu">
              <Menu actualizarProgramas={actualizarProgramas} opciones={_menu} sesion={this.props.sesion} />
            </div>
          </div>
          <div className="layout__contenedor-programa pb-5">
            <h2>{tituloPrograma}</h2>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  empresa: PropTypes.string,
  tituloPrograma: PropTypes.string,
  children: PropTypes.object,
  menu: PropTypes.array
};

const mapStateToProps = state => {
  return {
    empresa: '<Empresa>',
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ actualizarProgramas }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
