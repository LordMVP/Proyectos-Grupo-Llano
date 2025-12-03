<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Models\GenericoModel;

/**
 * Consultas genericas del sistema.
 *
 * @author json
 */

class CargarEstratoCatastralModel extends AuditoriaServices {

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;

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
    public function __construct(&$conexion, &$sesion) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
        $this->genericoModel = new GenericoModel($conexion);
    }
    
    public function verificaEmpresaSuscripcion($idEmpresa){
        $sql = "SELECT count(*) cantidad from temp_estratocatastral tmp
                inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=tmp.dsus_ideregistr
                where dsus.emp_ideregistro <> $idEmpresa and tmp.emp_ideregistro=$idEmpresa;";
        $resultado = $this->executeQuery($sql);
        if ($resultado[0]['cantidad']>0){         
            try {    
                $sql = "update temp_estratocatastral tmp
                        set temp_comentario= temp_comentario || 'Error Empresa;'
                        from dsus_detsuscrip dsus  
                        where dsus.dsus_ideregistr=tmp.dsus_ideregistr and dsus.emp_ideregistro <> $idEmpresa and tmp.emp_ideregistro=$idEmpresa;"; 
                 $this->executeQuery($sql);
                } catch (\Exception $ex) {
                print_r($ex);
                throw new MyException('Error Actualizando datos de la tabla temporal (temp_estratocatastral)', -1);           
                }
        }
        return $resultado[0]['cantidad'];       
    }   
    
    public function verificaEmpresaNumcatastral($idEmpresa){
        $sql = "SELECT count(*) cantidad from temp_estratocatastral tmp
                inner join pro_propiedad pro on tmp.pro_numcatastral=pro.pro_numcatastral
                inner join dsus_detsuscrip dsus on dsus.pro_ideregistro=pro.pro_ideregistro	
                left join (SELECT proemp.pro_numcatastral, count(proemp.pro_ideregistro) canempresa 
							from pro_propiedad proemp
							inner join dsus_detsuscrip dsusemp on proemp.pro_ideregistro=dsusemp.pro_ideregistro
							where dsusemp.emp_ideregistro = $idEmpresa 
							GROUP BY  proemp.pro_numcatastral) propiedad on propiedad.pro_numcatastral=tmp.pro_numcatastral
                where dsus.emp_ideregistro <> $idEmpresa and propiedad.canempresa is null and tmp.emp_ideregistro=$idEmpresa;";
        $resultado = $this->executeQuery($sql);
        if ($resultado[0]['cantidad']>0){         
            try {    
                $sql = "update temp_estratocatastral tmp
                        set temp_comentario = tmp.temp_comentario || 'Empresa Errada;'
                        from temp_estratocatastral tmp2
                        inner join pro_propiedad pro on tmp2.pro_numcatastral=pro.pro_numcatastral
                        inner join dsus_detsuscrip dsus on dsus.pro_ideregistro=pro.pro_ideregistro	
                        left join (SELECT proemp.pro_numcatastral, count(proemp.pro_ideregistro) canempresa 
                                    from pro_propiedad proemp
                                    inner join dsus_detsuscrip dsusemp on proemp.pro_ideregistro=dsusemp.pro_ideregistro
                                    where dsusemp.emp_ideregistro = $idEmpresa 
                                    GROUP BY  proemp.pro_numcatastral) propiedad on propiedad.pro_numcatastral=tmp2.pro_numcatastral
                        where dsus.emp_ideregistro <> $idEmpresa and propiedad.canempresa is null and tmp2.tempestcat_ideregistr=tmp.tempestcat_ideregistr and tmp.emp_ideregistro=$idEmpresa;"; 
                 $this->executeQuery($sql);
                } catch (\Exception $ex) {
                print_r($ex);
                throw new MyException('Error Actualizando datos de la tabla temporal (temp_estratocatastral)', -1);           
                }
        }
        return $resultado[0]['cantidad'];       
    } 
    
    public function verificaEstadoSuscripcionXid($idEmpresa){
        $sql = "SELECT count(*) cantidad from temp_estratocatastral tmp
                    inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=tmp.dsus_ideregistr
                where dsus.dsus_estado='E' and dsus.emp_ideregistro=$idEmpresa and tmp.emp_ideregistro=$idEmpresa;";
        $resultado = $this->executeQuery($sql);
        if ($resultado[0]['cantidad']>0){         
            try {    
                $sql = "update temp_estratocatastral tmp
                            set temp_comentario = tmp.temp_comentario || 'EstadoSuscripcionEliminada'
                        from dsus_detsuscrip dsus 
                        where dsus.dsus_ideregistr=tmp.dsus_ideregistr and dsus.emp_ideregistro=$idEmpresa and dsus.dsus_estado='E' and tmp.emp_ideregistro=$idEmpresa;"; 
                 $this->executeQuery($sql);
                } catch (\Exception $ex) {
                print_r($ex);
                throw new MyException('Error Actualizando datos de la tabla temporal (temp_estratocatastral)', -1);           
                }
        }
        return $resultado[0]['cantidad'];       
    }
    
    public function verificaEstadoSuscripcionXnumcatastral($idEmpresa){
        $sql = "SELECT count(*) cantidad from temp_estratocatastral tmp
                    inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=tmp.dsus_ideregistr
                where dsus.dsus_estado='E' and dsus.emp_ideregistro=$idEmpresa and tmp.emp_ideregistro=$idEmpresa;";
        $resultado = $this->executeQuery($sql);
        if ($resultado[0]['cantidad']>0){         
            try {    
                $sql = "update temp_estratocatastral tmp
                            set temp_comentario = tmp.temp_comentario || 'EstadoSuscripcionEliminada'
                        from dsus_detsuscrip dsus 
                        where dsus.dsus_ideregistr=tmp.dsus_ideregistr and dsus.emp_ideregistro=$idEmpresa and dsus.dsus_estado='E' and tmp.emp_ideregistro=$idEmpresa;"; 
                 $this->executeQuery($sql);
                } catch (\Exception $ex) {
                print_r($ex);
                throw new MyException('Error Actualizando datos de la tabla temporal (temp_estratocatastral)', -1);           
                }
        }
        return $resultado[0]['cantidad'];       
    }
    public function verificaSuscripcionesRepetidas($idEmpresa){
        try {    
                $sql = "SELECT count(*) cantidad
                            from temp_estratocatastral tmp
                            where tmp.emp_ideregistro = $idEmpresa 
                        GROUP BY tmp.dsus_ideregistr
                        HAVING count(*) > 1;";
                $resultado = $this->executeQuery($sql);
                if(!empty($resultado)){
                    if ($resultado[0]['cantidad']>0){         
                            $sql = "update temp_estratocatastral tmp
                                        set temp_comentario = tmp.temp_comentario || 'SuscripcionDuplicada'
                                        where tmp.emp_ideregistro = $idEmpresa 
                                        and tmp.dsus_ideregistr in (SELECT tmp2.dsus_ideregistr 
                                                                        from temp_estratocatastral tmp2
                                                                        where tmp2.emp_ideregistro = $idEmpresa 
                                                                    GROUP BY tmp2.dsus_ideregistr
                                                                    HAVING count(*) > 1);"; 
                             $this->executeQuery($sql);
                     }
                return $resultado[0]['cantidad'];       
                }
        } catch (\Exception $ex) {
             print_r($ex);
         throw new MyException('Error Actualizando datos de la tabla temporal (temp_estratocatastral)', -1);           
        }

    } 
    
    public function verificaNumcatastralesRepetidos($idEmpresa){
        $sql = "SELECT count(*) cantidad
                    from temp_estratocatastral tmp
                    where tmp.emp_ideregistro = $idEmpresa 
                GROUP BY tmp.pro_numcatastral
                HAVING count(*) > 1;";
        $resultado = $this->executeQuery($sql);
        if (!empty($resultado)){

            if ($resultado[0]['cantidad']>0){         
            try {    
                $sql = "update temp_estratocatastral tmp
                            set temp_comentario = tmp.temp_comentario || 'NumCatastralDuplicada'
                            where tmp.emp_ideregistro = $idEmpresa 
                            and tmp.pro_numcatastral in (SELECT tmp2.pro_numcatastral 
                                                            from temp_estratocatastral tmp2
                                                            where tmp2.emp_ideregistro = $idEmpresa 
                                                        GROUP BY tmp2.pro_numcatastral
                                                        HAVING count(*) > 1);"; 
                 $this->executeQuery($sql);
                } catch (\Exception $ex) {
                print_r($ex);
                throw new MyException('Error Actualizando datos de la tabla temporal (temp_estratocatastral)', -1);           
                }
            }
        return $resultado[0]['cantidad'];                      
        }
    }
    
    public function verificaCantidadDigitosNumcatastral($idEmpresa,$tipo,$cantDigitos=15){
        $sql = "SELECT count(*) cantidad
                from temp_estratocatastral tmp
                where tmp.emp_ideregistro = $idEmpresa and  
                ((length(tmp.temp_numcatastralnew)<>$cantDigitos and coalesce(tmp.temp_numcatastralnew,'')<>'') or 
                 (length(tmp.temp_proresolcatastralnew)<>$cantDigitos*2 and coalesce(tmp.temp_proresolcatastralnew,'') <>''))  ;";
        $resultado = $this->executeQuery($sql);
        if ($resultado[0]['cantidad']>0){         
            try {    
                $sql = "update  temp_estratocatastral tmp
                            set temp_comentario = temp_comentario || ';canDigitosCatastral'
                    where tmp.emp_ideregistro = $idEmpresa and  
                ((length(tmp.temp_numcatastralnew)<>$cantDigitos and coalesce(tmp.temp_numcatastralnew,'')<>'') or 
                 (length(tmp.temp_proresolcatastralnew)<>$cantDigitos*2 and coalesce(tmp.temp_proresolcatastralnew,'') <>'')) ;"; 
                 $this->executeQuery($sql);
                } catch (\Exception $ex) {
                print_r($ex);
                throw new MyException('Error Actualizando datos de la tabla temporal (temp_estratocatastral)', -1);           
                }
        }
        return $resultado[0]['cantidad'];       
    }
    
    public function verificaPropiedadesNumcatastral($idEmpresa){
       // evalua si la propiedad esta vinculada a suscripiones de la empresa que esta actuaiizando
        $sql = "SELECT count(*) cantidad
                from temp_estratocatastral tmp
                inner join pro_propiedad pro on pro.pro_numcatastral=tmp.pro_numcatastral
                inner join dsus_detsuscrip dsus on dsus.pro_ideregistro=pro.pro_ideregistro	 
                left join (SELECT proter.pro_numcatastral,count(proter.ter_ideregistro) cantercero
							from pro_propiedad proter
							inner join dsus_detsuscrip dsuster on proter.pro_ideregistro=dsuster.pro_ideregistro
							where dsuster.emp_ideregistro=$idEmpresa 
							GROUP BY  proter.pro_numcatastral
							HAVING count(proter.ter_ideregistro) > 1) propiedadter on propiedadter.pro_numcatastral=tmp.pro_numcatastral 
                where dsus.emp_ideregistro = $idEmpresa and propiedadter.cantercero>1 and tmp.temp_comentario=' '  and tmp.emp_ideregistro=$idEmpresa;";
        $resultado = $this->executeQuery($sql);
        if ($resultado[0]['cantidad']>0){         
            try {    
                $sql = "update  temp_estratocatastral tmp
                            set temp_comentario = temp_comentario || ';;variosTerceros'
                        where tmp.emp_ideregistro = $idEmpresa and  
                        tmp.tempestcat_ideregistr in (SELECT tmp.tempestcat_ideregistr
                                                        from temp_estratocatastral tmp
                                                        inner join pro_propiedad pro on pro.pro_numcatastral=tmp.pro_numcatastral
                                                        inner join dsus_detsuscrip dsus on dsus.pro_ideregistro=pro.pro_ideregistro	 
                                                        left join (SELECT proter.pro_numcatastral,count(proter.ter_ideregistro) cantercero
                                                                    from pro_propiedad proter
                                                                    inner join dsus_detsuscrip dsuster on proter.pro_ideregistro=dsuster.pro_ideregistro
                                                                    where dsuster.emp_ideregistro=$idEmpresa 
                                                                    GROUP BY  proter.pro_numcatastral
                                                                    HAVING count(proter.ter_ideregistro) > 1) propiedadter on propiedadter.pro_numcatastral=tmp.pro_numcatastral 
                                                        where dsus.emp_ideregistro = $idEmpresa and propiedadter.cantercero>1 and tmp.temp_comentario=' ' and tmp.emp_ideregistro=$idEmpresa );"; 
                 $this->executeQuery($sql);
                } catch (\Exception $ex) {
                print_r($ex);
                throw new MyException('Error Actualizando datos de la tabla temporal (temp_estratocatastral)', -1);           
                }
        }
        return $resultado[0]['cantidad'];       
    }
    
    public function verificaPropiedadesNumcatastralNew($idEmpresa){
       // evalua si la propiedad esta vinculada a suscripiones de la empresa que esta actuaiizando
        $sql = "SELECT count(*) cantidad
                from temp_estratocatastral tmp
                    inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=tmp.dsus_ideregistr
                    inner join pro_propiedad pro on pro.pro_ideregistro=dsus.pro_ideregistro
                    inner join (SELECT proter.pro_numcatastral,proter.ter_ideregistro 
                                from pro_propiedad proter
                                    inner join dsus_detsuscrip dsuster on proter.pro_ideregistro=dsuster.pro_ideregistro
                                    where dsuster.emp_ideregistro=$idEmpresa) propiedadter on propiedadter.pro_numcatastral=tmp.temp_numcatastralnew and
                                    propiedadter.ter_ideregistro <> pro.ter_ideregistro         
               where dsus.emp_ideregistro = $idEmpresa  and tmp.temp_comentario=' '  and tmp.emp_ideregistro=$idEmpresa;";
        $resultado = $this->executeQuery($sql);
        if ($resultado[0]['cantidad']>0){         
            try {    
                $sql = "update  temp_estratocatastral tmp
                            set temp_comentario = temp_comentario || ';;NumCatastralExiste'
                        where tmp.emp_ideregistro = $idEmpresa and  
                        tmp.tempestcat_ideregistr in (SELECT tmp.tempestcat_ideregistr
                                                        from temp_estratocatastral tmp
                                                            inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=tmp.dsus_ideregistr
                                                            inner join pro_propiedad pro on pro.pro_ideregistro=dsus.pro_ideregistro
                                                            inner join (SELECT proter.pro_numcatastral,proter.ter_ideregistro 
                                                                        from pro_propiedad proter
                                                                            inner join dsus_detsuscrip dsuster on proter.pro_ideregistro=dsuster.pro_ideregistro
                                                                            where dsuster.emp_ideregistro=$idEmpresa) propiedadter on propiedadter.pro_numcatastral=tmp.temp_numcatastralnew and
                                                                            propiedadter.ter_ideregistro <> pro.ter_ideregistro         
                                                    where dsus.emp_ideregistro = $idEmpresa  and tmp.temp_comentario=' ' and tmp.emp_ideregistro=$idEmpresa);"; 
                 $this->executeQuery($sql);
                } catch (\Exception $ex) {
                print_r($ex);
                throw new MyException('Error Actualizando datos de la tabla temporal (temp_estratocatastral)', -1);           
                }
        }
        return $resultado[0]['cantidad'];       
    }
    
    
    public function existeTablaTemporalEstratoCatastral() {
         
        $sql = "SELECT count(*) cantidadtablas
                FROM  information_schema.TABLES
                WHERE TABLE_NAME = 'temp_estratocatastral';";
        $resultado = $this->executeQuery($sql);
        return $resultado[0]['cantidadtablas'];
    }
    
    public function  vaciarTablaTemporalEstratoCatastral($idEmpresa){
        try {
            $sql = "DELETE FROM temp_estratocatastral  where emp_ideregistro =  $idEmpresa" ;
            
            $this->executeQuery($sql);
        } catch (\Exception $ex) {
            print_r($ex);
            throw new MyException('Error eliminando datos de la tabla temporal (temp_estratocatastral)', -1);
            
        }
        
    }
    
    public function crearTablaTemporalEstratoCatastral() {
        $sql="CREATE TABLE temp_estratocatastral
                (
                  tempestcat_ideregistr bigint DEFAULT nextval('sq_tempestcat_ideregistr') NOT NULL,
                  dsus_ideregistr bigint ,
                  pro_numcatastral character varying(50)  DEFAULT ' ',
                  temp_numcatastralnew character varying(50)  DEFAULT ' ',
                  temp_procatestratonew smallint ,
                  temp_resolucion character varying(50) NOT NULL,
                  emp_ideregistro integer NOT NULL,
                  usu_ideregistro integer NOT NULL,
                  temp_fecha timestamp(6) without time zone NOT NULL,
                  temp_comentario varchar (150) DEFAULT ' ',
                  temp_idenit character varying(20),
                  CONSTRAINT pk_tempestcat_ideregistr PRIMARY KEY (tempestcat_ideregistr))
                  ";
        $this->executeQuery($sql);
         $sqlIndxIdsuscripcion = 'CREATE INDEX "ix_tempdsus_ideregistr"  ON temp_estratocatastral USING btree  (dsus_ideregistr)';
        $this->executeQuery($sqlIndxIdsuscripcion);               
        $sqlIndxIdEmpresa = 'CREATE INDEX "ix_tempemp_ideregistro"  ON temp_estratocatastral  USING btree  (emp_ideregistro)';
        $this->executeQuery($sqlIndxIdEmpresa);        
        $sqlIndxIdUsuario = 'CREATE INDEX "ix_tempusu_ideregistro"  ON temp_estratocatastral  USING btree  (usu_ideregistro)';
        $this->executeQuery($sqlIndxIdUsuario);
        $sqlIndxComentario = 'CREATE INDEX "ix_temp_comentario"  ON temp_estratocatastral  USING btree  (temp_comentario)';
        $this->executeQuery($sqlIndxComentario);
        $sqlChekEstrato = 'ALTER TABLE temp_estratocatastral
                            ADD CONSTRAINT ck_temp_procatestratonew CHECK (temp_procatestratonew>0 and temp_procatestratonew<=6)';
        $this->executeQuery($sqlChekEstrato);
    }
  
    public function insertarEstratoCatastral(array $registro,$resolucion) {
      // print_r($registro);
        $parametros = array();
        $this->setCampo($registro, $parametros, 'idsuscripcion', 'dsus_ideregistr');
        $this->setCampo($registro, $parametros, 'numcatastral', 'pro_numcatastral');
        $this->setCampo($registro, $parametros, 'numcatastralnew', 'temp_numcatastralnew');
        $this->setCampo($registro, $parametros, 'estratonew', 'temp_procatestratonew');

        $this->setCampo($registro, $parametros, 'proresolcatastralnew', 'temp_proresolcatastralnew');
        $this->setCampo($registro, $parametros, 'prodireccionnew', 'temp_prodireccionnew');
        $this->setCampo($registro, $parametros, 'proidepropiedadnew', 'temp_proidepropiedadnew');
        $this->setCampo($registro, $parametros, 'prodigitosnew', 'temp_prodigitosnew');
        $this->setCampo($registro, $parametros, 'ternombrenew', 'temp_ternombrenew');
        $this->setCampo($registro, $parametros, 'terapellidonew', 'temp_terapellidonew');
        $this->setCampo($registro, $parametros, 'proaltriesgonew', 'temp_proaltriesgonew');
        $this->setCampo($registro, $parametros, 'prozonanew', 'temp_prozonanew');
        $this->setCampo($registro, $parametros, 'temp_resolucion', 'temp_resolucion');
        $this->setCampo($registro, $parametros, 'temp_idenit', 'temp_idenit');

        //$parametros['temp_resolucion'] = $resolucion ;
        $parametros['emp_ideregistro'] = $this->sesion->get('idempresa');
        $parametros['usu_ideregistro'] = $this->sesion->get('idusuario');
        $parametros['temp_fecha'] = 'now()';
        return $this->insertar($parametros, 'temp_estratocatastral', 'sq_tempestcat_ideregistr');
    }
    
    public function leerRegistrosTablaTemporal($idempresa,$tipo) {
	        
        if ($tipo=='Catastral'){ 
        $sql = "SELECT distinct 
                        tmp.pro_numcatastral pro_numcatastral,
                        tmp.temp_numcatastralnew temp_numcatastralnew,
                        tmp.temp_procatestratonew temp_procatestratonew,
                        tmp.temp_proresolcatastralnew temp_proresolcatastralnew,
                        tmp.temp_prodireccionnew temp_prodireccionnew,
                        tmp.temp_proidepropiedadnew temp_proidepropiedadnew,
                        tmp.temp_prodigitosnew temp_prodigitosnew,
                        tmp.temp_ternombrenew temp_ternombrenew,
                        tmp.temp_terapellidonew temp_terapellidonew,
                        upper(tmp.temp_proaltriesgonew) temp_proaltriesgonew,
                        upper(tmp.temp_prozonanew) temp_prozonanew,
                        dsus.pro_ideregistro idpropiedad,
                        dsus.ter_ideregistro idtercero,
			tmp.dsus_ideregistr idsuscripcion,
                        tmp.temp_resolucion temp_resolucion,
                        tmp.temp_idenit temp_idenit
		from temp_estratocatastral tmp
                    inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=tmp.dsus_ideregistr 
                where dsus.emp_ideregistro = $idempresa  and tmp.temp_comentario=' '  
                      and tmp.emp_ideregistro=$idempresa ";
        } 
       /* if ($tipo=='Estratificacion'){ 
         $sql = "SELECT distinct dsus.dsus_ideregistr idsuscripcion,
			 tmp.temp_procatestratonew procatestratonew,
			 tmp.temp_resolucion resolucion
                from temp_estratocatastral tmp
                        inner join pro_propiedad pro on pro.pro_numcatastral=tmp.pro_numcatastral
                        inner join dsus_detsuscrip dsus on dsus.pro_ideregistro=pro.pro_ideregistro	 
                where dsus.emp_ideregistro = $idempresa  and tmp.temp_comentario=' ' 
                        and tmp.emp_ideregistro=$idempresa";
        }*/
        return $this->executeQuery($sql);
    }    
    
    public function consultarRegistrosTablaTemporal($idempresa) {
        $sql = "SELECT row_number() over () consecutivo, tmp.dsus_ideregistr idsuscripcion, tmp.pro_numcatastral numcatastral,
                tmp.temp_resolucion resolucion , tmp.emp_ideregistro empresa, 
                (case when tmp.temp_comentario=' ' then 'Ok' else tmp.temp_comentario end) descripcion 
                    from temp_estratocatastral tmp 
                where tmp.emp_ideregistro=$idempresa";
        return $this->executeQuery($sql);
    } 
    
    
  public function actualizarPropiedadNumcatastral($datos){
        try{
            // Actualizacion de datos de la Propiedad
            $parametros = array();
            $parametros['pro_ideregistro'] = $datos['idpropiedad'] ;
            if (!empty($datos['temp_numcatastralnew'])){
                $parametros['pro_numcatastral'] = $datos['temp_numcatastralnew'] ;
            }                  
            if (!empty($datos['temp_proresolcatastralnew'])){
                $parametros['pro_numcatastralnacional'] = $datos['temp_proresolcatastralnew'] ;
            }
            if (!empty($datos['temp_prodireccionnew'])){
                $parametros['pro_direccion'] = $datos['temp_prodireccionnew'] ;
            }       
            if (!empty($datos['temp_proidepropiedadnew']) && ($datos['temp_proidepropiedadnew'])!==' '){
                $parametros['pro_idepropieda'] = $datos['temp_proidepropiedadnew'] ;
            }
            if (!empty($datos['temp_prodigitosnew'])){
                $parametros['pro_digitos'] = $datos['temp_prodigitosnew'] ;
            }	
            if (!empty($datos['temp_proaltriesgonew'])){
                $parametros['pro_altriesgo'] = $datos['temp_proaltriesgonew'] ;
            }	
            if (!empty($datos['temp_prozonanew'])){
                $parametros['pro_zona'] = $datos['temp_prozonanew'] ;
            }	
            $parametros['pro_resolcatastral'] = $datos['temp_resolucion'] ;
            $this->actualizar($parametros,'pro_propiedad' , 'pro_ideregistro = :pro_ideregistro'); 
 
            // Actualizacion de datos del Tercero            
            $parametros = array();         
            if (!empty($datos['temp_ternombrenew']) && !empty($datos['temp_terapellidonew'])){
                $parametros['ter_nombre'] = $datos['temp_ternombrenew'] ;
                $parametros['ter_apellido'] = $datos['temp_terapellidonew'] ;
                $parametros['ter_nomcompleto'] = $datos['temp_ternombrenew']." ".$datos['temp_terapellidonew'] ;
                
                $parametros['ter_ideregistro'] = $datos['idtercero'] ;
                $this->actualizar($parametros,'ter_tercero' , 'ter_ideregistro = :ter_ideregistro'); 
            }
            
            // Actualizacion de datos de la suscripcion
            $parametros = array();
            $parametros['dsus_ideregistr'] = $datos['idsuscripcion'] ;
            if (!empty($datos['temp_procatestratonew'])){
                $parametros['pro_catestrato'] = $datos['temp_procatestratonew'] ;
            
                $this->actualizar($parametros,'dsus_detsuscrip' , 'dsus_ideregistr = :dsus_ideregistr'); 
            }          
            
        } catch (Exception $ex) {
            return (1);
        }        
        return (0) ;
    }
        
    public function actualizarSuscripcionEstrato($datos){
        try{
            $parametros = array();
            $parametros['dsus_ideregistr'] = $datos['idsuscripcion'];
            $parametros['pro_catestrato'] = $datos['procatestratonew'] ;
            $parametros['dsus_resolestrato'] = $datos['resolucion'] ;
            $this->actualizar($parametros,'dsus_detsuscrip' , 'dsus_ideregistr = :dsus_ideregistr');     
        } catch (Exception $ex) {
           return (1) ;
        }
        return (0);

    }
    
    public function verificaIdeNit($idEmpresa){
        try {    
                $sql = "SELECT count(*) cantidad
                            from temp_estratocatastral tmp
                            where tmp.temp_idenit is not null";
                $resultado = $this->executeQuery($sql);
                return $resultado[0];
        } catch (\Exception $ex) {
             print_r($ex);
         throw new MyException('Error Actualizando datos de la tabla temporal (temp_estratocatastral)', -1);           
        }

    } 
    
    public function insertarTerceros($tempNit) {
      // print_r($registro);
        $parametros = array();
        $parametros['ter_documento'] = $tempNit['temp_idenit'];
        $parametros['ter_nombre'] = $tempNit['temp_ternombrenew'];
        $parametros['ter_apellido'] = $tempNit['temp_terapellidonew'];
        $parametros['ter_nomcompleto'] = $tempNit['temp_ternombrenew'] . ' ' . $tempNit['temp_terapellidonew'];
        $parametros['uni_tipidentifica'] = 1048;
        $parametros['ter_sexo'] = 'N';
        $parametros['ter_telcelular'] = '.';
        $parametros['ter_telfijo'] = '.';
        $parametros['est_tiptercero'] = 5;
        $parametros['uni_tiptercero'] = 18;
        $parametros['usu_ideregistro'] = $this->sesion->get('idusuario');
        return $this->insertar($parametros, 'ter_tercero', 'sq_ter_ideregistro');
    }
    
    
       public function leerRegistrosTablaTemporalTerceros($idempresa,$tipo) {
	        
        if ($tipo=='Catastral'){ 
        $sql = "SELECT distinct 
                        tmp.pro_numcatastral pro_numcatastral,
                        tmp.temp_numcatastralnew temp_numcatastralnew,
                        tmp.temp_procatestratonew temp_procatestratonew,
                        tmp.temp_proresolcatastralnew temp_proresolcatastralnew,
                        tmp.temp_prodireccionnew temp_prodireccionnew,
                        tmp.temp_proidepropiedadnew temp_proidepropiedadnew,
                        tmp.temp_prodigitosnew temp_prodigitosnew,
                        tmp.temp_ternombrenew temp_ternombrenew,
                        tmp.temp_terapellidonew temp_terapellidonew,
                        upper(tmp.temp_proaltriesgonew) temp_proaltriesgonew,
                        upper(tmp.temp_prozonanew) temp_prozonanew,
                        dsus.ter_ideregistro idtercero,
                        tmp.temp_resolucion temp_resolucion,
                        tmp.temp_idenit temp_idenit
		from temp_estratocatastral tmp
                    inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=tmp.dsus_ideregistr 
                where dsus.emp_ideregistro = $idempresa  and tmp.temp_comentario=' '  
                      and tmp.emp_ideregistro=$idempresa and tmp.temp_idenit not in (select ter_documento from ter_tercero)";
        } 
      
        return $this->executeQuery($sql);
    } 
    
    
}
