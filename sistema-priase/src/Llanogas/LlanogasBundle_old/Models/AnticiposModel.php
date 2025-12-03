<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AnularModel
 *
 * @author sergio vargas
 */
class AnticiposModel extends AuditoriaServices {

    private $genericoModel;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($conexion);
    }

    /**
     * carla el listado de las liquidaciones 
     * @param int $idsuscripcion identificador de la suscripción 
     * @return array 
     */
    public function obtenerLiquidacionesPorTipoDocumentoModel($idtipodocumento, $idprograma, $idusuario, $idempresa,$idsuscripcion) {
        $parametros["idtipodocumento"] = $idtipodocumento;
        $parametros["idsuscripcion"] = $idsuscripcion;
        $parametros["idprograma"] = $idprograma;
        $parametros["idusuario"] = $idusuario;
        $parametros["idempresa"] = $idempresa;
        $sql = "SELECT DISTINCT
                    liq.uni_liquidacion idliquidacion,
                    liq.liq_nombre liquidacion
                FROM liq_liquidacion liq
                    INNER JOIN uni_unidad uni ON liq.uni_tipdocument = uni.uni_ideregistro
                    INNER JOIN esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro
                    INNER JOIN prun_prgunidad prun ON liq.uni_tipdocument = prun.uni_ideregistro
                    INNER JOIN uspu_usuprgunid uspu ON prun.prun_ideregistr = uspu.prun_ideregistr
                    INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr =:idsuscripcion 
                    INNER JOIN limu_liqmunicipio  limu on limu.uni_liquidacion = liq.uni_liquidacion and limu.uni_municipio = dsus.uni_municipio
                WHERE
                    liq.uni_tipdocument = :idtipodocumento
                    AND prun.prg_ideregistro = :idprograma
                    AND uspu.usu_ideregistro = :idusuario
                    AND esem.emp_ideregistro = :idempresa
              " ;
        $respuesta = $this->executeQuery($sql, $parametros);
        return $respuesta;
    }
    /**
     * Se consultan los tipos de documento asociados al tipo de uso de la suscripción
     * @param int $idsuscripcion identificador de la suscripción 
     * @return array 
     */
    public function obtenerTiposDocumentoPorTipoUsoModel($idsuscripcion, $idprograma, $idusuario, $idempresa , $anticipoOrden = null ) {
        $parametros["idsuscripcion"] = $idsuscripcion;
        $parametros["idprograma"] = $idprograma;
        $parametros["idusuario"] = $idusuario;
        $parametros["idempresa"] = $idempresa;
        /*
         *  En caso de que este seleccionado "Anticipo Pago Orden Servicio" se añade la condicion
         *  para que solo muestre los tipos de documentos 
         */
        $condicion_ordenservicio = ( $anticipoOrden == 1 ) ? " AND dsus.dsus_estado='P' " : "" ;
        
        $sql = "SELECT DISTINCT
                    tido.uni_tipdocument idtipodocumento,
                    uni.uni_nombre1 tipodocumento
                FROM dsus_detsuscrip dsus
                    INNER JOIN lius_liquso lius ON dsus.uni_tipusosuscr = lius.uni_tipusosuscr
                    INNER JOIN liq_liquidacion liq ON lius.uni_liquidacion = liq.uni_liquidacion 
                    INNER JOIN tido_tipdocumen tido ON liq.uni_tipdocument = tido.uni_tipdocument
                    INNER JOIN uni_unidad uni ON tido.uni_tipdocument = uni.uni_ideregistro
                    INNER JOIN esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro
                    INNER JOIN prun_prgunidad prun ON tido.uni_tipdocument = prun.uni_ideregistro
                    INNER JOIN uspu_usuprgunid uspu ON prun.prun_ideregistr = uspu.prun_ideregistr
                WHERE
                    dsus.dsus_ideregistr = :idsuscripcion
                    AND prun.prg_ideregistro = :idprograma
                    AND uspu.usu_ideregistro = :idusuario
                    AND esem.emp_ideregistro = :idempresa 
                    $condicion_ordenservicio
                    ";
        $respuesta = $this->executeQuery($sql, $parametros);

        return $respuesta;
    }
    
    /**
     * Se consultan los tipos de documento asociados al tipo de uso de la suscripción cuando son por 
     * anticipo pago orden de servicio
     * @param int $idsuscripcion identificador de la suscripción 
     * @return array 
     */
    public function obtenerTiposDocumentoPorTipoUsoAnticipoServicioModel($idsuscripcion, $idprograma, $idusuario, $idempresa) {
        $parametros["idsuscripcion"] = $idsuscripcion;
        $parametros["idprograma"] = $idprograma;
        $parametros["idusuario"] = $idusuario;
        $parametros["idempresa"] = $idempresa;
        $sql = "SELECT DISTINCT 
                    tido.uni_tipdocument idtipodocumento,
                    tido.tido_nombre tipodocumento
                FROM dsus_detsuscrip dsus
                    INNER JOIN ven_venta ven on ven.dsus_ideregistr=dsus.dsus_ideregistr
                    INNER JOIN veli_venliquidac veli on veli.ven_ideregistro=ven.ven_ideregistro
                    INNER JOIN liq_liquidacion liq on liq.uni_liquidacion=veli.uni_liquidacion
                    INNER JOIN doc_documento doc on doc.uni_documento=liq.uni_documento and doc_tipo='VE'
                    INNER JOIN tido_tipdocumen tido on tido.uni_tipdocument=liq.uni_tipdocument
                    INNER JOIN prun_prgunidad prun ON tido.uni_tipdocument = prun.uni_ideregistro
                WHERE
                    dsus.dsus_ideregistr = :idsuscripcion
                    AND dsus.dsus_estado  = 'P'
                    ";
        $respuesta = $this->executeQuery($sql, $parametros);
        if( empty( $respuesta ) ){
            throw new MyException('Error , no se encuentra ningún tipo de documento para esta suscripción' , -3 );
        }
        return $respuesta;
    }

    /**
     * Se consultan los conceptos de un anticipo
     * @param type $idLiquidacion  identificador liquidacion
     * @return array listados de conceptos.
     */
    public function ObtenerConceptosAnticiposModel($idLiquidacion) {
        $sql = "SELECT DISTINCT
                        con.uni_concepto idconcepto,
                        con.con_nombre nombreconcepto
                FROM
                        liq_liquidacion liq inner join coli_conliquida coli on coli.uni_liquidacion = liq.uni_liquidacion 
                        inner join con_concepto con on  con.uni_concepto = coli.uni_concepto
                WHERE
                 liq.uni_liquidacion = :idliquidacion
                AND con.con_anticipo = 'S'
                AND con.con_operacion = 'S'
                AND con.con_estado = 'A' ";
        $parametros['idliquidacion'] = $idLiquidacion;
        return $this->executeQuery($sql, $parametros);
    }
    
    /**
     * Se consultan los periodos activos de la suscripción
     * @param int $idsuscripcion identificador de la suscripción 
     * @return array 
     */
    public function getPeriodosPorSuscripcion($idsuscripcion , $idrecaudo = null) {
        $complemento = "";
        $condicion = "";
        if(!empty($idsuscripcion)){
            $parametros["idsuscripcion"] = $idsuscripcion;
            $condicion = " and  dsus.dsus_ideregistr = :idsuscripcion ";
        }
        if(!empty($idrecaudo)){
            $parametros["idrecaudo"] = $idrecaudo;
            $complemento = " INNER JOIN  dire_disrecaudo dire on dire.dsus_ideregistr = dsus.dsus_ideregistr ";
            $condicion = "  and dire.rec_ideregistro = :idrecaudo ";
            
        }
        $sql = "SELECT per.per_ideregistro ideperiodo, per.per_nombre ||'-'|| date_part('YEAR', per.per_fecfinal) periodo
                FROM dsus_detsuscrip dsus
                INNER JOIN cic_ciclo cic on cic.cic_ideregistro = dsus.cic_ideregistro
                INNER JOIN ciem_cicempresa ciem on ciem.cic_ideregistro = dsus.cic_ideregistro and ciem.emp_ideregistro = dsus.emp_ideregistro
                INNER JOIN per_periodo per on per.cic_ideregistro = dsus.cic_ideregistro
                $complemento
                where   per.per_estado <> 'C'  $condicion";
        $respuesta = $this->executeQuery($sql, $parametros);
        return $respuesta;
    }
}
