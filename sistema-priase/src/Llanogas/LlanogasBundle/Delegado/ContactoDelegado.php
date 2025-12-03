<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\ContactoModel;
use \Llanogas\LlanogasBundle\Models\GenericoModel;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
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
class ContactoDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\ContactoModel
     */
    private $contactoModel;
    
    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\GenericoModel 
     */
    private $genericoModel;

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion, $conexion = null) {
        $this->conexion = $conexion;
        if ($this->conexion == null) {
            $this->conexion = Util::getConexion($control);
        }
        $this->contactoModel = new ContactoModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $sesion;
    }

    public function generarPlano($fechaInicial, $fechaFinal) {
        try {
            $this->conexion->beginTransaction();
            $parametros['fechaInicial'] = $fechaInicial;
            $parametros['fechaFinal'] = $fechaFinal;
            $parametros['empresa'] = $this->sesion->get('idempresa');
            $parametros['usuario'] = $this->sesion->get('idusuario');
            $parametros['ruta'] = RUTA_ARCHIVO_PLANO_CONTACTO;
            $consultaFechaProceso = $this->contactoModel->consultaFecha();
            $parametros['nombre_archivo'] = "Contacto" . $this->sesion->get('idempresa') . "-" . $consultaFechaProceso[0]['mes'] . "-" . $consultaFechaProceso[0]['dia'] . ".csv";
            $this->contactoModel->archivoPlanoContacto($parametros);
            $this->construllefile($parametros);
            $this->conexion->commit();
            $consultarArchivos = $this->consultarArchivos($parametros);
            return $consultarArchivos;
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException("Error Generando Archivo Contacto:" . $ex->getMessage(), -1);
        }
        $this->conexion->commit();
    }

    public function construllefile($archivo) {
        $controlArchivo = array();
        $controlArchivo['usu_ideregistro'] = $this->sesion->get('idusuario');
        $controlArchivo['prg_ideregistro'] = CODIGO_PROGRAMA_PLANO_CONTACTO;
        $controlArchivo['carc_nombre'] = $archivo['nombre_archivo'];
        $controlArchivo['carc_urlarchivo'] = RUTA_PUBLICACION_PLANO_CONTACTO . '/' . $archivo['nombre_archivo'];
        $controlArchivo['carc_parametros'] = "CONTACTO" . $this->sesion->get('idusuario');
        $controlArchivo['carc_fecha'] = ' now()';
        $controlArchivo['emp_ideregistro'] = $this->sesion->get('idempresa');
        $this->contactoModel->saveFileContacto($controlArchivo);
    }

    
    public function consultarArchivos($Parametros) {
        try {
            if (empty($Parametros)) {
                throw new MyException("No se han recibido parametros de consulta de Archivos", -1);
            }
            $Parametros['programa'] = CODIGO_PROGRAMA_PLANO_CONTACTO;
//            $Parametros['rutapublicacion'] = RUTA_PUBLICACION_PLANO_FES;
            $archivos = $this->contactoModel->consultarArchivos($Parametros);
        } catch (\Exception $ex) {
            throw new MyException("Error consultando Archivos" . $ex->getMessage(), -1);
        }
        return $archivos;
    }

}
