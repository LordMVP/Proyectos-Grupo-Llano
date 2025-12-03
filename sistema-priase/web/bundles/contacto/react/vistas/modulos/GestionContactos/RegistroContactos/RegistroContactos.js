import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { get as getProp } from 'object-path';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { Botonera, Combo, VentanaModal, Util, TextoNumerico, Input, Fecha } from 'appfuture-react';
import axios from 'axios';
import { RConsultaContactos } from '../ConsultaContactos';
import RUTAS_API from '../../../../global/rutas_api';
import '../GestionContactos.scss';
import { CONFIGURACIONES } from '../../../../global/constantes';
import { SelectorMultiple } from '../../../Utils/SelectorMultiple';
import { now } from 'moment';
import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'
import { RConsultaSuscripciones } from '../ConsultaSuscripcion'

//import { RConsultaContactos } from '../ConsultaContactos';

const TIPOS_FILTRO = {
  SUSCRIPCION: 'S',
  CONTACTO: 'C',
  TERCERO: 'T'
};

const TIPOS_CAMPO = {
  INPUT: 'txt',
  COMBO: 'cmb',
  CALENDARIO: 'cln',
  CHECKBOX: 'chk'
};

class RegistroContacto extends Component {

  state = {
    nombreTercero: '',
    documentoTercero: '',
    fecNacimiento: '',
    fecCreaContacto: '',
    origenContacto: '',
    panelSeleccionado: 'home',
    cabeceraSeleccionado: 'home',
    modalConsulta: false,
    modalConsultaSuscripcion: false,
    contacto: null,
    listaTabs: [],
    listaTabsSuscripcion: [],
    listaSuscripcionesVinculadas: [],
    campos: {},
    parametrosCampos: {},
    camposSuscripcion: {},
    parametrosCamposSuscripcion: {},
    fecdesde: '',
    fechasta: '',
    listaHistorico: [],
  }

  guardarContacto = () => {
    const { parametrosCampos, parametrosCamposSuscripcion, contacto } = this.state;
    let idSuscripcion = this.state.idSuscripcion;
    let infoContacto = { terIderegistro: contacto.terIderegistro, idSuscripcion: idSuscripcion };
    let datos = [];
    let datosSuscripcion = [];
    for (let atributo in parametrosCampos) {
      let infoPestana = { uniIderegistro: atributo };
      let campos = parametrosCampos[atributo];
      let valorDato = [];
      let idx = 1;
      for (let atributoCampo in campos) {
        let detalleInformacion = { ideinfo: idx, datosinfo: [] };
        const infoCampo = this.buscarInfoCampo(infoPestana.uniIderegistro, atributoCampo);
        let datosInfoCampo = { codigodato: infoCampo.codigoDato, nombredato: infoCampo.nombreDato, valoresdato: [] };
        this.obtenerValoresDato(datosInfoCampo, atributoCampo, campos, idx);
        detalleInformacion.datosinfo.push(datosInfoCampo);
        valorDato.push(detalleInformacion);
        idx++;
      }
      infoPestana.dconInformacion = valorDato;
      datos.push(infoPestana);
    }

    infoContacto.datos = datos;

    for (let atributo in parametrosCamposSuscripcion) {
      let infoPestana = { uniIderegistro: atributo };
      let campos = parametrosCamposSuscripcion[atributo];
      let valorDato = [];
      let idx = 1;
      for (let atributoCampo in campos) {
        let detalleInformacion = { ideinfo: idx, datosinfo: [] };
        const infoCampo = this.buscarInfoCampoSuscripcion(infoPestana.uniIderegistro, atributoCampo);
        let datosInfoCampo = { codigodato: infoCampo.codigoDato, nombredato: infoCampo.nombreDato, valoresdato: [] };
        this.obtenerValoresDato(datosInfoCampo, atributoCampo, campos, idx);
        detalleInformacion.datosinfo.push(datosInfoCampo);
        valorDato.push(detalleInformacion);
        idx++;
      }
      infoPestana.codsInformacion = valorDato;
      datosSuscripcion.push(infoPestana);
    }

    infoContacto.datosSuscripcion = datosSuscripcion;

    axios.post(RUTAS_API.GESTION_CONTACTOS.GUARDAR_CONTACTO, {
      infocontacto: JSON.stringify(infoContacto)
    }).then((respuesta) => {
      if (respuesta.data.codigo > 0) {
        // this.setState({listaTabs:[],contacto:null});  
      }
    });
    //console.log(JSON.stringify(infoContacto));
    //this.setState({listaTabs:[],contacto:null});
  }

  obtenerValoresDato = (datosInfoCampo, atributoCampo, campos, idx) => {
    const valoresCampos = { idevalor: (idx * 100), valordato: campos[atributoCampo] };
    if (!Util.validarArreglo(campos[atributoCampo])) {
      datosInfoCampo.valoresdato.push(valoresCampos);
      return;
    }
    campos[atributoCampo].map((registro, index) => {

      registro.idevalor = (registro.idevalor) ? registro.idevalor + (idx * 100) : index + (idx * 100);

    });
    datosInfoCampo.valoresdato = campos[atributoCampo].filter(item => item.seleccionado == true);
  };

  buscarInfoCampo = (idUnidad, nombreCampo) => {
    const campos = this.state.campos[idUnidad];
    for (let indice = 0; indice < campos.length; indice++) {
      const infoCampo = campos[indice];
      if (infoCampo.nombreDato == nombreCampo) {
        return infoCampo;
      }
    }
  }

  buscarInfoCampoSuscripcion = (idUnidad, nombreCampo) => {
    const camposSuscripcion = this.state.camposSuscripcion[idUnidad];
    for (let indice = 0; indice < camposSuscripcion.length; indice++) {
      const infoCampo = camposSuscripcion[indice];
      if (infoCampo.nombreDato == nombreCampo) {
        return infoCampo;
      }
    }
  }

  consultarContacto = () => {
    this.setState({ modalConsulta: true });
  };

  consultarModalSuscripcion = () => {
    this.setState({ modalConsultaSuscripcion: true });
  };

  grabarContacto = (contacto) => {
    axios.post(RUTAS_API.GESTION_CONTACTOS.CREAR_CONTACTO,
      { terIderegistro: contacto.terIderegistro }
    ).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        this.props.mostrarAlerta('Correcto', 'Se ha registrado correctamente el contacto.');
      } else {
        this.props.mostrarAlerta('Error', 'No se pudo registrar el contacto.');
      }
    });
  }

  cargarDatos = (contacto, extra) => {
    if (extra && extra == TIPOS_FILTRO.TERCERO) {
      this.grabarContacto(contacto);
    }
    this.consultarSuscripcionesVinculadas(contacto);
    this.setState({
      contacto: contacto,
      modalConsulta: false,
      listaTabs: [],
      campos: {},
      parametrosCampos: {},
      tab: '',
    });
  };

  vincularSuscripcion = (suscripcion) => {
    suscripcion.terIderegistro = this.state.contacto.terIderegistro;
    axios.post(RUTAS_API.GESTION_CONTACTOS.CREAR_VINCULO_SUSCRIPCION,
      { contIderegistro: suscripcion.terIderegistro, dsusIderegistr: suscripcion.dsusIderegistr })
      .then(respuesta => {
        this.setState({ modalConsultaSuscripcion: false })
        if (respuesta.data.codigo > 0) {
          this.consultarSuscripcionesVinculadas(this.state.contacto)
        } else {
          this.props.mostrarAlerta('Error', 'No se pudo vincular la suscripción.');
        }
      });
  };

  /**
   * Método encargado de controlar el cambio del valor de las variables.
   * @param {Event} evento Evento ejecutado en el control de usuario.
   */
  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  /**
   * Método encargado de consultar las suscripciones vinculadas al contacto.
   * @param ninguno.
   */
  consultarSuscripcionesVinculadas = (contacto) => {
    if (contacto == null) {
      this.props.mostrarAlerta('Error', 'Debe seleccionar un contacto');
      return;
    }
    //Eliminar estas dos lineas próximas al descomentar las siguientes...
    // const listaSuscripcionesVinculadas = [
    //   { "cods_ideregistro": 1, "cont_ideregistro": 1, "dsus_ideregistr": 1200, "dsus_pcodigo": "0110003004001", "ter_nomcompleto": "PAZ DE OCHOA BLANCA YOLANDA", "pro_direccion": "CR 30 N 37 40" },
    //   { "cods_ideregistro": 2, "cont_ideregistro": 1, "dsus_ideregistr": 1220, "dsus_pcodigo": "0170600200601", "ter_nomcompleto": "MARTINEZ LOPEZ SALUSTIANO", "pro_direccion": "MUL 2 CS 6 CLL 15 44C 132" }
    // ];
    // this.setState({ listaSuscripcionesVinculadas: listaSuscripcionesVinculadas, tab: TIPOS_FILTRO.SUSCRIPCION });
    //DESCOMENTAR CUANDO LA CONSULTA DE SUSCRIPCIONES VINCULADAS ESTE LISTO...
    axios.post(RUTAS_API.GESTION_CONTACTOS.CONSULTA_SUSCRIPCIONES_VINCULADAS, {
      idContacto: contacto.terIderegistro,
    }).then((respuesta) => {
      if (respuesta.data.codigo > 0) {
        this.setState({ listaSuscripcionesVinculadas: respuesta.data.datos });
      }
    });
  };

  /**
   * Método encargado de consultar la informacion del contacto.
   * @param ninguno.
   */
  consultarInformacionContacto = () => {
    //Descomentar...
    axios.post(RUTAS_API.GESTION_CONTACTOS.CONSULTAR_MENU_TABS)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaTabs: respuesta.data.datos, tab: TIPOS_FILTRO.CONTACTO });
        };
      });
  };

  /**
 * Método encargado de consultar la informacion del vinculo del contacto y la suscripcion.
 * @param ninguno.
 */
  consultarInformacionSuscripcion = (estado = null) => {
    if (this.state.listaTabsSuscripcion.length > 0) {
      this.setState({ tab: TIPOS_FILTRO.SUSCRIPCION });
      return;
    }
    axios.post(RUTAS_API.GESTION_CONTACTOS.CONSULTAR_MENU_TABS_SUSCRIPCION)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          if (estado != null) {
            this.setState({ listaTabsSuscripcion: respuesta.data.datos });
            return;
          }
          const { listaSuscripcionesVinculadas } = this.state;
          if (!Util.validarArreglo(listaSuscripcionesVinculadas)) {
            return this.props.mostrarAlerta('Error', 'No se encontrarton suscripciones vinculadas');
          }
          listaSuscripcionesVinculadas[0].radioseleccionado = true;
          this.setState({
            idSuscripcion: listaSuscripcionesVinculadas[0].dsusIderegistr,
            indexAnterior: 0,
            listaTabsSuscripcion: respuesta.data.datos,
            listaSuscripcionesVinculadas: listaSuscripcionesVinculadas,
            tab: TIPOS_FILTRO.SUSCRIPCION
          });
        };
      });
  };

  /**
   * Método encargado de generar los botones del formulario,
	 * @returns {Object}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: this.guardarContacto },
      { texto: 'Consultar', callback: this.consultarContacto },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  limpiarFormulario = () => {
    this.props.mostrarAlerta('Cofirmacion Limpiar', 'Esta seguro de limpiar datos?', [{
      clase: 'btn',
      callback: () => this.setState({ contacto: null, listaSuscripcionesVinculadas: [] }),
      texto: 'Aceptar'
    }, {
      clase: 'btn',
      texto: 'Cancelar'
    }]);
  };
  controlarTab = (evento) => {
    const control = evento.target;
    const dataPanel = control.attributes['data-panel'].value;
    this.setState({ panelSeleccionado: dataPanel, cabeceraSeleccionado: dataPanel, panelSeleccionadoActualizado: true });
  }

  validarPanelActivo = (idPanel, activo = false) => {
    return (this.state.panelSeleccionado == idPanel || activo)
      ? "tab-pane active"
      : "tab-pane";
  };

  validarCabeceraTabActivo = (idCabecera, activo = false) => {
    return (this.state.cabeceraSeleccionado == idCabecera || activo)
      ? "nav-link active"
      : "nav-link";
  };

  abrirCerrarModal = () => {
    this.setState({ modalConsultaSuscripcion: false, modalConsulta: false });
  };

  consultarCamposTab = (idUnidad) => {
    const { campos, parametrosCampos } = this.state;
    if (Util.validarArreglo(campos[idUnidad]) || campos[idUnidad]) {
      return;
    }
    campos[idUnidad] = [];
    this.setState({ campos: campos }, () => {
      axios.post(RUTAS_API.GESTION_CONTACTOS.CONSULTAR_CAMPOS_TABS, {
        idUnidad: idUnidad
      }).then(respuesta => {
        if (respuesta.data.codigo > 0) {
          campos[idUnidad] = respuesta.data.datos;
          parametrosCampos[idUnidad] = {};
          this.setState({ campos: campos });
          this.consultarInformacionTercero(idUnidad);
        }
      });
    });
  };

  consultarCamposTabSuscripcion = (idUnidad) => {
    const { camposSuscripcion, parametrosCamposSuscripcion } = this.state;
    if (Util.validarArreglo(camposSuscripcion[idUnidad]) || camposSuscripcion[idUnidad]) {
      return;
    }
    camposSuscripcion[idUnidad] = [];
    this.setState({ camposSuscripcion: camposSuscripcion }, () => {
      //OJO: descomentariar  axios.post(RUTAS_API.GESTION_CONTACTOS.CONSULTAR_CAMPOS_TABS_SUSCRIPCION, {
      axios.post(RUTAS_API.GESTION_CONTACTOS.CONSULTAR_CAMPOS_TABS, {
        idUnidad: idUnidad
      }).then(respuesta => {
        if (respuesta.data.codigo > 0) {
          camposSuscripcion[idUnidad] = respuesta.data.datos;
          parametrosCamposSuscripcion[idUnidad] = {};
          this.setState({ camposSuscripcion: camposSuscripcion });
          this.consultarDatoSuscripcion(idUnidad);
        }
      });
    });
  };

  consultarInformacionTercero = (idUnidad) => {
    const idTercero = this.state.contacto.terIderegistro;
    axios.post(RUTAS_API.GESTION_CONTACTOS.CONSULTA_CONTACTO_INFORMACION, {
      idTercero: idTercero,
      idUnidad: idUnidad,
    }).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        let parametrosCampos = { ...this.state.parametrosCampos };
        const campos = { ...this.state.campos };
        const datos = respuesta.data.datos;
        datos.map(registro => {
          //Verificar el tipo de dato...
          const campo = campos[idUnidad].find(campo => campo.nombreDato == registro.nombredato);
          if (campo && campo.visualDato == TIPOS_CAMPO.CHECKBOX) {
            if (!Util.validarArreglo(parametrosCampos[idUnidad][registro.nombredato])) {
              parametrosCampos[idUnidad][registro.nombredato] = JSON.parse(campo.opciondato);
            }
            const index = parametrosCampos[idUnidad][registro.nombredato].findIndex(dato => { return (dato.valordato.toLowerCase()) == (registro.valordato).toLowerCase() });
            (index >= 0) && (parametrosCampos[idUnidad][registro.nombredato][index].seleccionado = true);
          } else {
            parametrosCampos[idUnidad][registro.nombredato] = registro.valordato;
          }
          this.setState(parametrosCampos);
        });
      }
    });
  }

  consultarDatoSuscripcion = (idUnidad) => {
    const idTercero = this.state.contacto.terIderegistro;
    const idSuscripcion = this.state.idSuscripcion;
    const { parametrosCampos = {} } = this.state;
    axios.post(RUTAS_API.GESTION_CONTACTOS.CONSULTA_CONTACTO_INFORMACION_SUSCRIPCION, {
      // OJO:anterior  axios.post(RUTAS_API.GESTION_CONTACTOS.CONSULTA_CONTACTO_INFORMACION, {
      idTercero: idTercero,
      idUnidad: idUnidad,
      idSuscripcion: idSuscripcion,
    }).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        let parametrosCamposSuscripcion = { ...this.state.parametrosCamposSuscripcion };
        const datos = respuesta.data.datos;
        datos.map(registro => {
          if (registro.registrodato == "uni") {
            parametrosCamposSuscripcion[idUnidad][registro.nombredato] = registro.valordato;
          } else {
            if (!Util.validarArreglo(parametrosCamposSuscripcion[idUnidad][registro.nombredato])) {
              parametrosCamposSuscripcion[idUnidad][registro.nombredato] = [];
            }
            parametrosCamposSuscripcion[idUnidad][registro.nombredato].push({ valordato: registro.valordato, seleccionado: true });
          }
          this.setState({ parametrosCamposSuscripcion: parametrosCamposSuscripcion })
        });
      }
    });
  }

  renderCampos = (idUnidad) => {
    const { campos } = this.state;
    const listaCampos = campos[idUnidad];
    if (!Util.validarArreglo(listaCampos)) {
      return;
    }
    return listaCampos.map(campo => {
      return this.renderCampo(campo, idUnidad);
    });
  };

  renderCamposSuscripcion = (idUnidad) => {
    const { camposSuscripcion } = this.state;
    const listaCampos = camposSuscripcion[idUnidad];
    if (!Util.validarArreglo(listaCampos)) {
      return;
    }
    return listaCampos.map(camposSuscripcion => {
      return this.renderCampoSuscripcion(camposSuscripcion, idUnidad);
    });
  };

  controlarCambioParametrosCampos = (evento) => {
    const control = evento.target;
    const nombrePropiedad = control.name;
    const valor = (control.checked) ? control.checked : control.value;
    const idUnidad = control.attributes['data-idunidad'].value;
    const { parametrosCampos } = this.state;
    parametrosCampos[idUnidad][nombrePropiedad] = valor;
    this.setState({ parametrosCampos: parametrosCampos });
  };

  controlarCambioParametrosCamposSuscripcion = (evento) => {
    const control = evento.target;
    const nombrePropiedad = control.name;
    const valor = (control.checked) ? control.checked : control.value;
    const idUnidad = control.attributes['data-idunidad'].value;
    const { parametrosCamposSuscripcion } = this.state;
    parametrosCamposSuscripcion[idUnidad][nombrePropiedad] = valor;
    this.setState({ parametrosCamposSuscripcion: parametrosCamposSuscripcion });
  };

  renderTexto = (campo, idUnidad, valor) => {
    return (
      <Input
        label={campo.nombreDato + ':' + (campo.tipoDato == 'req' ? '*' : '')}
        onChange={this.controlarCambioParametrosCampos}
        name={campo.nombreDato}
        value={valor}
        extra={{ 'data-idunidad': idUnidad }}
      />
    );
  };

  renderTextoSuscripcion = (campo, idUnidad, valor) => {
    return (
      <Input
        label={campo.nombreDato + ':' + (campo.tipoDato == 'req' ? '*' : '')}
        onChange={this.controlarCambioParametrosCamposSuscripcion}
        name={campo.nombreDato}
        value={valor}
        extra={{ 'data-idunidad': idUnidad }}
      />
    );
  };

  renderCheckbox = (campo, idUnidad) => {
    const valor = getProp(this.state.parametrosCampos, idUnidad + '.' + campo.nombreDato, '');
    return (
      <div className='col-4 form-group'>
        <label key={campo.nombreDato}>
          <input type="checkbox"
            onChange={this.controlarCambioParametrosCampos}
            name={campo.nombreDato}
            checked={valor}
            data-idunidad={idUnidad}
          />
          {campo.nombreDato + ':' + (campo.tipoDato == 'req' ? '*' : '')}
        </label>
      </div>
    );
  };

  renderNumerico = (campo, idUnidad, valor) => {
    return (
      <TextoNumerico
        aceptaDecimales={false}
        aceptaNegativos={false}
        label={campo.nombreDato + ':' + (campo.tipoDato == 'req' ? '*' : '')}
        cols={4}
        onChange={this.controlarCambioParametrosCampos}
        name={campo.nombreDato}
        value={valor}
        extra={{ 'data-idunidad': idUnidad }}
      />
    )
  };


  renderNumericoSuscripcion = (campo, idUnidad, valor) => {
    return (
      <TextoNumerico
        aceptaDecimales={false}
        aceptaNegativos={false}
        label={campo.nombreDato + ':' + (campo.tipoDato == 'req' ? '*' : '')}
        cols={4}
        onChange={this.controlarCambioParametrosCamposSuscripcion}
        name={campo.nombreDato}
        value={valor}
        extra={{ 'data-idunidad': idUnidad }}
      />
    )
  };

  renderInput = (campo, idUnidad) => {
    const valor = getProp(this.state.parametrosCampos, idUnidad + '.' + campo.nombreDato, '');
    if (campo.nombreDato == 'Email') {
      console.log(this.state.parametrosCampos, idUnidad, 'EMAIL TEST', campo.nombreDato);
      console.log(valor, 'EMAIL')
      console.log(campo);
    }
    if (campo.expresionRegular === '[0-9]') {
      return this.renderNumerico(campo, idUnidad, valor);
    }
    return this.renderTexto(campo, idUnidad, valor);
  };
  renderInputSuscripcion = (campo, idUnidad) => {
    const valor = getProp(this.state.parametrosCamposSuscripcion, idUnidad + '.' + campo.nombreDato, '');
    if (campo.expresionRegular === '[0-9]') {
      return this.renderNumericoSuscripcion(campo, idUnidad, valor);
    }
    return this.renderTextoSuscripcion(campo, idUnidad, valor);
  };

  renderCombo = (campo, idUnidad) => {
    const lista = JSON.parse(campo.opciondato);
    const valor = getProp(this.state.parametrosCampos, idUnidad + '.' + campo.nombreDato, '');
    return (
      <Combo
        opciones={lista}
        propTexto='valordato'//keydato
        propValor='valordato'
        label={campo.nombreDato + ':' + (campo.tipoDato == 'req' ? '*' : '')}
        name={campo.nombreDato}
        value={valor}
        onChange={this.controlarCambioParametrosCampos}
        extra={{ 'data-idunidad': idUnidad }}
      />
    )
  };

  renderComboSuscripcion = (campo, idUnidad) => {
    const lista = JSON.parse(campo.opciondato);
    const valor = getProp(this.state.parametrosCamposSuscripcion, idUnidad + '.' + campo.nombreDato, '');
    return (
      <Combo
        opciones={lista}
        propTexto='valordato'//keydato
        propValor='valordato'
        label={campo.nombreDato + ':' + (campo.tipoDato == 'req' ? '*' : '')}
        name={campo.nombreDato}
        value={valor}
        onChange={this.controlarCambioParametrosCamposSuscripcion}
        extra={{ 'data-idunidad': idUnidad }}
      />
    )
  };

  renderComboMultiple = (campo, idUnidad) => {
    const lista = JSON.parse(campo.opciondato);
    const valor = getProp(this.state.parametrosCampos, idUnidad + '.' + campo.nombreDato, lista);
    return (
      <SelectorMultiple
        titulo={campo.nombreDato + ':' + (campo.tipoDato == 'req' ? '*' : '')}
        propTexto='valordato'
        propValor='valordato'
        nombreDato={campo.nombreDato}
        idUnidad={idUnidad}
        seleccionarItem={(evento, nombreDato, idUnidad) => {
          const valorDato = valor;
          const value = evento.target.value;
          const index = valorDato.findIndex(item => item.valordato == value);
          valorDato[index].seleccionado = evento.target.checked;
          const { parametrosCampos } = this.state;
          parametrosCampos[idUnidad][nombreDato] = valorDato;
          this.setState({ parametrosCampos: parametrosCampos });
          this.setState({ valorDato: valorDato });
        }}
        lista={Util.validarArreglo(valor) ? valor : lista}
      />

    )
  };

  renderComboMultipleSuscripcion = (campo, idUnidad) => {
    let lista = [];
    try {
      lista = JSON.parse(campo.opciondato);
      const seleccionados = getProp(this.state.parametrosCamposSuscripcion, idUnidad + '.' + campo.nombreDato, []);
      if (seleccionados.length === lista.length) {
        lista = seleccionados;
      } else {
        lista = lista.map(item => {
          const exist = seleccionados.find(s => s.valordato === item.valordato);
          if (exist) {
            item.seleccionado = true;
          }
          return item;
        });
      }
    } catch (error) {
      console.log(error);
    }
    return (
      <SelectorMultiple
        titulo={campo.nombreDato + ':' + (campo.tipoDato == 'req' ? '*' : '')}
        propTexto='valordato'
        propValor='valordato'
        nombreDato={campo.nombreDato}
        idUnidad={idUnidad}
        seleccionarItem={(evento, nombreDato, idUnidad) => {
          const listaTemp = lista;
          const value = evento.target.value;
          const index = listaTemp.findIndex(item => item.valordato == value);
          listaTemp[index].seleccionado = evento.target.checked;
          const { parametrosCamposSuscripcion } = this.state;
          parametrosCamposSuscripcion[idUnidad][nombreDato] = listaTemp;
          this.setState({ parametrosCamposSuscripcion: parametrosCamposSuscripcion });
        }}
        lista={lista}
      />
    )
  };

  seleccionarContrato = (evento) => {
    const valorDato = this.state.valorDato;
    const value = evento.target.value;
    const index = valorDato.findIndex(c => c.uniIderegistro == value);
    valorDato[index].seleccionado = evento.target.checked;
    this.setState({ valorDato: valorDato });
  };

  renderCalendario = (campo, idUnidad) => {
    const valor = getProp(this.state.parametrosCampos, idUnidad + '.' + campo.nombreDato, '');
    <Fecha
      label={campo.nombreDato + ':' + (campo.tipoDato == 'req' ? '*' : '')}
      onChange={this.controlarCambioParametrosCampos}
      name={campo.nombreDato}
      fecha={valor}
      extra={{ 'data-idunidad': idUnidad }}
    />
  };


  renderCalendarioSuscripcion = (campo, idUnidad) => {
    const valor = getProp(this.state.parametrosCamposSuscripcion, idUnidad + '.' + campo.nombreDato, '');
    <Fecha
      label={campo.nombreDato + ':' + (campo.tipoDato == 'req' ? '*' : '')}
      onChange={this.controlarCambioParametrosCamposSuscripcion}
      name={campo.nombreDato}
      fecha={valor}
      extra={{ 'data-idunidad': idUnidad }}
    />
  };

  renderCampo = (campo, idUnidad) => {
    switch (campo.visualDato) {
      case TIPOS_CAMPO.INPUT:
        return this.renderInput(campo, idUnidad);
      case TIPOS_CAMPO.COMBO:
        return this.renderCombo(campo, idUnidad);
      case TIPOS_CAMPO.CALENDARIO:
        return this.renderCalendario(campo, idUnidad);
      case TIPOS_CAMPO.CHECKBOX:
        return this.renderComboMultiple(campo, idUnidad);
    }
  };

  renderCampoSuscripcion = (campo, idUnidad) => {
    switch (campo.visualDato) {
      case TIPOS_CAMPO.INPUT:
        return this.renderInputSuscripcion(campo, idUnidad);
      case TIPOS_CAMPO.COMBO:
        return this.renderComboSuscripcion(campo, idUnidad);
      case TIPOS_CAMPO.CALENDARIO:
        return this.renderCalendarioSuscripcion(campo, idUnidad);
      case TIPOS_CAMPO.CHECKBOX:
        return this.renderComboMultipleSuscripcion(campo, idUnidad);
    }
  };

  /**
   * Renderiza los tabs...
   */
  renderTabsContacto = () => {
    const { panelSeleccionadoActualizado, listaTabs } = this.state;
    return (
      <div className="col-12">
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          {
            listaTabs.map((tabRegistro, index) => {
              return (
                <li className="nav-item" >
                  <a className={this.validarCabeceraTabActivo(tabRegistro.uniIderegistro, (index == 0 && !panelSeleccionadoActualizado))} id={tabRegistro.uniIderegistro + 'tab'} role="tab" onClick={this.controlarTab} data-panel={tabRegistro.uniIderegistro}>{tabRegistro.aliasInfo}</a>
                </li>
              )
            })
          }
        </ul>
        <div className="tab-content">
          {
            listaTabs.map((tabRegistro, index) => {
              this.consultarCamposTab(tabRegistro.uniIderegistro);
              return (
                <div className={this.validarPanelActivo(tabRegistro.uniIderegistro, (index == 0 && !panelSeleccionadoActualizado))} id={tabRegistro.uniIderegistro} role="tabpanel" aria-labelledby={tabRegistro.uniIderegistro + 'tab'}>
                  <div className='row pt-3'>
                    {this.renderCampos(tabRegistro.uniIderegistro)}
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  };

  renderTabSuscripcionesVinculadas = () => {
    const { panelSeleccionadoActualizado, listaTabsSuscripcion } = this.state;
    return (
      <div className="col-12">
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          {
            listaTabsSuscripcion.map((tabRegistro, index) => {
              return (
                <li className="nav-item" >
                  <a className={this.validarCabeceraTabActivo(tabRegistro.uniIderegistro, (index == 0 && !panelSeleccionadoActualizado))} id={tabRegistro.uniIderegistro + 'tab'} role="tab" onClick={this.controlarTab} data-panel={tabRegistro.uniIderegistro}>{tabRegistro.aliasInfo}</a>
                </li>
              )
            })
          }
        </ul>
        <div className="tab-content">
          {
            listaTabsSuscripcion.map((tabRegistro, index) => {
              this.consultarCamposTabSuscripcion(tabRegistro.uniIderegistro);
              return (
                <div className={this.validarPanelActivo(tabRegistro.uniIderegistro, (index == 0 && !panelSeleccionadoActualizado))} id={tabRegistro.uniIderegistro} role="tabpanel" aria-labelledby={tabRegistro.uniIderegistro + 'tab'}>
                  <div className='row pt-3'>
                    {this.state.parametrosCamposSuscripcion[tabRegistro.uniIderegistro] != null &&
                      this.renderCamposSuscripcion(tabRegistro.uniIderegistro)}
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  };


  obtenerDatos = () => {
    console.log(this.state.parametrosCampos);
  };

  controlarCambioTablaSuscripcionesVinculadas = async (evento) => {
    let { idSuscripcion, indexAnterior } = this.state;
    const control = evento.target;
    const { listaSuscripcionesVinculadas } = this.state;
    if (control.name == 'selectAll') {
      this.setState({
        listaSuscripcionesVinculadas: listaSuscripcionesVinculadas
          .map(r => { r.seleccionado = control.checked; return r })
      })
      return;
    }
    const idRegistro = control.attributes['data-ideregistro'].value;
    const index = listaSuscripcionesVinculadas.findIndex(s => s.codsIderegistro == idRegistro);
    if (index >= 0) {
      listaSuscripcionesVinculadas[index][control.name] = (control.type == 'checkbox' || control.type == 'radio') ? control.checked : control.value;
      if (control.type == 'radio') {
        idSuscripcion = listaSuscripcionesVinculadas[index].dsusIderegistr;
        listaSuscripcionesVinculadas[indexAnterior][control.name] = false;

        await this.setState({
          indexAnterior: index,
          listaSuscripcionesVinculadas: listaSuscripcionesVinculadas,
          idSuscripcion: idSuscripcion,

          camposSuscripcion: {},
          parametrosCamposSuscripcion: {},
          listaTabsSuscripcion: []
        });
        this.consultarInformacionSuscripcion(true);
        return;
      }

      this.setState({ indexAnterior: index, listaSuscripcionesVinculadas: listaSuscripcionesVinculadas, idSuscripcion: idSuscripcion });
    }
  };

  renderTablaSuscripcionesVinculadas = () => {
    if (!Util.validarArreglo(this.state.listaSuscripcionesVinculadas)) {
      return null;
    }
    return (
      <table className='table table-condensed table-striped table-bordered'>
        <thead>
          <tr>
            <th>Suscripciones Vinculadas Contacto</th>
            <th><label><input type="checkbox" name="selectAll" onClick={this.controlarCambioTablaSuscripcionesVinculadas} /> Seleccionar</label></th>
          </tr>
        </thead>
        <tbody>
          {this.state.listaSuscripcionesVinculadas.map(suscripcion => {
            return (
              <tr key={suscripcion.dsusIderegistr}>
                <td>
                  <input type="radio" name="radioseleccionado" className='col-1' checked={suscripcion.radioseleccionado || false} onChange={this.controlarCambioTablaSuscripcionesVinculadas} data-ideregistro={suscripcion.codsIderegistro} />
                  {`${suscripcion.dsusPcodigo} - ${suscripcion.terNomcompleto} - ${suscripcion.proDireccion}`}
                </td>
                <td>
                  <label><input type="checkbox" name="seleccionado" checked={suscripcion.seleccionado || false} onChange={this.controlarCambioTablaSuscripcionesVinculadas} data-ideregistro={suscripcion.codsIderegistro} /> Seleccionar</label>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  };

  desvincular = () => {
    const { listaSuscripcionesVinculadas, contacto } = this.state;
    const listaSuscripciones = listaSuscripcionesVinculadas.filter(suscripcion => suscripcion.seleccionado)
      .map(suscripcion => {
        return suscripcion.codsIderegistro;
      });
    if (listaSuscripciones.length == 0) {
      this.props.mostrarAlerta('Error', 'Seleccione como mínimo una suscripción');
      return;
    }
    axios.post(RUTAS_API.GESTION_CONTACTOS.DESVINCULAR, {
      terIderegistro: contacto.terIderegistro, idsSuscripciones: listaSuscripciones.join(',')
    }).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        this.props.mostrarAlerta('Correcto', 'Se ha desvinculado correctamente los registros.');
        this.consultarSuscripcionesVinculadas(contacto);
      } else {
        this.props.mostrarAlerta('Correcto', 'No se pudo desvincular los registros.');
      }
    });
  };

  verHistorico = () => {
    const { fecdesde, fechasta, contacto } = this.state;
    axios.post(RUTAS_API.GESTION_CONTACTOS.VER_HISTORICO, {
      terIderegistro: { terIderegistro: contacto.terIderegistro },
      fecdesde: fecdesde,
      fechasta: fechasta
    }).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        this.setState({ listaHistorico: respuesta.data.datos })
      }
    });
  };

  renderHistorico = () => {
    const { listaHistorico } = this.state;
    if (listaHistorico.length <= 0) {
      return;
    }
    return (<table className=''>
      <thead>
        <tr>
          <th>
            idSuscripcion
              </th>
          <th>
            Dato Anterior
                </th>
          <th>
            NUevo Dato
                </th>
          <th>
            Usuario
                </th>
        </tr>
      </thead>
      <tbody>

        {
          listaHistorico.map(datoHistorico => {
            return (
              <tr>
                <td>
                  {datoHistorico.ideSuscripion}
                </td>
                <td>
                  {datoHistorico.datoanterior}
                </td>
                <td>
                  {datoHistorico.nuevodato}
                </td>
                <td>
                  {datoHistorico.idusuario}
                </td>
              </tr>
            )
          })
        }


      </tbody>
    </table>);
  };

  render() {
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='conf-general row mt-5'>
          <Input
            label='Nombre Tercero:'
            value={getProp(this.state.contacto, 'terNomcompleto', '')}
            onChange={this.controlarCambio}
            name='nombreTercero'
            extra={{ disabled: true }}
          />
          <Input
            label='Documento Tercero:'
            value={getProp(this.state.contacto, 'terDocumento', '')}
            onChange={this.controlarCambio}
            name='documentoTercero'
            extra={{ disabled: true }}
          />
          <Input
            label='Fecha Nacimiento Tercero:'
            value={getProp(this.state.contacto, 'terFecnacimiento', '')}
            onChange={this.controlarCambio}
            name='fecNacimiento'
            extra={{ disabled: true }}
          />
          <Input
            label='Telefono Tercero:'
            value={getProp(this.state.contacto, 'terTelcelular', '')}
            onChange={this.controlarCambio}
            name='origenContacto'
            extra={{ disabled: true }}
          />
          <Input
            label='Email Tercero:'
            value={getProp(this.state.contacto, 'terCorreo', '')}
            onChange={this.controlarCambio}
            name='origenContacto'
            extra={{ disabled: true }}
          />
          <Input
            label='Fecha Creacion Contacto:'
            value={getProp(this.state.contacto, 'conFechaCreacion', '')}
            onChange={this.controlarCambio}
            name='fecCreaContacto'
            extra={{ disabled: true }}
          />
          <Input
            label='Origen Dato Contacto:'
            value={getProp(this.state.contacto, 'conOrigenDato', '')}
            onChange={this.controlarCambio}
            name='origenContacto'
            extra={{ disabled: true }}
          />

          <div className="form-group m-t28 col-12 text-right">
            <button className="btn btn-primary" onClick={() => { this.consultarInformacionSuscripcion() }}>Suscripciones Vinculadas</button>
            <button className="btn btn-primary m-l5" onClick={this.consultarInformacionContacto}>Informacion Contacto</button>
          </div>

          {this.state.tab === TIPOS_FILTRO.SUSCRIPCION && this.renderTablaSuscripcionesVinculadas()}

          <div className="form-group m-t28 col-12 text-right">
            {(<button className='btn btn-primary' onClick={this.consultarModalSuscripcion}>Vincular Suscripción</button>)}
            {(this.state.tab == TIPOS_FILTRO.SUSCRIPCION) && (<button className='btn btn-primary m-l5' onClick={this.verHistorico} onClick={this.desvincular}>Desvincular Suscripción</button>)}
          </div>
          {this.state.tab === TIPOS_FILTRO.SUSCRIPCION && this.renderTabSuscripcionesVinculadas()}


          {this.state.tab === TIPOS_FILTRO.CONTACTO && this.renderTabsContacto()}

          {(this.state.tab === TIPOS_FILTRO.CONTACTO || this.state.tab == TIPOS_FILTRO.SUSCRIPCION) && (<Fecha onChange={this.controlarCambio} value={this.state.fecdesde} cols={3} label='Desde' placeholder={''} name='fecdesde'></Fecha>)}
          {(this.state.tab === TIPOS_FILTRO.CONTACTO || this.state.tab == TIPOS_FILTRO.SUSCRIPCION) && (<Fecha onChange={this.controlarCambio} value={this.state.fechasta} cols={3} label='Hasta' placeholder={''} name='fechasta'></Fecha>)}
          <div className='col 4 form-group'>
            {(this.state.tab === TIPOS_FILTRO.CONTACTO || this.state.tab == TIPOS_FILTRO.SUSCRIPCION) && (<button className='btn btn-primary m-t28 text-right' onClick={this.verHistorico}>Ver Historial</button>)}
          </div>
          {this.renderHistorico()}
        </div>
        <VentanaModal
          mostrar={this.state.modalConsulta}
          titulo='Consulta de contactos'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaContactos esModal seleccionarEntidad={this.cargarDatos} mostrarAlerta={this.props.mostrarAlerta} />
        </VentanaModal>
        <VentanaModal
          mostrar={this.state.modalConsultaSuscripcion}
          titulo='Consulta de Suscripciones'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaSuscripciones esModal seleccionarEntidad={this.vincularSuscripcion} mostrarAlerta={this.props.mostrarAlerta} />
        </VentanaModal>
      </Fragment>
    );
  }

}

/*

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(RegistroContacto);*/
RegistroContacto.propTypes = {
  history: PropTypes.object,
  mostrarAlerta: PropTypes.func
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta,
  }, dispatch);
};


const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(RegistroContacto);
//export { RegistroContacto as RRegistroContacto };
export { VistaRedux as RRegistroContacto };