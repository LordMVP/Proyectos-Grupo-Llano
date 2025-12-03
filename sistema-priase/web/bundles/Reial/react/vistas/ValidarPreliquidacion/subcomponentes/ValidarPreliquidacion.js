import React, { Component, Fragment } from 'react';
import { Combo,  Tabla, Fecha, VentanaDialogo } from 'appfuture-react';

import API from '../../../global/rutas_api';
import Util from '../../../global/util';
import axios from 'axios';
import { toast } from 'react-toastify';
import Edicion from './Edicion';

import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'

const listaFiltro = [{ texto: 'Todas', valor: 'N' }, { texto: 'Adicionales', valor: 'S' }, { texto: 'Cambios', valor: 'C' }];

class ValidarPreliquidacion extends Component {
  state = {
    lista: [],
    listaDatos:[],
    marcado: -1,
    liquidacionJson:[],    
    idliquidacion:-1,
    filtrosJson:listaFiltro,

    desde: '',
    hasta: '',
    municipio: '',
    empresa: '-1',
    estado: '-1',
    dialogoModal: false,
    edicionModal: false,
    editable: {},
    info:[]
  }

  /*columnas = [{
    Header: 'Preliquidacion facturacion',
    columns: [
      {
        Header: 'Fecha Venta',
        accessor: 'fecha_venta',
      },

      {
        Header: 'Fecha Asignacion',
        accessor: 'fecha_asignacion',
      },

      {
        Header: 'Fecha Certificacion',
        accessor: 'fecha_certificacion',
      },

      {
        Header: 'Dias',
        accessor: 'cant_dias',
      },

      {
        Header: 'Agenda',
        accessor: 'data_agenda',
      },

      {
        Header: 'Orden Trabajo',
        accessor: 'orden_trabajo',
      },

      {
        Header: 'Suscriptor',
        accessor: 'data_suscriptor',
      },

      {
        Header: 'Tipo Uso',
        accessor: 'tipo_uso',
      },

      {
        Header: 'Municipio',
        accessor: 'data_municipio',
      },

      {
        Header: 'Valor Agenda',
        accessor: 'valor_agenda',
      },

      {
        Header: 'Valor Total',
        accessor: 'valor_toral',
      },

      {
        Header: 'Acción',
        accessor: 'id',
        Cell: (props) => this.BotonVer(props)
      },
    ]
  }]*/

  BotonValidar = () => {  
    return (<button className="btn" onClick={this.confirmar}>Confirmar Preliquidacion</button>)
  };

  BotonEjecutarConsulta = () => {
    return (<button className='btn' onClick={this.ejecutarConsulta}>Consultar</button>)
  };

  BotonDescargar = () => {
    return (<button className='btn' onClick={this.generarReporte}>Exportar</button>)
  };

  change = async ({ target: { id, value } }) => {
    await this.setState({ [id]: value });
    if (id == 'empresa') {
      this.setState({empresa:value});
    }
    if(id=='liquidacion'){
      this.setState({tipoReporte:value});
    }
  };

  handleDialogo = (valor) => {
    if (valor == undefined) valor = !this.state.dialogoModal
    return this.setState({ dialogoModal: valor })
  }

  confirmar =()=>{

    if (this.state.empresa==='-1') {
      toast.error('Debe seleccionar una empresa');
      return false;
    }

    if (this.state.hasta == 0) {
      toast.error('Debe seleccionar una fecha');
      return false;
    }

    this.handleDialogo(true)
    this.renderConfirmar();
  }

  confirmarPreliquidacion = () =>{
    const obj = this.obtenerObjetoConsultaLiquidacion();
    axios.post(API.PRELIQUIDACION_FACTURACION.CONFIRMAR, obj)
    .then(respuesta => {
      if (respuesta.data.codigo > 0) {
         toast.info("Confirmacion realizada Correctamente, OK")
         this.ejecutarConsulta();
      }
      this.descartar();
    });
  }

  generarReporte = () => {
    const obj = this.obtenerObjetoConsultaLiquidacion();
    axios.post(API.PRELIQUIDACION_FACTURACION.EXPORTAR_SERVICIOS, obj)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.forzarDescarga(respuesta.data.datos);
        }
      })
  };

  /**
   * Método encargado de descargar el reporte
   * @param datos Datos necesarios para descargar el reporte.
   */
   forzarDescarga = (datos) => {
    let a = document.createElement('a');
    a.href = 'data:' + { type: "Content-Type: application/vnd.ms-excel" } + ';base64,' + datos;
    a.download = "Reporte.xls";
    a.target = '_blank';
    a.click();
  };

  /**
   * Consultar empresas...
   */
  consultarEmpresas = () => {
    axios.post(API.PRELIQUIDACION_FACTURACION.LISTAR_EMPRESAS)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({
            empresaJson: Util.validarArreglo(respuesta.data.datos) ? respuesta.data.datos : []
          });
        }
      });
  };

  obtenerObjetoConsultaLiquidacion = () => {
    const { hasta, empresa,  ordenTrabajo, tipoReporte } = this.state;
    const obj = {
      "fechaInicio": hasta,
      "fechaFin": hasta,
      "codigoEmpresa": (empresa > 0) ? empresa : null,
      "proyectoIderegistro": 0,
      "ordenTrabajo": (ordenTrabajo ? ordenTrabajo : null),
      "estado": tipoReporte,
    };
    return obj;
  };

  /**
   * Ejecuta la consulta de liquidaciòn servicio.
   */
  ejecutarConsulta = () => {
    const formatterPeso = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });

    if (this.state.hasta == 0) {
      toast.error('Debe seleccionar una fecha');
      return false;
    }

    if (!this.state.empresaJson || this.state.empresaJson.length == 0) {
      toast.error('Debe seleccionar una empresa');
      return false;
    }
    const obj = this.obtenerObjetoConsultaLiquidacion();
    axios.post(API.PRELIQUIDACION_FACTURACION.CONSULTAR_LIQUIDACIONES_FECHA, obj)
      .then(respuesta => {
        let lista = respuesta.data.datos;
        if (respuesta.data.codigo > 0) {
          lista = respuesta.data.datos;
        } else {
          lista = [];
          toast.info('No se encontro informacion de Liquidacion');
        }
        this.setState({ listaDatos: lista });
      });
  };

  componentDidMount() {
    this.consultarEmpresas();
  }

  //validar = () => {}

  /*BotonVer(props) {
    return (
      <button className="btn" onClick={() => this.editar(props)}>
        <span>editar</span>
      </button>
    )
  };*/

  volver = () => this.props.onChange(false)

  //editar = async ({ original, index }) => {    
  editar = async (evento) => {
    
    const control = evento.target;    
    const index = control.attributes['data-index'].value; 

    await this.setState({idliquidacion:this.state.listaDatos[index].idLiquidacion});
    await this.handleEdicion(true)
    await this.setState({ editable: { index, ...this.state.listaDatos[index]}})
    await this.listarActividades();    
  }

  handleEdicion = (valor) => {
    if (valor == undefined) valor = !this.state.edicionModal
    return this.setState({ edicionModal: valor })
  }

  finalizarEdicion = async (datos) => {
    const { index, ...edicion } = datos

    const lista = this.state.lista.map((elemento, indice) => {
      if (indice === index) elemento = edicion
      return elemento
    });

    await this.handleEdicion(false)
    await this.setState({ lista })
  }

  cerrarModal = (valor) => {
    this.setState({liquidacionJson:[]})    
    this.handleEdicion(valor);
  }

  descartar = () => {
    this.setState({actualizar:0})
    this.setState({ marcado: -1 })
    this.handleDialogo(false)
  }

  /**
   * Obtener los datos utilizados para la consulta
   */
  datosConsulta = () => {    
    const obj = {
     idLiquidacion:this.state.idliquidacion
    };
    return obj;
  };

  /**
   * Listar los conceptos liquidados por suscriptor
   */
  listarActividades = () => {
    const obj = this.datosConsulta();
    axios.post(API.PRELIQUIDACION_FACTURACION.LIQUIDACION_USUARIO,obj)
    .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ liquidacionJson: respuesta.data.datos });
        }
      });
  }; 

  renderConfirmar = () => {
    const botones = [
      { texto: 'si, continuar', callback: this.confirmarPreliquidacion },
      { texto: 'descartar', callback: this.descartar},
    ];
    return(
      <VentanaDialogo
        titulo="Confirmación"
        texto="¿Desea continuar ?"
        mostrar={this.state.dialogoModal}
        botones={botones}
      />
    );
  };


  renderTablaDatos = () => {
    const formatterPeso = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });

    if (!Util.validarArreglo(this.state.listaDatos)) {
      return null;
    }
    return (
      <div className="table-responsive-xl">
          <table id='table' data-toggle='table' className='table table-hover table-condensed table-bordered table-sm' data-pagination='true' data-search='true'>
            <thead className='bg-light text-black'>
              <tr>
                <th>Fecha Venta</th>
                <th>Fecha Asignacion</th>
                <th>Fecha Certificacion</th>
                <th>Dias</th>
                <th>Agenda</th>
                <th>Orden Trabajo</th>
                <th>Suscriptor</th>
                <th>Tipo Uso</th>
                <th>Municipio</th>
                <th>Valor Agenda</th>
                <th>Valor Total</th>
                <th>Accion</th>            
              </tr>
            </thead>
            <tbody>
              {
                this.state.listaDatos.map((liquidacion,index) => {                                     
                  return (
                    <tr key={liquidacion.idLiquidacion}>
                      <td>{liquidacion.fechaVenta}</td>
                      <td>{liquidacion.fechaAsignacion}</td>
                      <td>{liquidacion.fechaCertificacion}</td>                  
                      <td>{liquidacion.dias}</td>
                      <td>{liquidacion.agenda}</td>
                      <td>{liquidacion.ordenTrabajo}</td>
                      <td>{liquidacion.suscriptor}</td>
                      <td>{liquidacion.tipoUso}</td>
                      <td>{liquidacion.municipio}</td>
                      <td>{formatterPeso.format(liquidacion.valorAgenda)}</td>
                      <td clas>{formatterPeso.format(liquidacion.valorTotal)}</td>
                      <td>{(liquidacion.audEstado) === 'P' ? 
                              (<button className='btn btn-danger btn-xs' onClick={this.editar} data-index={index} >Editar</button>) : 
                              (<button className='btn' onClick={this.editar} data-index={index}>Editar</button>)}
                      </td>                                                 
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
      </div>      
    );
  };

  render() {
    const { BotonValidar } = this;

    return (
      <React.Fragment>

        <Edicion
          mostrar={this.state.edicionModal}
          cerrarModal={this.cerrarModal}
          finalizarEdicion={this.finalizarEdicion}
          liquidacionJson={this.state.liquidacionJson}
          idLiquidacion={this.state.idliquidacion}
          editable={this.state.editable}
        />
      
        <h1>Validar Liquidación</h1>

        <div className="d-flex justify-content-center btn-group">
          <BotonValidar />     
          <button className="btn" onClick={this.volver}>
            <span>volver</span>
          </button>    
        </div>

        <div className="contenedor formulario">
          <Combo
            id="empresa"
            label="empresa"
            propValor='empresaCod'
            propTexto='empresaNom'
            name='empresa'
            value={this.state.empresa}
            onChange={this.change}
            opciones={this.state.empresaJson}
            required={true}
          />
          <Combo
            id="liquidacion"
            opciones={this.state.filtrosJson}
            propTexto='texto'
            propValor='valor'
            label='liquidacion'
            name='liquidacion'
            value={this.state.tipoReporte}
            onChange={this.change}
            required={true}
				  /> 
        </div>

        <fieldset className="contenedor">
          <legend>filtros</legend>

          <div className="formulario">           
            <Fecha
              id="hasta"
              label="Fecha Liquidacion *"
              type="date"
              value={this.state.hasta}
              onChange={this.change}
            />          

            <div>
              {this.BotonEjecutarConsulta()}             
              {'  '}
              {this.BotonDescargar()}             
            </div>

          </div>
        </fieldset>

        <div className="contenedor">
          {this.renderTablaDatos()}
        </div>
        {this.renderConfirmar()}   
      </React.Fragment>
    )
  }
}

export default ValidarPreliquidacion;
/*const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch)
}

const VistaRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(ValidarPreliquidacion)

export { VistaRedux as RValidarPreliquidacion }*/

