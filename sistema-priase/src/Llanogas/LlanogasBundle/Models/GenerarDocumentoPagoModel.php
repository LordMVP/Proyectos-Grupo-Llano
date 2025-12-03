<?php

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * descripcion: Contiene el modelo necesario pára generar nuevas financiaciones
 *
 * @author sergio vargas 
 * 05 /AGO / 2015
 * 
 */
class GenerarDocumentoPagoModel extends AuditoriaServices {

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     * Constructor de la clase
     * @param Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($conexion);
    }

    // <editor-fold desc="Consultas">  

    /**
     * Obtiene información detallada de la suscripción.
     * @param int $idSuscripcion identificador de la suscripción.
     * @return array Listado de las suscripciones asociadas 
     * @throws MyException Error al consultar la información.
     */
    public function consultarSuscripcionSuscriptor($idSuscripcion) {
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
     * permite evaluar si un tipo de documento puede generar suspencion
     * @param int $idtipodocumento 
     * @return character genera suspencion 
     */
    public function obtenerTipoDocumentoValidoSuspencionModel($idtipodocumento) {
        $sql = "SELECT
                        tido.tido_gensuspend suspension
                FROM
                        tido_tipdocumen tido
                WHERE
                        tido.uni_tipdocument = $idtipodocumento";
        $resultado = $this->executeQuery($sql);
        return $resultado[0];
    }
    
     /**
     * permite validar si la empresa con la que se autentico el usuario
     * permite cobro de intereses para abonos o reestructuraciones
      * y el documento para los abonos
     * @param int $idempresa
     * @return array con el valor que indica si se permite o no el pago de interese 
      * parciales o totales 
     */
     public function cobrar_interes_abono_financiacion ($idempresa) {
        $parametros['id_empresa'] = $idempresa;
        
        $sql = "SELECT 
                    COALESCE( 
                        (json_extract_path_text(parametrosmodelo.parametro,'int_abono_parcial')::varchar), 
                        'no'
                    ) abono_parcial , 
                    COALESCE(
			(json_extract_path_text(parametrosmodelo.parametro,'int_abono_total')::varchar) , 'no' 
                    ) int_abon_total  ,
                    COALESCE( 
                        (json_extract_path_text(parametrosmodelo.parametro,'tip_doc_felec')::varchar), 
                        'DF'
                    ) tip_doc_felec , 
                    COALESCE(
			(json_extract_path_text(parametrosmodelo.parametro,'tip_doc_no_felec')::varchar) , 'DF' 
                    ) tip_doc_no_felec  
                FROM(                       
                        SELECT json_extract_path_text(datos.par_parametro,'ABONOS')::json parametro 
			FROM par_parametro as datos 
                        WHERE emp_ideregistro =:id_empresa
                    ) as parametrosmodelo ";    
        return $this->executeQuery($sql, $parametros)[0];
    }
    
     /**
     * permite validar si un concepto de una financiacion es base
     * para la liquidacion de interes
     * @param int $uniconcepto
     * @param int $idamfi
     * @return int cantidad de registros 
     */
     public function val_concepto_base($uniconcepto, $idamfi) {
        $parametros['idconcepto'] = $uniconcepto;
        $parametros['idamfi'] = $idamfi;
        $sql = "SELECT COUNT (*) AS con_base "
             . "FROM amfi_amofinanci amff "
             . "   INNER JOIN coli_conliquida cll ON cll.uni_liquidacion = amff.uni_liquidacion "
             . "   INNER JOIN core_conrelacio core ON core.uni_concepto=cll.uni_concepto "
             . "      AND core.uni_conrelacion =:idconcepto "
             . "WHERE amff.amfi_ideregistr  =:idamfi ";
        return $this->executeQuery($sql, $parametros)[0]['con_base'];
    }
    /**
     * Consulta los dias trascurridos desde el final del perido de la ultima liquidacion
     * y si no hay facturas de amortizacion desde la fecha de la financiacion
     * para la liquidacion de interes
     * @param int $idamfi  id de la tabla amfi
     * @return int cantidad de dias  
     */
     public function consultar_dias_interes ($idamfi) {
        $parametros['idamfi'] = $idamfi;
        $sql = "
                SELECT finn.fin_ideregistro ,
                    (CASE 
                        WHEN 
                            (prr.per_fecfinal::DATE is not NULL) 
                        THEN 
                            (CASE 
                                WHEN  
                                    (now()::DATE - prr.per_fecfinal::DATE) > 0 
                                THEN
                                    (now()::DATE - prr.per_fecfinal::DATE)
                                ELSE 0
                            END)
                        ELSE 
                            (now()::DATE - finn.fin_fecha::DATE)
                        END
                    ) as dias_fac
                FROM fin_financiacio finn
                    INNER JOIN amfi_amofinanci amm ON amm.fin_ideregistro =  finn.fin_ideregistro 
                    LEFT JOIN fac_factura fcc on fcc.fin_ideregistro = finn.fin_ideregistro 
                        and fcc.uni_documento = amm.uni_documento and fcc.fac_estado not in ('E')  
                    LEFT JOIN per_periodo prr ON prr.per_ideregistro = fcc.per_ideregistro
                WHERE amm.amfi_ideregistr =:idamfi 
                ORDER BY fcc.fac_ideregistro DESC limit 1 ";
        return $this->executeQuery($sql, $parametros)[0]['dias_fac'];
        //return 15 ;
    }
    /**
     * Consulta la tasa de interes corriente y si aplica la tasa de interes del iva
     * para la liquidacion de interes
     * @param int $idamfi  id de la tabla amfi
     * @return registro con la tasa de interes y la tasa del iva
     */
     public function consultar_tasas_interes ($idamfi) {
        $parametros['idamfi'] = $idamfi;
        $sql = "
                SELECT
                    amm.fin_ideregistro ,
                    (con.con_formula::json->0->>'valor')::NUMERIC(20,7) interes,
                    (CASE 
                        WHEN (LENGTH(cn.con_formula))>0 
                        THEN
                            (cn.con_formula::json->0->>'valor')::NUMERIC(20,7)
                        ELSE
                            0
                    END) tasaivainteres,
                    con.uni_concepto idconceptointeres,
                    COALESCE(cn.uni_concepto,0) idconceptoivainteres
                FROM amfi_amofinanci amm 
                    INNER JOIN fin_financiacio fnn on fnn.fin_ideregistro = amm.fin_ideregistro
                    INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion = amm.uni_liquidacion
                        AND liq.liq_venclasific='FI' 
                    INNER JOIN coli_conliquida coli ON liq.uni_liquidacion = coli.uni_liquidacion
                    INNER JOIN con_concepto con ON con.uni_concepto=coli.uni_concepto
                        AND con.con_intfinanciacion='S'
                    INNER JOIN esem_estempresa esem ON liq.est_liquidacion=esem.est_ideregistro
                        AND esem.emp_ideregistro=fnn.emp_ideregistro 
                    LEFT JOIN core_conrelacio core ON con.uni_concepto=core.uni_conrelacion
                    LEFT JOIN con_concepto cn ON cn.uni_concepto=core.uni_concepto
                    WHERE amm.amfi_ideregistr=:idamfi ";
        return $this->executeQuery($sql, $parametros)[0];
    }

    /**
     * permite obtener la cantidad de dias de suspension que se tiene actualmente
     * @param int $idtipodocumento 
     * @return int dias de suspension
     */
    public function obtenerDiasSuspensionModel($idliquidacion) {
        $sql = "SELECT
                        CASE
                WHEN liq.liq_diasuspens IS NULL THEN
                        0
                ELSE
                        liq.liq_diasuspens
                END dias
                FROM
                        liq_liquidacion liq
                WHERE
                        uni_liquidacion = $idliquidacion";
        $resultado = $this->executeQuery($sql);
        return $resultado[0];
    }

    /**
     * Filtro de las suscripciones
     * @param int $documento cédula del suscriptor.
     * @param string $codanterior código anterior
     * @param int $suscripcion identificador de la suscripción.
     * @return type
     */
    public function filtrarSuscripcionesFinanciablesModel($documento = "", $codanterior = "", $suscripcion = "") {
        $complementoSql = NULL;
        if (!empty($documento)) {
            $complementoSql .= " AND ter.ter_documento = :numdocumento ";
            $parametros["numdocumento"] = $documento;
        }
        if (!empty($codanterior)) {
            $complementoSql .= " AND dsus.dsus_pcodigo = :codanterior ";
            $parametros["codanterior"] = $codanterior;
        }
        if (!empty($suscripcion)) {
            $complementoSql .= " AND dsus.dsus_ideregistr = :idsuscripcion ";
            $parametros["idsuscripcion"] = $suscripcion;
        }
        $sql = " SELECT DISTINCT
                        dsus.dsus_ideregistr idsuscripcion,
                        ter.ter_ideregistro idtercero,
                        ter.ter_documento documento,
                        ter.ter_nomcompleto nombre,
                        dsus.dsus_pcodigo codanterior,
                        dsus.dsus_estado estado,
                        dsus.uni_tipsuscripc idtiposuscripcion,
                        tsu.tsu_nombre tiposuscripcion,
                        pro.pro_direccion direccion,
                        dsus.sus_ideregistro idsuscriptor
                FROM
                        sus_suscripcion sus
                INNER JOIN ter_tercero ter ON sus.ter_ideregistro = ter.ter_ideregistro
                INNER JOIN dsus_detsuscrip dsus ON sus.sus_ideregistro = dsus.sus_ideregistro
                INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro = pro.pro_ideregistro
                INNER JOIN fin_financiacio fin ON dsus.dsus_ideregistr = fin.dsus_ideregistr
                LEFT JOIN tsu_tipsuscripc tsu ON dsus.uni_tipsuscripc = tsu.uni_tipsuscripc
                WHERE
                        dsus.dsus_estado = 'A'
                AND fin.fin_estado IN ('A', 'R')
                AND fin_sdocapital > 0 $complementoSql  ";
        $this->setSql($sql);
        $this->setParams($parametros);
        $resultado = $this->execute();
        return $resultado;
    }

    /**
     * permite obtener el conceptos financiables
     * @param int $idfinanciacion
     * @return Array conceptos financiables
     */
    public function obtenerConceptosFinanciablesModel($idfinanciacion) {
        $sql = "SELECT
                        dfin.dfin_ideregistr iddetallefinanciacion,
                        dfin.uni_concepto idconcepto,
                        dfin.dfin_sdoreal saldo,
                        con.con_nombre nombre,
                        dfin.dfin_version AS version                 
                        
                FROM
                        dfin_detfinanci dfin
                INNER JOIN con_concepto con ON con.uni_concepto = dfin.uni_concepto
                WHERE
                        dfin.fin_ideregistro = :idfinanciacion and dfin.dfin_sdoreal>0";
        $parametros["idfinanciacion"] = $idfinanciacion;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta la información de la amortización
     * @param int $idamortizacion identificador de la amortización.
     * @return Array  listado de amortizacion disponibles
     * @throws MyException Error consultando el detalle de la amortización
     */
    public function obtenerAmortizacionFinanciacion($idamortizacion) {
        $parametros["idamortizacion"] = $idamortizacion;
        $sql = "SELECT 
                    amfi_estado,
                    amfi_numcuotas,
                    amfi_cuoamortiz,
                    amfi_fecha,
                    fin_ideregistro,
                    uni_liquidacion,
                    uni_documento,
                    uni_tipdocument,
                    dsus_ideregistr,
                    emp_ideregistro,
                    cic_ideregistro,
                    per_ideregistro,
                    cic_ano,
                    usu_ideregistro
                FROM amfi_amofinanci 
                WHERE  amfi_ideregistr= :idamortizacion";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error consultando el detalle de la amortización', -1);
        }
        return $resultado[0];
    }

    /**
     * Consulta la financiación por un identificador.
     * @param int $idFinanciacion Identificador de la financiación
     * @return array Listado de los detalles de la financiación.
     */
    public function obtenerFinanciacion($idFinanciacion) {
        $parametros['idfinanciacion'] = $idFinanciacion;
        $sql = '
          select
                *
                 from fin_financiacio fin where fin.fin_ideregistro=:idfinanciacion';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró una financiación válida', -1);
        }
        return $resultado[0];
    }

    /**
     * permite actualizar el saldo de la financiacion
     * @param int $idfinanciacion identificador de la financiacion
     * @param float $nuevosaldo nuevo saldo de la financiacion
     * @throws MyException No se puede actualizar el saldo de la financiación
     */
    public function actualizarSaldoFinanciacion($idfinanciacion, $nuevosaldo) {
        $parametros['fin_ideregistro'] = $idfinanciacion;
        $parametros['fin_sdocapital'] = $nuevosaldo;
        $parametros['fin_estado'] = $nuevosaldo == 0 ? 'C' : 'A';
        $resultado = $this->actualizar($parametros, 'fin_financiacio', 'fin_ideregistro= :fin_ideregistro');
        if (empty($resultado)) {
            throw new MyException('No se puede actualizar el saldo de la financiación', -1);
        }
        return $resultado[0];
    }
    
    /**
     * permite actualizar el saldo del detalle de la financiacion
     * @param int $iddetallefinanciacion identificador de la financiacion
     * @param float $nuevosaldo nuevo saldo de la financiacion
     * @throws MyException No se puede actualizar el saldo de la financiación

      public function actualizarSaldoDetalleFinanciacion($iddetallefinanciacion, $nuevosaldo) {
      $parametros['dfin_ideregistr'] = $iddetallefinanciacion;
      $parametros['dfin_sdoreal'] = $nuevosaldo;
      $parametros['dfin_vlrreal'] = $nuevosaldo;
      $parametros['dfac_sdoreal'] = $nuevosaldo;
      $parametros['dfac_vlrtotal'] = $nuevosaldo;
      $parametros['dfac_vlrunitari'] = $nuevosaldo;
      $resultado = $this->actualizar($parametros, 'dfin_detfinanci', 'dfin_ideregistr= :dfin_ideregistr');
      if (empty($resultado)) {
      throw new MyException('No se puede actualizar el saldo de la financiación', -1);
      }
      return $resultado[0];
      } */

    /**
     * Consulta los detalles de la financiación.
     * @param int $idFinanciacion Identificador de la financiación
     * @return array Listado de los detalles de la financiación.
     */
    public function obtenerDetallesFinanciaciones($idFinanciacion) {
        $parametros['idfinanciacion'] = $idFinanciacion;
        $sql = '
        SELECT
                dfin.fin_ideregistro iddetallefinanciacion,
                dfin.fin_ideregistro idfinanciacion,
                dfin.dfac_ideregistr iddetallefactura,
                dfin.fac_ideregistro idfactura,
                dfin.dsus_ideregistr idsuscripcion,
                dfin.uni_liquidacion idliquidacion,
                dfin.uni_concepto idconcepto,
                dfin.dfin_ideregistr iddetallefinanciacion,
                dfin.emp_ideregistro idempresa,
                dfin.dfin_sdoreal saldo,
                dfac_vlrunitari valorunitario,
                dfac_vlrtotal valortotal
        FROM
                dfin_detfinanci dfin
        WHERE
                dfin.fin_ideregistro =:idfinanciacion
        AND dfin_idepadre IS NULL
        AND dfin.dfin_sdoreal > 0 ';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta los detalles de la financiación.
     * @param int $idfinanciacion Identificador de la financiación
     * @return array Listado de los detalles de la financiación.
     */
    public function obtenerSaldoTotalFinanciacionModel($idfinanciacion) {
        $parametros['idfinanciacion'] = $idfinanciacion;
        $sql = 'SELECT
                            sum(dfin.dfin_sdoreal) saldo
                    FROM
                            fin_financiacio fin
                    INNER JOIN dfin_detfinanci dfin ON fin.fin_ideregistro = dfin.fin_ideregistro
                    WHERE
                            fin.fin_ideregistro = :idfinanciacion';

        $respuesta = $this->executeQuery($sql, $parametros);

        if (empty($respuesta)) {
            throw new MyException('No existe la financiación seleccionada', -1);
        }
        return $respuesta[0];
    }

    /**
     * Consulta los detalles de la financiación.
     * @param int $iddetallefinanciacion Identificador de la financiación
     * @return array Listado de los detalles de la financiación.
     */
    public function obtenerDetalleFinanciacion($iddetallefinanciacion) {
        $parametros['iddetallefinanciacion'] = $iddetallefinanciacion;
        $sql = 'SELECT
                        dfin.fin_ideregistro idfinanciacion,
                        dfin.dfac_ideregistr iddetallefactura,
                        dfin.fac_ideregistro idfactura,
                        dfin.dsus_ideregistr idsuscripcion,
                        dfin.uni_liquidacion idliquidacion,
                        dfin.uni_concepto idconcepto,
                        dfin.dfin_ideregistr iddetallefinanciacion,
                        dfin.emp_ideregistro idempresa,
                        dfin.dfin_sdoreal saldo,
                        dfac_vlrunitari valorunitario,
                        dfac_vlrtotal valortotal
                FROM
                        dfin_detfinanci dfin
                WHERE
                        dfin.dfin_ideregistr = :iddetallefinanciacion';
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException('No existe el concepto seleccionado', -1);
        }
        return $respuesta[0];
    }

// </editor-fold>
    // <editor-fold desc="Proceso de Pago">  
    //   
    /**
     * Permite actualizar el estado de la amortización
     * @param type $idamortizacion
     * @param char $estado recibe el estado de la amortización a incluir C para Finalizar R para reestructurar
     * @throws MyException No se pudo modificar la amortización
     */
    public function actualizarAmortizacionFinanciacion($idamortizacion, $estado) {
        $parametros['amfi_ideregistr'] = $idamortizacion;
        $parametros['amfi_estado'] = $estado;
        $resultado = $this->actualizar($parametros, 'amfi_amofinanci', 'amfi_ideregistr= :amfi_ideregistr');
        if (empty($resultado)) {
            throw new MyException('No se pudo modificar la amortización');
        }
        return $resultado;
    }

    /**
     * Genera un nuevo registro de las amortizaciones
     * @param array $financiacion información de la financiacion que se quiere amortizar
     * @return bool TRUE insertar FALSE error
     */
    public function insertarAmortizacionFinanciacion($financiacion) {
        return $this->insertar($financiacion, 'amfi_amofinanci', 'sq_amfi_ideregistr');
    }

    /**
     * Inserta una nueva factura
     * @param array $info información de la factura
     * @return int identificador de la nueva factura.
     */
    public function insertarFacturaDocumentoPago($info) {
        $suscripcion = $this->genericoModel->consultarInformacionSuscripcion($info['idsuscripcion']);
        $parametros['fac_metgenera'] = 'P';
        $parametros['fac_estado'] = 'A';
        $parametros['fac_fecha'] = 'now()';
        $parametros['fac_fecaprobada'] = 'now()';
        $parametros['fac_fecvence'] = $info['fechavencimiento'];
        $parametros['emp_ideregistro'] = $info['idempresa'];
        $parametros['sus_ideregistro'] = $suscripcion['idsuscriptor'];
        $parametros['dsus_ideregistr'] = $info['idsuscripcion'];
        $parametros['uni_tipsuscripc'] = $suscripcion['idtiposuscripcion'];
        $parametros['uni_tipusosuscr'] = $suscripcion['idtipousosuscripcion'];
        $parametros['uni_liquidacion'] = $info['idliquidacion'];
        $parametros['ter_ideregistro'] = $suscripcion['idtercero'];
        $parametros['cic_ideregistro'] = $info['idciclo'];
        $parametros['per_ideregistro'] = $info['idperiodo'];
        $parametros['uni_documento'] = $info['iddocumento'];
        $parametros['uni_tipdocument'] = $info['idtipodocumento'];
        $parametros['hliq_ideregistr'] = 0;
        $parametros['fac_sdoreal'] = abs($info['valordocumento']);
        $parametros['fac_vlrreal'] = abs($info['valordocumento']);
        $parametros['cic_ano'] = $info['cicloanio'];
        $parametros['uni_tiptercero'] = $info['idtipotercero'];
        $parametros['usu_ideregistro'] = $info['idusuario'];
        $parametros['fac_fecsuspens'] = $info['fechasuspension'];
        $parametros['fin_ideregistro'] = $info['idfinanciacion'];

        return $this->insertar($parametros, 'fac_factura', 'sq_fac_ideregistro');
    }

    /**
     * Insertar nuevo detalle de una factura.
     * @param array $detalleDocumentoPago información de los nuevos documentos.
     * @return int identificador del detalle
     */
    public function insertarDetalleFacturaDocumentoPago($detalleDocumentoPago) {
        $parametros['dfac_estado'] = 'A';
        $parametros['dfac_cantidad'] = 1;
        $parametros['dfac_vlrunitari'] = ($detalleDocumentoPago['saldo']);
        $parametros['dfac_vlrtotal'] = ($detalleDocumentoPago['saldo']);
        $parametros['dfac_vlrreal'] = ($detalleDocumentoPago['saldo']);
        $parametros['dfac_sdoreal'] = $detalleDocumentoPago['saldo'];
        $parametros['fac_ideregistro'] = $detalleDocumentoPago['idfactura'];
        $parametros['uni_concepto'] = $detalleDocumentoPago['idconcepto'];
        $parametros['dfin_ideregistr'] = $detalleDocumentoPago['iddetallefinanciacion'];
        $parametros['usu_ideregistro'] = $detalleDocumentoPago['idusuario'];
        return $this->insertar($parametros, 'dfac_detfactura', 'sq_dfac_ideregistr');
    }

    /**
     * Inserta un nuevo detalle de documento
     * @param array $financiacion Información de la financiación.
     * @return int identificador del nuevo detalle
     */
    public function insertarFinanciacionParaNota($financiacion) {
        $parametros['fin_inicapital'] = abs($financiacion['documentoPago']) * -1;
        $parametros['fin_estado'] = 'A';
        $parametros['fin_sdocapital'] = abs($financiacion['documentoPago']) * -1;
        $parametros['fin_fecha'] = 'now()';
        $parametros['dsus_ideregistr'] = $financiacion['idsuscripcion'];
        $parametros['ter_idesolicita'] = $financiacion['idtercero'];
        $parametros['cic_ideregistro'] = $financiacion['idciclo'];
        $parametros['per_ideregistro'] = $financiacion['idperiodo'];
        $parametros['emp_ideregistro'] = $financiacion['idempresa'];
        $parametros['cic_ano'] = $financiacion['cicloanio'];
        $parametros['usu_ideregistro'] = $financiacion['idusuario'];
        $parametros['fin_ideorigen'] = $financiacion['financiacionOrigen'];
        $parametros['fin_idepadre'] = $financiacion['financiacionOrigen'];
        $parametros['usu_ideregistro'] = $financiacion['idusuario'];

        return $this->insertar($parametros, 'fin_financiacio', 'sq_fin_ideregistro');
    }

    /**
     * Inserta un nuevo detalle de documento
     * @param array $detalleFinanciacion Información de la financiación.
     * @return int identificador del nuevo detalle
     */
    public function insertarDetalleFinanciacionParaNota($detalleFinanciacion) {
        $parametros['fin_ideregistro'] = $detalleFinanciacion['idfinanciacionnota'];
        $parametros['dfac_ideregistr'] = $detalleFinanciacion['iddetallefactura'];
        $parametros['fac_ideregistro'] = $detalleFinanciacion['idfacturaOriginal'];
        $parametros['dsus_ideregistr'] = $detalleFinanciacion['idsuscripcion'];
        $parametros['uni_liquidacion'] = $detalleFinanciacion['idliquidacion'];
        $parametros['uni_concepto'] = $detalleFinanciacion['idconcepto'];
        $parametros['dfac_vlrunitari'] = $detalleFinanciacion['valorunitario'];
        $parametros['dfac_vlrtotal'] = $detalleFinanciacion['valortotal'];
        $parametros['dfin_vlrreal'] = abs($detalleFinanciacion['saldo']) * -1;
        $parametros['dfac_sdoreal'] = abs($detalleFinanciacion['saldo']);
        $parametros['dfin_sdoreal'] = abs($detalleFinanciacion['saldo']) * -1;
        $parametros['emp_ideregistro'] = $detalleFinanciacion['idempresa'];
        $parametros['dfin_ideorigen'] = $detalleFinanciacion['iddetallefinanciacion'];
        $parametros['dfin_idepadre'] = $detalleFinanciacion['iddetallefinanciacion'];
        $parametros['usu_ideregistro'] = $detalleFinanciacion['idusuario'];
        $parametros['dfin_fecha'] = 'now()';
        $parametros['cic_ano'] = $detalleFinanciacion['cicloanio'];
        $parametros['cic_ideregistro'] = $detalleFinanciacion['idciclo'];
        $parametros['per_ideregistro'] = $detalleFinanciacion['idperiodo'];

        return $this->insertar($parametros, 'dfin_detfinanci', 'sq_dfin_ideregistr');
    }

    /**
     * Actualiza la información de una factura.
     * @param array $parametros información de la nueva factura.
     * @return int número de filas afectadas.
     */
    public function actualizarFactura($parametros) {
        return $this->actualizar($parametros, 'fac_factura', 'fac_ideregistro= :fac_ideregistro');
    }

// </editor-fold>
    // <editor-fold desc="registro de notas">  
    /**
     * Crea una nueva nota
     * @param array $parametrosNota Información de las nota
     * @return int identificador de las nueva nota
     */
    public function insertarNotaModel($parametrosNota) {
        $cicloperiodo = $this->genericoModel->getCicloPeriodoSuscripcion($parametrosNota['idsuscripcion']);
        $parametros['not_fecha'] = 'now()';
        $parametros['not_comentario'] = 'Nota Documento  de Pago';
        $parametros['uni_motnota'] = UNIDAD_DOCUMENTO_PAGO;
        $parametros['dsus_ideregistr'] = $parametrosNota['idsuscripcion'];
        $parametros['cic_ideregistro'] = $cicloperiodo['idciclo'];
        $parametros['per_ideregistro'] = $cicloperiodo['idperiodo'];
        $parametros['est_motnota'] = ESTRUCTURA_NOTA;
        $parametros['emp_ideregistro'] = $parametrosNota['idempresa'];
        $parametros['cic_ano'] = $cicloperiodo['cicloanio'];
        $parametros['usu_ideregistro'] = $parametrosNota['idusuario'];
        return $this->insertar($parametros, 'not_nota', 'sq_not_ideregistro');
    }

    /**
     * Permite crear una nueva de financiación
     * @param notaFinanciacion $notaFinanciacion
     */
    public function insertarNotaFinanciacion($notaFinanciacion) {
        $parametros['not_ideregistro'] = $notaFinanciacion['idnotadocumentopago'];
        $parametros['fin_ideorigen'] = $notaFinanciacion['idfinanciacion'];
        $parametros['fin_ideregistro'] = $notaFinanciacion['idfinanciacionnota'];
        $parametros['dfin_ideorigen'] = $notaFinanciacion['iddetallefinanciacion'];
        $parametros['dfin_ideregistr'] = $notaFinanciacion['iddetallefinanciacionnota'];
        $parametros['usu_ideregistro'] = $notaFinanciacion['idusuario'];

        return $this->insertar($parametros, 'nofi_notfinanci', 'sq_nofi_ideregistr');
    }

    public function consultarTablaFinanciacion($idsuscripcion) {
        $parametros['idsuscripcion'] = $idsuscripcion;
        $sql = "SELECT
                        fin.fin_ideregistro idfinanciacion,
                        amfi.amfi_ideregistr idamortizacionfinanciacion,
                        amfi.amfi_numcuotas numerocuotas,
                        amfi.amfi_cuoamortiz cuotasamortizadas,
                        amfi.uni_liquidacion idliquidacion,
                        amfi.uni_documento iddocumento,
                        amfi.uni_tipdocument idtipodocumento,
                        tido.tido_maxcuoabonok maximodocumento,
                        liq.liq_nombre liquidacion,
                        (
                                amfi.amfi_numcuotas - amfi.amfi_cuoamortiz
                        ) cuotaspendientes,
                        round(fin.fin_sdocapital,0) saldocapital,
                        fin_version AS VERSION
                FROM
                        fin_financiacio fin
                INNER JOIN amfi_amofinanci amfi ON fin.fin_ideregistro = amfi.fin_ideregistro
                INNER JOIN liq_liquidacion liq ON amfi.uni_liquidacion = liq.uni_liquidacion
                INNER JOIN tido_tipdocumen tido ON tido.uni_tipdocument = liq.uni_tipdocument
                WHERE
                        fin.fin_estado IN ('A', 'R')
                AND amfi.amfi_estado = 'A'
                AND fin.fin_sdocapital > 0
                AND fin.dsus_ideregistr =:idsuscripcion";
        return $this->executeQuery($sql, $parametros);
    }

    public function consultarValorActualFinanciacion($idFinanciacion) {
        $sql = " select coalesce(sum(dfin_vlrreal),0) valor 
                from dfin_detfinanci where fin_ideregistro=$idFinanciacion";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['valor'];
    }
     /**
     * Consulta el saldo de los conceptos que son base para calculo del interes.
     * @param int $idfinanciacion Identificador de la financiación
     * @return int valor del saldo de los conceptos base de la financiación.
     */
    public function obtenerSaldoConceptosBase($idfinanciacion) {
        $parametros['idfinanciacion'] = $idfinanciacion;
        $sql = " SELECT  
			SUM ( dfinn.dfin_sdoreal ) saldo_base 
                FROM  dfin_detfinanci dfinn 
                    INNER JOIN amfi_amofinanci amm ON amm.fin_ideregistro =  dfinn.fin_ideregistro
                        AND amm.amfi_estado = 'A'
                    INNER JOIN core_conrelacio core ON core.uni_conrelacion = dfinn.uni_concepto 
                    INNER JOIN coli_conliquida coli on core.uni_concepto=coli.uni_concepto
                        AND coli.uni_liquidacion = amm.uni_liquidacion 
                WHERE  dfinn.fin_ideregistro = :idfinanciacion AND dfin_idepadre IS NULL";

        $respuesta = $this->executeQuery($sql, $parametros);

        if (empty($respuesta)) {
            return 0 ;
        }
        return $respuesta[0]['saldo_base'];
    }
    
    public function consultaDiasAmortizacion ($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT  COALESCE(((datos.par_parametro::json ->>'ABONOS')::JSON->>'dias_amortizacion'),'30') diasamortizacion
			FROM par_parametro as datos WHERE emp_ideregistro =:idempresa";
        return $this->executeQuery($sql, $parametros)[0]['diasamortizacion'];
        //return 15 ;
    }

// </editor-fold>
}
