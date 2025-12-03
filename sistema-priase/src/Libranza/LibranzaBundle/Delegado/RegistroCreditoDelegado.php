<?php

namespace Libranza\LibranzaBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Libranza\LibranzaBundle\Models\RegistroCreditoModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de los recaudos.
 * @author hrey
 */
class RegistroCreditoDelegado {

    /**
     * Información de la sesión.
     * @var SessionInterface 
     */
    private $sesion;

    /**
     *  Conexión a la base de datos 
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var RegistroCreditoModel 
     */
    private $registroCreditoModel;

    /**
     *
     * @var Controller 
     */
    private $control;

    public function __construct(Controller &$control, $sesion = null) {
        $this->conexion = Util::getConexion($control);
        $this->control = $control;
        $this->sesion = $sesion;
        $this->registroCreditoModel = new RegistroCreditoModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
    }

    /**
     * permite construir una nueva solicitud de crédito
     * @param Array $solicitudCredito solicitud de crédito a incluir
     */
    public function insertarSolicitudCredito($solicitudCredito) {
        $this->conexion->beginTransaction();

//permite construir una nueva solicitud de crédito
        $idCredito = $this->insertarCredito($solicitudCredito);

        $this->ActualizarAdjuntosCredito($solicitudCredito, $idCredito);

//permite ingresar la información básica del credito
        $idInformacionBasica = $this->insertarInformacionBasica($solicitudCredito, $idCredito);
//permite ingresar las actividades económicas
        $this->insertarActividadEconomica($solicitudCredito, $idCredito, $idInformacionBasica);
//permite ingresar las referencias
        $this->insertarReferencias($solicitudCredito, $idCredito, $idInformacionBasica);
//permite insertar la información financiera
        $this->insertarInformacionFinanciera($solicitudCredito, $idCredito, $idInformacionBasica);
//permite ingresar la experiencia financiera
        $this->insertarExperienciaFinanciera($solicitudCredito, $idCredito, $idInformacionBasica);
//permite insertar la información de los activos
        $this->insertarInformacionActivos($solicitudCredito, $idCredito, $idInformacionBasica);
//permite insertar la poliza de seguros
        //$this->insertarPolizaSeguro($solicitudCredito, $idCredito, $idInformacionBasica);

        $this->conexion->commit();


        $informacion = $this->registroCreditoModel->obtenerCorreo($idCredito);
        if (!empty($informacion['correo'])) {
            Util::enviarCorreo($this->control, $informacion, 'Se ha tramido con exito la solicitud', 'Crédito potenza');
        }

        return $idCredito;
    }

    /**
     * permite actualizar el solicitid de crédito 
     * @param Array $SolicitudCredito solicitud de crédito 
     */
    public function ActualizarAdjuntosCredito($solicitudCredito, $idCredito) {
        foreach ($solicitudCredito['archivos'] as $adjuntos) {
            //permite actualizar los archivos asociados al crédito
            $this->actualizarAdjunto($adjuntos['idarchivo'], $adjuntos['tipo'], $idCredito);
        }
    }

    /**
     * permite registrar la información de las referencias
     * @param array $solicitudCredito solicitud de crédito
     * @param int $idCredito identificador del crédito
     * @param int $idInformacionBasica identificador de la información básica
     */
    public function insertarReferencias($solicitudCredito, $idCredito, $idInformacionBasica) {

        foreach ($solicitudCredito['referenciafamiliar'] as $referenciaFamiliar) {
//permite construir la referencia familiar
            if(empty($referenciaFamiliar['ciudadreferenciafamiliar'])){
                continue;
            }
            $infoReferencias['cre_ideregistro'] = $idCredito;
            $infoReferencias['crib_ideregistr'] = $idInformacionBasica;
            $infoReferencias['crre_tipreferencia'] = 'F';
            $infoReferencias['crre_nombre'] = $referenciaFamiliar['nombrereferenciafamiliar'];
            $infoReferencias['crre_apellido'] = $referenciaFamiliar['apellidoreferenciafamiliar'];
            $infoReferencias['uni_parentesco'] = $referenciaFamiliar['parentescoreferenciafamiliar'];
            $infoReferencias['crre_telcelular'] = $referenciaFamiliar['celularreferenciafamiliar'];
            $infoReferencias['crre_telfijo'] = $referenciaFamiliar['telefonoreferenciafamiliar'];
            $infoReferencias['crre_direccion'] = $referenciaFamiliar['direccionreferenciafamiliar'];
            $infoReferencias['uni_profesion'] = $referenciaFamiliar['ocupacionreferenciafamiliar'];
            if ($referenciaFamiliar['ciudadreferenciafamiliar'] == '-1' || empty($referenciaFamiliar['ciudadreferenciafamiliar'])) {
                throw new Exception('La ciudad de la referenca' . $infoReferencias['crre_nombre'] . ' ' . $infoReferencias['crre_apellido'] . ' es obligatoria', -1);
            }
            $infoReferencias['ciudad_cod'] = $referenciaFamiliar['ciudadreferenciafamiliar'];
            $this->registroCreditoModel->insertarReferencias($infoReferencias);
        }

        foreach ($solicitudCredito['referenciapersonal'] as $referenciaPersonal) {
//permite construir la referencia personal
            if(empty($referenciaPersonal['ciudadreferenciapersonal'])){
                continue;
            }
            $infoReferencias['cre_ideregistro'] = $idCredito;
            $infoReferencias['crib_ideregistr'] = $idInformacionBasica;
            $infoReferencias['crre_tipreferencia'] = 'P';
            $infoReferencias['crre_nombre'] = $referenciaPersonal['nombrereferenciapersonal'];
            $infoReferencias['crre_apellido'] = $referenciaPersonal['apellidoreferenciapersonal'];
            //  $infoReferencias['uni_parentesco'] = $referenciaPersonal['parentescoreferenciapersonal'];
            $infoReferencias['crre_telcelular'] = $referenciaPersonal['celularreferenciapersonal'];
            $infoReferencias['crre_telfijo'] = $referenciaPersonal['telefonoreferenciapersonal'];
            $infoReferencias['crre_direccion'] = $referenciaPersonal['direccionreferenciapersonal'];
            $infoReferencias['uni_profesion'] = $referenciaPersonal['ocupacionreferenciapersonal'];
            $infoReferencias['ciudad_cod'] = $referenciaPersonal['ciudadreferenciapersonal'];
            if ($referenciaPersonal['ciudadreferenciapersonal'] == '-1' || empty($referenciaPersonal['ciudadreferenciapersonal'])) {
                throw new Exception('La ciudad de la referenca' . $infoReferencias['crre_nombre'] . ' ' . $infoReferencias['crre_apellido'] . ' es obligatoria', -1);
            }
            $this->registroCreditoModel->insertarReferencias($infoReferencias);
        }
    }

    /**
     * permite ingresar información sobre los activos
     * @param array $solicitudCredito solicitud de crédito
     * @param int $idCredito identificador del crédito
     * @param int $idInformacionBasica identificador de la información básica
     */
    public function insertarInformacionActivos($solicitudCredito, $idCredito, $idInformacionBasica) {
        if (!isset($solicitudCredito['activos'])) {
            return;
        }
        foreach ($solicitudCredito['activos'] as $activos) {
            $informacionActivos['crib_ideregistr'] = $idInformacionBasica;
            $informacionActivos['cre_ideregistro'] = $idCredito;
            $informacionActivos['uni_tipactivo'] = $activos['tipoactivo'];
            $informacionActivos['crac_detalle'] = $activos['detalle'];
            $informacionActivos['crac_pladireccion'] = $activos['placadireccion'];
            $informacionActivos['ciudad_cod'] = $activos['idciudad'];
            $informacionActivos['crac_vlrcomercial'] = $activos['valorcomercial'];
            $this->registroCreditoModel->insertarActivos($informacionActivos);
        }
    }

    /**
     * Permite incrustar la experiencia financiera
     * @param array $solicitudCredito solicitud de crédito
     * @param int $idCredito identificador del crédito
     * @param int $idInformacionBasica identificador de la información básica
     * @return int id experiencia financiera
     */
    public function insertarExperienciaFinanciera($solicitudCredito, $idCredito, $idInformacionBasica) {
        if (!empty($solicitudCredito['experienciafinanciera'])) {
            foreach ($solicitudCredito['experienciafinanciera'] as $_experienciaFinanciera) {
                $experienciaFinanciera['crib_ideregistr'] = $idInformacionBasica;
                $experienciaFinanciera['cre_ideregistro'] = $idCredito;
                $experienciaFinanciera['cref_prdcantidad'] = $_experienciaFinanciera['cantidad'];
                $experienciaFinanciera['uni_prdfinanciero'] = $_experienciaFinanciera['idproducto'];
                $this->registroCreditoModel->insertarExperienciaFinanciera($experienciaFinanciera);
            }
        }
    }

    /**
     * permite insertar la información financiera
     * @param array $solicitudCredito  solicitud de crédito
     * @param int $idCredito identificador del crédito
     * @param int $idInformacionBasica identificador de la información básica
     */
    public function insertarInformacionFinanciera($solicitudCredito, $idCredito, $idInformacionBasica) {
        $informacionFinanaciera['crib_ideregistr'] = $idInformacionBasica;
        $informacionFinanaciera['cre_ideregistro'] = $idCredito;
        $informacionFinanaciera['crif_salario'] = empty($solicitudCredito['salariobasico']) ? 0 : $solicitudCredito['salariobasico'];
        $informacionFinanaciera['crif_horextra'] = empty($solicitudCredito['otrosingresos']) ? 0 : $solicitudCredito['otrosingresos'];
        $informacionFinanaciera['crif_ingarriendo'] = empty($solicitudCredito['otrosingresosarriendo']) ? 0 : $solicitudCredito['otrosingresosarriendo'];
        $informacionFinanaciera['crif_gashogar'] = empty($solicitudCredito['gastoshogar']) ? 0 : $solicitudCredito['gastoshogar'];
        $informacionFinanaciera['crif_cuovivienda'] = empty($solicitudCredito['arriendocuotavivienda']) ? 0 : $solicitudCredito['arriendocuotavivienda'];
        $informacionFinanaciera['crif_cuobanco'] = empty($solicitudCredito['cuotabanco']) ? 0 : $solicitudCredito['cuotabanco'];
        $informacionFinanaciera['crif_otrgasto'] = empty($solicitudCredito['otrosgastos']) ? 0 : $solicitudCredito['otrosgastos'];
        $informacionFinanaciera['crif_topasivo'] = empty($solicitudCredito['totalpasivos']) ? 0 : $solicitudCredito['totalpasivos'];
        $informacionFinanaciera['crif_ingdescripcion'] = $solicitudCredito['descripcionotrosingresos'];
        $informacionFinanaciera['crif_decrenta'] = $solicitudCredito['declararenta'];
        return $this->registroCreditoModel->insertarInformacionFinanciera($informacionFinanaciera);
    }

    /**
     * permite insertar una actividad económica
     * @param array $SolicitudCredito solicitud de crédito
     * @param int $idCredito indentificador de crédito
     */
    public function insertarActividadEconomica($SolicitudCredito, $idCredito, $idInformacionBasica) {
        foreach ($SolicitudCredito['actividadeconomica'] as $_actividadEconomica) {
            $actividadEconomica['crib_ideregistr'] = $idInformacionBasica;
            $actividadEconomica['cre_ideregistro'] = $idCredito;
            $actividadEconomica['uni_profesion'] = $_actividadEconomica['actividadeconomica'];
            $actividadEconomica['ter_ideempresa'] = $_actividadEconomica['empresaempleado'];
            $actividadEconomica['crae_ingempresa'] = $_actividadEconomica['fechaingresoempleado'];
            $actividadEconomica['crae_telempresa'] = $_actividadEconomica['telefonoempleado'];
            $actividadEconomica['uni_tipcargo'] = $_actividadEconomica['tipocargoempleado'];
            $actividadEconomica['uni_tipcontrato'] = $_actividadEconomica['tipocontratoempleado'];
            $actividadEconomica['crae_salbasico'] = $_actividadEconomica['salariobasicoempleado'];
            $actividadEconomica['crae_dednomina'] = $_actividadEconomica['deduccionesnominaempleado'];
            $actividadEconomica['crae_saldevengado'] = $_actividadEconomica['salarionetoempleado'];
            $this->registroCreditoModel->insertarActividadEconomica($actividadEconomica);
        }
    }

    /**
     * permite insertar una nueva poliza de seguro
     * @param array $solicitudCredito solicitud de crédito
     * @param int $idCredito indentificador de crédito
     */
    public function insertarPolizaSeguro($solicitudCredito, $idCredito, $idInformacionBasica) {

        $infoPoliza['crib_ideregistr'] = $idInformacionBasica;
        $infoPoliza['cre_ideregistro'] = $idCredito;
        $infoPoliza['crpo_nombre'] = $solicitudCredito['nombrebeneficiario'];
        $infoPoliza['crpo_apellido'] = $solicitudCredito['apellidobeneficiario'];
        $infoPoliza['crpo_nomcompleto'] = $solicitudCredito['nombrebeneficiario'] + ' ' + $solicitudCredito['apellidobeneficiario'];
        $infoPoliza['crpo_documento'] = $solicitudCredito['numerodocumentobeneficiario'];
        $infoPoliza['crpo_tipidentifica'] = $solicitudCredito['tipoidentificacion'];
        $infoPoliza['uni_parentesco'] = $solicitudCredito['parentescobeneficiario'];
        return $this->registroCreditoModel->insertarPolizaSeguros($infoPoliza);
    }

    /**
     * permite crear la información básica
     * @param Array $infoBasica
     */
    public function insertarInformacionBasica($infoBasica, $idCredito) {
        $informacionBasica['cre_ideregistro'] = $idCredito;
        $informacionBasica['ter_nombre'] = $infoBasica['primernombre'];
        $informacionBasica['ter_apellido'] = $infoBasica['primerapellido'] . ' ' . $infoBasica['segundoapellido'];
        $informacionBasica['ter_nomcompleto'] = $informacionBasica['ter_nombre'] . ' ' . $informacionBasica['ter_apellido'];
        $informacionBasica['crib_tipidentifica'] = $infoBasica['tipodocumento'];
        $informacionBasica['ter_documento'] = $infoBasica['documento'];
        //$informacionBasica['ciudad_cod'] = $infoBasica['ciudad'];
        $informacionBasica['uni_tiptercero'] = 1;
        $informacionBasica['ter_sexo'] = $infoBasica['sexo'];
        $informacionBasica['crib_fecnacimiento'] = $infoBasica['fechanacimiento'];
        $informacionBasica['ciudad_codnacimien'] = $infoBasica['lugarnacimiento'];
        $informacionBasica['uni_estcivil'] = $infoBasica['estadocivil'];
        $informacionBasica['crib_percargomenor'] = '0'; // $infoBasica['menoresedad'];
        $informacionBasica['crib_percargomayor'] = $infoBasica['personasacargo'];
        $informacionBasica['crib_nomconyugue'] = $infoBasica['nombreconyugue'];
        $informacionBasica['crib_apeconyugue'] = $infoBasica['apellidoconyugue'];
        $informacionBasica['crib_comconyugue'] = $infoBasica['nombreconyugue'];
        $informacionBasica['crib_tipideconyugue'] = $infoBasica['tipodocumentoconyugue'];
        $informacionBasica['crib_docconyugue'] = $infoBasica['documentoconyugue'];
        $informacionBasica['crib_traconyugue'] = $infoBasica['conyuguetrabaja'];
        $informacionBasica['crib_empconyugue'] = $infoBasica['empresaconyugue'];
        $informacionBasica['crib_telconyugue'] = $infoBasica['telefonoconyugue'];
        $informacionBasica['crib_dirconyugue'] = $infoBasica['direccionconyugue'];
        $informacionBasica['crib_ciuconyugue'] = $infoBasica['ciudadconyugue'];
        $informacionBasica['uni_niveducativo'] = $infoBasica['niveleducacion'];
        $informacionBasica['uni_profesion'] = $infoBasica['profesion'];
        $informacionBasica['pro_direccion'] = $infoBasica['direccion'];
        $informacionBasica['uni_municipio'] = $infoBasica['idmunicipio'];
        $informacionBasica['uni_barrio'] = $infoBasica['barrio'];
        $informacionBasica['pro_zona'] = $infoBasica['zonaresidencial'];
        $informacionBasica['departamento_ideregistro'] = $infoBasica['departamento'];
        $informacionBasica['crib_telcelular'] = $infoBasica['celular'];
        $informacionBasica['crib_telfijo'] = $infoBasica['telefonofijo'];
        $informacionBasica['crib_correo'] = $infoBasica['correo'];

        $dias = ($infoBasica['mesesresidencia'] * 30);
        $informacionBasica['crib_diaresidencia'] = $dias;

        $informacionBasica['uni_tippropieda'] = $infoBasica['tipovivienda'];
        $informacionBasica['uni_tipenvio'] = $infoBasica['enviocorrespondencia'];
        $informacionBasica['crib_vlrarriendo'] = $infoBasica['valorarriendo'];
        $informacionBasica['uni_tipidentifica'] = $infoBasica['idtipodocumento'];
        $informacionBasica['pro_catestrato'] = $infoBasica['estrato'];
        return $this->registroCreditoModel->insertarInformacionbasica($informacionBasica);
    }

    /**
     * permite adjuntar un archivo
     * @param string $archivo nombre del archivo
     * @param stirng $ruta ruta del archivo
     * @return type
     */
    public function insertarAdjutno($archivo, $ruta) {
        $adjuntoArchivo['adcr_nomarchivo'] = $archivo;
        $adjuntoArchivo['adcr_ruta'] = $ruta;
        $adjuntoArchivo['adcr_tiparchivo'] = 'pdf';
        return $this->registroCreditoModel->insertarAdjunto($adjuntoArchivo);
    }

    /**
     * permite actualizar el adjunto
     * @param int $idadjunto identificador de adjuntos
     * @param int $idcredito identificador del credito
     * @return int identificador de actualización
     */
    public function actualizarAdjunto($idadjunto, $tipo, $idcredito) {
        $parametros['adcr_ideregistr'] = $idadjunto;
        $parametros['adcr_tiparchivo'] = $tipo;
        $parametros['cre_ideregistro'] = $idcredito;
        return $this->registroCreditoModel->actualizarAdjunto($parametros);
    }

    /**
     * permite construir un nuevo credito 
     * @param Array $infoCredito información del crédito
     * @return type
     */
    public function insertarCredito($infoCredito) {
        $credito['cre_fecha'] = $infoCredito['fechasolicitud'];
        $credito['uni_creetapa'] = ESTADO_RADICACION_CREDITO;
        $credito['uni_prdfinanciero'] = $infoCredito['productofinanciero'];
        $credito['cre_monto'] = $infoCredito['montosolicitado'];
        $credito['cre_destino'] = $infoCredito['destinocredito'];
        $credito['cre_plazo'] = $infoCredito['plazo'];
        $credito['ter_idefinanciera'] = $infoCredito['entidadfinanciera'];
        $credito['cre_tipcuenta'] = $infoCredito['tipocuentadesembolso'];
        $credito['cre_numcuenta'] = $infoCredito['numerocuenta'];
        return $this->registroCreditoModel->insertarCredito($credito);
    }

    public function actualizarCredito($idcredito, $seguro, $estudioCredito) {
        $parametros['cre_ideregistro'] = $idcredito;
        $parametros['cre_porseguro'] = $seguro;
        $parametros['cre_vlrestudio'] = $estudioCredito;
        return $this->registroCreditoModel->actualizarCredito($parametros);
    }

    /**
     * permite obtener el crédito
     * @param type $parametros
     * @return type
     * @throws MyException
     */
    function consultarCredito($parametros) {
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $resultado = $this->registroCreditoModel->consultarCredito($parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontraron resultados', 0);
        }
        return $resultado;
    }
    /**
     * permite obtener el crédito para el estudio de credito
     * @param type $parametros
     * @return type
     * @throws MyException
     */
    function consultarCreditoEstudio($parametros) {
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $resultado = $this->registroCreditoModel->consultarCreditoEstudio($parametros);
        return $resultado;
    }

    /**
     * Permite consultar los parámetros de busqueda
     * @param type $parametrosBusqueda
     * @return type
     */
    public function consultar($parametrosBusqueda) {
        $informacionCredito = $this->consultarCredito($parametrosBusqueda);
        $idcredito = $informacionCredito[0]['numeroradicado'];
        $idpersona = $informacionCredito[0]['idpersona'];
        $credito["id_credito"] = $idcredito;
        $informacionCredito[0]["codigo"] = Util::crearToken($credito);
        $informacionCredito[0]['actividadeconomica'] = $this->registroCreditoModel->consultarActividadEconomicaModel($idcredito, $idpersona);
        $informacionCredito[0]['referenciapersonal'] = $this->registroCreditoModel->consultarReferenciasModel($idcredito, $idpersona, 'P');
        $informacionCredito[0]['referenciafamiliar'] = $this->registroCreditoModel->consultarReferenciasModel($idcredito, $idpersona, 'F');
        $informacionCredito[0]['experienciafinanciera'] = $this->registroCreditoModel->consultarExperienciaFinancieraModel($idcredito, $idpersona);
        $informacionCredito[0]['activos'] = $this->registroCreditoModel->consultarActivosModel($idcredito, $idpersona);
        $informacionCredito[0]['archivos'] = $this->registroCreditoModel->ConsultarArchivosAdjuntosModel($idcredito);
        $informacionCredito[0]['comentarios'] = $this->registroCreditoModel->obtenerComentariosModel($idcredito);

        return $informacionCredito;
    }
    
    /**
     * Permite consultar los parámetros financiacion estidio credito
     * @param type $parametrosBusqueda
     * @return type
     */
    public function consultar_estudio($parametrosBusqueda) {
        $informacionCredito = $this->consultarCreditoEstudio($parametrosBusqueda);
        return $informacionCredito;
    }

    public function consultarCreditoAprobados(array $parametros) {
        $resultado = $this->registroCreditoModel->consultarCreditoAprobados($parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontraron resultados', 0);
        }
        return $resultado;
    }

    /**
     * permite validar el tercero
     * @param int $documento identificador de documento
     * @return int
     */
    public function validarTercero($documento) {
        return $this->registroCreditoModel->validarTerceroModel($documento);
    }    
    /**
     * permite validar si el tercero tiene una clasificacion especifica
     * @param int id_tercero identificador del tercero
     * @param int uni_clatercero 
     * @param int empresa 
     * @return int
     */    
    public function validarClaTercero($id_tercero, $uni_clt , $empresa) {
        return $this->registroCreditoModel->validarCltTerceroModel($id_tercero, $uni_clt, $empresa);
    }

    /**
     * permite validar si existe una suscripcion para el tercero
     * @param int $terIderegistro
     * @return int
     */
    public function validarSuscripcion($terParametros) {
        return $this->registroCreditoModel->validarSuscripcionModel($terParametros);
    }

    /**
     * permite listas las profesiones
     * @return listado de profesiones
     */
    public function obtenerProfesiones() {
        // $EstructuraResultado = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_PROFESIONES);
        $EstructuraResultado = $this->genericoModel->obtenerListaPorClase(CLASE_PROFESIONES, POTENZA_IDPROYCTO);
        return $EstructuraResultado;
    }

    public function obtenerTipoContrato() {
        // $EstructuraResultado = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_TIPOCONTRATO);
        $EstructuraResultado = $this->genericoModel->obtenerListaPorClase(CLASE_TIPOCONTRATO, POTENZA_IDPROYCTO);
        return $EstructuraResultado;
    }

    public function obtenerTipoCargo() {
        //$EstructuraResultado = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_TIPOCARGO);
        $EstructuraResultado = $this->genericoModel->obtenerListaPorClase(CLASE_TIPOCARGO, POTENZA_IDPROYCTO);
        return $EstructuraResultado;
    }

    /**
     * permite listas de nivel educativo
     * @return listado de nivel educativo
     */
    public function obtenerNivelEducativo() {
        //$EstructuraResultado = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_NIVELEDUCATIVO);
        $EstructuraResultado = $this->genericoModel->obtenerListaPorClase(CLASE_NIVELEDUCATIVO, POTENZA_IDPROYCTO);
        return $EstructuraResultado;
    }

    /**
     * permite listas de parentescos
     * @return listado de parentescos
     */
    public function obtenerParentesco() {
        //$EstructuraResultado = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_PARENTESCO);
        $EstructuraResultado = $this->genericoModel->obtenerListaPorClase(CLASE_PARENTESCO, POTENZA_IDPROYCTO);
        return $EstructuraResultado;
    }

    public function obtenerExperienciaFinanciera() {
        //$EstructuraResultado = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_EXPERIENCIAFINANCIERA);
        $EstructuraResultado = $this->genericoModel->obtenerListaPorClase(CLASE_EXPERIENCIAFINANCIERA, POTENZA_IDPROYCTO);
        return $EstructuraResultado;
    }

    /**
     * permite listas de los tipos activos
     * @return listado de tipos activos
     */
    public function obtenerTipoActivos() {
        //$EstructuraResultado = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_TIPOACTIVOS);
        $EstructuraResultado = $this->genericoModel->obtenerListaPorClase(CLASE_TIPOACTIVOS, POTENZA_IDPROYCTO);
        return $EstructuraResultado;
    }

    /**
     * permite listas de correspondencias
     * @return listado de correspondencias
     */
    public function obtenerCorrespondencia() {
        //$EstructuraResultado = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_ENVIOCORRESPONDECIA);
        $EstructuraResultado = $this->genericoModel->obtenerListaPorClase(CLASE_ENVIOCORRESPONDECIA, POTENZA_IDPROYCTO);
        return $EstructuraResultado;
    }

    /**
     * permite listas los tipos de vivienda
     * @return listado de tipos de vivienda
     */
    public function obtenerVivienda() {
        //$EstructuraResultado = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_TIPOVIVIENDA);
        $EstructuraResultado = $this->genericoModel->obtenerListaPorClase(CLASE_TIPOVIVIENDA, POTENZA_IDPROYCTO);
        return $EstructuraResultado;
    }

    /**
     * permite listas los tipos de vivienda
     * @return listado de tipos de vivienda
     */
    public function obtenerTipoIdentificacion() {
        //$EstructuraResultado = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_TIPOIDENTIFICACION);
        $EstructuraResultado = $this->genericoModel->obtenerListaPorClase(CLASE_TIPOIDENTIFICACION, POTENZA_IDPROYCTO);
        return $EstructuraResultado;
    }

    /**
     * permite listas las profesiones
     * @return listado de profesiones
     */
    public function obtenerEstadocivil() {
        // $EstructuraResultado = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_ESTADOCIVIL);
        $EstructuraResultado = $this->genericoModel->obtenerListaPorClase(CLASE_ESTADOCIVIL, POTENZA_IDPROYCTO);
        return $EstructuraResultado;
    }

    /**
     * permite listas las profesiones
     * @return listado de profesiones
     */
    public function obtenerDestinoCredito() {
        //       $EstructuraResultado = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_DESTINOCREDITO);
        $EstructuraResultado = $this->genericoModel->obtenerListaPorClaseDestino(CLASE_DESTINOCREDITO, POTENZA_IDPROYCTO);
        return $EstructuraResultado;
    }

    /**
     * permite listas las profesiones
     * @return listado de profesiones
     */
    public function obtenerMotivosValidacion($usuario, $programa) {
        //$EstructuraResultado = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_MOTIVO_APROBACION);
        $EstructuraResultado = $this->registroCreditoModel->consultarMotivos($programa, ESTRUCTURA_MOTIVO_APROBACION, $usuario);
        return $EstructuraResultado;
    }

    public function obtenerMotivosRechazo($usuario, $programa) {
        //   $EstructuraResultado = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_MOTIVO_RECHAZO);
        $EstructuraResultado = $this->registroCreditoModel->consultarMotivos($programa, ESTRUCTURA_MOTIVO_RECHAZO, $usuario);
        return $EstructuraResultado;
    }

    /**
     * permite listas las actividades económicas
     * @return listado las actividades económicas
     */
    public function obtenerActividadEconomica() {
        //$EstructuraResultado = $this->genericoModel->obtenerEstructurasPorCodigoModel(ESTRUCTURA_ACTIVIDADECONOMICA);
        $EstructuraResultado = $this->genericoModel->obtenerListaPorClase(CLASE_ACTIVIDADECONOMICA, POTENZA_IDPROYCTO);
        return $EstructuraResultado;
    }

    /**
     * permite listas las profesiones
     * @return listado de profesiones
     */
    public function obtenerMunicipios($iddepartamento) {
        $idusuario = $this->sesion->get('idusuario');
        $idempresa = $this->sesion->get('idempresa'); //LLANOGAS_IDPROYCTO; 
        $EstructuraResultado = $this->genericoModel->getMunicipiosPorCiudad($iddepartamento, $idempresa, $idusuario);
        return $EstructuraResultado;
    }

    /**
     * permite listas las profesiones
     * @return listado de profesiones
     */
    public function obtenerPaises() {
        $EstructuraResultado = $this->genericoModel->obtenerPaises();
        return $EstructuraResultado;
    }

    /**
     * permite listas las profesiones
     * @return listado de profesiones
     */
    public function obtenerBarrios($idMunicipio) {
        $EstructuraResultado = $this->genericoModel->getBarrios($idMunicipio);
        return $EstructuraResultado;
    }

    /**
     * permite listas las bancos disponibles
     * @return listado de bancos
     */
    public function obtenerBancos() {
        $EstructuraResultado = $this->registroCreditoModel->consultarTerceroPorClase(CLASE_BANCOS_DESEMBOLO);
        return $EstructuraResultado;
    }

    /**
     * permite listas las empresas disponibles
     * @return listado de empresas
     */
    public function obtenerEmpresas() {
        $EstructuraResultado = $this->registroCreditoModel->consultarTerceroPorClase(CLASE_EMPRESAS);
        return $EstructuraResultado;
    }

    /**
     * permite listas las empresas disponibles
     * @return listado de empresas
     */
    public function obtenerCiudades($iddepartamento) {
        $EstructuraResultado = $this->genericoModel->obtenerCiudades($iddepartamento);
        return $EstructuraResultado;
    }

    /**
     * permite listas las empresas disponibles
     * @return listado de empresas
     */
    public function obtenerDepartamentos($idpais) {
        $EstructuraResultado = $this->genericoModel->obtenerDepartamentos($idpais);
        return $EstructuraResultado;
    }

    /**
     * permite validar el credito
     * @param int $idcredito identificador del tipo de crédito
     * @param int $idmotivo identificador de motivo
     * @param string $comentario comentario de la aprobacion o rechazo
     * @param char  $estado estado 'A'  Rechazado 'R'
     */
    public function validarCredito($idcredito, $idmotivo, $comentario, $estado) {
        $identificadorEstado = 0;
        if ($estado == 'A') {
            $identificadorEstado = ESTADO_RADICACION_VALIDADO;
        } else {
            $identificadorEstado = ESTADO_RADICACION_RECHAZADO;
        }

        $this->registroCreditoModel->validarCredito($idcredito, $identificadorEstado);
        $this->registroCreditoModel->insertarComentarioCredito($idcredito, $idmotivo, $identificadorEstado, $comentario);

        $informacion = $this->registroCreditoModel->obtenerCorreo($idcredito);
        if (!empty($informacion['correo'])) {
            Util::enviarCorreo($this->control, $informacion, $comentario, 'Crédito potenza');
        }
    }

    public function aprobarCreditoAprobadoNoDesembolsado($idcredito, $idmotivo, $comentario, $estado) {

        $this->registroCreditoModel->validarCredito($idcredito, $estado);
        $this->registroCreditoModel->insertarComentarioCredito($idcredito, $idmotivo, $estado, $comentario);

        $informacion = $this->registroCreditoModel->obtenerCorreo($idcredito);
        if (!empty($informacion['correo'])) {
            Util::enviarCorreo($this->control, $informacion, $comentario, 'Crédito potenza');
        }
    }

    public function enviarCorreoCreditoDesembolsado($idcredito) 
    {   
        $informacion = $this->registroCreditoModel->obtenerCorreo($idcredito);
        if (!empty($informacion['correo'])) {
            Util::enviarCorreoDese($this->control, $informacion, 'Crédito potenza');
        }
    }

    /**
     * permite aprobar rechazar solicitud
     * @param type $idestado
     * @param type $idmotivo
     * @param type $comentario
     * @param type $idcredito
     */
    public function AprobarRechazarSolicitud($idestado, $idmotivo, $comentario, $idcredito) {

        $this->registroCreditoModel->validarCredito($idcredito, $idestado);
        $this->registroCreditoModel->insertarComentarioCredito($idcredito, $idmotivo, $idestado, $comentario);

        $informacion = $this->registroCreditoModel->obtenerCorreo($idcredito);
        if (!empty($informacion['correo'])) {
            Util::enviarCorreo($this->control, $informacion, $comentario, 'Crédito potenza');
        }
    }

    /**
     * permite obtener el listado de comentarios 
     * @param type $idcredito
     */
    public function obtenerComentarios($idcredito) {
        //permite obtener los comentarios
        $comentarios = $this->registroCreditoModel->obtenerComentariosModel($idcredito);
        return $comentarios;
    }

    /**
     * permite obtener el listado de terceros para autocomplete 
     * @param type $idcredito
     */
    public function obtenerTerceroAutoComplete($etapa, $nombre) {
        //permite obtener los comentarios
        $comentarios = $this->registroCreditoModel->obtenerTerceroAutoComplete($etapa, $nombre);
        return $comentarios;
    }

    /**
     * Permite eliminar el archivo adjunto 
     * @param type $idArchivo
     * @throws MyException
     */
    public function eliminarArchivo($idArchivo) {
        try {
            $archivo = $this->registroCreditoModel->consultarArchivo($idArchivo);
            if (file_exists($archivo['rutaarchivo'])) {
                unlink($archivo['rutaarchivo']);
            }
            $this->registroCreditoModel->eliminarAdjuntosRegistroCredito($idArchivo);
        } catch (\Exception $e) {
            throw new MyException('Error al eliminar el archivo', -1);
        }
    }

    /**
     * Consulta el convenio de la empresa, para insertar el suscriptor
     * @return type
     */
    public function consultarConvenioId() {
        $idEmpresa = $this->sesion->get('idempresa');
        $conveniio = $this->registroCreditoModel->consultarConvenio($idEmpresa);
        return $conveniio['cnre_ideregistr'];
    }

}
