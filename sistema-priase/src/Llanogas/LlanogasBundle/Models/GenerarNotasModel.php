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
 * Description of GenerarNotasModel
 *
 * @author hrey
 */
class GenerarNotasModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    /**
     * Obtiene el documento que se quiere generar 
     * @param int $idDocumento identificador de la factura.
     * @param int $idTipoDocumento identificador tipo documento
     * @param string $tipo tipo transacción a generar
     * @return array con el listado de los documentos y tipos de documentos
     * @throws MyException Error la insertar
     */
    public function getTipoTransaccion($idDocumento, $idTipoDocumento, $tipo) {
        $sql = "
        	select
                 ddot.uni_documento iddocumento,
                 uni.est_ideregistro idestructuradocumento
                from 
                 ddot_detdoctipo ddot inner join doti_doctipo doti on ddot.doti_ideregistr=doti.doti_ideregistr
                 inner join uni_unidad uni on ddot.uni_documento=uni.uni_ideregistro
                where 
                 doti.uni_documento=:iddocumento and doti.uni_tipdocument=:idtipodocumento 
                 and ddot.ddot_tipo='$tipo' ";
        $parametros['iddocumento'] = $idDocumento;
        $parametros['idtipodocumento'] = $idTipoDocumento;
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException("Error en la información de los datos. documento $idDocumento y tipo documento $idTipoDocumento tipo $tipo");
        }
        return $resultado[0];
    }

    /**
     * Crea una nueva nota
     * @param array $nota Información de las nota
     * @return int identificador de las nueva nota
     */
    public function insertarNota($nota) {
        $parametros = array();
        $this->setCampo($nota, $parametros, 'fecha', 'not_fecha');
        $this->setCampo($nota, $parametros, 'comentario', 'not_comentario');
        $this->setCampo($nota, $parametros, 'idmotivonota', 'uni_motnota');
        $this->setCampo($nota, $parametros, 'idsuscripcion', 'dsus_ideregistr');
        $this->setCampo($nota, $parametros, 'idciclo', 'cic_ideregistro');
        $this->setCampo($nota, $parametros, 'idperiodo', 'per_ideregistro');
        $this->setCampo($nota, $parametros, 'idestructuranota', 'est_motnota');
        $this->setCampo($nota, $parametros, 'cicloanio', 'cic_ano');
        $this->setCampo($nota, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($nota, $parametros, 'idusuario', 'usu_ideregistro');
        $idNota = $this->insertar($parametros, 'not_nota', 'sq_not_ideregistro');
        $nota['idnota'] = $idNota;
        return $nota;
    }

    /**
     * Crea un nuevo recaudo apartir de otro.
     * @param array $parametros información del recaudo origen.
     * @param array $detalleDocumentoTipo información del documento origen que se quiere anular.
     * @param type $detalleNuevoDocumentoNota información del nuevo documento para generar la cancelación del nuevo
     * recaudo
     * @return int identificador del nuevo recaudo.
     */
    public function insertarRecaudo($recaudo) {
        $parametros = array();
        $this->setCampo($recaudo, $parametros, 'fecha', 'rec_fecha');
        $this->setCampo($recaudo, $parametros, 'estado', 'rec_estado');
        $this->setCampo($recaudo, $parametros, 'fechapago', 'rec_fecpago');
        $this->setCampo($recaudo, $parametros, 'valorpagado', 'rec_vlrpagado');
        $this->setCampo($recaudo, $parametros, 'valorcambio', 'rec_vlrcambio');
        $this->setCampo($recaudo, $parametros, 'valorajuste', 'rec_vlrajuste');
        $this->setCampo($recaudo, $parametros, 'valorreal', 'rec_vlrreal');
        $this->setCampo($recaudo, $parametros, 'mediopago', 'uni_medpago');
        $this->setCampo($recaudo, $parametros, 'idsucursal', 'uni_municipio');
        $this->setCampo($recaudo, $parametros, 'idconvenio', 'cnre_ideregistr');
        $this->setCampo($recaudo, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($recaudo, $parametros, 'idsuscriptor', 'sus_ideregistro');
        $this->setCampo($recaudo, $parametros, 'idtercero', 'ter_ideregistro');
        $this->setCampo($recaudo, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($recaudo, $parametros, 'idrecaudoorigen', 'rec_ideorigen');
        $this->setCampo($recaudo, $parametros, 'idrecaudopadre', 'rec_idepadre');
        $this->setCampo($recaudo, $parametros, 'idusuario', 'usu_ideregistro');
        $idDocumentoRecaudo = $this->insertar($parametros, 'rec_recaudo', 'sq_rec_ideregistro');
        $recaudo['idrecaudo'] = $idDocumentoRecaudo;
        return $recaudo;
    }

    public function insertarNotaRecaudo($notaRecaudo) {
        $parametros = array();
        $this->setCampo($notaRecaudo, $parametros, 'idnotarecaudo', 'nore_ideregistr');
        $this->setCampo($notaRecaudo, $parametros, 'idnota', 'not_ideregistro');
        $this->setCampo($notaRecaudo, $parametros, 'iddetallerecaudoorigen', 'drec_ideorigen');
        $this->setCampo($notaRecaudo, $parametros, 'idrecaudoorigen', 'rec_ideorigen');
        $this->setCampo($notaRecaudo, $parametros, 'iddetallerecaudo', 'drec_ideregistr');
        $this->setCampo($notaRecaudo, $parametros, 'idrecaudo', 'rec_ideregistro');
        $this->setCampo($notaRecaudo, $parametros, 'idusuario', 'usu_ideregistro');
        $idNotaRecaudo = $this->insertar($parametros, 'nore_notrecaudo', 'sq_nore_ideregistr');
        $notaRecaudo['idnotarecaudo'] = $idNotaRecaudo;
    }

    public function actualizarDistribucionRecaudo($distribucionRecaudo) {
        $parametros = $this->getDistribucionRecaudo($distribucionRecaudo);
        $this->actualizar($parametros, 'dire_disrecaudo', 'dire_ideregistr=:dire_ideregistr');
    }

    public function insertarDistribucionRecaudo($distribucionRecaudo) {
        $parametros = $this->getDistribucionRecaudo($distribucionRecaudo);
        $idDistribucionRecaudo = $this->insertar($parametros, 'dire_disrecaudo', 'sq_dire_ideregistr');
        $parametros['iddistribucionrecaudo'] = $idDistribucionRecaudo;
        return $parametros;
    }

    private function getDistribucionRecaudo($distribucionRecaudo) {
        $parametros = array();
        $this->setCampo($distribucionRecaudo, $parametros, 'iddistribucionrecaudo', 'dire_ideregistr');
        $this->setCampo($distribucionRecaudo, $parametros, 'valorrecaudo', 'dire_vlrrecaudo');
        $this->setCampo($distribucionRecaudo, $parametros, 'saldorecaudo', 'dire_sdorecaudo');
        $this->setCampo($distribucionRecaudo, $parametros, 'idrecaudo', 'rec_ideregistro');
        $this->setCampo($distribucionRecaudo, $parametros, 'idconvenio', 'dicn_ideregistr');
        $this->setCampo($distribucionRecaudo, $parametros, 'idsuscripcion', 'dsus_ideregistr');
        $this->setCampo($distribucionRecaudo, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($distribucionRecaudo, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($distribucionRecaudo, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($distribucionRecaudo, $parametros, 'idperiodo', 'per_ideregistro');
        $this->setCampo($distribucionRecaudo, $parametros, 'idciclo', 'cic_ideregistro');
        $this->setCampo($distribucionRecaudo, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($distribucionRecaudo, $parametros, 'cicloanio', 'cic_ano');
        $this->setCampo($distribucionRecaudo, $parametros, 'iddetalleconsigancion', 'dcsg_ideregistr');
        $this->setCampo($distribucionRecaudo, $parametros, 'idusuario', 'usu_ideregistro');
        return $parametros;
    }

    public function insertarNotaFactura($notaFactura) {
        $parametros = array();
        $this->setCampo($notaFactura, $parametros, 'idnotafactura', 'nofa_ideregistr');
        $this->setCampo($notaFactura, $parametros, 'idnota', 'not_ideregistro');
        $this->setCampo($notaFactura, $parametros, 'idfactura', 'fac_ideregistro');
        $this->setCampo($notaFactura, $parametros, 'iddetallefactura', 'dfac_ideregistr');
        $this->setCampo($notaFactura, $parametros, 'idfacturaorigen', 'fac_ideorigen');
        $this->setCampo($notaFactura, $parametros, 'iddetallefacturaorigen', 'dfac_ideorigen');
        $this->setCampo($notaFactura, $parametros, 'idusuario', 'usu_ideregistro');
        return $this->insertar($parametros, 'nofa_notfactura', 'sq_nofa_ideregistr');
    }

}
