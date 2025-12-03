import React, { Component } from 'react'
import { Combo, Tabla } from 'appfuture-react'

import axios from 'axios'
import URL from '../../../global/rutas_api'
import Peticion from '../../Assets/util/peticion'
import Autocompletado from '../../Assets/componentes/Autocompletado'
import { Util } from '../../Assets/util/Util'
import Modal from '../../Assets/componentes/Modal'
import { SelectorMultiple } from '../../utils/SelectorMultiple';
import { isRegExp } from 'util';

/**
 *
 *
 * @class Actividades
 * @extends {Component}
 */
class Actividades extends Component {
  //inicialización de variables

	/**
     *Define estados iniciales
     * @memberof Actividades
     */
  state = {
    lista: this.props.listaTabla.length || [],
    actividadJson: this.props.value || [],
    actividad: '-1',
  }

  peticion = new Peticion(this)

  /**
   *
   *
   * @method
   * @param {array} lista - construir lista de la tabla actividades
   */
  construir = (lista) => {
    if (lista.length == 0) {
      lista = [];
    }
    if (lista.length > 0) {
      lista.forEach(elemento => {
        elemento.seleccionado = true;
      });
    }
    this.setState({ lista: lista });
  };

  componentDidMount() {
    this.construir(this.props.listaTabla);
  }

  columnas = [
    {
      Header: 'Municipio - Sector',
      columns: [
        { Header: 'Empresa Contratante', accessor: 'contratista' },
        { Header: 'Unidad responsable', accessor: 'unidadResponsable' },
        { Header: 'Proceso', accessor: 'proceso' },
        { Header: 'Actividad', accessor: 'actividad' },
        {
          Header: 'Acción',
          accessor: 'id',
          Cell: (props) => (
            <button onClick={(e) => this.remover(props)}>
              eliminar
                        </button>
          )
        }
      ]
    }
  ]

  /**
   * Realiza las consultas previas para listar los elementos que irán en los combobox
   * @method
   * @param {Object} prepProps - Cargar atributos del componente
   * @async
   */
  componentDidUpdate(prepProps) {
    if (this.props.value !== prepProps.value) {
      this.setState({ actividadJson: this.props.value })
    }
    if (this.props.listaTabla !== prepProps.listaTabla) {
      this.setState({ lista: this.props.listaTabla })
    }
    if (this.props.limpiezaActividad !== prepProps.limpiezaActividad) {
      if (this.props.limpiezaActividad) {
        this.setState({
          lista: [],
          actividad: '-1',
        })
      }
      this.props.onChange({
        target: { id: 'limpiezaActividad' },
        value: false,
      })
    }

    if (JSON.stringify(this.state.lista) != JSON.stringify(this.props.listaTabla)) {
      this.construir(this.props.listaTabla);
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
   * Método encargado de agregar una nueva actividad a la tabla
   * @method
   * @async
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  seleccionarItem = async (evento) => {
    const lista = [...this.state.lista];
    const { proceso, unidadResponsable, contratista } = this.props
    const actividades = this.state.actividadJson;
    const control = evento.target;
    const value = control.value;
    const index = actividades.findIndex(c => c.id == value);
    actividades[index].seleccionado = control.checked;
    actividades[index].contratista = contratista;
    actividades[index].unidadResponsable = unidadResponsable;
    actividades[index].proceso = proceso;
    actividades[index].actividad = evento.target.value;
    if (control.checked == true) {
      lista.push(actividades[index]);
    }
    if (control.checked == false) {
      const indexLista = lista.findIndex(a => a.id == value);
      lista.splice(indexLista, 1);
    }
    this.props.onChange({
      target: { id: 'listaTabla', value: lista },
    });
  };

  /**
   * Método encargado de obtener los objetos seleccionados en la lista de actividades
   * @method
   * @returns {Array}
   */
  obtenerLista = () => {
    if (!Array.isArray(this.state.lista) || this.state.lista.length == 0) {
      return [];
    }
    return this.state.lista.filter(a => a.seleccionado == true);
  }

  /**
   * Método encargado de mostrar la tabla con actividades
   * @returns {jsx} Tabla - Componente tipo tabla
   */
  renderTabla = () => {
    if (this.state.lista.length == 0) {
      return <div className='text-center'>Sin resultados</div>;
    }
    return (
      <Tabla
        datos={this.obtenerLista()}
        columnas={this.columnas}
      />
    );

  }
  /**
   * Elimina la fila seleccionada en la tabla
   * @async
   * @method
   * @param {int} props- Índice que corresponde al número de la fila que se desea eliminar
   */
  remover = async (props) => {
    const actividadJson = this.state.actividadJson;
    const lista = this.state.lista;
    const indexActividades = actividadJson.findIndex(a => a.id == props.row._original.id);
    lista.splice(props.index, 1);
    actividadJson[indexActividades].seleccionado = false;
    await this.setState({
      lista: lista,
      actividadJson: actividadJson
    });
    this.props.onChange({ target: { id: 'listaActividad', value: lista } });
  }

  /**
   * Valida que un valor sea diferente de vacio o -1.
* @return {Boolean}
    */
  validarValor = (valor) => {
    return !valor || valor == '' || valor == '-1';
  }

  validarCampos = () => {
    const { proceso } = this.props;
    const validacion = this.validarValor(proceso);
    return validacion;
  };

  /**
   *Renderiza la vista
   * @return {JSX} componente - returna vista jsx
   */
  render() {
    return (
      <React.Fragment>
        <Modal
          titulo={this.state.titulo}
          texto={this.state.texto}
          mostrar={this.state.mostrar}
          ocultarAlerta={this.change}
          botones={this.botones}
        />
        <div className="fila">
          <SelectorMultiple
            titulo='Actividades:'
            propTexto='texto'
            propValor='id'
            disabled={this.validarCampos()}
            lista={this.state.actividadJson}
            seleccionarItem={this.seleccionarItem}
          />
        </div>
        <div className="contenedor">
          {
            this.renderTabla()
          }
        </div>
      </React.Fragment>
    )
  }
}

export default Actividades
