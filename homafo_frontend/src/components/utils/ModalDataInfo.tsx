import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Spinner from "react-loader-spinner";
type Props = {
  show: boolean;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  title?: string;
  children?: JSX.Element;
  onHide: () => void;
  onSubmit?: () => void;
  textSubmit?: string;
  size?: "sm" | "lg" | "xl";
};

export default function ModalDataInfo(props: Props) {
  //props
  const {
    show,
    variant = "primary",
    textSubmit = "Aceptar",
    title = "",
    children,
    onHide,
    onSubmit,
    size = "sm",
  } = props;
  //states
  const [loading, setLoading] = useState<boolean>(false);
  //methods
  const handleSubmit = () => {
    if (onSubmit) onSubmit();
    setLoading(true);
  };

  const handleCloseModal = () => {
    if (!loading) onHide();
  };
  //effects
  useEffect(() => {
    if (show) {
      setLoading(false);
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleCloseModal} size={size} animation={true}>
      <Modal.Header
        className={`${
          variant === "primary"
            ? "bg-primary"
            : variant === "secondary"
            ? "bg-secondary"
            : variant === "success"
            ? "bg-success"
            : variant === "danger"
            ? "bg-danger"
            : variant === "warning"
            ? "bg-warning"
            : ""
        } text-white`}
      >
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          disabled={loading}
          onClick={handleCloseModal}
          className="mr-3"
        >
          Cerrar
        </Button>

        {onSubmit && (
          <Button
            variant={variant}
            disabled={loading}
            onClick={handleSubmit}
            className="mr-3"
          >
            {loading ? (
              <Spinner
                type="Oval"
                color="#fff"
                height={25}
                width={35}
                strokeWidth={10}
              />
            ) : (
              textSubmit
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
