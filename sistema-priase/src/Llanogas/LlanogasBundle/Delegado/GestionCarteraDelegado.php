<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\GestionCarteraModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Description of GestionCarteraDelegado
 *
 * @author mebonilla
 */
class GestionCarteraDelegado {

    /**
     * Conexión a la base de datos
     * @var Connection 
     */
    private $conexion;

    /**
     *
     * @var GestionCarteraModel 
     */
    private $gestionCarteraModel;

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
        $this->gestionCarteraModel = new GestionCarteraModel($this->conexion, $sesion);
        $this->sesion = $sesion;
    }

    /**
     * Consulta las suscripciones que tienen una gestion
     * @param int $idSuscripcion
     * @param int $documento
     * @param int $codigoAnterior
     * @return array
     * @throws MyException
     */
    public function obtenerFiltroSuscripcionesGestion($idSuscripcion, $documento, $codigoAnterior) {
        $suscripciones = $this->gestionCarteraModel->filtrarSuscripcionesGestion($idSuscripcion, $documento, $codigoAnterior);
        if (empty($suscripciones)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $suscripciones;
    }

    /**
     * Consulta las facturas de una suscripcion seleccionada
     * @param int $idSuscripcion id de la suscripcion
     * @return type
     * @throws MyException
     */
    public function obtenerFacturasPorSuscripcion($idSuscripcion,$idseguimiento) {
        $facturas = $this->gestionCarteraModel->consultarFacturasPorSuscripcion($idSuscripcion,$idseguimiento);
        if (empty($facturas)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $facturas;
    }

    /**
     * Consulta los tipos de documento de una suscripcion
     * @param int $idSuscripcion id de la suscripcion
     * @return array informacion de los tipos de documento
     * @throws MyException
     */
    public function obtenerTiposDocumentosPorSuscripcion($idSuscripcion) {
        $tipoDocumentos = $this->gestionCarteraModel->consultarTipoDocumentosPorSuscripcion($idSuscripcion);
        if (empty($tipoDocumentos)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $tipoDocumentos;
    }

    /**
     * Obtiene los documentos de una suscripcion segun su tipo de documento
     * @param type $idSuscripcion id de la suscripcion
     * @param type $idTipoDocumento id del tipo de documento
     * @return array informacion del documento 
     * @throws MyException
     */
    public function obtenerDocumentosPorSuscripcionTipoDocumento($idSuscripcion, $idTipoDocumento) {
        $documentos = $this->gestionCarteraModel->consultarDocumentosPorSuscripcionyTipoDocumento($idSuscripcion, $idTipoDocumento);
        if (empty($documentos)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $documentos;
    }

    /**
     * Consulta la siguiente y/o anterior suscripción de la gestión
     * @param int $idGestionActual id de la gestion
     * @param string $opcion define si es la suscripcion anterior o la actual
     * @return array informacion de la suscripcion consultada
     * @throws MyException
     */
    public function obtenerSuscripcionSiguienteAnterior($idGestionActual, $opcion) {
        $suscripciones = $this->gestionCarteraModel->consultarSuscripcionSiguienteAnterior($idGestionActual, $opcion);
        if (empty($suscripciones)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $suscripciones;
    }

    /**
     * Consulta la primera y/o última suscripción de la gestión
     * @param string $orden tipo de ordenamiento de la consulta "asc" ó "desc"
     * @return array informacion de la suscripcion consultada
     * @throws MyException
     */
    public function obtenerSuscripcionPrimeroUltimo($orden) {
        $suscripciones = $this->gestionCarteraModel->consultarSuscripcionPrimeroUltimo($orden);
        if (empty($suscripciones)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $suscripciones;
    }

    /**
     * Guarda la actualizacion de informacion de una gestión existente
     * @param type $parametros parametros de la actualización
     * @return int id de registro de la gestión
     * @throws MyException
     */
    public function guardarGestionCartera($parametros) {
        try {
            $this->conexion->beginTransaction();
            $this->gestionCarteraModel->consultarGestion($parametros['idgestion']);
            $this->actualizarGestion($parametros);
            $resultado = $this->insertarDetalleGestion($parametros);
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
    }

    /**
     * Inserta una nueva gestión para una suscripción 
     * @param array $parametros parametros de insersion de una nueva gestión
     */
    private function insertarDetalleGestion($parametros) {
        $resultado = 0;
        foreach ($parametros['seguimientos'] as $seguimiento) {
            $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($parametros['idsuscripcion']);
            $informacionUnidad = $this->genericoModel->consultarEstructuraPorIdUnidad($seguimiento['idmediocomunicacion']);
            $detalleGestion['idciclo'] = $cicloPeriodo['idCiclo'];
            $detalleGestion['idperiodo'] = $cicloPeriodo['idPeriodo'];
            $detalleGestion['cicano'] = $cicloPeriodo['cicloanio'];
            $detalleGestion['idfacturagestion'] = ($seguimiento['idfacturagestion'] == -1) ? null : $seguimiento['idfacturagestion'];
            $detalleGestion['idgestion'] = $parametros['idgestion'];
            $detalleGestion['idmediocomunicacion'] = $seguimiento['idmediocomunicacion'];
            if (empty($seguimiento['idetapa'])) {
                throw new MyException("La etapa del seguimiento es obligatoria", -1);
            }
            $detalleGestion['idetapa'] = $seguimiento['idetapa'];
            $detalleGestion['idestructuramediocomunicacion'] = $informacionUnidad['idestructura'];
            $idDetalleGestion = $this->gestionCarteraModel->insertarDetalleGestion($detalleGestion);
            $detalleGestion['iddetallegestion'] = $idDetalleGestion;
            $this->insertarInformacionAdicional($seguimiento['informacion'], $detalleGestion);
            $this->insertarAdjuntosGestion($seguimiento, $idDetalleGestion);
            $resultado = $idDetalleGestion;
        }
        return $resultado;
    }

    /**
     * Actualiza los archivos adjuntos de la gestión
     * @param array $seguimiento informacion de los archivos adjuntos del
     * seguimiento
     * @param int $idDetalleGestion id de la gestión
     */
    private function insertarAdjuntosGestion($seguimiento, $idDetalleGestion) {
        if (isset($seguimiento["archivos"])) {
            foreach ($seguimiento["archivos"] as $archivo) {
                $this->gestionCarteraModel->actualizarAdjuntoDetalleGestion($archivo["idarchivo"], $idDetalleGestion);
            }
        }
    }

    /**
     * Inserta la información adicional de la suscripción
     * @param array $informaciones datos de la informacion adicional
     * @param type $detalleGestion id de la gestión
     */
    private function insertarInformacionAdicional($informaciones, $detalleGestion) {
        foreach ($informaciones as $campo) {
            $informacion['valor'] = $campo['valor'];
            $informacion['nombre'] = $campo['nombre'];
            $informacion['iddetallegestion'] = $detalleGestion['iddetallegestion'];
            $informacion['idestructuramediocomunicacion'] = $detalleGestion['idestructuramediocomunicacion'];
            $informacion['idmediocomunicacion'] = $detalleGestion['idmediocomunicacion'];
            $informacion['idtipificacion'] = $campo['idtipificacion'];
            $this->gestionCarteraModel->insertarInformacionAdicional($informacion);
        }
    }

    /**
     * Consulta el historial del proceso de la gestión
     * @param int $idGestion id de la gestion
     * @return array informacion del historico de la gestion
     * @throws MyException
     */
    public function obtenerHistorico($idGestion) {
        $historico = $this->gestionCarteraModel->consultarHistorico($idGestion);
        if (empty($historico)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $historico;
    }

    /**
     * Guarda un archivo adjunto de tipo pdf a la gestion
     * @param array $listaArchivos
     * @return int id del archivo adjunto
     * @throws MyException
     */
    public function setArchivoGestionDetalle(array $listaArchivos) {
        try {
            $this->conexion->beginTransaction();
            $archivos = array();
            foreach ($listaArchivos as $archivo) {
                $archivo["tipoarchivo"] = "pdf";
                $archivos[] = $this->gestionCarteraModel->insertarAdjuntoDetalleGestion($archivo);
            }
            $this->conexion->commit();
            return $archivos;
        } catch (\Exception $exc) {
            print_r($exc->getMessage());
            print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
            throw new MyException('Ocurrió un problema cuando se adjuntaban los archivos', -1);
        }
    }

    /**
     * Consulta una lista de etapas para la gestion
     * @return array informacion de las etapas de la gestion
     * @throws MyException
     */
    public function obtenerListaEtapas() {
        $etapas = $this->gestionCarteraModel->listaEtapaSeguimiento();
        if (empty($etapas)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $etapas;
    }

    /**
     * Actualiza el estado de la gestión
     * @param array $parametros
     */
    public function actualizarGestion($parametros) {
        $data['ges_estado'] = $parametros['estado'];
        $data['ges_ideregistro'] = $parametros['idgestion'];
        $this->gestionCarteraModel->actualizar($data, 'ges_gestion', 'ges_ideregistro = :ges_ideregistro');
    }
    
    /**
     * Obtiene del modelo la informacion del detalle de la gestion para su
     * visualizacion en la interfaz de historico
     * @param int $idDetalleGestion id del detalle de gestion
     * @return array informacion del historico del detalle de la gestion
     * @throws MyException si no se obtienen regisros del detalle de la gestion
     */
    public function obtenerDetalleHistoricoGestion($idDetalleGestion){
        $detalle = $this->gestionCarteraModel->consultarDetalleGestionHistorico($idDetalleGestion);
        if(empty($detalle)){
            throw new MyException("No se encontraron registros", 0);
        }
        $detalle['adjuntos'] = $this->gestionCarteraModel->consultarArchivoAdjuntoHistorico($idDetalleGestion);
        $detalle['informacion'] = $this->gestionCarteraModel->consultarInformacionAdicionalHistorico($idDetalleGestion);
        return $detalle;
    }
}
