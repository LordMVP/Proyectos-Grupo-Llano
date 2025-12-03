import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Util } from '../../../util/Util';

import './JDatePicker.scss';

const sections = {
  SELECT_DAY: 1,
  SELECT_MONTH: 2,
  SELECT_YEAR: 3,
  SELECT_RANK: 4,
};

class JDatePicker extends Component {

  input = null;

  state = {
    focus: false,
    labels: null,
    date: '',
    month: -1,
    section: 1,
    year: 1900,
    btnLeftEnabled: '',
    btnRightEnabled: '',
  };

  componentDidMount() {
    this.setState({
      labels: this.getLabels(),
      idComponent: Util.generarIdControl('jdatepicker'),
    });
    document.addEventListener('mousedown', this.handleClickOutside);
  };

  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  renderDaysHeader = () => {
    return this.state.labels.shortDays.map((day, index) => {
      return (<div className='colum day bold' key={index}>{day}</div>);
    });
  };

  /**
   * Obtiene el número de días del mes, también tiene encuenta si es un año bisiestro.
   * @return {number}
   */
  getNumDaysMonth = (month, year) => {
    if (!year) {
      year = new Date().getFullYear();
    }
    const date = new Date(year, (month + 1), 0);
    return date.getDate();
  };

  getFirstDayMonth = (date) => {
    const monthStartDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const posDay = monthStartDay.getUTCDay();
    return posDay;
  };

  /**
   * Renderiza el arreglo con los días de un més especifíco o los del mes actual.
   * @return {array}
   */
  getDaysMonth = (month = null, year = null) => {
    const actualDate = new Date();
    if (month == null || month == -1) {
      month = actualDate.getMonth();
    } else {
      actualDate.setMonth(month);
    }
    if (year <= 1900 || year == null) {
      year = actualDate.getFullYear();
    } else {
      actualDate.setFullYear(year);
    }
    const days = this.getNumDaysMonth(month, year);
    const actualYear = year;
    const actualDayOfMonth = ((new Date()).getTime() === actualDate.getTime()) ? actualDate.getDate() : -1;
    const actualDayOfWeek = this.getFirstDayMonth(actualDate); //0-6 => 1,
    let daysMonth = [];
    //Obtenemos los días del mes anterior.
    if (actualDayOfWeek > 0) {
      //Obtenemos los últimos días del mes anterior.
      let actualYearPrev = actualYear;
      let prevMonth = (month - 1);
      //Si es igual a -1 quiere decir que debe ser el último mes anterior del año anterior.
      if (prevMonth == -1) {
        prevMonth = 12;
        actualYearPrev = actualYear - 1;
      }
      let daysPrevMonth = this.getNumDaysMonth(prevMonth); //31
      const dayIni = (daysPrevMonth - (actualDayOfWeek)) + 1; //1
      for (let i = dayIni; i <= daysPrevMonth; i++) {
        daysMonth.push({ day: i, monthType: 'prev', month: prevMonth, year: actualYearPrev });
      }
    }
    //Obtenemos los días del mes actual.
    for (let i = 1; i <= days; i++) {
      daysMonth.push({ day: i, monthType: 'actual', actual: (i == actualDayOfMonth), month: month, year: actualYear });
    }
    //Obtenemos los días del mes siguiente.
    const fin = 42;
    const missing = fin - daysMonth.length;
    let nextMonth = (month + 1);
    let actualYearNext = actualYear;
    //Si es igual a 13 quiere decir que debe ser el primer mes del siguiente año.
    if (nextMonth == 12) {
      nextMonth = 0;
      actualYearNext = actualYear + 1;
    }
    for (let i = 1; i <= missing; i++) {
      daysMonth.push({ day: i, monthType: 'next', month: nextMonth, year: actualYearNext });
    }
    return daysMonth;
  };

  /**
   * Comprueba si una fecha es menor a la fecha mínima permitida (props.min).
   */
  validateMin = (date) => {
    const min = this.props.min;
    if (min && typeof min === 'object') {
      if (min.getTime() > 0) {
        if (date.getTime() < min.getTime()) {
          return false;
        }
      }
    }
    return true;
  };

  /**
   * Comprueba si una fecha es mayor a la fecha máxima permitida (props.min)
   */
  validateMax = (date) => {
    const max = this.props.max;
    if (max && typeof max === 'object') {
      if (max.getTime() > 0) {
        if (date.getTime() > max.getTime()) {
          return false;
        }
      }
    }
    return true;
  };

  /**
   * Renderiza los días de un mes específico o del mes actual.
   * @return {Component}
   */
  renderDaysMonth = (month = null, year = null) => {
    const daysMonth = this.getDaysMonth(month, year);
    return daysMonth.map((day, index) => {
      let classNow = (this.state.date.trim() === '') ? 'now' : 'now-border';
      let isSelected = false;
      let enabled = '';
      //Comprobamos si el día es menor al minimo permitido.
      const temp = new Date(day.year, day.month, day.day);
      if (!this.validateMin(temp) || !this.validateMax(temp)) {
        enabled = 'disabled-control';
      }
      //Comprobamos si
      if ((this.state.date.trim() != '')) {
        const tempDateSelected = new Date(this.state.date);
        let tempDate = this.getDateSelected(day);
        tempDate = new Date(tempDate);
        if (tempDateSelected.getTime() === tempDate.getTime()) {
          isSelected = true;
        }
      }
      return (
        <div
          className={`colum day ${enabled} ${isSelected ? 'selected' : ''} ${day.monthType} ${(day.actual && enabled == '') ? classNow : ''}`} key={index}
          onClick={() => {
            if (enabled == 'disabled-control') {
              return;
            };
            const dateSelected = this.getDateSelected(day, true);
            this.setState({ focus: false, date: dateSelected, open: false });
            if (this.props.onChange) {
              this.props.onChange(dateSelected);
            }
          }}
        >
          {day.day}
        </div >
      );
    });
  };

  /**
   * Retornará la fecha seleccionada.
   */
  getDateSelected = (date, forUser = false) => {
    const day = (date.day > 9) ? date.day : '0' + date.day;
    // const m = (parseInt(date.month + (forUser ? 1 : 0)));
    let m = date.month + 1;
    const month = (m > 9) ? m : ('0' + m);
    let finalDate = `${date.year}-${month}${this.props.sinDia ? '' : '-' + day}`;
    console.log(finalDate);
    return finalDate;
  };

  /**
   * Actualiza el index del mes actual (incrementa o decrementa, esto dependiedo el @control que invoque el método),
   * o de lo contrario abre la interfaz para seleccionar meses.
   */
  updateMonthIndex = (control) => {
    let cambios = {};
    cambios['fecha'] = '';
    let month = this.state.month;
    let year = this.state.year;
    if (month < 0) {
      month = (new Date()).getMonth();
    }
    if (year <= 1900) {
      year = (new Date()).getFullYear();
    }
    cambios.year = year;
    switch (control) {
      case 'btn-left':
        if (this.getStatusBtn('left') === 'disabled-control') {
          return;
        }
        cambios.month = month - 1;
        if (cambios.month == -1) {
          cambios.month = 11;
          cambios.year -= 1;
        }
        break;
      case 'btn-year':
        cambios.section = sections.SELECT_MONTH;
        break;
      case 'btn-right':
        if (this.getStatusBtn('right') === 'disabled-control') {
          return;
        }
        cambios['month'] = month + 1;
        if (cambios.month == 12) {
          cambios.month = 0;
          cambios.year += 1;
        }
        break;
    }
    // const date = new Date(cambios.year, cambios.month, 1);
    // if (!this.validateMin(date)) {
    //   cambios['btnLeftEnabled'] = 'disabled-control';
    // } else {
    //   cambios['btnLeftEnabled'] = '';
    // }
    // if (!this.validateMax(date)) {
    //   cambios['btnRightEnabled'] = 'disabled-control';
    // } else {
    //   cambios['btnRightEnabled'] = '';
    // }
    this.setState(cambios);
  };

  getStatusBtn = (btn) => {
    const date = new Date(this.state.year, this.state.month);
    if (btn == 'left') {
      return (this.validateMin(date)) ? '' : 'disabled-control';
    } else if (btn == 'right') {
      return (this.validateMax(date)) ? '' : 'disabled-control';
    }
  };

  /**
   * Actualiza el index del año (incrementa, decrementa) o muestra la sección para seleccionar años.
   */
  updateYearIndex = (control) => {
    let cambios = {};
    let year = this.state.year;
    if (year <= 1900) {
      year = (new Date()).getFullYear();
    }
    cambios.year = year;
    switch (control) {
      case 'btn-left':
        if (this.getStatusBtn('left') === 'disabled-control') {
          return;
        }
        cambios.year -= (this.state.section == sections.SELECT_RANK) ? 10 : 1;
        break;
      case 'btn-year':
        cambios.section = sections.SELECT_RANK;
        break;
      case 'btn-right':
        if (this.getStatusBtn('right') === 'disabled-control') {
          return;
        }
        cambios.year += (this.state.section == sections.SELECT_RANK) ? 10 : 1;
        break;
    }
    // const date = new Date();
    // date.setFullYear(cambios.year);
    // if (!this.validateMin(date)) {
    //   cambios['btnLeftEnabled'] = 'disabled-control';
    // } else {
    //   cambios['btnLeftEnabled'] = '';
    // }
    // if (!this.validateMax(date)) {
    //   cambios['btnRightEnabled'] = 'disabled-control';
    // } else {
    //   cambios['btnRightEnabled'] = '';
    // }
    this.setState(cambios);
  }

  /**
   * Controla los botones del header.
   */
  controlHeader = (control) => {
    switch (this.state.section) {
      case sections.SELECT_DAY:
        return this.updateMonthIndex(control);
      case sections.SELECT_MONTH:
        return this.updateYearIndex(control);
      case sections.SELECT_RANK:
        return this.updateYearIndex(control);
    }
  };

  /**
   * Obtiene el título del mes y año actual en el panel de selección de días.
   * @return {string} title
   */
  getTitleDaysSelector = () => {
    const dateActual = new Date();
    let monthActual = dateActual.getMonth();
    let year = dateActual.getFullYear();
    if (this.state.month >= 0) {
      monthActual = this.state.month;
    }
    if (this.state.year > 1900) {
      year = this.state.year;
    }
    let title = `${this.state.labels.months[monthActual]} ${year}`;
    return title;
  };

  /**
   * Obtiene el título del mes actual cuando se encuentra en el panel selector de meses.
   * @return {string} year
   */
  getTitleMonthsSelector = () => {
    const dateActual = new Date();
    let year = dateActual.getFullYear();
    if (this.state.year > 1900) {
      year = this.state.year;
    }
    return year;
  };

  /**
   * Obtiene el título del año actual cuando se encuentra en el panel selector de años.
   */
  getTitleYearSelector = () => {
    const year = this.getTitleMonthsSelector();
    const init = year - (year % 10);
    const fin = year + 10;
    return init + ' - ' + fin;
  };

  /**
   * Obtiene el título del rango actual cuando se encuentra en el panel selector de rangos.
   */
  getTitleRankSelector = () => {
    let actualYear = (this.state.year > 1900) ? this.state.year : (new Date()).getFullYear();
    let initYear = actualYear - (actualYear % 10);
    let finalYear = actualYear + (10 - (actualYear - initYear));
    return `${(initYear - 1)} - ${finalYear}`;
  };

  /**
 * Renderiza la lista de años de un rango.
 */
  renderYears = (initYear, actualYear) => {
    let yearsList = [];
    let finalYear = actualYear + (10 - (actualYear - initYear));
    for (let i = (initYear - 1); i <= finalYear; i++) {
      yearsList.push(i);
    }
    return yearsList.map((year, index) => {
      let actualYear = this.state.year;
      if (actualYear < 0) {
        actualYear = (new Date()).getFullYear();
      }
      return (<div onClick={() => this.setState({ year: year, section: sections.SELECT_MONTH })} className={`column month ${(actualYear == year) ? 'selected' : ''}`} key={index}>{year}</div>);
    });
  };

  /**
   * Controla el título que se va a mostrar.
   */
  getTitle = () => {
    switch (this.state.section) {
      case sections.SELECT_DAY:
        return this.getTitleDaysSelector();
      case sections.SELECT_MONTH:
        return this.getTitleMonthsSelector();
      case sections.SELECT_YEAR:
        return this.getTitleYearSelector();
      case sections.SELECT_RANK:
        return this.getTitleRankSelector();
    }
  };

  /**
   * Evaluará que panel de selección mostrar.
   */
  renderSection = () => {
    let seccion = this.state.section;
    console.log('SIN DIA', this.props.sinDia);
    if (this.props.sinDia && seccion === sections.SELECT_DAY) {
      seccion = sections.SELECT_DAY;
      this.setState({ section: sections.SELECT_MONTH });
    }
    switch (seccion) {
      case sections.SELECT_DAY:
        return this.renderSectionSelectorDay();
      case sections.SELECT_MONTH:
        return this.renderSectionSelectorMonth();
      case sections.SELECT_RANK:
        return this.renderSectionSelectorYear();
    }
  };

  /**
   * Renderiza los meses de un año.
   * @return {Component}
   */
  renderMonths = () => {
    return this.state.labels.shortMonths.map((month, index) => {
      let actualMonth = this.state.month;
      if (actualMonth < 0) {
        actualMonth = (new Date()).getMonth();
      }
      return (<div onClick={() => {
        if (this.props.sinDia) {

          const actualDate = new Date();
          let { year } = this.state;
          if (year <= 1900 || year == null) {
            year = actualDate.getFullYear();
          }

          const dateSelected = this.getDateSelected({ day: 1, month: index, year: year }, true);
          this.setState({ focus: false, date: dateSelected, open: false, month: index });
          if (this.props.onChange) {
            this.props.onChange(dateSelected);
          }
          return;
        }
        this.setState({ month: index, section: sections.SELECT_DAY });
      }} className={`column month ${(actualMonth == index) ? 'selected' : ''}`} key={index}>{month}</div>);
    });
  };

  /**
   * Renderiza los días del mes en el calendario.
   * @return {Component}
   */
  renderSectionSelectorDay = () => {
    return (
      <Fragment>
        <div className='days-content'>
          {this.renderDaysHeader()}
        </div>
        <div className='days-forselection'>
          {this.renderDaysMonth(this.state.month, this.state.year)}
        </div>
      </Fragment>
    );
  };

  /**
   * Renderiza el panel selector de los meses en el calendario.
   * @return {Component}
   */
  renderSectionSelectorMonth = () => {
    return (
      <Fragment>
        <div className='months-forselection'>
          {this.renderMonths(this.state.month, this.state.year)}
        </div>
      </Fragment>
    );
  };

  /**
   * Renderiza los años del rango seleccionado en calendario.
   */
  renderSectionSelectorYear = () => {
    const actualYear = (this.state.year > 1900) ? this.state.year : (new Date()).getFullYear();
    const initYear = actualYear - (actualYear % 10);
    return (
      <Fragment>
        <div className='months-forselection'>
          {this.renderYears(initYear, actualYear)}
        </div>
      </Fragment>
    );
  };

  getTitleBtn = (btn) => {
    if (btn == 'left') {
      switch (this.state.section) {
        case sections.SELECT_DAY:
          return this.state.labels.btnsCalendar.prevMonth.title;
        case sections.SELECT_MONTH:
          return this.state.labels.btnsCalendar.prevYear.title;
        case sections.SELECT_YEAR:
          return this.state.labels.btnsCalendar.prevYearRank.title;
        case sections.SELECT_RANK:
          return this.state.labels.btnsCalendar.prevYearRank.title;
      }
    } else if (btn == 'right') {
      switch (this.state.section) {
        case sections.SELECT_DAY:
          return this.state.labels.btnsCalendar.nextMonth.title;
        case sections.SELECT_MONTH:
          return this.state.labels.btnsCalendar.nextYear.title;
        case sections.SELECT_YEAR:
          return this.state.labels.btnsCalendar.nextYearRank.title;
        case sections.SELECT_RANK:
          return this.state.labels.btnsCalendar.nextYearRank.title;
      }
    }
  };

  /**
   * Renderiza la ventana del calendario.
   */
  renderCalendar = () => {
    if (!this.state.focus) {
      return '';
    }

    return (
      <div className='jdate-picker calendar'>
        <div className='head-controls'>
          <div className={`control left ${this.state.btnLeftEnabled} ${this.getStatusBtn('left')}`} title={this.getTitleBtn('left')} onClick={() => this.controlHeader('btn-left')}>
            <i className='fa fa-fw fa-chevron-left'></i>
          </div>
          <div className='label-date' onClick={() => this.controlHeader('btn-year')}>
            {this.getTitle()}
          </div>
          <div className={`control right ${this.state.btnRightEnabled} ${this.getStatusBtn('right')}`} title={this.getTitleBtn('right')} onClick={() => this.controlHeader('btn-right')}>
            <i className='fa fa-fw fa-chevron-right'></i>
          </div>
        </div>
        {this.renderSection()}
      </div>

    );
  };

  /**
   * Detecta cuando el control obtiene el foco.
   */
  onFocus = () => {
    this.setState({ focus: true, open: true });
  };

  /**
   * Eliminará el evento outsite que controla el cierre del componente.
   */
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  /**
   * Verifica si el clic que dió el usuario lo hizo dentro del componente o fuera del componente para cerrarlo.
   */
  handleClickOutside = (event) => {
    let component = event.target;
    while (component.classList && !component.classList.contains(this.state.idComponent) && component.tagName != 'BODY') {
      component = component.parentNode;
    }
    if (component.classList && !component.classList.contains(this.state.idComponent)) {
      this.setState({ open: false, focus: false });
    }
  };

  /**
   * Abre el componente y pone el foco en el control.
   */
  setFocus = () => {
    if (!this.open) {
      return;
    }
    this.input.focus();
  };


  setFocusInline = () => {
    this.setState({ open: true }, () => {
      this.input.focus();
    });
  };


  /**
   * Detecta cuando se pierde el foco del control.
   */
  onBlur = () => {
    if (this.state.open) {
      return;
    }
    this.setState({ focus: false });
  };

  render() {
    return (
      <Fragment>
        <div className={`jdate-picker ${this.state.idComponent}`} onClick={this.setFocus} >
          <div className='input-group'>
            <input
              id={this.props.id}
              type='text'
              className='form-control'
              placeholder={(this.props.dateFormat) ? this.props.dateFormat.toUpperCase() : 'YYYY-MM-DD'}
              onFocus={this.onFocus}
              name={this.props.name}
              value={this.props.fecha}
              onChange={this.props.onChange}
              onBlur={this.onBlur}
              autoComplete="off"
              ref={(input) => { this.input = input }}
              {...this.props.extra}
            />
            <div className='input-group-btn'>
              <button
                className='btn btn-primary'
                {...this.props.extra}
                onClick={this.setFocusInline}>
                <i className='fa fa-fw fa-calendar'></i>
              </button>
            </div>
          </div>
          {this.renderCalendar()}
        </div>
      </Fragment>
    );
  }

  getLabels = () => {
    return {
      shortDays: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      btnsCalendar: {
        prevMonth: { title: 'Mes Anterior' },
        prevYear: { title: 'Año Anterior' },
        prevYearRank: { title: 'Rango Anterior' },
        nextMonth: { title: 'Siguiente Mes' },
        nextYear: { title: 'Siguiente Año' },
        nextYearRank: { title: 'Siguiente Rango' },
      }
    };
  };
}

JDatePicker.propTypes = {
  history: PropTypes.object,
  mostrarAlerta: PropTypes.func
};

export default JDatePicker;
