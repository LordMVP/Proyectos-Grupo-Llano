<?php

namespace Bioagricola\BioagricolaBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\Models\GenericoModel;
//use Llanogas\LlanogasBundle\MyException;

/**
 * Consultas para cargar financioaciones especiales.
 *
 * @author rsagudelo
 */
class CargarFinanciacionesModel extends AuditoriaServices {

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var FinanciacionModel 
     */
    private $financiaiconesModel;

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
     * Verifica que la tabla temporal para cargar las financiaciones exista
     * @param $nom_tabla - nombre de la tabla a validar
     * @return type
     */
    public function validarExisteTabla($nom_tabla) {
        $parametros['nom_tab'] = $nom_tabla ;
        $sql = "SELECT count(*) cantidadtablas
                FROM  information_schema.TABLES
                WHERE TABLE_NAME =:nom_tab ;";
        $resultado = $this->executeQuery($sql,$parametros );
        return $resultado[0]['cantidadtablas'];
    }
    
    /**
     * Actualiza los  registros de  BD a estado 'C'
     * @param $idEmpresa - id de la empresa en sesion , $nom_tabla - nombre de la tabla temporal 
     * @return void
     */
    public function vaciarTablaMasiva($idEmpresa, $nom_tabla) {
        $sql = "UPDATE aseo.$nom_tabla SET estado='C' WHERE idempresa = $idEmpresa  and estado <> 'C'";
        $this->executeQuery($sql);
    }
    
    /**
     * Crea la tabla temporal para guardar las líneas de financiacion del archivo que se está procesando
     * @return int
     */
    public function crearTabMasivaFin() {
        $this->crearSecuencia("sq_espe_fin_tab_tmp");
        $sql = "CREATE TABLE IF NOT EXISTS aseo.temp_finan_esp
                (
                idregistro bigint NOT NULL DEFAULT nextval('aseo.sq_espe_fin_tab_tmp'),                 
                tip_suscripcion character varying(10) , 
                mua_cod character varying(15) ,
                lmf_fac integer , 	
                mua_empresa character varying(10) ,
                fin_mesaho character varying(6) ,
                fin_vlrtotal numeric(20,7)  ,
                fin_vlrbio numeric(20,7)  ,
                fin_vlraprfijo numeric(20,7)  ,
                fin_vlraprvar numeric(20,7)  ,
                fin_vlrajuaprvar numeric(20,7)  ,
                fin_vlrviatfijo numeric(20,7) ,
                fin_vlrviatvar numeric(20,7) ,
                idproceso integer,
                estado character(1),
                idempresa integer,
                mensaje text,
                fecha timestamp DEFAULT now(),                  
                CONSTRAINT temp_finan_esp_pkey PRIMARY KEY (idregistro)
               );";
        $resultado = $this->executeQuery($sql);
        $sqlIndxTipuso = "CREATE INDEX temp_finan_esp_tipsuscrip_index ON aseo.temp_finan_esp USING btree (tip_suscripcion)";
        $this->executeQuery($sqlIndxTipuso);
        $sqlIndx_mua_cod = "CREATE INDEX temp_finan_esp_mua_cod_index ON aseo.temp_finan_esp USING btree (mua_cod)";
        $this->executeQuery($sqlIndx_mua_cod);
        $sqlIndx_lmf_fac = "CREATE INDEX temp_finan_esp_lmf_fac_index ON aseo.temp_finan_esp USING btree (lmf_fac)";
        $this->executeQuery($sqlIndx_lmf_fac);        
        $sqlIndx_mesaho = "CREATE INDEX temp_finan_esp_mesaho_index ON aseo.temp_finan_esp USING btree (fin_mesaho)";
        $this->executeQuery($sqlIndx_mesaho);          
        $sqlIndxEstado = "CREATE INDEX ix_temp_finan_esp_estado  ON aseo.temp_finan_esp USING btree (estado)";
        $this->executeQuery($sqlIndxEstado);
        $sqlIndxEmpresa = "CREATE INDEX ix_temp_finan_esp_idempresa  ON aseo.temp_finan_esp USING btree (idempresa)";
        $this->executeQuery($sqlIndxEmpresa);
        $sqlIndxIdProceso = "CREATE INDEX ix_temp_finan_esp_proceso  ON aseo.temp_finan_esp USING btree (idproceso)";
        $this->executeQuery($sqlIndxIdProceso);
        return $resultado;
    }
    
    /**
     * Crea la tabla temporal para guardar los registros de actualizacion de financiacion
     * @return int
     */
    public function crearTabMasivaActFin() {
        $this->crearSecuencia("sq_esp_tem_act_fin");
        $sql = "CREATE TABLE IF NOT EXISTS aseo.esp_tem_act_fin
                (
                idregistro bigint NOT NULL DEFAULT nextval('aseo.sq_esp_tem_act_fin'),    
                fin_ideregistro bigint , 
                mua_cod character varying(15) ,
                lmf_fac integer , 
                fin_mesaho character varying(6) ,
                mua_empresa character varying(10) ,
                fin_tasa numeric(20,7)  ,
                num_cuo integer , 
                fin_est character(1) , 
                idproceso integer,
                estado character(1),
                idempresa integer,
                mensaje text,
                fecha timestamp DEFAULT now(),                  
                CONSTRAINT esp_tem_act_fin_pkey PRIMARY KEY (idregistro)
               );";
        $resultado = $this->executeQuery($sql);
        $sqlIndx_fin_ide = "CREATE INDEX temp_act_fin_esp_fin_ide_index ON aseo.esp_tem_act_fin USING btree (fin_ideregistro)";
        $this->executeQuery($sqlIndx_fin_ide);
        $resultado = $this->executeQuery($sql);
        $sqlIndx_mua_cod = "CREATE INDEX temp_act_fin_esp_mua_cod_index ON aseo.esp_tem_act_fin USING btree (mua_cod)";
        $this->executeQuery($sqlIndx_mua_cod);
        $sqlIndx_lmf_fac = "CREATE INDEX temp_act_fin_esp_lmf_fac_index ON aseo.esp_tem_act_fin USING btree (lmf_fac)";
        $this->executeQuery($sqlIndx_lmf_fac);        
        $sqlIndx_mesaho = "CREATE INDEX temp_act_fin_esp_mesaho_index ON aseo.esp_tem_act_fin USING btree (fin_mesaho)";
        $this->executeQuery($sqlIndx_mesaho);          
        $sqlIndxEstado = "CREATE INDEX ix_temp_act_fin_esp_estado  ON aseo.esp_tem_act_fin USING btree (estado)";
        $this->executeQuery($sqlIndxEstado);
        $sqlIndxEmpresa = "CREATE INDEX ix_temp_act_fin_esp_idempresa  ON aseo.esp_tem_act_fin USING btree (idempresa)";
        $this->executeQuery($sqlIndxEmpresa);
        $sqlIndxIdProceso = "CREATE INDEX ix_temp_act_fin_esp_proceso  ON aseo.esp_tem_act_fin USING btree (idproceso)";
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
     * Valida si ya existe un registro de financiacion con los parámetros envíados
     * @param Array $parametros - Información de la Financiacion a validar
     * @return type
     */
    public function validarRegistro ($parametros) {
        $sql = "SELECT fin_ideregistro 
                FROM aseo.esp_fin_financiacion fnn                
                WHERE fnn.mua_cod=:mua_cod and fnn.lmf_fac=:lmf_fac 
                    and fnn.mua_empresa=:mua_empresa and fnn.fin_mesaho =:fin_mesaho 
                ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return -1;
        }
        return $resultado[0]['fin_ideregistro'];
    }
    
    /**
     * Inserta las financiaciones en la forma masiva en la base de datos
     * @param string $complemento - Información de las líneas de financiaciones que se guardarán separada por coma
     */
    public function insertarMasiva($complemento) {
        $sql = "INSERT INTO aseo.temp_finan_esp (tip_suscripcion, mua_cod, lmf_fac, mua_empresa, fin_mesaho, fin_vlrtotal, fin_vlrbio, fin_vlraprfijo, fin_vlraprvar, fin_vlrajuaprvar , fin_vlrviatfijo, fin_vlrviatvar , idProceso,estado , idEmpresa) values $complemento";
        $this->executeQuery($sql);
    }
    
     /**
     * Valida los posibles inconvenientes que tiene la información subida en el archivo
     * @param number $idEmpresa - Empresa actual 
     * @param number $mesaho - Mes y año que se esta cargando
     * @return type
     */
    public function validarInformacionTemporal($idEmpresa,  $mesaho) {

        $sql = "SELECT
                        (CASE 
                        WHEN tip_suscripcion IS NULL THEN
                        ' Hay Registros sin tipo de uso '|| lmf_fac
                        WHEN mua_cod IS NULL THEN
                        ' Hay Registros sin Mua_Cod '|| lmf_fac
                        WHEN mua_empresa IS NULL THEN
                        ' Hay Registros sin Empresa '|| lmf_fac
                        WHEN (fin_vlrtotal - (fin_vlrbio + fin_vlraprfijo + fin_vlrajuaprvar + fin_vlraprvar +  fin_vlrviatfijo +  fin_vlrviatvar) != 0 )  THEN
                        ' Hay Resgistros con inconsistencia en los valores:  ' || lmf_fac 
                        Else 'Hay otros Errores'
                        END) AS mensaje ,  tbl.lmf_fac                   
                FROM
                        aseo.temp_finan_esp tbl
                WHERE 
                (
                    tip_suscripcion IS NULL
                    OR mua_cod IS NULL
                    OR mua_empresa IS NULL
                    OR (fin_vlrtotal - (fin_vlrbio + fin_vlraprfijo +  fin_vlraprvar +  fin_vlrviatfijo +  fin_vlrviatvar + fin_vlrajuaprvar) != 0 )
                ) AND idEmpresa = $idEmpresa AND fin_mesaho = '$mesaho' AND tbl.estado = 'P' LIMIT 1; ";
        return $this->executeQuery($sql);
    }
    
     /**
     * Elimina las financiaciones que tienen determinado estado
     * @param int $idEmpresa- Id de la empresa actual
     * @param char $estado - Estado de la financiacion que se quiere eliminar
     */
    public function eliminarRegistrosTotales($idEmpresa, $estado) {
        $sql = "delete from aseo.temp_finan_esp where estado='$estado' AND idempresa=$idEmpresa";
        $this->executeQuery($sql);
    }
    
    /**
     * Obtiene las financiaciones que se procesarán según el hilo y estado
     * @param int $idEmpresa - Empresa actual
     * @param int $idHilo - Id del hilo del que se consulta
     * @param int $inicio - Numero de registro desde el que se incia (ahora se valida es por el estado y se toman los 1000 primeros)
     * @return Array - Listado de la financiaciones
     */
    public function getFinanciacionesPorProceso($idEmpresa, $idHilo, $inicio) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idhilo'] = $idHilo;
        $parametros['inicio'] = $inicio;
        $sql = "SELECT            
                    tbl.idregistro ,                 
                    tbl.tip_suscripcion , 
                    tbl.mua_cod ,
                    tbl.lmf_fac , 	
                    tbl.mua_empresa ,
                    tbl.fin_mesaho ,
                    tbl.fin_vlrtotal ,
                    tbl.fin_vlrbio ,
                    tbl.fin_vlraprfijo ,
                    tbl.fin_vlraprvar ,
                    tbl.fin_vlrajuaprvar ,
                    tbl.fin_vlrviatfijo ,
                    tbl.fin_vlrviatvar,
                    tbl.idproceso,
                    estado,
                    tbl.idempresa ,
                    tub.tus_ideregistro ,
                    tub.tus_tasa ,
                    tub.tus_numcuotas 
                FROM aseo.temp_finan_esp tbl
                INNER JOIN aseo.esp_tus_tipusuario tub ON tub.tus_codigo = tbl.tip_suscripcion
                       AND tub.emp_ideregistro = :idempresa
                WHERE
                    idempresa = :idempresa
                    AND idproceso = :idhilo
                    AND estado = 'P'
                LIMIT 1000";
        return $this->executeQuery($sql, $parametros);
    }
    
    /**
     * Consulta la información de la financiacion por el numero de factura.
     * @param int $id_empresa , $num_Factura  
     * @return int id de la financiación
     */
    public function getFinanciacionFactura($id_empresa ,$num_Factura )  {
        $parametros['num_factura'] = $num_Factura ;
        $parametros['id_empresa'] = $id_empresa ;

        $sql = 'SELECT 
                    fin_ideregistro id_finan , 
                    mua_cod             
                FROM
                    aseo.esp_fin_financiacion fnn
                WHERE
                    fnn.lmf_fac = :num_factura  AND emp_ideregistro = :id_empresa';
        $res = $this->executeQuery($sql, $parametros);
        if (count($res) == 0) {
            $resultado['id_finan'] = -1 ; 
        }
        else 
        {
          $resultado['id_finan']= $res[0]['id_finan'] ;
          $resultado['mua_cod']= $res[0]['mua_cod'] ;
        }
        return $resultado ;
    }
    
    /**
     * Consulta los terceros aprovechadores habilitados para el me y empresa.
     * @param int $id_empresa , $mesaho  
     * @return array con la informacion de los porcentajes y aprovechadores
     */
    public function getPorcAprovechadoresMes($id_empresa ,$mesaho )  {
        $parametros['mes_aho'] = $mesaho ;
        $parametros['id_empresa'] = $id_empresa ;

        $sql = "SELECT * 
                FROM aseo.esp_papr_porcaprovechamiento
                WHERE papr_mesaho =:mes_aho 
                and emp_ideregistro =:id_empresa";
        $res = $this->executeQuery($sql, $parametros);
        if (count($res) == 0) {
            $resultado['papr_ideregistro'] = -1 ; 
        }
        else 
        {
          $resultado= $res ;          
        }
        return $resultado ;
    }
    
    /**
     * Inserta la información de una financiacion en la base de datos
     * @param array $recaudo - Información obtenido adionada con el idrecaudo
     */
    public function insertarFinanciacion (array &$finan) {
        $parametros = array();
        $this->setCampo($finan, $parametros, 'idfinanciacion', 'fin_ideregistro');
        $this->setCampo($finan, $parametros, 'tipouso', 'tus_ideregistro');
        $this->setCampo($finan, $parametros, 'codigo', 'mua_cod');
        $this->setCampo($finan, $parametros, 'factura', 'lmf_fac');
        $this->setCampo($finan, $parametros, 'empresa', 'mua_empresa');
        $this->setCampo($finan, $parametros, 'mesaho', 'fin_mesaho');
        $this->setCampo($finan, $parametros, 'vlrtotal', 'fin_vlrtotal');
        $this->setCampo($finan, $parametros, 'vlrbio', 'fin_vlrbio');
        $this->setCampo($finan, $parametros, 'vlraprfijo', 'fin_vlraprfijo');
        $this->setCampo($finan, $parametros, 'vlraprvar', 'fin_vlraprvar');
        $this->setCampo($finan, $parametros, 'vlrajuaprvar', 'fin_vlrajuaprvar');
        $this->setCampo($finan, $parametros, 'vlrviatfijo', 'fin_vlrviatfijo');
        $this->setCampo($finan, $parametros, 'vlrviatvar', 'fin_vlrviatvar');
        $this->setCampo($finan, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($finan, $parametros, 'idusuario', 'usu_ideregistro');
        $idFinan = $this->insertar($parametros, 'aseo.esp_fin_financiacion', 'aseo.sq_esp_fin_ideregistro');
        $finan['idfinanciacion'] = $idFinan;
    } 
    
    /**
     * Inserta el detalle de la financiacion en la base de datos y se obtiene su id
     * @param array detalle - Detalle de la Financiacion 
     */
    public function insertarDetalleFinanciacion(array &$detalle) {
        print_r("\n Inserta Detalle Fin :");
        print_r($detalle);
        $parametros = array();
        $this->setCampo($detalle, $parametros, 'idfinanciacion', 'fin_ideregistro');
        $this->setCampo($detalle, $parametros, 'empresa', 'mua_empresa');
        $this->setCampo($detalle, $parametros, 'tasa', 'dfin_tasa');
        $this->setCampo($detalle, $parametros, 'numcuota', 'dfin_numcuotas');
        $this->setCampo($detalle, $parametros, 'idusuario', 'usu_ideregistro');
        $idDetalleFinanciacion = $this->insertar($parametros, 'aseo.esp_dfin_detfinanciacion', 'aseo.sq_esp_dfin_ideregistro');
        $detalle['iddetalle'] = $idDetalleFinanciacion;
    }
    /**
     * Inserta el detalle de los terceros de aprovechamiento y viat
     * @param array detalle - Detalle del tercero de la Financiacion 
     */
    public function insertarDetTerFinanciacion(array &$det_terceros) {
        print_r("\n Inserta Detalle tercero Fin :");
        print_r($det_terceros);
        $parametros = array();
        $this->setCampo($det_terceros, $parametros, 'idfinanciacion', 'fin_ideregistro');
        $this->setCampo($det_terceros, $parametros, 'idtercero', 'ter_ideregistro');
        $this->setCampo($det_terceros, $parametros, 'vlrfijo', 'afin_vlrfijo');
        $this->setCampo($det_terceros, $parametros, 'vlrvariable', 'afin_vlrvariable');
        $this->setCampo($det_terceros, $parametros, 'vlrajuste', 'afin_vlrajuste');
        $this->setCampo($det_terceros, $parametros, 'camvariable', 'afin_camvlr');        
        $this->setCampo($det_terceros, $parametros, 'pagfijo', 'afin_pagvlrfijo');
        $this->setCampo($det_terceros, $parametros, 'pagvariable', 'afin_pagvlrvariable');
        $this->setCampo($det_terceros, $parametros, 'pagjuste', 'afin_pagvlrajustes');        
        $this->setCampo($det_terceros, $parametros, 'sdofijo', 'afin_sdovlrfijo');
        $this->setCampo($det_terceros, $parametros, 'sdovariable', 'afin_sdovlrvariable');
        $this->setCampo($det_terceros, $parametros, 'sdojuste', 'afin_sdovlrajustes'); 
        $idDetTerFinanciacion = $this->insertar($parametros, 'aseo.esp_afin_aprfinanciacion', 'aseo.sq_esp_afin_ideregistro');
        $det_terceros['iddetalle'] = $idDetTerFinanciacion;
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
        $sql = "UPDATE aseo.temp_finan_esp SET 
            estado = :estado,
            mensaje =:mensaje
            WHERE idregistro=:idregistro ;";
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
                    tmp.tip_suscripcion ,
                    tmp.mua_empresa , 
                    (CASE 
                        WHEN estado = 'A' THEN
                        ' Ok  '
                        WHEN estado = 'P' THEN
                        ' Pendiente '                        
                        Else estado
                        END)estado , 
                    SUM (tmp.fin_vlrtotal) valorregistrosprocesados,
                    COUNT (tmp.lmf_fac) cantidadregistrosprocesados
                FROM aseo.temp_finan_esp tmp
                WHERE tmp.estado in $estados AND tmp.idempresa=:idempresa
                GROUP BY mua_empresa, tip_suscripcion , estado 
                ORDER BY estado, mua_empresa, tip_suscripcion ";
        return $this->executeQuery($sql, $parametros);
    }
    
    /**
     * Consulta los errores del proceso
     * @deprecated since version 
     * @param int $idEmpresa - Id de la empresa actual
     * @return array
     */
    public function consultarResumenErrores($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT 
                    fin_mesaho ,  
                    mensaje, 
                    COUNT (*) as total
                FROM aseo.temp_finan_esp tmp
                WHERE tmp.estado ='F' AND tmp.idempresa=:idempresa 
                GROUP BY fin_mesaho , mensaje 
                ORDER BY mensaje ";
        return $this->executeQuery($sql, $parametros);
    }
    
     /**
     * Valida si ya se actualizo el primer registro del archivo cargado
     * @param Array $param - Información del primer registro a actualizar
     * @return type
     */
    public function validarRegistroAct ($param) {
        $complemento = " " ;
        $parametros['estado'] = "t" ;
        if ($param['fin_ideregistro'] != '' and $param['fin_ideregistro'] > 0 ) 
        {
            $parametros['id_fin'] = $param['fin_ideregistro'] ;
            $complemento .=  " AND fnn.fin_ideregistro =:id_fin " ;
        }
        elseif (strlen($param['lmf_fac'])>= 8 ) 
        {
            $parametros['id_fac'] = $param['lmf_fac'] ;
            $complemento .=  " AND fnn.lmf_fac =:id_fac " ;
        }
        else 
        {
             $parametros['mesaho'] = $param['fin_mesaho'] ;
             $parametros['cod_usu'] = $param['mua_cod'] ;
             $complemento .=  " AND fnn.fin_mesaho =:mesaho and fnn.mua_cod =:cod_usu " ;
        }
        if (strlen($param['mua_empresa'])>= 3 )
        {
            $parametros['segmento'] = $param['mua_empresa'] ;
            $complemento .=  " AND dff.mua_empresa =:segmento  " ;
        }
        if ($param['fin_tasa'] >= 0 )
        {
            $parametros['tasa_fin'] = $param['fin_tasa'] ;
            $complemento .=  " AND dff.dfin_tasa =:tasa_fin  " ;
        }
        if ($param['num_cuo'] >= 0 )
        {
            $parametros['cuotas'] = $param['num_cuo'] ;
            $complemento .=  " AND dff.dfin_numcuotas =:cuotas  " ;
        }   
        if ($param['fin_est'] == 'f' )
        {
            $parametros['estado'] = $param['fin_est'] ;
        }   
        $sql = "SELECT      fnn.fin_ideregistro , fnn.mua_cod , fnn.lmf_fac
                FROM        aseo.esp_fin_financiacion fnn  
		INNER JOIN  aseo.esp_dfin_detfinanciacion dff 
                    ON      dff.fin_ideregistro = fnn.fin_ideregistro 
                    AND     dff.dfin_estado =:estado
                WHERE fnn.fin_estado =:estado  $complemento ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            $resultado['fin_ideregistro'] = -1 ;
            return $resultado ;
        }
        return $resultado[0];
    }
    
     /**
     * Inserta las financiaciones en la forma masiva en la base de datos
     * @param string $complemento - Información de las líneas de los registros a actualizar separados por coma
     */
    public function insertarMasivaTmp ($complemento) {
        $sql = "INSERT INTO aseo.esp_tem_act_fin (fin_ideregistro, mua_cod, lmf_fac, fin_mesaho, mua_empresa, fin_tasa, num_cuo , fin_est, idEmpresa, estado, idProceso) values $complemento ";
        $this->executeQuery($sql);
    }
    /**
     * Obtiene las los registros de actualizacion que se procesarán según el hilo y estado
     * @param int $idEmpresa - Empresa actual
     * @param int $idHilo - Id del hilo del que se consulta
     * @return Array - Listado de registros de actualizacion de financiaciones
     */
    
    public function getActFinanPorProceso($idEmpresa, $idHilo ) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idhilo'] = $idHilo;
        $sql = "SELECT 
                    tbl.idregistro , 
                    tbl.fin_ideregistro, 
                    tbl.mua_cod, 
                    tbl.lmf_fac , 
                    tbl.fin_mesaho ,
                    tbl.mua_empresa , 
                    tbl.fin_tasa , 
                    tbl.num_cuo , 
                    tbl.fin_est , 
                    tbl.idproceso,
                    tbl.estado,
                    tbl.idempresa                     
                FROM aseo.esp_tem_act_fin tbl      
                WHERE
                    idempresa = :idempresa
                    AND idproceso = :idhilo
                    AND estado = 'P'
                LIMIT 1000";
        return $this->executeQuery($sql, $parametros);
    }
    
    /**
     * Realiza la consulta de la financiacion segun los parametros enviados
     * @param Array $param - Objeto con la informacion de la tabla temporal
     * @return type
     */
    public function consultarFinanAct ($param) {
        $complemento = " " ;
   
        if ($param['fin_ideregistro'] != '' and $param['fin_ideregistro'] > 0 ) 
        {
            $parametros['id_fin'] = $param['fin_ideregistro'] ;
            $complemento .=  " AND fnn.fin_ideregistro =:id_fin " ;
        }
        elseif (strlen($param['lmf_fac'])>= 8 ) 
        {
            $parametros['id_fac'] = $param['lmf_fac'] ;
            $complemento .=  " AND fnn.lmf_fac =:id_fac " ;
        }
        else {
             $parametros['mesaho'] = $param['fin_mesaho'] ;
             $parametros['cod_usu'] = $param['mua_cod'] ;
             $complemento .=  " AND fnn.fin_mesaho =:mesaho and fnn.mua_cod =:cod_usu " ;
        }          
        $sql = "SELECT fnn.fin_ideregistro , fnn.mua_cod , 
                       fnn.lmf_fac , fnn.fin_mesaho , 
                       fnn.fin_cuoemitidas ,
                       fnn.fin_version ,
                       dff.dfin_ideregistro , dff.dfin_numcuotas , 
                       dff.dfin_tasa, dff.mua_empresa
                FROM        aseo.esp_fin_financiacion fnn  
		INNER JOIN  aseo.esp_dfin_detfinanciacion dff 
                    ON      dff.fin_ideregistro = fnn.fin_ideregistro 
                    AND     dff.dfin_estado = 't'
                WHERE fnn.fin_estado = 't' $complemento ";
        $res = $this->executeQuery($sql, $parametros);
        echo $sql ;
        
        if (count($res) == 0) 
        
            $resultado['fin_ideregistro'] = -1 ;           
        elseif (count($res) > 1 ) 
            $resultado['fin_ideregistro'] = -2 ;
        else
            $resultado = $res[0];
        return $resultado ;
    }
    
    /**
     * Actualiza el estado del detalle a false
     * @param  $param - (identificador del detalle , usu_ideregistro ) 
     */
    public function actualizarDetalleFinan ($param) {
        $parametros['id_detalle'] = $param['id_detalle']  ;
        $parametros['id_usuario'] = $param['usuario'];
       
        $sql = 'UPDATE 	aseo.esp_dfin_detfinanciacion 
                SET 	dfin_estado = FALSE ,
                        usu_ideregistromod =:id_usuario ,
			dfin_fechamod = now() 
		WHERE dfin_ideregistro =:id_detalle';
        $this->executeQuery($sql, $parametros);        
    }  
    
     /**
     * Actualiza la información del registro de actualizacion de financiacion en la tabla temporal
     * @param int $param - para,etros para la actualizacion (idregistro, estado, mensaje )
     * @return int
     */
    public function actualizarTemporalActResumen($param) {
        $parametros['estado'] =  $param['estado'] ;
        $parametros['idregistro'] = $param['id_registro'] ;
        $parametros['mensaje'] =  $param['mensaje'] ;
        $sql = "UPDATE aseo.esp_tem_act_fin SET 
            estado = :estado,
            mensaje =:mensaje
            WHERE idregistro=:idregistro ;";
        return $this->executeQuery($sql, $parametros);
    }
    /**
     * Cosulta el resultado del proceso agrupado por empresa homologada
     * @param int $idEmpresa - Id de la empresa actual
     * @param char $estado - Estado del que se quiere consultar (Correctos A, Con inconveniente F)
     * @return array - Listado de empresas homologadas con cantidad de registros afectados
     */
    public function consultarResumenAct($idEmpresa, $estados) {
        $parametros['idempresa'] = $idEmpresa;
        //$parametros['estados'] = $estados;
        $sql = "SELECT 
                    '' as tip_suscripcion ,
                    tmp.mua_empresa , 
                    (CASE 
                        WHEN estado = 'A' THEN
                        ' Ok  '
                        WHEN estado = 'P' THEN
                        ' Pendiente '                        
                        Else estado
                        END)estado , 
                    0 as valorregistrosprocesados,
                    COUNT (tmp.*) cantidadregistrosprocesados
                FROM aseo.esp_tem_act_fin tmp
                WHERE tmp.estado in $estados AND tmp.idempresa=:idempresa
                GROUP BY mua_empresa, tip_suscripcion , estado 
                ORDER BY estado, mua_empresa, tip_suscripcion ";
        return $this->executeQuery($sql, $parametros);
    }
    
     /**
     * Consulta los errores del proceso
     * @deprecated since version 
     * @param int $idEmpresa - Id de la empresa actual
     * @return array
     */
    public function consultarResumenErroresAct($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT 
                    fin_mesaho , 
                    mensaje, 
                    COUNT (*) as fin_vlrtotal
                FROM aseo.esp_tem_act_fin tmp
                WHERE tmp.estado ='F' AND tmp.idempresa= :idempresa
                GROUP BY fin_mesaho , mensaje 
                ORDER BY mensaje ; ";
        return $this->executeQuery($sql, $parametros);
    }
    
    /**
     * Actualiza informacion de la financiacion con los valores necesarios.
     * @param array $financiacion con los datos a actualziar
     * @param int $idversion identificador de la version.
     * @return int Número de registros afectados.
     */
    public function actualizarFinanciacion ($financiacion, $idversion) {     
        $condicion = ' fin_ideregistro = :fin_ideregistro and fin_version = '.$idversion. '  ';
        return $this->actualizar($financiacion, 'aseo.esp_fin_financiacion', $condicion );        
    }
    
}
