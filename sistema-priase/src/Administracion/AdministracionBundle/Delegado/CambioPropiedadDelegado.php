<?php

namespace Administracion\AdministracionBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Administracion\AdministracionBundle\Models\TercerosModel;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de los recaudos.
 * @author hrey
 */
class CambioPropiedadDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var \Administracion\AdministracionBundle\Models\TercerosModel
     */
    private $tercerosModel;

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;

    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->sesion = $sesion;
        $this->conexion = Util::getConexion($control);
        $this->tercerosModel = new TercerosModel($this->conexion, $this->sesion);
    }

    public function consultarTercero($nombre) {
        if (empty($nombre)) {
            throw new MyException('No se ha recibido nombre a filtrar en terceros', 0);
        }
        $resultadoQuery = $this->tercerosModel->consultarTercero($nombre);
        return($resultadoQuery);
    }

    public function consultarTerceroPropiedad(array $parametros) {
        if (empty($parametros)) {
            throw new MyException('No se ha recibido ningún parametro de busqueda en terceros ', 0);
        }
        try {
            $parametros['usuario'] = $this->sesion->get('idusuario');
            $parametros['empresa'] = $this->sesion->get('idempresa');
            $resultadoQuery = $this->tercerosModel->consultarTerceroPropiedad($parametros);
            $complemento = '';
            if (!empty($parametros['excluirtercero']))
                $complemento = ", ó el Tercero destino es el mismo de Origen";
            if (empty($resultadoQuery))
                throw new MyException("No se hallaron registros de terceros con propiedades que cumplan con el filtro ingresado " . $complemento, 0);
            return($resultadoQuery);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function consultarPropiedad(array $parametros) {
        if (empty($parametros['tercero'])) {
            throw new MyException('No se ha seleccionado el tercero', 0);
        }
        if (empty($parametros['suscriptor'])) {
            throw new MyException('No hay Suscripciones disponibles para Trasladar', 0);
        }
        try {
            $parametros['usuario'] = $this->sesion->get('idusuario');
            $parametros['empresa'] = $this->sesion->get('idempresa');
            $resultadoQuery = $this->tercerosModel->consultarPropiedad($parametros);
            if (empty($resultadoQuery))
                throw new MyException("No se hallaron registros de propiedades asociadas al tercero", 0);
            return($resultadoQuery);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function grabarPropiedad(array $parametros) {
        if (empty($parametros)) {
            throw new MyException('No se ha recibido información para cambio de propiedad', 0);
        }
        try {
            $this->conexion->beginTransaction() ;
            $parametros['usuario'] = $this->sesion->get('idusuario');
            $parametros['empresa'] = $this->sesion->get('idempresa');
            $suscriptordestino = $this->validarSuscriptorDestino($parametros);
            $resultadoQuery = $this->ActualizarPropiedadSuscripcion($parametros, $suscriptordestino);
            $this->conexion->commit();
//            $this->conexion->rollBack();
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function validarSuscriptorDestino($parametros) {
        $Datos['tercero'] = $parametros['tercero'];
        $Datos['idconvenio'] = $parametros['terceroorigen']['convenio'];
        $suscriptordestino = $this->tercerosModel->ValidarSuscriptorDestino($Datos);
        if (empty($suscriptordestino))
            $suscriptordestino = $this->crearSuscriptorNuevo($parametros);
        return $suscriptordestino;
    }

    public function crearSuscriptorNuevo($parametros) {
        $suscriptordestino = $this->tercerosModel->crearSuscriptorNuevo($parametros);
        if (empty($suscriptordestino))
            throw new MyException("Error Creando nuevo suscriptor", -1);
        return $suscriptordestino;
    }

    public function ActualizarPropiedadSuscripcion(array $parametros, $suscriptor) {
        try { 
            foreach ($parametros['propiedades'] as $propiedad) {
                 $propiedad['tercero']= $parametros['tercero'];
                 
                 $this->tercerosModel->ActualizarSuscripcion($propiedad, $suscriptor) ;
                 $this->tercerosModel->ActualizaFacturaSuscripcion($propiedad, $suscriptor) ;
                 $this->tercerosModel->ActualizarPropiedad($propiedad);
            }
        } catch (\Exception $ex) {
            throw new MyException("Error actualizando Propiedades y suscripciones".$ex->getMessage(), -1);
        }
    }
    public function ActualizarPropiedadSuscripcionSinFactura(array $parametros, $suscriptor) {
        try { 
            foreach ($parametros['propiedades'] as $propiedad) {
                 $propiedad['tercero']= $parametros['tercero'];
                 
                 $this->tercerosModel->ActualizarSuscripcion($propiedad, $suscriptor) ;
                 $this->tercerosModel->ActualizarPropiedad($propiedad);
            }
        } catch (\Exception $ex) {
            throw new MyException("Error actualizando Propiedades y suscripciones".$ex->getMessage(), -1);
        }
    }
    
    public function grabarPropiedadSoloCambioTecero(array $parametros) {
        if (empty($parametros)) {  
            throw new MyException('No se ha recibido información para cambio de propiedad', 0);
        }
        try {
            $this->conexion->beginTransaction();
            $parametros['usuario'] = $this->sesion->get('idusuario');
            $parametros['empresa'] = $this->sesion->get('idempresa');
            foreach ($parametros['propiedades'] as  $propiedad) {
                $data = array();
                $propiedadesClienteOrigen = array();
                $data['tercero'] = $parametros['tercero'];
                $data['terceroorigen'] = $parametros['terceroorigen'];
                $data['usuario'] = $parametros['usuario'];

                $propiedad['tercero'] = $parametros['tercero'];
                $propiedadesClienteOrigen['propiedades'][0] = $propiedad;
                $propiedadesClienteOrigen['tercero'] = $parametros['tercero'];

                $resultado = $this->tercerosModel->buscaClienteConstructora($propiedad['suscripcion']);
                if (!empty($resultado)) {
                    // crear el suscriptor 
                    $resultadoIdSuscriptor = $this->crearSuscriptorNuevo($data);
                    // actualizar la suscripcion y Propiedad
                    $resultadoQuery = $this->ActualizarPropiedadSuscripcion($propiedadesClienteOrigen, $resultadoIdSuscriptor);
                } else {
                    $suscriptordestino = $parametros['terceroorigen']['suscriptor'];
//            $suscriptordestino = $this->validarSuscriptorDestino($parametros);
                    $resultadoQuery = $this->ActualizarPropiedadSuscripcionSinFactura($propiedadesClienteOrigen, $suscriptordestino);
                    $this->tercerosModel->actualizarTerceroSuscriptor($parametros['tercero'], $suscriptordestino);
                }
            }
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }
   

}
 