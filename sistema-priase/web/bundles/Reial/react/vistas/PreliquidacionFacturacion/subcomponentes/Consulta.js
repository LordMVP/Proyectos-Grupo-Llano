import React, { Component, Fragment } from 'react';
import { Combo, Input, Tabla, Fecha, VentanaDialogo } from 'appfuture-react';
import Autocompletado from '../../Assets/componentes/Autocompletado';

import API from '../../../global/rutas_api';
import { get as getProp } from 'object-path';
import Peticion from '../../../global/peticion';
import Util from '../../../global/util';
import './Consulta.scss';
import axios from 'axios';
import RUTAS_API from '../../../global/rutas_api';
import { toast } from 'react-toastify';

const ESTADOS = {
  PRELIQUIDADO: 'P',
  LIQUIDACION_CONFIRMADA: 'L',
  EXPORTADO_SEVEN: 'E',
  EXPORTADO_CON_ERROR: 'ER',
};

const ACCIONES = {
  ELIMINAR: 'ELIMINAR',
  CONFIRMAR: 'CONFIRMAR',
  EXPORTAR: 'EXPORTAR',
  REPORTE: ''
};

const opciones = {
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

class Consulta extends Component {
  state = {
    lista: [
      {
        liquidacion: 1,
        descripcion: 'Ejemplo en memoria',
        estado: 'liquidado',
        fecha: '22/09/2019',
        observacion: 'esto es un ejemplo de consulta'
      }
    ],
    marcado: -1,
    dialogoModal: false,

    // elementos

    desde: '',
    hasta: '',
    municipio: '',
    empresa: '-1',
    estado: '-1',
    estadoJson: [
      { valor: ESTADOS.PRELIQUIDADO, texto: 'preliquidado' },
      { valor: ESTADOS.LIQUIDACION_CONFIRMADA, texto: 'liquidado' },
      { valor: ESTADOS.EXPORTADO_SEVEN, texto: 'exportado' },
      { valor: ESTADOS.EXPORTADO_CON_ERROR, texto: 'exportado con error' },
      { valor: ESTADOS.DESCARTADO, texto: 'descartado' },
    ]
  }
 // Codigo basura
  columnas = [{
    Header: 'Preliquidacion facturacion',
    columns: [
      {
        Header: 'Liquidacion',
        accessor: 'liquidacion',
      },

      {
        Header: 'Descripcion',
        accessor: 'descripcion',
      },

      {
        Header: 'Estado',
        accessor: 'estado',
      },

      {
        Header: 'Fecha',
        accessor: 'fecha',
      },

      {
        Header: 'Observacion',
        accessor: 'observacion',
      },

      {
        Header: 'Acción',
        accessor: 'id',
        Cell: props => (
          <button className="btn" onClick={() => this.marcar(props)}>
            <span>eliminar</span>
          </button>
        )
      },
    ]
  }] //end codigo basura

  // componentes

  BotonValidar = () => {
    /* prettier-ignore */

    return !this.state.enProgreso
      ? <button className="btn" onClick={this.validar}>validar</button>
      : <button className="btn" disabled={true}>validar</button>
  };

  //Codigo basura.. se identifica otra funcionalidad  para  el Boton  Consultar
  BotonConsultar = () => {
    return false
      ? <button className="btn" onClick={this.consultar}>consultar</button>
      : <button className="btn" disabled={true}>consultar</button>
  }; 

  BotonEjecutarConsulta = () => {
    return (<button className='btn' onClick={this.ejecutarConsulta}>Consultar</button>)
  };

  BotonLimpiarFiltro = () => {
    return !this.state.enProgreso
      ? <button className="btn" onClick={() => { this.limpiarCampos() }}>Limpiar</button>
      : <button className="btn" disabled={true}>Limpiar</button>
  };

  change = async ({ target: { id, value } }) => {
    await this.setState({ [id]: value });
    if (id == 'empresa') {
      this.consultarMunicipios();
    }
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

  obtenerIdMunicipio = (texto) => {
    const { municipioJson } = this.state;
    const municipio = municipioJson.find(m => m.texto.trim() == texto.trim());
    if (!municipio) {
      return null;
    }
    return municipio.valor;
  };

  obtenerObjetoConsultaLiquidacion = () => {
    const { desde, hasta, empresa, municipio, ordenTrabajo, estado } = this.state;
    const obj = {
      "fechaInicio": desde,
      "fechaFin": hasta,
      "codigoEmpresa": (empresa > 0) ? empresa : null,
      "proyectoIderegistro": this.obtenerIdMunicipio(municipio),
      "ordenTrabajo": (ordenTrabajo ? ordenTrabajo : null),
      "estado": (!!estado && estado.trim() != '' && estado != '-1') ? estado : null,
    };
    return obj;
  };

  /**
   * Ejecuta la consulta de liquidaciòn servicio.
   */
  ejecutarConsulta = () => {
    if (!this.state.municipioJson || this.state.municipioJson.length == 0) {
      toast.error('Debe seleccionar una empresa', opciones);
      return false;
    }
    const obj = this.obtenerObjetoConsultaLiquidacion();
    axios.post(API.PRELIQUIDACION_FACTURACION.CONSULTAR_LIQUIDACIONES_APLICAR, obj)
      .then(respuesta => {
        let lista = respuesta.data.datos;
        if (respuesta.data.codigo > 0) {
          lista = respuesta.data.datos;
        } else {
          lista = [];
        }
        this.setState({ listaConsultaLiquidacion: lista });
      });
  };

  componentDidMount() {
    this.consultarEmpresas();
  }

  obtenerEmpresaSeven = () => {
    const { empresaJson } = this.state;
    const empresa = empresaJson.find(empresa => empresa.empresaCod == this.state.empresa);
    return (empresa) ? empresa.empresaSevemp : null;
  };

  /**
   * Consultar municipios...
   */
  consultarMunicipios = () => {
    Peticion.postCustom({
      url: API.PRELIQUIDACION_FACTURACION.LISTAR_MUNICIPIOS,
      config: {
        valor: 'proyectoIderegistro',
        texto: 'proyectoNom',
        autocompletado: true,
      },
      parametros: {
        idEmpresaContratante: this.obtenerEmpresaSeven()
      },
      callback: municipioJson => {
        this.setState({ municipioJson: Util.validarArreglo(municipioJson) ? municipioJson : [] })
      }
    });
  };

  // Start  - Codigo basura
  consultar = () => {}

  descartarEliminacion = () => {
    // limpieza

    this.setState({ marcado: -1 })
    this.handleDialogo(false)
  }

  eliminar = () => {
    const { marcado } = this.state

    if (marcado !== -1) {
      // TODO
    }

    else {
      // MOSTRAR TOAST
    }

    this.handleDialogo(false)
  }

  handleDialogo = (valor) => {
    if (valor == undefined) valor = !this.state.dialogoModal
    return this.setState({ dialogoModal: valor })
  }

  marcar = async ({ index }) => {
    await this.setState({ marcado: index })
    this.handleDialogo(true)
  }
  // End - Codigo Basura

 // volver = () => this.props.onChange(false)
  validar = () => this.props.onChange(1);
  /**  CODIGO BASURA
   * Render Confirmar...
   * @return {Component}
   */
  renderConfirmar = () => {
    const botones = [
      { texto: 'si, eliminar', callback: this.eliminar },
      { texto: 'descartar', callback: this.descartarEliminacion },
    ];
    <VentanaDialogo
      titulo="Confirmación"
      texto="¿Desea eliminar la liquidación?"
      mostrar={this.state.dialogoModal}
      botones={botones}
    />
  };

  /**
   * Valida el estado del registro liquidado y retorna la acción permitida.
   * @return {Component}
   */
  obtenerBtnAccion = (registro, index) => {
    const estado = getProp(registro, 'estado', '-');
    switch (estado) {
      case ESTADOS.PRELIQUIDADO:
        //return (<button className='btn btn-xs btn-success' onClick={this.ejecutarAccionTabla} data-index={index} data-accion={ACCIONES.CONFIRMAR} >Confirmación</button>);
        return (<label><b>ESPERAR CONFIRMACIÓN</b></label>)
      case ESTADOS.LIQUIDACION_CONFIRMADA:
      case ESTADOS.EXPORTADO_CON_ERROR:
        return (<button className='btn btn-xs btn-success' onClick={this.ejecutarAccionTabla} data-index={index} data-accion={ACCIONES.EXPORTAR}>Exportar</button>);
    }
  };

  /**
   * Recibe el código de un estado y devuelve el nombre.
   * @param {string}
   * @return {string}
   */
  obtenerNombreEstado = (codigoEstado) => {
    let estado = 'Indefinido';
    for (const key in ESTADOS) {
      if (ESTADOS.hasOwnProperty(key) && codigoEstado == ESTADOS[key]) {
        estado = key;
        break;
      }
    }
    return estado;
  };

  /**
   * Ejecuta el proceso de confirmación de una liquidación...
   * @param {string}
   */
  confirmarLiquidacion = (idsLiquidaciones) => {
    axios.post(API.PRELIQUIDACION_FACTURACION.CONFIRMAR, JSON.parse(idsLiquidaciones))
      .then(respuesta => {
        this.ejecutarConsulta();
      });
  };

  /**
   * Ejecuta el proceso de eliminación de una liquidación...
   * @param {string}
   */
  eliminarLiquidacion = (idsLiquidaciones) => {
    axios.post(API.PRELIQUIDACION_FACTURACION.ELIMINAR, JSON.parse(idsLiquidaciones))
      .then(respuesta => {
        this.ejecutarConsulta();
      });
  };

  /**
   * Método encargado de generar el reporte
   * @param {Array} idsLiquidaciones Identificadores de liquidación.
   */
  generarReporte = (idsLiquidaciones) => {
    axios.post(API.PRELIQUIDACION_FACTURACION.GENERAR_REPORTE, JSON.parse(idsLiquidaciones))
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
   * Ejecuta el proceso de exportar una liquidación...
   * @param {string}
   */
  exportarLiquidacion = (idsLiquidaciones,factura) => {
    let liquidacion = JSON.parse(idsLiquidaciones)
    axios.post(API.PRELIQUIDACION_FACTURACION.EXPORTAR, 
        {
          liquidacion,
          factura
        }
        ).then(respuesta => {
        this.ejecutarConsulta();
      });
  };

  ejecutarAccionTabla = (evento) => {
    const control = evento.target;
    const accion = control.attributes['data-accion'].value;
    const index = control.attributes['data-index'].value;
    const listaConsultaLiquidacion = this.state.listaConsultaLiquidacion;
    const registro = listaConsultaLiquidacion[index];
    if (!registro) {
      return;
    }
    const idsLiquidacion = registro.idsLiquidaciones;
    switch (accion) {
      case ACCIONES.CONFIRMAR:
        this.confirmarLiquidacion(idsLiquidacion);
        break;
      case ACCIONES.ELIMINAR:
        this.eliminarLiquidacion(idsLiquidacion);
        break;
      case ACCIONES.EXPORTAR:
        this.exportarLiquidacion(idsLiquidacion,registro.numFactura);
        break;
      case ACCIONES.REPORTE:
        this.generarReporte(idsLiquidacion);
        break;
    }
  };

  /**
   * Renderiza la tabla de consulta de liquidaciones...
   * @return {Component}
   */
  renderTablaConsultaLiquidaciones = () => {
    const formatterPeso = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });
    if (!Util.validarArreglo(this.state.listaConsultaLiquidacion)) {
      return;
    }
    return (
      <Fragment>
        <table className='table table-condensed table-bordered table-striped'>
          <thead>
            <tr>
              <th>ID Movimiento Seven</th>
              <th>Número Factura</th>
              <th>Código Producto</th>
              <th>Valor Total</th>
              <th>Descripción Liq.</th>
              <th>Acción</th>
              <th>Estado</th>
              <th>Descartar</th>
              <th>Fecha Liquidación</th>
              <th>Usuario Liquidador</th>
              <th>Mensaje</th>
              <th>Reporte</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.listaConsultaLiquidacion.map((registro, index) => {
                return (
                  <tr key={getProp(registro, 'idExportadoSeven', '0') + index}>
                    <td>{getProp(registro, 'idExportadoSeven', '-')}</td>
                    <td>{getProp(registro, 'numFactura', '-')}</td>
                    <td>{getProp(registro, 'codigoProductoSeven', '-')}</td>
                    <td>{formatterPeso.format(getProp(registro, 'valorTotal', '-'))}</td>
                    <td>{getProp(registro, 'observacion', '-')}</td>
                    <td>
                      {this.obtenerBtnAccion(registro, index)}
                    </td>
                    <td>{this.obtenerNombreEstado(getProp(registro, 'estado', ''))}</td>
                    <td>{getProp(registro, 'estado', '') === ESTADOS.PRELIQUIDADO ? (<button className='btn btn-danger btn-xs' onClick={this.ejecutarAccionTabla} data-index={index} data-accion={ACCIONES.ELIMINAR}>Eliminar</button>) : ''}</td>
                    <td>{getProp(registro, 'fechaLiquidacion', '-')}</td>
                    <td>{getProp(registro, 'nombreUsuario', '-')}</td>
                    <td>{getProp(registro, 'mensajeExportacionSeven', '-')}</td>
                    <td><button className='btn btn-primary btn-xs' onClick={this.ejecutarAccionTabla} data-index={index} data-accion={ACCIONES.REPORTE} >Reporte</button></td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </Fragment>
    );
  };

  render() {
    const { BotonConsultar, BotonLimpiarFiltro,BotonValidar } = this;

    return (
      <React.Fragment>
        {this.renderConfirmar()}

        <h1>Consulta de liquidaciones</h1>

        <div className="d-flex justify-content-center btn-group">
          <BotonConsultar />
          <BotonValidar/>
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

          <Autocompletado
            id="municipio"
            label="municipio"
            value={this.state.municipio}
            onChange={this.change}
            opciones={this.state.municipioJson}
            required={true}
          />
        </div>

        <fieldset className="contenedor">
          <legend>filtros</legend>

          <div className="formulario">
            <Fecha
              label='Desde*'
              id="desde"
              label="desde"
              type="date"
              value={this.state.desde}
              onChange={this.change}
            />

            <Fecha
              id="hasta"
              label="Hasta*"
              type="date"
              value={this.state.hasta}
              onChange={this.change}
            />

            <Combo
              id="estado"
              label="estado"
              value={this.state.estado}
              onChange={this.change}
              opciones={this.state.estadoJson}
            />

            <div>
              {this.BotonEjecutarConsulta()}
              <BotonLimpiarFiltro />
            </div>
          </div>
        </fieldset>

        <div className="contenedor">
          <div className='row'>
            <div className='col-12'>
              {this.renderTablaConsultaLiquidaciones()}
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Consulta;
