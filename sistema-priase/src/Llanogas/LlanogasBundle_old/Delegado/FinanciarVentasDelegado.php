<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\RegistrarVentasModel;
use Llanogas\LlanogasBundle\Models\FinanciarVentaModel;
use Llanogas\LlanogasBundle\Models\GenerarFinanciacionModel;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de los recaudos.
 * @author hrey
 */
class FinanciarVentasDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var RegistrarVentasModel
     */
    private $registrarVentasModel;

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
     * @var GenericoDelegado 
     */
    private $genericoDelegado;

    /**
     *
     * @var SuscripcionesDelegado 
     */
    private $suscripcionesDelegado;

    /**
     *
     * @var  FinanciarVentaModel
     */
    private $financiarVentaModel;

    /**
     *
     * @var GenerarFinanciacionModel 
     */
    private $generarFinanciacionModel;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->registrarVentasModel = new RegistrarVentasModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->suscripcionesDelegado = new SuscripcionesDelegado($control, $sesion, $this->conexion);
        $this->financiarVentaModel = new FinanciarVentaModel($this->conexion);
        $this->generarFinanciacionModel = new GenerarFinanciacionModel($this->conexion);
        $this->sesion = $sesion;
    }

    /**
     * Lista de parentescos 
     * @return type
     */
    public function getParentescos() {
        $idEmpresa = $this->sesion->get('idempresa');
        return $this->genericoModel->obtenerParentescos($idEmpresa);
    }

    /**
     * Se consultan los conceptos no financiables de la financiación de una
     * venta
     * @param type $idVenta
     * @return type
     */
    public function getConceptosVenta($idVenta) {
        //$conceptos['financiable'] = $this->financiarVentaModel->getConceptos($idVenta, 'S');
        $conceptos['nofinanciable'] = $this->financiarVentaModel->getConceptos($idVenta, 'N');
        return $conceptos;
    }

    /**
     * Se consultan los conceptos de una venta y 
     * según la liquidación existente 
     * @param type $idVenta
     * @param type $idLiquidacion
     * @return type
     * @throws MyException
     */
    public function getConceptosVentaPorLiquidacion($idVenta, $idLiquidacion) {
        $parametros = Array();
        $parametros['idventa'] = $idVenta;
        $parametros['idliquidacion'] = $idLiquidacion;
        $parametros['idempresa'] = $this->sesion->get('idempresa');

        $conceptos = $this->financiarVentaModel->getConceptosLiquidacion($parametros);
        if (empty($conceptos)) {
            throw new MyException('No se encontraron conceptos para la liquidación', 0);
        }
        return $conceptos;
    }

    /**
     * Método encargado de grabar las ventas en vfi
     * @param array $parametros información de la venta
     * @return type
     * @throws MyException
     */
    public function grabarFinanciacion(array $parametros) {
        try {
            $this->conexion->beginTransaction();
            $idempresa = $this->sesion->get('idempresa');
            if (isset($parametros['numerofinanciacion'])) {
                $idfinanciacion['numero'] = $parametros['numerofinanciacion'];
            }
            if (empty($idfinanciacion)) {
                $idfinanciacion = $this->genericoModel->obtenerNumeroDocumento($idempresa, 0, TIPO_DOCUMENTO_PAGARE_VENTA);
                $this->genericoModel->actualizarNumeroDisponible($idfinanciacion['numero'], $idfinanciacion['idnumero']);
                $parametros['numerofinanciacion'] = $idfinanciacion['numero'];
            }
            /**
             * Se guarda la financiación de la venta
             */
            $this->guardarInformacionFinanaciacion($parametros);
            $this->financiarVentaModel->actualizarInfoFinanciacionVenta($parametros['idventa'], $idfinanciacion['numero'], $parametros['cuotainicial']);
            return $idfinanciacion['numero'];
        } catch (MyException $e) {
            throw $e;
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException('Ocurrió un problema al guardar la financiación. ', -1);
        }
    }

    /**
     * Funcionalidad para guardar la información financiera de la persona que está 
     * solicitando la financiación de una venta 
     * @param array $parametros
     * @throws MyException
     */
    public function guardarInformacionFinanaciacion(array $parametros) {
        try {
            $idVenta = $parametros['idventa'];
            /**
             * Se valida que la venta exista
             */
            $this->validarVenta($idVenta);
            /**
             * Se elimina la informaciónde la venta
             */
            $this->inicializarFinanciacion($idVenta);
            $ciclos = $this->genericoModel->getCicloPeriodoSuscripcion($parametros['idsuscripcion']);

            if (!empty($parametros['personanatural'])) {
                $parametros['personanatural']['idventa'] = $idVenta;
                $this->insertarInformacionFinanciera($parametros['personanatural']);
            }
            if (!empty($parametros['personajuridica'])) {
                $parametros['personajuridica']['idventa'] = $idVenta;
                $this->insertarInformacionFinanciera($parametros['personajuridica']);
            }

            $parametros['idciclo'] = $ciclos['idciclo'];
            $parametros['idperiodo'] = $ciclos['idperiodo'];
            $parametros['cicloanio'] = $ciclos['cicloanio'];
            foreach ($parametros['financiaciones'] as $financiacion) {
                $financiacion['estado'] = 'A';
                $financiacion['idusuario'] = $this->sesion->get('idusuario');
                $financiacion['idempresa'] = $this->sesion->get('idempresa');
                $ventafinanciacion = $this->financiarVentaModel->insertarVentaFinanciacion($financiacion);
                $this->insertarDetallesFinanciacion($ventafinanciacion);
            }
            if (isset($parametros['archivos'])) {
                $this->asignarAdjuntos($parametros);
            }
            $this->conexion->commit();
        } catch (MyException $e) {
            throw $e;
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException('Error al guardar la financiación', -1);
        }
    }

    /**
     * Se inserta la información financiera
     * @param array $informacion
     */
    private function insertarInformacionFinanciera($informacion) {
        $informacion['idusuario'] = $this->sesion->get('idusuario');
        //Falta agregar teléfonos
        $this->financiarVentaModel->insertarInformacionFinanciera($informacion);
    }

    /**
     * Se insertan los detalles de una financiación 
     * @param array $financiacion
     * @throws MyException
     */
    private function insertarDetallesFinanciacion(array $financiacion) {
        foreach ($financiacion['conceptos'] as $detalle) {
            if ($detalle['valorreal'] < $detalle['valorfinanciar']) {
                throw new MyException('Error al financiar el concepto ' . $detalle['idconcepto'] . ' ' . $detalle['concepto']);
            }
            $detalle['idusuario'] = $this->sesion->get('idusuario');
            $detalle['idempresa'] = $this->sesion->get('idempresa');
            $detalle['idventafinanciacion'] = $financiacion['idventafinanciacion'];
            $this->financiarVentaModel->insertarDetallesFinanciacion($detalle);
        }
    }

    /**
     * Se procesan los archivos a la financiación
     * @param array $listaArchivos
     * @return type
     * @throws MyException
     */
    public function setArchivo(array $listaArchivos) {
        try {
            $archivos = array();
            foreach ($listaArchivos as $archivo) {
                $archivo['tipoarchivo'] = 'pdf';
                $archivos[] = $this->financiarVentaModel->insertarAdjunto($archivo);
            }
            return $archivos;
        } catch (\Exception $e) {
            throw new MyException('Error al adjuntar el archivo ', -1);
        }
    }

    /**
     * Se asigna el adjunto a la financiación
     * @param type $informacion
     * @throws MyException
     */
    public function asignarAdjuntos($informacion) {
        if (empty($informacion['archivos'])) {
            throw new MyException('Error, Debe seleccionar un archivo', -1);
        }
        foreach ($informacion['archivos'] as $archivo) {
            $this->financiarVentaModel->actualizarAdjuntos($archivo['idarchivo'], $informacion['idventa'], $informacion['numerofinanciacion']);
        }
    }

    /**
     * Se crea la financiación de la venta en vfi
     * @param type $idVenta
     * @param type $idfinanciacion
     * @return type
     */
    public function getFinanciacion($idVenta, $idfinanciacion = null) {
        /* $financiacion = $this->financiarVentaModel->getFinanciacion($idVenta);
          if (empty($financiacion)) {
          return null;
          } */
        //Consultar interés de una liquidación de la financiación Angélica Gómez
//        $formula = json_decode($financiacion['interes'], true);
//        $financiacion['interes'] = $formula[0]['valor'];
        $financiaciones = $this->getFinanciaciones($idVenta);
        if (!empty($financiaciones)) {
            $idusuario = $this->sesion->get('idusuario');
            $financiacion['financiable'] = $financiaciones;
            $financiacion['nofinanciable'] = $this->financiarVentaModel->getConceptos($idVenta, 'N');
            $financiacion['informacionfinanciera'] = $this->financiarVentaModel->getInformacionFinanciera($idVenta, $idusuario);
            $financiacion['solicitante'] = $this->genericoModel->getTerceroInfo($financiaciones[0]['idsolicitante']);
            $financiacion['financieraentidad'] = $this->genericoModel->getTerceroInfo($financiaciones[0]['identidadfinanciera']);
            if (!empty($idfinanciacion)) {
                $financiacion['adjuntos'] = $this->financiarVentaModel->getAdjuntosVenta($idfinanciacion ,$idVenta);
            }
            return $financiacion;
        } else {
            return null;
        }
    }

    /**
     * Se consulta la financiación con toda la información 
     * @param type $idventa
     * @return type
     */
    public function getFinanciaciones($idventa) {
        $informacion = Array();
        $idempresa = $this->sesion->get('idempresa');
        $financiaciones = $this->financiarVentaModel->getFinanciacionesVenta($idventa);
        foreach ($financiaciones as $financiacion) {
            $conceptos = $this->financiarVentaModel->getConceptoDetalleFinanciacion(intval($financiacion['idventafinanciacion']), $idempresa);
            $financiacion['conceptos'] = $conceptos;
            $interes = $this->generarFinanciacionModel->consultarInteresLiquidacionModel($financiacion['idliquidacion']);
            if (!empty($interes)) {
                /**
                 * Se consulta la fórmula del concepto de intéres y se interpreta
                 */
                $interes = json_decode($interes['formulainteres'], true);
                $financiacion['interes'] = $interes[0]['valor'];
            }
            $informacion[] = $financiacion;
        }
        return $informacion;
    }

    public function getIdFinanciacion() {
        return $this->financiarVentaModel->getIdFinanciacion();
    }

    public function getLiquidaciones($idVenta) {
        $idusuario = $this->sesion->get('idusuario');
        return $this->financiarVentaModel->getLiquidacionesVenta($idVenta, $idusuario);
    }

    public function inicializarFinanciacion($idVenta) {
        $idusuario = $this->sesion->get('idusuario');
        $this->financiarVentaModel->inicializarFinanciacionVenta($idVenta, $idusuario);
    }

    public function eliminarNumeroVenta($idVenta) {
        $idusuario = $this->sesion->get('idusuario');
        $this->financiarVentaModel->eliminarNumeroVenta($idVenta, $idusuario);
    }

    private function validarVenta($idVenta) {
        $resultado = $this->financiarVentaModel->validarVenta($idVenta);
        if ($resultado == 0) {
            throw new MyException('Error, no se permite financiar (Debe modificar el método de pago de la venta)', -3);
        }
    }

    public function getInformacionUnidadPorClase($idClase) {
        $idEmpresa = $this->sesion->get('idempresa');
        $idUsuario = $this->sesion->get('idusuario');
        return $this->financiarVentaModel->getInformacionUnidadPorClase($idClase, $idEmpresa);
    }
    
    public function getLiquidacionesSimulador(){
        $idusuario = $this->sesion->get('idusuario');
        $idempresa = $this->sesion->get('idempresa');
        return $this->financiarVentaModel->getLiquidacionesSimulador($idusuario, $idempresa);
    }
    
   
}
