<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\CerrarLecturasModel;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Description of CerrarLecturasDelegado
 *
 * @author Sergio Vargas 
 * 
 */
class CerrarLecturasDelegado {

    /**
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
     * @var GenericoDelegado
     */
    private $genericoDelegado;

    /**
     *
     * @var CerrarLecturasModel 
     */
    private $cerrarLectura;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->cerrarLectura = new CerrarLecturasModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->sesion = $sesion;
    }

    /**
     * Evalua si hay encabezados en tramite
     * @param type $ciclo
     * @return type
     * @throws MyException
     */
    private function evaluarEncabezado($ciclo) {
        $evaluarEncabezado = $this->cerrarLectura->evaluarEncabezados($ciclo);
        if (!empty($evaluarEncabezado)) {
            if ($evaluarEncabezado > 0) {
                //retorna mensaje de salida Aceptar|Cancelar
                throw new MyException("Hay encabezados en trámite", -3);
            }
        }
        return $evaluarEncabezado;
    }

    /**
     * permite evaluar el encabezado de las lecturas de un ciclo especifico
     * @param type $ciclo captura el ciclo a evaluar
     * @throws MyException
     */
    public function validarEncabezado($ciclo) {
        try {
            $this->evaluarEncabezado($ciclo);
        } catch (\Exception $e) {
            throw new MyException($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Consulta el resumen de la tabla de log, de cuántos registros se pudieron cerra r
     * y si hay un error 
     * @return type
     */
    public function ObtenerResumen() {
        return$this->cerrarLectura->ObtenerResumen();
    }

    /**
     * Valida si hay un proceso activo
     * @return type
     */
    public function ObtenerEstado() {
        $ejecucionactual = $this->genericoDelegado->obtenerIdentificadorPrograma(PROGRAMA_LECTURAS, $this->sesion->get('idempresa'));
        if (!empty($ejecucionactual)) {
            if ($ejecucionactual['estado'] != 'I') {
                $respuesta['estado'] = $ejecucionactual;
                return $respuesta;
            }
        }

        return null;
    }

    /**
     * Método encargado de lanzar el proceso de segundo plano
     * @param type $idCiclo identificador del ciclo 
     * @param ContainerInterface $container información del bundle de que se quiere lanzar 
     * @param type $idempresa
     * @param type $idusuario 
     * @param type $idacceso  
     * @return type
     */
    public function lanzarProcesoSegundoPlano($idCiclo, ContainerInterface &$container, $idempresa, $idusuario, $idacceso) {
        //lanza excepción si el programa ya ha sido ejecutado anteriormente


        $this->genericoDelegado->validarPrograma(PROGRAMA_LECTURAS, $idCiclo, $idempresa);
        /**
         * Se valida que el proceso no esté en ejecición
         */
        $ejecucionactual = $this->genericoDelegado->obtenerIdentificadorPrograma(PROGRAMA_LECTURAS, $idempresa);
        if (!empty($ejecucionactual)) {
            if ($ejecucionactual['estado'] != 'I') {
                $respuesta['estado'] = $ejecucionactual;
                return $respuesta;
            }
        }
        $codigoProceso = $this->genericoDelegado->verificarProcesoEjecucion(PROGRAMA_LECTURAS, $idempresa, $idacceso);
        $parametros = "$idempresa $idusuario $idCiclo $idacceso $codigoProceso " . RUTA_PRINCIPAL;
        $script = $container->get('kernel')->locateResource('@LlanogasLlanogasBundle') . "ProcesosMasivos/EjecutaProcesoCerrarLecturas.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/cerrar_lecturas.log &";
        Util::ejecutarHilo($script);
        /*
          $execute = new CerrarLecturasGenericoDelegado();
          $execute->procesarEncabezado($idCiclo, $idempresa, $codigoProceso, $idusuario);
         */
    }

}

?>
