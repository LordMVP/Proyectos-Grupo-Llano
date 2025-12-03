<?php

namespace Bioagricola\BioagricolaBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\Models\GenericoModel;


/**
 * Consultas para cargar financioaciones especiales.
 *
 * @author rsagudelo
 */
class GenerarInformeAprModel extends AuditoriaServices {

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     * @param \Doctrine\DBAL\Connection $sesion
     */
    public function __construct(&$conexion) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
    }
    
     /**
     * Verifica que la tabla temporal para cargar los cambios DxD a aplicar
     * @param $nom_tabla - nombre de la tabla a validar
     * @return type
     */
    public function validarExisteTabla() {        
        $sql = "SELECT count(*) cantidadtablas
                FROM  information_schema.TABLES
                WHERE TABLE_NAME ='temp_gen_pro_apr_fin_esp' ";
        $resultado = $this->executeQuery($sql);
        return $resultado[0]['cantidadtablas'];
    }
    
    /**
     * Actualiza los  registros de la tabla temporal a estado 'C'
     * @param $idEmpresa - id de la empresa en sesion 
     * @return void
     */
    public function vaciarTablaMasiva($idEmpresa) {
        $sql = "Delete FROM aseo.temp_gen_pro_apr_fin_esp WHERE idempresa = $idEmpresa ";
        $this->executeQuery($sql);
    }
    
    /**
     * Crea la tabla temporal para cargar los cambios DxD a aplicar
     * @return int
     */
    public function crearTabMasiva() {
        $this->crearSecuencia("sq_temp_gen_pro_apr_fin_esp");
        $sql = "CREATE TABLE IF NOT EXISTS aseo.temp_gen_pro_apr_fin_esp
                (
                idregistro bigint NOT NULL DEFAULT nextval('aseo.sq_temp_gen_pro_apr_fin_esp'), 
                cant_reg bigint ,
                fin_mes integer ,
                fin_aho integer ,
                fin_mesaho character varying(6) ,
                rep_mesaho character varying(6) ,
                id_tercero bigint,          
                vlrsdo_fijo numeric(20,7) ,
                vlrsdo_var numeric(20,7) ,
                vlrsdo_ajus numeric(20,7) ,
                idproceso integer,
                estado character(1),
                idempresa integer,
                mensaje text,
                fecha timestamp DEFAULT now(),                  
                CONSTRAINT temp_gen_pro_apr_fin_esp_pkey PRIMARY KEY (idregistro)
               );";
        $resultado = $this->executeQuery($sql);         
        $sqlIndxEstado = "CREATE INDEX ix_gen_pro_apr_estado  ON aseo.temp_gen_pro_apr_fin_esp USING btree (estado)";
        $this->executeQuery($sqlIndxEstado);
        $sqlIndxEmpresa = "CREATE INDEX ix_gen_pro_apr_idempresa  ON aseo.temp_gen_pro_apr_fin_esp USING btree (idempresa)";
        $this->executeQuery($sqlIndxEmpresa);
        $sqlIndxIdProceso = "CREATE INDEX ix_gen_pro_apr_proceso  ON aseo.temp_gen_pro_apr_fin_esp USING btree (idproceso)";
        $this->executeQuery($sqlIndxIdProceso);
        return $resultado;
    }
    
    /**
     * Crea la secuencia para la tabla temporal de financiacion 
     */
    private function crearSecuencia($secuencia) {
        try {
            $this->conexion->beginTransaction();
            $sql = "CREATE SEQUENCE IF NOT EXISTS aseo.$secuencia";
            $this->executeQuery($sql);
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $ex->getMessage();
            $this->conexion->rollBack();
        }
    }
    
     /**
     * Elimina los cambios de Valor DxD que tienen determinado estado
     * @param int $idEmpresa- Id de la empresa actual
     * @param char $estado - Estado de la financiacion que se quiere eliminar
     */
    public function eliminarRegistrosTotales($idEmpresa, $estado) {
        $sql = "delete from aseo.temp_gen_pro_apr_fin_esp where estado='$estado' AND idempresa=$idEmpresa";
        $this->executeQuery($sql);
    }
    
    /**
     * Actualiza la información de la financiacion en la tabla temporal
     * @param int $param - para,etros para la actualizacion (idregistro, estado, mensaje )
     * @return int
     */
    public function actualizarTemporalResumen($param) {
        $parametros['estado'] =  $param['estado'] ;
        $parametros['idregistro'] = $param['id_registro'] ;
        $parametros['mensaje'] =  $param['mensaje'] ;
        $sql = "UPDATE aseo.temp_gen_pro_apr_fin_esp SET 
            estado = :estado,
            mensaje =:mensaje
            WHERE idregistro=:idregistro ;";
        return $this->executeQuery($sql, $parametros);
    }
  
    /**
     * Consulta los errores del proceso
     * @param int $idEmpresa - Id de la empresa actual
     * @return array
     */
    public function consultarResumenErrores($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT 
                    trr.ter_nomcompleto tercero ,  
                    tmp.fin_mesaho mesaaho ,
                    mensaje , 
                    COUNT(*) as cantidad
                FROM    aseo.temp_gen_pro_apr_fin_esp tmp
                    INNER JOIN public.ter_tercero trr ON trr.ter_ideregistro = tmp.id_tercero
                WHERE   tmp.estado ='F' 
                    AND tmp.idempresa=:idempresa 
                GROUP BY trr.ter_nomcompleto ,  tmp.fin_mesaho , mensaje ";
        return $this->executeQuery($sql, $parametros);
    }
    
    /**
     * Cosulta el resultado del proceso agrupado por empresa homologada
     * @param int $idEmpresa - Id de la empresa actual
     * @param char $estado - Estado del que se quiere consultar (Correctos A, Con inconveniente F)
     * @return array - Listado de empresas homologadas con cantidad de registros afectados
     */
    public function consultarResumen($idEmpresa, $estados) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT 
                    (CASE 
                        WHEN estado = 'A' THEN 'Ok'
                        WHEN estado = 'P' THEN 'Pendiente'                        
                        Else estado
                    END) estado , 
                    trr.ter_nomcompleto as tercero , 
                    tmp.fin_mesaho mesaaho ,
                    COUNT(*) as cantidad ,
                    SUM (tmp.vlrsdo_fijo) vlr_fijo,
                    SUM (tmp.vlrsdo_var)  vlr_variable,
                    SUM (tmp.vlrsdo_ajus) vlr_ajuste,								
                    COUNT (*) cantidadregistrosprocesados
                FROM aseo.temp_gen_pro_apr_fin_esp tmp
                    INNER JOIN public.ter_tercero trr ON trr.ter_ideregistro = tmp.id_tercero
                WHERE tmp.estado in $estados 
                    AND tmp.idempresa=:idempresa
                GROUP BY  estado,  tercero , mesaaho
                ORDER BY  estado,  tercero , mesaaho ";
        return $this->executeQuery($sql, $parametros);
    }
  

    /****** nuevas funciones proceso de Aprovechamiento *******////
    
     /**
     * Obtiene el mes mas resiente financiado para la empresa enviada
     * @param int $idEmpresa - Empresa actual
     * @return text - MesAho aplicar 
     */
    public function get_tercero_Procesado ($parametros) {
        $sql = "SELECT COUNT(*) as can_pro
                FROM aseo.esp_inap_informeapr
                WHERE emp_ideregistro =:idempresa 
                AND ter_ideregistro =:id_tercero 
                AND inap_mesahoreport =:rep_mesaho
                AND inap_mes  =:fin_mes
                AND inap_aho =:fin_aho  ";
        $procesados =  $this->executeQuery($sql, $parametros); 
         return $procesados[0]['can_pro'] ;
                  
//        $sql = " SELECT 
//                     COUNT(*) can_tot
//                 FROM aseo.esp_afin_aprfinanciacion aff
//                    INNER JOIN aseo.esp_fin_financiacion fnn 
//                        ON fnn.fin_ideregistro = aff.fin_ideregistro
//                        AND fnn.fin_estado = 't' and fnn.emp_ideregistro =:id_empresa 
//                    WHERE aff.afin_swttras = '0'
//                    AND aff.ter_ideregistro =:id_tercero  ";
//        $totales =  $this->executeQuery($sql, $parametros); 
//        if($procesados[0]['can_pro'] == $totales[0]['can_tot'] )
//        if($procesados[0]['can_pro'] > 0)
//        {
//            return -1 ;
//        }
//        else{
//            return 0 ; 
//        }        
    }
    
     /**
     * Obtiene el mes mas resiente financiado para la empresa enviada
     * @param int $idEmpresa - Empresa actual
     * @return text - MesAho aplicar 
     */
    public function getUltimoMesFinanciacion ($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT  
                        substr(fin_mesaho,1,2)::INTEGER mes_fin, 
                        substr(fin_mesaho,3,4)::INTEGER aho_fin, 
                        fin_mesaho
                FROM        aseo.esp_fin_financiacion 
                WHERE       emp_ideregistro =:idempresa 
                    AND     fin_estado = 't'
                ORDER BY    aho_fin DESC , mes_fin DESC 
                LIMIT 1 ";
        $resul = $this->executeQuery($sql, $parametros);   
        if (count($resul) == 0) {
            $resultado['aho_fin'] = -1 ; 
        }
        else
        {
            $resultado = $resul[0] ;
        }
        return $resultado ;
    }
    
     /**
     * Obtiene el mes mas resiente del informe de Aprovechamiento de la empresa enviada
     * @param int $idEmpresa - Empresa actual
     * @return text - MesAho aplicar 
     */
    public function getUltimoMesInfAprovechamiento ($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT 					 
                        substring (inap_mesahoreport , 3,  4)::INTEGER aho , 
                        substring (inap_mesahoreport , 1, 2)::INTEGER mes                           
                FROM    aseo.esp_inap_informeapr 
                WHERE   emp_ideregistro =:idempresa  
                ORDER BY aho DESC , mes DESC  
                LIMIT 1 ";
        $resul = $this->executeQuery($sql, $parametros);
        if (count($resul) == 0) {
            $resultado['aho_info'] = -1 ; 
        }
        else
        {
            $resultado['aho_ant'] = $resul[0]['aho']  ;
            $resultado['mes_ant'] = $resul[0]['mes']; 
            if ($resul[0]['mes'] == 12 )
            {                               
                $resultado['aho_info'] = $resul[0]['aho'] + 1 ;
                $resultado['mes_info'] =  1 ;                
            }
            else
            {
                $resultado['aho_info'] = $resul[0]['aho'] ;
                $resultado['mes_info'] = $resul[0]['mes'] + 1 ;
            }
        }
        return $resultado ;
    }
    
     /**
     * Consulta los terceros con datos para pocesar 
     * @param int $idEmpresa - Empresa actual
     * @return Array - Listado de terceros a procesar
     */
    public function getTercerosProcesar ($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT 
                    aff.ter_ideregistro tercero ,
                    substr(fnn.fin_mesaho , 1, 2)::INTEGER as mes , 
                    substr(fnn.fin_mesaho , 3, 4)::INTEGER as aho , 
                    fnn.fin_mesaho as mesaho , 
                    count( aff.afin_ideregistro ) cantidad  ,				
                    SUM( COALESCE (aff.afin_sdovlrfijo, 0)) as sdo_fijo,
                    SUM( COALESCE (aff.afin_sdovlrvariable, 0)) as sdo_varible,
                    SUM( COALESCE (aff.afin_sdovlrajustes, 0)) as sdo_ajuste
                FROM aseo.esp_afin_aprfinanciacion aff
                INNER JOIN aseo.esp_fin_financiacion fnn 
                    ON fnn.fin_ideregistro = aff.fin_ideregistro
                    AND fnn.fin_estado = 't' and fnn.emp_ideregistro =:idempresa  
                WHERE aff.afin_swttras = '0'		
                GROUP BY  mes , aho ,  aff.ter_ideregistro , mesaho
                ORDER BY aff.ter_ideregistro , aho, mes ";
        return $this->executeQuery($sql, $parametros);
    }
    
//    /**
//     * Inserta los registros a procesar por aprovechador
//     * en la tabla temporal
//     * @param array  $parametros - Información para consultar e insertar la tabla temporal
//     */
//    public function insertarMasiva($parametros) {        
//        $sql = "INSERT INTO aseo.temp_gen_pro_apr_fin_esp
//                    (   idfinanciacion , id_aprfin, num_version, fin_mesaho ,
//                        rep_mesaho , id_tercero , vlrsdo_fijo , vlrsdo_var ,
//                        vlrsdo_ajus , idproceso , estado , idempresa
//                    )
//                    ( 
//                        SELECT 
//                            fnn.fin_ideregistro , aff.afin_ideregistro ,
//                            fnn.fin_version, fin_mesaho , :mesaho , aff.ter_ideregistro ,
//                            aff.afin_sdovlrfijo , aff.afin_sdovlrvariable , 
//                            aff.afin_sdovlrajustes , :id_hilo , 'P' , :id_empresa
//                        FROM aseo.esp_afin_aprfinanciacion aff
//                            INNER JOIN aseo.esp_fin_financiacion fnn 
//                                ON fnn.fin_ideregistro = aff.fin_ideregistro
//                                AND fnn.fin_estado = 't' and fnn.emp_ideregistro =:id_empresa 
//                            WHERE aff.afin_swttras = '0'
//                            AND aff.ter_ideregistro =:id_tercero
//                    ) ";          
//        $this->executeQuery($sql, $parametros); 
//    }
    
    /**
     * Inserta los cambios de valor a Aplicar forma masiva en la base de datos
     * @param string $complemento - Información de las líneas de cambios de Valor DxD que se guardarán separada por coma
     */
    public function insertarMasiva($complemento) {
        $sql = "INSERT INTO aseo.temp_gen_pro_apr_fin_esp ( cant_reg , fin_mes , fin_aho , fin_mesaho, rep_mesaho , id_tercero , vlrsdo_fijo , vlrsdo_var , vlrsdo_ajus , idproceso, estado, idempresa) values $complemento ";          
        $this->executeQuery($sql); 
    }
    
    /**
     * Inserta los registros a procesar por aprovechador
     * en la tabla temporal
     * @param array  $parametros - Información para consultar e insertar la tabla temporal
     */
    public function insertarMasivaError($parametros) {        
        $sql = "INSERT INTO aseo.temp_gen_pro_apr_fin_esp
                    (  cant_reg , fin_mes , fin_aho ,
                        rep_mesaho , id_tercero , vlrsdo_fijo , vlrsdo_var ,
                        vlrsdo_ajus , idproceso , estado , idempresa, mensaje
                    )
                    ( 0 , :fin_mes , :fin_aho , :mesaho , :id_tercero ,
                     0 , 0 , 0 , 0 , 'F' , :id_empresa , :mensaje)";          
        $this->executeQuery($sql, $parametros); 
    }
    
     /**
     * Obtiene los registros que se procesarán según el hilo y estado
     * @param int $idEmpresa - Empresa actual
     * @param int $idHilo - Id del hilo del que se consulta
     * @return Array - Listado de la financiaciones
     */
    public function getRegistros_X_proceso($idEmpresa, $idHilo) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idhilo'] = $idHilo;
        $sql = "SELECT 
                    tbl.idregistro ,  
                    tbl.cant_reg ,  
                    tbl.fin_mes , 
                    tbl.fin_aho , 
                    tbl.id_tercero , 
                    tbl.fin_mesaho,                      
                    tbl.rep_mesaho,                      
                    tbl.vlrsdo_fijo, 
                    tbl.vlrsdo_var ,
                    tbl.vlrsdo_ajus,                    
                    tbl.idproceso,
                    estado,
                    tbl.idempresa 
                FROM aseo.temp_gen_pro_apr_fin_esp tbl
                WHERE
                    idempresa = :idempresa
                    AND idproceso = :idhilo
                    AND estado = 'P'
                LIMIT 1000";
        return $this->executeQuery($sql, $parametros);
    }
    
    /**
     * Consulta la información del registro de aprovechamiento en la tabla del informe.
     * @param array con los datos (id_apr, empresa y mes de reporte)
     * @return array con datos de la financiacion 
     */
    public function getRegAprInforme($parametros )  {
        $sql = "SELECT COUNT(*) as cantidad
                FROM aseo.esp_inap_informeapr
                where emp_ideregistro =:idempresa
                AND ter_ideregistro =:id_tercero
                AND fin_ideregistro =:idfinanciacion
                and inap_mesahoreport =:rep_mesaho " ;
        $res = $this->executeQuery($sql, $parametros);
        return $res[0]['cantidad'] ;
    }
    
     /**
     * Inserta la información del cambio de valor en la base de datos
     * @param array $camValor - Información del cambio de valor adionada con el idcambioV
     */
    public function insertarInformeApr (array &$informeApr) {
        $parametros = array();   
        $this->setCampo($informeApr, $parametros, 'inap_ide', 'inap_ideregistro');
        $this->setCampo($informeApr, $parametros, 'id_tercero', 'ter_ideregistro');
        $this->setCampo($informeApr, $parametros, 'id_finan', 'fin_ideregistro');
        $this->setCampo($informeApr, $parametros, 'mesaho_rep', 'inap_mesahoreport');
        $this->setCampo($informeApr, $parametros, 'mes', 'inap_mes');
        $this->setCampo($informeApr, $parametros, 'aho', 'inap_aho');
        $this->setCampo($informeApr, $parametros, 'fac_fijo', 'inap_facfijo');
        $this->setCampo($informeApr, $parametros, 'fac_var', 'inap_facvariable');
        $this->setCampo($informeApr, $parametros, 'fac_ajus', 'inap_facajuste');
        $this->setCampo($informeApr, $parametros, 'cambio', 'inap_cambio');
        $this->setCampo($informeApr, $parametros, 'pag_fijo', 'inap_pagfijo');
        $this->setCampo($informeApr, $parametros, 'pag_var', 'inap_pagvariable');
        $this->setCampo($informeApr, $parametros, 'pag_ajus', 'inap_pagajuste');
        $this->setCampo($informeApr, $parametros, 'cambio_pag', 'inap_campagado');
        $this->setCampo($informeApr, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($informeApr, $parametros, 'idusuario', 'usu_ideregistro');
        $inap_ide = $this->insertar($parametros, 'aseo.esp_inap_informeapr', 'aseo.sq_esp_inap_ideregistro');                
        $informeApr['inap_ide'] = $inap_ide;
    } 
    
    /**
     * Consulta los pagos sin reportar para el registro de aprovechamiento
     * @param $id_afin identificador del registros de provechamiento
     * @return array con los pagos sin reportar 
     **/
    public function getPagosTerceros($parametros )  {

        $sql = "SELECT
                    SUM(COALESCE (pafn_pagvlrfijo ,  0 )) as pago_fijo ,
                    SUM(COALESCE (pafn_pagvlrvariable ,  0 )) as pago_variable ,
                    SUM(COALESCE (pafn_pagvlrajuste ,  0 )) as pago_ajuste 
                FROM            aseo.esp_pafn_pagaprfinanciacion paf
                    INNER JOIN  aseo.esp_afin_aprfinanciacion aff
                    ON          aff.afin_ideregistro = paf.afin_ideregistro
                INNER JOIN      aseo.esp_fin_financiacion fnn 
                    ON          fnn.fin_ideregistro = aff.fin_ideregistro
                    AND         fnn.fin_mesaho =:fin_mesaho  AND emp_ideregistro =:idempresa 
                INNER JOIN      aseo.esp_dfin_detfinanciacion dff 
                    ON 		dff.fin_ideregistro = fnn.fin_ideregistro
                    AND		dff.dfin_estado = 't'
                WHERE           aff.ter_ideregistro =:id_tercero 	
                    AND         pafn_swtrep = '0'  " ; 
        $resul = $this->executeQuery($sql, $parametros);
        if(empty($resul))
        {
            return null ;        
        }
        else 
        {
           return $resul[0] ;
        }     
    }
    /**
     * Consulta el registro de aprovechamiento por id
     * @param $id_afin identificador del registros de provechamiento
     * @return array con los pagos sin reportar 
     **/
    public function getRegistroAprFinan ($parametros )  {
        
        $sql = "SELECT
                        afin_swtrepcambio::INTEGER  , 
                        afin_swttras::INTEGER ,
                        count(afin_ideregistro) as cantidad ,
                        SUM(COALESCE (afin_camvlr , 0) ) cam_val,
                        SUM(COALESCE (afin_camvlrpago , 0 )) cam_val_pag, 
                        SUM(COALESCE (afin_sdovlrfijo , 0 )) sdo_fijo ,
                        SUM(COALESCE (afin_sdovlrvariable, 0 )) sdo_var ,
                        SUM(COALESCE (afin_sdovlrajustes, 0 )) sdo_ajus 
                FROM    aseo.esp_afin_aprfinanciacion aff
                INNER JOIN aseo.esp_fin_financiacion fnn
                        ON fnn.fin_ideregistro = aff.fin_ideregistro 
                        AND fnn.fin_mesaho =:fin_mesaho 
                        AND fnn.emp_ideregistro =:idempresa
                INNER JOIN      aseo.esp_dfin_detfinanciacion dff 
                    ON 		dff.fin_ideregistro = fnn.fin_ideregistro
                    AND		dff.dfin_estado = 't'
                WHERE   aff.ter_ideregistro =:id_tercero
                    AND (afin_swttras = '0' OR afin_swtrepcambio = '1')										
                GROUP BY  afin_swtrepcambio , afin_swttras ; 
                ; " ;  
        $resul = $this->executeQuery($sql, $parametros);
        if(empty($resul))
        {
            return null ;        
        }
        else 
        {
           return $resul;
        }     
    }
     /**
     * Actualiza informacion en el detalle de terceros de la financiacion.
     * @param array $destalle_Apro detalle con los datos a actualziar
     * @return int Número de detalles afectados.
     */
    public function actualizarDetTercFinanciacion($destalle_pago) {
        return $this->actualizar($destalle_pago, 'aseo.esp_afin_aprfinanciacion', 'afin_ideregistro = :afin_ideregistro');
    }
    
     /**
     * Actualiza informacion de los registros de pagos de aprovechamiento.
     * @param array $destalle_pago detalle con los datos a actualziar
     * @return int Número de detalles afectados.
     */
    public function actualizarPagosAprFinan($parametros) {
         $sql = "UPDATE 
                    aseo.esp_pafn_pagaprfinanciacion
                SET 
                    pafn_swtrep = '1' ,
                    pafn_fecrep = now()
                where pafn_swtrep = '0'
                AND afin_ideregistro in 
                (     
                    SELECT afin_ideregistro                                
                    FROM    aseo.esp_afin_aprfinanciacion aff
                    INNER JOIN aseo.esp_fin_financiacion fnn
                        ON fnn.fin_ideregistro = aff.fin_ideregistro
                        AND  fnn.fin_mesaho =:fin_mesaho
                        AND emp_ideregistro =:idempresa
                    INNER JOIN  aseo.esp_dfin_detfinanciacion dff 
                        ON      dff.fin_ideregistro = fnn.fin_ideregistro
                        AND	dff.dfin_estado = 't'
                    WHERE aff.ter_ideregistro =:id_tercero
                ) " ;
        $cantidad = $this->executeQuery($sql, $parametros); 
        if ($cantidad < 1)
        {
            return -1 ;
        }
        else 
            return 1 ; 
    }
    
    /**
     * Consulta la información de la financiacion para validar que no
     * haya cambiado la version
     * @param array con los datos (id_financiacion , num_version )
     * @return int cantidad de registro de financiacion 
     */
    public function getFinanVersion($parametros )  {                 
        $sql = "SELECT 
                        COUNT(*) as cantidad
                FROM    aseo.esp_fin_financiacion fnn 
                WHERE   fnn.emp_ideregistro =:idempresa
                    AND fin_ideregistro =:idfinanciacion  
                    AND fin_version =:num_version
                    AND fin_estado = 't' " ;
        $res = $this->executeQuery($sql, $parametros);
        return $res[0]['cantidad'] ;
    }
    /**
     * Consulta la informacion del informe de aprovechamiento consolidado
     * @param array con los datos (mesaho_proceso , empresa )
     * @return array con la informacion consolidada 
     */
    public function getInforAprConsolidadon($parametros )  {                 
        $sql = "SELECT ter_nomcompleto , 
                    inap_mes mes ,  inap_aho aho,
                    SUM(COALESCE(inap_facfijo, 0) )  fac_fijo ,
                    SUM(COALESCE(inap_facvariable, 0) )  fac_variable,
                    SUM(COALESCE(inap_facajuste, 0) )  fac_ajuste,
                    SUM(COALESCE(inap_cambio, 0) )  cambio ,
                    SUM(COALESCE(inap_pagfijo, 0) )  pag_fijo ,
                    SUM(COALESCE(inap_pagvariable, 0) )  pag_variable,
                    SUM(COALESCE(inap_pagajuste, 0) )  pag_ajuste,
                    SUM(COALESCE(inap_campagado, 0) )  campagado
                FROM            aseo.esp_inap_informeapr iff
                    INNER JOIN  public.ter_tercero trr
                        ON      trr.ter_ideregistro = iff.ter_ideregistro 
                WHERE           emp_ideregistro =:id_empresa 
                    AND         inap_mesahoreport =:mesaho_rep
                GROUP BY        ter_nomcompleto , mes , aho 
                ORDER BY        ter_nomcompleto , aho , mes " ;
        return $this->executeQuery($sql, $parametros);     
    }
     /**
     * Actualiza el Swt del cambio de valor y la fecha 
     * @param array $destalle_Apro detalle con los datos a actualziar
     * @return int Número de detalles afectados.
     */
    public function actDetTercFinan ($parametros) {
        $campo_swt = $parametros['swt_campo'] ;
        $campo_fecha = $parametros['fec_campo'] ;    
        $complemento = $parametros['complemento'] ;    
        $sql = "UPDATE 
                    aseo.esp_afin_aprfinanciacion
                SET 
                    $campo_swt =:swt_valor ,
                    $campo_fecha = now()
                where 
                    ter_ideregistro =:ter_id
                    AND $campo_swt =:swt_valor_Ant
                    $complemento
                    AND fin_ideregistro IN 
                    (
                        SELECT
                                fnn.fin_ideregistro 
                        FROM    aseo.esp_fin_financiacion fnn
                        INNER JOIN  aseo.esp_dfin_detfinanciacion dff 
                            ON      dff.fin_ideregistro = fnn.fin_ideregistro
                            AND     dff.dfin_estado = 't'
                        WHERE   fnn.fin_mesaho =:fin_mesaho
                            AND emp_ideregistro =:idempresa
                    )" ;
        $cantidad = $this->executeQuery($sql, $parametros); 
        if ($cantidad < 1)
        {
            return -1 ;
        }
        else 
            return 1 ;        
    }
}
