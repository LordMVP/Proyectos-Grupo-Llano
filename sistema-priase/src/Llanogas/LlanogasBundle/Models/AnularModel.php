<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AnularModel
 *
 * @author hrey
 */
class AnularModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    /**
     * Buscar un recaudo  por: idrecaudo,idsuscriptor,idsuscripcion, y rango de fechas.
     * @param int $idRecaudo idrecaudo
     * @param int $idSuscriptor idsuscriptor
     * @param int $idSuscripcion idsuscripcion
     * @param date $fechaInicio fechainicio
     * @param date $fechaFin fechafin
     * @return array con la información de los recaudos encontrados.
     */
    public function buscarRecaudos($idRecaudo = "", $idSuscriptor = "", $idSuscripcion = "", $fechaInicio = "", $fechaFin = "", $codigoAnterior = "", $idEmpresa = null) {
        if (empty($idEmpresa)) {
            throw new MyException('El identificador de la empresa es obligatorio', -1);
        }
        $parametros ['idempresa'] = $idEmpresa;
        $complemento = "AND (rec.emp_ideregistro=:idempresa OR dsus.emp_ideregistro=:idempresa )";
        if (!empty($idRecaudo)) {
            $complemento .= 'AND rec.rec_ideregistro=:idrecaudo ';
            $parametros['idrecaudo'] = $idRecaudo;
        }
        if (!empty($fechaInicio) && !empty($fechaFin)) {
            $complemento .= 'AND rec.rec_fecha between :fechainicio::TIMESTAMP and :fechafin::TIMESTAMP ';
            $parametros['fechainicio'] = $fechaInicio;
            $parametros['fechafin'] = $fechaFin;
        }
        if (!empty($idSuscripcion)) {
            $complemento .= 'AND dire.dsus_ideregistr = :idsuscripcion ';
            $parametros['idsuscripcion'] = $idSuscripcion;
        }
        if (!empty($idSuscriptor)) {
            $complemento .= 'AND sus.sus_ideregistro = :idsuscriptor ';
            $parametros['idsuscriptor'] = $idSuscriptor;
        }
        if (!empty($codigoAnterior)) {
            $complemento .= 'AND dsus.dsus_pcodigo = :codigoanterior ';
            $parametros['codigoanterior'] = $codigoAnterior;
        }

        $sql = "SELECT DISTINCT 
                           rec.rec_ideregistro idrecaudo, 
                           rec.rec_fecha fecha, 
                           rec.sus_ideregistro idsuscriptor,
                           rec.uni_documento iddocumento,
                           doc.doc_nombre documento,
                           ter.ter_documento terdocumento, 
                           ter.ter_nomcompleto ternombrecompleto,
                           cnre.cnre_ideregistr idconvenio,
                           cnre.cnre_nombre nombreconvenio,
                           rec.rec_vlrreal valor,
                           rec.rec_version as version
                      FROM 
                           rec_recaudo rec inner join sus_suscripcion sus on rec.sus_ideregistro = sus.sus_ideregistro
                           inner join dire_disrecaudo dire on dire.rec_ideregistro=rec.rec_ideregistro
                           inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=dire.dsus_ideregistr
                           inner join ter_tercero ter on ter.ter_ideregistro = sus.ter_ideregistro
                           inner join cnre_cnvrecaudo cnre on rec.cnre_ideregistr = cnre.cnre_ideregistr
                           inner join doc_documento doc on rec.uni_documento = doc.uni_documento
                     WHERE rec.rec_vlrreal > 0 AND rec.rec_estado NOT IN ('E','D','T')  $complemento ORDER BY rec.rec_fecha";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Busca los motivos de suspensión de notas.
     * @return array Listado de motivos.
     */
    public function buscarMotivos() {
        try {
            $sql = "SELECT 
                            uu.uni_ideregistro id, 
                            uu.uni_nombre1 nombre
                      FROM 
                            public.uni_unidad uu INNER JOIN est_estructura ee
                            ON uu.est_ideregistro = ee.est_ideregistro 
                     WHERE 
                            ee.est_ideregistro = " . ESTRUCTURA_NOTA;
            $this->setSql($sql);
            $resultado = $this->execute();
            return $resultado;
        } catch (MyException $exc) {
            echo $exc;
        }
    }

    /**
     * Busca una suscripción dependiendo de un recaudo.
     * @param int $idRecaudo identificador del recaudo
     * @return array listado de suscripciones que fueron afectados por un recaudo.
     */
    public function buscarSuscripcionesRecaudo($idRecaudo) {
        try {
            $sql = "SELECT
                        dsus.dsus_ideregistr idsuscripcion,
                        dsus.dsus_pcodigo codigoanterior,
                        dsus.uni_tipsuscripc idtiposuscripcion,
                        uni.uni_nombre1 tiposuscripcion
                    FROM
                            dire_disrecaudo dire
                    INNER JOIN dsus_detsuscrip dsus ON dire.dsus_ideregistr = dsus.dsus_ideregistr
                    INNER JOIN uni_unidad uni ON dsus.uni_tipsuscripc = uni.uni_ideregistro
                    WHERE
                            dire.rec_ideregistro = $idRecaudo;";
            $this->setSql($sql);
            $resultado = $this->execute();
            return $resultado;
        } catch (Exception $exc) {
            echo $exc;
        }
    }

    /**
     * Buscar las facturas que afectó un recaudo
     * @param int $idRecaudo Identificador del recaudo.
     * @return array listado de facturas.
     */
    public function buscarFacturasRecaudo($idRecaudo) {
        try {
            $sql = "SELECT
                            fac.fac_ideregistro idfactura,
                            fac.fac_numero numerofactura,
                            fac.fac_fecvence fechavencimiento,
                            fac.dsus_ideregistr idsuscripcion,
                            dsus.uni_tipsuscripc idtiposuscripcion,
                            uni.uni_nombre1 tiposuscripcion,
                            SUM (drec.drec_vlrreal) totalpagadorecaudo,
                            cic.cic_nombre || ' - '|| per.per_nombre as cicloperiodo
                    FROM
                            fac_factura fac
                    INNER JOIN dsus_detsuscrip dsus ON fac.dsus_ideregistr = dsus.dsus_ideregistr
                    INNER JOIN drec_detrecaudo drec ON drec.fac_ideregistro = fac.fac_ideregistro
                    INNER JOIN uni_unidad uni ON dsus.uni_tipsuscripc = uni.uni_ideregistro
                    INNER JOIN cic_ciclo cic on fac.cic_ideregistro=cic.cic_ideregistro
                    INNER JOIN per_periodo per on fac.per_ideregistro=per.per_ideregistro
                    WHERE
                            drec.rec_ideregistro = $idRecaudo
                    GROUP BY
                            fac.fac_ideregistro,
                            fac.fac_numero,
                            fac.fac_fecvence,
                            fac.dsus_ideregistr,
                            dsus.uni_tipsuscripc,
                            uni.uni_nombre1,
                            cicloperiodo
                    ORDER BY idfactura";
            $this->setSql($sql);
            $resultado = $this->execute();
            return $resultado;
        } catch (Exception $exc) {
            echo $exc;
        }
    }

    /**
     * Busca los conceptos de las facturas asociadas a un recaudo.
     * @param int $idRecaudo identificador del recaudo.
     * @return array listado de conceptos
     */
    public function buscarConceptosFacturasRecaudos($idRecaudo) {
        try {
            $sql = "SELECT
                            dfac.fac_ideregistro idfactura,
                            dfac.dfac_ideregistr idconcepto,
                            con.con_nombre descripcion,
                            SUM (drec.drec_vlrreal) valorpagado
                    FROM
                            drec_detrecaudo drec
                    INNER JOIN dfac_detfactura dfac ON drec.dfac_ideregistr = dfac.dfac_ideregistr
                    INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                    WHERE
                            drec.rec_ideregistro = $idRecaudo
                    GROUP BY
                            dfac.fac_ideregistro,
                            dfac.dfac_ideregistr,
                            con.con_nombre
                    ORDER BY idfactura;";
            $this->setSql($sql);
            $resultado = $this->execute();
            return $resultado;
        } catch (Exception $exc) {
            echo $exc;
        }
    }

    /**
     * Busca los conceptos de las facturas asociadas a un recaudo.
     * @param int $idRecaudo identificador del recaudo.
     * @return array listado de conceptos
     */
    public function buscarConceptosRecaudos($idRecaudo) {
        try {
            $sql = "SELECT
                            uni_concepto idconcepto,
                            uni_nombre1 descripcion,
                            SUM (dire_vlrrecaudo) valorpagado
                    FROM
                            dire_disrecaudo dire
                    INNER JOIN uni_unidad uni ON dire.uni_concepto = uni.uni_ideregistro
                    WHERE
                            rec_ideregistro = $idRecaudo
                    GROUP BY
                            uni_concepto,
                            uni_nombre1;";
            $this->setSql($sql);
            $resultado = $this->execute();
            return $resultado;
        } catch (Exception $exc) {
            echo $exc;
        }
    }

    /**
     * Consulta las formas de pago, que esten asociadas a un recaudo.
     * @param int $idRecaudo identificador del recaudo
     * @return array listado de las formas de pagos existentes.
     */
    public function buscarFormasPago($idRecaudo) {
        try {
            $sql = "SELECT 
                        fpre.fpre_ideregistr idformapagorecaudo,
                        fpre.uni_forpago idformapago,   
                        uni.uni_nombre1 formapago, 
                        fpre.fpre_vlrreal valorreal
                   FROM 
                        fpre_forpagreca fpre inner join  rec_recaudo rec on rec.rec_ideregistro = fpre.rec_ideregistro 
                        inner join uni_unidad uni on fpre.uni_forpago = uni.uni_ideregistro
                   WHERE 
                        rec.rec_ideregistro = $idRecaudo";
            $this->setSql($sql);
            $resultado = $this->execute();
            return $resultado;
        } catch (Exception $exc) {
            echo $exc;
        }
    }

    /**
     * Consulta el detalle de un recaudo
     * @param int $idRecaudo
     * @return array Listado de los detalles
     */
    public function obtenerDetalleRecaudo($idRecaudo) {
        try {
            $sql = "SELECT
                        drec_ideregistr, rec_ideregistro,
                        drec_vlrtotal, drec_vlrreal,
                        drec_fecha,drec_ideorigen,fac_ideregistro,
                        cic_ideregistro,per_ideregistro,
                        uni_documento,uni_tipdocument,
                        dfac_ideregistr,dire_ideregistr,
                        drec_idepadre
                    FROM
                        drec_detrecaudo
                    WHERE
                        rec_ideregistro = $idRecaudo;";
            $this->setSql($sql);
            $resultado = $this->execute();
            return $resultado;
        } catch (Exception $exc) {
            echo $exc;
        }
    }

    /**
     * Obtiene la información adicional de un recaudo
     * @param int $idFormaPagoRecaudo identificador del recaudo
     * @return array Listado de la información adicional registrada al recaudo.
     */
    public function buscarInfoAdicional($idFormaPagoRecaudo) {
        $sql = "SELECT 
                  infp_infforpago.infp_ideregistr idinfo, 
                  infp_infforpago.infp_ideregistr idinformapago, 
                  infp_infforpago.infp_informacio informacion, 
                  infp_infforpago.infp_informacio nombre, 
                  infp_infforpago.infp_estado estado, 
                  infp_infforpago.fpre_ideregistr idformapagorecaudo, 
                  infp_infforpago.fpre_ideregistr idregistro, 
                  infp_infforpago.tip_nombre forma,
                  infp_infforpago.tip_nombre formapago
                FROM 
                  infp_infforpago
                WHERE fpre_ideregistr = $idFormaPagoRecaudo;";
        $this->setSql($sql);
        $resultado = $this->execute();
        return $resultado;
    }

    /**
     * Agrega una nueva nota
     * @param array $nota  información de la nota que se quiere agregar
     * @return bool TRUE se inserto FALSE Error al insertar
     */
    public function insertarNota($nota) {
        $parametros['not_fecha'] = "now()";
        $parametros['cic_ano'] = $nota['cicloanio'];
        $parametros['not_comentario'] = $nota['comentario'];
        $parametros['uni_motnota'] = $nota['idmotivo'];
        $parametros['dsus_ideregistr'] = $nota['idsuscripcion'];
        $parametros['cic_ideregistro'] = $nota['idciclo'];
        $parametros['per_ideregistro'] = $nota['idperiodo'];
        $parametros['emp_ideregistro'] = $nota['idempresa'];
        $parametros['usu_ideregistro'] = $nota['idusuario'];
        $parametros['est_motnota'] = ESTRUCTURA_NOTA;
        return $this->insertar($parametros, 'not_nota', 'sq_not_ideregistro');
    }

    /**
     * Actualiza el estado del recaudo
     * @param int $idRecaudo Identificador del recaudo.
     * @param string $estado Estado del recaudo que se quiere aplicar
     * @return bool TRUE se actualizó FALSE error
     */
    public function actualizarEstadoRecaudo($idRecaudo, $estado) {

        $sql = "SELECT
                  rec.rec_ideregistro idrecaudo,
                  csg.csg_ideregistro idconsignacion
                FROM
                 rec_recaudo rec
                LEFT JOIN csg_consignacion csg ON rec.csg_ideregistro = csg.csg_ideregistro AND csg.csg_estado IN( 'P','A')
                WHERE
                  rec.rec_ideregistro = $idRecaudo";
        $resultado = $this->executeQuery($sql)[0];
        if (!empty($resultado['idconsignacion'])) {
            throw new MyException('El recaudo está en consignación', -1);
        }
        $sqlRC = "SELECT count(*) cantidad
                FROM fac_factura fac 
                     INNER JOIN drec_detrecaudo drec ON drec.fac_ideregistro=fac.fac_ideregistro
                     INNER JOIN fac_factura fap  ON fac.fac_ideregistro=fap.fac_ideorigen
                     INNER JOIN fac_factura facr ON fap.fac_ideregistro=facr.fac_idepadre
                WHERE
                   drec.rec_ideregistro=$idRecaudo and fac.fac_estado =  'P'";
        $resultadoRC = $this->executeQuery($sqlRC)[0]['cantidad'];
        if (!empty($resultadoRC)) {
            throw new MyException('La factura tiene una provisión', -1);
        }
        return $this->modificarEstadoRecaudo($idRecaudo, $estado);
    }

    public function modificarEstadoRecaudo($idRecaudo, $estado) {
        $parametros['rec_ideregistro'] = $idRecaudo;
        $parametros['rec_estado'] = $estado;
        return $this->actualizar($parametros, 'rec_recaudo', 'rec_ideregistro=:rec_ideregistro');
    }

    /**
     * Consulta los documento y tipos de documentos asociados a un recaudo
     * @param int $idRecaudo identificador del recaudo.
     * @return array Listado de los documentos y tipos de docuementos.
     */
    public function consultarDocumentoTipoDocumentoPorRecaudo($idRecaudo, $idSuscripcion) {
        $parametros['idrecaudo'] = $idRecaudo;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = '
           select 
            dire.dsus_ideregistr idsuscripcion, drec.uni_documento iddocumento,
            drec.uni_tipdocument idtipodocumento,sum(drec_vlrreal) valor,
            drec.rec_ideregistro idrecaudo,
            dire.dire_ideregistr iddistribucion
           from drec_detrecaudo drec inner join dire_disrecaudo dire on drec.dire_ideregistr=dire.dire_ideregistr
           where drec.rec_ideregistro=:idrecaudo AND dire.dsus_ideregistr=:idsuscripcion
           group by dire.dsus_ideregistr,drec.uni_documento,drec.uni_tipdocument,drec.rec_ideregistro,dire.dire_ideregistr';
        $resultado = $this->executeQuery($sql, $parametros);
        if (!empty($resultado)) {
            return $resultado;
        }
        $sql = 'select 
              dire.dsus_ideregistr idsuscripcion, rec.uni_documento iddocumento,
              dire.uni_tipdocument idtipodocumento,dire_vlrrecaudo valor,
              dire.rec_ideregistro idrecaudo,
              dire.dire_ideregistr iddistribucion
            from dire_disrecaudo dire INNER JOIN rec_recaudo rec ON dire.rec_ideregistro=rec.rec_ideregistro
            WHERE dire.dsus_ideregistr=:idsuscripcion AND dire.rec_ideregistro=:idrecaudo';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Genera una nueva distribución de acuerdo a la anulación.
     * @param array $detalleDocumentoTipo  documentos y tipos de documentos para la 
     * nueva distribución.
     * @param int $idDocumentoRecaudo identificador del nuevo recaudo.
     * @param array $parametros información del ciclo y periodo actual.
     * @param int $idDistribucion Identificador de la distribución de origen. 
     * @return bool TRUE se actualizó FALSE error
     */
    public function insertarDistribucionNuevoDocumento($detalleDocumentoTipo, $idDocumentoRecaudo, $parametros, $idDistribucion) {
        $distribucionActual = $this->consultarDistribucionPorId($idDistribucion);
        $informacionRecaudoActual = $this->getGenericoModel()->getRecaudo($idDocumentoRecaudo);
        $data['dire_vlrrecaudo'] = $detalleDocumentoTipo['valor'] * -1;
        $data['dire_sdorecaudo'] = 0;
        $data['rec_ideregistro'] = $idDocumentoRecaudo;
        $data['dicn_ideregistr'] = $informacionRecaudoActual['convenio'];
        $data['dsus_ideregistr'] = $parametros['idsuscripcion'];
        $data['per_ideregistro'] = $parametros['idperiodo'];
        $data['cic_ideregistro'] = $parametros['idciclo'];
        $data['emp_ideregistro'] = $distribucionActual['emp_ideregistro'];
        $data['uni_tipdocument'] = $distribucionActual['uni_tipdocument'];
        $data['cic_ano'] = $parametros['cicloanio'];
        $data['usu_ideregistro'] = $parametros['idusuario'];
        return $this->insertar($data, 'dire_disrecaudo', 'sq_dire_ideregistr');
    }

    /**
     * Crea un  detalle del recaudo.
     * @param array $detalleRecaudoAntiguo información del detalle de recaudo origen.
     * @param int $idDocumentoRecaudo identificador del nuevo recaudo.
     * @param array $detalleNuevoDocumentoNota información del nuevo documento.
     * @return bool TRUE se actualizó FALSE error
     */
    public function crearDocumentoDetalleRecaudo($detalleRecaudoAntiguo, $idDocumentoRecaudo, $detalleNuevoDocumentoNota, $parametros, $idDistribucionNuevo) {
        $datos['rec_ideregistro'] = $idDocumentoRecaudo;
        $datos['drec_vlrtotal'] = $detalleRecaudoAntiguo['drec_vlrtotal'];
        $datos['drec_vlrreal'] = $detalleRecaudoAntiguo['drec_vlrreal'] * -1;
        $datos['drec_fecha'] = $detalleRecaudoAntiguo['drec_fecha'];
        $datos['drec_ideorigen'] = $detalleRecaudoAntiguo['drec_ideregistr'];
        $datos['fac_ideregistro'] = $detalleRecaudoAntiguo['fac_ideregistro'];
        $datos['cic_ideregistro'] = $detalleRecaudoAntiguo['cic_ideregistro'];
        $datos['per_ideregistro'] = $detalleRecaudoAntiguo['per_ideregistro'];
        $datos['uni_documento'] = $detalleNuevoDocumentoNota['iddocumento'];
        $datos['uni_tipdocument'] = $detalleRecaudoAntiguo['uni_tipdocument'];
        $datos['dfac_ideregistr'] = $detalleRecaudoAntiguo['dfac_ideregistr'];
        $datos['dire_ideregistr'] = $idDistribucionNuevo;
        $datos['cic_ano'] = $parametros['cicloanio'];
        $datos['usu_ideregistro'] = $parametros['idusuario'];
        return $this->insertar($datos, 'drec_detrecaudo', 'sq_drec_ideregistr');
    }

    /**
     * Crea un nuevo recaudo apartir de otro.
     * @param array $parametros información del recaudo origen.
     * @param array $detalleDocumentoTipo información del documento origen que se quiere anular.
     * @param type $detalleNuevoDocumentoNota información del nuevo documento para generar la cancelación del nuevo
     * recaudo
     * @return int identificador del nuevo recaudo.
     */
    public function crearDocumentoRecaudo($parametros, $detalleDocumentoTipo, $detalleNuevoDocumentoNota) {
        $informacionRecaudoActual = $this->getGenericoModel()->getRecaudo($parametros['idrecaudo']);
        $data['rec_fecha'] = 'now()';
        $data['rec_estado'] = 'A';
        $data['rec_fecpago'] = 'now()';
        $data['rec_vlrpagado'] = $detalleDocumentoTipo['valor'];
        $data['rec_vlrcambio'] = 0;
        $data['rec_vlrajuste'] = 0;
        $data['rec_vlrreal'] = $detalleDocumentoTipo['valor'] * -1;
        $data['uni_medpago'] = $informacionRecaudoActual['mediopago'];
        $data['cnre_ideregistr'] = $informacionRecaudoActual['convenio'];
        $data['emp_ideregistro'] = $parametros['idempresa'];
        $data['sus_ideregistro'] = $informacionRecaudoActual['idsuscriptor'];
        $data['ter_ideregistro'] = $informacionRecaudoActual['idtercero'];
        $data['uni_documento'] = $detalleNuevoDocumentoNota['iddocumento'];
        $data['rec_ideorigen'] = $parametros['idrecaudo'];
        $data['rec_idepadre'] = $parametros['idrecaudo'];
        $data['usu_ideregistro'] = $parametros['idusuario'];
        $data['uni_municipio'] = $informacionRecaudoActual['idsucursal'];
        $idDocumentoRecaudo = $this->insertar($data, 'rec_recaudo', 'sq_rec_ideregistro');
        return $idDocumentoRecaudo;
    }

    /**
     * Ingresa una nota a un recaudo
     * @param array $datos información de la nota
     * @return bool TRUE se actualizó FALSE error
     */
    public function insertarNotaRecaudo($datos) {
        $data['not_ideregistro'] = $datos['idnota'];
        $data['drec_ideorigen'] = $datos['iddetallerecaudoantiguo'];
        $data['rec_ideorigen'] = $datos['idrecaudoantiguo'];
        $data['rec_ideregistro'] = $datos['idrecaudo'];
        $data['drec_ideregistr'] = $datos['iddetallerecaudo'];
        $data['usu_ideregistro'] = $datos['idusuario'];
        return $this->insertar($data, 'nore_notrecaudo', 'sq_nore_ideregistr');
    }

    /**
     * Consulta los documentos a generar dependiendo de un documento y tipo de documento.
     * @param int $idDocumento Identificador del documento origen.
     * @param int $idTipoDocumento identificador del tipo documento origen
     * @return array Información del documento y tipo de documentos destino.
     */
    public function consultarDocumentoNota($idDocumento, $idTipoDocumento) {
        $genericoModel = $this->getGenericoModel();
        return $genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($idDocumento, $idTipoDocumento, 'ED');
    }

    /**
     * Obtiene la información detallada de un recaudo por documento, tipo documento y suscripción.
     * @param array $datos información con los parámetros.
     * @return array Listado de los detalles.
     */
    public function consultarDetallesRecaudo($datos) {
        $sql = '
        select drec.* 
	from drec_detrecaudo drec inner join dire_disrecaudo dire on drec.dire_ideregistr=dire.dire_ideregistr
	where 
         drec.rec_ideregistro=:idrecaudo and drec.uni_documento=:iddocumento and drec.uni_tipdocument=:idtipodocumento
	 and dire.dsus_ideregistr=:idsuscripcion';
        $this->setSql($sql);
        $this->setParametros($datos);
        return $this->execute();
    }

    /**
     * Actualiza las distribuciones del recaudo en 0, cuando se ha anulado.
     * @param array $distribuciones
     */
    public function actualizarDisponiblesRecaudo($distribuciones) {
        foreach ($distribuciones as $distribucion) {
            $data['dire_ideregistr'] = $distribucion['iddistribucion'];
            $data['dire_sdorecaudo'] = 0;
            $this->actualizar($data, 'dire_disrecaudo', 'dire_ideregistr=:dire_ideregistr');
        }
    }

    /**
     * Consulta la distribución del recaudo entre varias suscripciones.
     * @param int $idRecaudo identificador del recaudo.
     * @return array Consulta las suscripciones que fueron afectadas por un recaudo.
     */
    public function consultarDistribucionPorRecaudo($idRecaudo) {
        $parametros['idrecaudo'] = $idRecaudo;
        $sql = 'select dire_ideregistr iddistribucion,dire_sdorecaudo saldo,dsus_ideregistr idsuscripcion from dire_disrecaudo where rec_ideregistro=:idrecaudo  ';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Obtiene la información de la distribución 
     * @param int $idDistribucion identificador de una distribución del recaudo.
     * @return array Detalle de la distribución de un recaudo.
     */
    public function consultarDistribucionPorId($idDistribucion) {
        $parametros['iddistribucion'] = $idDistribucion;
        $sql = 'select * from dire_disrecaudo where dire_ideregistr=:iddistribucion';
        $this->setSql($sql);
        $this->setParametros($parametros);
        $resultado = $this->execute();
        return $resultado[0];
    }

    /**
     * Genera una instancia del objeto generico model.
     * @return \Llanogas\LlanogasBundle\Models\GenericoModel objeto del generico model.
     */
    private function getGenericoModel() {
        $genericoModel = new GenericoModel();
        $genericoModel->setConexion($this->conexion);
        return $genericoModel;
    }

    public function getDistribucion($idRecaudo) {
        $parametros['idrecaudo'] = $idRecaudo;
        $sql = "select 
                    dire.dsus_ideregistr idsuscripcion, dire.dire_sdorecaudo disponible,
                    dire.dire_vlrrecaudo valor,dire.per_ideregistro idperiodo, dire.cic_ideregistro idciclo,
                    cic.cic_nombre || ' ' || per.per_nombre cicloperiodo, dsus.dsus_pcodigo codigoanterior
                from 
                    dire_disrecaudo dire inner join cic_ciclo cic on dire.cic_ideregistro=cic.cic_ideregistro
                    inner join per_periodo per on dire.per_ideregistro=per.per_ideregistro
                    inner join dsus_detsuscrip dsus on dire.dsus_ideregistr=dsus.dsus_ideregistr
                where
                    dire.rec_ideregistro=:idrecaudo";
        return $this->executeQuery($sql, $parametros);
    }

    public function getFacturasRecaudo($idRecaudo) {
        $parametros['idrecaudo'] = $idRecaudo;
        $sql = 'select distinct drec.fac_ideregistro idfactura, fac.fac_version as version, fac.fac_estado estado 
              from drec_detrecaudo drec inner join fac_factura fac on drec.fac_ideregistro=fac.fac_ideregistro
              where drec.rec_ideregistro=:idrecaudo';
        return $this->executeQuery($sql, $parametros);
    }

}
