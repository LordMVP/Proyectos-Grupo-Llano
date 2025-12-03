<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Description of ModificarRecaudoModel
 *
 * @author mebonilla
 */
class ModificarRecaudoModel extends AuditoriaServices {

    /**
     * Sesión del usuario
     * @var SessionInterface
     */
    private $sesion;

    /**
     * Constructor de la clase
     * @param Connection $conexion
     */
    public function __construct(&$conexion, &$sesion) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
    }

    /**
     * Permite realizar busquedas en la base de datos de recaudos basado en
     * datos opcionales recibidos desde la interfaz grafica, el dato del
     * municipio es de caracter obligatorio
     * @param type $municipio id del municipio
     * @param type $fechaIni fecha inicial
     * @param type $fechaFin fecha final
     * @param type $documento id documento del tercero
     * @param type $suscripcion id de la suscripcion
     * @param type $terDocumento documento del tercero
     * @param type $codigoAnterior codigo anterior de la suscripcion
     * @return array 
     */
    public function buscarRecaudo($municipio = "", $fechaIni = "", $fechaFin = "", $documento = "", $suscripcion = "", $terDocumento = "", $codigoAnterior = "", $idRecaudo = "") {
        $parametros["uni_municipio"] = $municipio;
        $complemento = "";
        $complementoBusqueda = "";
        $complementoInnerJoin = "";
        if (!empty($fechaIni) && !empty($fechaFin)) {
            $parametros["fecha_ini"] = $fechaIni;
            $parametros["fecha_fin"] = $fechaFin;
            $complemento .=" AND rec.rec_fecha BETWEEN :fecha_ini AND :fecha_fin";
        }
        if (!empty($documento)) {
            $parametros["uni_documento"] = $documento;
            $complemento .= " AND rec.uni_documento = :uni_documento";
        }
        if (!empty($suscripcion)) {
            $parametros["dsus_ideregistr"] = $suscripcion;
            $complemento .= " AND dire.dsus_ideregistr = :dsus_ideregistr";
            $complementoInnerJoin .=" INNER JOIN dire_disrecaudo dire ON rec.rec_ideregistro = dire.rec_ideregistro ";
            $complementoBusqueda .= ", dire.dsus_ideregistr ";
        }
        if (!empty($terDocumento)) {
            $parametros["ter_documento"] = $terDocumento;
            $complemento .= " AND ter.ter_documento = :ter_documento";
        }
        if (!empty($codigoAnterior)) {
            $parametros["dsus_pcodigo"] = $suscripcion;
            $complemento .= " AND dsus.dsus_pcodigo = :dsus_pcodigo";
            if (empty($suscripcion)) {
                $complementoInnerJoin .=" INNER JOIN dire_disrecaudo dire ON rec.rec_ideregistro = dire.rec_ideregistro ";
            }
            $complementoInnerJoin .= " INNER JOIN dsus_detsuscrip dsus ON dire.dsus_ideregistr = dsus.dsus_ideregistr ";
        }
        if (!empty($idRecaudo)) {
            $parametros["rec_ideregistro"] = $idRecaudo;
            $complemento .= " AND rec.rec_ideregistro = :rec_ideregistro";
        }
        $sql = "SELECT 
                    rec.rec_ideregistro idrecaudo, 
                    rec.rec_fecha fecha, 
                    rec.rec_fecpago fechapago,
                    ter.ter_documento cedula, 
                    ter.ter_nomcompleto nombre, 
                    cnre.cnre_ideregistr idconvenio, 
                    cnre.cnre_nombre convenio, 
                    rec.rec_vlrreal valor, 
                    rec.csg_ideregistro recaudoconsignado,
                    rec.uni_medpago mediopago,
                    rec.uni_municipio sucursal
                    " . $complementoBusqueda . "
                    FROM rec_recaudo rec 
                    INNER JOIN ter_tercero ter ON rec.ter_ideregistro = ter.ter_ideregistro
                    INNER JOIN cnre_cnvrecaudo cnre ON rec.cnre_ideregistr = cnre.cnre_ideregistr" . $complementoInnerJoin .
                " WHERE rec.uni_municipio = :uni_municipio 
                    AND rec.rec_estado NOT IN ('T','E','D') AND rec.rec_idepadre is NULL " . $complemento;
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * 
     * @param int $idRecaudo id del recaudo
     * @param int $idMedioPago id del medio de pago
     * @param int $idSucursal id de la sucursal
     * @param date $fechaPago fecha del pago del recaudo
     * @return int numero de filas afectadas por la actualizacion
     */
    public function modificaRecaudo($idRecaudo, $idMedioPago, $idSucursal, $fechaPago,$iddocumento) {
        $data["rec_ideregistro"] = $idRecaudo;
        $data["uni_documento"] = $iddocumento;
        $data["uni_medpago"] = $idMedioPago;
        $data["uni_municipio"] = $idSucursal;
        $data["rec_fecpago"] = $fechaPago;
        return $this->actualizarSinUsuarioConAuditoria($data, 'rec_recaudo', 'rec_ideregistro = :rec_ideregistro');
    }

    /**
     * Consulta los municipios que tiene el usuario asignado para el programa 
     * @param string $municipio caracteres de palabra para identificar el
     * municipio
     * @return array informacion de los municipios
     */
    public function autocompleteMunicipio($municipio) {
        $parametros["codempresa"] = $this->sesion->get('idempresa');
        $parametros["codusuario"] = $this->sesion->get('idusuario');
        $parametros["municipio"] = "%" . strtoupper($municipio) . "%";
        $sql = "SELECT
                    pry.proyecto_ideregistro idMunicipio, pry.proyecto_nom municipio
                FROM
                    proyectos pry
                INNER JOIN empresas emp ON emp.empresa_cod = pry.proyecto_codemp
                INNER JOIN uspr_usuprgpryto uspr ON uspr.uni_municipio = pry.proyecto_ideregistro
                WHERE
                    emp.empresa_sevemp = :codempresa
                AND uspr.usu_ideregistro = :codusuario
                AND uspr.prg_ideregistro = 65
                AND upper(pry.proyecto_nom) LIKE :municipio LIMIT 100";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta la informacion de las clases de pago para el usuario en sesion
     * @return array Informacion de las clases de pago
     */
    public function consultarClasePago() {
        $parametros["idempresa"] = $this->sesion->get('idempresa');
        $parametros["idusuario"] = $this->sesion->get('idusuario');
        $sql = "SELECT  DISTINCT
                        uni.uni_ideregistro idclase,
                        uni.uni_nombre1 clase
                FROM
                        uspu_usuprgunid uspu
                INNER JOIN prun_prgunidad prun ON prun.prun_ideregistr = uspu.prun_ideregistr
                INNER JOIN doc_documento doc ON doc.uni_documento = prun.uni_ideregistro
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = prun.uni_ideregistro
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro
                INNER JOIN rec_recaudo rec ON rec.uni_documento=doc.uni_documento
                WHERE
                  uspu.usu_ideregistro =:idusuario AND esem.emp_ideregistro =:idempresa";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Se consultas las formas de pago que tiene el recaudo 
     * @param type $idrecaudo
     * @return type
     */
    public function consultarformaspago($idrecaudo) {
        $parametros["idrecaudo"] = $idrecaudo;
        $sql = "SELECT fpre.fpre_ideregistr  idformapago , fpre.rec_ideregistro idrecaudo , fpre.fpre_vlrreal valorpagado,
               fpre.uni_forpago idtipoformapago, uni.uni_nombre1 nombretipoformapago FROM fpre_forpagreca fpre 
               INNER JOIN uni_unidad uni ON fpre.uni_forpago = uni.uni_ideregistro
               WHERE rec_ideregistro =:idrecaudo;";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta informacion adicional de la forma de pago
     * @param type $idformapago
     * @return type
     */
    public function consultarinformacionadicionalformaspago($idformapago) {
        $parametros["idformapago"] = $idformapago;
        $sql = "SELECT  infp.fpre_ideregistr idformapago  , infp.infp_informacio informacion, infp.dtip_ideregistr idbanco,
            infp.tip_ideregistro idtipoinformacion, infp.tip_nombre nompretipoinformacion   
            FROM infp_infforpago infp WHERE fpre_ideregistr =:idformapago;";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Elimina las formas de pagos de un recaudo
     * @param type $idrecaudo
     * @return type
     */
    public function eliminarFormasPagos($idrecaudo) {
        return $this->eliminar("fpre_forpagreca", "rec_ideregistro = $idrecaudo");
    }

    /**
     * Elimina la informacion de la informacion adicional de la forma de pago
     * @param type $idformapago
     * @return type
     */
    public function eliminaInformacionAdiciona($idformapago) {
        return $this->eliminar("infp_infforpago", "fpre_ideregistr =$idformapago");
    }

    /**
     * Consulta el valor real del recaudo
     * @param type $idrecaudo
     * @return type
     */
    public function consultaValorRecaudoReal($idrecaudo) {
        $parametros["idrecaudo"] = $idrecaudo;
        $sql = "SELECT rec.rec_vlrreal valorreal FROM rec_recaudo rec WHERE rec.rec_ideregistro =:idrecaudo";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0];
    }

    /**
     * inserta la forma de pago
     * @param type $formapago
     * @return type
     */
    public function insertarFormaPago($formapago) {
        $parametros = array();
        $this->setCampo($formapago, $parametros, 'idrecaudo', 'rec_ideregistro');
        $this->setCampo($formapago, $parametros, 'idtipoformapago', 'uni_forpago');
        $this->setCampo($formapago, $parametros, 'valorpagado', 'fpre_vlrreal');
        return $this->insertar($parametros, 'fpre_forpagreca', 'sq_fpre_ideregistr');
    }
    
     /**
     * Consulta los recaudos por idRecaudo
     * @param int $idRecaudo
     * @return array
     */
    public function getRecaudosIdRecaudo($idRecaudo) {
        $parametros['idrecaudo'] = $idRecaudo;
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
                        dire_sdorecaudo  valordisponible,
                        usu.usu_ideregistro idusuario,
                        usu.usuario_nom usuario, con.con_nombre nombreconcepto, null ideperiodo, null periodo
                FROM
                        rec_recaudo rec
                INNER JOIN mpa_medpago mpa ON mpa.uni_medpago = rec.uni_medpago and mpa.mpa_tipo = 'I'
                INNER JOIN proyectos pro ON rec.uni_municipio = pro.proyecto_ideregistro
                INNER JOIN uni_unidad uni ON rec.uni_medpago = uni.uni_ideregistro
                INNER JOIN doc_documento doc ON doc.uni_documento = rec.uni_documento  and doc.doc_tipo = 'AN'
                INNER JOIN usuarios usu ON usu.usu_ideregistro = rec.usu_ideregistro
                INNER JOIN dire_disrecaudo dire ON dire.rec_ideregistro = rec.rec_ideregistro
                LEFT JOIN tido_tipdocumen tido ON tido.uni_tipdocument = dire.uni_tipdocument
                LEFT JOIN doc_documento docdire ON docdire.uni_documento = dire.uni_documento
                LEFT JOIN con_concepto con ON con.uni_concepto =  dire.uni_concepto
                WHERE
                        dire.rec_ideregistro = :idrecaudo 
                AND rec.rec_idepadre IS NULL  AND rec.rec_estado IN ('A', 'G')
               AND  dire.dire_sdorecaudo > 0
               
               UNION
SELECT 
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
                        dire_sdorecaudo  valordisponible,
                        usu.usu_ideregistro idusuario,
                        usu.usuario_nom usuario, con.con_nombre nombreconcepto,
			per.per_ideregistro ideperiodo, per.per_nombre || '-' || date_part('YEAR', per.per_fecfinal) periodo
                FROM
                        rec_recaudo rec
                INNER JOIN mpa_medpago mpa ON mpa.uni_medpago = rec.uni_medpago 
                INNER JOIN proyectos pro ON rec.uni_municipio = pro.proyecto_ideregistro
                INNER JOIN uni_unidad uni ON rec.uni_medpago = uni.uni_ideregistro
                INNER JOIN doc_documento doc ON doc.uni_documento = rec.uni_documento  and doc.doc_tipo = 'AN' and doc.uni_documento = 3199
                INNER JOIN usuarios usu ON usu.usu_ideregistro = rec.usu_ideregistro
                INNER JOIN dire_disrecaudo dire ON dire.rec_ideregistro = rec.rec_ideregistro
                LEFT JOIN tido_tipdocumen tido ON tido.uni_tipdocument = dire.uni_tipdocument
                LEFT JOIN doc_documento docdire ON docdire.uni_documento = dire.uni_documento
                LEFT JOIN con_concepto con ON con.uni_concepto =  dire.uni_concepto
		LEFT JOIN per_periodo per on per.per_ideregistro = dire.per_ideaplica
                WHERE
                        dire.rec_ideregistro = :idrecaudo 
                AND rec.rec_idepadre IS NULL  AND rec.rec_estado IN ('A', 'G')
               AND  dire.dire_sdorecaudo > 0
                        ORDER BY fechapago DESC";
        return $this->executeQuery($sql, $parametros);
    }
    
      /**
     * Se consultan los tipos de documento asociados al tipo de uso de la suscripción
     * @param int $idsuscripcion identificador de la suscripción 
     * @return array 
     */
    public function obtenerTiposDocumentoPorTipoUsoModel($idsuscripcion, $idprograma, $idusuario, $idempresa) {
        $parametros["idsuscripcion"] = $idsuscripcion;
        $parametros["idprograma"] = $idprograma;
        $parametros["idusuario"] = $idusuario;
        $parametros["idempresa"] = $idempresa;
        $sql = "SELECT DISTINCT
                    tido.uni_tipdocument idtipodocumento,
                    uni.uni_nombre1 tipodocumento
                FROM dsus_detsuscrip dsus
                    INNER JOIN lius_liquso lius ON dsus.uni_tipusosuscr = lius.uni_tipusosuscr
                    INNER JOIN liq_liquidacion liq ON lius.uni_liquidacion = liq.uni_liquidacion 
                    INNER JOIN tido_tipdocumen tido ON liq.uni_tipdocument = tido.uni_tipdocument
                    INNER JOIN uni_unidad uni ON tido.uni_tipdocument = uni.uni_ideregistro
                    INNER JOIN esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro
                    INNER JOIN prun_prgunidad prun ON tido.uni_tipdocument = prun.uni_ideregistro
                    INNER JOIN uspu_usuprgunid uspu ON prun.prun_ideregistr = uspu.prun_ideregistr
                WHERE
                    dsus.dsus_ideregistr = :idsuscripcion
                    AND prun.prg_ideregistro = :idprograma
                    AND uspu.usu_ideregistro = :idusuario
                    AND esem.emp_ideregistro = :idempresa ";
        $respuesta = $this->executeQuery($sql, $parametros);
        return $respuesta;
    }
    public function validaRecaudoSet($idRecaudo) {
        $parametros["idrecaudo"] = $idRecaudo;
        $sql = "SELECT  count(*) cantidad
                FROM dsus_detsuscrip dsus 
                INNER JOIN dire_disrecaudo dire  ON dire.dsus_ideregistr = dsus.dsus_ideregistr
                INNER JOIN rec_recaudo rec ON rec.rec_ideregistro = dire.rec_ideregistro 
                INNER JOIN doc_documento doc ON doc.uni_documento = rec.uni_documento and doc.doc_aplicafes = 'S'
                INNER JOIN fac_factura fac on fac.dsus_ideregistr = dire.dsus_ideregistr AND fac.fac_estado = 'G'
                WHERE dire.rec_ideregistro = :idrecaudo";
        $respuesta = $this->executeQuery($sql, $parametros);
        return $respuesta[0];
    }
    
    public function setDistribucionRecaudo($parametros){
        $condicion = " rec_ideregistro=:rec_ideregistro and dsus_ideregistr =:dsus_ideregistr ";
        return $this->actualizar($parametros, 'dire_disrecaudo', $condicion) ;      
    }

}
