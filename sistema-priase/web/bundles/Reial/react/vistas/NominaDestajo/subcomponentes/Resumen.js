import React, { Component,Fragment } from 'react'
import { Combo, Input, VentanaModal } from 'appfuture-react'

import RUTAS_API from '../../../global/rutas_api';
import Util from '../../../global/util'
import axios from 'axios';


class Resumen extends Component {
  state = {
    contratante:'8000212729', 
    contratista:'8605103153', 
    desde:'',
    hasta:'', 
    colaborador:''
  }

  async componentDidUpdate(props,state) {
    if (props.editable !== this.props.editable) {
      const { editable } = this.props
      console.log(editable)
      await this.setState({
          colaborador:editable.cedula_nomina,
          desde:editable.periodo_nomina.split(' hasta ')[0],
          hasta:editable.periodo_nomina.split(' hasta ')[1]
      })
      this.buscar()
    }
  }


  cancelar = () => {
    this.props.cerrarModal(false)
  }

  limpiarCampos = () => {
    this.setState({
      contratante:'', 
      contratista:'', 
      desde:'',
      hasta:'', 
      colaborador:''
    })
  }

  obtenerCriterioBusqueda = () => {
    const { contratante, contratista, desde, hasta, colaborador } = this.state;
    return {
      "contratante": contratante,
      "contratista": contratista,
      "fechainicio": desde,
      "fechafin": hasta,
      "actividad": "",
      "colaborador": colaborador,
      "proyecto": "",
      "etapa": "",
      "servicio": ""
    };
  };

  buscar = () => {
    axios.post(RUTAS_API.REPORTE_ACTIVIDADES_COLABORADOR.NOMINA_GENERAL,
      {
        ...this.obtenerCriterioBusqueda()
      }
    ).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        this.setState({ listaACtividadesColaborador: respuesta.data.datos });
      } else {
        this.setState({ listaACtividadesColaborador:[] });
      }
    });
  };

  renderTablaActividadesColaborador = () => {
    const formatterPeso = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });
    const lista = this.state.listaACtividadesColaborador;
    if (!Util.validarArreglo(lista)) {
      return null;
    }

    let totales = [1];
    let totalCant = 0;
    let totalValor= 0;
    return (
      <div className='table-responsive'>
        <table className='table table-hover table-condensed table-striped table-bordered'>         
          <thead></thead>
          <tbody>
            {
              lista.map((distribucion, index) => {
                totalCant = 0;
                totalValor= 0;
                const valores = distribucion.listaActividades;
                //let valorTotalLinea = 0;
                return (
                  <Fragment>
                    <tr key={distribucion.cedula} className='bg-dark text-white'>
                      <td>Cedula: {distribucion.cedula}</td>
                      <td>{distribucion.nombre}</td>
                      <td>Contrato: {distribucion.contrato}</td>
                      <td>Cargo: {distribucion.cargo}</td>
                      <td colSpan={2}>{distribucion.descCargo}</td>
                      <td>Desde: {this.state.desde}</td>
                      <td>Hasta: {this.state.hasta}</td>
                    </tr> 
                    <tr>
                      <td><b>Actividad</b></td>
                      <td><b>Cantidad</b></td>
                      <td><b>Valor Unit</b></td>
                      <td><b>Municipio</b></td>
                      <td><b>Servicio</b></td>
                      <td><b>Etapa</b></td>
                      <td><b>Fecha</b></td>
                      <td><b>Total</b></td>
                    </tr>                                       
                      {                      
                        valores.map((actividades, index) => {                          
                          totalCant += actividades.cantidad;                        
                          totalValor += actividades.total;
                          return <tr key={actividades.actividad}>
                                  <td>{actividades.actividad}</td>
                                  <td>{actividades.cantidad}</td>
                                  <td>{formatterPeso.format(actividades.valorUnitario)}</td>
                                  <td>{actividades.proyecto}</td>
                                  <td>{actividades.agenda}</td>
                                  <td>{actividades.servicio}</td>                     
                                  <td>{actividades.fechaEjecucion}</td>
                                  <td>{formatterPeso.format(actividades.total)}</td>
                                </tr>
                        })
                      }{
                        totales.map((cantidad, index) => {                  
                          return <tr key={cantidad}>                                  
                                  <td><b>Total Actividades</b></td>
                                  <td><b>{totalCant}</b></td>   
                                  <td colSpan={5}><b>Total Devengado</b></td>                                  
                                  <td><b>{formatterPeso.format(totalValor)}</b></td>                              
                                </tr>
                        })
                      }                  
                  </Fragment>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  };

  render() {
    const { BotonGuardar } = this

    return (
      <VentanaModal
        titulo="Actividades por Colaborador"
        mostrar={this.props.mostrar}
        cerrarModal={this.props.cerrarModal}>

        <div className="contenedor formulario">
          <div className='row mt-5'>
            <div className='col-12'>
              {this.renderTablaActividadesColaborador()}
            </div>
          </div>
        </div>     
      </VentanaModal>
    )
  }
}

export default Resumen
