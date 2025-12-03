<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * Clase que realiza toda la congfiguración y administración de las tablas que 
 * están relacionadas con recaudos.
 *
 * @author manuel
 */
class RecaudosModel extends AuditoriaServices {

    /**
     *
     * @var GenericoModel
     */
    private $genericoModel;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->conexion = $conexion;
        $this->genericoModel = new GenericoModel($this->conexion);
    }

    /**
     * Función que se encarga de consultar la información de un suscriptor.
     * @param int $idEmpresa empresa que pertenece la suscripción.
     * @param string $cedula Documento de identidad del tercero
     * @param int $idSuscripcion identificador único de la suscripción.
     * @param string $codAnterior Codigo anterior de la suscripción.
     * @return array retorna la información de la suscripción junto a la del suscriptor
     */
    public function consultarSuscriptor($idEmpresa, $cedula = '', $idSuscripcion = '', $codAnterior = '') {
        $parametros = array('codempresa' => $idEmpresa);
        $parametros['estado'] = 'A';
        $complementoSql = '';
        if (!empty($cedula)) {
            $complementoSql .= ' AND ter.ter_documento = :numdocumento';
            $parametros['numdocumento'] = $cedula;
        }
        if (!empty($codAnterior)) {
            $complementoSql .= ' AND dsus.dsus_pcodigo = :codAnterior';
            $parametros['codAnterior'] = $codAnterior;
        }
        if (!empty($idSuscripcion)) {
            $complementoSql .= ' AND dsus.dsus_ideregistr = :suscripcion';
            $parametros['suscripcion'] = $idSuscripcion;
        }
        $sql = 'SELECT
                    distinct 
                    sus.sus_ideregistro idSuscriptor, ter.ter_ideregistro idTercero, 
                    ter.ter_documento docTercero, ter.ter_nomcompleto nombreTercero, 
                    cnre.cnre_ideregistr idConvenio, cnre.cnre_nombre nombreConvenio
                FROM 
                    sus_suscripcion sus inner join ter_tercero ter on sus.ter_ideregistro = ter.ter_ideregistro
                    inner join cnre_cnvrecaudo cnre on sus.cnre_ideregistr = cnre.cnre_ideregistr
                    inner join dsus_detsuscrip dsus on sus.sus_ideregistro = dsus.sus_ideregistro
                WHERE  dsus.dsus_estado =:estado ' . $complementoSql;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta la información de una suscripción por el identificador ó estado
     * @param int $idEmpresa empresa que pertenece la suscripción.
     * @param int $idSuscriptor identificador del suscriptor
     * @param int $estado Estado de la suscripción
     * @return array registros encontrados por los criterios de búsqueda.
     */
    public function getSuscripciones($idEmpresa, $cedula, $idSuscripcion, $codAnterior, $estado = 'A') {
        $complementoSql = 'AND dsus.emp_ideregistro=:idempresa';
        $parametros['idempresa'] = $idEmpresa;
        if (!empty($cedula)) {
            $complementoSql .= ' AND ter.ter_documento = :cedula';
            $parametros['cedula'] = $cedula;
        }
        if (!empty($codAnterior)) {
            $complementoSql .= ' AND dsus.dsus_pcodigo = :codigoanterior';
            $parametros['codigoanterior'] = $codAnterior;
        }
        if (!empty($idSuscripcion)) {
            $complementoSql .= ' AND dsus.dsus_ideregistr = :idsuscripcion';
            $parametros['idsuscripcion'] = $idSuscripcion;
        }
        $sql = "select
                  distinct 
                  sus.sus_ideregistro idsuscriptor, ter.ter_ideregistro idtercero, 
                  ter.ter_documento cedula, ter.ter_nomcompleto nombretercero, 
                  cnre.cnre_ideregistr idconvenio, cnre.cnre_nombre nombreconvenio,
                  dsus.dsus_ideregistr idsuscripcion,dsus.emp_ideregistro idempresa,
                  dsus.dsus_pcodigo codAnterior,dsus.dsus_estado estado, 
                  dsus.uni_tipsuscripc idtiposuscripcion,
                  sus.sus_ideregistro idsuscriptor,sus.cnre_ideregistr convenio,
                  (select uni.uni_nombre1 from uni_unidad uni where uni.uni_ideregistro=dsus.uni_tipsuscripc ) tiposuscripcion
                from dsus_detsuscrip dsus inner join sus_suscripcion sus on dsus.sus_ideregistro=sus.sus_ideregistro
                  inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
                  inner join cnre_cnvrecaudo cnre on sus.cnre_ideregistr = cnre.cnre_ideregistr
                where dsus.dsus_estado in ($estado) $complementoSql ";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta todas las facturas que tiene saldo de una ó varias suscripciones
     * @param string $suscripciones cadena de texto con los identificadores de la suscripciones
     * @return array registros encontrados (facturas)
     */
    public function getFacturasConSaldo($suscripciones,$CarteraAseoNoHomologada=0) {
        return $this->genericoModel->getFacturasConSaldo($suscripciones,$CarteraAseoNoHomologada);
    }

    /**
     * Consulta los medios de pago que tiene una empresa
     * @param int $idEmpresa código de la empresa
     * @param int $idUsuario idenficador del usuario
     * @return array Todos los medios de pagos asignados
     */
    public function consultarMedio($idEmpresa, $idUsuario) {
        $parametros['idusuario'] = $idUsuario;
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT usmp.uni_medpago id, uni.uni_nombre1 nombre, mpa.mpa_tipo tipo 
        FROM  usmp_usumedpago usmp 
        INNER JOIN uni_unidad uni ON uni.uni_ideregistro=usmp.uni_medpago 
        INNER JOIN esem_estempresa esem ON esem.est_ideregistro=uni.est_ideregistro  
        INNER JOIN mpa_medpago mpa ON mpa.uni_medpago = usmp.uni_medpago  
        WHERE usmp.usu_ideregistro=:idusuario  and esem.emp_ideregistro=:idempresa";
        return $this->executeQuery($sql, $parametros);
    }

        /**
     * Consulta los documentos validos para cambiar el documento con el que se registro el pago en la empresa
     * Permite sólo cambiar los recaudos que no han sido consignados y los que el usuario tenga en el perfil
     * @param int $idEmpresa código de la empresa
     * @param int $idUsuario idenficador del usuario
     * @param int $idRegistro idenficador del recaudo
     * @param int $idPrograma idenficador del programa
     * @return array Todos los medios de pagos asignados
     */
    public function consultarDocumentosValidosXCambio($idEmpresa, $idUsuario,$idRecaudo,$idPrograma) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idusuario'] = $idUsuario;
        $parametros['idrecaudo'] = $idRecaudo;
        $parametros['idprograma'] = $idPrograma;
        $sql = "SELECT 1 orden, doc.uni_documento iddocumento, doc.doc_nombre documento
                    FROM  rec_recaudo rec
                    INNER JOIN doc_documento doc on doc.uni_documento= rec.uni_documento
                    WHERE rec.rec_ideregistro= :idrecaudo  and rec.emp_ideregistro= :idempresa
                UNION 
                SELECT DISTINCT 2 orden, docvalido.uni_documento iddocumento, docvalido.doc_nombre documento
                    FROM  rec_recaudo rec
                    INNER JOIN doc_documento doc on doc.uni_documento= rec.uni_documento
                    INNER JOIN esem_estempresa esem on esem.emp_ideregistro=rec.emp_ideregistro and esem.est_ideregistro=doc.est_documento    
                    INNER JOIN doc_documento docvalido on doc.doc_tipo=docvalido.doc_tipo and docvalido.est_documento=esem.est_ideregistro
                    INNER JOIN prun_prgunidad prun on prun.uni_ideregistro=docvalido.uni_documento 
                    INNER JOIN uspu_usuprgunid uspu on uspu.prun_ideregistr=prun.prun_ideregistr
                    WHERE rec.rec_ideregistro= :idrecaudo  and rec.emp_ideregistro= :idempresa and prun.prg_ideregistro= :idprograma
                           and uspu.usu_ideregistro= :idusuario and rec.csg_ideregistro is null order by orden";
        return $this->executeQuery($sql, $parametros);
    }
    
    /**
     * Consulta los tipos de documento según la diferencia de la consignación
     * @param int $idEmpresa código de la empresa
     * @param int $idUsuario idenficador del usuario
     * @return array Todos los medios de pagos asignados
     */
    public function consultarTiposDocumentosAprobacion($iddocumento, $idconsignacion) {
        $parametros['iddocumento'] = $iddocumento;
        $parametros['idconsignacion'] = $idconsignacion;
        $sql = "  SELECT
                    doti.uni_tipdocument idtipodocumento,
                    tido.tido_nombre tipodocumento
                  FROM ddot_detdoctipo ddot
                    INNER JOIN doti_doctipo doti ON doti.doti_ideregistr = ddot.doti_ideregistr
                                                    AND doti.uni_documento = ddot.uni_documento
                    INNER JOIN csg_consignacion csg ON csg.uni_documento = doti.uni_documento
                    inner join esem_estempresa esem on esem.emp_ideregistro=csg.emp_ideregistro
                    inner join tido_tipdocumen tido on tido.uni_tipdocument=doti.uni_tipdocument and tido.est_tipdocument=esem.est_ideregistro
                  WHERE ddot.ddot_tipo = (CASE WHEN csg.csg_vlrfaltante > 0 THEN 'FA' 
                                          WHEN csg.csg_vlrgasto > 0
                                            THEN 'GA'
                                          WHEN csg.csg_vlrsobrante > 0
                                            THEN 'SO'
                                          WHEN csg.csg_vlrcuentaxpagar > 0
                                            THEN 'CP'
                                          ELSE '' END) 
                        AND ddot.uni_documento = :iddocumento AND csg.csg_ideregistro = :idconsignacion";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta todas las clases asignadas a un programa y al usuario que ingresó al sistema
     * @param string $tipoDocumento tipo de documento a consultar (AN=Anticipo, AB=Abono, PA=Pago, PC=Cartera Castigada)
     * @param int $idUsuario identificador del usuario
     * @param int $idEmpresa identificador de la empresa
     * @return array Todas las clases de documento que se encontraron para el usuario y programa específico
     */
    public function consultarClase($tipoDocumento, $idUsuario, $idEmpresa, $idPrograma) {
        $parametros['idusuario'] = $idUsuario;
        $parametros['tipodocumento'] = $tipoDocumento;
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idprograma'] = $idPrograma;
        $sql = 'select doc.uni_documento id, uni.uni_nombre1 nombre 
                from uspu_usuprgunid uspu
                   inner join prun_prgunidad prun on prun.prun_ideregistr=uspu.prun_ideregistr
                   inner join doc_documento doc on doc.uni_documento=prun.uni_ideregistro
                   inner join uni_unidad uni on uni.uni_ideregistro=prun.uni_ideregistro 
                   inner join esem_estempresa esem on esem.est_ideregistro=uni.est_ideregistro 
                where 
                  uspu.usu_ideregistro=:idusuario and doc.doc_tipo=:tipodocumento and esem.emp_ideregistro=:idempresa AND prun.prg_ideregistro = :idprograma ';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta todos los detalles de una factura que contengan saldo
     * @param int $idFactura identificador de la factura
     * @return array conceptos con saldo
     * @throws MyException Se lanza un error si el idfacruta llega vacío
     */
    public function getConceptosFactura($idFactura, $estado = 'A') {
        if (empty($idFactura)) {
            throw new MyException('Error, faltan parámetros para la consulta');
        }

        $parametros['idfactura'] = $idFactura;
        $complemento = " WHERE  fac.fac_ideregistro=:idfactura AND dfac.dfac_sdoreal>0 AND fac.fac_estado='$estado'  
                         ORDER BY con.con_pagpriori";
        return $this->genericoModel->getConceptosInformacion($complemento, $parametros);
    }

    /**
     * Consulta las facturas que están castigadas dependiendo de una suscripción 
     * @param iny $suscripciones string separados por coma.
     * @return array
     */
    public function getFacturasCarteraCastigada($suscripciones) {
        $complemento = "Where fac.fac_estado='C' and fac.fac_sdoreal>0 and fac.dsus_ideregistr in ($suscripciones)  and fac.fac_idepadre is null ";
        return $this->genericoModel->getFacturasInformacion($complemento);
    }

    /**
     * Ingresa un nuevo registro en la tabla de recaudos.
     * @param array $recaudo  Información del recaudo
     * @param int $empresa identificador empresa
     * @return bool TRUE Se insertó FALSE error al insertar
     */
    public function insertarRecaudo($recaudo, $empresa) {
        $data['rec_fecha'] = 'now()';
        $data['uni_municipio'] = $recaudo['sucursal'];
        $data['rec_fecpago'] = !empty($recaudo['fecha']) ? $recaudo['fecha'] : 'now()';
        $data['rec_estado'] = 'A';
        $data['rec_vlrpagado'] = $recaudo['pagado'];
        $data['rec_vlrcambio'] = $recaudo['cambio'];
        $data['rec_vlrajuste'] = $recaudo['ajuste'];
        $data['rec_vlrreal'] = $recaudo['pagado'] - $recaudo['cambio'];
        $data['uni_medpago'] = $recaudo['mediopago'];
        $data['cnre_ideregistr'] = $recaudo['convenio'];
        $data['emp_ideregistro'] = $empresa;
        $data['sus_ideregistro'] = $recaudo['suscriptor'];
        $data['ter_ideregistro'] = $recaudo['tercero'];
        $data['uni_documento'] = $recaudo['clasepago'];
        $data['usu_ideregistro'] = $recaudo['idusuario'];
        $data['rec_ideorigen'] = (isset($recaudo['idorigen'])) ? $recaudo['idorigen'] : null;
        return $this->insertar($data, 'rec_recaudo', 'sq_rec_ideregistro');
    }

    /**
     * Agrega un registro en la tabla de recaudos como anticipo.
     * @param type $recaudo informacion del recaudo
     * @param type $empresa identificador único de la empresa
     * @return bool TRUE Se insertó FALSE error al insertar
     */
    public function insertarRecaudoAnticipo($recaudo, $empresa) {
        $data = array();
        $data['rec_fecha'] = 'now()';
        $data['rec_estado'] = 'G';
        $data['rec_vlrpagado'] = $recaudo['pagado'];
        $data['rec_vlrcambio'] = $recaudo['cambio'];
        $data['rec_vlrajuste'] = $recaudo['ajuste'];
        $data['rec_vlrreal'] = $recaudo['pagado'] - $recaudo['cambio'];
        $data['uni_medpago'] = $recaudo['mediopago'];
        $data['cnre_ideregistr'] = $recaudo['idConvenio'];
        $data['emp_ideregistro'] = $empresa;
        $data['sus_ideregistro'] = $recaudo['idSuscriptor'];
        $data['ter_ideregistro'] = $recaudo['idTercero'];
        $data['uni_documento'] = $recaudo['clasepago'];
        $data['rec_fecpago'] = !empty($recaudo['fecha']) ? $recaudo['fecha'] : 'now()';
        $data['uni_municipio'] = $recaudo['sucursal'];
        $data['usu_ideregistro'] = $recaudo['idusuario'];
        return $this->insertar($data, 'rec_recaudo', 'sq_rec_ideregistro');
    }

    /**
     * Agrega un nuevo registro de la tabla de distribución del recuado. 
     * @param array $distribucion  información de que suscripciones va afectar el recaudo.
     * @param array $infoRecaudo información del recaudo que se registro.
     * @return bool TRUE Se insertó FALSE error al insertar
     */
    public function insertarDistribucionRecaudo($distribucion, $infoRecaudo) {
        $data['dire_vlrrecaudo'] = $distribucion['valorSuscripcion'];
        $data['dire_sdorecaudo'] = $distribucion['valorSuscripcion'];
        $data['rec_ideregistro'] = $distribucion['recaudo'];
        $data['dicn_ideregistr'] = $distribucion['convenio'];
        $data['dsus_ideregistr'] = $distribucion['suscripcion'];
        $data['per_ideregistro'] = $infoRecaudo['periodo'];
        $data['cic_ideregistro'] = $infoRecaudo['ciclo'];
        $data['cic_ano'] = $infoRecaudo['cicloanio'];
        $data['emp_ideregistro'] = $distribucion['empresa'];
        $data['usu_ideregistro'] = $distribucion['idusuario'];
        $data['dire_version'] = 1;
        $this->setCampo($distribucion, $data, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($distribucion, $data, 'idconcepto', 'uni_concepto');
        $this->setCampo($distribucion, $data, 'idperiodo', 'per_ideaplica');
        $this->setCampo($distribucion, $data, 'iddocumento', 'uni_documento');
        return $this->insertar($data, 'dire_disrecaudo', 'sq_dire_ideregistr');
    }

    /**
     * Agrega un nuevo registro distribución recaudo.
     * @param array $distribucion informción de las suscripciones y valor asignado
     * @return bool TRUE Se insertó FALSE error al insertar
     */
    public function crearDistribucionRecaudo($distribucion) {
        $data['dire_vlrrecaudo'] = $distribucion['valor'];
        $data['dire_sdorecaudo'] = $distribucion['saldo'];
        $data['rec_ideregistro'] = $distribucion['recaudo'];
        $data['dicn_ideregistr'] = $distribucion['convenio'];
        $data['dsus_ideregistr'] = $distribucion['suscripcion'];
        $data['per_ideregistro'] = $distribucion['periodo'];
        $data['cic_ideregistro'] = $distribucion['ciclo'];
        $data['emp_ideregistro'] = $distribucion['empresa'];
        $data['usu_ideregistro'] = $distribucion['idusuario'];
        $data['cic_ano'] = $distribucion['cicloanio'];
        return $this->insertar($data, 'dire_disrecaudo', 'sq_dire_ideregistr');
    }

    /**
     * Actualiza el estado del recaudo
     * @param int $idRecaudo Identificador del recaudo.
     * @param string $estado Estado del recaudo que se quiere aplicar
     * @return bool TRUE se actualizó FALSE error
     */
    public function actualizarMedioPagoRecaudo($idRecaudo, $idRecaudoNuevo) {
        $sql = "UPDATE fpre_forpagreca
                SET rec_ideregistro = :idrecaudonuevo
                WHERE
                        rec_ideregistro = :idrecaudo";
        $parametros['idrecaudo'] = $idRecaudo;
        $parametros['idrecaudonuevo'] = $idRecaudoNuevo;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Agrega un nuevo registro de la tabla de distribución del recuado en forma de anticipo. 
     * @param array $distribucion  información de que suscripciones va afectar el recaudo.
     * @param array $periodo identificador del periodo actual de la suscripción.
     * @param array $ciclo identificador del ciclo actual de la suscripción.
     * @return bool TRUE Se insertó FALSE error al insertar
     */
    public function insertarDistribucionRecaudoAnticipos($distribucion, $periodo, $ciclo) {
        $data['dire_vlrrecaudo'] = $distribucion['valor'];
        $data['dire_sdorecaudo'] = $distribucion['valor'];
        $data['rec_ideregistro'] = $distribucion['recaudo'];
        $data['dicn_ideregistr'] = 0;
        $data['dsus_ideregistr'] = $distribucion['idSuscripcion'];
        $data['per_ideregistro'] = $periodo;
        $data['cic_ideregistro'] = $ciclo;
        $data['emp_ideregistro'] = $distribucion['empresa'];
        $data['usu_ideregistro'] = $distribucion['idusuario'];
        if (isset($distribucion['idTipoDoc'])) {
            $data['uni_tipdocument'] = $distribucion['idTipoDoc'];
        }
        if (isset($distribucion['idDocumento']) && $distribucion['idDocumento'] != -1) {
            $data['uni_documento'] = $distribucion['idDocumento'];
        }
        if (isset($distribucion['idConcepto']) && $distribucion['idConcepto'] != 0) {
            $data['uni_concepto'] = $distribucion['idConcepto'];
        }
        return $this->insertar($data, 'dire_disrecaudo', 'sq_dire_ideregistr');
    }

    /**
     * Agrega un registro de las facturas que fueron afectadas por un recaudo
     * @param array $recaudo información de las facturas y recaudo
     * @return int identificador del nuevo registro
     */
    public function insertarRecaudoFactura($recaudo) {
        $data['dsus_ideregistr'] = $recaudo['suscripcion'];
        $data['fac_ideregistro'] = $recaudo['factura'];
        $data['dire_ideregistr'] = $recaudo['distribucion'];
        $data['emp_ideregistro'] = $recaudo['empresa'];
        $data['usu_ideregistro'] = $recaudo['idusuario'];
        return $this->insertar($data, 'fare_facrecaudo', 'sq_fare_ideregistr');
    }

    /**
     * Ingresa el detalle del recaudo que se registró.
     * @param array $recaudo información del recaudo
     * @return indentificador del nuevo detalle
     */
    public function insertarDetalleRecaudo($recaudo) {
        $data['rec_ideregistro'] = $recaudo['recaudo'];
        $data['drec_vlrtotal'] = $recaudo['valorPagado'];
        $data['drec_vlrreal'] = $recaudo['valorPagado'];
        $data['drec_fecha'] = 'now()';
        $data['fac_ideregistro'] = $recaudo['factura'];
        $data['cic_ideregistro'] = $recaudo['ciclo'];
        $data['per_ideregistro'] = $recaudo['periodo'];
        $data['uni_documento'] = $recaudo['iddocumento'];
        $data['uni_tipdocument'] = $recaudo['idtipodocumento'];
        $data['dfac_ideregistr'] = $recaudo['idConcepto'];
        $data['dire_ideregistr'] = $recaudo['distribucion'];
        $data['cic_ano'] = $recaudo['cicloanio'];
        $data['usu_ideregistro'] = $recaudo['idusuario'];
        return $this->insertar($data, 'drec_detrecaudo', 'sq_drec_ideregistr');
    }

    /**
     * Consulta los bancos registrados en el sistema
     * @return array todos los bancos
     */
    public function consultarBancos() {
        $sql = 'select  
          dtip.dtip_ideregistr idbanco,
	  dtip.dtip_valor nombrebanco
	from 
	  inun_infunidad inun, tip_tipifica tip, dtip_dettipific dtip
	where
	  inun.uni_ideregistro=78 and inun.inf_ideregistro=4 and tip.tip_ideregistro=9 and
	  inun.inf_ideregistro=tip.inf_ideregistro and tip.inf_ideregistro=dtip.inf_ideregistro and
	  tip.tip_ideregistro=dtip.tip_ideregistro ';
        return $this->executeQuery($sql);
    }

    /**
     * Consulta los tipos de liquidación de una factura.
     * @param int $idSuscripcion
     * @return array Listado de liquidaciones asignadas.
     */
    public function consultarTiposLiquidacion($idSuscripcion) {
        $sql = 'select 
	  l.uni_liquidacion idliquidacion, 
	  l.liq_nombre nombreliquidacion
	from
	  liq_liquidacion l INNER JOIN lids_liqdetsusc ls ON l.uni_liquidacion=ls.uni_liquidacion
	where 
	  ls.dsus_ideregistr = :idSuscripcion';
        $parametros['idSuscripcion'] = $idSuscripcion;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Se consultan los conceptos de un anticipo
     * @param type $idEmpresa identificador de la empresa
     * @param type $idSuscripcion identificador suscripción
     * @param type $idLiquidacion  identificador liquidacion
     * @return array listados de conceptos.
     */
    public function getConceptosAnticipos($idEmpresa, $idSuscripcion, $idLiquidacion) {
        $sql = "select distinct 
		  c.uni_concepto idconcepto, 
		  c.con_nombre nombreconcepto
		from
		liq_liquidacion l, lids_liqdetsusc ls, coli_conliquida lc, 
		con_concepto c
		where 
		ls.emp_ideregistro= :idempresa and ls.dsus_ideregistr= :idsuscripcion and  
		l.uni_liquidacion= :idliquidacion and
		l.uni_liquidacion=lc.uni_liquidacion and 
		lc.uni_concepto=c.uni_concepto and
		c.con_anticipo='S' and c.con_operacion='S' and c.con_estado='A' ";
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idliquidacion'] = $idLiquidacion;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Se consultan los documentos y tipos de documentos de una suscripción
     * @param int $idEmpresa identificador de la empresa
     * @param int $idSuscripcion identificador de la suscripción
     * @return array listado de documentos y tipos de documentos asignados
     */
    public function getDocumentosTiposAnticipos($idEmpresa, $idSuscripcion) {
        $sql = "select 
                    distinct l.uni_documento, d.doc_nombre, l.uni_tipdocument, 
                    td.tido_nombre
                from 
                    liq_liquidacion l, lids_liqdetsusc ls, doc_documento d, 
                    tido_tipdocumen td
                where 
                    ls.emp_ideregistro=:empresa and ls.dsus_ideregistr=:suscripcion and
                    ls.uni_liquidacion=l.uni_liquidacion and l.uni_documento=d.uni_documento 
                    and l.uni_tipdocument=td.uni_tipdocument ";
        $parametros['suscripcion'] = $idSuscripcion;
        $parametros['empresa'] = $idEmpresa;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Se registran las diferentes formas de pagos asignados a un recaudo 
     * @param type $recaudo información de las formas de pagos asignados al recaudo
     * @return int identificador generado por la base de datos del nuevo registro
     */
    public function insertarFormasPagos($recaudo) {
        $data['rec_ideregistro'] = $recaudo['recaudo'];
        $data['uni_forpago'] = $recaudo['formaPago'];
        $data['fpre_vlrreal'] = $recaudo['valor'];
        $data['usu_ideregistro'] = $recaudo['idusuario'];
        return $this->insertar($data, 'fpre_forpagreca', 'sq_fpre_ideregistr');
    }

    /**
     * Se registra la información adicional del recaudo.
     * @param array $informacion arreglo con los detalles de la información adicional registrada al recaudo.
     * @return int identificador generado por la base de datos del nuevo registro
     */
    public function insertarInformacionAdicional($informacion) {
        $data['infp_informacio'] = $informacion['informacion'];
        $data['infp_estado'] = 'A';
        $data['infp_descripcio'] = '.';
        $data['fpre_ideregistr'] = $informacion['idFormaPago'];
        $data['uni_forpago'] = $informacion['unidadFormaPago'];
        $data['infp_grpinform'] = 1;
        $data['tip_ideregistro'] = $informacion['tipificacion'];
        $data['tip_nombre'] = $informacion['nombreTipificacion'];
        $data['usu_ideregistro'] = $informacion['idusuario'];
        if (isset($informacion['idBanco'])) {
            $data['dtip_ideregistr'] = $informacion['idBanco'];
        }
        return $this->insertar($data, 'infp_infforpago', 'sq_infp_ideregistr');
    }

    /**
     * Se consultan los tipos de suscripción.
     * @param int $idEmpresa identificador de la empresa
     * @param string $complemento condción en sql que se quiera implementar en los tipos de suscripciones.
     * @return array registros encontrados
     */
    public function consultarTiposSuscripcion($idEmpresa, $complemento = '') {
        $parametros['idEmpresa'] = $idEmpresa;
        $sql = 'SELECT 
                  tsu.uni_tipsuscripc idtiposuscripcion, 
                  tsu.tsu_nombre tiposuscripcion
                FROM 
                  tsu_tipsuscripc tsu inner join esem_estempresa esem on tsu.est_tipsuscripc = esem.est_ideregistro
                WHERE 
                  esem.emp_ideregistro = :idEmpresa ' . $complemento;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta un recaudo por el identificador, idsuscripción o por un rango de fechas.
     * @param int $idRegistro identifiador del recaudo.
     * @param int $idSuscripcion id suscripción
     * @param string $fechaInicio fecha de inicio que se quiere consultar
     * @param string $fechaFin fecha de finalización que se quiere implementar.
     * @return array los recaudos asignados a una suscripción.
     */
    public function consultarRecaudo($idRegistro = "", $idSuscripcion = "", $fechaInicio = "", $fechaFin = "") {

        $parametros = array();
        $complementoSql = '';
        if (!empty($idRegistro)) {
            $complementoSql .= " rec.rec_ideregistro = :idRegistro";
            $parametros["idRegistro"] = $idRegistro;
        } else {
            if (!empty($idSuscripcion)) {
                $complementoSql .= " dsus.dsus_ideregistr = :idSuscripcion";
                $parametros["idSuscripcion"] = $idSuscripcion;
            }
            if (!empty($fechaInicio) && !empty($fechaFin)) {
                $complementoSql .= " AND rec.rec_fecha between :fechaInicio and :fechaFin";
                $parametros["fechaInicio"] = $fechaInicio;
                $parametros["fechaFin"] = $fechaFin;
            }
            $complementoSql .= " )AND rec.rec_estado <> 'E'";
        }

        $sql = "SELECT DISTINCT 
                           rec.rec_ideregistro idrecaudo, 
                           rec.rec_fecha fecha, 
                           rec.sus_ideregistro idsuscriptor,
                           rec.uni_documento iddocumento,
                           ter.ter_documento terdocumento, 
                           ter.ter_nomcompleto ternombrecompleto,
                           cnre.cnre_ideregistr idconvenio,
                           cnre.cnre_nombre nombreconvenio
                      FROM 
                           rec_recaudo rec inner join sus_suscripcion sus on rec.sus_ideregistro = sus.sus_ideregistro 
                           inner join dsus_detsuscrip dsus on sus.sus_ideregistro = dsus.sus_ideregistro
                           inner join ter_tercero ter on ter.ter_ideregistro = sus.ter_ideregistro
                           inner join cnre_cnvrecaudo cnre on rec.cnre_ideregistr = cnre.cnre_ideregistr
                     WHERE $complementoSql ORDER BY rec.rec_fecha;";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Se consultan los motivos de suspensión que se le asignaron a un tipo de suscripción.
     * @param int $idTipoSuscripcion identificador del tipo de suscripción.
     * @return array con los registros.
     */
    public function consultarMotivosSuspension($idTipoSuscripcion) {
        $parametros['idTipoSuscripcion'] = $idTipoSuscripcion;
        $sql = "  SELECT 
                    mosu.uni_motsuspen idmotivosuspension, 
                    mosu.mosu_nombre motivosuspension
                  FROM 
                    dtsu_dettipsusc dtsu inner join mosu_motsuspen mosu on dtsu.uni_motsuspen = mosu.uni_motsuspen
                  WHERE 
                    dtsu.uni_tipsuscripc = :idTipoSuscripcion AND mosu.mosu_proceso='P' ";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta un rango de facturas que tengan saldo dependiendo de la empresa
     * @param int $inicio numero inicial de las facturas que se quieren consultar
     * @param int $fin numero total de registros
     * @param int $idEmpresa identificador de las empresas
     * @return array listado de facturas
     */
    public function consultarFacturasConSaldo($inicio, $fin, $idEmpresa) {
        $parametros['inicio'] = $inicio;
        $parametros['fin'] = $fin;
        $parametros['idEmpresa'] = $idEmpresa;
        $sql = "select * from  consultarfacturasconsaldo(:inicio,:fin,:idEmpresa)";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta si una suscripción genera suspensión.s
     * @param int $idSuscripcion identificador de la suscripción.
     * @return array Detalle de suspensión de la suscripción.
     */
    public function generaSuspensionPorTipoSuscipcion($idSuscripcion) {
        $sql = 'SELECT
                    tsu.tsu_persuspend suspende
                FROM
                    tsu_tipsuscripc tsu inner join dsus_detsuscrip dsus on tsu.uni_tipsuscripc = dsus.uni_tipsuscripc
                WHERE
                    dsus.dsus_ideregistr = :idsuscripcion';
        $parametros['idsuscripcion'] = $idSuscripcion;
        $resultado = $this->executeQuery($sql, $parametros);
        $datos['suspende'] = 'N';
        if (count($resultado) > 0) {
            $datos['suspende'] = $resultado[0]['suspende'];
        }
        return $datos;
    }

    /**
     * Actualiza el estado de recaudos.
     * @param string $estado Estado que se quiere dejar el recaudo
     * @param int $idRecaudo identificador del recaudo.
     * @return int Número de recaudos afectados.
     */
    public function actualizarEstadoRecaudo($estado, $idRecaudo) {
        $data['rec_ideregistro'] = $idRecaudo;
        $data['rec_estado'] = $estado;
        return $this->actualizar($data, 'rec_recaudo', 'rec_ideregistro = :rec_ideregistro');
    }

    /**
     * Consulta los recaudos con saldo disponible.
     * @param array $parametros Criterios de búsqueda
     * @param string $complemento sql con la condición de búsqueda de los recaudos
     * @return array Listado de recaudos
     */
    private function consultarRecaudosConDisponible($parametros, $complemento = '') {
        $sql = "select 
		 dire.dire_ideregistr iddistribucionrecaudo,
                 dire.rec_ideregistro idrecaudo,dire.dire_sdorecaudo saldorecaudo,
                 dire.uni_documento iddocumento,dire.uni_tipdocument idtipodocumento,
                 dire.uni_concepto idconcepto,dire.cic_ideregistro idciclo,
                 dire.per_ideregistro idperiodo,dire.emp_ideregistro idempresa,
                 dire.dsus_ideregistr idsuscripcion
                from 
                 dire_disrecaudo dire
                where
                 dire.dire_sdorecaudo>0 $complemento
                order by
                 dire.dire_ideregistr
                offset :offset
                limit :numeroregistros ";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta recaudos disponibles por el identificador
     * @param int $idDistribucionRecaudo identificador de la distribución.
     * @return array Listado de recaudos
     */
    public function consultarRecaudoConDisponiblePorId($idDistribucionRecaudo) {
        $complemento = ' and dire.dire_ideregistr = :iddistribucionrecaudo';
        $parametros['iddistribucionrecaudo'] = $idDistribucionRecaudo;
        $parametros['numeroregistros'] = 1000;
        $parametros['offset'] = 0;
        return $this->consultarRecaudosConDisponible($parametros, $complemento);
    }

    /**
     * Consulta recaudos disponibles por el identificador
     * @param int $idSuscripcion identificador de la suscripción.
     * @return array Listado de recaudos
     */
    public function consultarRecaudosConDisponiblePorSuscripcion($idSuscripcion) {
        $complemento = ' and dire.dsus_ideregistr = :idSuscripcion';
        $parametros['idSuscripcion'] = $idSuscripcion;
        $parametros['numeroregistros'] = 1000;
        $parametros['offset'] = 0;
        return $this->consultarRecaudosConDisponible($parametros, $complemento);
    }

    /**
     * Consulta los recaudos con disponible por un rango de fechas.
     * @param date $inicio  fecha inicial.
     * @param date $numero  numero de registros a consultar
     * @param int $idEmpresa identificador de la empresa
     * @param int $idTipoSuscripcion identificador del tipo de suscripción.
     * @return array Consulta de recaudos.
     */
    public function consultarRecaudosConDisponiblePorRango($inicio, $numero, $idEmpresa, $idTipoSuscripcion) {
        $parametros['offset'] = $inicio;
        $parametros['numeroregistros'] = $numero;
        $parametros['idEmpresa'] = $idEmpresa;
        $parametros['idTipoSuscripcion'] = $idTipoSuscripcion;
        $complemento = ' and dire.emp_ideregistro = :idEmpresa and dsus.uni_tipsuscripc=:idTipoSuscripcion ';
        return $this->consultarRecaudosConDisponible($parametros, $complemento);
    }

    /**
     * Consulta de los conceptos con saldo
     * @param int $idFactura identificador de la factura
     * @param array $parametros parámetros de consulta
     * @return array Listado de los conceptos
     */
    public function consultarConceptosConSaldo($idFactura, $parametros = array()) {
        $parametros['idfactura'] = $idFactura;
        $complemento = 'where fac.fac_ideregistro=:idfactura ';
        if (isset($parametros['iddocumento'])) {
            $complemento .= 'AND fac.uni_documento = :iddocumento ';
        }
        if (isset($parametros['idconcepto'])) {
            $complemento .= 'AND dfac.uni_concepto = :idconcepto';
        }
        if (isset($parametros['idtipodocumento'])) {
            $complemento .= 'AND fac.uni_tipdocument = :idtipodocumento ';
        }
        return $this->genericoModel->getConceptosInformacion($complemento, $parametros);
    }

    /**
     * Consulta de tipo de documento por una factura específica. 
     * @param int $idFactura identificador de la factura
     * @return array detalle del tipo de documento
     * @throws MyException Error no se encontraron tipos de documentos
     */
    public function consultarTipoDocumentoPorFactura($idFactura) {
        $parametros['idfactura'] = $idFactura;
        $sql = 'select uni_tipdocument idtipodocumento, uni_documento iddocumento from fac_factura where fac_ideregistro = :idfactura';
        $this->setSql($sql);
        $this->setParams($parametros);
        $resultado = $this->execute();
        if (count($resultado) == 0) {
            throw new MyException('No se encontró el tipo de documento');
        }
        $datos['iddocumento'] = $resultado[0]['iddocumento'];
        $datos['idtipodocumento'] = $resultado[0]['idtipodocumento'];
        return $datos;
    }

    /**
     * Consulta el número de facturas existentes
     * @return int número total de registros que existen en la tabla de facturas
     * @throws MyException No hay facturas.
     */
    public function consultarNumeroFacturas() {
        $sql = 'select count(fac_ideregistro) numerofacturas from fac_factura';
        $resultado = $this->executeQuery($sql);
        if (count($resultado) == 0) {
            throw new MyException('Error al consultar el número total de facturas');
        }
        return $resultado[0]['numerofacturas'];
    }

    /**
     * Consulta los recaudos realizados en un periodo
     * @param int $idSuscripcion identificador de la suscripción
     * @param int $idPeriodo identificador del periodo
     * @return array Listado de recaudos
     */
    public function consultarRecaudosPorSuscripcionPeriodoActual($idSuscripcion, $idPeriodo) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idperiodo'] = $idPeriodo;
        $sql = 'select
                 dire.dire_ideregistr iddistribucionrecaudo, dire.dire_vlrrecaudo valorrecaudo,
                 dire.rec_ideregistro idrecaudo, dire.dsus_ideregistr idsuscripcion,
                 rec.rec_fecha fecharecaudo
                from dire_disrecaudo dire inner join rec_recaudo rec on dire.rec_ideregistro = rec.rec_ideregistro
                where per_ideregistro = :idperiodo and dsus_ideregistr = :idsuscripcion';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta la información de la suscripción.
     * @param int $idSuscripcion identificador de la suscripción.
     * @return array Detalle de la suscripción
     * @throws MyException Error la suscripción no existe
     */
    public function consultarInformacionSuscripcion($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['estado'] = 'A';
        $sql = 'SELECT dsus_estado estado, dsus.dsus_descripcion descripcion,
                  dsus.dsus_pcodigo codigoanterior, dsus.sus_ideregistro idsuscriptor,
                  dsus.dsus_ideregistr idsuscripcion, dsus.ter_ideregistro idtercero,
                  dsus.pro_ideregistro idpropiedad, dsus.uni_municipio idmunicipio,
                  dsus.uni_barrio idbarrio, dsus.est_tipsuscripc idestructuratiposuscripcion,
                  dsus.uni_tipsuscripc idtiposuscripcion, dsus.est_tipusosuscr idestructuratipousosuscripcion,
                  dsus.uni_tipusosuscr idtipousosuscripcion, dsus.emp_ideregistro idempresa,
                  dsus.est_liquidacion idestructuraliquidacion, dsus.uni_liquidacion idliquidacion,
                  dsus.cic_ideregistro idciclo, dsus.dsus_fecinicio fechainicio,
                  dsus.dsus_fecexpira fechaexpira, dsus.pro_catestrato estrato,
                  dsus.dsus_iniestado inicioestado, dsus.dsus_finestado finestado,
                  tsu.tsu_persuspend permitesuspension
                FROM
                  dsus_detsuscrip dsus inner join tsu_tipsuscripc tsu on tsu.uni_tipsuscripc = dsus.uni_tipsuscripc
                WHERE
                  dsus_ideregistr = :idsuscripcion  AND dsus_estado = :estado';
        $resultado = $this->executeQuery($sql, $parametros);
        if (count($resultado) == 0) {
            throw new MyException('No se encontró la suscripción o no está en estado Activa');
        }
        return $resultado[0];
    }

    /**
     * Consulta los recaudos que tiene disponible
     * @param int $idEmpresa identificador de la empresa
     * @return array detalle del número de registros con saldo
     * @throws MyException No hay recaudos con disponible.
     */
    public function contarNumeroRecaudosConDisponible($idEmpresa) {
        $parametros['idEmpresa'] = $idEmpresa;
        $sql = 'select count(dire_ideregistr) from dire_disrecaudo where emp_ideregistro = :idEmpresa';
        $resultado = $this->executeQuery($sql, $parametros);
        $datos['numeroRecaudos'] = $resultado[0]['numerorecaudos'];
        return $datos;
    }

    /**
     * Actualiza el disponible de un recaudo.
     * @param int $idDistribucionRecaudo identificador del disponible
     * @param double $valor valor del disponible actual
     * @return int numero de registros actualizados.
     */
    public function actualizarSaldoDisponibleRecaudo($idDistribucionRecaudo, $valor) {
        $data['dire_ideregistr'] = $idDistribucionRecaudo;
        $data['dire_sdorecaudo'] = $valor;
        return $this->actualizar($data, 'dire_disrecaudo', 'dire_ideregistr = :dire_ideregistr');
    }

    /**
     * Consulta los recaudos por un identificador
     * @param int $idRecaudo identificador del recaudo
     * @param int $idEmpresa identificador de la empresa
     * @return array Descripción del recaudo.
     * @throws MyException Error el recaudo no existe
     */
    public function consultarRecaudoPorId($idRecaudo, $idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idrecaudo'] = $idRecaudo;
        $sql = "
            select
              rec.rec_ideregistro idrecaudo,
              rec.rec_fecha fecha,
              rec.rec_vlrreal valor 
            from rec_recaudo rec
            where 
              rec.rec_ideregistro=:idrecaudo and rec.emp_ideregistro=:idempresa and rec.rec_estado <> 'E' and rec.rec_vlrreal>0 ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (count($resultado) == 0) {
            throw new MyException('No se encontró el recaudo');
        }
        return $resultado[0];
    }

    /**
     * Consulta los recaudos por un identificador
     * @param int $idRecaudo identificador del recaudo
     * @return array Descripción del recaudo.
     * @throws MyException Error el recaudo no existe
     */
    public function consultarInformacionRecaudo($idRecaudo) {
        $parametros['idRecaudo'] = $idRecaudo;
        $sql = '
                select 
                 dire.dire_ideregistr iddistribucionrecaudo,
                 dire.dsus_ideregistr idsuscripcion,
                 ter.ter_nomcompleto nombresuscriptor,
                 sus.sus_ideregistro idsuscriptor,
                 dsus.dsus_pcodigo codigoanterior,
                 tsu.tsu_nombre tiposuscripcion
                from 
                 dire_disrecaudo dire inner join dsus_detsuscrip dsus on dire.dsus_ideregistr=dsus.dsus_ideregistr
                 inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
                 inner join sus_suscripcion sus on dsus.sus_ideregistro=sus.sus_ideregistro
                 inner join tsu_tipsuscripc tsu on dsus.uni_tipsuscripc=tsu.uni_tipsuscripc
                where
                dire.rec_ideregistro=:idRecaudo ';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta los detalles de un recaudo.
     * @param int $idRecaudo identificador de un recaudo
     * @return array Listado de los detalles de un recaudo
     */
    public function consultarDetallesRecaudosPorId($idRecaudo) {
        $sql = "SELECT 
                    drec_ideregistr iddetallerecaudo, rec_ideregistro idrecaudo,
                    drec_vlrtotal valortotal, drec_vlrreal valorreal, 
                    drec_fecha fecha, drec_ideorigen detalleorigen, 
                    fac_ideregistro idfactura, cic_ideregistro idciclo, 
                    per_ideregistro idperiodo, uni_documento iddocumento,
                    uni_tipdocument idtipodocumento, 
                    dfac_ideregistr idfactura, 
                    dire_ideregistr iddistribucionrecaudo, drec_idepadre idpadre
                FROM drec_detrecaudo 
                where rec_ideregistro=:idrecaudo ";
        $parametros['idrecaudo'] = $idRecaudo;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta si un recaudo es un anticipo.
     * @param int $idRecaudo identificador de un recaudo
     * @return bool TRUE es anticipo, FALSE no es
     */
    public function esAnticipo($idRecaudo) {
        $sql = ' select * from dire_disrecaudo where rec_ideregistro=:idrecaudo  
                and( uni_documento is not null or uni_tipdocument is not null or uni_concepto is not null)';
        $parametros['idrecaudo'] = $idRecaudo;
        $resultado = $this->executeQuery($sql, $parametros);
        return (!empty($resultado));
    }

    public function consultarSucursal($idPrograma, $idUsuario) {
        $parametros['idprograma'] = $idPrograma;
        $parametros['idusuario'] = $idUsuario;
        $sql = 'select uspr.uni_municipio idsucursal, pry.proyecto_nom sucursal 
                from 
                 uspr_usuprgpryto uspr inner join proyectos pry on  uspr.uni_municipio=pry.proyecto_ideregistro
                where
                 uspr.prg_ideregistro=:idprograma and uspr.usu_ideregistro=:idusuario';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta todas las suscripciones dependiendo de un suscriptor y del convenio.
     * Este método se utiliza en el caso de uso recaudos pagos. 
     * @param type $idSuscriptor
     * @return array Lista de suscripciones
     */
    public function getSuscripcionesPagos($idSuscriptor, $idSuscripcionAseoCarteraNoHomologada=0) {
        $complementoSQL = "";
        $parametros['idsuscriptor'] = $idSuscriptor;
        if($idSuscripcionAseoCarteraNoHomologada>0)
        {
            $complementoSQL = " AND dsus.dsus_ideregistr = :idsuscripcion" ;
            $parametros['idsuscripcion']= $idSuscripcionAseoCarteraNoHomologada ; 
            
        }
        $sql = "select
                  distinct 
                  sus.sus_ideregistro idsuscriptor, ter.ter_ideregistro idtercero, 
                  ter.ter_documento cedula, ter.ter_nomcompleto nombretercero, 
                  cnre.cnre_ideregistr idconvenio, cnre.cnre_nombre nombreconvenio,
                  dsus.dsus_ideregistr idsuscripcion,dsus.emp_ideregistro idempresa,
                  dsus.dsus_pcodigo codAnterior,dsus.dsus_estado estado, 
                  dsus.uni_tipsuscripc idtiposuscripcion,
                  sus.sus_ideregistro idsuscriptor,sus.cnre_ideregistr convenio,
                  (select uni.uni_nombre1 from uni_unidad uni where uni.uni_ideregistro=dsus.uni_tipsuscripc ) tiposuscripcion
                from dsus_detsuscrip dsus inner join sus_suscripcion sus on dsus.sus_ideregistro=sus.sus_ideregistro
                  inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
                  inner join cnre_cnvrecaudo cnre on sus.cnre_ideregistr = cnre.cnre_ideregistr
                  inner join fac_factura fac on fac.dsus_ideregistr = dsus.dsus_ideregistr
                where dsus.dsus_estado='A' and sus.sus_ideregistro=:idsuscriptor and fac.fac_estado = 'A' and fac.fac_sdoreal>0 ". $complementoSQL ;
        return $this->executeQuery($sql, $parametros);
    }

    public function getRecaudosConsignaciones($idSucursal, $idEmpresa, $idMedioPago, $idConsignacion) {
        $parametros['idsucursal'] = $idSucursal;
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idmediopago'] = $idMedioPago;
        $parametros['idconsignacion'] = $idConsignacion;
        $sql = "select fecha, sum(valor)  valor 
                from( 
	            SELECT  
                        rec.rec_fecpago::DATE fecha, SUM(rec.rec_vlrreal) valor
                    FROM 
                        rec_recaudo rec INNER JOIN doc_documento doc ON rec.uni_documento=doc.uni_documento
                    WHERE
                        rec.rec_estado in ('A','P','G') AND doc.doc_consigna='S'
                        AND (rec.csg_ideregistro IS NULL OR rec.csg_ideregistro=:idconsignacion ) AND rec.emp_ideregistro=:idempresa
                        AND rec.uni_municipio=:idsucursal AND rec.uni_medpago=:idmediopago
                        AND rec.rec_idepadre IS NULL
                    GROUP BY rec.rec_fecpago
                ) as consolidado GROUP BY fecha order by fecha  ";
        return $this->executeQuery($sql, $parametros);
    }

    public function getRecaudosConsignacionesEmpresa($idSucursal, $idEmpresa, $idMedioPago, $fecha, $idConsignacion) {
        $parametros['idsucursal'] = $idSucursal;
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idmediopago'] = $idMedioPago;
        $parametros['idconsignacion'] = $idConsignacion;
        $sql = "select  idempresa,empresa,sum(valor) valor FROM
                       (
                           select 
                            dire.emp_ideregistro idempresa,
                            emp.empresa_nom empresa,
                            rec.rec_fecpago::date  fecha,
                            SUM(coalesce(dire.dire_vlrrecaudo,0)) valor
                           from 
                                rec_recaudo rec inner join dire_disrecaudo dire on rec.rec_ideregistro=dire.rec_ideregistro
                                INNER JOIN doc_documento doc ON rec.uni_documento=doc.uni_documento
                                INNER JOIN empresas emp on dire.emp_ideregistro=emp.empresa_sevemp
                           where
                               rec.emp_ideregistro=:idempresa and rec.uni_medpago =:idmediopago and rec.uni_municipio=:idsucursal
                               AND rec.rec_estado in ('A','P','G')  AND doc.doc_consigna='S'
                               AND (rec.csg_ideregistro IS NULL OR rec.csg_ideregistro=:idconsignacion) AND rec.rec_idepadre is null
                            GROUP BY  dire.emp_ideregistro,emp.empresa_nom,rec.rec_fecpago 
                       )
                    as consolidadoempresa
                    where  fecha in ($fecha)
                    GROUP BY empresa,idempresa order by empresa";
        return $this->executeQuery($sql, $parametros);
    }

    public function getRecaudosConsignacionesDetalle($idEmpresa, $fecha, $idSucursal, $idMedioPago) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idsucursal'] = $idSucursal;
        $parametros['idmediopago'] = $idMedioPago;
        $sql = "SELECT DISTINCT
		  rec.rec_ideregistro idrecaudo, rec.uni_medpago idmediopago,
		  uni.uni_nombre1 mediopago, rec.rec_vlrreal valor, rec.rec_vlrcambio cambio,
                  rec.rec_fecpago fecha, rec.uni_municipio idsucursal , pro.proyecto_nom sucursal,
		  rec.cnre_ideregistr idconvenio,cnre.cnre_nombre convenio,
                  rec.rec_version as version
                FROM 
                  rec_recaudo rec inner join uni_unidad uni  on rec.uni_medpago=uni.uni_ideregistro
                  inner join proyectos pro on rec.uni_municipio=pro.proyecto_ideregistro
                  inner join cnre_cnvrecaudo cnre on rec.cnre_ideregistr=cnre.cnre_ideregistr
                  inner join dire_disrecaudo dire on rec.rec_ideregistro=dire.rec_ideregistro
                  INNER JOIN doc_documento doc ON rec.uni_documento=doc.uni_documento
                WHERE
                  rec.emp_ideregistro=:idempresa and rec.rec_fecpago::date in ($fecha) AND rec.rec_estado in ('A','P','G')
                  and rec.uni_municipio=:idsucursal and rec.uni_medpago=:idmediopago AND rec.csg_ideregistro is null
                  AND doc.doc_consigna='S' AND rec.rec_idepadre is null
                ORDER BY
		  rec.rec_fecpago ";
        return $this->executeQuery($sql, $parametros);
    }

    public function getRecaudosVinculadosConsignaciones($idConsignacion) {
        $parametros['idconsignacion'] = $idConsignacion;
        $sql = "SELECT 
		  rec.rec_ideregistro idrecaudo, rec.uni_medpago idmediopago,
		  uni.uni_nombre1 mediopago, rec.rec_vlrreal valor, rec.rec_vlrcambio cambio,
                  rec.rec_fecha fecha, rec.uni_municipio idsucursal , pro.proyecto_nom sucursal,
		  rec.cnre_ideregistr idconvenio,cnre.cnre_nombre convenio,
                  rec.rec_version as version
                FROM 
                  rec_recaudo rec inner join uni_unidad uni  on rec.uni_medpago=uni.uni_ideregistro
                  inner join proyectos pro on rec.uni_municipio=pro.proyecto_ideregistro
                  inner join cnre_cnvrecaudo cnre on rec.cnre_ideregistr=cnre.cnre_ideregistr
                  inner join dire_disrecaudo dire on rec.rec_ideregistro=dire.rec_ideregistro
                  INNER JOIN doc_documento doc ON rec.uni_documento=doc.uni_documento
                WHERE
                 rec.csg_ideregistro=:idconsignacion AND rec.rec_idepadre is null
                ORDER BY
		  rec.rec_fecha ";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * 
     * @param type $idEmpresa
     * @param type $fecha
     * @param type $idSucursal
     * @param type $idMedioPago
     * @return type
     */
    public function getChequesRecaudosSinConsignar($idEmpresa, $fecha, $idSucursal, $idMedioPago) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idsucursal'] = $idSucursal;
        $parametros['idmediopago'] = $idMedioPago;
        $sql = "SELECT 
                 rec.rec_ideregistro idrecaudo, fpre.fpre_ideregistr idformapagorecaudo
                FROM 
                 fpre_forpagreca fpre inner join  rec_recaudo rec on rec.rec_ideregistro = fpre.rec_ideregistro 
                 inner join uni_unidad uni on fpre.uni_forpago = uni.uni_ideregistro
                WHERE 
                 rec.rec_ideregistro in (
                                        SELECT 
                                            rec.rec_ideregistro
                                        FROM 
                                            rec_recaudo rec inner join uni_unidad uni  on rec.uni_medpago=uni.uni_ideregistro
                                            inner join proyectos pro on rec.uni_municipio=pro.proyecto_ideregistro
                                            INNER JOIN doc_documento doc ON rec.uni_documento=doc.uni_documento
                                        WHERE
                                            rec.emp_ideregistro=:idempresa and rec.rec_fecpago::date in ($fecha) AND rec.rec_estado in ('A','P','G')
                                            and rec.uni_municipio=:idsucursal and rec.uni_medpago=:idmediopago AND rec.csg_ideregistro is null
                                            AND doc.doc_consigna='S'
                                      ) ";
        return $this->executeQuery($sql, $parametros);
    }

    public function getDocumentosConsignaciones($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "select doc.uni_documento iddocumento,
                 doc.doc_nombre documento 
                from doc_documento doc inner join esem_estempresa esem on doc.est_documento=esem.est_ideregistro
                where doc.doc_tipo='CS' and esem.emp_ideregistro=:idempresa";
        return $this->executeQuery($sql, $parametros);
    }

    public function getBancosConsignaciones($idEmpresa, $idMedioPago, $idSucursal) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idmediopago'] = $idMedioPago;
        $parametros['idsucursal'] = $idSucursal;
        $sql = 'select distinct
                 bcu.ter_ideregistro idbanco,
                 ter.ter_nomcompleto banco
                from  bcu_bcocuenta bcu  inner join ter_tercero ter on bcu.ter_ideregistro=ter.ter_ideregistro
                 inner join mpbc_medpagcuebanco mpbc on bcu.bcu_ideregistro=mpbc.bcu_ideregistro
                where bcu.emp_ideregistro=:idempresa and mpbc.uni_medpago=:idmediopago and bcu.uni_municipio=:idsucursal';
        return $this->executeQuery($sql, $parametros);
    }

    public function getTipoCuentasConsignaciones($idEmpresa, $idMedioPago, $idSucursal, $idBanco) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idmediopago'] = $idMedioPago;
        $parametros['idsucursal'] = $idSucursal;
        $parametros['idbanco'] = $idBanco;
        $sql = 'select distinct bcu.bcu_tipcuenta tipocuenta
                from bcu_bcocuenta bcu     inner join mpbc_medpagcuebanco mpbc on bcu.bcu_ideregistro=mpbc.bcu_ideregistro
                where bcu.emp_ideregistro=:idempresa and mpbc.uni_medpago=:idmediopago 
                      and bcu.uni_municipio=:idsucursal and bcu.ter_ideregistro=:idbanco';
        return $this->executeQuery($sql, $parametros);
    }

    public function getCuentasConsignaciones($idEmpresa, $idMedioPago, $idSucursal, $idBanco, $tipoCuenta) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idmediopago'] = $idMedioPago;
        $parametros['idsucursal'] = $idSucursal;
        $parametros['idbanco'] = $idBanco;
        $parametros['tipocuenta'] = $tipoCuenta;
        $sql = 'select distinct bcu.bcu_ideregistro idbancocuenta,bcu.bcu_numcuenta numerocuenta
                from bcu_bcocuenta bcu inner join mpbc_medpagcuebanco mpbc on bcu.bcu_ideregistro=mpbc.bcu_ideregistro
                where bcu.emp_ideregistro=:idempresa and mpbc.uni_medpago=:idmediopago 
                      and bcu.uni_municipio=:idsucursal and bcu.ter_ideregistro=:idbanco and bcu.bcu_tipcuenta=:tipocuenta';
        return $this->executeQuery($sql, $parametros);
    }

    public function insertarConsignacion(array $consigancion) {
        $parametros = array();
        $this->setCampo($consigancion, $parametros, 'estado', 'csg_estado');
        $this->setCampo($consigancion, $parametros, 'fecha', 'csg_fecha');
        $this->setCampo($consigancion, $parametros, 'idsucursal', 'uni_municipio');
        $this->setCampo($consigancion, $parametros, 'idmediopago', 'uni_medpago');
        $this->setCampo($consigancion, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($consigancion, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($consigancion, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($consigancion, $parametros, 'valorfaltante', 'csg_vlrfaltante');
        $this->setCampo($consigancion, $parametros, 'valorsobrante', 'csg_vlrsobrante');
        $this->setCampo($consigancion, $parametros, 'valorgasto', 'csg_vlrgasto');
        $this->setCampo($consigancion, $parametros, 'valorcuentaporpagar', 'csg_vlrcuentaxpagar');
        $idConsignacion = $this->insertar($parametros, 'csg_consignacion', 'sq_csg_ideregistro');
        $consigancion['idconsignacion'] = $idConsignacion;
        return $consigancion;
    }

    public function actualizarConsignacion(array $consigancion) {
        $parametros = array();
        $this->setCampo($consigancion, $parametros, 'estado', 'csg_estado');
        $this->setCampo($consigancion, $parametros, 'fecha', 'csg_fecha');
        $this->setCampo($consigancion, $parametros, 'idsucursal', 'uni_municipio');
        $this->setCampo($consigancion, $parametros, 'idmediopago', 'uni_medpago');
        $this->setCampo($consigancion, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($consigancion, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($consigancion, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($consigancion, $parametros, 'valorfaltante', 'csg_vlrfaltante');
        $this->setCampo($consigancion, $parametros, 'valorsobrante', 'csg_vlrsobrante');
        $this->setCampo($consigancion, $parametros, 'valorgasto', 'csg_vlrgasto');
        $this->setCampo($consigancion, $parametros, 'valorcuentaporpagar', 'csg_vlrcuentaxpagar');
        $this->setCampo($consigancion, $parametros, 'descripcionseven', 'csg_sevdescripcion');
        $this->setCampo($consigancion, $parametros, 'idconsignacion', 'csg_ideregistro');
        $this->actualizar($parametros, 'csg_consignacion', 'csg_ideregistro=:csg_ideregistro');

        return $consigancion;
    }

    /**
     * Permite eliminar un detalle de consignación 
     */
    public function eliminarDetalleConsignacion($iddetalleconsignacion) {

        return $this->eliminar('dcsg_detconsigna', "dcsg_ideregistr=$iddetalleconsignacion");
    }

    /**
     * Se elimina la información adicional 
     * @param type $iddetalleconsignacion
     * @return type
     */
    public function eliminarInformacionAdicional($iddetalleconsignacion) {
        return $this->eliminar('indc_infdetconsigna', "dcsg_ideregistr=$iddetalleconsignacion");
    }

    /**
     * Inserta el detalle de consignación 
     * @param array $detalleConsignacion
     * @return type
     */
    public function insertarDetalleConsignacion(array $detalleConsignacion) {

        $parametros = array();
        $this->setCampo($detalleConsignacion, $parametros, 'idconsignacion', 'csg_ideregistro');
        $this->setCampo($detalleConsignacion, $parametros, 'valor', 'dcsg_vlrreal');
        $this->setCampo($detalleConsignacion, $parametros, 'idformapago', 'uni_forpago');
        $this->setCampo($detalleConsignacion, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($detalleConsignacion, $parametros, 'idbancocuenta', 'bcu_ideregistro');
        $this->setCampo($detalleConsignacion, $parametros, 'numerocuenta', 'bcu_numcuenta');
        $this->setCampo($detalleConsignacion, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($detalleConsignacion, $parametros, 'idsucursal', 'uni_municipio');
        $this->setCampo($detalleConsignacion, $parametros, 'idbanco', 'ter_ideregistro');
        $this->setCampo($detalleConsignacion, $parametros, 'idmediopago', 'uni_medpago');
        $this->setCampo($detalleConsignacion, $parametros, 'fecha', 'dcsg_fecha');
        $this->setCampo($detalleConsignacion, $parametros, 'idusuario', 'usu_ideregistro');
        $idDetalleConsignacion = $this->insertar($parametros, 'dcsg_detconsigna', 'sq_dcsg_ideregistr');
        $detalleConsignacion['iddetalleconsignacion'] = $idDetalleConsignacion;
        return $detalleConsignacion;
    }

    /**
     * Se inserta la información adicional de la consignación 
     * @param array $infoAdicional
     * @return type
     */
    public function insertarInformacionAdicionalConsignacion(array $infoAdicional) {
        $parametros = array();
        $this->setCampo($infoAdicional, $parametros, 'informacion', 'indc_informacio');
        $this->setCampo($infoAdicional, $parametros, 'estado', 'indc_estado');
        $this->setCampo($infoAdicional, $parametros, 'descripcion', 'indc_descripcio');
        $this->setCampo($infoAdicional, $parametros, 'archivo', 'indc_archivo');
        $this->setCampo($infoAdicional, $parametros, 'iddetalleconsignacion', 'dcsg_ideregistr');
        $this->setCampo($infoAdicional, $parametros, 'idformapago', 'uni_forpago');
        $this->setCampo($infoAdicional, $parametros, 'grupoinformacion', 'indc_grpinform');
        $this->setCampo($infoAdicional, $parametros, 'idtipificacion', 'tip_ideregistro');
        $this->setCampo($infoAdicional, $parametros, 'iddetalletipificacion', 'dtip_ideregistr');
        $this->setCampo($infoAdicional, $parametros, 'tipificacion', 'tip_nombre');
        $this->setCampo($infoAdicional, $parametros, 'idusuario', 'usu_ideregistro');
        $idInformacionAdicional = $this->insertar($parametros, 'indc_infdetconsigna', 'sq_indc_ideregistr');
        $infoAdicional['idinformacionadicional'] = $idInformacionAdicional;
        return $infoAdicional;
    }

    /**
     * Se registra los adjuntos de la consignación 
     * @param array $infoSoporte
     * @return type
     */
    public function insertarAdjuntoConsignacion($infoSoporte) {
        $parametros = array();
        $this->setCampo($infoSoporte, $parametros, 'tipoarchivo', 'adcs_tiparchivo');
        $this->setCampo($infoSoporte, $parametros, 'ruta', 'adcs_ruta');
        $this->setCampo($infoSoporte, $parametros, 'nombrearchivo', 'adcs_nomarchivo');
        $this->setCampo($infoSoporte, $parametros, 'idconsignacion', 'csg_ideregistro');
        $idAdjuntoConsignacion = $this->insertar($parametros, 'adcs_adjconsigna', 'sq_adcs_ideregistr');
        $infoSoporte['idarchivo'] = $idAdjuntoConsignacion;
        return $infoSoporte;
    }

    /**
     * Se actualiza los adjuntos de la consignación 
     * @param type $idArchivo
     * @param type $idConsignacion
     * @return type
     */
    public function actualizarAdjuntosConsignacion($idArchivo, $idConsignacion) {
        $parametros['csg_ideregistro'] = $idConsignacion;
        $parametros['adcs_ideregistr'] = $idArchivo;
        return $this->actualizar($parametros, 'adcs_adjconsigna', 'adcs_ideregistr=:adcs_ideregistr');
    }

    /**
     * Se elimina los adjuntos cuando el usuario decide cancelar 
     * el archivo desde la interfaz
     * @param type $idArchivo
     * @return type
     */
    public function eliminarAdjuntosConsignacion($idArchivo) {
        return $this->eliminar('adcs_adjconsigna', 'adcs_ideregistr=' . $idArchivo);
    }

    /**
     * Consulta los adjuntos de una consignación
     * @param type $idConsignacion
     * @return type
     */
    public function getAdjuntosConsignacion($idConsignacion) {
        $parametros['idconsignacion'] = $idConsignacion;
        $sql = 'select adcs.adcs_ideregistr idarchivo,adcs.adcs_nomarchivo nombrearchivo,
                       adcs.adcs_ruta rutaarchivo,adcs.csg_ideregistro idconsignacion 
                FROM adcs_adjconsigna adcs
                WHERE adcs.csg_ideregistro=:idconsignacion ';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta la información de un soporte en específico 
     * @param type $idArchivo
     * @return type
     * @throws MyException
     */
    public function getAdjunto($idArchivo) {
        $parametros['idarchivo'] = $idArchivo;
        $sql = 'select adcs.adcs_ideregistr idarchivo,adcs.adcs_nomarchivo nombrearchivo,
                       adcs.adcs_ruta rutaarchivo,adcs.csg_ideregistro idconsignacion 
                FROM adcs_adjconsigna adcs
                WHERE adcs.adcs_ideregistr=:idarchivo ';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('El archivo seleccionado no existe ', -1);
        }
        return $resultado[0];
    }

    /**
     * Se verifica si cambiaron los recaudos y se actualizan 
     * @param type $idConsignacion
     * @param type $idRecaudo
     * @param type $version
     */
    public function actualizarRecaudoConsignacion($idConsignacion, $idRecaudo, $version) {
        $data['csg_ideregistro'] = $idConsignacion;
        $data['rec_version'] = $version + 1;
        $data['rec_ideregistro'] = $idRecaudo;
        $this->actualizarSinUsuario($data, 'rec_recaudo', 'rec_ideregistro=:rec_ideregistro and rec_version=' . $version);
    }

    /**
     * Se inicializa la información de la consignación 
     * @param type $idConsignacion
     */
    public function reiniciarConsignacion($idConsignacion) {
        $parametros['idconsignacion'] = $idConsignacion;
        $sqlInformacionAdicional = 'delete from indc_infdetconsigna indc where dcsg_ideregistr in (select dcsg.dcsg_ideregistr from dcsg_detconsigna  dcsg where dcsg.csg_ideregistro=:idconsignacion )';
        $this->executeQuery($sqlInformacionAdicional, $parametros);
        $sqlDetalles = 'delete from dcsg_detconsigna where csg_ideregistro=:idconsignacion';
        $this->executeQuery($sqlDetalles, $parametros);
        $this->desvincularRecaudos($idConsignacion);
    }

    /**
     * Se desvinculan los recaudos de la consignación
     * @param type $idConsignacion
     */
    public function desvincularRecaudos($idConsignacion) {
        $parametros = array();
        $parametros['csg_ideregistro'] = null;
        $this->actualizarSinUsuario($parametros, 'rec_recaudo', 'csg_ideregistro=' . $idConsignacion);
    }

    /**
     * Se trae una consignación de acuerdo al filtro 
     * @param type $fechaInicio 
     * @param type $fechaFin
     * @param type $idConsignacion
     * @param type $idMedioPago
     * @param type $estado
     * @return type
     */
    public function getConsignacionFiltro($fechaInicio, $fechaFin, $idConsignacion, $idMedioPago, $estado, $idempresa) {
        $complemento = '';
        $parametros['estado'] = $estado;
        if (is_numeric($idConsignacion)) {
            $complemento .= 'and csg.csg_ideregistro=:idconsignacion ';
            $parametros['idconsignacion'] = $idConsignacion;
        }
        if (!empty($fechaInicio)) {
            $complemento .= 'and csg.csg_fecha::date BETWEEN :fechainicio::date and :fechafin::date ';
            $parametros['fechainicio'] = $fechaInicio;
            $parametros['fechafin'] = $fechaFin;
        }
        if (!empty($idMedioPago)) {
            $complemento .= ' and csg.uni_medpago=:idmediopago ';
            $parametros['idmediopago'] = $idMedioPago;
        }
        $parametros['idempresa'] = $idempresa;
        $sql = 'select  csg.csg_ideregistro idconsignacion, csg.csg_estado estado, 
                 csg.csg_fecha fecha, csg.uni_municipio idsucursal, pro.proyecto_nom sucursal,
                 csg.uni_medpago idmediopago,uni.uni_nombre1 mediopago,
                 csg.uni_documento iddocumento, doc.doc_nombre documento, csg.usu_ideregistro idusuario,
                 csg.csg_vlrfaltante valorfaltante, csg.csg_vlrsobrante valorsobrante, csg.csg_vlrgasto valorgasto,
                 (select  sum(rec.rec_vlrreal) from rec_recaudo rec where rec.csg_ideregistro=csg.csg_ideregistro) totalrecaudado,
                 (select  sum(dcsg.dcsg_vlrreal) from dcsg_detconsigna dcsg where dcsg.csg_ideregistro=csg.csg_ideregistro) totalconsignado,
                 csg.csg_vlrcuentaxpagar valorcuentaporpagar
                from csg_consignacion csg inner join proyectos pro on pro.proyecto_ideregistro=csg.uni_municipio
                 inner join uni_unidad uni on uni.uni_ideregistro=csg.uni_medpago
                 INNER JOIN esem_estempresa esem on esem.est_ideregistro = uni.est_ideregistro and esem.emp_ideregistro = :idempresa
                 inner join doc_documento doc on doc.uni_documento=csg.uni_documento
               where csg_estado=:estado and csg.emp_ideregistro = :idempresa ' . $complemento;
        return $this->executeQuery($sql, $parametros);
    }

    public function getConsignacion($idConsignacion) {
        $parametros['idconsignacion'] = $idConsignacion;
        $sql = 'select  csg.csg_ideregistro idconsignacion, csg.csg_estado estado, 
                 csg.csg_fecha fecha, csg.uni_municipio idsucursal, pro.proyecto_nom sucursal,
                 csg.uni_medpago idmediopago,uni.uni_nombre1 mediopago,
                 csg.uni_documento iddocumento, doc.doc_nombre documento, csg.usu_ideregistro idusuario,
                 csg.csg_vlrfaltante valorfaltante, csg.csg_vlrsobrante valorsobrante, csg.csg_vlrgasto valorgasto,
                 csg.csg_vlrcuentaxpagar valorcuentaporpagar
                from csg_consignacion csg inner join proyectos pro on pro.proyecto_ideregistro=csg.uni_municipio
                 inner join uni_unidad uni on uni.uni_ideregistro=csg.uni_medpago 
                 inner join doc_documento doc on doc.uni_documento=csg.uni_documento
               where csg.csg_ideregistro=:idconsignacion';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error, no se encontró la consignación ' . $idConsignacion, -1);
        }
        return $resultado[0];
    }

    public function getDetalleConsignacion($idConsignacion) {
        $parametros['idconsignacion'] = $idConsignacion;
        $sql = 'select dcsg.dcsg_ideregistr iddetalleconsignacion, dcsg.csg_ideregistro idconsignacion,
                 dcsg.dcsg_vlrreal valor, dcsg.uni_forpago idformapago, un.uni_nombre1 formapago,
                 dcsg.uni_documento iddocumento, dcsg.bcu_ideregistro idbancocuenta, dcsg.bcu_numcuenta numerocuenta, 
                 dcsg.emp_ideregistro idempresa,emp.empresa_nom empresa, dcsg.uni_municipio idmunicipio,
                 dcsg.ter_ideregistro idtercero, dcsg.uni_medpago idmediopago, uni.uni_nombre1 mediopago,
                 bcu.bcu_ideregistro idbanco, ter.ter_nomcompleto banco, bcu.bcu_tipcuenta tipocuenta, 
                 dcsg.dcsg_fecha::date fecha
                from dcsg_detconsigna dcsg inner join uni_unidad uni on dcsg.uni_medpago=uni.uni_ideregistro
                 inner join uni_unidad un on un.uni_ideregistro=dcsg.uni_forpago
                 inner join doc_documento doc on doc.uni_documento=dcsg.uni_documento
                 inner join empresas emp on emp.empresa_sevemp=dcsg.emp_ideregistro
                 inner join bcu_bcocuenta bcu on bcu.bcu_ideregistro=dcsg.bcu_ideregistro
                 inner join ter_tercero ter on  ter.ter_ideregistro=bcu.ter_ideregistro
                where dcsg.csg_ideregistro=:idconsignacion';
        return $this->executeQuery($sql, $parametros);
    }

    public function getGruposInformacionAdicional($iddetalle) {
        $parametros['iddetalleconsignacion'] = $iddetalle;
        $sql = "SELECT
                        indc.indc_grpinform idgrupoconsignacion
                FROM
                        indc_infdetconsigna indc
                WHERE
                        indc.dcsg_ideregistr =:iddetalleconsignacion
                GROUP BY
                        indc.indc_grpinform";
        return $this->executeQuery($sql, $parametros);
    }

    public function getInformacionAdicional($idDetalleConsignacion, $idGrupo) {
        $parametros['idgrupo'] = $idGrupo;
        $parametros['iddetalleconsignacion'] = $idDetalleConsignacion;
        $sql = 'SELECT
                        indc.tip_ideregistro idtipificacion,
                        indc.indc_informacio informacion,
                        indc.tip_nombre nombretipificacion
                FROM
                        indc_infdetconsigna indc
                WHERE
                        indc.dcsg_ideregistr =:iddetalleconsignacion
                AND indc.indc_grpinform =:idgrupo';
        return $this->executeQuery($sql, $parametros);
    }

    public function getArchivosConsginacion($idConsignacion) {
        $parametros['idconsignacion'] = $idConsignacion;
        $sql = 'select 
                 adcs.adcs_ideregistr idarchivo,adcs.adcs_tiparchivo tipoarchivo,
                 adcs.adcs_ruta ruta, adcs.adcs_nomarchivo nombrearchivo
               from adcs_adjconsigna adcs where adcs.csg_ideregistro=:idconsignacion';
        return $this->executeQuery($sql, $parametros);
    }

    public function getRecaudosFechasConsignacion($idConsignacion) {
        $parametros['idconsignacion'] = $idConsignacion;
        $sql = "select fecha, sum(valor) valor
                from(
                SELECT
                rec.rec_fecpago::DATE fecha, SUM(rec.rec_vlrreal) valor
                FROM
                rec_recaudo rec INNER JOIN doc_documento doc ON rec.uni_documento = doc.uni_documento
                WHERE
                rec.csg_ideregistro = :idconsignacion
                GROUP BY rec.rec_fecpago
                ) as consolidado GROUP BY fecha order by fecha ";
        return $this->executeQuery($sql, $parametros);
    }

    public function getRecaudosConsignacionesEmpresaVinculardos($idConsignacion) {
        $parametros['idconsignacion'] = $idConsignacion;
        $sql = "select idempresa, empresa, sum(valor) valor FROM
                (
                select
                dire.emp_ideregistro idempresa,
                 emp.empresa_nom empresa,
                 rec.rec_fecha::date fecha,
                 SUM(dire.dire_vlrrecaudo) valor
                from
                rec_recaudo rec inner join dire_disrecaudo dire on rec.rec_ideregistro = dire.rec_ideregistro
                INNER JOIN doc_documento doc ON rec.uni_documento = doc.uni_documento
                INNER JOIN empresas emp on dire.emp_ideregistro = emp.empresa_sevemp
                where
                rec.csg_ideregistro = :idconsignacion
                GROUP BY dire.emp_ideregistro, emp.empresa_nom, rec.rec_fecha
                )
                as consolidadoempresa
                where 1 = 1
                GROUP BY empresa, idempresa order by empresa";
        return $this->executeQuery($sql, $parametros);
    }

    public function getTipoDocumentoConsignacion($idConsignacion) {
        $parametros['idconsignacion'] = $idConsignacion;
        $sql = 'select * from (
                        select  drec.uni_tipdocument idtipodocumento, uni.uni_nombre1 tipodocumento, max(drec.drec_vlrreal) valor
                        from rec_recaudo rec inner join drec_detrecaudo drec on rec.rec_ideregistro=drec.rec_ideregistro
                        inner join uni_unidad uni on uni.uni_ideregistro=drec.uni_tipdocument
                        where rec.csg_ideregistro=:idconsignacion
                        group by drec.uni_tipdocument , uni.uni_nombre1 
                        union 
                        select  dire.uni_tipdocument idtipodocumento, uni.uni_nombre1 tipodocumento,max(dire.dire_vlrrecaudo) valor
                         from rec_recaudo rec  inner join dire_disrecaudo dire on rec.rec_ideregistro=dire.rec_ideregistro
                                    inner join uni_unidad uni on uni.uni_ideregistro=dire.uni_tipdocument
                        where rec.csg_ideregistro=:idconsignacion
                        group by dire.uni_tipdocument, uni.uni_nombre1  
                      ) as tipodocumento order by valor desc limit 1
                        ';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error, no se encontraron registros ', -1);
        }
        return $resultado[0];
    }

    public function insertarDiferenciaConsignacion($diferencia) {
        $parametros = array();
        $this->setCampo($diferencia, $parametros, 'iddiferenciaconsignacion', 'dics_ideregistr');
        $this->setCampo($diferencia, $parametros, 'tipo', 'codc_tipo');
        $this->setCampo($diferencia, $parametros, 'idmediopagotercero', 'mpte_ideregistr');
        $this->setCampo($diferencia, $parametros, 'idmediopagobanco', 'mpbc_ideregistr');
        $this->setCampo($diferencia, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($diferencia, $parametros, 'idmediopago', 'uni_medpago');
        $this->setCampo($diferencia, $parametros, 'idterceroresponsable', 'ter_ideregistro');
        $this->setCampo($diferencia, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($diferencia, $parametros, 'valortotal', 'dics_vlrtotal');
        $this->setCampo($diferencia, $parametros, 'valorreal', 'dics_vlrreal');
        $this->setCampo($diferencia, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($diferencia, $parametros, 'idconsignacion', 'csg_ideregistro');
        $this->setCampo($diferencia, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($diferencia, $parametros, 'iddetalleconsignacion', 'dcsg_ideregistr');
        return $this->insertar($parametros, 'dics_difconsigna', 'sq_dics_ideregistr');
    }

    public function getMedioPagoTercero($idMedioPago, $idTerceroResponsable) {
        $parametros['idterceroresponsable'] = $idTerceroResponsable;
        $parametros['idmediopago'] = $idMedioPago;
        $sql = 'select mpte.mpte_ideregistr idmediopagotercero 
                from mpte_medpagtercer mpte 
                where mpte.ter_ideregistro=:idterceroresponsable and mpte.uni_medpago=:idmediopago';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error, No existe el identificador de medio pago para el tercero ' . $idMedioPago . ' ' . $idTerceroResponsable, -1);
        }
        return $resultado[0]['idmediopagotercero'];
    }

    public function getConceptoConsignacion($tipoConcepto, $idMedioPago, $idEmpresa) {
        /* $parametros['idtipoconcepto'] = "'".$tipoConcepto."'";
          $parametros['idmediopago'] = $idMedioPago;
          $parametros['idempresa'] = $idEmpresa; */
        $sql = "SELECT DISTINCT
                        codc.uni_concepto idconcepto
                FROM
                        codc_condifconsigna codc
                WHERE
                        codc.uni_medpago =$idMedioPago
                AND codc.codc_tipo ='" . $tipoConcepto . "' 
                AND codc.emp_ideregistro =$idEmpresa";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('Error, no se encontró el concepto asociado al tipo de documento ', -1);
        }
        return $resultado[0];
    }

    public function getBancoCuentaMayorValor($idConsignacion) {
        $parametros['idconsignacion'] = $idConsignacion;
        $sql = 'SELECT 	dcsg.bcu_ideregistro idbancocuenta 
              FROM	dcsg_detconsigna dcsg
              WHERE dcsg.csg_ideregistro=:idconsignacion 
              GROUP BY dcsg.bcu_ideregistro
              ORDER BY MAX (dcsg.dcsg_vlrreal) desc 
              limit 1';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error, la consignación ' . $idConsignacion . ' no tiene detalles');
        }
        return $resultado[0]['idbancocuenta'];
    }

    public function getBancoCuenta($idMedioPago, $idBancoCuenta) {
        $parametros['idmediopago'] = $idMedioPago;
        $parametros['idbancocuenta'] = $idBancoCuenta;
        $sql = 'select mpbc_ideregistr idmediopagobancocuenta 
                from mpbc_medpagcuebanco mpbc 
                where mpbc.uni_medpago=:idmediopago and mpbc.bcu_ideregistro=:idbancocuenta';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error, no se encontró el medio de pago - cuenta ', -1);
        }
        return $resultado[0]['idmediopagobancocuenta'];
    }

    public function getTercerosResponsables($idMedioPago) {
        $parametros['idmediopago'] = $idMedioPago;
        $sql = 'select ter.ter_ideregistro idterceroresponsable,
                 ter.ter_documento cedula,
                 ter.ter_nomcompleto nombretercero
                from mpte_medpagtercer mpte inner join ter_tercero ter on mpte.ter_ideregistro=ter.ter_ideregistro
                where mpte.uni_medpago=:idmediopago';
        return $this->executeQuery($sql, $parametros);
    }

    public function resumenSinResultados($idEmpresa) {
        try {
            $sql = "SELECT
              tmp.mensaje,
              tmp.estado
            FROM
              temp_aplicar_recaudos_$idEmpresa tmp 
            WHERE tmp.estado = 'T'";
            $resultado = $this->executeQuery($sql);
            if (!empty($resultado)) {
                throw new MyException('No se encontraron anticipos y/o suscripciones para procesar', -2);
            }
        } catch (\Exception $e) {
            throw new MyException('No se encontró resumen de ejecución', 0);
        }
    }

    public function resumen($idEmpresa) {
        try {
            $sql = "SELECT
              pry.proyecto_nom municipio,
              tmp.mensaje,
              tmp.estado,
              count(*) numerosuscripciones
            FROM
              temp_aplicar_recaudos_$idEmpresa tmp INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = tmp.idsuscripcion
              INNER JOIN proyectos pry ON pry.proyecto_ideregistro=dsus.uni_municipio
            GROUP BY
              tmp.mensaje,
              tmp.estado,
              pry.proyecto_nom
            ORDER BY
              pry.proyecto_nom ";
            return $this->executeQuery($sql);
        } catch (\Exception $e) {
            throw new MyException('No se encontró resumen de ejecución', 0);
        }
    }

    public function getInformacionEmpresa($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = 'SELECT
                        emp.empresa_nom empresa, 
                        emp.empresa_sevemp idempresa
                FROM
                        empresas emp
                WHERE
                        emp.empresa_sevemp =:idempresa';
        return $this->executeQuery($sql, $parametros);
    }

    public function consultarCantidadRecaudosCerrar($idCiclo, $idEmpresa) {
        $parametros['idciclo'] = $idCiclo;
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT
                  COUNT(*) cantidad
                FROM
                  dire_disrecaudo dire INNER JOIN rec_recaudo rec ON dire.rec_ideregistro=rec.rec_ideregistro
                  INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr=dire.dsus_ideregistr
                  INNER JOIN doc_documento doc ON doc.uni_documento=rec.uni_documento
                WHERE
                  dire.dire_sdorecaudo > 0 AND dire.emp_ideregistro = :idempresa AND rec.rec_estado in ('A','G','P')
                  AND rec.rec_idepadre IS NULL AND dsus.cic_ideregistro=:idciclo";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['cantidad'];
    }

    public function consultarCantidadFacturasCruzarRecaudo($idCiclo, $idEmpresa) {
        $parametros['idciclo'] = $idCiclo;
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT
                  COUNT(*) cantidad
                FROM
                  fac_factura  fac 
                WHERE
                  fac_estado ='A'  and fac_sdoreal > 0 AND emp_ideregistro = :idempresa 
                  AND fac_idepadre IS NULL AND cic_ideregistro=:idciclo";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['cantidad'];
    }

    public function validarConsistenciaDatos($idConsignacion) {
        $parametros['idconsignacion'] = $idConsignacion;
        $sql = "SELECT csg.csg_ideregistro,csg.csg_vlrfaltante,csg.csg_vlrgasto,csg.csg_vlrcuentaxpagar,csg.csg_vlrsobrante,
                    sum(dcsg.dcsg_vlrreal) VlrConsignado,(select sum(rec.rec_vlrreal)from rec_recaudo rec where rec.csg_ideregistro=csg.csg_ideregistro) VlrRecaudado,
                    sum(dcsg.dcsg_vlrreal) + (csg.csg_vlrfaltante+csg.csg_vlrgasto-csg.csg_vlrcuentaxpagar-csg.csg_vlrsobrante)
                    validacion  
                from csg_consignacion csg
                        inner join dcsg_detconsigna dcsg on dcsg.csg_ideregistro=csg.csg_ideregistro
                where csg.csg_vlrfaltante>0 or csg.csg_vlrcuentaxpagar>0 or csg.csg_vlrgasto>0 or csg.csg_vlrsobrante>0 and csg.csg_ideregistro = :idconsignacion
                GROUP BY csg.csg_ideregistro";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró la información para poder realizar la validación', -1);
        }
        return $resultado[0];
    }
    
    public function consultarSucursalesPorMedioPagoModel($idMedioPago,$idEmpresa) {
        $parametros['idmediopago'] = $idMedioPago;
         $parametros['idEmpresa'] = $idEmpresa;       
        $sql = 'select proy.proyecto_ideregistro idsucursal, proy.proyecto_nom sucursal
                from 		mpbc_medpagcuebanco  mpbc 
                INNER JOIN	bcu_bcocuenta bcu ON 	bcu.bcu_ideregistro = mpbc.bcu_ideregistro	
                INNER JOIN	proyectos proy 		ON	proy.proyecto_ideregistro = bcu.uni_municipio
                where mpbc.uni_medpago = :idmediopago and bcu.emp_ideregistro = :idEmpresa
                GROUP BY	proy.proyecto_ideregistro , proy.proyecto_nom';
        return $this->executeQuery($sql, $parametros);
    }
    
        }
