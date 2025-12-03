<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\GenerarNotasModel;
use Llanogas\LlanogasBundle\MyException;

/**
 * Clase que realiza todas las transacciones 
 * @author hrey
 */
class GenerarNotasDelegado {

    /**
     * Conexión a la base de datos
     * @var Connection 
     */
    private $conexion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var GenerarNotasModel
     */
    private $generarNotasModel;

    /**
     *
     * @var GenericoDelegado 
     */
    private $genericoDelegado;

    public function __construct(Connection &$conexion) {
        $this->conexion = $conexion;
        if ($this->conexion == null) {
            $this->conexion = ConexionBD::getConexion();
        }
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->generarNotasModel = new GenerarNotasModel($conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
    }

    /**
     *  Se genera una nota a un recaudo.
     * @param array $transaccion Información para poder generar las notas a los recaudos.
     * (recaudo(mediopago,idsucursal,idconvenio,idempresa,idsuscriptor,idtercero)                        
     *  nota,distribucionrecaudo( El tipo de documento a generar ED,CS,IM,FI,VE,etcétera),tipotransaccion,idusuario,idsuscripcion,idempresa)
     */
    public function procesarDevolucionRecaudo(array $transaccion) {
        $transaccion['cicloperiodo'] = $this->genericoModel->getCicloPeriodoSuscripcion($transaccion['idsuscripcion']);
        $notaDevolucion = $this->getNotaDevolucion($transaccion);
        if (empty($transaccion['recaudo']) || empty($transaccion['nota']) || empty($transaccion['distribucionrecaudo']) || empty($transaccion['tipotransaccion'])) {
            throw new MyException('Error,Faltan parámetros para poder generar la nota');
        }
        $distribucion = $transaccion['distribucionrecaudo'];
        $idDocumento = $transaccion['recaudo']['iddocumento'];
        $idTipoDocumento = $distribucion[0]['idtipodocumento'];
        $infoTransaccion = $this->generarNotasModel->getTipoTransaccion($idDocumento, $idTipoDocumento, $transaccion['tipotransaccion']);
        $recaudoDevolucion = $this->getRecaudoDevolucion($transaccion, $infoTransaccion, $distribucion[0], $transaccion['vlrrecaudodevolucion']);
        $this->getNotaRecaudoDevolucion($notaDevolucion, $recaudoDevolucion);
        $this->getDistribucionRecaudoDevolucion($transaccion, $distribucion, $recaudoDevolucion);
        $this->genericoDelegado->actualizarRecaudoSaldoDevolucion($transaccion['recaudo']['idrecaudo'], $transaccion['recaudo']['version'], $transaccion['idsuscripcion']);
        return $notaDevolucion;
    }

    /**
     * Se crea una nota en la tabla de recaudos para el caso de uso de devolución.
     * @param array $transaccion información que compone la nota 
     * @param array $infoTransaccion Tipo de documento que se genera apartir de la nota
     * @return array toda la información de la nota ya generada
     */
    private function getRecaudoDevolucion(array &$transaccion, array $infoTransaccion, $distribucion, $vlrRecaudoDevolucion) {
        $recaudoNota['fecha'] = 'now()';
        $recaudoNota['estado'] = 'A';
        $recaudoNota['fechapago'] = 'now()';
        $recaudoNota['valorpagado'] = 0;
        $recaudoNota['valorcambio'] = 0;
        $recaudoNota['valorajuste'] = 0;
        $recaudoNota['valorreal'] = $vlrRecaudoDevolucion * -1;
        $recaudoNota['mediopago'] = $transaccion['recaudo']['mediopago'];
        $recaudoNota['idsucursal'] = $transaccion['recaudo']['idsucursal'];
        $recaudoNota['idconvenio'] = $distribucion['idconvenio'];
        $recaudoNota['idempresa'] = $distribucion['idempresa'];
        $recaudoNota['idsuscriptor'] = $transaccion['recaudo']['idsuscriptor'];
        $recaudoNota['idtercero'] = $transaccion['recaudo']['idtercero'];
        $recaudoNota['iddocumento'] = $infoTransaccion['iddocumento'];
        $recaudoNota['idrecaudoorigen'] = $transaccion['recaudo']['idrecaudo'];
        $recaudoNota['idrecaudopadre'] = $transaccion['recaudo']['idrecaudo'];
        $recaudoNota['idusuario'] = $transaccion['idusuario'];
        $infoRecaudoNota = $this->generarNotasModel->insertarRecaudo($recaudoNota);
        return $infoRecaudoNota;
    }

    private function getNotaDevolucion(array $transaccion) {
        $nota['fecha'] = 'now()';
        $nota['comentario'] = $transaccion['nota']['comentario'];
        $nota['idmotivonota'] = $transaccion['nota']['idmotivonota'];
        $nota['idsuscripcion'] = $transaccion['idsuscripcion'];
        $nota['idciclo'] = $transaccion['cicloperiodo']['idciclo'];
        $nota['cicloanio'] = $transaccion['cicloperiodo']['cicloanio'];
        $nota['idperiodo'] = $transaccion['cicloperiodo']['idperiodo'];
        $nota['idestructuranota'] = ESTRUCTURA_NOTA;
        $nota['idempresa'] = $transaccion['idempresa'];
        $nota['idusuario'] = $transaccion['idusuario'];
        $infoNota = $this->generarNotasModel->insertarNota($nota);
        return $infoNota;
    }

    private function getNotaRecaudoDevolucion(array $notaDevolucion, array $recaudoDevolucion) {
        $notaRecaudo['idnota'] = $notaDevolucion['idnota'];
        $notaRecaudo['idrecaudoorigen'] = $recaudoDevolucion['idrecaudoorigen'];
        $notaRecaudo['idrecaudo'] = $recaudoDevolucion['idrecaudo'];
        $notaRecaudo['idusuario'] = $recaudoDevolucion['idusuario'];
        return $this->generarNotasModel->insertarNotaRecaudo($notaRecaudo);
    }

    private function getDistribucionRecaudoDevolucion(array $transaccion, $distribuciones, $recaudoDevolucion = null) {
        foreach ($distribuciones as $distribucion){
            $distribucionRecaudoDevolucion['valorrecaudo'] = $distribucion['valorrecaudo'] * -1;
            $distribucionRecaudoDevolucion['saldorecaudo'] = 0;
            $distribucionRecaudoDevolucion['idrecaudo'] = $recaudoDevolucion['idrecaudo'];
            $distribucionRecaudoDevolucion['idconvenio'] = $distribucion['idconvenio'];
            $distribucionRecaudoDevolucion['idsuscripcion'] = $distribucion['idsuscripcion'];
            $distribucionRecaudoDevolucion['iddocumento'] = $distribucion['iddocumento'];
            $distribucionRecaudoDevolucion['idtipodocumento'] = $distribucion['idtipodocumento'];
            $distribucionRecaudoDevolucion['idconcepto'] = $distribucion['idconcepto'];
            $distribucionRecaudoDevolucion['idperiodo'] = $transaccion['cicloperiodo']['idperiodo'];
            $distribucionRecaudoDevolucion['idciclo'] = $transaccion['cicloperiodo']['idciclo'];
            $distribucionRecaudoDevolucion['idempresa'] = $distribucion['idempresa'];
            $distribucionRecaudoDevolucion['cicloanio'] = $transaccion['cicloperiodo']['cicloanio'];
            $distribucionRecaudoDevolucion['idusuario'] = $transaccion['idusuario'];
            $resultado =  $this->generarNotasModel->insertarDistribucionRecaudo($distribucionRecaudoDevolucion);
        }
        return $resultado;
    }

    /**
     * 
     * @param array $transaccion  (factura(idfactura),tipotransaccion,idusuario,nota())
     */
    public function procesarDevolucionFactura(array $transaccion) {
        if (empty($transaccion['factura']) || empty($transaccion['nota']) || empty($transaccion['tipotransaccion'])) {
            throw new MyException('Error,Faltan parámetros para poder generar la nota');
        }
        $facturaActual = $transaccion['factura'];
        $transaccion['cicloperiodo'] = $this->genericoModel->getCicloPeriodoSuscripcion($facturaActual['idsuscripcion']);
        $notaDevolucion = $this->getNotaDevolucion($transaccion);
        $facturaDevolucion = $this->getFacturaDevolucion($transaccion, $transaccion['cicloperiodo']);
        $listaDetalleFacturaDevolucion = $this->getDetalleFacturaDevolucion($transaccion, $facturaDevolucion);
        $this->getNotaFacturaDevolucion($listaDetalleFacturaDevolucion, $notaDevolucion, $facturaDevolucion);
        $this->genericoDelegado->actualizarFacturaSaldo($facturaActual['idfactura'], $facturaActual['version']);
        return $notaDevolucion;
    }

    /**
     * Se consulta si la devolción se va a generar apartir de una factura 
     * @deprecated since version  la funcionalidad no se va a utilizar porque las 
     * facturas ya no generan devolvución
     * @param type $transaccion
     * @param type $cicloPeriodo
     * @return type
     */
    private function getFacturaDevolucion($transaccion, $cicloPeriodo) {
        $facturaActual = $transaccion['factura'];
        $infoTransaccion = $this->generarNotasModel->getTipoTransaccion($facturaActual['iddocumento'], $facturaActual['idtipodocumento'], $transaccion['tipotransaccion']);
        $parametros['metodogenera'] = 'P';
        $parametros['estado'] = 'A';
        $parametros['fecha'] = 'now()';
        $parametros['idfacturapadre'] = $facturaActual['idfactura'];
        $parametros['fechaaprobacion'] = 'now()';
        $parametros['idempresa'] = $facturaActual['idempresa'];
        $parametros['idsuscriptor'] = $facturaActual['idsuscriptor'];
        $parametros['idsuscripcion'] = $facturaActual['idsuscripcion'];
        $parametros['idtiposuscripcion'] = $facturaActual['idtiposuscripcion'];
        $parametros['idtipousosuscripcion'] = $facturaActual['idtipousosuscripcion'];
        $parametros['idliquidacion'] = $facturaActual['idliquidacion'];
        $parametros['idtercero'] = $facturaActual['idtercero'];
        $parametros['idciclo'] = $cicloPeriodo['idciclo'];
        $parametros['idperiodo'] = $cicloPeriodo['idperiodo'];
        $parametros['iddocumento'] = $infoTransaccion['iddocumento'];
        $parametros['idtipodocumento'] = $facturaActual['idtipodocumento'];
        $parametros['cicloano'] = $cicloPeriodo['cicloanio'];
        $parametros['saldofactura'] = 0;
        $parametros['idfacturaorigen'] = $facturaActual['idfactura'];
        $parametros['idtipotercero'] = $facturaActual['idtipotercero'];
        $parametros['version'] = 1;
        $parametros['valortotal'] = -1 * $facturaActual['valortotal'];
        $parametros['idusuario'] = $transaccion['idusuario'];
        $idFactura = $this->genericoModel->insertarFactura($parametros);
        $parametros['idfactura'] = $idFactura;
        return $parametros;
    }

    /**
     * Se insertan los detalles de la factura 
     * @param type $transaccion
     * @param type $facturaDevolucion
     * @return type
     */
    private function getDetalleFacturaDevolucion($transaccion, $facturaDevolucion) {
        $facturaActual = $transaccion['factura'];
        $listaConcetos = $this->genericoModel->getConceptos($facturaActual['idfactura']);
        $listaConcetosDevolucion = array();
        foreach ($listaConcetos as $concepto) {
            $detalleFactura = array();
            $detalleFactura['estado'] = 'A';
            $detalleFactura['iddetallefacturaorigen'] = $concepto['iddetallefactura'];
            $detalleFactura['cantidad'] = $concepto['cantidad'];
            $detalleFactura['valorunitario'] = $concepto['valorunitario'];
            $detalleFactura['valortotal'] = $concepto['valortotal'];
            $detalleFactura['valorreal'] = $concepto['valorreal'] * -1;
            $detalleFactura['idconcepto'] = $concepto['idconcepto'];
            $detalleFactura['saldoreal'] = 0;
            $detalleFactura['idfactura'] = $facturaDevolucion['idfactura'];
            $detalleFactura['iddetallefacturapadre'] = $concepto['iddetallefactura'];
            $detalleFactura['version'] = 1;
            $detalleFactura['idusuario'] = $facturaDevolucion['idusuario'];
            $idDetalleFactura = $this->genericoModel->insertarDetalleFactura($detalleFactura);
            $detalleFactura['iddetallefactura'] = $idDetalleFactura;
            $listaConcetosDevolucion[] = $detalleFactura;
        }
        return $listaConcetosDevolucion;
    }

    /**
     * Crea la nota de la devolución del anticipo
     * @param type $listaDetalleFacturaDevolucion
     * @param type $notaDevolucion
     * @param type $facturaDevolucion
     */
    private function getNotaFacturaDevolucion($listaDetalleFacturaDevolucion, $notaDevolucion, $facturaDevolucion) {
        foreach ($listaDetalleFacturaDevolucion as $detalleFacturaDevolucion) {
            $notaFactura['idnota'] = $notaDevolucion['idnota'];
            $notaFactura['idfactura'] = $detalleFacturaDevolucion['idfactura'];
            $notaFactura['iddetallefactura'] = $detalleFacturaDevolucion['iddetallefactura'];
            $notaFactura['idfacturaorigen'] = $facturaDevolucion['idfacturaorigen'];
            $notaFactura['iddetallefacturaorigen'] = $detalleFacturaDevolucion['iddetallefacturaorigen'];
            $notaFactura['idusuario'] = $detalleFacturaDevolucion['idusuario'];
            $this->generarNotasModel->insertarNotaFactura($notaFactura);
        }
    }

}
