import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Interruptor.scss';

class Interruptor extends Component {
  state = { _id: this.props.id };

  onChange = (e) => this.props.onChange({ ...e, target: { id: this.state._id, value: e.target.checked } })

  render() {
    const { cols, label, extra, required } = this.props;

    const lblRequired = required ? '*' : '';

    const className = this.props.className
      ? `form-group col-${cols} interruptor ${className}`
      : `form-group col-${cols} interruptor`;

    return (
      <div className={className}>
        <label htmlFor={this.state._id}>{label}{lblRequired}</label>

        <input
          id={this.state._id}
          type="checkbox"
          checked={this.props.value}
          onChange={this.onChange}
          {...extra}/>
      </div>
    )
  }
}

Interruptor.propTypes = {
  id: PropTypes.string,
  cols: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};

Interruptor.defaultProps = {
  cols: '4',
  value: false,
  required: false,
}

export default Interruptor;
