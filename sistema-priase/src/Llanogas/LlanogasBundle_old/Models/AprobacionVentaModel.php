<?php

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * Description of FinanciacionModel
 *
 * @author hrey
 */
class AprobacionVentaModel extends AuditoriaServices {

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

    public function getListaAgendas($idVenta, $idempresa) {
        $parametros['idventa'] = $idVenta;
        $parametros['idempresa'] = $idempresa;
        $sql = 'select distinct 
                age.agenda_cod codigoagenda, age.agenda_ideregistro idagenda,
                age.agenda_nom agenda
               from veli_venliquidac veli inner join liag_liqagenda liag on veli.uni_liquidacion=liag.uni_liquidacion
               inner join agendas age on age.agenda_ideregistro = liag.agenda_ideregistro
               INNER JOIN empresas emp on emp.empresa_sevemp = :idempresa and emp.empresa_cod = age.agenda_codemp
               where veli.ven_ideregistro=:idventa';
        return $this->executeQuery($sql, $parametros);
    }

    public function getBarrio($idBarrio) {
        $parametros['idbarrio'] = $idBarrio;
        $sql = 'select barrio_cod codigobarrio from barrios  bar where bar.barrio_ideregistro=:idbarrio';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró el código del barrio ' . $idBarrio, -1);
        }
        return $resultado[0];
    }

    public function getCodigoServicio($codigoAgenda, $idSuscripcion, $idEmpresa) {
        $parametros['codigoagenda'] = $codigoAgenda;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idempresa'] = $idEmpresa;
        $sql = " select serage.serage_codser codigoservicio
              from agendas age
                INNER JOIN servicios_agenda serage on age.agenda_cod=serage.serage_codage
                INNER JOIN proyectos pry on pry.proyecto_cod=serage.serage_codpro
                INNER JOIN dsus_detsuscrip dsus on dsus.uni_municipio = pry.proyecto_ideregistro
                INNER JOIN empresas emp on emp.empresa_cod=serage.serage_codemp
              where age.agenda_cod=:codigoagenda
                and serage.serage_nivser=3
                and serage.serage_ordser=1
                and emp.empresa_sevemp=:idempresa
                AND dsus.dsus_ideregistr =:idsuscripcion ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró la agenda', -1);
        }
        return $resultado[0]['codigoservicio'];
    }

    public function getCodigoEmpresa($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = 'select empresa_cod codigoempresa from empresas where empresa_sevemp=:idempresa';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se entontró el código de la empresa ' . $idEmpresa, -1);
        }
        return $resultado[0]['codigoempresa'];
    }
    public function getDetalleSolicitante($idVenta) {
        $parametros['idventa'] = $idVenta;
        $sql = 'select ter.ter_nomcompleto nombrecompleto, ter.ter_telcelular celular, ter.ter_telfijo telfijo, ter.ter_correo correo	  , ter.ter_documento documento 
                    FROM 	vfi_venfinanciacio vfi 
                    INNER JOIN  ter_tercero ter ON ter.ter_ideregistro = vfi.ter_idesolicita
                    WHERE 	vfi.ven_ideregistro =:idventa';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se entontró informacion del solicitante ' . $idVenta, -1);
        }
        return $resultado[0];
    }

    public function getCodigoUsuario($idUsuario) {
        $parametros['idusuario'] = $idUsuario;
        $sql = 'select  usuario_nit codigousuario from usuarios where usu_ideregistro=:idusuario';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró el código del usuario', -1);
        }
        return $resultado[0]['codigousuario'];
    }

    public function getTipoinscripcion($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "select un.uni_nombre2 tiposuscripcion from dsus_detsuscrip dsus
                    inner join uni_unidad un on un.uni_ideregistro = dsus.uni_tipusosuscr 
                where dsus.dsus_ideregistr=:idsuscripcion ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return;
        }
        return $resultado[0]['tiposuscripcion'];
    }

    public function actualizarVenta($venta) {
        $parametros = array();
        $this->setCampo($venta, $parametros, 'fechaeliminacion', 'ven_feceliminada');
        $this->setCampo($venta, $parametros, 'fechaaprobacion', 'ven_fecaprobada');
        $this->setCampo($venta, $parametros, 'idventa', 'ven_ideregistro');
        $this->setCampo($venta, $parametros, 'estado', 'ven_estado');
        $this->setCampo($venta, $parametros, 'observacion', 'ven_observacion');
        $this->setCampo($venta, $parametros, 'idagenda', 'agenda_ideregistro');
        $this->setCampo($venta, $parametros, 'idfactura', 'fac_ideregistro');
        $this->setCampo($venta, $parametros, 'fechafacturada', 'ven_fecfacturada');
        $this->actualizar($parametros, 'ven_venta', 'ven_ideregistro=:ven_ideregistro');
    }

    public function getAliasAgenda($codigoAgenda) {
        $parametros['codigoagenda'] = $codigoAgenda;
        $sql = 'select substr(agenda_alias, 2 ,2) codigoalias ,agenda_cod codigoagenda from agendas where agenda_ideregistro=:codigoagenda';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró el alias de la agenda', -1);
        }
        return $resultado[0];
    }

    /**
     * Graba la factura de una venta según información enviada
     * @param object $informacion Información de la factura que se grabará
     */
    public function insertarFacturaVenta($informacion) {
        $parametros = array();
        $this->setCampo($informacion, $parametros, 'fecha', 'fac_fecha');
        $this->setCampo($informacion, $parametros, 'cicloanio', 'cic_ano');
        $this->setCampo($informacion, $parametros, 'estado', 'fac_estado');
        $this->setCampo($informacion, $parametros, 'valorreal', 'fac_vlrreal');
        $this->setCampo($informacion, $parametros, 'idciclo', 'cic_ideregistro');
        $this->setCampo($informacion, $parametros, 'saldofactura', 'fac_sdoreal');
        $this->setCampo($informacion, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($informacion, $parametros, 'idtercero', 'ter_ideregistro');
        $this->setCampo($informacion, $parametros, 'idperiodo', 'per_ideregistro');
        $this->setCampo($informacion, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($informacion, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($informacion, $parametros, 'metodogenera', 'fac_metgenera');
        $this->setCampo($informacion, $parametros, 'versionfactura', 'fac_version');
        $this->setCampo($informacion, $parametros, 'tipotercero', 'uni_tiptercero');
        $this->setCampo($informacion, $parametros, 'idsuscriptor', 'sus_ideregistro');
        $this->setCampo($informacion, $parametros, 'fechavencimiento', 'fac_fecvence');
        $this->setCampo($informacion, $parametros, 'fechasuspension', 'fac_fecsuspens');
        $this->setCampo($informacion, $parametros, 'idsuscripcion', 'dsus_ideregistr');
        $this->setCampo($informacion, $parametros, 'idliquidacion', 'uni_liquidacion');
        $this->setCampo($informacion, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($informacion, $parametros, 'fechaaprobacion', 'fac_fecaprobada');
        $this->setCampo($informacion, $parametros, 'idtiposuscripcion', 'uni_tipsuscripc');
        $this->setCampo($informacion, $parametros, 'fechafinanciacion', 'fac_fecfinancia');
        $this->setCampo($informacion, $parametros, 'idtipousosuscripcion', 'uni_tipusosuscr');
        $this->setCampo($informacion, $parametros, 'idhistoricoliquidacion', 'hliq_ideregistr');

        return $this->insertar($parametros, 'fac_factura', 'sq_fac_ideregistro');
    }

    public function insertarDetalleFactura($informacion) {
        $parametros = array();

        $this->setCampo($informacion, $parametros, 'saldo', 'dfac_sdoreal');
        $this->setCampo($informacion, $parametros, 'estado', 'dfac_estado');
        $this->setCampo($informacion, $parametros, 'version', 'dfac_version');
        $this->setCampo($informacion, $parametros, 'cantidad', 'dfac_cantidad');
        $this->setCampo($informacion, $parametros, 'valorreal', 'dfac_vlrreal');
        $this->setCampo($informacion, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($informacion, $parametros, 'valortotal', 'dfac_vlrtotal');
        $this->setCampo($informacion, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($informacion, $parametros, 'idfactura', 'fac_ideregistro');
        $this->setCampo($informacion, $parametros, 'valorunitario', 'dfac_vlrunitari');
        $this->insertar($parametros, 'dfac_detfactura', 'sq_dfac_ideregistr');
    }

    public function crearDetalleFacturaVenta(array $parametros) {
        $sql = "INSERT INTO dfac_detfactura (
                 select nextval('sq_dfac_ideregistr') iddetalleventa, 
                'A' estado, null iddetallefacturaorigen, dven.dven_cantidad cantidad,
                 dven.dven_vlrunitario valorunitario,dven.dven_vlrtotal valortotal
                ,dven.dven_vlrreal valorreal,
                0 saldo,:idfactura idfactura, dven.uni_concepto idconcepto,null iddetalleamortizacion,null idfacturapadre,null iddetallefinaciacion
                ,1 as version,NULL idsuscripcionconstructora,:idusuario idusuario,null,ven.emp_ideregistro
                from dven_detventa dven
                 inner join ven_venta ven on ven.ven_ideregistro = dven.ven_ideregistro
                where ven.ven_ideregistro= :idventa)";
        $this->executeQuery($sql, $parametros);
    }

    public function getSecuenciaFinanciacion() {
        $sql = "select nextval('sq_fin_ideregistro') idfinanciacion";
        return $this->executeQuery($sql)[0]['idfinanciacion'];
    }

    public function getInformacionLiquidacion($idliquidacion) {
        $parametros['idliquidacion'] = $idliquidacion;
        $sql = "SELECT
                        liq.uni_liquidacion idliquidacion,
                        liq.liq_nombre liquidacion,
                        liq.liq_diavencim diavencimiento

                FROM
                        liq_liquidacion liq
                WHERE
                        liq.uni_liquidacion =:idliquidacion";
        return $this->executeQuery($sql, $parametros)[0];
    }

    public function getConceptosNoFinanciadosVenta($idventa) {
        $parametros['idventa'] = $idventa;
        $sql = "SELECT
                        dven.uni_concepto idconcepto,
                        dven.dven_cantidad cantidad,
                        dven.dven_vlrunitario valorunitario,
                        dven.dven_vlrtotal valortotal,
                        dven.dven_vlrreal valorreal, (
                                SELECT
                                        veli.uni_liquidacion
                                FROM
                                        veli_venliquidac veli
                                WHERE
                                        dven.ven_ideregistro = veli.ven_ideregistro
                                LIMIT 1
                        ) idliquidacion
                FROM
                        dven_detventa dven
                INNER JOIN con_concepto con ON dven.uni_concepto = con.uni_concepto
                WHERE
                        dven.uni_concepto NOT IN (
                                SELECT
                                        dvfi.uni_concepto
                                FROM
                                        dvfi_detvenfinancia dvfi
                                WHERE
                                        dvfi.ven_ideregistro =:idventa
                        )
                AND dven.ven_ideregistro =:idventa and dven.dven_vlrreal>0";
        return $this->executeQuery($sql, $parametros);
    }

    public function getConceptosVenta($idventa) {
        $parametros['idventa'] = $idventa;
        $sql = "SELECT
                        dven.uni_concepto idconcepto,
                        dven.dven_cantidad cantidad,
                        dven.dven_vlrunitario valorunitario,
                        dven.dven_vlrtotal valortotal,
                        dven.dven_vlrreal valorreal, (
                                SELECT
                                        veli.uni_liquidacion
                                FROM
                                        veli_venliquidac veli
                                WHERE
                                        dven.ven_ideregistro = veli.ven_ideregistro
                                LIMIT 1
                        ) idliquidacion
                FROM
                        dven_detventa dven
                INNER JOIN con_concepto con ON dven.uni_concepto = con.uni_concepto
                WHERE
                         dven.ven_ideregistro =:idventa";
        return $this->executeQuery($sql, $parametros);
    }

    public function getIdLiquidacionPorTipoDocumento($idventa, $idliquidacion, $idempresa) {
        $parametros = array();
        $parametros['idventa'] = $idventa;
        $parametros['idempresa'] = $idempresa;
        $parametros['idliquidacion'] = $idliquidacion;
        $sql = "SELECT DISTINCT
                        liq.uni_liquidacion idliquidacion
                FROM
                        dven_detventa dven
                INNER JOIN liq_liquidacion liq ON dven.uni_liquidacion = liq.uni_liquidacion
                WHERE
                        liq.uni_tipdocument = (
                                SELECT
                                        liq1.uni_tipdocument
                                FROM
                                        liq_liquidacion liq1
                                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = liq1.est_liquidacion
                                WHERE
                                        liq1.uni_liquidacion =:idliquidacion
                                AND esem.emp_ideregistro =:idempresa
                        )
                AND ven_ideregistro =:idventa";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $idliquidacion;
        }
        return $resultado[0]['idliquidacion'];
    }

    /**
     * Se almacenan los ficheros comom adjuntos en la financiación 
     * @param array $infoSoporte
     * @return array información del archivo adjuntoi
     */
    public function insertarAdjuntoFinanciacion($infoSoporte) {
        $parametros = array();
        $this->setCampo($infoSoporte, $parametros, 'ruta', 'adfi_ruta');
        $this->setCampo($infoSoporte, $parametros, 'tipo', 'adfi_tiparchivo');
        $this->setCampo($infoSoporte, $parametros, 'nombrearchivo', 'adfi_nomarchivo');
        $this->setCampo($infoSoporte, $parametros, 'idfinanciacion', 'fin_ideregistro');
        $idAdjuntoConsignacion = $this->insertar($parametros, 'adfi_adjfinanciacio', 'sq_adfi_ideregistr');
        $infoSoporte['idarchivo'] = $idAdjuntoConsignacion;
        return $infoSoporte;
    }

    public function consultarClientePorCodigoAnterior($codigoAnterior) {
        $parametros['codigoanteriorempresa'] = $codigoAnterior;
        $sql = "SELECT
                        cl.cliente_codsus,
                        cl.cliente_tipins,
                        cl.cliente_estsus,
                        cl.cliente_codage,
                        cl.cliente_codemp,
                        cl.cliente_usugra,
                        cl.cliente_llacom
                FROM
                        clientes cl
                WHERE
                        cl.cliente_llacom =:codigoanteriorempresa";

        $cliente = $this->executeQuery($sql, $parametros);
        if (empty($cliente)) {
            return [];
        }
        return $cliente[0];
    }

    public function consultaHistoricoVentaModelo($idVenta) {
        $parametros['idventa'] = $idVenta;
        $sql = 'select count(*) cantidad from hven_hisventa WHERE ven_ideregistro = :idventa ';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se entontró Historico de venta ', -1);
        }
        return $resultado[0]['cantidad'];
    }
    
     public function getConceptoCertificacion($idVenta) {
        $parametros['idventa'] = $idVenta;
        $sql = 'SELECT  count(*) cantidad
                FROM    dven_detventa dven
                INNER JOIN con_concepto con ON dven.uni_concepto = con.uni_concepto
                WHERE    dven.ven_ideregistro =:idventa and con.uni_concepto = 1963 ';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se entontró Concepto de Certificacion', -1);
        }
        return $resultado[0]['cantidad'];
    }
    
     public function getDocumentoColaborador($idUsuario) {
        $parametros['idusuario'] = $idUsuario;
        $sql = 'SELECT usuario_nit usuarionit from usuarios where usu_ideregistro = :idusuario ';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se entontró Colaborador', -1);
        }
        return $resultado[0];
    }

    public function actualizarAgendaActividad($parametros) {
        try {
            $data['sigue_codage'] = $parametros['sigue_codage'];
            $data['sigue_codsus'] = $parametros['sigue_codsus'];
            $data['sigue_codemp'] = $parametros['sigue_codemp'];
            $condicion = " sigue_codsus =':sigue_codsus' and sigue_codemp =  ':sigue_codemp' ";
            $this->actualizar($parametros, 'sigueactividad_nuevas', $condicion);
        } catch (\Exception $ex) {
            throw new MyException('Error Actualizando Agenda en Actividades' . $ex->getMessage(), -1);
        }
    }

    public function insertarReclamo($parametros, $secuencia) {        
        if (empty($secuencia)) {
            throw new MyException('Error, No hay secuencia para la empresa seleccionada', -1);
        }

        $idSecuencia = $this->getSecuencia($secuencia);
        $parametros['reclamo_numpqr'] = $idSecuencia[0]['idsecuencia'];
        $parametros['reclamo_llacom'] = $idSecuencia[0]['idsecuencia'] . $parametros['reclamo_codemp'];

        try {
            $sql = $this->construyeSQL('INSERT', 'reclamos', $parametros);
           
            $this->setSql($sql);
            $this->setParams($parametros);
            $this->executeUpdate();
            if ($this->getnumFilas() == 0) {
                throw new MyException('Error al insertar el Reclamo');
            }
            
            return $parametros['reclamo_numpqr'];
        } catch (\Exception $ex) {
            throw new MyException('Error, Insertando el Reclamo' . $ex->getMessage(), -1);
        }
    }
    public function insertarVisitaDau($parametros) {
        try {
            $sql = $this->construyeSQL('INSERT', 'visitas_dau', $parametros);
            $this->setSql($sql);
            $this->setParams($parametros);
            $this->executeUpdate();
            if ($this->getnumFilas() == 0) {
                throw new MyException('Error al insertar el visitas Dau');
            }
            
        } catch (\Exception $ex) {
            throw new MyException('Error, Insertando la visita Dau' . $ex->getMessage(), -1);
        }
    }
    public function insertarDau($parametros) {
        try {
            $sql = $this->construyeSQL('INSERT', 'dau', $parametros);
            $this->setSql($sql);
            $this->setParams($parametros);
            $this->executeUpdate();
            if ($this->getnumFilas() == 0) {
                throw new MyException('Error al insertar el Dau');
            }
            
        } catch (\Exception $ex) {
            throw new MyException('Error, Insertando la Dau' . $ex->getMessage(), -1);
        }
    }

    public function getSecuencia($secuencia) {
        try {
            $query = "select nextval('" . $secuencia . "') idsecuencia";
            return $this->executeQuery($query) ;
        } catch (\Exception $ex) {
            throw new MyException('Error, no se pudo obtener la secuencia' . $ex->getMessage(), -1);
        }
    }
    public function getFechaHabil($secuencia) {
        try {
            $query = "select * from fn_diahabilporhora(16,1)";
            return $this->executeQuery($query) ;
        } catch (\Exception $ex) {
            throw new MyException('Error, no se pudo obtener la secuencia' . $ex->getMessage(), -1);
        }
    }
    
    public function getFirmaInstaladora($idFirma) {
        try {
            $query = "select ter.ter_documento documentofirma from cofi_comfirmains cofi 
                    INNER JOIN  ter_tercero ter ON ter.ter_ideregistro = cofi.ter_ideregistro
                    WHERE cofi_ideregistr = $idFirma";
            return $this->executeQuery($query) ;
        } catch (\Exception $ex) {
            throw new MyException('Error, no se pudo obtener la secuencia' . $ex->getMessage(), -1);
        }
    }
    
    public function actualizaOrdenServicio($parametros){
        try {
            $data['facturausu_est'] = $parametros['facturausu_est'];
            $data['facturausu_fecact'] = $parametros['facturausu_fecact'];
            $data['facturausu_usuact'] = $parametros['facturausu_usuact'];
            $condicion = " facturausu_numven = :facturausu_numven" ;
            $this->actualizarSinUsuario($parametros, 'facturas_usu ', $condicion);
        } catch (\Exception $ex) {
            throw new MyException('Error Actualizando la factura del usuario Tecsoft' . $ex->getMessage(), -1);
        }
    }
    
     public function getRadicadoCliente($idVenta, $idEmpresa) {
         $parametros['idventa'] = $idVenta;
         $parametros['idempresa'] = $idEmpresa;
        try {
            $query = "select * from  ven_venta ven 
                        INNER JOIN facturas_usu facusu  ON ven.ven_ideregistro = facusu.facturausu_numven
                        INNER JOIN  reclamos recl ON recl.reclamo_numpqr = facusu.facturausu_numpqr
                        WHERE ven.emp_ideregistro = :idempresa  and ven.ven_ideregistro = :idventa ";
            return $this->executeQuery($query, $parametros) ;
        } catch (\Exception $ex) {
            throw new MyException('Error, no se identifico radicado del usuario... ' . $ex->getMessage(), -1);
        }
    }
    
    public function getConceptosVentaCompraCartera($idventa) {
        $parametros['idventa'] = $idventa;
        $sql = "SELECT  con.con_nombre concepto,
                        dven.uni_concepto idconcepto,
                        dven.dven_cantidad cantidad,
                        dven.dven_vlrunitario valorunitario,
                        dven.dven_vlrtotal valortotal,
                        dven.dven_vlrreal valorreal, 
                        0 valorfinanciar, 
                        0 valorcuotaincial
                FROM
                        dven_detventa dven
                INNER JOIN con_concepto con ON dven.uni_concepto = con.uni_concepto
								
                WHERE
                         dven.ven_ideregistro =:idventa
                        and dven.uni_concepto not in (SELECT uni_concepto FROM dvfi_detvenfinancia where ven_ideregistro =:idventa)";
        return $this->executeQuery($sql, $parametros);
    }

}
