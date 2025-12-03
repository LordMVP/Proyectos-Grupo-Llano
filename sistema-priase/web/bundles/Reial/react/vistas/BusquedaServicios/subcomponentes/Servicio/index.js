import React, { Component } from 'react'
import { Botonera, Combo, Input, Tab, VentanaDialogo, Tabla } from 'appfuture-react'

import Actividades from './Actividades'
import Adjuntos from './Adjuntos'
import Detalle from './Detalle'
import Materiales from './Materiales'
import NoConformidades from './NoConformidades'
import Novedades from './Novedades'
import Peticion from '../../../../global/peticion'
import axios from 'axios';
import API from '../../../../global/rutas_api'
import Util from '../../../../global/util'

/**
 *
 *
 * @class Servicio
 * @extends {Component}
 */
class Servicio extends Component {
  /**
   *Define estados iniciales
   * @memberof ActividadesMunicipios
   */
  state = {
    detalleModal: false,
    dialogoModal: false,
    servicio: null,
    idServicio: '',
    // defecto
    observacion: '',
    estado: '-1',
    estadoJson: [
      { valor: true, texto: 'Ejecutar' },
      { valor: false, texto: 'Pendiente' },
    ],
    etapa: '',
    agendaNom:'',
    etapaNom:'',
    fechaVenta: '',
    fechaProgramacion: '',
    direccion: '',
    actividades: [],
    adjuntos: [],
    detalle: [],
    materiales: [],
    noConformidades: [],
    novedades: [],
    listaNovedades: [],
    tituloM:'Materiales',
    tituloA:'Actividades',
    tituloNc:'No Conformidades',
    tituloNo:'Novedades',
    tituloAd:'Adjuntos'
  }

  columnas = [
    {
      Header: 'Busqueda',

      columns: [
       // { Header: 'Suscriptor', accessor: 'suscriptorNombre' },
        { Header: 'Servicio', accessor: 'servicioNombre' },
       // { Header: 'Orden de Trabajo', accessor: 'ordenTrabajo' },
        { Header: 'Agenda', accessor: 'nombreAgenda' },
        { Header: 'Cuadrilla', accessor: 'cuadrilla' },
        {
          Header: 'Acción',
          id: 'accion',
          Cell: (props) => {
            const {
              suscriptor,
              id,
              ordenTrabajo,
              agenda,
              sigueCodemp,
              sigueIde

            } = props.original
            const deshabilitar =
              Util.validarObjeto({ suscriptor, id, ordenTrabajo, agenda })

            /* prettier-ignore */

            return (
              <button
                className="btn"
                onClick={
                  async (e) => {
                    await this.props.onChange(props.original);
                    this.consultarDatos();
                  }}
                disabled={!deshabilitar}
              >
                <span>ver</span>
              </button>
            )
          },
        },
      ],
    },
  ]
  // interno

  /**
   * Método encargado de consultar datos por etapa
   * @method
   * @async
   */
  consultarDatos = async () => {
    const { value: servicio } = this.props
    await this.setState({
      observacion: servicio.sigueObservaciones,
      etapa: servicio.id,
      servicio: servicio,
      listaConsultaColaborador: [],
      listaConsultaActividades: [],
      tituloM:"Materiales - Etapa:"+servicio.servicioNombre,
      tituloA:"Actividades - Etapa:"+servicio.servicioNombre,
      tituloNc:"No Conformidades - Etapa:"+servicio.servicioNombre,
      tituloNo:"Novedades- Etapa:"+servicio.servicioNombre,
      tituloAd:"Adjuntos- Etapa:"+servicio.servicioNombre,
    });
    // etapaJson
    Peticion.post({
      url: API.BUSQUEDA_SERVICIOS.CONSULTAR_ETAPA,
      parametros: {
        ordenTrabajo: servicio.ordenTrabajo,
        suscripcion: Util.obtenerId(servicio.suscriptor),
        idEmpresa: servicio.contratante,
      },
      config: {
        valor: 'servicioCod',
        texto: 'servicioNom',
        json: 'servicios',
      },
      callback: (etapaJson) => this.setState({ etapaJson }),
    });
		/*
		Materiales
		*/
    Peticion.post({
      url: API.BUSQUEDA_SERVICIOS.LISTAR_COLABORADORES_MATERIALES,
      parametros: {
        empresaContratante: servicio.contratante,
      },
      config: {
        valor: 'cuadrillaCod',
        texto: 'cuadrillaNom',
        textoComoValor: true,
      },
      callback: (colaboradorMaterialesJson) => this.setState({ colaboradorMaterialesJson }),
    })
    const listaMaterial = await Peticion.post({
      url: API.BUSQUEDA_SERVICIOS.LISTAR_MATERIALES,
      parametros: {
        empresa: servicio.contratante,
        etapa: servicio.id
      },
      config: {
        valor: 'materialCod',
        texto: 'materialNom',
        textoComoValor: true,
      },
      callback: (materialJson) => this.setState({ materialJson }),
    });
    this.setState({ listaMaterial })
    axios.post(API.BUSQUEDA_SERVICIOS.CONSULTAR_MATERIALES, {
      ordenTrabajo: servicio.ordenTrabajo,
      servicio: servicio.id,
      suscripcion: servicio.suscriptor,
    }).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        let lista = respuesta.data.datos.map(fila => {
          fila.material = (typeof fila.material == 'string') ? fila.material : fila.material.materialNom;
          return fila;
        });
        this.setState({ listaConsultaColaborador: lista });
      }
    });

		/*
		Actividades
		*/
    // colaboradorJson
    Peticion.post({
      url: API.BUSQUEDA_SERVICIOS.LISTAR_COLABORADORES_ACTIVIDADES,
      parametros: {
        empresaContratante: servicio.contratante,
        empresaContratista: servicio.contratista,
      },
      config: {
        valor: 'colCodiemple',
        id: 'colNumcontr',
        texto: 'colApellidos',
        textoComoValor: true,
      },
      callback: (colaboradorActividadesJson) => {

        colaboradorActividadesJson = colaboradorActividadesJson.map(c => {
          let valor = c.colCodiemple + ' - ' + c.colNumcontr + ' - ' + c.colMombres + ' ' + c.colApellidos;
          valor = valor.replace(/\s+/g, ' ').trim();
          return {
            texto: valor,
            valor: valor,
            colCodiemple: c.colCodiemple,
            cargCodcargo: c.cargCodcargo
          };
        });
        this.setState({ colaboradorActividadesJson });
      }
    });

    //consulta actividades
    let listaConsultaActividades = await Peticion.post({
      url: API.BUSQUEDA_SERVICIOS.CONSULTAR_ACTIVIDADES,
      parametros: {
        sigueIde: servicio.sigueIde,
        servicio: servicio.id,
        suscriptor:servicio.suscriptor,
        contratante: servicio.contratante,
      },
    });

    listaConsultaActividades = listaConsultaActividades.map(function (dato) {
      let { actividad, colaborador } = dato
      return {
        ancIderegistro: dato.ejeIdejecuci,
        audEstado:dato.audEstado,
        actDescripci: actividad.actDescripci,
        ejeCantactiv: dato.ejeCantactiv,
        conNomcontra: `${colaborador.colMombres.trim()} ${colaborador.colApellidos.trim()}`,
        ejeFechejec: dato.ejeFechejec,
      }
    });

    this.setState({ listaConsultaActividades });
		/*
		No conformidades
		*/
    // colaboradorJson
    //Se usa la misma ruta de colaboradores materiales
    // noConformidadJson
    Peticion.post({
      url: API.BUSQUEDA_SERVICIOS.LISTAR_NO_CONFORMES,
      parametros: { empresaContratante: servicio.contratante },
      config: ['noconformeCod', 'noconformeNom'],
      config: {
        valor: 'noconformeCod',
        texto: 'noconformeNom',
        textoComoValor: true,
      },
      callback: (noConformidadJson) =>
        this.setState({ noConformidadJson }),
    });

    // defectologiaJson
    Peticion.post({
      url: API.BUSQUEDA_SERVICIOS.LISTAR_DEFECTOLOGIAS,
      parametros: { empresaContratante: servicio.contratante },
      config: {
        valor: 'defectologiaCoduni',
        texto: 'defectologiaNom',
        textoComoValor: true,
      },
      callback: (defectologiaJson) => this.setState({ defectologiaJson }),
    });

    //lista
    axios.post(API.BUSQUEDA_SERVICIOS.CONSULTAR_NO_CONFORMIDADES, { ordenTrabajo: servicio.ordenTrabajo, servicio: servicio.id, suscripcion: servicio.suscriptor })
      .then(respuesta => {
        if(respuesta.status==200 && respuesta.data.datos!=null ){
          let datos = (respuesta.data.datos.length > 0) ? respuesta.data.datos : [];
          datos = datos.map(function (dato) {
            let { noConforme, defectologia } = dato
            return {
              ancIderegistro: dato.ancIderegistro,
              ancCodigonoconformidad: noConforme.noconformeCod,
              ancNombrenoconformidad: noConforme.noconformeNom,
              ancCodigodefectologia: defectologia.defectologiaCod,
              ancNombredefectologia: defectologia.defectologiaNom,
              ancDescripcionapertura: dato.ancDescripcionapertura,
            }
          });
          this.setState({ listaNoConformidades: datos });
        }
      });

		/*
		Novedades
		*/
    Peticion.get({
      url: API.BUSQUEDA_SERVICIOS.FILTRAR_CUADRILLAS,
      config: {
        valor: 'cuadrillaCod',
        texto: 'cuadrillaNom',
        textoComoValor: true,
      },
      callback: cuadrillaJson => this.setState({ cuadrillaJson }),
    });

    // novedadJson
    Peticion.post({
      url: API.BUSQUEDA_SERVICIOS.BUSCAR_NOVEDAD,
      parametros: {
        empresaContratante: servicio.contratante
      },
      config: {
        valor: 'novedadCod',
        texto: 'novedadNom',
        textoComoValor: true,
      },
      callback: novedadJson => this.setState({ novedadJson }),
    });


    //lista

    axios.post(API.BUSQUEDA_SERVICIOS.CONSULTAR_NOVEDADES, {
      suscriptor: Util.obtenerId(servicio.suscriptor),
      ordenTrabajo: servicio.ordenTrabajo,
      servicio: servicio.id
    }).then(respuesta => {
      let data = respuesta.data;
      if (respuesta.data.length > 0) {
        data.map(fila => {
          fila.cuadrilla = `${fila.cuadrilla.cuadrillaCod} - ${fila.cuadrilla.cuadrillaNom}`
          return fila
        });
      }
      this.setState({ listaNovedades: data });
    });

    // consultarSuscriptor
    this.consultarSuscriptor()
  };

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
   * Despliega el modal para ver el Detalle
   * @method
   */

  handleDetalle = () => {
    this.setState({ detalleModal: !this.state.detalleModal })
  }

  /**
   * Despliega el modal para ver la acción a ejecutar, guardar o cancelar
   * @method
   */
  handleDialogo = () => {
    this.setState({ dialogoModal: !this.state.dialogoModal })
  }

  /**
 * cambia la etapa de acuerdo a la selección del valor
 * @method
 * @async
 * @param {value} value -Valor digitado para cambiar la etapa
 */
  cambiarEtapa = async ({ target: { value } }) => {
    let servicio = await Peticion.post({
      url: API.BUSQUEDA_SERVICIOS.BUSCAR_SERVICIO,
      parametros: {
        servicio: Util.obtenerId(value),
        suscriptor: Util.obtenerId(this.state.servicio.suscriptor),
      },
    })

    if (servicio.length == undefined) return // no hay datos

    servicio = servicio[0];
    const { servicios, suscriptores } = servicio;
    servicio = {
      id: servicios.servicioCod,
      agenda: servicio.sigueCodage,
      nombreAgenda: servicio.sigueCodageNom,
      contratante: servicio.sigueCodemp,
      contratista: servicio.sigueEmpcon,
      cuadrilla: servicio.sigueCodcua,
      nombreCuadrilla: servicio.sigueCodcuaNom,
      ordenTrabajo: servicio.sigueOrdtra,
      suscriptor: suscriptores.clienteCodsus,
      suscriptorNombre: suscriptores.clienteNomsus,
      servicioNombre: servicios.servicioNom,      
    }

    this.setState({ servicio, etapa: value });  
     
  }

  /**
   *
   *Consultar suscriptor
   * @method
   * @async
   */
  async consultarSuscriptor() {
    let { value: servicio } = this.props

    axios.post(API.BUSQUEDA_SERVICIOS.CONSULTAR_SUSCRIPTOR, {
      sigueIde: this.props.value.sigueIde
    }).then(res => {
      if (res.codigo <= 0 || !res.data.datos.sigueIde) {
        return;
      }

      res = res.data.datos;

      const fechaVenta = res.ventas.ventaFecven;
      const fechaProgramacion = res.sigueFecage
        ? res.sigueFecage : 'Sin fecha';

      this.setState({
        idServicio: res.sigueIde,
        fechaProgramacion: fechaProgramacion,
        fechaVenta: fechaVenta,
        direccion: res.propiedad.proDireccion,
        observacion: res.sigueObservaciones,
        nombre: res.tercero.terNombre
      });
    });

  }

  /**
 * Se ejecuta al momento de pulsar sobre el bot�n Guardar
 * @method
 * @async
 */
  guardar = async () => {
    //filtrar eliminar propiedades que el objeto json en el backend no require
    let materiales = [...this.state.materiales];
    materiales = materiales.map(fila => {
      delete fila.material;
      return fila;
    });

    let novedades = this.state.novedades
    novedades.map(fila => {
      delete fila.visitaNomcua;
      // delete fila.visitaNomnov;
      delete fila.cuadrilla;
      fila.visitaCodemp = (this.props.value) ? this.props.value.contratante : null;
      fila.visitaCoddepemp = (this.props.value) ? this.props.value.sigueCoddepemp : null;
    });

    let actividades = this.state.actividades
    actividades.map(fila => {
      fila.etaIdeetapa = this.state.etapa === '-1' ? '' : Util.obtenerId(this.state.etapa);
      fila.colNumcontr = fila.colNumContr;
    });

    //crear objeto json
    const parametros = {
      sigueSwteje: this.state.estado === '-1' ? false : this.state.estado,
      sigueIde: this.props.value.sigueIde,
      sigueObservaciones: this.state.observacion,
      tranMateriales: materiales,
      prcoTrejeacteta: this.state.actividades,
      alisNoconformidades: this.state.noConformidades,
      visitas: novedades,
    }

    const respuesta = await Peticion.post({
      url: API.BUSQUEDA_SERVICIOS.REGISTRAR_TODOS,
      parametros,
    });

    if (respuesta.codigo > 0) {
    } else {
      this.setState({ dialogoModal: false });
    }

  }

  /**
   *
   *Habilita el bot�n guardar
   *@method
   *@param {Object} props
   *@return {JSX} Componente - Button
   */
  BotonGuardar = () => {
    return (this.state.estado != '' && this.state.estado != '-1' && this.state.etapa != '' && this.state.etapa != '-1')
      ? <button className="btn" onClick={this.guardar}>Guardar</button>
      : <button className="btn" disabled={true}>Guardar</button>
  };

  /**
   *Renderiza la vista 
   * @return {JSX} componente - returna vista jsx 
   */
  render() {
    return (
      <React.Fragment>
        
        <fieldset className="contenedor">
          <legend>Datos suscriptor</legend>

            <div className="contenedor formulario" label='General'>          
              <Input
                id="suscriptor"
                label="suscriptor"
                value={this.props.lista[0].suscriptorCodigo}
                extra={{ disabled: true }}
              />

              <Input
                id="nombre"
                label="nombre"
                value={this.props.lista[0].suscriptorNombre}
                extra={{ disabled: true }}
              />

              <Input
                id="direccion"
                label="direccion"
                value={this.props.lista[0].suscriptorDireccion}
                extra={{ disabled: true }}
              />

              <Input
                id="telefono"
                label="Telefono"
                value={this.props.lista[0].suscriptorTelefono}
                extra={{ disabled: true }}
              />                        
           </div>
        </fieldset>  

        <Detalle
          servicio={this.props.value}
          fechaVenta={this.state.fechaVenta}
          fechaAprobacion={this.state.fechaProgramacion}
          mostrar={this.state.detalleModal}
          cerrarModal={this.handleDetalle}
        />
        {/* <VentanaDialogo
          titulo="Confirmación"
          texto="¿Confirma transacción?"
          mostrar={this.state.dialogoModal}
          botones={this.botones}
        /> */}
        <Tab className="contenedor">
          <Tabla
            label="Etapa"
            datos={this.props.lista}
            columnas={this.columnas}
          />

          <Materiales
            label={this.state.tituloM}
            id={this.state.idServicio}
            colaboradorJson={this.state.colaboradorMaterialesJson}
            listaColaborador={this.state.listaColaborador}
            materialJson={this.state.materialJson}
            listaMaterial={this.state.listaMaterial}
            lista={this.state.listaConsultaColaborador}
            servicio={this.state.servicio}
            value={this.state.materiales}
            onChange={this.change}
            guardar={this.guardar}
          />

          <Actividades
            label={this.state.tituloA}
            id={this.state.idServicio}
            colaboradorJson={this.state.colaboradorActividadesJson}
            lista={this.state.listaConsultaActividades}
            servicio={this.state.servicio}
            value={this.state.actividades}
            onChange={this.change}
            idRegistro={(this.state.servicio != null) ? this.state.servicio.sigueCoddepemp : ''}
            sigueIde={(this.state.servicio != null) ? this.state.servicio.sigueIde : ''}
            etapa={this.state.etapa}
            guardar={this.guardar}
          />

          <NoConformidades
            label={this.state.tituloNc}
            id={this.state.idServicio}
            colaboradorJson={this.state.colaboradorMaterialesJson}
            noConformidadJson={this.state.noConformidadJson}
            defectologiaJson={this.state.defectologiaJson}
            lista={this.state.listaNoConformidades}
            servicio={this.state.servicio}
            value={this.state.noConformidades}
            onChange={this.change}
            guardar={this.guardar}
          />

          <Novedades
            label={this.state.tituloNo}
            id={this.state.idServicio}
            cuadrillaJson={this.state.cuadrillaJson}
            novedadJson={this.state.novedadJson}
            lista={this.state.listaNovedades}
            servicio={this.state.servicio}
            value={this.state.novedades}
            onChange={this.change}
            guardar={this.guardar}
          />

          <Adjuntos
            label={this.state.tituloAd}
            id={this.state.idServicio}
            servicio={this.state.servicio}
            value={this.state.adjuntos}
            onChange={this.change}
            guardar={this.guardar}
          />          
        </Tab>
      </React.Fragment>
    )
  }
}

export default Servicio
