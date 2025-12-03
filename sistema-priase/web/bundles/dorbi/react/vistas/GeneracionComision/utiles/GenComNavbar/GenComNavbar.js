import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import RUTAS_VISTA from "../../../../global/rutas_vista";

import "./GenComNavbar.scss";

class GenComNavbar extends Component {
  state = {
    checkedOption: 0,
  };

  componentDidMount() {
    let option;
    const path = this.props.history.location.pathname;
    option =
      path == RUTAS_VISTA.GEN_COMISION_RECAUDO.url
        ? 0
        : path == RUTAS_VISTA.GEN_COMISION_RECUPERACION_CARTERA.url
        ? 1
        : 0;

    this.setState({ checkedOption: option });
  }

  render() {
    const { checkedOption } = this.state;
    return (
      <Fragment>
        <div className="priori-navbar" data-toggle="buttons">
          <Link
            to={RUTAS_VISTA.GEN_COMISION_RECAUDO.url}
            className={`btn btn-primary ${
              checkedOption == 0 ? "" : "deseleccionado"
            }`}
          >
            Recaudo
          </Link>
          <Link
            to={RUTAS_VISTA.GEN_COMISION_RECUPERACION_CARTERA.url}
            className={`btn btn-primary ${
              checkedOption == 1 ? "" : "deseleccionado"
            }`}
          >
            Recuperación de cartera
          </Link>
        </div>
      </Fragment>
    );
  }
}

GenComNavbar.propTypes = {
  history: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GenComNavbar);

export { VistaRedux as RGenComNavbar };
