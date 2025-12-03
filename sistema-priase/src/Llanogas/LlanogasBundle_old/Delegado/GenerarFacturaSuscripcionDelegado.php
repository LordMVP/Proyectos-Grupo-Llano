<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\Models\FacturarSuscripcionModel;
use Llanogas\LlanogasBundle\Models\GenerarFacturaSuscripcionModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Utiles\ConceptosUtil;
use Llanogas\LlanogasBundle\MyException;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase que se encarga de realizar la liquidación de una de una suscripción
 * con la parametrización actual
 * @author hrey
 */
class GenerarFacturaSuscripcionDelegado {

    /**
     * @var array 
     */
    private $sesion;

    /**
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     * @var FacturarSuscripcionDelegado 
     */
    private $facturarSuscripcionDelegado;

    /**
     * @var GenerarFacturaSuscripcionModel 
     */
    private $generarFacturaSuscripcionModel;

    /**
     *
     * @var int 
     */
    private $idSuscripcion;

    /**
     *
     * @var FacturarSuscripcionModel 
     */
    private $facturarSuscripcionModel;

    public function __construct(Connection &$conexion, $idAcceso, $idSuscripcion, $idPrograma) {
        $this->genericoModel = new GenericoModel($conexion);
        $this->sesion = $this->genericoModel->getInfoSesion($idAcceso);
        $this->facturarSuscripcionDelegado = new FacturarSuscripcionDelegado($conexion, $idAcceso, $idSuscripcion, $idPrograma);
        $this->generarFacturaSuscripcionModel = new GenerarFacturaSuscripcionModel($conexion);
        $this->idSuscripcion = $idSuscripcion;
        $this->facturarSuscripcionModel = new FacturarSuscripcionModel($conexion);
    }

    /**
     * Liquida los conceptos de una liquidación dependiendo de una suscripción específica
     * @return array Lista de los conceptos liquidados
     */
    public function generarLiquidacion($listaConceptos = array()) {
        $this->facturarSuscripcionDelegado->setListaConceptosLiquidados($listaConceptos);
        $idLiquidacion = $this->generarFacturaSuscripcionModel->getLiquidacionSuscripcion($this->idSuscripcion);
        $listaConceptosLiquidar = $this->generarFacturaSuscripcionModel->getConceptosLiquidacion($idLiquidacion);
        $listaConceptosLiquidados = array();
        foreach ($listaConceptosLiquidar as $concepto) {
            $conceptoLiquidado = $this->facturarSuscripcionDelegado->iniciarLiquidacionConcepto($concepto['idconcepto'], $idLiquidacion);
            ConceptosUtil::redondearConceptoVenta($conceptoLiquidado);
            $listaConceptosLiquidados[] = $conceptoLiquidado;
        }
        return $listaConceptosLiquidados;
    }

    /**
     * Función encargada de ejecutarse con el programa de modificar lecturas, y se seleccionan los
     * conceptos que se quieren liquidar, no siempre se liquidan todos los conceptos 
     * @param type $listaConceptosInicial
     * @return type
     */
    public function generarLiquidacionParcial($listaConceptosInicial = array()) {
        $listaConceptos = $this->quitarConceptosDuplicados($listaConceptosInicial);
        $idLiquidacion = $this->generarFacturaSuscripcionModel->getLiquidacionSuscripcion($this->idSuscripcion);
        foreach ($listaConceptos as $concepto) {
            $this->facturarSuscripcionDelegado->iniciarLiquidacionConcepto($concepto['idconcepto'], $idLiquidacion);
        }
        $listaLiquidados = $this->facturarSuscripcionDelegado->getListaConceptosLiquidados();
        $listaConceptosLiquidados = array();
        foreach ($listaLiquidados as $concepto) {
            $this->facturarSuscripcionDelegado->iniciarLiquidacionConcepto($concepto['idconcepto'], $idLiquidacion);
            /**
             * Método encargado de redondear los conceptos
             */
            ConceptosUtil::redondearConceptoVenta($concepto);
            $listaConceptosLiquidados[] = $concepto;
        }

        return $listaConceptosLiquidados;
    }

    /**
     * Elimina los conceptos duplicados que puedan existir en la selección incial de los conceptos
     * @param array $listaConceptos
     * @return array
     */
    private function quitarConceptosDuplicados(array $listaConceptos) {
        $lstConceptos = array();
        foreach ($listaConceptos as $concepto) {
            $existe = FALSE;
            foreach ($lstConceptos as $registro) {
                if ($registro['idconcepto'] == $concepto['idconcepto']) {
                    $existe = TRUE;
                    break;
                }
            }
            if (!$existe) {
                $lstConceptos[] = $concepto;
            }
        }
        return $lstConceptos;
    }

    /**
     * Método actualmente no se utiliza, anteriormente 
     * se hacia para realizar los calculos de los conceptos de una venta
     * @deprecated since version 1 
     * @param type $listaConceptos
     * @return type
     */
    public function procesarConceptosInterfaz($listaConceptos) {
        if (empty($listaConceptos)) {
            return;
        }
        $listaConceptosProcesados = array();
        foreach ($listaConceptos as $concepto) {
            $infoConcepto = $this->facturarSuscripcionModel->getConceptoInformacion($concepto['idconcepto']);
            $this->calcularValorConcepto($infoConcepto, $concepto);
            $listaConceptosProcesados[] = $infoConcepto;
        }
        return $listaConceptosProcesados;
    }

    /**
     * Calcula el valor real de un concepto, dependiendo si el concepto suma o 
     * es informativo
     * @param type $infoConcepto
     * @param type $concepto
     * @return type
     */
    private function calcularValorConcepto(&$infoConcepto, &$concepto) {
        $infoConcepto['cantidad'] = 1;
        $infoConcepto['valorunitario'] = $concepto['valor'];
        $infoConcepto['valortotal'] = $concepto['valor'];
        if ($infoConcepto['operacion'] == 'S') {
            $infoConcepto['valorreal'] = $concepto['valor'];
            return;
        }
        $infoConcepto['valorreal'] = 0;
    }

}
