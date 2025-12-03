<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Description of RecaudoRapidoModel
 *
 * @author mebonilla
 */
class RecaudoRapidoModel extends AuditoriaServices {

    /**
     * Sesión del usuario
     * @var SessionInterface
     */
    private $sesion;

    public function __construct(&$conexion, &$sesion) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
    }

    /**
     * Verifica el valor del campo usu_modrecexterno para el usuario en sesion
     * con el fin de determinar si puede recibir recaudos de un recaudador
     * externo
     * @param int $idUsuario id del usuario en sesion
     * @return array resultado de la consulta
     */
    public function consultarRecaudadorExterno($idUsuario) {
        $parametros["usu_ideregistro"] = $idUsuario;
        $sql = "SELECT usu_modrecexterno recaudaexterno
                FROM usuarios usu
                WHERE usu.usu_ideregistro = :usu_ideregistro";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Realiza una consulta a la base de datos obteniendo el listado de empresas
     * que tienen convenio con la empresa a la que pertenece el usuario que se
     * encuentra logueado en el sistema
     * @param int $idEmpresa id de la empresa a la que pertenece el usuario
     * logueado
     * @return array lista de empresas que tienen convenio con la empresa del
     * usuario
     */
    public function consultarEmpresasRecaudo($idEmpresa) {
        $parametros["emp_ideregistro"] = $idEmpresa;
        $sql = "SELECT
                    DISTINCT(emp.empresa_sevemp) idempresa,
                    emp.empresa_nom empresa
                FROM
                    cnre_cnvrecaudo cnre
                INNER JOIN dicn_disconven dicn 
                ON cnre.cnre_ideregistr = dicn.cnre_ideregistr
                INNER JOIN empresas emp 
                ON dicn.emp_ideregistro = emp.empresa_sevemp
                WHERE cnre.cnre_ideregistr IN (
                    SELECT DISTINCT(dicnn.cnre_ideregistr)
                    FROM dicn_disconven dicnn
                    WHERE dicnn.emp_ideregistro = :emp_ideregistro
                )
                ORDER BY emp.empresa_nom ASC";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Obtiene la lista de tipos de documento que tienen como tipo de documento
     * anticipos 
     * @param $idSuscripcion id de la suscripcion
     * @return array tipos de documento pertenecientes a anticipos
     */
    public function consultarTiposDocumentoAnticipos($idSuscripcion) {
        $parametros["dsus_ideregistr"] = $idSuscripcion;
        $sql = "SELECT
                    tido.uni_tipdocument,
                    tido.tido_nombre
                FROM
                    dsus_detsuscrip dsus
                INNER JOIN liq_liquidacion liq ON dsus.uni_liquidacion = liq.uni_liquidacion
                INNER JOIN tido_tipdocumen tido ON liq.uni_tipdocument = tido.uni_tipdocument
                WHERE 
                dsus.dsus_ideregistr = :dsus_ideregistr";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Obtiene la lista de documentos que tienen como tipo de documento anticipos
     * @return array
     */
    public function consultarDocumentosAnticipos() {
        $parametros = array();
        $sql = "SELECT 
                    doc.uni_documento id,
                    doc.doc_nombre nombre
                FROM doc_documento doc
                WHERE doc.doc_tipo = 'AN'";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta toda la informacion de una suscripcion basado en el id de una
     * factura
     * @param int $idFactura id de la factura
     * @return array informacion de la suscripcion
     */
    public function consultarSuscripcionPorFacturas($idFactura) {
        $parametros["fac_ideregistro"] = $idFactura;
        $sql = "SELECT DISTINCT
                    sus.sus_ideregistro idsuscriptor,
                    ter.ter_ideregistro idtercero,
                    dsus.dsus_ideregistr idsuscripcion,
                    dsus.emp_ideregistro idempresa,
                    cnre.cnre_ideregistr idconvenio
                FROM
                    dsus_detsuscrip dsus
                    INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
                    INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro = dsus.sus_ideregistro
                    INNER JOIN cnre_cnvrecaudo cnre ON sus.cnre_ideregistr = cnre.cnre_ideregistr
                    INNER JOIN fac_factura fac ON fac.dsus_ideregistr = dsus.dsus_ideregistr
                WHERE fac.fac_estado = 'A' AND 
                fac.fac_numero = :fac_ideregistro";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error, no se encontró la suscripción', 0);
        }
        return $resultado[0];
    }

    /**
     * Consulta los id's de suscripcion segun un suscriptor especifico
     * @param int $idSuscriptor id del suscriptor
     * @return array informacion de los id de suscripciones del suscriptor
     */
    public function consultarSuscripcionesPorSuscriptor($idSuscriptor) {
        $parametros["sus_ideregistro"] = $idSuscriptor;
        $sql = "SELECT DISTINCT
                    dsus.dsus_ideregistr idsuscripcion
                FROM
                    sus_suscripcion sus
                INNER JOIN cnre_cnvrecaudo cnre ON sus.cnre_ideregistr = cnre.cnre_ideregistr
                INNER JOIN dicn_disconven dicn ON cnre.cnre_ideregistr = dicn.cnre_ideregistr
                INNER JOIN dsus_detsuscrip dsus ON sus.sus_ideregistro = dsus.sus_ideregistro
                INNER JOIN fac_factura fac ON dsus.dsus_ideregistr = fac.dsus_ideregistr
                WHERE
                    sus.sus_ideregistro = :sus_ideregistro";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }
    
    /**
     * Consulta el id de las suscripciones que tienen convenio con otra
     * @param int $suscripcion id de la suscripcion
     * @return array informacion de los id de las suscripciones del convenio
     */
    public function consultarSuscripcionesConvenioSuscriptor($suscripcion){
        $parametros["dsus_ideregistr"] = $suscripcion;
        $sql = "SELECT DISTINCT
                    dsus.dsus_ideregistr idsuscripcion
                FROM
                    sus_suscripcion sus
                INNER JOIN cnre_cnvrecaudo cnre ON sus.cnre_ideregistr = cnre.cnre_ideregistr
                INNER JOIN dicn_disconven dicn ON cnre.cnre_ideregistr = dicn.cnre_ideregistr
                INNER JOIN dsus_detsuscrip dsus ON sus.sus_ideregistro = dsus.sus_ideregistro
                LEFT JOIN fac_factura fac ON dsus.dsus_ideregistr = fac.dsus_ideregistr
                WHERE
                    sus.sus_ideregistro IN(
                    SELECT 
                        dsus2.sus_ideregistro 
                    FROM 
                        dsus_detsuscrip dsus2 
                    WHERE 
                        dsus2.dsus_ideregistr = :dsus_ideregistr
                )";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }
    
    /**
     * Consulta todas las clases asignadas a un programa y al usuario que
     * ingresó al sistema
     * @param string $tipoDocumento tipo de documento a consultar (AN=Anticipo,
     * AB=Abono, PA=Pago, PC=Cartera Castigada)
     * @param int $idUsuario identificador del usuario
     * @param int $idEmpresa identificador de la empresa
     * @return array Todas las clases de documento que se encontraron para el
     * usuario y programa específico
     */
    public function consultarClaseAnticipos($tipoDocumento, $idUsuario, $idEmpresa) {
        $parametros["idusuario"] = $idUsuario;
        $parametros["tipodocumento"] = $tipoDocumento;
        $parametros["idempresa"] = $idEmpresa;
        $sql = "select doc.uni_documento id, uni.uni_nombre1 nombre 
                from uspu_usuprgunid uspu
                   inner join prun_prgunidad prun on prun.prun_ideregistr=uspu.prun_ideregistr
                   inner join doc_documento doc on doc.uni_documento=prun.uni_ideregistro
                   inner join uni_unidad uni on uni.uni_ideregistro=prun.uni_ideregistro 
                   inner join esem_estempresa esem on esem.est_ideregistro=uni.est_ideregistro 
                where 
                  uspu.usu_ideregistro=:idusuario 
                  and doc.doc_tipo=:tipodocumento 
                  and esem.emp_ideregistro=:idempresa
                  and prun.prg_ideregistro = ".PROGRAMA_REGISTRO_RAPIDO;
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

}
