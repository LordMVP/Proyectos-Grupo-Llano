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
use Llanogas\LlanogasBundle\Models\RecaudosModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Description of GenerarGestionCarteraDelegado
 *
 * Clase encargada de generar las suscripciones que se va a realizar
 * el seguimiento de cartera
 * 
 * @author mebonilla
 */
class GenerarGestionCarteraDelegado {

    /**
     * Conexión a la base de datos
     * @var Connection 
     */
    private $conexion;

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
     *
     * @var GestionCarteraModel 
     */
    private $gestionCarteraModel;
    private $sesion;

    public function __construct(Controller &$control, SessionInterface &$sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->recaudosModel = new RecaudosModel($this->conexion);
        $this->gestionCarteraModel = new GestionCarteraModel($this->conexion, $sesion);
        $this->sesion = $sesion;
    }

    /**
     * Consulta una factura de una gestión
     * @param int $idFactura identificador de la facturas
     * @return array Detalle de la factura
     */
    public function consultarInformacionFacturaPorId($idFactura) {
        $genericoModel = new GenericoModel();
        $genericoModel->setConexion($this->conexion);
        return $genericoModel->consultarFactura($idFactura);
    }

    /**
     * Consulta los tipos de documentos de las suscripciones
     * @return array informacion de los tipos de documentos de suscripciones
     * @throws MyException
     */
    public function obtenerTipoDocumento() {
        $tipoDocumentos = $this->gestionCarteraModel->consultarTipoDocumentos();
        if (empty($tipoDocumentos)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $tipoDocumentos;
    }

    /**
     * Consulta los documentos pertenecientes a un tipo de documento especifico
     * @param int $idTipoDocumento id del tipo de documento
     * @return type
     * @throws MyException
     */
    public function obtenerDocumentosPorTipoDocumento($idTipoDocumento) {
        $tipoDocumentos = $this->gestionCarteraModel->consultarDocumentosPorTipoDocumento($idTipoDocumento);
        if (empty($tipoDocumentos)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $tipoDocumentos;
    }

    /**
     * Consulta las suscripciones con saldo que se encuentren en estado activo
     * @param array $parametros parametros de consulta de la suscripcion
     * @return array informacion de las suscripciones
     * @throws MyException
     */
    public function obtenerSuscripcionesConSaldo($parametros) {
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $suscripciones = $this->gestionCarteraModel->consultarSuscripcionesConSaldo($parametros);

        if (empty($suscripciones)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $suscripciones;
    }

    /**
     * Consulta la informacion del ciclo, el periodo y el año activo de una
     * suscripcion
     * @param int $idSuscripcion id de la suscripcion
     * @return array informacion del ciclo periodo
     * @throws MyException
     */
    public function obtenerCicloPeriodoSuscripcion($idSuscripcion) {
        $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($idSuscripcion);
        if (empty($cicloPeriodo)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $cicloPeriodo;
    }

    /**
     * Consulta los tipos de suscripcion de una empresa
     * @param int $idEmpresa id de la empresa a consultar
     * @return array informacion de los tipos de suscripcion
     * @throws MyException
     */
    public function obtenerTiposSuscripcion($idEmpresa) {
        $tiposSuscripcion = $this->recaudosModel->consultarTiposSuscripcion($idEmpresa);
        if (empty($tiposSuscripcion)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $tiposSuscripcion;
    }

    /**
     * Guarda las facturas que se quieren gestionar la cartera.
     * @param array $suscripciones  Suscripciones que se quiere realizar la gestión.
     */
    public function generarGestionCartera($suscripciones) {
        $resultado = 0;
        try {
            $this->conexion->beginTransaction();
            foreach ($suscripciones as $suscripcion) {
                $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($suscripcion["idsuscripcion"]);
                $datos["idsuscripcion"] = $suscripcion["idsuscripcion"];
                $datos["idciclo"] = $cicloPeriodo["idciclo"];
                $datos["idperiodo"] = $cicloPeriodo["idperiodo"];
                $datos["cicloanio"] = $cicloPeriodo["cicloanio"];
                $idGestion = $this->gestionCarteraModel->insertarGestion($datos);
                /**
                 * Se recorren las facturas de la suscripción que se le va a realizar el seguimiento
                 */
                foreach ($suscripcion["facturas"] as $factura) {
                    $informacionGestionFactura = $this->genericoModel->consultarFactura($factura["idfactura"]);
                    $informacionGestionFactura["idgestion"] = $idGestion;
                    $informacionGestionFactura["idFactura"] = $factura["idfactura"];
                    $resultado += $this->gestionCarteraModel->insertarFacturasGestion($informacionGestionFactura);
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
     * Consulta los municipios con base a el valor de un campo de texto escrito por el usuario
     * @param string $municipio municipio digitado por el usuario
     * @return array lista de municipios cuyos nombres coinciden con el valor escrito por el usuario
     * @throws MyException
     */
    public function getMunicipio($municipio) {
        $municipios = $this->gestionCarteraModel->autocompleteMunicipio($municipio);
        if (empty($municipios)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $municipios;
    }

    /**
     * Consulta los ciclos activos de la empresa
     * @return type
     */
    public function getCicloActivosPrograma() {
        $idempresa = $this->sesion->get('idempresa');
        return $this->genericoModel->getCiclosActivosPrograma($idempresa, PROGRAMA_GENERAR_GESTION_CARTERA);
    }

}
