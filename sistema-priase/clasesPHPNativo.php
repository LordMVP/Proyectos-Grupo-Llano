<?php

class consultasSQLServer {

    private $host;
    private $user;
    private $bdname;
    private $password;
    private $port;

    public function __construct($parametros) {
        $this->host = $parametros['host'];
        $this->user = $parametros['user'];
        $this->bdname = $parametros['dbname'];
        $this->password = $parametros['password'];
        $this->port = $parametros['port'];
    }

    private function conexionMSSQL() {
        $link = mssql_connect($this->host, $this->user, $this->password);
        if ($link) {
            return $link;
        } else {
            echo "Error Estableciendo Conexión con Base Datos ".$this->host." Base Datos:".$this->bdname;    
        }
    }

    public function executeQuery($sql) {
        try {
            $link = $this->conexionMSSQL();
            mssql_select_db($this->bdname, $link);
            $consulta = mssql_query($sql);
            $result = mssql_fetch_assoc($consulta);
            mssql_close($link);
            return $result;
        } catch (Exception $ex) {
            throw new Exception("Error Ejecutando Consulta " . $sql . " Traza :" . $ex->getMessage(), -1);
        }
    }

}
