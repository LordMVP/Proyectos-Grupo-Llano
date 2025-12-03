import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Util } from 'appfuture-react';
import ObjetoFormula from './ObjetoFormula';
import './Calculadora.scss';
import { TECLAS } from '../../../../global/constantes';

export default class Calculadora extends Component {

  state = {
    formula: this.props.formula || [],
    valor: '',
    variable: '',
    funcion: ''
  }

  obtenerFormula = () => {
    return [...this.state.formula];
  };

  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  renderOperadores = () => {
    const funciones = [
      { texto: '+', callback: this.agregarOperador },
      { texto: '-', callback: this.agregarOperador },
      { texto: '*', callback: this.agregarOperador },
      { texto: '/', callback: this.agregarOperador }
    ];
    return <Botonera className='calculadora__botonera' funciones={funciones} />;
  };

  renderParentesis = () => {
    const funciones = [
      { texto: '(', callback: this.agregarParentesis },
      { texto: ')', callback: this.agregarParentesis }
    ];
    return <Botonera className='calculadora__botonera' funciones={funciones} />;
  };

  renderFuncionesBorrado = () => {
    const funciones = [
      { texto: 'C', callback: this.borrarUltimoElemento, title: 'Borrar último elemento' },
      { texto: 'CE', callback: this.borrarTodo, title: 'Borrar Todo' }
    ];
    return <Botonera className='calculadora__botonera' funciones={funciones} />;
  };

  borrarUltimoElemento = () => {
    const formula = [...this.state.formula];
    formula.splice(formula.length - 1);
    this.setState({ formula: [...formula] });
  };

  borrarTodo = () => {
    if (!Util.validarArreglo(this.state.formula)) {
      return;
    }
    this.props.mostrarAlerta('Atención', '¿Confirma que desea borrar toda la fórmula?', [
      { texto: 'Aceptar', clase: 'btn-danger', callback: () => { this.setState({ formula: [] }); } },
      { texto: 'Cancelar', clase: 'btn-default' }
    ]);
  };

  borrarFormulaActual = () => {
    this.setState({ formula: [] });
  };

  renderFormula = () => {
    if (Util.validarArreglo(this.props.formula) && !Util.validarArreglo(this.state.formula)) {
      this.setState({ formula: this.props.formula });
      return null;
    }
    if (!Util.validarArreglo(this.state.formula)) {
      return null;
    }

    return this.state.formula.map((obj, index) => {
      return <ObjetoFormula key={index} tipo={obj.tipo} valor={obj.valor} posicion={index} onBorrarElemento={this.borrarElementoFormula} />
    });
  };

  borrarElementoFormula = (index) => {
    let formula = [...this.state.formula];
    formula.splice(index, 1);
    this.setState({ formula: [...formula] });
    this.props.setFormula([...formula]);
  }

  agregarValorFormula = () => {
    this.agregarElementoFormula({
      tipo: 'valor',
      valor: this.state.valor
    }, { valor: '' });
  };

  agregarVariableFormula = (evento) => {
    let idVariable = parseInt(this.state.variable);

    if (isNaN(idVariable)) {
      if (evento.type === 'dblclick') {
        this.setState({ variable: evento.currentTarget.value });
        idVariable = parseInt(evento.currentTarget.value);
      } else {
        this.props.mostrarAlerta('Atención', 'Debe seleccionar una variable para agregarla a la fórmula');
        return;
      }
    }
    const objVariable = this.props.variables.find(v => v.uniConcepto === idVariable);
    this.agregarElementoFormula({
      tipo: 'con',
      valor: objVariable.conAlias,
      idconcepto: (objVariable.uniConcepto) ? objVariable.uniConcepto : objVariable.id,
      extra: objVariable
    });
  };

  agregarFuncionFormula = (evento) => {
    let idFuncion = parseInt(this.state.funcion);
    if (isNaN(idFuncion)) {
      if (evento.type === 'dblclick') {
        this.setState({ funcion: evento.currentTarget.value });
        idFuncion = parseInt(evento.currentTarget.value);
      } else {
        this.props.mostrarAlerta('Atención', 'Debe seleccionar una función para agregarla a la fórmula');
        return;
      }
    }
    const objFuncion = this.props.funciones.find(f => f.funIderegistro === idFuncion);
    this.agregarElementoFormula({
      tipo: 'fun',
      valor: objFuncion.funNombre,
      idVariable: (objFuncion.funIderegistro) ? objFuncion.funIderegistro : objFuncion.id,
      extra: objFuncion
    });
  };

  agregarOperador = (evento) => {
    this.agregarElementoFormula({
      tipo: 'op',
      valor: evento.currentTarget.innerText
    });
  };

  agregarParentesis = (evento) => {
    const parentesis = evento.currentTarget.innerText;
    this.agregarElementoFormula({
      tipo: parentesis === '(' ? 'parAbre' : 'parCierra',
      valor: parentesis
    });
  };

  agregarElementoFormula = (nuevoElemento, extra) => {
    const formula = [...this.state.formula];
    this.setState({ formula: [...formula, nuevoElemento], ...extra });
  };

  validarEnterValor = (event) => {
    if (event.charCode === TECLAS.ENTER) {
      this.agregarValorFormula();
    }
  };

  validarFormula = () => {
    if (!Util.validarArreglo(this.state.formula)) {
      return false;
    }

    //Validar que los items se encuentren alternados por un operador.
    let operadoresAlternados = 0;
    let ultimoItem = null;
    let tipos = ['valor', 'con', 'fun'];
    this.state.formula.forEach(item => {
      const itemEsUnValor = tipos.findIndex(t => t == item.tipo) >= 0;
      const ultimoItemEsUnValor = tipos.findIndex(t => ultimoItem != null && t == ultimoItem.tipo) >= 0;
      if (ultimoItemEsUnValor && itemEsUnValor) {
        operadoresAlternados = 0;
      } else {
        operadoresAlternados = 1;
      }
      ultimoItem = item;
    });

    if (operadoresAlternados != 1) {
      return false;
    }

    let formulaStr = '';
    this.state.formula.forEach(item => {
      if (item.tipo === 'con' || item.tipo === 'fun') {
        formulaStr += 1;
        return;
      }
      formulaStr += item.valor;
    });
    try {
      if (!!isNaN(new Function('return ' + formulaStr)())) {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  };

  onValidarFormula = () => {
    if (!this.validarFormula()) {
      this.props.mostrarAlerta('Atención', 'Verifique la fórmula, se ha encontrado un error en la estructura o está vacía.');
      return;
    }
    this.props.mostrarAlerta('Información Correcta', '¡La fórmula es válida!');
  };

  obtenerListaVariables = () => {
    return this.props.variables.filter(v => v.seleccionado);
  };

  render() {
    return (
      <div className='calculadora'>
        <div>
          <span>Fórmula:</span>
        </div>
        <div className='calculadora__formula form-group'>
          {this.renderFormula()}
        </div>
        <button className='btn btn-primary mb-4' style={{ width: 160 }} onClick={this.onValidarFormula}>Validar Fórmula</button>

        <div className='calculadora__controles'>
          <div className='calculadora__controles__operadores calculadora__controles__separador'>
            <div>
              <span>Valores y Operadores:</span>
            </div>
            {this.renderOperadores()}
            {this.renderParentesis()}
            <div className="input-group mb-3 mt-2">
              <input
                className='form-control'
                placeholder="Valor"
                name='valor'
                value={this.state.valor}
                onChange={this.controlarCambio}
                autoComplete='off'
                onKeyPress={this.validarEnterValor}
              />
              <div className="input-group-append">
                <button className="input-group-text" onClick={this.agregarValorFormula}>+</button>
              </div>
            </div>
            {this.renderFuncionesBorrado()}
          </div>

          <div className='calculadora__controles__variables calculadora__controles__separador'>
            <Combo
              name='variable'
              opciones={this.obtenerListaVariables()}
              propTexto='uniUnidad.uniNombre1'
              propValor='uniConcepto'
              label='Variable:'
              mostrarOpcionPorDefecto={false}
              onChange={this.controlarCambio}
              extra={{ onDoubleClick: this.agregarVariableFormula }}
              size={12}
              cols={12}
              value={this.state.variable}
            />
            <button className='btn btn-primary' onClick={this.agregarVariableFormula}>Agregar variable</button>
          </div>

          <div className='calculadora__controles__funciones calculadora__controles__separador'>
            <Combo
              opciones={this.props.funciones}
              propTexto='funNombre'
              propValor='funIderegistro'
              label='Función:'
              name='funcion'
              mostrarOpcionPorDefecto={false}
              onChange={this.controlarCambio}
              size={6}
              cols={12}
              extra={{ onDoubleClick: this.agregarFuncionFormula }}
              value={this.state.funcion}
            />
            <button className='btn btn-primary' onClick={this.agregarFuncionFormula}>Agregar funcion</button>
          </div>
        </div>
      </div>
    );
  }
}

Calculadora.propTypes = {
  funciones: PropTypes.array,
  variables: PropTypes.array,
  formula: PropTypes.array,
  mostrarAlerta: PropTypes.func
};

Calculadora.defaultProps = {
  funciones: [],
  variables: [],
  formula: []
};
