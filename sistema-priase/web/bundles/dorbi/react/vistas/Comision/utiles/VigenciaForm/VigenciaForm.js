import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { ToastContainer, toast } from 'react-toastify';

import './VigenciaForm.scss';

class VigenciaForm extends Component {
  state = {
    desde: moment().format("YYYY-MM-DD"),
    hasta: moment().add(1, 'd').format("YYYY-MM-DD")
  }

  componentDidMount() {
    const { desde, hasta } = this.state;

    const vigencia_desde = moment(desde).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    const vigencia_hasta = moment(hasta).format("YYYY-MM-DDTHH:mm:ss.SSSZ");

    this.props.modificarVigencia(vigencia_desde, vigencia_hasta);
  }

  componentDidUpdate(nextProps) {
    if (nextProps.editable !== this.props.editable) {
      this.actualizarInfo(nextProps.comision);
    }
  }

  actualizarInfo = (comision) => {
    if (this.props.editable) {
      const desde = moment().format("YYYY-MM-DD");

      let oldHasta = comision.prc_vigencia_hasta;
      if (!oldHasta) oldHasta = comision.pcrc_vigencia_hasta;
      if (moment(oldHasta).isBefore(desde)) oldHasta = desde;

      const hasta = moment(oldHasta).format("YYYY-MM-DD");

      this.setState({ desde, hasta });
    } else {
      this.setState({
        desde: moment().format("YYYY-MM-DD"),
        hasta: moment().add(1, 'd').format("YYYY-MM-DD")
      }, () => {
        const { desde, hasta } = this.state;
    
        const vigencia_desde = moment(desde).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        const vigencia_hasta = moment(hasta).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  
        this.props.modificarVigencia(vigencia_desde, vigencia_hasta);
      });
    }
  }

  actualizarVigenciaDesde = (evento) => {
    const desde = evento.target.value;
    const { hasta } = this.state;

    const current =  moment().format("YYYY-MM-DD");
    const mayorCurrent = moment(desde).isSameOrAfter(current);
    const fechaEnRango = moment(desde).isSameOrBefore(hasta) && mayorCurrent;

    if (fechaEnRango) {
      this.setState({ desde }, () => {
        const { desde, hasta } = this.state;
    
        const vigencia_desde = moment(desde).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        const vigencia_hasta = moment(hasta).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  
        this.props.modificarVigencia(vigencia_desde, vigencia_hasta);
      });
    } else if (!mayorCurrent) this.mostrarToast('La fecha "Desde" no puede ser inferior a la fecha actual');
    else this.mostrarToast('La fecha "Desde" no puede ser mayor a la fecha "Hasta"');
  }

  actualizarVigenciaHasta = (evento) => {
    const hasta = evento.target.value;
    const { desde } = this.state;

    if (this.props.editable) {
      let oldHasta = this.props.comision.prc_vigencia_hasta;
      if (!oldHasta) oldHasta = this.props.comision.pcrc_vigencia_hasta;
      oldHasta = moment(oldHasta).format("YYYY-MM-DD");
      
      const fechaEnRango = moment(hasta).isSameOrAfter(oldHasta);

      if (fechaEnRango) {
        this.setState({ hasta }, () => {
          const { desde, hasta } = this.state;
      
          const vigencia_desde = moment(desde).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
          const vigencia_hasta = moment(hasta).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    
          this.props.modificarVigencia(vigencia_desde, vigencia_hasta);
        });
      } else this.mostrarToast('La fecha "Hasta" nueva no puede ser inferior a la fecha "Hasta" anterior');
    } else {
      const fechaEnRango = moment(hasta).isSameOrAfter(desde);

      if (fechaEnRango) {
        this.setState({ hasta }, () => {
          const { desde, hasta } = this.state;
      
          const vigencia_desde = moment(desde).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
          const vigencia_hasta = moment(hasta).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    
          this.props.modificarVigencia(vigencia_desde, vigencia_hasta);
        });
      } else this.mostrarToast('La fecha "Hasta" no puede ser menor a la fecha "Desde"');
    }
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
    const { desde, hasta } = this.state;
    
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
                onChange={this.actualizarVigenciaDesde}/>
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
                onChange={this.actualizarVigenciaHasta}/>
              <span className="input-group-addon">
                <span className="glyphicon glyphicon-calendar" />
              </span>
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

VigenciaForm.propTypes = {
  modificarVigencia: PropTypes.func,
  comision: PropTypes.object,
  editable: PropTypes.bool
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(VigenciaForm);

export { VistaRedux as RVigenciaForm };