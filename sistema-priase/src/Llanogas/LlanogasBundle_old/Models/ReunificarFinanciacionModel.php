<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * Reunifica más de una financiación.
 *
 * @author hrey
 */
class ReunificarFinanciacionModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    public function obtenerDetalleFinanciacion($idfinanciacion) {
        $sql = "select * from dfin_detfinanci where fin_ideregistro = $idfinanciacion ";
        return $this->executeQuery($sql);
    }

    public function obtenerFinanciacion($idfinanciacion) {
        $sql = "select * from fin_financiacio where fin_financiacio.fin_ideregistro = $idfinanciacion ";
        $respuesta = $this->executeQuery($sql);
        return $respuesta[0];
    }

    /**
     * Ingresa un nuevo registro de financiación.
     * @param array $financiacion Información de la financiación.
     * @return int identificador de la nueva financiación.
     */
    public function insertarFinanciacionNota($financiacion) {
        $parametros['fin_inicapital'] = $financiacion['fin_inicapital'];
        $parametros['fin_estado'] = 'A';
        $parametros['fin_fecha'] = 'now()';
        $parametros['ter_idesolicita'] = $financiacion['ter_idesolicita'];
        $parametros['dsus_ideregistr'] = $financiacion['dsus_ideregistr'];
        $parametros['ter_ideentfinan'] = $financiacion['ter_ideentfinan'];
        $parametros['cic_ideregistro'] = $financiacion['cic_ideregistro'];
        $parametros['per_ideregistro'] = $financiacion['per_ideregistro'];
        $parametros['emp_ideregistro'] = $financiacion['emp_ideregistro'];
        $parametros['cic_ano'] = $financiacion['cic_ano'];
        $parametros['usu_ideregistro'] = $financiacion['idusuario'];
        $parametros['fin_sdocapital'] = abs($financiacion['fin_sdocapital']) * -1;
        $parametros['fin_ideorigen'] = $financiacion['idfinanciacionOrigen'];
        $parametros['fin_idepadre'] = $financiacion['idfinanciacionOrigen'];
        return $this->insertar($parametros, 'fin_financiacio', 'sq_fin_ideregistro');
    }

    /**
     * Ingresa un nuevo registro de financiación.
     * @param array $financiacion Información de la financiación.
     * @return int identificador de la nueva financiación.
     */
    public function insertarFinanciacion($financiacion) {
        $parametros['fin_inicapital'] = $financiacion['capitalinicial'];
        $parametros['fin_sdocapital'] = $financiacion['saldocapital'];
        $parametros['fin_estado'] = 'A';
        $parametros['fin_fecha'] = 'now()';
        $parametros['ter_idesolicita'] = $financiacion['idsolicita'];
        $parametros['dsus_ideregistr'] = $financiacion['idsuscripcion'];
        $parametros['ter_ideentfinan'] = $financiacion['identidadfinanciera'];
        $parametros['cic_ideregistro'] = $financiacion['idciclo'];
        $parametros['per_ideregistro'] = $financiacion['idperiodo'];
        $parametros['emp_ideregistro'] = $financiacion['idempresa'];
        $parametros['cic_ano'] = $financiacion['cicloanio'];
        $parametros['usu_ideregistro'] = $financiacion['idusuario'];
        return $this->insertar($parametros, 'fin_financiacio', 'sq_fin_ideregistro');
    }

    /**
     * Actualiza el estado de una financiación  a U.
     * @param int $idFinanciacion identificador de la financiación
     * @return int numero de registro afectados
     */
    public function actualizarDetalleFinanciacion($idFinanciacion) {
        $parametros['dfin_sdoreal'] = '0';
        $parametros['fin_ideregistro'] = $idFinanciacion;
        return $this->actualizar($parametros, 'dfin_detfinanci', 'fin_ideregistro=:fin_ideregistro');
    }

    /**
     * Actualiza el estado de una financiación  a U.
     * @param int $idFinanciacion identificador de la financiación
     * @return int numero de registro afectados
     */
    public function actualizarFinanciacion($idFinanciacion, $idnuevafinanciacion) {
        $parametros['fin_estado'] = 'U';
        $parametros['fin_sdocapital'] = '0';
        $parametros['fin_ideregistro'] = $idFinanciacion;
        $parametros['fin_ideunificad'] = $idnuevafinanciacion;
        return $this->actualizar($parametros, 'fin_financiacio', 'fin_ideregistro=:fin_ideregistro');
    }

    /**
     * Consulta la amortización que este en estado Activo de una financiación.
     * @param int $idFinanciacion identificador de la financiación.
     * @return array Detalle de la amortización activa.
     */
    public function consultarAmortizacionFinanciacion($idFinanciacion) {
        $parametros['idfinanciacion'] = $idFinanciacion;
        $sql = "select amfi_ideregistr idamortizacionfinanfiacion , uni_liquidacion idliquidacion 
                 from amfi_amofinanci where fin_ideregistro=:idfinanciacion
                 and amfi_estado='A'";
        $resultado = $this->executeQuery($sql, $parametros);
        return empty($resultado) ? $resultado : $resultado[0];
    }

    /**
     * Actualiza el estado de la amortización a U 
     * @param int $idAmortizacionFinanciacion identificador de la amortización
     * @return int numero de registros afectados.
     */
    public function actualizarAmortizacionFinanciacion($idAmortizacionFinanciacion) {
        $parametros['amfi_estado'] = 'U';
        $parametros['amfi_ideregistr'] = $idAmortizacionFinanciacion;
        return $this->actualizar($parametros, 'amfi_amofinanci', 'amfi_ideregistr = :amfi_ideregistr');
    }

    /**
     * Actualiza el estado de la amortización a U 
     * @param int $idAmortizacionFinanciacion identificador de la amortización
     * @return int numero de registros afectados.
     */
    public function actualizarFinanciacionUnificacion($idfinanciacion, $idnuevafinanciacion) {
        $parametros['fin_ideunificad'] = $idnuevafinanciacion;
        return $this->actualizar($parametros, 'fin_financiacio', "fin_ideregistro = $idfinanciacion");
    }

    /**
     * Consulta los conceptos y los detalles de una financiación.
     * @param string $complemento sql con la condición de la consulta
     * @return array Listado de los detalles de la financiación.
     */
    public function consultarConceptosDetalleFinanciacion($complemento) {
        $sql = "select  idfactura,iddetallefactura,idconcepto,sum(saldo) saldo from(
				select fac_ideregistro idfactura,dfac_ideregistr iddetallefactura,uni_concepto idconcepto,
				       (select coalesce(sum(df.dfin_vlrreal),0) 
					from dfin_detfinanci df
					where df.dfin_ideregistr=dfin.dfin_ideregistr or df.dfin_idepadre=dfin.dfin_ideregistr
				       )-
				       (
			                select coalesce(sum(damo.damo_vlrreal),0) from damo_detamortiz damo where damo.dfin_ideregistr=dfin.dfin_ideregistr
				       ) saldo
				from dfin_detfinanci dfin 
				where dfin.fin_ideregistro in ($complemento) and dfin.dfin_idepadre is null
			     ) 
                as conceptos where saldo>0
               group by idfactura,iddetallefactura,idconcepto";

        //   throw new MyException('', -1);
        return $this->executeQuery($sql);
    }

    /**
     * Inserta un nuevo registro de detalle de la financiación.
     * @param array $detalleFinanciacion información del detalle
     * @return int identificador del nuevo detalle
     */
    public function insertarDetalleFinanciacion($detalleFinanciacion) {
        $parametros['fin_ideregistro'] = $detalleFinanciacion['idfinanciacion'];
        $parametros['dfac_ideregistr'] = $detalleFinanciacion['iddetallefactura'];
        $parametros['fac_ideregistro'] = $detalleFinanciacion['idfactura'];
        $parametros['dsus_ideregistr'] = $detalleFinanciacion['idsuscripcion'];
        $parametros['uni_liquidacion'] = $detalleFinanciacion['idliquidacion'];
        $parametros['uni_concepto'] = $detalleFinanciacion['idconcepto'];
        $parametros['dfac_vlrunitari'] = $detalleFinanciacion['saldo'];
        $parametros['dfac_vlrtotal'] = $detalleFinanciacion['saldo'];
        $parametros['dfac_sdoreal'] = $detalleFinanciacion['saldo'];
        $parametros['dfin_vlrreal'] = $detalleFinanciacion['saldo'];
        $parametros['dfin_sdoreal'] = $detalleFinanciacion['saldo'];
        $parametros['emp_ideregistro'] = $detalleFinanciacion['idempresa'];
        $parametros['cic_ideregistro'] = $detalleFinanciacion['idciclo'];
        $parametros['per_ideregistro'] = $detalleFinanciacion['idperiodo'];
        $parametros['cic_ano'] = $detalleFinanciacion['cicloanio'];
        $parametros['dfin_fecha'] = 'now()';
        $parametros['usu_ideregistro'] = $detalleFinanciacion['idusuario'];
        return $this->insertar($parametros, 'dfin_detfinanci', 'sq_dfin_ideregistr');
    }

    /**
     * Inserta un nuevo registro de detalle de la financiación.
     * @param array $detalleFinanciacion información del detalle
     * @return int identificador del nuevo detalle
     */
    public function insertarDetalleNotaFinanciacion($detalleFinanciacion) {
        $parametros['fin_ideregistro'] = $detalleFinanciacion['idfinanciacionnota'];
        $parametros['dfac_ideregistr'] = $detalleFinanciacion['dfac_ideregistr'];
        $parametros['fac_ideregistro'] = $detalleFinanciacion['fac_ideregistro'];
        $parametros['dsus_ideregistr'] = $detalleFinanciacion['dsus_ideregistr'];
        $parametros['uni_liquidacion'] = $detalleFinanciacion['uni_liquidacion'];
        $parametros['uni_concepto'] = $detalleFinanciacion['uni_concepto'];
        $parametros['dfac_vlrunitari'] = $detalleFinanciacion['dfac_vlrunitari'];
        $parametros['dfac_vlrtotal'] = $detalleFinanciacion['dfac_vlrtotal'];
        $parametros['dfac_sdoreal'] = $detalleFinanciacion ['dfac_sdoreal'];
        $parametros['dfin_vlrreal'] = abs($detalleFinanciacion['dfin_vlrreal']) * -1;
        $parametros['dfin_sdoreal'] = abs($detalleFinanciacion ['dfac_sdoreal']) * -1;
        $parametros['emp_ideregistro'] = $detalleFinanciacion['emp_ideregistro'];
        $parametros['cic_ideregistro'] = $detalleFinanciacion['cic_ideregistro'];
        $parametros['per_ideregistro'] = $detalleFinanciacion['per_ideregistro'];
        $parametros['cic_ano'] = $detalleFinanciacion['cic_ano'];
        $parametros['dfin_fecha'] = 'now()';
        $parametros['usu_ideregistro'] = $detalleFinanciacion['idusuario'];
        $parametros['dfin_ideorigen'] = $detalleFinanciacion['iddetallefinanciacionOrigen'];
        $parametros['dfin_idepadre'] = $detalleFinanciacion['iddetallefinanciacionOrigen'];
        return $this->insertar($parametros, 'dfin_detfinanci', 'sq_dfin_ideregistr');
    }

    /**
     * crea la nueva amortización para la financiacion nueva 
     * @param array $financiacion 
     * @return int identificador de la amortización generada.
     */
    public function insertarNuevaAmortizacion($financiacion) {
        $parametros['amfi_estado'] = 'A';
        $parametros['amfi_cuoamortiz'] = 0;
        $parametros['amfi_fecha'] = 'now()';
        $parametros['amfi_numcuotas'] = $financiacion['cuotas'];
        $parametros['fin_ideregistro'] = $financiacion['idnuevafinanciacion'];
        $parametros['uni_liquidacion'] = $financiacion['idliquidacion'];
        $parametros['uni_documento'] = $financiacion['iddocumento'];
        $parametros['uni_tipdocument'] = $financiacion['idtipodocumento'];
        $parametros['dsus_ideregistr'] = $financiacion['idsuscripcion'];
        $parametros['emp_ideregistro'] = $financiacion['idempresa'];
        $parametros['cic_ideregistro'] = $financiacion['idciclo'];
        $parametros['per_ideregistro'] = $financiacion['idperiodo'];
        $parametros['cic_ano'] = $financiacion['cicloanio'];
        $parametros['usu_ideregistro'] = $financiacion['idusuario'];
        return $this->insertar($parametros, 'amfi_amofinanci', 'sq_amfi_ideregistr');
    }

    /**
     * Ingresa una nueva nota a la base de datos
     * @param array $nota Detalle de la nota
     * @return int identificador de la nueva nota
     */
    public function insertarNota($nota) {
        $parametros['not_fecha'] = 'now()';
        $parametros['not_comentario'] = 'Nota Reunificación';
        $parametros['uni_motnota'] = UNIDAD_FINANCIACION;
        $parametros['dsus_ideregistr'] = $nota['idsuscripcion'];
        $parametros['cic_ideregistro'] = $nota['idciclo'];
        $parametros['per_ideregistro'] = $nota['idperiodo'];
        $parametros['cic_ano'] = $nota['cicloanio'];
        $parametros['usu_ideregistro'] = $nota['idusuario'];
        $parametros['est_motnota'] = ESTRUCTURA_NOTA;
        $parametros['emp_ideregistro'] = $nota['idempresa'];
        $parametros['usu_ideregistro'] = $nota['idusuario'];
        return $this->insertar($parametros, 'not_nota', 'sq_not_ideregistro');
    }

    /**
     * Relaciona la nota con una financiación
     * @param array $notaFinanciacion Información de la nota y de la financiación.
     * @return int identificador generado.
     */
    public function insertarNotaFinanciacion($notaFinanciacion) {
        $parametros['not_ideregistro'] = $notaFinanciacion['idnota'];
        $parametros['fin_ideorigen'] = $notaFinanciacion['idfinanciacionOrigen'];
        $parametros['dfin_ideorigen'] = $notaFinanciacion['dfinIdOrigen'];
        $parametros['fin_ideregistro'] = $notaFinanciacion['idfinanciacionNotaNueva'];
        $parametros['dfin_ideregistr'] = $notaFinanciacion['iddetallenotafinanciacion'];
        $parametros['usu_ideregistro'] = $notaFinanciacion['idusuario'];

        return $this->insertar($parametros, 'nofi_notfinanci', 'sq_nofi_ideregistr');
    }

    /**
     * Elimina una financiación 
     * @param int $idFinanciacion identificador de la financiación.
     * @return int numero de registros que se actualizaron.
     */
    public function anularFinanciacion($idFinanciacion) {
        $parametros['idfinanaciacion'] = $idFinanciacion;
        $sql = "  INSERT INTO dfin_detfinanci(
            fin_ideregistro, dfac_ideregistr, fac_ideregistro, 
            dsus_ideregistr, uni_liquidacion, uni_concepto, dfac_vlrunitari, 
            dfac_vlrtotal, dfac_sdoreal, dfin_vlrreal, dfin_sdoreal, emp_ideregistro, 
            dfin_ideorigen, dfin_idepadre)
	select 
	fin_ideregistro, dfac_ideregistr, fac_ideregistro, 
        dsus_ideregistr, uni_liquidacion, uni_concepto,saldo dfac_vlrunitari, 
        saldo dfac_vlrtotal, saldo dfac_sdoreal, saldo *-1 dfin_vlrreal, saldo dfin_sdoreal, emp_ideregistro, 
        dfin_ideregistr dfin_ideorigen, dfin_ideregistr dfin_idepadre
        from (
	select dfin.*,
	       (select coalesce(sum(df.dfin_vlrreal),0) 
		from dfin_detfinanci df
		where df.dfin_ideregistr=dfin.dfin_ideregistr or df.dfin_idepadre=dfin.dfin_ideregistr
	       )-
	       (
		select coalesce(sum(damo.damo_vlrreal),0) from damo_detamortiz damo where damo.dfin_ideregistr=dfin.dfin_ideregistr
	       ) saldo
	from dfin_detfinanci dfin 
	where dfin.fin_ideregistro = :idfinanciacion and dfin.dfin_idepadre is null) as detalles";

        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Filtro de reunificar financiaciones
     * @param int $idSuscripcion identificador de la financiación.
     * @param int $empresa identificador de la empresa
     * @param string $documentoTercero cédula del documento.
     * @param string $codigoAnterior código anterior
     * @return array Listado de las suscripciones.
     */
    public function filtrarSuscripcionesReunificarFinanciacionModel($idSuscripcion, $empresa, $documentoTercero, $codigoAnterior = 0) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['codigoanterior'] = $codigoAnterior;
        $parametros['documentotercero'] = $documentoTercero;
        $parametros['empresa'] = $empresa;
        $sql = "SELECT DISTINCT
                        sus.sus_ideregistro idsuscriptor,
                        ter.ter_ideregistro idtercero,
                        ter.ter_documento documento,
                        ter.ter_nomcompleto nombre,
                        cnre.cnre_ideregistr idconvenio,
                        cnre.cnre_nombre convenio,
                        dsus.dsus_ideregistr idsuscripcion,
                        dsus.dsus_pcodigo codigoanterior,
                        dsus.dsus_estado estado,
                        emp.empresa_nom empresa,
                        pro.pro_direccion direccion,
                        est.est_nombre tiposuscripcion
                FROM
                        sus_suscripcion sus
                INNER JOIN ter_tercero ter ON sus.ter_ideregistro = ter.ter_ideregistro
                INNER JOIN dsus_detsuscrip dsus ON sus.sus_ideregistro = dsus.sus_ideregistro
                INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro = pro.pro_ideregistro
                INNER JOIN cnre_cnvrecaudo cnre ON sus.cnre_ideregistr = cnre.cnre_ideregistr
                INNER JOIN empresas emp ON dsus.emp_ideregistro = emp.empresa_sevemp
                INNER JOIN fin_financiacio fin ON fin.dsus_ideregistr = dsus.dsus_ideregistr
                INNER JOIN est_estructura est ON est.est_ideregistro = dsus.est_tipsuscripc
                WHERE
                        (
                                dsus.dsus_pcodigo = :codigoanterior
                                OR dsus.dsus_ideregistr = :idsuscripcion
                                OR ter.ter_documento = :documentotercero
                        )
                AND emp.empresa_sevemp = :empresa
                AND fin.fin_estado IN ('A', 'R')";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consultar el documento y tipo de documento
     * @param int $idsuscripcion identificador de la suscripción.
     * @return array información de la financiación.
     */
    public function consultarDocumentoTipoDocumentoReunificarModel($idsuscripcion) {
        $parametros['idsuscripcion'] = $idsuscripcion;
        $sql = "select 
                    distinct 
                    amfi.uni_documento iddocumento,
                    amfi.uni_tipdocument idtipodocumento,
                    doc.doc_nombre documento,
                    tido.tido_nombre tipodocumento
                from 
                    amfi_amofinanci amfi inner join doc_documento doc on amfi.uni_documento=doc.uni_documento
                    inner join tido_tipdocumen tido on amfi.uni_tipdocument=tido.uni_tipdocument
                where dsus_ideregistr=:idsuscripcion ";
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException('No existe una suscripción disponible', -1);
        }

        return $respuesta[0];
    }

    /**
     * Consulta las liquidaciones de las financiaciones
     * @return array Listado de las financiaciones
     */
    public function consultarLiquidacionFinanciacionModel($iddocumento = null, $idtipodocumento = null) {
        $complemento = '';
        if (!empty($iddocumento)) {
            $complemento .= " and uni_documento = $iddocumento ";
        }
        if (!empty($idtipodocumento)) {
            $complemento .= " and uni_tipdocument = $idtipodocumento ";
        }

        $sql = "    SELECT
                            uni_liquidacion idliquidacion,
                            liq_nombre liquidacion
                    FROM
                            liq_liquidacion liq
                    WHERE
                            liq.liq_venclasific = 'FI' " . $complemento;

        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException('No hay liquidaciones disponibles', 0);
        }

        return $respuesta;
    }

    /**
     * Permite obtener los tipos de documentos por perfil
     * @autor Sergio Vargas
     * @param int $idprograma identificador del programa
     * @param int $idusuario identificador del usuario
     * @param int $idempresa identificador de la empresa
     * @return Array listado de dopcumentos
     */
    public function getTipoDocumentoPerfilSuscripcion($idsuscripcion, $idprograma, $idusuario, $idempresa) {
        $parametros["idprograma"] = $idprograma;
        $parametros["idusuario"] = $idusuario;
        $parametros["idempresa"] = $idempresa;
        $parametros["idsuscripcion"] = $idsuscripcion;

        $sql = "SELECT DISTINCT
                        amfi.uni_tipdocument idtipodocumento,
                        tido.tido_nombre tipodocumento, 
                        tido.tido_maxcuounifica maximoplazo
                FROM
                fin_financiacio fin
                INNER JOIN amfi_amofinanci amfi ON amfi.fin_ideregistro = fin.fin_ideregistro
                INNER JOIN tido_tipdocumen tido ON tido.uni_tipdocument = amfi.uni_tipdocument
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = tido.est_tipdocument
                INNER JOIN prun_prgunidad prun ON amfi.uni_tipdocument = prun.uni_ideregistro
                INNER JOIN uspu_usuprgunid uspu ON prun.prun_ideregistr = uspu.prun_ideregistr
                WHERE
                 prun.prg_ideregistro = :idprograma
                 AND fin.dsus_ideregistr = :idsuscripcion
                 AND uspu.usu_ideregistro = :idusuario
                 AND esem.emp_ideregistro = :idempresa ";
        $respuesta = $this->executeQuery($sql, $parametros);
        return $respuesta;
    }
    public function consultarReunificacionRealizadasSuscripcion($idsuscripcion){
        $sql = "SELECT
                        COUNT (
                                DISTINCT fin.fin_ideunificad
                        ) cantidadpermitida
                FROM
                        fin_financiacio fin
                WHERE
                        fin.dsus_ideregistr = $idsuscripcion
                AND fin.fin_estado = 'U'
                AND fin.fin_ideunificad IN (
                        SELECT
                                fin1.fin_ideregistro
                        FROM
                                fin_financiacio fin1
                        WHERE
                                fin1.fin_ideregistro = fin.fin_ideunificad
                        AND EXTRACT (YEAR FROM(fin1.fin_fecha)) = EXTRACT (YEAR FROM now())
                );";
        $resultado = $this->executeQuery($sql);
        if(empty($resultado)){
            return 0;
        }
        return $resultado[0]['cantidadpermitida'];
    }

}
