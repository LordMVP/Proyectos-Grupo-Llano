<?php

require_once '../model/DataCrudSql.php';
require_once '../model/Database.php';

class DataFac {

    /**
     * Manages access to the database.
     *
     * @var ConexionPG
     */
    private $datosAcceso;

    /**
     * Last statement executed.
     *
     * @var mixed
     */
    private $sentencia;

    /**
     * Constructor.
     */
    public function __construct() {
        //$this->datosAcceso = new ConexionPG(Config::HOST, Config::USUARIO, Config::CLAVE, Config::BD);
        $this->datosAcceso = new Database();
    }

    /**
     * GetDatosPorNitUsuario
     * 
     * @var UsuarioVo $usuarioVo
     */
    public function GetDatosPorNitUsuario($idUsuario, $empresa) {
        $this->sentencia = new DataCrudSql();
        return $this->sentencia->GetDatosPorNitUsuario($this->datosAcceso, $idUsuario, $empresa);
    }

    public function GetDatosLogin($usuario, $contrasena, $empresa) {
        $this->sentencia = new DataCrudSql();
        return $this->sentencia->regresarDatosLogin($this->datosAcceso, $usuario, $contrasena, $empresa);
    }

    public function GetDatosEmpresas() {
        $this->sentencia = new DataCrudSql();
        return $this->sentencia->datosEmpresa($this->datosAcceso);
    }

    public function insertarRegistroUsuario($usuario, $perfil, $empresa) {
        $this->sentencia = new DataCrudSql();
        return $this->sentencia->insertaRegistro($this->datosAcceso, $usuario, $perfil, $empresa);
    }

    public function registraCierreUsuario($acceso) {
        $this->sentencia = new DataCrudSql();
        return $this->sentencia->registraCierre($this->datosAcceso, $acceso);
    }

    public function validaOpcionUsuario($idUsuario, $idEmpresa, $url) {
        $this->sentencia = new DataCrudSql();
        return $this->sentencia->validaOpcionUsuario($this->datosAcceso, $idUsuario, $idEmpresa, $url);
    }

}
