<?php

namespace Llanogas\LlanogasBundle\Controller;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Delegado\InteresMoraDelegado;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\InteresMoraModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoInteresMora;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Clase encargada de administrar las peticiones del caso de uso 
 * de generar interés por mora
 * @author mebonilla
 */
class InteresMoraController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $conexion = Util::getConexion($this);
        $sesion = Util::iniciarSesion($this);
        $idEmpresa = $sesion->get('idEmpresa');
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $procesoActual = $this->consultarProcesoEjecucion($idEmpresa);
        $lisParametros["procesoActivo"] = count($procesoActual);
        $lisParametros["proceso"] = $procesoActual;
        $lisParametros['ciclos'] = $this->consultarCiclosActivos($conexion, $idEmpresa);
        $response = $this->render('LlanogasLlanogasBundle:Cartera:FacturarInteresMora.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta los ciclos activos de una empresa
     * @param Connection $conexion conexion a la base de datos.
     * @param int $idEmpresa identificador de la empresa.
     * @return array con la información de los ciclos
     */
    private function consultarCiclosActivos($conexion, $idEmpresa) {
        $genericoModel = new GenericoModel();
        $genericoModel->setConexion($conexion);
        return $genericoModel->getCiclosActivosPrograma($idEmpresa, PROGRAMA_FACTURAR_INTERESES_MORA);
    }

    /**
     * Consulta la lista de municipios para el programa
     * @return type
     * @throws MyException
     */
    public function getMunicipiosAction() {
        $sesion = Util::iniciarSesion($this);
        $request = $this->getRequest();
        try {
            Util::validarPeticion($this);
            $municipio = $request->get("municipio");
            if (empty($municipio)) {
                throw new MyException('Error, el municipio es obligatorio', -1);
            }
            $interesMoraDelegado = new InteresMoraDelegado($this, $sesion);
            $municipios = $interesMoraDelegado->obtenerMunicipios($municipio);
            $respuesta["codigoRespuesta"] = (empty($municipios) ? 0 : 1);
            $respuesta["datos"] = $municipios;
            $respuesta["mensaje"] = (empty($municipios)) ? "No se encontraron municipios" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion de una suscripcion
     * @return json Resultado con la informacion de una suscripcion
     * @throws MyException
     */
    public function getSuscripcionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idMunicipio = $request->get("idmunicipio");
            $idSuscripcion = $request->get("idsuscripcion");
            $codigoAnterior = $request->get("codigoanterior");
            if (empty($idMunicipio)) {
                throw new MyException("Error, municipio obligatorio", -1);
            }
            if (empty($idSuscripcion) && empty($codigoAnterior)) {
                throw new MyException("Error, la suscripción es obligatoria", -1);
            }
            $interesDelegado = new InteresMoraDelegado($this, $sesion);
            $suscripcion = $interesDelegado->filtrarSuscripciones($idMunicipio, $idSuscripcion, $codigoAnterior);
            $respuesta["codigoRespuesta"] = (empty($suscripcion) ? 0 : 1);
            $respuesta["datos"] = $suscripcion;
            $respuesta["mensaje"] = (empty($suscripcion)) ? "No se encontraron suscripciones" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Genera los intereses ocacionados por la mora.
     * @return json con la información de la transacción.
     * @throws MyException Error en el ciclo seleccionado.
     */
    public function getDocumentosInteresMoraAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $con = Util::getConexion($this);
            $genericoDelegado = new GenericoDelegado($con);
            $interesDelegado = new InteresMoraDelegado($this, $sesion);
            $accion = strtoupper($request->get("accion"));
            $parametros = array();
            switch ($accion) {
                case "S":
                    $parametros["idsuscripcion"] = $request->get("idsuscripcion");
                    break;
                case "C":
                    $parametros["idciclo"] = $request->get("idciclo");
                    $genericoDelegado->validarPrograma(PROGRAMA_FACTURAR_INTERESES_MORA, $parametros["idciclo"], $sesion->get("idempresa"));
                    // validar que no existan facturas sin aprobar
                    $facturas = $interesDelegado->obtenerFacturasSinAprobar($sesion->get("idempresa"));
                    if ($facturas > 0) {
                        throw new MyException("Aun existen facturas de interes por mora sin aprobar", -1);
                    }
                    break;
            }
            $parametros['idempresa'] = $sesion->get("idempresa");
            $documentos = $interesDelegado->consultarDocumentosInteresMora($accion, $parametros);
            $infoInteres["accion"] = $accion;
            $infoInteres["parametros"] = $accion;
            $sesion->set("infointeres", $infoInteres);
            $respuesta["codigoRespuesta"] = (empty($documentos) ? 0 : 1);
            $respuesta["datos"] = $documentos;
            $respuesta["mensaje"] = (empty($documentos)) ? "No se encontraron documentos de interés por mora" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Genera el proceso de interes por mora para una suscripcion o las
     * suscripciones de un ciclo
     * @return json Resultado de la generacion del interes por mora para una
     * suscripcion o las suscripciones de un ciclo
     * @throws MyException
     */
    public function generarInteresMoraAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);

            $actividad = "";
            $resultado = "";
            $parametros = array();
            $con = Util::getConexion($this);
            $accion = strtoupper($request->get("accion"));
            $genericoDelegado = new GenericoDelegado($con);
            //Se verifica que tipo de interés se va a ejecutar si
            // es por suscripción o por ciclo
            switch ($accion) {
                case "S":
                    $parametros["idsuscripcion"] = $request->get("idsuscripcion");
                    $interesDelegado = new InteresMoraDelegado($this, $sesion);
                    $resultado = $interesDelegado->generarInteresMora($parametros);
                    break;
                case "C":
                    $idAcceso = $sesion->get("idacceso");
                    $idUsuario = $sesion->get("idusuario");
                    $idCiclo = $request->get("idciclo");
                    $idEmpresa = $sesion->get('idEmpresa');
                    $procesoActual = $this->consultarProcesoEjecucion($idEmpresa);
                    if (count($procesoActual) > 0) {
                        throw new MyException("El proceso ya se esta ejecutando", -1);
                    }
                    $actividad = $genericoDelegado->validarPrograma(PROGRAMA_FACTURAR_INTERESES_MORA, $idCiclo, $sesion->get("idempresa"));
                    $procesoInteresMora = new ProcesoInteresMora($idEmpresa, $idCiclo, $actividad["idactividad"], $idAcceso, $idUsuario);
                    $procesoInteresMora->cargarFacturasInteresMora();
                    $resultado = $procesoInteresMora->cantidadFacturas();
                    $this->iniciarProcesoInteresMoraCiclo($idEmpresa, $idCiclo, $actividad["idactividad"], $idAcceso, $idUsuario);
                    break;
            }
            $respuesta["codigoRespuesta"] = (empty($resultado) ? 0 : 1);
            $respuesta["datos"] = $resultado;
            $respuesta["mensaje"] = (empty($resultado) || $resultado <= 0 ) ? "No han sido generadas facturas de interés por mora" : "Gestión de interés realizado correctamente";
            $sesion->remove("infointeres");
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Verifica que el proceso no se esté ejecutando por otro usuario.
     * @param int $idEmpresa identificador de la empresa.
     * @return array con la información del proceso
     */
    private function consultarProcesoEjecucion($idEmpresa) {
        $conexion = Util::getConexion($this);
        $objProcesoModel = new ProcesoModel($conexion);
        $resultado = $objProcesoModel->getProcesoEjecucionHilos($idEmpresa, PROGRAMA_FACTURAR_INTERESES_MORA);
        $conexion->close();
        return $resultado;
    }

    /**
     * Muestra el estado del proceso en ejecución 
     * @return json con el estado del proceso.
     */
    public function consultarProgresoAction() {
        $respuesta["codigoRespuesta"] = 1;
        $respuesta["mensajeError"] = "Progreso";
        $sesion = Util::iniciarSesion($this);
        $idEmpresa = $sesion->get("idEmpresa");
        $respuesta["progreso"] = $this->consultarProcesoEjecucion($idEmpresa);
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Cambia de estado las facturas generadas, las pasa de estado ='Z'(pendiente por aprobar) a 'A'
     * @return json cantidad de facturas aprobadas
     */
    public function setAprobacionInteresMoraAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $interesDelegado = new InteresMoraDelegado($this, $sesion);
            $resultado = $interesDelegado->lanzarAprobarLiquidacionInteresMora();
            $respuesta["codigoRespuesta"] = (empty($resultado) ? 0 : 1);
            $respuesta["datos"] = $resultado;
            $respuesta["mensaje"] = (empty($resultado)) ? "No han sido aprobadas las facturas de interés por mora" : "Numero de facturas de interes por mora gestionadas: ";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Método encargado de lanzar los hilos del proceso
     * @param type $idEmpresa
     * @param type $idCiclo
     * @param type $idActividad
     * @param type $idAcceso
     * @param type $idUsuario
     */
    private function iniciarProcesoInteresMoraCiclo($idEmpresa, $idCiclo, $idActividad, $idAcceso, $idUsuario) {
        try {

            for ($numeroProceso = 0; $numeroProceso < NUMERO_HILOS_INTERES_MORA; $numeroProceso++) {
                $rutaProyecto = RUTA_PRINCIPAL;
                $parametros = "$idEmpresa $numeroProceso $idCiclo $idActividad $idAcceso $idUsuario $rutaProyecto";
                $script = $this->container->get("kernel")->locateResource("@LlanogasLlanogasBundle") . "ProcesosMasivos/ProcesoInteresPorMora.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/interesmora_$numeroProceso.log & ";
                Util::ejecutarHilo($script);
            }
            sleep(10);
        } catch (\Exception $exc) {
            print_r($exc->getMessage());
        }
    }

    /**
     * Consulta el resumen de la ejecución del proceso
     * @return type
     */
    public function consultarResumenExitosoAction() {
        try {
            $resultado = array();
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $idEmpresa = $sesion->get("idempresa");
            $interesMoraModel = new InteresMoraModel($conexion);

            $interesMoraModel->consultarSinResultado($idEmpresa, NUMERO_HILOS_INTERES_MORA);
            $resultado["generadas"] = $interesMoraModel->consultarResumenSuccessIxm($idEmpresa);
            $resultado["nogeneradas"] = $interesMoraModel->consultarResumenNoSuccessIxm($idEmpresa);
            $respuesta["codigoRespuesta"] = (empty($resultado) ? 0 : 1);
            $respuesta["datos"] = $resultado;
            $respuesta["mensaje"] = (empty($resultado)) ? "No se encontró información de resumen" : "Información de resumen encontrada";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
