<?php

require_once "db.class.php";

class m_facturacion_proces_cerra_perio extends database {

    function __construct() {
        
    }

    public function guardar($post) {
        $cic_ideregistro = $post['cic_ideregistro'];
        if ($this->verificarPeriodo($cic_ideregistro)) {
            $this->cerrarPeriodo($cic_ideregistro);
        }
    }

    private function cerrarPeriodo($cic_ideregistro) {
        $this->conecta_db();
        try {
            $this->iniarTransccion();
            /*
             * Selecciona el ciclo periodo activo 
             */
            $consulta = "select per_ideregistro,per_ideorden from per_periodo where cic_ideregistro=$cic_ideregistro and per_estado='A'";
            $percerra = $this->consulta_db($consulta);
            /*
             * Busca el siguiente periodo de
             */
            $activnex = "select per_ideorden + 1 from per_periodo where cic_ideregistro=$cic_ideregistro and per_estado='A'";
            $activnex = $this->consulta_db($activnex);
            if ($activnex[0][0] == 13) {
                $activnex[0][0] = 1;
            }
            /*
             * Cambia a estado cerrado el periodo que esta activo  
             */
            $consulta = "update per_periodo set per_estado='C',usu_ideregistro=" . $_SESSION['acc_ideregistro'] . " where per_ideregistro=" . $percerra[0][0] . " and per_estado='A'";
            $this->ejecuta_db($consulta);
//		$validanex=$this->consulta_db("select per_ideorden from per_periodo where cic_ideregistro=$cic_ideregistro and per_ideorden='" . $activnex[0][0] . "'");
            $validanex = $this->consulta_db(" select per_ideregistro,date_part('year',per_fecinicial) anoperiodo "
                    . " from per_periodo where per_estado='B' and  cic_ideregistro=$cic_ideregistro and per_ideorden='" . $activnex[0][0] . "' order by per_fecinicial limit 1 ");
            $Mensaje = " Periodo cerrado satisfactoriamente.";
            if ($activnex[0][0] == 1) {
                $Datos['idciclo'] = $cic_ideregistro;
                $Datos['ano'] = $validanex[0][1];
                $this->actualizarAnoCiclo($Datos);
                $Mensaje .= " (Se actualiza ano de Ciclo :" . $Datos['ano'] . " ) ";
            }

            if (count($validanex) > 0) {
                $actnexper = "update per_periodo set per_estado='A',usu_ideregistro=" . $_SESSION['acc_ideregistro'] . " where cic_ideregistro=$cic_ideregistro and per_ideregistro=" . $validanex[0][0] . " RETURNING per_ideregistro";
                $per_ideregistro = $this->ejecuta_db($actnexper)[0];
                $actdper = $this->consulta_db("select dper_ideregistr from dper_detperiodo where per_ideregistro='$per_ideregistro' order by dper_ideregistr limit 1");
                if (count($actdper) > 0) {
                    $actdperupd = "update dper_detperiodo set dper_estado='A' where dper_ideregistr=" . $actdper[0][0];
                    $this->ejecuta_db($actdperupd);
                }
                echo $Mensaje;
            } else {
                $cerracic = "update cic_ciclo set cic_estado='C',usu_ideregistro=" . $_SESSION['acc_ideregistro'] . " where cic_ideregistro=$cic_ideregistro";
                //echo $cerracic;
                $this->ejecuta_db($cerracic);
                echo "Se ha cerrado el ultimo periodo y su respectivo ciclo.";
            }

            $this->confirmarTransaccion();
            $this->cierra_db();
        } catch (\Exception $ex) {
            $this->deshacerTransaccion();
            $this->cierra_db();
        }
    }

    private function verificarPeriodo($cic_ideregistro) {
        $this->conecta_db();
        //documentos
        $novs = "select dnov.dnov_estado from nov_novedad nov 
                        INNER JOIN dnov_detnovedad dnov on dnov.nov_ideregistro = nov.nov_ideregistro
                        where dnov.cic_ideregistro=$cic_ideregistro and dnov.dnov_estado<>'P'";
        if (count($this->consulta_db($novs)) > 0) {
            echo "Existen novedades que estan en estado Pendiente o Generado y no se puede cerrar el ciclo. Por favor verifique";
            return false;
        }
        $facs = "select fac_estado from fac_factura where cic_ideregistro=$cic_ideregistro and fac_estado in ('G','X','Z')";  //Estado G --> facturacion generada de la facturacion por consumo que no se ha aprobado por el usuario
        //Estado X --> facturacion generada de la facturacion de Financiaciones que no se ha aprobado por el usuario
        //Estado Z --> facturacion generada de la facturacion de los intereses de las facturas que no se ha aprobado por el usuario

        if (count($this->consulta_db($facs)) > 0) {
            echo "Existen facturas que estan en estado Pendiente o Generado y no se puede cerrar el ciclo. Por favor verifique";
            return false;
        }

        $dpers = "select dper.dper_estado from dper_detperiodo dper
					inner join per_periodo per on dper.per_ideregistro=per.per_ideregistro
					where per.per_estado='A'  and dper.dper_estado='A'
					and per.cic_ideregistro=$cic_ideregistro
				";
        //echo $dperss;
        if (count($this->consulta_db($dpers)) > 1) {
            echo "Existen actividades del periodo que no se han cerrado.";
            return false;
        }

        $this->cierra_db();
        return true;
    }

    function actualizarAnoCiclo($Datos) {
        $sql = "update cic_ciclo set cic_anoactual = " . $Datos['ano'] . " where cic_ideregistro  =" . $Datos['idciclo'];
        $this->consulta_db($sql);
    }

}

?>
