<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Models\RegistroRapidoOperacionesModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Description of RegitroRapidoOperacionesDelegado
 *
 * @author mebonilla
 */
class RegistroRapidoOperacionesDelegado {

    /**
     * Conexión a la base de datos
     * @var Connection 
     */
    private $conexion;

    /**
     *
     * @var RegistroRapidoOperacionesModel
     */
    private $registroRapidoOperacionesModel;

    /**
     * Sesión del usuario
     * @var SessionInterface
     */
    private $sesion;

    /**
     * Constructor de la clase
     * @param Controller $control controlador sobre el que se hace la peticion
     * @param SessionInterface $sesion sesion del usuario en la aplicacion
     */
    public function __construct(Controller &$control, SessionInterface &$sesion) {
        $this->conexion = Util::getConexion($control);
        $this->registroRapidoOperacionesModel = new RegistroRapidoOperacionesModel($this->conexion, $sesion);
        $this->sesion = $sesion;
    }
    
    /**
     * Carga los municipios del programa por la empresa logueada
     * @param string $municipio nombre o coincidencia del municipio a buscar.
     * @throws MyException Error al buscar municipios del programa
     * @return array Lista de municipios
     */
    public function obtenerMunicipios($municipio) {
        
        $municipios = $this->registroRapidoOperacionesModel->autocompleteMunicipio($municipio,PROGRAMA_REGISTRO_RAPIDO_SUSPENSIONES);
        if (empty($municipios)) {
            throw new MyException("No se encontraron municipios", 0);
        }
        return $municipios;
    }
    /**
     * Carga los motivos de suspensión por usuario
     * @throws MyException Error al buscar motivos de suspensión.
     * @return array Lista de motivos de suspensión
     */
    public function cargarMotivosSuspensiones() {
        $motivosSuspension = $this->registroRapidoOperacionesModel->listaMotivosSuspension();
        if (empty($motivosSuspension)) {
            throw new MyException("No se encontraron motivos de suspensión", 0);
        }
        return $motivosSuspension;
    }
    /**
     * Carga los motivos de reconexión según el usuario logueado
     * @throws MyException Error al buscar motivos de reconexión.
     * @return array Lista de motivos
     */
    public function cargarMotivosReconexiones() {
        $motivosReconexion = $this->registroRapidoOperacionesModel->listaMotivosReconexion();
        if (empty($motivosReconexion)) {
            throw new MyException("No se encontraron motivos de reconexión", 0);
        }
        return $motivosReconexion;
    }
    /**
     * Carga las rutas de una empresa según el usuario logueado
     * @throws MyException Error al buscar rutas de suspensión.
     * @return array Listado de rutas de una empresa
     */
    public function cargarListaRutasSuspension() {
        $rutas = $this->registroRapidoOperacionesModel->listaRutasSuspension();
        return $rutas;
    }
    /**
     * Carga los tipos de suspensión de la empresa
     * @throws MyException Error al buscar tipos de suspensión.
     * @return array Listado de tipos de suspensión
     */
    public function cargarListaTipoSuspension() {
        $tipoSuspension = $this->registroRapidoOperacionesModel->listaTiposSuspension();
        if (empty($tipoSuspension)) {
            throw new MyException("No se encontraron tipos de suspensión", 0);
        }
        return $tipoSuspension;
    }
    /**
     * Consulta las novedades de suspensión de una empresa
     * @throws MyException Error al buscar novedades de suspensión.
     * @return array Listado de novedades
     */
    public function cargarListaNovedadesSuspension() {
        $novedadSuspension = $this->registroRapidoOperacionesModel->listaNovedadesSuspension();
        if (empty($novedadSuspension)) {
            throw new MyException("No se encontraron novedades de suspensión", 0);
        }
        return $novedadSuspension;
    }
    /**
     * Consulta las novedades de reconexión.
     * @throws MyException Error al buscar novedades de reconexión.
     * @return array Listado de novedades
     */
    public function cargarListaNovedadesReconexion() {
        $novedadReconexion = $this->registroRapidoOperacionesModel->listaNovedadesReconexion();
        if (empty($novedadReconexion)) {
            throw new MyException("No se encontraron registros novedades para la reconexión", 0);
        }
        return $novedadReconexion;
    }
    /**
     * Consulta suspensiones que cumplan con parámetro de búsqueda
     * @param int $municipio Id municipio campo obligatorio de búsqueda
     * @param int $ruta Id ruta campo obligatorio de búsqueda
     * @param int $barrio Id barrio
     * @param date $desde Desde que fecha se buscará
     * @param date $hasta Fecha hasta la que se filtrará las suspensiones
     * @param char $altoRiesgo Si la propiedad está en zona de alto riesgo.
     * @param char $zona Tipo de zona de la propiedad
     * @param int $tercero Id tercero que ejecuta la suspensión
     * @param char $realizada Si se realizó la  suspensión
     * @param date $fechaProgramacion Fecha de cuando se programó la suspensión
     * @param int $motivo Id motivo de suspensión campo obligatorio de búsqueda
     * @throws MyException Error al buscar suspensiones.
     * @return array Listado de las suspensiones con características similares.
     */
    public function cargarTablaSuspensiones($municipio, $ruta, $barrio, $desde, $hasta, $altoRiesgo, $zona, $tercero, $realizada, $fechaProgramacion, $motivo) {
        $suspensiones = $this->registroRapidoOperacionesModel->consultarTablaSuspensiones($municipio, $ruta, $barrio, $desde, $hasta, $altoRiesgo, $zona, $tercero, $realizada, $fechaProgramacion, $motivo);
        if (empty($suspensiones)) {
            throw new MyException("Error, No se encontraron registros de suspensión", 0);
        }
        return $suspensiones;
    }
    /**
     * Consulta reconexiones que cumplan con parámetro de búsqueda
     * @param int $municipio Id municipio campo obligatorio de búsqueda
     * @param int $ruta Id ruta campo obligatorio de búsqueda
     * @param int $barrio Id barrio
     * @param date $desde Desde que fecha se buscará
     * @param date $hasta Fecha hasta la que se filtrará las reconexiones
     * @param char $altoRiesgo Si la propiedad está en zona de alto riesgo.
     * @param char $zona Tipo de zona de la propiedad
     * @param int $tercero Id tercero que ejecuta la suspensión
     * @param char $realizada Si se realizó la  suspensión
     * @param date $fechaProgramacion Fecha de cuando se programó la suspensión
     * @param int $motivo Id motivo de suspensión campo obligatorio de búsqueda
     * @throws MyException Error al buscar suspensiones.
     * @return array Listado de las reconexiones con características similares.
     */
    public function cargarTablaReconexiones($municipio, $ruta, $barrio, $desde, $hasta, $altoRiesgo, $zona, $tercero, $realizada, $fechaProgramacion, $motivo) {
        $reconexiones = $this->registroRapidoOperacionesModel->consultarTablaReconexiones($municipio, $ruta, $barrio, $desde, $hasta, $altoRiesgo, $zona, $tercero, $realizada, $fechaProgramacion, $motivo);
        if (empty($reconexiones)) {
            throw new MyException("Error, No se encontraron registros de reconexión", 0);
        }
        return $reconexiones;
    }
    /**
     * Actualiza toda la información de varias suspensiones
     * @param array $suspensiones Listado con información de suspensiones a actualizar
     * @return int Número de registros modificados
     * @throws MyException Error al actualizar suspensiones.
     */
    public function actualizarInformacionSus($suspensiones) {
        try {
            $resultado = "";
            $this->conexion->beginTransaction();
            foreach ($suspensiones as $suspension) {
                $resultado = $this->registroRapidoOperacionesModel->actualizarSuspension($suspension);
            }
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
    }
    /**
     * Actualiza toda la información de varias reconexiones
     * @param array $reconexiones Listado con información de reconexiones a actualizar
     * @return int Número de registros modificados
     * @throws MyException Error al actualizar suspensiones.
     */
    public function actualizarInformacionRec($reconexiones) {
        try {
            $resultado = "";
            $this->conexion->beginTransaction();
            foreach ($reconexiones as $reconexion) {
                $resultado = $this->registroRapidoOperacionesModel->actualizarReconexion($reconexion);
            }
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
    }
    
    public function obtenerFechaHolgura($idPrograma,$idProceso){
           $resultado = $this->registroRapidoOperacionesModel->consultarHolguraFechaSyR($idPrograma,$this->sesion->get('idempresa'),$idProceso);
           if(empty($resultado))
               return date('Y-m-d') ;
                   
          return $resultado ; 
    }

}
