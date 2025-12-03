import React, { Component, Fragment } from 'react'
import { Combo, Botonera,Fecha } from 'appfuture-react'
import axios from 'axios';

import RUTAS_API from '../../global/rutas_api';

import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'

const TIPOS_REPORTE = {
	INSTALACIONES_REALIZADAS: 'TEC_instalacionesrealizadas.jrxml',
	INSTALACIONES_ASIGNADAS_SE: 'TEC_AsignadasSinEjecutar_InsNue.jrxml',
	INSTALACIONES_ASIGNADAS: 'TEC_Asignadas_InsNue.jrxml',
	INSTALACIONES_PENDIENTES_PP: 'TEC_PendientesPago_InsNue.jrxml',
	INSTALACIONES_SC_SP:'TEC_EjecutadasSinCer_InsNue.jrxml',
	INSTALACIONES_PAGADAS:'TEC_InsPag_InsNue.jrxml'	
};

const REPORTES = {
	REACT_APP_SERVER_REPORT:'http://10.43.51.150/',
	REACT_APP_CONTEXTO:'JasperRecibo-1.0-SNAPSHOT/ws/ConsultasReciboJsonWS',
	REACT_APP_JNDI:'java:/Poolllanogas',
	REACT_APP_FORMAT:'xlsx',
	REACT_APP_ROOTPATH:'/var/www/html/ReportesAchagua/'
};

class ReporteInstalacionesR extends Component {
	state = {		
		desde: '',
		hasta: '',
		listaContratantes: [],		
		contratante: '',
		tipoReporte: '',
		contratista:'',
		listaReportes: [
			{valor: TIPOS_REPORTE.INSTALACIONES_REALIZADAS,texto:'Instalaciones Realizadas'	},
			{valor: TIPOS_REPORTE.INSTALACIONES_ASIGNADAS_SE,texto:'Instalaciones Asignadas Sin Ejecutar'	},
			{valor: TIPOS_REPORTE.INSTALACIONES_ASIGNADAS,texto:'Instalaciones Asignadas'	},
			{valor: TIPOS_REPORTE.INSTALACIONES_PENDIENTES_PP,texto:'Instalaciones Pendientes por Pagar'	},
			{valor: TIPOS_REPORTE.INSTALACIONES_SC_SP,texto:'Instalaciones Sin Certificar Sin Pagar'	},
			{valor: TIPOS_REPORTE.INSTALACIONES_PAGADAS,texto:'Instalaciones Pagadas'	}
		],  
	}

	componentDidMount() {		
		this.consultarContratantes();
		this.consultarContratistas();
	}

	//Funciones Botones
	obtenerFunciones = () => {
		return [
		  { texto: 'Descargar', callback: this.buscar },	  
		];
	};

	controlarCambio = (evento) => {
		let change = {};
		change[evento.target.name] = evento.target.value;		
		this.setState(change);
	};

	consultarContratantes = () => {
		axios.post(RUTAS_API.REPORTE_ACTIVIDADES_COLABORADOR.CONSULTAR_CONTRATANTES)
		  .then(respuesta => {
			if (respuesta.data.codigo > 0) {
			  this.setState({ listaContratantes: respuesta.data.datos });
			}
		});
	};

	consultarContratistas = () => {
		axios.post(RUTAS_API.REPORTE_ACTIVIDADES_COLABORADOR.CONSULTAR_CONTRATISTAS)
		  .then(respuesta => {
			if (respuesta.data.codigo > 0) {			
			  this.setState({ contratista:  respuesta.data.datos[0].empresaCod})
			}
		});
	};

	//Funcionalidades
	buscar = () => {
		if(this.state.tipoReporte==TIPOS_REPORTE.INSTALACIONES_REALIZADAS){
			this.descargarReporteIr();
		}else if(this.state.tipoReporte==TIPOS_REPORTE.INSTALACIONES_PENDIENTES_PP || this.state.tipoReporte==TIPOS_REPORTE.INSTALACIONES_PAGADAS){
			this.descargarReporteSc();
		}else{
			this.descargarReporte();
		}
	};

	descargarReporteIr =() =>{
		axios({
			url: REPORTES.REACT_APP_SERVER_REPORT+'/'+REPORTES.REACT_APP_CONTEXTO,
			method: 'POST',
			responseType: 'blob',
			data:{
			"jndi": REPORTES.REACT_APP_JNDI, 
			"format": REPORTES.REACT_APP_FORMAT,
			"reportName": REPORTES.REACT_APP_ROOTPATH+this.state.tipoReporte,
			"parameters": {
				"PR_STR_FECHAINICIAL": "'"+this.state.desde+"'",
				"PR_STR_FECHAFINAL": "'"+this.state.hasta+"'",
				"PR_STR_EMPRESA":"'"+this.state.contratante+"'"
				}
			}
		}).then((response) => {
			const data = window.URL.createObjectURL(new Blob([response.data]));			
			var tempLink = document.createElement('a');
			tempLink.href = data;
			tempLink.setAttribute('download', 'Instalaciones_Realizadas.xlsx');
			tempLink.click();			
		});
	};

	descargarReporte = () =>{
		axios({
			url: REPORTES.REACT_APP_SERVER_REPORT+'/'+REPORTES.REACT_APP_CONTEXTO,
			method: 'POST',
			responseType: 'blob',
			data:{
			"jndi": REPORTES.REACT_APP_JNDI, 
			"format": REPORTES.REACT_APP_FORMAT,
			"reportName": REPORTES.REACT_APP_ROOTPATH+this.state.tipoReporte,
			"parameters": {
				"PR_STR_FECINI": this.state.desde,
				"PR_STR_FECFIN": this.state.hasta,
				"PR_STR_EMPRESA":this.state.contratante,
				"PR_STR_CONTRATISTA":"'"+this.state.contratista+"'",
				"PR_STR_USUARIO":"86071584"
				}
			}
		}).then((response) => {
			const data = window.URL.createObjectURL(new Blob([response.data]));			
			var tempLink = document.createElement('a');
			tempLink.href = data;
			tempLink.setAttribute('download', 'Reporte_Instalaciones.xlsx');
			tempLink.click();			
		});
	};

	descargarReporteSc = () =>{
		axios({
			url: REPORTES.REACT_APP_SERVER_REPORT+'/'+REPORTES.REACT_APP_CONTEXTO,
			method: 'POST',
			responseType: 'blob',
			data:{
			"jndi": REPORTES.REACT_APP_JNDI, 
			"format": REPORTES.REACT_APP_FORMAT,
			"reportName": REPORTES.REACT_APP_ROOTPATH+this.state.tipoReporte,
			"parameters": {
				"PR_STR_FECINI": this.state.desde,
				"PR_STR_FECFIN": this.state.hasta,
				"PR_STR_EMPRESA":this.state.contratante,
				"PR_STR_CONTRATISTA":this.state.contratista,
				"PR_STR_USUARIO":"86071584"
				}
			}
		}).then((response) => {
			const data = window.URL.createObjectURL(new Blob([response.data]));			
			var tempLink = document.createElement('a');
			tempLink.href = data;
			tempLink.setAttribute('download', 'Reporte_Instalaciones.xlsx');
			tempLink.click();			
		});
	};
	
	render() {
		return (
		  <Fragment>
			<h1>Reporte Instalaciones</h1>
				
			<div className='Contratante'>
			  <div className='contenedor formulario mt-5'>
				<Combo
				  opciones={this.state.listaContratantes}
				  propTexto='empresaNom'
				  propValor='empresaCod'
				  label='Contratante:*'
				  name='contratante'
				  value={this.state.contratante}
				  onChange={this.controlarCambio}
				/>
				<Combo
				  opciones={this.state.listaReportes}
				  propTexto='texto'
				  propValor='valor'
				  label='Tipo Reporte:*'
				  name='tipoReporte'
				  value={this.state.tipoReporte}
				  onChange={this.controlarCambio}
				/>                     
				<Fecha
				  label='Desde*:'
				  name='desde'
				  fecha={this.state.desde}
				  onChange={this.controlarCambio}
				/>
				<Fecha
				  label='Hasta*:'
				  name='hasta'
				  fecha={this.state.hasta}
				  onChange={this.controlarCambio}
				/>			         
			  </div>			
			</div>

			<div className='d-flex justify-content-center'>
			  <Botonera funciones={this.obtenerFunciones()} />
			</div>
		  </Fragment>
		);
	}
}

// redux

const mapStateToProps = (state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({}, dispatch)
}

const VistaRedux = connect(
	mapStateToProps,
	mapDispatchToProps
)(ReporteInstalacionesR)

export { VistaRedux as RReporteInstalacionesR }
