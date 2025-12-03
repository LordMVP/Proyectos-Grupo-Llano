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
 * Description of AnularModel
 *
 * @author sergio vargas
 */
class CerrarLecturasModel extends AuditoriaServices {

    private $genericoModel;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($conexion);
    }

    /**
     * Permite procesar las lecturas actuales actualizando los encabezados 
     * @param int $idciclo identificador del ciclo
     * @return int filas afectadas
     */
    public function ProcesarLecturasActuales($idciclo, $idEmpresa, $idUsuario) {
        $sql = "WITH filas AS (
                            UPDATE lec_lectura
                            SET dlec_ideregistr = iddetallelectura,
                            lec_actual = COALESCE (lecturaactual, 0),                           
                            lec_consumo = COALESCE (consumo, 0),
                            --*factor,
                            lec_estado = 'G',
                            usu_ideregistro = $idUsuario
                    FROM
                            (
                                    SELECT
                                            lec.lec_ideregistro idlectura,
                                            dlec.dlec_ideregistr iddetallelectura,
                                            dlec.dlec_actual lecturaactual,
                                            dlec.dlec_consumo consumo,
                                            dsus.dsus_factor factor
                                    FROM
                                            lec_lectura lec
                                    INNER JOIN per_periodo per ON per.per_ideregistro = lec.per_ideregistro
                                    INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = lec.dsus_ideregistr
                                    LEFT JOIN dlec_detlectura dlec ON dlec.lec_ideregistro = lec.lec_ideregistro
                                    LEFT JOIN (
                                            SELECT
                                                    le.dsus_ideregistr,
                                                    le.lec_ideregistro,
                                                    COALESCE (
                                                            MAX (dlec1.dlec_ideregistr),
                                                            0
                                                    ) iddetallelectura
                                            FROM
                                                    dlec_detlectura dlec1
                                            INNER JOIN lec_lectura le ON dlec1.lec_ideregistro = le.lec_ideregistro
                                            INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = le.dsus_ideregistr
                                            WHERE
                                                   le.lec_estado = 'A'
                                            AND dlec1.dlec_estado = 'P'
                                            AND dlec1.dlec_realizada = 'S'
                                            AND dsus.cic_ideregistro = $idciclo
                                            AND dsus.emp_ideregistro = $idEmpresa    
                                            GROUP BY
                                                    le.dsus_ideregistr,
                                                    le.lec_ideregistro
                                    ) AS detalleultimo ON dlec.dlec_ideregistr = detalleultimo.iddetallelectura
                                    WHERE
                                            lec_estado = 'A'
                                    AND dsus.cic_ideregistro = $idciclo AND dsus.emp_ideregistro = $idEmpresa
                            ) AS consolidado
                    WHERE
                            consolidado.idlectura = lec_ideregistro RETURNING dlec_ideregistr
                    ) 


                    SELECT
                            COUNT (*) cant
                    FROM
                            filas;

                    ";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            return 0;
        }

        return $respuesta[0]['cant'];
    }

    public function evaluarEncabezados($idciclo) {
        $parametros["idciclo"] = $idciclo;
        $sql = "SELECT
                        COUNT (*) lecturastramite
                FROM
                        lec_lectura
                WHERE
                        cic_ideregistro = :idciclo
                AND lec_estado = 'A' ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['lecturastramite'];
    }

    /**
     * Permite obtener el periodo 
     * @param int $ciclo
     * @return int periodo
     */
    public function consultarPeriodo($ciclo) {
        $sql = "SELECT
                        per.per_ideregistro periodo,
                        cic.cic_nombre ciclo,
                        cic_anoactual anociclo
                FROM
                        per_periodo per
                INNER JOIN cic_ciclo cic ON per.cic_ideregistro = cic.cic_ideregistro
                WHERE
                        per.cic_ideregistro = $ciclo
                AND per.per_estado = 'A'";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException("No existe un ciclo a consultar válido ( $ciclo )", -1);
        }
        return $resultado[0];
    }

    public function ObtenerResumen() {
        try {
            $sql = "select * from tmp_log_cerrarlecturas";
            return $this->executeQuery($sql);
        } catch (\Exception $e) {
            $e->getMessage();
        }
    }

    public function CrearTablaLogModel() {

        $sql = 'DROP TABLE IF EXISTS tmp_log_cerrarlecturas;';

        $this->executeQuery($sql);

        $sqlTabla = "CREATE TABLE tmp_log_cerrarlecturas (
                        descripcion text,
                        programa   character varying,
                        estado character varying NOT NULL,
                        suscripcion character varying,
                        filasafectadas int,
                        fecha timestamp
                    
            )";
        $this->executeQuery($sqlTabla);
    }

    /**
     * permite insertar un nuevo registro en el modelo
     * @param stirng $descripcion descrpcion
     * @param string $programa nombre programa
     * @param char $estado  estado de programa
     * @param string $suscripcion municipios
     */
    public function InsertarLogModel($descripcion, $programa, $estado, $suscripcion, $filasAfectadas = 0) {

        if (empty($filasAfectadas)) {
            $filasAfectadas = 0;
        }
        $sql = "INSERT INTO tmp_log_cerrarlecturas (descripcion,programa,estado,suscripcion,fecha,filasafectadas) values ('$descripcion','$programa','$estado','$suscripcion', 'now()', $filasAfectadas)";

        $respuesta = $this->executeQuery($sql);
        return $respuesta;
    }

    /**
     * permite actualizar el proceso 
     * @param int $idprograma identifica el código del programa
     * @param int $cantfilasafectadas ingresar la cantidad de filas afectadas
     */
    public function actualizarFilasAfectadasProcesoModel($idprograma, $cantfilasafectadas) {
        $sql = "UPDATE cpr_ctrproceso
		SET cpr_canregistro = $cantfilasafectadas,
		cpr_fecfinal = now()
                where cpr_ideregistro = $idprograma
		and cpr_estado = 'A'";

        $this->executeQuery($sql);
    }

    /**
     * Permite Obtener la cantidad de filas afectadas generadas en estado G
     * @param type $idCiclo ciclo actual de la suscripcion 
     * @param type $idPeriodo periodo actual de ciclo
     * @param type $idEmpresa empresa seleccionada
     * @param type $cicloanio año de periodo 
     * @return int
     */
    public  function obtenerCantidadFilasAfectasEncabezado($idCiclo, $idPeriodo, $idEmpresa, $cicloanio)
    {
        $sql ="select count(*) cant
                from lec_lectura lec
                where lec.lec_estado = 'G'
                and cic_ideregistro = $idCiclo
                and lec.per_ideregistro = $idPeriodo
                and lec.cic_ano = $cicloanio and lec.emp_ideregistro = $idEmpresa"; 
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            return 0;
        }

        return $respuesta[0]['cant'];
    }
    
    /**
     * permite generar un nuevo encabezado
     * @param Array $suscripcion suscripcion
     * @param int $idCiclo ciclo activo
     * @param int $periodosiguiente periodo siguiente
     * @param int $anociclo año de ciclo
     * @return int Cantidad de filasafectadas
     */
    public function generarNuevoEncabezado($idCiclo, $idPeriodo, $idEmpresa, $cicloanio, $idUsuario) {
        $sql = "WITH filas AS (
            INSERT INTO lec_lectura (
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
                                            usu_ideregistro
                                    ) SELECT DISTINCT
                                            'A',
                                            now(),
                                            now(),
                                            COALESCE(lec.lec_actual,0),
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
                                            $idCiclo,
                                            $idPeriodo,
                                            $idEmpresa,
                                            $cicloanio,
                                            dsus.uni_tipsuscripc,
                                            dsus.uni_tipusosuscr,
                                            pro.pro_idepropieda,
                                            pro.pro_digitos,
                                            dsus.dsus_factor," . PARAMETRO_DESVIACION . " AS desviacion,
                                            $idUsuario
                                    FROM
                                            dsus_detsuscrip dsus
                                    LEFT JOIN lec_lectura lec ON  (dsus.dsus_ideregistr=lec.dsus_ideregistr AND lec.lec_estado='G')
                                    INNER JOIN pro_propiedad pro ON pro.pro_ideregistro = dsus.pro_ideregistro
                                    inner join tsu_tipsuscripc tsu on tsu.uni_tipsuscripc=dsus.uni_tipsuscripc
                                   WHERE tsu.tsu_persuspend='S' and
                                   dsus.cic_ideregistro = $idCiclo AND dsus.dsus_estado = 'A' AND dsus.emp_ideregistro=$idEmpresa RETURNING lec_estado) 
                                        SELECT
                                                COUNT (*) cant
                                        FROM
                                                filas;";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            return 0;
        }

        return $respuesta[0]['cant'];
    }

    public function registrosProcesados($idCiclo, $idPeriodoSiguiente) {
        $sql = "select  count(*) cantidad from lec_lectura 
                where lec_estado='A' 
                AND cic_ideregistro=$idCiclo AND per_ideregistro=$idPeriodoSiguiente";
        return $this->executeQuery($sql)[0]['cantidad'];
    }

    /**
     * Permite obtener el periido siguiente a calcular
     * @param int $ciclo ciclo actual activo
     * @return int periodo siguiente
     */
    public function ObtenerSiguientePeriodoActual($ciclo) {
        $parametros["ciclo"] = $ciclo; 
        $sql = "SELECT
                        per_ideregistro periodo , DATE_PART('year', per_fecinicial) aniociclo
                FROM
                        per_periodo pe
                WHERE
                        per_ideorden = (
                                SELECT
                                        CASE
                                WHEN per_ideorden = 12 THEN
                                        per_ideorden - 11 
                                ELSE
                                        per_ideorden + 1 
                                END  per_ideorden
                                FROM
                                        per_periodo
                                WHERE
                                        per_estado = 'A'
                                AND cic_ideregistro = pe.cic_ideregistro
                                ORDER BY
                                        per_ideregistro limit 1
                        ) 
                AND pe.cic_ideregistro = :ciclo  AND pe.per_estado = 'B' ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error al consultar el siguiente periodo, por favor verificar la parametrización del ciclo ' . $ciclo, -1);
        }
//        return $resultado[0]['periodo'];
        return $resultado[0];
    }

    /**
     * Actualiza el proceso en estado finalizado
     * @param int $idControlProceso identificador del proceso.
     * @return array 
     */
    public function finalizarProcesoModel($idControlProceso, $idusuario) {
        $sql = "UPDATE cpr_ctrproceso
            SET cpr_fecfinal = 'now()',
             cpr_estado = 'I',
             usu_ideregistro = $idusuario
            WHERE
                    cpr_ideregistro = $idControlProceso;";
        return $this->executeQuery($sql);
    }

    /**
     * Permite actualizar el estado de la lectura 
     * @param int $idUsuario identificador del usuario
     * @param int $idciclo identificador del ciclo
     * @param int $periodo identificador del periodo actual
     */
    public function actualizarEstadoProcesado($idUsuario, $idciclo, $periodo) {
        $this->executeQuery("update lec_lectura set lec_estado='P',usu_ideregistro=$idUsuario where lec_estado='G' and cic_ideregistro= $idciclo and per_ideregistro= $periodo");
    }
    
    public  function obtenerCantidadFilasEstadoG_A($idCiclo, $idPeriodo, $idEmpresa, $cicloanio)
    {
        $sql ="select count(*) cant
                from lec_lectura lec
                where lec.lec_estado in ('G','A') 
                and cic_ideregistro = $idCiclo
                and lec.per_ideregistro = $idPeriodo
                and lec.cic_ano = $cicloanio and lec.emp_ideregistro = $idEmpresa"; 
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            return 0;
        }

        return $respuesta[0]['cant'];
    }

}
