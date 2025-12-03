import React, { Component } from 'react'
import VisitasSearch from '../../../components/search/VisitasSearch'
// import DynamicTable from '../../components/Table/DynamicTable'
import AforoVisitasTable from '../../../components/Table/AforoVisitasTable'
import { connect } from 'react-redux'
import { loadAforosVisitas, clearAforosVisitasResult  } from '../../../actions/aforos/generalVisitasActions'
import {  loadMunicipio, loadTipoUso, loadUbicacion,loadEstrato, loadCiclo, loadRuta, loadTiposAforo } from '../../../actions/aforos/selects'
import { bindActionCreators } from 'redux'
import Loader from '../../../components/loader/Init'


class Consultar extends Component<{ aforos?: any, actions: any, aforosVisitas: any, selects: any }> {
    state = {
        loading: false,
        direction:{
            idAforo:'asc',
            fechaFinal:'asc',
            estado:'asc',
            actividad:'asc',
        },
        data: [],
        databuscado:true
    }
    componentDidMount() {
        this.props.actions.loadMunicipio(); //then get barrio
        this.props.actions.loadUbicacion();
        this.props.actions.loadEstrato();
        this.props.actions.loadTipoUso();
        this.props.actions.loadCiclo();
        this.props.actions.loadRuta();
        this.props.actions.loadTiposAforo();
         this.setState({ data: this.props.aforosVisitas || [] })
    }

    onSubmit = async (data: any) => {
        console.log("data submit searchhh",data)
        this.setState({ databuscado: true })
        this.props.actions.clearAforosVisitasResult()
        this.setState({ loading: true })
        this.props.actions.loadAforosVisitas(data, () => {
            
            this.setState({ loading: false })
            console.log('que llego ',this.props.aforosVisitas);
            this.setState({ data: this.props.aforosVisitas || [] })
            if(!this.state.data.length){
    
                this.setState({ databuscado: false })
            }
        })
        console.log("props.visitas::::====>",this.props.aforosVisitas,"data::::",data)
        

    }
    clear = () => {
        this.props.actions.clearAforosVisitasResult()
        this.setState({ data: ()=>this.props.aforosVisitas || [] })
        this.setState({ databuscado: true })
    }

    // sortBy=(key)=>{ 
    //     console.log("key:",key)
    //     if(key==='idAforo' || key==='volumenTotal'){
    //         this.setState({
    //         data:this.props.aforosVisitas.sort( (a:any,b:any)=>(
    //             this.state.direction[key]==='asc'?
    //                 a[key]-b[key]:b[key]-a[key] )),
    //         direction:{
    //             ...this.state.direction,[key]:this.state.direction[key]==='asc'?
    //             'desc':'asc'}
    //         })

    //     }else{
    //         this.setState({
    //             data:this.props.aforosVisitas.sort( (a:any,b:any)=>(
    //                 this.state.direction[key]==='asc'?a[key] < b[key]:a[key] > b[key])),
    //             direction:{
    //                 ...this.state.direction,[key]:this.state.direction[key]==='asc'?
    //                 'desc':'asc'}
    //             })
    //          }
        
    // }
    render() {
        

        return (
            <div>
                <VisitasSearch
                onSubmit={this.onSubmit}
                clear={this.clear}
                selects={this.props.selects}
                />
                {this.state.loading && <Loader isRelative />}
                {/* <DynamicTable
                data={this.state.data || []}
                sortBy={this.sortBy}
                /> */}
                
                { !!this.state.data.length?
                    
                    <AforoVisitasTable   data={this.state.data || []}  />:
                    <div style={{color: '#0069D9',marginTop:'30px'}} hidden={this.state.databuscado}> No se han encontrado datos...</div>
                    }
            </div>
        )
    }
}

const mapToStateToprops = state => {
    return {
        aforosVisitas: state.aforosVisitas,
        selects: state.selects,

    }
}
const mapToDispatchToProps = dispatch => {

    return {
        actions: bindActionCreators({ loadAforosVisitas, clearAforosVisitasResult , loadMunicipio, loadTipoUso, loadUbicacion, loadEstrato, loadCiclo, loadRuta, loadTiposAforo }, dispatch)
    }
}

export default connect(mapToStateToprops, mapToDispatchToProps)(Consultar)