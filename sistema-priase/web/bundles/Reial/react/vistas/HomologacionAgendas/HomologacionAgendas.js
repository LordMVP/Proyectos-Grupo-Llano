import React, { Component } from 'react'
import { Combo, Input, Tabla, VentanaDialogo, Fragment, TextoNumerico, VentanaModal } from 'appfuture-react'
import PropTypes from 'prop-types';
import { mostrarAlerta } from '../../store/actions/AplicacionAcciones';
import Util from '../../global/util';
import API from '../../global/rutas_api';
import Peticion from '../../global/peticion';
import { toast } from 'react-toastify';
// redux
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import "./HomologacionAgendas.scss";

/**
 *
 *
 * @class HomologacionAgendas
 * @extends {Component}
 */
class HomologacionAgendas extends Component {

	/**
     *Define estados iniciales
     * @memberof HomologacionAgendas
     */
  state = {
    lista: [],
    dialogoModal: false,
    modalConsultaHomologar: false,
    // defecto

    identificador: '',
    producto: '',
    destino: '',
    areaNegocio: '',
    tipoOperacion: '',
    sucursalEmisionFactura: '',
    centroCosto: '',
    nivelAgrupamiento: '',

    empresa: '-1',
    contratista: '-1',
    agenda: '-1',
  }

  columnas = [
    {
      Header: 'Homologación agendas',

      columns: [
        {
          Header: 'Agenda',
          accessor: 'codAgenda',
        },

        {
          Header: 'Producto',
          accessor: 'ghagsevProductoseven',
        },

        {
          Header: 'Destino',
          accessor: 'ghagsevDestinoseven'
        },

        {
          Header: 'Acción',
          accessor: 'id',
          Cell: ({ original }) => {
            const editar = () => {
              this.setState({
                identificador: original.ghagsevIderegistro,
                producto: original.ghagsevProductoseven,
                destino: original.ghagsevDestinoseven,
                areaNegocio: JSON.parse(original.ghagsevAreanegocioseven),
                tipoOperacion: original.ghagsevTipooperacionseven,
                sucursalEmisionFactura: original.ghagsevSurcursalemisionfacturaseven,
                centroCosto: original.ghagsevCentrocostosseven,
                nivelAgrupamiento: original.ghagsevNivelagrupamientoseven,
                contratista: original.conIdecontra,
                modalConsultaHomologar: false
              })
            }

            return (
              <div className="d-flex justify-content-center btn-group">
                <button className="btn" onClick={editar}>
                  <span>editar</span>
                </button>
              </div>
            )
          }
        }
      ]
    }
  ]

	/**
     *
     *Habilita el botón buscar
     *@method
     *@return {JSX} Componente - Button
     */
  BotonBuscar = () => {
    const { agenda, producto, empresa, contratista } = this.state

    /* prettier-ignore */

    return Util.validarObjeto({ agenda, empresa, contratista })
      ? <button className="btn" onClick={this.buscar}>buscar</button>
      : <button className="btn" disabled={true}>buscar</button>
  }

  /**
   *
   *Despliega
   *@method
   *@return {JSX} Componente - Modal
   */
  BotonAbrirModal = () => {
    return (<button className="btn" onClick={this.abrirCerrarModal}>Consultar</button>)
  }

  /**
   *
   *Habilita el botón cancelar
   *@method
   *@return {JSX} Componente - Button
   */
  BotonCancelar = () => {
    const { dialogoModal, identificador, ...estado } = this.state

    /* prettier-ignore */

    return Util.validarObjeto(estado)
      ? <button className="btn" onClick={this.limpiarCampos}>cancelar</button>
      : <button className="btn" disabled={true}>cancelar</button>
  }

  /**
   *
   *Habilita el botón guardar
   *@method
   *@return {JSX} Componente - Button
   */
  BotonGuardar = () => {
    const { dialogoModal, identificador, ...estado } = this.state
    const { agenda, empresa, contratista, producto, destino, tipoOperacion, sucursalEmisionFactura, centroCosto, nivelAgrupamiento, areaNegocio } = this.state;
    const texto = Util.validarValor(identificador) ? 'editar' : 'guardar'

    /* prettier-ignore */

    return Util.validarObjeto({ agenda, empresa, contratista, producto, destino, tipoOperacion, sucursalEmisionFactura, centroCosto, nivelAgrupamiento, areaNegocio })
      ? <button className="btn" onClick={this.handleDialogo}>{texto}</button>
      : <button className="btn" disabled={true}>{texto}</button>
  }

	/**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     */

  componentDidMount() {
    // empresaJson

    Peticion.post({
      url: API.HOMOLOGACION_AGENDAS.LISTAR_EMPRESAS,
      config: {
        valor: 'empresaCod',
        texto: 'empresaNom',
      },
      callback: empresaJson => this.setState({ empresaJson }),
    })

    // contratistaJson

    Peticion.post({
      url: API.HOMOLOGACION_AGENDAS.LISTAR_CONTRATISTAS,
      config: {
        valor: 'empresaCod',
        texto: 'empresaNom',
      },
      callback: contratistaJson => this.setState({ contratistaJson }),
    })
  }

  /**
   * Realiza las consultas previas para listar los elementos que irán en los combobox
   * @method
   * @param {Object} props - Cargar atributos del componente
   */
  componentDidUpdate(props, state) {
    // agendaJson

    if (state.empresa !== this.state.empresa) {
      if (Util.validarValor(this.state.empresa)) {
        this.obtenerAgendas()
      }

      else this.setState({
        agenda: '-1',
        agendaJson: undefined
      })
    }
  }

  /**
   * Cambia el valor del estado asociado a cada componente
   * @method
   * @async
   * @param {int} id al nombre del estado que se desea modificar
   * @param {(int|string)} value del componente correspondiente al dato
   * que se visualizará en el componente
   */
  change = ({ target: { id, value } }) => this.setState({ [id]: value })

	/**
	 *
	 *Buscar valor de manera dinámica al escoger código agenda, empresa y contratista
	 * @async
	 * @method
	 *
	 */
  buscar = async () => {
    const { producto } = this.state;
    let lista = await Peticion.post({
      url: API.HOMOLOGACION_AGENDAS.AGENDA_HOMOLOGADA,
      parametros: {
        codAgenda: Util.obtenerId(this.state.agenda),
        ghagsevProductoseven: (typeof producto === 'string' && producto.trim()) ? producto : null,
        empresaCodempresa: this.state.empresa,
        conIdecontra: this.state.contratista
      }
    });

    if (!lista.length) {
      //no hay datos
      let opciones = {
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      };

      toast.error('Homologación no encontrada', opciones)
      return
    }

    this.setState({ lista });
  }

  /**
   * Método encargado de validar la tabla de área de servicio
   * @method
   */
  validarTabla = () => {
    const lista = this.state.areaNegocio;
    let contador = 0;
    for (let i = 0; i < lista.length; i++) {
      const area = lista[i];
      if (!area.codigo || area.codigo === '') {
        return { respuesta: false, mensaje: "Debe ingresar un valor para el codigo" };
      }

      if (!area.nombre || area.nombre === '') {
        return { respuesta: false, mensaje: "Debe ingresar un valor para el nombre" };
      }

      if (!area.porcentaje || area.porcentaje === '') {
        return { respuesta: false, mensaje: "Debe ingresar un valor para el porcentaje" };
      }
      contador += parseInt(area.porcentaje);
    };
    if (contador != 100) {
      return { respuesta: false, mensaje: "La sumatoria de los porcentajes debe ser del 100%" };
    }
    return { respuesta: true };
  };

	/**
	 *
	 * Permite guardar la homologación de agendas
	 * @method
	 * 
	 */
  guardar = () => {
    const validar = this.validarTabla();
    if (!validar.respuesta) {
      toast.error(validar.mensaje);
      return false;
    }
    let parametros = {
      empresaCodempresa: Util.obtenerId(this.state.empresa),
      conIdecontra: Util.obtenerId(this.state.contratista),
      codAgenda: Util.obtenerId(this.state.agenda),
      ghagsevProductoseven: this.state.producto,
      ghagsevDestinoseven: this.state.destino,
      ghagsevAreanegocioseven: JSON.stringify(this.state.areaNegocio),
      ghagsevTipooperacionseven: this.state.tipoOperacion,
      ghagsevSurcursalemisionfacturaseven: this.state.sucursalEmisionFactura,
      ghagsevCentrocostosseven: this.state.centroCosto,
      ghagsevNivelagrupamientoseven: this.state.nivelAgrupamiento,
    }

    if (this.state.identificador) {
      // editar

      parametros.ghagsevIderegistro = this.state.identificador
    }

    Peticion.post({
      url: API.HOMOLOGACION_AGENDAS.HOMOLOGAR_AGENDA,
      parametros,
    })

    // final

    this.limpiarCampos()
    this.handleDialogo(false)
  }

  /**
   *
   *Despliega modal
   * @method
   */
  handleDialogo = () => {
    this.setState({ dialogoModal: !this.state.dialogoModal })
  }

  /**
   *
   * Obtiene la lista de agendas y lo almacena en el componente combobox
   * @method
   */
  obtenerAgendas = (empresa = this.state.empresa) => {
    empresa = Util.obtenerId(empresa)

    // peticion

    Peticion.post({
      url: API.HOMOLOGACION_AGENDAS.LISTAR_AGENDAS,
      parametros: {
        empresa: Util.obtenerId(this.state.empresa)
      },
      config: {
        valor: 'agendaCod',
        texto: 'agendaNom',
      },

      callback: agendaJson => this.setState({ agendaJson })
    })
  }

  /**
   *
   * Limpia formulario
   * @method
   */
  limpiarCampos = () => {
    this.setState({
      identificador: '',
      destino: '',
      areaNegocio: '',
      tipoOperacion: '',
      sucursalEmisionFactura: '',
      centroCosto: '',
      nivelAgrupamiento: '',
      sucursal: '',
      empresa: '-1',
      contratista: '-1',
      agenda: '-1',
      producto: '',
      agendaJson: undefined,
      lista: [],
    })
  }

  botones = [
    { texto: 'guardar', callback: this.guardar },
    { texto: 'cancelar', callback: this.handleDialogo },
  ]

  /**
   * Método encargado de agregar nuevas areas de servicio a la homologación
   * @param {Array} listaAreaServicio Lista de areas de servicio de la homologación
   */
  controlAgregar = (listaAreaServicio) => {
    listaAreaServicio.push({
      codigo: '',
      nombre: '',
      porcentaje: '',
    });
    this.setState({ areaNegocio: [...listaAreaServicio] });
  };

  /**
   * Método encargado de agregar nuevas areas de servicio a la homologación
   * @method
   * @param {Array} listaAreaServicio Lista de areas de servicio de la homologación
   * @param {Integer} index Posición a eliminar
   */
  controlEliminar = (listaAreaServicio, index) => {
    this.props.mostrarAlerta('Confirmación Eliminar', 'Confirmar que desea eliminar el área de servicio', [
      {
        clase: 'btn btn-danger',
        callback: () => callback(),
        texto: 'Aceptar'
      },
      {
        clase: 'btn btn-secondary',
        texto: 'Cancelar'
      }
    ]);
    const callback = () => {
      listaAreaServicio.splice(index, 1);
      this.setState({ areaNegocio: [...listaAreaServicio] });
    }
  };

  /**
   * Controla los cambios de los controles del formulario.
   * @method
   * @param {object} evento 
   */
  controlarCambioFormulario = (evento) => {
    const listaAreaServicio = [...this.state.areaNegocio];
    const nombrePropiedad = evento.target.name;
    if (nombrePropiedad == 'agregar') {
      this.controlAgregar(listaAreaServicio);
      return;
    }
    const valor = evento.target.value;
    const index = parseInt(evento.target.attributes['data-index'].value);
    if (nombrePropiedad == 'eliminar') {
      this.controlEliminar(listaAreaServicio, index);
      return;
    }
    listaAreaServicio[index][nombrePropiedad] = valor;
    this.setState({ areaNegocio: [...listaAreaServicio] });
  };

  /**
   *Renderiza la vista 
   * @return {JSX} componente - returna vista jsx 
   */
  renderFormularioAreaNegocio = () => {
    let lista = this.state.areaNegocio;
    return (
      <table className='table table-striped table-condensed table-bordered table-striped'>
        <thead className='bg bg-dark text-white'>
          <tr>
            <th className='text-center' colSpan='5'>Área de Negocio</th>
          </tr>
          <tr>
            <th className='text-center'>Código</th>
            <th className='text-center'>Nombre</th>
            <th className='text-center'>Porcentaje</th>
            <th className='text-center'>Eliminar</th>
            <th className='text-center'><button className='btnTabla' onClick={this.controlarCambioFormulario} name='agregar'>+</button></th>
          </tr>
        </thead>
        <tbody>
          {lista.length > 0 &&
            lista.map((area, index) => {
              return (
                <tr>
                  <th>
                    <TextoNumerico
                      aceptaDecimales={false}
                      aceptaNegativos={false}
                      label='Código:'
                      cols={4}
                      value={area.codigo}
                      onChange={this.controlarCambioFormulario}
                      name='codigo'
                      extra={{ 'data-index': index }}
                    />
                  </th>
                  <th>
                    <Input
                      label='Nombre:'
                      value={area.nombre}
                      onChange={this.controlarCambioFormulario}
                      name='nombre'
                      extra={{ 'data-index': index }}
                    />
                  </th>
                  <th>
                    <TextoNumerico
                      aceptaDecimales={false}
                      aceptaNegativos={false}
                      label='Porcentaje:'
                      cols={4}
                      value={area.porcentaje}
                      onChange={this.controlarCambioFormulario}
                      name='porcentaje'
                      extra={{ 'data-index': index }}
                    />
                  </th>
                  <th className='text-center'>
                    <button className='btnTabla mt-24' onClick={this.controlarCambioFormulario} data-index={index} name='eliminar'>X</button>
                  </th>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    );
  };

  /**
     * Método encargado de cerrar la ventana modal del botón de consulta
     */
  abrirCerrarModal = () => {
    this.setState({
      modalConsultaHomologar: !this.state.modalConsultaHomologar,
    });
  };

  /**
     * Método encargado de mostrar la ventana modal para agregar eventos
     * @return {Object}
     */
  renderModalEventos = () => {
    return (
      <VentanaModal
        mostrar={this.state.modalConsultaHomologar}
        cerrarModal={this.abrirCerrarModal}>
        {
          <div>
            <div className="modal-header">
              <h4 className="modal-title"><b>Homologación de Agendas</b></h4>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-center btn-group">
                <this.BotonBuscar />
              </div>
              <div className='row mt-24'>
                <Combo
                  id="empresa"
                  label="empresa"
                  value={this.state.empresa}
                  opciones={this.state.empresaJson}
                  onChange={this.change}
                  cols={6}
                />
                <Combo
                  id="contratista"
                  label="contratista"
                  value={this.state.contratista}
                  opciones={this.state.contratistaJson}
                  onChange={this.change}
                  cols={6}
                />
                <Combo
                  id="agenda"
                  label="agenda"
                  opciones={this.state.agendaJson}
                  value={this.state.agenda}
                  onChange={this.change}
                  extra={{ disabled: !this.state.agendaJson }}
                  cols={6}
                />
                <Input
                  id="producto"
                  label="producto"
                  value={this.state.producto}
                  onChange={this.change}
                  cols={6}
                />
              </div>
              <div className='contenedor'>
                {this.state.lista.length > 0 &&
                  <Tabla
                    datos={this.state.lista}
                    columnas={this.columnas}
                  />
                }
              </div>
            </div>
          </div>
        }
      </VentanaModal>
    );
  };

  render() {
    const { BotonCancelar, BotonGuardar, BotonAbrirModal } = this
    return (
      <React.Fragment>
        <VentanaDialogo
          titulo="Confirmación"
          texto="¿Confirma transacción?"
          mostrar={this.state.dialogoModal}
          botones={this.botones}
        />

        <h1>Homologación agendas - Seven</h1>
        <div className="d-flex justify-content-center btn-group">
          <BotonGuardar />
          <BotonAbrirModal />
          <BotonCancelar />
        </div>
        <div className="contenedor caja formulario">
          <Combo
            id="empresa"
            label="empresa"
            value={this.state.empresa}
            opciones={this.state.empresaJson}
            onChange={this.change}
          />
          <Combo
            id="contratista"
            label="contratista"
            value={this.state.contratista}
            opciones={this.state.contratistaJson}
            onChange={this.change}
          />
          <Combo
            id="agenda"
            label="agenda"
            opciones={this.state.agendaJson}
            value={this.state.agenda}
            onChange={this.change}
            extra={{ disabled: !this.state.agendaJson }}
          />
          <Input
            id="producto"
            label="producto"
            value={this.state.producto}
            onChange={this.change}
          />

          <Input
            id="destino"
            label="destino"
            value={this.state.destino}
            onChange={this.change}
          />

          <Input
            id="tipoOperacion"
            label="tipo operación"
            value={this.state.tipoOperacion}
            onChange={this.change}
          />

          <Input
            id="sucursalEmisionFactura"
            label="sucursal emisión factura"
            value={this.state.sucursalEmisionFactura}
            onChange={this.change}
          />

          <Input
            id="centroCosto"
            label="centro de costos"
            value={this.state.centroCosto}
            onChange={this.change}
          />

          <Input
            id="nivelAgrupamiento"
            label="nivel agrupamiento"
            value={this.state.nivelAgrupamiento}
            onChange={this.change}
          />
        </div>

        <div className="contenedor mt-24">
          {
            this.renderFormularioAreaNegocio()
          }
        </div>
        {this.renderModalEventos()}
      </React.Fragment>
    )
  }
}

// redux

HomologacionAgendas.propTypes = {
  mostrarAlerta: PropTypes.func
};

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    mostrarAlerta
  }, dispatch)
}

const VistaRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomologacionAgendas)

export { VistaRedux as RHomologacionAgendas }
