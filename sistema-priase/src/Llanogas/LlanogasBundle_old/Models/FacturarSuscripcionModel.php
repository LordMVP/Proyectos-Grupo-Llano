<?php

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * Description of FinanciacionModel
 *
 * @author hrey
 */
class FacturarSuscripcionModel extends AuditoriaServices {

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     * Constructor de la clase
     * @param Connection $conexion
     */
    public function __construct(Connection &$conexion) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($conexion);
    }

    /**
     * Consulta toda la información relacionada con un concepto 
     * @param int $idConcepto
     * @return array con la información del concepto
     * @throws MyException Se lanza una exception si el concepto no existe
     */
    public function getConceptoInformacion($idConcepto) {
        $parametros['idconcepto'] = $idConcepto;
        $sql = 'select con.uni_concepto idconcepto, con.est_concepto idestructuraconcepto,
                     con.con_nombre concepto,con.con_alias  alias, con.con_abreviatura abreviatura,
                     con.con_tipcalculo tipocalculo, con.con_valor valor, con.con_formula formula,
                     con.con_operacion operacion, con.con_naturaleza naturaleza,
                     con.con_preliquidar preliquidar, con.con_anticipo anticipo,
                     con.con_pagpriori  pagoprioridad, con.con_financiable financiable,
                     con.con_inivigencia iniciovigencia,con.con_finvigencia finvigencia,
                     con.con_estado estado ,con.prg_ideregistro idprograma, con.con_condonable condonable,
                     con.con_valnulo valornulo,con.usu_ideregistro idusuarioregistra,
                     con.con_tipregistro tiporegistro,con.fun_ideregistro idfuncion,
                     con.con_precision as precision,
                     con.con_metajuste metodo,
                     con.con_asdeshabitado deshabitado , 
                     con.con_aspuertapuerta puertapuerta , 
                     con.con_astarplena  tarifaplena,
                     con.con_ashomolacion homologacion , 
                     con.con_asaforado aforadoaseo , 
                     con.con_asaplicadinc aplicadinc, 
                     con.con_asaforater aforadotercero                                                                                    
                    from con_concepto con where con.uni_concepto =:idconcepto';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró el concepto  ' . $idConcepto, -1);
        }
        return $resultado[0];
    }

    /**
     * Consulta los conceptos relacionados de un concepto
     * de acuerdo a las liquidaciones 
     * @param string $idsConceptos lista de conceptos separados por ,
     * @param type $liquidaciones lista de liqudiaciones seoparados por ,
     * @return array lista de conceptos relacionados
     */
    public function getConceptosRelacionados($idsConceptos, $liquidaciones) {
        $sql = "select distinct con.uni_concepto idconcepto, con.est_concepto idestructuraconcepto,
                  con.con_nombre concepto,con.con_alias  alias, con.con_abreviatura abreviatura,
                  con.con_tipcalculo tipocalculo, con.con_valor valor, con.con_formula formula,
                  con.con_operacion operacion, con.con_naturaleza naturaleza,
                  con.con_preliquidar preliquidar, con.con_anticipo anticipo,
                  con.con_pagpriori  pagoprioridad, con.con_financiable financiable,
                  con.con_inivigencia iniciovigencia,con.con_finvigencia finvigencia,
                  con.con_estado estado ,con.prg_ideregistro idprograma, con.con_condonable condonable,
                  con.con_valnulo valornulo,con.usu_ideregistro idusuarioregistra,
                  con.con_tipregistro tiporegistro,con.fun_ideregistro idfuncion,
                  con.con_precision as precision,
                  con.con_metajuste metodo,
                  core. fun_ideregistro idfuncionrelacion
                from con_concepto con inner join core_conrelacio core on con.uni_concepto=core.uni_conrelacion
                           inner join coli_conliquida coli on coli.uni_concepto=core.uni_conrelacion
                where core.uni_concepto in ($idsConceptos) and coli.uni_liquidacion in ($liquidaciones)
                    AND (
                                CASE
                                WHEN con.con_finvigencia IS NULL THEN
                                        con.con_finvigencia IS NULL
                                ELSE
                                        con.con_finvigencia >= now() :: DATE
                                END
                        ) ";
        return $this->executeQuery($sql);
    }

    /**
     * Obtiene los rangos que aplican para un concepto
     * @param array $concepto
     * @return array lista de rangos
     */
    public function getRangoConcepto(&$concepto) {
        $parametros['idconcepto'] = $concepto['idconcepto'];
        $parametros['valortotal'] = $concepto['valortotal'];
        $sql = 'select raco.raco_ideregistr idrangoconcepto,raco.uni_concepto idconcepto,
                 raco.raco_raninicial rangoinicial, raco.raco_ranfinal rangofinal,
                 raco.raco_valor valor, raco.raco_formula formula, raco.usu_ideregistro idusuario 
               from raco_ranconcept  raco 
               where raco.uni_concepto=:idconcepto and :valortotal between  raco.raco_raninicial and  raco.raco_ranfinal';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta la información de una función en específico 
     * @param int $idFuncion
     * @return array información de la función
     * @throws MyException Error si la función no existe o no está parametrizado
     */
    public function getFuncion($idFuncion) {
        $parametros['idfuncion'] = $idFuncion;
        $sql = 'select 
               fun_nombre nombre,fun_descripcion descripcion,
               fun_tipo  tipo,fun_ideregistro idfuncion, fun_parametro numeroparametros,
               usu_ideregistro idusuario
              from fun_funcion where fun_ideregistro=:idfuncion';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró la función ' . $idFuncion, -1);
        }
        return $resultado[0];
    }

    /**
     * Valida si un concepto tiene rangos
     * @param type $idConcepto
     * @return boolean 
     */
    public function tieneRangoConcepto($idConcepto) {
        $parametros['idconcepto'] = $idConcepto;
        $sql = 'select count(*) numero from raco_ranconcept raco where raco.uni_concepto=:idconcepto';
        $resultado = $this->executeQuery($sql, $parametros);
        if ($resultado[0]['numero'] == 0) {
            return false;
        }
        return true;
    }

    /**
     * Obtiene la función de un concepto respecto a otro
     * @param int $idConceptoRelacionado
     * @param int $idConceptoLiquidar
     * @return array información de la función
     * @throws MyException
     */
    public function getFuncionRelacionada($idConceptoRelacionado, $idConceptoLiquidar) {
        $parametros['idconceptoliquidar'] = $idConceptoLiquidar;
        $parametros['idconceptorelacionado'] = $idConceptoRelacionado;
        $sql = 'SELECT
                 fun.fun_ideregistro idfuncionrelacionada,
                 fun.fun_nombre funcion
               FROM
                 core_conrelacio core INNER JOIN fun_funcion fun ON core.fun_ideregistro=fun.fun_ideregistro
               WHERE
                 core.uni_concepto = :idconceptoliquidar AND uni_conrelacion = :idconceptorelacionado';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró la función relacionada idconceptorelacionado: ' . $idConceptoRelacionado . ' idconceptoliquidar:' . $idConceptoLiquidar, -1);
        }
        return $resultado[0];
    }

}
