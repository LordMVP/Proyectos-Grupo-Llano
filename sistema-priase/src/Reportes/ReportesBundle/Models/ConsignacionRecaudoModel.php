<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Models;

/**
 * Description of ConsignacionRecaudoModel
 *
 * @author jepoveda
 */
class ConsignacionRecaudoModel extends ReportesDefaultModel{
    //put your code here
    
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }
    
    
    public function consultarMediosPagoUsuario($idUsuario, $idEmpresa) {

        $parametros["idUsuario"] = $idUsuario;
        $parametros["idEmpresa"] = $idEmpresa;
        
        $sql = "SELECT      usmp.uni_medpago id, 
                            uni.uni_nombre1 nombre
                FROM        usmp_usumedpago usmp 
                INNER JOIN  uni_unidad uni 
                ON          uni.uni_ideregistro=usmp.uni_medpago
                INNER JOIN  esem_estempresa esem 
                ON          esem.est_ideregistro=uni.est_ideregistro
                WHERE       usmp.usu_ideregistro = :idUsuario  and esem.emp_ideregistro = :idEmpresa
                ORDER BY    nombre";
        
        return $this->executeQuery($sql, $this->ajustarParametros($parametros));
    }
}
