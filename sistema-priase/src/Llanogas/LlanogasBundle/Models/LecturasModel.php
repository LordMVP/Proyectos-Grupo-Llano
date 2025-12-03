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
 * Description of AnularModel
 *
 * @author sergio vargas
 */
class LecturasModel extends AuditoriaServices {

    private $genericoModel;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($conexion);
    }

    /**
     * Permite obtener el listado de lecturas suscritas a una subscripcion especifica
     * @param int $idsuscripcion identificador de suscripcion
     * @param string $codigoAnterior codigo anterior
     * @param string $documento documento de identidad
     * @return type
     */
    public function filtrarLecturas($idsuscripcion, $codigoAnterior, $documento, $idUsuario, $idEmpresa) {
        $complemento = '';
        $parametros['idusuario'] = $idUsuario;
        $parametros['idempresa'] = $idEmpresa;
        if (!empty($idsuscripcion)) {
            $complemento = ' and dsus.dsus_ideregistr = :idsuscripcion';
            $parametros['idsuscripcion'] = $idsuscripcion;
        }
        if (!empty($codigoAnterior)) {
            $complemento = ' and dsus.dsus_pcodigo =:codigoanterior';
            $parametros['codigoanterior'] = $codigoAnterior;
        }
        if (!empty($documento)) {
            $complemento = ' and ter.ter_documento = :documento';
            $parametros['documento'] = $documento;
        }
        $sql = "select distinct ter_nomcompleto nombre, ter_documento documento, dsus.dsus_ideregistr idsuscripcion, dsus_pcodigo codigoanterior, uni.uni_nombre1 tipouso, 
                     pro.pro_idepropieda idmedidor, pro.pro_descripcion descripcionmedidor, cic.cic_ideregistro idciclo,per.per_ideregistro idperiodo,
                     per.per_nombre periodo, cic.cic_nombre ciclo, cic.cic_nombre || ' ' || per.per_nombre || ' - ' || date_part('year',per.per_fecinicial) cicloperiodo ,
                     pro.pro_ideregistro idpropiedad
                from sus_suscripcion sus
                    inner join  ter_tercero ter on sus.ter_ideregistro = ter.ter_ideregistro
                    inner join dsus_detsuscrip dsus on  sus.sus_ideregistro = dsus.sus_ideregistro
                    inner join uni_unidad uni on uni.uni_ideregistro = dsus.uni_tipusosuscr  
                    inner join pro_propiedad pro on pro.pro_ideregistro = dsus.pro_ideregistro
                    inner join cic_ciclo cic on dsus.cic_ideregistro=cic.cic_ideregistro
                    inner join per_periodo per on per.cic_ideregistro=dsus.cic_ideregistro
                    inner join uspr_usuprgpryto uspr on dsus.uni_municipio=uspr.uni_municipio
		Where per.per_estado='A' and dsus.dsus_estado not in ('E','P')  and uspr.usu_ideregistro=:idusuario and dsus.emp_ideregistro=:idempresa " . $complemento;
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Obtiene el detalle del medidor
     * @param type $idMedidor identificador del medidor
     * @return type
     */
    public function detallePropiedad($idMedidor) {
        $parametros['idMedidor'] = $idMedidor;
        $sql = "SELECT
                        proy.proyecto_nom Municipio,
                        bar.barrio_nom barrio,
                        pro_direccion direccion,
                        pro_numcatastral catastro
                FROM
                        proyectos proy
                INNER JOIN pro_propiedad prop ON proy.proyecto_ideregistro = prop.uni_municipio
                INNER JOIN barrios bar ON bar.barrio_ideregistro = prop.uni_barrio
                WHERE
                        prop.pro_ideregistro = :idMedidor";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta el historico de las lecturas realizadas a una suscripcin
     * @param int $idsuscripcion identificador de la suscripcion
     * @param date $fechainicial fecha inicial de carga 
     * @param date $fechafinal fecha final de carga
     * @return type
     */
    public function encabezadoHistorico($idsuscripcion, $fechainicial, $fechafinal) {
        $parametros['idsuscripcion'] = $idsuscripcion;
        $parametros['fechainicial'] = $fechainicial;
        $parametros['fechafinal'] = $fechafinal;
        $sql = "select 	    
		   lec.lec_fecha Fecha, lec.lec_anterior LecturaAnterior, 
		   lec.lec_actual lecturaactual, lec.lec_consumo Consumo , 
		   lec.lec_observacion observaciones,lec.lec_conpromedio consumopromedio,
		   lec.dsus_factor factorcorreccion, cic.cic_ideregistro idciclo,
		   per.per_ideregistro idperiodo,per.per_nombre periodo,
		   cic.cic_nombre ciclo, cic.cic_nombre || ' ' || per.per_nombre cicloperiodo
                from lec_lectura lec inner join cic_ciclo cic on lec.cic_ideregistro=cic.cic_ideregistro
                     inner join per_periodo per on lec.per_ideregistro=per.per_ideregistro
                where lec.dsus_ideregistr=:idsuscripcion   and lec.lec_fecha between  :fechainicial and :fechafinal order by lec.lec_fecha desc ";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Obtiene el listado de novedades disponibles
     * @return array
     */
    public function obtenerNovedad() {
        $sql = "select uni_novlectura id, nole_nombre nombre from nole_novlectura";
        return $this->executeQuery($sql);
    }

    /**
     * Obtiene le listado de anomalias diponibles
     * @return array
     */
    public function obtenerAnomalia() {
        $sql = "select uni_anolectura id, anle_nombre nombre from anle_anolectura";
        return $this->executeQuery($sql);
    }

    /**
     * Obtiene el encabezado de la lectura actual de la suscripcion
     * @param int $idsuscripcion identificador de la suscripcion
     * @return array encabezado de la lectura 
     */
    public function obtenerEncabezadoLectura($idsuscripcion) {
        $parametros['idsuscripcion'] = $idsuscripcion;
        $sql = "select 	    
                 lec.lec_ideregistro idlecturaencabezado, lec.lec_fecha::date Fecha, lec.lec_anterior LecturaAnterior, lec.lec_actual LecturaActual, lec.lec_consumo Consumo , 
		 lec.lec_observacion observaciones, 
                 lec.lec_conpromedio consumopromedio,lec.dsus_factor factorcorreccion,
                 lec.pro_digitos digitos 
                from lec_lectura lec
                where lec_estado = 'A' and dsus_ideregistr = :idsuscripcion";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error, no se encontró encabezado.', -1);
        }
        return $resultado[0];
    }

    /**
     * Inserta un nuevo registro en la tabla lectura
     * @param array $lectura
     * @return type
     */
    public function insertarDetalleLectura($lectura) {

        $parametros = $this->getInfoDetalleLectura($lectura);
        return $this->insertar($parametros, 'dlec_detlectura', 'sq_dlec_ideregistr');
    }

    /**
     * Consulta los detalles de las lecturas dependiendo del encabezado.
     * @param int $idLecturaEncabezado identificador del encabezado.
     */
    public function detalleLectura($idLecturaEncabezado) {
        $parametros['idlecturaencabezado'] = $idLecturaEncabezado;
        $sql = "SELECT dlec_ideregistr iddetallelectura, dlec_estado estado, 
                    dlec_fecha::date fecha, dlec_fecprogram fechaprograma,
                    dlec_fecaprobac fechaaprobacion,   dlec_lecreal lecturareal,
                    dlec_actual lecturaactual, dlec_consumo consumo, 
                    dlec_fecejecuta fechaejecuta, dlec_observacio observacion, 
                    ter_ideejecuta idempresalectura, lec_ideregistro idencabezadolectura, 
                    lec_anterior lecturaanterior , dlec.uni_anolectura  idanomalia, 
                    dlec.uni_novlectura idnovedad, emp_ideregistro idempresa,
                    nole.nole_nombre novedad,anle.anle_nombre anomalia,
                    ter.ter_nomcompleto empresalectura, dlec.dlec_realizada ejecutado
               FROM 
                    dlec_detlectura dlec left join nole_novlectura nole on dlec.uni_novlectura=nole.uni_novlectura
                    left join anle_anolectura anle on anle.uni_anolectura=dlec.uni_anolectura
                    left join ter_tercero ter on dlec.ter_ideejecuta=ter.ter_ideregistro
               WHERE
                    dlec.lec_ideregistro=:idlecturaencabezado --and dlec.dlec_estado IN ('A','E')
               ORDER BY dlec.dlec_ideregistr";
        return $this->executeQuery($sql, $parametros);
    }

    public function actualizarDetalleLectura($detalleLectura) {
        $parametros = $this->getInfoDetalleLectura($detalleLectura);
        return $this->actualizar($parametros, 'dlec_detlectura', 'dlec_ideregistr=:dlec_ideregistr');
    }

    public function actualizarLectura($lectura) {
        $parametros = $this->getInfoLectura($lectura);
        return $this->actualizar($parametros, 'lec_lectura', 'lec_ideregistro=:lec_ideregistro');
    }

    public function validadLectura($idsuscripcion) {
        $parametros['idsuscripcion'] = $idsuscripcion;
        $sql = "select
         	  lec_ideregistro idencabezadolectura, lec_estado estado, lec_fecha fecha,
                  pro_digitos digitos
                from lec_lectura lec 
                where lec.lec_estado = 'A' and lec.dsus_ideregistr=:idsuscripcion";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException("Error, la suscripción $idsuscripcion no tiene un encabezado de lectura", -1);
        }
        return $resultado[0];
    }

    private function getInfoDetalleLectura(array $detalleLectura) {
        $parametros = array();
        $this->setCampo($detalleLectura, $parametros, 'estado', 'dlec_estado');
        $this->setCampo($detalleLectura, $parametros, 'idlecturaencabezado', 'lec_ideregistro');
        $this->setCampo($detalleLectura, $parametros, 'fecha', 'dlec_fecha');
        $this->setCampo($detalleLectura, $parametros, 'fechaprograma', 'dlec_fecprogram');
        $this->setCampo($detalleLectura, $parametros, 'fechaaprobacion', 'dlec_fecaprobac');
        $this->setCampo($detalleLectura, $parametros, 'lecturareal', 'dlec_lecreal');
        $this->setCampo($detalleLectura, $parametros, 'lecturaactual', 'dlec_actual');
        $this->setCampo($detalleLectura, $parametros, 'consumo', 'dlec_consumo');
        $this->setCampo($detalleLectura, $parametros, 'fechaejecuta', 'dlec_fecejecuta');
        $this->setCampo($detalleLectura, $parametros, 'observacion', 'dlec_observacio');
        $this->setCampo($detalleLectura, $parametros, 'terceroid', 'ter_ideejecuta');
        $this->setCampo($detalleLectura, $parametros, 'idencabezadolectura', 'lec_ideregistro');
        $this->setCampo($detalleLectura, $parametros, 'lecturaanterior', 'lec_anterior');
        $this->setCampo($detalleLectura, $parametros, 'idanomalia', 'uni_anolectura');
        $this->setCampo($detalleLectura, $parametros, 'idnovedad', 'uni_novlectura');
        $this->setCampo($detalleLectura, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($detalleLectura, $parametros, 'ejecutado', 'dlec_realizada');
        $this->setCampo($detalleLectura, $parametros, 'iddetallelectura', 'dlec_ideregistr');
        $this->setCampo($detalleLectura, $parametros, 'empresalectura', 'ter_ideejecuta');
        $this->setCampo($detalleLectura, $parametros, 'idusuario', 'usu_ideregistro');
        return $parametros;
    }

    private function getInfoLectura(array $lectura) {
        $parametros = array();
        $this->setCampo($lectura, $parametros, 'idencabezadolectura', 'lec_ideregistro');
        $this->setCampo($lectura, $parametros, 'estado', 'lec_estado');
        $this->setCampo($lectura, $parametros, 'fecha', 'lec_fecha');
        $this->setCampo($lectura, $parametros, 'fechaaprobacion', 'lec_fecaprobac');
        $this->setCampo($lectura, $parametros, 'fechaprocesada', 'lec_fecprocesad');
        $this->setCampo($lectura, $parametros, 'lecturaanterior', 'lec_anterior');
        $this->setCampo($lectura, $parametros, 'iddetallelectura', 'dlec_ideregistr');
        $this->setCampo($lectura, $parametros, 'lecturaactual', 'lec_actual');
        $this->setCampo($lectura, $parametros, 'consumo', 'lec_consumo');
        $this->setCampo($lectura, $parametros, 'consumopromedio', 'lec_conpromedio');
        $this->setCampo($lectura, $parametros, 'observacion', 'lec_observacion');
        $this->setCampo($lectura, $parametros, 'idsuscripcion', 'dsus_ideregistr');
        $this->setCampo($lectura, $parametros, 'idpropiedad', 'pro_ideregistro');
        $this->setCampo($lectura, $parametros, 'idciclo', 'cic_ideregistro');
        $this->setCampo($lectura, $parametros, 'idperiodo', 'per_ideregistro');
        $this->setCampo($lectura, $parametros, 'cicloanio', 'cic_ano');
        $this->setCampo($lectura, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($lectura, $parametros, 'idtiposuscripcion', 'uni_tipsuscripc');
        $this->setCampo($lectura, $parametros, 'idtipousosuscripcion', 'uni_tipusosuscr');
        $this->setCampo($lectura, $parametros, 'numeromedidor', 'pro_idepropiedad');
        $this->setCampo($lectura, $parametros, 'medidordigitos', 'pro_digitos');
        $this->setCampo($lectura, $parametros, 'desviacion', 'lec_desviacion');
        $this->setCampo($lectura, $parametros, 'factor', 'dsus_factor');
        $this->setCampo($lectura, $parametros, 'idusuario', 'usu_ideregistro');
        return $parametros;
    }

}
