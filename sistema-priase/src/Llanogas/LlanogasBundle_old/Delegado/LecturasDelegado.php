<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\LecturasModel;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpFoundation\Request;
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
class LecturasDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\LecturasModel 
     */
    private $lecturasModel;

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var GenericoDelegado
     */
    private $genericoDelegado;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->lecturasModel = new LecturasModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);

        $this->sesion = $sesion;
    }

    public function consultarTerceros($nombre) {
        return $this->genericoDelegado->consultarTerceros(UNIDAD_CONSULTAR_TERCEROS_LECTURAS, $nombre);
    }

    /**
     * Procesa todos los registros enviados por la interfaz y controla las excepciones y
     * devuelve la transacción si es el caso
     * @param array $datos Listado de detalles de lecturas
     * @throws MyException Error al procesar algun detalle de lectura.
     */
    public function procesarLecturas(array $datos) {
        if (empty($datos)) {
            throw new MyException('Faltan parámetros para realizar la petición.');
        }
        try {
            $this->conexion->beginTransaction();
            $this->gestionarLectura($datos);
            $this->conexion->commit();
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException('Ocurrió un problema al grabar ' . $e->getMessage(), -1);
        }
    }

    /**
     * Procesa todos los registros de lecturas, que se envían (elimina, modifica o inserta).
     * @param array $datos
     */
    public function gestionarLectura(array $datos) {

        foreach ($datos as $lectura) {
            $lectura['idempresa'] = $this->sesion->get('idempresa');
            $lectura['idusuario'] = $this->sesion->get('idusuario');
            /**
             * Se valida que acción se va a ejecutar 
             * I=Insertar
             * E=Eliminar 
             * A=Acutalizar
             */
            switch ($lectura['accion']) {
                case 'A':
                    unset($lectura['fecha']);
                    $lectura['idanomalia'] = ($lectura['idanomalia'] == -1) ? null : $lectura['idanomalia'];
                    $lectura['idnovedad'] = ($lectura['idnovedad'] == -1) ? null : $lectura['idnovedad'];
                    $lectura['empresalectura'] = isset($lectura['empresalectura']) ? $lectura['empresalectura'] : null;

                    $this->lecturasModel->actualizarDetalleLectura($lectura);
                    break;
                case 'I':
                    $lectura['idanomalia'] = ($lectura['idanomalia'] == -1) ? null : $lectura['idanomalia'];
                    $lectura['idnovedad'] = ($lectura['idnovedad'] == -1) ? null : $lectura['idnovedad'];
                    $lectura['empresalectura'] = isset($lectura['empresalectura']) ? $lectura['empresalectura'] : null;
                    $lectura['fecha'] = 'now()';
                    $lectura['estado'] = isset($lectura['estado']) ? $lectura['estado'] : 'A';
                    unset($lectura['iddetallelectura']);
                    $this->lecturasModel->insertarDetalleLectura($lectura);
                    break;
                case 'E':
                    $registro['estado'] = 'C';
                    $registro['iddetallelectura'] = $lectura['iddetallelectura'];
                    $this->lecturasModel->actualizarDetalleLectura($registro);
                    break;
            }
        }
    }

    public function obtenerEncabezadoLectura($idSuscripcion) {
        return $this->lecturasModel->obtenerEncabezadoLectura($idSuscripcion);
    }

    public function detalleLectura($idLecturaEncabezado) {
        return $this->lecturasModel->detalleLectura($idLecturaEncabezado);
    }

    public function obtenerAnomalia() {
        return $this->lecturasModel->obtenerAnomalia();
    }

    public function obtenerNovedad() {
        return $this->lecturasModel->obtenerNovedad();
    }

    public function encabezadoHistorico($idsuscripcion, $fechainicial, $fechafinal) {
        return $this->lecturasModel->encabezadoHistorico($idsuscripcion, $fechainicial, $fechafinal);
    }

    public function detallePropiedad($idMedidor) {
        return $this->lecturasModel->detallePropiedad($idMedidor);
    }

    public function filtrarLecturas($idSuscripcion, $codigoAnterior, $documento) {
        $idEmpresa = $this->sesion->get('idempresa');
        $idusuario = $this->sesion->get('idusuario');
        return $this->lecturasModel->filtrarLecturas($idSuscripcion, $codigoAnterior, $documento, $idusuario, $idEmpresa);
    }

    /**
     * Método encargado de realizar el procesamiento 
     * del archivo plano que se está cargando 
     * @param Request $request
     * @return string
     */
    public function cargarLecturas(Request $request) {
        $this->conexion->beginTransaction();
        $listaArchivos = Util::subirArchivo($request, $this->sesion->get('idusuario'));
        $archivo = $listaArchivos[0];
        $esFacturar = $request->get('cmbTipoCargue') == 'F';
        $file = fopen($archivo, "r");
        $errorLinea = array();
        $i = 0;

        while ($linea = fgets($file)) {
            $i++;
            try {
                $registro = explode(';', $linea);
                $infoRegistro = $this->getInfoRegistroArchivo($registro);
                $this->procesarRegistroCargue($infoRegistro, $esFacturar);
            } catch (MyException $e) {
                $registro['linea'] = $i;
                $registro['mensaje'] = $e->getMessage();
                $errorLinea[] = $registro;
            }
        }
        $respuesta['numeroregistros'] = $i;
        if (!empty($errorLinea)) {
            $respuesta['codigoRespuesta'] = -1;
            $respuesta['mensaje'] = 'Error al procesar el archivo. ';
            $respuesta['errorlineas'] = $errorLinea;
            $this->conexion->rollBack();
            return $respuesta;
        }
        $respuesta['codigoRespuesta'] = 1;
        $respuesta['mensaje'] = 'Se procesó el archivo correctamente. ';
        $this->conexion->commit();

        return $respuesta;
    }

    /**
     * Inserta el encabezado y el detalle de una lectura 
     * con la información que se encuentra en el archivo plano 
     * @param array $infoRegistro
     * @param type $esFacturar
     */
    private function procesarRegistroCargue(array $infoRegistro, $esFacturar) {
        $encabezadoLectura = $this->lecturasModel->validadLectura($infoRegistro['idsuscripcion']);
        $infoRegistro['idencabezadoLectura'] = $encabezadoLectura['idencabezadolectura'];
        $infoRegistro['fecha'] = 'now()';


        $consumo = $this->getConsumo($infoRegistro['lecturaactual'], $infoRegistro['lecturaanterior'], $encabezadoLectura['digitos']);
        $infoRegistro['consumo'] = $consumo;
        $infoRegistro['idusuario'] = $this->sesion->get('idusuario');

        if ($esFacturar) {
            $this->lecturasModel->actualizarLectura($infoRegistro);
            $infoRegistro['fecha'] = 'now()';
            $idDetalleLectura = $this->lecturasModel->insertarDetalleLectura($infoRegistro);
            $lectura['idencabezadolectura'] = $encabezadoLectura['idencabezadolectura'];
            $lectura['iddetallelectura'] = $idDetalleLectura;
            $this->lecturasModel->actualizarLectura($lectura);
        } else {
            $this->lecturasModel->insertarDetalleLectura($infoRegistro);
        }
    }

    /**
     * Se ejecuta la fórmula para calcular el consumo
     * @param type $lecturaActual
     * @param type $lecturaAnterior
     * @param type $digitos
     * @return type
     */
    private function getConsumo($lecturaActual, $lecturaAnterior, $digitos) {
        $consumo = ((pow(10, $digitos) - 1) - $lecturaAnterior) + $lecturaActual;
        return ($lecturaAnterior < $lecturaActual) ? ($lecturaActual - $lecturaAnterior) : $consumo;
    }

    /**
     * Convierte la información del archivo plano a la estructura 
     * de la tabla de lecturas
     * @param type $registro
     * @return string
     * @throws \Exception
     * @throws MyException
     */
    private function getInfoRegistroArchivo($registro) {
        if (count($registro) != 11) {
            throw new \Exception('El archivo no tiene el formato correcto', -3);
        }
        try {
            $infoRegistro = array();
            $infoRegistro['idruta'] = $registro[0];
            $infoRegistro['consecutivo'] = $registro[1];
            $infoRegistro['idsuscripcion'] = $registro[2];
            $infoRegistro['nombre'] = $registro[3];
            $infoRegistro['direccion'] = $registro[4];
            $infoRegistro['barrio'] = $registro[5];
            $infoRegistro['numeromedidor'] = $registro[6];
            $infoRegistro['lecturaanterior'] = $registro[7];
            //lectura actual y lectura real es el mismo valor
            $infoRegistro['lecturaactual'] = $registro[8];
            $infoRegistro['lecturareal'] = $registro[8];
            $infoRegistro['idnovedad'] = $registro[9];
            $infoRegistro['idanomalia'] = $registro[10];
            $infoRegistro['observacion'] = $registro[11];
            $infoRegistro['ejecutado'] = 'S';
            return $infoRegistro;
        } catch (\Exception $e) {
            throw new MyException($e->getMessage(), -1);
        }
    }

    /**
     * Se consultan los ciclos activos de la empresa y para el programa 
     * @return array Lista de ciclos activos 
     */
    public function getCicloActivos() {
        return $this->genericoModel->getCiclosActivosPrograma($this->sesion->get('idempresa'), PROGRAMA_LECTURAS);
    }

}
