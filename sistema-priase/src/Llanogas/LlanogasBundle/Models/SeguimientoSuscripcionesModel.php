<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Models\GenericoModel;

/**
 * Consultas genericas del sistema.
 *
 * @author hrey
 */
class SeguimientoSuscripcionesModel extends AuditoriaServices {

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     * @param \Doctrine\DBAL\Connection $sesion
     */
    public function __construct(&$conexion, &$sesion) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
        $this->genericoModel = new GenericoModel($conexion);
    }

    public function getFacturas($fechaInicio, $fechaFin, $idSuscripcion) {
        $estado = "'A'";
        $parametros['fechainicio'] = $fechaInicio;
        $parametros['fechafin'] = $fechaFin;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT
                        fac.fac_ideregistro idfactura,
                        fac.fac_numero numero,
                        DATE (fac.fac_fecvence) fechavencimiento,
			DATE(fac.fac_fecsuspens) fechasuspension,
                        fac.dsus_ideregistr idsuscripcion,
                        COALESCE (fac.fac_vlrreal, 0) valortotal,
                        per.per_nombre || ' ' || cic.cic_nombre cicloperiodo,
                        COALESCE (fac.fac_sdoreal, 0) saldofactura,
                        fac.fac_fecha fecha,
                        (fac.fac_vlrreal - fac.fac_sdoreal) valorpagadofactura,
                        tsu.tsu_nombre tiposuscripcion,
                        fac.uni_documento iddocumento,
                        tido.tido_nombre nombretipodocumento
                FROM
                        fac_factura fac
                INNER JOIN per_periodo per ON fac.per_ideregistro = per.per_ideregistro
                INNER JOIN cic_ciclo cic ON fac.cic_ideregistro = cic.cic_ideregistro
                INNER JOIN tsu_tipsuscripc tsu ON fac.uni_tipsuscripc = tsu.uni_tipsuscripc
                INNER JOIN doc_documento doc ON fac.uni_documento = doc.uni_documento
                INNER JOIN tido_tipdocumen tido ON tido.uni_tipdocument = fac.uni_tipdocument
                INNER JOIN uni_unidad uni ON fac.uni_tipdocument = uni.uni_ideregistro
                WHERE
                        fac.dsus_ideregistr = :idsuscripcion
                AND fac.fac_estado in( $estado)
                and (select count(*) from dfac_detfactura dfac 
                INNER JOIN con_concepto con1 on con1.uni_concepto = dfac.uni_concepto
                where dfac.fac_ideregistro=fac.fac_ideregistro and con1.con_operacion != 'I')  > 0
                AND fac.fac_fecha::date BETWEEN :fechainicio::date
                AND :fechafin::date
                AND fac.fac_idepadre IS NULL  ORDER BY fac.fac_fecha DESC, fac.fac_fecvence DESC";

        $listaFacturas = $this->executeQuery($sql, $parametros);
        if (empty($listaFacturas)) {
            throw new MyException('No se encontraron registros', 0);
        }
        return $listaFacturas;
    }

    public function getFacturasProvision($fechaInicio, $fechaFin, $idSuscripcion) {
        $estado = "'A','C','P'";
        $parametros['fechainicio'] = $fechaInicio;
        $parametros['fechafin'] = $fechaFin;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT
		fac.fac_ideregistro idfactura, fac.fac_numero numero, fac.fac_ideorigen facturapadre,
		DATE (fac.fac_fecvence) fechavencimiento,
		DATE(fac.fac_fecsuspens) fechasuspension, fac.dsus_ideregistr idsuscripcion,
		--COALESCE (fac.fac_vlrreal, 0) valortotal,
                COALESCE ((SELECT SUM (dfac_vlrtotal) from dfac_detfactura dfacc 
                INNER JOIN con_concepto conn on conn.uni_concepto = dfacc.uni_concepto 
                where dfacc.fac_ideregistro = fac.fac_ideregistro and con_operacion = 'S'),0 ) valortotal ,
		per.per_nombre || ' ' || cic.cic_nombre cicloperiodo,
		COALESCE (fac.fac_sdoreal, 0) saldofactura, fac.fac_fecha fecha,
		(fac.fac_vlrreal - fac.fac_sdoreal) valorpagadofactura,
		tsu.tsu_nombre tiposuscripcion, fac.uni_documento iddocumento, doc.doc_nombre , 
		--facp.fac_vlrreal totalfacpadre
                (SELECT SUM (dfac_vlrtotal) from dfac_detfactura dfacc 
                INNER JOIN con_concepto conn on conn.uni_concepto = dfacc.uni_concepto 
                where dfacc.fac_ideregistro = facp.fac_ideregistro and con_operacion = 'S') totalfacpadre
            FROM fac_factura fac
		INNER JOIN fac_factura facp ON facp.fac_ideregistro = fac.fac_ideorigen
		INNER JOIN per_periodo per ON fac.per_ideregistro = per.per_ideregistro
		INNER JOIN cic_ciclo cic ON fac.cic_ideregistro = cic.cic_ideregistro
		INNER JOIN tsu_tipsuscripc tsu ON fac.uni_tipsuscripc = tsu.uni_tipsuscripc
		INNER JOIN doc_documento doc ON fac.uni_documento = doc.uni_documento
		INNER JOIN uni_unidad uni ON fac.uni_tipdocument = uni.uni_ideregistro
            WHERE
		fac.dsus_ideregistr = :idsuscripcion
		AND fac.fac_estado in( $estado)
		AND fac.fac_fecha::date BETWEEN :fechainicio::date
		AND :fechafin::date
		AND doc.doc_tipo in ('PR' ,'RC' ,'RP','CC')
		ORDER BY fac.fac_fecha DESC, fac.fac_fecvence DESC";

        $listaFacturas = $this->executeQuery($sql, $parametros);
        if (empty($listaFacturas)) {
            throw new MyException('No se encontraron registros', 0);
        }
        return $listaFacturas;
    }

    public function getRecaudosConceptosModel($idrecaudo) {
        $sql = "SELECT
                        drec_ideregistr iddetallerecaudo,
                        drec_fecha fecha,
                        drec_vlrreal valorreal,
                        drec_vlrtotal valortotal,
                        dfac_ideregistr detallefactura,
                        fac_ideregistro idfactura,
                        doc.doc_nombre documento,
                        tido.tido_nombre tipodocumento,
                        (
                                cic.cic_nombre || ' - ' || per.per_nombre || ' - ' || cic.cic_anoactual
                        ) cicloperiodo
                FROM
                        drec_detrecaudo drec
                INNER JOIN doc_documento doc ON doc.uni_documento = drec.uni_documento
                INNER JOIN tido_tipdocumen tido ON tido.uni_tipdocument = drec.uni_tipdocument
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = drec.cic_ideregistro
                INNER JOIN per_periodo per ON per.per_ideregistro = drec.per_ideregistro

                 where rec_ideregistro = $idrecaudo; ";
        return $this->executeQuery($sql);
    }

    public function getDocumentos($idSuscripcion, $fechaInicio, $fechaFin) {
        $parametros['estado'] = 'A';
        $parametros['fechainicio'] = $fechaInicio;
        $parametros['fechafin'] = $fechaFin;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = 'select  distinct 
                    fac.uni_documento iddocumento, doc.doc_nombre documento
                from 
                    fac_factura fac  inner join doc_documento doc on fac.uni_documento=doc.uni_documento
                where
                    fac.dsus_ideregistr=:idsuscripcion and fac.fac_estado = :estado 
                    and fac.fac_idepadre is null
                    and fac.fac_fecha::date between :fechainicio::date and :fechafin::date ';
        return $this->executeQuery($sql, $parametros);
    }

    public function getConceptos($idFactura) {
        $parametros['idfactura'] = $idFactura;
        $complemento = " where fac.fac_ideregistro=:idfactura and  dfac.dfac_vlrreal>0 and con.con_operacion = 'S' order by valortotal desc ";
        return $this->genericoModel->getConceptosInformacion($complemento, $parametros);
    }

    public function getConceptosP($idFactura) {
        $parametros['idfactura'] = $idFactura;
        $complemento = " where fac.fac_ideregistro=:idfactura and con.con_operacion = 'S' order by valortotal desc ";
        return $this->genericoModel->getConceptosInformacion($complemento, $parametros);
    }

    public function getDocumentosP($idSuscripcion, $fechaInicio, $fechaFin) {
        $parametros['fechainicio'] = $fechaInicio;
        $parametros['fechafin'] = $fechaFin;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "select  distinct 
                    fac.uni_documento iddocumento, doc.doc_nombre documento
                from 
                    fac_factura fac  
                    inner join doc_documento doc on fac.uni_documento=doc.uni_documento
                where
                    fac.dsus_ideregistr=:idsuscripcion
                    and doc.doc_tipo in ('PR' ,'RC' ,'RP','CC')
                    and fac.fac_fecha::date between :fechainicio::date and :fechafin::date ";
        return $this->executeQuery($sql, $parametros);
    }

    public function getFacturasNotasConceptos($idFactura) {
        $parametros['idfactura'] = $idFactura;
        $sql = "SELECT *,((valorliquidado - valorpagado) + valornota) saldo
                  FROM (
                         SELECT
                           dfan.fac_ideregistro idfactura,
                           dfan.uni_concepto    idconcepto,
                           con.con_nombre       concepto,
                           con.con_operacion    operacion,
                           dfap.dfac_vlrtotal   valorliquidado,
                           coalesce((SELECT valorpagado
                                     FROM getdetalleestadocuenta(dfap.dfac_ideregistr, fac.fac_fecha)
                                    ), 0) valorpagado,
                           dfan.dfac_vlrreal    valornota,
                           COALESCE((SELECT dfa.dfac_vlrtotal
                                     FROM
                                       dfac_detfactura dfa INNER JOIN fac_factura fa ON dfa.fac_ideregistro = fa.fac_ideregistro
                                       INNER JOIN doti_doctipo doti ON doti.uni_tipdocument = fa.uni_tipdocument
                                       INNER JOIN ddot_detdoctipo ddot ON doti.doti_ideregistr = ddot.doti_ideregistr
                                       INNER JOIN fac_factura facc on fa.fac_idepadre = facc.fac_ideregistro 
                                     WHERE
                                       ddot.ddot_tipo = 'NS' AND fa.uni_documento = ddot.uni_documento AND
                                       dfa.dfac_idepadre = dfap.dfac_ideregistr and doti.uni_documento = facc.uni_documento
                                       AND fa.fac_fecha = fac.fac_fecha
                                    ), 0) notasaldofavor
                         FROM
                           dfac_detfactura dfan INNER JOIN dfac_detfactura dfap ON dfan.dfac_idepadre = dfap.dfac_ideregistr
                           INNER JOIN fac_factura fac ON dfan.fac_ideregistro = fac.fac_ideregistro
                           INNER JOIN con_concepto con ON con.uni_concepto = dfan.uni_concepto
                         WHERE
                           fac.fac_ideregistro = :idfactura and con.con_operacion='S'
                       ) AS info";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta los recaudos de una factura
     * @param int $idFactura
     * @return array
     */
    public function getRecaudosFactura($idFactura) {
        $parametros['idfactura'] = $idFactura;
        $sql = "SELECT DISTINCT
                        rec.rec_ideregistro idrecaudo,
                        rec.rec_fecha fecharegistro,
                        rec.rec_fecpago fechapago,
                        drec.drec_fecha fechaaplicado,
                        rec.rec_vlrreal valortotalrecaudo,
                        rec.uni_municipio idsucursal,
                        pro.proyecto_nom sucursal,
                        uni.uni_nombre1 mediopago,
                        uni.uni_ideregistro idmediopago,
                        doc.uni_documento idclasepago,
                        doc.doc_nombre clasepago,
                        usu.usu_ideregistro idusuario,
                        usu.usuario_nom usuario,
                        drec.dire_ideregistr,
                        (
                                SELECT
                                        SUM (dre.drec_vlrreal)
                                FROM
                                        drec_detrecaudo dre
                                INNER JOIN rec_recaudo re ON dre.rec_ideregistro = re.rec_ideregistro
                                WHERE
                                        	(	re.rec_ideregistro = rec.rec_ideregistro
                                                OR re.rec_idepadre = rec.rec_ideregistro) AND dre.fac_ideregistro = :idfactura
                                                and dre.dire_ideregistr= drec.dire_ideregistr 
                        ) valorpagadofactura
                FROM
                        rec_recaudo rec
                INNER JOIN drec_detrecaudo drec ON rec.rec_ideregistro = drec.rec_ideregistro
                INNER JOIN proyectos pro ON rec.uni_municipio = pro.proyecto_ideregistro
                INNER JOIN uni_unidad uni ON rec.uni_medpago = uni.uni_ideregistro
                INNER JOIN doc_documento doc ON doc.uni_documento = rec.uni_documento
                INNER JOIN usuarios usu ON usu.usu_ideregistro = rec.usu_ideregistro
                WHERE
                        rec.rec_idepadre IS NULL
                AND drec.fac_ideregistro = :idfactura
                
                GROUP BY
                        rec.rec_ideregistro,
                        rec.rec_fecha,
                        rec.rec_vlrreal,
                        drec.drec_fecha,
                        rec.uni_municipio,
                        pro.proyecto_nom,
                        uni.uni_nombre1,
                        uni.uni_ideregistro,
                        doc.uni_documento,
                        doc.doc_nombre,
                        usu.usu_ideregistro,
                        usu.usuario_nom,drec.dire_ideregistr
                HAVING (
                                SELECT
                                        SUM (dre.drec_vlrreal)
                                FROM
                                        drec_detrecaudo dre
                                INNER JOIN rec_recaudo re ON dre.rec_ideregistro = re.rec_ideregistro
                                WHERE
                                        	(	re.rec_ideregistro = rec.rec_ideregistro
                                                OR re.rec_idepadre = rec.rec_ideregistro) AND dre.fac_ideregistro = :idfactura
                        )  > 0";
        $respuesta = $this->executeQuery($sql, $parametros);
        return $respuesta;
    }

    /**
     * Consulta los recaudos de una suscripción dependiendo de un rango de fechas
     * @param int $idSuscripcion
     * @return array
     */
    public function getRecaudosSuscripcion($idSuscripcion, $fechaInicio, $fechaFin) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['fechainicio'] = $fechaInicio;
        $parametros['fechafin'] = $fechaFin;
        $sql = "SELECT 
                        rec.rec_ideregistro idrecaudo,
                        rec.rec_fecha fecharegistro,
                        rec.rec_fecpago fechapago,                       
                        rec.rec_vlrpagado valortotalrecaudo,
                        rec.uni_municipio idsucursal,
                        pro.proyecto_nom sucursal,
                        uni.uni_nombre1 mediopago,
                        uni.uni_ideregistro idmediopago,
                        doc.uni_documento idclasepago,
                        doc.doc_nombre clasepago,
                        dire.uni_tipdocument tipodocumento,
                        tido.tido_nombre tidonombre,
                        docdire.doc_nombre docnombre,
                        (select sum(dire_sdorecaudo) from dire_disrecaudo
                        where dire_ideregistr= dire.dire_ideregistr)  valordisponible,
                        usu.usu_ideregistro idusuario,
                        usu.usuario_nom usuario, con.con_nombre nombreconcepto
                FROM
                        rec_recaudo rec
                LEFT JOIN drec_detrecaudo drec ON rec.rec_ideregistro = drec.rec_ideregistro
                INNER JOIN proyectos pro ON rec.uni_municipio = pro.proyecto_ideregistro
                INNER JOIN uni_unidad uni ON rec.uni_medpago = uni.uni_ideregistro
                INNER JOIN doc_documento doc ON doc.uni_documento = rec.uni_documento
                INNER JOIN usuarios usu ON usu.usu_ideregistro = rec.usu_ideregistro
                INNER JOIN dire_disrecaudo dire ON dire.rec_ideregistro = rec.rec_ideregistro
                LEFT JOIN tido_tipdocumen tido ON tido.uni_tipdocument = dire.uni_tipdocument
                LEFT JOIN doc_documento docdire ON docdire.uni_documento = dire.uni_documento
                LEFT JOIN con_concepto con ON con.uni_concepto =  dire.uni_concepto
                WHERE
                        dire.dsus_ideregistr = :idsuscripcion
                        AND rec.rec_fecha::date BETWEEN :fechainicio and :fechafin 
                AND rec.rec_idepadre IS NULL  AND rec.rec_estado IN ('A', 'G')
                GROUP BY
                        rec.rec_ideregistro,
                        rec.rec_fecha,
                        rec.rec_vlrreal,
                        rec.uni_municipio,
                        pro.proyecto_nom,
                        uni.uni_nombre1,
                        uni.uni_ideregistro,
                        doc.uni_documento,
                        doc.doc_nombre,
                        usu.usu_ideregistro,
                        usu.usuario_nom,
                        dire.dire_ideregistr,
                        dire.dire_vlrrecaudo,
                        dire.dire_sdorecaudo,
                        tido.tido_nombre, docdire.doc_nombre, con.con_nombre
                        ORDER BY rec.rec_fecpago DESC";
        return $this->executeQuery($sql, $parametros);
    }

    public function getClasesPago($idSuscripcion, $fechaInicio, $fechaFin) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['fechainicio'] = $fechaInicio;
        $parametros['fechafin'] = $fechaFin;
        $sql = "select 
                  distinct rec.uni_documento idclasepago,doc.doc_nombre documento
                from 
                   rec_recaudo rec inner join dire_disrecaudo dire on rec.rec_ideregistro=dire.rec_ideregistro
                   inner join doc_documento doc on rec.uni_documento=doc.uni_documento
                where dire.dsus_ideregistr = :idsuscripcion and rec.rec_fecha::date between :fechainicio and :fechafin
                and rec.rec_estado not in('E','D') and rec.rec_vlrreal>0 ";
        return $this->executeQuery($sql, $parametros);
    }

    public function getFacturasRecaudos($idRecaudo) {
        $parametros['idrecaudo'] = $idRecaudo;
        $sql = "SELECT DISTINCT
                        fac.emp_ideregistro idempresa,
                        emp.empresa_nom empresa,
                        fac.fac_fecha fecha,
                        fac.fac_numero numero,
                        cic.cic_ideregistro idciclo,
                        per.per_ideregistro idperiodo,
                        cic.cic_nombre || ' ' || per.per_nombre cicloperiodo,
                        fac.fac_vlrreal valortotal,
                        drec.drec_vlrreal valorpagado ,
                        fac.fac_vlrreal - fac.fac_sdoreal valorpagado_antes,
                        fac.fac_sdoreal saldo,
                        liq.uni_liquidacion idliquidacion,
                        liq.liq_nombre liquidacion,
                        uni.uni_ideregistro idtipodocumento,
                        uni.uni_nombre1 tipodocumento,
                        drec.rec_ideregistro idrecaudo,
                        drec.drec_fecha fechaaplicado,
                        fac.fac_ideregistro idfactura,
                        doc.doc_nombre documento
                FROM
                        drec_detrecaudo drec
                INNER JOIN fac_factura fac ON drec.fac_ideregistro = fac.fac_ideregistro
                INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = fac.uni_tipdocument
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = fac.cic_ideregistro
                INNER JOIN per_periodo per ON fac.per_ideregistro = per.per_ideregistro
                INNER JOIN liq_liquidacion liq ON fac.uni_liquidacion = liq.uni_liquidacion
                INNER JOIN empresas emp ON emp.empresa_sevemp = fac.emp_ideregistro
                                where drec.rec_ideregistro=:idrecaudo  ";
        return $this->executeQuery($sql, $parametros);
    }

    public function getFinanciacionSuscripcion($idSuscripcion, $fechaInicio, $fechaFin) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['fechainicio'] = $fechaInicio;
        $parametros['fechafin'] = $fechaFin;
        $sql = "select 
                  fin.fin_ideregistro idfinanciacion, fin.fin_fecha fecha,ters.ter_ideregistro idsolicitante, ters.ter_nomcompleto nombresolicitante,
                  ter.ter_ideregistro idbanco, ter.ter_nomcompleto banco, liq.uni_liquidacion idliquidacion,liq.liq_nombre liquidacion,
                  cic.cic_ideregistro idciclo,per.per_ideregistro idperiodo, cic.cic_nombre || ' ' || per.per_nombre cicloperiodo,
                  doc.uni_documento iddocumento, doc.doc_nombre documento, amfi.uni_tipdocument idtipodocumento, uni.uni_nombre1 tipodocumento,
                  fin.fin_inicapital capitalinicial, fin.fin_sdocapital saldocapital,amfi.amfi_numcuotas numerocuotas,amfi.amfi_numcuotas-amfi.amfi_cuoamortiz cuotaspendiente
                from fin_financiacio fin inner join ter_tercero ter on fin.ter_ideentfinan=ter.ter_ideregistro
                  inner join ter_tercero ters on fin.ter_idesolicita=ters.ter_ideregistro
                  inner join amfi_amofinanci amfi on fin.fin_ideregistro=amfi.fin_ideregistro
                  inner join liq_liquidacion liq on amfi.uni_liquidacion=liq.uni_liquidacion
                  inner join cic_ciclo cic on cic.cic_ideregistro=fin.cic_ideregistro
                  inner join per_periodo per on fin.per_ideregistro=per.per_ideregistro
                  inner join uni_unidad uni on amfi.uni_tipdocument=uni.uni_ideregistro
                  inner join doc_documento doc on amfi.uni_documento=doc.uni_documento
                where
                 fin.dsus_ideregistr=:idsuscripcion and fin.fin_estado in ('A','R') and amfi.amfi_estado='A' 
                 and fin.fin_fecha::date  between :fechainicio and :fechafin  ";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Permite obtener las facturas que hacen parte de una financiación 
     * @param type $idFinanciacion
     * @return type
     */
    public function getFacturasFinanciacion($idFinanciacion) {
        $parametros['idfinanciacion'] = $idFinanciacion;
        $sql = "SELECT DISTINCT
                        fac.emp_ideregistro idempresa,
                        fac.fac_fecha fecha,
                        fac.fac_numero numero,
                        cic.cic_ideregistro idciclo,
                        per.per_ideregistro idperiodo,
                        cic.cic_nombre || ' ' || per.per_nombre cicloperiodo,
                        fac.fac_vlrreal valortotal,
                        fac.fac_vlrreal - fac.fac_sdoreal valorpagado,
                        fac.fac_sdoreal saldo,
                        liq.uni_liquidacion idliquidacion,
                        liq.liq_nombre liquidacion,
                        uni.uni_ideregistro idtipodocumento,
                        uni.uni_nombre1 tipodocumento,
                        fac.fac_ideregistro idfactura,
                        doc.doc_nombre documento,
                        emp.empresa_nom empresa
                FROM
                        fin_financiacio fin
                INNER JOIN dfin_detfinanci dfin ON dfin.fin_ideregistro = fin.fin_ideregistro
                INNER JOIN fac_factura fac ON fac.fac_ideregistro = dfin.fac_ideregistro
                INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro = fac.fac_ideregistro
                INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = fac.uni_tipdocument
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = fac.cic_ideregistro
                INNER JOIN per_periodo per ON fac.per_ideregistro = per.per_ideregistro
                INNER JOIN liq_liquidacion liq ON fac.uni_liquidacion = liq.uni_liquidacion
                INNER JOIN empresas emp ON emp.empresa_sevemp = fac.emp_ideregistro
                WHERE
                        fin.fin_ideregistro = :idfinanciacion and dfac_ideorigen is  null";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * 
     * @param type $fechaInicial
     * @param type $fechaFinal
     * @param type $idfinanciacion
     * @return type
     */
    public function getAmortizaciones($fechainicio, $fechafin, $idfinanciacion) {
        $parametros['idfinanciacion'] = $idfinanciacion;
        $parametros['fechainicio'] = $fechainicio;
        $parametros['fechafin'] = $fechafin;
        $sql = "SELECT distinct
                        emp.empresa_nom empresa,
                        fac.fac_fecha fecha,
                        fac.fac_numero numerofactura,
                        cic.cic_nombre || ' ' || per.per_nombre cicloperiodo,
                        fac.fac_vlrreal valortotal,
                        (
                                fac.fac_vlrreal - fac.fac_sdoreal
                        ) valorpagado,
                        fac.fac_sdoreal saldo,
                        liq.liq_nombre liquidacion,
                        doc.doc_nombre documento,
                        uni.uni_nombre1 tipodocumento
                FROM
                        fin_financiacio fin
                INNER JOIN fac_factura fac ON fac.fin_ideregistro = fin.fin_ideregistro  AND fac.fac_estado <> 'E'
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = fac.cic_ideregistro
                INNER JOIN per_periodo per ON per.per_ideregistro = fac.per_ideregistro
                INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion = fac.uni_liquidacion
                INNER JOIN empresas emp ON emp.empresa_sevemp = fac.emp_ideregistro
                INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = fac.uni_tipdocument
                where fin.fin_ideregistro = :idfinanciacion and fin.fin_estado in ('A','R')  
                and (  fac.fac_fecha::date  BETWEEN :fechainicio and :fechafin)";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * @param type $idfinanciacion
     * @param type $fechainicio
     * @param type $fechafin
     * @return type
     */
    public function getCartera($idfinanciacion, $fechainicio, $fechafin) {
        $parametros['idfinanciacion'] = $idfinanciacion;
        $parametros['fechainicio'] = $fechainicio;
        $parametros['fechafin'] = $fechafin;
        $sql = "select * from getCartera(:fechainicio::date,:fechafin::date,:idfinanciacion);";
        return $this->executeQuery($sql, $parametros);
    }

    public function getEmpresas($empresa) {
        $sql = "select  emp.empresa_nom empresa, emp.empresa_sevemp idempresa 
                from  empresas emp 
                where emp.empresa_sevemp is not null and emp.empresa_sevemp != $empresa";
        return $this->executeQuery($sql);
    }

    /**
     * Permite cargar las certificaciones
     * @param int $idempresa ientificador de la empresa
     * @return Array
     */
    public function getCertificacionesModel($idsuscripcion, $idempresa) {
        $sql = "(SELECT
                      quinquenio_ultcer fechacertificacion,
                      quinquenio_procer fechaproximacertificacion,
                      visitaqui_numfac numeroacta,
                    (case when COALESCE((SELECT count(*) from dsma_detsuscripmatriz dsma
                    where dsus.dsus_ideregistr=dsma.dsus_idematriz),0)>0 then 'LINEA MATRIZ'
                    else 'CLIENTE'
                    end) linea_pertence,
                    (SELECT emp.empresa_nom from cuadrillas cua
                    inner join empresas emp on emp.empresa_cod = cua.cuadrilla_codemp
                    where cua.cuadrilla_cod=visitas_qui.visitaqui_codcua limit 1) ente_certificador
                                  FROM
                                          quinquenios quin
                                  INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_pcodigo = quinquenio_codsus
                                  INNER JOIN empresas emp ON emp.empresa_cod = quin.quinquenio_codemp
                                  INNER JOIN visitas_qui ON visitaqui_codsus = quinquenio_codsus
                                  AND visitaqui_codnov = '00'
                                  AND emp.empresa_cod = visitaqui_codemp
                                  WHERE
                                          dsus.dsus_ideregistr = :idsuscripcion
                                  AND emp.empresa_sevemp = :idempresa )
                    UNION ALL
                    (SELECT
                                          quinquenio_ultcer fechacertificacion,
                                          quinquenio_procer fechaproximacertificacion,
                                          visitaqui_numfac numeroacta,
                    'LINEA MATRIZ' linea_pertence,
                    (empcert.empresa_nom) ente_certificador
                                  FROM
                                          quinquenios quin
                    inner join dsma_detsuscripmatriz dsma on dsma.dsus_ideregistr= :idsuscripcion  
                    INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_pcodigo = quinquenio_codsus
                                  INNER JOIN empresas emp ON emp.empresa_cod = quin.quinquenio_codemp
                                  INNER JOIN visitas_qui ON visitaqui_codsus = quinquenio_codsus
                                             AND visitaqui_codnov = '00' AND emp.empresa_cod = visitaqui_codemp
                    inner join cuadrillas cua on  cua.cuadrilla_cod=visitas_qui.visitaqui_codcua
                    inner join empresas empcert on empcert.empresa_cod = cua.cuadrilla_codemp
                                  WHERE
                                          dsus.dsus_ideregistr = dsma.dsus_idematriz
                                  AND emp.empresa_sevemp = :idempresa
                    );";

        $parametros['idempresa'] = $idempresa;
        $parametros['idsuscripcion'] = $idsuscripcion;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Permite cargar las PQR
     * @param int $idsuscripcion identificador de la suscripción
     * @param string $fechainicio fecha inicial
     * @param string $fechafin fecha final
     * @param int $idempresa identificador de la empresa
     * @return Array
     */
    public function getPQRModel($idsuscripcion, $idempresa, $fechainicio, $fechafin) {
        $sql = "SELECT DISTINCT
                        reclamo_numpqr numeropqr,
                        reclamo_fecsol fechasolicitud,
                        servicio_nom estado,
                        reclamo_obssol pretencion
                FROM
                        reclamos
                LEFT JOIN pretenciones ON reclamo_numpqr = pretencion_numpqr
                INNER JOIN servicios ON reclamo_est = servicio_cod
                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_pcodigo = reclamo_codsus
                INNER JOIN empresas emp ON emp.empresa_cod = reclamo_codemp
                WHERE
                        dsus_ideregistr = :idsuscripcion
                AND reclamo_fecsol::DATE BETWEEN :fechainicial
                AND :fechafin
                AND emp.empresa_sevemp = :idempresa;";

        $parametros['idempresa'] = $idempresa;
        $parametros['idsuscripcion'] = $idsuscripcion;
        $parametros['fechainicial'] = $fechainicio;
        $parametros['fechafin'] = $fechafin;

        return $this->executeQuery($sql, $parametros);
    }

    public function getFacturasOtrasEmpresas($empresa, $fechainicio, $fechafin, $suscripcion) {

        $parametros['empresa'] = $empresa;
        $parametros['fechainicio'] = $fechainicio;
        $parametros['fechafin'] = $fechafin;
        $parametros['suscripcion'] = $suscripcion;

        $sql = "SELECT
                        emp.empresa_nom empresa,
                        fac.fac_fecha fecha,
                        fac.fac_numero numero,
                        cic.cic_nombre || ' ' || per.per_nombre cicloperiodo,
                        fac.fac_vlrreal valortotal,
                        (
                                fac.fac_vlrreal - fac.fac_sdoreal
                        ) valorpagado,
                        fac.fac_sdoreal saldo,
                        liq.liq_nombre liquidacion,
                        doc.doc_nombre documento,
                        uni.uni_nombre1 tipodocumento,
                        fac.fac_ideregistro idfactura
                FROM
                        fac_factura fac
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = fac.cic_ideregistro
                INNER JOIN per_periodo per ON per.per_ideregistro = fac.per_ideregistro
                INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion = fac.uni_liquidacion
                INNER JOIN empresas emp ON emp.empresa_sevemp = fac.emp_ideregistro
                INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = fac.uni_tipdocument
                where (  fac.fac_fecha::DATE  BETWEEN :fechainicio and :fechafin)
                and emp.empresa_sevemp = :empresa
                 and fac.sus_ideregistro = :suscripcion";

        return $this->executeQuery($sql, $parametros);
    }

    public function getDatosSuspensionModel($fechainicio, $fechafin, $suscripcion) {
        $parametros['fechainicio'] = $fechainicio;
        $parametros['fechafin'] = $fechafin;
        $parametros['suscripcion'] = $suscripcion;
        $sql = "SELECT 
                        syr.syr_ideregistro idsuspensionreconexion,
                        syr_estado estado,
                        cic.cic_nombre || '  ' || per.per_nombre cicloperiodo,
                        syr.syr_fecha fechageneracion,
                        syr.syr_fecaprobac fechaaprobacion,
                        syr.syr_fecprocesad fechaprocesado,
                        syr.syr_observacion observacion
                FROM
                        syr_susreconex syr
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = syr.cic_ideregistro
                INNER JOIN per_periodo per ON per.per_ideregistro= syr.per_ideregistro
                WHERE
                        syr.dsus_ideregistr = :suscripcion
                AND syr.syr_fecha::DATE between  :fechainicio :: DATE
                AND :fechafin :: DATE
                AND syr.syr_estado != 'E' ORDER BY syr.syr_ideregistro desc;";
        return $this->executeQuery($sql, $parametros);
    }

    public function getSuspensionesModel($idsuspensionreconexion) {
        $parametros['idsuspensionreconexion'] = $idsuspensionreconexion;
        $sql = "SELECT
                        ssp.ssp_estado estado,
                        uni.uni_ideregistro idmotivo,
                        uni.uni_nombre1 motivo,
                        unin.uni_ideregistro idnovedad,
                        unin.uni_nombre1 novedad,
                        unit.uni_ideregistro idtiposuspension,
                        ssp.ssp_fecaprobac fechaaprobacion,
                        ssp.ssp_fecejesuspe fechaejecucion,
                        ter.ter_ideregistro idempresasuspende,
                        ter.ter_nombre empresasuspende,
                        ssp.ssp_lectura lectura,
                        ssp.ssp_observacion observacion,
                        ssp.ssp_vlrtotal vlrtotal, 
                        CASE 
                            WHEN (  SELECT  COUNT(*)
                                    FROM    adss_adjsuspension AS adss 
                                    WHERE   adss.ssp_ideregistro = ssp.ssp_ideregistro) > 0 THEN 'http://10.43.51.150/SuresWS/archivos/actividad?tipo=Suspension&idActividad='||ssp.ssp_ideregistro
                        END href
                FROM
                        ssp_suspension ssp
                LEFT JOIN uni_unidad uni ON ssp.uni_motsuspen = uni.uni_ideregistro
                LEFT JOIN uni_unidad unin ON unin.uni_ideregistro = ssp.uni_novsuspen
                LEFT JOIN uni_unidad unit ON unit.uni_ideregistro = ssp.uni_tipsuspen
                LEFT JOIN ter_tercero ter ON ter.ter_ideregistro = ssp.ter_ejesuspens
                WHERE
                        ssp.syr_ideregistro = :idsuspensionreconexion ORDER BY ssp.ssp_fecejesuspe desc";
        return $this->executeQuery($sql, $parametros);
    }

    public function getReconexionesModel($idsuspensionreconexion) {
        $parametros['idsuspensionreconexion'] = $idsuspensionreconexion;
        $sql = "SELECT
                        rco.rco_ideregistro idreconexion,
                        uni.uni_ideregistro idnovedad,
                        uni.uni_nombre1 novedad,
                        con.uni_concepto idconcepto,
                        con.con_nombre concepto,
                        rco.rco_fecaprobac fechaaprobacion,
                        rco.rco_fecejerecon fechaejecucion,
                        rco.rco_fecaprobac fechaprogramacion,
                        ter.ter_ideregistro idempresareconexion,
                        ter.ter_nomcompleto empresareconexion,
                        rco.rco_lectura lectura,
                        rco.rco_vlrtotal valortotal,
                        rco.rco_observacion observacion,
                        rco.rco_estado estado,
                        rco.rco_fecha fecha,
			morx.morx_nombre motivorx,
                        CASE 
                            WHEN (  SELECT  COUNT(*)
                                    FROM    adrc_adjreconexion AS adrc 
                                    WHERE   adrc.rco_ideregistro = rco.rco_ideregistro) > 0 THEN 'http://10.43.51.150/SuresWS/archivos/actividad?tipo=Reconexion&idActividad='||rco.rco_ideregistro
                        END href
                FROM
                        rco_reconexion rco
                LEFT JOIN con_concepto con ON rco.uni_concepto = con.uni_concepto
                LEFT JOIN ter_tercero ter ON ter.ter_ideregistro = rco.ter_ejereconex
                LEFT JOIN uni_unidad uni ON uni.uni_ideregistro = rco.uni_novreconex
                LEFT JOIN uni_unidad unim ON unim.uni_ideregistro = rco.uni_motreconex
                LEFT JOIN morx_motreconex morx ON morx.uni_motreconex = rco.uni_motreconex
                WHERE
                        rco.syr_ideregistro = :idsuspensionreconexion ORDER BY rco.rco_fecejerecon desc";
        return $this->executeQuery($sql, $parametros);
    }

    public function getLecturasModel($suscripcion, $fechainicio, $fechafin) {
        $parametros['fechainicio'] = $fechainicio;
        $parametros['fechafin'] = $fechafin;
        $parametros['suscripcion'] = $suscripcion;
        $sql = "SELECT
                        lec.lec_ideregistro idlectura,
                        lec_fecha fecha,
                        lec_estado lecturaestado,
                        lec.lec_anterior lecturaanterior,
                        lec.lec_actual lecturaactual,
                        lec.lec_consumo consumo,
                        lec.lec_observacion observacion
                FROM
                        lec_lectura lec
                WHERE
                        lec.dsus_ideregistr = :suscripcion
                AND lec.lec_fecha::DATE BETWEEN :fechainicio :: DATE
                AND :fechafin :: DATE AND lec.lec_estado !='E' order by lec_fecha desc";
        return $this->executeQuery($sql, $parametros);
    }

    public function getLecturaVistaModel($idlectura) {
        $parametros['idlectura'] = $idlectura;
        $sql = "SELECT
                            lec.lec_estado estado,
                            lec.lec_fecaprobac fechaaprobacion,
                            lec_anterior lecturaanterior,
                            lec_consumo lecturaconsumo,
                            lec_actual lecactual,
                            lec_conpromedio consumopromedio,
                            lec.lec_observacion observacion,
                            lec.pro_idepropiedad numeromedidor,
                            cic.cic_nombre || '  ' || per.per_nombre cicloperiodo,
                            lec.cic_ano anociclo,
                            emp.empresa_nom empresa,
                            lec.pro_digitos digitos,
                            lec.lec_desviacion desviacion,
                            lec.dsus_factor factor
                    FROM
                            lec_lectura lec
                    INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = lec.cic_ideregistro
                    INNER JOIN per_periodo per ON per.per_ideregistro = lec.per_ideregistro
                    INNER JOIN empresas emp ON emp.empresa_sevemp = lec.emp_ideregistro
                    WHERE
                            lec.lec_ideregistro = :idlectura";
        return $this->executeQuery($sql, $parametros);
    }

    public function getDetalleLecturaModel($idlectura) {
        $parametros['idlectura'] = $idlectura;
        $sql = "SELECT
                            dlec_estado estado,
                            dlec.dlec_fecprogram fechaprogramacion,
                            dlec.dlec_fecaprobac fechaaprobacion,
                            dlec.dlec_actual lecturaactual,
                            dlec.dlec_lecreal lecturareal,
                            dlec.dlec_consumo consumo,
                            dlec.dlec_observacio observacion,
                            ter.ter_nomcompleto ejecutor,
                            dlec.lec_anterior anterior,
                            dlec.uni_anolectura anolectura,
                            emp.empresa_nom nombreempresa,
                            dlec.dlec_realizada realizada,
                            uni.uni_nombre1 novedad,
                            usu.usuario_nom autor
               FROM
                            dlec_detlectura dlec
               LEFT JOIN ter_tercero ter ON ter.ter_ideregistro = dlec.ter_ideejecuta
               INNER JOIN empresas emp ON emp.empresa_sevemp = dlec.emp_ideregistro
               LEFT JOIN uni_unidad uni ON uni.uni_ideregistro = dlec.uni_novlectura
               LEFT JOIN usuarios usu
                ON      usu.usu_ideregistro=dlec.usu_ideregistro
               WHERE dlec.lec_ideregistro =:idlectura";

        return $this->executeQuery($sql, $parametros);
    }

    /**
     * 
     * @param type $suscripcion
     * @param type $fechainicio
     * @param type $fechafin
     * @return type
     */
    public function getNotasFacturaModel($suscripcion, $fechainicio, $fechafin) {
        $parametros['fechainicio'] = $fechainicio;
        $parametros['fechafin'] = $fechafin;
        $parametros['suscripcion'] = $suscripcion;
        $sql = "SELECT DISTINCT
                        fac.dsus_ideregistr,
                        fac.fac_ideregistro,
                        nota.not_ideregistro,
                        nota.not_comentario,
                        mono.mono_nombre motivo,
                        fac.fac_numero numerofactura,
                        (select SUM(dfac_vlrtotal) from dfac_detfactura dfac INNER JOIN con_concepto con1 on con1.uni_concepto = dfac.uni_concepto
                        where dfac.fac_ideregistro=fac.fac_ideregistro and con1.con_operacion != 'I') valornota,
                        fac.fac_fecha,
                        usu.usuario_nom usuarioregistro,
                        cic.cic_nombre || ' ' || per.per_nombre cicloperiodo,
                        fac.uni_documento iddocumento,
                        doc.doc_nombre documento,
                        uni.uni_nombre1 tipodocumento
                FROM
                        fac_factura fac
                INNER JOIN dfac_detfactura dfac ON fac.fac_ideregistro = dfac.fac_ideregistro
                INNER JOIN nofa_notfactura nofa ON nofa.fac_ideregistro = fac.fac_ideregistro
                INNER JOIN not_nota nota ON nota.not_ideregistro = nofa.not_ideregistro
                INNER JOIN mono_motnota mono ON mono.uni_motnota = nota.uni_motnota
                INNER JOIN usuarios usu ON usu.usu_ideregistro = fac.usu_ideregistro
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = fac.cic_ideregistro
                INNER JOIN per_periodo per ON per.per_ideregistro = fac.per_ideregistro
                INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = fac.uni_tipdocument
                INNER JOIN con_concepto con on con.uni_concepto = dfac.uni_concepto
		WHERE fac.fac_idepadre IS NOT NULL and con.con_operacion != 'I' and fac.dsus_ideregistr = :suscripcion and fac.fac_fecha::date BETWEEN :fechainicio and :fechafin";
        return $this->executeQuery($sql, $parametros);
    }

    public function getNotasRecaudoModel($suscripcion, $fechainicio, $fechafin) {
        $parametros['fechainicio'] = $fechainicio;
        $parametros['fechafin'] = $fechafin;
        $parametros['suscripcion'] = $suscripcion;
        $sql = "select distinct dato.*, uni.uni_nombre1 tipodocumento from ( SELECT
                        dire.dsus_ideregistr,
                        rec.rec_ideregistro idrecaudo,
                        nota.not_ideregistro,
                        nota.not_comentario,
                        mono.mono_nombre motivo,
                        rec.rec_ideregistro numerorecaudo,
                        rec.rec_vlrreal valornota,
                        rec.rec_fecha,
                        usu.usuario_nom usuarioregistro,
                        cic.cic_nombre || ' ' || per.per_nombre cicloperiodo,
                        rec.uni_documento iddocumento,
                        doc.doc_nombre documento,
                CASE
                WHEN (
                        SELECT distinct
                                dre.uni_tipdocument
                        FROM
                                drec_detrecaudo dre
                        INNER JOIN uni_unidad uni ON uni.uni_ideregistro = dre.uni_tipdocument
                        WHERE
                                dre.rec_ideregistro = rec.rec_ideregistro
                )
                 IS NOT NULL THEN
                        (SELECT distinct
                                dre.uni_tipdocument

                FROM
                        drec_detrecaudo dre
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = dre.uni_tipdocument
                WHERE
                        dre.rec_ideregistro = rec.rec_ideregistro
                )
                ELSE
                        (
                                SELECT DISTINCT
                                        ddire.uni_tipdocument
                                FROM
                                        dire_disrecaudo ddire
                                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = ddire.uni_tipdocument
                                WHERE
                                        ddire.rec_ideregistro = rec.rec_ideregistro
                        )
                END idtipodocumento
                FROM
                        rec_recaudo rec
                INNER JOIN nore_notrecaudo nore ON nore.rec_ideregistro = rec.rec_ideregistro
                INNER JOIN not_nota nota ON nore.not_ideregistro = nota.not_ideregistro
                INNER JOIN mono_motnota mono ON mono.uni_motnota = nota.uni_motnota
                INNER JOIN dire_disrecaudo dire ON dire.rec_ideregistro = rec.rec_ideregistro
                INNER JOIN per_periodo per ON per.per_ideregistro = dire.per_ideregistro
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = dire.cic_ideregistro
                INNER JOIN usuarios usu ON usu.usu_ideregistro = rec.usu_ideregistro
                INNER JOIN doc_documento doc ON doc.uni_documento = rec.uni_documento
                WHERE
                        rec.rec_idepadre IS NOT NULL
                AND dire.dsus_ideregistr = :suscripcion AND rec.rec_fecha::date BETWEEN :fechainicio::date and :fechafin::date
                ) AS dato
                INNER JOIN uni_unidad uni ON dato.idtipodocumento = uni.uni_ideregistro
                
                ";
        return $this->executeQuery($sql, $parametros);
    }

    // <editor-fold desc="Reclamos Model">  
    /**
     * Permite obtener los reclamos existentes  por suscripcion y fechas
     * @param int $idsuscripcion tipo de suscripción
     * @param Date $fechainicial fecha inicial de proceso
     * @param Date $fechafinal fecha Final de proceso
     * @return Array listado de reclamos
     */
    public function ObtenerReclamosModel($idsuscripcion, $fechainicial, $fechafinal) {
        $sql = "SELECT
                        rec.reclamo_codrec idreclamo,
                        rec.reclamo_numpqr numeropqr,
                        rec.reclamo_fecsol fechasolicitud,
                        tipos.tipatencion_des tiposolicitud,
                        tipa.tipatencion_des tipoatencion,
                        rec.reclamo_tipnot tiponotificacion,
                        rec.reclamo_nomsol reclamo
                FROM
                        reclamos rec
                INNER JOIN tip_atenciones tipa ON tipa.tipatencion_cod = rec.reclamo_tipate
                INNER JOIN tip_atenciones tipos ON tipos.tipatencion_cod = rec.reclamo_tipsol
                INNER JOIN dsus_detsuscrip dsus ON rec.reclamo_codsus = dsus.dsus_pcodigo
                WHERE
                        rec.reclamo_fecsol BETWEEN :fechainicial::DATE
                        AND :fechafinal::DATE
                        AND dsus.dsus_ideregistr = :idsuscripcion;";
        $parametros["fechainicial"] = $fechainicial;
        $parametros["fechafinal"] = $fechafinal;
        $parametros["idsuscripcion"] = $idsuscripcion;
        return $this->executeQuery($sql, $parametros);
    }
    
    /**
     * @param type $idsuscripcion
     * @param type $fechainicio
     * @param type $fechafin
     * @return type
     */
    public function getTarifas($idSuscripcion, $fechainicio, $fechafin) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['fechainicio'] = $fechainicio;
        $parametros['fechafin'] = $fechafin;
        //$sql = "select * from fn_dsus_reportesaldopciontarifacliente(:idsuscripcion,:fechainicio::date,:fechafin::date);";
        $sql = "select * from fn_dsus_reportesaldopciontarifacliente(:idsuscripcion);";
        return $this->executeQuery($sql, $parametros);
    }
    
    public function getAllConceptos($idFactura) {
        $parametros['idfactura'] = $idFactura;
        $complemento = " where fac.fac_ideregistro=:idfactura  order by valortotal desc ";
        return $this->genericoModel->getConceptosInformacion($complemento, $parametros);
    }
    
     /** obtiene los datos actualizados de un cliente de meses anteriores
     * @param type $idsuscripcion
     * @param type $fechainicio
     * @param type $fechafin
     * @return type
     */
    public function getAuditoriaTercero($idSuscripcion, $fechainicio, $fechafin) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['fechainicio'] = $fechainicio;
        $parametros['fechafin'] = $fechafin;
        $sql = "	select cambio_propietario.* from (
	select distinct  -- se busca que exista un cambio de propietario y se hace un limit a Uno
                auds.auds_fecha fecha, 
              (auteold.aute_infnueva::json ->> 'ter_documento') documentoold,
                 (autenew.aute_infnueva::json ->> 'ter_documento') documentonew,
               (auteold.aute_infnueva::json ->> 'ter_nombre') || ' ' || (auteold.aute_infnueva::json ->> 'ter_apellido') nombreold , 
               (autenew.aute_infanterior::json ->> 'ter_nombre') || ' ' || (autenew.aute_infanterior::json ->> 'ter_apellido') nombrenew, 
							usuaute.usuario_nom usuaute_nomusuario							
                from auds_auddetsuscrip auds                 
                LEFT JOIN aute_audtercero auteold on auteold.aute_campo = (auds_infanterior::json ->> 'ter_ideregistro')::INTEGER and auteold.aute_opecrud = 'UPDATE'
								LEFT JOIN aute_audtercero autenew on autenew.aute_campo = (auds_infnueva::json ->> 'ter_ideregistro')::INTEGER and auteold.aute_opecrud = 'UPDATE'
		LEFT JOIN usuarios usuaute on usuaute.usu_ideregistro = auds.usu_ideregistro
                where auds_campo =:idsuscripcion  
								and (
									(auds_infanterior::json ->> 'ter_ideregistro')::INTEGER <> (auds_infnueva::json ->> 'ter_ideregistro')::INTEGER
								) 
								limit 1
								) as cambio_propietario	
	union all 
	
select distinct --  se busca si hubo cambio de propietario y se busca toda la informacion del anterior dueño  en auditoria de terceros las posibles modificaciones que tuvo el dueño anterior 
		auds.auds_fecha fecha, 
		(auteold.aute_infanterior::json ->> 'ter_documento') documentoold,
		
		(auteold.aute_infnueva::json ->> 'ter_documento') documentonew,
		(auteold.aute_infanterior::json ->> 'ter_nombre')  || ' ' || (auteold.aute_infanterior::json ->> 'ter_apellido') nombreold,
		
		(auteold.aute_infnueva::json ->> 'ter_nombre')  || ' ' || (auteold.aute_infnueva::json ->> 'ter_apellido') nombrenew,
		
	
		usuauteold.usuario_nom usuaute_nomusuario
		
from auds_auddetsuscrip auds 
LEFT JOIN aute_audtercero auteold on auteold.aute_campo = (auds_infanterior::json ->> 'ter_ideregistro')::INTEGER and auteold.aute_opecrud = 'UPDATE'
LEFT JOIN usuarios usuauteold on usuauteold.usu_ideregistro = auteold.usu_ideregistro
                where auds_campo = :idsuscripcion  
								and (
									(auds_infanterior::json ->> 'ter_ideregistro')::INTEGER <> (auds_infnueva::json ->> 'ter_ideregistro')::INTEGER
								)
								
					
								
UNION ALL
	
	
	select distinct -- -- Se buscan los cambios del tercero que tenga la suscripcion
                auteold.aute_fecha fecha, 
              (auteold.aute_infanterior::json ->> 'ter_documento') documentoold,
                (auteold.aute_infnueva::json ->> 'ter_documento') documentonew,
                (auteold.aute_infanterior::json ->> 'ter_nombre') || ' ' || (auteold.aute_infanterior::json ->> 'ter_apellido') nombreold,
                (auteold.aute_infnueva::json ->> 'ter_nombre') || ' ' || (auteold.aute_infnueva::json ->> 'ter_apellido')  nombrenew,
		usuaute.usuario_nom usuaute_nomusuario						

                from dsus_detsuscrip dsus 
                
                INNER JOIN aute_audtercero auteold on auteold.aute_campo = dsus.ter_ideregistro::INTEGER and auteold.aute_opecrud = 'UPDATE'
                
                
		LEFT JOIN usuarios usuaute on usuaute.usu_ideregistro = auteold.usu_ideregistro
                where dsus.dsus_ideregistr = :idsuscripcion   
								and (
									(auteold.aute_infanterior::json ->> 'ter_nombre') <> (auteold.aute_infnueva::json ->> 'ter_nombre')
									OR
									(auteold.aute_infanterior::json ->> 'ter_apellido') <> (auteold.aute_infnueva::json ->> 'ter_apellido')
									OR
									(auteold.aute_infanterior::json ->> 'ter_documento') <> (auteold.aute_infnueva::json ->> 'ter_documento')					
									OR
									(auteold.aute_infanterior::json ->> 'ter_nomcompleto') <> (auteold.aute_infnueva::json ->> 'ter_nomcompleto')
								)
								order by fecha desc";
        return $this->executeQuery($sql, $parametros);
    }
    
    public function getAuditoriaSuscripcion($idSuscripcion, $fechainicio, $fechafin) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['fechainicio'] = $fechainicio;
        $parametros['fechafin'] = $fechafin;
        $sql = "select distinct
                auds.auds_fecha fecha, 
								(auds_infanterior::json ->> 'ter_ideregistro')::INTEGER idterceroold,
								(auds_infnueva::json ->> 'ter_ideregistro')::INTEGER idterceronew, 
                (auds_infanterior::json ->> 'pro_ideregistro')::INTEGER idepropiedadold, 
								(auds_infnueva::json ->> 'pro_ideregistro')::INTEGER idepropiedadnew,
                (auds_infanterior::json ->> 'pro_catestrato')::INTEGER estratoold, 
								(auds_infnueva::json ->> 'pro_catestrato')::INTEGER estratonew,
                uniold.uni_nombre1 usoold, uninew.uni_nombre1 usonew, 
                cicold.cic_nombre cicloold, cicnew.cic_nombre ciclonew,
                auds.usu_ideregistro idusuario, usu.usuario_nom nombreusuario,
                (auds_infanterior::json ->> 'dsus_estado') estadoold, (auds_infnueva::json ->> 'dsus_estado') estadonew,
								(auds_infanterior::json ->> 'uni_tipusosuscr')::INTEGER tipouso_old,
								(auds_infnueva::json ->> 'uni_tipusosuscr')::INTEGER tipouso_new,
								(auds_infanterior::json ->> 'cic_ideregistro')::INTEGER ciclo_old,
								(auds_infnueva::json ->> 'cic_ideregistro')::INTEGER ciclo_new

                from auds_auddetsuscrip auds 
                INNER JOIN usuarios usu on usu.usu_ideregistro = auds.usu_ideregistro
                INNER JOIN uni_unidad uniold on uniold.uni_ideregistro = (auds_infanterior::json ->> 'uni_tipusosuscr')::INTEGER
                INNER JOIN uni_unidad uninew on uninew.uni_ideregistro = (auds_infnueva::json ->> 'uni_tipusosuscr')::INTEGER
                INNER JOIN cic_ciclo cicold on cicold.cic_ideregistro = (auds_infanterior::json ->> 'cic_ideregistro')::INTEGER
                INNER JOIN cic_ciclo cicnew on cicnew.cic_ideregistro = (auds_infnueva::json ->> 'cic_ideregistro')::INTEGER
                where auds_campo = :idsuscripcion 
								and (
											(auds_infanterior::json ->> 'pro_catestrato')::INTEGER <> (auds_infnueva::json ->> 'pro_catestrato')::INTEGER
											OR
											(auds_infanterior::json ->> 'uni_tipusosuscr')::INTEGER <> (auds_infnueva::json ->> 'uni_tipusosuscr')::INTEGER
											OR
											(auds_infanterior::json ->> 'cic_ideregistro')::INTEGER <> (auds_infnueva::json ->> 'cic_ideregistro')::INTEGER
										)
								order by auds.auds_fecha desc";
        return $this->executeQuery($sql, $parametros);
    }
    
    public function getAuditoriaPropiedad($idSuscripcion, $fechainicio, $fechafin) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['fechainicio'] = $fechainicio;
        $parametros['fechafin'] = $fechafin;
        $sql = "select distinct
                auprnew.aupr_fecha fecha,
                (auprnew.aupr_infanterior::json ->> 'pro_idepropieda') medidorold, (auprnew.aupr_infnueva::json ->> 'pro_idepropieda') medidornew,
                (auprnew.aupr_infanterior::json ->> 'pro_digitos')::INTEGER digitosold, (auprnew.aupr_infnueva::json ->> 'pro_digitos')::INTEGER digitosnew,
                (auprnew.aupr_infanterior::json ->> 'pro_zona') zonaold, (auprnew.aupr_infnueva::json ->> 'pro_zona') zonanew,
                (auprnew.aupr_infanterior::json ->> 'pro_numcatastral') catastralold, (auprnew.aupr_infnueva::json ->> 'pro_numcatastral') catastralnew,
                (auprnew.aupr_infanterior::json ->> 'pro_numcatastralnacional') catastralnacionalold, (auprnew.aupr_infnueva::json ->> 'pro_numcatastralnacional') catastralnacionalnew,
                (auprnew.aupr_infanterior::json ->> 'pro_direccion') direccionold, (auprnew.aupr_infnueva::json ->> 'pro_direccion') direccionnew,
		usuaupr.usuario_nom usuaupr_nomusuario, auprnew.aupr_fecha
                from dsus_detsuscrip dsus  
                LEFT JOIN aupr_audpropiedad auprnew on auprnew.aupr_campo = dsus.pro_ideregistro::INTEGER and auprnew.aupr_opecrud = 'UPDATE'
		LEFT JOIN usuarios usuaupr on usuaupr.usu_ideregistro = auprnew.usu_ideregistro
                where dsus.dsus_ideregistr =:idsuscripcion
                and 
                (
                                       (auprnew.aupr_infanterior::json ->> 'pro_idepropieda') <> (auprnew.aupr_infnueva::json ->> 'pro_idepropieda')
                                       OR
                                       (auprnew.aupr_infanterior::json ->> 'pro_digitos') <> (auprnew.aupr_infnueva::json ->> 'pro_digitos')
                                       OR
                                        (auprnew.aupr_infanterior::json ->> 'pro_zona') <> (auprnew.aupr_infnueva::json ->> 'pro_zona')
                                       OR
                                       (auprnew.aupr_infanterior::json ->> 'pro_numcatastral') <> (auprnew.aupr_infnueva::json ->> 'pro_numcatastral')
                                       OR
                                       (auprnew.aupr_infanterior::json ->> 'pro_numcatastralnacional') <> (auprnew.aupr_infnueva::json ->> 'pro_numcatastralnacional')
                                       OR
                                       (auprnew.aupr_infanterior::json ->> 'pro_direccion') <> (auprnew.aupr_infnueva::json ->> 'pro_direccion')
                               )
								ORDER BY auprnew.aupr_fecha desc";
        return $this->executeQuery($sql, $parametros);
    }
    
    public function getAuditoriaConceptoExento($idSuscripcion, $fechainicio, $fechafin) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['fechainicio'] = $fechainicio;
        $parametros['fechafin'] = $fechafin;
        $sql = "select distinct aucs.aucs_fecha fecha, con.con_nombre nombreconcepto, 
                    (aucs.aucs_infanterior::json ->> 'cosu_fecinicio') fechainicialanterior,
                    (aucs.aucs_infanterior::json ->> 'cosu_fecfinal') fechafinalanterior,
                    (aucs.aucs_infnueva::json ->> 'cosu_fecinicio') fechainicialnueva,
                    (aucs.aucs_infnueva::json ->> 'cosu_fecfinal') fechafinalnueva,
                    usuaucs.usuario_nom usu_nomusuario						
                from dsus_detsuscrip dsus 
			INNER JOIN cosu_consuscrip cosu on cosu.dsus_ideregistr = dsus.dsus_ideregistr
                        INNER JOIN aucs_audconsuscrip aucs on (aucs_infanterior::json ->> 'dsus_ideregistr')::INTEGER = dsus.dsus_ideregistr::INTEGER 
							or (aucs_infnueva::json ->> 'dsus_ideregistr')::INTEGER = dsus.dsus_ideregistr::INTEGER 
			INNER JOIN con_concepto con on con.uni_concepto = (aucs_infanterior::json ->> 'uni_concepto')::INTEGER    or con.uni_concepto = (aucs_infnueva::json ->> 'uni_concepto')::INTEGER    
                        LEFT JOIN usuarios usuaucs on usuaucs.usu_ideregistro = aucs.usu_ideregistro
                where dsus.dsus_ideregistr =:idsuscripcion   
		order by fecha desc";
        return $this->executeQuery($sql, $parametros);
    }
    public function getAuditoriaRuta($idSuscripcion, $fechainicio, $fechafin) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['fechainicio'] = $fechainicio;
        $parametros['fechafin'] = $fechafin;
        $sql = "select distinct aurs.aurs_fecha fecha, 
	rutold.rut_nombre rutaanterior,
	rutnew.rut_nombre rutanueva,
	(aurs.aurs_infanterior::json ->> 'rusu_rutsecuen') secuenciaanterior,
	 (aurs.aurs_infnueva::json ->> 'rusu_rutsecuen') secuencianueva,
	
		usuaucs.usuario_nom usu_nomusuario						

                from dsus_detsuscrip dsus 
								INNER JOIN rusu_rutsuscrip rusu on rusu.dsus_ideregistr = dsus.dsus_ideregistr
								INNER JOIN rut_ruta rut on rut.rut_ideregistro = rusu.rut_ideregistro
                
                INNER JOIN aurs_audrusurutsuscrip  aurs on aurs.aurs_campo = rusu.rusu_ideregistr::INTEGER and aurs.aurs_opecrud = 'UPDATE'
								INNER JOIN rut_ruta rutold on rutold.rut_ideregistro = (aurs.aurs_infanterior::json ->> 'rut_ideregistro')::INTEGER
								INNER JOIN rut_ruta rutnew on rutnew.rut_ideregistro = (aurs.aurs_infnueva::json ->> 'rut_ideregistro')::INTEGER
                
                
		LEFT JOIN usuarios usuaucs on usuaucs.usu_ideregistro = aurs.usu_ideregistro
                where dsus.dsus_ideregistr =:idsuscripcion   
							and (
									(aurs.aurs_infanterior::json ->> 'rut_ideregistro')::INTEGER <> (aurs.aurs_infnueva::json ->> 'rut_ideregistro')::INTEGER
							)
								order by fecha desc		";
        return $this->executeQuery($sql, $parametros);
    }

// </editor-fold>
}
