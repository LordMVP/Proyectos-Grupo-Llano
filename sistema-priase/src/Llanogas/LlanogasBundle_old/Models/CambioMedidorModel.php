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
class CambioMedidorModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }
   /*
    * El identificador del usuario a procesar, lo toma validando el usu ideregistro del campo usuario_graba de tecsoft 
    * si este no esta presente en la tabla de usuarios, toma el usu ideregistro que tenga el encabezado de lectura que se 
    * va a modificar , lo anterior a fin de garantizar la trazabilidad en el triger .
    */
    public function consultarCambioMedidor($parametros) {
        print_r("Fecha último Proceso: ");
        print_r(date('d-m-Y hh:ii:ss',time()));
        print_r($parametros);
        $sql = " 
                SELECT
                        med.medidor_codsus codigo_cliente,
                        med.medidor_fecvis fecha_visita,
                        med.medidor_nummed num_medidor_anterior,
                        medidor_vallec lec_medidor_anterior,
                        med.medidor_numnue num_medidor_nuevo,
                        med.medidor_lecnue lec_medidor_nuevo,
                        med.medidor_usugra usuario_graba,
                        coalesce(usu.usu_ideregistro,lec.usu_ideregistro) idusuario , 
                        med.medidor_fecgra fecha_grabacion,
                        med.medidor_marnue marca,
                        med.medidor_capnue capacidad,
                        capa.capamedidor_dig digitos,
                        dsus.dsus_factor  factor , 
                        dsus.dsus_ideregistr idsuscripcion , 
                        lec.lec_consumo consumo, 
                        lec.lec_conpromedio promedio ,
                        lec.pro_idepropiedad propiedad , 
                        lec.lec_desviacion desviacion,
                        cic.cic_ideregistro  ciclo,
                        per.per_ideregistro periodo,
                        cic.cic_anoactual  ano,
                        lec.emp_ideregistro empresa,
                        dsus.uni_tipsuscripc idtipsuscripcion,
                        dsus.uni_tipusosuscr idtipouso ,
                        lec.lec_ideregistro idencabezadoanterior,
                        lec.lec_anterior lecanterior,
                        lec.pro_ideregistro proideregistro,
                        med.medidor_codemp codemp
                FROM
                        medidores med
                            INNER JOIN empresas emp ON empresa_cod = med.medidor_codemp
                            INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_pcodigo = med.medidor_codsus
                            INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = dsus.cic_ideregistro
                            INNER JOIN per_periodo per ON per.cic_ideregistro = cic.cic_ideregistro
                            INNER JOIN dper_detperiodo dper ON dper.per_ideregistro = per.per_ideregistro
                            INNER JOIN lec_lectura lec  ON lec.dsus_ideregistr = dsus.dsus_ideregistr 
                            INNER JOIN capa_medidores capa ON med.medidor_marnue = capa.capamedidor_codmed
                            LEFT JOIN usuarios usu on usu.usuario_nit = med.medidor_usugra 
                            AND med.medidor_capnue = capa.capamedidor_cap  and capa.capamedidor_codemp = med.medidor_codemp
                WHERE
                        med.medidor_fecpro IS NULL
                        AND per.per_estado = 'A'
                        AND dper.prg_ideregistro = :programa
                        AND med.medidor_numnue IS NOT NULL
                        AND med.medidor_fecvis :: DATE < dper.dper_fecinicial :: DATE 
                        AND emp.empresa_sevemp= :empresa 
                        AND lec.lec_estado = 'A' 
                        AND dper.dper_estado = 'A'
                        order by  med.medidor_fecvis desc 
                        LIMIT :registros  ";
//        print_r($this->getSql());
//        print_r($sql);
        print_r(" PASO O : Seleccionar  cambios de Medidor sin Procesar");
        return $this->executeQuery($sql,$parametros);
    }

    public function insertarDetalleLecturas($parametros) {
        return $this->insertar($parametros,'dlec_detlectura','sq_dlec_ideregistr');
    }

    public function insertarEncabezadoLecturas($parametros) {
        return $this->insertar($parametros,'lec_lectura','sq_lec_ideregistro');
    }

    public function actualizaPropiedad($proideregistro,$datos) {
        $parametros = array();
        $parametros['pro_idepropieda']= $datos['idpropiedad'] ;
        $parametros['pro_digitos']= $datos['digitos'];
        $condicion = " pro_ideregistro = ".$proideregistro ;
        return $this->actualizar($parametros,'pro_propiedad', $condicion);
    }

    public function actualizarEncabezadoActualLectura($datos) {
        $parametros = array ();
        $parametros['lec_estado'] = 'K' ;
        $parametros['lec_fecha'] = $datos['fecha_visita'];
        $parametros['lec_actual'] =  $datos['lec_medidor_anterior'] ;
        // lec_medidor_anterior es la lectura con la que finaliza el medidor reteirado 
        // lecantrior es la lectura anterior que aparece en el registro actual de lectura de reingenieria 
        $parametros['lec_consumo'] = $datos['lec_medidor_anterior'] - $datos['lecanterior'] ;
        $parametros['usu_ideregistro']=$datos['idusuario'];  
        $parametros['lec_observacion'] = "Camb.Medidor#".$datos['num_medidor_anterior']." Lec_Medidor:".$datos['lec_medidor_anterior'] ;
        $parametros['lec_fecprocesad'] = 'now()';
        $condicion = " lec_ideregistro = ". $datos['idencabezadoanterior'] ." AND lec_estado ='A' ";
        
        print_r(" PASO 2: Cambiar Estado Registro Actual A->K Parametros: \t");
        print_r($parametros);
        $resultado =  $this->actualizar($parametros, "lec_lectura", $condicion);
        if($resultado==0)
            print_r(" No se Actualizo ningún registro en el encabezado de lecturas");
        
        return $resultado ;
    }
    public function actualizarMedidorTecsoft($datos) {
        $parametros= array();
        $parametros['medidor_fecpro'] = 'now()';
        $parametros['lec_ideregistro'] = $datos['idnuevoencabezado']  ;
        $condicion = " medidor_numnue = '".$datos['num_medidor_nuevo'] ."' and medidor_codemp = '".$datos['codemp'].
                     "' and medidor_nummed = '".$datos['num_medidor_anterior']. "' and medidor_codsus= '".$datos['codigo_cliente']."'";
        return $this->actualizar($parametros,'medidores', $condicion) ;
        
    }

    
    
}
