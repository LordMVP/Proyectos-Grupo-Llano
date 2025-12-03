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

class RecaudosReportesModel extends ReportesDefaultModel {

    //put your code here


    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    /*$parametros=null,$fechaInicio = null, $fechaFinal = null, $idSuscripcion = null, $codigoAnteriorSuscripcion = null
     */
    public function buscarDevoluciones($fechaInicio = null, $fechaFinal = null, $idSuscripcion = null, $codigoAnterior = null) {        
        $parametros = array("idSuscripcion" => $idSuscripcion, "fechaFinal" => $fechaFinal, "fechaInicio" => $fechaInicio, "codigoAnteriorSuscripcion" => $codigoAnterior);
        $sql = "SELECT 
                        rec.rec_ideregistro idrecaudo, 
                        rec.rec_fecha fecha, 
                        rec.sus_ideregistro idsuscriptor,
                        rec.uni_documento iddocumento,
                        doc.doc_nombre documento,
                        ter.ter_documento terdocumento, 
                        ter.ter_nomcompleto ternombrecompleto,
                        rec.rec_vlrreal valor,
                        pro.proyecto_nom
                FROM rec_recaudo rec
                    LEFT JOIN sus_suscripcion sus on rec.sus_ideregistro = sus.sus_ideregistro
                    LEFT JOIN doc_documento doc ON rec.uni_documento = doc.uni_documento
                    LEFT JOIN dire_disrecaudo dire ON dire.rec_ideregistro=rec.rec_ideregistro
                    LEFT JOIN dsus_detsuscrip dsus on dsus.dsus_ideregistr=dire.dsus_ideregistr
                    LEFT JOIN ter_tercero ter on ter.ter_ideregistro = sus.ter_ideregistro
                    LEFT JOIN proyectos pro ON pro.proyecto_ideregistro = rec.uni_municipio
                WHERE 
                    doc.doc_tipo = 'DV' AND
                    (dsus.dsus_pcodigo = :codigoAnteriorSuscripcion OR dsus.sus_ideregistro = :idSuscripcion) AND
                    rec.rec_fecha BETWEEN :fechaInicio::DATE AND :fechaFinal::DATE";

        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
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
    
    public function centralesRiesgo() {        
        //$parametros = array("idSuscripcion" => $idSuscripcion, "fechaFinal" => $fechaFinal, "fechaInicio" => $fechaInicio, "codigoAnteriorSuscripcion" => $codigoAnterior);
                                $sql = "SELECT 
CASE ter.uni_tiptercero WHEN 19 THEN 1 WHEN 22 THEN 2 END as tipo_identificacion, 
ter.ter_documento AS documento,
dsus.dsus_pcodigo AS codigo_usuario,
ter.ter_nomcompleto AS nombre_tercero,
0 AS situacion,
fin.fin_fecha::DATE AS fecha_financiacion,
'' AS fecha_vencimiento_factura,
00 AS responsable,
2 AS tipo_obligacion,
1 AS termino_contrato,
0 AS forma_pago_vigente,
1 AS periocidad_pago,
--06 AS novedad,
CASE WHEN COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_sdoreal>0 THEN fac.fac_ideregistro END)),0)=0 THEN '01'
		 WHEN fin.fin_sdocapital=0 THEN '05'
	   WHEN (COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_sdoreal>0 THEN fac.fac_ideregistro END)),0)*30) BETWEEN 0 AND 30 THEN '06'
		 WHEN (COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_sdoreal>0 THEN fac.fac_ideregistro END)),0)*30) BETWEEN 31 AND 60 THEN '07'
		 WHEN (COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_sdoreal>0 THEN fac.fac_ideregistro END)),0)*30) BETWEEN 61 AND 90 THEN '08'
		 WHEN (COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_sdoreal>0 THEN fac.fac_ideregistro END)),0)*30) BETWEEN 91 AND 360 THEN '09'
		 WHEN (COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_sdoreal>0 THEN fac.fac_ideregistro END)),0)*30) >360 THEN '12'
		 WHEN (COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_estado='C' THEN fac.fac_ideregistro END)),0))>0 THEN '13'
END AS novedad,
0 AS estado_origen_cuenta,
fin.fin_fecha::DATE AS fecha_estado_origen,--revisar
CASE WHEN COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_sdoreal>0 THEN fac.fac_ideregistro END)),0)=0 THEN '1'
		 WHEN COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_sdoreal>0 THEN fac.fac_ideregistro END)),0) >0 THEN '2'
		 WHEN fin.fin_sdocapital=0 THEN '3'
		 WHEN (COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_sdoreal>0 THEN fac.fac_ideregistro END)),0)*30)>360 THEN '5'
		 WHEN (COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_estado='C' THEN fac.fac_ideregistro END)),0))>0 THEN '6'
END AS estado_cuenta,
'' AS ultimo_dia_mes_ant_parametro,--revisar
0 AS adjetivo,
fin.fin_fecha AS fecha_negocio,
1 AS tipo_moneda,
1 AS tipo_garantia,
CASE WHEN COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_sdoreal>0 THEN fac.fac_ideregistro END)),0)=0 THEN 'A'
		 WHEN COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_sdoreal>0 THEN fac.fac_ideregistro END)),0) BETWEEN 1 AND 3 THEN 'B'
		 WHEN COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_sdoreal>0 THEN fac.fac_ideregistro END)),0) BETWEEN 4 AND 6 THEN 'C'
		 WHEN COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_sdoreal>0 THEN fac.fac_ideregistro END)),0) BETWEEN 7 AND 12 THEN 'D'
		 WHEN COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_sdoreal>0 THEN fac.fac_ideregistro END)),0) >12 THEN 'E'
END AS calificacion,
(COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_sdoreal>0 THEN fac.fac_ideregistro END)),0)*30) AS edad_morosidad,--revisar
fin.fin_inicapital AS valor_negocio,
fin.fin_sdocapital AS saldo_negocio,
0 AS valor_disponible,--revisar
calcular_valor_cuota(fin.fin_inicapital,consultar_interes_financiacion_liquidacion(amfi.uni_liquidacion),CASE WHEN amfi.amfi_numcuotas=0 THEN 1 ELSE amfi.amfi_numcuotas END) AS valor_cuota,
COALESCE(SUM(DISTINCT(CASE WHEN fac.fac_sdoreal>0 THEN fac.fac_vlrreal END)),0) AS refacturado,
amfi.amfi_numcuotas as totalcuotas,
COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_sdoreal=0 THEN fac.fac_ideregistro END)),0) as cuotas_canceladas,
COALESCE(COUNT(DISTINCT(CASE WHEN fac.fac_sdoreal>0 THEN fac.fac_ideregistro END)),0) AS cuotas_mora, 
'' AS clausula_permanencia,
'' AS fecha_clausula_permanencia,
'' AS fecha_limite_pago, --revisar
'' AS fecha_pago, --revisar
proyecto.proyecto_nom AS oficina_radicacion,
proyecto.proyecto_nom AS cuidad_radicacion,
proyecto.proyecto_codciu AS codigo_dane_radicacion,
proyecto.proyecto_nom AS ciudad_residencia,
proyecto.proyecto_codciu AS codigo_dane_ciudad_residencia,
depa.departamento_nom AS departamento_residencia,
pro.pro_direccion AS direccion_residencia,
ter.ter_telfijo AS telefono_residencia,
'' AS ciudad_laboral,
'' AS codigo_dane_ciudad_laboral,
'' AS departamento_laboral,
'' AS direccion_laboral,
'' AS telefono_laboral,
'' AS ciudad_correspondencia,
'' AS dane_ciudad_correspondencia,
'' AS departamento_correspondencia,
'' AS direccion_correspondencia,
'' AS correo_electronico,
'' AS celular 

FROM fin_financiacio fin
INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = fin.dsus_ideregistr
INNER JOIN amfi_amofinanci amfi ON amfi.fin_ideregistro = fin.fin_ideregistro
INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
INNER JOIN pro_propiedad pro ON pro.pro_ideregistro = dsus.pro_ideregistro
INNER JOIN proyectos proyecto ON proyecto.proyecto_ideregistro = dsus.uni_municipio
INNER JOIN departamentos depa ON proyecto.departamento_ideregistro=depa.departamento_ideregistro
INNER JOIN amo_amortizacio amo ON amo.fin_ideregistro=fin.fin_ideregistro
INNER JOIN fac_factura fac ON fac.fin_ideregistro=fin.fin_ideregistro
WHERE fin.fin_estado='A'
GROUP BY ter.uni_tiptercero,ter.ter_documento,dsus.dsus_pcodigo,ter.ter_nomcompleto,fin.fin_fecha,fin.fin_inicapital,fin.fin_sdocapital,
amfi.amfi_numcuotas,proyecto.proyecto_nom,proyecto.proyecto_codciu,depa.departamento_nom,pro.pro_direccion,ter.ter_telfijo,amfi.uni_liquidacion,dsus.dsus_estado
                   ";

        //return $this->executeQuery($sql, $this->ajustarParametros($parametros));
        return $this->executeQuery($sql);
    }
    
    public function evaluarConvenio($idsuscripcion){
        $parametros['idsuscripcion'] = $idsuscripcion;
        $sql = "SELECT COALESCE((	SELECT      sus.cnre_ideregistr::INTEGER as homologado 
					FROM        dsus_detsuscrip dsus 
					INNER JOIN  sus_suscripcion sus ON dsus.sus_ideregistro=sus.sus_ideregistro 
					WHERE       (dsus.dsus_ideregistr=:idsuscripcion ::BIGINT OR dsus.dsus_pcodigo=:idsuscripcion ::VARCHAR) 
                                            AND     dsus.emp_ideregistro = 322), -1)::INTEGER as homologado";
        
        
        /*$sql="SELECT
                sus.cnre_ideregistr::INTEGER as homologado
                FROM dsus_detsuscrip dsus
                INNER JOIN sus_suscripcion sus ON dsus.sus_ideregistro=sus.sus_ideregistro
                WHERE dsus.dsus_ideregistr=:idsuscripcion::BIGINT OR dsus.dsus_pcodigo=:idsuscripcion::VARCHAR";*/
        return $this->executeQuery($sql, $parametros);
    }
    
     public function consultarEmv($fechaInicio=null, $fechaFinal=null,$condicion=null,$empresa=null,$usuario=null) {
        $sql = "SELECT
                emv.emv_ideregistro::INTEGER as idemv,
                emv.mvi_ideregistro as mvi,
                emv.emv_fecha::DATE as fecha
                FROM emv_expmovimient emv
                INNER JOIN mvi_movimiento mvi ON mvi.mvi_ideregistro=emv.mvi_ideregistro
                INNER JOIN usto_usutipopera usto ON usto.top_ideregistro=emv.top_ideregistro AND usto.usu_ideregistro=:usuario
                WHERE emv.emv_fecha::DATE BETWEEN :fechainicio::DATE AND :fechafinal::DATE
                AND mvi.emp_ideregistro=:empresa
                $condicion
                ";
        $parametros = array("fechainicio" => $fechaInicio,"fechafinal" => $fechaFinal,"empresa"=>$empresa,"usuario"=>$usuario);
        $resultado = $this->executeQuery($sql,$this->ajustarParametros($parametros));
        return $resultado;
    }
    
    public function getSuscripcionConvenioPeriodo($idsuscripciones, $idUsuario){
        $sql = "INSERT INTO dsdu_dsusduplicado
                SELECT  dsus_ideregistr , emp_ideregistro, $idUsuario
                FROM dsus_detsuscrip dsus                 
                WHERE dsus.dsus_ideregistr in ($idsuscripciones)  ;";
        return $this->executeQuery($sql);
    }
    public function vaciarTablaDsusDuplicado( $idUsuario){
        $sql = "delete  from dsdu_dsusduplicado where  usu_ideregistro = $idUsuario";
        return $this->executeQuery($sql);
    }

}
