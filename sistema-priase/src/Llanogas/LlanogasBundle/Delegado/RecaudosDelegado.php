<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\RecaudosModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de los recaudos.
 * @author hrey
 */
class RecaudosDelegado {

    /**
     * @var Controller
     */
    private $control;

    /**
     * Objeto de recaudos model
     * @var \Llanogas\LlanogasBundle\Models\RecaudosModel 
     */
    private $recaudosModel;

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     * Objeto de la clase de generico model
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     * Información de la sesión.
     * @var SessionInterface 
     */
    private $sesion;
    private $genericoDelegado;

    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->recaudosModel = new RecaudosModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $sesion;
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->control = $control;
    }

    /**
     * Se encarga en el registro de un abono en todas las tablas relacionadas.
     * @param array $infoRecaudo información del recaudo
     * @param int $idEmpresa identificador de la empresa que está realizando el recaudo.
     * @return bool TRUE insertó FALSE error
     * @throws \Llanogas\LlanogasBundle\Models\Exception
     */
    public function insertarRecaudoAbono($infoRecaudo, $idEmpresa) {
        try {
            $this->conexion->beginTransaction();
            $infoRecaudo['idusuario'] = $this->sesion->get('idusuario');
            $idNuevoRecaudo = $this->recaudosModel->insertarRecaudo($infoRecaudo, $idEmpresa);
            $versionRecaudo = 1;
            foreach ($infoRecaudo['distribucion'] as $distribucion) {
                $distribucion['recaudo'] = $idNuevoRecaudo;
                $distribucion['convenio'] = $infoRecaudo['convenio'];
                $idSuscripcion = $distribucion['suscripcion'];
                $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($idSuscripcion);
                $infoRecaudo['ciclo'] = $cicloPeriodo['idciclo'];
                $infoRecaudo['periodo'] = $cicloPeriodo['idperiodo'];
                $infoRecaudo['cicloanio'] = $cicloPeriodo['cicloanio'];
                $this->insertarDistribucionRecaudo($distribucion, $infoRecaudo, $idNuevoRecaudo);
                $this->genericoDelegado->actualizarRecaudoSaldo($idNuevoRecaudo, $versionRecaudo++, $idSuscripcion);
            }
            /**
             * Se insertan las formas de pago que se ingresaron al recaudo
             */
            $this->insertarFormasPagos($infoRecaudo, $idNuevoRecaudo);
            $this->conexion->commit();
            return $idNuevoRecaudo;
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException($e->getMessage(), -1);
        }
    }

    /**
     * Inserta un recaudo como anticipo y en las tablas que se necesiten.
     * @param array $infoRecaudo información del recaudo
     * @param int $idEmpresa id de la empresa
     * @return int identificador del nuevo recaudo.
     * @throws \Exception Se lanza un error si no se puede realizar el registro.
     */
    public function insertarRecaudoAnticipos($infoRecaudo) {
        $idEmpresa = $this->sesion->get('idempresa');
        try {
            $this->conexion->beginTransaction();
            $infoRecaudo['recaudo']['idusuario'] = $this->sesion->get('idusuario');
            $idNuevoRecaudo = $this->recaudosModel->insertarRecaudoAnticipo($infoRecaudo['recaudo'], $idEmpresa);
            foreach ($infoRecaudo['distribucion'] as $distribucion) {
                $distribucion['recaudo'] = $idNuevoRecaudo;
                $distribucion['idtipodocumento'] = $distribucion['idTipoDoc'];
                $distribucion['iddocumento'] = ($distribucion['idDocumento'] == -1 || $distribucion['idDocumento'] == 0) ? null : $distribucion['idDocumento'];
                $distribucion['idconcepto'] = (($distribucion['idConcepto'] / 1) == 0 || ($distribucion['idConcepto'] / 1) == -1) ? null : $distribucion['idConcepto'];
                $distribucion['idperiodo'] = (($distribucion['idPeriodo'] / 1) == 0 || ($distribucion['idPeriodo'] / 1) == -1) ? null : $distribucion['idPeriodo'];
                $distribucion['empresa'] = $idEmpresa;
                $distribucion['convenio'] = $infoRecaudo['recaudo']['idConvenio'];
                $distribucion['idSuscripcion'] = $infoRecaudo['recaudo']['idSuscripcion'];
                $distribucion['valorSuscripcion'] = $distribucion['valor'];
                $idSuscripcion = $infoRecaudo['recaudo']['idSuscripcion'];
                $distribucion['suscripcion'] = $idSuscripcion;
                $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($idSuscripcion);
                $infoRecaudo['ciclo'] = $cicloPeriodo['idciclo'];
                $infoRecaudo['periodo'] = $cicloPeriodo['idperiodo'];
                $infoRecaudo['cicloanio'] = $cicloPeriodo['cicloanio'];
                $distribucion['idusuario'] = $this->sesion->get('idusuario');
                $this->recaudosModel->insertarDistribucionRecaudo($distribucion, $infoRecaudo);
            }
            $this->insertarFormasPagos($infoRecaudo, $idNuevoRecaudo);
            $this->conexion->commit();
            return $idNuevoRecaudo;
        } catch (\Exception $exc) {
            throw new MyException($exc->getMessage(), -1);
        }

        $this->conexion->rollBack();
    }

    /**
     * Recorre e inserta las nuevas formas de pago.
     * @param type $infoRecaudo
     * @param type $idNuevoRecaudo
     */
    private function insertarFormasPagos($infoRecaudo, $idNuevoRecaudo) {
        foreach ($infoRecaudo['formasPagos'] as $infoFormaPago) {
            $infoFormaPago['recaudo'] = $idNuevoRecaudo;
            $infoFormaPago['idusuario'] = $this->sesion->get('idusuario');
            $idNuevaFormaPago = $this->recaudosModel->insertarFormasPagos($infoFormaPago);
            if (isset($infoFormaPago['informacionAdicional'])) {
                $this->insertarInformacionAdicional($idNuevoRecaudo, $idNuevaFormaPago, $infoFormaPago);
            }
        }
    }

    /**
     * Inserta la información adicional del pago
     * @param int $idNuevoRecaudo identificador del recaudo que se creó
     * @param int $idNuevaFormaPago identificador de la nueva forma de pago
     * @param array $infoFormaPago Listado de las formas de pago a ingresar
     */
    private function insertarInformacionAdicional($idNuevoRecaudo, $idNuevaFormaPago, $infoFormaPago) {
        foreach ($infoFormaPago['informacionAdicional'] as $informacion) {
            $informacion['recaudo'] = $idNuevoRecaudo;
            $informacion['idFormaPago'] = $idNuevaFormaPago;
            $informacion['unidadFormaPago'] = $infoFormaPago['formaPago'];
            $informacion['idusuario'] = $this->sesion->get('idusuario');
            if (isset($infoFormaPago['idBanco'])) {
                $informacion['idBanco'] = $infoFormaPago['idBanco'];
            }
            $this->recaudosModel->insertarInformacionAdicional($informacion);
        }
    }

    /**
     * Inserta los detalles del recaudo
     * @param array $factura información de la factura que se está pagando
     * @param int $idTipoDocumento identificador del nuevo documento que se está generando
     * @param int $idFacturaRecaudo identificador del de talle de las facturas que se afectaron por el recaudo.
     * @param int $idNuevoRecaudo identificador del nuevo recaudo generado
     * @param array $infoRecaudo información del recaudo.
     * @param int $idDistribucionRecaudo identificador de la distribución del recaudo
     */
    private function insertarDetalleRecaudo($factura, $idFacturaRecaudo, $idNuevoRecaudo, $infoRecaudo, $idDistribucionRecaudo) {

        $idTipoDocumento = $this->recaudosModel->consultarTipoDocumentoPorFactura($factura['factura']);
        foreach ($factura['conceptos'] as $concepto) {
            $concepto['recaudo'] = $idNuevoRecaudo;
            $concepto['facturaRecaudo'] = $idFacturaRecaudo;
            $concepto['factura'] = $factura['factura'];
            $concepto['ciclo'] = $infoRecaudo['ciclo'];
            $concepto['periodo'] = $infoRecaudo['periodo'];
            $concepto['clasepago'] = $infoRecaudo['clasepago'];
            $concepto['iddocumento'] = $idTipoDocumento['iddocumento'];
            $concepto['idtipodocumento'] = $idTipoDocumento['idtipodocumento'];
            $concepto['distribucion'] = $idDistribucionRecaudo;
            $concepto['cicloanio'] = $infoRecaudo['cicloanio'];
            $concepto['idusuario'] = $this->sesion->get('idusuario');
            $this->recaudosModel->insertarDetalleRecaudo($concepto);
        }
    }

    /**
     * Ingresa la nueva distribucion del recaudo
     * @param array $distribucion  información de las suscripciones que se afectaron con el pago.
     * @param array $infoRecaudo información del recaudo que se está realizando
     * @param int $idNuevoRecaudo identificador del nuevo recaudo.
     */
    private function insertarDistribucionRecaudo($distribucion, $infoRecaudo, $idNuevoRecaudo) {
        $distribucion['idusuario'] = $this->sesion->get('idusuario');
        $idDistribucionRecaudo = $this->recaudosModel->insertarDistribucionRecaudo($distribucion, $infoRecaudo);
        if (!isset($distribucion['facturas'])) {
            throw new MyException('no se encontraron facturas', -1);
        }
        foreach ($distribucion['facturas'] as $factura) {



            $factura['distribucion'] = $idDistribucionRecaudo;
            $factura['empresa'] = $distribucion['empresa'];
            $factura['idusuario'] = $this->sesion->get('idusuario');
            $idFacturaRecaudo = $this->recaudosModel->insertarRecaudoFactura($factura);
            $this->insertarDetalleRecaudo($factura, $idFacturaRecaudo, $idNuevoRecaudo, $infoRecaudo, $idDistribucionRecaudo);
            $this->genericoDelegado->actualizarFacturaSaldo($factura['factura'], $factura['version']);

            //se incluye la recuperación de las facturas cuando esten castigadas
            $parametros['idfactura'] = $factura['factura'];
            $facturaConceptos = $this->genericoModel->getConceptos($parametros['idfactura']);
            foreach ($facturaConceptos as $dfacturaConceptos) {
                foreach ($factura['conceptos'] as $concepto) {
                    if ($dfacturaConceptos['iddetallefactura'] == $concepto['idConcepto']) {
                        $dconcepto['idconcepto'] = $dfacturaConceptos['idconcepto'];
                        $dconcepto['saldo'] = $concepto['valorPagado'];
                        $dconcepto['iddetallefactura'] = $concepto['idConcepto'];
                        $parametros['conceptos'][] = $dconcepto;
                    }
                }
            }
            //$condonarCarteraCastigada = new CondonarCarteraCastigadaDelegado($this->control, $this->sesion);
            //$condonarCarteraCastigada->generarRecuperacionProvision($parametros);
        }
    }

    /**
     * Método que se invoca desde el filtro de recaudos (Abonosy Anticipos)
     * @param int $idEmpresa identificador de la empresa
     * @param string $cedula cédula del tercero
     * @param int $idSuscripcion identificador de la suscripción.
     * @param string $codAnterior código anterior de la suscripción.
     * @param string $estadoFactura estado de la suscripción
     * @return array Listado de suscripciones e información del suscriptor
     * @throws MyException
     */
    public function getSuscripcionesAbonos($cedula, $idSuscripcion, $codAnterior) {
        $listadoSuscripciones = $this->recaudosModel->getSuscripciones($this->sesion->get('idempresa'), $cedula, $idSuscripcion, $codAnterior, "'A','U','R','P'");
        return $listadoSuscripciones;
    }

    /**
     * Método que se invoca desde el filtro de recaudos carterCastigada
     * @param int $idEmpresa identificador de la empresa
     * @param string $cedula cédula del tercero
     * @param int $idSuscripcion identificador de la suscripción.
     * @param string $codAnterior código anterior de la suscripción.
     * @param string $estadoFactura estado de la suscripción
     * @return array Listado de suscripciones e información del suscriptor
     * @throws MyException
     */
    public function getSuscripcionesCarteraCastigada($cedula, $idSuscripcion, $codAnterior) {
        $listadoSuscripciones = $this->recaudosModel->getSuscripciones($this->sesion->get('idempresa'), $cedula, $idSuscripcion, $codAnterior, "'E'");
        return $listadoSuscripciones;
    }

    /**
     * Consulta facturas con saldo dependiendo de un array de suscripciones
     * @param string $suscripciones identificadores de las suscripciones separados por comas.
     * @return array Información de las facturas con saldo
     * @throws MyException No se encontraron facturas con saldo.
     */
    public function getFacturasConSaldo($suscripciones,$CarteraAseoNoHomologada=0) {
        $facturasConSaldo = $this->recaudosModel->getFacturasConSaldo($suscripciones,$CarteraAseoNoHomologada);
        $MensajeExcepcion = "No se encontraron facturas con saldo";
        if($CarteraAseoNoHomologada==1){
           $MensajeExcepcion = "No se encontraron facturas de Cartera de Aseo No Homologadas con saldo  "; 
        }
        if (empty($facturasConSaldo)) {
            
            throw new MyException('No se encontraron facturas con saldo', 0);
        }
        $respuesta['facturas'] = $facturasConSaldo;
        $parametroConceptos = array();
        foreach ($facturasConSaldo as $factura) {
            $idFacturaActual = $factura['idfactura'];
            $listaConceptos = $this->recaudosModel->getConceptosFactura($idFacturaActual);
            foreach ($listaConceptos as $concepto) {
                $parametroConceptos[] = $concepto;
            }
        }
        $respuesta['conceptos'] = $parametroConceptos;
        return $respuesta;
    }

    /**
     * Método que crea un combo de html dependiendo del arreglo.
     * @param string $codTipo tipo de combo que se quiere pintar
     * @param \Symfony\Component\HttpFoundation\Session\SessionInterface $sesion información de la sesión del usuario.
     * @param string $tipoDocumento tipo de documento a consultar (A=Anticipo, B=Abono, P=Pago, C=Cartera Castigada)
     * @return string componente ya renderizado.
     */
    public function cargarComboDb($codTipo, $tipoDocumento = '', $idPrograma = null) {
        $idEmpresa = $this->sesion->get('idempresa');
        $idUsuario = $this->sesion->get('idusuario');
        switch ($codTipo) {
            case 'cmbMedioPago':
                $resultado = $this->recaudosModel->consultarMedio($idEmpresa, $idUsuario);
                break;
            case 'cmbClasePago':
                $resultado = $this->recaudosModel->consultarClase($tipoDocumento, $idUsuario, $idEmpresa, $idPrograma);
        }
        $listaDatos = array();
        foreach ($resultado as $campos) {
            $listaDatos[$campos['id']] = $campos['nombre'];
        }
        return Util::crearCombo($codTipo, $listaDatos);
    }

    /**
     * Método que crea un combo html por la consulta de sucursales según el programa y usuario
     * @param int $idPrograma Código de programa.
     * @return string Componente ya renderizado
     */
    public function consultarSucursal($idPrograma) {
        $idUsuario = $this->sesion->get('idusuario');
        $sucursales = $this->recaudosModel->consultarSucursal($idPrograma, $idUsuario);
        $listaDatos = array();
        foreach ($sucursales as $campos) {
            $listaDatos[$campos['idsucursal']] = $campos['sucursal'];
        }
        return Util::crearCombo('cmbSucursal', $listaDatos);
    }

    /**
     * Método que consulta el ciclo y periodo actual de la suscripción a la que se hace un anticipo
     * @param array $recaudo Información del anticipo a grabar 
     * @return string Mensaje con número del pago realizado.
     */
    public function registrarAnticipo(array $recaudo) {
        $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($recaudo['recaudo']['idSuscripcion']);
        $recaudo['ciclo'] = $cicloPeriodo['idciclo'];
        $recaudo['periodo'] = $cicloPeriodo['idperiodo'];
        $idRecaudo = $this->insertarRecaudoAnticipos($recaudo);
        // Creacion de registro de autorizacion de impresion en la creacion del recaudo
        $autorizarImpresionesDelegado = new AutorizarImpresionesDelegado($this, $this->sesion);
        $idUsuario = $this->sesion->get('idusuario');
        $autorizarImpresionesDelegado->insertarImpresionesRecaudoUsuarioAutomatico($idRecaudo, $idUsuario, 1);
        $respuesta["mensajeRespuesta"] = 'Se registró correctamente el pago con número: ' . $idRecaudo;
        $respuesta['recaudo'] = $this->getRecaudoInfo($idRecaudo);
        $respuesta['impresionrecaudo'] = $autorizarImpresionesDelegado->obtenerImpresionRecaudoUsuario($idRecaudo, $idUsuario);
        return $respuesta;
    }

    /**
     * Consulta las liquidaciones de una suscripción (lids_liqdetsusc)
     * @param int $idSuscripcion Id de la suscripción
     * @return array $listaTiposLiquidacion Lista de liquidaciones por suscripción.
     * @throws MyException La suscripción no tiene facturas con saldo
     */
    public function getTiposLiquidacion($idSuscripcion) {
        $facturasConSaldo = $this->genericoModel->getFacturasConSaldo($idSuscripcion);
        if (!empty($facturasConSaldo)) {
            throw new MyException('La suscripción tiene facturas con saldo', -3);
        }
        $listaTiposLiquidacion = $this->recaudosModel->consultarTiposLiquidacion($idSuscripcion);

        return $listaTiposLiquidacion;
    }

    /**
     * Consultar tipos de documento para anticipo
     * @param int $idSuscripcion Id de la suscripción
     * @return array Tipos de documento para anticipos
     */
    public function getDocumentosTiposAnticipos($idSuscripcion) {
        $idEmpresa = $this->sesion->get('idempresa');
        return $this->recaudosModel->getDocumentosTiposAnticipos($idEmpresa, $idSuscripcion);
    }

    public function getConceptosAnticipos($idSuscripcion, $idLiquidacion) {
        $idEmpresa = $this->sesion->get('idempresa');
        return $this->recaudosModel->getConceptosAnticipos($idEmpresa, $idSuscripcion, $idLiquidacion);
    }

    /**
     * Se consultan los documentos asignados a una liquidación
     * @param int $idLiquidacion identificador de la liquidación
     * @return array listado de documentos
     */
    public function getDocumentosTipos($idLiquidacion) {
        return $this->genericoModel->consultarDocumentosTiposPorLiquidacion($idLiquidacion);
    }

    /**
     * Consulta todas las suscripciones de un suscriptor, dependiendo del convenio
     * Se invoca en el caso de uso de pagos. 
     * @param int $idSuscriptor identificador del suscriptor
     * @return array Lista de suscripciones
     * @throws MyException Si no llega un identificador del suscriptro
     */
    public function getSuscripcionesPagos($idSuscriptor, $idSuscripcionAseoCarteraNoHomologada=0) {
        if (!is_numeric($idSuscriptor)) {
            throw new MyException('Error, Debe seleccionar un suscriptor ', -1);
        }
        return $this->recaudosModel->getSuscripcionesPagos($idSuscriptor, $idSuscripcionAseoCarteraNoHomologada);
    }

    /**
     * Consulta todas las facturas en cartera castigada.
     * @param type $suscripciones
     * @return array Información de la respuesta [facturas][conceptos]
     * @throws MyException  Error si no se encuentran facturas en estado castigado.
     */
    public function getFacturasCarteraCastigada($suscripciones) {
        $respuesta = array();
        $conceptos = array();
        $listaFacturas = $this->recaudosModel->getFacturasCarteraCastigada($suscripciones);
        if (empty($listaFacturas)) {
            throw new MyException('La suscripción no tiene facturas en estado castigada', 0);
        }
        foreach ($listaFacturas as $factura) {
            $listaConceptos = $this->recaudosModel->getConceptosFactura($factura['idfactura'], 'C');
            foreach ($listaConceptos as $concepto) {
                $conceptos[] = $concepto;
            }
        }
        $respuesta['facturas'] = $listaFacturas;
        $respuesta['conceptos'] = $conceptos;
        return $respuesta;
    }

    /**
     * Se crea el código de seguridad que está en la impresión de timbre
     * @param type $idRecaudo
     * @return type
     */
    public function getRecaudoInfo($idRecaudo) {
        $recaudo = $this->genericoModel->getRecaudoInfo($idRecaudo);
        $recaudo['distribucion'] = $this->genericoModel->getDistribucionRecaudoInfo($idRecaudo);
        $cifrado = base64_encode(md5($recaudo['idrecaudo'] . '' . $recaudo['valorreal'] . $recaudo['fecha']));
        if (strlen($cifrado) > 32) {
            $cifrado = substr($cifrado, 0, 31);
        }
        $recaudo['cifrado'] = $cifrado;
        return $recaudo;
    }
    
    
    public function consultarSucursalesPorMedioPago($idMedioPago){
         $idUsuario = $this->sesion->get('idusuario');
         $idEmpresa = $this->sesion->get('idempresa');
        $sucursales = $this->recaudosModel->consultarSucursalesPorMedioPagoModel($idMedioPago,$idEmpresa);
        $listaDatos = array();
        foreach ($sucursales as $campos) {
            $listaDatos[$campos['idsucursal']] = $campos['sucursal'];
        }
        return Util::crearCombo('cmbSucursal', $listaDatos);
    }

}
