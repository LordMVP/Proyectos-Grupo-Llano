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
class ParametrizacionCreditoDelegado {

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

    /**
     * permite listas el destino de crédito
     */
    public function obtenerDestinoCredito() {
        //$EstructuraResultado = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_DESTINOCREDITO);
        $EstructuraResultado = $this->genericoModel->obtenerListaPorClase(CLASE_DESTINOCREDITO, POTENZA_IDPROYCTO);
        return $EstructuraResultado;
    }

    /**
     * permite listas el destino de crédito
     */
    public function obtenerVariablesCredito() {
        $EstructuraResultado = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_VARIABLES_CREDITO);
        return $EstructuraResultado;
    }

    /**
     * permite listas los formularios
     */
    public function obtenerFormulariosParametrizado($idproducto) {
        $ResultadoFormularios = $this->registroCreditoModel->obtenerFormulariosParametrizacionModel($idproducto);
        return $ResultadoFormularios;
    }

    /**
     * permite listas los formularios
     */
    public function obtenerFormularios() {
        $ResultadoFormularios = $this->registroCreditoModel->obtenerFormulariosModel();
        return $ResultadoFormularios;
    }

    /**
     * permite listas las funciones
     */
    public function obtenerFunciones() {
        $ResultadoFormularios = $this->registroCreditoModel->obtenerFuncionesCreditoModel();
        return $ResultadoFormularios;
    }

    /**
     * permite listas las variables de crédito
     *
     */
    public function obtenerVariablesCreditoFormulario($idformulario) {
        $ResultadoFormularios = $this->registroCreditoModel->obtenerVariablesCreditoModel($idformulario);
        return $ResultadoFormularios;
    }

    /**
     * permite crear un nuevo formulario 
     * @param string $nombre nombre de formulario
     * @param date $fechainicial fecha inicial de formulario
     * @param date $fechafinal fecha final de la vigencia
     * @return int identificador del formulario creado
     */
    public function insertarFormulario($nombre, $fechainicial, $fechafinal) {
        $ResultadoFormularios = $this->registroCreditoModel->insertarFormularioParametrizacionScoringCredito($nombre, $fechainicial, $fechafinal);
        return $ResultadoFormularios;
    }

    /**
     * permite insertar una nueva parametrización
     * @param int $idproductofinanciero id producto financiero
     * @param int $idformulario identificador del formulario
     * @param Array $variables variables a parámetrizar
     * @throws MyException Asociacion parametrización
     */
    public function insertarParametrizacion($idproductofinanciero, $idformulario, $variables) {
        try {
            $this->conexion->beginTransaction();
            $existencia = $this->registroCreditoModel->obtenerFormulariosParametrizacionModel($idproductofinanciero);
            if (empty($existencia)) {
                $this->registroCreditoModel->insertarAsociacionParametrizacionScoringCredito($idformulario, $idproductofinanciero);
            } else {
                $this->registroCreditoModel->actualizarFormularioProducto($idproductofinanciero, $idformulario);
            }

            foreach ($variables as $variable) {
                if ($variable['estado'] === 'E') {
                    $this->registroCreditoModel->actualizarVariables($variable['idregistro']);
                } else {
                    $idvariable = $variable['idvariable'];
                    $idfuncion = $variable['idfuncion'];
                    $tipo = $variable['tipo'];
                    $this->registroCreditoModel->insertarDetalleFormularioParametrizacionScoringCredito($idformulario, $idvariable, $idfuncion, $tipo);
                }
            }
            $this->conexion->commit();
        } catch (MyException $ex) {
            $this->conexion->rollBack();
            throw new MyException($ex->getMessage(), -1);
        }
    }

}
