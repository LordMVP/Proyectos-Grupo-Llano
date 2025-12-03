<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AnularModel
 *
 * @author Oscar Baquero
 */
class EliminarFacturaModel extends AuditoriaServices {

    

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
       
    }

    /**
     * Se consultan los conceptos de un anticipo
     * @param type $idLiquidacion  identificador liquidacion
     * @return array listados de conceptos.
     */
    public function consultarFacturasModel($datos) {
        
        $sql = "SELECT fac.fac_ideregistro idfactura,fac.fac_numero numero,
                  DATE (fac.fac_fecvence) fechavencimiento,fac.dsus_ideregistr idsuscripcion,
                  coalesce(fac.fac_vlrreal ,0) valortotal, COALESCE ((fac.fac_vlrreal-fac.fac_sdoreal) ,0)valorpagadofactura,
                  coalesce(fac.fac_vlrreal ,0) valorreal,per.per_ideregistro idperiodo, cic.cic_ideregistro idciclo,
                  per.per_nombre ||' '|| cic.cic_nombre cicloperiodo,tsu.uni_tipsuscripc idtiposuscripcion,
                  tsu.tsu_nombre tiposuscripcion,
                  COALESCE(fac.fac_sdoreal,0) saldofactura,fac.fac_metgenera metodogenera,
                  fac.fac_estado estado,fac.fac_fecha fecha,fac.fac_ideactual idactual,
                  fac.fac_idepadre idfacturapadre,fac.fac_fecaprobada fechaaprobada,fac.fac_feceliminad fechaeliminada,
                  fac.fac_fecfinancia fechafinanciacion,fac.fac_feccastigad fechacastigada,
                  fac.emp_ideregistro idempresa,fac.sus_ideregistro idsuscriptor,fac.uni_tipusosuscr idtipousosuscripcion,
                  fac.uni_liquidacion idliquidacion,fac.ter_ideregistro idtercero,fac.uni_documento iddocumento,
                  fac.uni_tipdocument idtipodocumento,fac.amo_ideregistro idamortizacion,
                  fac.cic_ano cicloano,fac.hliq_ideregistr idhistoricoliquidacion,
                  fac.fac_ideorigen idorigen,fac.uni_tiptercero idtipotercero,fac.fac_fecsuspens fechasuspension,
                  fac.fin_ideregistro idfinanciacion,fac.fac_version as version,
                  COALESCE(fac.fac_vlrreal-fac.fac_sdoreal,0) valorpagado,doc.doc_nombre documento,
                  uni.uni_nombre1 tipodocumento, doc.doc_pagpriori prioridadpagodoc
                FROM
                  fac_factura fac inner join per_periodo per on fac.per_ideregistro=per.per_ideregistro
                  inner join cic_ciclo cic on fac.cic_ideregistro=cic.cic_ideregistro
                  inner join tsu_tipsuscripc tsu on fac.uni_tipsuscripc=tsu.uni_tipsuscripc
                  inner join doc_documento doc on fac.uni_documento=doc.uni_documento
                  inner join uni_unidad uni on fac.uni_tipdocument=uni.uni_ideregistro 
                  where fac.dsus_ideregistr in ( $datos) AND fac.fac_idepadre IS NULL AND fac.fac_ideorigen IS NULL
                        AND fac.fac_estado IN ('A') and fac.fac_sdoreal>=0 AND fac.uni_documento = 24
                        AND per.per_estado ='A' AND fac.mvi_ideregistro IS NULL
                        AND (SELECT count(*) from drec_detrecaudo drec where drec.fac_ideregistro = fac.fac_ideregistro )=0
                AND (SELECT count(*) FROM fac_factura facnot where facnot.fac_idepadre = fac.fac_ideregistro or facnot.fac_ideorigen = fac.fac_ideregistro)=0";
        return $this->executeQuery($sql);
    }
    
    public function actualizarFacturasSuscricionModel($idFatura){
      //  $array = array($idFatura);
        $armaArray =  implode(",", $idFatura);
        $sql="select * from fn_anula_faca_fac_lec_retenidas(array[".$armaArray."]) ";
        $this->executeQuery($sql);
    }
    
     /**
     * Consulta la información de una suscripción por el identificador ó estado
     * @param int $idEmpresa empresa que pertenece la suscripción.
     * @param int $idSuscriptor identificador del suscriptor
     * @param int $estado Estado de la suscripción
     * @return array registros encontrados por los criterios de búsqueda.
     */
    public function getSuscripciones($idEmpresa, $cedula, $idSuscripcion, $codAnterior, $estado, $suscripciones ) {
        $complementoSql = 'AND dsus.emp_ideregistro=:idempresa'; 
        $parametros['idempresa'] = $idEmpresa;
        if (!empty($cedula)) {
            $complementoSql .= ' AND ter.ter_documento = :cedula';
            $parametros['cedula'] = $cedula;
        }
        if (!empty($codAnterior)) {
            $complementoSql .= ' AND dsus.dsus_pcodigo = :codigoanterior';
            $parametros['codigoanterior'] = $codAnterior;
        }
        if (!empty($idSuscripcion)) {
            $complementoSql .= ' AND dsus.dsus_ideregistr = :idsuscripcion';
            $parametros['idsuscripcion'] = $idSuscripcion;
        }
        if (!empty($suscripciones)) {
            $complementoSql .= ' AND dsus.dsus_ideregistr IN ('.$suscripciones.')';
        }
        $sql = "select
                  distinct 
                  sus.sus_ideregistro idsuscriptor, ter.ter_ideregistro idtercero, 
                  ter.ter_documento cedula, ter.ter_nomcompleto nombretercero, 
                  cnre.cnre_ideregistr idconvenio, cnre.cnre_nombre nombreconvenio,
                  dsus.dsus_ideregistr idsuscripcion,dsus.emp_ideregistro idempresa,
                  dsus.dsus_pcodigo codAnterior,dsus.dsus_estado estado, 
                  dsus.uni_tipsuscripc idtiposuscripcion,
                  sus.sus_ideregistro idsuscriptor,sus.cnre_ideregistr convenio,
                  (select uni.uni_nombre1 from uni_unidad uni where uni.uni_ideregistro=dsus.uni_tipsuscripc ) tiposuscripcion, pro.pro_idepropieda numeromedidor
                from dsus_detsuscrip dsus inner join sus_suscripcion sus on dsus.sus_ideregistro=sus.sus_ideregistro
                  inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
                  inner join cnre_cnvrecaudo cnre on sus.cnre_ideregistr = cnre.cnre_ideregistr
                  inner join pro_propiedad pro on pro.pro_ideregistro = dsus.pro_ideregistro
                where dsus.dsus_estado in ($estado) $complementoSql ";
        return $this->executeQuery($sql, $parametros);
    }
    
    public function actualizarLecturaModel($idFatura){
        $sql="UPDATE lec_lectura lec 	
				set lec_estado='E', usu_ideregistro = 587
			from fac_factura fac
			where fac.fac_ideregistro = $idFatura and lec.dsus_ideregistr=fac.dsus_ideregistr 
                        and lec.per_ideregistro=fac.per_ideregistro  and lec.lec_estado not in ('K')";
        $this->executeQuery($sql);
    }
    public function actualizarFacaModel($idFatura){
        $sql="UPDATE faca_faccartera faca 	
				set faca_estado='E'
			from fac_factura fac
			where fac.fac_ideregistro = $idFatura and faca.dsus_ideregistr=fac.dsus_ideregistr and faca.per_ideregistro=fac.per_ideregistro";
        $this->executeQuery($sql);
    }
    

}
