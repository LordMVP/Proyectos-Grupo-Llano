import React, { Component } from 'react'
import VisitasSearch from '../../../components/search/VisitasSearch'
// import DynamicTable from '../../components/Table/DynamicTable'
import ConsolidadoHistoricoTable from '../../../components/Table/ConsolidadoHistoricoTable'
import { connect } from 'react-redux'
import { LoadAforosHistoricos, clearAforosHistoricosResult  } from '../../../actions/aforos/generalHistoricos'
import {  loadMunicipio, loadTipoUso, loadUbicacion,loadEstrato, loadCiclo, loadRuta, loadTiposAforo } from '../../../actions/aforos/selects'
import { bindActionCreators } from 'redux'
import Loader from '../../../components/loader/Init'


class Consultar extends Component<{ aforos?: any, actions: any, aforosHistoricos_result: any, selects: any }> {
    state = {
        loading: false,
        data: [],
        ocultarTabla:true
    }
    componentDidMount() {
        this.props.actions.loadMunicipio(); //then get barrio
        this.props.actions.loadUbicacion();
        this.props.actions.loadEstrato();
        this.props.actions.loadTipoUso();
        this.props.actions.loadCiclo();
        this.props.actions.loadRuta();
        this.props.actions.loadTiposAforo();
         this.setState({ data: this.props.aforosHistoricos_result || [] })
    }

    onSubmit = async (data: any) => {
        console.log("data submit searchhh",data)
        this.setState({ ocultarTabla: true })
        this.props.actions.clearAforosHistoricosResult()
        this.setState({ loading: true })
        await this.props.actions.LoadAforosHistoricos(data, () => {
            
            this.setState({ loading: false })
            this.setState({ data: this.props.aforosHistoricos_result || [] })
            if(!this.state.data.length){
    
                this.setState({ ocultarTabla: false })
            }
        })
        console.log("props.visitas::::====>",this.props.aforosHistoricos_result,"data::::",data)
        

    }
    clear = () => {
        this.props.actions.clearAforosHistoricosResult()
        this.setState({ data: ()=>this.props.aforosHistoricos_result || [] })
        this.setState({ ocultarTabla: true })
    }

    render() {
        

        return (
            <div>
                <VisitasSearch
                onSubmit={this.onSubmit}
                clear={this.clear}
                selects={this.props.selects}
                />
                {this.state.loading && <Loader isRelative />}
                
                { !!this.state.data.length?
                    <ConsolidadoHistoricoTable   data={this.state.data || []}  />:
                    <div style={{color: '#0069D9',marginTop:'30px'}} hidden={this.state.ocultarTabla}> No se han encontrado datos...</div>
                    }
            </div>
        )
    }
}

const mapToStateToprops = state => {
    return {
        aforosHistoricos_result: state.aforosHistoricos_result,
        selects: state.selects,

    }
}
const mapToDispatchToProps = dispatch => {

    return {
        actions: bindActionCreators({ LoadAforosHistoricos, clearAforosHistoricosResult , loadMunicipio, loadTipoUso, loadUbicacion, loadEstrato, loadCiclo, loadRuta, loadTiposAforo }, dispatch)
    }
}

export default connect(mapToStateToprops, mapToDispatchToProps)(Consultar)