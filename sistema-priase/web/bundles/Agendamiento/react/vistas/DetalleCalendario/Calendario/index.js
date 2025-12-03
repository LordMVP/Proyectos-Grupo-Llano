import React, { Component } from 'react'
import Dias from './Dias'
import RUTAS_API from '../../../global/rutas_api';
import axios from 'axios';

import './Calendario.scss'

/**
 *
 *
 * @class Calendario
 * @extends {Component}
 */
class Calendario extends Component {
  fecha = new Date()

  //Restablecer estados de la fecha actual

  //inicialización de variables
  /**
    *Define estados iniciales
    * @memberof Calendario
    */
  state = {
    año: this.fecha.getFullYear(),
    mes: this.fecha.getMonth(),
    dia: this.fecha.getDate(),
    lastDate: -1,
   // lista: this.props.value || [],
    lista: [],
    diasFestivos: [],
    listaAux:this.props.value || [],
    fechasCalendario:[],
    numMes:0
  }

  parsearValorFecha = (valor) => {
    return (valor < 10) ? '0' + valor : valor;
  };

  parsearFecha = (fecha) => {
    const day = fecha.getDate();
    const month = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();
    return `${this.parsearValorFecha(anio)}-${this.parsearValorFecha(month)}-${this.parsearValorFecha(day)}`;
  };

  obtenerFechaActual = (dia = this.state.dia) => {
    const day = dia;
    const month = this.state.mes;
    const anio = this.state.año;
    return new Date(`${this.parsearValorFecha(anio)}-${this.parsearValorFecha(month + 1)}-${this.parsearValorFecha(day)}`);
  }

  consultarFestivos = () => {
    let fechaTemp = this.obtenerFechaActual();
    const lastDate = fechaTemp.getMonth();
    if (this.state.lastDate == lastDate && this.props.consultarCalendario == false) {
      return;
    }
    this.props.onChange({target: {id: 'consultarCalendario', value: false}});
    this.setState({ lastDate: lastDate, lista: [] }, () => {
      const anio = fechaTemp.getFullYear();
      const mes = fechaTemp.getMonth() + 1;
      var fechaFinal = new Date(anio, mes, 0);
      axios.post(RUTAS_API.CALENDARIO_HABIL.CONSULTAR_FESTIVOS, {
        "fechaini": this.obtenerFechaActual(1),
        "fechafin": this.parsearFecha(fechaFinal)
      }).then(respuesta => {
        const diasFestivos = (respuesta.data.codigo) ? respuesta.data.datos : [];
        const diaIni = 1;
        const diaFin = fechaFinal.getDate();
        for (let i = diaIni; i <= diaFin; i++) {
          const f = fechaTemp;
          f.setDate(i);
          if (diasFestivos.findIndex(d => (new Date(d.calendarioFertivofec)).getDate() == f.getDate()) < 0) {
            this.agregar(f.getDate(), f.getMonth(), f.getFullYear());
          }
        }
        this.setState({ diasFestivos: diasFestivos });
      });
    });
  };

  componentDidMount() {
    this.consultarFestivos();
  }

  /**
   * Actualiza los estados de las propiedades cuando se alteran en el padre
   * @method
   * @param {Object} prepProps - Cargar atributos del componente
   * @async
   */

  componentDidUpdate(prevProps) {
    if (this.props.limpieza !== prevProps.limpieza) {
      if (this.props.limpieza) {
        this.setState({
          lista: [],
        })
        this.props.onChange({
          target: { id: 'limpieza', value: false },
        })
      }
    }
    if (this.props.lista !== prevProps.lista) {      
      let fecha = this.props.lista[0].chaFecha
      let cId = this.props.lista[0].chaIdregistro
      this.setState({fechasCalendario:this.props.lista})

      if (fecha.length > 0) {
        let f = []
        fecha = fecha.map((fila) => {
          fila = fila.fecha
            .substring(0, fila.fecha.indexOf('T'))
            .split('-')

          return [
            parseInt(fila[2]),
            parseInt(fila[1]) - 1,
            parseInt(fila[0]),
          ]
        })
        
        let lista = fecha
 
        this.setState({ lista })       
        this.setState({mes:fecha[0][1]})
        this.setState({año:fecha[0][2]})
        this.props.onChange({
          target: { id: 'calendario', value: lista,idc:cId },
        })
      }
    }   
    
  }

  /**
   * Agrega una nueva fila a la tabla. Evaluando previamente que la información no este repetida.
   * @method
   */
  agregar = (dia = this.state.dia, mes = this.state.mes, anio = this.state.año) => {
    const fecha = [dia, mes, anio];
    let lista = this.state.lista

    if (this.comparativa(fecha))
      lista = lista.filter((e) => !this.comparativa(fecha, e))
    else lista = [...lista, fecha]

    this.setState({ lista })
    this.props.onChange({ target: { id: 'calendario', value: lista } })
  }


  setFecha = (dia = this.state.dia, mes = this.state.mes, anio = this.state.año) => {
    const fecha = [dia, mes, anio];
    this.props.onChange({ target: { id: 'fecha', value: fecha } })
  }

  /**
   * Revisa sí la fecha esta actualmente en la lista de días marcados como laborales
   * @method
   * @param {int} a
   * @param {int} b
   * @returns {array}
   */
  comparativa(a, b = this.state.lista) {
    function comparar(a, b) {
      return a.map((c, d) => c === b[d]).reduce((c, d) => c && d)
    }

    if (b === this.state.lista) {
      for (const fecha of b) if (comparar(fecha, a)) return true
    } else return comparar(a, b)
  }
  /**
   * Dirige hacia el siguiente mes.
   * @method
   */
  siguiente = () => {
    if (this.state.mes !== 11) this.setState({ mes: this.state.mes + 1 })
    else this.setState({ mes: 0, año: this.state.año + 1 })
    
    let mes = this.state.numMes

    this.actualizarDias(mes+1)
  }


  actualizarDias = (id) =>{
    let fecha = this.state.fechasCalendario[id].chaFecha
    let cId = this.state.fechasCalendario[id].chaIdregistro
    if (fecha.length > 0) {
      let f = []
      fecha = fecha.map((fila) => {
        fila = fila.fecha
          .substring(0, fila.fecha.indexOf('T'))
          .split('-')

        return [
          parseInt(fila[2]),
          parseInt(fila[1]) - 1,
          parseInt(fila[0]),
        ]
      })
      
      let lista = fecha

      this.setState({ lista })       
      this.setState({mes:fecha[0][1]})
      this.setState({año:fecha[0][2]})
      this.props.onChange({
        target: { id: 'calendario', value: lista,idc:cId },
      })
    }
    this.setState({numMes:id})

  }  

  /**
   * Dirige hacia el anterior mes.
   * @method
   */
  volver = () => {
    if (this.state.mes !== 0) this.setState({ mes: this.state.mes - 1 })
    else this.setState({ mes: 11, año: this.state.año - 1 })

    let mes = this.state.numMes

    this.actualizarDias(mes-1)
  }

  /**
   *Renderiza la vista
   * @return {JSX} componente - returna vista jsx
   */
  render() {
    const meses = [
      'enero',
      'febrero',
      'Marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ]

    return (
      <div className="columna">    
        <div className="calendario">
          <div className="cabezera">
            <a onClick={this.volver}>&lt;</a>
            <b>
              {meses[this.state.mes]} {this.state.año}
            </b>
            <a onClick={this.siguiente}>&gt;</a>
          </div>

          <div className="semana">
            <label>lun</label>
            <label>mar</label>
            <label>mie</label>
            <label>jue</label>
            <label>vie</label>
            <label>sab</label>
            <label>dom</label>
          </div>

          <Dias
            año={this.state.año}
            mes={this.state.mes}
            dia={this.state.dia}
            lista={this.state.lista}
            onClick={(dia) => this.setFecha(dia)}
          />
        </div>
      </div>
    )
  }
}

export default Calendario
