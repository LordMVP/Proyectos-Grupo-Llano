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
class CalificarCreditoDelegado {

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
     * @var FuncionesCreditoDelegado
     */
    private $funcionesCreditoDelegado;

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
     * listado de variables para calificar el crédito
     * @param int $idcredito identificador del crédito
     * @param array $variables listado de variables
     */
    public function calificarCredito($idcredito, $variables, $idliquidacion) {
        $this->registroCreditoModel->eliminar('crsc_crescore', "cre_ideregistro=$idcredito");
        foreach ($variables as $variable) {
            $idvariable = $variable['nombrevariable'];
            $scoring = $variable['calificacion'];
            $valor = $variable['valor'];
            $idfuncion = $variable['idfuncion'];
            //TODO: insertar calificación 
            $this->registroCreditoModel->insertarCalificacionScoringCredito($idvariable, $scoring, $idcredito, $valor, $idfuncion);
            $parametros['cre_ideregistro'] = $idcredito;
            $parametros['uni_liquidacion'] = $idliquidacion;
            $this->registroCreditoModel->actualizarCredito($parametros);
        }
    }

    /**
     * permite actualizar la información de los activos
     * @param int $idcredito identificador de crédito
     * @param int $monto monto de crédito
     * @param int $plazo plazo de crédito
     */
    public function actualizarInformacionActivos($idcredito, $monto, $plazo) {
        $this->registroCreditoModel->actualizarProductoSoliciadoModel($idcredito, $monto, $plazo);
    }

    /**
     * Permite obtener la calificación del crédito
     * @param int $idcredito identificador de crédito
     */
    public function obtenerCalificacionCredito($idcredito) {
        $this->funcionesCreditoDelegado = new FuncionesCreditoDelegado($idcredito);
        $funciones = $this->registroCreditoModel->obtenerVariablesfuncionModel($idcredito);
        $this->registroCreditoModel->eliminar('crsc_crescore', "cre_ideregistro=$idcredito");
        $respuesta = Array();
        foreach ($funciones as $funcion) {
            $parametros[] = Array();

            $tipovaribale = $funcion['tipovariable'];
            $scoring = $this->ejecutarFuncion($funcion['nombrefuncion'], $parametros);
            $variable['idvariable'] = $funcion['idvariable'];
            $variable['nombrefuncion'] = $funcion['nombrefuncion'];
            $variable['nombrevariable'] = $funcion['nombrevariable'];
            $variable['calificacion'] = $scoring['scoring'];
            $variable['idfuncion'] = $funcion['idfuncion'];
            if ($tipovaribale != 'I') {
                //$variable['idvalor'] = $scoring['idvalorvariable'];
                $variable['valor'] = $scoring['valorvariable'];
            } else {
                //Verifica si una funcion de tipo ingreso ya fue calificada 
               // $calificacion = $this->registroCreditoModel->obtenerCalificacionModel($idcredito, $funcion['idfuncion']);
               // if (empty($calificacion)) {
                    //  $variable['idvalor'] = 0;
                    //$variable['valor'] = 0;
                    $variable['valor'] = $scoring['valorvariable'];
                    //$variable['valor'] = $scoring['valorvariable'];
                //} else {
                    // $variable['idvalor'] = $calificacion['idvalor'];
                 //   $variable['valor'] = $calificacion['valor'];
                   // $variable['calificacion'] = $calificacion['calificacion'];
                //}
            }
            $variable['tipo'] = $funcion['tipovariable'];
            $respuesta[] = $variable;
        }
        return $respuesta;
    }

    /**
     * Permite obtener la calificación del crédito
     * @param int $idcredito identificador de crédito
     */
    public function validarCalificacionCredito($idcredito, $parametros) {
        $this->funcionesCreditoDelegado = new FuncionesCreditoDelegado($idcredito);
        $respuesta = Array();
        foreach ($parametros as $funcion) {
            $parametrosFuncion = Array();
            $parametrosFuncion[0]['valor'] = $funcion['valor'];
            if (isset($funcion['tasainteres'])) {
                $parametrosFuncion[0]['tasainteres'] = $funcion['tasainteres'];
            }
            $scoring = $this->ejecutarFuncion($funcion['nombrefuncion'], $parametrosFuncion);
            $variable['nombrevariable'] = $funcion['nombrevariable'];
            $variable['nombrefuncion'] = $funcion['nombrefuncion'];
            $variable['idvariable'] = $funcion['idvariable'];
            $variable['calificacion'] = $scoring['scoring'];
            $variable['valor'] = $scoring['valorvariable'];
            $variable['tipo'] = $funcion['tipo'];
            $variable['idfuncion'] = $funcion['idfuncion'];
            $respuesta[] = $variable;
        }
        return $respuesta;
    }
    
    /**
     * Permite obtener el valor del estudio de credito
     * @param int $idcredito identificador de crédito
     */
    public function cacularEstudioCredito($idcredito, $parametros) {
        $this->funcionesCreditoDelegado = new FuncionesCreditoDelegado($idcredito);
        $respuesta = $this->ejecutarFuncion('calcular_esdio_credito', $parametros);
        return $respuesta['valorvariable'];
    }

    /**
     * permite ejecutar una función
     * @param string $nombrefuncion nombre la función a ejecutar
     * @param array $parametros listado parámetros
     * @return Array listado parámetros de retorno
     * @throws MyException función no existente
     */
    private function ejecutarFuncion($nombrefuncion, Array $parametros) {
        try {
            $method = new \ReflectionMethod(CLASE_CALIFICAR_CREDITO, $nombrefuncion);
            return $method->invokeArgs($this->funcionesCreditoDelegado, $parametros);
        } catch (MyException $e) {
            throw $e;
        } catch (\Exception $e) {
            //  print_r($e->getTraceAsString());
            throw new MyException('La función ' . $nombrefuncion . ' no existe en la clase ', -1);
        }
    }

    /**
     * 
     * @param type $idcredito
     */
    public function obtenerCalificacionesParametrizadas($idcredito) {

        $calificaciones = $this->registroCreditoModel->obtenerCalificacionparametrizadaModel($idcredito);
        return $calificaciones;
    }

    /**
     * permite obtener las liquidaciones
     * @return type
     */
    public function obtenerLiquidaciones($idempresa) {
        $liquidaciones = $this->registroCreditoModel->obtenerLiquidaciones($idempresa);

        foreach ($liquidaciones as &$liquidacion) {
            $liquidacion['interesiva'] = $this->registroCreditoModel->consultarInteresIvaLiquidacion($liquidacion['idliquidacion']);
        }
        return $liquidaciones;
    }

}
