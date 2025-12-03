import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { ToastContainer, toast } from 'react-toastify';

import './RangosForm.scss';

class RangosForm extends Component {
  state = {
    rangos: [{
      rango_desde: 0,
      rango_hasta: 1,
      comision: 0
    }]
  }

  componentDidMount() {
    const { rangos } = this.state;

    this.props.modificarRango(rangos);
  }

  componentDidUpdate(nextProps) {
    if (nextProps.editable !== this.props.editable) {
      this.actualizarInfo(nextProps.rangosInfo);
    }
  }

  actualizarInfo = (rangosInfo) => {
    if (this.props.editable) {
      const rangos = [];

      rangosInfo.forEach(rango => {
        rangos.push({
          rango_desde: rango.rango_desde,
          rango_hasta: rango.rango_hasta,
          comision: rango.comision
        });
      });
      
      this.setState({ rangos });
    } else {
      this.setState({
        rangos: [{
          rango_desde: 0,
          rango_hasta: 1,
          comision: 0
        }]
      }, () => {
        const { rangos } = this.state;
  
        this.props.modificarRango(rangos);
      });
    }
  }

  actualizarRangoDesde = (evento, index) => {
    const desde = Number(evento.target.value);
    const rangos = this.state.rangos;
    let canChange = false;

    const menorHasta = desde < rangos[index].rango_hasta;

    if (index > 0) {
      if (desde > rangos[index-1].rango_hasta && menorHasta)
        canChange = true;
      else this.mostrarToast(
        'El valor "Desde" no puede ser mayor al valor "Hasta" o menor al valor "Hasta" del rango anterior');
    } else {
      if (desde > -1 && menorHasta) canChange = true;
      else this.mostrarToast('El valor "Desde" no puede ser menor a 0 o mayor al valor "Hasta"');
    }

    if (canChange) {
      rangos[index].rango_desde = desde;
      
      this.setState({ rangos }, () => {
        const { rangos } = this.state;
  
        this.props.modificarRango(rangos);
      });
    }
  }

  actualizarRangoHasta = (evento, index) => {
    const hasta = Number(evento.target.value);
    const rangos = this.state.rangos;
    let canChange = false;

    const mayorDesde = hasta > rangos[index].rango_desde;

    if (index+1 < rangos.length) {
      if (hasta < rangos[index+1].rango_desde && mayorDesde) canChange = true;
      else this.mostrarToast(
        'El valor "Hasta" no puede ser menor al valor "Desde" o mayor al valor "Desde" del rango siguiente');
    } else {
      if (mayorDesde)
        canChange = true;
      else this.mostrarToast('El valor "Hasta" no puede ser menor al valor "Desde"');
    }

    if (canChange) {
      rangos[index].rango_hasta = hasta;
      
      this.setState({ rangos }, () => {
        const { rangos } = this.state;
  
        this.props.modificarRango(rangos);
      });
    }
  }

  actualizarRangoValor = (evento, index) => {
    const rangos = this.state.rangos;
    rangos[index].comision = Number(evento.target.value);
    
    this.setState({ rangos }, () => {
      const { rangos } = this.state;

      this.props.modificarRango(rangos);
    });
  }

  agregarRango = (evento) => {
    evento.preventDefault();
    const rangos = this.state.rangos;
    const newDesde = rangos[rangos.length -1].rango_hasta + 1;
    rangos.push({
      rango_desde: newDesde,
      rango_hasta: newDesde+1,
      comision: 0
    });

    this.setState({ rangos }, () => {
      const { rangos } = this.state;

      this.props.modificarRango(rangos);
    });
  }

  eliminarRango = (evento, index) => {
    evento.preventDefault();

    const rangos = this.state.rangos;
    rangos.splice(index, 1);

    this.setState({ rangos }, () => {
      const { rangos } = this.state;

      this.props.modificarRango(rangos);
    });
  }

  mostrarToast = (mensaje) => {
    const opciones = {
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    }

    toast.error(mensaje, opciones);
  }

  render() {
    const { rangos } = this.state;
    
    return (
      <Fragment>
        <h3><strong>Rango de edad de cartera recaudadora</strong></h3><br/>
        {rangos.map((rango, index) =>
        <div key={`rango-${index}`} className="row">
          <div className="col-3">
            <div className="form-group">
              <label htmlFor="rango-desde">Desde</label>
              <input id="rango-desde"
                className="form-control"
                name="rango-desde"
                type="number"
                min="0"
                value={rango.rango_desde}
                onChange={(evento) => this.actualizarRangoDesde(evento, index)}/>
            </div>
          </div>
          <div className="col-3">
            <div className="form-group">
              <label htmlFor="rango-hasta">Hasta</label>
              <input id="rango-hasta"
                className="form-control"
                name="rango-hasta"
                type="number"
                value={rango.rango_hasta}
                onChange={(evento) => this.actualizarRangoHasta(evento, index)}/>
            </div>
          </div>
          <div className="col-3">
            <div className="form-group">
              <label htmlFor="rango-valor">Valor</label>
              <input id="rango-valor"
                className="form-control"
                name="rango-valor"
                type="number"
                value={rango.comision}
                onChange={(evento) => this.actualizarRangoValor(evento, index)}/>
            </div>
          </div>
          {rangos.length > 1 && <div className="col-1">
            <button
              className="btn btn-primary mt-4"
              onClick={(evento) => this.eliminarRango(evento, index)}>-</button>
          </div>}

        </div>)}
        <button
          className="btn btn-primary"
          onClick={this.agregarRango}>+</button>
        <ToastContainer
          position="top-right"
          autoClose={4500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
      </Fragment>
    );
  }
}

RangosForm.propTypes = {
  modificarRango: PropTypes.func,
  rangosInfo: PropTypes.array,
  editable: PropTypes.bool
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(RangosForm);

export { VistaRedux as RRangosForm };