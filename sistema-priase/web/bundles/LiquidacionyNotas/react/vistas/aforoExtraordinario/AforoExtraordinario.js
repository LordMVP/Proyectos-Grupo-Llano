import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import { saveItem } from "../../store/actions/Items";
import { saveConsultaGet } from "../../store/actions/Utils";
import { PROGRAMAS } from "../../global/constantes";
import { FiltroSuscripcionAforo } from "../NotaDXD/utils/FormDetalleSuscripcion/FiltroSuscripcion/FiltroSuscripcionAforo";
import TablaDetalleSuscripcionEstandar from "../NotaDXD/utils/TablaDetalleSuscripcion/TablaDetalleSuscripcionEstandar";
import ColsTablaDetalleSusAforo from "./ColsTablaDetalleSusAforo";

class AforoExtraordinarioR extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.saveItem(undefined, "banderaDeshahTabla");
    this.props.saveItem(false, "mostrarTablaResultados");
    this.props.saveItem(PROGRAMAS.AFORO_EXTRAORDINARIO, "tipoNota");
    this.props.saveConsultaGet([], "listaPqr");
  }

  render() {
    const { mostrarTablaResultados, parametrosListaSuscriptores } = this.props;
    const parametros =
      !!parametrosListaSuscriptores && parametrosListaSuscriptores;
    return (
      <Fragment>
        <FiltroSuscripcionAforo
          title="Descuentos por Aforo extraordinario"
          subtitle="Formulario de búsqueda de los detalles de suscripción"
        />
        {!!mostrarTablaResultados && (
          <TablaDetalleSuscripcionEstandar
            {...parametros}
            columnsTable={ColsTablaDetalleSusAforo}
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

export const AforoExtraordinario = connect(
  mapStateToProps,
  mapDispatchToProps
)(AforoExtraordinarioR);
