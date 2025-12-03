<?php
require_once "db.class.php";
class m_inicio extends database {
	public function iniciarSesion($post){
		$_SESSION["acc_ideregistro"]="325";
		$_SESSION["usu_ideregistro"]="288";
		$_SESSION["pfi_ideregistro"]="1";
		$_SESSION["emp_ideregistro"]="322";
		print_r($_SESSION);
		return true;		
		}
	}		      
?>