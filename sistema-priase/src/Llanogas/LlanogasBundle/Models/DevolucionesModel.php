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
 * @author hrey
 */
class DevolucionesModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    /**
     * Permite obtener las suscripciones 
     * @param type $idSuscripcion
     * @param type $cedula
     * @param type $codigoAnterior
     * @return type
     * @throws MyException
     */
    public function obtenerSuscripciones($idSuscripcion, $cedula, $codigoAnterior) {
        if (empty($idSuscripcion)) {
            $idSuscripcion = -1;
        }
        if (empty($cedula)) {
            $cedula = -1;
        }
        if (empty($codigoAnterior)) {
            $codigoAnterior = '-1';
        }
        $parametros['suscripcion'] = $idSuscripcion;
        $parametros['cedula'] = $cedula;
        $parametros['codigoAnterior'] = $codigoAnterior;
        $sql = "SELECT dsus_ideregistr idsuscripcion,
                           dsus_descripcion suscripcion, 
                           dsus_pcodigo codanterior, 
                           dsus_estado estado, 
                           ter.ter_nomcompleto nombrecompleto, 
                           ter_documento cedula  
                    FROM   dsus_detsuscrip dsus
                    INNER  JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
                    WHERE  dsus.dsus_ideregistr = :suscripcion OR 
                           dsus.dsus_pcodigo = :codigoAnterior OR 
                           ter.ter_documento = :cedula";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * permite obtener el detalle del recaudo o factura solicitada
     * @param $idfacturarecaudo identificador de la factuara o el recaudo
     * @param $tipo caracter que identifica el tipo de la consulta (F , R)
     * @return Registro que identifica la factura o el recaudo
     * */
    public function obtenerDetalleRecaudoFactura($idfacturarecaudo, $tipo) {
        if (empty($idfacturarecaudo) || empty($tipo)) {
            throw new MyException("Deben existir los parámetros idfacturarecaudo y tipo", -1);
        }
        if ($tipo == 'F') {
            $sql = "
                select fac_numero numero, fac_fecha fecha, fac_sdoreal saldo, fac_vlrreal valortotal from fac_factura 
                where fac_ideregistro = $idfacturarecaudo";
        }
        if ($tipo == 'R') {
            $sql = "select rec_ideregistro idrecaudo, rec_fecpago fechapago, rec_vlrpagado pago, rec_vlrreal valortotal from rec_recaudo where rec_ideregistro = $idfacturarecaudo";
        }

        $respuesta = $this->executeQuery($sql);
        return $respuesta[0];
    }

    /**
     * obtener la devoluciones existentes entre facturas y recaudos 
     * @param Suscripcion $suscripcion
     * @return listado de devopluciones existentes
     * @throws MyException
     */
    public function obtenerDevoluciones($suscripcion) {
        $parametros['suscripcion'] = $suscripcion;
        $sql = "SELECT fac.fac_fecha fecha,fac.fac_version AS VERSION,doc.uni_documento iddocumento,
                  fac.uni_tipdocument idtipodocumento,doc.doc_nombre documento,utip.tido_nombre tipodocumento,
                  fac.fac_sdoreal valor,fac.uni_documento idtipo,fac.fac_ideregistro idfacturarecaudo,
                  'F' proceso, null iddistribucion
                FROM fac_factura fac INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                INNER JOIN tido_tipdocumen utip ON utip.uni_tipdocument = fac.uni_tipdocument
                WHERE
                  fac_estado = 'P' AND doc.doc_devolucion = 'S' AND fac.fac_sdoreal > 0 AND fac.dsus_ideregistr = :suscripcion
                UNION
                SELECT
                        rec.rec_fecha fecha,
                        rec.rec_version AS VERSION,
                        doc.uni_documento iddocumento,
                        dire.uni_tipdocument idtipodocumento,
                        doc.doc_nombre documento,
                        utip.tido_nombre tipodocumento,
                        dire.dire_sdorecaudo::integer valor,
                        rec.uni_documento idtipo,
                        rec.rec_ideregistro idfacturarecaudo,
                        'R' proceso, dire.dire_ideregistr iddistribucion
                FROM
                        rec_recaudo rec INNER JOIN dire_disrecaudo dire ON dire.rec_ideregistro = rec.rec_ideregistro
                  INNER JOIN tido_tipdocumen utip ON utip.uni_tipdocument = dire.uni_tipdocument
                  INNER JOIN doc_documento doc ON doc.uni_documento = rec.uni_documento
                  INNER JOIN csg_consignacion csg ON rec.csg_ideregistro=csg.csg_ideregistro
                  INNER JOIN  mvi_movimiento  mvi ON  mvi.mvi_ideregistro = rec.mvi_ideregistro  and mvi.mvi_estado ='X'
                WHERE
                  rec.rec_estado IN ('A', 'P', 'G')
                  AND doc.doc_devolucion = 'S'
                  AND dire.dire_sdorecaudo > 0
                  AND dire.dsus_ideregistr = :suscripcion
                  AND doc.doc_tipo = 'AN'
                  AND csg.csg_estado='A' order by idfacturarecaudo, iddistribucion asc";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Obtiene el listado de todos los motivos
     * @return listado de motivos
     * @throws MyException
     */
    public function obtenerMotivos() {
        $sql = 'SELECT UNI_MOTNOTA idmotivo, MONO_NOMBRE nombre FROM MONO_MOTNOTA';
        return $this->executeQuery($sql);
    }
    
    public function consultaRecaudo($idrecaudo){
          $sql = "select * from rec_recaudo where rec_ideregistro=:idrecaudo ";
        $parametros['idrecaudo'] = $idrecaudo;
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException("Error, recaudo $idrecaudo no existe o se encuentra consignado", -3);
        }
        $datos['idrecaudo'] = $resultado[0]['rec_ideregistro'];
        $datos['fecha'] = $resultado[0]['rec_fecha'];
        $datos['estado'] = $resultado[0]['rec_estado'];
        $datos['fechaaplicado'] = $resultado[0]['rec_fecaplicado'];
        $datos['vlrpagado'] = $resultado[0]['rec_vlrpagado'];
        $datos['cambio'] = $resultado[0]['rec_vlrcambio'];
        $datos['ajuste'] = $resultado[0]['rec_vlrajuste'];
        $datos['vlrreal'] = $resultado[0]['rec_vlrreal'];
        $datos['idmediopago'] = $resultado[0]['uni_medpago'];
        $datos['idconvenio'] = $resultado[0]['cnre_ideregistr'];
        $datos['idempresa'] = $resultado[0]['emp_ideregistro'];
        $datos['idsuscriptor'] = $resultado[0]['sus_ideregistro'];
        $datos['idtercero'] = $resultado[0]['ter_ideregistro'];
        $datos['iddocumento'] = $resultado[0]['uni_documento'];
        $datos['idorigen'] = $resultado[0]['rec_ideorigen'];
        $datos['idpadre'] = $resultado[0]['rec_idepadre'];
        $datos['fechapago'] = $resultado[0]['rec_fecpago'];
        $datos['idsucursal'] = $resultado[0]['uni_municipio'];
        $datos['idusuario'] = $resultado[0]['usu_ideregistro'];
        $datos['version'] = $resultado[0]['rec_version'];
        $datos['idconsignacion'] = $resultado[0]['csg_ideregistro'];
        $datos['idmovimiento'] = $resultado[0]['mvi_ideregistro'];
        $datos['idunificado'] = $resultado[0]['rec_ideunificad'];
        return $datos;
    }
    
    public function validarTipoCasoDevolucion($idrecaudo, $vlrDevolucion){
        
        $sql="select  
                (case WHEN sum(dire.dire_sdorecaudo) = rec.rec_vlrpagado  then
                        (case when $vlrDevolucion = rec.rec_vlrpagado then 'caso2' else 'caso3'   end)
                else   
                        (case when sum(dire.dire_sdorecaudo)= $vlrDevolucion then 'caso1' else 'caso4'   end) 
                end ) caso
            FROM            rec_recaudo rec  
            inner join      dire_disrecaudo dire on dire.rec_ideregistro = rec.rec_ideregistro
            where           rec.rec_ideregistro = $idrecaudo
            group by        rec.rec_vlrpagado";
        return $this->executeQuery($sql);
    }
    
    public function consultaDistribucionRecaudo($idDistribucionRecaudo){
       
        $parametros['iddistribucionrecaudo'] = $idDistribucionRecaudo;
          $sql = "select * from dire_disrecaudo where dire_ideregistr=:iddistribucionrecaudo ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException("Error, La distribucion $idDistribucionRecaudo no tiene datos", -3);
        }
        $datos['iddistribucion'] = $resultado[0]['dire_ideregistr'];
        $datos['vlrrecaudo'] = $resultado[0]['dire_vlrrecaudo'];
        $datos['sdorecaudo'] = $resultado[0]['dire_sdorecaudo'];
        $datos['idrecaudo'] = $resultado[0]['rec_ideregistro'];
        $datos['idconvenio'] = $resultado[0]['dicn_ideregistr'];
        $datos['idsuscripcion'] = $resultado[0]['dsus_ideregistr'];
        $datos['iddocumento'] = $resultado[0]['uni_documento'];
        $datos['idtipodocumento'] = $resultado[0]['uni_tipdocument'];
        $datos['idconcepto'] = $resultado[0]['uni_concepto'];
        $datos['idperiodo'] = $resultado[0]['per_ideregistro'];
        $datos['idciclo'] = $resultado[0]['cic_ideregistro'];
        $datos['idempresa'] = $resultado[0]['emp_ideregistro'];
        $datos['cicloanio'] = $resultado[0]['cic_ano'];
        $datos['iddetalleconsignacion'] = $resultado[0]['dcsg_ideregistr'];
        $datos['idusuario'] = $resultado[0]['usu_ideregistro'];
        $datos['version'] = $resultado[0]['dire_version'];
        $datos['idmovimiento'] = $resultado[0]['mvi_ideregistro'];
        $datos['idmovrecaudo'] = $resultado[0]['mvre_ideregistr'];
        $datos['idmovconsignado'] = $resultado[0]['mvcs_ideregistr'];
        return $datos;
    }
    
   
    
    public function actualizaRecaudo($idRecaudo){
        try{
            $sql = "UPDATE rec_recaudo  
                    SET rec_vlrpagado =     (select SUM(dire_vlrrecaudo) FROM dire_disrecaudo  WHERE rec_ideregistro = $idRecaudo)
                    ,     rec_vlrreal = 	(select SUM(dire_vlrrecaudo) FROM dire_disrecaudo  WHERE rec_ideregistro = $idRecaudo)  
                    WHERE rec_ideregistro = $idRecaudo ";
            $resultado =  $this->executeQuery($sql); 
        } catch (\Exception $e){
            throw  new MyException('Error, Actualizando el Recaudo '.$idRecaudo,-3);
        }
        return $resultado;
    }
     /**
     * Inserta la información de un recaudo en la base de datos
     * @param array $recaudo - Información obtenido adionada con el idrecaudo
     */
    public function insertarRecaudo(array &$recaudo) {
        try{
            $parametros = array();
            $this->setCampo($recaudo, $parametros, 'fecha', 'rec_fecha');
            $this->setCampo($recaudo, $parametros, 'estado', 'rec_estado');
            $this->setCampo($recaudo, $parametros, 'fechaaplicado', 'rec_fecaplicado');
            $this->setCampo($recaudo, $parametros, 'vlrpagado', 'rec_vlrpagado');
            $this->setCampo($recaudo, $parametros, 'cambio', 'rec_vlrcambio');
            $this->setCampo($recaudo, $parametros, 'ajuste', 'rec_vlrajuste');
            $this->setCampo($recaudo, $parametros, 'vlrreal', 'rec_vlrreal');
            $this->setCampo($recaudo, $parametros, 'idmediopago', 'uni_medpago');
            $this->setCampo($recaudo, $parametros, 'idconvenio', 'cnre_ideregistr');
            $this->setCampo($recaudo, $parametros, 'idempresa', 'emp_ideregistro');
            $this->setCampo($recaudo, $parametros, 'idsuscriptor', 'sus_ideregistro');
            $this->setCampo($recaudo, $parametros, 'idtercero', 'ter_ideregistro');
            $this->setCampo($recaudo, $parametros, 'iddocumento', 'uni_documento');
            $this->setCampo($recaudo, $parametros, 'idorigen', 'rec_ideorigen');
            $this->setCampo($recaudo, $parametros, 'idpadre', 'rec_idepadre');
            $this->setCampo($recaudo, $parametros, 'fechapago', 'rec_fecpago');
            $this->setCampo($recaudo, $parametros, 'idsucursal', 'uni_municipio');
            $this->setCampo($recaudo, $parametros, 'idconsignacion', 'csg_ideregistro');
            $this->setCampo($recaudo, $parametros, 'idusuario', 'usu_ideregistro');
            $this->setCampo($recaudo, $parametros, 'version', 'rec_version');
            $this->setCampo($recaudo, $parametros, 'idmovimiento', 'mvi_ideregistro');
            $this->setCampo($recaudo, $parametros, 'idunificado', 'rec_ideunificad');
            $idRecaudo = $this->insertar($parametros, 'rec_recaudo', 'sq_rec_ideregistro');
        } catch (\Exception $e){
            throw  new MyException('Error, Al insertar el Recaudo', -3);
        }
        return $idRecaudo;
    }
    
     /**
     * Inserta la distribución de un recaudo en la base de datos y se obtiene su id
     * @param array $distribucion - Distribución del recaudo
     */
    public function insertarDistribucionRecaudo(array &$distribucion) {
        
        $parametros = array();
        try{
            $this->setCampo($distribucion, $parametros, 'vlrrecaudo', 'dire_vlrrecaudo');
            $this->setCampo($distribucion, $parametros, 'sdorecaudo', 'dire_sdorecaudo');
            $this->setCampo($distribucion, $parametros, 'idrecaudo', 'rec_ideregistro');
            $this->setCampo($distribucion, $parametros, 'idconvenio', 'dicn_ideregistr');
            $this->setCampo($distribucion, $parametros, 'idsuscripcion', 'dsus_ideregistr');
            $this->setCampo($distribucion, $parametros, 'iddocumento', 'uni_documento');
            $this->setCampo($distribucion, $parametros, 'idtipodocumento', 'uni_tipdocument');
            $this->setCampo($distribucion, $parametros, 'idconcepto', 'uni_concepto');
            $this->setCampo($distribucion, $parametros, 'idperiodo', 'per_ideregistro');
            $this->setCampo($distribucion, $parametros, 'idciclo', 'cic_ideregistro');
            $this->setCampo($distribucion, $parametros, 'idempresa', 'emp_ideregistro');
            $this->setCampo($distribucion, $parametros, 'cicloanio', 'cic_ano');
            $this->setCampo($distribucion, $parametros, 'iddetalleconsignacion', 'dcsg_ideregistr');
            $this->setCampo($distribucion, $parametros, 'idusuario', 'usu_ideregistro');
            $this->setCampo($distribucion, $parametros, 'version', 'dire_version');        
            $this->setCampo($distribucion, $parametros, 'idmovimiento', 'mvi_ideregistro');
            $this->setCampo($distribucion, $parametros, 'idmovrecaudo', 'mvre_ideregistr');
            $this->setCampo($distribucion, $parametros, 'idmovconsignado', 'mvcs_ideregistr');
            $this->setCampo($distribucion, $parametros, 'iddireorigen', 'dire_ideorigen');
            $this->setCampo($distribucion, $parametros, 'iddirepadre', 'dire_idepadre');
            $resultado =  $this->insertar($parametros, 'dire_disrecaudo', 'sq_dire_ideregistr');
        } catch (\Exception $e){
            throw new MyException('Error, Insertando la distribucion',-3);
        }
        return $resultado;
    }
    
    public function actualizaDistribucionRecaudoPadre($idrecaudoPadre, $vlrAplicarDistribucionPadreSdo, $idDsitribucion, $version,$vlrAplicarDistribucionPadreVlr){
        $sql = "UPDATE   	dire_disrecaudo 
                SET		dire_vlrrecaudo = $vlrAplicarDistribucionPadreVlr, dire_sdorecaudo = $vlrAplicarDistribucionPadreSdo, dire_version = dire_version +1
                where dire_ideregistr = $idDsitribucion   and rec_ideregistro = $idrecaudoPadre ";
        return $this->executeQuery($sql); 
    }
}
