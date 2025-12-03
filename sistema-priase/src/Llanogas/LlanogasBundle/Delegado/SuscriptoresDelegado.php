<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\SuscriptoresModel;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
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
class SuscriptoresDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\SuscriptoresModel 
     */
    private $suscriptoresModel;

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
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface &$sesion, &$conexion = null) {
        $this->conexion = $conexion;
        if (empty($this->conexion)) {
            $this->conexion = Util::getConexion($control);
        }
        $this->suscriptoresModel = new SuscriptoresModel($this->conexion, $sesion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $sesion;
    }

    public function consultarSuscriptor($idSuscriptor, $cedula, $idTercero) {
        if (!is_numeric($idSuscriptor) && !is_numeric($idTercero) && empty($cedula)) {
            throw new MyException('Error, Debe diligenciar al menos un campo ', -1);
        }
        return $this->suscriponesModel->filtrarSuscriptor($idSuscriptor, $cedula, $idTercero, $this->sesion->get('idusuario'));
    }

    /**
     * Consultar Terceros para la Gestion de Suscriptores 
     * @param type $idSuscriptor
     * @param type $cedula
     * @param type $idTercero
     * @return type
     * @throws MyException
     */
    public function getTerceros($cedula, $idTercero) {
        $parametros['idTercero'] = $idTercero;
        $parametros['cedula'] = $cedula;
        $listaTerceros = $this->suscriptoresModel->getTerceros($parametros);
        if (empty($listaTerceros)) {
            throw new MyException('No se encontraron registros', 0);
        }
        return $listaTerceros;
    }

    public function getConvenios() {
        $listaConvenios = $this->suscriptoresModel->getConvenios();
        return $listaConvenios;
    }

    /**
     * 
     * @param array $parametros criterios de búsqueda
     * @param string $estado Consulta todas las suscripciones que no están en esos estados (not in ('E')),
     * si es NULL se consultan todos los estados
     * @return type
     * @throws MyException
     */
    public function getSuscripciones($parametros, $estado = null) {
        $idusuario = $this->sesion->get('idusuario');
        $parametros["idempresa"] = $this->sesion->get('idempresa');
        $listaSuscripciones = $this->genericoModel->getSuscripcion($parametros, $idusuario);
        if (empty($listaSuscripciones)) {
            throw new MyException('No se encontraron suscripciones vinculados a este suscriptor ', 0);
        }
        return $listaSuscripciones;
    }

    /**
     * Consulta los Posibles convenios a los cuales se puede trasladar una Suscripcion
     * @param type $parametros
     */
    public function getConveniosTrasladar($parametros) {
        if (empty($parametros['tercero'])) {
            throw new MyException('No se ha recibido ningún tercero', 0);
        }
        if (empty($parametros['suscriptor'])) {
            throw new MyException('No se ha recibido ningún suscriptor', 0);
        }
        if (empty($parametros['tiposuscripcion'])) {
            throw new MyException('No se ha recibido ningún tipo de suscripción', 0);
        }
        if (empty($parametros['suscripcion'])) {
            throw new MyException('No se ha recibido ninguna suscripcion', 0);
        }
        $conveniostrasladar = $this->suscriptoresModel->getConveniosTrasladar($parametros);
        if (empty($conveniostrasladar)) {
            throw new MyException('No se encontraron registros de Convenios o la Suscripcion tiene un traslado Temporal', 0);
        }
        return $conveniostrasladar;
    }

    public function grabarSuscriptor($suscriptores) {
        if (empty($suscriptores)) {
            throw new MyException('No se ha recibido ningún suscriptor nuevo', 0);
        }
        try {
            $this->conexion->beginTransaction();
            $idsuscriptor = '' ;
            
            foreach ($suscriptores as $SuscriptorGrabar) {
                $SuscriptorGrabar['idusuario']=$this->sesion->get('idusuario');
                $idsuscriptor .= " Sus : ". $this->suscriptoresModel->grabarSuscriptor($SuscriptorGrabar);
                
            }
            $this->conexion->commit();
            return $idsuscriptor ;
        } catch (\Exception $sql) {
            $this->conexion->rollBack();
            throw new MyException($sql->getMessage(), -1);
        }
    }

    public function actualizarTraslados($traslados) {
        if (empty($traslados)) {
            throw new MyException('No se ha recibido suscripciones para trasladar', 0);
        }
        try {
            $this->conexion->beginTransaction();
            foreach ($traslados as $TrasladoActualizar) {
                $TrasladoActualizar['idusuario'] = $this->sesion->get('idusuario');
                $idTraslado = $this->suscriptoresModel->actualizarTraslado($TrasladoActualizar);
            }
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException($ex->getMessage(), -1);
        }
    }

}
