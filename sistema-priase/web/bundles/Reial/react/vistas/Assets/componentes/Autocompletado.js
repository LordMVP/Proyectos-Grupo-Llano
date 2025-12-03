import React, { Component } from 'react'
import axios from 'axios'
import Autosuggest from 'react-autosuggest'
import URL from '../../../global/rutas_api'
import Peticion from '../util/peticion'
import PropTypes from 'prop-types'
import './Autocompletado.scss'

class AutoCompletado extends Component {
  constructor(props) {
    super(props)

    this.state = {
      _id: this.props.id,
      value: this.props.value,
      suggestions: [],
      arreglo: this.props.opciones,
    }
    this.getSuggestionValue = this.getSuggestionValue.bind(this)
  }

  /**
   * Actualiza los estados de las propiedades cuando se alteran en el padre
   * @param prevProps Propiedad que almacena los cambios previos
   * de los estados del padre CalendarioHábil, en particular de:
   * lista, value y limpieza
   * @return {No aplica}
   */

  componentDidUpdate(prevProps) {
    //actualiza la lista de opciones
    if (this.props.opciones !== prevProps.opciones) {
      this.setState({
        arreglo: this.props.opciones,
      })
    }
    //reinicia el campo
    if (this.props.value !== prevProps.value) {
      if (this.props.value === '-1') {
        this.onChange(null, { newValue: '', method: null })
        this.props.onChange({
          target: { id: 'autocompletado', value: undefined },
        })
      }
    }
  }

  theme = {
    container: 'autocompletado',
    containerOpen: 'activo',
    input: 'form-control',
    inputOpen: 'activo',
    inputFocused: 'enfocado',
    suggestionsContainer: 'autocompletado__contenedor',
    suggestionsContainerOpen: 'activo',
    suggestionsList: 'autocompletado__lista',
    suggestion: 'autocompletado__sugerencia',
    suggestionFirst: 'primero',
    suggestionHighlighted: 'activo',
    sectionContainer: 'autocompletado__seccion',
    sectionContainerFirst: 'primero',
    sectionTitle: 'autocompletado__titulo',
  }

  peticion = new Peticion(this)

  renderSuggestion(suggestion) {
    return <span>{suggestion.texto}</span>
  }

  getSuggestionValue(suggestion) {
    this.props.onChange({
      target: { id: this.props.id, value: suggestion.texto },
    })
    return suggestion.texto
  }

  escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  getSuggestions(value, arreglo) {
    const escapedValue = this.escapeRegexCharacters(value.trim())

    if (escapedValue === '') {
      return []
    }

    const regex = new RegExp('/*' + escapedValue, 'i')

    return arreglo.filter((language) => regex.test(language.texto))
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue,
    })
    this.props.onChange({ target: { id: this.props.id, value: newValue } })
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value, this.state.arreglo),
    })
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    })
  }

  render() {
    const { value, suggestions } = this.state
    const inputProps = {
      placeholder: this.props.marcaAgua,
      value: this.props.value,
      onChange: this.onChange,
    }
    const className = this.props.className
      ? `form-group col-${this.props.cols} ${this.props.className}`
      : `form-group col-${this.props.cols}`

    return (
      <div className={className}>
        <label htmlFor={this.state._id}>
          {this.props.label || this.state._id}
        </label>
        <Autosuggest
          suggestions={suggestions}
          theme={this.theme}
          onSuggestionsFetchRequested={
            this.onSuggestionsFetchRequested
          }
          onSuggestionsClearRequested={
            this.onSuggestionsClearRequested
          }
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
      </div>
    )
  }
}

AutoCompletado.propTypes = {
  opciones: PropTypes.array,
  type: PropTypes.string,
  placeholder: PropTypes.string,
}

AutoCompletado.defaultProps = {
  cols: '4',
  type: 'text',
  value: '',
  opciones: [],
}

export default AutoCompletado
