import React, { Component } from 'react'
import { Botonera, Captcha, Combo, Tab, TextArea, Input, VentanaModal } from 'appfuture-react'

import Actividades from './subcomponentes/Actividades'
import ConsultaInformacion from './subcomponentes/ConsultaUnidadResponsable'
import Municipios from './subcomponentes/Municipios'

import axios from 'axios'
import URL from '../../global/rutas_api'
import Peticion from '../Assets/util/peticion'
import Autocompletado from '../Assets/componentes/Autocompletado'
import { Util } from '../Assets/util/Util'
import Modal from '../Assets/componentes/Modal'
import * as defaultOptions from './defaultOptions'
import ConsultaUnidadResponsable from './subcomponentes/ConsultaUnidadResponsable'
import './UnidadesResponsables.scss';
import { RCrearUnidadResponsable } from './CrearUnidadResponsable';

/**
 *
 *
 * @class UnidadesResponsables
 * @extends {Component}
 */
class UnidadesResponsables extends Component {
  //inicialización de variables

  /**
  *Define estados iniciales
  * @memberof UnidadesResponsables
  */
  state = {
    ureIderegistro: '',
    elementosActividad: '-1',
    unidadResponsable: '',
    contratista: '-1',
    proceso: '-1',
    estado: '-1',
    fecha: '',
    listaTabla: [],
    listaTabla: [],
    listaMunicipio: [],
    unidadResponsableJson: [],
    contratistaJson: [],
    procesoJson: [],
    panelActivo: 'AC',
    observaciones: '',
    limpiezaActividad: false,
    limpiezaMunicipio: false,
    mostrarModalCrearUnidad: false,
  }

  // interno

  /**
   * Realiza las consultas previas para listar los elementos que irán en los combobox
   * @method
   * @async
   */

  async componentDidMount() {
    await this.peticion.get({
      config: ['uniProceso', 'prcDescripcion'],
      url: URL.UNIDADES_RESPONSABLES.LISTAR_PROCESO,
      json: 'procesoJson',
      value: 'proceso',
    })
    await this.peticion.get({
      config: ['empresaCod', 'empresaNom'],
      url: URL.UNIDADES_RESPONSABLES.LISTAR_CONTRATANTES,
      json: 'contratistaJson',
      value: 'contratista',
    })
    await this.peticion.get({
      config: ['ciudadCod', 'ciudadNom'],
      url: URL.UNIDADES_RESPONSABLES.LISTAR_CIUDADES,
      json: 'municipios',
    })

    this.corregirLista(this.state.contratistaJson, 'contratistaJson');
    this.corregirLista(this.state.procesoJson, 'procesoJson');
    this.corregirLista(this.state.municipios, 'municipios');

    axios.get(URL.UNIDADES_RESPONSABLES.LISTAR_CONTRATANTES)
      .then(respuesta => {
        this.setState({ listaEmpresasContrantes: respuesta.data });
      });

    axios.get(URL.UNIDADES_RESPONSABLES.LISTAR_PROCESO)
      .then(respuesta => {
        this.setState({ listaProcesos: respuesta.data });
      });  
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

  peticion = new Peticion(this)

  /**
   * Cambia el valor del estado asociado a cada componente
   * @method
   * @async
   * @param {int} id al nombre del estado que se desea modificar
   * @param {(int|string)} value del componente correspondiente al dato
   * que se visualizará en el componente
   */

  change = ({ target: { id, value } }) => {
    this.setState({ [id]: value }, () => {
      const {
        proceso,
        unidadResponsable,
        contratista,
        estado,
      } = this.state

      if (
        proceso !== '-1' &&
        unidadResponsable !== '' &&
        contratista !== '-1' &&
        estado !== '-1'
      ) {
        const elementosActividad = [
          { proceso, unidadResponsable, contratista, estado },
        ]
        this.setState({ elementosActividad })
      }
      if (id === 'proceso' && value != -1) {
        this.peticion.post({
          url:
            URL.UNIDADES_RESPONSABLES.CONSULTAR_PROCESO_ACTIVIDADES,
          parametros: {
            proceso: Util.obtenerId(value),
          },
          config: ['proaIderegistro', 'proaDescripcion'],
          json: 'actividadJson',
          value: 'actividad',
        });
     // }
      //if (id === 'contratista') {
        const parametros = {
          proceso: Util.obtenerId(value),
          empresa: Util.obtenerId(this.state.contratista)
        };
        axios.post(URL.UNIDADES_RESPONSABLES.LISTAR_UNIDADES_RESPONSABLES, parametros)
          .then(respuesta => {
            const data = respuesta.data;
            data.forEach(unidad => {
              unidad.id = unidad.cuadrilla.cuadrillaCod + ' - ' + unidad.cuadrilla.cuadrillaNom;
              unidad.texto = unidad.cuadrilla.cuadrillaCod + ' - ' + unidad.cuadrilla.cuadrillaNom;
            });
            this.setState({ unidadResponsableJson: data });
          });
      }
    })
  }

  /**
   * Consulta las unidades...
   */
  obtenerUnidades = (value) => {  
    const parametros = {
      empresa: Util.obtenerId(value)
    };
    axios.post(URL.UNIDADES_RESPONSABLES.LISTAR_UNIDADES_RESPONSABLES, parametros)
      .then(respuesta => {
        const data = respuesta.data;
        data.forEach(unidad => {
          unidad.id = unidad.cuadrilla.cuadrillaCod + ' - ' + unidad.cuadrilla.cuadrillaNom;
          unidad.texto = unidad.cuadrilla.cuadrillaCod + ' - ' + unidad.cuadrilla.cuadrillaNom;
        });
        this.setState({ unidadResponsableJson: data });
      });
  };

  /**
   * Despliega el modal para realizar la consulta
   * @method
   */

  handleModal = (data,proceso) => {
    this.setState({ consultaModal: !this.state.consultaModal })
    if (data.hasOwnProperty('ureIderegistro')) {
      //prueba de consulta

      this.peticion.post({
        parametros: {
          empresa: Util.obtenerId(data.empresaContratista),
          proceso: Util.obtenerId(proceso)
        },
        url: URL.UNIDADES_RESPONSABLES.LISTAR_UNIDADES_RESPONSABLES,
        configJson: ['cuadrilla', 'cuadrillaCod', 'cuadrillaNom'],
        json: 'unidadResponsableJson',
        value: 'unidadResponsable',
      });

      this.setState({
        ureIderegistro: data.ureIderegistro,
      })
      axios
        .post(URL.UNIDADES_RESPONSABLES.CONSULTAR_POR_ID, {
          ureIdeRegistro: data.ureIderegistro,
        })
        .then((json) => {
          return json.data
        })
        .then((data) => {
          if (data === null) {
            this.nuevo()
            return false
          }

          let estado =
            data.ureEstado === 'A'
              ? 'Activo'
              : data.ureEstado === 'I'
                ? 'Inactivo'
                : data.ureEstado === 'R'
                  ? 'Incapacidad'
                  : data.ureEstado === 'L'
                    ? 'Licencia'
                    : '-1'
          let fecha = data.ureFechavigencia.substring(
            0,
            data.ureFechavigencia.indexOf('T')
          )
          this.setState({
            estado,
            observaciones: data.ureObservacion,
            fecha,
          });

          let contratista = this.state.contratistaJson.filter(
            (fila) =>
              data.cuadrillaCodemp ==
              Util.obtenerId(fila.texto, 0)
          );

          contratista = Util.limpiarDato(contratista);


          let proceso = this.state.procesoJson.filter(fila => {
            const filtro = data.uraUnidadractividad.filter(p => p.procesoactividad.uniProceso == Util.obtenerId(fila.texto));
            if (Array.isArray(filtro) && filtro.length > 0) {
              return fila;
            }
          });
          proceso = Util.limpiarDato(proceso);

          let unidadResponsable = this.state.unidadResponsableJson.filter(
            (fila) =>
              data.cuadrilla.cuadrillaCod ==
              Util.obtenerId(fila.texto)
          )
          unidadResponsable = Util.limpiarDato(unidadResponsable)
          let listaTabla = data.uraUnidadractividad.map(
            (fila) => {
              let contratista = this.state.contratistaJson.filter(
                (id) =>
                  fila.empresaContratista.empresaCod ==
                  Util.obtenerId(id.texto, 0)
              )
              contratista = Util.limpiarDato(contratista)
              return {
                contratista,
                unidadResponsable,
                proceso: fila.ureIderegistro,
                actividad: `${fila.procesoactividad.proaIderegistro} - ${fila.procesoactividad.proaDescripcion}`,
                id: `${fila.procesoactividad.proaIderegistro} - ${fila.procesoactividad.proaDescripcion}`,
                texto: `${fila.procesoactividad.proaIderegistro} - ${fila.procesoactividad.proaDescripcion}`,
              }
            }
          );


          //Consultamos la lista de actividades y autoseleccionamos las que se encuentren registradas...
          (async () => {
            await this.peticion.post({
              url:
                URL.UNIDADES_RESPONSABLES
                  .CONSULTAR_PROCESO_ACTIVIDADES,
              parametros: {
                proceso: Util.obtenerId(proceso),
              },
              config: ['proaIderegistro', 'proaDescripcion'],
              json: 'actividadJson',
              value: 'actividad',
            });

            const actividades = this.state.actividadJson;
            const listaTabla = this.state.listaTabla;
            if (Array.isArray(listaTabla) && Array.isArray(actividades)) {
              const actividadJson = actividades.map(actividad => {
                const v = listaTabla.find(item => Util.obtenerId(item.id) == Util.obtenerId(actividad.id));
                if (v) {
                  actividad.seleccionado = true;
                }
                return actividad;
              });
              this.setState({ actividadJson });
            }
          })();

          let listaMunicipio = data.seurSecunidadesresp.map(
            (fila) => {
              return {
                municipio: `${fila.secSectores.ciudadCod.ciudadCod} - ${fila.secSectores.ciudadCod.ciudadNom}`,
                sector: `${fila.secSectores.secIderegistro} - ${fila.secSectores.secDescripcion}`,
              }
            }
          )

          this.setState({
            contratista,
            proceso,
            unidadResponsable,
            listaTabla,
            listaMunicipio,
          });
        })
    }
  }

  /**
   * Se ejecuta al momento de pulsar sobre el botón Guardar
   * @method
   * @async
   */

  guardar = async () => {
    if (
      this.state.estado === '-1' ||
      this.state.unidadResponsable === '' ||
      this.state.contratista === '-1' ||
      this.state.proceso === '-1' ||
      //this.state.observaciones === '' ||
      this.state.listaTabla.length <= 0 || // && this.state.actividadJson.length <= 0) ||
      this.state.listaMunicipio.length <= 0 ||
      this.state.fecha === ''
    ) {
      await this.setState({ mensaje: [] })
      this.state.estado === '-1' ? this.state.mensaje.push('Estado') : ''
      this.state.unidadResponsable === ''
        ? this.state.mensaje.push('Unidad Responsable')
        : ''
      this.state.proceso === '-1'
        ? this.state.mensaje.push('Proceso')
        : ''
      this.state.contratista === '-1'
        ? this.state.mensaje.push('Contratante')
        : ''
        /*this.state.observaciones === ''
              ? this.state.mensaje.push('Observaciones')
              : ''*/
        this.state.listaTabla.length <= 0 //&& this.state.actividadJson.length <= 0)
          ? this.state.mensaje.push('Actividades')
          : ''
      this.state.listaMunicipio.length <= 0
        ? this.state.mensaje.push('Municipios')
        : ''
      this.state.fecha === ''
        ? this.state.mensaje.push('Fecha Vigencia ')
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
    const actividades = this.state.listaTabla.map((fila) => {
      return {
        proaIderegistro: Util.obtenerId(fila.actividad),
        empContratista: Util.obtenerId(fila.contratista, 0),
      }
    })
    const municipios = this.state.listaMunicipio.map((fila) => {
      return { secIderegistro: Util.obtenerId(fila.sector) }
    })

    //estado
    let estado =
      this.state.estado === 'Activo'
        ? 'A'
        : this.state.estado === 'Inactivo'
          ? 'I'
          : this.state.estado === 'Incapacidad'
            ? 'R'
            : this.state.estado === 'Licencia'
              ? 'L'
              : '-1'

    const { unidadResponsable, unidadResponsableJson } = this.state;
    const unidad = unidadResponsableJson.find(unidad => unidad.id == unidadResponsable);
    /** Acceder a la propiedad unidad.ureIderegistro y enviarla en dato guardar */
    let datoGuardar = {
      ureIderegistro:this.state.ureIderegistro===''?unidad.ureIderegistro:this.state.ureIderegistro,
      ureEstado: estado,
      cuadrilla: {
        cuadrillaCod: Util.obtenerId(this.state.unidadResponsable),
      },
      cuadrillaCodemp: Util.obtenerId(this.state.contratista, 0),
      ureObservacion: this.state.observaciones,
      ureFechavigencia: `${this.state.fecha}T00:00:00.000+0000`,
      uraUnidadractividad: actividades,
      seurSecunidadesresp: municipios,
    }
    

    this.peticion.post({
      url: URL.UNIDADES_RESPONSABLES
      .ACTUALIZAR_URE_UNIDAD_RESPONDABLE,
       /* this.state.ureIderegistro !== ''
          ? URL.UNIDADES_RESPONSABLES
            .ACTUALIZAR_URE_UNIDAD_RESPONDABLE
          : URL.UNIDADES_RESPONSABLES
            .REGISTRAR_URE_UNIDAD_RESPONSABLE,*/
      parametros: datoGuardar,
    }).then((data) => {
      if (data === null) {
        this.limpiarCampos();
        return false
      }
    }) 
  }

  /**
   * Restablece los valores a las condiciones iniciales
   * @method
   */

  nuevo = () => {
    this.limpiarCampos();
  }

  limpiarCampos = () =>{
    this.setState({
      ureIderegistro: '',
      contratista: '-1',
      proceso: '-1',
      unidadResponsable: '',
      estado: '-1',
      observaciones: '',
      fecha: '',
      listaTabla: [],
      listaTabla: [],
      listaMunicipio: [],
      limpiezaMunicipio: true,
      limpiezaActividad: true,
    })
  }

  funciones = [
    { texto: 'guardar', callback: this.guardar },
    { texto: 'consultar', callback: this.handleModal },
    { texto: 'nuevo', callback: this.nuevo },
  ]


  abrirCerrarModal = () => {
    this.setState({ mostrarModalCrearUnidad: false });
  };


  agregarUnidadResponsable = () => {
    this.setState({ mostrarModalCrearUnidad: true });
  };

  cerrarModal = () => {
    this.setState({ mostrar: false });
  };

  //Arreglo para emplearlo en el componente Modal, con sus respectivas funciones
  botones = [{ texto: 'Cerrar', callback: this.cerrarModal, index: 2 }]

  /**
   *Renderiza la vista
   * @return {JSX} componente - returna vista jsx
   */
  render() {
    return (
      <React.Fragment>
        <h1>Empresa - Unidad Responsable </h1>

        <Modal
          titulo={this.state.titulo}
          texto={this.state.texto}
          mostrar={this.state.mostrar}
          ocultarAlerta={this.change}
          botones={this.botones}
        />

        <ConsultaUnidadResponsable
          opcionesContratista={this.state.contratistaJson}
          opcionesProceso={this.state.procesoJson}
          opcionesUnidad={this.state.unidadResponsableJson}
          opcionesEstado={defaultOptions.opcionesEstado}
          mostrar={this.state.consultaModal}
          cerrarModal={this.handleModal}
          onChange={this.change}
        />

        <Botonera funciones={this.funciones} />

        <div className="caja contenedor">
          <label className="tag">Unidad responsable</label>

          <div className="formulario">
            <Combo
              propTexto="texto"
              propValor="id"
              id="contratista"
              label="Empresa *"
              value={this.state.contratista}
              opciones={this.state.contratistaJson}
              onChange={this.change}
            />

            <Combo
              propTexto="texto"
              propValor="id"
              id="proceso"
              label="proceso *"
              value={this.state.proceso}
              opciones={this.state.procesoJson}
              onChange={this.change}
            />

            <div className='input-group-autocomplete'>
              <Autocompletado
                id="unidadResponsable"
                label="Unidad Responsable *"
                marcaAgua={'Escribe la unidad responsable'}
                value={this.state.unidadResponsable}
                opciones={this.state.unidadResponsableJson}
                onChange={this.change}
                required={true}
              />
              <div className='input-group-btn-autocomplete'>
                <button className='btn btn-primary' onClick={() => { this.setState({ mostrarModalCrearUnidad: true }) }}><i className='fa fa-fw fa-plus'></i></button>
              </div>
            </div>

            <Combo
              propTexto="texto"
              propValor="id"
              id="estado"
              label="estado"
              value={this.state.estado}
              opciones={defaultOptions.opcionesEstado}
              onChange={this.change}
            />
            <Input
              id="fecha"
              label="Vigencia Hasta"
              type="date"
              value={this.state.fecha}
              onChange={this.change}
            />
          </div>

          <TextArea
            key="98765"
            id="observaciones"
            className="contenedor"
            label="observaciones"
            value={this.state.observaciones}
            onChange={this.change}
          />
        </div>

        <div className="contenedor">
          <Tab>
            <Actividades
              label="actividades"
              elementos={this.state.elementosActividad}
              listaTabla={this.state.listaTabla}
              value={this.state.actividadJson}
              onChange={this.change}
              contratista={this.state.contratista}
              proceso={this.state.proceso}
              unidadResponsable={this.state.unidadResponsable}
              limpiezaActividad={this.state.limpiezaActividad}
            />
            <Municipios
              label="municipio"
              listaTabla={this.state.listaMunicipio}
              value={this.state.municipios}
              onChange={this.change}
              limpiezaMunicipio={this.state.limpiezaMunicipio}
            />
          </Tab>
        </div>
        <Captcha />
        <VentanaModal
          mostrar={this.state.mostrarModalCrearUnidad}
          titulo='Crear Unidad Responsable'
          cerrarModal={this.abrirCerrarModal}>
          <RCrearUnidadResponsable esModal terminar={() => { this.obtenerUnidades(this.state.contratista) }} listaEmpresasContrantes={this.state.listaEmpresasContrantes}  listaProcesos={this.state.listaProcesos} />
        </VentanaModal>
      </React.Fragment>
    )
  }
}

export { UnidadesResponsables as RUnidadesResponsables }
