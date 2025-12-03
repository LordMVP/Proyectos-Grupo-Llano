import React, { Component } from 'react'
import { Tabla, Util } from 'appfuture-react'
//Componentes Modal
import Modal from '../../Assets/componentes/Modal'
import { SelectorMultiple } from '../../utils/SelectorMultiple';


/**
 *
 *
 * @class UnidadResponsable
 * @extends {Component}
 */
class UnidadResponsable extends Component {
  //Inicialización de variables
  /**
    *Define estados iniciales
    * @memberof UnidadResponsable
    */
  state = {
    lista: [],
    idUnidadResponsable: '-1',
    unidadResponsableJson: this.props.value || [],
  }

  /**
   * Realiza las consultas previas para listar los elementos que irán en los combobox
   * @method
   * @param {Object} prepProps - Cargar atributos del componente
   * @async
   */

  componentDidUpdate(prevProps) {
    //actualiza la lista de unidades responsables
    if (this.props.value !== prevProps.value) {
      this.setState({
        unidadResponsableJson: this.props.value,
        lista: [],
      })
    }
    //actualiza la tabla
    if (this.props.lista !== prevProps.lista) {
      this.setState({
        lista: this.props.lista,
      })
    }
    //Restablece los valores
    if (this.props.limpieza !== prevProps.limpieza) {
      if (this.props.limpieza) {
        this.setState({
          UnidadResponsable: '-1',
          lista: [],
        })
        this.props.onChange({
          target: { id: 'limpieza', value: false },
        })
      }
    }
  }

  //Arreglo con los id y nombre de columnas para el componente Tabla

  columnas = [
    {
      Header: 'Unidad responsable',

      columns: [
        { Header: 'Ítem', accessor: 'item' },
        { Header: 'Unidad', accessor: 'idUnidadResponsable' },
        {
          Header: 'Acción',
          accessor: 'id',
          Cell: (props) => (
            <button
              className="btn"
              onClick={(e) => this.remover(props.index)}>
              -
                        </button>
          ),
        },
      ],
    },
  ];

  obtenerListaSeleccionados = () => {
    const listaUnidades = Util.validarArreglo(this.props.listaUnidades) ? this.props.listaUnidades : [];
    return listaUnidades.filter(item => item.seleccionado);
  };

  /**
   *
   *Habilita el botón agregar
   *@method
   *@param {Object} props
   *@return {JSX} Componente - Button
   */

  BotonAgregar = (props) => {
    const lista = this.obtenerListaSeleccionados();

    return Array.isArray(lista) && lista.length > 0 ? (
      <button className="btn" onClick={this.agregar}>
        agregar
            </button>
    ) : (
        <button className="btn" disabled={true}>
          agregar
            </button>
      )
  }

  /**
   * Cambia el valor del estado asociado a cada componente
   * @method
   * @async
   * @param {int} id al nombre del estado que se desea modificar
   * @param {(int|string)} value del componente correspondiente al dato
   * que se visualizará en el componente
   */

  change = ({ target: { id, value } }) => {
    this.setState({ [id]: value })
  }

  /**
   * Agrega una nueva fila a la tabla. Evaluando previamente que la información no este repetida.
   * @method
   */

  agregar = () => {
    const seleccionados = this.obtenerListaSeleccionados();
    const lista = this.state.lista;
    seleccionados.forEach(item => {
      if (this.state.lista.findIndex(temp => temp.id == item.id) < 0) {
        lista.push({
          item: lista.length + 1,
          ...item,
          idUnidadResponsable: item.texto
        });
      }
    });
    this.setState({ lista });
    this.props.onChange({
      target: { id: 'listaUnidadResponsable', value: lista },
    })
  }

  agregarRelacion = (idUnidadResponsable) => {
    //filtra la información sí es duplicada
    const filtrar = this.state.lista.map((fila) => {
      return fila.idUnidadResponsable == idUnidadResponsable
        ? true
        : false
    })

    //Al encontrar alguna coincidencia despliega el modal
    if (filtrar.includes(true)) {
      this.setState({
        titulo: '¡INFORMACIÓN REPETIDA!',
        texto:
          'El contratista y la unidad responsable ya están asociados.',
      })
      //despliega modal
      this.setState({ mostrar: true })
    } else {
      let lista = [...this.state.lista, { idUnidadResponsable }]
      lista.map((fila, index) => {
        fila.item = index + 1
      })

      this.setState({ lista });

      this.props.onChange({
        target: { id: 'listaUnidadResponsable', value: lista },
      })
    }
  }

  /**
   * Elimina la fila seleccionada en la tabla
   * @method
   * @param {int} index -Índice que corresponde al número de la fila que se desea eliminar
   */

  remover = (index) => {
    const item = this.state.lista[index];
    const unidadResponsable = this.props.listaUnidades.map((u) => {
      if (u.id == item.id) {
        u.seleccionado = false;
      }
      return u;
    });
    let lista = this.state.lista.filter((a, b) => index !== b);

    lista.map((fila, index) => {
      fila.item = index + 1
    })

    this.setState({ lista })
    this.props.onChange({
      target: { id: 'listaUnidadResponsable', value: lista },
    });
    this.props.onChange({
      target: { id: 'unidadResponsable', value: unidadResponsable }
    });
  }

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
        <SelectorMultiple
          titulo='Unidades Responsables'
          tituloPersonalizado='Seleccione las Unidades responsables'
          propTexto='texto'
          propValor='id'
          lista={this.props.listaUnidades}
          seleccionarItem={this.props.seleccionarItem}
        />
        <div className="contenedor">
          <this.BotonAgregar />
        </div>

        <div className="contenedor">
          <Tabla datos={this.props.lista} columnas={this.columnas} />
        </div>
      </React.Fragment>
    )
  }
}

export default UnidadResponsable
