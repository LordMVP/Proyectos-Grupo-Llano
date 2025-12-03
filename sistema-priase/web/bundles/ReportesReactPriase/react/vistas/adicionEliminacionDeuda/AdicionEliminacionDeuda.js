import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import { saveItem } from "../../store/actions/Items";
import { saveConsultaGet } from "../../store/actions/Utils";
import { PROGRAMAS } from "../../global/constantes";
import { FiltroSuscripcion } from "../NotaDXD/utils/FormDetalleSuscripcion/FiltroSuscripcion/FiltroSuscripcion";
import TablaDetalleSuscripcionEstandar from "../NotaDXD/utils/TablaDetalleSuscripcion/TablaDetalleSuscripcionEstandar";
import ColsTablaDetalleDeudaAdicionar from "./ColsTablaDetalleDeudaAdicionar";
import ColsTablaDetalleDeudaEliminar from "./ColsTablaDetalleDeudaEliminar";

class AdicionEliminacionDeudaR extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.saveItem(undefined, "banderaDeshahTabla");
    this.props.saveItem(false, "mostrarTablaResultados");
    this.props.saveItem(PROGRAMAS.ADICION_ELIMINACION_DEUDA, "tipoNota");
    this.props.saveConsultaGet([], "listaPqr");
  }

  render() {
    const { mostrarTablaResultados, parametrosListaSuscriptores, AccionARealizar } = this.props;
    const parametros =
      !!parametrosListaSuscriptores && parametrosListaSuscriptores;

    return (
      <Fragment>
        <FiltroSuscripcion
          title="Adición/Eliminación de deuda"
          subtitle="Formulario de búsqueda de los detalles de suscripción"
        />
        {!!mostrarTablaResultados && (
          <TablaDetalleSuscripcionEstandar
            {...parametros}
            columnsTable={(!!AccionARealizar && AccionARealizar == 1) ? ColsTablaDetalleDeudaAdicionar : (!!AccionARealizar && AccionARealizar == 2) ? ColsTablaDetalleDeudaEliminar : []}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  mostrarTablaResultados: state.Items.mostrarTablaResultados,
  parametrosListaSuscriptores: state.Items.parametrosListaSuscriptores,
  AccionARealizar: state.Items.AccionARealizar,
});

const mapDispatchToProps = {
  saveItem,
  saveConsultaGet,
};

export const AdicionEliminacionDeuda = connect(
  mapStateToProps,
  mapDispatchToProps
)(AdicionEliminacionDeudaR);
