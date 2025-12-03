<?php
!ini_get('date.timezone') ? date_default_timezone_set('UTC'):true;
date_default_timezone_set('America/Bogota');
set_time_limit (6400);
session_start();
error_reporting(E_ALL & ~(E_STRICT|E_NOTICE));
header('Content-Type:text/html;charset=UTF-8');
abstract class jeusConf{
	function __construct(){
		session_cache_limiter('nocache');
		}
	protected $db_host = "10.43.12.9"; //servidor de la base de datos.83
	protected $db_usuario ="postgres"; //usuario de la base de datos
	protected $db_clave = "$.unico.orfeo.$"; //clave del usuario de la base de datos
	protected $db_basedatos = "Tecnico"; //nombre de la base de datos
	protected $db_puerto = 5432;
	protected $titulo = "Sistema de Facturacion Llanogas"; //nombre del aplicativo
	protected $titulo2 = "Sistema de Facturacion Llanogas"; //nombre alterno del aplicativo
	protected $titulo_index = "Control de Proveedores"; //nombre del aplicativo en la pagina de inicio
	protected $permisos = "XSBLN"; //permisos de los usuarios: S:salvar, B:buscar, L:listar, N:Nuevo registro
	protected $dominio = "localhost";
	protected $raiz = "facturacion"; //Directorio raíz de la aplicación
	protected $pie="Desarrollado por UMSystems";
	protected $regxpag = 20; //Número de registros a mostrar por pantallazo al listar los registros
	protected $id_modulo="";
	protected $jbaseroot='facturacion_mvc';//nombre del proyecto
	protected $meses=array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");	
	protected $dias=array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
	protected $archivo_servidor='localhost';//dirección del servidor de archivos para ftp
	protected $archivo_raiz='facturacion_mvc';//archivo raíz para la carpeta attachments
	}