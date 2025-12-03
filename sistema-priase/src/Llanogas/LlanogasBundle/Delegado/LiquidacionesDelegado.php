<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Models\LiquidacionesModel;
use Llanogas\LlanogasBundle\Models\SuscripcionesModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of LiquidacionesDelegado
 *
 * @author mebonilla
 */
class LiquidacionesDelegado {

    /**
     * Conexión a la base de datos
     * @var Connection 
     */
    private $conexion;

    /**
     *
     * @var LiquidacionesModel 
     */
    private $liquidacionesModel;

    /**
     *
     * @var SuscripcionesModel 
     */
    private $suscripcionesModel;

    /**
     * Sesión del usuario
     * @var SessionInterface
     */
    private $sesion;

    /**
     * Constructor de la clase
     * @param Controller $control controlador sobre el que se hace la peticion
     * @param SessionInterface $sesion sesion del usuario en la aplicacion
     */
    public function __construct(Controller &$control, SessionInterface &$sesion) {
        $this->conexion = Util::getConexion($control);
        $this->liquidacionesModel = new LiquidacionesModel($this->conexion, $sesion);
        $this->suscripcionesModel = new SuscripcionesModel($this->conexion, $sesion);
        $this->sesion = $sesion;
    }

    /**
     * consulta las liquidaciones sin parametrizar en la base de datos retornando el id y el nombre
     * de la liquidacion sin parametrizar dentro de una coleccion
     * @param string $liquidacion texto de la liquidacion a encontrar
     * @return array arreglo de posibles coincidencias de nombres de liquidaciones 
     * @throws MyException
     */
    public function getLiquidacionesSinParametrizar($liquidacion) {
        $liquidaciones = $this->liquidacionesModel->autocompleteLiquidacion($liquidacion);
        if (empty($liquidaciones)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $liquidaciones;
    }

    /**
     * retorna a partir de un json dentro del script, las clasificaciones por nombre e id de
     * las clasificaciones en las que puede distribuirse una liquidacion
     * @return array los tipos de documentos disponibles para la empresa con un respectivo codigo
     */
    public function cargarComboClasificacion() {
        return json_decode("[{\"idclasificacion\":\"AU\",\"clasificacion\":\"Amorizaciones Urbanizadora\"},{\"idclasificacion\":\"CO\",\"clasificacion\":\"Convenio\"},{\"idclasificacion\":\"CA\",\"clasificacion\":\"Campaña\"},{\"idclasificacion\":\"FI\",\"clasificacion\":\"Financiacion\"},{\"idclasificacion\":\"IM\",\"clasificacion\":\"Interes x Mora\"},{\"idclasificacion\":\"LI\",\"clasificacion\":\"Liquidaciones Servicio Suscripcion\"},{\"idclasificacion\":\"VE\",\"clasificacion\":\"Venta\"},{\"idclasificacion\":\"PV\",\"clasificacion\":\"PostVenta\"},{\"idclasificacion\":\"CM\",\"clasificacion\":\"Compra Cartera\"},{\"idclasificacion\":\"IF\",\"clasificacion\":\"Infraestructura\"},{\"idclasificacion\":\"FU\",\"clasificacion\":\"Factura Urbanizadora\"},{\"idclasificacion\":\"TR\",\"clasificacion\":\"Tarifas de Aseo\"}]", true);          
    }

    /**
     * 
     * @param string $clasificacion
     * @return array retorna los nombres y los id de los documentos segun la clasificion seleccionada
     * @throws MyException generada para cuando no se encuentran registros
     */
    public function getDocumentos($clasificacion) {
        $documentos = $this->liquidacionesModel->consultarDocumentos($clasificacion);
        if (empty($documentos)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $documentos;
    }

    /**
     * consulta los conceptos por una liquidacion seleccionada, basados en un el valor
     * de un campo de texto escrito por el usuario, retornando las posibles coincidencias
     * encontradas con ese valor
     * @param string $concepto valor del campo de texto que contiene el nombre del concepto
     * @param string $idLiquidacion id de la liquidacion seleccionada de manera previa
     * @return array coleccion de conceptos que coinciden con los parametros de busqueda
     * @throws MyException
     */
    public function getConceptosPorLiquidacion($concepto, $idLiquidacion) {
        $conceptos = $this->liquidacionesModel->autocompleteConcepto($concepto, $idLiquidacion);
        if (empty($conceptos)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $conceptos;
    }

    /**
     * consulta los tipos de documento dependiendo del documento seleccionado en la interfaz
     * grafica 
     * @param type $documento
     * @return type
     * @throws MyException
     */
    public function getTipoDocumento($documento) {
        $tipoDocumentos = $this->liquidacionesModel->consultarTipoDocumento($documento);
        if (empty($tipoDocumentos)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $tipoDocumentos;
    }

    /**
     * consulta los municipios con base a el valor de un campo de texto escrito por el usuario
     * @param string $municipio municipio digitado por el usuario
     * @return array lista de municipios cuyos nombres coinciden con el valor escrito por el usuario
     * @throws MyException
     */
    public function getMunicipio($municipio) {
        $municipios = $this->liquidacionesModel->autocompleteMunicipio($municipio);
        if (empty($municipios)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $municipios;
    }

    /**
     * consulta los tipos de uso existentes en la base de datos para el usuario y codigo de empresa
     * @return array
     * @throws MyException
     */
    public function getTiposDeUsos() {
        $tiposUsos = $this->liquidacionesModel->consultarUsos();
        if (empty($tiposUsos)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $tiposUsos;
    }

    /**
     * consulta las suscripciones teniendo en cuenta parametros digitados por el usuario mas los municipios
     * seleccionados 
     * @param type $parametros parametros para la consulta
     * @return array 
     * @throws MyException
     */
    public function getSuscripciones($parametros) {
        $suscripciones = $this->liquidacionesModel->getSuscripcion($parametros);
        if (empty($suscripciones)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $suscripciones;
    }

    /**
     * consulta los barrios que coinciden con los municipios seleccionados por el usuario
     * @param array $municipios municipios seleccionados por el usuario
     * @param string $barrio valor de texto digitado por el usuario
     * @return array consulta de los barrios por municipios
     * @throws Exception
     */
    public function getBarrios($municipios, $barrio) {
        $barrios = $this->liquidacionesModel->autocompleteBarrios($municipios, $barrio);
        if (empty($barrios)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $barrios;
    }

    /**
     * Inserta la informacion de una liquidacion y su distribucion entre
     * conceptos, municipios de la liquidacion, tipos de uso de la liquidacion,
     * y si es una liquidacion especial
     * @param array $infoLiquidacion
     * @param int $usuario
     * @return int 
     * @throws MyException
     */
    public function insertarLiquidacion($infoLiquidacion, $usuario) {
        try {
            $this->conexion->beginTransaction();
            $idLiquidacion = $this->accionLiquidacion($infoLiquidacion, $usuario);
            if (isset($infoLiquidacion["conceptos"]) && !empty($infoLiquidacion["conceptos"])) {
                foreach ($infoLiquidacion["conceptos"] as $concepto) {
                    $this->accionConceptosLiquidacion($concepto, $infoLiquidacion["idliquidacion"], $usuario);
                }
            }
            if (isset($infoLiquidacion["municipios"]) && !empty($infoLiquidacion["municipios"])) {
                foreach ($infoLiquidacion["municipios"] as $municipio) {
                    $this->accionMunicipiiosLiquidacion($municipio, $infoLiquidacion["idliquidacion"], $usuario);
                }
            }
            if (isset($infoLiquidacion["tiposusos"]) && !empty($infoLiquidacion["tiposusos"])) {
                foreach ($infoLiquidacion["tiposusos"] as $tipoUso) {
                    $this->accionTiposUsosLiquidacion($tipoUso, $infoLiquidacion["idliquidacion"], $usuario);
                }
            }
            if (isset($infoLiquidacion["liquidacionespecial"]) && !empty($infoLiquidacion["liquidacionespecial"])) {
                foreach ($infoLiquidacion["liquidacionespecial"] as $liquidacionEspecial) {
                    $this->accionLiquidacionEspecial($liquidacionEspecial, $usuario, $infoLiquidacion["idliquidacion"]);
                }
            }
            $this->conexion->commit();
            return $idLiquidacion;
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException($e->getMessage(), -1);
        }
    }

    /**
     * inserta o modifica la informacion de una liquidacion
     * @param array $infoLiquidacion informacion de la liquidacion
     * @param int $usuario id del usuario actual
     * @return type
     */
    private function accionLiquidacion($infoLiquidacion, $usuario) {
        if ($infoLiquidacion["accion"] == "I") {
            return $this->liquidacionesModel->insertarLiquidacion($infoLiquidacion, $usuario);
        }
        if ($infoLiquidacion["accion"] == "A") {
            $this->liquidacionesModel->actualizarLiquidacion($infoLiquidacion);
            return $infoLiquidacion["idliquidacion"];
        }
    }

    /**
     * inserta o modifica la informacion de los conceptos de una liquidacion
     * @param type $concepto informacion del concepto
     * @param type $idLiquidacion id de la liquidacion
     * @param type $usuario id del usuario actual
     */
    private function accionConceptosLiquidacion($concepto, $idLiquidacion, $usuario) {
        if (!empty($concepto["accion"])) {
            if ($concepto["accion"] == "I") {
                $this->liquidacionesModel->insertarConceptosLiquidacion($concepto, $idLiquidacion, $usuario);
            }
            if ($concepto["accion"] == "A") {
                $this->liquidacionesModel->actualizarConceptosLiquidacion($concepto);
            }
            if ($concepto["accion"] == "E") {
                $this->liquidacionesModel->eliminarConceptos($concepto["idregistroconcepto"]);
            }
        }
    }

    /**
     * inserta o modifica la informacion de los municipios de una liquidacion
     * @param type $municipio informacion del municipio
     * @param type $idLiquidacion id de la liquidacion
     * @param type $usuario id del usuario actual
     */
    private function accionMunicipiiosLiquidacion($municipio, $idLiquidacion, $usuario) {
        if (!empty($municipio["accion"])) {
            if ($municipio["accion"] == "I") {
                $this->liquidacionesModel->insertarMunicipiosLiquidacion($municipio, $usuario, $idLiquidacion);
            }
            if ($municipio["accion"] == "A") {
                $this->liquidacionesModel->actualizarMunicipiosLiquidacion($municipio);
            }
            if ($municipio["accion"] == "E") {
                $this->liquidacionesModel->eliminarMunicipios($municipio["idregistromunicipio"]);
            }
        }
    }

    /**
     * inserta o modifica la informacion de los tipos de uso de una liquidacion
     * @param type $tipoUso informacion del tipo de uso
     * @param type $idLiquidacion id de la liquidacion
     * @param type $usuario id del usuario actual
     */
    private function accionTiposUsosLiquidacion($tipoUso, $idLiquidacion, $usuario) {
        if (!empty($tipoUso["accion"])) {
            if ($tipoUso["accion"] == "I") {
                $this->liquidacionesModel->insertarTiposUsosLiquidacion($tipoUso, $usuario, $idLiquidacion);
            }
            if ($tipoUso["accion"] == "A") {
                $this->liquidacionesModel->actualizarTiposUsosLiquidacion($tipoUso);
            }
            if ($tipoUso["accion"] == "E") {
                $this->liquidacionesModel->eliminarTiposUsos($tipoUso["idregistrotipouso"]);
            }
        }
    }

    /**
     * inserta o modifica la informacion de la liquidacion especial de una liquidacion
     * @param type $liquidacionEspecial informacion de la liquidacion especial
     * @param type $usuario id del usuario actual
     * @param type $idLiquidacion id de la liquidacion
     */
    private function accionLiquidacionEspecial($liquidacionEspecial, $usuario, $idLiquidacion) {
        if (!empty($liquidacionEspecial["accion"])) {
            if ($liquidacionEspecial["accion"] == "I") {
                $this->liquidacionesModel->insertarLiquidacionEspecial($liquidacionEspecial, $usuario, $idLiquidacion);
            }
            if ($liquidacionEspecial["accion"] == "A") {
                $this->liquidacionesModel->actualizarLiquidacionEspecial($liquidacionEspecial);
            }
            if ($liquidacionEspecial["accion"] == "E") {
                $this->liquidacionesModel->eliminarLiquidacionEspecial($liquidacionEspecial["idregistroliquidacionespecial"]);
            }
        }
    }

    /**
     * obtiene la informacion completa de una liquidacion segun su id
     * @param int $idLiquidacion id de la liquidacion a consultar
     * @return array informacion de la liquidacion consultada
     * @throws MyException
     */
    public function consultarLiquidacion($idLiquidacion) {
        $parametros = array();
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $parametros['idusuario'] = $this->sesion->get('idusuario');
        $parametros['idprograma'] = PROGRAMA_GESTIONAR_LIQUIDACION;
        $liquidacion = $this->liquidacionesModel->consultarLiquidacion($idLiquidacion, $parametros);
        if (empty($liquidacion)) {
            throw new MyException("No se encontraron registros", 0);
        }
        $conceptosLiq = $this->liquidacionesModel->consultarConceptosLiquidacion($idLiquidacion);
        if (!empty($conceptosLiq)) {
            $liquidacion["conceptos"] = $conceptosLiq;
        }
        $municipiosLiq = $this->liquidacionesModel->consultarMunicipiosLiquidacion($idLiquidacion, $parametros);
        if (!empty($municipiosLiq)) {
            $liquidacion["municipios"] = $municipiosLiq;
        }
        $tiposusoLiq = $this->liquidacionesModel->consultarTiposUsosLiquidacion($idLiquidacion);
        if (!empty($tiposusoLiq)) {
            $liquidacion["tiposusos"] = $tiposusoLiq;
        }
        $especialesLiq = $this->liquidacionesModel->consultarLiquidacionesEspeciales($idLiquidacion, $parametros);
        if (!empty($especialesLiq)) {
            $liquidacion["liquidacionespecial"] = $especialesLiq;
        }
        return $liquidacion;
    }

    /**
     * metodo que consulta si un id de concepto esta vinculado a una liquidacion
     * para ser eliminado siempre y cuando dicho concepto no este vinculado a una
     * suscripcion
     * @param int $idLiquidacion
     * @param int $idConcepto
     * @return array informacion de el concepto a eliminar y si se puede o no
     * eliminar 
     * @throws MyException
     */
    public function consultarConceptosEliminar($idLiquidacion, $idConcepto) {
        $idDsusA = $this->liquidacionesModel->consultarConceptosCosu($idLiquidacion, $idConcepto);
        if (empty($idDsusA)) {
            $idDsusB = $this->liquidacionesModel->consultarConceptosDsus($idLiquidacion, $idConcepto);
            if (empty($idDsusB)) {
                throw new MyException("No se encontraron registros", 0);
            }
            $idDsusB["tipo"] = "opcional";
            return $idDsusB;
        }
        $idDsusA["tipo"] = "no eliminar";
        return $idDsusA;
    }

    /**
     * consulta si el municipio pertenece a una liquidacion para poder eliminarlo
     * @param int $idLiquidacion id de la liquidacion
     * @param int $idMunicipio id del municipio
     * @return array informacion del municipio
     * @throws MyException
     */
    public function consultarMunicipiosEliminar($idLiquidacion, $idMunicipio) {
        $idDsus = $this->liquidacionesModel->consultarMunicipiosDsus($idLiquidacion, $idMunicipio);
        if (empty($idDsus)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $idDsus;
    }

    /**
     * Consulta a informacion de un tipo de uso para poder ser eliminado
     * @param type $idLiquidacion id de la liquidacion
     * @param type $idTipoUso id del tipo de uso
     * @return array informacion de el tipo de uso
     * @throws MyException
     */
    public function consultarTipoUsosEliminar($idLiquidacion, $idTipoUso) {
        $idDsus = $this->liquidacionesModel->consultarTipoUsosDsus($idLiquidacion, $idTipoUso);
        if (empty($idDsus)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $idDsus;
    }

    /**
     * Consulta la informacion de una liquidacion que ya fue parametrizada
     * @param int $liquidacion id de la liquidacion 
     * @return array informacion de la liquidacion
     * @throws MyException
     */
    public function consultarLiquidacionesParemetrizadas($liquidacion) {
        $liquidaciones = $this->liquidacionesModel->liquidacionParametrizadaAutocomplete($liquidacion);
        if (empty($liquidaciones)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $liquidaciones;
    }

    /**
     * Consulta los municipios que tiene un usuario asignados al programa de 
     * liquidaciones
     * @return array conjunto de municipios
     * @throws MyException
     */
    public function consultarMunicipiosUsuario() {
        $municipios = $this->liquidacionesModel->municipioPerUsuario();
        if (empty($municipios)) {
            throw new MyException("No se encontraron registros", 0);
        }
        return $municipios;
    }

}
