<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\FacturarSuscripcionModel;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de los recaudos.
 * @author hrey
 */
class FacturarSuscripcionDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

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
     * @var FacturarSuscripcionModel  
     */
    private $facturarSuscripcionModel;

    /**
     * Lista de los conceptos que ya están calculados
     * @var array  
     */
    public $listaConceptosLiquidados = array();

    /**
     *
     * @var FuncionesConceptosDelegado Objeto de la clase de funciones para poder invocar funciones que están registradas en la 
     * base de datos 
     */
    private $funcionesConceptosDelegado;

    /**
     *
     * @var int identificador del programa 
     */
    private $idPrograma;
    
    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Connection &$conexion, $idAcceso, $idSuscripcion, $idPrograma) {
        $this->idPrograma = $idPrograma;
        $this->conexion = $conexion;
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->facturarSuscripcionModel = new FacturarSuscripcionModel($this->conexion);
        $this->funcionesConceptosDelegado = new FuncionesConceptosDelegado($this->conexion, $idAcceso, $idSuscripcion, $idPrograma);
    }

    /**
     * Se establece unos conceptos iniciales para iniciar la liquidación
     *  
     * @param array $listaConceptosLiquidados
     */
    public function setListaConceptosLiquidados(array $listaConceptosLiquidados) {
        $this->listaConceptosLiquidados = $listaConceptosLiquidados;
    }

    /**
     * Lista de conceptos liquidados durante la ejecución
     * @return array
     */
    public function getListaConceptosLiquidados() {
        return $this->listaConceptosLiquidados;
    }

    /**
     * Método inicial que verifica si el concepto tiene toda la configuración
     * sino la tiene la consulta, verifica si el concepto ya fue liquidado, si éste fue
     * liquidado únicamente lo retorna de lo contrario realiza la liquidación 
     * y verifica qué tipo de concepto es si es un concepto que suma o informativo
     * @param integer $idConcepto
     * @param string $liquidaciones
     * @param array $infoConcepto
     * @return type
     */
    public function iniciarLiquidacionConcepto($idConcepto, $liquidaciones, array $infoConcepto = NULL) {
        if (empty($infoConcepto)) {
            $infoConcepto = $this->facturarSuscripcionModel->getConceptoInformacion($idConcepto);
        }
        //Verifica si el concepto ya fue liquidado
        $conceptoLiquidado = $this->buscarConceptoLiquidado($infoConcepto);
        if (!empty($conceptoLiquidado)) {
            return $conceptoLiquidado;
        }
        //liquida el concepto de acuerdo a los conceptos realcionados y rangos
        $this->liquidarConcepto($infoConcepto, $liquidaciones);
        $infoConceptoCalculado = $this->buscarConcepto($infoConcepto);
        // Valida si el concepto es informativo o suma
        $this->calculaValorRealConcepto($infoConceptoCalculado);
        return $infoConceptoCalculado;
    }

    /**
     * Valida qué tipo de concepto es, si es Valor únicamente ejecuta lafunción u obtiene el dato del campo con_valor
     * @param array $concepto
     */
    private function calcularConcepto(array &$concepto) {
        if ($concepto['tipocalculo'] == 'V') {
            // Ejecuta las reglas de negocio del concepto valor
            $this->calcularConceptoValor($concepto);
        } else {
            //Interpreta la foórmula del concepto
            $this->calcularConceptoFormula($concepto);
        }
        //Valdia si es concepto que suma y/o informativo
        $this->calculaValorRealConcepto($concepto);
    }

    /**
     * Función encargada de verificar si el concepto permite valore nulos
     * @param array $concepto información del concepto
     * @throws MyException Error el concepto no puede estar vacío 
     */
    private function validarConceptoNuloRespuesta($concepto) {
        if ($concepto['valortotal'] === NULL && $concepto['valornulo'] == 'N') {
            throw new MyException('El valor calculado del concepto ' . $concepto['idconcepto'] . ' ' . $concepto['concepto'] . ' es nulo ', -1);
        }
    }

    /**
     * Función encargada de verificar si el concepto permite valore nulos
     * @param array $concepto información del concepto
     * @throws MyException Error el concepto no puede estar vacío 
     */
    public function validarConceptoNulo(&$concepto) {
        if ($concepto['valor'] === NULL && $concepto['valornulo'] == 'N') {
            throw new MyException('Error el concepto no permite valores nulos :' . $concepto['idconcepto'] . ' ' . $concepto['concepto'], -1);
        }
    }

    /**
     * Calcula el valor del conepto de tipo valor 
     * @param array $concepto
     * @return array información del concepto liquidado
     * @throws MyException Si el concepto no pudo ser liquidado
     */
    private function calcularConceptoValor(array &$concepto) {
        // Si el tipo de concepto no aplica si ejecuta la función que tenga parametrizada
        if ($concepto['tiporegistro'] == 'N') {
            return $this->conceptoFuncion($concepto['idfuncion'], $concepto);
        }
        //Si el concepto tiene un valor se devuelve el concepto diligenciado
        if (!empty($concepto['valor'])) {
            $concepto['cantidad'] = 1;
            $concepto['valorunitario'] = $concepto['valor'];
            $concepto['valortotal'] = $concepto['valor'];
        }
        //Se verifica qie la función no éste vacía 
        if (!empty($concepto['idfuncion'])) {
            return $this->conceptoFuncion($concepto['idfuncion'], $concepto);
        }
        //Se valida que si el concepto permite valores nulo y se llena el concepto con 0
        if (empty($concepto['valor']) && $concepto['valornulo'] == 'S' && empty($concepto['idfuncion'])) {
            $concepto['cantidad'] = 1;
            $concepto['valorunitario'] = 0;
            $concepto['valortotal'] = 0;
            return $concepto;
        }

        throw new MyException('No se pudo calcular el concepto ' . $concepto['idconcepto'] . ' ' . $concepto['concepto'], -1);
    }

    /**
     *  Método encargado de evaluar el resultado después de interpretar la fórmula
     * @param type $idFuncion identificador de la funcion
     * @param type $concepto información del concepto liquidado
     * @return type información del concepto liquidado
     * @throws MyException Error al momento de ejecutar la función
     */
    private function conceptoFuncion($idFuncion, &$concepto) {
        $respuesta = $this->ejecutarFuncion($idFuncion, $concepto);
        if (!is_numeric($respuesta)) {
            throw new MyException("Error al ejecutar la función $idFuncion para el concepto " . $concepto['idconcepto'], -1);
        }
        $concepto['cantidad'] = 1;
        $concepto['valorunitario'] = $respuesta;
        $concepto['valortotal'] = $respuesta;
        return $concepto;
    }

    /**
     * Método encargado de interpretar la formula 
     * @param array $concepto
     * @throws MyException Si la fórmula no existe
     */
    private function calcularConceptoFormula(array &$concepto) {
        // Se valida que la fórmula no esté vacía
        if (empty($concepto['formula'])) {
            throw new MyException('El concepto ' . $concepto['idconcepto'] . ' - ' . $concepto['concepto'] . ' no tiene asociada una fórmula', -1);
        }
        try {
            //Se convierte la formula a un arreglo de php
            $formula = json_decode($concepto['formula'], true);
            //Se procede a procesar las partes de la formula
            $valorConcepto = $this->procesarFormula($formula, $concepto);
            // se redondea cada uno de los valores del concepto 
            $concepto['valortotal'] = round($valorConcepto, CANTIDAD_DECIMALES);
            $concepto['valorunitario'] = round($valorConcepto, CANTIDAD_DECIMALES);
            $concepto['cantidad'] = 1;
        } catch (MyException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw new MyException('Error al procesar la fórmula del concepto ' . $concepto['idconcepto'] . ' ' . $concepto['concepto'], -1);
        }
    }

    /**
     * Arma el árbol de dependia del conepto y valcula el valor de cada uno y verfica si 
     * el concepto tiene rangos
     * @param array $infoConcepto
     * @param string $liquidaciones
     * @return array información del concepto
     */
    private function liquidarConcepto($infoConcepto, $liquidaciones) {
        //Consulta los conceptos relacionados del concepto a liquidar
        $listaConceptos = $this->facturarSuscripcionModel->getConceptosRelacionados($infoConcepto['idconcepto'], $liquidaciones);
        foreach ($listaConceptos as $conceptoRelacionado) {
            // valida si el concepto relacionado ya fue liquidado
            $conceptoLiquidado = $this->buscarConceptoLiquidado($conceptoRelacionado);
            if (empty($conceptoLiquidado)) {
                //liquida el conceptorelacionado
                $this->liquidarConcepto($conceptoRelacionado, $liquidaciones);
            }
        }
        //Valida si el concepto se liquidó si ya está liquidado lo devuelve
        $conceptoLiquidado = $this->buscarConceptoLiquidado($infoConcepto);
        if (!empty($conceptoLiquidado)) {
            return;
        }
        //Liquida el valor de concepto de acuerdo a la suscripción
        $this->calcularConcepto($infoConcepto);
        //Se valida si el concepto tiene rangos
        if ($this->facturarSuscripcionModel->tieneRangoConcepto($infoConcepto['idconcepto'])) {
            //Se procede a verificar los rangos de los conceptos
            $this->evaluarRangoConcepto($infoConcepto);
            //Se valida si el concepto permite nulos 
            $this->validarConceptoNuloRespuesta($infoConcepto);
            //Valida el concepto real del concepto
            $this->calculaValorRealConcepto($infoConcepto);
        }
        //Se agrega el concepto a la lista de conceptos liquidados para no tener 
        //que liquidar dos veces el mismo concepto
        $this->listaConceptosLiquidados[] = $infoConcepto;
    }

    /**
     * Ejecuta la fórmula de forma aritmética 
     * @param array $arrayFormula
     * @param array $concepto
     * @return int
     */
    private function procesarFormula(array $arrayFormula, &$concepto) {
        $formula = '';
        // Se valida el tipo de segmento que tiene la formula, si es concepto, función y/o valor
        foreach ($arrayFormula as $segmento) {
            switch ($segmento['tipo']) {
                case 'fun':
                    $formula .= $this->procesarFuncionFormula($segmento, $concepto);
                    break;
                case 'con':
                    $valorConcepto = $this->liquidarConceptoRelacionado($segmento, $concepto);
                    $formula .= $valorConcepto;
                    break;
                default :
                    $formula .= $segmento['valor'];
                    break;
            }
        }
        $resultado = eval('return ' . $formula . ';');
        return $resultado;
    }

    /**
     * Se valida que si el concepto depende de otro y con qué fórmula se debe de calcular
     * @param array $conceptoRelacionado
     * @param array $conceptoLiquidar
     * @return array infoConcepto
     */
    private function liquidarConceptoRelacionado(array $conceptoRelacionado, array $conceptoLiquidar) {
        $infoConcepto = $this->buscarConcepto($conceptoRelacionado);
        $infoFuncion = $this->facturarSuscripcionModel->getFuncionRelacionada($infoConcepto['idconcepto'], $conceptoLiquidar['idconcepto']);
        return $this->ejecutarFuncion($infoFuncion['idfuncionrelacionada'], $infoConcepto);
    }

    /**
     * Método encargado por introspección de un objeto
     * ejetuta las funciones parametrizadas de un concepto
     * @param array $segmento
     * @param array $concepto
     * @return type
     * @throws MyException Error al ejecutar la función
     */
    private function procesarFuncionFormula(array $segmento, array &$concepto) {
        $nombreFuncion = $segmento['valor'];
        try {
            $method = new \ReflectionMethod(CLASE_FUNCIONES_CONCEPTOS, $nombreFuncion);
            /**
             * Procesa el json y genera los parámentros para la función
             * que se va a invocar por Reflection 
             */
            $parametros = $this->procesarParametrosFuncion($segmento);
            if (empty($parametros)) {
                $parametros[] = $concepto;
            }
            return $method->invokeArgs($this->funcionesConceptosDelegado, $parametros);
        } catch (\Exception $e) {
            throw new MyException('La función ' . $nombreFuncion . ' no existe en la clase ' . $e->getMessage(), -1);
        }
    }

    /**
     * Buscar si un concepto ya fue liquidado
     * @param array $concepto
     * @return array información del cocnepto liquidado
     */
    private function buscarConceptoLiquidado(array &$concepto) {
        foreach ($this->listaConceptosLiquidados as $infoConceptoLiquidado) {
            if ($concepto['idconcepto'] == $infoConceptoLiquidado['idconcepto']) {
                return $infoConceptoLiquidado;
            }
        }
    }

    /**
     *  Buscar el concepto liqudiado y pregunta si el concepto  es diferente de 'N' aplica
     *  la caracterísitcas de un concepto vacío
     * @param array $concepto
     * @return int
     * @throws MyException
     */
    private function buscarConcepto(array &$concepto) {
        $conceptoLiquidado = $this->buscarConceptoLiquidado($concepto);
        if (!empty($conceptoLiquidado)) {
            return $conceptoLiquidado;
        }
        /**
         * Consulta la información del concepto s
         */
        $infoConcepto = $this->facturarSuscripcionModel->getConceptoInformacion($concepto['idconcepto']);
        if ($infoConcepto['valornulo'] !== 'N') {
            $infoConcepto['valortotal'] = 0;
            $infoConcepto['valorunitario'] = 0;
            $infoConcepto['cantidad'] = 1;
            $infoConcepto['valorreal'] = 0;
            $this->listaConceptosLiquidados[] = $infoConcepto;
            return $infoConcepto;
        }
        //Si el concepto no fue liquidado o que no soporta valores nulos
        throw new MyException('El concepto ' . $concepto['idconcepto'] . ' - ' . $infoConcepto['concepto'] . ' no pudo ser liquidado ', -1);
    }

    /**
     * Establece el valor real del concepto
     * @param array $concepto información del concepto
     * @return array información del concepto con el valor real
     */
    private function calculaValorRealConcepto(&$concepto) {
        if ($concepto['operacion'] == 'S') {
            $concepto['valorreal'] = $concepto['valortotal'];
            return;
        }
        $concepto['valorreal'] = 0;
    }

    /**
     * Procesa la fórmula de acuerdo a los parámetros que se establecieron
     * @param array $segmento
     * @return array lista de parámetros ya procesados
     */
    private function procesarParametrosFuncion($segmento) {
        $listaParametros = array();
        foreach ($segmento['params'] as $parametro) {
            switch ($parametro['tipo']) {
                case 'valor':
                    $listaParametros[] = $parametro['valor'];
                    break;
                case 'con':
                    $concepto['idconcepto'] = $segmento['valor'];
                    $listaParametros[] = $this->buscarConcepto($concepto);
                    break;
            }
        }
        return $listaParametros;
    }

    /**
     * Se encarga de consultar y procesar los rangos del concepto
     * @param array $concepto
     * @return null si hay un error se lanza una excepción
     * @throws MyException Error al calcular el rango del concepto
     */
    private function evaluarRangoConcepto(&$concepto) {
        //Se consulta la información de los rangos de los conceptos de acuerdo al valor
        //liquidado
        $listaRangos = $this->facturarSuscripcionModel->getRangoConcepto($concepto);
        if (empty($listaRangos)) {
            throw new MyException('Error al liquidar el concepto ' . $concepto['idconcepto'] . ' ' . $concepto['concepto'] . ' valor: ' . $concepto['valortotal'], -1);
        }
        //Se valida si existe parametrizado un rango para el valor actual del concepto
        if (count($listaRangos) > 1) {
            throw new MyException('Error en los rangos del concepto ' . $concepto['idconcepto'] . ' ' . $concepto['concepto']);
        }
        //Se calcula el valor real del concepto
        $rangoConcepto = $listaRangos[0];
        if (is_numeric($rangoConcepto['valor'])) {
            $concepto['valortotal'] = $rangoConcepto['valor'];
            $concepto['valorunitario'] = $rangoConcepto['valor'];
            $concepto['cantidad'] = 1;
            $this->calculaValorRealConcepto($concepto);
            return;
        }
        // Se valida si el rango soporta valores nulos
        if (empty($rangoConcepto['valor']) && empty($rangoConcepto['formula']) && $concepto['valornulo'] == 'S') {
            $concepto['valortotal'] = 0;
            $concepto['valorunitario'] = 0;
            $concepto['valorreal'] = 0;
            $concepto['cantidad'] = 1;
            return;
        }
        if (empty($rangoConcepto['formula'])) {
            throw new MyException('El rango del concepto ' . $concepto['idconcepto'] . ' ' . $concepto['concepto'] . ' no tienen asociada una fórmula', -1);
        }
        //Se procesa la fórmula de los conceptos relacioandos
        $formula = json_decode($rangoConcepto['formula'], true);
        $valorConcepto = $this->procesarFormula($formula, $concepto);
        $concepto['valortotal'] = round($valorConcepto, CANTIDAD_DECIMALES);
        $concepto['valorunitario'] = round($valorConcepto, CANTIDAD_DECIMALES);
        $concepto['cantidad'] = 1;
    }

    /**
     * Invoca la función de la clase de FuncionesConceptosDelegados
     * @param int $idFuncion
     * @param array $concepto
     * @return int las funciones siempre deben retornar un valor numérico
     * @throws MyException Si la función devuelve errores
     */
    public function ejecutarFuncion($idFuncion, &$concepto) {
        $funcion = $this->facturarSuscripcionModel->getFuncion($idFuncion);
        try {
            //Se invoca el método por introspección
            $method = new \ReflectionMethod(CLASE_FUNCIONES_CONCEPTOS, $funcion['nombre']);
            $parametros[] = $concepto;
            //pasa los parámetros al método que se quiere invocar
            return $method->invokeArgs($this->funcionesConceptosDelegado, $parametros);
        } catch (\Exception $e) {
            throw new MyException('La función ' . $funcion['nombre'] . ' no existe en la clase ' . $concepto['idconcepto'] . ' ' . $concepto['concepto'] . ' ' . $e->getMessage(), -1);
        }
    }
    
}
