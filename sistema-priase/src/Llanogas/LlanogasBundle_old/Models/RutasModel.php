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
 * Description of RutasModel
 *
 * @author whernandez
 */
class RutasModel {

    //put your code here

    private $conexion;
    private $parametros;

    /**
     *
     * @var \Llanogas\LlanogasBundle\AuditoriaServices
     */
    private $servicio;
    private $numFilas;
    private $lastId;

    public function __construct() {
        $this->servicio = new AuditoriaServices();
        $this->parametros = array();
    }

    public function getConexion() {
        return $this->conexion;
    }

    public function getParametros() {
        return $this->parametros;
    }

    public function getServicio() {
        return $this->servicio;
    }

    public function getNumFilas() {
        return $this->numFilas;
    }

    public function getLastId() {
        return $this->lastId;
    }

    public function setConexion($conexion) {
        $this->conexion = $conexion;
        $this->servicio->setConnection($conexion);
    }

    public function setParametros($parametros) {
        $this->parametros = $parametros;
    }

    public function setServicio($servicio) {
        $this->servicio = $servicio;
    }

    public function setNumFilas($numFilas) {
        $this->numFilas = $numFilas;
    }

    public function setLastId($lastId) {
        $this->lastId = $lastId;
    }

    public function consultarcboRuta($idUsuario, $idEmpresa) {
        $parametros ['idUsuario'] = $idUsuario; //= array('idUsuario' => $idUsuario);
        $parametros ['idEmpresa'] = $idEmpresa;
        $sql = "SELECT 
                    rut.rut_ideregistro idRuta, rut.rut_nombre nomRuta,  
                    rut.rut_tipo idTipoRuta 
                FROM 
                    rut_ruta rut 
					inner join usru_usuruta usru ON usru.rut_ideregistro=rut.rut_ideregistro
					inner join ruem_rutempresa ruem on ruem.rut_ideregistro = rut.rut_ideregistro
                WHERE 
                   usru.usu_ideregistro= :idUsuario and ruem.emp_ideregistro= :idEmpresa ";
        $this->servicio->setSql($sql);
        $this->servicio->setParams($parametros);
        $resultado = $this->servicio->execute();
        return $resultado;
    }

    public function consultarcboTipoSuscripcion($idEmpresa) {
        $parametros = array('idEmpresa' => $idEmpresa);
        $sql = "SELECT tsu.uni_tipsuscripc idtipoSuscripcion, 
                        tsu.tsu_nombre nomtipoSuscripcion 
                        
                FROM esem_estempresa esem 
                INNER JOIN tsu_tipsuscripc tsu ON 
                tsu.est_tipsuscripc=esem.est_ideregistro
                
                WHERE esem.emp_ideregistro=:idEmpresa ";
        $this->servicio->setSql($sql);
        $this->servicio->setParams($parametros);
        $resultado = $this->servicio->execute();
        return $resultado;
    }

    public function consultarSuscripciones($parametros = array()) {
        $complemento = '';

        if (!empty($parametros['idSuscripcion'])) {
            $complemento.='and dsus.dsus_ideregistr=:idSuscripcion ';
        }

        if (!empty($parametros['idPropiedad'])) {
            $complemento.='and pro.pro_idepropieda=:idPropiedad ';
        }

        if (!empty($parametros['idTercero'])) {
            $complemento.='and dsus.ter_ideregistro=:idTercero ';
        }


        $sql = "SELECT dsus.dsus_ideregistr idsuscripcion, ter.ter_nomcompleto tercero, uni.uni_nombre2 tipopropiedad, 
            pro.pro_idepropieda idpropiedad,  pro.pro_direccion direccion, pry.proyecto_nom municipio, 
            bar.barrio_nom barrio, dsus.dsus_pcodigo pcodigo
            
            FROM dsus_detsuscrip dsus
            inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
            inner join pro_propiedad pro on pro.pro_ideregistro=dsus.pro_ideregistro 
            inner join proyectos pry on pry.proyecto_ideregistro=pro.uni_municipio
            inner join barrios bar on bar.barrio_ideregistro=pro.uni_barrio
            inner join uni_unidad uni on uni.uni_ideregistro=pro.uni_tippropieda
                WHERE dsus.emp_ideregistro = ". $parametros['idempresa'] ." 
                dsus.dsus_ideregistr NOT IN (SELECT rusu.dsus_ideregistr from  rusu_rutsuscrip rusu
                inner join rut_ruta rut on rut.rut_ideregistro=rusu.rut_ideregistro
                WHERE rut.rut_tipo IN (SELECT rut.rut_tipo FROM rut_ruta WHERE rut.rut_ideregistro=:idRuta) 
                and rusu.dsus_ideregistr=dsus.dsus_ideregistr)  and dsus.pro_ideregistro=pro.pro_ideregistro
                and dsus.uni_tipsuscripc in (" . $parametros['idTipoSus'] . ")" . $complemento;

        $this->servicio->setSql($sql);
        $this->servicio->setParams($parametros);
        $resultado = $this->servicio->execute();
        return $resultado;
    }

    public function consultarRutas($parametros = array()) {
        $complemento = '';

        if ($parametros['idSecuencia'] == 0) {
            $complemento.='and rusu.rusu_rutsecuen=:idSecuencia ';
        }

        if ($parametros['idSecuencia'] <> 0) {
            $parametros['idSecuencia'] = 0;
            $complemento.='and rusu.rusu_rutsecuen<>:idSecuencia ';
        }

        $sql = "SELECT dsus.dsus_ideregistr idsuscripcion, ter.ter_nomcompleto tercero, uni.uni_nombre2 tipopropiedad,
                pro.pro_idepropieda idPropiedad, pro.pro_direccion direccion, pry.proyecto_nom municipio, 
                bar.barrio_nom barrio, dsus.dsus_pcodigo pcodigo, rusu.rusu_rutsecuen

                FROM dsus_detsuscrip dsus
                    inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
                    inner join pro_propiedad pro on ter.ter_ideregistro=pro.ter_ideregistro and pro.pro_ideregistro=dsus.pro_ideregistro
                    inner join proyectos pry on pry.proyecto_ideregistro=pro.uni_municipio
                    inner join barrios bar on bar.barrio_ideregistro=pro.uni_barrio
                    inner join uni_unidad uni on uni.uni_ideregistro=pro.uni_tippropieda
                    inner join rusu_rutsuscrip rusu on dsus.dsus_ideregistr=rusu.dsus_ideregistr
                WHERE
                    dsus.emp_ideregistro = :idempresa   and 
                    rusu.rut_ideregistro=:idRuta " . $complemento . " ORDER BY rusu.rusu_rutsecuen";
        $this->servicio->setSql($sql);
        $this->servicio->setParams($parametros);
        $resultado = $this->servicio->execute();
        return $resultado;
    }

    public function GrabarRutasSin($datos) {

        $parametros['rusu_rutanterio'] = '.';
        $parametros['rut_ideregistro'] = $datos['idRuta'];
        $parametros['dsus_ideregistr'] = $datos['idSuscripcion'];
        $parametros['rusu_rutsecuen'] = $datos['idSecuencia'];

        $sql = $this->servicio->construyeSQL('insert', 'rusu_rutsuscrip', $parametros);
        $this->servicio->setSql($sql);
        $this->servicio->setParametros($parametros);
        $this->servicio->setsecuencia('sq_rusu_ideregistr');
        $registro = $this->servicio->executeUpdate();

        if ($registro == 0) {
            throw new MyException('Error al insertar la Suscripcion.');
        }
        $idRuta = $this->servicio->getlastId();
        return $idRuta;
    }

    public function ActualizarRutasSin($datos) {


        $condicion = 'rut_ideregistro = ' . $datos['idRuta'];
        $condicion .= ' and  dsus_ideregistr = ' . $datos['idSuscripcion'];
        $parametros['rusu_rutsecuen'] = $datos['idSecuencia'];

        $sql = $this->servicio->construyeSQL('update', 'rusu_rutsuscrip', $parametros, $condicion);
        $this->servicio->setSql($sql);
        $this->servicio->setParametros($parametros);
        $this->servicio->setsecuencia('sq_rusu_ideregistr');
        $registro = $this->servicio->executeUpdate();

        if ($registro == 0) {
            throw new MyException('Error al insertar la Suscripcion.');
        }
        $idRuta = $this->servicio->getlastId();
        return $idRuta;
    }

    public function ActualizarRutasAsi($datos) {


        $condicion = 'rut_ideregistro = ' . $datos['idRuta'];
        $condicion .= ' and  dsus_ideregistr = ' . $datos['idSuscripcion'];
        $parametros['rusu_rutsecuen'] = $datos['idSecuencia'];
//        print_r($condicion);
        $sql = $this->servicio->construyeSQL('update', 'rusu_rutsuscrip', $parametros, $condicion);
        $this->servicio->setSql($sql);
        $this->servicio->setParametros($parametros);
        $this->servicio->setsecuencia('sq_rusu_ideregistr');
        $registro = $this->servicio->executeUpdate();

        if ($registro == 0) {
            throw new MyException('Error al insertar la Suscripcion.');
        }
        $idRuta = $this->servicio->getlastId();
        return $idRuta;
    }

    public function ActualizarTrasladaRutas($datos) {


        $condicion = 'rut_ideregistro = ' . $datos['ideRuta'];
        $condicion.= ' and  dsus_ideregistr = ' . $datos['idSuscripcion'];
        $parametros['rusu_rutsecuen'] = $datos['idSecuencia'];
        $parametros['rut_ideregistro'] = $datos['idRuta'];

        $sql = $this->servicio->construyeSQL('update', 'rusu_rutsuscrip', $parametros, $condicion);
        $this->servicio->setSql($sql);
        $this->servicio->setParametros($parametros);
        $this->servicio->setsecuencia('sq_rusu_ideregistr');
        $registro = $this->servicio->executeUpdate();

        if ($registro == 0) {
            throw new MyException('Error al Trasladar la Suscripcion.');
        }
        $idRuta = $this->servicio->getlastId();
        return $idRuta;
    }

    public function consultarPeriTraslaRutaOri($parametros = array()) {
        $sql = "select per.per_ideorden as peri
                from rusu_rutsuscrip rusu 
                    inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=rusu.dsus_ideregistr 
                    and dsus.dsus_ideregistr=:idSuscripcion --Suscripcion a cambiar la ruta
                    inner join cic_ciclo cic on dsus.cic_ideregistro=cic.cic_ideregistro
                    inner join per_periodo per on cic.cic_ideregistro=per.cic_ideregistro 
                    and per.per_estado='A' ";
        $this->servicio->setSql($sql);
        $this->servicio->setParams($parametros);
        $resultado = $this->servicio->execute();
        return $resultado;
    }

    public function consultarPeriTraslaRutaDes($parametros = array()) {


        $sql = "select per.per_ideorden as peri
                from rut_ruta rut
                    inner join cic_ciclo cic on cic.cic_ideregistro=rut.cic_ideregistro 
                    and rut.rut_ideregistro=:idRuta -- ruta a trasladar la suscripcion
                    inner join per_periodo per on cic.cic_ideregistro=per.cic_ideregistro 
                    and per.per_estado='A' ";
        $this->servicio->setSql($sql);
        $this->servicio->setParams($parametros);
        $resultado = $this->servicio->execute();
        return $resultado;
    }
    
    public function actualizaSecuenciaRuta($idRuta){
        $parametros['idruta'] = $idRuta['idRuta'];
        $parametros['idempresa'] = $idRuta['idempresa'];
        
        $sql = "update rusu_rutsuscrip  set rusu_rutanterio = info.secuencia_actual, rusu_rutsecuen = info.consecutivo
                from (
                                SELECT DENSE_RANK () OVER (ORDER BY fac.fac_fecha ) consecutivo
                                , rusu.rusu_ideregistr idruta , rusu.rusu_rutsecuen secuencia_actual
                                 , fac.fac_fecha, fac.fac_fecaprobada,  rusu.*
                                FROM				rusu_rutsuscrip rusu 
                                INNER JOIN	fac_factura 	fac 	ON  fac.dsus_ideregistr = rusu.dsus_ideregistr
                                INNER JOIN	doc_documento doc  	ON	doc.uni_documento 	= 	fac.uni_documento
                                INNER JOIN	per_periodo per ON per.per_ideregistro = fac.per_ideregistro 
                                WHERE				rusu.rut_ideregistro = :idruta	
                                and doc.doc_tipo ='LI' and fac.fac_estado not in ('E')
                                and fac.emp_ideregistro = :idempresa  and fac.fac_ideorigen is null
                                and per.per_ideregistro = (
                                                                select 	perant.per_ideregistro 
                                                                FROM 		per_periodo peractivo
                                                                INNER JOIN 	per_periodo perant on perant.per_ideregistro < peractivo.per_ideregistro  and perant.per_estado ='C'
                                                                        and perant.cic_ideregistro = peractivo.cic_ideregistro
                                                                                WHERE 	peractivo.per_estado ='A'   
                                                                                        AND 	peractivo.cic_ideregistro  = fac.cic_ideregistro
                                                                                        
                                                                ORDER BY 		perant.per_ideregistro desc
                                                                LIMIT 1
                                ) 
                                ORDER BY fac.fac_fecha 
                ) as info
                where info.idruta = rusu_rutsuscrip.rusu_ideregistr";
         $this->servicio->setSql($sql);
        $this->servicio->setParams($parametros);
        $resultado = $this->servicio->execute();
        return $resultado;
    }

}
