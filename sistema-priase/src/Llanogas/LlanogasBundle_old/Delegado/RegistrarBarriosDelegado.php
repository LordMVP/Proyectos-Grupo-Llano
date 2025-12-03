<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\RegistrarBarriosModel;
use Llanogas\LlanogasBundle\Utiles\ConceptosUtil;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de los recaudos.
 * @author hrey
 */
class RegistrarBarriosDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var RegistrarVentasModel
     */
    private $registrarBarriosModel;

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
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface &$sesion, $idSuscripcion = null) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->registrarBarriosModel = new RegistrarBarriosModel($this->conexion);
        
        $this->sesion = $sesion;
    }

    
    public function getMunicipiosPorPerfil() {
        $idEmpresa = $this->sesion->get('idempresa');
        $idUsuario = $this->sesion->get('idusuario');
        return $this->genericoModel->getMunicipiosPorPerfil( $idUsuario,$idEmpresa );
    }
    
    public function getRutasEmpresa(){
        $idEmpresa = $this->sesion->get('idempresa');
        return $this->registrarBarriosModel->getRutasEmpresa( $idEmpresa );
    }
            
    public function getBarriosEmpresa($data){
        $idEmpresa = $this->sesion->get('idempresa');
        return $this->registrarBarriosModel->getBarrioEmpresa( $idEmpresa, $data);
    }
    
    
    public function grabarBarrio($data){
        $idEmpresa = $this->sesion->get('idempresa');        
        $idUsuario = $this->sesion->get('idusuario');
        $data['idempresa'] = $idEmpresa;
        $data['idusuario'] = $idUsuario;
        $respuestaProyectoEmpresa =  $this->registrarBarriosModel->getProyectoMunicipio( $idEmpresa, $data['idmunicipio'] );
        
        $data['codpro'] = $respuestaProyectoEmpresa['proyecto'];
        $data['codemp'] = $respuestaProyectoEmpresa['nit'];
        $data['llacom'] = $data['idcodigo'].$respuestaProyectoEmpresa['proyecto'].$respuestaProyectoEmpresa['nit'];
        
        
        
        try{
            $this->conexion->beginTransaction();
            if (!empty($data['insert'])) {
                $barrio_ideregistro = $this->registrarBarriosModel->insertarBarrio( $data );
                $data['uni_barrio'] = $barrio_ideregistro;
                $muba_ideregistro = $this->registrarBarriosModel->insertarBarrioMunicipio( $data );
                $data['idmuba'] =  $muba_ideregistro;
                if(!empty($data['rutasVinculadasNuevas'])){
                        $respuesta = $this->setVinculaRutas( $data );                        
                }
                $this->conexion->commit();
            return $respuesta;
            }
            
            $this->registrarBarriosModel->actualizaBarrio( $data );
            
            if(!empty($data['rutasVinculadasEliminadas'])){                    
                    $respuesta = $this->EliminarRutasVincula( $data );                       
            }
            if(!empty($data['rutasVinculadasNuevas'])){                    
                    $respuesta = $this->setVinculaRutas( $data );                       
            }
            if(!empty($data['idmuba'])){                    
                    $respuesta = $this->actualizaSector( $data['idmuba'], $data['sector'] );                       
            }
            
            
            $this->conexion->commit();
            return $respuesta;
         } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException("Error Procesando Barrio  -->  " . $e->getMessage(), -1);
        }   
    }
    
    public function actualizaSector($idmuba, $sector){
        return $this->registrarBarriosModel->actualizaSector( $idmuba, $sector);
    }
    
    public function getRutasVinculadas($idmuba){
        return $this->registrarBarriosModel->getRutasVinculadas( $idmuba);
    }
    
    public function setVinculaRutas($data){
        foreach ($data['rutasVinculadasNuevas'] as $vincularRutas) {
                    $data['idruta'] = $vincularRutas['idruta'];
                    $respuesta = $this->registrarBarriosModel->insertarMunicipioBarrioRuta( $data );                        
                }  
    }
    
    public function EliminarRutasVincula( $data ){
        foreach ($data['rutasVinculadasEliminadas'] as $eliminaRutasVinculadas) {
                    $data['idmubaruta'] = $eliminaRutasVinculadas['idmubarut'];
                    $respuesta = $this->registrarBarriosModel->eliminarRutasVinculadas( $data );                        
                } 
    }
    
    public function getRutasMunicipio($idMunicipio){        
        $idEmpresa = $this->sesion->get('idempresa'); 
        return $this->registrarBarriosModel->getRutasMunicipio( $idEmpresa, $idMunicipio );  
    }
}
