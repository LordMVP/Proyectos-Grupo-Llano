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
class FinanciarVentaModel extends AuditoriaServices {

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

    function insertarVentaFinanciacion($financiacion) {
        $financiacion['fecha'] = 'now()';
        $parametros = array();
        $this->setCampo($financiacion, $parametros, 'idventa', 'ven_ideregistro');
        $this->setCampo($financiacion, $parametros, 'valortotalfinanciar', 'vfi_inicapital');
        $this->setCampo($financiacion, $parametros, 'estado', 'vfi_estado');
        $this->setCampo($financiacion, $parametros, 'valortotalfinanciar', 'vfi_sdocapital');
        $this->setCampo($financiacion, $parametros, 'fecha', 'vfi_fecha');
        $this->setCampo($financiacion, $parametros, 'idsolicitante', 'ter_idesolicita');
        $this->setCampo($financiacion, $parametros, 'idbanco', 'ter_ideentfinan');
        $this->setCampo($financiacion, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($financiacion, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($financiacion, $parametros, 'idparentesco', 'uni_parentesco');
        //$this->setCampo($financiacion, $parametros, 'numerofinanciacion', 'fin_ideregistro');
        $this->setCampo($financiacion, $parametros, 'numerocuotas', 'vfi_numcuotas');
        $this->setCampo($financiacion, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($financiacion, $parametros, 'idliquidacion', 'uni_liquidacion');
        $this->setCampo($financiacion, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $financiacion['idventafinanciacion'] = $this->insertar($parametros, 'vfi_venfinanciacio', 'sq_vfi_ideregistro');
        return $financiacion;
    }

    public function insertarDetallesFinanciacion(array $detalleFinanciacion) {
        $parametros = array();
        $this->setCampo($detalleFinanciacion, $parametros, 'idventa', 'ven_ideregistro');
        $this->setCampo($detalleFinanciacion, $parametros, 'iddetalleventa', 'dven_ideregistr');
        $this->setCampo($detalleFinanciacion, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($detalleFinanciacion, $parametros, 'valorfinanciar', 'dvfi_vlrreal');
        $this->setCampo($detalleFinanciacion, $parametros, 'valorfinanciar', 'dvfi_sdoreal');
        $this->setCampo($detalleFinanciacion, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($detalleFinanciacion, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($detalleFinanciacion, $parametros, 'idventafinanciacion', 'vfi_ideregistro');
        $detalleFinanciacion['iddetalleventafinanciacion'] = $this->insertar($parametros, 'dvfi_detvenfinancia', 'sq_dvfi_ideregistr');
        return $detalleFinanciacion;
    }

    public function insertarAdjunto($infoSoporte) {
        $parametros = array();
        $this->setCampo($infoSoporte, $parametros, 'tipoarchivo', 'adve_tiparchivo');
        $this->setCampo($infoSoporte, $parametros, 'ruta', 'adve_ruta');
        $this->setCampo($infoSoporte, $parametros, 'nombrearchivo', 'adve_nomarchivo');
        $this->setCampo($infoSoporte, $parametros, 'idventa', 'ven_ideregistro');
        $this->setCampo($infoSoporte, $parametros, 'idventafinanciacion', 'vfi_ideregistro');
        $idAdjuntoFinanciacion = $this->insertar($parametros, 'adve_adjventa', 'sq_adve_ideregistr');
        $infoSoporte['idarchivo'] = $idAdjuntoFinanciacion;
        return $infoSoporte;
    }

    public function insertarInformacionFinanciera($informacion) {
        $parametros = array();

        $this->setCampo($informacion, $parametros, 'idventa', 'ven_ideregistro');
        $this->setCampo($informacion, $parametros, 'idtiposociedad', 'uni_tipsociedad');
        $this->setCampo($informacion, $parametros, 'idactividadeconomica', 'uni_actsuscripc');
        $this->setCampo($informacion, $parametros, 'nombreempresalaboral', 'veif_nomempresa');
        $this->setCampo($informacion, $parametros, 'fechaingreso', 'veif_fecingreso');
        $this->setCampo($informacion, $parametros, 'cantidadexperiencia', 'veif_canexperiencia');
        $this->setCampo($informacion, $parametros, 'cargolaboral', 'uni_tipcargo');
        $this->setCampo($informacion, $parametros, 'salariofijo', 'veif_ingsalario');
        $this->setCampo($informacion, $parametros, 'salariovariable', 'veif_ingvarsalario');
        $this->setCampo($informacion, $parametros, 'ingresoarriendo', 'veif_ingarriendo');
        $this->setCampo($informacion, $parametros, 'ingresoventa', 'veif_ingventa');
        $this->setCampo($informacion, $parametros, 'otroingreso', 'veif_desingotro');
        $this->setCampo($informacion, $parametros, 'valorotroingreso', 'veif_ingotro');
        $this->setCampo($informacion, $parametros, 'gastofamiliar', 'veif_egrfamilia');
        $this->setCampo($informacion, $parametros, 'gastoarriendo', 'veif_egrarriendo');
        $this->setCampo($informacion, $parametros, 'gastofinanciero', 'veif_egrfinancie');
        $this->setCampo($informacion, $parametros, 'gastocompra', 'veif_egrcompra');
        $this->setCampo($informacion, $parametros, 'otrogasto', 'veif_desegreotros');
        $this->setCampo($informacion, $parametros, 'valorotrogasto', 'veif_egrotro');
        $this->setCampo($informacion, $parametros, 'efectivo', 'veif_disefectivo');
        $this->setCampo($informacion, $parametros, 'activocorriente', 'veif_disactivo');
        $this->setCampo($informacion, $parametros, 'vehiculo', 'veif_disvehiculo');
        $this->setCampo($informacion, $parametros, 'propiedad', 'veif_dispropiedad');
        $this->setCampo($informacion, $parametros, 'telefono2', 'veif_telcelular');
        $this->setCampo($informacion, $parametros, 'telefono1', 'veif_telfijo');
        $this->setCampo($informacion, $parametros, 'idusuario', 'usu_ideregistro');

        return $this->insertar($parametros, 'veif_veninfinancie', 'sq_veif_ideregistr');
    }

    public function actualizarAdjuntos($idArchivo, $idVenta, $idVentaFinanciacion = null) {
        $parametros['ven_ideregistro'] = $idVenta;
        if (!empty($idVentaFinanciacion)) {
            $parametros['vfi_ideregistro'] = $idVentaFinanciacion;
        }
        $parametros['adve_ideregistr'] = $idArchivo;
        return $this->actualizar($parametros, 'adve_adjventa', 'adve_ideregistr=:adve_ideregistr');
    }

    public function eliminarAdjuntos($idArchivo) {
        return $this->eliminar('adve_adjventa', 'adve_ideregistr=' . $idArchivo);
    }

    public function getFinanciacion($idVenta, $idEmpresa) {
        $parametros['idventa'] = $idVenta;
        $parametros['idempresa'] = $idEmpresa;
        $sql = 'select  vfi.vfi_ideregistro idventafinanciacion,
                 vfi_inicapital capitalinicial,vfi.vfi_estado estado,
                 vfi.vfi_sdocapital saldocapital,vfi.vfi_fecha fecha,
                 vfi.ter_idesolicita idsolicitante, ter.ter_nomcompleto solicitante, vfi.uni_parentesco idparentesco,
                 unip.uni_nombre1 parentesco,
                 ter_idecodeudor idcodeudor, terc.ter_nomcompleto codeudor, terc.ter_documento documentocodeudor, 
                 vfi.ter_ideentfinan identidadfinanciera,
                 terf.ter_nomcompleto entidadfinanciera,vfi.emp_ideregistro idempresa,vfi.vfi_version as version,vfi.usu_ideregistro idusuario,
                 vfi.ven_ideregistro idventa, vfi.vfi_numcuotas numerocuotas,vfi.uni_liquidacion idliquidacion, liq.liq_nombre liquidacion,
                 vfi.uni_documento iddocumento, doc.doc_nombre documento, vfi.uni_tipdocument idtipodocumento, uni.uni_nombre1 tipodocumento,
                 vfi.fin_numero numerofinanciacion, ter.ter_documento cedulasolicitante
                from vfi_venfinanciacio  vfi inner join ter_tercero ter on ter.ter_ideregistro=vfi.ter_idesolicita
                 inner join ter_tercero terf on vfi.ter_ideentfinan=terf.ter_ideregistro
                 inner join ter_tercero terc on vfi.ter_idecodeudor = terc.ter_ideregistro
                 inner join empresas emp on emp.empresa_sevemp=vfi.emp_ideregistro
                 inner join liq_liquidacion liq on liq.uni_liquidacion=vfi.uni_liquidacion
                 inner join doc_documento doc on vfi.uni_documento=doc.uni_documento
                 inner join uni_unidad uni on vfi.uni_tipdocument=uni.uni_ideregistro
                 left join uni_unidad unip on vfi.uni_parentesco=unip.uni_ideregistro
                where vfi.ven_ideregistro=:idventa and vfi.emp_ideregistro:idempresa';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    public function getAdjuntosVenta($idVentaFinanciacion, $idVenta) {
        $parametros['idventafinanciacion'] = $idVentaFinanciacion;
        $parametros['idventa'] = $idVenta;
        $sql = 'select 
                 adve.adve_ideregistr idarchivo,adve.adve_tiparchivo tipo,adve.adve_ruta ruta,
                 adve.adve_nomarchivo nombrearchivo,
                 adve.ven_ideregistro idventa
                from adve_adjventa adve where vfi_ideregistro=:idventafinanciacion  and adve.ven_ideregistro = :idventa';
        return $this->executeQuery($sql, $parametros);
    }

    public function getConceptos($idVenta, $financiable) {
        $parametros['idventa'] = $idVenta;
        $parametros['financiable'] = $financiable;
        $sql = 'select dven.dven_ideregistr iddetalleventa,
                  dven.uni_concepto idconcepto,
                  con.con_nombre concepto,
                  dven.dven_cantidad cantidad,
                  dven.dven_vlrunitario valorunitario,
                  dven.dven_vlrtotal valortotal,
                  dven.dven_vlrreal valorreal,
                  dven.usu_ideregistro idusuario
                from dven_detventa dven inner join con_concepto con on dven.uni_concepto=con.uni_concepto
                where ven_ideregistro=:idventa and con.con_financiable=:financiable and dven.dven_vlrreal > 0';
        return $this->executeQuery($sql, $parametros);
    }

    public function getConceptosLiquidacion($parametros) {
        $sql = "SELECT
                        con.con_nombre concepto,
                        dven.dven_cantidad cantidad,
                        dven.uni_concepto idconcepto,
                        dven.dven_vlrreal  valortotal,
                        dven.dven_ideregistr iddetalleventa,
                        dven.dven_vlrunitario valorunitario
                FROM
                        dven_detventa dven
                INNER JOIN liq_liquidacion liq ON dven.uni_liquidacion = liq.uni_liquidacion
                INNER JOIN con_concepto con ON dven.uni_concepto = con.uni_concepto
                WHERE
                        uni_tipdocument = (
                                SELECT
                                        liq1.uni_tipdocument
                                FROM
                                        liq_liquidacion liq1
                                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = liq1.est_liquidacion
                                WHERE
                                        liq1.uni_liquidacion =:idliquidacion
                                AND esem.emp_ideregistro =:idempresa
                        )
                AND ven_ideregistro =:idventa
                AND con_financiable = 'S'
                AND dven.dven_vlrreal > 0";
        return $this->executeQuery($sql, $parametros);
    }

    public function getIdFinanciacion() {
        $sql = "select  nextval('sq_fin_ideregistro') idfinanciacion";
        $resultado = $this->executeQuery($sql);
        return $resultado[0]['idfinanciacion'];
    }

    public function eliminarNumeroVenta($idVenta, $idusuario) {
        $parametros['idventa'] = $idVenta;
        $sql = "UPDATE ven_venta ven SET fin_numero = null WHERE ven_ideregistro =:idventa and usu_ideregistro=$idusuario";
        $this->executeQuery($sql, $parametros);
    }

    public function inicializarFinanciacionVenta($idVenta, $idusuario) {
        $parametros['idventa'] = $idVenta;
        $sql = "UPDATE ven_venta SET ven_cuoinicial = null WHERE ven_ideregistro =:idventa and usu_ideregistro=$idusuario";
        $this->executeQuery($sql, $parametros);

        $sql = "update adve_adjventa set ven_ideregistro=null, vfi_ideregistro=null where vfi_ideregistro in (select vfi_ideregistro from vfi_venfinanciacio where ven_ideregistro=:idventa) and usu_ideregistro=$idusuario";
        $this->executeQuery($sql, $parametros);

        $sql = 'delete from dvfi_detvenfinancia dvfi where dvfi.ven_ideregistro=:idventa;';
        $this->executeQuery($sql, $parametros);

        $sql = 'delete from vfi_venfinanciacio vfi where vfi.ven_ideregistro=:idventa;';
        $this->executeQuery($sql, $parametros);

        $sql = 'delete from veif_veninfinancie veif where veif.ven_ideregistro=:idventa;';
        $this->executeQuery($sql, $parametros);
    }

    public function validarVenta($idVenta) {
        $parametros['idventa'] = $idVenta;
        $sql = "select count(ven_ideregistro) numero from ven_venta where ven_ideregistro=:idventa and ven_metpago='F'";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['numero'];
    }

    public function getConceptosFinanciacion($idVenta) {
        $parametros['idventa'] = $idVenta;
        $sql = 'select dvfi.dvfi_ideregistr iddetalleventafinanciacion,
                 dvfi.ven_ideregistro idventa, dvfi.dven_ideregistr iddetalleventa,
                 dvfi.uni_concepto idconcepto,con.con_nombre concepto,
                 dvfi.dvfi_vlrreal valorfinanciar, dvfi.emp_ideregistro idempresa,
                 dvfi.usu_ideregistro idusuario,dvfi.dvfi_version as version ,             
                 dven.dven_cantidad cantidad, dven.dven_vlrunitario valorunitario,
                 dven.dven_vlrreal valorreal, dven.dven_vlrtotal valortotal
                from dvfi_detvenfinancia dvfi inner join con_concepto con on dvfi.uni_concepto=con.uni_concepto
                     inner join dven_detventa dven on dven.dven_ideregistr=dvfi.dven_ideregistr
                where dvfi.ven_ideregistro=:idventa';
        return $this->executeQuery($sql, $parametros);
    }

    public function getFinanciacionesVenta($idventa) {
        $sql = "SELECT
                        vfi_ideregistro idventafinanciacion,
                        vfi_numcuotas numerocuota,
                        vfi_inicapital valorfinanciar,
                        vfi.ter_idesolicita idsolicitante,
                        vfi.ter_ideentfinan identidadfinanciera,
                        vfi.uni_parentesco idparentesco,
                        uni.uni_nombre1 parentesco,
                        vfi.uni_liquidacion idliquidacion,
                        vfi.vfi_fecha fechafinanciacion,
                        liq.liq_nombre liquidacion
                FROM
                        vfi_venfinanciacio vfi
                INNER JOIN liq_liquidacion liq ON vfi.uni_liquidacion = liq.uni_liquidacion
                LEFT JOIN uni_unidad uni ON vfi.uni_parentesco = uni.uni_ideregistro 
                WHERE
                        ven_ideregistro =$idventa 
                ORDER BY vfi_ideregistro ";
        return $this->executeQuery($sql);
    }

    public function getInformacionFinanciera($idventa, $idusuario) {
        $parametros['idventa'] = $idventa;
        $parametros['idusuario'] = $idusuario;
        $sql = 'SELECT
                    veif.veif_ideregistr idinformacionfinanciera,
                    veif.uni_tipsociedad idtiposociedad,
                    unisoc.uni_nombre1 tiposociedad,
                    veif.uni_actsuscripc idactividadeconomica,
                    uniact.uni_nombre1 actividadeconomica,
                    veif.veif_nomempresa nombreempresalaboral,
                    veif.veif_fecingreso fechaingreso,
                    veif.veif_canexperiencia cantidadexperiencia,
                    veif.uni_tipcargo cargolaboral,
                    unicar.uni_nombre1 tipocargo,
                    round(veif.veif_ingsalario, 0) salariofijo,
                    round(veif.veif_ingvarsalario, 0) salariovariable,
                    round(veif.veif_ingarriendo, 0) ingresoarriendo,
                    round(veif.veif_ingventa, 0) ingresoventa,
                    veif.veif_desingotro otroingreso,
                    round(veif.veif_ingotro, 0) valorotroingreso,
                    round(veif.veif_egrfamilia, 0) gastofamiliar,
                    round(veif.veif_egrarriendo, 0) gastoarriendo,
                    round(veif.veif_egrfinancie, 0) gastofinanciero,
                    round(veif.veif_egrcompra, 0) gastocompra,
                    veif.veif_desegreotros otrogasto,
                    round(veif.veif_egrotro, 0) valorotrogasto,
                    round(veif.veif_disefectivo, 0) efectivo,
                    round(veif.veif_disactivo, 0) activocorriente,
                    round(veif.veif_disvehiculo, 0) vehiculo,
                    round(veif.veif_dispropiedad, 0) propiedad,
                    veif.veif_telfijo telefono1,
                    veif.veif_telcelular telefono2
            FROM
                    veif_veninfinancie veif
            LEFT JOIN uni_unidad unisoc ON veif.uni_tipsociedad = unisoc.uni_ideregistro
            LEFT JOIN uni_unidad uniact ON veif.uni_actsuscripc = uniact.uni_ideregistro
            LEFT JOIN uni_unidad unicar ON veif.uni_tipcargo = unicar.uni_ideregistro
            WHERE veif.ven_ideregistro =:idventa ;';
        return $this->executeQuery($sql, $parametros);
    }

    public function actualizarInfoFinanciacionVenta($idventa, $numerofinanciacion, $cuotainicial) {
        
        $parametros['ven_ideregistro'] = $idventa;
        $parametros['ven_cuoinicial'] = $cuotainicial;
        $parametros['fin_numero'] = $numerofinanciacion;

        return $this->actualizar($parametros, 'ven_venta', 'ven_ideregistro=:ven_ideregistro');
    }

    public function getConceptoDetalleFinanciacion($idventafinanciacion, $idempresa) {
        $sql = "SELECT
                        con_nombre concepto,
                        dvfi.uni_concepto idconcepto,
                        dven_cantidad cantidad,
                        dven_vlrunitario valorunitario,
                        dven_vlrreal valortotal,
                        dvfi.dvfi_vlrreal valorreal,
                        dvfi.dvfi_vlrreal valorfinanciar,
                        (
                                dven_vlrreal - dvfi.dvfi_vlrreal
                        ) valorcuotaincial
                FROM
                        dvfi_detvenfinancia dvfi
                INNER JOIN con_concepto con ON dvfi.uni_concepto = con.uni_concepto
                INNER JOIN dven_detventa dven ON dvfi.dven_ideregistr = dven.dven_ideregistr
                WHERE
                        vfi_ideregistro =$idventafinanciacion AND emp_ideregistro = $idempresa;";
        return $this->executeQuery($sql);
    }

    public function getLiquidacionesVenta($idVenta, $idUsuario) {
        $parametros['idventa'] = $idVenta;
        $parametros['idusuario'] = $idUsuario;
        $sql = "SELECT
                        liq.uni_liquidacion idliquidacion,
                        liq_nombre liquidacion,
                        liq_tipcuota tipocuota,
                        uni_documento iddocumento,
                        liq.uni_tipdocument idtipodocumento,
                        tido.tido_maxcuofinancia maximoplazo
                FROM
                        liq_liquidacion liq
                INNER JOIN tido_tipdocumen tido ON tido.uni_tipdocument = liq.uni_tipdocument
                WHERE
                        liq.liq_venclasific = 'FI'
                AND liq.uni_tipdocument IN (
                        SELECT
                                uni_tipdocument
                        FROM
                                liq_liquidacion liqvent
                        INNER JOIN veli_venliquidac veli ON liqvent.uni_liquidacion = veli.uni_liquidacion
                        WHERE
                                veli.ven_ideregistro =:idventa )";
        return $this->executeQuery($sql, $parametros);
    }

    public function getInformacionUnidadPorClase($idClase, $idEmpresa) {
        $parametros['idclase'] = $idClase;
        $parametros['idempresa'] = $idEmpresa;
        $sql = 'SELECT
                        uni.uni_ideregistro idunidad,
                        uni.uni_nombre1 nombre
                FROM
                        est_estructura est
                INNER JOIN esem_estempresa esem ON est.est_ideregistro = esem.est_ideregistro
                INNER JOIN cla_clase cla ON est.cla_ideregistro = cla.cla_ideregistro
                INNER JOIN uni_unidad uni ON est.est_ideregistro = uni.est_ideregistro
                WHERE
                        esem.emp_ideregistro =:idempresa
                AND est.cla_ideregistro =:idclase;';
        return $this->executeQuery($sql, $parametros);
    }

    public function getLiquidacionesSimulador($idUsuario, $idEmpresa) {
        $parametros['idusuario'] = $idUsuario;
        $parametros['idempresa'] = $idEmpresa;
        $sql = "select DISTINCT liq.uni_liquidacion idliquidacion, liq.liq_nombre liquidacion
                from liq_liquidacion liq 
                INNER JOIN 	prun_prgunidad prun on prun.uni_ideregistro = liq.uni_liquidacion
                INNER JOIN  esem_estempresa esem on esem.est_ideregistro  = liq.est_liquidacion
                INNER JOIN  uspu_usuprgunid uspu on uspu.prun_ideregistr = prun.prun_ideregistr
                where liq_venclasific ='FI'  and esem.emp_ideregistro = :idempresa   and uspu.usu_ideregistro = :idusuario
                and prun.prg_ideregistro = 456";
        return $this->executeQuery($sql, $parametros);
    }
}
