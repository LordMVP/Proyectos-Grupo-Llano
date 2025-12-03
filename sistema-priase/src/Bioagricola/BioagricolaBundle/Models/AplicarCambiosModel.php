<?php

namespace Bioagricola\BioagricolaBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\Models\GenericoModel;


/**
 * Consultas para cargar financioaciones especiales.
 *
 * @author rsagudelo
 */
class AplicarCambiosModel extends AuditoriaServices {

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
                WHERE TABLE_NAME ='temp_act_dxd_fin_esp' ";
        $resultado = $this->executeQuery($sql);
        return $resultado[0]['cantidadtablas'];
    }
    
    /**
     * Actualiza los  registros de la tabla temporal a estado 'C'
     * @param $idEmpresa - id de la empresa en sesion 
     * @return void
     */
    public function vaciarTablaMasiva($idEmpresa) {
        $sql = "UPDATE aseo.temp_act_dxd_fin_esp SET estado='C' WHERE idempresa = $idEmpresa  and estado <> 'C'";
        $this->executeQuery($sql);
    }
    
    /**
     * Crea la tabla temporal para cargar los cambios DxD a aplicar
     * @return int
     */
    public function crearTabMasiva() {
        $this->crearSecuencia("sq_temp_act_dxd_fin_esp");
        $sql = "CREATE TABLE IF NOT EXISTS aseo.temp_act_dxd_fin_esp
                (
                idregistro bigint NOT NULL DEFAULT nextval('aseo.sq_temp_act_dxd_fin_esp'), 
                num_pqr bigint , 
                mua_cod character varying(15) ,
                lmf_fac integer , 
                idfinanciacion bigint ,
                num_version bigint ,
                fin_mesaho character varying(6) ,
                des_vlrtotal numeric(20,7)  ,
                des_vlrbio numeric(20,7)  ,  
                des_vlrter numeric(20,7)  ,
                des_vlrterpag numeric(20,7) ,
                des_vlrsdo numeric(20,7) ,
                des_usuapl character varying(15), 
                idproceso integer,
                estado character(1),
                idempresa integer,
                mensaje text,
                fecha timestamp DEFAULT now(),                  
                CONSTRAINT temp_act_dxd_fin_esp_pkey PRIMARY KEY (idregistro)
               );";
        $resultado = $this->executeQuery($sql);         
        $sqlIndxEstado = "CREATE INDEX ix_dxd_finan_esp_estado  ON aseo.temp_act_dxd_fin_esp USING btree (estado)";
        $this->executeQuery($sqlIndxEstado);
        $sqlIndxEmpresa = "CREATE INDEX ix_temp_act_dxd_fin_esp_idempresa  ON aseo.temp_act_dxd_fin_esp USING btree (idempresa)";
        $this->executeQuery($sqlIndxEmpresa);
        $sqlIndxIdProceso = "CREATE INDEX ix_temp_act_dxd_fin_esp_proceso  ON aseo.temp_act_dxd_fin_esp USING btree (idproceso)";
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
     * llena la,version de la Financiacion antes de aplicar el cambios DxD a aplicar
     * @param $idEmpresa - id de la empresa en sesion 
     * @return int
     */
    public function actVersionFinanciacion($idEmpresa) {
        $parametros['id_empresa']= $idEmpresa ;
        $sql = "UPDATE aseo.temp_act_dxd_fin_esp tpesp 
                SET num_version = (SELECT fnn.fin_version
                                    FROM aseo.esp_fin_financiacion fnn 
                                    WHERE fnn.fin_ideregistro = tpesp.idfinanciacion
                                            AND fnn.emp_ideregistro =:id_empresa )
                WHERE  estado = 'P' AND idempresa =:id_empresa ;";
        $resultado = $this->executeQuery($sql,$parametros);         
        return $resultado;
    }

    /**
     * Inserta los cambios de valor a Aplicar forma masiva en la base de datos
     * @param string $complemento - Información de las líneas de cambios de Valor DxD que se guardarán separada por coma
     */
    public function insertarMasiva($complemento) {
        $sql = "INSERT INTO aseo.temp_act_dxd_fin_esp (num_pqr , mua_cod, lmf_fac, idfinanciacion, num_version , fin_mesaho, des_vlrtotal, des_vlrbio, des_vlrter, des_vlrterpag, des_vlrsdo, des_usuapl, idproceso, estado, idempresa) values $complemento ";          
        $this->executeQuery($sql); 
    }
    
     /**
     * Elimina los cambios de Valor DxD que tienen determinado estado
     * @param int $idEmpresa- Id de la empresa actual
     * @param char $estado - Estado de la financiacion que se quiere eliminar
     */
    public function eliminarRegistrosTotales($idEmpresa, $estado) {
        $sql = "delete from aseo.temp_act_dxd_fin_esp where estado='$estado' AND idempresa=$idEmpresa";
        $this->executeQuery($sql);
    }
    
    /**
     * Obtiene los cambios de valor DxD que se procesarán según el hilo y estado
     * @param int $idEmpresa - Empresa actual
     * @param int $idHilo - Id del hilo del que se consulta
     * @return Array - Listado de la financiaciones
     */
    public function getCambiosDxDproceso($idEmpresa, $idHilo) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idhilo'] = $idHilo;
        $sql = "SELECT            
                    tbl.idregistro ,  
                    tbl.num_pqr , 
                    tbl.mua_cod, 
                    tbl.lmf_fac, 
                    tbl.idfinanciacion, 
                    tbl.fin_mesaho, 
                    tbl.des_vlrtotal, 
                    tbl.des_vlrbio, 
                    tbl.des_vlrter ,
                    tbl.des_vlrterpag,                    
                    tbl.des_vlrsdo,                    
                    tbl.des_usuapl,    
                    tbl.num_version,    
                    tbl.idproceso,
                    estado,
                    tbl.idempresa 
                FROM aseo.temp_act_dxd_fin_esp tbl
                WHERE
                    idempresa = :idempresa
                    AND idproceso = :idhilo
                    AND estado = 'P'
                LIMIT 1000";
        return $this->executeQuery($sql, $parametros);
    }
    
    /**
     * Consulta la información de la financiacion si tiene ya un cambio de valor DxD.
     * @param int $id_financiacion
     * @return array con datos de la financiacion 
     */
    public function getFinanciacionDxD($id_financiacion )  {
        $parametros['id_finan'] = $id_financiacion ;
        $sql = "SELECT 
                        fnn.fin_ideregistro id_finan , 	
                        fnn.fin_swtcamdesh  ,
                        cffn.camv_ideregistro , 
                        cffn.camv_numradicado as radicado 		
                FROM        aseo.esp_fin_financiacion fnn
                LEFT JOIN   aseo.esp_camv_cambiovalor cffn
                    ON      cffn.camv_ideregistro = fnn.camv_ideregistro
                WHERE fnn.fin_ideregistro =:id_finan AND fnn.fin_estado = 't'" ;
        $res = $this->executeQuery($sql, $parametros);
        if (count($res) == 0) {
            $resultado['id_finan'] = -1 ; 
        }
        else 
        {
          $resultado= $res[0] ;          
        }
        return $resultado ;
    }
    
    /**
     * Consulta los detalles de financiacion para cada terceros aprovechadores.
     * @param int $id_financiacion  
     * @return array con la informacion de los porcentajes y aprovechadores
     */
    public function getDetAprFinanciacion ($id_financiacion )  {
        $parametros['id_finan'] = $id_financiacion ;

        $sql = "SELECT * 
                FROM aseo.esp_afin_aprfinanciacion afnn 
                WHERE afnn.fin_ideregistro =:id_finan ; ";
        $res = $this->executeQuery($sql, $parametros);
        if (count($res) == 0) {
            $resultado['fin_ideregistro'] = -1 ; 
        }
        else 
        {
          $resultado= $res ;          
        }
        return $resultado ;
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
        $sql = "UPDATE aseo.temp_act_dxd_fin_esp SET 
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
                        mensaje, 
                        fin_mesaho,                     
                        tmp.des_usuapl ,
                        count (*) as cantidad ,
                        sum (des_vlrtotal) as total  
                FROM        aseo.temp_act_dxd_fin_esp tmp
                WHERE       tmp.estado in ('F' )
                    AND     tmp.idempresa= :idempresa 
		GROUP BY    mensaje, 
                            fin_mesaho,                     
                            tmp.des_usuapl 
		ORDER BY    mensaje ";
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
        //$parametros['estados'] = $estados;
        $sql = "SELECT 
                    tmp.fin_mesaho as mes,
                    (CASE 
                            WHEN estado = 'A' THEN 'Ok'
                            WHEN estado = 'P' THEN 'Pendiente'                        
                            Else estado
                    END) estado , 
                    (CASE 
                            WHEN des_usuapl = '' THEN 'SIN APLICAR'                                               
                            ELSE 'APLICADO'  
                    END) tipo_cambio , 
                    SUM (tmp.des_vlrtotal) valorregistrosprocesados,
                    SUM (tmp.des_vlrbio) vlr_bio,
                    SUM (tmp.des_vlrter) vlr_tercero,
                    SUM (tmp.des_vlrterpag) vlr_tercero_pag,
                    SUM (
                            (CASE 
                                    WHEN des_usuapl ='' THEN tmp.des_vlrsdo                                              
                                    Else 0  
                            END) 
                    ) vlr_sdo ,
                    COUNT (tmp.num_pqr) cantidadregistrosprocesados
                FROM aseo.temp_act_dxd_fin_esp tmp
                WHERE tmp.estado in $estados AND tmp.idempresa=:idempresa
                GROUP BY  estado,  tipo_cambio , mes
                ORDER BY estado,  tipo_cambio , mes ";
        return $this->executeQuery($sql, $parametros);
    }
    
     /**
     * Obtiene las cambios DxD a aplicar a las financiaciones
     * @param int $idEmpresa - Empresa actual
     * @return Array - Listado de cambios de valor a Aplicar
     */
    public function getCambiosDxD_AplFin ($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $cod_reclamos = COD_REC_DXD ;
        $sql = "SELECT 
                    dct.descuento_numpqr::INTEGER num_pqr, 
                    dct.descuento_codsus mua_cod, 
                    fnn.lmf_fac, 
                    fnn.fin_ideregistro idfinanciacion, 
                    fnn.fin_version num_version, 
                    dct.descuento_mes fin_mesaho, 
                    dct.descuento_vlrtot des_vlrtotal,  
                    0 des_vlrbio, 
                    0 des_vlrter, 
                    0 des_vlrterpag, 
                    0 des_vlrsdo,
                    dct.descuento_usudes des_usuapl
                FROM descuentos dct  
                    INNER JOIN  reclamos recl ON reclamo_numpqr=descuento_numpqr 
                        AND     reclamo_codemp=descuento_codemp 
                        AND     reclamo_codrec::INTEGER IN ($cod_reclamos) 
                    INNER JOIN  empresas emmp ON emmp.empresa_cod = descuento_codemp
                    INNER JOIN  aseo.esp_fin_financiacion fnn ON fnn.mua_cod = descuento_codsus 
                        AND     fnn.fin_mesaho = descuento_mes  
                        AND     fnn.emp_ideregistro = emmp.empresa_sevemp
                WHERE emmp.empresa_sevemp =:idempresa 
                 AND (fnn.fin_swtcamdesh = 'f' OR descuento_usudes IS NULL) ";
        return $this->executeQuery($sql, $parametros);
    }
    
     /**
     * Inserta la información del cambio de valor en la base de datos
     * @param array $camValor - Información del cambio de valor adionada con el idcambioV
     */
    public function insertarCambioValor (array &$camValor) {
        $parametros = array();         
        $this->setCampo($camValor, $parametros, 'idcambio', 'camv_ideregistro');
        $this->setCampo($camValor, $parametros, 'finan', 'fin_ideregistro');
        $this->setCampo($camValor, $parametros, 'codigo', 'mua_cod');
        $this->setCampo($camValor, $parametros, 'factura', 'lmf_fac');
        $this->setCampo($camValor, $parametros, 'mesaho', 'camv_mesaho');
        $this->setCampo($camValor, $parametros, 'num_pqr', 'camv_numradicado');
        $this->setCampo($camValor, $parametros, 'vlrtotal', 'camv_vlrtotal');
        $this->setCampo($camValor, $parametros, 'vlrbio', 'camv_vlrbio');
        $this->setCampo($camValor, $parametros, 'vlrtercero', 'camv_vlrter');
        $this->setCampo($camValor, $parametros, 'vlrtercepag', 'camv_vlrterpag');
        $this->setCampo($camValor, $parametros, 'vlrsdo', 'camv_vlrsdo');
        $this->setCampo($camValor, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($camValor, $parametros, 'idusuario', 'usu_ideregistro');
        $idCamb = $this->insertar($parametros, 'aseo.esp_camv_cambiovalor', 'aseo.sq_esp_camv_ideregistro');                
        $camValor['idcambio'] = $idCamb;
    } 
     /**
     * Actualiza informacion en el detalle de terceros de la financiacion.
     * @param array $destalleDxD de talle con los datos a actualziar
     * @param int $iddetalle identificador del detalle a actualizar.
     * @return int Número de detalles afectados.
     */
    public function actualizarDetTercFinanciacion($destalle_dxd) {
        $data['afin_camvlr'] = $destalle_dxd['afin_camvlr'];
        $data['afin_camvlrpago'] = $destalle_dxd['afin_camvlrpago'];
        $data['camv_ideregistro'] = $destalle_dxd['camv_ideregistro'];
        $data['afin_sdovlrvariable'] = $destalle_dxd['afin_sdovlrvariable'];
        $data['afin_swtrepcambio'] = $destalle_dxd['afin_swtrepcambio'];
        $data['afin_ideregistro'] = $destalle_dxd['afin_ideregistro'];
        return $this->actualizar($data, 'aseo.esp_afin_aprfinanciacion', 'afin_ideregistro = :afin_ideregistro');
    }
    
    /**
     * Busca las amortzaciones de la financiacion que aun tienen saldo.
     * @param int $id_financiacion  
     * @return array con la informacion de la amortizacion 
     */
    public function getAmortizacionFinanciacion ($id_financiacion )  {
        $parametros['id_finan'] = $id_financiacion ;
        $sql = "SELECT * 
                FROM aseo.esp_am_amortizacion amm 
                WHERE amm.fin_ideregistro =:id_finan and amm.am_sdocuota > 0 
                ORDER BY am_ideregistro ";
        $res = $this->executeQuery($sql, $parametros);
        if (count($res) == 0) {
            $resultado[0]['fin_ideregistro'] = -1 ; 
        }
        else 
        {
          $resultado= $res ;          
        }
        return $resultado ;
    }
    
     /**
     * Actualiza informacion de la amortizacion con los valores del cambio.
     * @param array $amortizacion con los datos a actualziar
     * @param int $idamortiz identificador del registro a actualizar.
     * @return int Número de registros afectados.
     */
    public function actualizarAmortizacionFinan ($amortizacion, $idamortiz) {
        $data['am_camtervar'] = $amortizacion['am_camtervar'];
        $data['am_cambio'] = $amortizacion['am_cambio'];
        $data['am_sdocuota'] = $amortizacion['am_sdocuota'];
        $data['am_swtcamdesh'] = $amortizacion['am_swtcamdesh'];
        $data['am_ideregistro'] = $idamortiz;
        return $this->actualizar($data, 'aseo.esp_am_amortizacion', 'am_ideregistro = :am_ideregistro');        
    }
    
     /**
     * Busca la financiacion por Id.
     * @param int $id_financiacion  
     * @return array con la informacion de la financiacion 
     */
    public function getFinanciacionById ($id_financiacion )  {
        $parametros['id_finan'] = $id_financiacion ;
        $sql = "SELECT  * 
                FROM    aseo.esp_fin_financiacion fnn 
                WHERE   fnn.fin_ideregistro =:id_finan 
                    AND fnn.fin_estado = 't' ; ";
        $res = $this->executeQuery($sql, $parametros);
        if (count($res) == 0) {
            $resultado['fin_ideregistro'] = -1 ; 
        }
        else 
        {
          $resultado= $res[0] ;          
        }
        return $resultado ;
    }
      /**
     * Actualiza informacion de la financiacion con los valores del cambio de valor.
     * @param array $financiacion con los datos a actualziar
     * @param int $idversion identificador de la version.
     * @return int Número de registros afectados.
     */
    public function actualizarFinanciacionDxD ($financiacion, $idversion) {
        $data['fin_camtervar'] = $financiacion['fin_camtervar'];
        $data['fin_cambio'] = $financiacion['fin_cambio'];
        $data['fin_version'] = $financiacion['fin_version'];
        $data['fin_swtcamdesh'] = $financiacion['fin_swtcamdesh'];
        $data['fin_ideregistro'] = $financiacion['fin_ideregistro'];
        $data['camv_ideregistro'] = $financiacion['camv_ideregistro'];        
        $condicion = ' fin_ideregistro = :fin_ideregistro and fin_version = '.$idversion. '  ';
        return $this->actualizar($data, 'aseo.esp_fin_financiacion', $condicion );        
    }
      /**
     * Actualiza informacion del cambio de valor, los valores que dependen de la aplicacion.
     * @param array $camValor con los datos a actualziar
     * @return int Número de registros afectados.
     */
    public function actualizarCambioValorDxD ($camValor ) {
        $data['camv_vlrbio'] = $camValor['vlrbio'];
        $data['camv_vlrter'] = $camValor['vlrtercero'];
        $data['camv_vlrterpag'] = $camValor['vlrtercepag'];
        $data['camv_vlrsdo'] = $camValor['vlrsdo'];
        $data['camv_ideregistro'] = $camValor['idcambio'];
        $condicion = 'camv_ideregistro = :camv_ideregistro' ;
        return $this->actualizar($data, 'aseo.esp_camv_cambiovalor', $condicion );        
    }
      /**
     * Actualiza informacion en la tabla temporal, los valores que dependen de la aplicacion.
     * @param array $camValor con los datos a actualziar , y $idtabla el id de la tabla temp
     * @return int Número de registros afectados.
     */
    public function actualizarTabTemporalDxD ($camValor , $idtabla ) {
        $data['des_vlrbio'] = $camValor['vlrbio'];
        $data['des_vlrter'] = $camValor['vlrtercero'];
        $data['des_vlrterpag'] = $camValor['vlrtercepag'];
        $data['des_vlrsdo'] = $camValor['vlrsdo'];
        $data['idregistro'] = $idtabla ;   
        $condicion = 'idregistro = :idregistro' ;
        return $this->actualizar($data, 'aseo.temp_act_dxd_fin_esp', $condicion );        
    } 
    
    /**
     * Consulta la informacion de los registros cargados con error 
     * @param array con los datos ( empresa )
     * @return array con la informacion consolidada 
     */
    public function getRegistrosErrores($parametros )  {                 
        $sql = "SELECT   
                        mua_cod , des_vlrtotal  ,   
                        fin_mesaho , num_pqr  , 
                        des_usuapl , lmf_fac  , 
                        idfinanciacion  , mensaje
                FROM        aseo.temp_act_dxd_fin_esp tbl
                WHERE idempresa = :id_empresa
                AND estado = 'F'
                ORDER BY mensaje , fin_mesaho ; " ;
        return $this->executeQuery($sql, $parametros);     
    }
    
    /**
     * Consulta la informacion de los cambios de valor con saldo 
     * @param array con los datos ( empresa )
     * @return array con la informacion consolidada 
     */
    public function getRegistrosSaldos($parametros )  {                 
        $sql = "SELECT 
                        mua_cod , lmf_fac , 
                        fin_ideregistro , camv_mesaho , 
                        camv_numradicado , camv_vlrtotal , 
                        camv_vlrbio , camv_vlrter , 
                        camv_vlrterpag , camv_vlrsdo , 
                        camv_fechagb
                FROM    aseo.esp_camv_cambiovalor cvv  
                WHERE       EXTRACT(MONTH FROM cvv.camv_fechagb )=EXTRACT(MONTH FROM now() )  
                    AND     EXTRACT(YEAR FROM cvv.camv_fechagb )=EXTRACT(YEAR FROM now() )  
                    AND     emp_ideregistro = :id_empresa 
                    AND     camv_vlrsdo > 0 ; " ;
        return $this->executeQuery($sql, $parametros);     
    }
}
