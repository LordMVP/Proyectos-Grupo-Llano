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
 * Description of TerceroModel
 *
 * @author lmrubio
 */
class TerceroModel extends AuditoriaServices  {
    //put your code here
    
    private $genericoModel;
    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($conexion);
    }
    
    public function insertarTercero($tercero) {
        return $this->insertar($tercero, 'ter_tercero', null);        
    }
    
    public function buscarTercero($parametros){        
        
        $sql = "select 
                 *
                from ter_tercero ter
                where ter.ter_documento=:ter_documento OR ter.ter_nombre like :ter_nombre";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }
    
    
}
