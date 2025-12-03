import React, { Component } from "react";
import "../FormDetalleSuscripcion.scss";

class TablaConsultaPQR extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { listaPqr } = this.props;
    return (
      <div>
        <table className="table table-hover">
          <thead className="text-center align-self-center">
            <tr>
              <th scope="col">Fecha Solicitud</th>
              <th scope="col">Radicado</th>
              <th scope="col">Tipo servicio</th>
              <th scope="col">Tipo atención</th>
              <th scope="col">Sección</th>
              <th scope="col">Servicio</th>
              <th scope="col">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {listaPqr.map((pqr, index) => (
              <tr key={`pqr-${index}`}>
                <td>{pqr.fechaSolicitud}</td>
                <td>{pqr.radicado}</td>
                <td>{pqr.tipoServicio}</td>
                <td>{pqr.tipoAtencion}</td>
                <td>{pqr.seccion}</td>
                <td>{pqr.servicio}</td>
                <td>{pqr.observaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr style={{ borderTop: "1px solid #007bff" }} />
      </div>
    );
  }
}

export default TablaConsultaPQR;
