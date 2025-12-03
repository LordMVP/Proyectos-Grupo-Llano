<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\RegistrarVentasModel;
use Llanogas\LlanogasBundle\Models\FacturarSuscripcionModel;
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
class RegistrarVentasDelegado {

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
     * @var FacturarSuscripcionModel  
     */
    private $facturarSuscripcionModel;

    /**
     *
     * @var FacturarSuscripcionDelegado 
     */
    private $facturarSuscripcionDelegado;

    /**
     *
     * @var FinanciarVentasDelegado 
     */
    private $financiarVentaDelegado;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface &$sesion, $idSuscripcion = null) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->registrarVentasModel = new RegistrarVentasModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->suscripcionesDelegado = new SuscripcionesDelegado($control, $sesion, $this->conexion);
        $this->facturarSuscripcionModel = new FacturarSuscripcionModel($this->conexion);
        $this->facturarSuscripcionDelegado = new FacturarSuscripcionDelegado($this->conexion, $sesion->get('idacceso'), $idSuscripcion, PROGRAMA_VENTAS);
        $this->financiarVentaDelegado = new FinanciarVentasDelegado($control, $sesion);
        $this->sesion = $sesion;
    }

    public function getFirmasInstaladoras($nombre) {
        $listaFirmasInstaladoras = $this->registrarVentasModel->getFirmasInstaladoras($nombre);
        if (empty($listaFirmasInstaladoras)) {
            throw new MyException('No se encontraron firmas instaladoras', 0);
        }
        return $listaFirmasInstaladoras;
    }

    public function getFuncionariosFirma($idFirmaInstaladora) {
        $listaFuncionarios = $this->registrarVentasModel->getFuncionarioFirma($idFirmaInstaladora);
        if (empty($listaFuncionarios)) {
            throw new MyException('No se encontraron funcionarios', 0);
        }
        return $listaFuncionarios;
    }

    public function validarResolucionFacturacion($iddocumento) {

        $idempresa = $this->sesion->get('idempresa');
        return $this->registrarVentasModel->ValidarResolucionFacturacion($iddocumento, $idempresa);
    }

    public function getAsesores($nombreAsesor) {
        return $this->genericoDelegado->consultarTerceros(UNIDAD_TERCEROS, $nombreAsesor);
    }

    public function getOrganismosInspeccion($nombreOrganismo) {
        return $this->genericoDelegado->consultarTerceros(UNIDAD_ORGANISMOSINSPECCION, $nombreOrganismo);
    }

    public function getTiposDocumentos($idTipoUsoSuscripcion, $idMunicipio) {
        $idUsuario = $this->sesion->get('idusuario');
        $idEmpresa = $this->sesion->get('idempresa');
        $listaTiposDocumentos = $this->registrarVentasModel->getTiposDocumentos($idUsuario, $idEmpresa, $idTipoUsoSuscripcion, $idMunicipio, PROGRAMA_VENTAS);
        return $listaTiposDocumentos;
    }

    public function getDocumentos($idTipoDocumento, $tipoVenta) {
        $idUsuario = $this->sesion->get('idusuario');
        $idEmpresa = $this->sesion->get('idempresa');
        $listaTiposDocumentos = $this->registrarVentasModel->getDocumentos($idUsuario, $idEmpresa, $idTipoDocumento, $tipoVenta);
        if (empty($listaTiposDocumentos)) {
            throw new MyException('No se encontraron documentos', 0);
        }
        return $listaTiposDocumentos;
    }

    public function getLiquidaciones($idSuscripcion, $idTipoDocumento, $idDocumento) {
        $idEmpresa = $this->sesion->get('idempresa');
        $parametros = $this->getsuscripcionInfo($idSuscripcion);
        $idmunicipio = $parametros['idmunicipio'];
        $listaLiquidaciones = $this->registrarVentasModel->getLiquidaciones($idEmpresa, $idTipoDocumento, $idDocumento, $idmunicipio,$idSuscripcion);
        if (empty($listaLiquidaciones)) {
            throw new MyException('No se encontraron registros ', 0);
        }
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $listaLiquidacionesEspeciales = $this->registrarVentasModel->getLiquidacionesEspeciales($parametros);
        foreach ($listaLiquidacionesEspeciales as $liquidacion) {
            $listaLiquidaciones[] = $liquidacion;
        }
        return $listaLiquidaciones;
    }

    private function getsuscripcionInfo($idSuscripcion) {
        $parametros = array();
        $infoSuscripcion = $this->suscripcionesDelegado->getDetalleSuscripcion($idSuscripcion);
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idmunicipio'] = $infoSuscripcion['propiedad']['idmunicipio'];
        $parametros['idbarrio'] = $infoSuscripcion['propiedad']['idbarrio'];
        $parametros['estrato'] = $infoSuscripcion['suscripcion']['estrato'];
        $parametros['idtipousosuscripcion'] = $infoSuscripcion['suscripcion']['idtipousosuscripcion'];
        return $parametros;
    }

    public function getConceptos($idLiquidacion) {
        $listaConceptos = $this->registrarVentasModel->getConceptosVentas($idLiquidacion, PROGRAMA_VENTAS);
        if (empty($listaConceptos)) {
            throw new MyException('No se encontraron conceptos ', 0);
        }
        return $listaConceptos;
    }

    public function getVentasPorSuscripcion($idsuscripcion, $estado) {
        $parametros['estado'] = $estado;
        $parametros['idsuscripcion'] = $idsuscripcion;
        $parametros['idusuario'] = $this->sesion->get('idusuario');
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $listaVentas = $this->registrarVentasModel->getVentas($parametros);
        if (empty($listaVentas)) {
            throw new MyException('No se encontraron ventas asociadas a la suscripción', 0);
        }
        return $listaVentas;
    }

    public function getVentas(array $parametros) {
        $parametros['idusuario'] = $this->sesion->get('idusuario');
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $listaVentas = $this->registrarVentasModel->getVentas($parametros);
        if (empty($listaVentas)) {
            throw new MyException('No se encontraron ventas ', 0);
        }
        $listaRegistrosVentas = array();
        foreach ($listaVentas as $venta) {
            $listaRegistros = array();
            $listaRegistros['infoventa']['venta'] = $venta;
            $listaRegistros['infoventa']['venta']['liquidaciones'] = $this->registrarVentasModel->getLiquidacionesVenta($venta['idventa']);
            $listaRegistros['infoventa']['detalleventa'] = $this->registrarVentasModel->getDetalleVenta($venta['idventa']);
            $listaRegistros['infoventa']['venta']['adjuntos'] = $this->registrarVentasModel->getAdjuntosVenta($venta['idventa']);
            $listaRegistros['infoventa']['financiacion'] = $this->financiarVentaDelegado->getFinanciacion($venta['idventa'], $venta['idfinanciacion']);

            if (!empty($venta['idcompetenciafirma'])) {
                $listaRegistros['infoventa']['firmainstaladora'] = $this->registrarVentasModel->getFirmaInstaladoraVenta($venta['idcompetenciafirma']);
            }
            if (!empty($venta['idasesor'])) {
                $listaRegistros['infoventa']['asesor'] = $this->genericoModel->getTerceroInfo($venta['idasesor']);
            }
            if (!empty($venta['idagenda'])) {
                $listaRegistros['infoventa']['agenda'] = $this->registrarVentasModel->getAgenda($venta['idagenda']);
            }
            if (!empty($venta['idorganismoinspeccion'])) {
                $listaRegistros['infoventa']['organismoinspeccion'] = $this->genericoModel->getTerceroInfo($venta['idorganismoinspeccion']);
            }
            $listaRegistros['infoventa']['infosuscripcion'] = $this->suscripcionesDelegado->getDetalleSuscripcion($venta['idsuscripcion']);
            
            $cambiosEncabezado = $this->registrarVentasModel->buscaEncabezadosHistoricoCambios($venta['idventa']);
            $envioDetalles = array();
            $listaRegistros['infoventa']['detallesCambios'] = 0;
            if(!empty($cambiosEncabezado)){
                $listaRegistros['infoventa']['cambiosEncabezado'] = $cambiosEncabezado;
                foreach ($cambiosEncabezado as $datosEncabezados){
                    $detalleCambios = $this->registrarVentasModel->buscaDetallesHistoricoCambios($datosEncabezados['tipo'],$datosEncabezados['venanterior'], $datosEncabezados['venactualizado']);
                        if(!empty($detalleCambios)){
                            
                            $envioDetalles[] = $detalleCambios;
                        }
                        
                }
                $listaRegistros['infoventa']['detallesCambios'] = $envioDetalles;
            }
            $listaRegistrosVentas[] = $listaRegistros;
        }
        return $listaRegistrosVentas;
    }

    public function liquidarVenta(array $listaConceptos, $liquidaciones) {
        $listaConceptosLiquidados = array();
        $conceptosOrdenados = $this->getConceptos($liquidaciones);
        $this->validarConceptosEliminados($listaConceptos, $conceptosOrdenados, $listaConceptosLiquidados);
        $venta = array();
        foreach ($listaConceptos as $concepto) {
            $infoConcepto = $this->facturarSuscripcionModel->getConceptoInformacion($concepto['idconcepto']);
            $infoConcepto['editable'] = $concepto['editable'];
            $this->validarNumeroTotal($infoConcepto, $concepto);
            if (($infoConcepto['idprograma'] == PROGRAMA_VENTAS && $infoConcepto['tipocalculo'] == 'V' ) || $concepto['eliminado'] == 'S') {
                $infoConcepto['valortotal'] = $concepto['valortotal'];
                $infoConcepto['cantidad'] = $concepto['cantidad'];
                $infoConcepto['valorunitario'] = $concepto['valorunitario'];
                $this->calcularValorConceptoRegistro($infoConcepto);
                $listaConceptosLiquidados[] = $infoConcepto;
            } else if ($infoConcepto['tipocalculo'] == 'V') {
                $this->facturarSuscripcionDelegado->setListaConceptosLiquidados($listaConceptosLiquidados);
                $infoConcepto = $this->facturarSuscripcionDelegado->iniciarLiquidacionConcepto($concepto['idconcepto'], $liquidaciones, $infoConcepto);
                $listaConceptosLiquidados[] = $infoConcepto;
            }
        }
        $valorVenta = 0;
        $conceptosVenta = array();
        foreach ($listaConceptos as $concepto) {
            if ($concepto['editable'] == 'N') {
                $infoConcepto['valortotal'] = NULL;
                $infoConcepto['cantidad'] = NULL;
                $infoConcepto['valorunitario'] = NULL;
            }
            $this->facturarSuscripcionDelegado->setListaConceptosLiquidados($listaConceptosLiquidados);
            $infoConcepto = $this->facturarSuscripcionDelegado->iniciarLiquidacionConcepto($concepto['idconcepto'], $liquidaciones);
            $infoConcepto['eliminar'] = $concepto['eliminar'];
            $infoConcepto['eliminado'] = $concepto['eliminado'];
            $infoConcepto['idliquidacion'] = $concepto['idliquidacion'];
            ConceptosUtil::redondearConceptoVenta($infoConcepto);
            $conceptosVenta[] = $infoConcepto;
            $valorVenta += round($infoConcepto['valorreal'], CANTIDAD_DECIMALES);
        }
        $listaConceptosVenta = array();
        foreach ($conceptosOrdenados as $conceptoOrdenado) {
            foreach ($conceptosVenta as $conceptoVenta) {
                if ($conceptoVenta['idconcepto'] == $conceptoOrdenado['idconcepto']) {

                    $listaConceptosVenta[] = $conceptoVenta;
                }
            }
        }
        $venta['conceptos'] = $listaConceptosVenta;
        $venta['valor'] = round($valorVenta, CANTIDAD_DECIMALES);
        return $venta;
    }

    /**
     * Se valida que los conceptos se puedan realizar la eliminación 
     * @param array $listaConceptos
     * @param array $conceptosOrdenados
     * @param array $listaConceptosLiquidados
     * @throws MyException
     */
    private function validarConceptosEliminados(array &$listaConceptos, array &$conceptosOrdenados, array &$listaConceptosLiquidados) {
        foreach ($conceptosOrdenados as $conceptoOrdenado) {
            $existe = FALSE;
            foreach ($listaConceptos as $conceptoInterfaz) {
                if ($conceptoInterfaz['idconcepto'] == $conceptoOrdenado['idconcepto']) {
                    $existe = TRUE;
                }
            }
            if ($existe == FALSE && $conceptoOrdenado['eliminar'] == 'N') {
                throw new MyException('Error el concepto ' . $conceptoOrdenado['idconcepto'] . ' es obligatorio', -1);
            }
            if (!$existe) {
                $infoConcepto['idconcepto'] = $conceptoOrdenado['idconcepto'];
                $infoConcepto['cantidad'] = 1;
                $infoConcepto['valorunitario'] = 0;
                $infoConcepto['valortotal'] = 0;
                $infoConcepto['valorreal'] = 0;
                $infoConcepto['eliminado'] = 'S';
                $listaConceptosLiquidados[] = $infoConcepto;
            }
        }
    }

    /**
     * Verifica si el concepto debe o no llevar valor real o si el concepto acepte nulos 
     * @param type $infoConcepto
     * @return type
     */
    private function calcularValorConceptoRegistro(&$infoConcepto) {
        $infoConcepto['valorreal'] = 0;
        if (empty($infoConcepto['valor']) && $infoConcepto['valornulo'] == 'S' && empty($infoConcepto['valortotal'])) {
            $infoConcepto['cantidad'] = 1;
            $infoConcepto['valorunitario'] = 0;
            $infoConcepto['valortotal'] = 0;
            return;
        }
        $infoConcepto['valortotal'] = $infoConcepto['valortotal'];
        $infoConcepto['cantidad'] = $infoConcepto['cantidad'];
        $infoConcepto['valorunitario'] = $infoConcepto['valorunitario'];
        $infoConcepto['valorreal'] = 0;
        if ($infoConcepto['operacion'] == 'S') {
            $infoConcepto['valorreal'] = $infoConcepto['valortotal'];
        }
    }

    /**
     * Consulta el número de la venta 
     * @return type
     */
    public function getNumeroVenta() {
        return $this->registrarVentasModel->getNumeroVenta();
    }

    /**
     * Actualiza los archivos 
     * @param type $venta
     * @throws MyException
     */
    public function actualizarAdjuntoVenta($venta) {
        if (empty($venta['numeroventa'])) {
            throw new MyException('Error, el número de la venta es obligatorio', -1);
        }
        $this->registrarArchivos($venta['archivos'], $venta['numeroventa']);
    //    $this->registrarVentasModel->actualizarNumeroVenta($venta['numeroventa']);
    }

    /**
     * Se guarda la venta y las liquidaciones 
     * @param type $venta
     * @return type
     * @throws MyException
     */
    public function registrarVenta($venta) {
        try {
            $this->conexion->beginTransaction();
            if (!empty($venta['numeroventa'])) {
                $this->ventaExistente($venta);
            } else {
                $venta['numeroventa'] = $this->guardarVenta($venta);
                $this->guardarDetalleVenta($venta);
                $this->registrarLiquidacion($venta['liquidaciones'], $venta['numeroventa']);
            }
            $this->conexion->commit();
            return $venta['numeroventa'];
        } catch (MyException $e) {
            $this->conexion->rollBack();
            throw $e;
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException('Ocurrió un error cuando se guardaba la venta.', -1);
        }
    }

    /**
     * Verifica si la financiación de la venta se mantiene
     * @param type $venta
     */
    private function ventaExistente(&$venta) {
        $mantenerFinanciacion = $this->inicializarFinanciacion($venta);
        $idusuario = $this->sesion->get('idusuario');
        $this->guardarVenta($venta);
        $this->registrarVentasModel->inicializarVenta($venta['numeroventa'], $mantenerFinanciacion, $idusuario);
        if (!$mantenerFinanciacion) {
            $this->guardarDetalleVenta($venta);
            $this->registrarLiquidacion($venta['liquidaciones'], $venta['numeroventa']);
        }
        $this->registrarArchivos($venta['archivos'], $venta['numeroventa']);
        $this->eliminarArchivoAdjunto($venta['archivoseliminados']);
    }

    /**
     * Si el método de pago cambia se modifica la financiación y/o se haya liquidado de nuevo 
     * @param type $venta
     * @return boolean
     */
    public function inicializarFinanciacion($venta) {
        if (!isset($venta['reiniciarFinanciacion'])) {
            return true;
        }
        if (isset($venta['cambiametodopago'])) {
            $this->financiarVentaDelegado->eliminarNumeroVenta($venta['numeroventa']);
        }
        $this->financiarVentaDelegado->inicializarFinanciacion($venta['numeroventa']);
        return false;
    }

    /**
     * Se guarda la venta en la tabla ven_
     * @param array $venta
     * @return type
     * @throws MyException
     */
    public function guardarVenta(array &$venta) {
        if (empty($venta['idsuscripcion'])) {
            throw new MyException('Error, la suscripción es obligatoria', -1);
        }
        $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($venta['idsuscripcion']);
        $venta['idusuario'] = $this->sesion->get('idusuario');
        $venta['idempresa'] = $this->sesion->get('idempresa');
        $venta['idciclo'] = $cicloPeriodo['idciclo'];
        $venta['idperiodo'] = $cicloPeriodo['idperiodo'];
        $venta['cicloanio'] = $cicloPeriodo['cicloanio'];
        $venta['observacion'] = trim($venta['observacion']);
        /**
         * Método encargado de validar si la venta existe la actualiza
         * Si no existe la inserta 
         */
        if (!array_key_exists('numeroventa', $venta)) {
            $venta['tipo'] = 'VE';
            $numeroVentaDisponible = $this->genericoModel->obtenerNumeroFactura($venta);
            $venta['numeroventadisponible'] = $numeroVentaDisponible['numero'];
            $this->genericoModel->actualizarNumeroDisponible($numeroVentaDisponible['numero'], $numeroVentaDisponible['idnumero']);
        }
        $idventa = $this->registrarVentasModel->insertarVenta($venta);
       // $this->registrarVentasModel->actualizarNumeroVenta($idventa);
        return $idventa;
    }

    /**
     * Se guardan los detalles de una venta después de que se realice la 
     * liquidación
     * @param array $venta
     * @throws MyException
     */
    public function guardarDetalleVenta(array $venta) {
        if (empty($venta['detalleventa'])) {
            throw new MyException('La venta debe tener detalles y/o conceptos', -1);
        }
        foreach ($venta['detalleventa'] as $detalleVenta) {
            $detalleVenta['idusuario'] = $this->sesion->get('idusuario');
            $detalleVenta['idventa'] = $venta['numeroventa'];
            $this->registrarVentasModel->insertarDetalleVenta($detalleVenta);
        }
    }

    /**
     * Se verifica si el concepto se puede eliminar 
     * @param type $idConcepto
     * @return type
     */
    public function validarEliminacionConcepto($idConcepto) {
        return $this->registrarVentasModel->validarEliminacionConcepto($idConcepto);
    }

    private function registrarLiquidacion(array $liquidaciones, $idVenta) {
        if (!is_array($liquidaciones)) {
            throw new MyException('Debe seleccionar al menos una liquidación ', -1);
        }
        foreach ($liquidaciones as $liquidacion) {
            $this->registrarVentasModel->insertarLiquidacion($liquidacion['idliquidacion'], $idVenta, $this->sesion->get('idusuario'));
        }
    }

    private function registrarArchivos(array $archivos, $idVenta) {
        if (!is_array($archivos)) {
            throw new MyException('Error, la venta debe tener archivos adjuntos', -1);
        }
        foreach ($archivos as $archivo) {
            $this->registrarVentasModel->actualizarArchivo($archivo['idarchivo'], $idVenta);
        }
    }

    private function validarNumeroTotal($infoConcepto, $concepto) {
        if (($infoConcepto['tipocalculo'] == 'V' && empty($concepto['valortotal']) && $concepto['editable'] == 'S') && $infoConcepto['valornulo'] == 'N') {
            throw new MyException('Debe ingresar la información del concepto ' . $concepto['idconcepto'] . '  ' . $concepto['concepto'], -1);
        }
    }

    /**
     * Permite la eliminación del archivo adjunto
     * @param int $idarchivo identificador del archivo a eliminar
     * @throws MyException Error al eliminar el archivo
     */
    public function eliminarArchivoAdjunto($listaArchivos) {
        try {
            foreach ($listaArchivos as $idarchivo) {
                $archivo = $this->confirmarEliminarArchivoAdjunto($idarchivo);
                if (!empty($archivo)) {
                    if (file_exists($archivo['ruta'])) {
                        unlink($archivo['ruta']);
                    }
                    $this->registrarVentasModel->eliminarAdjuntosVenta($idarchivo);
                }
            }
        } catch (\Exception $e) {
            throw new MyException('Error al eliminar el archivo', -1);
        }
    }

    /**
     * Confirma si se puede eliminar
     * @param int $idarchivo identificador del archivo a eliminar
     * @throws MyException Error al eliminar el archivo
     */
    public function confirmarEliminarArchivoAdjunto($idarchivo) {
        try {
            $archivo = $this->registrarVentasModel->getAdjuntosPorId($idarchivo);
            if (empty($archivo)) {
                return;
            }
            $this->registrarVentasModel->eliminarAdjuntosVenta($idarchivo);
            $rutaArchivo = RUTA_ARCHIVOS . $archivo['nombre_archivo'];
            unlink($rutaArchivo);
        } catch (\Exception $e) {
            throw new MyException('Error al eliminar el archivo', -1);
        }
    }

}
