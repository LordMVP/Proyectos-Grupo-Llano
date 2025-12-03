<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\CarteraCastigadaModel;
use Llanogas\LlanogasBundle\Models\ProcesoSuspensionModel;
use Llanogas\LlanogasBundle\Models\CarteraCastigadaGenericoModel;

/**
 * Description of CerrarLecturasDelegado
 * @deprecated since version 1.0.0
 * @author Sergio Vargas
 * fecha  : 16-09-2015
 * 
 */
class CarteraCastigadaDelegado {

    /**
     *
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var  \Llanogas\LlanogasBundle\Models\CarteraCastigadaModel 
     */
    private $CarteraCastigada;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\CarteraCastigadaGenericoModel
     */
    private $CarteraCastigadaModel;

    /**
     *
     * @var CarteraCastigadaGenericoDelegado
     */
    private $CarteraCastigadaGenericoDelegado;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\ProcesoSuspensionModel
     */
    private $SuspensionModel;

    /**
     *
     * @var Llanogas\LlanogasBundle\Delegado\SuspensionesDelegado
     */
    private $SuspensionDelegado;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $sesion;
        $this->CarteraCastigada = new CarteraCastigadaModel($this->conexion);
        $this->CarteraCastigadaModel = new CarteraCastigadaGenericoModel($this->conexion);
        $this->SuspensionModel = new ProcesoSuspensionModel($this->conexion);
        $this->SuspensionDelegado = new SuspensionesDelegado($control, $sesion);
        $this->CarteraCastigadaGenericoDelegado = new CarteraCastigadaGenericoDelegado($sesion->get('idacceso'));
    }

    /**
     * Listado de ciclos activos
     * @return Array listado de ciclos activos
     */
    public function obtenerCiclosActivos() {
        return $this->genericoModel->consultarCiclosActivosPrograma(PROGRAMA_PROCESO_CARTERA_CASTIGADA_ID, $this->sesion->get('idempresa'));
    }


}
