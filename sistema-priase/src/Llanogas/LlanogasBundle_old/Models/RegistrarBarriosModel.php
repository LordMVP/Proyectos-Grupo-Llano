<?php

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * Consultas genericas del sistema.
 *
 * @author hrey
 */
class RegistrarBarriosModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param Connection $conexion
     */
    public function __construct(Connection &$conexion) {
        $this->setConexion($conexion);
    }

   

    public function getRutasEmpresa($idempresa) {
        $parametros['idempresa'] = $idempresa;
        $sql = 'select rut.rut_ideregistro idruta, rut.rut_nombre  ruta
                from rut_ruta rut 
                INNER JOIN ruem_rutempresa ruem ON ruem.rut_ideregistro = rut.rut_ideregistro
                WHERE ruem.emp_ideregistro = :idempresa
                ORDER BY rut.rut_ideregistro';
        return $this->executeQuery($sql, $parametros);
    }
    
    public function actualizaSector( $idmuba, $sector){
        $parametros['muba_sector'] = $sector;
        $parametros['muba_ideregistr'] = $idmuba;
        return $this->actualizar($parametros, 'muba_munbarrio', 'muba_ideregistr=:muba_ideregistr');
        
    }

    public function getBarrioEmpresa( $idEmpresa, $data) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idmunicipio'] = $data['idmunicipio'];
        $complemento = ''; 
        $campos ='';
        $adicionar ='';
        
        if(!empty($data['dialogo'])){
            $campos = ', barr.barrio_cod codigo, barr.barrio_swtter::varchar tercerizado,
                    muba.uni_municipio idmunicipio, muba.uni_barrio barrio_ideregistro,
                    muba.muba_sector sector, muba.muba_ideregistr idmuba';
            
            $adicionar ='INNER JOIN		muba_munbarrio muba on muba.uni_barrio = barr.barrio_ideregistro  and muba.uni_municipio = :idmunicipio
                        ';
            
            if(!empty($data['nombre'])){
                $barrioNombre = rtrim($data['nombre']);  
                $barrioNombre = ltrim($data['nombre']);  
                $complemento .= "  AND  LOWER(barr.barrio_nom) ilike LOWER('%$barrioNombre%') ";  
          }    
        }
        if(!empty($data['idcodigo'])){
        $parametros['idcodigo'] = $data['idcodigo'];
            $complemento .= "  AND barr.barrio_cod = :idcodigo ";
        }
        
        
        
        $resultado =   Array(); 
        
        
        try{
            $sql = "SELECT DISTINCT barr.barrio_nom $campos
                    FROM barrios barr 
                    INNER JOIN	empresas emp on emp.empresa_cod = barrio_codemp
                    $adicionar
                    WHERE		emp.empresa_sevemp = :idempresa
                    $complemento
                    AND             barr.barrio_codpro = (SELECT  proyecto_cod from proyectos where proyecto_ideregistro = :idmunicipio)";
            $resultado =  $this->executeQuery($sql, $parametros);
            if(!empty($data['dialogo'])){
                if(empty($resultado)){
                     throw new MyException('No se encontro el Barrio; con los parametros ingresados ' , 0); 
                }   
            }
         }catch (\Exception $ex) {
             throw new MyException('Error, no se encontro el Barrio  ' . $ex->getMessage(), $ex->getCode());
         }
        return $resultado;       
    }
    
    public function getBarriosMunicipio( $idEmpresa, $nomBarrio, $idMunicipio){
       $parametros['idempresa'] = $idEmpresa;
       $parametros['idmunicipio'] = $idMunicipio;
       
       $barrioNombre = rtrim($nomBarrio);
       $barrioNombre = ltrim($nomBarrio);
       
       $sql = "SELECT DISTINCT barr.barrio_nom  
               FROM barrios barr  
               INNER JOIN	empresas emp on emp.empresa_cod = barrio_codemp 
               WHERE		emp.empresa_sevemp = :idempresa 
               AND		LOWER(barr.barrio_nom) ilike LOWER('%$barrioNombre%')
               AND             barr.barrio_codpro = (SELECT  proyecto_cod from proyectos where proyecto_ideregistro = :idmunicipio)"; 
       return $this->executeQuery($sql, $parametros);  
    }
           
    public function insertarBarrio(array $dataBarrio) {       
        $parametros = array();
        try{
            $parametros['barrio_cod']	  =	$dataBarrio['idcodigo'];
            $parametros['barrio_nom']	  =	$dataBarrio['nombre'];
            $parametros['barrio_codpro']  =	$dataBarrio['codpro'];
            $parametros['barrio_codemp']  =	$dataBarrio['codemp'];
            $parametros['barrio_swtter']  =	$dataBarrio['tercerizado'];
            $parametros['barrio_llacom']  =	$dataBarrio['llacom'];
             $sql = $this->construyeSQL('INSERT', 'barrios', $parametros);
                    $this->setSql($sql);
                    $this->setParams($parametros);
                    $this->setsecuencia('sq_barrio_ideregistro');
                    $this->executeUpdate();
                    if ($this->getnumFilas() == 0) {
                        throw new MyException('Error al insertar el Barrio');
                    }
                   $idBarrio = $this->getlastId();                 
        return  $idBarrio;
        }catch (\Exception $ex) {
            throw new MyException('Error creando el barrio ' . $ex->getMessage(), -1);
        }
    }
    
    public function actualizaBarrio(array $dataBarrio) {       
        $parametros = array();
        try{
            
            $parametros['barrio_nom']	  =	$dataBarrio['nombre'];         
            $parametros['barrio_swtter']  =	$dataBarrio['tercerizado'];
             $sql = $this->construyeSQL("UPDATE", "barrios", $parametros, "barrio_cod ='".$dataBarrio['idcodigo']."'  and barrio_codemp = '". $dataBarrio['codemp'] ."' and barrio_codpro = '". $dataBarrio['codpro']."' and barrio_llacom = '".$dataBarrio['llacom'])."'";
                    $this->setSql($sql);
                    $this->setParams($parametros);                    
                    $actualizado = $this->executeUpdate();
                    if ($actualizado == 0) {
                        throw new MyException('Error al actualizar el Barrio');
                    }                                    
            return  $actualizado;
        }catch (\Exception $ex) {
            throw new MyException('Error actualizando el barrio ' . $ex->getMessage(), -1);
        }
    }
    
    public function    insertarBarrioMunicipio(array $dataBarrio) {       
        $parametros = array();
        try{
            $this->setCampo($dataBarrio, $parametros, 'idmunicipio', 'uni_municipio');
            $this->setCampo($dataBarrio, $parametros, 'uni_barrio', 'uni_barrio');
            $this->setCampo($dataBarrio, $parametros, 'sector', 'muba_sector');
            $this->setCampo($dataBarrio, $parametros, 'idusuario', 'usu_ideregistro');            
            return $this->insertar($parametros, 'muba_munbarrio', 'sq_muba_ideregistr');
        } 
         catch (\Exception $ex) {
                    throw new MyException('Error creando municipio barrio ' . $ex->getMessage(), -1);
         }
    }
    
    public function    insertarMunicipioBarrioRuta(array $dataBarrio) {       
        $parametros = array();
        try{
            $this->setCampo($dataBarrio, $parametros, 'idmuba', 'muba_ideregistr');
            $this->setCampo($dataBarrio, $parametros, 'idruta', 'rut_ideregistro');
            $this->setCampo($dataBarrio, $parametros, 'idusuario', 'usu_ideregistro');            
            return $this->insertar($parametros, 'mbru_munbarruta', 'sq_mbru_ideregistr');
        } 
         catch (\Exception $ex) {
                    throw new MyException('Error creando municipio barrio ruta ' . $ex->getMessage(), -1);
         }
    }
    
    public function getProyectoMunicipio($idEmpresa, $idMunicipio){
         $parametros['idempresa'] = $idEmpresa;
           $parametros['idmunicipio'] = $idMunicipio;
         $sql = "SELECT proy.proyecto_cod proyecto, emp.empresa_cod nit
                 FROM proyectos proy 
                 INNER JOIN empresas emp on  emp.empresa_cod = proy.proyecto_codemp
                 WHERE proyecto_ideregistro = :idmunicipio  and emp.empresa_sevemp = :idempresa    ";
         $resultado = $this->executeQuery($sql, $parametros);
         return $resultado[0];
    }
    
    public function getRutasVinculadas($idmuba){
        $parametros['idmuba'] = $idmuba;
        $sql= "select mbru.mbru_ideregistr idmubarut,rut.rut_ideregistro idruta, rut.rut_nombre rutnombre  
                from mbru_munbarruta mbru 
                INNER JOIN    rut_ruta rut on rut.rut_ideregistro = mbru.rut_ideregistro 
                where muba_ideregistr = :idmuba";
        return $this->executeQuery($sql, $parametros);
    }
    
    public function eliminarRutasVinculadas($data) {
        $condicion = " mbru_ideregistr = " . $data['idmubaruta'];
        return $this->eliminar('mbru_munbarruta', $condicion);
    }
    
    public function getRutasMunicipio($idempresa, $idmunicipio){
        $parametros['idempresa'] = $idempresa;
        $parametros['idmunicipio'] = $idmunicipio;
        $sql= "select DISTINCT rut.rut_ideregistro idruta, rut_nombre nombre
                from rut_ruta rut 
                INNER JOIN 		ruem_rutempresa ruem on ruem.rut_ideregistro = rut.rut_ideregistro
                INNER JOIN 		mbru_munbarruta mbru on mbru.rut_ideregistro = rut.rut_ideregistro
                INNER JOIN		muba_munbarrio 	muba on muba.muba_ideregistr = mbru.muba_ideregistr
                WHERE			 muba.uni_municipio = :idmunicipio  and ruem.emp_ideregistro = :idempresa

                UNION ALL

                select DISTINCT rut.rut_ideregistro idruta, rut_nombre nombre 
                from 		rut_ruta rut 
                INNER JOIN 		ruem_rutempresa ruem on ruem.rut_ideregistro = rut.rut_ideregistro
                LEFT JOIN 		mbru_munbarruta  mbru on mbru.rut_ideregistro = rut.rut_ideregistro
                WHERE 			mbru.mbru_ideregistr is null and ruem.emp_ideregistro = :idempresa
                ORDER BY idruta";
        return $this->executeQuery($sql, $parametros);
    }
    
}
