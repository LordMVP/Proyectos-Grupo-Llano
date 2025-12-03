<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Models;

/**
 * Description of VentasReportesModel
 *
 * @author jpsierra
 */
class VentasReportesModel extends ReportesDefaultModel {

    //put your code here
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }
    
    
    public function buscarVentasPorDocumentoONumeroVenta($numeroDocumento=null,$numeroVenta=null,$numeroSuscripcion=null,$empresa= null,$limite=10){
        $condicion="";
        if($numeroVenta!=null){
            $condicion = "ven.ven_ideregistro = :numeroVenta";
        }else if($numeroDocumento!=null){
            $condicion = "ter.ter_documento = :numeroDocumento";
        }else if($numeroSuscripcion!=null){
            $condicion = "ven.dsus_ideregistr = :numeroSuscripcion";
        }else{
            return null;            
        }
        $condicion .= " AND ven.emp_ideregistro = :idempresa ";
        $sql ="SELECT 
                    ven.ven_ideregistro AS venta_id,
                    ven.ven_fecha AS venta_fecha,
                    CASE ven.ven_metpago WHEN 'F' THEN 'FINANCIADO' WHEN 'C' THEN 'CONTADO' END AS venta_metodo_pago,
                    ter.ter_nomcompleto AS tercero_nombre,
                    pro.pro_direccion AS direccion
                    ,bar.barrio_nom as barrio
            FROM ven_venta ven
                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = ven.dsus_ideregistr
                INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
                INNER JOIN pro_propiedad pro ON pro.pro_ideregistro=dsus.pro_ideregistro
                INNER JOIN barrios bar ON bar.barrio_ideregistro=dsus.uni_barrio
            WHERE $condicion
                 
            ORDER BY ven.ven_fecha DESC
            LIMIT :limite";
        $parametros['numeroDocumento']=$numeroDocumento;
        $parametros['numeroVenta']=$numeroVenta;
        $parametros['numeroSuscripcion']=$numeroSuscripcion;
        $parametros['idempresa']=$empresa;
        $parametros["limite"]=$limite;
        return $this->executeQuery($sql, $parametros);
    }

    public function ventasEnTramite($fechaInicial, $fechaFinal, $estado, $municipio) {

        $condiciones = "";
        if ($estado !== '-1') {
            $parametros['estado'] = $estado;
            $condiciones .= "AND ven.ven_estado = :estado ";
        }
        if ($municipio !== '-1') {
            $parametros['municipio'] = $municipio;
            $condiciones .= "AND dsus.uni_municipio = :municipio ";
        }

        $sql = "SELECT
								DISTINCT ven.ven_ideregistro as venta,
								dsus.dsus_ideregistr AS suscripcion_id,							  
								ven.ven_estado as estado,
								sumi.uni_nombre1 as suministro,
								liq.liq_nombre as tipoliquidacion,
								extract(month from ven.ven_fecha) as mes,								
								proye.proyecto_cod as codigoproyecto,
                proye.proyecto_nom AS municipio_nombre,                
								ven.ven_ideregistro AS venta_id,
                ven.ven_fecha AS venta_fecha,
								dsus.pro_catestrato as estrato,
                dsuster.ter_nomcompleto AS tercero_nombre_completo,
								dsuster.ter_documento as cedula,
                pro.pro_direccion AS propiedad_direccion,
                barrio.barrio_nom AS barrio_nombre,
                dsuster.ter_telcelular AS tercero_tel_celular,
                dsuster.ter_telfijo AS tercero_tel_fijo,
								utuso.uni_nombre1 AS tipo_uso,
								MAX(COALESCE(CASE WHEN dven.uni_concepto=538 THEN dven.dven_vlrtotal END,0)) as cargoconexion,
								MAX(COALESCE(CASE WHEN dven.uni_concepto=323 THEN dven.dven_vlrtotal END,0)) as valorinterna,
								MAX(COALESCE(CASE WHEN dven.uni_concepto=96 THEN dven.dven_vlrtotal END,0)) as descuentopagocontado,
								MAX(COALESCE(CASE WHEN dven.uni_concepto=329 THEN dven.dven_vlrtotal END,0)) as descuentointerna,
								MAX(COALESCE(CASE WHEN dven.uni_concepto=330 THEN dven.dven_vlrtotal END,0)) as descuentocampaña,
								MAX(COALESCE(CASE WHEN dven.uni_concepto=375 THEN dven.dven_vlrtotal END,0)) as subsidio,
								MAX(COALESCE(CASE WHEN dven.uni_concepto=74 THEN dven.dven_vlrtotal END,0)) as alargue,
								ven.ven_vlrreal as valornegocio,
								ven.ven_cuoinicial as cuotainicial,
								MAX(COALESCE(CASE WHEN dven.uni_concepto=543 THEN dven.dven_vlrtotal END,0)) as ivaiinterna,
								vfi.vfi_numcuotas as numerocuotas,
								MAX(COALESCE(CASE WHEN dven.uni_concepto=589 THEN dven.dven_vlrtotal END,0)) as interes,
								MAX(COALESCE(calcular_valor_cuota(ven.ven_vlrreal, COALESCE(CASE WHEN dven.uni_concepto=589 THEN dven.dven_vlrtotal END,1), vfi.vfi_numcuotas),0)) as valorcuota,
								--fecha certificacion
                agenda.agenda_nom AS agenda_nombre,                
                asesor.ter_nomcompleto AS asesor_comercial,
                firins.ter_nomcompleto AS firma_instaladora,
                orginsp.ter_nomcompleto AS organismo_inspeccion,
                (CASE ven.ven_metpago WHEN 'F' THEN 'FINANCIADO' WHEN 'C' THEN 'CONTADO' END) AS venta_metodo_pago,
								(CASE ven.ven_estado WHEN 'A' THEN 'APROBADO' WHEN 'P' THEN 'PENDIENTE' WHEN 'F' THEN 'FACTURADO' WHEN 'E' THEN 'ELIMINADO' END) as estadoventa,
								MAX(COALESCE((COALESCE(CASE WHEN dven.uni_concepto=538 THEN dven.dven_vlrtotal END,0)+COALESCE(CASE WHEN dven.uni_concepto=323 THEN dven.dven_vlrtotal END,0)+COALESCE(CASE WHEN dven.uni_concepto=96 THEN dven.dven_vlrtotal END,0)+COALESCE(CASE WHEN dven.uni_concepto=329 THEN dven.dven_vlrtotal END,0)+COALESCE(CASE WHEN dven.uni_concepto=330 THEN dven.dven_vlrtotal END,0)+COALESCE(CASE WHEN dven.uni_concepto=375 THEN dven.dven_vlrtotal END,0))-COALESCE(CASE WHEN dven.uni_concepto=543 THEN dven.dven_vlrtotal END,0)+COALESCE(CASE WHEN dven.uni_concepto=74 THEN dven.dven_vlrtotal END,0),0)) as vrealnegocio,
								'' as valordejamosdefacturar
FROM
ven_venta ven
INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = ven.dsus_ideregistr
INNER JOIN ter_tercero dsuster ON dsuster.ter_ideregistro = dsus.ter_ideregistro
INNER JOIN pro_propiedad pro ON pro.pro_ideregistro  = dsus.pro_ideregistro
INNER JOIN barrios barrio ON barrio.barrio_ideregistro = pro.uni_barrio
INNER JOIN uni_unidad utuso ON utuso.uni_ideregistro = dsus.uni_tipusosuscr
INNER JOIN cofi_comfirmains cofi ON cofi.cofi_ideregistr = ven.cofi_ideregistr
INNER JOIN ter_tercero firins ON firins.ter_ideregistro = cofi.ter_ideregistro
INNER JOIN proyectos proye ON proye.proyecto_ideregistro = dsus.uni_municipio
INNER JOIN ter_tercero asesor ON asesor.ter_ideregistro = ven.ter_ideregistro
LEFT JOIN agendas agenda ON agenda.agenda_ideregistro = ven.agenda_ideregistro
LEFT JOIN ter_tercero orginsp ON orginsp.ter_ideregistro = ven.ter_ideorginspeccion
INNER JOIN uni_unidad sumi ON sumi.uni_ideregistro=dsus.est_tipusosuscr
INNER JOIN dven_detventa dven ON ven.ven_ideregistro=dven.ven_ideregistro
LEFT JOIN vfi_venfinanciacio vfi ON vfi.ven_ideregistro=ven.ven_ideregistro
LEFT JOIN liq_liquidacion liq ON liq.uni_liquidacion=vfi.uni_liquidacion
WHERE ven.fac_ideregistro IS NULL
                  AND  (ven.ven_fecha::DATE BETWEEN :fechaInicial::DATE AND :fechaFinal::DATE) $condiciones 
                  GROUP BY venta,dsus.dsus_ideregistr,sumi.uni_nombre1,liq.liq_nombre,proye.proyecto_cod,proye.proyecto_nom,
dsuster.ter_nomcompleto,dsuster.ter_documento,pro.pro_direccion,barrio.barrio_nom,dsuster.ter_telcelular,
dsuster.ter_telfijo,utuso.uni_nombre1,vfi.vfi_numcuotas,agenda.agenda_nom,asesor.ter_nomcompleto,firins.ter_nomcompleto,
orginsp.ter_nomcompleto
ORDER BY ven.ven_ideregistro" ;

        $parametros['fechaInicial'] = $fechaInicial;
        $parametros['fechaFinal'] = $fechaFinal;
        

       return $this->executeQuery($sql, $parametros);
    }
    
    public function ministerioMinas($fechaInicial,$fechaFinal,$liquidacion=null){
        $sql ="SELECT 
                    proye.proyecto_codciu||'000' AS codigo_dane,
                    dsus.dsus_ideregistr AS suscripcion_id,
                    dsus.pro_catestrato AS estrato,
                    pro.pro_direccion AS direccion,
                    dsuster.ter_nomcompleto AS nombre_usuario,
                    dsuster.ter_telcelular AS telefono_celular,
                    (to_char(dsus.dsus_fecinicio,'ddMMyyyy'))::TEXT AS fecha_servicio,
                    floor(COALESCE(SUM(CASE WHEN dven.uni_concepto IN (338,340) THEN dven.dven_vlrtotal END),0)) as cxc, 
                    floor(COALESCE(SUM(CASE WHEN dven.uni_concepto IN (375) THEN dven.dven_vlrtotal END),0)) as subsidio_cxc,
                    0 AS otros_subsidios,
                    floor(COALESCE(rec.rec_vlrreal,0)) AS pago_contado,
                    floor(COALESCE(fin.fin_sdocapital,0)) AS saldo_financiado,
                    COALESCE(vfi.vfi_numcuotas,0) AS numero_cuotas,
                    max(floor(COALESCE(calcular_valor_cuota(vfi.vfi_inicapital,consultar_interes_financiacion(vfi.ven_ideregistro),vfi.vfi_numcuotas),0))) AS valor_cuota
               FROM ven_venta ven
                    INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = ven.dsus_ideregistr
                    INNER JOIN dven_detventa dven ON dven.ven_ideregistro = ven.ven_ideregistro
                    INNER JOIN ter_tercero dsuster ON dsuster.ter_ideregistro = dsus.ter_ideregistro
                    INNER JOIN pro_propiedad pro ON pro.pro_ideregistro  = dsus.pro_ideregistro
                    INNER JOIN proyectos proye ON proye.proyecto_ideregistro = dsus.uni_municipio
                    LEFT JOIN rec_recaudo rec ON rec.sus_ideregistro = dsus.sus_ideregistro AND rec.uni_documento = 251
                    LEFT JOIN vfi_venfinanciacio vfi ON vfi.ven_ideregistro = ven.ven_ideregistro
                    LEFT JOIN fin_financiacio fin ON fin.fin_ideregistro = vfi.fin_ideregistro
                    INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion=dven.uni_liquidacion
                WHERE ven.ven_fecha BETWEEN :fechaInicial::DATE AND :fechaFinal::DATE AND liq.uni_liquidacion=371
                GROUP BY
                    codigo_dane,
                    suscripcion_id,
                    estrato,
                    direccion,
                    nombre_usuario,
                    telefono_celular,
                    fecha_servicio,
                    pago_contado,
                    saldo_financiado,
                    numero_cuotas
                    ";    
        $parametros['fechaInicial']=$fechaInicial;
        $parametros['fechaFinal']=$fechaFinal;
        return $this->executeQuery($sql,$parametros);
    }
    
    public function ventasConvenios($fechaInicial,$fechaFinal,$estado,$municipio,$liquidacion,$empresa){
        $condiciones = "";
        if ($estado !== '-1') {
            $parametros['estado'] = $estado;
            $condiciones .= "AND ven.ven_estado = :estado ";
        }
        if ($municipio !== '-1') {
            $parametros['municipio'] = $municipio;
            $condiciones .= "AND dsus.uni_municipio = :municipio ";
        }
        if ($liquidacion !== '-1') {
            $parametros['liquidacion'] = $liquidacion;
            $condiciones .= "AND veli.uni_liquidacion = :liquidacion ";
        }
        $parametros['fechaInicial']=$fechaInicial;
        $parametros['fechaFinal']=$fechaFinal;
        $parametros['empresa']=$empresa;
       
        $sql="SELECT
    ven.ven_estado as estado_venta,
    proye.proyecto_nom AS municipio,
    liq.uni_liquidacion as ideliquidacion,
    liq.liq_nombre AS liquidacion,
    ven.ven_fecha AS fecha_venta,
    ven.fac_ideregistro AS factura,
    ven.ven_ideregistro AS venta_numero,
    dsus.pro_catestrato AS estrato,
    dsus.dsus_ideregistr AS suscripcion_numero,
    dsuster.ter_nomcompleto AS nombre_usuario,
    pro.pro_direccion AS direccion,
    barrio.barrio_nom AS barrio,
    utuso.uni_nombre1 AS tipo_uso,
    dsuster.ter_telcelular AS telefono_celular,
    dsuster.ter_telfijo AS telefono_fijo,
    (CASE ven.ven_metpago WHEN 'F' THEN 'FINANCIADO' WHEN 'C' THEN 'CONTADO' END) AS venta_metodo_pago,
		MAX((
		SELECT
to_char(floor(COALESCE(SUM(DISTINCT(CASE WHEN dven2.uni_concepto IN (338,340,377,806) THEN dven2.dven_vlrtotal END)),0)),'LFM9,999,999.99')  as cargoconexion
FROM dven_detventa dven2
INNER JOIN coli_conliquida coli2 ON coli2.uni_concepto=dven2.uni_concepto AND coli2.uni_liquidacion=liq.uni_liquidacion 
WHERE dven2.ven_ideregistro=ven.ven_ideregistro AND dven2.uni_liquidacion=liq.uni_liquidacion
		)) as cargoconexion,
		MAX((
		SELECT
to_char((COALESCE(SUM(DISTINCT(CASE WHEN dven2.uni_concepto IN(323,544,807) THEN dven2.dven_vlrtotal END)),0)),'LFM9,999,999.99') as valorinterna
FROM dven_detventa dven2
INNER JOIN coli_conliquida coli2 ON coli2.uni_concepto=dven2.uni_concepto AND coli2.uni_liquidacion=liq.uni_liquidacion 
WHERE dven2.ven_ideregistro=ven.ven_ideregistro AND dven2.uni_liquidacion=liq.uni_liquidacion
		)) as valorinterna,
		--to_char(MAX(COALESCE(CASE WHEN dven.uni_concepto=226 THEN dven.dven_vlrtotal END,0)),'LFM9,999,999.99') as descuento,
MAX((
		SELECT
to_char((COALESCE(SUM(DISTINCT(CASE WHEN dven2.uni_concepto IN(226) THEN dven2.dven_vlrtotal END)),0)),'LFM9,999,999.99') as descuento
FROM dven_detventa dven2
INNER JOIN coli_conliquida coli2 ON coli2.uni_concepto=dven2.uni_concepto AND coli2.uni_liquidacion=liq.uni_liquidacion 
WHERE dven2.ven_ideregistro=ven.ven_ideregistro AND dven2.uni_liquidacion=liq.uni_liquidacion
		)) as descuento,
    --to_char(floor(COALESCE(MAX(CASE WHEN dven.uni_concepto IN (375) THEN dven.dven_vlrtotal END),0)),'LFM9,999,999.99') as subsidio_cxc,
MAX((
		SELECT
to_char((COALESCE(SUM(DISTINCT(CASE WHEN dven2.uni_concepto IN(375) THEN dven2.dven_vlrtotal END)),0)),'LFM9,999,999.99') as subsidio_cxc
FROM dven_detventa dven2
INNER JOIN coli_conliquida coli2 ON coli2.uni_concepto=dven2.uni_concepto AND coli2.uni_liquidacion=liq.uni_liquidacion 
WHERE dven2.ven_ideregistro=ven.ven_ideregistro AND dven2.uni_liquidacion=liq.uni_liquidacion
		)) as subsidio_cxc,
    --to_char(floor(COALESCE(MAX(CASE WHEN dven.uni_concepto IN (558,557,598) THEN dven.dven_vlrtotal END),0)),'LFM9,999,999.99') AS otros_subsidios,
MAX((
		SELECT
to_char((COALESCE(SUM(DISTINCT(CASE WHEN dven2.uni_concepto IN(558,557,598) THEN dven2.dven_vlrtotal END)),0)),'LFM9,999,999.99') as otros_subsidios
FROM dven_detventa dven2
INNER JOIN coli_conliquida coli2 ON coli2.uni_concepto=dven2.uni_concepto AND coli2.uni_liquidacion=liq.uni_liquidacion 
WHERE dven2.ven_ideregistro=ven.ven_ideregistro AND dven2.uni_liquidacion=liq.uni_liquidacion
		)) otros_subsidios,   
to_char(MAX(COALESCE(CASE WHEN dven.uni_concepto=96 THEN dven.dven_vlrtotal END,0)),'LFM9,999,999.99') as descuentopagocontado,
    --to_char(MAX(COALESCE(CASE WHEN dven.uni_concepto=329 THEN dven.dven_vlrtotal END,0)),'LFM9,999,999.99') as descuentointerna,
	MAX((
		SELECT
to_char((COALESCE(SUM(DISTINCT(CASE WHEN dven2.uni_concepto IN(329) THEN dven2.dven_vlrtotal END)),0)),'LFM9,999,999.99') as descuentointerna
FROM dven_detventa dven2
INNER JOIN coli_conliquida coli2 ON coli2.uni_concepto=dven2.uni_concepto AND coli2.uni_liquidacion=liq.uni_liquidacion 
WHERE dven2.ven_ideregistro=ven.ven_ideregistro AND dven2.uni_liquidacion=liq.uni_liquidacion
		)) descuentointerna,
    --to_char(MAX(COALESCE(CASE WHEN dven.uni_concepto=330 THEN dven.dven_vlrtotal END,0)),'LFM9,999,999.99') as descuentocampaña,
MAX((
		SELECT
to_char((COALESCE(SUM(DISTINCT(CASE WHEN dven2.uni_concepto IN(330) THEN dven2.dven_vlrtotal END)),0)),'LFM9,999,999.99') as descuentocampaña
FROM dven_detventa dven2
INNER JOIN coli_conliquida coli2 ON coli2.uni_concepto=dven2.uni_concepto AND coli2.uni_liquidacion=liq.uni_liquidacion 
WHERE dven2.ven_ideregistro=ven.ven_ideregistro AND dven2.uni_liquidacion=liq.uni_liquidacion
		)) as descuentocampaña,
    to_char(MAX(COALESCE(CASE WHEN dven.uni_concepto=74 THEN dven.dven_vlrtotal END,0)),'LFM9,999,999.99') as alargue,
    to_char(MAX(COALESCE(CASE WHEN dven.uni_concepto=589 THEN dven.dven_vlrtotal END,0)),'LFM9,999,999.99') as interes,
    to_char((
		(
		floor(COALESCE(SUM(DISTINCT(CASE WHEN dven.uni_concepto IN (338,340,377,806) THEN dven.dven_vlrtotal END)),0))+(COALESCE(SUM(DISTINCT(CASE WHEN dven.uni_concepto IN(323,544,807) THEN dven.dven_vlrtotal END)),0))
		+MAX(COALESCE(CASE WHEN dven.uni_concepto=543 THEN dven.dven_vlrtotal END,0)))),'LFM9,999,999.99') as valor_real_negocio,
		to_char(MAX(COALESCE(CASE WHEN dven.uni_concepto=543 THEN dven.dven_vlrtotal END,0)),'LFM9,999,999.99') as ivaiinterna,
		(
		SELECT
		string_agg(DISTINCT con2.con_nombre,'-')
		FROM dven_detventa dven2
		INNER JOIN liq_liquidacion liq2 ON liq2.uni_liquidacion=dven2.uni_liquidacion
		INNER JOIN con_concepto con2 ON dven2.uni_concepto=con2.uni_concepto
		WHERE dven2.ven_ideregistro=ven.ven_ideregistro 
		AND dven2.uni_liquidacion=liq.uni_liquidacion
		)as conceptos,
    to_char(floor(COALESCE(ven.ven_cuoinicial,0)),'LFM9,999,999.99') AS cuota_inicial,
    (
		SELECT
		to_char(floor(COALESCE(sum(vfin3.vfi_inicapital),0)),'LFM9,999,999.99') as valorinicial
		FROM vfi_venfinanciacio vfin3
		INNER JOIN dvfi_detvenfinancia dvfin3 ON dvfin3.vfi_ideregistro=vfin3.vfi_ideregistro
		WHERE vfin3.ven_ideregistro=ven.ven_ideregistro    --AND vfin3.uni_tipdocument=  302
		) as saldo_financiado,
    COALESCE(vfi.vfi_numcuotas,0) AS numero_cuotas,                
		to_char(floor((
		SELECT 
		COALESCE(SUM(calcular_valor_cuota(vfi2.vfi_inicapital,consultar_interes_financiacion(ven.ven_ideregistro),vfi2.vfi_numcuotas)),0)
		FROM ven_venta ven2 																
		INNER JOIN vfi_venfinanciacio vfi2 ON vfi2.ven_ideregistro = ven2.ven_ideregistro
		WHERE ven2.ven_ideregistro=ven.ven_ideregistro --AND vfi2.uni_tipdocument=302
		)),'LFM9,999,999.99') as valor_cuota,
		to_char(floor((COALESCE(ven.ven_vlrreal,0))),'LFM9,999,999.99') as negocio
                FROM veli_venliquidac veli 
                INNER JOIN ven_venta ven ON ven.ven_ideregistro = veli.ven_ideregistro
                INNER JOIN dven_detventa dven ON dven.ven_ideregistro = ven.ven_ideregistro
                INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion = veli.uni_liquidacion --AND liq.uni_liquidacion=dven.uni_liquidacion
                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = ven.dsus_ideregistr                
                INNER JOIN ter_tercero dsuster ON dsuster.ter_ideregistro = dsus.ter_ideregistro
                INNER JOIN pro_propiedad pro ON pro.pro_ideregistro  = dsus.pro_ideregistro
                INNER JOIN proyectos proye ON proye.proyecto_ideregistro = dsus.uni_municipio
                INNER JOIN barrios barrio ON barrio.barrio_ideregistro = pro.uni_barrio
                INNER JOIN uni_unidad utuso ON utuso.uni_ideregistro = dsus.uni_tipusosuscr
                --LEFT JOIN rec_recaudo rec ON rec.sus_ideregistro = dsus.sus_ideregistro --AND rec.uni_documento = 251
                LEFT JOIN vfi_venfinanciacio vfi ON vfi.ven_ideregistro = ven.ven_ideregistro
                LEFT JOIN fin_financiacio fin ON fin.fin_ideregistro = vfi.fin_ideregistro
                LEFT JOIN drec_detrecaudo drec ON ven.fac_ideregistro=drec.fac_ideregistro
		LEFT JOIN rec_recaudo rec ON rec.rec_ideregistro=drec.rec_ideregistro
               -- INNER JOIN coli_conliquida coli ON coli.uni_concepto=dven.uni_concepto AND coli.uni_liquidacion=liq.uni_liquidacion 
            WHERE 
            ven.ven_fecha BETWEEN :fechaInicial::DATE AND :fechaFinal::DATE
            AND ven.emp_ideregistro= :empresa
            $condiciones
            GROUP BY
                municipio,
                liquidacion,
                factura,
                venta_numero,
                barrio,
                tipo_uso,
                telefono_fijo,
                suscripcion_numero,
                estrato,
                direccion,
                nombre_usuario,
                telefono_celular,
                fecha_venta,
                cuota_inicial,                
                numero_cuotas,
                liq.uni_liquidacion
                ORDER BY ven.ven_ideregistro ASC
                ";
                //ven.fac_ideregistro IS NOT NULL AND
                //valor_cuota
        
        return $this->executeQuery($sql,$parametros);
    }
    
    public function numerofactura($orden)
    {
         $sql = "SELECT
                ven.ven_numero as factura
                FROM ven_venta ven
                WHERE ven.ven_ideregistro=:orden";
        $parametros = array("orden" => $orden);
        $resultado = $this->executeQuery($sql,$parametros);
        return $resultado;
    }
    
    
    //CONSULTA QUE RETORNA LA CANTIDAD DE MODIFICACIONES QUE HA TENIDO UNA VENTA
    public function existeCambiosVenta($numeroVenta)
    {
         $sql = "   SELECT  COUNT(*) cambios
                    FROM    hven_hisventa hven 
                    WHERE   hven.ven_ideregistro = :numeroVenta";
        $parametros = array("numeroVenta" => $numeroVenta);
        $resultado = $this->executeQuery($sql,$parametros);
        return $resultado;
    }
    
    
    public function buscarVentasPorDocumentoONFacturaVenta($numeroDocumento=null,$numeroVenta=null,$numeroSuscripcion=null,$limite=10){
        $condicion="";
        if($numeroVenta!=null){
            $condicion = "ven.ven_ideregistro = :numeroVenta";
        }else if($numeroDocumento!=null){
            $condicion = "ter.ter_documento = :numeroDocumento";
        }else if($numeroSuscripcion!=null){
            $condicion = "ven.dsus_ideregistr = :numeroSuscripcion";
        }else{
            return null;            
        }
        
        $sql ="SELECT 
                    ven.ven_ideregistro AS venta_id,
                    ven.ven_fecha AS venta_fecha,
                    CASE ven.ven_metpago WHEN 'F' THEN 'FINANCIADO' WHEN 'C' THEN 'CONTADO' END AS venta_metodo_pago,
                    ter.ter_nomcompleto AS tercero_nombre,
                    pro.pro_direccion AS direccion
                    ,bar.barrio_nom as barrio
            FROM ven_venta ven
                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = ven.dsus_ideregistr
                INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
                INNER JOIN pro_propiedad pro ON pro.pro_ideregistro=dsus.pro_ideregistro
                INNER JOIN barrios bar ON bar.barrio_ideregistro=dsus.uni_barrio
            WHERE $condicion
            
            AND dsus.dsus_estado NOT IN ('P','E')  
            ORDER BY ven.ven_fecha DESC
            LIMIT :limite";
        $parametros['numeroDocumento']=$numeroDocumento;
        $parametros['numeroVenta']=$numeroVenta;
        $parametros['numeroSuscripcion']=$numeroSuscripcion;
        $parametros["limite"]=$limite;
        return $this->executeQuery($sql, $parametros);
    }

}
