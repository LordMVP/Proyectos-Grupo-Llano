<?php
	header('Content-Type: text/html; charset=ISO-8859-1'); 
	require 'app/controlador/controlador.php';
	$mvc = new Controlador();
	isset($_GET['modulo']) ? $mvc->cargarPagina($_GET["modulo"]):$mvc->cargarPagina("");
?>