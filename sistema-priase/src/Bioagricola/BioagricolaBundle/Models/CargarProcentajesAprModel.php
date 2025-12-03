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
class CargarProcentajesAprModel extends AuditoriaServices {

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
     * Verifica que la tabla temporal para cargar los procentajes exista
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
     * Crea la tabla temporal para guardar las líneas de porcentajes del archivo que se está procesando
     * @return int
     */
    public function crearTabMasivaPorApr() {
        $this->crearSecuencia("sq_espe_por_apr_tab_tmp");
        $sql = "CREATE TABLE IF NOT EXISTS aseo.temp_imp_por_apr_fin_esp
                (
                    idregistro bigint NOT NULL DEFAULT nextval('aseo.sq_espe_por_apr_tab_tmp'),                 
                    ter_doc character varying(20) ,
                    por_mesaho character varying(6) ,
                    por_fijo numeric(20,7)  ,
                    por_var numeric(20,7)  ,
                    por_ajus numeric(20,7)  ,
                    por_viat numeric(20,7)  ,
                    idproceso integer,
                    estado character(1),
                    idempresa integer,
                    mensaje text,
                    fecha timestamp DEFAULT now(),                  
                    CONSTRAINT temp_imp_por_apr_fin_esp_pkey PRIMARY KEY (idregistro)
               );";
        $resultado = $this->executeQuery($sql);         
        $sqlIndxEstado = "CREATE INDEX ix_temp_imp_por_apr_fin_esp_estado  ON aseo.temp_imp_por_apr_fin_esp USING btree (estado)";
        $this->executeQuery($sqlIndxEstado);
        $sqlIndxEmpresa = "CREATE INDEX ix_temp_imp_por_apr_fin_esp_idempresa  ON aseo.temp_imp_por_apr_fin_esp USING btree (idempresa)";
        $this->executeQuery($sqlIndxEmpresa);
        $sqlIndxIdProceso = "CREATE INDEX ix_temp_imp_por_apr_fin_esp_proceso  ON aseo.temp_imp_por_apr_fin_esp USING btree (idproceso)";
        $this->executeQuery($sqlIndxIdProceso);
        return $resultado;
    }
    
    /**
     * Crea la secuencia para la tabla temporal
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
     * Valida si ya existe un registro de aprovechamiento con los parámetros envíados
     * @param Array $parametros - Información del registro a validar
     * @return type
     */
    public function validarRegistro ($parametros) {
        $sql = "SELECT 
                    papr_ideregistro 
                FROM aseo.esp_papr_porcaprovechamiento papr    
                    INNER JOIN public.ter_tercero trr ON trr.ter_ideregistro = papr.ter_ideregistro
                WHERE papr.papr_mesaho=:por_mesaho 
                    and papr.emp_ideregistro =:idempresa 
                    and trr.ter_documento=:ter_doc ; ";
                 
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return -1;
        }
        return $resultado[0]['papr_ideregistro'];
    }
    
    /**
     * Inserta los registros de porcentajes a cargar en la forma masiva en la base de datos
     * @param string $complemento - Información de las líneas de porcentajes que se guardarán separada por coma
     */
    public function insertarMasiva($complemento) {
        $sql = "INSERT INTO aseo.temp_imp_por_apr_fin_esp ( ter_doc, por_mesaho, por_fijo, por_var, por_ajus, por_viat, idempresa , estado, idproceso) values $complemento";
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
                        WHEN total != terceros  THEN
                                -1
                        WHEN total = 0  THEN
                                -1
                        WHEN (fijo != 1 or  var!= 1 or viat != 1 ) THEN
                                -1
                        WHEN (ajuste != 0 AND  ajuste!= 1 ) THEN
                                -1
                        ELSE 1 
                    END) as id ,
                    (CASE 
                        WHEN total != terceros  THEN
                                'valirdar, Algun tercero no esta creado' 
                        WHEN total = 0  THEN
                                ' No se Cargaron Datos ' 
                        WHEN (fijo != 1 or  var!= 1 or viat != 1 ) THEN
                                ' La Suma de los porcentajes debe dar 1 ' 
                        WHEN (ajuste != 0 AND  var!= 1 or ajuste != 1 ) THEN
                                ' La suma del procentaje de Ajuste debe ser 0 o 1 ' 
                        ELSE '' 
                    END) as mensaje
                FROM 
                (
                    SELECT 
                        count(*) as total, 
                        count(ter_ideregistro) as terceros, 
                        ROUND(sum(COALESCE(por_fijo, 0))) fijo ,
                        ROUND(sum(COALESCE(por_var, 0))) var ,
                        ROUND(sum(COALESCE(por_ajus,0))) ajuste , 
                        ROUND(sum(COALESCE(por_viat,0))) viat
                    FROM aseo.temp_imp_por_apr_fin_esp
                        LEFT JOIN public.ter_tercero ON ter_documento = ter_doc
                    WHERE idempresa = $idEmpresa AND por_mesaho = '$mesaho' AND estado = 'P'
                ) as datos ; ";
        $resul = $this->executeQuery($sql);
        return $resul[0];
    }
    
     /**
     * Elimina los registros temporales que tienen determinado estado
     * @param int $idEmpresa- Id de la empresa actual
     * @param char $estado - Estado del registro que se quiere eliminar
     */
    public function eliminarRegistrosTotales($idEmpresa, $estado) {
        $sql = "delete from aseo.temp_imp_por_apr_fin_esp where estado='$estado' AND idempresa=$idEmpresa";
        $this->executeQuery($sql);
    }
  
    /**
     * Actualiza la información de los registros en la tabla temporal
     * @param int $param - para,etros para la actualizacion (idregistro, estado, mensaje , empresa)
     * @return int
     */
    public function actualizarTemporalResumen($param) {
        $parametros['estado'] =  $param['estado'] ;
        $parametros['idregistro'] = $param['id_registro'] ;
        $parametros['mensaje'] =  $param['mensaje'] ;
        $parametros['empresa'] =  $param['empresa'] ;
        $sql = "UPDATE aseo.temp_imp_por_apr_fin_esp SET 
                    estado = :estado,
                    mensaje =:mensaje
                WHERE   idempresa=:empresa
                    AND estado='P' ;";
        return $this->executeQuery($sql, $parametros);
    }
    
     /**
     * Cosulta el resultado del proceso agrupado por empresa
     * @param int $idEmpresa - Id de la empresa actual
     * @param char $estado - Estado del que se quiere consultar (Correctos A, Con inconveniente F)
     * @return array - Listado con cantidad de registros afectados y sumas de valores
     */
    public function consultarResumen($idEmpresa, $estados) {
        $parametros['idempresa'] = $idEmpresa;
        //$parametros['estados'] = $estados;
        $sql = "SELECT 
                    por_mesaho mes,                   
                    (CASE 
                        WHEN estado = 'A' THEN 'Ok'
                        WHEN estado = 'P' THEN 'Pendiente'                        
                        Else estado
                    END) estado , 
                    SUM (por_fijo) fijo,
                    SUM (por_var) variable  ,
                    SUM (por_ajus) ajuste ,
                    SUM (por_viat) viat ,                   
                    COUNT (tmp.ter_doc) cantidadregistrosprocesados
                FROM aseo.temp_imp_por_apr_fin_esp tmp
                WHERE tmp.estado in $estados AND tmp.idempresa=:idempresa
                GROUP BY  estado,  mes 
                ORDER BY estado, mes ";
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
                    ter_doc,
                    por_mesaho,
                    por_fijo,
                    por_var,
                    por_ajus,
                    por_viat,
                    mensaje
                FROM    aseo.temp_imp_por_apr_fin_esp tmp
                WHERE   tmp.estado ='F' 
                    AND tmp.idempresa=:idempresa ";
        return $this->executeQuery($sql, $parametros);
    } 
  
     /**
     * Obtiene los registros que se procesarán según el estado
     * @param int $idEmpresa - Empresa actual   
     * @return Array - Listado de registros
     */
    public function getRegistrosProcesar($idEmpresa , $idHilo) {
        $parametros['idempresa'] = $idEmpresa;   
        $parametros['idhilo'] = $idHilo;
        $sql = "SELECT            
                    tbl.idregistro ,                 
                    tbl.ter_doc , 
                    tbl.por_mesaho , 
                    tbl.por_fijo,
                    tbl.por_var,
                    tbl.por_ajus,
                    tbl.por_viat,
                    tbl.idproceso,
                    estado,
                    tbl.idempresa ,
                    trr.ter_ideregistro 
                FROM aseo.temp_imp_por_apr_fin_esp tbl
                    INNER JOIN public.ter_tercero trr ON trr.ter_documento = tbl.ter_doc       
                WHERE
                    idempresa = :idempresa   
                    AND idproceso = :idhilo
                    AND estado = 'P' ; ";
        return $this->executeQuery($sql, $parametros);
    }
    
     /**
     * Consulta los terceros aprovechadores para el mes y empresa.
     * @param array $param con los datos para a consulta id_empresa , mesaho  
     * @return array con la informacion de los porcentajes y aprovechadores
     */
    public function getPorcAprovechadoresMes($param )  {
        $parametros['mes_aho'] = $param['mesaho'] ;
        $parametros['id_empresa'] = $param['idempresa'] ;

        $sql = "SELECT trr.ter_nomcompleto nombre , tap.* 
                FROM aseo.esp_papr_porcaprovechamiento tap
                    INNER JOIN public.ter_tercero trr ON trr.ter_ideregistro = tap.ter_ideregistro       
                WHERE papr_mesaho =:mes_aho 
                and emp_ideregistro =:id_empresa";
        $res = $this->executeQuery($sql, $parametros);
        return $res ;
    }
    
    /**
     * Inserta el porcentaje de los terceros de aprovechamiento y viat
     * @param array $porAprFinan - Registro de porcentajes de aprovechamiento 
     */
    public function insertarPorAprFinanciacion(array &$porAprFinan) {
        print_r("\n Inserta porcentaje Aprovechamiento :");
        print_r($porAprFinan);
        $parametros = array();
        $this->setCampo($porAprFinan, $parametros, 'idporapr', 'papr_ideregistro');
        $this->setCampo($porAprFinan, $parametros, 'idtercero', 'ter_ideregistro');
        $this->setCampo($porAprFinan, $parametros, 'mesaho', 'papr_mesaho');
        $this->setCampo($porAprFinan, $parametros, 'fijo', 'papr_porfijo');
        $this->setCampo($porAprFinan, $parametros, 'variable', 'papr_porvariable');
        $this->setCampo($porAprFinan, $parametros, 'ajuste', 'papr_porajuste');        
        $this->setCampo($porAprFinan, $parametros, 'viat', 'papr_porviat');
        $this->setCampo($porAprFinan, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($porAprFinan, $parametros, 'idusuario', 'usu_ideregistro');        
        $idporapr = $this->insertar($parametros, 'aseo.esp_papr_porcaprovechamiento', 'aseo.sq_esp_papr_ideregistro');
        $porAprFinan['idporapr'] = $idporapr;
    }  

    
}
