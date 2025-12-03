<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AnularModel
 *
 * @author hrey
 */
class FesModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    public function prepararInformacionFes($parametros, $patAchivo) {
        try {
            $this->IncializarTablaTemporal($parametros);
        } catch (\Exception $ex) {
            
        }
    }

//    public function crearlogFesTablaTemporal($parametros) {
//        $nombre = $parametros['empresa'] . "_ciclo_" . $parametros['ciclo'];
//        $sql = " DROP TABLE IF EXISTS log_genera_fes_" . $nombre;
//        $this->executeQuery($sql);
//        $sql = " CREATE TABLE log_genera_fes_ " . $nombre . " (idsuscripcion bigint,"
//                . " idfactura bigint,"
//                . " campo varchar,"
//                . " valor varchar,"
//                . " error text  )   ";
//    }

    public function EliminarTablaTemporal($parametros) {
        $nombre = $parametros['empresa'] . "_ciclo_" . $parametros['ciclo'];
        $sql = " DROP TABLE IF EXISTS proceso_genera_fes_" . $nombre;
        $this->executeQuery($sql);
    }

    public function CreaIndiceTablaTemporal($parametros) {
//        $sql = " CREATE UNIQUE INDEX ui_idfactura_proceso_genera_fes ON proceso_genera_fes USING btree (empresa,ciclo); ";
        //       $this->executeQuery($sql);
        $nombre = $parametros['empresa'] . "_ciclo_" . $parametros['ciclo'];
        $sql = " CREATE UNIQUE INDEX idx_idfactura_fes_" . $nombre . " ON proceso_genera_fes_" . $nombre . " USING btree (idfactura); ";
        $this->executeQuery($sql);
        $sql = " REINDEX TABLE proceso_genera_fes_" . $nombre;
        $this->executeQuery($sql);
    }

    /**
     * Alimenta Tabla Temporal Facturacion Emitida Fes 
     * 
     */
    public function IncializarTablaTemporal($parametros, $numeroprocesos) {
        $nombre = $parametros['empresa'] . "_ciclo_" . $parametros['ciclo'];
        $parametros['numeroprocesos'] = $numeroprocesos;
        $cantidadregistros = $this->numregistrosGenerar($parametros['empresa']);
        $cantidadregistros = $cantidadregistros * 1;
        $complemento = '';
        switch ($cantidadregistros) {
            case ($cantidadregistros >= 0) :
                $complemento = ' limit  ' . $cantidadregistros;
                break;
        }
        $info_lecturas = $this->informacionLecturas($parametros);


        $sql = " 
               CREATE TABLE proceso_genera_fes_" . $nombre . " AS 
               SELECT  fac.fac_ideregistro idfactura ,fac.ter_ideregistro tercero,fac.per_ideregistro periodo, fac.cic_ideregistro ciclo, fac.emp_ideregistro empresa,
                 (row_number() OVER () % :numeroprocesos) as proceso, 
                 CAST( 'P' AS character varying )estado,
                 CAST( ' - ' AS character varying ) mensaje ,     
                 dsus.dsus_pcodigo pcodigo_1 ,
                 dsus.dsus_ideregistr numfac_2 ,
                 (CASE WHEN length(TRIM(COALESCE(pro_idepropieda,'0'))) >=14 
	                THEN substring(TRIM(pro_idepropieda),(length(TRIM(pro_idepropieda))-14),15)::varchar 
	                ELSE TRIM(COALESCE(pro_idepropieda,'0'))::varchar  END)  medidor_4,
                 trim((to_char(rut.rut_tipo::INTEGER,'099'))  || '-' ||  trim(to_char(rusu.rusu_rutsecuen,'0999') )) as  r_5,
                 rusu.rut_ideregistro idruta ,
                 substring(ter.ter_nomcompleto,1,40) nombre_6 ,
                 pro.pro_direccion || ' ' || bar.barrio_nom direccion_7   ,             
                 proy.proyecto_nom nproyecto_8  ,
                 trunc(dfac.dfac_vlrunitari,0) estrato_9 ,
                 RIGHT(pro.pro_numcatastral,15) apa_numcat_10 ,
                 to_char('" . $info_lecturas['ultima_lectura'] . "'::date,'DD/MM/YYYY')  fec_ultlec_11  ,
                 0.0 gm_12    ,
                 0.0 tm_13 ,  
                 0.0 cm_14 ,
                 fac.fac_ideregistro dm_19 ,
                 0.0 ftdl_hhv_21 ,  
                 0.0 lectura_anterior_24 ,
                 0.0 consumomts_25,
                 tipins.uni_nombre2 tipoinstalacion_26 ,
                 0.0 factura_27 ,
                 CAST('' as character varying) obs_28,
                 0.0 consumo1_29 ,
                 0.0 consumo2_30,
                 0.0 consumo3_31, 
	         0.0 consumo4_32,
                 0.0 consumo5_33,
		 0.0 consumo6_34,
                 0.0 sancionpormora_35 ,
                 0.0 refacturado_39 ,
                 0.0 interesesmora_40, 
                 0.0 servicios_41,
                 0.0 otrosconceptos_42 ,
                 0.0 impuesto_43 , 
                 0.0 impuesto1_44, 
                 0.0 revqacu_45,
                 0.0 revqmines_46,
                 to_char(fac.fac_fecsuspens,'DD/MM/YYYY')::varchar fecha_suspension_48 ,
                 0.0 cuota_amortizacion_g_49,
                 0.0 plazo_g_50 ,
                 0.0 cuotas_canceladas_g_51,
   		 0.0 plazo_pendiente_g_52,
		 0.0 total_g_53,
		 0.0 deuda_anterior_g_54,
		 0.0 segvid_55,
		 0.0 cuotadeamortizacion_56,
		 0.0 refacturadocartera_57,
		 0.0 mora_c_58,
		 0.0 cp_c_59,
		 0.0 cuo_act_60,
		 0.0 otrosconceptoscartera_61,
		 0.0 totalcartera_lla_62,
		 to_char(fac.fac_fecvence,'DD/MM/YYYY')  vencimiento_63,
		 0.0 promedio_64,
	 	 TRUNC(COALESCE(" . $info_lecturas['lectura_desviacion'] . ",0),2) porcentajevariacion_67,
		 0.0 des_71,
		 CAST('' AS character varying)  ipli_72,
		 CAST('' AS character varying)  io_73,
		 CAST('' AS character varying)  irst_74,
		 CAST('' AS character varying)  pdc_75,
		 0.0 cc_c_76,
		 0.0 interes_c_77,
		 0.0 int_eacarteragas_78,
                   (case when ((dsus.pro_catestrato in (1,2) AND  dsus.uni_tipusosuscr = 6) or (cosu.uni_concepto in (639,2815) AND  dsus.uni_tipusosuscr = 6 )) then	   
( CASE 
		  /* Logica adicional  x Opcion Tarifaria */
                  	WHEN proy.proyecto_ideregistro in  (1,3,4,5,6,7,8,9,11,12) THEN '61'
 			WHEN proy.proyecto_ideregistro in   (10) THEN '62'
 			WHEN proy.proyecto_ideregistro in   (13) THEN '63'
 			WHEN proy.proyecto_ideregistro in   (15) THEN '64'
 			WHEN proy.proyecto_ideregistro in   (2) THEN '65'
 			WHEN proy.proyecto_ideregistro in   (26) THEN '66'
 			WHEN proy.proyecto_ideregistro in   (19) THEN '67'
 			WHEN proy.proyecto_ideregistro in   (22) THEN '68'
 			WHEN proy.proyecto_ideregistro in   (21) THEN '69'
	 		WHEN proy.proyecto_ideregistro in   (23) THEN '70'
 			WHEN proy.proyecto_ideregistro in   (20) THEN '71'
 			WHEN proy.proyecto_ideregistro in   (24) THEN '72'
 			WHEN proy.proyecto_ideregistro in   (25) THEN '73'
 			WHEN proy.proyecto_ideregistro in   (16) THEN '74'
 			WHEN proy.proyecto_ideregistro in   (17) THEN '75'
 			WHEN proy.proyecto_ideregistro in   (14, 18) THEN '76'
 			WHEN proy.proyecto_ideregistro in   (32,35,34) THEN '77'
 			WHEN proy.proyecto_ideregistro in   (31) THEN '78'
 			WHEN proy.proyecto_ideregistro in   (33) THEN '79' END )
		 /* Logica adicional  x Opcion Tarifaria */			
		  else
                  ( CASE 
                    WHEN dsus.dsus_ideregistr in (18025	,18029	,20662	,18201	,16509	,74953	,16592	,83308	,370206	,487016	,83383	,363747	,26175	,106429	,493083	,36272	,
						81338	,83522	,22396	,326145	,106637	,17069	,16942	,36198	,82549	,80855	,16510	,40220	,82689	,83490	,106133	,365129	,
						78893	,81055	,79950	,16962	,80678	,350129	,38866	,20554	,83003	,78600	,18256	,41413	,487059	,334772	,55860	,17651	,
						17851	,479648	,109054	,40295	,83303	,482731	,19960	,20825	,18164	,18021	,479329	,16641	,331331	,487415	,20484) THEN '97' /* Logica adicional x Emergencia COVID 19 - Alcaldia  */
		  WHEN proy.proyecto_ideregistro in (18) THEN '97'   /* Logica adicional x Emergencia COVID 19 - Alcaldia  */ 
                    WHEN proy.proyecto_ideregistro in (31) then '00' 
                   -- WHEN proy.proyecto_ideregistro in (34,32,35) then '02' /* Anterior a modidicacion Logica adicional x Emergencia COVID 19 - Alcaldia  */
                    WHEN proy.proyecto_ideregistro in (32) then '02'   /* Logica adicional x Emergencia COVID 19 - Alcaldia  */
                    WHEN proy.proyecto_ideregistro in (34,35) then '98' /* Logica adicional x Emergencia COVID 19 - Alcaldia  */ 
                    WHEN proy.proyecto_ideregistro in (33) then '05' 
                    WHEN proy.proyecto_ideregistro in (14,27,1,2,10,13,15,16,17,19,20,21,22,23,24,25,26) THEN  proy.proyecto_cod
                  --  WHEN proy.proyecto_ideregistro in (18) THEN '15' /* Anterior a modidicacion Logica adicional x Emergencia COVID 19 - Alcaldia  */

                    WHEN proy.proyecto_ideregistro in (1) THEN '01'  ELSE '99' END ) END )::varchar || ''  ||  to_char(per.per_fecfinal,'MM') || '' || date_part('year',per.per_fecfinal)    ftdl_prmean_80 ,		 
                 0.0 ftdl_fnr_81,
		 CAST('' AS character varying)  swt_exc_82,
		 CAST('' AS character varying)  nombrebarrio_85,
		 dsus.dsus_factor factordecorreccion_86,
		 CAST('' AS character varying)  mua_cod_87,
		 0.0 lmf_fac_88,
		 CAST('' AS character varying)  tipo_aseo_89,
		 0.0 interesesmoraseo_90,
		 0.0 lmf_fecven_91,
		 0.0 mua_cat_92,
		 0.0 mua_est_93,
		 0.0 mts_aseo_94,
		 0.0 cse_frerec_95,
		 0.0 cse_frebar_96,
		 0.0 subsidio_aseo_97,
		 0.0 contribucion_aseo_98,
		 0.0 lmf_totant001_99,
		 0.0 lmf_totant002_100,
		 0.0 lmf_totant003_101,
		 0.0 lmf_totant004_102,
		 0.0 lmf_totant005_103,
		 0.0 lmf_totant006_104,
 		 0.0 lmf_tar_105,
		 0.0 lmf_subcon_106,
		 0.0 lmf_des_107,
		 0.0 lmf_sob_108,
		 0.0 lmf_ant_109,
		 0.0 lmf_mor_110,
		 0.0 lmf_otraseo_111,
		 0.0 totalconsumo_bio_112,
		 CAST('' AS character varying)  concepto_113,
		 0.0 numcuo_114,
		 0.0 val_cuo_115,
		 0.0 lmf_tot_116,
		 " . $parametros['empresa'] . " idempresa_118,
		 ( CASE(dsus.uni_municipio) WHEN 1 THEN 1 ELSE 2 END ) as  tipofactura_120,
		 date_part('year',per.per_fecfinal) || '' ||  to_char(per.per_fecfinal,'MM')  periodofes_121,
		 proy.proyecto_codciu idmunicipio_123,
		 dsus.cic_ideregistro idciclo_124,
		 dsus.dsus_pcodigo  idsuscriptorfes_127,
		 pro.pro_digitos digitosmedidor_131,
		 0.0 consumo_desa_134,
		 0.0 consumo_desb_135,
		 to_char(fac.fac_fecvence,'YYYYMMDD')  fecha_ean_136,
		 CAST('' AS character varying)  fecha_maxrevqui_137,
		 CAST('' AS character varying)  fecha_minrevqui_138,
		 CAST('' AS character varying)  fecha_susrevqui_139,
		 (CASE     WHEN proy.proyecto_ideregistro in (13) THEN '010/2008'
                           WHEN proy.proyecto_ideregistro in (10) THEN '0108/1996'
                           WHEN proy.proyecto_ideregistro in (19) THEN '028/2009'
                           WHEN proy.proyecto_ideregistro in (21) THEN '030/2009'
                           WHEN proy.proyecto_ideregistro in (20) THEN '032/2009'
                           WHEN proy.proyecto_ideregistro in (17) THEN '034/2009'
                           WHEN proy.proyecto_ideregistro in (18) THEN '048/2004'
                           WHEN proy.proyecto_ideregistro in (14) THEN '048/2004'
                           WHEN proy.proyecto_ideregistro in (15) THEN '052/2009'
                           WHEN proy.proyecto_ideregistro in (26) THEN '057/2010'
                           WHEN proy.proyecto_ideregistro in (25) THEN '058/2010'
                           WHEN proy.proyecto_ideregistro in (2)  THEN '067/2007'
                           WHEN proy.proyecto_ideregistro in (16) THEN '150/2009'
                           WHEN proy.proyecto_ideregistro in (22) THEN '29/2009'
                           WHEN proy.proyecto_ideregistro in (23) THEN '31/2009'
                           WHEN proy.proyecto_ideregistro in (24) THEN '33/2009'
                           
                           WHEN proy.proyecto_ideregistro in (32) THEN '20/2004'
                           WHEN proy.proyecto_ideregistro in (35) THEN '20/2004'
                           WHEN proy.proyecto_ideregistro in (34) THEN '20/2004'
                           WHEN proy.proyecto_ideregistro in (31) THEN '24/2004'
                           WHEN proy.proyecto_ideregistro in (33) THEN '25/2004'                                
                           
                          ELSE  '094/2004 Y 049/2004'
                  END )  resolucion_141,
		 0.0 otrosconceptostarsub_156,
		 0.0 impuestotarsub_157,
		 0.0 impuesto1tarsub_158,
		 0.0 tfri_159,  
		 0.0 trti_160,
		 0.0 ttei_161,
		 0.0 tbli_162,
		 0.0 tdti_163,
		 0.0 cuf_164,
                 0.0 cv_165 , 
                 0.0 tra_166  ,
                 0.0 trbl_167 , 
                 0.0 trna_168  ,
                 0.0 tasafinanciacion_169 , 
                 0.0 baseivainterna_170 ,
                 0.0 ivainterna_171 ,
                 0.0 baseivaintfinanciacion_172 ,
                 0.0 ivaporinteres_173, 
                 0 suscripcion_bio ,
                 0 suscripcion_ace ,
                 
                 0.0 tafna1_174,
                 0.0 trlu1_175,
                 0.0 trra1_176,
                 0.0 trbl1_177,
                 0.0 tra1_178,
                 0.0 trna1_179,
                 0.0 tafna2_180,
                 0.0 trlu2_181,
                 0.0 trra2_182,
                 0.0 trbl2_183,
                 0.0 tra2_184,
                 0.0 trna2_185,
                 0.0 otrosservicios_186,
                 0.0 saldo_deuda_187,
                 0.0 valor_antes_Iva_188,
                 0.0 interesmorarp_189,
                 0.0 ivafinanciacionrp_190,
                 0.0 baseivarp_191

   FROM 
    dsus_detsuscrip dsus
  INNER JOIN proyectos proy on proy.proyecto_ideregistro = dsus.uni_municipio
  INNER JOIN pro_propiedad pro  on  dsus.pro_ideregistro = pro.pro_ideregistro
  INNER JOIN barrios bar on pro.uni_barrio = bar.barrio_ideregistro
  INNER JOIN rusu_rutsuscrip rusu on dsus.dsus_ideregistr = rusu.dsus_ideregistr
  INNER JOIN rut_ruta rut ON rut.rut_ideregistro = rusu.rut_ideregistro
  INNER JOIN ter_tercero ter on ter.ter_ideregistro = dsus.ter_ideregistro
  INNER JOIN per_periodo per on dsus.cic_ideregistro = per.cic_ideregistro
  INNER JOIN fac_factura fac on dsus.dsus_ideregistr = fac.dsus_ideregistr 
  INNER JOIN uni_unidad tipins on tipins.uni_ideregistro = fac.uni_tipusosuscr
  left join cosu_consuscrip cosu on cosu.dsus_ideregistr=dsus.dsus_ideregistr and cosu.uni_concepto in (639,2815)
							 and now()::date BETWEEN cosu.cosu_fecinicio and cosu.cosu_fecfinal
  LEFT  JOIN dfac_detfactura dfac on dfac.fac_ideregistro= fac.fac_ideregistro and dfac.uni_concepto = 44 
 WHERE

   dsus.emp_ideregistro = :empresa  and 
   dsus.cic_ideregistro = :ciclo  and 
   fac.fac_estado='G' and  
   per.per_estado ='A'   $complemento ";

        try {
            $this->executeQuery($sql, $parametros);
        } catch (\Exception $ex) {
            $this->construyeMensajeExcepcion($ex);
        }
    }

    public function consultarListadoFacturas($parametros) {
        $nombre = $parametros['idempresa'] . "_ciclo_" . $parametros['idciclo'];
        $sql = " select idfactura fac_ideregistro,empresa,periodo,numfac_2 suscripcion,periodo,suscripcion_bio,suscripcion_ace
                 from  proceso_genera_fes_" . $nombre . " where proceso = :idproceso and empresa = :idempresa ";
        try {
            $resultado = $this->executeQuery($sql, $parametros);
        } catch (\Exception $ex) {
            print_r($ex->getMessage());
        }
        print_r($resultado);
        if (empty($resultado)) {
            print_r("No hay facturas a Procesar");
        }
        return $resultado;
    }

    public function actualizarCamposFormuladosFuncDB($parametros, $idproceso) {
        try {
            $parametros['tabla'] = 'proceso_genera_fes_' . $parametros['idempresa'] . '_ciclo_' . $parametros['idciclo'];
            $parametros['idproceso'] = $idproceso;
            $sql = "select * from calculacamposfes_V01( :fac_ideregistro, :empresa, :suscripcion, :periodo, :tabla , :idproceso ) ";
            $resultado = $this->executeQuery($sql, $parametros);
        } catch (\Exception $ex) {
            $this->construyeMensajeExcepcion($ex);
        }
        return $resultado;
    }

    public function informacionLecturas($parametros) {
        try {
            $sql = "SELECT  lec.lec_conpromedio lectura_promedio,lec.lec_desviacion lectura_desviacion ,
                            lec.lec_fecha ultima_lectura
                    FROM   
                lec_lectura lec 
                where  lec.cic_ideregistro = :ciclo  and lec.emp_ideregistro = :empresa  and lec_estado ='P' order by lec_fecha desc  limit 1 ";

            $resultado = $this->executeQuery($sql, $parametros);
        } catch (\Exception $ex) {
            $this->construyeMensajeExcepcion($ex);
        }
        return $resultado[0];
    }

    private function construyeMensajeExcepcion(\Exception $excepcion) {
        throw new MyException(' MENSAJE ERROR :' . $excepcion->getMessage() .
        ' Linea:' . $excepcion->getLine() .
        ' Archivo :' . $excepcion->getFile(), -1);
    }

    public function consultarRegistrosGenerados($parametros) {
        try {// print_r($parametros);
            $nombre = $parametros['empresa'] . "_ciclo_" . $parametros['ciclo'];
            $sql = 'select * from  
             proceso_genera_fes_' . $nombre . ' where ciclo =  :ciclo and empresa = :empresa';

            $resultado = $this->executeQuery($sql, $parametros);
            //print_r($resultado);
            if (empty($resultado)) {
                throw new MyException(" No hay Registros en este ciclo a Procesar", -1);
//                return $resultado;
            }
            //Actualizar ciclo en proceso en empresa 
            $this->actualizarCicloProceso($parametros['empresa'], $parametros['ciclo']);
        } catch (\Exception $ex) {
            throw new MyException(" No hay Registros en este ciclo a Procesar ", -1);
        }
    }

    public function consultarIdActividad($idciclo, $programa) {
        $parametros['ciclo'] = $idciclo;
        $parametros['programa'] = $programa;
        $sql = " select dper.dper_ideregistr idactividad 
                  FROM 
                     dper_detperiodo dper 
                     INNER JOIN per_periodo per ON per.per_ideregistro = dper.per_ideregistro 
                     WHERE per.cic_ideregistro = dper.cic_ideregistro AND 
                           dper.prg_ideregistro = :programa AND dper.cic_ideregistro = :ciclo AND 
                           dper.dper_estado ='A' and per.per_estado = 'A' LIMIT 50 ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function construyeArchivoPlanoFes($parametros) {
        try {
            $Datos['ruta_nombre_archivo'] = $parametros['ruta'] . '/' . $parametros['nombre_archivo'];
            print_r($Datos);
            $sql = " COPY   (     
 SELECT 
                    pcodigo_1 AS PCODIGO,
                    numfac_2 AS NUMFAC,
                    null FECEMI,
                    substring(medidor_4, 1,15 ) AS MEDIDOR,
                    r_5 AS R,
                    substring(regexp_replace(nombre_6, '[^a-zA-Z0-9\s\.]', ' ', 'g'),1,40) AS NOMBRE , 
                    substring(regexp_replace(direccion_7, '[^a-zA-Z0-9\s\.\#\-]', ' ', 'g'),1,60) AS DIRECCION,
                    nproyecto_8 AS NPROYECTO,
                    estrato_9 AS ESTRATO,---
                    apa_numcat_10 AS APA_NUMCAT,
                    (CASE  
		         WHEN (fec_ultlec_11  is null OR fec_ultlec_11  ='' ) THEN  (select to_char(max(fec_ultlec_11::date),'DD/MM/YYYY') from proceso_genera_fes_" . $parametros['idtabla'] . " fes   where fes.idciclo_124 = idciclo_124 and fec_ultlec_11 !='' ) 
				ELSE  to_char(fec_ultlec_11::date ,'DD/MM/YYYY')  END
		    )  AS  FEC_ULTLEC, 
                    (CASE  WHEN gm_12 =0 OR gm_12 is null THEN 0 ELSE  trunc(gm_12,2) END) AS GM,
                    (CASE  WHEN tm_13 =0 OR tm_13 is null THEN 0 ELSE  trunc(tm_13,2) END) AS TM,
                    (CASE  WHEN cm_14 =0 OR cm_14 is null THEN 0 ELSE  trunc(cm_14,2) END) AS CM,
                    0 As     KWH,
                    0 AS VlrKwh ,
                    0 AS VlrMet_20,
                    0 AS VlrMet,    
                    dm_19 DM,
                    0 AS FTDL_Dvjm,
                    trunc(ftdl_hhv_21,2) AS FTDL_HHV,
                    0 AS OTR_SUB,
                    0 AS LECTURAACTUAL,
                    COALESCE(lectura_anterior_24,0)::integer AS LECTURA_ANTERIOR,
                    consumomts_25::integer CONSUMO_MTS ,
                    tipoinstalacion_26 AS TIPOINSTALACION,
                    factura_27 ::integer AS FACTURA,
                    (CASE WHEN obs_28='' then null else obs_28  end )  AS OBS,
		    COALESCE(consumo1_29,0)::integer AS CONSUMO1,
                    COALESCE(consumo2_30,0)::integer AS CONSUMO2,
                    COALESCE(consumo3_31,0)::integer AS CONSUMO3,
                    COALESCE(consumo4_32,0)::integer AS CONSUMO4,
                    COALESCE(consumo5_33,0)::integer AS CONSUMO5,
                    COALESCE(consumo6_34,0)::integer AS CONSUMO6,
                    COALESCE(sancionpormora_35,0)::integer AS SANCIONPORMORA,
                    0 AS TARIFABASICA,
                    0 AS CONSUMOVALORPLENO,
                    0 AS SOC,
                    COALESCE(refacturado_39,0)::integer AS REFACTURADO,
                    COALESCE(interesesmora_40,0)::integer AS INTERESESMORA,
                    COALESCE(servicios_41,0)::integer AS VALORSERVICIOS,
                    COALESCE(otrosconceptos_42,0)::integer AS OTROSCONCEPTOS,
                    COALESCE((impuesto_43 *(-1)),0)::integer AS IMPUESTO,
                    COALESCE((impuesto1_44 *(-1)),0)::integer AS IMPUESTO1,
                    COALESCE(revqacu_45 ,0)::integer AS REVQACU,
                    COALESCE(revqmines_46 ,0)AS REVQMINES,
                    0 AS TOTALCONSUMOLLA,
		     (CASE 
			WHEN ( COALESCE(interesesmora_40,0) +  COALESCE(mora_c_58,0) + COALESCE(refacturadocartera_57, 0 ) + 
                                 + COALESCE(deuda_anterior_g_54, 0) + COALESCE(refacturado_39, 0 )  > 0 )
                        THEN 'INMEDIATO'
		     ELSE fecha_suspension_48::varchar 
			END ) AS FECHA_SUSPENSION,
                    COALESCE(cuota_amortizacion_g_49,0)::integer AS CUOTA_AMORTIZACION_G,
                    COALESCE(plazo_g_50,0)::integer AS PLAZO_G,
                    COALESCE(cuotas_canceladas_g_51,0)::integer AS CUOTAS_CANCELADAS_G,
                    COALESCE(plazo_pendiente_g_52,0)::integer AS PLAZO_PENDIENTE_G,
                    COALESCE(total_g_53,0 )::integer AS TOTAL_G,
                    COALESCE(deuda_anterior_g_54,0)::integer AS DEUDA_ANTERIOR_G,
                    COALESCE(segvid_55 ,0)::integer AS SEGVID,
                    COALESCE(cuotadeamortizacion_56,0)::integer AS CUOTADEAMORTIZACION,
                    COALESCE(refacturadocartera_57,0)::integer AS REFACTURADOCARTERA,
                    COALESCE(mora_c_58,0 )::integer AS MORAC,
                    cp_c_59 ::integer AS CPC,
                    cuo_act_60 ::integer AS CUOACT,
                    COALESCE(otrosconceptoscartera_61,0)::integer AS OTROSCONCEPTOSCARTERA,
                    COALESCE(totalcartera_lla_62,0)::integer AS TOTALCARTERA_LLA,
                   (CASE 
                         WHEN (COALESCE(interesesmora_40,0) +  COALESCE(mora_c_58,0) + COALESCE(refacturadocartera_57, 0 ) + 
                                 + COALESCE(deuda_anterior_g_54, 0) + COALESCE(refacturado_39, 0 ) > 0 ) 
                         THEN 'INMEDIATO'
                       ELSE vencimiento_63::varchar END )   AS VENCIMIENTO, 
                    COALESCE(promedio_64,0)::integer AS PROMEDIO,
                    null CODIGOANOMALIA,
                    0 AS LECTURAREAL,
                    
                    0.67 AS PORCENTAJEVARIACION,
                    0 AS TARIFA_BASICA_SUB,
                    0 AS CONSUMO_VALOR_SUB,
                    0 TOTAL_FACTURADO_LLA,
                    trunc(des_71 ,2) AS DES,
                    ipli_72 AS IPLI,
                    io_73 AS IO,
                    irst_74 AS IRST,
                    (CASE WHEN pdc_75='' THEN null ELSE pdc_75 END ) AS PDC,
                    COALESCE(cc_c_76, 0)  AS CC,
                    COALESCE(trunc(interes_c_77,0), 0) AS INTERES_C,
                    trim(to_char(COALESCE(trunc(int_eacarteragas_78,2),0),'90.99%') )	AS INT_EACARTERAGAS,
                    null FTDL_IndRan,
                    ftdl_prmean_80 AS FTDL_prmean,
                    ftdl_fnr_81 AS FTDL_FNR,
                    (CASE  WHEN swt_exc_82='' THEN null ELSE swt_exc_82 END )  AS SWT_EXC,
                    0 as PORSUB,
                    0 as PORCON,	
                    (CASE WHEN(nombrebarrio_85='') THEN null ELSE nombrebarrio_85 END ) AS NOMBREBARRIO,
                    trunc(factordecorreccion_86,2) AS FACTORDECORRECCION,
                    (CASE  WHEN mua_cod_87='' or mua_cod_87 is null  THEN '0' ELSE mua_cod_87 END) AS MUA_COD,
                    COALESCE(lmf_fac_88,0) AS LMF_FAC,
                    (CASE  WHEN replace(replace(substring(tipo_aseo_89 ,1,20), 'Ñ','N'),'ñ','n') ='' THEN null ELSE replace(replace(substring(tipo_aseo_89 ,1,20), 'Ñ','N'),'ñ','n') END )  AS TIPO_ASEO,
                    trunc(COALESCE(interesesmoraseo_90,0),3) AS INTERESESMORASEO,
                    COALESCE(lmf_fecven_91,0)::integer AS LMF_FECVEN,
                    COALESCE(mua_cat_92,0)::integer AS MUA_CAT,
                    COALESCE(mua_est_93,0)::integer AS MUA_EST,
                    trunc(COALESCE(mts_aseo_94,0),2) AS MTS_ASEO,
                    COALESCE(cse_frerec_95,0)::integer AS CSE_FREREC,
                    COALESCE(cse_frebar_96,0)::integer AS CSE_FREBAR,
                    (CASE WHEN subsidio_aseo_97<=0  THEN null  else trim(to_char(trunc(COALESCE(subsidio_aseo_97,0),0),'900%'))  END  )AS SUBSIDIO_ASEO,
		    (CASE WHEN contribucion_aseo_98<=0  THEN  null ELSE  trim(to_char(trunc(COALESCE(contribucion_aseo_98,0),0),'900%')) END  )AS  CONTRIBUCION_ASEO,
                    COALESCE(lmf_totant001_99,0)::integer AS LMF_TOTANT001 ,
                    COALESCE(lmf_totant002_100,0)::integer  AS LMF_TOTANT002,
                    COALESCE(lmf_totant003_101,0)::integer  AS LMF_TOTANT003,
                    COALESCE(lmf_totant004_102,0)::integer  AS LMF_TOTANT004,
                    COALESCE(lmf_totant005_103,0)::integer  AS LMF_TOTANT005,
                    COALESCE(lmf_totant006_104,0)::integer  AS LMF_TOTANT006,
                    COALESCE(lmf_tar_105 ,0 )::integer  AS LMF_TAR,
                    COALESCE(lmf_subcon_106,0)::integer AS LMF_SUBCON,
                    COALESCE(lmf_des_107,0)::integer AS LMF_DES,
                    COALESCE(lmf_sob_108,0)::integer AS LMF_SOB,
                    COALESCE(lmf_ant_109,0)::integer AS LMF_ANT,
                    COALESCE(lmf_mor_110,0)::integer AS LMF_MOR,
                    COALESCE(lmf_otraseo_111,0)::integer AS LMF_OTRASEO,
                    COALESCE(totalconsumo_bio_112,0)::integer AS TOTAL_CONSUMO_BIO,
                    (CASE  WHEN concepto_113 ='' THEN null ELSE concepto_113 END)   AS CONCEPTO,
                    COALESCE(numcuo_114,0)::integer AS NUMCUO,
                    COALESCE(val_cuo_115,0)::integer AS VAL_CUO,
                    COALESCE(lmf_tot_116,0)::integer AS LMF_TOT,
                    0 AS TOTALFACTURADO,
                    idempresa_118 AS IDEMPRESA,
                    idempresa_118 AS IDEMPRESACONTRATISTA,
                    COALESCE(tipofactura_120,0) AS TIPOFACTURA,
                    periodofes_121 AS PERIODOFES,
                    null AS IDFOTO,
                    idmunicipio_123 AS IDMUNICIPIO,
                    idciclo_124 AS IDCICLO,
                    0 AS IDORDEN,    
                    null IDUSUARIOFES ,
                    idsuscriptorfes_127 AS IDSUSCRIPTORFES,
                    null CoordenadaGPS,
                    null AS EstadoFESMovil,
                    null AS EstadoFESServer,
                    digitosmedidor_131 AS DIGITOSMEDIDOR,
                    null INDICADORPROMEDIO,
                    null TIPOLECTURA,
                    consumo_desa_134 AS CONSUMO_DESA,
                    consumo_desb_135 AS CONSUMO_DESB,
                    fecha_ean_136 AS FECHA_EAN,
                    (CASE  WHEN fecha_maxrevqui_137 ='' THEN null ELSE fecha_maxrevqui_137 END ) AS FECHA_MAXREVQUI,
                    (CASE  WHEN fecha_minrevqui_138 ='' THEN null ELSE fecha_minrevqui_138 END ) AS FECHA_MINREVQUI,
                    (CASE  WHEN fecha_susrevqui_139 ='' THEN null ELSE fecha_susrevqui_139 END ) AS FECHA_SUSREVQUI,
                    0 AS CONSECUTIVO,
                    resolucion_141 AS RESOLUCION,
                    0 AS FTDL_DVJM_Sub,
                    0 AS Val_Subdvjm, 
                    0 AS FTDL_DVJM_Edo,
                    0 AS VlrMetSub_20,	
                    0 AS VlrMetSub,
                    0 AS SOCSUB,	
                    0 AS TARIFA_BASICA_SUB_TARSUB,
                    0 AS CONSUMO_VALOR_SUB_TARSUB,
                    0 AS TARIFA_BASICA_TARSUB,
                    0 AS CAL_SUB_CONSUMO_VAL,
                    0 AS PORSUB_TARSUB,
                    0 AS PORCON_TARSUB,
                    0 AS TOTAL_CONSUMO_LLA_Tarsub,
                    0 AS Total_Facturado_LLA_TarSub,
                    COALESCE(otrosconceptostarsub_156,0)::integer AS OTROSCONCEPTOSTARSUB,
                    COALESCE(impuestotarsub_157 ,0)::integer AS IMPUESTOTARSUB,
                    COALESCE(impuesto1tarsub_158 ,0)::integer AS IMPUESTO1TARSUB,
                    trunc(COALESCE(tfri_159,0),2) AS TFRI,
                    trunc(COALESCE(trti_160,0),2) AS TRTI,
                    trunc(COALESCE(ttei_161,0),3) AS TTEI,
                    trunc(COALESCE(tbli_162,0),4) AS TBLI,
                    trunc(COALESCE(tdti_163,0),3) AS TDTI,
                    trunc(COALESCE(cuf_164,0),2) AS CUF ,
                    trunc(COALESCE(cv_165,0),2) AS CV, 
                    trunc(COALESCE(tra_166,0),3)  AS TRA  ,
                    trunc(COALESCE(trbl_167,0),4) AS TRBL , 
                    trunc(COALESCE(trna_168  ,0),4) AS TRNA ,
                    trim(to_char(COALESCE(trunc(tasafinanciacion_169,2),0),'90.99')) AS TASA_FINANCIACION , 
                    COALESCE(baseivainterna_170,0)::integer AS BASE_IVA_INTERNA ,
                    trunc(COALESCE(ivainterna_171,0),2) AS IVA_INTERNA ,
                    COALESCE(baseivaintfinanciacion_172,0)::integer  AS BASE_IVA_INT_FINANCIACION ,
                    COALESCE(ivaporinteres_173,0)::integer  AS IVA_POR_INTERES ,
                    trunc(COALESCE(tafna1_174,0),3) TAFNA1 ,
                    trunc(COALESCE(trlu1_175,0),0) TRLU1,
                    trunc(COALESCE(trra1_176,0),3) AS TRRA1,
                    trunc(COALESCE(trbl1_177,0),3) AS TRBL1 ,
                    trunc(COALESCE(tra1_178,0),0)  AS TRA1,
                    trunc(COALESCE(trna1_179,0),0) AS TRNA1, 
                    trunc(COALESCE(tafna2_180,0),3) TAFNA2 ,
                    trunc(COALESCE(trlu2_181,0),4) TRLU2,
                    trunc(COALESCE(trra2_182,0),3) AS TRRA2,
                    trunc(COALESCE(trbl2_183,0),4) AS TRBL2 ,
                    trunc(COALESCE(tra2_184,0),3)  AS TRA2,
                    trunc(COALESCE(trna2_185,0),4) AS TRNA2, 
                    trunc(COALESCE(otrosservicios_186,0),0) AS OTROS_SERVICIOS,
                    trunc(COALESCE(saldo_deuda_187,0),0) AS saldo_deuda,
                    trunc(COALESCE(valor_antes_Iva_188,0),0) AS valor_antes_Iva,
                    trunc(COALESCE(interesmorarp_189,0),0) AS interesmorarp,
                    trunc(COALESCE(ivafinanciacionrp_190,0),0) AS ivafinanciacionrp,
                    trunc(COALESCE(baseivarp_191,0),0) AS baseivarp
        FROM  proceso_genera_fes_" . $parametros['idtabla'] . ")  TO '" . $Datos['ruta_nombre_archivo'] . "'  WITH  DELIMITER '|'    CSV HEADER   ESCAPE E'\n' ENCODING 'UTF8' ";
            print_r($sql);
            $this->executeQuery($sql);
        } catch (\Exception $ex) {
            throw new MyException("Error construyendo archivo plano Fes " . $ex->getMessage(), -1);
        }
    }

    public function consultaFecha() {
        try {
            $sql = "SELECT date_part('year', NOW()) ano,
                   date_part('month', NOW()) mes ,
                   date_part('day', NOW()) dia ,
                   now() fecha_completa";

            $resultado = $this->executeQuery($sql);
        } catch (\Exception $ex) {
            throw new MyException("Error consultando Fecha " . $ex->getMessage(), -1);
        }
        return $resultado;
    }

    public function guardaControlArchivo($parametros) {
        try {
            $resultado = $this->insertar($parametros, 'carc_ctrarchivo', 'sq_carc_ideregistr');
        } catch (\Exception $ex) {
            throw new MyException("Error Insertando registro de Control de Archivos" . $ex->getMessage(), -1);
        }
        return $resultado;
    }

    public function construyeResumenRutas($parametros) {
        try {
            $Datos['ruta_nombre_archivo'] = $parametros['ruta'] . '/' . $parametros['nombre_archivo'];
            $sql = "COPY ( with rutas as ( select distinct rut.rut_tipo::varchar Ruta , count(*) Cantidad
                 from 
                     proceso_genera_fes_" . $parametros['idtabla'] . " prfe 
                         INNER JOIN rut_ruta rut on prfe.idruta =  rut.rut_ideregistro group by rut.rut_tipo )
                     select * from rutas union all select 'total',  sum(cantidad) from rutas )                                                    
                     TO  '" . $Datos['ruta_nombre_archivo'] . "' WITH  DELIMITER E'\t'  CSV HEADER ";
            $this->executeQuery($sql);
        } catch (\Exception $ex) {
            throw new MyException("Error Generando Archivo resumen por rutas" . $ex->getMessage(), -1);
        }
    }

    public function construyeResumenCartas($parametros, $Datos) {
        try {


            $sql = "COPY (with infocartas as (
                        select pro.proyecto_nom,rut.rut_tipo idruta , rut.rut_nombre,count(*) cantidad_cartas   from proceso_genera_fes_" . $parametros['idtabla'] . "   fes
                 inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr = fes.numfac_2
                 inner join rusu_rutsuscrip rusu on rusu.dsus_ideregistr = dsus.dsus_ideregistr
                 inner join rut_ruta rut on rut.rut_ideregistro = rusu.rut_ideregistro
                 inner join proyectos pro on pro.proyecto_ideregistro = dsus.uni_municipio
                 where  ciclo= " . $Datos['idciclo'] . " and ( nombrebarrio_85 ilike '%RTR%'  OR nombrebarrio_85 ilike '%ConVo%'  OR nombrebarrio_85 ilike '%Millon%' OR nombrebarrio_85 ilike '%MOR%') and empresa= " . $Datos['idempresa'] . " group by pro.proyecto_nom, rut.rut_tipo,rut.rut_nombre order by rut.rut_tipo )
                        select * from infocartas union all select 'total Cartas' ,null,null,sum(cantidad_cartas) from infocartas )  TO  '" . $parametros['ruta'] . '/' . $parametros['nombre_archivo'] . "' WITH  DELIMITER E'\t'  CSV HEADER ";
            $this->executeQuery($sql);
        } catch (\Exception $ex) {
            throw new MyException("Error Generando Archivo resumen por cartas " . $ex->getMessage(), -1);
        }
    }

    public function construyeResumenMesCiclo_xls($parametros, $Datos) {
        try {
            $sql = "select 
                    (select count(*) from proceso_genera_fes_" . $parametros['idtabla'] . " where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . ")  as cantidad ,
                    (select sum( sancionpormora_35) from proceso_genera_fes_" . $parametros['idtabla'] . "   where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . " )  as sancion_por_mora,
                    (select sum( refacturado_39::integer) from proceso_genera_fes_" . $parametros['idtabla'] . "  where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . ")   as refacturado,
                    (select sum( interesesmora_40) from proceso_genera_fes_" . $parametros['idtabla'] . "  where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . ")    as interesesmora,
                    (select sum( servicios_41::integer) from proceso_genera_fes_" . $parametros['idtabla'] . " where  ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . ")   as valorservicios ,
                    (select sum( (impuesto_43*(-1))::integer) from proceso_genera_fes_" . $parametros['idtabla'] . "  where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . ")   as impuesto,
                    (select sum( (impuesto1_44*(-1))::integer ) from proceso_genera_fes_" . $parametros['idtabla'] . "  where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . ")  as impuesto1 ,
                    (select sum( revqmines_46) from proceso_genera_fes_" . $parametros['idtabla'] . "  where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . ")  as revqimes ,
                    (select sum( revqacu_45::integer ) from proceso_genera_fes_" . $parametros['idtabla'] . "  where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . ")   as revqacu ,
                    (select sum( ftdl_fnr_81 ) from proceso_genera_fes_" . $parametros['idtabla'] . "  where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . ")  as ftdl_fnr ,
                    (select COUNT(totalcartera_lla_62) from proceso_genera_fes_" . $parametros['idtabla'] . "  where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . " and totalcartera_lla_62>0)  as cantidad_cartera_llanogas, 
                    (select sum( cuotadeamortizacion_56::integer) from proceso_genera_fes_" . $parametros['idtabla'] . "   where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . ")   as cuota_amortizacion,
                    (select sum( refacturadocartera_57::integer ) from proceso_genera_fes_" . $parametros['idtabla'] . "  where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . ")  as refacturadocartera, 
                    (select sum( mora_c_58::integer ) from proceso_genera_fes_" . $parametros['idtabla'] . "  where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . ")   as mora_cartera,
                    (select sum( otrosconceptoscartera_61::integer ) from proceso_genera_fes_" . $parametros['idtabla'] . "  where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . ")   as otros_conceptos_cartera,
                    (select sum( totalcartera_lla_62::integer ) from proceso_genera_fes_" . $parametros['idtabla'] . "   where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . ")   as total_cartera_llano ,
                    (select sum( total_g_53::integer ) from proceso_genera_fes_" . $parametros['idtabla'] . "   where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . ")   as total_gasodomesticos,
                    (select sum( segvid_55::integer ) from proceso_genera_fes_" . $parametros['idtabla'] . "   where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . ")  as segvid, 
                    (select count(*) from proceso_genera_fes_" . $parametros['idtabla'] . "   where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . " and lmf_fac_88>0)   as lmf_fac ,
                    (select sum(lmf_tar_105::integer) from proceso_genera_fes_" . $parametros['idtabla'] . "   where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . " )   as lmf_tar ,
                    (select sum(lmf_subcon_106::integer) from proceso_genera_fes_" . $parametros['idtabla'] . "   where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . " )   as lmf_subcon ,
                    (select sum(lmf_des_107::integer) from proceso_genera_fes_" . $parametros['idtabla'] . "   where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . " )   as lmf_des ,
                    (select sum(lmf_sob_108::integer) from proceso_genera_fes_" . $parametros['idtabla'] . "   where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . " )   as lmf_sob ,
                    (select sum(lmf_ant_109::integer) from proceso_genera_fes_" . $parametros['idtabla'] . "   where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . " )   as lmf_ant ,
                    (select sum(lmf_mor_110::integer) from proceso_genera_fes_" . $parametros['idtabla'] . "   where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . " )   as lmf_mor ,
                    (select sum(lmf_otraseo_111::integer) from proceso_genera_fes_" . $parametros['idtabla'] . "   where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . " )   as lmf_otraseo ,
                    (select sum(lmf_tot_116::integer) from proceso_genera_fes_" . $parametros['idtabla'] . "   where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . " )   as lmf_tot ,
                    (select sum(val_cuo_115::integer) from proceso_genera_fes_" . $parametros['idtabla'] . "   where ciclo= " . $Datos['idciclo'] . " and empresa=" . $Datos['idempresa'] . " )   as val_cuo  ";
            $resultado = $this->executeQuery($sql);
            return $resultado[0];
        } catch (\Exception $ex) {
            throw new MyException("Error Generando Archivo resumen Mes Ciclo" . $ex->getMessage(), -1);
        }
    }

    public function validaExistenciaTabla($nombre) {
        $existe = 0;
        try {
            while ($existe == 0) {

                print_r(" Validando existencia de tabla : " . $nombre . " resultado:" . $existe);
                $sql = " select count(*) cantidad from pg_tables where tablename='" . $nombre . "'";
                print_r($sql);
                $resultado = $this->executeQuery($sql);
                $existe = $resultado[0]['cantidad'];
                sleep(2);
            }
        } catch (\Exception $ex) {
            throw new MyException("Error Consultando Tabla temporal :" . $nombre);
        }
    }

    private function numregistrosGenerar($empresa) {
        $sql = " select phil_numreggenfes cantidad from phil_parhilo where emp_ideregistro = " . $empresa;
        $resultado = $this->executeQuery($sql);
        if (!empty($resultado))
            return $resultado[0]['cantidad'];
        else
            return 0;
    }

    public function consultaCamposValidar($fase) {
        $sql = "select * from vlfe_valfes where vlfe_fase  = $fase ";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function validacionCampos($parametros, $tabla, $idfactura = null) {
        $complemento = '';
//        print_r("\n Validando Factura :");
//        print_r($idfactura);
        if (!empty($idfactura) && $idfactura != null)
            $complemento = " and idfactura = $idfactura";
        switch ($parametros['vlfe_regla']) {
            case 'texto' :
                $regla = '[a-zA-Z]';
                $mensaje = ' Vacio o con caracteres especiales';
                $validacion = "textregexeq(" . $parametros['vlfe_campo'] . "::varchar,'" . $regla . "') = false";
                break;
            case 'digitos' :
                $regla = '^[0-9]+(\.[[:digit:]]+)?$';
                $mensaje = ' Vacio o contiene letras o caracteres especiales';
                $validacion = "textregexeq(" . $parametros['vlfe_campo'] . "::varchar,'" . $regla . "') = false";
                break;
            case 'digitosguion' :
                $regla = '^[0-9]+(\-[[:digit:]]+)?$';
                $mensaje = ' Vacio o contiene letras o caracteres especiales';
                $validacion = " textregexeq(" . $parametros['vlfe_campo'] . "::varchar,'" . $regla . "') = false";
                break;
            case 'digitosmayor0' :
                $regla = '^[0-9]+(\.[[:digit:]]+)?$';
                $mensaje = ' No es un dígito o este es igual o menor 0 ';
                $validacion = " textregexeq(" . $parametros['vlfe_campo'] . "::varchar,'" . $regla . "') = false "
                        . " or " . $parametros['vlfe_campo'] . " ::numeric  <=0  ";
                break;
            case 'fecha' :
                $regla = '^[0-9]+(\/[[:digit:]]+)(\/[[:digit:]]+)?$';
                $mensaje = ' Fecha no válida  ';
                $validacion = " textregexeq(" . $parametros['vlfe_campo'] . "::varchar,'" . $regla . "') = false ";
                break;
            case 'imp1sinref' :
                $mensaje = ' No puede llevar valor de impuesto Saldo a Favor con valores refacturados  ';
                $validacion = " refacturado_39 > 0  and " . $parametros['vlfe_campo'] . " > 0 ";
                break;
            case 'encabezadolectura' :
                $mensaje = ' Suscripció no tiene encabezado de lectura  ';
                $validacion = " ( Select count(*) from lec_lectura lec
                                       where lec.dsus_ideregistr = " . $tabla . ".numfac_2 and lec.lec_estado ='A')=0 ";
                $parametros['vlfe_campo'] = 0;
                break;
            case 'noprocesados' :
                $mensaje = ' Factura quedo en estado pendiente por Procesar ';
                $validacion = " estado ='P' ";
                $parametros['vlfe_campo'] = 0;
                break;
            case 'imp1sinfacsal' :
                $mensaje = ' No puede llevar valor de Saldo a Favor con facturas con saldo diferentes al servicio ';
                $validacion = " (select sum(fac_sdoreal) from fac_factura fac  where dsus_ideregistr = numfac_2 and
                                fac_idepadre is null and fac_estado='A' 
                                and fac.per_ideregistro<= (select per_ideregistro from per_periodo where cic_ideregistro = fac.cic_ideregistro 
                                and per_estado ='A' )
                                and fac_sdoreal>0  )>0  and " . $parametros['vlfe_campo'] . " > 0 ";
                break;
        }
        try {
            $sql = " SELECT empresa,ciclo ,numfac_2 idsuscripcion, pcodigo_1 codigoanterior, now() as fecha ,  idfactura  ,  '" . $parametros['vlfe_descripcion'] . "' as campo ,  " . $parametros['vlfe_campo'] . " as valor, '$mensaje' as error    FROM   " . $tabla . ""
                    . "  WHERE  $validacion  $complemento ";
            $resultado = $this->executeQuery($sql);
            if (!empty($resultado)) {
                return $resultado;
            }
        } catch (\Exception $ex) {
            throw new MyException("Error en metodo de validación " . $ex->getMessage(), -1);
        }
    }

    public function insertaLogFes($data, $tabla = null) {
        $this->insertar($data, 'log_genera_fes');
    }

    public function consultaLogFes($parametros) {

        $sql = "Select logf.*,dsus.dsus_pcodigo codigoanterior,fecha  from  log_genera_fes logf
                    inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr = logf.idsuscripcion
                where  ciclo =  " . $parametros['ciclo'] . " and  empresa = " . $parametros['empresa'];
        $resultado = $this->executeQuery($sql);
        if (!empty($resultado))
            return $resultado;
    }

    public function consultarCicloenProceso($empresa) {
        $sql = " select cic_ideregistro ciclo  from phil_parhilo where emp_ideregistro =" . $empresa;
        $resultado = $this->executeQuery($sql);
        if (!empty($resultado)) {
            return $resultado[0]['ciclo'];
        }
        throw new MyException("No estan definidos los parametros de Operación de Fes para la Empresa" . $empresa);
    }

    public function actualizarCicloProceso($empresa, $ciclo) {
        $sql = " UPDATE phil_parhilo set cic_ideregistro =$ciclo where emp_ideregistro =" . $empresa;
        $this->executeQuery($sql);
    }

    public function EliminarInformacionLog($parametros) {
        $sql = " DELETE FROM  log_genera_fes WHERE empresa =" . $parametros['empresa'] . "  and ciclo =" . $parametros['ciclo'];
        $this->executeQuery($sql);
    }

    public function obtenerCicloAnoPeriodo($parametro) {
        $sql = "select cic.cic_nombre nombreciclo,  to_char(per_fecfinal,'YYYY') ano ,to_char(per_fecfinal,'MM') mes from per_periodo per
                    inner join cic_ciclo cic on cic.cic_ideregistro = per.cic_ideregistro
                where cic.cic_ideregistro = " . $parametro['idciclo'] . " and per.per_estado = 'A'";
        $resultado = $this->executeQuery($sql);
        return $resultado[0];
    }

    public function obtenerRutasCiclo($parametro) {
        print_r(" Parametros Rutas consolidadas ");
        print_r($parametro);
        $sql = "select distinct idruta  from  proceso_genera_fes_" . $parametro['idtabla'] . " order by idruta ";
        $resultado = $this->executeQuery($sql);
        print_r($resultado);
        return $resultado;
    }

    public function consultarEstadoHiloWS($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $query = "select * from phil_parhilo where emp_ideregsitro = :idempresa and phil_estado ='A' ";
        return $this->executeQuery($query, $parametros)[0];
    }
    
    public function eliminaResumen($data) {
        $sql = "DELETE FROM 	carc_ctrarchivo  WHERE carc_ideregistr in (
			SELECT DISTINCT carc_ideregistr FROM carc_ctrarchivo carc , (SELECT * FROM per_periodo perfec where perfec.cic_ideregistro = ".$data['ciclo'].") as perfech
			WHERE carc.carc_parametros ilike '%Ciclo :".$data['ciclo']."%'
			and carc.emp_ideregistro = ".$data['empresa']." 
			AND carc.usu_ideregistro = ".$data['idusuario']."
			AND carc.prg_ideregistro = 83
			AND carc.carc_fecha <= perfech.per_fecfinal
		)";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    /*
     * 
     * lectura_desviacion , enviar 0 si no hay dato, confirmar si es cargado por ETL en lec_lectura deviacio (municpios se envio 0.67) , 
     * Se debe confirmar este parametro si definitivamente se envia 0.67
     * 
     * Reglas validacion Archivo plano FES 
     * - VENCIMIENTO no puede ir vacio Formato DD/MM/YYYY o INMEDIATO
     * 
     */
}
