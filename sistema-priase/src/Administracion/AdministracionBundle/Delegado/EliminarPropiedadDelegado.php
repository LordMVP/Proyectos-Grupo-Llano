<?php

namespace Administracion\AdministracionBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Administracion\AdministracionBundle\Models\EliminarPropiedadModel;
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
class eliminarpropiedadDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var \Administracion\AdministracionBundle\Models\EliminarPropiedadModel
     */
    private $eliminarpropiedad;

    /**
     *
     * @var \Administracion\AdministracionBundle\Models\TercerosModel
     */
    private $terceros;

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;

    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->sesion = $sesion;
        $this->conexion = Util::getConexion($control);
        $this->eliminarpropiedad = new EliminarPropiedadModel($this->conexion, $this->sesion);
    }

    public function consultarTercero($nombre) {
        if (empty($nombre)) {
            throw new MyException('No se ha recibido nombre a filtrar en terceros', 0);
        }
        $resultadoQuery = $this->eliminarpropiedad->consultarTercero($nombre);
        return($resultadoQuery);
    }

    public function consultarTerceroPropiedad(array $parametros) {
        if (empty($parametros)) {
            throw new MyException('No se ha recibido ningún parametro de busqueda en terceros ', 0);
        }
        try {
            $resultadoQuery = $this->eliminarpropiedad->consultarTerceroPropiedad($parametros);
            $complemento = '';
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
        try {
            $parametros['usuario'] = $this->sesion->get('idusuario');
            $parametros['empresa'] = $this->sesion->get('idempresa');
            $resultadoQuery = $this->eliminarpropiedad->consultarPropiedad($parametros);
            if (empty($resultadoQuery))
                throw new MyException("No se hallaron registros de propiedades asociadas al tercero", 0);
            return($resultadoQuery);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function grabareeliminacionPropiedad(array $parametros) {
        if (empty($parametros)) {
            throw new MyException('No se ha recibido información para cambio de propiedad', 0);
        }
        try {
            $this->conexion->beginTransaction() ;
            $parametros['usuario'] = $this->sesion->get('idusuario');
            $parametros['empresa'] = $this->sesion->get('idempresa');
            $resultadoQuery = $this->ActualizarPropiedadSuscripcion($parametros);
            $this->conexion->commit();
//            $this->conexion->rollBack();
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }
 public function ActualizarPropiedadSuscripcion(array $parametros) {
        try { 
            foreach ($parametros['propiedades'] as $propiedad) {
                 $propiedad['tercero']= $parametros['tercero'];
                 $this->eliminarpropiedad->eliminarpropiedad($propiedad);
            }
        } catch (\Exception $ex) {
            throw new MyException("Error actualizando Propiedades y suscripciones".$ex->getMessage(), -1);
        }
    }

}
