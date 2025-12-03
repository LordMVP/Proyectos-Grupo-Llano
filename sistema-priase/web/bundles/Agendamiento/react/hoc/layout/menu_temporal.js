const menuTemporal = [
    {
        opcIderegistro: 1,
        opcIdepadre: null,
        opcNombre: 'Agendamiento',
        opcDescripcion: 'Agendamiento',
        prgIderegistro: null,
        menuItem: [
            {
                opcIderegistro: 2,
                opcIdepadre: 1,
                opcNombre: 'Administración',
                opcDescripcion: 'Administración del módulo de Agendamiento',
                prgIderegistro: null,
                menuItem: [
                    {
                        opcIderegistro: 3,
                        opcNombre: 'Gestión Edición de Actividades',
                        opcIdepadre: 2,
                        opcDescripcion: 'Gestión Edición de Actividades',
                        prgIderegistro: {
                            prgIderegistro: 3,
                            prgNombre: 'Gestión de Edición de Actividades',
                            prgLocaliza: '/edicion_actividad',
                        },
                        opcTipo: 4,
                    },
                    {
                        opcIderegistro: 4,
                        opcNombre: 'Gestión Edición de Parámetros',
                        opcIdepadre: 2,
                        opcDescripcion: 'Gestión Edición de Parámetros',
                        prgIderegistro: {
                            prgIderegistro: 3,
                            prgNombre: 'Gestión Edición de Parámetros',
                            prgLocaliza: '/edicion_parametro',
                        },
                        opcTipo: 4,
                    },
                    {
                        opcIderegistro: 5,
                        opcNombre: 'Gestión Edición Reglas',
                        opcIdepadre: 2,
                        opcDescripcion: 'Gestión Edición Reglas',
                        prgIderegistro: {
                            prgIderegistro: 3,
                            prgNombre: 'Gestión Edición Reglas',
                            prgLocaliza: '/edicion_reglas',
                        },
                        opcTipo: 4,
                    },
                    {
                        opcIderegistro: 6,
                        opcNombre: 'Gestión Configuración Agendamiento',
                        opcIdepadre: 2,
                        opcDescripcion: 'Gestión Configuración Agendamiento',
                        prgIderegistro: {
                            prgIderegistro: 3,
                            prgNombre: 'Gestión Configuración Agendamiento',
                            prgLocaliza: '/configuracion_agendamiento',
                        },
                        opcTipo: 4,
                    },
                    {
                        opcIderegistro: 7,
                        opcNombre: 'Gestión Frecuencia de Agendamiento',
                        opcIdepadre: 2,
                        opcDescripcion: 'Gestión Frecuencia de Agendamiento',
                        prgIderegistro: {
                            prgIderegistro: 3,
                            prgNombre: 'Gestión Frecuencia de Agendamiento',
                            prgLocaliza: '/frecuencia_agendamiento',
                        },
                        opcTipo: 4,
                    },
                    {
                        opcIderegistro: 8,
                        opcNombre: 'Gestión Calendario Hábil',
                        opcIdepadre: 2,
                        opcDescripcion: 'Gestión Calendatio Hábil',
                        prgIderegistro: {
                            prgIderegistro: 3,
                            prgNombre: 'Gestión Frecuencia de Agendamiento',
                            prgLocaliza: '/calendario_habil',
                        },
                        opcTipo: 4,
                    },
                    {
                        opcIderegistro: 9,
                        opcNombre: 'Gestión Rutas Sectores',
                        opcIdepadre: 2,
                        opcDescripcion: 'Gestión Rutas Sectores',
                        prgIderegistro: {
                            prgIderegistro: 3,
                            prgNombre: 'Gestión Rutas Sectores',
                            prgLocaliza: '/rutas_sectores',
                        },
                        opcTipo: 4,
                    },
                    {
                        opcIderegistro: 10,
                        opcNombre: 'Gestión Rutas Municipios',
                        opcIdepadre: 2,
                        opcDescripcion: 'Gestión Rutas Municipios',
                        prgIderegistro: {
                            prgIderegistro: 3,
                            prgNombre: 'Gestión Rutas Municipios',
                            prgLocaliza: '/rutas_municipios',
                        },
                        opcTipo: 4,
                    },
                    {
                        opcIderegistro: 11,
                        opcNombre: 'Gestión Unidades Responsables',
                        opcIdepadre: 2,
                        opcDescripcion: 'Gestión Unidades Responsables',
                        prgIderegistro: {
                            prgIderegistro: 3,
                            prgNombre: 'Gestión Unidades Responsables',
                            prgLocaliza: '/unidades_responsables',
                        },
                        opcTipo: 4,
                    },
                    {
                        opcIderegistro: 12,
                        opcNombre: 'Gestión Solicitud Agendamiento',
                        opcIdepadre: 2,
                        opcDescripcion: 'Gestión Solicitud Agendamiento',
                        prgIderegistro: {
                            prgIderegistro: 3,
                            prgNombre: 'Gestión Solicitud Agendamiento',
                            prgLocaliza: '/solicitud_agendamiento',
                        },
                        opcTipo: 4,
                    },
                    {
                        opcIderegistro: 13,
                        opcNombre: 'Gestión Programación Manual',
                        opcIdepadre: 2,
                        opcDescripcion: 'Gestión Programación Manual',
                        prgIderegistro: {
                            prgIderegistro: 3,
                            prgNombre: 'Gestión Programación Manual',
                            prgLocaliza: '/programacion_manual',
                        },
                        opcTipo: 4,
                    },
                ],
            },
        ],
    },
]

export default menuTemporal
