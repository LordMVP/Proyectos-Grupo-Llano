import React, { Component } from 'react';
import Suggest from 'react-autosuggest';
import PropTypes from 'prop-types';
//import {Util} from '../../util/Util';

import './Autocompletado.scss';

class Autocompletado extends Component {
  state = {
    _id: this.props.id,
    value: this.props.value,
    sugerencias: [],
  };

  theme = {
    container: 'autocompletado',
    containerOpen: 'activo',
    input: 'form-control',
    inputOpen: 'activo',
    inputFocused: 'enfocado',
    suggestionsContainer: 'autocompletado__contenedor',
    suggestionsContainerOpen:'activo',
    suggestionsList: 'autocompletado__lista',
    suggestion: 'autocompletado__sugerencia',
    suggestionFirst: 'primero',
    suggestionHighlighted: 'activo',
    sectionContainer: 'autocompletado__seccion',
    sectionContainerFirst: 'primero',
    sectionTitle: 'autocompletado__titulo'
  }

  componentDidUpdate (prev) {
    if (this.props.opciones !== prev.opciones) {
      this.setState({ sugerencias: this.props.opciones },()=>{
        console.log('desde autocompletado sugerencias')
        console.log(this.state.sugerencias)
      })
      
    }
  }

  onChange = (e, { newValue }) => {
    this.setState({ value: newValue })

    this.props.onChange({ target: { id: this.props.id, value: newValue } })
  }

  obtenerSugerencias = (valor) => {
    const input = valor.trim().toLowerCase();
    const filtro = this.props.opciones.filter(function (sugerencia) {
      if (sugerencia.texto) return sugerencia.texto.toLowerCase().slice(0, input.length) === input

      return true
    });

    return input.length === 0 ? [] : filtro;
  }

  render () {
    const { label, className, placeholder, cols, required, extra } = this.props

    // attrs

    const inputProps = {
      ...extra,
      placeholder: placeholder,
      required: required,
      value: this.state.value,
      onChange: this.onChange
    };

    const classNameElement = className
      ? `form-group col-${cols} ${className}`
      : `form-group col-${cols}`;

    const lblRequired = required ? '*' : '';

    return (
      <div className={classNameElement}>
        <label htmlFor={this.state._id}>{label}{lblRequired}</label>

        <Suggest
          id={this.state._id}
          theme={this.theme}
          suggestions={this.state.sugerencias}
          onSuggestionsFetchRequested={e => this.setState({ sugerencias: this.obtenerSugerencias(e.value) })}
          onSuggestionsClearRequested={() => this.setState({ sugerencias: [] })}
          getSuggestionValue={sugerencia => sugerencia.texto}
          renderSuggestion={sugerencia => <div>{ sugerencia.texto }</div>}
          inputProps={inputProps}
        />
      </div>
    );
  }
}

Autocompletado.propTypes = {
  opciones: PropTypes.array,
  type: PropTypes.string,
  placeholder: PropTypes.string,
};

Autocompletado.defaultProps = {
  cols: '4',
  type: 'text',
  value: '',
  opciones: []
};

export default Autocompletado;