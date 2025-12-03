import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import { saveItem } from "../../store/actions/Items";
import { saveConsultaGet } from "../../store/actions/Utils";
import { FiltroSuscripcion } from "../NotaDXD/utils/FormDetalleSuscripcion/FiltroSuscripcion/FiltroSuscripcion";
import { PROGRAMAS } from "../../global/constantes";
import TablaDetalleSuscripcionEstandar from "../NotaDXD/utils/TablaDetalleSuscripcion/TablaDetalleSuscripcionEstandar";
import ColsTablaDetalleSusTipoUso from "./ColsTablaDetalleSusTipoUso";

class CambiosTipoDeUsoR extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.saveItem(undefined, "banderaDeshahTabla");
    this.props.saveItem(false, "mostrarTablaResultados");
    this.props.saveItem(PROGRAMAS.CAMBIO_TIPOUSO, "tipoNota");
    this.props.saveItem(0, "returnPage");
    this.props.saveConsultaGet([], "listaPqr");
  }

  render() {
    const { mostrarTablaResultados, parametrosListaSuscriptores } = this.props;
    const parametros =
      !!parametrosListaSuscriptores && parametrosListaSuscriptores;
    return (
      <Fragment>
        <FiltroSuscripcion
          title="Descuentos cambio tipo de uso"
          subtitle="Formulario de búsqueda de los detalles de suscripción"
        />
        {!!mostrarTablaResultados && (
          <TablaDetalleSuscripcionEstandar
            {...parametros}
            columnsTable={ColsTablaDetalleSusTipoUso}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  mostrarTablaResultados: state.Items.mostrarTablaResultados,
  parametrosListaSuscriptores: state.Items.parametrosListaSuscriptores,
});

const mapDispatchToProps = {
  saveItem,
  saveConsultaGet,
};

export const CambiosTipoDeUso = connect(
  mapStateToProps,
  mapDispatchToProps
)(CambiosTipoDeUsoR);
