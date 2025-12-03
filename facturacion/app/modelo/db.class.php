<?php

require_once 'jConf.php';

class database extends jeusConf {

    private $link = false;
    private $linkli;

    protected function conecta_db() {
        $strCnx = "host=$this->db_host port=$this->db_puerto dbname=$this->db_basedatos user=$this->db_usuario password=$this->db_clave";
        $link = pg_connect($strCnx);
        if (!$link) {
            die('Error de conexión a la base de datos');
        } else {
            $this->link = $link;
            return true;
        }
        $this->crearTransacDB();
    }

    protected function ejecuta_db($query) {
        $query = str_replace("\\", "/", $query);
        $consulta = true;
        $q = explode("; ", $query);
        $res = null;
        for ($i = 0; $i < count($q); $i++) {
            if (!$res = pg_query($this->link, $q[$i])) {
                $consulta = false;
                pg_cancel_query($this->link);
                break;
            }
        }

        if ($consulta) {
            if ($ret = pg_fetch_row($res)) {
                return $ret;
            } else {
                return true;
            }
        }
        return false;
    }

    protected function consulta_db($query) {
        $respuesta = array();
        $query = str_replace(array("--", "#", "/*"), "", $query);
        if ($resultado = pg_query($this->link, $query)) {
            while ($row = pg_fetch_row($resultado)) {
                $i = 0;
                foreach ($row as $r) {
//                    $row[$i] = utf8_decode($r); 
//                    $row[$i] = htmlentities($r, ENT_QUOTES,'UTF-8');
                    $row[$i] = $r;
                    $i++;
                }
                $respuesta[] = $row;
            }
            pg_free_result($resultado);
        } else {
            throw new Exception("Error de Base de Datos :" . $this->error_db(), -1);
            $this->error_db();
            return false;
        }
        return $respuesta;
    }

    protected function error_db() {
        return pg_last_error($this->link);
    }

    protected function cierra_db() {
        pg_close($this->link);
    }

    protected function consultaToCadena($respuesta) {
        $linea = "";
        $k = 0;
        if ($respuesta) {
            foreach ($respuesta as $res) {
                foreach ($res as $ide => $valor) {
//                    $valor = htmlentities($valor, ENT_QUOTES, 'UTF-8');
                    $linea .= $valor . "c_@";
                    $k++;
                }
                $linea = substr($linea, 0, -3);
                $linea .= "|__|";
            }
            $linea = substr($linea, 0, -4);
            echo "||->" . trim($linea) . "<-||";
            return true;
        } else {
            return false;
        }
    }

    protected function iniarTransccion() {
        return pg_query($this->link, " BEGIN TRANSACTION ");
    }

    protected function confirmarTransaccion() {
        return pg_query($this->link, " COMMIT ");
    }

    protected function deshacerTransaccion() {
        return pg_query($this->link, " ROLLBACK ");
    }
    
    protected function generarRespuestaJSON($respuesta){
        $respuesta=json_encode($respuesta);                        
        print_r($respuesta);
        
    }

}

?>