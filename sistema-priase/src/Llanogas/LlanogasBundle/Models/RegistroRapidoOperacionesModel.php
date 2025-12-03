<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Description of RegistroRapidoOperacionesModel
 *
 * @author mebonilla
 */
class RegistroRapidoOperacionesModel extends AuditoriaServices {

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
     * Consulta los municipios del programa por la empresa logueada
     * @param string $municipio nombre o coincidencia del municipio a buscar.
     * @return array Lista de municipios
     */
    public function autocompleteMunicipio($municipio, $idPrograma) {
        $parametros["codempresa"] = $this->sesion->get('idempresa');
        $parametros["codusuario"] = $this->sesion->get('idusuario');
        $parametros["idprograma"] = $idPrograma;
        $parametros["municipio"] = "%" . strtoupper($municipio) . "%";
        $sql = "SELECT
                    pry.proyecto_ideregistro::integer idmunicipio, pry.proyecto_nom municipio
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
     * Consulta los motivos de suspensión por usuario
     * @return array Lista de motivos de suspensión
     */
    public function listaMotivosSuspension() {
        $parametros["codusuario"] = $this->sesion->get('idusuario');
        $sql = "SELECT
                    DISTINCT(uni.uni_ideregistro) idmotivo,
                    mosu.mosu_nombre motivo
                FROM
                    mosu_motsuspen mosu
                    INNER JOIN uni_unidad uni
                    ON mosu.uni_motsuspen = uni.uni_ideregistro
                    INNER JOIN prun_prgunidad prun
                    ON prun.uni_ideregistro = uni.uni_ideregistro
                    INNER JOIN uspu_usuprgunid uspu
                    ON uspu.prun_ideregistr = uspu.prun_ideregistr
                    WHERE uspu.usu_ideregistro = :codusuario
                    ORDER BY uni.uni_ideregistro ASC";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta los motivos de reconexión según el usuario logueado
     * @return array Lista de motivos
     */
    public function listaMotivosReconexion() {
        $parametros["codusuario"] = $this->sesion->get('idusuario');
        $sql = "SELECT
                    DISTINCT(uni.uni_ideregistro) idmotivo,
                    morx.morx_nombre motivo
                FROM
                    morx_motreconex morx
                    INNER JOIN uni_unidad uni
                    ON morx.uni_motreconex = uni.uni_ideregistro
                    INNER JOIN prun_prgunidad prun
                    ON prun.uni_ideregistro = uni.uni_ideregistro
                    INNER JOIN uspu_usuprgunid uspu
                    ON uspu.prun_ideregistr = uspu.prun_ideregistr
                    WHERE uspu.usu_ideregistro = :codusuario
                    ORDER BY uni.uni_ideregistro ASC";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta las rutas de una empresa según el usuario logueado
     * @return array Listado de rutas de una empresa
     */
    public function listaRutasSuspension() {
        $parametros["codempresa"] = $this->sesion->get('idempresa');
        $parametros["codusuario"] = $this->sesion->get('idusuario');
        $sql = "SELECT
                    rut.rut_ideregistro idruta,
                    rut.rut_nombre ruta
                FROM
                    rut_ruta rut
                INNER JOIN ruem_rutempresa ruem 
                ON rut.rut_ideregistro = ruem.rut_ideregistro
                INNER JOIN usru_usuruta usru 
                ON rut.rut_ideregistro = usru.rut_ideregistro
                WHERE usru.usu_ideregistro = :codusuario
                AND ruem.emp_ideregistro = :codempresa ORDER BY rut.rut_nombre";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta tipos de suspensión de la empresa
     * @return array Listado de tipos de suspensión
     */
    public function listaTiposSuspension() {
        $parametros = array();
        $sql = "SELECT
                    uni.uni_ideregistro idtiposuspension,
                    uni.uni_nombre1 tiposuspension
                FROM
                    uni_unidad uni
                INNER JOIN est_estructura est ON uni.est_ideregistro = est.est_ideregistro
                INNER JOIN cla_clase cla ON est.cla_ideregistro = cla.cla_ideregistro
                WHERE cla.cla_ideregistro = 14";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta las novedades de suspensión de una empresa
     * @param int $codRegistro identificador de la clase
     * @param int $codEmpresa identificador de la empresa
     * @return array Listado de novedades
     */
    public function listaNovedadesSuspension() {
        $parametros = array();
        $sql = "SELECT  
                    nov.uni_novsuspen as id,
                    nov.nosu_nombre as nombre 
                FROM nosu_novsuspen nov
                ORDER BY nov.uni_novsuspen, nov.nosu_nombre";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta las novedades de reconexión.
     * @param int $codRegistro identificador de la clase
     * @param int $codEmpresa identificador de la empresa
     * @return array Listado de novedades
     */
    public function listaNovedadesReconexion() {
        $parametros = array();
        $sql = "SELECT 	
                    nov.uni_novreconex as id,
                    nov.norx_nombre as nombre 
                FROM norx_novreconex nov
                ORDER BY nov.uni_novreconex,nov.norx_nombre";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta suspensiones que cumplan con parámetro de búsqueda
     * @param int $municipio Id municipio campo obligatorio de búsqueda
     * @param int $ruta Id ruta campo obligatorio de búsqueda
     * @param int $barrio Id barrio
     * @param date $desde Desde que fecha se buscará
     * @param date $hasta Fecha hasta la que se filtrará las suspensiones
     * @param char $altoRiesgo Si la propiedad está en zona de alto riesgo.
     * @param char $zona Tipo de zona de la propiedad
     * @param int $tercero Id tercero que ejecuta la suspensión
     * @param char $realizada Si se realizó la  suspensión
     * @param date $fechaProgramacion Fecha de cuando se programó la suspensión
     * @param int $motivo Id motivo de suspensión campo obligatorio de búsqueda
     * @return array Listado de las suspensiones con características similares.
     */
    public function consultarTablaSuspensiones($municipio, $ruta, $barrio, $desde, $hasta, $altoRiesgo, $zona, $tercero, $realizada, $fechaProgramacion, $motivo) {
        $parametros["uni_municipio"] = $municipio;
        $parametros["rut_ideregistro"] = $ruta;
        $parametros["uni_motsuspen"] = $motivo;
        $complementoSql = "";
        if (!empty($barrio)) {
            $complementoSql .= " AND dsus.uni_barrio = :uni_barrio";
            $parametros["uni_barrio"] = $barrio;
        }
        if (!empty($desde) && !empty($hasta)) {
            $complementoSql .= " AND rusu.rusu_rutsecuen BETWEEN :desde AND :hasta";
            $parametros["desde"] = $desde;
            $parametros["hasta"] = $hasta;
        }
        if (!empty($altoRiesgo)) {
            $complementoSql .= " AND pro.pro_altriesgo = :pro_altriesgo";
            $parametros["pro_altriesgo"] = $altoRiesgo;
        }
        if (!empty($zona)) {
            $complementoSql .= " AND pro.pro_zona = :pro_zona";
            $parametros["pro_zona"] = $zona;
        }
        if (!empty($tercero)) {
            $complementoSql .= " AND ssp.ter_ejesuspens = :ter_ejesuspens";
            $parametros["ter_ejesuspens"] = $tercero;
        }
        if (!empty($realizada)) {
            $complementoSql .= " AND ssp.ssp_realizada = :ssp_realizada";
            $parametros["ssp_realizada"] = $realizada;
        }
        if (!empty($fechaProgramacion)) {
            $complementoSql .= " AND ssp.ssp_fecprgsuspe BETWEEN concat('$fechaProgramacion',' 00:00:00')::timestamp AND concat('$fechaProgramacion',' 23:59:59')::timestamp";
            //$parametros["ssp_fecprgsuspe"] = $fechaProgramacion;
        }
        $sql = "SELECT DISTINCT
                    ssp.ssp_ideregistro idsuspension,
                    dsus.dsus_ideregistr idsuscripcion,
                    rusu.rusu_rutsecuen secuencia,
                    dsus.dsus_pcodigo codigoanterior,
                    ssp.ssp_estado estado,
                    pro.pro_idepropieda medidor,
                    pro.pro_direccion direccion,
                    ssp.ssp_fecprgsuspe fechaprogramacion,
                    ssp.ssp_fecejesuspe fechaejecucion,
                    ssp.ssp_lectura lectura,
                    ssp.ssp_observacion observacion,
                    ssp.uni_motsuspen idmotivo,
                    mosu.mosu_nombre motivo,
                    ssp.uni_novsuspen idnovedad,
                    ssp.uni_tipsuspen idtiposuspension,
                    ssp.ter_ejesuspens idtercero,
                    ter.ter_nomcompleto tercero,
                    ssp.ssp_vlrtotal valortotal,
                    ssp.ssp_realizada realizada,
                    lec.lec_anterior lecturaactual,
                    rusu.rusu_rutsecuen secuencia ,
                    rusu.rut_ideregistro idruta,
                    trim(to_char(rusu.rut_ideregistro,'0000')) || '' || trim(to_char(rusu.rusu_rutsecuen,'0000')) idrutasecuencia 
                FROM
                    ssp_suspension ssp
                    INNER JOIN syr_susreconex syr ON ssp.syr_ideregistro = syr.syr_ideregistro
                    INNER JOIN dsus_detsuscrip dsus ON syr.dsus_ideregistr = dsus.dsus_ideregistr
                    INNER JOIN rusu_rutsuscrip rusu ON dsus.dsus_ideregistr = rusu.dsus_ideregistr
                    INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro = pro.pro_ideregistro
                    INNER JOIN mosu_motsuspen mosu ON ssp.uni_motsuspen = mosu.uni_motsuspen
                    INNER JOIN lec_lectura lec ON dsus.dsus_ideregistr = lec.dsus_ideregistr --AND lec.per_ideregistro = syr.per_ideregistro
                    LEFT JOIN ter_tercero ter ON ssp.ter_ejesuspens = ter.ter_ideregistro
                    INNER JOIN usru_usuruta usru ON rusu.rut_ideregistro = usru.rut_ideregistro
                WHERE
                    ssp.ssp_estado = 'A' AND
                    syr.syr_estado = 'A' AND
                    lec.lec_estado='A' AND
                    dsus.uni_municipio = :uni_municipio
                    AND rusu.rut_ideregistro = :rut_ideregistro
                    AND ssp.uni_motsuspen = :uni_motsuspen $complementoSql 
                    AND (
                        ssp.ssp_fecejesuspe IS NULL
                        --AND ssp.ter_ejesuspens IS NULL
                        AND ssp.uni_novsuspen IS NULL
                    ) order by rusu.rut_ideregistro, rusu.rusu_rutsecuen  ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Actualiza toda la información de una suspensión
     * @param array $suspension información de la supensión a actualizar.
     * @return int Número de registros modificados
     * @throws MyException Error al actualizar suspensión.
     */
    public function actualizarSuspension($suspension) {
        $ejecucion = $suspension["fechaejecucion"];
        $data["ssp_ideregistro"] = $suspension["idsuspension"];
        if (!empty($suspension["fechaprogramacion"])) {
            $data["ssp_fecprgsuspe"] = $suspension["fechaprogramacion"];
        }
        if (!empty($ejecucion) && !strpos($ejecucion, "____-__-__")) {
            $data["ssp_fecejesuspe"] = $ejecucion;
        }
        if (isset($suspension["lectura"]) && is_numeric($suspension["lectura"])) {
            $data["ssp_lectura"] = $suspension["lectura"];
        }
        if (!empty($suspension["observacion"])) {
            $data["ssp_observacion"] = $suspension["observacion"];
        }
        $this->validarNovedadSuspension($suspension["idnovedad"], $data);
        if (!empty($suspension["idtiposuspension"])) {
            $data["uni_tipsuspen"] = intval($suspension["idtiposuspension"]);
        }
        if (!empty($suspension["idtercero"])) {
            $data["ter_ejesuspens"] = intval($suspension["idtercero"]);
        }
        if (!empty($suspension["realizada"])) {
            $data["ssp_realizada"] = $suspension["realizada"];
        }
        $resultado = $this->actualizar($data, "ssp_suspension", "ssp_ideregistro = :ssp_ideregistro");
        return $resultado;
    }

    private function validarNovedadSuspension($idNovedad, &$data) {
        if (empty($idNovedad))
            return;
        $data["uni_novsuspen"] = intval($idNovedad);
        $concepto = $this->consultarValorNovedadSus($idNovedad);

        if (empty($concepto))
            return;
        if ($concepto['novedadcobra'] === 'N')
            return;
        if (isset($concepto["valortotal"])) {
            $data["ssp_vlrtotal"] = intval($concepto["valortotal"]);
        }
        if (isset($concepto["idconcepto"])) {
            $data["uni_concepto"] = $concepto["idconcepto"];
        }
    }

    /**
     * Consulta reconexiones que cumplan con parámetro de búsqueda
     * @param int $municipio Id municipio campo obligatorio de búsqueda
     * @param int $ruta Id ruta campo obligatorio de búsqueda
     * @param int $barrio Id barrio
     * @param date $desde Desde que fecha se buscará
     * @param date $hasta Fecha hasta la que se filtrará las suspensiones
     * @param char $altoRiesgo Si la propiedad está en zona de alto riesgo.
     * @param char $zona Tipo de zona de la propiedad
     * @param int $tercero Id tercero que ejecuta la suspensión
     * @param char $realizada Si se realizó la  suspensión
     * @param date $fechaProgramacion Fecha de cuando se programó la suspensión
     * @param int $motivo Id motivo de suspensión campo obligatorio de búsqueda
     * @return array Listado de las reconexiones con características similares.
     */
    public function consultarTablaReconexiones($municipio, $ruta, $barrio, $desde, $hasta, $altoRiesgo, $zona, $tercero, $realizada, $fechaProgramacion, $motivo) {
        $parametros["uni_municipio"] = $municipio;
        $parametros["rut_ideregistro"] = $ruta;
        $parametros["uni_motreconex"] = $motivo;
        $complementoSql = "";
        if (!empty($barrio)) {
            $complementoSql .= " AND dsus.uni_barrio = :uni_barrio";
            $parametros["uni_barrio"] = $barrio;
        }
        if (!empty($desde) && !empty($hasta)) {
            $complementoSql .= " AND rusu.rusu_rutsecuen BETWEEN :desde AND :hasta";
            $parametros["desde"] = $desde;
            $parametros["hasta"] = $hasta;
        }
        if (!empty($altoRiesgo)) {
            $complementoSql .= " AND pro.pro_altriesgo = :pro_altriesgo";
            $parametros["pro_altriesgo"] = $altoRiesgo;
        }
        if (!empty($zona)) {
            $complementoSql .= " AND pro.pro_zona = :pro_zona";
            $parametros["pro_zona"] = $zona;
        }
        if (!empty($tercero)) {
            $complementoSql .= " AND rco.ter_ejereconex = :ter_ejesuspens";
            $parametros["ter_ejesuspens"] = $tercero;
        }
        if (!empty($realizada)) {
            $complementoSql .= " AND rco.rco_realizada = :rco_realizada";
            $parametros["rco_realizada"] = $realizada;
        }
        if (!empty($fechaProgramacion)) {
            $complementoSql .= " AND rco_fecprgrecon BETWEEN concat('$fechaProgramacion',' 00:00:00')::timestamp AND concat('$fechaProgramacion',' 23:59:59')::timestamp";
            $parametros["rco_fecprgrecon"] = $fechaProgramacion;
        }
        if (!empty($ruta) && $ruta != -1 ) {
            $complementoSql .= " AND rusu.rut_ideregistro = :rut_ideregistro  ";
            $parametros["rut_ideregistro"] = $ruta;
        }
        
        $sql = "SELECT DISTINCT
                    rco.rco_ideregistro idreconexion,
                    dsus.dsus_ideregistr idsuscripcion,
                    rusu.rusu_rutsecuen secuencia,
                    dsus.dsus_pcodigo codigoanterior,
                    pro.pro_idepropieda medidor,
                    pro.pro_direccion direccion,
                    rco.rco_estado estado,
                    rco.rco_fecha fecha,
                    rco.rco_fecprgrecon fechaprogramacion,
                    rco.rco_fecejerecon fechaejecucion,
                    rco.rco_lectura lectura,
                    rco.rco_observacion observacion,
                    rco.rco_vlrtotal valortotal,
                    rco.uni_novreconex idnovedad,
                    rco.ter_ejereconex idtercero,
                    ter.ter_nomcompleto tercero,
                    rco.uni_motreconex idmotivo,
                    morx.morx_nombre motivo,
                    rco.rco_realizada realizada,
                    (
                      SELECT ssp.ssp_lectura 
                      FROM ssp_suspension ssp 
                      WHERE ssp.syr_ideregistro =syr.syr_ideregistro ORDER BY ssp.ssp_ideregistro DESC LIMIT 1 
                    )lecturaactual ,
                    rut.rut_ideregistro idruta,
                    trim(to_char(rut.rut_ideregistro,'0000')) ||''||  trim(to_char(rusu.rusu_rutsecuen,'0000'))  idrutasecuencia  ,
                    rut.rut_nombre nombreruta 
                    FROM
                        rco_reconexion rco
                    INNER JOIN syr_susreconex syr ON rco.syr_ideregistro = syr.syr_ideregistro
                    INNER JOIN dsus_detsuscrip dsus ON syr.dsus_ideregistr = dsus.dsus_ideregistr
                    INNER JOIN rusu_rutsuscrip rusu ON dsus.dsus_ideregistr = rusu.dsus_ideregistr
                    INNER JOIN rut_ruta rut on rut.rut_ideregistro = rusu.rut_ideregistro
                    INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro = pro.pro_ideregistro
                    INNER JOIN morx_motreconex morx ON morx.uni_motreconex = rco.uni_motreconex
                    LEFT JOIN ter_tercero ter ON rco.ter_ejereconex = ter.ter_ideregistro
                    WHERE
                        syr.syr_estado = 'A' AND
                        rco.rco_estado = 'A' 
                        AND dsus.uni_municipio = :uni_municipio
                        
                        AND morx.uni_motreconex = :uni_motreconex $complementoSql 
                        AND ( 
                            rco.rco_fecejerecon IS NULL
                            AND rco.ter_ejereconex IS NULL
                            AND rco.uni_novreconex IS NULL
                        )  order by rut.rut_ideregistro , rusu.rusu_rutsecuen  ";
//        print_r($parametros);
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Modifica el registro de una reconexión
     * @param array $reconexion información de la reconexión.
     * @return int numero de registros actualizados
     */
    public function actualizarReconexion($reconexion) {
        $ejecucion = $reconexion["fechaejecucion"];
        //, $reconexion["fechaprogramacion"], , , , , , $reconexion["realizada"]
        $data["rco_ideregistro"] = intval($reconexion["idreconexion"]);
        if (!empty($reconexion["fechaprogramacion"])) {
            $data["rco_fecprgrecon"] = $reconexion["fechaprogramacion"];
        }
        if (!empty($ejecucion) && !strpos($ejecucion, "____-__-__")) {
            $data["rco_fecejerecon"] = $ejecucion;
        }
        if (!empty($reconexion["lectura"]) && is_numeric($reconexion["lectura"])) {
            $data["rco_lectura"] = $reconexion["lectura"];
        }
        if (!empty($reconexion["observacion"])) {
            $data["rco_observacion"] = $reconexion["observacion"];
        }

        if (!empty($reconexion["idtercero"])) {
            $data["ter_ejereconex"] = intval($reconexion["idtercero"]);
        }
        if (!empty($reconexion["realizada"])) {
            $data["rco_realizada"] = $reconexion["realizada"];
        }
        $this->validarNovedadReconexion($reconexion['idnovedad'], $data);
        return $this->actualizar($data, "rco_reconexion", "rco_ideregistro = :rco_ideregistro");
    }

    private function validarNovedadReconexion($idNovedad, &$data) {
        if (empty($idNovedad))
            return;
        $data["uni_novreconex"] = intval($idNovedad);
        $concepto = $this->consultarValorNovedadRec($idNovedad);

        if (empty($concepto))
            return;
        if ($concepto['novedadcobra'] === 'N')
            return;
        if (isset($concepto["valortotal"])) {
            $data["rco_vlrtotal"] = intval($concepto["valortotal"]);
        }
        if (isset($concepto["idconcepto"])) {
            $data["uni_concepto"] = $concepto["idconcepto"];
        }
    }

    /**
     * Consulta el valor de una novedad de la suspensión
     * @param int $idNovedadSus id novedad
     * @return int valor de una novedad
     */
    public function consultarValorNovedadSus($idNovedadSus) {
        $parametros["uni_novsuspen"] = $idNovedadSus;
        $sql = "SELECT
                    con.uni_concepto idconcepto,
                    con.con_valor valortotal, 
                    nosu.nosu_cobro novedadcobra
                FROM
                    nosu_novsuspen nosu
                INNER JOIN con_concepto con ON nosu.uni_concepto = con.uni_concepto
                WHERE nosu.uni_novsuspen = :uni_novsuspen";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado['valortotal'] = 0;
        }
        return $resultado[0];
    }

    /**
     * Consulta el valor de una novedad de reconexión
     * @param int $idNovedadSus id novedad
     * @return type
     */
    public function consultarValorNovedadRec($idNovedadSus) {
        $parametros["idnovedad"] = $idNovedadSus;
        $sql = "SELECT
                    con.uni_concepto idconcepto,
                    con.con_valor valortotal,
                    norx.norx_cobro novedadcobra
                FROM
                    norx_novreconex norx
                INNER JOIN con_concepto con ON norx.uni_concepto = con.uni_concepto
                WHERE norx.uni_novreconex = :idnovedad";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }
/**
 * Consulta fecha minima con holgura parametrizada en tabla de parametros
 * @param type $idprograma
 * @param type $idempresa
 * @return type
 */
    public function consultarHolguraFechaSyR($idprograma, $idempresa,$idproceso='HOLGURA_SUSPENSION') {
        $parametros['idempresa']  = $idempresa;
        $parametros['idprograma'] = $idprograma;
        $parametros['idproceso']  = $idproceso;
        $sql = " select to_char(now()::Date -	(json_extract_path_text(datos2.columna,'par_valor'))::INTEGER,'YYYY-MM-DD' ) as fecha
                  FROM
                   (SELECT json_array_elements(datajson.datos::JSON) as columna
                      FROM (select json_extract_path(par_parametro.par_parametro :: JSON, :idproceso) as datos 
                             FROM
                             par_parametro where emp_ideregistro = :idempresa ) AS datajson ) datos2
                   WHERE json_extract_path_text(datos2.columna,'prg_ideregistro')::INTEGER =  :idprograma ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['fecha'];
    }

}
