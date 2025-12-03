<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AnularModel
 *
 * @author hrey
 */
class ContactoModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    public function archivoPlanoContacto($parametros) {
        try {
            $Datos['ruta_nombre_archivo'] = $parametros['ruta'] . '/' . $parametros['nombre_archivo'];
            $sql = " COPY   (     
            SELECT * from fn_cont_reportinfocontatos('".$parametros['fechaInicial']."','".$parametros['fechaFinal']."','".$parametros['empresa']."'))  TO '" . $Datos['ruta_nombre_archivo'] . "'  WITH  DELIMITER '|'    CSV HEADER   ESCAPE E'\n' ENCODING 'UTF8' ";
            $this->executeQuery($sql);
        } catch (\Exception $ex) {
            throw new MyException("Error construyendo archivo Contacto " . $ex->getMessage(), -1);
        }
    }

    public function consultaFecha() {
        try {
            $sql = "SELECT date_part('year', NOW()) ano,
                   date_part('month', NOW()) mes ,
                   date_part('day', NOW()) dia ,
                   now() fecha_completa";

            $resultado = $this->executeQuery($sql);
        } catch (\Exception $ex) {
            throw new MyException("Error consultando Fecha " . $ex->getMessage(), -1);
        }
        return $resultado;
    }

    public function saveFileContacto($parametros) {
        try {
            $resultado = $this->insertar($parametros, 'carc_ctrarchivo', 'sq_carc_ideregistr');
        } catch (\Exception $ex) {
            throw new MyException("Error Insertando registro de Contacto Archivos" . $ex->getMessage(), -1);
        }
        return $resultado;
    }
    
  public function consultarArchivos($parametros) {
//        $complemento = "'" . $parametros['rutapublicacion'] . "' as " . ' rutaweb ';
        $complemento = '';
        $sql = " SELECT carc_nombre nombre,carc_urlarchivo url ,carc_parametros parametros ,carc_fecha fecha 
                     $complemento 
                  FROM 
                   carc_ctrarchivo  
                  WHERE emp_ideregistro = :empresa AND usu_ideregistro = :usuario AND prg_ideregistro = :programa
                    ORDER BY carc_ideregistr DESC  limit 1 ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }



   

   

   
}
