import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import './PrioriNavBar.scss';

class PrioriNavBar extends Component{
  state = {
    checkedOption: 0
  }

  componentDidMount() {
    let option;
    const path = this.props.history.location.pathname;
    if (path == "/priorizacion_conceptos") option = 0;
    if (path == "/priorizacion_documentos") option = 1;
    if (path == "/priorizacion_tipo_documentos") option = 2;
    if (path == "/priorizacion_convenios_homologados") option = 3;

    this.setState({ checkedOption: option });
  }

  render() {
    const { checkedOption } = this.state;
    return (
      <Fragment>
        <div className="priori-navbar" data-toggle="buttons">
          <Link
            to="/priorizacion_conceptos"
            className={`btn btn-primary ${checkedOption == 0 ?
              "" : "deseleccionado"}`}>
            Conceptos
          </Link>
          <Link
            to="/priorizacion_documentos"
            className={`btn btn-primary ${checkedOption == 1 ?
              "" : "deseleccionado"}`}>
            Documentos
          </Link>
          <Link
            to="/priorizacion_tipo_documentos"
            className={`btn btn-primary ${checkedOption == 2 ?
              "" : "deseleccionado"}`}>
            Tipo de documentos
          </Link>
          <Link
            to="/priorizacion_convenios_homologados"
            className={`btn btn-primary ${checkedOption == 3 ?
              "" : "deseleccionado"}`}>
            Convenios homologados
          </Link>
        </div>
      </Fragment>
    );
  }
}

PrioriNavBar.propTypes = {
  history: PropTypes.object
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(PrioriNavBar);

export { VistaRedux as RPrioriNavBar };