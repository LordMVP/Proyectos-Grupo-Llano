<?php

namespace Bioagricola\BioagricolaBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\Models\GenericoModel;


/**
 * Consultas para cargar financioaciones especiales.
 *
 * @author rsagudelo
 */
class GenerarAmortizacionModel extends AuditoriaServices {

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
                WHERE TABLE_NAME ='temp_esp_gen_amortizacion' ";
        $resultado = $this->executeQuery($sql);
        return $resultado[0]['cantidadtablas'];
    }
    
    /**
     * Actualiza los  registros de la tabla temporal a estado 'C'
     * @param $idEmpresa - id de la empresa en sesion 
     * @return void
     */
    public function vaciarTablaMasiva($idEmpresa) {
        $sql = "UPDATE aseo.temp_esp_gen_amortizacion SET estado='C' WHERE idempresa = $idEmpresa  and estado <> 'C'";
        $this->executeQuery($sql);
    }
    
    /**
     * Crea la tabla temporal para cargar los cambios DxD a aplicar
     * @return int
     */
    public function crearTabMasiva() {
        $this->crearSecuencia("sq_temp_esp_gen_amortizacion");
        $sql = "CREATE TABLE IF NOT EXISTS aseo.temp_esp_gen_amortizacion
                (
                idregistro bigint NOT NULL DEFAULT nextval('aseo.sq_temp_esp_gen_amortizacion'),  
                idfinanciacion bigint ,
                fin_cuoemitidas integer,
                fin_totcuotas integer,
                fin_tasa numeric(20,7)  ,  
                fin_sdobio numeric(20,7)  ,  
                fin_sdoterfijo numeric(20,7)  ,
                fin_sdotervar numeric(20,7)  ,
                fin_sdoteraju numeric(20,7) ,
                fin_sdofinan numeric(20,7) ,
                fin_sdoamort numeric(20,7) ,
                fin_version integer ,
                am_sdobio numeric(20,7)  ,  
                am_sdoterfijo numeric(20,7)  ,
                am_sdotervar numeric(20,7)  ,
                am_sdoteraju numeric(20,7) ,
                am_sdointeres numeric(20,7) ,
                am_sdofinan numeric(20,7) ,
                idproceso integer,
                estado character(1),
                idempresa integer,
                mensaje text,
                fecha timestamp DEFAULT now(),                  
                CONSTRAINT temp_esp_gen_amortizacion_pkey PRIMARY KEY (idregistro)
               );";
        $resultado = $this->executeQuery($sql);         
        $sqlIndxEstado = "CREATE INDEX ix_temp_esp_gen_amortizacion_estado  ON aseo.temp_esp_gen_amortizacion USING btree (estado)";
        $this->executeQuery($sqlIndxEstado);
        $sqlIndxEmpresa = "CREATE INDEX ix_temp_esp_gen_amortizacion_idempresa  ON aseo.temp_esp_gen_amortizacion USING btree (idempresa)";
        $this->executeQuery($sqlIndxEmpresa);
        $sqlIndxIdProceso = "CREATE INDEX ix_temp_esp_gen_amortizacion_proceso  ON aseo.temp_esp_gen_amortizacion USING btree (idproceso)";
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
     * Inserta las financiaciones a procesar en la  forma masiva en la base de datos
     * @param string $complemento - Información de las financiaciones a procesar que se guardarán separada por coma
     */
    public function insertarMasiva($complemento) {
        $sql = "INSERT INTO aseo.temp_esp_gen_amortizacion ( idfinanciacion , fin_cuoemitidas , fin_totcuotas, fin_tasa , fin_sdobio , fin_sdoterfijo , fin_sdotervar , fin_sdoteraju , fin_sdofinan , fin_sdoamort , fin_version , am_sdobio , am_sdoterfijo , am_sdotervar , am_sdoteraju , am_sdofinan , idproceso , estado , idempresa ) values $complemento ";          
        $this->executeQuery($sql); 
    }
    
      /**
     * Valida los posibles inconvenientes que tiene la información subida en la tabla temporal
     * @param number $idEmpresa - Empresa actual 
     * @return type
     */
    public function validarInformacionTemporal($idEmpresa) {
        $sql = "SELECT                    
                    ('Hay Financiaciones con inconsistencia en las cuotas ' || idfinanciacion) as mensaje 
                     ,  tbl.idfinanciacion          
                FROM
                        aseo.temp_esp_gen_amortizacion tbl
                WHERE  
                    fin_cuoemitidas > fin_totcuotas 
                    AND idEmpresa = $idEmpresa AND tbl.estado = 'P' LIMIT 1; ";
        return $this->executeQuery($sql);
    }    
     /**
     * Elimina los cambios de Valor DxD que tienen determinado estado
     * @param int $idEmpresa- Id de la empresa actual
     * @param char $estado - Estado de la financiacion que se quiere eliminar
     */
    public function eliminarRegistrosTotales($idEmpresa, $estado) {
        $sql = "delete from aseo.temp_esp_gen_amortizacion where estado='$estado' AND idempresa=$idEmpresa";
        $this->executeQuery($sql);
    }  
    
   /**
     * Cosulta el resultado del proceso agrupado por empresa homologada
     * @param int $idEmpresa - Id de la empresa actual
     * @param char $estado - Estado del que se quiere consultar (Correctos A, Con inconveniente F)
     * @return array - Listado de empresas homologadas con cantidad de registros afectados
     */
    public function consultarResumen($idEmpresa, $estados) 
    {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['estados'] = $estados;
        $sql = "SELECT  
                        (CASE 
                            WHEN estado = 'A' THEN 'Ok'
                            WHEN estado = 'P' THEN 'Pendiente'                        
                            Else estado
                        END) estado ,               
                        SUM (tmp.fin_sdofinan) sdo_fin,                
                        SUM (tmp.am_sdobio) sdo_am_bio,
                        SUM (tmp.am_sdoterfijo) sdo_am_ter_fijo,
                        SUM (tmp.am_sdotervar) sdo_am_ter_var,
                        SUM (tmp.am_sdoteraju) sdo_am_ter_aju,
                        SUM (tmp.am_sdointeres) sdo_am_interes ,
                        COUNT (tmp.idfinanciacion) cantidadregistrosprocesados
                    FROM aseo.temp_esp_gen_amortizacion tmp
                    WHERE tmp.estado in $estados AND tmp.idempresa=:idempresa
                    GROUP BY  estado
                    ORDER BY estado  ";
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
                        count(idfinanciacion) cantidad, 
                        mensaje
                FROM    aseo.temp_esp_gen_amortizacion tmp
                WHERE   tmp.estado ='F' 
                        AND tmp.idempresa=:idempresa                 
                GROUP BY mensaje 
                ORDER BY mensaje";
        return $this->executeQuery($sql, $parametros);
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
        $sql = "UPDATE aseo.temp_esp_gen_amortizacion SET 
            estado = :estado,
            mensaje =:mensaje
            WHERE idregistro=:idregistro ;";
        return $this->executeQuery($sql, $parametros);
    }

    /**************** Logica de generar Amortizacion **************/

    /**
     * Consulta la información de las financiaciones que tienen saldo
     * que son las que se deben validar y generar amortizacion
     * @param int $idempresa el identificador de la empresa
     * @return array con datos de las financiaciones con saldo 
     */
    public function getFinanAmortizar ($idempresa)  {
        $parametros['id_empresa'] = $idempresa ;
        $sql = " SELECT 
                        fnn.fin_ideregistro id_financiacion ,
                        fnn.fin_cuoemitidas cuotas_emitidas,
                        dfin_numcuotas total_cuotas ,
                        dfin_tasa tasa_interes, 
                        fnn.fin_version , 
                        (
                            COALESCE (fin_vlrbio, 0) 
                            - COALESCE (fin_cambio, 0) - COALESCE (fin_pagbio, 0)
                        ) as sdo_bio , 
                        (
                            ( COALESCE (fin_vlraprfijo, 0)  + COALESCE (fin_vlrviatfijo, 0)) 
                            -   COALESCE (fin_pagterfijo, 0) 
                        ) as sdo_terc_fijo , 
                        (
                            ( COALESCE (fin_vlraprvar, 0) + COALESCE (fin_vlrviatvar, 0) ) 
                            -( COALESCE (fin_camtervar, 0) + COALESCE (fin_pagtervar, 0) )
                        ) as  sdo_terc_vari ,
                        (
                            COALESCE (fin_vlrajuaprvar, 0) - COALESCE (fin_pagajutervar, 0)
                        )  as sdo_terc_ajus , 
                        (
                            COALESCE (fin_vlrtotal,0) - 
                            (COALESCE(fin_cambio,0) + COALESCE(fin_camtervar,0)
                            + COALESCE(fin_pagbio,0)  + COALESCE(fin_pagterfijo,0)	
                            + COALESCE(fin_pagtervar,0)  + COALESCE(fin_pagajutervar,0))
                        ) as fin_sdo,
                        COALESCE((
                            SELECT sum(COALESCE(amm.am_sdocuota, 0))
                            FROM aseo.esp_am_amortizacion amm
                            WHERE  amm.fin_ideregistro = fnn.fin_ideregistro 
                        ), 0)	as saldo_cuotas
            FROM        aseo.esp_fin_financiacion fnn 
            INNER JOIN  aseo.esp_dfin_detfinanciacion dff 
                on      dff.fin_ideregistro = fnn.fin_ideregistro
                AND     dff.dfin_estado = 't'
            LEFT JOIN aseo.esp_am_amortizacion amm 
                        ON amm.fin_ideregistro = fnn.fin_ideregistro
                        and amm.am_fechagb > date_trunc('month', now())::date
            WHERE       fnn.emp_ideregistro =:id_empresa  AND amm.am_ideregistro is NULL 
            AND         (
                            COALESCE (fin_vlrtotal,0) - 
                            (COALESCE(fin_cambio,0) + COALESCE(fin_camtervar,0)
                            + COALESCE(fin_pagbio,0)  + COALESCE(fin_pagterfijo,0)	
                            + COALESCE(fin_pagtervar,0)  + COALESCE(fin_pagajutervar,0))
                        ) > 0 ; " ;
//            AND     fnn.fin_ideregistro NOT IN 
//                    (   SELECT fnn1.fin_ideregistro 
//                        FROM aseo.esp_afin_aprfinanciacion fnn1 
//                        INNER JOIN aseo.esp_am_amortizacion amm1 
//                            ON amm1.fin_ideregistro = fnn1.fin_ideregistro
//                            and amm1.am_fechagb > date_trunc('month', now())::date 
//                        WHERE fnn.emp_ideregistro = :id_empresa ); " ;
        $res = $this->executeQuery($sql, $parametros);
        return $res ;
    }
     /**
     * Obtiene las financiaciones que se procesarán según el hilo y estado
     * @param int $idEmpresa - Empresa actual
     * @param int $idHilo - Id del hilo del que se consulta
     * @return Array - Listado de la financiaciones
     */
    public function getFinanciacionProceso($idEmpresa, $idHilo) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idhilo'] = $idHilo;
        $sql = "SELECT            
                    tbl.idregistro,  
                    tbl.idfinanciacion ,
                    tbl.fin_cuoemitidas ,
                    tbl.fin_totcuotas ,
                    tbl.fin_tasa ,  
                    tbl.fin_sdobio ,  
                    tbl.fin_sdoterfijo ,
                    tbl.fin_sdotervar ,
                    tbl.fin_sdoteraju ,
                    tbl.fin_sdofinan ,
                    tbl.fin_sdoamort ,
                    tbl.fin_version ,
                    tbl.am_sdobio ,  
                    tbl.am_sdoterfijo ,
                    tbl.am_sdotervar ,
                    tbl.am_sdoteraju ,
                    tbl.am_sdofinan ,   
                    tbl.idproceso,
                    tbl.estado,
                    tbl.idempresa 
                FROM aseo.temp_esp_gen_amortizacion tbl
                WHERE
                    idempresa = :idempresa
                    AND idproceso = :idhilo
                    AND estado = 'P'
                LIMIT 1000";
        return $this->executeQuery($sql, $parametros);
    }
    
     /**
     * Busca las amortizaciones con saldo, generando los sados por cada concepto.
     * @param int $param parametros para la consulta ( id_financiacion , empresa)  
     * @return array con la informacion de las amortizaciones 
     */
    public function getAmortizaciones ($param)  { 
        $parametros['id_finan'] = $param['idfin'] ;
        $parametros['id_empresa'] = $param['idempresa'] ;
   
        $sql = "SELECT      amm.am_ideregistro , dam.dam_ideregistro ,
                            (COALESCE (amm.am_vlrbio, 0 ) - COALESCE(amm.am_cambio,0)
                                - COALESCE (amm.am_pagbio , 0 )) as sdo_cuobio ,
                            (COALESCE (amm.am_vlrterfij, 0 ) - COALESCE (amm.am_pagterfij , 0 )) as sdo_cuoter_fij ,
                            (COALESCE (amm.am_vlrtervar, 0 ) - COALESCE(amm.am_camtervar,0)
                                - COALESCE (amm.am_pagtervar , 0 )) as sdo_cuoter_var ,
                            (COALESCE (amm.am_vlrteraju, 0 ) - COALESCE (amm.am_pagteraju , 0 )) as sdo_cuoter_aju ,
                            (COALESCE (amm.am_vlrinteres, 0 ) - COALESCE (amm.am_paginteres , 0 )) as sdo_cuotinteres ,
                            amm.am_sdocuota ,
                            amm.am_numcuota
                FROM        aseo.esp_am_amortizacion amm 
                INNER JOIN  aseo.esp_fin_financiacion fnn ON fnn.fin_ideregistro = amm.fin_ideregistro
                    AND     fnn.fin_estado = 't' 
                    AND     fnn.emp_ideregistro =:id_empresa
                INNER JOIN  aseo.esp_dam_detamortizacion dam ON dam.am_ideregistro = amm.am_ideregistro
                   AND      dam.dam_estado = 't'                    
                WHERE       amm.am_sdocuota > 0 AND fnn.Fin_ideregistro =:id_finan  
                ORDER BY amm.am_fechagb ; ";        
       $res = $this->executeQuery($sql, $parametros);
       return $res ;
    }
    
     /**
     * Inserta la información del detalle de la amortizacion en la base de datos 
     * @param array $pagAmortiz - Información del pago se adiciona el id del pago
     */
    public function insertarDetalleAmortiz (array &$det_amortiz_nue) 
    {  
        $parametros = array();               
        $this->setCampo($det_amortiz_nue, $parametros, 'id_detamortiz', 'dam_ideregistro');
        $this->setCampo($det_amortiz_nue, $parametros, 'idamortiz', 'am_ideregistro');
        $this->setCampo($det_amortiz_nue, $parametros, 'vlrtotal', 'dam_vlrtotal');
        $this->setCampo($det_amortiz_nue, $parametros, 'vlrbio', 'dam_vlrbio');
        $this->setCampo($det_amortiz_nue, $parametros, 'vlrterfij', 'dam_vlrterfij');
        $this->setCampo($det_amortiz_nue, $parametros, 'vlrtervar', 'dam_vlrtervar');
        $this->setCampo($det_amortiz_nue, $parametros, 'vlrteraju', 'dam_vlrteraju');
        $this->setCampo($det_amortiz_nue, $parametros, 'estado', 'dam_estado');
        $this->setCampo($det_amortiz_nue, $parametros, 'vlrinteres', 'dam_vlrinteres');
        $id_det_amortiz = $this->insertar($parametros, 'aseo.esp_dam_detamortizacion', 'aseo.sq_esp_dam_ideregistro');                
        $det_amortiz_nue['id_det_amortiz'] = $id_det_amortiz;
    }
     /**
    * Actualiza informacion del detalle de la amortizacion 
    * @param array $det_amortizacion con los datos a actualziar
    * @return int Número de registros afectados.
    */
    public function actualizarDetAmortizacionFinan ($det_amortizacion) {
        return $this->actualizar($det_amortizacion, 'aseo.esp_dam_detamortizacion', 'dam_ideregistro = :dam_ideregistro');        
    }
    
     /**
     * Consulta si la financiacion tiene amortizaciones para el mes actual.
     * @param int $id_financiacion , $idempresa el identificador de la empresa
     * @return array con datos de la amortizacion 
     */
    public function getAmortizFinanciacion ($id_financiacion , $idempresa)  {
        $parametros['id_empresa'] = $idempresa ;
        $parametros['idfinan'] = $id_financiacion  ;
        $sql = "SELECT  *
                FROM aseo.esp_fin_financiacion fnn     
                INNER JOIN  aseo.esp_am_amortizacion amm  
                    ON      amm.fin_ideregistro = fnn.fin_ideregistro
                INNER JOIN  aseo.esp_dam_detamortizacion dam 
                    ON      dam.am_ideregistro = amm.am_ideregistro
                    AND     dam.dam_estado = 't'                    
                WHERE       fnn.fin_ideregistro =:idfinan 
                    AND     fnn.fin_estado = 't' 
                    AND     fnn.emp_ideregistro =:id_empresa
                    AND     amm.am_fechagb > date_trunc('month', now())::date ; " ;
        $res = $this->executeQuery($sql, $parametros);
        if (count($res) == 0) {
            $resultado['am_ideregistro'] = -1 ; 
        }
        else 
        {
            
          $resultado= $res[0] ;          
        }
        return $resultado ;
    }
     /**
     * Inserta la información de la amortizacion en la base de datos 
     * @param array $amortizacion - Información de la amortizacion se adiciona el id de la amortizacion
     */
    public function insertarAmortizFinanc (array &$amortizacion) {
        $parametros = array();  
        $this->setCampo($amortizacion, $parametros, 'id_amortiz', 'am_ideregistro');
        $this->setCampo($amortizacion, $parametros, 'idfinanciacion', 'fin_ideregistro');
        $this->setCampo($amortizacion, $parametros, 'total_cuota', 'am_vlrtotal');
        $this->setCampo($amortizacion, $parametros, 'vlr_bio', 'am_vlrbio');
        $this->setCampo($amortizacion, $parametros, 'vlr_ter_fijo', 'am_vlrterfij');
        $this->setCampo($amortizacion, $parametros, 'vlr_ter_var', 'am_vlrtervar');
        $this->setCampo($amortizacion, $parametros, 'vlr_ter_ajuste', 'am_vlrteraju');
        $this->setCampo($amortizacion, $parametros, 'cambio', 'am_cambio');
        $this->setCampo($amortizacion, $parametros, 'cam_tercero', 'am_camtervar');
        $this->setCampo($amortizacion, $parametros, 'pag_bio', 'am_pagbio');
        $this->setCampo($amortizacion, $parametros, 'pag_terfijo', 'am_pagterfij');
        $this->setCampo($amortizacion, $parametros, 'pag_tervar', 'am_pagtervar');
        $this->setCampo($amortizacion, $parametros, 'pag_terajuste', 'am_pagteraju');
        $this->setCampo($amortizacion, $parametros, 'numcuota', 'am_numcuota');
        $this->setCampo($amortizacion, $parametros, 'total_cuota', 'am_sdocuota');
        $this->setCampo($amortizacion, $parametros, 'swt_deshabitado', 'am_swtcamdesh');
        $this->setCampo($amortizacion, $parametros, 'vlr_interes', 'am_vlrinteres');
        $this->setCampo($amortizacion, $parametros, 'pag_inetres', 'am_paginteres');
        $this->setCampo($amortizacion, $parametros, 'id_empresa', 'emp_ideregistro');
        $this->setCampo($amortizacion, $parametros, 'id_usuario', 'usu_ideregistro');
        $idAmort = $this->insertar($parametros, 'aseo.esp_am_amortizacion', 'aseo.sq_esp_am_ideregistro');                
        $amortizacion['id_amortiz'] = $idAmort ;
    } 
     /**
     * Inserta la información del detalle de la amortizacion 
     * @param array $det_amortiz - Información del detalle de la amortizacion se adiciona el id del detalle
     */
    public function insertarDetAmortizFinanc (array &$det_amortiz) {
        $parametros = array(); 
        $this->setCampo($det_amortiz, $parametros, 'id_detamortiz', 'dam_ideregistro');
        $this->setCampo($det_amortiz, $parametros, 'idamortiz', 'am_ideregistro');
        $this->setCampo($det_amortiz, $parametros, 'total_cuota', 'dam_vlrtotal');
        $this->setCampo($det_amortiz, $parametros, 'vlr_bio', 'dam_vlrbio');
        $this->setCampo($det_amortiz, $parametros, 'vlr_ter_fijo', 'dam_vlrterfij');
        $this->setCampo($det_amortiz, $parametros, 'vlr_ter_var', 'dam_vlrtervar');
        $this->setCampo($det_amortiz, $parametros, 'vlr_ter_ajuste', 'dam_vlrteraju');
        $this->setCampo($det_amortiz, $parametros, 'cambio', 'dam_estado');
        $this->setCampo($det_amortiz, $parametros, 'vlr_interes', 'dam_vlrinteres');
        $idDetAmort = $this->insertar($parametros, 'aseo.esp_dam_detamortizacion', 'aseo.sq_esp_dam_ideregistro');                
        $det_amortiz['id_detamortiz'] = $idDetAmort ;
    } 
    
    /**
     * Actualiza informacion de la financiacion 
     * @param array $financiacion con los datos a actualziar
     * @param int $idversion identificador de la version.
     * @return int Número de registros afectados.
     */
    public function actualizarFinanciacion ($financiacion, $idversion) {     
        $condicion = ' fin_ideregistro = :fin_ideregistro and fin_version = '.$idversion. '  ';
        return $this->actualizar($financiacion, 'aseo.esp_fin_financiacion', $condicion );        
    }
     /**
     * Actualiza informacion en la tabla temporal, los valores que dependen de la aplicacion.
     * @param array $pagFinan con los datos a actualziar , y $idtabla el id de la tabla temp
     * @return int Número de registros afectados.
     */
    public function actualizarTabTemporalPag ($amortizadoFinan , $idtabla )
    {                 
        $data['am_sdobio'] = $amortizadoFinan['sdo_cuobio'];
        $data['am_sdoterfijo'] = $amortizadoFinan['sdo_cuoter_fij'];
        $data['am_sdotervar'] = $amortizadoFinan['sdo_cuoter_var'];
        $data['am_sdoteraju'] = $amortizadoFinan['sdo_cuoter_aju'];
        $data['am_sdofinan'] = $amortizadoFinan['sdo_cuota'];        
        $data['am_sdointeres'] = $amortizadoFinan['sdo_cuotinteres'];
        $data['idregistro'] = $idtabla ;  
        $condicion = 'idregistro = :idregistro' ;
        return $this->actualizar($data, 'aseo.temp_esp_gen_amortizacion', $condicion );        
    }  
    /**
     * Consulta la informacion de las financiaicones activas y con saldo
     * para generar la cuota a cobrar
     * @param array con los datos ( empresa )
     * @return array con la informacion consolidada 
     */
    public function getCuotaFacturar($parametros )  {                 
        $sql = "SELECT 
                    max(fin_ideregistro) fin_ideregistro,
                    max(am_ideregistro) am_ideregistro,
                    mua_cod , 
                    max(lmf_fac) lmf_fac,
                    fec_cob , 
                    sum (fijo) fijo, 
                    sum (variater)  variater, 
                    sum (pago) pago , 
                    sum (ajusfijo)  ajusfijo, 
                    sum (ajusvariater) ajusvariater, 
                    max(fecha_pago) fecha_pago,
                    sum(viatfijo) viatfijo,
                    sum(interes) interes,
                    sum(bio) bio,
                    max(num_cuo) num_cuo,
                    max(dfin_numcuotas) dfin_numcuotas,
                    max(pago2) pago2,
                    sum(cuota) cuota,
                    sum(fin_sdo) fin_sdo
                FROM ( SELECT 
                            fnn.fin_ideregistro , 
                            amm.am_ideregistro , 
                            fnn.mua_cod, 
                            fnn.lmf_fac ,
                            to_char(now()::DATE, 'DD-MM-YYYY') fec_cob, 
                            round(
                                COALESCE(
                                    (SELECT sum (COALESCE(am_vlrterfij - am_pagterfij , 0 ) )
                                    FROM aseo.esp_dam_detamortizacion dmm
                                            INNER JOIN aseo.esp_am_amortizacion amm1
                                                    ON amm1.am_ideregistro = dmm.am_ideregistro
                                    WHERE amm1.fin_ideregistro = fnn.fin_ideregistro
                                    AND dmm.dam_estado = 't'), 0 ), 2 
                            ) as fijo ,
                        round(
                            COALESCE(
                                (SELECT sum (COALESCE(am_vlrtervar - am_camtervar - am_pagtervar  , 0 ) )
                                FROM aseo.esp_dam_detamortizacion dmm
                                        INNER JOIN aseo.esp_am_amortizacion amm1
                                                ON amm1.am_ideregistro = dmm.am_ideregistro
                                WHERE amm1.fin_ideregistro = fnn.fin_ideregistro
                                        AND dmm.dam_estado = 't'), 0),2
                            ) as variater,
                        0 pago, 0 ajusfijo ,
                        round(
                            COALESCE(
                                (SELECT sum (COALESCE(am_vlrteraju - am_pagteraju , 0 ) )
                                FROM aseo.esp_dam_detamortizacion dmm
                                    INNER JOIN aseo.esp_am_amortizacion amm1
                                        ON amm1.am_ideregistro = dmm.am_ideregistro
                                WHERE amm1.fin_ideregistro = fnn.fin_ideregistro
                                    AND dmm.dam_estado = 't'), 0),2
                            ) as ajusvariater ,
                        '' fecha_pago ,0 viatfijo , 
                        round(
                            COALESCE(
                                (SELECT sum (COALESCE(am_vlrinteres - am_paginteres, 0 ) )
                                FROM aseo.esp_dam_detamortizacion dmm
                                INNER JOIN aseo.esp_am_amortizacion amm1
                                ON amm1.am_ideregistro = dmm.am_ideregistro
                                WHERE amm1.fin_ideregistro = fnn.fin_ideregistro
                                AND dmm.dam_estado = 't'), 0 ),2
                            ) as  interes,
                        round(
                            COALESCE(
                                (SELECT sum (COALESCE(am_vlrbio - am_cambio - am_pagbio, 0 ) )
                                FROM aseo.esp_dam_detamortizacion dmm
                                INNER JOIN aseo.esp_am_amortizacion amm1
                                ON amm1.am_ideregistro = dmm.am_ideregistro
                                WHERE amm1.fin_ideregistro = fnn.fin_ideregistro
                                AND dmm.dam_estado = 't'), 0 ),2
                        ) as bio ,  
                        fnn.fin_cuoemitidas as num_cuo, 
                        dff.dfin_numcuotas ,
                        0 pago2  ,
                        round(
                            COALESCE(
                                (SELECT sum (COALESCE(am_sdocuota, 0 ) )
                                FROM aseo.esp_dam_detamortizacion dmm
                                INNER JOIN aseo.esp_am_amortizacion amm1
                                ON amm1.am_ideregistro = dmm.am_ideregistro
                                WHERE amm1.fin_ideregistro = fnn.fin_ideregistro
                                AND dmm.dam_estado = 't'
                                ), 0 ), 2
                        ) as  cuota , 
                        round(
                            (COALESCE(fin_vlrtotal,0) - 
                            (COALESCE(fin_cambio,0) + COALESCE(fin_camtervar,0)
                            + COALESCE(fin_pagbio,0)  + COALESCE(fin_pagterfijo,0)	
                            + COALESCE(fin_pagtervar,0)  + COALESCE(fin_pagajutervar,0))
                            ) ,2 
                        ) as fin_sdo 
                    FROM aseo.esp_fin_financiacion fnn
                    INNER JOIN aseo.esp_dfin_detfinanciacion dff
                            ON dff.fin_ideregistro = fnn.fin_ideregistro 
                            AND dff.dfin_estado = 't'
                    LEFT JOIN aseo.esp_am_amortizacion amm 
                            ON amm.fin_ideregistro = fnn.fin_ideregistro
                            and amm.am_fechagb > date_trunc('month', now())::date 
                    where fin_estado = 't'
                        AND fnn.emp_ideregistro =:id_empresa 
                        AND round(
                                (COALESCE(fin_vlrtotal,0) - 
                                (COALESCE(fin_cambio,0) + COALESCE(fin_camtervar,0)
                                + COALESCE(fin_pagbio,0)  + COALESCE(fin_pagterfijo,0)	
                                + COALESCE(fin_pagtervar,0)  + COALESCE(fin_pagajutervar,0))
                                )  
                            ) > 0 
                ) as cuotas 
		GROUP BY mua_cod, fec_cob " ;
        return $this->executeQuery($sql, $parametros);     
    }
}
