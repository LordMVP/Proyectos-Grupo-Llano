<?php
	header('Content-Type: text/html; charset=ISO-8859-1'); 
	require 'app/controlador/controlador.php';
	$mvc = new Controlador();
	$mvc->cargarPrograma($_GET["modulo"],$_GET);
?>