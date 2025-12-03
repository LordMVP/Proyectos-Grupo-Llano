<?php

namespace Llanogas\LlanogasBundle\Utiles;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Doctrine\DBAL\Connection;

class ConceptosUtil {

    /**
     *
     * @var array Información de los conceptos a tratar 
     */
    public static $listaConceptos = NULL;

    /**
     * Identificador de la empresa
     * @var int 
     */
    public static $idEmpresa = -1;

    /**
     * Genérico model
     * @var GenericoModel 
     */
    private $genericoModel;

    public function __construct(Connection &$conexion) {
        $this->genericoModel = new GenericoModel($conexion);
        if (empty(ConceptosUtil::$listaConceptos)) {
            $this->llenarLista();
        }
    }

    public function redondear(&$data, $tabla) {
        switch (strtolower($tabla)) {
            case 'dfac_detfactura':
                $this->redondearDetalleFactura($data);
                break;
            case 'dfin_detfinanci':
                $this->redondearDetalleFinanciacion($data);
                break;
            case 'damo_detamortiz':
                $this->redondearDetalleAmortizacion($data);
                break;
            case 'dven_detventa':
                $this->redondearDetalleVenta($data);
                break;
            case 'dvfi_detvenfinancia':
                $this->redondearDetalleVentaFinanciacion($data);
                break;
        }
    }

    private function redondearDetalleFactura(&$data) {

        if (!isset($data['uni_concepto'])) {
           return; 
           //throw new MyException('Error al procesar ( ' . implode('-', array_keys($data)) . ' )', -1);
        }
        if (isset($data['dfac_vlrtotal'])) {
            $data['dfac_vlrtotal'] = abs($this->redondearValor($data['uni_concepto'], $data['dfac_vlrtotal']));
        }
        if (isset($data['dfac_vlrreal'])) {
            $data['dfac_vlrreal'] = $this->redondearValor($data['uni_concepto'], $data['dfac_vlrreal']);
        }
        if (isset($data['dfac_sdoreal'])) {
            $data['dfac_sdoreal'] = $this->redondearValor($data['uni_concepto'], $data['dfac_sdoreal']);
        }
//        if (isset($data['dfac_vlrunitari'])) {
//            $data['dfac_vlrunitari'] = $this->redondearValor($data['uni_concepto'], $data['dfac_vlrunitari']);
//        }
    }

    private function redondearDetalleFinanciacion(&$data) {
        if (!isset($data['uni_concepto'])) {
            throw new MyException('Error al procesar ( ' . implode('-', array_keys($data)) . ' )', -1);
        }
        if (isset($data['dfin_vlrreal'])) {
            $data['dfin_vlrreal'] = $this->redondearValor($data['uni_concepto'], $data['dfin_vlrreal']);
        }
        if (isset($data['dfin_sdoreal'])) {
            $data['dfin_sdoreal'] = $this->redondearValor($data['uni_concepto'], $data['dfin_sdoreal']);
        }
    }

    private function redondearDetalleAmortizacion(&$data) {
        if (!isset($data['uni_concepto'])) {
            throw new MyException('Error al procesar ( ' . implode('-', array_keys($data)) . ' )', -1);
        }
        if (isset($data['damo_vlrreal'])) {
            $data['damo_vlrreal'] = $this->redondearValor($data['uni_concepto'], $data['damo_vlrreal']);
        }
    }

    private function redondearDetalleVenta(&$data) {
        if (!isset($data['uni_concepto'])) {
            throw new MyException('Error al procesar ( ' . implode('-', array_keys($data)) . ' )', -1);
        }
        if (isset($data['dven_vlrreal'])) {
            $data['dven_vlrreal'] = $this->redondearValor($data['uni_concepto'], $data['dven_vlrreal']);
        }
        if (isset($data['dven_vlrtotal'])) {
            $data['dven_vlrtotal'] = $this->redondearValor($data['uni_concepto'], $data['dven_vlrtotal']);
        }
    }

    public function redondearDetalleVentaFinanciacion(&$data) {
        if (!isset($data['uni_concepto'])) {
            throw new MyException('Error al procesar ( ' . implode('-', array_keys($data)) . ' )', -1);
        }
        if (isset($data['dvfi_vlrreal'])) {
            $data['dvfi_vlrreal'] = $this->redondearValor($data['uni_concepto'], $data['dvfi_vlrreal']);
        }
        if (isset($data['dvfi_sdoreal'])) {
            $data['dvfi_sdoreal'] = $this->redondearValor($data['uni_concepto'], $data['dvfi_sdoreal']);
        }
    }

    public function redondearValor($idConcepto, $valor) {
        $infoConcepto = ConceptosUtil::$listaConceptos['con_' . $idConcepto];
        if ($infoConcepto['metodo'] === 'T') {
            return int($valor);
        }
        if ($infoConcepto['metodo'] === 'R') {
            return round($valor, $infoConcepto['precision']);
        }
        return $valor;
    }

    private function llenarLista() {
        $listaConceptos = $this->genericoModel->getInfoConceptos(ConceptosUtil::$idEmpresa);
        foreach ($listaConceptos as $concepto) {
            ConceptosUtil::$listaConceptos['con_' . $concepto['idconcepto']] = $concepto;
        }
    }

    public static function redondearConceptoVenta(&$concepto) {
        if ($concepto['metodo'] == 'R') {
            $concepto['valorreal'] = round($concepto['valorreal'], $concepto['precision']);
            $concepto['valortotal'] = round($concepto['valortotal'], $concepto['precision']);
            return;
        }
        if ($concepto['metodo'] == 'T') {
            $concepto['valorreal'] = int($concepto['valorreal']);
            $concepto['valortotal'] = int($concepto['valortotal']);
            return;
        }
    }

}
