import React, { Component } from 'react'
import { Util } from 'appfuture-react'
import ModalBoostrap from 'react-bootstrap4-modal'

class Modal extends Component {
    constructor(props) {
        super(props)
    }

    renderBotones = (botones) => {
        const contexto = this
        if (!Util.validarArreglo(botones)) {
            return (
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                        contexto.props.ocultarAlerta({
                            target: { id: 'mostrar', value: false },
                        })
                    }>
                    Cerrar
                </button>
            )
        }
        return botones.map((btn, index) => {
            let callback = this.props.ocultarAlerta
            if (btn.callback) {
                callback = () => {
                    contexto.props.ocultarAlerta({
                        target: { id: 'mostrar', value: false },
                    })
                    btn.callback()
                }
            }

            if (!btn.clase) {
                btn.clase = 'btn-default'
            }

            return (
                <button
                    type="button"
                    key={index}
                    className={`btn ${btn.clase}`}
                    onClick={callback}>
                    {btn.texto}
                </button>
            )
        })
    }

    render() {
        const { titulo, texto, botones, mostrar } = this.props
        return (
            <ModalBoostrap visible={mostrar==null?false:mostrar}>
                <div className="modal-header">
                    <h4 className="modal-title">
                        <b>{titulo}</b>
                    </h4>
                </div>
                <div className="modal-body">
                    <div className="col-sm-10">{texto}</div>
                </div>
                <div className="modal-footer">
                    {this.renderBotones(botones)}
                </div>
            </ModalBoostrap>
        )
    }
}

export default Modal
