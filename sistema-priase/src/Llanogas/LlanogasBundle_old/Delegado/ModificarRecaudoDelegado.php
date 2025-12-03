<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Models\AnularModel;
use Llanogas\LlanogasBundle\Models\LiquidacionesModel;
use Llanogas\LlanogasBundle\Models\ModificarRecaudoModel;
use Llanogas\LlanogasBundle\Models\RecaudosModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Description of ModificarRecaudoDelegado
 *
 * @author mebonilla
 */
class ModificarRecaudoDelegado {

    /**
     * Conexión a la base de datos
     * @var Connection 
     */
    private $conexion;

    /**
     *
     * @var AnularModel
     */
    private $anularModel;

    /**
     *
     * @var RecaudosModel
     */
    private $recaudosModel;

    /**
     *
     * @var LiquidacionesModel
     */
    private $liquidacionesModel;

    /**
     *
     * @var ModificarRecaudoModel 
     */
    private $modificarRecaudoModel;

    /**
     * Sesión del usuario
     * @var SessionInterface
     */
    private $sesion;

    public function __construct(Controller &$control, SessionInterface &$sesion) {
        $this->conexion = Util::getConexion($control);
        $this->anularModel = new AnularModel($this->conexion);
        $this->recaudosModel = new RecaudosModel($this->conexion);
        $this->liquidacionesModel = new LiquidacionesModel($this->conexion, $sesion);
        $this->modificarRecaudoModel = new ModificarRecaudoModel($this->conexion, $sesion);
        $this->sesion = $sesion;
    }

    /**
     * Consulta los recaudos realizados segun una serie de parametros
     * @param int $municipio id del municipio
     * @param date $fechaIni fecha inicial del intervalo de creacion del recaudo
     * @param date $fechaFin fecha final del intervalo de creacion del recaudo
     * @param int $documento id del documento de la suscripcion
     * @param int $suscripcion id de la suscripcion
     * @param int $terDocumento numero de documento del suscriptor
     * @param int $codigoAnterior codigo anterior de la suscripcion
     * @return array informacion del recaudo
     * @throws MyException
     */
    public function getRecaudos($municipio = "", $fechaIni = "", $fechaFin = "", $documento = "", $suscripcion = "", $terDocumento = "", $codigoAnterior = "", $idRecaudo = "") {
        $recaudos = $this->modificarRecaudoModel->buscarRecaudo($municipio, $fechaIni, $fechaFin, $documento, $suscripcion, $terDocumento, $codigoAnterior, $idRecaudo);
        if (empty($recaudos)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $recaudos;
    }

    /**
     * Consulta la suscripcion a la que pertenece un recaudo
     * @param int $idRecaudo
     * @return array informacion de la suscripcion
     * @throws MyException
     */
    public function getSuscripcionRecaudo($idRecaudo) {
        $suscripciones = $this->anularModel->buscarSuscripcionesRecaudo($idRecaudo);
        /*if (empty($suscripciones)) {
            throw new MyException("No se encontraron registros", 0);
        }*/
        return $suscripciones;
    }

    /**
     * Consulta las facturas pertenecientes a un recaudo
     * @param int $idRecaudo
     * @return array informacion de las facturas del recaudo
     * @throws MyException
     */
    public function getFacturasRecaudo($idRecaudo) {
        $facturas = $this->anularModel->buscarFacturasRecaudo($idRecaudo);
       /* if (empty($facturas)) {
            throw new MyException("No se encontraron registros", 0);
        }*/
        return $facturas;
    }

    /**
     * Consulta la informacion de medios de pago para un usuario y una empresa
     * determinada
     * @param int $idEmpresa id de la empresa del usuario de la sesion
     * @param int $idUsuario id del usuario de la sesion
     * @return array informacion de los medios de pago
     * @throws MyException
     */
    public function getMediosPagos($idEmpresa, $idUsuario) {
        $mediosPagos = $this->recaudosModel->consultarMedio($idEmpresa, $idUsuario);
        if (empty($mediosPagos)) {
            throw new MyException("No se encontraron formas de pago", 0);
        }
        return $mediosPagos;
    }
    
    public function getDocumentosValidosXCambio($idEmpresa, $idUsuario,$idRecaudo) {
        $Documentosvalidos = $this->recaudosModel->consultarDocumentosValidosXCambio($idEmpresa, $idUsuario,$idRecaudo,PROGRAMA_MODIFICACION_RECAUDO);
        if (empty($Documentosvalidos)) {
            throw new MyException("No se encontraron documentos", 0);
        }
        return $Documentosvalidos;
    }
    /**
     * Consulta por coincidencia de texto los municipios a los que el usuario de 
     * la sesion puede acceder.
     * @param string $municipio caracteres del municipio
     * @return array informacion de los municipios
     * @throws MyException
     */
    public function getMunicipiosAutocomplete($municipio) {
        $municipios = $this->modificarRecaudoModel->autocompleteMunicipio($municipio);
        if (empty($municipios)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $municipios;
    }

    /**
     * Consulta las sucursales de pago de recaudos para el programa de modificar
     * recaudo
     * @return array informacion de las sucursales
     */
    public function getSucursales() {
        $idUsuario = $this->sesion->get('idusuario');
        $sucursales = $this->recaudosModel->consultarSucursal(PROGRAMA_MODIFICACION_RECAUDO, $idUsuario);
        /* if(empty($sucursales)){
          throw new MyException("Error, No se encontraron registros", 0);
          } */
        return $sucursales;
    }

    /**
     * Consulta la informacion de las clases de pago para el programa de 
     * modificar recaudo
     * @return array informacion de las clases de pago
     * @throws MyException
     */
    public function getClasePago() {
        $clases = $this->modificarRecaudoModel->consultarClasePago();
        if (empty($clases)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $clases;
    }

    /**
     * Modifica la informacion del recaudo
     * @param int $idRecaudo id del recaudo
     * @param int $idMedioPago id del medio de pago
     * @param int $idSucursal id de la sucursal
     * @param int $fechaPago id de la fecha de pago
     * @return int numero de filas modificadas por la actualizacion
     * @throws MyException
     */
    public function actualizarLiquidacion($idRecaudo, $idMedioPago, $idSucursal, $fechaPago, $formaspagos,$iddocumento) { //
        $this->conexion->beginTransaction();
        try {
            $resultado = $this->modificarRecaudoModel->modificaRecaudo($idRecaudo, $idMedioPago, $idSucursal, $fechaPago,$iddocumento);
            $this->actualizarformasdepagos($idRecaudo, $formaspagos);
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
    }

    /**
     * Conultas las formas de pago del recaudo y su informacion adocional 
     * @param type $idrecaudo
     * @return type
     */
    public function getFormasPago($idrecaudo) {
        $resultadofinal = array();
        $resultado = $this->modificarRecaudoModel->consultarformaspago($idrecaudo);
        foreach ($resultado as $formapago) {
            $informacionadicional = $this->modificarRecaudoModel->consultarinformacionadicionalformaspago($formapago['idformapago']);
            if (!empty($informacionadicional)) {
                $formapago['informacionAdicional'] = $informacionadicional;
                $formapago['idbanco'] = $informacionadicional[0]['idbanco'];
            }
            $resultadofinal[] = $formapago;
        }
        return $resultadofinal;
    }

    /**
     * Se actualizan las formas de pagos
     * @param type $idRecaudo
     * @param type $formaspagos
     * @throws MyException
     */
    public function actualizarformasdepagos($idRecaudo, $formaspagos) {
        try {
            $this->eliminarFormasPagos($idRecaudo);
            $valorllegada = 0;
            foreach ($formaspagos as $formapago) {
                $idformapago = $this->modificarRecaudoModel->insertarFormaPago($formapago);
                if (!empty($formapago['informacionAdicional'])) {
                    $formapago['idformapago'] = $idformapago;
                    $this->actualizarInfoAdicional($formapago);
                }
                $valorllegada += $formapago['valorpagado'];
            }
            $this->validarValorRecaudo($idRecaudo, number_format($valorllegada, 7, ".", ""));
        } catch (Exception $exc) {
            throw new MyException($exc->getMessage(), -1);
        }
    }

    /**
     * Valida el volor del recaudo contra la suma total las formas de pago
     * @param type $idrecaudo
     * @param type $valoractual
     * @throws MyException
     */
    public function validarValorRecaudo($idrecaudo, $valoractual) {
        $valorreal = $this->modificarRecaudoModel->consultaValorRecaudoReal($idrecaudo);
        if ($valorreal['valorreal'] != $valoractual) {
            throw new MyException('El valor de las formas de pagos no es igual al recaudo', -1);
        }
    }

    /**
     * Elimina todas las formas de pago de un recaudo por el id del recaudo
     * @param type $idrecaudo
     */
    public function eliminarFormasPagos($idrecaudo) {
        $resultado = $this->getFormasPago($idrecaudo);
        foreach ($resultado as $formapago) {
            $this->modificarRecaudoModel->eliminaInformacionAdiciona($formapago['idformapago']);
        }
        $this->modificarRecaudoModel->eliminarFormasPagos($idrecaudo);
    }

    /**
     * Actualiza la informacion adicional de las formas de pago 
     * @param type $formapago
     */
    public function actualizarInfoAdicional($formapago) {
        foreach ($formapago['informacionAdicional']as $infoadiciona) {
            $informacion = array();
            $informacion['informacion'] = $infoadiciona['informacion'];
            $informacion['unidadFormaPago'] = $formapago['idtipoformapago'];
            $informacion['nombreTipificacion'] = $infoadiciona['nompretipoinformacion'];
            $informacion['idFormaPago'] = $formapago['idformapago'];
            $informacion['tipificacion'] = $infoadiciona['idtipoinformacion'];
            $informacion['idBanco'] = $formapago['idbanco'];
            $informacion['idusuario'] = $this->sesion->get('idusuario');
            $this->recaudosModel->insertarInformacionAdicional($informacion);
        }
    }
    
    /**
     * Consulta la distibucion de un recaudo
     * @param int $idRecaudo
     * @return array informacion de la distibucion del recaudo
     * @throws MyException
     */
    public function getDistribucionRecaudo($idRecaudo) {
        $distribucion = $this->modificarRecaudoModel->getRecaudosIdRecaudo($idRecaudo);
        return $distribucion;
    }
    
     /**
     * lista los tipos de documento asociados al tipo de uso de la suscripción
     */
    public function obtenerTiposDocumentoPorTipoUso($idsuscripcion) {
        $idusuario = $this->sesion->get('idusuario');
        $idempresa = $this->sesion->get('idempresa');
        return $this->modificarRecaudoModel->obtenerTiposDocumentoPorTipoUsoModel($idsuscripcion, PROGRAMA_ANTICIPOS_ID, $idusuario, $idempresa);
    }
    
    public function setDistribucionRecaudo($idSuscripcion,$idRecaudo,$idTipodocumento,$idDocumento = null, $idConcepto = null,$idPeriodo = null) {
        $idusuario = $this->sesion->get('idusuario');
        $idempresa = $this->sesion->get('idempresa');
        //print_r($idDocumento);
        //print_r($idConcepto);
        $parametros['uni_documento'] = null;
        $parametros['uni_concepto'] = null;       
        $parametros['per_ideaplica'] = null;       
        if($idDocumento > 0){
            $parametros['uni_documento'] = $idDocumento;
        }
        if($idConcepto > 0){
            $parametros['uni_concepto'] = $idConcepto;       
        }
        if($idPeriodo > 0){
            $parametros['per_ideaplica'] = $idPeriodo;       
        }
        $parametros['rec_ideregistro'] = $idRecaudo ;
        $parametros['uni_tipdocument'] = $idTipodocumento;
        $parametros['dsus_ideregistr'] = $idSuscripcion;
        return $this->modificarRecaudoModel->setDistribucionRecaudo($parametros);
    }
    public function validaRecaudoSet($idRecaudo) {
        return $this->modificarRecaudoModel->validaRecaudoSet($idRecaudo);
    }

}
