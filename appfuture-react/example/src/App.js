import React, { Component } from 'react';
import {
  Boton,
  Botonera,
  Cargador,
  Combo,
  Contenedor,
  Fecha,
  Input,
  Interruptor,
  Tab,
  Tabla,
  TextArea,
  VentanaModal
} from 'appfuture-react';

export default class App extends Component {

  state = {
    mostrarModal: false,
    numero: 15500,
    fecha: ''
  };

  componentDidMount() {
    // console.log(Util.validarArreglo([]));
    // console.log(Util.esObjetoVacio({}));
  }

  onComboChange = (event) => {
    //console.log(event);

  };

  abrirCerrarDialogo = () => {
    this.setState({
      mostrarDialogo: !this.state.mostrarModal
    });
  };

  abrirCerrarModal = () => {
    this.setState({
      mostrarModal: !this.state.mostrarModal
    });
  };

  getDatos = () => {
    return [
      { id: 1, nombre: 'Natalia', codigo: 'nat001' },
      { id: 2, nombre: 'Eduardo', codigo: 'edu001' },
      { id: 3, nombre: 'Camila', codigo: 'cam001' },
      { id: 4, nombre: 'Julian', codigo: 'jul001' },
      { id: 5, nombre: 'Rosario', codigo: 'ros001' },
    ];
  };
  getColumnas = () => {
    return [
      {
        Header: 'Configuraciones',
        columns: [
          {
            Header: 'Acción',
            accessor: 'id',
            Cell: (props) => <span>TEST {props.original.id}</span>
          },
          {
            Header: 'Nombre',
            accessor: 'nombre'
          },
          {
            Header: 'Código',
            accessor: 'codigo'
          }
        ]
      }
    ];
  };

  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    console.log('CONTROLA EL CAMBIO: ', evento);
    this.setState(change);
  };

  render() {
    // const opcionesCombo = [
    //   { id: '1', opcion: 'Opcion 1' },
    //   { id: '2', opcion: 'Opcion 2' }
    // ];

    const opcionesComboObjeto = [
      { id: '1', opcion: { texto: 'Opcion 1' } },
      { id: '2', opcion: { texto: 'Opcion 2' } }
    ];

    const funciones = [
      { texto: 'Guardar', title: 'Guardar', callback: (evento) => console.log(evento.target.innerText) },
      { texto: 'Editar', callback: (evento) => console.log(evento) },
      { texto: 'Borrar', callback: (evento) => console.log(evento) },
      { texto: 'Abrir Modal', callback: this.abrirCerrarModal },
      { texto: 'Abrir Dialogo', callback: this.abrirCerrarDialogo }
    ];

    const opcionesExtraCombo = {
      onDoubleClick: (event) => console.log(event.target.value)
    };
    const opcionesComboCustom = [{"uniConcepto":2418,"estConcepto":116,"conNombre":"I-BUTANO","conAlias":"I-BUTANO","conAbreviatura":"I-BUTANO","conTipcalculo":"F","conFormula":"[{\"tipo\":\"parAbre\",\"valor\":\"(\"},{\"tipo\":\"con\",\"valor\":\"CO2\",\"idconcepto\":2409,\"extra\":{\"uniConcepto\":2409,\"estConcepto\":116,\"conNombre\":\"CO2\",\"conAlias\":\"CO2\",\"conAbreviatura\":\"CO2\",\"conTipcalculo\":\"F\",\"conOperacion\":\"I\",\"conPreliquidar\":\"N\",\"conAnticipo\":\"N\",\"conPagpriori\":0,\"conFinanciable\":\"N\",\"conEstado\":\"A\",\"prgIderegistro\":545,\"conTipregistro\":\"N\",\"conCondonable\":\"N\",\"conValnulo\":\"S\",\"usuIderegistro\":288,\"conSuspende\":\"N\",\"conIntfinanciacion\":\"N\",\"conMetajuste\":\"N\",\"conContabiliza\":\"N\",\"uniUnidad\":{\"uniIderegistro\":2409,\"estIderegistro\":{\"estIderegistro\":116},\"uniCodigo1\":\"CO2\",\"uniCodigo2\":\"null\",\"uniCodigo3\":\"null\",\"uniCodigo4\":\"null\",\"uniCodigo5\":\"null\",\"uniNombre1\":\"CO2\",\"uniNombre2\":\"null\",\"uniNombre3\":\"null\",\"uniNombre4\":\"null\",\"uniNombre5\":\"null\",\"uniOrden\":1,\"uniNivel\":1,\"uniCodigo\":\"116CO2\",\"uniIdepadre\":{},\"usuIderegistro\":288,\"uniPropiedad\":\"{\\\"frecuencia\\\": \\\"A\\\", \\\"descripcion\\\": \\\"CO2\\\", \\\"periodicidad\\\": \\\"20\\\", \\\"tipoVariable\\\": \\\"B\\\", \\\"unidadMedida\\\": \\\"5021\\\", \\\"decimalesVisualiza\\\": \\\"2\\\"}\"}}},{\"tipo\":\"parCierra\",\"valor\":\")\"},{\"tipo\":\"op\",\"valor\":\"+\"},{\"tipo\":\"fun\",\"valor\":\"capital\",\"extra\":{\"funNombre\":\"capital\",\"funDescripcion\":\"CAPITAL\",\"funUbicacion\":\"FuncionesCreditoDelegado - CAPITAL\",\"funTipo\":\"C\",\"funIderegistro\":20,\"funParametro\":0,\"usuIderegistro\":288}}]","conOperacion":"I","conPreliquidar":"N","conAnticipo":"N","conFinanciable":"N","conEstado":"A","prgIderegistro":545,"conTipregistro":"N","conCondonable":"N","conValnulo":"S","usuIderegistro":288,"funIderegistro":7,"conSuspende":"N","conIntfinanciacion":"N","conMetajuste":"R","conPrecision":43,"conContabiliza":"N","uniUnidad":{"uniIderegistro":2418,"uniCodigo1":"I-BUTANO","uniNombre1":"I-BUTANO","uniOrden":1,"uniNivel":1,"uniCodigo":"116I-BUTANO","usuIderegistro":288,"uniPropiedad":"{\"uniestado\": \"A\", \"frecuencia\": \"A\", \"descripcion\": \"I-BUTANO\", \"periodicidad\": \"20\", \"tipoVariable\": \"B\", \"unidadMedida\": \"2565\", \"decimalesVisualiza\": \"2\"}"}},{"uniConcepto":2559,"estConcepto":116,"conNombre":"Variable prueba R","conAlias":"Var_Pru_R","conAbreviatura":"VPR","conTipcalculo":"F","conValor":150,"conFormula":"[{\"tipo\":\"con\",\"valor\":\"TRM\",\"idconcepto\":2548,\"extra\":{\"uniConcepto\":2548,\"estConcepto\":116,\"conNombre\":\"TRM\",\"conAlias\":\"TRM\",\"conAbreviatura\":\"TRM\",\"conTipcalculo\":\"F\",\"conFormula\":\"[{\\\"tipo\\\":\\\"con\\\",\\\"valor\\\":\\\"D_Gas\\\",\\\"idconcepto\\\":2550,\\\"extra\\\":{\\\"uniConcepto\\\":2550,\\\"estConcepto\\\":116,\\\"conNombre\\\":\\\"Densidad Gas\\\",\\\"conAlias\\\":\\\"D_Gas\\\",\\\"conAbreviatura\\\":\\\"D_Gas\\\",\\\"conTipcalculo\\\":\\\"V\\\",\\\"conOperacion\\\":\\\"I\\\",\\\"conPreliquidar\\\":\\\"N\\\",\\\"conAnticipo\\\":\\\"N\\\",\\\"conFinanciable\\\":\\\"N\\\",\\\"conInivigencia\\\":1547771520307,\\\"conEstado\\\":\\\"A\\\",\\\"prgIderegistro\\\":5,\\\"conTipregistro\\\":\\\"N\\\",\\\"conCondonable\\\":\\\"N\\\",\\\"conValnulo\\\":\\\"S\\\",\\\"usuIderegistro\\\":288,\\\"funIderegistro\\\":7,\\\"conSuspende\\\":\\\"N\\\",\\\"conIntfinanciacion\\\":\\\"N\\\",\\\"conMetajuste\\\":\\\"R\\\",\\\"conPrecision\\\":0,\\\"conContabiliza\\\":\\\"N\\\",\\\"uniUnidad\\\":{\\\"uniIderegistro\\\":2550,\\\"estIderegistro\\\":{\\\"estIderegistro\\\":116},\\\"uniCodigo1\\\":\\\"D_Gas\\\",\\\"uniNombre1\\\":\\\"Densidad Gas\\\",\\\"uniOrden\\\":1,\\\"uniNivel\\\":1,\\\"uniCodigo\\\":\\\"116D_Gas\\\",\\\"uniIdepadre\\\":{},\\\"usuIderegistro\\\":288,\\\"uniPropiedad\\\":\\\"{\\\\\\\"frecuencia\\\\\\\": \\\\\\\"D\\\\\\\", \\\\\\\"descripcion\\\\\\\": \\\\\\\"Densidad de Gas\\\\\\\", \\\\\\\"periodicidad\\\\\\\": \\\\\\\"0\\\\\\\", \\\\\\\"tipoVariable\\\\\\\": \\\\\\\"B\\\\\\\", \\\\\\\"unidadMedida\\\\\\\": \\\\\\\"2352\\\\\\\", \\\\\\\"decimalesVisualiza\\\\\\\": \\\\\\\"0\\\\\\\"}\\\"}}},{\\\"tipo\\\":\\\"op\\\",\\\"valor\\\":\\\"+\\\"},{\\\"tipo\\\":\\\"con\\\",\\\"valor\\\":\\\"PROP\\\",\\\"idconcepto\\\":2554,\\\"extra\\\":{\\\"uniConcepto\\\":2554,\\\"estConcepto\\\":116,\\\"conNombre\\\":\\\"PROPANO\\\",\\\"conAlias\\\":\\\"PROP\\\",\\\"conAbreviatura\\\":\\\"PROP\\\",\\\"conTipcalculo\\\":\\\"V\\\",\\\"conValor\\\":123,\\\"conFormula\\\":\\\"\\\",\\\"conOperacion\\\":\\\"I\\\",\\\"conNaturaleza\\\":\\\" \\\",\\\"conPreliquidar\\\":\\\"N\\\",\\\"conAnticipo\\\":\\\"N\\\",\\\"conFinanciable\\\":\\\"N\\\",\\\"conInivigencia\\\":1547657207944,\\\"conEstado\\\":\\\"A\\\",\\\"prgIderegistro\\\":545,\\\"conTipregistro\\\":\\\"N\\\",\\\"conCondonable\\\":\\\"N\\\",\\\"conValnulo\\\":\\\"S\\\",\\\"usuIderegistro\\\":288,\\\"funIderegistro\\\":7,\\\"conSuspende\\\":\\\"N\\\",\\\"conIntfinanciacion\\\":\\\"N\\\",\\\"conMetajuste\\\":\\\"R\\\",\\\"conPrecision\\\":123,\\\"conContabiliza\\\":\\\"N\\\",\\\"uniUnidad\\\":{\\\"uniIderegistro\\\":2554,\\\"estIderegistro\\\":{\\\"estIderegistro\\\":116},\\\"uniCodigo1\\\":\\\"PROP\\\",\\\"uniCodigo2\\\":\\\"\\\",\\\"uniCodigo3\\\":\\\"\\\",\\\"uniCodigo4\\\":\\\"\\\",\\\"uniCodigo5\\\":\\\"\\\",\\\"uniNombre1\\\":\\\"PROPANO\\\",\\\"uniNombre2\\\":\\\"\\\",\\\"uniNombre3\\\":\\\"\\\",\\\"uniNombre4\\\":\\\"\\\",\\\"uniNombre5\\\":\\\"\\\",\\\"uniOrden\\\":1,\\\"uniNivel\\\":1,\\\"uniCodigo\\\":\\\"116PROP\\\",\\\"uniIdepadre\\\":{},\\\"usuIderegistro\\\":288,\\\"uniPropiedad\\\":\\\"{\\\\\\\"frecuencia\\\\\\\": \\\\\\\"D\\\\\\\", \\\\\\\"descripcion\\\\\\\": \\\\\\\"PROPANO\\\\\\\", \\\\\\\"periodicidad\\\\\\\": \\\\\\\"2\\\\\\\", \\\\\\\"tipoVariable\\\\\\\": \\\\\\\"B\\\\\\\", \\\\\\\"unidadMedida\\\\\\\": \\\\\\\"2352\\\\\\\", \\\\\\\"decimalesVisualiza\\\\\\\": \\\\\\\"2\\\\\\\"}\\\"}}}]\",\"conOperacion\":\"I\",\"conPreliquidar\":\"N\",\"conAnticipo\":\"N\",\"conFinanciable\":\"N\",\"conInivigencia\":1547771227780,\"conEstado\":\"A\",\"prgIderegistro\":5,\"conTipregistro\":\"N\",\"conCondonable\":\"N\",\"conValnulo\":\"S\",\"usuIderegistro\":288,\"funIderegistro\":7,\"conSuspende\":\"N\",\"conIntfinanciacion\":\"N\",\"conMetajuste\":\"R\",\"conPrecision\":0,\"conContabiliza\":\"N\",\"uniUnidad\":{\"uniIderegistro\":2548,\"estIderegistro\":{\"estIderegistro\":116},\"uniCodigo1\":\"TRM\",\"uniNombre1\":\"TRM\",\"uniOrden\":1,\"uniNivel\":1,\"uniCodigo\":\"116TRM\",\"uniIdepadre\":{},\"usuIderegistro\":288,\"uniPropiedad\":\"{\\\"frecuencia\\\": \\\"D\\\", \\\"descripcion\\\": \\\"TRM  del día\\\", \\\"periodicidad\\\": \\\"0\\\", \\\"tipoVariable\\\": \\\"B\\\", \\\"unidadMedida\\\": \\\"2503\\\", \\\"decimalesVisualiza\\\": \\\"0\\\"}\"}}},{\"tipo\":\"op\",\"valor\":\"+\"},{\"tipo\":\"parAbre\",\"valor\":\"(\"},{\"tipo\":\"con\",\"valor\":\"met\",\"idconcepto\":2553,\"extra\":{\"uniConcepto\":2553,\"estConcepto\":116,\"conNombre\":\"METANO\",\"conAlias\":\"met\",\"conAbreviatura\":\"met\",\"conTipcalculo\":\"V\",\"conValor\":0,\"conOperacion\":\"I\",\"conPreliquidar\":\"N\",\"conAnticipo\":\"N\",\"conFinanciable\":\"N\",\"conInivigencia\":1547773017423,\"conEstado\":\"A\",\"prgIderegistro\":5,\"conTipregistro\":\"N\",\"conCondonable\":\"N\",\"conValnulo\":\"S\",\"usuIderegistro\":288,\"funIderegistro\":7,\"conSuspende\":\"N\",\"conIntfinanciacion\":\"N\",\"conMetajuste\":\"R\",\"conPrecision\":0,\"conContabiliza\":\"N\",\"uniUnidad\":{\"uniIderegistro\":2553,\"estIderegistro\":{\"estIderegistro\":116},\"uniCodigo1\":\"met\",\"uniNombre1\":\"METANO\",\"uniOrden\":1,\"uniNivel\":1,\"uniCodigo\":\"116met\",\"uniIdepadre\":{},\"usuIderegistro\":288,\"uniPropiedad\":\"{\\\"frecuencia\\\": \\\"D\\\", \\\"descripcion\\\": \\\"metano\\\", \\\"periodicidad\\\": \\\"0\\\", \\\"tipoVariable\\\": \\\"B\\\", \\\"unidadMedida\\\": \\\"2362\\\", \\\"decimalesVisualiza\\\": \\\"0\\\"}\"}}},{\"tipo\":\"op\",\"valor\":\"*\"},{\"tipo\":\"con\",\"valor\":\"PROP\",\"idconcepto\":2554,\"extra\":{\"uniConcepto\":2554,\"estConcepto\":116,\"conNombre\":\"PROPANO\",\"conAlias\":\"PROP\",\"conAbreviatura\":\"PROP\",\"conTipcalculo\":\"V\",\"conValor\":123,\"conFormula\":\"\",\"conOperacion\":\"I\",\"conNaturaleza\":\" \",\"conPreliquidar\":\"N\",\"conAnticipo\":\"N\",\"conFinanciable\":\"N\",\"conInivigencia\":1547657207944,\"conEstado\":\"A\",\"prgIderegistro\":545,\"conTipregistro\":\"N\",\"conCondonable\":\"N\",\"conValnulo\":\"S\",\"usuIderegistro\":288,\"funIderegistro\":7,\"conSuspende\":\"N\",\"conIntfinanciacion\":\"N\",\"conMetajuste\":\"R\",\"conPrecision\":123,\"conContabiliza\":\"N\",\"uniUnidad\":{\"uniIderegistro\":2554,\"estIderegistro\":{\"estIderegistro\":116},\"uniCodigo1\":\"PROP\",\"uniCodigo2\":\"\",\"uniCodigo3\":\"\",\"uniCodigo4\":\"\",\"uniCodigo5\":\"\",\"uniNombre1\":\"PROPANO\",\"uniNombre2\":\"\",\"uniNombre3\":\"\",\"uniNombre4\":\"\",\"uniNombre5\":\"\",\"uniOrden\":1,\"uniNivel\":1,\"uniCodigo\":\"116PROP\",\"uniIdepadre\":{},\"usuIderegistro\":288,\"uniPropiedad\":\"{\\\"frecuencia\\\": \\\"D\\\", \\\"descripcion\\\": \\\"PROPANO\\\", \\\"periodicidad\\\": \\\"2\\\", \\\"tipoVariable\\\": \\\"B\\\", \\\"unidadMedida\\\": \\\"2352\\\", \\\"decimalesVisualiza\\\": \\\"2\\\"}\"}}},{\"tipo\":\"parCierra\",\"valor\":\")\"},{\"tipo\":\"op\",\"valor\":\"/\"},{\"tipo\":\"valor\",\"valor\":\"150\"},{\"tipo\":\"op\",\"valor\":\"+\"},{\"tipo\":\"valor\",\"valor\":\"10\"}]","conOperacion":"I","conPreliquidar":"N","conAnticipo":"N","conFinanciable":"N","conInivigencia":1548079382494,"conEstado":"A","prgIderegistro":5,"conTipregistro":"N","conCondonable":"N","conValnulo":"S","usuIderegistro":117,"funIderegistro":7,"conSuspende":"N","conIntfinanciacion":"N","conMetajuste":"R","conPrecision":5,"conContabiliza":"N","uniUnidad":{"uniIderegistro":2559,"uniCodigo1":"Var_Pru_R","uniNombre1":"Variable prueba R","uniOrden":1,"uniNivel":1,"uniCodigo":"116Var_Pru_R","usuIderegistro":117,"uniPropiedad":"{\"uniestado\": \"A\", \"frecuencia\": \"S\", \"descripcion\": \"variable de prueba de creación de variables\", \"periodicidad\": \"1\", \"tipoVariable\": \"B\", \"unidadMedida\": \"2362\", \"decimalesVisualiza\": \"5\"}"}},{"uniConcepto":2664,"estConcepto":116,"conNombre":"Fuente de Oro","conAlias":"Foro","conAbreviatura":"Foro","conTipcalculo":"F","conFormula":"[{\"tipo\":\"fun\",\"valor\":\"Fuente de Oro\",\"extra\":{\"funNombre\":\"Fuente de Oro\",\"funDescripcion\":\"Fuente de Oro\",\"funTipo\":\"N\",\"funIderegistro\":55,\"funParametro\":0,\"usuIderegistro\":288}}]","conOperacion":"I","conPreliquidar":"N","conAnticipo":"N","conFinanciable":"N","conInivigencia":1555971241855,"conEstado":"A","prgIderegistro":528,"conTipregistro":"N","conCondonable":"N","conValnulo":"S","usuIderegistro":288,"funIderegistro":7,"conSuspende":"N","conIntfinanciacion":"N","conMetajuste":"R","conPrecision":0,"conContabiliza":"N","uniUnidad":{"uniIderegistro":2664,"uniCodigo1":"Foro","uniNombre1":"Fuente de Oro","uniOrden":1,"uniNivel":1,"uniCodigo":"116Foro","usuIderegistro":288,"uniPropiedad":"{\"uniestado\": \"A\", \"frecuencia\": \"D\", \"descripcion\": \"Punto de consumo Fuente de Oro\", \"periodicidad\": \"0\", \"tipoVariable\": \"F\", \"unidadMedida\": \"2352\", \"decimalesVisualiza\": \"2\"}"}},{"uniConcepto":2665,"estConcepto":116,"conNombre":"Granada","conAlias":"Granada","conAbreviatura":"Grnad","conTipcalculo":"F","conFormula":"[{\"tipo\":\"fun\",\"valor\":\"Granada\",\"extra\":{\"funNombre\":\"Granada\",\"funDescripcion\":\"Granada\",\"funTipo\":\"N\",\"funIderegistro\":56,\"funParametro\":0,\"usuIderegistro\":288}}]","conOperacion":"I","conPreliquidar":"N","conAnticipo":"N","conFinanciable":"N","conInivigencia":1555971319734,"conEstado":"A","prgIderegistro":528,"conTipregistro":"N","conCondonable":"N","conValnulo":"S","usuIderegistro":288,"funIderegistro":7,"conSuspende":"N","conIntfinanciacion":"N","conMetajuste":"R","conPrecision":0,"conContabiliza":"N","uniUnidad":{"uniIderegistro":2665,"uniCodigo1":"Granada","uniNombre1":"Granada","uniOrden":1,"uniNivel":1,"uniCodigo":"116Granada","usuIderegistro":288,"uniPropiedad":"{\"uniestado\": \"A\", \"frecuencia\": \"D\", \"descripcion\": \"Punto de consumo Granada\", \"periodicidad\": \"0\", \"tipoVariable\": \"F\", \"unidadMedida\": \"2352\", \"decimalesVisualiza\": \"2\"}"}},{"uniConcepto":2668,"estConcepto":116,"conNombre":"Villavicencio","conAlias":"Villavicen","conAbreviatura":"Villav","conTipcalculo":"F","conFormula":"[{\"tipo\":\"fun\",\"valor\":\"Villavicencio\",\"extra\":{\"funNombre\":\"Villavicencio\",\"funDescripcion\":\"Villavicencio\",\"funTipo\":\"N\",\"funIderegistro\":57,\"funParametro\":0,\"usuIderegistro\":288}}]","conOperacion":"I","conPreliquidar":"N","conAnticipo":"N","conFinanciable":"N","conInivigencia":1555971574998,"conEstado":"A","prgIderegistro":528,"conTipregistro":"N","conCondonable":"N","conValnulo":"S","usuIderegistro":288,"funIderegistro":7,"conSuspende":"N","conIntfinanciacion":"N","conMetajuste":"R","conPrecision":2,"conContabiliza":"N","uniUnidad":{"uniIderegistro":2668,"uniCodigo1":"Villavicen","uniNombre1":"Villavicencio","uniOrden":1,"uniNivel":1,"uniCodigo":"116Villavicen","usuIderegistro":288,"uniPropiedad":"{\"uniestado\": \"A\", \"frecuencia\": \"D\", \"descripcion\": \"Punto de consumo Villavicencio\", \"periodicidad\": \"0\", \"tipoVariable\": \"F\", \"unidadMedida\": \"2352\", \"decimalesVisualiza\": \"2\"}"}},{"uniConcepto":2669,"estConcepto":116,"conNombre":"Granada GNV","conAlias":"G-GNV","conAbreviatura":"G-GNV","conTipcalculo":"F","conFormula":"[{\"tipo\":\"fun\",\"valor\":\"Granada GNV\",\"extra\":{\"funNombre\":\"Granada GNV\",\"funDescripcion\":\"Granada GNV\",\"funTipo\":\"N\",\"funIderegistro\":58,\"funParametro\":0,\"usuIderegistro\":288}}]","conOperacion":"I","conPreliquidar":"N","conAnticipo":"N","conFinanciable":"N","conInivigencia":1555971663104,"conEstado":"A","prgIderegistro":528,"conTipregistro":"N","conCondonable":"N","conValnulo":"S","usuIderegistro":288,"funIderegistro":7,"conSuspende":"N","conIntfinanciacion":"N","conMetajuste":"R","conPrecision":2,"conContabiliza":"N","uniUnidad":{"uniIderegistro":2669,"uniCodigo1":"G-GNV","uniNombre1":"Granada GNV","uniOrden":1,"uniNivel":1,"uniCodigo":"116G-GNV","usuIderegistro":288,"uniPropiedad":"{\"uniestado\": \"A\", \"frecuencia\": \"D\", \"descripcion\": \"Punto de consumo Granada GNV\", \"periodicidad\": \"0\", \"tipoVariable\": \"F\", \"unidadMedida\": \"2352\", \"decimalesVisualiza\": \"2\"}"}},{"uniConcepto":2694,"estConcepto":116,"conNombre":"Nominación Villavicencio Regulado","conAlias":"NOVIREG","conAbreviatura":"NOVIREG","conTipcalculo":"F","conFormula":"[{\"tipo\":\"fun\",\"valor\":\"Nominación Villavicencio Regulado\",\"extra\":{\"funNombre\":\"Nominación Villavicencio Regulado\",\"funDescripcion\":\"Nominación Villavicencio Regulado\",\"funTipo\":\"N\",\"funIderegistro\":59,\"funParametro\":0,\"usuIderegistro\":288}}]","conOperacion":"I","conPreliquidar":"N","conAnticipo":"N","conFinanciable":"N","conInivigencia":1557175833996,"conEstado":"A","prgIderegistro":546,"conTipregistro":"N","conCondonable":"N","conValnulo":"S","usuIderegistro":288,"funIderegistro":7,"conSuspende":"N","conIntfinanciacion":"N","conMetajuste":"R","conPrecision":2,"conContabiliza":"N","uniUnidad":{"uniIderegistro":2694,"uniCodigo1":"NOVIREG","uniNombre1":"Nominación Villavicencio Regulado","uniOrden":1,"uniNivel":1,"uniCodigo":"116NOVIREG","usuIderegistro":288,"uniPropiedad":"{\"frecuencia\": \"D\", \"descripcion\": \"Nominación Villavicencio Regulado\", \"periodicidad\": \"30\", \"tipoVariable\": \"F\", \"unidadMedida\": \"2352\", \"decimalesVisualiza\": \"2\"}"}},{"uniConcepto":2744,"estConcepto":116,"conNombre":"IndicePerdidaVillavicencio","conAlias":"InpVi","conAbreviatura":"IPV","conTipcalculo":"F","conFormula":"[{\"tipo\":\"fun\",\"valor\":\"IndPerdidaVillavicencio\",\"extra\":{\"funNombre\":\"IndPerdidaVillavicencio\",\"funDescripcion\":\" calcula los valores del punto ESPECIAL VILLAVICENCIO\",\"funTipo\":\"N\",\"funIderegistro\":64,\"funParametro\":0,\"usuIderegistro\":288}}]","conOperacion":"I","conPreliquidar":"N","conAnticipo":"N","conFinanciable":"N","conInivigencia":1558371537982,"conEstado":"A","prgIderegistro":574,"conTipregistro":"N","conCondonable":"N","conValnulo":"S","usuIderegistro":288,"funIderegistro":7,"conSuspende":"N","conIntfinanciacion":"N","conMetajuste":"R","conPrecision":3,"conContabiliza":"N","uniUnidad":{"uniIderegistro":2744,"uniCodigo1":"InpVi","uniNombre1":"IndicePerdidaVillavicencio","uniOrden":1,"uniNivel":1,"uniCodigo":"116InpVi","usuIderegistro":288,"uniPropiedad":"{\"frecuencia\": \"D\", \"descripcion\": \"indice perdida villavicencio\", \"periodicidad\": \"0\", \"tipoVariable\": \"F\", \"unidadMedida\": \"2352\", \"decimalesVisualiza\": \"3\"}"}},{"uniConcepto":2745,"estConcepto":116,"conNombre":"ErrorMaximoRegulado","conAlias":"ERRMXR","conAbreviatura":"ERM","conTipcalculo":"F","conFormula":"[{\"tipo\":\"fun\",\"valor\":\"Emax_Usr_Reg\",\"extra\":{\"funNombre\":\"Emax_Usr_Reg\",\"funDescripcion\":\" Error maximo permitido ussuarios regulados \",\"funTipo\":\"N\",\"funIderegistro\":67,\"funParametro\":0,\"usuIderegistro\":288}}]","conOperacion":"I","conPreliquidar":"N","conAnticipo":"N","conFinanciable":"N","conInivigencia":1558740182187,"conEstado":"A","prgIderegistro":574,"conTipregistro":"N","conCondonable":"N","conValnulo":"S","usuIderegistro":288,"funIderegistro":7,"conSuspende":"N","conIntfinanciacion":"N","conMetajuste":"R","conPrecision":2,"conContabiliza":"N","uniUnidad":{"uniIderegistro":2745,"uniCodigo1":"ERRMXR","uniNombre1":"ErrorMaximoRegulado","uniOrden":1,"uniNivel":1,"uniCodigo":"116ERRMXR","usuIderegistro":288,"uniPropiedad":"{\"frecuencia\": \"D\", \"descripcion\": \"Error maximo permitido ussuarios regulados\", \"periodicidad\": \"2\", \"tipoVariable\": \"F\", \"unidadMedida\": \"2549\", \"decimalesVisualiza\": \"2\"}"}},{"uniConcepto":2746,"estConcepto":116,"conNombre":"ErrorMaximoNoRegulado","conAlias":"ERRMN","conAbreviatura":"ENR","conTipcalculo":"F","conFormula":"[{\"tipo\":\"fun\",\"valor\":\"Emax_Usr_RegNR\",\"extra\":{\"funNombre\":\"Emax_Usr_RegNR\",\"funDescripcion\":\" error maximo permitido usuarios no regulados \",\"funTipo\":\"N\",\"funIderegistro\":69,\"funParametro\":0,\"usuIderegistro\":288}}]","conOperacion":"I","conPreliquidar":"N","conAnticipo":"N","conFinanciable":"N","conInivigencia":1558740367863,"conEstado":"A","prgIderegistro":574,"conTipregistro":"N","conCondonable":"N","conValnulo":"S","usuIderegistro":288,"funIderegistro":7,"conSuspende":"N","conIntfinanciacion":"N","conMetajuste":"R","conPrecision":2,"conContabiliza":"N","uniUnidad":{"uniIderegistro":2746,"uniCodigo1":"ERRMN","uniNombre1":"ErrorMaximoNoRegulado","uniOrden":1,"uniNivel":1,"uniCodigo":"116ERRMN","usuIderegistro":288,"uniPropiedad":"{\"frecuencia\": \"D\", \"descripcion\": \"error maximo permitido usuarios no regulados\\nmax_Usr_Reg = Raiz Cuadrada ( 0.9^2 + 2^2 \\tValor dado por la Resolucion \", \"periodicidad\": \"0\", \"tipoVariable\": \"F\", \"unidadMedida\": \"2549\", \"decimalesVisualiza\": \"2\"}"}}];

    return (
      <Contenedor>
        <h1>UN TITULO</h1>
        <Cargador visible={false} />
        <div className='container-fluid'>
          <div className='row'>
            <Botonera funciones={funciones} />
            <Input label='Usuario:' cols='12' id='txt1' placeholder='Test' className='has-error' />
            <Input label='Apellidos:' cols='6' placeholder='Apellido' required={true} extra={{ autoFocus: true }} />
            <TextArea label='Descripción:' />

            <Input
              type="number"
              label='Número con extra:'
              name='numero'
              value={this.state.numero}
              onChange={this.controlarCambio}
              extra={{ 'data-test': 1, 'data-test2': 2 }}
            />

            <Fecha
              label="Fecha Sin Día:"
              onChange={this.controlarCambio}
              name='fecha'
              fecha={this.state.fecha}
              sinDia={true}
            />

            <Fecha
              label="Fecha:"
              onChange={this.controlarCambio}
              name='fecha2'
              fecha={this.state.fecha2}
            />

            <Fecha
              label="Fecha:"
              onChange={this.controlarCambio}
              name='fecha3'
              fecha={this.state.fecha3}
              extra={{ disabled: true }}
            />

            <Combo
              opciones={opcionesComboCustom}
              propTexto='uniUnidad.uniNombre1'
              propValor='uniUnidad.uniCodigo'
              label='Ejemplo Combo con extra'
              cols={6}
              onChange={this.onComboChange}
              extra={{ 'aria-label': 'test', 'data-prueba': 123 }}
            />

            <Combo
              opciones={opcionesComboObjeto}
              propTexto='opcion.texto'
              propValor='id'
              label='Ejemplo Combo'
              name='combo1'
              cols={6}
              mostrarOpcionPorDefecto={false}
              onChange={this.onComboChange}
              size={6}
              extra={opcionesExtraCombo} />

            <Input label='Apellidos:' cols='6' placeholder='Apellido' />

            <Interruptor label="Acepta terminos" />

            <Boton
              texto='Ejemplo Boton'
              onClick={event => console.log(event)}
              cols={3}
              estilo='primary'
            />

          </div>

          <VentanaModal
            mostrar={this.state.mostrarModal}
            titulo={'Prueba de Modal'}
            cerrarModal={this.abrirCerrarModal}
          >
            <div>
              <h2>Contenido Modal</h2>
              <p>Test</p>
            </div>
          </VentanaModal>
        </div>

        <div>
          <Tabla datos={this.getDatos()} columnas={this.getColumnas()} />
        </div>

        <div>
          <Tab>
            <div label="pestaña 1"><h1>Hola mundo! 1</h1></div>
            <div label="pestaña 2"><h1>Hola mundo! 2</h1></div>
          </Tab>
        </div>

      </Contenedor>
    );
  }

}
