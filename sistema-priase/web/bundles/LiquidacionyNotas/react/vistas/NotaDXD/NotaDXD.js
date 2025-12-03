import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import { bindActionCreators } from "redux";
import { FormDetalleSuscripcion } from "./utils/FormDetalleSuscripcion/FormDetalleSuscripcion";

export default class NotaDXD extends Component {
  render() {
    return (
      <Fragment>
        <div className="px-4 pb-4">
          <FormDetalleSuscripcion tittle={"Descuentos por Deshabitado"} />
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(NotaDXD);

export { VistaRedux as RNotaDXD };
