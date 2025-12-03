<?php

require_once '../../config.php';
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Database
 *
 * @author Lord_Nightmare
 */
class Database extends PDO{
    
    
    private $conexion;

    //nombre base de datos
    private $dbname = DB_NAME;
    //nombre servidor
    private $host = HOST;
    //nombre usuarios base de datos
    private $user = USER_NAME;
    //password usuario
    private $pass = PASS;
    //puerto postgreSql
    private $port = PORT;

    //creamos la conexión a la base de datos prueba
    public function __construct() {
        try {
            $this->conexion = parent::__construct("pgsql:host=$this->host;port=$this->port;dbname=$this->dbname;user=$this->user;password=$this->pass");
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    //función para cerrar una conexión pdo
    public function close_con() {
        $this->conexion = null;
    }

}
