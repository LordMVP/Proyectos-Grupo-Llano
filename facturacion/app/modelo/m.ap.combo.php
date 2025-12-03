<?php

require_once "db.class.php";

class m_ap_combo extends database {

    function __construct() {
        
    }

    private function imprimirStringSplit($jArray) {
        $imprimir_registro = '';
        $IR = 0;
        foreach ($jArray as $r) {
            foreach ($r as $r_sub) {
//                                $r_sub= htmlentities($r_sub, ENT_QUOTES, 'UTF-8');
                $imprimir_registro .= $r_sub . "@-@";
            }/* define campo=>valor */
            $imprimir_registro = substr($imprimir_registro, 0, -3);
            $imprimir_registro .= "@__@"; /* define el combo */
            $IR++;
        }
        $imprimir_registro = substr($imprimir_registro, 0, -4);
        return $imprimir_registro;
    }

    //-------------------------------------------------metodos de campos de busqueda


    public function tor_nomtabla($post) {
        $consulta = 'select tor_nomtabla,tor_tabla from "tor_taborigen"';
        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function dtor_dettaborig($post) {
        $jwhere = "";
        switch ($post['param2']) {
            case 'A':
                $jwhere = " and dtor_acumula='S'";
                break;
            case 'R':
                $jwhere = " and dtor_registro='S'";
                break;
            case 'N':
                $jwhere = " and dtor_novedad='S'";
                break;
            default:
                $jwhere = "";
                break;
        }

        $consulta = "select dtor_nomcampo,dtor_nomcampo from dtor_dettaborig where tor_nomtabla='" . $post['param1'] . "' $jwhere";
        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function fun_funcion($post) {
        $jwhere = '';
        if ($post['param1']) {
            $jwhere = " where fun_tipo='" . $post['param1'] . "'";
        }
        $consulta = 'select "fun_ideregistro","fun_nombre","fun_parametro" from "fun_funcion"' . $jwhere;
        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function crearRango($post) {
        // mandar un rango numerico rango=1~12
        $enviar = array();
        $param1 = trim($post['param1']);
        $param1 = str_replace('||->', '', $param1);
        $param1 = str_replace('<-||', '', $param1);
        $param1 = trim($param1);
        $rango = explode("~", $param1);
        $rangoA = array();
        for ($k = intval($rango[0]); $k <= intval($rango[1]); $k++) {
            $linea = array(0 => $k, 1 => $k);
            array_push($rangoA, $linea);
        }
        $res = $this->imprimirStringSplit($rangoA);
        echo $res;
    }

    public function crearPeriodicidad() {
        $valores = array();
        $valores["1"] = "1";
        $valores["2"] = "2";
        $valores["3"] = "3";
        $valores["4"] = "4";
        $valores["6"] = "6";
        $valores["12"] = "12";
        $valoresA = array();
        $k = 0;
        foreach ($valores as $id => $valor) {
            array_push($valoresA, array($id, $valor));
            $k++;
        }
        echo $this->imprimirStringSplit($valoresA);
    }

    public function crearEstado($post) {
        $estados = array();
        switch ($post['param1']) {
            case 'ABC':
                $estados["A"] = "Activo";
                $estados["B"] = "Bloqueado";
                $estados["C"] = "Cerrado";
                break;
            case 'ABE':
                $estados["A"] = "Activo";
                $estados["B"] = "Bloqueado";
                $estados["E"] = "Eliminado";
                break;
            case 'FAC':
                $estados["G"] = "Generada";
                $estados["E"] = "Eliminado";
                $estados["P"] = "Pagada";
                $estados["D"] = "Deuda";
                $estados["I"] = "Dificil cobro";
                $estados["N"] = "Normalizada";
                $estados["F"] = "Financiada";
                $estados["C"] = "Castigada";
                $estados["A"] = "Aprobada";
                break;
            case 'AI':
                $estados["A"] = "Activo";
                $estados["I"] = "Inactivo";
                break;
            default:
                $estados["A"] = "Activo";
                $estados["E"] = "Eliminado";
                break;
        }

        $estadosA = array();
        $k = 0;
        foreach ($estados as $id => $valor) {
            array_push($estadosA, array($id, $valor));
            $k++;
        }
        echo $this->imprimirStringSplit($estadosA);
    }

    public function crearValorFormula() {
        $valores = array();
        $valores["V"] = "Valor";
        $valores["F"] = "Formula";
        $valoresA = array();
        $k = 0;
        foreach ($valores as $id => $valor) {
            array_push($valoresA, array($id, $valor));
            $k++;
        }
        echo $this->imprimirStringSplit($valoresA);
    }

    public function core_tipacumula() {
        $valores = array();
        $valores["A"] = "Actual";
        $valores["I"] = "Ilimitado";
        $valores["N"] = "Anterior";
        $valores["T"] = "Actual + Anteriores";

        $valoresA = array();
        $k = 0;
        foreach ($valores as $id => $valor) {
            array_push($valoresA, array($id, $valor));
            $k++;
        }
        echo $this->imprimirStringSplit($valoresA);
    }

    public function crearEfecto() {
        $valores = array();
        $valores["S"] = "Suma";
        $valores["R"] = "Resta";
        $valores["I"] = "Informa";
        $valoresA = array();
        $k = 0;
        foreach ($valores as $id => $valor) {
            array_push($valoresA, array($id, $valor));
            $k++;
        }
        echo $this->imprimirStringSplit($valoresA);
    }

    public function crearSiNo() {
        $valores = array();
        $valores["S"] = "Si";
        $valores["N"] = "No";
        $valoresA = array();
        $k = 0;
        foreach ($valores as $id => $valor) {
            array_push($valoresA, array($id, $valor));
            $k++;
        }
        echo $this->imprimirStringSplit($valoresA);
    }

    public function crearOperacion() {
        $valores = array();
        $valores["S"] = "Suma";
        $valores["R"] = "Resta";
        $valores["I"] = "Informa";
        $valoresA = array();
        $k = 0;
        foreach ($valores as $id => $valor) {
            array_push($valoresA, array($id, $valor));
            $k++;
        }
        echo $this->imprimirStringSplit($valoresA);
    }

    public function funcionConcepto() {
        $valores = array();
        $valores["N"] = "No Aplicar";
        $valores["U"] = "Valor Unitario";
        $valores["C"] = "Cantidad";
        $valores["T"] = "Valor Total";
        $valoresA = array();
        $k = 0;
        foreach ($valores as $id => $valor) {
            array_push($valoresA, array($id, $valor));
            $k++;
        }
        echo $this->imprimirStringSplit($valoresA);
    }

    public function venClasific() {
        $valores = array();
        $valores["NA"] = "No Aplicar";
        $valoresA = array();
        $k = 0;
        foreach ($valores as $id => $valor) {
            array_push($valoresA, array($id, $valor));
            $k++;
        }
        echo $this->imprimirStringSplit($valoresA);
    }

    public function proyecto($post) {
        $this->conecta_db();
        $modulo = $post['param1'];
        $prg_ideregistro = 0;
        $consulta = "select prg_ideregistro from prg_programa where prg_localiza~*'$modulo' limit 1";
        if ($res = @$this->consulta_db($consulta)) {
            $prg_ideregistro = $res[0][0];
        }
        $consulta = 'select distinct pro.proyecto_ideregistro,pro.proyecto_nom from proyectos pro
						inner join uspr_usuprgpryto uspr on pro.proyecto_ideregistro=uspr.uni_municipio
						inner join empresas emp on pro.proyecto_codemp=emp.empresa_cod
						where uspr.usu_ideregistro=\'' . $_SESSION['usu_ideregistro'] . '\'
						and uspr.prg_ideregistro=' . $prg_ideregistro . '
						and emp.empresa_sevemp=' . $_SESSION['emp_ideregistro'] . '
						order by pro.proyecto_nom,pro.proyecto_ideregistro ';
        //echo $consulta;
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function barrio($post) {
        //print_r($post);
        $jwhere = '';
        if (count($post['param1']) > 0) {
            $jwhere = " INNER JOIN empresas emp on emp.empresa_cod = barrio_codemp and emp.empresa_sevemp = ". $_SESSION['emp_ideregistro'] ."
                inner join muba_munbarrio muba on bar.barrio_ideregistro=muba.uni_barrio
						where muba.uni_municipio=" . $post['param1'] . "
							";
        }
        $consulta = 'select bar."barrio_ideregistro",bar."barrio_nom" from "barrios" bar ' . $jwhere . ' order by "barrio_nom"';
        //echo $consulta;
        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function complementoDireccion($post) {
        //print_r($post);
        $jwhere = '';
        if (count($post['param1']) > 0) {
            $jwhere = " where muba.uni_municipio =" . $post['param1'] . " and muba.uni_barrio=" . $post['param2'];
        }
        $consulta = "select uni.uni_ideregistro,uni.uni_nombre1 from muba_munbarrio muba
                       inner join mbcd_munbardirec mbcd on mbcd.muba_ideregistr=muba.muba_ideregistr
                       inner join uni_unidad uni on uni.uni_ideregistro=mbcd.uni_ideregistro" . $jwhere;

        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function inf_informacion($post) {
        $consulta = "select inf.inf_ideregistro, inf.inf_nombre from inun_infunidad inun 
						inner join inf_informacion inf on inun.inf_ideregistro=inf.inf_ideregistro
						where inun.uni_ideregistro='" . $post['param1'] . "'";
        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function tip_tipifica($post) {
        //print_r($post);
        $jwhere = '';
        if (count($post['param1']) > 0 && $post['param1'] != "") {
            $jwhere = ' where tip."inf_ideregistro"=' . $post['param1'];
        }
        $consulta = 'select tip."tip_ideregistro",tip."tip_nombre", tip.tip_tipo, tip.tip_restringe, tip.tip_obligatorio, tip.tip_desarchivo, tip.tor_nomtabla, tip.dtor_nomcampo, tip.tip_extarchivo, tip.prg_ideregistro, tip.tip_desdirector from "tip_tipifica" tip ' . $jwhere . ' order by tip.tip_nombre';
        ///*echo $consulta*/;
        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function cnre_cnvrecaudo() {
        $consulta = 'select "cnre_ideregistr","cnre_nombre","cnre_estado" from "cnre_cnvrecaudo"';
        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function cic_ciclo($post) {
        $jwhere = '';

        switch ($post['param1']) {
            case 'cipr_cicprograma':
                $jwhere = " INNER JOIN cipr_cicprograma cipr on cic.cic_ideregistro = cipr.cic_ideregistro 
                              inner join ciem_cicempresa ciem on cic.cic_ideregistro=ciem.cic_ideregistro
                              where ciem.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . " 
                                   and  cic.cic_estado='A'  and cipr.prg_ideregistro =9 ";
                break;
            case 'liquidacion':
                $jwhere = " inner join cili_cicliquida cili on cic.cic_ideregistro=cili.cic_ideregistro where cili.uni_liquidacion='" . $post['param2'] . "'";
                break;
            case 'suscripcion':
                $jwhere = " inner join dsus_detsuscrip dsus on cic.cic_ideregistro=dsus.cic_ideregistro where dsus.dsus_ideregistr='" . $post['param2'] . "'";
                break;
            case 'agendamiento':
                $jwhere = " inner join ciem_cicempresa ciem on cic.cic_ideregistro=ciem.cic_ideregistro where ciem.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . " and cic.cic_estado='A'";
                break;
            case 'cerrados':
//                $jwhere = " inner join ciem_cicempresa ciem "
//                    . " on cic.cic_ideregistro=ciem.cic_ideregistro where"
//                    . " ciem.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . " "
//                    . " and cic.cic_estado='C'";
                $jwhere =   " inner join ciem_cicempresa ciem on ciem.cic_ideregistro = cic.cic_ideregistro "                   
                          . " inner join per_periodo per on per.cic_ideregistro= cic.cic_ideregistro "
                          . " inner join (select peractual.cic_ideregistro ,date_part('year',peractual.per_fecinicial) anoperiodoactual "
                          . " from per_periodo peractual "
                          . " inner join (select cic_ideregistro, max(per_ideorden) idorden from per_periodo "
                          . " group by cic_ideregistro) as periodomaximo on periodomaximo.cic_ideregistro = peractual.cic_ideregistro "
                          . " and periodomaximo.idorden = peractual.per_ideorden  and peractual.per_estado='A' "
                          . " )as  cerrarciclo on cerrarciclo.cic_ideregistro = cic.cic_ideregistro "
                          . " where  cic.cic_estado='A' and per.per_estado='A' and ciem.emp_ideregistro=" . $_SESSION['emp_ideregistro']. ""
                         . "  and cic.cic_anoactual = cerrarciclo.anoperiodoactual  "  
                      . " AND cic.cic_ideregistro  not in (select peranosiguiente.cic_ideregistro from per_periodo peranosiguiente where date_part('year',peranosiguiente.per_fecinicial) = cerrarciclo.anoperiodoactual+1)"  ;
  
                break;
            default:
                $jwhere = " inner join ciem_cicempresa ciem on cic.cic_ideregistro=ciem.cic_ideregistro where ciem.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . " and cic.cic_estado='A' ";
                break;
        }
        $consulta = 'select cic.cic_ideregistro,cic.cic_nombre,cic.cic_anoactual from cic_ciclo cic ' . $jwhere . ' order by cic.cic_nombre';
        ///*echo $consulta*/ . "@@@@";
        $this->conecta_db();
        if ($res = $this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function per_periodo($post) {
        $cic_ideregistro = 0;
        if ($post['param1'] != '')
            $cic_ideregistro = $post['param1'];

        $consulta = "select per_ideregistro,per_nombre from per_periodo where cic_ideregistro='" . $cic_ideregistro . "' and per_estado='A'";
        if (isset($post['param2'])) {
            if ($post['param2'] == 'AG') {
                $consulta = "select distinct on (per.per_ideregistro) per.per_ideregistro,per.per_nombre from per_periodo per 
					inner join dper_detperiodo dper on dper.per_ideregistro=per.per_ideregistro
					where per.cic_ideregistro='" . $cic_ideregistro . "'  and per.per_estado in ( 'B', 'A')
					
					";
            }
        }
        ///*echo $consulta*/;
        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function dper_detperiodo($post) {
        $per_ideregistro = 0;
        if ($post['param1'] != '')
            $per_ideregistro = $post['param1'];
        $consulta = "select dper_ideregistr,dper_actividad from dper_detperiodo where per_ideregistro='" . $per_ideregistro . "' and dper_estado='A'";
        ///*echo $consulta*/;
        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function prg_programa($post) {
        $jwhere = '';
        if (count($post['param1']) > 0 && $post['param1'] != "") {
            $jwhere = " where prg.prg_tipo='" . $post['param1'] . "'";
        }
        $consulta = "select prg.prg_ideregistro, prg.prg_nombre from prg_programa prg " . $jwhere;
        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function tsu_tipsuscripc($post) {
        $consulta = '';
        switch ($post['param2']) {
            case "N":
                $consulta = "select tsu.uni_tipsuscripc,tsu.tsu_nombre,tsu.tsu_persuspend,tsu.est_tipsuscripc from tsu_tipsuscripc tsu";
                break;
            case "S":
                $consulta = "select tsu.uni_tipsuscripc,tsu.tsu_nombre,tsu.tsu_persuspend,tsu.est_tipsuscripc from tsu_tipsuscripc tsu inner join muts_muntipsusc muts on muts.uni_tipsuscripc=tsu.uni_tipsuscripc where muts.uni_municipio=(select uni_municipio from pro_propiedad where pro_ideregistro='" . $post["param1"] . "')";
                break;
            default:
                echo "No permitido";
                exit();
                break;
        }


        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function liq_liquidacion($post) {
        $jwhere = '';
        switch ($post['param1']) {
            case 'documento':
                $jwhere = " where liq.uni_documento='" . $post['param2'] . "'";
                break;
            case 'tipo_uso':
                $jwhere = " inner join usli_usoliquida usli on usli.uni_liquidacion=liq.uni_liquidacion where usli.uni_tipusosuscr='" . $post['param2'] . "'";
                break;
            case 'C':
                $jwhere = " inner join coli_conliquida coli on coli.uni_liquidacion=liq.uni_liquidacion where coli.uni_concepto=" . $post['param2'];
                break;
            case 'T':
                $jwhere = "";
                break;
            case 'liquidacion':
                $jwhere = " 
						inner join dsus_detsuscrip dsus on liq.uni_liquidacion=dsus.uni_liquidacion
						where dsus.dsus_ideregistr=" . $post['param2'] . " ";

                break;
            case 'VC':
                $jwhere = " 
						inner join cili_cicliquida cili on cili.uni_liquidacion=liq.uni_liquidacion 
						inner join lids_liqdetsusc lids on lids.uni_liquidacion=liq.uni_liquidacion
						where cili.cic_ideregistro=" . $post['param2'] . " 
						and liq.liq_venclasific='LI'
						and lids.dsus_ideregistr=" . $post['param3'] . " 
						and lids.emp_ideregistro=" . $_SESSION['emp_ideregistro'];
                break;
            case 'VCSCIC':
                $jwhere = "
						inner join uni_unidad uni on uni.uni_ideregistro = liq.uni_liquidacion
						inner join est_estructura est on uni.est_ideregistro=est.est_ideregistro
						inner join esem_estempresa esem on esem.est_ideregistro= est.est_ideregistro
						inner join empresas emp on emp.empresa_sevemp=esem.emp_ideregistro						
						where est.cla_ideregistro=3
						and esem.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . "
						and liq.liq_venclasific='LI'
						and liq.uni_liquidacion not in (select cili.uni_liquidacion from cili_cicliquida cili where cili.cic_ideregistro=" . $post['param2'] . ")						
						";

                break;
            default:

                $jwhere = " where liq.uni_documento='" . $post['param1'] . "'";
                break;
        }
        $consulta = "select distinct on (liq.uni_liquidacion)liq.uni_liquidacion,liq.liq_nombre,liq.est_liquidacion from liq_liquidacion liq " . $jwhere;
        //echo $consulta;
        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function doc_documento($post) {
        $consulta = ' ';
        if (isset($post['param1'])) {
            switch ($post['param1']) {
                case 'F':
                    $consulta = "select distinct on (fac.uni_documento) fac.uni_documento, doc.doc_nombre from fac_factura fac
								inner join doc_documento doc on fac.uni_documento=doc.uni_documento								
								where fac.fac_idepadre=" . $post['param2'];
                    break;
            }
        } else {
            $consulta = "select doc.uni_documento,doc.doc_nombre from doc_documento doc order by doc.doc_nombre";
        }

        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function doti_doctipo($post) {
        $consulta = "select doti.uni_tipdocument, uni.uni_nombre1, doti.est_documento from doti_doctipo doti
					inner join uni_unidad uni on uni.uni_ideregistro=doti.uni_tipdocument
					where doti.uni_documento=" . $post["param1"] . "
					";
        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function con_concepto($post) {
        $jwhere = ' ';
        switch ($post['param1']) {
            case 'F':
                $jwhere .= " and con.con_tipcalculo='F' ";
            case 'V':
                $jwhere .= " and con.con_tipcalculo='V' ";
                break;
        }
        $jinner = '';
        if ($post['param2'] != '') {
            $jinner .= " inner join coli_conliquida coli on con.uni_concepto=coli.uni_concepto";
            $jwhere .= " and coli.uni_liquidacion='" . $post['param2'] . "'";
        }
        if ($post['param3'] != '') {
            $jwhere .= " and con.con_operacion in ('" . $post['param3'] . "', 'I') ";
        }
        $consulta = "select con.uni_concepto,con.con_nombre,con.con_tipregistro,con.con_valor from con_concepto con " . $jinner . " where con.con_estado='A' and prg_ideregistro =15 " . $jwhere;
        //echo $consulta;
        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function crearDebCre() {
        $valores = array();
        $valores[""] = "Seleccione...";
        $valores["D"] = "Debito";
        $valores["C"] = "Credito";
        $valoresA = array();
        $k = 0;
        foreach ($valores as $id => $valor) {
            array_push($valoresA, array($id, $valor));
            $k++;
        }
        echo $this->imprimirStringSplit($valoresA);
    }

    public function dtip_dettipific($post) {
        $consulta = "select dtip_valor,dtip_valor from dtip_dettipific where tip_ideregistro=" . $post['param1'];
        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function muba_munbarrio($post) {
        /*
         * GLPI 35705 
         * Soluciona: lmrubio 2017-03-31
         */
        $consulta = "select muba.muba_sector,muba.muba_sector,muba.uni_municipio,muba.uni_barrio
					from muba_munbarrio muba
					where muba.uni_barrio='" . $post['param2'] . "'
					and muba.uni_municipio='" . $post['param1'] . "'					
					";
        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function zona() {
        $valores = array();
        $valores["U"] = "Urbana";
        $valores["R"] = "Rural";
        $valoresA = array();
        $k = 0;
        foreach ($valores as $id => $valor) {
            array_push($valoresA, array($id, $valor));
            $k++;
        }
        echo $this->imprimirStringSplit($valoresA);
    }

    public function sus_suscripcion($post) {
        $consulta = "select sus.sus_ideregistro,sus.sus_ideregistro || '-' || cnre.cnre_nombre
						from sus_suscripcion sus
						inner join cnre_cnvrecaudo cnre on sus.cnre_ideregistr=cnre.cnre_ideregistr
						inner join dicn_disconven dicn on dicn.cnre_ideregistr=cnre.cnre_ideregistr
						where sus.ter_ideregistro=" . $post['param1'] . "
						and dicn.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . "
						and dicn.uni_tipsuscripc=" . $post['param2'] . "
						order by cnre.cnre_nombre			
					";
        $this->conecta_db();
        if ($res = @$this->consulta_db($consulta)) {
            $res = $this->imprimirStringSplit($res);
            echo $res;
        }
        $this->cierra_db();
    }

    public function cerraractividad($post) {

        $consultaActividad = "select dperact.dper_estado from dea_depactividad dea 
                                INNER JOIN dper_detperiodo dperact on dperact.dper_ideregistr = dea.dper_ideregistr
                                INNER JOIN dper_detperiodo dperdea on dperdea.dper_ideregistr = dea.dper_idepadre
                                where  dperdea.dper_estado='A' AND dea.dper_ideregistr =" . $post['param1'];
        $this->conecta_db();

        if (count($this->consulta_db($consultaActividad)) > 0) {
            echo "Hay actividades pendientes por Procesar. Por favor verifique";
        } else {
            $consulta = "UPDATE dper_detperiodo set dper_estado ='C' WHERE dper_ideregistr =" . $post['param1'];

            if ($this->ejecuta_db($consulta)) {
                echo "OK";
            } else {
                echo "Error al cerrar actividad " . $post['param1'];
            }
        }
        $this->cierra_db();
    }

    public function eliminaractividad($post) {

        $consultaActividad = "select dperact.dper_estado from dea_depactividad dea 
                                INNER JOIN dper_detperiodo dperact on dperact.dper_ideregistr = dea.dper_ideregistr
                                INNER JOIN dper_detperiodo dperdea on dperdea.dper_ideregistr = dea.dper_idepadre
                                where  dperdea.dper_estado='A' AND dea.dper_ideregistr =" . $post['param1'];
        $this->conecta_db();

        if (count($this->consulta_db($consultaActividad)) > 0) {
            echo "Hay actividades pendientes por Procesar. Por favor verifique";
        } else {
            $consulta = "UPDATE dper_detperiodo set dper_estado ='D' WHERE dper_ideregistr =" . $post['param1'];

            if ($this->ejecuta_db($consulta)) {
                echo "OK";
            } else {
                echo "Error al eliminar actividad " . $post['param1'];
            }
        }
        $this->cierra_db();
    }

    public function anosciclos($post) {
        $idCiclo= -1 ;
        if(!empty($post['param1'])){
            $idCiclo =$post['param1'] ; 
        }
//        print_r($post);
        $sql = " Select distinct date_part('year',per_fecinicial)::INTEGER ano "
                . " from per_periodo where per_estado in ('B','A') and cic_ideregistro = $idCiclo 
                    order by date_part('year',per_fecinicial)::INTEGER desc limit 2 ";
        $this->conecta_db();
        $q_sql = pg_query($sql);
        $respuesta = array();
        while ($r_sql = pg_fetch_array($q_sql)) {
            $respuesta[] = $r_sql;
        }
//        print_r($respuesta);
//       $respuesta= $this->consulta_db($sql);
        $cadena = $this->imprimirStringSplit($respuesta);
        echo $cadena;
    }

}
