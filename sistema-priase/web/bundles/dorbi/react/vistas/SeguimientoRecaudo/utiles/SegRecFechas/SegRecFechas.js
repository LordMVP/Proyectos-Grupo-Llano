import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-bootstrap4-modal';

import './SegRecFechas.scss';

class SegRecFechas extends Component {
  state = {
    desde: moment().clone().startOf('month').format('YYYY-MM-DD'),
    hasta: moment().clone().endOf('month').format('YYYY-MM-DD'),
    mostratModal: false
  }

  componentDidMount() {
    const { desde, hasta } = this.state;

    const fecha_desde = moment(desde).format("YYYY-MM-DD");
    const fecha_hasta = moment(hasta).format("YYYY-MM-DD");

    this.props.modificarFechas(fecha_desde, fecha_hasta);
  }

  actualizarDesde = (evento) => {
    const desde = evento.target.value;

    this.setState({ desde }, () => {
        const { desde, hasta } = this.state;
    
        const fecha_desde = moment(desde, 'YYYY-MM-DD', true).isValid()?moment(desde).format("YYYY-MM-DD"):desde;
        const fecha_hasta = moment(hasta, 'YYYY-MM-DD', true).isValid()?moment(hasta).format("YYYY-MM-DD"):hasta;

        this.props.modificarFechas(fecha_desde, fecha_hasta);
      });
  }

  actualizarHasta = (evento) => {
    const hasta = evento.target.value;

    this.setState({ hasta }, () => {
        const { desde, hasta } = this.state;
    
        const fecha_desde = moment(desde, 'YYYY-MM-DD', true).isValid()?moment(desde).format("YYYY-MM-DD"):desde;
        const fecha_hasta = moment(hasta, 'YYYY-MM-DD', true).isValid()?moment(hasta).format("YYYY-MM-DD"):hasta;
  
        this.props.modificarFechas(fecha_desde, fecha_hasta);
      });
  }

  consultarComision = (evento) => {
    const { desde, hasta } = this.state;

    evento.preventDefault();
    
    if(!moment(desde, 'YYYY-MM-DD', true).isValid()){
      this.mostrarToast('La fecha "Desde" no tiene el formato correcto YYYY-MM-DD');
      return
    }
    if(!moment(hasta, 'YYYY-MM-DD', true).isValid()){
      this.mostrarToast('La fecha "Hasta" no tiene el formato correcto YYYY-MM-DD');
      return
    }

    const fechaEnRango = moment(hasta).isSameOrAfter(desde);
    if (fechaEnRango)
      this.props.consultarComision();
    else  this.mostrarToast('La fecha "Hasta" no puede ser menor a la fecha "Desde"');
  }

  exportarComision = (evento) => {
    const { desde, hasta } = this.state;

    evento.preventDefault();
    
    if(!moment(desde, 'YYYY-MM-DD', true).isValid()){
      this.mostrarToast('La fecha "Desde" no tiene el formato correcto YYYY-MM-DD');
      return
    }
    if(!moment(hasta, 'YYYY-MM-DD', true).isValid()){
      this.mostrarToast('La fecha "Hasta" no tiene el formato correcto YYYY-MM-DD');
      return
    }

    const fechaEnRango = moment(hasta).isSameOrAfter(desde);
    if (fechaEnRango)
      this.props.exportarComision();
    else  this.mostrarToast('La fecha "Hasta" no puede ser menor a la fecha "Desde"');
  }

  controlarModal = () => {
    const mostratModal = !this.state.mostratModal;

    this.setState({ mostratModal });
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
    const { desde, hasta, mostratModal } = this.state;
    
    return (
      <Fragment>
        <h3><strong>Periodo</strong></h3><br/>
        <div className="row">
          <div className="col-3">
            <div className="form-group">
              <label htmlFor="vigencia-desde">Fecha inicio</label>
              <input id="vigencia-desde"
                className="form-control"
                name="vigencia-desde"
                type="date"
                value={desde}
                onChange={this.actualizarDesde}/>
              <span className="input-group-addon">
                <span className="glyphicon glyphicon-calendar" />
              </span>
            </div>
          </div>
          <div className="col-3">
            <div className="form-group">
              <label htmlFor="vigencia-hasta">Fecha fin</label>
              <input id="vigencia-hasta"
                className="form-control"
                name="vigencia-hasta"
                type="date"
                value={hasta}
                onChange={this.actualizarHasta}/>
              <span className="input-group-addon">
                <span className="glyphicon glyphicon-calendar" />
              </span>
            </div>
          </div>
          <div className="col-2 pt-4">
            <button
              className="btn btn-primary w-100"
              onClick={evento => {
                this.consultarComision(evento);
              }}>
              Consultar</button>
          </div>
          <div className="col-2 pt-4">
            <div className="btn-group btn-group-toggle w-100">
              <button
                className="btn btn-primary w-100"
                onClick={evento => {
                  evento.preventDefault();
                  this.props.procesarComision();
                }}>
                Guardar</button>
            </div>
          </div>
          <div className="col-2 pt-4">
            <div className="btn-group btn-group-toggle w-100">
              <a href="#"
                className="btn btn-success"
                onClick={evento => {
                  this.exportarComision(evento);
                }}>
                  <i className="fa fa-lg fa-file-excel-o"></i>
              </a>
            </div>
          </div>
        </div>
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

SegRecFechas.propTypes = {
  modificarFechas: PropTypes.func,
  consultarComision: PropTypes.func,
  exportarComision: PropTypes.func,
  procesarComision: PropTypes.func
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(SegRecFechas);

export { VistaRedux as RSegRecFechas };