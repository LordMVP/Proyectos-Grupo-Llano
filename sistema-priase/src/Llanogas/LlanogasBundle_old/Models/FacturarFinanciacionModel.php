<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * Genera una financiación, Reestructura
 *
 * @author hrey
 */
class FacturarFinanciacionModel extends AuditoriaServices {

    /**
     * información de sesión del usuario
     * @var array 
     */
    private $sesion;

    /*     * <<
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */

    public function __construct(&$conexion, $sesion) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
    }

    public function vaciarTabla() {
        $sqlTabla = "CREATE TABLE IF NOT EXISTS facturar_financiacion
                (
                  idfinanciacion bigint,
                  fin_version integer,
                  idsuscripcion bigint,
                  idamortizacionfinanciacion bigint,
                  idliquidacion integer,
                  tipocuota character(1),
                  numerocuotas smallint,
                  cuotasamortizadas smallint,
                  iddocumento integer,
                  idtipodocumento integer,
                  cuotasfaltantes smallint,
                  diasfacturar double precision,
                  tasainteres numeric,
                  tasaivainteres numeric,
                  idconceptointeres bigint,
                  idconceptoivainteres bigint,
                  proceso bigint,
                  estado character varying,
                  mensaje character varying,
                  usu_ideregistro bigint,
                  idempresa bigint,
                  saldofinanciacion numeric(20,7),
                  idacceso bigint)";
        $this->executeQuery($sqlTabla);
        $sql = 'delete from facturar_financiacion where idempresa=:idempresa';
        $this->executeQuery($sql, $this->sesion);
    }

    public function cerrarSaldoFinanciacionModel($idfinanciacion) {
        $sql = "UPDATE fin_financiacio
                SET fin_sdocapital = 0
                WHERE
                        fin_ideregistro = $idfinanciacion";
        return $this->executeQuery($sql);
    }

    public function actualizarTasaInteres() {
        $idEmpresa = $this->sesion['idempresa'];
        $sql = "UPDATE facturar_financiacion 
                SET    tasainteres=liquidacion.interes,tasaivainteres=liquidacion.tasaivainteres,
                       idconceptointeres=liquidacion.idconceptointeres,idconceptoivainteres=liquidacion.idconceptoivainteres
                FROM (
                SELECT
                  liq.uni_liquidacion idliquidacionfinanciacion,
                  (con.con_formula::json->0->>'valor')::NUMERIC(20,7) interes,
                  CASE WHEN (LENGTH(cn.con_formula))>0 THEN
                    (cn.con_formula::json->0->>'valor')::NUMERIC(20,7)
                  ELSE
                   0
                  END tasaivainteres,
                  con.uni_concepto idconceptointeres,
                  COALESCE(cn.uni_concepto,0) idconceptoivainteres
                FROM
                  liq_liquidacion liq INNER JOIN coli_conliquida coli ON liq.uni_liquidacion = coli.uni_liquidacion
                  INNER JOIN con_concepto con ON con.uni_concepto=coli.uni_concepto
                  INNER JOIN esem_estempresa esem ON liq.est_liquidacion=esem.est_ideregistro
                  LEFT JOIN core_conrelacio core ON con.uni_concepto=core.uni_conrelacion
                  LEFT JOIN con_concepto cn ON cn.uni_concepto=core.uni_concepto
                WHERE
                  con.con_intfinanciacion='S' AND liq.liq_venclasific='FI' AND esem.emp_ideregistro=$idEmpresa
                ) AS liquidacion WHERE idliquidacion=liquidacion.idliquidacionfinanciacion";
        $this->executeQuery($sql);
    }

    public function cargarFinanciaciones($idCiclo) {
        $parametros['idciclo'] = $idCiclo;
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idacceso'] = $this->sesion['idacceso'];
        $parametros['numeroprocesos'] = NUMERO_HILOS_FACTURACION_FINANCIACION;
        $sql = "INSERT INTO facturar_financiacion  ( SELECT
                 fin.fin_ideregistro,
                 fin.fin_version,
                 dsus.dsus_ideregistr ,
                 amfi.amfi_ideregistr ,
                 amfi.uni_liquidacion ,
                 liq.liq_tipcuota ,
                 amfi.amfi_numcuotas ,
                 amfi.amfi_cuoamortiz ,
                 amfi.uni_documento ,
                 amfi.uni_tipdocument ,
                 amfi.amfi_numcuotas - amfi.amfi_cuoamortiz,
                 CASE WHEN (
                              SELECT count(*) FROM fac_factura fac 
                              WHERE fac.dsus_ideregistr=fin.dsus_ideregistr 
                                 AND fac.fin_ideregistro=fin.fin_ideregistro 
                                 AND fac_estado NOT IN ('E','F')
                                 AND amfi.amfi_cuoamortiz=0 
                                 AND fac.uni_documento=amfi.uni_documento
                           )=0 
                           AND (per.per_fecfinal::date - fin.fin_fecha::date
                           ) < 30 
                           THEN
                             (per.per_fecfinal::date - fin.fin_fecha::date)
                       ELSE
                       30
                 END ,
                 0::numeric,
                 0::numeric,
                 0::bigint,
                 0::bigint,
                 (row_number() OVER () % :numeroprocesos),
                 CAST( 'P' AS character varying ),
                 CAST( ' - ' AS character varying ),
                 :idusuario::bigint,
                 :idempresa::bigint,
                 fin.fin_sdocapital,
                 :idacceso::bigint
                FROM
                  fin_financiacio fin INNER JOIN amfi_amofinanci amfi ON fin.fin_ideregistro=amfi.fin_ideregistro
                  INNER JOIN dsus_detsuscrip dsus ON fin.dsus_ideregistr=dsus.dsus_ideregistr
                  INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion=amfi.uni_liquidacion  
                  INNER JOIN per_periodo per ON per.cic_ideregistro=dsus.cic_ideregistro
                WHERE
                  fin.fin_estado = 'A' AND amfi.amfi_estado = 'A' 
                  AND per.per_estado='A' AND dsus.dsus_estado ='A'
                  AND dsus.cic_ideregistro = :idciclo
                  AND fin.emp_ideregistro = :idempresa 
                  AND fin.fin_sdocapital > 0 
                  AND (amfi.amfi_numcuotas - amfi.amfi_cuoamortiz) > 0
                  
and fin.fin_ideregistro not in (select finliq.fin_ideregistro from fin_financiacio finliq 
INNER JOIN amfi_amofinanci amfiliq on amfiliq.fin_ideregistro = finliq.fin_ideregistro
where amfiliq.uni_liquidacion in (3135,3127) and finliq.emp_ideregistro  = :idempresa 

)


union all
 SELECT
                 fin.fin_ideregistro,
                 fin.fin_version,
                 dsus.dsus_ideregistr ,
                 amfi.amfi_ideregistr ,
                 amfi.uni_liquidacion ,
                 liq.liq_tipcuota ,
                 amfi.amfi_numcuotas ,
                 amfi.amfi_cuoamortiz ,
                 amfi.uni_documento ,
                 amfi.uni_tipdocument ,
                 amfi.amfi_numcuotas - amfi.amfi_cuoamortiz,
                 CASE WHEN (
                              SELECT count(*) FROM fac_factura fac 
                              WHERE fac.dsus_ideregistr=fin.dsus_ideregistr 
                                 AND fac.fin_ideregistro=fin.fin_ideregistro 
                                 AND fac_estado NOT IN ('E','F')
                                 AND amfi.amfi_cuoamortiz=0 
                                 AND fac.uni_documento=amfi.uni_documento
                           )=0 
                           AND (per.per_fecfinal::date - fin.fin_fecha::date
                           ) < 30 
                           THEN
                             (per.per_fecfinal::date - fin.fin_fecha::date)
                       ELSE
                       30
                 END ,
                 0::numeric,
                 0::numeric,
                 0::bigint,
                 0::bigint,
                 (row_number() OVER () % :numeroprocesos),
                 CAST( 'P' AS character varying ),
                 CAST( ' - ' AS character varying ),
                 :idusuario::bigint,
                 :idempresa::bigint,
                 fin.fin_sdocapital,
                 :idacceso::bigint
                FROM
                  fin_financiacio fin INNER JOIN amfi_amofinanci amfi ON fin.fin_ideregistro=amfi.fin_ideregistro
                  INNER JOIN dsus_detsuscrip dsus ON fin.dsus_ideregistr=dsus.dsus_ideregistr
                  INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion=amfi.uni_liquidacion  
                  INNER JOIN per_periodo per ON per.cic_ideregistro=dsus.cic_ideregistro
                WHERE
                  fin.fin_estado = 'A' AND amfi.amfi_estado = 'A' 
                  AND per.per_estado='A' AND dsus.dsus_estado ='A'
                   AND dsus.cic_ideregistro = :idciclo
                  AND fin.emp_ideregistro = :idempresa  
                  AND fin.fin_sdocapital > 0 
                  AND (amfi.amfi_numcuotas - amfi.amfi_cuoamortiz) > 0
                  
and fin.fin_ideregistro  in (
	select finliq.fin_ideregistro from fin_financiacio finliq 
	INNER JOIN dsus_detsuscrip dsusliq on dsusliq.dsus_ideregistr = finliq.dsus_ideregistr
	INNER JOIN amfi_amofinanci amfiliq on amfiliq.fin_ideregistro = finliq.fin_ideregistro
	INNER JOIN per_periodo perliq on perliq.cic_ideregistro = dsusliq.cic_ideregistro and perliq.per_estado = 'A'
	where amfiliq.uni_liquidacion in (3135,3127) and finliq.emp_ideregistro  = :idempresa  
	and ( case when (perliq.per_fecfinal::date - fin_fecha::date) >= 85 then 1 else 0 end ) = 1
)
	)";
        $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta si hay facturas para financiar
     * @return type
     */
    public function consultarCantidadFacturas($idCiclo) {
        $parametros['idciclo'] = $idCiclo;
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idacceso'] = $this->sesion['idacceso'];
        $sql = "SELECT COUNT(ff.*) cantidadfacturas
                FROM facturar_financiacion ff
                WHERE ff.idempresa = :idempresa";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['cantidadfacturas'];
    }

    public function getFinanciacionesProceso($idProceso) {
        $parametros['idproceso'] = $idProceso;
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $sql = "select * from facturar_financiacion where proceso=:idproceso AND estado ='P' AND idempresa=:idempresa limit 500";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta los conceptos de una liquidación y una financiación.
     * @param int $idLiquidacion identificador de la liquidación
     * @param int $idFinanciacion identificador de la financiación.
     * @param string $base
     * @return array Listado de los conceptos
     */
    public function consultarConceptos($idLiquidacion, $idFinanciacion, $base = '') {
        $parametros['idliquidacion'] = $idLiquidacion;
        $parametros['idfinanciacion'] = $idFinanciacion;
        $sql = "
         select 
	  dfin.dfin_ideregistr iddetallefinanciacion,
	  dfin.dfin_vlrreal valorconcepto,
          dfin.emp_ideregistro idempresa,
          dfin.dfac_vlrtotal facturavalortotal,
          dfin.fac_ideregistro idfactura,
          dfin.dfac_ideregistr iddetallefactura,
          dfin.uni_concepto idconcepto,
          dfin.dfin_sdoreal saldoconcepto,
          dfin.dfin_sdoreal saldo
	 from dfin_detfinanci dfin 
	 where 
	  fin_ideregistro=:idfinanciacion and dfin_idepadre is null and  dfin.dfin_sdoreal > 0 and 
	  uni_concepto $base in
	  (
	   select uni_conrelacion 
	   from core_conrelacio core inner join coli_conliquida coli on core.uni_concepto=coli.uni_concepto
	   where coli.uni_liquidacion=:idliquidacion
	  )";
        return $this->executeQuery($sql, $parametros);
    }

    public function saldoConceptosBase($idLiquidacion, $idFinanciacion, $base = '') {
        $parametros['idliquidacion'] = $idLiquidacion;
        $parametros['idfinanciacion'] = $idFinanciacion;
        $sql = "
         select 
          COALESCE( sum(dfin.dfin_sdoreal),0) saldobase
	 from dfin_detfinanci dfin 
	 where 
	  fin_ideregistro=:idfinanciacion and dfin_idepadre is null and
	  uni_concepto $base in
	  (
	   select uni_conrelacion 
	   from core_conrelacio core inner join coli_conliquida coli on core.uni_concepto=coli.uni_concepto
	   where coli.uni_liquidacion=:idliquidacion
	  )";
        return $this->executeQuery($sql, $parametros)[0]['saldobase'];
    }

    public function insertarAmortizacion(array &$amortizacion) {
        $parametros = array();
        $this->setCampo($amortizacion, $parametros, 'estado', 'amo_estado');
        $this->setCampo($amortizacion, $parametros, 'fecha', 'amo_fecha');
        $this->setCampo($amortizacion, $parametros, 'idamortizacionfinanciacion', 'amfi_ideregistr');
        $this->setCampo($amortizacion, $parametros, 'cuotasamortizadas', 'amo_cuoamortiz');
        $this->setCampo($amortizacion, $parametros, 'idfinanciacion', 'fin_ideregistro');
        $this->setCampo($amortizacion, $parametros, 'idliquidacion', 'uni_liquidacion');
        $this->setCampo($amortizacion, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($amortizacion, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($amortizacion, $parametros, 'idciclo', 'cic_ideregistro');
        $this->setCampo($amortizacion, $parametros, 'idperiodo', 'per_ideregistro');
        $this->setCampo($amortizacion, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($amortizacion, $parametros, 'cicloanio', 'cic_ano');
        $this->setCampo($amortizacion, $parametros, 'idusuario', 'usu_ideregistro');
        $amortizacion['idamortizacion'] = $this->insertar($parametros, 'amo_amortizacio', 'sq_amo_ideregistro');
    }

    /**
     * Registra una nuevo detalle de  amortización 
     * @param array $detalleAmortizacion detalle de una amortización
     * @return bool TRUE correcto FALSE incorrecto
     */
    public function insertarDetalleAmortizacion($detalleAmortizacion) {
        $data['dfac_vlrtotal'] = $detalleAmortizacion['valortotal'];
        $data['damo_vlrreal'] = $detalleAmortizacion['valorreal'];
        $data['amo_ideregistro'] = $detalleAmortizacion['idamortizacion'];
        $data['dfin_ideregistr'] = $detalleAmortizacion['iddetallefinanciacion'];
        $data['dsus_ideregistr'] = $detalleAmortizacion['idsuscripcion'];
        $data['cic_ideregistro'] = $detalleAmortizacion['idciclo'];
        $data['per_ideregistro'] = $detalleAmortizacion['idperiodo'];
        $data['emp_ideregistro'] = $detalleAmortizacion['idempresa'];
        $data['fac_ideregistro'] = $detalleAmortizacion['idfactura'];
        $data['dfac_ideregistr'] = $detalleAmortizacion['iddetallefactura'];
        $data['uni_liquidacion'] = $detalleAmortizacion['idliquidacion'];
        $data['uni_concepto'] = $detalleAmortizacion['idconcepto'];
        $data['uni_documento'] = $detalleAmortizacion['iddocumento'];
        $data['uni_tipdocument'] = $detalleAmortizacion['idtipodocumento'];
        $data['cic_ano'] = $detalleAmortizacion['cicloanio'];
        $data['usu_ideregistro'] = $detalleAmortizacion['idusuario'];
        return $this->insertar($data, 'damo_detamortiz', 'sq_damo_ideregistr');
    }

    public function getValorFactura($idFactura, $idEmpresa=0) {
        $sql = "SELECT
                  SUM (dfac.dfac_vlrreal) valor
                FROM
                  dfac_detfactura dfac
                WHERE
                  dfac.fac_ideregistro = $idFactura and emp_ideregistro = $idEmpresa";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('Error al actualizar el saldo de la factura', -1);
        }
        return $resultado[0]['valor'];
    }

    public function actualizarRegistroProceso($idFinanciacion, $estado, $mensaje) {
        $parametros['idfinanciacion'] = $idFinanciacion;
        $parametros['mensaje'] = $mensaje;
        $parametros['estado'] = $estado;
        $this->actualizar($parametros, 'facturar_financiacion', 'idfinanciacion=:idfinanciacion');
    }

    public function getErrores() {
        try {
            $idEmpresa = $this->sesion['idempresa'];
            $sql = "SELECT
                      idsuscripcion,idliquidacion,liq.liq_nombre liquidacion,
                      mensaje
                    FROM
                      facturar_financiacion pf INNER JOIN liq_liquidacion liq ON pf.idliquidacion=liq.uni_liquidacion
                    WHERE estado IN ('F','N') AND idempresa=$idEmpresa ";
            return $this->executeQuery($sql);
        } catch (\Exception $e) {
            // throw new MyException('No existe la tabla facturar_facturacion', -1);
        }
    }

    public function getSatisfactorios() {
        try {
            $idEmpresa = $this->sesion['idempresa'];
            $sql = "SELECT
                      pro.proyecto_nom  municipio,
                      dsus.uni_tipusosuscr idtipouso,
                      uni.uni_nombre1 tipouso,
                      count(*) numerousuarios,
                      sum(fac.fac_vlrreal) valortotal
                    FROM
                      fac_factura fac INNER JOIN dsus_detsuscrip dsus ON fac.dsus_ideregistr=dsus.dsus_ideregistr
                      INNER JOIN uni_unidad uni ON uni.uni_ideregistro=dsus.uni_tipusosuscr
                      INNER JOIN proyectos pro ON pro.proyecto_ideregistro=dsus.uni_municipio
                      INNER JOIN empresas emp ON fac.emp_ideregistro=emp.empresa_sevemp
                    WHERE
                       fac.fac_estado = 'X' AND fac.emp_ideregistro=$idEmpresa AND pro.proyecto_codemp=emp.empresa_cod
                    GROUP BY 
                      pro.proyecto_nom,dsus.uni_tipusosuscr ,uni.uni_nombre1";
            return $this->executeQuery($sql);
        } catch (\Exception $e) {
            // throw new MyException('No existe la tabla proceso_facturacion', -1);
        }
    }

    public function consultarFacturasGeneradas() {
        $idEmpresa = $this->sesion['idempresa'];
        $sql = "select 
                   fac.emp_ideregistro idempresa, fac.uni_documento iddocumento,
                   fac.uni_tipdocument idtipodocumento, fac.fac_ideregistro idfactura
                from fac_factura fac where fac.fac_estado='X' AND fac.emp_ideregistro=$idEmpresa ";
        return $this->executeQuery($sql);
    }

    public function getFechaLiquidacion($idLiquidacion) {
        $sql = "select 
                cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq.liq_diasuspens,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as date) fechasuspension ,
                cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq.liq_diavencim,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as date) fechavencimiento
                from    liq_liquidacion liq
                where liq.uni_liquidacion=$idLiquidacion";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('Error al consultar la liquidación ' . $idLiquidacion, -1);
        }
        return $resultado[0];
    }

    public function validarFacturaCicloPeriodoActual(&$infoFactura, $cicloPeriodo) {
        $parametros['idsuscripcion'] = $infoFactura['idsuscripcion'];
        $parametros['iddocumento'] = $infoFactura['iddocumento'];
        $parametros['idtipodocumento'] = $infoFactura['idtipodocumento'];
        $parametros['idciclo'] = $cicloPeriodo['idciclo'];
        $parametros['cic_ano'] = $cicloPeriodo['cicloanio'];
        $parametros['idperiodo'] = $cicloPeriodo['idperiodo'];
        $parametros['idfinanciacion'] = $infoFactura['idfinanciacion'];
        $sql = "
              SELECT fac.fac_ideregistro idfactura
              FROM fac_factura fac 
              WHERE fac.dsus_ideregistr=:idsuscripcion and fac.uni_documento=:iddocumento 
                  and fac.uni_tipdocument=:idtipodocumento and fac.cic_ideregistro=:idciclo 
                  and fac.per_ideregistro=:idperiodo and fac.fin_ideregistro=:idfinanciacion
                  and fac.fac_estado <> 'E' and fac.fac_ideorigen IS NULL ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (!empty($resultado)) {
            throw new MyException('La suscripción ' . $infoFactura['idsuscripcion'] . ' ya fue liquidada para el ciclo-periodo ', -1);
        }
    }

    public function insertarHistoricoInteres($historicoInteres) {
        $infoHistorico['fac_ideregistro'] = $historicoInteres['idfactura'];
        $infoHistorico['uni_concepto'] = $historicoInteres['idconcepto'];
        $infoHistorico['htsi_tasinteres'] = $historicoInteres['tasainteres'];
        $infoHistorico['usu_ideregistro'] = $historicoInteres['idusuario'];
        $this->insertar($infoHistorico, 'htsi_htasinteres', NULL);
    }
    
    public function insertarControlEnvCorreo ($historicoInteres) {
        $infoHistorico['fac_ideregistro'] = $historicoInteres['idfactura'];
        $infoHistorico['uni_concepto'] = $historicoInteres['idconcepto'];
        $infoHistorico['htsi_tasinteres'] = $historicoInteres['tasainteres'];
        $infoHistorico['usu_ideregistro'] = $historicoInteres['idusuario'];
        $this->insertar($infoHistorico, 'htsi_htasinteres', NULL);
    }
    
    /*
     * 
     * Funcion que consulta los ciclos y periodos de las facturas que estan pendientes de aprobar,
     * con el fin de generar un registro en la tabla de control de envio de correo
     * de estado de cuenta de la financiación 
     * @return array
     *      
     */
    
    public function consultarCicloPeriodosFactGeneradas() {
        $idEmpresa = $this->sesion['idempresa'];
        $sql =    "select DISTINCT "
                . "   cic_ideregistro idciclo,	"
                . "   per_ideregistro idperiodo ,	"
                . "   emp_ideregistro idempresa "
                . "FROM  fac_factura fac "
                . "WHERE fac.fac_estado='X'"
                . " AND fac.emp_ideregistro=$idEmpresa";
        return $this->executeQuery($sql);
    }



}
