import React, { Component } from "react";
import Modal from "react-bootstrap4-modal";

import "react-table/react-table.css";
import "../FormDetalleSuscripcion.scss";

class ModalCambioDatos extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      cerrarModal,
      aceptarModal,
      mensaje,
      titulo,
      aceptarOption,
      closeOption = true,
    } = this.props;
    return (
      <Modal
        visible={true}
        onClickBackdrop={cerrarModal}
        style={{
          display: "flex",
        }}
      >
        <div className="modal-header">
          <h5 className="modal-title">{titulo}</h5>
        </div>
        <div className="modal-body">{mensaje}</div>
        <div className="modal-footer">
          {!!aceptarOption && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={aceptarModal}
            >
              Aceptar
            </button>
          )}
          {!!closeOption && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={cerrarModal}
            >
              Cancelar
            </button>
          )}
        </div>
      </Modal>
    );
  }
}

export default ModalCambioDatos;
