import {
  RIndexVista,
  RConsultaContactos,
  RRegistroContacto,
  VistaNoPermitida,
  RCargarContactos,
} from '../vistas/index';

const RUTAS_VISTA = {
  RAIZ: { url: '/', componente: RIndexVista },
  VISTA_NO_PERMITIDA: { url: '/no_autorizado', componente: VistaNoPermitida },
  GESTION_CONTACTOS: { url: '/gestion_contactos', componente: RRegistroContacto },
  CARGAR_CONTACTOS: { url: '/cargar_plano_contactos', componente: RCargarContactos },
 };

export default RUTAS_VISTA;
