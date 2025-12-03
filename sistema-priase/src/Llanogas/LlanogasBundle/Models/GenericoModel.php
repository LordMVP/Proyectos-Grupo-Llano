<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * Consultas genericas del sistema.
 *
 * @author hrey
 */
class GenericoModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    /**
     * @deprecated since version 1 se recomienda utilizar la función cicloPeriodoSuscripcion
     * @param integre $idSuscripcion
     * @return array
     */
    public function getCicloPeriodo($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT
                    cic.cic_ideregistro idciclo,
                    cic.cic_nombre ciclo,
                    per.per_ideregistro idperiodo,
                    per.per_nombre periodo,
                    cic.cic_anoactual cicloanio,
                    per.per_fecvence fechavencimiento,
                    per.per_fecsuspens fechasuspension,
                    per.per_ideorden orden
                FROM
                    cic_ciclo cic inner join per_periodo per on per.cic_ideregistro = cic.cic_ideregistro
		    inner join dsus_detsuscrip dsus on cic.cic_ideregistro=dsus.cic_ideregistro
                WHERE
                    per.per_estado = 'A' and
                    dsus.dsus_ideregistr= :idsuscripcion";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error al consultar el ciclo ', -1);
        }
        return $resultado;
    }

    public function CerrarProgramaModel($idprograma, $filasafectadas = 0) {
        $sql = "UPDATE cpr_ctrproceso
                SET cpr_canregistro = $filasafectadas,
                 cpr_fecfinal = now(),
                 cpr_estado = 'I'
                WHERE
                        cpr_ideregistro = $idprograma";
        return $this->executeQuery($sql);
    }

    /**
     * Consulta el estado del programa dependiendo del identificador y el identificador de la empresa
     * @param int $idPrograma Identificador de la programa
     * @param type $idEmpresa Identificador de la empresa
     * @return array Detalle del proceso.
     */
    public function consultarProcesoPorEmpresaEstadoPrograma($idPrograma, $idEmpresa) {
        $parametros['idEmpresa'] = $idEmpresa;
        $parametros['idPrograma'] = $idPrograma;
        $sql = "
            select 
                cpr_ideregistro idproceso, cpr_fecinicio fechainicio,
                cpr_canregistro numeroregistrosprocesados,
                usu.usuario_nom usuario,
                cpr_estado estado, 
                cpr_fecfinal fechafinal
	    from cpr_ctrproceso cpr inner join acc_acceso acc on cpr.acc_ideregistro=acc.acc_ideregistro
                inner join usuarios usu on acc.usu_ideregistro=usu.usu_ideregistro
            where cpr.emp_ideregistro=:idEmpresa and cpr.prg_ideregistro=:idPrograma and cpr.cpr_estado='A'";
        $this->setSql($sql);
        $this->setParams($parametros);
        $resultado = $this->execute();
        $datos = array();
        if (count($resultado) > 0) {
            $datos['idProceso'] = $resultado[0]['idproceso'];
            $datos['fechaInicio'] = $resultado[0]['fechainicio'];
            $datos['numeroRegistrosProcesados'] = $resultado[0]['numeroregistrosprocesados'];
            $datos['usuario'] = $resultado[0]['usuario'];
            $datos['estado'] = $resultado[0]['estado'];
            $datos['fechafinal'] = $resultado[0]['fechafinal'];
        }
        return $datos;
    }

    /**
     * Ingresa una nueva ejecución de un proceso
     * @param array $proceso Detalle del proceso que se quiere ingresar.
     * @return int Identificador del nueva ejecución del proceso.
     */
    public function insertarProceso($proceso) {
        $idUsuario = $this->getInfoSesion($proceso['idAcceso'])['idusuario'];
        $data['cpr_estado'] = $proceso['estado'];
        $data['cpr_fecinicio'] = $proceso['fechaInicio'];
        $data['cpr_canregistro'] = 0;
        $data['prg_ideregistro'] = $proceso['idPrograma'];
        $data['acc_ideregistro'] = $proceso['idAcceso'];
        $data['emp_ideregistro'] = $proceso['idEmpresa'];
        $data['cpr_idehilo'] = $proceso['idHilo'];
        $data['usu_ideregistro'] = $idUsuario;
        return $this->insertar($data, 'cpr_ctrproceso', "sq_cpr_ideregistro");
    }

    /**
     * Obtiene los detalles del ciclo y periodo
     * @param int $idCiclo identificador del ciclo
     * @return array detalle del periodo y ciclo
     * @throws MyException No hay resultado
     */
    public function getCicloPeriodoId($idCiclo) {
        $parametros['idciclo'] = $idCiclo;
        $sql = "SELECT
                    cic.cic_ideregistro idciclo,
                    cic.cic_nombre ciclo,
                    per.per_ideregistro idperiodo,
                    per.per_nombre periodo,
                    cic.cic_anoactual cicloanio,
                    per.per_fecvence fechavencimiento,
                    per.per_fecsuspens fechasuspension
                FROM
                    cic_ciclo cic inner join per_periodo per on per.cic_ideregistro = cic.cic_ideregistro
                WHERE
                    per.per_estado = 'A' and cic.cic_ideregistro=:idciclo";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error al consultar el ciclo ' . $idCiclo, -1);
        }
        return $resultado[0];
    }

    /**
     * obtiene el documento basado en la liquidación
     * @param int $idliquidacion
     * @return array doc_documento
     * @throws MyException No se encontraron documentos asociados a la liquidación
     */
    public function getDocumentoLiquidacion($idliquidacion) {
        $sql = "SELECT
                        doc.uni_documento iddocumento,
                        doc.doc_nombre nombredocumento,
                        liq.uni_tipdocument idtipodocumento
                FROM
                        doc_documento doc
                INNER JOIN liq_liquidacion liq ON liq.uni_documento = doc.uni_documento
                WHERE
                        liq.uni_liquidacion = $idliquidacion";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException("No se encontraron documentos asociados a la liquidación $idliquidacion", -1);
        }
        return $resultado[0];
    }

    /**
     * Consulta ciclo y periodo de la suscripción.
     * @param int $idSuscripcion identificador de la suscripción.
     * @return array detalle del ciclo y periodo.
     * @throws MyException Error al consultar.
     */
    public function getCicloPeriodoSuscripcion($idSuscripcion) {
        $resultado = $this->getCicloPeriodo($idSuscripcion);
        if (empty($resultado)) {
            throw new MyException('No se encontró el ciclo y periodo para la suscripción ' . $idSuscripcion, -1);
        }
        $datos['idCiclo'] = $resultado[0]['idciclo'];
        $datos['idciclo'] = $resultado[0]['idciclo'];
        $datos['ciclo'] = $resultado[0]['ciclo'];
        $datos['idPeriodo'] = $resultado[0]['idperiodo'];
        $datos['idperiodo'] = $resultado[0]['idperiodo'];
        $datos['periodo'] = $resultado[0]['periodo'];
        $datos['cicloanio'] = $resultado[0]['cicloanio'];
        $datos['orden'] = $resultado[0]['orden'];
        $datos['fechavencimiento'] = $resultado[0]['fechavencimiento'];
        $datos['fechasuspension'] = $resultado[0]['fechasuspension'];
        return $datos;
    }

    /**
     * Consulta la información de una factura.
     * @param int $idFactura identificador de la factura.
     * @return array Detalle con la información.
     * @throws MyException No se encontró la factura.
     */
    public function consultarFactura($idFactura) {
        $complemento = 'WHERE fac.fac_ideregistro=:idfactura';
        $parametros['idfactura'] = $idFactura;
        $resultado = $this->getFacturasInformacion($complemento, $parametros);
        if (count($resultado) == 0) {
            throw new MyException('Factura no existe ' . $idFactura, -1);
        }
        return $resultado[0];
    }

    /**
     * permite consultar una liquidación a partir de una financiación 
     * @param int $idfinanciacion identificador de la financiación
     * @return Array obtiene el documento, tipodocumento y lliquidacion 
     * @throws MyException 'No existe una amortización activa para esta financiación'
     */
    public function consultarLiquidacionFinanciacionModel($idfinanciacion) {
        $sql = "SELECT
                        amfi.uni_documento iddocumento,
                        amfi.uni_tipdocument idtipodocumento,
                        amfi.uni_liquidacion idliquidacion
                FROM
                        amfi_amofinanci amfi
                WHERE
                        fin_ideregistro = $idfinanciacion 
                and amfi.amfi_estado = 'A'";

        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException("No existe una amortización activa para esta financiación $idfinanciacion", -1);
        }

        return $respuesta[0];
    }

    /**
     * Consulta un documentos por tipo de documentos
     * @param int $idDocumento indentificador deñ documento.
     * @param int $idTipoDocumento identificador del tipo de documento.
     * @param string $tipo tipo del tipo de documento
     * @return array Listado de los documentos consultados.
     * @throws MyException
     */
    public function consultarDocumentoPorDocumentoyTipoDocumento($idDocumento, $idTipoDocumento, $tipo) {
        $sql = "select
                 ddot.uni_documento iddocumento,
                 uni.est_ideregistro idestructuradocumento
                from
                 ddot_detdoctipo ddot inner join doti_doctipo doti on ddot.doti_ideregistr=doti.doti_ideregistr
                 inner join uni_unidad uni on ddot.uni_documento=uni.uni_ideregistro
                where
                 doti.uni_documento=:idDocumento and doti.uni_tipdocument=:idTipoDocumento
                 and ddot.ddot_tipo='$tipo' ";
        $parametros['idDocumento'] = $idDocumento;
        $parametros['idTipoDocumento'] = $idTipoDocumento;
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException("Error al consultar el documento $idDocumento  y tipo documento $idTipoDocumento, para el tipo $tipo", -1);
        }
        $datos['iddocumento'] = $resultado[0]['iddocumento'];
        $datos['idestructuradocumento'] = $resultado[0]['idestructuradocumento'];
        return $datos;
    }

    /**
     * @deprecated since version 1.0
     * Consulta Información del recaudo
     * @param int $idRecaudo identificador del recaudo.
     * @return array información del recaudo.
     * @throws MyException No existe el recaudo.
     */
    public function getRecaudo($idRecaudo) {
        $sql = "select * from rec_recaudo where rec_ideregistro=:idrecaudo ";
        $parametros['idrecaudo'] = $idRecaudo;
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException("Error, recaudo $idRecaudo no existe o se encuentra consignado", -3);
        }
        $datos['idrecaudo'] = $resultado[0]['rec_ideregistro'];
        $datos['fecha'] = $resultado[0]['rec_fecha'];
        $datos['estado'] = $resultado[0]['rec_estado'];
        $datos['fechaaplicado'] = $resultado[0]['rec_fecaplicado'];
        $datos['pagado'] = $resultado[0]['rec_vlrpagado'];
        $datos['cambio'] = $resultado[0]['rec_vlrcambio'];
        $datos['ajuste'] = $resultado[0]['rec_vlrajuste'];
        $datos['valor'] = $resultado[0]['rec_vlrreal'];
        $datos['mediopago'] = $resultado[0]['uni_medpago'];
        $datos['convenio'] = $resultado[0]['cnre_ideregistr'];
        $datos['empresa'] = $resultado[0]['emp_ideregistro'];
        $datos['idsuscriptor'] = $resultado[0]['sus_ideregistro'];
        $datos['idtercero'] = $resultado[0]['ter_ideregistro'];
        $datos['documento'] = $resultado[0]['uni_documento'];
        $datos['iddocumento'] = $resultado[0]['uni_documento'];
        $datos['idorigen'] = $resultado[0]['rec_ideorigen'];
        $datos['padre'] = $resultado[0]['rec_idepadre'];
        $datos['idsucursal'] = $resultado[0]['uni_municipio'];
        $datos['idusuario'] = $resultado[0]['usu_ideregistro'];
        $datos['version'] = $resultado[0]['rec_version'];
        $datos['idconsignacion'] = $resultado[0]['csg_ideregistro'];
        return $datos;
    }

    /**
     * Permite listar los parentescos existentes
     * @return array listado de parentescos
     */
    public function obtenerParentescos($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT
                 uni.uni_ideregistro idunidad,
                 uni.uni_nombre1 parentesco
                FROM
                 uni_unidad uni
                 INNER JOIN est_estructura est ON uni.est_ideregistro = est.est_ideregistro
                 INNER JOIN cla_clase cla ON cla.cla_ideregistro = est.cla_ideregistro
                 INNER JOIN esem_estempresa esem ON esem.est_ideregistro=est.est_ideregistro
                WHERE
                 esem.emp_ideregistro=:idempresa AND cla.cla_ideregistro = " . CLA_PARENTESCO;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta todas las facturas con saldo por una lista de suscripciones.
     * @param string $suscripciones listado de identificadores de suscripciones separados por coma.
     * @return array Listado de facturas
     * @throws MyException Si no llegan suscripciones.
     */
    public function getFacturasConSaldo($suscripciones,$carteraAseoNoHomologada=0) {
        if (empty($suscripciones)) {
            throw new MyException('Faltan parámetros para la consulta', -1);
        }

        if($carteraAseoNoHomologada==0) {
                    $complemento = "  WHERE   fac.dsus_ideregistr in ( $suscripciones) AND fac.fac_idepadre IS NULL
                          AND fac.fac_estado='A' and fac.fac_sdoreal>0 and carg.fac_ideregistro IS NULL 
                             ORDER BY fac.per_ideregistro, fac.fac_fecha, prioridadpagodoc, fac.fac_ideregistro";
                         /*ORDER BY prioridadpagodoc,fac.fac_fecvence,fac.fac_numero";   ---  GLPI No. 55654 */
            
        
        return $this->getFacturasInformacion($complemento);
        }
        else {
                    $complemento = "  WHERE   fac.dsus_ideregistr in ( $suscripciones) AND fac.fac_idepadre IS NULL
                          AND fac.fac_estado='A' and fac.fac_sdoreal>0 
                             ORDER BY fac.per_ideregistro, fac.fac_fecha, prioridadpagodoc, fac.fac_ideregistro";            
        return $this->getFacturasInformacioncarteraAseoNoHomologada($complemento);
            
            
        }
        
    }

    public function consultarEstructuraPorIdUnidad($idUnidad) {
        $sql = "select uni_ideregistro idunidad,est_ideregistro idestructura from uni_unidad where uni_ideregistro=:idunidad ";
        $parametros['idunidad'] = $idUnidad;
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error la unidad no existe: ' . $idUnidad, -1);
        }
        return $resultado[0];
    }

    /**
     * Función que permite la consulta de los ciclos activos a una empresa 
     * @deprecated since version 1.0 
     * Se recomienda utilizar la función de getCiclosActivosPrograma
     * @param type $idEmpresa identificación de la empreas
     * @return array Lista de los ciclos activos que tienen relacionado la empresa.
     */
    public function consultarCiclosActivos($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "    select      cic.cic_ideregistro idciclo,
                                cic.cic_nombre ciclo
                    from        cic_ciclo cic 
                    inner join  ciem_cicempresa ciem on ciem.cic_ideregistro=cic.cic_ideregistro
                    where       cic_estado = 'A' 
                        and     ciem.emp_ideregistro=:idempresa 
                    order by    ciclo ";
        return $this->executeQuery($sql, $parametros);
    }

    public function getCiclosActivosPrograma($idEmpresa, $idPrograma) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idprograma'] = $idPrograma;
        $sql = " select
                    cic.cic_ideregistro idciclo,
                    cic.cic_nombre ciclo
               from cic_ciclo cic inner join  ciem_cicempresa ciem on ciem.cic_ideregistro=cic.cic_ideregistro
                    inner join cipr_cicprograma cipr on cipr.cic_ideregistro=cic.cic_ideregistro
               where cic_estado = 'A' and ciem.emp_ideregistro=:idempresa and cipr.prg_ideregistro=:idprograma 
               ORDER BY cic.cic_nombre
                ";
        return $this->executeQuery($sql, $parametros);
    }

    public function consultarActividad($idCiclo, $idPrograma) {
        $parametros['idciclo'] = $idCiclo;
        $parametros['idprograma'] = $idPrograma;
        $sql = "
         select
          dper.dper_ideregistr idactividad,
          dper.dper_estado estadoactividad,
          per.per_blofecha bloquea,
          dper.dper_fecactiva fechainicio,
          dper.dper_feccierre fechacierre,
          now() fechaactual
         from
          dper_detperiodo dper inner join per_periodo per on
	  dper.per_ideregistro=per.per_ideregistro inner join
          cic_ciclo cic  on cic.cic_ideregistro=per.per_ideregistro
         where dper.dper_estado='A' and per.per_estado='A' and cic.cic_ideregistro=:idciclo
          and dper.prg_ideregistro=:idprograma";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error al consultar la actividad para el ciclo. (' . $idCiclo . ')', -1);
        }
        return $resultado[0];
    }

    public function validarConceptosDeLiquidaciones($idCiclo, $idTipoSuscripcion) {
        $parametros['idciclo'] = $idCiclo;
        $parametros['idtiposuscripcion'] = $idTipoSuscripcion;
        $sql = "select DISTINCT liq.liq_nombre liquidacion,liq.uni_liquidacion idliquidacion, dfin.uni_concepto idconcepto,con.con_nombre concepto 
                from dfin_detfinanci dfin inner JOIN fin_financiacio fin on fin.fin_ideregistro=dfin.fin_ideregistro
                        INNER JOIN amfi_amofinanci amfi ON amfi.fin_ideregistro=fin.fin_ideregistro
                        INNER JOIN dsus_detsuscrip dsus ON fin.dsus_ideregistr=dsus.dsus_ideregistr
                        INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion=amfi.uni_liquidacion
                        INNER JOIN con_concepto con ON con.uni_concepto=dfin.uni_concepto
                WHERE dsus.cic_ideregistro=:idciclo AND 
                 amfi.amfi_estado='A' AND fin.fin_estado='A' AND dfin.uni_concepto not in 
               (select core.uni_conrelacion from core_conrelacio core where core.uni_concepto in(
               SELECT con.uni_concepto
               FROM coli_conliquida coli INNER JOIN con_concepto con ON coli.uni_concepto = con.uni_concepto
               WHERE con.con_intfinanciacion = 'S' AND coli.uni_liquidacion=amfi.uni_liquidacion))";
        return $this->executeQuery($sql, $parametros);
    }

    public function insertarFactura($factura) {
        $parametros = array();
        $this->setCampo($factura, $parametros, 'idfactura', 'fac_ideregistro');
        $this->setCampo($factura, $parametros, 'numero', 'fac_numero');
        $this->setCampo($factura, $parametros, 'metodogenera', 'fac_metgenera');
        $this->setCampo($factura, $parametros, 'estado', 'fac_estado');
        $this->setCampo($factura, $parametros, 'fecha', 'fac_fecha');
        $this->setCampo($factura, $parametros, 'idactual', 'fac_ideactual');
        $this->setCampo($factura, $parametros, 'idfacturapadre', 'fac_idepadre');
        $this->setCampo($factura, $parametros, 'fechaaprobacion', 'fac_fecaprobada');
        $this->setCampo($factura, $parametros, 'fechaeliminada', 'fac_feceliminad');
        $this->setCampo($factura, $parametros, 'fechafinanciacion', 'fac_fecfinancia');
        $this->setCampo($factura, $parametros, 'fechacastigada', 'fac_feccastigad');
        $this->setCampo($factura, $parametros, 'fechavencimiento', 'fac_fecvence');
        $this->setCampo($factura, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($factura, $parametros, 'idsuscriptor', 'sus_ideregistro');
        $this->setCampo($factura, $parametros, 'idsuscripcion', 'dsus_ideregistr');
        $this->setCampo($factura, $parametros, 'idtiposuscripcion', 'uni_tipsuscripc');
        $this->setCampo($factura, $parametros, 'idtipousosuscripcion', 'uni_tipusosuscr');
        $this->setCampo($factura, $parametros, 'idliquidacion', 'uni_liquidacion');
        $this->setCampo($factura, $parametros, 'idtercero', 'ter_ideregistro');
        $this->setCampo($factura, $parametros, 'idciclo', 'cic_ideregistro');
        $this->setCampo($factura, $parametros, 'idperiodo', 'per_ideregistro');
        $this->setCampo($factura, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($factura, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($factura, $parametros, 'idamortizacion', 'amo_ideregistro');
        $this->setCampo($factura, $parametros, 'cicloano', 'cic_ano');
        $this->setCampo($factura, $parametros, 'idhistoricoliquidacion', 'hliq_ideregistr');
        $this->setCampo($factura, $parametros, 'saldofactura', 'fac_sdoreal');
        $this->setCampo($factura, $parametros, 'idfacturaorigen', 'fac_ideorigen');
        $this->setCampo($factura, $parametros, 'idtipotercero', 'uni_tiptercero');
        $this->setCampo($factura, $parametros, 'fechasuspende', 'fac_fecsuspens');
        $this->setCampo($factura, $parametros, 'idfinanciacion', 'fin_ideregistro');
        $this->setCampo($factura, $parametros, 'version', 'fac_version');
        $this->setCampo($factura, $parametros, 'valortotal', 'fac_vlrreal');
        $this->setCampo($factura, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($factura, $parametros, 'idmovimiento', 'mvi_ideregistro');
        return $this->insertar($parametros, 'fac_factura', 'sq_fac_ideregistro');
    }

    public function consultarInformacionSuscripcion($idSuscripcion, $estado = NULL) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $complemento = '';
        if ($estado != NULL) {
            $complemento = 'and dsus_estado IN ($estado)';
        }
        $sql = '
            SELECT dsus_estado estado, dsus_descripcion descripcion,
             dsus_pcodigo codigoanterior , sus_ideregistro idsuscriptor,
             dsus_ideregistr idsuscripcion, dsus.ter_ideregistro idtercero,
             pro_ideregistro idpropiedad, uni_municipio idmunicipio,
             uni_barrio idbarrio, est_tipsuscripc idestructuratiposuscripcion,
             uni_tipsuscripc idtiposuscripcion, est_tipusosuscr idestructuratipousosuscripcion,
             uni_tipusosuscr idtipousosuscripcion, emp_ideregistro idempresa,
             est_liquidacion idestructuraliquidacion, uni_liquidacion idliquidacion,
             cic_ideregistro idciclo, dsus_fecinicio fechainicio,
             dsus_fecexpira fechaexpira, pro_catestrato estrato,
             dsus_iniestado fechainicioestado, dsus_finestado fechafinestado,
             ter.uni_tiptercero idtipotercero
            FROM dsus_detsuscrip dsus inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
            WHERE dsus.dsus_ideregistr=:idsuscripcion ' . $complemento;
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error consultando la suscripcion ' . $idSuscripcion, -1);
        }
        return $resultado[0];
    }

    public function insertarDetalleFactura($detalleFactura) {
        $parametros = array();
        $this->setCampo($detalleFactura, $parametros, 'iddetallefactura', 'dfac_ideregistr');
        $this->setCampo($detalleFactura, $parametros, 'estado', 'dfac_estado');
        $this->setCampo($detalleFactura, $parametros, 'iddetallefacturaorigen', 'dfac_ideorigen');
        $this->setCampo($detalleFactura, $parametros, 'cantidad', 'dfac_cantidad');
        $this->setCampo($detalleFactura, $parametros, 'valorunitario', 'dfac_vlrunitari');
        $this->setCampo($detalleFactura, $parametros, 'valortotal', 'dfac_vlrtotal');
        $this->setCampo($detalleFactura, $parametros, 'valorreal', 'dfac_vlrreal');
        $this->setCampo($detalleFactura, $parametros, 'saldoreal', 'dfac_sdoreal');
        $this->setCampo($detalleFactura, $parametros, 'idfactura', 'fac_ideregistro');
        $this->setCampo($detalleFactura, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($detalleFactura, $parametros, 'iddetalleamortizacion', 'damo_ideregistr');
        $this->setCampo($detalleFactura, $parametros, 'iddetallefacturapadre', 'dfac_idepadre');
        $this->setCampo($detalleFactura, $parametros, 'iddetallefinanciacion', 'dfin_ideregistr');
        $this->setCampo($detalleFactura, $parametros, 'version', 'dfac_version');
        $this->setCampo($detalleFactura, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($detalleFactura, $parametros, 'idempresa', 'emp_ideregistro');
        return $this->insertar($parametros, 'dfac_detfactura', 'sq_dfac_ideregistr');
    }

    public function consultarDocumentosTiposPorLiquidacion($idLiquidacion) {
        $sql = '
	select
	  uni.uni_ideregistro iddocumento,
	  uni.uni_nombre1     documento,
	  unit.uni_ideregistro idtipodocumento,
	  unit.uni_nombre1     tipodocumento
	from
	     liq_liquidacion  liq inner join uni_unidad uni on liq.uni_documento=uni.uni_ideregistro
	     inner join uni_unidad unit on liq.uni_tipdocument=unit.uni_ideregistro
	where liq.uni_liquidacion=:idLiquidacion';
        $parametros['idLiquidacion'] = $idLiquidacion;

        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw New MyException('No existen documentos ni tipos de documentos asociados a esta liquidación ' . $idLiquidacion, -1);
        }
        return $respuesta[0];
    }
    
    /**
     * Trae el docuemnto asociado a una liquidacion a traves de la tabla ddot
     * para crear la factura de venta que da origen a una Financiacion
     * @param int idLiquidacion 
     */
    public function getDocumentosTiposPorLiquidLibran ($idLiquidacion) {
        $sql = "
            SELECT 
                doti.uni_documento iddocumento ,
                doti.uni_tipdocument idtipodocumento
            FROM liq_liquidacion liq
                INNER JOIN doti_doctipo doti on doti.uni_tipdocument=liq.uni_tipdocument 
                INNER JOIN ddot_detdoctipo ddot on ddot.uni_documento=liq.uni_documento 
                    and ddot.doti_ideregistr=doti.doti_ideregistr
                WHERE liq.uni_liquidacion=:idLiquidacion and ddot.ddot_tipo='AM'";
 
        $parametros['idLiquidacion'] = $idLiquidacion;

        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw New MyException('No existen documentos ni tipos de documentos asociados a esta liquidación ' . $idLiquidacion, -1);
        }
        return $respuesta[0];
    }

    public function actualizarEstadoFactura($idFactura, $estado) {
        $data['fac_ideregistro'] = $idFactura;
        $data['fac_estado'] = $estado;
        $data['fac_fecaprobada'] = 'now()';
        $this->actualizar($data, 'fac_factura', 'fac_ideregistro=:fac_ideregistro');
    }
    
    public function actualizarEstadoFacturaElectronica($idFactura, $estado, $controlFelec) {
        $data['fac_ideregistro'] = $idFactura;
        $data['fac_estado'] = $estado;
        $data['fac_ctrlfelec'] = $controlFelec;
        $data['fac_fecaprobada'] = 'now()';
        
        $this->actualizar($data, 'fac_factura', 'fac_ideregistro=:fac_ideregistro');
    }

    public function actualizarNumeroFactura($idFactura, $numero) {
        $data['fac_ideregistro'] = $idFactura;
        $data['fac_numero'] = $numero;
        $this->actualizar($data, 'fac_factura', 'fac_ideregistro=:fac_ideregistro');
    }
    
    public function actualizarNumeroFacturaCusiana($idFactura, $numero) {
        $data['fac_ideregistro'] = $idFactura;
        $data['fac_numero'] = $numero;
        $this->actualizar($data, 'fcfac_felecusfactura', 'fac_ideregistro=:fac_ideregistro');
    }

    /**
     * Bloquea una activiada al estado X
     * @param int $actividad información de la actividad
     * @return bool TRUE correcto FALSE incorrecto
     */
    public function actualizarActividad($actividad, $estado) {
        $data['dper_ideregistr'] = $actividad['idactividad'];
        $data['dper_estado'] = $estado;
        $data['dper_feccierre'] = ' now() ';
        return $this->actualizar($data, 'dper_detperiodo', 'dper_ideregistr = :dper_ideregistr');
    }

    /**
     * @deprecated since version 1.0
     * Se recomienda utilizar el método getLiquidaciones
     * @param int $idDocumento
     * @param int $idTipoDocumento
     * @return array
     * @throws MyException
     */
    public function getLiquidacion($idDocumento, $idTipoDocumento) {
        $resultado = $this->getLiquidaciones($idTipoDocumento, $idDocumento);
        if (empty($resultado)) {
            throw new MyException('Error al consultar la liquidación', -1);
        }
        return $resultado[0];
    }

    public function actualizarEstadoSuscripcion($idSuscripcion, $estado) {
        $data['dsus_ideregistr'] = $idSuscripcion;
        $data['dsus_estado'] = $estado;
        $this->actualizar($data, 'dsus_detsuscrip', 'dsus_ideregistr=:dsus_ideregistr');
    }

    public function getFacturasInformacion($complemento, array $parametros = array()) {
        if (empty($complemento)) {
            throw new MyException('Error, Debe tener un complemento la consulta de facturas');
        }
        $sql = "SELECT fac.fac_ideregistro idfactura,fac.fac_numero numero,
                  DATE (fac.fac_fecvence) fechavencimiento,fac.dsus_ideregistr idsuscripcion,
                  coalesce(fac.fac_vlrreal ,0) valortotal, COALESCE ((fac.fac_vlrreal-fac.fac_sdoreal) ,0)valorpagadofactura,
                  coalesce(fac.fac_vlrreal ,0) valorreal,per.per_ideregistro idperiodo, cic.cic_ideregistro idciclo,
                  per.per_nombre ||' '|| cic.cic_nombre cicloperiodo,tsu.uni_tipsuscripc idtiposuscripcion,
                  tsu.tsu_nombre tiposuscripcion,
                  COALESCE(fac.fac_sdoreal,0) saldofactura,fac.fac_metgenera metodogenera,
                  fac.fac_estado estado,fac.fac_fecha fecha,fac.fac_ideactual idactual,
                  fac.fac_idepadre idfacturapadre,fac.fac_fecaprobada fechaaprobada,fac.fac_feceliminad fechaeliminada,
                  fac.fac_fecfinancia fechafinanciacion,fac.fac_feccastigad fechacastigada,
                  fac.emp_ideregistro idempresa,fac.sus_ideregistro idsuscriptor,fac.uni_tipusosuscr idtipousosuscripcion,
                  fac.uni_liquidacion idliquidacion,fac.ter_ideregistro idtercero,fac.uni_documento iddocumento,
                  fac.uni_tipdocument idtipodocumento,fac.amo_ideregistro idamortizacion,
                  fac.cic_ano cicloano,fac.hliq_ideregistr idhistoricoliquidacion,
                  fac.fac_ideorigen idorigen,fac.uni_tiptercero idtipotercero,fac.fac_fecsuspens fechasuspension,
                  fac.fin_ideregistro idfinanciacion,fac.fac_version as version,
                  COALESCE(fac.fac_vlrreal-fac.fac_sdoreal,0) valorpagado,doc.doc_nombre documento,
                  uni.uni_nombre1 tipodocumento, doc.doc_pagpriori prioridadpagodoc
                FROM
                  fac_factura fac inner join per_periodo per on fac.per_ideregistro=per.per_ideregistro
                  left join aseo.fmg_facturacioncarterag carg on carg.fac_ideregistro = fac.fac_ideregistro 
                  inner join cic_ciclo cic on fac.cic_ideregistro=cic.cic_ideregistro
                  inner join tsu_tipsuscripc tsu on fac.uni_tipsuscripc=tsu.uni_tipsuscripc
                  inner join doc_documento doc on fac.uni_documento=doc.uni_documento
                  inner join uni_unidad uni on fac.uni_tipdocument=uni.uni_ideregistro " . $complemento;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Función que se encarga de calcular los saldos de una factura.
     * @param int $idFinanciacion identificador de la factura
     * @param int $version versión de la factura, para garantizar que la factura no haya sido afectada por otro proceso.
     * @return array información de la factura
     * @throws MyException Si no se encuentra la factura.
     */
    public function getFinanciacionCalculada($idFinanciacion, $version) {
        $parametros['idfinanciacion'] = $idFinanciacion;
        $parametros['version'] = $version;
        $sql = 'select * from getfinanciacion(:idfinanciacion,:version)';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('La financiacion ya fue modificada por otro proceso', -1);
        }
        return $resultado[0];
    }

    /**
     * Función que se encarga de calcular los saldos de una factura.
     * @param int $idFactura identificador de la factura
     * @param int $version versión de la factura, para garantizar que la factura no haya sido afectada por otro proceso.
     * @return array información de la factura
     * @throws MyException Si no se encuentra la factura.
     */
    public function getFacturaCalculada($idFactura, $version) {
        $parametros['idfactura'] = $idFactura;
        $parametros['version'] = $version;
        $sql = 'select * from getfactura(:idfactura,:version)';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('La factura ya fue modificada por otro proceso', -1);
        }
        return $resultado[0];
    }

    public function getConceptosInformacion($complemento, array $parametros) {
        if (empty($complemento)) {
            throw new MyException('Debe tener un complemento la selección de datos');
        }
        $sql = ' SELECT con_operacion operacion ,dfac.dfac_ideregistr iddetallefactura,dfac.dfac_estado estado,dfac.dfac_ideorigen iddetalleorigen,dfac.
                 dfac_cantidad cantidad,dfac.dfac_vlrunitari valorunitario,dfac.dfac_vlrtotal valortotal,
                 dfac.dfac_vlrreal valor,dfac.dfac_vlrreal valorreal,dfac.dfac_sdoreal saldo,dfac.fac_ideregistro idfactura,
                 dfac.uni_concepto idconcepto,dfac.damo_ideregistr iddetalleamortizacion,
                 dfac.dfac_idepadre iddetallepade,dfac.dfac_idepadre iddetallepadre,
                 dfac.dfin_ideregistr iddetallefinanciacion,dfac.dfac_version as version,
                 con.con_nombre concepto,
                 round((dfac.dfac_vlrreal-dfac.dfac_sdoreal),7) valorpagado
                FROM dfac_detfactura dfac INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                     inner join fac_factura fac on dfac.fac_ideregistro=fac.fac_ideregistro ' . $complemento;


        return $this->executeQuery($sql, $parametros);
    }

    public function getConceptosCalulados($idFactura) {
        $parametros['idfactura'] = $idFactura;
        $sql = 'select * from getconceptos(:idfactura)';
        return $this->executeQuery($sql, $parametros);
    }

    public function getDetalleFinanciacion($idfinanciacion) {
        $parametros['idfinanciacion'] = $idfinanciacion;
        $sql = 'select * from getdetallefinanciacion(:idfinanciacion)';
        return $this->executeQuery($sql, $parametros);
    }

    public function getFacturasTodas($version, $numero, $numeroprocesos, $idproceso) {
        $complemento = ' where fac.fac_idepadre IS NULL AND fac.fac_version=:version AND  ( fac.fac_ideregistro % :numeroprocesos)=:idproceso limit :numero ';
        $parametros['version'] = $version;
        $parametros['numero'] = $numero;
        $parametros['numeroprocesos'] = $numeroprocesos;
        $parametros['idproceso'] = $idproceso;
        return $this->getFacturasInformacion($complemento, $parametros);
    }

    public function getFacturasNotas($version) {
        $complemento = ' where  fac.fac_idepadre IS NOT NULL AND fac.fac_version=:version ';
        $parametros['version'] = $version;
        return $this->getFacturasInformacion($complemento, $parametros);
    }

    public function getMunicipiosPorPerfil($idUsuario, $idEmpresa) {
        $parametros['idusuario'] = $idUsuario;
        $parametros['idempresa'] = $idEmpresa;
        $sql = 'select
                     distinct
                     pro.proyecto_ideregistro idmunicipio, pro.proyecto_nom municipio
                from proyectos pro
                     inner join empresas emp on pro.proyecto_codemp=emp.empresa_cod
                     inner join uspr_usuprgpryto uspr on pro.proyecto_ideregistro=uspr.uni_municipio
                where
                     uspr.usu_ideregistro=:idusuario and emp.empresa_sevemp=:idempresa order by pro.proyecto_nom ';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * 
     * @param type $idUsuario  --> Id Usuario que inicio Session
     * @param type $idEmpresa  --> Id Empresa a la cual pertenece el usuario
     * @param type $idPrograma --> Id del programa desde el cual se va a generar el reporte
     * @return type
     */
    public function getMunicipiosPorPerfilAndPrograma($idUsuario, $idEmpresa, $idPrograma) {
        $parametros['idusuario'] = $idUsuario;
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idprograma'] = $idPrograma;
        $sql = 'SELECT
                     distinct
                     pro.proyecto_ideregistro idmunicipio, pro.proyecto_nom municipio
                FROM proyectos pro
                     inner join empresas emp on pro.proyecto_codemp=emp.empresa_cod
                     inner join uspr_usuprgpryto uspr on pro.proyecto_ideregistro=uspr.uni_municipio
                WHERE
                     uspr.usu_ideregistro = :idusuario 
                     AND emp.empresa_sevemp = :idempresa
                     AND uspr.prg_ideregistro = :idprograma 
                ORDER BY 
                     pro.proyecto_nom ';
        return $this->executeQuery($sql, $parametros);
    }

    public function getMunicipiosPorCiudad($iddepartamento, $idempresa, $idusuario) {
        $sql = "SELECT DISTINCT
                        pro.proyecto_ideregistro idmunicipio,
                        pro.proyecto_nom municipio
                FROM
                        proyectos pro
                INNER JOIN empresas emp ON pro.proyecto_codemp = emp.empresa_cod
                WHERE
                        pro.departamento_ideregistro = '$iddepartamento'
                AND emp.empresa_sevemp = $idempresa
                ORDER BY
                        pro.proyecto_nom";
        return $this->executeQuery($sql);
    }

    public function getBarrios($idMunicipio) {
        $parametros['idmunicipio'] = $idMunicipio;
        $sql = 'select
                 muba.uni_barrio idbarrio,
                 ba.barrio_nom barrio
                from
                 muba_munbarrio muba inner join barrios ba on ba.barrio_ideregistro=muba.uni_barrio
                where
                 muba.uni_municipio=:idmunicipio order by ba.barrio_nom ';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Confirma el nuevo número generado
     * @param int $numero nuevo número
     * @param int $idNumero identificador del nuevo número generado
     * @return int número de filas afectadas.
     */
    public function actualizarNumeroDisponible($numero, $idNumero) {
        $parametros['nudo_numdisponi'] = $numero;
        $parametros['nudo_ideregistro'] = $idNumero;
        return 1;
    }

    /**
     * Consulta el número de una factura a generar.
     * @param array $infoFactura Información de la factura
     * @return array detalle con el nuevo número a generar.
     * @throws MyException Error al consultar
     */
    public function obtenerNumeroFactura($infoFactura) {
        //print_r($infoFactura);
        $sql = "SELECT  nudo.nudo_ideregistro idnumero , 
                    (SELECT fn_nudo_retornaconsecutivo(:idempresa, nudo.nudo_ideregistro)) numero,  
                    nudo.nudo_aplicafelectronica aplicafele
                from doti_doctipo doti
                    INNER JOIN donu_dotinumdocumento donu on donu.doti_ideregistr=doti.doti_ideregistr
                    INNER JOIN nudo_numdocumen nudo on nudo.nudo_ideregistro=donu.nudo_ideregistro
                where nudo.nudo_estado='A' and donu.donu_tipo=:tipo  
                and nudo.emp_ideregistro=:idempresa  
                and doti.uni_documento=:iddocumento   
                and doti.uni_tipdocument=:idtipodocumento";
        $resultado = $this->executeQuery($sql, $infoFactura);
        if (empty($resultado[0]['numero'])){
            throw new MyException("Número de factura no generado. documento:" . $infoFactura['iddocumento'] . ' tipo documento: ' . $infoFactura['idtipodocumento'], -1);
        }
        return $resultado[0];
    }
    
     /**
     * Consulta si Aplica Factura Electronica.
     * @param array $infoFactura Información de la factura
     * @return array detalle con el nuevo número a generar.
     * @throws MyException Error al consultar
     */
    public function aplicaFacturaElectronica($infoFactura) {
        //print_r($infoFactura);
        $sql = "SELECT   nudo.nudo_aplicafelectronica aplicafele
from doti_doctipo doti
INNER JOIN donu_dotinumdocumento donu on donu.doti_ideregistr=doti.doti_ideregistr
INNER JOIN nudo_numdocumen nudo on nudo.nudo_ideregistro=donu.nudo_ideregistro
where nudo.nudo_estado='A' and donu.donu_tipo=:tipo  
and nudo.emp_ideregistro=:idempresa  
and doti.uni_documento=:iddocumento   
and doti.uni_tipdocument=:idtipodocumento  ";
        $resultado = $this->executeQuery($sql, $infoFactura);
        if (empty($resultado)) {
            throw new MyException("Número de factura no generado. documento:" . $infoFactura['iddocumento'] . ' tipo documento: ' . $infoFactura['idtipodocumento'], -1);
        }
        return $resultado[0];
    }
//    public function obtenerNumeroFactura($infoFactura) {
//        $sql = 'SELECT
//                   nudo_ideregistro idnumero , (nudo_numdisponi+1) numero
//                FROM
//                   nudo_numdocumen
//                WHERE
//                   emp_ideregistro=:idempresa and uni_documento=:iddocumento
//                   and uni_tipdocument=:idtipodocumento FOR UPDATE ';
//        $resultado = $this->executeQuery($sql, $infoFactura);
//        if (empty($resultado)) {
//            throw new MyException("Número de factura no generado. documento:" . $infoFactura['iddocumento'] . ' tipo documento: ' . $infoFactura['idtipodocumento'], -1);
//        }
//        return $resultado[0];
//    }

    public function getDistribucionRecaudoId($idDistribucionRecaudo) {
        $parametros['iddistribucionrecaudo'] = $idDistribucionRecaudo;
        $sql = 'SELECT
                 dire.dire_ideregistr iddistribucionrecaudo, dire_vlrrecaudo valorrecaudo, dire_sdorecaudo saldorecuado, rec.rec_ideregistro idrecaudo,
                 dire.dicn_ideregistr idconvenio, dire.dsus_ideregistr idsuscripcion, dire.uni_tipdocument idtipodocumento,
                 dire.uni_concepto idconcepto, dire.per_ideregistro idperiodo, dire.cic_ideregistro idciclo, dire.emp_ideregistro idempresa,
                 dire.cic_ano cicloanio, dire.dcsg_ideregistr iddetalleconsigancion, dire.usu_ideregistro idusuario, dire.dire_version as version,
                 doc.uni_documento iddocumento, doc.doc_nombre documento, doc.doc_tipo tipodocumento
                FROM dire_disrecaudo dire  inner join rec_recaudo rec on dire.rec_ideregistro=rec.rec_ideregistro
                 inner join doc_documento doc on doc.uni_documento=rec.uni_documento
                where dire_ideregistr=:iddistribucionrecaudo';
        return $this->executeQuery($sql, $parametros);
    }

    public function getDistribucionRecaudo($idRecaudo, $idSuscripcion) {
        $parametros['idrecaudo'] = $idRecaudo;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = 'SELECT
                    dire.dire_ideregistr iddistribucionrecaudo, dire_vlrrecaudo valorrecaudo, dire_sdorecaudo saldorecaudo, rec.rec_ideregistro idrecaudo,
                    dire.dicn_ideregistr idconvenio, dire.dsus_ideregistr idsuscripcion, dire.uni_tipdocument idtipodocumento,
                    dire.uni_concepto idconcepto, dire.per_ideregistro idperiodo, dire.cic_ideregistro idciclo, dire.emp_ideregistro idempresa,
                    dire.cic_ano cicloanio, dire.dcsg_ideregistr iddetalleconsigancion, dire.usu_ideregistro idusuario, dire.dire_version as version,
                    doc.uni_documento iddocumento, doc.doc_nombre documento, doc.doc_tipo tipodocumento,
                    dire.uni_documento iddocumentoanticipo
                FROM dire_disrecaudo dire  inner join rec_recaudo rec on dire.rec_ideregistro=rec.rec_ideregistro
                             inner join doc_documento doc on doc.uni_documento=rec.uni_documento
                WHERE dire.rec_ideregistro = :idrecaudo and dire.dsus_ideregistr = :idsuscripcion AND dire.dire_sdorecaudo>0';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException("Error no se encontró la distribución del recaudo id suscripcion $idSuscripcion id Recaudo $idRecaudo ", -1);
        }
        return $resultado;
    }

    public function getDistribucionPorId($idDistribucion) {
        $parametros['iddistribucion'] = $idDistribucion;

        $sql = 'SELECT
                    dire.dire_ideregistr iddistribucionrecaudo, dire_vlrrecaudo valorrecaudo, dire_sdorecaudo saldorecuado, rec.rec_ideregistro idrecaudo,
                    dire.dicn_ideregistr idconvenio, dire.dsus_ideregistr idsuscripcion, dire.uni_tipdocument idtipodocumento,
                    dire.uni_concepto idconcepto, dire.per_ideregistro idperiodo, dire.cic_ideregistro idciclo, dire.emp_ideregistro idempresa,
                    dire.cic_ano cicloanio, dire.dcsg_ideregistr iddetalleconsigancion, dire.usu_ideregistro idusuario, dire.dire_version as version,
                    doc.uni_documento iddocumento, doc.doc_nombre documento, doc.doc_tipo tipodocumento,
                    dire.uni_documento iddocumentoanticipo, dire.per_ideaplica ideperiodoaplicar
                FROM dire_disrecaudo dire  inner join rec_recaudo rec on dire.rec_ideregistro=rec.rec_ideregistro
                             inner join doc_documento doc on doc.uni_documento=rec.uni_documento
                WHERE dire.dire_ideregistr =:iddistribucion  AND dire.dire_sdorecaudo>0';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException("Error no se encontró la distribución del recaudo ", -1);
        }
        return $resultado;
    }

    public function getConceptos($idFactura) {
        $complemento = 'where fac.fac_ideregistro=:idfactura';
        $parametros['idfactura'] = $idFactura;
        return $this->getConceptosInformacion($complemento, $parametros);
    }

    public function getConceptosPorId($idDetalleFactura) {
        $complemento = 'where dfac.dfac_ideregistr=:iddetallefactura';
        $parametros['iddetallefactura'] = $idDetalleFactura;
        $resultado = $this->getConceptosInformacion($complemento, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró el detalle de factura ', -1);
        }
        return $resultado[0];
    }

    public function getFactura($idFactura) {
        $complemento = ' where fac.fac_ideregistro = :idfactura';
        $parametros['idfactura'] = $idFactura;
        $resultado = $this->getFacturasInformacion($complemento, $parametros);
        return $resultado[0];
    }

    public function validarActividadPrograma($idPrograma, $idCiclo, $idEmpresa) {
        $parametros["idprograma"] = $idPrograma;
        $parametros["idciclo"] = $idCiclo;
        $parametros["idempresa"] = $idEmpresa;
        $sql = "SELECT * FROM consultaractividadesprogramasactivos(:idprograma, :idciclo, :idempresa)";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    public function getRecaudoAnticipoSaldoCalculado($idRecaudo) {
        $parametros['idrecaudo'] = $idRecaudo;
        $sql = 'select  sum(dire.dire_vlrrecaudo) saldorecaudo
        from dire_disrecaudo dire  inner join rec_recaudo rec on dire.rec_ideregistro=rec.rec_ideregistro
        where (rec.rec_ideregistro=:idrecaudo or  rec.rec_idepadre=:idrecaudo)';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error no se encontró la distribucion del recaudo  ' . $idRecaudo);
        }
        return $resultado[0];
    }

    public function actualizarRecaudoSaldo($idDistribucionRecaudo, $saldoRecaudo) {
        $parametros['dire_ideregistr'] = $idDistribucionRecaudo;
        $parametros['dire_sdorecaudo'] = $saldoRecaudo;
        $sql = 'update dire_disrecaudo set dire_version=dire_version+1,dire_sdorecaudo=:dire_sdorecaudo where dire_ideregistr=:dire_ideregistr ';
        return $this->executeQuery($sql, $parametros);
    }

    public function actualizarRecaudoVersion($idRecaudo, $version) {
        $parametros['rec_ideregistro'] = $idRecaudo;
        $parametros['rec_version'] = $version + 1;
        $resultado = $this->actualizar($parametros, 'rec_recaudo', "rec_ideregistro=:rec_ideregistro and rec_version=$version");
        if (empty($resultado)) {
            throw new MyException('Error el recaudo fue modificado por otro proceso y la versión no coincide');
        }
        /*
         * Se Adiciona retorno de la nueva versión actualizada para poder saber cual es la versión actual , cuando hay 
         * multiples registros en dire de la misma empresa y suscripción 
         */
        return $parametros;
    }

    public function getDisponibleRecaudoCalculado($idRecaudo, $idSuscripcion, $numeroVersion) {
        $parametros['idrecaudo'] = $idRecaudo;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['numeroversion'] = $numeroVersion;
        $sql = 'select * from getdisponiblerecaudo(:idrecaudo,:idsuscripcion,:numeroversion)';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error, el recaudo fue modificado por otro proceso ' . $idRecaudo, -1);
        }
        return $resultado[0];
    }

    public function getDisponiblePorId($idDistribucion, $numeroVersion) {
        $parametros['iddistribucion'] = $idDistribucion;
        $parametros['numeroversion'] = $numeroVersion;
        $sql = 'select * from getdisponiblerecaudo(:iddistribucion,:numeroversion)';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error, el recaudo fue modificado por otro proceso dire: ' . $idDistribucion, -1);
        }
        return $resultado[0];
    }

    /**
     * Lista todos los terceros dependiendo del tipo de tercero
     * @param string $nombre nombre del cliente
     * @param int $idTipoTercero identificación de la unidad del tercero que se quiere consultar
     * @return array Listado de los terceros
     */
    public function consultarTercero($nombre, $idTipoTercero) {
        $nombre = rtrim($nombre);
        $nombre = ltrim($nombre);
        $parametros["ter_nomcompleto"] = "%" . strtolower($nombre) . "%";
        $parametros["idtipotercero"] = $idTipoTercero;
        $sql = "SELECT
                    DISTINCT
                    ter.ter_ideregistro idtercero,
                    ter.ter_documento documento,
                    trim(ter.ter_nomcompleto) nombretercero,
                    ter.uni_tiptercero  idtipotercero,uni.uni_nombre1 tipotercero,ter.ter_telfijo telefonofijo,
                    ter.ter_telcelular telefonocelular
                FROM
                    ter_tercero  ter LEFT JOIN clte_clatercero clte on clte.ter_ideregistro = ter.ter_ideregistro
                    inner join uni_unidad uni on ter.uni_tiptercero=uni.uni_ideregistro
                WHERE
                    clte.uni_clatercero=:idtipotercero and  lower(ter_nomcompleto) like :ter_nomcompleto
                LIMIT 100";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Buscan el encabezado de una suscripción
     * @param array $parametros criterios de búsqueda
     * @return array Listado de suscripciones
     */
    public function getSuscripcion(array $parametros, $idusuario) {
        if (!is_array($parametros)) {
            throw new MyException("Error, el parámetro no es un arreglo", -1);
        }
        $complemento = '';
        if (!empty($parametros['estado'])) {
            $estado = $parametros['estado'];
            $complemento .= "and dsus.dsus_estado not in ($estado) ";
        }
        if (!empty($parametros['idempresa'])) {
            $complemento .= 'and dsus.emp_ideregistro=:idempresa ';
        }
        if ((!empty($parametros['idsuscripcion']) ) && $parametros['idsuscripcion'] != -1) {
            $complemento .= 'and dsus.dsus_ideregistr=:idsuscripcion ';
        }
        if ((!empty($parametros['idbarrio']) ) && $parametros['idbarrio'] != -1) {
            $complemento .= 'and pro.uni_barrio=:idbarrio ';
        }
        if ((!empty($parametros['idtercero']) ) && $parametros['idtercero'] != -1) {
            $complemento .= 'and ter.ter_ideregistro=:idtercero ';
        }
        if (!empty($parametros['ruta'])) {
            $complemento .= 'and rut.rut_nombre like :ruta ';
            $parametros['ruta'] = '%' . $parametros['ruta'] . '%';
        }
        if (!empty($parametros['cedula'])) {
            $complemento .= 'and ter.ter_documento=:cedula ';
        }
        if (!empty($parametros['direccion'])) {
            $parametros['direccion'] = '%' . strtolower($parametros['direccion']) . '%';
            $complemento .= "and LOWER(pro.pro_direccion) like '" . $parametros['direccion'] . "'";
        }
        if (!empty($parametros['numerocatastral'])) {
            $complemento .= 'and pro.pro_numcatastral=:numerocatastral ';
        }
        if (!empty($parametros['numeropropiedad'])) {
            $complemento .= 'and pro.pro_idepropieda=:numeropropiedad  ';
        }
        if (!empty($parametros['codigoanterior'])) {
            $complemento .= 'and dsus.dsus_pcodigo=:codigoanterior ';
        }
        if (!empty($parametros['codigosmunicipios'])) {
            $complemento .= 'and pro.uni_municipio in (:codigosmunicipios) ';
        }
        if (!empty($parametros['idmunicipio'])) {
            $complemento .= 'and pro.uni_municipio=:idmunicipio';
        }
        // Adicionar lmrubio fecha: 2015/09/04 para filtrar por codigo de Suscriptor
        if (!empty($parametros['idsuscriptor'])) {
            $complemento .= 'and sus.sus_ideregistro=:idsuscriptor';
        }
        if (!empty($parametros['idfactura'])) {
            $complemento .= ' and fac.fac_ideregistro = :idfactura ';
        }
//        print_r($complemento); 
        $parametros['idusuario'] = $idusuario;
        $sql = 'SELECT DISTINCT
                 ter.ter_documento documentotercero,ter.ter_ideregistro idtercero,ter.uni_tiptercero idtipotercero,
                 unitip.uni_codigo1 codtipotercero, unitip.uni_nombre2 tipotercero,
                 ter.ter_nomcompleto nombretercero,dsus.dsus_ideregistr idsuscripcion,
                 dsus.dsus_pcodigo codigoanterior,pro.pro_direccion direccion,
                 pro.pro_idepropieda numeropropiedad,pro.pro_descripcion descripcionpropiedad,
                 ter.ter_documento cedula,pro.pro_numcatastral numerocatastral,
                 rut.rut_nombre ruta,rut.rut_ideregistro idruta, dsus.dsus_estado estadosuscripcion,
                 cnre.cnre_ideregistr idconvenio,cnre.cnre_nombre convenio,
                 dsus.pro_catestrato estrato,dsus.uni_tipsuscripc idtiposuscripcion,
                 dsus.sus_ideregistro idsuscriptor,dsus.uni_tipusosuscr idtipousosuscripcion,
                 dsus.dsus_descripcion tiposuscripcion,ter.ter_telfijo telefonofijo,
                 ter.ter_telcelular telefonocelular,barrio.barrio_nom barrio,
                 ter.ter_correo correo,municipio.proyecto_nom municipio,
                 dsus.emp_ideregistro idempresa,ciu.ciudad_nom lugarexpedicion,
                 dsus.uni_municipio idmunicipio, dsus.uni_liquidacion idliquidacion,
                 dsus.uni_barrio idbarrio,uni.uni_nombre1 tipousosuscripcion,
                 dsus.dsus_iniestado fechainicioestado, dsus.dsus_finestado fechafinestado,
                 dsus.uni_actsuscripc idactividadeconomica, uniact.uni_nombre1 actividadeconomica,
                 liq.liq_nombre liquidacion,dsus.cic_ideregistro idciclo,dsus.pro_ideregistro idpropied,
		 rusu.rusu_rutsecuen  idsecuencia
                FROM
                 dsus_detsuscrip dsus
                 INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro = pro.pro_ideregistro
                 INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
                 INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro = dsus.sus_ideregistro
                 INNER JOIN cnre_cnvrecaudo cnre ON sus.cnre_ideregistr = cnre.cnre_ideregistr
                 INNER JOIN barrios barrio on barrio.barrio_ideregistro = pro.uni_barrio
                 INNER JOIN proyectos municipio on municipio.proyecto_ideregistro = pro.uni_municipio
                 INNER JOIN uni_unidad uni on uni.uni_ideregistro=dsus.uni_tipusosuscr
                 INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion=dsus.uni_liquidacion
                 LEFT JOIN rusu_rutsuscrip rusu ON dsus.dsus_ideregistr = rusu.dsus_ideregistr
                 LEFT JOIN rut_ruta rut ON rut.rut_ideregistro = rusu.rut_ideregistro
                 LEFT JOIN ciudades ciu on ter.ciudad_cod = ciu.ciudad_cod
                 LEFT JOIN uni_unidad uniact on dsus.uni_actsuscripc = uniact.uni_ideregistro
                 LEFT JOIN uni_unidad unitip on ter.uni_tiptercero = unitip.uni_ideregistro
                 LEFT JOIN fac_factura fac ON fac.dsus_ideregistr = dsus.dsus_ideregistr
                where
                    pro.uni_municipio in (select distinct uspr.uni_municipio from uspr_usuprgpryto uspr where uspr.usu_ideregistro=:idusuario) ' . $complemento . '

                   limit 1000';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error, no se encontró la suscripción', 0);
        }
        return $resultado;
    }

    /**
     * Permite obtener los documentos por perfil
     * @autor Sergio Vargas
     * @param int $idPrograma identificador del programa
     * @param int $idUsuario identificador del usuario
     * @param int $idEmpresa identificador de la empresa
     * @return Array listado de dopcumentos
     */
    public function getDocumentoPerfil($idPrograma, $idUsuario, $idEmpresa, $idTipoDocumento = null) {
        $complemento = '';
        if (!empty($idTipoDocumento)) {
            $complemento .= " and doti.uni_tipdocument= $idTipoDocumento";
        }

        $parametros["idprograma"] = $idPrograma;
        $parametros["idusuario"] = $idUsuario;
        $parametros["idempresa"] = $idEmpresa;
        $parametros["idclase"] = CLA_DOCUMENTO;
        $sql = "SELECT DISTINCT
                        doc.uni_documento iddocumento,
                        uni.uni_nombre1 documento,
                        doc.doc_contabiliza causacioncontable,
                        doc.doc_consigna consignacion,
                        doc.doc_recaudo recaudo
                FROM
                        doc_documento doc
                INNER JOIN doti_doctipo doti ON doti.uni_documento = doc.uni_documento
                INNER JOIN uni_unidad uni ON doc.uni_documento = uni.uni_ideregistro
                INNER JOIN est_estructura est ON est.est_ideregistro = uni.est_ideregistro
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = est.est_ideregistro
                INNER JOIN prun_prgunidad prun ON doc.uni_documento = prun.uni_ideregistro
                INNER JOIN uspu_usuprgunid uspu ON prun.prun_ideregistr = uspu.prun_ideregistr
                WHERE
                doc.doc_tipo not in('AN', 'PA', 'AB', 'PC') AND prun.prg_ideregistro = :idprograma AND  est.cla_ideregistro =:idclase  AND  uspu.usu_ideregistro = :idusuario  AND esem.emp_ideregistro = :idempresa " . $complemento;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Permite obtener los tipos de documentos por perfil
     * @autor Sergio Vargas
     * @param int $idprograma identificador del programa
     * @param int $idusuario identificador del usuario
     * @param int $idempresa identificador de la empresa
     * @return Array listado de dopcumentos
     */
    public function getTipoDocumentoPerfil($idprograma, $idusuario, $idempresa, $iddocumento = null, $condicion = null) {
        $complemento = '';
        if (!empty($iddocumento)) {
            $complemento .= " and doti.uni_documento=$iddocumento ";
        }
        if (!empty($condicion)) {
            $complemento .= " and $condicion";
        }
        $parametros["idprograma"] = $idprograma;
        $parametros["idusuario"] = $idusuario;
        $parametros["idempresa"] = $idempresa;
        $sql = "SELECT DISTINCT
                 doti.uni_tipdocument idtipodocumento,
                 uni.uni_nombre1 tipodocumento
                FROM doc_documento doc
                    INNER JOIN doti_doctipo doti ON doti.uni_documento = doc.uni_documento
                    INNER JOIN tido_tipdocumen tido ON tido.uni_tipdocument = doti.uni_tipdocument
                    INNER JOIN uni_unidad uni ON tido.uni_tipdocument = uni.uni_ideregistro
                    INNER JOIN esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro
                    INNER JOIN prun_prgunidad prun ON doti.uni_tipdocument = prun.uni_ideregistro
                    INNER JOIN uspu_usuprgunid uspu ON prun.prun_ideregistr = uspu.prun_ideregistr
                WHERE
                 prun.prg_ideregistro = :idprograma
                 AND uspu.usu_ideregistro = :idusuario
                 AND esem.emp_ideregistro = :idempresa " . $complemento;
        $respuesta = $this->executeQuery($sql, $parametros);
        return $respuesta;
    }

    public function getLiquidaciones($idTipoDocumento, $idDocumento = null) {
        $parametros['idtipodocumento'] = $idTipoDocumento;
        $complemento = '';
        if (!empty($idDocumento)) {
            $complemento .= ' and liq.uni_documento=:iddocumento';
        }
        $sql = 'select liq.uni_liquidacion idliquidacion, liq.liq_nombre liquidacion
                from liq_liquidacion liq
                where liq.uni_tipdocument=:idtipodocumento ' . $complemento;
        return $this->executeQuery($sql, $parametros);
    }

    public function getTerceroInfo($idTercero) {
        $parametros['idtercero'] = $idTercero;
        $sql = 'select ter.ter_ideregistro idtercero,ter.ter_documento cedula, 
                  ter.ter_nombre nombre,ter.ter_apellido apellido, 
                  ter.ter_nomcompleto nombretercero, ter.ter_sexo sexo,
                  ciu.ciudad_nom lugarexpedicion,
                  ter.ter_telcelular celular,ter.ter_telfijo telefono,ter.ter_telfijo telefonofijo,ter.est_tiptercero idestructuratercero,
                  ter.uni_tiptercero idtipotercero, ter.ter_correo correo,ter.usu_ideregistro idusuariocrea,
                  uni.uni_nombre1 tipotercero, est.est_nombre estructuratercero
                from ter_tercero  ter inner join uni_unidad uni on ter.uni_tiptercero=uni.uni_ideregistro
                 LEFT JOIN ciudades ciu on ter.ciudad_cod = ciu.ciudad_cod
                  inner join est_estructura est on ter.est_tiptercero=est.est_ideregistro
                where ter.ter_ideregistro=:idtercero';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró el tercero');
        }
        return $resultado[0];
    }

    public function getInfoSesion($idAcceso) {
        $parametros['idacceso'] = $idAcceso;
        $sql = 'select acc.acc_ideregistro idacceso,
                acc.usu_ideregistro idusuario,
                usu.usuario_nit cedula,
                usu.usuario_nom usuario,
                acc.emp_ideregistro idempresa,
                emp.empresa_nom empresa,
                acc.pfi_ideregistro idperfil
              from  acc_acceso acc  inner join usuarios usu on  acc.usu_ideregistro=usu.usu_ideregistro
                inner join empresas emp on acc.emp_ideregistro=emp.empresa_sevemp
              where acc.acc_ideregistro=:idacceso';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró información de la sesión', -2);
        }
        return $resultado[0];
    }

    public function getEmpresaNombre($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = 'select empresa_nom empresa from empresas emp where emp.empresa_sevemp=:idempresa';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('La empresa no existe');
        }
        return $resultado[0]['empresa'];
    }

    /**
     * Consulta toda la información del encabezado del recaudo.
     * @param int $idRecaudo identificador del recaudo
     * @throws MyException Error si no se encuentra el recaudo.
     */
    public function getRecaudoInfo($idRecaudo) {
        $parametros['idrecaudo'] = $idRecaudo;
        $sql = 'select rec.rec_ideregistro idrecaudo, rec.rec_fecha fecha, 
                  rec.rec_estado estado,rec.rec_fecaplicado fechaaplicado,
                  rec.rec_vlrpagado valorpagado, rec.rec_vlrcambio valorcambio,
                  rec.rec_vlrajuste valorajuste, rec.rec_vlrreal valorreal,rec.uni_medpago idmediopago,uni.uni_nombre1 mediopago,
                  rec.cnre_ideregistr idconvenio, cnre.cnre_nombre convenio,
                  rec.emp_ideregistro idempresa, emp.empresa_nom empresa,
                  rec.sus_ideregistro idsuscriptor,ter.ter_ideregistro idtercero, ter.ter_nomcompleto nombre,
                  rec.uni_documento iddocumento,doc.doc_nombre documento,
                  rec.rec_ideorigen idrecaudoorigen,rec.rec_idepadre idrecaudopadre,
                  rec.rec_fecpago fechapago,rec.uni_municipio idsucursal, pro.proyecto_nom sucursal,
                  rec.csg_ideregistro idconsignacion, rec.usu_ideregistro idusuario, usu.usuario_nom usuario
                from rec_recaudo rec  inner join usuarios usu on usu.usu_ideregistro=rec.usu_ideregistro
                  inner join proyectos pro on pro.proyecto_ideregistro=rec.uni_municipio
                  inner join uni_unidad uni on uni.uni_ideregistro=rec.uni_medpago
                  inner join cnre_cnvrecaudo cnre on rec.cnre_ideregistr=cnre.cnre_ideregistr
                  inner join ter_tercero ter on rec.ter_ideregistro=ter.ter_ideregistro
                  inner join empresas emp on emp.empresa_sevemp=rec.emp_ideregistro
                  inner join doc_documento doc on rec.uni_documento=doc.uni_documento
                where rec.rec_ideregistro=:idrecaudo';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró el recaudo ' . $idRecaudo, 0);
        }
        return $resultado[0];
    }

    public function getDistribucionRecaudoInfo($idRecaudo) {
        $parametros['idrecaudo'] = $idRecaudo;
        $sql = 'select  dsus.dsus_ideregistr idsuscripcion,dsus.dsus_pcodigo codigoanterior,
                 dire.dire_vlrrecaudo valorrecaudo,dire.emp_ideregistro idempresa,
                 emp.empresa_nom empresa
                from dire_disrecaudo dire inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=dire.dsus_ideregistr
                 inner join empresas emp on  emp.empresa_sevemp=dire.emp_ideregistro
                where dire.rec_ideregistro=:idrecaudo order by dire.emp_ideregistro desc';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error el recaudo no tiene distribución ' . $idRecaudo, -1);
        }
        return $resultado;
    }

    /**
     * Consulta la información de municipios disponibles segun el id del usuario logueado en la 
     * aplicacion y el id de la empresa a la que pertenece, ademas de coincidir con el contenido
     * digitado en el campo de texto
     * @param string $municipio texto del municipio digitado
     * @param int $idempresa id de la empresa del usuario en sesión
     * @param int $idusuario id del usuario en sesión
     * @param int $idPrograma id del programa en ejecucion
     * @return Array lista de municipios que coinciden con el parametro de busqueda
     */
    public function consultarMunicipios($municipio, $idempresa, $idusuario, $idPrograma) {
        $parametros["idempresa"] = $idempresa;
        $parametros["idusuario"] = $idusuario;
        $parametros["municipio"] = "%" . strtoupper($municipio) . "%";
        $parametros["idprograma"] = $idPrograma;
        $sql = "SELECT
                    pry.proyecto_ideregistro idmunicipio, pry.proyecto_nom municipio
                FROM
                    proyectos pry
                INNER JOIN empresas emp ON emp.empresa_cod = pry.proyecto_codemp
                INNER JOIN uspr_usuprgpryto uspr ON uspr.uni_municipio = pry.proyecto_ideregistro
                WHERE
                emp.empresa_sevemp = :idempresa
                AND uspr.usu_ideregistro = :idusuario
                AND uspr.prg_ideregistro = :idprograma
                AND upper(pry.proyecto_nom) LIKE :municipio order by pry.proyecto_nom   LIMIT 100  ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function consultarCiclosActivosPrograma($programa, $idEmpresa) {
        $parametros = array();
        $parametros['idprograma'] = $programa;
        $parametros['idempresa'] = $idEmpresa;
        $sql = " SELECT  cic.cic_ideregistro idciclo,cic.cic_nombre ciclo
                FROM 
                cic_ciclo cic 
                  inner join ciem_cicempresa ciem on ciem.cic_ideregistro=cic.cic_ideregistro 
                  inner join cipr_cicprograma cipr on cipr.cic_ideregistro=cic.cic_ideregistro
                where
                  cic_estado = 'A' and ciem.emp_ideregistro= :idempresa and cipr.prg_ideregistro= :idprograma  
                order by
                  cic.cic_nombre ";
        $resultado = $this->executeQuery($sql, $parametros);
        
        return $resultado;
    }

    public function consultarArchivos($parametros) {
//        $complemento = "'" . $parametros['rutapublicacion'] . "' as " . ' rutaweb ';
        $complemento = '';
        $sql = " SELECT carc_nombre nombre,carc_urlarchivo url ,carc_parametros parametros ,carc_fecha fecha 
                     $complemento 
                  FROM 
                   carc_ctrarchivo  
                  WHERE emp_ideregistro = :empresa AND usu_ideregistro = :usuario AND prg_ideregistro = :programa
                    ORDER BY carc_ideregistr DESC  limit 100 ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function getSuscripcionCodigoAnterior($codigoAnterior) {
        $sql = "select dsus_ideregistr idsuscripcion from dsus_detsuscrip where dsus_pcodigo='$codigoAnterior'";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('Error no se encontró la suscripción', -1);
        }
        return $resultado[0]['idsuscripcion'];
    }

    /**
     * permite cargar las estructuras por identificador
     * @param int $codigoEstructura tipo de estructura
     * @return type
     */
    public function obtenerEstructurasPorCodigoModel($codigoEstructura) {
        $sql = "SELECT DISTINCT
                        uni.uni_ideregistro idunidad,
                        uni_nombre1 nombre
                FROM
                        uni_unidad uni
                WHERE
                        uni.est_ideregistro =  $codigoEstructura";

        return $this->executeQuery($sql);
    }

    public function obtenerListaPorClase($idclase, $idempresa) {
        $sql = "SELECT
                uni.uni_ideregistro idunidad,
                uni.uni_nombre1 nombre
                FROM
                        est_estructura est
                INNER JOIN esem_estempresa esem ON est.est_ideregistro = esem.est_ideregistro
                INNER JOIN cla_clase cla ON est.cla_ideregistro = cla.cla_ideregistro
                INNER JOIN uni_unidad uni ON est.est_ideregistro = uni.est_ideregistro
                WHERE est.cla_ideregistro=$idclase AND esem.emp_ideregistro=$idempresa;";

        return $this->executeQuery($sql);
    }
    public function obtenerListaPorClaseDestino($idclase, $idempresa) {
        $sql = "SELECT
                uni.uni_ideregistro idunidad,
                uni.uni_nombre1 nombre
                FROM
                        est_estructura est
                INNER JOIN esem_estempresa esem ON est.est_ideregistro = esem.est_ideregistro
                INNER JOIN cla_clase cla ON est.cla_ideregistro = cla.cla_ideregistro
                INNER JOIN uni_unidad uni ON est.est_ideregistro = uni.est_ideregistro
                WHERE est.cla_ideregistro=$idclase AND esem.emp_ideregistro=$idempresa  and uni.uni_codigo5 = '1';";

        return $this->executeQuery($sql);
    }

    /**
     * permite obtener el listado de los departamentos
     * @return Array listado departamentos
     */
    public function obtenerDepartamentos($pais) {

        $sql = "SELECT
                        departamento_cod coddepartamento,
                        departamento_ideregistro iddepartamento,
                        departamento_nom nombre
                FROM
                        departamentos
                WHERE
                        departamento_codpai = '$pais'";

        return $this->executeQuery($sql);
    }

    /**
     * permite obtener el listado de los departamentos
     * @return Array listado departamentos
     */
    public function obtenerPaises() {

        $sql = "SELECT
                        pais_cod idpais,
                        pais_nom nombre
                FROM
                        paises";

        return $this->executeQuery($sql);
    }

    /**
     * permite obtener el listado de los departamentos
     * @return Array listado departamentos
     */
    public function obtenerCiudades($iddepartamento) {

        $sql = "SELECT
                ciudad_cod idciudad,
                ciudad_nom nombre
                FROM
                        ciudades
                where  
                ciudad_coddep = '$iddepartamento'";

        return $this->executeQuery($sql);
    }

    public function getInfoConceptos($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT
                  uni_concepto idconcepto,
                  con_metajuste metodo,
                  con_precision as precision
                FROM
                 con_concepto con INNER JOIN esem_estempresa esem ON con.est_concepto=esem.est_ideregistro
                WHERE esem.emp_ideregistro=:idempresa";

        $respuesta = $this->executeQuery($sql, $parametros);
        return $respuesta;
    }

    /**
     * Obtiene el siguiente numero disponible según parámetros
     * @param int $idempresa identificador de la empresa
     * @param int $idtipodocumento identificador del tipo de documento
     * @param string $tipodocumento Clasificación del cocumento
     * @return array Numero documento
     */
    public function obtenerNumeroDocumento($idempresa, $idtipodocumento, $tipodocumento) {
        $parametros['idempresa'] = $idempresa;
        $parametros['tipodocumento'] = $tipodocumento;
        $parametros['idtipodocumento'] = $idtipodocumento;
        $sql = "SELECT
                        nudo.nudo_ideregistro idnumero,
                        (fn_nudo_retornaconsecutivo(:idempresa,nudo.nudo_ideregistro)) numero,  
                        nudo.nudo_aplicafelectronica aplicafele 
		FROM        doti_doctipo doti 
		INNER JOIN  donu_dotinumdocumento donu ON donu.doti_ideregistr = doti.doti_ideregistr 
    			AND     donu.donu_tipo =:tipodocumento 
		INNER JOIN  nudo_numdocumen nudo ON nudo.nudo_ideregistro = donu.nudo_ideregistro 
                        AND     nudo.nudo_estado = 'A' 
                        AND     nudo.emp_ideregistro =:idempresa 
		WHERE       doti.uni_documento = 923 
    			AND     doti.uni_tipdocument =:idtipodocumento";
        $resultado = $this->executeQuery($sql, $parametros);
        if (!empty($resultado)) {
            return $resultado[0];
        }
        throw new MyException('No se encontró número de financiación', 0);
    }

    public function getConceptosLiquidacion($idLiquidacion) {
        $parametros['idliquidacion'] = $idLiquidacion;
        $sql = 'select coli.uni_concepto idconcepto, con.con_preliquidar preliquidar ,
                     con.con_asdeshabitado deshabitado , 
                     con.con_aspuertapuerta puertapuerta , 
                     con.con_astarplena  tarifaplena,
                     con.con_ashomolacion homologacion , 
                     con.con_asaforado aforado , 
                     con.con_asaplicadinc aplicadinc, 
                     con.con_asaforater aforadotercero 
                from coli_conliquida coli inner join con_concepto con on coli.uni_concepto=con.uni_concepto
                where coli.uni_liquidacion=:idliquidacion AND (
                                CASE
                                WHEN con.con_finvigencia IS NULL THEN
                                        con.con_finvigencia IS NULL
                                ELSE
                                        con.con_finvigencia >= now() :: DATE
                                END
                        ) ';
        return $this->executeQuery($sql, $parametros);
    }

    public function getLiquidacionID($idLiquidacion) {
        $parametros['idliquidacion'] = $idLiquidacion;
        $sql = "select distinct :idliquidacion idliquidacion, liq.uni_tipdocument idtipodocumento, liq.uni_documento iddocumento,
                cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq.liq_diasuspens,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as date) fechasuspension ,
                cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq.liq_diavencim,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as date) fechavencimiento
                from   liq_liquidacion liq 
                where  liq.uni_liquidacion=:idliquidacion";
        return $this->executeQuery($sql, $parametros);
    }

    public function getInformacionUnidadPorClase($idClase, $idEmpresa, $idPrograma, $idUsuario) {
        $parametros['idclase'] = $idClase;
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idprograma'] = $idPrograma;
        $parametros['idusuario'] = $idUsuario;

        $sql = 'SELECT
                        uni.uni_ideregistro idunidad,
                        uni.uni_nombre1 nombre
                FROM
                        est_estructura est
                INNER JOIN esem_estempresa esem ON est.est_ideregistro = esem.est_ideregistro
                INNER JOIN cla_clase cla ON est.cla_ideregistro = cla.cla_ideregistro
                INNER JOIN uni_unidad uni ON est.est_ideregistro = uni.est_ideregistro
                INNER JOIN prun_prgunidad prun ON uni.uni_ideregistro = prun.uni_ideregistro
                INNER JOIN uspu_usuprgunid uspu ON uspu.prun_ideregistr=prun.prun_ideregistr
                WHERE
                  est.cla_ideregistro =:idclase
                  AND esem.emp_ideregistro =:idempresa
                  AND prun.prg_ideregistro =:idprograma
                  AND uspu.usu_ideregistro =:idusuario
                ORDER BY
                        uni.uni_nombre1';


        return $this->executeQuery($sql, $parametros);
    }

    public function getConceptosConSaldo($idFactura) {
        $parametros['idfactura'] = $idFactura;
        $complemento = 'WHERE dfac.dfac_sdoreal>0 and fac.fac_ideregistro=:idfactura  ';
        return $this->getConceptosInformacion($complemento, $parametros);
    }

    public function getCicloPeriodoPcodigo($idSuscripcion) {
        $resultado = $this->getCicloPeriodoCodigoAnterios($idSuscripcion);
        if (empty($resultado)) {
            throw new MyException('No se encontró el ciclo y periodo para la suscripción ' . $idSuscripcion, -1);
        }
        $datos['idCiclo'] = $resultado[0]['idciclo'];
        $datos['idciclo'] = $resultado[0]['idciclo'];
        $datos['ciclo'] = $resultado[0]['ciclo'];
        $datos['idPeriodo'] = $resultado[0]['idperiodo'];
        $datos['idperiodo'] = $resultado[0]['idperiodo'];
        $datos['periodo'] = $resultado[0]['periodo'];
        $datos['cicloanio'] = $resultado[0]['cicloanio'];
        $datos['orden'] = $resultado[0]['orden'];
        $datos['fechavencimiento'] = $resultado[0]['fechavencimiento'];
        $datos['fechasuspension'] = $resultado[0]['fechasuspension'];
        return $datos;
    }

    public function getCicloPeriodoCodigoAnterios($pcodigo) {
        $parametros['pcodigo'] = $pcodigo;
        $sql = "SELECT
                    cic.cic_ideregistro idciclo,
                    cic.cic_nombre ciclo,
                    per.per_ideregistro idperiodo,
                    per.per_nombre periodo,
                    cic.cic_anoactual cicloanio,
                    per.per_fecvence fechavencimiento,
                    per.per_fecsuspens fechasuspension,
                    per.per_ideorden orden
                FROM
                    cic_ciclo cic inner join per_periodo per on per.cic_ideregistro = cic.cic_ideregistro
		    inner join dsus_detsuscrip dsus on cic.cic_ideregistro=dsus.cic_ideregistro
                WHERE
                    per.per_estado = 'A' and
                    dsus.dsus_pcodigo = :pcodigo";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error al consultar el ciclo ', -1);
        }
        return $resultado;
    }

    public function actualizarSaldoNotas($idFactura, $version) {
        $sql = "UPDATE fac_factura
              SET fac_sdoreal = (SELECT sum(dfac.dfac_sdoreal) FROM dfac_detfactura dfac  where dfac.fac_ideregistro=$idFactura),
               fac_vlrreal = (SELECT sum(dfac.dfac_vlrreal) FROM dfac_detfactura dfac  where dfac.fac_ideregistro=$idFactura)
              WHERE fac_ideregistro=$idFactura and fac_version = $version ";
        $this->setSql($sql);
        return $this->executeUpdate();
    }

    public function periodoAnterior($idCiclo) {
        $parametros['idciclo'] = $idCiclo;
        $sql = "SELECT
                        per1.per_ideregistro idperiodo,
                        per1.per_nombre periodo
                FROM
                        per_periodo per1
                WHERE
                        per1.per_ideregistro < (
                                SELECT
                                        per2.per_ideregistro
                                FROM
                                        per_periodo per2
                                WHERE
                                        per2.per_estado = 'A'
                                AND per2.cic_ideregistro = :idciclo
                        )
                AND per1.cic_ideregistro = :idciclo
                ORDER BY
                        per1.per_ideregistro DESC
                LIMIT 1";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error el ciclo no tiene parametrizado el periodo anterior', -1);
        }
        return $resultado[0];
    }

    public function getFechasRuta($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = " SELECT
                  rupe.rupe_fecvence fechavencimiento,
                  rupe.rupe_fecsuspens fechasuspension
                FROM
                  rupe_rutperiodo rupe INNER JOIN rusu_rutsuscrip rusu ON rupe.rut_ideregistro=rusu.rut_ideregistro
                  INNER JOIN per_periodo per ON per.per_ideregistro=rupe.per_ideregistro
                WHERE
                  rusu.dsus_ideregistr=:idsuscripcion AND rupe.rupe_estado='A' AND per.per_estado='A'";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return;
        }
        return $resultado[0];
    }

    public function getFechasRutaPeriodo($idSuscripcion, $idPeriodo) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = " SELECT
                  rupe.rupe_fecvence fechavencimiento,
                  rupe.rupe_fecsuspens fechasuspension
                FROM
                  rupe_rutperiodo rupe INNER JOIN rusu_rutsuscrip rusu ON rupe.rut_ideregistro=rusu.rut_ideregistro
                  INNER JOIN per_periodo per ON per.per_ideregistro=rupe.per_ideregistro
                WHERE
                  rusu.dsus_ideregistr=:idsuscripcion AND per.per_ideregistro=$idPeriodo";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return;
        }
        return $resultado[0];
    }

    public function getLiquidacionSuscripcion($idLiquidacion) {
        $sql = "select liq.uni_liquidacion idliquidacion, liq.uni_tipdocument idtipodocumento, liq.uni_documento iddocumento,
                cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq.liq_diasuspens,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as date) fechasuspension ,
                cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq.liq_diavencim,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as date) fechavencimiento
                from  liq_liquidacion liq 
                where liq.uni_liquidacion=$idLiquidacion ";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('No se encontró la liquidación', -1);
        }
        return $resultado[0];
    }

    public function getCicloPeridoAnterior($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = " 
                SELECT
                  cic.cic_ideregistro idciclo,
                  cic.cic_nombre      ciclo,
                  per.per_ideregistro idperiodo,
                  per.per_nombre      periodo,
                  cic.cic_anoactual   cicloanio,
                  per.per_fecvence    fechavencimiento,
                  per.per_fecsuspens  fechasuspension,
                  per.per_ideorden    orden
                FROM per_periodo per
                  INNER JOIN cic_ciclo cic ON per.cic_ideregistro = cic.cic_ideregistro
                WHERE per.per_ideregistro < (SELECT per2.per_ideregistro
                                             FROM per_periodo per2 INNER JOIN dsus_detsuscrip dsus
                                                 ON dsus.cic_ideregistro = per2.cic_ideregistro
                                             WHERE per2.per_estado = 'A'
                                                   AND dsus.dsus_ideregistr = :idsuscripcion)
                 AND  per.cic_ideregistro = (SELECT dsuscic.cic_ideregistro
                                             FROM  dsus_detsuscrip dsuscic                                                 
                                             WHERE  dsuscic.dsus_ideregistr = :idsuscripcion)
                ORDER BY per.per_ideregistro DESC
                LIMIT 1;";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error, no se encontró el periodo anterior', -1);
        }
        return $resultado[0];
    }

    public function consultarPeriodoSiguiente($parametros) {
        $complemento = " per2.per_ideregistro = :idperiodo ";
        if (empty($parametros['idperiodo'])) {
            $complemento = " per2.per_estado ='A' ";
        }


        $sql = "SELECT
                    per.per_ideregistro idperiodo ,DATE_PART('YEAR',per.per_fecinicial)::smallint idanio
                FROM
                    per_periodo per
                WHERE
                    per.per_ideorden IN (
                        SELECT
                             (CASE
                               WHEN  per2.per_ideorden = (select max(per_ideorden) 
                                                          from per_periodo 
                                                          where cic_ideregistro =:idciclo ) THEN 1
                              ELSE
                                 per2.per_ideorden  + 1
                              END
                             )
                            
                        FROM
                            per_periodo per2
                        WHERE
                            $complemento 
                        AND per2.cic_ideregistro = :idciclo order by per2.per_fecinicial desc limit 1
                    )
                AND per.cic_ideregistro = :idciclo AND per.per_estado ='B' order by per.per_fecinicial limit 1";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new Exception("Error no se encontro ciclo periodo año siguiente", - 1);
        }
        return $resultado[0];
    }

    public function consultaInfoSuscripciones($idempresa, $condicion) {

        if (empty($condicion) || empty($idempresa)) {
            throw new Exception("Error: No hay condiciones para procesar la Consulta  ", - 1);
        }
        $condicion = ' AND  ' . $condicion;
        $parametros['idempresa'] = $idempresa;
        $sql = "select  dsus.dsus_pcodigo pcodigo ,
                        ter.ter_documento as documento ,
                        ter.ter_nombre nombre ,
                        ter.ter_apellido apellido,
                        ter.ter_nomcompleto nombrecompleto ,
                        substring(proy.proyecto_codciu,1,2) departamento,
                        substring(proy.proyecto_codciu,3,10) municipio,
                        pro.pro_direccion direccion, COALESCE(ter.ter_correo,'0') mail,
                        (CASE  when ter.ter_telcelular is not null then ter.ter_telcelular
                              when ter.ter_telfijo is not null then ter.ter_telfijo else '0' end  ) telefono
                    from dsus_detsuscrip dsus
                       inner join  pro_propiedad pro on pro.pro_ideregistro = dsus.pro_ideregistro
                       inner join  ter_tercero ter on ter.ter_ideregistro = dsus.ter_ideregistro
                       inner join proyectos proy on proy.proyecto_ideregistro = dsus.uni_municipio
                    where
                       dsus.emp_ideregistro = :idempresa $condicion ";

        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function consultarParametroSincronizaSeven($idempresa) {

        $parametros['idempresa'] = $idempresa;

        $sql = "select json_extract_path_text(jsonfinal.datos,'par_valor') valor  FROM
	               (SELECT  json_array_elements(sincronizaTercero.parametro) as datos FROM 
	                      (SELECT json_extract_path_text(datos.par_parametro,'SINCRONIZA_TERCERO_SEVEN')::json parametro FROM par_parametro as datos
	                              WHERE emp_ideregistro = :idempresa ) as sincronizaTercero ) as jsonfinal";

        $resultado = $this->executeQuery($sql, $parametros);
        return ($resultado);
    }

    public function consultaRegistrosFesPendientes($idempresa) {
        $parametros['idempresa'] = $idempresa ;
        $sql = " SELECT
                    fac.cic_ideregistro,  cic.cic_nombre,
                    count(*)                                          facturaspendientes,
                    max(aprobacion) fechaultimaaprobacion,
                    max(lectura)  fechaultimalectura
                  FROM fac_factura fac
                    INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = fac.cic_ideregistro
                    INNER JOIN
                      (
                        SELECT emp_ideregistro, cic_ideregistro, max(fac_fecaprobada) aprobacion,max(fac_fecha) lectura
                     FROM fac_factura
                     WHERE
                      emp_ideregistro = :idempresa
                     and uni_documento = 24 group by emp_ideregistro,cic_ideregistro
                      ) as facturas on facturas.cic_ideregistro = fac.cic_ideregistro
                           and facturas.emp_ideregistro = fac.emp_ideregistro
                  WHERE fac.fac_estado = 'G' AND fac.emp_ideregistro = :idempresa
                  GROUP BY fac.cic_ideregistro, cic.cic_nombre ";
        $resultado = $this->executeQuery($sql,$parametros );
        return $resultado;
    }
    
    public function actualizaEstadoXdiasConstructoraDsus($idempresa){
        $sql="select * from fn_actualiza_estado_xdias_constructora_dsus($idempresa)";
       return $this->executeQuery($sql);
        
    }
    
    public function getCicloPeriodoAnterior($idCiclo) {
        $parametros['idciclo'] = $idCiclo;
        $sql = "SELECT
                    
                    perant.per_ideregistro idperiodo,
                    perant.per_nombre periodo
                FROM
                    cic_ciclo cic inner join per_periodo per on per.cic_ideregistro = cic.cic_ideregistro
                    inner join per_periodo perant on perant.per_ideregistro < per.per_ideregistro and perant.cic_ideregistro = per.cic_ideregistro
		    inner join dsus_detsuscrip dsus on cic.cic_ideregistro=dsus.cic_ideregistro
                WHERE
                    per.per_estado = 'A' and
                    cic.cic_ideregistro = :idciclo  order by perant.per_ideregistro desc limit 1";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error al consultar el ciclo ', -1);
        }
       
        $datos['idperiodo'] = $resultado[0]['idperiodo'];
        $datos['periodo'] = $resultado[0]['periodo'];
        return $resultado;
    }
    
     public function consultarCiclosActivoGeneral($idCiclo) {
        $parametros = array();
        $parametros['idciclo'] = $idCiclo;
        $sql = " SELECT  cic.cic_ideregistro idciclo,cic.cic_nombre ciclo
                FROM 
                cic_ciclo cic 
                 
                where
                  cic_estado = 'A' and cic.cic_ideregistro= :idciclo 
                order by
                  cic.cic_nombre ";
        $resultado = $this->executeQuery($sql, $parametros);
        
        return $resultado;
    }
    
    public function getCiclosActivosMovimientoContablePrograma($idEmpresa, $idPrograma) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idprograma'] = $idPrograma;
        $sql = " select DISTINCT
                    cic.cic_ideregistro idciclo,
                    cic.cic_nombre ciclo
               from cic_ciclo cic inner join  ciem_cicempresa ciem on ciem.cic_ideregistro=cic.cic_ideregistro
                    inner join cipr_cicprograma cipr on cipr.cic_ideregistro=cic.cic_ideregistro
                    INNER JOIN mvi_movimiento mvi on mvi.cic_ideregistro=cipr.cic_ideregistro
               where cic_estado = 'A' and ciem.emp_ideregistro=:idempresa and cipr.prg_ideregistro=:idprograma and mvi.mvi_estado='G'
               ORDER BY cic.cic_nombre
                ";
        return $this->executeQuery($sql, $parametros);
    }

    public function consultarPermisosGrabar($idPrograma, $idUsuario, $idUnidad = null){
        $complemento = '';
        $parametros['idunidad'] = $idUnidad;
        if(!empty($idUnidad)){
            $complemento = '  and prun.uni_ideregistro = :idunidad';
        }
        $parametros['idusuario'] = $idUsuario;
        $parametros['idprograma'] = $idPrograma;
        $sql="select uspu.usu_ideregistro existe
                from 		prun_prgunidad  prun 
                INNER JOIN 	uspu_usuprgunid  uspu on uspu.prun_ideregistr = prun.prun_ideregistr
                where 		uspu.usu_ideregistro = :idusuario   and 	prun.prg_ideregistro = :idprograma ".$complemento;
        
        return $this->executeQuery($sql, $parametros);
    }
    
    
    
     public function getDisponibleRecaudoCalculadoDevolucion($idRecaudo, $idSuscripcion, $numeroVersion) {
        $parametros['idrecaudo'] = $idRecaudo;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['numeroversion'] = $numeroVersion;
        $sql = 'select * from getdisponiblerecaudo(:idrecaudo,:idsuscripcion,:numeroversion)';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error, el recaudo fue modificado por otro proceso ' . $idRecaudo, -1);
        }
        return $resultado;
    }
    
    public function actualizarRecaudoSaldoDevolucion($idDistribucionRecaudo, $saldoRecaudo) {
        $parametros['dire_ideregistr'] = $idDistribucionRecaudo;
        $parametros['dire_sdorecaudo'] = $saldoRecaudo;
        $sql = 'update dire_disrecaudo set dire_version=dire_version+1,dire_sdorecaudo=:dire_sdorecaudo where dire_ideregistr=:dire_ideregistr ';
        return $this->executeQuery($sql, $parametros);
    }
    
    public function actualizarRecaudoVersionDevolucion($idRecaudo, $version) {
        $parametros['rec_ideregistro'] = $idRecaudo;
        $parametros['rec_version'] = $version + 1;
        $resultado = $this->actualizar($parametros, 'rec_recaudo', "rec_ideregistro=:rec_ideregistro and rec_version=$version");
        if (empty($resultado)) {
            throw new MyException('Error el recaudo fue modificado por otro proceso y la versión no coincide');
        }
        /*
         * Se Adiciona retorno de la nueva versión actualizada para poder saber cual es la versión actual , cuando hay 
         * multiples registros en dire de la misma empresa y suscripción 
         */
        return $parametros;
    }
    
    public function verificaFechaInicioLiquidacion($idSuscripcion, $idPrograma){
        try{
            $parametros['idsuscripcion'] = $idSuscripcion;
            $parametros['idprograma'] = $idPrograma;
            $parametros['estado'] = 'A';
            $sql = "SELECT 
                    (case WHEN now()::date >= dper.dper_fecinicial::date THEN 1 else 0 end ) inicioliquidacion
                    from dsus_detsuscrip dsus
                    inner join per_periodo per on per.cic_ideregistro=dsus.cic_ideregistro
                    inner join dper_detperiodo dper on dper.per_ideregistro=per.per_ideregistro
                    where dsus.dsus_ideregistr= :idsuscripcion and per.per_estado=:estado and dper.prg_ideregistro= :idprograma";
            $resultado =  $this->executeQuery($sql, $parametros);
        }catch(\Exception $ex){
            throw new MyException("Error, no se pudo hacer validación del proceso de Liquidacion",-1);
        }
        return $resultado[0]['inicioliquidacion'];
    }
    
    public function getPeriodoSiguienteSuscripcion($idSuscripcion) {
        $resultado = $this->getPeriodoSiguiente($idSuscripcion);
        if (empty($resultado)) {
            throw new MyException('No se encontró el ciclo y periodo para la suscripción ' . $idSuscripcion, -1);
        }
        $datos['idCiclo'] = $resultado[0]['idciclo'];
        $datos['idciclo'] = $resultado[0]['idciclo'];
        $datos['ciclo'] = $resultado[0]['ciclo'];
        $datos['idPeriodo'] = $resultado[0]['idperiodo'];
        $datos['idperiodo'] = $resultado[0]['idperiodo'];
        $datos['periodo'] = $resultado[0]['periodo'];
        $datos['cicloanio'] = $resultado[0]['cicloanio'];
        $datos['orden'] = $resultado[0]['orden'];
        $datos['fechavencimiento'] = $resultado[0]['fechavencimiento'];
        $datos['fechasuspension'] = $resultado[0]['fechasuspension'];
        return $datos;
    }
    
    public function getPeriodoSiguiente($idSuscripcion){
        
        try {
            $parametros['idsuscripcion'] = $idSuscripcion;
            $sql = "SELECT	
                    cic.cic_ideregistro idciclo,
                    cic.cic_nombre ciclo,
                    persig.per_ideregistro idperiodo,
                    persig.per_nombre periodo,
                    cic.cic_anoactual cicloanio,
                    persig.per_fecvence fechavencimiento,
                    persig.per_fecsuspens fechasuspension,
                    persig.per_ideorden orden
                FROM
                    cic_ciclo cic 
                    inner join per_periodo per on per.cic_ideregistro = cic.cic_ideregistro
                    INNER JOIN per_periodo persig on persig.cic_ideregistro = cic.cic_ideregistro and persig.per_ideregistro > per.per_ideregistro
                    inner join dsus_detsuscrip dsus on cic.cic_ideregistro=dsus.cic_ideregistro
                WHERE
                    per.per_estado = 'A' and
                    dsus.dsus_ideregistr=:idsuscripcion
                limit 1";
            $resultado =  $this->executeQuery($sql, $parametros);
        } catch (\Exception $ex) {
            throw new MyException("Error, no se pudo seleccionar el Siguiente periodo", -1);
        }
        return $resultado;
    }
    
       public function consultaConexionesActivas($baseDatos) {
        $parametros['baseDatos'] = $baseDatos;
        $sql = " INSERT INTO jmeter
                    SELECT *, 
                    age(clock_timestamp(), query_start) AS age,
                    CURRENT_TIMESTAMP fecharegistro
                    FROM pg_stat_activity 
                    WHERE datname = :baseDatos
                    AND query NOT LIKE '% FROM pg_stat_activity %' 
                    ORDER BY age  ";
        $resultado = $this->executeQuery($sql,$parametros );
        return $resultado;
    } 
    
    
    public function consultaClasificacionLiquidacion($idUsuario, $idEmpresa){  
        $parametros['usuario']  = $idUsuario;
        $parametros['empresa']  = $idEmpresa;
        
        $sql = 
            "   SELECT 		uni.uni_ideregistro, 
                                uni.uni_codigo2 codigo, 
                                uni.uni_nombre1 nombre
                FROM 		uni_unidad uni 
                INNER JOIN	prun_prgunidad prun ON prun.uni_ideregistro = uni.uni_ideregistro
                        AND 	prg_ideregistro = 48 
                INNER JOIN	uspu_usuprgunid uspu ON uspu.prun_ideregistr = prun.prun_ideregistr
                        AND 	uspu.usu_ideregistro = :usuario
                INNER JOIN	esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro
                        AND 	esem.emp_ideregistro = :empresa
                INNER JOIN	est_estructura est ON est.est_ideregistro = esem.est_ideregistro
                        AND 	est.cla_ideregistro = 48 ";
        
        $resultado = $this->executeQuery($sql, $parametros);
        
        if (empty($resultado)) {
            return;
        }
        return $resultado;
    }
    
    public function eliminaPropiedadesSuscriptor(){
        $sql="select * from fn_eliminaPropiedadesSuscriptores()";
       return $this->executeQuery($sql);
        
    }
    
    
    /**
     * Consulta del arbol de cuentas SEVEN segun la empresa y el tar_codi
     * 
     * @param type $idEmpresa
     * @param type $tarCodi
     * @return type
     */
    public function getArbCuentaSeven($idEmpresa, $tarCodi){
    
        $parametros['empresa']  = $idEmpresa;
        $parametros['tarcodi']  = $tarCodi;
        
        $sql = 
            "   SELECT      cue.cue_ideregistro id, 
                            cue.cue_nombre nombre
                FROM        cue_cuenta cue 
                WHERE       cue.emp_ideregistro = :empresa 
                    AND     cue.cue_tarcodi = :tarcodi 
                    AND     cue.cue_estado = 'A' 
                ORDER BY    nombre;";
        
        $resultado = $this->executeQuery($sql, $parametros);
        
        if (empty($resultado)) {
            return;
        }
        return $resultado;
        
    }
    
    public function getDestinatariosCorreos($idEmpresa,$getParametroMail) {
        $parametros['empresa'] = $idEmpresa  ;
        $sql = "
            SELECT json_array_elements ( datos.correos :: json ) ->> 'to' AS destinatarios 
            FROM ( SELECT json_extract_path_text ( par_parametro, '".$getParametroMail."' ) AS correos 
            FROM par_parametro WHERE emp_ideregistro = :empresa ) datos  ";
        $resultado = $this->executeQuery($sql, $parametros);
        
        if (empty($resultado)) {
            return;
        }
        return $resultado;
        
    }
    
  public function getEmpresa($idEmpresa){
      $parametros['empresa'] =$idEmpresa; 
      $sql = " select empresa_nom nombre , empresa_cod nit from empresas where empresa_sevemp = :empresa " ; 
      $resultado = $this->executeQuery($sql, $parametros);
        
        if (empty($resultado)) {
            return;
        }
        return $resultado[0];     
      
  }  
  
   public function getConsecutivoDIAN($idempresa) {
        $parametros['idempresa'] = $idempresa ;
        $sql = " select nudo.nudo_prefijo prefijo, nudo.nudo_ideregistro idenudo, emp.empresa_nom empresa, nudo.emp_ideregistro idempresa, nudo.nudo_feciniresol::date fecharesoinicial,nudo.nudo_fecfinresol::date fecharesofinal, nudo.nudo_numfinal numhasta , nudo.nudo_numdisponi numdisponible
                from nudo_numdocumen nudo 
                INNER JOIN empresas emp on emp.empresa_sevemp = nudo.emp_ideregistro
                where nudo_aplicafelectronica = 'S' and nudo.emp_ideregistro = :idempresa
                and ((( 
                                select nudosuma.nudo_numfinal - nudosuma.nudo_numdisponi from nudo_numdocumen nudosuma where nudo_aplicafelectronica = 'S' and nudosuma.nudo_ideregistro = nudo.nudo_ideregistro
                 ) BETWEEN 0 and 100 ) OR 
                                (select COALESCE((((date_part('DAY',(NOW() - nudofec.nudo_fecfinresol))::integer) * 24 )  )::integer,0)/24  horaproceso 	 from nudo_numdocumen nudofec where nudofec.nudo_aplicafelectronica = 'S' and nudofec.nudo_ideregistro = nudo.nudo_ideregistro)	 BETWEEN 0 and 4 ) ";
        $resultado = $this->executeQuery($sql,$parametros );
        return $resultado;
    }
    
    public function getDestinatariosFacturaElectronica($idEmpresa, $idnudo) {
     
        $parametros['idempresa'] = $idEmpresa  ;
        $parametros['idnudo'] = $idnudo  ;
        $sql = "
            select cuentascorreo.cuentas  AS destinatarios  from donu_dotinumdocumento donu 
            INNER JOIN doti_doctipo doti on doti.doti_ideregistr = donu.doti_ideregistr
            INNER JOIN (
		select 
			json_array_elements_text((datos.valor::json->>'top_doti')::json)::INTEGER as id_doti ,  ((datos.valor)::json->>'cuentas')::json->>'mail.to' cuentas
		from 
		(SELECT  json_array_elements_text((((mv.par_parametro::JSON->>'FACTURA_ELECTRONICA')::json->>'parametros_sistema')::json->>'envio_correo')::json)  as valor  FROM par_parametro mv WHERE emp_ideregistro = :idempresa) as datos


            ) as cuentascorreo on cuentascorreo.id_doti = doti.doti_ideregistr
            where donu.nudo_ideregistro = :idnudo  and donu.donu_tipo = 'FA';  ";
        $resultado = $this->executeQuery($sql, $parametros);
        
        if (empty($resultado)) {
            return;
        }
        return $resultado;
        
    }
    /**
     * permite validar si la empresa con la que se autentico el usuario
     * requiere o tiene habilitada la funcionalidad de envio automatico
    * de correo con el estado de cuenta de la financiacion.
     * @return String que indica si si o no se habilita funcionalidad
     */
     public function consultarParametroExtractoAutomatico ($idempresa) {
       $parametros['idempresa'] = $idempresa;

        $sql = "select json_extract_path_text(jsonfinal.datos,'par_valor') valor  FROM
	               (SELECT  json_array_elements(sincronizaTercero.parametro) as datos FROM 
	                      (SELECT json_extract_path_text(datos.par_parametro,'CORREO_AUTOMATICO_EXTRACTO')::json parametro FROM par_parametro as datos
	                              WHERE emp_ideregistro = :idempresa ) as sincronizaTercero ) as jsonfinal";

        $resultado = $this->executeQuery($sql, $parametros);
        return ($resultado);
    }
    
     /**
     * Ingresa el ciclo y perido en la tabla de control 
      * de generacion y envio del extracto automatico
     * @param array $data_tcec con datos del control de proceso
     * @return int Identificador la tabla Reportes.tcec.
     */
    public function insertarTcec_ControExtrAutimatico($data_tcec) {                
        $data['cic_ideregistro'] = $data_tcec['cic_ideregistro'];
        $data['per_ideregistro'] = $data_tcec['per_ideregistro'];
        $data['tcec_fecliquidacion'] = $data_tcec['tcec_fecliquidacion'];
        $data['emp_ideregistro'] = $data_tcec['emp_ideregistro'];
        $data['usu_ideregistro'] = $data_tcec['usu_ideregistro'];
        return $this->insertar($data, 'reportes.tcec_tabcontextractocredito', "reportes.sq_tcec_ideregistr");
    }   
    
    
     /**
     * Consulta si una factura tiene conceptos que aplican para facturación electronica
      * mediante la somatoria del saldo de los conceptos
     * @param array $infoFactura Información de la factura
     * @return int sumatoria de los conceptos que aplican para facturación electronica
     * @throws MyException Error al consultar
     */
    public function sumatoriaConceptosFelec($infoFactura) {

        $sql = "SELECT sum (dfavalcpto.dfac_vlrtotal) as vlr_concep_felec
                from dfac_detfactura dfavalcpto
                    inner join codo_condocumen codovalpar on codovalpar.uni_concepto=dfavalcpto.uni_concepto 
                        and codovalpar.uni_documento=:iddocumento   
                        and codovalpar.uni_tipdocument=:idtipodocumento
                        and codovalpar.codo_aplicafelectronica='S' 
                        and codovalpar.emp_ideregistro=:idempresa 
                where dfavalcpto.fac_ideregistro = :idnuevafactura 
                    and codovalpar.codo_ideregistr::varchar in
			(select informacion.idcodo::varchar
			from  
                            (SELECT (valor1.valor)::json->>'felec_sistema' as sistema,
                                    (json_array_elements_text((valor1.valor::json->>'clasificacion')::json))::json->>'tipo_clasificacion' as tipo_clasificacion,
                                    json_array_elements_text(((json_array_elements_text((valor1.valor::json->>'clasificacion')::json))::json->>'codigo_clasificacion')::json) as idcodo
                            from 	
                            (SELECT
                                            json_array_elements_text((((mv.par_parametro::JSON->>'FACTURA_ELECTRONICA')
                                            ::json->>'parametros_sistema')::json->>'liquidacion_factura')::json)	as valor -- Modulo			  
                            FROM par_parametro mv 
                            WHERE emp_ideregistro= :idempresa 
                            ) Valor1) informacion -- selecciona empresa	 
			WHERE informacion.sistema::numeric = 2 and tipo_clasificacion='concepto'
			)";
        $resultado = $this->executeQuery($sql, $infoFactura);
        if (empty($resultado)) {
            return 0 ; 
        }
        return $resultado[0]['vlr_concep_felec'];
    }
    
        /**
     * Se actualiza datos de la factura segun los campos que se incluyan en el arreglo
     * @return void
     */
    public function actualizarFactura($factura) {
        if (empty($factura['fac_ideregistro'])){
            return;
        } 
        $this->actualizar($factura, "fac_factura", "fac_ideregistro=:fac_ideregistro");
    }   
    
    
     /**
     * Consulta si el documento y tipo de documento pertenencen a factura electronica.
     * @param array $infoFactura Información de la factura
     * @return array si pertenece a FE.
     */
    public function getDataEvaluaFacturaElectronica($infoFactura, $tipoFactura) {
        //print_r($infoFactura);
        $complemento = "  and doc.doc_tipo in ('ND','NC','NF','NR')  " ;
        if($tipoFactura == 1 ){
            $complemento = " ";
        }
        $sql = "SELECT  
                DISTINCT nudo.nudo_aplicafelectronica aplicafelec
              from doti_doctipo doti
              inner join doc_documento doc on doc.uni_documento = doti.uni_documento
              INNER JOIN donu_dotinumdocumento donu on donu.doti_ideregistr=doti.doti_ideregistr
              INNER JOIN nudo_numdocumen nudo on nudo.nudo_ideregistro=donu.nudo_ideregistro
              where nudo.nudo_estado='A' and donu.donu_tipo='FA'  
               and nudo.nudo_aplicafelectronica='S'
              and nudo.emp_ideregistro=:idempresa  
            and doti.uni_documento=:iddocumento   
            and doti.uni_tipdocument=:idtipodocumento" .
              $complemento . "limit 1";
        $resultado = $this->executeQuery($sql, $infoFactura);
        if(empty($resultado)){
            return $resultado;            
        }
        return $resultado[0];
    }
    
    public function actualizarDocumentoEspejoFactura($idFactura, $ideDocumento) {
        $data['fac_ideregistro'] = $idFactura;
        $data['uni_documento'] = $ideDocumento;
        $this->actualizar($data, 'fac_factura', 'fac_ideregistro=:fac_ideregistro');
    }
    
    /**
     * Consulta el valor de la nota para saber si es factura electronica.
     * @param array $infoFactura Información de la factura 
     * @return array si pertenece a FE.
     */
    public function getValorNotaFacturaElectronica($infoFactura , $tipoFactura) {
        //print_r($infoFactura);
        $complemento = "  and doc.doc_tipo in ('ND','NC','NF','NR')  " ;
        if($tipoFactura == 1 ){
            $complemento = " ";
        }
        $sql = "SELECT  abs(sum(dfac.dfac_vlrunitari)) totfac
                from fac_factura fac
                inner join doc_documento doc on doc.uni_documento = fac.uni_documento
                inner join dfac_detfactura dfac on dfac.fac_ideregistro=fac.fac_ideregistro
                inner join doti_doctipo doti on doti.uni_documento=fac.uni_documento and doti.uni_tipdocument=fac.uni_tipdocument
                INNER JOIN donu_dotinumdocumento donu on donu.doti_ideregistr=doti.doti_ideregistr
                INNER JOIN nudo_numdocumen nudo on nudo.nudo_ideregistro=donu.nudo_ideregistro
                inner join codo_condocumen codo on codo.emp_ideregistro=fac.emp_ideregistro and codo.uni_documento=fac.uni_documento
                and codo.uni_tipdocument=fac.uni_tipdocument and codo.codo_aplicafelectronica='S'
                and codo.uni_concepto=dfac.uni_concepto
                where nudo.nudo_estado='A' and donu.donu_tipo='FA'  
                and nudo.emp_ideregistro= fac.emp_ideregistro
                and nudo.nudo_aplicafelectronica='S'
                ".$complemento." and fac.fac_ideregistro=  :fac_ideregistro";
        $resultado = $this->executeQuery($sql, $infoFactura);
        return $resultado[0];
    }
    
    public function actualizaVlrDetalleNewFactura($idFactura){
        $parametros["idfactura"]= $idFactura;
        $sql = "UPDATE dfac_detfactura dfac 
                SET 
		dfac_vlrunitari = (case WHEN dfacnew.dfac_vlrtotal >0  THEN dfacnew.dfac_vlrtotal else dfacnew.dfac_vlrreal  end ) 
                FROM dfac_detfactura dfacnew 
                WHERE  dfac.dfac_ideregistr = dfacnew.dfac_ideregistr  and 
                dfac.fac_ideregistro = :idfactura";
        $resultado = $this->executeQuery($sql,$parametros);
        if(empty($resultado)){
            throw new MyException('Error, No se actualizo la Nueva Factura', -1);
        }
        return $resultado;
    }
    
     public function consultarTipoConcepto($idConcepto){
        $parametros["idconcepto"] = $idConcepto;
        $sql = "select
                    con.con_operacion operacion
                from
                    con_concepto con
                where
                    con.uni_concepto = :idconcepto";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0];
    }
    
    public function fechaSistema(){
        $sqlFecha = "select now() fechasistema";
        $resulFecha = $this->executeQuery($sqlFecha);
        return $resulFecha[0];
    }
    
    public function compactadetallesfinanciaciones($idEmpresa){
        $sql="select * from fn_fin_compactadetalles($idEmpresa)";
       return $this->executeQuery($sql);
    }
    
    public function getDestinatariosCorreoFinanciaciones($idEmpresa) {
        $parametros['empresa'] = $idEmpresa  ;
        $sql = "SELECT json_array_elements_text(datos.correos :: json)::json->>'to'   AS destinatarios 
            FROM ( select par.emp_ideregistro,(json_array_elements_text((par_parametro::JSON->>'COMPACTAR_DETALLE_FINANCIACIONES')::json))::json->>'correo' correos
                    from par_parametro par where emp_ideregistro=$idEmpresa) datos";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return;
        }
        return $resultado;
    }
    public function consultarInformacionVariasSuscripciones($idSuscripcion, $estado = NULL) {
        
        $complemento = "";
        if ($estado != NULL) {
            $complemento = 'and dsus_estado IN ($estado)';
        }
        $sql = "
            SELECT dsus_estado estado, dsus_descripcion descripcion,
             dsus_pcodigo codigoanterior , sus_ideregistro idsuscriptor,
             dsus_ideregistr idsuscripcion, dsus.ter_ideregistro idtercero,
             pro_ideregistro idpropiedad, uni_municipio idmunicipio,
             uni_barrio idbarrio, est_tipsuscripc idestructuratiposuscripcion,
             uni_tipsuscripc idtiposuscripcion, est_tipusosuscr idestructuratipousosuscripcion,
             uni_tipusosuscr idtipousosuscripcion, emp_ideregistro idempresa,
             est_liquidacion idestructuraliquidacion, uni_liquidacion idliquidacion,
             cic_ideregistro idciclo, dsus_fecinicio fechainicio,
             dsus_fecexpira fechaexpira, pro_catestrato estrato,
             dsus_iniestado fechainicioestado, dsus_finestado fechafinestado,
             ter.uni_tiptercero idtipotercero
            FROM dsus_detsuscrip dsus inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
            WHERE dsus.dsus_ideregistr IN (".$idSuscripcion.")" . $complemento;
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('Error consultando la suscripcion ' . $idSuscripcion, -1);
        }
        return $resultado[0];
    }
    
      public function getProcesosMarcacionAseo($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa ; 
        $sql = "
            select cc.uni_concepto idconcepto, 
               (case  cc.con_propiedad ->>'MARCADO_APLICADINC' when 'S' then 'S' else 'N' end ) aplicadinc,
               (case  cc.con_propiedad ->>'MARCADO_DESHABITADO' when 'S' then 'S' else 'N' end ) deshabitado,
               (case  cc.con_propiedad ->>'MARCADO_PTAPTA' when 'S' then 'S' else 'N' end ) puertapuerta,
               (case  cc.con_propiedad ->>'MARCADO_HOMASEOGAS' when 'S' then 'S' else 'N' end ) homogasaseo,
               (case  cc.con_propiedad ->>'MARCADO_AFORADO' when 'S' then 'S' else 'N' end ) aforadoaseo,
               (case  cc.con_propiedad ->>'MARCADO_HOMENERGIA' when 'S' then 'S' else 'N' end ) homoenergia,
               (case  cc.con_propiedad ->>'MARCADO_AFORATER' when 'S' then 'S' else 'N' end ) aforadotercero,
               (case  cc.con_propiedad ->>'MARCADO_NOAPLICADINC' when 'S' then 'S' else 'N' end ) noaplicadinc,
               (case  cc.con_propiedad ->>'MARCADO_NO_AFORADO' when 'S' then 'S' else 'N' end ) noaforado,
               (case  cc.con_propiedad ->>'MARCADO_TARPLENA' when 'S' then 'S' else 'N' end ) tarifaplena
               from con_concepto cc 
                inner join uni_unidad uu on uu.uni_ideregistro = cc.uni_concepto 
                inner join esem_estempresa ee on ee.est_ideregistro = uu.est_ideregistro 
               where con_propiedad ->>'MARCADO_ASEO' ='S' and ee.emp_ideregistro  = :idempresa "; 
                
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
        
    }
        public function getFacturasInformacioncarteraAseoNoHomologada($complemento, array $parametros = array()) {
        if (empty($complemento)) {
            throw new MyException('Error, Debe tener un complemento la consulta de facturas');
        }
        $sql = "SELECT fac.fac_ideregistro idfactura,fac.fac_numero numero,
                  DATE (fac.fac_fecvence) fechavencimiento,fac.dsus_ideregistr idsuscripcion,
                  coalesce(fac.fac_vlrreal ,0) valortotal, COALESCE ((fac.fac_vlrreal-fac.fac_sdoreal) ,0)valorpagadofactura,
                  coalesce(fac.fac_vlrreal ,0) valorreal,per.per_ideregistro idperiodo, cic.cic_ideregistro idciclo,
                  per.per_nombre ||' '|| cic.cic_nombre cicloperiodo,tsu.uni_tipsuscripc idtiposuscripcion,
                  tsu.tsu_nombre tiposuscripcion,
                  COALESCE(fac.fac_sdoreal,0) saldofactura,fac.fac_metgenera metodogenera,
                  fac.fac_estado estado,fac.fac_fecha fecha,fac.fac_ideactual idactual,
                  fac.fac_idepadre idfacturapadre,fac.fac_fecaprobada fechaaprobada,fac.fac_feceliminad fechaeliminada,
                  fac.fac_fecfinancia fechafinanciacion,fac.fac_feccastigad fechacastigada,
                  fac.emp_ideregistro idempresa,fac.sus_ideregistro idsuscriptor,fac.uni_tipusosuscr idtipousosuscripcion,
                  fac.uni_liquidacion idliquidacion,fac.ter_ideregistro idtercero,fac.uni_documento iddocumento,
                  fac.uni_tipdocument idtipodocumento,fac.amo_ideregistro idamortizacion,
                  fac.cic_ano cicloano,fac.hliq_ideregistr idhistoricoliquidacion,
                  fac.fac_ideorigen idorigen,fac.uni_tiptercero idtipotercero,fac.fac_fecsuspens fechasuspension,
                  fac.fin_ideregistro idfinanciacion,fac.fac_version as version,
                  COALESCE(fac.fac_vlrreal-fac.fac_sdoreal,0) valorpagado,doc.doc_nombre documento,
                  uni.uni_nombre1 tipodocumento, doc.doc_pagpriori prioridadpagodoc
                FROM
                  fac_factura fac inner join per_periodo per on fac.per_ideregistro=per.per_ideregistro
                  inner join aseo.fmg_facturacioncarterag carg on carg.fac_ideregistro = fac.fac_ideregistro 
                  inner join cic_ciclo cic on fac.cic_ideregistro=cic.cic_ideregistro
                  inner join tsu_tipsuscripc tsu on fac.uni_tipsuscripc=tsu.uni_tipsuscripc
                  inner join doc_documento doc on fac.uni_documento=doc.uni_documento
                  inner join uni_unidad uni on fac.uni_tipdocument=uni.uni_ideregistro " . $complemento;
        return $this->executeQuery($sql, $parametros);
    }

    public function consultarInformacionSuscripcionPcodigo($idSuscripcion, $estado = NULL) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $complemento = '';
        if ($estado != NULL) {
            $complemento = 'and dsus_estado IN ($estado)';
        }
        $sql = "
            SELECT dd2.dsus_ideregistr as idsuscripcion
            FROM dsus_detsuscrip dsus inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
            inner join dsus_detsuscrip dd2 on dd2.sus_ideregistro = dsus.sus_ideregistro and 
            dd2.emp_ideregistro = 317
            WHERE dsus.dsus_pcodigo=  '$idSuscripcion' ".$complemento;
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('Error consultando la suscripcion ' . $idSuscripcion, -1);
        }
        return $resultado[0];
    }

    
            
            
  
}
