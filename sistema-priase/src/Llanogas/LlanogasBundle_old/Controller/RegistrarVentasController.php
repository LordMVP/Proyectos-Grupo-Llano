<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Delegado\SuscripcionesDelegado;
use Llanogas\LlanogasBundle\Delegado\RegistrarVentasDelegado;

/**
 * Clase encargada de administrar el registro de ventas.
 */
class RegistrarVentasController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $lisParametros['listamunicipios'] = array();
        //Se controla la excepción si hay un error con la comunicación 
        //con la base de datos
        try {
            $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
            $lisParametros['listamunicipios'] = $suscripcionesDelegado->getMunicipiosPorPerfil(PROGRAMA_VENTAS);
        } catch (\Exception $e) {
            
        }
        $lisParametros['fecha'] = date('Y-m-d');
        $response = $this->render('LlanogasLlanogasBundle:Ventas:registrar_ventas.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Busca la suscripción a la que se quiere realizar la venta
     * @return type
     * @throws MyException
     */
    public function buscarSuscripcionAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idMunicipio = $request->get('idmunicipio');
            if (!is_numeric($idMunicipio)) {
                throw new MyException('Error, el municipio es obligatorio', 0);
            }
            $estado = "'E'";
            $parametros['idmunicipio'] = $idMunicipio;
            $parametros['idtercero'] = $request->get('idtercero');
            $parametros['cedula'] = $request->get('cedula');
            $parametros['direccion'] = $request->get('direccion');
            $parametros['numerocatastral'] = $request->get('numerocatastral');
            $parametros['idbarrio'] = $request->get('idbarrio');
            $parametros['numeropropiedad'] = $request->get('numeropropiedad');
            $parametros['idsuscripcion'] = $request->get('idsuscripcion');
            $parametros['codigoanterior'] = $request->get('codigoanterior');
            $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
            $suscripciones = $suscripcionesDelegado->getSuscripciones($parametros, $estado);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['suscripciones'] = $suscripciones;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta las lista de firmas instaladoras que
     * tengan el certificado vigente
     * @return json lista de firmas intaladoras
     */
    public function getFirmasInstaladorasAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $nombreFirma = $request->get('nombrefirmainstaladora');
            if (empty($nombreFirma)) {
                throw new MyException('Error, el nombre de la firma es obligatorio', -1);
            }
            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion);
            $listaFirmas = $registrarVentasDelegado->getFirmasInstaladoras($nombreFirma);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['firmasinstaladoras'] = $listaFirmas;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los terceros vinculados a la firma instaladora
     * @return json lista de terceros 
     */
    public function getFuncionariosFirmaAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idFirmaInstaladora = $request->get('idfirmainstaladora');
            if (!is_numeric($idFirmaInstaladora)) {
                throw new MyException('Error, debe seleccionar una empresa instaladora', - 1);
            }
            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion);
            $listaFuncionarios = $registrarVentasDelegado->getFuncionariosFirma($idFirmaInstaladora);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['functionarios'] = $listaFuncionarios;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta todos los terceros que tengan vinculado 
     * la unidad de asesores comerciales  
     * @return json Lista de asesores 
     */
    public function getAsesoresAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $nombreAsesor = $request->get('nombreasesor');
            if (empty($nombreAsesor)) {
                throw new MyException('Error, el nombre del asesor es obligatorio', - 1);
            }
            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion);
            $listaAsesores = $registrarVentasDelegado->getAsesores($nombreAsesor);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['asesores'] = $listaAsesores;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los organismos de inspección que están habilitados
     * de acuerdo a la tabla clte_
     * @return type
     */
    public function getOrganismosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $nombreOrganismo = $request->get('nombreorganismo');
            if (empty($nombreOrganismo)) {
                throw new MyException('Error, el nombre del organismo es obligatorio', - 1);
            }
            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion);
            $listaAsesores = $registrarVentasDelegado->getOrganismosInspeccion($nombreOrganismo);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['organismos'] = $listaAsesores;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los documentos de acuerdo al tipo de documento, y 
     * que el usuario los pueda realizar la venta
     * @return json lista de documentos
     */
    public function getDocumentosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idTipoDocumento = $request->get('idtipodocumento');
            $tipoventa = $request->get('tipoventa');
            if ($tipoventa != 'P' && $tipoventa != 'S') {
                throw new MyException('Error, debe seleccionar el tipo de venta ', -1);
            }
            if (!is_numeric($idTipoDocumento)) {
                throw new MyException('Error, debe seleccionar tipo de documento', - 1);
            }
            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion);
            $listaDocumentos = $registrarVentasDelegado->getDocumentos($idTipoDocumento, $tipoventa);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['documentos'] = $listaDocumentos;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta las liquidaciones que se tiene 
     * asignadas al usuario y que tenga el documento y tipo de documento 
     * seleccionados 
     * @return lista de liquidaciones
     */
    public function getLiquidacionesAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idTipoDocumento = $request->get('idtipodocumento');
            $idSuscripcion = $request->get('idsuscripcion');
            $idDocumento = $request->get('iddocumento');
            if (!is_numeric($idTipoDocumento) || !is_numeric($idSuscripcion)) {
                throw new MyException('Debe seleccionar el tipo de documento y/o suscripción ', -1);
            }
            if (empty($idDocumento)) {
                throw new MyException('Error, debe seleccionar un documento', -1);
            }
            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion);
            $listaTiposDocumentos = $registrarVentasDelegado->getLiquidaciones($idSuscripcion, $idTipoDocumento, $idDocumento);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['tiposdocumentos'] = $listaTiposDocumentos;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los conceptos de las liquidaciones y
     * valida si el concepto se puede editar en la interfaz
     * @return type
     * @throws MyException
     */
    public function getConceptosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $Liquidaciones = $request->get('liquidaciones');
            if (empty($Liquidaciones)) {
                throw new MyException('Error, la liquidación es obligatoria', -1);
            }
            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion);
            $listaTiposDocumentos = $registrarVentasDelegado->getConceptos($Liquidaciones);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['conceptos'] = $listaTiposDocumentos;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getVentasAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $parametros = $request->get('parametros');
            if (empty($parametros) || !is_array($parametros)) {
                throw new MyException('Error, no hay parámetros de búsqueda', -1);
            }
            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion);
            $listaVentas = $registrarVentasDelegado->getVentas($parametros);            
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['listaventas'] = $listaVentas;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getVentasPorSuscripcionAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $estado = $request->get('estado');
            $idsuscripcion = $request->get('idsuscripcion');
            if (!is_numeric($idsuscripcion)) {
                throw new MyException('Error, la suscripción es obligatoria.', -1);
            }

            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion);
            $listaVentas = $registrarVentasDelegado->getVentasPorSuscripcion($idsuscripcion, $estado);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['listaventas'] = $listaVentas;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function liquidarVentaAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $listaConceptos = json_decode($request->get('conceptos'), true);
            $idSuscripcion = $request->get('idsuscripcion');
            $liquidaciones = $request->get('liquidaciones');
            if (!is_numeric($idSuscripcion)) {
                throw new MyException('Error, la suscripción es obligatoria ', -1);
            }
            if (empty($liquidaciones)) {
                throw new MyException('Debe seleccionar al menos una liquidación ', -1);
            }
            if (empty($listaConceptos) || !is_array($listaConceptos)) {
                throw new MyException('La venta debe tener al menos un concepto', -1);
            }
            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion, $idSuscripcion);
            $venta = $registrarVentasDelegado->liquidarVenta($listaConceptos, $liquidaciones);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['venta'] = $venta;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    
    public function wsLiquidarVentaAction() {
        try {
            $respuesta = array();                             
            $request = $this->getRequest();

            $idUsuario = $request->get('idUsuario');
            $idEmpresa = $request->get('idEmpresa');
            $idPerfil= $request->get('idPerfil');
            $idAcceso = $request->get('idAcceso');
            $nombre = $request->get('nombre');
            
            $idSuscripcion = $request->get('idSuscripcion');
            $liquidaciones = $request->get('liquidaciones');
            $listaConceptos = json_decode($request->get('conceptos'), true);
            
            $sesion = Util::validarToken($this, $idEmpresa, $idUsuario, $idPerfil,
                    $idAcceso, $nombre);
            Util::validarPeticion($this);
            
            
            if (!is_numeric($idSuscripcion)) {
                throw new MyException('Error, la suscripción es obligatoria ', -1);
            }
            if (empty($liquidaciones)) {
                throw new MyException('Debe seleccionar al menos una liquidación ', -1);
            }
            if (empty($listaConceptos) || !is_array($listaConceptos)) {
                throw new MyException('La venta debe tener al menos un concepto:'.implode(",",$listaConceptos), -1);
            }
            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion, $idSuscripcion);
            $venta = $registrarVentasDelegado->liquidarVenta($listaConceptos, $liquidaciones);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['data'] = $venta;
            $respuesta['mensaje'] = 'Consulta realizada correctamente ';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    
    public function validarResolucionFacturacionAction() {
        try {
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $iddocumento = $request->get('iddocumento');
            $respuesta = array();
            if (empty($iddocumento)) {
                throw new MyException('El documento es requerido para la validación de la resolución', -1);
            }
            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion);
            /* Se realiza una validación para verificar los consecutivos de la venta y la fecha de resolución */
            $validarFacturacion = $registrarVentasDelegado->validarResolucionFacturacion($iddocumento);

            $respuesta['codigoRespuesta'] = (!empty($validarFacturacion)) ? 1 : 0;
            $respuesta['mensaje'] = (!empty($validarFacturacion)) ? $validarFacturacion[0]['mensaje'] : '';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function registrarVentaAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $venta = json_decode($request->get('venta'), true);
            if (!is_array($venta)) {
                throw new MyException('Error en la información de la venta', -1);
            }
            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion);
            $idVenta = $registrarVentasDelegado->registrarVenta($venta);
            $respuesta['datos'] = $idVenta;
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se guardó la venta correctamente con número <b>' . $idVenta . ' </b>';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function actualizarAdjuntoVentaAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $parametros = $request->get('parametros');
            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion);
            $registrarVentasDelegado->actualizarAdjuntoVenta($parametros);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se guardó la información correctamente con número ' . $parametros['numeroventa'];
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function validarEliminacionConceptoAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idConcepto = $request->get('idconcepto');
            if (empty($idConcepto)) {
                throw new MyException('Error, el concepto es obligatorio', -1);
            }
            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion);
            $validacion = $registrarVentasDelegado->validarEliminacionConcepto($idConcepto);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['eliminar'] = $validacion;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getTiposDocumentosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idTipoUsoSuscripcion = $request->get('idtipousosuscripcion');
            $idMunicipio = $request->get('idmunicipio');
            if (!is_numeric($idMunicipio) || !is_numeric($idTipoUsoSuscripcion)) {
                throw new MyException('Debe seleccionar una suscripción', -1);
            }
            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion);
            $listaTiposDocumentos = $registrarVentasDelegado->getTiposDocumentos($idTipoUsoSuscripcion, $idMunicipio);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['tipodocumentos'] = $listaTiposDocumentos;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Permite confirmar si el archivo se puede eliminar correctamente
     * @return type
     * @throws MyException
     */
    public function eliminarArchivoVentaAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idarchivo = $request->get('idarchivo');
            if (!is_numeric($idarchivo)) {
                throw new MyException('Debe seleccionar el archivo a eliminar');
            }
            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion);
            $registrarVentasDelegado->confirmarEliminarArchivoAdjunto($idarchivo);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Archivos eliminados satisfactoriamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function cargarInformacionFormatoAction() {
        try {
            $respuesta = array();
            Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $info = $request->get('informacion');
            $_SESSION['informacionformato'] = $info;

            $respuesta['codigoRespuesta'] = empty($info) ? -1 : 1;
            $respuesta['mensaje'] = empty($info) ? 'No se encontró información para cargar en el archivo' : 'Información guardada';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function exportarAutorizacionAction() {
        $sesion = Util::iniciarSesion($this);
        $informacion = $sesion->get('informacionformato');
        if (empty($informacion)) {
            throw new MyException('No se encontró información de la venta');
        }
        $informacion['usuario'] = $sesion->get('usuario');
        $objPHPExcel = $this->cargarInformacion($informacion);
        $formato = 'Excel2007';
        $this->response = new StreamedResponse();
        $this->response->setCallback(function()use($formato, $objPHPExcel) {
            $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, $formato);
            $objWriter->save('php://output');
        });

        $this->response->headers->set('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
        $this->response->headers->set('Content-Disposition', 'attachment; filename=Contrato_Autorizaciones.xlsx');
        return $this->response;
    }

    private function cargarInformacion($informacion) {
        $sesion = Util::iniciarSesion($this);
        $formatoNombre = "AutorizacionesyContrato".$sesion->get('idEmpresa');
        $nombre = RUTA_PRINCIPAL . '/app/Resources/formatos/'.$formatoNombre.'.xlsx';
        $objReader = \PHPExcel_IOFactory::createReaderForFile($nombre);
        //$hojaCargada->setActiveSheetIndex(0);
        $hoja = array('Autorizaciones');
        $objReader->setLoadSheetsOnly($hoja);
        $xlsObj = $objReader->load($nombre);
        $sheetActive = $xlsObj->getActiveSheet();
        $A2 = (string) $sheetActive->getCell('A2')->getValue();
        $A14 = (string) $sheetActive->getCell('A14')->getValue();
        $A45 = (string) $sheetActive->getCell('A45')->getValue();

        $A2 = str_replace('(TIPO_USO)', $informacion['tipouso'], $A2);
        $A2 = str_replace('(ESTRATO_CATEGORIA)', $informacion['estrato'], $A2);
        $A2 = str_replace('(NOMBRE_TERCERO)', $informacion['nombretercero'], $A2);
        $marca='X';
        if($informacion['tipouso']=="Uso Residencial Gas"){
            $C7 = str_replace('(CA)', $marca, $C7);
            $C9 = str_replace('(CA)', '', $C9);
            $C10 = str_replace('(CA)', '', $C10);
            $C11 = str_replace('(CA)', '', $C11);
            $C12 = str_replace('(CA)', '', $C12);
        }
        else{
            if($informacion['estrato']=="1"){
                $C7 = str_replace('(CA)', '', $C7);
                $C9 = str_replace('(CA)', $marca, $C9);
                $C10 = str_replace('(CA)', '', $C10);
                $C11 = str_replace('(CA)', '', $C11);
                $C12 = str_replace('(CA)', '', $C12);
            }
            else{
                if($informacion['estrato']=="2"){
                    $C7 = str_replace('(CA)', '', $C7);
                    $C9 = str_replace('(CA)', '', $C9);
                    $C10 = str_replace('(CA)', $marca, $C10);
                    $C11 = str_replace('(CA)', '', $C11);
                    $C12 = str_replace('(CA)', '', $C12);
                }
                else{
                    if($informacion['estrato']=="3"){
                        $C7 = str_replace('(CA)', '', $C7);
                        $C9 = str_replace('(CA)', '', $C9);
                        $C10 = str_replace('(CA)', '', $C10);
                        $C11 = str_replace('(CA)', $marca, $C11);
                        $C12 = str_replace('(CA)', '', $C12);
                    }
                    else{
                        $C7 = str_replace('(CA)', '', $C7);
                        $C9 = str_replace('(CA)', '', $C9);
                        $C10 = str_replace('(CA)', '', $C10);
                        $C11 = str_replace('(CA)', '', $C11);
                        $C12 = str_replace('(CA)', $marca, $C12);
                    }
                }
            }
        }
        

        $A14 = str_replace('(DIAS)', $informacion['dias'], $A14);
        $A14 = str_replace('(BARRIO)', $informacion['barrio'], $A14);
        $A14 = str_replace('(MUNICIPIO)', $informacion['municipio'], $A14);
        $A14 = str_replace('(DIRECCION)', $informacion['direccion'], $A14);
        $A14 = str_replace('(MESACTUAL)', $informacion['mesactual'], $A14);
        $A14 = str_replace('(ANIOACTUAL)', $informacion['anioactual'], $A14);


        $A45 = str_replace('(DIAS)', $informacion['dias'], $A45);
        $A45 = str_replace('(MESACTUAL)', $informacion['mesactual'], $A45);
        $A45 = str_replace('(ANIOACTUAL)', $informacion['anioactual'], $A45);
        $fecha = (string) date('Y-m-d');
        if($sesion->get('idEmpresa') == 322){
        $xlsObj->getActiveSheet()->setCellValue('A2', $A2)
                ->setCellValue('C7', $C7)
                ->setCellValue('C9', $C9)
                ->setCellValue('C10', $C10)
                ->setCellValue('C11', $C11)
                ->setCellValue('C12', $C12)
                ->setCellValue('A14', $A14)
                ->setCellValue('A45', $A45)
                ->setCellValue('E66', $fecha)
                ->setCellValue('A66', $informacion['usuario'])
                ->setCellValue('C66', $informacion['numeroventa'])
                ->setCellValue('B40', $informacion['documento'])
                ->setCellValue('B61', $informacion['documento'])
                ->setCellValue('B100', $informacion['documento'])
                ->setCellValue('G66', $informacion['idsuscripcion'])
                ->setCellValue('B39', $informacion['nombretercero'])
                ->setCellValue('B60', $informacion['nombretercero'])
                ->setCellValue('B99', $informacion['nombretercero'])
                ->setCellValue('B104', $informacion['nombretercero'])
                ->setCellValue('G104', $informacion['documento'])
                ->setCellValue('B105', $informacion['direccion'])
                ->setCellValue('G105', $informacion['barrio'])
                ->setCellValue('B106', $informacion['municipio']);
        }
        if($sesion->get('idEmpresa') == 319){
        $xlsObj->getActiveSheet()->setCellValue('A2', $A2)
                ->setCellValue('C7', $C7)
                ->setCellValue('C9', $C9)
                ->setCellValue('C10', $C10)
                ->setCellValue('C11', $C11)
                ->setCellValue('C12', $C12)
                ->setCellValue('A14', $A14)
                ->setCellValue('A45', $A45)
                ->setCellValue('E74', $fecha)
                ->setCellValue('A74', $informacion['usuario'])
                ->setCellValue('C74', $informacion['numeroventa'])
                ->setCellValue('B40', $informacion['documento'])
                ->setCellValue('B59', $informacion['documento'])
                ->setCellValue('B71', $informacion['documento'])
                ->setCellValue('G74', $informacion['idsuscripcion'])
                ->setCellValue('B39', $informacion['nombretercero'])
                ->setCellValue('B58', $informacion['nombretercero'])
                ->setCellValue('B70', $informacion['nombretercero']);
        }
        return $xlsObj;
    }

}
