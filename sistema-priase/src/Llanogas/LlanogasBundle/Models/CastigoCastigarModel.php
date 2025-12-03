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
 * Description of RecuperacionProvisionModel
 *
 * @author hrey
 */
class CastigoCastigarModel extends AuditoriaServices {

    /**
     *
     * @var array información de la sesión 
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
     */
    public function __construct(&$conexion, array $sesion) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
        $this->genericoModel = new GenericoModel($conexion);
    }

    public function eliminarSuscripcion($idSuscripcion) {
        $datos['dsus_ideregistr'] = $idSuscripcion;
        $datos['dsus_estado'] = 'E';
        return $this->actualizar($datos, 'dsus_detsuscrip', 'dsus_ideregistr=:dsus_ideregistr');
    }

    public function eliminarFacturas($idSuscripcion) {
        $datos['dsus_ideregistr'] = $idSuscripcion;
        $datos['fac_estado'] = 'C';
        $datos['fac_feccastigad'] = 'now()';
        return $this->actualizar($datos, 'fac_factura', "dsus_ideregistr=:dsus_ideregistr AND fac_estado='A' AND fac_sdoreal>0");
    }

    public function getFacturasCastigarNormal($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $complemento = "WHERE 
                        fac.dsus_ideregistr=:idsuscripcion
                        AND fac.fac_idepadre IS NULL 
                        AND fac.fac_estado='A' 
                        AND fac.fin_ideregistro IS NULL 
                        AND fac.fac_sdoreal>0 ";
        $resultado = $this->genericoModel->getFacturasInformacion($complemento, $parametros);
        if (empty($resultado)) {
            throw new MyException('No hay facturas para castigar', -1);
        }
        return $resultado;
    }

    public function getDetallesCastigarNormal($idFacturaOriginal, $idSuscripcion) {
        $parametros['idfactura'] = $idFacturaOriginal;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT 
                dfaco.dfac_ideregistr iddetalleoriginal,
                dfaco.uni_concepto  idconceptooriginal,
                dfaco.dfac_sdoreal saldodetalleoriginal,
                COALESCE( 
                        (    
                             SELECT SUM(dfacr.dfac_vlrreal)
                             FROM
                              dfac_detfactura dfacp 
                              INNER JOIN dfac_detfactura dfacr ON dfacr.dfac_idepadre=dfacp.dfac_ideregistr
                              INNER JOIN fac_factura facr ON dfacr.fac_ideregistro=facr.fac_ideregistro
                              INNER JOIN doc_documento docr ON facr.uni_documento=docr.uni_documento 
                             WHERE
                               docr.doc_tipo='RC' AND dfacp.dfac_ideorigen=dfaco.dfac_ideregistr
                               AND facr.dsus_ideregistr=:idsuscripcion
                        )
                   ,0) valorreclasificacion
               FROM dfac_detfactura dfaco inner join con_concepto con on dfaco.uni_concepto=con.uni_concepto
               WHERE
                    con.con_operacion='S' AND dfaco.fac_ideregistro=:idfactura  ";

        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error la factura no tiene detalles', -1);
        }
        return $resultado;
    }

    public function getFinanciacionCastigar($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "select  fac.fin_ideregistro idfinanciacion,
                    fin.fin_sdocapital saldofinanciacion,
                    fin.fin_version as version,
                    count(*) cantidadfacturas
                from 
                    fac_factura fac inner join fin_financiacio fin on fac.fin_ideregistro=fin.fin_ideregistro
                where fac.fac_estado='A' 
                      AND fac.fac_idepadre IS NULL 
                      AND fac.fac_sdoreal > 0 
                      AND fac.fin_ideregistro IS NOT NULL
                      AND fac.dsus_ideregistr=:idsuscripcion
                group by fac.fin_ideregistro,fin.fin_sdocapital,fin.fin_version
								
UNION ALL
				
	select  fin.fin_ideregistro idfinanciacion,
                    fin.fin_sdocapital saldofinanciacion,
                    fin.fin_version as version,
                    999999999 cantidadfacturas
                from 
                    fin_financiacio fin 
                    INNER JOIN amfi_amofinanci amfi on amfi.fin_ideregistro = fin.fin_ideregistro
                where amfi.amfi_estado='A' AND fin.fin_estado = 'A'
                    AND fin.fin_sdocapital > 0 
                    AND fin.fin_idepadre IS  NULL
                    AND fin.dsus_ideregistr=:idsuscripcion
										AND (
												CASE
													WHEN (select count(*) FROM fac_factura facfin where facfin.fin_ideregistro =  fin.fin_ideregistro  
													AND facfin.fac_estado='A' 
                      AND facfin.fac_idepadre IS NULL 
                      AND facfin.fac_sdoreal > 0 
                      AND facfin.fin_ideregistro IS NOT NULL) > 0 THEN 1 ELSE 0
												END
										) = 0
                group by fin.fin_ideregistro,fin.fin_sdocapital,fin.fin_version;";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function getInfoAmotizacionFinanciacion($idFinanciacion) {
        $sql = "
            SELECT  
              amfi.uni_liquidacion idliquidacion,
              amfi.uni_documento iddocumento,
              amfi.uni_tipdocument idtipodocumento,
              amfi.amfi_ideregistr idamotizacionfinanciacion,
              amfi.amfi_cuoamortiz cuotaamortizacion,
              amfi.dsus_ideregistr idsuscripcion
            FROM amfi_amofinanci amfi 
            WHERE amfi.amfi_estado='A' AND amfi.fin_ideregistro=$idFinanciacion ";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('Error la financiación no tiene amortización', -1);
        }
        return $resultado[0];
    }

    public function insertarAmoritzacion($infoAmortizacion, $cicloPeriodo, $financiacion) {
        $data['amo_estado'] = 'A';
        $data['amo_fecha'] = 'now()';
        $data['amfi_ideregistr'] = $infoAmortizacion['idamotizacionfinanciacion'];
        $data['amo_cuoamortiz'] = $infoAmortizacion['cuotaamortizacion'] + 1;
        $data['fin_ideregistro'] = $financiacion['idfinanciacion'];
        $data['uni_liquidacion'] = $infoAmortizacion['idliquidacion'];
        $data['uni_documento'] = $infoAmortizacion['iddocumento'];
        $data['uni_tipdocument'] = $infoAmortizacion['idtipodocumento'];
        $data['cic_ideregistro'] = $cicloPeriodo['idciclo'];
        $data['per_ideregistro'] = $cicloPeriodo['idperiodo'];
        $data['emp_ideregistro'] = $this->sesion['idempresa'];
        $data['cic_ano'] = $cicloPeriodo['cicloanio'];
        $data['usu_ideregistro'] = $this->sesion['idusuario'];
        $infoAmortizacion['estado'] = 'A';
        $infoAmortizacion['fecha'] = 'now()';
        $infoAmortizacion['idamortizacionfinanciacion'] = $infoAmortizacion['idamotizacionfinanciacion'];
        $infoAmortizacion['cuotasamortizadas'] = $infoAmortizacion['cuotaamortizacion'] + 1;
        $infoAmortizacion['idfinanciacion'] = $financiacion['idfinanciacion'];
        $infoAmortizacion['idliquidacion'] = $infoAmortizacion['idliquidacion'];
        $infoAmortizacion['iddocumento'] = $infoAmortizacion['iddocumento'];
        $infoAmortizacion['idtipodocumento'] = $infoAmortizacion['idtipodocumento'];
        $infoAmortizacion['idciclo'] = $cicloPeriodo['idciclo'];
        $infoAmortizacion['idperiodo'] = $cicloPeriodo['idperiodo'];
        $infoAmortizacion['idempresa'] = $this->sesion['idempresa'];
        $infoAmortizacion['cicloanio'] = $cicloPeriodo['cicloanio'];
        $infoAmortizacion['idusuario'] = $this->sesion['idusuario'];
        $infoAmortizacion['idamortizacion'] = $this->insertar($data, 'amo_amortizacio', 'sq_amo_ideregistro');
        return $infoAmortizacion;
    }

    public function insertarDetalleAmortizacion(&$detalleAmortizacion) {
        $parametros['dfac_vlrtotal'] = $detalleAmortizacion['valordetallefactura'];
        $parametros['damo_vlrreal'] = $detalleAmortizacion['valorconcepto'];
        $parametros['amo_ideregistro'] = $detalleAmortizacion['idamortizacion'];
        $parametros['dfin_ideregistr'] = $detalleAmortizacion['iddetallefinanciacion'];
        $parametros['dsus_ideregistr'] = $detalleAmortizacion['idsuscripcion'];
        $parametros['cic_ideregistro'] = $detalleAmortizacion['idciclo'];
        $parametros['per_ideregistro'] = $detalleAmortizacion['idperiodo'];
        $parametros['emp_ideregistro'] = $detalleAmortizacion['idempresa'];
        $parametros['fac_ideregistro'] = $detalleAmortizacion['idfactura'];
        $parametros['dfac_ideregistr'] = $detalleAmortizacion['iddetallefactura'];
        $parametros['uni_liquidacion'] = $detalleAmortizacion['idliquidacion'];
        $parametros['uni_concepto'] = $detalleAmortizacion['idconcepto'];
        $parametros['uni_documento'] = $detalleAmortizacion['iddocumento'];
        $parametros['uni_tipdocument'] = $detalleAmortizacion['idtipodocumento'];
        $parametros['cic_ano'] = $detalleAmortizacion['cicloanio'];
        $parametros['usu_ideregistro'] = $detalleAmortizacion['idusuario'];
        $parametros['idamortizacion'] = $this->insertar($parametros, 'damo_detamortiz', 'sq_damo_ideregistr');
    }

    public function getDetallesFinanciacion($idFinanciacion) {
        $sql = "SELECT 
                   dfin.dfin_ideregistr iddetallefinanciacion,
                   dfin.dfac_ideregistr iddetallefactura,
                   dfin.uni_concepto idconcepto,
                   dfin.dfac_vlrtotal valordetallefactura,
                   dfin.dfin_sdoreal saldoconcepto,
                   dfin.fac_ideregistro idfactura
                FROM dfin_detfinanci dfin
                WHERE fin_ideregistro=$idFinanciacion AND dfin.dfin_sdoreal >0 ";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('Error la financiacion no tiene detalles', -1);
        }
        return $resultado;
    }

    public function valorReclasificacionFinanciacion($idFinanciacion, $idsuscripcion) {
        $sql = "select coalesce(sum(fac.fac_vlrreal),0) valorreclasificado 
                from fac_factura fac inner join doc_documento doc on fac.uni_documento=doc.uni_documento
                where  fac.dsus_ideregistr=$idsuscripcion  AND doc.doc_tipo='RC' AND fac.fac_estado <> 'E' AND fac.fin_ideregistro=$idFinanciacion ";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('Error consultando el valor de reclasificación', -1);
        }
        return $resultado[0]['valorreclasificado'];
    }

    public function valorSaldoFinanciacion($idFinanciacion, $idSuscripcion) {
        $sql = "select coalesce(sum(fac.fac_sdoreal),0) saldofinanciacion 
                from fac_factura fac
                where  fac.dsus_ideregistr=$idSuscripcion  AND fac.fac_idepadre IS NULL
                        AND fac.fac_estado <> 'E' 
                        AND fac.fin_ideregistro=$idFinanciacion ";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('Error consultando el valor de reclasificación', -1);
        }
        return $resultado[0]['saldofinanciacion'];
    }

    public function getFacturasFinanciacion($idFinanciacion, $idSuscripcion) {
        $complemento = "WHERE fac.fin_ideregistro=$idFinanciacion AND fac.dsus_ideregistr=$idSuscripcion AND fac.fac_sdoreal>0 AND fac.fac_idepadre IS NULL AND fac.fac_estado <> 'E'";
        $resultado = $this->genericoModel->getFacturasInformacion($complemento);
        if (empty($resultado)) {
            throw new MyException('Error la financiación no tiene facturas', -1);
        }
        return $resultado;
    }

    public function eliminarFinanciacion($idFinanciacion) {
        $data['fin_ideregistro'] = $idFinanciacion;
        $data['fin_estado'] = 'C';
        $this->actualizar($data, 'fin_financiacio', 'fin_ideregistro=:fin_ideregistro');
        $data = array();
        $data['fin_ideregistro'] = $idFinanciacion;
        $data['amfi_estado'] = 'C';
        $this->actualizar($data, 'amfi_amofinanci', "fin_ideregistro=:fin_ideregistro AND amfi_estado='A' ");
    }

    public function crearTablaLog($idEmpresa) {
        $sql = "DROP TABLE IF EXISTS tmp_log_carteracastigada_$idEmpresa;";
        $this->executeQuery($sql);
        $sqlTabla = "CREATE TABLE tmp_log_carteracastigada_$idEmpresa (
                        idsuscripcion BIGINT NOT NULL,
                        idfactura BIGINT,
                        idfinanciacion BIGINT,
                        programa CHARACTER VARYING(100),
                        estado CHARACTER(1) NOT NULL,
                        descripcion TEXT,
                        usu_ideregistro INTEGER,
                        fecha timestamp default now()
                    )";
        $this->executeQuery($sqlTabla);
    }

    public function insertarLog(array $infoLog, $idEmpresa) {
        $tabla = "tmp_log_carteracastigada_$idEmpresa";
        return $this->insertar($infoLog, $tabla, NULL);
    }
    
     public function actualizaClienteTecsoft($idSuscripcion) {
        $data['cliente_codsus'] = $idSuscripcion['codigoanterior'];
        $data['cliente_codemp'] = $idSuscripcion['nit'];
        $data['cliente_est'] = "Anulado";
        $data['cliente_estfac'] = " Anulado proceso Castigo ".$idSuscripcion['fechasistema']."";
        $this->actualizarSinUsuario($data, 'Clientes', 'cliente_codsus =:cliente_codsus  and cliente_codemp =:cliente_codemp ');
        $data = array();
        $data['quinquenio_codsus'] =$idSuscripcion['codigoanterior'];
        $data['quinquenio_codemp'] = $idSuscripcion['nit'];
        $data['quinquenio_est'] = "Anulado";
        $this->actualizarSinUsuario($data, 'quinquenios', "quinquenio_codsus=:quinquenio_codsus AND quinquenio_codemp=:quinquenio_codemp ");
        $data = array();
        $data['venta_codsus'] =$idSuscripcion['codigoanterior'];
        $data['venta_codemp'] = $idSuscripcion['nit'];
        $data['venta_est']= "Anulado" ;
        $this->actualizarSinUsuario($data, 'ventas', "venta_codsus=:venta_codsus AND venta_codemp=:venta_codemp ");
        $data = array();
        $data['sigue_codsus'] =$idSuscripcion['codigoanterior'];
        $data['sigue_codemp'] = $idSuscripcion['nit'];
        $data['sigue_swteje'] = "true";
        $this->actualizarSinUsuario($data, 'sigueactividad_nuevas', "sigue_swteje=false and sigue_codsus =:sigue_codsus and sigue_codemp =:sigue_codemp ");
    }

}
