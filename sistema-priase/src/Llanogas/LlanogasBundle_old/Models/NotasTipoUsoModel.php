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
class NotasTipoUsoModel extends AuditoriaServices {

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

    public function consultarSuscripcion($parametros) {
        if (empty($parametros)) {
            throw new MyException("No hay parámetros de búsqueda", -1);
        }
        $complemento = '';
        if ((!empty($parametros['idsuscripcion']) ) && $parametros['idsuscripcion'] != -1) {
            $complemento.='and dsus.dsus_ideregistr=:idsuscripcion ';
        } else {
            if (!empty($parametros['codigoanterior'])) {
                $complemento .='and dsus.dsus_pcodigo=:codigoanterior ';
            }
            if (!empty($parametros['cedula'])) {
                $complemento .='and ter.ter_documento=:cedula ';
            }
        }
        if (!isset($parametros['idempresa'])) {
            throw new MyException('Faltan parámetros de búsqueda: idempresa', -1);
        }
        if (!isset($parametros['idprograma'])) {
            throw new MyException('Faltan parámetros de búsqueda: idprograma', -1);
        }
        if (empty($complemento)) {
            throw new MyException('No hay parámetros de búsqueda', -1);
        }
        $sql = "SELECT DISTINCT
                    dsus.dsus_ideregistr idsuscripcion,dsus.dsus_pcodigo codigoanterior,
                    dsus.uni_liquidacion idliquidacion,ter.ter_ideregistro idsuscriptor,
                    ter.ter_nomcompleto nombretercero,ter.ter_documento cedula,
                    ter.ter_telfijo telefonofijo,ter.ter_telcelular telefonocelular,
                    dsus.uni_tipusosuscr idtipousosuscripcion,uni.uni_nombre1 tipousosuscripcion,
                    liq.liq_nombre liquidacion,cic.cic_ideregistro idciclo,
                    cic.cic_nombre ciclo,pro.pro_direccion direccion, 
                    barrio.barrio_cod idbarrio,barrio.barrio_nom barrio,
                    municipio.proyecto_cod idmunicipio,municipio.proyecto_nom municipio
                FROM
                    dsus_detsuscrip dsus
                    INNER JOIN cic_ciclo cic ON dsus.cic_ideregistro = cic.cic_ideregistro
                    INNER JOIN ter_tercero ter ON dsus.ter_ideregistro = ter.ter_ideregistro
                    INNER JOIN uni_unidad uni ON dsus.uni_tipusosuscr = uni.uni_ideregistro
                    INNER JOIN liq_liquidacion liq ON dsus.uni_liquidacion = liq.uni_liquidacion
                    INNER JOIN pro_propiedad pro ON ter.ter_ideregistro = pro.ter_ideregistro and dsus.pro_ideregistro = pro.pro_ideregistro
                    INNER JOIN barrios barrio on barrio.barrio_ideregistro = pro.uni_barrio
                    INNER JOIN proyectos municipio on municipio.proyecto_ideregistro = pro.uni_municipio
                WHERE 
                    dsus.emp_ideregistro = :idempresa AND 
                    dsus.uni_municipio IN (
                                           select distinct uspr.uni_municipio 
                                           from uspr_usuprgpryto uspr 
                                           where uspr.usu_ideregistro=:idusuario and uspr.prg_ideregistro=:idprograma
                                          ) " . $complemento;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta tipos de documentos disponibles por programa y suscripción
     * @param integer $idusuario id del usuario logueado
     * @param integer $idempresa empresa logueada
     * @param integer $idsuscripcion
     * @return array Información de tipos de documentos
     */
    public function getTiposDocumentos($parametros) {
        $sql = "SELECT DISTINCT
                        fac.uni_tipdocument idtipodocumento,
                        uni.uni_nombre1 tipodocumento
                FROM
                        fac_factura fac
                INNER JOIN uni_unidad uni ON fac.uni_tipdocument = uni.uni_ideregistro
                INNER JOIN prun_prgunidad prun ON fac.uni_tipdocument = prun.uni_ideregistro
                INNER JOIN uspu_usuprgunid uspu ON prun.prun_ideregistr = uspu.prun_ideregistr
                INNER JOIN esem_estempresa esem ON uni.est_ideregistro = esem.est_ideregistro
                WHERE
                prun.prg_ideregistro =:idprograma
		AND fac.dsus_ideregistr =:idsuscripcion
                AND uspu.usu_ideregistro =:idusuario
                AND esem.emp_ideregistro =:idempresa
                AND fac.fac_idepadre IS NULL";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Las notas de tipo de uso, solo se va a realizar a la última factura que se liquidó
     * EL usuario primero debe de cambiar el tipo de uso en el programa de "Modificar suscripción".
     * @Date 2016-05-24
     * @param array $parametros (idusuario,idempresa,idsuscripcion)
     * @return int 1 Satisfactorio 0 Incorrectos
     * @throws MyException Que no se envíen los parámetros correctamente o que no genere resultados
     */
    public function getFacturas($parametros) {
        if (!isset($parametros['idsuscripcion'])) {
            throw new MyException('Id suscripción requerido', -1);
        }
        $sql = "SELECT
                 fac.fac_ideregistro idfactura,fac.fac_numero numero, 
                 fac.ter_ideregistro idtercero, fac.uni_liquidacion idliquidacion,
                 fac.fac_fecvence fechavencimiento,dsus.dsus_ideregistr idsuscripcion,
                 dsus.dsus_pcodigo codigoanterior,tsu.tsu_nombre tiposuscripcion,
                 fac.cic_ideregistro idciclo,fac.per_ideregistro idperiodo,cic.cic_nombre ciclo,
                 cic.cic_anoactual cicloanio,
                 fac.uni_documento iddocumento, fac.uni_tipdocument idtipodocumento,
                 per.per_nombre periodo, cic.cic_nombre ||' '|| per.per_nombre cicloperiodo,
                 fac.fac_sdoreal saldo, fac.fac_vlrreal valortotal,
                 (fac.fac_vlrreal-fac.fac_sdoreal) valorpagado,fac.fac_version as version             
                FROM
                  fac_factura fac INNER JOIN dsus_detsuscrip dsus ON fac.dsus_ideregistr=dsus.dsus_ideregistr
                  INNER JOIN per_periodo per ON per.cic_ideregistro=dsus.cic_ideregistro
                  INNER JOIN tsu_tipsuscripc tsu on tsu.uni_tipsuscripc=dsus.uni_tipsuscripc
                  INNER JOIN cic_ciclo cic ON fac.cic_ideregistro=cic.cic_ideregistro
                  INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion = fac.uni_liquidacion
                  INNER JOIN doc_documento doc ON doc.uni_documento=fac.uni_documento 
                WHERE
                  fac.fac_estado = 'A' AND fac.cic_ideregistro = dsus.cic_ideregistro
                  AND fac.per_ideregistro = per.per_ideregistro
                  AND fac.uni_tipusosuscr <> dsus.uni_tipusosuscr
                  AND fac.fac_idepadre IS NULL
                  AND fac.fac_ideorigen IS NULL
                  AND fac.fin_ideregistro IS NULL
                  AND dsus.dsus_ideregistr=:idsuscripcion
                  AND per.per_ideregistro=:idperiodo
                  AND doc.doc_tipo='LI'
                  AND liq.liq_venclasific='LI'";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No hay factura para generar nota. (Verificar el estado de la última factura liquidada)', -1);
        }
        return $resultado;
    }

    public function eliminarTablasTemporal($idUsuario) {
        //Elimina la secuencia temporal si es que existe
        $sqlDrop = "DROP SEQUENCE IF EXISTS sq_temp_tipouso_factura_$idUsuario";
        $this->executeQuery($sqlDrop);
        $sqlDrop = "DROP TABLE IF EXISTS temp_tipouso_factura_$idUsuario";
        $this->executeQuery($sqlDrop);
        $sqlDrop = "DROP TABLE IF EXISTS temp_tipouso_detalle_$idUsuario";
        $this->executeQuery($sqlDrop);
        $this->crearTablasTemporal($idUsuario);
    }

    public function crearTablasTemporal($idUsuario) {
        //Elimina la secuencia temporal si es que existe
        $sqlCrear = "CREATE SEQUENCE sq_temp_tipouso_factura_$idUsuario";
        $this->executeQuery($sqlCrear);
        $sqlCrear = "CREATE TABLE  temp_tipouso_factura_$idUsuario AS (select * from fac_factura limit 0)";
        $this->executeQuery($sqlCrear);
        $sqlCrear = "CREATE TABLE temp_tipouso_detalle_$idUsuario AS (select * from dfac_detfactura limit 0)";
        $this->executeQuery($sqlCrear);
    }

    public function insertarFacturaTemporal($factura, $idUsuario) {
        $parametros = array();
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
        $this->setCampo($factura, $parametros, 'idfactura', 'fac_ideregistro');
        return $this->insertar($parametros, "temp_tipouso_factura_$idUsuario", NULL);
    }

    public function insertarDetalleFactura($detalleFactura, $idUsuario) {
        $parametros = array();
        $this->setCampo($detalleFactura, $parametros, 'iddetallefactura', 'dfac_ideregistr');
        $this->setCampo($detalleFactura, $parametros, 'estado', 'dfac_estado');
        $this->setCampo($detalleFactura, $parametros, 'cantidad', 'dfac_cantidad');
        $this->setCampo($detalleFactura, $parametros, 'valorunitario', 'dfac_vlrunitari');
        $this->setCampo($detalleFactura, $parametros, 'valortotal', 'dfac_vlrtotal');
        $this->setCampo($detalleFactura, $parametros, 'valorreal', 'dfac_vlrreal');
        $this->setCampo($detalleFactura, $parametros, 'valorreal', 'dfac_sdoreal');
        $this->setCampo($detalleFactura, $parametros, 'idfactura', 'fac_ideregistro');
        $this->setCampo($detalleFactura, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($detalleFactura, $parametros, 'version', 'dfac_version');
        $this->setCampo($detalleFactura, $parametros, 'idusuario', 'usu_ideregistro');
        return $this->insertar($parametros, "temp_tipouso_detalle_$idUsuario", null);
    }

    public function getIdFacturaTemporal($idUsuario) {
        $sql = "select nextval('sq_temp_tipouso_factura_$idUsuario') idfactura";
        return $this->executeQuery($sql)[0]['idfactura'];
    }

    public function getIdFactura() {
        $sql = "select nextval('sq_fac_ideregistro') idfactura";
        return $this->executeQuery($sql)[0]['idfactura'];
    }

    public function crearNuevaFactura($idUsuario, $idFactura, $idFacturaInicial) {
        $sqlActualizar = "update temp_tipouso_factura_$idUsuario set fac_ideregistro=$idFactura,fac_ideorigen=$idFacturaInicial ";
        $this->executeQuery($sqlActualizar);
        $sql = "insert into fac_factura (select * from temp_tipouso_factura_$idUsuario) ";
        $this->executeQuery($sql);
    }

    public function crearNuevaFacturaDetalle($idUsuario, $idFactura) {
        $sqlActualizar = "update temp_tipouso_detalle_$idUsuario set fac_ideregistro=$idFactura";
        $this->executeQuery($sqlActualizar);
        $sql = "insert into dfac_detfactura (dfac_estado,dfac_cantidad,dfac_vlrunitari,dfac_vlrtotal,dfac_vlrreal,dfac_sdoreal,fac_ideregistro,uni_concepto,dfac_version,usu_ideregistro)
                 (select dfac_estado,dfac_cantidad,dfac_vlrunitari,dfac_vlrtotal,dfac_vlrreal,dfac_sdoreal,fac_ideregistro,uni_concepto,dfac_version,usu_ideregistro from temp_tipouso_detalle_$idUsuario) ";
        $this->executeQuery($sql);
    }

    public function validarRecaudos($idFactura) {
        $parametros['idfactura'] = $idFactura;
        $sql = "SELECT
                  count(*) numero
                FROM
                  drec_detrecaudo drec INNER JOIN rec_recaudo rec ON drec.rec_ideregistro=rec.rec_ideregistro
                WHERE
                  drec.fac_ideregistro = :idfactura AND rec.rec_estado IN ('A','P','G')";
        $resultado = $this->executeQuery($sql, $parametros)[0]['numero'];
        if ($resultado > 0) {
            throw new MyException('La factura ya tienen registrado un pago.', -1);
        }
    }

    public function insertarNota($nota) {
        $parametros = array();
        $this->setCampo($nota, $parametros, 'fecha', 'not_fecha');
        $this->setCampo($nota, $parametros, 'comentario', 'not_comentario');
        $this->setCampo($nota, $parametros, 'idmotivonota', 'uni_motnota');
        $this->setCampo($nota, $parametros, 'idsuscripcion', 'dsus_ideregistr');
        $this->setCampo($nota, $parametros, 'idciclo', 'cic_ideregistro');
        $this->setCampo($nota, $parametros, 'idperiodo', 'per_ideregistro');
        $this->setCampo($nota, $parametros, 'idestructuranota', 'est_motnota');
        $this->setCampo($nota, $parametros, 'cicloanio', 'cic_ano');
        $this->setCampo($nota, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($nota, $parametros, 'idusuario', 'usu_ideregistro');
        $idNota = $this->insertar($parametros, 'not_nota', 'sq_not_ideregistro');
        $nota['idnota'] = $idNota;
        return $nota;
    }

    public function insertarNotaFactura($notaFactura) {
        $parametros = array();
        $this->setCampo($notaFactura, $parametros, 'idnotafactura', 'nofa_ideregistr');
        $this->setCampo($notaFactura, $parametros, 'idnota', 'not_ideregistro');
        $this->setCampo($notaFactura, $parametros, 'idfactura', 'fac_ideregistro');
        $this->setCampo($notaFactura, $parametros, 'iddetallefactura', 'dfac_ideregistr');
        $this->setCampo($notaFactura, $parametros, 'idfacturaorigen', 'fac_ideorigen');
        $this->setCampo($notaFactura, $parametros, 'iddetallefacturaorigen', 'dfac_ideorigen');
        $this->setCampo($notaFactura, $parametros, 'idusuario', 'usu_ideregistro');
        return $this->insertar($parametros, 'nofa_notfactura', 'sq_nofa_ideregistr');
    }

    public function actualizarEstado($idFactura, $estado) {
        $parametros['fac_ideregistro'] = $idFactura;
        $parametros['fac_estado'] = $estado;
        $this->actualizar($parametros, 'fac_factura', 'fac_ideregistro = :fac_ideregistro');
    }

    public function validarInformacionTemporal($idUsuario) {
        try {
            $sql = "select * from temp_tipouso_factura_$idUsuario ";
            $resultado = $this->executeQuery($sql);
        } catch (\Exception $exc) {
            
        }
        if (!empty($resultado)) {
            throw new MyException('Error, Hay trabajo pendiente por terminar, '
            . 'verifique que no tenga abierto el programa en otra pestaña y/o equipo,'
            . ' si está seguro que no tiene trabajo pendiente, presione el botón de cancelar, éste eliminará las notas en trámite', -1);
        }
    }

    public function validarInformacionDetalleTemporal($idUsuario) {
        try {
            $sqlEncabezado = "select * from temp_tipouso_detalle_$idUsuario ";
            $resultado = $this->executeQuery($sqlEncabezado);
        } catch (\Exception $exc) {
            
        }
        if (empty($resultado)) {
            throw new MyException('Error, Se ha eliminado las notas pendientes ', -1);
        }
    }

}
