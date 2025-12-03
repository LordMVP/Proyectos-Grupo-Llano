import React, { Component } from 'react'
import { Botonera, Captcha, Combo, Input } from 'appfuture-react'
import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'
import axios from 'axios'

/*Subcomponentes*/
import Calendario from './subcomponentes/Calendario'
import Jornada from './subcomponentes/Jornada'
import Municipio from './subcomponentes/Municipio'
import UnidadResponsable from './subcomponentes/UnidadResponsable'
import ConsultaCalendario from './subcomponentes/ConsultaCalendario'

/*URL y */
import URL from '../../global/rutas_api'
import Peticion from '../Assets/util/peticion'
//Carga funciones
import { Util } from '../Assets/util/Util'
//Componentes Modal y Autocompletado
import Modal from '../Assets/componentes/Modal'

/**
 *
 *
 * @class CalendarioHabil
 * @extends {Component}
 */
class CalendarioHabil extends Component {
  //inicialización de variables

  /**
   *Define estados iniciales
   * @memberof CalendarioHabil
   */
  state = {
    // defecto
    chaIdregistro: '',
    proceso: '-1',
    contratista: '-1',
    descripcion: '',
    chaFecha: [],
    contratista: '-1',
    listaMunicipio: [],
    listaUnidadResponsable: [],
    jornada: [],
    calendario: [],
    consultaModal: false,
    consultarCalendario: false,
    listaCalendario:[],
    dchaIdregistro:''
  }

  peticion = new Peticion(this)

  /**
   * Realiza las consultas previas para listar los elementos que irán en los combobox
   * @method
   * @async
   */

  async componentDidMount() {
    //campo proceso
    await this.peticion.get({
      config: ['uniProceso', 'prcDescripcion'],
      url: URL.CALENDARIO_HABIL.LISTAR_PROCESO,
      resultado: 1,
      json: 'procesoJson',
    });
    await this.peticion.get({
      config: ['empresaCod', 'empresaNom'],
      url: URL.CALENDARIO_HABIL.LISTAR_CONTRATISTAS,
      resultado: 1,
      json: 'contratistaJson',
    });
    await this.peticion.get({
      config: ['ciudadCod', 'ciudadNom'],
      url: URL.UNIDADES_RESPONSABLES.LISTAR_CIUDADES,
      resultado: 1,
      json: 'municipio',
    });

    this.corregirLista(this.state.procesoJson, 'procesoJson');
    this.corregirLista(this.state.contratistaJson, 'contratistaJson');
    this.corregirLista(this.state.municipio, 'municipio');
  }


  /**
   * Limpia los espacios adicionales de las descripciones de una lista.
   */
  corregirLista = (lista, name) => {
    const listaCorregida = lista.map(item => {
      return {
        id: item.id.replace(/\s+/g, ' ').trim(),
        texto: item.texto.replace(/\s+/g, ' ').trim()
      }
    });
    this.setState({ [name]: listaCorregida });
  };

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

    switch (id) {
      case 'contratista':
        const a = await this.peticion
          .post({
            url: URL.CALENDARIO_HABIL.LISTAR_CUADRILLAS_CONTRATISTA,
            parametros: {
              idContratista: Util.obtenerId(value),
              proceso:Util.obtenerId(this.state.proceso)
            },
            config: [
              'ureIderegistro',
              'cuadrillaCod',
              'cuadrillaNom',
            ],
            json: 'unidadResponsable',
          })
          .then((data) => {
            this.setState({ listaUnidadResponsable: [] })
            if (data === undefined) {
              this.setState({ unidadResponsable: [] })
            }
          })
        break
    }
  }

  /**
   * Se ejecuta al momento de pulsar sobre el botón Guardar
   * @method
   * @async
   */

  guardar = async () => {
    const {
      proceso,
      descripcion,
      calendario,
      contratista,
      jornada,
      listaMunicipio,
      listaUnidadResponsable,
    } = this.state

    if (
      proceso === '-1' ||
      proceso === '' ||
      descripcion === '' ||
      calendario.length <= 0 ||
      (contratista === '-1' || contratista === '') ||
      jornada.length <= 0 ||
      listaMunicipio.length <= 0 ||
      listaUnidadResponsable.length <= 0
    ) {
      await this.setState({ mensaje: [] })
      proceso === '-1' || proceso === ''
        ? this.state.mensaje.push('Proceso')
        : ''
      descripcion === '' ? this.state.mensaje.push('Descripción') : ''
      calendario.length <= 0
        ? this.state.mensaje.push('Calendario Hábil')
        : ''
      contratista === '-1' || contratista === ''
        ? this.state.mensaje.push('Contratista')
        : ''
      jornada.length <= 0 ? this.state.mensaje.push('Jornada') : ''
      listaMunicipio.length <= 0
        ? this.state.mensaje.push('Municipio')
        : ''
      listaUnidadResponsable.length <= 0
        ? this.state.mensaje.push('Unidad Responsable')
        : ''

      //Modal
      this.setState({
        titulo: '¡FALTA INFORMACIÓN!',
        texto: `Falta escoger:\n ${this.state.mensaje.join(', ')}`,
      })
      //Elimina si existe un segundo botón
      this.botones.length === 2 ? this.botones.shift() : null
      //despliega modal
      this.setState({ mostrar: true })
    } else {
      this.setState({
        titulo: '¡ENVIAR INFORMACIÓN!',
        texto: '¿Confirma Transacción?',
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
    const calendario = this.state.calendario.map((elemento) => {
      const mes =
        elemento[1] + 1 > 9 ? elemento[1] + 1 : '0' + (elemento[1] + 1)
      const dia = elemento[0] > 9 ? elemento[0] : '0' + elemento[0]
      return { fecha: `${elemento[2]}-${mes}-${dia}T10:00:00.000+0000` }
    })

    const listaMunicipio = this.state.listaMunicipio.map((elemento) => {
      return { idMunicipio: Util.obtenerId(elemento.idMunicipio) }
    })
    const listaUnidadResponsable = this.state.listaUnidadResponsable.map(
      (elemento) => {
        return {
          idUnidadResponsable: Util.obtenerId(
            elemento.idUnidadResponsable
          ),
        }
      }
    )

    let dataDetalle = [{
      chaFecha: calendario,
      chaJornada: this.state.jornada,
      chaMunicipios: listaMunicipio,
      chaUnidadesresponsables: listaUnidadResponsable,
      chaIdregistro:this.state.chaIdregistro !== '' ? (this.state.chaIdregistro): null,
      dchaIdregistro:this.state.dchaIdregistro !== '' ? (this.state.dchaIdregistro): null
    }]

    let dataGuardar = {
      uniProceso: {
        uniProceso: Util.obtenerId(this.state.proceso),
      },
      chaDescripcion: this.state.descripcion,
     // chaFecha: calendario,
      empContratista: Util.obtenerId(this.state.contratista),
      dChaCalendario:dataDetalle,
      //chaJornada: this.state.jornada,
      chaMunicipios: listaMunicipio,
      //chaUnidadesresponsables: listaUnidadResponsable,
      fechaDesde: calendario[0].fecha,
      fechaHasta: calendario[(calendario.length-1)].fecha
    }

    this.state.chaIdregistro !== ''
      ? (dataGuardar.chaIdregistro = this.state.chaIdregistro)
      : null

    /*this.peticion.post({
      url:
        this.state.chaIdregistro !== ''
          ? URL.CALENDARIO_HABIL.ACTUALIZAR_CONFIGURACION_CALENDARIO
          : URL.CALENDARIO_HABIL.REGISTRAR_CONFIGURACION_CALENDARIO,
      parametros: dataGuardar,
    })*/

    axios.post(this.state.chaIdregistro !== ''
              ? URL.CALENDARIO_HABIL.ACTUALIZAR_CONFIGURACION_CALENDARIO
              : URL.CALENDARIO_HABIL.REGISTRAR_CONFIGURACION_CALENDARIO, dataGuardar)
      .then(respuesta => {
        const data = respuesta.data;
        if(data.codigo>0){
           this.nuevo()
        }        
      });

    //reiniciar variables:
    //this.nuevo()
  }

  /**
   * Restablece los valores a las condiciones iniciales
   * @method
   */

  nuevo = () => {
    //reiniciar variables:
    this.setState({
      // defecto
      chaIdregistro: '',
      proceso: '-1',
      contratista: '-1',
      descripcion: '',
      chaFecha: [],
      contratista: '-1',
      listaMunicipio: [],
      listaUnidadResponsable: [],
      jornada: [],
      calendario: [],
      consultaModal: false,
      limpieza: true,
      consultarCalendario: true,
    })
  }

  /**
   * Despliega el modal para realizar la consulta
   * @method
   * @param {array} data - arreglo con la fila seleccionada
   */

  handleConsulta = (data) => {
    //Cambia el estado del subcomponente ConsultaActividad, ocultándolo.
    this.setState({
      consultaModal: !this.state.consultaModal,
      listaCalendario:[]
    });
    //Del objeto json DATA se extrae el id para realizar la consulta
    if (data && typeof data.id != 'undefined') {
      axios
        .post(URL.CALENDARIO_HABIL.CONSULTAR_CALENDARIO_POR_ID, {
          chaIdregistro: data.id,
        })
        .then((json) => {
          return json.data
        })
        .then((data) => {
          this.nuevo()

          this.setState({
            chaIdregistro: data.chaIdregistro,
            dchaIdregistro: data.dChaCalendario[0].dchaIdregistro
          })
          const listaMunicipio = data.chaMunicipios.map((fila) => {
            return {
              idMunicipio: `${fila.idMunicipio} - ${fila.nombreMunicipio}`,
            }
          })
          this.setState({ listaMunicipio })

          const jornada = data.dChaCalendario[0].chaJornada.map((fila) => {
            return {
              horaInicio: fila.horaInicio,
              horaFin: fila.horaFin,
              jornada: fila.jornada,
            }
          })
          this.setState({ jornada })

          let proceso = this.state.procesoJson.filter(
            (fila) => {
              console.log('"' + Util.obtenerId(fila.texto, 1) + "'", "'" + Util.limpiarDato(data.uniProceso.prcDescripcion) + "'");
              return Util.obtenerId(fila.texto, 1) ==
                Util.limpiarDato(data.uniProceso.prcDescripcion);
            }
          )
          proceso = Util.limpiarDato(proceso)

          let contratista = this.state.contratistaJson.filter(
            (fila) =>
              Util.obtenerId(fila.texto) == data.empContratista
          )
          contratista = Util.limpiarDato(contratista)

          this.setState(
            {
              proceso,
              contratista,
              descripcion: data.chaDescripcion,
            },
            () => {
              this.change({
                target: {
                  id: 'contratista',
                  value: contratista,
                },
              }).then((e) => {
                const listaUnidadResponsable = data.dChaCalendario[0].chaUnidadesresponsables.map(
                  (fila) => {
                    let valor = this.state.unidadResponsable.filter(
                      (unidad) =>
                        Util.obtenerId(unidad.texto) ==
                        fila.idUnidadResponsable
                    )
                    if (valor.length == 0) {
                      return {
                        idUnidadResponsable: `${fila.idUnidadResponsable} - NO EXISTE`,
                      }
                    } else {
                      return {
                        idUnidadResponsable:
                          valor[0].texto,
                      }
                    }
                  }
                ).map((value, index) => { value.item = index + 1; return value; })

                //Recorremos las unidades para autoseleccionar las consutladas...
                const unidadResponsable = this.state.unidadResponsable.filter(unidad => {
                  const index = listaUnidadResponsable.findIndex(item => item.idUnidadResponsable == unidad.id);
                  if (index >= 0) {
                    unidad.seleccionado = true;
                  }
                  return unidad;
                });

                this.setState({
                  unidadResponsable,
                  listaUnidadResponsable,
                  listaCalendario: data.dChaCalendario[0].chaFecha,
                })
              })
            }
          )
        })
    }
  }

  //Arreglo para emplearlo en el componente botonera, con sus respectivas funciones

  funciones = [
    { texto: 'guardar', callback: this.guardar },
    { texto: 'consultar', callback: this.handleConsulta },
    { texto: 'nuevo', callback: this.nuevo },
  ]

  /**
   * Cierra el modal de la consulta
   * @method
   */

  cerrarModal = () => { }

  //Arreglo para emplearlo en el componente Modal, con sus respectivas funciones

  botones = [{ texto: 'Cerrar', callback: this.cerrarModal, index: 2 }]

  seleccionarItemUnidadesResponsables = (evento, callback) => {
    const control = evento.target;
    const value = control.value;
    const listaUnidadesResponsables = this.state.unidadResponsable.map(unidad => {
      if (unidad.id == value) {
        unidad.seleccionado = control.checked;
      }
      return unidad;
    });
    this.setState({ unidadResponsable: listaUnidadesResponsables }, callback);
  };


  /**
   *Renderiza la vista
   * @return {JSX} componente - returna vista jsx
   */

  render() {
    return (
      <React.Fragment>
        <ConsultaCalendario
          opcionesProceso={this.state.procesoJson}
          opcionesContratista={this.state.contratistaJson}
          opcionesUnidadResponsable={this.state.unidadResponsable}
          opcionesMunicipio={this.state.municipio}
          mostrar={this.state.consultaModal}
          cerrarModal={this.handleConsulta}
        />

        <h1>Empresa - Configuración calendario hábil proceso</h1>

        <Botonera funciones={this.funciones} />

        <Modal
          titulo={this.state.titulo}
          texto={this.state.texto}
          mostrar={this.state.mostrar}
          ocultarAlerta={this.change}
          botones={this.botones}
        />

        <div className="caja contenedor">
          <label className="tag"> Información calendario</label>

          <div className="formulario alineado">
            <div className="columna">
              <Combo
                propTexto="texto"
                propValor="id"
                id="proceso"
                label="proceso"
                value={this.state.proceso}
                opciones={this.state.procesoJson}
                onChange={this.change}
              />

              <Input
                id="descripcion"
                label="descripcion"
                value={this.state.descripcion}
                onChange={this.change}
              />

              <Jornada
                lista={this.state.jornada}
                value={this.state.jornada}
                onChange={this.change}
                limpieza={this.state.limpieza}
              />

              <Combo
                propTexto="texto"
                propValor="id"
                id="contratista"
                label="contratista"
                value={this.state.contratista}
                opciones={this.state.contratistaJson}
                onChange={this.change}
              />

              <UnidadResponsable
                lista={this.state.listaUnidadResponsable}
                listaUnidades={this.state.unidadResponsable}
                value={this.state.unidadResponsable}
                limpieza={this.state.limpieza}
                onChange={this.change}
                seleccionarItem={this.seleccionarItemUnidadesResponsables}
              />
            </div>

            <div className="columna">
              <Calendario
                lista={this.state.listaCalendario}
                value={this.state.calendario}
                onChange={this.change}
                limpieza={this.state.limpieza}
                consultarCalendario={this.state.consultarCalendario}
              />

              <Municipio
                lista={this.state.listaMunicipio}
                value={this.state.municipio}
                onChange={this.change}
                limpieza={this.state.limpieza}
              />
            </div>
          </div>
        </div>

        <Captcha />
      </React.Fragment>
    )
  }
}

CalendarioHabil.propTypes = {}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch)
}

const VistaRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarioHabil)

export { VistaRedux as RCalendarioHabil }
