<?php

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\MyException;

/**
 * descripcion: Contiene el modelo necesario pára generar nuevas financiaciones
 *
 * @author sergio vargas 
 * 05 /AGO / 2015
 * 
 */
class GenerarFinanciacionModel extends AuditoriaServices {

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var GenericoDelegado 
     */
    private $genericoDelegado;

    /**
     * Constructor de la clase
     * @param Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($conexion);
        $this->genericoDelegado = new GenericoDelegado($conexion);
    }

    // <editor-fold desc="Suscripción">  
    /**
     * Consulta de las facturas de una suscripción
     * @param int $idSuscripcion identificador de la suscripción.
     * @param int $idDocumento identificador del documento.
     * @param int $idTipoDocumento identificador del tipo de documento
     * @return array Listado de las facturas.
     */
    public function consultarFacturasPorSuscripcionDocumentoModel($idSuscripcion,$idsegmento, $idDocumento, $idtiposdocumentos, $idconceptodescarte=NULL) {
        $complemento = '';
        $complementoconceptos = '';
        $condicion_des = '';
        $condicion_nor = '';
        if(count($idtiposdocumentos)>0){
            $idtiposdocumentos = implode(',', $idtiposdocumentos);
            $condicion_des .= "AND facc.uni_tipdocument IN ($idtiposdocumentos)";
            $condicion_nor .= "AND fac.uni_tipdocument IN ($idtiposdocumentos)";
        }
        if (!empty($idconceptodescarte)) {
            $complementoconceptos = "and fac.fac_ideregistro not in (SELECT DISTINCT
                        facc.fac_ideregistro idfactura
                FROM  fac_factura facc
                inner join doc_documento doc on doc.uni_documento = facc.uni_documento
                inner join tido_tipdocumen tido on  tido.uni_tipdocument = facc.uni_tipdocument
                inner join  dfac_detfactura dfaci on dfaci.fac_ideregistro=facc.fac_ideregistro
                WHERE (SELECT  SUM (dfac.dfac_sdoreal)
                                FROM
                                        dfac_detfactura dfac
                                INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                                WHERE dfac.dfac_sdoreal > 0
                                AND con.con_financiable = 'S'
                                AND dfac.fac_ideregistro = facc.fac_ideregistro) > 0
                AND facc.fac_estado = 'A' AND facc.fac_sdoreal > 0 AND facc.fac_idepadre IS NULL
                AND doc.doc_financiable = 'S' AND facc.dsus_ideregistr = :idSuscripcion
                and dfaci.uni_concepto in  (".$idconceptodescarte.")   and dfaci.dfac_sdoreal>0  ) " . $condicion_des ;
        }
        if (!empty($idDocumento)) {
            $complemento = 'and fac.uni_documento = :idDocumento ';
        }
        $parametros = array();
        $parametros['idSuscripcion'] = $idSuscripcion;
        $parametros['idDocumento'] = $idDocumento;
	$parametros['idsegmento'] = $idsegmento;

        $complementoSeg = "";
        if ($idsegmento != -1) {
            $complementoSeg = "AND cc.cnre_ideregistr = :idsegmento";
        } else {
            $complementoSeg = "AND exists(SELECT fmg.* FROM aseo.fmg_facturacioncarterag fmg where fmg.fac_ideregistro = fac.fac_ideregistro)";
        }

        $sql = "SELECT DISTINCT
                        fac.fac_ideregistro idfactura,
                        fac.fac_numero numerofactura,
                        fac.fac_fecha fechafactura,
                        fac.fac_fecvence fechavencimientofactura,
                        fac.uni_documento iddocumento,
                        doc.doc_nombre documento,
                        fac.uni_tipdocument idtipodocumento,
                        tido.tido_nombre tipodocumento,
                        cic.cic_ideregistro idciclo,
                        cic.cic_nombre ciclo,
                        per.per_ideregistro idperiodo,
                        per.per_nombre periodo,
                        (
                                SELECT
                                        SUM (dfac.dfac_sdoreal)
                                FROM
                                        dfac_detfactura dfac
                                INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                                WHERE
                                        dfac.dfac_sdoreal > 0
                                AND con.con_financiable = 'S'
                                AND dfac.fac_ideregistro = fac.fac_ideregistro
                        ) valorfinanciable,
                        (
                                SELECT
                                        SUM (dfac.dfac_sdoreal)
                                FROM
                                        dfac_detfactura dfac
                                INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                                WHERE
                                        dfac.dfac_sdoreal > 0
                                AND con.con_financiable = 'N'
                                AND dfac.fac_ideregistro = fac.fac_ideregistro
                        ) valornofinanciable,
                        fac.fac_vlrreal - fac.fac_sdoreal valorpagado,
                        fac.fac_vlrreal valorfactura,
                        fac.fac_version as version
                FROM
                      fac_factura fac inner join doc_documento doc on doc.uni_documento = fac.uni_documento
                inner join tido_tipdocumen tido on  tido.uni_tipdocument = fac.uni_tipdocument
                inner join cic_ciclo cic on cic.cic_ideregistro = fac.cic_ideregistro
                inner join per_periodo per on per.per_ideregistro = fac.per_ideregistro
                inner join sus_suscripcion ss on fac.sus_ideregistro = ss.sus_ideregistro 
        	    inner join dsus_detsuscrip dd on fac.dsus_ideregistr = dd.dsus_ideregistr 
        		inner join cnre_cnvrecaudo cc on ss.cnre_ideregistr = cc.cnre_ideregistr
                WHERE (SELECT
                                        SUM (dfac.dfac_sdoreal)
                                FROM
                                        dfac_detfactura dfac
                                INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                                WHERE
                                        dfac.dfac_sdoreal > 0
                                AND con.con_financiable = 'S'
                                AND dfac.fac_ideregistro = fac.fac_ideregistro) > 0
                AND fac.fac_estado = 'A' AND fac.fac_sdoreal > 0 AND fac.fac_idepadre IS NULL
                AND doc.doc_financiable = 'S' AND fac.dsus_ideregistr = :idSuscripcion
                $complementoSeg $condicion_nor  $complemento $complementoconceptos
                ORDER BY fac.fac_fecvence, fac.fac_numero;";
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException('No existen facturas asociadas a financiar para el suscriptor ' . $idSuscripcion, 0);
        }
        return $respuesta;
    }

    /**
     * Consulta la secuencia de la financiacion
     * @return int secuencia
     */
    public function obtenerSecuenciaFinanciacion() {
        $sql = "SELECT nextval('sq_fin_ideregistro') idfinanciacion";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('No creo la secuencia', -1);
        }
        return $resultado[0];
    }

    public function obtenerTopeFinanciacionModel($idusuario) {
        $sql = "SELECT
                        usu_topfinancia topefinanciacion
                FROM
                        usuarios
                WHERE
                        usu_ideregistro =$idusuario";
        $resultado = $this->executeQuery($sql);
        return $resultado[0];
    }

    /**
     * permite consultar por tipo de documento
     * @param int $idSuscripcion
     * @param int $idusuario
     * @param int $idempresa
     * @return array tipos de documentos
     */
    public function consultarTipoDocumentoModel($idSuscripcion,$idsegmento, $idusuario, $idempresa) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idsegmento'] = $idsegmento;
        $parametros['idusuario'] = $idusuario;
        $parametros['idempresa'] = $idempresa;
        $parametros['idprograma'] = PROGRAMA_FINANCIACION;

        $complemento = "";
        if ($idsegmento != -1) {
            $complemento = "AND cc.cnre_ideregistr = :idsegmento";
        } else {
            $complemento = "AND exists(SELECT fmg.* FROM aseo.fmg_facturacioncarterag fmg where fmg.fac_ideregistro = fac.fac_ideregistro)";
        }
        
        $sql = "SELECT DISTINCT
                        fac.uni_tipdocument idtipodocumento,
                        uni.uni_nombre1 tipodocumento
                FROM
                        fac_factura fac
                inner join sus_suscripcion ss on fac.sus_ideregistro = ss.sus_ideregistro 
        	    inner join dsus_detsuscrip dd on fac.dsus_ideregistr = dd.dsus_ideregistr 
        		inner join cnre_cnvrecaudo cc on ss.cnre_ideregistr = cc.cnre_ideregistr
                INNER JOIN uni_unidad uni ON fac.uni_tipdocument = uni.uni_ideregistro
                INNER JOIN prun_prgunidad prun ON fac.uni_tipdocument = prun.uni_ideregistro
                INNER JOIN uspu_usuprgunid uspu ON prun.prun_ideregistr = uspu.prun_ideregistr
                INNER JOIN esem_estempresa esem ON uni.est_ideregistro = esem.est_ideregistro
                WHERE
                    fac.dsus_ideregistr = :idsuscripcion
                AND prun.prg_ideregistro = :idprograma
                AND uspu.usu_ideregistro = :idusuario
                AND esem.emp_ideregistro = :idempresa
                AND fac.fac_sdoreal > 0 " .$complemento;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * permite consultar los segmentos de una suscripcion
     * @param int $idSuscripcion
     * @return array segmentos
     */
    public function consultarSegmentosModel($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;

        $sql = "SELECT DISTINCT
                    case
                        when exists(SELECT fmg.* FROM aseo.fmg_facturacioncarterag fmg where fmg.fac_ideregistro = fac.fac_ideregistro) 
                            then -1
                        else 
                            cc.cnre_ideregistr
                        end seg_idregistro,
                    case
                        when exists(SELECT fmg.* FROM aseo.fmg_facturacioncarterag fmg where fmg.fac_ideregistro = fac.fac_ideregistro)
                            then 'Cartera G'
                        else 
                            cc.cnre_nombre
                        end seg_nombre
                FROM
                    fac_factura fac
                    inner join sus_suscripcion ss on fac.sus_ideregistro = ss.sus_ideregistro 
                    inner join dsus_detsuscrip dd on fac.dsus_ideregistr = dd.dsus_ideregistr 
                    inner join cnre_cnvrecaudo cc on ss.cnre_ideregistr = cc.cnre_ideregistr
                WHERE
                    fac.dsus_ideregistr = :idsuscripcion
                    AND fac.fac_sdoreal > 0";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * lista lños documentos vinculados nal programa de financiaciones
     * @param int $idsuscripcion
     * @param int $idusuario
     * @param int $idempresa
     * @param int $idtipodocumento
     * @return Array listado de documentos
     */
    public function consultarDocumentoModel($idsuscripcion, $idusuario, $idempresa, $idtiposdocumentos) {
        $parametros['idsuscripcion'] = $idsuscripcion;
        $parametros['idusuario'] = $idusuario;
        $parametros['idempresa'] = $idempresa;
        $complemento = '';
        if(count($idtiposdocumentos)>0){
            $idtiposdocumentos = implode(',', $idtiposdocumentos);
            $complemento .= "AND fac.uni_tipdocument IN ($idtiposdocumentos)";
        }
        $parametros['programafinanciacion'] = PROGRAMA_FINANCIACION;
        $sql = "SELECT DISTINCT
                        fac.uni_documento iddocumento,
                        doc.doc_nombre documento
                FROM
                        fac_factura fac
                INNER JOIN doc_documento doc ON fac.uni_documento = doc.uni_documento
                INNER JOIN prun_prgunidad prun ON fac.uni_documento = prun.uni_ideregistro
                INNER JOIN uspu_usuprgunid uspu ON prun.prun_ideregistr = uspu.prun_ideregistr
                INNER JOIN esem_estempresa esem ON doc.est_documento = esem.est_ideregistro
                WHERE
                        fac.dsus_ideregistr = :idsuscripcion
                AND prun.prg_ideregistro = :programafinanciacion
                AND uspu.usu_ideregistro = :idusuario
                AND esem.emp_ideregistro = :idempresa
                AND doc.doc_financiable = 'S'
                AND fac.fac_sdoreal > 0"
                .$complemento;
        return $this->executeQuery($sql, $parametros);
    }

    // </editor-fold>
    // <editor-fold desc="Financiacion">   
    /**
     * Elimina una financiación.
     * @param int $idFinanciacion identificador de la financiación.
     * @throws MyException Error al modificar
     */
    public function cancelarFinanciacion($idFinanciacion) {
        $parametros['fin_ideregistro'] = $idFinanciacion;
        $parametros['fin_estado'] = 'C';
        $resultado = $this->actualizar($parametros, 'fin_financiacio', 'fin_ideregistro= :fin_ideregistro');
        if (empty($resultado)) {
            throw new MyException('No se pudo modificar la financiación');
        }
    }

    /**
     * Consulta el número de una factura a generar.
     * @param array $infoFactura Información de la factura
     * @return array detalle con el nuevo número a generar.
     * @throws MyException Error al consultar
     */
    public function obtenerNumeroFacturaModel($infoFactura) {
        $infoFactura['tipo']="FA";
        return $this->genericoModel->obtenerNumeroFactura($infoFactura);
    }

    /**
     * Consulta los detalles de la financiación.
     * @param int $idFinanciacion Identificador de la financiación
     * @return array Listado de los detalles de la financiación.
     */
    public function consultarDetalleFinanciacion($idFinanciacion) {
        $parametros['idfinanciacion'] = $idFinanciacion;
        $sql = 'select 
                dfin.fin_ideregistro idfinanciacion,
                dfin.dfac_ideregistr iddetallefactura,dfin.fac_ideregistro idfactura,
                dfin.dsus_ideregistr idsuscripcion,dfin.uni_liquidacion idliquidacion,
                dfin.uni_concepto idconcepto,
                dfin.dfin_ideregistr iddetallefinanciacion,
                dfin.emp_ideregistro idempresa,
               dfin.dfin_sdoreal saldo 
              from dfin_detfinanci dfin where dfin.fin_ideregistro=:idfinanciacion and dfin_idepadre is null';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta las liquidaciones de las financiaciones
     * @return array Listado de las financiaciones
     */
    public function consultarLiquidacionFinanciacionModel($iddocumento = null, $idtiposdocumentos = null, $idempresa) {
        $complemento = '';
        if (!empty($iddocumento)) {
            $complemento .= " AND uni_documento = $iddocumento ";
        }
        if (!empty($idtiposdocumentos)) {
            if(count($idtiposdocumentos)>0){
                $idtiposdocumentos = implode(',', $idtiposdocumentos);
                $complemento .= " AND liq.uni_tipdocument IN ($idtiposdocumentos) ";
            }
        }
        $sql = "    SELECT
                            uni_liquidacion idliquidacion,
                            liq_nombre liquidacion,
                            liq.liq_tipcuota tipocuota,
                            uni_documento iddocumento,
                            liq.uni_tipdocument idtipodocumento,
                            tido.tido_maxcuofinancia maximoplazo,
                            tido.tido_maxcuounifica maximoplazoreunifica,
                            tido.tido_maxcuoreestruc maximoplazoreestructura,
                            tido.tido_finvencido financiarvencidas
                    FROM
                            liq_liquidacion liq
                    INNER JOIN esem_estempresa esem on liq.est_liquidacion = esem.est_ideregistro 
                    INNER JOIN tido_tipdocumen tido ON tido.uni_tipdocument = liq.uni_tipdocument
                    WHERE
                            liq.liq_venclasific = 'FI' AND esem.emp_ideregistro =$idempresa" . $complemento
                . " ORDER BY liq_nombre ";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException('No hay liquidaciones disponibles', 0);
        }
        return $respuesta;
    }

    /**
     * permite obtener el interes de la liquidación 
     * @param int $idliquidacion identificador de liquidacion
     * @return float interes de liquidacion  
     * @throws MyException No se encontro tasa de interes
     */
    public function consultarInteresLiquidacionModel($idliquidacion) {
        $sql = "SELECT
                        con.con_formula formulainteres
                FROM
                coli_conliquida coli 
                INNER JOIN con_concepto con ON coli.uni_concepto = con.uni_concepto
                WHERE
                        coli.uni_liquidacion = :idliquidacion
                AND con.con_intfinanciacion = 'S'";
        $parametros['idliquidacion'] = $idliquidacion;
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException('No se encontró tasa de intéres, debe parametrizarla antes para utilizar esta liquidación', -1);
        }
        return $respuesta[0];
    }

    public function consultarInteresIvaLiquidacion($idliquidacion) {
        $sql = "SELECT
                        con.con_formula formulainteres
                FROM
                        con_concepto con
                INNER JOIN core_conrelacio core ON con.uni_concepto = core.uni_concepto
                WHERE
                        core.uni_conrelacion IN (
                                SELECT
                                        con.uni_concepto
                                FROM
                                        coli_conliquida coli
                                INNER JOIN con_concepto con ON coli.uni_concepto = con.uni_concepto
                                WHERE
                                        coli.uni_liquidacion =$idliquidacion
                                AND con.con_intfinanciacion = 'S'
                        );";
        return $this->executeQuery($sql);
    }

    /**
     * Valida que conceptos hacen base en la tasa de inteŕes    
     * @param int $idLiquidacion  identificador de la liquidación.
     * @param array $facturas Listado de las facturas en las que toca validar los conceptos
     * @return array Listado de los conceptos que no hacen base para la tasa de interés.
     */
    public function validarConceptosFinanciacionModel($idLiquidacion, $facturas) {
        $sql = "SELECT DISTINCT
                        dfac.uni_concepto idconcepto,
                        con.con_nombre concepto
                FROM
                        fac_factura fac,
                        dfac_detfactura dfac,
                        con_concepto con
                WHERE
                        fac.fac_ideregistro IN ($facturas)
                AND fac.fac_idepadre IS NULL
                AND fac.fac_ideregistro = dfac.fac_ideregistro
                AND dfac.uni_concepto = con.uni_concepto
                AND dfac.dfac_sdoreal > 0
                AND dfac.uni_concepto NOT IN (
                        SELECT DISTINCT
                                core.uni_conrelacion
                        FROM
                                coli_conliquida coli
                        INNER JOIN core_conrelacio core ON coli.uni_concepto = core.uni_concepto
                        WHERE
                                coli.uni_liquidacion = $idLiquidacion )";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    /**
     * Consulta los detalles de los conceptos.
     * @param int $idFactura identificador de la factura
     * @param string $financiable 'S' es financiable , 'N' No es financiable
     * @return array Listado de los detalles de los conceptos.
     */
    public function consultarDetallesConceptosModel($idFactura, $financiable) {
        $parametros['idfactura'] = $idFactura;
        $parametros['financiable'] = $financiable;
        $sql = "SELECT
                        con.con_nombre concepto,
                        dfac.dfac_sdoreal valor
                FROM
                        dfac_detfactura dfac
                INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                WHERE
                        dfac.fac_ideregistro =:idfactura AND con.con_financiable =:financiable and dfac.dfac_sdoreal>0";
        return $this->executeQuery($sql, $parametros);
    }

    // <editor-fold desc="Insertar Financiación">  
    /**
     * Genera un nuevo registro de las financiaciones 
     * @param array $financiacion información de una financiación.
     * @return bool TRUE insertar FALSE error
     */
    public function insertarFinanciacionModel($financiacion) {
        $parametros['fin_ideregistro'] = $financiacion['idfinanciacion'];
        $parametros['fin_inicapital'] = $financiacion['valortotalfinanciar'];
        $parametros['fin_sdocapital'] = $financiacion['valortotalfinanciar'];
        $parametros['fin_estado'] = 'A';
        $parametros['fin_fecha'] = 'now()';
        $parametros['cic_ano'] = $financiacion['cicloanio'];
        $parametros['ter_idesolicita'] = $financiacion['idsolicita']['idtercero'];
        $parametros['uni_parentesco'] = $financiacion['idparentesco'];
        $parametros['dsus_ideregistr'] = $financiacion['idsuscripcion'];
        $parametros['ter_ideentfinan'] = $financiacion['identidad'];
        $parametros['cic_ideregistro'] = $financiacion['idciclo'];
        $parametros['per_ideregistro'] = $financiacion['idperiodo'];
        $parametros['emp_ideregistro'] = $financiacion['idempresa'];
        $parametros['usu_ideregistro'] = $financiacion['idusuario'];
        $parametros['documentos'] = $financiacion['documentosObligatorios'];
        return $this->insertar($parametros, 'fin_financiacio', NULL);
    }

    public function actualizarNumeroFinanciacion($idfinanciacion, $idnumero) {
        $parametros['fin_numero'] = $idnumero;
        $parametros['fin_ideregistro'] = $idfinanciacion;
        return $this->actualizar($parametros, 'fin_financiacio', 'fin_ideregistro=:fin_ideregistro');
    }

    /**
     * Genera un nuevo registro de las amortizaciones
     * @param array $financiacion información de la financiacion que se quiere amortizar
     * @return bool TRUE insertar FALSE error
     */
    public function insertarAmortizacionFinanciacionModel(&$financiacion) {
        $parametros['cic_ano'] = $financiacion['cicloanio'];
        $parametros['cic_ideregistro'] = $financiacion['idciclo'];
        $parametros['per_ideregistro'] = $financiacion['idperiodo'];
        $parametros['amfi_estado'] = $financiacion['estado'];
        $parametros['amfi_cuoamortiz'] = $financiacion['cuotasamortizadas'];
        $parametros['amfi_fecha'] = 'now()';
        $parametros['amfi_numcuotas'] = $financiacion['numerocuotas'];
        $parametros['fin_ideregistro'] = $financiacion['idfinanciacion'];
        $parametros['uni_liquidacion'] = $financiacion['idliquidacion'];
        $parametros['uni_documento'] = $financiacion['iddocumento'];
        $parametros['uni_tipdocument'] = $financiacion['idtipodocumento'];
        $parametros['dsus_ideregistr'] = $financiacion['idsuscripcion'];
        $parametros['emp_ideregistro'] = $financiacion['idempresa'];
        $parametros['fin_ideregistro'] = $financiacion['idfinanciacion'];
        $parametros['usu_ideregistro'] = $financiacion['idusuario'];
        return $this->insertar($parametros, 'amfi_amofinanci', 'sq_amfi_ideregistr');
    }

    /**
     * Crea una nueva nota
     * @param array $info Información de las nota
     * @return int identificador de las nueva nota
     */
    public function insertarNotaModel($info) {
        $cicloperiodo = $this->genericoModel->getCicloPeriodoSuscripcion($info['idsuscripcion']);
        $parametros['not_fecha'] = 'now()';
        $parametros['not_comentario'] = 'Nota Financiación';
        $parametros['uni_motnota'] = UNIDAD_FINANCIACION;
        $parametros['dsus_ideregistr'] = $info['idsuscripcion'];
        $parametros['cic_ideregistro'] = $info['idciclo'];
        $parametros['per_ideregistro'] = $info['idperiodo'];
        $parametros['est_motnota'] = ESTRUCTURA_NOTA;
        $parametros['emp_ideregistro'] = $info['idempresa'];
        $parametros['cic_ano'] = $cicloperiodo['cicloanio'];
        $parametros['usu_ideregistro'] = $info['idusuario'];
        return $this->insertar($parametros, 'not_nota', 'sq_not_ideregistro');
    }

    /**
     * Consulta la información de la factura
     * @param int $idFactura identificador de la factura
     * @return array Listado de las facturas.
     * @throws MyException Error al consultar la información.
     */
    public function consultarFacturaModel($idFactura) {
        $complemento = " where fac.fac_ideregistro=:idfactura and fac.fac_estado !='F'";
        $parametros['idfactura'] = $idFactura;
        $resultado = $this->genericoModel->getFacturasInformacion($complemento, $parametros);
        if (empty($resultado)) {
            throw new MyException("Error, No se encontraron facturas que se puedan financiar ");
        }
        return $resultado[0];
    }

    /**
     * Obtiene información detallada de la suscripción.
     * @param int $idSuscripcion identificador de la suscripción.
     * @return array Listado de las suscripciones asociadas 
     * @throws MyException Error al consultar la información.
     */
    public function consultarSuscripcionSuscriptorModel($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = '  SELECT 
                    dsus.uni_tipsuscripc idtiposuscripcion,
                    dsus.uni_tipusosuscr idtipousosuscripcion,
                    dsus.ter_ideregistro idtercero,
                    dsus.est_tipusosuscr idestructuratipousosuscripcion,
                    dsus.est_tipsuscripc idestructuratiposuscripcion,
                    ter.uni_tiptercero idtipotercero,
                    dsus.sus_ideregistro idsuscriptor
                  FROM 
                    dsus_detsuscrip dsus inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
                  WHERE
                    dsus.dsus_ideregistr=:idsuscripcion';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException("Error en la información de los datos");
        }
        return $resultado[0];
    }

    /**
     * Consulta los documentos y tipos de documentos por tipo.
     * @param int $idDocumento identificador de la factura.
     * @param int $idTipoDocumento identificador tipo documento
     * @param string $tipo tipo transacción a generar
     * @return array con el listado de los documentos y tipos de documentos
     * @throws MyException Error la insertar
     */
    public function consultarDetalleDocumentoTipoDocumentoModel($idDocumento, $idTipoDocumento, $tipo = "NF") {
        $sql = "select
                 ddot.uni_documento iddocumento
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
            throw new MyException("Error, falta parametrización de documento $idDocumento y tipo documento $idTipoDocumento - tipo $tipo ", -1);
        }
        return $resultado[0];
    }

    /**
     * Consulta los detalles de una factura con el calculo de los saldos.
     * @param int $idFactura identificador de la factura
     * @return array detalle de la factura.
     */
    public function consultarDetalleFacturaSaldoModel($idFactura) {
        $sql = "SELECT
                            fac.fac_ideregistro idfactura,
                            dfac.dfac_ideregistr iddetallefactura,
                            fac.uni_liquidacion idliquidacion,
                            fac.dsus_ideregistr idsuscripcion,
                            dfac.uni_concepto idconcepto,
                            dfac.dfac_vlrunitari valorunitario,
                            dfac.dfac_cantidad cantidad,
                            dfac.dfac_vlrtotal valortotal,
                            dfac.dfac_sdoreal saldo,
                            con.con_metajuste metodo,
                            con.con_precision as precision
                    FROM
                            fac_factura fac
                    INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro = fac.fac_ideregistro
                    INNER JOIN con_concepto con ON con.uni_concepto = dfac.uni_concepto
                    WHERE
                            fac.fac_idepadre IS NULL 
                    AND fac.fac_ideregistro = :idFactura
                    AND dfac.dfac_sdoreal > 0
                    AND con.con_financiable = 'S'";
        $parametros['idFactura'] = $idFactura;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * se permite generar una nueva factura con los saldos de las notas
     * @param array $infoFacturaNotasSaldo
     * @param array $financiacion
     * @return int numero de factura generado
     */
    public function insertarFacturaSaldoModel(&$infoFacturaInicial, &$infoFacturaInicialActualizada, $infoDocumento, &$financiacion) {
        $suscripcion = $this->genericoModel->consultarInformacionSuscripcion($infoFacturaInicial['idsuscripcion']);
        $suscripcion['idsuscripcion'] = $infoFacturaInicial['idsuscripcion'];
        $fechas = $this->genericoDelegado->getFechaFactura($suscripcion, $financiacion);
        $parametros['fac_metgenera'] = 'P';
        $parametros['fac_estado'] = 'A';
        $parametros['fac_fecha'] = 'now()';
        $parametros['fac_fecaprobada'] = 'now()';
        $parametros['fac_fecvence'] = $fechas['fechavencimiento'];
        $parametros['emp_ideregistro'] = $infoFacturaInicial['idempresa'];
        $parametros['sus_ideregistro'] = $infoFacturaInicial['idsuscriptor'];
        $parametros['dsus_ideregistr'] = $infoFacturaInicial['idsuscripcion'];
        $parametros['cic_ano'] = $financiacion['cicloanio'];
        $parametros['uni_tipsuscripc'] = $infoFacturaInicial['idtiposuscripcion'];
        $parametros['uni_tipusosuscr'] = $infoFacturaInicial['idtipousosuscripcion'];
        $parametros['uni_liquidacion'] = $infoFacturaInicial['idliquidacion'];
        $parametros['ter_ideregistro'] = $infoFacturaInicial['idtercero'];
        $parametros['cic_ideregistro'] = $financiacion['idciclo'];
        $parametros['per_ideregistro'] = $financiacion['idperiodo'];
        $parametros['uni_documento'] = $infoDocumento['iddocumento'];
        $parametros['uni_tipdocument'] = $infoFacturaInicial['idtipodocumento'];
        $parametros['hliq_ideregistr'] = 0;
        $parametros['fac_sdoreal'] = $infoFacturaInicialActualizada['saldofactura'];
        $parametros['fac_ideorigen'] = $infoFacturaInicial["idfactura"];
        $parametros['uni_tiptercero'] = $infoFacturaInicial['idtipotercero'];
        $parametros['fac_vlrreal'] = $infoFacturaInicialActualizada['saldofactura'];
        $parametros['usu_ideregistro'] = $financiacion['idusuario'];
        return $this->insertar($parametros, 'fac_factura', 'sq_fac_ideregistro');
    }

    /**
     * Insertar la nueva factura
     * @param array $infoFacturaInicial información de la factura padre
     * @param array $infoSuscripcion información de la suscripción.
     * @param array $infoNotaTipo información del tipo de nota que se generó.
     * @param array $financiacion información de la financiación.
     * @return int identificador de la factura.
     */
    public function insertarFacturaNotaModel(&$infoFacturaInicial, $infoNotaTipo, $financiacion) {
        $suscripcion = $this->genericoModel->consultarInformacionSuscripcion($infoFacturaInicial['idsuscripcion']);
        $suscripcion['idsuscripcion'] = $infoFacturaInicial['idsuscripcion'];
        $fechas = $this->genericoDelegado->getFechaFactura($suscripcion, $financiacion);
        $parametros['fac_metgenera'] = 'P';
        $parametros['fac_estado'] = 'A';
        $parametros['fac_fecha'] = 'now()';
        $parametros['fac_idepadre'] = $infoFacturaInicial["idfactura"];
        $parametros['fac_fecaprobada'] = 'now()';
        $parametros['fac_fecvence'] = $fechas['fechavencimiento'];
        $parametros['emp_ideregistro'] = $infoFacturaInicial['idempresa'];
        $parametros['sus_ideregistro'] = $suscripcion['idsuscriptor'];
        $parametros['dsus_ideregistr'] = $infoFacturaInicial['idsuscripcion'];
        $parametros['cic_ano'] = $financiacion['cicloanio'];
        $parametros['uni_tipsuscripc'] = $suscripcion['idtiposuscripcion'];
        $parametros['uni_tipusosuscr'] = $suscripcion['idtipousosuscripcion'];
        $parametros['uni_liquidacion'] = $infoFacturaInicial['idliquidacion'];
        $parametros['ter_ideregistro'] = $suscripcion['idtercero'];
        $parametros['cic_ideregistro'] = $financiacion['idciclo'];
        $parametros['per_ideregistro'] = $financiacion['idperiodo'];
        $parametros['uni_documento'] = $infoNotaTipo['iddocumento'];
        $parametros['uni_tipdocument'] = $infoFacturaInicial['idtipodocumento'];
        $parametros['hliq_ideregistr'] = 0;
        $parametros ['fac_sdoreal'] = abs($infoFacturaInicial['valorfinanciar']) * -1;
        $parametros['fac_ideorigen'] = $infoFacturaInicial["idfactura"];
        $parametros['uni_tiptercero'] = $suscripcion['idtipotercero'];
        $parametros['fac_vlrreal'] = $parametros ['fac_sdoreal'];
        $parametros['usu_ideregistro'] = $financiacion['idusuario'];
        return $this->insertar($parametros, 'fac_factura', 'sq_fac_ideregistro');
    }

    /**
     * Inserta un nuevo detalle de la financiación.
     * @param array $detalleFinanciacion información del detalle
     * @return bool TRUE insertar FALSE error
     */
    public function insertarDetalleFinanciacionModel($detalleFinanciacion) {
        $parametros['fin_ideregistro'] = $detalleFinanciacion['idfinanciacion'];
        $parametros['dfac_ideregistr'] = $detalleFinanciacion['iddetallefactura'];
        $parametros['fac_ideregistro'] = $detalleFinanciacion['fac_ideregistro'];
        $parametros['dsus_ideregistr'] = $detalleFinanciacion['idsuscripcion'];
        $parametros['uni_liquidacion'] = $detalleFinanciacion['idliquidacion'];
        $parametros['uni_concepto'] = $detalleFinanciacion['idconcepto'];
        $parametros['dfac_vlrunitari'] = $detalleFinanciacion['valorunitario'];
        $parametros['dfac_vlrtotal'] = $detalleFinanciacion['valortotal'];
        $parametros['dfac_sdoreal'] = $detalleFinanciacion['saldo'];
        $parametros['dfin_vlrreal'] = $detalleFinanciacion['valorreal'];
        $parametros['dfin_sdoreal'] = $detalleFinanciacion['saldo'];
        $parametros['cic_ideregistro'] = $detalleFinanciacion['idciclo'];
        $parametros['per_ideregistro'] = $detalleFinanciacion['idperiodo'];
        $parametros['emp_ideregistro'] = $detalleFinanciacion['idempresa'];
        $parametros['usu_ideregistro'] = $detalleFinanciacion['idusuario'];
        $parametros['cic_ano'] = $detalleFinanciacion['cic_ano'];
        return $this->insertar($parametros, 'dfin_detfinanci', 'sq_dfin_ideregistr');
    }

    /**
     * Ingresa un nuevo detalle de una factura.
     * @param array $detalleFactura detalle de la factura
     * @param array $facturaInicial infroamción de la factura inicial.
     * @param array $infoNotaTipo información del documento y tipo de documento de la nota.
     * @return int identificador del detalle generado
     */
    public function insertarDetalleFacturaSaldosModel($detalleFactura) {
        $parametros['dfac_estado'] = 'A';
        $parametros['dfac_ideorigen'] = $detalleFactura['iddetallefactura'];
        $parametros['dfac_cantidad'] = $detalleFactura['cantidad'];
        $parametros['dfac_vlrunitari'] = $detalleFactura['valorunitario'];
        $parametros['dfac_vlrtotal'] = $detalleFactura['valortotal'];
        $parametros ['dfac_vlrreal'] = $detalleFactura['saldo'];
        $parametros['dfac_sdoreal'] = $detalleFactura['saldo'];
        $parametros['fac_ideregistro'] = $detalleFactura['fac_ideregistro'];
        $parametros['uni_concepto'] = $detalleFactura['idconcepto'];
        $parametros['dfac_idepadre'] = $detalleFactura['iddetallefactura'];
        $parametros['dfin_ideregistr'] = $detalleFactura['idfinanciacion'];
        $parametros['usu_ideregistro'] = $detalleFactura['idusuario'];
        return $this->insertar($parametros, 'dfac_detfactura', 'sq_dfac_ideregistr');
    }

    /**
     * Ingresa un nuevo detalle de una factura.
     * @param array $detalleFactura detalle de la factura
     * @return int identificador del detalle generado
     */
    public function insertarDetalleFacturaNotaModel($detalleFactura, $tipo = 'FF') {
        $parametros['dfac_estado'] = 'A';
        $parametros['dfac_ideorigen'] = $detalleFactura['iddetallefactura'];
        $parametros['dfac_cantidad'] = $detalleFactura['cantidad'];
        $parametros['dfac_vlrunitari'] = $detalleFactura['valortotal'];
        $parametros['dfac_vlrtotal'] = $detalleFactura['valortotal'];
        $parametros ['dfac_vlrreal'] = $detalleFactura['valorreal'];
        $parametros['dfac_sdoreal'] = $detalleFactura['saldo'];
        $parametros['fac_ideregistro'] = $detalleFactura['fac_ideregistro'];
        $parametros['uni_concepto'] = $detalleFactura['idconcepto'];
        $parametros['dfac_idepadre'] = ($tipo == 'FF') ? null : $detalleFactura['iddetallefactura'];
        $parametros['usu_ideregistro'] = $detalleFactura['idusuario'];
        $parametros['emp_ideregistro'] = $detalleFactura['idempresa'];
        return $this->insertar($parametros, 'dfac_detfactura', 'sq_dfac_ideregistr');
    }

    /**
     * Genera una nota a una factura
     * @param int $idNota identificador de la nota
     * @param int  $idDetalleFacturaNota detalle de la factura
     * @param array $detalleFactura información del detalle de la factura
     * @param int $idFacturaPadre identificador de la factura padre
     * @return bool TRUE insertar FALSE error
     */
    public function insertarNotaFacturaModel($idNota, $idDetalleFacturaNota, $detalleFactura, $idFacturaPadre) {
        $parametros['not_ideregistro'] = $idNota;
        //Detalle de la nota en dfac_detfactura
        $parametros['dfac_ideregistr'] = $idDetalleFacturaNota;
        //Encabezado de la factura padre  consultarlo por medio del dfac_ideorigen
        $parametros['fac_ideorigen'] = $idFacturaPadre;
        //detalle de la factura padre
        $parametros['dfac_ideorigen'] = $detalleFactura['iddetallefactura'];
        $parametros['usu_ideregistro'] = $detalleFactura['idusuario'];
        $parametros['fac_ideregistro'] = $detalleFactura['fac_ideregistro'];
        return $this->insertar($parametros, 'nofa_notfactura', 'sq_nofa_ideregistr');
    }

    /**
     * Actualiza la información de una factura.
     * @param array $parametros información de la nueva factura.
     * @return int número de filas afectadas.
     */
    public function actualizarFacturaModel($parametros) {
        return $this->actualizar($parametros, 'fac_factura', 'fac_ideregistro= :fac_ideregistro');
    }

    /**
     * Obtiene financiacion por financiacion
     * @param array $idfinanciacion
     * @return Array información de un archivos adjunto
     */
    public function obtenerDocumentosAdjuntosFinanciacionModel($idfinanciacion) {
        $sql = "SELECT
                        adfi.adfi_ideregistr idficheroadjunto,
                        adfi.adfi_nomarchivo nombrearchivo,
                        adfi.adfi_ruta rutaarchivo,
                        adfi.adfi_tiparchivo tipoarchivo,
                        adfi.fin_ideregistro idfinanciacion
                FROM
                        adfi_adjfinanciacio adfi
                WHERE
                        fin_ideregistro = :idfinanciacion";
        $parametros['idfinanciacion'] = $idfinanciacion;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Se almacenan los ficheros comom adjuntos en la financiación 
     * @param array $infoSoporte
     * @return array información del archivo adjuntoi
     */
    public function insertarAdjuntoFinanciacionModel($infoSoporte) {
        $parametros = array();
        $this->setCampo($infoSoporte, $parametros, 'tipoarchivo', 'adfi_tiparchivo');
        $this->setCampo($infoSoporte, $parametros, 'ruta', 'adfi_ruta');
        $this->setCampo($infoSoporte, $parametros, 'nombrearchivo', 'adfi_nomarchivo');
        $idAdjuntoConsignacion = $this->insertar($parametros, 'adfi_adjfinanciacio', 'sq_adfi_ideregistr');
        $infoSoporte['idarchivo'] = $idAdjuntoConsignacion;
        return $infoSoporte;
    }

    /**
     * Permite actualizar el archivo adjunto incluyendole la financiación almacenada
     * @param int $idarchivo
     * @param int $idfinanciacion
     */
    public function actualizarAdjuntoFinanciacionModel($idarchivo, $idfinanciacion) {
        $sql = 'UPDATE adfi_adjfinanciacio
                SET fin_ideregistro = :idfinanciacion
                WHERE
                        adfi_ideregistr = :idarchivo';
        $parametros['idarchivo'] = $idarchivo;
        $parametros['idfinanciacion'] = $idfinanciacion;
        $this->executeQuery($sql, $parametros);
    }

    /**
     * Obtiene un fichero especifico de financiación
     * @param array $idarchivo
     * @return FicheroAdjunto información de un archivo adjunto
     */
    public function obtenerAdjuntoFinanciacionModel($idarchivo) {
        $sql = "SELECT
                        adfi.adfi_ideregistr idficheroadjunto,
                        adfi.adfi_nomarchivo nombrearchivo,
                        adfi.adfi_ruta rutaarchivo,
                        adfi.adfi_tiparchivo tipoarchivo,
                        adfi.fin_ideregistro idfinanciacion
                FROM
                        adfi_adjfinanciacio adfi
                WHERE
                        adfi_ideregistr = :idarchivo";
        $parametros['idarchivo'] = $idarchivo;
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException('El archivo seleccionado no existe ', -1);
        }
        return $respuesta[0];
    }

    /**
     * Permite eliminar un archivo de la base de datos
     * @param int $idArchivo identificador de archivo a eliminar
     * @return int cantidad de filas afectadas
     */
    public function eliminarAdjuntosFinanciacionModel($idArchivo) {
        return $this->eliminar('adfi_adjfinanciacio', 'adfi_ideregistr=' . $idArchivo);
    }

    public function getValorFinanciableNoFinanciable($idFactura) {
        $parametros['idfactura'] = $idFactura;
        $sql = "select (SELECT
                          COALESCE(SUM (dfac.dfac_sdoreal),0)
                         FROM
                                 dfac_detfactura dfac
                         INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                         WHERE
                                 dfac.dfac_sdoreal > 0
                         AND con.con_financiable = 'S'
                         AND dfac.fac_ideregistro = fac.fac_ideregistro
                       ) valorfinanciable,
                       (
                        SELECT
                         COALESCE(SUM (dfac.dfac_sdoreal),0)
                        FROM
                         dfac_detfactura dfac
                         INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                        WHERE
                         dfac.dfac_sdoreal > 0 AND con.con_financiable = 'N'
                         AND dfac.fac_ideregistro = fac.fac_ideregistro
                       ) valornofinanciable  from fac_factura fac where fac.fac_ideregistro=:idfactura";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0];
    }

    public function insertarInformacionFinanciera($informacion) {
        $parametros = array();
        $this->setCampo($informacion, $parametros, 'idfinanciacion', 'fin_ideregistro');
        $this->setCampo($informacion, $parametros, 'idtiposociedad', 'uni_tipsociedad');
        $this->setCampo($informacion, $parametros, 'idactividadeconomica', 'uni_actsuscripc');
        $this->setCampo($informacion, $parametros, 'nombreempresalaboral', 'fiif_nomempresa');
        $this->setCampo($informacion, $parametros, 'fechaingreso', 'fiif_fecingreso');
        $this->setCampo($informacion, $parametros, 'cantidadexperiencia', 'fiif_canexperiencia');
        $this->setCampo($informacion, $parametros, 'cargolaboral', 'uni_tipcargo');
        $this->setCampo($informacion, $parametros, 'salariofijo', 'fiif_ingsalario');
        $this->setCampo($informacion, $parametros, 'salariovariable', 'fiif_ingvarsalario');
        $this->setCampo($informacion, $parametros, 'ingresoarriendo', 'fiif_ingarriendo');
        $this->setCampo($informacion, $parametros, 'ingresoventa', 'fiif_ingventa');
        $this->setCampo($informacion, $parametros, 'otroingreso', 'fiif_desingotro');
        $this->setCampo($informacion, $parametros, 'valorotroingreso', 'fiif_ingotro');
        $this->setCampo($informacion, $parametros, 'gastofamiliar', 'fiif_egrfamilia');
        $this->setCampo($informacion, $parametros, 'gastoarriendo', 'fiif_egrarriendo');
        $this->setCampo($informacion, $parametros, 'gastofinanciero', 'fiif_egrfinancie');
        $this->setCampo($informacion, $parametros, 'gastocompra', 'fiif_egrcompra');
        $this->setCampo($informacion, $parametros, 'otrogasto', 'fiif_desegreotros');
        $this->setCampo($informacion, $parametros, 'valorotrogasto', 'fiif_egrotro');
        $this->setCampo($informacion, $parametros, 'efectivo', 'fiif_disefectivo');
        $this->setCampo($informacion, $parametros, 'activocorriente', 'fiif_disactivo');
        $this->setCampo($informacion, $parametros, 'vehiculo', 'fiif_disvehiculo');
        $this->setCampo($informacion, $parametros, 'propiedad', 'fiif_dispropiedad');
        $this->setCampo($informacion, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($informacion, $parametros, 'telefono2', 'fiif_telcelular');
        $this->setCampo($informacion, $parametros, 'telefono1', 'fiif_telfijo');

        return $this->insertar($parametros, 'fiif_fininfinancie', 'sq_fiif_ideregistr');
    }

    public function consultarDiasPeriodo($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT
                        ( per.per_fecfinal :: DATE - now() :: DATE ) diasterminoperiodo
                FROM
                        dsus_detsuscrip dsus
                INNER JOIN per_periodo per ON dsus.cic_ideregistro = per.cic_ideregistro
                WHERE
                        per.per_estado = 'A' AND dsus.dsus_ideregistr =:idsuscripcion ";
        return $this->executeQuery($sql, $parametros);
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
        
        if ((!empty($parametros['idsuscripcion']) ) && $parametros['idsuscripcion'] != -1) {
            $complemento .= 'and dsus.dsus_ideregistr=:idsuscripcion ';
        }
       
        if (!empty($parametros['codigoanterior'])) {
            $complemento .= 'and dsus.dsus_pcodigo=:codigoanterior ';
        }
        $complemento .= "and dsus.dsus_estado in ('A') ";
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
                 liq.uni_documento liq_documento, liq.uni_tipdocument liq_tipodocumento,
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
                where
                    pro.uni_municipio in (select distinct uspr.uni_municipio from uspr_usuprgpryto uspr where uspr.usu_ideregistro=:idusuario) ' . $complemento . '

                   limit 1000';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Advertencia, la suscripción no esta activa ó no existe', 0);
        }
        return $resultado;
    }
    
    
      // <editor-fold desc="Suscripción">  
    /**
     * Consulta de los conceptos de una suscripción
     * @param int $idSuscripcion identificador de la suscripción.
     * @param int $idDocumento identificador del documento.
     * @param int $idTipoDocumento identificador del tipo de documento
     * @return array Listado de las facturas.
     */
    public function consultarConceptoPorSuscripcionDocumentoModel($idSuscripcion, $idDocumento, $idtiposdocumentos) {
        $complemento = '';
        if (!empty($idDocumento)) {
            $complemento = 'and fac.uni_documento = :idDocumento ';
        }
        $parametros = array();
        $parametros['idSuscripcion'] = $idSuscripcion;
        $parametros['idDocumento'] = $idDocumento;

        $condicion = '';
        if(count($idtiposdocumentos)>0){
            $idtiposdocumentos = implode(',', $idtiposdocumentos);
            $condicion .= "AND fac.uni_tipdocument IN ($idtiposdocumentos) ";
        }
        $sql = "SELECT DISTINCT
                        con.uni_concepto idconcepto,
                        con.con_nombre concepto
                FROM
                      fac_factura fac inner join doc_documento doc on doc.uni_documento = fac.uni_documento
                inner join tido_tipdocumen tido on  tido.uni_tipdocument = fac.uni_tipdocument
                inner join  cic_ciclo cic on cic.cic_ideregistro = fac.cic_ideregistro
                inner join per_periodo per on per.per_ideregistro = fac.per_ideregistro
                inner join  dfac_detfactura dfaci on dfaci.fac_ideregistro=fac.fac_ideregistro
                INNER JOIN con_concepto con ON dfaci.uni_concepto = con.uni_concepto
                WHERE (SELECT
                                        SUM (dfac.dfac_sdoreal)
                                FROM
                                        dfac_detfactura dfac
                                INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                                WHERE
                                        dfac.dfac_sdoreal > 0
                                AND con.con_financiable = 'S'
                                AND dfac.fac_ideregistro = fac.fac_ideregistro) > 0
                AND fac.fac_estado = 'A' AND fac.fac_sdoreal > 0 AND fac.fac_idepadre IS NULL
                AND doc.doc_financiable = 'S' AND fac.dsus_ideregistr = :idSuscripcion and con.con_financiable = 'S'
                $condicion  $complemento
                ORDER BY con.con_nombre;";
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException('No existen conceptos asociadas a financiar para el suscriptor ' . $idSuscripcion, 0);
        }
        return $respuesta;
    }

     /**
     * Consulta de la restricción financiación por medio del monto o porcentaje enviado.
     * @param array con valor de porcentaje ingresado, valor de monto ingresado, empresa usuario
     * @return boolean $flag true o false existe o no restricción
     */
    public function consultarRestriccionModel($parametros) {
        $parametros["prg_finan"] = PROGRAMA_FINANCIACION;
        $sql ='SELECT upr.usu_ideregistro, lus.luspu_limiteporcentaje, lus.luspu_limitemonto 
                FROM uspu_usuprgunid upr
                inner join luspu_limitusuprgunidad lus on lus.uspu_ideregistr = upr.uspu_ideregistr
                inner join prun_prgunidad pp on upr.prun_ideregistr = pp.prun_ideregistr
                WHERE pp.prg_ideregistro=:prg_finan AND  lus.emp_ideregistro = :idempresa AND upr.usu_ideregistro = :idusuario';
        return $this->executeQuery($sql, $parametros);
    }


    // </editor-fold>
// </editor-fold>
}
