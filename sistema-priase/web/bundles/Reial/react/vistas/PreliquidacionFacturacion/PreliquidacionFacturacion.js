import React, { Component } from 'react'
import { Autocompletado, Combo, Input, Tabla, VentanaDialogo } from 'appfuture-react'

import Consulta from './subcomponentes/Consulta'
//import Generacion from './subcomponentes/Generacion'
import Valida from './subcomponentes/Valida'

// redux

import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'

class PreliquidacionFacturacion extends Component {
    state = {    
       accion:0
    }

    change = (accion) =>this.setState({accion});
	render () {

        if(this.state.accion ==1){
            return (
                <Valida onChange={this.change}/>
            )
        }else if(this.state.accion ==2){
            return (
                <Valida onChange={this.change}/>
            )
        }else{
            return (
                <Consulta onChange={this.change}/>
            )
        }
        
        //return this.state.consultar
        //    ? <Consulta onChange={this.change}/>
        //    : <Generacion onChange={this.change}/>
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
)(PreliquidacionFacturacion)

export { VistaRedux as RPreliquidacionFacturacion }
