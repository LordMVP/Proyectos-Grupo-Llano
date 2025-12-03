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
 * Description of CondonarCarteraCorrienteModel
 *
 * @author mebonilla
 */
class CondonarCarteraCorrienteModel extends AuditoriaServices {

    /**
     *
     * @var SessionInterface 
     */
    private $sesion;

    /**
     *
     * @var GenericoModel
     */
    private $genericoModel;

    /**
     * Constructor de la clase
     * @param Connection $conexion
     */
    public function __construct(&$conexion, &$sesion = null) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
        $this->genericoModel = new GenericoModel($conexion);
    }

    /**
     * Consulta la información de municipios disponibles segun el id del usuario logueado en la 
     * aplicacion y el id de la empresa a la que pertenece, ademas de coincidir con el contenido
     * digitado en el campo de texto
     * @param string $municipio texto del municipio digitado
     * @return array lista de municipios que coinciden con el parametro de busqueda
     */
    public function consultarMunicipios($municipio) {
        $parametros["codempresa"] = $this->sesion->get("idempresa");
        $parametros["codusuario"] = $this->sesion->get("idusuario");
        $parametros["idprograma"] = PROGRAMA_CONDONAR_CARTERA_CORRIENTE;
        $parametros["municipio"] = "%" . strtoupper($municipio) . "%";
        $sql = "SELECT
                    pry.proyecto_ideregistro::integer idMunicipio, pry.proyecto_nom municipio
                FROM
                    proyectos pry
                INNER JOIN empresas emp ON emp.empresa_cod = pry.proyecto_codemp
                INNER JOIN uspr_usuprgpryto uspr ON uspr.uni_municipio = pry.proyecto_ideregistro
                WHERE
                    emp.empresa_sevemp = :codempresa
                AND uspr.usu_ideregistro = :codusuario
                AND uspr.prg_ideregistro = :idprograma
                AND upper(pry.proyecto_nom) LIKE :municipio LIMIT 100";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta las facturas con una fecha de vencimiento de al menos 3 meses 
     * @param type $idSuscripcion id de la suscripcion
     * @return type
     */
    public function consultarFacturasCarteraCorriente($idSuscripcion) {
        $parametros["dsus_ideregistr"] = $idSuscripcion;
        $parametros["usu_ideregistro"] = $this->sesion->get("idusuario");

       $sql = "SELECT   DISTINCT fac.fac_fecha,
                    fac.fac_ideregistro idfactura,
                    fac.fac_fecvence fechavencimiento,
                    fac.fac_numero numerofactura,
                    cic.cic_nombre ciclo,
                    per.per_nombre periodo,
                    fac.cic_ano ano,
                    fac.fac_vlrreal valorreal,
                    fac.fac_sdoreal saldo,
                    fac.fac_vlrreal - fac.fac_sdoreal valorpagado
                FROM
                    fac_factura fac
                INNER JOIN dsus_detsuscrip dsus ON fac.dsus_ideregistr = dsus.dsus_ideregistr
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = fac.cic_ideregistro
                INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro = fac.fac_ideregistro
	   INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                INNER JOIN per_periodo per ON per.per_ideregistro = fac.per_ideregistro
                WHERE
                    fac.fac_sdoreal > 0 
	   and fac.uni_documento = 30
                AND fac.fac_fecha <= (now() - INTERVAL '1 months')
                AND fac.fac_estado IN ('A')  AND fac.fac_idepadre is null
                AND con.con_condonable = 'S' and dfac.dfac_sdoreal > 0
                AND dsus.dsus_ideregistr = :dsus_ideregistr 
	   order by fac.fac_fecha,fac.fac_ideregistro ,
                    fac.fac_fecvence ,
                    fac.fac_numero ,
                    cic.cic_nombre ,
                    per.per_nombre ,
                    fac.cic_ano   asc";
        	$resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Crea un nuevo registro en la tabla not_nota al momento de crear una condonacion
     * @param type $parametros parametros de la nota de condonacion
     * @return int id de registro de la nota de condonacion
     */
    public function registrarNotaCondonacion($parametros) {
        $data["not_fecha"] = "now()";
        $data["not_comentario"] = $parametros["descripcion"];
        $data["uni_motnota"] = $parametros["idmotivo"];
        $data["dsus_ideregistr"] = $parametros["idsuscripcion"];
        $data["cic_ideregistro"] = $parametros["idciclo"];
        $data["per_ideregistro"] = $parametros["idperiodo"];
        $data["est_motnota"] = ESTRUCTURA_NOTA;
        $data["emp_ideregistro"] = $this->sesion->get("idempresa");
        $data["cic_ano"] = $parametros["cicanio"];
        $data["usu_ideregistro"] = $this->sesion->get("idusuario");
        return $this->insertar($data, "not_nota", "sq_not_ideregistro");
    }

    /**
     * Consulta los motivos para notas segun el id de la estructura
     * @return array informcion de los motivos de la nota
     */
    public function consultarMotivosNota() {
        $parametros = array();
        $sql = "SELECT
                    uni.uni_ideregistro id,
                    uni.uni_nombre1 nombre
                FROM
                    uni_unidad uni
                WHERE
                    uni.est_ideregistro = ".ESTRUCTURA_NOTA;
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta los conceptos condonables de una factura
     * @param int $idFactura id de la factura
     * @return array informacion de los conceptos condonables de la factura
     */
    public function consultarConceptosCondonables($idFactura) {
        $parametros["fac_ideregistro"] = $idFactura;
        $complemento = "WHERE con.con_condonable = 'S' and dfac.dfac_sdoreal > 0 and fac.fac_ideregistro = :fac_ideregistro";
        return $this->genericoModel->getConceptosInformacion($complemento, $parametros);
    }

    /**
     * Consulta los conceptos no condonables de una factura
     * @param int $idFactura id de la factura
     * @return array informacion de los conceptos no condonables de la factura
     */
    public function consultarConceptosNoCondonables($idFactura) {
        $parametros["fac_ideregistro"] = $idFactura;
        $complemento = "WHERE con.con_condonable = 'N' and dfac.dfac_sdoreal > 0 and fac.fac_ideregistro = :fac_ideregistro";
        return $this->genericoModel->getConceptosInformacion($complemento, $parametros);
    }

    /**
     * Consulta la informacion completa de una suscripcion segun su id
     * @param int $idSuscripcion id de la suscripcion
     * @return array informacion de la suscripcion
     */
    public function consultarInformacionSuscripcion($idSuscripcion) {
        $parametros["idsuscripcion"] = $idSuscripcion;
        $parametros["idempresa"] = $this->sesion->get('idempresa');
        $suscripcion = $this->genericoModel->getSuscripcion($parametros, $this->sesion->get("idusuario"));
        if (empty($suscripcion)) {
            return $suscripcion;
        }
        return $suscripcion[0];
    }

    /**
     * Obtiene informacion adicional de la liquidacion de una suscripcion
     * @param int $idliquidacion id de la liquidacion
     * @return array informacion de la liquidacion
     */
    public function consultarInfoLiquidacion($idliquidacion) {
        $parametros["uni_liquidacion"] = $idliquidacion;
        $sql = "SELECT
                    liq.uni_documento iddocumento,
                    liq.uni_tipdocument idtipodocumento
                FROM
                    liq_liquidacion liq
                WHERE
                    liq.uni_liquidacion = :uni_liquidacion";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta el id del documento que debe usarse para la nota de factura de
     * una condonacion
     * @param int $idDocumento id del documento
     * @param int $idTipoDocumento id del tipo de documento
     * @return array informacion del id del documento de condonacion
     */
    public function consultarIdDocumentoCondonacion($idDocumento, $idTipoDocumento) {
        $parametros["uni_documento"] = $idDocumento;
        $parametros["uni_tipdocument"] = $idTipoDocumento;
        $sql = "SELECT
                    ddot.uni_documento iddocumento
                FROM
                    ddot_detdoctipo ddot
                    INNER JOIN doti_doctipo doti 
                    ON ddot.doti_ideregistr = doti.doti_ideregistr                   
                WHERE
                    doti.uni_documento = :uni_documento
                    AND doti.uni_tipdocument = :uni_tipdocument
                    AND ddot.ddot_tipo LIKE 'NO'";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta el id del documento que debe usarse para la nota de factura de
     * una recuperacion
     * @param int $idDocumento id del documento
     * @param int $idTipoDocumento id del tipo de documento
     * @return array informacion del id del documento de recuperacion
     */
    public function consultarIdDocumentoRecuperacion($idDocumento, $idTipoDocumento) {
        $parametros["uni_documento"] = $idDocumento;
        $parametros["uni_tipdocument"] = $idTipoDocumento;
        $sql = "SELECT
                    ddot.uni_documento iddocumento
                FROM
                    ddot_detdoctipo ddot
                    INNER JOIN doti_doctipo doti
                    ON ddot.doti_ideregistr = doti.doti_ideregistr
                WHERE
                    doti.uni_documento = :uni_documento
                    AND doti.uni_tipdocument = :uni_tipdocument
                    AND ddot.ddot_tipo LIKE 'RP'";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Permite afectar nofa para enlazar las facturas con las notas
     * @param type $infofactura informacion de la nota
     */
    public function crearNotaModel($infofactura) {
        $parametros['not_ideregistro'] = $infofactura['idnota'];
        $parametros['fac_ideregistro'] = $infofactura['idfacturanota'];
        $parametros['dfac_ideregistr'] = $infofactura['iddetallefacturanota'];
        $parametros['fac_ideorigen'] = $infofactura['idfacturaoriginal'];
        $parametros['dfac_ideorigen'] = $infofactura['iddetallefacturaoriginal'];
        $parametros['usu_ideregistro'] = $infofactura['idusuario'];
        $this->insertar($parametros, 'nofa_notfactura', 'sq_nofa_ideregistr');
    }

    /**
     * Consulta el concepto de recuperacion para una provision
     * @param type $idFactura id de la factura provisionada
     * @param type $idConceptoOrigen id del concepto provisionado
     * @return type
     */
    public function consultarConceptoRecuperacion($idFactura, $idConceptoOrigen) {
        $parametros["dfac_ideorigen"] = $idConceptoOrigen;
        $parametros["fac_ideregistro"] = $idFactura;
        $sql = "SELECT
                    dfac.dfac_ideregistr iddetallefactura,
                    dfac.dfac_vlrreal valorreal,
                    dfac.uni_concepto idconcepto
                FROM    
                    dfac_detfactura dfac
                WHERE
                    dfac.dfac_ideorigen = :dfac_ideorigen
                    AND dfac.fac_ideregistro = :fac_ideregistro";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

     /**
     * Obtiene permisos para activar botones de seleccionar facturas de cartera corriente
     * @param array con  $idprograma id del programa, $idestructura ide de la estructura, idusuario e idempresa
     * @return array informacion de las unidades autorizadas al usuario 
     */
    public function consultarPermisosBotonesFacturas($data) {
        $parametros['ideprograma'] = $data['ideprograma'];
        $parametros['idempresa'] = $data['idempresa'];
        $parametros['idusuario'] = $data['idusuario'];
        $parametros['idestructura'] = $data['idestructura'];
            
        $sql = "select uni.uni_ideregistro idunidad
               from prun_prgunidad  prun 
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = prun.uni_ideregistro and uni.est_ideregistro = :idestructura
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro and esem.emp_ideregistro = :idempresa
               INNER JOIN uspu_usuprgunid  uspu on uspu.prun_ideregistr = prun.prun_ideregistr
               where uspu.usu_ideregistro = :idusuario   and prun.prg_ideregistro = :ideprograma";
        $resultado = $this->executeQuery($sql, $parametros);

        return $resultado;
    }

     /**
     * Consulta las facturas con una fecha de vencimiento de al menos 3 meses 
     * @param type $idSuscripcion id de la suscripcion
     * @return type
     */
    public function consultarFacturasCarteraIntCorriente($idSuscripcion) {
        $parametros["dsus_ideregistr"] = $idSuscripcion;
        $sql = "SELECT   DISTINCT fac.fac_fecha,
                    fac.fac_ideregistro idfactura,
                    fac.fac_fecvence fechavencimiento,
                    fac.fac_numero numerofactura,
                    cic.cic_nombre ciclo,
                    per.per_nombre periodo,
                    fac.cic_ano ano,
                    fac.fac_vlrreal valorreal,
                    fac.fac_sdoreal saldo,
                    fac.fac_vlrreal - fac.fac_sdoreal valorpagado
                FROM
                    fac_factura fac
                INNER JOIN dsus_detsuscrip dsus ON fac.dsus_ideregistr = dsus.dsus_ideregistr
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = fac.cic_ideregistro
                INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro = fac.fac_ideregistro
	   INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                INNER JOIN per_periodo per ON per.per_ideregistro = fac.per_ideregistro
                WHERE
                    fac.fac_sdoreal > 0 
                AND fac.uni_documento=85
                AND fac.fac_fecha <= (now() - INTERVAL '1 months')
                AND fac.fac_estado IN ('A')  AND fac.fac_idepadre is null
                AND con.con_condonable = 'S' and dfac.dfac_sdoreal > 0
                AND dsus.dsus_ideregistr = :dsus_ideregistr order by fac.fac_fecha,fac.fac_ideregistro ,
                    fac.fac_fecvence ,
                    fac.fac_numero ,
                    cic.cic_nombre ,
                    per.per_nombre ,
                    fac.cic_ano   asc";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }


}
