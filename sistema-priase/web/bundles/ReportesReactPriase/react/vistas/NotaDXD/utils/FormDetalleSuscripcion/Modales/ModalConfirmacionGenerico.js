import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

class RModalConfirmacionGenerico extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { closeModal, mensaje, aceptar, error, tituloModal, aceptModal } = this.props;

    return (
      <Fragment>
        <Modal show={true} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{tituloModal}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>{mensaje}</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant={error ? "danger" : "primary"} onClick={closeModal}>
              Cerrar
            </Button>
            {!!aceptar && (
              <Button variant={"primary"} onClick={aceptModal}>
                Continuar
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export const ModalConfirmacionGenerico = connect(
  mapStateToProps,
  mapDispatchToProps
)(RModalConfirmacionGenerico);
