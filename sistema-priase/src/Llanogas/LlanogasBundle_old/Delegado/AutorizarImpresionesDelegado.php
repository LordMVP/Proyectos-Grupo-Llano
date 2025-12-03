<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Models\AutorizarImpresionesModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Clase encargada de llevar el control de las 
 * impresiones de los timbres del recaudo
 * @author mebonilla
 */
class AutorizarImpresionesDelegado {

    /**
     * Conexión a la base de datos
     * @var Connection 
     */
    private $conexion;

    /**
     *
     * @var AutorizarImpresionesModel
     */
    private $autorizarImpresionesModel;

    /**
     *
     * @var GenericoModel
     */
    private $genericoModel;

    /**
     *
     * @var SessionInterface
     */
    private $sesion;

    public function __construct(Controller &$control, SessionInterface &$sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->autorizarImpresionesModel = new AutorizarImpresionesModel($this->conexion, $sesion);
        $this->sesion = $sesion;
    }

    /**
     * Consulta la informacion de usuarios segun un parametro de texto
     * @param string $parametro parametro de texto para busqueda de usuarios
     * @return array informacion de usuarios que coincide con los parametros de
     * busqueda
     * @throws MyException Lanzada en caso de no encontrar informacion de usuarios
     */
    public function obtenerInfoUsuarios($parametro) {
        $usuarios = $this->autorizarImpresionesModel->consultarUsuario($parametro);
        if (empty($usuarios)) {
            throw new MyException("No se encontro informacion de usuarios", 0);
        }
        return $usuarios;
    }

    /**
     * Consulta el valor limite de impresiones posibles para un recaudo por 
     * parte de un usuario
     * @param int $idRecaudo id del recaudo a imprimir
     * @return array informacion de las impresiones del recaudo
     */
    public function obtenerLimiteImpresionRecaudo($idRecaudo) {
        $impresiones = $this->autorizarImpresionesModel->consultarLimiteImpresionRecaudo($idRecaudo);
        if (empty($impresiones)) {
            throw new MyException('El recaudo no tiene valor de límite de impresiones permitida', 0);
        }
        return $impresiones;
    }

    /**
     * 
     * @param int $idRecaudo id del recaudo al que se le genera registro de
     * impresion
     * @param int $idAutorizado id del usuario que crea el recaudo y se autoriza
     * para las impresiones permitidas
     * @param int $impRealizada al crearse el recaudo se aplica el primer
     * registro de impresion realizada pues al crearse se lanza la primera
     * ventana de impresion del recaudo
     * @return int id del registro de impresion del recaudo para el usuario
     * @throws MyException en caso de no encontrar valor de limite de impresiones
     * en la tabla doc_documento
     */
    public function insertarImpresionesRecaudoUsuarioAutomatico($idRecaudo, $idAutorizado, $impRealizada = null) {
        $this->conexion->beginTransaction();
        try {
            $limiteImpresion = $this->autorizarImpresionesModel->consultarLimiteImpresionRecaudo($idRecaudo);
            if (empty($limiteImpresion) && $limiteImpresion['impresiones'] > 0) {
                throw new MyException('El recaudo no tiene valor de limite de impresiones permitida', 0);
            }
            $resultado = $this->autorizarImpresionesModel->registrarImpresionesRecaudoUsuario($limiteImpresion['impresiones'], $idRecaudo, $idAutorizado, $impRealizada);
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
    }

    /**
     * 
     * @param type $idRecaudo identificador del recaudo que se quiere realizar la impresión
     * @param type $idAutorizado id del usuario que se le concedió el permiso para poder imprimir el recaudo
     * @param type $impAutorizadas cantidad de impresiones permitidas por el usuario 
     * @return type
     * @throws MyException
     */
    public function insertarImpresionesRecaudoUsuario($idRecaudo, $idAutorizado, $impAutorizadas) {
        $this->conexion->beginTransaction();
        try {
            $impresiones = $this->autorizarImpresionesModel->consultarImpresionesActivasRecaudoUsuario($idRecaudo, $idAutorizado);
            if (count($impresiones) > 0) {
                throw new MyException('El recaudo tiene impresiones autorizadas sin usar, el usuario debe consumirlas para generar un nuevo registro de impresion', 0);
            }
            $limiteImpresion = $this->autorizarImpresionesModel->consultarLimiteImpresionRecaudo($idRecaudo);
            if (empty($limiteImpresion)) {
                throw new MyException('El recaudo no tiene valor de limite de impresiones permitida', 0);
            }
            if ($limiteImpresion['impresiones'] < $impAutorizadas) {
                throw new MyException('El numero de impresiones que intenta registrar es superior al permitido', -1);
            }
            if ($impAutorizadas < 1) {
                $impAutorizadas = $limiteImpresion['impresiones'];
            }
            $resultado = $this->autorizarImpresionesModel->registrarImpresionesRecaudoUsuario($impAutorizadas, $idRecaudo, $idAutorizado);
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
    }

    /**
     * Consulta la informacion de impresiones disponibles que tiene un usuario
     * autorizado para un recaudo especifico
     * @param int $idRecaudo id del recaudo a consultar impresiones disponibles
     * @param int $idUsuario id del usuario con las impresiones autorizadas a
     * el recaudo consultado
     * @return array informacion de las impresiones disponibles del recaudo para
     * un usuario autorizado
     */
    public function obtenerImpresionRecaudoUsuario($idRecaudo, $idUsuario) {
        $impresiones = $this->autorizarImpresionesModel->consultarImpresionesRecaudoUsuario($idRecaudo, $idUsuario);
        if (empty($impresiones)) {
            throw new MyException('El usuario no tiene impresiones activas para la fecha actual', -3);
        }
        return $impresiones;
    }

    /**
     * Realiza la actualizacion del registro de impresion autorizado a un usuario
     * cada vez que se imprime el timbre de un registro
     * @param int $idImpresion
     * @return int
     * @throws MyException
     */
    public function actualizarImpresionRecaudoUsuario($idImpresion) {
        $this->conexion->beginTransaction();
        try {
            $impresion = $this->autorizarImpresionesModel->consultarImpresionRecaudoId($idImpresion);
            if ($impresion['impresionesreal'] > 0) {
                $impresion['impresionesreal'] ++;
            } else {
                $impresion['impresionesreal'] = 1;
            }
            if ($impresion['impresionesreal'] >= ($impresion['impresionesauth'])) {
                $impresion['estadoimpresion'] = 'C';
            }
            $resultado['confirmacion'] = $this->autorizarImpresionesModel->actualizarImpresionRecaudoUsuario($idImpresion, $impresion['estadoimpresion'], $impresion['impresionesreal']);
            $resultado['impresionrecaudo'] = $this->autorizarImpresionesModel->consultarImpresionRecaudoId($idImpresion);
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
    }

}
