<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\SuspensionModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Description of SuspensionesDelegado
 *
 * @author mebonilla
 */
class SuspensionesDelegado {

    /**
     * Conexión a la base de datos
     * @var Connection 
     */
    private $conexion;

    /**
     *
     * @var SuspensionModel
     */
    private $suspensionModel;

    /**
     *
     * @var GenericoModel
     */
    private $genericoModel;

    /**
     *
     * @var SessionInterface
     */
    private $sesion;

    public function __construct(Controller &$control, SessionInterface &$sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->suspensionModel = new SuspensionModel($this->conexion, $sesion);
        $this->sesion = $sesion;
    }

    /**
     * Crea un combo en html con informacion solicitada a la base de datos
     * @param int $codTipo tipo de combo
     * @param string $nombre nombre del combo
     * @return html combo de html con la información necesaria
     */
    public function cargarComboDb($codTipo, $nombre) {
        $idEmpresa = $this->sesion->get('idEmpresa');
        switch ($codTipo) {
            case COD_MOTIVOS:
                $resultado = $this->suspensionModel->consultarMotivos($codTipo, $idEmpresa);
                break;
            case COD_CONCEPTOS:
                $resultado = $this->suspensionModel->consultarConceptos($codTipo, $idEmpresa);
                break;
            case COD_NOVEDADES_SUSP:
                $resultado = $this->suspensionModel->consultarNovedadesSuspension($codTipo, $idEmpresa);
                break;
            case COD_NOVEDADES_RECO:
                $resultado = $this->suspensionModel->consultarNovedadesReconexion($codTipo, $idEmpresa);
                break;
        }
        if (empty($resultado)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return Util::crearCombo($nombre, $resultado);
    }

    /**
     * Obtiene del model el detalle de una suscripcion
     * @param int $idSuscripcion id de la suscripcion
     * @return array informacion del detalle de la suscripcion
     * @throws MyException
     */
    public function obtenerDetalleSuscripcion($idSuscripcion) {
        $detalleSuscripcion = $this->suspensionModel->detalleSuscripcion($idSuscripcion);
        if (empty($detalleSuscripcion)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $detalleSuscripcion;
    }

    /**
     * Funcion para consultar las cuadrillas disponibles para el proceso de suspensiones 
     * y reconexiones
     * @param type $idEmpresa
     * @param type $dependencia
     * @param type $estado
     * @return type
     * @throws MyException
     */
    public function obtenerCuadrillasEmpresa($idEmpresa, $dependencia, $estado = "A") {
        $cuadrillas = $this->suspensionModel->consultarCuadrillas($idEmpresa, $dependencia, $estado);
        if (empty($cuadrillas)) {
            throw new MyException("No se encontraron cuadrillas", 0);
        }
        return $cuadrillas;
    }
    
    
    /**
     * Consulta la localizacion de la cuadrilla en una fecha especifica
     * 
     * @param type $aplicacion
     * @param type $usuCuadrilla
     * @param type $fecha
     * @return type
     * @throws MyException
     */
    public function obtenerLocalizacionCuadrilla($localizar, $actividad, $aplicacion, 
            $usuCuadrilla, $fecha)  {
        
        $suspensiones = 0;
        $reconexiones = 0;
        
        if($localizar == 1) {
            
            if($actividad == -1) {
                
                $suspensiones = 1;
                $reconexiones = 1;
            
                
            } else if($actividad == 1) {
                
               $reconexiones = 1;
               
            } else {
                
                $suspensiones = 1;
                
            }
            
            $localizaciones= $this->suspensionModel->consultarLocalizacionActividades(
                $suspensiones, $reconexiones, $usuCuadrilla, $fecha);
            
        } else {
            
            $localizaciones= $this->suspensionModel->consultarLocalizacionCuadrillas(
                $aplicacion, $usuCuadrilla, $fecha);
            
        }
        
        return $localizaciones;
    }
    
    /**
     * Consulta del modelo la suscripcion a traves del filtro
     * @param int $idEmpresa id de la empresa del usuario logueado
     * @param int $documento id del documento de la sucripcion
     * @param int $codanterior codigo anterior de la suscripcion
     * @param int $idSuscripcion id de la suscripcion
     * @param int $municipio id del municipio de la suscripcion
     * @return array informacion de la suscripcion
     * @throws MyException
     */
    public function consultarSuscripcion($idEmpresa, $documento, $codanterior, $idSuscripcion, $municipio) {
        $suscripcion = $this->suspensionModel->consultarSuscripcion($idEmpresa, $documento, $codanterior, $idSuscripcion, $municipio);
        if (empty($suscripcion)) {
            throw new MyException("No se encontraron registros", 0);
        }
        if ($suscripcion[0]['estadosus'] == 'E') {
            throw new MyException("La suscripcion  esta Eliminada", 0);
        }
        return $suscripcion;
    }

    /**
     * Consulta la informacion del ciclo y periodo activo de una suscripcion
     * @param int $idSuscripcion
     * @return array
     * @throws MyException
     */
    public function consultarCicloPeriodo($idSuscripcion) {
        $cicloperiodo = $this->genericoModel->getCicloPeriodo($idSuscripcion);
        if (empty($cicloperiodo)) {
            throw new MyException("No se encontró ciclo-periodo para la suscripción", 0);
        }
        return $cicloperiodo;
    }

    /**
     * Consulta la informacion de la cabecera de una suspension 
     * @param int $idEmpresa id de la empresa a la que pertenece la suspension
     * @param int $documento id del documento de la suscripcion a la que
     * pertenece la suspension
     * @param int $codanterior codigo anterior de la suscripcion a la que
     * pertenece la suspension
     * @param int $suscripcion id de la suspension a la que pertenece la
     * suspension
     * @return array informacion de la suscripcion
     * @throws MyException
     */
    public function consultarCabecera($idEmpresa, $documento, $codanterior, $suscripcion) {
        $cabecera = $this->suspensionModel->consultarCabecera($idEmpresa, $documento, $codanterior, $suscripcion);
        if (empty($cabecera)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $cabecera;
    }

    /**
     * Consulta la informacion de un detalle de suspension segun su id
     * @param int $codDetalle id del detalle de la suspension
     * @return array informacion del detalle de la suspension
     * @throws MyException
     */
    public function consultarDetalle($codDetalle) {
        $detalle = $this->suspensionModel->consultarDetalle($codDetalle);
        if (empty($detalle)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $detalle;
    }

    /**
     * Registra la informacion de una nuevo encabezado de suspension para una 
     * suscripcion
     * @param int $idSuscripcion id de la sucripcion
     * @param int $idPropiedad id de la propiedad de la suscripcion
     * @param string $estado estado del encabezado de la suspension
     * @param date $fechaGen fecha de generacion de la suspension
     * @param date $fechaApro fecha de aprobacion de la suspension
     * @param date $fechaPro fecha de procesamiento de la suspension
     * @param string $observaciones observacion de la suspension
     * @param array $cicloano informacion del ciclo de la suscripcion de la 
     * suspension
     * @return int id de registro de la suspension
     * @throws MyException
     */
    public function registrarNuevaSuspension($idSuscripcion, $idPropiedad, $estado, $fechaGen, $fechaApro, $fechaPro, $observaciones, $cicloano) {
        try {
            $this->conexion->beginTransaction();
            $cicper = $this->genericoModel->getCicloPeriodo($idSuscripcion);
            $cicloperiodo = $cicper[0];
            $cabecera = $this->suspensionModel->tieneEncabezadoSuspensionReconexion($idSuscripcion, $cicloperiodo["idciclo"], $cicloperiodo["idperiodo"]);
            if (!empty($cabecera)) {
                throw new MyException("Error, la suscripción ya tiene una suspensión para el ciclo y periodo actual", -1);
            }
            $resultado = $this->suspensionModel->crearSuspension($idSuscripcion, $idPropiedad, $estado, $fechaGen, $fechaApro, $fechaPro, $observaciones, $cicloperiodo["idciclo"], $cicloperiodo["idperiodo"], $cicloano);
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
    }

    /**
     * Permite editar la informacion de un encabezado de suspension
     * @param int $idSuspension id de la suspension
     * @param date $fecha fecha de la suspension
     * @param date $fechaApro fecha de aprobacion de la suspension
     * @param date $fechaProc fecha de procesamiento de la suspension
     * @param string $observacion observacion de la suspension
     * @param int $idSuscripcion id de la suscripcion de la suspension
     * @return int numero de filas afectadas
     * @throws MyException
     */
    public function editarSuspension($idSuspension, $fecha, $fechaApro, $fechaProc, $observacion, $idSuscripcion) {
        try {
            $this->conexion->beginTransaction();
            $resultado = $this->suspensionModel->editarSuspension($idSuspension, $fecha, $fechaApro, $fechaProc, $observacion, $idSuscripcion);
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
    }

    /**
     * Modifica una suspension a estado C siendo reportada como eliminada
     * @param string $estado estado de la suspension
     * @param int $idSuspension id de la suspension
     * @return int numero de filas afectadas
     * @throws MyException
     */
    public function eliminarSuspension($estado, $idSuspension) {
        try {
            $this->conexion->beginTransaction();
            $resultado = $this->suspensionModel->eliminarSuspension($estado, $idSuspension);
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
    }

    /**
     * Permite registrar un nuevo detalle de suspension para un encabezado
     * @param date $fechaProg fecha de programacion del detalle
     * @param date $fechaEjec fecha de ejecucion
     * @param int $lectura lectura del medidor
     * @param type $observacion observacion del detalle de la suspension
     * @param int $motivo motivo del detalle de la suspension
     * @param int $idNovedad id de la novedad del detalle de la suspension
     * @param int $idTipo id del tipo de la suspension
     * @param int $idSuspension id del encabezado de la suspension
     * @param int $idTercero id del tercero que realiza el detalle de la
     * suspension
     * @param type $fechaApro fecha de aprobacion del detalle de la suspension
     * @param int $idConcepto id del concepto del detalle de la suspension
     * @param int $valorTotal valor total del detalle de la suspension
     * @return int id del detalle de la suspension
     * @throws MyException
     */
    public function registrarDetalleSuspension($fechaProg, $fechaEjec, $lectura, $observacion, $motivo, $idNovedad, $idTipo, $idSuspension, $idTercero, $fechaApro, $idConcepto, $valorTotal) {
        $this->conexion->beginTransaction();
        try {
            $encabezado = $this->suspensionModel->consultarEncabezadoPorId($idSuspension);
            if (!empty($encabezado)) {
                $resultado = $this->suspensionModel->crearNuevoDetalleSuspension($fechaProg, $fechaEjec, $lectura, $observacion, $motivo, $idNovedad, $idTipo, $idSuspension, $idTercero, $fechaApro, $idConcepto, $valorTotal);
                $this->conexion->commit();
                $this->conexion->beginTransaction();
                $detalleSuspensiones = $this->suspensionModel->consultarDetallesSuspension($idSuspension);
                foreach ($detalleSuspensiones as $detalle) {
                    if ($detalle["fechaejecucion"] == null) {
                        $this->suspensionModel->alterEliminarDetalleSuspension($detalle["iddetallesuspension"], $resultado);
                    }
                }
                $this->conexion->commit();
                return $resultado;
            } else {
                $this->conexion->rollBack();
                throw new MyException("Error, el encabezado actual no tiene el estado correspondiente", -1);
            }
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
    }

    /**
     * Edita la informacion de un detalle de suspension
     * @param int $idDetalleSuspension id del detalle de la suspension
     * @param date $fechaProg fecha de programacion del detalle de la suspension
     * @param date $fechaEjec fecha de ejecucion del detalle de la suspension
     * @param int $motivo id del motivo de la suspension
     * @param int $idNovedad id de la novedad de la suspension
     * @param int $idTipo id del tipo de la suspension
     * @param int $idTercero id del tercero que hace la suspension
     * @param int $lectura int de la lectura
     * @param string $observacion observacion de la suspension
     * @param string $ejecutada si la suspension esta ejecutada "S" o no "N"
     * @param int $idConcepto id del concepto del detalle de la suspension
     * @param int $valorTotal valor total del detalle de la suspesion
     * @return numero de filas afectadas
     * @throws MyException
     */
    public function editarDetalleSuspension($idDetalleSuspension, $fechaProg, $fechaEjec, $motivo, $idNovedad, $idTipo, $idTercero, $lectura, $observacion, $ejecutada, $idConcepto, $valorTotal, $idSuscripcion) {
        try {
            $this->conexion->beginTransaction();
            $resultado = $this->suspensionModel->editarDetalleSuspension($idDetalleSuspension, $fechaProg, $fechaEjec, $motivo, $idNovedad, $idTipo, $idTercero, $lectura, $observacion, $ejecutada, $idConcepto, $valorTotal);
            if(!empty($idSuscripcion)){
                if($ejecutada == 'S' && $motivo == 102 && ($idNovedad == 1031 || $idNovedad == 1032)){
                    $estado = "U";
                            if($idNovedad == 1032){
                                $estado = "R";
                            }
                    $this->suspensionModel->editaEstadoSuscripcion($idSuscripcion, $estado);
                }
            }
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
    }

    /**
     * Consulta la informacion de un detalle de suspension
     * @param type $idSuspension
     * @return type
     * @throws MyException
     */
    public function consultarDetalleSuspension($idSuspension) {
        $detallesSuspension = $this->suspensionModel->consultarDetallesSuspension($idSuspension);
        if (empty($detallesSuspension)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $detallesSuspension;
    }

    /**
     * Registra una nueva reconexion para un encabezado de suspension
     * @param date $fechaProg fecha de programacion de la reconexion
     * @param date $fechaEjec fecha de ejecucion de la reconexion
     * @param date $fechaApro fecha de aprobacion de la reconexion
     * @param int $lectura valor de la lectura en la reconexion
     * @param string $observacion observacion de la reconexion
     * @param int $valorTotal valor total de la reconexion
     * @param int $novedad novedad de la reconexion
     * @param int $idSuspension id del encabezado de la suspension
     * @param int $idConcepto id del concepto de la reconexion
     * @param int $idTercero id del tercero que hacer la reconexion
     * @param int $idEmpresa id de la empresa que inserta la reconexion
     * @param int $motivo id del motivo de la reconexion
     * @param int $idDetalle id del detalle de la suspension
     * @return int id de registro de la reconexion
     * @throws MyException
     */
    public function insertarReconexion($fechaProg, $fechaEjec, $fechaApro, $lectura, $observacion, $valorTotal, $novedad, $idSuspension, $idConcepto, $idTercero, $idEmpresa, $motivo, $idDetalle) {
        try {
            $this->conexion->beginTransaction();
            $encabezado = $this->suspensionModel->consultarEncabezadoPorId($idSuspension);
            if (!empty($encabezado)) {

                $resultado = $this->suspensionModel->insertaReconexion($fechaProg, $fechaEjec, $fechaApro, $lectura, $observacion, $valorTotal, $novedad, $idSuspension, $idConcepto, $idTercero, $idEmpresa, $motivo, $idDetalle);
                $this->conexion->commit();
                return $resultado;
            } else {
                $this->conexion->rollBack();
                throw new MyException("Error, el encabezado actual no tiene el estado correspondiente", -1);
            }
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
    }

    /**
     * 
     * @param type $fechaProg fecha de programacion de la reconexion
     * @param type $fechaEjec fecha de ejecucion de la reconexion
     * @param type $fechaApro fecha de aprobacion de la reconexion
     * @param type $lectura valor de la lectura en la reconexion
     * @param type $observacion observacion de la reconexion
     * @param type $valorTotal valor total de la reconexion
     * @param type $novedad  novedad de la reconexion
     * @param type $idSuspension id del encabezado de la suspension
     * @param type $idConcepto id del concepto de la reconexion
     * @param type $idTercero id del tercero que hacer la reconexion
     * @param type $idReconexion id de la reconexion
     * @param type $motivo id del motivo de la reconexion
     * @param type $realizada valor si la reconexion fue realizada "S" o no "N"
     * @return int numero de filas afectadas
     * @throws MyException
     */
    public function actualizarReconexion($fechaProg, $fechaEjec, $fechaApro, $lectura, $observacion, $valorTotal, $novedad, $idSuspension, $idConcepto, $idTercero, $idReconexion, $motivo, $realizada) {
        try {
            $this->conexion->beginTransaction();
            $resultado = $this->suspensionModel->actualizarReconexion($fechaProg, $fechaEjec, $fechaApro, $lectura, $observacion, $valorTotal, $novedad, $idSuspension, $idConcepto, $idTercero, $idReconexion, $motivo, $realizada);
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
    }

    /**
     * Consulta la informacion de las reconexiones segun del id del encabezado
     * de una suspension
     * @param int $idSuspension id del encabezado de la suspension
     * @return array informacion de la reconexion
     * @throws MyException
     */
    public function consultarReconexion($idSuspension) {
        $reconexiones = $this->suspensionModel->consultarReconexion($idSuspension);
        if (empty($reconexiones)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $reconexiones;
    }

    /**
     * Consulta la informacion de los encabezados de suspension segun un id de
     * suscripcion
     * @param int $idSuscripcion id de la suscripcion
     * @return array informacion de los encabezados de suspension
     * @throws MyException
     */
    public function consultarSuspension($idSuscripcion) {
        $suspension = $this->suspensionModel->consultarSuspension($idSuscripcion);
        if (empty($suspension)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $suspension;
    }

    /**
     * Genera selects de html para encapsular informacion de seleccion del
     * formulario
     * @param string $codTipo nombre del combo que se renderizara
     * @return html select de html con la informacion desde la base de datos
     */
    public function consultaParametros($codTipo) {
        $idEmpresa = $this->sesion->get("idempresa");
        switch ($codTipo) {
            case COD_MOTIVOS:
                $resultado = $this->suspensionModel->consultarMotivos($codTipo, $idEmpresa);
                break;
            case COD_NOVEDADES_SUSP:
                $resultado = $this->suspensionModel->consultarNovedadesSuspension($codTipo, $idEmpresa);
                break;
            case COD_NOVEDADES_RECO:
                $resultado = $this->suspensionModel->consultarNovedadesReconexion($codTipo, $idEmpresa);
                break;
            case COD_TIPOS_SUSPENSION:
                $resultado = $this->suspensionModel->consultarTiposSuspension($codTipo, $idEmpresa);
                break;
            case C_ESTADO_SUSPENSIONES:
                $resultado = unserialize(C_ESTADO_SUSPENSIONES);
                break;
        }
        return $resultado;
    }

    /**
     * Consulta la informacion de motivos de reconexion
     * @param int $idSuspension id del encabezado de la suspension
     * @param int $idDetalle id del detalle de la suspension
     * @return array informacion de los motivos de reconexion
     * @throws MyException
     */
    public function consultarMotivosReconexion($idSuspension, $idDetalle) {
        $motivos = $this->suspensionModel->consultarMotivosRec($idSuspension, $idDetalle);
        if (empty($motivos)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $motivos;
    }

    /**
     * Modifica el estado de un detalle de suspension a estado C
     * @param type $idRegistroDetalle id del detalle de la suspension
     * @return int numero de filas afectadas 
     * @throws MyException
     */
    public function eliminarDetalleSuspension($idRegistroDetalle) {
        try {
            $this->conexion->beginTransaction();
            $resultado = $this->suspensionModel->eliminarDetalleSuspension($idRegistroDetalle);
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
    }

    /**
     * 
     * @param int $idRegistroDetalle id del detalle de la suspension
     * @return int numero de filas afectadas
     * @throws MyException
     */
    public function eliminarReconexion($idRegistroDetalle) {
        try {
            $this->conexion->beginTransaction();
            $resultado = $this->suspensionModel->eliminarReconexion($idRegistroDetalle);
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
    }

    //emergencia de terceros

    /**
     * Consulta en la base de datos por coincidencia de caracteres la informacion
     * de un tercero para todos los programas de la aplicacion
     * @param string $nombre cadena de caracteres de nombre del tercero para la
     * busqueda
     * @return array informacion del tercero
     * @throws MyException
     */
    public function consultarTerceros($nombre) {
        $terceros = $this->suspensionModel->consultarTercero($nombre);
        if (empty($terceros)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $terceros;
    }

    /**
     * Consulta en la base de datos por coincidencia de caracteres la informacion
     * de un tercero para el programa de suspensiones y reconexiones
     * @param string $nombre cadena de caracteres de nombre del tercero para la
     * busqueda
     * @return array informacion del tercero
     * @throws MyException
     */
    public function consultarTercerosClase($nombre) {
        $terceros = $this->genericoModel->consultarTercero($nombre, UNIDAD_TERCEROS_SYR);
        if (empty($terceros)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $terceros;
    }

    /**
     * Consulta los municipios con base a el valor de un campo de texto escrito
     * por el usuario
     * @param string $municipio municipio digitado por el usuario
     * @return array lista de municipios cuyos nombres coinciden con el valor
     * escrito por el usuario
     * @throws MyException
     */
    public function getMunicipio($municipio) {
        $municipios = $this->suspensionModel->autocompleteMunicipio($municipio);
        if (empty($municipios)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $municipios;
    }

    /**
     * Consulta el valor del concepto, si lo tiene; segun su id
     * @param int $concepto
     * @return array informacion del valor del concepto
     * @throws MyException
     */
    public function consultarValorConcepto($concepto) {
        $valor = $this->suspensionModel->consultarValorConcepto($concepto);
        if (empty($valor)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $valor;
    }

    /**
     * 
     * @param int $idSuspension consulta la informaicion de un detalle de
     * suspension para realizar una nueva reconexion para ese detalle
     * @return array informacion del detalle de la suspension
     * @throws MyException
     */
    public function obtenerSuspensionParaReconexion($idSuspension) {
        $idusuario = $this->sesion->get('idusuario');
        $suspension = $this->suspensionModel->consultarSuspensionParaReconexion($idSuspension, $idusuario);
        if (empty($suspension)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $suspension;
    }

    /**
     * Consulta el valor de una novedad de suspension para ser incluido en el 
     * valor total de un nuevo detalle de suspension
     * @param int $idNovedadSus id de la novedad de suspension
     * @return array informacion del valor de la novedad de suspension
     * @throws MyException
     */
    public function obtenerValorNovedadSus($idNovedadSus) {
        $valorTotal = $this->suspensionModel->consultarValorNovedadSus($idNovedadSus);
        if (empty($valorTotal)) {
            throw new MyException("La novedad no tiene un valor relacionado", 0);
        }
        return $valorTotal;
    }

    /**
     * Consulta el concepto de una novedad de suspension para ser incluido en el 
     * nuevo detalle de suspension
     * @param int $idNovedadSus id de la novedad de suspension
     * @return array informacion del valor de la novedad de suspension
     * @throws MyException
     */
    public function obtenerIdConceptoNovedadSus($idNovedadSus) {
        $valorTotal = $this->suspensionModel->consultarValorNovedadSus($idNovedadSus);
        return $valorTotal;
    }

    /**
     * Consulta el valor de una novedad de reconexion para ser incluido en el 
     * valor total de una nueva reconexion
     * @param int $idNovedadRec id de la novedad de reconexion
     * @return array informacion de la novedad de reconexion
     * @throws MyException
     */
    public function obtenerValorNovedadRec($idNovedadRec) {
        $valorTotal = $this->suspensionModel->consultarValorNovedadRec($idNovedadRec);
        if (empty($valorTotal)) {
            throw new MyException("La novedad no tiene un valor relacionado", 0);
        }
        return $valorTotal;
    }

    /**
     * Consulta el concepto de una novedad de reconexion para ser incluido en la 
     * nueva reconexion
     * @param int $idNovedadRec id de la novedad de reconexion
     * @return array informacion de la novedad de reconexion
     * @throws MyException
     */
    public function obtenerIdConceptoNovedadRec($idNovedadRec) {
        $valorTotal = $this->suspensionModel->consultarValorNovedadRec($idNovedadRec);
        return $valorTotal;
    }

    /**
     * Consulta la informacion de el ultimo detalle de suspension 
     * @param int $idEncabezado
     * @return array informacion del detalle de suspension ejecutado
     * @throws MyException
     */
    public function obtenerUltimaSuspensionEjecutada($idEncabezado) {
        $suspension = $this->suspensionModel->consultarUltimaSuspensionPorEncabezado($idEncabezado);
        if (empty($suspension)) {
            throw new MyException("La suspensión no tiene fecha de ejecución", 0);
        }
        return $suspension;
    }

    public function habilitarSSRX($idsuspension, $idregistrodetalle = null, $accion, $idreconexion = null) {
        try {
            $this->conexion->beginTransaction();
            $idEmpresa = $this->sesion->get('idEmpresa');
            $idUsuario = $this->sesion->get('idUsuario');
            $contadorHabilitar = $this->suspensionModel->habilitarSSRXModelo(PROGRAMA_SUSPENCIONES_UNO_A_UNO, $idUsuario, ESTRUCTURA_PERMISOS_USUARIO_SSRX, $idEmpresa);

            if (empty($contadorHabilitar) || $contadorHabilitar[0]['contador'] == 0) {
                throw new MyException("Usurio no tiene permisos para Habilitar", -1);
                return;
            }

            if ($accion == 'rx') {

                $this->suspensionModel->actualizarDetallereconexionHabilitar($idsuspension, $idreconexion);
                $this->conexion->commit();
                return $contadorHabilitar;
            }

            $this->suspensionModel->actualizarDetallesuspensionHabilitar($idsuspension, $idregistrodetalle);

            $this->conexion->commit();
            return $contadorHabilitar;
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            $respuesta["codigoRespuesta"] = $e->getCode();
            $respuesta["mensaje"] = $e->getMessage();
        }
    }

    public function getInformacionFacturaFinanaciacion($idSuscripcion) {

        $idEmpresa = $this->sesion->get('idEmpresa');
        return $saldos = $this->suspensionModel->getInformacionFacturaFinanaciacionSaldo($idSuscripcion, $idEmpresa);
    }
    
    public function actualizaSuscripcion($idsyr) {
        try {
            $this->conexion->beginTransaction();
           $idSuscripcion = $this->suspensionModel->getInformacionSuscripcionEncabezado($idsyr);
           if(!empty($idSuscripcion)){
               $this->suspensionModel->ActualizaSuscripcionTemporal($idSuscripcion['idsuscripcion']);
           }
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
    }

}
