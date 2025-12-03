import React, { Component } from 'react'
import { Botonera, Combo, Input, VentanaDialogo } from 'appfuture-react'

import Util from '../../global/util'
import API from '../../global/rutas_api'
import Peticion from '../../global/peticion'
import axios from 'axios'
// redux

import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'

class SucursalesMunicipios extends Component {
	state = {
		dialogoModal: false,
		empresa: '-1',
		contratista: '-1',
		municipio: '-1',
		sucursal: '',
		sucursalJson:[]
	}

	// componentes

	BotonCancelar = () => {
		const { dialogoModal, ...estado } = this.state

		/* prettier-ignore */

		return Util.validarObjeto(estado)
			? <button className="btn" onClick={this.limpiarCampos}>cancelar</button>
			: <button className="btn" disabled={true}>cancelar</button>
    }

	BotonGuardar = () => {
		const { dialogoModal, ...estado } = this.state

        /* prettier-ignore */

        return Util.validarObjeto(estado)
            ? <button className="btn" onClick={this.handleDialogo}>guardar</button>
            : <button className="btn" disabled={true}>guardar</button>
    }

	// interno

	componentDidMount () {
		// empresaJson

		Peticion.post({
			url: API.ACTIVIDADES_MUNICIPIOS.LISTAR_EMPRESAS,
			config: {
				valor: 'empresaCod',
				texto: 'empresaNom',
			},
			callback: empresaJson => this.setState({ empresaJson }),
		})

		// contratistaJson

		Peticion.post({
			url: API.ACTIVIDADES_MUNICIPIOS.LISTAR_CONTRATISTAS,
			config: {
				valor: 'empresaCod',
				texto: 'empresaNom',
			},
			callback: contratistaJson => this.setState({ contratistaJson }),
		})
	}

	componentDidUpdate (props, state) {
		if (state.empresa !== this.state.empresa) {
			if (Util.validarValor(this.state.empresa)) {
				this.cambioEmpresa(this.state.empresa)
			}

			else this.setState({
				municipio: '-1',
				municipioJson: undefined,
			})
		}
	}

	change = ({ target: { id, value } }) => {
		this.setState({ [id]: value })
		switch(id){	
			case "municipio":
				if(value !== '-1'){
					const {municipioJson } = this.state;
					const unidad = municipioJson.find(unidad => unidad.id == value);	
					
					const parametros = {
						ghmusevIdmuncipio: unidad.proyectoIderegistro,
						empresaCodempresa:Util.obtenerId(this.state.empresa),
						conIdecontra:Util.obtenerId(this.state.contratista)
					};
					
					axios.post(API.SUCURSALES_MUNICIPIOS.CONSULTAR_HOMOLOGAR_MUNICIPIO, parametros)
						.then(respuesta => {
							if (respuesta.data.usuIderegistro > 0) {
								const data = respuesta.data;							
								this.setState({ sucursal: data.ghmusevSucursalseven});
								this.setState({ sucursalJson: data});
							}
						});
				} else {this.setState({ sucursal: ''});}	
				break;		
		}
	}	

	crear = () => {
		const { municipio, municipioJson } = this.state;
    	const unidad = municipioJson.find(unidad => unidad.id == municipio);	

		Peticion.post({
			url: API.SUCURSALES_MUNICIPIOS.HOMOLAGAR_MUNICIPIO,
			parametros: {
				ghmusevIderegistro:this.state.sucursalJson.ghmusevIderegistro,
				empresaCodempresa: Util.obtenerId(this.state.empresa),
				conIdecontra: Util.obtenerId(this.state.contratista),
				ghmusevIdmuncipio: unidad.proyectoIderegistro,
				ghmusevSucursalseven: this.state.sucursal,
			}
		})
	}

	guardar = () => {
		this.crear()
		this.limpiarCampos()
		this.handleDialogo(false)
	}

	cambioEmpresa = (empresa = this.state.empresa) => {
		const parametros = {
			proyectoCodemp: Util.obtenerId(empresa)
		};
		
		axios.post(API.ACTIVIDADES_MUNICIPIOS.LISTAR_MUNICIPIOS, parametros)
            .then(respuesta => {
            	const data = respuesta.data;
                	data.forEach(unidad => {
                        unidad.id = unidad.proyectoCod + ' - ' + unidad.proyectoNom;
                        unidad.texto = unidad.proyectoCod + ' - ' + unidad.proyectoNom;
                    });
                this.setState({ municipioJson: data });
            });     
	}

	limpiarCampos = () => {
		this.setState({
			empresa: '-1',
			contratista: '-1',
			municipio: '-1',
			sucursal: '',
		})
	}

	handleDialogo = () => {
		this.setState({ dialogoModal: !this.state.dialogoModal })
	}

	botones = [
		{ texto: 'guardar', callback: this.guardar },
		{ texto: 'cancelar', callback: this.handleDialogo },
	]

	render() {
		const { BotonCancelar, BotonGuardar } = this

		return (
			<React.Fragment>
				<VentanaDialogo
					titulo="Confirmación"
					texto="¿Confirma transacción?"
					mostrar={this.state.dialogoModal}
					botones={this.botones}
				/>

				<h1>Sucursales por municipio</h1>

				<div className="d-flex justify-content-center btn-group">
					<BotonGuardar/>
					<BotonCancelar/>
				</div>

				<div className="contenedor formulario">
					<Combo
						id="empresa"
						label="empresa"
						value={this.state.empresa}
						opciones={this.state.empresaJson}
						onChange={this.change}
						required={true}
					/>

					<Combo
						id="contratista"
						label="contratista"
						value={this.state.contratista}
						opciones={this.state.contratistaJson}
						onChange={this.change}
						required={true}
					/>

					<Combo
						propTexto="texto"
						propValor="id"
						id="municipio"
						label="municipio"
						value={this.state.municipio}
						opciones={this.state.municipioJson}
						onChange={this.change}					
					/>			

					<Input
						id="sucursal"
						label="sucursal"
						value={this.state.sucursal}
						onChange={this.change}
					/>
				</div>
			</React.Fragment>
		)
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
)(SucursalesMunicipios)

export { VistaRedux as RSucursalesMunicipios }
