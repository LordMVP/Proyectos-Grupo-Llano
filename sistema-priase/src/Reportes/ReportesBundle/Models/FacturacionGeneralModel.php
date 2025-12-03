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

class FacturacionGeneralModel extends ReportesDefaultModel {

    //put your code here


    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    /*$parametros=null,$fechaInicio = null, $fechaFinal = null, $idSuscripcion = null, $codigoAnteriorSuscripcion = null
     */
public function SuiRegulados($periodo = null) {        
        $parametros = array("periodo" => $periodo);
                        $sql = "SELECT
dsus.dsus_pcodigo as codigo,
concat(dpto.departamento_cod,proy.proyecto_codciu,'000') as codigodane,
pro.muba_sector as sector,
pro.pro_seccion as seccion,
pro.pro_manzana as manzana,
pro.pro_zona as ubicacion,
pro.pro_direccion as direccion,
fac.fac_ideregistro as factura,
fac.fac_fecha::date as fechaexpedicion,
per.per_fecinicial::date as inicioperiodo,
per.per_fecfinal::date as finalperiodo,
--dsus.pro_catestrato as sectorconsumo,
CASE WHEN dsus.uni_tipusosuscr=6 THEN dsus.pro_catestrato::VARCHAR
		 WHEN dsus.uni_tipusosuscr=5 THEN 'C'
		 WHEN dsus.uni_tipusosuscr=7 THEN 'I'
		 END as sectorconsumo,
'X' as tipolectura,
lec.lec_anterior as lecturaanterior,
lec.lec_actual as lecturaactual,
dsus.dsus_factor as factorcorreccion,
lec.lec_consumo as consumom3,
COALESCE(SUM(CASE dfac.uni_concepto WHEN 210 THEN dfac.dfac_vlrreal END),0) as cargofijo,
COALESCE(SUM(CASE dfac.uni_concepto WHEN 449 THEN dfac.dfac_vlrreal END),0) as cargoconsumo,
COALESCE(SUM(CASE dfac.uni_concepto WHEN 42 THEN dfac.dfac_vlrreal END),0) as valorconsumo,
COALESCE(con1.cargofijo,0) as refacturadom3,
COALESCE(con1.refacturadoprecio,0) as refacturadoprecio,
COALESCE(con1.moraacumulado,0) as moraacumulado,
COALESCE(SUM(CASE dfac.uni_concepto WHEN 227 THEN dfac.dfac_vlrreal END),0) as interesmora,
0 as sanciones,
COALESCE(SUM(CASE WHEN dfac.uni_concepto=36 THEN dfac.dfac_vlrreal END),0) as subsidio,
COALESCE(SUM(CASE dfac.uni_concepto WHEN 199 THEN dfac.dfac_vlrreal END),0) as porcentajesubsidio,
COALESCE(SUM(CASE dfac.uni_concepto WHEN 538 THEN dfac.dfac_vlrreal END),0) as conexion,
COALESCE(SUM(CASE dfac.uni_concepto WHEN 567 THEN dfac.dfac_vlrreal END),0) as interesconexion,
COALESCE(SUM(CASE WHEN dfac.uni_concepto=95  OR dfac.uni_concepto=97 THEN dfac.dfac_vlrreal END),0) as susyreconx,
COALESCE(SUM(CASE WHEN dfac.uni_concepto=350  OR dfac.uni_concepto=323 THEN dfac.dfac_vlrreal END),0) as corteinstalacion,
COALESCE(SUM(CASE WHEN dfac.uni_concepto=339 THEN dfac.dfac_vlrreal END),0) as Inspeccion,
'' fecharevisioninstalacion,
COALESCE(SUM(CASE WHEN dfac.uni_concepto=718 THEN dfac.dfac_vlrreal END),0) as otros,
fac.fac_fecvence::date as fechavencimiento,
fac.fac_fecsuspens::date as fechasuspension,
fac.fac_vlrreal as totalfactura

from fac_factura fac
INNER JOIN dsus_detsuscrip dsus on fac.dsus_ideregistr=dsus.dsus_ideregistr
INNER JOIN proyectos proy ON proyecto_ideregistro=dsus.uni_municipio
INNER JOIN departamentos dpto ON proy.departamento_ideregistro=dpto.departamento_ideregistro
INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro=pro.pro_ideregistro
INNER JOIN per_periodo per ON per.per_ideregistro=fac.per_ideregistro
INNER JOIN lec_lectura lec ON lec.dsus_ideregistr=dsus.dsus_ideregistr
INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro=fac.fac_ideregistro
LEFT JOIN 
(
SELECT 
dsus2.dsus_pcodigo as codigo2,
COALESCE(SUM(CASE dfac2.uni_concepto WHEN 35 THEN dfac2.dfac_vlrreal END),0) as cargofijo,
COALESCE(SUM(CASE dfac2.uni_concepto WHEN 42 THEN dfac2.dfac_vlrreal END),0) as refacturadoprecio,
COALESCE(SUM(CASE dfac2.uni_concepto WHEN 227 THEN dfac2.dfac_vlrreal END),0) as moraacumulado
FROM
fac_factura fac2
INNER JOIN dfac_detfactura dfac2 ON dfac2.fac_ideregistro=fac2.fac_ideregistro
INNER JOIN dsus_detsuscrip dsus2 ON dsus2.dsus_ideregistr=fac2.dsus_ideregistr
WHERE fac2.per_ideregistro<:periodo  AND fac2.fac_estado='A' AND fac2.fac_sdoreal>0 AND fac2.fac_idepadre is NULL --AND dsus2.dsus_pcodigo=dsus.dsus_pcodigo  
GROUP BY codigo2
) con1 ON con1.codigo2=dsus_pcodigo --con1.dsus_pcodigo=dsus.dsus_pcodigo
WHERE fac.per_ideregistro=:periodo  AND dsus.uni_tipusosuscr IN (5,6,7)
GROUP BY 
codigo,codigodane,sector,seccion,manzana,ubicacion,direccion,factura,fechaexpedicion,inicioperiodo,finalperiodo,sectorconsumo,
lecturaanterior,lecturaactual,factorcorreccion,consumom3,refacturadom3,refacturadoprecio,moraacumulado";

        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
        //return $this->executeQuery($sql);
    }
    
public function SuiNoRegulados($periodo = null) {        
        $parametros = array("periodo" => $periodo);
                        $sql = "SELECT
dsus.dsus_pcodigo as codigo,
concat(dpto.departamento_cod,proy.proyecto_codciu,'000') as codigodane,
pro.muba_sector as sector,
pro.pro_seccion as seccion,
pro.pro_manzana as manzana,
pro.pro_zona as ubicacion,
'XXXXX' as conexionred,
pro.pro_direccion as direccion,
fac.fac_ideregistro as factura,
fac.fac_fecha::date as fechaexpedicion,
per.per_fecinicial::date as inicioperiodo,
extract(days from ( per.per_fecfinal - per.per_fecinicial)) as diasfacturados,
CASE WHEN dsus.uni_tipusosuscr=197 THEN '4'
		 END as sectorconsumo,
'' as procedenciadelgas,
'' as suministro,
'' as podercalorifico,
'' as facuracionsuministro,
'' as serviciosuministro,
'' as transporte,
'' as facturaciondvolumen,
'' as facturaciondcapacidad,
'' as mercadotransporte,
'' as serviciotransporte,
'' as puntoentrada,
'' as puntosalida,
lec.lec_consumo as consumom3,
COALESCE(SUM(CASE dfac.uni_concepto WHEN 210 THEN dfac.dfac_vlrreal END),0) as cargofijo,
COALESCE(SUM(CASE dfac.uni_concepto WHEN 449 THEN dfac.dfac_vlrreal END),0) as cargoconsumo,
'' as codptoentrada,
'' as codptosalida,
'' as codtraentrada,
'' as codtrasalida
from fac_factura fac
INNER JOIN dsus_detsuscrip dsus on fac.dsus_ideregistr=dsus.dsus_ideregistr
INNER JOIN proyectos proy ON proyecto_ideregistro=dsus.uni_municipio
INNER JOIN departamentos dpto ON proy.departamento_ideregistro=dpto.departamento_ideregistro
INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro=pro.pro_ideregistro
INNER JOIN per_periodo per ON per.per_ideregistro=fac.per_ideregistro
INNER JOIN lec_lectura lec ON lec.dsus_ideregistr=dsus.dsus_ideregistr
INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro=fac.fac_ideregistro
LEFT JOIN
(
SELECT
dsus2.dsus_pcodigo as codigo2, 
COALESCE(SUM(CASE dfac2.uni_concepto WHEN 35 THEN dfac2.dfac_vlrreal END),0) as refacturadom3,
COALESCE(SUM(CASE dfac2.uni_concepto WHEN 42 THEN dfac2.dfac_vlrreal END),0) as refacturadoprecio
FROM
fac_factura fac2
INNER JOIN dfac_detfactura dfac2 ON dfac2.fac_ideregistro=fac2.fac_ideregistro
INNER JOIN dsus_detsuscrip dsus2 ON dsus2.dsus_ideregistr=fac2.dsus_ideregistr
WHERE fac2.per_ideregistro<:periodo AND fac2.fac_estado='A' AND fac2.fac_sdoreal>0 AND fac2.fac_idepadre is NULL --AND dsus2.dsus_pcodigo=dsus.dsus_pcodigo  
GROUP BY codigo2
) sele1 ON sele1.codigo2=dsus.dsus_pcodigo
WHERE fac.per_ideregistro=:periodo AND dsus.uni_tipusosuscr IN (197)
GROUP BY 

codigo,codigodane,sector,seccion,manzana,ubicacion,direccion,factura,fechaexpedicion,diasfacturados,inicioperiodo,sectorconsumo,
consumom3";

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
    
    public function NovedadLectura($mes = null,$anno=null,$novedad = null, $empresa) {        
        $parametros = array("mes" => $mes,"anno"=>$anno,"novedad"=>$novedad, "empresa"=>$empresa);
                        $sql = "SELECT
per.per_nombre as periodo,
dsus.dsus_pcodigo as codigo,
dsus.dsus_fecinicio::DATE AS fechamatricula,
proy.proyecto_nom as proyecto,
rut.rut_nombre as ruta,
uni.uni_nombre1 as tiposuscripcion,
uni2. uni_nombre1 as tipo,
ter.ter_nomcompleto as nombre,
pro.pro_direccion as direccion,
ba.barrio_nom as barrio,
lec.lec_fecha as fechalectura,
lec.lec_actual as lecturaactual,
lec.lec_anterior as lecturaanterior,
lec.lec_observacion as observacion,
uni3.uni_nombre1 as novedad_nombre,
dlec.dlec_observacio as lecturaobservacion,
anle.anle_nombre as informacion
FROM lec_lectura lec
LEFT JOIN dlec_detlectura dlec ON dlec.dlec_ideregistr = lec.dlec_ideregistr
LEFT JOIN uni_unidad uni3 ON dlec.uni_novlectura = uni3.uni_ideregistro 
LEFT JOIN anle_anolectura anle ON anle.uni_anolectura=dlec.uni_anolectura
INNER JOIN dsus_detsuscrip dsus ON lec.dsus_ideregistr=dsus.dsus_ideregistr and dsus.emp_ideregistro= :empresa
INNER JOIN proyectos proy ON proy.proyecto_ideregistro=dsus.uni_municipio
INNER JOIN rusu_rutsuscrip rusu ON rusu.dsus_ideregistr=dsus.dsus_ideregistr
INNER JOIN rut_ruta rut ON rut.rut_ideregistro=rusu.rut_ideregistro
INNER JOIN uni_unidad uni ON uni.uni_ideregistro=dsus.uni_tipusosuscr
INNER JOIN uni_unidad uni2 ON uni2.uni_ideregistro=dsus.uni_tipsuscripc
INNER JOIN ter_tercero ter ON ter.ter_ideregistro=dsus.ter_ideregistro
INNER JOIN pro_propiedad pro ON pro.pro_ideregistro=dsus.pro_ideregistro
INNER JOIN barrios ba ON ba.barrio_ideregistro=pro.uni_barrio
INNER JOIN per_periodo per ON per.per_ideregistro=lec.per_ideregistro
WHERE anle.uni_anolectura=:novedad AND extract(MONTH from lec.lec_fecha)::INTEGER= :mes AND extract(YEAR from lec.lec_fecha)::INTEGER= :anno";

        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
        //return $this->executeQuery($sql);
    }

}
