<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Models;

/**
 * Description of FacturacionReportesModel
 *
 * @author jpsierra
 */
class CarteraReportesModel extends ReportesDefaultModel {

    //put your code here
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    public function ejecutarSQL($sql) {
        return $this->executeQuery($sql);
    }

    
    public function recuperacionCartera($ciclo = null, $periodo = null) {
        if ($ciclo == null || $periodo == null) {
            return null;
        }

        $sql = "SELECT 
                    proye.proyecto_ideregistro AS proyecto_id,
                    proye.proyecto_nom AS proyecto_nombre,
                    dsus.dsus_ideregistr AS suscripcion_id,
                    dsus.dsus_pcodigo AS codigo_anterior,
                    dsus.pro_catestrato AS estrato,
                    ter.ter_nomcompleto AS tercero_nombre,
                    pro.pro_direccion AS direccion,
                    barrio.barrio_nom AS barrio_nombre,
                    pro.pro_idepropieda AS numero_medidor,
                    fage.fac_ideregistro AS numero_factura,	
            (SELECT 
                COALESCE(SUM(drec.drec_vlrreal),0)
                FROM fac_factura fac 
                        INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro = fac.fac_ideregistro
                        INNER JOIN drec_detrecaudo drec ON drec.dfac_ideregistr = dfac.dfac_ideregistr
                        WHERE fac.fac_ideorigen = fage.fac_ideregistro OR fac.fac_ideregistro = fage.fac_ideregistro
            ) AS valor_recaudo,
                    COALESCE(SUM(dfac.dfac_vlrreal),0) AS valor_factura,
                    COALESCE(SUM(dfin.dfin_vlrreal),0) AS valor_financiado,
                    COALESCE(SUM(CASE WHEN fac.cic_ideregistro = per.cic_ideregistro AND fac.per_ideregistro = per.per_ideregistro THEN dfac.dfac_vlrreal END),0) AS valor_facturas_actual,
                    COALESCE(SUM(CASE WHEN fac.fac_fecvence > now() THEN dfac.dfac_vlrreal END),0) AS valor_facturas_actual_fecha,
                    MAX(amfi.amfi_numcuotas) AS numero_cuotas
                FROM ges_gestion ges 
                    INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = ges.dsus_ideregistr
                    INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
                    INNER JOIN pro_propiedad pro ON pro.pro_ideregistro = dsus.pro_ideregistro
                    INNER JOIN proyectos proye ON proye.proyecto_ideregistro = dsus.uni_municipio
                    INNER JOIN barrios barrio ON barrio.barrio_ideregistro = pro.uni_barrio
                    INNER JOIN uni_unidad utuso ON utuso.uni_ideregistro = dsus.uni_tipusosuscr
                    INNER JOIN fage_facgestion fage ON fage.ges_ideregistro = ges.ges_ideregistro
                    INNER JOIN fac_factura fac ON fac.fac_ideregistro = fage.fac_ideregistro
                    INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro = fac.fac_ideregistro
                    LEFT JOIN dfin_detfinanci dfin ON dfin.dfac_ideregistr = dfac.dfac_ideregistr
                    LEFT JOIN amfi_amofinanci amfi ON amfi.fin_ideregistro = dfin.fin_ideregistro
                    INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = dsus.cic_ideregistro
                    INNER JOIN per_periodo per ON per.cic_ideregistro = cic.cic_ideregistro AND per.per_estado = 'A'
                WHERE ges.ges_estado = 'A' AND ges.cic_ideregistro = :ciclo AND ges.per_ideregistro = :periodo
                GROUP BY 
                    proyecto_id,
                    proyecto_nombre,
                    suscripcion_id,
                    codigo_anterior,
                    estrato,
                    tercero_nombre,
                    direccion,
                    barrio_nombre,
                    numero_medidor,
                    numero_factura
                ORDER BY suscripcion_id,fage.fac_ideregistro";
        $parametros['ciclo'] = $ciclo;
        $parametros['periodo'] = $periodo;
        
        return $this->executeQuery($sql, $parametros);
    }
    
    
    /**
     * Inicio modificacion Julian Poveda
     */
    public function buscarDevoluciones($datoBusqueda = null, $fechaInicial = null, 
            $fechaFinal = null, $empresa = null) {
        /*if ($datoBusqueda == null || $fechaInicial == null || $fechaFinal == null
                ||$empresa == null) {
            return null;
        }*/
        
        $condicionBusqueda = "";
        $parametros = array('tipoDoc' => 'DV', 'empresa' => $empresa);
        
        //$condicionBusqueda = "doc.doc_tipo = :tipoDoc AND dsus.emp_ideregistro = :empresa";
        
        if(!is_null($datoBusqueda) && !empty($datoBusqueda)){
            $condicionBusqueda .= " AND (dsus.dsus_ideregistr = :datoBusqueda"
                    . " OR dsus.dsus_pcodigo = :datoBusqueda) ";
            
            $parametros["datoBusqueda"] = $datoBusqueda;
        }
        
        if(!is_null($fechaInicial) && !is_null($fechaFinal) && !empty($fechaInicial) &&
                !empty($fechaFinal)){
            
            $condicionBusqueda .= " AND rec.rec_fecha::DATE BETWEEN :fechaInicial"
                    . " AND :fechaFinal";
            
            $parametros["fechaInicial"] = $fechaInicial;
            $parametros["fechaFinal"]   = $fechaFinal;
        }
        

        $sql = "SELECT 	rec.rec_ideregistro AS recaudo_id, 
			TO_CHAR(rec.rec_fecha, 'YYYY-MM-DD') AS recaudo_fecha, 
                        ter.ter_documento AS tercero_documento, 
			ter.ter_nomcompleto AS tercero_nombre,
			rec.rec_vlrreal AS recaudo_valor,
			dsus.dsus_ideregistr,
			dsus.dsus_pcodigo
                FROM	rec_recaudo rec 
                JOIN 	dsus_detsuscrip dsus ON dsus.sus_ideregistro = rec.sus_ideregistro 
                JOIN 	doc_documento doc ON rec.uni_documento = doc.uni_documento 
                JOIN 	ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
                WHERE 	doc.doc_tipo = :tipoDoc AND dsus.emp_ideregistro = :empresa".$condicionBusqueda;
        
        //$parametros = array('condicion' => $condicionBusqueda,'tipoDoc' => 'DV', 'empresa' => 322);        
        /*$parametros = array('tipoDoc' => 'DV', 'empresa' => $empresa, 'datoBusqueda' => $datoBusqueda,
            'fechaInicial' => $fechaInicial, 'fechaFinal' => $fechaFinal);*/
        
        return $this->executeQuery($sql, $parametros);
        //$this->executeQuery($sql);
    }
    
    /**
     * Fin modificacion Julian Poveda
     */

}
