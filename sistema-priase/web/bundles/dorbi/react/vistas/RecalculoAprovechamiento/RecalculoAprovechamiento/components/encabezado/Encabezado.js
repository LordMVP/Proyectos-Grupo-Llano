import React, { useState, useEffect } from "react";
import {
  Input,
  Botonera,
  Combo,
  Boton,
  VentanaModal,
  Util,
  Fecha,
} from "appfuture-react";
import RUTAS_API from "../../../../../global/rutas_api";
import axios from "axios";
import { TablaHistorico, Tabs } from "./components";

const Encabezado = ({ mostrarAlerta }) => {
  const [listaAreaPrestacion, setListaAreaPrestacion] = useState([]);
  const [areaPrestacionSeleccionada, setAreaPrestacionSeleccionada] = useState(-1);
  const [listarAnio, setListarAnio] = useState([]);
  const [anioSeleccionado, setAnioSeleccionado] = useState(-1);
  const [listarPeriodo, setListarPeriodo] = useState([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(-1);
  const [taInicialNoExiste, setTaNoExiste] = useState(false);

  // Listado histórico recalculo
  const [listadoHistoricoRecalculo, setListadoHistoricoRecalculo] = useState([]);
  // Listado Concepto Recalculo Aprovechamiento
  const [conceptosRecalculo, setConceptosRecalculo] = useState(null);
  // Número de actualización del histórico a mostrar en tablas
  const [numeroActualizacion, setNumeroActualizacion] = useState(-1);

  // ListasGenerales
  const [allListPeriodo, setAllListPeriodo] = useState([]);
  // tablaMostrar
  const [mostrarTabla, setMostrarTabla] = useState(false);
  // Listas Valores Calculados - Recalculo Aprovechamiento
  const [listaRecalculoSinDinc, setListaRecalculoSinDinc] = useState([]);
  const [listaRecalculoConDinc, setListaRecalculoConDinc] = useState([]);
  // Lista % de participación
  const [listaParticipacion, setListaParticipacion] = useState([]);
  //promedios y porcentajes 1 y 2  
  const [listaParticipacionPromedios, setListaParticipacionPromedios] = useState([]);

  useEffect(() => {
    consultarAreaPrestacion();
    consultarConceptosRecalculo();
  }, []);

  const consultarAreaPrestacion = () => {
    axios
      .post(RUTAS_API.PARAMETRIZACION.AREAS_PRESTACION.FILTRO, { criterio: "" })
      .then((respuesta) => {
        setListaAreaPrestacion(respuesta.data.datos);
      });
  };

  const consultarConceptosRecalculo = () => {
    axios.post(RUTAS_API.RECALCULO_APROVECHAMIENTO.OBTENER_CONCEPTOS_RECALCULO)
      .then((respuesta) => {
        setConceptosRecalculo(respuesta.data.datos);
      });

  }

  const validarPrimerTA = (idPeriodo) => {
    axios.post(RUTAS_API.RECALCULO_APROVECHAMIENTO.VERIFICAR_TA_INICIAL, { idPeriodo: idPeriodo })
      .then(respuesta => {
        console.log("OK :: ", respuesta.data.datos);
        setTaNoExiste(respuesta.data.datos == null)
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
      { texto: "Recalculo", callback: guardar },
      { texto: "Cancelar", callback: limpiarFormulario },
    ];
  };



  const calcularTaInicial = (e) => {
    e.preventDefault();
    if (taInicialNoExiste) {
      mostrarAlerta("Error", "El TA inicial para el periodo seleccionado, ya existe");
    } else {
      const peticion = {
        idPeriodo: periodoSeleccionado,
        idPeriodoPadre: listarPeriodo.find(item => item.idRegistroMes == periodoSeleccionado).idPeriodoPadre,
      };
      axios.post(RUTAS_API.RECALCULO_APROVECHAMIENTO.CALCULAR_TA_INICIAL, peticion)
        .then(respuesta => {
          console.log('CALCULAR_TA_INICIAL :: ', respuesta.data.datos);
          if (respuesta.data.datos) {
            mostrarAlerta("Éxito", "Se ha generado el TA inicial para el periodo");
            validarPrimerTA(periodoSeleccionado);
          };
        });
      setTaNoExiste(false);
    }
  };


  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  const guardar = (e) => {
    e.preventDefault();
    const peticion = {
      idArea: areaPrestacionSeleccionada,
      idPeriodo: periodoSeleccionado,
      idPeriodoPadre: listarPeriodo.find(item => item.idRegistroMes == periodoSeleccionado).idPeriodoPadre,
    };


    axios.post(RUTAS_API.RECALCULO_APROVECHAMIENTO.RECALCULAR, peticion)
      .then(respuesta => {
        console.log('Recalcular :: ', respuesta.data.datos);
        if (respuesta.data.datos) {
          mostrarAlerta("Éxito", "Se ha recalculado correctamente");
          setListadoHistoricoRecalculo([]);
          consultaListadoHistoricoRecalculo(periodoSeleccionado);
        } else {
          mostrarAlerta("Error", "No existen datos suficientes para recalcular");
        };
      });
  };

  /**
   * Método encargado de limpiar los campos del formulario
   */
  const limpiarFormulario = () => {
    setAreaPrestacionSeleccionada(-1);
    setAnioSeleccionado(-1);
    setPeriodoSeleccionado(-1);
    setMostrarTabla(false);
    setNumeroActualizacion(-1);
    setTaNoExiste(false);
  };

  const controlarCambio = (evento) => {
    let change = {};
    const { name, value } = evento.target;
    setMostrarTabla(false);
    setNumeroActualizacion(-1);
    setListadoHistoricoRecalculo([]);
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
        if (value != '-1') {
           //cargarPorcentajesParticipacion(value);
        }
        break;
      case 'periodo':
        setPeriodoSeleccionado(value);
        if (value != -1) {
          validarPrimerTA(value);
          consultaListadoHistoricoRecalculo(value);
        };
        break;
      default:
        break;
    }
  };

  const consultaListadoHistoricoRecalculo = (idPeriodo) => {
    axios.post(RUTAS_API.RECALCULO_APROVECHAMIENTO.OBTENER_HISTORICO_RECALCULO, { idPeriodo: idPeriodo })
      .then(respuesta => {
        if (respuesta.data.datos != null) {
          setListadoHistoricoRecalculo(respuesta.data.datos);
        }
      });

  };

  const cargarPeriodo = (value) => {
    const filterPeriodo = allListPeriodo.filter(x => x.idPeriodoPadre === +value);
    setListarPeriodo(filterPeriodo);
  };

  const consultarConceptosRecalculados = (numeroActualizacion) => {
    setNumeroActualizacion(numeroActualizacion);
    setListaRecalculoSinDinc([]);
    setListaRecalculoConDinc([]);
    setMostrarTabla(false);
    if (numeroActualizacion != '-1') {
      axios.post(RUTAS_API.RECALCULO_APROVECHAMIENTO.OBTENER_VALORES_RECALCULO,
        {
          idPeriodo: periodoSeleccionado,
          numeroActualizacion: numeroActualizacion
        })
        .then(respuesta => {
          if (respuesta.data.datos != null) {
            console.log("RESPUESTA :: ", respuesta.data.datos);
            const listaSinDinc = [], listaConDinc = [];
            respuesta.data.datos.map(item => {
              item.conDinc ? listaConDinc.push(item) : listaSinDinc.push(item);
            });
            setListaRecalculoSinDinc(listaSinDinc);
            setListaRecalculoConDinc(listaConDinc);
            setMostrarTabla(true);
          }
        });
      cargarPorcentajesParticipacion(periodoSeleccionado, numeroActualizacion);
    }
  };

  const cargarPorcentajesParticipacion = (idPeriodo, numeroActualizacion) => {
    setListaParticipacion([]);
    setListaParticipacionPromedios([]);
    const parametros = {
      idPeriodo: idPeriodo,
      numeroActualizacion: numeroActualizacion
    }
    const peticiones = [
      axios.post(RUTAS_API.RECALCULO_APROVECHAMIENTO.OBTENER_PORCENTAJES_RECALCULADOS, parametros),
      axios.post(RUTAS_API.RECALCULO_APROVECHAMIENTO.OBTENER_PORCENTAJES_UNO_DOS, parametros),
    ];
    axios.all(peticiones)
      .then(axios.spread((listaVar, listaPorcen) => {
        if (listaVar.data.datos != null) {
          setListaParticipacion(listaVar.data.datos)
        }
        if (listaPorcen.data.codigo > 0) {
          setListaParticipacionPromedios(listaPorcen.data.datos)
        }
      }));
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
        periodoSeleccionado != '-1' && conceptosRecalculo && listadoHistoricoRecalculo.length > 0 &&
        <TablaHistorico setNumeroActualizacion={consultarConceptosRecalculados}
          listadoHistoricoRecalculo={listadoHistoricoRecalculo} />
      }
      {
        mostrarTabla && conceptosRecalculo && listadoHistoricoRecalculo.length > 0 &&
        <Tabs listadoHistoricoRecalculo={listadoHistoricoRecalculo}
          listaRecalculoSinDinc={listaRecalculoSinDinc}
          listaRecalculoConDinc={listaRecalculoConDinc}
          listaParticipacion={listaParticipacion}
          listaPorcentajesPromedios={listaParticipacionPromedios}
          numeroActualizacion={numeroActualizacion} />
      }
    </div>
  );
};

export default Encabezado;
