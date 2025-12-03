import React, { Component } from 'react'
import { Botonera, Captcha, Combo, Tabla, Input } from 'appfuture-react'
import axios from 'axios'
import Peticion from '../Assets/util/peticion'
import URL from '../../global/rutas_api'

import { Util } from '../Assets/util/Util'
import Modal from '../Assets/componentes/Modal'
import Autocompletado from '../Assets/componentes/Autocompletado'

import NuevaRuta from './subcomponentes/NuevaRuta'
import './RutasMunicipios.scss'
import { get as getProp } from 'object-path';

/**
 *
 *
 * @class RutasMunicipios
 * @extends {Component}
 */
class RutasMunicipios extends Component {
  //inicialización de variables

  /**
    *Define estados iniciales
    * @memberof SolicitudAgendamiento
    */
  state = {
    lista: [],
    mostrar: false,
    habilitarRuta: false,

    // defecto

    ruta: '-1',
    municipio: '-1',
    municipioJson: [],
    editar: false,
  }

  peticion = new Peticion(this)

  //Arreglo con los id y nombre de columnas para el componente Tabla

  columnas = [
    {
      Header: 'Municipios relacionados',

      columns: [
        { Header: 'Sector', accessor: 'nombreSector' },
        { Header: 'Municipio', accessor: 'municipio' },
        {
          Header: 'Acción',
          accessor: 'id',
          Cell: (props) => (
            <button onClick={(e) => this.remover(props.index)}>
              eliminar
                        </button>
          ),
        },
      ],
    },
  ]

  /**
   * Realiza las consultas previas para listar los elementos que irán en los combobox
   * @method
   * @async
   */

  async componentDidMount() {
    axios.post(URL.MUNICIPIOS_SECTORES.LISTAR_SECTORES).then(respuesta => {
      this.setState({ listaSectores: respuesta.data });
    });
    await this.peticion.post({
      url: URL.MUNICIPIOS_SECTORES.LISTAR_CIUDADES,
      config: ['ciudadCod', 'ciudadNom'],
      json: 'municipioJson',
      value: 'municipio',
    })
  }


  consultarRelacionesActuales = (municipio) => {
    if (typeof municipio == 'string' && municipio.split(' - ').length <= 1) {
      return;
    }
    axios.post(URL.MUNICIPIOS_SECTORES.CONSULTAR_SECTORES_MUNICIPIOS, {
      municipio: Util.obtenerId(municipio)
    }).then(respuesta => {
      const data = getProp(respuesta, 'data', []);
      const lista = data.map(item => {
        return {
          municipio: municipio,
          nombreSector: item.secDescripcion,
          sector: item.secIderegistro
        };
      })
      this.setState({ lista: lista });
    })
  }

  /**
   * Cambia el valor del estado asociado a cada componente
   * @method
   * @async
   * @param {int} id al nombre del estado que se desea modificar
   * @param {(int|string)} value del componente correspondiente al dato
   * que se visualizará en el componente
   */

  change = async ({ target: { id, value } }) => {
    this.setState({ [id]: value })
    if (id === 'municipio') {
      this.consultarRelacionesActuales(value);
    }
    if (id === 'nuevaRuta') {
      this.setState({ rutaJson: value })
    }
  }

  // vista
  BotonAgregar = (props) => {
    const { sector, municipio } = this.state
    return sector === '-1' || municipio === '-1' ? (
      <button disabled={true}>agregar</button>
    ) : (
        <button onClick={this.agregar}>agregar</button>
      )
  }

  /**
   *
   *Habilita el botón agregar
   *@method
   *@param {Object} props
   *@return {JSX} Componente - Button
   */
  agregar = () => {
    let { sector, municipio, nuevoSector } = this.state;
    const buscarCiudad = this.state.municipioJson.map((ciudad) =>
      ciudad.texto == municipio ? true : false
    )

    //Verificamos si el sector ya se encuentra agregado...
    const sectorEnLista = this.state.lista.find(s => (s.nombreSector == sector) || (s.sector == sector));
    if (sectorEnLista) {
      //Modal
      this.setState({
        titulo: 'Información',
        texto: `El sector ya se encuentra en la lista.`,
        mostrar: true
      });
      return;
    }

    if (!buscarCiudad.includes(true)) {
      //Modal
      this.setState({
        titulo: '¡MUNICIPIO NO ENCONTRADO!',
        texto: `El municipio que escogío no está en la lista principal`,
      });
      //Elimina si existe un segundo botón
      this.botones.length === 2 ? this.botones.shift() : null
      //despliega modal
      this.setState({ mostrar: true })
    } else {
      const idSector = (nuevoSector) ? null : sector;
      const lista = [
        ...this.state.lista,
        { idSector, nombreSector: this.obtenerNombreSector(sector), municipio, nuevo: true },
      ]
      this.setState({ lista });
    }
  }

  /**
   * Obtiene el nombre de un sector.
   * @param {number} sector
   * @return {String}
   */
  obtenerNombreSector = (sector) => {
    const { listaSectores, nuevoSector } = this.state;
    const sectorTemp = listaSectores.find(s => s.secIderegistro == sector);
    if (sectorTemp) {
      return sectorTemp.secDescripcion;
    } else if (nuevoSector) {
      this.setState({ nuevoSector: false });
      return sector;
    }
    return 'Indefinido';
  };

  /**
   * Se ejecuta al momento de pulsar sobre el botón Guardar
   * @method
   * @async
   */
  guardar = () => {
    if (this.state.lista.length <= 0) {
      //Modal
      this.setState({
        titulo: '¡FALTA INFORMACIÓN!',
        texto: `Falta escoger: Una ruta y asociarla a un municipio`,
      })
      //Elimina si existe un segundo botón
      this.botones.length === 2 ? this.botones.shift() : null
      //despliega modal
      this.setState({ mostrar: true })
    } else {
      this.setState({
        titulo: '¡ENVIAR INFORMACIÓN!',
        texto: '¿Confirma Transacción?',
        typeModal: 'guardar'
      })
      //Agrega botón
      this.botones.length === 1
        ? this.botones.unshift({
          texto: 'Aceptar',
          callback: this.guardarModal,
          index: 1,
        })
        : null
      //despliega modal
      this.setState({ mostrar: true })
    }
  }

  /**
   * Se ejecuta al momento de pulsar en  'aceptar' del modal, desplegado en la función 'guardar'.
   * Y solo ocurre al validar los campos necesarios para registrar o actualizar la información
   * @method
   */

  guardarModal = () => {
    const { lista } = this.state;
    let datoGuardar = lista.filter(item => item.nuevo).map(item => {
      return {
        secDescripcion: item.nombreSector,
        ciudadCod: {
          ciudadCod: Util.obtenerId(item.municipio)
        }
      }
    });

    axios
      .post(URL.MUNICIPIOS_SECTORES.REGISTRAR_RELACION_SECTORES, datoGuardar)
      .then((data) => {
        //limpiar formulario
        this.setState({
          lista: [],
          municipio: '-1',
          editar: false,
          mostrar: false,
          limpieza: false,
        })
      })
  }

  /**
   * Elimina la fila seleccionada en la tabla
   * @method
   * @param {int} index -Índice que corresponde al número de la fila que se desea eliminar
   */

  remover = (index) => {
    this.confirmarEliminarSector(index);
  }

  /**
   * Despliega el modal para realizar la consulta
   * @method
   */

  handleConsulta = (data) => {
    this.setState({ consultaModal: !this.state.consultaModal })
  }

  //Arreglo para emplearlo en el componente botonera, con sus respectivas funciones

  funciones = [
    { texto: 'guardar', callback: this.guardar },
  ]


  eliminarSector = (sector, index) => {
    if (!sector && index >= 0) {
      const lista = this.state.lista.filter((a, b) => index !== b);
      this.setState({ lista });
      return;
    }
    axios.post(URL.MUNICIPIOS_SECTORES.ELIMINAR_SECTOR, {
      secIderegistro: sector
    }).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        const lista = this.state.lista.filter((a, b) => index !== b);
        this.setState({
          lista,
          titulo: 'Correcto',
          texto: 'Se ha eliminado el sector.',
          mostrar: true,
          typeModal: 'alerta',
        });
      } else {
        this.setState({
          lista,
          titulo: 'Error',
          texto: 'No se pudo eliminar el sector.',
          mostrar: true,
          typeModal: 'alerta',
        });
      }
    })
  }

  confirmarEliminarSector = (index) => {
    this.setState({
      titulo: 'Confirmar',
      texto: 'Se eliminará el sector,  ¿Desea continuar?',
      mostrar: true,
      typeModal: 'confirmation',
      indexSectorEliminado: index
    });
  };

  /**
   * Cierra el modal de la consulta
   * @method
   */

  cerrarModal = () => {
    this.setState({ mostrar: false })
  }

  eliminarFila = () => {
    const { lista, indexSectorEliminado } = this.state;
    const sector = lista.find((s, i) => i == indexSectorEliminado);
    if (sector) {
      this.eliminarSector(sector.sector, indexSectorEliminado);
    }
  };

  //Arreglo para emplearlo en el componente Modal, con sus respectivas funciones

  botones = () => {
    if (!this.state.typeModal || (this.state.typeModal != 'confirmation' && this.state.typeModal != 'guardar')) {
      return [{ texto: 'Cerrar', callback: this.cerrarModal, index: 2 }];
    }

    return [{
      texto: 'Confirmar', callback: () => {
        if (this.state.typeModal == 'confirmation') {
          return this.eliminarFila();
        }
        this.guardarModal();
      }, index: 1
    }, { texto: 'Cerrar', callback: this.cerrarModal, index: 2 }];
  }

  renderSelectorSectores = () => {
    return (
      <div className='input-group-autocomplete'>
        <Combo
          opciones={this.state.listaSectores}
          propTexto='secDescripcion'
          propValor='secIderegistro'
          label='Sectores:'
          id='sector'
          value={this.state.sector}
          onChange={this.change}
        />
        <div className='input-group-btn-autocomplete'>
          <button className='btn btn-primary' onClick={() => { this.setState({ nuevoSector: true }) }}><i className='fa fa-fw fa-plus'></i></button>
        </div>
      </div>
    );
  };

  renderNuevoSector = () => {
    return (
      <div className='input-group-autocomplete'>
        <Input
          label='Nombre del sector:'
          value={this.state.sector}
          onChange={this.change}
          id='sector'
        />
        <div className='input-group-btn-autocomplete'>
          <button className='btn btn-danger' title='Cancelar' onClick={() => { this.setState({ nuevoSector: false, sector: '' }) }}><i className='fa fa-fw fa-times'></i></button>
        </div>
      </div>
    )
  };

  /**
  *Renderiza la vista
  * @return {JSX} componente - returna vista jsx
  */
  render() {
    return (
      <React.Fragment>
        <NuevaRuta
          opciones={this.state.rutaJson}
          mostrar={this.state.consultaModal}
          cerrarModal={this.handleConsulta}
          onChange={this.change}
          limpieza={this.state.limpieza}
        />
        <h1>Empresa - Relación Municipios - Sectores</h1>

        <Modal
          titulo={this.state.titulo}
          texto={this.state.texto}
          mostrar={this.state.mostrar}
          ocultarAlerta={this.change}
          botones={this.botones()}
        />

        <Botonera funciones={this.funciones} />

        <div className="caja contenedor">
          <label className="tag">Información Ruta</label>

          <div className="formulario">
            <Autocompletado
              id="municipio"
              label="Municipio"
              marcaAgua={'Escriba el código o el municipio'}
              opciones={this.state.municipioJson}
              onChange={this.change}
              value={this.state.municipio}
            />
            {this.state.nuevoSector ? this.renderNuevoSector() : this.renderSelectorSectores()}
          </div>

          <div className="contenedor">
            <this.BotonAgregar />
          </div>

          <div className="contenedor">
            <Tabla
              datos={this.state.lista}
              columnas={this.columnas}
            />
          </div>
        </div>

        <Captcha />
      </React.Fragment>
    )
  }
}

export { RutasMunicipios as RRutasMunicipios }
