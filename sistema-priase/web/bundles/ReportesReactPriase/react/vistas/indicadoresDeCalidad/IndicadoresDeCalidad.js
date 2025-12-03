import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import { saveItem } from "../../store/actions/Items";
import { PROGRAMAS } from "../../global/constantes";

//Components
import DescuentosCalidad from "./Components/DescuentosCalidad";

//styles
import "./IndicadoresDeCalidad.scss";

class IndicadoresDeCalidadR extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.saveItem(PROGRAMAS.DESCUENTO_INDICADORES, "tipoNota");
  }

  render() {
    return (
      <Fragment>

        {<DescuentosCalidad />}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  saveItem,
};

export const IndicadoresDeCalidad = connect(
  mapStateToProps,
  mapDispatchToProps
)(IndicadoresDeCalidadR);
