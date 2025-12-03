<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;

/**
 * @author oabaquero
 */
class ReporteFaltanteSobranteModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    public function existeTabla($tabla) {
        $sql = "SELECT count(*) cantidadtablas
                FROM  information_schema.TABLES
                WHERE TABLE_NAME = '".$tabla."'";
        $resultado = $this->executeQuery($sql);
        return $resultado[0]['cantidadtablas'];
    }

    public function armaReporteFaltanteSobrante($idempresa, $fechaInicial, $fechaFinal, $tabla, $facemiper) {
        $sql = "SELECT *
                FROM  fn_arma_reportefaltantesobrante(".$idempresa.", '".$fechaInicial."' , '". $fechaFinal."', '" .$tabla."' , '". $facemiper."')";
        print_r($sql);
        $this->executeQuery($sql);
    }

    /*
     * Elimina las tablas temporales creadas 
     */

    public function eliminarTablasTemporales($idEmpresa) {
        $sqlDrop = "DROP TABLE IF EXISTS temp_fac_factura_$idEmpresa" . "_opt";
        $this->executeQuery($sqlDrop);

        $sqlDrop = "DROP TABLE IF EXISTS temp_dfac_detfactura_$idEmpresa" . "_opt";
        $this->executeQuery($sqlDrop);

        $sqlDrop = "DROP TABLE IF EXISTS temp_factura_emitida_$idEmpresa" . "_opt";
        $this->executeQuery($sqlDrop);
    }

    public function crearTablaTemporalFactura($idEmpresa, $fechaInicial, $fechaFinal) {

        $sqlCrear = "create table temp_fac_factura_$idEmpresa" . "_opt as
                        select 
                        proy.proyecto_cod codproy, 
                        proy.proyecto_nom proyecto,
                        fac.fac_ideregistro  idfactura,
                        fac.dsus_ideregistr  suscripcion,
                        dsus.dsus_pcodigo  pcodigo,
                        0 estrato,  -- 44
                        0 consumo_metros, -- 35
                        0 consumo_anterior_metros , --- facemi.facemi_con
                        0  tipouso_anterior, --- facemi.facemi_tipins
                        0 estrato_anterior, --facemi.facemi_est
                        fac.uni_tipusosuscr tipouso_actual,
                        0 mtr_basico, -- 202
                        0 mtr_superior,  --203
                        0 valor_faltante, --3225
                        0 valor_sobrante -- 3226

                        from fac_factura fac 
                        INNER JOIN dsus_detsuscrip dsus on dsus.dsus_ideregistr = fac.dsus_ideregistr
                        INNER JOIN proyectos proy on proy.proyecto_ideregistro = dsus.uni_municipio

                        where fac.uni_documento in (24, 3597)  and fac.emp_ideregistro =  $idEmpresa
                        and fac.fac_estado not in ( 'E' )
                        and fac.fac_fecha::Date BETWEEN  '". $fechaInicial . "'" . "  AND  '" . $fechaFinal . "'" . "  and fac_idepadre is null  
                        and fac.fac_ideorigen is  null;";
        $this->executeQuery($sqlCrear);

        $sqlIndxfacideregi = "CREATE INDEX ix_copyfac_ideregistro$idEmpresa ON public.temp_fac_factura_$idEmpresa" . "_opt USING btree (idfactura);";
        $this->executeQuery($sqlIndxfacideregi);

        $sqlIndxSuscripcion = "CREATE INDEX ix_copydsus_ideregistro$idEmpresa ON public.temp_fac_factura_$idEmpresa" . "_opt USING btree (suscripcion);";
        $this->executeQuery($sqlIndxSuscripcion);

        $sqlIndxPcodigo = "CREATE INDEX ix_copypcodigo_$idEmpresa ON public.temp_fac_factura_$idEmpresa" . "_opt USING btree (pcodigo);";
        $this->executeQuery($sqlIndxPcodigo);
    }

    public function crearTablaTemporalDetalleFactura($idEmpresa) {

        $sqlCrear = "
                create table temp_dfac_detfactura_$idEmpresa" . "_opt as
                select 
                dfac.dfac_ideregistr, dfac.dfac_vlrunitari, dfac.dfac_vlrtotal, dfac.dfac_vlrreal, dfac.dfac_sdoreal, dfac.uni_concepto, dfac.fac_ideregistro
                from temp_fac_factura_$idEmpresa" . "_opt fac 
                inner JOIN dfac_detfactura dfac on dfac.fac_ideregistro = fac.idfactura
                where   dfac.uni_concepto in ( 3224,44,35,202,203,3225,3226) ;";
        $this->executeQuery($sqlCrear);

        $sqlIndxfacideregi = "CREATE INDEX ix_dfac_fac_ideregistro$idEmpresa ON public.temp_dfac_detfactura_$idEmpresa" . "_opt USING btree (fac_ideregistro) ";
        $this->executeQuery($sqlIndxfacideregi);

        $sqlIndxConcepto = "CREATE INDEX ix_uni_concepto$idEmpresa ON public.temp_dfac_detfactura_$idEmpresa" . "_opt USING btree (uni_concepto) ";
        $this->executeQuery($sqlIndxConcepto);

        $sqlIndxVlrTotal = "CREATE INDEX ix_dfac_vlrtotal$idEmpresa ON public.temp_dfac_detfactura_$idEmpresa" . "_opt USING btree (dfac_vlrtotal) ;";
        $this->executeQuery($sqlIndxVlrTotal);
    }

    public function crearTablaTemporalConsumos($idEmpresa, $facemiper,  $nitEmpresa) {

        $sqlCrear = "create table temp_factura_emitida_$idEmpresa" . "_opt as 
                    select 
                    facemi.facemi_codsus,
                    facemi.facemi_con consumo_anterior_metros, 
                    facemi.facemi_tipins tipouso_anterior,
                    facemi.facemi_est estrato_anterior, 
                    facemi.fac_ideregistro
                    from temp_fac_factura_$idEmpresa" . "_opt fac 
                    LEFT JOIN factura_emitida facemi on facemi.facemi_codsus = fac.pcodigo and facemi.facemi_per =  '" . $facemiper ."'"."
                    and facemi.facemi_codemp = '". $nitEmpresa ."'  ;";
        $this->executeQuery($sqlCrear);
        
         $sqlIndxCodigoSus = "CREATE INDEX ix_facemi$idEmpresa ON public.temp_factura_emitida_$idEmpresa"."_opt USING btree (facemi_codsus)";
        $this->executeQuery($sqlIndxCodigoSus);
    }

    public function crearTablaArmaReporte($idEmpresa, $tabla) {

        $sqlCrear = "create table $tabla as
                        select 
                        (case when  dfac.dfac_vlrtotal >= 1 then
                        proy.proyecto_cod END) codproy, 

                        (case when  dfac.dfac_vlrtotal >= 1 then
                        proy.proyecto_nom END) proyecto, 

                        (case when  dfac.dfac_vlrtotal >= 1 then
                        fac.idfactura END) idfactura,

                        (case when  dfac.dfac_vlrtotal >= 1 then
                        fac.suscripcion END) suscripcion,

                        (case when  dfac.dfac_vlrtotal >= 1 then
                        dsus.dsus_pcodigo END) pcodigo,

                        (case when  dfac.dfac_vlrtotal >= 1 then
                        (select dfac1.dfac_vlrtotal from temp_dfac_detfactura_$idEmpresa" . "_opt dfac1 where dfac1.fac_ideregistro = fac.idfactura and dfac1.uni_concepto = 44) END) estrato,

                        (case when  dfac.dfac_vlrtotal >= 1 then
                        (select dfac1.dfac_vlrtotal from temp_dfac_detfactura_$idEmpresa" . "_opt dfac1 where dfac1.fac_ideregistro = fac.idfactura and dfac1.uni_concepto = 35) END) consumo_metros,

                        (case when  dfac.dfac_vlrtotal >= 1 then
                        facemi.consumo_anterior_metros END) consumo_anterior_metros,

                        (case when  dfac.dfac_vlrtotal >= 1 then
                        facemi.tipouso_anterior END) tipouso_anterior,

                        (case when  dfac.dfac_vlrtotal >= 1 then
                        facemi.estrato_anterior END) estrato_anterior,

                        (case when  dfac.dfac_vlrtotal >= 1 then
                        (case WHEN fac.tipouso_actual = 6 THEN ' domiciliaria ' 
                        WHEN fac.tipouso_actual = 5 THEN 'comercial '
                        WHEN fac.tipouso_actual = 7 THEN ' industrial '
                        ELSE
                        ' otro'
                        END) END) tipouso_actual,
                        (case when  dfac.dfac_vlrtotal >= 1 then
                        (select dfac1.dfac_vlrtotal from temp_dfac_detfactura_$idEmpresa" . "_opt dfac1 where dfac1.fac_ideregistro = fac.idfactura and dfac1.uni_concepto = 202) END) mtr_basico,
                        (case when  dfac.dfac_vlrtotal >= 1 then
                        (select dfac1.dfac_vlrtotal from temp_dfac_detfactura_$idEmpresa" . "_opt dfac1 where dfac1.fac_ideregistro = fac.idfactura and dfac1.uni_concepto = 203) END) mtr_superior,



                        (case when  dfac.dfac_vlrtotal >= 1 then
                        (select dfac1.dfac_vlrtotal from temp_dfac_detfactura_$idEmpresa" . "_opt dfac1 where dfac1.fac_ideregistro = fac.idfactura and dfac1.uni_concepto = 3225) END) valor_faltante,
                        (case when  dfac.dfac_vlrtotal >= 1 then
                        (select dfac1.dfac_vlrtotal from temp_dfac_detfactura_$idEmpresa" . "_opt dfac1 where dfac1.fac_ideregistro = fac.idfactura and dfac1.uni_concepto = 3226) END) valor_sobrante


                        from temp_fac_factura_$idEmpresa" . "_opt fac 
                        INNER JOIN dsus_detsuscrip dsus on dsus.dsus_ideregistr = fac.suscripcion
                        INNER JOIN proyectos proy on proy.proyecto_ideregistro = dsus.uni_municipio
                        LEFT JOIN temp_factura_emitida_$idEmpresa" . "_opt facemi on facemi.facemi_codsus = dsus.dsus_pcodigo 
                        inner JOIN temp_dfac_detfactura_$idEmpresa" . "_opt dfac on dfac.fac_ideregistro = fac.idfactura
                        where  dfac.uni_concepto = 3224 ";
        $this->executeQuery($sqlCrear);
        
        $sqlIndxAjuste = "CREATE INDEX ix_ajustefactura$idEmpresa ON $tabla USING btree (idfactura)";
        $this->executeQuery($sqlIndxAjuste);
        
        $sqlDelete = "DELETE FROM $tabla where idfactura is  null;";
        $this->executeQuery($sqlDelete);
        
    }

}
