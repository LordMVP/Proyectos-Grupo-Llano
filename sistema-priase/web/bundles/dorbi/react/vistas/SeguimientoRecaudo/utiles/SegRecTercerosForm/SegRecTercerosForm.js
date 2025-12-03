import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import axios from 'axios';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import Autosuggest from 'react-autosuggest';

import RUTAS_API from '../../../../global/rutas_api';
import { URL_COM } from '../../../../global/constantes';
import './SegRecTercerosForm.scss';

class SegRecTercerosForm extends Component {
  state = {
    terceros: [],
    tercero: { ter_ideregistro: 0 },
    covens: [],
    coven: { uni_ideregistro: 0 },
    ctas: [],
    cta: { bcu_ideregistro: 0 },
    sugerencias: [],
    filtroSugerencias: [],
    valorSugerencia: ''
  }

  /**
   * Método encargado de cargar la lista en la tabla cuando se monte el componente
   */
  componentDidMount() {
    this.obtenerTerceros();
  }

  /**
   * Método encargado de consultar las variables de priorización de conceptos
   */
  obtenerTerceros = () => {
    axios.get(URL_COM+RUTAS_API.COMISION.TERCEROS+'/'+this.props.idPrograma)
      .then(respuesta => this.setState({ terceros: respuesta.data.datos },
        () => this.obtenerValoresSugerencias()))
      .catch((error) => console.log(error));
  }

  obtenerConvenios = (tercero) => {
    axios.get(URL_COM+RUTAS_API.COMISION.COVEN+'/'+tercero.ter_documento)
      .then(respuesta => this.setState({ covens: respuesta.data.datos }, () => {
        const { consulta } = this.props;
        const { covens } = this.state;

        if (consulta.uni_medpago) {
          const index = covens.findIndex(coven =>
            coven.uni_ideregistro === consulta.uni_medpago);

          if (index > -1) {
            this.setState({ coven: covens[index] },
              () => this.obtenerCtas(this.state.coven));
          }
        }
      }));
  }

  obtenerCtas = (coven) => {
    const { tercero } = this.state;
    axios.get(URL_COM+RUTAS_API.COMISION.CTAS+'/'+tercero.ter_ideregistro+'/'+coven.uni_ideregistro)
      .then(respuesta => {
        this.setState({ ctas: respuesta.data.datos }, () => {
          const { consulta } = this.props;
          const { ctas } = this.state;

          if (consulta.bcu_ideregistro) {
            const index = ctas.findIndex(cta =>
              cta.bcu_ideregistro === consulta.bcu_ideregistro);
            
            if (index > -1) {
              this.setState({ cta: ctas[index] });
            }
          }
        })
      });
  }

  obtenerValoresSugerencias = () => {
    const { terceros } = this.state;
    const sugerencias = [];

    terceros.forEach(tercero => {
      const ter_ideregistro = tercero.ter_ideregistro;
      const ter_documento = tercero.ter_documento;
      sugerencias.push({ ter_ideregistro, ter_documento });
    });

    this.setState({ sugerencias });
  }

  actualizarTercero = (evento) => {
    const { terceros } = this.state;
    const ter_ideregistro = Number(evento.target.value);
    this.setState({ coven: { uni_ideregistro: 0 } });
    
    if (ter_ideregistro === 0) {
      this.setState({
        tercero: { ter_ideregistro: 0 },
        valorSugerencia: '',
        covens: [],
        coven: { uni_ideregistro: 0 },
        ctas: [],
        cta: { bcu_ideregistro: 0 }
      }, () => {
        const { tercero, coven, cta } = this.state;

        const ter_ideregistro = tercero.ter_ideregistro;
        const uni_ideregistro = coven.uni_ideregistro;
        const bcu_ideregistro = cta.bcu_ideregistro;

        this.props.modificarTercero(ter_ideregistro, uni_ideregistro, bcu_ideregistro);
      });
    } else {
      const index = terceros.findIndex(tercero =>
        tercero.ter_ideregistro === ter_ideregistro);

      this.obtenerConvenios(terceros[index]);
      
      this.setState({
        tercero: terceros[index],
        valorSugerencia: terceros[index].ter_documento,
        covens: [],
        coven: { uni_ideregistro: 0 },
        ctas: [],
        cta: { bcu_ideregistro: 0 }
      }, () => {
        const { tercero, coven, cta } = this.state;

        const ter_ideregistro = tercero.ter_ideregistro;
        const uni_ideregistro = coven.uni_ideregistro;
        const bcu_ideregistro = cta.bcu_ideregistro;

        this.props.modificarTercero(ter_ideregistro, uni_ideregistro, bcu_ideregistro);
      });
    }
  }

  actualizarDocumento = (sugerencia) => {
    const { terceros } = this.state;

    const index = terceros.findIndex(tercero =>
      tercero.ter_ideregistro === sugerencia.ter_ideregistro);

    this.obtenerConvenios(terceros[index]);
    
    this.setState({
      tercero: terceros[index],
      covens: [],
      coven: { uni_ideregistro: 0 },
      ctas: [],
      cta: { bcu_ideregistro: 0 }
    }, () => {
      const { tercero, coven, cta } = this.state;

      const ter_ideregistro = tercero.ter_ideregistro;
      const uni_ideregistro = coven.uni_ideregistro;
      const bcu_ideregistro = cta.bcu_ideregistro;

      this.props.modificarTercero(ter_ideregistro, uni_ideregistro, bcu_ideregistro);
    });

    return sugerencia.ter_documento;
  }

  actualizarCoven = (evento) => {
    const { covens } = this.state;
    const uni_ideregistro = Number(evento.target.value);
    
    if (uni_ideregistro === 0) this.setState({
      coven: { uni_ideregistro: 0 },
      ctas: [],
      cta: { bcu_ideregistro: 0 }
    });
    else {
      const index = covens.findIndex(coven =>
        coven.uni_ideregistro === uni_ideregistro);
      
      this.obtenerCtas(covens[index]);
      
      this.setState({
        coven: covens[index],
        ctas: [],
        cta: { bcu_ideregistro: 0 }
      }, () => {
        const { tercero, coven, cta } = this.state;

        const ter_ideregistro = tercero.ter_ideregistro;
        const uni_ideregistro = coven.uni_ideregistro;
        const bcu_ideregistro = cta.bcu_ideregistro;

        this.props.modificarTercero(ter_ideregistro, uni_ideregistro, bcu_ideregistro);
      });
    }
  }

  actualizarCta = (evento) => {
    const { ctas } = this.state;
    const bcu_ideregistro = Number(evento.target.value);
    
    if (bcu_ideregistro === 0) this.setState({ cta: { bcu_ideregistro: 0 } });
    else {
      const index = ctas.findIndex(cta =>
        cta.bcu_ideregistro === bcu_ideregistro);
      
      this.setState({ cta: ctas[index] }, () => {
        const { tercero, coven, cta } = this.state;

        const ter_ideregistro = tercero.ter_ideregistro;
        const uni_ideregistro = coven.uni_ideregistro;
        const bcu_ideregistro = cta.bcu_ideregistro;

        this.props.modificarTercero(ter_ideregistro, uni_ideregistro, bcu_ideregistro);
      });
    }
  }

  actualizarValorSugerencia = (evento, { newValue }) => {
    evento.preventDefault();
    this.setState({ valorSugerencia: newValue });
  }

  filtrarSugerencias = (valor) => {
    const escapedValue = valor.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    return this.state.sugerencias.filter(sugerencia =>
      regex.test(sugerencia.ter_documento));
  }
  
  actualizarFlitroSugerencias = ({ value }) =>
    this.setState({ filtroSugerencias: this.filtrarSugerencias(value) });

  borrarFiltroSugerencias = () => this.setState({ filtroSugerencias: [] });

  renderizarSugerencias = (sugerencia) =>
    <span>{sugerencia.ter_documento}</span>;

  render() {
    const {
      cta,
      ctas,
      coven,
      covens,
      terceros,
      tercero,
      filtroSugerencias,
      valorSugerencia } = this.state;
    const inputProps = {
      placeholder: "Filtrar por documento...",
      value: valorSugerencia,
      onChange: this.actualizarValorSugerencia,
      className: "form-control",
      name: "ter_documento"
    };

    return (
      <Fragment>
        <h3><strong>Entidad recaudadora</strong></h3><br/>
        <div className="row">
          <div className="col-3">
            <div className="form-group">
              <label htmlFor="ter_nomcompleto">Entidad</label>
              <select
                id="ter_nomcompleto"
                className="form-control"
                name="ter_nomcompleto"
                value={tercero.ter_ideregistro}
                onChange={this.actualizarTercero}>
                <option value="0">Todos</option>
                {terceros.map((terceroInfo, index) =>
                  <option
                    key={`ter_nomcompleto-${index}`}
                    value={terceroInfo.ter_ideregistro}>{terceroInfo.ter_nomcompleto}</option>
                )}
              </select>
            </div>
          </div>
          <div className="col-3">
            <div className="form-group">
              <label htmlFor="ter_documento">Documento de tercero</label>
              <Autosuggest
                id="ter_documento"
                className="form-control"
                suggestions={filtroSugerencias}
                onSuggestionsFetchRequested={this.actualizarFlitroSugerencias}
                onSuggestionsClearRequested={this.borrarFiltroSugerencias}
                getSuggestionValue={this.actualizarDocumento}
                renderSuggestion={this.renderizarSugerencias}
                inputProps={inputProps}
                />
            </div>
          </div>
          <div className="col-3">
            {tercero.ter_ideregistro !== 0 && <div className="form-group">
              <label htmlFor="coven">Medio de pago / Convenio</label>
              <select
                id="coven"
                className="form-control"
                value={coven.uni_ideregistro}
                onChange={this.actualizarCoven}>
                <option value="0">Todos</option>
                {covens.map((covenInfo, index) =>
                  <option
                    key={`coven-${index}`}
                    value={covenInfo.uni_ideregistro}>{covenInfo.uni_nombre1}</option>
                )}
              </select>
            </div>}
          </div>
          <div className="col-3">
            {(coven.uni_ideregistro !== 0 && cta) && <div className="form-group">
              <label htmlFor="cta">No. de cuentas</label>
              <select
                id="cta"
                className="form-control"
                value={cta.bcu_ideregistro}
                onChange={this.actualizarCta}>
                <option value="0">Todos</option>
                {ctas.map((ctaInfo, index) =>
                  <option
                    key={`cta-${index}`}
                    value={ctaInfo.bcu_ideregistro}>{ctaInfo.bcu_numcuenta}</option>
                )}
              </select>
            </div>}
          </div>
        </div>
      </Fragment>
    );
  }
}

SegRecTercerosForm.propTypes = {
  idPrograma: PropTypes.number,
  modificarTercero: PropTypes.func,
  consulta: PropTypes.object,
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(SegRecTercerosForm);

export { VistaRedux as RSegRecTercerosForm };