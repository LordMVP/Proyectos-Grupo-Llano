const menuTemporal = [
  {
    'opcIderegistro': 1,
    'opcIdepadre': null,
    'opcNombre': 'Nominaciones',
    'opcDescripcion': 'Nominaciones',
    'prgIderegistro': null,
    'menuItem': [
      {
        'opcIderegistro': 2,
        'opcIdepadre': 1,
        'opcNombre': 'Administración',
        'opcDescripcion': 'Administración del módulo de Nominaciones',
        'prgIderegistro': null,
        'menuItem': [
          {
            'opcIderegistro': 3,
            'opcNombre': 'Gestión de Configuraciones Generales',
            'opcIdepadre': 2,
            'opcDescripcion': 'Gestión de Configuraciones Generales',
            'prgIderegistro': {
              'prgIderegistro': 3,
              'prgNombre': 'Gestión de Configuraciones Generales',
              'prgLocaliza': '/gestion_configuracion'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 4,
            'opcNombre': 'Consulta de Configuraciones Generales',
            'opcIdepadre': 2,
            'opcDescripcion': 'Consulta de Configuraciones Generales',
            'prgIderegistro': {
              'prgIderegistro': 3,
              'prgNombre': 'Consulta de Configuraciones Generales',
              'prgLocaliza': '/consultar_configuraciones'
            },
            'opcTipo': 2
          }
        ]
      },
      {
        'opcIderegistro': 3,
        'opcIdepadre': 1,
        'opcNombre': 'Variables',
        'opcDescripcion': 'Administración del módulo de Variables',
        'prgIderegistro': null,
        'menuItem': [
          {
            'opcIderegistro': 5,
            'opcNombre': 'Gestión de Variables',
            'opcIdepadre': 3,
            'opcDescripcion': 'Gestión de Variables',
            'prgIderegistro': {
              'prgIderegistro': 3,
              'prgNombre': 'Gestión de Variables',
              'prgLocaliza': '/gestion_variables'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 4,
            'opcNombre': 'Consulta de Variables',
            'opcIdepadre': 2,
            'opcDescripcion': 'Consulta de Variables',
            'prgIderegistro': {
              'prgIderegistro': 3,
              'prgNombre': 'Consulta de Variables',
              'prgLocaliza': '/consultar_variables'
            },
            'opcTipo': 2
          }
        ]
      },
      {
        'opcIderegistro': 6,
        'opcIdepadre': 1,
        'opcNombre': 'Parametrización',
        'opcDescripcion': 'Parametrización',
        'prgIderegistro': null,
        'menuItem': [
          {
            'opcIderegistro': 8,
            'opcNombre': 'Converson de Unidades',
            'opcIdepadre': 6,
            'opcDescripcion': 'Converson de Unidades',
            'prgIderegistro': {
              'prgIderegistro': 7,
              'prgNombre': 'Converson de Unidades',
              'prgLocaliza': '/conversor_unidades'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 9,
            'opcNombre': 'Registro Rutas GNC y Conexión',
            'opcIdepadre': 6,
            'opcDescripcion': 'Registro Rutas GNC y Conexión',
            'prgIderegistro': {
              'prgIderegistro': 8,
              'prgNombre': 'Registro Rutas GNC y Conexión',
              'prgLocaliza': '/registro_masivo_rutas_gnc'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 10,
            'opcNombre': 'Gestión de Tramos',
            'opcIdepadre': 6,
            'opcDescripcion': 'Gestión de Tramos',
            'prgIderegistro': {
              'prgIderegistro': 11,
              'prgNombre': 'Gestión de Tramos',
              'prgLocaliza': '/gestion_tramos'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 11,
            'opcNombre': 'Consulta de Tramos',
            'opcIdepadre': 6,
            'opcDescripcion': 'Consulta de Tramos',
            'prgIderegistro': {
              'prgIderegistro': 12,
              'prgNombre': 'Consulta de Tramos',
              'prgLocaliza': '/consulta_tramos'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 12,
            'opcNombre': 'Registro Masivo de Tramos',
            'opcIdepadre': 6,
            'opcDescripcion': 'Registro Masivo de Tramos',
            'prgIderegistro': {
              'prgIderegistro': 13,
              'prgNombre': 'Registro Masivo de Tramos',
              'prgLocaliza': '/registro_masivo_tramos'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 13,
            'opcNombre': 'Gestión de Puntos de Salida',
            'opcIdepadre': 6,
            'opcDescripcion': 'Gestión de Puntos de Salida',
            'prgIderegistro': {
              'prgIderegistro': 14,
              'prgNombre': 'Gestión de Puntos de Salida',
              'prgLocaliza': '/gestion_puntos_salida'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 14,
            'opcNombre': 'Consulta de Puntos de Salida',
            'opcIdepadre': 6,
            'opcDescripcion': 'Consulta de Puntos de Salida',
            'prgIderegistro': {
              'prgIderegistro': 15,
              'prgNombre': 'Consulta de Puntos de Salida',
              'prgLocaliza': '/consulta_puntos_salida'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 16,
            'opcNombre': 'Consulta Fuentes Distribución',
            'opcIdepadre': 6,
            'opcDescripcion': 'Consulta Fuentes Distribución',
            'prgIderegistro': {
              'prgIderegistro': 17,
              'prgNombre': 'Consulta Fuentes Distribución',
              'prgLocaliza': '/consulta_fuentes_distribucion'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 17,
            'opcNombre': 'Gestión de Fuentes Distribución',
            'opcIdepadre': 6,
            'opcDescripcion': 'Gestión de Fuentes Distribución',
            'prgIderegistro': {
              'prgIderegistro': 18,
              'prgNombre': 'Gestión de Fuentes Distribución',
              'prgLocaliza': '/gestion_fuentes_distribucion'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 19,
            'opcNombre': 'Consulta Top Grupal',
            'opcIdepadre': 6,
            'opcDescripcion': 'Consulta Top Grupal',
            'prgIderegistro': {
              'prgIderegistro': 20,
              'prgNombre': 'Consulta Top Grupal',
              'prgLocaliza': '/consulta_top_grupal'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 21,
            'opcNombre': 'Gestión de Top Grupal',
            'opcIdepadre': 6,
            'opcDescripcion': 'Gestión de Top Grupal',
            'prgIderegistro': {
              'prgIderegistro': 22,
              'prgNombre': 'Gestión de Top Grupal',
              'prgLocaliza': '/gestion_top_grupal'
            },
            'opcTipo': 2
          },

          {
            'opcIderegistro': 23,
            'opcNombre': 'Consulta Rutas Sistema Nacional',
            'opcIdepadre': 6,
            'opcDescripcion': 'Consulta Rutas Sistema Nacional',
            'prgIderegistro': {
              'prgIderegistro': 24,
              'prgNombre': 'Consulta Rutas Sistema Nacional',
              'prgLocaliza': '/consulta_rutas_sistema_nal'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 25,
            'opcNombre': 'Gestión Rutas Sistema Nacional',
            'opcIdepadre': 6,
            'opcDescripcion': 'Gestión Rutas Sistema Nacional',
            'prgIderegistro': {
              'prgIderegistro': 26,
              'prgNombre': 'Gestión Rutas Sistema Nacional',
              'prgLocaliza': '/gestion_rutas_sistema_nal'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 27,
            'opcNombre': 'Gestión registro TRM',
            'opcIdepadre': 6,
            'opcDescripcion': 'Gestión registro TRM',
            'prgIderegistro': {
              'prgIderegistro': 28,
              'prgNombre': 'Gestión Registro TRM',
              'prgLocaliza': '/gestion_registro_trm'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 29,
            'opcNombre': 'Gestión Agentes Terceros',
            'opcIdepadre': 6,
            'opcDescripcion': 'Gestión Agentes Terceros',
            'prgIderegistro': {
              'prgIderegistro': 30,
              'prgNombre': 'Gestión Agentes Terceros',
              'prgLocaliza': '/gestion_agentes_terceros'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 31,
            'opcNombre': 'Consulta Agentes Terceros',
            'opcIdepadre': 6,
            'opcDescripcion': 'Consulta Agentes Terceros',
            'prgIderegistro': {
              'prgIderegistro': 32,
              'prgNombre': 'Consulta Agentes Terceros',
              'prgLocaliza': '/consulta_agentes_terceros'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 37,
            'opcNombre': 'Gestión de Mercados Relevantes',
            'opcIdepadre': 6,
            'opcDescripcion': 'Gestión de Mercados Relevantes',
            'prgIderegistro': {
              'prgIderegistro': 38,
              'prgNombre': 'Gestión de Mercados Relevantes',
              'prgLocaliza': 'gestion_mercados_relevantes'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 39,
            'opcNombre': 'Gestión Rutas GNC',
            'opcIdepadre': 6,
            'opcDescripcion': 'Gestión Rutas GNC',
            'prgIderegistro': {
              'prgIderegistro': 40,
              'prgNombre': 'Gestión Rutas GNC',
              'prgLocaliza': 'gestion_rutas_gnc'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 41,
            'opcNombre': 'Consulta Rutas GNC',
            'opcIdepadre': 6,
            'opcDescripcion': 'Consulta Rutas GNC',
            'prgIderegistro': {
              'prgIderegistro': 42,
              'prgNombre': 'Consulta Rutas GNC',
              'prgLocaliza': 'consulta_rutas_gnc'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 43,
            'opcNombre': 'Gestión de Mercados Relevantes',
            'opcIdepadre': 6,
            'opcDescripcion': 'Gestión de Mercados Relevantes',
            'prgIderegistro': {
              'prgIderegistro': 44,
              'prgNombre': 'Gestión de Mercados Relevantes',
              'prgLocaliza': 'gestion_mercados_relevantes'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 45,
            'opcNombre': 'Gestión Rutas GNC',
            'opcIdepadre': 6,
            'opcDescripcion': 'Gestión Rutas GNC',
            'prgIderegistro': {
              'prgIderegistro': 46,
              'prgNombre': 'Gestión Rutas GNC',
              'prgLocaliza': 'gestion_rutas_gnc'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 47,
            'opcNombre': 'Consulta Rutas GNC',
            'opcIdepadre': 6,
            'opcDescripcion': 'Consulta Rutas GNC',
            'prgIderegistro': {
              'prgIderegistro': 48,
              'prgNombre': 'Consulta Rutas GNC',
              'prgLocaliza': 'consulta_rutas_gnc'
            },
            'opcTipo': 2
          }
        ]
      },
      {
        'opcIderegistro': 49,
        'opcIdepadre': 1,
        'opcNombre': 'Contratos',
        'opcDescripcion': 'Contratos',
        'prgIderegistro': null,
        'menuItem': [
          {
            'opcIderegistro': 50,
            'opcNombre': 'Crear Contratos',
            'opcIdepadre': 6,
            'opcDescripcion': 'Crear Contratos',
            'prgIderegistro': {
              'prgIderegistro': 51,
              'prgNombre': 'Crear Contratos',
              'prgLocaliza': '/gestion_contratos'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 52,
            'opcNombre': 'Consultar Contratos',
            'opcIdepadre': 6,
            'opcDescripcion': 'Consultar Contratos',
            'prgIderegistro': {
              'prgIderegistro': 53,
              'prgNombre': 'Consultar Contratos',
              'prgLocaliza': '/consulta_contratos'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 54,
            'opcNombre': 'Gestión de Mercados Relevantes',
            'opcIdepadre': 6,
            'opcDescripcion': 'Gestión de Mercados Relevantes',
            'prgIderegistro': {
              'prgIderegistro': 55,
              'prgNombre': 'Gestión de Mercados Relevantes',
              'prgLocaliza': '/gestion_mercados_relevantes'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 56,
            'opcNombre': 'Gestión Rutas GNC',
            'opcIdepadre': 6,
            'opcDescripcion': 'Gestión Rutas GNC',
            'prgIderegistro': {
              'prgIderegistro': 57,
              'prgNombre': 'Gestión Rutas GNC',
              'prgLocaliza': '/gestion_rutas_gnc'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 58,
            'opcNombre': 'Consulta Rutas GNC',
            'opcIdepadre': 6,
            'opcDescripcion': 'Consulta Rutas GNC',
            'prgIderegistro': {
              'prgIderegistro': 59,
              'prgNombre': 'Consulta Rutas GNC',
              'prgLocaliza': '/consulta_rutas_gnc'
            },
            'opcTipo': 2
          }
        ]
      },
      {
        'opcIderegistro': 60,
        'opcIdepadre': 1,
        'opcNombre': 'Contratos',
        'opcDescripcion': 'Contratos',
        'prgIderegistro': null,
        'menuItem': [
          {
            'opcIderegistro': 61,
            'opcNombre': 'Crear Contratos',
            'opcIdepadre': 6,
            'opcDescripcion': 'Crear Contratos',
            'prgIderegistro': {
              'prgIderegistro': 62,
              'prgNombre': 'Crear Contratos',
              'prgLocaliza': '/gestion_contratos'
            },
            'opcTipo': 2
          },
          {
            'opcIderegistro': 63,
            'opcNombre': 'Consultar Contratos',
            'opcIdepadre': 6,
            'opcDescripcion': 'Consultar Contratos',
            'prgIderegistro': {
              'prgIderegistro': 64,
              'prgNombre': 'Consultar Contratos',
              'prgLocaliza': '/consulta_contratos'
            },
            'opcTipo': 2
          }
        ]
      }
    ]
  }
];

export default menuTemporal;
