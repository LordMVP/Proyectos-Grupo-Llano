import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './VentanaDialogo.scss';

class VentanaDialogo extends Component {
    Botonera = () => {
        const { botones } = this.props, botonera = [];

        for (let index in botones) {
            let boton = botones[index]

            if (!boton.clase) { boton.clase = 'btn-default' }

            botonera.push(
                <button className={`btn ${boton.clase}`} onClick={boton.callback} key={index}>
                    { boton.texto }
                </button>
            );
        }

        return botonera;
    }

    render () {
        const { props: { titulo, texto, mostrar }, Botonera } = this;

        return (
            <div
                className={ mostrar ? 'modal dialogo activo' : 'modal dialogo' }
                role="dialog"
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header dialogo__titulo">
                            <h6>{ titulo }</h6>
                        </div>

                        <div className="modal-body dialogo__texto">
                            <div>{ texto }</div>
                        </div>

                        <div className="modal-footer dialogo__botones">
                            <Botonera/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

VentanaDialogo.propTypes = {
    titulo: PropTypes.string,
    texto: PropTypes.string,
    botones: PropTypes.array,
    mostrar: PropTypes.bool
};

VentanaDialogo.defaultProps = {
    titulo: 'Dialogo',
    mostrar: true,
};

export default VentanaDialogo;
