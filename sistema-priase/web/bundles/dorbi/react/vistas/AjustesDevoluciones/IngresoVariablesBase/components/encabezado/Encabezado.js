import React, { useState, useEffect } from "react";
import {
  Input,
  Botonera,
  Combo,
  Boton,
  VentanaModal,
  Util,
  Fecha,
} from 'appfuture-react';
import RUTAS_API from '../../../../../global/rutas_api';
import axios from 'axios';

import ContainerConceptosConstantes from '../containerConceptosConstantes/ContainerConceptosConstantes';
import ContainerConceptosVariables from '../containerConceptosVariables/ContainerConceptosVariables';
import Modal from 'react-bootstrap4-modal'

// import { TablaHistorico, TabsTablasTA, TabsDevolucionAjustes } from './components';

const Encabezado = ({ mostrarAlerta }) => {
  const [listaAreaPrestacion, setListaAreaPrestacion] = useState([]);
  const [areaPrestacionSeleccionada, setAreaPrestacionSeleccionada] = useState(-1);
  const [tipoConcepto, setTipoConcepto] = useState(-1);
  const [listaTipoConceptos, setListaTipoConceptos] = useState([]);
  const [valorNombreConcepto, setValorNombreConcepto] = useState('');
  const [conceptoSelected2, setConceptoSelected2] = useState([]);
  const [valorConcepto, setValorConcepto] = useState('');
  const [periodoSelected, setPeriodoSelected] = useState('');
  const [ideConcepto, setIdeConcepto] = useState('');
  const [valorObservacion, setValorObservacion] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [uniLiquidacion, setUniLiquidacion] = useState(-1);


  useEffect(() => {
    consultarAreaPrestacion();
  }, []);

  const consultarAreaPrestacion = () => {
    axios
      .post(RUTAS_API.PARAMETRIZACION.AREAS_PRESTACION.FILTRO, { criterio: "" })
      .then((respuesta) => {
        setListaAreaPrestacion(respuesta.data.datos);
      });
  };

  const obtenerListaTiposConceptos = () => {
    return [
      { idConcepto: 'N', nombreConcepto: 'Constante' },
      { idConcepto: 'B', nombreConcepto: 'Base' }
    ];
  }

  /**
  * Método encargado de generar los botones del formulario
  * @returns {Object}
  */
  const obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: recalculo },
      { texto: 'Cancelar', callback: limpiarFormulario },
    ];
  };

  /**
* Método encargado de generar los botones del modal
* @returns {Object}
*/
  const obtenerFuncionesModal = () => {
    return [
      { texto: 'Aceptar', callback: confirmarRecalculo },
      { texto: 'Cancelar', callback: cerrarModal },
    ];
  };

  const cerrarModal = () => {
    setMostrar(false);
  }

  /**
  * Método encargado de recalculo los datos de la entidad
  * @returns {bool}
  */
  const recalculo = (e) => {
    e.preventDefault();
    if (valorNombreConcepto && valorConcepto > 0) {
      setMostrar(true);
      setTitulo('pregunta');
      setTexto(` Desea modificar el valor del concepto ${valorNombreConcepto}?`);
    } else {
      mostrarAlerta('Advertencia', 'Faltan datos por seleccionar');
    }
  };

  /**
  * Método encargado de recalculo los datos de la entidad
  * @returns {bool}
  */
   const confirmarRecalculo = (e) => {
    e.preventDefault();
    if (valorNombreConcepto && valorConcepto > 0) {
      setTipoConcepto(-1);
      if (tipoConcepto === 'N') {
        axios
          .post(RUTAS_API.RECALCULO_VARIABLE.ACTUALIZAR_CONCEPTOS_CONSTANTES, { idConcepto: conceptoSelected2.id, valor: valorConcepto })
          .then((respuesta) => {
            console.log(respuesta);
            setMostrar(false);
            setTipoConcepto('N');
          });
      }
      if (tipoConcepto === 'B') {
        const data = {
          idConcepto: ideConcepto,
          idPeriodo: periodoSelected,
          raco_ideregistr: conceptoSelected2.idRaco,
          valor: valorConcepto
        };
        axios
          .post(RUTAS_API.RECALCULO_VARIABLE.ACTUALIZAR_CONCEPTOS_BASE, data)
          .then((respuesta) => {
            console.log(respuesta);
            setMostrar(false);
            setTipoConcepto('B');
          });
      }
    } else {
      mostrarAlerta('Advertencia', 'Faltan datos por seleccionar');
    }
  };

  /**
  * Método encargado de limpiar los campos del formulario
  */
  const limpiarFormulario = () => {

  };

  /**
  * Método encargado de limpiar los campos del formulario
  */
  const capturarLiquidacion = (idAreaSeleccionada) => {
    const dataFilter = listaAreaPrestacion.find(x => x.arprIderegistro == idAreaSeleccionada);

    dataFilter && dataFilter.liqIderegistro ? setUniLiquidacion(dataFilter.liqIderegistro.uniLiquidacion) : null;
  };

  const botonAlerta = () => { return <button>Hola</button> }

  const controlarCambio = (evento) => {
    let change = {};
    const { name, value } = evento.target;
    switch (name) {
      case 'areaPrestacion':
        setTipoConcepto(-1);
        setUniLiquidacion(-1);
        setListaTipoConceptos([]);
        setAreaPrestacionSeleccionada(value);
        if (value !== '-1') {
          setListaTipoConceptos(obtenerListaTiposConceptos())
          capturarLiquidacion(value)
        }

        break;
      case 'tipoConcepto':
        console.log("tipo conc :: ", tipoConcepto);
        setTipoConcepto(value);
        // setPeriodoSeleccionado(-1);
        // setAnioSeleccionado(value);
        // cargarPeriodo(value);
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <Botonera funciones={obtenerFunciones()} />
      <div className="conf-general row mt-5 justify-content-center">
        <Combo
          opciones={listaAreaPrestacion}
          key="arprIderegistro"
          propTexto="arprNombre"
          propValor="arprIderegistro"
          label="Área prestación:"
          name="areaPrestacion"
          value={areaPrestacionSeleccionada}
          onChange={(e) => controlarCambio(e)}
        />
        <Combo
          opciones={listaTipoConceptos}
          key="idConcepto"
          propTexto="nombreConcepto"
          propValor="idConcepto"
          label="Tipo de Concepto:"
          name="tipoConcepto"
          value={tipoConcepto}
          onChange={(e) => controlarCambio(e)}
        />
      </div>
      <br />
      {
        tipoConcepto === 'N' && <ContainerConceptosConstantes valorConcepto={valorConcepto} setValorConcepto={setValorConcepto} setValorNombreConcepto={setValorNombreConcepto} conceptoSelected2={conceptoSelected2} setConceptoSelected2= {setConceptoSelected2} />
      }
      {
        tipoConcepto === 'B' && <ContainerConceptosVariables
          areaPrestacion={areaPrestacionSeleccionada}
          uniLiquidacion={uniLiquidacion}
          valorConcepto={valorConcepto}
          valorObservacion={valorObservacion}
          setValorConcepto={setValorConcepto}
          setValorNombreConcepto={setValorNombreConcepto}
          setValorObservacion={setValorObservacion}
          conceptoSelected2={conceptoSelected2}
          setConceptoSelected2= {setConceptoSelected2}
          setPeriodoSelected={setPeriodoSelected}
          setIdeConcepto={setIdeConcepto} />
      }
      {
        <Modal visible={mostrar}>
          <div className="modal-header">
            <h4 className="modal-title">
              <b>{titulo}</b>
            </h4>
          </div>
          <div className="modal-body">
            <div>{texto}</div>
          </div>
          <div className="modal-footer">
            <Botonera funciones={obtenerFuncionesModal()} />
          </div>
        </Modal>
      }
    </div>
  );
};

export default Encabezado;
