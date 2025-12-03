<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * Consultas genericas del sistema.
 *
 * @author hrey
 */
class SuscriptoresModel extends AuditoriaServices {

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     * @param \Doctrine\DBAL\Connection $sesion
     */
    public function __construct(&$conexion, &$sesion) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
    }

    public function getConveniosTrasladar($informacion) {
        $parametros = array();
        $parametros['emp_ideregistro'] = $this->sesion->get('idempresa');
        $parametros['usu_ideregistro'] = $this->sesion->get('idusuario');
        $this->setCampo($informacion, $parametros, 'tiposuscripcion', 'uni_tipsuscripc');
        $this->setCampo($informacion, $parametros, 'tercero', 'ter_ideregistro');
        $this->setCampo($informacion, $parametros, 'suscriptor', 'sus_ideregistro');
        $this->setCampo($informacion, $parametros, 'suscripcion', 'dsus_ideregistr');

        $sql = "select sus.sus_ideregistro suscriptor,cnre.cnre_ideregistr idconvenio, cnre.cnre_nombre || '_ ' || sus.sus_descripcion convenio
                from sus_suscripcion sus
                inner join cnre_cnvrecaudo cnre on sus.cnre_ideregistr=cnre.cnre_ideregistr
                inner join dicn_disconven dicn on dicn.cnre_ideregistr=cnre.cnre_ideregistr
                inner join prun_prgunidad prun on  prun.uni_ideregistro=dicn.uni_tipsuscripc
                inner join uspu_usuprgunid uspu on uspu.prun_ideregistr=prun.prun_ideregistr
                where 
                dicn.emp_ideregistro= :emp_ideregistro  
                and dicn.uni_tipsuscripc= :uni_tipsuscripc   
                and uspu.usu_ideregistro= :usu_ideregistro 
                and prun.prg_ideregistro=58  
                and sus.ter_ideregistro= :ter_ideregistro  
                and sus.sus_ideregistro <> :sus_ideregistro 
                and sus.sus_ideregistro not in (select sus_ideregistro from trds_tradetsuscrip where dsus_ideregistr = :dsus_ideregistr)";

        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta los terceros asociados a un municipio y el usuario
     * @param string $nombre
     * @return array Lista de terceros 
     */
    public function getTerceros($informacion) {
        $parametros = array();
        $complemento = '';
        if (!empty($informacion['idTercero'])) {
            $this->setCampo($informacion, $parametros, 'idTercero', 'ter_ideregistro');
            $complemento .= ' and ter.ter_ideregistro = :ter_ideregistro ';
        }
        if (!empty($informacion['cedula']) || ($informacion['cedula'] =='0' )) {
            $this->setCampo($informacion, $parametros, 'cedula', 'ter_documento');
            $complemento .= ' and ter.ter_documento = :ter_documento';
        }
        $parametros['idusuario'] = $this->sesion->get('idusuario');
        $sql = 'SELECT
		    distinct 
                    ter.ter_ideregistro idtercero,
                    ter.ter_documento documento,
                    ter.ter_nomcompleto nombretercero,
                    ter.ter_telcelular celular ,
                    ter.ter_telfijo fijo
                FROM
                    ter_tercero ter inner join pro_propiedad pro on ter.ter_ideregistro=pro.ter_ideregistro
                WHERE
                    pro.uni_municipio in (select distinct uspr.uni_municipio from uspr_usuprgpryto uspr where uspr.usu_ideregistro=:idusuario) 
                    ' . $complemento . '  LIMIT 100';
        return $this->executeQuery($sql, $parametros);
    }

    public function getConvenios() {
        $parametros['usuario'] = $this->sesion->get('idusuario');
        $parametros['empresa'] = $this->sesion->get('idempresa');
        $sql = ' select  cnre.cnre_nombre convenio, cnre.cnre_ideregistr idconvenio
                from cnre_cnvrecaudo cnre
                    inner join dicn_disconven dicn on dicn.cnre_ideregistr=cnre.cnre_ideregistr
                    inner join tsu_tipsuscripc tsu on tsu.tsu_ideregistro = dicn.uni_tipsuscripc
                    inner join esem_estempresa esem on esem.est_ideregistro = tsu.est_tipsuscripc 
                    inner join prun_prgunidad prun on  prun.uni_ideregistro=dicn.uni_tipsuscripc
                    inner join uspu_usuprgunid uspu on uspu.prun_ideregistr=prun.prun_ideregistr
                where 
                    dicn.emp_ideregistro= :empresa and esem.emp_ideregistro = :empresa 
                    and uspu.usu_ideregistro= :usuario and prun.prg_ideregistro=58  ';

        $convenios = $this->executeQuery($sql, $parametros);
        return $convenios;
    }

    public function grabarSuscriptor($informacion) {
        $parametros = array();
        
        $this->setCampo($informacion, $parametros, 'tercero', 'ter_ideregistro');
        $this->setCampo($informacion, $parametros, 'idconvenio', 'cnre_ideregistr');
        $this->setCampo($informacion, $parametros, 'descripcion', 'sus_descripcion');
        $this->setCampo($informacion, $parametros, 'idusuario', 'usu_ideregistro');
        $parametros['sus_modconvenio'] = 'N';
        $parametros['usu_ideregistro'] = $this->sesion->get('idusuario');
        $idSuscriptor = $this->insertar($parametros, 'sus_suscripcion', 'sq_sus_ideregistro');
//        print_r($idSuscriptor);
        if (empty($idSuscriptor)) {
            throw new MyException('Error Grabando Suscriptor', -1);
        }
        return $idSuscriptor;
    }

    public function actualizarTraslado($informacion) {
        if ($informacion['tipoTraslado'] == 'T') {
            $idTrasladoTemporal = $this->InsertarTrasladoTemporal($informacion);
            if (!empty($idTrasladoTemporal)) {
                $datos = array();
                $datos["sus_modconvenio"] = 'S';
                $datos["usu_ideregistro"] = $informacion['idusuario'] ;
                $condicion = "  sus_ideregistro = " . $informacion['idsuscritorAnterior'];
                $filasModificadas  = $this->actualizar($datos,'sus_suscripcion' , $condicion) ;
                if ($filasModificadas == 0) {
                    throw new MyException('Error Modificar Suscriptor :' . $informacion['idsuscritorAnterior']);
                }
                //return $filasModificadas;
            }
        }
        return $this->ModificarSuscripcion($informacion);
    }

    private function ModificarSuscripcion($informacion) {
        $datos = array();
        $datos['sus_ideregistro'] = $informacion['idsuscritorNuevo'];
        $condicion = "  sus_ideregistro = " . $informacion['idsuscritorAnterior'] . " and dsus_ideregistr =" . $informacion['idsuscripcion'];
        $filasModificadas = $this->actualizar($datos, 'dsus_detsuscrip', $condicion);
        if ($filasModificadas == 0) {
            throw new MyException('Error Modificar Suscripcion :' . $informacion['idsuscripcion']);
        }
        return $filasModificadas;
    }

    private function InsertarTrasladoTemporal($informacion) {
        $parametros = array();
        $this->setCampo($informacion, $parametros, 'idsuscripcion', 'dsus_ideregistr');
        $this->setCampo($informacion, $parametros, 'idsuscritorAnterior', 'sus_ideregistro');
        $idTrasladoTemporal = $this->insertar($parametros, 'trds_tradetsuscrip', 'sq_trds_ideregistr');
        if (empty($idTrasladoTemporal)) {
            throw new MyException('Error grabando informacion anterior de Traslado ', -1);
        }
        return $idTrasladoTemporal;
    }
    

}
