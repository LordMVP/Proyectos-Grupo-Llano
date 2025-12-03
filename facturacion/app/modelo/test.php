<?php
session_start();
if (@$_POST['pw']!='Rosero2015') exit();
echo "test page\n\n";
echo "session:" . print_r($_SESSION);

switch(@$_POST['f']){
	case 'cambiar usuario':
		cambiarUsuario($_POST['p']);
		break;
	case 'cambiar empresa':
		cambiarEmpresa($_POST['p']);
		break;
	default:
		echo "-";
	}
print_r($_POST);
function cambiarUsuario($u){
	switch($u){
		case '1':
			$_SESSION['usu_ideregistro']='258';
			break;
		case '2':
			$_SESSION['usu_ideregistro']='288';
			break;
		case '3':
			$_SESSION['usu_ideregistro']='287';
			break;
		case '4':
			$_SESSION['usu_ideregistro']='289';
			break;
		default:
			$_SESSION['usu_ideregistro']='258';
		}
	}
function cambiarEmpresa($u){
	switch($u){
		case '1':
			$_SESSION['emp_ideregistro']='322';
			break;
		case '2':
			$_SESSION['emp_ideregistro']='317';
			break;
		}
	}
?>