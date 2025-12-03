<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * Consultas genericas del sistema.
 *
 * @author hrey
 */
class CargarRecaudosModel extends AuditoriaServices {

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var RecaudosModel 
     */
    private $recaudosModel;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     * @param \Doctrine\DBAL\Connection $sesion
     */
    public function __construct(&$conexion) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->recaudosModel = new RecaudosModel($this->conexion);
    }

    /**
     * Inserta la información de un recaudo en la base de datos
     * @param array $recaudo - Información obtenido adionada con el idrecaudo
     */
    public function insertarRecaudo(array &$recaudo) {
        $parametros = array();
        $this->setCampo($recaudo, $parametros, 'idrecaudo', 'rec_ideregistro');
        $this->setCampo($recaudo, $parametros, 'fecha', 'rec_fecha');
        $this->setCampo($recaudo, $parametros, 'estado', 'rec_estado');
        $this->setCampo($recaudo, $parametros, 'fechaaplicado', 'rec_fecaplicado');
        $this->setCampo($recaudo, $parametros, 'valorpagado', 'rec_vlrpagado');
        $this->setCampo($recaudo, $parametros, 'cambio', 'rec_vlrcambio');
        $this->setCampo($recaudo, $parametros, 'ajuste', 'rec_vlrajuste');
        $this->setCampo($recaudo, $parametros, 'valorreal', 'rec_vlrreal');
        $this->setCampo($recaudo, $parametros, 'idmediopago', 'uni_medpago');
        $this->setCampo($recaudo, $parametros, 'idconvenio', 'cnre_ideregistr');
        $this->setCampo($recaudo, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($recaudo, $parametros, 'idsuscriptor', 'sus_ideregistro');
        $this->setCampo($recaudo, $parametros, 'idtercero', 'ter_ideregistro');
        $this->setCampo($recaudo, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($recaudo, $parametros, 'idrecaudoorigen', 'rec_ideorigen');
        $this->setCampo($recaudo, $parametros, 'idrecaudopadre', 'rec_idepadre');
        $this->setCampo($recaudo, $parametros, 'fechapago', 'rec_fecpago');
        $this->setCampo($recaudo, $parametros, 'idsucursal', 'uni_municipio');
        $this->setCampo($recaudo, $parametros, 'idconsignacion', 'csg_ideregistro');
        $this->setCampo($recaudo, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($recaudo, $parametros, 'version', 'rec_version');
        $this->setCampo($recaudo, $parametros, 'idunificado', 'rec_ideunificad');
        $idRecaudo = $this->insertar($parametros, 'rec_recaudo', 'sq_rec_ideregistro');
        $recaudo['idrecaudo'] = $idRecaudo;
    }

    /**
     * Inserta la distribución de un recaudo en la base de datos y se obtiene su id
     * @param array $distribucion - Distribución del recaudo
     */
    public function insertarDistribucionRecaudo(array &$distribucion) {
        print_r("\n Inserta Distribucion 2 :");
        print_r($distribucion);
        $parametros = array();
        $this->setCampo($distribucion, $parametros, 'valorrecaudo', 'dire_vlrrecaudo');
        $this->setCampo($distribucion, $parametros, 'saldorecaudo', 'dire_sdorecaudo');
        $this->setCampo($distribucion, $parametros, 'idrecaudo', 'rec_ideregistro');
        $this->setCampo($distribucion, $parametros, 'iddistribucionconvenio', 'dicn_ideregistr');
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
        $idDistribucionRecaudo = $this->insertar($parametros, 'dire_disrecaudo', 'sq_dire_ideregistr');
        $distribucion['iddistribucionrecaudo'] = $idDistribucionRecaudo;
    }

    /**
     * Inserta los detalles del recaudo y retorna el respectivo id
     * @param array $detalleRecaudo - Información de los detalles de factura afectadas
     */
    public function insertarDetalleRecaudo(array &$detalleRecaudo) {
        $parametros = array();
        $this->setCampo($detalleRecaudo, $parametros, 'idrecaudo', 'rec_ideregistro');
        $this->setCampo($detalleRecaudo, $parametros, 'valortotal', 'drec_vlrtotal');
        $this->setCampo($detalleRecaudo, $parametros, 'valorreal', 'drec_vlrreal');
        $this->setCampo($detalleRecaudo, $parametros, 'fecha', 'drec_fecha');
        $this->setCampo($detalleRecaudo, $parametros, 'idrecaudoorigen', 'drec_ideorigen');
        $this->setCampo($detalleRecaudo, $parametros, 'idfactura', 'fac_ideregistro');
        $this->setCampo($detalleRecaudo, $parametros, 'idciclo', 'cic_ideregistro');
        $this->setCampo($detalleRecaudo, $parametros, 'idperiodo', 'per_ideregistro');
        $this->setCampo($detalleRecaudo, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($detalleRecaudo, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($detalleRecaudo, $parametros, 'iddetallefactura', 'dfac_ideregistr');
        $this->setCampo($detalleRecaudo, $parametros, 'iddistribucionrecaudo', 'dire_ideregistr');
        $this->setCampo($detalleRecaudo, $parametros, 'iddetallerecaudopadre', 'drec_idepadre');
        $this->setCampo($detalleRecaudo, $parametros, 'cicloanio', 'cic_ano');
        $this->setCampo($detalleRecaudo, $parametros, 'iddetalleconsignacion', 'dcsg_ideregistr');
        $this->setCampo($detalleRecaudo, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($detalleRecaudo, $parametros, 'version', 'drec_version');
        $idDetalleRecaudo = $this->insertar($parametros, 'drec_detrecaudo', 'sq_drec_ideregistr');
        $detalleRecaudo['iddetallerecaudo'] = $idDetalleRecaudo;
    }

    /**
     * Inserta las facturas que el recaudo afectó y devuelve el id generado
     * @param array $facturaRecaudo - Arreglo de facturas
     */
    public function insertarFacturaRecaudo(array &$facturaRecaudo) {
        $parametros = array();
        $this->setCampo($facturaRecaudo, $parametros, 'idfactura', 'fac_ideregistro');
        $this->setCampo($facturaRecaudo, $parametros, 'idsuscripcion', 'dsus_ideregistr');
        $this->setCampo($facturaRecaudo, $parametros, 'iddistribucionrecaudo', 'dire_ideregistr');
        $this->setCampo($facturaRecaudo, $parametros, 'idemprea', 'emp_ideregistro');
        $this->setCampo($facturaRecaudo, $parametros, 'idusuario', 'usu_ideregistro');
        $idFacturaRecaudo = $this->insertar($parametros, 'fare_facrecaudo', 'sq_fare_ideregistr');
        $facturaRecaudo['idfacturarecaudo'] = $idFacturaRecaudo;
    }

    /**
     * Inserta las formas de pago de un recaudo
     * @param array $formaPago -Arreglo de las formas de pago que tuvo un recaudo
     */
    public function insertarFormasPago(array &$formaPago) {
        $parametros = array();
        $this->setCampo($formaPago, $parametros, 'idrecaudo', 'rec_ideregistro');
        $this->setCampo($formaPago, $parametros, 'idformapago', 'uni_forpago');
        $this->setCampo($formaPago, $parametros, 'valorreal', 'fpre_vlrreal');
        $this->setCampo($formaPago, $parametros, 'idusuario', 'usu_ideregistro');
        $idFormaPagoRecaudo = $this->insertar($parametros, 'fpre_forpagreca', 'sq_fpre_ideregistr');
        $formaPago['idformapagorecaudo'] = $idFormaPagoRecaudo;
    }

    /**
     * Obtiene la prioridad de pago que tiene una suscripción respecto a las del mismo suscriptor
     * @param number $idEmpresa - Empresa actual
     * @param number $idSuscripcion -Suscripción de la que se valida las suscripciones hermanas
     * @return Arreglo ordenado según la prioridad de pago
     */
    public function getPrioridadPagoConvenios($idEmpresa, $idSuscripcion) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT DISTINCT
                        dsus.emp_ideregistro idempresa,
                        dicn.dicn_pagprioridad,
                        dsus.dsus_ideregistr idsuscripcion
                FROM
                        dicn_disconven dicn
                INNER JOIN sus_suscripcion sus ON dicn.cnre_ideregistr = sus.cnre_ideregistr
                INNER JOIN dsus_detsuscrip dsus ON dsus.sus_ideregistro = sus.sus_ideregistro
                WHERE
                        dsus.sus_ideregistro = (SELECT sus_ideregistro FROM dsus_detsuscrip WHERE dsus_ideregistr= :idsuscripcion)
                AND ( dicn.dicn_pagprioridad IS NOT NULL OR dicn.emp_ideregistro =:idempresa)
                AND dsus.emp_ideregistro = dicn.emp_ideregistro and dsus.emp_ideregistro not in(299)
                ORDER BY dicn.dicn_pagprioridad;";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta la información detallada de las facturas de una suscripción
     * @param number $idSuscripcion - Suscripción de la que se consultará las facturas
     * @param number $idEmpresa - Empresa actual
     * @return Array- Arreglo de facturas con saldo de una suscripción
     */
    public function getFacturasSuscripcion($idSuscripcion, $idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $complemento = " WHERE fac.dsus_ideregistr=:idsuscripcion
                               AND fac.fac_sdoreal>0 and fac.fac_estado='A'
                               AND fac.emp_ideregistro =:idempresa 
                               AND fac.fac_idepadre is null
                               ORDER BY fac.per_ideregistro, fac.fac_fecha, prioridadpagodoc, fac.fac_ideregistro";
        /* ORDER BY prioridadpagodoc,fac.fac_fecha "; */
        return $this->genericoModel->getFacturasInformacion($complemento, $parametros);
    }

    /**
     * Consulta la información detallada de las facturas de una suscripción
     * @param number $idSuscripcion - Suscripción de la que se consultará las facturas
     * @param number $idEmpresa - Empresa actual
     * @return Array- Arreglo de facturas con saldo de una suscripción
     */
    public function getFacturaSuscripcion($idSuscripcion, $idEmpresa, $idFinanciacion, $idFactura) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $complemento = " WHERE fac.dsus_ideregistr=:idsuscripcion
                               AND fac.fac_sdoreal>0 and fac.fac_estado='A'
                               AND fac.emp_ideregistro =:idempresa 
                               AND fac.fac_idepadre is null ";
        if ($idFinanciacion != 0) {
            $parametros['idfinanciacion'] = $idFinanciacion;
            $complemento = $complemento . "  AND fac.fin_ideregistro =:idfinanciacion  ";
        }
        if ($idFactura != 0) {
            $parametros['idfactura'] = $idFactura;
            $complemento = $complemento . "  AND fac.fac_ideregistro =:idfactura  ";
        }

        $complemento = $complemento . " ORDER BY fac.per_ideregistro, fac.fac_fecha, prioridadpagodoc, fac.fac_ideregistro ";

        return $this->genericoModel->getFacturasInformacion($complemento, $parametros);
    }

    /**
     * Valida los posibles inconvenientes que tiene la información subida en el archivo
     * @param number $idEmpresa - Empresa actual 
     * @param number $cantDias - Cantidad de días permitidos de diferencia entre la fecha actual y la fecha recaudada
     * @param number $maximoPago - Valor máximo permitido del recaudo
     * @param number $idmediopago - Medio de pago por el que se hizo el recaudo
     * @return type
     */
    public function validarInformacionTemporal($idEmpresa, $cantDias, $maximoPago, $idmediopago) {

        $sql = "SELECT
                        CASE WHEN dsus.dsus_ideregistr IS NULL THEN
                        ' Hay suscripciones que no están registradas en la empresa, intente nuevamente  '|| idsuscripcion
                        WHEN (now() :: DATE - tbl.fechapago :: DATE) >$cantDias  THEN
                        ' Hay pagos realizados hace más de cinco(5) días, intente nuevamente '
                        WHEN tbl.valor > $maximoPago THEN
                        ' Hay pagos que exceden el valor permitido para pagos, intente nuevamente '
                        END AS mensaje,
                        tbl.idsuscripcion idsuscripcion
                FROM
                        temp_recaudos_masivo tbl
                LEFT JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = tbl.idsuscripcion
                AND dsus.emp_ideregistro =$idEmpresa
                AND dsus.dsus_estado <> 'E'
                AND idempresa =$idEmpresa
                WHERE
                        (dsus.dsus_ideregistr IS NULL
                OR (now() :: DATE - tbl.fechapago :: DATE) > $cantDias 
                OR tbl.valor > $maximoPago) AND idmediopago = $idmediopago AND tbl.estado = 'P' LIMIT 1; ";
        return $this->executeQuery($sql);
    }

    /**
     * Se consulta el saldo total de una suscripción
     * @param number $idSuscripcion - Suscripción de la que se valida el saldo
     * @return number - Saldo de una suscripción
     */
    public function getSaldoSuscripcion($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT COALESCE (SUM(fac.fac_sdoreal), 0) saldo 
                FROM fac_factura fac 
                WHERE fac.fac_sdoreal > 0 AND fac.dsus_ideregistr = :idsuscripcion AND fac.fac_estado = 'A'  
                    AND fac_idepadre IS NULL ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['saldo'];
    }

    /**
     * Se consulta el saldo total de una suscripción
     * @param number $idSuscripcion - Suscripción de la que se valida el saldo
     * @return number - Saldo de una suscripción
     */
    public function getSaldoFacturasSuscripcion($idSuscripcion, $idFinanciacion, $idFactura) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT COALESCE (SUM(fac.fac_sdoreal), 0) saldo 
                FROM fac_factura fac 
                WHERE fac.fac_sdoreal > 0 AND fac.dsus_ideregistr = :idsuscripcion AND fac.fac_estado = 'A'  
                    AND fac_idepadre IS NULL ";
        if ($idFinanciacion != 0) {
            $parametros['idfinanciacion'] = $idFinanciacion;
            $sql = $sql . "  AND fac.fin_ideregistro =:idfinanciacion  ";
        }
        if ($idFactura != 0) {
            $parametros['idfactura'] = $idFactura;
            $sql = $sql . "  AND fac.fac_ideregistro =:idfactura  ";
        }
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['saldo'];
    }

    /**
     * Consulta la información detallada de los conceptos que suman de una factura
     * @param number $idFactura - Id de la factura de la que se consultan sus conceptos
     * @return Array- arreglo con conceptos de una factura
     */
    public function getConceptosFactura($idFactura) {
        $parametros['idfactura'] = $idFactura;
        $complemento = " WHERE fac.fac_ideregistro=:idfactura AND dfac.dfac_sdoreal>0
                               AND con.con_operacion ='S' 
                         ORDER BY con.con_pagpriori ";
        return $this->genericoModel->getConceptosInformacion($complemento, $parametros);
    }

    /**
     * Consulta documento y tipo de documento que tiene asignado una liquidación
     * @param number $idLiquidacion - Id de la liquidación consultada
     * @return Object - (idtipodocumento, iddocumento)
     * @throws MyException
     */
    public function getDocumentoyTipoDocumento($idLiquidacion) {
        $parametros['idliquidacion'] = $idLiquidacion;
        $sql = 'select 
                  liq.uni_tipdocument idtipodocumento, liq.uni_documento iddocumento
                from liq_liquidacion liq where liq.uni_liquidacion=:idliquidacion';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró la liquidación con número: ' . $idLiquidacion, -1);
        }
        return $resultado[0];
    }

    /**
     * Consulta los documentos que cumpla con los parámetros de búsqueda
     * @param number $idTipoDocumento - Id del tipo de documento
     * @param number $idDocumento - Id del documento
     * @param char $tipo - Tipo de documento buscado
     * @return Object (iddocumento, idestructuradocumento) 
     */
    public function getDocumento($idTipoDocumento, $idDocumento, $tipo) {
        return $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($idDocumento, $idTipoDocumento, $tipo);
    }

    /**
     * Obtiene id del documento que representa a un tipo de recaudo
     * @param string $tipo - Tipo de recaudo del que se consulta el documento
     * @return int Id del  documento para generar el recaudo
     * @throws MyException
     */
    public function getDocumentoRecaudo($tipo) {
        $parametros['tipo'] = $tipo;
        $sql = 'select uni_documento iddocumento from doc_documento doc where doc.doc_tipo=:tipo';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró el documento', -1);
        }
        return $resultado[0]['iddocumento'];
    }

    /**
     * Valida si ya existe un registro de recaudo con los parámetros envíados
     * @param Array $parametros - Información del recaudo validando
     * @return type
     */
    public function validarRecaudo($parametros) {
        $sql = "SELECT SUM (rec.rec_vlrreal) + COALESCE(SUM(recant.rec_vlrreal), 0) valorrecaudo 
                FROM rec_recaudo rec
                INNER JOIN dire_disrecaudo dire ON dire.rec_ideregistro = rec.rec_ideregistro
                LEFT JOIN rec_recaudo recant ON rec.rec_ideregistro = recant.rec_ideorigen
                WHERE rec.rec_fecpago=:fechapago AND rec.rec_estado in ('A','G')
                 AND rec.uni_medpago=:idmediopago AND dire.dsus_ideregistr=:idsuscripcion ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return -1;
        }
        return $resultado[0]['valorrecaudo'];
    }

    /**
     * Obtiene los medios de pago de la empresa, usuario y programa
     * @param int $idPrograma - Id del programa de cargar recaudos (75)
     * @param int $idUsuario -  Id del usuario que ejecuta el proceso
     * @param int $idEmpresa - Id de la empresa ala que se le genera el recaudo
     * @return array (Listado de las formas de pago )
     */
    public function getMediosPago($idPrograma, $idUsuario, $idEmpresa) {
        $parametros['idprograma'] = $idPrograma;
        $parametros['idusuario'] = $idUsuario;
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT
                  mpa.uni_medpago id,
                  mpa.mpa_nombre nombre
                FROM
                  mpa_medpago mpa INNER JOIN prun_prgunidad prun ON mpa.uni_medpago=prun.uni_ideregistro
                  INNER JOIN uspu_usuprgunid uspu ON prun.prun_ideregistr=uspu.prun_ideregistr
                  INNER JOIN  uni_unidad uni ON  uni.uni_ideregistro=mpa.uni_medpago
                  INNER JOIN esem_estempresa esem ON esem.est_ideregistro=uni.est_ideregistro
                WHERE
                  mpa.mpa_tipo = 'E' AND prun.prg_ideregistro=:idprograma AND uspu.usu_ideregistro=:idusuario
                  AND esem.emp_ideregistro=:idempresa
                ORDER BY mpa.mpa_nombre";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Verifica que la tabla temporal para cargar los recaudos exista
     * @return type
     */
    public function validarExisteTabla() {
        $sql = "SELECT count(*) cantidadtablas
                FROM  information_schema.TABLES
                WHERE TABLE_NAME = 'temp_recaudos_masivo';";
        $resultado = $this->executeQuery($sql);
        return $resultado[0]['cantidadtablas'];
    }

    /**
     * Actualiza los  registros de  BD a estado 'C'
     * @param void
     */
    public function vaciarTablaMasiva($idEmpresa) {
        $sql = "UPDATE temp_recaudos_masivo SET estado='C' WHERE idempresa = $idEmpresa  and estado <> 'C'";
        $this->executeQuery($sql);
    }

    /**
     * Crea la secuencia para unificar los recaudos 
     */
    private function crearSecuencia() {
        try {
            $this->conexion->beginTransaction();
            $sql = "CREATE SEQUENCE sq_rec_ideunificad";
            $this->executeQuery($sql);
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $ex->getMessage();
            $this->conexion->rollBack();
        }
    }

    /**
     * Crea la tabla temporal para guardar las líneas del archivo que se está procesando
     * @return int
     */
    public function crearTablaMasiva() {
        $this->crearSecuencia();
        $sql = "CREATE TABLE IF NOT EXISTS temp_recaudos_masivo
                (
                  idregistro bigint NOT NULL DEFAULT nextval('sq_rec_ideunificad'),
                  idsuscripcion bigint,
                  valor numeric,
                  fechapago timestamp without time zone,
                  idmediopago integer,
                  idformapago integer,
                  idproceso integer,
                  estado character(1),
                  idsucursal integer,
                  idempresa integer,
                  mensaje text,
                  fecha timestamp DEFAULT now(),
                  idsuscriptor bigint,
                  idfinanciacion bigint,
                  idfactura bigint,
                  CONSTRAINT temp_recaudos_masivo_pkey PRIMARY KEY (idregistro),
                  CONSTRAINT ui_temp_pago UNIQUE (idempresa, fechapago, idsuscripcion, valor, idmediopago, idformapago)
                );";
        $resultado = $this->executeQuery($sql);
        $sqlIndx = "CREATE INDEX temp_recaudos_masivo_idsuscriptor_index ON public.temp_recaudos_masivo (idsuscriptor)";
        $this->executeQuery($sqlIndx);
        $sqlIndxSuscripcion = "CREATE INDEX temp_recaudos_masivo_idsuscripcion_index ON public.temp_recaudos_masivo (idsuscripcion)";
        $this->executeQuery($sqlIndxSuscripcion);
        $this->executeQuery($sqlIndx);
        $sqlIndxEstado = "CREATE INDEX ix_temp_recaudos_estado  ON temp_recaudos_masivo  USING btree  (estado COLLATE pg_catalog.'default')";
        $this->executeQuery($sqlIndxEstado);
        $sqlIndxEmpresa = "CREATE INDEX ix_temp_recaudos_idempresa  ON temp_recaudos_masivo  USING btree  (idempresa))";
        $this->executeQuery($sqlIndxEmpresa);
        $sqlIndxIdMedioPago = "CREATE INDEX ix_temp_recaudos_idmediopago  ON temp_recaudos_masivo  USING btree  (idmediopago)";
        $this->executeQuery($sqlIndxIdMedioPago);
        $sqlIndxIdProceso = "CREATE INDEX ix_temp_recaudos_proceso  ON temp_recaudos_masivo  USING btree  (idproceso)";
        $this->executeQuery($sqlIndxIdProceso);
        return $resultado;
    }

    /**
     * Inserta los recaudos de  forma masiva en la base de datos
     * @param string $complemento - Información de las líneas de recaudo que se guardarán separada por coma
     */
    public function insertarMasiva($complemento) {
        $sql = "INSERT INTO temp_recaudos_masivo ( idsuscripcion,valor,fechapago,idmediopago,idformapago,idproceso,estado, idsucursal, idempresa, idfinanciacion, idfactura ) values $complemento";
        $this->executeQuery($sql);
    }

    public function eliminarPagoMal($datos) {
        $sql = "DELETE
            FROM
                    temp_recaudos_masivo
            WHERE
                    idempresa =:idempresa
            AND fechapago =:fechapago
            AND idmediopago =:idmediopago
            AND idsuscripcion =:idsuscripcion;";
        $this->executeQuery($sql, $datos);
    }

    /**
     * Cambia el estado de los recaudos para simular la eliminación
     * @param type $idEmpresa
     */
    public function eliminarPagos($idEmpresa) {
        $sql = "update  temp_recaudos_masivo set estado='C' where idempresa=$idEmpresa";
        $this->executeQuery($sql);
    }

    /**
     * Elimina los recaudos que tienen determinado estado
     * @param int $idEmpresa- Id de la empresa actual
     * @param char $estado - Estado del recaudo que se quiere eliminar
     */
    public function eliminarPagosTotales($idEmpresa, $estado) {
        $sql = "delete from   temp_recaudos_masivo where estado='$estado' AND idempresa=$idEmpresa";
        $this->executeQuery($sql);
    }

    /**
     * Obtiene los recaudos que se procesarán según el hilo y estado
     * @param int $idEmpresa - Empresa actual
     * @param int $idHilo - Id del hilo del que se consulta
     * @param int $inicio - Numero de registro desde el que se incia (ahora se valida es por el estado y se toman los 1000 primeros)
     * @return Array - Listado de los recaudos 
     */
    public function getRecaudosPorProceso($idEmpresa, $idHilo, $inicio) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idhilo'] = $idHilo;
        $parametros['inicio'] = $inicio;
        $sql = "SELECT
                    dsus.dsus_ideregistr idsuscripcion,
                    dsus.sus_ideregistro idsuscriptor,
                    dsus.ter_ideregistro idtercero,
                    dsus.emp_ideregistro idempresa,
                    liq.uni_liquidacion idliquidacion,
                    liq.uni_tipdocument idtipdocumento,
                    liq.uni_documento iddocumento,
                    cic.cic_ideregistro idciclo,
                    cic.cic_anoactual cicloanio,
                    per.per_ideregistro idperiodo,
                    tbl.fechapago fechapago,
                    tbl.valor valorpago,
                    tbl.valor saldo,
                    tbl.idmediopago idmediopago,
                    tbl.idformapago idformapago,
                    tbl.idsucursal idsucursal,
                    tbl.idproceso idproceso,
                    tbl.idregistro idregistro,
                    tbl.idfinanciacion idfinanciacion,
                    tbl.idfactura idfactura                   

            FROM
                    temp_recaudos_masivo tbl
            INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = tbl.idsuscripcion
            INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion = dsus.uni_liquidacion
            INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = dsus.cic_ideregistro
            INNER JOIN per_periodo per ON cic.cic_ideregistro = per.cic_ideregistro
            AND per.per_estado = 'A'
            WHERE
            idempresa = :idempresa
            AND idproceso = :idhilo
            AND dsus.emp_ideregistro =:idempresa
            AND dsus.dsus_estado <> 'E' 
            AND estado = 'P'
            LIMIT 1000";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Actualiza la información del recaudo en la tabla temporal
     * @param int $idRegistro - Id del registro que se actualiza
     * @param date $fechaPago - Fecha de pago del recaudo registrado
     * @param char $estado - Estado al que se actualiza el recaudo
     * @param string $mensaje - Mensaje resultante al procesar el recaudo
     * @return int
     */
    public function actualizarTemporalResumen($idRegistro, $fechaPago, $estado, $mensaje) {
        $parametros['estado'] = $estado;
        $parametros['idregistro'] = $idRegistro;
        $parametros['fechapago'] = $fechaPago;
        $parametros['mensaje'] = $mensaje;
        $sql = "UPDATE temp_recaudos_masivo SET 
            estado = :estado,
            mensaje =:mensaje
            WHERE idregistro=:idregistro ;";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Cosulta el resultado del proceso agrupado por el municipio
     * @param int $idEmpresa - Id de la empresa actual
     * @param char $estado - Estado del que se quiere consultar (Correctos A, Con inconveniente F)
     * @return array - Listado de municipios con cantidad de registros afectados
     */
    public function consultarResumen($idEmpresa, $estado) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT 
                    mpa_nombre nombrerecaudador , 
                    pry.proyecto_nom municipio ,
                    fechapago::DATE fechapago ,
                    SUM (valor) valorregistrosprocesados,
                    COUNT (dsus.dsus_ideregistr) cantidadregistrosprocesados
                FROM temp_recaudos_masivo tmp
                    INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = tmp.idsuscripcion
                    INNER JOIN proyectos pry ON pry.proyecto_ideregistro = dsus.uni_municipio
                    INNER JOIN mpa_medpago mpg on mpg.uni_medpago = idmediopago
                WHERE tmp.estado ='$estado' AND tmp.idempresa=:idempresa
                GROUP BY mpa_nombre , proyecto_nom, fechapago::DATE";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta los errores del proceso
     * @deprecated since version 
     * @param int $idEmpresa - Id de la empresa actual
     * @return array
     */
    public function consultarResumenErrores($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT idsuscripcion, mensaje, valor 
                FROM temp_recaudos_masivo tmp
                WHERE tmp.estado ='F' AND tmp.idempresa=:idempresa ";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Valida si hay recaudos de un mismo suscriptor se dejan en el mismo proceso
     */
    public function modificarProcesoRecaudosRepetidos() {
        $sqlSuscriptor = "  UPDATE temp_recaudos_masivo temp
                            SET idsuscriptor = info.sus_ideregistro
                            FROM (
                                   SELECT
                                     dsus.sus_ideregistro,
                                     dsus.dsus_ideregistr
                                   FROM temp_recaudos_masivo tmp
                                     INNER JOIN dsus_detsuscrip dsus ON tmp.idsuscripcion = dsus.dsus_ideregistr
                                   WHERE tmp.idsuscriptor IS NULL
                                 ) AS info
                            WHERE temp.idsuscripcion = info.dsus_ideregistr AND temp.idsuscriptor IS NULL and temp.estado='P' ";
        $this->executeQuery($sqlSuscriptor);

        $sql = "UPDATE temp_recaudos_masivo temp
                SET idproceso = 0
                FROM (
                        SELECT
                        idsuscriptor,
                        count(*)
                        FROM temp_recaudos_masivo
                        WHERE estado = 'P'
                        GROUP BY idsuscriptor
                        HAVING count(*) > 1
                     ) as info
                WHERE temp.estado = 'P' AND temp.idsuscriptor = info.idsuscriptor";
        $this->executeQuery($sql);
    }

    /**
     * Valida  que la información tenga los valores consistentes según la sumatoria de sus detalles
     * @param Object $parametros (idsuscripcion, idempresa)
     * @throws MyException
     */
    public function validarConsistenciaFacturas($parametros) {
        $sql = " SELECT detalle.idfactura, fac.fac_vlrreal,detalle.vlrreal,uni.uni_nombre1 tiposus,emp.empresa_nom empresa  
                 FROM 
                 fac_factura fac
                 inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr = fac.dsus_ideregistr 
                 inner join empresas emp on empresa_sevemp = dsus.emp_ideregistro
                 inner join uni_unidad uni on uni.uni_ideregistro = dsus.uni_tipsuscripc
                 inner join (select dfac.fac_ideregistro idfactura, sum(dfac_vlrreal) vlrreal
                             from dsus_detsuscrip dsus
                                   inner join fac_factura fac1 on dsus.dsus_ideregistr = fac1.dsus_ideregistr
                                   inner join dfac_detfactura dfac on fac1.fac_ideregistro = dfac.fac_ideregistro
                                   inner join con_concepto con on con.uni_concepto = dfac.uni_concepto
                             where fac1.emp_ideregistro =:idempresa
                                   AND con.con_operacion ='S'
                                   AND fac1.dsus_ideregistr=:idsuscripcion
                                   AND fac1.fac_sdoreal>0 and fac1.fac_estado='A'
                                   AND fac1.emp_ideregistro =:idempresa
                                   AND fac1.fac_idepadre is null
                             group by dfac.fac_ideregistro
                  ) as detalle on detalle.idfactura= fac.fac_ideregistro and
                  fac.fac_vlrreal != detalle.vlrreal  ";

        $resultado = $this->executeQuery($sql, $parametros);
        if (!empty($resultado)) {
            foreach ($resultado as $error) {
                $mensaje .= "\n Empresa " . $error['empresa'] . ",Tipo Suscripcion " . $error['tiposus'] . " La factura:" . $error['idfactura'] . " esta inconsistente , Valor real encabezado :" . $error['fac_vlrreal'] . " VlrDetalle:" . $error['vlrreal'];
            }
            throw new MyException("Error: " . $mensaje, -1);
        }
        $this->validarFacturasDetalleNegativo($parametros);
    }

    /**
     * Valida que una suscripción no tenga facturas con saldo negativo
     * @param array $parametros * (idempresa, idsuscripcion)
     * @throws MyException
     */
    public function validarFacturasDetalleNegativo($parametros) {
        /*
         * Valida Facturas con detalles Negativos 
         */
        $sql = " SELECT fac.fac_ideregistro idfactura,
                uni.uni_nombre1 tiposus,emp.empresa_nom empresa , con.con_nombre concepto, dfac.dfac_sdoreal saldoconcepto ,dfac.dfac_vlrreal valorreal
                 FROM
                 fac_factura fac
                 inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr = fac.dsus_ideregistr
                 inner join empresas emp on empresa_sevemp = dsus.emp_ideregistro
                 inner join uni_unidad uni on uni.uni_ideregistro = dsus.uni_tipsuscripc
                 inner join dfac_detfactura dfac on dfac.fac_ideregistro = fac.fac_ideregistro
                 inner join con_concepto con on con.uni_concepto = dfac.uni_concepto
                 where dfac.dfac_sdoreal <0
		  AND con.con_operacion ='S'
		  and dsus.dsus_ideregistr = :idsuscripcion
		  AND fac.emp_ideregistro = :idempresa
                        AND	fac.fac_sdoreal>0 and fac.fac_estado='A'
                        AND fac.fac_idepadre is null";
        $resultado = $this->executeQuery($sql, $parametros);
        if (!empty($resultado)) {
            foreach ($resultado as $error) {
                $mensaje .= "\n Empresa " . $error['empresa'] . ",Tipo Suscripcion " . $error['tiposus'] .
                        " La factura:" . $error['idfactura'] . " esta inconsistente(Conceptos que Suman no pueden ser Negativos) :"
                        . " Concepto " . $error['concepto'] . " Saldo Concepto: " . $error['saldoconcepto'] . " , Valor Real; " . $error['valorreal'];
            }
            throw new MyException("Error: " . $mensaje, -1);
        }
    }

    /**
     * Valida la diferencia en minutos entre la fecha actual y la enviada
     * @param date $fecha - Fecha de pago 
     * @return int - Diferencia en minutos
     */
    public function validarFechaPago($fecha) {
        $sql = "select to_char(now(),'YYYY-MM-DD HH24:MI:SS') fechaactual, '$fecha' fechapago , extract(MINUTES FROM age(now(),'$fecha'::TIMESTAMP)) diferenciaminutos ";
        $resultado = $this->executeQuery($sql);
        return $resultado[0];
    }

    /**
     * Consulta las parametors para el proceso de Were
     * @param $nit_recaudador, $idEmpresa, $oficina
     * @return array - Parametros
     */
    public function consultar_Parametros($nit_recaudador, $idEmpresa, $oficina) {

        $parametros['nit_recaudador'] = strval($nit_recaudador);
        $parametros['idEmpresa'] = $idEmpresa;
        $parametros['oficina'] = strval($oficina);  
        $sql = "SELECT json_extract_path_text(jsonfinal.datos,'nit')::varchar nit ,
                json_extract_path_text(jsonfinal.datos,'recibe_vencido')::varchar recibe_vencido ,
                 COALESCE ((json_extract_path_text(jsonfinal.datos,:oficina)::varchar),
                (json_extract_path_text(jsonfinal.datos, 'mediopago' )::varchar)) medio_pago ,
                json_extract_path_text(jsonfinal.datos,'ticketOfficeId')::INTEGER ticketOfficeId,
                json_extract_path_text(jsonfinal.datos,'servicecode')::varchar servicecode,
                json_extract_path_text(jsonfinal.datos,'password')::varchar psw
                FROM ( 
                SELECT json_array_elements(parametrosmodelo.parametro) as datos
                FROM( 
                SELECT json_extract_path_text(datos.par_parametro,'RECAUDADORES')::json parametro
                FROM par_parametro as datos WHERE emp_ideregistro = :idEmpresa
                ) as parametrosmodelo
                ) as jsonfinal
                WHERE  json_extract_path_text(jsonfinal.datos,'nit')::varchar = :nit_recaudador";

        $resultado = $this->executeQuery($sql, $parametros);

        return $resultado;
    }

    /**
     * Valida la transaccion para el proceso de Were
     * @param $id_transaccion, $nit_recaudador
     * @return int - Cantidad
     */
    public function ValidarTransaccion($id_transaccion, $nit_recaudador) {


        $parametros['id_transaccion'] = strval($id_transaccion);
        $parametros['nit_recaudador'] = $nit_recaudador;


        $sql = "SELECT count(*) as cantidad  
                FROM dwre_detwebrec dwrc
                INNER JOIN wrec_webrec wrcc ON wrcc.wrec_ideregistro = dwrc.wrec_ideregistro
                AND wrec_tercentidad = :nit_recaudador
                WHERE dwrc.dwre_paymentid = :id_transaccion";

        $resultado = $this->executeQuery($sql, $parametros);


        $cantidad = 0;
        foreach ($resultado as $rst) {
            $cantidad = $rst['cantidad'];
        }

        return $cantidad;
    }

    /**
     * Obtiene los datos de la factura para el proceso de were
     * @param $id_transaccion, $nit_recaudador
     * @return array - Datos de la factura
     */
    public function getDatosFactura($num_referencia, $idEmpresa, $Recibe_venc) {

        $parametros['num_referencia'] = strval($num_referencia);
        $parametros['idEmpresa'] = $idEmpresa;
        $parametros['Recibe_venc'] = strval($Recibe_venc);
        

        $sql = "select * from getliq_facturacion_pse(:num_referencia,:idEmpresa,:Recibe_venc)";

        $objeto = array();

        try {
            $resultado = $this->executeQuery($sql, $parametros);
            foreach ($resultado as $rst) {


                $objeto['id'] = 1;
                $objeto['id_empresa'] = $parametros['idEmpresa'];
                $objeto['fec_venci'] = $rst['fechavencimiento'];

                if ($parametros['idEmpresa'] == 317) {

                    $objeto['Num_referencia'] = $rst['numerofacturaaseo'];
                    $objeto['Val_factura'] = $rst['valoraseo'];
                    $objeto['Id_suscripcion'] = $rst['idsuscripcionaseo'];
                    $objeto['Id_susalterna'] = $rst['idsuscripcion'];
                } else {

                    $objeto['Num_referencia'] = $rst['idsuscripcion'];
                    $objeto['Val_factura'] = $rst['valorgas'];
                    $objeto['Id_suscripcion'] = $rst['idsuscripcion'];
                    $objeto['Id_susalterna'] = $rst['idsuscripcionaseo'];
                }

                if (!empty($rst['numerofacturaaseo']) && !empty($rst['idsuscripcion']) && $rst['valorgas'] > 0 && $rst['valoraseo'] > 0) {
                    $objeto['Homologado'] = 'S';
                } else {
                    $objeto['Homologado'] = 'N';
                }
            }
        } catch (Exception $ex) {

            $objeto['id'] = 1;
            $objeto['id_empresa'] = $parametros['idEmpresa'];
            $objeto['Num_referencia'] = null;
            $objeto['Val_factura'] = null;
        }


        return $objeto;
    }

    /**
     * Consulta el pago para el proceso de were
     * @param $id_suscripcion, $nit_recaudador, $fecha1, $fecha2
     * @return array - Datos del recaudo
     */
    public function ConsultarPago($id_suscripcion, $nit_recaudador, $fecha1, $fecha2) {

        $parametros['id_suscripcion'] = $id_suscripcion;
        $parametros['nit_recaudador'] = $nit_recaudador;
        $parametros['fecha1'] = $fecha1->format('d-m-Y H:i:s');
        $parametros['fecha2'] = $fecha2->format('d-m-Y H:i:s');


              $sql = "SELECT  wrcc.wrec_ideregistro as id_recaudo, dwrc.dwre_ideregistro , dwrc.dwre_fecha  , dwrc.dwre_estpago , dwrc.dwre_valorpago 
                FROM dwre_detwebrec dwrc 
                INNER JOIN wrec_webrec wrcc ON wrcc.wrec_ideregistro = dwrc.wrec_ideregistro 
                AND wrec_tercentidad = :nit_recaudador
                WHERE dwrc.dsus_ideregistr = :id_suscripcion 
                AND dwre_fecha BETWEEN :fecha2 ::timestamp  AND :fecha1 ::timestamp AND dwre_estpago = 'INCOMPLETO' 
                ORDER BY dwre_fecha DESC LIMIT 1";

        $resultado = $this->executeQuery($sql, $parametros);



        $detallerecaudo = array();

        if (!empty($resultado)) {
            foreach ($resultado as $rst) {

                $detallerecaudo['Id'] = 1;
                $detallerecaudo['Estado'] = $rst['dwre_estpago'];
                $detallerecaudo['Fecha'] = $rst['dwre_fecha'];
                $detallerecaudo['IdDetRecaudoWeb'] = $rst['dwre_ideregistro'];
                $detallerecaudo['IdRecaudoWeb'] = $rst['id_recaudo'];
                $detallerecaudo['ValRecaudo'] = $rst['dwre_valorpago'];
            }
        } else {
            $detallerecaudo['Id'] = -1;
        }
        
        return $detallerecaudo;
    }

    /**
     * Actualiza el detalle del recaudo para el proceso de were
     * @param $id_detale, $estado, $desEstado
     */
    function actualizarDetallePago($id_detale, $estado, $desEstado) {

        $parametros['id_detale'] = $id_detale;
        $parametros['estado'] = strval($estado);
        $parametros['desEstado'] = $desEstado;
        
        $sql = "UPDATE dwre_detwebrec
                SET dwre_estpago =:estado, dwre_estaplpago = :desEstado 
                WHERE dwre_ideregistro =:id_detale";

        $this->executeQuery($sql, $parametros);
    }

    /**
     * Insertar recaudo encabezado para el proceso de were
     * @param $parametros
     * @return int - wrec_ideregistro
     */
    public function insertarRecaudoWeb($parametros) {
        $sql = "INSERT INTO public.wrec_webrec(
                wrec_fecha, 
                wrec_vlrpagototal, 
                wrec_estado,
                wrec_mensaje, 
                wrec_ticketofficeid, 
                wrec_servicecode , 
                wrec_amount,
                wrec_vatamount,
                wrec_paymentid,
                wrec_paymentdescription,
                wrec_referencenumber2,
                wrec_tercentidad, 
                uni_medpago) 
                VALUES (to_timestamp(:Fecha, 'dd-mm-yyyy hh24:mi:ss'),:ValorPagoTotal,:Estado,:Mensaje,:TicketOfficeId,:serviceCode ,:ValorPagoTotal,
                :VatAmount,:PaymentId,:PaymentDescription, :ReferenceNumber2,:TerceroEntidad, :MedioPago)     
                RETURNING wrec_ideregistro";

        $resultado = $this->executeQuery($sql, $parametros);
  
        return $resultado[0]['wrec_ideregistro'];
    }

    /**
     * Insertar recaudo detalle para el proceso de were
     * @param $parametros
     * @return int - dwre_ideregistro
     */
    public function insertarDetalle($parametros) {

        $sql = "INSERT INTO public.dwre_detwebrec( 
                wrec_ideregistro, 
                dsus_ideregistr, 
                emp_ideregistro, 
                dwre_fecha, 
                dwre_valorpago, 
                dwre_estpago, 
                dwre_estaplpago,
                dwre_paymentid) 
                VALUES (:IdRecaudoWeb,:IdSuscripcion,:IdEmpresa,to_timestamp(:fechac1, 'dd-mm-yyyy hh24:mi:ss') ,:ValorPago,:EstadoPago,:EstadoAplicacionPago,:nunTrans)       
                RETURNING dwre_ideregistro";

        $resultado = $this->executeQuery($sql, $parametros);
       
        return $resultado[0]['dwre_ideregistro'];
    }

    /**
     * Actualiza el detalle del recaudo para el proceso de were
     * @param $id_recaudo
     */
    public function actualizarRecaudoWeb($id_recaudo) {

        $parametros['id_recaudo'] = $id_recaudo;

        $sql = "UPDATE wrec_webrec wrr
                SET wrec_vlrpagototal = 
                (SELECT SUM ( COALESCE (dwre_valorpago, 0) ) 
                FROM dwre_detwebrec drr 
                WHERE drr.wrec_ideregistro = wrr.wrec_ideregistro ) , 
                wrec_amount = 
                (SELECT SUM ( COALESCE (dwre_valorpago, 0) ) 
                FROM dwre_detwebrec drr 
                WHERE drr.wrec_ideregistro = wrr.wrec_ideregistro ) 
                WHERE wrec_ideregistro =:id_recaudo";


        $this->executeQuery($sql, $parametros);
    }

}
