<?php

namespace Libranza\LibranzaBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AnularModel
 *
 * @author sergio vargas
 */
class RegistroCreditoModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    public function insertarCredito(array $credito) {
        return parent::insertar($credito, 'cre_credito', 'sq_cre_ideregistro');
    }

    public function insertarAdjunto(array $credito) {
        return parent::insertar($credito, 'adcr_adjcredito', 'sq_adcr_ideregistr');
    }

    public function actualizarAdjunto($parametros) {
        return parent::actualizar($parametros, 'adcr_adjcredito', 'adcr_ideregistr =:adcr_ideregistr');
    }

    /**
     * permite ingresar la información basica de la solicitud de crédito
     * @param array $informacionBasica información de usuario para la solicitud de crédito
     * @return int identificador de la información básica 
     */
    public function insertarInformacionbasica(array $informacionBasica) {
        return parent::insertar($informacionBasica, 'crib_creinfbasica', 'sq_crib_ideregistr');
    }

    /**
     * permite ingresar la información financiera de la solicitud de crédito
     * @param array $informaciónFinanciera información de usuario para la solicitud de crédito
     * @return int identificador de la información financiera
     */
    public function insertarInformacionFinanciera(array $informaciónFinanciera) {
        return parent::insertar($informaciónFinanciera, 'crif_creinfinancie', 'sq_crif_ideregistr');
    }

    /**
     * permite ingresar la información financiera de la solicitud de crédito
     * @param array $experienciaFinanciera información de usuario para la solicitud de crédito
     * @return int identificador de la información financiera
     */
    public function insertarExperienciaFinanciera(array $experienciaFinanciera) {
        return parent::insertar($experienciaFinanciera, 'cref_crexpfinancie', 'sq_cref_ideregistr');
    }

    /**
     * permite ingresar la información de los activos en la solicitud de crédito
     * @param array $activos información de activos del usuario para la solicitud de crédito
     * @return int identificador de los activos
     */
    public function insertarActivos(array $activos) {
        return parent::insertar($activos, 'crac_creactivo', 'sq_crac_ideregistr');
    }

    /**
     * permite ingresar la información de la referencia en la solicitud de crédito
     * @param array $referencia información de activos del usuario para la solicitud de crédito
     * @return int identificador de la referencia
     */
    public function insertarReferencias(array $referencia) {
        return parent::insertar($referencia, 'crre_crereferencia', 'sq_crre_ideregistr');
    }

    /**
     * permite ingresar la información basica de la solicitud de crédito
     * @param array $actividadEconomica información de usuario para la solicitud de crédito
     * @return int identificador de la información básica 
     */
    public function insertarActividadEconomica(array $actividadEconomica) {
        return parent::insertar($actividadEconomica, 'crae_creacteconomica', 'sq_crae_ideregistr');
    }

    /**
     * permite ingresar la información basica de la solicitud de crédito
     * @param array $polizaSeguros información de usuario para la solicitud de crédito
     * @return int identificador de la información básica 
     */
    public function insertarPolizaSeguros(array $polizaSeguros) {
        return parent::insertar($polizaSeguros, 'crpo_crepoliza', 'sq_crpo_ideregistr');
    }

    /**
     * PErmite construiri un tercero 
     * @param array $terceros información del tercero
     * @return type
     */
    public function insertarTerceros(array $terceros) {
        return parent::insertar($terceros, 'ter_tercero', 'sq_ter_ideregistro');
    }

    /**
     * Permite crear una clasificacion para un tercero 
     * @param array $cltTerceros información de la clasificacion
     * @return type
     */
    public function insertarCltTerceros(array $cltTerceros) {
        return parent::insertar($cltTerceros, 'clte_clatercero','sq_clte_ideregistr');
    }

    /**
     * PErmite construir una propiedad
     * @param array $parametros información del tercero
     * @return type
     */
    public function insertarPropiedad(array $parametros) {
        return parent::insertar($parametros, 'pro_propiedad', 'sq_pro_ideregistro');
    }

    /**
     * permite construir un nuevo suscriptor
     * @param array $parametros parámetros de inserción
     * @return type
     */
    public function insertarSuscriptor(array $parametros) {
        return parent::insertar($parametros, 'sus_suscripcion', 'sq_sus_ideregistro');
    }

    public function insertarSuscripcion(array $parametros) {
        return parent::insertar($parametros, 'dsus_detsuscrip', 'sq_dsus_ideregistr');
    }

    /**
     * permite realizar una actualización del crédito
     * @param array $credito
     * @return type
     */
    public function actualizarCredito(array $credito) {
        return parent::actualizar($credito, 'cre_credito', 'cre_ideregistro=:cre_ideregistro');
    }

    /**
     * permite actualizar una propiedad
     * @param array $idpropiedad identificador de la propiedad
     * @return type
     */
    public function actualizarPropiedad($idpropiedad) {
        $parametros['pro_ideregistro'] = $idpropiedad;
        $parametros['pro_idepropieda'] = $idpropiedad;
        $parametros['pro_numcatastral'] = $idpropiedad;
        return parent::actualizar($parametros, 'pro_propiedad', 'pro_ideregistro=:pro_ideregistro');
    }

    /**
     * permite actualizar la suscripción
     * @param int $idsuscripcion identificador de la suscripción
     * @return identificador de la suscripción
     */
    public function actualizarSuscripcion($idsuscripcion, $infoSuscripcion) {
        $parametros['dsus_pcodigo'] = $infoSuscripcion['idmunicipio'] . $infoSuscripcion['idbarrio'] . $idsuscripcion;
        $parametros['dsus_ideregistr'] = $idsuscripcion;
        return parent::actualizar($parametros, 'dsus_detsuscrip', 'dsus_ideregistr=:dsus_ideregistr');
    }

    /**
     * permite obtener un identificador de sector valido
     * @param int $idmunicipio  identificador de municipío
     * @param int $idbarrio  identificador de barrio
     * @return int codigo de sector
     * @throws MyException 'no existe un municipio y un barrio asociado. Por favor comuníquese con el proveedor para parametrizar'
     */
    public function obtenerMunicipioBarrioModel($idmunicipio, $idbarrio) {
        $sql = "SELECT
                        muba_sector sector
                FROM
                        muba_munbarrio
                WHERE
                        uni_barrio = '$idbarrio'
                AND uni_municipio =$idmunicipio";


        $resultado = parent::executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('no existe un municipio y un barrio asociado. Por favor comuníquese con el proveedor para parametrizar', -1);
        }

        return $resultado[0]['sector'];
    }

    public function consultarCredito($parametros) {
        $documento = $parametros['documento'];
        $parametros['nombre'] = '%' . $parametros['nombre'] . '%';
        $sql = "SELECT
                        cre.cre_ideregistro numeroradicado,
                        crib.crib_ideregistr idpersona,
                        cre.cre_fecha fechasolicitud,
                        prdfinanciero.uni_nombre1 productofinanciero,
                        round(cre.cre_monto, 0) montosolicitado,
                        cre.cre_destino destinocredito,
                        cre.cre_plazo plazo,
                        entfinan.ter_nomcompleto entidadfinanciera,
                        entfinan.ter_ideregistro  identidadfinanciera,
                        cre.cre_tipcuenta tipocuentadesembolso,
                        cre.cre_numcuenta numerocuenta,
                        crib.ter_nombre primernombre,
                        crib.ter_apellido primerapellido,
                        tipodocumento.uni_nombre1 tipodocumento,
                        crib.uni_tipidentifica idtipodocumento,
                        crib.ter_documento documento,
                        crib.uni_municipio idmunicipio,
                        crib.uni_barrio idbarrio,
                        ciu.ciudad_nom ciudad,
                        crib.ciudad_cod idciudad,
                        crib.ter_sexo sexo,
                        crib.uni_tippropieda idpropiedad,
                        crib.crib_fecnacimiento fechanacimiento,
                        ciunac.ciudad_nom lugarnacimiento,
                        depnac.departamento_nom departamentonacimiento,
                        paisnac.pais_nom paisnacimiento,
                        estciv.uni_nombre1 estadocivil,
                        crib.crib_percargomenor menoresedad,
                        crib.crib_percargomayor personasacargo,
                        crib.crib_nomconyugue nombreconyugue,
                        crib.crib_apeconyugue apellidoconyugue,
                        crib.crib_tipideconyugue tipodocumentoconyugue,
                        crib.crib_docconyugue documentoconyugue,
                        crib.crib_traconyugue conyuguetrabaja,
                        crib.crib_empconyugue empresaconyugue,
                        crib.crib_telconyugue telefonoconyugue,
                        crib.crib_dirconyugue direccionconyugue,
                        crib.crib_ciuconyugue ciudadconyugue,
                        niveledu.uni_nombre1 niveleducacion,
                        profes.uni_nombre1 profesion,
                        crib.pro_direccion direccion,
                        barter.barrio_nom barrio,
                        munter.proyecto_nom municipio,
                        crib.pro_zona zonaresidencial,
                        departer.departamento_nom departamento,
                        paister.pais_nom pais,
                        crib.crib_telcelular celular,
                        crib.crib_telfijo telefonofijo,
                        crib.crib_correo correo,
                        crib_diaresidencia dias,
                        tipvivienda.uni_nombre1 tipovivienda,
                        envcorr.uni_nombre1 enviocorrespondencia,
                        round(crib_vlrarriendo, 0) valorarriendo,
                        pro_catestrato estrato,
                        poliz.crpo_nombre nombrebeneficiario,
                        poliz.crpo_apellido apellidobeneficiario,
                        poliz.crpo_documento numerodocumentobeneficiario,
                        poliz.crpo_tipidentifica tipoidentificacion,
                        parenpoliz.uni_nombre1 parentescobeneficiario,
                        round(crif.crif_salario, 0) salariobasico,
                        round(crif.crif_horextra, 0) otrosingresos,
                        round(crif.crif_ingarriendo, 0) otrosingresosarriendo,
                        round(crif.crif_gashogar, 0) gastoshogar,
                        round(crif.crif_cuovivienda, 0) arriendocuotavivienda,
                        round(crif.crif_cuobanco, 0) cuotabanco,
                        round(crif.crif_otrgasto, 0) otrosgastos,
                        round(crif.crif_topasivo, 0) totalpasivos,
                        crif.crif_ingdescripcion descripcionotrosingresos,
                        crif.crif_decrenta declararenta,
                        round(cre.cre_porseguro, 3) seguro,
                        cre.uni_liquidacion idliquidacion,
                        round(cre.cre_vlrestudio, 0) estudiocredito
                FROM
                        cre_credito cre
                LEFT JOIN crib_creinfbasica crib ON crib.cre_ideregistro = cre.cre_ideregistro
                LEFT JOIN uni_unidad prdfinanciero ON prdfinanciero.uni_ideregistro = cre.uni_prdfinanciero
                LEFT JOIN ter_tercero entfinan ON entfinan.ter_ideregistro = cre.ter_idefinanciera
                LEFT JOIN uni_unidad tipodocumento ON tipodocumento.uni_ideregistro = crib.uni_tipidentifica
                LEFT JOIN ciudades ciu ON ciu.ciudad_cod = crib.ciudad_cod
                LEFT JOIN ciudades ciunac ON ciunac.ciudad_cod = crib.ciudad_codnacimien
                LEFT JOIN departamentos depnac ON depnac.departamento_cod = ciunac.ciudad_coddep
                LEFT JOIN paises paisnac ON paisnac.pais_cod = depnac.departamento_codpai
                LEFT JOIN uni_unidad estciv ON estciv.uni_ideregistro = crib.uni_estcivil
                LEFT JOIN uni_unidad niveledu ON niveledu.uni_ideregistro = crib.uni_niveducativo
                LEFT JOIN uni_unidad profes ON profes.uni_ideregistro = crib.uni_profesion
                LEFT JOIN barrios barter ON barter.barrio_ideregistro = crib.uni_barrio
                LEFT JOIN proyectos munter ON munter.proyecto_ideregistro = crib.uni_municipio
                LEFT JOIN  empresas empresa ON munter.proyecto_codemp = empresa.empresa_cod
                LEFT JOIN departamentos departer ON departer.departamento_ideregistro = munter.departamento_ideregistro
                LEFT JOIN paises paister ON paister.pais_cod = departer.departamento_codpai
                LEFT JOIN uni_unidad tipvivienda ON tipvivienda.uni_ideregistro = crib.uni_tippropieda
                LEFT JOIN uni_unidad envcorr ON envcorr.uni_ideregistro = crib.uni_tipenvio
                LEFT JOIN crpo_crepoliza poliz ON poliz.cre_ideregistro = cre.cre_ideregistro
                AND poliz.crib_ideregistr = crib.crib_ideregistr
                LEFT JOIN uni_unidad parenpoliz ON parenpoliz.uni_ideregistro = poliz.uni_parentesco
                LEFT JOIN crif_creinfinancie crif ON crif.cre_ideregistro = cre.cre_ideregistro
                AND crif.crib_ideregistr = crib.crib_ideregistr
                WHERE
                        empresa.empresa_sevemp= :idempresa AND
                        cre.uni_creetapa = :estado
                AND (
                        cre.cre_ideregistro = :idcredito 
                        OR crib.ter_documento = '$documento'
                        OR trim(crib.ter_nomcompleto) ILIKE :nombre
                )";

        return parent::executeQuery($sql, $parametros);
    }

    public function consultarCreditoEstudio ($parametros) {
        $documento = $parametros['documento'];
        $parametros['nombre'] = '%' . $parametros['nombre'] . '%';
        $sql = "SELECT
                        cre.cre_ideregistro numeroradicado,
                        crib.crib_ideregistr idpersona,
                        cre.cre_fecha fechasolicitud,
                        prdfinanciero.uni_nombre1 productofinanciero,
                        0 montosolicitado,
                        cre.cre_destino destinocredito,
                        1 plazo,
                        entfinan.ter_nomcompleto entidadfinanciera,
                        entfinan.ter_ideregistro  identidadfinanciera,
                        cre.cre_tipcuenta tipocuentadesembolso,
                        cre.cre_numcuenta numerocuenta,
                        crib.ter_nombre primernombre,
                        crib.ter_apellido primerapellido,
                        tipodocumento.uni_nombre1 tipodocumento,
                        crib.uni_tipidentifica idtipodocumento,
                        crib.ter_documento documento,
                        crib.uni_municipio idmunicipio,
                        crib.uni_barrio idbarrio,
                        ciu.ciudad_nom ciudad,
                        crib.ciudad_cod idciudad,
                        crib.ter_sexo sexo,
                        crib.uni_tippropieda idpropiedad,
                        crib.crib_fecnacimiento fechanacimiento,
                        ciunac.ciudad_nom lugarnacimiento,
                        depnac.departamento_nom departamentonacimiento,
                        paisnac.pais_nom paisnacimiento,
                        estciv.uni_nombre1 estadocivil,
                        crib.crib_percargomenor menoresedad,
                        crib.crib_percargomayor personasacargo,
                        crib.crib_nomconyugue nombreconyugue,
                        crib.crib_apeconyugue apellidoconyugue,
                        crib.crib_tipideconyugue tipodocumentoconyugue,
                        crib.crib_docconyugue documentoconyugue,
                        crib.crib_traconyugue conyuguetrabaja,
                        crib.crib_empconyugue empresaconyugue,
                        crib.crib_telconyugue telefonoconyugue,
                        crib.crib_dirconyugue direccionconyugue,
                        crib.crib_ciuconyugue ciudadconyugue,
                        niveledu.uni_nombre1 niveleducacion,
                        profes.uni_nombre1 profesion,
                        crib.pro_direccion direccion,
                        barter.barrio_nom barrio,
                        munter.proyecto_nom municipio,
                        crib.pro_zona zonaresidencial,
                        departer.departamento_nom departamento,
                        paister.pais_nom pais,
                        crib.crib_telcelular celular,
                        crib.crib_telfijo telefonofijo,
                        crib.crib_correo correo,
                        crib_diaresidencia dias,
                        tipvivienda.uni_nombre1 tipovivienda,
                        envcorr.uni_nombre1 enviocorrespondencia,
                        round(crib_vlrarriendo, 0) valorarriendo,
                        pro_catestrato estrato,
                        poliz.crpo_nombre nombrebeneficiario,
                        poliz.crpo_apellido apellidobeneficiario,
                        poliz.crpo_documento numerodocumentobeneficiario,
                        poliz.crpo_tipidentifica tipoidentificacion,
                        parenpoliz.uni_nombre1 parentescobeneficiario,
                        round(crif.crif_salario, 0) salariobasico,
                        round(crif.crif_horextra, 0) otrosingresos,
                        round(crif.crif_ingarriendo, 0) otrosingresosarriendo,
                        round(crif.crif_gashogar, 0) gastoshogar,
                        round(crif.crif_cuovivienda, 0) arriendocuotavivienda,
                        round(crif.crif_cuobanco, 0) cuotabanco,
                        round(crif.crif_otrgasto, 0) otrosgastos,
                        round(crif.crif_topasivo, 0) totalpasivos,
                        crif.crif_ingdescripcion descripcionotrosingresos,
                        crif.crif_decrenta declararenta,
                        0 seguro,
                        1502 idliquidacion, -- Liq int. 0
                        round(cre.cre_vlrestudio, 0) estudiocredito
                FROM
                        cre_credito cre
                LEFT JOIN crib_creinfbasica crib ON crib.cre_ideregistro = cre.cre_ideregistro
                LEFT JOIN uni_unidad prdfinanciero ON prdfinanciero.uni_ideregistro = cre.uni_prdfinanciero
                LEFT JOIN ter_tercero entfinan ON entfinan.ter_ideregistro = cre.ter_idefinanciera
                LEFT JOIN uni_unidad tipodocumento ON tipodocumento.uni_ideregistro = crib.uni_tipidentifica
                LEFT JOIN ciudades ciu ON ciu.ciudad_cod = crib.ciudad_cod
                LEFT JOIN ciudades ciunac ON ciunac.ciudad_cod = crib.ciudad_codnacimien
                LEFT JOIN departamentos depnac ON depnac.departamento_cod = ciunac.ciudad_coddep
                LEFT JOIN paises paisnac ON paisnac.pais_cod = depnac.departamento_codpai
                LEFT JOIN uni_unidad estciv ON estciv.uni_ideregistro = crib.uni_estcivil
                LEFT JOIN uni_unidad niveledu ON niveledu.uni_ideregistro = crib.uni_niveducativo
                LEFT JOIN uni_unidad profes ON profes.uni_ideregistro = crib.uni_profesion
                LEFT JOIN barrios barter ON barter.barrio_ideregistro = crib.uni_barrio
                LEFT JOIN proyectos munter ON munter.proyecto_ideregistro = crib.uni_municipio
                LEFT JOIN  empresas empresa ON munter.proyecto_codemp = empresa.empresa_cod
                LEFT JOIN departamentos departer ON departer.departamento_ideregistro = munter.departamento_ideregistro
                LEFT JOIN paises paister ON paister.pais_cod = departer.departamento_codpai
                LEFT JOIN uni_unidad tipvivienda ON tipvivienda.uni_ideregistro = crib.uni_tippropieda
                LEFT JOIN uni_unidad envcorr ON envcorr.uni_ideregistro = crib.uni_tipenvio
                LEFT JOIN crpo_crepoliza poliz ON poliz.cre_ideregistro = cre.cre_ideregistro
                AND poliz.crib_ideregistr = crib.crib_ideregistr
                LEFT JOIN uni_unidad parenpoliz ON parenpoliz.uni_ideregistro = poliz.uni_parentesco
                LEFT JOIN crif_creinfinancie crif ON crif.cre_ideregistro = cre.cre_ideregistro
                AND crif.crib_ideregistr = crib.crib_ideregistr
                WHERE 
                        empresa.empresa_sevemp= :idempresa AND
                        cre.uni_creetapa = :estado AND
                        round(cre.cre_vlrestudio, 0) > 0 
                AND (
                        cre.cre_ideregistro = :idcredito 
                        OR crib.ter_documento = '$documento'
                        OR trim(crib.ter_nomcompleto) ILIKE :nombre
                )";

        return parent::executeQuery($sql, $parametros);
    }

    public function consultarCreditoAprobados($parametros) {
        $sql = "select * from credito where estado=:estado ";
        return parent::executeQuery($sql, $parametros);
    }

    /**
     * permite realizar la validación de un tercero
     * @param int $documento identificador de documento
     * @return int coincidencia
     */
    public function validarTerceroModel($documento) {
        $sql = "SELECT ter_ideregistro
                FROM ter_tercero
                WHERE ter_documento = '$documento' ";

        $respuesta = parent::executeQuery($sql);
        if (empty($respuesta)) {
            return $respuesta;
        }
        return $respuesta[0]['ter_ideregistro'];
    }

    /**
     * permite realizar la validación de la clasificacion de un tercero
     * @param int id_tercero identificador del tercero
     * @param int uni_clatercero
     */
    public function validarCltTerceroModel($id_tercero, $id_clt , $empresa) {
        $sql = "SELECT cltt.* 
                FROM clte_clatercero  cltt
                    INNER JOIN uni_unidad uun ON uun.uni_ideregistro = cltt.uni_clatercero
                    INNER JOIN esem_estempresa esee ON esee.est_ideregistro = uun.est_ideregistro
                        AND emp_ideregistro = $empresa 
                WHERE ter_ideregistro = $id_tercero 
                    and uni_clatercero = $id_clt";

        $respuesta = parent::executeQuery($sql);
        if (empty($respuesta)) {
            return $respuesta;
        }
        return $respuesta[0]['clte_ideregistr'];
    }

    /**
     * permite realizar la validación si existe una Suscripcion para un tercero
     * @param int $terIderegistro identificador del tercero
     * @return int coincidencia
     */
    public function validarSuscripcionModel($parametros) {
        $complemento = " AND dss.est_tipsuscripc = :est_tipsuscripc "
                . "AND dss.uni_tipsuscripc = :uni_tipsuscripc "
                . "AND dss.est_tipusosuscr = :est_tipusosuscr "
                . "AND dss.uni_tipusosuscr = :uni_tipusosuscr "
                . "AND dss.est_liquidacion = :est_liquidacion "
                . "AND dss.uni_liquidacion = :uni_liquidacion "
                . "AND dss.emp_ideregistro = :emp_ideregistro "
                . "AND dss.ter_ideregistro = :ter_ideregistro "  ;    
        
        $sql = "SELECT dss.dsus_ideregistr , dss.sus_ideregistro , 
                    dss.pro_ideregistro , fin_fecha
                FROM dsus_detsuscrip dss 
                    INNER JOIN fin_financiacio fnn ON fnn.dsus_ideregistr = dss.dsus_ideregistr
                        AND fin_sdocapital > 0  
                WHERE  dsus_estado = 'A' " . $complemento 
                . " ORDER BY fin_fecha DESC LIMIT 1 ";
                
        $respuesta = parent::executeQuery($sql,$parametros);
        if (empty($respuesta)) {
            
            $sql = "SELECT dss.dsus_ideregistr , dss.sus_ideregistro , 
                        dss.pro_ideregistro , dsus_fecinicio
                    FROM dsus_detsuscrip dss 
                    WHERE dsus_estado = 'A' " . $complemento .
                    "ORDER BY dsus_fecinicio DESC LIMIT 1 ";
                       
            $respuesta = parent::executeQuery($sql,$parametros);
            
            if (empty($respuesta))
            { 
                return $respuesta;
            }         
        }
        return $respuesta[0];
    }

    /**
     * Obtiene la actividad economica del solicitante
     * @param int $idcredito identificador del crédito
     * @param int $idpersona identificador de la persona
     * @return Array información del solicitante
     */
    public function consultarActividadEconomicaModel($idcredito, $idpersona) {
        $parametros['idcredito'] = $idcredito;
        $parametros['idpersona'] = $idpersona;

        $sql = "SELECT
                        acteco.uni_nombre1 actividadeconomica,
                        ter.ter_nomcompleto empresaempleado,
                        crae.crae_ingempresa fechaingresoempleado,
                        crae.crae_telempresa telefonoempleado,
                         ter.ter_documento nitempresaempleado,
                        tipcar.uni_nombre1 tipocargoempleado,
                        tipcon.uni_nombre1 tipocontratoempleado,
                        round(crae.crae_salbasico,0) salariobasicoempleado,
                        round(crae.crae_dednomina,0) deduccionesnominaempleado,
                        round(crae.crae_saldevengado,0) salarionetoempleado
                FROM
                        crae_creacteconomica crae
                INNER JOIN uni_unidad acteco ON crae.uni_profesion = acteco.uni_ideregistro
                LEFT JOIN ter_tercero ter ON ter.ter_ideregistro = crae.ter_ideempresa
                INNER JOIN uni_unidad tipcar ON tipcar.uni_ideregistro = crae.uni_tipcargo
                INNER JOIN uni_unidad tipcon ON tipcon.uni_ideregistro = crae.uni_tipcontrato
                WHERE
                        crae.cre_ideregistro = :idcredito
                AND crae.crib_ideregistr = :idpersona";
        return parent::executeQuery($sql, $parametros);
    }

    /**
     * Permite consultar las referencias 
     * @param int $idcredito identificador de crédito
     * @param int $idpersona identificador de solicitante
     */
    public function consultarReferenciasModel($idcredito, $idpersona, $tiporeferencia) {
        $sql = "SELECT
                        crre.crre_nombre nombrereferencia,
                        crre.crre_apellido apellidoreferencia,
                        crre_telcelular celularreferencia,
                        crre_telfijo telefonoreferencia,
                        crre_direccion direccionreferencia,
                        paren.uni_nombre1 parentescoreferencia,
                        prof.uni_nombre1 ocupacionreferencia,
                        ciu.ciudad_nom ciudadreferencia,
                        dep.departamento_nom departamentoreferencia
                FROM
                        crre_crereferencia crre
                LEFT JOIN uni_unidad paren ON paren.uni_ideregistro = crre.uni_parentesco
                LEFT JOIN uni_unidad prof ON prof.uni_ideregistro = crre.uni_profesion
                LEFT JOIN ciudades ciu ON ciu.ciudad_cod = crre.ciudad_cod
                LEFT JOIN departamentos dep ON dep.departamento_cod = ciu.ciudad_coddep
                WHERE
                        crre.cre_ideregistro = $idcredito
                AND crre.crib_ideregistr = $idpersona
                AND crre_tipreferencia = '$tiporeferencia'";
        return parent::executeQuery($sql);
    }

    /**
     * Permite consultar las referencias 
     * @param int $idcredito identificador de crédito
     * @param int $idpersona identificador de solicitante
     */
    public function consultarExperienciaFinancieraModel($idcredito, $idpersona) {
        $sql = "SELECT
                        uni_nombre1 productofinanciero,
                        cref.cref_prdcantidad cantidad
                FROM
                        cref_crexpfinancie cref
                INNER JOIN uni_unidad prod ON prod.uni_ideregistro = cref.uni_prdfinanciero
                WHERE
                        cref.cre_ideregistro = $idcredito
                AND cref.crib_ideregistr = $idpersona";
        return parent::executeQuery($sql);
    }

    /**
     * Permite consultar las referencias 
     * @param int $idcredito identificador de crédito
     * @param int $idpersona identificador de solicitante
     */
    public function consultarActivosModel($idcredito, $idpersona) {
        $sql = "SELECT
                        tipa.uni_nombre1 tipoactivo,
                        crac_detalle detalle,
                        crac_pladireccion placadireccion,
                        round(crac_vlrcomercial,0) valorcomercial,
                        ciu.ciudad_nom ciudad
                FROM
                        crac_creactivo crac
                INNER JOIN uni_unidad tipa ON tipa.uni_ideregistro = crac.uni_tipactivo
                LEFT JOIN ciudades ciu ON ciu.ciudad_cod = crac.ciudad_cod
                WHERE
                        crac.cre_ideregistro = $idcredito
                AND crac.crib_ideregistr = $idpersona";
        return parent::executeQuery($sql);
    }

    /**
     * permite consultar un tercero por clase
     * @param int $idclase identificador de la clase
     * @return type
     */
    public function consultarTerceroPorClase($idclase) {
        $sql = "SELECT
                        clt.ter_ideregistro idtercero,
                        ter.ter_nomcompleto nombretercero,
                        ter.ter_documento documento
                FROM
                        clte_clatercero clt
                INNER JOIN ter_tercero ter ON clt.ter_ideregistro = ter.ter_ideregistro
                WHERE
                        clt.uni_clatercero = $idclase";
        return parent::executeQuery($sql);
    }

    /**
     * permite cambiar el estado de validación de crédito
     * @param type $idcredito
     * @param type $estadoCredito
     * @return int validacion de crédito
     */
    public function validarCredito($idcredito, $estadoCredito) {
        $parametros['cre_ideregistro'] = $idcredito;
        $parametros['uni_creetapa'] = $estadoCredito;
        return parent::actualizar($parametros, 'cre_credito', 'cre_ideregistro=:cre_ideregistro');
    }

    /**
     * permite insertar un nuevo comentario
     * @param int $idcredito identificador de crédito
     * @param  $estadoCredito
     * @return int validacion de crédito
     */
    public function insertarComentarioCredito($idcredito, $idmotivo, $estadoCredito, $comentarios) {
        $parametros['crco_fecha'] = 'now()';
        $parametros['cre_ideregistro'] = $idcredito;
        $parametros['uni_creetapa'] = $estadoCredito;
        $parametros['crco_comentario'] = $comentarios;
        $parametros['uni_motetapa'] = $idmotivo;
        return parent::insertar($parametros, 'crco_crecomentario', 'sq_crco_ideregistr');
    }

    /**
     * permite construir un nuevo formulario
     * @param string $nombre nombre de formulario
     * @param date $fechainicial fecha inicial del formulario
     * @param date $fechafinal fecha final del formulario
     * @return int identificador del formulario construido
     */
    public function insertarFormularioParametrizacionScoringCredito($nombre, $fechainicial, $fechafinal) {
        $parametros['frm_fecha'] = 'now()';
        $parametros['frm_nombre'] = $nombre;
        $parametros['frm_estado'] = 'A';
        $parametros['frm_inivigencia'] = $fechainicial;
        $parametros['frm_finvigencia'] = $fechafinal;
        return parent::insertar($parametros, 'frm_formulario', 'sq_frm_ideregistro');
    }

    /**
     * permite construir un detalle de formulario
     * @param int $idformulario identificador de formulario
     * @param int $idvariable identificador de la variable
     * @param int $idfuncion identificador de la función
     * @return int identificador del detalle del formulario
     */
    public function insertarDetalleFormularioParametrizacionScoringCredito($idformulario, $idvariable, $idfuncion, $tipo) {
        $parametros['dfrm_tipo'] = $tipo;
        $parametros['dfrm_estado'] = 'A';
        $parametros['fun_ideregistro'] = $idfuncion;
        $parametros['uni_clavariable'] = $idvariable;
        $parametros['frm_ideregistro'] = $idformulario;
        return parent::insertar($parametros, 'dfrm_detformulario', 'sq_dfrm_ideregistr');
    }

    /**
     * permite asociar el producto financiero con el formulario seleccionado
     * @param int $idformulario identificador de formulario
     * @param type $idproductofinanciero identificador producto financiero
     * @return int indetificador de la asociacion 
     */
    public function insertarAsociacionParametrizacionScoringCredito($idformulario, $idproductofinanciero) {
        $parametros['uni_prdfinanciero'] = $idproductofinanciero;
        $parametros['frm_ideregistro'] = $idformulario;
        return parent::insertar($parametros, 'prfr_prdformulario', null);
    }

    /**
     * permite inseertar una calificación
     * @param int $nombrevariable identificador de la variable
     * @param int $score puntaje calculado
     * @param int $idcredito identificador del crédito
     * @param int $puntaje puntaje obtenido por propiedad
     * @return int identificador de la calificación 
     */
    public function insertarCalificacionScoringCredito($nombrevariable, $score, $idcredito, $valor, $idfuncion) {
        $parametros['crsc_variable'] = $nombrevariable;
        $parametros['dfrm_score'] = $score;
        $parametros['crsc_score'] = $score;
        $parametros['cre_ideregistro'] = $idcredito;
        $parametros['crsc_vlrformular'] = $valor;
        $parametros['dfrm_ideregistr'] = $idfuncion;
        return parent::insertar($parametros, 'crsc_crescore', 'sq_crsc_ideregistr');
    }

    /**
     * permite obtener el correo electronico del solicitante
     * @param int $idcredito identificador de crédito
     * @return varchar correo electronico
     */
    public function obtenerCorreo($idcredito) {

        $sql = "SELECT  cre.cre_ideregistro idcredito ,crib.ter_nombre ||' '|| ter_apellido nombre ,
                etapa.uni_nombre1 etapa, crib_correo correo, cre.cre_fecha fechacredito, uni_codigo1 codigo 
                ,cre.cre_monto::INTEGER , cre.fin_ideregistro as id_financiacion 
                FROM cre_credito cre
                INNER JOIN crib_creinfbasica crib on cre.cre_ideregistro = crib.cre_ideregistro
                INNER JOIN uni_unidad etapa ON etapa.uni_ideregistro = cre.uni_creetapa  
                WHERE cre.cre_ideregistro = $idcredito";

        $respuesta = parent::executeQuery($sql);
        if (empty($respuesta)) {
            return null;
        }
        return $respuesta[0];
    }

    /**
     * permite obtener el historico de los comentarios
     * @param int $idcredito identificador de crédito
     * @return Array listado de comentarios
     */
    public function obtenerComentariosModel($idcredito) {
        $sql = "SELECT
                        crco.crco_fecha fecha,
                        crco_comentario comentario,
                        etapa.uni_nombre1 etapa,
                        moti.uni_nombre1 motivo
                FROM
                        crco_crecomentario crco
                INNER JOIN uni_unidad etapa ON etapa.uni_ideregistro = crco.uni_creetapa
                INNER JOIN uni_unidad moti ON moti.uni_ideregistro = crco.uni_motetapa
                WHERE
                        cre_ideregistro =$idcredito";

        $respuesta = parent::executeQuery($sql);
        if (empty($respuesta)) {
            return null;
        }
        return $respuesta;
    }

    /**
     * permite listar los formularios de la parámetrización
     * @return type
     */
    public function obtenerFormulariosModel() {

        $sql = "SELECT
                    frm_ideregistro idformulario,
                    frm_nombre formulario
                FROM frm_formulario";

        return parent::executeQuery($sql);
    }

    /**
     * permite listar los formularios de la parámetrización
     * @return type
     */
    public function obtenerFormulariosParametrizacionModel($idproducto) {

        $sql = "SELECT
                    form.frm_ideregistro idformulario,
                    form.frm_nombre formulario
                FROM
                    prfr_prdformulario pform
                INNER JOIN frm_formulario form ON pform.frm_ideregistro = form.frm_ideregistro
                WHERE
                    pform.uni_prdfinanciero = $idproducto";

        return parent::executeQuery($sql);
    }

    /**
     * permite listar los formularios de la parámetrización
     * @return type
     */
    public function obtenerFuncionesCreditoModel() {
        $sql = "SELECT
                    fun_nombre nombre,
                    fun_ideregistro idfuncion,
                    fun_ubicacion ubicacion,
                    fun_parametro parametros,
                    fun_descripcion descripcion
                FROM
                        fun_funcion
                WHERE
                        fun_tipo = 'C'";

        return parent::executeQuery($sql);
    }

    public function obtenerCreditosAprobadosModel($idestado) {
        $sql = "SELECT
                        crib.ter_nomcompleto nombre,
                        crib.ter_documento documento,
                        to_char(cre.cre_fecha, 'yyyy-mm-dd') fecha,
                        cre.cre_ideregistro radicado,
                        round(cre.cre_monto, 0) valor,
                        cre.cre_plazo plazo,
                        CAST (
                                SUBSTRING (
                                        con_formula,
                                        '(([0-9].)(\d+))'
                                ) AS FLOAT
                        ) interes,
                        cre.cre_porseguro seguro,
                        cre.cre_vlrestudio estudiocredito
                FROM
                        cre_credito cre
                INNER JOIN crib_creinfbasica crib ON crib.cre_ideregistro = cre.cre_ideregistro
                INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion = cre.uni_liquidacion
                INNER JOIN coli_conliquida coli ON coli.uni_liquidacion = cre.uni_liquidacion
                INNER JOIN con_concepto con ON con.uni_concepto = coli.uni_concepto
                WHERE
                        liq.liq_venclasific = 'FI'
                AND cre.uni_creetapa = $idestado
                AND con.con_intfinanciacion = 'S';";

        return parent::executeQuery($sql);
    }

    public function obtenerInteresCredito($idCredito) {
        $sql = "SELECT
                        CAST (
                                SUBSTRING (
                                        con_formula,
                                        '(([0-9].)(\d+))'
                                ) AS FLOAT
                        ) interes
                                FROM
                        cre_credito cre
                LEFT JOIN crib_creinfbasica crib ON crib.cre_ideregistro = cre.cre_ideregistro
                LEFT JOIN liq_liquidacion liq ON liq.uni_liquidacion = cre.uni_liquidacion
                LEFT JOIN coli_conliquida coli ON coli.uni_liquidacion = liq.uni_liquidacion
                LEFT JOIN con_concepto con ON con.uni_concepto = coli.uni_concepto
                WHERE
                        liq.liq_venclasific = 'FI' AND con.con_intfinanciacion='S'
                AND cre.cre_ideregistro = $idCredito";
        $respuesta = parent::executeQuery($sql);
        if (empty($respuesta)) {
            return null;
        }
        return $respuesta[0];
    }

    /**
     * permite listar las variables de crédito
     * @return type
     */
    public function obtenerVariablesCreditoModel($idformulario) {
        $sql = "SELECT
                        uni_clavariable idvariable,
                        dfrm_tipo tipo,
                        dfrm_ideregistr idregistro,
                        uni.uni_nombre1 nombrevariable,
                        fun.fun_ideregistro idfuncion,
                        fun_nombre nombrefuncion
                FROM
                        dfrm_detformulario dfrm
                LEFT JOIN uni_unidad uni ON uni.uni_ideregistro = dfrm.uni_clavariable
                LEFT JOIN fun_funcion fun ON fun.fun_ideregistro = dfrm.fun_ideregistro
                WHERE
                        frm_ideregistro = '$idformulario'
                AND dfrm_estado = 'A'";

        return parent::executeQuery($sql);
    }

    /**
     * permite obtener los archivos adjuntos por crédito
     * @param int $idcredito identificador de crédito
     * @return Array listado de adjuntos
     */
    public function ConsultarArchivosAdjuntosModel($idcredito) {

        $sql = "SELECT
                        adcr_nomarchivo nombrearchivo,
                        adcr_ruta ruta,
                        adcr_tiparchivo tipo
                FROM
                        adcr_adjcredito
                WHERE
                        cre_ideregistro =$idcredito";

        return parent::executeQuery($sql);
    }

    /**
     * 
     * @param type $idvariable
     * @return type
     * @throws MyException
     */
    public function obtenerVariablesfuncionModel($idcredito) {
        $sql = "SELECT
                    dfrm.uni_clavariable idvariable,
                    uni.uni_nombre1 nombrevariable,
                    fun.fun_nombre nombrefuncion,
                    fun.fun_parametro parametro,
                    dfrm.fun_ideregistro idfuncion,
                    dfrm.dfrm_tipo tipovariable
                FROM
                    prfr_prdformulario prfr
                INNER JOIN cre_credito cre ON prfr.uni_prdfinanciero = cre.uni_prdfinanciero
                INNER JOIN frm_formulario frm ON frm.frm_ideregistro = prfr.frm_ideregistro
                INNER JOIN dfrm_detformulario dfrm ON frm.frm_ideregistro = dfrm.frm_ideregistro
                INNER JOIN uni_unidad uni ON dfrm.uni_clavariable = uni.uni_ideregistro
                INNER JOIN fun_funcion fun ON fun.fun_ideregistro = dfrm.fun_ideregistro
                WHERE
                    cre.cre_ideregistro = $idcredito AND dfrm_estado = 'A'  ORDER BY uni.uni_orden";

        $respuesta = parent::executeQuery($sql);

        if (empty($respuesta)) {
            throw new MyException('no existen calificaciones parametrizadas', -1);
        }

        return $respuesta;
    }

    /**
     * Obtiene la calificacion que tiene el credito evaluando las diferentes
     * funciones almacenadas
     * @param type $idcredito
     * @param type $idfuncion
     * @return type
     */
    public function obtenerCalificacionModel($idcredito, $idfuncion) {
        $sql = "SELECT crsc.crsc_vlrformular valor,
		round( crsc.dfrm_score ,1)calificacion
                FROM crsc_crescore crsc 
                WHERE crsc.dfrm_ideregistr = $idfuncion AND crsc.cre_ideregistro= $idcredito
                ORDER BY crsc_ideregistr DESC;";
        $respuesta = parent::executeQuery($sql);
        if (!empty($respuesta)) {
            return $respuesta[0];
        }
        return $respuesta;
    }

    /**
     * Actualiza el producto solicitado 
     * @param int $idcredito identificador del crédito
     * @param int $monto monto solicitado
     * @param int $plazo plazo
     */
    public function actualizarProductoSoliciadoModel($idcredito, $monto, $plazo) {
        $sql = "UPDATE cre_credito
                SET cre_monto = $monto,
                 cre_plazo = $plazo
                WHERE
                        cre_ideregistro = $idcredito";
        return parent::executeQuery($sql);
    }

    /**
     * lista ña informacion configurada de la calificación basada en el crédito
     * @param int $idcredito
     * @return type
     */
    public function obtenerCalificacionparametrizadaModel($idcredito) {
        $sql = "SELECT
                        crsc_variable nombrevariable,
                        round(dfrm_score,0) calificacion,
                        crsc_vlrformular valor
                FROM
                        crsc_crescore
                where 
                cre_ideregistro = $idcredito";
        return parent::executeQuery($sql);
    }

    /**
     * Actualiza la combinación entre formulario y producto financiero
     * @param int $idproductofinanciero identificador del producto
     * @param int $idformulario identificador del formulario
     */
    public function actualizarFormularioProducto($idproductofinanciero, $idformulario) {
        $sql = "UPDATE prfr_prdformulario
                SET frm_ideregistro = $idformulario
                WHERE
                    uni_prdfinanciero =$idproductofinanciero";
        return parent::executeQuery($sql);
    }

    public function actualizarVariables($idregistro) {
        $sql = "UPDATE dfrm_detformulario
                SET dfrm_estado = 'E'
                WHERE dfrm_ideregistr = $idregistro";
        return parent::executeQuery($sql);
    }

    /**
     * permite obtener el listado de las liquidaciones que aplican créditos
     * @return Array listado departamentos
     */
    public function obtenerLiquidaciones($idempresa) {

        $sql = "SELECT
                        liq.uni_liquidacion idliquidacion,
                        liq.liq_nombre liquidacion,
                        liq.liq_tipcuota tipocuota,
                        SUBSTRING (
                                con_formula,
                                '(([0-9].)(\d+))'
                        ) tasainteres
                FROM
                        liq_liquidacion liq
                INNER JOIN esem_estempresa esem ON liq.est_liquidacion = esem.est_ideregistro
                LEFT JOIN coli_conliquida coli ON coli.uni_liquidacion = liq.uni_liquidacion
                LEFT JOIN con_concepto con ON con.uni_concepto = coli.uni_concepto
                WHERE
                        liq.liq_venclasific = 'FI'
                AND con.con_intfinanciacion = 'S'
                AND esem.emp_ideregistro =$idempresa";

        return $this->executeQuery($sql);
    }

    public function consultarInteresIvaLiquidacion($idliquidacion) {
        $sql = "SELECT
                        SUBSTRING (
                                con.con_formula,
                                '(([0-9].)(\d+))'
                        ) interesiva
                FROM
                        con_concepto con
                INNER JOIN core_conrelacio core ON con.uni_concepto = core.uni_concepto
                WHERE
                        core.uni_conrelacion IN (
                                SELECT
                                        con.uni_concepto
                                FROM
                                        coli_conliquida coli
                                INNER JOIN con_concepto con ON coli.uni_concepto = con.uni_concepto
                                WHERE
                                        coli.uni_liquidacion =$idliquidacion
                                AND con.con_intfinanciacion = 'S'
                        );";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['interesiva'];
    }

    /**
     * permite obtener el listado de las liquidaciones que aplican créditos
     * @return Array listado departamentos
     */
    public function obtenerTerceroAutoComplete($etapa, $nombre) {
        $complemento = "";
        if (!empty($etapa)) {
            $complemento .= "AND cre.uni_creetapa = '$etapa'";
        }

        $sql = "SELECT MAX (trim(ter_nomcompleto)) nombrecompleto,
                    ter_documento documento
                FROM
                    crib_creinfbasica crib
                INNER JOIN cre_credito cre ON cre.cre_ideregistro = crib.cre_ideregistro
                WHERE
                    UPPER (trim(ter_nomcompleto)) LIKE UPPER ('%$nombre%') $complemento
                GROUP BY ter_documento ";

        return $this->executeQuery($sql);
    }

    public function obtenerListaCreditos($parametros) {
        $complemento = '';
        if (!empty($parametros['fechainicio'])) {
            $fechaInicio = $parametros['fechainicio'];
            if (!empty($parametros['fechafin'])) {
                $fechaFin = $parametros['fechafin'];
                $complemento .= " AND cre_fecha BETWEEN CAST ('$fechaInicio' AS DATE)
                                AND CAST ('$fechaFin' AS DATE)";
            } else {
                $complemento .= " AND cre_fecha = $fechaInicio";
            }
        }
        if (!empty($parametros['nombresolicitante'])) {
            $nombre = "'%" . $parametros['nombresolicitante'] . "%'";
            $complemento .= "AND UPPER(trim(crib.ter_nomcompleto)) LIKE UPPER(TRIM($nombre))";
        }        
        if (!empty($parametros['documentosolicitante'])) {
            $documento = "'" . $parametros['documentosolicitante'] . "'";
            $complemento .= "AND crib.ter_documento = $documento ";
        }
        if (!empty($parametros['montoinicio']) && !empty($parametros['montofin'])) {
            $montoInicio = $parametros['montoinicio'];
            $montoFin = $parametros['montofin'];
            $complemento .= " AND cre_monto BETWEEN $montoInicio AND $montoFin";
        }
        if (!empty($parametros['producto']) && $parametros['producto'] !== 'T') {
            $idproducto = $parametros['producto'];
            $complemento .= " AND  uni_prdfinanciero = $idproducto";
        }
        if (!empty($parametros['etapa']) && $parametros['etapa'] !== 'T') {
            $idetapa = $parametros['etapa'];
            $complemento .= " AND uni_creetapa = $idetapa";
        }
        if (!empty($parametros['empresa']) && $parametros['empresa'] !== 'T') {
            $idempresa = $parametros['empresa'];
            $complemento .= " AND crae.ter_ideempresa =$idempresa";
        }
        if (empty($complemento) && $parametros['etapa'] !== 'T') {
            throw new MyException("Deben seleccionar filtros de búsqueda", -1);
        }

        $sql = "SELECT
                        crib.ter_nomcompleto nombre,
                        crib.ter_documento documento,
                        cre.cre_fecha fecha,
                        cre.cre_ideregistro radicado,
                        round(cre.cre_monto, 0) valor,
                        cre.cre_plazo plazo,
                        uni.uni_nombre1 etapa,
                        cre.uni_creetapa idetapa,
                        cre.dsus_ideregistr idsuscripcion,
                        cre.fin_ideregistro idfinanciacion,
			ter.ter_nomcompleto empresaempleado
                FROM cre_credito cre
                INNER JOIN crib_creinfbasica crib ON crib.cre_ideregistro = cre.cre_ideregistro
                INNER JOIN  uni_unidad uni ON cre.uni_creetapa = uni_ideregistro 
		INNER JOIN crae_creacteconomica crae ON crae.cre_ideregistro = cre.cre_ideregistro
		LEFT JOIN ter_tercero ter ON ter.ter_ideregistro = crae.ter_ideempresa  
                WHERE 1 = 1 $complemento";
        return parent::executeQuery($sql);
    }

    /**
     * permite obtener el listado de las liquidaciones que aplican créditos
     * @return Array listado departamentos
     */
    public function obtenerInformacionCredito($idcredito) {

        $sql = "SELECT
                        cre.cre_ideregistro numeroradicado,
                        crib.crib_ideregistr idpersona,
                        cre.cre_fecha fechasolicitud,
                        prdfinanciero.uni_nombre1 productofinanciero,
                        round(cre.cre_monto, 0) montosolicitado,
                        crib.ter_nomcompleto nombrecompleto,
                        crib.crib_tipidentifica tipodocumento,
                        crib.ter_documento documento,
                        crib.ter_sexo sexo,
                        crib.crib_fecnacimiento fechanacimiento,
                        ciunac.ciudad_nom lugarnacimiento,
                        estciv.uni_nombre1 estadocivil,
                        crib.crib_percargomenor menoresedad,
                        crib.crib_percargomayor mayoresedad,
                        niveledu.uni_nombre1 niveleducacion,
                        profes.uni_nombre1 profesion,
                        round(crif.crif_salario, 0) salariobasico,
                        round(crif.crif_horextra, 0) otrosingresos,
                        round(crif.crif_ingarriendo, 0) otrosingresosarriendo,
                        round(crif.crif_gashogar, 0) gastoshogar,
                        round(crif.crif_cuovivienda, 0) arriendocuotavivienda,
                        round(crif.crif_cuobanco, 0) cuotabanco,
                        round(crif.crif_otrgasto, 0) otrosgastos,
                        crif.crif_ingdescripcion descripcionotrosingresos,
                        crif.crif_decrenta declararenta
                FROM
                        cre_credito cre
                LEFT JOIN crib_creinfbasica crib ON crib.cre_ideregistro = cre.cre_ideregistro
                LEFT JOIN uni_unidad prdfinanciero ON prdfinanciero.uni_ideregistro = cre.uni_prdfinanciero
                LEFT JOIN ciudades ciunac ON ciunac.ciudad_cod = crib.ciudad_codnacimien
                LEFT JOIN uni_unidad estciv ON estciv.uni_ideregistro = crib.uni_estcivil
                LEFT JOIN uni_unidad niveledu ON niveledu.uni_ideregistro = crib.uni_niveducativo
                LEFT JOIN uni_unidad profes ON profes.uni_ideregistro = crib.uni_profesion
                LEFT JOIN crif_creinfinancie crif ON crif.cre_ideregistro = cre.cre_ideregistro
                AND crif.crib_ideregistr = crib.crib_ideregistr
                WHERE
                    cre.cre_ideregistro = $idcredito ;";

        $respuesta = $this->executeQuery($sql);
        return $respuesta[0];
    }

    public function obtenerSumaActivos($idcretido) {
        $sql = "SELECT
                        SUM (crac_vlrcomercial) total
                FROM
                        crac_creactivo cra
                WHERE
                        cra.cre_ideregistro =$idcretido";
        return $this->executeQuery($sql)[0];
    }

    public function consultarMotivos($programa, $estrucutura, $usuario) {
        $sql = "SELECT uni.uni_ideregistro idunidad, uni_nombre1 nombre  
                FROM uni_unidad uni 
                INNER JOIN est_estructura est ON est.est_ideregistro = uni.est_ideregistro
                INNER JOIN prun_prgunidad prun ON prun.uni_ideregistro = uni.uni_ideregistro
                INNER JOIN uspu_usuprgunid uspu ON uspu.prun_ideregistr = prun.prun_ideregistr
                WHERE est.est_ideregistro =$estrucutura  AND prg_ideregistro = $programa AND uspu.usu_ideregistro = $usuario ;";
        return $this->executeQuery($sql);
    }

    /**
     * Elimina el registro de la tabla adjuntos creditos
     * @param type $idArchivo
     * @return type
     */
    public function eliminarAdjuntosRegistroCredito($idArchivo) {
        return $this->eliminar('adcr_adjcredito', 'adcr_ideregistr=' . $idArchivo);
    }

    /**
     * Consulta las caracteristicas del archivo por el id
     * @param type $idarchivo
     * @return type
     */
    public function consultarArchivo($idarchivo) {
        $sql = "SELECT adcr_ruta  rutaarchivo, adcr_ideregistr idarchivo FROM adcr_adjcredito
                WHERE  adcr_ideregistr = $idarchivo";
        $respuesta = $this->executeQuery($sql);
        return $respuesta[0];
    }

    /**
     * Consulta el tipo de suscripcio y la unidad, para crear una suscripcion
     * @param type $parametros
     * @return type
     */
    public function consultarTipoSuscripcion($idclase, $idempresa) {
        $parametros['idclase'] = $idclase;
        $parametros['idempresa'] = $idempresa;
        $sql = "SELECT tsu.uni_tipsuscripc, est.est_ideregistro FROM tsu_tipsuscripc tsu
                INNER JOIN uni_unidad uni  ON tsu.uni_tipsuscripc = uni.uni_ideregistro
                INNER JOIN est_estructura  est ON uni.est_ideregistro = est.est_ideregistro
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = est.est_ideregistro
                WHERE est.cla_ideregistro = :idclase AND  esem.emp_ideregistro= :idempresa LIMIT 1;";
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException("No existe tipo de suscripcion", -1);
        }
        return $respuesta[0];
    }

    public function consultarTipoLiquidacion($idclase, $idempresa) {
        $parametros['idclase'] = $idclase;
        $parametros['idempresa'] = $idempresa;
        $sql = "SELECT liq.est_liquidacion, liq.uni_liquidacion FROM liq_liquidacion liq
                INNER JOIN uni_unidad uni  ON liq.uni_liquidacion = uni.uni_ideregistro
                INNER JOIN est_estructura  est ON uni.est_ideregistro = est.est_ideregistro
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = est.est_ideregistro
                 WHERE est.cla_ideregistro = :idclase AND  esem.emp_ideregistro= :idempresa LIMIT 1;";
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException("No existe tipo de liquidacion", -1);
        }
        return $respuesta[0];
    }

    public function consultarTipoUsoSuscripcion($idclase, $idempresa) {
        $parametros['idclase'] = $idclase;
        $parametros['idempresa'] = $idempresa;
        $sql = "SELECT  est.est_ideregistro, uni.uni_ideregistro,uni.uni_nombre1 FROM uni_unidad uni
                INNER JOIN est_estructura  est ON uni.est_ideregistro = est.est_ideregistro
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = est.est_ideregistro
                WHERE est.cla_ideregistro = :idclase AND  esem.emp_ideregistro= :idempresa 
                ORDER BY uni.uni_nombre1 LIMIT 1;";
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException("No existe tipo de uso suscripcion", -1);
        }
        return $respuesta[0];
    }

    public function consultarFactura($idfactura) {
        $sql = "SELECT * FROM fac_factura  WHERE  fac_ideregistro =$idfactura";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException("No existe esa factura", -1);
        }
        return $respuesta[0];
    }
    
    public function consultarFacAmfiLib ($idfactura) {
        $sql = "SELECT facc.dsus_ideregistr , facc.emp_ideregistro, facc.cic_ideregistro , 
                facc.per_ideregistro , facc.cic_ano ,liqq.uni_documento as uni_documento , 
                facc.uni_tipdocument FROM fac_factura facc
                INNER JOIN liq_liquidacion liqq ON liqq.uni_liquidacion = facc.uni_liquidacion
                AND liq_venclasific = 'FI'
                WHERE  fac_ideregistro = $idfactura ";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException("No existe esa factura", -1);
        }
        return $respuesta[0];
    }
    
    /**
     * Consulta el detalle de la facturacion 
     * @param type $iddetallefactura
     * @return type
     * @throws MyException
     */
    public function consultarDetalleFactura($iddetallefactura) {
        $sql = "SELECT * FROM dfac_detfactura where dfac_ideregistr = $iddetallefactura";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException("No existe ese detalle de factura", -1);
        }
        return $respuesta[0];
    }

    /**
     * Se crea la finaciacion del credio
     * @param type $financiacion
     * @return type
     */
    public function insertarFinanciacion($financiacion) {
        $parametros = array();
        $this->setCampo($financiacion, $parametros, 'capitalinicial', 'fin_inicapital');
        $this->setCampo($financiacion, $parametros, 'estado', 'fin_estado');
        $this->setCampo($financiacion, $parametros, 'saldo', 'fin_sdocapital');
        $this->setCampo($financiacion, $parametros, 'fecharegistro', 'fin_fecha');
        $this->setCampo($financiacion, $parametros, 'idsuscipcion', 'dsus_ideregistr');
        $this->setCampo($financiacion, $parametros, 'idtercero', 'ter_idesolicita');
        $this->setCampo($financiacion, $parametros, 'entidadfinanciera', 'ter_ideentfinan');
        $this->setCampo($financiacion, $parametros, 'idciclo', 'cic_ideregistro');
        $this->setCampo($financiacion, $parametros, 'idperiodo', 'per_ideregistro');
        $this->setCampo($financiacion, $parametros, 'idempresasesion', 'emp_ideregistro');
        $this->setCampo($financiacion, $parametros, 'anociclo', 'cic_ano');
        $this->setCampo($financiacion, $parametros, 'version', 'fin_version');
        return $this->insertar($parametros, 'fin_financiacio', 'sq_fin_ideregistro');
    }

    /**
     * Se crea el detalle de la finaciacion de credito
     * @param type $detalleFinanciacion
     * @return type
     */
    public function insertarDetalleFinanciacion($detalleFinanciacion) {
        $parametros = array();
        $this->setCampo($detalleFinanciacion, $parametros, 'idfinanaciacion', 'fin_ideregistro');
        $this->setCampo($detalleFinanciacion, $parametros, 'iddetallefactura', 'dfac_ideregistr');
        $this->setCampo($detalleFinanciacion, $parametros, 'idfactura', 'fac_ideregistro');
        $this->setCampo($detalleFinanciacion, $parametros, 'idsuscipcion', 'dsus_ideregistr');
        $this->setCampo($detalleFinanciacion, $parametros, 'idliquidacion', 'uni_liquidacion');
        $this->setCampo($detalleFinanciacion, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($detalleFinanciacion, $parametros, 'valorunitario', 'dfac_vlrunitari');
        $this->setCampo($detalleFinanciacion, $parametros, 'valortotal', 'dfac_vlrtotal');
        $this->setCampo($detalleFinanciacion, $parametros, 'saldoReal', 'dfac_sdoreal');
        $this->setCampo($detalleFinanciacion, $parametros, 'valorrealfinanciacion', 'dfin_vlrreal');
        $this->setCampo($detalleFinanciacion, $parametros, 'saldoRealfinanciacion', 'dfin_sdoreal');
        $this->setCampo($detalleFinanciacion, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($detalleFinanciacion, $parametros, 'idciclo', 'cic_ideregistro');
        $this->setCampo($detalleFinanciacion, $parametros, 'idperiodo', 'per_ideregistro');
        $this->setCampo($detalleFinanciacion, $parametros, 'fecharegistro', 'dfin_fecha');
        $this->setCampo($detalleFinanciacion, $parametros, 'anociclo', 'cic_ano');
        $this->setCampo($detalleFinanciacion, $parametros, 'version', 'dfin_version');
        return $this->insertar($parametros, 'dfin_detfinanci', 'sq_dfin_ideregistr');
    }

    /**
     * inserta la Amortizacion de la finaciacion del credito
     * @param type $amortizacion
     * @return type
     */
    public function insertarAmortizacion($amortizacion) {
        $parametros = array();
        $this->setCampo($amortizacion, $parametros, 'estado', 'amfi_estado');
        $this->setCampo($amortizacion, $parametros, 'numerocuotas', 'amfi_numcuotas');
        $this->setCampo($amortizacion, $parametros, 'cuotasamotizacion', 'amfi_cuoamortiz');
        $this->setCampo($amortizacion, $parametros, 'fecha', 'amfi_fecha');
        $this->setCampo($amortizacion, $parametros, 'idfinanciacion', 'fin_ideregistro');
        $this->setCampo($amortizacion, $parametros, 'idliquidacion', 'uni_liquidacion');
        $this->setCampo($amortizacion, $parametros, 'iddocumento', 'uni_documento');
        $this->setCampo($amortizacion, $parametros, 'idtipodocumento', 'uni_tipdocument');
        $this->setCampo($amortizacion, $parametros, 'idsuscripcion', 'dsus_ideregistr');
        $this->setCampo($amortizacion, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($amortizacion, $parametros, 'idciclo', 'cic_ideregistro');
        $this->setCampo($amortizacion, $parametros, 'idperiodo', 'per_ideregistro');
        $this->setCampo($amortizacion, $parametros, 'anociclo', 'cic_ano');
        return $this->insertar($parametros, 'amfi_amofinanci', 'sq_amfi_ideregistr');
    }

    /**
     * Se actualiza el credito cuando se hace el desembolso 
     * @param type $idsuscripcion
     * @param type $idfinanciacion
     * @param type $idcredito
     * @return type
     */
    public function actualizarCreditoDesembolso($datos) {
        $data['dsus_ideregistr'] = $datos['idsuscripcion'];
        $data['cre_ideregistro'] = $datos['idcredito'];
        $data['fin_ideregistro'] = $datos['idfinanciacion'];
        return $this->actualizar($data, 'cre_credito', 'cre_ideregistro=:cre_ideregistro');
    }

    /**
     * Se actualiza el estado de la factura
     * @param type $datos
     * @return type
     */
    public function actualizarFactura($datos) {
        $data['fac_estado'] = $datos['estado'];
        $data['fac_ideregistro'] = $datos['idfactura'];
        return $this->actualizar($data, 'fac_factura', 'fac_ideregistro=:fac_ideregistro');
    }

    /**
     * Capital inicial de la financiacion
     * @param type $idfactura
     * @param type $idfinanciacion
     * @return type
     */
    public function actualizarCapitalInicialFinanciacion($idfactura, $idfinanciacion) {
        $sql = "SELECT SUM(dfac_vlrunitari) suma FROM dfac_detfactura WHERE fac_ideregistro in ($idfactura);";
        $respuesta = $this->executeQuery($sql)[0];
        $data['fin_ideregistro'] = $idfinanciacion;
        $data['fin_inicapital'] = $respuesta['suma'];
        return $this->actualizar($data, 'fin_financiacio', 'fin_ideregistro=:fin_ideregistro');
    }

    public function consultarConvenio($idEmpresa) {
        $parametros["idempresa"] = $idEmpresa;
        $sql = "SELECT * FROM dicn_disconven dicn WHERE dicn.emp_ideregistro=:idempresa";
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException("No hay un convenio asociado para la empresa dicn_ ", -1);
        }
        return $respuesta[0];
    }

    /**
     * Crea una nueva nota
     * @param array $info Información de las nota
     * @return int identificador de las nueva nota
     */
    public function insertarNotaModel($info, $cicloperiodo) {
        $parametros['not_fecha'] = 'now()';
        $parametros['not_comentario'] = 'Nota Credito Potenza ';
        $parametros['uni_motnota'] = UNIDAD_NOTIVO_NOTA_OTROS;
        $parametros['dsus_ideregistr'] = $info['idsuscripcion'];
        $parametros['cic_ideregistro'] = $info['idciclo'];
        $parametros['per_ideregistro'] = $info['idperiodo'];
        $parametros['est_motnota'] = ESTRUCTURA_NOTA;
        $parametros['emp_ideregistro'] = $info['idempresa'];
        $parametros['cic_ano'] = $cicloperiodo['cicloanio'];
        $parametros['usu_ideregistro'] = $info['idusuario'];
        return $this->insertar($parametros, 'not_nota', 'sq_not_ideregistro');
    }

    public function insertarNotaFacturaModel(array $detalleFacturaNota, $idNota) {
        $parametros['not_ideregistro'] = $idNota;
        $parametros['fac_ideregistro'] = $detalleFacturaNota['idfactura'];
        $parametros['dfac_ideregistr'] = $detalleFacturaNota['iddetallefactura'];
        $parametros['fac_ideorigen'] = $detalleFacturaNota['idfacturaorigen'];
        $parametros['dfac_ideorigen'] = $detalleFacturaNota['iddetallefacturaorigen'];
        $this->insertar($parametros, 'nofa_notfactura', 'sq_nofa_ideregistr');
    }

}
