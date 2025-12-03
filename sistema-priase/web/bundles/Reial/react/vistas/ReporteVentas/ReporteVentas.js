import React, { Component } from 'react';
import { Combo, Input } from 'appfuture-react';

import Util from '../../global/util'
import Peticion from '../../global/peticion';

// redux

import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';

class ReporteVentas extends Component {
    state = {
        // defecto

        colaborador: '-1'
    }

    // componentenes

    BotonGenerar = (props) => {
        /* prettier-ignore */

        return Util.validarObjeto(this.state)
            ? <button className="btn" onClick={this.generar}>generar</button>
            : <button className="btn" disabled={true}>generar</button>
    }

    // interno

    componentDidMount () {

    }

    change = ({ target: { id, value } }) => this.setState({ [id]: value })

    // vista

    generar = () => {
        if (window.confirm('¿Confirma transacción?')) {

        }
    }

    render () {
        return (
            <React.Fragment>
                <div className="contenedor fila">
                    <Input
                        id="fechaInicial"
                        label="fecha inicial"
                        type="date"
                        value={this.state.fechaInicial}
                        onChange={this.change}/>

                    <Input
                        id="fechaFinal"
                        label="fecha final"
                        type="date"
                        value={this.state.fechaFinal}
                        onChange={this.change}/>

                    <Combo
                        id="colaborador"
                        label="colaborador"
                        data={this.state.colaboradorJson}
                        value={this.state.colaborador}
                        onChange={this.change}/>
                </div>

                <div className="contenedor botones"><this.BotonGenerar/></div>
            </React.Fragment>
        );
    }
}

// redux

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ReporteVentas);

export { VistaRedux as RReporteVentas };
