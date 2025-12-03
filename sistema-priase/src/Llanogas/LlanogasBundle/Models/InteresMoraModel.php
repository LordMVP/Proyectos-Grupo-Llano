<?php

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * @author mebonilla
 */
class InteresMoraModel extends AuditoriaServices {

    /**
     *
     * @var SessionInterface 
     */
    private $sesion;

    /**
     *
     * @var GenericoModel
     */
    private $genericoModel;

    /**
     * Constructor de la clase
     * @param Connection $conexion
     */
    public function __construct(&$conexion = null, &$sesion = null) {
        $this->setConexion($conexion);
        if ($sesion != null) {
            $this->sesion = $sesion;
        }
        $this->genericoModel = new GenericoModel($conexion);
    }

    /**
     * Consulta la información de municipios disponibles segun el id del usuario logueado en la 
     * aplicacion y el id de la empresa a la que pertenece, ademas de coincidir con el contenido
     * digitado en el campo de texto
     * @param string $municipio texto del municipio digitado
     * @return array lista de municipios que coinciden con el parametro de busqueda
     */
    public function consultarMunicipios($municipio) {
        $parametros["codempresa"] = $this->sesion->get("idempresa");
        $parametros["codusuario"] = $this->sesion->get("idusuario");
        $parametros["codprograma"] = PROGRAMA_FACTURAR_INTERESES_MORA;
        $parametros["municipio"] = "%" . strtoupper($municipio) . "%";
        $sql = "SELECT
                    pry.proyecto_ideregistro idmunicipio, pry.proyecto_nom municipio
                FROM
                    proyectos pry
                INNER JOIN empresas emp ON emp.empresa_cod = pry.proyecto_codemp
                INNER JOIN uspr_usuprgpryto uspr ON uspr.uni_municipio = pry.proyecto_ideregistro
                WHERE
                    emp.empresa_sevemp = :codempresa
                AND uspr.usu_ideregistro = :codusuario
                AND uspr.prg_ideregistro = :codprograma
                AND upper(pry.proyecto_nom) LIKE :municipio LIMIT 100";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Valida si el programa de interes por mora puede ejecutarse para el ciclo
     * seleccionado
     * @param int $idCiclo id del ciclo seleccionado
     * @return array informacion de la actividad
     */
    public function validarEjecucionPeriodo($idCiclo) {
        //$ciclo = $this->procesoSuspensionesModel->getCicloGeneralEmpresa($this->sesion->get("idempresa"));
        $resultado = $this->genericoModel->validarActividadPrograma(PROGRAMA_FACTURAR_INTERESES_MORA, $idCiclo, $this->sesion->get("idempresa"));
        return $resultado;
    }

//
//    public function cerrarEjecucionPeriodo() {
//        $actividad["idactividad"] = PROGRAMA_FACTURAR_INTERESES_MORA;
//        $resultado = $this->genericoModel->actualizarActividad($actividad, "C");
//        if ($resultado) {
//            throw new MyException('Error al cerrar el proceso', -1);
//        }
//    }

    /**
     * Consulta los documentos de interes por mora que pueden tener las
     * suscripciones de un ciclo o una suscripcion
     * @param string $accion determina si el proceso va a ser realizado por
     * suscripcion o por ciclo
     * @param array $parametros informacion para la consulta
     * @return array informacion de los documentos de interes por mora
     */
    public function consultarDocumentosPreview($accion, $parametros) {
        $complementoSql = "";
        switch ($accion) {
            case "S":
            case "s":
                $complementoSql .= "AND fac.dsus_ideregistr = :idsuscripcion";
                break;
            case "C":
            case "c":
                $complementoSql .= " AND fac.cic_ideregistro=:idciclo ";
        }
        $sql = "SELECT DISTINCT
                    fac.uni_documento iddocumento,
                    doc.doc_nombre nombredocumento,
                    fac.uni_tipdocument idtipdocumento,
                    tido.tido_nombre nombretipdocumento,
                    ddot.uni_documento iddocumentomora
                FROM
                    fac_factura fac
                INNER JOIN doc_documento doc ON fac.uni_documento = doc.uni_documento
                INNER JOIN tido_tipdocumen tido ON fac.uni_tipdocument = tido.uni_tipdocument
                LEFT JOIN doti_doctipo doti ON doti.uni_documento = fac.uni_documento
                AND doti.uni_tipdocument = fac.uni_tipdocument
                LEFT JOIN ddot_detdoctipo ddot ON doti.doti_ideregistr = ddot.doti_ideregistr
                AND ddot.ddot_tipo = 'IM'
                WHERE
                    fac.fac_idepadre IS NULL
                    AND fac.fac_ideorigen IS NULL
                    AND fac.fac_sdoreal > 0
                    AND fac.emp_ideregistro = :idempresa
                    AND fac.fac_estado = 'A'
                    AND fac.fac_fecvence < now() $complementoSql";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function consultarConceptosNoBasePreview($idsConceptos, $accion, $parametros) {
        $accion = strtoupper($accion);
        if ($accion == 'S') {
            $complemento = " AND fac.dsus_ideregistr = :idsuscripcion ";
        } else {
            $complemento = " AND fac.cic_ideregistro = :idciclo ";
        }
        $sql = "SELECT
                  DISTINCT
                         dfac.uni_concepto dconcepto,
                   con.con_nombre concepto,
                   con.con_alias alias
                FROM
                        fac_factura fac INNER JOIN dfac_detfactura dfac ON fac.fac_ideregistro=dfac.fac_ideregistro
                  INNER JOIN con_concepto con ON con.uni_concepto=dfac.uni_concepto
                WHERE
                        fac.fac_idepadre IS NULL
                AND fac.fac_ideorigen IS NULL
                AND fac.fac_sdoreal > 0
                AND fac.fac_estado = 'A'
                AND dfac_sdoreal>0
                AND fac.emp_ideregistro = :idempresa
                AND fac.fac_fecvence < now()  $complemento  
                AND  dfac.uni_concepto NOT IN (SELECT	DISTINCT
                                      core.uni_conrelacion idconcepto
                                  FROM 
                                      core_conrelacio core 
                                  WHERE
                                      core.uni_concepto in ($idsConceptos) )  ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function consultarConceptosPorLiquidacionPreview($idsLiquidaciones) {
        $sql = "SELECT DISTINCT
                    coli.uni_concepto idconcepto
                FROM
                    coli_conliquida coli
                WHERE
                    coli.uni_liquidacion IN($idsLiquidaciones);";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function consultarLiquidacionPorDocumentoMoraPreview($idsDocumentosMora, $idsTiposDocumento) {
        $sql = "SELECT
                    liq.uni_liquidacion ideliquidacion
                FROM
                    liq_liquidacion liq
                WHERE
                    liq.uni_documento in ($idsDocumentosMora)
                AND liq.uni_tipdocument in ($idsTiposDocumento)
                AND liq.liq_venclasific = 'IM';";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    /**
     * Realiza la consulta de los documentos de interes por mora que van a ser
     * procesados para una suscripcion o las sucripciones de un ciclo seleccionado
     * @param string $accion determina si el proceso se va a ejecutar por 
     * suscripcion o por ciclo
     * @param array $parametros informacion para la consulta
     * @return array informacion de los documentos de interes por mora
     */
    public function consultarDocumentosInteresMora($parametros) {
        $sql = "SELECT DISTINCT
                        fac.uni_documento iddocumento,
                        fac.uni_tipdocument idtipdocumento,
                        ddot.uni_documento iddocumentomora,
                        fac.dsus_ideregistr idsuscripcion,
                        fac.fac_ideregistro idfacturaoriginal
                    FROM
                        fac_factura fac
                    LEFT JOIN doti_doctipo doti ON doti.uni_documento = fac.uni_documento AND doti.uni_tipdocument = fac.uni_tipdocument
                    LEFT JOIN ddot_detdoctipo ddot ON doti.doti_ideregistr = ddot.doti_ideregistr AND ddot.ddot_tipo = 'IM'
                    WHERE
                        fac.dsus_ideregistr = :idsuscripcion AND
                        fac.fac_idepadre IS NULL
                        AND fac.fac_ideorigen IS NULL
                        AND fac.fac_sdoreal > 0
                        AND fac.fac_estado = 'A'
                        AND fac.fac_fecvence < now()";
        $resultado = $this->executeQuery($sql, $parametros);

        return $resultado;
    }

    public function cargarFacturasInteresMora($parametros) {
        $sql = "INSERT INTO proceso_interes_mora (  
                SELECT
                fac.fac_ideregistro              idfactura,
                fac.dsus_ideregistr              idsuscripcion,
                fac.uni_documento                iddocumento,
                fac.cic_ideregistro              idciclo,
                fac.uni_tipdocument              idtipdocumento,
                CAST(0 AS INT8)                  idmunicipio,
                CAST(0 AS INT8)                  idfacturamora,
                ddot.uni_documento               iddocumentomora,
                (row_number()
                 OVER () % :numeroprocesos) AS   idproceso,
                CAST('P' AS CHARACTER VARYING)   estado,
                CAST(' - ' AS CHARACTER VARYING) descripcion,
                :idusuario,
                :idempresa
              FROM
                fac_factura fac
                INNER JOIN doc_documento doc on doc.uni_documento = fac.uni_documento AND doc.doc_tipo <> 'IM'
                INNER JOIN dsus_detsuscrip dsus ON fac.dsus_ideregistr = dsus.dsus_ideregistr
                LEFT JOIN fac_factura faci ON (
                fac.fac_ideregistro = faci.fac_ideorigen
                AND faci.cic_ideregistro = :idciclo
                AND faci.per_ideregistro = :idperiodo
                AND faci.fac_idepadre IS NULL
                AND faci.fac_estado IN ('A', 'Z')
                AND faci.uni_documento IN (
                  SELECT uni_documento
                  FROM
                    doc_documento
                  WHERE
                    doc_tipo = 'IM'
                )
                )
                LEFT JOIN doti_doctipo doti ON doti.uni_documento = fac.uni_documento
                                               AND doti.uni_tipdocument = fac.uni_tipdocument
                LEFT JOIN ddot_detdoctipo ddot ON doti.doti_ideregistr = ddot.doti_ideregistr
                                                  AND ddot.ddot_tipo = 'IM'
              WHERE
                fac.fac_fecvence < now()
                AND fac.fac_estado = 'A'
                AND fac.fac_sdoreal > 0
                AND fac.fac_idepadre IS NULL
                AND dsus.cic_ideregistro = :idciclo
                AND faci.fac_ideregistro IS NULL
                AND fac.emp_ideregistro = :idempresa
)";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta la cantidad de facturas que se van a procesar con ese ciclo, usuario y empresa
     * @param type $parametros
     * @return type
     */
    public function consultarCantidadFacturas($parametros) {
        $sql = " SELECT COUNT(*) cantidadfacturas FROM proceso_interes_mora pim
                WHERE pim.estado = 'P' AND pim.usu_ideregistro =:idusuario 
                AND pim.emp_ideregistro =:idempresa AND pim.idciclo =:idciclo ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['cantidadfacturas'];
    }

    public function consultarFacturasPorProceso($idEmpresa, $idProceso) {
        $parametros['idproceso'] = $idProceso;
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT * FROM proceso_interes_mora WHERE idproceso =:idproceso AND emp_ideregistro =:idempresa AND estado = 'P' LIMIT 500";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Registra un encabezado de factura de interes por mora para una suscripcion
     * @param array $parametros informacion del encabezado de la factura de
     * interes por mora
     * @return int id de registro del encabezado
     */
    public function insertarEncabezadoInteresMora($data) {
        $data["fac_estado"] = "Z";
        $data["fac_metgenera"] = "P";
        $data["fac_fecha"] = "now()";
        $data["fac_fecaprobada"] = "now()";
        $data["fac_sdoreal"] = $data["fac_vlrreal"];
        $data["emp_ideregistro"] = $this->sesion->get("idempresa");
        $data["usu_ideregistro"] = $this->sesion->get("idusuario");

        return $this->insertar($data, "fac_factura", "sq_fac_ideregistro");
    }

    /**
     * Registra un encabezado de factura de interes por mora para el proceso
     * de interes por mora por ciclos
     * @param array $parametros informacion del encabezado de la factura de
     * interes por mora
     * @return int id de registro del encabezado
     */
    public function insertarEncabezadoInteresMoraProceso($parametros, $idEmpresa, $idUsuario) {
        //$data["fac_numero"] = $parametros["facnumero"];
        $data["fac_metgenera"] = "P";
        $data["fac_estado"] = "Z";
        $data["fac_fecha"] = "now()";
        $data["fac_fecaprobada"] = "now()";
        $data["emp_ideregistro"] = $idEmpresa;
        $data["fac_ideorigen"] = $parametros["facideorigen"];
        $data["sus_ideregistro"] = $parametros["susideregistro"];
        $data["dsus_ideregistr"] = $parametros["dsusideregistr"];
        $data["uni_tipsuscripc"] = $parametros["unitipsuscripc"];
        $data["uni_tipusosuscr"] = $parametros["unitipusosuscr"];
        $data["uni_liquidacion"] = $parametros["idliquidacionmora"];
        $data["ter_ideregistro"] = $parametros["terideregistro"];

        $data["cic_ideregistro"] = $parametros["idciclo"];
        $data["per_ideregistro"] = $parametros["idperiodo"];

        $data["uni_documento"] = $parametros["iddocumentomora"];
        $data["uni_tipdocument"] = $parametros["unitipdocument"];
        $data["cic_ano"] = $parametros["cicloanio"];
        $data["hliq_ideregistr"] = $parametros["hliqideregistr"];
        $data["uni_tiptercero"] = $parametros["unitiptercero"];
        $data["fac_vlrreal"] = $parametros["valorresultado"];
        $data["fac_sdoreal"] = $parametros["valorresultado"];
        $data["fac_fecvence"] = $parametros["fechavencimiento"];
        $data["fac_fecsuspens"] = $parametros["fechasuspension"];
        $data["fac_version"] = $parametros["facversion"];
        $data["usu_ideregistro"] = $idUsuario;
        return $this->insertar($data, "fac_factura", "sq_fac_ideregistro");
    }

    /**
     * Registra un detalle de interes por mora para el encabezado de una
     * suscripcion
     * @param array $parametros informacion del detalle de factura de interes
     * por mora
     * @return int id del detalle de factura de interes por mora
     */
    public function insertarDetalleInteresMora($parametros, $idUsuario) {
        $data["dfac_estado"] = "A";
        $data["dfac_cantidad"] = 1;
        $data["dfac_vlrunitari"] = $parametros["valorresultado"];
        $data["dfac_vlrtotal"] = $parametros["valorresultado"];
        $data["dfac_vlrreal"] = $parametros["valorresultado"];
        $data["dfac_sdoreal"] = $parametros["valorresultado"];
        $data["fac_ideregistro"] = $parametros["idfactura"];
        $data["uni_concepto"] = $parametros["conceptomora"];
        $data["emp_ideregistro"] = $parametros["idempresa"];
        $data["usu_ideregistro"] = $idUsuario;
        return $this->insertar($data, "dfac_detfactura", "sq_dfac_ideregistr");
    }

    /**
     * Registra un detalle de interes por mora para el encabezado del proceso
     * de interes por mora por ciclos
     * @param array $parametros informacion del detalle de factura de interes
     * por mora
     * @return int id del detalle de factura de interes por mora
     */
    public function insertarDetalleInteresMoraProceso($parametros, $idUsuario) {
        $data["dfac_estado"] = "A";
        $data["dfac_cantidad"] = 1;
        $data["dfac_vlrunitari"] = $parametros["valorresultado"];
        $data["dfac_vlrtotal"] = $parametros["valorresultado"];
        $data["dfac_vlrreal"] = $parametros["valorresultado"];
        $data["dfac_sdoreal"] = $parametros["valorresultado"];
        $data["fac_ideregistro"] = $parametros["idfactura"];
        $data["uni_concepto"] = $parametros["conceptomora"];
        $data["emp_ideregistro"] = $parametros["idempresa"];
        $data["usu_ideregistro"] = $idUsuario;
        return $this->insertar($data, "dfac_detfactura", "sq_dfac_ideregistr");
    }

    public function insertarHistoricoInteres($idfactura, $idconcepto, $tasa, $idUsuario) {
        $data['htsi_tasinteres'] = $tasa;
        $data['uni_concepto'] = $idconcepto;
        $data['fac_ideregistro'] = $idfactura;
        $data['usu_ideregistro'] = $idUsuario;
        return $this->insertar($data, 'htsi_htasinteres', 'sq_htsi_ideregistr');
    }

    /**
     * Consulta la informacion de los conceptos y liquidacion de interes por
     * mora
     * @param type $documentoMora id del documento de interes por mora de la
     * suscripcion
     * @param type $tipoDocumento id del tipo de documento de la suscripcion
     * @return type
     */
    public function consultarConceptosInteresMora($documentoMora, $tipoDocumento, $idempresa) {
        $parametros["documentomora"] = $documentoMora;
        $parametros["tipodocumento"] = $tipoDocumento;
        $parametros["codempresa"] = $idempresa;
        $sql = "SELECT datos.idliquidacionmora idliquidacionmora,datos.idconceptomora idconceptomora,
                regexp_replace(array_agg(datos.idconceptobase)::text,'[{}]','','g') conceptosrelacionados from 
                (select * FROM (
                    SELECT	coli.uni_liquidacion idliquidacionmora,
                    con.uni_concepto idconceptomora,	
                    core.uni_conrelacion idconceptobase,                              
                    row_NUMBER () over (PARTITION by core.uni_conrelacion) registro
                    FROM
                        coli_conliquida coli
                    INNER JOIN con_concepto con ON coli.uni_concepto = con.uni_concepto
                    INNER JOIN core_conrelacio core ON coli.uni_concepto = core.uni_concepto
                    INNER JOIN con_concepto con1 ON core.uni_conrelacion = con1.uni_concepto
                    INNER JOIN esem_estempresa esem on con.est_concepto = esem.est_ideregistro
              WHERE
                  con.con_intfinanciacion = 'S'
              AND coli.uni_liquidacion IN (
                  SELECT
                      liq.uni_liquidacion ideliquidacion
                  FROM
                      liq_liquidacion liq
                  WHERE
                      liq.uni_documento = :documentomora
                      AND liq.uni_tipdocument = :tipodocumento
                      AND liq.liq_venclasific = 'IM'
              )
              AND esem.emp_ideregistro = :codempresa
        ) as registro 
    WHERE registro.registro = 1
    ORDER BY registro.idliquidacionmora,registro.idconceptomora) datos
    GROUP BY datos.idliquidacionmora,datos.idconceptomora";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta el valor de un concepto
     * @param type $idConcepto id del concepto
     * @return array Informacion del valor del concepto
     */
    public function consultarValorConceptoInteresMora($idConcepto) {
        $parametros["idconcepto"] = $idConcepto;
        $sql = "SELECT
                    con_formula formula,
                    con_valor valor
                FROM
                    con_concepto
                WHERE
                    uni_concepto = :idconcepto";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        $arrConcepto = json_decode($resultado[0]["formula"], true);
        return $arrConcepto[0]["valor"];
    }

    /**
     * Consulta la informacion de los conceptos relacionados al concepto de
     * interes por mora
     * @param int $idConcepto id del concepto de interes por mora
     * @return array Informacion de los conceptos relacionados
     */
    public function consultarConceptoRelacionadoInteresMora($idConcepto) {
        $parametros["idconcepto"] = $idConcepto;
        $sql = "SELECT
                    con.uni_concepto idconcepto,
                    con.con_nombre nombre,
                    con.con_formula formula,
                    con.con_valor valor
                FROM
                    con_concepto con
                INNER JOIN core_conrelacio core ON con.uni_concepto = core.uni_concepto
                WHERE
                    core.uni_conrelacion = :idconcepto;";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta la informacion del concepto relacionado de iva de interes por 
     * mora para un concepto
     * @param int $idConcepto id del concepto de interes por mora
     * @return array informacion del concepto de iva de interes por mora
     */
    public function consultarConceptoIvaInteresMora($idConcepto) {
        $parametros["idconcepto"] = $idConcepto;
        $sql = "SELECT
                    con.uni_concepto idconcepto,
                    con.con_nombre nombre,
                    con.con_formula formula,
                    con.con_valor valor
                FROM
                    con_concepto con
                INNER JOIN core_conrelacio core ON con.uni_concepto = core.uni_concepto
                WHERE
                    core.uni_conrelacion = :idconcepto;";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta la informacion adicional de una factura
     * @param int $idFactura id de la factura
     * @return array informacion adicional de la factura
     */
    public function consultarInfoAdicionalFactura($idFactura) {
        $parametros["idfactura"] = $idFactura;
        $sql = "SELECT
                    fac_metgenera facmetgenera,
                    fac_estado facestado,
                    fac_fecha facfecha,
                    emp_ideregistro idempresa,
                    sus_ideregistro susideregistro,
                    dsus_ideregistr dsusideregistr,
                    uni_tipsuscripc unitipsuscripc,
                    uni_tipusosuscr unitipusosuscr,
                    ter_ideregistro terideregistro,
                    uni_tipdocument unitipdocument,
                    hliq_ideregistr hliqideregistr,
                    uni_tiptercero unitiptercero, 
                    EXTRACT (day from now() - fac_fecvence) diasvencimiento
                FROM
                    fac_factura
                WHERE
                    fac_ideregistro = :idfactura";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Extrae la informacion de una liquidacion de interes por mora
     * @param type $conceptosRelacionados conceptos relacionados al concepto
     * de interes por mora
     * @return array Informacion de la liquiacion de interes por mora
     */
    public function extraerLiquidacionMora($conceptosRelacionados) {
        $liquidacionMora = array();
        $idAnterior = $conceptosRelacionados[0]["idliquidacionmora"];
        $liquidacionMora[] = $conceptosRelacionados[0]["idliquidacionmora"];
        foreach ($conceptosRelacionados as $concepto) {
            if ($concepto["idliquidacionmora"] != $idAnterior) {
                $idAnterior = $concepto["idliquidacionmora"];
                $liquidacionMora[] = $concepto["idliquidacionmora"];
            }
        }
        return $liquidacionMora[0];
    }

    /**
     * Extrae la informacion del concepto de interes por mora
     * @param type $conceptosRelacionados conceptos relacionados 
     * al interes por mora
     * @return array informacion del concepto de interes por mora
     */
    public function extraerConceptoInteresMora($conceptosRelacionados) {
        $conceptoMora = array();
        $idAnterior = $conceptosRelacionados[0]["idconceptomora"];
        $conceptoMora[] = $conceptosRelacionados[0]["idconceptomora"];
        foreach ($conceptosRelacionados as $concepto) {
            if ($concepto["idconceptomora"] != $idAnterior) {
                $idAnterior = $concepto["idconceptomora"];
                $conceptoMora[] = $concepto["idconceptomora"];
            }
        }
        return $conceptoMora[0];
    }

    /**
     * Estrae el valor de un concepto del campo formula
     * @param array $formulaConcepto informacion de la formula del concepto
     * @return number valor del concepto
     */
    public function extraerValorConcepto($formulaConcepto) {
        $arrConcepto = json_decode($formulaConcepto, true);
        //print_r("para valor de concepto \n");
        //print_r($arrConcepto);
        return $arrConcepto[0]["valor"];
    }

    /**
     * Consulta el valor de los saldos de los conceptos relacionados al interes
     * por mora de una factura para el detalle de interes por mora
     * @param int $idFacturaOriginal id de la factura original
     * @param string $conceptosBase concepto base del interes por mora
     * @param number $valorPorcentualInteres valor porcentual del interes
     * @return array informacion del saldo de los detalles de factura
     */
    public function obtenerValorResultadoInteresMora($idFacturaOriginal, $conceptosBase, $valorPorcentualInteres) {
       
        $sql = "SELECT
                    SUM (dfac.dfac_sdoreal) saldofactura
                FROM
                    fac_factura fac
                INNER JOIN dfac_detfactura dfac ON fac.fac_ideregistro = dfac.fac_ideregistro
                WHERE
                    fac.fac_ideregistro = $idFacturaOriginal
                AND dfac.uni_concepto IN ($conceptosBase)";
        $resultado = $this->executeQuery($sql);
        if(empty($resultado)){
            throw new MyException("No hay conceptos base a evaluar para la factura $idFacturaOriginal" ,-1);
        }
        $valorresultado = $resultado[0]["saldofactura"] * $valorPorcentualInteres;
        return $valorresultado;
    }

     

    
    /**
     * Extrae los conceptos de interes por mora en un string separado por comas
     * @param arrat $conceptos informacion del los conceptos
     * @return string id de los conceptos separados por coma
     */
    public function extraerConceptosBaseInteresMora($conceptos) {
        $conceptosBase = array();
        foreach ($conceptos as $concepto) {
            $conceptosBase[] = $concepto["idconceptobase"];
        }
        return implode(",", $conceptosBase);
    }

    /**
     * Consulta los dias de vencimiento de una liquidacion
     * @param int $idliquidacion id de la liquidacion
     * @return array Informacion de los dias de vencimiento de la liquidacion
     */
    public function consultarFechasLiquidacion($idliquidacion) {
        $parametros["idliquidacion"] = $idliquidacion;
        $sql = "SELECT
                        CAST (CURRENT_TIMESTAMP + ( CAST ( CAST (  COALESCE (liq.liq_diasuspens, 0) AS CHARACTER VARYING ) || ' days' AS INTERVAL ) ) AS DATE ) fechasuspension,
                        CAST (CURRENT_TIMESTAMP + (CAST (CAST (COALESCE (liq.liq_diavencim, 0) AS CHARACTER VARYING) || ' days' AS INTERVAL)) AS DATE) fechavencimiento
                FROM
                        liq_liquidacion liq
                WHERE
                        liq.uni_liquidacion =:idliquidacion";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta la informacion del ciclo y el periodo de una suscripcion
     * @param int $idSuscripcion id de la suscripcion
     * @return array Informacion del ciclo y el periodo de la suscripcion
     */
    public function getCicloPeriodo($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT
                    cic.cic_ideregistro idciclo,
                    cic.cic_nombre ciclo,
                    per.per_ideregistro idperiodo,
                    per.per_nombre periodo,
                    cic.cic_anoactual cicloanio,
                    per.per_fecvence fechavencimiento,
                    per.per_fecsuspens fechasuspension
                FROM
                    cic_ciclo cic inner join per_periodo per on per.cic_ideregistro = cic.cic_ideregistro
		    inner join dsus_detsuscrip dsus on cic.cic_ideregistro=dsus.cic_ideregistro
                WHERE
                    per.per_estado = 'A' and
                    dsus.dsus_ideregistr= :idsuscripcion";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    public function getPeriodoPorCiclo($idCiclo) {
        $parametros['idciclo'] = $idCiclo;
        $sql = "SELECT
                    cic.cic_ideregistro idciclo,
                    cic.cic_anoactual cicloanio,
                    per.per_ideregistro idperiodo,
                    per.per_fecvence fechavencimiento,
                    per.per_fecsuspens fechasuspension
                FROM
                    cic_ciclo cic inner join per_periodo per on per.cic_ideregistro = cic.cic_ideregistro
                WHERE
                    cic.cic_ideregistro =:idciclo AND
                    per.per_estado = 'A' ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta si una factura tiene registrada una factura de interes por mora
     * @param int $idFacOrigen id de la factura original
     * @param int $idDocumentoMora id del documento de interes por mora
     * @param int $idTipoDocumento id del tipo de documento
     * @return array Informacion de la factura de interes por mora existente
     */
    public function tieneFacturaInteresMora($idFacOrigen, $idDocumentoMora, $idTipoDocumento, $idCiclo, $idPeriodo, $cicAnio) {
        $parametros["idfacturaorigen"] = $idFacOrigen;
        $parametros["iddocumento"] = $idDocumentoMora;
        $parametros["idtipodocumento"] = $idTipoDocumento;
        $parametros["idciclo"] = $idCiclo;
        $parametros["idperiodo"] = $idPeriodo;
        $parametros["cicloanio"] = $cicAnio;
        $sql = "SELECT
                    COUNT (fac.fac_ideregistro) numerofacturas
                FROM
                    fac_factura fac
                WHERE
                    fac.fac_estado IN ('A','Z')
                AND fac.fac_ideorigen = :idfacturaorigen
                AND fac.uni_documento = :iddocumento
                AND fac.uni_tipdocument = :idtipodocumento
                AND fac.cic_ideregistro = :idciclo
                AND fac.per_ideregistro = :idperiodo
                AND fac.cic_ano = :cicloanio";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0]["numerofacturas"];
    }

    /**
     * Aumenta el número de registros procesados por un proceso.
     * @param int $idControlProceso Identificador del proceso
     * @return int Número de filas afectadas.
     */
    public function aumentarCantidadRegistro($idControlProceso) {
        $parametros['cpr_ideregistro'] = $idControlProceso;
        $sql = 'update cpr_ctrproceso set cpr_canregistro=(cpr_canregistro+1) where cpr_ideregistro=:cpr_ideregistro';
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Actualiza el proceso en estado finalizado
     * @param int $idControlProceso identificador del proceso.
     * @return array 
     */
    public function finalizarProceso($idControlProceso) {
        $parametros['cpr_fecfinal'] = 'now()';
        $parametros['cpr_estado'] = 'I';
        $parametros['cpr_ideregistro'] = $idControlProceso;
        return $this->actualizar($parametros, 'cpr_ctrproceso', 'cpr_ideregistro=:cpr_ideregistro');
    }

    /**
     * Realiza la actualizacion en base de datos que representa la aprobacion
     * de las facturas de interes por mora
     * @return int numero de filas afectadas por la actualización
     */
    public function aprobarLiquidacionInteresMora($idFactura) {
        $parametros = [];
        $sql = "update fac_factura set fac_estado = 'A' where fac_estado = 'Z' AND fac_ideregistro=$idFactura";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Obtiene la medicion en dias de la fecha de vencimiento de la factura
     * de interes por mora anterior mas los dias de la fecha actual para generar la fecha de
     * vencimiento de la factura de interes por mora
     * @param date $fechaVencimiento valor de la fecha de vencimiento de la
     * anterior factura
     * @return type
     */
    public function consultarDiasVencimientoAnterior($fechaVencimiento) {
        $sql = "SELECT
                    DATE_PART(
                        'day',
                        now()::timestamp - '$fechaVencimiento':: timestamp
                ) diasadicionales;";
        $resultado = $this->executeQuery($sql);
        return $resultado[0];
    }

    /**
     * Consulta la informacion de la ultima factura de interes por mora que
     * tiene la suscripcion
     * @param int $idSuscripcion
     * @return array informacion de la factura de interes por mora
     */
    public function consultarUltimaFacturaInteresMora($idFactura) {
        $parametros["idfactura"] = $idFactura;
        $sql = "SELECT
                    fac.dsus_ideregistr idsuscripcion,
                    fac.fac_ideregistro idfacturamora,
                    fac.fac_fecsuspens fechasuspension,
                    fac.fac_fecha fecha,
                    (SELECT NOW()::date - fac.fac_fecha::date) dias
                FROM
                    fac_factura fac
                WHERE
                    fac.fac_ideorigen =:idfactura
                AND fac.fac_estado IN('A', 'Z')
                AND fac.fac_idepadre is NULL
                ORDER BY
                    fac_fecha desc
                LIMIT 1;";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    public function validarExisteTablaProceso() {
        $sql = "SELECT count(*) cantidadtablas
                FROM  information_schema.TABLES
                WHERE TABLE_NAME = 'proceso_interes_mora';";
        $resultado = $this->executeQuery($sql);
        return $resultado[0]['cantidadtablas'];
    }

    public function vaciarTablaResumen($idEmpresa) {
        $sql = "DELETE FROM proceso_interes_mora WHERE emp_ideregistro = $idEmpresa";
        $this->executeQuery($sql);
    }

    /**
     * Se crea la tabla del resumen del proceso de interés por mora
     * @param int $empresa id de la empresa del usuario en sesion
     * @return type
     */
    public function crearTablaResumenInteresMora() {
        $sql = "CREATE TABLE
                IF NOT EXISTS proceso_interes_mora (
                        idfactura int8,
                        idsuscripcion int8,
                        iddocumento int4,
                        idciclo int4,
                        idtipdocumento int4,
                        idmunicipio int4,
                        idfacturamora int8,
                        iddocumentomora int4,
                        idproceso int4,
                        estado CHARACTER VARYING (2),
                        descripcion CHARACTER VARYING (200),
                        usu_ideregistro int4,
                        emp_ideregistro int4 );";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    /**
     * 
     * @param int $idSuscripcion id de la suscripcion a la que es aplicado el
     * interes por mora
     * @param int $idMunicipio id del municipio de la suscripcion a la que es
     * aplicado el interes por mora
     * @param int $idCiclo id del ciclo de la suscripcion a la que es
     * aplicado el interes por mora
     * @param int $idFactura id de la factura original de la suscripcion a la 
     * que es aplicado el interes por mora
     * @param int $idFacturaMora id de la factura de interes por mora 
     * @param type $descripcion descripcion de la causa del registro de resumen
     * @param type $estado estado del registro en la tabla de resumen
     * @param int $empresa id de la empresa del usuario en sesion
     * @return int
     */
    public function insertarResumenProcesoInteresMora($idMunicipio, $idFactura, $idFacturaMora, $descripcion, $estado) {
        $parametros["estado"] = $estado;
        $parametros["idfactura"] = $idFactura;
        $parametros["descripcion"] = $descripcion;
        $parametros['idmunicipio'] = $idMunicipio;

        if (!empty($idFacturaMora)) {
            $parametros["idfacturamora"] = $idFacturaMora;
        }
        return $this->actualizar($parametros, "proceso_interes_mora", "idfactura=:idfactura");
    }
    public function insertarResumenSinResultados($descripcion) {
        $parametros["estado"] = 'T';
        $parametros["descripcion"] = $descripcion;
        return $this->insertar($parametros, "proceso_interes_mora", null);
    }

    /**
     * Consulta el id del municipio de la suscripcion de la factura original
     * @param type $idFacturaOrigen id de la factura original de la suscripcion
     * @return array informacion del municipio de la factura original
     */
    public function consultarMunicipioFacturaOriginal($idFacturaOrigen) {
        $parametros["idfactura"] = $idFacturaOrigen;
        $sql = "select dsus.uni_municipio idmunicipio
                from dsus_detsuscrip dsus inner join fac_factura fac
                on dsus.dsus_ideregistr = fac.dsus_ideregistr
                where fac_ideregistro = :idfactura";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }
    public function consultarSinResultado($idEmpresa, $numeroHilos) {
        try {
            $parametros['idempresa'] = $idEmpresa;
            $parametros['numerohilos'] = $numeroHilos;
            $sql = "SELECT estado
                    FROM proceso_interes_mora
                    WHERE emp_ideregistro = :idempresa AND estado = 'T'
                    GROUP BY estado
                    HAVING COUNT (*) >= :numerohilos";
            $resultado = $this->executeQuery($sql, $parametros);
            if(!empty($resultado )){
                throw new MyException('No se generaron facturas de interés por mora', 0);
            }
        } catch (\Exception $exc) {
            throw new MyException('La tabla de proceso de interés por mora aun no ha sido creada', 0);
        }
    }

    /**
     * Realiza la consulta de las facturas de interes por mora que se registraron
     * correctamente
     * @param type $idEmpresa id de la empresa del usuario en sesion
     * @return array informacion de la tabla de resumen de interes por mora
     * @throws MyException Lanzada al no encontrar la tabla de resumen
     */
    public function consultarResumenSuccessIxm($idEmpresa) {
        try {
            $parametros['idempresa'] = $idEmpresa;
            $sql = "select distinct
                    (pry.proyecto_nom) municipio,
                    count(pf.idfacturamora) facgeneradas
                from
                    proceso_interes_mora pf
                    INNER JOIN fac_factura fac on fac.fac_ideorigen = pf.idfactura  and fac.fac_estado = 'Z'
                inner join proyectos pry on pf.idmunicipio = pry.proyecto_ideregistro
                where pf.emp_ideregistro =$idEmpresa 
                group by
                        pry.proyecto_nom";
            $resultado = $this->executeQuery($sql, $parametros);
            return $resultado;
        } catch (\Exception $exc) {
            throw new MyException('La tabla de proceso de interés por mora aun no ha sido creada', 0);
        }
    }

    /**
     * Realiza la consulta de las facturas de interes por mora que no se registraron
     * correctamente
     * @param type $idEmpresa id de la empresa del usuario en sesion
     * @return array informacion de las facturas no registradas
     * @throws MyException Lanzada al no encontrar la tabla de resumen
     */
    public function consultarResumenNoSuccessIxm($idEmpresa) {
        try {
            $parametros['idempresa'] = $idEmpresa;
            $sql = "select distinct
                    (pry.proyecto_nom) municipio,
                    count(pf.idfacturamora) facgeneradas
                from
                    proceso_interes_mora pf
                inner join proyectos pry on pf.idmunicipio = pry.proyecto_ideregistro
                where emp_ideregistro =:idempresa AND pf.estado like 'N'
                group by
                        pry.proyecto_nom";
            $resultado = $this->executeQuery($sql, $parametros);
            return $resultado;
        } catch (\Exception $exc) {
            throw new MyException('La tabla de proceso de interes por mora aun no ha sido creada', 0);
        }
    }

    /**
     * Consulta la cantidad de facturas sin aprobar de interes interes por mora
     * @return array numero de facturas con estado Z
     */
    public function consultarFacturasSinAprobar($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT count(*) facturasinteresmora
                FROM fac_factura fac
                WHERE fac.fac_estado = 'Z' and fac.emp_ideregistro = :idempresa";
        $resultado = $this->executeQuery($sql,$parametros);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['facturasinteresmora'];
    }

    /**
     * Consulta las facturas que están sin aprobar
     * @return array
     */
    public function consultarFacturasSinNumero($idEmpresa) {
        $sql = "SELECT
                        fac.fac_ideregistro idfactura,
                        fac.uni_documento iddocumento,
                        fac.uni_tipdocument idtipodocumento,
                        fac.emp_ideregistro idempresa
                FROM fac_factura fac
                WHERE
                 fac.fac_estado = 'Z'
                 AND fac.fac_numero IS NULL AND fac.emp_ideregistro=$idEmpresa";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function obtenerFacturasInteresMoraConSaldoAnterior($idSuscripcion) {
        $parametros["idsuscripcion"] = $idSuscripcion;
        $sql = "SELECT
                    fac.dsus_ideregistr idsuscripcion,
                    fac.fac_ideregistro idfacturamora,
                    fac.fac_fecsuspens fechasuspension,
                    fac.fac_fecha fecha,
                    (SELECT( EXTRACT( epoch FROM( SELECT(NOW() - fac.fac_fecha))) / 86400) :: int) dias
                FROM
                    fac_factura fac
                WHERE
                    fac.fac_ideorigen IS not NULL
                AND fac.fac_estado IN('A', 'Z')
                AND fac.dsus_ideregistr = :idsuscripcion
                AND fac.fac_sdoreal > 0
                ORDER BY
                    fac_fecha desc;";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado;
    }

    public function obtenerNumeroFactura($infoFactura) {
        $sql = 'SELECT
                   nudo_ideregistro idnumero , (nudo_numdisponi+1) numero
                FROM
                   nudo_numdocumen
                WHERE
                   emp_ideregistro=:idempresa and uni_documento=:iddocumento
                   and uni_tipdocument=:idtipodocumento';
        $resultado = $this->executeQuery($sql, $infoFactura);
        if (empty($resultado)) {
            throw new MyException("Número de factura no generado. documento:" . $infoFactura['iddocumento'] . ' tipo documento: ' . $infoFactura['idtipodocumento'], -1);
        }
        return $resultado[0];
    }

}
