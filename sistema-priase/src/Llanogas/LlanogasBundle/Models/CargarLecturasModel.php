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
class CargarLecturasModel extends AuditoriaServices {

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
     * permite obtener la información de la suscripción
     * @param int $idsuscripcion identificador de la suscripción
     * @param string $codigoanterior identificador del código anterior
     * @return type
     */
    public function ObtenerInformacionLecturasSuscripcion($idsuscripcion, $codigoanterior) {
        try {

            if (empty($idsuscripcion)) {
                $idsuscripcion = 0;
            }

            $sql = "SELECT
                        dsus.dsus_ideregistr idsuscripcion,
                        dsus.pro_ideregistro idpropiedad,
                        dsus.uni_tipsuscripc idtiposuscripcion,
                        dsus.uni_tipusosuscr idtiposuscriptor,
                        pro.pro_digitos digitos,
                        dsus.dsus_factor factor
                FROM
                        dsus_detsuscrip dsus
                INNER JOIN pro_propiedad pro ON pro.pro_ideregistro = dsus.pro_ideregistro
                WHERE
                        (
                                dsus.dsus_ideregistr = $idsuscripcion
                                OR dsus.dsus_pcodigo = '$codigoanterior'
                        )";

            $respuesta = $this->executeQuery($sql);
            if (empty($respuesta)) {
                throw new MyException("No existe la suscripción con el id ($idsuscripcion) o el código de anterior ($codigoanterior)", -1);
            }
            return $respuesta[0];
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), -1);
        }
    }

    /**
     * permite actualizar los detalles de las lecturas a estado E para establecer la unica activa
     * @param int $idlectura identificador de la lectura
     * @return int filas afectadas
     */
    public function ActualizarEstadoDetallesLecturaModel($idlectura) {
        try {
            $lectura['dlec_estado'] = 'E';
            return $this->actualizar($lectura, 'dlec_detlectura', "lec_ideregistro=$idlectura");
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), -1);
        }
    }

    public function VerLogModel($idempresa) {
        try {
            $sql = "select  * from tmp_log_cargarLecturas_$idempresa";
            return $this->executeQuery($sql);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), -1);
        }
    }

    /**
     * permite la inserción de una nueva lectura
     * @param Array $lectura información de la lectura a alamcenar
     * @return int identificador de la lectura procesada
     */
    public function CrearLectura($lectura) {
        try {
            return $this->insertar($lectura, 'lec_lectura', 'sq_lec_ideregistro');
        } catch (\Exception $ex) {
            error_log($ex->getMessage());
            throw new MyException($ex->getMessage(), -1);
        }
    }

    /**
     * permite la inserción de una nueva detalle de lectura
     * @param Array $dlectura información de la lectura a alamcenar
     * @return int identificador de la lectura procesada
     */
    public function CrearDetalleLectura($dlectura) {
        try {
            return $this->insertar($dlectura, 'dlec_detlectura', 'sq_dlec_ideregistr');
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), -1);
        }
    }

    public function actualizarEncabezadoLectura($idLectura, $detalleLectura) {
        $data['lec_consumo'] = $detalleLectura['consumo'];
        $data['lec_actual'] = $detalleLectura['lecturaactual'];
        $data['lec_anterior'] = $detalleLectura['lecturaanterior'];
        $data['lec_ideregistro'] = $idLectura;
        return $this->actualizar($data, 'lec_lectura', 'lec_ideregistro=:lec_ideregistro');
    }

    /**
     * permite obtener el encabezado de la lectura que se encuentra activa en la suscripción
     * @param int $idsuscripcion id suscripción 
     */
    public function obtenerLecturaActivaExistente($idsuscripcion, $codigoanterior) {
        if (empty($idsuscripcion)) {
            $idsuscripcion = 0;
        }

        if (empty($codigoanterior)) {
            $codigoanterior = '0';
        }

        $sql = "SELECT  *
                FROM
                        lec_lectura lec
                INNER JOIN dsus_detsuscrip dsus ON lec.dsus_ideregistr = dsus.dsus_ideregistr
                WHERE
                        (
                                lec.dsus_ideregistr = $idsuscripcion
                                OR dsus.dsus_pcodigo = '$codigoanterior'
                        )
                AND lec_estado = 'A'";


        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            // throw new MyException("Ninguna lectura activa para la suscripción ($idsuscripcion) o código anterior ($codigoanterior) ", -1);
            //significa que es una lectura nueva
            return null;
        }

        return $respuesta[0];
    }

    public function CrearTablaLogModel($idempresa) {

        $sql = "DROP TABLE IF EXISTS tmp_log_cargarLecturas_$idempresa;";

        $this->executeQuery($sql);

        $sqlTabla = "CREATE TABLE tmp_log_cargarLecturas_$idempresa (
                        descripcion text,
                        programa   character varying(250),
                        estado character varying(250) NOT NULL,
                        suscripcion character varying(250),
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
    public function InsertarLogModel($idempresa,$descripcion, $programa, $estado, $suscripcion, $filasAfectadas = 0) {

        if (empty($filasAfectadas)) {
            $filasAfectadas = 0;
        }
        $sql = "INSERT INTO tmp_log_cargarLecturas_$idempresa (descripcion,programa,estado,suscripcion,fecha,filasafectadas) values ('$descripcion','$programa','$estado','$suscripcion', 'now()', $filasAfectadas)";

        $respuesta = $this->executeQuery($sql);
        return $respuesta;
    }
    
    public function buscaUltimaLectura($idsuscripcion, $codigoanterior){
        try {
             if (empty($idsuscripcion)) {
                $idsuscripcion = 0;
            }
            $sql = "select lec.lec_conpromedio promedio from lec_lectura lec 
                    where lec.lec_ideregistro = (
                            SELECT max(lec1.lec_ideregistro) FROM lec_lectura lec1 
                            inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr = lec1.dsus_ideregistr
                            WHERE (dsus.dsus_ideregistr = $idsuscripcion or dsus.dsus_pcodigo = '$codigoanterior')
                    )";
            return  $this->executeQuery($sql);
            
        } catch (Exception $ex) {
            throw new MyException("Nos e encontro la maxima Lectura--> ".$ex->getMessage(), -1);
        }
    }

}
