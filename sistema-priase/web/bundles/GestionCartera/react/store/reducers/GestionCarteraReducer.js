import orientacionServicio from '../servicios/OrientacionServicios'
import { mostrarAlerta } from '../../store/actions/AplicacionAcciones';
import { MODULO, ACCION } from '../../store/actions/TiposAcciones';

const initialState = {
  data: [],
  dataDetalle: [],
  dataConcepto: [],
  dataGV: [],
  dataRecursos: [],
  dataDetalleLCRE: [],
  dataDetalleLCGV: [],
  itemSeleccionado: {},
  formEdicion: {},
  formEdicionMG: {},
  formEdicionInfoBasicaMG: {},
  formEdicionInfoGestionMG: {},
  formEdicionInfoGestionVisitaMG: {},
  formEdicionAsigDistribucionMG: {},
  formEdicionIG: {},
  formEdicionFooterMG: {},
  formEdicionGVisita: {},
  formEdicionGVRecursos: {},
  formEdicionLC: {},
  formEdicionDN: {},
  formEdicionEK: {},
  origenComponente: "",
  condicion: "",
  showFormEdicion: false,
  showButtonGuardar: true,
  listaEstados: [],
  listaVariablesGlobales: [],
  listaCondicionales: [],
  listaUnidadControlEstaCartera: [],
  listaUnidadClasificacion: [],
  listaUsuarios: [],
  listaProgramasUnidad: [],
  listaUnidadTipoRecurso: [],
  listaUnidadControlMetasGestion: [],
  listaUnidadConceptoMetas: [],
  listaFuncionBaseMeta: [],
  listaFuncionMeta: [],
  listaFuncionBaseComision: [],
  listaFuncionComision: [],
  clasificaciones:[],
  listaPeriodos: [],
  listaPeriodosFiltrados: [],
  clasificaciones: [],
  listaEtapasGestion: [],
  listaTiposEjecutivos: [],
  listaTablaComisional:[],
  listaMetaGestion:[],
  listaEjecutivos:[],
  listaComunas:[],
  listaUnidadTipoDato:[],
  listaUnidadAtributoMaestro:[],
  listaUnidadCalculoGestion:[],
  listaUnidadMetodoBackend:[],
  listaUnidadProcedimientoGestion:[],
  listaUnidadMetodoCarga:[],
  listaFuncionOrigen:[],
  listaFuncionOrigenFiltrados:[],
  showModal: false,
  isShowConstante: false,
  isShowAtributo: false,
  isShowCalculado: false,
  listaFiltros:[],
  listaUnidadTipoUso:[],
  listaUnidadEstadoSuscripcion:[],
  listaUnidadTipoUbicacion:[],
  listaDepartamento:[],
  listaUnidadEstadoGestionCartera:[],
  listaClasificacion:[],
  listaOrientacion:[],
  listaEdadCartera:[],
  listaEstrategia:[],
  listaEjecutivo:[],
  listaNovedadVisita:[],
  listaUnidadExportar:[],
  listaUnidadTipoCarta:[],
  listaUnidadEstrato: [],
  listaUnidadClaseHomolagada: [],
  listaPeriodoIG: [], 
  listaCicloIG: [],
  showButtonsIG: false,
  showMensajeLoader: false,
  showResultadosIG: false,
  showFormIG:true,
  cantidadProcesos: 0,
  showButtonsLC: false,
  listaPeriodoLC: [], 
  listaCicloLC: [],
  listaEjecutivosLC: [],
  showDetalleMG:false,
  showModalConceptoMG:false,
  seleccionadosMG: [],
  contarAsignadosMG: [],
  contarEstadoRegConfirmMG: [],
  showMaestroGestion:true,
  showGestionVisitas:false,
  htmlString:null,
  htmlInput:null,
  showListaGVisita:false,
  showFormConsultaGVista:false,
  showFormGVista:true,
  showListaResultLC:true,
  existResultLC:false,
  diasHolguraGestionVisita:0,
  seleccionadosLC: [],
  seleccionadosEjelistLC: [],
  showModalAbonoLC:false,
  showButtonIniciaGestion:false,
  showButtonConfirmaIG:false,
  showButtonDescartarIG:false,
  showButtonLiquidarLC:false,
  showButtonRecalcularLC:false,
  showButtonExportarLC:false,
  showButtonCerraPeriodoLC:false,
  showButtonEditarAbonoLC:false,
  showButtonsAsinacionMG:false,
  //showButtonsLiquidacion:false,
  showModalMSN:false,
  showButtonGuardarR:true,
  showButtonsLCom: false,
  showMensajeLoaderLCom: false,
  showResultadosLCom: false,
  showFormLCom:true,
  showResultadosDN: false,
  showFormDN:true,
  showButtonsDN: false, //TODO iniciarlo en false
  showButtonIniciaDN:false, //TODO iniciarlo en false
  showButtonConfirmaDN:false, //TODO iniciarlo en false
  showButtonDescartarDN:false, //TODO iniciarlo en false
  showModalConceptoDN:false,
  dataConsultaDN: [],
  listaPeriodoDN: [], 
  listaCicloDN: [],
  dataResumenDN: [],
  dataConceptoDN: [],
  seleccionadosEK: [],
  listaPeriodoEK: [], 
  listaCicloEK: [],
  id_periodoInicioDN: 0,
  dataReportesDN: [],
  //consolidación metas
  showButtonConsolidarMeta:false, //iniciarlo en false
  showButtonRecalcularMeta:false, //iniciarlo en false
  showButtonConfirmaMeta:false, //iniciarlo en false
  showButtonCerraPeriodoMeta:false, //iniciarlo en false
  showButtonsMeta: false, //iniciarlo en false
  showMensajeLoaderMeta: false, //iniciarlo en false
  showResultadosMeta: false, //iniciarlo en false
  showFormMeta:true,
  showListaResultMeta:true,
  existResultMeta:false,//INICIARLO EN FALSE
  formEdicionCM: {},
  formEdicionCCM: {},
  listaPeriodoMetas: [], 
  listaEjecutivosMetas: [],
  dataDetalleCMRE: [],
  dataDetalleCMGV: [],
  listaEjecutivosMH: [],
  listaPeriodoMHDesde: [],
  listaPeriodoMHHasta: [], 
  listaMetasHistorico: [], 
}

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case ACCION.SET_SHOW_CONSTANTE:
      console.log(action)
      return {
        ...state,
        isShowConstante: action.payload,
      };

    case ACCION.SET_SHOW_ATRIBUTO:
      console.log(action)
      return {
        ...state,
        isShowAtributo: action.payload,
      };

    case ACCION.SET_SHOW_CALCULADO:
      console.log(action)
      return {
        ...state,
        isShowCalculado: action.payload,
      };

    case ACCION.SET_ORIGEN_COMPONENTE:
      console.log(action)
      return {
        ...state,
        origenComponente: action.payload,
      };

    case ACCION.CARGAR_DATA:
      console.log(action)
      return {
        ...state,
        data: action.payload,
      };

    case ACCION.SELECCIONAR_ITEM:
      console.log(action)
      return {
        ...state,
        formEdicion: action.payload,
      };

    case ACCION.LIMPIAR_CONDICION:
      console.log(action)
      return {
        ...state,
        condicion: action.payload,
      };

    case ACCION.SET_HTML_CONDICION:
      
      console.log(action)
      return {
        ...state,
        htmlInput: action.payload,
    };
    case ACCION.NUEVO_ITEM:
      console.log(action)
      return {
        ...state,
        formEdicion: action.payload,
      };

    case ACCION.SET_FORM_EDICION:
      console.log(action)
      return {
        ...state,
        condicion: action.payload,
        showFormEdicion: !state.showFormEdicion,
      };
    
    case ACCION.SET_BUTTON_GUARDAR:
      console.log(action)
      return {
        ...state,
        showButtonGuardar: action.payload,
      };

    case ACCION.SET_DATA_DETALLE:
      console.log(action)
      return {
        ...state,
        dataDetalle: action.payload,
      };

    case ACCION.SET_FORM_CONDICION:
      console.log(action)
      return {
        ...state,
        condicion: action.payload,
      };

    case ACCION.SET_FORM_ASIGNACION:
      console.log(action)
      return {
        ...state,
        clasificaciones: action.payload,
      };

    case ACCION.SET_DATA_PERIODO:
      console.log(action)
      return {
        ...state,
        listaPeriodosFiltrados : state.listaPeriodos.filter(item => item.uni_ideregistro == action.payload)
      };

      case ACCION.SET_DATA_ORIGEN:
      console.log(action)
      return {
        ...state,
        listaFuncionOrigenFiltrados : state.listaFuncionOrigen.filter(item => item.funtipo == action.payload)
      };

      case ACCION.SET_FORM_EDICION_MAESTRO_GESTION:
      console.log(action)
      return {
        ...state,
        condicion: action.payload
      };

      case ACCION.SET_LIMPIAR_FORMMG:
        console.log(action)
        return {
          ...state,
          formEdicionMG: {},
          formEdicionInfoBasicaMG: { "isAltoRiesgo":"-3"},
          formEdicionInfoGestionMG: { "isCobroJuridico":"-4","isFinanciado":"-5"},
          formEdicionInfoGestionVisitaMG: {}
        };

      case ACCION.SELECCIONAR_ITEM_MG:
      console.log(action)
      return {
        ...state,
        formEdicionMG: action.payload,
      };

      case ACCION.SELECCIONAR_ITEM_IBMG:
      console.log(action)
      return {
        ...state,
        formEdicionInfoBasicaMG: action.payload,
      };

      case ACCION.SELECCIONAR_ITEM_IGMG:
      console.log(action)
      return {
        ...state,
        formEdicionInfoGestionMG: action.payload,
      };

      case ACCION.SELECCIONAR_ITEM_IGVMG:
      console.log(action)
      return {
        ...state,
        formEdicionInfoGestionVisitaMG: action.payload,
      };

      case ACCION.SELECCIONAR_ITEM_IADMG:
        console.log(action)
        return {
          ...state,
          formEdicionAsigDistribucionMG: action.payload,
        };

        case ACCION.SELECCIONAR_ITEM_FOOTERMG:
          console.log(action)
          return {
            ...state,
            formEdicionFooterMG: action.payload,
          };  
      
    case ACCION.SELECCIONAR_ITEM_FILTROSMG:
      console.log(action)
      return {
        ...state,
        formEdicionMG: action.payload.filtro,
        formEdicionInfoBasicaMG: action.payload.informacionBasica,
        formEdicionInfoGestionMG: action.payload.informacionGestion,
        formEdicionInfoGestionVisitaMG: action.payload.informacionGestionVisita,
      };

    case ACCION.LISTAR_ITEMMG:
      console.log(action)
      var data = [];
      state.listaUnidadTipoUso = action.payload.maestroGestion.listUnidadTipoUso;
      state.listaUnidadEstadoSuscripcion = action.payload.maestroGestion.listUnidadEstadoSuscripcion;
      state.listaUnidadTipoUbicacion = action.payload.maestroGestion.listUnidadTipoUbicacion;
      state.listaDepartamento = action.payload.maestroGestion.listDepartamento;
      state.listaComunas = action.payload.maestroGestion.sectores; 
      state.listaUnidadEstadoGestionCartera = action.payload.maestroGestion.listUnidadEstadoGestionCartera;
      state.listaClasificacion = action.payload.maestroGestion.listClasificacion;
      state.listaOrientacion = action.payload.maestroGestion.listOrientacion;
      state.listaEdadCartera = action.payload.maestroGestion.listEdadCartera;
      state.listaEstrategia = action.payload.maestroGestion.listEstrategia;
      state.listaEjecutivo = action.payload.maestroGestion.listEjecutivo;
      state.listaNovedadVisita = action.payload.maestroGestion.listNovedadVisita;
      state.listaUnidadExportar = action.payload.maestroGestion.listUnidadExportar;
      state.listaUnidadTipoCarta = action.payload.maestroGestion.listUnidadTipoCarta;
      state.listaUnidadClaseHomolagada = action.payload.maestroGestion.listUnidadClaseHomolagada;
      state.listaUnidadEstrato = action.payload.maestroGestion.listUnidadEstrato;
      state.diasHolguraGestionVisita = action.payload.maestroGestion.diasHolguraGestionVisita;
      
      return {
        ...state,
        data: data,
    };

    case ACCION.LISTAR_EJECUTIVOS_ESTRATEGIA:
      console.log(action)
      state.listaEjecutivo = action.payload;
      
      return {
        ...state
    };

    case ACCION.SELECCIONAR_ITEM_IG:
      console.log(action)
      return {
        ...state,
        formEdicionIG: action.payload,
      };
    case ACCION.LISTAR_ITEMIG:
      console.log(action)
      var data = [];
    
      state.listaPeriodoIG = action.payload.maestroGestion.listPeriodo;
      state.listaCicloIG = action.payload.maestroGestion.listCiclo;
      state.cantidadProcesos = action.payload.maestroGestion.totalProcesosActivos;
      if(action.payload.maestroGestion.listExcepcionMaestroGestion!=null && action.payload.maestroGestion.listExcepcionMaestroGestion.length>0){
        data = action.payload.maestroGestion.listExcepcionMaestroGestion;
      }
      if(action.payload.maestroGestion.listMaestroGestionTotal!=null && action.payload.maestroGestion.listExcepcionMaestroGestion==null && action.payload.maestroGestion.listMaestroGestionTotal.length>0){
        data = action.payload.maestroGestion.listMaestroGestionTotal;
      }
      
      return {
        ...state,
        data: data,
      };
    
    case ACCION.SET_BUTTONS_IG:
      console.log(action)
      return {
        ...state,
        showButtonsIG: !state.showButtonsIG,
     };
     case ACCION.SET_SHOW_MENSAJELOADER:
      console.log(action)
      return {
        ...state,
        showMensajeLoader: action.payload,
     };
     case ACCION.SET_SHOW_RESULTADOSIG:
      console.log(action)
      return {
        ...state,
        showResultadosIG: action.payload,
     };
     case ACCION.SET_SHOW_FORMIG:
      console.log(action)
      return {
        ...state,
        showFormIG: action.payload,
     };

     case ACCION.SET_SHOW_FORMLCOM:
      console.log(action)
      return {
        ...state,
        showFormLCom: action.payload,
     };
	 
	   case ACCION.SET_SHOW_MENSAJELOADERLCOM:
      console.log(action)
      return {
        ...state,
        showMensajeLoaderLCom: action.payload,
     };
	 
	   case ACCION.SET_SHOW_RESULTADOSLCOM:
      console.log(action)
      return {
        ...state,
        showResultadosLCom: action.payload,
     };
     case ACCION.LISTAR_VISTAS:
      console.log(action)
      var data = [];
    
      if(action.payload.maestroGestion.listMaestroGestionFiltroVista1y2Dto!=null && action.payload.maestroGestion.listMaestroGestionFiltroVista1y2Dto.length>0){
        data = action.payload.maestroGestion.listMaestroGestionFiltroVista1y2Dto;
      }
      if(action.payload.maestroGestion.listMaestroGestionFiltroVista3Dto!=null && action.payload.maestroGestion.listMaestroGestionFiltroVista1y2Dto.length==0 && action.payload.maestroGestion.listMaestroGestionFiltroVista3Dto.length>0){
        data = action.payload.maestroGestion.listMaestroGestionFiltroVista3Dto;
      }
      
      return {
        ...state,
        data: data,
      };

     case ACCION.LISTAR_ITEMLC:
      console.log(action)
      var data = [];
    
      state.listaPeriodoLC = action.payload.maestroGestion.listPeriodo;
      state.listaCicloLC = action.payload.maestroGestion.listCiclo;
      state.listaEjecutivosLC = action.payload.maestroGestion.listEjecutivo;
      
      state.cantidadProcesos = action.payload.maestroGestion.totalProcesosActivos;
      
      if(action.payload.maestroGestion.listExcepcionGestionComision!=null && action.payload.maestroGestion.listExcepcionGestionComision.length>0){
        data = action.payload.maestroGestion.listExcepcionGestionComision;
      }
      if(action.payload.maestroGestion.listMaestroComision!=null && action.payload.maestroGestion.listExcepcionGestionComision==null && action.payload.maestroGestion.listMaestroComision.length>0){
        data = action.payload.maestroGestion.listMaestroComision;
      }
      
      return {
        ...state,
        data: data,
      };
    //TODO habilitar inicia
    case ACCION.SET_BUTTON_INICIAGESTION:
      console.log(action)
      return {
        ...state,
        showButtonIniciaGestion: !state.showButtonIniciaGestion
      };
    case ACCION.SET_BUTTON_CONFIRMAIG:
      console.log(action)
      return {
        ...state,
        showButtonConfirmaIG: !state.showButtonConfirmaIG
      };
    case ACCION.SET_BUTTON_DESCARTARIG:
      console.log(action)
      return {
        ...state,
        showButtonDescartarIG: !state.showButtonDescartarIG
      };
    case ACCION.SET_BUTTON_LIQUIDARLC:
      console.log(action)
      return {
        ...state,
        showButtonLiquidarLC: !state.showButtonLiquidarLC
      }   
    case ACCION.SET_BUTTON_RECALCULARLC:
      console.log(action)
      return {
        ...state,
        showButtonRecalcularLC: !state.showButtonRecalcularLC
      }   
    case ACCION.SET_BUTTON_EXPORTARLC:
      console.log(action)
      return {
        ...state,
        showButtonExportarLC: !state.showButtonExportarLC
      }  
    case ACCION.SET_BUTTON_CERRARPERIDOLC:
      console.log(action)
      return {
        ...state,
        showButtonCerraPeriodoLC: !state.showButtonCerraPeriodoLC
      }  
    case ACCION.SET_BUTTON_EDITARABONOLC:
      console.log(action)
      return {
        ...state,
        showButtonEditarAbonoLC: !state.showButtonEditarAbonoLC
      }   
    case ACCION.SET_BUTTONS_ASIGNACIONMG:
      console.log(action)
      return {
        ...state,
        showButtonsAsinacionMG: !state.showButtonsAsinacionMG
      };
   /* case ACCION.SET_BUTTONS_LIQUIDACION:
      console.log(action)
      return {
        ...state,
        showButtonsLiquidacion: !state.showButtonsLiquidacion
      };*/
      case ACCION.SET_OCULTARBUTTON_GR:
        console.log(action)
        return {
          ...state,
          showButtonGuardarR: action.payload
        };
    //TODO habilitar fin
    case ACCION.SET_BUTTONS_LC:
      console.log(action)
      return {
        ...state,
        showButtonsLC: !state.showButtonsLC,
     };

     case ACCION.SET_SHOW_LISTARESULTLC:
      console.log(action)
      return {
        ...state,
        showListaResultLC: !state.showListaResultLC,
    };
    case ACCION.SET_EXIST_RESULTLC:
      console.log(action)
      return {
        ...state,
        existResultLC: !state.existResultLC,
    };
    
     case ACCION.SELECCIONAR_ITEM_LC:
      console.log(action)
      return {
        ...state,
        formEdicionLC: action.payload,
      };

      case ACCION.SET_MODALABONO_LC:
      console.log(action)
      return {
        ...state,
        showModalAbonoLC: !state.showModalAbonoLC
     };

     case ACCION.SET_SELECCIONADOSLISTA_LC:
      console.log(action)
      return {
        ...state,
        seleccionadosLC: [...state.seleccionadosLC, action.payload],
        seleccionadosEjelistLC:[...state.seleccionadosEjelistLC, action.payloadEje],
      };
    
      case ACCION.SET_NEWSELECCIONADOSLISTA_LC:
        console.log(action)
        return {
          ...state,
          seleccionadosLC: action.payload,
          seleccionadosEjelistLC: action.payloadEje,
        };


    case ACCION.SET_DETALLE_MC:
      console.log(action)
      return {
        ...state,
        showDetalleMG: !state.showDetalleMG,
     };

    case ACCION.SET_MODALCONCEPTO_MC:
      console.log(action)
      return {
        ...state,
        showModalConceptoMG: !state.showModalConceptoMG
     };
    case ACCION.SET_DATAMODALCONCEPTO_MC:
      console.log(action)
      return {
        ...state,
        dataConcepto:action.payload
     };
    case ACCION.SET_DATA_DETALLELCRE:
      console.log(action)
      return {
        ...state,
        dataDetalleLCRE: action.payload,
      };

    case ACCION.SET_DATA_DETALLELCGV:
      console.log(action)
      return {
        ...state,
        dataDetalleLCGV: action.payload,
      };

    case ACCION.SET_SELECCIONADOSLISTA_MG:
      console.log(action)
      return {
        ...state,
        seleccionadosMG: [...state.seleccionadosMG, action.payload],
      };

    case ACCION.SET_NEWSELECCIONADOSLISTA_MG:
      console.log(action)
      return {
        ...state,
        seleccionadosMG: action.payload,
      };

    case ACCION.CONTAR_ASIGNADOSLISTA_MG:
      console.log(action)
      return {
        ...state,
        contarAsignadosMG: [...state.contarAsignadosMG, action.payload],
      };

    case ACCION.CONTAR_NEWASIGNADOSLISTA_MG:
      console.log(action)
      return {
        ...state,
        contarAsignadosMG: action.payload,
      };
    
    case ACCION.CONTAR_REGISTROCONFIRMADO_MG:
      console.log(action)
      return {
        ...state,
        contarEstadoRegConfirmMG: [...state.contarEstadoRegConfirmMG, action.payload],
      };

    case ACCION.CONTAR_NEWREGISTROCONFIRMADO_MG:
      console.log(action)
      return {
        ...state,
        contarEstadoRegConfirmMG: action.payload,
      }; 

    case ACCION.SELECCIONAR_ITEM_GV:
      console.log(action)
      
      return {
        ...state,
        formEdicionGVisita: action.payload,
      };

    case ACCION.SELECCIONAR_ITEM_GVR:
      console.log(action)
      return {
        ...state,
        formEdicionGVRecursos: action.payload,
      };
  case ACCION.LIMPIAR_FORM_RECURSOGV:
    console.log(action)
    return {
      ...state,
      formEdicionGVRecursos: {},
    };
  case ACCION.SET_SELECCIONADO_ROWGV:
    console.log(action)
    return {
      ...state,
      formEdicionGVisita: action.payload,
    };
    case ACCION.SET_IDREGISTROGV:
      console.log(action)
      //var prueba= ;
      return {
        ...state,
        formEdicionGVisita: {...state.formEdicionGVisita, 
          gvis_idregistro: action.payload
        }
      };
    case ACCION.SET_LIMPIAR_IDREGISTROGV:
      return {
        ...state,
        formEdicionGVisita: {...state.formEdicionGVisita, 
          gvis_idregistro: " ",
          gvis_fechavisita: " ",
          gvis_observacion:  " ",
          gvis_numeroradicado:  " ",
          nvis_idregistro: -2
        }
      };
    case ACCION.SET_SHOW_MAESTROGESTION:
      console.log(action)
      return {
        ...state,
        showMaestroGestion: !state.showMaestroGestion,
    };

    case ACCION.SET_SHOW_GESTIONVISITA:
      console.log(action)
      return {
        ...state,
        showGestionVisitas: !state.showGestionVisitas,
    };
    case ACCION.SET_HTML_RECURSOS:
      console.log(action)
      return {
        ...state,
        htmlString: action.payload,
    };
    
    case ACCION.LISTAR_GESTION_VISITA:
      console.log(action)
      var data = [];
    
      if(action.payload.gestionvisitas.listGestionVisitaResumen!=null && action.payload.gestionvisitas.listGestionVisitaResumen.length>0){
        data = action.payload.gestionvisitas.listGestionVisitaResumen;
      }
      
    return {
      ...state,
      dataGV: data,
    };

    case ACCION.SET_DATA_RECURSOGV:
      console.log(action)
     
    return {
      ...state,
      dataRecursos: action.payload,
    };
    case ACCION.SET_SHOW_LISTAGNVISITA:
      console.log(action)
      return {
        ...state,
        showListaGVisita: !state.showListaGVisita,
    };

    case ACCION.SET_SHOW_FORMCONSULTAGNVISITA:
      console.log(action)
      return {
        ...state,
        showFormConsultaGVista: !state.showFormConsultaGVista,
    };

    case ACCION.SET_SHOW_FORMGNVISITA:
      console.log(action)
      return {
        ...state,
        showFormGVista: !state.showFormGVista,
    };

    /**inicia acciones Deterioro NIFF */

    case ACCION.LISTAR_ITEMDN:
      console.log(action)
      var data = [];
      var dataResumen = [];
      state.listaPeriodoDN = action.payload.gestionNiff.listPeriodo;
      state.listaCicloDN = action.payload.gestionNiff.listCiclo;
      state.cantidadProcesos = action.payload.gestionNiff.totalProcesosActivos;
      if(action.payload.gestionNiff.listExcepcionGestionFacturaNiff!=null && action.payload.gestionNiff.listExcepcionGestionFacturaNiff.length>0){
        data = action.payload.gestionNiff.listExcepcionGestionFacturaNiff;
      }
      if(action.payload.gestionNiff.gestionFacturaNiffResumenDto.listGestionFacturaNiffDto!=null && action.payload.gestionNiff.listExcepcionGestionFacturaNiff==null && action.payload.gestionNiff.gestionFacturaNiffResumenDto.listGestionFacturaNiffDto.length>0){
        state.id_periodoInicioDN = action.payload.gestionNiff.gestionFacturaNiffResumenDto.listGestionFacturaNiffDto[0].niff_per_ideregistro;
        data = action.payload.gestionNiff.gestionFacturaNiffResumenDto.listGestionFacturaNiffDto;
        dataResumen = action.payload.gestionNiff.gestionFacturaNiffResumenDto.listGestionFacturaNiffDetalleDto;
      }
      
      return {
        ...state,
        data: data,
        dataResumenDN: dataResumen
      };
      case ACCION.LISTAR_ITEM_CONSULTARDN:
        console.log(action)
        state.listaPeriodoDN = action.payload.gestionNiff.listPeriodo;
        return {
          ...state,
        };  
    case ACCION.SET_SHOW_RESULTADOSDN:
      console.log(action)
      return {
        ...state,
        showResultadosDN: action.payload,
     };

    case ACCION.SET_SHOW_FORMDN:
      console.log(action)
      return {
        ...state,
        showFormDN: action.payload,
     };

    case ACCION.SELECCIONAR_ITEM_DN:
      console.log(action)
      return {
        ...state,
        formEdicionDN: action.payload,
      };

    case ACCION.SET_BUTTONS_DN:
        console.log(action)
        return {
          ...state,
          showButtonsDN: !state.showButtonsDN,
       };
      
    case ACCION.SET_BUTTON_INICIADN:
      console.log(action)
      return {
        ...state,
        showButtonIniciaDN: !state.showButtonIniciaDN
      };
    case ACCION.SET_BUTTON_CONFIRMADN:
      console.log(action)
      return {
        ...state,
        showButtonConfirmaDN: !state.showButtonConfirmaDN
      };
    case ACCION.SET_BUTTON_DESCARTARDN:
      console.log(action)
      return {
        ...state,
        showButtonDescartarDN: !state.showButtonDescartarDN
      };
    case ACCION.SET_DATAMODALCONCEPTO_DN:
        console.log(action)
        
        return {
          ...state,
          dataConceptoDN:action.payload
       };
    case ACCION.SET_MODALCONCEPTO_DN:
      console.log(action)
      
      return {
        ...state,
        showModalConceptoDN: !state.showModalConceptoDN
     };
     case ACCION.LISTAR_RESUMEN_CONSULTA:
      console.log(action)
      var data = [];
    
      if(action.payload.gestionvisitas.listGestionVisitaResumen!=null && action.payload.gestionvisitas.listGestionVisitaResumen.length>0){
        data = action.payload.gestionvisitas.listGestionVisitaResumen;
      }
      
    return {
      ...state,
      dataConsultaDN: data,
    };
    case ACCION.SET_DATAREPORTES_DN:
        console.log(action)
        
        var data = [];
        var dataResumen = [];
      if(action.payload.listGestionFacturaNiffDto!=null && action.payload.listGestionFacturaNiffDto.length>0){
        data = action.payload.listGestionFacturaNiffDto;
        dataResumen = action.payload.listGestionFacturaNiffDetalleDto;
      }
      
     
        return {
          ...state,
          dataReportesDN:data,
          dataResumenDN: dataResumen
    };
    /** termina acciones deterioro NIFF*/
    /** inicia kactus */
    case ACCION.LISTAR_ITEMEK:
      console.log(action)
      var data = [];
    
      state.listaPeriodoEK = action.payload.maestroKactus.listPeriodo;
      state.listaCicloEK = action.payload.maestroKactus.listCiclo;
      return {
        ...state,
        data: data,
      };
      case ACCION.LISTAR_DATOSEK:
        
        console.log(action)
        var data = [];
        if(action.payload.listGestionComisionResumenDto!=null && action.payload.listGestionComisionResumenDto.length>0){
          data = action.payload.listGestionComisionResumenDto;
        }
        return {
          ...state,
          data: data,
        };
    case ACCION.SELECCIONAR_ITEM_EK:
      console.log(action)
      return {
        ...state,
        formEdicionEK: action.payload,
      };
    
    case ACCION.SET_SELECCIONADOSLISTA_EK:
      console.log(action)
      return {
        ...state,
        seleccionadosEK: [...state.seleccionadosEK, action.payload],
        //seleccionadosEjelistLC:[...state.seleccionadosEjelistLC, action.payloadEje],
      };
      case ACCION.SET_NEWSELECCIONADOSLISTA_EK:
        console.log(action)
        return {
          ...state,
           //seleccionadosEK: [...state.seleccionadosEK, action.payload],
          seleccionadosEK: action.payload,
          //seleccionadosEKjelist: action.payloadEje,
        };
        case ACCION.SET_LIMPIAR_SELECCIONADOSEK:
          console.log(action)
          return {
            ...state,
            seleccionadosEK: []
          };
    /** fin kactus*/
    /**Inicio cumplimiento metas 
    */
     //TODO habilitar fin
     case ACCION.SET_BUTTONS_META:
      console.log(action)
      return {
        ...state,
        showButtonsMeta: !state.showButtonsMeta,
     };
     case ACCION.SET_BUTTON_CONSOLIDARMETA:
      console.log(action)
      return {
        ...state,
        showButtonConsolidarMeta: !state.showButtonConsolidarMeta
      }   
    case ACCION.SET_BUTTON_RECALCULARMETA:
      
      console.log(action)
      return {
        ...state,
        showButtonRecalcularMeta: !state.showButtonRecalcularMeta
      }   
    case ACCION.SET_BUTTON_CONFIRMARMETA:
      
      console.log(action)
      return {
        ...state,
        showButtonConfirmaMeta: !state.showButtonConfirmaMeta
      }  
    case ACCION.SET_BUTTON_CERRARPERIODOMETA:
      
      console.log(action)
      return {
        ...state,
        showButtonCerraPeriodoMeta: !state.showButtonCerraPeriodoMeta
      } 
    case ACCION.SET_SHOW_MENSAJELOADERMETA:
        console.log(action)
        return {
          ...state,
          showMensajeLoaderMeta: action.payload,
       };
     
      case ACCION.SET_EXIST_RESULTMETA:
        console.log(action)
        return {
          ...state,
          existResultMeta: !state.existResultMeta,
      };
      case ACCION.SET_SHOW_FORMMETA:
        console.log(action)
        return {
          ...state,
          showFormMeta: action.payload,
       };

       case ACCION.SET_SHOW_RESULTADOSMETA:
        console.log(action)
        return {
          ...state,
          showResultadosMeta: action.payload,
       };
       
      case ACCION.SET_SHOW_LISTARESULTMETA:
        console.log(action)
        return {
          ...state,
          showListaResultMeta: !state.showListaResultMeta,
      };

    case ACCION.SET_DATA_DETALLECMRE:
      console.log(action)
      return {
        ...state,
        dataDetalleCMRE: action.payload,
      };

    case ACCION.SET_DATA_DETALLECMGV:
      console.log(action)
      return {
        ...state,
        dataDetalleCMGV: action.payload,
    };

      case ACCION.LISTAR_ITEMMETA:
        console.log(action)
        var data = [];
        state.listaPeriodoMetas = action.payload.meta.listCumplimientoMetasAgrupado;
        state.listaEjecutivosMetas = action.payload.meta.listEjecutivoCumplimientoMetas;
        state.cantidadProcesos = action.payload.meta.totalProcesosActivos;
        
        if(action.payload.meta.listExcepcionesCumplimientoMetas!=null && action.payload.meta.listExcepcionesCumplimientoMetas.length>0){
          data = action.payload.meta.listExcepcionesCumplimientoMetas;
        }
        if(action.payload.meta.listCumplimientoMetasConsolidado!=null && action.payload.meta.listExcepcionesCumplimientoMetas==null && action.payload.meta.listCumplimientoMetasConsolidado.length>0){
          data = action.payload.meta.listCumplimientoMetasConsolidado;
        }
        
        return {
          ...state,
          data: data,
        };
    case ACCION.LISTAR_CONSULTAMETA:
      console.log(action)
      
      var data = [];
      
      if(action.payload.meta.listCumplimientoMetasConsolidado!=null && action.payload.meta.listCumplimientoMetasConsolidado.length>0){
        data = action.payload.meta.listCumplimientoMetasConsolidado;
      }
      
      return {
        ...state,
        data: data,
    };  
    case ACCION.SELECCIONAR_ITEM_META:
      console.log(action)
      return {
        ...state,
        formEdicionCM: action.payload,
      };
    case ACCION.SELECCIONAR_ITEM_CONSULTAMETA:
      console.log(action)
      return {
        ...state,
        formEdicionCCM: action.payload,
      };
      //para historicos
      case ACCION.LISTAR_ITEM_HISTORICO:
        console.log(action)
        var data = [];
        
        state.listaEjecutivosMH = action.payload.meta.listEjecutivoCumplimientoMetas;
        state.listaPeriodoMHDesde = action.payload.meta.listPeriodoConsolidadoDesde;
        state.listaPeriodoMHHasta = action.payload.meta.listPeriodoConsolidadoHasta;
        state.listaMetasHistorico = action.payload.meta.listMetaConsolidado;
        
        return {
          ...state,
          data: data,
        };
    /**Fin cumplimiento metas */
    case ACCION.LISTAR_ITEM:
      console.log(action)
      var data = [];
      state.listaEstados = action.payload.general.listUnidadEstados;
      state.listaVariablesGlobales = action.payload.general.listVariableGlobal;
      state.listaCondicionales = action.payload.general.listUnidadCondicional;
      state.listaUnidadControlEstaCartera = action.payload.general.listUnidadControlEstaCartera;
      state.listaUnidadClasificacion = action.payload.general.listUnidadTipos;
      state.listaProgramasUnidad = action.payload.general.listProgramasUnidad;
      state.listaUsuarios = action.payload.general.listUsuarios;
      state.listaUnidadTipoRecurso = action.payload.general.listUnidadTipoRecurso;
      state.listaUnidadControlMetasGestion = action.payload.general.listUnidadControlMetasGestion;
      state.listaUnidadConceptoMetas = action.payload.general.listUnidadConceptoMetas;
      state.listaFuncionBaseMeta = action.payload.general.listFuncionBaseMeta;
      state.listaFuncionMeta = action.payload.general.listFuncionMeta;
      state.listaFuncionBaseComision = action.payload.general.listFuncionBaseComision;
      state.listaFuncionComision = action.payload.general.listFuncionComision;
      state.listaPeriodos = action.payload.general.listPeriodo;
      state.listaEtapasGestion = action.payload.general.listUnidadGestion;
      state.listaTiposEjecutivos = action.payload.general.listUnidadTipoEjecutivo;
      state.listaTablaComisional = action.payload.general.listUnidadTablaComisional;
      state.listaMetaGestion = action.payload.general.listUnidadMetaGestion;
      state.listaComunas = action.payload.general.sectores; 
      //inicio variable globales
      state.listaEstados = action.payload.general.listUnidadEstados;
      state.listaUnidadTipoDato = action.payload.general.listUnidadTipoDato;
      state.listaUnidadAtributoMaestro = action.payload.general.listUnidadAtributoMaestro;
      state.listaFuncionOrigen = action.payload.general.listFuncionOrigen;
      state.listaUnidadMetodoBackend = action.payload.general.listUnidadMetodoBackend;
      //fin variable globales
     // state.listaUnidadProcedimientoGestion = action.payload.general.listUnidadProcedimientoGestion;
      state.listaUnidadMetodoCarga = action.payload.general.listUnidadMetodoCarga;
     
      if (state.origenComponente == MODULO.ORIENTACION) {
        data = action.payload.orientacion;
      }
      if (state.origenComponente == MODULO.CLASIFICACION) {
        data = action.payload.clasificacion;
      }
      if (state.origenComponente == MODULO.ESTADO_CARTERA) {
        data = action.payload.estadoCartera;
      }
      if (state.origenComponente == MODULO.EDAD_CARTERA) {
        data = action.payload.edadCartera;
      }
      if (state.origenComponente == MODULO.ESTRATEGIA) {
        data = action.payload.estrategia;
      }
      if (state.origenComponente == MODULO.RESTRICCION_FINANCIACION) {
        data = action.payload.restriccionFinanciacion;
      }
      if (state.origenComponente == MODULO.NOVEDAD_VISITA) {
        data = action.payload.novedadVisita;
      }
      if (state.origenComponente == MODULO.META_GESTION) {
        data = action.payload.metasGestion;
      }
      if (state.origenComponente == MODULO.TABLA_COMISIONAL) {
        data = action.payload.tablaComisional;
      }
      if (state.origenComponente == MODULO.EJECUTIVOS) {
        data = action.payload.ejecutivos;
      }
      if (state.origenComponente == MODULO.VARIABLES_GLOBALES) {
        data = action.payload.variablesGlobales;
      }
      return {
        ...state,
        data: data,
      };
    case ACCION.MOSTRAR_ALERTA:
      mostrarAlerta("", "")
      return {
        ...state
      }
    default:
      return state;
  }
};

export default reducer;


