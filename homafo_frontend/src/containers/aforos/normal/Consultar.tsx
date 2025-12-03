import React, { Component } from 'react'
import AforosSearch from '../../../components/search/AforosSearch'
import AforoNormalTable from '../../../components/Table/AforoNormalTable'
import { connect } from 'react-redux'
import { LoadAforos, clearAforosResult } from '../../../actions/aforos/generalActions'
import {  loadMunicipio, loadTipoUso, loadUbicacion,loadEstrato, loadCiclo, loadRuta } from '../../../actions/aforos/selects'
import { bindActionCreators } from 'redux'
import Loader from '../../../components/loader/Init'


class Consultar extends Component<{ aforos: any, actions: any, aforos_result: any, selects: any, match:any }> {
    state = {
        loading: false,
        databuscado:true,
        data: [],
    }
    componentDidMount() {
        this.props.actions.loadMunicipio(); //then get barrio
        this.props.actions.loadUbicacion();
        this.props.actions.loadEstrato();
        this.props.actions.loadTipoUso();
        this.props.actions.loadCiclo();
        this.props.actions.loadRuta();
        this.setState({ data: this.props.aforos_result || [] })
        //this.setState({ data: [] })
        //nuevo
        //this.setState({ data:[] })
        //console.log('cargue cosnsultar...',this.props.aforos_result);
    }
    
    componentWillReceiveProps(nextProps) {
        if (this.props.match.path != nextProps.match.path) {
            console.log('llegue...');
            this.clear();
        }
      }

    onSubmit = async (data: any) => {
        console.log("data submit to search",data)
        this.props.actions.clearAforosResult()
        this.setState({ loading: true })
        this.props.actions.LoadAforos(data, () => {
            this.setState({ loading: false })
            console.log('que llego de data ',this.props.aforos_result);
            this.setState({ data: this.props.aforos_result || [] })
            if(!this.state.data.length){
    
                this.setState({ databuscado: false })
            }
        })
        

    }
    clear = () => {
        this.props.actions.clearAforosResult()
        this.setState({ data: ()=>this.props.aforos_result || [] })
        //this.setState({ data: [] })
        this.setState({ databuscado: true })
    }

    render() {
        

        return (
            <div>
                <AforosSearch
                onSubmit={this.onSubmit}
                clear={this.clear}
                selects={this.props.selects}
                />
                {this.state.loading && <Loader isRelative />}
                { !!this.state.data.length?  
                <AforoNormalTable   data={this.state.data || []} urlLinkButton="/aforos/normal/editar"  />:
                <div style={{color: '#0069D9',marginTop:'30px'}} hidden={this.state.databuscado}> No se han encontrado datos...</div>
                }
            </div>
        )
    }
}

const mapToStateToprops = state => {
    return {
        aforos_result: state.aforos_result,
        selects: state.selects,

    }
}
const mapToDispatchToProps = dispatch => {

    return {
        actions: bindActionCreators({ LoadAforos, clearAforosResult, loadMunicipio, loadTipoUso, loadUbicacion, loadEstrato, loadCiclo, loadRuta }, dispatch)
    }
}

export default connect(mapToStateToprops, mapToDispatchToProps)(Consultar)