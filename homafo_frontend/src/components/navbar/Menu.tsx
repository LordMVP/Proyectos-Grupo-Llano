import React, { Component } from "react";
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import './navbar.css'


class Basic extends Component {

    keys = []
    state = {
        menu: [],
        loading: true,
        searchItem: '',
        menuTmp: [],
        selectedMenu: []
    }


    /**
     * Load Menu
     * 
     */
    componentDidMount = () => {



    }

    render() {


        return (
            <nav>
                <ul>
                    <li><NavLink to="/aforos/normal/consultar">Aforos Bioagricola del Llano </NavLink></li>
                    <li><NavLink to="/aforos/multiusuario" > Multiusuarios</NavLink></li>
                    {/* <li><NavLink to="/aforos/multiusuario" > Servicios Especiales</NavLink></li> */}                    
                    <li><NavLink to="/aforos/liquidacion" > Liquidación</NavLink></li>
                    <li><NavLink to="/aforos/visitas/consultar" > Aforos Visitas </NavLink></li>
                    <li><NavLink to="/aforos/historicosConsolidados/consultar"  > Historicos Consolidados</NavLink></li>
                    <li>--------------------</li>
                    <li><NavLink to="/homologaciones/actualizacion" >Actualizacion y Homologaciones</NavLink></li>
                    <li><NavLink to="/homologaciones/parametrizacion-general" >Parametrizacion general</NavLink></li>
                    <li><NavLink to="/homologaciones/cruceInformacion" >Cruce Informacion Homologacion</NavLink></li>
                    <li><NavLink to="/homologaciones/generacionCartas" >GeneracionCartas Bienvenida</NavLink></li>
                    <li><NavLink to="/homologaciones/actualizacionRapida" >Actualización por APP Homologacion</NavLink></li>
                    <li><NavLink to="/homologaciones/importacionEmpAlterna" >Importar Informacion Empresa Alterna</NavLink></li>
                    <li><NavLink to="/homologaciones/parametrizacionImportacion" >Parametrizacion datos Importacion</NavLink></li>
                </ul>
            </nav>

        );
    }
}
const mapStateToProps = (state) => {
    return {
        authenticated: state.user.authenticated,


    }
}
// function mapDispatchToProps(dispatch) {
//     return {
//         actions: bindActionCreators({
//             ...selectsActions, ...OiaActions
//         }, dispatch)
//     }
// }
export default connect(mapStateToProps)(Basic)