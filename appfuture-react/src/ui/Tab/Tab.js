import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Tab.scss';

class Tabs extends Component {
  state = { index: 0 };

  render() {
    const { children } = this.props;

    const titulos = children.map((child, index) => {
      const className = this.state.index === index ? 'tab__seleccionado' : 'tab__titulo';

      return (
        <div
          key={index}
          onClick={e => this.setState({ index })}
          className={className}>

          {child.props.label}
        </div>
      );
    });

    const contenido = children[this.state.index];

    const className = this.props.className ? `tab ${this.props.className}` : 'tab';

    return (
      <div className={className}>
        <div className='tab__cabecera'>{titulos}</div>
        <div className='tab__contenido'>{contenido}</div>
      </div>
    );
  }
}

Tabs.propTypes = {
  className: PropTypes.string,
  children: PropTypes.array,
}

Tabs.defaultProps = {
  className: '',
  children: [],
}


export default Tabs
