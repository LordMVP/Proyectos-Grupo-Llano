import React, {Component} from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import {Contenedor} from 'appfuture-react';

class IndexVista extends Component {
  render() {
    return (
      <Contenedor>
        <h1>PRIASE- Módulo Aprovechamiento</h1>
      </Contenedor>
    );
  }
}

IndexVista.propTypes = {
  history: PropTypes.object
};

const mapStateToProps = state => {
  return {};
};
const VistaRedux = connect(mapStateToProps)(IndexVista);
export {VistaRedux as RIndexVista};
