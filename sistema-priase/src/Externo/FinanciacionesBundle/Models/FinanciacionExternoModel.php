<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Externo\FinanciacionesBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\MyException;
use const CLASE_PRODUCTO_FINANCIERO_EXTERNO;

/**
 * Description of FinanciacionExternoModel
 *
 * @author god
 */
class FinanciacionExternoModel extends AuditoriaServices {

    /**
     * Información del usuario que está en el sistema
     * @var array (
     *              idacceso,idusuario,cedula,
     *              usuario,idempresa,empresa,
     *              idperfil
     *            )
     */
    private $sesion;

    /**
     * 
     * @param Connection $conexion
     * @param array $sesion Información de la sesión 
     */
    public function __construct($conexion, $sesion) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
    }

    /**
     * Consulta todos los productos financierons que tiene 
     * la empresa de sesión 
     * @return array  Lista de productos
     */
    public function consultarProductosFinancieros() {
        $sql = 'SELECT
                  uni.uni_ideregistro idproductofin,
                  uni.uni_nombre1     nombreproductofin
                FROM uni_unidad uni
                  INNER JOIN est_estructura est ON uni.est_ideregistro = est.est_ideregistro
                  INNER JOIN esem_estempresa esem ON est.est_ideregistro = esem.est_ideregistro
                WHERE est.cla_ideregistro = :idclase AND esem.emp_ideregistro = :idempresa';
        return $this->executeQuery($sql, array(
                    'idempresa' => $this->sesion['idempresa'],
                    'idclase' => CLASE_PRODUCTO_FINANCIERO_EXTERNO
        ));
    }

    /**
     * * Permite obtener el listado de las liquidaciones que aplican créditos
     * @param int $idEmpresa Identificador de la empresa 
     * @param int $idTipoDocumento id tipo de documento 
     * @return array
     */
    public function consultarLiquidacionesCredito($idEmpresa, $idTipoDocumento) {
        $sql = "SELECT
                    liq.uni_liquidacion                  idliquidacion,
                    liq.liq_nombre                       liquidacion,
                    liq.liq_tipcuota                     tipocuota,
                    con_formula :: json -> 0 ->> 'valor' tasainteres,
                    tido.tido_maxcuofinancia             plazomaximo
                  FROM
                    liq_liquidacion liq
                    INNER JOIN tido_tipdocumen tido ON liq.uni_tipdocument = tido.uni_tipdocument
                    INNER JOIN esem_estempresa esem ON liq.est_liquidacion = esem.est_ideregistro
                    LEFT JOIN coli_conliquida coli ON coli.uni_liquidacion = liq.uni_liquidacion
                    LEFT JOIN con_concepto con ON con.uni_concepto = coli.uni_concepto
                  WHERE
                    liq.liq_venclasific = 'FI'
                    AND con.con_intfinanciacion = 'S'
                    AND esem.emp_ideregistro = :idempresa
                    AND liq.uni_tipdocument = :idtipodocumento";
        return $this->executeQuery($sql, array('idempresa' => $idEmpresa, 'idtipodocumento' => $idTipoDocumento));
    }

    /**
     * Consulta todas las variables de la calificación del crédito
     * @param int $idEmpresaFinan
     * @param int $idProductoFinan
     * @return MyException Si no hay formularios parametrizados
     */
    public function consultarVariablesCalificacion($idEmpresaFinan, $idProductoFinan) {
        $parametros['idempresafinan'] = $idEmpresaFinan;
        $parametros['idproductofin'] = $idProductoFinan;
        $sql = "SELECT
                  uni_clavariable     idvariable,
                  dfrm_tipo           tipo,
                  dfrm_ideregistr     iddetalleformulario,
                  uni.uni_nombre1     nombrevariable,
                  fun.fun_ideregistro idfuncion,
                  fun_nombre          nombrefuncion,
                  ''                  valor,
                  ''                  calificacion
                FROM
                  dfrm_detformulario dfrm
                  INNER JOIN uni_unidad uni ON uni.uni_ideregistro = dfrm.uni_clavariable
                  LEFT JOIN fun_funcion fun ON fun.fun_ideregistro = dfrm.fun_ideregistro
                WHERE
                  frm_ideregistro = (SELECT form.frm_ideregistro idformulario
                                     FROM
                                       prfr_prdformulario pform
                                       INNER JOIN frm_formulario form ON pform.frm_ideregistro = form.frm_ideregistro
                                       INNER JOIN uni_unidad uni ON pform.uni_prdfinanciero = uni_ideregistro
                                       INNER JOIN est_estructura est on uni.est_ideregistro = est.est_ideregistro
                                       INNER JOIN esem_estempresa esem on est.est_ideregistro = esem.est_ideregistro
                                     WHERE
                                       now() :: DATE BETWEEN form.frm_inivigencia AND form.frm_finvigencia
                                       AND form.frm_estado = 'A'
                                       AND esem.emp_ideregistro = :idempresafinan
                                       AND pform.uni_prdfinanciero = :idproductofin)
                  AND dfrm_estado = 'A'
                ORDER BY tipo, nombrevariable";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return new MyException("Error: No hay formularios parametrizados", -1);
        }
        return $resultado;
    }

    /**
     * Registra un crédito para la certera financiada 
     * 
     * @param array $infoCredito información del crédtio
     * @return array
     */
    public function insertarCredito($infoCredito) {
        $infoCredito['idusuariologin'] = $this->sesion['idusuario'];
        $credito['cre_fecha'] = 'now()';
        $credito['uni_creetapa'] = 0;
        $credito['uni_prdfinanciero'] = $infoCredito['idproductofinanciero'];
        $credito['cre_monto'] = $infoCredito['vlrmontocredito'];
        $credito['cre_destino'] = 'C';
        $credito['cre_plazo'] = $infoCredito['plazo'];
        $credito['cre_fecaprobacion'] = 'now()';
        $credito['emp_ideregistro'] = $this->sesion['idempresa'];
        $credito['ter_idefinanciera'] = $infoCredito['idterempresafinancia'];
        $credito['usu_ideregistro'] = $this->sesion['idusuario'];
        $credito['uni_liquidacion'] = $infoCredito['iduniliqfinanciacion'];
        $credito['dsus_ideregistr'] = $infoCredito['idsuscripcion'];
        return $this->insertar($credito, 'cre_credito', 'sq_cre_ideregistro');
    }

    public function insertarVentaFinanciacion($financiacion) {
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
        $this->setCampo($financiacion, $parametros, 'numerocuotas', 'vfi_numcuotas');
        $this->setCampo($financiacion, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($financiacion, $parametros, 'idliquidacion', 'uni_liquidacion');
        $this->setCampo($financiacion, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $financiacion['idventafinanciacion'] = $this->insertar($parametros, 'vfi_venfinanciacio', 'sq_vfi_ideregistro');
        return $financiacion;
    }

    /**
     * Inserta todos los detalles de la venta en la financiación 
     * @param int $idVenta
     * @param int $idVentaFinanciacion
     */
    public function insertarDetallesFinanciacion($idVenta, $idVentaFinanciacion) {
        $parametros['idventa'] = $idVenta;
        $parametros['idventafinanciacion'] = $idVentaFinanciacion;
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $sql = "INSERT INTO dvfi_detvenfinancia
                (ven_ideregistro,
                 dven_ideregistr,
                 uni_concepto,
                 dvfi_vlrreal,
                 dvfi_sdoreal,
                 emp_ideregistro,
                 usu_ideregistro,
                 vfi_ideregistro)
                  SELECT
                    dven.ven_ideregistro,
                    dven.dven_ideregistr,
                    dven.uni_concepto,
                    dven.dven_vlrreal,
                    dven.dven_vlrreal,
                    :idempresa,
                    :idusuario,
                    :idventafinanciacion
                  FROM dven_detventa dven
                  WHERE dven.ven_ideregistro = :idventa AND dven.dven_vlrreal > 0";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Lista todos los terceros
     * @param string $nombre nombre del cliente
     * @return array Listado de los terceros
     */
    public function consultarTercero($nombre) {
        $nombre = trim($nombre);
        $parametros["ter_nomcompleto"] = "%" . strtolower($nombre) . "%";
        $sql = "SELECT
                    DISTINCT
                    ter.ter_ideregistro idtercero,
                    ter.ter_documento documento,
                    trim(ter.ter_nomcompleto) nombretercero,
                    ter.ter_telcelular telefonocelular
                FROM
                    ter_tercero  ter 
                WHERE
                    lower(ter_nomcompleto) like :ter_nomcompleto
                LIMIT 150";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Lista todos los terceros
     * @param string $nombre nombre del cliente
     * @return array Listado de los terceros
     */
    public function consultarTerceroIdentificacion($documento) {
        $sql = "SELECT
                    DISTINCT
                    ter.ter_ideregistro idtercero,
                    ter.ter_documento documento,
                    trim(ter.ter_nomcompleto) nombretercero,
                    ter.ter_telcelular telefonocelular
                FROM
                    ter_tercero  ter 
                WHERE
                   ter.ter_documento = :documento
                LIMIT 1";
        $resultado = $this->executeQuery($sql, ['documento' => $documento]);
        return empty($resultado) ? $resultado : $resultado[0];
    }

    public function consultarTerceroPorDocumento($documento) {
        $parametros["documento"] = trim($documento);
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $sql = "SELECT
                DISTINCT
                ter.ter_ideregistro idtercero,
                ter.ter_documento documento, ter.ter_nombre, ter.ter_apellido,
                trim(ter.ter_nomcompleto) nombretercero, ter.ter_sexo sexo, ter.ter_telcelular telefonocelular,
                ter.ter_telfijo, ter.est_tiptercero, ter.ter_correo, ter.usu_ideregistro,
                ter.ciudad_cod, ter.ter_documento, ter.uni_tipidentifica, ter.ter_fecnacimiento,
                ciudades.ciudad_nom, 
                ter.ter_correo,
                ter.ter_fecnacimiento 
                FROM ter_tercero ter INNER JOIN ciudades ON ciudades.ciudad_cod = ter.ciudad_cod
                WHERE
                ter_documento = :documento AND ter.uni_tipidentifica IN (  SELECT uni.uni_ideregistro 
                                                                           FROM uni_unidad uni 
                                                                                INNER JOIN est_estructura est on est.est_ideregistro=uni.est_ideregistro
                                                                                INNER JOIN esem_estempresa esem on esem.est_ideregistro=est.est_ideregistro
                                                                           WHERE esem.emp_ideregistro = :idempresa and est.cla_ideregistro=40  
                                                                        )
                LIMIT 1";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return null;
        }
        return $resultado[0];
    }

    /**
     * Información del departamento
     * @param int $idSuscripcion
     */
    private function consultarDepartamento($idMunicipio) {
        $sql = "SELECT dep.departamento_ideregistro iddepartamento
                FROM departamentos dep
                  INNER JOIN proyectos pry ON dep.departamento_ideregistro = pry.departamento_ideregistro
                WHERE pry.proyecto_ideregistro = :idmunicipio";
        $resultado = $this->executeQuery($sql, array('idmunicipio' => $idMunicipio));
        if (empty($resultado)) {
            return 16;
        }
        return $resultado[0]['iddepartamento'];
    }

    /**
     * permite crear la información básica
     * @param Array $infoBasica
     */
    public function insertarInformacionBasica($infoBasica, $idCredito, $idSuscripcion) {
        $genericoModel = new GenericoModel($this->conexion);
        $infoSuscripcion = $genericoModel->consultarInformacionSuscripcion($idSuscripcion);
        $idTercero = $infoSuscripcion['idtercero'];
        $infoTercero = $genericoModel->getTerceroInfo($idTercero);
        $informacionBasica['cre_ideregistro'] = $idCredito;
        $informacionBasica['ter_nombre'] = $infoTercero['nombre'];
        $informacionBasica['ter_apellido'] = $infoTercero['apellido'];
        $informacionBasica['ter_nomcompleto'] = $infoTercero['nombretercero'];
        $informacionBasica['ter_sexo'] = $infoTercero['sexo'];
        $informacionBasica['ter_documento'] = $infoTercero['cedula'];
        $informacionBasica['uni_tiptercero'] = 1;
        $informacionBasica['uni_estcivil'] = 0;
        $informacionBasica['crib_percargomenor'] = 0;
        $informacionBasica['crib_percargomayor'] = 0;
        $informacionBasica['crib_nomconyugue'] = $infoBasica['nombres'];
        $informacionBasica['crib_apeconyugue'] = $infoBasica['apellidos'];
        $informacionBasica['crib_comconyugue'] = $infoBasica['nombres'] . ' ' . $infoBasica['apellidos'];
        $informacionBasica['crib_docconyugue'] = $infoBasica['documento'];
        $informacionBasica['crib_traconyugue'] = $infoBasica['trabaja'];
        $informacionBasica['crib_empconyugue'] = $infoBasica['empresa'];
        $informacionBasica['crib_telconyugue'] = $infoBasica['telefono'];
        $informacionBasica['crib_dirconyugue'] = '.';
        $informacionBasica['crib_ciuconyugue'] = '.';
        $informacionBasica['uni_niveducativo'] = 0;
        $informacionBasica['uni_profesion'] = 0;
        $informacionBasica['pro_direccion'] = '.';
        $informacionBasica['uni_municipio'] = $infoSuscripcion['idmunicipio'];
        $informacionBasica['uni_barrio'] = $infoSuscripcion['idbarrio'];
        $informacionBasica['departamento_ideregistro'] = $this->consultarDepartamento($infoSuscripcion['idmunicipio']);
        $informacionBasica['crib_telcelular'] = $infoTercero['celular'];
        $informacionBasica['crib_telfijo'] = $infoTercero['telefono'];
        $informacionBasica['crib_correo'] = '.';
        $informacionBasica['crib_diaresidencia'] = 0;
        $informacionBasica['uni_tippropieda'] = 0;
        $informacionBasica['uni_tipenvio'] = 0;
        $informacionBasica['crib_vlrarriendo'] = 0;
        $informacionBasica['uni_tipidentifica'] = 0;
        $informacionBasica['usu_ideregistro'] = $this->sesion['idusuario'];
        $informacionBasica['pro_catestrato'] = $infoSuscripcion['estrato'];
        return $this->insertar($informacionBasica, 'crib_creinfbasica', 'sq_crib_ideregistr');
    }

    /**
     * permite ingresar la información de la referencia en la solicitud de crédito
     * @param array $referencia información de activos del usuario para la solicitud de crédito
     * @return int identificador de la referencia
     */
    public function insertarReferencias(array $referencia) {
        //permite construir la referencia familiar
        $infoReferencias['cre_ideregistro'] = $referencia['idcredito'];
        $infoReferencias['crre_tipreferencia'] = 'F';
        $infoReferencias['crre_nombre'] = $referencia['nombres'];
        $infoReferencias['crre_apellido'] = $referencia['apellidos'];
        $infoReferencias['crre_telcelular'] = $referencia['celular'];
        return parent::insertar($infoReferencias, 'crre_crereferencia', 'sq_crre_ideregistr');
    }

    /**
     * permite inseertar una calificación
     * @param array $info Información de la variable
     * @return int identificador de la calificación 
     */
    public function insertarCalificacionScoringCredito($info) {
        $parametros['crsc_variable'] = $info['nombrevariable'];
        $parametros['dfrm_score'] = $info['calificacion'];
        $parametros['crsc_score'] = $info['calificacion'];
        $parametros['cre_ideregistro'] = $info['idcredito'];
        $parametros['crsc_vlrformular'] = $info['valor'];
        $parametros['dfrm_ideregistr'] = $info['iddetalleformulario'];
        $parametros['usu_ideregistro'] = $this->sesion['idusuario'];
        return parent::insertar($parametros, 'crsc_crescore', 'sq_crsc_ideregistr');
    }

    /**
     * Consulta el nombre de la función por el identificador del detalle
     * @param type $idDetalleFormulario identificador del detalle
     * @return string nombre de la función a ejecutar
     * @throws MyException
     */
    public function consultarFormularioFuncion($idDetalleFormulario) {
        $sql = "SELECT
                    frm.*,
                    fun.*
                  FROM frm_formulario frm
                    INNER JOIN dfrm_detformulario dfrm on frm.frm_ideregistro = dfrm.frm_ideregistro
                    INNER JOIN fun_funcion fun ON fun.fun_ideregistro = frm.fun_ideregistro
                  WHERE dfrm.dfrm_ideregistr = $idDetalleFormulario";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('Error en la parametrización', -1);
        }
        return $resultado[0]['fun_nombre'];
    }

    /**
     * Se consulta la información de la pestaña de crédito y financiación
     * @param int $numeroVenta Identificador de la venta 
     * @param int $idSuscripcion Identificador de la suscripción 
     * @return array Información de la pestaña de crédito y financiación
     * @throws MyException 
     */
    public function consultarCreditoFinanciacion($numeroVenta, $idSuscripcion) {
        $sql = "SELECT
                  cre.cre_ideregistro   idcredito,
                  cre.uni_prdfinanciero idproductofinan,
                  cre.cre_plazo         plazo,
                  cre.uni_liquidacion   idliquidacion,
                  cre.cre_monto         montosolicitado
                FROM cre_credito cre INNER JOIN vecr_vencredito vecr ON vecr.cre_ideregistro = cre.cre_ideregistro
                WHERE cre.dsus_ideregistr = :idsuscripcion AND vecr.ven_ideregistro = :idventa";
        $resultado = $this->executeQuery($sql, ['idsuscripcion' => $idSuscripcion, 'idventa' => $numeroVenta]);
        if (empty($resultado)) {
            throw new MyException('Error: No se encontró información del crédito', -1);
        }
        return $resultado[0];
    }

    /**
     * Se consulta la pestaña de datos de solicitante
     * @param int $numeroVenta Identificador de la venta
     * @return array 
     */
    public function consultarDatosSolicitante($numeroVenta) {
        $sql = "SELECT
                  ter.ter_ideregistro idtercero,
                  ter.ter_nomcompleto nombretercero,
                  ter.ter_documento documento,
                  uni.uni_ideregistro idparentesco,
                  uni.uni_nombre1     parentesco
                FROM vfi_venfinanciacio vfi
                  INNER JOIN ter_tercero ter ON ter.ter_ideregistro = vfi.ter_idesolicita
                  INNER JOIN uni_unidad uni ON vfi.uni_parentesco = uni.uni_ideregistro
                WHERE vfi.ven_ideregistro = :numeroventa";
        $resultado = $this->executeQuery($sql, ['numeroventa' => $numeroVenta]);
        if (empty($resultado)) {
            return;
        }
        return $resultado[0];
    }

    /**
     * Consulta la información del cónu¡yuge dependiendo de un crédito 
     * @param int $idCredito
     * @return array
     */
    public function consultarDatosConyuge($idCredito) {
        $sql = "SELECT
                  crib.crib_docconyugue documento,
                  crib.crib_nomconyugue nombres,
                  crib.crib_apeconyugue apellidos,
                  crib.crib_traconyugue trabaja,
                  crib.crib_empconyugue empresa,
                  crib.crib_telconyugue telefono
                FROM crib_creinfbasica crib
                WHERE crib.cre_ideregistro = :idcredito";
        $resultado = $this->executeQuery($sql, ['idcredito' => $idCredito]);
        if (empty($resultado)) {
            return;
        }
        return $resultado[0];
    }

    /**
     * Consulta las referencias de un crédito 
     * @param int $idCredito
     * @return array
     */
    public function consultarDatosReferencia($idCredito) {
        $sql = "SELECT
                  crre_nombre     nombres,
                  crre_apellido   apellidos,
                  crre_telcelular celular
                FROM crre_crereferencia crre
                WHERE crre.cre_ideregistro = :idcredito";
        $resultado = $this->executeQuery($sql, ['idcredito' => $idCredito]);
        return $resultado;
    }

    /**
     * Consulta las ciudades de acuerdo al nombre y 
     * la empresa parametrizada 
     * @param int $idEmpresa identificador de la empresa 
     * @param string $nombreCiudad Nombre de la ciudad que se quiere buscar
     * @return array Lista de las coincidencias 
     */
    public function consultarCiudadesExpedicionDocumento($idEmpresa, $nombreCiudad) {
        $parametros = [
            'idempresa' => $idEmpresa,
            'nombreciudad' => "%$nombreCiudad%"
        ];
        $sql = "select ciu.ciudad_cod, dep.departamento_nom || ' - ' || ciu.ciudad_nom as 
            nombreciudad
            from ciudades ciu 
                inner join departamentos dep on dep.departamento_cod=ciu.ciudad_coddep 
                inner join empresas emp on emp.empresa_cod=ciu.ciudad_codemp 
                where emp.empresa_sevemp = :idempresa 
                and ciu.ciudad_nom ilike :nombreciudad";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta los tipos de identificación asociados a una empresa 
     * ej: NIT, Cédula, etc
     * @param type $idEmpresa
     * @return type
     */
    public function consultarTiposDocumento($idEmpresa) {
        $sql = "SELECT uni.uni_nombre1, uni.uni_ideregistro 
                FROM uni_unidad uni 
                    INNER JOIN est_estructura est on est.est_ideregistro=uni.est_ideregistro
                    INNER JOIN esem_estempresa esem on esem.est_ideregistro=est.est_ideregistro
                WHERE esem.emp_ideregistro=:idempresa and est.cla_ideregistro=40";
        $resultado = $this->executeQuery($sql, [
            "idempresa" => $idEmpresa
        ]);
        return $resultado;
    }

    /**
     * Consulta la información de la empresa de acuerdo al 
     * identificador de la empresa  
     * @param int $idEmpresa identificador de la empresa 
     * @return array
     */
    public function consultarTiposTercero($idEmpresa) {
        $sql = "select uni.uni_nombre2, uni.uni_ideregistro from uni_unidad uni 
                INNER JOIN est_estructura est on est.est_ideregistro=uni.est_ideregistro
                INNER JOIN esem_estempresa esem on esem.est_ideregistro=est.est_ideregistro
                where esem.emp_ideregistro=:idempresa and uni.uni_nombre2 is not null
                and  est.cla_ideregistro=5 ";

        $resultado = $this->executeQuery($sql, [
            "idempresa" => $idEmpresa
        ]);
        return $resultado;
    }

    /**
     * Consulta todas las variables de calificación de un crédito
     * 
     * @param int $idCredito identificador del crédito
     * @return array Lista de variables y su respectiva calificación
     */
    public function consultarCalificacionCredito($idCredito) {
        $sql = "SELECT
                  dfrm.uni_clavariable  idvariable,
                  dfrm.dfrm_tipo        tipo,
                  dfrm.dfrm_ideregistr  iddetalleformulario,
                  uni.uni_nombre1       nombrevariable,
                  fun.fun_ideregistro   idfuncion,
                  fun_nombre            nombrefuncion,
                  crsc.crsc_score       calificacion,
                  crsc.crsc_vlrformular valor
                FROM crsc_crescore crsc
                  INNER JOIN dfrm_detformulario dfrm ON crsc.dfrm_ideregistr = dfrm.dfrm_ideregistr
                  INNER JOIN uni_unidad uni ON dfrm.uni_clavariable = uni.uni_ideregistro
                  INNER JOIN fun_funcion fun ON fun.fun_ideregistro = dfrm.fun_ideregistro
                WHERE
                  crsc.cre_ideregistro = :idcredito";
        return $this->executeQuery($sql, ['idcredito' => $idCredito]);
    }

    /**
     * Asocia un crédito con una venta realizada
     * @param array  $info
     */
    public function insertarCreditoVenta($info) {
        $data['ven_ideregistro'] = $info['idventa'];
        $data['cre_ideregistro'] = $info['idcredito'];
        $this->insertar($data, 'vecr_vencredito', 'sq_vecr_ideregistr');
    }

    /**
     * De acuerdo al identificador de una empresa se consultan 
     * el tercero que financia
     * @param int $idEmpresa identificador de la empresa 
     * @return int identificador del tercero que está asociada a la empresa 
     * @throws MyException Error al consultar la información
     */
    public function consultarEmpresaFinanciaId($idEmpresa) {
        $sql = "SELECT ter.ter_ideregistro idtercerofinancia
                FROM ter_tercero ter
                  INNER JOIN empresas emp ON ter.ter_ideregistro = emp.ter_idegenerico
                WHERE emp.empresa_sevemp = :idempresa ";

        $resultado = $this->executeQuery($sql, ['idempresa' => $idEmpresa]);
        if (empty($resultado)) {
            throw new MyException('Error al consultar la empresa que financia', -1);
        }
        return $resultado[0]['idtercerofinancia'];
    }

    public function insertarTercero($info) {
        $data['ter_documento'] = $info['documento'];
        $data['uni_tipidentifica'] = $info['uni_tipidentifica'];
        $data['ter_nombre'] = strtoupper($info['ter_nombre']);
        $data['ter_apellido'] = strtoupper($info['ter_apellido']);
        $data['ter_nomcompleto'] = strtoupper($data['ter_nombre'] . ' ' . $data['ter_apellido']);
        $data['ter_sexo'] = $info['sexo'];
        $data['ter_telcelular'] = $info['telefonocelular'];
        $data['ter_telfijo'] = $info['ter_telfijo'];
        $data['est_tiptercero'] = 5;
        $data['uni_tiptercero'] = 19;
        $data['ter_correo'] = $info['ter_correo'];
        $data['ter_fecnacimiento'] = $info['ter_fecnacimiento'];
        $data['ciudad_cod'] = $info['ciudad_cod'];
        return $this->insertar($data, 'ter_tercero', 'ter_ideregistro');
    }

}
