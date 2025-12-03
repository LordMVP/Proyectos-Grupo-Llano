<?php

require_once '../controller/DataFac.php';
require_once '../../config.php';


//if (PHP_SESSION_ACTIVE !== session_status()) {
ini_set('session.handler.native_file', 'files');
ini_set('session.save_path', $_SERVER['DOCUMENT_ROOT'] . '/achagua/sistema/app/sesiones');
//}

session_start();
$fac = new DataFac();
//----
function request($url, $parameters = array()) {
    $referer = $_SERVER['HTTP_REFERER'];
    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_POST, count($parameters));
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($parameters));

    curl_setopt($ch, CURLOPT_TIMEOUT, 1000);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 1000);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type:application/json',
        'route_url_origin:' . $referer,
        'Aplicacion:nocon'
    ));
    $cabeceras = array();
    curl_setopt($ch, CURLOPT_HEADERFUNCTION, function($peticion, $propiedades) use (&$cabeceras) {
        $len = strlen($propiedades);
        $propiedades = explode(':', $propiedades, 2);
        if (count($propiedades) < 2) {// ignore invalid headers
            return $len;
        }
        $name = strtolower(trim($propiedades[0]));
        if (!array_key_exists($name, $cabeceras)) {
            $cabeceras[$name] = [trim($propiedades[1])];
        } else {
            $cabeceras[$name][] = trim($propiedades[1]);
        }
        return $len;
    });
    $data = curl_exec($ch);
    curl_close($ch);
    return $data;
}

function verificarAcceso($respuesta = null) {
    $usuario = $_POST['usuario'];
    $contrasena = $_POST['contrasena'];
    $empresa = $_POST['empresa'];
    $parametros = [
        "usuario" => $usuario,
        "clave" => $contrasena,
        "idEmpresa" => $empresa
    ];
    $url = URL_EXTERNA_AUTENTICACION;
    if ($respuesta == null || $respuesta['codigoRespuesta'] <= 0) {
        echo json_encode($respuesta);
        return;
    }
    $res = request($url, $parametros);
    $res = json_decode($res, true);
    $respuesta = ($res == null || $res['codigo'] < 0) 
            ? $respuesta = ["codigoRespuesta" => -1,
                            "mensaje" => "El usuario o la clave son inválidos."] 
            : $respuesta;
    $respuesta['token'] = $res['datos'];
    echo json_encode($respuesta);
}
//----
$opc = $_POST['i'];
switch ($opc) {
    case -2:
        $respuesta['codigoRespuesta'] = 1;
        try {
            if (isset($_SESSION['acc_ideregistro'])) {
                $respuesta['idacceso'] = $_SESSION['acc_ideregistro'];
            } else {
                $respuesta['idacceso'] = -1;
            }
        } catch (Exception $exc) {
            echo $exc;
            $respuesta['idacceso'] = null;
        }
        echo json_encode($respuesta);
        break;
    case -1:
        $respuesta['codigoRespuesta'] = 1;
        try {

            if (isset($_SESSION['acc_ideregistro'])) {
                $respuesta['inside'] = 'si';
                $resultado = $fac->registraCierreUsuario($_SESSION['acc_ideregistro']);
                $respuesta['$resultado'] = $resultado;
                if ($resultado !== null && $resultado > 0) {
                    $respuesta['confirmaSalida'] = $resultado;
                    session_destroy();
                } else {
                    $respuesta['inside'] = 'no';
                }
            } else {
                $respuesta['falloAlguno'] = -1988;
                $respuesta['codigoRespuesta'] = 0;
            }
        } catch (Exception $ex) {
            $respuesta['codigoRespuesta'] = -1;
            $respueta['ex'] = $ex;
            echo $ex;
        }
        echo json_encode($respuesta);

        break;
    case 0:
        $respuesta['codigoRespuesta'] = 1;
        try {
            if (isset($_SESSION['menu'])) {
                $respuesta['menu'] = $_SESSION['menu'];
            } else {
                $respuesta['menu'] = $fac->GetDatosPorNitUsuario($_SESSION['idusuario'], $_SESSION['idempresa']);
                $_SESSION['menu'] = $respuesta['menu'];
            }
            $menu = json_encode($respuesta);
            echo $menu;
        } catch (Exception $exc) {
            echo $exc;
        }
        break;
    case 1:
        $respuesta['codigoRespuesta'] = 1;
        $getUs = '';
        try {
            $resultado = $fac->GetDatosLogin($_POST['usuario'], $_POST['contrasena'], $_POST['empresa']);
//            print_r($usuario);
            if (empty($resultado)) {
                throw new Exception('El número de documento o la contraseña no corresponden a un usuario registrado', 0);
            }
            $usuario = $resultado[0];
            if ($usuario['activo'] === 0) {
                throw new Exception('Usuario se encuentra Inactivo ', 0);
            }

            $_SESSION["usu_ideregistro"] = $usuario['idusuario'];
            $_SESSION["pfi_ideregistro"] = $usuario['idperfil'];
            $_SESSION["emp_ideregistro"] = $usuario['idempresa'];
            $_SESSION['idusuario'] = $usuario['idusuario'];
            $_SESSION['idUsuario'] = $usuario['idusuario'];
            $_SESSION['idempresa'] = $usuario['idempresa'];
            $_SESSION['idEmpresa'] = $usuario['idempresa'];
            $_SESSION['usuario'] = $usuario['usuario'];
            $_SESSION['empresa'] = $usuario['empresa'];
            $_SESSION['logo'] = $usuario['logo'];
            $_SESSION['idperfil'] = $usuario['idperfil'];
            $_SESSION['fechasistema'] = $usuario['fechasistema'];
            $respuesta['usuario'] = $usuario['usuario'];
            $respuesta['logo'] = $usuario['logo'];
            $ingreso = $fac->insertarRegistroUsuario($_SESSION['idusuario'], $_SESSION['idperfil'], $_SESSION['idempresa']);
            if (empty($ingreso)) {
                throw new Exception('Error obteniendo el idacceso', -1);
            }
            $_SESSION['acc_ideregistro'] = $ingreso;
            $_SESSION['idAcceso'] = $ingreso;
            $_SESSION['idacceso'] = $ingreso;
            $respuesta['idAcceso'] = $ingreso;
        } catch (Exception $exc) {
            $respuesta['codigoRespuesta'] = $exc->getCode();
            $respuesta['mensaje'] = $exc->getMessage();
        }
        verificarAcceso($respuesta);
        break;
    case 2:
        $respuesta['codigoRespuesta'] = 1;
        $empresas = array();
        try {
            $resultado = $fac->GetDatosEmpresas();
            foreach ($resultado as $key => $value) {
                $empresa = array();
                $empresa['empId'] = $resultado[$key]['empresa_sevemp'];
                $empresa['empNombre'] = $resultado[$key]['empresa_nom'];
                $empresas[] = $empresa;
            }
            $respuesta['empresas'] = $empresas;
        } catch (Exception $exc) {
            $respuesta['codigoRespuesta'] = -1;
            echo $exc;
        }
        echo json_encode($respuesta);
        break;
    case 3:
        $respuesta['codigoRespuesta'] = 1;
        $validacion = 1;
        $url = $_POST['url'];
        if ($url !== '/achagua/home.html') {
            $opcion = $fac->validaOpcionUsuario($_SESSION['idusuario'], $_SESSION['idempresa'], $url);
            $validacion = count($opcion);
        }
        if (isset($_SESSION['usuario']) && $validacion > 0) {
            $respuesta['usuario'] = $_SESSION['usuario'];
            $respuesta['fechasistema'] = $_SESSION['fechasistema'];
        } else {
            $respuesta['codigoRespuesta'] = 0;
        }
        echo json_encode($respuesta);
        break;
    default:
        break;
}
