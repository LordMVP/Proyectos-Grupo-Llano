<?php
if (@$_POST['pw']!='Rosero2015') exit();
session_start();
echo "Variables de sesion\n\n";
echo "session:" . print_r($_SESSION);
?>