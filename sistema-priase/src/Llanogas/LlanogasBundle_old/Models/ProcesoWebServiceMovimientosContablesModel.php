<?php

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * un modelo generico para los procesos de castigo de la cartera
 * @author sergio vargas
 */
class ProcesoWebServiceMovimientosContablesModel extends AuditoriaServices {

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

    // <editor-fold desc="Consultas de encabezado">  
    /**
     * permite obtner el listado de movimientos contables activos
     * @param integer $idempresa identificador de la empresa
     * @param integer $idciclo identificador del ciclo
     * @param integer $idusuario identificador del usuario
     * @return array listado de movimientos contables activos
     * @throws MyException  No existen movimientos contables activos
     */
    public function ObtenerMovimientosContables($idempresa, $idciclo, $idusuario) {
        $sql = "SELECT	DISTINCT 
			mvi.mvi_fecha fecha,
                        mvi.mvi_ideregistro ID
                FROM
                        mvi_movimiento mvi
                INNER JOIN emv_expmovimient emv ON emv.mvi_ideregistro = mvi.mvi_ideregistro
                INNER JOIN top_tipoperacion top ON top.top_ideregistro = emv.top_ideregistro
                INNER JOIN usto_usutipopera usto ON usto.top_ideregistro = emv.top_ideregistro
                WHERE mvi.mvi_estado = 'G'
                AND mvi.emp_ideregistro = :idempresa
		AND usto.usu_ideregistro = :idusuario
                AND mvi.cic_ideregistro = :idciclo
                AND (
                        SELECT
                                COUNT (*)
                        FROM
                                emv_expmovimient emv1
                        WHERE
                                emv1.mvi_ideregistro = mvi.mvi_ideregistro
                ) > 0 order by mvi.mvi_ideregistro";
        $parametros['idempresa'] = $idempresa;
        $parametros['idciclo'] = $idciclo;
        $parametros['idusuario'] = $idusuario;
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException('No existen movimientos contables activos', -1);
        }
        return $respuesta;
    }

    /**
     * lista los detalles del movimeinto 
     * @param integer $idmovimiento tipo de movimiento
     */
    public function obtenerDetalleMovimientoContable($idmovimiento, $idtipomovimiento, $idusuario) {
        $sql = "SELECT
                        emv.emv_fecha fecha,
                        emv.doto_tipo tipo,
                        pro.proyecto_nom municipio,
                        usu.usuario_nom usuario,
                        emv_ideregistro idmovimientoexportacion,
                        emv_comentario comentario,
                        emv.emv_estado estado,
                        emv.emv_ideseven idseven,
                        emv.emv_fecaproba fechaaprobacion,
                        emv.emv_fecexporta fechaexportacion,
                        emv.emv_fecelimina fechaeliminacion,
                        top.top_codigo || ' - ' || top.top_nombre tipooperacion
                FROM
                        emv_expmovimient emv
                INNER JOIN proyectos pro ON pro.proyecto_ideregistro = emv.uni_municipio
                INNER JOIN usuarios usu ON usu.usu_ideregistro = emv.usu_ideregistro
                INNER JOIN top_tipoperacion top ON top.top_ideregistro = emv.top_ideregistro
                INNER JOIN usto_usutipopera usto ON usto.top_ideregistro = emv.top_ideregistro
                WHERE
                        emv.mvi_ideregistro = $idmovimiento
                AND emv.doto_tipo = '$idtipomovimiento'
                AND usto.usu_ideregistro = $idusuario
                ORDER BY
                        fecha ASC";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException('No existen detalles de movimientos a enviar', 0);
        }
        return $respuesta;
    }

    //</editor-fold>
    // <editor-fold defaultstate="collapsed" desc="Estados Exportación a contabilización">

    /**
     * Permite establecer que este encabezado de exportación esta aprobado para ser enviado
     * @param int $idexportacionMovimiento identificador de exportación de movimiento
     * @param char $estado Valida el estado en el cual se define el tipo de transacción a ejecutar estado { A = aprobado, X= Exportado, T= Transmitido }
     * @param varchar $comentario Mensaje de error generado   
     * @param int $consecutivoseven código de respuesta de seven que marca el proceso como generado satisfactoriamente
     */
    public function cambiarEstadoMovimientoContableModel($idexportacionMovimiento, $estado, $comentario = null, $consecutivoseven = null) {
        $data['emv_ideregistro'] = $idexportacionMovimiento;
        $data['emv_estado'] = $estado;

        if ($estado == 'A') {
            $data['emv_fecaproba'] = 'now()';
        }
        if ($estado == 'X' || $estado == 'T') {
            $data['emv_fecexporta'] = 'now()';
        }
        if ($estado == 'R' || $estado == 'T') {
            $data['emv_comentario'] = $comentario;
        }
        if ($estado == 'X') {
            $data['emv_ideseven'] = $consecutivoseven;
        }
        if ($estado == 'E') {
            $data['emv_fecelimina'] = 'now()';
        }
        $this->actualizar($data, 'emv_expmovimient', 'emv_ideregistro=:emv_ideregistro');
    }

    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc="Acceso a movimientos contables">

    /**
     * Permite obtener la información del movimiento contable
     * @param int $idmovimiento carga la información del movimiento contable
     */
    public function obtenerListadoMovimientoContable($idmovimiento) {
        $sql = "";
        $parametros['idmovimiento'] = $idmovimiento;
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException('No existen detalles de movimientos a enviar', -1);
        }
        return $respuesta;
    }

    //</editor-fold>
    // <editor-fold defaultstate="collapsed" desc="Informacion Movimietos Contables">

    /**
     * permite cargar los encabezados de los movimientos contables a ejecutar
     * @return Array listado de encabezados a procesar
     */
    public function ObtenerEncabezadosMovimientoContableModel($idmovimiento) {

        $sql = "SELECT DISTINCT
                        mvi.emp_ideregistro emp_codi,
                        top.top_codigo top_codi,
                        emv.emv_ideregistro mco_nume,
                        to_char(emv.emv_fecha, 'YYYY-MM-DD') mco_fech,
                        mvmc.mvmc_modcodi mod_codi,
                        mvmc.mvmc_arbcsuc arb_csuc,
                        mvmc.mvmc_mcodesc mco_desc
                FROM
                        emv_expmovimient emv
                INNER JOIN mvi_movimiento mvi ON mvi.mvi_ideregistro = emv.mvi_ideregistro
                INNER JOIN mvmc_movmconseven mvmc ON mvmc.emv_ideregistro = emv.emv_ideregistro
                INNER JOIN top_tipoperacion top ON top.top_ideregistro = mvmc.top_ideregistro
                WHERE
                      emv_estado in( 'A', 'R') and emv.emv_ideregistro= $idmovimiento  LIMIT 1";

        return $this->executeQuery($sql);
    }

    /**
     * carga el detalle de encabezado a enviar al servicio web 
     * @param int $idexportaciarmovimiento identificador de movimiento a exportar
     * @return type
     */
    public function ObtenerDetalleMovimientoContableModel($idexportaciarmovimiento) {
        $sql = "SELECT
                        emv.emv_ideregistro,
                        mvmc.mvmc_cuecodi cue_codi,
                        mvmc.mvmc_dmcdesc dmc_desc,
                        cast(mvmc.mvmc_dmccant as int)  dmc_cant,
                        mvmc.mvmc_dmcacti dmc_acti,
                        mvmc.mvmc_dmcrefe dmc_refe,
                        mvmc.mvmc_dmcvadb dmc_vadb,
                        mvmc.mvmc_dmcvacr dmc_vacr,
                        mvmc.mvmc_dmcvaba dmc_vaba,
                        mvmc.mvmc_tercoda ter_coda,
                        mvmc.mvmc_arbcodc arb_codc,
                        mvmc.mvmc_arbcoda arb_coda,
                        mvmc.mvmc_arbcodp arb_codp,
                        mvmc.mvmc_arbcods arb_cods,
                        mvmc.mvmc_tercodm ter_codm
                FROM
                        emv_expmovimient emv
                INNER JOIN mvi_movimiento mvi ON mvi.mvi_ideregistro = emv.mvi_ideregistro
                INNER JOIN mvmc_movmconseven mvmc ON mvmc.emv_ideregistro = emv.emv_ideregistro
                INNER JOIN top_tipoperacion top ON top.top_ideregistro = mvmc.top_ideregistro
                WHERE
                        emv.emv_ideregistro =$idexportaciarmovimiento";


        return $this->executeQuery($sql);
    }

    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="Informacion Nota caja">
    /**
     * Permite obtener el encabezado de nota caja
     * @return type
     */
    public function ObtenerEncabezadoNotaCajaModel($idmovimiento) {
        $sql = "SELECT DISTINCT
                        mvi.emp_ideregistro emp_codi,
                        top.top_codigo top_codi,
                        emv.emv_ideregistro nca_nume,
                        to_char(emv.emv_fecha, 'DD/MM/YYYY') nca_nech,
                        mvnc.mvnc_ncanatu nca_natu,
                        mvnc.mvnc_tercoda ter_coda,
                        mvnc.mvnc_cajcodi caj_codi,
                        mvnc.mvnc_ncavalo nca_valo, 
                        mvnc.mvnc_ncafopa nca_fopa,
                        mvnc.mvnc_cflcodi cfl_codi,
                        mvnc.mvnc_dcovalo dco_valo,
                        mvnc.mvnc_dfochec dfo_chec,
                        mvnc.mvnc_moncodi mon_codi,
                        mvnc.mvnc_tasvalr tas_valr,
                        mvnc.mvnc_ncafeta nca_feta,
                        mvnc.mvnc_arbcsuc arb_csuc,
                        mvnc.mvnc_arbcpro arb_cpro,
                        mvnc.mvnc_arbccec arb_ccec,
                        mvnc.mvnc_arbcare arb_care,
                        mvnc.mvnc_ncadesc nca_desc
                FROM
                        emv_expmovimient emv
                INNER JOIN mvi_movimiento mvi ON mvi.mvi_ideregistro = emv.mvi_ideregistro
                INNER JOIN mvnc_movncajseven mvnc ON mvnc.emv_ideregistro = emv.emv_ideregistro
                INNER JOIN top_tipoperacion top ON top.top_ideregistro = mvnc.top_ideregistro
                WHERE
                        emv_estado in( 'A', 'R') and emv.emv_ideregistro= $idmovimiento";

        return $this->executeQuery($sql);
    }

    /**
     * Obtiene el detalle del encabezado de la nota caja
     * @param type $codigoEmv
     */
    public function ObtenerDetalleNotaCajaModel($codigoEmv) {
        $sql = "SELECT
                        emv.emv_ideregistro,
                        mvnc.mvnc_dstcodi dst_codi,
                        mvnc.mvnc_cncvalo cnc_valo,
                        mvnc.mvnc_arbcsuc arb_csuc,
                        mvnc.mvnc_arbcpro arb_cpro,
                        mvnc.mvnc_arbccec arb_ccec,
                        mvnc.mvnc_arbcare arb_care,
                        mvnc.mvnc_cflcodi cfl_codi,
                        mvnc.mvnc_cncrefe cnc_refe
                FROM
                        emv_expmovimient emv
                INNER JOIN mvi_movimiento mvi ON mvi.mvi_ideregistro = emv.mvi_ideregistro
                INNER JOIN mvnc_movncajseven mvnc ON mvnc.emv_ideregistro = emv.emv_ideregistro
                INNER JOIN top_tipoperacion top ON top.top_ideregistro = mvnc.top_ideregistro
                WHERE
                        emv.emv_ideregistro =$codigoEmv";
        return $this->executeQuery($sql);
    }

    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="Informacion Consignaciones directas">
    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="Informacion Consignaciones directas">

    public function ObtenerEncabezadosRecaudos($idmovimiento) {

        $sql = "SELECT DISTINCT
                        mvi.emp_ideregistro emp_codi,
                        top.top_codigo top_codi,
                        emv.emv_ideregistro mte_nume,
                        to_char(emv.emv_fecha, 'dd/mm/yyyy') mte_fech,
                        mvre.mvre_mtedesc mte_desc,
                        mvre.mvre_tercoda ter_coda,
                        mvre.mvre_cflcodi cfl_codi,
                        mvre.mvre_arbcods arb_cods,
                        mvre.mvre_cajcodi caj_codi,
                        mvre.mvre_moncodi mon_codi,
                        to_char(mvre.mvre_mtefeta, 'dd/mm/yyyy') mte_feta,
                        mvre.mvre_mtetdis mte_tdis,
                        mvre.mvre_mtenuco mte_nuco,
                        mvre.mvre_reginve reg_inve,
                        mvre.mvre_vencodi ven_codi
                FROM
                        emv_expmovimient emv
                INNER JOIN mvi_movimiento mvi ON mvi.mvi_ideregistro = emv.mvi_ideregistro
                INNER JOIN mvre_movrecadseven mvre ON mvre.emv_ideregistro = emv.emv_ideregistro
                INNER JOIN top_tipoperacion top ON top.top_ideregistro = mvre.top_ideregistro
                WHERE
                        emv_estado in( 'A', 'R') and emv.emv_ideregistro= $idmovimiento LIMIT 1";
        return $this->executeQuery($sql);
    }

    public function ObtenerDetalleRecaudoModel($codigoEmv) {
        $sql = "SELECT DISTINCT
                        mvre.mvre_ideregistr mvre_id, 
                        mvre.mvre_ciecodi cie_codi,
                        mvre.mvre_tercodd ter_codd,
                        mvre.mvre_cflcodd cfl_codd,
                        mvre.mvre_rtsrefe rts_refe,
                        sum(mvre.mvre_rtsvalor) rts_valo
                FROM
                        emv_expmovimient emv
                INNER JOIN mvre_movrecadseven mvre ON mvre.emv_ideregistro = emv.emv_ideregistro
                WHERE
                        emv.emv_ideregistro = $codigoEmv
                GROUP BY            
                        mvre.mvre_ideregistr, 
                        mvre.mvre_ciecodi,
                        mvre.mvre_tercodd,
                        mvre.mvre_cflcodd,
                        mvre.mvre_rtsrefe
                ";
        return $this->executeQuery($sql);
    }

    public function ObtenerDetalleDistribucionAutomaticaModel($mvre_id) {
        $parametros['mvre_id'] = $mvre_id;
        $sql = "SELECT tar_codi,arb_codi,dmt_tipo,dmt_porc,sum(dmt_valo) dmt_valo
                FROM (
                       SELECT DISTINCT
                         mvre.mvre_tarcodiare tar_codi,
                         mvre.mvre_arbcodiare arb_codi,
                         mvre.mvre_dmttipoare dmt_tipo,
                         mvre.mvre_dmtvaloare dmt_valo,
                         mvre.mvre_dmtporcare dmt_porc
                       FROM
                         emv_expmovimient emv
                         INNER JOIN mvre_movrecadseven mvre ON mvre.emv_ideregistro = emv.emv_ideregistro
                       WHERE
                         mvre.mvre_ideregistr = :mvre_id
                         AND mvre.mvre_arbcodiare IS NOT NULL
                       UNION
                       SELECT DISTINCT
                         mvre.mvre_tarcodicco tar_codi,
                         mvre.mvre_arbcodicco arb_codi,
                         mvre.mvre_dmttipocco dmt_tipo,
                         mvre.mvre_dmtvalocco dmt_valo,
                         mvre.mvre_dmtporccco dmt_porc
                       FROM
                         emv_expmovimient emv
                         INNER JOIN mvre_movrecadseven mvre ON mvre.emv_ideregistro = emv.emv_ideregistro
                       WHERE
                         mvre.mvre_ideregistr = :mvre_id
                         AND mvre.mvre_arbcodicco IS NOT NULL
                       UNION
                       SELECT DISTINCT
                         mvre.mvre_tarcodipry tar_codi,
                         mvre.mvre_arbcodipry arb_codi,
                         mvre.mvre_dmttipopry dmt_tipo,
                         mvre.mvre_dmtvalopry dmt_valo,
                         mvre.mvre_dmtporcpry dmt_porc
                       FROM
                         emv_expmovimient emv
                         INNER JOIN mvre_movrecadseven mvre ON mvre.emv_ideregistro = emv.emv_ideregistro
                       WHERE
                         mvre.mvre_ideregistr = :mvre_id
                         AND mvre.mvre_arbcodipry IS NOT NULL
                       UNION
                       SELECT DISTINCT
                         mvre.mvre_tarcodisuc tar_codi,
                         mvre.mvre_arbcodisuc arb_codi,
                         mvre.mvre_dmttiposuc dmt_tipo,
                         mvre.mvre_dmtvalosuc dmt_valo,
                         mvre.mvre_dmtporcsuc dmt_porc
                       FROM
                         emv_expmovimient emv
                         INNER JOIN mvre_movrecadseven mvre ON mvre.emv_ideregistro = emv.emv_ideregistro
                       WHERE
                         mvre.mvre_ideregistr = :mvre_id
                         AND mvre.mvre_arbcodisuc IS NOT NULL) as info
                GROUP BY tar_codi,arb_codi,dmt_tipo,dmt_porc";
        return $this->executeQuery($sql, $parametros);
    }

    public function ObtenerDetalleEncabezadoImpuestoModel($codigoEmv) {
        $sql = "SELECT DISTINCT
                        mvre.mvre_impcodi  imp_codi,
                        mvre.mvre_dstcodi dst_codi,
                        mvre.mvre_rdtimds rdt_imds,
                        mvre.mvre_arbcsuc arb_csuc,
                        mvre.mvre_rdtvalo rdt_valo
                FROM
                        emv_expmovimient emv
                INNER JOIN mvre_movrecadseven mvre ON mvre.emv_ideregistro = emv.emv_ideregistro
                WHERE
                        emv.emv_ideregistro = $codigoEmv";
        return $this->executeQuery($sql);
    }

    public function ObtenerDetalleFormasPagoModel($codigoEmv) {
        $sql = "SELECT 
                        mvdr.mvdr_fpacodi fpa_codi,
                        mvdr.mvdr_taccodi tac_codi,
                        to_char(mvdr.mvdr_dfofech,'dd/mm/yyyy') dfo_fech,
                        mvdr.mvdr_dfovalo dfo_valo,
                        mvdr.mvdr_dfoviva dfo_viva,
                        mvdr.mvdr_bancodi ban_codi,
                        mvdr.mvdr_dfochec dfo_chec,
                        mvdr.mvdr_dfochep dfo_chep,
                        mvdr.mvdr_dfonocu dfo_nocu,
                        mvdr.mvdr_dfocedu dfo_cedu,
                        mvdr.mvdr_dfonomg dfo_nomg,
                        mvdr.mvdr_dfoclav dfo_clav,
                        mvdr.mvdr_dfobase dfo_base
                FROM
                        emv_expmovimient emv
                INNER JOIN mvdr_movdetrecadseven mvdr ON mvdr.emv_ideregistro = emv.emv_ideregistro
                WHERE
                        emv.emv_ideregistro =  $codigoEmv";
        return $this->executeQuery($sql);
    }

    public function ObtenerEncabezadosConsignacionesModel($idmovimiento) {

        $sql = "SELECT DISTINCT
                            mvi.emp_ideregistro emp_codi,
                            top.top_codigo top_codi,
                             cast(emv.emv_ideregistro as int) mte_nume,
                            to_char(mvcs.mvcs_mtefech, 'DD/MM/YYYY') mte_fech,
                            to_char(mvcs.mvcs_mtefcon, 'DD/MM/YYYY') mte_fcon,
                            mvcs.mvcs_mtedesc mte_desc,
                            mvcs.mvcs_tercoda ter_coda,
                            mvcs.mvcs_mtefopa mte_fopa,
                            mvcs.mvcs_moncodi mon_codi,
                            to_char(mvcs.mvcs_mtefeta, 'DD/MM/YYYY') mte_feta,
                            mvcs.mvcs_arbcods arb_cods,
                            mvcs.mvcs_cubnume cub_nume,
                            mvcs.mvcs_mterecd mte_recd,
                            mvcs.mvcs_cflcodi cfl_codi,
                            mvcs.mvcs_reginve reg_inve,
                            mvcs.mvcs_mtetdis mte_tdis
                    FROM
                            emv_expmovimient emv
                    INNER JOIN mvi_movimiento mvi ON mvi.mvi_ideregistro = emv.mvi_ideregistro
                    INNER JOIN mvcs_movcondseven mvcs ON mvcs.emv_ideregistro = emv.emv_ideregistro
                    INNER JOIN top_tipoperacion top ON top.top_ideregistro = mvcs.top_ideregistro
                    WHERE
                            emv_estado in( 'A', 'R') and emv.emv_ideregistro= $idmovimiento LIMIT 1";
        return $this->executeQuery($sql);
    }

    public function ObtenerDetalleConsignacionesModel($codigoEmv) {

        $sql = "SELECT DISTINCT
                        mvcs.mvcs_ideregistr mvcs_id,
                        mvcs.mvcs_ciecodi cie_codi,
                        mvcs.mvcs_tercodd ter_codd,
                        cast(mvcs.mvcs_rtsvalo as float) rts_valo,
                        mvcs.mvcs_rtsrefe rts_refe,
                        mvcs.mvcs_cflcodd cfl_codd
                FROM
                        emv_expmovimient emv
                INNER JOIN mvcs_movcondseven mvcs ON mvcs.emv_ideregistro = emv.emv_ideregistro
                WHERE
                        emv.emv_ideregistro =  $codigoEmv";
        return $this->executeQuery($sql);
    }

    public function obtenerDetallesConsignacionesDistribuacionAutomaticaModel($mvcs_id) {

        $sql = "SELECT DISTINCT
                        mvcs.mvcs_tarcodiare tar_codi,
                        mvcs.mvcs_arbcodiare arb_codi,
                        mvcs.mvcs_dmttipoare dmt_tipo,
                        cast(mvcs.mvcs_dmtvaloare as float) dmt_valo,
                        cast(mvcs.mvcs_dmtporcare as float) dmt_porc 
                FROM
                        emv_expmovimient emv
                INNER JOIN mvcs_movcondseven mvcs ON mvcs.emv_ideregistro = emv.emv_ideregistro
                WHERE
                         mvcs.mvcs_ideregistr = $mvcs_id
                AND mvcs.mvcs_arbcodiare IS NOT NULL
                UNION
                        SELECT DISTINCT
                                mvcs.mvcs_tarcodicco tar_codi,
                                mvcs.mvcs_arbcodicco arb_codi,
                                mvcs.mvcs_dmttipocco dmt_tipo,
                                cast(mvcs.mvcs_dmtvalocco as float) dmt_valo,
                                cast(mvcs.mvcs_dmtporccco as float) dmt_porc
                        FROM
                                emv_expmovimient emv
                        INNER JOIN mvcs_movcondseven mvcs ON mvcs.emv_ideregistro = emv.emv_ideregistro
                        WHERE
                                mvcs.mvcs_ideregistr = $mvcs_id
                        AND mvcs.mvcs_arbcodicco IS NOT NULL
                        UNION
                                SELECT DISTINCT
                                        mvcs.mvcs_tarcodipry tar_codi,
                                        mvcs.mvcs_arbcodipry arb_codi,
                                        mvcs.mvcs_dmttipopry dmt_tipo,
                                        cast(mvcs.mvcs_dmtvalopry as float) dmt_valo,
                                        cast(mvcs.mvcs_dmtporcpry as float) dmt_porc
                                FROM
                                        emv_expmovimient emv
                                INNER JOIN mvcs_movcondseven mvcs ON mvcs.emv_ideregistro = emv.emv_ideregistro
                                WHERE
                                        mvcs.mvcs_ideregistr = $mvcs_id
                                AND mvcs.mvcs_arbcodipry IS NOT NULL
                                UNION
                                        SELECT DISTINCT
                                                mvcs.mvcs_tarcodisuc tar_codi,
                                                mvcs.mvcs_arbcodisuc arb_codi,
                                                mvcs.mvcs_dmttiposuc dmt_tipo,
                                                cast(mvcs.mvcs_dmtvalosuc as float) dmt_valo,
                                                cast(mvcs.mvcs_dmtporcsuc as float) dmt_porc
                                        FROM
                                                emv_expmovimient emv
                                        INNER JOIN mvcs_movcondseven mvcs ON mvcs.emv_ideregistro = emv.emv_ideregistro
                                        WHERE
                                               mvcs.mvcs_ideregistr = $mvcs_id
                                        AND mvcs.mvcs_arbcodisuc IS NOT NULL;";
        return $this->executeQuery($sql);
    }

        public function obtenerDetallesFacturaProveedorDistribuacionAutomaticaModel($mvcs_id) {

        $sql = "SELECT DISTINCT
                        mvcs.mvcs_tarcodiare tar_codi,
                        mvcs.mvcs_arbcodiare arb_codi,
                        mvcs.mvcs_dmttipoare dmt_tipo,
                        cast(mvcs.mvcs_dmtvaloare as float) dmt_valo,
                        cast(mvcs.mvcs_dmtporcare as float) dmt_porc 
                FROM
                        emv_expmovimient emv
                INNER JOIN mvcs_movcondseven mvcs ON mvcs.emv_ideregistro = emv.emv_ideregistro
                WHERE
                         mvcs.mvcs_ideregistr = $mvcs_id
                AND mvcs.mvcs_arbcodiare IS NOT NULL
                UNION
                        SELECT DISTINCT
                                mvcs.mvcs_tarcodicco tar_codi,
                                mvcs.mvcs_arbcodicco arb_codi,
                                mvcs.mvcs_dmttipocco dmt_tipo,
                                cast(mvcs.mvcs_dmtvalocco as float) dmt_valo,
                                cast(mvcs.mvcs_dmtporccco as float) dmt_porc
                        FROM
                                emv_expmovimient emv
                        INNER JOIN mvcs_movcondseven mvcs ON mvcs.emv_ideregistro = emv.emv_ideregistro
                        WHERE
                                mvcs.mvcs_ideregistr = $mvcs_id
                        AND mvcs.mvcs_arbcodicco IS NOT NULL
                        UNION
                                SELECT DISTINCT
                                        mvcs.mvcs_tarcodipry tar_codi,
                                        mvcs.mvcs_arbcodipry arb_codi,
                                        mvcs.mvcs_dmttipopry dmt_tipo,
                                        cast(mvcs.mvcs_dmtvalopry as float) dmt_valo,
                                        cast(mvcs.mvcs_dmtporcpry as float) dmt_porc
                                FROM
                                        emv_expmovimient emv
                                INNER JOIN mvcs_movcondseven mvcs ON mvcs.emv_ideregistro = emv.emv_ideregistro
                                WHERE
                                        mvcs.mvcs_ideregistr = $mvcs_id
                                AND mvcs.mvcs_arbcodipry IS NOT NULL
                                UNION
                                        SELECT DISTINCT
                                                mvcs.mvcs_tarcodisuc tar_codi,
                                                mvcs.mvcs_arbcodisuc arb_codi,
                                                mvcs.mvcs_dmttiposuc dmt_tipo,
                                                cast(mvcs.mvcs_dmtvalosuc as float) dmt_valo,
                                                cast(mvcs.mvcs_dmtporcsuc as float) dmt_porc
                                        FROM
                                                emv_expmovimient emv
                                        INNER JOIN mvcs_movcondseven mvcs ON mvcs.emv_ideregistro = emv.emv_ideregistro
                                        WHERE
                                               mvcs.mvcs_ideregistr = $mvcs_id
                                        AND mvcs.mvcs_arbcodisuc IS NOT NULL;";
        return $this->executeQuery($sql);
    }
    
    
    public function obtenerDetallesConsignacionesImpuestosModel($codigoEmv) {
        $sql = "SELECT DISTINCT
                        mvcs.mvcs_impcodi imp_codi,
                        mvcs.mvcs_dstcodi dst_codi,
                        mvcs.mvcs_rdtimds rdt_imds,
                        mvcs.mvcs_arbcsuc arb_csuc,
                        cast(mvcs.mvcs_rdtvalo as float) rdt_valo
                FROM
                        emv_expmovimient emv
                INNER JOIN mvcs_movcondseven mvcs ON mvcs.emv_ideregistro = emv.emv_ideregistro
                WHERE
                        emv.emv_ideregistro =  $codigoEmv";
        return $this->executeQuery($sql);
    }

    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="Cron Proceso movimientos contables">
    /**
     * Permite obtener todos los movimientos con información pendiente a enviar al servicio web de seven 
     * @param type $idempresa identificador de la empresa a enviar
     * @return type coleccion de movimientos que se encuentran listos para enviar a exportar
     */
    public function ObtenerMovimientosExportarCronModel() {
        $sql = "SELECT emv.emv_ideregistro
                FROM mvi_movimiento mvi
                  INNER JOIN emv_expmovimient emv ON emv.mvi_ideregistro = mvi.mvi_ideregistro
                WHERE mvi_estado = 'G' AND emv.emv_estado IN ('A', 'R')";
        return $this->executeQuery($sql);
    }

    /**
     * Permite obtener los movimientos que han tenido error para ser reconstruidos 
     */
    public function ObtenerMovimientosReconstruirModel() {
        $sql = "SELECT array_agg(emv.emv_ideregistro) movimientos
                FROM mvi_movimiento mvi
                  INNER JOIN emv_expmovimient emv ON emv.mvi_ideregistro = mvi.mvi_ideregistro
                WHERE mvi_estado = 'G' AND emv.emv_estado = 'R'";
        $respuesta = $this->executeQuery($sql);
        if (!empty($respuesta)) {
            return $respuesta['movimientos'];
        }
        return null;
    }

    /**
     * Permite realizar la reconstrucción de los movimientos seleccionados
     * @param type $movimientos listado de movimientos separados por coma ( {1,2,3,4,5} ) 
     */
    public function ReconstruirMovimientosModel($movimientos) {
        $sql = "select fn_reconstruir_contabilizacion('$movimientos');";
        return $this->executeQuery($sql);
    }

    //</editor-fold>

    /**
     * Permite cambiar a null los estados del movimietno contable a eliminar
     */
    public function EliminarMovimientosContablesModel($idusuario,$idMovimiento, $idEmpresa) {
        $sql = "UPDATE fac_factura
                SET mvi_ideregistro = NULL,
                 usu_ideregistro = $idusuario
                FROM
                        fac_factura fac
                WHERE
                        fac.fac_ideregistro IN (
                                SELECT
                                        mvmc.fac_ideregistro
                                FROM
                                        emv_expmovimient emv
                                INNER JOIN mvi_movimiento mvi on mvi.mvi_ideregistro = emv.mvi_ideregistro
                                INNER JOIN mvmc_movmconseven mvmc ON mvmc.emv_ideregistro = emv.emv_ideregistro
                                WHERE
                                        emv.emv_estado = 'E'  AND mvi.mvi_ideregistro =$idMovimiento  AND mvi.emp_ideregistro = $idEmpresa
                                AND fac_ideregistro IS NOT NULL
                        )";
        $this->executeQuery($sql);
        $sqlRecaudo = "UPDATE rec_recaudo
                        SET mvi_ideregistro = NULL,
                         usu_ideregistro = $idusuario
                        WHERE
                                rec_ideregistro IN (
                                     SELECT *
                                     FROM
                                             (
                                                     SELECT
                                                             mvcs.rec_ideregistro
                                                     FROM
                                                             emv_expmovimient emv
                                                             INNER JOIN mvi_movimiento mvi on mvi.mvi_ideregistro = emv.mvi_ideregistro
                                                     INNER JOIN mvcs_movcondseven mvcs ON mvcs.emv_ideregistro = emv.emv_ideregistro
                                                     WHERE
                                                             emv.emv_estado = 'E'   AND mvi.mvi_ideregistro =$idMovimiento  AND mvi.emp_ideregistro = $idEmpresa
                                                     AND rec_ideregistro IS NOT NULL
                                                     UNION
                                                             SELECT
                                                                     mvre.rec_ideregistro
                                                             FROM
                                                                     mvre_movrecadseven mvre
                                                             INNER JOIN emv_expmovimient emv ON emv.emv_ideregistro = mvre.emv_ideregistro
                                                             INNER JOIN mvi_movimiento mvi on mvi.mvi_ideregistro = emv.mvi_ideregistro
                                                             WHERE
                                                                     emv.emv_estado = 'E'   AND mvi.mvi_ideregistro =$idMovimiento  AND mvi.emp_ideregistro = $idEmpresa
                                                             AND mvre.rec_ideregistro IS NOT NULL
                                                             UNION
                                                                     SELECT
                                                                             mvnc.rec_ideregistro
                                                                     FROM
                                                                             mvnc_movncajseven mvnc
                                                                     INNER JOIN emv_expmovimient emv ON emv.emv_ideregistro = mvnc.emv_ideregistro
                                                                     INNER JOIN mvi_movimiento mvi on mvi.mvi_ideregistro = emv.mvi_ideregistro
                                                                     WHERE
                                                                             emv.emv_estado = 'E'  AND mvi.mvi_ideregistro =$idMovimiento  AND mvi.emp_ideregistro = $idEmpresa
                                                                     AND mvnc.rec_ideregistro IS NOT NULL
                                                                     UNION
                                                                             SELECT
                                                                                     mvmc.rec_ideregistro
                                                                             FROM
                                                                                     mvmc_movmconseven mvmc
                                                                             INNER JOIN emv_expmovimient emv ON emv.emv_ideregistro = mvmc.emv_ideregistro
                                                                             INNER JOIN mvi_movimiento mvi on mvi.mvi_ideregistro = emv.mvi_ideregistro
                                                                             WHERE
                                                                                     emv.emv_estado = 'E'   AND mvi.mvi_ideregistro =$idMovimiento  AND mvi.emp_ideregistro = $idEmpresa
                                                                             AND mvmc.rec_ideregistro IS NOT NULL
                                             ) DATA
                                )";
        $this->executeQuery($sqlRecaudo);
        $sqlConsignacion = "UPDATE csg_consignacion set mvi_ideregistro = NULL,
                            usu_ideregistro = $idusuario
                           FROM
                                   csg_consignacion csg
                           INNER JOIN dcsg_detconsigna dcsg ON dcsg.csg_ideregistro = csg.csg_ideregistro
                           WHERE
                                   dcsg_ideregistr IN (
                                           SELECT
                                                   *
                                           FROM
                                                   (
                                                           SELECT
                                                                   mvcs.dcsg_ideregistr
                                                           FROM
                                                                   emv_expmovimient emv
                                                                   INNER JOIN mvi_movimiento mvi on mvi.mvi_ideregistro = emv.mvi_ideregistro
                                                           INNER JOIN mvcs_movcondseven mvcs ON mvcs.emv_ideregistro = emv.emv_ideregistro
                                                           WHERE
                                                                   emv.emv_estado = 'E'  AND mvi.mvi_ideregistro =$idMovimiento  AND mvi.emp_ideregistro = $idEmpresa
                                                           AND dcsg_ideregistr IS NOT NULL
                                                           UNION
                                                                   SELECT
                                                                           mvdr.dcsg_ideregistr
                                                                   FROM
                                                                           mvdr_movdetrecadseven mvdr
                                                                   INNER JOIN emv_expmovimient emv ON emv.emv_ideregistro = mvdr.emv_ideregistro
                                                                   INNER JOIN mvi_movimiento mvi on mvi.mvi_ideregistro = emv.mvi_ideregistro
                                                                   WHERE
                                                                           emv.emv_estado = 'E'  AND mvi.mvi_ideregistro =$idMovimiento  AND mvi.emp_ideregistro = $idEmpresa
                                                                   AND mvdr.dcsg_ideregistr IS NOT NULL
                                                                   UNION
                                                                           SELECT
                                                                                   mvre.dcsg_ideregistr
                                                                           FROM
                                                                                   mvre_movrecadseven mvre
                                                                           INNER JOIN emv_expmovimient emv ON emv.emv_ideregistro = mvre.emv_ideregistro
                                                                           INNER JOIN mvi_movimiento mvi on mvi.mvi_ideregistro = emv.mvi_ideregistro
                                                                           WHERE
                                                                                   emv.emv_estado = 'E'  AND mvi.mvi_ideregistro =$idMovimiento  AND mvi.emp_ideregistro = $idEmpresa
                                                                           AND mvre.dcsg_ideregistr IS NOT NULL
                                                                           UNION
                                                                                   SELECT
                                                                                           mvnc.dcsg_ideregistr
                                                                                   FROM
                                                                                           mvnc_movncajseven mvnc
                                                                                   INNER JOIN emv_expmovimient emv ON emv.emv_ideregistro = mvnc.emv_ideregistro
                                                                                   INNER JOIN mvi_movimiento mvi on mvi.mvi_ideregistro = emv.mvi_ideregistro
                                                                                   WHERE
                                                                                           emv.emv_estado = 'E'  AND mvi.mvi_ideregistro =$idMovimiento  AND mvi.emp_ideregistro = $idEmpresa
                                                                                   AND mvnc.dcsg_ideregistr IS NOT NULL
                                                   ) DATA
                                   )";
        $this->executeQuery($sqlConsignacion);
    }

    /**
     * permite mmostrar la información de los posibles errores existentes
     * @param int  $idmovimiento identificador de movimiento
     * @return Array listado de movimientos con generación de error
     */
    public function ObtenerListadoErrorModel($idmovimiento) {
        $sql = "SELECT
                            cic.cic_nombre ciclo ,	
                            per.per_nombre periodo,
                            mvi.cic_ano ano,
                            mver.mver_fecha fechaerror,
                            mver.emv_ideregistro idemv,
                            doc.doc_nombre documento,
                            tido.tido_nombre tipodocumento,
                            mver.uni_concepto concepto,
                            mver.emp_ideregistro empresa,
                            mver.usu_ideregistro usuario
                            mver.mver_comentario comentario
            FROM
                    mver_moverrores mver
            INNER JOIN mvi_movimiento mvi ON mvi.mvi_ideregistro = mver.mvi_ideregistro
            INNER JOIN per_periodo per ON per.per_ideregistro = mvi.per_ideregistro
            INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = mvi.cic_ideregistro
            INNER JOIN doc_documento doc on doc.uni_documento = mver.uni_documento
            inner join tido_tipdocumen tido on tido.uni_tipdocument = mver.uni_tipdocument
            WHERE mvi.mvi_ideregistro=$idmovimiento
            ORDER  BY mver.mver_fecha DESC
            ";
        return $this->executeQuery($sql);
    }

    /**
     * Permite validar si existen errores en el movimiento generado
     * @param int $idmovimiento identificador del movimiento
     * @return int si es mayor a cero existen errores a mostrar
     */
    public function ValidarErroresGeneradosModel($idmovimiento) {
        $sql = "SELECT  COUNT(*) cant FROM mver_moverrores WHERE mvi_ideregistro=$idmovimiento";

        $respuesta = $this->executeQuery($sql);
        if (!empty($respuesta)) {
            return $respuesta[0]['cant'];
        }
        return 0;
    }

    /**
     * permite obtener los detalles de los movimientos generados
     * @param int  $idmovimiento identificador del movimiento
     * @return Array Listado de detalles de movimientos generados
     */
    public function ObtenerDetallesMovimientosGeneradosModel($idmovimiento) {
        $sql = "SELECT
                        mvmc.emv_ideregistro numExportacion,
                        (
                                CASE COALESCE (fac.fac_ideregistro, 0)
                                WHEN 0 THEN
                                        docrec.doc_nombre
                                ELSE
                                        doc.doc_nombre
                                END
                        ) documento,
                        (
                                CASE COALESCE (fac.fac_ideregistro, 0)
                                WHEN 0 THEN
                                        NULL
                                ELSE
                                        tido.tido_nombre
                                END
                        ) tipodocumento,
                        (
                                CASE COALESCE (fac.fac_ideregistro, 0)
                                WHEN 0 THEN
                                        rec.rec_ideregistro
                                ELSE
                                        fac.fac_ideregistro
                                END
                        ) numero,
                        concat(top_codigo, ' - ', top_nombre) top_codigo,
                        mvmc.mvmc_cuecodi codicuenta,
                        mvmc.mvmc_arbcsuc sucursal,
                        mvmc.mvmc_tercoda nit,
                        mvmc.mvmc_arbcodc costo,
                        mvmc.mvmc_arbcodp proyecto,
                        mvmc.mvmc_arbcods sucrursal,
                        (
                                CASE COALESCE (fac.fac_ideregistro, 0)
                                WHEN 0 THEN
                                        NULL
                                ELSE
                                        mvmc.mvmc_dmcvadb
                                END
                        ) Debito,
                        (
                                CASE COALESCE (fac.fac_ideregistro, 0)
                                WHEN 0 THEN
                                        NULL
                                ELSE
                                        mvmc.mvmc_dmcvacr
                                END
                        ) Credito,
                        (
                                CASE COALESCE (fac.fac_ideregistro, 0)
                                WHEN 0 THEN
                                        mvmc.mvmc_dmcvadb
                                ELSE
                                        mvmc.mvmc_dmcvacr
                                END
                        ) Valor
                FROM
                        mvmc_movmconseven mvmc
                INNER JOIN fac_factura fac ON fac.fac_ideregistro = mvmc.fac_ideregistro
                LEFT JOIN rec_recaudo rec ON rec.rec_ideregistro = mvmc.rec_ideregistro
                INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                INNER JOIN tido_tipdocumen tido ON tido.uni_tipdocument = fac.uni_tipdocument
                LEFT JOIN doc_documento docrec ON docrec.uni_documento = rec.uni_documento
                INNER JOIN top_tipoperacion top ON top.top_ideregistro = mvmc.top_ideregistro
                INNER JOIN cue_cuenta cue ON mvmc.mvmc_cueideregistro = cue.cue_ideregistro
                WHERE mvmc.emv_ideregistro = $idmovimiento";
        return $this->executeQuery($sql);
    }
    
    public function reGenerarMovimientoContableModel($idmovimiento){
        $sql=("Select * from fn_regenera_movContable_emv ($idmovimiento)");
        
        $respuesta = $this->executeQuery($sql);
        if(empty($respuesta)){
            throw new MyException('No se pudo hacer la Regeneracion', -1);
        }
        return $respuesta;
    }
    
    public function reGenerarMovimientoContableExportadoModel($idMovimiento){
        $sql=("select * from fn_valida_exportado_regenerar_emv($idMovimiento)");
        return $this->executeQuery($sql);
        
    }
    
    //------------------------------------ fatura proveedor --------------------------------------
    public function obtenerEncabezadosFacturaProveedorModel($idmovimiento) {
                    
        $sql = "SELECT DISTINCT
                        mvi.emp_ideregistro emp_codi,
                        top.top_codigo top_codi,
                        cast(emv.emv_ideregistro as int) fac_nume,
                        to_char(now()::date,'YYYY-MM-DD') fac_fech,
                        to_char(now()::date,'YYYY-MM-DD') fac_feve,
                        mvfp_arbcods arb_cods,
                        mvfp_facdesc fac_desc,
                        mvfp_pvdcoda pvd_coda,                            
                        mvfp_depcodd dep_codd,                            
                        mvfp_factipo fac_tipo,
                        trim(mvfp.mvfp_facpref) fac_pref,
                        '0' cal_impu,
                        '0' fac_nfap,
                        'A' fac_esta,
                        mvfp_moncodi mon_codi,
                        0 fac_base,
                        0 bir_cont,
                        0 fac_auto,
                        'A' fac_tdis
                    FROM
                            emv_expmovimient emv
                    INNER JOIN mvi_movimiento mvi ON mvi.mvi_ideregistro = emv.mvi_ideregistro   
                    INNER JOIN top_tipoperacion top ON top.top_ideregistro = emv.top_ideregistro 
                    INNER JOIN mvfp_facproveedseven mvfp ON mvfp.emv_ideregistro = emv.emv_ideregistro
                    WHERE
                    emv_estado in( 'A', 'R') and emv.emv_ideregistro= $idmovimiento LIMIT 1";
        return $this->executeQuery($sql);
    }

    
    public function obtenerDetallesFacturaPreveedorModel($codigoEmv) {

        $sql = "SELECT DISTINCT
                    mvfp.mvfp_ideregistr mvfc_id,
                    mvfp.mvfp_bodcodi bod_codi,
                    mvfp.mvfp_pvdcoda pvd_coda,
                    mvfp.mvfp_depcodd dep_codd,
                    mvfp.mvfp_procodi pro_codi,
                    mvfp.mvfp_dfadest dfa_dest,
                    mvfp.mvfp_dfacant dfa_cant,
                    mvfp.mvfp_dfavalo dfa_valo,
                    mvfp.mvfp_dfadesc dfa_desc,
                    mvfp.mvfp_tercoda ter_coda,
                    mvfp.mvfp_facnume dfa_refe,
                    0 ctr_cont
                FROM
                        emv_expmovimient emv
                INNER JOIN mvfp_facproveedseven mvfp ON mvfp.emv_ideregistro = emv.emv_ideregistro AND mvfp.codo_naturaleza='P'
                WHERE
                        emv.emv_ideregistro =  $codigoEmv";
        return $this->executeQuery($sql);
    }
    
        public function obtenerConceptoAdicionalFacturaProveedorModel($codigoEmv) {

        $sql = "SELECT                     
                    mvfp.mvfp_procodi coa_codi,
                    sum(mvfp.mvfp_dfavalo) coa_valo
                FROM
                        emv_expmovimient emv
                INNER JOIN mvfp_facproveedseven mvfp ON mvfp.emv_ideregistro = emv.emv_ideregistro AND mvfp.codo_naturaleza='A'
                WHERE
                        emv.emv_ideregistro =  $codigoEmv
                GROUP BY coa_codi";
        return $this->executeQuery($sql);
    }
    
    
    public function obtenerDetallesFacturaProveedorAutomaticaModel($mvfp_id) {
        
        $sql = "SELECT DISTINCT
                        mvfp.mvfp_arbcodiare arb_codi,
                        mvfp.mvfp_tarcodiare tar_codi,
                        100 dmt_porc, 
                        'P' dmt_tipo,
                        0 dmt_valo
                        
                FROM
                        emv_expmovimient emv
                INNER JOIN mvfp_facproveedseven mvfp ON mvfp.emv_ideregistro = emv.emv_ideregistro
                WHERE
                         mvfp.mvfp_ideregistr = $mvfp_id 
                AND mvfp.mvfp_tarcodiare is not null
                UNION
                        SELECT DISTINCT
                                mvfp.mvfp_arbcodicco arb_codi,
                                mvfp.mvfp_tarcodicco tar_codi,
                                100 dmt_porc,
                                'P' dmt_tipo,
                                0 dmt_valo
                                
                        FROM
                                emv_expmovimient emv
                        INNER JOIN mvfp_facproveedseven mvfp ON mvfp.emv_ideregistro = emv.emv_ideregistro
                        WHERE
                             mvfp.mvfp_ideregistr = $mvfp_id
                        AND mvfp.mvfp_tarcodicco  is not null
                        UNION
                                SELECT DISTINCT
                                        mvfp.mvfp_arbcodipry arb_codi,
                                        mvfp.mvfp_tarcodipry tar_codi,
                                        100 dmt_porc,
                                        'P' dmt_tipo,
                                        0 dmt_valo

                                FROM
                                        emv_expmovimient emv
                                INNER JOIN mvfp_facproveedseven mvfp ON mvfp.emv_ideregistro = emv.emv_ideregistro
                                WHERE
                                         mvfp.mvfp_ideregistr = $mvfp_id
                                AND mvfp.mvfp_tarcodipry  is not null
                                UNION
                                        SELECT DISTINCT
                                                mvfp.mvfp_arbcodisuc arb_codi,
                                                mvfp.mvfp_tarcodisuc tar_codi,
                                                100 dmt_porc,
                                                'P' dmt_tipo,
                                                0 dmt_valo

                                        FROM
                                                emv_expmovimient emv
                                        INNER JOIN mvfp_facproveedseven mvfp ON mvfp.emv_ideregistro = emv.emv_ideregistro
                                        WHERE
                                                 mvfp.mvfp_ideregistr = $mvfp_id
                                        AND mvfp.mvfp_tarcodisuc  is not null ;";
        return $this->executeQuery($sql);
    }
    

}
