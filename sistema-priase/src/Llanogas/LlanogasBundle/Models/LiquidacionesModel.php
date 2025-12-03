<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Description of LiquidacionesModel
 *
 * @author mebonilla
 */
class LiquidacionesModel extends AuditoriaServices {

    /**
     * Sesión del usuario
     * @var SessionInterface
     */
    private $sesion;

    /**
     * Constructor de la clase
     * @param Connection $conexion
     */
    public function __construct(&$conexion, &$sesion) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
    }

    /**
     * Consulta y despliega resultados a través de un autocomplete
     * con las liquidaciones que no han sido parametrizadas
     * @param int codempresa identificador de la empresa
     * @return Array retorna los nombre y el id de la unidad de la liquidacion
     */
    public function autocompleteLiquidacion($liquidacion) {
        $parametros["codempresa"] = $this->sesion->get("idempresa");
        $parametros["liquidacion"] = "%" . strtoupper($liquidacion) . "%";
        $sql = "SELECT
                    uni.uni_ideregistro idliquidacion,
                    uni.uni_nombre1 liquidacion,
                    est.est_ideregistro idestructura
                FROM
                    uni_unidad uni
                INNER JOIN est_estructura est ON uni.est_ideregistro = est.est_ideregistro
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = est.est_ideregistro
                WHERE
                    est.cla_ideregistro = 3
                AND uni.uni_ideregistro NOT IN (
                        SELECT
                            liq.uni_liquidacion
                        FROM
                            liq_liquidacion liq
                    WHERE liq.est_liquidacion=est.est_ideregistro
                ) AND esem.emp_ideregistro = :codempresa AND upper(uni.uni_nombre1) like :liquidacion LIMIT 100";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta la informacion de tipos de documento disponibles para la generacion
     * de liquidaciones
     * @param int $documento id del documento
     * @return Array detalle de tipos de documento
     */
    public function consultarTipoDocumento($documento) {
        $parametros["codempresa"] = $this->sesion->get("idempresa");
        $parametros["documento"] = $documento;
        $sql = "SELECT DISTINCT
                    (tido.uni_tipdocument) AS idtipodocumento,
                    tido.tido_nombre AS tipodocumento
                FROM
                    doc_documento doc
                INNER JOIN doti_doctipo doti ON doc.uni_documento = doti.uni_documento
                INNER JOIN tido_tipdocumen tido ON doti.uni_tipdocument = tido.uni_tipdocument
                INNER JOIN est_estructura est ON tido.est_tipdocument = est.est_ideregistro
                INNER JOIN esem_estempresa esem ON est.est_ideregistro = esem.est_ideregistro
                WHERE esem.emp_ideregistro = :codempresa AND doc.uni_documento = :documento;";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException("No se encontraron tipos de documentos.", 0);
        }
        return $resultado;
    }

    /**
     * Consulta la informacion de los documentos disponibles para una
     * clasificacion 
     * especifica seleccionada por el usuario
     * @param int $idEmpresa identificador de la empresa 
     * @param string $clasificacion valor de la clasificacion 
     * @return Array lista de documentos para la clasificacion especifica
     */
    public function consultarDocumentos($clasificacion) {
        $parametros = array("codempresa" => $this->sesion->get("idempresa"));
        $complementoSql = NULL;
        if (!empty($clasificacion) && $clasificacion == "CA") {
            $complementoSql .= "AND doc.doc_tipo IN (:clasificacion, 'VE')";
            $parametros["clasificacion"] = $clasificacion;
        }
        if (!empty($clasificacion) && $clasificacion == "CO") {
            $complementoSql .= "AND doc.doc_tipo IN (:clasificacion, 'VE')";
            $parametros["clasificacion"] = $clasificacion;
        }
        if (!empty($clasificacion) && ($clasificacion != "CA" && $clasificacion != "CO")) {
            $complementoSql .= "AND doc.doc_tipo = :clasificacion";
            $parametros["clasificacion"] = $clasificacion;
        }
        $sql = "SELECT
                    uni.uni_ideregistro as iddocumento,
                    doc_nombre as documento
                FROM
                    doc_documento doc
                INNER JOIN est_estructura est ON est.est_ideregistro = doc.est_documento
                INNER JOIN esem_estempresa esem ON est.est_ideregistro = esem.est_ideregistro
                INNER JOIN uni_unidad uni ON doc.uni_documento = uni.uni_ideregistro
                WHERE
                      esem.emp_ideregistro = :codempresa AND est.cla_ideregistro = 7 $complementoSql";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException("No se encontraron documentos.", 0);
        }
        return $resultado;
    }

    /**
     * Consulta la informacion de conceptos disponibles para la liquidacion
     * seleccionada expone el resultado a traves de un campo de texto con
     * autocompletado
     * @param string $concepto texto del concepto digitado
     * @param int $idLiquidacion id de liquidacion seleccionado en el
     * autocompletado de liquidaciones
     * @return Array lista de conceptos que coinciden con el parametro de
     * busqueda 
     */
    public function autocompleteConcepto($concepto, $idLiquidacion) {
        $parametros["codempresa"] = $this->sesion->get("idempresa");
        $parametros["concepto"] = "%" . strtoupper($concepto) . "%";
        $parametros["idliquidacion"] = $idLiquidacion;
        $sql = "SELECT 
                    con.uni_concepto idconcepto, 
                    con.con_nombre concepto
                FROM con_concepto con
                INNER JOIN esem_estempresa esem
                ON con.est_concepto = esem.est_ideregistro
                WHERE esem.emp_ideregistro = :codempresa
                AND con.uni_concepto not in (
                        SELECT
                            con.uni_concepto
                        FROM coli_conliquida coli
                        INNER JOIN con_concepto con
                        ON coli.uni_concepto = con.uni_concepto
                        INNER JOIN esem_estempresa eseme 
                        ON con.est_concepto = eseme.est_ideregistro
                        WHERE coli.uni_liquidacion = :idliquidacion 
                        AND eseme.emp_ideregistro = esem.emp_ideregistro
                ) AND upper(con.con_nombre) like :concepto LIMIT 100";
        $resultado = $this->executeQuery($sql, $parametros);

        return $resultado;
    }

    /**
     * Consulta la información de municipios disponibles segun el id del usuario
     * logueado en la aplicacion y el id de la empresa a la que pertenece,
     * ademas de coincidir con el contenido digitado en el campo de texto
     * @param string $municipio texto del municipio digitado
     * @return Array lista de municipios que coinciden con el parametro de
     * busqueda
     */
    public function autocompleteMunicipio($municipio) {
        $parametros["codempresa"] = $this->sesion->get("idempresa");
        $parametros["codusuario"] = $this->sesion->get("idusuario");
        $parametros["municipio"] = "%" . strtoupper($municipio) . "%";
        $parametros["idprograma"] = PROGRAMA_GESTIONAR_LIQUIDACION;
        $sql = "SELECT
                    pry.proyecto_ideregistro idmunicipio, pry.proyecto_nom municipio
                FROM
                    proyectos pry
                INNER JOIN empresas emp ON emp.empresa_cod = pry.proyecto_codemp
                INNER JOIN uspr_usuprgpryto uspr ON uspr.uni_municipio = pry.proyecto_ideregistro
                WHERE
                    emp.empresa_sevemp = :codempresa
                AND uspr.usu_ideregistro = :codusuario
                AND uspr.prg_ideregistro = :idprograma
                AND upper(pry.proyecto_nom) LIKE :municipio LIMIT 100";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta los tipos de uso disponibles para que el usuario pueda vincular
     * a la liquidacion teniendo 
     * en cuenta el id de la empresa a la que el usuario pertenece
     * @return Array lista de tipos de uso pertenecientes al id de la empresa
     * del usuario y a la clase 2
     */
    public function consultarUsos() {
        $parametros["idempresa"] = $this->sesion->get("idempresa");
        $sql = "SELECT
                    uni.uni_ideregistro idtipouso,
                    uni.uni_nombre1 tipouso
                FROM
                    uni_unidad uni
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro
                INNER JOIN est_estructura est ON est.est_ideregistro = uni.est_ideregistro
                WHERE
                    esem.emp_ideregistro = :idempresa
                AND est.cla_ideregistro = 2";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta los diferentes barrios disponibles segun los municipios
     * seleccionados por el usuario
     * ademas de coincidir con el contenido del texto digitado
     * @param array $municipios municipios seleccionados 
     * @return array nombres de los barrios
     */
    public function autocompleteBarrios($municipios, $barrio) {
        $parametros["municipios"] = $municipios;
        $parametros["barrio"] = "%" . strtoupper($barrio) . "%";
        $sql = "SELECT
                    muba.uni_barrio idbarrio,
                    barr.barrio_nom barrio
                FROM
                    muba_munbarrio muba
                    INNER JOIN barrios barr
                    ON muba.uni_barrio = barr.barrio_ideregistro
                WHERE
                    muba.uni_municipio IN ($municipios) 
                    AND UPPER(barr.barrio_nom) LIKE :barrio LIMIT 100";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Inserta una nueva liquidacion parametrizada a partir de uni_unidad
     * @param array $liquidacion informacion de la liquidacion
     * @param int $usuario id del usuario
     * @return int id de la liquidacion
     */
    public function insertarLiquidacion($liquidacion, $usuario) {
        $data["uni_liquidacion"] = $liquidacion["idliquidacion"];
        $data["est_liquidacion"] = $liquidacion["idestructura"];
        $data["liq_nombre"] = $liquidacion["nombreliquidacion"];
        $data["uni_documento"] = $liquidacion["iddocumento"];
        $data["uni_tipdocument"] = $liquidacion["idtipdocumento"];
        $data["liq_inivigencia"] = $liquidacion["inivigencia"];
        if (!empty($liquidacion["finvigencia"])) {
            $data["liq_finvigencia"] = $liquidacion["finvigencia"];
        }
        $data["liq_venclasific"] = $liquidacion["clasificacion"];
        $data["liq_estado"] = "A";
        $data["liq_historico"] = $liquidacion["historico"];
        if (!empty($liquidacion["diavencimiento"])) {
            $data["liq_diavencim"] = $liquidacion["diavencimiento"];
        }
        if (!empty($liquidacion["diasuspension"])) {
            $data["liq_diasuspens"] = $liquidacion["diasuspension"];
        }
        $data['liq_tipcuota'] = $liquidacion['tipocuota'];
        $data["usu_ideregistro"] = $usuario;
        return $this->insertar($data, "liq_liquidacion", null);
    }

    /**
     * Actualiza los valores de la liquidacion ya parametrizada
     * @param array $liquidacion informacion de la liquidacion
     * @return int numero de filas afectadas
     */
    public function actualizarLiquidacion($liquidacion) {
        $data["uni_liquidacion"] = intval($liquidacion["idliquidacion"]);
        if (!empty($liquidacion["idestructura"])) {
            $data["est_liquidacion"] = intval($liquidacion["idestructura"]);
        }
        $data["liq_nombre"] = $liquidacion["nombreliquidacion"];
        $data["uni_documento"] = intval($liquidacion["iddocumento"]);
        $data["uni_tipdocument"] = intval($liquidacion["idtipdocumento"]);
        $data["liq_inivigencia"] = $liquidacion["inivigencia"];
        if (!empty($liquidacion["finvigencia"])) {
            $data["liq_finvigencia"] = $liquidacion["finvigencia"];
        }
        $data["liq_venclasific"] = $liquidacion["clasificacion"];
        $data["liq_estado"] = "A";
        $data["liq_historico"] = $liquidacion["historico"];
        if (!empty($liquidacion["diavencimiento"])) {
            $data["liq_diavencim"] = $liquidacion["diavencimiento"];
        }
        if (!empty($liquidacion["diasuspension"])) {
            $data["liq_diasuspens"] = $liquidacion["diasuspension"];
        }
        $data["usu_ideregistro"] = $this->sesion->get("idusuario");
        $data['liq_tipcuota'] = $liquidacion['tipocuota'];
        $data['liq_ctrventas'] = $liquidacion['controlVenta'];
        return $this->actualizar($data, "liq_liquidacion", "uni_liquidacion = :uni_liquidacion");
    }

    /**
     * Inserta un concepto para la liquidacion que ha sido parametrizada
     * @param array $concepto informacion del concepto
     * @param int $idLiquidacion id de la liquidacion
     * @param int $usuario id del usuario
     * @return int id del concepto
     */
    public function insertarConceptosLiquidacion($concepto, $idLiquidacion, $usuario) {
        $data["uni_liquidacion"] = $idLiquidacion;
        $data["usu_ideregistro"] = $usuario;
        $data["coli_imprimir"] = $concepto["imprimir"];
        $data["uni_concepto"] = $concepto["idconcepto"];
        $data["usu_ideregistro"] = $this->sesion->get("idusuario");
        return $this->insertar($data, "coli_conliquida", "sq_coli_ideregistr");
    }

    /**
     * Actualiza el valor del concepto de una liquidacion parametrizada
     * @param int $concepto id del concepto
     * @return int numero de filas afectadas
     */
    public function actualizarConceptosLiquidacion($concepto) {
        $data["uni_concepto"] = $concepto["idregistroconcepto"];
        $data["coli_imprimir"] = $concepto["imprimir"];
        $data["uni_concepto"] = $concepto["idconcepto"];
        $data["usu_ideregistro"] = $this->sesion->get("idusuario");
        return $this->actualizar($data, "coli_conliquida", "uni_concepto = :uni_concepto");
    }

    /**
     * Inserta un nuevo municipio para la liquidacion
     * @param array $municipio informcion del municipio
     * @param int $usuario id del usuario actual
     * @param int $idLiquidacion id de la liquidacion
     * @return type
     */
    public function insertarMunicipiosLiquidacion($municipio, $usuario, $idLiquidacion) {
        $data["uni_liquidacion"] = $idLiquidacion;
        $data["usu_ideregistro"] = $usuario;
        $data["uni_municipio"] = $municipio["idmunicipio"];
        $data["usu_ideregistro"] = $this->sesion->get("idusuario");
        return $this->insertar($data, "limu_liqmunicipio", "sq_limu_ideregistr");
    }

    /**
     * Actualiza un municipio perteneciente a una liquidacion parametrizada
     * @param array $municipio informacion del municipio
     * @return int numero de filas afectadas
     */
    public function actualizarMunicipiosLiquidacion($municipio) {
        $data["limu_ideregistr"] = $municipio["idregistromunicipio"];
        $data["uni_municipio"] = $municipio["idmunicipio"];
        $data["usu_ideregistro"] = $this->sesion->get("idusuario");
        return $this->actualizar($data, "limu_liqmunicipio", "limu_ideregistr = :limu_ideregistr");
    }

    /**
     * Inserta un nuevo tipo de uso para una liquidacion
     * @param array $tipoUso informacion del tipo de uso
     * @param int $usuario id del usuario
     * @param int $idLiquidacion id de la liquidacion
     * @return int id del tipo de uso
     */
    public function insertarTiposUsosLiquidacion($tipoUso, $usuario, $idLiquidacion) {
        $data["uni_tipusosuscr"] = $tipoUso["idtipouso"];
        $data["usu_ideregistro"] = $usuario;
        $data["uni_liquidacion"] = $idLiquidacion;
        $data["usu_ideregistro"] = $this->sesion->get("idusuario");
        return $this->insertar($data, "lius_liquso", "sq_lius_ideregistr");
    }

    /**
     * Actualiza un tipo de uso para una liquidacion
     * @param array $tipoUso informacion del tipo de uso
     * @return int numero de filas afectadas
     */
    public function actualizarTiposUsosLiquidacion($tipoUso) {
        $data["uni_tipusosuscr"] = $tipoUso["idtipouso"];
        $data["lius_ideregistr"] = $tipoUso["idregistrotipouso"];
        $data["usu_ideregistro"] = $this->sesion->get("idusuario");
        return $this->actualizar($data, "lius_liquso", "lius_ideregistr = :lius_ideregistr");
    }

    /**
     * Crea una liquidacion especial para la nueva liquidacion 
     * @param array $liquidacionEspecial informacion de la liquidacion especial
     * @param int $usuario id del usuario
     * @param int $idLiquidacion id de la liquidacion
     * @return int id de la liquidacion especial
     */
    public function insertarLiquidacionEspecial($liquidacionEspecial, $usuario, $idLiquidacion) {
        if (!empty($liquidacionEspecial["valorlimite"])) {
            $data["lies_vlrlimite"] = $liquidacionEspecial["valorlimite"];
        }
        if (!empty($liquidacionEspecial["idmunicipio"])) {
            $data["uni_municipio"] = $liquidacionEspecial["idmunicipio"];
        }
        if (!empty($liquidacionEspecial["idbarrio"])) {
            $data["uni_barrio"] = $liquidacionEspecial["idbarrio"];
        }
        if (!empty($liquidacionEspecial["estrato"])) {
            $data["pro_catestrato"] = $liquidacionEspecial["estrato"];
        }
        if (!empty($liquidacionEspecial["idtipouso"])) {
            $data["uni_tipusosuscr"] = $liquidacionEspecial["idtipouso"];
        }
        if (!empty($liquidacionEspecial["idsuscripcion"])) {
            $data["dsus_ideregistr"] = $liquidacionEspecial["idsuscripcion"];
        }
        if (!empty($idLiquidacion)) {
            $data["uni_liquidacion"] = $idLiquidacion;
        }
        $data["usu_ideregistro"] = $usuario;
        return $this->insertar($data, "lies_liqespecial", "sq_lies_ideregistr");
    }

    /**
     * Actualiza los valores de la liquidacion especial de una liquidacion 
     * parametrizada
     * @param array $liquidacionEspecial informacion de la liquidacion especial
     * @return int numero de filas afectadas
     */
    public function actualizarLiquidacionEspecial($liquidacionEspecial) {
        if (!empty($liquidacionEspecial["idregistroliquidacionespecial"])) {
            $data["lies_ideregistr"] = $liquidacionEspecial["idregistroliquidacionespecial"];
        }
        if (!empty($liquidacionEspecial["valorlimite"])) {
            $data["lies_vlrlimite"] = $liquidacionEspecial["valorlimite"];
        }
        if (!empty($liquidacionEspecial["codmunicipio"])) {
            $data["uni_municipio"] = $liquidacionEspecial["codmunicipio"];
        }
        if (!empty($liquidacionEspecial["codbarrio"])) {
            $data["uni_barrio"] = $liquidacionEspecial["codbarrio"];
        }
        if (!empty($liquidacionEspecial["estrato"])) {
            $data["pro_catestrato"] = $liquidacionEspecial["estrato"];
        }
        if (!empty($liquidacionEspecial["codtipouso"])) {
            $data["uni_tipusosuscr"] = $liquidacionEspecial["codtipouso"];
        }
        if (!empty($liquidacionEspecial["codsuscripcion"])) {
            $data["dsus_ideregistr"] = $liquidacionEspecial["codsuscripcion"];
        }
        $data["usu_ideregistro"] = $this->sesion->get("idusuario");
        return $this->actualizar($data, "lies_liqespecial", "lies_ideregistr = :lies_ideregistr");
    }

    /**
     * Consulta una liquidacion segun el id de la liquidacion
     * @param int $idLiquidacion id de la liquidacion
     * @return array informacion de la liquidacion
     */
    public function consultarLiquidacion($idLiquidacion, $datos) {
        $parametros = array();
        $parametros["uni_liquidacion"] = $idLiquidacion;
        $parametros["idempresa"] = $datos["idempresa"];
        $parametros["idusuario"] = $datos['idusuario'];
        $parametros["idprograma"] = $datos["idprograma"];
        $sql = "SELECT
                liq.uni_liquidacion idliquidacion,
                liq.est_liquidacion idestructura,
                liq.liq_nombre nombreliquidacion,
                liq.uni_documento iddocumento,
                liq.uni_tipdocument idtipdocumento,
                liq.liq_inivigencia inivigencia,
                liq.liq_finvigencia finvigencia,
                liq.liq_venclasific clasificacion,
                liq.liq_estado estado,
                liq.liq_historico historico,
                liq.liq_diavencim diavencimiento,
                liq.liq_diasuspens diasuspension,
                liq.liq_tipcuota tipocuota,
                liq.usu_ideregistro idusuario,
                liq.liq_ctrventas controlventas
            FROM
                liq_liquidacion liq
                INNER JOIN est_estructura est ON liq.est_liquidacion = est.est_ideregistro
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = est.est_ideregistro
                INNER JOIN prun_prgunidad prun on prun.uni_ideregistro = liq.uni_liquidacion
                INNER JOIN uspu_usuprgunid uspu ON uspu.prun_ideregistr = prun.prun_ideregistr
            WHERE
                esem.emp_ideregistro = :idempresa  AND prun.prg_ideregistro = :idprograma AND uspu.usu_ideregistro = :idusuario
                AND liq.uni_liquidacion = :uni_liquidacion" ;
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * consulta los conceptos segun el id de la liquidacion a la cual pertenecen
     * @param int $idLiquidacion id de la liquidacion
     * @return array informacion de concepto de liquidacion
     */
    public function consultarConceptosLiquidacion($idLiquidacion) {
        $parametros["uni_liquidacion"] = $idLiquidacion;
        $sql = "SELECT
                    coli.coli_ideregistr idregistroconcepto,
                    coli.uni_concepto idconcepto,
                    con.con_nombre concepto,
                    coli.coli_imprimir imprimir
                FROM
                    coli_conliquida coli INNER JOIN con_concepto con ON coli.uni_concepto = con.uni_concepto
                WHERE
                    coli.uni_liquidacion = :uni_liquidacion";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta en la base de datos, la informacion de municipios para una 
     * @param int $idLiquidacion id de la liquidacion
     * @return array informacion de municipos de una liquidacion
     */
    public function consultarMunicipiosLiquidacion($idLiquidacion, $parametros) {
        $parametros["idliquidacion"] = $idLiquidacion;
        $sql = "SELECT
                        limu.limu_ideregistr idregistromunicipio,
                        limu.uni_municipio idmunicipio,
                        pry.proyecto_nom municipio
                FROM
                        limu_liqmunicipio limu
                INNER JOIN proyectos pry ON limu.uni_municipio = pry.proyecto_ideregistro
                INNER JOIN uspr_usuprgpryto uspr ON pry.proyecto_ideregistro = uspr.uni_municipio
                INNER JOIN empresas emp ON pry.proyecto_codemp = emp.empresa_cod
                WHERE
                        limu.uni_liquidacion =:idliquidacion
                AND emp.empresa_sevemp =:idempresa
                AND uspr.usu_ideregistro =:idusuario
                AND uspr.prg_ideregistro =:idprograma";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta en la base de datos los tipos de uso pertenecientes a una 
     * liquidacion
     * @param int $idLiquidacion id de la liquidacion
     * @return array tipos de uso de la liquidacion
     */
    public function consultarTiposUsosLiquidacion($idLiquidacion) {
        $parametros["uni_liquidacion"] = $idLiquidacion;
        $sql = "SELECT
                    lius.lius_ideregistr idregistrotipouso,
                    lius.uni_tipusosuscr idtipouso,
                    uni.uni_nombre1 tipouso
                FROM
                    lius_liquso lius
                INNER JOIN uni_unidad uni ON lius.uni_tipusosuscr = uni.uni_ideregistro
                WHERE 
                    lius.uni_liquidacion = :uni_liquidacion";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta la informacion de una liquidacion especial
     * @param int $idLiquidacion id de la liquidacion
     * @return array informacion de la liquidacion especial
     */
    public function consultarLiquidacionesEspeciales($idLiquidacion, $parametros) {
        $parametros["uni_liquidacion"] = $idLiquidacion;
        $sql = "SELECT
                    lies.lies_ideregistr idregistroliquidacionespecial,
                    lies.uni_municipio idmunicipio,
                    pry.proyecto_nom municipio,
                    lies.uni_barrio idbarrio,
                    barr.barrio_nom barrio,
                    lies.uni_tipusosuscr idtiposuso,
                    uni.uni_nombre1 tipouso,
                    lies.pro_catestrato estrato,
                    lies.lies_vlrlimite valorlimite,
                    lies.dsus_ideregistr idsuscripcion
                FROM
                    lies_liqespecial lies
                LEFT JOIN muba_munbarrio muba ON lies.uni_barrio = muba.uni_barrio
                LEFT JOIN barrios barr ON muba.uni_barrio = barr.barrio_ideregistro
                LEFT JOIN proyectos pry ON pry.proyecto_ideregistro = lies.uni_municipio
                INNER JOIN uspr_usuprgpryto uspr ON pry.proyecto_ideregistro = uspr.uni_municipio
                INNER JOIN empresas emp ON pry.proyecto_codemp = emp.empresa_cod
                LEFT JOIN uni_unidad uni ON uni.uni_ideregistro = lies.uni_tipusosuscr
                WHERE
                    lies.uni_liquidacion = :uni_liquidacion
                    AND emp.empresa_sevemp =:idempresa
                    AND uspr.usu_ideregistro =:idusuario
                    AND uspr.prg_ideregistro =:idprograma";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta si en la base de datos existe una suscripcion a la cual se le ha
     * asignado el concepto de una liquidacion
     * @param int $idLiquidacion id de la liquidacion
     * @param int $idConcepto id del concepto
     * @return array informacion del concepto
     */
    public function consultarConceptosCosu($idLiquidacion, $idConcepto) {
        $parametros["uni_liquidacion"] = $idLiquidacion;
        $parametros["uni_concepto"] = $idConcepto;
        $sql = "SELECT
                    cosu.cosu_ideregistr
                FROM
                    cosu_consuscrip cosu
                INNER JOIN dsus_detsuscrip dsus 
                ON cosu.dsus_ideregistr = dsus.dsus_ideregistr
                WHERE
                    cosu.uni_liquidacion = :uni_liquidacion
                AND cosu.uni_concepto = :uni_concepto";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consultar los conceptos que tiene una suscripcion con un id de
     * liquidacion
     * @param type $idLiquidacion id de la liquidacion
     * @param type $idConcepto id del concepto
     * @return array contiene el id de la suscripcion encontrada
     */
    public function consultarConceptosDsus($idLiquidacion, $idConcepto) {
        $parametros["uni_liquidacion"] = $idLiquidacion;
        $parametros["uni_concepto"] = $idConcepto;
        $sql = "SELECT
                    fac.dsus_ideregistr
                FROM
                    fac_factura fac
                INNER JOIN dfac_detfactura dfac 
                ON fac.fac_ideregistro = dfac.fac_ideregistro
                WHERE fac.uni_liquidacion = :uni_liquidacion 
                AND dfac.uni_concepto = :uni_concepto";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta si el municipio asignado a la liquidacion esta asignado a una
     * suscripcion
     * @param type $idLiquidacion id de la liquidacion
     * @param type $idMunicipio id del municipio
     * @return type
     */
    public function consultarMunicipiosDsus($idLiquidacion, $idMunicipio) {
        $parametros["uni_liquidacion"] = $idLiquidacion;
        $parametros["uni_municipio"] = $idMunicipio;
        $sql = "SELECT
                    dsus.dsus_ideregistr iddetallesuscripcion
                FROM
                    dsus_detsuscrip dsus
                WHERE
                    dsus.uni_liquidacion = :uni_liquidacion
                    AND dsus.uni_municipio = :uni_municipio";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta si el tipo de uso asignado a la liquidacion esta asignado a una
     * suscripcion
     * @param int $idLiquidacion id de la liquidacion
     * @param int $idTipoUso id del tipo de uso
     * @return array contiene el id de la suscripcion
     */
    public function consultarTipoUsosDsus($idLiquidacion, $idTipoUso) {
        $parametros["uni_liquidacion"] = $idLiquidacion;
        $parametros["uni_tipusosuscr"] = $idTipoUso;
        $sql = "SELECT
                    dsus.dsus_ideregistr iddetallesuscripcion
                FROM
                    dsus_detsuscrip dsus
                WHERE
                    dsus.uni_liquidacion = :uni_liquidacion
                    AND dsus.uni_tipusosuscr = :uni_tipusosuscr";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    //funciones para eliminar

    /**
     * Elimina un concepto de la liquidacion segun su id
     * @param int $idRegistro id del registro del concepto
     * @return int numero de filas afectadas
     */
    public function eliminarConceptos($idRegistro) {
        //$data["coli_ideregistr"] = "$idRegistro";
        return $this->eliminar("coli_conliquida", "coli_ideregistr = $idRegistro");
    }

    /**
     * Elimina un municipio de la liquidacion segun su id
     * @param int $idRegistro id del registro del municipio
     * @return int numero de filas afectadas
     */
    public function eliminarMunicipios($idRegistro) {
        //$data["limu_ideregistr"] = $idRegistro;
        return $this->eliminar("limu_liqmunicipio", "limu_ideregistr = $idRegistro");
    }

    /**
     * Elimina un tipo de uso de la liquidacion segun su id
     * @param int $idRegistro id del registro del tipo de uso
     * @return int numero de filas afectadas
     */
    public function eliminarTiposUsos($idRegistro) {
        //$data["lius_ideregistr"] = $idRegistro;
        return $this->eliminar("lius_liquso", "lius_ideregistr = $idRegistro");
    }

    /**
     * Elimina una liquidacion especial de la liquidacion segun su id
     * @param int $idRegistro id del registro de la liquidacion especial
     * @return int numero de filas afectadas
     */
    public function eliminarLiquidacionEspecial($idRegistro) {
        //$data["lius_ideregistr"] = $idRegistro;
        return $this->eliminar("lies_liqespecial", "lies_ideregistr = $idRegistro");
    }

    /**
     * Consulta por coincidencia de caracteres las liquidaciones existentes para
     * rellenar un autocomplete
     * @param string $liquidacion nombre de la liquidacion
     * @return array id y nombre de la liquidacion obtenida
     */
    public function liquidacionParametrizadaAutocomplete($liquidacion) {
        $parametros["codempresa"] = $this->sesion->get("idempresa");
        $parametros["idusuario"] = $this->sesion->get('idusuario');
        $parametros["liq_nombre"] = "%" . strtoupper($liquidacion) . "%";
        $parametros["idprograma"] = PROGRAMA_GESTIONAR_LIQUIDACION;
        $sql = "SELECT
                    liq.uni_liquidacion idliquidacion,
                    liq.liq_nombre liquidacion
                FROM
                    liq_liquidacion liq
                INNER JOIN est_estructura est ON liq.est_liquidacion = est.est_ideregistro
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = est.est_ideregistro
                INNER JOIN prun_prgunidad prun on prun.uni_ideregistro = liq.uni_liquidacion
		INNER JOIN uspu_usuprgunid uspu ON uspu.prun_ideregistr = prun.prun_ideregistr
                WHERE
                    esem.emp_ideregistro = :codempresa
                AND UPPER (liq.liq_nombre) LIKE :liq_nombre AND prun.prg_ideregistro =:idprograma AND uspu.usu_ideregistro = :idusuario";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta la informacion de una suscripcion por su id de suscripcion
     * documento del tercero o el codigo anterior de la suscripcion y por el 
     * municipio al cual pertenece dicha suscripcion
     * @param array $parametros parametros de busqueda de la suscripcion
     * @return array informacion de la suscripcion
     * @throws MyException
     */
    public function getSuscripcion(array $parametros) {
        $complemento = "";
        if ((!empty($parametros["idsuscripcion"])) && $parametros["idsuscripcion"] != -1) {
            $complemento.="and dsus.dsus_ideregistr=:idsuscripcion ";
        }
        if (!empty($parametros["cedula"])) {
            $complemento .="and ter.ter_documento=:cedula ";
        }
        if (!empty($parametros["codigoanterior"])) {
            $complemento .="and dsus.dsus_pcodigo=:codigoanterior ";
        }
        if (!empty($parametros["codigosmunicipios"])) {
            $municipios = $parametros["codigosmunicipios"];
            $complemento .= "and pro.uni_municipio in ($municipios) ";
        }
        $parametros["idusuario"] = $this->sesion->get("idusuario");
        $sql = "SELECT DISTINCT
                    ter.ter_documento documentotercero,
                    ter.ter_ideregistro idtercero,
                    ter.ter_nomcompleto nombretercero,
                    dsus.dsus_ideregistr idsuscripcion,
                    dsus.dsus_pcodigo codigoanterior,
                    pro.pro_direccion direccion,
                    pro.pro_idepropieda numeropropiedad,
                    pro.pro_descripcion descripcionpropiedad,
                    ter.ter_documento cedula,
                    pro.pro_numcatastral numerocatastral,
                    rut.rut_nombre ruta,
                    rut.rut_ideregistro idruta,
                    cnre.cnre_ideregistr idconvenio,
                    cnre.cnre_nombre convenio,
                    dsus.pro_catestrato estrato,
                    dsus.uni_tipsuscripc idtiposuscripcion,
                    dsus.sus_ideregistro idsuscriptor,
                    dsus.uni_tipusosuscr idtipousosuscripcion,
                    dsus.dsus_descripcion tiposuscripcion,
                    est.est_nombre tipousosuscripcion,
                    ter.ter_telfijo telefonofijo,
                    ter.ter_telcelular telefonocelular,
                    barrio.barrio_nom barrio,
                    ter.ter_correo correo,
                    municipio.proyecto_nom municipio,
                    dsus.emp_ideregistro idempresa,
                    ciu.ciudad_nom lugarexpedicion,
                    dsus.uni_municipio idmunicipio,
                    dsus.uni_liquidacion idliquidacion,
                    dsus.uni_barrio idbarrio
                FROM
                    dsus_detsuscrip dsus
                INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro = pro.pro_ideregistro
                INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
                INNER JOIN rusu_rutsuscrip rusu ON rusu.dsus_ideregistr = dsus.dsus_ideregistr
                INNER JOIN rut_ruta rut ON rusu.rut_ideregistro = rut.rut_ideregistro
                INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro = dsus.sus_ideregistro
                INNER JOIN cnre_cnvrecaudo cnre ON sus.cnre_ideregistr = cnre.cnre_ideregistr
                INNER JOIN barrios barrio ON barrio.barrio_ideregistro = pro.uni_barrio
                INNER JOIN proyectos municipio ON municipio.proyecto_ideregistro = pro.uni_municipio
                INNER JOIN est_estructura est ON dsus.uni_tipusosuscr = est.est_ideregistro
                LEFT JOIN ciudades ciu ON ter.ciudad_cod = ciu.ciudad_cod
                WHERE pro.uni_municipio IN (SELECT DISTINCT uspr.uni_municipio FROM uspr_usuprgpryto uspr WHERE uspr.usu_ideregistro = :idusuario) $complemento";

        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException("No se encontró la suscripción", 0);
        }
        return $resultado;
    }

    /**
     * Consulta los municipios que tiene el usuario asignado para el programa de
     * gestionar liquidacion para ser empleados en la busqueda de suscripciones
     * @return array id y nombre de los municipios obtenidos
     */
    public function municipioPerUsuario() {
        $parametros["codempresa"] = $this->sesion->get("idempresa");
        $parametros["codusuario"] = $this->sesion->get("idusuario");
        $parametros["idprograma"] = PROGRAMA_GESTIONAR_LIQUIDACION;
        $sql = "SELECT
                    pry.proyecto_ideregistro idMunicipio, pry.proyecto_nom municipio
                FROM
                    proyectos pry
                INNER JOIN empresas emp ON emp.empresa_cod = pry.proyecto_codemp
                INNER JOIN uspr_usuprgpryto uspr ON uspr.uni_municipio = pry.proyecto_ideregistro
                WHERE
                    emp.empresa_sevemp = :codempresa
                AND uspr.usu_ideregistro = :codusuario
                AND uspr.prg_ideregistro = :idprograma";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

}
