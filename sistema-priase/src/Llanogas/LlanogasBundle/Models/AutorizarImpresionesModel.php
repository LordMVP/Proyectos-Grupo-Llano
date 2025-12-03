<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Description of AutorizarImpresionesController
 *
 * @author Lord_Nightmare
 */
class AutorizarImpresionesModel extends AuditoriaServices {

    /**
     *
     * @var SessionInterface 
     */
    private $sesion;

    /**
     * Constructor de la clase
     * @param Connection $conexion
     */
    public function __construct(&$conexion, &$sesion = null) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
    }

    /**
     * Consulta la informacion basica de un usuario del sistema;
     * @param string $parametro dato de consulta para buscar al usuario
     * @return array informacion de usuarios para autocompleete
     */
    public function consultarUsuario($parametro) {
        $parametros['parametro'] = '%' . strtoupper($parametro) . '%';
        $parametros['empresa'] = $this->sesion->get('idempresa');
        $sql = 'select distinct
                    usu.usuario_nit documento,
                    usu.usuario_nom nombreusuario,
                    usu.usu_ideregistro idusuario
                from
                    usuarios usu
                inner join usem_usuempresa usem on usu.usu_ideregistro = usem.usu_ideregistro
                where
                    upper(usu.usuario_nit) like :parametro
                or upper(usu.usuario_nom) like :parametro
                and emp_ideregistro = :empresa;';
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta el valor limite de impresiones posibles para un recaudo por 
     * parte de un usuario
     * @param int $idRecaudo id del recaudo a imprimir
     * @return array informacion de las impresiones del recaudo
     */
    public function consultarLimiteImpresionRecaudo($idRecaudo) {
        $parametros['idrecaudo'] = $idRecaudo;
        $sql = 'select
                    rec.rec_ideregistro idrecaudo,
                    doc.doc_maximpresion impresiones
                from
                    rec_recaudo rec
                inner join doc_documento doc on rec.uni_documento = doc.uni_documento
                where
                    rec.rec_ideregistro = :idrecaudo';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
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
    public function consultarImpresionesRecaudoUsuario($idRecaudo, $idUsuario) {
        $parametros['idrecaudo'] = $idRecaudo;
        $parametros['idusuario'] = $idUsuario;
        $sql = "select
                    imre.imre_ideregistr idimpresion,
                    imre.imre_estado estadoimpresion,
                    imre.imre_fecha fechaimpresion,
                    imre.imre_impautorizada impresionesauth,
                    imre.imre_imprealizada impresionesreal
                from
                    imre_imprecaudo imre
                where
                    imre.rec_ideregistro = :idrecaudo
                and imre.usu_ideautorizado = :idusuario
                and imre.imre_imprealizada <= imre.imre_impautorizada
                and imre_fecha::date = now()::date
                order by imre.imre_fecha desc limit 1;";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }
    
    /**
     * Consulta las impresiones activas de un recaudo para un usuario
     * @param int $idRecaudo id del recaudo
     * @param int $idUsuario id del usuario
     * @return array informacion de la impresion
     */
    public function consultarImpresionesActivasRecaudoUsuario($idRecaudo, $idUsuario) {
        $parametros['idrecaudo'] = $idRecaudo;
        $parametros['idusuario'] = $idUsuario;
        $sql = "select
                    imre.imre_ideregistr idimpresion,
                    imre.imre_estado estadoimpresion,
                    imre.imre_fecha fechaimpresion,
                    imre.imre_impautorizada impresionesauth,
                    imre.imre_imprealizada impresionesreal
                from
                    imre_imprecaudo imre
                where
                    imre.rec_ideregistro = :idrecaudo
                and imre.usu_ideautorizado = :idusuario
                and imre.imre_imprealizada <= imre.imre_impautorizada
                and imre.imre_estado = 'A'
                and imre_fecha::date = now()::date
                order by imre.imre_fecha desc limit 1;";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Crea un nuevo registro de autorizacion de impresiones para un usuario
     * sobre un recaudo en especifico.
     * @param int $impAutorizada Numero de impresiones autorizadas al usuario
     * para el recaudo
     * @param int $idRecaudo id del recaudo al que se le asigna un nuevo numero
     * de impresiones disponibles
     * @param int $idAutorizado id del usuario autorizado a las nuevas
     * impresiones del recaudo
     * @return int
     */
    public function registrarImpresionesRecaudoUsuario($impAutorizada, $idRecaudo, $idAutorizado, $impRealizada = null) {
        $data['imre_fecha'] = 'now()';
        $data['imre_impautorizada'] = $impAutorizada;
        if ($impRealizada != null) {
            $data['imre_imprealizada'] = $impRealizada;
        } else {
            $data['imre_imprealizada'] = '0';
        }
        if ($impRealizada >= $impAutorizada) {
            $data['imre_estado'] = 'C';
        } else {
            $data['imre_estado'] = 'A';
        }
        $data['rec_ideregistro'] = $idRecaudo;
        $data['usu_ideautorizado'] = $idAutorizado;
        $data['usu_ideregistro'] = $this->sesion->get('idusuario');
        return $this->insertar($data, 'imre_imprecaudo', null);
    }

    /**
     * Actualiza la informacion de impresiones autorizadas por cada impresion
     * realizada por el usuario autorizado.
     * @param int $idImpresion id del registro de autorizacion de impresion
     * @param int $estado estado del registro de la impresion a actualizar
     * @param int $numeroImpresiones valor del numero de impresiones realizadas
     * @return int numero de registros afectados por la actualización
     */
    public function actualizarImpresionRecaudoUsuario($idImpresion, $estado, $numeroImpresiones) {
        $data['imre_ideregistr'] = $idImpresion;
        $data['imre_estado'] = $estado;
        $data['imre_imprealizada'] = $numeroImpresiones;
        return $this->actualizar($data, 'imre_imprecaudo', 'imre_ideregistr = :imre_ideregistr');
    }

    /**
     * Consulta un registro en la tabla imre_imprecaudo a traves de su llave
     * primaria
     * @param int $idImpresion id de registro de impresion a consultar
     * @return array Informacion del registro de impresion
     */
    public function consultarImpresionRecaudoId($idImpresion) {
        $parametros['idimpresion'] = $idImpresion;
        $sql = 'select
                    imre.imre_ideregistr idimpresion,
                    imre.imre_estado estadoimpresion,
                    imre.imre_fecha fechaimpresion,
                    imre.imre_impautorizada impresionesauth,
                    imre.imre_imprealizada impresionesreal
                from
                    imre_imprecaudo imre
                where
                    imre.imre_ideregistr = :idimpresion';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

}
