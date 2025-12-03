export default [{
	opcIderegistro: 1,
	opcIdepadre: null,
	opcNombre: 'Reial',
	opcDescripcion: 'Reial',
	prgIderegistro: null,
	menuItem: [
		{
			opcIderegistro: 2,
			opcIdepadre: 1,
			opcNombre: 'Administración',
			opcDescripcion: 'Administración del módulo de Reial',
			prgIderegistro: null,
			menuItem: [
				{
					opcIderegistro: 1,
					opcIdepadre: 2,
					opcNombre: '1.2 Carge etapas',
					opcDescripcion: 'Carge de información por etapas',
					prgIderegistro: null,
					menuItem: [
						{
							opcIderegistro: 1,
							opcNombre: 'Gestión Búsqueda de Servicios',
							opcIdepadre: 1,
							opcDescripcion: 'Gestión Búsqueda de Servicios',
							prgIderegistro: {
								prgIderegistro: 3,
								prgNombre: 'Gestión Búsqueda de Servicios',
								prgLocaliza: '/busqueda_servicios',
							},
							opcTipo: 2,
						},
					]
				},

				{
					opcIderegistro: 2,
					opcIdepadre: 2,
					opcNombre: '1.3 Registro proceso constructivo',
					opcDescripcion: 'Registro y Generación de información y reportes para el control y seguimiento del proceso constructivo',
					prgIderegistro: null,
					menuItem: [
						{
							opcIderegistro: 1,
							opcNombre: 'Gestión Consultar de Periodos',
							opcIdepadre: 2,
							opcDescripcion: 'Gestión Consultar de Periodos',
							prgIderegistro: {
								prgIderegistro: 3,
								prgNombre: 'Gestión Consulta de Periodos',
								prgLocaliza: '/consulta_periodos',
							},
							opcTipo: 2,
						},
					]
				},

				{
					opcIderegistro: 3,
					opcIdepadre: 2,
					opcNombre: '1.4 Preliquidacion y liquidacion de servicios',
					opcDescripcion: 'Preliquidacion y liquidacion de servicios',
					prgIderegistro: null,
					menuItem: [
						{
							opcIderegistro: 1,
							opcNombre: 'Gestión Preliquidación Facturación',
							opcIdepadre: 3,
							opcDescripcion: 'Gestión Preliquidación Facturación',
							prgIderegistro: {
								prgIderegistro: 3,
								prgNombre: 'Gestión Preliquidación Facturación',
								prgLocaliza: '/preliquidacion_facturacion',
							},
							opcTipo: 2,
						},
					]
				},

				{
					opcIderegistro: 4,
					opcIdepadre: 2,
					opcNombre: '3.2 Liquidación de Nomina al Destajo',
					opcDescripcion: 'Liquidación de Nomina al Destajo',
					prgIderegistro: null,
					menuItem: [
						{
							opcIderegistro: 1,
							opcNombre: 'Gestión Nomina al Destajo',
							opcIdepadre: 3,
							opcDescripcion: 'Gestión Nomina al Destajo',
							prgIderegistro: {
								prgIderegistro: 3,
								prgNombre: 'Gestión Nomina al Destajo',
								prgLocaliza: '/nomina_destajo',
							},
							opcTipo: 2,
						},
					]
				},

				{
					opcIderegistro: 5,
					opcIdepadre: 2,
					opcNombre: '2.1 Actualizaciones en cambios de medidor',
					opcDescripcion: 'Actualizaciones en cambios de medidor',
					prgIderegistro: null,
					menuItem: [
						{
							opcIderegistro: 1,
							opcNombre: 'Gestión Actualización Medidor',
							opcIdepadre: 4,
							opcDescripcion: 'Gestión Actualización Medidor',
							prgIderegistro: {
								prgIderegistro: 3,
								prgNombre: 'Gestión Actualización Medidor',
								prgLocaliza: '/actualizacion_medidor',
							},
							opcTipo: 2,
						},
					]
				},

				{
					opcIderegistro: 6,
					opcIdepadre: 2,
					opcNombre: '3.1 Parametrizacion General',
					opcDescripcion: 'Parametrizacion General',
					prgIderegistro: null,
					menuItem: [
						{
							opcIderegistro: 1,
							opcNombre: 'Gestión Listar Agendas',
							opcIdepadre: 5,
							opcDescripcion: 'Gestión Listar Agendas',
							prgIderegistro: {
								prgIderegistro: 3,
								prgNombre: 'Gestión Listar Agendas',
								prgLocaliza: '/listar_agendas',
							},
							opcTipo: 2,
						},
	
						{
							opcIderegistro: 2,
							opcNombre: 'Gestión Listar Agendas Servicios',
							opcIdepadre: 5,
							opcDescripcion: 'Gestión Listar Agendas Servicios',
							prgIderegistro: {
								prgIderegistro: 3,
								prgNombre: 'Gestión Listar Agendas Servicios',
								prgLocaliza: '/listar_agendas_servicios',
							},
							opcTipo: 2,
						},
	
						{
							opcIderegistro: 3,
							opcNombre: 'Gestión Listar Servicios',
							opcIdepadre: 5,
							opcDescripcion: 'Gestión Listar Servicios',
							prgIderegistro: {
								prgIderegistro: 3,
								prgNombre: 'Gestión Listar Servicios',
								prgLocaliza: '/listar_servicios',
							},
							opcTipo: 2,
						},

						{
							opcIderegistro: 4,
							opcNombre: 'Gestión Homologacion Agendas',
							opcIdepadre: 5,
							opcDescripcion: 'Gestión Homologacion Agendas',
							prgIderegistro: {
								prgIderegistro: 3,
								prgNombre: 'Gestión Homologacion Agendas',
								prgLocaliza: '/homologacion_agendas',
							},
							opcTipo: 2,
						},

						{
							opcIderegistro: 5,
							opcNombre: 'Gestión Actividades por Municipios',
							opcIdepadre: 5,
							opcDescripcion: 'Gestión Actividades por Municipios',
							prgIderegistro: {
								prgIderegistro: 3,
								prgNombre: 'Gestión Actividades por Municipios',
								prgLocaliza: '/actividades_municipios',
							},
							opcTipo: 2,
						},

						{
							opcIderegistro: 6,
							opcNombre: 'Gestión Parametrizacion Materiales',
							opcIdepadre: 5,
							opcDescripcion: 'Gestión Parametrizacion Materiales',
							prgIderegistro: {
								prgIderegistro: 3,
								prgNombre: 'Gestión Parametrizacion Materiales',
								prgLocaliza: '/parametrizacion_materiales',
							},
							opcTipo: 2,
						},

						{
							opcIderegistro: 7,
							opcNombre: 'Gestión Relación Conceptos',
							opcIdepadre: 5,
							opcDescripcion: 'Gestión Relación Conceptos',
							prgIderegistro: {
								prgIderegistro: 3,
								prgNombre: 'Gestión Relación Conceptos',
								prgLocaliza: '/relacion_conceptos',
							},
							opcTipo: 2,
						},

						{
							opcIderegistro: 8,
							opcNombre: 'Gestión Sucursales Municipios',
							opcIdepadre: 5,
							opcDescripcion: 'Gestión Sucursales Municipios',
							prgIderegistro: {
								prgIderegistro: 3,
								prgNombre: 'Gestión Sucursales Municipios',
								prgLocaliza: '/sucursales_municipios',
							},
							opcTipo: 2,
						},
					]
				},
			],
		},
	],
}]