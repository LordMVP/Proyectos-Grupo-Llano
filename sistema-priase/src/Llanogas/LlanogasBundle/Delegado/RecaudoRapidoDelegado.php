<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\RecaudoRapidoModel;
use Llanogas\LlanogasBundle\Models\RecaudosModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Description of RecaudoRapidoDelegado
 *
 * @author mebonilla
 */
class RecaudoRapidoDelegado {

    /**
     * Conexión a la base de datos
     * @var Connection 
     */
    private $conexion;

    /**
     *
     * @var RecaudoRapidoModel 
     */
    private $recaudoRapidoModel;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var RecaudosModel
     */
    private $recaudosModel;

    /**
     * Sesión del usuario
     * @var SessionInterface
     */
    private $sesion;

    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->recaudoRapidoModel = new RecaudoRapidoModel($this->conexion, $sesion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->recaudosModel = new RecaudosModel($this->conexion);
        $this->sesion = $sesion;
    }

    /**
     * Obtiene del model el valor del campo que permite hacer registros de
     * recaudador externo
     * @return array informacion de recaudador externo
     * @throws MyException lanzada al recibir el arreglo de la consulta vacio
     */
    public function obtenerRecaudadorExterno() {
        $idUsuario = $this->sesion->get('idusuario');
        $recaudadorExterno = $this->recaudoRapidoModel->consultarRecaudadorExterno($idUsuario);
        if (empty($recaudadorExterno)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $recaudadorExterno;
    }

    /**
     * Obtiene del model la lista de las empresas que tienen convenio con la empresa a la que 
     * pertenece el usuario logueado
     * @return array resultado de la consulta del model
     * @throws MyException Lanzada al recibir el arreglo de la consulta vacio
     */
    public function obtenerEmpresasRecaudo() {
        $idEmpresa = $this->sesion->get("idempresa");
        $empresasRecaudo = $this->recaudoRapidoModel->consultarEmpresasRecaudo($idEmpresa);
        if (empty($empresasRecaudo)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $empresasRecaudo;
    }

    /**
     * Obtiene del model la lista de los tipos de documento para anticipos
     * @return array resultado de la consulta del model
     * @throws MyException Lanzada al recibir el arreglo de la consulta vacio
     */
    public function obtenerTiposDocumentoAnticipos($idSuscripcion) {
        $tiposDocumento = $this->recaudoRapidoModel->consultarTiposDocumentoAnticipos($idSuscripcion);
        if (empty($tiposDocumento)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $tiposDocumento;
    }

    /**
     * Obtiene del model la llista de los documentos asociados a los anticipos
     * @return array resultado de la consulta del model
     * @throws MyException Lanzada al recibir el arreglo de la consulta vacio
     */
    public function obtenerDocumentosAnticipos() {
        $documentos = $this->recaudoRapidoModel->consultarDocumentosAnticipos();
        if (empty($documentos)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $documentos;
    }

    /**
     * Obtiene del generico model la informacion de la suscripcion segun el id de la suscripcion
     * y el id del usuario en sesion
     * @param type $idSuscripcion id de la suscripcion
     * @return array informacion de la suscripcion
     * @throws MyException
     */
    public function obtenerInformacionSuscripcion($idSuscripcion) {
        $parametros["idsuscripcion"] = $idSuscripcion;
        $parametros["idempresa"] = $this->sesion->get('idempresa');
        $idusuario = $this->sesion->get("idusuario");
        $suscripcion = $this->genericoModel->getSuscripcion($parametros, $idusuario);
        $nparametros["idsuscriptor"] = $suscripcion[0]["idsuscriptor"];
        $infoSuscripcion["suscripcion"] = $this->genericoModel->getSuscripcion($nparametros, $idusuario);
        if (empty($infoSuscripcion)) {
            throw new MyException("No se encontraron registros", 0);
        }
        $tipoDocumentos = $this->obtenerTiposDocumentoAnticipos($idSuscripcion);
        if (empty($tipoDocumentos)) {
            throw new MyException("Error, No se encontraron tipos de documento para anticipos de la suscripción", 0);
        }
        $infoSuscripcion["tipodocumentoanticipos"] = $tipoDocumentos;
        return $infoSuscripcion;
    }

    /**
     * Consulta la informacion de una suscripcion por el id de la factura
     * @param int $idFactura id de la factura
     * @return array informacion de la suscripcion
     * @throws MyException
     */
    public function obtenerSuscripcionPorFactura($idFactura) {
        $infoSuscripcion["suscripcion"] = $this->recaudoRapidoModel->consultarSuscripcionPorFacturas($idFactura);
        if (empty($infoSuscripcion)) {
            throw new MyException("No se encontraron registros", 0);
        }
        $suscripciones = $this->recaudoRapidoModel->consultarSuscripcionesPorSuscriptor($infoSuscripcion["suscripcion"]["idsuscriptor"]);
        $idsSuscripcion = $this->stringIdSuscripciones($suscripciones);
        $facturasConSaldo = $this->recaudosModel->getFacturasConSaldo($idsSuscripcion);
        if (empty($facturasConSaldo)) {
            throw new MyException('No se encontraron facturas con saldo', 0);
        }
        $infoSuscripcion["facturas"] = $facturasConSaldo;
        $parametroConceptos = array();
        foreach ($facturasConSaldo as $factura) {
            $idFacturaActual = $factura['idfactura'];
            $listaConceptos = $this->recaudosModel->getConceptosFactura($idFacturaActual);
            foreach ($listaConceptos as $concepto) {
                $parametroConceptos[] = $concepto;
            }
        }
        $infoSuscripcion['conceptos'] = $parametroConceptos;
        if (empty($infoSuscripcion["facturas"])) {
            throw new MyException("No se encontraron registros de facturas", 0);
        }
        $tipoDocumentos = $this->obtenerTiposDocumentoAnticipos($infoSuscripcion["suscripcion"]["idsuscripcion"]);
        if (empty($tipoDocumentos)) {
            throw new MyException("Error, No se encontraron tipos de documento para anticipos de la suscripción", 0);
        }
        $infoSuscripcion["tipodocumentoanticipos"] = $tipoDocumentos;
        return $infoSuscripcion;
    }

    /**
     * Consulta las facturas pertenecientes a una suscripcion
     * @param int $suscripcion id de la suscripcion
     * @return array informacion de las facturas de la suscripcion
     * @throws MyException
     */
    public function obtenerFacturasSuscripcion($suscripcion) {
        $suscripciones = $this->recaudoRapidoModel->consultarSuscripcionesConvenioSuscriptor($suscripcion);
        $idsSuscripcion = $this->stringIdSuscripciones($suscripciones);
        $facturasConSaldo = $this->recaudosModel->getFacturasConSaldo($idsSuscripcion);
        if (empty($facturasConSaldo)) {
            throw new MyException('No se encontraron facturas con saldo', 0);
        }
        $infoSuscripcion["facturas"] = $facturasConSaldo;
        $parametroConceptos = array();
        foreach ($facturasConSaldo as $factura) {
            $idFacturaActual = $factura['idfactura'];
            $listaConceptos = $this->recaudosModel->getConceptosFactura($idFacturaActual);
            foreach ($listaConceptos as $concepto) {
                $parametroConceptos[] = $concepto;
            }
        }
        $infoSuscripcion['conceptos'] = $parametroConceptos;
        if (empty($infoSuscripcion["facturas"])) {
            throw new MyException("No se encontraron registros de facturas", 0);
        }
        $tipoDocumentos = $this->obtenerTiposDocumentoAnticipos($suscripcion);
        if (empty($tipoDocumentos)) {
            throw new MyException("Error, No se encontraron tipos de documento para anticipos de la suscripción", 0);
        }
        $infoSuscripcion["tipodocumentoanticipos"] = $tipoDocumentos;
        return $infoSuscripcion;
    }

    /**
     * A partir de un arreglo de suscripciones realiza un implode del atributo
     * id de cada uno de los objetos retornando en una cadena de caracteres
     * separados por comas los ids para incluirlos en un IN de una consulta SQL
     * @param array $idSuscripciones
     * @return type
     */
    private function stringIdSuscripciones(array $idSuscripciones) {
        $ids = array();
        foreach ($idSuscripciones as $sus) {
            $ids[] = $sus["idsuscripcion"];
        }
        return implode(",", $ids);
    }

    /**
     * Genera un select de html co la informacion solicitada a la base de datos
     * a traves de una consulta
     * @param string $codTipo nombre el combo que va a ser generado
     * @param int $tipoDocumento id del tipo de documento
     * @return html select de html con la informacion de la base de datos
     */
    public function cargarComboDb($codTipo, $tipoDocumento = '') {
        $idEmpresa = $this->sesion->get('idempresa');
        $idUsuario = $this->sesion->get('idusuario');
        switch ($codTipo) {
            case 'cmbMedioPago':
                $resultado = $this->recaudosModel->consultarMedio($idEmpresa, $idUsuario);
                break;
            case 'cmbDocumentos':
                $resultado = $this->recaudoRapidoModel->consultarClaseAnticipos($tipoDocumento, $idUsuario, $idEmpresa);
                break;
        }
        $listaDatos = array();
        foreach ($resultado as $campos) {
            $listaDatos[$campos['id']] = $campos['nombre'];
        }
        return Util::crearCombo($codTipo, $listaDatos);
    }
    /*
     * Metodo que retorna las facturas que han sido marcadas como no homologadas 
     */
    public function obtenerFacturasSuscripcionCarteraNoHomologada($suscripcion) {
        $suscripciones[0]['idsuscripcion'] = $suscripcion ; 
        $idsSuscripcion = $this->stringIdSuscripciones($suscripciones);
        $CarteraAseoNoHomologada = 1 ;
        $facturasConSaldo = $this->recaudosModel->getFacturasConSaldo($idsSuscripcion,$CarteraAseoNoHomologada);
        if (empty($facturasConSaldo)) {
            throw new MyException('No se encontraron facturas Cartera Aseo No Homologadas con saldo', 0);
        }
        $infoSuscripcion["facturas"] = $facturasConSaldo;
        $parametroConceptos = array();
        foreach ($facturasConSaldo as $factura) {
            $idFacturaActual = $factura['idfactura'];
            $listaConceptos = $this->recaudosModel->getConceptosFactura($idFacturaActual);
            foreach ($listaConceptos as $concepto) {
                $parametroConceptos[] = $concepto;
            }
        }
        $infoSuscripcion['conceptos'] = $parametroConceptos;
        if (empty($infoSuscripcion["facturas"])) {
            throw new MyException("No se encontraron registros de facturas", 0);
        }
        $tipoDocumentos = $this->obtenerTiposDocumentoAnticipos($suscripcion);
        if (empty($tipoDocumentos)) {
            throw new MyException("Error, No se encontraron tipos de documento para anticipos de la suscripción", 0);
        }
        $infoSuscripcion["tipodocumentoanticipos"] = $tipoDocumentos;
        return $infoSuscripcion;
    }

}
