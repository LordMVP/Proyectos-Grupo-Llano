import React, { Component } from 'react';

import Busqueda from './subcomponentes/Busqueda';
import Gestion from './subcomponentes/Gestion';

// redux

import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';

/**
 *
 *
 * @class ConsultaPeriodos
 * @extends {Component}
 */
class ConsultaPeriodos extends Component {
    /**
 *Define estados iniciales
 * @memberof ConsultaPeriodos
 */
    state = {
        periodo: null
    }

	/**
     * Cambia el valor del estado asociado a cada componente
     * @method
     * @async
     * @param {int} id al nombre del estado que se desea modificar
     * @param {(int|string)} value del componente correspondiente al dato
     * que se visualizará en el componente
     */
    change = (periodo) => this.setState({ periodo })

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */
    render() {
        /* prettier-ignore */

        return this.state.periodo
            ? <Gestion value={this.state.periodo} onChange={this.change} />
            : <Busqueda onChange={this.change} />;
    }
}

// redux

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ConsultaPeriodos);

export { VistaRedux as RConsultaPeriodos };
