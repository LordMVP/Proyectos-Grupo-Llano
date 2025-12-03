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
class CargarFactorCorreccionModel extends AuditoriaServices {

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;
    private $idempresa;
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
        $this->idempresa = $sesion->get('idempresa');
        $this->genericoModel = new GenericoModel($conexion);
    }

    public function insertarFactor(array $registro) {
        $parametros = array();
        $this->setCampo($registro, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($registro, $parametros, 'idmunicipio', 'uni_municipio');
        $this->setCampo($registro, $parametros, 'idbarrio', 'uni_barrio');
        $this->setCampo($registro, $parametros, 'idsuscripcion', 'dsus_ideregistr');
        $this->setCampo($registro, $parametros, 'factorcorreccion', 'hfat_factor');
        $this->setCampo($registro, $parametros, 'idtiposuscripcion', 'uni_tipsuscripc');
        $this->setCampo($registro, $parametros, 'kp', 'hfat_kp');
        $this->setCampo($registro, $parametros, 'pm', 'hfat_pm');
        $this->setCampo($registro, $parametros, 'pe', 'hfat_pe');
        $this->setCampo($registro, $parametros, 'pa', 'hfat_pa');
        $this->setCampo($registro, $parametros, 'nivmar', 'hfat_nivmar');
        $this->setCampo($registro, $parametros, 'tm', 'hfat_tm');
        $this->setCampo($registro, $parametros, 'ndn', 'hfat_ndn');
        $this->setCampo($registro, $parametros, 'tn', 'hfat_tn');
        $this->setCampo($registro, $parametros, 'df', 'hfat_df');
        $this->setCampo($registro, $parametros, 'kt', 'hfat_kt');
        $this->setCampo($registro, $parametros, 'te', 'hfat_te');
        $this->setCampo($registro, $parametros, 'fpv', 'hfat_fpv');
        $this->setCampo($registro, $parametros, 'computador', 'hfat_computador');
        $parametros['hfat_fecha'] = 'now()';
        return $this->insertar($parametros, 'hfat_hisfactor', 'sq_hfat_ideregistr');
    }

    public function getIdSuscripcion($codigoAnterior) {
        $parametros['codigoanterior'] = $codigoAnterior;
        $parametros['idempresa'] = $this->idempresa;
        $sql = 'select dsus.dsus_ideregistr idsuscripcion from dsus_detsuscrip dsus where dsus.dsus_pcodigo=:codigoanterior and dsus.emp_ideregistro=:idempresa';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error no se encontró la suscripción con código ' . $codigoAnterior);
        }

        return $resultado['0']['idsuscripcion'];
    }

    public function getIdMunicipio($codigoMunicipio, $datos) {
        $parametros = array();
        $parametros['codigomunicipio'] = $codigoMunicipio;
        $parametros['idempresa'] = $datos ;      
        $sql = 'select pry.proyecto_ideregistro idmunicipio from proyectos pry 
                INNER JOIN empresas emp ON emp.empresa_cod = pry.proyecto_codemp 
                WHERE pry.proyecto_cod =:codigomunicipio AND emp.empresa_sevemp =:idempresa' ;
        
            $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
             throw new MyException('No se encontró el municipio', -1);
        }
        return $resultado[0]['idmunicipio'];
    }

    public function getIdBarrio($codigoBarrio,$codigoMunicipio,$datos) {
        $parametros = array();
        $parametros['idempresa'] = $datos;
        $parametros['idbarrio'] = $codigoBarrio;
        $parametros['codigomunicipio'] = $codigoMunicipio;
        $sql = "select bar.barrio_ideregistro idbarrio from barrios bar 
                INNER JOIN empresas emp ON bar.barrio_codemp = emp.empresa_cod
                where bar.barrio_cod=:idbarrio AND bar.barrio_codpro=:codigomunicipio AND emp.empresa_sevemp = :idempresa ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró el barrio', -1);
        }
        return $resultado[0]['idbarrio'];
    }

    
    public function consultaSuscripciones(array $datos){
        $complemento="  per_estado='A' ";
        if(!empty($datos['idtiposuscripcion'])){
            $complemento .='  AND uni_tipsuscripc = :idtiposuscripcion ';
        }
        
        if(!empty($datos['idmunicipio'] )){
            $complemento .= '  AND   uni_municipio = :idmunicipio ';
        }
        if(!empty($datos['idbarrio'])){
            $complemento .='  AND uni_barrio = :idbarrio ';
        }
        if(!empty($datos['idsuscripcion'])){
            $complemento.='  AND dsus_ideregistr = :idsuscripcion ';
        }
        if(!empty($datos['idempresa'])){
            $complemento.='  AND emp_ideregistro = :idempresa ';
        }
        
        $sql = 'SELECT
                    dsus_ideregistr idsuscripcion, 
                    cic.cic_ideregistro idciclo,
                    per.per_ideregistro idperiodo,                    
                    cic.cic_anoactual cicloanio,
                    extract( MONTH from per.per_fecfinal  ) mes
                FROM
                        dsus_detsuscrip dsus 
                INNER JOIN cic_ciclo cic on cic.cic_ideregistro = dsus.cic_ideregistro
                INNER JOIN per_periodo per ON cic.cic_ideregistro = per.cic_ideregistro
                WHERE'. $complemento;
        $resultado = $this->executeQuery($sql, $datos);
        return $resultado;
    }
    
    public function getCicloPeriodoSuscripcion($idSuscripcion) {
        $resultado = $this->getCicloPeriodo($idSuscripcion);
        if (empty($resultado)) {
            throw new MyException('No se encontró el ciclo y periodo para la suscripción ' . $idSuscripcion, -1);
        }
        $datos['idciclo'] = $resultado[0]['idciclo'];
        $datos['ciclo'] = $resultado[0]['ciclo'];
        $datos['idPeriodo'] = $resultado[0]['idperiodo'];
        $datos['idperiodo'] = $resultado[0]['idperiodo'];
        $datos['periodo'] = $resultado[0]['periodo'];
        $datos['cicloanio'] = $resultado[0]['cicloanio'];
        $datos['mes'] = $resultado[0]['mes'] ;
        $datos['orden'] = $resultado[0]['orden'];
        return $datos;
    }
    
    public function getCicloPeriodo($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion['idsuscripcion'];
        $sql = "SELECT
                    cic.cic_ideregistro idciclo,
                    cic.cic_nombre ciclo,
                    per.per_ideregistro idperiodo,
                    per.per_nombre periodo,
                    cic.cic_anoactual cicloanio,
                    extract( MONTH from per.per_fecfinal  ) mes,
                    per.per_ideorden orden
                FROM
                    cic_ciclo cic inner join per_periodo per on per.cic_ideregistro = cic.cic_ideregistro
		    inner join dsus_detsuscrip dsus on cic.cic_ideregistro=dsus.cic_ideregistro
                WHERE
                    per.per_estado = 'A' and
                    dsus.dsus_ideregistr= :idsuscripcion";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error al consultar el ciclo ', -1);
        }
        return $resultado;
    }
     
    public function actualizarMunicipio($factorCorreccion, $idMunicipio) {
        $parametros['muba_factor'] = $factorCorreccion;
        $parametros['uni_municipio'] = $idMunicipio;
        $this->actualizar($parametros, 'muba_munbarrio', 'uni_municipio=:uni_municipio');
    }
    
    public function getMunicipio() {
        $parametros = array();
        $parametros['idempresa'] = $this->idempresa;
        $sql = 'SELECT DISTINCT
                      hfat.uni_municipio idmunicipio,
                      hfat.hfat_factor factorcorreccion
                     FROM
                      hfat_hisfactor hfat
                     WHERE
                      hfat.uni_tipsuscripc IS  NULL
                      AND hfat.uni_municipio IS NOT NULL
                      AND hfat.uni_barrio IS  NULL  AND hfat.hfat_fecha::date=now()::date
                      AND hfat.dsus_ideregistr IS NULL and hfat.emp_ideregistro=:idempresa';
        return $this->executeQuery($sql,$parametros);
    }
    
    public function actualizarMunicipioBarrio($factorCorreccion, $idMunicipio, $idBarrio) {
        $parametros['muba_factor'] = $factorCorreccion;
        $parametros['uni_municipio'] = $idMunicipio;
        $parametros['uni_barrio'] = $idBarrio;
        $this->actualizar($parametros, 'muba_munbarrio', 'uni_municipio=:uni_municipio and uni_barrio=:uni_barrio');
    }
    
    public function getMunicipioBarrio() {
        $parametros = array();
        $parametros['idempresa'] = $this->idempresa;
        $sql = 'SELECT DISTINCT                       
                       hfat.uni_barrio idbarrio,
                       hfat.uni_municipio idmunicipio,
                       hfat.hfat_factor factorcorreccion
                      FROM
                       hfat_hisfactor hfat
                      WHERE
                       hfat.uni_tipsuscripc IS  NULL
                       AND hfat.uni_municipio IS NOT NULL
                       AND hfat.uni_barrio IS  NOT NULL  and hfat.hfat_fecha::date=now()::date
                       AND hfat.dsus_ideregistr IS NULL and hfat.emp_ideregistro= :idempresa';
        return $this->executeQuery($sql,$parametros);
    }
    
    public function consultaDsHfac($datos){
        $parametros = array();
        $parametros['idsuscripcion'] = $datos['idsuscripcion'];
        $parametros['idciclo'] = $datos['idciclo'];
        $parametros['idperiodo'] = $datos['idperiodo'];
        $parametros['cicloanio'] = $datos['cicloanio'];
        $sql = 'SELECT count(*) cantidad 
                FROM dshf_dsushfac 
                WHERE dsus_ideregistr =:idsuscripcion AND  cic_ideregistro =:idciclo  AND per_ideregistro =:idperiodo AND dshf_ano = :cicloanio';
        try{
            $resultado = $this->executeQuery($sql, $parametros);                    
        } catch (\Exception $ex) {
            throw new MyException($ex.' No se encontro Historico de Factor ', -1);
        }
        return $resultado;
    }  
    
    public function actualizarDsHfac($datos){
        $parametros = array();
        $parametros['hfat_ideregistr'] = $datos['idfactor'];
        $parametros['dsus_ideregistr'] = $datos['idsuscripcion'];
        $parametros['cic_ideregistro'] = $datos['idciclo'] ;
        $parametros['per_ideregistro'] = $datos['idperiodo'] ;
        $parametros['dshf_fecaplica'] = $datos['fechaaplica'];
        $this->actualizar($parametros,'dshf_dsushfac' , 'dsus_ideregistr = :dsus_ideregistr AND cic_ideregistro = :cic_ideregistro AND per_ideregistro = :per_ideregistro');     
    }
    
    public function insertarDsHfac($datos){
        $parametros = array();
        $this->setCampo($datos, $parametros, 'idsuscripcion', 'dsus_ideregistr');
        $this->setCampo($datos, $parametros, 'idfactor', 'hfat_ideregistr');
        $this->setCampo($datos, $parametros, 'idciclo', 'cic_ideregistro');
        $this->setCampo($datos, $parametros, 'idperiodo', 'per_ideregistro');
        $this->setCampo($datos, $parametros, 'fechaaplica', 'dshf_fecaplica');
        $this->setCampo($datos, $parametros, 'mes', 'dshf_mes');
        $this->setCampo($datos, $parametros, 'cicloanio', 'dshf_ano');
        $this->insertar($parametros,'dshf_dsushfac', 'sq_dshf_ideregistr');
        
    }
    
    public function validaSiExisteDatosCargadosMismoDiaModel(){
        $parametros = array();
        $parametros['idempresa'] = $this->idempresa;
        $sql = 'SELECT count(*) cantidad 
                FROM hfat_hisfactor 
                WHERE  hfat_fecha::date = now()::date and emp_ideregistro= :idempresa';
        try{
            $resultado = $this->executeQuery($sql,$parametros);                    
        } catch (\Exception $ex) {
            throw new MyException($ex.' No se encontro Historico de Factor ', -1);
        }
        return $resultado[0]['cantidad'];
    }
    
    public function eliminaDatosCargadosMismoDiaModel() {
        $parametros = array();
        $parametros['idempresa'] = $this->idempresa;
         $sql = 'DELETE from hfat_hisfactor  
                WHERE  hfat_fecha::date = now()::date and emp_ideregistro= :idempresa';
        try{
            $this->executeQuery($sql,$parametros);                    
        } catch (\Exception $ex) {
            throw new MyException($ex.' No se encontro Historico de Factor ', -1);
        }
        
    }
    
    public function validaDatosCargadosMismoMesModel($cargueIndustrial = null){
       // print_r($cargueIndustrial);
        $parametros = array();
        $parametros['idempresa'] = $this->idempresa;
        if(!empty($cargueIndustrial)){
            return;
        }
         $sql = 'SELECT         hfat_ctrlanomes ctrlanomes
                FROM 		hfat_hisfactor  
                WHERE	 	hfat_ctrlanomes = (extract(year  from  now()) * 100 +  	extract(month  from  now())) and emp_ideregistro= :idempresa';
        try{
           $resultado =  $this->executeQuery($sql,$parametros); 
           print_r($resultado);
           if(!empty($resultado)){
               throw new MyException(' Para el Periodo '. $resultado[0]['ctrlanomes'].'  ya se Proceso el Factor', -1);
           }
        } catch (\Exception $ex) {
            throw new MyException($ex.' No se encontro Historico de Factor ', -1);
        }
        
    }
    
    public function actualizaJsonHfact($idEmpresa, $cargueIndustrial){
        
        $complemento = '';        
        $complemento = empty($cargueIndustrial) ? ' and dsus.uni_tipusosuscr in (5,6) ' : ' and dsus.uni_tipusosuscr NOT IN (5,6) ';
        
        $sql = "UPDATE hfat_hisfactor hfat
	SET hfat_suscripcion = actualiza.suscripciones::jsonb
        FROM (

        SELECT idfactor,registro,array_to_json(array_agg(row_to_json(row(info.idsuscripcion))))suscripciones

                from (
			SELECT idfactor,idsuscripcion,row_number() over (partition by	idsuscripcion) registro,prioridad from 
										( SELECT idsuscripcion, 
										--row_number() over (partition by	idsuscripcion) registro,
										 (case when factorcorreccionSUS>0 then 1 
													 when factorcorreccionMUNBar>0 then 2 
													 when factorcorreccionMUN>0 then 3
													 when factorcorreccionTSUMunBAR>0 then 4
													 when factorcorreccionTSUMun>0 then 5
													 else 6 end) prioridad, 			
										 (case when factorcorreccionSUS>0 then factorcorreccionSUS 
													 when factorcorreccionMUNBar>0 then factorcorreccionMUNBar 
													 when factorcorreccionMUN>0 then factorcorreccionMUN
													 when factorcorreccionTSUMunBAR>0 then factorcorreccionTSUMunBAR
													 when factorcorreccionTSUMun>0 then factorcorreccionTSUMun
													 else factorcorreccionTSU end) factor,
										 (case when factorcorreccionSUS>0 then idhfatorSUS 
													 when factorcorreccionMUNBar>0 then idhfatorMUNBar 
													 when factorcorreccionMUN>0 then idhfatorMUN 
													 when factorcorreccionTSUMunBAR>0 then idhfatorTSUMunBAR 
													 when factorcorreccionTSUMun>0 then idhfatorTSUMun 
													 else idhfatorTSU end) idfactor
											--(case when factorcorreccionSUS>0 then idsuscripcion 
											--		 when factorcorreccionMUNBar>0 then idmunicipio*(power(10,length(idbarrio::varchar))) + idbarrio
											--		 when factorcorreccionMUN>0 then idmunicipio
											--		 when factorcorreccionTSUMunBAR>0 then (idtiposuscripcion*(power(10,length(idmunicipio::varchar||idbarrio::varchar))))+(idmunicipio*(power(10,length(idbarrio::varchar))) + idbarrio)
											--		 when factorcorreccionTSUMun>0 then idtiposuscripcion*(power(10,length(idmunicipio::varchar))) + idmunicipio
											--		 else idtiposuscripcion end) idprioridad
										from (
								
										-- Tipo de suscripcion
										(SELECT 
													hfat.uni_tipsuscripc idtiposuscripcion,
													hfat.uni_barrio idbarrio,
													hfat.uni_municipio idmunicipio,
													hfat.dsus_ideregistr idsuscripcion,
													hfat.hfat_factor factorcorreccionTSU,0 factorcorreccionTSUMun,0 factorcorreccionTSUMunBAR,0 factorcorreccionMUN,
																				 0 factorcorreccionMUNBar,0 factorcorreccionSUS,
													hfat.hfat_fecha fecha,
													hfat.hfat_ideregistr idhfatorTSU, 0 idhfatorTSUMun, 0 idhfatorTSUMunBAR,0 idhfatorMUN, 0 idhfatorMUNBar,0 idhfatorSUS,
															cic.cic_anoactual anoactual,extract(month from per.per_fecfinal) mes, per.per_ideregistro idperiodo, hfat.hfat_ctrlanomes ctranomes
												FROM 
													hfat_hisfactor hfat
														INNER JOIN dsus_detsuscrip dsus on dsus.uni_tipsuscripc=hfat.uni_tipsuscripc
														INNER JOIN cic_ciclo cic on cic.cic_ideregistro=dsus.cic_ideregistro
														INNER JOIN per_periodo per on cic.cic_ideregistro=per.cic_ideregistro
												WHERE --hfat.dsus_ideregistr=715 and
													dsus.emp_ideregistro=hfat.emp_ideregistro AND dsus.dsus_estado<>'E' AND per.per_estado='A' 
													AND dsus.uni_tipsuscripc=hfat.uni_tipsuscripc 
													AND hfat.emp_ideregistro=$idEmpresa and hfat.emp_ideregistro=dsus.emp_ideregistro
													AND hfat.uni_tipsuscripc IS NOT NULL
                                                                                                        $complemento
													AND hfat.uni_municipio IS NULL
													AND hfat.uni_barrio IS NULL  AND hfat.hfat_fecha::date=now()::date 
                                                                                                        AND hfat.hfat_suscripcion is null
													AND hfat.dsus_ideregistr IS NULL) 
										UNION
										-- TipoSuscripcion-Municipio 
										(SELECT DISTINCT
															hfat.uni_tipsuscripc idtiposuscripcion,
															hfat.uni_barrio idbarrio,
															hfat.uni_municipio idmunicipio,
															hfat.dsus_ideregistr idsuscripcion,
															0 factorcorreccionTSU,hfat.hfat_factor factorcorreccionTSUMun,0 factorcorreccionTSUMunBAR,0 factorcorreccionMUN,
																				 0 factorcorreccionMUNBar,0 factorcorreccionSUS,
															hfat.hfat_fecha fecha,
															0 idhfatorTSU, hfat.hfat_ideregistr idhfatorTSUMun, 0 idhfatorTSUMunBAR,0 idhfatorMUN, 0 idhfatorMUNBar,0 idhfatorSUS,
															cic.cic_anoactual,extract(month from per.per_fecfinal) mes, per.per_ideregistro idperiodo, hfat.hfat_ctrlanomes ctranomes
														FROM
																		hfat_hisfactor hfat
														INNER JOIN pro_propiedad pro on pro.uni_municipio=hfat.uni_municipio
														INNER JOIN dsus_detsuscrip dsus on dsus.pro_ideregistro=pro.pro_ideregistro
														INNER JOIN cic_ciclo cic on cic.cic_ideregistro=dsus.cic_ideregistro
														INNER JOIN per_periodo per on cic.cic_ideregistro=per.cic_ideregistro
														WHERE
														 dsus.emp_ideregistro=hfat.emp_ideregistro AND dsus.dsus_estado<>'E' AND per.per_estado='A' 
														 AND dsus.uni_tipsuscripc=hfat.uni_tipsuscripc 
														 AND hfat.emp_ideregistro=$idEmpresa  and hfat.emp_ideregistro=dsus.emp_ideregistro
														 AND hfat.uni_tipsuscripc IS NOT NULL
                                                                                                                 $complemento
														 AND hfat.uni_municipio IS NOT NULL
														 AND hfat.uni_barrio IS  NULL AND hfat.hfat_fecha::date=now()::date 
                                                                                                                 AND hfat.hfat_suscripcion is null
														 AND hfat.dsus_ideregistr IS NULL)
										UNION
										-- TipoSuscripcion-Municipio-Barrio
										(SELECT DISTINCT
															hfat.uni_tipsuscripc idtiposuscripcion,
															hfat.uni_barrio idbarrio,
															hfat.uni_municipio idmunicipio,
															hfat.dsus_ideregistr idsuscripcion,
															0 factorcorreccionTSU,0 factorcorreccionTSUMun,hfat.hfat_factor factorcorreccionTSUMunBAR,0 factorcorreccionMUN,
																				 0 factorcorreccionMUNBar,0 factorcorreccionSUS,
															hfat.hfat_fecha fecha,
															0 idhfatorTSU,0 idhfatorTSUMun,hfat.hfat_ideregistr idhfatorTSUMunBAR,0 idhfatorMUN, 0 idhfatorMUNBar,0 idhfatorSUS,
															cic.cic_anoactual,extract(month from per.per_fecfinal) mes, per.per_ideregistro idperiodo, hfat.hfat_ctrlanomes ctranomes
														FROM
																		hfat_hisfactor hfat
														INNER JOIN pro_propiedad pro on pro.uni_municipio=hfat.uni_municipio and pro.uni_barrio=hfat.uni_barrio
														INNER JOIN dsus_detsuscrip dsus on dsus.pro_ideregistro=pro.pro_ideregistro
														INNER JOIN cic_ciclo cic on cic.cic_ideregistro=dsus.cic_ideregistro
														INNER JOIN per_periodo per on cic.cic_ideregistro=per.cic_ideregistro
														WHERE
														 dsus.emp_ideregistro=hfat.emp_ideregistro and dsus.dsus_estado<>'E' and per.per_estado='A' 
														 AND dsus.uni_tipsuscripc=hfat.uni_tipsuscripc 	
														 AND hfat.emp_ideregistro=$idEmpresa  and hfat.emp_ideregistro=dsus.emp_ideregistro
														 AND hfat.uni_tipsuscripc IS NOT NULL
                                                                                                                 $complemento
														 AND hfat.uni_municipio IS NOT NULL
														 AND hfat.uni_barrio IS  NULL  AND hfat.hfat_fecha::date=now()::date 
                                                                                                                 AND hfat.hfat_suscripcion is null
														 AND hfat.dsus_ideregistr IS NULL)
										UNION  -- suscripcion   
										--- municipio 
										(SELECT DISTINCT
														 hfat.uni_tipsuscripc idtiposuscripcion,
														 hfat.uni_barrio idbarrio,
														 hfat.uni_municipio idmunicipio,
														 dsus.dsus_ideregistr idsuscripcion,
														 0 factorcorreccionTSU,0 factorcorreccionTSUMun,0 factorcorreccionTSUMunBAR,hfat.hfat_factor factorcorreccionMUN,
																				 0 factorcorreccionMUNBar,0 factorcorreccionSUS,
															hfat.hfat_fecha fecha,
															0 idhfatorTSU,0 idhfatorTSUMun,0 idhfatorTSUMunBAR,hfat.hfat_ideregistr idhfatorMUN, 0 idhfatorMUNBar,0 idhfatorSUS,
															cic.cic_anoactual,extract(month from per.per_fecfinal) mes, per.per_ideregistro idperiodo, hfat.hfat_ctrlanomes ctranomes
														FROM
														 hfat_hisfactor hfat
														INNER JOIN pro_propiedad pro on pro.uni_municipio=hfat.uni_municipio
														INNER JOIN dsus_detsuscrip dsus on dsus.pro_ideregistro=pro.pro_ideregistro
														INNER JOIN cic_ciclo cic on cic.cic_ideregistro=dsus.cic_ideregistro
														INNER JOIN per_periodo per on cic.cic_ideregistro=per.cic_ideregistro
														WHERE
														 dsus.emp_ideregistro=hfat.emp_ideregistro and dsus.dsus_estado<>'E' and per.per_estado='A' 
														 AND hfat.emp_ideregistro=$idEmpresa and hfat.emp_ideregistro=dsus.emp_ideregistro
														 AND hfat.uni_tipsuscripc IS  NULL
                                                                                                                 $complemento
														 AND hfat.uni_municipio IS NOT NULL
														 AND hfat.uni_barrio IS  NULL  AND hfat.hfat_fecha::date=now()::date 
                                                                                                                 AND hfat.hfat_suscripcion is null
														 AND hfat.dsus_ideregistr IS NULL ) 
									UNION
										--- municipio-barrio 
										(SELECT DISTINCT
															hfat.uni_tipsuscripc idtiposuscripcion,
															hfat.uni_barrio idbarrio,
															hfat.uni_municipio idmunicipio,
															hfat.dsus_ideregistr idsuscripcion,
														 0 factorcorreccionTSU,0 factorcorreccionTSUMun,0 factorcorreccionTSUMunBAR,0 factorcorreccionMUN,
																				 hfat.hfat_factor factorcorreccionMUNBar,0 factorcorreccionSUS,
															hfat.hfat_fecha fecha,
															0 idhfatorTSU,0 idhfatorTSUMun,0 idhfatorTSUMunBAR,0 idhfatorMUN,hfat.hfat_ideregistr idhfatorMUNBar,0 idhfatorSUS,
															cic.cic_anoactual,extract(month from per.per_fecfinal) mes, per.per_ideregistro idperiodo, hfat.hfat_ctrlanomes ctranomes
														 FROM
															hfat_hisfactor hfat
															INNER JOIN pro_propiedad pro on pro.uni_municipio=hfat.uni_municipio and pro.uni_barrio=hfat.uni_barrio
															INNER JOIN dsus_detsuscrip dsus on dsus.pro_ideregistro=pro.pro_ideregistro
															INNER JOIN cic_ciclo cic on cic.cic_ideregistro=dsus.cic_ideregistro
															INNER JOIN per_periodo per on cic.cic_ideregistro=per.cic_ideregistro
														 WHERE
															dsus.emp_ideregistro=hfat.emp_ideregistro and dsus.dsus_estado<>'E' and per.per_estado='A' 
																AND hfat.emp_ideregistro=$idEmpresa and hfat.emp_ideregistro=dsus.emp_ideregistro
															AND hfat.uni_tipsuscripc IS  NULL
                                                                                                                        $complemento
															AND hfat.uni_municipio IS NOT NULL
															AND hfat.uni_barrio IS  NOT NULL  AND hfat.hfat_fecha::date=now()::date 
                                                                                                                        AND hfat.hfat_suscripcion is null
															AND hfat.dsus_ideregistr IS NULL) 
										 UNION  
										-- Suscripcion
										(SELECT 
														hfat.uni_tipsuscripc idtiposuscripcion,
														hfat.uni_barrio idbarrio,
														hfat.uni_municipio idmunicipio,
														hfat.dsus_ideregistr idsuscripcion,
														0 factorcorreccionTSU,0 factorcorreccionTSUMun,0 factorcorreccionTSUMunBAR,0 factorcorreccionMUN,
																			 0 factorcorreccionMUNBar,hfat.hfat_factor factorcorreccionSUS,
														hfat.hfat_fecha fecha,
														0 idhfatorTSU,0 idhfatorTSUMun,0 idhfatorTSUMunBAR,0 idhfatorMUN,0 idhfatorMUNBar,hfat.hfat_ideregistr idhfatorSUS,
															cic.cic_anoactual,extract(month from per.per_fecfinal) mes, per.per_ideregistro idperiodo, hfat.hfat_ctrlanomes ctranomes
												 FROM
													hfat_hisfactor hfat
														INNER JOIN dsus_detsuscrip dsus on dsus.dsus_ideregistr=hfat.dsus_ideregistr
														INNER JOIN cic_ciclo cic on cic.cic_ideregistro=dsus.cic_ideregistro
														INNER JOIN per_periodo per on cic.cic_ideregistro=per.cic_ideregistro
												 WHERE
													dsus.emp_ideregistro=hfat.emp_ideregistro and dsus.dsus_estado<>'E' and per.per_estado='A' 
														AND hfat.emp_ideregistro=$idEmpresa and hfat.emp_ideregistro=dsus.emp_ideregistro
                                                                                                        $complemento
													AND hfat.dsus_ideregistr IS NOT NULL   AND hfat.hfat_fecha::date=now()::date
                                                                                                        AND hfat.hfat_suscripcion is null )
												   ) datos
										WHERE (case when factorcorreccionSUS>0 then factorcorreccionSUS 
													 when factorcorreccionMUNBar>0 then factorcorreccionMUNBar 
													 when factorcorreccionMUN>0 then factorcorreccionMUN
													 when factorcorreccionTSUMunBAR>0 then factorcorreccionTSUMunBAR
													 when factorcorreccionTSUMun>0 then factorcorreccionTSUMun
													 else factorcorreccionTSU end) is not null
										 ORDER BY idsuscripcion,prioridad) definitivo
					) as info 
					where info.registro=1
						GROUP BY info.idfactor,info.registro
						ORDER BY info.idfactor
        ) actualiza
        WHERE actualiza.idfactor = hfat.hfat_ideregistr";
        try{
           $resultado =  $this->executeQuery($sql);         
        } catch (\Exception $ex) {
            throw new MyException($ex.' No se  Actualizo el Hfat con el Json  ', -1);
        }
    }
    
      public function actualizaSuscripcionesFactorCorreccion($idEmpresa){
        $sql = "UPDATE dsus_detsuscrip dsus 
                SET  dsus_factor = info.factor
                FROM	(
                                SELECT 
                                                json_array_elements(hfat.hfat_suscripcion::JSON)::json->>'f1' idsuscripcion ,
                                                hfat.hfat_factor factor 
                                FROM hfat_hisfactor hfat
                                        WHERE hfat_ctrlanomes= (extract( year from now())* 100  + extract( month from now()))
                ) info
                WHERE info.idsuscripcion::integer = dsus.dsus_ideregistr and info.factor <> dsus.dsus_factor";
        try{
           $resultado =  $this->executeQuery($sql);   
        } catch (\Exception $ex) {
            throw new MyException($ex.'  No se actualizo el factor de las suscripciones ', -1);
        }
    }
}
