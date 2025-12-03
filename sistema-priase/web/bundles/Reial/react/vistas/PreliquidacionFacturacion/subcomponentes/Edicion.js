import React, { Component } from 'react'
import { Combo, Input, VentanaModal,Tabla,VentanaDialogo } from 'appfuture-react'
import { toast } from 'react-toastify';
import Modal from '../../Assets/componentes/Modal'
import API from '../../../global/rutas_api'
import Peticion from '../../../global/peticion'
import Util from '../../../global/util'
import axios from 'axios';

class Edicion extends Component {
  state = {
    lista:[],
    listaDatos:[],
    dialogoModal: false,
    idLiquidacion:0,     
    cantidad:'',    
    actualizar:0,
    suscriptor:'',
    histLiquidacionJson:[],
    consultar:true
  }

  // Tabla de liquidaciones
  columnas = [{
    Header: 'Preliquidacion Suscriptor',
    columns: [
      {
        Header: 'Suscriptor',
        accessor: 'suscriptor',
      },
      {
        Header: 'Concepto',
        accessor: 'concepto',
      },

      {
        Header: 'Cantidad',
        accessor: 'cantidad',
      },

      {
        Header: 'Nombre',
        accessor: 'material',
      },

      {
        Header: 'Valor',
        accessor: 'valor',
      },
      {
        Header: 'Acción',
        accessor: 'id',
        Cell: (props) => this.BotonEditar(props)
      }, 
      {
        Header: 'Acción',
        accessor: 'id',
        Cell: (props) => this.BotonEliminar(props)
      } 
      /*{
        Header: 'Acción',
        accessor: 'id',
        Cell: (props) => this.BotonVer(props)
      },   */   
    ]
  }]


  /**
   * Crear  el boton en la tabla
   * @param {*} props 
   */
  /*BotonVer(props) {
    return (
      <button className="btn" onClick={() => this.marcar(props)}>
        <span>+</span>
      </button>
    )
  };*/

  BotonEliminar(props) {
    return (
      <button className="btn" onClick={() => this.marcar(props)}>
        <span>eliminar</span>
      </button>
    )
  };


  BotonEditar(props) {
    return (
      <button className="btn" onClick={() => this.editar(props)}>
        <span>editar</span>
      </button>
    )
  };

  //Marcar un concepto para  eliminar
  marcar = async ({ original, index }) => {
    await this.setState({ idLiquidacion:original.id})    
    await this.setState({ marcado: index })  
    await this.setState({ cantidad:0})
    await this.setState({ accion:'E'})
    this.handleDialogo(true)
    this.renderConfirmar();
  }

  editar = async ({ original, index }) => {
    await this.setState({ idLiquidacion:original.id})   
    await this.setState({ cantidad:original.cantidad})
    await this.setState({ marcado: index })   
  }

  handleDialogo = (valor) => {
    if (valor == undefined) valor = !this.state.dialogoModal
    return this.setState({ dialogoModal: valor })
  }

  renderConfirmar = () => {
    const botones = [
      { texto: 'si, continuar', callback: this.confirmar },
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

  confirmar = () => {
    const { marcado} = this.state
    let cantidad = this.state.cantidad;
    let accion = this.state.accion;
  
    if(cantidad === ''){
      this.setState({
        titulo: '¡EDITAR CONCEPTO!',
        texto: `Debe Ingresar Cantidad !!`,
      })
      this.setState({ mostrar: true })
    }else{
      if (marcado !== -1) {
        if(accion === 'E'){
          this.eliminarConcepto(); 
        }else{
          this.actualizarLiquidacion();        
        }        
      }      
    }
    
    this.handleDialogo(false)
  }

  descartar = () => {
    this.setState({actualizar:0})
    this.setState({ marcado: -1 })
    this.handleDialogo(false)
  }

  eliminarLiquidacion = () => {
    const obj = this.datosConsulta();
    axios.post(API.PRELIQUIDACION_FACTURACION.ELIMINAR_LIQS, obj)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
           this.cancelar();
           toast.error('Se elimino correctamente','');
        }         
      });
  };

  actualizarLiquidacion = () => {
    const obj = this.datosConsulta();
    axios.post(API.PRELIQUIDACION_FACTURACION.ACTUALIZAR_LIQUIDACION, obj)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
           toast.info('Se actualizo correctamente','');
           this.listarHistoricoConceptos(this.state.idLiquidacion);
        }         
      });
  };

  eliminarConcepto = () => {
    const obj = this.datosConsulta();
    axios.post(API.PRELIQUIDACION_FACTURACION.ELIMINAR_LIQS, obj)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
           toast.info('Se actualizo correctamente','');
           this.listarHistoricoConceptos(this.state.idLiquidacion);
        }         
      });
  };

  listarHistoricoConceptos = (liquidacion) => {
    const obj = {"idLiquidacion": liquidacion};
    axios.post(API.PRELIQUIDACION_FACTURACION.CAMBIOS_LIQUIDACION_SUSCRIPTOR,obj)
    .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ histLiquidacionJson: respuesta.data.datos });
        }
      });
  };

  datosConsulta = () =>{
    const obj = {      
      "fechaFin": '',
      "codigoEmpresa": '',
      "codigoSuscriptor": this.state.suscriptor,
      "idLiquidacion": this.state.idLiquidacion,
      "concepto": this.state.liquidacionJson[this.state.marcado].uniConcepto,
      "cantidad": this.state.cantidad,
      "valor":''
    };
    return obj;
  };

  
  change = async ({ target: { id, value } }) => {
    await this.setState({ [id]: value })  
  }

  //Actualiza cuando se carga  el Dialogo Edicion
  async componentDidUpdate(props) {
    if ((props.liquidacionJson !== this.props.liquidacionJson)) {
      this.setState({histLiquidacionJson:[]})
      this.setState({cantidad:''})

      await this.setState({liquidacionJson: this.props.liquidacionJson})
      await this.setState({suscriptor:this.props.editable.suscriptor})
      await this.valoresTabla();
      await this.listarHistoricoConceptos(this.props.idLiquidacion);
    }
  }

  //Mostrar datos en la tabla
  valoresTabla = () => {

    const formatterPeso = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });

    let codsuscriptor = this.state.suscriptor; 
    let lista = this.props.liquidacionJson;
    lista = lista.map(function (dato) {
      return {  
          suscriptor:codsuscriptor,        
          valor:formatterPeso.format(dato.valor),
          material:dato.material, 
          cantidad:dato.cantidad,  
          concepto:dato.concepto,
          id:dato.idLiquidacion
      }
    })

    this.setState({ listaDatos: lista });
  }

  cancelar = async() => {
    await this.setState({consultar:false});
    await this.limpiarCampos();
    this.props.cerrarModal(false);
  }

  guardar = () => {
    this.setState({actualizar:1})
    this.handleDialogo(true)
    this.renderConfirmar();
  }

  limpiarCampos = () => {
    this.setState({
      marcado:-1,
      idLiquidacion:0,    
      lista:[],            
      cantidad:'',            
      actualizar:0,
      histLiquidacionJson:[]
    })
  }

  /*cerrarModal = () => {
    this.setState({ mostrar: false });
  };  
  botones = [{ texto: 'Cerrar', callback: this.cerrarModal, index: 2 }]*/

  renderTablaCambios = () => {
    const formatterPeso = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });

    if (!Util.validarArreglo(this.state.histLiquidacionJson)) {
      return null;
    }
    return (
      <table className='table table-hover table-condensed table-striped table-bordered'>
        <thead className='bg-dark text-white'>
          <tr>
            <th>Concepto</th>
            <th>Cantidad</th>
            <th>Nombre</th>
            <th>Valor</th>
            <th>Estado</th>
            <th>Fecha Cambio</th>
            <th>Usuario Cambio</th>            
          </tr>
        </thead>
        <tbody>
          {
            this.state.histLiquidacionJson.map(liquidacion => {
              return (
                <tr key={liquidacion.idAuditoria}>
                  <td>{liquidacion.concepto}</td>
                  <td>{liquidacion.cantidad}</td>
                  <td>{liquidacion.material}</td>
                  <td>{formatterPeso.format(liquidacion.valor)}</td>
                  <td>{liquidacion.estado}</td>
                  <td>{liquidacion.fecha}</td>
                  <td>{liquidacion.usuario}</td>                  
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  };

  render() {

    return (
      <React.Fragment>        
        <VentanaModal        
          titulo="Edición de liquidación"
          mostrar={this.props.mostrar}
          cerrarModal={this.cancelar}>

        <Modal
          titulo={this.state.titulo}
          texto={this.state.texto}
          mostrar={this.state.mostrar}
          ocultarAlerta={this.change}
          botones={this.botones}
        />  

          <div className="contenedor">
            <Tabla
              datos={this.state.listaDatos}
              columnas={this.columnas}
            />
          </div>

          <div className="contenedor">
            <div className="formulario">  
                <Input
                    id="cantidad"
                    label="cantidad liquidar"
                    type="number"
                    value={this.state.cantidad}                
                    onChange={this.change}
                />            

                <button className="btn" onClick={this.guardar}>
                  <span>Liquidar</span>
                </button>
              </div>
          </div>
          
          <div className="contenedor btn-group">            
            <button className="btn" onClick={this.cancelar}>
              <span>finalizar</span>
            </button>
          </div>

          <div className='row mt-5'>
            <div className='col-12'>
              {this.renderTablaCambios()}
            </div>
          </div>

          {this.renderConfirmar()}          
        </VentanaModal>
      </React.Fragment>
    )
  }
}

export default Edicion