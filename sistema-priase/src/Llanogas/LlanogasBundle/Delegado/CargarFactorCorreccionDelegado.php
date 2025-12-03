<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\CargarFactorCorreccionModel;
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
 * Description of CargarFactorCorreccionDelegado
 *
 * @author jeisson
 */
class CargarFactorCorreccionDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\CargarFactorCorreccionModel 
     */
    private $cargarFactorCorreccionModel;

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
     * @param Controller $control Controlador desde el cual se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->cargarFactorCorreccionModel = new CargarFactorCorreccionModel($this->conexion, $sesion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $sesion;
    }

    public function cargarFactorCorreccion(Request $request, $cargueIndustrial = null ) {
        try {            
            $this->validaSiExisteDatosCargadosMismoDia($cargueIndustrial);
            $idUsuario = $this->sesion->get('idusuario');
            $listaArchivos = Util::subirAdjunto($request, $idUsuario, 'factorcorreccion');
            $archivo = $listaArchivos[0];
            $listaLineas = $this->leerArchivo($archivo['rutaarchivo']);
            $numeroRegistros = $this->procesarLineas($listaLineas);
            $this->procesarRegistros($cargueIndustrial);
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

    private function getInfoRegistroArchivo($registro) {
        if (count($registro) != 18) {
            throw new MyException('El archivo no tiene el formato correcto', -3);
        }
        $i = 0;
        $infoRegistro = array();
        $infoRegistro['codigomunicipio'] = trim($registro[$i++]);
        $infoRegistro['codigobarrio'] = trim($registro[$i++]);
        $infoRegistro['idtiposuscripcion'] = trim($registro[$i++]);
        $infoRegistro['codigoanterior'] = trim($registro[$i++]);
        $infoRegistro['factorcorreccion'] = str_replace(',', '.', trim($registro[$i++]));
        $infoRegistro['kp'] = str_replace(',', '.', trim($registro[$i++]));
        $infoRegistro['pm'] = str_replace(',', '.', trim($registro[$i++]));
        $infoRegistro['pe'] = str_replace(',', '.', trim($registro[$i++]));
        $infoRegistro['pa'] = str_replace(',', '.', trim($registro[$i++]));
        $infoRegistro['nivmar'] = str_replace(',', '.', trim($registro[$i++]));
        $infoRegistro['tm'] = str_replace(',', '.', trim($registro[$i++]));
        $infoRegistro['ndn'] = str_replace(',', '.', trim($registro[$i++]));
        $infoRegistro['tn'] = str_replace(',', '.', trim($registro[$i++]));
        $infoRegistro['df'] = str_replace(',', '.', trim($registro[$i++]));
        $infoRegistro['kt'] = str_replace(',', '.', trim($registro[$i++]));
        $infoRegistro['te'] = str_replace(',', '.', trim($registro[$i++]));
        $infoRegistro['fpv'] = str_replace(',', '.', trim($registro[$i++]));
        $infoRegistro['computador'] = trim($registro[$i++]);
        $infoRegistro['idempresa'] = $this->sesion->get('idempresa');
        
        return $infoRegistro;
    }

    private function leerArchivo($archivo) {
        $listaLineas = array();
        $file = fopen($archivo, "r");
        $numeroLinea = 0;
        while ($linea = fgets($file)) {
            $numeroLinea++;
            $registro = explode(';', $linea);
            $listaLineas[] = $this->getInfoRegistroArchivo($registro);
        }
        return $listaLineas;
    }

    private function procesarLineas(array $listaLineas) {
        $this->conexion->beginTransaction();
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $numeroLinea = 0;
        $listaErrores = array();
        $esError = 0;
        foreach ($listaLineas as $linea) {
            try {
                if ($esError == 1) {
                    $this->conexion->beginTransaction();
                }
                $linea['idsuscripcion'] = (empty($linea['codigoanterior'])) ? null : $this->cargarFactorCorreccionModel->getIdSuscripcion($linea['codigoanterior']);
                $linea['idmunicipio'] = (empty($linea['codigomunicipio'])) ? null : $this->cargarFactorCorreccionModel->getIdMunicipio($linea['codigomunicipio'], $parametros['idempresa']);
                $linea['idbarrio'] = (empty($linea['codigobarrio'])) ? null : $this->cargarFactorCorreccionModel->getIdBarrio($linea['codigobarrio'], $linea['codigomunicipio'], $parametros['idempresa']);
                $this->cargarFactorCorreccionModel->insertarFactor($linea);
                if ($esError==1) {
                     $this->conexion->rollBack();
                }
            } catch (\Exception $e) {
                $error['codigoanterior'] = $linea['codigoanterior'];
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

    private function procesarRegistros($cargueIndustrial) {
        $this->actualizaMunicipio();
        $this->actualizaMunicipioBarrio();
        try{
                $idEmpresa = $this->sesion->get('idempresa');
            $this->conexion->beginTransaction();
                $this->cargarFactorCorreccionModel->actualizaJsonHfact($idEmpresa, $cargueIndustrial);
            $this->conexion->commit();
            $this->conexion->beginTransaction();
                $this->cargarFactorCorreccionModel->actualizaSuscripcionesFactorCorreccion($idEmpresa);
            $this->conexion->commit();
        } catch (\Exception $e){
            $this->conexion->rollBack();
        }
    }
    
    public function validaSiExisteDatosCargadosMismoDia($cargueIndustrial = null){
        $respuesta = $this->cargarFactorCorreccionModel->validaSiExisteDatosCargadosMismoDiaModel();              
        $respuesta > 0 ? $this->cargarFactorCorreccionModel->eliminaDatosCargadosMismoDiaModel() : $this->cargarFactorCorreccionModel->validaDatosCargadosMismoMesModel($cargueIndustrial);
    }
    
    public function actualizaMunicipio(){
        $resultadoMunicipios = $this->cargarFactorCorreccionModel->getMunicipio();
        if (empty($resultadoMunicipios)){
            return;
        }
        foreach ($resultadoMunicipios as $municipio){
            try {
                $this->conexion->beginTransaction();
                    $factorCorreccion = $municipio['factorcorreccion'];
                    $idMunicipio = $municipio['idmunicipio'];
                    $this->cargarFactorCorreccionModel->actualizarMunicipio($factorCorreccion, $idMunicipio);
                $this->conexion->commit();
            } catch (\Exception $ex) {
                $this->conexion->rollBack();
            }
        }
    }
    
    public function actualizaMunicipioBarrio(){
        $resultadoMunicipioBarrio = $this->cargarFactorCorreccionModel->getMunicipioBarrio();
        if (empty($resultadoMunicipioBarrio)){
            return;
        }
        foreach ($resultadoMunicipioBarrio as $municipioBarrio){
            try {
                $this->conexion->beginTransaction();
                    $factorCorreccion = $municipioBarrio['factorcorreccion'];
                    $idMunicipio = $municipioBarrio['idmunicipio'];
                    $idBarrio = $municipioBarrio['idbarrio'];
                    $this->cargarFactorCorreccionModel->actualizarMunicipioBarrio($factorCorreccion, $idMunicipio, $idBarrio) ;
                $this->conexion->commit();
            } catch (\Exception $ex) {
                $this->conexion->rollBack();
            }
        }
    }
}
