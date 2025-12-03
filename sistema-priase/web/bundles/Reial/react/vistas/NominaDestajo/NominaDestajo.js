import React, { Component } from 'react';
import { Combo, Input, Tabla, VentanaDialogo } from 'appfuture-react';

import API from '../../global/rutas_api';
import Peticion from '../../global/peticion';
import Util from '../../global/util';
import axios from 'axios';

import { toast } from 'react-toastify';

import Edicion from './subcomponentes/Edicion';

import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'
import Resumen from './subcomponentes/Resumen';

class NominaDestajo extends Component {
  state = {
    dialogoModal: false,
    edicionModal: false,
    resumenModal:false,
    periodico: false,

    editable: {},
    lista: [],
    botones:[],
    desde: '',
    hasta: '',

    contratista: null,
    periodo: '-1',
    descripcion: '',
    editarp:'',
    mensaje:''
  }

  columnas = [{
    Header: 'Nomina al destajo',

    columns: [
      {
        Header: 'Periodo',
        accessor: 'periodo_nomina',
        Cell: props => {
          return props.value.split('T')[0]
        }
      },

      { Header: 'Cedula', accessor: 'cedula_nomina' },
      { Header: 'Contrato', accessor: 'contrato_nomina' },
      { Header: 'Cargo', accessor: 'cargo_nomina' },
      { Header: 'Colaborador', accessor: 'colaborador_nomina' },
      { Header: 'Valor Total', accessor: 'valor_total_nomina' },
      {
        Header: 'Acción',
        accessor: 'id',
        Cell: (props) => this.BotonVer(props)
      },
      {
        Header: 'Acción',
        accessor: 'id',
        Cell: (props) => this.BotonConsultar(props)
      }
    ]
  }]

  BotonGenerar = () => {
    const { editarp } = this.state
    return Util.validarObjeto({editarp})
      ? <button className="btn" onClick={this.confirmar}>generar</button>
      : <button className="btn" disabled={true}>generar</button>
  }

  BotonDescartar = () => {    
    const { editarp } = this.state
    return Util.validarObjeto({editarp})
      ? <button className="btn" onClick={this.descartarDialog}>descartar</button>
      : <button className="btn" disabled={true}>descartar</button>
  }

  BotonLiquidar = () => {
    const { desde, hasta, periodo, descripcion,editarp } = this.state

    return Util.validarObjeto({ desde, hasta, periodo, descripcion,editarp })
      ? <button className="btn" onClick={this.liquidarDialog}>liquidar</button>
      : <button className="btn" disabled={true}>liquidar</button>
  }

  BotonSincronizar = () => {
    return (<button className="btn" onClick={this.sincronizar}>sincronizar</button>);
  }

  BotonVer(props) {
    const { editarp } = this.state
    return (
      Util.validarObjeto({editarp})
      ?<button className="btn" onClick={() => this.editar(props)}><span>editar</span></button>
      :<button className="btn" disabled={true}><span>editar</span></button>
    )
  };

  BotonConsultar(props) {
    return (
      <button className="btn" onClick={() => this.resumen(props)}>
        <span>ver</span>
      </button>
    )
  };


  listarContratistas = () => {
    axios.get(API.NOMINA_DESTAJO.LISTAR_CONTRATISTAS, { criterio: '' })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ contratistaJson: respuesta.data.datos });
        }
      });
  };


  async componentDidMount() {    
    this.listarContratistas();    
    const desde = this.state.desde
    const hasta = this.state.hasta
    if (Util.validarObjeto({ desde, hasta })) {
      this.consultarPeriodo()
    }
  }

  async componentDidUpdate(props, state) {

    if (state.desde !== this.state.desde ||
      state.hasta !== this.state.hasta) {

      if (Util.validarValor(this.state.desde) &&
        Util.validarValor(this.state.hasta)) {

        this.consultarPeriodo()
      }

      else this.setState({
        periodo: '-1',
        periodoJson: undefined,
      })
    }
  }

  change = ({ target: { id, value } }) => this.setState({ [id]: value })

  get deshabilitarContratista() {
    const { contratistaJson, periodico } = this.state
    return !contratistaJson || periodico
  }

  confirmar=()=>{
    const botones = [
      { texto: 'si, continuar', callback: this.generar },
      { texto: 'descartar', callback: this.cancelar },
    ];
    const mensaje='Desea generar PreLiquidación Nomina, Periodo: '+this.state.periodo
    this.setState({mensaje:mensaje,botones:botones})
    this.handleDialogo(true);
    this.renderConfirmar();
  }

  descartarDialog=()=>{
    const botones = [
      { texto: 'si, continuar', callback: this.descartar },
      { texto: 'descartar', callback: this.cancelar },
    ];
    const mensaje='Desea Descartar PreLiquidación Nomina, Periodo: '+this.state.periodo
    this.setState({mensaje:mensaje,botones:botones})
    this.handleDialogo(true);
    this.renderConfirmar();
  }

  liquidarDialog=()=>{
    const botones = [
      { texto: 'si, continuar', callback: this.liquidar },
      { texto: 'descartar', callback: this.cancelar },
    ];
    const mensaje='Desea Liquidar la Nomina, Periodo: '+this.state.periodo
    this.setState({mensaje:mensaje,botones:botones})
    this.handleDialogo(true);
    this.renderConfirmar();
  }


  cambiarPeriodo = async ({ target: { value } }) => {   
    this.setState({periodo:value}) 
    const {periodoJson } = this.state;                
    const unidad = periodoJson.find(unidad => unidad.id == value);
    
    const desde = unidad.ppeMinvalue
    const hasta = unidad.ppeMaxvalue
    if(unidad.ppEstadoNomina==='P'){
      this.setState({editarp:true})
    }else{
      this.setState({editarp:''})
    }

    const formatterPeso = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });


    let lista = await Peticion.post({
      url: API.NOMINA_DESTAJO.BUSCAR_PRELIQUIDACION,
      parametros: {
        fechaDesde: desde,
        fechaHasta: hasta,
        lndEstado:unidad.ppEstadoNomina
      }
    });

    if (!lista.length) {

      const parametros = {
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }

      await this.setState({ lista: [] })
      toast.error('Nominación no encontrada', parametros)
    }
    

    else {
      lista = lista.map(function (dato) {
        return {
          periodo_nomina:dato.periodo,
          cargo_nomina:dato.cargo,
          cedula_nomina:dato.cedula, 
          colaborador_nomina:dato.colaborador,  
          contrato_nomina:dato.contrato,
          valor_total_nomina:formatterPeso.format(dato.valorTotal),         
          generar: false,
        }
      });

      await this.setState({ lista, periodico: true })
    }

    await this.setState({ periodo: value })
  }

  consultarPeriodo = () => {  
    const parametros= {
      ppeMinvalue: this.state.desde,
      ppeMaxvalue: this.state.hasta
    };
    axios.post(API.NOMINA_DESTAJO.CONSULTAR_PERIODO, parametros)
        .then(respuesta => {
          const data = respuesta.data;
          data.forEach(unidad => {
              unidad.id = unidad.ppeMinvalue + ' hasta ' + unidad.ppeMaxvalue;
              unidad.texto = unidad.ppeMinvalue + ' hasta ' + unidad.ppeMaxvalue;
          });
            this.setState({ periodoJson: data });
        });     
  }

  descartar = async () => {

    const {periodo,periodoJson } = this.state;                
    const unidad = periodoJson.find(unidad => unidad.id == periodo);

    await Peticion.post({
      url: API.NOMINA_DESTAJO.DESCARTAR_LIQUIDACION,
      parametros: {
        fechaDesde: unidad.ppeMinvalue,
        fechaHasta: unidad.ppeMaxvalue        
      }
    });
    
    this.cancelar()
  }

  editar = async ({ original, index }) => {
    await this.handleEdicion(true)
    await this.setState({ editable: { index, ...original } })
  }
  
  resumen = async ({ original, index }) => {
    await this.handleResumen(true)
    await this.setState({ editable: { index, ...original } })
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

  generar = async () => {
    const {periodo,periodoJson } = this.state;                
    const unidad = periodoJson.find(unidad => unidad.id == periodo);

    const formatterPeso = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });

    let lista = await Peticion.post({
      url: API.NOMINA_DESTAJO.BUSCAR_LIQUIDACION,
      parametros: {
        fechaDesde: unidad.ppeMinvalue,
        fechaHasta: unidad.ppeMaxvalue,        
      }
    });

    if (!lista.length) {    
      const parametros = {
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
      await 
          this.setState({ lista, editarp: false })
          this.handleDialogo(false)
      toast.error('Nominación no encontrada', parametros)
      return
    }

    lista = lista.map(function (dato) {
      return {
          periodo_nomina:dato.periodo,
          cargo_nomina:dato.cargo,
          cedula_nomina:dato.cedula, 
          colaborador_nomina:dato.colaborador,  
          contrato_nomina:dato.contrato,
          valor_total_nomina:formatterPeso.format(dato.valorTotal),    
          generar: true
      }
    })

    this.setState({ lista, editarp: false })
    this.handleDialogo(false)
  }

  liquidar = () => {
    const {periodo,periodoJson } = this.state;                
    const unidad = periodoJson.find(unidad => unidad.id == periodo);

    axios.post(API.NOMINA_DESTAJO.LIQUIDAR, {
      fechaDesde: unidad.ppeMinvalue,
      fechaHasta: unidad.ppeMaxvalue,      
      observaciones: this.state.descripcion,
    }).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        this.cancelar();
      }
    });

    this.setState({ editarp: false })
    this.handleDialogo(false)
  }

  sincronizar = () => {    
    var hoy = new Date();
    var fecha = this.state.desde;
    Peticion.post({
      url: API.NOMINA_DESTAJO.SINCRONIZAR,
      parametros: {
        fechaSincronizacion: `${fecha}`        
      },
    });
  }

  handleDialogo = (valor) => {
    if (valor == undefined) valor = !this.state.dialogoModal
    this.setState({ dialogoModal: valor })
  }

  handleEdicion = (valor) => {
    if (valor == undefined) valor = !this.state.edicionModal
    return this.setState({ edicionModal: valor })
  }

  handleResumen = (valor) => {
    if (valor == undefined) valor = !this.state.resumenModal
    return this.setState({ resumenModal: valor })
  }

  cancelar = () => {
    this.limpiarCampos()
    this.handleDialogo(false) 
  }

  limpiarCampos = () => {
    this.setState({
      desde: '',
      hasta: '',
      contratista: '-1',
      descripcion: '',
      lista: [],
    })
  }
  
  /**
   * Boton Confirmar Generacion de la  liquidacion
   */
  renderConfirmar = () => {    
    return(
      <VentanaDialogo
        titulo="Confirmación"
        texto={this.state.mensaje}
        mostrar={this.state.dialogoModal}
        botones={this.state.botones}
      />
    );
  };  

  render() {
    const {BotonGenerar, BotonDescartar, BotonLiquidar,BotonSincronizar} = this

    return (
      <React.Fragment>
        <VentanaDialogo
          titulo="Confirmación"
          texto="¿Confirma transacción?"
          mostrar={this.state.dialogoModal}
          botones={this.botones}
        />

        <Edicion
          mostrar={this.state.edicionModal}
          cerrarModal={this.handleEdicion}
          finalizarEdicion={this.finalizarEdicion}
          contratistaJson={this.state.contratistaJson}
          editable={this.state.editable}
        />

        <Resumen
          mostrar={this.state.resumenModal}
          cerrarModal={this.handleResumen}
          finalizarEdicion={this.finalizarResumen}        
          editable={this.state.editable}
        />

        <h1>Liquidación nomina destajo</h1>

        <div className="d-flex justify-content-center btn-group">
       
          <BotonDescartar />
          <BotonSincronizar />
          <BotonLiquidar />
          <button className="btn" onClick={this.limpiarCampos}>limpiar</button>
        </div>

        <div className="contenedor formulario">
          <Input
            id="desde"
            type="date"
            label="desde"
            value={this.state.desde}
            onChange={this.change}
            required={true}
            extra={{
              //disabled: this.state.periodico
            }}
          />

          <Input
            id="hasta"
            type="date"
            label="hasta"
            value={this.state.hasta}
            onChange={this.change}
            required={true}
            extra={{
              //disabled: this.state.periodico
            }}
          />

          
          <Combo
            propTexto="texto"
            propValor="id"
            id="periodo"
            label="periodo"
            value={this.state.periodo}
            opciones={this.state.periodoJson}
            onChange={this.cambiarPeriodo}
          />  

          <Input
            id="descripcion"
            type="text"
            label="descripcion"
            value={this.state.descripcion}
            onChange={this.change}
            required={true}
            extra={{
              //disabled: this.state.periodico
            }}
          />
          <div className="botones">
            <BotonGenerar />
          </div>
        </div>

        <div className="contenedor">
          <Tabla
            datos={this.state.lista}
            columnas={this.columnas}
          />
        </div>
        {this.renderConfirmar()}
      </React.Fragment>
    )
  }
}

// redux

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch)
}

const VistaRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(NominaDestajo)

export { VistaRedux as RNominaDestajo }
