import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { COSTOS } from '../../../../global/constantes';

import './CostoForm.scss';

class CostoForm extends Component {
  state = {
    uni_tipocosto: COSTOS.NA,
    prc_valor: 0
  }

  componentDidMount() {
    const { uni_tipocosto, prc_valor } = this.state;

    this.props.modificarCostos(uni_tipocosto, prc_valor);
  }

  componentDidUpdate(nextProps) {
    if (nextProps.editable !== this.props.editable) {
      this.actualizarInfo(nextProps.comision);
    }
  }

  actualizarInfo = (comision) => {
    
    if (this.props.editable) {
      const uni_tipocosto = comision.uni_tipocosto;
      const prc_valor = comision.prc_valor;

      this.setState({ uni_tipocosto, prc_valor });
    } else {
      this.setState({
        uni_tipocosto: COSTOS.NA,
        prc_valor: 0
      });
    }
  }

  actualizarCostoTipo = (evento) => {
    const uni_tipocosto = Number(evento.target.value);

    if (uni_tipocosto === COSTOS.NA) this.setState({ prc_valor: 0 });
    
    this.setState({ uni_tipocosto }, () => {
      const { uni_tipocosto, prc_valor } = this.state;

      this.props.modificarCostos(uni_tipocosto, prc_valor);
    });
  }

  actualizarCostoValor = (evento) => {
    const prc_valor = Number(evento.target.value);

    this.setState({ prc_valor }, () => {
      const { uni_tipocosto, prc_valor } = this.state;

      this.props.modificarCostos(uni_tipocosto, prc_valor);
    });
  }

  render() {
    const { uni_tipocosto, prc_valor } = this.state;
    
    return (
      <Fragment>
        <h3><strong>Costo</strong></h3><br/>
        <div className="row">
          <div className="col-3">
            <div className="form-group">
              <label htmlFor="costo-tipo">Tipo</label>
              <select
                id="costo-tipo"
                className="form-control"
                name="costo-tipo"
                value={uni_tipocosto}
                onChange={this.actualizarCostoTipo}>
                <option value={`${COSTOS.NA}`}>-- N/A --</option>
                <option value={`${COSTOS.TRANSACCION}`}>Transacción</option>
                <option value={`${COSTOS.PORCENTAJE}`}>Porcentaje</option>
              </select>
            </div>
          </div>
          {uni_tipocosto !== COSTOS.NA && <div className="col-3">
            <div className="form-group">
              <label htmlFor="costo-valor">Valor</label>
              <input
                className="form-control"
                value={prc_valor}
                type="number"
                min="0"
                step={uni_tipocosto !== COSTOS.PORCENTAJE ? ".01" : "1"}
                onChange={this.actualizarCostoValor}/>
            </div>
          </div>}
        </div>
      </Fragment>
    );
  }
}

CostoForm.propTypes = {
  modificarCostos: PropTypes.func,
  comision: PropTypes.object,
  editable: PropTypes.bool
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(CostoForm);

export { VistaRedux as RCostoForm };