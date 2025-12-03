<?php

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Models\GenericoModel;

/**
 * Ésta clase no se está utilizando en el proceso 
 * de provisiones 
 * @deprecated since version 1 Se podría eliminar
 */
class ProvisionesController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $conexion = Util::getConexion($this);
        $sesion = Util::iniciarSesion($this);
        $idEmpresa = $sesion->get('idEmpresa');
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $lisParametros['ciclos'] = $this->consultarCiclosActivos($conexion, $idEmpresa);
        $response = $this->render('LlanogasLlanogasBundle:Cartera:ProvisionarCastigarCartera.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta los ciclos activos para aprovisionar.
     * @param type $conexion
     * @param type $idEmpresa
     * @return type
     */
    private function consultarCiclosActivos($conexion, $idEmpresa) {
        $genericoModel = new GenericoModel();
        $genericoModel->setConexion($conexion);
        return $genericoModel->consultarCiclosActivosPrograma(PROGRAMA_PROVISIONES, $idEmpresa);
    }

}
