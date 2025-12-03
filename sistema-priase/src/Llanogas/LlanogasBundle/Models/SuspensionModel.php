<?php

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\Models\RecaudosModel;
use Llanogas\LlanogasBundle\MyException;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Administra y controla la suspensión.
 * @author mebonilla
 */
class SuspensionModel extends AuditoriaServices {

    /**
     *
     * @var SessionInterface 
     */
    private $sesion;

    /**
     * Constructor de la clase
     * @param Connection $conexion
     */
    public function __construct(&$conexion, &$sesion = null) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
    }

    /**
     * Consulta las cuadrillas activas pertenecientes al proceso de suspensiones 
     * y reconexiones según la empresa con la cual se inicie sesión.
     * 
     * @param type $idEmpresa
     * @param type $dependencia
     * @return type
     */
    public function consultarCuadrillas($idEmpresa, $dependencia, $estado) {
        $parametros["idempresa"] = $idEmpresa;
        $parametros["dependencia"] = $dependencia;
        $parametros["estado"] = $estado;
        
        $sql = "    SELECT      u2.usu_ideregistro id, 
                                c.cuadrilla_nom nombre 
                    FROM        cuadrillas c 
                    INNER JOIN  usuarios u2 on u2.usuario_nit = c.cuadrilla_nit 
                    WHERE       c.cuadrilla_coddepemp = :dependencia
                        AND 	c.cua_estado = :estado
                        AND 	c.emp_ideregistro = :idempresa
                    ORDER BY  	c.cuadrilla_nom ;";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }
    
    /**
     * Metodo para la consulta de la localización de la cuadrilla en terreno.
     * 
     * @param type $aplicacion
     * @param type $usuCuadrilla
     * @param type $fecha
     * @return type
     */
    public function consultarLocalizacionCuadrillas($aplicacion, $usuCuadrilla, $fecha) {
        $parametros["aplicacion"] = $aplicacion;
        $parametros["usuCuadrilla"] = $usuCuadrilla;
        $parametros["fecha"] = $fecha;
        
        $sql = "select 		mm.molo_fecha fecha, 
                                mm.molo_latitud latitud, 
                                mm.molo_longitud longitud
                from 		molo_movillocalizacion mm 
                where 		mm.molo_aplicacion = :aplicacion
                        and 	mm.usu_ideregistro = :usuCuadrilla 
                        and 	mm.molo_fecha::DATE = :fecha
                        and 	mm.molo_latitud <> '0.0'
                order by 	mm.molo_fecha ;";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }
    
    
    /**
     * Consuta para la localización de las actividades ejecutadas en terreno, 
     * según los parametros recibidos puede consultar las suspensiones, 
     * reconexiones o ambas.
     * 
     * @param type $suspensiones
     * @param type $reconexiones
     * @param type $usuCuadrilla
     * @param type $fecha
     * @return type
     */
    public function consultarLocalizacionActividades($suspensiones, $reconexiones, $usuCuadrilla, $fecha) {
        $parametros["usuCuadrilla"] = $usuCuadrilla;
        $parametros["fecha"] = $fecha;
        $parametros["reconexiones"] = $reconexiones;
        $parametros["suspensiones"] = $suspensiones;
        
        $sql = "(   select      ss.ssp_fecfinsuspe fecha, 
                                ss.ssp_latitud latitud, 
                                ss.ssp_longitud longitud
                    from 	ssp_suspension ss 
                    where 	ss.ssp_fecfinsuspe::DATE = :fecha
                        and 	ss.usu_ideregistro = :usuCuadrilla
                        and 	1 = :suspensiones

                    union

                    select      rr.rco_fecfinrecon fecha, 
                                rr.rco_latitud latitud, 
                                rr.rco_longitud longitud
                    from 	rco_reconexion rr 
                    where 	rr.rco_fecfinrecon::DATE = :fecha
                        and 	rr.usu_ideregistro = :usuCuadrilla
                        and 	1 = :reconexiones)
                    order by 	fecha;";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }
    
    /**
     * Consulta la suscripción.
     * @param int $idEmpresa identificador de la empresa
     * @param string $documento cédula del tercero
     * @param string $codanterior código anterior de la suscripción
     * @param int $idSuscripcion identificador de la suscripción.
     * @return type
     */
    public function consultarSuscripcion($idEmpresa, $documento = "", $codanterior = "", $idSuscripcion = "", $municipio = "") {
        $parametros["codempresa"] = $idEmpresa;
        $parametros["uni_municipio"] = $municipio;
        $complementoSql = NULL;
        if (!empty($documento)) {
            $complementoSql .= "AND ter.ter_documento = :numdocumento ";
            $parametros["numdocumento"] = $documento;
        }
        if (!empty($codanterior)) {
            $complementoSql .= "AND dsus.dsus_pcodigo = :codanterior ";
            $parametros["codanterior"] = $codanterior;
        }
        if (!empty($idSuscripcion)) {
            $complementoSql .= "AND dsus.dsus_ideregistr = :suscripcion ";
            $parametros["suscripcion"] = $idSuscripcion;
        }
        $sql = "SELECT
                    ter.ter_documento documento,
                    ter.ter_nomcompleto nombre,
                    tsu.tsu_nombre tiposuscripcion,
                    dsus.dsus_pcodigo codanterior,
                    dsus.dsus_ideregistr idsuscripcion,
                    dsus.pro_ideregistro idpropiedad,
                    dsus.cic_ideregistro ciclo,
                    uni.uni_nombre1 tipouso,
                    cnre.cnre_nombre convenio, dsus.dsus_estado estadosus
                FROM
                        dsus_detsuscrip dsus
                INNER JOIN tsu_tipsuscripc tsu ON dsus.uni_tipsuscripc = tsu.uni_tipsuscripc
                INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro = dsus.sus_ideregistro
                INNER JOIN ter_tercero ter ON sus.ter_ideregistro = ter.ter_ideregistro
                INNER JOIN uni_unidad uni ON dsus.uni_tipusosuscr = uni.uni_ideregistro
                INNER JOIN cnre_cnvrecaudo cnre ON sus.cnre_ideregistr = cnre.cnre_ideregistr
                WHERE dsus.uni_municipio = :uni_municipio $complementoSql";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta la información de la suscripción a nivel de encabezado
     * @param int $idEmpresa identificador de la empresa
     * @param string $documento cedula del tercerp
     * @param string $codanterior código anterior de la suscripción.
     * @param int $suscripcion identificador de la suscripción.
     * @return array Detalle de la suscripción
     */
    public function consultarCabecera($idEmpresa, $documento = "", $codanterior = "", $suscripcion = "") {

        $parametros["codempresa"] = $idEmpresa;
        $complementoSql = "";
        if (!empty($documento)) {
            $complementoSql .= "AND ter.ter_documento = :numdocumento ";
            $parametros["numdocumento"] = $documento;
        }
        if (!empty($codanterior)) {
            $complementoSql .= "AND suscrip.dsus_pcodigo = :codanterior ";
            $parametros["codanterior"] = $codanterior;
        }
        if (!empty($suscripcion)) {
            $complementoSql .= "AND suscrip.dsus_ideregistr = :suscripcion ";
            $parametros["suscripcion"] = $suscripcion;
        }

        $sql = "SELECT 
                    suscrip.dsus_ideregistr idsuscripcion
                    ,ter.ter_documento documento
                    ,ter.ter_nombre || ' ' || ter.ter_apellido nombre
                    ,emp.empresa_nom empresa
                    ,cab_rec_sus.syr_estado estado
                    ,ciclo.cic_nombre ciclo
                    ,periodo.per_nombre periodo
                    ,cab_rec_sus.syr_observacion observaciones
                    ,to_char(cab_rec_sus.syr_fecha, 'yyyy-mm-dd') fechageneracion
                    ,to_char(cab_rec_sus.syr_fecaprobac, 'yyyy-mm-dd') fechaaprobacion
                    ,to_char(cab_rec_sus.syr_fecprocesad, 'yyyy-mm-dd') fechaprocedimiento
                    ,suscrip.dsus_pcodigo codanterior
                    ,tip_suscrip.tsu_nombre as tiposuscripcion
                    ,propiedad.pro_descripcion propiedad
                    ,propiedad.pro_idepropieda codpropiedad
                    ,uni1.uni_nombre1 tipoliquidacion
                    ,syr_ideregistro iddetallecabecera
                FROM dsus_detsuscrip as suscrip
                INNER JOIN syr_susreconex as cab_rec_sus on cab_rec_sus.dsus_ideregistr = suscrip.dsus_ideregistr
                INNER JOIN cic_ciclo as ciclo on ciclo.cic_ideregistro = cab_rec_sus.cic_ideregistro
                INNER JOIN per_periodo AS periodo ON periodo.per_ideregistro = cab_rec_sus.per_ideregistro
                        AND periodo.per_estado = 'A' AND periodo.cic_ideregistro = cab_rec_sus.cic_ideregistro
                INNER JOIN sus_suscripcion cab_sus on cab_sus.sus_ideregistro = suscrip.sus_ideregistro
                INNER JOIN empresas AS emp ON emp.empresa_sevemp = suscrip.emp_ideregistro  and suscrip.emp_ideregistro = :codempresa
                INNER JOIN ter_tercero ter on ter.ter_ideregistro = cab_sus.ter_ideregistro
                INNER JOIN tsu_tipsuscripc tip_suscrip on tip_suscrip.uni_tipsuscripc = suscrip.uni_tipsuscripc 
                        AND tip_suscrip.est_tipsuscripc = suscrip.est_tipsuscripc
                INNER JOIN uni_unidad uni on uni.uni_ideregistro = tip_suscrip.uni_tipsuscripc
                        AND uni.est_ideregistro = tip_suscrip.est_tipsuscripc
                INNER JOIN pro_propiedad propiedad on propiedad.pro_ideregistro = suscrip.pro_ideregistro
                INNER JOIN uni_unidad uni1 on uni1.uni_ideregistro = suscrip.uni_liquidacion
                        AND uni1.est_ideregistro = suscrip.est_liquidacion
                where suscrip.dsus_estado = 'A' $complementoSql ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta la información de las suspensiones realizadas a una suscripción.
     * @param int $codDetalle identificador de la suscripción.
     * @return array Listado de las suspensiones.
     */
    public function consultarDetalle($codDetalle) {
        if (empty($codDetalle)) {
            return FALSE;
        }
        $parametros["detalle"] = $codDetalle;
        $sql = "SELECT  det_suscripciones.dsus_ideregistr iddetallesuscripcion,
                        det_suspencion.uni_motsuspen motivosus,
                        to_char(det_suspencion.dsyr_fecprgsusp, 'yyyy-mm-dd') fechaprogramacionsus,
                        case when date(det_suspencion.dsyr_fecEjesusp) >= date(det_suspencion.dsyr_fecprgsusp) then 'Sí' else 'No' END ejecutadasus,
                        (SELECT ter_nomcompleto FROM ter_tercero WHERE det_suspencion.ter_ejesuspen = ter_tercero.ter_ideregistro ) empresasus,
                        to_char(det_suspencion.dsyr_fecprgsusp, 'yyyy-mm-dd') fechaejecucionsus,
                        det_suspencion.uni_novsuspen novedadsus,
                        det_suspencion.dsyr_lectura lecturasus,
                        det_suspencion.dsyr_observacio observacionsus,
                        to_char(det_suspencion.dsyr_fecprgreco, 'yyyy-mm-dd') fechaprogramacionrec,
                        case when date(det_suspencion.dsyr_fecEjereco) >= date(det_suspencion.dsyr_fecprgreco) then 'Sí' else 'No' END ejecutadarec,
                        to_char(det_suspencion.dsyr_fecEjereco, 'yyyy-mm-dd') fechaejecucionrec,
                        det_suspencion.uni_novreconex novedadrec,
                        det_suspencion.dsyr_estado estadorec,
                        unidad.uni_nombre1 conceptorec,
                        det_suspencion.dsyr_vlrTotal valorrec,
                        (SELECT ter_nomcompleto FROM ter_tercero WHERE det_suspencion.ter_ejereconex = ter_tercero.ter_ideregistro) empresarec
                    FROM dsus_detsuscrip as det_suscripciones
                    INNER JOIN syr_susreconex as cab_sus ON cab_sus.dsus_ideregistr = det_suscripciones.dsus_ideregistr
                    INNER JOIN dsyr_detsuspen AS det_suspencion ON det_suspencion.syr_ideregistro = cab_sus.syr_ideregistro
                    LEFT JOIN uni_unidad AS unidad ON unidad.uni_ideregistro = det_suspencion.uni_concepto
                        AND unidad.est_ideregistro = det_suspencion.est_concepto
                        and det_suscripciones.dsus_ideregistr = :detalle";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta los motivos de la suspension segun el perfil del usuario
     * @param int $codRegistro identificador de la suscripción
     * @param int $codEmpresa identificador de la empresa
     * @return array Listado de motivos.
     */
    public function consultarMotivos($codRegistro, $codEmpresa) {
        $parametros["codregistro"] = $codRegistro;
        $parametros["codempresa"] = $codEmpresa;
        $parametros["codusuario"] = $this->sesion->get('idusuario');
        $sql = "SELECT
                    DISTINCT(uni.uni_ideregistro) id,
                    mosu.mosu_nombre nombre
                FROM
                    mosu_motsuspen mosu
                    INNER JOIN uni_unidad uni
                    ON mosu.uni_motsuspen = uni.uni_ideregistro
                    INNER JOIN prun_prgunidad prun
                    ON prun.uni_ideregistro = uni.uni_ideregistro
                    INNER JOIN uspu_usuprgunid uspu
                    ON uspu.prun_ideregistr = prun.prun_ideregistr
                    WHERE uspu.usu_ideregistro = :codusuario
                    ORDER BY uni.uni_ideregistro ASC";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta los motivos de las reconexiones segun el perfil del usuario
     * @param integer $idSuspension
     * @param integer $idDetalle codigo de la empresa del usuario
     * @return type
     */
    public function consultarMotivosRec($idSuspension, $idDetalle) {
        $parametros["idsuspension"] = $idSuspension;
        $parametros["iddetalle"] = $idDetalle;
        $parametros["codusuario"] = $this->sesion->get('idusuario');
        $sql = "SELECT 
                    DISTINCT (uni.uni_ideregistro) ID,
                    morx.morx_nombre nombre
                FROM
                    morx_motreconex morx
                    INNER JOIN uni_unidad uni ON morx.uni_motreconex = uni.uni_ideregistro
                WHERE morx.mosu_ideregistro = (
                        SELECT
                            ssp.uni_motsuspen
                        FROM
                            ssp_suspension ssp
                        WHERE
                            ssp.ssp_ideregistro = :iddetalle
                            AND ssp.syr_ideregistro = :idsuspension
                    )
                ORDER BY uni.uni_ideregistro ASC";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta los conceptos
     * @param int $codRegistro identificador de la clase
     * @param int $codEmpresa ientificador de la empresa
     * @return array Listado de conceptos
     */
    public function consultarConceptos($codRegistro, $codEmpresa) {
        $parametros["codregistro"] = $codRegistro;
        $parametros["codempresa"] = $codEmpresa;
        $sql = "SELECT  con.uni_concepto as id,
                        con.con_nombre as nombre 
                FROM est_estructura est
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = est.est_ideregistro 
                                                AND esem.emp_ideregistro = :codempresa
                INNER JOIN con_concepto con on con.est_concepto = est.est_ideregistro
                WHERE est.cla_ideRegistro = :codregistro
                ORDER BY con.con_nombre";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta las novedades de suspensión de una empresa
     * @param int $codRegistro identificador de la clase
     * @param int $codEmpresa identificador de la empresa
     * @return array Listado de novedades
     */
    public function consultarNovedadesSuspension($codRegistro, $codEmpresa) {
        $parametros["codregistro"] = $codRegistro;
        $parametros["codempresa"] = $codEmpresa;
        $sql = "SELECT  
                    nov.uni_novsuspen as id,
                    nov.nosu_nombre as nombre 
                FROM nosu_novsuspen nov
                ORDER BY nov.nosu_nombre";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta las novedades de reconexión.
     * @param int $codRegistro identificador de la clase
     * @param int $codEmpresa identificador de la empresa
     * @return array Listado de novedades
     */
    public function consultarNovedadesReconexion($codRegistro, $codEmpresa) {
        $parametros["codregistro"] = $codRegistro;
        $parametros["codempresa"] = $codEmpresa;
        $sql = "SELECT 	
                    nov.uni_novreconex as id,
                    nov.norx_nombre as nombre 
                FROM norx_novreconex nov
                ORDER BY nov.norx_nombre";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta los detalles de una suscripción.
     * @param int $idSuscripcion identificador de la suscripción.
     * @return array información de la suscripción
     */
    public function consultarDetalleSuscripcion($idSuscripcion) {
        $parametros["dsus_ideregistr"] = $idSuscripcion;
        $sql = "SELECT 
                    det.pro_ideregistro 
                    ,det.cic_ideregistro
                    ,periodo.per_ideregistro
                    ,extract(YEAR from periodo.per_fecinicial) per_ano
                FROM dsus_detsuscrip det  
                    INNER JOIN cic_ciclo as ciclo ON ciclo.cic_ideregistro = det.cic_ideregistro
                    AND ciclo.cic_anoactual = EXTRACT(YEAR FROM NOW())
                    INNER JOIN per_periodo AS periodo ON periodo.cic_ideregistro = det.cic_ideregistro
                    AND periodo.per_estado = 'A' 
                    AND extract(MONTH from periodo.per_fecinicial) = extract(MONTH from now()) 
                    AND extract(YEAR from periodo.per_fecinicial) = extract(YEAR from now())
                WHERE det.dsus_estado = 'A'
                    AND dsus_ideregistr = :dsus_ideregistr";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta los detalles de una suscripción.
     * @param int $idSuscripcion identificador de la suscripción.
     * @return array información de la suscripción
     */
    public function detalleSuscripcion($idSuscripcion) {
        $parametros["idsuscripcion"] = $idSuscripcion;
        $sql = "SELECT 
                    ter.ter_documento documento, 
                    ter.ter_nomcompleto nombre, 
                    uni.uni_nombre1 tipoliquidacion,
                    tsu.tsu_nombre tiposuscripcion,
                    pro.pro_descripcion propiedad, 
                    pro.pro_idepropieda codpropiedad,
                    pro.pro_ideregistro idpropiedad,
                    dsus.dsus_pcodigo codanterior, 
                    dsus.dsus_ideregistr idsuscripcion,
                    dsus.dsus_estado estado
                FROM  
                    ter_tercero ter inner join dsus_detsuscrip dsus on ter.ter_ideregistro = dsus.ter_ideregistro
                    inner join uni_unidad uni on dsus.uni_liquidacion = uni.uni_ideregistro
                    inner join tsu_tipsuscripc tsu on dsus.uni_tipsuscripc = tsu.uni_tipsuscripc
                    inner join pro_propiedad pro on dsus.pro_ideregistro = pro.pro_ideregistro  
                WHERE
                    dsus.dsus_ideregistr = :idsuscripcion";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta un encabezado que esté en estado A
     * @param int $idEncabezado id del encabezado de una suspension
     * @return array Información del estado
     */
    public function consultarEncabezadoPorId($idEncabezado) {
        $parametros["idencabezadosuspension"] = $idEncabezado;
        $sql = "SELECT
                    syr_estado estado
                FROM
                    syr_susreconex
                WHERE
                    syr_ideregistro =:idencabezadosuspension
                AND syr_estado = 'A';";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Ingresa una nueva suspensión
     * @param array $data información de la suspensión.
     * @return int identificador de la nueva suspensión.
     */
    public function crearSuspension($idSuscripcion, $idPropiedad, $estado, $fechaGen, $fechaApro, $fechaPro, $observaciones, $idCiclo, $idperiodo, $cicloano) {
        $data["syr_estado"] = 'A';
        $data["syr_fecha"] = $fechaGen . "";
        if (!empty($fechaApro)) {
            $data["syr_fecaprobac"] = $fechaApro;
        }
        if (!empty($fechaPro)) {
            $data["syr_fecprocesad"] = $fechaPro;
        }
        $data["syr_observacion"] = $observaciones;
        $data["dsus_ideregistr"] = $idSuscripcion;
        $data["pro_ideregistro"] = $idPropiedad;
        $data["cic_ideregistro"] = $idCiclo;
        $data["per_ideregistro"] = $idperiodo;
        $data["cic_ano"] = $cicloano;
        $data["usu_ideregistro"] = $this->sesion->get("idusuario");

        return $this->insertar($data, "syr_susreconex", "sq_syr_ideregistro");
    }

    /**
     * Genera un nuevo detalle de suspensión.
     * @param array $data Información del detalle
     * @return int identificador de la suspensión.
     */
    public function crearNuevoDetalleSuspension($fechaProg, $fechaEjec, $lectura, $observacion, $motivo, $idNovedad, $idTipo, $idSuspension, $idTercero, $fechaApro, $idConcepto, $valorTotal) {
        $data["ssp_estado"] = "A";
        $data["ssp_fecha"] = "now()";
        if (!empty($fechaProg)) {
            $data["ssp_fecprgsuspe"] = $fechaProg;
        }
        if (!empty($fechaEjec)) {
            $data["ssp_fecejesuspe"] = $fechaEjec;
        }
        if (!empty($lectura)) {
            $data["ssp_lectura"] = $lectura;
        }
        if (!empty($observacion)) {
            $data["ssp_observacion"] = $observacion;
        }
        if (!empty($motivo)) {
            $data["uni_motsuspen"] = $motivo;
        }
        if (!empty($idNovedad)) {
            $data["uni_novsuspen"] = $idNovedad;
        }
        if (!empty($idTipo)) {
            $data["uni_tipsuspen"] = $idTipo;
        }
        if (!empty($idSuspension)) {
            $data["syr_ideregistro"] = $idSuspension;
        }
        if (!empty($idTercero)) {
            $data["ter_ejesuspens"] = $idTercero;
        }
        if (!empty($fechaApro)) {
            $data["ssp_fecaprobac"] = $fechaApro;
        }
        if (!empty($idConcepto)) {
            print_r($idConcepto);
            //$data["uni_concepto"] = $idConcepto;
        }
        if (!empty($valorTotal)) {
            $data["ssp_vlrtotal"] = $valorTotal;
        }
        $data["usu_ideregistro"] = $this->sesion->get("idusuario");
        $data["emp_ideregistro"] = $this->sesion->get("idempresa");
        return $this->insertar($data, "ssp_suspension", "sq_ssp_ideregistro");
    }

    /**
     * Genera una nueva reconexión.
     * @param String $fechaProg fecha de programacion
     * @param String $fechaEjec fecha de ejecucion
     * @param String $fechaApro fecha de aprobacion
     * @param int $lectura valor de la lectura
     * @param String $observacion texto de la observacion de la suspension
     * @param int $valorTotal valor total de la suspension
     * @param int $novedad id de la novedad
     * @param int $idSuspension id de la suspension
     * @param int $idConcepto id del concepto
     * @param int $idTercero id del tercero que ejecuta
     * @param int $idEmpresa id de la empresa que registra
     * @param type $motivo id del motivo de la reconexion
     * @return int numero de filas afectadas en la actualizacion
     */
    public function insertaReconexion($fechaProg, $fechaEjec, $fechaApro, $lectura, $observacion, $valorTotal, $novedad, $idSuspension, $idConcepto, $idTercero, $idEmpresa, $motivo, $idDetalle) {
        $data["rco_estado"] = "A";
        $data["rco_fecha"] = "now()";
        $data["ssp_ideregistro"] = $idDetalle;
        if (!empty($fechaProg)) {
            $data["rco_fecprgrecon"] = $fechaProg;
        }
        if (!empty($fechaEjec)) {
            $data["rco_fecejerecon"] = $fechaEjec;
        }
        if (!empty($fechaApro)) {
            $data["rco_fecaprobac"] = $fechaApro;
        }
        if (is_numeric($lectura)) {
            $data["rco_lectura"] = $lectura;
        }
        if (!empty($observacion)) {
            $data["rco_observacion"] = $observacion;
        }
        if (!empty($valorTotal)) {
            $data["rco_vlrtotal"] = $valorTotal;
        }
        if (is_numeric($novedad)) {
            $data["uni_novreconex"] = $novedad;
        }
        if (!empty($idSuspension)) {
            $data["syr_ideregistro"] = $idSuspension;
        }

        if (!empty($idConcepto)) {
            $data["uni_concepto"] = $idConcepto;
        }
        if (!empty($idTercero)) {
            $data["ter_ejereconex"] = $idTercero;
        }
        if (!empty($idEmpresa)) {
            $data["emp_ideregistro"] = $idEmpresa;
        }
        if (!empty($motivo)) {
            $data["uni_motreconex"] = $motivo;
        }
        $data["usu_ideregistro"] = $this->sesion->get("idusuario");
        $data["emp_ideregistro"] = $this->sesion->get("idempresa");
        return $this->insertar($data, "rco_reconexion", "sq_rco_ideregistro");
    }

    /**
     * Modifica el registro de una reconexión.
     * @param type $fechaProg fecha de programacion
     * @param type $fechaEjec fecha de ejecucion
     * @param type $fechaApro fecha de aprobacion
     * @param type $lectura
     * @param type $observacion
     * @param type $valorTotal
     * @param type $novedad
     * @param type $idSuspension
     * @param type $idConcepto
     * @param type $idTercero
     * @param type $idReconexion
     * @param type $motivo
     * @return type
     */
    public function actualizarReconexion($fechaProg, $fechaEjec, $fechaApro, $lectura, $observacion, $valorTotal, $novedad, $idSuspension, $idConcepto, $idTercero, $idReconexion, $motivo, $realizada) {
        $data["rco_estado"] = "A";
        if (!empty($idReconexion)) {
            $data["rco_ideregistro"] = $idReconexion;
        }
        if (!empty($fechaProg)) {
            $data["rco_fecprgrecon"] = $fechaProg;
        }
        if (!empty($fechaEjec)) {
            $data["rco_fecejerecon"] = $fechaEjec;
        }
        if (!empty($fechaApro)) {
            $data["rco_fecaprobac"] = $fechaApro;
        }
        if (!empty($idReconexion)) {
            $data["rco_lectura"] = $lectura;
        }
        if (!empty($idReconexion)) {
            $data["rco_observacion"] = $observacion;
        }
        if (!empty($idReconexion)) {
            $data["rco_vlrtotal"] = $valorTotal;
        }
        if (!empty($idReconexion)) {
            $data["uni_novreconex"] = $novedad;
        }
        if (!empty($idReconexion)) {
            $data["syr_ideregistro"] = $idSuspension;
        }
        if (!empty($idConcepto)) {
            $data["uni_concepto"] = $idConcepto;
        }
        if (!empty($idTercero)) {
            $data["ter_ejereconex"] = $idTercero;
        }
        if (!empty($motivo)) {
            $data["uni_motreconex"] = $motivo;
        }
        if (!empty($realizada)) {
            $data["rco_realizada"] = $realizada;
        }
        return $this->actualizar($data, "rco_reconexion", "rco_ideregistro = :rco_ideregistro");
    }

    /**
     * Realiza el cambio de estado de una actualizacion a C 
     * @param int $idRegistroDetalle id de la reconexion
     * @return int
     */
    public function eliminarReconexion($idRegistroDetalle) {
        $data["rco_ideregistro"] = $idRegistroDetalle;
        $data["rco_ideregistro"] = $idRegistroDetalle;
        $data["rco_estado"] = "C";
        return $this->actualizar($data, "rco_reconexion", "rco_ideregistro = :rco_ideregistro");
    }

    /**
     * Modifica una suspensión
     * @param array $data Detalle de la suspensión.
     * @return int número de filas modificadas
     * @throws MyException Error al modificar la suspensión.
     */
    public function editarSuspension($idSuspension, $fecha, $fechaApro, $fechaProc, $observacion, $idSuscripcion) {
        $data["syr_ideregistro"] = $idSuspension;
        $data["syr_fecha"] = $fecha;
        $data["syr_fecaprobac"] = $fechaApro;
        $data["syr_fecprocesad"] = $fechaProc;
        $data["syr_observacion"] = $observacion;
        $data["dsus_ideregistr"] = $idSuscripcion;
        return $this->actualizar($data, "syr_susreconex", "syr_ideregistro = :syr_ideregistro");
    }

    /**
     * Consulta el detalle de la suspensión.
     * @param int $idSuspension identificador de la suspensión
     * @return array Información de la suspensión.
     */
    public function consultarDetallesSuspension($idSuspension) {
        $parametros["id_suspension"] = $idSuspension;
        $sql = "SELECT 
                    sus.ssp_fecprgsuspe fechaprogramacion, 
                    sus.ssp_fecejesuspe fechaejecucion, 
                    sus.ssp_realizada ejecutada,
                    sus.uni_motsuspen idmotivosuspension, 
                    sus.ter_ejesuspens idtercerosuspension, 
                    ter.ter_nomcompleto nombretercerosuspension, 
                    sus.ssp_lectura lectura, 
                    sus.ssp_estado estado, 
                    sus.ssp_ideregistro iddetallesuspension, 
                    sus.uni_tipsuspen idtiposuspension, 
                    sus.uni_novsuspen idnovedadsuspension, 
                    uni.uni_nombre1 tiposuspension,
                    sus.ssp_observacion observacion,
                    sus.ssp_vlrtotal valortotal
                FROM 
                    ssp_suspension sus left join ter_tercero ter on sus.ter_ejesuspens = ter.ter_ideregistro
                    left join uni_unidad uni on sus.uni_tipsuspen = uni.uni_ideregistro
                WHERE
                    sus.syr_ideregistro = :id_suspension AND ssp_estado <> 'C'";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * actualiza el detalle de una suspensión
     * @param int $idDetalleSuspension id del detalle de la suspension
     * @param string $fechaProg fecha de programacion de la suspension
     * @param string $fechaEjec fecha de ejecucion de la suspension
     * @param int $motivo id del motivo
     * @param int $idNovedad id de la novedad
     * @param int $idTipo id del tipo de suspension
     * @param int $idTercero id del tercero que ejecuta la suspension
     * @param int $lectura valor de la lectura
     * @param type $observacion observacion de la suspension
     * @param string $ejecutada si la suspension fue ejecutada
     * @param int $idConcepto id del concepto de la suspension
     * @return int número de filas afectadas.
     */
    public function editarDetalleSuspension($idDetalleSuspension, $fechaProg, $fechaEjec, $motivo, $idNovedad, $idTipo, $idTercero, $lectura, $observacion, $ejecutada, $idConcepto, $valorTotal) {
        $data["ssp_ideregistro"] = $idDetalleSuspension;
        if (!empty($fechaProg)) {
            $data["ssp_fecprgsuspe"] = $fechaProg;
        }
        if (!empty($fechaEjec)) {
            $data["ssp_fecejesuspe"] = $fechaEjec;
        }
        if (!empty($lectura)) {
            $data["ssp_lectura"] = $lectura;
        }
        if (!empty($observacion)) {
            $data["ssp_observacion"] = $observacion;
        }
        if (!empty($motivo)) {
            $data["uni_motsuspen"] = $motivo;
        }
        if (!empty($idNovedad)) {
            $data["uni_novsuspen"] = $idNovedad;
        }
        if (!empty($idTipo)) {
            $data["uni_tipsuspen"] = $idTipo;
        }
        if (!empty($idTercero)) {
            $data["ter_ejesuspens"] = $idTercero;
        }
        if (!empty($ejecutada)) {
            $data["ssp_realizada"] = $ejecutada;
        }
        if (!empty($idConcepto)) {
            $data["uni_concepto"] = $idConcepto;
        }
        if (!empty($valorTotal)) {
            $data["ssp_vlrtotal"] = $valorTotal;
        }
        $resultado = $this->actualizar($data, "ssp_suspension", "ssp_ideregistro = :ssp_ideregistro");
        return $resultado;
    }

    /**
     * Elimina un detalle de suspensión.
     * @param array $idRegistroDetalle información de la suspensión.
     * @return int número de filas afectadas.
     */
    public function eliminarDetalleSuspension($idRegistroDetalle) {
        $data["ssp_ideregistro"] = $idRegistroDetalle;
        $data["ssp_feceliminacion"] = "now()";
        $data["ssp_estado"] = "C";
        $resultado = $this->actualizar($data, "ssp_suspension", "ssp_ideregistro = :ssp_ideregistro");
        return $resultado;
    }

    /**
     * metodo para colocar en estado c las suspensiones no ejecutadas anteriores al registro de una nueva suspension
     * @param int $idRegistroDetalle id del registro al que se le debe aplicar el estado C
     * @param int $idDetalle id de la suspension que se escluye del estado C
     * @return int numero de filas afectadas
     */
    public function alterEliminarDetalleSuspension($idRegistroDetalle, $idDetalle) {
        $data["ssp_ideregistro"] = $idRegistroDetalle;
        $data["ssp_feceliminacion"] = "now()";
        $data["ssp_estado"] = "C";
        $resultado = $this->actualizar($data, "ssp_suspension", "ssp_ideregistro = :ssp_ideregistro AND ssp_ideregistro <> " . $idDetalle . " AND ssp_fecejesuspe IS NULL");
        return $resultado;
    }

    /**
     * Elimina una suspensión.
     * @param array $data información de la suspensión.
     * @return int número de filas afectadas.
     */
    public function eliminarSuspension($estado, $idSuspension) {
        $data["syr_estado"] = $estado;
        $data["syr_ideregistro"] = $idSuspension;
        return $this->actualizar($data, "syr_susreconex", "syr_ideregistro = :syr_ideregistro");
    }

    /**
     * Consulta una reconexión apartir de una suspensión
     * @param int $idSuspension identificador de la suspensión
     * @return array Listado de reconexiones.
     */
    public function consultarReconexion($idSuspension) {
        $parametros["idsuspension"] = $idSuspension;
        $sql = "SELECT
                    rco.rco_ideregistro idreconexion,
                    rco.rco_estado estado,
                    rco.rco_fecprgrecon fechaprogramacion,
                    rco.rco_fecejerecon fechaejecucion,
                    rco.rco_fecaprobac fechaaprobacion,
                    rco.rco_lectura lectura,
                    rco.rco_observacion observaciones,
                    rco.rco_vlrtotal valortotal,
                    rco.uni_novreconex idnovedadreconexion,
                    rco.syr_ideregistro idcabecerasuspension,
                    rco.uni_concepto concepto,
                    rco.ter_ejereconex idterceroreconexion,
                    ter.ter_nomcompleto nombreempresareconexion,
                    rco.ssp_ideregistro idsuspension,
                    rco.uni_motreconex idmotivoreconexion,
                    rco.rco_realizada realizada
                FROM
                    rco_reconexion rco
                LEFT JOIN ter_tercero ter ON rco.ter_ejereconex = ter.ter_ideregistro
                WHERE
                    rco.syr_ideregistro = :idsuspension 
                AND rco_estado <> 'C'";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Actualiza la cabecera  de suspensión y reconexión.
     * @param array $data Información de la cabecera.
     * @return int número de filas afectadas.
     */
    public function actualizarCabecera($data) {
        return $this->actualizar($data, "syr_susreconex", "syr_ideregistro = :syr_ideregistro");
    }

    /**
     * Consulta las suspensiones a una suscripción.
     * @param int $idSuscripcion identificador de la suspensión.
     * @return array Listado de suscripciones
     */
    public function consultarSuspension($idSuscripcion) {
        $parametros["dsus_ideregistr"] = $idSuscripcion;
        $sql = "SELECT 
                    syr.syr_ideregistro idsuspension, 
                    syr.syr_estado estado, 
                    cic.cic_nombre ciclo, 
                    per.per_nombre || ' - ' ||syr.cic_ano  periodo, 
                    syr.syr_fecha fechageneracion, 
                    syr.syr_fecaprobac fechaaprobacion, 
                    syr.syr_fecprocesad fechaprocesamiento, 
                    syr.syr_observacion observacion
                  FROM 
                    per_periodo per inner join syr_susreconex syr on per.per_ideregistro = syr.per_ideregistro
                    inner join cic_ciclo cic on per.cic_ideregistro = cic.cic_ideregistro
                  WHERE
                    dsus_ideregistr = :dsus_ideregistr AND syr_estado <> 'E'
                  ORDER BY
                    syr.syr_fecha desc;";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta los tipos de suspensión
     * @param int $codRegistro identificador de la clase
     * @param int $codEmpresa identificador de la empresa
     * @return array listado de los tipos de suspensión.
     */
    public function consultarTiposSuspension($codRegistro, $codEmpresa) {
        $parametros["codregistro"] = $codRegistro;
        $parametros["codempresa"] = $codEmpresa;
        $sql = "select 
                    uni.uni_ideregistro idtiposuspension,
                    uni.uni_nombre1 tiposuspension
                  from
                    uni_unidad uni inner join est_estructura est on uni.est_ideregistro=est.est_ideregistro
                    inner join cla_clase cla on est.cla_ideregistro=cla.cla_ideregistro
                    inner join esem_estempresa esem on est.est_ideregistro=esem.est_ideregistro
                  where 
                    cla.cla_ideregistro= :codregistro and 
                    esem.emp_ideregistro = :codempresa   ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * @deprecated since version 1 
     * Consulta los terceros (Se recomienda utilizar la función de generico model consultar tercero)
     * @param string $nombre nombre del tercero
     * @return array Listado de los terceros.
     */
    public function consultarTercero($nombre) {
       $parametros["ter_nomcompleto"] = "%" . strtolower(trim($nombre)) . "%";
        $parametros["id_empresa"] = $this->sesion->get("idempresa");
        $sql = "SELECT
                    ter.ter_ideregistro idtercero,
                    ter.ter_documento documento,
                    trim(ter.ter_nomcompleto) nombretercero,
                    ter.ter_telcelular telefonocelular,
                    ter.ter_telfijo telefonofijo,
                    ter.ter_correo correo,
                    ciu.ciudad_cod codigolugarexpedicion,
                    ciu.ciudad_nom lugarexpedicion
                FROM
                    ter_tercero ter
                LEFT JOIN ciudades ciu ON ter.ciudad_cod = ciu.ciudad_cod
                LEFT JOIN empresas emp ON ciu.ciudad_codemp = emp.empresa_cod
                WHERE
                    LOWER (TRIM(ter_nomcompleto)) LIKE :ter_nomcompleto OR  ter.ter_documento LIKE :ter_nomcompleto
                    --AND emp.empresa_sevemp = id_empresa
                LIMIT 100";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consult ala informacion del ultimo detalle de suspension registrado para
     * un encabezado
     * @param int $idEncabezado id del encabezado de suspension
     * @return array informacion del detalle de suspension
     */
    public function consultarUltimaSuspension($idEncabezado) {
        $parametros["syr_ideregistro"] = $idEncabezado;
        $sql = "SELECT
                    ssp.ssp_ideregistro idsuspension,
                    ssp.ssp_estado estado,
                    ssp.ssp_fecprgsuspe fechaprogramacion,
                    ssp.ssp_fecejesuspe fechaejecucion,
                    ssp.ssp_realizada realizada,
                    ssp.ssp_lectura lectura
                FROM
                    ssp_suspension ssp
                WHERE
                    ssp.syr_ideregistro = :syr_ideregistro
                ORDER BY
                    ssp.ssp_fecha DESC
                LIMIT 1";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta el encabezado de la suspension para una suscripcion en un ciclo
     * y periodo determinado
     * @param int $idSuscripcion id de la suscripcion
     * @param int $idCiclo id del ciclo
     * @param int $idPeriodo id del periodo
     * @param int $cicanio id del año del ciclo
     * @return array informacion del encabezado de la suscripcion
     */
    public function consultarEncabezadoSuspension($idSuscripcion, $idCiclo, $idPeriodo, $cicanio) {
        $parametros["dsus_ideregistr"] = $idSuscripcion;
        $parametros["cic_ideregistro"] = $idCiclo;
        $parametros["per_ideregistro"] = $idPeriodo;
        $parametros["cic_anoactual"] = $cicanio;
        $sql = "SELECT
                    syr.syr_ideregistro idsuspension,
                    syr.syr_estado estado,
                    syr.syr_observacion observacion
                FROM
                    per_periodo per
                    INNER JOIN syr_susreconex syr ON per.per_ideregistro = syr.per_ideregistro
                    INNER JOIN cic_ciclo cic ON per.cic_ideregistro = cic.cic_ideregistro
                WHERE
                    dsus_ideregistr = :dsus_ideregistr
                    AND cic.cic_ideregistro = :cic_ideregistro
                    AND per.per_ideregistro = :per_ideregistro
                    AND cic.cic_anoactual = :cic_anoactual
                    AND syr.syr_estado = 'A'
                ORDER BY
                    syr.syr_fecha DESC
                LIMIT 1";

        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta el motivo de una suspension
     * @param string $tipo tipo del motivo de la suspension
     * @return array informacion del tipo de suspension
     */
    public function obtenerMotivoPorTipo($tipo) {
        $parametros["mosu_proceso"] = strtoupper($tipo);
        $sql = "SELECT
                    mosu.uni_motsuspen idmotivo
                FROM
                    mosu_motsuspen mosu INNER JOIN dtsu_dettipsusc dtsu
                    ON mosu.uni_motsuspen = dtsu.uni_motsuspen
                WHERE
                    mosu.mosu_proceso = :mosu_proceso
                LIMIT 1";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta la informacion de la ultima reconexion registrada para un 
     * detalle de suspension
     * @param int $idSuspension id del detalle de suspension
     * @return array informacion de la reconexion
     */
    public function consultarUltimaReconexion($idSuspension) {
        $parametros["ssp_ideregistro"] = $idSuspension;
        $sql = "SELECT
                    rco.rco_ideregistro idreconexion,
                    rco.rco_fecprgrecon fechaprogramacion,
                    rco.rco_fecejerecon fechaejecucion,
                    rco.rco_realizada realizada,
                    rco.rco_lectura lectura,
                    rco.ssp_ideregistro idsuspension
                FROM
                    rco_reconexion rco
                WHERE
                    rco.ssp_ideregistro = :ssp_ideregistro
                ORDER BY
                    rco_fecha DESC
                LIMIT 1";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Se verifica que si la suscripción ya tiene encabezado de suspensión de reconexión.
     * @param int $idSuscripcion identificador de la suscripción.
     * @param int $idCiclo identificador del ciclo.
     * @param type $idPeriodo
     * @return array
     */
    public function tieneEncabezadoSuspensionReconexion($idSuscripcion, $idCiclo, $idPeriodo) {
        $sql = "SELECT    
                    syr.syr_ideregistro idsuspensionreconexion
                FROM 
                    syr_susreconex syr inner join per_periodo per on per.per_ideregistro = syr.per_ideregistro
                WHERE 
                    syr.dsus_ideregistr = $idSuscripcion 
                    AND per.per_ideregistro = $idPeriodo 
                    AND per.cic_ideregistro = $idCiclo
                    LIMIT 1";
        //AND syr.syr_estado in ('A', 'G') 
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    /**
     * Consulta la última suspensión dependiendo por el identificador del encabezado.
     * @param int $idSuspensionReconexion identificador del encabezado de suspensión.
     * @return array detalle de la suspensión 
     */
    public function consultarUltimaSuspensionPorEncabezado($idSuspensionReconexion) {
        $parametros["idsuspensionreconexion"] = $idSuspensionReconexion;
        $sql = "SELECT 
                    ssp.ssp_ideregistro idsuspension,ssp.ssp_estado estado,ssp.ssp_fecejesuspe fechasuspension
		FROM 
                    ssp_suspension ssp 
		WHERE
                    ssp.syr_ideregistro=:idsuspensionreconexion and ssp.ssp_estado ='A'
                    order by ssp.ssp_fecha desc
                    LIMIT 1 ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (!empty($resultado)) {
            return $resultado[0];
        }
        return $resultado;
    }

    /**
     * Consulta la última reconexión dependiendo por el identificador del encabezado.
     * @param int $idSuspensionReconexion identificador del encabezado de suspensión.
     * @return array detalle de la suspensión 
     */
    public function consultarUltimaReconexionPorEncabezado($idSuspensionReconexion) {
        $parametros["idsuspensionreconexion"] = $idSuspensionReconexion;
        $sql = "SELECT 
                    rco_ideregistro idreconexion,
                    rco_estado estado
                FROM 
                    rco_reconexion 
                WHERE
                    syr_ideregistro=:idsuspensionreconexion
                    order by rco_fecha desc
                    LIMIT 1";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Actualiza el estado de suspensión.
     * @param string $estado estado de la suspensión.
     * @param int $idSuspension identificador de la suspensión.
     * @return array número de filas afectadas.
     */
    public function actualizarEstadoSuspension($estado, $idSuspension, $observacion) {
        $data["ssp_estado"] = $estado;
        $data["ssp_ideregistro"] = $idSuspension;
        $data["ssp_observacion"] = $observacion;
        return $this->actualizar($data, "ssp_suspension", "ssp_ideregistro=:ssp_ideregistro");
    }

    /**
     * Modifica el estado de la reconexión.
     * @param string $estado Estado de la reconexión.
     * @param int $idReconexion identificador de la reconexión.
     * @return array Número de filas actualizadas
     */
    public function actualizarEstadoReconexion($estado, $idReconexion) {
        $data["rco_estado"] = $estado;
        $data["rco_idregistro"] = $idReconexion;
        return $this->actualizarReconexion($data);
    }

    /**
     * Consulta las suspensiones por empresa
     * @param int $idEmpresa identificador de la empresa
     * @return array Listado de las suspensiones.
     */
    public function consultarSuspensionesPorEmpresa($idEmpresa) {
        $parametros["idEmpresa"] = $idEmpresa;
        $sql = "SELECT  
                    syr.dsus_ideregistr idsuscripcion,
                    syr.per_ideregistro idperiodo,
                    ssp.ssp_fecejesuspe fechasuspension,
                    syr.syr_ideregistro idsuspensionreconexion,
                    ssp.ssp_ideregistro idsuspension,
                    ssp.ssp_estado estadosuspension
                FROM 
                    ssp_suspension ssp  inner join syr_susreconex syr on ssp.syr_ideregistro=syr.syr_ideregistro
                    inner join dsus_detsuscrip dsus on syr.dsus_ideregistr=dsus.dsus_ideregistr
                WHERE
                    ssp.ssp_estado in ('A','E') and syr.syr_estado='A' and dsus.emp_ideregistro=:idEmpresa";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta si el tipo de suscripción genera suspensión.
     * @param int $idEmpresa identificador de la empresa
     * @return array Listado de los tipos de suscripciones.
     */
    public function consultarTiposSuscripcionGeneraSuspension($idEmpresa) {
        $objRecaudoModel = new RecaudosModel($this->conexion);
        $complemento = "and tsu.tsu_persuspend='S'";
        return $objRecaudoModel->consultarTiposSuscripcion($idEmpresa, $complemento);
    }

    /**
     * consulta para llenar un campo de autocomplete los municipios autorizados
     * para el perfil de un usuario
     * @param String $municipio
     * @return array retorna los municipios agrupados por id y nombre de las coinciden
     * cias de la consulta
     */
    public function autocompleteMunicipio($municipio) {
        $parametros["codempresa"] = $this->sesion->get('idempresa');
        $parametros["codusuario"] = $this->sesion->get('idusuario');
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
                AND uspr.prg_ideregistro = 16
                AND upper(pry.proyecto_nom) LIKE :municipio LIMIT 100";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta el valor de un concepto para los motivos de suspensiones
     * @param type $concepto
     * @return type
     */
    public function consultarValorConcepto($concepto) {
        $parametros["uni_concepto"] = $concepto;
        $sql = "SELECT con.con_valor valor
                FROM con_concepto con
                WHERE con.uni_concepto = :uni_concepto";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta la informacion del id detalle de la suspension para registrar
     * una nueva reconexion asociada a ese detalle
     * @param type $idSuspension id del detalle de la suspension
     * @return array informacion del id del detalle de la suspension
     */
    public function consultarSuspensionParaReconexion($idSuspension , $idusuario) {
        $parametros["syr_ideregistro"] = $idSuspension;
        $parametros["idusuario"] = $idusuario;
        $sql = "SELECT
                    ssp.ssp_ideregistro iddetallesuspension
                    FROM
                    ssp_suspension ssp
                    INNER JOIN mosu_motsuspen mosu on ssp.uni_motsuspen=mosu.uni_motsuspen
                    INNER JOIN prun_prgunidad prun on prun.uni_ideregistro=mosu.uni_motsuspen 
                    INNER JOIN uspu_usuprgunid uspu on uspu.prun_ideregistr=prun.prun_ideregistr
                    LEFT JOIN rco_reconexion rco   ON ssp.ssp_ideregistro = rco.ssp_ideregistro
                    WHERE
                    ssp.syr_ideregistro = :syr_ideregistro
                    AND 
                    ssp.ssp_fecejesuspe = (
                            SELECT MAX(ssp_fecejesuspe)
                            FROM ssp_suspension ssps
                            INNER JOIN mosu_motsuspen mosu on ssps.uni_motsuspen=mosu.uni_motsuspen
                            INNER JOIN prun_prgunidad prun on prun.uni_ideregistro=mosu.uni_motsuspen 
                            INNER JOIN uspu_usuprgunid uspu on uspu.prun_ideregistr=prun.prun_ideregistr
                            WHERE ssps.syr_ideregistro = :syr_ideregistro and ssps.ssp_realizada = 'S' and uspu.usu_ideregistro= :idusuario
                        )
                    AND ssp.ssp_realizada = 'S'
                    AND (
                    rco.rco_ideregistro IS NULL
                    OR rco.rco_estado = 'C'
                    )
                    and uspu.usu_ideregistro= :idusuario
                    ORDER BY
                    ssp.ssp_fecejesuspe DESC
                    LIMIT 1";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * obtiene el valor por concepto para la novedad de suspenion seleccionada
     * @param int $idNovedadSus id de la novedad de la suspension
     * @return array valor de la novedad
     */
    public function consultarValorNovedadSus($idNovedadSus) {
        $parametros["uni_novsuspen"] = $idNovedadSus;
        $sql = "SELECT
                    con.con_valor valortotal,
                    con.uni_concepto idconcepto
                FROM
                    nosu_novsuspen nosu
                INNER JOIN con_concepto con ON nosu.uni_concepto = con.uni_concepto
                WHERE nosu.uni_novsuspen = :uni_novsuspen";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * obtiene el valor por concepto para la novedad de suspenion seleccionada
     * @param type $idNovedadRec id de la novedad de reconexion seleccionada
     * @return array valor de la novedad
     */
    public function consultarValorNovedadRec($idNovedadRec) {
        $parametros["uni_novsuspen"] = $idNovedadRec;
        $sql = "SELECT
                    con.con_valor valortotal,
                    con.uni_concepto idconcepto
                FROM
                    norx_novreconex norx
                INNER JOIN con_concepto con ON norx.uni_concepto = con.uni_concepto
                WHERE norx.uni_novreconex = :uni_novsuspen";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }
    
    public function habilitarSSRXModelo($programa, $idUsuario, $idEstructura, $idEmpresa){
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idusuario'] = $idUsuario;
        $parametros['idestructura'] = $idEstructura;
        $parametros['idprograma'] = $programa;
        
        try {
            $sql ="SELECT count(*) contador
                    FROM uspu_usuprgunid uspu 
                    inner join prun_prgunidad prun on prun.prun_ideregistr = uspu.prun_ideregistr
                    INNER JOIN uni_unidad uni on uni.uni_ideregistro = prun.uni_ideregistro
                    inner join esem_estempresa esem on esem.est_ideregistro = uni.est_ideregistro
                    where prun.prg_ideregistro = :idprograma and uspu.usu_ideregistro = :idusuario and uni.est_ideregistro = :idestructura
                    and esem.emp_ideregistro = :idempresa";
            return $this->executeQuery($sql, $parametros);
        } catch (\Exception $ex) {
            throw new MyException("Error, Usuario no tiene permisos", -1);
        }
    }
    
    public function actualizarDetallesuspensionHabilitar($idsuspension,$idregistrodetalle){
        $data['ssp_fecejesuspe'] = null;
        $data['ssp_vlrtotal'] = null;        
        $data['ssp_ideregistro'] = $idregistrodetalle;
        
        try {
             return $this->actualizar($data, "ssp_suspension", "ssp_ideregistro=:ssp_ideregistro");
        } catch (\Exception $ex) {
            throw new MyException("Error, no se pudo Actualizar",-1);
        }
    }
    
    
    public function actualizarDetallereconexionHabilitar($idsuspension,$idregistrodetalle){
        $data['rco_fecejerecon'] = null;
        $data['rco_vlrtotal'] = null;        
        $data['rco_ideregistro'] = $idregistrodetalle;
        
        try {
             return $this->actualizar($data, "rco_reconexion", "rco_ideregistro = :rco_ideregistro");
        } catch (\Exception $ex) {
           
            throw new MyException("Error, no se pudo Actualizar",-1);
        }
    }
    
    public function getInformacionFacturaFinanaciacionSaldo($idSuscripcion,$idEmpresa){
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idsuscripcion'] = $idSuscripcion;
        
        
        try {
            $sql ="select 
                ((select count(*) from fac_factura  fac 
                where emp_ideregistro = :idempresa and fac.dsus_ideregistr = :idsuscripcion and fac_sdoreal >0 and fac.fac_idepadre is null and fac.fac_estado = 'A')
                +
                (select count(*) from fin_financiacio fin where fin.emp_ideregistro  = :idempresa and fin.dsus_ideregistr  = :idsuscripcion and fin.fin_sdocapital >0 and fin.fin_idepadre is null)) cantidad";
            return $this->executeQuery($sql, $parametros);
        } catch (\Exception $ex) {
            throw new MyException("Error, No se ejecuto la Consulta", -1);
        }
    }
    
    public function getInformacionSuscripcionEncabezado($idsyr){
        $parametros['idsyr'] = $idsyr;
        
        
        try {
            $sql ="SELECT dsus_ideregistr idsuscripcion from  syr_susreconex where syr_ideregistro = :idsyr";
            $idSuscripcion = $this->executeQuery($sql, $parametros);
            if(empty($idSuscripcion)){
                return $idSuscripcion;
            }
            return $idSuscripcion[0];
        } catch (\Exception $ex) {
            throw new MyException("Error, No se ejecuto la Consulta", -1);
        }
    }

    
    public function  editaEstadoSuscripcion($idSuscripcion,$estado){
        $inicial = 'now()';        
        $final = "(now()::date + (interval '1 YEAR'))::date";
         try {
        $sql = "UPDATE dsus_detsuscrip set dsus_estado ='". $estado."',	dsus_iniestado = $inicial,	dsus_finestado = $final,	usu_ideregistro = 587	WHERE 	dsus_ideregistr = $idSuscripcion";
        $this->executeQuery($sql);
        } catch (\Exception $ex) {
            throw new MyException("Error, no se pudo Actualizar la suscripcion",-1);
        }
    }
    
    public function ActualizaSuscripcionTemporal($idSuscripcion){
        $data['dsus_estado'] = 'A';        
        $data['dsus_ideregistr'] = $idSuscripcion;
        try {
             return $this->actualizar($data, "dsus_detsuscrip", "dsus_ideregistr = :dsus_ideregistr");
        } catch (\Exception $ex) {
            throw new MyException("Error, no se pudo Actualizar la suscripcion",-1);
        }
    }
    
    
}
