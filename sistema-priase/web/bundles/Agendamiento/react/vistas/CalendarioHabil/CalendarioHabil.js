import React, { Component } from 'react'
import {Tabla, Botonera, Captcha, Combo, Input } from 'appfuture-react'
import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'
import axios from 'axios'

/*Subcomponentes*/
import Calendario from './subcomponentes/Calendario'
import Jornada from './subcomponentes/Jornada'
import Municipio from './subcomponentes/Municipio'
import UnidadResponsable from './subcomponentes/UnidadResponsable'
import ConsultaCalendario from './subcomponentes/ConsultaCalendario'
import DetalleCalendario from './subcomponentes/DetalleCalendario'

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
  /**
   *Define estados iniciales
   * @memberof CalendarioHabil
   */
  state = {    
    chaIdregistro: '',
    dchaIdregistro:'',
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
    detalleModal:false,
    consultarCalendario: false,
    listaCalendario:[],
    detalleData:[],
    datosTabla:[],
    observacion:'',
    dataTotal:[],
    nuevoDetalle: true
  }

  peticion = new Peticion(this)


  /**
   * Realiza las consultas previas para listar los elementos que irán en los combobox
   * @method
   * @async
   */

  async componentDidMount() {    
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
    if(value !== '-1'){
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
              //this.setState({ listaUnidadResponsable: [] })
              if (data === undefined) {
                this.setState({ unidadResponsable: [] })
              }
            })
  
  
            /*axios.post(URL.CALENDARIO_HABIL.LISTAR_CUADRILLAS_CONTRATISTA, {idContratista: Util.obtenerId(value),proceso:Util.obtenerId(this.state.proceso)})
                 .then(respuesta => {
                    const datos = respuesta.data;
                    this.setState({ listaUnidadResponsable: datos });
                 });*/
          break
      }
    }
  }

  /**
   * Se ejecuta para crear el objeto detalle del calendario
   */
  agregarDetalle = async() =>{    

    const calendario = this.state.calendario.map((elemento) => {
      const mes =
        elemento[1] + 1 > 9 ? elemento[1] + 1 : '0' + (elemento[1] + 1)
      const dia = elemento[0] > 9 ? elemento[0] : '0' + elemento[0]
      return { fecha: `${elemento[2]}-${mes}-${dia}T10:00:00.000+0000` }
    })   

   if(this.validarFecha(calendario)>0){
      this.setState({
        titulo: '¡YA ESTA ASOCIADO LAS FECHAS!',
        texto: `Revisar la fechas, ya se encuentran asociadas`,
      })   
      this.botones.length === 2 ? this.botones.shift() : null
      this.setState({ mostrar: true })
   }else{ 
     
      if(this.state.nuevoDetalle==true){
        await this.setState({ dchaIdregistro: '' })      
      }

      let fechas = ''
      calendario.forEach(function(id) {
          fechas = fechas+" \n"+id.fecha.replace('T10:00:00.000+0000','')
      });

      const listaMunicipio = this.state.listaMunicipio.map((elemento) => {
        return { idMunicipio: Util.obtenerId(elemento.idMunicipio)}
      })

      const municipio = this.state.listaMunicipio
      let municipios = ''
      municipio.forEach(function(id){
        municipios = municipios+" \n"+id.idMunicipio
      });

      const listaUnidadResponsable = this.state.listaUnidadResponsable.map(
        (elemento) => {
          return {
            idUnidadResponsable: Util.obtenerId(
              elemento.idUnidadResponsable
            ),
          }
        }
      )

      const unidades = this.state.listaUnidadResponsable
      let unidadesres = ''
      unidades.forEach(function(id){
        const arrayu = id.idUnidadResponsable.split('-')
        unidadesres = (arrayu[1]+arrayu[2])+" - "+unidadesres;
      });

      const jornadas = this.state.jornada
      let jornadatab = ''
      jornadas.forEach(function(id){
        jornadatab = jornadatab+" "+id.horaInicio+" "+id.horaFin+" "+id.jornada
      });

      //array para registrar.
      let newData = [
        ...this.state.detalleData,
        {        
          chaFecha: calendario,
          chaJornada: this.state.jornada,
          chaMunicipios: listaMunicipio,
          chaUnidadesresponsables: listaUnidadResponsable,
          chaIdregistro:this.state.chaIdregistro !== '' ? (this.state.chaIdregistro): null,
          dchaIdregistro:this.state.dchaIdregistro !== '' ? (this.state.dchaIdregistro): null,
        }
      ]

      this.setState({ detalleData : newData });    

      //array para mostrar  en la tabla
      let newTabla = [
        ...this.state.datosTabla,
        {
          key:(this.state.datosTabla.length),
          datamunicipios:municipios,
          dataunidades:unidadesres,
          datafechas:fechas,
          datajornadas:jornadatab
        }
      ]
      this.setState({datosTabla:newTabla})
    }
  }

  /**
   * Validar las fechas que se repiten en el detalle
   */
  validarFecha=(calendario)=>{
    let filtrar= 0
    const datos = this.state.detalleData
    if(datos.length>0){  
      calendario.some(function(elemento){
        datos.some(function(id){
          const fechas = id.chaFecha;
            fechas.some(function(id){
                 if(id.fecha===elemento.fecha){
                    filtrar = 1
                    return true; 
                 }
              })
          })
        })    
    }
    
    return filtrar
  }

  validarURE=(listaUre)=>{
    let filtrar= 0
    const datos = this.state.detalleData
    if(datos.length>0){  
      calendario.some(function(elemento){
        datos.some(function(id){
          const fechas = id.chaFecha;
            fechas.some(function(id){
                 if(id.fecha===elemento.fecha){
                    filtrar = 1
                    return true; 
                 }
              })
          })
        })    
    }
    
    return filtrar
  }

   /**
     * Elimina la fila seleccionada en la tabla
     * @method
     * @param {int} index -Índice que corresponde al número de la fila que se desea eliminar
    */
  remover = (evento) => {
    const control = evento.target;
    const index = control.attributes['data-index'].value;

    let data = this.state.datosTabla;
    let info = this.state.detalleData;
 
   /* let newData = [
      ...data.slice(index,1),
      ...data.slice(index + 1),
    ]

    let newInfo = [
      ...info.slice(index,1),
      ...info.slice(index + 1),
    ]*/
    data.splice(index,1);
    info.splice(index,1);
 
    this.setState({ datosTabla : data });
    this.setState({ detalleData : info})
    this.setState({nuevoDetalle : false})
  } 

  /**
   * Se ejecuta al momento de pulsar sobre el botón Agregar Detalle
   * @method
   * @async
   */

  agregar = async () => {
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
      this.agregarDetalle()
    }
  }


  guardar = () =>{

    if(this.state.detalleData.length<=0){
      this.setState({
        titulo: '¡FALTA INFORMACIÓN!',
        texto: `Falta Registrar Detalle`,
      })
      //Elimina si existe un segundo botón
      this.botones.length === 2 ? this.botones.shift() : null
      //despliega modal
      this.setState({ mostrar: true })
    }else{
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
    const calendario = this.obtenerFechas()
    
    const listaMunicipio = this.state.listaMunicipio.map((elemento) => {
      return { idMunicipio: Util.obtenerId(elemento.idMunicipio) }
    })
   
    let dataGuardar = {
      uniProceso: {
        uniProceso: Util.obtenerId(this.state.proceso),
      },
      chaDescripcion: this.state.descripcion,     
      empContratista: Util.obtenerId(this.state.contratista),
      dChaCalendario:this.state.detalleData,
      chaMunicipios: listaMunicipio,      
      fechaDesde: calendario[0].fecha,
      fechaHasta: calendario[(calendario.length-1)].fecha,
      chaObservacion:this.state.observacion
    }

    this.state.chaIdregistro !== ''
      ? (dataGuardar.chaIdregistro = this.state.chaIdregistro)
      : null

    axios.post(this.state.chaIdregistro !== ''
              ? URL.CALENDARIO_HABIL.ACTUALIZAR_CONFIGURACION_CALENDARIO
              : URL.CALENDARIO_HABIL.REGISTRAR_CONFIGURACION_CALENDARIO, dataGuardar)
      .then(respuesta => {
        const data = respuesta.data;
        if(data.codigo>0){
           this.nuevo()
        }        
      });
  }

  obtenerFechas=()=>{
    const datos = this.state.detalleData
    const fechasFinal=[]
    datos.forEach(function(id){
      const fechas = id.chaFecha;
      fechas.forEach(function(id){
          fechasFinal.push(id)        
      })
    })   
    
    return fechasFinal
  }

  verDetalle = async(evento) =>{
    const control = evento.target;
    const index = control.attributes['data-index'].value;

    const detalle = this.state.detalleData[index];
    
    await this.setState({listaCalendario:[]})
          this.setState({dchaIdregistro:detalle.dchaIdregistro})

    const jornada = detalle.chaJornada.map((fila) => {
      return {
        horaInicio: fila.horaInicio,
        horaFin: fila.horaFin,
        jornada: fila.jornada,
      }
    })
    this.setState({ jornada })

    const listaUnidadResponsable = detalle.chaUnidadesresponsables.map(
      (fila) => {
        let valor = this.state.unidadResponsable.filter(
          (unidad) =>
            Util.obtenerId(unidad.texto) ==
            fila.idUnidadResponsable
        )
        if (valor.length == 0) {
          return {
            idUnidadResponsable: `${fila.idUnidadResponsable} - ${fila.nombreUnidadResponsable}`,
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

    const listaMunicipio = detalle.chaMunicipios.map((fila) => {
      return {
        idMunicipio:fila.idMunicipio // `${fila.idMunicipio} - ${fila.nombreMunicipio}`,
      }
    })
    this.setState({ listaMunicipio })

    await this.setState({
      unidadResponsable,
      listaUnidadResponsable,
      listaCalendario: detalle.chaFecha,              
    })    

  }

  /**
   * Restablece los valores a las condiciones iniciales
   * @method
   */

  nuevo = () => {    
    this.setState({      
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
      datosTabla:[],
      detalleData:[],
      observacion:'',
      dchaIdregistro:'',
      nuevoDetalle:true
    })
  }

  //Este es el que utilizaria cuando le de ver.
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
            dataTotal:data,
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
              observacion: data.chaObservacion
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
                        idUnidadResponsable: `${fila.idUnidadResponsable} - ${fila.nombreUnidadResponsable}`,
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
                  detalleData:data.dChaCalendario         
                })
                this.verDatosDetalle()
              })
            }
          )
        })
    }
  }

  modalDetalle =()=>{
    this.setState({
      detalleModal: !this.state.detalleModal
    });
  }

  verDatosDetalle = ()=>{
    const detalles = this.state.detalleData
    let newData = []
    // Preparar datos para  mostrar la consulta
    detalles.forEach(function(detalle){
      let fechas = ''
      detalle.chaFecha.forEach(function(id) {
          fechas = fechas+" \n"+id.fecha.replace('T10:00:00.000+0000','')
      });

      let municipios = ''
      detalle.chaMunicipios.forEach(function(id){
        municipios = municipios+" \n"+id.nombreMunicipio
      });
        
      let unidadesres = ''
      detalle.chaUnidadesresponsables.forEach(function(id){       
        unidadesres = id.nombreUnidadResponsable+" - "+unidadesres
      });
        
      let jornadatab = ''
      detalle.chaJornada.forEach(function(id){
        jornadatab = jornadatab+" "+id.horaInicio+" "+id.horaFin+" "+id.jornada
      });
  
      //array para mostrar  en la tabla
      newData.push({
          key:(newData.length),
          datamunicipios:municipios,
          dataunidades:unidadesres,
          datafechas:fechas,
          datajornadas:jornadatab
        })              
    });   

    this.setState({datosTabla:newData}) 
  }

  //Arreglo para emplearlo en el componente botonera, con sus respectivas funciones

  funciones = [
    { texto: 'guardar', callback: this.guardar },
    { texto: 'consultar', callback: this.handleConsulta },
    { texto: 'detalle', callback: this.modalDetalle },
    { texto: 'nuevo', callback: this.nuevo },
  ]

  /**
   * Cierra el modal de la consulta
   * @method
   */

  cerrarModal = () => {
    this.setState({detalleModal:false})
  }

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
   *
   *Habilita el botón agregar
   *@method
   *@param {Object} props
   *@return {JSX} Componente - Button
   */

  BotonAgregar = () => {
      return (<button className="btn btn-success" onClick={this.agregar}>agregar detalle</button>)
  }

  renderTablaDatos = () => {  
    
    if (this.state.datosTabla.length===0) {
      return null;
    }
    return (
      <div className="table-responsive-xl">
          <table id='table' data-toggle='table' className='table table-hover table-condensed table-bordered table-sm' data-pagination='true' data-search='true'>
            <thead className='bg-light text-black'>
              <tr>
                <th>Municipio</th>
                <th>Unidades Responsables</th>
                <th>Fechas</th>
                <th>Jornadas</th>   
                <th>Eliminar</th>   
                <th>Accion</th>                    
              </tr>
            </thead>
            <tbody>
              {
                this.state.datosTabla.map((elemento,index) => {              
                  return (
                    <tr key={index}>
                      <td>{elemento.datamunicipios}</td>
                      <td>{elemento.dataunidades}</td>
                      <td>{elemento.datafechas}</td>                  
                      <td>{elemento.datajornadas}</td>       
                      <td>{<button className='btn bg-danger btn-xs' onClick={this.remover} data-index={index} >-</button>}</td>
                      <td>{<button className='btn bg-succes btn-xs' onClick={this.verDetalle} data-index={index} >Ver</button>}</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
      </div>      
    );
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

        <DetalleCalendario
          opcionesProceso={this.state.procesoJson}
          opcionesContratista={this.state.contratistaJson}
          opcionesUnidadResponsable={this.state.unidadResponsable}
          opcionesMunicipio={this.state.municipio}
          mostrar={this.state.detalleModal}
          cerrarModal={this.cerrarModal}
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
              <Input
                id="descripcion"
                label="descripcion"
                value={this.state.descripcion}
                onChange={this.change}
              />

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

              <Input
                id="observacion"
                label="observacion"
                value={this.state.observacion}
                onChange={this.change}
              />
            </div>
          </div>
          <div className="contenedor">
            <this.BotonAgregar />
          </div>
        </div>
        <div className="contenedor">
          {this.renderTablaDatos()}
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

export { VistaRedux as RCalendarioHabilU }
