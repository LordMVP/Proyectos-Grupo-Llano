<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Models;

/**
 * Description of UtilModel
 *
 * @author jpsierra
 */
class UtilModel extends ReportesDefaultModel {

    //put your code here
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    public function consultarPeriodosCiclo($idCiclo) {

        $parametros["idCiclo"] = $idCiclo;
        $sql = "SELECT
                    per.per_ideregistro                          id_periodo,
                    EXTRACT(YEAR FROM per.per_fecinicial) ||'-'|| per.per_nombre periodo_nombre,
                    per.per_fecvence                             fecha_vencimiento,
                    per.per_fecsuspens                           fecha_suspension
                  FROM per_periodo per
                    INNER JOIN cic_ciclo cic ON per.cic_ideregistro = cic.cic_ideregistro
                  WHERE per.cic_ideregistro = :idCiclo AND per.per_estado in ('C','A')
                  ORDER BY per.per_ideregistro";
        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
    }

    public function consultarPeriodosUnicosCiclo($idCiclo) {
        $parametros["idciclo"] = $idCiclo;
        $sql = "SELECT DISTINCT  per.per_ideorden idorden, per.per_nombre  nomber
                FROM per_periodo per
                INNER JOIN cic_ciclo cic  ON cic.cic_ideregistro = per.cic_ideregistro
                WHERE cic.cic_estado = 'A' AND cic.cic_ideregistro =:idciclo
                ORDER BY per.per_ideorden;";
        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
    }

    public function consultarPeriodosCicloAno($idCiclo, $anos) {
        $parametros["idciclo"] = $idCiclo;
        $parametros["ano"] = $anos;
        $sql = "SELECT per.per_ideregistro idperiodo , per.per_nombre nombre FROM cic_ciclo cic 
        INNER JOIN per_periodo per ON cic.cic_ideregistro  = per.cic_ideregistro
        WHERE cic.cic_ideregistro =:idciclo AND cic.cic_anoactual =:ano;";
        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
    }
    public function consultarPeriodosAno($anos, $empresa) {
        $parametros["ano"] = $anos;
        $parametros["empresa"] = $empresa;
        $sql = "SELECT DISTINCT per.per_ideorden idorden , per.per_nombre nombre 
                FROM per_periodo per 
                INNER JOIN dsus_detsuscrip dsuss on dsuss.cic_ideregistro = per.cic_ideregistro
                WHERE dsuss.emp_ideregistro =:empresa
                ORDER BY idorden ; ";
        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
    }

    public function periodos() {
        $sql = "SELECT DISTINCT per.per_ideorden idorden , per.per_nombre nombre
        FROM   per_periodo per 
	INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = per.cic_ideregistro 
	WHERE cic.cic_estado = 'A' AND cic.cic_periodos = 1
	ORDER BY per.per_ideorden;";
        return $this->executeQuery($sql);
    }

    public function periodosPorAno($anno, $idempresa) {
        $parametros["idempresa"] = $idempresa;
        $parametros["anno"] = $anno;
        $sql = "SELECT DISTINCT
                    per.per_ideorden idorden,
                    per.per_nombre || ' ' || EXTRACT(YEAR FROM per.per_fecfinal) nombre
                  FROM per_periodo per
                    INNER JOIN cic_ciclo cic ON per.cic_ideregistro = cic.cic_ideregistro
                    INNER JOIN ciem_cicempresa ciem ON cic.cic_ideregistro = ciem.cic_ideregistro
                  WHERE EXTRACT(YEAR FROM per.per_fecinicial) = :anno AND cic.cic_estado = 'A' AND ciem.emp_ideregistro = :idempresa
                  ORDER BY per.per_ideorden;
";
        return $this->executeQuery($sql, $parametros);
    }
    
    public function periodosPorAnoCicloGeneral($anno, $idempresa) {
        $parametros["idempresa"] = $idempresa;
        $parametros["anno"] = $anno;
        $sql = "SELECT DISTINCT
                    per.per_ideorden idorden,
                    per.per_nombre || ' ' || EXTRACT(YEAR FROM per.per_fecfinal) nombre
                  FROM per_periodo per
                    INNER JOIN cic_ciclo cic ON per.cic_ideregistro = cic.cic_ideregistro
                    INNER JOIN ciem_cicempresa ciem ON cic.cic_ideregistro = ciem.cic_ideregistro
                  WHERE EXTRACT(YEAR FROM per.per_fecinicial) = :anno AND cic.cic_estado = 'A' AND ciem.emp_ideregistro = :idempresa
                  AND cic.cic_ideregistro=38
                  ORDER BY per.per_ideorden;
";
        return $this->executeQuery($sql, $parametros);
    }

    public function periodosPorAnoCicloAce($anno, $idempresa) {
        $parametros["idempresa"] = $idempresa;
        $parametros["anno"] = $anno;
        $sql = "SELECT DISTINCT
                    per.per_ideorden idorden,
                    per.per_nombre || ' ' || EXTRACT(YEAR FROM per.per_fecfinal) nombre
                  FROM per_periodo per
                    INNER JOIN cic_ciclo cic ON per.cic_ideregistro = cic.cic_ideregistro
                    INNER JOIN ciem_cicempresa ciem ON cic.cic_ideregistro = ciem.cic_ideregistro
                  WHERE EXTRACT(YEAR FROM per.per_fecinicial) = :anno AND cic.cic_estado = 'A' AND ciem.emp_ideregistro = :idempresa
                  AND cic.cic_ideregistro in (44,168)
                  ORDER BY per.per_ideorden;
";
        return $this->executeQuery($sql, $parametros);
    }
    
    public function listarAnos() {
        $sql = "SELECT to_char (now() - (interval '1' YEAR * generate_series(0,2)), 'yyyy') anos";
        return $this->executeQuery($sql);
    }

    public function consultarLiquidacionesFacturadas($idorden, $ano, $idempresa) {
        $parametros["idempresa"] = $idempresa;
        $parametros["anos"] = $ano;
        $parametros["idorden"] = $idorden;
        $sql = "SELECT DISTINCT liq.uni_liquidacion idliquidacion , liq.liq_nombre nombre
        FROM fac_factura fac 
       INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = fac.cic_ideregistro 
       INNER JOIN ciem_cicempresa ciem ON ciem.cic_ideregistro = cic.cic_ideregistro
       INNER JOIN per_periodo per ON per.cic_ideregistro = cic.cic_ideregistro
       INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion  = fac.uni_liquidacion
       WHERE ciem.emp_ideregistro =:idempresa AND cic.cic_anoactual =:anos AND per.per_ideorden =:idorden ";
        return $this->executeQuery($sql, $parametros);
    }

    public function consultarTiposInstalacion() {
        $sql = "SELECT uni_ideregistro,uni_nombre1 FROM uni_unidad WHERE uni_ideregistro IN (5,6,7)";
        return $this->executeQuery($sql);
    }

    public function consultarCiclosEmpresa($idEmpresa) {
        $sql = "SELECT  cic.* "
                . "FROM cic_ciclo cic "
                . "INNER JOIN ciem_cicempresa ciem ON ciem.cic_ideregistro = cic.cic_ideregistro "
                . "WHERE cic.cic_estado = 'A' AND ciem.emp_ideregistro = :idEmpresa";
        $paramentros = array('idEmpresa' => $idEmpresa);
        return $this->executeQuery($sql, $paramentros);
    }

    public function consultarCicloPrograma($idPrograma) {
        $sql = "SELECT cic.cic_ideregistro as ciclo,cic.cic_nombre as ciclo_nombre,
                        per.per_ideregistro as periodo,per.per_nombre as periodo_nombre, 
                        per.per_fecinicial as periodo_fecinicial,per.per_fecfinal as periodo_fecfinal,
                        cic.cic_anoactual as anno 
                    FROM cic_ciclo cic 
                    INNER JOIN per_periodo per ON per.cic_ideregistro = cic.cic_ideregistro 
                    INNER JOIN cipr_cicprograma cipr ON cic.cic_ideregistro = cipr.cic_ideregistro
                    WHERE cic.cic_ideregistro = 31 AND per.per_estado = 'A' AND cipr.prg_ideregistro = :idPrograma";
        $parametros['idPrograma'] = $idPrograma;
        return $this->executeQuery($sql, $parametros);
    }

    public function consultarSuscriptoresNombre($nombre, $limit = 10) {

        $sql = "SELECT 
                    sus.sus_ideregistro AS suscriptor_id,
                    sus.sus_descripcion AS suscriptor_descripcion,
                    ter.ter_ideregistro AS tercero_id,
                    ter.ter_documento AS tercero_documento,
                    ter.ter_nomcompleto AS tercero_nombre,
                    ter.ter_telcelular AS tercero_telefono_celular,
                    ter.ter_telfijo AS tercero_telefono_fijo,
                    uni.uni_nombre1 AS tercero_tipo
                FROM sus_suscripcion sus
                INNER JOIN ter_tercero ter ON ter.ter_ideregistro = sus.ter_ideregistro
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = ter.uni_tiptercero
                WHERE ter_nomcompleto ILIKE :nombre"
                . " LIMIT $limit";
        $parametros['nombre'] = "%" . $nombre . "%";
        return $this->executeQuery($sql, $parametros);
    }

    public function consultarConstructoras($nombre, $limit = 10) {
        return $this->consultarTerceroNombreClase($nombre, UNIDAD_TERCEROS_CONSTRUCTORAS, $limit);
    }

    public function consultarTerceroNombreClase($nombre, $claseTercero, $limit = 10) {

        $sql = "SELECT DISTINCT
                    ter.ter_ideregistro AS id,
                    ter.ter_nomcompleto AS label,
                    ter.ter_documento AS value,
                    ter.ter_ideregistro AS tercero_id,
                    ter.ter_documento AS tercero_documento,
                    ter.ter_nomcompleto AS tercero_nombre,
                    ter.ter_telcelular AS tercero_telefono_celular,
                    ter.ter_telfijo AS tercero_telefono_fijo,
                    uni.uni_nombre1 AS tercero_tipo
                FROM sus_suscripcion sus
                INNER JOIN ter_tercero ter ON ter.ter_ideregistro = sus.ter_ideregistro
                INNER JOIN clte_clatercero clte ON ter.ter_ideregistro = clte.ter_ideregistro
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = ter.uni_tiptercero
                WHERE ter.ter_nomcompleto ILIKE :nombre AND clte.uni_clatercero= :claseTercero OR ter.ter_ideregistro::text LIKE :nombre"
                . " LIMIT $limit";
        $parametros['nombre'] = "%" . $nombre . "%";
        $parametros['claseTercero'] = $claseTercero;
        return $this->executeQuery($sql, $parametros);
    }

    public function consultarPeriodosCicloEstado($ciclo, $cicloAnno = 2014, $periodoEstado = 'A') {
        $parametros['ciclo'] = $ciclo;
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
                WHERE
                    per.per_estado = 'A' and cic.cic_ideregistro=:idciclo";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error al consultar el ciclo ' . $ciclo, -1);
        }
        return $resultado;
    }

    public function consultarNovedadesLecturas() {
        $sql = "SELECT uni.uni_ideregistro AS novedad_id,"
                . "uni.uni_nombre1 AS novedad_nombre "
                . "FROM uni_unidad uni "
                . "WHERE uni.est_ideregistro = 11";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function consultarTiposUso() {
        $sql = "SELECT uni.uni_ideregistro AS tipo_uso_id,"
                . "uni.uni_nombre1 AS tipo_uso_nombre "
                . "FROM uni_unidad uni "
                . "WHERE est_ideregistro = 2";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function consultarTiposUsoIndustiralComercial() {
        $sql = "SELECT uni.uni_ideregistro idtipouso,"
                . " uni.uni_nombre1 tipouso"
                . " FROM uni_unidad uni "
                . " WHERE est_ideregistro = 2"
                . " AND uni_codigo1 in('INDU','COME')";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    private function consultarPorEstructura($estructura) {
        $sql = "SELECT uni.uni_ideregistro AS uni_id,"
                . "uni.uni_nombre1 AS uni_nombre "
                . "FROM uni_unidad uni "
                . "WHERE est_ideregistro = :estructura";
        $resultado = $this->executeQuery($sql, ["estructura" => $estructura]);
        return $resultado;
    }

    public function consultarMotivosSuspension() {
        $sql = "SELECT mosu.uni_motsuspen AS uni_id,"
                . "mosu.mosu_nombre AS uni_nombre "
                . "FROM mosu_motsuspen mosu ";

        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function consultarMotivosReconexion() {
        $sql = "SELECT morx.uni_motreconex AS uni_id,"
                . "morx.morx_nombre AS uni_nombre "
                . "FROM morx_motreconex morx ";

        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function consultarTiposSuspension() {
        return $this->consultarPorEstructura(16);
    }

    public function consultarNovedadesSuspension() {
        return $this->consultarPorEstructura(13);
    }

    public function consultarNovedadesReconexion() {
        return $this->consultarPorEstructura(14);
    }

    public function consultarProyectos() {
        $sql = "SELECT proy.proyecto_ideregistro AS proyecto_id,
                       proy.proyecto_nom AS proyecto_nombre "
                . "FROM proyectos proy "
                . "WHERE est_ideregistro = 2";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function consultarLiquidaciones() {
        $sql = "SELECT uni_liquidacion AS id,liq_nombre as label FROM liq_liquidacion WHERE liq_estado = 'A'";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function consultarConceptosLiquidacion($liquidacion) {

        $sql = "SELECT 
                    con.uni_concepto AS id,
                    con.con_nombre AS label
                FROM core_conrelacio core
                INNER JOIN coli_conliquida coli ON coli.uni_concepto = core.uni_concepto
                INNER JOIN con_concepto con ON con.uni_concepto = core.uni_conrelacion
                WHERE coli.uni_liquidacion = $liquidacion AND con.con_operacion = 'S' AND con.con_intfinanciacion = 'N' AND coli.coli_imprimir = 'S'";

        /* $sql = "SELECT 
          con.uni_concepto AS id,
          con.con_nombre AS label
          FROM con_concepto con
          INNER JOIN coli_conliquida coli ON coli.uni_concepto = con.uni_concepto
          WHERE con.con_operacion = 'S' AND coli.uni_liquidacion = $liquidacion AND con.con_intfinanciacion = 'N' AND coli.coli_imprimir = 'S'"; */
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function consultarConceptosLiquidacionInteres($liquidacion) {
        $sql = "SELECT 
                    con.uni_concepto AS id,
                    con.con_nombre AS label 
                FROM con_concepto con 
                INNER JOIN coli_conliquida coli ON coli.uni_concepto = con.uni_concepto
                WHERE coli.uni_liquidacion = $liquidacion AND con.con_intfinanciacion = 'S'";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function consultarMediosPago($idUsuario) {
        $sql = "SELECT usmp.uni_medpago AS medio_pago_id,uni.uni_nombre1 AS medio_pago_nombre 
                    FROM usmp_usumedpago usmp
                    INNER JOIN uni_unidad uni ON uni.uni_ideregistro = usmp.uni_medpago
                    WHERE usmp.usu_ideregistro = :idUsuario";
        $parametros = array("idUsuario" => $idUsuario);
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function consultarCajeros() {
        $sql = "SELECT 
                    usu.usu_ideregistro AS cajero_id,
                    usu.usuario_nom AS cajero_nombre,
                    car.cargo_nom AS cajero_cargo   
                FROM usuarios usu
                INNER JOIN cargos car ON car.cargo_cod = usu.usuario_codcar
                ORDER BY cajero_nombre ASC
                ";
        return $this->executeQuery($sql);
    }

    public function consultarCajeroMedPago(array $parametros) {

        $sql = "SELECT
	usu.usu_ideregistro AS cajero_id,
	usu.usuario_nom AS cajero_nombre,
	car.cargo_nom AS cajero_cargo 
FROM
	usuarios usu
	INNER JOIN usmp_usumedpago usmp ON usmp.usu_ideregistro = usu.usu_ideregistro
	inner join usem_usuempresa usem on usem.usu_ideregistro = usu.usu_ideregistro
	INNER JOIN empresas empp ON empp.empresa_cod = usuario_codemp
	LEFT JOIN cargos car ON car.cargo_cod = usu.usuario_codcar 
WHERE
	usmp.uni_medpago = :uni_metpago 
	AND empresa_sevemp = :emp_codsev 
	--and (cargo_codemp = usuario_codemp  or empp.empresa_cod is null)
	and usem.emp_ideregistro = :emp_codsev
	AND usu.usuario_swtact = 'TRUE' 
ORDER BY
	cajero_nombre ASC
                ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function consultarCajerosActivos($codsevemp) {
        $sql = "SELECT 
                    usu.usu_ideregistro idcajero,
                    usu.usuario_nom nombrecajero
                FROM usuarios usu
                    INNER JOIN rec_recaudo rec ON rec.usu_ideregistro = usu.usu_ideregistro
                WHERE rec.emp_ideregistro =:idEmpresa
                GROUP BY idcajero , nombrecajero 
		ORDER BY nombrecajero;";
        $parametros = array("idEmpresa" => $codsevemp);
        return $this->executeQuery($sql, $parametros);
    }

    public function consultarTipoOperacion($idUsuario) {

        // $parametros["usuario"] = 288;
        $sql = "SELECT
                usto.usu_ideregistro,
                top.top_ideregistro as idoperacion,
                top.top_nombre as tipo
                FROM usto_usutipopera usto
                INNER JOIN top_tipoperacion top ON usto.top_ideregistro=top.top_ideregistro
                WHERE usto.usu_ideregistro=:idUsuario
                ORDER BY tipo ASC";
        $parametros = array("idUsuario" => $idUsuario);
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
        //return $this->executeQuery($sql);
    }

    public function consultarNovedadLectura() {

        // $parametros["usuario"] = 288;
        $sql = "SELECT
                uni_anolectura as idanolectura,
                anle_nombre as nombre,
                anle_afelectura as afel,
                est_anolectura as est,
                anle_afecalculo as afecal,
                usu_ideregistro as ususario
                FROM anle_anolectura";
        //$parametros = array("idUsuario"=>$idUsuario);
        $resultado = $this->executeQuery($sql);
        return $resultado;
        //return $this->executeQuery($sql);
    }

    public function consultarProyecto() {
        $sql = "SELECT proy.proyecto_ideregistro AS proyecto_id,
        proy.proyecto_nom AS proyecto_nombre 
        FROM proyectos proy 
        where proy.proyecto_codemp='8000212729' AND proy.proyecto_ideregistro!=27
        AND proy.proyecto_ideregistro NOT IN (28,29)
        ORDER BY proyecto_nombre ASC";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }
    
    public function mostrarProyectos($empresa) {
        $sql = "SELECT proy.proyecto_ideregistro AS proyecto_id,
        proy.proyecto_nom AS proyecto_nombre 
        FROM proyectos proy 
	INNER JOIN empresas emp ON emp.empresa_sevemp=:empresa
        where proy.proyecto_codemp=emp.empresa_cod
        AND proy.proyecto_ideregistro NOT IN (27,28,29)
        ORDER BY proyecto_nombre ASC";
        $parametros = array("empresa" => $empresa);
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function consultarLiquidacionesVentas() {
        $sql = "SELECT uni_liquidacion AS id,liq_nombre as label FROM liq_liquidacion WHERE liq_estado = 'A' AND liq_venclasific in ('VE','CA','CO') AND liq_nombre LIKE '%Ventas%'";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function consultarMediosPagoCaja($idUsuario) {
        $sql = "SELECT usmp.uni_medpago AS medio_pago_id,uni.uni_nombre1 AS medio_pago_nombre 
                    FROM usmp_usumedpago usmp
                    INNER JOIN uni_unidad uni ON uni.uni_ideregistro = usmp.uni_medpago
                    WHERE usmp.usu_ideregistro = :idUsuario AND uni.uni_ideregistro=80";
        $parametros = array("idUsuario" => $idUsuario);
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function consultarDocumentosPostventa() {
        $sql = "SELECT doc.uni_documento as id,doc.doc_nombre as label FROM doc_documento doc WHERE doc.doc_tipo='VE'";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function buscarTerceroDocumento($search, $limit = 1) {
        $sql = "SELECT 
                    sus.sus_ideregistro AS suscriptor_id,
                    sus.sus_descripcion AS suscriptor_descripcion,
                    ter.ter_ideregistro AS tercero_id,
                    ter.ter_documento AS tercero_documento,
                    ter.ter_nomcompleto AS tercero_nombre,
                    ter.ter_telcelular AS tercero_telefono_celular,
                    ter.ter_telfijo AS tercero_telefono_fijo,
                    uni.uni_nombre1 AS tercero_tipo
                FROM sus_suscripcion sus
                INNER JOIN ter_tercero ter ON ter.ter_ideregistro = sus.ter_ideregistro
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = ter.uni_tiptercero
                WHERE ter.ter_documento = :documento"
                . " LIMIT $limit";
        $parametros['documento'] = "%" . $search . "%";
        return $this->executeQuery($sql, $parametros);
    }

    public function terceroInfo($tercero) {
        $sql = "SELECT 
                    utuso.uni_nombre1 AS tipo_uso,
                    COUNT(DISTINCT dsus.dsus_ideregistr) AS numero_suscripciones
                FROM ter_tercero ter
                    INNER JOIN dsus_detsuscrip dsus ON dsus.ter_ideregistro = ter.ter_ideregistro
                    INNER JOIN uni_unidad utuso ON utuso.uni_ideregistro = dsus.uni_tipusosuscr
                WHERE ter.ter_ideregistro = :tercero
                GROUP BY utuso.uni_nombre1";
        $parametros['tercero'] = $tercero;
        $result['tiposUso'] = $this->executeQuery($sql, $parametros);

        $sql = "SELECT 
                    cic.cic_nombre,
                    cic.cic_ideregistro,
                    cic.cic_diafinaliza,
                    COUNT(DISTINCT dsus.dsus_ideregistr) AS numero_suscripciones
                FROM ter_tercero ter
                INNER JOIN dsus_detsuscrip dsus ON dsus.ter_ideregistro = ter.ter_ideregistro
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = dsus.cic_ideregistro
                WHERE ter.ter_ideregistro = :tercero
                GROUP BY cic.cic_nombre,cic.cic_ideregistro,cic.cic_diafinaliza";

        $parametros['tercero'] = $tercero;
        $result['ciclos'] = $this->executeQuery($sql, $parametros);
        return $result;
    }

    public function consultarTercerosInfo($search, $tipo, $limit = 10) {
        $condicion = "1=1";
        $parametros['search'] = $search;
        if ($tipo === "2") {
            $condicion = "ter_nomcompleto ILIKE :search";
            $search = "%" . $search . "%";
        } else if ($tipo === "1") {
            $sql = "SELECT dsus.ter_ideregistro FROM dsus_detsuscrip dsus WHERE dsus.dsus_pcodigo ILIKE '%$search%' OR dsus.dsus_ideregistr = :search";
            $ter_id = $this->executeQuery($sql, $parametros);
            if ($ter_id != null) {
                $condicion = "ter.ter_ideregistro = " . $ter_id[0]['ter_ideregistro'];
            } else {
                return null;
            }
        }

        $sql = "SELECT
            ter.ter_ideregistro AS tercero_id,
            MAX (ter.ter_documento) AS tercero_documento,
            MAX (ter.ter_nomcompleto) AS tercero_nombre,
            MAX (ter.ter_telcelular) AS tercero_telefono_celular,
            MAX (ter.ter_telfijo) AS tercero_telefono_fijo,
            MAX (uni.uni_nombre1) AS tercero_tipo,
            json_agg (ciclos) AS ciclos
        FROM
            ter_tercero ter
        INNER JOIN uni_unidad uni ON uni.uni_ideregistro = ter.uni_tiptercero
        INNER JOIN (
            SELECT
		ter.ter_ideregistro,
		cic.cic_ideregistro,
		cic.cic_nombre,
		json_agg (DISTINCT (utuso.uni_ideregistro,utuso.uni_nombre1)) AS tipo_usos,
		COUNT (dsus.dsus_ideregistr) AS numero_suscripciones
            FROM
		ter_tercero ter
                INNER JOIN dsus_detsuscrip dsus ON dsus.ter_ideregistro = ter.ter_ideregistro
                INNER JOIN uni_unidad utuso ON utuso.uni_ideregistro = dsus.uni_tipusosuscr
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = dsus.cic_ideregistro
            GROUP BY
		ter.ter_ideregistro,
		cic.cic_ideregistro
            ) AS ciclos ON ciclos.ter_ideregistro = ter.ter_ideregistro
        WHERE	$condicion GROUP BY ter.ter_ideregistro LIMIT $limit";

        $parametros['search'] = $search;

        return $this->executeQuery($sql, $parametros);
    }

    public function consultarLiquidacionesVentasMinas() {
        $sql = "SELECT uni_liquidacion AS id,liq_nombre as label FROM liq_liquidacion WHERE liq_estado = 'A' AND liq_venclasific in ('VE','CA','CO') AND liq_nombre LIKE '%Ventas%' AND uni_liquidacion=371";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function getMes($mes) {
        $MESES = array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
        return $MESES[$mes - 1];
    }

    public function consultarLiquidacionPostventa() {
        $sql = "SELECT liq.uni_liquidacion AS ide, liq.liq_nombre as nombre FROM liq_liquidacion liq WHERE liq.liq_venclasific='PV' ORDER BY liq.uni_liquidacion ASC";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function consultarPeriodos($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT DISTINCT
                        per_nombre periodo,
                        EXTRACT (MONTH FROM per_fecfinal) numerodemes
                FROM
                        per_periodo per
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = per.cic_ideregistro
                INNER JOIN ciem_cicempresa ciem on cic.cic_ideregistro = ciem.cic_ideregistro
                WHERE
                ciem.emp_ideregistro =:idempresa	
                AND cic.cic_anoactual = EXTRACT (YEAR FROM CURRENT_DATE)
                AND cic.cic_estado = 'A'
                ORDER BY
                        EXTRACT (MONTH FROM per_fecfinal);";
        return $this->executeQuery($sql, $parametros);
    }

    public function consultarCiclosAce() {
        $sql = " SELECT
                    cic.cic_ideregistro idciclo,
                    cic.cic_nombre ciclo	
            FROM
                    cic_ciclo cic
            INNER JOIN ciem_cicempresa ciem ON cic.cic_ideregistro = ciem.cic_ideregistro
            WHERE
                    ciem.emp_ideregistro = 300;";
        return $this->executeQuery($sql);
    }

    public function consultarEmv($idUsuario) {
        $sql = "SELECT
            CASE WHEN emv.doto_tipo='WSMC' THEN 'Movimiento Contable'
                             WHEN emv.doto_tipo='WSCD' THEN 'Recaudo Directo'
                             WHEN emv.doto_tipo='WSDC' THEN 'Consumo Directo'
                             WHEN emv.doto_tipo='WSNC' THEN 'Nota Caja'
                             END as nombre,
            emv.doto_tipo as tipo
            FROM emv_expmovimient emv
            INNER JOIN top_tipoperacion top ON top.top_ideregistro=emv.top_ideregistro
            INNER JOIN usto_usutipopera usto ON usto.top_ideregistro=top.top_ideregistro
            WHERE usto.usu_ideregistro=:idUsuario";
        $parametros = array("idUsuario" => $idUsuario);
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * permite consultar las empresas según la clase
     * @return result
     */
    public function consultarEmpresas() {
        $parametros['idclaseempresa'] = CLASE_EMPRESAS;
        $sql = "SELECT
                        clt.ter_ideregistro idtercero,
                        ter.ter_nomcompleto nombretercero,
                        ter.ter_documento documento
                FROM
                        clte_clatercero clt
                INNER JOIN ter_tercero ter ON clt.ter_ideregistro = ter.ter_ideregistro
                WHERE
                        clt.uni_clatercero =:idclaseempresa";
        return parent::executeQuery($sql, $parametros);
    }

    public function consultarRutas() {
        $sql = "SELECT
                rut.rut_ideregistro as ideruta,
                rut.rut_nombre as nombre
                from rut_ruta rut
                ORDER BY ideruta ASC";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function consultarRutasCiclo($ciclo) {
        $sql = "SELECT
                rut.rut_ideregistro as ideruta,
                rut.rut_nombre as nombre
                from rut_ruta rut
                WHERE rut.cic_ideregistro = :ciclo
                ORDER BY ideruta ASC";
        $parametros['ciclo'] = $ciclo;
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function consultarCajerosSolo(array $parametros) {
        $sql = "SELECT 
                    usu.usu_ideregistro AS cajero_id,
                    usu.usuario_nom AS cajero_nombre                 
                FROM usuarios usu
               INNER JOIN usmp_usumedpago usmp on usmp.usu_ideregistro = usu.usu_ideregistro
               INNER JOIN empresas empp on empp.empresa_cod = usuario_codemp                    
                WHERE usmp.uni_medpago =:uni_metpago and empresa_sevemp =:emp_codsev
                
                ORDER BY cajero_nombre ASC
                ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function consultarMotivoSupension() {

        $sql = "SELECT
                mosu.uni_motsuspen as idmotivo,
                mosu.mosu_nombre as nombre
                FROM mosu_motsuspen mosu
                ORDER BY mosu.uni_motsuspen ASC";
        return $this->executeQuery($sql);
    }

    public function consultarMotivoReconexion() {


        $sql = "SELECT
                morx.uni_motreconex as idmotivo,
                morx.morx_nombre as nombre
                FROM morx_motreconex morx
                ORDER BY morx.uni_motreconex ASC";
        return $this->executeQuery($sql);
    }

    /**
     * Funcion para la consulta de tipos de filtros para la suspension
     */
    public function consultarFiltroSuspension() {

        $sql = "SELECT
                uni_tipsuspen as idfiltro,
                tisu_nombre as nombre
                FROM tisu_tipsuspen
                ORDER BY nombre ASC";
        return $this->executeQuery($sql);
    }

    public function consultarMercado($idempresa) {
        $parametros["idempresa"] = $idempresa;
        $sql = "SELECT mer.mercado_cod idmercado, mer.mercado_nom nombre FROM mercados mer 
        INNER JOIN empresas emp ON emp.empresa_cod = mer.mercado_codemp
        WHERE emp.empresa_sevemp =:idempresa 
        ORDER BY mer.mercado_ordrep;";
        return $this->executeQuery($sql, $parametros);
    }

    public function consultarMediosPagoUsuarioEmpresa($idEmpresa, $idUsuario) {
        $parametros['idusuario'] = $idUsuario;
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT usmp.uni_medpago id, uni.uni_nombre1 nombre, mpa.mpa_tipo tipo 
        FROM  usmp_usumedpago usmp 
        INNER JOIN uni_unidad uni ON uni.uni_ideregistro=usmp.uni_medpago 
        INNER JOIN esem_estempresa esem ON esem.est_ideregistro=uni.est_ideregistro  
        INNER JOIN mpa_medpago mpa ON mpa.uni_medpago = usmp.uni_medpago  
        WHERE usmp.usu_ideregistro=:idusuario  and esem.emp_ideregistro=:idempresa
        ORDER BY uni.uni_nombre1";
        return $this->executeQuery($sql, $parametros);
    }

    public function consultarTipoUsoPorEmpresa($parametros) {
        $sql = " SELECT uni.uni_ideregistro idunidad, uni.uni_nombre1 nombre FROM uni_unidad  uni 
        INNER JOIN est_estructura est ON est.est_ideregistro = uni.est_ideregistro
        INNER JOIN esem_estempresa esem ON esem.est_ideregistro = est.est_ideregistro
        WHERE est.cla_ideregistro = :idclase AND esem.emp_ideregistro = :idempresa";
        return $this->executeQuery($sql, $parametros);
    }

    public function consultarCiclosGeneral() {
        $sql = "SELECT
                cic_ideregistro as idciclo,
                cic_nombre as ciclo
                FROM cic_ciclo
                WHERE cic_estado='A'
                ORDER BY cic_ideregistro ASC";
        //$parametros['ciclo'] = $ciclo;
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function consultarPeriodosActivos($idciclo) {

        $parametros["idciclo"] = $idciclo;
        $sql = "SELECT  per.per_ideregistro periodo,
                        per.per_nombre periodo_nombre,
                        per.per_fecvence fecha_vencimiento,
                        per.per_fecsuspens fecha_suspension
                        FROM per_periodo per 
                        WHERE per.cic_ideregistro = :idciclo
                        AND per.per_estado='A'
                        ORDER BY per.per_ideorden";
        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
    }

    public function consultarBancosGeneral() {
        $sql = "SELECT
                ter.ter_ideregistro as ide,
                ter.ter_nomcompleto as nombre
                FROM ter_tercero ter
                INNER JOIN clte_clatercero clte ON clte.ter_ideregistro=ter.ter_ideregistro
                WHERE clte.uni_clatercero=280";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function municipios_uspr_arqueo($usuario) {
        $parametros["usuario"] = $usuario;
        $sql = "SELECT
            proy.proyecto_ideregistro as idmunicipio,
            proy.proyecto_nom as municipio
            FROM uspr_usuprgpryto uspr
            INNER JOIN proyectos proy ON proy.proyecto_ideregistro=uspr.uni_municipio
            WHERE prg_ideregistro = 52 and usu_ideregistro =:usuario";
        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
    }

    public function consultarCiclosGeneralEmpresa($empresa, $programa) {
        $sql = "SELECT
                cic.cic_ideregistro as idciclo,
                cic.cic_nombre as ciclo
                FROM cic_ciclo cic
		INNER JOIN ciem_cicempresa ciem ON ciem.cic_ideregistro=cic.cic_ideregistro
                INNER JOIN cipr_cicprograma cipr ON cipr.cic_ideregistro=cic.cic_ideregistro
                WHERE cic_estado='A'
		AND ciem.emp_ideregistro=:empresa
                AND cipr.prg_ideregistro=:programa
                AND cipr.cic_ideregistro NOT IN (31,38)
                GROUP BY idciclo
                ORDER BY cic.cic_ideregistro ASC";
        $parametros['empresa'] = $empresa;
        $parametros['programa'] = $programa;
        $resultado = $this->executeQuery($sql, $this->ajustarParametros($parametros));
        return $resultado;
    }

    public function consultarBarriosPorNombre($idempresa, $palabraClave) {
        $parametros['idempresa'] = $idempresa;
        $parametros['palabraclave'] = "%" . $palabraClave . "%";
        $sql = "SELECT muba.uni_barrio idbarrio, ba.barrio_nom  ||' - '|| ba.barrio_cod barrio 
                FROM muba_munbarrio muba  
                INNER JOIN barrios ba ON ba.barrio_ideregistro = muba.uni_barrio  
                INNER JOIN empresas em ON empresa_cod = ba.barrio_codemp
                WHERE em.empresa_sevemp = :idempresa AND barrio_nom ILIKE :palabraclave
                ORDER BY ba.barrio_nom ";
        $resultado = $this->executeQuery($sql, $this->ajustarParametros($parametros));
        return $resultado;
    }

    public function consultarUsuarioAnnos($usuario, $empleado) {

        $parametros["usuario"] = $usuario;
        $parametros["empleado"] = $empleado;
        $sql = "select DISTINCT datos.* from (
		select * from (
				SELECT
                                DISTINCT cic_ano::INTEGER as anno
                                FROM fac_factura fac
                                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr=fac.dsus_ideregistr
                                WHERE (dsus.dsus_ideregistr = :usuario OR dsus.dsus_pcodigo=:usuario::VARCHAR)
                                AND  	fac.uni_documento = 24 
                                AND 	fac.fac_estado  in  ('A','F','P','C','N')
                                AND     fac.fac_idepadre is null
                                AND  
                                ((SELECT
                                                                                        uni.uni_ideregistro as ideunidad
                                        FROM				est_estructura est
                                        INNER JOIN 	esem_estempresa esem ON est.est_ideregistro = esem.est_ideregistro
                                        INNER JOIN 	cla_clase cla ON est.cla_ideregistro = cla.cla_ideregistro
                                        INNER JOIN 	uni_unidad uni ON est.est_ideregistro = uni.est_ideregistro
                                        INNER JOIN 	prun_prgunidad prun ON uni.uni_ideregistro = prun.uni_ideregistro
                                        INNER JOIN 	uspu_usuprgunid uspu ON uspu.prun_ideregistr=prun.prun_ideregistr
                                        WHERE
                                                                                        est.cla_ideregistro =43
                                                                                        AND esem.emp_ideregistro = 322
                                                                                        AND prun.prg_ideregistro = 143
                                                                                        AND uspu.usu_ideregistro = :empleado
                                                                                        and prun.uni_ideregistro = 1217
                                 )=1217)
						ORDER BY anno desc
			) as datos1								 

                UNION

                        SELECT * from (
                                    SELECT
                                        DISTINCT cic_ano::INTEGER as anno
                                        FROM fac_factura fac
                                        INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr=fac.dsus_ideregistr
                                        WHERE (dsus.dsus_ideregistr = :usuario OR dsus.dsus_pcodigo=:usuario::VARCHAR)
                                AND  	fac.uni_documento = 24 
                                AND 	fac.fac_estado  in  ('A','F','P','C','N')
                                AND     fac.fac_idepadre is null
                                AND 	fac.fac_ideorigen IS NULL
                                        ORDER BY anno desc limit 1
                        )as datos2
                ) as datos
                ORDER BY  datos.anno desc";
        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
    }

    public function consultarListaMvi($empleado,$empresa) {
        /* $sql = "SELECT
          mvi.mvi_ideregistro::INTEGER as idemvi,
          (mvi.mvi_ideregistro || '-' || mvi.mvi_fecha)::VARCHAR as fecha
          FROM mvi_movimiento mvi
          WHERE mvi_estado = 'G'"; */

        $parametros["empleado"] = $empleado;
        $parametros["empresa"] = $empresa;

        $sql = "SELECT DISTINCT mvi.mvi_ideregistro::INTEGER as idemvi,
				(mvi.mvi_ideregistro || '-' || mvi.mvi_fecha)::VARCHAR as fecha
                FROM		mvi_movimiento mvi 
                INNER JOIN 	emv_expmovimient emv 
                ON 		emv.mvi_ideregistro=mvi.mvi_ideregistro
                INNER JOIN 	usto_usutipopera usto 
                ON 		usto.top_ideregistro=emv.top_ideregistro
                WHERE	 	mvi.mvi_estado='G' 
                    AND         usto.usu_ideregistro = :empleado 
                    AND         emv.emv_estado <>'X'
                    AND         mvi.emp_ideregistro = :empresa
                ORDER BY        idemvi";

        $resultado = $this->executeQuery($sql, $this->ajustarParametros($parametros));
        return $resultado;
    }

    public function consultarListaDocumentos($empleado) {
        $parametros["empleado"] = $empleado;

        $sql = "SELECT DISTINCT doc.uni_documento AS id,
				doc.doc_nombre AS nombre
                FROM		doc_documento doc
                ORDER BY        nombre";

        $resultado = $this->executeQuery($sql, $this->ajustarParametros($parametros));
        return $resultado;
    }

    public function consultarListaTiposDocumento($empleado) {
        $parametros["empleado"] = $empleado;

        $sql = "SELECT DISTINCT tido.uni_tipdocument AS id,
				tido.tido_nombre AS nombre
                FROM		tido_tipdocumen tido
                ORDER BY        nombre";

        $resultado = $this->executeQuery($sql, $this->ajustarParametros($parametros));
        return $resultado;
    }

    public function consultarListaConceptos($empleado) {
        $parametros["empleado"] = $empleado;

        $sql = "SELECT DISTINCT con.uni_concepto AS id,
				con.con_nombre AS nombre
                FROM		con_concepto con
                ORDER BY        nombre";

        $resultado = $this->executeQuery($sql, $this->ajustarParametros($parametros));
        return $resultado;
    }

    public function consultaPermisoUsuario($empresa, $empleado) {

        $parametros["empresa"] = $empresa;
        $parametros["empleado"] = $empleado;
        $sql = "
              SELECT
                      uni.uni_ideregistro as ideunidad
              FROM
                      est_estructura est
              INNER JOIN esem_estempresa esem ON est.est_ideregistro = esem.est_ideregistro
              INNER JOIN cla_clase cla ON est.cla_ideregistro = cla.cla_ideregistro
              INNER JOIN uni_unidad uni ON est.est_ideregistro = uni.est_ideregistro
              INNER JOIN prun_prgunidad prun ON uni.uni_ideregistro = prun.uni_ideregistro
              INNER JOIN uspu_usuprgunid uspu ON uspu.prun_ideregistr=prun.prun_ideregistr
              WHERE
                est.cla_ideregistro =43
                AND esem.emp_ideregistro = :empresa
                AND prun.prg_ideregistro = 143
                AND uspu.usu_ideregistro = :empleado
              ORDER BY
                      uni.uni_nombre1 ";
        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
    }
    
    public function consultarMercadosEmpresa(array $parametros) {

        $sql = "SELECT 
                    mercado_cod AS mercado_id,
                    mercado_nom AS mercado_nombre                       
                FROM mercados 
                        INNER JOIN empresas empp on empp.empresa_cod = mercado_codemp 
                WHERE empresa_sevemp =:emp_codsev                  
                ORDER BY mercado_nombre ASC ";
        $resultado = $this->executeQuery($sql, $parametros);
        return  $resultado;
    }
    
    public function consultaPeriodosTarifas($parametros) {
        $sql = "SELECT DISTINCT
                    periodo_mes :: INTEGER,
                    periodo_ano :: INTEGER,
                    (periodo_ano || periodo_mes) AS periodo
                  FROM periodos per
                    INNER JOIN empresas empr ON empr.empresa_cod = per.periodo_codemp
                  WHERE empr.empresa_sevemp = :idempresa
                        AND periodo_ano :: INTEGER IN (
                    SELECT DISTINCT periodo_ano :: INTEGER
                    FROM periodos per
                      INNER JOIN empresas empr ON empr.empresa_cod = periodo_codemp
                    WHERE empresa_sevemp = :idempresa
                    ORDER BY periodo_ano :: INTEGER DESC
                    LIMIT 1)
                  ORDER BY periodo_mes :: INTEGER DESC
                  LIMIT 1";
        $resultado = $this->executeQuery($sql,$parametros);
        return $resultado[0]['periodo'];
    }
    
    public function consultarEmpresaGeneral()
    {
        $sql="SELECT emp.empresa_nom as nombre, emp.empresa_sevemp as codigo FROM empresas emp WHERE emp.empresa_sevemp IS NOT NULL";
        return $this->executeQuery($sql);
    }

    public function consultarCategoriaEmpresa($empresa) {
        $parametros["empresa"] = $empresa;
        $sql = "SELECT
                est.est_ideregistro as ideestructura,
                est.est_nombre as nombre
                FROM esem_estempresa esem
                INNER JOIN est_estructura est ON esem.est_ideregistro=est.est_ideregistro
                WHERE esem.emp_ideregistro= :empresa AND est.est_estado='A' ";
        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
    }
    
    public function consultaUnidadesCategoria($categoria) {
        $parametros["categoria"] = $categoria;
        $sql = "SELECT
                *
                FROM uni_unidad uni
                WHERE uni.est_ideregistro= :categoria ORDER BY uni.uni_ideregistro ASC";
        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
    }
    
    public function consultarReporteUnidades()
    {
        $sql="SELECT
                re.ru_reporte_nombre || ' - ' || emp.empresa_nom as nombreCompleto,
                re.ru_id,
                re.ru_reporte_nombre,
                re.ru_empresa,
                re.ru_parametros,
                re.ru_logo, re.usu_ideregistro, re.ru_titulo_empresa
                FROM reportes.reu_reporteunidades re
                INNER JOIN empresas emp on emp.empresa_sevemp=re.ru_empresa
                ORDER BY re.ru_reporte_nombre ASC";
        return $this->executeQuery($sql);
    }
    
    public function consultaCiclosEmpresaReportes($empresa)
    {
        $parametros["empresa"] = $empresa;
        $sql="SELECT
                cic.cic_ideregistro as uni_ideregistro,
                cic.cic_nombre as uni_nombre1
                FROM cic_ciclo cic 
                INNER JOIN ciem_cicempresa ciem ON ciem.cic_ideregistro = cic.cic_ideregistro 
                WHERE cic.cic_estado = 'A' AND ciem.emp_ideregistro = :empresa
                ORDER BY cic.cic_ideregistro ASC";
        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
    }
    
    public function consultaProyectosEmpresaReportes($empresa)
    {
        $parametros["empresa"] = $empresa;
        $sql="SELECT
                pro.proyecto_ideregistro as uni_ideregistro,
                pro.proyecto_nom as uni_nombre1
                FROM proyectos pro 
                INNER JOIN empresas emp ON pro.proyecto_codemp=emp.empresa_cod
                WHERE emp.empresa_sevemp=:empresa
                ORDER BY pro.proyecto_ideregistro ASC";
        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
    }
    
    public function insertarReporteUnidades($datos) {
        
        $parametros = array();
        try {
            $this->setCampo($datos, $parametros, 'nombre', 'ru_reporte_nombre');
            $this->setCampo($datos, $parametros, 'empresa', 'ru_empresa');
            $this->setCampo($datos, $parametros, 'parametros', 'ru_parametros');
            $this->setCampo($datos, $parametros, 'logo', 'ru_logo');
            $this->setCampo($datos, $parametros, 'usuario', 'usu_ideregistro');
            $this->setCampo($datos, $parametros, 'tituloEmpresa', 'ru_titulo_empresa');
            return $this->insertar($parametros, 'reportes.reu_reporteunidades', 'reportes.sq_ru_id');
        } catch (\Exception $ex) {
            throw new MyException('Error insertando reporte unidades '.$ex, -1);
        }
    }
    
    public function editarReporteUnidades($Detalle) {
        try {
            $datos = array();
            $datos['ru_parametros'] = $Detalle['parametros'];
            $datos['ru_logo'] = $Detalle['logo'];
            //$datos['usu_ideregistro'] = $Detalle['usuario'];            
            $condicion=" ru_empresa=".$Detalle['empresa']." AND ru_reporte_nombre='".$Detalle['nombre']."'";
            return $this->actualizar($datos, 'reportes.reu_reporteunidades', $condicion);
        } catch (\Exception $Ex) {
            throw new MyException("Error Actualizando Tabla Reporte Unidades: " . $Ex->getMessage(), -1);
        }
    }
    public function consultarEmpresaCodSeven ($idEmpresa) {
        $sql = "SELECT *  
                FROM empresas 
                WHERE empresa_sevemp =:emp_codsev  ";
        $parametros['emp_codsev'] = $idEmpresa ;
        return parent::executeQuery($sql, $parametros);
    }

}
