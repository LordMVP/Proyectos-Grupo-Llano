<?php

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Models\EstadoCuentaModel;

/**
 * Clase que muestra la información de una suscripción, de acuerdo  a una fecha de corte
 */
class EstadoCuentaController extends Controller {

    /**
     * Función que se encarga de mostrar el twig de la clase
     * @return html
     */
    public function indexAction() {
        $conexion = Util::getConexion($this);
        $sesion = Util::iniciarSesion($this);
        $idEmpresa = $sesion->get('idEmpresa');
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $response = $this->render('LlanogasLlanogasBundle:Cartera:EstadoCuenta.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta las suscripciones de acuerdo a fecha de corte, idsuscripcion, codigo anterior
     * documento de suscriptor,cartera normal.
     * @return json con la información de las suscripciones consultadas.
     */
    public function consultarSuscripcionesAction() {
        try {
            $respuesta["codigoRespuesta"] = -1;
            $conexion = Util::getConexion($this);
            $estadoCuentaModel = new EstadoCuentaModel($conexion);
            Util::validarPeticion($this);
            $parametros = $this->getParametrosFiltro();
            $suscripciones = $estadoCuentaModel->consultarSuscripcines($parametros);

            $respuesta["codigoRespuesta"] = empty($suscripciones) ? 0 : 1;
            foreach ($suscripciones as &$suscripcion) {
                if ($suscripcion['estadosuscripcion'] == 'E') {
                    $facturasCastigadas = $estadoCuentaModel->consultarFacturasCastigadas($suscripcion['idsuscripcion']);
                    if (!empty($facturasCastigadas)) {
                        $suscripcion['facturacastigada'] = true;
                    }
                }
            }
            $respuesta["suscripciones"] = $suscripciones;
            $respuesta["mensajeRespuesta"] = 'La consulta se realizó correctamente';
        } catch (MyException $ex) {
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Obtiene los parámetrso de la petición.
     * @return type
     * @throws MyException Error en la fecha de corte 
     */
    public function getParametrosFiltro() {
        $sesion = Util::iniciarSesion($this);
        $request = $this->getRequest();
        $fechaCorte = $request->get('fechacorte');
        if (empty($fechaCorte)) {
            throw new MyException('La fecha de corte es obligatorio');
        }
        $parametros['fechacorte'] = $fechaCorte;
        $parametros['idsuscripcion'] = $request->get('idsuscripcion');
        $parametros['codigoanterior'] = $request->get('codigoanterior');
        $parametros['documentosuscriptor'] = $request->get('documentosuscriptor');
        $parametros['idempresa'] = $sesion->get('idEmpresa');
        return $parametros;
    }

    /**
     * Consulta toda el estado de una suscripción.
     * @return json Información de una suscripción.
     * @throws MyException Error en la suscripción si no llega.
     */
    public function consultarEstadoCuentaAction() {
        try {
            $respuesta["codigoRespuesta"] = -1;
            $conexion = Util::getConexion($this);
            $request = $this->getRequest();
            $estadoCuentaModel = new EstadoCuentaModel($conexion);

            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            $fechaCorte  = $request->get('fechacorte');
            $fechaInicio = $request->get('fechainicio');
            $fechaFin    = $fechaCorte;

            if (!is_numeric($idSuscripcion)) {
                throw new MyException('Error en el identificador de la suscripción.');
            }

            $respuesta["codigoRespuesta"] = 1;
            $listaFinanciaciones = $estadoCuentaModel->consultarFinanciaciones($idSuscripcion, $fechaCorte);
            $listaFacturasCarteraNormal = $estadoCuentaModel->consultarFacturas($idSuscripcion, $fechaCorte);
            $listaVlrFinanciaciones = $estadoCuentaModel->consultarVlrFinanciado($idSuscripcion, $fechaInicio, $fechaFin);
            //Calcula los días de mora que tiene de acuerdo a las amortizaciones que tiene el usuario
            $respuesta['diasmorafinanciada'] = $this->getDiasMora(NULL, $listaFinanciaciones['facturamora']);
            $respuesta['valorfinanciacion'] = $listaFinanciaciones['valorfinanciacion'];
            unset($listaFinanciaciones['facturamora']);
            unset($listaFinanciaciones['valorfinanciacion']);
            $respuesta["financiaciones"] = $listaFinanciaciones;
            $respuesta["vlrfinanciaciones"] = $listaVlrFinanciaciones;
            //Se calcula los días de mora que tiene el usuario de acuerdo a la primera factura
            // de la cartera normal o por consumo
            $respuesta['diasmoranormal'] = $this->getDiasMora($listaFacturasCarteraNormal, NULL);
            //Realiza la sumatoria de la deuda que tiene el usuario 
            $respuesta['valornormal'] = $this->getValorCateraNormal($listaFacturasCarteraNormal);
            $respuesta["carteranormal"] = $listaFacturasCarteraNormal;
            $respuesta["mensajeRespuesta"] = 'La consulta se realizó correctamente';
        } catch (MyException $ex) {
            $respuesta["mensajeError"] = $ex->getMessage();
            $respuesta["codigoRespuesta"] = $ex->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Función que se encarga de realizar la diferencia de días que tiene 
     * con respecto a una lista de facturas 
     * @param type $listaFacturas lista de facturas por  consumo
     * @param type $listaFinanciaciones lista de facturas por financiaciones 
     * @return int número de días que tiene el usuario de mora 
     */
    public function getDiasMora($listaFacturas, $listaFinanciaciones) {
        $fecha = '';
        if (!empty($listaFacturas)) {
            $fecha = $listaFacturas[0]['fecha'];
        }
        if (!empty($listaFinanciaciones)) {
            $fecha = $listaFinanciaciones[0]['fecha'];
        }
        if (empty($fecha)) {
            return 0;
        }
        $fechaFormato = new \DateTime($fecha);
        $diferencia = abs(strtotime(date('d-m-Y')) - strtotime($fechaFormato->format('d-m-Y')));
        //Converte la direfencia que se da en segudos a días 
        return round($diferencia / 86400);
    }

    /**
     * Realiza la sumatoria del saldo de las facturas de consumo 
     * @param type $listaFacturas lista de facturas 
     * @return int sumatoria de las factuas 
     */
    public function getValorCateraNormal($listaFacturas) {
        if (empty($listaFacturas)) {
            return 0;
        }
        $valor = 0;
        foreach ($listaFacturas as $factura) {
            $valor += ($factura['valorreal'] - $factura['valorpagado']);
        }
        return $valor;
    }

    /**
     * Realiza la sumatoria del saldo de las amortizaciones que tiene el usuario
     * @param type $listaFinanciada lista de amoritzaciones que el usuario no ha pagado
     * @return int Valor que el usuario tiene en deuda por amortizaciones
     */
    public function getValorCateraFinanciada($listaFinanciada) {
        if (empty($listaFinanciada)) {
            return 0;
        }
        $valor = 0;
        foreach ($listaFinanciada as $financiacion) {
            $valor += $financiacion['saldofinanciacion'];
        }
        return $valor;
    }

}
