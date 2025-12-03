<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\RecaudoRapidoDelegado;
use Llanogas\LlanogasBundle\Delegado\RecaudosDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Clase encargada de administrar los recaudos en forma de abono, 
 * de la interfaz de recaudo rápido
 */
class RecaudoRapidoController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $recaudosDelegado = new RecaudosDelegado($this, $sesion);
        $recaudoRapidoDelegado = new RecaudoRapidoDelegado($this, $sesion);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        //cargar el combo de medios de pago
        $cmbMedioPago = $recaudosDelegado->cargarComboDb('cmbMedioPago');
        $lisParametros['cmbMedioPago'] = $cmbMedioPago;

        //cargar el combo de clases de pago
        $cmbClasePago = $recaudosDelegado->cargarComboDb('cmbClasePago', 'PA', PROGRAMA_PAGOS_ID);
        $lisParametros['cmbClasePago'] = $cmbClasePago;

        //cargar el combo de sucursales
        $cmbSucursal = $recaudosDelegado->consultarSucursal(PROGRAMA_PAGOS_ID);
        $lisParametros['cmbSucursal'] = $cmbSucursal;

        //cargar el combo de tipos de documento para informacion de anticipos
        //$lisParametros["cmbTiposDocumento"] = $this->cargarComboDb("cmbTiposDocumento", $recaudoRapidoDelegado->obtenerTiposDocumentoAnticipos());
        //cargar el combo de documentos        
        $lisParametros["cmbDocumentos"] = $recaudoRapidoDelegado->cargarComboDb("cmbDocumentos", 'AN');

        $fechaSugerida = time();
        $lisParametros["fechasugerida"] = date("Y-m-d H:i:s", $fechaSugerida);

        $lisParametros["idempresa"] = $sesion->get("idempresa");

        $response = $this->render('LlanogasLlanogasBundle:Recaudos:recaudorapido.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta si el usuario que se encuentra en sesion tiene permisos de 
     * recaudador externo
     * @return json Resultado que contiene la informacion del recaudador externo
     */
    public function getRecaudadorExternoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $recaudoRapidoDelegado = new RecaudoRapidoDelegado($this, $sesion);
            $recaudadorExterno = $recaudoRapidoDelegado->obtenerRecaudadorExterno();
            $respuesta["codigoRespuesta"] = (empty($recaudadorExterno) ? 0 : 1);
            $respuesta["datos"] = $recaudadorExterno;
            $respuesta["mensaje"] = (empty($recaudadorExterno)) ? "El usuario no puede realizar recaudos de un recaudador externo" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta las empresas que tienen convenio con la empresa del recaudo
     * @return json Resultado con las empresas del convenio
     */
    public function getEmpresasRecaudoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $recaudoRapidoDelegado = new RecaudoRapidoDelegado($this, $sesion);
            $empresasRecaudo = $recaudoRapidoDelegado->obtenerEmpresasRecaudo();
            $respuesta["codigoRespuesta"] = (empty($empresasRecaudo) ? 0 : 1);
            $respuesta["datos"] = $empresasRecaudo;
            $respuesta["mensaje"] = (empty($empresasRecaudo)) ? "No se encontraron empresas" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion de la suscripcion segun un id
     * @return json Resultado con la informacion de la suscripcion
     * @throws MyException
     */
    public function getInformacionSuscripcionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idSuscripcion = $request->get("idsuscripcion");
            if (empty($idSuscripcion) || !is_numeric($idSuscripcion)) {
                throw new MyException("El identificador de la suscripción es obligatorio");
            }
            $recaudoRapidoDelegado = new RecaudoRapidoDelegado($this, $sesion);
            $idSuscripcion=Util::validaSuscripcionCarteraNoHomologada($idSuscripcion)['suscripcion'];            
            $infoSuscripcion = $recaudoRapidoDelegado->obtenerInformacionSuscripcion($idSuscripcion);
            $respuesta["codigoRespuesta"] = (empty($infoSuscripcion) ? 0 : 1);
            $respuesta["datos"] = $infoSuscripcion;
            $respuesta["mensaje"] = (empty($infoSuscripcion)) ? "No se encontró información de la suscripción" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion de una suscripcion por un numero de factura
     * @return json Resutado con la informacion de la suscripcion
     * @throws MyException
     */
    public function getSuscripcionPorFacturaAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idFactura = $request->get("idfactura");
            if (empty($idFactura) || !is_numeric($idFactura)) {
                throw new MyException("El identificador de la factura es obligatorio");
            }
            $recaudoRapidoDelegado = new RecaudoRapidoDelegado($this, $sesion);
            $infoSuscripcion = $recaudoRapidoDelegado->obtenerSuscripcionPorFactura($idFactura);
            $respuesta["codigoRespuesta"] = (empty($infoSuscripcion) ? 0 : 1);
            $respuesta["datos"] = $infoSuscripcion;
            $respuesta["mensaje"] = (empty($infoSuscripcion)) ? "No se encontró información de la suscripción" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion de las facturas con saldo pertenecientes a una
     * suscripcion
     * @return json Resultado con la informacion de las facturas
     */
    public function getFacturasPorSuscripcionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $suscripcion = $request->get("suscripcion");
            $recaudoRapidoDelegado = new RecaudoRapidoDelegado($this, $sesion);
            /*
             * Se incluye escenario de manejo de Cartera G según prefijo en la suscripcion 
             */
            $parametrosCarteraAseoNoHomologada = Util::validaSuscripcionCarteraNoHomologada($suscripcion);
            $suscripcionCarteraAseoNoHomologada=$parametrosCarteraAseoNoHomologada['suscripcion'];
            $carteraAseoNoHomologada =  $parametrosCarteraAseoNoHomologada['carteraAseoNoHomologada'];
            if($carteraAseoNoHomologada==1)
            {                
               $facturas = $recaudoRapidoDelegado->obtenerFacturasSuscripcionCarteraNoHomologada($suscripcionCarteraAseoNoHomologada);
            }
            else {
                $facturas = $recaudoRapidoDelegado->obtenerFacturasSuscripcion($suscripcion);
            }
            $respuesta["codigoRespuesta"] = (empty($facturas) ? 0 : 1);
            $respuesta["datos"] = $facturas;
            $respuesta["mensaje"] = (empty($facturas)) ? "No se encontraron facturas con saldo" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * 
     * @param string $nombre nombre del select que va a cargarse
     * @param array $coleccion informacion que va a ser cargada en el select
     * @return html lista de seleccion para primer render de la vista
     */
    private function cargarComboDb($nombre, $coleccion) {
        $listaDatos = array();
        foreach ($coleccion as $campos) {
            $listaDatos[$campos['id']] = $campos['nombre'];
        }
        return Util::crearComboEx($nombre, $listaDatos);
    }

}
