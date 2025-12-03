<?php

require_once "db.class.php";

class m_facturacion_registr_ciclo_factura_periodo extends database {

    public function guardar($post) {
        
    }

    public function editar($post) {
        //$Nomcampo='';	
        $consulta = '';
        $ideregactual = 0;
        foreach ($post as $campo => $valor) {
            switch ($campo) {
                case "accion":
                case "navac":
                    $campo = $valor = '';
                    break;
            }
            $ideregactualreg = substr($campo, strpos($campo, '_') + 1);
            $campo = substr($campo, 0, strpos($campo, '_'));
            if ($campo == 'periodo') {
                $campo = "per_nombre";
            }
            if ($campo == 'fecvto') {
                $campo = "per_fecvence";
            }
            if ($campo == 'fecsusp') {
                $campo = "per_fecsuspens";
            }
            if ($ideregactual != $ideregactualreg) {
                if ($ideregactual !== 0) {
                    $consulta = substr($consulta, 0, -1);
                    $consulta .= ' ,usu_ideregistro=' . $_SESSION['usu_ideregistro'] . ' where per_ideregistro=' . $ideregactual . ';';
                }
                $ideregactual = $ideregactualreg;
                $consulta .= ' update per_periodo set ';
            }
            if ($valor != '')
                $consulta .= $campo . "='" . $valor . "',";
        }
        $consulta = substr($consulta, 0, -24);
        $this->conecta_db();
        if ($respuesta = $this->ejecuta_db($consulta)) {
            echo "Periodos actualizados";
        } else {
            print('Error');
        }
        $this->cierra_db();
    }

    public function eliminar() {
        
    }

    public function consultar($post) {
        if (empty($post['cic_ideregistro'])) {
//            echo "Ciclo no seleccionado ";
            return;
        }
        if (empty($post['ano'])) {
//            echo "Ciclo no seleccionado ";
            return;
        }
        $consulta = '';
        $consulta = 'select "per_ideregistro","per_nombre",per_fecinicial::timestamp::date,per_fecfinal::timestamp::date,per_fecvence::timestamp::date,per_fecsuspens::timestamp::date,"per_estado","per_estado" As boton '
                . ' from "per_periodo" per '
                . ' inner join cic_ciclo cic on cic.cic_ideregistro = per.cic_ideregistro '
                . ' where per.cic_ideregistro=\'' . $post['cic_ideregistro'] . "'"
                . " and  date_part('year',per_fecinicial) = '" . $post['ano'] . "'  order by \"per_ideorden\"";
        //echo $consulta;
        $this->conecta_db();
        if ($respuesta = @$this->consulta_db($consulta))
            count($respuesta[0]) > 0 ? $this->consultaToCadena($respuesta) : print('sinDatos');
        $this->cierra_db();
    }

    public function navegar($post) {
        
    }

}

?>