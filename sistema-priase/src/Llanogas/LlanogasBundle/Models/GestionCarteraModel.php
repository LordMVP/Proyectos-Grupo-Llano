<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\AuditoriaServices;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar los datos de gestión de cartera.
 *
 * @author hrey
 */
class GestionCarteraModel extends AuditoriaServices {

    /**
     * Sesión del usuario
     * @var SessionInterface
     */
    private $sesion;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion, &$sesion) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
    }

    /**
     * Consulta todos los tipos de documentos registrados en el sistema.
     * @return array Listado de los tipos de documentos.
     */
    public function consultarTipoDocumentos() {
        $parametros = array();
        $sql = "select 
                    distinct fac.uni_tipdocument idtipodocumento,
                    ud.uni_nombre1 tipodocumento
                from 
                    fac_factura fac inner join uni_unidad ud on fac.uni_tipdocument=ud.uni_ideregistro";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta los documentos asociados a un tipo de documentos.
     * @param int $idTipoDocumento identificador de tipo de documentos.
     * @return array Listado de los documentos.
     */
    public function consultarDocumentosPorTipoDocumento($idTipoDocumento) {
        $parametros["idTipoDocumento"] = $idTipoDocumento;
        $sql = "select 
		  distinct 
		  fac.uni_documento iddocumento,
		  ud.uni_nombre1 documento
		from 
		  fac_factura fac inner join uni_unidad ud on fac.uni_documento=ud.uni_ideregistro
	        where
	          fac.uni_tipdocument=:idTipoDocumento";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta todas las suscripciones con saldo
     * @param array $parametros Criterios de búsqueda :idSuscripcion, :idDocumento, :idTipoDocumento, :idTipoSuscripcion, :morosidadDesde, :morosidadHasta, :idEmpresa, :saldoDesde, :saldoHasta
     * @return array Listado de las suscripciones que tienen saldo.
     */
    public function consultarSuscripcionesConSaldo($parametros) {
        $dia = (date('d') - 1) / 1;
        $complementoSql = "";
        $parametros["uni_tipsuscripc"] = $parametros["idtiposuscripcion"];
        $parametros["emp_ideregistro"] = $parametros["idempresa"];
        $parametros["dfac_sdorealini"] = $parametros["saldodesde"];
        $parametros["dfac_sdorealfin"] = $parametros["saldohasta"];
        $parametros["fac_fecvenceini"] = $parametros["morosidaddesde"];
        $parametros["morosidaddesde"] = $parametros["morosidaddesde"];
        $parametros["morosidadhasta"] = $parametros["morosidadhasta"];
        if (!empty($parametros["idsuscripcion"]) && $parametros["idsuscripcion"] > 0) {
            $complementoSql .= " AND dsus.dsus_ideregistr = :dsus_ideregistr";
            $parametros["dsus_ideregistr"] = $parametros["idsuscripcion"];
        }
        if (!empty($parametros['idciclo'])) {
            $complementoSql .= " AND dsus.cic_ideregistro =:cic_ideregistro";
            $parametros['cic_ideregistro'] = $parametros['idciclo'];
        }
        if (!empty($parametros["iddocumento"]) && $parametros["iddocumento"] > 0) {
            $complementoSql .= " AND fac.uni_documento = :uni_documento";
            $parametros["uni_documento"] = $parametros["iddocumento"];
        }
        if (!empty($parametros["idtipodocumento"]) && $parametros["idtipodocumento"] > 0) {
            $complementoSql .= " AND fac.uni_tipdocument = :uni_tipdocument";
            $parametros["uni_tipdocument"] = $parametros["idtipodocumento"];
        }
        if (!empty($parametros["idmunicipio"]) && $parametros["idmunicipio"] > 0) {
            $complementoSql .= " AND dsus.uni_municipio = :uni_municipio";
            $parametros["uni_municipio"] = $parametros["idmunicipio"];
        }
        $sql = "
                SELECT  * FROM (SELECT
                  DISTINCT cartera.*,
                  (
                  select coalesce(ceil( ((select per_fecfinal 
                              from per_periodo per
				   inner join cic_ciclo cic on cic.cic_ideregistro = per.cic_ideregistro
				   inner join dsus_detsuscrip dsus on  per.cic_ideregistro = dsus.cic_ideregistro
				   where
                                       per_estado ='A' and dsus_ideregistr = idsuscripcion )::date  - 
                      (
		          select min(fac_fecvence) 
                             from fac_factura fac1
			          where 
                                  dsus_ideregistr = idsuscripcion and fac_idepadre is null and fac_sdoreal>0 and fac_fecvence < now() and fac_estado='A'
		      )::date) ::numeric/30 ) ,0)::int
                  ) cantidadmeses
                FROM
                  (SELECT
                     dsus.uni_tipsuscripc idtiposuscripcion,
                     tsu.tsu_nombre       tiposuscripcion,
                     dsus.uni_tipusosuscr idtipousosuscripcion,
                     uni.uni_nombre1      tipousosuscripcion,
                     dsus.uni_liquidacion idliquidacion,
                     liq.liq_nombre       liquidacion,
                     dsus.dsus_ideregistr idsuscripcion,
                     dsus.dsus_pcodigo    codigoanterior,
                     ter.ter_ideregistro  idsuscriptor,
                     ter.ter_nomcompleto  suscriptor,
                     (
                       SELECT SUM(fac1.fac_sdoreal) saldofacturas
                       FROM
                         fac_factura fac1
                       WHERE
                         fac1.fac_idepadre IS NULL AND fac1.fac_estado = 'A'
                         AND fac1.dsus_ideregistr = dsus.dsus_ideregistr
                     )                    saldofacturas,
                     fac.fac_ideregistro  idfactura,
                     fac.fac_sdoreal      saldofactura,
                     fac.fac_vlrreal      totalfactura,
                     (
                       fac.fac_vlrreal - fac.fac_sdoreal
                     )                    pagadofactura,
                     fac.fac_numero       numero,
                     fac.fac_fecvence     fechavencimiento,
                     cic.cic_ideregistro  idciclo,
                     cic.cic_nombre       ciclo,
                     per.per_ideregistro  idperiodo,
                     per.per_nombre       periodo

                   FROM
                     dsus_detsuscrip dsus
                     INNER JOIN fac_factura fac ON dsus.dsus_ideregistr = fac.dsus_ideregistr
                     INNER JOIN cic_ciclo cic ON fac.cic_ideregistro = cic.cic_ideregistro
                     INNER JOIN per_periodo per ON per.per_ideregistro = fac.per_ideregistro
                     INNER JOIN tsu_tipsuscripc tsu ON dsus.uni_tipsuscripc = tsu.uni_tipsuscripc
                     INNER JOIN liq_liquidacion liq ON dsus.uni_liquidacion = liq.uni_liquidacion
                     INNER JOIN uni_unidad uni ON dsus.uni_tipusosuscr = uni.uni_ideregistro
                     INNER JOIN ter_tercero ter ON dsus.ter_ideregistro = ter.ter_ideregistro
                   WHERE                  
                     dsus.uni_tipsuscripc = :uni_tipsuscripc
                     AND fac.emp_ideregistro = :idempresa
                     AND fac.fac_sdoreal > 0
                     AND fac.fac_estado = 'A'
                     AND per.per_estado <> 'B' 
                     $complementoSql
                   ORDER BY
                     dsus.dsus_ideregistr ASC
                  ) AS cartera
                WHERE
                  (cartera.saldofacturas) BETWEEN :dfac_sdorealini AND :dfac_sdorealfin
                ORDER BY idsuscripcion) AS  infofinal WHERE  infofinal.cantidadmeses BETWEEN  :morosidaddesde AND :morosidadhasta";
        $resultado = $this->executeQuery($sql, $parametros);
        $suscripciones = array();
        $suscripcion = null;
        $idSuscripcionAnterior = count($resultado) > 0 ? $resultado[0]["idsuscripcion"] : -1;
        foreach ($resultado as $registro) {
            $idSuscripcion = $registro["idsuscripcion"];
            if ($idSuscripcion != $idSuscripcionAnterior) {
                $suscripciones[] = $suscripcion;
                $idSuscripcionAnterior = $idSuscripcion;
                $suscripcion = null;
            }
            $suscripcion["idsuscripcion"] = $idSuscripcion;
            $suscripcion["idtiposuscripcion"] = $registro["idsuscripcion"];
            $suscripcion["tiposuscripcion"] = $registro["tiposuscripcion"];
            $suscripcion["idtipousosuscripcion"] = $registro["idtipousosuscripcion"];
            $suscripcion["tipousosuscripcion"] = $registro["tipousosuscripcion"];
            $suscripcion["idliquidacion"] = $registro["idliquidacion"];
            $suscripcion["liquidacion"] = $registro["liquidacion"];
            $suscripcion["idsuscripcion"] = $registro["idsuscripcion"];
            $suscripcion["codigoanterior"] = $registro["codigoanterior"];
            $suscripcion["idsuscriptor"] = $registro["idsuscriptor"];
            $suscripcion["suscriptor"] = $registro["suscriptor"];
            $factura["idfactura"] = $registro["idfactura"];
            $factura["saldofactura"] = $registro["saldofactura"];
            $factura["totalfactura"] = $registro["totalfactura"];
            $factura["pagadofactura"] = $registro["pagadofactura"];
            $factura["fechavencimiento"] = $registro["fechavencimiento"];
            $factura["idciclo"] = $registro["idciclo"];
            $factura["idperiodo"] = $registro["idperiodo"];
            $factura["ciclo"] = $registro["ciclo"];
            $factura["periodo"] = $registro["periodo"];
            $factura["cicloperiodo"] = $registro["ciclo"] . " " . $registro["periodo"];
            $factura["numerofactura"] = $registro["numero"];
            $suscripcion["facturas"][] = $factura;
        }
        if ($suscripcion != null) {
            $suscripciones[] = $suscripcion;
        }
        return $suscripciones;
    }

    /**
     * Ingresa una nueva gestión.
     * @param array  $datos información de la nueva gestión.
     * @return int Identificador de la nueva gestión
     */
    public function insertarGestion($datos) {
        $data["ges_fecha"] = "now()";
        $data["ges_estado"] = "A";
        $data["dsus_ideregistr"] = $datos["idsuscripcion"];
        $data["cic_ideregistro"] = $datos["idciclo"];
        $data["per_ideregistro"] = $datos["idperiodo"];
        $data["cic_ano"] = $datos["cicloanio"];
        return $this->insertar($data, "ges_gestion", "sq_ges_ideregistro");
    }

    /**
     * Agrega una nueva factura a una gestión.
     * @param array $datos Información de la gestion de la factura
     * @return array identificador de la nueva factua que se agrega a la gestión.
     */
    public function insertarFacturasGestion($datos) {
        $data["fage_fecha"] = "now()";
        $data["fac_ideregistro"] = $datos["idfactura"];
        $data["uni_documento"] = $datos["iddocumento"];
        $data["uni_tipdocument"] = $datos["idtipodocumento"];
        $data["dsus_ideregistr"] = $datos["idsuscripcion"];
        $data["ges_ideregistro"] = $datos["idgestion"];
        return $this->insertar($data, "fage_facgestion", "sq_fage_ideregistr");
    }

    /**
     * Consulta las suscripciones  dependiendo de los parámetros
     * @param int $idSuscripcion identificador de la suscripción.
     * @param string $documentoCedula  Documento identidad del tercero
     * @param type $codigoAnterior
     * @return array listado de las suscripciones
     */
    public function filtrarSuscripcionesGestion($idSuscripcion, $documentoCedula, $codigoAnterior) {
        $complemento = "";
        $parametros = array();
        if (!empty($idSuscripcion)) {
            $complemento.=" and ges.dsus_ideregistr=:idSuscripcion";
            $parametros["idSuscripcion"] = $idSuscripcion;
        }
        if (!empty($documentoCedula)) {
            $complemento.=" and ges.dsus_ideregistr=:documentoCedula";
            $parametros["documentoCedula"] = $documentoCedula;
        }
        if (!empty($codigoAnterior)) {
            $complemento.="  and dsus.dsus_pcodigo = :codigoAnterior";
            $parametros["codigoAnterior"] = $codigoAnterior;
        }
        $parametros["idprograma"] = PROGRAMA_GESTION_CARTERA;
        $idUsuario = $this->sesion->get('idusuario');
        $parametros["idusuario"] = $idUsuario;

        $complemento .= " ORDER BY ges.ges_estado ASC, ges_fecha DESC";
        $empresa = $this->sesion->get('idempresa');
        return $this->consultarSuscripcionesGestion($complemento, $parametros, $empresa);
    }

    /**
     * Consulta la primera y/o última suscripción de la gestión
     * @param string $orden "asc" siquiere la primera, "desc" si se quiere la última
     * @return array Información de la suscripción.
     */
    public function consultarSuscripcionPrimeroUltimo($orden = "asc") {
        $complemento = " order by ges.ges_ideregistro $orden limit 1 ";
        $parametros["idprograma"] = PROGRAMA_GESTION_CARTERA;
        $idUsuario = $this->sesion->get('idusuario');
        $parametros["idusuario"] = $idUsuario;
        $empresa = $this->sesion->get('idempresa');
        return $this->consultarSuscripcionesGestion($complemento, $parametros, $empresa);
    }

    /**
     * Consulta la siguiente y/o anterior suscripción de la gestión
     * @param int $idgestion gestión actual.
     * @param bool $siguiente TRUE siguiente FALSE anterior
     * @return array Detalle de la suscripción.
     */
    public function consultarSuscripcionSiguienteAnterior($idgestion, $siguiente = true) {
        $idUsuario = $this->sesion->get('idusuario');
        $signo = ">";
        $orden = "asc";
        if (!$siguiente) {
            $signo = "<";
            $orden = "desc";
        }
        $complemento = " and ges.ges_ideregistro $signo :idgestion  order by ges.ges_ideregistro $orden  limit 1 ";
        $parametros["idgestion"] = $idgestion;
        $parametros["idusuario"] = $idUsuario;
        $parametros["idprograma"] = PROGRAMA_GESTION_CARTERA;
        $empresa = $this->sesion->get('idempresa');

        return $this->consultarSuscripcionesGestion($complemento, $parametros, $empresa);
    }

    /**
     * Consulta las suscripciones dependiendo de las opciones seleccionadas (todas,primero,última,anterior)
     * @param string $complemento sql con la condición que se quiere consultar
     * @param array $parametros
     * @return array Listado de las suscripciones encontradas.
     */
    public function consultarSuscripcionesGestion($complemento, $parametros = array(), $empresa) {
        $sql = "SELECT
                     ges.ges_ideregistro idgestion, ges.ges_fecha fecha, 
                     ges.ges_estado estadogestion, 
                     ges.dsus_ideregistr idsuscripcion, ges.cic_ideregistro idciclo, 
                     ges.per_ideregistro idperiodo,
                     ter.ter_nomcompleto nombresuscriptor,
                     uni.uni_nombre1 tipouso, dsus.dsus_pcodigo codigoanterior,
                     tsu.tsu_nombre tiposuscripcion,   per.per_nombre periodo,
                     cic.cic_nombre ciclo, ter.ter_documento documento,
                     dsus.sus_ideregistro idsuscriptor,
                     ter.ter_telcelular telefonocelular,
                     ter.ter_telfijo telefonofijo,
                     pro.pro_direccion direccion
                   FROM 
                   ges_gestion ges inner join dsus_detsuscrip dsus on ges.dsus_ideregistr=dsus.dsus_ideregistr
                   inner join tsu_tipsuscripc tsu on dsus.uni_tipsuscripc=tsu.uni_tipsuscripc
                   inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
                   inner join pro_propiedad pro on pro.pro_ideregistro = dsus.pro_ideregistro
                   inner join uni_unidad uni on uni.uni_ideregistro=dsus.uni_tipusosuscr
                   inner join per_periodo per on per.per_ideregistro=ges.per_ideregistro
                   inner join cic_ciclo cic on cic.cic_ideregistro=ges.cic_ideregistro
                WHERE 
                    dsus.uni_municipio in (
                        Select uspr.uni_municipio from uspr_usuprgpryto uspr where uspr.usu_ideregistro =:idusuario and prg_ideregistro =26
                    ) and dsus.emp_ideregistro = $empresa 
                   " . $complemento;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta las facturas de una suscripción que se le va ha realizar la gestión.
     * @param int $idSuscripcion Identificador de la suscripción
     * @return array Listado de las facturas pertenecientes a la suscripción que 
     * se le debe hacer la gestión.
     */
    public function consultarFacturasPorSuscripcion($idSuscripcion,$idSeguimiento) {
        $parametros["idsuscripcion"] = $idSuscripcion;
        $parametros["idseguimiento"] = $idSeguimiento;
        $sql = "select 
                   distinct fac_ideregistro idfactura
                from 
                    fage_facgestion fage
                where 
                    fage.dsus_ideregistr = :idsuscripcion and fage.ges_ideregistro = :idseguimiento";
        $resultado = $this->executeQuery($sql, $parametros);
        $listaFacturas = array();
        foreach ($resultado as $registro) {
            $idFactura = $registro["idfactura"];
            $factura = $this->consultarInformacionFacturaPorId($idFactura);
            $listaFacturas[] = $factura;
        }
        return $listaFacturas;
    }

    /**
     * Consulta una factura de una gestión
     * @param int $idFactura identificador de la factura
     * @return array Detalle de la factura
     */
    public function consultarInformacionFacturaPorId($idFactura) {
        $genericoModel = new GenericoModel();
        $genericoModel->setConexion($this->conexion);
        return $genericoModel->consultarFactura($idFactura);
    }

    /**
     * Consulta los tipo de documentos por suscripción.
     * @param int $idSuscripcion Identificador de la suscripción.
     * @return array Listado de los documentos
     */
    public function consultarTipoDocumentosPorSuscripcion($idSuscripcion) {
        $parametros["idsuscripcion"] = $idSuscripcion;
        $sql = "select 
                    distinct uni_tipdocument idtipodocumento,
                    uni.uni_nombre1 tipodocumento
                from fac_factura fac inner join uni_unidad uni on fac.uni_tipdocument=uni.uni_ideregistro
                where dsus_ideregistr = :idsuscripcion";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta los documentos a una suscripción y dependiendo del tipo de documento.
     * @param int $idSuscripcion identificador de la suscripción
     * @param int $idTipoDocumento identificador del tipo de documento.
     * @return array Listado de los documentos.
     */
    public function consultarDocumentosPorSuscripcionyTipoDocumento($idSuscripcion, $idTipoDocumento) {
        $parametros["idsuscripcion"] = $idSuscripcion;
        $parametros["idtipodocumento"] = $idTipoDocumento;
        $sql = "select 
                    distinct uni_documento documento,
                    uni.uni_nombre1 documento
                from fac_factura fac inner join uni_unidad uni on fac.uni_documento=uni.uni_ideregistro
                where dsus_ideregistr=:idsuscripcion and fac.uni_tipdocument=:idtipodocumento";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Actualiza el estado de una gestión.
     * @param array $gestion información de la gestión.
     */
    public function actualizarEstadoGestion($gestion) {
        $data["ges_estado"] = $gestion["estado"];
        $data["ges_ideregistro"] = $gestion["idgestion"];
        return $this->actualizar($data, "ges_gestion", "ges_ideregistro=:ges_ideregistro");
    }

    /**
     * Se inserta el nuevo detalle de la gestión.
     * @param array $detalleGestion Información con el detalle de la gestión.
     * @return int Identificador de la gestión.
     */
    public function insertarDetalleGestion($detalleGestion) {
        $data["dges_fecha"] = "now()";
        $data["dges_observacio"] = ".";
        $data["cic_ano"] = $detalleGestion['cicano'];
        $data["cic_ideregistro"] = $detalleGestion["idciclo"];
        $data["per_ideregistro"] = $detalleGestion["idperiodo"];
        $data["fage_ideregistr"] = $detalleGestion["idfacturagestion"];
        $data["ges_ideregistro"] = $detalleGestion["idgestion"];
        $data["uni_medcomunica"] = $detalleGestion["idmediocomunicacion"];
        $data["est_medcomunica"] = $detalleGestion["idestructuramediocomunicacion"];
        $data["uni_etagestion"] = $detalleGestion["idetapa"];
        return $this->insertar($data, "dges_detgestion", "sq_dges_ideregistr");
    }

    /**
     * Inserta un archivo adjunto para el detalle de una gestion de cartera
     * @param array $infoArchivo informacion del archico adjunto
     * @return array Informacion del archivo adjunto
     */
    public function insertarAdjuntoDetalleGestion($infoArchivo) {
        $parametros = array();
        $this->setCampo($infoArchivo, $parametros, "tipoarchivo", "addg_tiparchivo");
        $this->setCampo($infoArchivo, $parametros, "ruta", "addg_ruta");
        $this->setCampo($infoArchivo, $parametros, "nombrearchivo", "addg_nomarchivo");
        $idAdjuntoDetalle = $this->insertar($parametros, "addg_adjdetgestion", "sq_addg_ideregistr");
        $infoArchivo["idarchivo"] = $idAdjuntoDetalle;
        return $infoArchivo;
    }

    /**
     * Actualiza la informacion de un archivo adjunto de detalle de gestion 
     * de cartera
     * @param int $idArchivo id del archivo adjunto
     * @param int $idSeguimiento id del seguimiento de la gestion
     * @return int Numero de filas afectadas en la actualizacion
     */
    public function actualizarAdjuntoDetalleGestion($idArchivo, $idSeguimiento) {
        $parametros['dges_ideregistr'] = $idSeguimiento;
        $parametros['addg_ideregistr'] = $idArchivo;
        return $this->actualizar($parametros, 'addg_adjdetgestion', 'addg_ideregistr=:addg_ideregistr');
    }

    /**
     * Ingresa la infprmación adicional de la gestión.
     * @param array $informacion información adicional de la gestión.
     * @return int identificador de la gestión.
     */
    public function insertarInformacionAdicional($informacion) {
        $data["ingf_informacio"] = $informacion["valor"];
        $data["ingf_estado"] = "A";
        $data["ingf_descripcio"] = $informacion["nombre"];
        $data["dges_ideregistr"] = $informacion["iddetallegestion"];
        $data["est_medcomunica"] = $informacion["idestructuramediocomunicacion"];
        $data["uni_medcomunica"] = $informacion["idmediocomunicacion"];
        $data["ingf_grpinform"] = 1;
        $data["tip_ideregistro"] = $informacion["idtipificacion"];
        $data["tip_nombre"] = $informacion["nombre"];
        return $this->insertar($data, "ingf_infgesfact", "sq_ingf_ideregistr");
    }

    /**
     * Consulta todo el historico.
     * @param int $idGestion identificador de la gestión.
     * @return array Listado de seguimientos . 
     */
    public function consultarHistorico($idGestion) {
        $parametros["idgestion"] = $idGestion;
        $sql = "select 
                    dges.dges_ideregistr iddetallegestion,
                    dges.dges_fecha fechagestion,
                    cic.cic_nombre ciclo,
                    per.per_nombre periodo,
                    fage.fac_ideregistro idfactura,
                    uni.uni_nombre1 mediocomunicacion
                from 
                    dges_detgestion dges left join fage_facgestion fage
                    on dges.fage_ideregistr=fage.fage_ideregistr
                    inner join cic_ciclo cic on dges.cic_ideregistro=cic.cic_ideregistro
                    inner join per_periodo per on dges.per_ideregistro=per.per_ideregistro
                    inner join uni_unidad uni on dges.uni_medcomunica=uni.uni_ideregistro
                where 
                    dges.ges_ideregistro=:idgestion 
                    order by fage.fac_ideregistro";
        $resultado = $this->executeQuery($sql, $parametros);
        $listaDetalles = array();
        foreach ($resultado as $registro) {
            if ($registro["idfactura"] != null) {
                $registro["factura"] = $this->consultarInformacionFacturaPorId($registro["idfactura"]);
            }
            $listaDetalles[] = $registro;
        }
        return $listaDetalles;
    }

    public function listaEtapaSeguimiento() {
        $parametros = array();
        $sql = "SELECT
                    uni.uni_ideregistro idetapa,
                    uni.uni_nombre1 etapa
                FROM
                    uni_unidad uni
                INNER JOIN est_estructura est ON uni.est_ideregistro = est.est_ideregistro
                INNER JOIN cla_clase cla ON est.cla_ideregistro = cla.cla_ideregistro
                WHERE cla.cla_ideregistro = 25";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * consulta para llenar un campo de autocomplete los municipios autorizados
     * para el perfil de un usuario
     * @param String $municipio
     * @return array retorna los municipios agrupados por id y nombre de las coinciden
     * cias de la consulta
     */
    public function autocompleteMunicipio($municipio) {
        $parametros["codempresa"] = $this->sesion->get('idempresa');
        $parametros["codusuario"] = $this->sesion->get('idusuario');
        $parametros["municipio"] = "%" . strtoupper($municipio) . "%";
        $sql = "SELECT
                    pry.proyecto_cod::integer idmunicipio, pry.proyecto_ideregistro idproyecto, pry.proyecto_nom municipio
                FROM
                    proyectos pry
                INNER JOIN empresas emp ON emp.empresa_cod = pry.proyecto_codemp
                INNER JOIN uspr_usuprgpryto uspr ON uspr.uni_municipio = pry.proyecto_ideregistro
                WHERE
                    emp.empresa_sevemp = :codempresa
                AND uspr.usu_ideregistro = :codusuario
                AND uspr.prg_ideregistro = 36
                AND upper(pry.proyecto_nom) LIKE :municipio LIMIT 100";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function consultarGestion($idGestion, $estado = 'A') {
        $parametros['idgestion'] = $idGestion;
        $parametros['estado'] = $estado;
        $sql = "SELECT
                  ges_ideregistro idgestion,
                  ges_fecha fecha,
                  ges_estado estado,
                  dsus_ideregistr idsuscripcion,
                  cic_ideregistro idciclo,
                  per_ideregistro idperiodo,
                  cic_ano cicloanio,
                  usu_ideregistro idusuario
                FROM
                  ges_gestion
                WHERE
                  ges_ideregistro = :idgestion AND ges_estado=:estado";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se puede modificar una gestión en estado cerrada', -1);
        }
        return $resultado[0];
    }

    /**
     * Consulta la infomación de un detalle de gestion de cartera para su
     * visualizacion en el historico del seguimiento 
     * @param int $idDetalleGestion id del detalle de la gestion a consultar
     * @return array informacion del detalle de la gestion
     */
    public function consultarDetalleGestionHistorico($idDetalleGestion) {
        $parametros['iddetallegestion'] = $idDetalleGestion;
        $sql = 'SELECT
                    dges.uni_medcomunica idmediocomunicacion,
                    dges.uni_etagestion idetapa,
                    dges.fage_ideregistr idfacturagestion,
                    dges.est_medcomunica idestructuramendiocomunicacion
                FROM
                    dges_detgestion dges
                WHERE
                    dges.dges_ideregistr = :iddetallegestion;';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta la infomación de los archivos adjuntos del detalle de gestion 
     * de cartera para su visualizacion en el historico del seguimiento 
     * @param int $idDetalleGestion id del detalle de la gestion a consultar
     * @return array informacion de los archivos adjuntos del detalle de
     * la gestion
     */
    public function consultarArchivoAdjuntoHistorico($idDetalleGestion) {
        $parametros['iddetallegestion'] = $idDetalleGestion;
        $sql = 'SELECT 
                    addg.addg_tiparchivo formatoarchivo,
                    addg.addg_ruta ruta,
                    addg.addg_nomarchivo nombrearchivo
                FROM 
                    addg_adjdetgestion addg
                INNER JOIN 
                    dges_detgestion dges ON addg.dges_ideregistr = dges.dges_ideregistr
                WHERE
                    dges.dges_ideregistr = :iddetallegestion;';
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta la infomación adicional del detalle de gestion de cartera para
     * su visualizacion en el historico del seguimiento 
     * @param int $idDetalleGestion id del detalle de la gestion a consultar
     * @return array informacion adicional del detalle de la gestion
     */
    public function consultarInformacionAdicionalHistorico($idDetalleGestion) {
        $parametros['iddetallegestion'] = $idDetalleGestion;
        $sql = 'SELECT 
                ingf.ingf_informacio valor,
                ingf.tip_ideregistro idtipificacion,
                ingf.ingf_descripcio nombre
            FROM
                ingf_infgesfact ingf 
            INNER JOIN 
                dges_detgestion dges ON ingf.dges_ideregistr = dges.dges_ideregistr
            WHERE
                dges.dges_ideregistr = :iddetallegestion;';
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

}
