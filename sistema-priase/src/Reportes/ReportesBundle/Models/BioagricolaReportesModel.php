<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of RecaudosReportesModel
 *
 * @author jpsierra
 */

namespace Reportes\ReportesBundle\Models;

class BioagricolaReportesModel extends ReportesDefaultModel {

    //put your code here


    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    /*$parametros=null,$fechaInicio = null, $fechaFinal = null, $idSuscripcion = null, $codigoAnteriorSuscripcion = null
     */
public function Bioagricolacartera($periodo = null) {        
        $parametros = array("periodo" => $periodo);
                        $sql = "SELECT
proy.proyecto_nom as proyecto,
dsus.dsus_pcodigo as codigousuario,
ter.ter_nomcompleto as nombreusuario,
extract(Month from fac.fac_fecha) as mes,
fac.fac_ideregistro as factura,
dsus.pro_catestrato as estrato,
pro.pro_direccion as direccion,
ter2.ter_nombre as financiadopor,
COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_sdoreal>0 THEN fac.fac_ideregistro END)),0) as morosidad,
ba.barrio_nom as barrio,
--r
--r2
--r3
--cc
--cp
uni.uni_nombre1 as tipoinstalacion,
COALESCE(SUM(CASE dfac.uni_concepto WHEN 38 THEN dfac.dfac_sdoreal END),0) as interes,
--administracion
(
SELECT
SUM(fac2.fac_sdoreal)
FROM fac_factura fac2																				
											WHERE fac2.per_ideregistro= :periodo  AND fac2.fac_idepadre IS NOT NULL
) as IMPUESTOS,
COALESCE(SUM(CASE dfac.uni_concepto WHEN 204 THEN dfac.dfac_vlrreal END),0) as SEGURO,
COALESCE(SUM(CASE dfac.uni_concepto WHEN 597 THEN dfac.dfac_vlrreal END),0) as CONSUMOVALOR,
COALESCE(SUM(CASE dfac.uni_concepto WHEN 597 THEN dfac.dfac_sdoreal END),0) as consumovalor,
COALESCE(calcular_valor_cuota(fin.fin_inicapital,consultar_interes_financiacion_liquidacion(amfi.uni_liquidacion), amfi.amfi_numcuotas),0) as cuotaamortizacion,
(
SELECT
SUM(fac3.fac_sdoreal)
FROM fin_financiacio fin
											INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr=fin.dsus_ideregistr
											INNER JOIN amfi_amofinanci amfi ON amfi.fin_ideregistro=fin.fin_ideregistro
											INNER JOIN proyectos proy ON proy.proyecto_ideregistro=dsus.uni_municipio
											INNER JOIN amo_amortizacio amo ON amo.fin_ideregistro=fin.fin_ideregistro																																			
											INNER JOIN fac_factura fac3 ON fac3.fin_ideregistro=fin.fin_ideregistro											
											WHERE fac3.per_ideregistro<:periodo  AND fac3.fac_sdoreal>0 AND fin.fin_sdocapital>0 AND fin.fin_estado='A'
) as VALORREFACTURADO,
COALESCE(SUM(CASE dfac.uni_concepto WHEN 227 THEN dfac.dfac_sdoreal END),0) as mora,
COALESCE(SUM(CASE dfac.uni_concepto WHEN 206 THEN dfac.dfac_sdoreal
																		WHEN 207 THEN dfac.dfac_sdoreal END),0) as servicios,   
MAX(fac.fac_vlrreal) as totalfactura
 ---cod
--sqs       
FROM dsus_detsuscrip dsus
INNER JOIN proyectos proy ON proy.proyecto_ideregistro=dsus.uni_municipio
INNER JOIN fac_factura fac ON fac.dsus_ideregistr=dsus.dsus_ideregistr
INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro=fac.fac_ideregistro
INNER JOIN ter_tercero ter ON dsus.ter_ideregistro=ter.ter_ideregistro
INNER JOIN pro_propiedad pro ON pro.pro_ideregistro=dsus.pro_ideregistro
INNER JOIN fin_financiacio fin ON fin.dsus_ideregistr=dsus.dsus_ideregistr
INNER JOIN ter_tercero ter2 ON ter2.ter_ideregistro=fin.ter_ideentfinan
INNER JOIN barrios ba ON ba.barrio_ideregistro=pro.uni_barrio
INNER JOIN amfi_amofinanci amfi ON amfi.fin_ideregistro=fin.fin_ideregistro
INNER JOIN uni_unidad uni ON dsus.uni_tipusosuscr=uni.uni_ideregistro
INNER JOIN per_periodo per ON per.per_ideregistro=fac.per_ideregistro
WHERE fac.per_ideregistro= :periodo  AND fin.fin_sdocapital>0 AND fin.fin_estado='A'
GROUP BY fac.fac_ideregistro,proyecto,codigousuario,nombreusuario,estrato,direccion,financiadopor,barrio,tipoinstalacion,cuotaamortizacion";

        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
        //return $this->executeQuery($sql);
    }
    
public function Bioagricolagaso($periodo = null) {        
        $parametros = array("periodo" => $periodo);
                        $sql = "SELECT
											
proy.proyecto_cod as codigoproyecto,
proy.proyecto_nom as proyecto,
dsus.dsus_pcodigo as codigo,
dsus.pro_catestrato as estrato,
ter.ter_nomcompleto as usuario,
pro.pro_direccion as direccion,
MAX(ter2.ter_nombre) as financiadopor,
barr.barrio_nom as barrio,
---factura cancelada
uni.uni_nombre1 as tipoinstalacion,
---paquete
fin.fin_inicapital as valornegocio,
---cuota inical
MAX((fin.fin_inicapital/amfi.amfi_numcuotas)*amfi.amfi_cuoamortiz) as capitalacumulado,
---valor pagare
fin.fin_sdocapital as saldocapital,
COALESCE(SUM(
CASE WHEN dfac.uni_concepto=38 THEN dfac.dfac_vlrreal
WHEN dfac.uni_concepto=545 THEN dfac.dfac_vlrreal
END),0) as corriente_acumulado,
---plazo
--interes
---intini
COALESCE(SUM(CASE dfac.uni_concepto WHEN 227 THEN dfac.dfac_sdoreal END),0) as Mora_acumulado,
amfi.amfi_cuoamortiz as cuotasamortizadas,
(amfi.amfi_numcuotas-amfi.amfi_cuoamortiz) as pendientesamortizar,
---abonado
COALESCE(calcular_valor_cuota(fin.fin_inicapital,consultar_interes_financiacion_liquidacion(amfi.uni_liquidacion), amfi.amfi_numcuotas),0) as cuotasamortizacion,
---cuota2
(
MAX(fin.fin_inicapital/amfi.amfi_numcuotas)*amfi.amfi_cuoamortiz+
COALESCE(SUM(
CASE WHEN dfac.uni_concepto=38 THEN dfac.dfac_vlrreal
WHEN dfac.uni_concepto=545 THEN dfac.dfac_vlrreal
END),0)+
COALESCE(SUM(CASE dfac.uni_concepto WHEN 227 THEN dfac.dfac_sdoreal END),0)
) as totalpagado,
(
SELECT
COALESCE(MAX(fac.fac_vlrreal),0)
FROM fac_factura fac
INNER JOIN dsus_detsuscrip ds ON ds.dsus_ideregistr=fac.dsus_ideregistr
WHERE fac.per_ideregistro= :periodo -1 AND ds.dsus_pcodigo =dsus.dsus_pcodigo
)facturaanterior,
fac.fac_vlrreal as facturaactual,
---facturas
---ic
(
SELECT
MAX(rec.rec_fecha)
FROM rec_recaudo rec
INNER JOIN drec_detrecaudo drec ON drec.rec_ideregistro=rec.rec_ideregistro
INNER JOIN fac_factura fac ON drec.fac_ideregistro=fac.fac_ideregistro
INNER JOIN dsus_detsuscrip ds ON ds.dsus_ideregistr=fac.dsus_ideregistr
WHERE ds.dsus_pcodigo =dsus.dsus_pcodigo
) as fechaultimopago,
COALESCE(SUM(CASE dfac.uni_concepto WHEN 206 THEN dfac.dfac_sdoreal
WHEN 207 THEN dfac.dfac_sdoreal END),0) as servicios 
--R
---R2
---R3
----valordelpagare
----plazo2
----meses
---pclave
---cod
---sect
--clave
---sw toma de lectura
---ew captura ppago

FROM  fin_financiacio fin
INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr=fin.dsus_ideregistr
INNER JOIN amfi_amofinanci amfi ON amfi.fin_ideregistro=fin.fin_ideregistro
INNER JOIN proyectos proy ON proy.proyecto_ideregistro=dsus.uni_municipio
INNER JOIN amo_amortizacio amo ON amo.fin_ideregistro=fin.fin_ideregistro
INNER JOIN ter_tercero ter ON dsus.ter_ideregistro=ter.ter_ideregistro
INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro=pro.pro_ideregistro
INNER JOIN barrios barr ON pro.uni_barrio=barr.barrio_ideregistro
INNER JOIN ter_tercero ter2 ON ter2.ter_ideregistro=fin.ter_ideentfinan 
INNER JOIN doc_documento doc ON amfi.uni_documento=doc.uni_documento
INNER JOIN uni_unidad uni ON dsus.uni_tipusosuscr=uni.uni_ideregistro
INNER JOIN fac_factura fac ON fac.fin_ideregistro=fin.fin_ideregistro
INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro=fac.fac_ideregistro
INNER JOIN per_periodo per ON per.per_ideregistro=fac.per_ideregistro																		
WHERE fin.fin_sdocapital>0 AND fin.fin_estado='A' AND fac.per_ideregistro= :periodo 
GROUP BY codigo,proyecto,codigoproyecto,usuario,direccion,barrio,tipoinstalacion,
cuotasamortizadas,estrato,valornegocio,saldocapital,pendientesamortizar,cuotasamortizacion,facturaactual";

        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
        //return $this->executeQuery($sql);
    }    
    
    public function contactcenter() {        
        //$parametros = array("idSuscripcion" => $idSuscripcion, "fechaFinal" => $fechaFinal, "fechaInicio" => $fechaInicio, "codigoAnteriorSuscripcion" => $codigoAnterior);
                                                $sql = "SELECT concat(dsus.dsus_pcodigo,';',
                count(CASE WHEN fac.fac_fecvence::date < now()::date THEN fac.fac_numero END),';',
                ROUND(sum(fac.fac_sdoreal),0)) as todo,
                CASE WHEN ter.ter_telcelular  IS NULL THEN ter.ter_telfijo
                                                                                                                ELSE concat('00',ter.ter_telcelular)
                END as telefono1,
                ter.ter_telfijo as telefono2
                FROM fac_factura fac
                INNER JOIN dsus_detsuscrip dsus on fac.dsus_ideregistr=dsus.dsus_ideregistr
                INNER JOIN ter_tercero ter on ter.ter_ideregistro=dsus.ter_ideregistro
                where fac.fac_estado='A' AND fac.fac_sdoreal > 0 AND dsus.dsus_estado ='A' 
                GROUP BY dsus.dsus_pcodigo,telefono2,telefono1
                ";

        //return $this->executeQuery($sql, $this->ajustarParametros($parametros));
        return $this->executeQuery($sql);
    }
    
     public function financiacionesconcepto() {        
        //$parametros = array("idSuscripcion" => $idSuscripcion, "fechaFinal" => $fechaFinal, "fechaInicio" => $fechaInicio, "codigoAnteriorSuscripcion" => $codigoAnterior);
                                                $sql = "SELECT
                    proy.proyecto_cod as codigoproyecto,
                    proy.proyecto_nom as proyecto,
                    dsus.dsus_pcodigo as codigo,
                    ter.ter_nomcompleto as usuario,
                    pro.pro_direccion as direccion,
                    barr.barrio_nom as barrio,
                    fin.fin_ideregistro as financiacion,
                    fin.fin_fecha::DATE as fechafinanciacion,
                    doc.doc_nombre as finanaciacion,
                    ter2.ter_nombre as banco,
                    uni.uni_nombre1 as tipoinstalacion,
                    fin.fin_inicapital as valornegociado,
                    fin.fin_sdocapital as saldocapital,
                    amfi.amfi_numcuotas as cuotas,
                    amfi.amfi_cuoamortiz as pagadas,
                    (amfi.amfi_numcuotas-amfi.amfi_cuoamortiz) as pendientes,
                    calcular_valor_cuota(fin.fin_inicapital,consultar_interes_financiacion_liquidacion(amfi.uni_liquidacion), amfi.amfi_numcuotas) as cuota,
                    MAX(amo.amo_fecha::date) as ultimopago,
                    MAX(fac.fac_fecha::date) as ultimafactura,
                    MAX(fin.fin_inicapital/amfi.amfi_numcuotas)*amfi.amfi_cuoamortiz as capitalacumulado,
                    COALESCE(SUM(
                    CASE WHEN dfac.uni_concepto=38 THEN dfac.dfac_vlrreal
                                     WHEN dfac.uni_concepto=545 THEN dfac.dfac_vlrreal
                    END),0) as corriente_acumulado,
                    COALESCE(SUM(CASE dfac.uni_concepto WHEN 227 THEN dfac.dfac_sdoreal END),0) as Mora_acumulado,
                    (
                    MAX(fin.fin_inicapital/amfi.amfi_numcuotas)*amfi.amfi_cuoamortiz+
                    COALESCE(SUM(
                    CASE WHEN dfac.uni_concepto=38 THEN dfac.dfac_vlrreal
                                     WHEN dfac.uni_concepto=545 THEN dfac.dfac_vlrreal
                    END),0)+
                    COALESCE(SUM(CASE dfac.uni_concepto WHEN 227 THEN dfac.dfac_sdoreal END),0)
                    ) as totalpagado
                    FROM  fin_financiacio fin
                    INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr=fin.dsus_ideregistr
                    INNER JOIN amfi_amofinanci amfi ON amfi.fin_ideregistro=fin.fin_ideregistro
                    INNER JOIN proyectos proy ON proy.proyecto_ideregistro=dsus.uni_municipio
                    INNER JOIN amo_amortizacio amo ON amo.fin_ideregistro=fin.fin_ideregistro
                    INNER JOIN ter_tercero ter ON dsus.ter_ideregistro=ter.ter_ideregistro
                    INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro=pro.pro_ideregistro
                    INNER JOIN barrios barr ON pro.uni_barrio=barr.barrio_ideregistro
                    INNER JOIN ter_tercero ter2 ON ter2.ter_ideregistro=fin.ter_ideentfinan 
                    INNER JOIN doc_documento doc ON amfi.uni_documento=doc.uni_documento
                    INNER JOIN uni_unidad uni ON dsus.uni_tipusosuscr=uni.uni_ideregistro
                    INNER JOIN fac_factura fac ON fac.fin_ideregistro=fin.fin_ideregistro
                    inner JOIN dfac_detfactura dfac ON dfac.fac_ideregistro=fac.fac_ideregistro
                    WHERE fin.fin_sdocapital>0 AND fin.fin_estado='A'
                    GROUP BY codigo,cuotas,financiacion,proyecto,codigoproyecto,usuario,direccion,barrio,banco,finanaciacion,tipoinstalacion,
                    pagadas,cuota";

        //return $this->executeQuery($sql, $this->ajustarParametros($parametros));
        return $this->executeQuery($sql);
    }
    
    public function suscripcioncastigada($fechaInicio = null, $fechaFinal = null) {        
        //$parametros = array("idSuscripcion" => $idSuscripcion, "fechaFinal" => $fechaFinal, "fechaInicio" => $fechaInicio, "codigoAnteriorSuscripcion" => $codigoAnterior);
        $parametros = array("fechaFinal" => $fechaFinal, "fechaInicio" => $fechaInicio);
                        $sql = "SELECT
                    proy.proyecto_cod as codigoproyecto,
                    proy.proyecto_nom as proyecto,
                    dsus.dsus_pcodigo as codigo,
                    ter.ter_nomcompleto as usuario,
                    pro.pro_direccion as direccion,
                   COALESCE(COUNT(DISTINCT(fac.fac_ideregistro)),0) as morosidad, 
                    fin.fin_sdocapital as saldocapital,
                    amfi.amfi_numcuotas as cuotas,
                    amfi.amfi_cuoamortiz as pagadas,
                    calcular_valor_cuota(fin.fin_inicapital,consultar_interes_financiacion_liquidacion(amfi.uni_liquidacion), amfi.amfi_numcuotas) as valorcuota,
                    MAX(amo.amo_fecha::date) as ultimopago,
                    MAX(fin.fin_inicapital/amfi.amfi_numcuotas)*amfi.amfi_cuoamortiz as capitalacumulado,
                    COALESCE(SUM(
                    CASE WHEN dfac.uni_concepto=38 THEN dfac.dfac_vlrreal
                                     WHEN dfac.uni_concepto=545 THEN dfac.dfac_vlrreal
                    END),0) as corriente_acumulado,
                    COALESCE(SUM(CASE dfac.uni_concepto WHEN 227 THEN dfac.dfac_sdoreal END),0) as Mora_acumulado,
                    (
                    MAX(fin.fin_inicapital/amfi.amfi_numcuotas)*amfi.amfi_cuoamortiz+
                    COALESCE(SUM(
                    CASE WHEN dfac.uni_concepto=38 THEN dfac.dfac_vlrreal
                                     WHEN dfac.uni_concepto=545 THEN dfac.dfac_vlrreal
                    END),0)+
                    COALESCE(SUM(CASE dfac.uni_concepto WHEN 227 THEN dfac.dfac_sdoreal END),0)
                    ) as totalpagado
                    FROM  fin_financiacio fin
                    INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr=fin.dsus_ideregistr
                    INNER JOIN amfi_amofinanci amfi ON amfi.fin_ideregistro=fin.fin_ideregistro
                    INNER JOIN proyectos proy ON proy.proyecto_ideregistro=dsus.uni_municipio
                    INNER JOIN amo_amortizacio amo ON amo.fin_ideregistro=fin.fin_ideregistro
                    INNER JOIN ter_tercero ter ON dsus.ter_ideregistro=ter.ter_ideregistro
                    INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro=pro.pro_ideregistro
                    INNER JOIN barrios barr ON pro.uni_barrio=barr.barrio_ideregistro
                    INNER JOIN ter_tercero ter2 ON ter2.ter_ideregistro=fin.ter_ideentfinan 
                    INNER JOIN doc_documento doc ON amfi.uni_documento=doc.uni_documento
                    INNER JOIN uni_unidad uni ON dsus.uni_tipusosuscr=uni.uni_ideregistro
                    INNER JOIN fac_factura fac ON fac.fin_ideregistro=fin.fin_ideregistro
                    INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro=fac.fac_ideregistro
                    WHERE fin.fin_sdocapital>0 AND fin.fin_estado='A' AND fac.fac_estado='A' AND fac.fac_sdoreal>0 and fac.fac_idepadre is NULL AND dsus.dsus_estado ='E'
                    AND dsus.dsus_finestado::date BETWEEN :fechaInicio::DATE AND :fechaFinal::DATE
                    GROUP BY codigo,cuotas,proyecto,codigoproyecto,usuario,direccion,saldocapital,
                    pagadas,valorcuota";

        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
        //return $this->executeQuery($sql);
    }
    
    public function suscripcioncastigadasin($fechaInicio = null, $fechaFinal = null) {        
        //$parametros = array("idSuscripcion" => $idSuscripcion, "fechaFinal" => $fechaFinal, "fechaInicio" => $fechaInicio, "codigoAnteriorSuscripcion" => $codigoAnterior);
        $parametros = array("fechaFinal" => $fechaFinal, "fechaInicio" => $fechaInicio);
                        $sql = "SELECT					
                proy.proyecto_nom as proyecto,
                dsus.dsus_pcodigo as codigo,
                ter.ter_nomcompleto as nombre,
                pro.pro_direccion as direccion,
		COALESCE(COUNT(DISTINCT(fac.fac_ideregistro)),0) as morosidad,		
                COALESCE(SUM(fac.fac_vlrreal),0) as valorfacturas,
                COALESCE(SUM(fac.fac_sdoreal),0)  as debefacturas,
                COALESCE(SUM(
                    CASE WHEN dfac.uni_concepto=38 THEN dfac.dfac_vlrreal
                                     WHEN dfac.uni_concepto=545 THEN dfac.dfac_vlrreal
                    END),0) as corriente_acumulado,
                COALESCE(SUM(CASE dfac.uni_concepto WHEN 227 THEN dfac.dfac_sdoreal END),0) as mora
                FROM 
                dsus_detsuscrip dsus
                LEFT JOIN fac_factura fac ON fac.dsus_ideregistr=dsus.dsus_ideregistr
                INNER JOIN ter_tercero ter on ter.ter_ideregistro=dsus.ter_ideregistro
                INNER JOIN pro_propiedad pro ON pro.pro_ideregistro=dsus.pro_ideregistro
                INNER JOIN proyectos proy ON proy.proyecto_ideregistro=dsus.uni_municipio
                INNER JOIN dfac_detfactura dfac ON fac.fac_ideregistro=dfac.fac_ideregistro
                WHERE fac.fac_estado='A' AND fac.fac_sdoreal>0 and fac.fac_idepadre is NULL AND dsus.dsus_estado ='E' and dsus.dsus_finestado::date BETWEEN :fechaInicio::DATE AND :fechaFinal::DATE 
                GROUP BY codigo,direccion,nombre,proyecto";

        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
        //return $this->executeQuery($sql);
    }
    
    public function reconexionespago() {        
        //$parametros = array("idSuscripcion" => $idSuscripcion, "fechaFinal" => $fechaFinal, "fechaInicio" => $fechaInicio, "codigoAnteriorSuscripcion" => $codigoAnterior);
                                $sql = "SELECT 
                   pro.proyecto_cod as proyecto,
                   rut.rut_ideregistro as ruta,
                   rusu.rusu_rutsecuen as consecutivo,
                   dsus.dsus_pcodigo as codigousuario,
                   ter.ter_nomcompleto as nombre,
                   propi.pro_direccion as direccion,
                   ba.barrio_nom as barrio,
                   tisu.tisu_nombre as dispositivo,
                   ssp.ssp_fecha as suspension,
                   ssp.ssp_ideregistro ssp,
                   propi.pro_idepropieda as medidor
                   FROM dsus_detsuscrip dsus
                   INNER JOIN proyectos pro ON dsus.uni_municipio=pro.proyecto_ideregistro
                   INNER JOIN pro_propiedad propi ON dsus.pro_ideregistro=propi.pro_ideregistro
                   INNER JOIN rusu_rutsuscrip rusu ON rusu.dsus_ideregistr=dsus.dsus_ideregistr
                   INNER JOIN rut_ruta rut ON rusu.rut_ideregistro=rut.rut_ideregistro
                   INNER JOIN ter_tercero ter ON ter.ter_ideregistro=dsus.ter_ideregistro
                   INNER JOIN barrios ba ON ba.barrio_ideregistro=propi.uni_barrio
                   INNER JOIN syr_susreconex syr ON syr.dsus_ideregistr=dsus.dsus_ideregistr
                   INNER JOIN ssp_suspension ssp ON ssp.syr_ideregistro=syr.syr_ideregistro
                   INNER JOIN tisu_tipsuspen tisu ON tisu.uni_tipsuspen=ssp.uni_tipsuspen
                   INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro=dsus.dsus_ideregistr
                   INNER JOIN rec_recaudo rec ON sus.sus_ideregistro=rec.rec_ideregistro
                   INNER JOIN rco_reconexion rco ON rco.ssp_ideregistro=ssp.ssp_ideregistro
                   WHERE 
                   ssp.ssp_estado='E' AND ssp.ssp_realizada='S'
                   GROUP BY proyecto,ruta,consecutivo,codigousuario,nombre,direccion,barrio,dispositivo,suspension,ssp,medidor
                   HAVING
                   COUNT(CASE WHEN rec_fecha >=ssp.ssp_fecha THEN rec_ideregistro END)>0
                   AND
                   COUNT(CASE WHEN rco.rco_realizada !='S' THEN rco.rco_ideregistro END)=0
                   ";

        //return $this->executeQuery($sql, $this->ajustarParametros($parametros));
        return $this->executeQuery($sql);
    }

}
