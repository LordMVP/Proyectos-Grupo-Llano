<?php

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ProcesoSuspensionModel
 *
 * @author mebonilla
 */
class ProcesoSuspensionModel extends AuditoriaServices {

    /**
     *
     * @var SessionInterface 
     */
    private $sesion;
    private $idempresa;

    /**
     * Constructor de la clase
     * @param Connection $conexion
     * @param Connection $sesion
     */
    public function __construct(&$conexion, &$sesion = null) {
        $this->setConexion($conexion);
        if ($sesion != null) {
            $this->sesion = $sesion;
            $this->idempresa = $sesion->get('idempresa');
        }
    }

    /**
     * Consulta las suscripciones a las que se les pueden generar una suspension
     * @param int $idTipUso id del tipo de uso de las suscripciones
     * @param int $desde valor inicial del intervalo de cantidad de facturas con
     * saldo que deben tener las suscripciones
     * @param int $hasta valor final del intervalo de cantidad de facturas con
     * saldo que deben tener las suscripciones
     * @param date $fechaIni valor inicial del intervalo de la fecha de
     * vencimiento de la suscripcion
     * @param date $fechaFin valor inicial del intervalo de la fecha de
     * vencimiento de la suscripcion
     * @return array 
     */
    public function consultarSuscripcionesProceso($idEmpresa, $idTipUso, $desde, $hasta, $fechaIni, $fechaFin, $idmunicipio) {
        $parametros["idempresa"] = $idEmpresa;
        $parametros["tipouso"] = $idTipUso;
        $parametros["desde"] = $desde;
        $parametros["hasta"] = $hasta;
        $parametros["fechaini"] = $fechaIni;
        $parametros["fechafin"] = $fechaFin;
        $parametros["municipios"] = $idmunicipio;
       
        //@Date 2017-04-04
        //Se crea complemento para que cuando salgan las suspensiones descarten las que tengan ya registradas
        //por el motivo de RTR o Defecto crÃ­tico

        $complemento = "AS suscripciones
                        WHERE
                          suscripciones.idsuscripcion
                          NOT IN (
                            SELECT syr.dsus_ideregistr
                            FROM syr_susreconex syr INNER JOIN ssp_suspension ssp ON syr.syr_ideregistro = ssp.syr_ideregistro
                              INNER JOIN mosu_motsuspen mosu ON ssp.uni_motsuspen = mosu.uni_motsuspen
                              LEFT JOIN rco_reconexion rco ON ssp.ssp_ideregistro = rco.ssp_ideregistro
                            WHERE mosu.mosu_proceso IN ('D', 'R','G' )
                                  AND ssp.ssp_estado = 'A' AND syr.syr_estado = 'A'
                                  AND (ssp.ssp_realizada IS NULL OR ssp.ssp_realizada = 'S')
                                  AND (rco.rco_realizada = 'N' OR rco.rco_realizada IS NULL OR rco.rco_ideregistro IS NULL)
                           UNION  ALL 
                                SELECT syr.dsus_ideregistr
                                    FROM syr_susreconex syr INNER JOIN ssp_suspension ssp ON syr.syr_ideregistro = ssp.syr_ideregistro                                                            
                                    WHERE 
                                  ssp.ssp_estado = 'A' AND syr.syr_estado = 'A'
                                 AND ssp.ssp_realizada IS NULL AND ($desde<>999 and $hasta<>999)       
                          )";
        print_r($parametros);
        if ($fechaIni == "0000/00/00" && $fechaFin == "0000/00/00") {
            $sql = "select * from consultarsuscripcionesprocesosyr(:idempresa::int, '{" . $idTipUso . "}'::int[],:desde::int,:hasta::int,null,null, '{" . $idmunicipio . "}'::int[])  ";
        } else if (($desde == "0" || $desde == NULL) & ($hasta == "0" || $desde == NULL) & ($fechaIni == "0" || $desde == NULL) & ($fechaFin == "0" || $desde == NULL)) {
            $sql = "select * from consultarsuscripcionesprocesosyr(:idempresa::int, '{" . $idTipUso . "}'::int[],null,null,null,null, '{" . $idmunicipio . "}'::int[])  ";
        } else {
             $sql = "select * from consultarsuscripcionesprocesosyr(:idempresa::int, '{" . $idTipUso . "}'::int[],:desde::int,:hasta::int,'$fechaIni'::date,'$fechaFin'::date, '{" . $idmunicipio . "}'::int[]) ";
        }
        $resultado = $this->executeQuery($sql, $parametros);
        
        if (empty($resultado)) {
           return $resultado;
        }
         return $resultado;
    }

    /**
     * Consulta el encabezado de la suspension para una suscripcion en un ciclo
     * y periodo determinado
     * @param int $idSuscripcion id de la suscripcion
     * @param int $idCiclo id del ciclo
     * @param int $idPeriodo id del periodo
     * @param int $cicanio id del aÃ±o del ciclo
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
     * Registra un nuevo encabezado de suspension para una suscripcion para un
     * ciclo y un periodo especifico
     * @param int $idSuscripcion id de la suscripcion
     * @param int $idCiclo id del ciclo
     * @param int $idperiodo id del periodo
     * @param int $cicloano aÃ±o del ciclo
     * @param int $idPropiedad id de la propiedad de la suscripcion
     * @param int $idUsuario id del usuario que registra el encabezado
     * @return int id del nuevo encabezado de suspension
     */
    public function registrarEncabezadoProceso($idSuscripcion, $idCiclo, $idperiodo, $cicloano, $idPropiedad, $idUsuario) {
        $data["syr_estado"] = "A";
        $data["syr_fecha"] = "now()";
        $data["dsus_ideregistr"] = $idSuscripcion;
        $data["pro_ideregistro"] = $idPropiedad;
        $data["cic_ideregistro"] = $idCiclo;
        $data["per_ideregistro"] = $idperiodo;
        $data["cic_ano"] = $cicloano;
        $data["usu_ideregistro"] = intval($idUsuario);
        return $this->insertar($data, "syr_susreconex", "sq_syr_ideregistro");
    }

    /**
     * Registra un nuevo detalle de suspension para un encabezado especifico
     * @param int $motivo id del motivo del detalle
     * @param int $encabezado id del encabezado de suspension
     * @param int $idUsuario id del usuario que registra el detalle
     * @return int id de el nuevo detalle de suspension
     */
    public function registrarSuspensionProceso($motivo, $encabezado, $idUsuario,$idempresa) {
        $data["ssp_estado"] = "A";
        $data["ssp_fecha"] = "now()";
        $data["ssp_fecprgsuspe"] = "now()";
        $data["ssp_fecaprobac"] = "now()";
        //$data["ssp_realizada"] = "N";
        $data["uni_motsuspen"] = $motivo;
        $data["syr_ideregistro"] = intval($encabezado);
        $data["usu_ideregistro"] = intval($idUsuario);
        $data["emp_ideregistro"] = $idempresa;
        return $this->insertar($data, "ssp_suspension", "sq_ssp_ideregistro");
    }

    /**
     * Registra un detalle de suspension con fecha de ejecucion y realizada
     * @param int $motivo id del motivo del detalle de la suspension
     * @param int $encabezado id del encabezado de la suspension
     * @param int $idUsuario id del usuario que registra el detalle
     * @return int id de el nuevo detalle de suspension
     */
    public function registrarSuspensionProcesoEjecutado($motivo, $encabezado, $idUsuario) {
        $data["ssp_estado"] = "A";
        $data["ssp_fecha"] = "now()";
        $data["ssp_fecprgsuspe"] = "now()";
        $data["ssp_fecejesuspe"] = "now()";
        $data["ssp_fecaprobac"] = "now()";
        $data["ssp_realizada"] = "S";
        $data["uni_motsuspen"] = $motivo;
        $data["syr_ideregistro"] = intval($encabezado);
        $data["usu_ideregistro"] = intval($idUsuario);
        $data["emp_ideregistro"] = $this->idempresa;
        return $this->insertar($data, "ssp_suspension", "sq_ssp_ideregistro");
    }

    /**
     * Registra una reconexion para un encabezado especifico
     * @param int $motivo id del motivo de reconexion
     * @param int $suspension id del detalle de suspension
     * @param int $encabezado id del encabezado de suspension
     * @param int $idUsuario id del usuario que registra la reconexion
     * @return int id de la nueva reconexion
     */
    public function registrarReconexionProceso($motivo, $suspension, $encabezado, $idUsuario, $idEmpresa) {
        $data["rco_estado"] = "A";
        $data["rco_fecha"] = "now()";
        $data["rco_fecprgrecon"] = "now()";
        $data["rco_fecaprobac"] = "now()";
        //$data["rco_realizada"] = "N";
        $data["uni_motreconex"] = $motivo;
        $data["ssp_ideregistro"] = intval($suspension);
        $data["syr_ideregistro"] = intval($encabezado);
        $data["usu_ideregistro"] = intval($idUsuario);
        $data["emp_ideregistro"] = $idEmpresa;
        $reconexion = $this->insertar($data, "rco_reconexion", "sq_rco_ideregistro");
        print_r("Reconexión generada \n");
        print_r($reconexion);
        return $reconexion;
    }

    /**
     * Consulta el ciclo y periodo actual de una suscripcion
     * @param int $idSuscripcion id de la suscripcion
     * @return int
     */
    public function obtenerCicloPeriodoActualSuscripcion($idSuscripcion) {
        $parametros["dsus_ideregistr"] = $idSuscripcion;
        $sql = "SELECT 
                    cic.cic_ideregistro idciclo,
                    per.per_ideregistro idperiodo,
                    cic.cic_anoactual cicloanio
                FROM
                    cic_ciclo cic
                    INNER JOIN per_periodo per ON per.cic_ideregistro = cic.cic_ideregistro
                    INNER JOIN dsus_detsuscrip dsus ON cic.cic_ideregistro = dsus.cic_ideregistro
                WHERE
                    per.per_estado = 'A'
                    AND dsus.dsus_ideregistr = :dsus_ideregistr";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consultar el perÃ­odo anterior de la suscripciÃ³n
     * @param type $idSuscripcion
     * @return type
     */
    public function obtenerCicloPeriodoAnteriorSuscripcion($idSuscripcion) {
        $parametros["dsus_ideregistr"] = $idSuscripcion;
        $sql = "SELECT
                    cic.cic_ideregistro idciclo,
                    per.per_ideregistro idperiodo,
                    cic.cic_anoactual cicloanio
                FROM
                    cic_ciclo cic
                    INNER JOIN per_periodo per ON per.cic_ideregistro = cic.cic_ideregistro
                    INNER JOIN dsus_detsuscrip dsus ON cic.cic_ideregistro = dsus.cic_ideregistro
                WHERE
                    per.per_ideregistro < (
                            SELECT
                                    per2.per_ideregistro
                            FROM
                                    per_periodo per2
                            WHERE
                                    per2.per_estado = 'A'
                            AND per2.cic_ideregistro =cic.cic_ideregistro
                    )
                    AND dsus.dsus_ideregistr = :dsus_ideregistr
                ORDER BY per.per_ideregistro DESC
                LIMIT 1 ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    public function getPeriodoPorCiclo($idCiclo) {
        $parametros['idciclo'] = $idCiclo;
        $sql = "SELECT  cic.cic_ideregistro idciclo,
                        cic.cic_anoactual cicloanio,
                        per.per_ideregistro idperiodo
                FROM    cic_ciclo cic inner join per_periodo per on per.cic_ideregistro = cic.cic_ideregistro
                WHERE   cic.cic_ideregistro =:idciclo AND
                        per.per_estado = 'A' ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    public function actualizarEstadoGestionCartera($idCiclo) {
        $data["cic_ideregistro"] = $idCiclo;
        $data["ges_estado"] = "C";
        $tabla = "ges_gestion";
        $condicion = "cic_ideregistro = :cic_ideregistro";
        $resultado = $this->actualizar($data, $tabla, $condicion);
        return $resultado;
    }

    public function actualizarEstadoEncabezado($idEncabezado) {
        $data["syr_ideregistro"] = $idEncabezado;
        $data["syr_estado"] = "A";
        $condicion = "syr_ideregistro = :syr_ideregistro";
        $resultado = $this->actualizar($data, 'syr_susreconex', $condicion);
        return $resultado;
    }

    public function removerValorSuspension($suspension) {
        $data["ssp_ideregistro"] = $suspension["idsuspension"];
        $data["ssp_vlrtotal"] = 0;

        $resultado = $this->actualizar($data, "ssp_suspension", "ssp_ideregistro = :ssp_ideregistro");
        return $resultado;
    }

    public function removerValorReconexion($reconexion) {
        $data["rco_ideregistro"] = $reconexion["idreconexion"];
        $data["rco_vlrtotal"] = 0;
        $tabla = "rco_reconexion";
        $condicion = "rco_ideregistro = :rco_ideregistro";
        $resultado = $this->actualizar($data, $tabla, $condicion);
        return $resultado;
    }

    public function getReconexionSuspension($suspension) {
        $parametros["idsuspension"] = $suspension["idsuspension"];
        $sql = "SELECT
                    rco.rco_ideregistro idreconexion
                FROM
                    ssp_suspension ssp
                    INNER JOIN syr_susreconex syr ON syr.syr_ideregistro = ssp.syr_ideregistro
                    INNER JOIN rco_reconexion rco ON rco.syr_ideregistro = syr.syr_ideregistro
                WHERE
                    ssp.ssp_ideregistro = :idsuspension";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    public function consultarSuspensionesRealizadas($idCiclo) {
        $parametros["idciclo"] = $idCiclo;
        $parametros["valorsuspension"] = VALOR_SUSPENSION_RECONEXION;
        $sql = "SELECT DISTINCT ssp.ssp_ideregistro idsuspension
                FROM cic_ciclo cic
                    INNER JOIN per_periodo per ON per.cic_ideregistro = cic.cic_ideregistro
                    INNER JOIN syr_susreconex syr ON syr.per_ideregistro = per.per_ideregistro
                    INNER JOIN ssp_suspension ssp ON ssp.syr_ideregistro = syr.syr_ideregistro
                    INNER JOIN dire_disrecaudo dire ON dire.dsus_ideregistr = syr.dsus_ideregistr
                    INNER JOIN rec_recaudo rec ON rec.rec_ideregistro = dire.rec_ideregistro
                    INNER JOIN mosu_motsuspen mosu on mosu.uni_motsuspen = ssp.uni_motsuspen
                WHERE
                    cic.cic_ideregistro =:idciclo
                    AND syr.cic_ano = cic.cic_anoactual
                    AND per.per_estado = 'A'
                    AND ssp.ssp_realizada = 'S'
                    AND ssp.ssp_vlrtotal > 0
                    AND ssp.ssp_estado = 'A'
                    AND dire.cic_ideregistro = cic.cic_ideregistro
                    AND dire.per_ideregistro = syr.per_ideregistro
                    AND mosu.mosu_proceso not in ('D','R','G')
                    AND rec.rec_estado IN ('A', 'G', 'P')
                    AND rec.rec_idepadre IS NULL
                    AND rec_fecpago < ssp.ssp_fecejesuspe
                    AND (
                            SELECT
                            COALESCE(SUM(dfac.dfac_sdoreal),0)
                            FROM
                            fac_factura fac
                            INNER JOIN dfac_detfactura dfac ON fac.fac_ideregistro = dfac.fac_ideregistro
                            INNER JOIN con_concepto con ON con.uni_concepto = dfac.uni_concepto
                            WHERE
                            fac.dsus_ideregistr = syr.dsus_ideregistr
                            AND fac.cic_ano = cic.cic_anoactual
                            AND fac.fac_estado = 'A'
                            AND fac.fac_idepadre IS NULL
                            AND fac_sdoreal > 0
                            AND dfac_sdoreal > 0
                            AND fac.fac_fecvence < now()
                            AND con_suspende = 'S' 
                        ) < :valorsuspension;";
        return $this->executeQuery($sql, $parametros);
    }

    public function getConceptosSuspension(array $parametros) {
        if (empty($parametros)) {
            throw new MyException('Debe tener un complemento la selección de datos');
        }
        $parametros["valorsuspension"] = VALOR_SUSPENSION_RECONEXION;
        $sql = "SELECT
                        fac.fac_ideregistro
                FROM
                        fac_factura fac
                INNER JOIN syr_susreconex syr ON syr.dsus_ideregistr = fac.dsus_ideregistr
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = syr.cic_ideregistro
                INNER JOIN ssp_suspension ssp ON syr.syr_ideregistro = ssp.syr_ideregistro
                INNER JOIN dfac_detfactura dfac ON fac.fac_ideregistro = dfac.fac_ideregistro
                INNER JOIN con_concepto con ON con.uni_concepto = dfac.uni_concepto
                WHERE
                fac.fac_ideregistro = :idfactura
                AND fac.fac_estado = 'A'
                AND fac.fac_idepadre IS NULL
                AND fac.cic_ano = cic.cic_anoactual
                AND fac_sdoreal > 0
                AND dfac_sdoreal > 0
                AND fac.fac_fecvence < ssp.ssp_fecejesuspe
                AND con_suspende = 'S'
                GROUP BY fac.fac_ideregistro
                HAVING SUM(dfac.dfac_sdoreal) > :valorsuspension";
        return $this->executeQuery($sql, $parametros);
    }

    public function getRecaudosAnterioresSuspension($suspension) {
        $parametros['idsuscripcion'] = $suspension['idsuscripcion'];
        $parametros['fechaejecucion'] = $suspension['fechaejecucion'];
        $parametros['idciclo'] = $suspension['idciclo'];
        $sql = "SELECT
                    rec.rec_ideregistro idrecaudo
                FROM
                    rec_recaudo rec
                    INNER JOIN drec_detrecaudo drec ON drec.rec_ideregistro = rec.rec_ideregistro
                    INNER JOIN dire_disrecaudo dire ON dire.dire_ideregistr = drec.dire_ideregistr 
                    INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = dire.cic_ideregistro
                    INNER JOIN per_periodo per ON per.per_ideregistro = dire.per_ideregistro
                WHERE
                    rec.rec_estado in ('A','G','P') 
                    AND rec.rec_idepadre is null
                    AND per.per_estado = 'A'
                    AND rec_fecpago < :fechaejecucion
                    AND cic.cic_ideregistro = :idciclo 
                    AND dire.dsus_ideregistr = :idsuscripcion";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function getGestionRecaudo($recaudo) {
        $parametros['idrecaudo'] = $recaudo['idrecaudo'];
        $sql = "SELECT
                    fage.ges_ideregistro idgestion
                FROM
                    dire_disrecaudo dire
                    INNER JOIN drec_detrecaudo drec ON drec.dire_ideregistr = dire.dire_ideregistr 
                    INNER JOIN dfac_detfactura dfac ON dfac.dfac_ideregistr = drec.dfac_ideregistr 
                    INNER JOIN fage_facgestion fage ON fage.fac_ideregistro = dfac.fac_ideregistro
                WHERE
                    dire.rec_ideregistro = :idrecaudo";
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
            throw new Exception('No se encontraron motivos de suspensión', -1);
        }
        return $resultado[0];
    }

    /**
     * Consulta el motivo de una reconexion
     * @param int $tipo tipo del motivo de reconexion
     * @return array informacion del tipo de reconexion
     */
    public function obtenerMotivoRec($tipo) {
        $parametros["morx_proceso"] = strtoupper($tipo);
        $sql = "SELECT 
                    morx.uni_motreconex idmotivorec,
                    mosu.uni_motsuspen idmotivosus
                FROM 
                    morx_motreconex morx INNER JOIN mosu_motsuspen mosu
                    ON morx.mosu_ideregistro = mosu.uni_motsuspen
                    INNER JOIN dtsu_dettipsusc dtsu
                    ON mosu.uni_motsuspen = dtsu.uni_motsuspen
                WHERE
                    morx.morx_proceso = :morx_proceso
                LIMIT 1";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta el id de la propiedad de una suscripcion
     * @param type $idSuscripcion id de la suscripcion
     * @return array informacion de la propiedad
     */
    public function obtenerPropiedadSuscripcion($idSuscripcion) {
        $parametros["dsus_ideregistr"] = $idSuscripcion;
        $sql = "SELECT
                    dsus.pro_ideregistro idpropiedad
                FROM
                    dsus_detsuscrip dsus
                WHERE
                    dsus.dsus_ideregistr = :dsus_ideregistr";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
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
                    ssp.ssp_lectura lectura,
                    mosu.mosu_proceso tipo
                FROM
                    ssp_suspension ssp
                    INNER JOIN mosu_motsuspen mosu on mosu.uni_motsuspen = ssp.uni_motsuspen
                WHERE
                    ssp.syr_ideregistro = :syr_ideregistro and ssp.ssp_estado ='A' and (ssp.ssp_realizada is null or ssp.ssp_realizada = '')
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
     * Consulta la informacion de la ultima reconexion registrada para un 
     * detalle de suspension
     * @param int $idSuspension id del detalle de suspension
     * @return array informacion de la reconexion
     */
    public function consultarUltimaReconexion($idSuspension, $complemento = " AND rco_realizada = 'S'") {
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
                    AND rco.rco_estado <> 'C' 
                    $complemento
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
     * Cancela un detalle de suspension actualizando su estado a "C"
     * @param int $idSuspension id del detalle de suspension a actualizar
     * @return int numero de filas afectadas despues de la actualizacion
     */
    public function cancelarSuspension($idSuspension) {
        $data["ssp_ideregistro"] = $idSuspension;
        $data["ssp_estado"] = "C";
        $data["ssp_observacion"] = "SS Cancelada Volumen Covid";
        $resultado = $this->actualizar($data, "ssp_suspension", "ssp_ideregistro = :ssp_ideregistro");
        return $resultado;
    }

    /**
     * Cancela una reconeion actualizando su estado a "C"
     * @param int $idReconexion id de la reconexion a actualizar
     * @return int numero de filas afectadas despues de la actualizacion
     */
    public function cancelarReconexion($idReconexion) {
        $data["rco_ideregistro"] = $idReconexion;
        $data["rco_estado"] = "C";
        return $this->actualizar($data, "rco_reconexion", "rco_ideregistro = :rco_ideregistro");
    }

    /**
     * Consulta la ultima lectura de una suscripcion para un determinado ciclo,
     * periodo y fecha especifica
     * @param int $idSuscripcion id de la suscripcion
     * @param int $idCiclo id del ciclo de la suscripcion
     * @param int $idPeriodo id del periodo de la suscripcion
     * @param date $fecha fecha de la lectura
     * @return array informacion de la lectura
     */
    public function consultarUltimaLectura($idSuscripcion, $idCiclo, $idPeriodo, $fecha) {
        $parametros["dsus_ideregistr"] = $idSuscripcion;
        $parametros["cic_ideregistro"] = $idCiclo;
        $parametros["per_ideregistro"] = $idPeriodo;
        $parametros["dlec_fecejecuta"] = $fecha; ///Ya no se valida por fecha porque se asume que el ÃƒÂºltimo encabezado procesado tiene la ÃƒÂºltima lectura despuÃƒÂ©s de la suspensiÃƒÂ³n (Dicho por leo, Hebert y Kelly)
        $sql = "SELECT
                    lec.lec_actual lecturaactual
                FROM
                    lec_lectura lec
                WHERE
                    lec.dsus_ideregistr = :dsus_ideregistr
                    AND lec.per_ideregistro = :per_ideregistro
                    AND lec.cic_ideregistro = :cic_ideregistro
                ORDER BY lec.lec_ideregistro DESC
                LIMIT 1";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta si existe una reconexion posterior a un detalle de suspension
     * con una fecha de ejecucion especifica
     * @param type $idEncabezado id del encabezado de suspension
     * @param type $fechaEjecucion fecha de ejecucion de un detalle de suspension
     * @return array informcion de la reconexion
     */
    public function consultarSuspensionPosteriorReconexion($idEncabezado, $fechaEjecucion) {
        $parametros["syr_ideregistro"] = $idEncabezado;
        $parametros["ssp_fecprgsuspe"] = $fechaEjecucion;
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
                    AND ssp.ssp_fecprgsuspe < :ssp_fecprgsuspe
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
     * Reasigna una reconexion a un detalle de supension
     * @param int $idReconexion id de la reconexion
     * @param int $idSuspension id del detalle de suspension
     * @return int numero de filas afectadas
     */
    public function reasignarReconexion($idReconexion, $idSuspension) {
        $data["rco_ideregistro"] = $idReconexion;
        $data["ssp_ideregistro"] = $idSuspension;
        return $this->actualizar($data, "rco_reconexion", "rco_ideregistro = :rco_ideregistro");
    }

    /**
     * Actualiza la informacion de una suscripcion a estado A
     * @param int $idSuscripcion
     * @return int numero de filas afectadas
     */
    public function actualizarSuscripcion($idSuscripcion) {
        $data["dsus_ideregistr"] = $idSuscripcion;
        $data["dsus_estado"] = "A";
        $data["dsus_iniestado"] = null;
        $data["dsus_finestado"] = null;
        return $this->actualizar($data, "dsus_detsuscrip", "dsus_ideregistr = :dsus_ideregistr");
    }

    /**
     * Actualiza la informacion de una suscripcion a estado A
     * @param int $idSuscripcion
     * @return int numero de filas afectadas
     */
    public function consultarSumatoriaFacturasDeSuscripcion($idSuscripcion, $idEmpresa) {
        $parametros["idsuscripcion"] = $idSuscripcion;
        $parametros["idempresa"] = $idEmpresa; //--AND fac.emp_ideregistro = :idempresa
        $sql = "SELECT
                        COALESCE (SUM(dfac.dfac_sdoreal), 0) saldofacturas,
                        fac.dsus_ideregistr idsuscripcion
                FROM
                        fac_factura fac
                INNER JOIN dfac_detfactura dfac ON fac.fac_ideregistro = dfac.fac_ideregistro
                WHERE
                        fac.dsus_ideregistr = :idsuscripcion
                AND fac.fac_estado = 'A'
                AND fac.fac_idepadre IS NULL
                AND fac.fac_sdoreal > 0                
                GROUP BY
                        fac.dsus_ideregistr; ";

        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['saldofacturas'];
    }

    /**
     * Consulta la informacion de una suscripcion segun el ciclo de un encabezado
     * @param array $parametros id del ciclo del encabezado
     * @return int informacion de la suscripcion 
     */
    public function obtenerSuscripcionesEncabezadoActual($parametros) {
        $sql = "SELECT      dsus.dsus_iniestado fechaini,
                            dsus.dsus_finestado fechafin,
                            dsus.dsus_estado estado,
                            dsus.dsus_ideregistr idsuscripcion,
                            dsus.uni_municipio idmunicipio,
                            syr.syr_ideregistro idencabezado
                FROM        syr_susreconex syr
                INNER JOIN  dsus_detsuscrip dsus ON syr.dsus_ideregistr = dsus.dsus_ideregistr
                WHERE       syr_estado ='A'
                    AND     syr.cic_ideregistro = :idciclo
                    AND     syr.per_ideregistro = :idperiodo 
                UNION                
                SELECT      dsus.dsus_iniestado fechaini,
                            dsus.dsus_finestado fechafin,
                            dsus.dsus_estado estado,
                            dsus.dsus_ideregistr idsuscripcion,
                            dsus.uni_municipio idmunicipio,
                            syr.syr_ideregistro idencabezado
                FROM        syr_susreconex syr
                INNER JOIN  ssp_suspension ssp on ssp.syr_ideregistro = syr.syr_ideregistro 
                    and     ssp.uni_motsuspen = 102 
                    AND     ssp.ssp_estado <> 'C'
                INNER JOIN  dsus_detsuscrip dsus ON syr.dsus_ideregistr = dsus.dsus_ideregistr 
                WHERE       syr.cic_ideregistro = :idciclo  
                    AND     dsus.dsus_estado IN ('U', 'R') and  now() > dsus.dsus_finestado  
                    and     syr.syr_ideregistro = ( SELECT      MAX(sspmax.syr_ideregistro) 
                                                    FROM 	syr_susreconex syrmax 										
                                                    INNER JOIN 	ssp_suspension sspmax ON sspmax.syr_ideregistro = syrmax.syr_ideregistro 
                                                        and     syrmax.dsus_ideregistr = dsus.dsus_ideregistr
                                                    WHERE 	sspmax.uni_motsuspen = 102 
                                                        AND     sspmax.ssp_estado <> 'C' )  
                UNION
                SELECT      dsus.dsus_iniestado fechaini,
                            dsus.dsus_finestado fechafin,
                            dsus.dsus_estado estado,
                            dsus.dsus_ideregistr idsuscripcion,
                            dsus.uni_municipio idmunicipio,
                            syr.syr_ideregistro idencabezado
                FROM        syr_susreconex syr
                INNER JOIN  ssp_suspension ssp on ssp.syr_ideregistro = syr.syr_ideregistro 
                    AND     ssp.ssp_estado <> 'C'
                INNER JOIN  dsus_detsuscrip dsus ON syr.dsus_ideregistr = dsus.dsus_ideregistr 
                INNER JOIN  fac_factura fac ON	fac.dsus_ideregistr = syr.dsus_ideregistr 
                    and     fac.fac_estado = 'A' 
                    and     fac.fac_idepadre is null 
                    and     fac.fac_sdoreal > 0
                WHERE       syr.cic_ideregistro = :idciclo  
                    AND     dsus.dsus_estado IN ('U', 'R') ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado;
    }

    /**
     * Consulta la informacion de una suscripcion segun el ciclo de un encabezado
     * @param array $parametros id del ciclo del encabezado
     * @return int informacion de la suscripcion 
     */
    public function obtenerSuscripcionEncabezado($parametros) {
        $sql = "SELECT
                        dsus.dsus_iniestado fechaini,
                        dsus.dsus_finestado fechafin,
                        dsus.dsus_estado estado,
                        dsus.dsus_ideregistr idsuscripcion,
                        dsus.uni_municipio idmunicipio,
                        syr.syr_ideregistro idencabezado
                FROM
                        syr_susreconex syr
                INNER JOIN	ssp_suspension ssp on ssp.syr_ideregistro = syr.syr_ideregistro and ssp.uni_motsuspen = 102 AND ssp.ssp_estado <> 'C'
                INNER JOIN dsus_detsuscrip dsus ON syr.dsus_ideregistr = dsus.dsus_ideregistr 
                WHERE
                    syr.cic_ideregistro = :idciclo  AND dsus.dsus_estado IN ('U', 'R')   
                    and syr.syr_ideregistro = (	
                        SELECT 			MAX(sspmax.syr_ideregistro) 
                        FROM 				syr_susreconex syrmax 										
                        INNER JOIN 	ssp_suspension sspmax ON sspmax.syr_ideregistro = syrmax.syr_ideregistro and syrmax.dsus_ideregistr = dsus.dsus_ideregistr
                                                                                             WHERE 	sspmax.uni_motsuspen = 102 AND sspmax.ssp_estado <> 'C' 
                    )  AND dsus.dsus_ideregistr = :idsuscripcion ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado[0];
        }
        return $resultado[0];
    }

    /**
     * Consulta la informacion completa de un encabezado de suspension
     * @param int $idEncabezado id del encabezado de suspension
     * @return array informacion del encabezado de suspension
     */
    public function consultarEncabezadoCompleto($idEncabezado) {
        $parametros["syr_ideregistro"] = $idEncabezado;
        $sql = "SELECT
                    syr.syr_ideregistro idencabezado,
                    syr.syr_estado estado,
                    syr.syr_fecha fecha,
                    syr.syr_fecaprobac fechaaprobacion,
                    syr.syr_fecprocesad fechaprocesado,
                    syr.syr_observacion observacion,
                    syr.dsus_ideregistr idsuscripcion,
                    syr.pro_ideregistro idpropiedad,
                    syr.per_ideregistro idperiodo,
                    syr.cic_ano cicano,
                    syr.cic_ideregistro idciclo
                FROM
                    syr_susreconex syr
                WHERE
                    syr.syr_ideregistro = :syr_ideregistro";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta la informacion completa de un detalle de suspension
     * @param int $idSuspension id del detalle de suspension
     * @return array informacion del detalle de suspension
     */
    public function consultarSuspensionCompleto($idSuspension, $vlr_suspension) {
        $parametros["ssp_ideregistro"] = $idSuspension;
        $sql = "SELECT ssp.ssp_fecprgsuspe fechaprogramacion, 
                    ssp.ssp_fecejesuspe fechaejecucion, 
                    ssp.ssp_realizada ejecutada,
                    ssp.uni_motsuspen idmotivosuspension, 
                    ssp.ter_ejesuspens idtercerosuspension, 
                    ssp.ssp_lectura lectura, 
                    ssp.ssp_estado estado, 
                    ssp.ssp_ideregistro iddetallesuspension, 
                    ssp.uni_tipsuspen idtiposuspension, 
                    ssp.uni_novsuspen idnovedadsuspension,
                    ssp.ssp_observacion observacion,
                    ssp.ssp_fecaprobac fechaaprobacion,
                    ssp.uni_concepto idconcepto,
                    $vlr_suspension valortotal
                FROM ssp_suspension ssp
                WHERE ssp.ssp_ideregistro = :ssp_ideregistro";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta la informacion completa de una reconexion
     * @param int $idReconexion id de la reconexion
     * @return array informacion de la reconexion
     */
    public function consultarReconexionCompleto($idReconexion) {
        $parametros["rco_ideregistro"] = intval($idReconexion);
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
                    rco.ssp_ideregistro idsuspension,
                    rco.emp_ideregistro idempresa,
                    rco.uni_motreconex idmotivoreconexion,
                    rco.rco_realizada realizada
                FROM
                    rco_reconexion rco
                WHERE
                    rco.rco_ideregistro = :rco_ideregistro";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta cual es el periodo siguiente de un ciclo
     * @param int $idCiclo id del ciclo
     * @param int $idPeriodo id del periodo
     * @return array informacion del siguiente periodo del ciclo
     */
    public function consultarPeriodoSiguiente($parametros) {
        $sql = "SELECT
                    per.per_ideregistro idperiodo
                FROM
                    per_periodo per
                WHERE
                    per.per_ideorden IN (
                        SELECT
                             (CASE
                               WHEN  per2.per_ideorden = (select max(per_ideorden) 
                                                          from per_periodo 
                                                          where cic_ideregistro =:idciclo ) THEN 1
                              ELSE
                                 per2.per_ideorden  + 1
                              END
                             )
                            
                        FROM
                            per_periodo per2
                        WHERE
                            per2.per_ideregistro = :idperiodo
                        AND per2.cic_ideregistro = :idciclo
                    )
                AND per.cic_ideregistro = :idciclo AND per.per_estado ='B'";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0]['idperiodo'];
    }

    /**
     * consulta el ciclo general de una empresa
     * @param int $idEmpresa id de la empresa a consultar
     * @return array informacion del ciclo general de una empresa
     */
    public function getCicloGeneralEmpresa($idEmpresa) {
        $parametros["emp_ideregistro"] = $idEmpresa;
        $sql = "SELECT
                    ciem.cic_ideregistro idciclo
                FROM
                    ciem_cicempresa ciem
                WHERE
                    ciem.emp_ideregistro = :emp_ideregistro
                ORDER BY
                    ciem.ciem_ideregistr DESC
                LIMIT 1";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Modifica la informacion de la suscripcion a estado "A"
     * @param int $idSuscripcion id de la suscripcion
     * @return int numero de filas afectadas
     */
    public function modificarSuscripcion($idSuscripcion, $idusuario) {
        $data["dsus_ideregistr"] = $idSuscripcion;
        $data["dsus_estado"] = "A";
        $data["dsus_iniestado"] = NULL;
        $data["dsus_finestado"] = NULL;
        $data["usu_ideregistro"] = $idusuario;
        return $this->actualizar($data, "dsus_detsuscrip", "dsus_ideregistr = :dsus_ideregistr");
    }

    /**
     * Consulta informacion adicional de una suscripcion
     * @param int $idsuscripcion id de la suscripcion
     * @return array informacion de la suscripcion
     */
    public function infoAdicionalDsus($idsuscripcion) {
        $parametros["idsuscripcion"] = $idsuscripcion;
        $sql = "SELECT
                    dsus.dsus_estado estado,
                    dsus.dsus_finestado fechafin,
                    dsus.dsus_iniestado fechaini,
                    dsus.uni_municipio idmunicipio
                FROM
                    dsus_detsuscrip dsus
                WHERE
                    dsus.dsus_ideregistr = :idsuscripcion";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Ingresa un nuevo encabezado de suspensiÃ³n
     * @param array $data informaciÃ³n del nuevo encabezado de la suspensiÃ³n.
     * @return int identificador del nuevo encabezado de la nueva suspensiÃ³n.
     */
    public function crearEncabezadoSuspension($encabezado, $idCiclo, $idperiodo, $cicloano, $idUsuario) {

        $data["syr_estado"] = 'A';
        $data["syr_fecha"] = 'now()';
        if (!empty($encabezado["fechaaprobacion"])) {
            $data["syr_fecaprobac"] = $encabezado["fechaaprobacion"];
        }
        if (!empty($encabezado["fechaprocesado"])) {
            $data["syr_fecprocesad"] = $encabezado["fechaprocesado"];
        }
        $data["syr_observacion"] = $encabezado["observacion"];
        $data["dsus_ideregistr"] = $encabezado["idsuscripcion"];
        $data["pro_ideregistro"] = $encabezado["idpropiedad"];
        $data["cic_ideregistro"] = $idCiclo;
        $data["per_ideregistro"] = $idperiodo;
        $data["cic_ano"] = $cicloano;
        $data["usu_ideregistro"] = $idUsuario;
        print_r("lo que se va insertar en el encabezado");
        print_r($data);
        return $this->insertar($data, "syr_susreconex", "sq_syr_ideregistro");
    }

    /**
     * Genera un nuevo detalle de suspensiÃ³n.
     * @param array $suspension informacion del detalle de suspension
     * @param int $idEncabezado id del encabezado
     * @param int $idUsuario id del usuario que registra el detalle
     * @param int $idEmpresa id de la empresa del usuario en sesion
     * @return int id de registro del detalle de suspension
     */
    public function crearDetalleSuspension($suspension, $idEncabezado, $idUsuario, $idEmpresa) {
        $data["ssp_estado"] = "A";
        $data["ssp_fecha"] = "now()";
        if (!empty($suspension["ejecutada"])) {
            $data["ssp_realizada"] = $suspension["ejecutada"];
        }
        if (!empty($suspension["fechaprogramacion"])) {
            $data["ssp_fecprgsuspe"] = $suspension["fechaprogramacion"];
        }
        if (!empty($suspension["fechaejecucion"])) {
            $data["ssp_fecejesuspe"] = $suspension["fechaejecucion"];
        }
        if (!empty($suspension["lectura"])) {
            $data["ssp_lectura"] = $suspension["lectura"];
        }
        if (!empty($suspension["observacion"])) {
            $data["ssp_observacion"] = $suspension["observacion"];
        }
        if (!empty($suspension["idmotivosuspension"])) {
            $data["uni_motsuspen"] = $suspension["idmotivosuspension"];
        }
        if (!empty($suspension["idnovedadsuspension"])) {
            $data["uni_novsuspen"] = $suspension["idnovedadsuspension"];
        }
        if (!empty($suspension["idtiposuspension"])) {
            $data["uni_tipsuspen"] = $suspension["idtiposuspension"];
        }
        if (!empty($idEncabezado)) {
            $data["syr_ideregistro"] = $idEncabezado;
        }
        if (!empty($suspension["idtercerosuspension"])) {
            $data["ter_ejesuspens"] = $suspension["idtercerosuspension"];
        }
        if (!empty($suspension["fechaaprobacion"])) {
            $data["ssp_fecaprobac"] = $suspension["fechaaprobacion"];
        }
        if (!empty($suspension["idconcepto"])) {
            $data["uni_concepto"] = $suspension["idconcepto"];
        }
        if (!empty($suspension["valortotal"])) {
            $data["ssp_vlrtotal"] = $suspension["valortotal"];
        }
        $data["usu_ideregistro"] = $idUsuario;
        $data["emp_ideregistro"] = $idEmpresa;
        return $this->insertar($data, "ssp_suspension", "sq_ssp_ideregistro");
    }

    /**
     * Genera una nueva Reconexion
     * @param type $reconexion informacion de la reconexion
     * @param int $encabezado id del encabezado de la suspension
     * @param int $suspension id del detalle de la suspension
     * @param int $idUsuario id del usuario que registra el detalle
     * @param int $idEmpresa id de la empresa del usuario en sesion
     * @return int
     */
    public function crearReconexion($reconexion, $encabezado, $suspension, $idUsuario, $idEmpresa) {
        $data["rco_estado"] = "A";
        $data["rco_fecha"] = "now()";
        if (!empty($reconexion["realizada"])) {
            $data["rco_realizada"] = $reconexion["realizada"];
        }
        $data["ssp_ideregistro"] = $suspension;
        if (!empty($reconexion["fechaprogramacion"])) {
            $data["rco_fecprgrecon"] = $reconexion["fechaprogramacion"];
        }
        if (!empty($reconexion["fechaejecucion"])) {
            $data["rco_fecejerecon"] = $reconexion["fechaejecucion"];
        }
        if (!empty($reconexion["fechaaprobacion"])) {
            $data["rco_fecaprobac"] = $reconexion["fechaaprobacion"];
        }
        if (is_numeric($reconexion["lectura"])) {
            $data["rco_lectura"] = $reconexion["lectura"];
        }
        if (!empty($reconexion["observaciones"])) {
            $data["rco_observacion"] = $reconexion["observaciones"];
        }
        if (!empty($reconexion["valortotal"])) {
            $data["rco_vlrtotal"] = $reconexion["valortotal"];
        }
        if (is_numeric($reconexion["idnovedadreconexion"])) {
            $data["uni_novreconex"] = $reconexion["idnovedadreconexion"];
        }
        if (!empty($encabezado)) {
            $data["syr_ideregistro"] = $encabezado;
        }
        if (!empty($reconexion["concepto"])) {
            $data["uni_concepto"] = $reconexion["concepto"];
        }
        if (!empty($reconexion["idterceroreconexion"])) {
            $data["ter_ejereconex"] = $reconexion["idterceroreconexion"];
        }
        if (!empty($reconexion["idmotivoreconexion"])) {
            $data["uni_motreconex"] = $reconexion["idmotivoreconexion"];
        }
        $data["usu_ideregistro"] = $idUsuario;
        $data["emp_ideregistro"] = $idEmpresa;
        return $this->insertar($data, "rco_reconexion", "sq_rco_ideregistro");
    }

    /**
     * Modifica el estado de un encabezado de suspension
     * @param int $idSuspension id del encabezado de la suspensiÃ³n.
     * @return int nÃºmero de filas modificadas
     * @throws MyException Error al modificar la suspensiÃ³n.
     */
    public function editarEstadoSuspension($idSuspension) {
        $data["syr_ideregistro"] = $idSuspension;
        $data["syr_estado"] = 'P';
        return $this->actualizar($data, "syr_susreconex", "syr_ideregistro = :syr_ideregistro");
    }

    /**
     * Permite validar si una suscripcion tiene registros en pqr (reclamos)
     * sin cerrar que impide que se realice una suspension
     * @param int $idSuscripcion id de la suscripcion a suspender
     * @return array contiene informacion del numero de solicitudes abiertas
     * a la suscripcion
     */
    public function validarSolicitudPqr($idSuscripcion) {
        $parametros["idsuscripcion"] = $idSuscripcion;
        $sql = "SELECT
                    COUNT(*) numerosolicitudes
                FROM
                    reclamos rec
                INNER JOIN solicitudes sol ON rec.reclamo_codrec = sol.solicitud_cod
                INNER JOIN(
                    SELECT
                            dsus.dsus_pcodigo,
                            emp.empresa_cod
                    FROM
                            dsus_detsuscrip dsus
                    inner join empresas emp on dsus.emp_ideregistro = emp.empresa_sevemp
                    WHERE
                            dsus.dsus_ideregistr = :idsuscripcion
                ) as temp ON temp.empresa_cod = sol.solicitud_codemp AND temp.dsus_pcodigo = rec.reclamo_codsus
                WHERE
                     sol.solicitud_nosus = 't'
                AND(
                    select
                            count(*)
                    from
                            visitas_sol vs
                    where
                            vs.visitasol_numpqr = rec.reclamo_numpqr
                    and vs.visitasol_codemp = temp .empresa_cod
                    AND vs.visitasol_est = '0048'
                ) = 0;";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    public function eliminarTablaResumenSuspensiones($empresa) {
        $sql = "drop table if exists proceso_suspensiones_$empresa;";
        $this->executeQuery($sql);
    }

    public function crearTablaResumenSuspensiones($empresa) {
        $this->eliminarTablaResumenSuspensiones($empresa);
        $sql = "create table if not exists proceso_suspensiones_$empresa( idsuscripcion int8, idencabezado int8, idmunicipio int8, tiposuspension character varying(2), iddetalle int8, descripcion character varying(200), estado character varying(2), usu_ideregistro int4);";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function eliminarTablaResumenReconexiones($empresa) {
        $sql = "drop table if exists proceso_reconexiones_$empresa;";
        $this->executeQuery($sql);
    }

    public function crearTablaResumenReconexiones($empresa) {
        $this->eliminarTablaResumenReconexiones($empresa);
        $sql = "create table if not exists proceso_reconexiones_$empresa( idsuscripcion int8, idencabezado int8, idmunicipio int8, tiporeconexion character varying(2), idreconexion int8, descripcion character varying(200), estado character varying(2), usu_ideregistro int4);";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function eliminarTablaResumenCierre($empresa) {
        $sql = "drop table if exists proceso_cierre_syr_$empresa;";
        $this->executeQuery($sql);
    }

    public function crearTablaResumenCierre($empresa) {
        $this->eliminarTablaResumenCierre($empresa);
        $sql = "create table if not exists proceso_cierre_syr_$empresa( idsuscripcion int8, idencabezado int8, idmunicipio int8, descripcion character varying(200), estado character varying(2), usu_ideregistro int4);";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    public function insertarResumenProcesoSuspensiones($idSuscripcion, $idEncabezado, $idMunicipio, $tipoSuspension, $idDetalle, $descripcion, $estado, $empresa, $idUsuario) {
        print_r("valor de Empresa " . $empresa);
        $data["idsuscripcion"] = $idSuscripcion;
        $data["idencabezado"] = $idEncabezado;
        $data["idmunicipio"] = $idMunicipio;
        $data["tiposuspension"] = $tipoSuspension;
        $data["iddetalle"] = $idDetalle;
        $data["descripcion"] = $descripcion;
        $data["estado"] = $estado;
        $data['usu_ideregistro'] = $idUsuario;
        $tabla = strval("proceso_suspensiones_" . $empresa);
        return $this->insertar($data, $tabla, null);
    }

    public function insertarResumenProcesoReconexiones($idSuscripcion, $idEncabezado, $idMunicipio, $tipoReconexion, $idReconexion, $descripcion, $estado, $empresa, $idUsuario) {
        $data["idsuscripcion"] = $idSuscripcion;
        $data["idencabezado"] = $idEncabezado;
        $data["idmunicipio"] = $idMunicipio;
        $data["tiporeconexion"] = $tipoReconexion;
        $data["idreconexion"] = $idReconexion;
        $data["descripcion"] = $descripcion;
        $data["estado"] = $estado;
        $data['usu_ideregistro'] = $idUsuario;
        $tabla = strval("proceso_reconexiones_" . $empresa);
        return $this->insertar($data, $tabla, null);
    }

    public function insertarResumenProcesoCierre($idSuscripcion, $idEncabezado, $idMunicipio, $descripcion, $estado, $empresa, $idUsuario) {
        $data["idsuscripcion"] = $idSuscripcion;
        $data["idencabezado"] = $idEncabezado;
        $data["idmunicipio"] = $idMunicipio;
        $data["descripcion"] = $descripcion;
        $data["estado"] = $estado;
        $data['usu_ideregistro'] = $idUsuario;
        $tabla = strval("proceso_cierre_syr_" . $empresa);
        return $this->insertar($data, $tabla, null);
    }

    public function consultarMunicipioEncabezado($idEncabezado) {
        $parametros["idencabezado"] = $idEncabezado;
        $sql = "select dsus.uni_municipio idmunicipio
                from dsus_detsuscrip dsus
                where dsus.dsus_ideregistr in (
                    select syr.dsus_ideregistr
                    from syr_susreconex syr
                    where syr.syr_ideregistro = :idencabezado
                );";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    public function consultarSinResultados($idEmpresa) {
        try {
            $sql = "select distinct
                    pf.idencabezado 
                from
                    proceso_suspensiones_$idEmpresa pf
                where pf.estado = 'SR'";
            $resultado = $this->executeQuery($sql);
            return $resultado;
        } catch (Exception $exc) {
            throw new MyException('No se encontrÃ³ el resultado del Ãºltimo proceso ejecutado', 0);
        }
    }

    public function consultarResumenSuccessSus($idEmpresa) {
        try {
            $sql = "select distinct
                    (pry.proyecto_nom) municipio,
                    count(pf.idencabezado) susgeneradas
                from
                    proceso_suspensiones_$idEmpresa pf
                inner join proyectos pry on pf.idmunicipio = pry.proyecto_ideregistro
                where pf.estado like 'G'
                group by pry.proyecto_nom 
                order by pry.proyecto_nom";
            $resultado = $this->executeQuery($sql);
            return $resultado;
        } catch (Exception $exc) {
            throw new MyException('No se encontrÃ³ el resultado del Ãºltimo proceso ejecutado', 0);
        }
    }

    public function consultarResumenNoSuccessSus($idEmpresa) {
        try {
            $sql = "select distinct
                    (pry.proyecto_nom) municipio,
                    count(pf.idencabezado) susgeneradas
                from
                    proceso_suspensiones_$idEmpresa pf
                inner join proyectos pry on pf.idmunicipio = pry.proyecto_ideregistro
                where pf.estado like 'N'
                group by pry.proyecto_nom 
                order by pry.proyecto_nom";
            $resultado = $this->executeQuery($sql);
            return $resultado;
        } catch (Exception $exc) {
            throw new MyException('No se encontrÃ³ el resultado del Ãºltimo proceso ejecutado', 0);
        }
    }

    public function consultarResumenSuccessRec($idEmpresa) {
        try {
            $sql = "select distinct
                    (pry.proyecto_nom) municipio,
                    count(pf.idencabezado) recgeneradas
                from
                    proceso_reconexiones_$idEmpresa pf
                inner join proyectos pry on pf.idmunicipio = pry.proyecto_ideregistro
                where pf.estado IN ('G', 'E')
                group by pry.proyecto_nom order by pry.proyecto_nom";
            $resultado = $this->executeQuery($sql);
            return $resultado;
        } catch (Exception $exc) {
            throw new MyException('La tabla de proceso de generacion de reconexiones aun no ha sido creada', 0);
        }
    }

    public function consultarResumenNoSuccessRecSppCanceladas($idEmpresa) {
        $parametros['estado'] = 'N';
        $parametros['descripcion'] = MENSAJE_CANCELAR_DETALLE_SUSPENSION;
        try {
            $sql = "select distinct
                    (pry.proyecto_nom) municipio,
                    count(pf.idencabezado) recgeneradas
                from
                    proceso_reconexiones_$idEmpresa pf
                inner join proyectos pry on pf.idmunicipio = pry.proyecto_ideregistro
                where pf.estado like :estado
                and pf.descripcion like :descripcion
                group by pry.proyecto_nom 
                order by pry.proyecto_nom";
            $resultado = $this->executeQuery($sql, $parametros);
            return $resultado;
        } catch (Exception $exc) {
            throw new MyException('La tabla de proceso de generacion de reconexiones aun no ha sido creada', 0);
        }
    }

    public function consultarResumenNoSuccessRecRcoCanceladas($idEmpresa) {
        $parametros['estado'] = 'N';
        $parametros['descripcion'] = MENSAJE_DETALLE_CANCELAR_RECONEXION;
        try {
            $sql = "select distinct
                    (pry.proyecto_nom) municipio,
                    count(pf.idencabezado) recgeneradas
                from
                    proceso_reconexiones_$idEmpresa pf
                inner join proyectos pry on pf.idmunicipio = pry.proyecto_ideregistro
                where pf.estado like :estado
                and pf.descripcion like :descripcion
                group by pry.proyecto_nom order by pry.proyecto_nom";
            $resultado = $this->executeQuery($sql, $parametros);
            return $resultado;
        } catch (Exception $exc) {
            throw new MyException('La tabla de proceso de generacion de reconexiones aun no ha sido creada', 0);
        }
    }

    public function consultarResumenSuscripcionSinFechasEnReconexiones($idEmpresa) {
        $parametros['estado'] = 'SF';
        $parametros['descripcion'] = MENSAJE_SUSCRIPCION_SIN_FECHAS;
        try {
            $sql = "select distinct
                    (pry.proyecto_nom) municipio,
                    count(pf.idsuscripcion) recnogeneradas
                from
                    proceso_reconexiones_$idEmpresa pf
                inner join proyectos pry on pf.idmunicipio = pry.proyecto_ideregistro
                where pf.estado like :estado
                and pf.descripcion like :descripcion
                group by pry.proyecto_nom order by pry.proyecto_nom";
            $resultado = $this->executeQuery($sql, $parametros);
            return $resultado;
        } catch (Exception $exc) {
            throw new MyException('La tabla de proceso de generaciÃ³n de reconexiones aÃºn no ha sido creada', 0);
        }
    }

    public function consultarResumenSuccessSyr($idEmpresa) {
        try {
            $sql = "select distinct
                    (pry.proyecto_nom) municipio,
                    count(pf.idencabezado) recgeneradas
                from
                    proceso_cierre_syr_$idEmpresa pf
                inner join proyectos pry on pf.idmunicipio = pry.proyecto_ideregistro
                where pf.estado like 'G'
                group by  pry.proyecto_nom order by pry.proyecto_nom";
            $resultado = $this->executeQuery($sql);
            return $resultado;
        } catch (\Exception $exc) {
            throw new MyException('La tabla de proceso de cierre de suspensiones y reconexiones aun no ha sido creada', 0);
        }
    }

    public function consultarResumenSinResultadoSyr($idEmpresa) {
        try {
            $sql = "select distinct pf.idencabezado 
                from
                    proceso_cierre_syr_$idEmpresa pf
                where pf.estado like 'SR'";
            $resultado = $this->executeQuery($sql);
            return $resultado;
        } catch (\Exception $exc) {
            throw new MyException('La tabla de proceso de cierre de suspensiones y reconexiones aun no ha sido creada', 0);
        }
    }

    public function consultarSuscripcionesModificadas($idEmpresa) {
        try {
            $sql = "select idsuscripcion cantidad
                from proceso_cierre_syr_$idEmpresa pf
                where pf.estado like 'AS'";
            $resultado = $this->executeQuery($sql);
            if (empty($resultado)) {
                return 0;
            }
            return $resultado[0]['cantidad'];
        } catch (\Exception $exc) {
            throw new MyException('La tabla de proceso de cierre de suspensiones y reconexiones aun no ha sido creada', 0);
        }
    }

    public function consultarResumenNoSuccessSyr($idEmpresa) {
        try {
            $sql = "select distinct
                    (pry.proyecto_nom) municipio,
                    count(pf.idencabezado) recgeneradas
                from
                    proceso_cierre_syr_$idEmpresa pf
                inner join proyectos pry on pf.idmunicipio = pry.proyecto_ideregistro
                where pf.estado like 'N'
                group by
                        pry.proyecto_nom order by pry.proyecto_nom";
            $resultado = $this->executeQuery($sql);
            return $resultado;
        } catch (\Exception $exc) {
            throw new MyException('La tabla de proceso de cierre de suspensiones y reconexiones aun no ha sido creada', 0);
        }
    }

    public function consultarFacturasMorosidad($idSuscripcion, $tipoUso, $hasta, $fechaIni, $fechaFin) {
        $parametros["idsuscripcion"] = $idSuscripcion;
        $parametros["tipouso"] = $idSuscripcion;
        $parametros["valorsuspension"] = VALOR_SUSPENSION_RECONEXION;
        $complementoSql = "";
        if (!empty($fechaIni) && !empty($fechaFin)) {
            $complementoSql = "AND fac.fac_fecsuspens BETWEEN '$fechaIni' - ('$hasta' || 'MONTH')::INTERVAL AND '$fechaFin'";
        } else {
            $complementoSql = "AND fac.fac_fecsuspens BETWEEN (now() - ('$hasta' || 'MONTH')::INTERVAL)::DATE AND (now())::DATE";
        }
        $sql = "SELECT 
                    COUNT(fac.fac_ideregistro)
                FROM 
                    fac_factura fac 
                INNER JOIN dsus_detsuscrip dsus ON fac.dsus_ideregistr = dsus.dsus_ideregistr 
                INNER JOIN tido_tipdocumen tido ON fac.uni_tipdocument = tido.uni_tipdocument
                INNER JOIN dfac_detfactura dfac ON fac.fac_ideregistro = dfac.fac_ideregistro
                INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto		
                WHERE 
                    fac.dsus_ideregistr = :idsuscripcion
                AND dsus.uni_tipsuscripc = :tipouso 
                AND tido.tido_gensuspend = 'S'
                AND con.con_suspende = 'S'
                AND fac.fac_sdoreal > :valorsuspension " . $complementoSql;
        $resultado = $this->executeQuery($sql);
        return $resultado[0];
    }

    public function consultarEstadoSuscripcion($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;

        $sql = "Select dsus_estado estado from dsus_detsuscrip WHERE dsus_ideregistr =:idsuscripcion";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['estado'];
    }

    public function consultarSuspensionesEjecutadas($idTipoUso, $novedades, $idEmpresa, $idmunicipio) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT
                        syr.dsus_ideregistr idsuscripcion,
                        MAX (ssp.ssp_ideregistro) idsuspension
                FROM
                        syr_susreconex syr
                INNER JOIN ssp_suspension ssp ON syr.syr_ideregistro = ssp.syr_ideregistro
                INNER JOIN nosu_novsuspen nosu ON nosu.uni_novsuspen = ssp.uni_novsuspen
                INNER JOIN mosu_motsuspen mosu ON mosu.uni_motsuspen = ssp.uni_motsuspen
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = nosu.uni_novsuspen
                INNER JOIN esem_estempresa esem ON uni.est_ideregistro = esem.est_ideregistro
                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = syr.dsus_ideregistr
                INNER JOIN per_periodo per on per.per_ideregistro=syr.per_ideregistro
                WHERE
                        dsus.uni_tipusosuscr IN ($idTipoUso)
                AND nosu.uni_novsuspen IN ($novedades)
                AND esem.emp_ideregistro =:idempresa
                AND ssp.ssp_realizada = 'S'
               -- AND mosu.mosu_proceso NOT IN  ('R','D')
               -- AND ssp.ssp_vlrtotal IS NOT NULL
               -- AND ssp.ssp_vlrtotal > 0
                AND ssp.ssp_estado = 'A'
              --  AND syr.syr_estado = 'A'
                AND ssp_lectura IS NOT NULL
    		AND per.per_estado='A'
                and dsus.uni_municipio in ($idmunicipio)
		AND (SELECT count(*) from rco_reconexion rco where rco.syr_ideregistro=syr.syr_ideregistro)=0 
                AND (CASE when (SELECT count(*) from ssp_suspension sspfraude	
                                        inner join mosu_motsuspen mosufraude on mosufraude.uni_motsuspen=sspfraude.uni_motsuspen
                                where sspfraude.syr_ideregistro=syr.syr_ideregistro and mosufraude.mosu_proceso in ('F', 'G') 
                                      and sspfraude.ssp_estado<>'C'and sspfraude.ssp_vlrtotal>0) >= 1
                    then 0 else 1 END) = 1
                GROUP BY
                        syr.dsus_ideregistr";

        return $this->executeQuery($sql, $parametros);
    }

    public function consultarLecturaSuspension($idSuspension) {
        $sql = "Select ssp.ssp_lectura lectura, ssp.ssp_fecejesuspe fechaejecucion, mosu.mosu_proceso proceso from ssp_suspension  ssp 
INNER JOIN mosu_motsuspen mosu on mosu.uni_motsuspen = ssp.uni_motsuspen where ssp_ideregistro =$idSuspension";
        $resultado = $this->executeQuery($sql);
        if (!empty($resultado)) {
            return $resultado[0];
        }
        return array('lectura' => 0);
    }

    public function consultarSuscripcionParaReconexion($idTipoUso, $idEmpresa, $idmunicipo , $complemento) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT
									COALESCE(SUM(dfac.dfac_sdoreal), 0) saldoconceptos,
									dsus.dsus_ideregistr                idsuscripcion
							FROM
								syr_susreconex syr
								INNER JOIN ssp_suspension ssp ON syr.syr_ideregistro = ssp.syr_ideregistro
								INNER JOIN mosu_motsuspen mosu ON mosu.uni_motsuspen = ssp.uni_motsuspen
								INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = syr.dsus_ideregistr
								INNER JOIN tsu_tipsuscripc tsu ON dsus.uni_tipsuscripc = tsu.uni_tipsuscripc
								inner join per_periodo per on per.per_ideregistro=syr.per_ideregistro
								INNER JOIN (SELECT
															 syr.dsus_ideregistr, MAX(syr.per_ideregistro) ideperiodo,
															 MAX(ssp.ssp_ideregistro) ssp_ideregistro
														 FROM
															 ssp_suspension ssp
															 INNER JOIN syr_susreconex syr ON ssp.syr_ideregistro = syr.syr_ideregistro
															 inner join mosu_motsuspen mosu on mosu.uni_motsuspen=ssp.uni_motsuspen
															 LEFT JOIN rco_reconexion rco on rco.ssp_ideregistro=ssp.ssp_ideregistro   and rco.rco_estado <> 'C' 
														 WHERE syr.syr_estado = 'A' and ssp.ssp_estado = 'A' and ssp.ssp_realizada='S'  
																		AND mosu.mosu_proceso in ('P','O','F')
															and ( rco.rco_ideregistro is null or rco.rco_realizada ='N')
														 GROUP BY syr.dsus_ideregistr ) AS infosuspension
															ON infosuspension.dsus_ideregistr = syr.dsus_ideregistr AND 
																					ssp.ssp_ideregistro = infosuspension.ssp_ideregistro
								LEFT JOIN fac_factura fac
												ON fac.dsus_ideregistr = syr.dsus_ideregistr AND fac.fac_fecvence :: DATE < now() :: DATE AND fac.fac_estado = 'A'
												AND fac.fac_idepadre IS NULL
								LEFT JOIN tido_tipdocumen tido ON fac.uni_tipdocument = tido.uni_tipdocument AND tido.tido_gensuspend = 'S'
								LEFT JOIN dfac_detfactura dfac ON dfac.emp_ideregistro = :idempresa and fac.fac_ideregistro = dfac.fac_ideregistro
								LEFT JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
															AND con.con_suspende = 'S'
															--(con.uni_concepto IS NULL OR con.con_suspende = 'S')
							WHERE fac.emp_ideregistro = :idempresa and
							 ssp.ssp_realizada = 'S'
								AND ssp.ssp_estado = 'A' 
								and per.per_ideregistro = infosuspension.ideperiodo
								AND mosu.mosu_proceso IN ('P','O','F')
								AND dsus.dsus_estado <> 'E'
								AND dsus.uni_tipusosuscr IN ($idTipoUso)
								AND dsus.uni_municipio IN ($idmunicipo)    
								AND dsus.emp_ideregistro = :idempresa
								AND ssp.uni_motsuspen <> 506
								AND tsu_persuspend = 'S' 
								AND syr.syr_estado='A'
                                                                $complemento
	 --	  and  dsus.dsus_ideregistr in (96515)
								AND (  
										CASE WHEN (SELECT COUNT(*)
																	FROM
																		fin_financiacio fin
																	WHERE
																		fin.dsus_ideregistr = dsus.dsus_ideregistr AND fin.fin_estado NOT IN ('E')
																		AND fin.fin_sdocapital > 0 AND fin.fin_fecha > fac.fac_fecvence	) <= 0
												THEN
															(case	when ((SELECT max(ssp.ssp_fecejesuspe)::date from ssp_suspension ssp 
															inner join mosu_motsuspen mosu on mosu.uni_motsuspen=ssp.uni_motsuspen
															where syr.syr_ideregistro=ssp.syr_ideregistro and mosu.mosu_proceso  in ('P','O','F')
																and ssp.ssp_realizada='S')
															<= 
															(SELECT max(rec.rec_fecha)::date from rec_recaudo rec 
																inner join dire_disrecaudo dire on dire.rec_ideregistro=rec.rec_ideregistro
																where dire.dsus_ideregistr=syr.dsus_ideregistr and rec.rec_estado not in ('E','T'))) 
																 then 1 else 0	end)
												--  1
											ELSE
		 /*  anterior....
												(SELECT count(*)
													FROM rec_recaudo rec
														INNER JOIN dire_disrecaudo dire ON rec.rec_ideregistro = dire.rec_ideregistro
													WHERE rec.rec_fecha::date >= fac.fac_fecvence::date AND dire.dsus_ideregistr = dsus.dsus_ideregistr)  */
		 /*  Nuevo propuesta.... */
			(SELECT count(*)
			 FROM rec_recaudo rec
				INNER JOIN dire_disrecaudo dire ON rec.rec_ideregistro = dire.rec_ideregistro
				INNER JOIN (SELECT fin.dsus_ideregistr, max(fin.fin_fecha::date) fin_fecha
										from fin_financiacio fin
										where fin.fin_estado NOT IN ('E') AND fin.fin_sdocapital > 0 AND fin.fin_fecha > fac.fac_fecvence
										GROUP BY fin.dsus_ideregistr) fecfinancia on fecfinancia.dsus_ideregistr=syr.dsus_ideregistr
			  WHERE rec.rec_fecha::date >= fecfinancia.fin_fecha AND rec.rec_fecha::date >= fac.fac_fecvence::date AND dire.dsus_ideregistr = dsus.dsus_ideregistr) 
											END) > 0	
					  
		AND
	(SELECT COALESCE(SUM(dfac.dfac_sdoreal), 0) from fac_factura fac
	inner join dfac_detfactura dfac on dfac.fac_ideregistro=fac.fac_ideregistro
	inner join con_concepto con on con.uni_concepto=dfac.uni_concepto
		where fac.dsus_ideregistr = syr.dsus_ideregistr 
		and fac.fac_fecvence :: DATE < now() :: DATE AND fac.fac_estado = 'A'
		and fac.fac_idepadre IS NULL and con.con_suspende='S') < 7000   
		
							GROUP BY dsus.dsus_ideregistr

	";
        return $this->executeQuery($sql, $parametros);
    }

    public function actualizarEstadoSuscripcionesUoR($tipoDeUso, $idEmpresa) {
        $data['emp_ideregistro'] = $idEmpresa;
        $data["dsus_estado"] = "A";
        $data["dsus_iniestado"] = NULL;
        $data["dsus_finestado"] = NULL;
        $condicion = "dsus_ideregistr IN (
                SELECT dsus.dsus_ideregistr
                FROM dsus_detsuscrip dsus
                INNER JOIN fac_factura fac ON dsus.dsus_ideregistr = fac.dsus_ideregistr
                WHERE dsus.dsus_estado IN ('U', 'R')
                AND dsus.uni_tipusosuscr IN ($tipoDeUso)
                AND dsus.emp_ideregistro =:emp_ideregistro
                AND fac.fac_estado = 'A'
                AND fac.fac_idepadre IS NULL
                AND fac.fac_sdoreal > 0
                GROUP BY
                        dsus.dsus_ideregistr
                HAVING
                        SUM (fac.fac_sdoreal) > 0
        )";
        return $this->actualizar($data, "dsus_detsuscrip", $condicion);
    }

    public function obtenerFacturaConSaldo($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;

        $sql = "SELECT
                        fac.fac_ideregistro idfactura,
                        fac.fac_numero numero,
                        DATE (fac.fac_fecvence) fechavencimiento,
                        fac.dsus_ideregistr idsuscripcion,
                        COALESCE (fac.fac_vlrreal, 0) valortotal,
                        COALESCE ( ( fac.fac_vlrreal - fac.fac_sdoreal ), 0 ) valorpagadofactura,
                        COALESCE (fac.fac_vlrreal, 0) valorreal
                FROM
                        fac_factura fac
                INNER JOIN doc_documento doc ON fac.uni_documento = doc.uni_documento
                WHERE
                        fac.dsus_ideregistr = :idsuscripcion
                AND fac.fac_idepadre IS NULL
                AND fac.fac_estado = 'A'
                AND fac.fac_sdoreal > 0
                ORDER BY
                        doc.doc_pagpriori,
                        fac.fac_fecvence,
                        fac.fac_numero";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta el ciclo y periodo del encabezado de suspensiones y reconexiones que esta en Estado 'A' de una suscripcion
     * @param int $idSuscripcion id de la suscripcion
     * @return int
     */
    public function obtenerCicloPeriodoEncabezadoActivo($idSuscripcion) {
        $parametros["dsus_ideregistr"] = $idSuscripcion;
        $sql = "SELECT
                    cic.cic_ideregistro idciclo,
                    per.per_ideregistro idperiodo,
                    cic.cic_anoactual cicloanio
                FROM
                    cic_ciclo cic
                    INNER JOIN per_periodo per ON per.cic_ideregistro = cic.cic_ideregistro
                    INNER JOIN dsus_detsuscrip dsus ON cic.cic_ideregistro = dsus.cic_ideregistro
                    INNER JOIN syr_susreconex syr on syr.cic_ideregistro= cic.cic_ideregistro
			      and syr.per_ideregistro= per.per_ideregistro and syr.dsus_ideregistr= dsus.dsus_ideregistr
                WHERE
                    syr.syr_estado='A'
		  AND dsus.dsus_ideregistr = :dsus_ideregistr";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /*
     * Se obtienen los registros a procesar de las suscripciones que estan en estado R o U
     */

    public function consultaActivarSuscripcionesEstadoUoR($tipoDeUso, $idEmpresa) {
        $data['emp_ideregistro'] = $idEmpresa;
        $sql = " 
                    SELECT distinct  dsus.dsus_ideregistr idsuscripcion, dsus.dsus_finestado, dsus.cic_ideregistro idciclo
                        FROM dsus_detsuscrip dsus
                        LEFT JOIN fac_factura fac ON dsus.dsus_ideregistr = fac.dsus_ideregistr
                        WHERE dsus.dsus_estado IN ('U', 'R')
                            AND dsus.uni_tipusosuscr IN ($tipoDeUso)
                            AND dsus.emp_ideregistro =:emp_ideregistro
                            AND
                            (
                             (fac.fac_estado = 'A'
                                    AND fac.fac_idepadre IS NULL
                                    AND fac.fac_sdoreal > 0)
                             OR
                             (dsus.dsus_finestado IS NULL)
                             OR
                             (dsus.dsus_finestado :: DATE < now() :: DATE)
                           )  ";
        return $this->executeQuery($sql, $data);
    }

    /*
     * Activar suscripciones 
     */

    public function actualizarEstadoSuscripciones($idEmpresa, $idSuscripcion) {
        $data['emp_ideregistro'] = $idEmpresa;
        $data["dsus_estado"] = "A";
        $data["dsus_iniestado"] = NULL;
        $data["dsus_finestado"] = NULL;
        $condicion = "dsus_ideregistr =  $idSuscripcion";
        return $this->actualizar($data, "dsus_detsuscrip", $condicion);
    }

    /*
     * Inserta Encabezado de Lectura
     */

    public function insertaEncabezadoLecturas($idEmpresa, $idSuscripcion, $idUsuario) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idusuario'] = $idUsuario;
        $parametros['desviacion'] = PARAMETRO_DESVIACION;
        $parametros['lecturasuspension'] = $this->consultaLecturaSuspensionActiva($idSuscripcion);

        $sql = "INSERT INTO lec_lectura (
                                            lec_estado,
                                            lec_fecha,
                                            lec_fecaprobac,
                                            lec_anterior,
                                            lec_actual,
                                            lec_consumo,
                                            lec_conpromedio,
                                            dsus_ideregistr,
                                            pro_ideregistro,
                                            cic_ideregistro,
                                            per_ideregistro,
                                            emp_ideregistro,
                                            cic_ano,
                                            uni_tipsuscripc,
                                            uni_tipusosuscr,
                                            pro_idepropiedad,
                                            pro_digitos,
                                            dsus_factor,
                                            lec_desviacion,
                                            usu_ideregistro,
                                            lec_observacion
                                    ) SELECT DISTINCT
                                            'A' ,
                                            now(),
                                            now(),
                                             :lecturasuspension ::numeric,
                                            0,
                                            0,
                                            COALESCE((
                                                    SELECT
                                                            ROUND(AVG(COALESCE(lec1.lec_consumo,0)), 0)
                                                    FROM
                                                            lec_lectura lec1
                                                    WHERE
                                                            lec1.dsus_ideregistr = dsus.dsus_ideregistr
                                                    AND lec1.lec_fecha >= (
                                                             now() :: DATE - '6 MONTH' :: INTERVAL
                                                    )
                                                    AND lec_estado IN ('P','G')
                                            ),0) AS consumo,
                                            dsus.dsus_ideregistr,
                                            pro.pro_ideregistro,
                                            infciclo.cic_ideregistro,
				            infciclo.per_ideregistro,
                                            :idempresa ::integer,
                                            infciclo.cic_anoactual,
                                            dsus.uni_tipsuscripc,
                                            dsus.uni_tipusosuscr,
                                            pro.pro_idepropieda,
                                            pro.pro_digitos ,
                                            dsus.dsus_factor,
                                            :desviacion ::numeric,
                                            :idusuario ::bigint ,
                                            'Reconex Activ. Usuario'
                                    FROM
                                            dsus_detsuscrip dsus
                    		        INNER JOIN pro_propiedad pro ON pro.pro_ideregistro = dsus.pro_ideregistro
                                        INNER JOIN ( SELECT cic.cic_ideregistro, per.per_ideregistro , cic.cic_anoactual
						  FROM  cic_ciclo cic
					          INNER JOIN per_periodo per on per.cic_ideregistro = cic.cic_ideregistro
					    WHERE per.per_estado= 'A'
				    	) infciclo on infciclo.cic_ideregistro = dsus.cic_ideregistro
                                  	LEFT JOIN (select lec.lec_estado,lec.lec_ideregistro, dsus_ideregistr lecidsuscripcion
					 FROM  lec_lectura lec
						INNER JOIN cic_ciclo cic on cic.cic_ideregistro = lec.cic_ideregistro
						INNER JOIN per_periodo per on per.cic_ideregistro = cic.cic_ideregistro
						WHERE  lec.lec_estado ='A' and per.per_estado='A'
					) inflectura on inflectura.lecidsuscripcion = dsus.dsus_ideregistr
	                                  WHERE dsus.dsus_ideregistr = :idsuscripcion and inflectura.lec_ideregistro is null ";
        $this->executeQuery($sql, $parametros);
    }

    function consultaLecturaSuspensionActiva($idsuscripcion) {
        $parametros['idsuscripcion'] = $idsuscripcion;
        $sql = "SELECT ssp.ssp_lectura lectura from syr_susreconex syr
                INNER  JOIN  ssp_suspension ssp on syr.syr_ideregistro = ssp.syr_ideregistro
                 WHERE syr.dsus_ideregistr = :idsuscripcion and syr.syr_estado ='A'";

        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['lectura'];
    }

    public function consultarSuspensionesReconexionesNewEncabezado($idEncabezado) {
        $parametros["idencabezado"] = $idEncabezado;
        try {
            $sql = "-- Suspensiones R, D y G sin reoonexion
		(SELECT  syr.syr_ideregistro,dsus.dsus_estado,syr.dsus_ideregistr,
			ssp.ssp_ideregistro ssp_ideregistro,
			0 ssp_vlrtotal,
			null rco_ideregistro, 
			0 rco_vlrtotal
			from syr_susreconex syr 
							inner join per_periodo per on per.per_ideregistro=syr.per_ideregistro
							inner join ssp_suspension ssp on ssp.syr_ideregistro=syr.syr_ideregistro
							INNER JOIN mosu_motsuspen mosu on mosu.uni_motsuspen=ssp.uni_motsuspen
							inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=syr.dsus_ideregistr
			where --per.per_estado='A' and 
						COALESCE(ssp.ssp_realizada,'')<>'N' and ssp.ssp_estado in ('A','E') 
						and mosu.mosu_proceso in ('R','D','G') and dsus.dsus_estado='A' 
						and syr.syr_ideregistro=:idencabezado 
						and COALESCE((SELECT count(*) from rco_reconexion rco 
														where rco.syr_ideregistro=syr.syr_ideregistro),0) = 0
			order by ssp.ssp_fecejesuspe desc limit 1)
		union all
		-- Suspensiones diferentes a R, D y G sin reoonexion
		((SELECT  syr.syr_ideregistro,dsus.dsus_estado,syr.dsus_ideregistr,
			ssp.ssp_ideregistro ssp_ideregistro,
			0 ssp_vlrtotal,
			null rco_ideregistro, 
			0 rco_vlrtotal
			from syr_susreconex syr 
							inner join per_periodo per on per.per_ideregistro=syr.per_ideregistro
							inner join ssp_suspension ssp on ssp.syr_ideregistro=syr.syr_ideregistro
							INNER JOIN mosu_motsuspen mosu on mosu.uni_motsuspen=ssp.uni_motsuspen
							inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=syr.dsus_ideregistr
			where --per.per_estado='A' and 
						COALESCE(ssp.ssp_realizada,'')<>'N' and ssp.ssp_estado in ('A','E') 
						and mosu.mosu_proceso not in ('R','D','G') and dsus.dsus_estado='A' 
						and syr.syr_ideregistro=:idencabezado 
						and COALESCE((SELECT count(*) from rco_reconexion rco 
															where rco.syr_ideregistro=syr.syr_ideregistro),0) = 0
			order by ssp.ssp_fecejesuspe desc limit 1)
		union all
			-- Suspensiones R, D y G con reoonexion
		(SELECT  syr.syr_ideregistro,dsus.dsus_estado,syr.dsus_ideregistr,
			ssp.ssp_ideregistro ssp_ideregistro,0 ssp_vlrtotal,
			(case when reconexion_emitida.rco_ideregistro is not null then reconexion_emitida.rco_ideregistro end) rco_ideregistro, 
			0 rco_vlrtotal
			from syr_susreconex syr 
							inner join per_periodo per on per.per_ideregistro=syr.per_ideregistro
							inner join ssp_suspension ssp on ssp.syr_ideregistro=syr.syr_ideregistro
							INNER JOIN mosu_motsuspen mosu on mosu.uni_motsuspen=ssp.uni_motsuspen
							inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=syr.dsus_ideregistr
							left join (SELECT rco.syr_ideregistro,rco.rco_ideregistro,rco.rco_fecejerecon
													from rco_reconexion rco 			
															inner JOIN morx_motreconex morx on rco.uni_motreconex=morx.uni_motreconex	
															where morx.morx_proceso in ('R','D','G') and COALESCE(rco.rco_realizada,'')=''
															 and rco.rco_estado in ('A','E') and rco.syr_ideregistro=:idencabezado   		
													order by rco.rco_fecejerecon desc limit 1) reconexion_emitida 
													on reconexion_emitida.syr_ideregistro=syr.syr_ideregistro
							left join (SELECT rco.syr_ideregistro,rco.rco_ideregistro,rco.rco_fecejerecon
													from rco_reconexion rco 			
															inner JOIN morx_motreconex morx on rco.uni_motreconex=morx.uni_motreconex	
															where morx.morx_proceso in ('R','D','G') and COALESCE(rco.rco_realizada,'')='S'
															 and rco.rco_estado in ('A','E') and rco.syr_ideregistro=:idencabezado   		
													order by rco.rco_fecejerecon desc limit 1) reconexion_realizada 
													on reconexion_realizada.syr_ideregistro=syr.syr_ideregistro
			where --per.per_estado='A' and 
						COALESCE(ssp.ssp_realizada,'')<>'N' and ssp.ssp_estado in ('A','E') 
						and mosu.mosu_proceso in ('R','D','G') and dsus.dsus_estado='A' 
						and syr.syr_ideregistro=:idencabezado 
						and COALESCE((SELECT count(*) from rco_reconexion rco 
														where rco.syr_ideregistro=syr.syr_ideregistro),0) > 0
						and ( ssp.ssp_fecejesuspe is null or 
										(case when reconexion_realizada.rco_ideregistro is not null 
													then reconexion_realizada.rco_fecejerecon else ssp.ssp_fecejesuspe
										 end)<=ssp.ssp_fecejesuspe)								
		order by ssp.ssp_fecejesuspe desc limit 1))
	union all
		(SELECT  syr.syr_ideregistro,dsus.dsus_estado,syr.dsus_ideregistr,
			ssp.ssp_ideregistro ssp_ideregistro,0 ssp_vlrtotal,
			(case when reconexion_emitida.rco_ideregistro is not null then reconexion_emitida.rco_ideregistro end) rco_ideregistro, 
			0 rco_vlrtotal
			from syr_susreconex syr 
							inner join per_periodo per on per.per_ideregistro=syr.per_ideregistro
							inner join ssp_suspension ssp on ssp.syr_ideregistro=syr.syr_ideregistro
							INNER JOIN mosu_motsuspen mosu on mosu.uni_motsuspen=ssp.uni_motsuspen
							inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=syr.dsus_ideregistr
							left join (SELECT rco.syr_ideregistro,rco.rco_ideregistro,rco.rco_fecejerecon
													from rco_reconexion rco 			
															inner JOIN morx_motreconex morx on rco.uni_motreconex=morx.uni_motreconex	
															where morx.morx_proceso not in ('R','D','G') and COALESCE(rco.rco_realizada,'')=''
															 and rco.rco_estado in ('A','E')  and rco.syr_ideregistro=:idencabezado  		
													order by rco.rco_fecejerecon desc limit 1) reconexion_emitida 
													on reconexion_emitida.syr_ideregistro=syr.syr_ideregistro
							left join (SELECT rco.syr_ideregistro,rco.rco_ideregistro,rco.rco_fecejerecon
													from rco_reconexion rco 			
															inner JOIN morx_motreconex morx on rco.uni_motreconex=morx.uni_motreconex	
															where morx.morx_proceso not in ('R','D','G') and COALESCE(rco.rco_realizada,'')='S'
															 and rco.rco_estado in ('A','E')  and rco.syr_ideregistro=:idencabezado   		
													order by rco.rco_fecejerecon desc limit 1) reconexion_realizada 
													on reconexion_realizada.syr_ideregistro=syr.syr_ideregistro
			where --per.per_estado='A' and 
						COALESCE(ssp.ssp_realizada,'')<>'N' and ssp.ssp_estado in ('A','E') 
						and mosu.mosu_proceso not in ('R','D','G') and dsus.dsus_estado='A' 
						and syr.syr_ideregistro=:idencabezado 
						and COALESCE((SELECT count(*) from rco_reconexion rco 
														where rco.syr_ideregistro=syr.syr_ideregistro),0) > 0
						and ( ssp.ssp_fecejesuspe is null or 
										(case when reconexion_realizada.rco_ideregistro is not null 
													then reconexion_realizada.rco_fecejerecon else ssp.ssp_fecejesuspe
										 end)<=ssp.ssp_fecejesuspe)								
		order by ssp.ssp_fecejesuspe desc limit 1)";
            $resultado = $this->executeQuery($sql, $parametros);
            if (empty($resultado)) {
                return $resultado;
            }
            return $resultado;
        } catch (\Exception $exc) {
            throw new MyException('Consulta Ing Sandro', 0);
        }
    }

    /**
     * Consult ala informacion del ultimo detalle de suspension registrado para
     * un encabezado
     * @param int $idEncabezado id del encabezado de suspension
     * @return array informacion del detalle de suspension
     */
    public function consultarUltimaSuspensionParaReconexion($idEncabezado) {
        $parametros["syr_ideregistro"] = $idEncabezado;
        $sql = "SELECT
                    ssp.ssp_ideregistro idsuspension,
                    ssp.ssp_estado estado,
                    ssp.ssp_fecprgsuspe fechaprogramacion,
                    ssp.ssp_fecejesuspe fechaejecucion,
                    ssp.ssp_realizada realizada,
                    ssp.ssp_lectura lectura,
                    mosu.mosu_proceso tipo
                FROM
                    ssp_suspension ssp
                    INNER JOIN mosu_motsuspen mosu on mosu.uni_motsuspen = ssp.uni_motsuspen
                WHERE
                    ssp.syr_ideregistro = :syr_ideregistro and ssp.ssp_estado ='A' and ssp.ssp_realizada = 'S'  and mosu.mosu_proceso not in ('D','R','G','M')
                ORDER BY
                    ssp.ssp_fecha DESC
                LIMIT 1";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    public function consultarSuspensionPorIdEncabezado($idEncabezado) {
        $parametros["syr_ideregistro"] = $idEncabezado;
        $sql = "select 	ssp.ssp_ideregistro ssp_ideregistro,
			COALESCE(ssp_vlrtotal, 0)  ssp_vlrtotal from ssp_suspension ssp 
			where syr_ideregistro = :syr_ideregistro and ssp.uni_motsuspen = 102  and COALESCE(ssp.ssp_realizada,'')<>'N' and ssp.ssp_estado in ('A','E') limit 1";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }
    
     //Logica adicional x Emergencia COVID 19 - Alcaldia Villavicencio
    public function quitarValorAporteVoluntario($idEmpresa, $idCiclo, $idUsuario) {
        $parametros['idciclo'] = $idCiclo;
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idusuario'] = $idUsuario;
        $sql = "update      fac_factura fac
                set         fac_sdoreal = fac.fac_sdoreal - COALESCE((  select      sum(dfac.dfac_sdoreal) 
                                                                        from        dfac_detfactura dfac
                                                                        where       fac.fac_ideregistro = dfac.fac_ideregistro 
                                                                            and     dfac.emp_ideregistro = fac.emp_ideregistro
                                                                            and     dfac.uni_concepto = 3132 
                                                                            and     dfac.dfac_sdoreal > 0),0),
                            fac_vlrreal = fac.fac_vlrreal - COALESCE((  select      sum(dfac.dfac_sdoreal) 
                                                                        from        dfac_detfactura dfac
                                                                        where       fac.fac_ideregistro = dfac.fac_ideregistro 
                                                                            and     dfac.emp_ideregistro = fac.emp_ideregistro
                                                                            and     dfac.uni_concepto = 3132 
                                                                            and     dfac.dfac_sdoreal > 0),0),
                            usu_ideregistro = :idusuario
                from        fac_factura facmodif  
                inner join  dsus_detsuscrip dsus on facmodif.dsus_ideregistr = dsus.dsus_ideregistr
                inner join  cic_ciclo cic on cic.cic_ideregistro = dsus.cic_ideregistro
                inner join  per_periodo per on per.cic_ideregistro = cic.cic_ideregistro 
                    and     per.per_estado='A'
                inner join  dfac_detfactura dfac on facmodif.fac_ideregistro = dfac.fac_ideregistro
                    and     dfac.emp_ideregistro = facmodif.emp_ideregistro
                    and     dfac.uni_concepto = 3132 
                    and     dfac.dfac_sdoreal>0
                where       dsus.cic_ideregistro = :idciclo 
                    and     dsus.emp_ideregistro = fac.emp_ideregistro 
                    and     facmodif.emp_ideregistro = :idempresa
                    and     facmodif.fac_ideregistro = fac.fac_ideregistro 
                    and     facmodif.fac_estado='A'
                    and     facmodif.fac_idepadre is null";
        $this->executeQuery($sql, $parametros);
           
        $sqldet = " update      dfac_detfactura dfac
                    set         dfac_sdoreal = 0, 
                                dfac_vlrreal = 0, 
                                dfac_vlrtotal = 0, 
                                usu_ideregistro = :idusuario
                    from        fac_factura facmodif
                    inner join  dfac_detfactura dfacmodif on facmodif.fac_ideregistro = dfacmodif.fac_ideregistro 
                        and     dfacmodif.emp_ideregistro = facmodif.emp_ideregistro
                        and     dfacmodif.uni_concepto = 3132 
                        and     dfacmodif.dfac_sdoreal > 0
                    inner join  dsus_detsuscrip dsus on facmodif.dsus_ideregistr = dsus.dsus_ideregistr
                    inner join  cic_ciclo cic on cic.cic_ideregistro = dsus.cic_ideregistro
                    inner join  per_periodo per on per.cic_ideregistro = cic.cic_ideregistro 
                        and     per.per_estado='A'
                    where       dsus.cic_ideregistro = :idciclo 
                        and     facmodif.emp_ideregistro = :idempresa  
                        and     dsus.emp_ideregistro=facmodif.emp_ideregistro 
                        and     facmodif.fac_estado='A'
                        and     facmodif.fac_ideregistro=dfac.fac_ideregistro 
                        and     dfacmodif.dfac_ideregistr=dfac.dfac_ideregistr
                        and     facmodif.fac_idepadre is null";

        return $this->executeQuery($sqldet, $parametros);

    }
    //Logica adicional x Emergencia COVID 19 - Alcaldia Villavicencio

}
