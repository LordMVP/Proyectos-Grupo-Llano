import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import { saveItem } from "../../store/actions/Items";
import { saveConsultaGet } from "../../store/actions/Utils";

//constants
import { FiltroSuscripcion } from "../NotaDXD/utils/FormDetalleSuscripcion/FiltroSuscripcion/FiltroSuscripcion";
import { PROGRAMAS } from "../../global/constantes";
import TablaDetalleSuscripcionEstandar from "../NotaDXD/utils/TablaDetalleSuscripcion/TablaDetalleSuscripcionEstandar";
import ColsTablaDetalleSusEstrato from "./ColsTablaDetalleSusEstrato";

class CambiosEstratoR extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.saveItem(undefined, "banderaDeshahTabla");
    this.props.saveItem(false, "mostrarTablaResultados");
    this.props.saveItem(PROGRAMAS.CAMBIO_ESTRATO, "tipoNota");
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
          title="Descuentos cambio de estrato"
          subtitle="Formulario de búsqueda de los detalles de suscripción"
        />
        {!!mostrarTablaResultados && (
          <TablaDetalleSuscripcionEstandar
            {...parametros}
            columnsTable={ColsTablaDetalleSusEstrato}
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

export const CambiosEstrato = connect(
  mapStateToProps,
  mapDispatchToProps
)(CambiosEstratoR);
