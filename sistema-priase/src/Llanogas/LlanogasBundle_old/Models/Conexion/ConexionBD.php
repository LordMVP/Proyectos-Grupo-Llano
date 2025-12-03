<?php

namespace Llanogas\LlanogasBundle\Models\Conexion;

use Doctrine\DBAL\Configuration;
use Symfony\Component\Yaml\Parser;
use Doctrine\DBAL\DriverManager;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ConexionBD
 *
 * @author hrey
 */
class ConexionBD {

    /**
     * 
     * @return  \Doctrine\DBAL\Connection
     */
    public static function getConexion() {
        $yaml = new Parser();
        $ruta = RUTA_PRINCIPAL . '/app/config/parameters_procesos.yml';
        $value = $yaml->parse(file_get_contents($ruta));
        $configuracion = new Configuration();
        $configuracion->setSQLLogger(NULL);
        $datosConexion = $value['parameters'];
        $parametros = array(
            'dbname' => $datosConexion['database_name'],
            'user' => $datosConexion['database_user'],
            'password' => $datosConexion['database_password'],
            'port' => $datosConexion['database_port'],
            'host' => $datosConexion['database_host'],
            'driver' => $datosConexion['database_driver'],
        );
        return DriverManager::getConnection($parametros, $configuracion);
    }
    public static function getConexionSeven() {
        $yaml = new Parser();
        $ruta = RUTA_PRINCIPAL . '/app/config/parameters_seven.yml';
        $value = $yaml->parse(file_get_contents($ruta));
        $configuracion = new Configuration();
        $configuracion->setSQLLogger(NULL);
        $datosConexion = $value['parameters'];
        $parametros = array(
            'dbname' => $datosConexion['database_name'],
            'user' => $datosConexion['database_user'],
            'password' => $datosConexion['database_password'],
            'port' => $datosConexion['database_port'],
            'host' => $datosConexion['database_host'],
       //     'driver' => $datosConexion['database_driver'],
        );
        return $parametros;
        //return DriverManager::getConnection($parametros, $configuracion);
    }

}

?>
