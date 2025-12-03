import React, { useState, useEffect } from "react";
import {
  Botonera,
  Combo,
} from "appfuture-react";
import RUTAS_API from "../../../../../global/rutas_api";
import axios from "axios";
import { TablaHistorico, TabsTablasTA, TabsDevolucionAjustes } from "./components";
import { toast } from 'react-toastify';
import moment from 'moment';

const Encabezado = ({ mostrarAlerta }) => {
  const [listaAreaPrestacion, setListaAreaPrestacion] = useState([]);
  const [areaPrestacionSeleccionada, setAreaPrestacionSeleccionada] = useState(-1);
  const [listarAnio, setListarAnio] = useState([]);
  const [anioSeleccionado, setAnioSeleccionado] = useState(-1);
  const [listarPeriodo, setListarPeriodo] = useState([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(-1);
  const [numeroActualizacionSeleccionado, setNumeroActualizacionSeleccionado] = useState(-1);

  // ListasGenerales
  const [allListPeriodo, setAllListPeriodo] = useState([]);
  const [dataTablaHistorico, setDataTablaHistorico] = useState([]);
  const [dataTablaCalculos, setTablaCalculos] = useState([]);
  // tablaMostrar
  const [mostrarTabla, setMostrarTabla] = useState(false);

  useEffect(() => {
    consultarAreaPrestacion();
  }, [
    numeroActualizacionSeleccionado
  ]);

  const consultarAreaPrestacion = () => {
    axios
      .post(RUTAS_API.PARAMETRIZACION.AREAS_PRESTACION.FILTRO, { criterio: "" })
      .then((respuesta) => {
        setListaAreaPrestacion(respuesta.data.datos);
      });
  };

  /**
   * Método encargado de consultar los periodos semestrales por área de prestación.
   * @param {Number} idArea Identificador del área de prestación.
   */
  const consultarAnioDePeriodo = (idArea) => {
    axios
      .post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS.CONSULTAR_MESES_PERIODO, {
        idArea: idArea,
      })
      .then((respuesta) => {
        console.log(respuesta.data.datos);
        // sortAnioPeriodo(respuesta.data.datos);
        const { listaAnio, listaPeriodo } = sortAnioPeriodo(respuesta.data.datos);
        listaPeriodo.sort((a, b) => (a.numeroMes > b.numeroMes) ? 1 : -1);
        setListarAnio(listaAnio);
        // setListarPeriodo(listaPeriodo);

        setAllListPeriodo(listaPeriodo);
      });
  };

  const sortAnioPeriodo = (periodos) => {
    let listaPeriodo = [], listaAnio = [];
    periodos.map((dato) => {
      listaPeriodo.push({
        idRegistroMes: dato.perIdeRegistro,
        titulo: `${dato.smperDescripcion}`,
        anio: dato.perFecInicial,
        idPeriodoPadre: dato.perIdEPadre,
        numeroMes: dato.smperNumero,
      });

      listaAnio.push({
        titulo: `${dato.perFecInicial} - ${dato.nombrePeriodo}`,
        perIderegistro: dato.perIdEPadre,
      });
    });
    listaAnio = [...new Map(listaAnio.map(item => [item["perIderegistro"], item])).values()];
    console.log(listaPeriodo);
    return { listaPeriodo, listaAnio }
  };

  /**
   * Método encargado de generar los botones del formulario
   * @returns {Object}
   */
  const obtenerFunciones = () => {
    return [
      { texto: "Recalculo", callback: recalculo },
      { texto: "Cancelar", callback: limpiarFormulario },
    ];
  };


  /**
   * Método encargado de recalculo los datos de la entidad
   * @returns {bool}
   */
  const recalculo = (e) => {
    e.preventDefault();
    console.log('Recalculando');
    if (areaPrestacionSeleccionada > 0 && anioSeleccionado > 0 && periodoSeleccionado > 0) {
      if (dataTablaHistorico.find(x=> x.estado === 'P')) {
        mostrarToast('Error, Debe aprobar o denegar el recalculo previo!');
      } else {
        const data = {
          idArea: areaPrestacionSeleccionada,
          idPeriodo: periodoSeleccionado,
          idPeriodoPadre: anioSeleccionado
        }
        axios.post(RUTAS_API.RECALCULO_VARIABLE.DEVOLUCIONES_RECALCULAR, data).then((respuesta) => {   
          setDataTablaHistorico([]);          
          historicoRecalculo(periodoSeleccionado);
          setTablaCalculos([]);
          setMostrarTabla(false);
        });
      }
    } else {
      mostrarToast('Error, Faltan campos por diligenciar!');
    }
  };

  const historicoRecalculo = (periodo) => {
    axios.post(RUTAS_API.RECALCULO_VARIABLE.HISTORICO_DEVOLUCIONES, { idPeriodo: periodo })
    .then(respuesta => {
        if (respuesta.data.datos != null) {                   
            setDataTablaHistorico(mapDatos(respuesta.data.datos));
        }
    });
  };

  const mapDatos = (datos) => {
    let dataTable = [];
    let index = 0;
    datos.forEach(element => {
        dataTable.push({
          index: index++,
          nroRecalculo: element.numeroActualizacion,
          fechaCertificacion: element.vrtaFeccertificacion ? moment(element.vrtaFeccertificacion).format('YYYY-MM-DD') : '.',
          estado: element.estado,
          observacion: element.vrtaObservacion,
          detalle: arrayLink(element.estado)
        });
    });

    return dataTable;
  };

  const funcionVer = (e) => {
    e.preventDefault();
    
    setTablaCalculos([]);
    setMostrarTabla(false);
    setTimeout(() => {
      let nroRecalculo = sessionStorage.getItem('nroRecalculo');
      let idPeriodo = sessionStorage.getItem('idPeriodo');
      if (nroRecalculo && idPeriodo) {
        const data = {
          idArea: areaPrestacionSeleccionada,
          idPeriodo: idPeriodo,
          numeroActualizacion: nroRecalculo
        };

        axios.post(RUTAS_API.RECALCULO_VARIABLE.OBTENER_CONCEPTOS_CALCULADOS, data).then((respuesta) => {
          if (respuesta.data.datos != null) {
            setTablaCalculos(respuesta.data.datos);
            setMostrarTabla(true);
          };
        });
      }
    }, 1000);
  };

  const procesarRecalculo = (accion) => {
    console.log(accion);
    let idPeriodo = sessionStorage.getItem('idPeriodo');
    setPeriodoSeleccionado(idPeriodo);
    if (areaPrestacionSeleccionada > 0 && anioSeleccionado > 0 && idPeriodo > 0) {
      let nroRecalculo = sessionStorage.getItem('nroRecalculo');
      
      const data = {
        accion: accion,
        idArea: areaPrestacionSeleccionada,
        idPeriodo: idPeriodo,
        idPeriodoPadre: anioSeleccionado,
        numeroActualizacion: nroRecalculo
      }
      axios.post(RUTAS_API.RECALCULO_VARIABLE.ACTUALIZAR_HISTORICO_DEVOLUCION, data).then((respuesta) => {   
        setDataTablaHistorico([]);          
        historicoRecalculo(idPeriodo);
      });
    } else {
      mostrarToast('Error, Faltan campos por diligenciar!');
    }
  }

  /**
   * Metodo para mostrar una alerta
   */
  const mostrarToast = (mensaje) => {
    const opciones = {
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    };

    toast.error(mensaje, opciones);
  };

  const verLink = () => (<button onClick={funcionVer} className="btn btn-link" style={{ padding: '0 6px' }}>Ver</button>); 
  const aprobarLink =  () => (<button onClick={() => procesarRecalculo('A')} className="btn btn-link" style={{ padding: '0 6px' }}>Aprobar</button>); 
  const denegarLink =  () => (<button onClick={() => procesarRecalculo('D')} className="btn btn-link" style={{ padding: '0 6px' }}>Denegar</button>); 

  const arrayLink = (estado) => {
  return ( <React.Fragment>
            {verLink()}
            { estado == 'P' && aprobarLink() }
            { estado == 'P' && denegarLink() }
          </React.Fragment>);
  };

  /**
   * Método encargado de limpiar los campos del formulario
   */
  const limpiarFormulario = () => {
    setAreaPrestacionSeleccionada(-1);
    setAnioSeleccionado(-1);
    setPeriodoSeleccionado(-1);
    setMostrarTabla(false);
  };

  const controlarCambio = (evento) => {
    let change = {};
    const { name, value } = evento.target;
    setMostrarTabla(false);
    setDataTablaHistorico([]);  
    switch (name) {
      case 'areaPrestacion':
        setPeriodoSeleccionado(-1);
        setAnioSeleccionado(-1);
        setListarAnio([]);
        setListarPeriodo([]);
        setAreaPrestacionSeleccionada(value);
        if (value != '-1') {
          consultarAnioDePeriodo(value);
        }
        break;
      case 'anio':
        setPeriodoSeleccionado(-1);
        setAnioSeleccionado(value);
        cargarPeriodo(value);
        break;
      case 'periodo':
        setPeriodoSeleccionado(value);
        historicoRecalculo(value);
        
        break;
      default:
        break;
    }
  };

  const cargarPeriodo = (value) => {
    const filterPeriodo = allListPeriodo.filter(x => x.idPeriodoPadre === +value);
    setListarPeriodo(filterPeriodo);
  };

  return (
    <div>
      <Botonera funciones={obtenerFunciones()} />
      <div className="conf-general row mt-5">
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
          opciones={listarAnio}
          key="perIderegistro"
          propTexto="titulo"
          propValor="perIderegistro"
          label="Año:"
          name="anio"
          value={anioSeleccionado}
          onChange={(e) => controlarCambio(e)}
        />
        <Combo
          opciones={listarPeriodo}
          key='idRegistroMes'
          propTexto='titulo'
          propValor='idRegistroMes'
          label="Periodo:"
          name="periodo"
          value={periodoSeleccionado}
          onChange={(e) => controlarCambio(e)}
        />
      </div>
      {
        dataTablaHistorico.length > 0 &&
        <TablaHistorico setMostrarTabla={setMostrarTabla} periodoSeleccionado={periodoSeleccionado} setPeriodoSeleccionado={setPeriodoSeleccionado} dataTablaHistorico={dataTablaHistorico} setNumeroActualizacionSeleccionado={setNumeroActualizacionSeleccionado} numeroActualizacionSeleccionado={numeroActualizacionSeleccionado} />
      }
      {

        dataTablaCalculos.length > 0 && mostrarTabla &&
        <TabsTablasTA dataTablaCalculos={dataTablaCalculos} />
      }
      {

        dataTablaCalculos.length > 0 && mostrarTabla &&
        <TabsDevolucionAjustes dataTablaCalculos={dataTablaCalculos} />
      }
    </div>
  );
};

export default Encabezado;
