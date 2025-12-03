<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\CargarEstratoCatastralModel;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\ValidacionException;
use Symfony\Component\HttpFoundation\Request;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of CargarEstratoCatastralDelegado
 *
 * @author jeisson
 */
class CargarEstratoCatastralDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\CargarEstratoCatastralModel 
     */
    private $cargarEstratoCatastralModel;

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

    
    private $validadatosIdsuscripcion  ; 
    private $validadatosNumcatastral ; 
    private $resolucion ; 
    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde el cual se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->cargarEstratoCatastralModel = new CargarEstratoCatastralModel($this->conexion, $sesion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $sesion;
    }

    public function cargarEstratoCatastral(Request $request) {
        try {
            $idUsuario = $this->sesion->get('idusuario');
            $resolucion = $request->get('txtResolucion');
            $idEmpresa = $this->sesion->get('idempresa');
         
            $listaArchivos = Util::subirAdjunto($request, $idUsuario, 'estratocatastral');
            $archivo = $listaArchivos[0];
            $this -> validadatosIdsuscripcion = 0 ; 
            $this -> validadatosNumcatastral =  0 ;  
            $listaLineas = $this->leerArchivoPlano($archivo['rutaarchivo']);
            $this->validaTablaTemp_EstratoCatastral();
            $numeroRegistros = $this->procesarLineas($listaLineas,$resolucion);
            $cantidadNit = $this->cargarEstratoCatastralModel->verificaIdeNit();
            if($cantidadNit['cantidad'] > 0){
                if($numeroRegistros != $cantidadNit['cantidad'] ){
                    throw new MyException('Error: La información a cargar debe ser unicamente de terceros', -3);
                    return;
                }
                    $resultado = $this->cargarEstratoCatastralModel->leerRegistrosTablaTemporalTerceros($idEmpresa,'Catastral');
                    foreach($resultado as $teridenit){
                        $this->cargarEstratoCatastralModel->insertarTerceros($teridenit);
                    }
               return;     
            }    
            if (($this-> validadatosIdsuscripcion)== 1) {
                 // Esta debe ser siempre la primera validacion ya que si no se cumple aborta el proceso
                $RegistrosOtraempresa = $this->cargarEstratoCatastralModel->verificaEmpresaSuscripcion($idEmpresa); 
                if (!empty($RegistrosOtraempresa)) {
                    throw new MyException('Error: El archivo Contiene informacion de Otras empresas...', -3);
                    return ;
                }        
                $this->verificadatosIdsuscripcion();
                $this->procesaRegistrosNumcatastralNuevo($idEmpresa);//procesarLineas
            }
            if (($this-> validadatosNumcatastral)== 1) {
                // Esta debe ser siempre la primera validacion ya que si no se cumple aborta el proceso
                $RegistrosOtraempresa = $this->cargarEstratoCatastralModel->verificaEmpresaNumcatastral($idEmpresa); 
                if (!empty($RegistrosOtraempresa)) {
                    throw new MyException('Error: El archivo Contiene informacion de Otras empresas...', -3);
                    return ;
                }      
                $this->verificadatosNumcatastral();
                $this->procesaRegistrosEstratoNuevo($idEmpresa);
            }
        return $numeroRegistros;
        } catch (MyException $e) {
            if ($this->conexion->isTransactionActive()) {
                $this->conexion->rollBack();
            }
            throw $e;
        } catch (ValidacionException $e) {
            if ($this->conexion->isTransactionActive()) {
                $this->conexion->rollBack();
            }
            throw $e;
        } catch (\Exception $e) {
            if ($this->conexion->isTransactionActive()) {
                $this->conexion->rollBack();
            }
            throw new MyException('Error al cargar el archivo plano ', -1);
        }
    }

    public function validaTablaTemp_EstratoCatastral() {
        try {
            $idEmpresa = $this->sesion->get('idempresa');
            $tablaExiste = $this->cargarEstratoCatastralModel->existeTablaTemporalEstratoCatastral();
            if ($tablaExiste > 0) {
                $this->cargarEstratoCatastralModel->vaciarTablaTemporalEstratoCatastral($idEmpresa);
                return;
            }
            $this->cargarEstratoCatastralModel->crearTablaTemporalEstratoCatastral();
        } catch (\Exception $exc) {

            throw new MyException('Error al crear la tabla temporal Encabezado', -1);
        }
    }
    
    private function getInfoRegistroArchivo($registro) {
        if (count($registro) != 14) {
            throw new MyException('El archivo no tiene el formato correcto', -3);
        }
        $i = 0;
        $infoRegistro = array();
        $infoRegistro['idsuscripcion'] = trim($registro[$i++]);
        if(!empty($infoRegistro['idsuscripcion'])){
            $this-> validadatosIdsuscripcion = 1 ;
        }   
        $infoRegistro['numcatastral'] = trim($registro[$i++]);
        // if(!empty($infoRegistro['numcatastral'])){
        //    $this-> validadatosNumcatastral = 1 ;
        // }   
        $infoRegistro['numcatastralnew'] = trim($registro[$i++]);
        $infoRegistro['estratonew'] =  trim($registro[$i++]);
        
        $infoRegistro['proresolcatastralnew'] =  trim($registro[$i++]);
        $infoRegistro['prodireccionnew'] = trim($registro[$i++]);
        $infoRegistro['proidepropiedadnew'] =  trim($registro[$i++]);
        $infoRegistro['prodigitosnew'] = trim($registro[$i++]);
        $infoRegistro['ternombrenew'] =  trim($registro[$i++]);
        $infoRegistro['terapellidonew'] = trim($registro[$i++]);
        $infoRegistro['proaltriesgonew'] =  trim($registro[$i++]);
        $infoRegistro['prozonanew'] = trim($registro[$i++]);
        $infoRegistro['temp_resolucion'] =  trim($registro[$i++]);
        $infoRegistro['temp_idenit'] =  trim($registro[$i++]);

      	//print_r($infoRegistro);
        return $infoRegistro;

    }
    
    public function getRegitrosTemp_EstratoCatastral() {
        try {
                $idEmpresa = $this->sesion->get('idempresa');
                return $this->cargarEstratoCatastralModel->consultarRegistrosTablaTemporal($idEmpresa);
            } catch (\Exception $exc) {
                throw new MyException('Error al consultar la tabla temporal', -1);
            }
    }

    private function leerArchivoPlano($archivo) {
        $listaLineas = array();
        $file = fopen($archivo, "r");
        $numeroLinea = 0;     
        while ($linea = fgets($file)) {
            $numeroLinea++;
            $linea = utf8_encode($linea);
            $registro = explode(';', $linea);
            $listaLineas['registro'][] = $this->getInfoRegistroArchivo($registro);
        }
        if (($this-> validadatosIdsuscripcion)> 0 && ($this-> validadatosNumcatastral)> 0) {
            throw new MyException('Error: El archivo mezcla Información de Estratificación y Numeros Catastrales...', -3);
            return ;
        }
        return $listaLineas;
    }

    private function procesarLineas(array $listaLineas,$resolucion) {
        $this->conexion->beginTransaction();
        $numresolucion = $resolucion ;
        $numeroLinea = 0;
        $listaErrores = array();
        $esError = 0;
        foreach ($listaLineas['registro'] as $linea) {
            
            try {
                if ($esError == 1) {
                    $this->conexion->beginTransaction();
                }
                $this->cargarEstratoCatastralModel->insertarEstratoCatastral($linea,$numresolucion);
                if ($esError==1) {
                     $this->conexion->rollBack();
                }
            } catch (\Exception $e) {
                $error['idsuscripcion'] = $linea['idsuscripcion'];
                $error['descripcion'] = $e->getMessage();
                $listaErrores[] = $error;
                $esError = 1;
                $this->conexion->rollBack();
            }
            $numeroLinea++;
        }
        if (!empty($listaErrores)) {
            $validacionException = new ValidacionException('El archivo contiene errores', -3);
            $validacionException->setData($listaErrores);
            throw $validacionException;
        }
        $this->conexion->commit();
        return $numeroLinea;
    }

    private function verificadatosIdsuscripcion() {
        $idEmpresa = $this->sesion->get('idempresa');
	//print_r($idEmpresa);
        $this->cargarEstratoCatastralModel->verificaEstadoSuscripcionXid($idEmpresa);
        $this->cargarEstratoCatastralModel->verificaSuscripcionesRepetidas($idEmpresa);
        $this->cargarEstratoCatastralModel->verificaCantidadDigitosNumcatastral($idEmpresa,'Catastral');
    //    $this->cargarEstratoCatastralModel->verificaPropiedadesNumcatastralNew($idEmpresa);
    }
    
    private function verificadatosNumcatastral() {  
        $idEmpresa = $this->sesion->get('idempresa');
        $this->cargarEstratoCatastralModel->verificaEstadoSuscripcionXnumcatastral($idEmpresa);
        $this->cargarEstratoCatastralModel->verificaNumcatastralesRepetidos($idEmpresa);
        $this->cargarEstratoCatastralModel->verificaCantidadDigitosNumcatastral($idEmpresa,'Estratificacion');
        $this->cargarEstratoCatastralModel->verificaPropiedadesNumcatastral($idEmpresa);
    }
    

    private function procesaRegistrosNumcatastralNuevo($idEmpresa) {
        $resultado = $this->cargarEstratoCatastralModel->leerRegistrosTablaTemporal($idEmpresa,'Catastral');
        //print_r($resultado);
        if (empty($resultado)) {
            throw new MyException('Error: El archivo no contiene Información Catastral Valida para Actualizar...', -3);
            return ;
        }
        $esError = 0;
        $this->conexion->beginTransaction();
        foreach ($resultado as $registro) {
            $esError = $this->cargarEstratoCatastralModel->actualizarPropiedadNumcatastral($registro);
        }
        if ($esError == 0){
            $this->conexion->commit();
        }
        if ($esError == 1){
            $this->conexion->rollBack();
        }
        
    }
    
    private function procesaRegistrosEstratoNuevo($idEmpresa) {
        $resultado = $this->cargarEstratoCatastralModel->leerRegistrosTablaTemporal($idEmpresa,'Estratificacion');
        if (empty($resultado)) {
            throw new MyException('Error: El archivo no contiene Información de Estratificacion Valida para Actualizar...', -3);
            return ;
        }
        $esError = 0;
        $this->conexion->beginTransaction();
        foreach ($resultado as $registro) {
            $esError = $this->cargarEstratoCatastralModel->actualizarSuscripcionEstrato($registro);
        }
        if ($esError == 0){
            $this->conexion->commit();
        }
        if ($esError == 1){
            $this->conexion->rollBack();
        }
    }
    
    /*    
    private function procesarTipoSuscripcionMunicipio() {
        $parametros = array();
        $resultado = $this->cargarFactorCorreccionModel->getTipoSuscripcionMunicipio();
        if (empty($resultado)) {
            return;
        }
        foreach ($resultado as $registro) {
            $this->cargarFactorCorreccionModel->actualizarSuscripcionTipoSuscripcionMunicipio($registro['idtiposuscripcion'], $registro['factorcorreccion'], $registro['idmunicipio']);
            $parametros['idhfator'] = $registro['idhfator'];
            $parametros['idtiposuscripcion'] = $registro['idtiposuscripcion'];
            $parametros['fecha'] = $registro['fecha'];
            $parametros['idmunicipio'] = $registro['idmunicipio'];
            $this->insertarInformacionAdicional($parametros);
        }
    }

    private function procesarTipoSuscripcionMunicipioBarrio() {
        $parametros = array();
        $resultado = $this->cargarFactorCorreccionModel->getTipoSuscripcionMunicipioBarrio();
        if (empty($resultado)) {
            return;
        }
        foreach ($resultado as $registro) {
            $this->cargarFactorCorreccionModel->actualizarSuscripcionTipoSuscripcionMunicipioBarrio($registro['idtiposuscripcion'], $registro['factorcorreccion'], $registro['idmunicipio'], $registro['idbarrio']);
            $parametros['idhfator'] = $registro['idhfator'];
            $parametros['idtiposuscripcion'] = $registro['idtiposuscripcion'];
            $parametros['fecha'] = $registro['fecha'];
            $parametros['idmunicipio'] = $registro['idmunicipio'];
            $parametros['idbarrio'] = $registro['idbarrio'];
            $this->insertarInformacionAdicional($parametros);
        }
    }

    private function procesarMunicipio() {
        $parametros = array();
        $resultado = $this->cargarFactorCorreccionModel->getMunicipio();
        if (empty($resultado)) {
            return;
        }
        foreach ($resultado as $registro) {
            $this->cargarFactorCorreccionModel->actualizarSuscripcionMunicipio($registro['factorcorreccion'], $registro['idmunicipio'], $this->sesion->get('idempresa'));
            $this->cargarFactorCorreccionModel->actualizarMunicipio($registro['factorcorreccion'], $registro['idmunicipio']);
            $parametros['idhfator'] = $registro['idhfator'];
            $parametros['fecha'] = $registro['fecha'];
            $parametros['idmunicipio'] = $registro['idmunicipio'];
            $this->insertarInformacionAdicional($parametros);
        }
    }

    private function procesarMunicipioBarrio() {
        $resultado = $this->cargarFactorCorreccionModel->getMunicipioBarrio();
        if (empty($resultado)) {
            return;
        }
        foreach ($resultado as $registro) {
            $this->cargarFactorCorreccionModel->actualizarSuscripcionMunicipioBarrio($registro['factorcorreccion'], $registro['idmunicipio'], $registro['idbarrio'], $this->sesion->get('idempresa'));
            $this->cargarFactorCorreccionModel->actualizarMunicipioBarrio($registro['factorcorreccion'], $registro['idmunicipio'], $registro['idbarrio']);
            $parametros['idhfator'] = $registro['idhfator'];
            $parametros['fecha'] = $registro['fecha'];
            $parametros['idmunicipio'] = $registro['idmunicipio'];
            $parametros['idbarrio'] = $registro['idbarrio'];
            $this->insertarInformacionAdicional($parametros);
        }
    }

    private function procesarSuscripciones() {
        $resultado = $this->cargarFactorCorreccionModel->getSuscripciones();
        if (empty($resultado)) {
            return;
        }
        foreach ($resultado as $registro) {
            $this->cargarFactorCorreccionModel->actualizarSuscripcion($registro['factorcorreccion'], $registro['idsuscripcion']);
            $parametros['idsuscripcion'] = $registro['idsuscripcion'];
            $parametros['idhfator'] = $registro['idhfator'];
            $parametros['fecha'] = $registro['fecha'];
            $this->insertarInformacionAdicional($parametros);
        }
    }

    public function insertarInformacionAdicional($datos) {
        $parametros = array();
        $parametros['usu_ideregistro'] = $this->sesion->get("idusuario");
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $parametros['idfactor'] = $datos['idhfator'];
        $parametros['fechaaplica'] = $datos['fecha'];
        if (array_key_exists('idtiposuscripcion', $datos)) {
            $parametros['idtiposuscripcion'] = $datos['idtiposuscripcion'];
        }
        if (array_key_exists('idmunicipio', $datos)) {
            $parametros['idmunicipio'] = $datos['idmunicipio'];
        }
        if (array_key_exists('idbarrio', $datos)) {
            $parametros['idbarrio'] = $datos['idbarrio'];
        }
        if (array_key_exists('idsuscripcion', $datos)) {
            $parametros['idsuscripcion'] = $datos['idsuscripcion'];
        }
        $resultadoSuscripciones = $this->cargarFactorCorreccionModel->consultaSuscripciones($parametros);
        foreach ($resultadoSuscripciones as $suscripciones) {
            $parametros['idsuscripcion'] = $suscripciones['idsuscripcion'];
            $parametros['idciclo'] = $suscripciones['idciclo'];
            $parametros['idperiodo'] = $suscripciones['idperiodo'];
            $parametros['cicloanio'] = $suscripciones['cicloanio'];
            $parametros['mes'] = $suscripciones['mes'];
            $ConsultaDsHfac = $this->cargarFactorCorreccionModel->consultaDsHfac($parametros);
            if ($ConsultaDsHfac[0]['cantidad'] > 0) {
                $this->cargarFactorCorreccionModel->actualizarDsHfac($parametros);
            } else {
                $this->cargarFactorCorreccionModel->insertarDsHfac($parametros);
            }
        }
    }  */

}
