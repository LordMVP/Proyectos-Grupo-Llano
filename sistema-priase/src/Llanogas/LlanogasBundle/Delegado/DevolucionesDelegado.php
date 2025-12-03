<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\DevolucionesModel;
use Llanogas\LlanogasBundle\Models\AnularModel;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;

/**
 * Description of CerrarLecturasDelegado
 * Registra las devoluciones de un anticipo sin aplicar
 * @author progredidev1
 */
class DevolucionesDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

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
     *
     * @var DevolucionesModel 
     */
    private $devoluciones;

    /**
     *
     * @var GenerarNotasDelegado 
     */
    private $generarNotasDelegado;

    /**
     *
     * @var Anular recaudo Model
     */
    private $anularRecaudo;
    /*
     * 
     */
    private $idRecaudoActual;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->devoluciones = new DevolucionesModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $sesion;
        $this->generarNotasDelegado = new GenerarNotasDelegado($this->conexion);
        $this->anularRecaudo = new AnularModel($this->conexion);
    }

    /**
     * lista las suscripcionesdisponibles
     * @param suscripcion $suscripcion
     * @return listado de suscripciones
     */
    public function obtenerSuscripciones($suscripcion, $cedula, $codigoanterior) {
        $resultado = $this->devoluciones->obtenerSuscripciones($suscripcion, $cedula, $codigoanterior);
        if (empty($resultado)) {
            throw new MyException('Error, no se encontraron suscripciones', 0);
        }
        return $resultado;
    }

    /**
     * Consulta los motivos por el cual se está realizando la devolución
     * @return type
     */
    public function obtenerMotivos() {
        $resultado = $this->devoluciones->obtenerMotivos();
        if (empty($resultado)) {
            throw new MyException('Error, no se encontraron motivos ', 0);
        }
        return $resultado;
    }

    /**
     * permite obtener el detalle del recaudo o factura solicitada
     * @param $idfacturarecaudo identificador de la factuara o el recaudo
     * @param $tipo caracter que identifica el tipo de la consulta (F , R)
     * @return Registro que identifica la factura o el recaudo
     * */
    public function obtenerDetalleRecaudoFactura($idfacturarecaudo, $tipo) {
        return $this->devoluciones->obtenerDetalleRecaudoFactura($idfacturarecaudo, $tipo);
    }

    /**
     * Consulta los recaudos que se puedan eliminar 
     * @param type $suscripcion
     * @return type
     */
    public function obtenerDevoluciones($suscripcion) {
        $resultado = $this->devoluciones->obtenerDevoluciones($suscripcion);
        if (empty($resultado)) {
            throw new MyException('Error, no se encontraron devoluciones ', 0);
        }
        return $resultado;
    }

    /**
     * Guarda la devolución 
     * @param type $informacion
     * @return type
     * @throws MyException
     */
    public function grabarDevoluciones($informacion) {        
        $respuesta = array();
        $transaccion = array();
        $transaccion['tipotransaccion'] = 'DV';
        $transaccion['idsuscripcion'] = $informacion['idsuscripcion'];
        $transaccion['idusuario'] = $this->sesion->get('idusuario');
        $transaccion['idempresa'] = $this->sesion->get('idempresa');
        $transaccion['nota']['idmotivonota'] = $informacion['idmotivo'];
        $transaccion['nota']['comentario'] = $informacion['comentario'];
        try {
            foreach ($informacion['devoluciones'] as $devolucion) {
                /**
                 * Si la devolución proviene de una factura (Ésta funcionalidad 
                 * ya no se utiliza)
                 */
                if ($devolucion['proceso'] == 'F') {
                    $respuesta[] = $this->procesarDevolucionFactura($devolucion, $transaccion);
                } else {
                    /**
                     * Devoluciones generadas por un recaudo
                     */
                    $this->anularRecaudo->modificarEstadoRecaudo($devolucion['idfacturarecaudo'], 'D');
                    $respuesta[] = $this->procesarDevolucionRecaudo($devolucion, $transaccion);
                }
            }
        } catch (\Exception $e) {            
            throw new MyException($e->getMessage(), -1);
        }
        return $respuesta;
    }

    /**
     * Procesa la devolución de una factura 
     * @param type $devolucion
     * @param array $transaccion
     * @return type
     */
    private function procesarDevolucionFactura($devolucion, $transaccion) {
        $transaccion['factura'] = $this->genericoModel->getFactura($devolucion['idfacturarecaudo']);
        return $this->generarNotasDelegado->procesarDevolucionFactura($transaccion);
    }

    /**
     * Procesa la devolución de un recaudo y genera las notas 
     * correspondientes al recaudo que se está devolviendo 
     * @param type $devolucion
     * @param type $transaccion
     * @return type
     * @throws MyException
     */
    private function procesarDevolucionRecaudo($devolucion, $transaccion) {
        $transaccion['recaudo'] = $this->genericoModel->getRecaudo($devolucion['idfacturarecaudo']);
        /**
         * Para realizar la devolución el recaudo debe estar consignado 
         */
        if (!is_numeric($transaccion['recaudo']['idconsignacion'])) {
            throw new MyException('El recaudo no se encuentra consignado');
        }
        //$transaccion['recaudo']['version'] = 1;
        $listaDistribucion = $this->genericoModel->getDistribucionRecaudo($devolucion['idfacturarecaudo'], $transaccion['idsuscripcion']);
        $transaccion['distribucionrecaudo'] = $listaDistribucion;
        $transaccion['vlrrecaudodevolucion'] = $devolucion['vlrdevolucion'];
        return $this->generarNotasDelegado->procesarDevolucionRecaudo($transaccion);
    }
    
    public function consultaProcesoAplicar($datosDevolucion){
        $respuesta = array();
        $this->conexion->beginTransaction();
        $concatenarRecaudos = array();
        $version = 1;
        try {           
            foreach ($datosDevolucion['devoluciones'] as $devolucion) {
                if(array_key_exists($devolucion['idfacturarecaudo'], $concatenarRecaudos)){
                         $concatenarRecaudos[$devolucion['idfacturarecaudo']] =  $concatenarRecaudos[$devolucion['idfacturarecaudo']] + $devolucion['vlrdevolucion'];
                    }else{
                       $concatenarRecaudos[$devolucion['idfacturarecaudo']] = $devolucion['vlrdevolucion'];
                    }
                    $version = $devolucion['version'];
            }
            foreach($concatenarRecaudos as $indice => $validarRecaudo){
                $i=0;
                $idrecaudoPadre = $indice;
                $vlrDevolucion = $validarRecaudo;
                $respuesta[] =  $this->validacionRecaudos($datosDevolucion,$idrecaudoPadre, $vlrDevolucion,$i , $version);
                $i++;
            }
        $this->conexion->commit();
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException($e->getMessage(), -1);
        }
        return $respuesta;
    }
    
    /*
     * caso_1 =>    recaudo Aplicado parcialmente con devolucion total
     * caso_2 =>    Recaudo sin aplicar y con devolucion total
     * caso_3 =>    Recaudo sin aplicar y con devolucion parcial
     * caso_4 =>    Recaudo aplicado parcialmente y con devolucion parcial
     */
    public function validacionRecaudos($datosDevolucion, $idrecaudoPadre, $vlrDevolucion, $i, $version){     
        $respuesta = array();         
        $armaDataDevolucion = array();
        $caso = $this->devoluciones->validarTipoCasoDevolucion($idrecaudoPadre, $vlrDevolucion);
            if(empty($caso)){
                throw new MyException('No se encontro coincidencia con los Casos Programados ',-1);
            }  
            if( $caso[0]['caso']=='caso2'){
                foreach ($datosDevolucion['devoluciones'] as $devolucionesTotal){
                    if(in_array($idrecaudoPadre, $devolucionesTotal)){
                        if(in_array($idrecaudoPadre, $armaDataDevolucion['devoluciones'])){
                            break;
                        }
                        $armaDataDevolucion['idmotivo'] = $datosDevolucion['idmotivo'];
                        $armaDataDevolucion['comentario'] = $datosDevolucion['comentario'];
                        $armaDataDevolucion['idsuscripcion'] = $datosDevolucion['idsuscripcion'];
                        $armaDataDevolucion['devoluciones'][$i]['idfacturarecaudo'] =  $idrecaudoPadre;
                        $armaDataDevolucion['devoluciones'][$i]['vlrdevolucion'] = $vlrDevolucion;
                        $armaDataDevolucion['devoluciones'][$i]['proceso'] = 'R' ;
                        $armaDataDevolucion['devoluciones'][$i]['version'] = $version ;                    
                    }
                }
            }    
        $respuesta = $caso[0]['caso']=='caso2' ? $this->grabarDevoluciones($armaDataDevolucion) : $this->actualizaRecaudoPadreDire_InsertRecaudoDevolucion($idrecaudoPadre,$vlrDevolucion, $datosDevolucion, $i,  $version);
        return   $respuesta;
    }
    
    public function actualizaRecaudoPadreDire_InsertRecaudoDevolucion($idrecaudoPadre,$vlrDevolucion, $datosDevolucion, $i,$version){ 
        $armaDataDevolucion = array();
        
        try{
            $armaDataDevolucion['idmotivo'] = $datosDevolucion['idmotivo'];
            $armaDataDevolucion['comentario'] = $datosDevolucion['comentario'];
            $armaDataDevolucion['idsuscripcion'] = $datosDevolucion['idsuscripcion'];
            
            //se hace la insert del nuevo recaudo para efectuar la devolucion
            $this->idRecaudoActual =  $this->insertarRecaudo($idrecaudoPadre);
            // se inserta la(S) nueva distribuciones que tenga el recaudo padre para hacer la devolucion
            $this->insertarDistribucionRecuado($this->idRecaudoActual, $datosDevolucion['devoluciones'], $idrecaudoPadre);

            //se realiza la actualizacion del recaudo Padre restando los valores referenciados
            $this->actualizaRecaudoDistribucionPadre($idrecaudoPadre, $datosDevolucion);

            //  finalmente se envia al metodo que tenia el software inicialmente enviando el Nuevo idRecaudo creado para la devolucion 
            $armaDataDevolucion['devoluciones'][$i]['idfacturarecaudo'] =  $this->idRecaudoActual;
            $armaDataDevolucion['devoluciones'][$i]['vlrdevolucion'] = $vlrDevolucion;
            $armaDataDevolucion['devoluciones'][$i]['proceso'] = 'R' ;
            $armaDataDevolucion['devoluciones'][$i]['version'] = $version ;                
            return $this->grabarDevoluciones($armaDataDevolucion);
            
        } catch (\Exception $e){
            throw new MyException($e->getMessage(), -1);
        }
    }
    
     /**
     * Construye objeto de recaudo y envía para que sea registrado en base de datos
     * @param string $estado - Estado con el que se registra el recaudo
     */
    private function insertarRecaudo($idrecaudoPadre) {
        
        $recaudoPadreActual = $this->devoluciones->consultaRecaudo($idrecaudoPadre);
        $recaudoPadreActual['fecha'] = 'now()';
        $recaudoPadreActual['vlrpagado'] = 0;
        $recaudoPadreActual['cambio'] = 0;
        $recaudoPadreActual['ajuste'] = 0;
        $recaudoPadreActual['vlrreal'] = 0;
        $recaudoPadreActual['version'] = 1;
        $recaudoPadreActual['idorigen'] = $idrecaudoPadre;
        return $this->devoluciones->insertarRecaudo($recaudoPadreActual);
        
    }
    
    private function insertarDistribucionRecuado($idRecaudoActual, $datosDevolucion, $idrecaudoPadre){
        $resultado = array();
        foreach ($datosDevolucion as $devolucion){
            if(in_array($idrecaudoPadre, $devolucion)){
                $distribucionPadreActual =  $this->devoluciones->consultaDistribucionRecaudo($devolucion['codigodistribucion']);
                $distribucionPadreActual['vlrrecaudo'] = ($devolucion['vlrdevolucion']);
                $distribucionPadreActual['sdorecaudo'] = ($devolucion['vlrdevolucion']);
                $distribucionPadreActual['idrecaudo'] = $idRecaudoActual;
                $distribucionPadreActual['iddireorigen'] = $devolucion['codigodistribucion'];
                $distribucionPadreActual['iddirepadre'] = $devolucion['codigodistribucion'];
                $resultado[] = $this->devoluciones->insertarDistribucionRecaudo($distribucionPadreActual);
            }
        }
        $resultado[] = $this->devoluciones->actualizaRecaudo($idRecaudoActual);
        
        return $resultado;
    }
    
    
    public function actualizaRecaudoDistribucionPadre($idrecaudoPadre, $datosDevolucion){
        try{
            foreach ($datosDevolucion['devoluciones'] as $devoluciones){
                if (in_array($idrecaudoPadre, $devoluciones)){
                    $recaudoDistribucionActual = $this->devoluciones->consultaDistribucionRecaudo($devoluciones['codigodistribucion']);
                    $vlrAplicarDistribucionPadreSdo =   $recaudoDistribucionActual['sdorecaudo'] - $devoluciones['vlrdevolucion'];
                    $vlrAplicarDistribucionPadreVlr =   $recaudoDistribucionActual['vlrrecaudo'] - $devoluciones['vlrdevolucion'];
                    if($vlrAplicarDistribucionPadreSdo >= 0){
                        $this->devoluciones->actualizaDistribucionRecaudoPadre($idrecaudoPadre, $vlrAplicarDistribucionPadreSdo, $devoluciones['codigodistribucion'], $recaudoDistribucionActual['version'], $vlrAplicarDistribucionPadreVlr);
                        $this->devoluciones->actualizaRecaudo($idrecaudoPadre);
                    }
                }
                $recaudoDistribucionActual = '';
                $vlrAplicarDistribucionPadreSdo='';
                $vlrAplicarDistribucionPadreVlr='';
            }
        } catch (\Exception $e){
            throw  new MyException('Error actualizando el recaudo Padre' . $idrecaudoPadre, -1);
        }
    }

    
 

}
