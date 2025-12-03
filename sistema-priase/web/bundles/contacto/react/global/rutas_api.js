const RUTAS_API = {

  MENU: {
    CONSULTAR_MENU: 'global/menu',
  },

  GLOBAL: {
    CONSULTAR_FECHA_ACTUAL: 'global/fechasistema',
    SUBIR_ARCHIVOS: 'global/archivo/adjuntar',
  },

  GESTION_CONTACTOS: {
    CONSULTA_CONTACTOS: 'tercero/consultar',
    CONSULTA_SUSCRICIONES: 'suscripcion/vincular', 
    CONSULTA_SUSCRIPCION_CONTACTOS: 'tercero/consultarcontactos', 
    CONSULTA_TERCERO: 'tercero/consultarnuevocontacto',//SERVICIO PENDIENTE
    CONSULTA_SUSCRIPCIONES_VINCULADAS: 'suscripcion/consulta',
    CONSULTAR_MENU_TABS_SUSCRIPCION: 'unidad/pestanavinculosuscripcion',
    CONSULTAR_MENU_TABS: 'unidad/pestana',
    CONSULTAR_CAMPOS_TABS: 'unidad/infopestana',
    GUARDAR_CONTACTO: 'contacto/guardar',
    CREAR_CONTACTO: 'contacto/crear',
    CREAR_VINCULO_SUSCRIPCION: 'suscripcion/crearvinculo',//SERVICIO PENDIENTE
    DESVINCULAR: 'suscripcion/desvincular',
    CONSULTA_CONTACTO_INFORMACION: 'contacto/informacion',
    CONSULTA_CONTACTO_INFORMACION_SUSCRIPCION: 'contacto/infovinculosuscripcion',
    CARGAR_CONTACTOS: 'contacto/cargarcontactos'
  }
};

export default RUTAS_API;
