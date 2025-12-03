
const PARAMETROS = {
    APP_DEV: { DEBUG: true },
    DEBUG: true,
    EMPRESA_BIOAGRICOLA: 317,
    CLAVE_ENCRIPTACION: '$Gell$239.',
    BASENAME: '/achagua/sistema/web/app.php/homafo',
    RESPONSIVE: {
        XS: 12,
        MD: 3,
        LG: 3
    },
    DEFAULT_PAGEABLE: { 'page': 0, 'size': 5, 'sort': null },
    DATATABLES_CUSTOM_STYLE:  {
        headRow: {
            style: {
                border: 'none',
                aling: 'center'
            },
        },
        headCells: {
            style: {
                color: '#202124',
                fontSize: '14px',
            },
        },
        rows: {
            highlightOnHoverStyle: {
                backgroundColor: 'rgb(230, 244, 244)',
                borderBottomColor: '#FFFFFF',
                borderRadius: '25px',
                outline: '1px solid #FFFFFF',
            },
        },
        pagination: {
            style: {
                border: 'none',
            },
        },
    },
    CLASES: {
        CLASE_CLASE_AFORO: 133, // 132 
        CLASE_CONCEPTO_AFORO: 111,
        CLASE_AFORO_INDIVIDUAL: 6490,
        CLASE_AFORO_MULTIPLE: 6491,
    },
    CLASES_NOVEDADES: {
        NOVEDADES_VISITA: 130,
        NOVEDADES_LIQUIDACION: 131
    },
    CLASES_RUTAS: {
        ID_CLASE_MICRORUTA: 3016,
        ID_CLASE_MACRORUTA: 3017
    },
    PARAMETRIZACION_BARRIOS: {
        PROGRAMA_ID: 774,
        EMPRESA_HOMOLOGACION_BARRIO: 322,
        ID_CLASE_MICRORUTA: 3016,
        ID_CLASE_RUTABARRIDO: 1512,
        ID_CLASE_COMPLEMENTOS: 41,
        FRECUENCIAS: [
            { value: 1, label: "Lunes" },
            { value: 2, label: "Martes" },
            { value: 3, label: "Miercoles" },
            { value: 4, label: "Jueves" },
            { value: 5, label: "Viernes" },
            { value: 6, label: "Sabado" },
            { value: 7, label: "Domingo" }]
    },
    ACTUALIZACIONES: {
        PROGRAMA_ID: 773
    },
    ACTUALIZACIONES_RAPIDA: {
        PROGRAMA_ID: 779
    },
    CRUCE_INFORMACION: {
        PROGRAMA_ID: 772
    },
    GENERAR_CARTAS: {
        PROGRAMA_ID: 776
    },
    PARAMETRIZACION_IMPORTACION: {
        PROGRAMA_ID: 777
    },
    AFORO_NORMAL: {
        PROGRAMA_ID: 784
    },
    AFORO_VISITAS: {
        PROGRAMA_ID: 782
    },
    AFORO_LIQUIDACION: {
        PROGRAMA_ID: 781
    },
    AFORO_MULTIUSUARIO: {
        PROGRAMA_ID: 780
    },
    AFORO_PARAMETRIZACION: {
        PROGRAMA_ID: 785
    },
    PERMISOS_PROGRAMA:
    {
        AFORO_PARAMETRIZACION: {
            PARAMETRIZACION_TIPOS_GENERADOR: {
                VIEW: 'VIEW_PTGENER'
            },
            PARAMETRIZACION_TIPOS_AFOROS: {
                VIEW: 'VIEW_PTAFOROS'
            }
        },
        ACTUALIZACIONES: {
            QUERY: 'QUERY_ACT',
            VIEW: 'VIEW_PNOVVIS',
            EDIT: 'EDIT_ACT'
        },
        ACTUALIZACIONES_RAPIDA: {
            QUERY: 'QUERY_ACT_APP',
            VIEW: 'VIEW_PNOVVIS_APP',
            EDIT: 'EDIT_ACT_APP'
        },
        CRUCE_INFORMACION: {
            QUERY: 'QUERY_CRUCE',
            VIEW: 'VIEW_CRUCEVVIS',
            EDIT: 'EDIT_CRUCE'
        },
        GENERAR_CARTAS: {
            QUERY: 'QUERY_CARTAS',
            VIEW: 'VIEW_CARTASVVIS',
            EDIT: 'EDIT_CARTAS'
        },
        AFORO_NORMAL: {
            QUERY: 'QUERY_AFONORMAL',
            VIEW: 'VIEW_AFONORVVIS',
            EDIT: 'EDIT_AFONORMAL',
            CREATE: 'CREATE_AFONORMAL'
        },
        AFORO_VISITAS: {
            QUERY: 'QUERY_AFOVIS',
            VIEW: 'VIEW_AFOVIS',
            EDIT: 'EDIT_AFOVIS',
            CREATE: 'CREATE_AFOVIS'
        },
        AFORO_LIQUIDACION: {
            QUERY: 'QUERY_AFOLIQ',
            VIEW: 'VIEW_AFOLIQ',
            CREATE: 'CREATE_AFOLIQ'
        },
        AFORO_MULTIUSUARIO: {
            QUERY: 'QUERY_AFOMULTI',
            VIEW: 'VIEW_AFOMULTI',
            EDIT: 'EDIT_AFOMULTI',
            CREATE: 'CREATE_AFOMULTI'
        },
        PARAMETRIZACION_IMPORTACION: {
            QUERY: 'QUERY_PRMIMPORT',
            VIEW: 'VIEW_PRMTVVIS',
            EDIT: 'EDIT_PRMIMPORT',
            CREATE: 'CREATE_PRMIMPORT'
        },
        PARAMETRIZACION_GENERAL: {
            NOVEDADES_VISITA: {
                VIEW: 'VIEW_PNOVVIS',
                EDIT: 'EDIT_PNOVVIS',
                CREATE: 'CREATE_PNOVVIS',
                DELETE: 'DEL_PNOVVIS',
                SAVE: 'SAVE_PNOVVIS'
            },
            NOVEDADES_LIQUIDACION: {
                VIEW: 'VIEW_PNOVLIQ',
                EDIT: 'EDIT_PNOVLIQ',
                CREATE: 'CREATE_PNOVLIQ',
                DELETE: 'DEL_PNOVLIQ',
                SAVE: 'SAVE_PNOVLIQ'
            },
            PARAMETRIZACION_BARRIOS: {
                VIEW: 'VIEW_PBARRIOS'
            },
            PARAMETRIZACION_MACRORUTAS: {
                VIEW: 'VIEW_PMRUTAS'
            }

        }
    }
}
export default PARAMETROS;
