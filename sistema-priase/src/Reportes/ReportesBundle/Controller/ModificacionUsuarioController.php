<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Reportes\ReportesBundle\Models\SuscripcionesReportesModel;

/**
 * Permite ver las modificaciones de las suscripciones
 * @author Appfuture
 */
class ModificacionUsuarioController extends Controller {

    /**
     * @Route("/modificaciones_usuario")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:modificacionUsuario.html.twig")
     */
    public function modificacionesUsuarios() {
        $base = $this->get("reportes.base");
        $municipios = $base->modeloGenerico->getMunicipiosPorPerfil($base->idUsuario, $base->idEmpresa);
        $parametros['municipios'] = $municipios;
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }

    /**
     * @Route("/consultar_suscripciones_modificada")
     * @Method({"POST"})
     */
    public function consultarSuscripcionesModificadas(Request $request) {
        $base = $this->get("reportes.base");
        $suscripcionModel = new SuscripcionesReportesModel($base->conexion);
        $requestInfo = json_decode($request->getContent(), true);
        $tipoNovedad = $requestInfo['idnovedad'];
        $requestInfo['idempresa'] = $base->idEmpresa;
        $complementoSql = $this->filtro($requestInfo);
        $respuesta['suscripciones'] = $suscripcionModel->consultarSuscipciones($tipoNovedad, $complementoSql, $requestInfo);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($respuesta);
    }

    private function filtro(&$data) {
        $complementoCondicion = " AND  dsus.emp_ideregistro =:idempresa ";
        if (isset($data['idmunicipio'])) {
            if (is_numeric($data['idmunicipio'])) {
                $complementoCondicion .= " AND dsus.uni_municipio =:idmunicipio";
            }
        }
        if (isset($data['idsuscripcion'])) {
            if (is_numeric($data['idsuscripcion'])) {
                $complementoCondicion .= " AND dsus.dsus_ideregistr =:idsuscripcion";
            }
        }
        if (isset($data['codigoanterior']) && !empty($data['codigoanterior'])) {
            $complementoCondicion .= " AND dsus.dsus_pcodigo =:codigoanterior";
        }
        return $complementoCondicion;
    }

}
