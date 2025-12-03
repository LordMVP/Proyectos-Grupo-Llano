<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\ValidacionException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\FesModel;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use \Llanogas\LlanogasBundle\Models\GenericoModel;
use \Llanogas\LlanogasBundle\Models\ProcesoModel;
use Symfony\Component\DependencyInjection\ContainerInterface;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio para la generación de Archivo plano para Fes
 * @author lmrubio
 */
class FesDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\FesModel
     */
    private $fesModel;

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\ProcesoModel
     */
    private $procesoModel;

    /**
     *
     * @var GenericoDelegado 
     */
    private $genericoDelegado;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion, $conexion = null) {
        $this->conexion = $conexion;
        if ($this->conexion == null) {
            $this->conexion = Util::getConexion($control);
        }

        $this->fesModel = new FesModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $sesion;
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
    }

    public function ValidarEjecucionProceso() {
        $resultado = $this->procesoModel->getProcesoEjecucionHilos($this->sesion->get('idempresa'), CODIGO_PROGRAMA_FES_GENERACION_PLANO);
        if (!empty($resultado)) {
            $validacionException = new ValidacionException('Hay un proceso en ejecución', -3);
            $validacionException->setData($resultado);
            throw $validacionException;
        }
    }

    public function ValidarEjecucionProcesoCarga() {
        $resultado = $this->procesoModel->getProcesoEjecucionHilos($this->sesion->get('idempresa'), CODIGO_PROGRAMA_FES_PROCESO_CARGA);
        if (!empty($resultado)) {
            $validacionException = new ValidacionException('Hay un proceso en ejecución', -3);
            $validacionException->setData($resultado);
            throw $validacionException;
        }
    }

    public function generarPlano($idCiclo, ContainerInterface &$container) {
        try {
            $this->conexion->beginTransaction();
            $valida_Ejecucion_ProgramaCiclo = $this->genericoModel->validarActividadPrograma(CODIGO_PROGRAMA_FES_GENERACION_PLANO, $idCiclo, $this->sesion->get('idempresa'));
            if ($valida_Ejecucion_ProgramaCiclo['ejecutar'] == 'S' || $valida_Ejecucion_ProgramaCiclo['ejecutar'] == 's') {

                $parametros['ciclo'] = $idCiclo;
                $parametros['empresa'] = $this->sesion->get('idempresa');
                $this->fesModel->EliminarTablaTemporal($parametros);
                $this->fesModel->IncializarTablaTemporal($parametros, NUMERO_HILOS_GENERAPLANOFES);
                sleep(1);
                $this->fesModel->consultarRegistrosGenerados($parametros);
                sleep(1);
                $this->fesModel->CreaIndiceTablaTemporal($parametros);
                sleep(1);
                // print_r($parametros);
                $nombre_table = "proceso_genera_fes_" . $parametros['empresa'] . "_ciclo_" . $parametros['ciclo'];
                $this->fesModel->EliminarInformacionLog($parametros);
                $errores_validacion = $this->validarInformacionBasica($parametros);
                if (!empty($errores_validacion)) {
                    return $errores_validacion;
                }
                $parametros['idusuario'] = $this->sesion->get('usu_ideregistro');
                $this->fesModel->eliminaResumen($parametros);
                $this->lanzarHilosGeneraPlanoFes($idCiclo, $container);
            } else {
                throw new MyException("El ciclo seleccionado :" . $idCiclo . ' no esta habilitado para ejecutar este programa ', -1);
            }
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException("Error Generando Archivo plano Fes :" . $ex->getMessage(), -1);
        }
        $this->conexion->commit();
    }

    private function lanzarHilosGeneraPlanoFes($idCiclo, ContainerInterface &$container) {
        for ($i = 0; $i < NUMERO_HILOS_GENERAPLANOFES; $i++) {
            $idEmpresa = $this->sesion->get('idempresa');
            $idAcceso = $this->sesion->get('idacceso');
            $usuario = $this->sesion->get('usu_ideregistro');
            $parametros = "$idEmpresa $idAcceso $idCiclo $i $usuario " . RUTA_PRINCIPAL;
            $script = $container->get('kernel')->locateResource('@LlanogasLlanogasBundle') . "ProcesosMasivos/ProcesoIniciaGenerarPlanoFes.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/planoFes_$i.log &";
            //print_r($script) ;
        // Línea para ejecutar los hilos en linux.
            shell_exec('php ' . $script);
            //Línea para ejecutar los hilos en Windows
            //pclose(popen('start /b "bla" "C:/xampp/php/php.exe" ' . $script . ' ', "r"));
        }
    }

    public function consultarCiclo() {
        try {
            $ciclos = $this->genericoModel->consultarCiclosActivosPrograma(CODIGO_PROGRAMA_FES_GENERACION_PLANO, $this->sesion->get('idempresa'));
        } catch (\Exception $ex) {
            throw new MyException("Error Consultando Ciclos Activos" . $ex->getMessage(), -1);
        }
        return $ciclos;
    }

    public function consultarArchivos($Parametros) {
        try {
            if (empty($Parametros)) {
                throw new MyException("No se han recibido parametros de consulta de Archivos", -1);
            }
            $Parametros['programa'] = CODIGO_PROGRAMA_FES_GENERACION_PLANO;
//            $Parametros['rutapublicacion'] = RUTA_PUBLICACION_PLANO_FES;
            $archivos = $this->genericoModel->consultarArchivos($Parametros);
        } catch (\Exception $ex) {
            throw new MyException("Error consultando Archivos" . $ex->getMessage(), -1);
        }
        return $archivos;
    }

    public function validarInformacionBasica($parametros) {
        $listaresultado = array();
        $nombre_table = 'proceso_genera_fes_' . $parametros['empresa'] . '_ciclo_' . $parametros['ciclo'];
        /*
         * Fase : Variable Para controlar si es antes o durante o al finalizar la generación del plano fes 0:antes 1:durante 2:despues
         */
        $campos = $this->fesModel->consultaCamposValidar(0);
        foreach ($campos as $campo) {
            $resultado = $this->fesModel->validacionCampos($campo, $nombre_table);
            if (!empty($resultado)) {
                foreach ($resultado as $valor)
                    $listaresultado[] = $valor;
            }
        }
        return $listaresultado;
    }

    public function consultaLogErroresFes() {
        $ciclo_proceso = $this->fesModel->consultarCicloenProceso($this->sesion->get('idempresa'));
        if (empty($ciclo_proceso))
            $ciclo_proceso = 0;

        $parametros['ciclo'] = $ciclo_proceso;
        $parametros['empresa'] = $this->sesion->get('idempresa');

        $errores = $this->fesModel->consultaLogFes($parametros);
        return $errores;
    }

    public function consultarEstadoWS() {
        $respuesta = $this->fesModel->consultarEstadoHiloWS($this->sesion->get('idempresa'));
        return $respuesta ;
    }

}
