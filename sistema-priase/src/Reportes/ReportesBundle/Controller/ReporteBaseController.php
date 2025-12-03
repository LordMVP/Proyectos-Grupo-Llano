<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ReporteBaseController
 *
 * @author jpsierra
 */

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;

class ReporteBaseController extends Controller {

    //put your code here
    public $manager;
    public $sesion;
    public $idUsuario;
    public $parametrosBasicos;
    public $usuario;
    public $idEmpresa;
    public $empresaNombre;
    public $modeloGenerico;
    public $conexion;
    public $userPassword;
    public $utilModel;

    public function __construct(ContainerInterface $container) {
        $this->container = $container;
        $this->manager = new ReportManager();
        $this->sesion = Util::iniciarSesion($this);
        $this->idUsuario = $this->sesion->get('idusuario');
        $this->usuario = $this->sesion->get('usuario');
        $this->idEmpresa = $this->sesion->get('emp_ideregistro');
        $this->empresaNombre = $this->sesion->get('empresa');
        $this->conexion = Util::getConexion($this);
        $this->parametrosBasicos = array();
        $this->modeloGenerico = new GenericoModel($this->conexion);
        $this->utilModel = new \Reportes\ReportesBundle\Models\UtilModel($this->conexion);
        $this->parametrosBasicos['empresa'] = $this->empresaNombre;
    }

    public function indexAction() {
        return new \Symfony\Component\HttpFoundation\Response("Hola");
    }

    public function getUserDetails() {
        $sql = "SELECT * FROM usuarios usu LEFT JOIN cargos car ON car.cargo_cod = usu.usuario_codcar WHERE usu_ideregistro = :idUsuario LIMIT 1";
        $parameters = array("idUsuario" => $this->idUsuario);
        $result = $this->conexion->executeQuery($sql, $parameters);
        $data = $result->fetchAll(\PDO::FETCH_ASSOC);
        return $data[0];
    }

    public function getReportObject($nombreReporte, $parameters, $format = "pdf",$swap=true, $jndi = JASPER_REPORTS_JNDI) {
        $informacionUsuario =   $this->getUserDetails(); 
        $parameters["PR_STR_ROOT_PATH"] = JASPER_REPORTS_PATH;
        $parameters["PR_STR_IMAGES_PATH"] = JASPER_REPORTS_PATH;
        $parameters["PR_STR_USUARIO"] = $this->usuario;
        $parameters["PR_STR_TITULO_EMPRESA"] = $this->empresaNombre;
        $parameters["PR_STR_USUARIO_CARGO"] = $informacionUsuario['cargo_nom'];
        $parameters["PR_INT_EMPRESA"] = $this->idEmpresa;
        if ($swap) {
            $parameters["USE_SWAP"]=$swap;
        }
        $params = JasperUtil::parseParams($parameters);

        $report = array("jndi" => $jndi, "format" => $format, "reportName" => JASPER_REPORTS_PATH . $nombreReporte, "parameters" => $params);
        $report['user'] = $this->idUsuario;
        $report['password'] = md5($informacionUsuario['usuario_pas']);
        return $report;
    }

}
