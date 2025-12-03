<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\FirmasInstaladorasModel;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\MyException;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de los recaudos.
 * @author hrey
 */
class FirmasInstaladorasDelegado {

    /**
     * Conexión a la base de datos
     * @var Connection 
     */
    private $conexion;

    /**
     * Sesión del usuario
     * @var SessionInterface
     */
    private $sesion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var GenericoDelegado 
     */
    private $genericoDelegado;

    /**
     *
     * @var  FirmasInstaladorasModel
     */
    private $firmasInstaladorasModel;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->firmasInstaladorasModel = new FirmasInstaladorasModel($this->conexion);
        $this->sesion = $sesion;
    }

    public function consultarTercero($nombre) {
        if (empty($nombre)) {
            throw new MyException("Error en los parámetros de consulta", -1);
        }
        $terceros = $this->genericoModel->consultarTercero($nombre, UNIDAD_TERCEROS_FIRMASINSTALADORAS);
        if (empty($terceros)) {
            throw new MyException("No se encontraron Terceros", 0);
        }
        return $terceros;
    }

    public function consultarempleadocertificaciones($tercero) {
        if (empty($tercero)) {
            throw new MyException("Error en los parámetros de consulta", -1);
        }

        $resultado = $this->firmasInstaladorasModel->consultarempleadocertificaciones($tercero, $this->sesion->get('idempresa'));
        if (empty($resultado)) {
            throw new MyException("No se encontraron Empleados y Certificaciones", 0);
        }
        return $resultado;
    }

    public function consultarCompetencias() {

        $resultado = $this->firmasInstaladorasModel->consultarcompetencias($this->sesion->get('idempresa'));
        if (empty($resultado)) {
            throw new MyException("No se encontraron Competencias ", 0);
        }
        return $resultado;
    }

    public function grabar(Array $colaboradorCompetencias) {

        $resultado = $this->firmasInstaladorasModel->consultarcompetencias($this->sesion->get('idempresa'));
        if (empty($colaboradorCompetencias)) {
            throw new MyException("No se encontraron Competencias para grabar o actualizar ", 0);
        }
        try {
            $this->conexion->beginTransaction();

            foreach ($colaboradorCompetencias as $registroeditar) {
                /**
                 *  Valida si es un registro nuevo para grabar 
                 */
                $registroeditar['usuario'] = $this->sesion->get('idusuario');
                //print_r($registroeditar);
                if ($registroeditar['idregistro'] == null || empty($registroeditar['idregistro'])) {
                    $this->firmasInstaladorasModel->grabarColaboradorCertificacion($registroeditar);
                }
                /**
                 * Actualiza el registro si ya existe       
                 */ else {
                    $this->firmasInstaladorasModel->actualizarColaboradorCertificacion($registroeditar);
                }
            }
            $this->conexion->commit();
        } catch (\Exception $ex) {
            throw new MyException("Error en Transacción de Grabar o Actualizar Firmas Instaladoras +".$ex->getMessage(), -1);
        }
    }
    
     public function consultaPermisosGrabar($idPrograma) {

      return $this->firmasInstaladorasModel->consultarPermisosGrabar($idPrograma,$this->sesion->get('idusuario'));      
    }

}
