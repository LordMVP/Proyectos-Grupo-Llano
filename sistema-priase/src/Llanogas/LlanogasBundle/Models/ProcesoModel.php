<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar los procesos. 
 *
 * @author hrey
 */
class ProcesoModel extends AuditoriaServices {
    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($conexion);
    }

    /**
     * Consulta el estado del programa dependiendo del identificador y el identificador de la empresa
     * @param int $idPrograma Identificador de la programa
     * @param type $idEmpresa Identificador de la empresa
     * @return array Detalle del proceso.
     */
    public function consultarProcesoPorEmpresaEstadoPrograma($idPrograma, $idEmpresa, $estado = true) {
        $parametros['idEmpresa'] = $idEmpresa;
        $parametros['idPrograma'] = $idPrograma;
        $complemento = "";
        if ($estado == true) {
            $complemento = "and cpr.cpr_estado='A'";
        } else {
            $complemento = "Order by cpr_fecfinal desc , cpr_ideregistro desc limit 1";
        }

        $sql = "
            select 
                cpr_ideregistro idproceso, cpr_fecinicio fechainicio,
                cpr_canregistro numeroregistrosprocesados,
                usu.usuario_nom usuario,
                cpr_estado estado, 
                cpr_fecfinal fechafinal
	    from cpr_ctrproceso cpr inner join acc_acceso acc on cpr.acc_ideregistro=acc.acc_ideregistro
                inner join usuarios usu on acc.usu_ideregistro=usu.usu_ideregistro
            where cpr.emp_ideregistro=:idEmpresa and cpr.prg_ideregistro=:idPrograma $complemento";
        $this->setSql($sql);
        $this->setParams($parametros);
        $resultado = $this->execute();
        $datos = array();
        if (count($resultado) > 0) {
            $datos['idProceso'] = $resultado[0]['idproceso'];
            $datos['fechaInicio'] = $resultado[0]['fechainicio'];
            $datos['numeroRegistrosProcesados'] = $resultado[0]['numeroregistrosprocesados'];
            $datos['usuario'] = $resultado[0]['usuario'];
            $datos['estado'] = $resultado[0]['estado'];
            $datos['fechafinal'] = $resultado[0]['fechafinal'];
        }
        return $datos;
    }

    /**
     * Ingresa una nueva ejecución de un proceso
     * @param array $proceso Detalle del proceso que se quiere ingresar.
     * @return int Identificador del nueva ejecución del proceso.
     */
    public function insertarProceso($proceso) {
        $idUsuario = $this->genericoModel->getInfoSesion($proceso['idAcceso'])['idusuario'];
        $data['cpr_estado'] = $proceso['estado'];
        $data['cpr_fecinicio'] = $proceso['fechaInicio'];
        $data['cpr_canregistro'] = 0;
        $data['prg_ideregistro'] = $proceso['idPrograma'];
        $data['acc_ideregistro'] = $proceso['idAcceso'];
        $data['emp_ideregistro'] = $proceso['idEmpresa'];
        $data['cpr_idehilo'] = $proceso['idHilo'];
        $data['usu_ideregistro'] = $idUsuario;
        return $this->insertar($data, 'cpr_ctrproceso', "sq_cpr_ideregistro");
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
        return $this->actualizar($parametros, 'cpr_ctrproceso', 'cpr_ideregistro = :cpr_ideregistro');
    }

    public function finalizarProcesoUsuario($idUsuario, $idPrograma) {
        $parametros['cpr_fecfinal'] = 'now()';
        $parametros['cpr_estado'] = 'I';
        $parametros['usu_ideregistro'] = $idUsuario;
        $parametros['prg_ideregistro'] = $idPrograma;
        return $this->actualizar($parametros, 'cpr_ctrproceso', 'usu_ideregistro = :usu_ideregistro AND prg_ideregistro=:prg_ideregistro');
    }

    /**
     * Consulta el proceso y retorna la cantidad de registros que se están procesando.
     * @param int $idEmpresa identificador de la empresa
     * @param int $idPrograma identificador del programa que lanza el proceso
     * @return array
     */
    public function getProcesoEjecucion($idEmpresa, $idPrograma) {
        try {
            $parametros['idempresa'] = $idEmpresa;
            $parametros['idprograma'] = $idPrograma;
            $sql = "select 
                cpr.acc_ideregistro idacceso,cpr.cpr_fecinicio fechainicio,
                usu.usuario_nom usuario,   
                (select count(*) from proceso_facturacion_$idEmpresa where estado <> 'P') cantidad
             from cpr_ctrproceso cpr inner join acc_acceso acc on cpr.acc_ideregistro=acc.acc_ideregistro
                  inner join usuarios usu on usu.usu_ideregistro=cpr.usu_ideregistro
             where cpr.prg_ideregistro=:idprograma and cpr.cpr_estado='A' and cpr.emp_ideregistro=:idempresa
             limit 1";
            $resultado = $this->executeQuery($sql, $parametros);
            if (empty($resultado)) {
                return $respuesta['cantidad'] = 0;
            }
            return $resultado[0];
        } catch (\Exception $e) {
            return -4;
        }
    }

    public function getProcesoEjecucionFinanciacion($idEmpresa, $idPrograma) {
        try {
            $parametros['idempresa'] = $idEmpresa;
            $parametros['idprograma'] = $idPrograma;
            $sql = "
             select 
                cpr.acc_ideregistro idacceso,cpr.cpr_fecinicio fechainicio,
                usu.usuario_nom usuario,   
                (select count(*) from facturar_financiacion where estado <> 'P') cantidad
             from cpr_ctrproceso cpr inner join acc_acceso acc on cpr.acc_ideregistro=acc.acc_ideregistro
                  inner join usuarios usu on usu.usu_ideregistro=acc.usu_ideregistro
             where cpr.prg_ideregistro=:idprograma and cpr.cpr_estado='A' and cpr.emp_ideregistro=:idempresa
             limit 1";
            $resultado = $this->executeQuery($sql, $parametros);
            if (empty($resultado)) {
                return $respuesta['cantidad'] = 0;
            }
            return $resultado[0];
        } catch (\Exception $e) {
            return -4;
        }
    }

    public function getProcesoEjecucionHilos($idEmpresa, $idPrograma) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idprograma'] = $idPrograma;
        $sql = "SELECT
                   cpr.cpr_ideregistro idprocesocontrol, 
                   cpr.acc_ideregistro idacceso,
                   cpr.cpr_idehilo hilo ,
                   cpr.cpr_fecinicio  fechainicio,
                   usu.usuario_nom usuario,   
                   ( 
                       SELECT sum(cp.cpr_canregistro) 
                       FROM cpr_ctrproceso cp 
                       WHERE cp.acc_ideregistro=cpr.acc_ideregistro
                             AND cp.prg_ideregistro=cpr.prg_ideregistro
                             AND cp.cpr_fecinicio 
                                 BETWEEN  
                                 (to_char(cpr.cpr_fecinicio,'yyyy-MM-DD HH24:MI:ss')) :: TIMESTAMP - INTERVAL '5 SECONDS' 
                                 AND
                                 (to_char(cpr.cpr_fecinicio,'yyyy-MM-DD HH24:MI:ss')) :: TIMESTAMP + INTERVAL '5 SECONDS' 
                   ) cantidad
                FROM cpr_ctrproceso cpr 
                     INNER JOIN acc_acceso acc on cpr.acc_ideregistro=acc.acc_ideregistro
                     INNER JOIN usuarios usu on usu.usu_ideregistro=acc.usu_ideregistro
                WHERE  
                       cpr.prg_ideregistro=:idprograma 
                       AND cpr.cpr_estado='A' 
                       AND cpr.emp_ideregistro=:idempresa
                ORDER BY
                     cpr.cpr_ideregistro
                LIMIT 1";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * @autor lmrubio
     * @param type $parametros
     * @return type
     */
    public function getCantidadProcesosActivos($parametros) {
        $sql = "SELECT COUNT(*)  procesosactivos 
                from 
                  cpr_ctrproceso 
                where 
                   prg_ideregistro = :idPrograma and acc_ideregistro= :idAcceso and emp_ideregistro = :idEmpresa 
                   and cpr_estado='A' and cpr_idehilo<> :idproceso  ";
        $cantidad = $this->executeQuery($sql, $parametros);
        return $cantidad[0]['procesosactivos'];
    }

    public function finalizarProcesoconError($idControlProceso) {
        $parametros['cpr_fecfinal'] = 'now()';
        $parametros['cpr_estado'] = 'E';
        $parametros['cpr_ideregistro'] = $idControlProceso;
        return $this->actualizar($parametros, 'cpr_ctrproceso', 'cpr_ideregistro=:cpr_ideregistro');
    }

    public function resumen($idEmpresa) {
        $sql = "SELECT
              pry.proyecto_nom municipio,
              tmp.mensaje,
              tmp.estado,
              count(*) numerosuscripciones
            FROM
              temp_aplicar_recaudos_$idEmpresa tmp INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = tmp.idsuscripcion
              INNER JOIN proyectos pry ON pry.proyecto_ideregistro=dsus.uni_municipio
            GROUP BY
              tmp.mensaje,
              tmp.estado,
              pry.proyecto_nom
            ORDER BY
              pry.proyecto_nom ";
        return $this->executeQuery($sql);
    }

    public function consultarControEjecucionProceso($Datos) {
        $sql = "select count(*) cantidad from cep_ctrejepro where cep_estado='A' 
                       and prg_ideregistro= :idprograma and emp_ideregistro = :idempresa ";
        $resultado = $this->executeQuery($sql, $Datos);
        if (empty($resultado)) {
            return 0;
        }
        return($resultado[0]['cantidad']);
    }

    public function insertarControEjecucionProceso($Datos) {
        $parControl['cep_estado'] = $Datos['estado'];
        $parControl['prg_ideregistro'] = $Datos['idprograma'];
        $parControl['emp_ideregistro'] = $Datos['idempresa'];
        $parControl['usu_ideregistro'] = $Datos['idusuario'];
        $parControl['acc_ideregistro'] = $Datos['idacceso'];
        $parControl['cep_fechainicio'] = 'now()';
        $this->insertar($parControl, "cep_ctrejepro", "sq_cep_ideregistro");
    }

    public function inactivarControEjecucionProceso($Datos) {
        $condicion = " prg_ideregistro = " . $Datos['idprograma'] . "  and cep_estado='A'  and emp_ideregistro = " . $Datos['idempresa'];
        $parControl['cep_fechafin'] = ' now() ';
        $parControl['cep_estado'] = 'I';
        $this->actualizarSinUsuario($parControl, 'cep_ctrejepro', $condicion);
    }

    public function getCantidadHilosActivosPrograma($Datos) {
        $sql = " select count(*) cantidad from cpr_ctrproceso where emp_ideregistro = :idempresa
                 and prg_ideregistro = :idprograma and cpr_estado='A' and cpr_idehilo != :idhilo ";
        $resultado = $this->executeQuery($sql, $Datos);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['cantidad'];
    }
    
    public function getHiloActivoPrograma($Datos) {
        $sql = " select count(*) cantidad from cpr_ctrproceso where emp_ideregistro = :idempresa
                 and prg_ideregistro = :idprograma and cpr_estado='A' and cpr_idehilo = :idhilo ";
        $resultado = $this->executeQuery($sql, $Datos);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['cantidad'];
    }

}
