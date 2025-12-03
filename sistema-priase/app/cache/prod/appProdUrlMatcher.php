<?php

use Symfony\Component\Routing\Exception\MethodNotAllowedException;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use Symfony\Component\Routing\RequestContext;

/**
 * appProdUrlMatcher
 *
 * This class has been auto-generated
 * by the Symfony Routing Component.
 */
class appProdUrlMatcher extends Symfony\Bundle\FrameworkBundle\Routing\RedirectableUrlMatcher
{
    /**
     * Constructor.
     */
    public function __construct(RequestContext $context)
    {
        $this->context = $context;
    }

    public function match($pathinfo)
    {
        $allow = array();
        $pathinfo = rawurldecode($pathinfo);

        if (0 === strpos($pathinfo, '/homafo')) {
            // homafo_homafo_api
            if (0 === strpos($pathinfo, '/homafo/api') && preg_match('#^/homafo/api/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'homafo_homafo_api')), array (  '_controller' => 'Homafo\\HomafoBundle\\Controller\\DefaultController::apiAction',));
            }

            // homafo_homafo_index
            if (preg_match('#^/homafo/(?P<ruta>.+)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'homafo_homafo_index')), array (  '_controller' => 'Homafo\\HomafoBundle\\Controller\\DefaultController::indexAction',));
            }

            // homafo_homafo_kio
            if (0 === strpos($pathinfo, '/homafo/kio') && preg_match('#^/homafo/kio/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'homafo_homafo_kio')), array (  '_controller' => 'Homafo\\HomafoBundle\\Controller\\DefaultController::kioAction',));
            }

            // homafo_homafo_todas
            if (rtrim($pathinfo, '/') === '/homafo') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'homafo_homafo_todas');
                }

                return array (  '_controller' => 'Homafo\\HomafoBundle\\Controller\\DefaultController::indexAction',  '_route' => 'homafo_homafo_todas',);
            }

        }

        if (0 === strpos($pathinfo, '/contacto')) {
            // contacto_contacto_api
            if (0 === strpos($pathinfo, '/contacto/api') && preg_match('#^/contacto/api/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'contacto_contacto_api')), array (  '_controller' => 'Contacto\\ContactoBundle\\Controller\\DefaultController::apiAction',));
            }

            // contacto_contacto_index
            if (preg_match('#^/contacto/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'contacto_contacto_index')), array (  '_controller' => 'Contacto\\ContactoBundle\\Controller\\DefaultController::indexAction',));
            }

            // contacto_contacto_todas
            if (rtrim($pathinfo, '/') === '/contacto') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'contacto_contacto_todas');
                }

                return array (  '_controller' => 'Contacto\\ContactoBundle\\Controller\\DefaultController::indexAction',  '_route' => 'contacto_contacto_todas',);
            }

        }

        if (0 === strpos($pathinfo, '/r')) {
            if (0 === strpos($pathinfo, '/rugii')) {
                // rugii_rugii_loginpage
                if (rtrim($pathinfo, '/') === '/rugii') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'rugii_rugii_loginpage');
                    }

                    return array (  '_controller' => 'Rugii\\RugiiBundle\\Controller\\DefaultController::indexAction',  '_route' => 'rugii_rugii_loginpage',);
                }

                // rugii_rugii_session
                if ($pathinfo === '/rugii/session') {
                    return array (  '_controller' => 'Rugii\\RugiiBundle\\Controller\\DefaultController::indexAction',  '_route' => 'rugii_rugii_session',);
                }

            }

            if (0 === strpos($pathinfo, '/reial')) {
                // reial_reial_homepage
                if (rtrim($pathinfo, '/') === '/reial') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'reial_reial_homepage');
                    }

                    return array (  '_controller' => 'Reial\\ReialBundle\\Controller\\DefaultController::indexAction',  '_route' => 'reial_reial_homepage',);
                }

                // reial_reial_ruta
                if (preg_match('#^/reial/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                    return $this->mergeDefaults(array_replace($matches, array('_route' => 'reial_reial_ruta')), array (  '_controller' => 'Reial\\ReialBundle\\Controller\\DefaultController::indexAction',));
                }

                if (0 === strpos($pathinfo, '/reial/api')) {
                    // reial_reial_api_ruta
                    if (preg_match('#^/reial/api/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                        return $this->mergeDefaults(array_replace($matches, array('_route' => 'reial_reial_api_ruta')), array (  '_controller' => 'Reial\\ReialBundle\\Controller\\DefaultController::apiAction',));
                    }

                    // reial_reial_api_ruta_v2
                    if (0 === strpos($pathinfo, '/reial/api/v2') && preg_match('#^/reial/api/v2/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                        return $this->mergeDefaults(array_replace($matches, array('_route' => 'reial_reial_api_ruta_v2')), array (  '_controller' => 'Reial\\ReialBundle\\Controller\\DefaultController::apiv2Action',));
                    }

                }

            }

        }

        if (0 === strpos($pathinfo, '/agendamiento')) {
            // agendamiento_agendamiento_homepage
            if (rtrim($pathinfo, '/') === '/agendamiento') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'agendamiento_agendamiento_homepage');
                }

                return array (  '_controller' => 'Agendamiento\\AgendamientoBundle\\Controller\\DefaultController::indexAction',  '_route' => 'agendamiento_agendamiento_homepage',);
            }

            // agendamiento_agendamiento_ruta
            if (preg_match('#^/agendamiento/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'agendamiento_agendamiento_ruta')), array (  '_controller' => 'Agendamiento\\AgendamientoBundle\\Controller\\DefaultController::indexAction',));
            }

            // agendamiento_agendamiento_api_ruta
            if (0 === strpos($pathinfo, '/agendamiento/api') && preg_match('#^/agendamiento/api/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'agendamiento_agendamiento_api_ruta')), array (  '_controller' => 'Agendamiento\\AgendamientoBundle\\Controller\\DefaultController::apiAction',));
            }

        }

        if (0 === strpos($pathinfo, '/nominaciones')) {
            // nominaciones_nominaciones_global_login
            if ($pathinfo === '/nominaciones/login') {
                return array (  '_controller' => 'Nominaciones\\NominacionesBundle\\Controller\\LoginController::indexAction',  '_route' => 'nominaciones_nominaciones_global_login',);
            }

            if (0 === strpos($pathinfo, '/nominaciones/api')) {
                // nominaciones_nominaciones_global
                if (0 === strpos($pathinfo, '/nominaciones/api/global') && preg_match('#^/nominaciones/api/global/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                    return $this->mergeDefaults(array_replace($matches, array('_route' => 'nominaciones_nominaciones_global')), array (  '_controller' => 'Nominaciones\\NominacionesBundle\\Controller\\LoginController::apiAction',));
                }

                // nominaciones_nominaciones_api
                if (preg_match('#^/nominaciones/api/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                    return $this->mergeDefaults(array_replace($matches, array('_route' => 'nominaciones_nominaciones_api')), array (  '_controller' => 'Nominaciones\\NominacionesBundle\\Controller\\DefaultController::apiAction',));
                }

            }

            // nominaciones_nominaciones_index
            if (preg_match('#^/nominaciones/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'nominaciones_nominaciones_index')), array (  '_controller' => 'Nominaciones\\NominacionesBundle\\Controller\\DefaultController::indexAction',));
            }

            // nominaciones_nominaciones_todas
            if (rtrim($pathinfo, '/') === '/nominaciones') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'nominaciones_nominaciones_todas');
                }

                return array (  '_controller' => 'Nominaciones\\NominacionesBundle\\Controller\\DefaultController::indexAction',  '_route' => 'nominaciones_nominaciones_todas',);
            }

        }

        if (0 === strpos($pathinfo, '/dorbi')) {
            // dorbi_dorbi_api
            if (0 === strpos($pathinfo, '/dorbi/api') && preg_match('#^/dorbi/api/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'dorbi_dorbi_api')), array (  '_controller' => 'Dorbi\\DorbiBundle\\Controller\\DefaultController::apiAction',));
            }

            // dorbi_dorbi_index
            if (preg_match('#^/dorbi/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'dorbi_dorbi_index')), array (  '_controller' => 'Dorbi\\DorbiBundle\\Controller\\DefaultController::indexAction',));
            }

            // dorbi_dorbi_todas
            if (rtrim($pathinfo, '/') === '/dorbi') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'dorbi_dorbi_todas');
                }

                return array (  '_controller' => 'Dorbi\\DorbiBundle\\Controller\\DefaultController::indexAction',  '_route' => 'dorbi_dorbi_todas',);
            }

        }

        if (0 === strpos($pathinfo, '/externo/financiacion')) {
            // externo_financiaciones_consultar_empresas
            if ($pathinfo === '/externo/financiacion/empresas/consultar') {
                return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\SeguridadController::consultarEmpresasAction',  '_route' => 'externo_financiaciones_consultar_empresas',);
            }

            if (0 === strpos($pathinfo, '/externo/financiacion/usuario')) {
                // externo_financiaciones_autenticar
                if ($pathinfo === '/externo/financiacion/usuario/autenticar') {
                    return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\SeguridadController::autenticarAction',  '_route' => 'externo_financiaciones_autenticar',);
                }

                // externo_comprobar_sesion
                if ($pathinfo === '/externo/financiacion/usuario/comprobarsesion') {
                    return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\GenericoController::comprobarSesionAction',  '_route' => 'externo_comprobar_sesion',);
                }

            }

            // externo_financiaciones_suscripcion_consultar
            if ($pathinfo === '/externo/financiacion/suscripcion/consultar') {
                return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\SuscripcionExternoController::consultarSuscripcionAction',  '_route' => 'externo_financiaciones_suscripcion_consultar',);
            }

            // externo_financiaciones_venta_empresas_consultar
            if ($pathinfo === '/externo/financiacion/info/empresas/consultar') {
                return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\VentasExternoController::consultarEmpresasAction',  '_route' => 'externo_financiaciones_venta_empresas_consultar',);
            }

            if (0 === strpos($pathinfo, '/externo/financiacion/venta')) {
                // externo_financiaciones_venta_firmas_funcionarios
                if ($pathinfo === '/externo/financiacion/venta/firma/funcionarios') {
                    return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\VentasExternoController::consultarFuncionarioFirmaAction',  '_route' => 'externo_financiaciones_venta_firmas_funcionarios',);
                }

                // externo_financiaciones_venta_tiposdocumentos
                if ($pathinfo === '/externo/financiacion/venta/tiposdocumentos/consultar') {
                    return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\VentasExternoController::consultarTiposDocumentosAction',  '_route' => 'externo_financiaciones_venta_tiposdocumentos',);
                }

                // externo_financiaciones_venta_documentos
                if ($pathinfo === '/externo/financiacion/venta/documentos/consultar') {
                    return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\VentasExternoController::consultarDocumentosAction',  '_route' => 'externo_financiaciones_venta_documentos',);
                }

                // externo_venta_adjuntar_archivo
                if ($pathinfo === '/externo/financiacion/venta/archivo/adjuntar') {
                    return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\VentasExternoController::adjuntarArchivoAction',  '_route' => 'externo_venta_adjuntar_archivo',);
                }

                // externo_financiaciones_venta_liquidaciones
                if ($pathinfo === '/externo/financiacion/venta/liquidaciones/consultar') {
                    return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\VentasExternoController::consultarLiquidacionesAction',  '_route' => 'externo_financiaciones_venta_liquidaciones',);
                }

                // externo_financiaciones_venta_conceptos
                if ($pathinfo === '/externo/financiacion/venta/conceptos/consultar') {
                    return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\VentasExternoController::consultarConceptosAction',  '_route' => 'externo_financiaciones_venta_conceptos',);
                }

                // externo_financiaciones_venta_liquidar
                if ($pathinfo === '/externo/financiacion/venta/liquidar') {
                    return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\VentasExternoController::liquidarAction',  '_route' => 'externo_financiaciones_venta_liquidar',);
                }

                // externo_financiaciones_venta_guardar
                if ($pathinfo === '/externo/financiacion/venta/guardar') {
                    return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\VentasExternoController::guardarAction',  '_route' => 'externo_financiaciones_venta_guardar',);
                }

                // externo_financiaciones_venta_consultar
                if ($pathinfo === '/externo/financiacion/venta/consultar') {
                    return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\VentasExternoController::consultarVentaAction',  '_route' => 'externo_financiaciones_venta_consultar',);
                }

                // externo_financiaciones_venta_consultar_detalle
                if ($pathinfo === '/externo/financiacion/venta/detalle') {
                    return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\VentasExternoController::consultarDetalleVentaAction',  '_route' => 'externo_financiaciones_venta_consultar_detalle',);
                }

                if (0 === strpos($pathinfo, '/externo/financiacion/venta/financiacion')) {
                    if (0 === strpos($pathinfo, '/externo/financiacion/venta/financiacion/c')) {
                        // externo_financiaciones_credito_liquidaciones
                        if ($pathinfo === '/externo/financiacion/venta/financiacion/credito/liquidaciones') {
                            return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\FinanciacionExternoController::consultarLiquidacionesCreditoAction',  '_route' => 'externo_financiaciones_credito_liquidaciones',);
                        }

                        if (0 === strpos($pathinfo, '/externo/financiacion/venta/financiacion/califica')) {
                            // externo_financiaciones_credito_calificacion_variables
                            if ($pathinfo === '/externo/financiacion/venta/financiacion/calificacion/variables') {
                                return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\FinanciacionExternoController::consultarVariablesCalificacionAction',  '_route' => 'externo_financiaciones_credito_calificacion_variables',);
                            }

                            // externo_financiaciones_credito_calificacion_calificar
                            if ($pathinfo === '/externo/financiacion/venta/financiacion/calificar') {
                                return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\FinanciacionExternoController::calificarAction',  '_route' => 'externo_financiaciones_credito_calificacion_calificar',);
                            }

                        }

                    }

                    if (0 === strpos($pathinfo, '/externo/financiacion/venta/financiacion/tercero/c')) {
                        if (0 === strpos($pathinfo, '/externo/financiacion/venta/financiacion/tercero/consultar')) {
                            // externo_financiaciones_solicitante_tercero
                            if ($pathinfo === '/externo/financiacion/venta/financiacion/tercero/consultar') {
                                return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\FinanciacionExternoController::consultarTerceroAction',  '_route' => 'externo_financiaciones_solicitante_tercero',);
                            }

                            // externo_financiaciones_solicitante_tercero_por_documento
                            if ($pathinfo === '/externo/financiacion/venta/financiacion/tercero/consultarpordocumento') {
                                return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\FinanciacionExternoController::consultarTerceroPorDocumentoAction',  '_route' => 'externo_financiaciones_solicitante_tercero_por_documento',);
                            }

                        }

                        // externo_financiaciones_solicitante_tercero_ciudadesexpediciondocumento
                        if ($pathinfo === '/externo/financiacion/venta/financiacion/tercero/ciudadesexpediciondocumento') {
                            return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\FinanciacionExternoController::consultarCiudadesExpedicionDocumentoAction',  '_route' => 'externo_financiaciones_solicitante_tercero_ciudadesexpediciondocumento',);
                        }

                        if (0 === strpos($pathinfo, '/externo/financiacion/venta/financiacion/tercero/consultartipos')) {
                            // externo_financiaciones_solicitante_tercero_tiposdocumento
                            if ($pathinfo === '/externo/financiacion/venta/financiacion/tercero/consultartiposdocumento') {
                                return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\FinanciacionExternoController::consultarTiposDocumentoAction',  '_route' => 'externo_financiaciones_solicitante_tercero_tiposdocumento',);
                            }

                            // externo_financiaciones_solicitante_tercero_tipostercero
                            if ($pathinfo === '/externo/financiacion/venta/financiacion/tercero/consultartipostercero') {
                                return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\FinanciacionExternoController::consultarTiposTerceroAction',  '_route' => 'externo_financiaciones_solicitante_tercero_tipostercero',);
                            }

                        }

                    }

                    if (0 === strpos($pathinfo, '/externo/financiacion/venta/financiacion/contrato')) {
                        if (0 === strpos($pathinfo, '/externo/financiacion/venta/financiacion/contrato/generar')) {
                            // externo_financiaciones_contrato
                            if ($pathinfo === '/externo/financiacion/venta/financiacion/contrato/generar') {
                                return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\ContratoExternoController::indexAction',  '_route' => 'externo_financiaciones_contrato',);
                            }

                            // externo_financiaciones_contrato_generar_contrato
                            if ($pathinfo === '/externo/financiacion/venta/financiacion/contrato/generarcontrato') {
                                return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\ContratoExternoController::generarContratoAction',  '_route' => 'externo_financiaciones_contrato_generar_contrato',);
                            }

                        }

                        if (0 === strpos($pathinfo, '/externo/financiacion/venta/financiacion/contrato/consultar')) {
                            // externo_financiaciones_contrato_consultar_contrato
                            if ($pathinfo === '/externo/financiacion/venta/financiacion/contrato/consultarcontrato') {
                                return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\ContratoExternoController::consultarContratoAction',  '_route' => 'externo_financiaciones_contrato_consultar_contrato',);
                            }

                            // externo_financiaciones_consultarempresas
                            if ($pathinfo === '/externo/financiacion/venta/financiacion/contrato/consultarEmpresas') {
                                return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\ContratoExternoController::consultarEmpresasAction',  '_route' => 'externo_financiaciones_consultarempresas',);
                            }

                        }

                        // externo_financiaciones_contrato_generar_reporte_contrato
                        if ($pathinfo === '/externo/financiacion/venta/financiacion/contrato/generarreportecontrato') {
                            return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\ContratoExternoController::generarReporteContratoAction',  '_route' => 'externo_financiaciones_contrato_generar_reporte_contrato',);
                        }

                    }

                    if (0 === strpos($pathinfo, '/externo/financiacion/venta/financiacion/reporteventasexterno')) {
                        // externo_financiaciones_reporteventasexterno
                        if ($pathinfo === '/externo/financiacion/venta/financiacion/reporteventasexterno/generar') {
                            return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\ReporteVentasExternoController::indexAction',  '_route' => 'externo_financiaciones_reporteventasexterno',);
                        }

                        // externo_financiaciones_reporteventasexterno_procesar
                        if ($pathinfo === '/externo/financiacion/venta/financiacion/reporteventasexterno/procesar') {
                            return array (  '_controller' => 'Externo\\FinanciacionesBundle\\Controller\\ReporteVentasExternoController::procesarAction',  '_route' => 'externo_financiaciones_reporteventasexterno_procesar',);
                        }

                    }

                }

            }

        }

        if (0 === strpos($pathinfo, '/administracion')) {
            // administracion_administracion_homepage
            if (0 === strpos($pathinfo, '/administracion/hello') && preg_match('#^/administracion/hello/(?P<name>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'administracion_administracion_homepage')), array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\DefaultController::indexAction',));
            }

            if (0 === strpos($pathinfo, '/administracion/terceros')) {
                if (0 === strpos($pathinfo, '/administracion/terceros/cambio_propiedad')) {
                    // administracion_terceros
                    if (rtrim($pathinfo, '/') === '/administracion/terceros/cambio_propiedad') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'administracion_terceros');
                        }

                        return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\CambioPropiedadTerceroController::indexAction',  '_route' => 'administracion_terceros',);
                    }

                    // administracion_terceros_autocompletar_tercero
                    if (rtrim($pathinfo, '/') === '/administracion/terceros/cambio_propiedad/autocompletar_tercero') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'administracion_terceros_autocompletar_tercero');
                        }

                        return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\CambioPropiedadTerceroController::AutocompletarTerceroAction',  '_route' => 'administracion_terceros_autocompletar_tercero',);
                    }

                    if (0 === strpos($pathinfo, '/administracion/terceros/cambio_propiedad/consultar_')) {
                        // administracion_terceros_consultar_terceropropiedad
                        if (rtrim($pathinfo, '/') === '/administracion/terceros/cambio_propiedad/consultar_terceropropiedad') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'administracion_terceros_consultar_terceropropiedad');
                            }

                            return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\CambioPropiedadTerceroController::consultarTerceropropiedadAction',  '_route' => 'administracion_terceros_consultar_terceropropiedad',);
                        }

                        // administracion_terceros_consultar_propiedad
                        if (rtrim($pathinfo, '/') === '/administracion/terceros/cambio_propiedad/consultar_propiedad') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'administracion_terceros_consultar_propiedad');
                            }

                            return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\CambioPropiedadTerceroController::consultarPropiedadAction',  '_route' => 'administracion_terceros_consultar_propiedad',);
                        }

                    }

                    // administracion_terceros_grabar_propiedad
                    if (rtrim($pathinfo, '/') === '/administracion/terceros/cambio_propiedad/grabar_propiedad') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'administracion_terceros_grabar_propiedad');
                        }

                        return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\CambioPropiedadTerceroController::grabarAction',  '_route' => 'administracion_terceros_grabar_propiedad',);
                    }

                }

                if (0 === strpos($pathinfo, '/administracion/terceros/eliminar_propiedad')) {
                    // administracion_terceros_eliminar_propiedad
                    if (rtrim($pathinfo, '/') === '/administracion/terceros/eliminar_propiedad') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'administracion_terceros_eliminar_propiedad');
                        }

                        return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\EliminarPropiedadTerceroController::indexAction',  '_route' => 'administracion_terceros_eliminar_propiedad',);
                    }

                    if (0 === strpos($pathinfo, '/administracion/terceros/eliminar_propiedad/consultar_')) {
                        // administracion_terceros_eliminar_propiedad_consultar_terceropropiedad
                        if (rtrim($pathinfo, '/') === '/administracion/terceros/eliminar_propiedad/consultar_terceropropiedad') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'administracion_terceros_eliminar_propiedad_consultar_terceropropiedad');
                            }

                            return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\EliminarPropiedadTerceroController::consultarTerceropropiedadAction',  '_route' => 'administracion_terceros_eliminar_propiedad_consultar_terceropropiedad',);
                        }

                        // administracion_terceros_eliminar_propiedad_consultar_propiedad
                        if (rtrim($pathinfo, '/') === '/administracion/terceros/eliminar_propiedad/consultar_propiedad') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'administracion_terceros_eliminar_propiedad_consultar_propiedad');
                            }

                            return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\EliminarPropiedadTerceroController::consultarPropiedadAction',  '_route' => 'administracion_terceros_eliminar_propiedad_consultar_propiedad',);
                        }

                    }

                    // administracion_terceros_eliminar_propiedad_grabar_propiedad
                    if (rtrim($pathinfo, '/') === '/administracion/terceros/eliminar_propiedad/grabar_propiedad') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'administracion_terceros_eliminar_propiedad_grabar_propiedad');
                        }

                        return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\EliminarPropiedadTerceroController::grabarAction',  '_route' => 'administracion_terceros_eliminar_propiedad_grabar_propiedad',);
                    }

                }

            }

            if (0 === strpos($pathinfo, '/administracion/parametrizacion')) {
                // administracion_usuarios
                if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/registro_usuarios') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'administracion_usuarios');
                    }

                    return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\administracionRegistroUsuariosController::indexAction',  '_route' => 'administracion_usuarios',);
                }

                // administracion_consultar_usuario
                if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/consulta_usuario') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'administracion_consultar_usuario');
                    }

                    return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\administracionRegistroUsuariosController::consultarUsuarioAction',  '_route' => 'administracion_consultar_usuario',);
                }

                // administracion_registrar_perfilAutoriza
                if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/registrar_perfilAutoriza') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'administracion_registrar_perfilAutoriza');
                    }

                    return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\administracionRegistroUsuariosController::insertaPerfilEmpresaAction',  '_route' => 'administracion_registrar_perfilAutoriza',);
                }

                if (0 === strpos($pathinfo, '/administracion/parametrizacion/pro')) {
                    if (0 === strpos($pathinfo, '/administracion/parametrizacion/programa_usuarioAsignar')) {
                        // administracion_programa_usuarioAsignar
                        if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/programa_usuarioAsignar') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'administracion_programa_usuarioAsignar');
                            }

                            return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\administracionRegistroUsuariosController::buscaProgramasUsuarioAsignarAction',  '_route' => 'administracion_programa_usuarioAsignar',);
                        }

                        // administracion_programa_usuarioAsignarProyecto
                        if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/programa_usuarioAsignarProyecto') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'administracion_programa_usuarioAsignarProyecto');
                            }

                            return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\administracionRegistroUsuariosController::buscaProgramasUsuarioAsignarProyectoAction',  '_route' => 'administracion_programa_usuarioAsignarProyecto',);
                        }

                    }

                    // administracion_proyecto_usuarioPrograma
                    if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/proyecto_usuarioPrograma') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'administracion_proyecto_usuarioPrograma');
                        }

                        return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\administracionRegistroUsuariosController::buscaProyectoUsuarioProgramaAction',  '_route' => 'administracion_proyecto_usuarioPrograma',);
                    }

                }

                // administracion_estructura_usuarioLogin
                if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/estructura_usuarioLogin') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'administracion_estructura_usuarioLogin');
                    }

                    return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\administracionRegistroUsuariosController::buscaEstructuraUsuarioLoginAction',  '_route' => 'administracion_estructura_usuarioLogin',);
                }

                if (0 === strpos($pathinfo, '/administracion/parametrizacion/busca_')) {
                    // administracion_busca_unidadesUsuario
                    if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/busca_unidadesUsuario') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'administracion_busca_unidadesUsuario');
                        }

                        return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\administracionRegistroUsuariosController::buscaUnidadesUsuarioxProgramaEstructuraAction',  '_route' => 'administracion_busca_unidadesUsuario',);
                    }

                    // administracion_busca_medios_pagos
                    if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/busca_mediospagos') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'administracion_busca_medios_pagos');
                        }

                        return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\administracionRegistroUsuariosController::buscaMediosPagosAction',  '_route' => 'administracion_busca_medios_pagos',);
                    }

                    // administracion_busca_rutas
                    if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/busca_rutas') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'administracion_busca_rutas');
                        }

                        return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\administracionRegistroUsuariosController::buscaRutasAction',  '_route' => 'administracion_busca_rutas',);
                    }

                }

                // administracion_validacion_login
                if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/validacion_login') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'administracion_validacion_login');
                    }

                    return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\administracionRegistroUsuariosController::validacionLoginAction',  '_route' => 'administracion_validacion_login',);
                }

                // administracion_grabar_permisoUsuario
                if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/grabar_permisoUsuario') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'administracion_grabar_permisoUsuario');
                    }

                    return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\administracionRegistroUsuariosController::grabarPermisoUsuarioAction',  '_route' => 'administracion_grabar_permisoUsuario',);
                }

                // administracion_busca_allunidades
                if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/busca_allUnidades') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'administracion_busca_allunidades');
                    }

                    return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\administracionRegistroUsuariosController::buscaAllUnidadesAction',  '_route' => 'administracion_busca_allunidades',);
                }

                if (0 === strpos($pathinfo, '/administracion/parametrizacion/g')) {
                    // administracion_get_usuarioall
                    if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/get_usuarioall') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'administracion_get_usuarioall');
                        }

                        return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\administracionRegistroUsuariosController::getUsuariosAllAction',  '_route' => 'administracion_get_usuarioall',);
                    }

                    // administracion_grabar_permisoUsuarioCompleto
                    if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/grabar_permisoUsuarioCompleto') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'administracion_grabar_permisoUsuarioCompleto');
                        }

                        return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\administracionRegistroUsuariosController::grabarPermisosUsuariosCompletoAction',  '_route' => 'administracion_grabar_permisoUsuarioCompleto',);
                    }

                }

                // autorizacion_programa_usuarios
                if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/autoriza_programaUsuarios') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'autorizacion_programa_usuarios');
                    }

                    return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\RegistroProgramasUsuariosController::indexAction',  '_route' => 'autorizacion_programa_usuarios',);
                }

                // autorizacion_programa_usuarios_busca_menu
                if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/busca_menu') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'autorizacion_programa_usuarios_busca_menu');
                    }

                    return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\RegistroProgramasUsuariosController::getMenuAction',  '_route' => 'autorizacion_programa_usuarios_busca_menu',);
                }

                // autorizacion_programa_usuarios_opciones_menu
                if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/opciones_menu') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'autorizacion_programa_usuarios_opciones_menu');
                    }

                    return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\RegistroProgramasUsuariosController::getOpcionesMenuAction',  '_route' => 'autorizacion_programa_usuarios_opciones_menu',);
                }

                if (0 === strpos($pathinfo, '/administracion/parametrizacion/busca_')) {
                    // autorizacion_programa_usuarios_busca_programasUsuarios
                    if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/busca_programasUsuarios') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'autorizacion_programa_usuarios_busca_programasUsuarios');
                        }

                        return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\RegistroProgramasUsuariosController::buscaProgramasUsuariosAction',  '_route' => 'autorizacion_programa_usuarios_busca_programasUsuarios',);
                    }

                    // autorizacion_programa_usuarios_busca_todosprogramasUsuarios
                    if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/busca_todosprogramasUsuarios') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'autorizacion_programa_usuarios_busca_todosprogramasUsuarios');
                        }

                        return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\RegistroProgramasUsuariosController::buscaTodosprogramasUsuariosAction',  '_route' => 'autorizacion_programa_usuarios_busca_todosprogramasUsuarios',);
                    }

                }

                // autorizacion_programa_usuarios_grabar_permisoUsuarios
                if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/grabar_permisoProgramaUsuario') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'autorizacion_programa_usuarios_grabar_permisoUsuarios');
                    }

                    return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\RegistroProgramasUsuariosController::grabarPermisoUsuarioAction',  '_route' => 'autorizacion_programa_usuarios_grabar_permisoUsuarios',);
                }

                // autorizacion_programa_usuarios_actualiza_permisoProgramaUsuario
                if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/actualiza_permisoProgramaUsuario') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'autorizacion_programa_usuarios_actualiza_permisoProgramaUsuario');
                    }

                    return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\RegistroProgramasUsuariosController::actualizaPermisoProgramaUsuarioAction',  '_route' => 'autorizacion_programa_usuarios_actualiza_permisoProgramaUsuario',);
                }

                // autorizacion_programa_usuarios_busca_perfiles
                if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/busca_perfiles') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'autorizacion_programa_usuarios_busca_perfiles');
                    }

                    return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\RegistroProgramasUsuariosController::buscaPerfilesAction',  '_route' => 'autorizacion_programa_usuarios_busca_perfiles',);
                }

                // autorizacion_programa_usuarios_guarda_NuevoPerfil
                if (rtrim($pathinfo, '/') === '/administracion/parametrizacion/guarda_NuevoPerfil') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'autorizacion_programa_usuarios_guarda_NuevoPerfil');
                    }

                    return array (  '_controller' => 'Administracion\\AdministracionBundle\\Controller\\RegistroProgramasUsuariosController::guardaNuevoPerfilAction',  '_route' => 'autorizacion_programa_usuarios_guarda_NuevoPerfil',);
                }

            }

        }

        if (0 === strpos($pathinfo, '/libranza')) {
            // libranza_homepage
            if (0 === strpos($pathinfo, '/libranza/hello') && preg_match('#^/libranza/hello/(?P<name>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'libranza_homepage')), array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\DefaultController::indexAction',));
            }

            if (0 === strpos($pathinfo, '/libranza/credito')) {
                // libranza_credito
                if (rtrim($pathinfo, '/') === '/libranza/credito/registro') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'libranza_credito');
                    }

                    return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\RegistroCreditoController::indexAction',  '_route' => 'libranza_credito',);
                }

                // libranza_credito_barrios
                if (rtrim($pathinfo, '/') === '/libranza/credito/barrios') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'libranza_credito_barrios');
                    }

                    return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\RegistroCreditoController::obtenerBarriosAction',  '_route' => 'libranza_credito_barrios',);
                }

                // libranza_credito_departamentos
                if (rtrim($pathinfo, '/') === '/libranza/credito/departamentos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'libranza_credito_departamentos');
                    }

                    return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\RegistroCreditoController::obtenerDepartamentosAction',  '_route' => 'libranza_credito_departamentos',);
                }

                // libranza_credito_ciudades
                if (rtrim($pathinfo, '/') === '/libranza/credito/ciudades') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'libranza_credito_ciudades');
                    }

                    return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\RegistroCreditoController::obtenerCiudadesAction',  '_route' => 'libranza_credito_ciudades',);
                }

                // libranza_credito_municipios
                if (rtrim($pathinfo, '/') === '/libranza/credito/municipios') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'libranza_credito_municipios');
                    }

                    return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\RegistroCreditoController::obtenermunicipiosAction',  '_route' => 'libranza_credito_municipios',);
                }

                // libranza_credito_informacion_carga
                if (rtrim($pathinfo, '/') === '/libranza/credito/informacion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'libranza_credito_informacion_carga');
                    }

                    return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\RegistroCreditoController::obtenerInformacionAction',  '_route' => 'libranza_credito_informacion_carga',);
                }

                // libranza_credito_consultar_nombres
                if (rtrim($pathinfo, '/') === '/libranza/credito/terceros') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'libranza_credito_consultar_nombres');
                    }

                    return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\RegistroCreditoController::consultarTercerosAction',  '_route' => 'libranza_credito_consultar_nombres',);
                }

                if (0 === strpos($pathinfo, '/libranza/credito/registro')) {
                    // libranza_credito_insertar
                    if (rtrim($pathinfo, '/') === '/libranza/credito/registro/insertar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_insertar');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\RegistroCreditoController::registrarCreditoAction',  '_route' => 'libranza_credito_insertar',);
                    }

                    // libranza_credito_actualizar
                    if (rtrim($pathinfo, '/') === '/libranza/credito/registro/actualizar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_actualizar');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\RegistroCreditoController::actualizarCreditoAction',  '_route' => 'libranza_credito_actualizar',);
                    }

                    // libranza_credito_consultar
                    if (rtrim($pathinfo, '/') === '/libranza/credito/registro/consultar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_consultar');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ValidarCreditoController::consultarCreditoAction',  '_route' => 'libranza_credito_consultar',);
                    }

                    // libranza_credito_adjuntar_credito
                    if (rtrim($pathinfo, '/') === '/libranza/credito/registro/adjuntar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_adjuntar_credito');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\RegistroCreditoController::subirAdjuntoAction',  '_route' => 'libranza_credito_adjuntar_credito',);
                    }

                    // libranza_credito_eliminar_archivo
                    if (rtrim($pathinfo, '/') === '/libranza/credito/registro/eliminaradjunto') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_eliminar_archivo');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\RegistroCreditoController::eliminarAdjuntoAction',  '_route' => 'libranza_credito_eliminar_archivo',);
                    }

                }

                if (0 === strpos($pathinfo, '/libranza/credito/exportar')) {
                    // libranza_credito_consultar_cargar_datos
                    if (rtrim($pathinfo, '/') === '/libranza/credito/exportar/cargardatos') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_consultar_cargar_datos');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ExportarFormatoController::cargarSesionDatosAction',  '_route' => 'libranza_credito_consultar_cargar_datos',);
                    }

                    // libranza_credito_consultar_exportar
                    if (rtrim($pathinfo, '/') === '/libranza/credito/exportar/exportarDatos') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_consultar_exportar');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ExportarFormatoController::indexAction',  '_route' => 'libranza_credito_consultar_exportar',);
                    }

                }

                if (0 === strpos($pathinfo, '/libranza/credito/aprobar_rechazar')) {
                    // libranza_credito_aprobar
                    if (rtrim($pathinfo, '/') === '/libranza/credito/aprobar_rechazar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_aprobar');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\AprobarRechazarCreditoController::indexAction',  '_route' => 'libranza_credito_aprobar',);
                    }

                    // libranza_credito_aprobar_scoring
                    if (rtrim($pathinfo, '/') === '/libranza/credito/aprobar_rechazar/calificacion') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_aprobar_scoring');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\AprobarRechazarCreditoController::ObtenerCalificacionParametrizadaAction',  '_route' => 'libranza_credito_aprobar_scoring',);
                    }

                }

                // libranza_credito_validar
                if (rtrim($pathinfo, '/') === '/libranza/credito/validar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'libranza_credito_validar');
                    }

                    return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ValidarCreditoController::indexAction',  '_route' => 'libranza_credito_validar',);
                }

                // libranza_credito_aprobar_aprobar
                if (rtrim($pathinfo, '/') === '/libranza/credito/aprobar_rechazar/aprobarsolicitud') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'libranza_credito_aprobar_aprobar');
                    }

                    return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\AprobarRechazarCreditoController::AprobadoRechazarAction',  '_route' => 'libranza_credito_aprobar_aprobar',);
                }

                // libranza_credito_validar_credito
                if (rtrim($pathinfo, '/') === '/libranza/credito/validar/validarcredito') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'libranza_credito_validar_credito');
                    }

                    return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ValidarCreditoController::evaluarCreditoAction',  '_route' => 'libranza_credito_validar_credito',);
                }

                // libranza_credito_desembolsar
                if (rtrim($pathinfo, '/') === '/libranza/credito/desembolsar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'libranza_credito_desembolsar');
                    }

                    return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\CreditosAprobadosController::indexAction',  '_route' => 'libranza_credito_desembolsar',);
                }

                if (0 === strpos($pathinfo, '/libranza/credito/calificar')) {
                    // libranza_credito_calificar
                    if (rtrim($pathinfo, '/') === '/libranza/credito/calificar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_calificar');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ScoringCreditoController::indexAction',  '_route' => 'libranza_credito_calificar',);
                    }

                    // libranza_credito_calificar_actualizar
                    if (rtrim($pathinfo, '/') === '/libranza/credito/calificar/actualizarinformacion') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_calificar_actualizar');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ScoringCreditoController::ActualizarInformacionAction',  '_route' => 'libranza_credito_calificar_actualizar',);
                    }

                    // libranza_credito_calificar_validar_calificacion
                    if (rtrim($pathinfo, '/') === '/libranza/credito/calificar/validarcalificacion') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_calificar_validar_calificacion');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ScoringCreditoController::ValidarCreditoAction',  '_route' => 'libranza_credito_calificar_validar_calificacion',);
                    }

                    // libranza_credito_calificar_calificacion
                    if (rtrim($pathinfo, '/') === '/libranza/credito/calificar/obtener/calificacion') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_calificar_calificacion');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ScoringCreditoController::obtenerCalificacionAction',  '_route' => 'libranza_credito_calificar_calificacion',);
                    }

                    // libranza_credito_calificar_registrar_calificacion
                    if (rtrim($pathinfo, '/') === '/libranza/credito/calificar/registrar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_calificar_registrar_calificacion');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ScoringCreditoController::registrarCalificacionAction',  '_route' => 'libranza_credito_calificar_registrar_calificacion',);
                    }

                    // libranza_credito_imprimir_documentos
                    if (rtrim($pathinfo, '/') === '/libranza/credito/calificar/imprimir') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_imprimir_documentos');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ScoringCreditoController::imprimirDocumentosAction',  '_route' => 'libranza_credito_imprimir_documentos',);
                    }

                }

                if (0 === strpos($pathinfo, '/libranza/credito/parametrizacion')) {
                    // libranza_credito_parametrizacion_scoring
                    if (rtrim($pathinfo, '/') === '/libranza/credito/parametrizacion') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_parametrizacion_scoring');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ParametrizacionScoringController::indexAction',  '_route' => 'libranza_credito_parametrizacion_scoring',);
                    }

                    if (0 === strpos($pathinfo, '/libranza/credito/parametrizacion/f')) {
                        // libranza_credito_parametrizacion_scoring_funciones
                        if (rtrim($pathinfo, '/') === '/libranza/credito/parametrizacion/funciones_variables') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'libranza_credito_parametrizacion_scoring_funciones');
                            }

                            return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ParametrizacionScoringController::obtenerFuncionesVariableAction',  '_route' => 'libranza_credito_parametrizacion_scoring_funciones',);
                        }

                        // libranza_credito_parametrizacion_scoring_formularios
                        if (rtrim($pathinfo, '/') === '/libranza/credito/parametrizacion/formularios') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'libranza_credito_parametrizacion_scoring_formularios');
                            }

                            return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ParametrizacionScoringController::obtenerFormulariosAction',  '_route' => 'libranza_credito_parametrizacion_scoring_formularios',);
                        }

                    }

                }

                // libranza_credito_validar_calificacion
                if (rtrim($pathinfo, '/') === '/libranza/credito/calificar/validar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'libranza_credito_validar_calificacion');
                    }

                    return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ScoringCreditoController::ValidarCalificacionAction',  '_route' => 'libranza_credito_validar_calificacion',);
                }

                if (0 === strpos($pathinfo, '/libranza/credito/parametrizacion')) {
                    // libranza_credito_parametrizacion_scoring_variables
                    if (rtrim($pathinfo, '/') === '/libranza/credito/parametrizacion/variables') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_parametrizacion_scoring_variables');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ParametrizacionScoringController::obtenerVariablesAction',  '_route' => 'libranza_credito_parametrizacion_scoring_variables',);
                    }

                    if (0 === strpos($pathinfo, '/libranza/credito/parametrizacion/formulario/crear')) {
                        // libranza_credito_parametrizacion_scoring_formulario_insertar
                        if (rtrim($pathinfo, '/') === '/libranza/credito/parametrizacion/formulario/crear') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'libranza_credito_parametrizacion_scoring_formulario_insertar');
                            }

                            return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ParametrizacionScoringController::crearFormularioAction',  '_route' => 'libranza_credito_parametrizacion_scoring_formulario_insertar',);
                        }

                        // libranza_credito_parametrizacion_scoring_crear_parametrizacion
                        if (rtrim($pathinfo, '/') === '/libranza/credito/parametrizacion/formulario/crear/parametrizacion') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'libranza_credito_parametrizacion_scoring_crear_parametrizacion');
                            }

                            return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ParametrizacionScoringController::crearParametrizacionAction',  '_route' => 'libranza_credito_parametrizacion_scoring_crear_parametrizacion',);
                        }

                    }

                }

                // libranza_credito_consultar_aprobados
                if (rtrim($pathinfo, '/') === '/libranza/credito/registro/consultar/aprobados') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'libranza_credito_consultar_aprobados');
                    }

                    return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\RegistroCreditoController::consultarCreditoAprobadosAction',  '_route' => 'libranza_credito_consultar_aprobados',);
                }

                if (0 === strpos($pathinfo, '/libranza/credito/desembolsar')) {
                    // libranza_credito_desembolsado_credito_obtener
                    if (rtrim($pathinfo, '/') === '/libranza/credito/desembolsar/obtener') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_desembolsado_credito_obtener');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\CreditosAprobadosController::ObtenerCreditosAprobadosAction',  '_route' => 'libranza_credito_desembolsado_credito_obtener',);
                    }

                    if (0 === strpos($pathinfo, '/libranza/credito/desembolsar/aprobar')) {
                        // libranza_credito_desembolsado_credito_aprobado
                        if (rtrim($pathinfo, '/') === '/libranza/credito/desembolsar/aprobar') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'libranza_credito_desembolsado_credito_aprobado');
                            }

                            return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\CreditosAprobadosController::AprobarDesembolsoAction',  '_route' => 'libranza_credito_desembolsado_credito_aprobado',);
                        }

                        // libranza_credito_desembolsado_credito_sin_desembolsar
                        if (rtrim($pathinfo, '/') === '/libranza/credito/desembolsar/aprobar_sin_desembolsar') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'libranza_credito_desembolsado_credito_sin_desembolsar');
                            }

                            return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\CreditosAprobadosController::aprobarSinDesembolsarCreditoAction',  '_route' => 'libranza_credito_desembolsado_credito_sin_desembolsar',);
                        }

                    }

                }

                if (0 === strpos($pathinfo, '/libranza/credito/resumen')) {
                    // libranza_credito_resumen
                    if (rtrim($pathinfo, '/') === '/libranza/credito/resumen') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_resumen');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ResumenCreditoController::IndexAction',  '_route' => 'libranza_credito_resumen',);
                    }

                    // libranza_credito_resumen_etapas
                    if (rtrim($pathinfo, '/') === '/libranza/credito/resumen/etapas') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_resumen_etapas');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ResumenCreditoController::obtenerEtapasCreditoAction',  '_route' => 'libranza_credito_resumen_etapas',);
                    }

                    // libranza_credito_resumen_creditos
                    if (rtrim($pathinfo, '/') === '/libranza/credito/resumen/creditos') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_resumen_creditos');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ResumenCreditoController::obtenerCreditosAction',  '_route' => 'libranza_credito_resumen_creditos',);
                    }

                    // libranza_credito_resumen_informacion
                    if (rtrim($pathinfo, '/') === '/libranza/credito/resumen/informacion') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_resumen_informacion');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ResumenCreditoController::obtenerInformacionAction',  '_route' => 'libranza_credito_resumen_informacion',);
                    }

                    // libranza_credito_resumen_comentarios
                    if (rtrim($pathinfo, '/') === '/libranza/credito/resumen/comentarios') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_resumen_comentarios');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ResumenCreditoController::obtenerComentariosAction',  '_route' => 'libranza_credito_resumen_comentarios',);
                    }

                }

                // libranza_credito_resumen_detalles
                if (rtrim($pathinfo, '/') === '/libranza/credito/detalles') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'libranza_credito_resumen_detalles');
                    }

                    return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\ResumenCreditoController::renderDetallesAction',  '_route' => 'libranza_credito_resumen_detalles',);
                }

                if (0 === strpos($pathinfo, '/libranza/credito/aprobados')) {
                    // libranza_credito_aprobados
                    if (rtrim($pathinfo, '/') === '/libranza/credito/aprobados') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_aprobados');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\AprobadoNoDesembolsadoController::indexAction',  '_route' => 'libranza_credito_aprobados',);
                    }

                    // libranza_credito_aprobados_aprobar
                    if (rtrim($pathinfo, '/') === '/libranza/credito/aprobados/aprobar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'libranza_credito_aprobados_aprobar');
                        }

                        return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\AprobadoNoDesembolsadoController::aprobarCreditoAction',  '_route' => 'libranza_credito_aprobados_aprobar',);
                    }

                }

                // libranza_credito_token
                if (rtrim($pathinfo, '/') === '/libranza/credito/token') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'libranza_credito_token');
                    }

                    return array (  '_controller' => 'Libranza\\LibranzaBundle\\Controller\\RegistroCreditoController::tokenAction',  '_route' => 'libranza_credito_token',);
                }

            }

        }

        if (0 === strpos($pathinfo, '/reportes')) {
            // reportes_reportes_default_index
            if ($pathinfo === '/reportes/pruebas') {
                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                    $allow = array_merge($allow, array('GET', 'HEAD'));
                    goto not_reportes_reportes_default_index;
                }

                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\DefaultController::indexAction',  '_route' => 'reportes_reportes_default_index',);
            }
            not_reportes_reportes_default_index:

            // reportes_reportes_default_reporter
            if ($pathinfo === '/reportes/reporter') {
                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                    $allow = array_merge($allow, array('GET', 'HEAD'));
                    goto not_reportes_reportes_default_reporter;
                }

                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\DefaultController::reporter',  '_route' => 'reportes_reportes_default_reporter',);
            }
            not_reportes_reportes_default_reporter:

            // reportes_reportes_default_reportexcel
            if ($pathinfo === '/reportes/excel') {
                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                    $allow = array_merge($allow, array('GET', 'HEAD'));
                    goto not_reportes_reportes_default_reportexcel;
                }

                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\DefaultController::reportExcel',  '_route' => 'reportes_reportes_default_reportexcel',);
            }
            not_reportes_reportes_default_reportexcel:

            // reportes_reportes_admin_index
            if ($pathinfo === '/reportes/admin') {
                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                    $allow = array_merge($allow, array('GET', 'HEAD'));
                    goto not_reportes_reportes_admin_index;
                }

                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\AdminController::indexAction',  '_route' => 'reportes_reportes_admin_index',);
            }
            not_reportes_reportes_admin_index:

            // reportes_reportes_admin_cargarreporte
            if ($pathinfo === '/reportes/cargarReporte') {
                if (!in_array($this->context->getMethod(), array('GET', 'POST', 'HEAD'))) {
                    $allow = array_merge($allow, array('GET', 'POST', 'HEAD'));
                    goto not_reportes_reportes_admin_cargarreporte;
                }

                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\AdminController::cargarReporteAction',  '_route' => 'reportes_reportes_admin_cargarreporte',);
            }
            not_reportes_reportes_admin_cargarreporte:

            if (0 === strpos($pathinfo, '/reportes/admin')) {
                // reportes_reportes_admin_downloadreport
                if (0 === strpos($pathinfo, '/reportes/admin/download') && preg_match('#^/reportes/admin/download/(?P<id>[^/]++)$#s', $pathinfo, $matches)) {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_admin_downloadreport;
                    }

                    return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_admin_downloadreport')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\AdminController::downloadReport',));
                }
                not_reportes_reportes_admin_downloadreport:

                // reportes_reportes_admin_adminreports
                if ($pathinfo === '/reportes/admin/reportes') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_admin_adminreports;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\AdminController::adminReports',  '_route' => 'reportes_reportes_admin_adminreports',);
                }
                not_reportes_reportes_admin_adminreports:

                // reportes_reportes_admin_getreportsjson
                if ($pathinfo === '/reportes/admin/getReportsJson') {
                    if (!in_array($this->context->getMethod(), array('GET', 'POST', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'POST', 'HEAD'));
                        goto not_reportes_reportes_admin_getreportsjson;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\AdminController::getReportsJson',  '_route' => 'reportes_reportes_admin_getreportsjson',);
                }
                not_reportes_reportes_admin_getreportsjson:

            }

            if (0 === strpos($pathinfo, '/reportes/cartera')) {
                // reportes_reportes_cartera_deteriorocartera
                if ($pathinfo === '/reportes/cartera/deterioroCartera') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_cartera_deteriorocartera;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CarteraController::deterioroCartera',  '_route' => 'reportes_reportes_cartera_deteriorocartera',);
                }
                not_reportes_reportes_cartera_deteriorocartera:

                // reportes_reportes_cartera_generardeteriorocartera
                if ($pathinfo === '/reportes/cartera/generarDeterioroCartera') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_cartera_generardeteriorocartera;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CarteraController::generarDeterioroCartera',  '_route' => 'reportes_reportes_cartera_generardeteriorocartera',);
                }
                not_reportes_reportes_cartera_generardeteriorocartera:

                // reportes_reportes_cartera_arqueocaja
                if ($pathinfo === '/reportes/cartera/arqueoCaja') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_cartera_arqueocaja;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CarteraController::arqueoCaja',  '_route' => 'reportes_reportes_cartera_arqueocaja',);
                }
                not_reportes_reportes_cartera_arqueocaja:

                // reportes_reportes_cartera_intereses_mora_liquidados
                if ($pathinfo === '/reportes/cartera/interesMoraLiquidados') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_cartera_intereses_mora_liquidados;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CarteraController::intereses_mora_liquidados',  '_route' => 'reportes_reportes_cartera_intereses_mora_liquidados',);
                }
                not_reportes_reportes_cartera_intereses_mora_liquidados:

                // reportes_reportes_cartera_estadocuenta
                if ($pathinfo === '/reportes/cartera/estadoCuenta') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_cartera_estadocuenta;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CarteraController::estadoCuenta',  '_route' => 'reportes_reportes_cartera_estadocuenta',);
                }
                not_reportes_reportes_cartera_estadocuenta:

                // reportes_reportes_cartera_devolucionrecaudo
                if ($pathinfo === '/reportes/cartera/devolucionRecaudo') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_cartera_devolucionrecaudo;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CarteraController::devolucionRecaudo',  '_route' => 'reportes_reportes_cartera_devolucionrecaudo',);
                }
                not_reportes_reportes_cartera_devolucionrecaudo:

                if (0 === strpos($pathinfo, '/reportes/cartera/generarReporte')) {
                    // reportes_reportes_cartera_generarreportearqueocaja
                    if ($pathinfo === '/reportes/cartera/generarReporteArqueoCaja') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_cartera_generarreportearqueocaja;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CarteraController::generarReporteArqueoCaja',  '_route' => 'reportes_reportes_cartera_generarreportearqueocaja',);
                    }
                    not_reportes_reportes_cartera_generarreportearqueocaja:

                    // reportes_reportes_cartera_generarreporteinteresbase
                    if ($pathinfo === '/reportes/cartera/generarReporteInteresBase') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_cartera_generarreporteinteresbase;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CarteraController::generarReporteInteresBase',  '_route' => 'reportes_reportes_cartera_generarreporteinteresbase',);
                    }
                    not_reportes_reportes_cartera_generarreporteinteresbase:

                    // reportes_reportes_cartera_generarreportearqueocaja2
                    if ($pathinfo === '/reportes/cartera/generarReporteArqueoCaja2') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_cartera_generarreportearqueocaja2;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CarteraController::generarReporteArqueoCaja2',  '_route' => 'reportes_reportes_cartera_generarreportearqueocaja2',);
                    }
                    not_reportes_reportes_cartera_generarreportearqueocaja2:

                }

                // reportes_reportes_cartera_buscardevolucionesjson
                if ($pathinfo === '/reportes/cartera/buscarDevolucionesJson') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_cartera_buscardevolucionesjson;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CarteraController::buscarDevolucionesJsonAction',  '_route' => 'reportes_reportes_cartera_buscardevolucionesjson',);
                }
                not_reportes_reportes_cartera_buscardevolucionesjson:

                // reportes_reportes_cartera_obtenerinformacionrecaudojson
                if (0 === strpos($pathinfo, '/reportes/cartera/obtenerInformacionRecaudoJson') && preg_match('#^/reportes/cartera/obtenerInformacionRecaudoJson/(?P<recaudo>[^/]++)$#s', $pathinfo, $matches)) {
                    if (!in_array($this->context->getMethod(), array('GET', 'POST', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'POST', 'HEAD'));
                        goto not_reportes_reportes_cartera_obtenerinformacionrecaudojson;
                    }

                    return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_cartera_obtenerinformacionrecaudojson')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CarteraController::obtenerInformacionRecaudoJsonAction',));
                }
                not_reportes_reportes_cartera_obtenerinformacionrecaudojson:

                if (0 === strpos($pathinfo, '/reportes/cartera/generarReporte')) {
                    // reportes_reportes_cartera_generarreportedevolucion
                    if (0 === strpos($pathinfo, '/reportes/cartera/generarReporteDevolucion') && preg_match('#^/reportes/cartera/generarReporteDevolucion/(?P<recaudo>[^/]++)$#s', $pathinfo, $matches)) {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_cartera_generarreportedevolucion;
                        }

                        return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_cartera_generarreportedevolucion')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CarteraController::generarReporteDevolucion',));
                    }
                    not_reportes_reportes_cartera_generarreportedevolucion:

                    if (0 === strpos($pathinfo, '/reportes/cartera/generarReporteEstadoCuenta')) {
                        // reportes_reportes_cartera_generarreporteestadocuenta
                        if ($pathinfo === '/reportes/cartera/generarReporteEstadoCuenta') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_cartera_generarreporteestadocuenta;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CarteraController::generarReporteEstadoCuenta',  '_route' => 'reportes_reportes_cartera_generarreporteestadocuenta',);
                        }
                        not_reportes_reportes_cartera_generarreporteestadocuenta:

                        // reportes_reportes_cartera_generarreporteestadocuentaxlsx
                        if ($pathinfo === '/reportes/cartera/generarReporteEstadoCuentaXlsx') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_cartera_generarreporteestadocuentaxlsx;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CarteraController::generarReporteEstadoCuentaXlsx',  '_route' => 'reportes_reportes_cartera_generarreporteestadocuentaxlsx',);
                        }
                        not_reportes_reportes_cartera_generarreporteestadocuentaxlsx:

                    }

                }

                // reportes_reportes_cartera_buscardevoluciones
                if ($pathinfo === '/reportes/cartera/buscarDevoluciones') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_cartera_buscardevoluciones;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CarteraController::buscarDevoluciones',  '_route' => 'reportes_reportes_cartera_buscardevoluciones',);
                }
                not_reportes_reportes_cartera_buscardevoluciones:

            }

            if (0 === strpos($pathinfo, '/reportes/facturacion')) {
                // reportes_reportes_facturacion_buscarperiodosciclo
                if (0 === strpos($pathinfo, '/reportes/facturacion/buscarPeriodosCiclo') && preg_match('#^/reportes/facturacion/buscarPeriodosCiclo/(?P<ciclo>[^/]++)$#s', $pathinfo, $matches)) {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_facturacion_buscarperiodosciclo;
                    }

                    return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_facturacion_buscarperiodosciclo')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionController::buscarPeriodosCiclo',));
                }
                not_reportes_reportes_facturacion_buscarperiodosciclo:

                // reportes_reportes_facturacion_relaciontotalesfacturados
                if ($pathinfo === '/reportes/facturacion/totalesFacturados') {
                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionController::relacionTotalesFacturadosAction',  '_route' => 'reportes_reportes_facturacion_relaciontotalesfacturados',);
                }

                // reportes_reportes_facturacion_generarreportefacturacion
                if ($pathinfo === '/reportes/facturacion/generarReporteFacturacion') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_facturacion_generarreportefacturacion;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionController::generarReporteFacturacionAction',  '_route' => 'reportes_reportes_facturacion_generarreportefacturacion',);
                }
                not_reportes_reportes_facturacion_generarreportefacturacion:

                // reportes_reportes_facturacion_obtenercicloperiodoactual
                if ($pathinfo === '/reportes/facturacion/obtenerCicloPeriodoActual') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_facturacion_obtenercicloperiodoactual;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionController::obtenerCicloPeriodoActual',  '_route' => 'reportes_reportes_facturacion_obtenercicloperiodoactual',);
                }
                not_reportes_reportes_facturacion_obtenercicloperiodoactual:

                // reportes_reportes_facturacion_listadoemitirfacturasuscriptor
                if ($pathinfo === '/reportes/facturacion/listadoEspecialSuscripcionesTomaLecturas') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_facturacion_listadoemitirfacturasuscriptor;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionController::listadoEmitirFacturaSuscriptor',  '_route' => 'reportes_reportes_facturacion_listadoemitirfacturasuscriptor',);
                }
                not_reportes_reportes_facturacion_listadoemitirfacturasuscriptor:

                // reportes_reportes_facturacion_generarreportebatallonfac
                if ($pathinfo === '/reportes/facturacion/generarReporteBatallonFac') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_facturacion_generarreportebatallonfac;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionController::generarReporteBatallonFac',  '_route' => 'reportes_reportes_facturacion_generarreportebatallonfac',);
                }
                not_reportes_reportes_facturacion_generarreportebatallonfac:

                // reportes_reportes_facturacion_maestrolecturas
                if ($pathinfo === '/reportes/facturacion/maestroLecturas') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_facturacion_maestrolecturas;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionController::maestroLecturas',  '_route' => 'reportes_reportes_facturacion_maestrolecturas',);
                }
                not_reportes_reportes_facturacion_maestrolecturas:

                // reportes_reportes_facturacion_generarmaestrolecturas
                if ($pathinfo === '/reportes/facturacion/generarMaestroLecturas') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_facturacion_generarmaestrolecturas;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionController::generarMaestroLecturas',  '_route' => 'reportes_reportes_facturacion_generarmaestrolecturas',);
                }
                not_reportes_reportes_facturacion_generarmaestrolecturas:

                // reportes_reportes_facturacion_facturacionindustrialemitida
                if ($pathinfo === '/reportes/facturacion/facturacionIndustrialEmitida') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_facturacion_facturacionindustrialemitida;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionController::facturacionIndustrialEmitida',  '_route' => 'reportes_reportes_facturacion_facturacionindustrialemitida',);
                }
                not_reportes_reportes_facturacion_facturacionindustrialemitida:

                if (0 === strpos($pathinfo, '/reportes/facturacion/generar')) {
                    // reportes_reportes_facturacion_generarreportefacturacionindustrial
                    if ($pathinfo === '/reportes/facturacion/generarReporteFacturacionIndustrial') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_facturacion_generarreportefacturacionindustrial;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionController::generarReporteFacturacionIndustrial',  '_route' => 'reportes_reportes_facturacion_generarreportefacturacionindustrial',);
                    }
                    not_reportes_reportes_facturacion_generarreportefacturacionindustrial:

                    // reportes_reportes_suspensionesreconexiones_generarformatossuspensionreconexionrtr
                    if ($pathinfo === '/reportes/facturacion/generarFormatosSuspensionReconexionRTR') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_suspensionesreconexiones_generarformatossuspensionreconexionrtr;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesReconexionesController::generarFormatosSuspensionReconexionRTR',  '_route' => 'reportes_reportes_suspensionesreconexiones_generarformatossuspensionreconexionrtr',);
                    }
                    not_reportes_reportes_suspensionesreconexiones_generarformatossuspensionreconexionrtr:

                    // reportes_reportes_suspensionesreconexiones_generarreportesuspensionesreconexionesrtr
                    if ($pathinfo === '/reportes/facturacion/generarReporteSuspensionesReconexionesRTR') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_suspensionesreconexiones_generarreportesuspensionesreconexionesrtr;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesReconexionesController::generarReporteSuspensionesReconexionesRTR',  '_route' => 'reportes_reportes_suspensionesreconexiones_generarreportesuspensionesreconexionesrtr',);
                    }
                    not_reportes_reportes_suspensionesreconexiones_generarreportesuspensionesreconexionesrtr:

                    // reportes_reportes_suspensionesreconexiones_generarformatossuspensionreconexion2
                    if ($pathinfo === '/reportes/facturacion/generarFormatosSuspensionReconexion2') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_suspensionesreconexiones_generarformatossuspensionreconexion2;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesReconexionesController::generarFormatosSuspensionReconexion2',  '_route' => 'reportes_reportes_suspensionesreconexiones_generarformatossuspensionreconexion2',);
                    }
                    not_reportes_reportes_suspensionesreconexiones_generarformatossuspensionreconexion2:

                    // reportes_reportes_suspensionesreconexiones_generarreportesuspensionesreconexiones2
                    if ($pathinfo === '/reportes/facturacion/generarReporteSuspensionesReconexiones2') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_suspensionesreconexiones_generarreportesuspensionesreconexiones2;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesReconexionesController::generarReporteSuspensionesReconexiones2',  '_route' => 'reportes_reportes_suspensionesreconexiones_generarreportesuspensionesreconexiones2',);
                    }
                    not_reportes_reportes_suspensionesreconexiones_generarreportesuspensionesreconexiones2:

                    if (0 === strpos($pathinfo, '/reportes/facturacion/generarLista')) {
                        // reportes_reportes_suspensionesreconexiones_generarlistasuspensionesrtr2
                        if ($pathinfo === '/reportes/facturacion/generarListaSuspensionesRTR2') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_suspensionesreconexiones_generarlistasuspensionesrtr2;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesReconexionesController::generarListaSuspensionesRTR2',  '_route' => 'reportes_reportes_suspensionesreconexiones_generarlistasuspensionesrtr2',);
                        }
                        not_reportes_reportes_suspensionesreconexiones_generarlistasuspensionesrtr2:

                        // reportes_reportes_suspensionesreconexiones_generarlistareconexionesrtr2
                        if ($pathinfo === '/reportes/facturacion/generarListaReconexionesRTR2') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_suspensionesreconexiones_generarlistareconexionesrtr2;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesReconexionesController::generarListaReconexionesRTR2',  '_route' => 'reportes_reportes_suspensionesreconexiones_generarlistareconexionesrtr2',);
                        }
                        not_reportes_reportes_suspensionesreconexiones_generarlistareconexionesrtr2:

                    }

                }

                // reportes_reportes_suspensionesreconexiones_listasuspensionesreconexiones2
                if ($pathinfo === '/reportes/facturacion/listaSuspensionesReconexiones2') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_suspensionesreconexiones_listasuspensionesreconexiones2;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesReconexionesController::listaSuspensionesReconexiones2',  '_route' => 'reportes_reportes_suspensionesreconexiones_listasuspensionesreconexiones2',);
                }
                not_reportes_reportes_suspensionesreconexiones_listasuspensionesreconexiones2:

                if (0 === strpos($pathinfo, '/reportes/facturacion/generar')) {
                    if (0 === strpos($pathinfo, '/reportes/facturacion/generarReporteSus')) {
                        // reportes_reportes_suspensionesreconexiones_generarreportesuspensionesreconexionesmora
                        if ($pathinfo === '/reportes/facturacion/generarReporteSuspensionesReconexionesMora') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_suspensionesreconexiones_generarreportesuspensionesreconexionesmora;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesReconexionesController::generarReporteSuspensionesReconexionesMora',  '_route' => 'reportes_reportes_suspensionesreconexiones_generarreportesuspensionesreconexionesmora',);
                        }
                        not_reportes_reportes_suspensionesreconexiones_generarreportesuspensionesreconexionesmora:

                        // reportes_reportes_suspensionesreconexiones_generarreportesusyrxtarde
                        if ($pathinfo === '/reportes/facturacion/generarReporteSusyRxTarde') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_suspensionesreconexiones_generarreportesusyrxtarde;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesReconexionesController::generarReporteSusyRxTarde',  '_route' => 'reportes_reportes_suspensionesreconexiones_generarreportesusyrxtarde',);
                        }
                        not_reportes_reportes_suspensionesreconexiones_generarreportesusyrxtarde:

                    }

                    // reportes_reportes_entregafactura_generarformatosentregafactura
                    if ($pathinfo === '/reportes/facturacion/generarFormatosEntregaFactura') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_entregafactura_generarformatosentregafactura;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\EntregaFacturaController::generarFormatosEntregaFactura',  '_route' => 'reportes_reportes_entregafactura_generarformatosentregafactura',);
                    }
                    not_reportes_reportes_entregafactura_generarformatosentregafactura:

                    // reportes_reportes_entregafactura_generarreporteentregafactura
                    if ($pathinfo === '/reportes/facturacion/generarReporteEntregaFactura') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_entregafactura_generarreporteentregafactura;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\EntregaFacturaController::generarReporteEntregaFactura',  '_route' => 'reportes_reportes_entregafactura_generarreporteentregafactura',);
                    }
                    not_reportes_reportes_entregafactura_generarreporteentregafactura:

                }

                if (0 === strpos($pathinfo, '/reportes/facturacion/reporte')) {
                    // reportes_reportes_suspensionesnovedades_reportenovedadessuspensiones
                    if ($pathinfo === '/reportes/facturacion/reporteNovedadesSuspensiones') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_suspensionesnovedades_reportenovedadessuspensiones;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesNovedadesController::reporteNovedadesSuspensiones',  '_route' => 'reportes_reportes_suspensionesnovedades_reportenovedadessuspensiones',);
                    }
                    not_reportes_reportes_suspensionesnovedades_reportenovedadessuspensiones:

                    // reportes_reportes_suspensionesnovedades_reporterendimientosuspensiones
                    if ($pathinfo === '/reportes/facturacion/reporteRendimientoSuspensiones') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_suspensionesnovedades_reporterendimientosuspensiones;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesNovedadesController::reporteRendimientoSuspensiones',  '_route' => 'reportes_reportes_suspensionesnovedades_reporterendimientosuspensiones',);
                    }
                    not_reportes_reportes_suspensionesnovedades_reporterendimientosuspensiones:

                }

                if (0 === strpos($pathinfo, '/reportes/facturacion/generarNovedades')) {
                    // reportes_reportes_suspensionesnovedades_generarnovedadessuspensiones
                    if ($pathinfo === '/reportes/facturacion/generarNovedadesSuspensiones') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_suspensionesnovedades_generarnovedadessuspensiones;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesNovedadesController::generarNovedadesSuspensiones',  '_route' => 'reportes_reportes_suspensionesnovedades_generarnovedadessuspensiones',);
                    }
                    not_reportes_reportes_suspensionesnovedades_generarnovedadessuspensiones:

                    // reportes_reportes_suspensionesnovedades_generarnovedadesreconexiones
                    if ($pathinfo === '/reportes/facturacion/generarNovedadesReconexiones') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_suspensionesnovedades_generarnovedadesreconexiones;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesNovedadesController::generarNovedadesReconexiones',  '_route' => 'reportes_reportes_suspensionesnovedades_generarnovedadesreconexiones',);
                    }
                    not_reportes_reportes_suspensionesnovedades_generarnovedadesreconexiones:

                }

                if (0 === strpos($pathinfo, '/reportes/facturacion/ver')) {
                    // reportes_reportes_suspensionesnovedades_verresumendiario
                    if ($pathinfo === '/reportes/facturacion/verResumenDiario') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_suspensionesnovedades_verresumendiario;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesNovedadesController::verResumenDiario',  '_route' => 'reportes_reportes_suspensionesnovedades_verresumendiario',);
                    }
                    not_reportes_reportes_suspensionesnovedades_verresumendiario:

                    // reportes_reportes_suspensionesnovedades_verdetallediario
                    if ($pathinfo === '/reportes/facturacion/verDetalleDiario') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_suspensionesnovedades_verdetallediario;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesNovedadesController::verDetalleDiario',  '_route' => 'reportes_reportes_suspensionesnovedades_verdetallediario',);
                    }
                    not_reportes_reportes_suspensionesnovedades_verdetallediario:

                }

                if (0 === strpos($pathinfo, '/reportes/facturacion/generarReporte')) {
                    // reportes_reportes_suspensionesnovedades_generarreporteresumen
                    if ($pathinfo === '/reportes/facturacion/generarReporteResumen') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_suspensionesnovedades_generarreporteresumen;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesNovedadesController::generarReporteResumen',  '_route' => 'reportes_reportes_suspensionesnovedades_generarreporteresumen',);
                    }
                    not_reportes_reportes_suspensionesnovedades_generarreporteresumen:

                    // reportes_reportes_suspensionesnovedades_generarreportedetalle
                    if ($pathinfo === '/reportes/facturacion/generarReporteDetalle') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_suspensionesnovedades_generarreportedetalle;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesNovedadesController::generarReporteDetalle',  '_route' => 'reportes_reportes_suspensionesnovedades_generarreportedetalle',);
                    }
                    not_reportes_reportes_suspensionesnovedades_generarreportedetalle:

                }

            }

            if (0 === strpos($pathinfo, '/reportes/ventas')) {
                // reportes_reportes_ventas_facturaventa
                if ($pathinfo === '/reportes/ventas/facturaVenta') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_ventas_facturaventa;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::facturaVenta',  '_route' => 'reportes_reportes_ventas_facturaventa',);
                }
                not_reportes_reportes_ventas_facturaventa:

                // reportes_reportes_ventas_ordenservicio
                if ($pathinfo === '/reportes/ventas/ordenServicio') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_ventas_ordenservicio;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::ordenServicio',  '_route' => 'reportes_reportes_ventas_ordenservicio',);
                }
                not_reportes_reportes_ventas_ordenservicio:

                if (0 === strpos($pathinfo, '/reportes/ventas/ventas')) {
                    // reportes_reportes_ventas_ventastramite
                    if ($pathinfo === '/reportes/ventas/ventasTramite') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_ventas_ventastramite;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::ventasTramite',  '_route' => 'reportes_reportes_ventas_ventastramite',);
                    }
                    not_reportes_reportes_ventas_ventastramite:

                    // reportes_reportes_ventas_ventasliquidacion
                    if ($pathinfo === '/reportes/ventas/ventasLiquidacion') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_ventas_ventasliquidacion;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::ventasLiquidacion',  '_route' => 'reportes_reportes_ventas_ventasliquidacion',);
                    }
                    not_reportes_reportes_ventas_ventasliquidacion:

                }

                // reportes_reportes_ventas_ministeriominas
                if ($pathinfo === '/reportes/ventas/ministerioMinas') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_ventas_ministeriominas;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::ministerioMinas',  '_route' => 'reportes_reportes_ventas_ministeriominas',);
                }
                not_reportes_reportes_ventas_ministeriominas:

                // reportes_reportes_ventas_ordentrabajo
                if ($pathinfo === '/reportes/ventas/ordenTrabajo') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_ventas_ordentrabajo;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::ordenTrabajo',  '_route' => 'reportes_reportes_ventas_ordentrabajo',);
                }
                not_reportes_reportes_ventas_ordentrabajo:

                // reportes_reportes_ventas_vinculacionservicio
                if ($pathinfo === '/reportes/ventas/vinculacionServicio') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_ventas_vinculacionservicio;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::vinculacionServicio',  '_route' => 'reportes_reportes_ventas_vinculacionservicio',);
                }
                not_reportes_reportes_ventas_vinculacionservicio:

                // reportes_reportes_ventas_buscarventaspordocumento
                if ($pathinfo === '/reportes/ventas/buscarVentasPorDocumento') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_ventas_buscarventaspordocumento;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::buscarVentasPorDocumento',  '_route' => 'reportes_reportes_ventas_buscarventaspordocumento',);
                }
                not_reportes_reportes_ventas_buscarventaspordocumento:

                // reportes_reportes_ventas_existecambiosventa
                if ($pathinfo === '/reportes/ventas/existeCambiosVenta') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_ventas_existecambiosventa;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::existeCambiosVenta',  '_route' => 'reportes_reportes_ventas_existecambiosventa',);
                }
                not_reportes_reportes_ventas_existecambiosventa:

                if (0 === strpos($pathinfo, '/reportes/ventas/generar')) {
                    if (0 === strpos($pathinfo, '/reportes/ventas/generarFormato')) {
                        // reportes_reportes_ventas_generarformatofacturadeventa
                        if ($pathinfo === '/reportes/ventas/generarFormatoFacturaDeVenta') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_ventas_generarformatofacturadeventa;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::generarFormatoFacturaDeVenta',  '_route' => 'reportes_reportes_ventas_generarformatofacturadeventa',);
                        }
                        not_reportes_reportes_ventas_generarformatofacturadeventa:

                        // reportes_reportes_ventas_generarformatoordendeservicio
                        if ($pathinfo === '/reportes/ventas/generarFormatoOrdenDeServicio') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_ventas_generarformatoordendeservicio;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::generarFormatoOrdenDeServicio',  '_route' => 'reportes_reportes_ventas_generarformatoordendeservicio',);
                        }
                        not_reportes_reportes_ventas_generarformatoordendeservicio:

                        // reportes_reportes_ventas_generarformatocambios
                        if ($pathinfo === '/reportes/ventas/generarFormatoCambios') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_ventas_generarformatocambios;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::generarFormatoCambios',  '_route' => 'reportes_reportes_ventas_generarformatocambios',);
                        }
                        not_reportes_reportes_ventas_generarformatocambios:

                        // reportes_reportes_ventas_generarformatoordendetrabajo
                        if ($pathinfo === '/reportes/ventas/generarFormatoOrdenDeTrabajo') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_ventas_generarformatoordendetrabajo;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::generarFormatoOrdenDeTrabajo',  '_route' => 'reportes_reportes_ventas_generarformatoordendetrabajo',);
                        }
                        not_reportes_reportes_ventas_generarformatoordendetrabajo:

                    }

                    // reportes_reportes_ventas_generarventasentramite
                    if ($pathinfo === '/reportes/ventas/generarVentasTramite') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_ventas_generarventasentramite;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::generarVentasEnTramite',  '_route' => 'reportes_reportes_ventas_generarventasentramite',);
                    }
                    not_reportes_reportes_ventas_generarventasentramite:

                    // reportes_reportes_ventas_generarministeriominas
                    if ($pathinfo === '/reportes/ventas/generarMinisterioMinas') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_ventas_generarministeriominas;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::generarMinisterioMinas',  '_route' => 'reportes_reportes_ventas_generarministeriominas',);
                    }
                    not_reportes_reportes_ventas_generarministeriominas:

                    // reportes_reportes_ventas_generarventasconvenios
                    if ($pathinfo === '/reportes/ventas/generarVentasConvenio') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_ventas_generarventasconvenios;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::generarVentasConvenios',  '_route' => 'reportes_reportes_ventas_generarventasconvenios',);
                    }
                    not_reportes_reportes_ventas_generarventasconvenios:

                    if (0 === strpos($pathinfo, '/reportes/ventas/generarReporte')) {
                        // reportes_reportes_ventas_generarreporteventastramites
                        if ($pathinfo === '/reportes/ventas/generarReporteVentastramites') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_ventas_generarreporteventastramites;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::generarReporteVentastramites',  '_route' => 'reportes_reportes_ventas_generarreporteventastramites',);
                        }
                        not_reportes_reportes_ventas_generarreporteventastramites:

                        if (0 === strpos($pathinfo, '/reportes/ventas/generarReporteMinisterioMinas')) {
                            // reportes_reportes_ventas_generarreporteministeriominas
                            if ($pathinfo === '/reportes/ventas/generarReporteMinisterioMinas') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_ventas_generarreporteministeriominas;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::generarReporteMinisterioMinas',  '_route' => 'reportes_reportes_ventas_generarreporteministeriominas',);
                            }
                            not_reportes_reportes_ventas_generarreporteministeriominas:

                            // reportes_reportes_ventas_generarreporteministeriominascsv
                            if ($pathinfo === '/reportes/ventas/generarReporteMinisterioMinascsv') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_ventas_generarreporteministeriominascsv;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::generarReporteMinisterioMinascsv',  '_route' => 'reportes_reportes_ventas_generarreporteministeriominascsv',);
                            }
                            not_reportes_reportes_ventas_generarreporteministeriominascsv:

                        }

                    }

                }

                // reportes_reportes_ventas_ventasconstructoras
                if ($pathinfo === '/reportes/ventas/ventasConstructoras') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_ventas_ventasconstructoras;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::ventasConstructoras',  '_route' => 'reportes_reportes_ventas_ventasconstructoras',);
                }
                not_reportes_reportes_ventas_ventasconstructoras:

                if (0 === strpos($pathinfo, '/reportes/ventas/generarReporteConstructora')) {
                    // reportes_reportes_ventas_generarreporteconstructora
                    if ($pathinfo === '/reportes/ventas/generarReporteConstructora') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_ventas_generarreporteconstructora;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::generarReporteConstructora',  '_route' => 'reportes_reportes_ventas_generarreporteconstructora',);
                    }
                    not_reportes_reportes_ventas_generarreporteconstructora:

                    // reportes_reportes_ventas_generarreporteconstructoradetalle
                    if ($pathinfo === '/reportes/ventas/generarReporteConstructoraDetalle') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_ventas_generarreporteconstructoradetalle;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::generarReporteConstructoraDetalle',  '_route' => 'reportes_reportes_ventas_generarreporteconstructoradetalle',);
                    }
                    not_reportes_reportes_ventas_generarreporteconstructoradetalle:

                }

                // reportes_reportes_ventas_listaventasdiabancos
                if ($pathinfo === '/reportes/ventas/listaVentasDiaBancos') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_ventas_listaventasdiabancos;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::listaVentasDiaBancos',  '_route' => 'reportes_reportes_ventas_listaventasdiabancos',);
                }
                not_reportes_reportes_ventas_listaventasdiabancos:

                if (0 === strpos($pathinfo, '/reportes/ventas/generarReporteVentas')) {
                    // reportes_reportes_ventas_generarreporteventasdias
                    if ($pathinfo === '/reportes/ventas/generarReporteVentasDias') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_ventas_generarreporteventasdias;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::generarReporteVentasDias',  '_route' => 'reportes_reportes_ventas_generarreporteventasdias',);
                    }
                    not_reportes_reportes_ventas_generarreporteventasdias:

                    // reportes_reportes_ventas_generarreporteventasbancos
                    if ($pathinfo === '/reportes/ventas/generarReporteVentasBancos') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_ventas_generarreporteventasbancos;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::generarReporteVentasBancos',  '_route' => 'reportes_reportes_ventas_generarreporteventasbancos',);
                    }
                    not_reportes_reportes_ventas_generarreporteventasbancos:

                }

                // reportes_reportes_ventas_cambiotercero
                if ($pathinfo === '/reportes/ventas/cambioTercero') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_ventas_cambiotercero;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::cambioTercero',  '_route' => 'reportes_reportes_ventas_cambiotercero',);
                }
                not_reportes_reportes_ventas_cambiotercero:

                // reportes_reportes_ventas_generarreportecambiotercero
                if ($pathinfo === '/reportes/ventas/generarReporteCambioTercero') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_ventas_generarreportecambiotercero;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::generarReporteCambioTercero',  '_route' => 'reportes_reportes_ventas_generarreportecambiotercero',);
                }
                not_reportes_reportes_ventas_generarreportecambiotercero:

                // reportes_reportes_ventas_buscarventaspordocumentofacturaventa
                if ($pathinfo === '/reportes/ventas/buscarVentasPorDocumentoFacturaVenta') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_ventas_buscarventaspordocumentofacturaventa;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::buscarVentasPorDocumentoFacturaVenta',  '_route' => 'reportes_reportes_ventas_buscarventaspordocumentofacturaventa',);
                }
                not_reportes_reportes_ventas_buscarventaspordocumentofacturaventa:

                // reportes_reportes_ventas_generarreportefacturaelectronica
                if ($pathinfo === '/reportes/ventas/generarReporteFacturaElectronica') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_ventas_generarreportefacturaelectronica;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VentasController::generarReporteFacturaElectronica',  '_route' => 'reportes_reportes_ventas_generarreportefacturaelectronica',);
                }
                not_reportes_reportes_ventas_generarreportefacturaelectronica:

            }

            if (0 === strpos($pathinfo, '/reportes/util')) {
                // reportes_reportes_util_findjsonsuscriptorpornombre
                if ($pathinfo === '/reportes/util/findJsonSuscriptorByName') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_util_findjsonsuscriptorpornombre;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::findJsonSuscriptorPorNombre',  '_route' => 'reportes_reportes_util_findjsonsuscriptorpornombre',);
                }
                not_reportes_reportes_util_findjsonsuscriptorpornombre:

                if (0 === strpos($pathinfo, '/reportes/util/buscarTercero')) {
                    // reportes_reportes_util_buecarterceropornombre
                    if (0 === strpos($pathinfo, '/reportes/util/buscarTerceroNombre') && preg_match('#^/reportes/util/buscarTerceroNombre/(?P<search>[^/]++)$#s', $pathinfo, $matches)) {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_buecarterceropornombre;
                        }

                        return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_buecarterceropornombre')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::buecarTerceroPorNombre',));
                    }
                    not_reportes_reportes_util_buecarterceropornombre:

                    // reportes_reportes_util_buecarterceropordocumento
                    if (0 === strpos($pathinfo, '/reportes/util/buscarTerceroDocumento') && preg_match('#^/reportes/util/buscarTerceroDocumento/(?P<search>[^/]++)$#s', $pathinfo, $matches)) {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_buecarterceropordocumento;
                        }

                        return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_buecarterceropordocumento')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::buecarTerceroPorDocumento',));
                    }
                    not_reportes_reportes_util_buecarterceropordocumento:

                }

                // reportes_reportes_util_findjsonconstructorasbyname
                if ($pathinfo === '/reportes/util/findJsonConstructoraByName') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_util_findjsonconstructorasbyname;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::findJsonConstructorasByName',  '_route' => 'reportes_reportes_util_findjsonconstructorasbyname',);
                }
                not_reportes_reportes_util_findjsonconstructorasbyname:

                if (0 === strpos($pathinfo, '/reportes/util/get')) {
                    if (0 === strpos($pathinfo, '/reportes/util/getJson')) {
                        if (0 === strpos($pathinfo, '/reportes/util/getJsonCiclosActivos')) {
                            // reportes_reportes_util_getjsonciclosactivos
                            if ($pathinfo === '/reportes/util/getJsonCiclosActivos') {
                                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                    $allow = array_merge($allow, array('GET', 'HEAD'));
                                    goto not_reportes_reportes_util_getjsonciclosactivos;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonCiclosActivos',  '_route' => 'reportes_reportes_util_getjsonciclosactivos',);
                            }
                            not_reportes_reportes_util_getjsonciclosactivos:

                            // reportes_reportes_util_getjsonciclosactivosporprograma
                            if (0 === strpos($pathinfo, '/reportes/util/getJsonCiclosActivosPorPrograma') && preg_match('#^/reportes/util/getJsonCiclosActivosPorPrograma/(?P<idprograma>[^/]++)$#s', $pathinfo, $matches)) {
                                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                    $allow = array_merge($allow, array('GET', 'HEAD'));
                                    goto not_reportes_reportes_util_getjsonciclosactivosporprograma;
                                }

                                return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_getjsonciclosactivosporprograma')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonCiclosActivosPorPrograma',));
                            }
                            not_reportes_reportes_util_getjsonciclosactivosporprograma:

                        }

                        if (0 === strpos($pathinfo, '/reportes/util/getJsonPeriodos')) {
                            // reportes_reportes_util_getjsonperiodosciclo
                            if (0 === strpos($pathinfo, '/reportes/util/getJsonPeriodosCiclo') && preg_match('#^/reportes/util/getJsonPeriodosCiclo/(?P<ciclo>[^/]++)$#s', $pathinfo, $matches)) {
                                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                    $allow = array_merge($allow, array('GET', 'HEAD'));
                                    goto not_reportes_reportes_util_getjsonperiodosciclo;
                                }

                                return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_getjsonperiodosciclo')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonPeriodosCiclo',));
                            }
                            not_reportes_reportes_util_getjsonperiodosciclo:

                            // reportes_reportes_util_getjsonperiodosunicosciclo
                            if (0 === strpos($pathinfo, '/reportes/util/getJsonPeriodosUnicosCiclo') && preg_match('#^/reportes/util/getJsonPeriodosUnicosCiclo/(?P<ciclo>[^/]++)$#s', $pathinfo, $matches)) {
                                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                    $allow = array_merge($allow, array('GET', 'HEAD'));
                                    goto not_reportes_reportes_util_getjsonperiodosunicosciclo;
                                }

                                return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_getjsonperiodosunicosciclo')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonPeriodosUnicosCiclo',));
                            }
                            not_reportes_reportes_util_getjsonperiodosunicosciclo:

                            // reportes_reportes_util_getjsonperiodoscicloano
                            if ($pathinfo === '/reportes/util/getJsonPeriodosCicloAno') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_util_getjsonperiodoscicloano;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonPeriodosCicloAno',  '_route' => 'reportes_reportes_util_getjsonperiodoscicloano',);
                            }
                            not_reportes_reportes_util_getjsonperiodoscicloano:

                            // reportes_reportes_util_getjsonperiodosano
                            if ($pathinfo === '/reportes/util/getJsonPeriodosAno') {
                                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                    $allow = array_merge($allow, array('GET', 'HEAD'));
                                    goto not_reportes_reportes_util_getjsonperiodosano;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonPeriodosAno',  '_route' => 'reportes_reportes_util_getjsonperiodosano',);
                            }
                            not_reportes_reportes_util_getjsonperiodosano:

                            // reportes_reportes_util_getjsonperiodos
                            if ($pathinfo === '/reportes/util/getJsonPeriodos') {
                                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                    $allow = array_merge($allow, array('GET', 'HEAD'));
                                    goto not_reportes_reportes_util_getjsonperiodos;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonPeriodos',  '_route' => 'reportes_reportes_util_getjsonperiodos',);
                            }
                            not_reportes_reportes_util_getjsonperiodos:

                        }

                    }

                    // reportes_reportes_util_consultarperiodos
                    if ($pathinfo === '/reportes/util/getConsultarPeriodos') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_consultarperiodos;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::consultarPeriodos',  '_route' => 'reportes_reportes_util_consultarperiodos',);
                    }
                    not_reportes_reportes_util_consultarperiodos:

                    if (0 === strpos($pathinfo, '/reportes/util/getJson')) {
                        if (0 === strpos($pathinfo, '/reportes/util/getJsonLi')) {
                            // reportes_reportes_util_liquidacionesfacturadas
                            if ($pathinfo === '/reportes/util/getJsonLiquidacionesFacturadas') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_util_liquidacionesfacturadas;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::liquidacionesFacturadas',  '_route' => 'reportes_reportes_util_liquidacionesfacturadas',);
                            }
                            not_reportes_reportes_util_liquidacionesfacturadas:

                            // reportes_reportes_util_getjsonlistaranos
                            if ($pathinfo === '/reportes/util/getJsonListarAnos') {
                                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                    $allow = array_merge($allow, array('GET', 'HEAD'));
                                    goto not_reportes_reportes_util_getjsonlistaranos;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonListarAnos',  '_route' => 'reportes_reportes_util_getjsonlistaranos',);
                            }
                            not_reportes_reportes_util_getjsonlistaranos:

                        }

                        // reportes_reportes_util_getjsonnovedades
                        if ($pathinfo === '/reportes/util/getJsonNovedades') {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_util_getjsonnovedades;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonNovedades',  '_route' => 'reportes_reportes_util_getjsonnovedades',);
                        }
                        not_reportes_reportes_util_getjsonnovedades:

                        if (0 === strpos($pathinfo, '/reportes/util/getJsonTipos')) {
                            if (0 === strpos($pathinfo, '/reportes/util/getJsonTiposUso')) {
                                // reportes_reportes_util_getjsontiposuso
                                if ($pathinfo === '/reportes/util/getJsonTiposUso') {
                                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                        $allow = array_merge($allow, array('GET', 'HEAD'));
                                        goto not_reportes_reportes_util_getjsontiposuso;
                                    }

                                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonTiposUso',  '_route' => 'reportes_reportes_util_getjsontiposuso',);
                                }
                                not_reportes_reportes_util_getjsontiposuso:

                                // reportes_reportes_util_getjsontiposusoporempresa
                                if ($pathinfo === '/reportes/util/getJsonTiposUsoEmpresa') {
                                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                        $allow = array_merge($allow, array('GET', 'HEAD'));
                                        goto not_reportes_reportes_util_getjsontiposusoporempresa;
                                    }

                                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonTiposUsoPorEmpresa',  '_route' => 'reportes_reportes_util_getjsontiposusoporempresa',);
                                }
                                not_reportes_reportes_util_getjsontiposusoporempresa:

                                // reportes_reportes_util_getjsontiposusoindustrialcomercial
                                if ($pathinfo === '/reportes/util/getJsonTiposUsoIndustrialComercial') {
                                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                        $allow = array_merge($allow, array('GET', 'HEAD'));
                                        goto not_reportes_reportes_util_getjsontiposusoindustrialcomercial;
                                    }

                                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonTiposUsoIndustrialComercial',  '_route' => 'reportes_reportes_util_getjsontiposusoindustrialcomercial',);
                                }
                                not_reportes_reportes_util_getjsontiposusoindustrialcomercial:

                            }

                            // reportes_reportes_util_getjsontipossuspension
                            if ($pathinfo === '/reportes/util/getJsonTiposSuspension') {
                                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                    $allow = array_merge($allow, array('GET', 'HEAD'));
                                    goto not_reportes_reportes_util_getjsontipossuspension;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonTiposSuspension',  '_route' => 'reportes_reportes_util_getjsontipossuspension',);
                            }
                            not_reportes_reportes_util_getjsontipossuspension:

                        }

                        if (0 === strpos($pathinfo, '/reportes/util/getJsonMotivos')) {
                            // reportes_reportes_util_getjsonmotivossuspension
                            if ($pathinfo === '/reportes/util/getJsonMotivosSuspension') {
                                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                    $allow = array_merge($allow, array('GET', 'HEAD'));
                                    goto not_reportes_reportes_util_getjsonmotivossuspension;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonMotivosSuspension',  '_route' => 'reportes_reportes_util_getjsonmotivossuspension',);
                            }
                            not_reportes_reportes_util_getjsonmotivossuspension:

                            // reportes_reportes_util_getjsonmotivosreconexion
                            if ($pathinfo === '/reportes/util/getJsonMotivosReconexion') {
                                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                    $allow = array_merge($allow, array('GET', 'HEAD'));
                                    goto not_reportes_reportes_util_getjsonmotivosreconexion;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonMotivosReconexion',  '_route' => 'reportes_reportes_util_getjsonmotivosreconexion',);
                            }
                            not_reportes_reportes_util_getjsonmotivosreconexion:

                        }

                        if (0 === strpos($pathinfo, '/reportes/util/getJsonNovedades')) {
                            // reportes_reportes_util_getjsonnovedadessuspension
                            if ($pathinfo === '/reportes/util/getJsonNovedadesSuspension') {
                                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                    $allow = array_merge($allow, array('GET', 'HEAD'));
                                    goto not_reportes_reportes_util_getjsonnovedadessuspension;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonNovedadesSuspension',  '_route' => 'reportes_reportes_util_getjsonnovedadessuspension',);
                            }
                            not_reportes_reportes_util_getjsonnovedadessuspension:

                            // reportes_reportes_util_getjsonnovedadesreconexion
                            if ($pathinfo === '/reportes/util/getJsonNovedadesReconexion') {
                                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                    $allow = array_merge($allow, array('GET', 'HEAD'));
                                    goto not_reportes_reportes_util_getjsonnovedadesreconexion;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonNovedadesReconexion',  '_route' => 'reportes_reportes_util_getjsonnovedadesreconexion',);
                            }
                            not_reportes_reportes_util_getjsonnovedadesreconexion:

                        }

                        // reportes_reportes_util_getjsonproyectos
                        if ($pathinfo === '/reportes/util/getJsonProyectos') {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_util_getjsonproyectos;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonProyectos',  '_route' => 'reportes_reportes_util_getjsonproyectos',);
                        }
                        not_reportes_reportes_util_getjsonproyectos:

                        // reportes_reportes_util_getjsonbarrios
                        if (0 === strpos($pathinfo, '/reportes/util/getJsonBarrios') && preg_match('#^/reportes/util/getJsonBarrios/(?P<idmunicipio>[^/]++)$#s', $pathinfo, $matches)) {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_util_getjsonbarrios;
                            }

                            return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_getjsonbarrios')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonBarrios',));
                        }
                        not_reportes_reportes_util_getjsonbarrios:

                        // reportes_reportes_util_getjsonestadosventa
                        if ($pathinfo === '/reportes/util/getJsonEstadosVenta') {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_util_getjsonestadosventa;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonEstadosVenta',  '_route' => 'reportes_reportes_util_getjsonestadosventa',);
                        }
                        not_reportes_reportes_util_getjsonestadosventa:

                        // reportes_reportes_util_getjsonliquidaciones
                        if ($pathinfo === '/reportes/util/getJsonLiquidaciones') {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_util_getjsonliquidaciones;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonLiquidaciones',  '_route' => 'reportes_reportes_util_getjsonliquidaciones',);
                        }
                        not_reportes_reportes_util_getjsonliquidaciones:

                        if (0 === strpos($pathinfo, '/reportes/util/getJsonC')) {
                            // reportes_reportes_util_getjsonconceptos
                            if (0 === strpos($pathinfo, '/reportes/util/getJsonConceptosLiquidacion') && preg_match('#^/reportes/util/getJsonConceptosLiquidacion/(?P<liquidacion>[^/]++)$#s', $pathinfo, $matches)) {
                                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                    $allow = array_merge($allow, array('GET', 'HEAD'));
                                    goto not_reportes_reportes_util_getjsonconceptos;
                                }

                                return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_getjsonconceptos')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonConceptos',));
                            }
                            not_reportes_reportes_util_getjsonconceptos:

                            if (0 === strpos($pathinfo, '/reportes/util/getJsonCajeros')) {
                                // reportes_reportes_util_getjsoncajeros
                                if ($pathinfo === '/reportes/util/getJsonCajeros') {
                                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                        $allow = array_merge($allow, array('GET', 'HEAD'));
                                        goto not_reportes_reportes_util_getjsoncajeros;
                                    }

                                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonCajeros',  '_route' => 'reportes_reportes_util_getjsoncajeros',);
                                }
                                not_reportes_reportes_util_getjsoncajeros:

                                // reportes_reportes_util_getjsoncajerosactivos
                                if ($pathinfo === '/reportes/util/getJsonCajerosActivos') {
                                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                        $allow = array_merge($allow, array('GET', 'HEAD'));
                                        goto not_reportes_reportes_util_getjsoncajerosactivos;
                                    }

                                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonCajerosActivos',  '_route' => 'reportes_reportes_util_getjsoncajerosactivos',);
                                }
                                not_reportes_reportes_util_getjsoncajerosactivos:

                            }

                        }

                        // reportes_reportes_util_getjsontipooperacion
                        if ($pathinfo === '/reportes/util/getJsonTipoOperacion') {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_util_getjsontipooperacion;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonTipoOperacion',  '_route' => 'reportes_reportes_util_getjsontipooperacion',);
                        }
                        not_reportes_reportes_util_getjsontipooperacion:

                        // reportes_reportes_util_getjsonnovedadlec
                        if ($pathinfo === '/reportes/util/getJsonNovedadLec') {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_util_getjsonnovedadlec;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonNovedadLec',  '_route' => 'reportes_reportes_util_getjsonnovedadlec',);
                        }
                        not_reportes_reportes_util_getjsonnovedadlec:

                        if (0 === strpos($pathinfo, '/reportes/util/getJsonProyecto')) {
                            // reportes_reportes_util_getjsonproyecto
                            if ($pathinfo === '/reportes/util/getJsonProyecto') {
                                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                    $allow = array_merge($allow, array('GET', 'HEAD'));
                                    goto not_reportes_reportes_util_getjsonproyecto;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonProyecto',  '_route' => 'reportes_reportes_util_getjsonproyecto',);
                            }
                            not_reportes_reportes_util_getjsonproyecto:

                            // reportes_reportes_util_getjsonproyectosempresa
                            if ($pathinfo === '/reportes/util/getJsonProyectosEmpresa') {
                                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                    $allow = array_merge($allow, array('GET', 'HEAD'));
                                    goto not_reportes_reportes_util_getjsonproyectosempresa;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonProyectosEmpresa',  '_route' => 'reportes_reportes_util_getjsonproyectosempresa',);
                            }
                            not_reportes_reportes_util_getjsonproyectosempresa:

                        }

                        // reportes_reportes_util_getjsonliquidacionesventas
                        if ($pathinfo === '/reportes/util/getJsonLiquidacionesVentas') {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_util_getjsonliquidacionesventas;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonLiquidacionesVentas',  '_route' => 'reportes_reportes_util_getjsonliquidacionesventas',);
                        }
                        not_reportes_reportes_util_getjsonliquidacionesventas:

                        // reportes_reportes_util_getjsondocumentopostventas
                        if ($pathinfo === '/reportes/util/getJsonDocumentoPostventas') {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_util_getjsondocumentopostventas;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonDocumentoPostventas',  '_route' => 'reportes_reportes_util_getjsondocumentopostventas',);
                        }
                        not_reportes_reportes_util_getjsondocumentopostventas:

                        // reportes_reportes_util_getjsonterceroinfo
                        if (0 === strpos($pathinfo, '/reportes/util/getJsonTerceroInfo') && preg_match('#^/reportes/util/getJsonTerceroInfo/(?P<tercero>[^/]++)$#s', $pathinfo, $matches)) {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_util_getjsonterceroinfo;
                            }

                            return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_getjsonterceroinfo')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonTerceroInfo',));
                        }
                        not_reportes_reportes_util_getjsonterceroinfo:

                    }

                }

                // reportes_reportes_util_buecarterceropornombreinfo
                if (0 === strpos($pathinfo, '/reportes/util/buscarTerceroInfo') && preg_match('#^/reportes/util/buscarTerceroInfo/(?P<search>[^/]++)/(?P<tipo>[^/]++)$#s', $pathinfo, $matches)) {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_util_buecarterceropornombreinfo;
                    }

                    return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_buecarterceropornombreinfo')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::buecarTerceroPorNombreInfo',));
                }
                not_reportes_reportes_util_buecarterceropornombreinfo:

                if (0 === strpos($pathinfo, '/reportes/util/getJson')) {
                    if (0 === strpos($pathinfo, '/reportes/util/getJsonLiquidacion')) {
                        // reportes_reportes_util_getjsonliquidacionesminas
                        if ($pathinfo === '/reportes/util/getJsonLiquidacionesMinas') {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_util_getjsonliquidacionesminas;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonLiquidacionesMinas',  '_route' => 'reportes_reportes_util_getjsonliquidacionesminas',);
                        }
                        not_reportes_reportes_util_getjsonliquidacionesminas:

                        // reportes_reportes_util_getjsonliquidacionpostventas
                        if ($pathinfo === '/reportes/util/getJsonLiquidacionPostventas') {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_util_getjsonliquidacionpostventas;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonLiquidacionPostventas',  '_route' => 'reportes_reportes_util_getjsonliquidacionpostventas',);
                        }
                        not_reportes_reportes_util_getjsonliquidacionpostventas:

                    }

                    // reportes_reportes_util_getjsontipomovimiento
                    if ($pathinfo === '/reportes/util/getJsonTipoMovimiento') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_getjsontipomovimiento;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonTipoMovimiento',  '_route' => 'reportes_reportes_util_getjsontipomovimiento',);
                    }
                    not_reportes_reportes_util_getjsontipomovimiento:

                    if (0 === strpos($pathinfo, '/reportes/util/getJsonRutas')) {
                        // reportes_reportes_util_getjsonrutas
                        if ($pathinfo === '/reportes/util/getJsonRutas') {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_util_getjsonrutas;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonRutas',  '_route' => 'reportes_reportes_util_getjsonrutas',);
                        }
                        not_reportes_reportes_util_getjsonrutas:

                        // reportes_reportes_util_getjsonrutasciclo
                        if (0 === strpos($pathinfo, '/reportes/util/getJsonRutasCiclo') && preg_match('#^/reportes/util/getJsonRutasCiclo/(?P<ciclo>[^/]++)$#s', $pathinfo, $matches)) {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_util_getjsonrutasciclo;
                            }

                            return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_getjsonrutasciclo')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonRutasCiclo',));
                        }
                        not_reportes_reportes_util_getjsonrutasciclo:

                    }

                    // reportes_reportes_util_getjsonmotivo
                    if (0 === strpos($pathinfo, '/reportes/util/getJsonMotivo') && preg_match('#^/reportes/util/getJsonMotivo/(?P<tipo>[^/]++)$#s', $pathinfo, $matches)) {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_getjsonmotivo;
                        }

                        return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_getjsonmotivo')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonMotivo',));
                    }
                    not_reportes_reportes_util_getjsonmotivo:

                    // reportes_reportes_util_getjsonfiltrosuspension
                    if (0 === strpos($pathinfo, '/reportes/util/getJsonFiltroSuspension') && preg_match('#^/reportes/util/getJsonFiltroSuspension/(?P<filtro>[^/]++)$#s', $pathinfo, $matches)) {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_getjsonfiltrosuspension;
                        }

                        return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_getjsonfiltrosuspension')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonFiltroSuspension',));
                    }
                    not_reportes_reportes_util_getjsonfiltrosuspension:

                    if (0 === strpos($pathinfo, '/reportes/util/getJsonMe')) {
                        // reportes_reportes_util_getjsonmercados
                        if ($pathinfo === '/reportes/util/getJsonMercados') {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_util_getjsonmercados;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonMercados',  '_route' => 'reportes_reportes_util_getjsonmercados',);
                        }
                        not_reportes_reportes_util_getjsonmercados:

                        // reportes_reportes_util_getjsonmediospagos
                        if ($pathinfo === '/reportes/util/getJsonMediosPagos') {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_util_getjsonmediospagos;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonMediosPagos',  '_route' => 'reportes_reportes_util_getjsonmediospagos',);
                        }
                        not_reportes_reportes_util_getjsonmediospagos:

                    }

                    // reportes_reportes_util_getjsonciclosgeneral
                    if ($pathinfo === '/reportes/util/getJsonCiclosGeneral') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_getjsonciclosgeneral;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonCiclosGeneral',  '_route' => 'reportes_reportes_util_getjsonciclosgeneral',);
                    }
                    not_reportes_reportes_util_getjsonciclosgeneral:

                    // reportes_reportes_util_getjsonperiodoscicloactivos
                    if (0 === strpos($pathinfo, '/reportes/util/getJsonPeriodosCicloActivos') && preg_match('#^/reportes/util/getJsonPeriodosCicloActivos/(?P<idciclo>[^/]++)$#s', $pathinfo, $matches)) {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_getjsonperiodoscicloactivos;
                        }

                        return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_getjsonperiodoscicloactivos')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonPeriodosCicloActivos',));
                    }
                    not_reportes_reportes_util_getjsonperiodoscicloactivos:

                    // reportes_reportes_util_getjsonbancosgeneral
                    if ($pathinfo === '/reportes/util/getJsonBancosGeneral') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_getjsonbancosgeneral;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonBancosGeneral',  '_route' => 'reportes_reportes_util_getjsonbancosgeneral',);
                    }
                    not_reportes_reportes_util_getjsonbancosgeneral:

                    // reportes_reportes_util_getjsonciclosgeneralempresa
                    if (0 === strpos($pathinfo, '/reportes/util/getJsonCiclosGeneralEmpresa') && preg_match('#^/reportes/util/getJsonCiclosGeneralEmpresa/(?P<programa>[^/]++)$#s', $pathinfo, $matches)) {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_getjsonciclosgeneralempresa;
                        }

                        return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_getjsonciclosgeneralempresa')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonCiclosGeneralEmpresa',));
                    }
                    not_reportes_reportes_util_getjsonciclosgeneralempresa:

                    // reportes_reportes_util_getjsonbarriospornombre
                    if (0 === strpos($pathinfo, '/reportes/util/getJsonBarriosPorNombre') && preg_match('#^/reportes/util/getJsonBarriosPorNombre/(?P<palabraclave>[^/]++)$#s', $pathinfo, $matches)) {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_getjsonbarriospornombre;
                        }

                        return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_getjsonbarriospornombre')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonBarriosPorNombre',));
                    }
                    not_reportes_reportes_util_getjsonbarriospornombre:

                    // reportes_reportes_util_getjsonusuarioanno
                    if (0 === strpos($pathinfo, '/reportes/util/getJsonUsuarioAnno') && preg_match('#^/reportes/util/getJsonUsuarioAnno/(?P<usuario>[^/]++)$#s', $pathinfo, $matches)) {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_getjsonusuarioanno;
                        }

                        return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_getjsonusuarioanno')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonUsuarioAnno',));
                    }
                    not_reportes_reportes_util_getjsonusuarioanno:

                }

                // reportes_reportes_util_buscarmvigeneral
                if ($pathinfo === '/reportes/util/buscarMviGeneral') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_util_buscarmvigeneral;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::buscarMviGeneral',  '_route' => 'reportes_reportes_util_buscarmvigeneral',);
                }
                not_reportes_reportes_util_buscarmvigeneral:

                if (0 === strpos($pathinfo, '/reportes/util/get')) {
                    // reportes_reportes_util_getdocumentos
                    if ($pathinfo === '/reportes/util/getDocumentos') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_getdocumentos;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getDocumentos',  '_route' => 'reportes_reportes_util_getdocumentos',);
                    }
                    not_reportes_reportes_util_getdocumentos:

                    // reportes_reportes_util_gettiposdocumento
                    if ($pathinfo === '/reportes/util/getTiposDocumento') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_gettiposdocumento;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getTiposDocumento',  '_route' => 'reportes_reportes_util_gettiposdocumento',);
                    }
                    not_reportes_reportes_util_gettiposdocumento:

                    // reportes_reportes_util_getconceptos
                    if ($pathinfo === '/reportes/util/getConceptos') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_getconceptos;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getConceptos',  '_route' => 'reportes_reportes_util_getconceptos',);
                    }
                    not_reportes_reportes_util_getconceptos:

                    // reportes_reportes_util_getjsonpermisohistorico
                    if ($pathinfo === '/reportes/util/getJsonPermisoHistorico') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_getjsonpermisohistorico;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonPermisoHistorico',  '_route' => 'reportes_reportes_util_getjsonpermisohistorico',);
                    }
                    not_reportes_reportes_util_getjsonpermisohistorico:

                    if (0 === strpos($pathinfo, '/reportes/util/getConsultarPeriodosPorAno')) {
                        // reportes_reportes_util_consultarperiodosporano
                        if ($pathinfo === '/reportes/util/getConsultarPeriodosPorAno') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_util_consultarperiodosporano;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::consultarPeriodosPorAno',  '_route' => 'reportes_reportes_util_consultarperiodosporano',);
                        }
                        not_reportes_reportes_util_consultarperiodosporano:

                        // reportes_reportes_util_consultarperiodosporanoace
                        if ($pathinfo === '/reportes/util/getConsultarPeriodosPorAnoAce') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_util_consultarperiodosporanoace;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::consultarPeriodosPorAnoAce',  '_route' => 'reportes_reportes_util_consultarperiodosporanoace',);
                        }
                        not_reportes_reportes_util_consultarperiodosporanoace:

                        // reportes_reportes_util_consultarperiodosporanogeneral
                        if ($pathinfo === '/reportes/util/getConsultarPeriodosPorAnoGeneral') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_util_consultarperiodosporanogeneral;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::consultarPeriodosPorAnoGeneral',  '_route' => 'reportes_reportes_util_consultarperiodosporanogeneral',);
                        }
                        not_reportes_reportes_util_consultarperiodosporanogeneral:

                    }

                    if (0 === strpos($pathinfo, '/reportes/util/getJson')) {
                        // reportes_reportes_util_getjsoncajeromedpago
                        if (0 === strpos($pathinfo, '/reportes/util/getJsonCajeroMedPago') && preg_match('#^/reportes/util/getJsonCajeroMedPago/(?P<idMedioPago>[^/]++)$#s', $pathinfo, $matches)) {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_util_getjsoncajeromedpago;
                            }

                            return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_getjsoncajeromedpago')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonCajeroMedPago',));
                        }
                        not_reportes_reportes_util_getjsoncajeromedpago:

                        // reportes_reportes_util_getjsonmercadosactivos
                        if ($pathinfo === '/reportes/util/getJsonMercadosActivos') {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_util_getjsonmercadosactivos;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getJsonMercadosActivos',  '_route' => 'reportes_reportes_util_getjsonmercadosactivos',);
                        }
                        not_reportes_reportes_util_getjsonmercadosactivos:

                    }

                }

                if (0 === strpos($pathinfo, '/reportes/util/consulta')) {
                    // reportes_reportes_util_consultaperiodostarifas
                    if ($pathinfo === '/reportes/util/consultaPeriodosTarifas') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_consultaperiodostarifas;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::consultaPeriodosTarifas',  '_route' => 'reportes_reportes_util_consultaperiodostarifas',);
                    }
                    not_reportes_reportes_util_consultaperiodostarifas:

                    // reportes_reportes_util_consultarempresageneral
                    if ($pathinfo === '/reportes/util/consultarEmpresaGeneral') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_consultarempresageneral;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::consultarEmpresaGeneral',  '_route' => 'reportes_reportes_util_consultarempresageneral',);
                    }
                    not_reportes_reportes_util_consultarempresageneral:

                }

                if (0 === strpos($pathinfo, '/reportes/util/getConsulta')) {
                    // reportes_reportes_util_getconsultarcategoriaempresa
                    if (0 === strpos($pathinfo, '/reportes/util/getConsultarCategoriaEmpresa') && preg_match('#^/reportes/util/getConsultarCategoriaEmpresa/(?P<empresa>[^/]++)$#s', $pathinfo, $matches)) {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_getconsultarcategoriaempresa;
                        }

                        return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_getconsultarcategoriaempresa')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getConsultarCategoriaEmpresa',));
                    }
                    not_reportes_reportes_util_getconsultarcategoriaempresa:

                    // reportes_reportes_util_getconsultaunidadescategoria
                    if (0 === strpos($pathinfo, '/reportes/util/getConsultaUnidadesCategoria') && preg_match('#^/reportes/util/getConsultaUnidadesCategoria/(?P<categoria>[^/]++)$#s', $pathinfo, $matches)) {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_getconsultaunidadescategoria;
                        }

                        return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_getconsultaunidadescategoria')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getConsultaUnidadesCategoria',));
                    }
                    not_reportes_reportes_util_getconsultaunidadescategoria:

                }

                // reportes_reportes_util_consultarreporteunidades
                if ($pathinfo === '/reportes/util/consultarReporteUnidades') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_util_consultarreporteunidades;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::consultarReporteUnidades',  '_route' => 'reportes_reportes_util_consultarreporteunidades',);
                }
                not_reportes_reportes_util_consultarreporteunidades:

                if (0 === strpos($pathinfo, '/reportes/util/getConsultar')) {
                    // reportes_reportes_util_getconsultarciclosempresareporte
                    if (0 === strpos($pathinfo, '/reportes/util/getConsultarCiclosEmpresaReporte') && preg_match('#^/reportes/util/getConsultarCiclosEmpresaReporte/(?P<empresa>[^/]++)$#s', $pathinfo, $matches)) {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_getconsultarciclosempresareporte;
                        }

                        return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_getconsultarciclosempresareporte')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getConsultarCiclosEmpresaReporte',));
                    }
                    not_reportes_reportes_util_getconsultarciclosempresareporte:

                    // reportes_reportes_util_getconsultarproyectoempresareporte
                    if (0 === strpos($pathinfo, '/reportes/util/getConsultarProyectoEmpresaReporte') && preg_match('#^/reportes/util/getConsultarProyectoEmpresaReporte/(?P<empresa>[^/]++)$#s', $pathinfo, $matches)) {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_util_getconsultarproyectoempresareporte;
                        }

                        return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_util_getconsultarproyectoempresareporte')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\UtilController::getConsultarProyectoEmpresaReporte',));
                    }
                    not_reportes_reportes_util_getconsultarproyectoempresareporte:

                }

            }

            if (0 === strpos($pathinfo, '/reportes/contratosTable/get')) {
                // reportes_reportes_contratostable_getinfo
                if ($pathinfo === '/reportes/contratosTable/getInfo') {
                    if (!in_array($this->context->getMethod(), array('POST', 'GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('POST', 'GET', 'HEAD'));
                        goto not_reportes_reportes_contratostable_getinfo;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ContratosTableController::getInfo',  '_route' => 'reportes_reportes_contratostable_getinfo',);
                }
                not_reportes_reportes_contratostable_getinfo:

                // reportes_reportes_contratostable_getcolumns
                if ($pathinfo === '/reportes/contratosTable/getColumns') {
                    if (!in_array($this->context->getMethod(), array('POST', 'GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('POST', 'GET', 'HEAD'));
                        goto not_reportes_reportes_contratostable_getcolumns;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ContratosTableController::getColumns',  '_route' => 'reportes_reportes_contratostable_getcolumns',);
                }
                not_reportes_reportes_contratostable_getcolumns:

            }

            if (0 === strpos($pathinfo, '/reportes/table/devoluciones/get')) {
                // reportes_reportes_devolucionestable_getinfo
                if ($pathinfo === '/reportes/table/devoluciones/getData') {
                    if (!in_array($this->context->getMethod(), array('POST', 'GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('POST', 'GET', 'HEAD'));
                        goto not_reportes_reportes_devolucionestable_getinfo;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\DevolucionesTableController::getInfo',  '_route' => 'reportes_reportes_devolucionestable_getinfo',);
                }
                not_reportes_reportes_devolucionestable_getinfo:

                // reportes_reportes_devolucionestable_getcolumns
                if ($pathinfo === '/reportes/table/devoluciones/getColumns') {
                    if (!in_array($this->context->getMethod(), array('POST', 'GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('POST', 'GET', 'HEAD'));
                        goto not_reportes_reportes_devolucionestable_getcolumns;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\DevolucionesTableController::getColumns',  '_route' => 'reportes_reportes_devolucionestable_getcolumns',);
                }
                not_reportes_reportes_devolucionestable_getcolumns:

            }

            if (0 === strpos($pathinfo, '/reportes/recaudos')) {
                // reportes_reportes_consignacionrecaudo_consignacionrecaudo
                if ($pathinfo === '/reportes/recaudos/consignacionRecaudo') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_consignacionrecaudo_consignacionrecaudo;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::consignacionRecaudo',  '_route' => 'reportes_reportes_consignacionrecaudo_consignacionrecaudo',);
                }
                not_reportes_reportes_consignacionrecaudo_consignacionrecaudo:

                // reportes_reportes_consignacionrecaudo_generarreporteconsignacionrecaudo
                if ($pathinfo === '/reportes/recaudos/generarReporteConsignacionRecaudo') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_consignacionrecaudo_generarreporteconsignacionrecaudo;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarReporteConsignacionRecaudo',  '_route' => 'reportes_reportes_consignacionrecaudo_generarreporteconsignacionrecaudo',);
                }
                not_reportes_reportes_consignacionrecaudo_generarreporteconsignacionrecaudo:

                // reportes_reportes_consignacionrecaudo_recaudofinmes
                if ($pathinfo === '/reportes/recaudos/recaudoFinMes') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_consignacionrecaudo_recaudofinmes;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::recaudoFinMes',  '_route' => 'reportes_reportes_consignacionrecaudo_recaudofinmes',);
                }
                not_reportes_reportes_consignacionrecaudo_recaudofinmes:

                // reportes_reportes_consignacionrecaudo_contactcenter
                if ($pathinfo === '/reportes/recaudos/contactCenter') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_consignacionrecaudo_contactcenter;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::contactCenter',  '_route' => 'reportes_reportes_consignacionrecaudo_contactcenter',);
                }
                not_reportes_reportes_consignacionrecaudo_contactcenter:

                if (0 === strpos($pathinfo, '/reportes/recaudos/generar')) {
                    // reportes_reportes_consignacionrecaudo_generarcontactcenter
                    if ($pathinfo === '/reportes/recaudos/generarContactCenter') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_consignacionrecaudo_generarcontactcenter;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarContactCenter',  '_route' => 'reportes_reportes_consignacionrecaudo_generarcontactcenter',);
                    }
                    not_reportes_reportes_consignacionrecaudo_generarcontactcenter:

                    // reportes_reportes_consignacionrecaudo_generarreportecontactcenterdirecto
                    if ($pathinfo === '/reportes/recaudos/generarReporteContactCenterDirecto') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_consignacionrecaudo_generarreportecontactcenterdirecto;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarReporteContactCenterDirecto',  '_route' => 'reportes_reportes_consignacionrecaudo_generarreportecontactcenterdirecto',);
                    }
                    not_reportes_reportes_consignacionrecaudo_generarreportecontactcenterdirecto:

                }

                // reportes_reportes_consignacionrecaudo_suscripcioncastigada
                if ($pathinfo === '/reportes/recaudos/suscripcionCastigada') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_consignacionrecaudo_suscripcioncastigada;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::suscripcionCastigada',  '_route' => 'reportes_reportes_consignacionrecaudo_suscripcioncastigada',);
                }
                not_reportes_reportes_consignacionrecaudo_suscripcioncastigada:

                if (0 === strpos($pathinfo, '/reportes/recaudos/generarSuscripcionCastigada')) {
                    // reportes_reportes_consignacionrecaudo_generarsuscripcioncastigada
                    if ($pathinfo === '/reportes/recaudos/generarSuscripcionCastigada') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_consignacionrecaudo_generarsuscripcioncastigada;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarSuscripcionCastigada',  '_route' => 'reportes_reportes_consignacionrecaudo_generarsuscripcioncastigada',);
                    }
                    not_reportes_reportes_consignacionrecaudo_generarsuscripcioncastigada:

                    // reportes_reportes_consignacionrecaudo_generarsuscripcioncastigadaagrupada
                    if ($pathinfo === '/reportes/recaudos/generarSuscripcionCastigadaAgrupada') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_consignacionrecaudo_generarsuscripcioncastigadaagrupada;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarSuscripcionCastigadaAgrupada',  '_route' => 'reportes_reportes_consignacionrecaudo_generarsuscripcioncastigadaagrupada',);
                    }
                    not_reportes_reportes_consignacionrecaudo_generarsuscripcioncastigadaagrupada:

                    // reportes_reportes_consignacionrecaudo_generarsuscripcioncastigadasin
                    if ($pathinfo === '/reportes/recaudos/generarSuscripcionCastigadasin') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_consignacionrecaudo_generarsuscripcioncastigadasin;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarSuscripcionCastigadasin',  '_route' => 'reportes_reportes_consignacionrecaudo_generarsuscripcioncastigadasin',);
                    }
                    not_reportes_reportes_consignacionrecaudo_generarsuscripcioncastigadasin:

                }

                // reportes_reportes_consignacionrecaudo_reconexionespago
                if ($pathinfo === '/reportes/recaudos/reconexionesPago') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_consignacionrecaudo_reconexionespago;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::reconexionesPago',  '_route' => 'reportes_reportes_consignacionrecaudo_reconexionespago',);
                }
                not_reportes_reportes_consignacionrecaudo_reconexionespago:

                if (0 === strpos($pathinfo, '/reportes/recaudos/generarreconexiones')) {
                    // reportes_reportes_consignacionrecaudo_generarreconexionespago
                    if ($pathinfo === '/reportes/recaudos/generarreconexionesPago') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_consignacionrecaudo_generarreconexionespago;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarreconexionesPago',  '_route' => 'reportes_reportes_consignacionrecaudo_generarreconexionespago',);
                    }
                    not_reportes_reportes_consignacionrecaudo_generarreconexionespago:

                    // reportes_reportes_consignacionrecaudo_generarreconexionesmañana
                    if ($pathinfo === '/reportes/recaudos/generarreconexionesMañana') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_consignacionrecaudo_generarreconexionesmaana;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarreconexionesMañana',  '_route' => 'reportes_reportes_consignacionrecaudo_generarreconexionesmañana',);
                    }
                    not_reportes_reportes_consignacionrecaudo_generarreconexionesmaana:

                }

                // reportes_reportes_consignacionrecaudo_reportebiodia
                if ($pathinfo === '/reportes/recaudos/reporteBioDia') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_consignacionrecaudo_reportebiodia;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::reporteBioDia',  '_route' => 'reportes_reportes_consignacionrecaudo_reportebiodia',);
                }
                not_reportes_reportes_consignacionrecaudo_reportebiodia:

                // reportes_reportes_consignacionrecaudo_generarreportebiodia
                if ($pathinfo === '/reportes/recaudos/generarReporteBioDia') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_consignacionrecaudo_generarreportebiodia;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarReporteBioDia',  '_route' => 'reportes_reportes_consignacionrecaudo_generarreportebiodia',);
                }
                not_reportes_reportes_consignacionrecaudo_generarreportebiodia:

                // reportes_reportes_consignacionrecaudo_movimientocontable
                if ($pathinfo === '/reportes/recaudos/movimientoContable') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_consignacionrecaudo_movimientocontable;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::movimientoContable',  '_route' => 'reportes_reportes_consignacionrecaudo_movimientocontable',);
                }
                not_reportes_reportes_consignacionrecaudo_movimientocontable:

                // reportes_reportes_consignacionrecaudo_listasuspensionesreconexiones
                if ($pathinfo === '/reportes/recaudos/listaSuspensionesReconexiones') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_consignacionrecaudo_listasuspensionesreconexiones;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::listaSuspensionesReconexiones',  '_route' => 'reportes_reportes_consignacionrecaudo_listasuspensionesreconexiones',);
                }
                not_reportes_reportes_consignacionrecaudo_listasuspensionesreconexiones:

                if (0 === strpos($pathinfo, '/reportes/recaudos/generar')) {
                    if (0 === strpos($pathinfo, '/reportes/recaudos/generarLista')) {
                        // reportes_reportes_consignacionrecaudo_generarlistasuspensionesrtr
                        if ($pathinfo === '/reportes/recaudos/generarListaSuspensionesRTR') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_consignacionrecaudo_generarlistasuspensionesrtr;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarListaSuspensionesRTR',  '_route' => 'reportes_reportes_consignacionrecaudo_generarlistasuspensionesrtr',);
                        }
                        not_reportes_reportes_consignacionrecaudo_generarlistasuspensionesrtr:

                        // reportes_reportes_consignacionrecaudo_generarlistareconexionesrtr
                        if ($pathinfo === '/reportes/recaudos/generarListaReconexionesRTR') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_consignacionrecaudo_generarlistareconexionesrtr;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarListaReconexionesRTR',  '_route' => 'reportes_reportes_consignacionrecaudo_generarlistareconexionesrtr',);
                        }
                        not_reportes_reportes_consignacionrecaudo_generarlistareconexionesrtr:

                        // reportes_reportes_consignacionrecaudo_generarlistasuspensionesfacturacion
                        if ($pathinfo === '/reportes/recaudos/generarListaSuspensionesFacturacion') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_consignacionrecaudo_generarlistasuspensionesfacturacion;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarListaSuspensionesFacturacion',  '_route' => 'reportes_reportes_consignacionrecaudo_generarlistasuspensionesfacturacion',);
                        }
                        not_reportes_reportes_consignacionrecaudo_generarlistasuspensionesfacturacion:

                        // reportes_reportes_consignacionrecaudo_generarlistareconexionesfacturacion
                        if ($pathinfo === '/reportes/recaudos/generarListaReconexionesFacturacion') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_consignacionrecaudo_generarlistareconexionesfacturacion;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarListaReconexionesFacturacion',  '_route' => 'reportes_reportes_consignacionrecaudo_generarlistareconexionesfacturacion',);
                        }
                        not_reportes_reportes_consignacionrecaudo_generarlistareconexionesfacturacion:

                    }

                    // reportes_reportes_consignacionrecaudo_generarreconexionesantespago
                    if ($pathinfo === '/reportes/recaudos/generarreconexionesAntesPago') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_consignacionrecaudo_generarreconexionesantespago;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarreconexionesAntesPago',  '_route' => 'reportes_reportes_consignacionrecaudo_generarreconexionesantespago',);
                    }
                    not_reportes_reportes_consignacionrecaudo_generarreconexionesantespago:

                }

                // reportes_reportes_consignacionrecaudo_centralesriesgo
                if ($pathinfo === '/reportes/recaudos/centralesRiesgo') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_consignacionrecaudo_centralesriesgo;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::centralesRiesgo',  '_route' => 'reportes_reportes_consignacionrecaudo_centralesriesgo',);
                }
                not_reportes_reportes_consignacionrecaudo_centralesriesgo:

                if (0 === strpos($pathinfo, '/reportes/recaudos/generar')) {
                    if (0 === strpos($pathinfo, '/reportes/recaudos/generarCentralesRies')) {
                        if (0 === strpos($pathinfo, '/reportes/recaudos/generarCentralesRiesgo')) {
                            // reportes_reportes_consignacionrecaudo_generarcentralesriesgo
                            if ($pathinfo === '/reportes/recaudos/generarCentralesRiesgo') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_consignacionrecaudo_generarcentralesriesgo;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarCentralesRiesgo',  '_route' => 'reportes_reportes_consignacionrecaudo_generarcentralesriesgo',);
                            }
                            not_reportes_reportes_consignacionrecaudo_generarcentralesriesgo:

                            // reportes_reportes_consignacionrecaudo_generarcentralesriesgoexcel
                            if ($pathinfo === '/reportes/recaudos/generarCentralesRiesgoExcel') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_consignacionrecaudo_generarcentralesriesgoexcel;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarCentralesRiesgoExcel',  '_route' => 'reportes_reportes_consignacionrecaudo_generarcentralesriesgoexcel',);
                            }
                            not_reportes_reportes_consignacionrecaudo_generarcentralesriesgoexcel:

                        }

                        // reportes_reportes_consignacionrecaudo_generarcentralesriespositivo
                        if ($pathinfo === '/reportes/recaudos/generarCentralesRiesPositivo') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_consignacionrecaudo_generarcentralesriespositivo;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarCentralesRiesPositivo',  '_route' => 'reportes_reportes_consignacionrecaudo_generarcentralesriespositivo',);
                        }
                        not_reportes_reportes_consignacionrecaudo_generarcentralesriespositivo:

                    }

                    if (0 === strpos($pathinfo, '/reportes/recaudos/generarReporte')) {
                        // reportes_reportes_consignacionrecaudo_generarreportemovimientocontable
                        if ($pathinfo === '/reportes/recaudos/generarReporteMovimientoContable') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_consignacionrecaudo_generarreportemovimientocontable;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarReporteMovimientoContable',  '_route' => 'reportes_reportes_consignacionrecaudo_generarreportemovimientocontable',);
                        }
                        not_reportes_reportes_consignacionrecaudo_generarreportemovimientocontable:

                        // reportes_reportes_consignacionrecaudo_generarreporterecaudofinmes
                        if ($pathinfo === '/reportes/recaudos/generarReporteRecaudoFinMes') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_consignacionrecaudo_generarreporterecaudofinmes;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarReporteRecaudoFinMes',  '_route' => 'reportes_reportes_consignacionrecaudo_generarreporterecaudofinmes',);
                        }
                        not_reportes_reportes_consignacionrecaudo_generarreporterecaudofinmes:

                    }

                    // reportes_reportes_consignacionrecaudo_generarlistasuspensionespagofacturacion
                    if ($pathinfo === '/reportes/recaudos/generarListaSuspensionesPagoFacturacion') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_consignacionrecaudo_generarlistasuspensionespagofacturacion;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarListaSuspensionesPagoFacturacion',  '_route' => 'reportes_reportes_consignacionrecaudo_generarlistasuspensionespagofacturacion',);
                    }
                    not_reportes_reportes_consignacionrecaudo_generarlistasuspensionespagofacturacion:

                }

                // reportes_reportes_consignacionrecaudo_buscaremvexpmovimient
                if ($pathinfo === '/reportes/recaudos/buscarEmvExpmovimient') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_consignacionrecaudo_buscaremvexpmovimient;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::buscarEmvExpmovimient',  '_route' => 'reportes_reportes_consignacionrecaudo_buscaremvexpmovimient',);
                }
                not_reportes_reportes_consignacionrecaudo_buscaremvexpmovimient:

                if (0 === strpos($pathinfo, '/reportes/recaudos/ge')) {
                    // reportes_reportes_consignacionrecaudo_generarmovimientodetallado
                    if ($pathinfo === '/reportes/recaudos/generarMovimientoDetallado') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_consignacionrecaudo_generarmovimientodetallado;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarMovimientoDetallado',  '_route' => 'reportes_reportes_consignacionrecaudo_generarmovimientodetallado',);
                    }
                    not_reportes_reportes_consignacionrecaudo_generarmovimientodetallado:

                    // reportes_reportes_consignacionrecaudo_getjsonmediospagousuario
                    if ($pathinfo === '/reportes/recaudos/getJsonMediosPagoUsuario') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_consignacionrecaudo_getjsonmediospagousuario;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::getJsonMediosPagoUsuario',  '_route' => 'reportes_reportes_consignacionrecaudo_getjsonmediospagousuario',);
                    }
                    not_reportes_reportes_consignacionrecaudo_getjsonmediospagousuario:

                    // reportes_reportes_consignacionrecaudo_generarmorosossspd
                    if ($pathinfo === '/reportes/recaudos/generarMorososSSPD') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_consignacionrecaudo_generarmorosossspd;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarMorososSSPD',  '_route' => 'reportes_reportes_consignacionrecaudo_generarmorosossspd',);
                    }
                    not_reportes_reportes_consignacionrecaudo_generarmorosossspd:

                }

                // reportes_reportes_consignacionrecaudo_reporteincompletoswere
                if ($pathinfo === '/reportes/recaudos/reporteIncompletosWERE') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_consignacionrecaudo_reporteincompletoswere;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::reporteIncompletosWERE',  '_route' => 'reportes_reportes_consignacionrecaudo_reporteincompletoswere',);
                }
                not_reportes_reportes_consignacionrecaudo_reporteincompletoswere:

                // reportes_reportes_consignacionrecaudo_generarreporteincompletoswere
                if ($pathinfo === '/reportes/recaudos/generarReporteIncompletosWERE') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_consignacionrecaudo_generarreporteincompletoswere;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConsignacionRecaudoController::generarReporteIncompletosWERE',  '_route' => 'reportes_reportes_consignacionrecaudo_generarreporteincompletoswere',);
                }
                not_reportes_reportes_consignacionrecaudo_generarreporteincompletoswere:

            }

            if (0 === strpos($pathinfo, '/reportes/financiaciones')) {
                // reportes_reportes_financiacion_financiacionconcepto
                if ($pathinfo === '/reportes/financiaciones/financiacionConcepto') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_financiacion_financiacionconcepto;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FinanciacionController::financiacionConcepto',  '_route' => 'reportes_reportes_financiacion_financiacionconcepto',);
                }
                not_reportes_reportes_financiacion_financiacionconcepto:

                // reportes_reportes_financiacion_generarfinanciacionconcepto
                if ($pathinfo === '/reportes/financiaciones/generarFinanciacionConcepto') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_financiacion_generarfinanciacionconcepto;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FinanciacionController::generarFinanciacionConcepto',  '_route' => 'reportes_reportes_financiacion_generarfinanciacionconcepto',);
                }
                not_reportes_reportes_financiacion_generarfinanciacionconcepto:

                // reportes_reportes_financiacion_estadocuentafinanciacion
                if ($pathinfo === '/reportes/financiaciones/estadoCuentaFinanciacion') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_financiacion_estadocuentafinanciacion;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FinanciacionController::estadoCuentaFinanciacion',  '_route' => 'reportes_reportes_financiacion_estadocuentafinanciacion',);
                }
                not_reportes_reportes_financiacion_estadocuentafinanciacion:

                if (0 === strpos($pathinfo, '/reportes/financiaciones/generarReporte')) {
                    if (0 === strpos($pathinfo, '/reportes/financiaciones/generarReporteEstadoCuentaFinanciacion')) {
                        // reportes_reportes_financiacion_generarreporteestadocuentafinanciacion
                        if ($pathinfo === '/reportes/financiaciones/generarReporteEstadoCuentaFinanciacion') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_financiacion_generarreporteestadocuentafinanciacion;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FinanciacionController::generarReporteEstadoCuentaFinanciacion',  '_route' => 'reportes_reportes_financiacion_generarreporteestadocuentafinanciacion',);
                        }
                        not_reportes_reportes_financiacion_generarreporteestadocuentafinanciacion:

                        // reportes_reportes_financiacion_generarreporteestadocuentafinanciacion2
                        if ($pathinfo === '/reportes/financiaciones/generarReporteEstadoCuentaFinanciacion2') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_financiacion_generarreporteestadocuentafinanciacion2;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FinanciacionController::generarReporteEstadoCuentaFinanciacion2',  '_route' => 'reportes_reportes_financiacion_generarreporteestadocuentafinanciacion2',);
                        }
                        not_reportes_reportes_financiacion_generarreporteestadocuentafinanciacion2:

                    }

                    // reportes_reportes_financiacion_generarrepsaldofinanciacion
                    if ($pathinfo === '/reportes/financiaciones/generarReporteSaldoFinanciacion') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_financiacion_generarrepsaldofinanciacion;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FinanciacionController::generarRepSaldoFinanciacion',  '_route' => 'reportes_reportes_financiacion_generarrepsaldofinanciacion',);
                    }
                    not_reportes_reportes_financiacion_generarrepsaldofinanciacion:

                }

            }

            if (0 === strpos($pathinfo, '/reportes/c')) {
                if (0 === strpos($pathinfo, '/reportes/cartera')) {
                    // reportes_reportes_recuperacioncartera_recuperacioncartera
                    if ($pathinfo === '/reportes/cartera/recuperacionCartera') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_recuperacioncartera_recuperacioncartera;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\RecuperacionCarteraController::recuperacionCartera',  '_route' => 'reportes_reportes_recuperacioncartera_recuperacioncartera',);
                    }
                    not_reportes_reportes_recuperacioncartera_recuperacioncartera:

                    if (0 === strpos($pathinfo, '/reportes/cartera/generarReporte')) {
                        // reportes_reportes_recuperacioncartera_generarreporterecuperacioncartera
                        if ($pathinfo === '/reportes/cartera/generarReporteRecuperacionCartera') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_recuperacioncartera_generarreporterecuperacioncartera;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\RecuperacionCarteraController::generarReporteRecuperacionCartera',  '_route' => 'reportes_reportes_recuperacioncartera_generarreporterecuperacioncartera',);
                        }
                        not_reportes_reportes_recuperacioncartera_generarreporterecuperacioncartera:

                        // reportes_reportes_recuperacioncartera_generarreporteefectividadrecuperacioncartera
                        if ($pathinfo === '/reportes/cartera/generarReporteEfectividadRecuperacionCartera') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_recuperacioncartera_generarreporteefectividadrecuperacioncartera;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\RecuperacionCarteraController::generarReporteEfectividadRecuperacionCartera',  '_route' => 'reportes_reportes_recuperacioncartera_generarreporteefectividadrecuperacioncartera',);
                        }
                        not_reportes_reportes_recuperacioncartera_generarreporteefectividadrecuperacioncartera:

                        // reportes_reportes_recuperacioncartera_generarreportegestioncobrocartera
                        if ($pathinfo === '/reportes/cartera/generarReporteGestionCobroCartera') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_recuperacioncartera_generarreportegestioncobrocartera;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\RecuperacionCarteraController::generarReporteGestionCobroCartera',  '_route' => 'reportes_reportes_recuperacioncartera_generarreportegestioncobrocartera',);
                        }
                        not_reportes_reportes_recuperacioncartera_generarreportegestioncobrocartera:

                    }

                }

                if (0 === strpos($pathinfo, '/reportes/contribucion')) {
                    // reportes_reportes_subsidiocontribucion_exentoscontribucion
                    if ($pathinfo === '/reportes/contribucion/exentosContribucion') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_subsidiocontribucion_exentoscontribucion;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::exentosContribucion',  '_route' => 'reportes_reportes_subsidiocontribucion_exentoscontribucion',);
                    }
                    not_reportes_reportes_subsidiocontribucion_exentoscontribucion:

                    // reportes_reportes_subsidiocontribucion_generarreporteexentoscontribucion
                    if ($pathinfo === '/reportes/contribucion/generarReporteExentosContribucion') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_subsidiocontribucion_generarreporteexentoscontribucion;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarReporteExentosContribucion',  '_route' => 'reportes_reportes_subsidiocontribucion_generarreporteexentoscontribucion',);
                    }
                    not_reportes_reportes_subsidiocontribucion_generarreporteexentoscontribucion:

                    // reportes_reportes_subsidiocontribucion_contribuciontipo
                    if ($pathinfo === '/reportes/contribucion/contribucionTipo') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_subsidiocontribucion_contribuciontipo;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::contribucionTipo',  '_route' => 'reportes_reportes_subsidiocontribucion_contribuciontipo',);
                    }
                    not_reportes_reportes_subsidiocontribucion_contribuciontipo:

                    if (0 === strpos($pathinfo, '/reportes/contribucion/generarReporteContribucion')) {
                        // reportes_reportes_subsidiocontribucion_generarreportecontribucion
                        if ($pathinfo === '/reportes/contribucion/generarReporteContribucion') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_subsidiocontribucion_generarreportecontribucion;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarReporteContribucion',  '_route' => 'reportes_reportes_subsidiocontribucion_generarreportecontribucion',);
                        }
                        not_reportes_reportes_subsidiocontribucion_generarreportecontribucion:

                        // reportes_reportes_subsidiocontribucion_generarreportecontribucionresidencial
                        if ($pathinfo === '/reportes/contribucion/generarReporteContribucionResidencial') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_subsidiocontribucion_generarreportecontribucionresidencial;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarReporteContribucionResidencial',  '_route' => 'reportes_reportes_subsidiocontribucion_generarreportecontribucionresidencial',);
                        }
                        not_reportes_reportes_subsidiocontribucion_generarreportecontribucionresidencial:

                    }

                    // reportes_reportes_subsidiocontribucion_reconexionespago
                    if ($pathinfo === '/reportes/contribucion/reconexionesPago') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_subsidiocontribucion_reconexionespago;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::reconexionesPago',  '_route' => 'reportes_reportes_subsidiocontribucion_reconexionespago',);
                    }
                    not_reportes_reportes_subsidiocontribucion_reconexionespago:

                    // reportes_reportes_subsidiocontribucion_generarreconexionespago
                    if ($pathinfo === '/reportes/contribucion/generarreconexionesPago') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_subsidiocontribucion_generarreconexionespago;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarreconexionesPago',  '_route' => 'reportes_reportes_subsidiocontribucion_generarreconexionespago',);
                    }
                    not_reportes_reportes_subsidiocontribucion_generarreconexionespago:

                    // reportes_reportes_subsidiocontribucion_subsidiotipo
                    if ($pathinfo === '/reportes/contribucion/provisionGeneral') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_subsidiocontribucion_subsidiotipo;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::subsidioTipo',  '_route' => 'reportes_reportes_subsidiocontribucion_subsidiotipo',);
                    }
                    not_reportes_reportes_subsidiocontribucion_subsidiotipo:

                    if (0 === strpos($pathinfo, '/reportes/contribucion/genera')) {
                        if (0 === strpos($pathinfo, '/reportes/contribucion/generarProvision')) {
                            // reportes_reportes_subsidiocontribucion_generarprovisiongeneral
                            if ($pathinfo === '/reportes/contribucion/generarProvisionGeneral') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_subsidiocontribucion_generarprovisiongeneral;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarProvisionGeneral',  '_route' => 'reportes_reportes_subsidiocontribucion_generarprovisiongeneral',);
                            }
                            not_reportes_reportes_subsidiocontribucion_generarprovisiongeneral:

                            // reportes_reportes_subsidiocontribucion_generarprovisionvillavo
                            if ($pathinfo === '/reportes/contribucion/generarProvisionVillavo') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_subsidiocontribucion_generarprovisionvillavo;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarProvisionVillavo',  '_route' => 'reportes_reportes_subsidiocontribucion_generarprovisionvillavo',);
                            }
                            not_reportes_reportes_subsidiocontribucion_generarprovisionvillavo:

                        }

                        // reportes_reportes_subsidiocontribucion_generalfacongas
                        if ($pathinfo === '/reportes/contribucion/generalFacongas') {
                            if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                                $allow = array_merge($allow, array('GET', 'HEAD'));
                                goto not_reportes_reportes_subsidiocontribucion_generalfacongas;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generalFacongas',  '_route' => 'reportes_reportes_subsidiocontribucion_generalfacongas',);
                        }
                        not_reportes_reportes_subsidiocontribucion_generalfacongas:

                    }

                    if (0 === strpos($pathinfo, '/reportes/contribucion/GenerarFacongas')) {
                        // reportes_reportes_subsidiocontribucion_generarfacongas
                        if ($pathinfo === '/reportes/contribucion/GenerarFacongas') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_subsidiocontribucion_generarfacongas;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::GenerarFacongas',  '_route' => 'reportes_reportes_subsidiocontribucion_generarfacongas',);
                        }
                        not_reportes_reportes_subsidiocontribucion_generarfacongas:

                        // reportes_reportes_subsidiocontribucion_generarfacongasvillavo
                        if ($pathinfo === '/reportes/contribucion/GenerarFacongasVillavo') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_subsidiocontribucion_generarfacongasvillavo;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::GenerarFacongasVillavo',  '_route' => 'reportes_reportes_subsidiocontribucion_generarfacongasvillavo',);
                        }
                        not_reportes_reportes_subsidiocontribucion_generarfacongasvillavo:

                    }

                    if (0 === strpos($pathinfo, '/reportes/contribucion/generar')) {
                        if (0 === strpos($pathinfo, '/reportes/contribucion/generarProvision')) {
                            // reportes_reportes_subsidiocontribucion_generarprovisionvillavoperiodo
                            if ($pathinfo === '/reportes/contribucion/generarProvisionVillavoPeriodo') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_subsidiocontribucion_generarprovisionvillavoperiodo;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarProvisionVillavoPeriodo',  '_route' => 'reportes_reportes_subsidiocontribucion_generarprovisionvillavoperiodo',);
                            }
                            not_reportes_reportes_subsidiocontribucion_generarprovisionvillavoperiodo:

                            // reportes_reportes_subsidiocontribucion_generarprovisionperiodomunicipios
                            if ($pathinfo === '/reportes/contribucion/generarProvisionPeriodoMunicipios') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_subsidiocontribucion_generarprovisionperiodomunicipios;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarProvisionPeriodoMunicipios',  '_route' => 'reportes_reportes_subsidiocontribucion_generarprovisionperiodomunicipios',);
                            }
                            not_reportes_reportes_subsidiocontribucion_generarprovisionperiodomunicipios:

                        }

                        // reportes_reportes_subsidiocontribucion_generarreportesubsidiocontribucion
                        if ($pathinfo === '/reportes/contribucion/generarReporteSubsidioContribucion') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_subsidiocontribucion_generarreportesubsidiocontribucion;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarReporteSubsidioContribucion',  '_route' => 'reportes_reportes_subsidiocontribucion_generarreportesubsidiocontribucion',);
                        }
                        not_reportes_reportes_subsidiocontribucion_generarreportesubsidiocontribucion:

                        if (0 === strpos($pathinfo, '/reportes/contribucion/generarFacongas')) {
                            // reportes_reportes_subsidiocontribucion_generarfacongasmunicipios
                            if ($pathinfo === '/reportes/contribucion/generarFacongasMunicipios') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_subsidiocontribucion_generarfacongasmunicipios;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarFacongasMunicipios',  '_route' => 'reportes_reportes_subsidiocontribucion_generarfacongasmunicipios',);
                            }
                            not_reportes_reportes_subsidiocontribucion_generarfacongasmunicipios:

                            // reportes_reportes_subsidiocontribucion_generarfacongasvillavomes
                            if ($pathinfo === '/reportes/contribucion/generarFacongasVillavoMes') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_subsidiocontribucion_generarfacongasvillavomes;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarFacongasVillavoMes',  '_route' => 'reportes_reportes_subsidiocontribucion_generarfacongasvillavomes',);
                            }
                            not_reportes_reportes_subsidiocontribucion_generarfacongasvillavomes:

                        }

                        if (0 === strpos($pathinfo, '/reportes/contribucion/generarContribucion')) {
                            // reportes_reportes_subsidiocontribucion_generarcontribucionmes
                            if ($pathinfo === '/reportes/contribucion/generarContribucionMes') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_subsidiocontribucion_generarcontribucionmes;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarContribucionMes',  '_route' => 'reportes_reportes_subsidiocontribucion_generarcontribucionmes',);
                            }
                            not_reportes_reportes_subsidiocontribucion_generarcontribucionmes:

                            // reportes_reportes_subsidiocontribucion_generarcontribucionresidencial
                            if ($pathinfo === '/reportes/contribucion/generarContribucionResidencial') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_subsidiocontribucion_generarcontribucionresidencial;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarContribucionResidencial',  '_route' => 'reportes_reportes_subsidiocontribucion_generarcontribucionresidencial',);
                            }
                            not_reportes_reportes_subsidiocontribucion_generarcontribucionresidencial:

                        }

                        // reportes_reportes_subsidiocontribucion_generarexentosmes
                        if ($pathinfo === '/reportes/contribucion/generarExentosMes') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_subsidiocontribucion_generarexentosmes;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarExentosMes',  '_route' => 'reportes_reportes_subsidiocontribucion_generarexentosmes',);
                        }
                        not_reportes_reportes_subsidiocontribucion_generarexentosmes:

                        // reportes_reportes_subsidiocontribucion_generarsubsidiomes
                        if ($pathinfo === '/reportes/contribucion/generarsubsidioMes') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_subsidiocontribucion_generarsubsidiomes;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarsubsidioMes',  '_route' => 'reportes_reportes_subsidiocontribucion_generarsubsidiomes',);
                        }
                        not_reportes_reportes_subsidiocontribucion_generarsubsidiomes:

                        if (0 === strpos($pathinfo, '/reportes/contribucion/generarFacongas')) {
                            // reportes_reportes_subsidiocontribucion_generarfacongasexcel
                            if ($pathinfo === '/reportes/contribucion/generarFacongasExcel') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_subsidiocontribucion_generarfacongasexcel;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarFacongasExcel',  '_route' => 'reportes_reportes_subsidiocontribucion_generarfacongasexcel',);
                            }
                            not_reportes_reportes_subsidiocontribucion_generarfacongasexcel:

                            // reportes_reportes_subsidiocontribucion_generarfacongasconsolidados
                            if ($pathinfo === '/reportes/contribucion/generarFacongasConsolidados') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_subsidiocontribucion_generarfacongasconsolidados;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarFacongasConsolidados',  '_route' => 'reportes_reportes_subsidiocontribucion_generarfacongasconsolidados',);
                            }
                            not_reportes_reportes_subsidiocontribucion_generarfacongasconsolidados:

                            // reportes_reportes_subsidiocontribucion_generarfacongasunico
                            if ($pathinfo === '/reportes/contribucion/generarFacongasUnico') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_subsidiocontribucion_generarfacongasunico;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarFacongasUnico',  '_route' => 'reportes_reportes_subsidiocontribucion_generarfacongasunico',);
                            }
                            not_reportes_reportes_subsidiocontribucion_generarfacongasunico:

                        }

                    }

                    // reportes_reportes_subsidiocontribucion_duplicadofacturalocal
                    if ($pathinfo === '/reportes/contribucion/duplicadoFacturaLocal') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_subsidiocontribucion_duplicadofacturalocal;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::duplicadoFacturaLocal',  '_route' => 'reportes_reportes_subsidiocontribucion_duplicadofacturalocal',);
                    }
                    not_reportes_reportes_subsidiocontribucion_duplicadofacturalocal:

                    // reportes_reportes_subsidiocontribucion_generarduplicadolocal
                    if ($pathinfo === '/reportes/contribucion/generarDuplicadoLocal') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_subsidiocontribucion_generarduplicadolocal;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarDuplicadoLocal',  '_route' => 'reportes_reportes_subsidiocontribucion_generarduplicadolocal',);
                    }
                    not_reportes_reportes_subsidiocontribucion_generarduplicadolocal:

                    // reportes_reportes_subsidiocontribucion_buscarfacturasperiodo
                    if ($pathinfo === '/reportes/contribucion/buscarFacturasPeriodo') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_subsidiocontribucion_buscarfacturasperiodo;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::buscarFacturasPeriodo',  '_route' => 'reportes_reportes_subsidiocontribucion_buscarfacturasperiodo',);
                    }
                    not_reportes_reportes_subsidiocontribucion_buscarfacturasperiodo:

                    if (0 === strpos($pathinfo, '/reportes/contribucion/generarDuplicado')) {
                        // reportes_reportes_subsidiocontribucion_generarduplicadolocalperiodo
                        if ($pathinfo === '/reportes/contribucion/generarDuplicadoLocalPeriodo') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_subsidiocontribucion_generarduplicadolocalperiodo;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarDuplicadoLocalPeriodo',  '_route' => 'reportes_reportes_subsidiocontribucion_generarduplicadolocalperiodo',);
                        }
                        not_reportes_reportes_subsidiocontribucion_generarduplicadolocalperiodo:

                        // reportes_reportes_subsidiocontribucion_generarduplicadovariassuscripciones
                        if ($pathinfo === '/reportes/contribucion/generarDuplicadoVariasSuscripciones') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_subsidiocontribucion_generarduplicadovariassuscripciones;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarDuplicadoVariasSuscripciones',  '_route' => 'reportes_reportes_subsidiocontribucion_generarduplicadovariassuscripciones',);
                        }
                        not_reportes_reportes_subsidiocontribucion_generarduplicadovariassuscripciones:

                    }

                    // reportes_reportes_subsidiocontribucion_consumocero
                    if ($pathinfo === '/reportes/contribucion/consumoCero') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_subsidiocontribucion_consumocero;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::consumoCero',  '_route' => 'reportes_reportes_subsidiocontribucion_consumocero',);
                    }
                    not_reportes_reportes_subsidiocontribucion_consumocero:

                    if (0 === strpos($pathinfo, '/reportes/contribucion/generarReporteConsumoC')) {
                        if (0 === strpos($pathinfo, '/reportes/contribucion/generarReporteConsumoCero')) {
                            // reportes_reportes_subsidiocontribucion_generarreporteconsumocero
                            if ($pathinfo === '/reportes/contribucion/generarReporteConsumoCero') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_subsidiocontribucion_generarreporteconsumocero;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarReporteConsumoCero',  '_route' => 'reportes_reportes_subsidiocontribucion_generarreporteconsumocero',);
                            }
                            not_reportes_reportes_subsidiocontribucion_generarreporteconsumocero:

                            // reportes_reportes_subsidiocontribucion_generarreporteconsumoceromes
                            if ($pathinfo === '/reportes/contribucion/generarReporteConsumoCeroMes') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_subsidiocontribucion_generarreporteconsumoceromes;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarReporteConsumoCeroMes',  '_route' => 'reportes_reportes_subsidiocontribucion_generarreporteconsumoceromes',);
                            }
                            not_reportes_reportes_subsidiocontribucion_generarreporteconsumoceromes:

                        }

                        // reportes_reportes_subsidiocontribucion_generarreporteconsumocomite
                        if ($pathinfo === '/reportes/contribucion/generarReporteConsumoComite') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_subsidiocontribucion_generarreporteconsumocomite;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SubsidioContribucionController::generarReporteConsumoComite',  '_route' => 'reportes_reportes_subsidiocontribucion_generarreporteconsumocomite',);
                        }
                        not_reportes_reportes_subsidiocontribucion_generarreporteconsumocomite:

                    }

                }

            }

            if (0 === strpos($pathinfo, '/reportes/f')) {
                if (0 === strpos($pathinfo, '/reportes/facturacionReportes')) {
                    // reportes_reportes_facturacionreportes_reportesbioagricola
                    if ($pathinfo === '/reportes/facturacionReportes/reportesBioagricola') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_facturacionreportes_reportesbioagricola;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::reportesBioagricola',  '_route' => 'reportes_reportes_facturacionreportes_reportesbioagricola',);
                    }
                    not_reportes_reportes_facturacionreportes_reportesbioagricola:

                    if (0 === strpos($pathinfo, '/reportes/facturacionReportes/generarBioagricola')) {
                        // reportes_reportes_facturacionreportes_generarbioagricolacartera
                        if ($pathinfo === '/reportes/facturacionReportes/generarBioagricolaCartera') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_generarbioagricolacartera;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarBioagricolaCartera',  '_route' => 'reportes_reportes_facturacionreportes_generarbioagricolacartera',);
                        }
                        not_reportes_reportes_facturacionreportes_generarbioagricolacartera:

                        // reportes_reportes_facturacionreportes_generarbioagricolagasodomestico
                        if ($pathinfo === '/reportes/facturacionReportes/generarBioagricolaGasodomestico') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_generarbioagricolagasodomestico;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarBioagricolaGasodomestico',  '_route' => 'reportes_reportes_facturacionreportes_generarbioagricolagasodomestico',);
                        }
                        not_reportes_reportes_facturacionreportes_generarbioagricolagasodomestico:

                        // reportes_reportes_facturacionreportes_generarbioagricolacarteratotal
                        if ($pathinfo === '/reportes/facturacionReportes/generarBioagricolaCarteraTotal') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_generarbioagricolacarteratotal;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarBioagricolaCarteraTotal',  '_route' => 'reportes_reportes_facturacionreportes_generarbioagricolacarteratotal',);
                        }
                        not_reportes_reportes_facturacionreportes_generarbioagricolacarteratotal:

                        // reportes_reportes_facturacionreportes_generarbioagricolagasodomesticototal
                        if ($pathinfo === '/reportes/facturacionReportes/generarBioagricolaGasodomesticoTotal') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_generarbioagricolagasodomesticototal;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarBioagricolaGasodomesticoTotal',  '_route' => 'reportes_reportes_facturacionreportes_generarbioagricolagasodomesticototal',);
                        }
                        not_reportes_reportes_facturacionreportes_generarbioagricolagasodomesticototal:

                        // reportes_reportes_facturacionreportes_generarbioagricolatotal
                        if ($pathinfo === '/reportes/facturacionReportes/generarBioagricolaTotal') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_generarbioagricolatotal;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarBioagricolaTotal',  '_route' => 'reportes_reportes_facturacionreportes_generarbioagricolatotal',);
                        }
                        not_reportes_reportes_facturacionreportes_generarbioagricolatotal:

                    }

                    // reportes_reportes_facturacionreportes_reportessui
                    if ($pathinfo === '/reportes/facturacionReportes/reportesSui') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_facturacionreportes_reportessui;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::reportesSui',  '_route' => 'reportes_reportes_facturacionreportes_reportessui',);
                    }
                    not_reportes_reportes_facturacionreportes_reportessui:

                    if (0 === strpos($pathinfo, '/reportes/facturacionReportes/generarSui')) {
                        // reportes_reportes_facturacionreportes_generarsuiregulados
                        if ($pathinfo === '/reportes/facturacionReportes/generarSuiRegulados') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_generarsuiregulados;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarSuiRegulados',  '_route' => 'reportes_reportes_facturacionreportes_generarsuiregulados',);
                        }
                        not_reportes_reportes_facturacionreportes_generarsuiregulados:

                        // reportes_reportes_facturacionreportes_generarsuinoregulados
                        if ($pathinfo === '/reportes/facturacionReportes/generarSuiNoRegulados') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_generarsuinoregulados;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarSuiNoRegulados',  '_route' => 'reportes_reportes_facturacionreportes_generarsuinoregulados',);
                        }
                        not_reportes_reportes_facturacionreportes_generarsuinoregulados:

                    }

                    // reportes_reportes_facturacionreportes_reporterestot
                    if ($pathinfo === '/reportes/facturacionReportes/reporteRestot') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_facturacionreportes_reporterestot;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::reporteRestot',  '_route' => 'reportes_reportes_facturacionreportes_reporterestot',);
                    }
                    not_reportes_reportes_facturacionreportes_reporterestot:

                    if (0 === strpos($pathinfo, '/reportes/facturacionReportes/generarRestot')) {
                        if (0 === strpos($pathinfo, '/reportes/facturacionReportes/generarRestotProyecto')) {
                            // reportes_reportes_facturacionreportes_generarrestotproyecto
                            if ($pathinfo === '/reportes/facturacionReportes/generarRestotProyecto') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarrestotproyecto;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarRestotProyecto',  '_route' => 'reportes_reportes_facturacionreportes_generarrestotproyecto',);
                            }
                            not_reportes_reportes_facturacionreportes_generarrestotproyecto:

                            // reportes_reportes_facturacionreportes_generarrestotproyecto2
                            if ($pathinfo === '/reportes/facturacionReportes/generarRestotProyecto2') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarrestotproyecto2;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarRestotProyecto2',  '_route' => 'reportes_reportes_facturacionreportes_generarrestotproyecto2',);
                            }
                            not_reportes_reportes_facturacionreportes_generarrestotproyecto2:

                        }

                        if (0 === strpos($pathinfo, '/reportes/facturacionReportes/generarRestotConsolidado')) {
                            // reportes_reportes_facturacionreportes_generarrestotconsolidado
                            if ($pathinfo === '/reportes/facturacionReportes/generarRestotConsolidado') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarrestotconsolidado;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarRestotConsolidado',  '_route' => 'reportes_reportes_facturacionreportes_generarrestotconsolidado',);
                            }
                            not_reportes_reportes_facturacionreportes_generarrestotconsolidado:

                            // reportes_reportes_facturacionreportes_generarrestotconsolidado2
                            if ($pathinfo === '/reportes/facturacionReportes/generarRestotConsolidado2') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarrestotconsolidado2;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarRestotConsolidado2',  '_route' => 'reportes_reportes_facturacionreportes_generarrestotconsolidado2',);
                            }
                            not_reportes_reportes_facturacionreportes_generarrestotconsolidado2:

                        }

                    }

                    // reportes_reportes_facturacionreportes_reportepostventas
                    if ($pathinfo === '/reportes/facturacionReportes/reportePostventas') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_facturacionreportes_reportepostventas;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::reportePostventas',  '_route' => 'reportes_reportes_facturacionreportes_reportepostventas',);
                    }
                    not_reportes_reportes_facturacionreportes_reportepostventas:

                    // reportes_reportes_facturacionreportes_generarpostventas
                    if ($pathinfo === '/reportes/facturacionReportes/generarPostventas') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_facturacionreportes_generarpostventas;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarPostventas',  '_route' => 'reportes_reportes_facturacionreportes_generarpostventas',);
                    }
                    not_reportes_reportes_facturacionreportes_generarpostventas:

                    // reportes_reportes_facturacionreportes_reporterequerimientos
                    if ($pathinfo === '/reportes/facturacionReportes/reporteRequerimientos') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_facturacionreportes_reporterequerimientos;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::reporteRequerimientos',  '_route' => 'reportes_reportes_facturacionreportes_reporterequerimientos',);
                    }
                    not_reportes_reportes_facturacionreportes_reporterequerimientos:

                    if (0 === strpos($pathinfo, '/reportes/facturacionReportes/generar')) {
                        // reportes_reportes_facturacionreportes_generarrequerimientosfacturacion
                        if ($pathinfo === '/reportes/facturacionReportes/generarRequerimientosfacturacion') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_generarrequerimientosfacturacion;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarRequerimientosfacturacion',  '_route' => 'reportes_reportes_facturacionreportes_generarrequerimientosfacturacion',);
                        }
                        not_reportes_reportes_facturacionreportes_generarrequerimientosfacturacion:

                        // reportes_reportes_facturacionreportes_generarsuireguladospdf
                        if ($pathinfo === '/reportes/facturacionReportes/generarSuiReguladosPdf') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_generarsuireguladospdf;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarSuiReguladosPdf',  '_route' => 'reportes_reportes_facturacionreportes_generarsuireguladospdf',);
                        }
                        not_reportes_reportes_facturacionreportes_generarsuireguladospdf:

                    }

                    // reportes_reportes_facturacionreportes_reportenovedadlectura
                    if ($pathinfo === '/reportes/facturacionReportes/reporteNovedadLectura') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_facturacionreportes_reportenovedadlectura;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::reporteNovedadLectura',  '_route' => 'reportes_reportes_facturacionreportes_reportenovedadlectura',);
                    }
                    not_reportes_reportes_facturacionreportes_reportenovedadlectura:

                    if (0 === strpos($pathinfo, '/reportes/facturacionReportes/generar')) {
                        // reportes_reportes_facturacionreportes_generarnovedadlectura
                        if ($pathinfo === '/reportes/facturacionReportes/generarNovedadLectura') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_generarnovedadlectura;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarNovedadLectura',  '_route' => 'reportes_reportes_facturacionreportes_generarnovedadlectura',);
                        }
                        not_reportes_reportes_facturacionreportes_generarnovedadlectura:

                        // reportes_reportes_facturacionreportes_generarrestotperiodo
                        if ($pathinfo === '/reportes/facturacionReportes/generarRestotPeriodo') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_generarrestotperiodo;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarRestotPeriodo',  '_route' => 'reportes_reportes_facturacionreportes_generarrestotperiodo',);
                        }
                        not_reportes_reportes_facturacionreportes_generarrestotperiodo:

                        // reportes_reportes_facturacionreportes_generarsuinoreguladospdf
                        if ($pathinfo === '/reportes/facturacionReportes/generarSuiNoReguladosPdf') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_generarsuinoreguladospdf;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarSuiNoReguladosPdf',  '_route' => 'reportes_reportes_facturacionreportes_generarsuinoreguladospdf',);
                        }
                        not_reportes_reportes_facturacionreportes_generarsuinoreguladospdf:

                        if (0 === strpos($pathinfo, '/reportes/facturacionReportes/generarBio')) {
                            // reportes_reportes_facturacionreportes_generarbiocarteralista
                            if ($pathinfo === '/reportes/facturacionReportes/generarBioCarteraLista') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarbiocarteralista;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarBioCarteraLista',  '_route' => 'reportes_reportes_facturacionreportes_generarbiocarteralista',);
                            }
                            not_reportes_reportes_facturacionreportes_generarbiocarteralista:

                            // reportes_reportes_facturacionreportes_generarbiogasodomesticolista
                            if ($pathinfo === '/reportes/facturacionReportes/generarBioGasodomesticoLista') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarbiogasodomesticolista;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarBioGasodomesticoLista',  '_route' => 'reportes_reportes_facturacionreportes_generarbiogasodomesticolista',);
                            }
                            not_reportes_reportes_facturacionreportes_generarbiogasodomesticolista:

                        }

                        // reportes_reportes_facturacionreportes_generarrestotmes
                        if ($pathinfo === '/reportes/facturacionReportes/generarRestotMes') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_generarrestotmes;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarRestotMes',  '_route' => 'reportes_reportes_facturacionreportes_generarrestotmes',);
                        }
                        not_reportes_reportes_facturacionreportes_generarrestotmes:

                        // reportes_reportes_facturacionreportes_generarpostventaperiodo
                        if ($pathinfo === '/reportes/facturacionReportes/generarPostventaPeriodo') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_generarpostventaperiodo;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarPostventaPeriodo',  '_route' => 'reportes_reportes_facturacionreportes_generarpostventaperiodo',);
                        }
                        not_reportes_reportes_facturacionreportes_generarpostventaperiodo:

                        if (0 === strpos($pathinfo, '/reportes/facturacionReportes/generarRe')) {
                            // reportes_reportes_facturacionreportes_generarreqierimientosmes
                            if ($pathinfo === '/reportes/facturacionReportes/generarReqierimientosMes') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarreqierimientosmes;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarReqierimientosMes',  '_route' => 'reportes_reportes_facturacionreportes_generarreqierimientosmes',);
                            }
                            not_reportes_reportes_facturacionreportes_generarreqierimientosmes:

                            if (0 === strpos($pathinfo, '/reportes/facturacionReportes/generarRestotAnual')) {
                                // reportes_reportes_facturacionreportes_generarrestotanual
                                if ($pathinfo === '/reportes/facturacionReportes/generarRestotAnual') {
                                    if ($this->context->getMethod() != 'POST') {
                                        $allow[] = 'POST';
                                        goto not_reportes_reportes_facturacionreportes_generarrestotanual;
                                    }

                                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarRestotAnual',  '_route' => 'reportes_reportes_facturacionreportes_generarrestotanual',);
                                }
                                not_reportes_reportes_facturacionreportes_generarrestotanual:

                                // reportes_reportes_facturacionreportes_generarrestotanualconsolidado
                                if ($pathinfo === '/reportes/facturacionReportes/generarRestotAnualConsolidado') {
                                    if ($this->context->getMethod() != 'POST') {
                                        $allow[] = 'POST';
                                        goto not_reportes_reportes_facturacionreportes_generarrestotanualconsolidado;
                                    }

                                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarRestotAnualConsolidado',  '_route' => 'reportes_reportes_facturacionreportes_generarrestotanualconsolidado',);
                                }
                                not_reportes_reportes_facturacionreportes_generarrestotanualconsolidado:

                            }

                            // reportes_reportes_facturacionreportes_generarreqierimientosanno
                            if ($pathinfo === '/reportes/facturacionReportes/generarReqierimientosAnno') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarreqierimientosanno;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarReqierimientosAnno',  '_route' => 'reportes_reportes_facturacionreportes_generarreqierimientosanno',);
                            }
                            not_reportes_reportes_facturacionreportes_generarreqierimientosanno:

                        }

                    }

                    // reportes_reportes_facturacionreportes_reportescreg
                    if ($pathinfo === '/reportes/facturacionReportes/reportesCreg') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_facturacionreportes_reportescreg;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::reportesCreg',  '_route' => 'reportes_reportes_facturacionreportes_reportescreg',);
                    }
                    not_reportes_reportes_facturacionreportes_reportescreg:

                    if (0 === strpos($pathinfo, '/reportes/facturacionReportes/generar')) {
                        // reportes_reportes_facturacionreportes_generarreportecreg
                        if ($pathinfo === '/reportes/facturacionReportes/generarReporteCreg') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_generarreportecreg;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarReporteCreg',  '_route' => 'reportes_reportes_facturacionreportes_generarreportecreg',);
                        }
                        not_reportes_reportes_facturacionreportes_generarreportecreg:

                        if (0 === strpos($pathinfo, '/reportes/facturacionReportes/generarLista')) {
                            // reportes_reportes_facturacionreportes_generarlistabiocartera
                            if ($pathinfo === '/reportes/facturacionReportes/generarListaBioCartera') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarlistabiocartera;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarListaBioCartera',  '_route' => 'reportes_reportes_facturacionreportes_generarlistabiocartera',);
                            }
                            not_reportes_reportes_facturacionreportes_generarlistabiocartera:

                            // reportes_reportes_facturacionreportes_generarlistagasodomestico
                            if ($pathinfo === '/reportes/facturacionReportes/generarListaGasodomestico') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarlistagasodomestico;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarListaGasodomestico',  '_route' => 'reportes_reportes_facturacionreportes_generarlistagasodomestico',);
                            }
                            not_reportes_reportes_facturacionreportes_generarlistagasodomestico:

                            // reportes_reportes_facturacionreportes_generarlistahomologadas
                            if ($pathinfo === '/reportes/facturacionReportes/generarListaHomologadas') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarlistahomologadas;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarListaHomologadas',  '_route' => 'reportes_reportes_facturacionreportes_generarlistahomologadas',);
                            }
                            not_reportes_reportes_facturacionreportes_generarlistahomologadas:

                        }

                        // reportes_reportes_facturacionreportes_generarbioagricolatotaltotal
                        if ($pathinfo === '/reportes/facturacionReportes/generarBioagricolaTotalTotal') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_generarbioagricolatotaltotal;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarBioagricolaTotalTotal',  '_route' => 'reportes_reportes_facturacionreportes_generarbioagricolatotaltotal',);
                        }
                        not_reportes_reportes_facturacionreportes_generarbioagricolatotaltotal:

                        if (0 === strpos($pathinfo, '/reportes/facturacionReportes/generarRe')) {
                            // reportes_reportes_facturacionreportes_generarrestotanualindustrial
                            if ($pathinfo === '/reportes/facturacionReportes/generarRestotAnualIndustrial') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarrestotanualindustrial;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarRestotAnualIndustrial',  '_route' => 'reportes_reportes_facturacionreportes_generarrestotanualindustrial',);
                            }
                            not_reportes_reportes_facturacionreportes_generarrestotanualindustrial:

                            // reportes_reportes_facturacionreportes_generarrequerimientoindustrial
                            if ($pathinfo === '/reportes/facturacionReportes/generarRequerimientoIndustrial') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarrequerimientoindustrial;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarRequerimientoIndustrial',  '_route' => 'reportes_reportes_facturacionreportes_generarrequerimientoindustrial',);
                            }
                            not_reportes_reportes_facturacionreportes_generarrequerimientoindustrial:

                        }

                        if (0 === strpos($pathinfo, '/reportes/facturacionReportes/generarC')) {
                            // reportes_reportes_facturacionreportes_generarcambiomedidor
                            if ($pathinfo === '/reportes/facturacionReportes/generarCambioMedidor') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarcambiomedidor;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarCambioMedidor',  '_route' => 'reportes_reportes_facturacionreportes_generarcambiomedidor',);
                            }
                            not_reportes_reportes_facturacionreportes_generarcambiomedidor:

                            // reportes_reportes_facturacionreportes_generarcomprobacionsui
                            if ($pathinfo === '/reportes/facturacionReportes/generarComprobacionSui') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarcomprobacionsui;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarComprobacionSui',  '_route' => 'reportes_reportes_facturacionreportes_generarcomprobacionsui',);
                            }
                            not_reportes_reportes_facturacionreportes_generarcomprobacionsui:

                        }

                        if (0 === strpos($pathinfo, '/reportes/facturacionReportes/generarRe')) {
                            // reportes_reportes_facturacionreportes_generarreguladosindustrialsui
                            if ($pathinfo === '/reportes/facturacionReportes/generarReguladosIndustrialSui') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarreguladosindustrialsui;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarReguladosIndustrialSui',  '_route' => 'reportes_reportes_facturacionreportes_generarreguladosindustrialsui',);
                            }
                            not_reportes_reportes_facturacionreportes_generarreguladosindustrialsui:

                            // reportes_reportes_facturacionreportes_generarreportecregfaca
                            if ($pathinfo === '/reportes/facturacionReportes/generarReporteCregFaca') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarreportecregfaca;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarReporteCregFaca',  '_route' => 'reportes_reportes_facturacionreportes_generarreportecregfaca',);
                            }
                            not_reportes_reportes_facturacionreportes_generarreportecregfaca:

                        }

                        if (0 === strpos($pathinfo, '/reportes/facturacionReportes/generarComprobacionCreg')) {
                            // reportes_reportes_facturacionreportes_generarcomprobacioncreg
                            if ($pathinfo === '/reportes/facturacionReportes/generarComprobacionCreg') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarcomprobacioncreg;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarComprobacionCreg',  '_route' => 'reportes_reportes_facturacionreportes_generarcomprobacioncreg',);
                            }
                            not_reportes_reportes_facturacionreportes_generarcomprobacioncreg:

                            // reportes_reportes_facturacionreportes_generarcomprobacioncreg2
                            if ($pathinfo === '/reportes/facturacionReportes/generarComprobacionCreg2') {
                                if ($this->context->getMethod() != 'POST') {
                                    $allow[] = 'POST';
                                    goto not_reportes_reportes_facturacionreportes_generarcomprobacioncreg2;
                                }

                                return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarComprobacionCreg2',  '_route' => 'reportes_reportes_facturacionreportes_generarcomprobacioncreg2',);
                            }
                            not_reportes_reportes_facturacionreportes_generarcomprobacioncreg2:

                        }

                        // reportes_reportes_facturacionreportes_generarreportelistasrutas
                        if ($pathinfo === '/reportes/facturacionReportes/generarReporteListasRutas') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_generarreportelistasrutas;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarReporteListasRutas',  '_route' => 'reportes_reportes_facturacionreportes_generarreportelistasrutas',);
                        }
                        not_reportes_reportes_facturacionreportes_generarreportelistasrutas:

                    }

                    // reportes_reportes_facturacionreportes_buscarrutasporproyecto
                    if ($pathinfo === '/reportes/facturacionReportes/buscarRutasPorProyecto') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_facturacionreportes_buscarrutasporproyecto;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::buscarRutasPorProyecto',  '_route' => 'reportes_reportes_facturacionreportes_buscarrutasporproyecto',);
                    }
                    not_reportes_reportes_facturacionreportes_buscarrutasporproyecto:

                    // reportes_reportes_facturacionreportes_reportecargueusuarios
                    if ($pathinfo === '/reportes/facturacionReportes/reporteCargueUsuarios') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_facturacionreportes_reportecargueusuarios;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::reporteCargueUsuarios',  '_route' => 'reportes_reportes_facturacionreportes_reportecargueusuarios',);
                    }
                    not_reportes_reportes_facturacionreportes_reportecargueusuarios:

                    if (0 === strpos($pathinfo, '/reportes/facturacionReportes/buscarUsuarios')) {
                        // reportes_reportes_facturacionreportes_buscarusuarioscicloagrupados
                        if ($pathinfo === '/reportes/facturacionReportes/buscarUsuariosCicloAgrupados') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_buscarusuarioscicloagrupados;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::buscarUsuariosCicloAgrupados',  '_route' => 'reportes_reportes_facturacionreportes_buscarusuarioscicloagrupados',);
                        }
                        not_reportes_reportes_facturacionreportes_buscarusuarioscicloagrupados:

                        // reportes_reportes_facturacionreportes_buscarusuariospendientes
                        if ($pathinfo === '/reportes/facturacionReportes/buscarUsuariospendientes') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_buscarusuariospendientes;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::buscarUsuariospendientes',  '_route' => 'reportes_reportes_facturacionreportes_buscarusuariospendientes',);
                        }
                        not_reportes_reportes_facturacionreportes_buscarusuariospendientes:

                    }

                    // reportes_reportes_facturacionreportes_informacionbio
                    if ($pathinfo === '/reportes/facturacionReportes/informacionBio') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_facturacionreportes_informacionbio;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::informacionBio',  '_route' => 'reportes_reportes_facturacionreportes_informacionbio',);
                    }
                    not_reportes_reportes_facturacionreportes_informacionbio:

                    // reportes_reportes_facturacionreportes_biohomologadosfacturaactivo
                    if ($pathinfo === '/reportes/facturacionReportes/BioHomologadosFacturaActivo') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_facturacionreportes_biohomologadosfacturaactivo;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::BioHomologadosFacturaActivo',  '_route' => 'reportes_reportes_facturacionreportes_biohomologadosfacturaactivo',);
                    }
                    not_reportes_reportes_facturacionreportes_biohomologadosfacturaactivo:

                    // reportes_reportes_facturacionreportes_generargasnuevosbio
                    if ($pathinfo === '/reportes/facturacionReportes/generarGasNuevosBio') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_facturacionreportes_generargasnuevosbio;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarGasNuevosBio',  '_route' => 'reportes_reportes_facturacionreportes_generargasnuevosbio',);
                    }
                    not_reportes_reportes_facturacionreportes_generargasnuevosbio:

                    if (0 === strpos($pathinfo, '/reportes/facturacionReportes/buscar')) {
                        // reportes_reportes_facturacionreportes_buscarusuarioscicloagrupadospendientes
                        if ($pathinfo === '/reportes/facturacionReportes/buscarUsuariosCicloAgrupadosPendientes') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_buscarusuarioscicloagrupadospendientes;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::buscarUsuariosCicloAgrupadosPendientes',  '_route' => 'reportes_reportes_facturacionreportes_buscarusuarioscicloagrupadospendientes',);
                        }
                        not_reportes_reportes_facturacionreportes_buscarusuarioscicloagrupadospendientes:

                        // reportes_reportes_facturacionreportes_buscarduplicadofacturaperiodo
                        if ($pathinfo === '/reportes/facturacionReportes/buscarDuplicadoFacturaPeriodo') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_facturacionreportes_buscarduplicadofacturaperiodo;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::buscarDuplicadoFacturaPeriodo',  '_route' => 'reportes_reportes_facturacionreportes_buscarduplicadofacturaperiodo',);
                        }
                        not_reportes_reportes_facturacionreportes_buscarduplicadofacturaperiodo:

                    }

                    // reportes_reportes_facturacionreportes_generarrutasperiodo
                    if ($pathinfo === '/reportes/facturacionReportes/generarRutasPeriodo') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_facturacionreportes_generarrutasperiodo;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionReportesController::generarRutasPeriodo',  '_route' => 'reportes_reportes_facturacionreportes_generarrutasperiodo',);
                    }
                    not_reportes_reportes_facturacionreportes_generarrutasperiodo:

                }

                if (0 === strpos($pathinfo, '/reportes/financiacionesTable/get')) {
                    // reportes_reportes_financiacionestable_getinfo
                    if ($pathinfo === '/reportes/financiacionesTable/getInfo') {
                        if (!in_array($this->context->getMethod(), array('POST', 'GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('POST', 'GET', 'HEAD'));
                            goto not_reportes_reportes_financiacionestable_getinfo;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FinanciacionesTableController::getInfo',  '_route' => 'reportes_reportes_financiacionestable_getinfo',);
                    }
                    not_reportes_reportes_financiacionestable_getinfo:

                    // reportes_reportes_financiacionestable_getcolumns
                    if ($pathinfo === '/reportes/financiacionesTable/getColumns') {
                        if (!in_array($this->context->getMethod(), array('POST', 'GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('POST', 'GET', 'HEAD'));
                            goto not_reportes_reportes_financiacionestable_getcolumns;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FinanciacionesTableController::getColumns',  '_route' => 'reportes_reportes_financiacionestable_getcolumns',);
                    }
                    not_reportes_reportes_financiacionestable_getcolumns:

                }

            }

            if (0 === strpos($pathinfo, '/reportes/c')) {
                if (0 === strpos($pathinfo, '/reportes/cartera')) {
                    // reportes_reportes_edadescartera_edadescartera
                    if ($pathinfo === '/reportes/cartera/edadesCartera') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_edadescartera_edadescartera;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\EdadesCarteraController::edadesCartera',  '_route' => 'reportes_reportes_edadescartera_edadescartera',);
                    }
                    not_reportes_reportes_edadescartera_edadescartera:

                    if (0 === strpos($pathinfo, '/reportes/cartera/generarReporte')) {
                        // reportes_reportes_edadescartera_generarreporteedadescartera
                        if ($pathinfo === '/reportes/cartera/generarReporteEdadesCartera') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_edadescartera_generarreporteedadescartera;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\EdadesCarteraController::generarReporteEdadesCartera',  '_route' => 'reportes_reportes_edadescartera_generarreporteedadescartera',);
                        }
                        not_reportes_reportes_edadescartera_generarreporteedadescartera:

                        // reportes_reportes_edadescartera_generarreporteconciliacionedadescartera
                        if ($pathinfo === '/reportes/cartera/generarReporteConciliacionEdadesCartera') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_edadescartera_generarreporteconciliacionedadescartera;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\EdadesCarteraController::generarReporteConciliacionEdadesCartera',  '_route' => 'reportes_reportes_edadescartera_generarreporteconciliacionedadescartera',);
                        }
                        not_reportes_reportes_edadescartera_generarreporteconciliacionedadescartera:

                    }

                }

                if (0 === strpos($pathinfo, '/reportes/conceptosTable/get')) {
                    // reportes_reportes_conceptostable_getinfo
                    if ($pathinfo === '/reportes/conceptosTable/getInfo') {
                        if (!in_array($this->context->getMethod(), array('POST', 'GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('POST', 'GET', 'HEAD'));
                            goto not_reportes_reportes_conceptostable_getinfo;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConceptosTableController::getInfo',  '_route' => 'reportes_reportes_conceptostable_getinfo',);
                    }
                    not_reportes_reportes_conceptostable_getinfo:

                    // reportes_reportes_conceptostable_getcolumns
                    if ($pathinfo === '/reportes/conceptosTable/getColumns') {
                        if (!in_array($this->context->getMethod(), array('POST', 'GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('POST', 'GET', 'HEAD'));
                            goto not_reportes_reportes_conceptostable_getcolumns;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConceptosTableController::getColumns',  '_route' => 'reportes_reportes_conceptostable_getcolumns',);
                    }
                    not_reportes_reportes_conceptostable_getcolumns:

                }

            }

            if (0 === strpos($pathinfo, '/reportes/facturacion')) {
                // reportes_reportes_facturacionemitida_notasreclamacion
                if ($pathinfo === '/reportes/facturacion/notasReclamacion') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_facturacionemitida_notasreclamacion;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionEmitidaController::notasReclamacion',  '_route' => 'reportes_reportes_facturacionemitida_notasreclamacion',);
                }
                not_reportes_reportes_facturacionemitida_notasreclamacion:

                // reportes_reportes_facturacionemitida_generarnotasreclamacion
                if ($pathinfo === '/reportes/facturacion/generarNotasReclamacion') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_facturacionemitida_generarnotasreclamacion;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionEmitidaController::generarNotasReclamacion',  '_route' => 'reportes_reportes_facturacionemitida_generarnotasreclamacion',);
                }
                not_reportes_reportes_facturacionemitida_generarnotasreclamacion:

                // reportes_reportes_facturacionemitida_facturacionemitida
                if ($pathinfo === '/reportes/facturacion/facturacionEmitida') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_facturacionemitida_facturacionemitida;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionEmitidaController::facturacionEmitida',  '_route' => 'reportes_reportes_facturacionemitida_facturacionemitida',);
                }
                not_reportes_reportes_facturacionemitida_facturacionemitida:

                // reportes_reportes_facturacionemitida_generarreportefacturacionemitida
                if ($pathinfo === '/reportes/facturacion/generarReporteFacturacionEmitida') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_facturacionemitida_generarreportefacturacionemitida;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionEmitidaController::generarReporteFacturacionEmitida',  '_route' => 'reportes_reportes_facturacionemitida_generarreportefacturacionemitida',);
                }
                not_reportes_reportes_facturacionemitida_generarreportefacturacionemitida:

                // reportes_reportes_cobrorevisionquinquenal_cobrorevisionquinquenal
                if ($pathinfo === '/reportes/facturacion/cobrorevisionquinquenal') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_cobrorevisionquinquenal_cobrorevisionquinquenal;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CobroRevisionQuinquenalController::cobroRevisionQuinquenal',  '_route' => 'reportes_reportes_cobrorevisionquinquenal_cobrorevisionquinquenal',);
                }
                not_reportes_reportes_cobrorevisionquinquenal_cobrorevisionquinquenal:

                // reportes_reportes_cobrorevisionquinquenal_generarcobrorevisionquinquenal
                if ($pathinfo === '/reportes/facturacion/generarCobroRevisionQuinquenal') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_cobrorevisionquinquenal_generarcobrorevisionquinquenal;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CobroRevisionQuinquenalController::generarCobroRevisionQuinquenal',  '_route' => 'reportes_reportes_cobrorevisionquinquenal_generarcobrorevisionquinquenal',);
                }
                not_reportes_reportes_cobrorevisionquinquenal_generarcobrorevisionquinquenal:

                // reportes_reportes_suscripcion_suscripcion
                if ($pathinfo === '/reportes/facturacion/suscripcionEstado') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_suscripcion_suscripcion;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuscripcionController::suscripcion',  '_route' => 'reportes_reportes_suscripcion_suscripcion',);
                }
                not_reportes_reportes_suscripcion_suscripcion:

                // reportes_reportes_suscripcion_generarreportesuscipcionestado
                if ($pathinfo === '/reportes/facturacion/generarReporteSuscipcionEstado') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_suscripcion_generarreportesuscipcionestado;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuscripcionController::generarReporteSuscipcionEstado',  '_route' => 'reportes_reportes_suscripcion_generarreportesuscipcionestado',);
                }
                not_reportes_reportes_suscripcion_generarreportesuscipcionestado:

            }

            if (0 === strpos($pathinfo, '/reportes/cartera')) {
                // reportes_reportes_financiacionesfacturadasciclo_financiacionesfacturadasciclo
                if ($pathinfo === '/reportes/cartera/financiacionesfacturadasciclo') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_financiacionesfacturadasciclo_financiacionesfacturadasciclo;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FinanciacionesFacturadasCicloController::financiacionesFacturadasCiclo',  '_route' => 'reportes_reportes_financiacionesfacturadasciclo_financiacionesfacturadasciclo',);
                }
                not_reportes_reportes_financiacionesfacturadasciclo_financiacionesfacturadasciclo:

                // reportes_reportes_financiacionesfacturadasciclo_generarfinanciacionesfacturadasciclo
                if ($pathinfo === '/reportes/cartera/generarfinanciacionesFacturadasCiclo') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_financiacionesfacturadasciclo_generarfinanciacionesfacturadasciclo;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FinanciacionesFacturadasCicloController::generarfinanciacionesFacturadasCiclo',  '_route' => 'reportes_reportes_financiacionesfacturadasciclo_generarfinanciacionesfacturadasciclo',);
                }
                not_reportes_reportes_financiacionesfacturadasciclo_generarfinanciacionesfacturadasciclo:

                // reportes_reportes_provisioncartera_provisioncartera
                if ($pathinfo === '/reportes/cartera/provisioncartera') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_provisioncartera_provisioncartera;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ProvisionCarteraController::provisionCartera',  '_route' => 'reportes_reportes_provisioncartera_provisioncartera',);
                }
                not_reportes_reportes_provisioncartera_provisioncartera:

                // reportes_reportes_provisioncartera_generarprovisioncartera
                if ($pathinfo === '/reportes/cartera/generarProvisionCartera') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_provisioncartera_generarprovisioncartera;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ProvisionCarteraController::generarProvisionCartera',  '_route' => 'reportes_reportes_provisioncartera_generarprovisioncartera',);
                }
                not_reportes_reportes_provisioncartera_generarprovisioncartera:

            }

            if (0 === strpos($pathinfo, '/reportes/facturacion')) {
                // reportes_reportes_pagosfacturacion_pagosfacturacion
                if ($pathinfo === '/reportes/facturacion/pagosfacturacion') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_pagosfacturacion_pagosfacturacion;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\PagosFacturacionController::pagosFacturacion',  '_route' => 'reportes_reportes_pagosfacturacion_pagosfacturacion',);
                }
                not_reportes_reportes_pagosfacturacion_pagosfacturacion:

                if (0 === strpos($pathinfo, '/reportes/facturacion/generar')) {
                    // reportes_reportes_pagosfacturacion_generarpagosfacturacion
                    if ($pathinfo === '/reportes/facturacion/generarpagosfacturacion') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_pagosfacturacion_generarpagosfacturacion;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\PagosFacturacionController::generarPagosFacturacion',  '_route' => 'reportes_reportes_pagosfacturacion_generarpagosfacturacion',);
                    }
                    not_reportes_reportes_pagosfacturacion_generarpagosfacturacion:

                    if (0 === strpos($pathinfo, '/reportes/facturacion/generarRecaudos')) {
                        // reportes_reportes_pagosfacturacion_generarrecaudosfacturacion
                        if ($pathinfo === '/reportes/facturacion/generarRecaudosfacturacion') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_pagosfacturacion_generarrecaudosfacturacion;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\PagosFacturacionController::generarRecaudosfacturacion',  '_route' => 'reportes_reportes_pagosfacturacion_generarrecaudosfacturacion',);
                        }
                        not_reportes_reportes_pagosfacturacion_generarrecaudosfacturacion:

                        // reportes_reportes_pagosfacturacion_generarrecaudosfacturacionconciliacion
                        if ($pathinfo === '/reportes/facturacion/generarRecaudosFacturacionConciliacion') {
                            if ($this->context->getMethod() != 'POST') {
                                $allow[] = 'POST';
                                goto not_reportes_reportes_pagosfacturacion_generarrecaudosfacturacionconciliacion;
                            }

                            return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\PagosFacturacionController::generarRecaudosFacturacionConciliacion',  '_route' => 'reportes_reportes_pagosfacturacion_generarrecaudosfacturacionconciliacion',);
                        }
                        not_reportes_reportes_pagosfacturacion_generarrecaudosfacturacionconciliacion:

                    }

                }

                // reportes_reportes_rangosconsumo_rangoconsumo
                if ($pathinfo === '/reportes/facturacion/rango_consumo') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_rangosconsumo_rangoconsumo;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\RangosConsumoController::rangoConsumo',  '_route' => 'reportes_reportes_rangosconsumo_rangoconsumo',);
                }
                not_reportes_reportes_rangosconsumo_rangoconsumo:

                if (0 === strpos($pathinfo, '/reportes/facturacion/generar_')) {
                    // reportes_reportes_rangosconsumo_generarreporterangos
                    if ($pathinfo === '/reportes/facturacion/generar_reporte_rangos') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_rangosconsumo_generarreporterangos;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\RangosConsumoController::generarReporteRangos',  '_route' => 'reportes_reportes_rangosconsumo_generarreporterangos',);
                    }
                    not_reportes_reportes_rangosconsumo_generarreporterangos:

                    // reportes_reportes_rangosconsumo_generarcostosingresos
                    if ($pathinfo === '/reportes/facturacion/generar_costos_ingresos') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_rangosconsumo_generarcostosingresos;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\RangosConsumoController::generarCostosIngresos',  '_route' => 'reportes_reportes_rangosconsumo_generarcostosingresos',);
                    }
                    not_reportes_reportes_rangosconsumo_generarcostosingresos:

                }

                // reportes_reportes_recaudoace_recaudosace
                if ($pathinfo === '/reportes/facturacion/recaudo_ace') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_recaudoace_recaudosace;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\RecaudoAceController::recaudosAce',  '_route' => 'reportes_reportes_recaudoace_recaudosace',);
                }
                not_reportes_reportes_recaudoace_recaudosace:

                // reportes_reportes_recaudoace_generarreporterecaudosace
                if ($pathinfo === '/reportes/facturacion/generar_reporte_recaudo_ace') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_recaudoace_generarreporterecaudosace;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\RecaudoAceController::generarReporteRecaudosAce',  '_route' => 'reportes_reportes_recaudoace_generarreporterecaudosace',);
                }
                not_reportes_reportes_recaudoace_generarreporterecaudosace:

                // reportes_reportes_modificacionusuario_modificacionesusuarios
                if ($pathinfo === '/reportes/facturacion/modificaciones_usuario') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_modificacionusuario_modificacionesusuarios;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ModificacionUsuarioController::modificacionesUsuarios',  '_route' => 'reportes_reportes_modificacionusuario_modificacionesusuarios',);
                }
                not_reportes_reportes_modificacionusuario_modificacionesusuarios:

                // reportes_reportes_modificacionusuario_consultarsuscripcionesmodificadas
                if ($pathinfo === '/reportes/facturacion/consultar_suscripciones_modificada') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_modificacionusuario_consultarsuscripcionesmodificadas;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ModificacionUsuarioController::consultarSuscripcionesModificadas',  '_route' => 'reportes_reportes_modificacionusuario_consultarsuscripcionesmodificadas',);
                }
                not_reportes_reportes_modificacionusuario_consultarsuscripcionesmodificadas:

            }

            if (0 === strpos($pathinfo, '/reportes/c')) {
                if (0 === strpos($pathinfo, '/reportes/cartera')) {
                    // reportes_reportes_recaudofinanciacion_recaudofinanciacion
                    if ($pathinfo === '/reportes/cartera/recaudo_financiacion') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_recaudofinanciacion_recaudofinanciacion;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\RecaudoFinanciacionController::recaudoFinanciacion',  '_route' => 'reportes_reportes_recaudofinanciacion_recaudofinanciacion',);
                    }
                    not_reportes_reportes_recaudofinanciacion_recaudofinanciacion:

                    // reportes_reportes_recaudofinanciacion_generarreporterecaudosfinanciacion
                    if ($pathinfo === '/reportes/cartera/generar_reporte_recaudos') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_recaudofinanciacion_generarreporterecaudosfinanciacion;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\RecaudoFinanciacionController::generarReporteRecaudosFinanciacion',  '_route' => 'reportes_reportes_recaudofinanciacion_generarreporterecaudosfinanciacion',);
                    }
                    not_reportes_reportes_recaudofinanciacion_generarreporterecaudosfinanciacion:

                    // reportes_reportes_anticipospendientescurzar_anticipospendintescruzar
                    if ($pathinfo === '/reportes/cartera/anticipospendintescruzar') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_anticipospendientescurzar_anticipospendintescruzar;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\AnticiposPendientesCurzarController::anticipospendintescruzar',  '_route' => 'reportes_reportes_anticipospendientescurzar_anticipospendintescruzar',);
                    }
                    not_reportes_reportes_anticipospendientescurzar_anticipospendintescruzar:

                    // reportes_reportes_anticipospendientescurzar_generaranticipospendientescruzar
                    if ($pathinfo === '/reportes/cartera/generarAnticiposPendientesCruzar') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_anticipospendientescurzar_generaranticipospendientescruzar;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\AnticiposPendientesCurzarController::generarAnticiposPendientesCruzar',  '_route' => 'reportes_reportes_anticipospendientescurzar_generaranticipospendientescruzar',);
                    }
                    not_reportes_reportes_anticipospendientescurzar_generaranticipospendientescruzar:

                }

                if (0 === strpos($pathinfo, '/reportes/constructoraTable/get')) {
                    // reportes_reportes_constructoratable_getinfo
                    if ($pathinfo === '/reportes/constructoraTable/getInfo') {
                        if (!in_array($this->context->getMethod(), array('POST', 'GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('POST', 'GET', 'HEAD'));
                            goto not_reportes_reportes_constructoratable_getinfo;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConstructoraTableController::getInfo',  '_route' => 'reportes_reportes_constructoratable_getinfo',);
                    }
                    not_reportes_reportes_constructoratable_getinfo:

                    // reportes_reportes_constructoratable_getcolumns
                    if ($pathinfo === '/reportes/constructoraTable/getColumns') {
                        if (!in_array($this->context->getMethod(), array('POST', 'GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('POST', 'GET', 'HEAD'));
                            goto not_reportes_reportes_constructoratable_getcolumns;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ConstructoraTableController::getColumns',  '_route' => 'reportes_reportes_constructoratable_getcolumns',);
                    }
                    not_reportes_reportes_constructoratable_getcolumns:

                }

                if (0 === strpos($pathinfo, '/reportes/cartera')) {
                    // reportes_reportes_suscripcionesrpcc_suscripcionesrpcc
                    if ($pathinfo === '/reportes/cartera/suscripcionesrpcc') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_suscripcionesrpcc_suscripcionesrpcc;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuscripcionesRpCcController::suscripcionesRpCc',  '_route' => 'reportes_reportes_suscripcionesrpcc_suscripcionesrpcc',);
                    }
                    not_reportes_reportes_suscripcionesrpcc_suscripcionesrpcc:

                    // reportes_reportes_suscripcionesrpcc_generarreportesuscipcionesrpcc
                    if ($pathinfo === '/reportes/cartera/generarReporteSuscripcionesRpCc') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_suscripcionesrpcc_generarreportesuscipcionesrpcc;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuscripcionesRpCcController::generarReporteSuscipcionesRpCc',  '_route' => 'reportes_reportes_suscripcionesrpcc_generarreportesuscipcionesrpcc',);
                    }
                    not_reportes_reportes_suscripcionesrpcc_generarreportesuscipcionesrpcc:

                    // reportes_reportes_validacionrecaudoscaja_validacionrecaudoscaja
                    if ($pathinfo === '/reportes/cartera/validacionrecaudoscaja') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_validacionrecaudoscaja_validacionrecaudoscaja;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ValidacionRecaudosCajaController::validacionRecaudosCaja',  '_route' => 'reportes_reportes_validacionrecaudoscaja_validacionrecaudoscaja',);
                    }
                    not_reportes_reportes_validacionrecaudoscaja_validacionrecaudoscaja:

                    // reportes_reportes_validacionrecaudoscaja_generarreportevalidacionrecaudoscaja
                    if ($pathinfo === '/reportes/cartera/generarReporteValidacionRecaudosCaja') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_validacionrecaudoscaja_generarreportevalidacionrecaudoscaja;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ValidacionRecaudosCajaController::generarReporteValidacionRecaudosCaja',  '_route' => 'reportes_reportes_validacionrecaudoscaja_generarreportevalidacionrecaudoscaja',);
                    }
                    not_reportes_reportes_validacionrecaudoscaja_generarreportevalidacionrecaudoscaja:

                    // reportes_reportes_intereses_intereses
                    if ($pathinfo === '/reportes/cartera/intereses') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_intereses_intereses;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\InteresesController::intereses',  '_route' => 'reportes_reportes_intereses_intereses',);
                    }
                    not_reportes_reportes_intereses_intereses:

                    // reportes_reportes_intereses_generarreporteintereses
                    if ($pathinfo === '/reportes/cartera/generarReporteIntereses') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_intereses_generarreporteintereses;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\InteresesController::generarReporteIntereses',  '_route' => 'reportes_reportes_intereses_generarreporteintereses',);
                    }
                    not_reportes_reportes_intereses_generarreporteintereses:

                    // reportes_reportes_intereses_interesesconciliacion
                    if ($pathinfo === '/reportes/cartera/interesesConciliacion') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_intereses_interesesconciliacion;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\InteresesController::interesesConciliacion',  '_route' => 'reportes_reportes_intereses_interesesconciliacion',);
                    }
                    not_reportes_reportes_intereses_interesesconciliacion:

                    // reportes_reportes_intereses_generarreporteinteresesconciliacion
                    if ($pathinfo === '/reportes/cartera/generarReporteInteresesConciliacion') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_intereses_generarreporteinteresesconciliacion;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\InteresesController::generarReporteInteresesConciliacion',  '_route' => 'reportes_reportes_intereses_generarreporteinteresesconciliacion',);
                    }
                    not_reportes_reportes_intereses_generarreporteinteresesconciliacion:

                    // reportes_reportes_saldoindustriales_saldoindustriales
                    if ($pathinfo === '/reportes/cartera/saldoindustriales') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_saldoindustriales_saldoindustriales;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SaldoIndustrialesController::saldoIndustriales',  '_route' => 'reportes_reportes_saldoindustriales_saldoindustriales',);
                    }
                    not_reportes_reportes_saldoindustriales_saldoindustriales:

                    // reportes_reportes_saldoindustriales_generarreportesaldoindustriales
                    if ($pathinfo === '/reportes/cartera/generarReporteSaldoIndustriales') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_saldoindustriales_generarreportesaldoindustriales;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SaldoIndustrialesController::generarReporteSaldoIndustriales',  '_route' => 'reportes_reportes_saldoindustriales_generarreportesaldoindustriales',);
                    }
                    not_reportes_reportes_saldoindustriales_generarreportesaldoindustriales:

                }

            }

            if (0 === strpos($pathinfo, '/reportes/potenza')) {
                // reportes_reportes_pagoscredito_pagosporcredito
                if ($pathinfo === '/reportes/potenza/pagos_credito') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_pagoscredito_pagosporcredito;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\PagosCreditoController::pagosPorCredito',  '_route' => 'reportes_reportes_pagoscredito_pagosporcredito',);
                }
                not_reportes_reportes_pagoscredito_pagosporcredito:

                // reportes_reportes_pagoscredito_consultarcreditos
                if ($pathinfo === '/reportes/potenza/consultarCreditos') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_pagoscredito_consultarcreditos;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\PagosCreditoController::consultarCreditos',  '_route' => 'reportes_reportes_pagoscredito_consultarcreditos',);
                }
                not_reportes_reportes_pagoscredito_consultarcreditos:

                if (0 === strpos($pathinfo, '/reportes/potenza/generarPa')) {
                    // reportes_reportes_pagoscredito_generarpagoscredito
                    if ($pathinfo === '/reportes/potenza/generarPagosCredito') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_pagoscredito_generarpagoscredito;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\PagosCreditoController::generarPagosCredito',  '_route' => 'reportes_reportes_pagoscredito_generarpagoscredito',);
                    }
                    not_reportes_reportes_pagoscredito_generarpagoscredito:

                    // reportes_reportes_pagoscredito_generarpazsalvotercero
                    if ($pathinfo === '/reportes/potenza/generarPaz_Salvo_Tercero') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_pagoscredito_generarpazsalvotercero;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\PagosCreditoController::generarPazSalvoTercero',  '_route' => 'reportes_reportes_pagoscredito_generarpazsalvotercero',);
                    }
                    not_reportes_reportes_pagoscredito_generarpazsalvotercero:

                }

                // reportes_reportes_creditosdesembolsados_creditosdesembolsados
                if ($pathinfo === '/reportes/potenza/creditos_desembolsados') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_creditosdesembolsados_creditosdesembolsados;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CreditosDesembolsadosController::creditosDesembolsados',  '_route' => 'reportes_reportes_creditosdesembolsados_creditosdesembolsados',);
                }
                not_reportes_reportes_creditosdesembolsados_creditosdesembolsados:

                // reportes_reportes_creditosdesembolsados_reportecreditosdesembolsados
                if ($pathinfo === '/reportes/potenza/reporte_creditos_desmbolsados') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_creditosdesembolsados_reportecreditosdesembolsados;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CreditosDesembolsadosController::reporteCreditosDesembolsados',  '_route' => 'reportes_reportes_creditosdesembolsados_reportecreditosdesembolsados',);
                }
                not_reportes_reportes_creditosdesembolsados_reportecreditosdesembolsados:

                // reportes_reportes_creditosdesembolsados_planocreditosdesembolsados
                if ($pathinfo === '/reportes/potenza/plano_creditos_desmbolsados') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_creditosdesembolsados_planocreditosdesembolsados;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CreditosDesembolsadosController::planoCreditosDesembolsados',  '_route' => 'reportes_reportes_creditosdesembolsados_planocreditosdesembolsados',);
                }
                not_reportes_reportes_creditosdesembolsados_planocreditosdesembolsados:

                // reportes_reportes_informecreditos_informecreditos
                if ($pathinfo === '/reportes/potenza/informe_creditos') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_informecreditos_informecreditos;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\InformeCreditosController::informeCreditos',  '_route' => 'reportes_reportes_informecreditos_informecreditos',);
                }
                not_reportes_reportes_informecreditos_informecreditos:

                // reportes_reportes_informecreditos_generarinformecreditos
                if ($pathinfo === '/reportes/potenza/generar_informe_creditos') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_informecreditos_generarinformecreditos;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\InformeCreditosController::generarInformeCreditos',  '_route' => 'reportes_reportes_informecreditos_generarinformecreditos',);
                }
                not_reportes_reportes_informecreditos_generarinformecreditos:

                // reportes_reportes_informecreditos_reporteprovisioncreditos
                if ($pathinfo === '/reportes/potenza/reporte_provision_creditos') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_informecreditos_reporteprovisioncreditos;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\InformeCreditosController::ReporteProvisionCreditos',  '_route' => 'reportes_reportes_informecreditos_reporteprovisioncreditos',);
                }
                not_reportes_reportes_informecreditos_reporteprovisioncreditos:

                // reportes_reportes_informecreditos_generarprovisioncreditos
                if ($pathinfo === '/reportes/potenza/generar_provision_creditos') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_informecreditos_generarprovisioncreditos;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\InformeCreditosController::generarProvisionCreditos',  '_route' => 'reportes_reportes_informecreditos_generarprovisioncreditos',);
                }
                not_reportes_reportes_informecreditos_generarprovisioncreditos:

                // reportes_reportes_informecreditos_reportecreditos
                if ($pathinfo === '/reportes/potenza/reporte_creditos') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_informecreditos_reportecreditos;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\InformeCreditosController::reporteCreditos',  '_route' => 'reportes_reportes_informecreditos_reportecreditos',);
                }
                not_reportes_reportes_informecreditos_reportecreditos:

                if (0 === strpos($pathinfo, '/reportes/potenza/ge')) {
                    // reportes_reportes_informecreditos_getjsonestadocredito
                    if ($pathinfo === '/reportes/potenza/getEstadosCredito') {
                        if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                            $allow = array_merge($allow, array('GET', 'HEAD'));
                            goto not_reportes_reportes_informecreditos_getjsonestadocredito;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\InformeCreditosController::getJsonEstadoCredito',  '_route' => 'reportes_reportes_informecreditos_getjsonestadocredito',);
                    }
                    not_reportes_reportes_informecreditos_getjsonestadocredito:

                    // reportes_reportes_informecreditos_generarreportecreditos
                    if ($pathinfo === '/reportes/potenza/generar_reporte_creditos') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_informecreditos_generarreportecreditos;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\InformeCreditosController::generarReporteCreditos',  '_route' => 'reportes_reportes_informecreditos_generarreportecreditos',);
                    }
                    not_reportes_reportes_informecreditos_generarreportecreditos:

                }

                // reportes_reportes_facturacioncreditos_facturacioncreditos
                if ($pathinfo === '/reportes/potenza/facturacion_credito') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_facturacioncreditos_facturacioncreditos;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionCreditosController::facturacionCreditos',  '_route' => 'reportes_reportes_facturacioncreditos_facturacioncreditos',);
                }
                not_reportes_reportes_facturacioncreditos_facturacioncreditos:

                if (0 === strpos($pathinfo, '/reportes/potenza/reporte_')) {
                    // reportes_reportes_facturacioncreditos_generarinformecreditos
                    if ($pathinfo === '/reportes/potenza/reporte_facturacion_creditos') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_facturacioncreditos_generarinformecreditos;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionCreditosController::generarInformeCreditos',  '_route' => 'reportes_reportes_facturacioncreditos_generarinformecreditos',);
                    }
                    not_reportes_reportes_facturacioncreditos_generarinformecreditos:

                    // reportes_reportes_facturacioncreditos_generarfacturacreditos
                    if ($pathinfo === '/reportes/potenza/reporte_Factura_Computador') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_facturacioncreditos_generarfacturacreditos;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturacionCreditosController::generarFacturaCreditos',  '_route' => 'reportes_reportes_facturacioncreditos_generarfacturacreditos',);
                    }
                    not_reportes_reportes_facturacioncreditos_generarfacturacreditos:

                }

                // reportes_reportes_extractocreditos_extractocreditos
                if ($pathinfo === '/reportes/potenza/extracto_credito') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_extractocreditos_extractocreditos;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ExtractoCreditosController::ExtractoCreditos',  '_route' => 'reportes_reportes_extractocreditos_extractocreditos',);
                }
                not_reportes_reportes_extractocreditos_extractocreditos:

                // reportes_reportes_extractocreditos_generarextractocreditos
                if ($pathinfo === '/reportes/potenza/reporte_extracto_creditos') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_extractocreditos_generarextractocreditos;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ExtractoCreditosController::generarExtractoCreditos',  '_route' => 'reportes_reportes_extractocreditos_generarextractocreditos',);
                }
                not_reportes_reportes_extractocreditos_generarextractocreditos:

            }

            if (0 === strpos($pathinfo, '/reportes/cartera')) {
                // reportes_reportes_medidoresinternos_medidoresinternos
                if ($pathinfo === '/reportes/cartera/medidoresInternos') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_medidoresinternos_medidoresinternos;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\MedidoresInternosController::medidoresInternos',  '_route' => 'reportes_reportes_medidoresinternos_medidoresinternos',);
                }
                not_reportes_reportes_medidoresinternos_medidoresinternos:

                // reportes_reportes_medidoresinternos_generarreportemedidoresinternos
                if ($pathinfo === '/reportes/cartera/generarReporteMedidoresInternos') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_medidoresinternos_generarreportemedidoresinternos;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\MedidoresInternosController::generarReporteMedidoresInternos',  '_route' => 'reportes_reportes_medidoresinternos_generarreportemedidoresinternos',);
                }
                not_reportes_reportes_medidoresinternos_generarreportemedidoresinternos:

                // reportes_reportes_facturadovsrecaudado_facturadovsrecaudado
                if ($pathinfo === '/reportes/cartera/facturadovsrecaudado') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_facturadovsrecaudado_facturadovsrecaudado;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturadoVsRecaudadoController::facturadoVsRecaudado',  '_route' => 'reportes_reportes_facturadovsrecaudado_facturadovsrecaudado',);
                }
                not_reportes_reportes_facturadovsrecaudado_facturadovsrecaudado:

                // reportes_reportes_facturadovsrecaudado_generarreporte
                if ($pathinfo === '/reportes/cartera/generarReporteFacturadoRecaudado') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_facturadovsrecaudado_generarreporte;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\FacturadoVsRecaudadoController::generarReporte',  '_route' => 'reportes_reportes_facturadovsrecaudado_generarreporte',);
                }
                not_reportes_reportes_facturadovsrecaudado_generarreporte:

            }

            if (0 === strpos($pathinfo, '/reportes/ssp_rco')) {
                // reportes_reportes_suspensionesreconexionesfecha_suspensionesreconexionesfecha
                if ($pathinfo === '/reportes/ssp_rco/suspensionesReconexionesFecha') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_suspensionesreconexionesfecha_suspensionesreconexionesfecha;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesReconexionesFechaController::suspensionesReconexionesFecha',  '_route' => 'reportes_reportes_suspensionesreconexionesfecha_suspensionesreconexionesfecha',);
                }
                not_reportes_reportes_suspensionesreconexionesfecha_suspensionesreconexionesfecha:

                // reportes_reportes_suspensionesreconexionesfecha_generarreportesuspensionesreconexionesfecha
                if ($pathinfo === '/reportes/ssp_rco/generarReporteSuspensionesReconexionesFecha') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_suspensionesreconexionesfecha_generarreportesuspensionesreconexionesfecha;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesReconexionesFechaController::generarReporteSuspensionesReconexionesFecha',  '_route' => 'reportes_reportes_suspensionesreconexionesfecha_generarreportesuspensionesreconexionesfecha',);
                }
                not_reportes_reportes_suspensionesreconexionesfecha_generarreportesuspensionesreconexionesfecha:

                // reportes_reportes_suspensionesreconexionesconsolidado_suspensionesreconexionesconsolidado
                if ($pathinfo === '/reportes/ssp_rco/suspensionesReconexionesConsolidado') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_suspensionesreconexionesconsolidado_suspensionesreconexionesconsolidado;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesReconexionesConsolidadoController::suspensionesReconexionesConsolidado',  '_route' => 'reportes_reportes_suspensionesreconexionesconsolidado_suspensionesreconexionesconsolidado',);
                }
                not_reportes_reportes_suspensionesreconexionesconsolidado_suspensionesreconexionesconsolidado:

                // reportes_reportes_suspensionesreconexionesconsolidado_generarreportesuspensionesreconexionesconsolidado
                if ($pathinfo === '/reportes/ssp_rco/generarReporteSuspensionesReconexionesConsolidado') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_suspensionesreconexionesconsolidado_generarreportesuspensionesreconexionesconsolidado;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\SuspensionesReconexionesConsolidadoController::generarReporteSuspensionesReconexionesConsolidado',  '_route' => 'reportes_reportes_suspensionesreconexionesconsolidado_generarreportesuspensionesreconexionesconsolidado',);
                }
                not_reportes_reportes_suspensionesreconexionesconsolidado_generarreportesuspensionesreconexionesconsolidado:

            }

            if (0 === strpos($pathinfo, '/reportes/cartera')) {
                // reportes_reportes_cartasgestioncartera_cartasgestioncartera
                if ($pathinfo === '/reportes/cartera/cartasGestionCartera') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_cartasgestioncartera_cartasgestioncartera;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CartasGestionCarteraController::cartasGestionCartera',  '_route' => 'reportes_reportes_cartasgestioncartera_cartasgestioncartera',);
                }
                not_reportes_reportes_cartasgestioncartera_cartasgestioncartera:

                // reportes_reportes_cartasgestioncartera_generarreportecartasgestioncartera
                if ($pathinfo === '/reportes/cartera/generarReporteCartasGestionCartera') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_cartasgestioncartera_generarreportecartasgestioncartera;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CartasGestionCarteraController::generarReporteCartasGestionCartera',  '_route' => 'reportes_reportes_cartasgestioncartera_generarreportecartasgestioncartera',);
                }
                not_reportes_reportes_cartasgestioncartera_generarreportecartasgestioncartera:

            }

            if (0 === strpos($pathinfo, '/reportes/facturacion')) {
                // reportes_reportes_veredas_veredas
                if ($pathinfo === '/reportes/facturacion/veredas') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_veredas_veredas;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VeredasController::veredas',  '_route' => 'reportes_reportes_veredas_veredas',);
                }
                not_reportes_reportes_veredas_veredas:

                if (0 === strpos($pathinfo, '/reportes/facturacion/generarveredasreporte')) {
                    // reportes_reportes_veredas_generarreporte
                    if ($pathinfo === '/reportes/facturacion/generarveredasreporteformato2') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_veredas_generarreporte;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VeredasController::generarReporte',  '_route' => 'reportes_reportes_veredas_generarreporte',);
                    }
                    not_reportes_reportes_veredas_generarreporte:

                    // reportes_reportes_veredas_generarnotasreporte
                    if ($pathinfo === '/reportes/facturacion/generarveredasreporte') {
                        if ($this->context->getMethod() != 'POST') {
                            $allow[] = 'POST';
                            goto not_reportes_reportes_veredas_generarnotasreporte;
                        }

                        return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\VeredasController::generarNotasReporte',  '_route' => 'reportes_reportes_veredas_generarnotasreporte',);
                    }
                    not_reportes_reportes_veredas_generarnotasreporte:

                }

                // reportes_reportes_cartasuti_cartasuticartera
                if ($pathinfo === '/reportes/facturacion/cartasUti') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_cartasuti_cartasuticartera;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CartasUtiController::cartasUtiCartera',  '_route' => 'reportes_reportes_cartasuti_cartasuticartera',);
                }
                not_reportes_reportes_cartasuti_cartasuticartera:

                // reportes_reportes_cartasuti_generarreportecartasuti
                if ($pathinfo === '/reportes/facturacion/generarReporteCartasUti') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_cartasuti_generarreportecartasuti;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\CartasUtiController::generarReporteCartasUti',  '_route' => 'reportes_reportes_cartasuti_generarreportecartasuti',);
                }
                not_reportes_reportes_cartasuti_generarreportecartasuti:

                // reportes_reportes_notasreporte_notasreportes
                if ($pathinfo === '/reportes/facturacion/notasreporte') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_notasreporte_notasreportes;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\NotasReporteController::notasReportes',  '_route' => 'reportes_reportes_notasreporte_notasreportes',);
                }
                not_reportes_reportes_notasreporte_notasreportes:

                // reportes_reportes_notasreporte_generarnotasreporte
                if ($pathinfo === '/reportes/facturacion/generarnotasreporte') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_notasreporte_generarnotasreporte;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\NotasReporteController::generarNotasReporte',  '_route' => 'reportes_reportes_notasreporte_generarnotasreporte',);
                }
                not_reportes_reportes_notasreporte_generarnotasreporte:

            }

            if (0 === strpos($pathinfo, '/reportes/Tarifas')) {
                // reportes_reportes_tarifasreportes_tarifasaplicadas
                if ($pathinfo === '/reportes/Tarifas/tarifasAplicadas') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_tarifasreportes_tarifasaplicadas;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\TarifasReportesController::tarifasAplicadas',  '_route' => 'reportes_reportes_tarifasreportes_tarifasaplicadas',);
                }
                not_reportes_reportes_tarifasreportes_tarifasaplicadas:

                // reportes_reportes_tarifasreportes_generartarifasaplicadas
                if ($pathinfo === '/reportes/Tarifas/generarTarifasAplicadas') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_tarifasreportes_generartarifasaplicadas;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\TarifasReportesController::generarTarifasAplicadas',  '_route' => 'reportes_reportes_tarifasreportes_generartarifasaplicadas',);
                }
                not_reportes_reportes_tarifasreportes_generartarifasaplicadas:

                // reportes_reportes_tarifasreportes_variablescalculo
                if ($pathinfo === '/reportes/Tarifas/variablesCalculo') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_tarifasreportes_variablescalculo;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\TarifasReportesController::VariablesCalculo',  '_route' => 'reportes_reportes_tarifasreportes_variablescalculo',);
                }
                not_reportes_reportes_tarifasreportes_variablescalculo:

                // reportes_reportes_tarifasreportes_generarreportevariablescalculo
                if ($pathinfo === '/reportes/Tarifas/generarReporteVariablesCalculo') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_tarifasreportes_generarreportevariablescalculo;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\TarifasReportesController::generarReporteVariablesCalculo',  '_route' => 'reportes_reportes_tarifasreportes_generarreportevariablescalculo',);
                }
                not_reportes_reportes_tarifasreportes_generarreportevariablescalculo:

                // reportes_reportes_tarifasreportes_tarifasfes
                if ($pathinfo === '/reportes/Tarifas/tarifasFES') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_tarifasreportes_tarifasfes;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\TarifasReportesController::tarifasFES',  '_route' => 'reportes_reportes_tarifasreportes_tarifasfes',);
                }
                not_reportes_reportes_tarifasreportes_tarifasfes:

                // reportes_reportes_tarifasreportes_generartarifasfes
                if ($pathinfo === '/reportes/Tarifas/generarTarifasFES') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_tarifasreportes_generartarifasfes;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\TarifasReportesController::generarTarifasFES',  '_route' => 'reportes_reportes_tarifasreportes_generartarifasfes',);
                }
                not_reportes_reportes_tarifasreportes_generartarifasfes:

                // reportes_reportes_tarifasreportes_opciontarifaespecial
                if ($pathinfo === '/reportes/Tarifas/opcionTarifaEspecial') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_tarifasreportes_opciontarifaespecial;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\TarifasReportesController::opcionTarifaEspecial',  '_route' => 'reportes_reportes_tarifasreportes_opciontarifaespecial',);
                }
                not_reportes_reportes_tarifasreportes_opciontarifaespecial:

                // reportes_reportes_tarifasreportes_generarreporteopciontarifaespecial
                if ($pathinfo === '/reportes/Tarifas/generarReporteOpcionTarifaEspecial') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_tarifasreportes_generarreporteopciontarifaespecial;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\TarifasReportesController::generarReporteOpcionTarifaEspecial',  '_route' => 'reportes_reportes_tarifasreportes_generarreporteopciontarifaespecial',);
                }
                not_reportes_reportes_tarifasreportes_generarreporteopciontarifaespecial:

                // reportes_reportes_tarifasreportes_opciontarifaespecialfaltantesobrante
                if ($pathinfo === '/reportes/Tarifas/opcionTarifaFaltanteSobrante') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_tarifasreportes_opciontarifaespecialfaltantesobrante;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\TarifasReportesController::opcionTarifaEspecialFaltanteSobrante',  '_route' => 'reportes_reportes_tarifasreportes_opciontarifaespecialfaltantesobrante',);
                }
                not_reportes_reportes_tarifasreportes_opciontarifaespecialfaltantesobrante:

                // reportes_reportes_tarifasreportes_generarreporteopciontarifafaltantesobrante
                if ($pathinfo === '/reportes/Tarifas/generarReporteFaltanteSobrante') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_tarifasreportes_generarreporteopciontarifafaltantesobrante;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\TarifasReportesController::generarReporteOpcionTarifaFaltanteSobrante',  '_route' => 'reportes_reportes_tarifasreportes_generarreporteopciontarifafaltantesobrante',);
                }
                not_reportes_reportes_tarifasreportes_generarreporteopciontarifafaltantesobrante:

            }

            if (0 === strpos($pathinfo, '/reportes/facturacion')) {
                // reportes_reportes_tarifas_index
                if ($pathinfo === '/reportes/facturacion/reporteTarifas') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_tarifas_index;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\TarifasController::indexAction',  '_route' => 'reportes_reportes_tarifas_index',);
                }
                not_reportes_reportes_tarifas_index:

                // reportes_reportes_tarifas_generartarifavalidar
                if ($pathinfo === '/reportes/facturacion/generarTarifaValidar') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_tarifas_generartarifavalidar;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\TarifasController::generarTarifaValidar',  '_route' => 'reportes_reportes_tarifas_generartarifavalidar',);
                }
                not_reportes_reportes_tarifas_generartarifavalidar:

            }

            if (0 === strpos($pathinfo, '/reportes/admin')) {
                // reportes_reportes_parametrizacionreportes_index
                if ($pathinfo === '/reportes/admin/parametrizacionReportes') {
                    if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                        $allow = array_merge($allow, array('GET', 'HEAD'));
                        goto not_reportes_reportes_parametrizacionreportes_index;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ParametrizacionReportesController::indexAction',  '_route' => 'reportes_reportes_parametrizacionreportes_index',);
                }
                not_reportes_reportes_parametrizacionreportes_index:

                // reportes_reportes_parametrizacionreportes_generartarifavalidar
                if ($pathinfo === '/reportes/admin/generarTarifaValidar') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_parametrizacionreportes_generartarifavalidar;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ParametrizacionReportesController::generarTarifaValidar',  '_route' => 'reportes_reportes_parametrizacionreportes_generartarifavalidar',);
                }
                not_reportes_reportes_parametrizacionreportes_generartarifavalidar:

                // reportes_reportes_parametrizacionreportes_insertarreporteunidades
                if ($pathinfo === '/reportes/admin/insertarReporteUnidades') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_parametrizacionreportes_insertarreporteunidades;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ParametrizacionReportesController::insertarReporteUnidades',  '_route' => 'reportes_reportes_parametrizacionreportes_insertarreporteunidades',);
                }
                not_reportes_reportes_parametrizacionreportes_insertarreporteunidades:

                // reportes_reportes_parametrizacionreportes_editarreporteunidades
                if ($pathinfo === '/reportes/admin/editarReporteUnidades') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_parametrizacionreportes_editarreporteunidades;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ParametrizacionReportesController::editarReporteUnidades',  '_route' => 'reportes_reportes_parametrizacionreportes_editarreporteunidades',);
                }
                not_reportes_reportes_parametrizacionreportes_editarreporteunidades:

                // reportes_reportes_parametrizacionreportes_valoresreportejasper
                if ($pathinfo === '/reportes/admin/valoresReporteJasper') {
                    if ($this->context->getMethod() != 'POST') {
                        $allow[] = 'POST';
                        goto not_reportes_reportes_parametrizacionreportes_valoresreportejasper;
                    }

                    return array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ParametrizacionReportesController::valoresReporteJasper',  '_route' => 'reportes_reportes_parametrizacionreportes_valoresreportejasper',);
                }
                not_reportes_reportes_parametrizacionreportes_valoresreportejasper:

            }

            // reportes_reportes_reportesreactpriase_indexreportesreactpriase
            if (0 === strpos($pathinfo, '/reportes/reportesreactpriase') && preg_match('#^/reportes/reportesreactpriase/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                if (!in_array($this->context->getMethod(), array('GET', 'HEAD'))) {
                    $allow = array_merge($allow, array('GET', 'HEAD'));
                    goto not_reportes_reportes_reportesreactpriase_indexreportesreactpriase;
                }

                return $this->mergeDefaults(array_replace($matches, array('_route' => 'reportes_reportes_reportesreactpriase_indexreportesreactpriase')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\ReportesReactPriaseController::indexReportesReactPriase',));
            }
            not_reportes_reportes_reportesreactpriase_indexreportesreactpriase:

        }

        if (0 === strpos($pathinfo, '/proceso/actualizar_saldos')) {
            // llanogas_actualizar_todas_facturas
            if (rtrim($pathinfo, '/') === '/proceso/actualizar_saldos') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'llanogas_actualizar_todas_facturas');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefaultController::actualizarSaldoFacturasAction',  '_route' => 'llanogas_actualizar_todas_facturas',);
            }

            // llanogas_actualizar_todas_facturas_notas
            if (rtrim($pathinfo, '/') === '/proceso/actualizar_saldos_notas') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'llanogas_actualizar_todas_facturas_notas');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefaultController::actualizarSaldoFacturasNotasAction',  '_route' => 'llanogas_actualizar_todas_facturas_notas',);
            }

        }

        if (0 === strpos($pathinfo, '/test')) {
            // llanogas_actualizar_una_facturas
            if ($pathinfo === '/test/factura/saldo') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefaultController::actualizarFacturaAction',  '_route' => 'llanogas_actualizar_una_facturas',);
            }

            // llanogas_eliminar_recaudos_masivo
            if ($pathinfo === '/test/recaudo/eliminar') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefaultController::eliminarRecaudo1Action',  '_route' => 'llanogas_eliminar_recaudos_masivo',);
            }

        }

        // llanogas_llas_menu
        if (rtrim($pathinfo, '/') === '/menu') {
            if (substr($pathinfo, -1) !== '/') {
                return $this->redirect($pathinfo.'/', 'llanogas_llas_menu');
            }

            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefaultController::getMenuAction',  '_route' => 'llanogas_llas_menu',);
        }

        // llanogas_llanogalcome
        if (rtrim($pathinfo, '/') === '') {
            if (substr($pathinfo, -1) !== '/') {
                return $this->redirect($pathinfo.'/', 'llanogas_llanogalcome');
            }

            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefaultController::welcomeAction',  '_route' => 'llanogas_llanogalcome',);
        }

        // llanogas_llanogas_proceso
        if ($pathinfo === '/proceso') {
            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefaultController::procesoAction',  '_route' => 'llanogas_llanogas_proceso',);
        }

        // llanogas_llanogas_scripts
        if ($pathinfo === '/scripts') {
            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefaultController::ejecutarFuncionAction',  '_route' => 'llanogas_llanogas_scripts',);
        }

        // llanogas_llanogas_tepattern
        if ($pathinfo === '/test') {
            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefaultController::testAction',  '_route' => 'llanogas_llanogas_tepattern',);
        }

        if (0 === strpos($pathinfo, '/rutas')) {
            if (0 === strpos($pathinfo, '/rutas/gestionrutas')) {
                // rutas_gestionrutas
                if (rtrim($pathinfo, '/') === '/rutas/gestionrutas') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'rutas_gestionrutas');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionRutasController::indexAction',  '_route' => 'rutas_gestionrutas',);
                }

                // rutas_busca_municipios_nuevo
                if (rtrim($pathinfo, '/') === '/rutas/gestionrutas/busca_municipios_nuevo') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'rutas_busca_municipios_nuevo');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionRutasController::buscaMunicipiosNuevoAction',  '_route' => 'rutas_busca_municipios_nuevo',);
                }

                // rutas_consulta_periodoVencimiento
                if (rtrim($pathinfo, '/') === '/rutas/gestionrutas/consulta_periodoVencimiento') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'rutas_consulta_periodoVencimiento');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionRutasController::consultaPeriodoVencimientoAction',  '_route' => 'rutas_consulta_periodoVencimiento',);
                }

                // rutas_actualiza_ruta_periodos_fechas
                if (rtrim($pathinfo, '/') === '/rutas/gestionrutas/actualiza_ruta_periodos_fechas') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'rutas_actualiza_ruta_periodos_fechas');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionRutasController::actualizaRutaPeriodosFechasAction',  '_route' => 'rutas_actualiza_ruta_periodos_fechas',);
                }

                // rutas_grabar_rutas_gestion
                if (rtrim($pathinfo, '/') === '/rutas/gestionrutas/grabar_rutas_gestion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'rutas_grabar_rutas_gestion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionRutasController::grabarRutasGestionAction',  '_route' => 'rutas_grabar_rutas_gestion',);
                }

                if (0 === strpos($pathinfo, '/rutas/gestionrutas/busca')) {
                    // rutas_buscar_rutas
                    if (rtrim($pathinfo, '/') === '/rutas/gestionrutas/buscar_rutas') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'rutas_buscar_rutas');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionRutasController::buscarRutasAction',  '_route' => 'rutas_buscar_rutas',);
                    }

                    // rutas_busca_Municipios_Barrios
                    if (rtrim($pathinfo, '/') === '/rutas/gestionrutas/busca_MunicipiosBarrios') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'rutas_busca_Municipios_Barrios');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionRutasController::buscaMunicipiosBarriosAction',  '_route' => 'rutas_busca_Municipios_Barrios',);
                    }

                }

            }

            if (0 === strpos($pathinfo, '/rutas/suscripciones_rutas')) {
                // rutas_grabar_rutas
                if (rtrim($pathinfo, '/') === '/rutas/suscripciones_rutas') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'rutas_grabar_rutas');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RutasController::indexAction',  '_route' => 'rutas_grabar_rutas',);
                }

                if (0 === strpos($pathinfo, '/rutas/suscripciones_rutas/filtrar/consultar_')) {
                    if (0 === strpos($pathinfo, '/rutas/suscripciones_rutas/filtrar/consultar_s')) {
                        // filtrar_rutas_consultar_susrr
                        if ($pathinfo === '/rutas/suscripciones_rutas/filtrar/consultar_suscriptores') {
                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RutasController::consultarSuscriptoresAction',  '_route' => 'filtrar_rutas_consultar_susrr',);
                        }

                        // filtrar_rutas_consultar_rutassin
                        if ($pathinfo === '/rutas/suscripciones_rutas/filtrar/consultar_sinrutas') {
                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RutasController::consultarRutasSinAction',  '_route' => 'filtrar_rutas_consultar_rutassin',);
                        }

                    }

                    // filtrar_rutas_consultar_rutasasi
                    if ($pathinfo === '/rutas/suscripciones_rutas/filtrar/consultar_asirutas') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RutasController::consultarRutasAsiAction',  '_route' => 'filtrar_rutas_consultar_rutasasi',);
                    }

                }

                if (0 === strpos($pathinfo, '/rutas/suscripciones_rutas/rutas')) {
                    if (0 === strpos($pathinfo, '/rutas/suscripciones_rutas/rutas/grabar')) {
                        // rutas_grabar_rutassin
                        if ($pathinfo === '/rutas/suscripciones_rutas/rutas/grabar_rutassin') {
                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RutasController::grabarRutasSinAction',  '_route' => 'rutas_grabar_rutassin',);
                        }

                        if (0 === strpos($pathinfo, '/rutas/suscripciones_rutas/rutas/grabarbd_rutas')) {
                            // rutas_grabarbd_rutassin
                            if ($pathinfo === '/rutas/suscripciones_rutas/rutas/grabarbd_rutassin') {
                                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RutasController::grabarBDRutasSinAction',  '_route' => 'rutas_grabarbd_rutassin',);
                            }

                            // rutas_grabarbd_rutasasi
                            if ($pathinfo === '/rutas/suscripciones_rutas/rutas/grabarbd_rutasasi') {
                                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RutasController::grabarBDRutasAsiAction',  '_route' => 'rutas_grabarbd_rutasasi',);
                            }

                        }

                        // rutas_grabar_trasladarutas
                        if ($pathinfo === '/rutas/suscripciones_rutas/rutas/grabarTrasladaRutas') {
                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RutasController::grabarTrasladaRutasAction',  '_route' => 'rutas_grabar_trasladarutas',);
                        }

                    }

                    // rutas_actualizar
                    if ($pathinfo === '/rutas/suscripciones_rutas/rutas/actualizaconsecutivoruta') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RutasController::actualizaConsecutivoRutaAction',  '_route' => 'rutas_actualizar',);
                    }

                }

            }

        }

        if (0 === strpos($pathinfo, '/operaciones/suspensiones')) {
            // suspensiones
            if (rtrim($pathinfo, '/') === '/operaciones/suspensiones') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'suspensiones');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::indexAction',  '_route' => 'suspensiones',);
            }

            if (0 === strpos($pathinfo, '/operaciones/suspensiones/seguimiento')) {
                // suspensiones_seguimiento
                if ($pathinfo === '/operaciones/suspensiones/seguimiento') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::seguimientoAction',  '_route' => 'suspensiones_seguimiento',);
                }

                // suspensiones_seguimiento_cuadrilla
                if ($pathinfo === '/operaciones/suspensiones/seguimiento/cuadrilla') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::localizacionCuadrillaAction',  '_route' => 'suspensiones_seguimiento_cuadrilla',);
                }

            }

            if (0 === strpos($pathinfo, '/operaciones/suspensiones/c')) {
                // suspensiones_filtrar
                if ($pathinfo === '/operaciones/suspensiones/consultar') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::filtrarDocumentoAction',  '_route' => 'suspensiones_filtrar',);
                }

                // suspensiones_cons_sin_suscrip
                if (rtrim($pathinfo, '/') === '/operaciones/suspensiones/crear') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'suspensiones_cons_sin_suscrip');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::crearSuscripcionAction',  '_route' => 'suspensiones_cons_sin_suscrip',);
                }

            }

        }

        // suspension_listar
        if ($pathinfo === '/listarsuspension') {
            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::listarSuspensionAction',  '_route' => 'suspension_listar',);
        }

        // suspension_buscar
        if (0 === strpos($pathinfo, '/buscarsuspension') && preg_match('#^/buscarsuspension/(?P<buscar>[^/]++)$#s', $pathinfo, $matches)) {
            return $this->mergeDefaults(array_replace($matches, array('_route' => 'suspension_buscar')), array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::buscarSuspensionAction',));
        }

        // suspension_cargar
        if ($pathinfo === '/cargar') {
            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::cargarComboAction',  '_route' => 'suspension_cargar',);
        }

        // suspension_nueva
        if ($pathinfo === '/operaciones/suspensiones/nueva_suspension') {
            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::nuevaSuspensionAction',  '_route' => 'suspension_nueva',);
        }

        // suspension_editar
        if ($pathinfo === '/editar_suspension') {
            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::editarSuspensionAction',  '_route' => 'suspension_editar',);
        }

        if (0 === strpos($pathinfo, '/operaciones/suspensiones')) {
            // suspension_detalle_crear
            if ($pathinfo === '/operaciones/suspensiones/nuevo_detalle') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::crearDetalleSuspensionAction',  '_route' => 'suspension_detalle_crear',);
            }

            if (0 === strpos($pathinfo, '/operaciones/suspensiones/e')) {
                // suspension_detalle_editar
                if ($pathinfo === '/operaciones/suspensiones/editar_detalle') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::editarDetalleSuspensionAction',  '_route' => 'suspension_detalle_editar',);
                }

                if (0 === strpos($pathinfo, '/operaciones/suspensiones/eliminar_')) {
                    // suspension_eliminar_detalle_suspension
                    if ($pathinfo === '/operaciones/suspensiones/eliminar_detalle_suspension') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::eliminarDetalleSuspensionAction',  '_route' => 'suspension_eliminar_detalle_suspension',);
                    }

                    // suspension_eliminar_detalle_reconexion
                    if ($pathinfo === '/operaciones/suspensiones/eliminar_reconexion') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::eliminarReconexionAction',  '_route' => 'suspension_eliminar_detalle_reconexion',);
                    }

                }

            }

            // suspension_obtener_suspension_reconexiones
            if ($pathinfo === '/operaciones/suspensiones/ultima_suspension') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::getSuspensionParaReconexionAction',  '_route' => 'suspension_obtener_suspension_reconexiones',);
            }

            if (0 === strpos($pathinfo, '/operaciones/suspensiones/valor_')) {
                // suspension_obtener_valor_novedad_suspension
                if ($pathinfo === '/operaciones/suspensiones/valor_suspension') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::getValorNovedadSuspensionAction',  '_route' => 'suspension_obtener_valor_novedad_suspension',);
                }

                // suspension_obtener_valor_novedad_reconexion
                if ($pathinfo === '/operaciones/suspensiones/valor_reconexion') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::getValorNovedadReconexionAction',  '_route' => 'suspension_obtener_valor_novedad_reconexion',);
                }

            }

            if (0 === strpos($pathinfo, '/operaciones/suspensiones/consultar_')) {
                // suscripcion_filtrar
                if ($pathinfo === '/operaciones/suspensiones/consultar_suscripcion') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::consultarSuscripcionAction',  '_route' => 'suscripcion_filtrar',);
                }

                // suscripcion_ciclo_periodo_actual
                if ($pathinfo === '/operaciones/suspensiones/consultar_ciclo_periodo') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::getCicloPeriodoAction',  '_route' => 'suscripcion_ciclo_periodo_actual',);
                }

                // consultar_detalles_suspension
                if (0 === strpos($pathinfo, '/operaciones/suspensiones/consultar_detalles_suspension') && preg_match('#^/operaciones/suspensiones/consultar_detalles_suspension/(?P<idSuspension>[^/]++)$#s', $pathinfo, $matches)) {
                    return $this->mergeDefaults(array_replace($matches, array('_route' => 'consultar_detalles_suspension')), array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::consultarDetallesSuspensionAction',));
                }

            }

            // suscripcion_filtar_detalle
            if ($pathinfo === '/operaciones/suspensiones/detalles_suscripcion') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::detalleSuscripcionAction',  '_route' => 'suscripcion_filtar_detalle',);
            }

            // insertar_nueva_reconexion
            if ($pathinfo === '/operaciones/suspensiones/insertar_reconexion') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::insertaReconexionAction',  '_route' => 'insertar_nueva_reconexion',);
            }

            // suscripcion_filtar
            if ($pathinfo === '/operaciones/suspensiones/actualizar_reconexion') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::actualizarReconexionAction',  '_route' => 'suscripcion_filtar',);
            }

            if (0 === strpos($pathinfo, '/operaciones/suspensiones/consultar_')) {
                // consultar_suspensiones
                if ($pathinfo === '/operaciones/suspensiones/consultar_suspensiones') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::consultarSuspensionAction',  '_route' => 'consultar_suspensiones',);
                }

                // consultar_reconexiones
                if ($pathinfo === '/operaciones/suspensiones/consultar_reconexiones') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::consultarReconexionAction',  '_route' => 'consultar_reconexiones',);
                }

            }

            // suspension_eliminar
            if ($pathinfo === '/operaciones/suspensiones/eliminar_suspension') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::eliminarSuspensionAction',  '_route' => 'suspension_eliminar',);
            }

            // cabecera_actualizar
            if ($pathinfo === '/operaciones/suspensiones/actualizar_cabecera') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::actualizarCabeceraAction',  '_route' => 'cabecera_actualizar',);
            }

            if (0 === strpos($pathinfo, '/operaciones/suspensiones/consultar_')) {
                // consultar_estados_suspension
                if ($pathinfo === '/operaciones/suspensiones/consultar_estados_suspension') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::consultarEstadosSuspensionAction',  '_route' => 'consultar_estados_suspension',);
                }

                // consultar_motivos
                if ($pathinfo === '/operaciones/suspensiones/consultar_motivos_suspension') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::consultarMotivosAction',  '_route' => 'consultar_motivos',);
                }

                // consultar_conceptos
                if ($pathinfo === '/operaciones/suspensiones/consultar_conceptos_suspension') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::consultarConceptosAction',  '_route' => 'consultar_conceptos',);
                }

                if (0 === strpos($pathinfo, '/operaciones/suspensiones/consultar_novedades_')) {
                    // consultar_novedades
                    if ($pathinfo === '/operaciones/suspensiones/consultar_novedades_suspension') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::consultarNovedadesSuspensionAction',  '_route' => 'consultar_novedades',);
                    }

                    // consultar_novedades_reconexion
                    if ($pathinfo === '/operaciones/suspensiones/consultar_novedades_reconexion') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::consultarNovedadesReconexionAction',  '_route' => 'consultar_novedades_reconexion',);
                    }

                }

                if (0 === strpos($pathinfo, '/operaciones/suspensiones/consultar_t')) {
                    // consultar_tipos_suspension
                    if ($pathinfo === '/operaciones/suspensiones/consultar_tipos_suspension') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::consultarTiposSuspensionAction',  '_route' => 'consultar_tipos_suspension',);
                    }

                    if (0 === strpos($pathinfo, '/operaciones/suspensiones/consultar_terceros')) {
                        // consultar_terceros
                        if ($pathinfo === '/operaciones/suspensiones/consultar_terceros') {
                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::consultarTercerosAction',  '_route' => 'consultar_terceros',);
                        }

                        // consultar_suspension_terceros
                        if ($pathinfo === '/operaciones/suspensiones/consultar_terceros_suspension') {
                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::getTercerosAction',  '_route' => 'consultar_suspension_terceros',);
                        }

                    }

                }

                if (0 === strpos($pathinfo, '/operaciones/suspensiones/consultar_m')) {
                    // consultar_municipios
                    if ($pathinfo === '/operaciones/suspensiones/consultar_municipios') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::getMunicipiosAction',  '_route' => 'consultar_municipios',);
                    }

                    // consultar_motivos_reconexion
                    if ($pathinfo === '/operaciones/suspensiones/consultar_motivos_reconexion') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::getMotivosReconexionAction',  '_route' => 'consultar_motivos_reconexion',);
                    }

                }

                // consultar_valor_concepto
                if ($pathinfo === '/operaciones/suspensiones/consultar_valor_concepto') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::getValorConceptoAction',  '_route' => 'consultar_valor_concepto',);
                }

            }

            // consultar_usuario_puede_habilitar
            if ($pathinfo === '/operaciones/suspensiones/habilitar_ssp_rco') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::habilitarSspRcoAction',  '_route' => 'consultar_usuario_puede_habilitar',);
            }

            // consulta_financiacion_factura
            if ($pathinfo === '/operaciones/suspensiones/getinfofacturafinancia') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuspensionController::getInformacionFacturaFinanaciacionAction',  '_route' => 'consulta_financiacion_factura',);
            }

        }

        if (0 === strpos($pathinfo, '/recaudos')) {
            if (0 === strpos($pathinfo, '/recaudos/pagos')) {
                // pagos
                if (rtrim($pathinfo, '/') === '/recaudos/pagos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'pagos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\PagosController::indexAction',  '_route' => 'pagos',);
                }

                // pagos_suscripciones
                if (rtrim($pathinfo, '/') === '/recaudos/pagos/suscripciones') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'pagos_suscripciones');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\PagosController::getSuscripcionesPagoAction',  '_route' => 'pagos_suscripciones',);
                }

            }

            // abonos
            if (rtrim($pathinfo, '/') === '/recaudos/abonos') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'abonos');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AbonosController::indexAction',  '_route' => 'abonos',);
            }

            // abonos_consultar_suscripcion
            if (rtrim($pathinfo, '/') === '/recaudos/consultar_suscriptor') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'abonos_consultar_suscripcion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AbonosController::consultarSuscripcionAction',  '_route' => 'abonos_consultar_suscripcion',);
            }

            // abonos_cargar_factura_suscripcion
            if (rtrim($pathinfo, '/') === '/recaudos/abonos/factura_suscripcion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'abonos_cargar_factura_suscripcion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AbonosController::cargarFacturaSuscripcionAction',  '_route' => 'abonos_cargar_factura_suscripcion',);
            }

            if (0 === strpos($pathinfo, '/recaudos/consultar_recaudo')) {
                // consultar_recaudo
                if (rtrim($pathinfo, '/') === '/recaudos/consultar_recaudo') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'consultar_recaudo');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsultarRecaudoController::indexAction',  '_route' => 'consultar_recaudo',);
                }

                // consultar_recaudos
                if ($pathinfo === '/recaudos/consultar_recaudo/consultar_recaudos') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsultarRecaudoController::consultarRecaudosAction',  '_route' => 'consultar_recaudos',);
                }

                // obtener_informacion_recaudo
                if ($pathinfo === '/recaudos/consultar_recaudo/obtener_informacion_recaudo') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsultarRecaudoController::obtenerInformacionRecaudoAction',  '_route' => 'obtener_informacion_recaudo',);
                }

            }

            // anticipos
            if (rtrim($pathinfo, '/') === '/recaudos/anticipos') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'anticipos');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AnticiposController::indexAction',  '_route' => 'anticipos',);
            }

            // registrar_recaudo_anticipos
            if ($pathinfo === '/recaudos/registrar_recaudo_anticipos') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AnticiposController::registrarAnticipoAction',  '_route' => 'registrar_recaudo_anticipos',);
            }

            if (0 === strpos($pathinfo, '/recaudos/obtener')) {
                // registrar_recaudo_anticipos_liquidaciones
                if (rtrim($pathinfo, '/') === '/recaudos/obtener/liquidaciones') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registrar_recaudo_anticipos_liquidaciones');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AnticiposController::consultarTiposLiquidacionAction',  '_route' => 'registrar_recaudo_anticipos_liquidaciones',);
                }

                // registrar_recaudo_anticipos_documentos
                if (rtrim($pathinfo, '/') === '/recaudos/obtener/documentos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registrar_recaudo_anticipos_documentos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AnticiposController::consultarDocumentosAction',  '_route' => 'registrar_recaudo_anticipos_documentos',);
                }

                // registrar_recaudo_anticipos_tipos_documento
                if (rtrim($pathinfo, '/') === '/recaudos/obtener/tipos_documento') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registrar_recaudo_anticipos_tipos_documento');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AnticiposController::consultarTiposDocumentoPorTipoUsoAction',  '_route' => 'registrar_recaudo_anticipos_tipos_documento',);
                }

            }

            // cartera_castigada
            if (rtrim($pathinfo, '/') === '/recaudos/cartera_castigada') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'cartera_castigada');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CarteraCastigadaController::indexAction',  '_route' => 'cartera_castigada',);
            }

            // consultar_suscrip_cartera_castigada
            if ($pathinfo === '/recaudos/suscripciones_cartera_castigada') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CarteraCastigadaController::consultarSuscripcionesCarteraAction',  '_route' => 'consultar_suscrip_cartera_castigada',);
            }

            // consultar_facturas_cartera_castigada
            if ($pathinfo === '/recaudos/factura_cartera_castigada') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CarteraCastigadaController::consultarFacturasCarteraAction',  '_route' => 'consultar_facturas_cartera_castigada',);
            }

            // consultar_bancos
            if ($pathinfo === '/recaudos/lista_bancos') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AbonosController::consultarBancosAction',  '_route' => 'consultar_bancos',);
            }

            // recaudos_consultar_bancos
            if (rtrim($pathinfo, '/') === '/recaudos/consultar_bancos') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'recaudos_consultar_bancos');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::consultarBancosAction',  '_route' => 'recaudos_consultar_bancos',);
            }

            if (0 === strpos($pathinfo, '/recaudos/lista_')) {
                // consultar_tipos_liquidacion
                if ($pathinfo === '/recaudos/lista_tipo_liquidacion') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AnticiposController::consultarTiposLiquidacionAction',  '_route' => 'consultar_tipos_liquidacion',);
                }

                // consultar_conceptos_anticipos
                if ($pathinfo === '/recaudos/lista_conceptos_anticipos') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AnticiposController::consultarConceptosAnticiposAction',  '_route' => 'consultar_conceptos_anticipos',);
                }

                // consultar_tipos_documentos
                if ($pathinfo === '/recaudos/lista_tiposdocumentos_anticipos') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AnticiposController::consultarDocumentosTiposAnticiposAction',  '_route' => 'consultar_tipos_documentos',);
                }

            }

            // registrar_recaudo_abono
            if ($pathinfo === '/recaudos/registrar_recaudo_abono') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AbonosController::registrarAbonoAction',  '_route' => 'registrar_recaudo_abono',);
            }

            // consultar_tipos_documentos_documentos_por_liquidacion
            if ($pathinfo === '/recaudos/lista_tiposdocumentos_por_liquidacion_anticipos') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AnticiposController::consultarDocumentosTiposPorLiquidacionAction',  '_route' => 'consultar_tipos_documentos_documentos_por_liquidacion',);
            }

            // registrar_recaudo_pago
            if ($pathinfo === '/recaudos/registrar_recaudo_pago') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\PagosController::registrarPagoAction',  '_route' => 'registrar_recaudo_pago',);
            }

            if (0 === strpos($pathinfo, '/recaudos/anular_recaudo')) {
                // anular_recaudo
                if (rtrim($pathinfo, '/') === '/recaudos/anular_recaudo') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'anular_recaudo');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AnularController::indexAction',  '_route' => 'anular_recaudo',);
                }

                if (0 === strpos($pathinfo, '/recaudos/anular_recaudo/buscar_recaudos')) {
                    // anular_recaudo_buscar_recaudos
                    if ($pathinfo === '/recaudos/anular_recaudo/buscar_recaudos') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AnularController::buscarRecaudosAction',  '_route' => 'anular_recaudo_buscar_recaudos',);
                    }

                    // anular_recaudo_buscar_motivos
                    if ($pathinfo === '/recaudos/anular_recaudo/buscar_recaudos') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AnularController::buscarRecaudosAction',  '_route' => 'anular_recaudo_buscar_motivos',);
                    }

                }

                // anular_recaudo_buscar_info_recaudos
                if ($pathinfo === '/recaudos/anular_recaudo/informacion_recaudos') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AnularController::obtenerResultadosRecaudoAction',  '_route' => 'anular_recaudo_buscar_info_recaudos',);
                }

                // anular_recaudo_registrar_anulacion
                if ($pathinfo === '/recaudos/anular_recaudo/registrar_anulacion') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AnularController::registrarAnularAction',  '_route' => 'anular_recaudo_registrar_anulacion',);
                }

            }

            if (0 === strpos($pathinfo, '/recaudos/importacion')) {
                // importar_recaudo
                if (rtrim($pathinfo, '/') === '/recaudos/importacion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'importar_recaudo');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CargarRecaudosController::indexAction',  '_route' => 'importar_recaudo',);
                }

                // importar_recaudo_progreso
                if (rtrim($pathinfo, '/') === '/recaudos/importacion/progreso') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'importar_recaudo_progreso');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CargarRecaudosController::consultarProgresoAction',  '_route' => 'importar_recaudo_progreso',);
                }

                // importar_recaudo_resumen
                if (rtrim($pathinfo, '/') === '/recaudos/importacion/resumen') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'importar_recaudo_resumen');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CargarRecaudosController::consultarResumenAction',  '_route' => 'importar_recaudo_resumen',);
                }

                // importar_recaudo_consultarsucursales
                if (rtrim($pathinfo, '/') === '/recaudos/importacion/consultarsucursalmediopago') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'importar_recaudo_consultarsucursales');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CargarRecaudosController::consultarSucursalesPorMedioPagoAction',  '_route' => 'importar_recaudo_consultarsucursales',);
                }

                // importar_recaudo_eliminar_resumen
                if (rtrim($pathinfo, '/') === '/recaudos/importacion/eliminar_tabla') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'importar_recaudo_eliminar_resumen');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CargarRecaudosController::eliminarResumenAction',  '_route' => 'importar_recaudo_eliminar_resumen',);
                }

                // importar_recaudo_cargar
                if (rtrim($pathinfo, '/') === '/recaudos/importacion/cargar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'importar_recaudo_cargar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CargarRecaudosController::cargarAction',  '_route' => 'importar_recaudo_cargar',);
                }

            }

        }

        if (0 === strpos($pathinfo, '/cartera')) {
            // cartera_consultar_dias_periodo
            if (rtrim($pathinfo, '/') === '/cartera/consultas_dias') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'cartera_consultar_dias_periodo');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::consultarDiasPeriodoAction',  '_route' => 'cartera_consultar_dias_periodo',);
            }

            if (0 === strpos($pathinfo, '/cartera/reestructurar')) {
                // reestructurar_financiacion
                if ($pathinfo === '/cartera/reestructurar') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ReestructurarFinanciacionController::indexAction',  '_route' => 'reestructurar_financiacion',);
                }

                // reestructurar_financiacion_consultar_suscripcion
                if ($pathinfo === '/cartera/reestructurar/suscripcion') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ReestructurarFinanciacionController::consultarSuscripcionAction',  '_route' => 'reestructurar_financiacion_consultar_suscripcion',);
                }

                // reestructurar_financiacion_tabla_financiacion
                if ($pathinfo === '/cartera/reestructurar/tabla_financiacion') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ReestructurarFinanciacionController::consultarTablaFinanciacionAction',  '_route' => 'reestructurar_financiacion_tabla_financiacion',);
                }

                // reestructurar_financiacion_consultar_conceptos
                if ($pathinfo === '/cartera/reestructurar/consultar_conceptos') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ReestructurarFinanciacionController::consultarConceptosAction',  '_route' => 'reestructurar_financiacion_consultar_conceptos',);
                }

                // reestructurar_financiacion_guardar
                if ($pathinfo === '/cartera/reestructurar/guardar') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ReestructurarFinanciacionController::guardarReestructuracionAction',  '_route' => 'reestructurar_financiacion_guardar',);
                }

            }

            // generar_financiacion
            if ($pathinfo === '/cartera/financiacion') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::indexAction',  '_route' => 'generar_financiacion',);
            }

            if (0 === strpos($pathinfo, '/cartera/generarfinanciacion')) {
                // generar_financiacion_filtrar_suscripciones
                if ($pathinfo === '/cartera/generarfinanciacion/filtrar') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::filtrarSuscripcionesFinanciacionAction',  '_route' => 'generar_financiacion_filtrar_suscripciones',);
                }

                // generar_financiacion_consultar_restriccion
                if ($pathinfo === '/cartera/generarfinanciacion/consultar_restriccion') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::consultarRestriccionAction',  '_route' => 'generar_financiacion_consultar_restriccion',);
                }

                // generar_financiacion_obtener_interes
                if ($pathinfo === '/cartera/generarfinanciacion/obtener/interes') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::consultarInteresLiquidacionesAction',  '_route' => 'generar_financiacion_obtener_interes',);
                }

                if (0 === strpos($pathinfo, '/cartera/generarfinanciacion/consultar_')) {
                    // generar_financiacion_filtrar_tiposdocumentos
                    if ($pathinfo === '/cartera/generarfinanciacion/consultar_tiposdocumentos') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::filtrarTiposDocumentosAction',  '_route' => 'generar_financiacion_filtrar_tiposdocumentos',);
                    }

                    // generar_financiacion_filtrar_documentos
                    if ($pathinfo === '/cartera/generarfinanciacion/consultar_documentos') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::filtrarDocumentosAction',  '_route' => 'generar_financiacion_filtrar_documentos',);
                    }

                    if (0 === strpos($pathinfo, '/cartera/generarfinanciacion/consultar_facturas')) {
                        // generar_financiacion_eddconsultar_facturas_suscripcion_documento
                        if ($pathinfo === '/cartera/generarfinanciacion/consultar_facturas') {
                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::consultarFacturasSuscripcionDocumentoAction',  '_route' => 'generar_financiacion_eddconsultar_facturas_suscripcion_documento',);
                        }

                        // generar_financiacion_eddconsultar_facturas_descarte_suscripcion_documento
                        if ($pathinfo === '/cartera/generarfinanciacion/consultar_facturasDescarte') {
                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::consultarFacturasDescarteSuscripcionDocumentoAction',  '_route' => 'generar_financiacion_eddconsultar_facturas_descarte_suscripcion_documento',);
                        }

                    }

                }

                if (0 === strpos($pathinfo, '/cartera/generarfinanciacion/g')) {
                    // generar_financiacion_guardar
                    if ($pathinfo === '/cartera/generarfinanciacion/guardar') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::insertarFinanciacionAction',  '_route' => 'generar_financiacion_guardar',);
                    }

                    // generar_financiacion_generar_pagare
                    if (rtrim($pathinfo, '/') === '/cartera/generarfinanciacion/generarnumeropagare') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'generar_financiacion_generar_pagare');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::generarNumeroPagareAction',  '_route' => 'generar_financiacion_generar_pagare',);
                    }

                }

            }

        }

        // generar_financiacion_generar_pagare_postventa
        if (rtrim($pathinfo, '/') === '/ventas/financiacion/generarfinanciacion/generarnumeropagare') {
            if (substr($pathinfo, -1) !== '/') {
                return $this->redirect($pathinfo.'/', 'generar_financiacion_generar_pagare_postventa');
            }

            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::generarNumeroPagareAction',  '_route' => 'generar_financiacion_generar_pagare_postventa',);
        }

        if (0 === strpos($pathinfo, '/cartera')) {
            if (0 === strpos($pathinfo, '/cartera/generarfinanciacion')) {
                // generar_financiacion_validar
                if ($pathinfo === '/cartera/generarfinanciacion/validar_conceptos') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::validarConceptosFinanciacionAction',  '_route' => 'generar_financiacion_validar',);
                }

                if (0 === strpos($pathinfo, '/cartera/generarfinanciacion/consultar_')) {
                    // generar_financiacion_consultar_liquidaciones
                    if ($pathinfo === '/cartera/generarfinanciacion/consultar_liquidaciones') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::consultarLiquidacionesDocumentoAction',  '_route' => 'generar_financiacion_consultar_liquidaciones',);
                    }

                    // generar_financiacion_consultar_bancos
                    if ($pathinfo === '/cartera/generarfinanciacion/consultar_bancos') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::consultarBancosAction',  '_route' => 'generar_financiacion_consultar_bancos',);
                    }

                }

                // generar_financiacion_subir_adjuntos
                if ($pathinfo === '/cartera/generarfinanciacion/subir_archivo') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::subirFinanciacionAdjuntaAction',  '_route' => 'generar_financiacion_subir_adjuntos',);
                }

                // generar_financiacion_eliminar_adjuntos
                if ($pathinfo === '/cartera/generarfinanciacion/eliminar_adjunto') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::eliminarFinanciacionAdjuntaAction',  '_route' => 'generar_financiacion_eliminar_adjuntos',);
                }

                // generar_financiacion_actualizar_adjuntos
                if (rtrim($pathinfo, '/') === '/cartera/generarfinanciacion/actualizar_adjuntos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'generar_financiacion_actualizar_adjuntos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::actualizarAdjuntoFinanciacionAction',  '_route' => 'generar_financiacion_actualizar_adjuntos',);
                }

            }

            if (0 === strpos($pathinfo, '/cartera/financiacion/obtener')) {
                // generar_financiacion_obtener_conceptos
                if ($pathinfo === '/cartera/financiacion/obtener/conceptos') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarDocumentoPagoController::obtenerConceptosFinanciacionAction',  '_route' => 'generar_financiacion_obtener_conceptos',);
                }

                // generar_financiacion_obtener_financiaciones
                if (rtrim($pathinfo, '/') === '/cartera/financiacion/obtener/suscripciones') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'generar_financiacion_obtener_financiaciones');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarDocumentoPagoController::consultarSuscripcionesAction',  '_route' => 'generar_financiacion_obtener_financiaciones',);
                }

            }

            // generar_financiacion_obtener_informacion_adjuntos
            if (rtrim($pathinfo, '/') === '/cartera/informacion_autorizacion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'generar_financiacion_obtener_informacion_adjuntos');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::cargarInformacionFormatoAction',  '_route' => 'generar_financiacion_obtener_informacion_adjuntos',);
            }

            // generar_documento_pago
            if ($pathinfo === '/cartera/generar_documento_pago') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarDocumentoPagoController::indexAction',  '_route' => 'generar_documento_pago',);
            }

            // generar_documento_pago_tabla_financiacion
            if ($pathinfo === '/cartera/tabla_financiacion') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarDocumentoPagoController::consultarTablaFinanciacionAction',  '_route' => 'generar_documento_pago_tabla_financiacion',);
            }

            // guardar_documento_pago
            if ($pathinfo === '/cartera/guardar_documento_pago') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarDocumentoPagoController::guardarDocumentoPagoAction',  '_route' => 'guardar_documento_pago',);
            }

            // generar_interes_pago
            if ($pathinfo === '/cartera/Gen_int_documento_pago') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarDocumentoPagoController::GenIntDocumentoPagoAction',  '_route' => 'generar_interes_pago',);
            }

        }

        if (0 === strpos($pathinfo, '/recaudos/aplicar')) {
            // recaudos_proceso_aplicar
            if (rtrim($pathinfo, '/') === '/recaudos/aplicar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'recaudos_proceso_aplicar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AplicarRecaudosController::indexAction',  '_route' => 'recaudos_proceso_aplicar',);
            }

            // recaudos_consultar_motivos_suspension
            if (rtrim($pathinfo, '/') === '/recaudos/aplicar/consultar_motivos_suspension') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'recaudos_consultar_motivos_suspension');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AplicarRecaudosController::consultarMotivosSuspensionAction',  '_route' => 'recaudos_consultar_motivos_suspension',);
            }

            // recaudos_aplicar_recaudos
            if (rtrim($pathinfo, '/') === '/recaudos/aplicar/ejecutar_proceso') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'recaudos_aplicar_recaudos');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AplicarRecaudosController::aplicarRecaudosAction',  '_route' => 'recaudos_aplicar_recaudos',);
            }

            // recaudos_aplicar_recaudos_progreso
            if (rtrim($pathinfo, '/') === '/recaudos/aplicar/progreso') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'recaudos_aplicar_recaudos_progreso');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AplicarRecaudosController::consultarProgresoAction',  '_route' => 'recaudos_aplicar_recaudos_progreso',);
            }

            // recaudos_aplicar_recaudos_resumen
            if (rtrim($pathinfo, '/') === '/recaudos/aplicar/resumen') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'recaudos_aplicar_recaudos_resumen');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AplicarRecaudosController::resumenAction',  '_route' => 'recaudos_aplicar_recaudos_resumen',);
            }

        }

        // cartera_gestionar_cartera
        if (rtrim($pathinfo, '/') === '/cartera/gestionar_cartera') {
            if (substr($pathinfo, -1) !== '/') {
                return $this->redirect($pathinfo.'/', 'cartera_gestionar_cartera');
            }

            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarCarteraController::indexAction',  '_route' => 'cartera_gestionar_cartera',);
        }

        if (0 === strpos($pathinfo, '/operaciones/generar_')) {
            if (0 === strpos($pathinfo, '/operaciones/generar_suspension')) {
                // proceso_suspension_reconexion
                if (rtrim($pathinfo, '/') === '/operaciones/generar_suspension') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'proceso_suspension_reconexion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoSuspensionesController::indexAction',  '_route' => 'proceso_suspension_reconexion',);
                }

                // proceso_suspension_tipo_uso
                if (rtrim($pathinfo, '/') === '/operaciones/generar_suspension/consultar_tipo_uso') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'proceso_suspension_tipo_uso');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoSuspensionesController::consultarTipoUsoSuscripcionAction',  '_route' => 'proceso_suspension_tipo_uso',);
                }

                // proceso_suspension_ejecutar
                if (rtrim($pathinfo, '/') === '/operaciones/generar_suspension/ejecutar_proceso') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'proceso_suspension_ejecutar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoSuspensionesController::procesarSuspensionesAction',  '_route' => 'proceso_suspension_ejecutar',);
                }

                // proceso_suspension_consultar_progreso
                if (rtrim($pathinfo, '/') === '/operaciones/generar_suspension/progreso') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'proceso_suspension_consultar_progreso');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoSuspensionesController::consultarProgresoAction',  '_route' => 'proceso_suspension_consultar_progreso',);
                }

                // proceso_suspension_consultar_resumen
                if (rtrim($pathinfo, '/') === '/operaciones/generar_suspension/resumen') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'proceso_suspension_consultar_resumen');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoSuspensionesController::consultarResumenExitosoAction',  '_route' => 'proceso_suspension_consultar_resumen',);
                }

            }

            if (0 === strpos($pathinfo, '/operaciones/generar_reconexion')) {
                // proceso_reconexion
                if (rtrim($pathinfo, '/') === '/operaciones/generar_reconexion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'proceso_reconexion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoReconexionController::indexAction',  '_route' => 'proceso_reconexion',);
                }

                // proceso_reconexion_ejecutar
                if (rtrim($pathinfo, '/') === '/operaciones/generar_reconexion/ejecutar_proceso') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'proceso_reconexion_ejecutar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoReconexionController::procesarSuspensionesAction',  '_route' => 'proceso_reconexion_ejecutar',);
                }

                // wsproceso_reconexion_ejecutar
                if (rtrim($pathinfo, '/') === '/operaciones/generar_reconexion/ws_ejecutar_proceso') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'wsproceso_reconexion_ejecutar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoReconexionController::wsProcesarSuspensionesAction',  '_route' => 'wsproceso_reconexion_ejecutar',);
                }

                // proceso_reconexion_consultar_progreso
                if (rtrim($pathinfo, '/') === '/operaciones/generar_reconexion/progreso') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'proceso_reconexion_consultar_progreso');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoReconexionController::consultarProgresoAction',  '_route' => 'proceso_reconexion_consultar_progreso',);
                }

                // proceso_reconexion_consultar_resumen
                if (rtrim($pathinfo, '/') === '/operaciones/generar_reconexion/resumen') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'proceso_reconexion_consultar_resumen');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoReconexionController::consultarResumenExitosoAction',  '_route' => 'proceso_reconexion_consultar_resumen',);
                }

            }

            if (0 === strpos($pathinfo, '/operaciones/generar_cierre')) {
                // proceso_cierre
                if (rtrim($pathinfo, '/') === '/operaciones/generar_cierre') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'proceso_cierre');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoCierreSuspensionesReconexionesController::indexAction',  '_route' => 'proceso_cierre',);
                }

                // proceso_cierre_ejecutar
                if (rtrim($pathinfo, '/') === '/operaciones/generar_cierre/ejecutar_proceso') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'proceso_cierre_ejecutar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoCierreSuspensionesReconexionesController::procesarSuspensionesAction',  '_route' => 'proceso_cierre_ejecutar',);
                }

                // proceso_cierre_consultar_progreso
                if (rtrim($pathinfo, '/') === '/operaciones/generar_cierre/progreso') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'proceso_cierre_consultar_progreso');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoCierreSuspensionesReconexionesController::consultarProgresoAction',  '_route' => 'proceso_cierre_consultar_progreso',);
                }

                // proceso_cierre_consultar_resumen
                if (rtrim($pathinfo, '/') === '/operaciones/generar_cierre/resumen') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'proceso_cierre_consultar_resumen');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoCierreSuspensionesReconexionesController::consultarResumenExitosoAction',  '_route' => 'proceso_cierre_consultar_resumen',);
                }

            }

        }

        if (0 === strpos($pathinfo, '/recaudos/cerrar_recaudo')) {
            // recaudos_proceso_cerrar
            if (rtrim($pathinfo, '/') === '/recaudos/cerrar_recaudo') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'recaudos_proceso_cerrar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoCerrarRecaudosController::indexAction',  '_route' => 'recaudos_proceso_cerrar',);
            }

            // recaudos_proceso_cerrar_recaudos
            if (rtrim($pathinfo, '/') === '/recaudos/cerrar_recaudo/cerrar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'recaudos_proceso_cerrar_recaudos');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoCerrarRecaudosController::cerrarRecaudosAction',  '_route' => 'recaudos_proceso_cerrar_recaudos',);
            }

            // recaudos_proceso_cerrar_recaudos_progreso
            if (rtrim($pathinfo, '/') === '/recaudos/cerrar_recaudo/progreso') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'recaudos_proceso_cerrar_recaudos_progreso');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoCerrarRecaudosController::consultarProgresoAction',  '_route' => 'recaudos_proceso_cerrar_recaudos_progreso',);
            }

            // recaudos_proceso_cerrar_recaudos_resumen
            if (rtrim($pathinfo, '/') === '/recaudos/cerrar_recaudo/resumen') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'recaudos_proceso_cerrar_recaudos_resumen');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AplicarRecaudosController::resumenAction',  '_route' => 'recaudos_proceso_cerrar_recaudos_resumen',);
            }

        }

        if (0 === strpos($pathinfo, '/cartera/generar_gestion_cartera')) {
            // generar_gestion_cartera
            if (rtrim($pathinfo, '/') === '/cartera/generar_gestion_cartera') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'generar_gestion_cartera');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarGestionCarteraController::indexAction',  '_route' => 'generar_gestion_cartera',);
            }

            if (0 === strpos($pathinfo, '/cartera/generar_gestion_cartera/consultar_')) {
                // generar_gestion_cartera_consultar_documentos
                if ($pathinfo === '/cartera/generar_gestion_cartera/consultar_documentos') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarGestionCarteraController::consultarDocumentosPorTipoDocumentosAction',  '_route' => 'generar_gestion_cartera_consultar_documentos',);
                }

                // generar_gestion_cartera_consultar_suscripciones
                if ($pathinfo === '/cartera/generar_gestion_cartera/consultar_suscripciones') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarGestionCarteraController::consultarSuscripcionesAction',  '_route' => 'generar_gestion_cartera_consultar_suscripciones',);
                }

            }

            // generar_gestion_cartera_grabar
            if ($pathinfo === '/cartera/generar_gestion_cartera/grabar_gestion') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarGestionCarteraController::generarGestionAction',  '_route' => 'generar_gestion_cartera_grabar',);
            }

            // generar_gestion_cartera_municipios
            if ($pathinfo === '/cartera/generar_gestion_cartera/consultar_municipios') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarGestionCarteraController::getMunicipiosAction',  '_route' => 'generar_gestion_cartera_municipios',);
            }

        }

        if (0 === strpos($pathinfo, '/recaudos/trasladar_recaudo')) {
            // recaudos_trasladar_recaudos
            if (rtrim($pathinfo, '/') === '/recaudos/trasladar_recaudo') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'recaudos_trasladar_recaudos');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\TrasladarRecaudoController::indexAction',  '_route' => 'recaudos_trasladar_recaudos',);
            }

            // recaudos_trasladar_recaudos_consultar
            if (rtrim($pathinfo, '/') === '/recaudos/trasladar_recaudo/consultar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'recaudos_trasladar_recaudos_consultar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\TrasladarRecaudoController::consultarRecaudoAction',  '_route' => 'recaudos_trasladar_recaudos_consultar',);
            }

        }

        if (0 === strpos($pathinfo, '/cartera/gestionar_cartera/f')) {
            // cartera_gestion_cartera_buscar
            if ($pathinfo === '/cartera/gestionar_cartera/filtrar') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarCarteraController::buscarSuscripcionesAction',  '_route' => 'cartera_gestion_cartera_buscar',);
            }

            // cartera_gestion_cartera_facturas
            if ($pathinfo === '/cartera/gestionar_cartera/facturas') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarCarteraController::consultarFacturasPorSuscripcionAction',  '_route' => 'cartera_gestion_cartera_facturas',);
            }

        }

        // recaudos_trasladar_recaudos_facturas
        if ($pathinfo === '/recaudos/trasladar_recaudo/facturas') {
            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\TrasladarRecaudoController::consultarFacturasRecaudoAction',  '_route' => 'recaudos_trasladar_recaudos_facturas',);
        }

        if (0 === strpos($pathinfo, '/cartera/gestionar_cartera')) {
            // cartera_gestionar_cartera_primero_ultimo
            if ($pathinfo === '/cartera/gestionar_cartera/primero_ultimo') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarCarteraController::consultarPrimeroUltimoAction',  '_route' => 'cartera_gestionar_cartera_primero_ultimo',);
            }

            // cartera_gestionar_cartera_siguente_anterior
            if ($pathinfo === '/cartera/gestionar_cartera/siguiente_anterior') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarCarteraController::consultarSiguienteAnteriorAction',  '_route' => 'cartera_gestionar_cartera_siguente_anterior',);
            }

            // cartera_gestionar_cartera_adjuntar_archivo
            if ($pathinfo === '/cartera/gestionar_cartera/adjuntar_archivo') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarCarteraController::subirAdjuntoDetalleAction',  '_route' => 'cartera_gestionar_cartera_adjuntar_archivo',);
            }

        }

        // recaudos_trasladar_recaudos_grabar
        if ($pathinfo === '/recaudos/trasladar_recaudo/grabar') {
            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\TrasladarRecaudoController::trasladarRecaudoAction',  '_route' => 'recaudos_trasladar_recaudos_grabar',);
        }

        if (0 === strpos($pathinfo, '/cartera')) {
            if (0 === strpos($pathinfo, '/cartera/gestionar_cartera')) {
                // cartera_gestionar_cartera_grabar
                if ($pathinfo === '/cartera/gestionar_cartera/grabar') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarCarteraController::grabarGestionarCarteraAction',  '_route' => 'cartera_gestionar_cartera_grabar',);
                }

                if (0 === strpos($pathinfo, '/cartera/gestionar_cartera/historico')) {
                    // cartera_gestionar_cartera_historico
                    if ($pathinfo === '/cartera/gestionar_cartera/historico') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarCarteraController::consultarHistoricoAction',  '_route' => 'cartera_gestionar_cartera_historico',);
                    }

                    // cartera_gestionar_cartera_historico_detalle
                    if ($pathinfo === '/cartera/gestionar_cartera/historico_detalle') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarCarteraController::getDetalleHistoricoSeguimientoAction',  '_route' => 'cartera_gestionar_cartera_historico_detalle',);
                    }

                }

            }

            if (0 === strpos($pathinfo, '/cartera/facturar_financiacion')) {
                // cartera_facturar_finaciacion
                if (rtrim($pathinfo, '/') === '/cartera/facturar_financiacion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_facturar_finaciacion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FacturarFinanciacionController::indexAction',  '_route' => 'cartera_facturar_finaciacion',);
                }

                // cartera_facturar_finaciacion_generar
                if (rtrim($pathinfo, '/') === '/cartera/facturar_financiacion/generar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_facturar_finaciacion_generar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FacturarFinanciacionController::facturarFinanciacionAction',  '_route' => 'cartera_facturar_finaciacion_generar',);
                }

                // cartera_facturar_finaciacion_progreso
                if (rtrim($pathinfo, '/') === '/cartera/facturar_financiacion/progreso') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_facturar_finaciacion_progreso');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FacturarFinanciacionController::getProgresoProcesoAction',  '_route' => 'cartera_facturar_finaciacion_progreso',);
                }

                // cartera_facturar_finaciacion_resultado
                if (rtrim($pathinfo, '/') === '/cartera/facturar_financiacion/resultado') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_facturar_finaciacion_resultado');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FacturarFinanciacionController::getResultadoAction',  '_route' => 'cartera_facturar_finaciacion_resultado',);
                }

                // cartera_facturar_finaciacion_aprobar
                if (rtrim($pathinfo, '/') === '/cartera/facturar_financiacion/aprobar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_facturar_finaciacion_aprobar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FacturarFinanciacionController::aprobarFacturacionAction',  '_route' => 'cartera_facturar_finaciacion_aprobar',);
                }

            }

            if (0 === strpos($pathinfo, '/cartera/reunificar_financiacion')) {
                // cartera_reunificar_financiacion
                if (rtrim($pathinfo, '/') === '/cartera/reunificar_financiacion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_reunificar_financiacion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ReunificarFinanciacionController::indexAction',  '_route' => 'cartera_reunificar_financiacion',);
                }

                // cartera_reunificar_financiacion_documentos
                if (rtrim($pathinfo, '/') === '/cartera/reunificar_financiacion/documentos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_reunificar_financiacion_documentos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ReunificarFinanciacionController::ConsultarDocumentosAction',  '_route' => 'cartera_reunificar_financiacion_documentos',);
                }

                // cartera_reunificar_financiacion_tipo_documentos
                if (rtrim($pathinfo, '/') === '/cartera/reunificar_financiacion/tipodocumentos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_reunificar_financiacion_tipo_documentos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ReunificarFinanciacionController::ConsultarTipoDocumentosAction',  '_route' => 'cartera_reunificar_financiacion_tipo_documentos',);
                }

            }

            if (0 === strpos($pathinfo, '/cartera/consultar_financiacion')) {
                // cartera_consultar_financiacion
                if (rtrim($pathinfo, '/') === '/cartera/consultar_financiacion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_consultar_financiacion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsultarFinanciacionController::indexAction',  '_route' => 'cartera_consultar_financiacion',);
                }

                if (0 === strpos($pathinfo, '/cartera/consultar_financiacion/f')) {
                    // cartera_consultar_financiacion_filtrar
                    if (rtrim($pathinfo, '/') === '/cartera/consultar_financiacion/filtrar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'cartera_consultar_financiacion_filtrar');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsultarFinanciacionController::filtrarFinanciacionesAction',  '_route' => 'cartera_consultar_financiacion_filtrar',);
                    }

                    if (0 === strpos($pathinfo, '/cartera/consultar_financiacion/facturas')) {
                        // cartera_consultar_financiacion_facturas
                        if (rtrim($pathinfo, '/') === '/cartera/consultar_financiacion/facturas') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'cartera_consultar_financiacion_facturas');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsultarFinanciacionController::consultarFacturasAction',  '_route' => 'cartera_consultar_financiacion_facturas',);
                        }

                        // cartera_consultar_financiacion_facturas_detalles
                        if (rtrim($pathinfo, '/') === '/cartera/consultar_financiacion/facturas/detalle_factura') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'cartera_consultar_financiacion_facturas_detalles');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsultarFinanciacionController::consultarDetalleFacturasAction',  '_route' => 'cartera_consultar_financiacion_facturas_detalles',);
                        }

                    }

                }

                if (0 === strpos($pathinfo, '/cartera/consultar_financiacion/amortizacion')) {
                    // cartera_consultar_financiacion_amortizacion
                    if (rtrim($pathinfo, '/') === '/cartera/consultar_financiacion/amortizacion') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'cartera_consultar_financiacion_amortizacion');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsultarFinanciacionController::consultarAmortizacionesAction',  '_route' => 'cartera_consultar_financiacion_amortizacion',);
                    }

                    // cartera_consultar_financiacion_amortizacion_detalle
                    if (rtrim($pathinfo, '/') === '/cartera/consultar_financiacion/amortizacion/detalle') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'cartera_consultar_financiacion_amortizacion_detalle');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsultarFinanciacionController::consultarDetalleAmortizacionesAction',  '_route' => 'cartera_consultar_financiacion_amortizacion_detalle',);
                    }

                    // cartera_consultar_financiacion_amortizacion_adjuntos
                    if ($pathinfo === '/cartera/consultar_financiacion/amortizacion/adjuntos') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsultarFinanciacionController::consultarAdjuntosPorFinanciacionAction',  '_route' => 'cartera_consultar_financiacion_amortizacion_adjuntos',);
                    }

                    // cartera_consultar_financiacion_amortizacion_facturas
                    if (rtrim($pathinfo, '/') === '/cartera/consultar_financiacion/amortizacion/facturas') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'cartera_consultar_financiacion_amortizacion_facturas');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsultarFinanciacionController::consultarFacturasPorAmortizacionAction',  '_route' => 'cartera_consultar_financiacion_amortizacion_facturas',);
                    }

                }

                // cartera_consultar_financiacion_permisos_adjuntos
                if (rtrim($pathinfo, '/') === '/cartera/consultar_financiacion/consultapermisosadjuntar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_consultar_financiacion_permisos_adjuntos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsultarFinanciacionController::consultaPermisosAdjuntosAction',  '_route' => 'cartera_consultar_financiacion_permisos_adjuntos',);
                }

                // cartera_consultar_financiacion_consultar_liquidaciones
                if ($pathinfo === '/cartera/consultar_financiacion/generarfinanciacion/consultar_liquidaciones') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::consultarLiquidacionesDocumentoAction',  '_route' => 'cartera_consultar_financiacion_consultar_liquidaciones',);
                }

                // cartera_consultar_financiacion_consultar_dias
                if (rtrim($pathinfo, '/') === '/cartera/consultar_financiacion/consultas_dias') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_consultar_financiacion_consultar_dias');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::consultarDiasPeriodoAction',  '_route' => 'cartera_consultar_financiacion_consultar_dias',);
                }

            }

            if (0 === strpos($pathinfo, '/cartera/reunificar_financiacion')) {
                if (0 === strpos($pathinfo, '/cartera/reunificar_financiacion/suscripciones')) {
                    // cartera_reunificar_financiacion_suscripciones
                    if (rtrim($pathinfo, '/') === '/cartera/reunificar_financiacion/suscripciones') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'cartera_reunificar_financiacion_suscripciones');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ReunificarFinanciacionController::filtrarSuscripcionesFinanciacionAction',  '_route' => 'cartera_reunificar_financiacion_suscripciones',);
                    }

                    // cartera_reunificar_financiacion_suscripciones_informacion
                    if (rtrim($pathinfo, '/') === '/cartera/reunificar_financiacion/suscripciones/informacion') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'cartera_reunificar_financiacion_suscripciones_informacion');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ReunificarFinanciacionController::consultarInformacionPorSuscripcionAction',  '_route' => 'cartera_reunificar_financiacion_suscripciones_informacion',);
                    }

                }

                // cartera_reunificar_financiacion_grabar
                if (rtrim($pathinfo, '/') === '/cartera/reunificar_financiacion/grabar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_reunificar_financiacion_grabar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ReunificarFinanciacionController::grabarReunificacionAction',  '_route' => 'cartera_reunificar_financiacion_grabar',);
                }

            }

            if (0 === strpos($pathinfo, '/cartera/facturar_intereses_mora')) {
                // cartera_facturar_interes_mora
                if (rtrim($pathinfo, '/') === '/cartera/facturar_intereses_mora') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_facturar_interes_mora');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\InteresMoraController::indexAction',  '_route' => 'cartera_facturar_interes_mora',);
                }

                // cartera_facturar_interes_mora_municipios
                if (rtrim($pathinfo, '/') === '/cartera/facturar_intereses_mora/municipios') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_facturar_interes_mora_municipios');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\InteresMoraController::getMunicipiosAction',  '_route' => 'cartera_facturar_interes_mora_municipios',);
                }

                // cartera_facturar_interes_mora_suscripcion
                if (rtrim($pathinfo, '/') === '/cartera/facturar_intereses_mora/suscripcion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_facturar_interes_mora_suscripcion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\InteresMoraController::getSuscripcionAction',  '_route' => 'cartera_facturar_interes_mora_suscripcion',);
                }

                // cartera_facturar_interes_mora_documentos
                if (rtrim($pathinfo, '/') === '/cartera/facturar_intereses_mora/documentos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_facturar_interes_mora_documentos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\InteresMoraController::getDocumentosInteresMoraAction',  '_route' => 'cartera_facturar_interes_mora_documentos',);
                }

                // cartera_facturar_interes_mora_generar
                if (rtrim($pathinfo, '/') === '/cartera/facturar_intereses_mora/generar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_facturar_interes_mora_generar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\InteresMoraController::generarInteresMoraAction',  '_route' => 'cartera_facturar_interes_mora_generar',);
                }

                // cartera_facturar_interes_mora_progreso
                if (rtrim($pathinfo, '/') === '/cartera/facturar_intereses_mora/progreso') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_facturar_interes_mora_progreso');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\InteresMoraController::consultarProgresoAction',  '_route' => 'cartera_facturar_interes_mora_progreso',);
                }

                // cartera_facturar_interes_mora_aprobar
                if (rtrim($pathinfo, '/') === '/cartera/facturar_intereses_mora/aprobar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_facturar_interes_mora_aprobar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\InteresMoraController::setAprobacionInteresMoraAction',  '_route' => 'cartera_facturar_interes_mora_aprobar',);
                }

                // cartera_facturar_interes_mora_resumen
                if (rtrim($pathinfo, '/') === '/cartera/facturar_intereses_mora/resumen') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_facturar_interes_mora_resumen');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\InteresMoraController::consultarResumenExitosoAction',  '_route' => 'cartera_facturar_interes_mora_resumen',);
                }

            }

            if (0 === strpos($pathinfo, '/cartera/estado_cuenta')) {
                // cartera_estado_cuenta
                if (rtrim($pathinfo, '/') === '/cartera/estado_cuenta') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cartera_estado_cuenta');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\EstadoCuentaController::indexAction',  '_route' => 'cartera_estado_cuenta',);
                }

                if (0 === strpos($pathinfo, '/cartera/estado_cuenta/consultar')) {
                    // cartera_estado_cuenta_suscripciones
                    if (rtrim($pathinfo, '/') === '/cartera/estado_cuenta/consultar/suscripciones') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'cartera_estado_cuenta_suscripciones');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\EstadoCuentaController::consultarSuscripcionesAction',  '_route' => 'cartera_estado_cuenta_suscripciones',);
                    }

                    // cartera_estado_cuenta_informacion
                    if (rtrim($pathinfo, '/') === '/cartera/estado_cuenta/consultar/informacion') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'cartera_estado_cuenta_informacion');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\EstadoCuentaController::consultarEstadoCuentaAction',  '_route' => 'cartera_estado_cuenta_informacion',);
                    }

                }

            }

            // generar_financiacion_consultar_detalles_facturas
            if ($pathinfo === '/cartera/generarfinanciacion/consultar_facturas_detalles') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::consultarDetallesFacturaAction',  '_route' => 'generar_financiacion_consultar_detalles_facturas',);
            }

            // cartera_consultar_iva_interes
            if (rtrim($pathinfo, '/') === '/cartera/consultar_interes_liquidacion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'cartera_consultar_iva_interes');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GenerarFinanciacionController::consultarInteresIvaLiquidacionAction',  '_route' => 'cartera_consultar_iva_interes',);
            }

            // provisiones
            if (rtrim($pathinfo, '/') === '/cartera/provisionar_castigar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'provisiones');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProvisionesController::indexAction',  '_route' => 'provisiones',);
            }

        }

        if (0 === strpos($pathinfo, '/lectura')) {
            // registrar_lecturas
            if (rtrim($pathinfo, '/') === '/lectura/registrar_lectura') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'registrar_lecturas');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarLecturaController::indexAction',  '_route' => 'registrar_lecturas',);
            }

            // registrar_lecturas_consultar_terceros
            if (rtrim($pathinfo, '/') === '/lectura/consultar_terceros') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'registrar_lecturas_consultar_terceros');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarLecturaController::consultarTercerosAction',  '_route' => 'registrar_lecturas_consultar_terceros',);
            }

            if (0 === strpos($pathinfo, '/lectura/registrar_lectura')) {
                // registrar_lecturas_filtrar
                if (rtrim($pathinfo, '/') === '/lectura/registrar_lectura/filtrar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registrar_lecturas_filtrar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarLecturaController::filtrarLecturasAction',  '_route' => 'registrar_lecturas_filtrar',);
                }

                // registrar_lecturas_detalle_medidor
                if (rtrim($pathinfo, '/') === '/lectura/registrar_lectura/detallemedidor') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registrar_lecturas_detalle_medidor');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarLecturaController::detallePropiedadAction',  '_route' => 'registrar_lecturas_detalle_medidor',);
                }

                // registrar_lecturas_encabezado_historico
                if (rtrim($pathinfo, '/') === '/lectura/registrar_lectura/encabezadohistorico') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registrar_lecturas_encabezado_historico');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarLecturaController::detalleHistoricoAction',  '_route' => 'registrar_lecturas_encabezado_historico',);
                }

                if (0 === strpos($pathinfo, '/lectura/registrar_lectura/obtener')) {
                    // registrar_lecturas_obtener_novedad
                    if (rtrim($pathinfo, '/') === '/lectura/registrar_lectura/obtenernovedad') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'registrar_lecturas_obtener_novedad');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarLecturaController::obtenerNovedadAction',  '_route' => 'registrar_lecturas_obtener_novedad',);
                    }

                    // registrar_lecturas_obtener_anomalia
                    if (rtrim($pathinfo, '/') === '/lectura/registrar_lectura/obteneranomalia') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'registrar_lecturas_obtener_anomalia');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarLecturaController::obtenerAnomaliaAction',  '_route' => 'registrar_lecturas_obtener_anomalia',);
                    }

                    // registrar_lecturas_obtener_encabezado_lectura
                    if (rtrim($pathinfo, '/') === '/lectura/registrar_lectura/obtenerencabezadolectura') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'registrar_lecturas_obtener_encabezado_lectura');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarLecturaController::obtenerEncabezadoLecturaAction',  '_route' => 'registrar_lecturas_obtener_encabezado_lectura',);
                    }

                }

                // registrar_lecturas_insertar_lectura
                if (rtrim($pathinfo, '/') === '/lectura/registrar_lectura/insertarlectura') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registrar_lecturas_insertar_lectura');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarLecturaController::insertarLecturaAction',  '_route' => 'registrar_lecturas_insertar_lectura',);
                }

            }

            if (0 === strpos($pathinfo, '/lectura/c')) {
                if (0 === strpos($pathinfo, '/lectura/cargarlecturas')) {
                    // lectura_cargar_lecturas
                    if (rtrim($pathinfo, '/') === '/lectura/cargarlecturas') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'lectura_cargar_lecturas');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CargarLecturasController::indexAction',  '_route' => 'lectura_cargar_lecturas',);
                    }

                    // lectura_cargar_lecturas_subir
                    if (rtrim($pathinfo, '/') === '/lectura/cargarlecturas/subir') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'lectura_cargar_lecturas_subir');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CargarLecturasController::cargarLecturasAction',  '_route' => 'lectura_cargar_lecturas_subir',);
                    }

                    // lectura_cargar_lecturas_resumen
                    if (rtrim($pathinfo, '/') === '/lectura/cargarlecturas/resumen') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'lectura_cargar_lecturas_resumen');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CargarLecturasController::cargarProcesoAction',  '_route' => 'lectura_cargar_lecturas_resumen',);
                    }

                }

                if (0 === strpos($pathinfo, '/lectura/cerrarlectura')) {
                    // lectura_cerrar_lecturas
                    if (rtrim($pathinfo, '/') === '/lectura/cerrarlectura') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'lectura_cerrar_lecturas');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CerrarLecturaController::indexAction',  '_route' => 'lectura_cerrar_lecturas',);
                    }

                    // lectura_cerrar_lecturas_ciclos_activos_procesar
                    if (rtrim($pathinfo, '/') === '/lectura/cerrarlectura/procesar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'lectura_cerrar_lecturas_ciclos_activos_procesar');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CerrarLecturaController::procesarCiclosAction',  '_route' => 'lectura_cerrar_lecturas_ciclos_activos_procesar',);
                    }

                    // lectura_cerrar_lecturas_ciclos_activos_validar
                    if (rtrim($pathinfo, '/') === '/lectura/cerrarlectura/validar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'lectura_cerrar_lecturas_ciclos_activos_validar');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CerrarLecturaController::evaluarCiclosAction',  '_route' => 'lectura_cerrar_lecturas_ciclos_activos_validar',);
                    }

                    if (0 === strpos($pathinfo, '/lectura/cerrarlectura/obtener')) {
                        // lectura_cerrar_lecturas_resumen
                        if (rtrim($pathinfo, '/') === '/lectura/cerrarlectura/obtener/resumen') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'lectura_cerrar_lecturas_resumen');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CerrarLecturaController::obtenerResumenAction',  '_route' => 'lectura_cerrar_lecturas_resumen',);
                        }

                        // lectura_cerrar_lecturas_resumen_estado_programa
                        if (rtrim($pathinfo, '/') === '/lectura/cerrarlectura/obtener/estado') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'lectura_cerrar_lecturas_resumen_estado_programa');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CerrarLecturaController::obtenerEstadoProgramaAction',  '_route' => 'lectura_cerrar_lecturas_resumen_estado_programa',);
                        }

                    }

                }

            }

        }

        if (0 === strpos($pathinfo, '/suscripcion/gestionar_suscripcion')) {
            // suscripcion
            if (rtrim($pathinfo, '/') === '/suscripcion/gestionar_suscripcion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'suscripcion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::indexAction',  '_route' => 'suscripcion',);
            }

            // suscripcion_filtrar_suscriptor
            if (rtrim($pathinfo, '/') === '/suscripcion/gestionar_suscripcion/filtrar_suscriptor') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'suscripcion_filtrar_suscriptor');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::filtrarSuscriptorAction',  '_route' => 'suscripcion_filtrar_suscriptor',);
            }

            // suscripcion_buscar_propiedad
            if (rtrim($pathinfo, '/') === '/suscripcion/gestionar_suscripcion/buscar_propiedad') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'suscripcion_buscar_propiedad');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::buscarPropiedadAction',  '_route' => 'suscripcion_buscar_propiedad',);
            }

            if (0 === strpos($pathinfo, '/suscripcion/gestionar_suscripcion/t')) {
                if (0 === strpos($pathinfo, '/suscripcion/gestionar_suscripcion/tipos_')) {
                    // suscripcion_tipos_suscripcion
                    if (rtrim($pathinfo, '/') === '/suscripcion/gestionar_suscripcion/tipos_suscripcion') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'suscripcion_tipos_suscripcion');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::getTiposSuscripcionAction',  '_route' => 'suscripcion_tipos_suscripcion',);
                    }

                    if (0 === strpos($pathinfo, '/suscripcion/gestionar_suscripcion/tipos_uso_')) {
                        // suscripcion_tipos_uso_suscripcion
                        if (rtrim($pathinfo, '/') === '/suscripcion/gestionar_suscripcion/tipos_uso_suscripcion') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'suscripcion_tipos_uso_suscripcion');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::getTiposUsoSuscripcionAction',  '_route' => 'suscripcion_tipos_uso_suscripcion',);
                        }

                        // suscripcion_tipos_uso_ciclo
                        if (rtrim($pathinfo, '/') === '/suscripcion/gestionar_suscripcion/tipos_uso_ciclo') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'suscripcion_tipos_uso_ciclo');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::getTiposUsoCicloAction',  '_route' => 'suscripcion_tipos_uso_ciclo',);
                        }

                    }

                }

                // suscripcion_terceros
                if (rtrim($pathinfo, '/') === '/suscripcion/gestionar_suscripcion/terceros') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'suscripcion_terceros');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::getTercerosAction',  '_route' => 'suscripcion_terceros',);
                }

            }

            // suscripcion_liquidaciones
            if (rtrim($pathinfo, '/') === '/suscripcion/gestionar_suscripcion/liquidaciones') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'suscripcion_liquidaciones');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::getLiquidacionesAction',  '_route' => 'suscripcion_liquidaciones',);
            }

            if (0 === strpos($pathinfo, '/suscripcion/gestionar_suscripcion/c')) {
                // suscripcion_ciclo_ruta
                if (rtrim($pathinfo, '/') === '/suscripcion/gestionar_suscripcion/cicloruta') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'suscripcion_ciclo_ruta');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::getRutaCicloAction',  '_route' => 'suscripcion_ciclo_ruta',);
                }

                if (0 === strpos($pathinfo, '/suscripcion/gestionar_suscripcion/conceptos')) {
                    // suscripcion_conceptos_liquidacion
                    if (rtrim($pathinfo, '/') === '/suscripcion/gestionar_suscripcion/conceptos') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'suscripcion_conceptos_liquidacion');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::getConceptosAction',  '_route' => 'suscripcion_conceptos_liquidacion',);
                    }

                    // suscripcion_conceptos_info
                    if (rtrim($pathinfo, '/') === '/suscripcion/gestionar_suscripcion/conceptos/info') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'suscripcion_conceptos_info');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::getInfoConceptosAction',  '_route' => 'suscripcion_conceptos_info',);
                    }

                }

            }

            // suscripcion_grabar
            if (rtrim($pathinfo, '/') === '/suscripcion/gestionar_suscripcion/grabar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'suscripcion_grabar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::grabarSuscripcionAction',  '_route' => 'suscripcion_grabar',);
            }

            if (0 === strpos($pathinfo, '/suscripcion/gestionar_suscripcion/b')) {
                // suscripcion_conceptos_barrios
                if (rtrim($pathinfo, '/') === '/suscripcion/gestionar_suscripcion/barrios') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'suscripcion_conceptos_barrios');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::getBarriosAction',  '_route' => 'suscripcion_conceptos_barrios',);
                }

                // suscripcion_buscar
                if (rtrim($pathinfo, '/') === '/suscripcion/gestionar_suscripcion/buscar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'suscripcion_buscar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::buscarSuscripcionAction',  '_route' => 'suscripcion_buscar',);
                }

            }

            // suscripcion_buscar_detalle
            if (rtrim($pathinfo, '/') === '/suscripcion/gestionar_suscripcion/detalle') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'suscripcion_buscar_detalle');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::detalleSuscripcionAction',  '_route' => 'suscripcion_buscar_detalle',);
            }

            // suscripcion_concepto_eliminar_registro
            if (rtrim($pathinfo, '/') === '/suscripcion/gestionar_suscripcion/concepto/eliminar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'suscripcion_concepto_eliminar_registro');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::validarEliminacionConceptoAction',  '_route' => 'suscripcion_concepto_eliminar_registro',);
            }

            // suscripcion_consultar_actividad_economica
            if (rtrim($pathinfo, '/') === '/suscripcion/gestionar_suscripcion/actividadeconomica') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'suscripcion_consultar_actividad_economica');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::getActividadEconomicaAction',  '_route' => 'suscripcion_consultar_actividad_economica',);
            }

        }

        if (0 === strpos($pathinfo, '/facturacion/cargar_estrato_catastral')) {
            // cargar_estrato_catastral
            if (rtrim($pathinfo, '/') === '/facturacion/cargar_estrato_catastral') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'cargar_estrato_catastral');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CargarEstratoCatastralController::indexAction',  '_route' => 'cargar_estrato_catastral',);
            }

            if (0 === strpos($pathinfo, '/facturacion/cargar_estrato_catastral/subir')) {
                // cargar_estrato_catastral_subir
                if (rtrim($pathinfo, '/') === '/facturacion/cargar_estrato_catastral/subir') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'cargar_estrato_catastral_subir');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CargarEstratoCatastralController::cargarEstratoCatastralAction',  '_route' => 'cargar_estrato_catastral_subir',);
                }

                if (0 === strpos($pathinfo, '/facturacion/cargar_estrato_catastral/subir/consultar_')) {
                    // cargar_estrato_catastral_resultado
                    if (rtrim($pathinfo, '/') === '/facturacion/cargar_estrato_catastral/subir/consultar_temp_estratocatastral') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'cargar_estrato_catastral_resultado');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CargarEstratoCatastralController::consultartempestratocatastralAction',  '_route' => 'cargar_estrato_catastral_resultado',);
                    }

                    // consultar_resumen_temp_estratocatastral
                    if (rtrim($pathinfo, '/') === '/facturacion/cargar_estrato_catastral/subir/consultar_resumen_temp_estratocatastral') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'consultar_resumen_temp_estratocatastral');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CargarEstratoCatastralController::consultarresumentempestratocatastralAction',  '_route' => 'consultar_resumen_temp_estratocatastral',);
                    }

                }

            }

            // descargaArchivoReporte
            if (0 === strpos($pathinfo, '/facturacion/cargar_estrato_catastral/admin/download') && preg_match('#^/facturacion/cargar_estrato_catastral/admin/download/(?P<id>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'descargaArchivoReporte')), array (  '_controller' => 'Reportes\\ReportesBundle\\Controller\\AdminController::downloadReportAction',));
            }

        }

        if (0 === strpos($pathinfo, '/recaudos/consignaciones')) {
            // consignaciones
            if (rtrim($pathinfo, '/') === '/recaudos/consignaciones') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'consignaciones');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsignacionesController::indexAction',  '_route' => 'consignaciones',);
            }

            if (0 === strpos($pathinfo, '/recaudos/consignaciones/consolidado')) {
                // consignaciones_consolidado
                if (rtrim($pathinfo, '/') === '/recaudos/consignaciones/consolidado') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'consignaciones_consolidado');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsignacionesController::getRecaudosConsignacionesAction',  '_route' => 'consignaciones_consolidado',);
                }

                // consignaciones_consolidado_empresa
                if (rtrim($pathinfo, '/') === '/recaudos/consignaciones/consolidadoempresa') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'consignaciones_consolidado_empresa');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsignacionesController::getRecaudosConsolidadoEmpresaAction',  '_route' => 'consignaciones_consolidado_empresa',);
                }

            }

            if (0 === strpos($pathinfo, '/recaudos/consignaciones/recaudos')) {
                // consignaciones_recaudos_detalles
                if (rtrim($pathinfo, '/') === '/recaudos/consignaciones/recaudosdetalles') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'consignaciones_recaudos_detalles');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsignacionesController::getRecaudosConsignacionesDetallesAction',  '_route' => 'consignaciones_recaudos_detalles',);
                }

                // consignaciones_recaudos_cheques
                if (rtrim($pathinfo, '/') === '/recaudos/consignaciones/recaudoscheques') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'consignaciones_recaudos_cheques');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsignacionesController::getChequesRecaudosSinConsignarAction',  '_route' => 'consignaciones_recaudos_cheques',);
                }

            }

            // consignaciones_recaudos_bancos
            if (rtrim($pathinfo, '/') === '/recaudos/consignaciones/bancos') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'consignaciones_recaudos_bancos');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsignacionesController::getBancosAction',  '_route' => 'consignaciones_recaudos_bancos',);
            }

            // consignaciones_recaudos_tipo_cuentas
            if (rtrim($pathinfo, '/') === '/recaudos/consignaciones/tipocuentas') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'consignaciones_recaudos_tipo_cuentas');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsignacionesController::getTipoCuentasAction',  '_route' => 'consignaciones_recaudos_tipo_cuentas',);
            }

            // consignaciones_recaudos_cuentas
            if (rtrim($pathinfo, '/') === '/recaudos/consignaciones/cuentas') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'consignaciones_recaudos_cuentas');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsignacionesController::getCuentasAction',  '_route' => 'consignaciones_recaudos_cuentas',);
            }

            // consignaciones_recaudos_grabar
            if (rtrim($pathinfo, '/') === '/recaudos/consignaciones/grabar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'consignaciones_recaudos_grabar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsignacionesController::grabarConsignacionAction',  '_route' => 'consignaciones_recaudos_grabar',);
            }

            // consignaciones_recaudos_subir_archvo
            if (rtrim($pathinfo, '/') === '/recaudos/consignaciones/subirarchivo') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'consignaciones_recaudos_subir_archvo');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsignacionesController::subirAdjuntoAction',  '_route' => 'consignaciones_recaudos_subir_archvo',);
            }

            // consignaciones_recaudos_eliminar_archvo
            if (rtrim($pathinfo, '/') === '/recaudos/consignaciones/eliminararchivo') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'consignaciones_recaudos_eliminar_archvo');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsignacionesController::eliminarAdjuntoAction',  '_route' => 'consignaciones_recaudos_eliminar_archvo',);
            }

            // consignaciones_recaudos_buscar
            if (rtrim($pathinfo, '/') === '/recaudos/consignaciones/buscar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'consignaciones_recaudos_buscar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsignacionesController::buscarConsignacionAction',  '_route' => 'consignaciones_recaudos_buscar',);
            }

            // consignaciones_recaudos_consultar_informacion
            if (rtrim($pathinfo, '/') === '/recaudos/consignaciones/informacionconsolidado') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'consignaciones_recaudos_consultar_informacion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsignacionesController::consultarInformacionAction',  '_route' => 'consignaciones_recaudos_consultar_informacion',);
            }

            // consignaciones_recaudos_consultar_empresa
            if (rtrim($pathinfo, '/') === '/recaudos/consignaciones/consultar_empresa') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'consignaciones_recaudos_consultar_empresa');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsignacionesController::consultarEmpresaAction',  '_route' => 'consignaciones_recaudos_consultar_empresa',);
            }

        }

        if (0 === strpos($pathinfo, '/ventas')) {
            if (0 === strpos($pathinfo, '/ventas/registrar_ventas')) {
                // registro_ventas
                if (rtrim($pathinfo, '/') === '/ventas/registrar_ventas') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::indexAction',  '_route' => 'registro_ventas',);
                }

                // registro_ventas_guardar_informacion_autorizacion
                if (rtrim($pathinfo, '/') === '/ventas/registrar_ventas/informacion_autorizacion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas_guardar_informacion_autorizacion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::cargarInformacionFormatoAction',  '_route' => 'registro_ventas_guardar_informacion_autorizacion',);
                }

                // registro_ventas_exportar_autorizacion_exportar
                if (rtrim($pathinfo, '/') === '/ventas/registrar_ventas/exportar_autorizacion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas_exportar_autorizacion_exportar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::exportarAutorizacionAction',  '_route' => 'registro_ventas_exportar_autorizacion_exportar',);
                }

                // registro_ventas_exportar_autorizacion
                if (rtrim($pathinfo, '/') === '/ventas/registrar_ventas/validar_resolucion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas_exportar_autorizacion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::validarResolucionFacturacionAction',  '_route' => 'registro_ventas_exportar_autorizacion',);
                }

            }

            if (0 === strpos($pathinfo, '/ventas/firmasinstaldoras')) {
                // registro_ventas_firmas_instaladoras
                if ($pathinfo === '/ventas/firmasinstaldoras') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::getFirmasInstaladorasAction',  '_route' => 'registro_ventas_firmas_instaladoras',);
                }

                // registro_ventas_firmas_instaladoras_funcionarios
                if (rtrim($pathinfo, '/') === '/ventas/firmasinstaldoras/funcionarios') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas_firmas_instaladoras_funcionarios');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::getFuncionariosFirmaAction',  '_route' => 'registro_ventas_firmas_instaladoras_funcionarios',);
                }

            }

            if (0 === strpos($pathinfo, '/ventas/registrar_ventas')) {
                // registro_ventas_asesores
                if (rtrim($pathinfo, '/') === '/ventas/registrar_ventas/asesores') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas_asesores');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::getAsesoresAction',  '_route' => 'registro_ventas_asesores',);
                }

                // registro_ventas_organismos
                if (rtrim($pathinfo, '/') === '/ventas/registrar_ventas/organismos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas_organismos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::getOrganismosAction',  '_route' => 'registro_ventas_organismos',);
                }

                // registro_ventas_documentos
                if (rtrim($pathinfo, '/') === '/ventas/registrar_ventas/documentos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas_documentos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::getDocumentosAction',  '_route' => 'registro_ventas_documentos',);
                }

                // registro_ventas__tipos_documentos
                if (rtrim($pathinfo, '/') === '/ventas/registrar_ventas/tiposdocumentos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas__tipos_documentos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::getTiposDocumentosAction',  '_route' => 'registro_ventas__tipos_documentos',);
                }

                // registro_ventas_liquidaciones
                if (rtrim($pathinfo, '/') === '/ventas/registrar_ventas/liquidaciones') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas_liquidaciones');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::getLiquidacionesAction',  '_route' => 'registro_ventas_liquidaciones',);
                }

                // registro_ventas_suscripcion_buscar
                if (rtrim($pathinfo, '/') === '/ventas/registrar_ventas/suscripcion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas_suscripcion_buscar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::buscarSuscripcionAction',  '_route' => 'registro_ventas_suscripcion_buscar',);
                }

                // registro_ventas_conceptos
                if (rtrim($pathinfo, '/') === '/ventas/registrar_ventas/conceptos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas_conceptos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::getConceptosAction',  '_route' => 'registro_ventas_conceptos',);
                }

            }

            if (0 === strpos($pathinfo, '/ventas/buscar')) {
                // registro_ventas_buscar
                if (rtrim($pathinfo, '/') === '/ventas/buscar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas_buscar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::getVentasAction',  '_route' => 'registro_ventas_buscar',);
                }

                // registro_ventas_buscar_suscripcion
                if (rtrim($pathinfo, '/') === '/ventas/buscar/venta_suscripcion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas_buscar_suscripcion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::getVentasPorSuscripcionAction',  '_route' => 'registro_ventas_buscar_suscripcion',);
                }

            }

            // registro_ventas_eliminar_adjunto
            if (rtrim($pathinfo, '/') === '/ventas/eliminar_adjunto') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'registro_ventas_eliminar_adjunto');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::eliminarArchivoVentaAction',  '_route' => 'registro_ventas_eliminar_adjunto',);
            }

            if (0 === strpos($pathinfo, '/ventas/registrar_ventas')) {
                // registro_ventas_liquidarventa
                if (rtrim($pathinfo, '/') === '/ventas/registrar_ventas/liquidar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas_liquidarventa');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::liquidarVentaAction',  '_route' => 'registro_ventas_liquidarventa',);
                }

                // wsregistro_ventas_liquidarventa
                if (rtrim($pathinfo, '/') === '/ventas/registrar_ventas/wsliquidar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'wsregistro_ventas_liquidarventa');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::wsLiquidarVentaAction',  '_route' => 'wsregistro_ventas_liquidarventa',);
                }

                // registro_ventas_registrar
                if (rtrim($pathinfo, '/') === '/ventas/registrar_ventas/registrar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas_registrar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::registrarVentaAction',  '_route' => 'registro_ventas_registrar',);
                }

                // registro_ventas_actualizar
                if (rtrim($pathinfo, '/') === '/ventas/registrar_ventas/actualizar_adjuntos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas_actualizar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::actualizarAdjuntoVentaAction',  '_route' => 'registro_ventas_actualizar',);
                }

                // registro_ventas_validar_cocnepto
                if (rtrim($pathinfo, '/') === '/ventas/registrar_ventas/conceptos/validar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas_validar_cocnepto');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::validarEliminacionConceptoAction',  '_route' => 'registro_ventas_validar_cocnepto',);
                }

                // registro_ventas_numero
                if (rtrim($pathinfo, '/') === '/ventas/registrar_ventas/numero') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_ventas_numero');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarVentasController::getNumeroVentaAction',  '_route' => 'registro_ventas_numero',);
                }

            }

            if (0 === strpos($pathinfo, '/ventas/flujoaprobacion')) {
                // aprobacion_ventas
                if (rtrim($pathinfo, '/') === '/ventas/flujoaprobacion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'aprobacion_ventas');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AprobacionVentaController::indexAction',  '_route' => 'aprobacion_ventas',);
                }

                if (0 === strpos($pathinfo, '/ventas/flujoaprobacion/a')) {
                    // aprobacion_ventas_agendas
                    if (rtrim($pathinfo, '/') === '/ventas/flujoaprobacion/agendas') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'aprobacion_ventas_agendas');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AprobacionVentaController::getListaAgendasAction',  '_route' => 'aprobacion_ventas_agendas',);
                    }

                    // aprobacion_ventas_aprobar
                    if (rtrim($pathinfo, '/') === '/ventas/flujoaprobacion/aprobar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'aprobacion_ventas_aprobar');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AprobacionVentaController::aprobarAction',  '_route' => 'aprobacion_ventas_aprobar',);
                    }

                }

                // aprobacion_ventas_consulta_historico
                if (rtrim($pathinfo, '/') === '/ventas/flujoaprobacion/consulta_historico_venta') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'aprobacion_ventas_consulta_historico');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AprobacionVentaController::consultaHistoricoVentaAction',  '_route' => 'aprobacion_ventas_consulta_historico',);
                }

            }

            if (0 === strpos($pathinfo, '/ventas/habilitar_ventas')) {
                // habilitar_ventas_despues_aprobar
                if (rtrim($pathinfo, '/') === '/ventas/habilitar_ventas') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'habilitar_ventas_despues_aprobar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\HabilitarVentaDespuesAprobarController::indexAction',  '_route' => 'habilitar_ventas_despues_aprobar',);
                }

                // habilitar_ventas_busca_comentarios
                if (rtrim($pathinfo, '/') === '/ventas/habilitar_ventas/busca_comentarios') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'habilitar_ventas_busca_comentarios');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\HabilitarVentaDespuesAprobarController::buscaComentariosAction',  '_route' => 'habilitar_ventas_busca_comentarios',);
                }

                // habilitar_ventas_graba_venta_historica
                if (rtrim($pathinfo, '/') === '/ventas/habilitar_ventas/graba_venta_historica') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'habilitar_ventas_graba_venta_historica');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\HabilitarVentaDespuesAprobarController::grabaVentaHistoricaAction',  '_route' => 'habilitar_ventas_graba_venta_historica',);
                }

            }

        }

        if (0 === strpos($pathinfo, '/suscripcion/seguimiento')) {
            // seguimiento_suscripcion
            if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'seguimiento_suscripcion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::indexAction',  '_route' => 'seguimiento_suscripcion',);
            }

            // seguimiento_suscripcion_facturas
            if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/facturas') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'seguimiento_suscripcion_facturas');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getFacturasAction',  '_route' => 'seguimiento_suscripcion_facturas',);
            }

            // seguimiento_suscripcion_facturas_PQR
            if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/PQR') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'seguimiento_suscripcion_facturas_PQR');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getPQRAction',  '_route' => 'seguimiento_suscripcion_facturas_PQR',);
            }

            // seguimiento_suscripcion_facturas_Certificaciones
            if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/Certificaciones') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'seguimiento_suscripcion_facturas_Certificaciones');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getCertificacionesAction',  '_route' => 'seguimiento_suscripcion_facturas_Certificaciones',);
            }

            if (0 === strpos($pathinfo, '/suscripcion/seguimiento/facturas')) {
                if (0 === strpos($pathinfo, '/suscripcion/seguimiento/facturas/conceptos')) {
                    // seguimiento_suscripcion_facturas_conceptos
                    if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/facturas/conceptos') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'seguimiento_suscripcion_facturas_conceptos');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getFacturasConceptosAction',  '_route' => 'seguimiento_suscripcion_facturas_conceptos',);
                    }

                    // seguimiento_suscripcion_facturas_conceptosP
                    if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/facturas/conceptosP') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'seguimiento_suscripcion_facturas_conceptosP');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getFacturasConceptosPAction',  '_route' => 'seguimiento_suscripcion_facturas_conceptosP',);
                    }

                }

                // seguimiento_suscripcion_facturas_allconceptos
                if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/facturas/allconceptos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'seguimiento_suscripcion_facturas_allconceptos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getFacturasAllConceptosAction',  '_route' => 'seguimiento_suscripcion_facturas_allconceptos',);
                }

                // seguimiento_suscripcion_facturas_conceptos_notas
                if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/facturas/notas/conceptos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'seguimiento_suscripcion_facturas_conceptos_notas');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getFacturasNotasConceptosAction',  '_route' => 'seguimiento_suscripcion_facturas_conceptos_notas',);
                }

            }

            // seguimiento_suscripcion_recaudos_conceptos
            if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/recaudos/conceptos') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'seguimiento_suscripcion_recaudos_conceptos');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getRecaudosConceptosAction',  '_route' => 'seguimiento_suscripcion_recaudos_conceptos',);
            }

            // seguimiento_suscripcion_facturas_recaudos
            if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/facturas/recaudos') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'seguimiento_suscripcion_facturas_recaudos');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getRecaudosFacturaAction',  '_route' => 'seguimiento_suscripcion_facturas_recaudos',);
            }

            if (0 === strpos($pathinfo, '/suscripcion/seguimiento/recaudos')) {
                // seguimiento_suscripcion_recaudos
                if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/recaudos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'seguimiento_suscripcion_recaudos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getRecaudosSuscripcionAction',  '_route' => 'seguimiento_suscripcion_recaudos',);
                }

                // seguimiento_facturas_recaudo
                if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/recaudos/facturas') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'seguimiento_facturas_recaudo');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getFacturasRecaudoAction',  '_route' => 'seguimiento_facturas_recaudo',);
                }

            }

            if (0 === strpos($pathinfo, '/suscripcion/seguimiento/financiaciones')) {
                // seguimiento_financiaciones
                if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/financiaciones') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'seguimiento_financiaciones');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getFinanciacionesSuscripcionAction',  '_route' => 'seguimiento_financiaciones',);
                }

                // seguimiento_financiaciones_facturas
                if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/financiaciones/facturas') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'seguimiento_financiaciones_facturas');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getFacturasFinanciacionesAction',  '_route' => 'seguimiento_financiaciones_facturas',);
                }

                // seguimiento_financiaciones_amortizacion
                if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/financiaciones/amortizacion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'seguimiento_financiaciones_amortizacion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getFacturaAmortizacionesAction',  '_route' => 'seguimiento_financiaciones_amortizacion',);
                }

            }

            // seguimiento_financiaciones_cartera
            if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/cartera') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'seguimiento_financiaciones_cartera');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getCarteraAction',  '_route' => 'seguimiento_financiaciones_cartera',);
            }

            // seguimiento_otrasempresas
            if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/otrasempresas') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'seguimiento_otrasempresas');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getFacturasOtrasEmpresasAction',  '_route' => 'seguimiento_otrasempresas',);
            }

            // seguimiento_datossuspensiones
            if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/datossuspension') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'seguimiento_datossuspensiones');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getDatosSuspensionAction',  '_route' => 'seguimiento_datossuspensiones',);
            }

            // seguimiento_suspensiones
            if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/suspension') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'seguimiento_suspensiones');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getSuspensionAction',  '_route' => 'seguimiento_suspensiones',);
            }

            // seguimiento_reconexiones
            if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/reconexion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'seguimiento_reconexiones');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getReconexionesAction',  '_route' => 'seguimiento_reconexiones',);
            }

            // seguimiento_lecturas
            if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/lecturas') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'seguimiento_lecturas');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getLecturasAction',  '_route' => 'seguimiento_lecturas',);
            }

            if (0 === strpos($pathinfo, '/suscripcion/seguimiento/detalle')) {
                // seguimiento_detalle_lecturas
                if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/detallelectura') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'seguimiento_detalle_lecturas');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getDetalleLecturaAction',  '_route' => 'seguimiento_detalle_lecturas',);
                }

                // seguimiento_detalle_vista
                if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/detallevista') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'seguimiento_detalle_vista');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getLecturaVistaAction',  '_route' => 'seguimiento_detalle_vista',);
                }

            }

            if (0 === strpos($pathinfo, '/suscripcion/seguimiento/notas')) {
                // seguimiento_notas
                if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/notasfacturas') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'seguimiento_notas');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getNotasFacturasAction',  '_route' => 'seguimiento_notas',);
                }

                // seguimiento_recaudos
                if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/notasrecaudos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'seguimiento_recaudos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getNotasRecaudoAction',  '_route' => 'seguimiento_recaudos',);
                }

            }

            // seguimiento_recaudos_reclamos
            if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/reclamos') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'seguimiento_recaudos_reclamos');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getReclamosAction',  '_route' => 'seguimiento_recaudos_reclamos',);
            }

            // seguimiento_tarifas_consulta_tarifas
            if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/consultatarifas') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'seguimiento_tarifas_consulta_tarifas');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getTarifasAction',  '_route' => 'seguimiento_tarifas_consulta_tarifas',);
            }

            // seguimiento_suscripcion_facturasProvision
            if (rtrim($pathinfo, '/') === '/suscripcion/seguimiento/facturasProvision') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'seguimiento_suscripcion_facturasProvision');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SeguimientoSuscripcionController::getFacturasProvisionAction',  '_route' => 'seguimiento_suscripcion_facturasProvision',);
            }

        }

        if (0 === strpos($pathinfo, '/operaciones/rapido_suspensiones')) {
            // registro_rapido_operaciones
            if (rtrim($pathinfo, '/') === '/operaciones/rapido_suspensiones') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'registro_rapido_operaciones');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistroRapidoOperacionesController::indexAction',  '_route' => 'registro_rapido_operaciones',);
            }

            // registro_rapido_operaciones_municipios
            if (rtrim($pathinfo, '/') === '/operaciones/rapido_suspensiones/obtener_municipios') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'registro_rapido_operaciones_municipios');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistroRapidoOperacionesController::obtenerMunicipiosAction',  '_route' => 'registro_rapido_operaciones_municipios',);
            }

            if (0 === strpos($pathinfo, '/operaciones/rapido_suspensiones/novedades_')) {
                // registro_rapido_operaciones_novedades_suspension
                if (rtrim($pathinfo, '/') === '/operaciones/rapido_suspensiones/novedades_suspension') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_rapido_operaciones_novedades_suspension');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistroRapidoOperacionesController::getNovedadesSuspensionAction',  '_route' => 'registro_rapido_operaciones_novedades_suspension',);
                }

                // registro_rapido_operaciones_novedades_reconexion
                if (rtrim($pathinfo, '/') === '/operaciones/rapido_suspensiones/novedades_reconexion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_rapido_operaciones_novedades_reconexion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistroRapidoOperacionesController::getNovedadesReconexionAction',  '_route' => 'registro_rapido_operaciones_novedades_reconexion',);
                }

            }

            if (0 === strpos($pathinfo, '/operaciones/rapido_suspensiones/t')) {
                // registro_rapido_operaciones_tipos_suspension
                if (rtrim($pathinfo, '/') === '/operaciones/rapido_suspensiones/tipos_suspension') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_rapido_operaciones_tipos_suspension');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistroRapidoOperacionesController::getTiposSuspensionAction',  '_route' => 'registro_rapido_operaciones_tipos_suspension',);
                }

                if (0 === strpos($pathinfo, '/operaciones/rapido_suspensiones/tabla_')) {
                    // registro_rapido_operaciones_tabla_suspensiones
                    if (rtrim($pathinfo, '/') === '/operaciones/rapido_suspensiones/tabla_suspensiones') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'registro_rapido_operaciones_tabla_suspensiones');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistroRapidoOperacionesController::getSuspensionesTablaAction',  '_route' => 'registro_rapido_operaciones_tabla_suspensiones',);
                    }

                    // registro_rapido_operaciones_tabla_reconexiones
                    if (rtrim($pathinfo, '/') === '/operaciones/rapido_suspensiones/tabla_reconexiones') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'registro_rapido_operaciones_tabla_reconexiones');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistroRapidoOperacionesController::getReconexionesTablaAction',  '_route' => 'registro_rapido_operaciones_tabla_reconexiones',);
                    }

                }

            }

            if (0 === strpos($pathinfo, '/operaciones/rapido_suspensiones/info_')) {
                // registro_rapido_operaciones_info_suspensiones
                if (rtrim($pathinfo, '/') === '/operaciones/rapido_suspensiones/info_suspensiones') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_rapido_operaciones_info_suspensiones');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistroRapidoOperacionesController::setSuspensionesAction',  '_route' => 'registro_rapido_operaciones_info_suspensiones',);
                }

                // registro_rapido_operaciones_info_reconexiones
                if (rtrim($pathinfo, '/') === '/operaciones/rapido_suspensiones/info_reconexiones') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registro_rapido_operaciones_info_reconexiones');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistroRapidoOperacionesController::setReconexionesAction',  '_route' => 'registro_rapido_operaciones_info_reconexiones',);
                }

            }

        }

        if (0 === strpos($pathinfo, '/liquidacion/gestionar_liquidacion')) {
            // liquidacion_gestionar
            if (rtrim($pathinfo, '/') === '/liquidacion/gestionar_liquidacion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'liquidacion_gestionar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarLiquidacionController::indexAction',  '_route' => 'liquidacion_gestionar',);
            }

            if (0 === strpos($pathinfo, '/liquidacion/gestionar_liquidacion/obtener_')) {
                // liquidacion_documentos
                if (rtrim($pathinfo, '/') === '/liquidacion/gestionar_liquidacion/obtener_documentos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'liquidacion_documentos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarLiquidacionController::getDocumentosAction',  '_route' => 'liquidacion_documentos',);
                }

                // liquidacion_tipo_documentos
                if (rtrim($pathinfo, '/') === '/liquidacion/gestionar_liquidacion/obtener_tipos_documentos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'liquidacion_tipo_documentos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarLiquidacionController::getTiposDocumentosAction',  '_route' => 'liquidacion_tipo_documentos',);
                }

                // liquidacion_liquidaciones
                if (rtrim($pathinfo, '/') === '/liquidacion/gestionar_liquidacion/obtener_liquidaciones') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'liquidacion_liquidaciones');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarLiquidacionController::getLiquidacionesAction',  '_route' => 'liquidacion_liquidaciones',);
                }

                // liquidacion_conceptos
                if (rtrim($pathinfo, '/') === '/liquidacion/gestionar_liquidacion/obtener_conceptos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'liquidacion_conceptos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarLiquidacionController::getConceptosAction',  '_route' => 'liquidacion_conceptos',);
                }

                if (0 === strpos($pathinfo, '/liquidacion/gestionar_liquidacion/obtener_municipios')) {
                    // liquidacion_municipios
                    if (rtrim($pathinfo, '/') === '/liquidacion/gestionar_liquidacion/obtener_municipios') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'liquidacion_municipios');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarLiquidacionController::getMunicipiosAction',  '_route' => 'liquidacion_municipios',);
                    }

                    // liquidacion_municipios_usuario
                    if (rtrim($pathinfo, '/') === '/liquidacion/gestionar_liquidacion/obtener_municipios_usuario') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'liquidacion_municipios_usuario');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarLiquidacionController::getMunicipiosPorUsuarioAction',  '_route' => 'liquidacion_municipios_usuario',);
                    }

                }

                // liquidacion_tipos_usos
                if (rtrim($pathinfo, '/') === '/liquidacion/gestionar_liquidacion/obtener_tipos_usos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'liquidacion_tipos_usos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarLiquidacionController::getTiposUsosAction',  '_route' => 'liquidacion_tipos_usos',);
                }

                // liquidacion_barrios
                if (rtrim($pathinfo, '/') === '/liquidacion/gestionar_liquidacion/obtener_barrios') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'liquidacion_barrios');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarLiquidacionController::getBarriosAction',  '_route' => 'liquidacion_barrios',);
                }

                // liquidacion_suscripciones
                if (rtrim($pathinfo, '/') === '/liquidacion/gestionar_liquidacion/obtener_suscripciones') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'liquidacion_suscripciones');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarLiquidacionController::getSuscripcionesAction',  '_route' => 'liquidacion_suscripciones',);
                }

                // liquidacion_liquidacion
                if (rtrim($pathinfo, '/') === '/liquidacion/gestionar_liquidacion/obtener_liquidacion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'liquidacion_liquidacion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarLiquidacionController::getLiquidacionAction',  '_route' => 'liquidacion_liquidacion',);
                }

            }

            // liquidacion_guardar
            if (rtrim($pathinfo, '/') === '/liquidacion/gestionar_liquidacion/guardar_liquidacion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'liquidacion_guardar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarLiquidacionController::guardarLiquidacionAction',  '_route' => 'liquidacion_guardar',);
            }

            // liquidacion_concepto_eliminar
            if (rtrim($pathinfo, '/') === '/liquidacion/gestionar_liquidacion/concepto_eliminar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'liquidacion_concepto_eliminar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarLiquidacionController::getConceptosEliminarAction',  '_route' => 'liquidacion_concepto_eliminar',);
            }

            // liquidacion_municipio_eliminar
            if (rtrim($pathinfo, '/') === '/liquidacion/gestionar_liquidacion/municipio_eliminar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'liquidacion_municipio_eliminar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarLiquidacionController::getMunicipiosEliminarAction',  '_route' => 'liquidacion_municipio_eliminar',);
            }

            // liquidacion_tipouso_eliminar
            if (rtrim($pathinfo, '/') === '/liquidacion/gestionar_liquidacion/tipouso_eliminar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'liquidacion_tipouso_eliminar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarLiquidacionController::getTipoUsosEliminarAction',  '_route' => 'liquidacion_tipouso_eliminar',);
            }

            // liquidacion_liquidaciones_parametrizadas
            if (rtrim($pathinfo, '/') === '/liquidacion/gestionar_liquidacion/liquidaciones_parametrizadas') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'liquidacion_liquidaciones_parametrizadas');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarLiquidacionController::getLiquidacionesParametrizadasAction',  '_route' => 'liquidacion_liquidaciones_parametrizadas',);
            }

        }

        if (0 === strpos($pathinfo, '/recaudos/devoluciones')) {
            // recaudos_devoluciones
            if (rtrim($pathinfo, '/') === '/recaudos/devoluciones') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'recaudos_devoluciones');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DevolucionesController::indexAction',  '_route' => 'recaudos_devoluciones',);
            }

            // recaudos_devoluciones_suscripciones
            if (rtrim($pathinfo, '/') === '/recaudos/devoluciones/suscripciones') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'recaudos_devoluciones_suscripciones');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DevolucionesController::consultarSuscripcionesAction',  '_route' => 'recaudos_devoluciones_suscripciones',);
            }

            // recaudos_devoluciones_cargar_devoluciones
            if ($pathinfo === '/recaudos/devoluciones/cargar/devoluciones') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DevolucionesController::consultarDevolucionesAction',  '_route' => 'recaudos_devoluciones_cargar_devoluciones',);
            }

            // recaudos_devoluciones_motivos
            if ($pathinfo === '/recaudos/devoluciones/motivos') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DevolucionesController::consultarMotivosAction',  '_route' => 'recaudos_devoluciones_motivos',);
            }

            // recaudos_devoluciones_grabar
            if (rtrim($pathinfo, '/') === '/recaudos/devoluciones/grabar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'recaudos_devoluciones_grabar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DevolucionesController::grabarAction',  '_route' => 'recaudos_devoluciones_grabar',);
            }

            // recaudos_devoluciones_detalle
            if (rtrim($pathinfo, '/') === '/recaudos/devoluciones/detallerecaudofactura') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'recaudos_devoluciones_detalle');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DevolucionesController::consultarDetalleRecaudoFacturaAction',  '_route' => 'recaudos_devoluciones_detalle',);
            }

        }

        if (0 === strpos($pathinfo, '/ventas')) {
            // ventas
            if (rtrim($pathinfo, '/') === '/ventas') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'ventas');
                }

                return array (  '_controller' => 'LlanogasLlanogasBundle:Ventas:index',  '_route' => 'ventas',);
            }

            if (0 === strpos($pathinfo, '/ventas/constructoras')) {
                // ventas_constructoras
                if (rtrim($pathinfo, '/') === '/ventas/constructoras') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'ventas_constructoras');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasController::indexAction',  '_route' => 'ventas_constructoras',);
                }

                // ventas_constructoras_terceros
                if (rtrim($pathinfo, '/') === '/ventas/constructoras/terceros') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'ventas_constructoras_terceros');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasController::ConsultarConstructorasAction',  '_route' => 'ventas_constructoras_terceros',);
                }

                if (0 === strpos($pathinfo, '/ventas/constructoras/filtrar')) {
                    if (0 === strpos($pathinfo, '/ventas/constructoras/filtrar/consultar_')) {
                        // ventas_filtrar_contratos_consultar_municipios
                        if (rtrim($pathinfo, '/') === '/ventas/constructoras/filtrar/consultar_municipios') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'ventas_filtrar_contratos_consultar_municipios');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasController::consultarMunicipiosAction',  '_route' => 'ventas_filtrar_contratos_consultar_municipios',);
                        }

                        // ventas_filtrar_contratos_consultar_barrios
                        if (rtrim($pathinfo, '/') === '/ventas/constructoras/filtrar/consultar_barrios') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'ventas_filtrar_contratos_consultar_barrios');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasController::consultarBarriosAction',  '_route' => 'ventas_filtrar_contratos_consultar_barrios',);
                        }

                        if (0 === strpos($pathinfo, '/ventas/constructoras/filtrar/consultar_cont')) {
                            // ventas_filtrar_contratos_consultar_contratos
                            if (rtrim($pathinfo, '/') === '/ventas/constructoras/filtrar/consultar_contratos') {
                                if (substr($pathinfo, -1) !== '/') {
                                    return $this->redirect($pathinfo.'/', 'ventas_filtrar_contratos_consultar_contratos');
                                }

                                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasController::consultarContratosAction',  '_route' => 'ventas_filtrar_contratos_consultar_contratos',);
                            }

                            // ventas_filtrar_contratos_consultar_contactos
                            if (rtrim($pathinfo, '/') === '/ventas/constructoras/filtrar/consultar_contactos') {
                                if (substr($pathinfo, -1) !== '/') {
                                    return $this->redirect($pathinfo.'/', 'ventas_filtrar_contratos_consultar_contactos');
                                }

                                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasController::consultarContactosAction',  '_route' => 'ventas_filtrar_contratos_consultar_contactos',);
                            }

                        }

                        if (0 === strpos($pathinfo, '/ventas/constructoras/filtrar/consultar_tercero_')) {
                            // ventas_filtrar_contratos_consultar_tercero_aseguradora
                            if (rtrim($pathinfo, '/') === '/ventas/constructoras/filtrar/consultar_tercero_aseguradora') {
                                if (substr($pathinfo, -1) !== '/') {
                                    return $this->redirect($pathinfo.'/', 'ventas_filtrar_contratos_consultar_tercero_aseguradora');
                                }

                                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasController::ConsultarTerceroAseguradoraAction',  '_route' => 'ventas_filtrar_contratos_consultar_tercero_aseguradora',);
                            }

                            // ventas_filtrar_contratos_consultar_tercero_suscriptor
                            if (rtrim($pathinfo, '/') === '/ventas/constructoras/filtrar/consultar_tercero_suscriptor') {
                                if (substr($pathinfo, -1) !== '/') {
                                    return $this->redirect($pathinfo.'/', 'ventas_filtrar_contratos_consultar_tercero_suscriptor');
                                }

                                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasController::ConsultarTerceroSuscriptorAction',  '_route' => 'ventas_filtrar_contratos_consultar_tercero_suscriptor',);
                            }

                        }

                        // ventas_filtrar_consultar_suscripciones_suscriptor
                        if (rtrim($pathinfo, '/') === '/ventas/constructoras/filtrar/consultar_suscripciones_suscriptor') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'ventas_filtrar_consultar_suscripciones_suscriptor');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasController::ConsultarSuscripcionesSuscriptorAction',  '_route' => 'ventas_filtrar_consultar_suscripciones_suscriptor',);
                        }

                        // ventas_filtrar_consultar_consultar_liquidaciones
                        if (rtrim($pathinfo, '/') === '/ventas/constructoras/filtrar/consultar_liquidaciones') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'ventas_filtrar_consultar_consultar_liquidaciones');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasController::AutoCompletarLiquidacionAction',  '_route' => 'ventas_filtrar_consultar_consultar_liquidaciones',);
                        }

                        // ventas_filtrar_consultar_parametros_adicionar_servicios
                        if (rtrim($pathinfo, '/') === '/ventas/constructoras/filtrar/consultar_parametros_servicios_contratados') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'ventas_filtrar_consultar_parametros_adicionar_servicios');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasController::ParametrosAdicionarServiciosAction',  '_route' => 'ventas_filtrar_consultar_parametros_adicionar_servicios',);
                        }

                    }

                    // ventas_filtrar_actualizar_informacion_contrato/
                    if (rtrim($pathinfo, '/') === '/ventas/constructoras/filtrar/actualizar_informacion_contrato') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'ventas_filtrar_actualizar_informacion_contrato/');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasController::actualizarInformacionContratoAction',  '_route' => 'ventas_filtrar_actualizar_informacion_contrato/',);
                    }

                }

                // ventas_grabar
                if (rtrim($pathinfo, '/') === '/ventas/constructoras/grabar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'ventas_grabar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasController::grabarAction',  '_route' => 'ventas_grabar',);
                }

                // ventas_subir_archivo
                if (rtrim($pathinfo, '/') === '/ventas/constructoras/subir_archivo') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'ventas_subir_archivo');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasController::subirarchivoAction',  '_route' => 'ventas_subir_archivo',);
                }

                // ventas_eliminar_archivo
                if (rtrim($pathinfo, '/') === '/ventas/constructoras/eliminar_Archivo') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'ventas_eliminar_archivo');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasController::eliminarArchivoAction',  '_route' => 'ventas_eliminar_archivo',);
                }

                if (0 === strpos($pathinfo, '/ventas/constructoras/agendas')) {
                    // ventas_procesar_agendas
                    if (rtrim($pathinfo, '/') === '/ventas/constructoras/agendas') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'ventas_procesar_agendas');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasController::AgendasAction',  '_route' => 'ventas_procesar_agendas',);
                    }

                    // ventas_procesar_agendas_procesar
                    if (rtrim($pathinfo, '/') === '/ventas/constructoras/agendas/procesar_Agenda') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'ventas_procesar_agendas_procesar');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasController::procesarAgendasAction',  '_route' => 'ventas_procesar_agendas_procesar',);
                    }

                }

            }

            if (0 === strpos($pathinfo, '/ventas/firmasinstaladoras')) {
                // ventas_firmas_instaladoras
                if (rtrim($pathinfo, '/') === '/ventas/firmasinstaladoras') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'ventas_firmas_instaladoras');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FirmasInstaladorasController::indexAction',  '_route' => 'ventas_firmas_instaladoras',);
                }

                // ventas_firmas_instaladoras_terceros
                if (rtrim($pathinfo, '/') === '/ventas/firmasinstaladoras/terceros') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'ventas_firmas_instaladoras_terceros');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FirmasInstaladorasController::autoCompletarTerceroAction',  '_route' => 'ventas_firmas_instaladoras_terceros',);
                }

                // ventas_firmas_instaladoras_empleadoscertificaciones
                if (rtrim($pathinfo, '/') === '/ventas/firmasinstaladoras/empleadoscertificaciones') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'ventas_firmas_instaladoras_empleadoscertificaciones');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FirmasInstaladorasController::consultaempleadoscertificacionesAction',  '_route' => 'ventas_firmas_instaladoras_empleadoscertificaciones',);
                }

                if (0 === strpos($pathinfo, '/ventas/firmasinstaladoras/consulta')) {
                    // ventas_firmas_instaladoras_competencias
                    if (rtrim($pathinfo, '/') === '/ventas/firmasinstaladoras/consultacompetencias') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'ventas_firmas_instaladoras_competencias');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FirmasInstaladorasController::consultaCompetenciasAction',  '_route' => 'ventas_firmas_instaladoras_competencias',);
                    }

                    // ventas_firmas_instaladoras_consultapermisosgrabar
                    if (rtrim($pathinfo, '/') === '/ventas/firmasinstaladoras/consultapermisosgrabar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'ventas_firmas_instaladoras_consultapermisosgrabar');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FirmasInstaladorasController::consultaPermisosGrabarAction',  '_route' => 'ventas_firmas_instaladoras_consultapermisosgrabar',);
                    }

                }

                // ventas_firmas_instaladoras_grabar
                if (rtrim($pathinfo, '/') === '/ventas/firmasinstaladoras/grabar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'ventas_firmas_instaladoras_grabar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FirmasInstaladorasController::grabarAction',  '_route' => 'ventas_firmas_instaladoras_grabar',);
                }

            }

        }

        if (0 === strpos($pathinfo, '/facturacion')) {
            if (0 === strpos($pathinfo, '/facturacion/c')) {
                if (0 === strpos($pathinfo, '/facturacion/conceptos')) {
                    // definicion_conceptos
                    if (rtrim($pathinfo, '/') === '/facturacion/conceptos/definicion') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'definicion_conceptos');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefinicionesConceptosController::indexAction',  '_route' => 'definicion_conceptos',);
                    }

                    // definicion_conceptos_parametros
                    if (rtrim($pathinfo, '/') === '/facturacion/conceptos/parametros') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'definicion_conceptos_parametros');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefinicionesConceptosController::cargarParametrosConceptosAction',  '_route' => 'definicion_conceptos_parametros',);
                    }

                }

                // definicion_actualizar_conceptos
                if ($pathinfo === '/facturacion/crear/conceptos') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefinicionesConceptosController::actualizarConceptoAction',  '_route' => 'definicion_actualizar_conceptos',);
                }

                // definicion_consultar_conceptos_nombres
                if ($pathinfo === '/facturacion/consultar/concepto/nombre') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefinicionesConceptosController::consultarConceptosNombreAction',  '_route' => 'definicion_consultar_conceptos_nombres',);
                }

            }

            // definicion_consultar_conceptos_validar
            if ($pathinfo === '/facturacion/validar/concepto/alias') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefinicionesConceptosController::validaAliasConceptoAction',  '_route' => 'definicion_consultar_conceptos_validar',);
            }

            if (0 === strpos($pathinfo, '/facturacion/con')) {
                // definicion_consultar_documentos
                if ($pathinfo === '/facturacion/conceptos/documentos') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefinicionesConceptosController::consultarDocumentosAction',  '_route' => 'definicion_consultar_documentos',);
                }

                // definicion_consultar_TipoDocumento
                if ($pathinfo === '/facturacion/consultar/tipoDocumento') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefinicionesConceptosController::consultarTipoDocumentoAction',  '_route' => 'definicion_consultar_TipoDocumento',);
                }

                // definicion_conceptos_obtener
                if ($pathinfo === '/facturacion/conceptos/obtener') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefinicionesConceptosController::consultarConceptosAction',  '_route' => 'definicion_conceptos_obtener',);
                }

                if (0 === strpos($pathinfo, '/facturacion/consultar')) {
                    // definicion_conceptos_obtener_liquidacion
                    if ($pathinfo === '/facturacion/consultar/documentoliquidacion') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefinicionesConceptosController::consultarDocumentoLiquidacionAction',  '_route' => 'definicion_conceptos_obtener_liquidacion',);
                    }

                    // definicion_consultar_conceptos_cuentas_contabilizacion
                    if ($pathinfo === '/facturacion/consultar/cuentas') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefinicionesConceptosController::consultarCuentasAction',  '_route' => 'definicion_consultar_conceptos_cuentas_contabilizacion',);
                    }

                    // definicion_consultar_conceptos_lista_banco_medio_pago
                    if ($pathinfo === '/facturacion/consultar/bancos/mediospago') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\DefinicionesConceptosController::obtenerListarBancosConsignacionAction',  '_route' => 'definicion_consultar_conceptos_lista_banco_medio_pago',);
                    }

                }

            }

        }

        if (0 === strpos($pathinfo, '/recaudos/modificar_recaudo')) {
            // modificar_recaudos
            if (rtrim($pathinfo, '/') === '/recaudos/modificar_recaudo') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'modificar_recaudos');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarRecaudoController::indexAction',  '_route' => 'modificar_recaudos',);
            }

            // modificar_recaudos_buscar_recaudos
            if (rtrim($pathinfo, '/') === '/recaudos/modificar_recaudo/buscar_recaudos') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'modificar_recaudos_buscar_recaudos');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarRecaudoController::getRecaudosAction',  '_route' => 'modificar_recaudos_buscar_recaudos',);
            }

            // modificar_recaudos_informacion_recaudos
            if (rtrim($pathinfo, '/') === '/recaudos/modificar_recaudo/informacion_recaudos') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'modificar_recaudos_informacion_recaudos');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarRecaudoController::getInformacionRecaudoAction',  '_route' => 'modificar_recaudos_informacion_recaudos',);
            }

            // modificar_recaudos_guardar_modificacion
            if (rtrim($pathinfo, '/') === '/recaudos/modificar_recaudo/guardar_modificacion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'modificar_recaudos_guardar_modificacion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarRecaudoController::modificarRecaudoAction',  '_route' => 'modificar_recaudos_guardar_modificacion',);
            }

            // modificar_recaudos_municipios
            if (rtrim($pathinfo, '/') === '/recaudos/modificar_recaudo/obtener_municipios') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'modificar_recaudos_municipios');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarRecaudoController::getMunicipiosAction',  '_route' => 'modificar_recaudos_municipios',);
            }

            // modificar_recaudos_buscar_tipos_documentos
            if (rtrim($pathinfo, '/') === '/recaudos/modificar_recaudo/buscar/tipos_documento') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'modificar_recaudos_buscar_tipos_documentos');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarRecaudoController::consultarTiposDocumentoPorTipoUsoAction',  '_route' => 'modificar_recaudos_buscar_tipos_documentos',);
            }

            if (0 === strpos($pathinfo, '/recaudos/modificar_recaudo/set')) {
                // modificar_recaudos_set_distribucion_recaudo
                if (rtrim($pathinfo, '/') === '/recaudos/modificar_recaudo/set/distribucion_recaudo') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'modificar_recaudos_set_distribucion_recaudo');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarRecaudoController::setDistribucionRecaudoAction',  '_route' => 'modificar_recaudos_set_distribucion_recaudo',);
                }

                // modificar_recaudos_set_valida_recaudo
                if (rtrim($pathinfo, '/') === '/recaudos/modificar_recaudo/set/valida_recaudo') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'modificar_recaudos_set_valida_recaudo');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarRecaudoController::validaRecaudoSetAction',  '_route' => 'modificar_recaudos_set_valida_recaudo',);
                }

            }

        }

        if (0 === strpos($pathinfo, '/facturacion/cargar_factor_correccion')) {
            // cargar_factor_correccion
            if (rtrim($pathinfo, '/') === '/facturacion/cargar_factor_correccion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'cargar_factor_correccion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CargarFactorCorreccionController::indexAction',  '_route' => 'cargar_factor_correccion',);
            }

            // cargar_factor_correccion_subir
            if (rtrim($pathinfo, '/') === '/facturacion/cargar_factor_correccion/subir') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'cargar_factor_correccion_subir');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CargarFactorCorreccionController::cargarFactorCorreccionAction',  '_route' => 'cargar_factor_correccion_subir',);
            }

        }

        if (0 === strpos($pathinfo, '/recaudos/consignaciones/aprobacion')) {
            // flujo_aprobacion
            if (rtrim($pathinfo, '/') === '/recaudos/consignaciones/aprobacion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'flujo_aprobacion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsignacionAprobacionController::indexAction',  '_route' => 'flujo_aprobacion',);
            }

            if (0 === strpos($pathinfo, '/recaudos/consignaciones/aprobacion/t')) {
                // flujo_aprobacion_terceros
                if (rtrim($pathinfo, '/') === '/recaudos/consignaciones/aprobacion/terceros') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'flujo_aprobacion_terceros');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsignacionAprobacionController::getTercerosResponsablesAction',  '_route' => 'flujo_aprobacion_terceros',);
                }

                // flujo_aprobacion_tipo_documento
                if (rtrim($pathinfo, '/') === '/recaudos/consignaciones/aprobacion/tipo_documento') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'flujo_aprobacion_tipo_documento');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsignacionAprobacionController::getTiposDocumentosAction',  '_route' => 'flujo_aprobacion_tipo_documento',);
                }

            }

            // flujo_aprobacion_aprobar
            if (rtrim($pathinfo, '/') === '/recaudos/consignaciones/aprobacion/aprobar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'flujo_aprobacion_aprobar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConsignacionAprobacionController::aprobarAction',  '_route' => 'flujo_aprobacion_aprobar',);
            }

        }

        if (0 === strpos($pathinfo, '/ventas')) {
            if (0 === strpos($pathinfo, '/ventas/financiacion')) {
                // financiacion_ventas
                if (rtrim($pathinfo, '/') === '/ventas/financiacion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'financiacion_ventas');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FinanciarVentaController::indexAction',  '_route' => 'financiacion_ventas',);
                }

                // financiacion_ventas_bancos
                if (rtrim($pathinfo, '/') === '/ventas/financiacion/obtener/parentescos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'financiacion_ventas_bancos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FinanciarVentaController::obtenerParentescosAction',  '_route' => 'financiacion_ventas_bancos',);
                }

                if (0 === strpos($pathinfo, '/ventas/financiacion/conceptos')) {
                    // financiacion_ventas_conceptos
                    if (rtrim($pathinfo, '/') === '/ventas/financiacion/conceptos') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'financiacion_ventas_conceptos');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FinanciarVentaController::getConceptosAction',  '_route' => 'financiacion_ventas_conceptos',);
                    }

                    // financiacion_ventas_conceptos_liquidacion
                    if (rtrim($pathinfo, '/') === '/ventas/financiacion/conceptos_liquidacion') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'financiacion_ventas_conceptos_liquidacion');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FinanciarVentaController::getConceptosPorLiquidacionAction',  '_route' => 'financiacion_ventas_conceptos_liquidacion',);
                    }

                }

                // financiacion_ventas_liquidaciones
                if (rtrim($pathinfo, '/') === '/ventas/financiacion/liquidaciones') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'financiacion_ventas_liquidaciones');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FinanciarVentaController::getLiquidacionesAction',  '_route' => 'financiacion_ventas_liquidaciones',);
                }

            }

            // financiacion_ventas_adjuntos
            if (rtrim($pathinfo, '/') === '/ventas/adjuntos') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'financiacion_ventas_adjuntos');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FinanciarVentaController::subirAdjuntoAction',  '_route' => 'financiacion_ventas_adjuntos',);
            }

            if (0 === strpos($pathinfo, '/ventas/financiacion')) {
                // financiacion_ventas_grabar
                if (rtrim($pathinfo, '/') === '/ventas/financiacion/grabar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'financiacion_ventas_grabar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FinanciarVentaController::grabarAction',  '_route' => 'financiacion_ventas_grabar',);
                }

                // financiacion_ventas_actualizar_adjuntos
                if (rtrim($pathinfo, '/') === '/ventas/financiacion/actualizar_adjuntos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'financiacion_ventas_actualizar_adjuntos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FinanciarVentaController::actualizarAdjuntoAction',  '_route' => 'financiacion_ventas_actualizar_adjuntos',);
                }

                // financiacion_ventas_guardar_informacion_autorizacion
                if (rtrim($pathinfo, '/') === '/ventas/financiacion/informacion_autorizacion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'financiacion_ventas_guardar_informacion_autorizacion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FinanciarVentaController::cargarInformacionFormatoAction',  '_route' => 'financiacion_ventas_guardar_informacion_autorizacion',);
                }

                // financiacion_ventas_exportar_autorizacion
                if (rtrim($pathinfo, '/') === '/ventas/financiacion/exportar_autorizacion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'financiacion_ventas_exportar_autorizacion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ExportarFormatoExcelController::exportarFormatoAction',  '_route' => 'financiacion_ventas_exportar_autorizacion',);
                }

            }

        }

        if (0 === strpos($pathinfo, '/suscripcion/modificar_suscripcion')) {
            // modificar_suscripcion
            if (rtrim($pathinfo, '/') === '/suscripcion/modificar_suscripcion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'modificar_suscripcion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarSuscripcionController::indexAction',  '_route' => 'modificar_suscripcion',);
            }

            if (0 === strpos($pathinfo, '/suscripcion/modificar_suscripcion/c')) {
                // modificar_suscripcion_conceptos
                if (rtrim($pathinfo, '/') === '/suscripcion/modificar_suscripcion/conceptos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'modificar_suscripcion_conceptos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarSuscripcionController::getConceptosAction',  '_route' => 'modificar_suscripcion_conceptos',);
                }

                // modificar_suscripcion_ciclos
                if (rtrim($pathinfo, '/') === '/suscripcion/modificar_suscripcion/ciclos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'modificar_suscripcion_ciclos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarSuscripcionController::getCiclosAction',  '_route' => 'modificar_suscripcion_ciclos',);
                }

                if (0 === strpos($pathinfo, '/suscripcion/modificar_suscripcion/clienteslineamatriz')) {
                    // modificar_suscripcion_clientes_linea_matriz
                    if (rtrim($pathinfo, '/') === '/suscripcion/modificar_suscripcion/clienteslineamatriz') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'modificar_suscripcion_clientes_linea_matriz');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarSuscripcionController::getClienteVinculadoLineaMatrizAction',  '_route' => 'modificar_suscripcion_clientes_linea_matriz',);
                    }

                    // modificar_suscripcion_clientes_linea_matriz_actualiza
                    if (rtrim($pathinfo, '/') === '/suscripcion/modificar_suscripcion/clienteslineamatrizretira') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'modificar_suscripcion_clientes_linea_matriz_actualiza');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarSuscripcionController::setRetiraClienteVinculadoAction',  '_route' => 'modificar_suscripcion_clientes_linea_matriz_actualiza',);
                    }

                }

            }

            // modificar_suscripcion_clientes_busca_linea_matriz_vincula
            if (rtrim($pathinfo, '/') === '/suscripcion/modificar_suscripcion/buscaclienteslineamatriz') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'modificar_suscripcion_clientes_busca_linea_matriz_vincula');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarSuscripcionController::getBuscaClienteLineaMatrizAction',  '_route' => 'modificar_suscripcion_clientes_busca_linea_matriz_vincula',);
            }

            // modificar_suscripcion_insertar_clientes_busca_linea_matriz_vincula
            if (rtrim($pathinfo, '/') === '/suscripcion/modificar_suscripcion/insertaclientelineamatrizavincular') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'modificar_suscripcion_insertar_clientes_busca_linea_matriz_vincula');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarSuscripcionController::clienteParaVincularLineaMatrizAction',  '_route' => 'modificar_suscripcion_insertar_clientes_busca_linea_matriz_vincula',);
            }

        }

        if (0 === strpos($pathinfo, '/recaudos/recaudo/rapido')) {
            // recaudo_rapido
            if ($pathinfo === '/recaudos/recaudo/rapido') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RecaudoRapidoController::indexAction',  '_route' => 'recaudo_rapido',);
            }

            // recaudo_rapido_recaudador_externo
            if ($pathinfo === '/recaudos/recaudo/rapido/recaudador_externo') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RecaudoRapidoController::getRecaudadorExternoAction',  '_route' => 'recaudo_rapido_recaudador_externo',);
            }

            // recaudo_rapido_empresas_recaudo
            if ($pathinfo === '/recaudos/recaudo/rapido/empresas_recaudo') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RecaudoRapidoController::getEmpresasRecaudoAction',  '_route' => 'recaudo_rapido_empresas_recaudo',);
            }

            // recaudo_rapido_informacion_suscripcion
            if ($pathinfo === '/recaudos/recaudo/rapido/informacion_suscripcion') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RecaudoRapidoController::getInformacionSuscripcionAction',  '_route' => 'recaudo_rapido_informacion_suscripcion',);
            }

            // recaudo_rapido_informacion_suscripcion_factura
            if ($pathinfo === '/recaudos/recaudo/rapido/suscripcion_factura') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RecaudoRapidoController::getSuscripcionPorFacturaAction',  '_route' => 'recaudo_rapido_informacion_suscripcion_factura',);
            }

            // recaudo_rapido_facturas_suscripcion
            if ($pathinfo === '/recaudos/recaudo/rapido/facturas_suscripcion') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RecaudoRapidoController::getFacturasPorSuscripcionAction',  '_route' => 'recaudo_rapido_facturas_suscripcion',);
            }

        }

        if (0 === strpos($pathinfo, '/suscriptor/gestionar_suscriptor')) {
            // gestionar_suscriptor
            if ($pathinfo === '/suscriptor/gestionar_suscriptor') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscriptoresController::indexAction',  '_route' => 'gestionar_suscriptor',);
            }

            // gestionar_suscriptor_buscar
            if (rtrim($pathinfo, '/') === '/suscriptor/gestionar_suscriptor/buscar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'gestionar_suscriptor_buscar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscriptoresController::buscarAction',  '_route' => 'gestionar_suscriptor_buscar',);
            }

            // gestionar_suscriptor_grabar
            if (rtrim($pathinfo, '/') === '/suscriptor/gestionar_suscriptor/grabar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'gestionar_suscriptor_grabar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscriptoresController::grabarAction',  '_route' => 'gestionar_suscriptor_grabar',);
            }

            // gestionar_suscriptor_adicionar_suscriptor
            if (rtrim($pathinfo, '/') === '/suscriptor/gestionar_suscriptor/adicionar_suscriptor') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'gestionar_suscriptor_adicionar_suscriptor');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscriptoresController::adicionarSuscriptorAction',  '_route' => 'gestionar_suscriptor_adicionar_suscriptor',);
            }

            // gestionar_suscriptor_trasladar_suscripcion
            if (rtrim($pathinfo, '/') === '/suscriptor/gestionar_suscriptor/trasladar_suscripcion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'gestionar_suscriptor_trasladar_suscripcion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscriptoresController::trasladarSuscripcionAction',  '_route' => 'gestionar_suscriptor_trasladar_suscripcion',);
            }

        }

        if (0 === strpos($pathinfo, '/contabilizacion/movimientos_contables')) {
            // generar_movimientos_contables
            if (rtrim($pathinfo, '/') === '/contabilizacion/movimientos_contables') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'generar_movimientos_contables');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\MovimientosContablesController::indexAction',  '_route' => 'generar_movimientos_contables',);
            }

            // generar_movimientos_contables_estado
            if ($pathinfo === '/contabilizacion/movimientos_contables/estado') {
                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\MovimientosContablesController::estadoMovimientoAction',  '_route' => 'generar_movimientos_contables_estado',);
            }

            // generar_movimientos_contables_procesar
            if (rtrim($pathinfo, '/') === '/contabilizacion/movimientos_contables/procesar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'generar_movimientos_contables_procesar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\MovimientosContablesController::procesarMovimientosContablesAction',  '_route' => 'generar_movimientos_contables_procesar',);
            }

            if (0 === strpos($pathinfo, '/contabilizacion/movimientos_contables/consulta')) {
                if (0 === strpos($pathinfo, '/contabilizacion/movimientos_contables/consultaciclo')) {
                    // generar_movimientos_contables_consultaciclos
                    if (rtrim($pathinfo, '/') === '/contabilizacion/movimientos_contables/consultaciclos') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'generar_movimientos_contables_consultaciclos');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\MovimientosContablesController::consultaCiclosAction',  '_route' => 'generar_movimientos_contables_consultaciclos',);
                    }

                    // generar_movimientos_contables_consultaciclogeneral
                    if (rtrim($pathinfo, '/') === '/contabilizacion/movimientos_contables/consultaciclogeneral') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'generar_movimientos_contables_consultaciclogeneral');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\MovimientosContablesController::consultaCicloGeneralAction',  '_route' => 'generar_movimientos_contables_consultaciclogeneral',);
                    }

                }

                // generar_movimientos_contables_consultaperiodos
                if (rtrim($pathinfo, '/') === '/contabilizacion/movimientos_contables/consultaperiodos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'generar_movimientos_contables_consultaperiodos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\MovimientosContablesController::consultaPeriodosAction',  '_route' => 'generar_movimientos_contables_consultaperiodos',);
                }

            }

        }

        if (0 === strpos($pathinfo, '/facturacion/contabilizar_concepto')) {
            // contabilizacion_conceptos
            if (rtrim($pathinfo, '/') === '/facturacion/contabilizar_concepto') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'contabilizacion_conceptos');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ContabilizarConceptosController::indexAction',  '_route' => 'contabilizacion_conceptos',);
            }

            if (0 === strpos($pathinfo, '/facturacion/contabilizar_concepto/obtener')) {
                // contabilizacion_conceptos_recaudos
                if (rtrim($pathinfo, '/') === '/facturacion/contabilizar_concepto/obtener/recaudos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'contabilizacion_conceptos_recaudos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ContabilizarConceptosController::obtenerRecaudosAction',  '_route' => 'contabilizacion_conceptos_recaudos',);
                }

                // contabilizacion_conceptos_contabilizacion
                if (rtrim($pathinfo, '/') === '/facturacion/contabilizar_concepto/obtenercontabilizacion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'contabilizacion_conceptos_contabilizacion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ContabilizarConceptosController::obtenerCausionContableAction',  '_route' => 'contabilizacion_conceptos_contabilizacion',);
                }

            }

            // contabilizacion_conceptos_cuentas_contabilizacion
            if (rtrim($pathinfo, '/') === '/facturacion/contabilizar_concepto/cuentas') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'contabilizacion_conceptos_cuentas_contabilizacion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ContabilizarConceptosController::consultarCuentasAction',  '_route' => 'contabilizacion_conceptos_cuentas_contabilizacion',);
            }

            // contabilizacion_conceptos_contabilizacion_actualizar
            if (rtrim($pathinfo, '/') === '/facturacion/contabilizar_concepto/actualizar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'contabilizacion_conceptos_contabilizacion_actualizar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ContabilizarConceptosController::actualizarContabilizacionConceptoAction',  '_route' => 'contabilizacion_conceptos_contabilizacion_actualizar',);
            }

            if (0 === strpos($pathinfo, '/facturacion/contabilizar_concepto/obtener')) {
                // contabilizacion_conceptos_contabilizacion_documentos
                if (rtrim($pathinfo, '/') === '/facturacion/contabilizar_concepto/obtener/documentos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'contabilizacion_conceptos_contabilizacion_documentos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ContabilizarConceptosController::consultarDocumentosAction',  '_route' => 'contabilizacion_conceptos_contabilizacion_documentos',);
                }

                // contabilizacion_conceptos_contabilizacion_empresasconvenio
                if (rtrim($pathinfo, '/') === '/facturacion/contabilizar_concepto/obtener/empresas_convenio') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'contabilizacion_conceptos_contabilizacion_empresasconvenio');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ContabilizarConceptosController::consultarEmpresasConvenioAction',  '_route' => 'contabilizacion_conceptos_contabilizacion_empresasconvenio',);
                }

                // contabilizacion_conceptos_contabilizacion_tiposdocumentos
                if (rtrim($pathinfo, '/') === '/facturacion/contabilizar_concepto/obtener/tipodocumentos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'contabilizacion_conceptos_contabilizacion_tiposdocumentos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ContabilizarConceptosController::consultarTipoDocumentoAction',  '_route' => 'contabilizacion_conceptos_contabilizacion_tiposdocumentos',);
                }

                // contabilizacion_conceptos_contabilizacion_medio_pago
                if (rtrim($pathinfo, '/') === '/facturacion/contabilizar_concepto/obtener/medio_pago') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'contabilizacion_conceptos_contabilizacion_medio_pago');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ContabilizarConceptosController::obtenerMediosPagoAction',  '_route' => 'contabilizacion_conceptos_contabilizacion_medio_pago',);
                }

                if (0 === strpos($pathinfo, '/facturacion/contabilizar_concepto/obtener/c')) {
                    // contabilizacion_conceptos_obtener_causion_contable
                    if (rtrim($pathinfo, '/') === '/facturacion/contabilizar_concepto/obtener/causioncontable') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'contabilizacion_conceptos_obtener_causion_contable');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ContabilizarConceptosController::obtenerCausionContableAction',  '_route' => 'contabilizacion_conceptos_obtener_causion_contable',);
                    }

                    // contabilizacion_conceptos_obtener_consignacion
                    if (rtrim($pathinfo, '/') === '/facturacion/contabilizar_concepto/obtener/consignacion') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'contabilizacion_conceptos_obtener_consignacion');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ContabilizarConceptosController::obtenerConsignacionAction',  '_route' => 'contabilizacion_conceptos_obtener_consignacion',);
                    }

                }

            }

        }

        if (0 === strpos($pathinfo, '/cartera/castigada/proceso')) {
            // facturacion_procesar_cartera_castigada
            if (rtrim($pathinfo, '/') === '/cartera/castigada/proceso') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_procesar_cartera_castigada');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoCarteraCastigadaController::IndexAction',  '_route' => 'facturacion_procesar_cartera_castigada',);
            }

            // facturacion_procesar_cartera_castigada_ejecucion
            if (rtrim($pathinfo, '/') === '/cartera/castigada/proceso/ejecutar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_procesar_cartera_castigada_ejecucion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoCarteraCastigadaController::ProcesarCarteraAction',  '_route' => 'facturacion_procesar_cartera_castigada_ejecucion',);
            }

            if (0 === strpos($pathinfo, '/cartera/castigada/proceso/progreso')) {
                // facturacion_procesar_cartera_castigada_estado
                if (rtrim($pathinfo, '/') === '/cartera/castigada/proceso/progreso') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_procesar_cartera_castigada_estado');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoCarteraCastigadaController::ObtenerEstadoCarteraCastigadaAction',  '_route' => 'facturacion_procesar_cartera_castigada_estado',);
                }

                // facturacion_procesar_cartera_castigada_proceso_estado
                if (rtrim($pathinfo, '/') === '/cartera/castigada/proceso/progreso/programa') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_procesar_cartera_castigada_proceso_estado');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoCarteraCastigadaController::ObtenerProcesoCarteraCastigadaAction',  '_route' => 'facturacion_procesar_cartera_castigada_proceso_estado',);
                }

            }

        }

        if (0 === strpos($pathinfo, '/facturacion')) {
            if (0 === strpos($pathinfo, '/facturacion/importar_facturas')) {
                // facturacion_importar_facturas
                if (rtrim($pathinfo, '/') === '/facturacion/importar_facturas') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_importar_facturas');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ImportarFacturasController::IndexAction',  '_route' => 'facturacion_importar_facturas',);
                }

                // facturacion_importar_facturas_cargar_archivos
                if (rtrim($pathinfo, '/') === '/facturacion/importar_facturas/cargar_archivos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_importar_facturas_cargar_archivos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ImportarFacturasController::subirArchivosImportacionAction',  '_route' => 'facturacion_importar_facturas_cargar_archivos',);
                }

                // facturacion_importar_facturas_progreso
                if (rtrim($pathinfo, '/') === '/facturacion/importar_facturas/progreso') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_importar_facturas_progreso');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ImportarFacturasController::consultarProgresoAction',  '_route' => 'facturacion_importar_facturas_progreso',);
                }

                // facturacion_importar_facturas_resumen
                if (rtrim($pathinfo, '/') === '/facturacion/importar_facturas/resumen') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_importar_facturas_resumen');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ImportarFacturasController::consultarResumenAction',  '_route' => 'facturacion_importar_facturas_resumen',);
                }

                // facturacion_importar_cancelar_importacion
                if (rtrim($pathinfo, '/') === '/facturacion/importar_facturas/cancelar_importacion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_importar_cancelar_importacion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ImportarFacturasController::cancelarImportacionAction',  '_route' => 'facturacion_importar_cancelar_importacion',);
                }

                if (0 === strpos($pathinfo, '/facturacion/importar_facturas_cusiana')) {
                    // facturacion_importar_facturas_cusiana
                    if (rtrim($pathinfo, '/') === '/facturacion/importar_facturas_cusiana') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_importar_facturas_cusiana');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ImportarFacturasCusianaController::IndexAction',  '_route' => 'facturacion_importar_facturas_cusiana',);
                    }

                    // facturacion_importar_facturas_cargar_archivos_cusiana
                    if (rtrim($pathinfo, '/') === '/facturacion/importar_facturas_cusiana/cargar_archivos') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_importar_facturas_cargar_archivos_cusiana');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ImportarFacturasCusianaController::subirArchivosImportacionAction',  '_route' => 'facturacion_importar_facturas_cargar_archivos_cusiana',);
                    }

                    // facturacion_importar_facturas_progreso_cusiana
                    if (rtrim($pathinfo, '/') === '/facturacion/importar_facturas_cusiana/progreso') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_importar_facturas_progreso_cusiana');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ImportarFacturasCusianaController::consultarProgresoAction',  '_route' => 'facturacion_importar_facturas_progreso_cusiana',);
                    }

                    // facturacion_importar_facturas_resumen_cusiana
                    if (rtrim($pathinfo, '/') === '/facturacion/importar_facturas_cusiana/resumen') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_importar_facturas_resumen_cusiana');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ImportarFacturasCusianaController::consultarResumenAction',  '_route' => 'facturacion_importar_facturas_resumen_cusiana',);
                    }

                    // facturacion_importar_cancelar_importacion_cusiana
                    if (rtrim($pathinfo, '/') === '/facturacion/importar_facturas_cusiana/cancelar_importacion') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_importar_cancelar_importacion_cusiana');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ImportarFacturasCusianaController::cancelarImportacionAction',  '_route' => 'facturacion_importar_cancelar_importacion_cusiana',);
                    }

                    // facturacion_importar_asigna_numero_facturas_cusiana
                    if (rtrim($pathinfo, '/') === '/facturacion/importar_facturas_cusiana/asigna_numerofacturas') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_importar_asigna_numero_facturas_cusiana');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ImportarFacturasCusianaController::asignaNumeroFacturasAction',  '_route' => 'facturacion_importar_asigna_numero_facturas_cusiana',);
                    }

                }

            }

            // ejecutar_proceso_facturacion
            if (rtrim($pathinfo, '/') === '/facturacion/ejecutar_proceso') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'ejecutar_proceso_facturacion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoFacturacionController::indexAction',  '_route' => 'ejecutar_proceso_facturacion',);
            }

            // ejecutar_proceso_facturacion_procesar
            if (rtrim($pathinfo, '/') === '/facturacion/procesar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'ejecutar_proceso_facturacion_procesar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoFacturacionController::procesarAction',  '_route' => 'ejecutar_proceso_facturacion_procesar',);
            }

            if (0 === strpos($pathinfo, '/facturacion/suscripciones')) {
                // ejecutar_proceso_facturacion_suscripciones
                if (rtrim($pathinfo, '/') === '/facturacion/suscripciones') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'ejecutar_proceso_facturacion_suscripciones');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoFacturacionController::getSuscripcionesAction',  '_route' => 'ejecutar_proceso_facturacion_suscripciones',);
                }

                if (0 === strpos($pathinfo, '/facturacion/suscripciones/liquidar')) {
                    // ejecutar_proceso_facturacion_suscripciones_liquidar
                    if (rtrim($pathinfo, '/') === '/facturacion/suscripciones/liquidar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'ejecutar_proceso_facturacion_suscripciones_liquidar');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoFacturacionController::liquidarAction',  '_route' => 'ejecutar_proceso_facturacion_suscripciones_liquidar',);
                    }

                    // ejecutar_proceso_facturacion_suscripciones_liquidar_varias_suscripciones
                    if (rtrim($pathinfo, '/') === '/facturacion/suscripciones/liquidarvariassuscripciones') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'ejecutar_proceso_facturacion_suscripciones_liquidar_varias_suscripciones');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoFacturacionController::liquidarVariasSuscripcionesAction',  '_route' => 'ejecutar_proceso_facturacion_suscripciones_liquidar_varias_suscripciones',);
                    }

                }

            }

            if (0 === strpos($pathinfo, '/facturacion/ejecutar_proceso')) {
                // ejecutar_proceso_facturacion_ejecutar_reporte_pre_liquidacion
                if (rtrim($pathinfo, '/') === '/facturacion/ejecutar_proceso/reporte') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'ejecutar_proceso_facturacion_ejecutar_reporte_pre_liquidacion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoFacturacionController::getReportePreLiquidacionAction',  '_route' => 'ejecutar_proceso_facturacion_ejecutar_reporte_pre_liquidacion',);
                }

                // ejecutar_proceso_facturacion_progreso
                if ($pathinfo === '/facturacion/ejecutar_proceso/progreso') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoFacturacionController::getProgresoProcesoAction',  '_route' => 'ejecutar_proceso_facturacion_progreso',);
                }

                // ejecutar_proceso_facturacion_aprobar
                if (rtrim($pathinfo, '/') === '/facturacion/ejecutar_proceso/aprobar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'ejecutar_proceso_facturacion_aprobar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoFacturacionController::aprobarFacturacionAction',  '_route' => 'ejecutar_proceso_facturacion_aprobar',);
                }

                // ejecutar_proceso_facturacion_errores
                if (rtrim($pathinfo, '/') === '/facturacion/ejecutar_proceso/resultado') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'ejecutar_proceso_facturacion_errores');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoFacturacionController::getResultadoAction',  '_route' => 'ejecutar_proceso_facturacion_errores',);
                }

                // ejecutar_proceso_facturacion_eliminar_liquidacion
                if (rtrim($pathinfo, '/') === '/facturacion/ejecutar_proceso/eliminar_liquidacion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'ejecutar_proceso_facturacion_eliminar_liquidacion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoFacturacionController::eliminarLiquidacionAction',  '_route' => 'ejecutar_proceso_facturacion_eliminar_liquidacion',);
                }

            }

        }

        if (0 === strpos($pathinfo, '/cartera/c')) {
            if (0 === strpos($pathinfo, '/cartera/castigada/suscripcion')) {
                // facturacion_procesar_cartera_castigada_suscripcion
                if (rtrim($pathinfo, '/') === '/cartera/castigada/suscripcion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_procesar_cartera_castigada_suscripcion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoCarteraCastigadaSuscripcionController::IndexAction',  '_route' => 'facturacion_procesar_cartera_castigada_suscripcion',);
                }

                // facturacion_procesar_cartera_castigada_suscripcion_cargar
                if (rtrim($pathinfo, '/') === '/cartera/castigada/suscripcion/cargar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_procesar_cartera_castigada_suscripcion_cargar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoCarteraCastigadaSuscripcionController::FiltrarSuscripcionAction',  '_route' => 'facturacion_procesar_cartera_castigada_suscripcion_cargar',);
                }

                // facturacion_procesar_cartera_castigada_suscripcion_procesar
                if (rtrim($pathinfo, '/') === '/cartera/castigada/suscripcion/procesar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_procesar_cartera_castigada_suscripcion_procesar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoCarteraCastigadaSuscripcionController::ProcesarAction',  '_route' => 'facturacion_procesar_cartera_castigada_suscripcion_procesar',);
                }

                // facturacion_procesar_cartera_castigada_suscripcion_validar_usuario
                if (rtrim($pathinfo, '/') === '/cartera/castigada/suscripcion/validar/usuario') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_procesar_cartera_castigada_suscripcion_validar_usuario');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoCarteraCastigadaSuscripcionController::ValidarUsuarioAction',  '_route' => 'facturacion_procesar_cartera_castigada_suscripcion_validar_usuario',);
                }

            }

            if (0 === strpos($pathinfo, '/cartera/condonar/cartera_c')) {
                if (0 === strpos($pathinfo, '/cartera/condonar/cartera_corriente')) {
                    // cartera_condonar_cartera_corriente
                    if (rtrim($pathinfo, '/') === '/cartera/condonar/cartera_corriente') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'cartera_condonar_cartera_corriente');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CondonarCarteraCorrienteController::IndexAction',  '_route' => 'cartera_condonar_cartera_corriente',);
                    }

                    if (0 === strpos($pathinfo, '/cartera/condonar/cartera_corriente/obtener_')) {
                        // cartera_condonar_cartera_corriente_municipios
                        if ($pathinfo === '/cartera/condonar/cartera_corriente/obtener_municipios') {
                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CondonarCarteraCorrienteController::getMunicipiosAction',  '_route' => 'cartera_condonar_cartera_corriente_municipios',);
                        }

                        // cartera_condonar_cartera_corriente_suscripcion
                        if ($pathinfo === '/cartera/condonar/cartera_corriente/obtener_suscripcion') {
                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CondonarCarteraCorrienteController::getSuscripcionAction',  '_route' => 'cartera_condonar_cartera_corriente_suscripcion',);
                        }

                        // cartera_condonar_cartera_corriente_facturas
                        if ($pathinfo === '/cartera/condonar/cartera_corriente/obtener_facturas') {
                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CondonarCarteraCorrienteController::getFacturasSuscripcionAction',  '_route' => 'cartera_condonar_cartera_corriente_facturas',);
                        }

                    }

                    // cartera_condonar_cartera_corriente_grabar
                    if ($pathinfo === '/cartera/condonar/cartera_corriente/generar_condonacion') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CondonarCarteraCorrienteController::generarCondonacionAction',  '_route' => 'cartera_condonar_cartera_corriente_grabar',);
                    }

                    // cartera_condonar_cartera_corriente_permiso_botones_facturas
                    if ($pathinfo === '/cartera/condonar/cartera_corriente/consultar_permisos_botones_condonacion') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CondonarCarteraCorrienteController::consultarPermisosBotonesCondonacionAction',  '_route' => 'cartera_condonar_cartera_corriente_permiso_botones_facturas',);
                    }

                    if (0 === strpos($pathinfo, '/cartera/condonar/cartera_corriente/obtener_facturas_')) {
                        // cartera_condonar_cartera_corriente_obtener_facturas_IntCorriente
                        if ($pathinfo === '/cartera/condonar/cartera_corriente/obtener_facturas_IntCorriente') {
                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CondonarCarteraCorrienteController::getFacturasIntCorrienteSuscripcionAction',  '_route' => 'cartera_condonar_cartera_corriente_obtener_facturas_IntCorriente',);
                        }

                        // cartera_condonar_cartera_corriente_obtener_facturas_condonadas
                        if ($pathinfo === '/cartera/condonar/cartera_corriente/obtener_facturas_condonadas') {
                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CondonarCarteraCorrienteController::getFacturasCondonadasAction',  '_route' => 'cartera_condonar_cartera_corriente_obtener_facturas_condonadas',);
                        }

                    }

                    // cartera_condonar_cartera_corriente_consultar_restriccion
                    if ($pathinfo === '/cartera/condonar/cartera_corriente/consultar_restriccion') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CondonarCarteraCorrienteController::consultarRestriccionAction',  '_route' => 'cartera_condonar_cartera_corriente_consultar_restriccion',);
                    }

                }

                if (0 === strpos($pathinfo, '/cartera/condonar/cartera_castigada')) {
                    // cartera_condonar_cartera_castigada
                    if (rtrim($pathinfo, '/') === '/cartera/condonar/cartera_castigada') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'cartera_condonar_cartera_castigada');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CondonarCarteraCastigadaController::IndexAction',  '_route' => 'cartera_condonar_cartera_castigada',);
                    }

                    // cartera_condonar_cartera_castigada_suscripcion
                    if (rtrim($pathinfo, '/') === '/cartera/condonar/cartera_castigada/filtrar_suscripcion') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'cartera_condonar_cartera_castigada_suscripcion');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CondonarCarteraCastigadaController::FiltrarSuscripcionAction',  '_route' => 'cartera_condonar_cartera_castigada_suscripcion',);
                    }

                    // cartera_condonar_cartera_castigada_listar_facturas
                    if (rtrim($pathinfo, '/') === '/cartera/condonar/cartera_castigada/verfacturas') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'cartera_condonar_cartera_castigada_listar_facturas');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CondonarCarteraCastigadaController::cargarFacturasCastigadasAction',  '_route' => 'cartera_condonar_cartera_castigada_listar_facturas',);
                    }

                    // cartera_condonar_cartera_castigada_listar_concepto_factura
                    if ($pathinfo === '/cartera/condonar/cartera_castigada/concepto/factura') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CondonarCarteraCastigadaController::listarConceptosFacturaAction',  '_route' => 'cartera_condonar_cartera_castigada_listar_concepto_factura',);
                    }

                    // cartera_condonar_cartera_castigada_procesar_facturas
                    if (rtrim($pathinfo, '/') === '/cartera/condonar/cartera_castigada/procesar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'cartera_condonar_cartera_castigada_procesar_facturas');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CondonarCarteraCastigadaController::procesarCarteraCastigadaAction',  '_route' => 'cartera_condonar_cartera_castigada_procesar_facturas',);
                    }

                    // cartera_condonar_cartera_castigada_permiso_botones_facturas
                    if ($pathinfo === '/cartera/condonar/cartera_castigada/consultar_castigada_permisos_botones_condonacion') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CondonarCarteraCastigadaController::consultarPermisosBotonesCondonacionAction',  '_route' => 'cartera_condonar_cartera_castigada_permiso_botones_facturas',);
                    }

                    // cartera_condonar_cartera_castigada_obtener_facturas_castigada_IntCorriente
                    if ($pathinfo === '/cartera/condonar/cartera_castigada/obtener_facturas_castigada_IntCorriente') {
                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\CondonarCarteraCastigadaController::getFacturasIntCorrienteSuscripcionAction',  '_route' => 'cartera_condonar_cartera_castigada_obtener_facturas_castigada_IntCorriente',);
                    }

                }

            }

        }

        if (0 === strpos($pathinfo, '/facturacion')) {
            if (0 === strpos($pathinfo, '/facturacion/notas_')) {
                if (0 === strpos($pathinfo, '/facturacion/notas_automaticas')) {
                    // facturacion_notas_automaticas
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::IndexAction',  '_route' => 'facturacion_notas_automaticas',);
                    }

                    // facturacion_notas_automaticas_suscripcion
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/buscar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_suscripcion');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::buscarSuscripcionAction',  '_route' => 'facturacion_notas_automaticas_suscripcion',);
                    }

                    // facturacion_notas_automaticas_municipios
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/municipios') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_municipios');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::getMunicipiosAction',  '_route' => 'facturacion_notas_automaticas_municipios',);
                    }

                    // facturacion_notas_automaticas_barrios
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/barrios') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_barrios');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\GestionarLiquidacionController::getBarriosAction',  '_route' => 'facturacion_notas_automaticas_barrios',);
                    }

                    if (0 === strpos($pathinfo, '/facturacion/notas_automaticas/facturas')) {
                        // facturacion_notas_automaticas_facturas
                        if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/facturas') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_facturas');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::getFacturasAction',  '_route' => 'facturacion_notas_automaticas_facturas',);
                        }

                        // facturacion_notas_automaticas_facturas_filtro
                        if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/facturas/filtrar') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_facturas_filtro');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::getFacturaConFiltroAction',  '_route' => 'facturacion_notas_automaticas_facturas_filtro',);
                        }

                        // facturacion_notas_automaticas_facturas_detalles
                        if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/facturas/detalles') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_facturas_detalles');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::getDetalleFacturaAction',  '_route' => 'facturacion_notas_automaticas_facturas_detalles',);
                        }

                    }

                    // facturacion_notas_automaticas_tipo_documento
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/tiposdocumentos') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_tipo_documento');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::getTiposDocumentosAction',  '_route' => 'facturacion_notas_automaticas_tipo_documento',);
                    }

                    // facturacion_notas_automaticas_documento
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/documentos') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_documento');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::getDocumentosAction',  '_route' => 'facturacion_notas_automaticas_documento',);
                    }

                    if (0 === strpos($pathinfo, '/facturacion/notas_automaticas/conceptos')) {
                        // facturacion_notas_automaticas_concepto
                        if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/conceptos') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_concepto');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::getConceptoAction',  '_route' => 'facturacion_notas_automaticas_concepto',);
                        }

                        // facturacion_notas_automaticas_concepto_complete
                        if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/conceptos/complete') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_concepto_complete');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::getConceptoAutocompleteAction',  '_route' => 'facturacion_notas_automaticas_concepto_complete',);
                        }

                    }

                    // facturacion_notas_automaticas_liquidacion
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/liquidacion') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_liquidacion');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::getLiquidacionAction',  '_route' => 'facturacion_notas_automaticas_liquidacion',);
                    }

                    // facturacion_notas_automaticas_procesar
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/procesar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_procesar');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::procesarFacturasAction',  '_route' => 'facturacion_notas_automaticas_procesar',);
                    }

                    // facturacion_notas_automaticas_cargar_archivo
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/archivo') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_cargar_archivo');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ExportarArchivoController::indexAction',  '_route' => 'facturacion_notas_automaticas_cargar_archivo',);
                    }

                    // facturacion_notas_automaticas_verificar_cambios
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/verificar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_verificar_cambios');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::verificarCambiosAction',  '_route' => 'facturacion_notas_automaticas_verificar_cambios',);
                    }

                    // facturacion_notas_automaticas_consultar_proceso
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/consultar_proceso') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_consultar_proceso');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::consultarProcesoAction',  '_route' => 'facturacion_notas_automaticas_consultar_proceso',);
                    }

                    if (0 === strpos($pathinfo, '/facturacion/notas_automaticas/a')) {
                        // facturacion_notas_automaticas_cargar_archivo_factura
                        if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/archivofactura') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_cargar_archivo_factura');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ExportarArchivoController::facturasOriginalesAction',  '_route' => 'facturacion_notas_automaticas_cargar_archivo_factura',);
                        }

                        // facturacion_notas_automaticas_aplicar
                        if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/aplicar') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_aplicar');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::aplicarNotasAction',  '_route' => 'facturacion_notas_automaticas_aplicar',);
                        }

                    }

                    // facturacion_notas_automaticas_motivos
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/motivos') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_motivos');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::motivosNotasAction',  '_route' => 'facturacion_notas_automaticas_motivos',);
                    }

                    // facturacion_notas_automaticas_errores
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/errores') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_errores');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::getListaErroresAction',  '_route' => 'facturacion_notas_automaticas_errores',);
                    }

                    // facturacion_notas_automaticas_directa_tipo_documentos
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/tiposdocumentos') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_directa_tipo_documentos');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::getTipoDocumentosAction',  '_route' => 'facturacion_notas_automaticas_directa_tipo_documentos',);
                    }

                    // facturacion_notas_automaticas_directa_eliminar_tablas
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/eliminartablas') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_directa_eliminar_tablas');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::eliminarTablasAction',  '_route' => 'facturacion_notas_automaticas_directa_eliminar_tablas',);
                    }

                    if (0 === strpos($pathinfo, '/facturacion/notas_automaticas/con')) {
                        // facturacion_notas_automaticas_directa_concepto_relacionados
                        if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/conceptosrelacionados') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_directa_concepto_relacionados');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::consultarConceptosRelacionadosAction',  '_route' => 'facturacion_notas_automaticas_directa_concepto_relacionados',);
                        }

                        // facturacion_notas_automaticas_control_combo_contabilizacion
                        if (rtrim($pathinfo, '/') === '/facturacion/notas_automaticas/controlcombocontabilizacion') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_control_combo_contabilizacion');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasAutomaticasController::controlComboContabilizacionAction',  '_route' => 'facturacion_notas_automaticas_control_combo_contabilizacion',);
                        }

                    }

                }

                if (0 === strpos($pathinfo, '/facturacion/notas_calculada')) {
                    // facturacion_notas_automaticas_calculada
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_calculada') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_calculada');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasCalculadaController::indexAction',  '_route' => 'facturacion_notas_automaticas_calculada',);
                    }

                    // facturacion_notas_automaticas_calculada_tipo_documento
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_calculada/tiposdocumentos') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_calculada_tipo_documento');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasCalculadaController::getTiposDocumentosAction',  '_route' => 'facturacion_notas_automaticas_calculada_tipo_documento',);
                    }

                    // facturacion_notas_automaticas_calculada_documento
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_calculada/documentos') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_calculada_documento');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasCalculadaController::getDocumentosAction',  '_route' => 'facturacion_notas_automaticas_calculada_documento',);
                    }

                    // facturacion_notas_automaticas_calculada_liquidacion
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_calculada/liquidacion') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_calculada_liquidacion');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasCalculadaController::getLiquidacionAction',  '_route' => 'facturacion_notas_automaticas_calculada_liquidacion',);
                    }

                    // facturacion_notas_automaticas_calculada_municipios
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_calculada/municipios') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_calculada_municipios');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasCalculadaController::getMunicipiosAction',  '_route' => 'facturacion_notas_automaticas_calculada_municipios',);
                    }

                    // facturacion_notas_automaticas_calculada_facturas
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_calculada/facturas') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_calculada_facturas');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasCalculadaController::getFacturasAction',  '_route' => 'facturacion_notas_automaticas_calculada_facturas',);
                    }

                    // facturacion_notas_automaticas_calculada_eliminar
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_calculada/eliminartablas') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_calculada_eliminar');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasCalculadaController::eliminarAction',  '_route' => 'facturacion_notas_automaticas_calculada_eliminar',);
                    }

                    // facturacion_notas_automaticas_calculada_procesar
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_calculada/procesar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_calculada_procesar');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasCalculadaController::procesarAction',  '_route' => 'facturacion_notas_automaticas_calculada_procesar',);
                    }

                    // facturacion_notas_automaticas_calculada_progreso
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_calculada/consultar_proceso') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_calculada_progreso');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasCalculadaController::consultarProcesoAction',  '_route' => 'facturacion_notas_automaticas_calculada_progreso',);
                    }

                    // facturacion_notas_automaticas_calculada_errores
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_calculada/errores') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_calculada_errores');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasCalculadaController::getListaErroresAction',  '_route' => 'facturacion_notas_automaticas_calculada_errores',);
                    }

                    // facturacion_notas_automaticas_calculada_verificar
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_calculada/verificar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_calculada_verificar');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasCalculadaController::verificarAction',  '_route' => 'facturacion_notas_automaticas_calculada_verificar',);
                    }

                    if (0 === strpos($pathinfo, '/facturacion/notas_calculada/exportar')) {
                        // facturacion_notas_automaticas_calculada_exportar_original
                        if (rtrim($pathinfo, '/') === '/facturacion/notas_calculada/exportar/originales') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_calculada_exportar_original');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasCalculadaController::exportarOriginalAction',  '_route' => 'facturacion_notas_automaticas_calculada_exportar_original',);
                        }

                        // facturacion_notas_automaticas_calculada_exportar_notas
                        if (rtrim($pathinfo, '/') === '/facturacion/notas_calculada/exportar/notas') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_calculada_exportar_notas');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasCalculadaController::exportarNotasAction',  '_route' => 'facturacion_notas_automaticas_calculada_exportar_notas',);
                        }

                    }

                    // facturacion_notas_automaticas_calculada_aplicar
                    if (rtrim($pathinfo, '/') === '/facturacion/notas_calculada/aplicar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_notas_automaticas_calculada_aplicar');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasCalculadaController::aplicarNotasAction',  '_route' => 'facturacion_notas_automaticas_calculada_aplicar',);
                    }

                }

            }

            if (0 === strpos($pathinfo, '/facturacion/fes')) {
                // facturacion_fes
                if (rtrim($pathinfo, '/') === '/facturacion/fes') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_fes');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FesController::indexAction',  '_route' => 'facturacion_fes',);
                }

                // facturacion_fes_generar_plano
                if (rtrim($pathinfo, '/') === '/facturacion/fes/generar_plano') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_fes_generar_plano');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FesController::generarPlanoAction',  '_route' => 'facturacion_fes_generar_plano',);
                }

                if (0 === strpos($pathinfo, '/facturacion/fes/c')) {
                    if (0 === strpos($pathinfo, '/facturacion/fes/consultar_')) {
                        // facturacion_fes_consultar_proceso
                        if (rtrim($pathinfo, '/') === '/facturacion/fes/consultar_proceso') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'facturacion_fes_consultar_proceso');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FesController::consultarProcesoAction',  '_route' => 'facturacion_fes_consultar_proceso',);
                        }

                        // facturacion_fes_consultar_archivo
                        if (rtrim($pathinfo, '/') === '/facturacion/fes/consultar_archivos') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'facturacion_fes_consultar_archivo');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FesController::consultarArchivosAction',  '_route' => 'facturacion_fes_consultar_archivo',);
                        }

                    }

                    if (0 === strpos($pathinfo, '/facturacion/fes/cargar')) {
                        // facturacion_fes_cargar
                        if (rtrim($pathinfo, '/') === '/facturacion/fes/cargar') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'facturacion_fes_cargar');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FesController::cargarAction',  '_route' => 'facturacion_fes_cargar',);
                        }

                        // facturacion_fes_cargar_invocarWebservice
                        if (rtrim($pathinfo, '/') === '/facturacion/fes/cargar/invocarws') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'facturacion_fes_cargar_invocarWebservice');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FesController::invocarWebServiceAction',  '_route' => 'facturacion_fes_cargar_invocarWebservice',);
                        }

                        // facturacion_fes_cargar_consultar_proceso
                        if (rtrim($pathinfo, '/') === '/facturacion/fes/cargar/consultar_proceso') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'facturacion_fes_cargar_consultar_proceso');
                            }

                            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FesController::consultarProcesoCargaAction',  '_route' => 'facturacion_fes_cargar_consultar_proceso',);
                        }

                    }

                }

            }

        }

        if (0 === strpos($pathinfo, '/contabilizacion/exportar_contablizacion')) {
            // facturacion_exportar_contabilizacion
            if (rtrim($pathinfo, '/') === '/contabilizacion/exportar_contablizacion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_exportar_contabilizacion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ExportarContabilizacionController::indexAction',  '_route' => 'facturacion_exportar_contabilizacion',);
            }

            // facturacion_exportar_contabilizacion_webservice
            if (rtrim($pathinfo, '/') === '/contabilizacion/exportar_contablizacion/aprobar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_exportar_contabilizacion_webservice');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ExportarContabilizacionController::AprobarEncabezadoMovimientoContableAction',  '_route' => 'facturacion_exportar_contabilizacion_webservice',);
            }

            if (0 === strpos($pathinfo, '/contabilizacion/exportar_contablizacion/e')) {
                // facturacion_exportar_contabilizacion_eliminar
                if (rtrim($pathinfo, '/') === '/contabilizacion/exportar_contablizacion/eliminar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_exportar_contabilizacion_eliminar');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ExportarContabilizacionController::EliminarEncabezadoMovimientoContableAction',  '_route' => 'facturacion_exportar_contabilizacion_eliminar',);
                }

                // facturacion_exportar_contabilizacion_error
                if ($pathinfo === '/contabilizacion/exportar_contablizacion/error/excel') {
                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ExportarContabilizacionController::GenerarReporteReporteExcelAction',  '_route' => 'facturacion_exportar_contabilizacion_error',);
                }

            }

            // facturacion_exportar_contabilizacion_detalle_movimiento
            if (rtrim($pathinfo, '/') === '/contabilizacion/exportar_contablizacion/detalle/movimiento') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_exportar_contabilizacion_detalle_movimiento');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ExportarContabilizacionController::ObtenerReporteMovimientoErrorAction',  '_route' => 'facturacion_exportar_contabilizacion_detalle_movimiento',);
            }

            // facturacion_exportar_contabilizacion_regenerear
            if (rtrim($pathinfo, '/') === '/contabilizacion/exportar_contablizacion/regenerar/movimiento_contable') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_exportar_contabilizacion_regenerear');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ExportarContabilizacionController::regenerarMovimientoContableAction',  '_route' => 'facturacion_exportar_contabilizacion_regenerear',);
            }

            if (0 === strpos($pathinfo, '/contabilizacion/exportar_contablizacion/movimientos')) {
                // facturacion_exportar_contabilizacion_webservice_movimientos
                if (rtrim($pathinfo, '/') === '/contabilizacion/exportar_contablizacion/movimientos') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_exportar_contabilizacion_webservice_movimientos');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ExportarContabilizacionController::ObtenerDetalleMovimientoAction',  '_route' => 'facturacion_exportar_contabilizacion_webservice_movimientos',);
                }

                // facturacion_exportar_contabilizacion_webservice_movimientos_listado
                if (rtrim($pathinfo, '/') === '/contabilizacion/exportar_contablizacion/movimientos/listado') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_exportar_contabilizacion_webservice_movimientos_listado');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ExportarContabilizacionController::ObtenerMovimientoContablePorCicloAction',  '_route' => 'facturacion_exportar_contabilizacion_webservice_movimientos_listado',);
                }

                // facturacion_exportar_contabilizacion_webservice_movimientos_CRON
                if (rtrim($pathinfo, '/') === '/contabilizacion/exportar_contablizacion/movimientos/cron') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_exportar_contabilizacion_webservice_movimientos_CRON');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ExportarContabilizacionController::ProcesarMovimientosCronAction',  '_route' => 'facturacion_exportar_contabilizacion_webservice_movimientos_CRON',);
                }

            }

        }

        if (0 === strpos($pathinfo, '/facturacion/notas_tipo')) {
            // facturacion_notas_tipo_uso
            if (rtrim($pathinfo, '/') === '/facturacion/notas_tipo') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_notas_tipo_uso');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasTipoUsoController::indexAction',  '_route' => 'facturacion_notas_tipo_uso',);
            }

            // facturacion_notas_tipo_uso_suscripcion
            if (rtrim($pathinfo, '/') === '/facturacion/notas_tipo/buscar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_notas_tipo_uso_suscripcion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasTipoUsoController::consultarSuscripcionAction',  '_route' => 'facturacion_notas_tipo_uso_suscripcion',);
            }

            // facturacion_notas_tipo_uso_municipios
            if (rtrim($pathinfo, '/') === '/facturacion/notas_tipo/municipios') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_notas_tipo_uso_municipios');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasTipoUsoController::getMunicipiosAction',  '_route' => 'facturacion_notas_tipo_uso_municipios',);
            }

            // facturacion_notas_tipo_uso_facturas
            if (rtrim($pathinfo, '/') === '/facturacion/notas_tipo/consultar_facturas') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_notas_tipo_uso_facturas');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasTipoUsoController::getFacturasAction',  '_route' => 'facturacion_notas_tipo_uso_facturas',);
            }

            // facturacion_notas_tipo_uso_procesar
            if (rtrim($pathinfo, '/') === '/facturacion/notas_tipo/procesar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_notas_tipo_uso_procesar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasTipoUsoController::procesarNotaAction',  '_route' => 'facturacion_notas_tipo_uso_procesar',);
            }

            // facturacion_notas_tipo_uso_eliminar
            if (rtrim($pathinfo, '/') === '/facturacion/notas_tipo/eliminartablas') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_notas_tipo_uso_eliminar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasTipoUsoController::eliminarTablasAction',  '_route' => 'facturacion_notas_tipo_uso_eliminar',);
            }

            // facturacion_notas_tipo_uso_aplicar
            if (rtrim($pathinfo, '/') === '/facturacion/notas_tipo/aplicar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_notas_tipo_uso_aplicar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasTipoUsoController::aplicarNotasAction',  '_route' => 'facturacion_notas_tipo_uso_aplicar',);
            }

            // facturacion_notas_tipo_uso_detalle_factura
            if (rtrim($pathinfo, '/') === '/facturacion/notas_tipo/factura/detalles') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_notas_tipo_uso_detalle_factura');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasTipoUsoController::detallesFacturasAction',  '_route' => 'facturacion_notas_tipo_uso_detalle_factura',);
            }

        }

        if (0 === strpos($pathinfo, '/recaudos/impresiones')) {
            // autorizar_impresiones
            if (rtrim($pathinfo, '/') === '/recaudos/impresiones') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'autorizar_impresiones');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AutorizarImpresionesController::indexAction',  '_route' => 'autorizar_impresiones',);
            }

            // autorizar_impresiones_limite_impresiones_recaudo
            if (rtrim($pathinfo, '/') === '/recaudos/impresiones/limite_impresion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'autorizar_impresiones_limite_impresiones_recaudo');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AutorizarImpresionesController::getLimiteImpresionRecaudoAction',  '_route' => 'autorizar_impresiones_limite_impresiones_recaudo',);
            }

            if (0 === strpos($pathinfo, '/recaudos/impresiones/informacion_')) {
                // autorizar_impresiones_informacion_usuario
                if (rtrim($pathinfo, '/') === '/recaudos/impresiones/informacion_usuario') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'autorizar_impresiones_informacion_usuario');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AutorizarImpresionesController::getInfoUsuariosAction',  '_route' => 'autorizar_impresiones_informacion_usuario',);
                }

                // autorizar_impresiones_informacion_impresion_usuario
                if (rtrim($pathinfo, '/') === '/recaudos/impresiones/informacion_impresion_usuario') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'autorizar_impresiones_informacion_impresion_usuario');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AutorizarImpresionesController::getImpresionRecaudoUsuarioAction',  '_route' => 'autorizar_impresiones_informacion_impresion_usuario',);
                }

            }

            // autorizar_impresiones_registrar_impresion
            if (rtrim($pathinfo, '/') === '/recaudos/impresiones/registrar_impresion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'autorizar_impresiones_registrar_impresion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AutorizarImpresionesController::setImpresionesRecaudoUsuarioAutomaticoAction',  '_route' => 'autorizar_impresiones_registrar_impresion',);
            }

            // autorizar_impresiones_actualizar_impresion
            if (rtrim($pathinfo, '/') === '/recaudos/impresiones/actualizar_impresion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'autorizar_impresiones_actualizar_impresion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\AutorizarImpresionesController::setActualizarImpresionRecaudoAction',  '_route' => 'autorizar_impresiones_actualizar_impresion',);
            }

        }

        if (0 === strpos($pathinfo, '/lectura/modificar_lectura')) {
            // modificar_lecturas
            if (rtrim($pathinfo, '/') === '/lectura/modificar_lectura') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'modificar_lecturas');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarLecturaController::indexAction',  '_route' => 'modificar_lecturas',);
            }

            // modificar_lecturas_filtrar
            if (rtrim($pathinfo, '/') === '/lectura/modificar_lectura/filtrar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'modificar_lecturas_filtrar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarLecturaController::filtrarSuscripcionAction',  '_route' => 'modificar_lecturas_filtrar',);
            }

            // modificar_lecturas_obtener_informacion
            if (rtrim($pathinfo, '/') === '/lectura/modificar_lectura/obtener_informacion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'modificar_lecturas_obtener_informacion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarLecturaController::getInfoLecturaAction',  '_route' => 'modificar_lecturas_obtener_informacion',);
            }

            // modificar_lecturas_valida_tipo_uso_factura
            if (rtrim($pathinfo, '/') === '/lectura/modificar_lectura/valida_tipo_uso_factura') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'modificar_lecturas_valida_tipo_uso_factura');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarLecturaController::getInfoFacturaAction',  '_route' => 'modificar_lecturas_valida_tipo_uso_factura',);
            }

            // modificar_lecturas_cambiar_estado_anterior
            if (rtrim($pathinfo, '/') === '/lectura/modificar_lectura/cambiar_estado_anterior') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'modificar_lecturas_cambiar_estado_anterior');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarLecturaController::cambiarEstadoLecturaAnteriorAction',  '_route' => 'modificar_lecturas_cambiar_estado_anterior',);
            }

            // modificar_lecturas_registrar_modificacion_lectura
            if (rtrim($pathinfo, '/') === '/lectura/modificar_lectura/registrar_modificacion_lectura') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'modificar_lecturas_registrar_modificacion_lectura');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ModificarLecturaController::registrarModificacionLecturaAction',  '_route' => 'modificar_lecturas_registrar_modificacion_lectura',);
            }

        }

        if (0 === strpos($pathinfo, '/ventas/constructoras/amortizacion')) {
            // ventas_constructoras_amortizacion
            if (rtrim($pathinfo, '/') === '/ventas/constructoras/amortizacion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'ventas_constructoras_amortizacion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasGenerarAmortizacionController::indexAction',  '_route' => 'ventas_constructoras_amortizacion',);
            }

            // ventas_constructoras_amortizacion_procesar
            if (rtrim($pathinfo, '/') === '/ventas/constructoras/amortizacion/procesar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'ventas_constructoras_amortizacion_procesar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasGenerarAmortizacionController::ProcesarAction',  '_route' => 'ventas_constructoras_amortizacion_procesar',);
            }

        }

        if (0 === strpos($pathinfo, '/facturacion/notas_reclamacion')) {
            // facturacion_notas_reclamacion
            if (rtrim($pathinfo, '/') === '/facturacion/notas_reclamacion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_notas_reclamacion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasReclamacionController::IndexAction',  '_route' => 'facturacion_notas_reclamacion',);
            }

            // facturacion_notas_reclamacion_suscripcion
            if (rtrim($pathinfo, '/') === '/facturacion/notas_reclamacion/buscar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_notas_reclamacion_suscripcion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\SuscripcionesController::buscarSuscripcionAction',  '_route' => 'facturacion_notas_reclamacion_suscripcion',);
            }

            // facturacion_notas_reclamacion_municipios
            if (rtrim($pathinfo, '/') === '/facturacion/notas_reclamacion/municipios') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_notas_reclamacion_municipios');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasReclamacionController::getMunicipiosAction',  '_route' => 'facturacion_notas_reclamacion_municipios',);
            }

            // facturacion_notas_reclamacion_eliminar_sesion
            if (rtrim($pathinfo, '/') === '/facturacion/notas_reclamacion/eliminarsesion') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_notas_reclamacion_eliminar_sesion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasReclamacionController::eliminarProgramaActivoAction',  '_route' => 'facturacion_notas_reclamacion_eliminar_sesion',);
            }

            // facturacion_notas_reclamacion_notasr
            if (rtrim($pathinfo, '/') === '/facturacion/notas_reclamacion/notasr') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_notas_reclamacion_notasr');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasReclamacionController::getNotasRAction',  '_route' => 'facturacion_notas_reclamacion_notasr',);
            }

            // facturacion_notas_reclamacion_concepto_complete
            if (rtrim($pathinfo, '/') === '/facturacion/notas_reclamacion/conceptos/complete') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_notas_reclamacion_concepto_complete');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasReclamacionController::getConceptoAutocompleteAction',  '_route' => 'facturacion_notas_reclamacion_concepto_complete',);
            }

            if (0 === strpos($pathinfo, '/facturacion/notas_reclamacion/notasr')) {
                // facturacion_notas_reclamacion_filtro
                if (rtrim($pathinfo, '/') === '/facturacion/notas_reclamacion/notasr/filtrar') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_notas_reclamacion_filtro');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasReclamacionController::getNotasRConFiltroAction',  '_route' => 'facturacion_notas_reclamacion_filtro',);
                }

                // facturacion_notas_reclamacion_detalles
                if (rtrim($pathinfo, '/') === '/facturacion/notas_reclamacion/notasr/detalles') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_notas_reclamacion_detalles');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasReclamacionController::getDetalleNotasRAction',  '_route' => 'facturacion_notas_reclamacion_detalles',);
                }

            }

            // facturacion_notas_reclamacion_procesar
            if (rtrim($pathinfo, '/') === '/facturacion/notas_reclamacion/procesar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_notas_reclamacion_procesar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasReclamacionController::procesarNotasRAction',  '_route' => 'facturacion_notas_reclamacion_procesar',);
            }

            // facturacion_notas_Reclamacion_verificar_cambios
            if (rtrim($pathinfo, '/') === '/facturacion/notas_reclamacion/verificar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_notas_Reclamacion_verificar_cambios');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasReclamacionController::verificarCambiosAction',  '_route' => 'facturacion_notas_Reclamacion_verificar_cambios',);
            }

            // facturacion_notas_Reclamacion_aplicar
            if (rtrim($pathinfo, '/') === '/facturacion/notas_reclamacion/aplicar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_notas_Reclamacion_aplicar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\NotasReclamacionController::aplicarNotasAction',  '_route' => 'facturacion_notas_Reclamacion_aplicar',);
            }

        }

        // util_controlador
        if (rtrim($pathinfo, '/') === '/util/obtener_fecha') {
            if (substr($pathinfo, -1) !== '/') {
                return $this->redirect($pathinfo.'/', 'util_controlador');
            }

            return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\UtilController::obtenerFechaServidorAction',  '_route' => 'util_controlador',);
        }

        if (0 === strpos($pathinfo, '/facturacion')) {
            if (0 === strpos($pathinfo, '/facturacion/reporte_tarifas')) {
                // facturacion_reporte_tarifas
                if (rtrim($pathinfo, '/') === '/facturacion/reporte_tarifas') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'facturacion_reporte_tarifas');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\TarifasController::indexAction',  '_route' => 'facturacion_reporte_tarifas',);
                }

                if (0 === strpos($pathinfo, '/facturacion/reporte_tarifas/consultar')) {
                    // facturacion_reporte_tarifas_generar
                    if (rtrim($pathinfo, '/') === '/facturacion/reporte_tarifas/consultar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_reporte_tarifas_generar');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\TarifasController::consultarTarifasAction',  '_route' => 'facturacion_reporte_tarifas_generar',);
                    }

                    // facturacion_reporte_tarifas_generar_xls
                    if (rtrim($pathinfo, '/') === '/facturacion/reporte_tarifas/consultar_xls') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'facturacion_reporte_tarifas_generar_xls');
                        }

                        return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\TarifasController::consultarTarifasExcelAction',  '_route' => 'facturacion_reporte_tarifas_generar_xls',);
                    }

                }

            }

            // eliminar_facturas
            if (rtrim($pathinfo, '/') === '/facturacion/eliminar_facturas') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'eliminar_facturas');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\EliminarFacturasController::indexAction',  '_route' => 'eliminar_facturas',);
            }

            // eliminar_facturas_consultar_suscripcion
            if (rtrim($pathinfo, '/') === '/facturacion/consultar_suscriptor') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'eliminar_facturas_consultar_suscripcion');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\EliminarFacturasController::consultarSuscripcionAction',  '_route' => 'eliminar_facturas_consultar_suscripcion',);
            }

            if (0 === strpos($pathinfo, '/facturacion/eliminar_factura')) {
                // eliminar_facturas_factura_suscripcion
                if (rtrim($pathinfo, '/') === '/facturacion/eliminar_facturas/factura_suscripcion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'eliminar_facturas_factura_suscripcion');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\EliminarFacturasController::cargarFacturaSuscripcionAction',  '_route' => 'eliminar_facturas_factura_suscripcion',);
                }

                // registrar_eliminar_factura
                if (rtrim($pathinfo, '/') === '/facturacion/eliminar_factura_suscripcion') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'registrar_eliminar_factura');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\EliminarFacturasController::eliminarFacturaSuscripcionAction',  '_route' => 'registrar_eliminar_factura',);
                }

            }

        }

        if (0 === strpos($pathinfo, '/ventas')) {
            // financiacion_ventas_simulador
            if (rtrim($pathinfo, '/') === '/ventas/financiacion_simulador') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'financiacion_ventas_simulador');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\FinanciarVentaSimuladorController::indexAction',  '_route' => 'financiacion_ventas_simulador',);
            }

            // consulta_proyectos_padre_infra
            if (rtrim($pathinfo, '/') === '/ventas/consultar_proyectos_infra') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'consulta_proyectos_padre_infra');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ConstructorasController::consultarProyectosPadreAction',  '_route' => 'consulta_proyectos_padre_infra',);
            }

        }

        if (0 === strpos($pathinfo, '/barrios')) {
            // registro_barrios
            if (rtrim($pathinfo, '/') === '/barrios/registrar_barrio') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'registro_barrios');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarBarriosController::indexAction',  '_route' => 'registro_barrios',);
            }

            // consulta_barrios
            if (rtrim($pathinfo, '/') === '/barrios/consulta_barrio') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'consulta_barrios');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarBarriosController::consultaBarrioAction',  '_route' => 'consulta_barrios',);
            }

            // consulta_grabar_barrios
            if (rtrim($pathinfo, '/') === '/barrios/grabar_barrio') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'consulta_grabar_barrios');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarBarriosController::grabarBarrioAction',  '_route' => 'consulta_grabar_barrios',);
            }

            if (0 === strpos($pathinfo, '/barrios/rutas_')) {
                // consulta_rutas_Vinculadas
                if (rtrim($pathinfo, '/') === '/barrios/rutas_vinculadas') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'consulta_rutas_Vinculadas');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarBarriosController::rutasVinculadasAction',  '_route' => 'consulta_rutas_Vinculadas',);
                }

                // consulta_rutas_municipio
                if (rtrim($pathinfo, '/') === '/barrios/rutas_municipio') {
                    if (substr($pathinfo, -1) !== '/') {
                        return $this->redirect($pathinfo.'/', 'consulta_rutas_municipio');
                    }

                    return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\RegistrarBarriosController::rutasMunicipioAction',  '_route' => 'consulta_rutas_municipio',);
                }

            }

        }

        if (0 === strpos($pathinfo, '/cartera/financia_emergencia')) {
            // cartera_proceso_financia_emergencia
            if (rtrim($pathinfo, '/') === '/cartera/financia_emergencia') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'cartera_proceso_financia_emergencia');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoFinanciaEmergenciaController::indexAction',  '_route' => 'cartera_proceso_financia_emergencia',);
            }

            // cartera_proceso_financia_emergencia_municipio
            if (rtrim($pathinfo, '/') === '/cartera/financia_emergencia/municipio') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'cartera_proceso_financia_emergencia_municipio');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoFinanciaEmergenciaController::getMunicipiosAction',  '_route' => 'cartera_proceso_financia_emergencia_municipio',);
            }

            // cartera_proceso_financia_emergencia_generar
            if (rtrim($pathinfo, '/') === '/cartera/financia_emergencia/generar') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'cartera_proceso_financia_emergencia_generar');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoFinanciaEmergenciaController::generaProcesoFinanciaEmergenciaAction',  '_route' => 'cartera_proceso_financia_emergencia_generar',);
            }

            // cartera_proceso_financia_emergencia_proceso
            if (rtrim($pathinfo, '/') === '/cartera/financia_emergencia/proceso') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'cartera_proceso_financia_emergencia_proceso');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoFinanciaEmergenciaController::consultaProcesoAction',  '_route' => 'cartera_proceso_financia_emergencia_proceso',);
            }

            // cartera_proceso_financia_emergencia_resumen
            if (rtrim($pathinfo, '/') === '/cartera/financia_emergencia/consultar_resumen') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'cartera_proceso_financia_emergencia_resumen');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoFinanciaEmergenciaController::consultarResumenAction',  '_route' => 'cartera_proceso_financia_emergencia_resumen',);
            }

            // cartera_proceso_financia_emergencia_subirarchivo
            if (rtrim($pathinfo, '/') === '/cartera/financia_emergencia/subirarchivo_emergencia') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'cartera_proceso_financia_emergencia_subirarchivo');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ProcesoFinanciaEmergenciaController::subirArchivosImportacionEmergenciaAction',  '_route' => 'cartera_proceso_financia_emergencia_subirarchivo',);
            }

        }

        if (0 === strpos($pathinfo, '/facturacion/contacto')) {
            // facturacion_contacto
            if (rtrim($pathinfo, '/') === '/facturacion/contacto') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_contacto');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ContactoController::indexAction',  '_route' => 'facturacion_contacto',);
            }

            // facturacion_contacto_genera_plano
            if (rtrim($pathinfo, '/') === '/facturacion/contacto/generar_plano_contacto') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'facturacion_contacto_genera_plano');
                }

                return array (  '_controller' => 'Llanogas\\LlanogasBundle\\Controller\\ContactoController::generarPlanoContactoAction',  '_route' => 'facturacion_contacto_genera_plano',);
            }

        }

        if (0 === strpos($pathinfo, '/bioagricola')) {
            // bioagricola_bioagricola_homepage
            if (0 === strpos($pathinfo, '/bioagricola/hello') && preg_match('#^/bioagricola/hello/(?P<name>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'bioagricola_bioagricola_homepage')), array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\DefaultController::indexAction',));
            }

            if (0 === strpos($pathinfo, '/bioagricola/financiaciones')) {
                if (0 === strpos($pathinfo, '/bioagricola/financiaciones/importar')) {
                    // bioagricola_financiacion_importar
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'bioagricola_financiacion_importar');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarFinanciacionController::indexAction',  '_route' => 'bioagricola_financiacion_importar',);
                    }

                    // bioagricola_financiacion_importar_cargar
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar/cargar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'bioagricola_financiacion_importar_cargar');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarFinanciacionController::cargarAction',  '_route' => 'bioagricola_financiacion_importar_cargar',);
                    }

                    // importar_finaciacion_progreso
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar/progreso') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'importar_finaciacion_progreso');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarFinanciacionController::consultarProgresoAction',  '_route' => 'importar_finaciacion_progreso',);
                    }

                    // importar_finaciacion_resumen
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar/resumen') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'importar_finaciacion_resumen');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarFinanciacionController::consultarResumenAction',  '_route' => 'importar_finaciacion_resumen',);
                    }

                    // importar_finaciacion_eliminar_resumen
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar/eliminar_tabla') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'importar_finaciacion_eliminar_resumen');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarFinanciacionController::eliminarResumenAction',  '_route' => 'importar_finaciacion_eliminar_resumen',);
                    }

                    if (0 === strpos($pathinfo, '/bioagricola/financiaciones/importar_act')) {
                        // bioagricola_act_fin_importar
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar_act') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'bioagricola_act_fin_importar');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarActFinanciacionController::indexAction',  '_route' => 'bioagricola_act_fin_importar',);
                        }

                        // bioagricola_act_fin_importar_cargar
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar_act/cargar') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'bioagricola_act_fin_importar_cargar');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarActFinanciacionController::cargarAction',  '_route' => 'bioagricola_act_fin_importar_cargar',);
                        }

                        // importar_act_fin_progreso
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar_act/progreso') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'importar_act_fin_progreso');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarActFinanciacionController::consultarProgresoAction',  '_route' => 'importar_act_fin_progreso',);
                        }

                        // importar_act_fin_resumen
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar_act/resumen') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'importar_act_fin_resumen');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarActFinanciacionController::consultarResumenAction',  '_route' => 'importar_act_fin_resumen',);
                        }

                        // importar_act_fin_eliminar_resumen
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar_act/eliminar_tabla') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'importar_act_fin_eliminar_resumen');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarActFinanciacionController::eliminarResumenAction',  '_route' => 'importar_act_fin_eliminar_resumen',);
                        }

                    }

                }

                if (0 === strpos($pathinfo, '/bioagricola/financiaciones/aplicar_cv_dxd')) {
                    // bioagricola_dxd_fin_aplicar
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/aplicar_cv_dxd') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'bioagricola_dxd_fin_aplicar');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\AplicarCambiosDxDController::indexAction',  '_route' => 'bioagricola_dxd_fin_aplicar',);
                    }

                    // bioagricola_dxd_fin_importar_cargar
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/aplicar_cv_dxd/cargar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'bioagricola_dxd_fin_importar_cargar');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\AplicarCambiosDxDController::cargarAction',  '_route' => 'bioagricola_dxd_fin_importar_cargar',);
                    }

                    // importar_dxd_fin_progreso
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/aplicar_cv_dxd/progreso') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'importar_dxd_fin_progreso');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\AplicarCambiosDxDController::consultarProgresoAction',  '_route' => 'importar_dxd_fin_progreso',);
                    }

                    // importar_dxd_fin_resumen
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/aplicar_cv_dxd/resumen') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'importar_dxd_fin_resumen');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\AplicarCambiosDxDController::consultarResumenAction',  '_route' => 'importar_dxd_fin_resumen',);
                    }

                    // importar_dxd_fin_eliminar_resumen
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/aplicar_cv_dxd/eliminar_tabla') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'importar_dxd_fin_eliminar_resumen');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\AplicarCambiosDxDController::eliminarResumenAction',  '_route' => 'importar_dxd_fin_eliminar_resumen',);
                    }

                    if (0 === strpos($pathinfo, '/bioagricola/financiaciones/aplicar_cv_dxd/gen_')) {
                        // importar_dxd_fin_errores
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/aplicar_cv_dxd/gen_errores') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'importar_dxd_fin_errores');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\AplicarCambiosDxDController::GenerarErroresAction',  '_route' => 'importar_dxd_fin_errores',);
                        }

                        // importar_dxd_fin_saldos
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/aplicar_cv_dxd/gen_saldos') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'importar_dxd_fin_saldos');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\AplicarCambiosDxDController::GenerarsaldosAction',  '_route' => 'importar_dxd_fin_saldos',);
                        }

                    }

                }

                if (0 === strpos($pathinfo, '/bioagricola/financiaciones/importar_pagos')) {
                    // bioagricola_pag_fin_aplicar
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar_pagos') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'bioagricola_pag_fin_aplicar');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarPagosFinancController::indexAction',  '_route' => 'bioagricola_pag_fin_aplicar',);
                    }

                    // bioagricola_pag_fin_importar_cargar
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar_pagos/cargar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'bioagricola_pag_fin_importar_cargar');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarPagosFinancController::cargarAction',  '_route' => 'bioagricola_pag_fin_importar_cargar',);
                    }

                    // importar_pag_fin_progreso
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar_pagos/progreso') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'importar_pag_fin_progreso');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarPagosFinancController::consultarProgresoAction',  '_route' => 'importar_pag_fin_progreso',);
                    }

                    // importar_pag_fin_resumen
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar_pagos/resumen') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'importar_pag_fin_resumen');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarPagosFinancController::consultarResumenAction',  '_route' => 'importar_pag_fin_resumen',);
                    }

                    // importar_pag_fin_eliminar_resumen
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar_pagos/eliminar_tabla') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'importar_pag_fin_eliminar_resumen');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarPagosFinancController::eliminarResumenAction',  '_route' => 'importar_pag_fin_eliminar_resumen',);
                    }

                    if (0 === strpos($pathinfo, '/bioagricola/financiaciones/importar_pagos/gen_')) {
                        // importar_pag_fin_errores
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar_pagos/gen_errores') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'importar_pag_fin_errores');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarPagosFinancController::GenerarErroresAction',  '_route' => 'importar_pag_fin_errores',);
                        }

                        // importar_pag_fin_saldos
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar_pagos/gen_saldos') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'importar_pag_fin_saldos');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarPagosFinancController::GenerarsaldosAction',  '_route' => 'importar_pag_fin_saldos',);
                        }

                    }

                }

                if (0 === strpos($pathinfo, '/bioagricola/financiaciones/consultar')) {
                    // bioagricola_con_fin_esp
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/consultar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'bioagricola_con_fin_esp');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\ConsultarFinanciacionController::indexAction',  '_route' => 'bioagricola_con_fin_esp',);
                    }

                    // bioagricola_con_fin_esp_buscar
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/consultar/buscar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'bioagricola_con_fin_esp_buscar');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\ConsultarFinanciacionController::buscarDatosAction',  '_route' => 'bioagricola_con_fin_esp_buscar',);
                    }

                }

                if (0 === strpos($pathinfo, '/bioagricola/financiaciones/importar_porcentajes')) {
                    // bioagricola_porcentajes_apr_fin
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar_porcentajes') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'bioagricola_porcentajes_apr_fin');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarProcentajesAprController::indexAction',  '_route' => 'bioagricola_porcentajes_apr_fin',);
                    }

                    // bioagricola_porcentajes_apr_fin_cargar
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar_porcentajes/cargar') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'bioagricola_porcentajes_apr_fin_cargar');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarProcentajesAprController::cargarAction',  '_route' => 'bioagricola_porcentajes_apr_fin_cargar',);
                    }

                    // importar_porcentajes_apr_fin_progreso
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar_porcentajes/progreso') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'importar_porcentajes_apr_fin_progreso');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarProcentajesAprController::consultarProgresoAction',  '_route' => 'importar_porcentajes_apr_fin_progreso',);
                    }

                    // importar_porcentajes_apr_fin_resumen
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar_porcentajes/resumen') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'importar_porcentajes_apr_fin_resumen');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarProcentajesAprController::consultarResumenAction',  '_route' => 'importar_porcentajes_apr_fin_resumen',);
                    }

                    // importar_porcentajes_apr_fin_eliminar_resumen
                    if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/importar_porcentajes/consultaDatos') {
                        if (substr($pathinfo, -1) !== '/') {
                            return $this->redirect($pathinfo.'/', 'importar_porcentajes_apr_fin_eliminar_resumen');
                        }

                        return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\CargarProcentajesAprController::buscarDatosAction',  '_route' => 'importar_porcentajes_apr_fin_eliminar_resumen',);
                    }

                }

                if (0 === strpos($pathinfo, '/bioagricola/financiaciones/gen')) {
                    if (0 === strpos($pathinfo, '/bioagricola/financiaciones/generar_inf_apr')) {
                        // bioagricola_informe_apr
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/generar_inf_apr') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'bioagricola_informe_apr');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\GenerarInformeAprController::indexAction',  '_route' => 'bioagricola_informe_apr',);
                        }

                        // bioagricola_informe_apr_iniciar
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/generar_inf_apr/cargar') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'bioagricola_informe_apr_iniciar');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\GenerarInformeAprController::cargarAction',  '_route' => 'bioagricola_informe_apr_iniciar',);
                        }

                        // generar_inf_apr_proceso
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/generar_inf_apr/progreso') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'generar_inf_apr_proceso');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\GenerarInformeAprController::consultarProgresoAction',  '_route' => 'generar_inf_apr_proceso',);
                        }

                        // generar_inf_apr_resumen
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/generar_inf_apr/resumen') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'generar_inf_apr_resumen');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\GenerarInformeAprController::consultarResumenAction',  '_route' => 'generar_inf_apr_resumen',);
                        }

                        // generar_inf_apr_eliminar
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/generar_inf_apr/eliminar_tabla') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'generar_inf_apr_eliminar');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\GenerarInformeAprController::eliminarResumenAction',  '_route' => 'generar_inf_apr_eliminar',);
                        }

                        // generar_inf_informe
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/generar_inf_apr/generar') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'generar_inf_informe');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\GenerarInformeAprController::GenerarInformeAction',  '_route' => 'generar_inf_informe',);
                        }

                    }

                    if (0 === strpos($pathinfo, '/bioagricola/financiaciones/gen_amortiz')) {
                        // bioagricola_gen_amortiz
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/gen_amortiz') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'bioagricola_gen_amortiz');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\GenerarAmortizacionController::indexAction',  '_route' => 'bioagricola_gen_amortiz',);
                        }

                        // bioagricola_gen_amortiz_cargar
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/gen_amortiz/cargar') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'bioagricola_gen_amortiz_cargar');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\GenerarAmortizacionController::cargarAction',  '_route' => 'bioagricola_gen_amortiz_cargar',);
                        }

                        // importar_gen_amortiz_progreso
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/gen_amortiz/progreso') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'importar_gen_amortiz_progreso');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\GenerarAmortizacionController::consultarProgresoAction',  '_route' => 'importar_gen_amortiz_progreso',);
                        }

                        // importar_gen_amortiz_resumen
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/gen_amortiz/resumen') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'importar_gen_amortiz_resumen');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\GenerarAmortizacionController::consultarResumenAction',  '_route' => 'importar_gen_amortiz_resumen',);
                        }

                        // importar_gen_amortiz_eliminar_resumen
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/gen_amortiz/eliminar_tabla') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'importar_gen_amortiz_eliminar_resumen');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\GenerarAmortizacionController::eliminarResumenAction',  '_route' => 'importar_gen_amortiz_eliminar_resumen',);
                        }

                        // importar_gen_amortiz_cuotas
                        if (rtrim($pathinfo, '/') === '/bioagricola/financiaciones/gen_amortiz/generar') {
                            if (substr($pathinfo, -1) !== '/') {
                                return $this->redirect($pathinfo.'/', 'importar_gen_amortiz_cuotas');
                            }

                            return array (  '_controller' => 'Bioagricola\\BioagricolaBundle\\Controller\\GenerarAmortizacionController::GenerarPlanoAction',  '_route' => 'importar_gen_amortiz_cuotas',);
                        }

                    }

                }

            }

        }

        if (0 === strpos($pathinfo, '/gestioncartera')) {
            // gestion_cartera_api
            if (0 === strpos($pathinfo, '/gestioncartera/api') && preg_match('#^/gestioncartera/api/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'gestion_cartera_api')), array (  '_controller' => 'GestionCartera\\GestionCarteraBundle\\Controller\\DefaultController::apiAction',));
            }

            // gestion_cartera_index
            if (preg_match('#^/gestioncartera/(?P<ruta>.+)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'gestion_cartera_index')), array (  '_controller' => 'GestionCartera\\GestionCarteraBundle\\Controller\\DefaultController::indexAction',));
            }

            // gestion_cartera_kio
            if (0 === strpos($pathinfo, '/gestioncartera/kio') && preg_match('#^/gestioncartera/kio/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'gestion_cartera_kio')), array (  '_controller' => 'GestionCartera\\GestionCarteraBundle\\Controller\\DefaultController::kioAction',));
            }

            // gestion_cartera_todas
            if (rtrim($pathinfo, '/') === '/gestioncartera') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'gestion_cartera_todas');
                }

                return array (  '_controller' => 'GestionCartera\\GestionCarteraBundle\\Controller\\DefaultController::indexAction',  '_route' => 'gestion_cartera_todas',);
            }

        }

        if (0 === strpos($pathinfo, '/liquidacionynotas')) {
            // liquidacion_notas_api
            if (0 === strpos($pathinfo, '/liquidacionynotas/api') && preg_match('#^/liquidacionynotas/api/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'liquidacion_notas_api')), array (  '_controller' => 'LiquidacionyNotas\\LiquidacionyNotasBundle\\Controller\\DefaultController::apiAction',));
            }

            // liquidacion_notas_index
            if (preg_match('#^/liquidacionynotas/(?P<ruta>.+)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'liquidacion_notas_index')), array (  '_controller' => 'LiquidacionyNotas\\LiquidacionyNotasBundle\\Controller\\DefaultController::indexAction',));
            }

            // liquidacion_notas_kio
            if (0 === strpos($pathinfo, '/liquidacionynotas/kio') && preg_match('#^/liquidacionynotas/kio/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'liquidacion_notas_kio')), array (  '_controller' => 'LiquidacionyNotas\\LiquidacionyNotasBundle\\Controller\\DefaultController::kioAction',));
            }

            // liquidacion_notas_todas
            if (rtrim($pathinfo, '/') === '/liquidacionynotas') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'liquidacion_notas_todas');
                }

                return array (  '_controller' => 'LiquidacionyNotas\\LiquidacionyNotasBundle\\Controller\\DefaultController::indexAction',  '_route' => 'liquidacion_notas_todas',);
            }

        }

        if (0 === strpos($pathinfo, '/aprovechamiento')) {
            // aprovechamiento_api
            if (0 === strpos($pathinfo, '/aprovechamiento/api') && preg_match('#^/aprovechamiento/api/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'aprovechamiento_api')), array (  '_controller' => 'AprovechamientoAprovechamientoNotasBundle:Default:api',));
            }

            // aprovechamiento_index
            if (preg_match('#^/aprovechamiento/(?P<ruta>.+)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'aprovechamiento_index')), array (  '_controller' => 'Aprovechamiento\\AprovechamientoBundle\\Controller\\DefaultController::indexAction',));
            }

            // aprovechamiento_kio
            if (0 === strpos($pathinfo, '/aprovechamiento/kio') && preg_match('#^/aprovechamiento/kio/(?P<ruta>[^/]++)$#s', $pathinfo, $matches)) {
                return $this->mergeDefaults(array_replace($matches, array('_route' => 'aprovechamiento_kio')), array (  '_controller' => 'Aprovechamiento\\AprovechamientoBundle\\Controller\\DefaultController::kioAction',));
            }

            // aprovechamiento_todas
            if (rtrim($pathinfo, '/') === '/aprovechamiento') {
                if (substr($pathinfo, -1) !== '/') {
                    return $this->redirect($pathinfo.'/', 'aprovechamiento_todas');
                }

                return array (  '_controller' => 'Aprovechamiento\\AprovechamientoBundle\\Controller\\DefaultController::indexAction',  '_route' => 'aprovechamiento_todas',);
            }

        }

        throw 0 < count($allow) ? new MethodNotAllowedException(array_unique($allow)) : new ResourceNotFoundException();
    }
}
