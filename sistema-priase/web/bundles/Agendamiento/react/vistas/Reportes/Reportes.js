import React, { Component } from 'react'
import { Captcha,Input,Botonera, Combo, Tabla,Fecha } from 'appfuture-react'

import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'

import Peticion from '../Assets/util/peticion'
import URL from '../../global/rutas_api'
import PropTypes from 'prop-types';
import { Util } from '../Assets/util/Util'
import Modal from '../Assets/componentes/Modal'
import Autocompletado from '../Assets/componentes/Autocompletado'
import axios from 'axios';
import { mostrarAlerta } from '../../store/actions/AplicacionAcciones';


const TIPOS_REPORTE = {
    REPORTE_GENERAL: 'Agendamiento_General',
    REPORTE_INSTALACIONES: 'Agendamiento_ResInstalaciones'
};

class Reportes extends Component {
    //inicialización de variables

    state = {
        lista: [],
        listaEliminar: [],
        mostrar: false,
        proceso: '-1',
        contratante: '-1',
        unidadResponsable: '-1',
        municipio:'-1',
        fechainicial:'',
        fechafinal:'',
    }

    peticion = new Peticion(this)

    /**
     * Realiza las consultas para listar los elementos que irán en los combobox
     * @param noAplica
     * @returns {No aplica}
     */

    async componentDidMount() {
        await this.peticion.get({
            url: URL.FRECUENCIA_AGENDAMIENTO_DEMANDA.PROCESO,
            config: ['uniProceso', 'prcDescripcion'],
            json: 'procesoJson',
            value: 'proceso',
        })
        await this.peticion.get({
            url: URL.FRECUENCIA_AGENDAMIENTO_DEMANDA.LISTAR_MUNICIPIOS,
            config: ['ciudadIderegistro', 'ciudadNom'],
            json: 'municipioJson',
            value: 'municipio',
        })
        await this.peticion.get({
            config: ['empresaSevemp', 'empresaCod', 'empresaNom'],
            url: URL.EDICIONACTIVIDADES.CONSULTAR_CONTRATANTE,
            json: 'contratanteJson',
            value: 'contratante',
        })
    }

    //Arreglo con los id y nombre de columnas para el componente Tabla

    columnas = [
        {
            Header: 'Agendamiento',

            columns: [
                { Header: 'Id',accessor: 'item' },
                { Header: 'Municipio',accessor: 'municipio' },
                //{ Header: 'Id Usuario',accessor: 'ideusuario'},
                { Header: 'Codigo',accessor: 'codigo'},
                { Header: 'Nombre',accessor: 'nombre'},
                { Header: 'Direccion',accessor: 'direccion'},
                { Header: 'Barrio',accessor: 'barrio'},
                { Header: 'Actividad',accessor: 'actividad'},
                { Header: 'Cuadrilla',accessor: 'cuadrilla'},
               // { Header: 'Fecha Programacion',accessor: 'fechaprogramacion'},
            ],
        },
    ]

    /**
    * Valida que un valor sea diferente de vacio o -1.
    * @return {Boolean}
    */
    validarValor = (valor) => {
        return !valor || valor == '' || valor == '-1';
    }

    /**
    * Validará el formulario
    * @return {Object}
    */
    validarFormulario = () => {
        const { contratante, proceso, fechainicial, fechafinal } = this.state;
        if (this.validarValor(contratante)) {
          return { respuesta: false, mensaje: 'Debe seleccionar una empresa.' };
        }
        if (this.validarValor(proceso)) {
          return { respuesta: false, mensaje: 'Debe seleccionar un proceso.' };
        }
        if (this.validarValor(fechainicial)) {
          return { respuesta: false, mensaje: 'Debe seleccionar una fecha inicial.' };
        }
        if (this.validarValor(fechafinal)) {
          return { respuesta: false, mensaje: 'Debe seleccionar una fecha final.' };
        }
        return { respuesta: true };
    };

    //Validar para comentar
    /*obtenerFunciones = () => {
        return [
          { texto: 'Buscar', callback: this.consultar },
          { texto: 'Exportar XLS', callback: this.exportarXLS },
          { texto: 'Exportar Detalle XLS', callback: this.exportarDetalleXLS },          
        ];
    };*/

    guardarArchivo = (respuesta) => {
        let a = document.createElement('a');
        a.href = 'data:' + { type: "Content-Type: application/vnd.ms-excel" } + ';base64,' + respuesta.data.datos;
        a.download = "Reporte.xls";
        a.target = '_blank';
        a.click();
    };


    change = async ({ target: { id, value } }) => {
        this.setState({ [id]: value })
        
        if ( id === 'proceso' ) {
            if (this.state.contratante === '-1') {
                return false
            }
            axios.post(URL.REPORTES.LISTAR_UNIDADES_RESPONSABLES, {
                proceso: Util.obtenerId(value),
                idempresa:  Util.obtenerId(this.state.contratante,0)
            }).then(respuesta => {
                const datos = this.obtenerDatos(respuesta);
                this.setState({ unidadResponsableJson: datos });
            })
        }

        if (id === 'contratante') {
            if (this.state.proceso !== "-1") {
                axios.post(URL.REPORTES.LISTAR_UNIDADES_RESPONSABLES, {
                    proceso: Util.obtenerId(this.state.proceso , 0),
                    idempresa:  Util.obtenerId(value)
                }).then(respuesta => {
                    const datos = this.obtenerDatos(respuesta);
                    this.setState({ unidadResponsableJson: datos });
                })    
            }
        }
    }

    obtenerDatos = (response, defaultData = []) => {
        return Array.isArray(response.data) ? response.data : defaultData;
    };

    consultar = () => {
        const respuesta = this.validarFormulario();
        if (!respuesta.respuesta) {
          this.props.mostrarAlerta('Información', respuesta.mensaje);
          return;
        }
        this.peticion
                .post({
                    url: URL.REPORTES.CONSULTA_REPORTE,
                    parametros: { contratante: Util.obtenerId(this.state.contratante,1),
                                  proceso:Util.obtenerId(this.state.proceso),
                                  municipio:Util.obtenerId(this.state.municipio),
                                  unidadresponsable:Util.obtenerId(this.state.unidadResponsable),
                                  fechainicio:Util.obtenerId(this.state.fechainicial),
                                  fechafin:Util.obtenerId(this.state.fechafinal),
                                },
                                  
                }) .then((data) => {
                    if (data != null) {
                        const lista = data.map((fila,i) => {                            
                            return {    
                                item:i+1,                 
                                municipio:`${fila.municipio}`,
                                //ideusuario: `${fila.idSuscritpor}`,
                                codigo:`${fila.codigo}`,
                                nombre:`${fila.usuario}`,
                                direccion:`${fila.direccion}`,
                                barrio:`${fila.barrio}`,
                                actividad:`${fila.tipoVisita}`,
                                cuadrilla:`${fila.unidadResponsable}`,
                               // fechaprogramacion:`${fila.fechaProgramacion}`,
                            }
                        })
                        this.setState({ lista })
                    } else {
                        this.setState({
                            lista: [],
                            cantidad: '',
                            actividad: '',    
                        })
                    }
                })                           
    };

    exportarXLS = () => {
        const respuesta = this.validarFormulario();
        if (!respuesta.respuesta) {
          this.props.mostrarAlerta('Información', respuesta.mensaje);
          return;
        }
        axios.post(
                    URL.REPORTES.EXPORTAR_REPORTE,
                    {   empresa: Util.obtenerId(this.state.contratante,1),
                        proceso:Util.obtenerId(this.state.proceso),
                        municipio:Util.obtenerId(this.state.municipio),
                        unidadResponsable:Util.obtenerId(this.state.unidadResponsable),
                        fechaInicial:Util.obtenerId(this.state.fechainicial),
                        fechaFinal:Util.obtenerId(this.state.fechafinal),
                        nombreReporte:TIPOS_REPORTE.REPORTE_GENERAL,
                    },
                                  
                ).then(respuesta => {
                    if (respuesta.data.codigo > 0) {
                      this.guardarArchivo(respuesta);
                    }
                });
    };

    exportarDetalleXLS = () => {
        const respuesta = this.validarFormulario();
        if (!respuesta.respuesta) {
          this.props.mostrarAlerta('Información', respuesta.mensaje);
          return;
        }
        axios.post(
                    URL.REPORTES.EXPORTAR_REPORTE,
                    {   empresa: Util.obtenerId(this.state.contratante,1),
                        proceso:Util.obtenerId(this.state.proceso),
                        municipio:Util.obtenerId(this.state.municipio),
                        unidadResponsable:Util.obtenerId(this.state.unidadResponsable),
                        fechaInicial:Util.obtenerId(this.state.fechainicial),
                        fechaFinal:Util.obtenerId(this.state.fechafinal),
                        nombreReporte:TIPOS_REPORTE.REPORTE_INSTALACIONES,
                    },
                                  
                ).then(respuesta => {
                    if (respuesta.data.codigo > 0) {
                      this.guardarArchivo(respuesta);
                    }
                });
    };

    descargarReporte = () => {
        const respuesta = this.validarFormulario();
        if (!respuesta.respuesta) {
          this.props.mostrarAlerta('Información', respuesta.mensaje);
          return;
        }
        const { contratante, proceso, fechainicial, fechafinal, municipio, unidadResponsable } = this.state;
        axios.post(URL.REPORTE_AGENDAMIENTO.EXPORTAR_REPORTE, {
          "empresa": Util.obtenerId(contratante,1),
          "proceso": Util.obtenerId(proceso),
          "fechaInicial": fechainicial,
          "fechaFinal": fechafinal,
          "nombreReporte": "Agendamiento_Ugii",
          "municipio": Util.obtenerId(municipio),
          "unidadResponsable": Util.obtenerId(unidadResponsable)
        }).then(respuesta => {
          if (respuesta.data.codigo > 0) {
            this.guardarArchivo(respuesta);
          } else {
            this.props.mostrarAlerta('Error', 'Lo sentimos, no hemos podido generar el reporte.');
          }
        });
      }
  
    render() {
        return (
            <React.Fragment>
                <h1>Empresa - Reportes</h1>                
                <Modal
                    titulo={this.state.titulo}
                    texto={this.state.texto}
                    mostrar={this.state.mostrar}
                    ocultarAlerta={this.change}
                    botones={this.botones}
                />
                <div className="caja contenedor">
                    <label className="tag">Reportes</label>

                    <div className="formulario">
                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="contratante"
                            label="contratante *"
                            value={this.state.contratante}
                            opciones={this.state.contratanteJson}
                            onChange={this.change}
                        />
                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="proceso"
                            label="proceso"
                            value={this.state.proceso}
                            opciones={this.state.procesoJson}
                            onChange={this.change}
                        />
                        <Combo
                            propTexto="cuadrillaNom"
                            propValor="ureIderegistro"
                            id="unidadResponsable"
                            label="unidad responsable"
                            value={this.state.unidadResponsable}
                            opciones={this.state.unidadResponsableJson}
                            onChange={this.change}
                        />
                        <Autocompletado
                            id="municipio"
                            label="municipio"
                            marcaAgua={'Escriba el código o el municipio'}
                            opciones={this.state.municipioJson}
                            onChange={this.change}
                            value={this.state.municipio}
                        />
                        <Fecha
                            id="fechainicial"
                            label="Fecha Inicial *"                            
                            value={this.state.fechaini}
                            onChange={this.change}      
                        />
                        <Fecha
                            id="fechafinal"
                            label="Fecha Final *"                            
                            value={this.state.fechafin}
                            onChange={this.change}
                        />  

                        <div className='col-md-12'>
                            <button className='btn btn-primary mr-3' onClick={this.consultar}>Consultar</button>
                            <button className='btn btn-primary mr-3' onClick={this.exportarXLS}>exportarXLS</button>
                            <button className='btn btn-primary mr-3' onClick={this.exportarDetalleXLS}>exportarDetalleXLS</button>
                            <button className='btn btn-primary mr-3' onClick={this.descargarReporte}>Programacion OIA</button>
                        </div>                 
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

Reportes.propTypes = {
    mostrarAlerta: PropTypes.func
}

const mapStateToProps =
    //inicialización de variables

    (state) => {
        return {}
    }

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({mostrarAlerta}, dispatch)
}

const VistaRedux = connect(
    mapStateToProps,
    mapDispatchToProps
)(Reportes)

export { VistaRedux as RReportes }
