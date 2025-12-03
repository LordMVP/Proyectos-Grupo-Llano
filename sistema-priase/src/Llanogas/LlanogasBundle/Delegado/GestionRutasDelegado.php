<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class GestionRutasDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;
    private $GestionRutasModelo;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->GestionRutasModelo = new \Llanogas\LlanogasBundle\Models\GestionRutasModel($this->conexion);
        $this->sesion = $sesion;
    }

    public function buscaMunicipiosNuevo() {
        $idempresa = $this->sesion->get('idempresa');
        return $this->GestionRutasModelo->buscaMunicipiosNuevoModel($idempresa);
    }

    public function buscaCicloEmpresa() {
        $idempresa = $this->sesion->get('idempresa');
        return $this->GestionRutasModelo->buscaCiclo($idempresa);
    }

    public function getTipoRutaEmpresa() {
        $idempresa = $this->sesion->get('idempresa');
        return $this->GestionRutasModelo->getTipoRutas($idempresa);
    }

    public function getBuscarRutas($data) {
        $idempresa = $this->sesion->get('idempresa');
        return $this->GestionRutasModelo->buscarRutas($data, $idempresa);
    }

    public function buscaMunicipiosBarrios($idRuta) {
        $idEmpresa = $this->sesion->get('idempresa');
        $resultado = array();
        $resultado['municipiobarrio'] = $this->GestionRutasModelo->getMunicipioBarrio($idRuta, $idEmpresa);
        $resultado['anos'] = $this->GestionRutasModelo->getAnosPeriodos($idRuta);
        return $resultado;
    }

    public function buscaPeriodoVencimientos($parametros) {
        $idEmpresa = $this->sesion->get('idempresa');
        $idCiclo = $parametros['idciclo'];
        $resultado = array();
        $resultado['periodovencimiento'] = $this->GestionRutasModelo->getPeriodoVencimientos($parametros);
        $resultado['idRutasCiclo'] = $this->GestionRutasModelo->getRutasCiclo($idCiclo, $idEmpresa);
        return $resultado;
    }

    public function grabaRutas($parametros) {
        $this->conexion->beginTransaction();
        try {
            $resultado = array();
            $parametros['idusuario'] = $this->sesion->get('idusuario');
            $parametros['idempresa'] = $this->sesion->get('idempresa');
            $resultado['idRuta'] = $this->GestionRutasModelo->guardaRuta($parametros);
            if (!empty($resultado)) {
                $parametros['idRuta'] = $resultado['idRuta'];
                $this->GestionRutasModelo->guardaParametrizacionRuta($parametros);
                $resultado['anos'] = $this->GestionRutasModelo->getAnosPeriodos($parametros['idRuta']);
                $resultado['municipiobarrio'] = $this->GestionRutasModelo->getMunicipioBarrio($parametros['idRuta'], $parametros['idempresa']);
            }
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException($e->getMessage(), $e->getCode());
        }
    }

    public function onSetRutaPeriodo($parametros) {
        try {
            $this->conexion->beginTransaction();
            $resultado = array();
            $parametros['idusuario'] = $this->sesion->get('idusuario');
            $parametros['idempresa'] = $this->sesion->get('idempresa');
            if (array_key_exists('periodoreplicar', $parametros) && array_key_exists('rutasReplicar', $parametros)) {
                $parametros['arrayperiodoreplicar'] = explode(',', $parametros['periodoreplicar']);
                $parametros['arrayrutasReplicar'] = explode(',', $parametros['rutasReplicar']);
            }
            $resultado = $this->actulaizaRutaPeriodo($parametros);
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException($e->getMessage(), $e->getCode());
        }
    }

    public function actulaizaRutaPeriodo($parametros) {

        if (!empty($parametros['periodovencimiento'])) {
            foreach ($parametros['periodovencimiento'] as $periodoRutaFechas) {
                if (!empty($periodoRutaFechas['fecvencimiento']) && !empty($periodoRutaFechas['fecsuspension'])) {
                    $resultado = empty($periodoRutaFechas['idrupe']) ? $this->insertaRutasPeriodosFechas($periodoRutaFechas) : $this->armaDataSet($periodoRutaFechas);
                }
                if (!empty($parametros['periodoreplicar']) && !empty($parametros['rutasReplicar'])) {
                    if (in_array($periodoRutaFechas['idperiodo'], $parametros['arrayperiodoreplicar'], true)) {
                        $resultado = $this->consultaPeriodoRuta($periodoRutaFechas, $parametros);
                    }
                }
            }
        }
        return $resultado;
    }

    public function armaDataSet($data) {
        $parametros = array();
        if (!empty($data['fecvencimiento']) && !empty($data['fecsuspension'])) {
            $parametros['rupe_ideregistr'] = $data['idrupe'];
            $parametros['per_ideregistro'] = $data['idperiodo'];
            $parametros['rupe_fecvence'] = $data['fecvencimiento'];
            $parametros['rupe_fecsuspens'] = $data['fecsuspension'];
            $respuesta = $this->GestionRutasModelo->actualizaFechaRutaPeriodo($parametros, $data['idruta']);
            return $respuesta;
        }
    }

    public function consultaPeriodoRuta($periodoRutaFechas, $parametros) {
        foreach ($parametros['arrayrutasReplicar'] as $rutasReplicar) {
            $respuesta = $this->GestionRutasModelo->consultaPeriodoRuta($periodoRutaFechas['idperiodo'], $rutasReplicar);
            if ($respuesta['contador'] > 0) {
                $resultado = $this->armaDataSetTotal($periodoRutaFechas, $rutasReplicar);
            } else {
                $periodoRutaFechas['idruta'] = $rutasReplicar;
                $resultado = $this->insertaRutasPeriodosFechas($periodoRutaFechas);
            }
        }
        return $resultado;
    }

    public function armaDataSetTotal($data, $idRutas) {
        $parametros = array();
        if (!empty($data['fecvencimiento']) && !empty($data['fecsuspension'])) {
            $parametros['per_ideregistro'] = $data['idperiodo'];
            $parametros['rupe_fecvence'] = $data['fecvencimiento'];
            $parametros['rupe_fecsuspens'] = $data['fecsuspension'];
            $respuesta = $this->GestionRutasModelo->actualizaFechaRutaPeriodo($parametros, $idRutas);
            return $respuesta;
        }
    }

    public function insertaRutasPeriodosFechas($data) {
        if (!empty($data['fecvencimiento']) && !empty($data['fecsuspension'])) {
            $data['estado'] = 'A';
            return $this->GestionRutasModelo->guardaFechaRutaPeriodo($data);
        }
    }

}
