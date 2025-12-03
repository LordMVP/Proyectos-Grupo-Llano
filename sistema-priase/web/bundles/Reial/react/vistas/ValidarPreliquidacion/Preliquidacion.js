import React, { Component, Fragment } from 'react';

//import Consulta from './subcomponentes/Consulta'
import Generacion from './subcomponentes/Generacion'
import Valida from './subcomponentes/ValidarPreliquidacion'

import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'


class Preliquidacion extends Component {
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
              <Generacion onChange={this.change}/>
          )
      }
           
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch)
}

const VistaRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(Preliquidacion)

export { VistaRedux as RPreliquidacion }

