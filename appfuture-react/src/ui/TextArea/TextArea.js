import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Util} from '../../util/Util';

class TextArea extends Component {
  state = { _id: this.props.id || Util.generarIdControl('txt') };

  onChange = (event) => {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  };

  render() {
    const {cols, label, name, className, textAreaClassName, value, extra, required} = this.props;

    const lblRequired = required ? '*' : '';

    return (
      <div className={`form-group col-${cols} ${className}`}>
        <label htmlFor={this.state._id}>{label}{lblRequired}</label>
        <textarea
          name={name}
          id={this.state._id}
          className={`form-control ${textAreaClassName}`}
          onChange={this.onChange}
          value={value}
          {...extra}
        />
      </div>
    );
  }
}

// adwher: placeholder, required y maxLength pueden ser especificados como propiedades en extra

TextArea.propTypes = {
  id: PropTypes.string,
  cols: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  textAreaClassName: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.any,
  extra: PropTypes.object
};

TextArea.defaultProps = {
  cols: '12',
  className: '',
  textAreaClassName: '',
  value: '',
  required: false,
};

export default TextArea;
