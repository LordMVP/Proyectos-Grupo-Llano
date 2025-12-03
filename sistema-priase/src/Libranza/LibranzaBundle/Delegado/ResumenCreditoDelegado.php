<?php

namespace Libranza\LibranzaBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Libranza\LibranzaBundle\Models\RegistroCreditoModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de los recaudos.
 * @author hrey
 */
class ResumenCreditoDelegado {

    /**
     * Información de la sesión.
     * @var SessionInterface 
     */
    private $sesion;

    /**
     *  Conexión a la base de datos 
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var RegistroCreditoModel 
     */
    private $registroCreditoModel;

    /**
     *
     * @var Controller 
     */
    private $control;

    public function __construct(Controller &$control, $sesion = null) {
        $this->conexion = Util::getConexion($control);
        $this->control = $control;
        $this->sesion = $sesion;
        $this->registroCreditoModel = new RegistroCreditoModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
    }

    public function obtenerEtapasCredito() {
        $etapas = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_ETAPACREDITO);
        return $etapas;
    }

    /**
     * permite listas con producto solicitado
     * @return listado de productos
     */
    public function obtenerDestinoCredito() {
        $EstructuraResultado = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_DESTINOCREDITO);
        return $EstructuraResultado;
    }

    /**
     * permite listas las empresas disponibles
     * @return listado de empresas
     */
    public function obtenerEmpresas() {
        $EstructuraResultado = $this->registroCreditoModel->consultarTerceroPorClase(CLASE_EMPRESAS);
        return $EstructuraResultado;
    }

    /**
     * Obtiene un listado de créditos 
     * @param object $parametros
     */
    public function obtenerCreditos($parametros) {
        $creditos = $this->registroCreditoModel->obtenerListaCreditos($parametros);
        if (empty($creditos)) {
            throw new MyException("No se encontraron créditos.", 0);
        }
        return $creditos;
    }

    /**
     * Obtiene un listado de comentarios de un crédito
     * @param object $idcredito
     */
    public function obtenerComentarios($idcredito) {
        $comentarios = $this->registroCreditoModel->obtenerComentariosModel($idcredito);
        if (empty($comentarios)) {
            throw new MyException("El crédito no tiene comentarios", 0);
        }
        return $comentarios;
    }

    /**
     * Obtiene información de específica de un crédito
     * @param object $idcredito
     */
    public function obtenerInformacion($idcredito) {
        $informacion = $this->registroCreditoModel->obtenerInformacionCredito($idcredito);
        $activos = $this->registroCreditoModel->obtenerSumaActivos($idcredito);
        $informacion['totalactivos'] = $activos['total'];
        if (empty($informacion)) {
            throw new MyException("No se encontró la información del crédito solicitado.", 0);
        }
        return $informacion;
    }

}
