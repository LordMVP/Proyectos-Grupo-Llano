import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import { FormDetalleSuscripcion } from "../NotaDXD/utils/FormDetalleSuscripcion/FormDetalleSuscripcion";
import { PROGRAMAS } from "../../global/constantes";
import { saveItem } from "../../store/actions/Items";
import { saveConsultaGet } from "../../store/actions/Utils";

class DescuentoPuertaPuertaInt extends Component {
  componentDidMount() {
    this.props.saveItem(
      PROGRAMAS.DESCUENTO_PUERTA_PUERTA,
      "tipoNota"
    );
    this.props.saveItem(0, "returnPage");
    this.props.saveConsultaGet([], "listaPqr");
  }

  render() {
    return (
      <div className="px-4 pb-4">
        <FormDetalleSuscripcion />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  saveItem,
  saveConsultaGet,
};

export const DescuentoPuertaPuerta = connect(
  mapStateToProps,
  mapDispatchToProps
)(DescuentoPuertaPuertaInt);
