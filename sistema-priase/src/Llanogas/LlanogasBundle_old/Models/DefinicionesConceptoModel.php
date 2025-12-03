<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * permite establecer definir parametrizaciónde conceptos
 *
 * @author Sergio Vargas
 * @date 20 Jul 2015
 *
 */
class DefinicionesConceptoModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    // <editor-fold desc="Conceptos y relaciones de conceptos">

    /**
     * permite obtener el validarAliasModel
     * @param type $strValidar
     * @return Array validarAliasModel
     */
    public function validarAliasModel($strValidar) {
        $sql = "SELECT
                        con_alias
                FROM
                        con_concepto
                WHERE
                        con_alias =:strValidar";
        $parametros["strValidar"] = $strValidar;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Lista todos los conceptos relacionados  si se incluye el parámetro  omite dicho concepto y obtiene los demás
     * @param int $idconcepto
     * @return listado de conceptos
     */
    public function getConceptos($idconcepto = null, $omitir = true, $idempresa, $esnuevo = false) {
        $complemento = null;
        $parametros = array();
        if (!empty($idconcepto) && $omitir == true) {
            $complemento = " and  con.uni_concepto != :idconcepto";
            $parametros["idconcepto"] = $idconcepto;
        } else if (!empty($idconcepto) && !$esnuevo) {
            $complemento = " and  con.uni_concepto = :idconcepto";
            $parametros["idconcepto"] = $idconcepto;
        }
        $parametros['idempresa'] = $idempresa;
        $sql = "SELECT
                        con.uni_concepto idconcepto,
                        con.con_nombre nombre,
                        con.con_alias AS ALIAS,
                        con.con_abreviatura abreviatura,
                        con.con_tipcalculo tipcalculo,
                        con.con_tipregistro campoconcepto,
                        con.con_operacion operacion,
                        con.con_preliquidar preliquidar,
                        con.con_anticipo anticipo,
                        con.con_pagpriori pagprioridad,
                        con.con_financiable financiable,
                        con.con_inivigencia fechainicialvigencia,
                        con.con_finvigencia fechafinalvigencia,
                        con.con_valor valor,
                        con.con_formula formula,
                        con.con_estado estado,
                        con.con_operacion operacion,
                        con.con_valnulo nulo,
                        con.con_condonable condonable,
                        con.con_suspende suspende,
                        con.fun_ideregistro idfuncion,
                        con.con_intfinanciacion interes,
                        con.con_metajuste ajuste,
                        con.con_precision redondeo,
                        con.con_asdeshabitado  deshabitado,
                        con.con_aspuertapuerta puertapuerta ,
                        con.con_astarplena tarifaplena ,
                        con.con_ashomolacion homologacion, 
                        con.con_asaforado aforadoaseo ,
                        con.con_asaplicadinc aplicadinc , 
                        con.con_asaforater aforadotercero
                FROM
                        con_concepto con
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = con.est_concepto
                                WHERE
                        esem.emp_ideregistro = :idempresa  " . $complemento;
        $resultado = $this->executeQuery($sql, $parametros);

        return $resultado;
    }

    /**
     * Permite visualizar los conceptos relacionados
     * @param int $idconcepto
     * @return array
     * @throws Lanza una excepcion de validación por idconcepto
     */
    public function getConceptosRelacionadosModel($idconcepto, $idempresa) {
        if (empty($idconcepto)) {
            throw new MyException('Debe existir un concepto para visualizar los relacionados', -1);
        }
        $parametros["idconcepto"] = $idconcepto;
        $parametros["idempresa"] = $idempresa;

        $sql = "SELECT 
                        core.uni_concepto idconcepto,
                        core.uni_conrelacion idconceptorelacionado,
                        conre.con_nombre conceptorelacionado,
                        fun.fun_ideregistro idfuncion
                FROM
                        core_conrelacio core
                INNER JOIN con_concepto conre ON conre.uni_concepto = core.uni_conrelacion
                INNER JOIN fun_funcion fun ON fun.fun_ideregistro = core.fun_ideregistro
                INNER JOIN esem_estempresa esem on esem.est_ideregistro = conre.est_concepto
                WHERE
                        fun.fun_tipo = 'A' AND core.uni_concepto = :idconcepto  AND esem.emp_ideregistro= :idempresa 
                ORDER BY
                        conre.con_nombre";

        $resultado = $this->executeQuery($sql, $parametros);

        return $resultado;
    }

    /**
     * Lista los conceptos disponibles para parámetrizar
     * @param int $idempresa identificador de la empresa
     * @return Array listado de conceptos diponibles a párametrizar
     */
    public function getConceptosParametrizables($idempresa) {
        $sql = "SELECT
                            uni.uni_ideregistro idconcepto,
                            uni.uni_nombre1 concepto,
                            uni.est_ideregistro estconcepto
                    FROM
                            uni_unidad uni
                    INNER JOIN est_estructura est ON uni.est_ideregistro = est.est_ideregistro
                    INNER JOIN esem_estempresa esem ON esem.est_ideregistro = est.est_ideregistro
                    INNER JOIN cla_clase cla ON cla.cla_ideregistro = est.cla_ideregistro
                    WHERE
                            cla.cla_ideregistro = 6
                    AND esem.emp_ideregistro = $idempresa
                    AND uni.uni_ideregistro NOT IN ( 
                            SELECT
                                    con.uni_concepto
                            FROM
                                    con_concepto con
                    )";
        return $this->executeQuery($sql);
    }

    /**
     * listado de concepto filtrasdos por nombre
     * @param string $cadena
     * @return array de conceptos
     */
    public function getConceptosPorNombre($cadena, $idempresa, $idusuario) {
        $parametros['idempresa'] = $idempresa;
        $parametros['idconcepto'] = -1;
        $parametros['idprograma'] = PROGRAMA_CONCEPTOS;
        $parametros['idusuario'] = $idusuario;
        if (is_numeric(trim($cadena))) {
            $parametros['idconcepto'] = trim($cadena);
        }
        $sql = "SELECT
                        con.uni_concepto idconcepto,
                        con.con_nombre as nombre,
                        con.con_alias ALIAS,
                        con.con_abreviatura abreviatura,
                        con.con_tipcalculo tipcalculo,
                        con.con_tipregistro campoconcepto,
                        con.con_operacion operacion,
                        con.con_preliquidar preliquidar,
                        con.con_anticipo anticipo,
                        con.con_pagpriori pagprioridad,
                        con.con_financiable financiable,
                        con.con_inivigencia fechainicialvigencia,
                        con.con_finvigencia fechafinalvigencia,
                        con.con_valor valor,
                        con.con_formula formula,
                        con.con_estado estado,
                        con.con_operacion operacion,
                        con.con_valnulo nulo,
                        con.con_condonable condonable,
                        con.con_suspende suspende,
                        con.con_intfinanciacion interes,
                        con.fun_ideregistro idfuncion,
                        con.prg_ideregistro idprograma,
                        con.con_metajuste ajuste,
                        con.con_precision redondeo,
                        con.con_asdeshabitado  deshabitado,
                        con.con_aspuertapuerta puertapuerta ,
                        con.con_astarplena tarifaplena ,
                        con.con_ashomolacion homologacion, 
                        con.con_asaforado aforadoaseo ,
                        con.con_asaplicadinc aplicadinc , 
                        con.con_asaforater aforadotercero
                FROM
                        con_concepto con
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = con.est_concepto
                INNER JOIN prun_prgunidad prun on prun.uni_ideregistro = con.uni_concepto
		INNER JOIN uspu_usuprgunid uspu ON uspu.prun_ideregistr = prun.prun_ideregistr

                WHERE   ( lower (con.con_nombre) like lower('%$cadena%') OR con.uni_concepto=:idconcepto )and esem.emp_ideregistro = :idempresa and prun.prg_ideregistro =:idprograma and uspu.usu_ideregistro =:idusuario ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Limpia los conceptos relacionados existentes en idconcepto
     * @param int $idconcepto
     */
    public function limpiarConceptosRelacionadosModel($idconcepto) {
        if (empty($idconcepto)) {
            throw new MyException('Debe existir un concepto para visualizar los relacionados', -1);
        }
        $resultado = $this->eliminar("core_conrelacio", "uni_concepto = $idconcepto");
        return $resultado;
    }

    /**
     * Limpia los conceptos relacionados existentes en idconcepto
     * @param int $idconceptorelacionado
     * @param int $idconcepto
     */
    public function eliminarConceptosRelacionadosModel($idconceptorelacionado, $idconcepto) {
        if (empty($idconceptorelacionado)) {
            throw new MyException('Debe existir un concepto para visualizar los relacionados', -1);
        }
        $resultado = $this->eliminar("core_conrelacio", "uni_concepto  = $idconcepto and uni_conrelacion = $idconceptorelacionado");
        return $resultado;
    }

    /**
     * Permite construir un concepto relacionado
     * @param ConceptoRelacionado $conceptorelacionado
     * @return Cantida de filasafectadas
     */
    public function crearConceptorelacionadoModel($conceptorelacionado) {
        $parametros = array();
        $this->setCampo($conceptorelacionado, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($conceptorelacionado, $parametros, 'idconceptorelacionado', 'uni_conrelacion');
        $this->setCampo($conceptorelacionado, $parametros, 'idfuncion', 'fun_ideregistro');
        $this->setCampo($conceptorelacionado, $parametros, 'idusuario', 'usu_ideregistro');
        return $this->insertar($parametros, 'core_conrelacio', 'sq_core_ideregistr');
    }

    /**
     * Permite actualizar  un concepto relacionado
     * @param ConceptoRelacionado $conceptorelacionado
     * @return Cantida de filasafectadas
     */
    public function actualizarConceptoRelacionadoModel($conceptorelacionado) {
        $parametros = array();
        $this->setCampo($conceptorelacionado, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($conceptorelacionado, $parametros, 'idconceptorelacionado', 'uni_conrelacion');
        $this->setCampo($conceptorelacionado, $parametros, 'idfuncion', 'fun_ideregistro');
        $this->setCampo($conceptorelacionado, $parametros, 'idusuario', 'usu_ideregistro');
        $idconcepto = $conceptorelacionado['idconcepto'];
        $idconceptorelacionado = $conceptorelacionado['idconceptorelacionado'];
        return $this->actualizar($parametros, 'core_conrelacio', "uni_concepto=$idconcepto and uni_conrelacion=$idconceptorelacionado");
    }

    /**
     *  listado de los programas por tipo
     * @return array
     */
    public function getProgramas() {
        $sql = "SELECT
                        pgr.prg_ideregistro idpgrograma,
                        pgr.prg_nombre nombre
                FROM
                        prg_programa pgr
                WHERE
                        pgr.prg_tipo = 'CO'";
        return $this->executeQuery($sql);
    }

    /**
     * listado de tabla de origen
     * @param int $idprograma
     * @return listados tablas de origen
     */
    public function getTablaOrigen($idprograma) {
        $sql = "SELECT
                        tor.tor_ideregistro idorigen,
                        tor.tor_nomtabla
                FROM
                        tor_taborigen tor
                WHERE
                        tor.prg_ideregistro = :idprograma";
        $parametros['idprograma'] = $idprograma;
        $respuesta = $this->executeQuery($sql, $parametros);

        if (empty($respuesta)) {
            throw new MyException("No se encuentra la tabla de origen", -1);
        }
        return $respuesta;
    }

    /**
     * listado de campo dependiendo de tabla de origen
     * @param int $idtablaorigen
     * @return array
     */
    public function getCampo($idtablaorigen) {
        $sql = "SELECT
                        dtor.dtor_ideregistr idcampo,
                        dtor.dtor_nomcampo campo
                FROM
                        dtor_dettaborig dtor
                WHERE
                        dtor.dtor_ideregistr =:idtablaorigen
                AND dtor_registro = 'S'";
        $parametros['idtablaorigen'] = $idtablaorigen;
        $respuesta = $this->executeQuery($sql, $parametros);

        if (empty($respuesta)) {
            throw new MyException("No se encuentra campo asociado", -1);
        }
        return $respuesta;
    }

    /**
     * listado de documentos por empresa
     * @deprecated usar el getDocumentoPerfil de GenericoModel version 1.0
     * @param int $idempresa
     * @return array  de documentos
     */
    public function getDocumentos($idempresa, $condicion = null) {
        $restriccion = '';
        if (!empty($condicion)) {
            $restriccion = " and $condicion";
        }
        $sql = "SELECT DISTINCT
                        doc.uni_documento iddocumento,
                        doc.doc_nombre nombre,
                        doc.doc_tipo tipo

                FROM
                        doc_documento doc
                INNER JOIN doti_doctipo doti ON doti.uni_documento = doc.uni_documento
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = doc.est_documento
                where esem.emp_ideregistro = :idempresa $restriccion
                ORDER BY
                        doc.doc_nombre;";
        $parametros["idempresa"] = $idempresa;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * listado de tipos de documentos
     * @deprecated use el getTipoDocumentoPerfil de generico Model version 1.0
     * @param int $idempresa
     * @param int $iddocumento
     * @return array listados de documentos
     */
    public function getTipoDocumentoModel($idempresa, &$iddocumento = null) {
        $complemento = '';
        $parametros = array();
        if (!empty($iddocumento)) {
            $complemento = "where doti.uni_documento = :iddocumento";
            $parametros["iddocumento"] = $iddocumento;
        }
        $sql = "SELECT DISTINCT
                        tido.uni_tipdocument idtipodocumento,
                        tido.tido_nombre nombre
                FROM
                        tido_tipdocumen tido
                INNER JOIN doti_doctipo doti ON tido.uni_tipdocument = doti.uni_tipdocument
                INNER JOIN esem_estempresa esem ON esem.esem_ideregistr = tido.est_tipdocument
                AND esem.emp_ideregistro = :idempresa " . $complemento . "
                ORDER BY
                        tido.tido_nombre;";
        $parametros['idempresa'] = $idempresa;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * listado de las liquidaciones disponibles por empresa
     * @param int $idempresa
     * @return array de liquidaciones
     */
    public function getLiquidacionModel($idempresa) {
        $sql = "SELECT
                        uni_liquidacion idliquidacion,
                        liq_nombre nombre
                FROM
                        liq_liquidacion liq
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = liq.est_liquidacion
                AND esem.emp_ideregistro = :idempresa
                order by liq_nombre ";
        $parametros['idempresa'] = $idempresa;
        return $this->executeQuery($sql, $parametros);
    }

    public function getDocumentoLiquidacionModel($idliquidacion) {
        $sql = "SELECT
                        liq.uni_documento documentoid,
                        doc.doc_nombre documento,
                        liq.uni_tipdocument idtipodocumento,
                        tido.tido_nombre tipodocumento
                FROM
                        liq_liquidacion liq
                INNER JOIN doc_documento doc ON doc.uni_documento = liq.uni_documento
                INNER JOIN tido_tipdocumen tido ON tido.uni_tipdocument = liq.uni_tipdocument
                WHERE
                        uni_liquidacion = :idliquidacion";
        $parametros['idliquidacion'] = $idliquidacion;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * permite actualizar los conceptos
     * @param int $concepto
     * @return cantidad de  campos afectados
     */
    public function actualizarConceptoModel($concepto) {
        $parametros = array();
        $this->setCampo($concepto, $parametros, 'estconcepto', 'est_concepto');
        $this->setCampo($concepto, $parametros, 'nombre', 'con_nombre');
        $this->setCampo($concepto, $parametros, 'alias', 'con_alias');
        $this->setCampo($concepto, $parametros, 'abreviatura', 'con_abreviatura');
        $this->setCampo($concepto, $parametros, 'tipcalculo', 'con_tipcalculo');
        $this->setCampo($concepto, $parametros, 'valor', 'con_valor');
        $this->setCampo($concepto, $parametros, 'formula', 'con_formula');
        $this->setCampo($concepto, $parametros, 'operacion', 'con_operacion');
        $this->setCampo($concepto, $parametros, 'preliquidar', 'con_preliquidar');
        $this->setCampo($concepto, $parametros, 'anticipo', 'con_anticipo');
        $this->setCampo($concepto, $parametros, 'pagprioridad', 'con_pagpriori');
        $this->setCampo($concepto, $parametros, 'financiable', 'con_financiable');
        $this->setCampo($concepto, $parametros, 'tipcalculo', 'con_tipcalculo');
        $this->setCampo($concepto, $parametros, 'fechainicialvigencia', 'con_inivigencia');
        $this->setCampo($concepto, $parametros, 'fechafinalvigencia', 'con_finvigencia');
        $this->setCampo($concepto, $parametros, 'estado', 'con_estado');
        $this->setCampo($concepto, $parametros, 'idprograma', 'prg_ideregistro');
        $this->setCampo($concepto, $parametros, 'campoconcepto', 'con_tipregistro');
        $this->setCampo($concepto, $parametros, 'nulo', 'con_valnulo');
        $this->setCampo($concepto, $parametros, 'condonable', 'con_condonable');
        $this->setCampo($concepto, $parametros, 'permitesuspender', 'con_suspende');
        $this->setCampo($concepto, $parametros, 'interesfinanciacion', 'con_intfinanciacion');
        $this->setCampo($concepto, $parametros, 'idfuncion', 'fun_ideregistro');
        $this->setCampo($concepto, $parametros, 'ajuste', 'con_metajuste');
        $this->setCampo($concepto, $parametros, 'deshabitado', 'con_asdeshabitado');
        $this->setCampo($concepto, $parametros, 'puertapuerta', 'con_aspuertapuerta');
        $this->setCampo($concepto, $parametros, 'tarifaplena', 'con_astarplena');
        $this->setCampo($concepto, $parametros, 'homologacion', 'con_ashomolacion');
        $this->setCampo($concepto, $parametros, 'aforadoaseo', 'con_asaforado');
        $this->setCampo($concepto, $parametros, 'aplicadinc', 'con_asaplicadinc');
        $this->setCampo($concepto, $parametros, 'aforadotercero', 'con_asaforater');
        //$this->setCampo($concepto, $parametros, 'precision', 'con_precision');
        $this->setCampo($concepto, $parametros, 'idusuario', 'usu_ideregistro');

        if ($concepto['tipcalculo'] === 'V') {
            $parametros['con_formula'] = NULL;
        }

        if ($concepto['tipcalculo'] === 'F') {
            if (empty(trim($parametros['con_formula']))) {
                throw new MyException('No se encuentra ninguna formula asociada', -1);
            }
            $parametros['con_valor'] = NULL;
        }

        $parametros['con_precision'] = NULL;
        if ($concepto['ajuste'] === 'R') {
            $parametros['con_precision'] = $concepto['precision'];
        }

        return $this->actualizar($parametros, 'con_concepto', 'uni_concepto = ' . $concepto['idconcepto']);
    }

    /**
     * permite actualizar los conceptos
     * @param int $concepto
     * @return cantidad de  campos afectados
     */
    public function insertarConceptoModel($concepto) {
        $parametros = array();
        $this->setCampo($concepto, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($concepto, $parametros, 'estconcepto', 'est_concepto');
        $this->setCampo($concepto, $parametros, 'nombre', 'con_nombre');
        $this->setCampo($concepto, $parametros, 'alias', 'con_alias');
        $this->setCampo($concepto, $parametros, 'abreviatura', 'con_abreviatura');
        $this->setCampo($concepto, $parametros, 'tipcalculo', 'con_tipcalculo');
        $this->setCampo($concepto, $parametros, 'valor', 'con_valor');
        $this->setCampo($concepto, $parametros, 'formula', 'con_formula');
        $this->setCampo($concepto, $parametros, 'operacion', 'con_operacion');
        $this->setCampo($concepto, $parametros, 'preliquidar', 'con_preliquidar');
        $this->setCampo($concepto, $parametros, 'anticipo', 'con_anticipo');
        $this->setCampo($concepto, $parametros, 'pagprioridad', 'con_pagpriori');
        $this->setCampo($concepto, $parametros, 'financiable', 'con_financiable');
        $this->setCampo($concepto, $parametros, 'tipcalculo', 'con_tipcalculo');
        $this->setCampo($concepto, $parametros, 'fechainicialvigencia', 'con_inivigencia');
        $this->setCampo($concepto, $parametros, 'fechafinalvigencia', 'con_finvigencia');
        $this->setCampo($concepto, $parametros, 'estado', 'con_estado');
        $this->setCampo($concepto, $parametros, 'idprograma', 'prg_ideregistro');
        $this->setCampo($concepto, $parametros, 'campoconcepto', 'con_tipregistro');
        $this->setCampo($concepto, $parametros, 'nulo', 'con_valnulo');
        $this->setCampo($concepto, $parametros, 'condonable', 'con_condonable');
        $this->setCampo($concepto, $parametros, 'permitesuspender', 'con_suspende');
        $this->setCampo($concepto, $parametros, 'idfuncion', 'fun_ideregistro');
        $this->setCampo($concepto, $parametros, 'interesfinanciacion', 'con_intfinanciacion');
        $this->setCampo($concepto, $parametros, 'ajuste', 'con_metajuste');
        $this->setCampo($concepto, $parametros, 'precision', 'con_precision');
        $this->setCampo($concepto, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($concepto, $parametros, 'deshabitado', 'con_asdeshabitado');
        $this->setCampo($concepto, $parametros, 'puertapuerta', 'con_aspuertapuerta');
        $this->setCampo($concepto, $parametros, 'tarifaplena', 'con_astarplena');
        $this->setCampo($concepto, $parametros, 'homologacion', 'con_ashomolacion');
        $this->setCampo($concepto, $parametros, 'aforadoaseo', 'con_asaforado');
        $this->setCampo($concepto, $parametros, 'aplicadinc', 'con_asaplicadinc');
        $this->setCampo($concepto, $parametros, 'aforadotercero', 'con_asaforater');

        if ($concepto['tipcalculo'] === 'F') {
            if (empty(trim($parametros['con_formula']))) {
                throw new MyException('No se encuentra ninguna formula asociada', -1);
            }
        }

        return $this->insertar($parametros, 'con_concepto', null);
    }

    /**
     * Obtiene un listado de funciones disponibles
     * @return Array
     */
    public function getFuncionesModel($idfuncion = null, $tipo = null) {
        $complemento = null;
        if (!empty($idfuncion)) {
            $complemento = "  fun.fun_ideregistro = $idfuncion";
        }
        if (!empty($tipo)) {
            $complemento = "  WHERE fun_tipo='$tipo' ";
        }
        $sql = "SELECT
                        fun.fun_nombre nombre,
                        fun.fun_ideregistro idfuncion,
                        fun.fun_parametro parametro,
                        fun.fun_descripcion descripcion
                FROM
                        fun_funcion fun " . $complemento;
        return $this->executeQuery($sql);
    }

    // </editor-fold>
    // <editor-fold desc="rangos de conceptos">

    /**
     * Permite obtener los rango expuestos para un concepto predeterminado
     * @param int $idconcepto
     * @return array de conceptos
     */
    public function getRangosConceptosModel($idconcepto) {
        $sql = "SELECT
                        raco.raco_ideregistr idrango,
                        raco.raco_raninicial rangoinicial,
                        raco.raco_ranfinal rangofinal,
                        raco_valor valor,
                        raco.raco_formula formula
                FROM
                        raco_ranconcept raco
                WHERE
                        raco.uni_concepto = :idconcepto";
        $parametros["idconcepto"] = $idconcepto;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * permite la construccion de rangos en los conceptos
     * @param RangoConceptos $rangoconceptos
     * @return int cantidad de filas afectadas
     */
    public function crearRangoConceptosModel($rangoconceptos) {
        $parametros = array();
        $this->setCampo($rangoconceptos, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($rangoconceptos, $parametros, 'rangoinicial', 'raco_raninicial');
        $this->setCampo($rangoconceptos, $parametros, 'rangofinal', 'raco_ranfinal');
        $this->setCampo($rangoconceptos, $parametros, 'valor', 'raco_valor');
        $this->setCampo($rangoconceptos, $parametros, 'formula', 'raco_formula');
        $this->setCampo($rangoconceptos, $parametros, 'usuario', 'usu_ideregistro');

        return $this->insertar($parametros, 'raco_ranconcept', 'sq_raco_ideregistr');
    }

    public function actualizarRangoConceptosModel($rangoconceptos) {
        $parametros = array();
        $this->setCampo($rangoconceptos, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($rangoconceptos, $parametros, 'rangoinicial', 'raco_raninicial');
        $this->setCampo($rangoconceptos, $parametros, 'rangofinal', 'raco_ranfinal');
        $this->setCampo($rangoconceptos, $parametros, 'valor', 'raco_valor');
        $this->setCampo($rangoconceptos, $parametros, 'formula', 'raco_formula');
        $this->setCampo($rangoconceptos, $parametros, 'usuario', 'usu_ideregistro');

        return $this->actualizar($parametros, 'raco_ranconcept', "raco_ideregistr = " . $rangoconceptos['idrango']);
    }

    /**
     * Permite elimiar un rango concepto
     * @param int $idrangoconcepto identificador de rango concepto
     * @return int cantidad de filas afectadas
     * @throws MyException validación de $idrangoconcepto
     */
    public function eliminarRangoConceptoModel($idrangoconcepto) {
        if (empty($idrangoconcepto)) {
            throw new MyException('Debe existir rango de concepto para eliminar', -1);
        }
        $resultado = $this->eliminar("raco_ranconcept", "raco_ideregistr = $idrangoconcepto");
        return $resultado;
    }

    /**
     * Realiza una eliminación de los conceptos asociados a un rango
     * @param int $idconcepto identificador del concepto
     * @return int cantidad de filas afectadas en la eliminación
     * @throws MyException 'debe existir un concepto a eliminar '
     */
    public function limpiarRangoConceptoModel($idconcepto) {
        if (empty($idconcepto)) {
            throw new MyException('Debe existir rango de concepto para eliminar', -1);
        }
        $resultado = $this->eliminar("raco_ranconcept", "uni_concepto = $idconcepto");
        return $resultado;
    }

    // </editor-fold>
    // <editor-fold desc="Contabilización Conceptos">
    // <editor-fold desc="causión contable">
    // <editor-fold desc="contabilizacion">
    /**
     * lista la información de contabilización
     * @param type $idconcepto
     * @return array listado de la contabilización
     */
    public function obtenerContabilizacionModel($idconcepto, $idempresa, $iddocumento, $idtipodocumento) {
        $sql = "SELECT
                        codo_ideregistr idcontabilizacion,
                        doc.doc_nombre documento,
                        codo.uni_documento iddocumento,
                        codo.uni_tipdocument idtipodocumento,
                        tido.tido_nombre tipodocumento,
                        cue.cue_nombre cuenta,
                        cue.cue_codigo numerocuenta,
                        codo.cue_codigo codigo,
                        codo.codo_porcentaje porcentaje,
                        codo.codo_naturaleza naturaleza
                FROM
                        codo_condocumen codo
                INNER JOIN doc_documento doc ON doc.uni_documento = codo.uni_documento
                INNER JOIN tido_tipdocumen tido ON tido.uni_tipdocument = codo.uni_tipdocument
                INNER JOIN cue_cuenta cue ON cue.cue_ideregistro = codo.cue_ideregistro
                WHERE
                      uni_concepto = :idconcepto and codo.emp_ideregistro= :idempresa
                      AND doc.uni_documento = :iddocumento
                      AND tido.uni_tipdocument = :idtipodocumento ";
        $parametros["idempresa"] = $idempresa;
        $parametros["idconcepto"] = $idconcepto;
        $parametros["iddocumento"] = $iddocumento;
        $parametros["idtipodocumento"] = $idtipodocumento;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Permite crear una nueva contabilización
     * @param Contabilizacion $contabilizacion
     * @return Array Cantidad de filas afectadas
     */
    public function updateContabilizacionContableModel($contabilizacion) {
        $parametros = array();
        $this->setCampo($contabilizacion, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($contabilizacion, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($contabilizacion, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($contabilizacion, $parametros, 'codigo', 'cue_codigo');
        $this->setCampo($contabilizacion, $parametros, 'tarcodi', 'cue_tarcodi');
        $this->setCampo($contabilizacion, $parametros, 'idcuenta', 'cue_ideregistro');
        $this->setCampo($contabilizacion, $parametros, 'porcentaje', 'codo_porcentaje');
        $this->setCampo($contabilizacion, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($contabilizacion, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($contabilizacion, $parametros, 'naturaleza', 'codo_naturaleza');
        $idcontabilizacion = $contabilizacion['idcontabilizacion'];
        return $this->actualizar($parametros, 'codo_condocumen', "codo_ideregistr = $idcontabilizacion");
    }

    /**
     * Permite crear una contabilizacion
     * @param Contabilizacion $contabilizacion
     * @return int Cantidad de filas afectadas
     */
    public function crearContabilizacionContableModel($contabilizacion) {
        $parametros = array();
        $this->setCampo($contabilizacion, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($contabilizacion, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($contabilizacion, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($contabilizacion, $parametros, 'codigo', 'cue_codigo');
        $this->setCampo($contabilizacion, $parametros, 'tarcodi', 'cue_tarcodi');
        $this->setCampo($contabilizacion, $parametros, 'idcuenta', 'cue_ideregistro');
        $this->setCampo($contabilizacion, $parametros, 'porcentaje', 'codo_porcentaje');
        $this->setCampo($contabilizacion, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($contabilizacion, $parametros, 'usuario', 'usu_ideregistro');
        $this->setCampo($contabilizacion, $parametros, 'naturaleza', 'codo_naturaleza');
        return $this->insertar($parametros, 'codo_condocumen', NULL);
    }

    /**
     * @deprecated since version 1.0.0
     * permite obtener el IdentificadorCuenta
     * @param string $codigocuenta
     * @return Array IdentificadorCuenta
     */
    public function obtenerIdentificadorCuenta($codigocuenta) {
        $sql = "select cue_ideregistro idcuenta from cue_cuenta cue
                where cue.cue_codigo = :codigocuenta";
        $parametros["codigocuenta"] = $codigocuenta;
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException("No existe una cuenta asociada con código $codigocuenta", -1);
        }
        return $respuesta[0];
    }

    /**
     *
     * @param int $idContabilizacion identificador de concepto
     * @return int Cantidad de filas afectadas
     * @throws MyException debe existir un concepto a eliminar
     */
    public function eliminarContabilizacionContableModel($idContabilizacion) {
        if (empty($idContabilizacion)) {
            throw new MyException("Debe existir un concepto a eliminar ", -1);
        }
        $resultado = $this->eliminar('codo_condocumen', "codo_ideregistr = $idContabilizacion");
        return $resultado;
    }

// </editor-fold>
    // <editor-fold desc="Area de negocio">
    /**
     *
     * @param type $areaNegocio
     * @return type
     */
    public function crearAreaNegocioModel($areaNegocio) {
        $parametros = array();
        $this->setCampo($areaNegocio, $parametros, 'idtiposusucripcion', 'uni_tipsuscripc');
        $this->setCampo($areaNegocio, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($areaNegocio, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($areaNegocio, $parametros, 'idcuenta', 'cue_ideregistro');
        $this->setCampo($areaNegocio, $parametros, 'tarcodi', 'cue_tarcodi');
        $this->setCampo($areaNegocio, $parametros, 'porcentaje', 'cots_porcentaje');
        $this->setCampo($areaNegocio, $parametros, 'codigo', 'cue_codigo');
        $this->setCampo($areaNegocio, $parametros, 'idusuario', 'usu_ideregistro');
        return $this->insertar($parametros, 'cots_contipsusc', NULL);
    }

    /**
     * Permite actualizar el area de negocio
     * @param AreaNegocio $areaNegocio
     * @return int cantidad de filas afectadas
     */
    public function updateAreaNegocioModel($areaNegocio) {
        $parametros = array();
        $this->setCampo($areaNegocio, $parametros, 'idtiposusucripcion', 'uni_tipsuscripc');
        $this->setCampo($areaNegocio, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($areaNegocio, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($areaNegocio, $parametros, 'idcuenta', 'cue_ideregistro');
        $this->setCampo($areaNegocio, $parametros, 'tarcodi', 'cue_tarcodi');
        $this->setCampo($areaNegocio, $parametros, 'porcentaje', 'cots_porcentaje');
        $this->setCampo($areaNegocio, $parametros, 'idusuario', 'usu_ideregistro');
        $idAreaNegocio = $areaNegocio["idareanegocio"];
        return $this->actualizar($parametros, 'cots_contipsusc', "cots_ideregistr= $idAreaNegocio");
    }

    /**
     * permite eliminar un area de negocio
     * @param int $idAreaNegocio identificador de suscripción
     * @return int cantidad de filas afectadas
     * @throws MyException debe existir un tipo de suscripción para elimimar
     */
    public function eliminarAreaNegocioModel($idAreaNegocio) {
        if (empty($idAreaNegocio)) {
            throw new MyException("Debe existir un tipo de suscripción para elimimar", -1);
        }
        $resultado = $this->eliminar('cots_contipsusc', "cots_ideregistr= $idAreaNegocio");
        return $resultado;
    }

    /**
     * permite obtener el lsistado de areas de negocio
     * @param int $idconcepto
     * @return array listado de areas de negocio
     */
    public function obtenerAreaNegocioModel($idconcepto, $idempresa) {
        $sql = "SELECT
                        cots.uni_tipsuscripc idtiposusucripcion,
                        tsu.tsu_nombre tiposuscripcion,
                        cots.cots_porcentaje porcentaje,
                        cue.cue_nombre nombrearea,
                        cue.cue_codigo codigoarea,
                        cots_ideregistr idareanegocio
                FROM
                        cots_contipsusc cots
                INNER JOIN tsu_tipsuscripc tsu ON cots.uni_tipsuscripc = tsu.uni_tipsuscripc
                INNER JOIN cue_cuenta cue ON cue.cue_ideregistro = cots.cue_ideregistro
                WHERE
                      uni_concepto = :idconcepto and cots.emp_ideregistro= :idempresa";
        $parametros["idempresa"] = $idempresa;
        $parametros["idconcepto"] = $idconcepto;
        return $this->executeQuery($sql, $parametros);
    }

    // </editor-fold>
    // <editor-fold desc="centro de costos">

    /**
     * Permite crear el centro de costo
     * @param CentroCosto $centrocosto
     * @return int Cantidad de filas afectadas
     */
    public function crearCentroCostoModel($centrocosto) {
        $parametros = array();
        $this->setCampo($centrocosto, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($centrocosto, $parametros, 'est_concepto', 'est_concepto');
        $this->setCampo($centrocosto, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($centrocosto, $parametros, 'tarcodi', 'cue_tarcodi');
        $this->setCampo($centrocosto, $parametros, 'codigo', 'cue_codigo');
        $this->setCampo($centrocosto, $parametros, 'idcuenta', 'cue_ideregistro');
        $this->setCampo($centrocosto, $parametros, 'porcentaje', 'cocc_porcentaje');
        $this->setCampo($centrocosto, $parametros, 'codigoempresa', 'proceso_ideregistro');
        $this->setCampo($centrocosto, $parametros, 'idusuario', 'usu_ideregistro');
        return $this->insertar($parametros, 'cocc_concencost', 'sq_cocc_ideregistr');
    }

    /**
     * Permite actualizar el centro de costo
     * @param CentroCosto $centrocosto
     * @return int cantidad de filas afectadas
     */
    public function actualizarCentroCostoModel($centrocosto) {
        $parametros = array();
        $this->setCampo($centrocosto, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($centrocosto, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($centrocosto, $parametros, 'tarcodi', 'cue_tarcodi');
        $this->setCampo($centrocosto, $parametros, 'idcuenta', 'cue_ideregistro');
        $this->setCampo($centrocosto, $parametros, 'porcentaje', 'cocc_porcentaje');
        $this->setCampo($centrocosto, $parametros, 'codigoempresa', 'proceso_ideregistro');
        $this->setCampo($centrocosto, $parametros, 'idusuario', 'usu_ideregistro');
        $idcentrocosto = $centrocosto['idcentrocosto'];
        return $this->actualizar($parametros, 'cocc_concencost', "cocc_ideregistr=$idcentrocosto");
    }

    /**
     * Permite eliminar un centro de costo
     * @param int $idcentrocosto centro de costo a eliminar
     * @return int cantidad de filas afectadas
     * @throws MyException no se puede eliminar un centro de costo sin un identificador
     */
    public function eliminarCentroCostoModel($idcentrocosto) {
        if (empty($idcentrocosto)) {
            throw new MyException("Error, identificador de centro de costo obligatorio para eliminar", -1);
        }
        $resultado = $this->eliminar('cocc_concencost', "cocc_ideregistr=$idcentrocosto");
        return $resultado;
    }

    /**
     *
     * @param int $idconcepto concepto a consultar
     * @return array listado de centros de costo
     */
    public function obtenerCentroCostoModel($idconcepto, $idempresa) {
        $sql = "SELECT
                        cocc_ideregistr idcentrocosto,
                        pro.proceso_ideregistro codigoempresa,
                        pro.proceso_nom proceso,
                        cocc.cocc_porcentaje porcentaje,
                        cue.cue_nombre cuenta,
                        cue.cue_codigo codigo
                FROM
                        cocc_concencost cocc
                INNER JOIN procesos pro ON pro.proceso_ideregistro = cocc.proceso_ideregistro
                INNER JOIN cue_cuenta cue ON cue.cue_ideregistro = cocc.cue_ideregistro
                WHERE
                      uni_concepto = :idconcepto and cocc.emp_ideregistro= :idempresa";
        $parametros["idempresa"] = $idempresa;
        $parametros["idconcepto"] = $idconcepto;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Permite obtener el listado de cuentas de empresas
     * @param int $empresa empresa de sesión
     * @param int $tarcodi tipo de codificación
     * @param string $cuenta obtiene la información de código o nombre de cuenta
     * @return Array Cuentas
     */
    public function ObtenerCuentasModel($empresa, $tarcodi = 5, $cuenta = null) {
        $complemento = '';
        if (!empty($cuenta)) {
            $complemento = "AND ( lower(cue.cue_nombre) LIKE lower('%$cuenta%') OR  cue.cue_codigo like '%$cuenta%') ";
        }
        $sql = "SELECT
                        cue.cue_ideregistro idcuenta,
                        cue.cue_codigo codigocuenta,
                        cue.cue_nombre nombrecuenta
                FROM
                        cue_cuenta cue
                WHERE
                        cue.cue_tarcodi = :tarcodi
                AND cue.cue_estado = 'A'
                AND cue.emp_ideregistro = :empresa " . $complemento;
        $parametros["empresa"] = $empresa;
        $parametros["tarcodi"] = $tarcodi;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * permite obtener el listado de empresas
     * @param type $idempresa identificador de la empresa
     */
    public function obtenerDepartamentoEmpresa($idempresa) {
        $sql = "SELECT
                    proceso_nom departamento,
                    proceso_ideregistro iddepartamento
            FROM
                    procesos pro
            INNER JOIN empresas emp ON emp.empresa_cod = pro.proceso_codemp
            WHERE
                    emp.empresa_sevemp =:idempresa";
        $parametros['idempresa'] = $idempresa;

        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Lista los tipos de suscripciones de acuerdo al tipo de empresa
     * @param int $idempresa código de empresa
     * @return Array Tipo de suscripción
     */
    public function obtenerTipoSuscripcionModel($idempresa) {
        $sql = "SELECT
                        tsu.tsu_nombre nombre,
                        tsu.tsu_ideregistro idtiposuscripcion
                FROM
                        tsu_tipsuscripc tsu
                INNER JOIN esem_estempresa esem ON tsu.est_tipsuscripc = esem.est_ideregistro
                WHERE
                        esem.emp_ideregistro = :idempresa";
        $parametros["idempresa"] = $idempresa;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Lista los departamentos de centro de costo
     * @param int $idempresa código de empresa
     * @return Array Tipo de Centro de costo
     */
    public function obtenerDepartamentoCentroCostoModel($idempresa) {
        $sql = "SELECT
                    dep.depempresa_ideregistro iddepempresas,
                    dep.depempresa_nom nombreempresas
                    FROM
                            depempresas dep
                    INNER JOIN empresas emp ON dep.depempresa_codemp = emp.empresa_cod
                    WHERE
                            emp.empresa_sevemp = :idempresa";
        $parametros["idempresa"] = $idempresa;
        return $this->executeQuery($sql, $parametros);
    }

    // </editor-fold>
    // </editor-fold>
    // <editor-fold desc="Recaudo">
    // <editor-fold desc="Contabilizacion cruce">
    /**
     * Permite agregar una nueva contabilizacion
     * @param type $recaudoConceptoContable
     * @return int cantidad de filas afectadas
     */
    public function CrearRecaudoConceptoContableModel($recaudoConceptoContable) {
        $parametros = array();
        $this->setCampo($recaudoConceptoContable, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($recaudoConceptoContable, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($recaudoConceptoContable, $parametros, 'mediopagoid', 'uni_medpago');
        $this->setCampo($recaudoConceptoContable, $parametros, 'idconcepto', 'cft_ideregistro');
        $this->setCampo($recaudoConceptoContable, $parametros, 'porcentaje', 'coct_porcentaje');
        $this->setCampo($recaudoConceptoContable, $parametros, 'idempresa', 'emp_ideregistro');
        $respuesta = $this->insertar($parametros, 'coct_concpttesore', 'sq_coct_ideregistr');

        return $respuesta;
    }

    /**
     * Permite agregar una nueva contabilizacion
     * @param type $contabilizacionCruce
     * @return int cantidad de filas afectadas
     */
    public function CrearConceptoFlujoModel($contabilizacionCruce) {
        $parametros = array();
        $this->setCampo($contabilizacionCruce, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($contabilizacionCruce, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($contabilizacionCruce, $parametros, 'mediopagoid', 'uni_medpago');
        $this->setCampo($contabilizacionCruce, $parametros, 'idconcepto', 'cft_ideregistro');
        $this->setCampo($contabilizacionCruce, $parametros, 'porcentaje', 'coft_porcentaje');
        $this->setCampo($contabilizacionCruce, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($contabilizacionCruce, $parametros, 'idusuario', 'usu_ideregistro');
        return $this->insertar($parametros, 'coft_confljtesore', 'sq_coft_ideregistr');
    }

    /**
     * Permite actualizar una contabilización
     * @param ContabilizacionCruce $contabilizacionCruce
     * @return int cantidad de filas afectadas
     */
    public function updateRecaudoConceptoContableModel($contabilizacionCruce) {
        $parametros = array();
        $this->setCampo($contabilizacionCruce, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($contabilizacionCruce, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($contabilizacionCruce, $parametros, 'mediopagoid', 'uni_medpago');
        $this->setCampo($contabilizacionCruce, $parametros, 'idconcepto', 'cft_ideregistro');
        $this->setCampo($contabilizacionCruce, $parametros, 'porcentaje', 'coct_porcentaje');
        $this->setCampo($contabilizacionCruce, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($contabilizacionCruce, $parametros, 'idusuario', 'usu_ideregistro');
        $idconceptoflujo = $contabilizacionCruce['idconceptocontable'];
        return $this->actualizar($parametros, 'coct_concpttesore', "coct_ideregistr=$idconceptoflujo");
    }

    /**
     * Permite actualizar una contabilización
     * @param ContabilizacionCruce $contabilizacionCruce
     * @return int cantidad de filas afectadas
     */
    public function updateConceptoFlujoContableModel($contabilizacionCruce) {
        $parametros = array();
        $this->setCampo($contabilizacionCruce, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($contabilizacionCruce, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($contabilizacionCruce, $parametros, 'mediopagoid', 'uni_medpago');
        $this->setCampo($contabilizacionCruce, $parametros, 'idconcepto', 'cft_ideregistro');
        $this->setCampo($contabilizacionCruce, $parametros, 'porcentaje', 'coft_porcentaje');
        $this->setCampo($contabilizacionCruce, $parametros, 'idempresa', 'emp_ideregistro');
        $idconceptoflujo = $contabilizacionCruce['idconceptoflujo'];
        return $this->actualizar($parametros, 'coft_confljtesore', "coft_ideregistr=$idconceptoflujo");
    }

    /**
     * permite eliminar una contabilización por identificador
     * @param int $idConceptoContable recibe la contabilizacion a eliminar
     * @return int cantidad de filas afectadas
     * @throws MyException no se permite eliminar una contabilización sin el identificador
     */
    public function eliminarRecaudoConceptoContableModel($idConceptoContable) {
        if (empty($idConceptoContable)) {
            throw new MyException("Error, identificador de contabilización obligatorio para eliminar.", -1);
        }
        $resultado = $this->eliminar('coct_concpttesore', "coct_ideregistr=$idConceptoContable");
        return $resultado;
    }

    /**
     * permite eliminar una contabilización por identificador
     * @param int $idcontabilizacioncruce recibe la contabilizacion a eliminar
     * @return int cantidad de filas afectadas
     * @throws MyException no se permite eliminar una contabilización sin el identificador
     */
    public function eliminarConceptoFlujoContableModel($idcontabilizacioncruce) {
        if (empty($idcontabilizacioncruce)) {
            throw new MyException("Error, identificador de contabilización obligatorio para eliminar.", -1);
        }
        $resultado = $this->eliminar('coft_confljtesore', "coft_ideregistr=$idcontabilizacioncruce");
        return $resultado;
    }

    /**
     * Permite listar la contabilización de cruce
     * @param int $idconcepto identificador de concepto
     * @return Array listado de contabilizacion cruce
     */
    public function obtenerContabilizacionCruceModel($idconcepto, $idempresa) {
        $sql = "SELECT
                        corc_ideregistr idcontabilizacioncruce,
                        corc.corc_porcentaje porcentaje,
                        cue.cue_nombre nombrearea,
                        cue.cue_codigo codigoarea,
                        corc.corc_naturaleza naturaleza,
                        uni_ideregistro mediopagoid,
                        uni.uni_nombre1 mediopago,
                        corc.uni_documento iddocumento,
                        uni.uni_nombre1 documento,
                        corc.uni_tipdocument idtipodocumento,
                        tido.tido_nombre tipodocumento
                FROM
                        corc_conreccruce corc
                INNER JOIN doc_documento doc ON doc.uni_documento = corc.uni_documento
                INNER JOIN tido_tipdocumen tido ON tido.uni_tipdocument = corc.uni_tipdocument
                INNER JOIN cue_cuenta cue ON cue.cue_ideregistro = corc.cue_codigo :: INTEGER
                INNER JOIN est_estructura est ON est.est_ideregistro = corc.uni_medpago
                INNER JOIN uni_unidad uni ON uni.est_ideregistro = est.est_ideregistro
                WHERE
                      corc.emp_ideregistro= :idempresa";
        $parametros["idempresa"] = $idempresa;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta los medios de pago que tiene una empresa
     * @param int $idEmpresa código de la empresa
     * @param int $idUsuario idenficador del usuario
     * @return array Todos los medios de pagos asignados
     */
    public function obtenerMedioPagoModel($idEmpresa, $idUsuario) {
        $parametros['idusuario'] = $idUsuario;
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT
                        usmp.uni_medpago ID,
                        uni.uni_nombre1 nombre,
                        mpa.mpa_tipo tipo

                FROM
                        usmp_usumedpago usmp
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = usmp.uni_medpago
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro
                INNER JOIN mpa_medpago mpa on mpa.uni_medpago = usmp.uni_medpago
                WHERE
                  usmp.usu_ideregistro=:idusuario  and esem.emp_ideregistro=:idempresa";
        return $this->executeQuery($sql, $parametros);
    }

    // </editor-fold>
    // <editor-fold desc="Contabilizacion Anticipo">

    /**
     * Permite obtener el listado de empresas para la pestaña de recaudos, con el objetivo de listar todos excepto la de los parámetros
     * @param int $idempresa identificador de empresa a omitir
     * @return Array lista las empresas omitiendo la que se incluye en el parámetro
     */
    public function obtenerEmpresasRecaudoModel($idempresa) {
        $sql = "SELECT  DISTINCT
                        emp.empresa_nom nombre,
                        emp.empresa_sevemp idempresa
                FROM
                        dicn_disconven dicn
                INNER JOIN empresas emp ON emp.empresa_sevemp = dicn.emp_ideregistro
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = dicn.uni_tipsuscripc
                INNER JOIN cnre_cnvrecaudo cnre ON cnre.cnre_ideregistr = dicn.cnre_ideregistr
                AND cnre.cnre_estado = 'A'
                where emp.empresa_sevemp != :idempresa";
        $parametros["idempresa"] = $idempresa;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Permite obtener la contabilizacion anticipo
     * @param type $idconcepto
     * @return type
     */
    public function obtenerContabilizacionAnticipoModel($idconcepto, $idempresa) {
        $sql = "SELECT
                        cora_ideregistr idcontabilizacionanticipo,
                        cora.cora_porcentaje porcentaje,
                        cue.cue_nombre nombrearea,
                        cue.cue_codigo codigoarea,
                        cora.cora_naturaleza naturaleza,
                        uni_ideregistro mediopagoid,
                        uni.uni_nombre1 mediopago,
                        cora.uni_documento iddocumento,
                        cora.uni_tipdocument idtipodocumento,
                        doc.doc_nombre nombredocumento,
                        est.est_nombre nombretipodocumento
                FROM
                        cora_conrecantici cora
                INNER JOIN doc_documento doc ON doc.uni_documento = cora.uni_documento
                INNER JOIN doti_doctipo doti ON doti.uni_documento = cora.uni_documento
                INNER JOIN est_estructura est ON est.est_ideregistro = doti.est_tipdocument
                INNER JOIN cue_cuenta cue ON cue.cue_ideregistro = cora.cue_ideregistro :: INTEGER
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = cora.uni_medpago
                WHERE
                      uni_concepto = :idconcepto and cora.emp_ideregistro= :idempresa";
        $parametros["idempresa"] = $idempresa;
        $parametros["idconcepto"] = $idconcepto;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Permite crear una contabilizacion anticipo
     * @param contabilizacionAnticipo $contabilizacionAnticipo
     * @return int cantidad de filas afectadas
     */
    public function crearContabilizacionAnticipoModel($contabilizacionAnticipo) {
        $parametros = array();
        $this->setCampo($contabilizacionAnticipo, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'mediopagoid', 'uni_medpago');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'codigo', 'cue_codigo');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'tarcodi', 'cue_tarcodi');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'idcuenta', 'cue_ideregistro');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'porcentaje', 'cora_porcentaje');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'naturaleza', 'cora_naturaleza');
        return $this->insertar($parametros, 'cora_conrecantici', NULL);
    }

    /**
     * Permite actualizar contabilizacion Anticipo
     * @param contabilizacionAnticipo $contabilizacionAnticipo
     * @return int Cantidad de filas afectadas
     */
    public function updateContabilizacionAnticipoModel($contabilizacionAnticipo) {
        $parametros = array();
        $this->setCampo($contabilizacionAnticipo, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'mediopagoid', 'uni_medpago');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'codigo', 'cue_codigo');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'tarcodi', 'cue_tarcodi');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'idcuenta', 'cue_ideregistro');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'porcentaje', 'cora_porcentaje');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($contabilizacionAnticipo, $parametros, 'naturaleza', 'cora_naturaleza');
        $idcontabilizacionanticipo = $contabilizacionAnticipo['idcontabilizacionanticipo'];
        return $this->actualizar($parametros, 'cora_conrecantici', "cora_ideregistr=$idcontabilizacionanticipo");
    }

    /**
     * permite eliminar la contabilizacion anticipo
     * @param int $idcontabilizacionanticipo parametro de eliminación
     * @return int cantidad de filas afectadas
     * @throws MyException no se puede eliminar una contabilización anticipo si su identificador
     */
    public function eliminarContabilizacionAnticipoModel($idcontabilizacionanticipo) {
        if (empty($idcontabilizacionanticipo)) {
            throw new MyException("Error, identificador de contabilización anticipo obligatorio para eliminar.", -1);
        }
        $resultado = $this->eliminar('cora_conrecantici', "cora_ideregistr=$idcontabilizacionanticipo");
        return $resultado;
    }

// </editor-fold>
    // <editor-fold desc="Empresas convenio">
    /**
     * Listado de empresas convenio
     * @param int $idempresa identificador de la empresa de sesion actual
     * @return array listado de empresas convenio
     */
    public function obtenerEmpresasConvenioModel($idempresa) {
        $sql = "SELECT DISTINCT
                        empr.empresa_nom,
                        empr.empresa_sevemp idempresa
                FROM
                        dicn_disconven dicn
                INNER JOIN dicn_disconven dicnConvenios ON dicn.cnre_ideregistr = dicnConvenios.cnre_ideregistr
                AND dicn.emp_ideregistro <> dicnConvenios.emp_ideregistro
                INNER JOIN tsu_tipsuscripc tsu ON dicnConvenios.uni_tipsuscripc = tsu.uni_tipsuscripc
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = tsu.uni_tipsuscripc
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro
                INNER JOIN empresas empr ON empr.empresa_sevemp = esem.emp_ideregistro
                WHERE
                        empr.empresa_sevemp !=:idempresa";
        $parametros["idempresa"] = $idempresa;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Permite crear EmpresasConvenios
     * @param EmpresaConvenio EmpresaConvenio
     * @return int cantidad de filas afectadas
     */
    public function crearEmpresasConveniosModel($empresaConvenio) {
        $parametros = array();
        $this->setCampo($empresaConvenio, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($empresaConvenio, $parametros, 'idempresaconvenio', 'emp_ideconvenio');
        $this->setCampo($empresaConvenio, $parametros, 'mediopagoid', 'uni_medpago');
        $this->setCampo($empresaConvenio, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($empresaConvenio, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($empresaConvenio, $parametros, 'codigo', 'cue_codigo');
        $this->setCampo($empresaConvenio, $parametros, 'tarcodi', 'cue_tarcodi');
        $this->setCampo($empresaConvenio, $parametros, 'idcuenta', 'cue_ideregistro');
        $this->setCampo($empresaConvenio, $parametros, 'porcentaje', 'cocn_porcentaje');
        $this->setCampo($empresaConvenio, $parametros, 'naturaleza', 'cocn_naturaleza');
        $this->setCampo($empresaConvenio, $parametros, 'idusuario', 'usu_ideregistro');
        return $this->insertar($parametros, 'cocn_conconvenio', NULL);
    }

    /**
     * Permite actualizar EmpresasConveniosModel
     * @param EmpresasConvenios $empresaConvenio
     * @return int Cantidad de filas afectadas
     */
    public function actualizarEmpresasConveniosModel($empresaConvenio) {
        $parametros = array();
        $this->setCampo($empresaConvenio, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($empresaConvenio, $parametros, 'idempresaconvenio', 'emp_ideconvenio');
        $this->setCampo($empresaConvenio, $parametros, 'mediopagoid', 'uni_medpago');
        $this->setCampo($empresaConvenio, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($empresaConvenio, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($empresaConvenio, $parametros, 'codigo', 'cue_codigo');
        $this->setCampo($empresaConvenio, $parametros, 'tarcodi', 'cue_tarcodi');
        $this->setCampo($empresaConvenio, $parametros, 'idcuenta', 'cue_ideregistro');
        $this->setCampo($empresaConvenio, $parametros, 'porcentaje', 'cocn_porcentaje');
        $this->setCampo($empresaConvenio, $parametros, 'naturaleza', 'cocn_naturaleza');
        $this->setCampo($empresaConvenio, $parametros, 'idusuario', 'usu_ideregistro');
        $idempresasconvenios = $empresaConvenio['idconvenio'];
        return $this->actualizar($parametros, 'cocn_conconvenio', "cocn_ideregistr=$idempresasconvenios");
    }

    /**
     * permite eliminar la  Empresa Convenio
     * @param int $idEmpresaConvenio parametro de eliminación
     * @return int cantidad de filas afectadas
     * @throws MyException no se puede eliminar una $idEmpresaConvenio si su identificador
     */
    public function eliminarEmpresaConvenio($idEmpresaConvenio) {
        if (!empty($idEmpresaConvenio)) {
            throw new MyException("Error, identificador de empresa obligatorio para eliminar.", -1);
        }
        $resultado = $this->eliminar('cocn_conconvenio', "cocn_ideregistr = $idEmpresaConvenio");
        return $resultado;
    }

// </editor-fold>
// </editor-fold>
    // <editor-fold desc="Consignacion">
    /**
     * listado de cuentas obtenidas por medio de pago
     * @param int $mediopago medio de pago a filtrar por cuentas
     * @return Array listado de cuentas
     */
    public function obtenerCuentasBancoModel($mediopago, $empresaid, $idbanco) {
        $sql = "SELECT  bcu.bcu_numcuenta cuentabancaria,
                        mpbc.mpbc_ideregistr idcuentabacaria
                FROM
                        mpbc_medpagcuebanco mpbc
                INNER JOIN bcu_bcocuenta bcu ON bcu.bcu_ideregistro = mpbc.bcu_ideregistro
                INNER JOIN ter_tercero ter ON ter.ter_ideregistro = bcu.ter_ideregistro
                WHERE
                        bcu.ter_ideregistro = :idbanco
                AND bcu.emp_ideregistro = :empresaid
                AND mpbc.uni_medpago = :mediopago";
        $parametros["mediopago"] = $mediopago;
        $parametros["empresaid"] = $empresaid;
        $parametros["idbanco"] = $idbanco;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * permite obtener el ListarBancosConsignacionModel
     * @param int $medioPago
     * @param int $empresaid
     * @return Array ListarBancosConsignacionModel
     */
    public function obtenerListarBancosConsignacionModel($medioPago, $empresaid) {
        $sql = "SELECT DISTINCT
                        ter.ter_nomcompleto banco,
                        ter.ter_ideregistro idbanco
                FROM
                        mpbc_medpagcuebanco mpbc
                INNER JOIN bcu_bcocuenta bcu ON bcu.bcu_ideregistro = mpbc.bcu_ideregistro
                INNER JOIN ter_tercero ter ON bcu.ter_ideregistro = ter.ter_ideregistro
                WHERE
                        mpbc.uni_medpago = :medioPago
                AND bcu.emp_ideregistro = :empresaid";
        $parametros["medioPago"] = $medioPago;
        $parametros["empresaid"] = $empresaid;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * permite obtemer los modelos de consignaciones
     * @return Array listar consignaciones
     */
    public function obtenerConsignacionesModel($idempresa) {
        $sql = "SELECT
                        cocs.cocs_porcentaje porcentaje,
                        cue.cue_nombre nombrearea,
                        cue.cue_codigo codigoarea,
                        cocs.cocs_naturaleza naturaleza,
                        uni_ideregistro mediopagoid,
                        uni.uni_nombre1 mediopago,
                        cocs.uni_documento iddocumento,
                        doc.doc_nombre documento,
                        doti.uni_documento tipodocumento,
                        cocs.uni_tipdocument idtipodocumento,
                        cocs.cocs_ideregistr idcontabilizacionconsignacion
                FROM
                        cocs_conconsigna cocs
                INNER JOIN doc_documento doc ON doc.uni_documento = cocs.uni_documento
                INNER JOIN doti_doctipo doti ON doti.uni_tipdocument = cocs.uni_tipdocument
                INNER JOIN cue_cuenta cue ON cue.cue_codigo = cocs.cue_codigo
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = cocs.uni_medpago
                WHERE
                        cocs.emp_ideregistro =:idempresa";
        $parametros["idempresa"] = $idempresa;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Permite crear insertarConsignacion
     * @param Consignacion Consignacion
     * @return int cantidad de filas afectadas
     */
    public function crearConsignacionModel($consignacion) {
        $parametros = array();
        $this->setCampo($consignacion, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($consignacion, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($consignacion, $parametros, 'mediopagoid', 'uni_medpago');
        $this->setCampo($consignacion, $parametros, 'idconcepto', 'cft_ideregistro');
        $this->setCampo($consignacion, $parametros, 'porcentaje', 'coft_porcentaje');
        $this->setCampo($consignacion, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($consignacion, $parametros, 'tipo', 'dics_tipo');
        return $this->insertar($parametros, 'coft_confljtesore', 'sq_coft_ideregistr');
    }

    /**
     * Permite crear insertarConsignacion
     * @param Consignacion Consignacion
     * @return int cantidad de filas afectadas
     */
    public function crearPresupuestoConceptoModel($consignacion) {
        $parametros = array();
        $this->setCampo($consignacion, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($consignacion, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($consignacion, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($consignacion, $parametros, 'idcuenta', 'cue_ideregistro');
        $this->setCampo($consignacion, $parametros, 'codigo', 'uni_medpago');
        $this->setCampo($consignacion, $parametros, 'tarcodi', 'cft_ideregistro');
        $this->setCampo($consignacion, $parametros, 'porcentaje', 'codc_porcentaje');
        return $this->insertar($parametros, 'coct_concpttesore', NULL);
    }

    /**
     * Permite actualizar consignacion
     * @param $consignacion $consignacion
     * @return int Cantidad de filas afectadas
     */
    public function actualizarconsignacionModel($consignacion) {
        $parametros = array();
        $this->setCampo($consignacion, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($consignacion, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($consignacion, $parametros, 'mediopagoid', 'uni_medpago');
        $this->setCampo($consignacion, $parametros, 'idconcepto', 'cft_ideregistro');
        $this->setCampo($consignacion, $parametros, 'porcentaje', 'coft_porcentaje');
        $this->setCampo($consignacion, $parametros, 'idempresa', 'emp_ideregistro');
        $idconceptoflujo = $consignacion['idconceptoflujo'];
        return $this->actualizar($parametros, 'coft_confljtesore', "coft_ideregistr=$idconceptoflujo");
    }

    /**
     * permite eliminar la $eliminar
     * @param int $idconsignacion parametro de eliminación
     * @return int cantidad de filas afectadas
     * @throws MyException no se puede eliminar una $idconsignacion si su identificador
     */
    public function eliminarConsignacionModel($idconsignacion) {
        if (empty($idconsignacion)) {
            throw new MyException("Error, identificador de consignación obligatorio para eliminar.", -1);
        }
        $resultado = $this->eliminar('cocs_conconsigna', "cocs_ideregistr = $idconsignacion");
        return $resultado;
    }

    /**
     * Permite obtener el listado de las consignaciones diferenciales
     * @return Array Listado de diferencias consignacion
     */
    public function obtenerDiferenciaConsignacionModel($idempresa) {
        $sql = "SELECT
                        codc.codc_porcentaje porcentaje,
                        cue.cue_nombre nombrearea,
                        cue.cue_codigo codigoarea,
                        codc.codc_naturaleza naturaleza,
                        doti.uni_documento tipodocumento,
                        codc.uni_tipdocument idtipodocumento,
                        codc.codc_tipo tipo,
                        uni.uni_ideregistro mediopagoid,
                        uni.uni_nombre1 mediopago,
                        codc.codc_ideregistr consignaciondiferenciaid
                FROM
                        codc_condifconsigna codc
                INNER JOIN doti_doctipo doti ON doti.uni_tipdocument = codc.uni_tipdocument
                INNER JOIN cue_cuenta cue ON cue.cue_ideregistro = codc.cue_ideregistro
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = codc.uni_medpago
                WHERE codc.emp_ideregistro= :idempresa";
        $parametros["idempresa"] = $idempresa;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Permite crear DiferenciaConsignacion
     * @param $consignacionConceptoContable $consignacionConceptoContable
     * @return int cantidad de filas afectadas
     */
    public function crearConsignacionConceptoContableModel($consignacionConceptoContable) {
        $parametros = array();
        $this->setCampo($consignacionConceptoContable, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($consignacionConceptoContable, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($consignacionConceptoContable, $parametros, 'mediopagoid', 'uni_medpago');
        $this->setCampo($consignacionConceptoContable, $parametros, 'idconcepto', 'cft_ideregistro');
        $this->setCampo($consignacionConceptoContable, $parametros, 'porcentaje', 'coct_porcentaje');
        $this->setCampo($consignacionConceptoContable, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($consignacionConceptoContable, $parametros, 'tipo', 'dics_tipo');
        return $this->insertar($parametros, 'coct_concpttesore', 'sq_coct_ideregistr');
    }

    /**
     * Permite actualizar la diferencia de Consignacion
     * @param $ConsignacionConceptoContable $DiferenciaConsignacion
     * @return int Cantidad de filas afectadas
     */
    public function actualizarConsignacionConceptoContableModel($ConsignacionConceptoContable) {
        $parametros = array();
        $this->setCampo($ConsignacionConceptoContable, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($ConsignacionConceptoContable, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($ConsignacionConceptoContable, $parametros, 'mediopagoid', 'uni_medpago');
        $this->setCampo($ConsignacionConceptoContable, $parametros, 'idconcepto', 'cft_ideregistro');
        $this->setCampo($ConsignacionConceptoContable, $parametros, 'porcentaje', 'coct_porcentaje');
        $this->setCampo($ConsignacionConceptoContable, $parametros, 'idempresa', 'emp_ideregistro');
        $idconceptoflujo = $ConsignacionConceptoContable['idconceptocontable'];
        return $this->actualizar($parametros, 'coct_concpttesore', "coct_ideregistr=$idconceptoflujo");
    }

    /**
     * permite eliminar la LA diferencia consignación
     * @param int $iddiferenciaconsignacion parametro de eliminación
     * @return int cantidad de filas afectadas
     * @throws MyException no se puede eliminar una diferencia Consignacion si su identificador
     */
    public function eliminarDiferenciaConsignacion($iddiferenciaconsignacion) {
        if (empty($iddiferenciaconsignacion)) {
            throw new MyException("Error, identificador de diferencia de consignación obligatorio para eliminar.", -1);
        }
        $resultado = $this->eliminar('coct_concpttesore', "coct_ideregistr = $iddiferenciaconsignacion");
        return $resultado;
    }

// </editor-fold>
    // <editor-fold desc="Presupuestos">

    /**
     * Permite crear ConceptoContable
     * @param $conceptoContable  Recibe el concepto contable a actualizar
     * @return int cantidad de filas afectadas
     */
    public function crearConceptoContableModel($conceptoContable) {
        $parametros = array();
        $this->setCampo($conceptoContable, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($conceptoContable, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($conceptoContable, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($conceptoContable, $parametros, 'mediopagoid', 'uni_medpago');
        $this->setCampo($conceptoContable, $parametros, 'idconceptocont', 'cft_ideregistro');
        $this->setCampo($conceptoContable, $parametros, 'porcentaje', 'coct_porcentaje');
        return $this->insertar($parametros, 'coct_concpttesore', NULL);
    }

    /**
     * Permite actualizar ConceptoContable
     * @param $conceptoContable  Recibe el concepto contable a actualizar
     * @return int Cantidad de filas afectadas
     */
    public function actualizarConceptoContableModel($conceptoContable) {
        $parametros = array();
        $this->setCampo($conceptoContable, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($conceptoContable, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($conceptoContable, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($conceptoContable, $parametros, 'mediopagoid', 'uni_medpago');
        $this->setCampo($conceptoContable, $parametros, 'idconceptocont', 'cft_ideregistro');
        $this->setCampo($conceptoContable, $parametros, 'porcentaje', 'coct_porcentaje');
        $idconceptoContable = $conceptoContable['idconceptoContable'];
        return $this->actualizar($parametros, 'coct_concpttesore', "coct_ideregistr=$idconceptoContable");
    }

    /**
     * permite eliminar  ConceptoContable
     * @param $idconceptoContable  Recibe el concepto contable a actualizar
     * @return int cantidad de filas afectadas
     * @throws MyException no se puede eliminar una id si su identificador
     */
    public function eliminarConceptoContableModel($idconceptoContable) {
        if (empty($idconceptoContable)) {
            throw new MyException("Error, identificador de concepto contable obligatorio para eliminar.", -1);
        }
        $resultado = $this->eliminar('coct_concpttesore', "coct_ideregistr=$idconceptoContable");
        return $resultado;
    }

    /**
     * permite obtener el ConceptoContable
     * @param int $idconcepto
     * @param int $idempresa
     * @return Array ConceptoContable
     */
    public function obtenerConceptosContablesModel($idempresa, $iddocumento, $idtipodocumento, $idmediopago, $complemento = null) {

        $sql = "SELECT DISTINCT
                        doc.doc_nombre documento,
                        coct.uni_documento iddocumento,
                        coct.uni_tipdocument idtipodocumento,
                        est.est_nombre tipodocumento,
                        cft.cft_descseven conceptocontable,
                        coct.cft_ideregistro idconcepto,
                        coct.coct_porcentaje porcentaje,
                        coct.coct_ideregistr idconceptocontable,
                        coct.uni_medpago mediopagoid,
                        uni.uni_nombre1 mediopago,
                        dics_tipo tipo
                FROM
                        coct_concpttesore coct
                INNER JOIN doc_documento doc ON doc.uni_documento = coct.uni_documento
                INNER JOIN doti_doctipo doti ON doti.uni_tipdocument = coct.uni_tipdocument
                INNER JOIN est_estructura est ON est.est_ideregistro = doti.est_tipdocument
                INNER JOIN cft_cptflutesore cft ON cft.cft_ideregistro = coct.cft_ideregistro
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = coct.uni_medpago
                WHERE
                    coct.uni_documento = $iddocumento and coct.uni_tipdocument= $idtipodocumento 
                and coct.uni_medpago = $idmediopago and cft.emp_ideregistro = $idempresa and cft.cft_tipo = 'C' $complemento";

        return $this->executeQuery($sql);
    }

    /**
     * permite obtener el flujoConceptoContable para la creación de conceptos
     * @param type $idEmpresa
     * @return Array flujoConceptoContable
     */
    public function obtenerconceptoContable($idEmpresa) {
        $sql = "SELECT
                        cft.cft_ideregistro idflujoconcepto,
                        cft.cft_descseven nombre,
                        cft.cft_tipo tipo
                FROM
                        cft_cptflutesore cft
                WHERE
                        cft.emp_ideregistro = :idEmpresa  and cft.cft_tipo='C' ";
        $parametros["idEmpresa"] = $idEmpresa;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * permite obtener el flujoConceptoContable para la creacion de los conceptos
     * @param type $idEmpresa 
     * @return Array flujoConceptoContable
     */
    public function obtenerflujoConceptoContable($idEmpresa) {
        $sql = "SELECT
                        cft.cft_ideregistro idflujoconcepto,
                        cft.cft_descseven nombre,
                        cft.cft_tipo tipo
                FROM
                        cft_cptflutesore cft
                WHERE
                        cft.emp_ideregistro = :idEmpresa and cft.cft_tipo='F'";
        $parametros["idEmpresa"] = $idEmpresa;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Permite actualizar FlujoConceptoContable
     * @param $flujocontable  permite recibir el concepto flujo contable
     * @return int Cantidad de filas afectadas
     */
    public function actualizarFlujoConceptoContable($flujocontable) {
        $parametros = array();
        $this->setCampo($flujocontable, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($flujocontable, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($flujocontable, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($flujocontable, $parametros, 'mediopagoid', 'uni_medpago');
        $this->setCampo($flujocontable, $parametros, 'idconceptocont', 'cft_ideregistro');
        $this->setCampo($flujocontable, $parametros, 'porcentaje', 'coft_porcentaje');
        $idconceptoContable = $flujocontable['idconceptoContable'];
        return $this->actualizar($parametros, 'coft_confljtesore', "coft_ideregistr=$idconceptoContable ");
    }

    /**
     * permite eliminar  FlujoConceptoContable
     * @param $idconceptoContable  permite recibir el concepto flujo contable
     * @return int cantidad de filas afectadas
     * @throws MyException no se puede eliminar una id si su identificador
     */
    public function eliminarFlujoConceptoContable($idconceptoContable) {
        if (empty($idconceptoContable)) {
            throw new MyException("Error, identificador de concepto de flujo obligatorio para eliminar.", -1);
        }
        $resultado = $this->eliminar('coft_confljtesore', "coft_ideregistr=$idconceptoContable");
        return $resultado;
    }

    /**
     * permite obtener el Flujo ConceptoContable
     * @param int $idconcepto
     * @param int $idempresa
     * @return Array FlujoConceptoContable
     */
    public function obtenerParametrosFlujosConceptosContablesModel() {
        $sql = "SELECT
                        cft_ideregistro idflujoconcepto,
                        cft_descseven nombre,
                        cft_tipo tipo
                FROM
                        cft_cptflutesore";
        return $this->executeQuery($sql);
    }

    /**
     * permite obtener el Flujo ConceptoContable
     * @param int $idconcepto
     * @param int $idempresa
     * @return Array FlujoConceptoContable
     */
    public function obtenerFlujosConceptosContablesModel($idempresa, $iddocumento, $idtipodocumento, $idmediopago, $complemento = null) {
        $sql = "SELECT DISTINCT
                        doc.doc_nombre documento,
                        coft.uni_documento iddocumento,
                        coft.uni_tipdocument idtipodocumento,
                        est.est_nombre tipodocumento,
                        cft.cft_descseven conceptocontable,
                        coft.cft_ideregistro idconcepto,
                        coft.coft_porcentaje porcentaje,
                        coft.coft_ideregistr idconceptoflujo,
                        coft.uni_medpago mediopagoid,
                        uni.uni_nombre1 mediopago,
                        dics_tipo tipo
                FROM
                        coft_confljtesore coft
                INNER JOIN doc_documento doc ON doc.uni_documento = coft.uni_documento
                INNER JOIN doti_doctipo doti ON doti.uni_tipdocument = coft.uni_tipdocument
                INNER JOIN est_estructura est ON est.est_ideregistro = doti.est_tipdocument
                INNER JOIN cft_cptflutesore cft ON cft.cft_ideregistro = coft.cft_ideregistro
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = coft.uni_medpago
                WHERE
                    coft.uni_documento = :iddocumento and coft.uni_tipdocument = :idtipodocumento
                    and coft.uni_medpago = :idmediopago  and coft.emp_ideregistro = :idempresa
                 and cft.cft_tipo = 'F' $complemento";
        $parametros["idempresa"] = $idempresa;
        $parametros["iddocumento"] = $iddocumento;
        $parametros["idtipodocumento"] = $idtipodocumento;
        $parametros["idmediopago"] = $idmediopago;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta los medios de pago que tiene una empresa
     * @param int $idEmpresa código de la empresa
     * @param int $idUsuario idenficador del usuario
     * @return array Todos los medios de pagos asignados
     */
    public function consultarMediosPago($idEmpresa, $idUsuario) {
        $parametros['idusuario'] = $idUsuario;
        $parametros['idempresa'] = $idEmpresa;
        $sql = "select 
                  usmp.uni_medpago id, uni.uni_nombre1 nombre 
                from 
                  usmp_usumedpago usmp inner join uni_unidad uni on uni.uni_ideregistro=usmp.uni_medpago 
                  inner join esem_estempresa esem on esem.est_ideregistro=uni.est_ideregistro  
                where 
                  usmp.usu_ideregistro=:idusuario  and esem.emp_ideregistro=:idempresa";
        return $this->executeQuery($sql, $parametros);
    }

    // </editor-fold>
// </editor-fold>
}
