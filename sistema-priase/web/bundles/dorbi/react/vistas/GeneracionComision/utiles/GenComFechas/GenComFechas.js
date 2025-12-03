import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-bootstrap4-modal';

import './GenComFechas.scss';

class GenComFechas extends Component {
  state = {
    desde: moment().format("YYYY-MM-DD"),
    hasta: moment().add(1, 'd').format("YYYY-MM-DD"),
    mostratModal: false
  }

  componentDidMount() {
    const { desde, hasta } = this.state;

    const fecha_desde = moment(desde).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    const fecha_hasta = moment(hasta).format("YYYY-MM-DDTHH:mm:ss.SSSZ");

    this.props.modificarFechas(fecha_desde, fecha_hasta);
  }

  actualizarDesde = (evento) => {
    const desde = evento.target.value;
    const { hasta } = this.state;

    const fechaEnRango = moment(desde).isSameOrBefore(hasta)

    if (fechaEnRango) {
      this.setState({ desde }, () => {
        const { desde, hasta } = this.state;
    
        const fecha_desde = moment(desde).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        const fecha_hasta = moment(hasta).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  
        this.props.modificarFechas(fecha_desde, fecha_hasta);
      });
    } else this.mostrarToast('La fecha "Desde" no puede ser mayor a la fecha "Hasta"');
  }

  actualizarHasta = (evento) => {
    const hasta = evento.target.value;
    const { desde } = this.state;

    const fechaEnRango = moment(hasta).isSameOrAfter(desde);

    if (fechaEnRango) {
      this.setState({ hasta }, () => {
        const { desde, hasta } = this.state;
    
        const fecha_desde = moment(desde).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        const fecha_hasta = moment(hasta).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  
        this.props.modificarFechas(fecha_desde, fecha_hasta);
      });
    } else this.mostrarToast('La fecha "Hasta" no puede ser menor a la fecha "Desde"');
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
        <h3><strong>Vigencia</strong></h3><br/>
        <div className="row">
          <div className="col-3">
            <div className="form-group">
              <label htmlFor="vigencia-desde">Desde</label>
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
              <label htmlFor="vigencia-hasta">Hasta</label>
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
          <div className="col-3 pt-4">
            <button
              className="btn btn-primary w-100"
              onClick={evento => {
                evento.preventDefault();
                this.props.consultarComision();
              }}>
              Consultar</button>
          </div>
          <div className="col-3 pt-4">
            <div className="btn-group btn-group-toggle w-100">
              <button
                className="btn btn-primary w-100"
                onClick={evento => {
                  evento.preventDefault();
                  this.props.procesarComision();
                }}>
                Procesar</button>
            
              <button
                className="btn btn-secundary w-25"
                onClick={this.controlarModal}>
                i</button>
              <Modal
                visible={mostratModal}
                onClickBackdrop={this.controlarModal}>
                <div className="modal-header">
                  <h5 className="modal-title">Impuestos</h5>
                </div>
                <div className="modal-body">
                  Esta acción podrá tardar en terminar. Se procesarán los recaudos según el filtro y se generaran las comisiones
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={this.controlarModal}>
                    Cerrar</button>
                </div>
              </Modal>
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
          pauseOnHover/>
      </Fragment>
    );
  }
}

GenComFechas.propTypes = {
  modificarFechas: PropTypes.func,
  consultarComision: PropTypes.func,
  procesarComision: PropTypes.func
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GenComFechas);

export { VistaRedux as RGenComFechas };