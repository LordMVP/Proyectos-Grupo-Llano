import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

class GenComImpuestos extends Component{
  state = {
  }

  componentDidMount() {
  }

  render() {
    const { index, impuestos, controlarModal } = this.props;
    return (
      <Fragment>
        <div className="modal-header">
          <h5 className="modal-title">Impuestos</h5>
        </div>
        <div className="modal-body">
          {impuestos.length > 0 ? 
          <table className='table'>
            <thead>
              <tr>
                <th scope="col">Tipo</th>
                <th scope="col">Valor</th>
              </tr>
            </thead>
            <tbody>
              {impuestos.map((impuesto, jindex) =>
              <tr key={`impuesto-${jindex}`}>
                <td>{impuesto.irc_porcentaje}</td>
                <td>{impuesto.irc_valor}</td>
              </tr>)}
            </tbody>
          </table> :
          "No hay impuestos para esta entrada"}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => controlarModal(
              index, 'mostrarModalImpuesto')}>
            Cerrar</button>
        </div>
      </Fragment>
    );
  }
}

GenComImpuestos.propTypes = {
  impuestos: PropTypes.array,
  index: PropTypes.number,
  controlarModal: PropTypes.func,
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GenComImpuestos);

export { VistaRedux as RGenComImpuestos };