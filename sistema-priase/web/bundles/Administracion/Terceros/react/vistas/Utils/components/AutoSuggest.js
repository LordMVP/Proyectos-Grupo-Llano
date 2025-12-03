import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import { Form, Col } from "react-bootstrap";
import "./theme.scss";

export default class AutoSuggest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: !!this.props.value ? this.props.value : "",
      suggestions: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({ value: this.props.value });
    }
  }

  getSuggestions = (value) => {
    const { options } = this.props;
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    if (inputLength !== 0) {
      let filterOut = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].toLowerCase().slice(0, inputLength) === inputValue) {
          filterOut.push(options[i]);
        }
      }
      return filterOut;
    } else {
      return [];
    }
  };

  getSuggestionValue = (suggestion) => {
    return suggestion;
  };

  renderSuggestion = (suggestion) => <div>{suggestion}</div>;

  onChange = (event, { newValue }) => {
    this.props.changeValue(newValue);
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const { md, label, validation } = this.props;

    const inputProps = {
      placeholder: this.props.placeHolder,
      value,
      onChange: this.onChange,
    };

    return (
      <Form.Group as={Col} md={md}>
        <Form.Label>{label}</Form.Label>
        <Autosuggest
          suggestions={suggestions.slice(0, 5)}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
        {!!validation && (
          <Form.Control.Feedback type="invalid">
            {validation}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    );
  }
}
