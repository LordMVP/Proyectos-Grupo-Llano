<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\CondonarCarteraCastigadaModel;
use Llanogas\LlanogasBundle\Models\CarteraCastigadaGenericoModel;

/**
 * Description of CerrarLecturasDelegado
 *
 * @author Sergio Vargas
 * fecha  : 23-09-2015
 * 
 */
class CondonarCarteraCastigadaDelegado {

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
     * @var GenericoDelegado
     */
    private $genericoDelegado;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\CondonarCarteraCastigadaModel
     */
    private $condonarCarteraModel;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\CarteraCastigadaGenericoModel
     */
    private $condonarCarteraGenericoModel;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->sesion = $sesion;
        $this->condonarCarteraModel = new CondonarCarteraCastigadaModel($this->conexion);
        $this->condonarCarteraGenericoModel = new CarteraCastigadaGenericoModel($this->conexion);
    }

    /**
     * Permite filtrar suscripciones 
     * @param int $idsuscripcion
     * @param int $codigoAnterior
     */
    public function filtrarSuscripciones($idsuscripcion, $codigoAnterior) {
        $parametros['idsuscripcion'] = $idsuscripcion;
        $parametros['codigoanterior'] = $codigoAnterior;
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $idusuario = $this->sesion->get('idusuario');
        $suscripcion = $this->genericoModel->getSuscripcion($parametros, $idusuario);
        if (empty($suscripcion)) {
            throw new MyException("No se encontraron resultados para la suscripción", 0);
        }
        return $suscripcion;
    }

    /**
     * lista todas las facturas castigadas por una suscripción especifica 
     * @param int $idsuscripcion identificador de la suscripción 
     * @return array facturas castigadas
     */
    public function obtenerFacturasCastigadas($idsuscripcion) {
        return $this->condonarCarteraModel->obtenerFacturasCastigadasModel($idsuscripcion);
    }

    /**
     * permite listar los conceptos de las facturas permitiendo obtener los conceptos condonables y no condonables 
     * @param int $idfactura identificador de la factura
     * @return array listado de los conceptos condonables y no condonables
     */
    public function obtenerConceptosFacturas($idfactura) {
        $respuesta['conceptoscondonables'] = $this->condonarCarteraModel->ObtenerConceptosFactura($idfactura, 'S');
        $respuesta['conceptosnocondonables'] = $this->condonarCarteraModel->ObtenerConceptosFactura($idfactura, 'N');
        return $respuesta;
    }

    /**
     * permite actualizar el número de la factura
     * @param int $idfactura idenbtificador de la factura 
     * @param int $numero numero de consecutivo de la factura
     * @param int $idnumero id del npumero generado para actualizar nudo
     */
    private function actualizarNumeroFactura($idfactura, $numero, $idnumero) {
        //actualiza los consecutivos  de la facturación 
        $this->genericoModel->actualizarNumeroDisponible($numero, $idnumero);
        $this->genericoModel->actualizarNumeroFactura($idfactura, $numero);
    }

    /**
     * permite obtener el consecutivo de la factura
     * @param int $iddocumento documento a revisar
     * @param int $idtipodocumento tipo de documento a evaluar
     * @return int número de facturación
     */
    private function obtenerNumeroFactura($iddocumento, $idtipodocumento) {
        $infoFactura['idempresa'] = $this->sesion->get('idempresa');
        $infoFactura['iddocumento'] = $iddocumento;
        $infoFactura['idtipodocumento'] = $idtipodocumento;
        $infoFactura['tipo'] = "FA";
        return $this->genericoModel->obtenerNumeroFactura($infoFactura);
    }

    // <editor-fold desc="notas de factura">  

    /**
     * construye la nota de condonación de la factura
     * @param int $idsuscripcion identificador de la suscripción
     * @return int identificador de la nota creada
     */
    private function crearNotaCondonacion($idsuscripcion) {
        $periodo = $this->genericoModel->getCicloPeriodoSuscripcion($idsuscripcion);
        $notas['cic_ideregistro'] = $periodo['idciclo'];
        $notas['per_ideregistro'] = $periodo['idperiodo'];
        $notas['cic_ano'] = $periodo['cicloanio'];
        $notas['dsus_ideregistr'] = $idsuscripcion;
        $notas['emp_ideregistro'] = $this->sesion->get('idempresa');
        $notas['usu_ideregistro'] = $this->sesion->get('idusuario');

        return $this->condonarCarteraModel->crearNotaCondonacionModel($notas);
    }

    /**
     * permite construir los detalles de la nota de la factura 
     * @param int $factura identificador de la factura
     * @param int $idnota identificador de la nota creada
     * @param int $idnotafactura identificador de la nota construida para la factura
     */
    private function crearDetallenotasFactura($factura, $idnota, $idnotafactura) {
        /*
         * de acuerdo a los conceptos se debe enviar las notas correspondientes 
         */
        if (empty($factura['conceptos']) || !isset($factura['conceptos'])) {
            throw new MyException('Error debe seleccionar los detalles de la factura ' . $factura['idfactura']);
        }

        foreach ($factura['conceptos'] as $conceptos) {
            /*
             * carga el detalle de la factura original
             */
            $detalleFacturaOriginal = $this->condonarCarteraModel->obtenerDetalleFacturaModel($conceptos['iddetallefactura']);
            /*
             * se reemplazan los valores del detalle de la factura original 
             */
            $detalleFacturaOriginal['fac_ideregistro'] = $idnotafactura;
            $detalleFacturaOriginal['dfac_sdoreal'] = abs($conceptos['saldo']) * -1;
            $detalleFacturaOriginal['dfac_vlrtotal'] = abs($conceptos['saldo']) * 1;
            $detalleFacturaOriginal['dfac_vlrreal'] = abs($conceptos['saldo']) * -1;
            $detalleFacturaOriginal['dfac_ideorigen'] = $conceptos['iddetallefactura'];
            $detalleFacturaOriginal['dfac_idepadre'] = $conceptos['iddetallefactura'];
            $detalleFacturaOriginal['usu_ideregistro'] = $this->sesion->get('idusuario');
            $iddetalleFacturaNota = $this->condonarCarteraModel->crearNotaDetalleFacturaModel($detalleFacturaOriginal);
            /*
             * ir a nofa a enlazar la factura original con los detalles
             */
            $infofactura['idusuario'] = $this->sesion->get('idusuario');
            $infofactura['idfacturanota'] = $idnotafactura;
            $infofactura['iddetallefacturanota'] = $iddetalleFacturaNota;
            $infofactura['idfacturaoriginal'] = $factura['idfactura'];
            $infofactura['iddetallefacturaoriginal'] = $conceptos['iddetallefactura'];
            $infofactura['idnota'] = $idnota;
            $this->condonarCarteraModel->crearNotaModel($infofactura);
        }
    }

    /**
     * Crea la nota de la factura
     * @param array $factura un objeto de tipo factura con la información de los conceptos a condonar
     */
    public function crearNotaFactura($factura) {
        /*
         * se crea la nota para la condonación en not_nota 
         */
        $idnota = $this->crearNotaCondonacion($factura['idsuscripcion']);
        /*
         * carga la factura original para crear una nota
         */
        $facturaOriginal = $this->condonarCarteraModel->obtenerFacturaModel($factura['idfactura']);
        /*
         * Consultar el documento adecuado para la nota debe ser de tipo NC, para ser reemplazado en nel item de la factura original 
         */
        $documentos = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($facturaOriginal['uni_documento'], $facturaOriginal['uni_tipdocument'], 'NA');
        $facturaOriginal['uni_documento'] = $documentos['iddocumento'];
        /*
         * se incluye el saldo de la nota que le restara a la factura original 
         */
        $facturaOriginal['fac_sdoreal'] = abs($factura['saldo']) * -1;
        $facturaOriginal['fac_vlrreal'] = abs($factura['saldo']) * -1;
        /*
         * se solicita el ciclo periodo actual 
         */
        $periodo = $this->genericoModel->getCicloPeriodoSuscripcion($factura['idsuscripcion']);
        $facturaOriginal['cic_ideregistro'] = $periodo['idciclo'];
        $facturaOriginal['per_ideregistro'] = $periodo['idperiodo'];
        $facturaOriginal['cic_ano'] = $periodo['cicloanio'];
        /*
         * Se incluye quien origina la nota
         */
        $facturaOriginal['fac_ideorigen'] = $factura['idfactura'];
        $facturaOriginal['fac_idepadre'] = $factura['idfactura'];
        $facturaOriginal['fac_fecha'] = 'now()';
        $facturaOriginal['fac_fecaprobada'] = 'now()';
        $facturaOriginal['fac_estado'] = 'A';
        /*
         * se construye la nota de la factura
         */
        $idNotaFactura = $this->condonarCarteraModel->crearNotaFacturaModel($facturaOriginal);


        $this->crearDetallenotasFactura($factura, $idnota, $idNotaFactura);

        // Obtiene el número de consecutivo que le pertenece a la factura construida             
        $numeroFacturacion = $this->obtenerNumeroFactura($documentos['iddocumento'], $facturaOriginal['uni_tipdocument']);
        $this->actualizarNumeroFactura($idNotaFactura, $numeroFacturacion['numero'], $numeroFacturacion['idnumero']);

        $this->genericoDelegado->actualizarFacturaSaldo($factura['idfactura'], $facturaOriginal['fac_version']);
    }

    //</editor-fold>
    // <editor-fold desc="Generar recuperacion de facturas a condonar">  

    /**
     * se limpia la factura original adaptandola a la provisión
     * @param array $facturaOriginal factura original de provisión
     * @return array
     */
    private function limpiarFacturaProvisionar($facturaOriginal) {
        unset($facturaOriginal['fac_vlrreal']);
        unset($facturaOriginal['fac_numero']);
        unset($facturaOriginal['fac_ideregistro']);
        unset($facturaOriginal['fac_sdoreal']);
        unset($facturaOriginal['fac_ideactual']);
        unset($facturaOriginal['fac_feceliminad']);
        unset($facturaOriginal['fac_fecfinancia']);
        unset($facturaOriginal['fac_feccastigad']);
        unset($facturaOriginal['fac_fecsuspens']);
        unset($facturaOriginal['fin_ideregistro']);
        unset($facturaOriginal['mvi_ideregistro']);
        return $facturaOriginal;
    }

    /**
     * permite realizar el calculo de lo que deberia ir en el saldo del concepto
     * @param recaudo $concepto
     * @return float valor calculado de la provision del concepto
     */
    private function calcularSaldoProvision($concepto) {
        //crear nota de recaudo provisionado 
        $valorRealProvision = $this->condonarCarteraModel->obtenerValorProvisionModel($concepto['idfacturaprovision']);
        $valorRecaudoPagado = $concepto['saldo'];
        $valorProvisionadoFactura = $valorRealProvision['valorreal'] / 0.33;
        //obtener el porcentaje del pago 
        $valorPorcentajePago = (($valorRecaudoPagado / $valorProvisionadoFactura) * $valorRealProvision['valorreal'] );
        //se obtiene el valor total del PR provisión de recaudo
        $valorProvisionConceptoPR = $this->condonarCarteraModel->obtenerValorTotalProvisionConceptoModel($concepto['iddetallefactura']);
        //se obtiene el valor real de la provisión que sera alojado como nota y actualizado al detalle de factura de la provision 
        $valorProvisionConceptoPR['valortotal'] = $valorPorcentajePago;
        return $valorProvisionConceptoPR;
    }

    /**
     * permite evaluar los pagos generados de los recaudos  
     * @param factura $factura objeto de factura 
     * @return int saldo de como deberia quedar el recaudo provisión  a crear
     */
    private function recuperarProvisionPorcentual($factura) {
        $sdoRP = 0;

        if (empty($factura['conceptos'])) {
            throw new MyException("deben existir conceptos asociados a la factura " . $factura['idfacturaprovision'], -1);
        }

        foreach ($factura['conceptos'] as $concepto) {
            $concepto['idfacturaprovision'] = $factura['idfacturaprovision'];
            $valorRealProvisionConcepto = $this->calcularSaldoProvision($concepto);
            //actualización del saldo de la factura de la provision en curso
            $this->condonarCarteraModel->actualizarSaldoConceptoProvisionModel($valorRealProvisionConcepto['iddetallefacturaprovision'], $valorRealProvisionConcepto['valortotal']);
            //crear nota de recuperación de provisión 
            $detalleprovision['dfac_ideorigen'] = $factura['idfacturaprovision'];
            $detalleprovision['dfac_sdoreal'] = abs($valorRealProvisionConcepto['valortotal']) * -1;
            $detalleprovision['fac_ideregistro'] = $factura['idfacturaprovisionencabezado'];
            $detalleprovision['uni_concepto'] = $concepto['idconcepto'];
            $detalleprovision['usu_ideregistro'] = $this->sesion->get('idusuario');
            $this->condonarCarteraModel->crearDetalleRecaudoProvisionModel($detalleprovision);
            $sdoRP = $sdoRP + $valorRealProvisionConcepto['valortotal'];
        }
        return $sdoRP;
    }

    public function generarRecuperacionProvision($factura) {
        $facturaProvisiones = $this->condonarCarteraModel->obtenerFacturaProvisionModel($factura['idfactura']);
        if (empty($facturaProvisiones)) {
            return;
        }
        //cargar factura original para crear su nota correspondiente para su recuperación de una provisión
        $facturaOriginal = $this->condonarCarteraModel->obtenerFacturaModel($factura['idfactura']);
        //obtiene su nuevo documento para la nota de recuperacion de provisión
        $documentoRP = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($facturaOriginal['uni_documento'], $facturaOriginal['uni_tipdocument'], 'RP');
        $facturaOriginal['uni_documento'] = $documentoRP['iddocumento'];

        foreach ($facturaProvisiones as $facturaProvision) {

            /* Se prepara la factura original para reemplazar los campos requeridos 
             * para generar una nota a través de la información original 
             */
            $facturaOriginal['fac_ideorigen'] = $facturaProvision['fac_ideregistro'];
            $facturaOriginal['fac_idepadre'] = $facturaProvision['fac_ideregistro'];

            $facturaAProvisionar = $this->limpiarFacturaProvisionar($facturaOriginal);
            $idfacturaRP = $this->condonarCarteraModel->crearRecuperacionProvisionModel($facturaAProvisionar);
            // Obtiene el número de consecutivo que le pertenece a la factura construida             
            $numeroFacturacion = $this->obtenerNumeroFactura($documentoRP['iddocumento'], $facturaOriginal['uni_tipdocument']);
            $factura['idfacturaprovisionencabezado'] = $idfacturaRP;
            $factura['idfacturaprovision'] = $facturaProvision['fac_ideregistro'];
            /* realiza los calculos y provisiona los detalles de las facturas con su saldo correspondiente 
             * resolviendo el valor acumulado con el fin de actualizar el saldo de la provisión en el encabezado
             */
            $valorRP = $this->recuperarProvisionPorcentual($factura);
            //actualiza el saldo de la provisión
            $this->condonarCarteraGenericoModel->actualizarSaldoFacturaProvisionModel($facturaProvision['fac_ideregistro'], $valorRP);
            //actualiza los consecutivos  de la facturación 
            $this->actualizarNumeroFactura($idfacturaRP, $numeroFacturacion['numero'], $numeroFacturacion['idnumero']);
            //$this->genericoDelegado->actualizarFacturaSaldo($idfacturaRP,1);
        }
    }

    //</editor-fold>

    /**
     * permite procesar las facturas para condonar la cartera castigada 
     * @param array $facturas listado de facturas a condonar sus conceptos 
     */
    public function procesarCondonarCarteraCastigada($facturas) {

        try {
            $this->conexion->beginTransaction();
            /**
             * se recorre las facturas listadas para castigar
             */
            foreach ($facturas as $factura) {
                /*
                 * se construye el proceso de las notas correspondientes a la condonación
                 */
                $this->crearNotaFactura($factura);
                /*
                 * crear una nueva recuperación a la provision de la factura 
                 */
                $this->generarRecuperacionProvision($factura);
            }
            $this->conexion->commit();
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), $exc->getCode());
        }
    }


    /**
     * Obtiene los conceptos no condonables de una factura
     * @param int $idFactura id de la factura
     * @return array arreglo de informacion de los conceptos no condonables de
     * una factura
     */		
    public function consultarPermisosBotonesFacturas() {
        $parametros['idusuario']=$this->sesion->get('idusuario') ;
        $parametros['idempresa']=$this->sesion->get('idempresa') ;
        $parametros['idestructura']= 141 ;
        $parametros['ideprograma']= PROGRAMA_CONDONAR_CARTERA_CASTIGADA ;

        return $this->condonarCarteraModel->consultarPermisosBotonesFacturas($parametros);
    }

     /**
     * consulta la informacion de las facturas de la suscripcion 
     * @param int $idSuscripcion id de la suscripcion
     * @return array informacion de las facturas con conceptos condonables y no
     * condonables
     * @throws MyException
     */
    public function obtenerFacturasCarteraIntCorriente($idSuscripcion) {    
        $facturas = $this->condonarCarteraModel->consultarFacturasCarteraIntCorriente($idSuscripcion);

        if (empty($facturas)) {
            throw new MyException("Error, no se encontraron facturas", 0);
        }
        for ($i = 0; $i < count($facturas); $i++) {
            $facturas[$i]["conceptoscondonables"] = $this->obtenerConceptosCondonables($facturas[$i]["idfactura"]);
            $facturas[$i]["conceptosnocondonables"] = $this->obtenerConceptosNoCondonables($facturas[$i]["idfactura"]);
        }
        return $facturas;
    }

    /**
     * Obtiene los conceptos condonables de una factura
     * @param int $idFactura id de la factura
     * @return array arreglo de informacion de los conceptos condonables de una
     * factura
     */
    public function obtenerConceptosCondonables($idFactura) {
        $conceptosCondonables = $this->condonarCarteraModel->consultarConceptosCondonables($idFactura);
        return $conceptosCondonables;
    }

    /**
     * Obtiene los conceptos no condonables de una factura
     * @param int $idFactura id de la factura
     * @return array arreglo de informacion de los conceptos no condonables de
     * una factura
     */
    public function obtenerConceptosNoCondonables($idFactura) {
        $conceptosNoCondonables = $this->condonarCarteraModel->consultarConceptosNoCondonables($idFactura);
        return $conceptosNoCondonables;
    }


}

?>
