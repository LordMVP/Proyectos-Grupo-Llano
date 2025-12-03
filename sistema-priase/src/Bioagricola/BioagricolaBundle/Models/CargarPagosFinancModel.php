<?php

namespace Bioagricola\BioagricolaBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\Models\GenericoModel;


/**
 * Consultas para cargar financioaciones especiales.
 *
 * @author rsagudelo
 */
class CargarPagosFinancModel extends AuditoriaServices {

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
                WHERE TABLE_NAME ='temp_imp_pag_fin_esp' ";
        $resultado = $this->executeQuery($sql);
        return $resultado[0]['cantidadtablas'];
    }
    
    /**
     * Actualiza los  registros de la tabla temporal a estado 'C'
     * @param $idEmpresa - id de la empresa en sesion 
     * @return void
     */
    public function vaciarTablaMasiva($idEmpresa) {
        $sql = "UPDATE aseo.temp_imp_pag_fin_esp SET estado='C' WHERE idempresa = $idEmpresa  and estado <> 'C'";
        $this->executeQuery($sql);
    }
    
    /**
     * Crea la tabla temporal para cargar los cambios DxD a aplicar
     * @return int
     */
    public function crearTabMasiva() {
        $this->crearSecuencia("sq_temp_imp_pag_fin_esp");
        $sql = "CREATE TABLE IF NOT EXISTS aseo.temp_imp_pag_fin_esp
                (
                idregistro bigint NOT NULL DEFAULT nextval('aseo.sq_temp_imp_pag_fin_esp'), 
                mua_cod character varying(15) ,
                lmf_fac integer , 
                idfinanciacion bigint ,
                pag_mesaho character varying(6) ,
                pag_vlrtotal numeric(20,7)  ,
                pag_vlrbio numeric(20,7)  ,  
                pag_vlrterfijo numeric(20,7)  ,
                pag_vlrtervar numeric(20,7)  ,
                pag_vlrteraju numeric(20,7) ,
                pag_vlrsdo numeric(20,7) ,
                pag_vlrinteres numeric(20,7) ,
                pag_tipopago character(1) ,  -- P pago de amortizacion , A -> abono al usuario
                idproceso integer,
                estado character(1),
                idempresa integer,
                mensaje text,
                fecha timestamp DEFAULT now(),                  
                CONSTRAINT temp_imp_pag_fin_esp_pkey PRIMARY KEY (idregistro)
               );";
        $resultado = $this->executeQuery($sql);         
        $sqlIndxEstado = "CREATE INDEX ix_pag_fin_esp_estado  ON aseo.temp_imp_pag_fin_esp USING btree (estado)";
        $this->executeQuery($sqlIndxEstado);
        $sqlIndxEmpresa = "CREATE INDEX ix_temp_imp_pag_fin_esp_idempresa  ON aseo.temp_imp_pag_fin_esp USING btree (idempresa)";
        $this->executeQuery($sqlIndxEmpresa);
        $sqlIndxIdProceso = "CREATE INDEX ix_temp_imp_pag_fin_esp_proceso  ON aseo.temp_imp_pag_fin_esp USING btree (idproceso)";
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
     * Valida si ya existe un registro de pago con los parámetros envíados
     * @param Array $parametros - Información del registro a validar
     * @return type
     */
    public function validarRegistro ($parametros) {
        $sql = "SELECT 
                    pag_ideregistro 
                FROM aseo.esp_pag_pago pgg                
                WHERE   pgg.mua_cod=:mua_cod 
                    AND pgg.lmf_fac=:lmf_fac 
                    AND pgg.fin_ideregistro=:idfinanciacion 
                    AND pgg.pag_tipo =:pag_tipopago
                    AND pgg.emp_ideregistro=:id_empresa ";  
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return -1;
        }
        return $resultado[0]['pag_ideregistro'];
    }
    
     /**
     * Inserta los pagos a Aplicar forma masiva en la base de datos
     * @param string $complemento - Información de las líneas de cambios de Valor DxD que se guardarán separada por coma
     */
    public function insertarMasiva($complemento) {
        $sql = "INSERT INTO aseo.temp_imp_pag_fin_esp (mua_cod , lmf_fac, idfinanciacion, pag_mesaho, pag_vlrtotal , pag_vlrbio, pag_vlrterfijo, pag_vlrtervar, pag_vlrteraju, pag_vlrsdo, pag_tipopago, idproceso, estado, idempresa) values $complemento ";          
        $this->executeQuery($sql); 
    }
    
     /**
     * Valida los posibles inconvenientes que tiene la información subida en el archivo
     * @param number $idEmpresa - Empresa actual 
     * @param number $mesaho - Mes y año que se esta cargando
     * @return type
     */
    public function validarInformacionTemporal($idEmpresa) {
        $sql = "SELECT
                        (CASE 
                        WHEN ( pag_vlrtotal > 0  AND ( pag_vlrbio + pag_vlrterfijo + pag_vlrtervar + pag_vlrteraju ) > 0 ) THEN
                        ' Hay Registros con valores inconsistentes, debido a que tienen valores en el total y en los individuales '|| lmf_fac
                        WHEN pag_tipopago NOT IN ('A' , 'P') THEN
                        ' Error en el tipo de pago '|| lmf_fac
                        Else 'Hay otros Errores'
                        END) AS mensaje ,  tbl.lmf_fac                   
                FROM
                        aseo.temp_imp_pag_fin_esp tbl
                WHERE  
                ( pag_tipopago NOT IN ('A' , 'P') OR 
                ( pag_vlrtotal > 0  AND ( pag_vlrbio + pag_vlrterfijo + pag_vlrtervar + pag_vlrteraju ) > 0 ))
                 AND idEmpresa = $idEmpresa AND tbl.estado = 'P' LIMIT 1; ";
        return $this->executeQuery($sql);
    }
    
     /**
     * Elimina los cambios de Valor DxD que tienen determinado estado
     * @param int $idEmpresa- Id de la empresa actual
     * @param char $estado - Estado de la financiacion que se quiere eliminar
     */
    public function eliminarRegistrosTotales($idEmpresa, $estado) {
        $sql = "delete from aseo.temp_imp_pag_fin_esp where estado='$estado' AND idempresa=$idEmpresa";
        $this->executeQuery($sql);
    }  
    
     /**
     * Obtiene los cambios de valor DxD que se procesarán según el hilo y estado
     * @param int $idEmpresa - Empresa actual
     * @param int $idHilo - Id del hilo del que se consulta
     * @return Array - Listado de la financiaciones
     */
    public function getPagosProceso($idEmpresa, $idHilo) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idhilo'] = $idHilo;
        $sql = "SELECT            
                    tbl.idregistro,  
                    tbl.mua_cod,
                    tbl.lmf_fac, 
                    tbl.idfinanciacion,
                    tbl.pag_mesaho,
                    tbl.pag_vlrtotal,
                    tbl.pag_vlrbio,  
                    tbl.pag_vlrterfijo,
                    tbl.pag_vlrtervar,
                    tbl.pag_vlrteraju,
                    tbl.pag_vlrsdo,
                    tbl.pag_tipopago,    
                    tbl.idproceso,
                    tbl.estado,
                    tbl.idempresa 
                FROM aseo.temp_imp_pag_fin_esp tbl
                WHERE
                    idempresa = :idempresa
                    AND idproceso = :idhilo
                    AND estado = 'P'
                LIMIT 1000";
        return $this->executeQuery($sql, $parametros);
    }
    
    /**
     * Consulta la información de las financiaciones por el codigo de usuario.
     * @param array $param con los datos para la consulta
     * @return array con datos de la financiacion 
     */
    public function getUsuarioFinanciacion ($param)  {
        $parametros['cod_usuario'] = $param['idusuario']  ;
        $parametros['id_empresa'] = $param['idempresa'] ;
        $complemento = " " ; 
        if ($param['idfin']  > 0 )
        {
           $complemento .= " AND fnn.fin_ideregistro =:id_finan " ;
            $parametros['id_finan'] = $param['idfin'] ;
        }
        $sql = "SELECT 
                    mua_cod , 
                    ARRAY_AGG (fin_ideregistro )::TEXT as id_finan , 
                    ARRAY_AGG (lmf_fac )::TEXT as num_fac_fin , 
                    count (*) as cantidad  ,
                    sum ((fin_vlrtotal - 
                            (fin_cambio + fin_camtervar + fin_pagbio + fin_pagtervar + fin_pagterfijo + fin_pagajutervar)
                        ) ) as saldo,
                    sum (fin_vlrbio - fin_cambio - fin_pagbio) sdo_bio , 
                    sum (fin_vlraprfijo + fin_vlrviatfijo - fin_pagterfijo ) sdo_ter_fij ,
                    sum (fin_vlraprvar + fin_vlrviatvar - fin_camtervar - fin_pagtervar ) sdo_ter_var ,
                    sum (fin_vlrajuaprvar - fin_pagajutervar ) sdo_ter_aju  
                FROM    aseo.esp_fin_financiacion fnn
                WHERE   fnn.mua_cod=:cod_usuario
                    AND fnn.fin_estado = 't'
                    AND emp_ideregistro =:id_empresa  $complemento                   
                GROUP BY mua_cod " ;
        $res = $this->executeQuery($sql, $parametros);
        if (count($res) == 0) {
            $resultado['cantidad'] = -1 ; 
        }
        else 
        {            
          $resultado= $res[0] ;          
        }
        return $resultado ;
    }
    
    /**
     * Busca la financiacion por Id.
     * @param int $id_financiacion  
     * @return array con la informacion de la financiacion 
     */
    public function getFinanciacionById ($id_financiacion )  {
        $parametros['id_finan'] = $id_financiacion ;
        $sql = "SELECT  * ,
                    (fin_vlrtotal - 
                                (fin_cambio + fin_camtervar + fin_pagbio + fin_pagtervar + fin_pagterfijo + fin_pagajutervar)
                            )  as saldo
                FROM    aseo.esp_fin_financiacion fnn 
                WHERE   fnn.fin_ideregistro =:id_finan 
                    AND fnn.fin_estado = 't' ; ";
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
     * Busca la financiacion por  codigo de usuario y empresa.
     * @param int $id_empresa , $id_usuario  
     * @return array con la informacion de la financiacion 
     */
    public function getFinanciacionUsuario ($id_usuario , $id_empresa )  {
        $parametros['id_usu'] = $id_usuario ;
        $parametros['id_empresa'] = $id_empresa ;
        $sql = "SELECT  * ,
                    (fin_vlrtotal - 
                                (fin_cambio + fin_camtervar + fin_pagbio + fin_pagtervar + fin_pagterfijo + fin_pagajutervar)
                            )  as saldo
                FROM    aseo.esp_fin_financiacion fnn 
                WHERE   fnn.mua_cod =:id_usu
                    AND emp_ideregistro =:id_empresa 
                    AND fnn.fin_estado = 't' 
                    order by fin_fechagb ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado ;
    }
    
    /**
     * 
     * @param type $param
     * @return typeConsulta los saldos de los intereses de la financiacion
     */
    public function getSaldoInteres($param)  {
        
        $parametros['id_usuario'] = $param['idusuario'] ;
        $parametros['id_empresa'] = $param['idempresa'] ;
        $complemento = " " ; 
        
        if ($param['idfin']  > 0 )
        {
           $complemento .= " AND fnn.Fin_ideregistro =:id_finan " ;
            $parametros['id_finan'] = $param['idfin'] ;
        }            
        $sql = "SELECT      SUM(amm.am_vlrinteres - amm.am_paginteres) sdo_interes
                FROM        aseo.esp_am_amortizacion amm 
                INNER JOIN  aseo.esp_fin_financiacion fnn ON fnn.fin_ideregistro = amm.fin_ideregistro
                    AND     fnn.fin_estado = 't' 
                    AND     fnn.emp_ideregistro =:id_empresa
                    AND     fnn.mua_cod =:id_usuario 
                INNER JOIN  aseo.esp_dam_detamortizacion dam ON dam.am_ideregistro = amm.am_ideregistro
                    AND     dam.dam_estado = 't'                    
                WHERE amm.am_sdocuota > 0 $complemento ";        
        $res = $this->executeQuery($sql, $parametros);        
        return $res[0]['sdo_interes'] ;          
    }    
    
    /**
     * Busca la financiacion por Id.
     * @param int $param parametros para la consulta ( id_usuario, id_financiacion , Empresa)  
     * @return array con la informacion de la financiacion 
     */
    public function getAmortizaciones ($param)  {
        $parametros['id_usuario'] = $param['idusuario'] ;
        $parametros['id_empresa'] = $param['idempresa'] ;
        $complemento = " " ; 
        if ($param['idfin']  > 0 )
        {
           $complemento .= " AND fnn.fin_ideregistro =:id_finan " ;
            $parametros['id_finan'] = $param['idfin'] ;
        }        
        $sql = "SELECT 
                     amm.* , dam.lmf_fac as num_factura , fnn.fin_version as num_version
                FROM        aseo.esp_am_amortizacion amm 
                INNER JOIN  aseo.esp_fin_financiacion fnn ON fnn.fin_ideregistro = amm.fin_ideregistro
                    AND     fnn.fin_estado = 't' 
                    AND     fnn.emp_ideregistro =:id_empresa
                    AND     fnn.mua_cod =:id_usuario 
                INNER JOIN  aseo.esp_dam_detamortizacion dam ON dam.am_ideregistro = amm.am_ideregistro
                    AND     dam.dam_estado = 't'                    
                WHERE amm.am_sdocuota > 0 $complemento
                ORDER BY amm.am_fechagb ";        
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
     * Busca la financiacion por Id.
     * @param int $param parametros para la consulta ( id_usuario, id_financiacion , Empresa)  
     * @return array con la informacion de la financiacion 
     */
    public function getSdoAmortizaciones ($param)  {
        $parametros['id_usuario'] = $param['idusuario'] ;
        $parametros['id_empresa'] = $param['idempresa'] ;
        $complemento = " " ; 
        if ($param['idfin']  > 0 )
        {
           $complemento .= " AND fnn.fin_ideregistro =:id_finan " ;
           $parametros['id_finan'] = $param['idfin'] ;
        }        
        $sql = "SELECT  
			mua_cod , 
			ARRAY_AGG (am_ideregistro )::TEXT as id_amortiza , 
			count (*) as cantidad  ,
			SUM ( am_sdocuota) as sdo_cuota,
			SUM (am_vlrbio - am_cambio - am_pagbio ) as sdo_bio, 
			SUM (am_vlrterfij - am_pagterfij ) as sdo_ter_fij ,
			SUM (am_vlrteraju - am_pagteraju ) as sdo_ter_aju ,
			SUM (am_vlrtervar - am_camtervar - am_pagtervar) as sdo_ter_var ,
			SUM (am_vlrinteres - am_paginteres ) as sdo_interes                     
                FROM    aseo.esp_am_amortizacion amm
                    INNER   JOIN aseo.esp_fin_financiacion fnn
                        ON  fnn.fin_ideregistro = amm.fin_ideregistro
                        AND fin_estado = 't' AND fnn.emp_ideregistro =:id_empresa
                        AND fnn.mua_cod =:id_usuario 
                WHERE  amm.am_sdocuota > 0 $complemento
                GROUP BY mua_cod ";        
       $res = $this->executeQuery($sql, $parametros);   
        return $res ;

    }
    
     /**
     * Inserta la información del pago en la base de datos 
     * @param array $pagFinan - Información del pago se adiciona el id del pago
     */
    public function insertarPagoFinanc (array &$pagFinan) {
        $parametros = array();  	        
        $this->setCampo($pagFinan, $parametros, 'id_pago', 'pag_ideregistro');
        $this->setCampo($pagFinan, $parametros, 'finan', 'fin_ideregistro');
        $this->setCampo($pagFinan, $parametros, 'codigo', 'mua_cod');
        $this->setCampo($pagFinan, $parametros, 'factura', 'lmf_fac');
        $this->setCampo($pagFinan, $parametros, 'mesaho', 'pag_mesaho');
        $this->setCampo($pagFinan, $parametros, 'vlrtotal', 'pag_vlrtotal');
        $this->setCampo($pagFinan, $parametros, 'vlrbio', 'pag_vlrbio');
        $this->setCampo($pagFinan, $parametros, 'vlrterfijo', 'pag_vlrterfijo');
        $this->setCampo($pagFinan, $parametros, 'vlrtervar', 'pag_vlrtervar');
        $this->setCampo($pagFinan, $parametros, 'vlrteraju', 'pag_vlrteraju');
        $this->setCampo($pagFinan, $parametros, 'vlrsdo', 'pag_sdo');
        $this->setCampo($pagFinan, $parametros, 'tipopago', 'pag_tipo');
        $this->setCampo($pagFinan, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($pagFinan, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($pagFinan, $parametros, 'sdointeres', 'pag_vlrinteres');
        $idPago = $this->insertar($parametros, 'aseo.esp_pag_pago', 'aseo.sq_esp_pag_ideregistro');                
        $pagFinan['id_pago'] = $idPago;
    } 
    
     /**
     * Inserta la información del pago para la tabla amortizacion en la base de datos 
     * @param array $pagAmortiz - Información del pago se adiciona el id del pago
     */
    public function insertarPagoAmortiz (array &$pagAmortiz) {
        $parametros = array();                 
        $this->setCampo($pagAmortiz, $parametros, 'id_pagamortiz', 'pgam_ideregistro');
        $this->setCampo($pagAmortiz, $parametros, 'idamortiz', 'am_ideregistro');
        $this->setCampo($pagAmortiz, $parametros, 'idpago', 'pag_ideregistro');
        $this->setCampo($pagAmortiz, $parametros, 'vlrtotal', 'pgam_vlrtotal');
        $this->setCampo($pagAmortiz, $parametros, 'vlrbio', 'pgam_vlrbio');
        $this->setCampo($pagAmortiz, $parametros, 'vlrterfij', 'pgam_vlrterfijo');
        $this->setCampo($pagAmortiz, $parametros, 'vlrtervar', 'pgam_vlrtervar');
        $this->setCampo($pagAmortiz, $parametros, 'vlrteraju', 'pgam_vlrteraju');
        $this->setCampo($pagAmortiz, $parametros, 'vlrinteres', 'pgam_vlrinteres');
        $id_pagamortiz = $this->insertar($parametros, 'aseo.esp_pgam_pagamortizacion', 'aseo.sq_esp_pgam_ideregistro');                
        $pagAmortiz['id_pagamortiz'] = null ; //$id_pagamortiz;
        $pagAmortiz['id_pgam'] = $id_pagamortiz;

    }
    
    /**
    * Actualiza informacion de la amortizacion con los valores del pago.
    * @param array $amortizacion con los datos a actualziar
    * @return int Número de registros afectados.
    */
    public function actualizarAmortizacionFinan ($amortizacion) {
        return $this->actualizar($amortizacion, 'aseo.esp_am_amortizacion', 'am_ideregistro = :am_ideregistro');        
    }
    
     /**
     * Busca los pagos de las amortizaciones asociado a un numero de pago
      * y los agrupa por financiacion .
     * @param int $id_pago a consultar  
     * @return array con la informacion de los pagos 
     */
    public function getPagosAmortizFinan ($id_pago , $id_finan )  {
        $parametros['id_pago'] = $id_pago ;
        $parametros['id_fin'] = $id_finan ;
        $sql = "SELECT 
                    pgam.pag_ideregistro ,amm.fin_ideregistro , 
                    sum (COALESCE (pgam.pgam_vlrtotal , 0)) as vlrtotal ,
                    sum (COALESCE (pgam.pgam_vlrbio , 0)) as vlrbio ,
                    sum (COALESCE (pgam.pgam_vlrterfijo , 0)) as vlrterfijo ,
                    sum (COALESCE (pgam.pgam_vlrtervar , 0)) as vlrtervar ,
                    sum (COALESCE (pgam.pgam_vlrteraju , 0)) as vlrteraju, 
                    sum (COALESCE (pgam.pgam_vlrinteres , 0)) as vlrinteres 
                FROM aseo.esp_pgam_pagamortizacion pgam 
                INNER JOIN aseo.esp_am_amortizacion amm ON amm.am_ideregistro = pgam.am_ideregistro
                WHERE pgam.pag_ideregistro=:id_pago  AND amm.fin_ideregistro=:id_fin 
                GROUP BY pgam.pag_ideregistro  , amm.fin_ideregistro ";
        $resultado = $this->executeQuery($sql, $parametros);

        return $resultado ;
    } 
     /**
     * Inserta la información del pago para la tabla de financiacion en la base de datos 
     * @param array $pagAmortiz - Información del pago se adiciona el id del pago
     */
    public function insertarPagoFinan (array &$pagfinanc) {         
        $parametros = array();                 
        $this->setCampo($pagfinanc, $parametros, 'id_pagfinan', 'pfin_ideregistro');
        $this->setCampo($pagfinanc, $parametros, 'id_finan', 'fin_ideregistro');
        $this->setCampo($pagfinanc, $parametros, 'id_pago', 'pag_ideregistro');
        $this->setCampo($pagfinanc, $parametros, 'vlrtotal', 'pfin_vlrtotal');
        $this->setCampo($pagfinanc, $parametros, 'vlrbio', 'pfin_vlrbio');
        $this->setCampo($pagfinanc, $parametros, 'vlrterfijo', 'pfin_vlrterfijo');
        $this->setCampo($pagfinanc, $parametros, 'vlrtervar', 'pfin_vlrtervar');
        $this->setCampo($pagfinanc, $parametros, 'vlrteraju', 'pfin_vlrteraju');
        $this->setCampo($pagfinanc, $parametros, 'tippago', 'pfin_tippago');
        $this->setCampo($pagfinanc, $parametros, 'vlrinteres', 'pfin_vlrinteres');
        $id_pagafin = $this->insertar($parametros, 'aseo.esp_pfin_pagfinanciacion', 'aseo.sq_esp_pfin_ideregistro');                
        $pagfinanc['id_pagfinan'] = null;
        $pagfinanc['id_pgfinan'] = $id_pagafin;
    }
     /**
     * Inserta la información del pago para la tabla de financiacion fruto del abono en la base de datos 
     * @param array $pagAmortiz - Información del pago se adiciona el id del pago
     */
    public function insertarPagoFinanAb (array &$pagfinancAb) {         
        $parametros = array();                 
        $this->setCampo($pagfinancAb, $parametros, 'id_pagfinan', 'pfin_ideregistro');
        $this->setCampo($pagfinancAb, $parametros, 'id_finan', 'fin_ideregistro');
        $this->setCampo($pagfinancAb, $parametros, 'id_pago', 'pag_ideregistro');
        $this->setCampo($pagfinancAb, $parametros, 'vlrtotal', 'pfin_vlrtotal');
        $this->setCampo($pagfinancAb, $parametros, 'vlrbio', 'pfin_vlrbio');
        $this->setCampo($pagfinancAb, $parametros, 'vlrterfijo', 'pfin_vlrterfijo');
        $this->setCampo($pagfinancAb, $parametros, 'vlrtervar', 'pfin_vlrtervar');
        $this->setCampo($pagfinancAb, $parametros, 'vlrteraju', 'pfin_vlrteraju');
        $this->setCampo($pagfinancAb, $parametros, 'tippago', 'pfin_tippago');
        $id_pagafin = $this->insertar($parametros, 'aseo.esp_pfin_pagfinanciacion', 'aseo.sq_esp_pfin_ideregistro');                
        $pagfinancAb['id_pagfin'] = $id_pagafin;
    }
    
    /**
     * Actualiza informacion de la financiacion con los valores del pago.
     * @param array $financiacion con los datos a actualziar
     * @param int $idversion identificador de la version.
     * @return int Número de registros afectados.
     */
    public function actualizarFinanciacion ($financiacion, $idversion) {     
        $condicion = ' fin_ideregistro = :fin_ideregistro and fin_version = '.$idversion. '  ';
        return $this->actualizar($financiacion, 'aseo.esp_fin_financiacion', $condicion );        
    }
    
     /**
     * Busca los pagos de la financiacion
      * y los agrupa por financiacion .
     * @param int $id_pago a consultar  id de la financiacion
     * @return array con la informacion de los pagos 
     */
    public function getPagosFinan ($id_pago , $id_finan )  {
        $parametros['id_pago'] = $id_pago ;
        $parametros['id_fin'] = $id_finan ;
        $sql = "SELECT 
                    pgfn.pag_ideregistro ,pgfn.fin_ideregistro , 
                    sum (COALESCE (pgfn.pfin_vlrtotal , 0)) as vlrtotal ,
                    sum (COALESCE (pgfn.pfin_vlrbio , 0)) as vlrbio ,
                    sum (COALESCE (pgfn.pfin_vlrterfijo , 0)) as vlrterfijo ,
                    sum (COALESCE (pgfn.pfin_vlrtervar , 0)) as vlrtervar ,
                    sum (COALESCE (pgfn.pfin_vlrteraju , 0)) as vlrteraju 
                FROM aseo.esp_pfin_pagfinanciacion pgfn 
                WHERE pgfn.pag_ideregistro =:id_pago  AND pgfn.fin_ideregistro =:id_fin
                GROUP BY pgfn.pag_ideregistro  , pgfn.fin_ideregistro ";
        $resultado = $this->executeQuery($sql, $parametros);

        return $resultado ;
    } 
    
    /**
     * Consulta los detalles de financiacion para cada tercero aprovechador que tenga saldo en algun concepto
     * @param int $id_financiacion  
     * @return array con la informacion de los porcentajes y aprovechadores
     */
    public function getDetAprFinanciacion ($id_financiacion )  {
        $parametros['id_finan'] = $id_financiacion ;

        $sql = "SELECT * 
                FROM aseo.esp_afin_aprfinanciacion afnn 
                WHERE afnn.fin_ideregistro =:id_finan  
                AND (
                        afin_sdovlrfijo > 0 
                    OR  afin_sdovlrvariable > 0 
                    OR  afin_sdovlrajustes > 0 
                ); ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado ;
    }
     /**
     * Consulta si el detalle del tercero ya existe en la tabla de pagos de los aprovechadores
     * @param int $id_afinanciacion  , $id_pago
     * @return int con la cantidad de registros
     */
    public function getCant_RegPagDetAprFinan ($id_afin, $id_pago )  {
        $parametros['id_afin'] = $id_afin ;
        $parametros['id_pago'] = $id_pago ;
        $sql = "SELECT  count (*) as cantidad
                FROM    aseo.esp_pafn_pagaprfinanciacion 
                where   pag_ideregistro = :id_pago 
                and     afin_ideregistro = :id_afin 
                ; ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['cantidad'] ;
    }
     /**
     * Inserta la información del pago para la tabla de afin detalle terceros en la base de datos 
     * @param array $pagAmortiz - Información del pago se adiciona el id del pago
     */
    public function insertarPagoDetFinan (array &$pagdetfinanc) {         
        $parametros = array();                      
        $this->setCampo($pagdetfinanc, $parametros, 'id_pagfinan', 'pafn_ideregistro');
        $this->setCampo($pagdetfinanc, $parametros, 'id_afinan', 'afin_ideregistro');
        $this->setCampo($pagdetfinanc, $parametros, 'id_pago', 'pag_ideregistro');
        $this->setCampo($pagdetfinanc, $parametros, 'sdoinifijo', 'pafn_vlrfijo');
        $this->setCampo($pagdetfinanc, $parametros, 'sdoinivariable', 'pafn_vlrvariable');
        $this->setCampo($pagdetfinanc, $parametros, 'sdoiniajuste', 'pafn_vlrajustes');
        $this->setCampo($pagdetfinanc, $parametros, 'vlrfijo', 'pafn_pagvlrfijo');
        $this->setCampo($pagdetfinanc, $parametros, 'vlrvariable', 'pafn_pagvlrvariable');
        $this->setCampo($pagdetfinanc, $parametros, 'vlrajuste', 'pafn_pagvlrajuste');
        $id_pafin = $this->insertar($parametros, 'aseo.esp_pafn_pagaprfinanciacion', 'aseo.sq_esp_pafn_ideregistro');                
        $pagdetfinanc['id_pafina'] = $id_pafin;
    }
    
     /**
     * Actualiza informacion en el detalle de terceros de la financiacion.
     * @param array $destalle_pago de talle con los datos a actualziar
     * @return int Número de detalles afectados.
     */
    public function actualizarDetTercFinanciacion($destalle_pago) {
        return $this->actualizar($destalle_pago, 'aseo.esp_afin_aprfinanciacion', 'afin_ideregistro = :afin_ideregistro');
    }
    
    /**
     * Actualiza informacion en la tabla temporal, los valores que dependen de la aplicacion.
     * @param array $pagFinan con los datos a actualziar , y $idtabla el id de la tabla temp
     * @return int Número de registros afectados.
     */
    public function actualizarTabTemporalPag ($pagFinan , $idtabla )
    {
        $data['pag_vlrtotal'] = $pagFinan['vlrtotal'];
        $data['pag_vlrbio'] = $pagFinan['vlrbio'];
        $data['pag_vlrterfijo'] = $pagFinan['vlrterfijo'];
        $data['pag_vlrtervar'] = $pagFinan['vlrtervar'];
        $data['pag_vlrteraju'] = $pagFinan['vlrteraju'];
        $data['pag_vlrsdo'] = $pagFinan['vlrsdo'];
        $data['pag_vlrinteres'] = $pagFinan['sdointeres'];
        $data['idregistro'] = $idtabla ;   
        $condicion = 'idregistro = :idregistro' ;
        return $this->actualizar($data, 'aseo.temp_imp_pag_fin_esp', $condicion );        
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
        $sql = "UPDATE aseo.temp_imp_pag_fin_esp SET 
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
                        count(mua_cod) as mua_cod,
                        sum(pag_vlrtotal) as pag_vlrtotal,
                        sum(pag_vlrbio ) as pag_vlrbio,  
                        sum(pag_vlrterfijo) as pag_vlrterfijo ,
                        sum(pag_vlrtervar) as pag_vlrtervar,
                        sum(pag_vlrteraju) as pag_vlrteraju ,
                        sum( pag_vlrsdo) as pag_vlrsdo ,
                        pag_tipopago,
                        mensaje
                FROM    aseo.temp_imp_pag_fin_esp tmp
                WHERE   tmp.estado ='F' 
                        AND tmp.idempresa=:idempresa
		GROUP BY pag_tipopago, mensaje
                ORDER BY mensaje";
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
        $parametros['estados'] = $estados;
        $sql = "SELECT  
                        (CASE 
                            WHEN tmp.pag_tipopago = 'A' THEN 'ABONO'
                            WHEN tmp.pag_tipopago = 'P' THEN 'PAGO'                        
                            Else tmp.pag_tipopago
                        END) tip_pago ,
                        (CASE 
                            WHEN estado = 'A' THEN 'Ok'
                            WHEN estado = 'P' THEN 'Pendiente'                        
                            Else estado
                        END) estado ,               
                        SUM (tmp.pag_vlrtotal) valorregistrosprocesados,
                        SUM (tmp.pag_vlrbio) vlr_bio,
                        SUM (tmp.pag_vlrterfijo) vlr_ter_fijo,
                        SUM (tmp.pag_vlrtervar) vlr_ter_var,
                        SUM (tmp.pag_vlrteraju) vlr_ter_aju,
                        SUM (tmp.pag_vlrinteres) vlr_interes,
                        SUM (tmp.pag_vlrsdo) vlr_sdo ,
                        COUNT (tmp.mua_cod) cantidadregistrosprocesados
                FROM aseo.temp_imp_pag_fin_esp tmp
                WHERE tmp.estado in $estados AND tmp.idempresa=:idempresa
                GROUP BY  estado,  tip_pago 
                ORDER BY estado,  tip_pago  ";
        return $this->executeQuery($sql, $parametros);
    }
    
    /**
     * Consulta la de los registros no cargados por error 
     * @param array con los datos ( empresa )
     * @return array con la informacion consolidada 
     */
    public function getRegistrosErrores($parametros )  {                 
        $sql = "SELECT 
                        mua_cod, lmf_fac , 
                        idfinanciacion , 
                        pag_mesaho , 
                        pag_vlrtotal , 
                        pag_vlrbio , 
                        pag_vlrterfijo, 
                        pag_vlrtervar,
                        pag_vlrteraju  ,
                        pag_tipopago ,
                        mensaje  
                FROM    aseo.temp_imp_pag_fin_esp
                WHERE   estado = 'F'
                    AND idempresa = :id_empresa 
                ORDER BY mensaje ;  " ;
        return $this->executeQuery($sql, $parametros);     
    }
    /**
     * Consulta de los registros de pagos con saldos a Favor 
     * @param array con los datos ( empresa )
     * @return array con la informacion consolidada 
     */
    public function getRegistrosSaldoPago($parametros )  {                 
        $sql = "SELECT 
                    mua_cod , 
                    pag_vlrtotal , 
                    (
                        COALESCE (pag_vlrbio, 0)  
                        + COALESCE (pag_vlrterfijo, 0) 
                        + COALESCE (pag_vlrtervar, 0) 
                        + COALESCE (pag_vlrteraju, 0)
                        + COALESCE (pag_vlrinteres, 0) 
                    ) as aplicado ,
                    pag_sdo, 
                    pag_tipo 
                FROM aseo.esp_pag_pago  
                WHERE emp_ideregistro = :id_empresa 
                    AND usu_ideregistro =:id_usuario 
                    AND (pag_tipo = 'A' OR pag_sdo > 0 )
                    AND Pag_fechagb::date > date_trunc('month', now())::date 
                ORDER BY pag_tipo ; " ;
        return $this->executeQuery($sql, $parametros);     
    }
     
}
