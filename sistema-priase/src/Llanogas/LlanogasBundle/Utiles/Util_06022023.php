<?php

namespace Llanogas\LlanogasBundle\Utiles;

use Symfony\Component\HttpFoundation\Response;
use Llanogas\LlanogasBundle\MyException;
use Symfony\Component\Yaml\Parser;
use Symfony\Component\HttpFoundation\Request;
use \Firebase\JWT\JWT;


class Util {

    /**
     * Crea un combo de html
     * @param string $nombre identificador del combo
     * @param array $listaEstados información del combo
     * @return string html con el combo
     */
    public static function crearCombo($nombre, $listaEstados) {
        $html = "<select id='$nombre'>";
        foreach ($listaEstados as $key => $value) {
            $html .= "  <option value='$key'>$value</option>";
        }
        $html .= "</select>";
        return $html;
    }

    public static function crearComboEx($nombre, $listaEstados) {
        $html = "<select id='$nombre'>";
        foreach ($listaEstados as $key => $value) {
            $html .= "  <option value='$key'>$value</option>";
        }
        $html .= "</select>";
        return $html;
    }

    /**
     * Crea una respuesta JSON de acuero a un objeto.
     * @param type $respuesta
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public static function construyeRespuesta($respuesta) {
        $response = new Response(json_encode($respuesta));
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }

    /**
     * Verifica que la petición se haga por el método POST.
     * @param \Symfony\Bundle\FrameworkBundle\Controller\Controller $control
     * @throws MyException
     */
    public static function validarPeticion(&$control) {
        $request = $control->getRequest();
        if ($request->getMethod() !== 'POST') {
            throw new MyException('Error, petición inválida', -1);
        }
    }

    /**
     * Obtiene la sesión activa.
     * @param  \Symfony\Component\HttpFoundation\Request $request
     * @return \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private static function obtenerSesion($request) {
        $sesion = $request->getSession();
        if ($sesion === null || $sesion->get('idusuario') === null) {
            $sessionStorage = new LegacySessionStorage();
            $sessionStorage->start();
            $data = $sessionStorage->getData();
            if (is_array($data) &&count($data) > 0) {
                foreach ($data as $key => $value) {
                    $sesion->set($key, $value);
                }
            } else {
                Util::redireccionar('/achagua', $request->getMethod());
            }
        }
        if ($sesion == null || empty($sesion->get('idusuario')) || empty($sesion->get('idempresa'))) {
            Util::redireccionar('/achagua', $request->getMethod());
        }
        ConceptosUtil::$idEmpresa = $sesion->get('idempresa');
        return $sesion;
    }


    public static function validarToken(&$control, $idEmpresa, $idUsuario, $idPfi,
            $idAcceso, $nombre) {

        $request = $control->getRequest();
        $sesion = $request->getSession();

        if ($sesion === null || $sesion->get('idusuario') === null) {

            $sesion->set('pfi_ideregistro', $idPfi);
            $sesion->set('emp_ideregistro', $idEmpresa);
            $sesion->set('idusuario', $idUsuario);
            $sesion->set('idUsuario', $idUsuario);
	    $sesion->set('idempresa', $idEmpresa);
            $sesion->set('idEmpresa', $idEmpresa);
            $sesion->set('usuario', $nombre);
            $sesion->set('idperfil',  $idPfi);
            $sesion->set('acc_ideregistro', $idAcceso);
            $sesion->set('idAcceso', $idAcceso);
            $sesion->set('idacceso', $idAcceso);
        }

	if ($sesion == null || empty($sesion->get('idusuario')) || empty($sesion->get('idempresa'))) {
            Util::redireccionar('/achagua', $request->getMethod());
        }

	ConceptosUtil::$idEmpresa = $sesion->get('idempresa');
        return $sesion;
    }


    /**
     * Valida la sesión dependiendo de la petición.
     * @param  \Symfony\Component\HttpFoundation\Request $request
     * @return \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    public static function validarSesion(&$request) {
        return Util::obtenerSesion($request);
    }

    /**
     * Inicia una sesión
     * @param \Symfony\Bundle\FrameworkBundle\Controller\Controller $control
     * @return \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    public static function iniciarSesion(&$control) {
        $request = $control->getRequest();
        return Util::obtenerSesion($request);
    }

    /**
     * Realiza un redireccionamiento de una página.
     * @param type $pagina
     */
    public static function redireccionar($pagina, $metodo = 'POST') {
        if ($metodo === 'GET') {
            $response = new Response();
            $response->setStatusCode(200);
            $response->headers->set('location', $pagina);
            $response->send();
        } else {
            throw new MyException('Se ha cerrado la sesión', -2);
        }
    }

    /**
     * Obtiene la conexión del controller
     * @param \Symfony\Bundle\FrameworkBundle\Controller\Controller $control
     * @return \Doctrine\DBAL\Connection
     */
    public static function getConexion($control) {
        try {
            $conexion = $control->getDoctrine()->getManager()->getConnection();
            $conexion->getConfiguration()->setSQLLogger(null);
            return $conexion;
        } catch (\Exception $e) {
            throw new MyException('' . $e->getMessage(), -1);
        }
    }

    /**
     * Diferencia entre dos fechas
     * @param date $fechaInicial
     * @param date $fechaFinal
     * @param date $fecha
     * @return bool
     */
    public static function fechaEntreRango($fechaInicial, $fechaFinal, $fecha) {
        $datetimeInicial = new \DateTime($fechaInicial);
        $datetimeFinal = new \DateTime($fechaFinal);
        $dateTimeFecha = new \DateTime($fecha);
        if ($datetimeInicial <= $dateTimeFecha && $datetimeFinal >= $dateTimeFecha) {
            return 1;
        }
        return 0;
    }

    /**
     * Obtiene la fecha actual del sistema
     * @return date
     */
    public static function fechaActual() {
        return date('Y-m-d');
    }

    /**
     * Sube un archivo al servidor
     * @param  \Symfony\Component\HttpFoundation\Request $request
     * @return array Lista de archivos que se subieron
     */
    public static function subirArchivo($request, $idUsuario) {
        $listaArchivos = array();
        $archivoDestino = null;
        foreach ($request->files as $uploadedFile) {
            if (!is_object($uploadedFile)) {
                throw new MyException('Error, Debe seleccionar un archivo.', -1);
            }
            $name = $uploadedFile->getClientOriginalName();
            $archivoDestino = RUTA_ARCHIVOS . round(microtime(true) * 1000) . '_' . $idUsuario . '-' . $name;
            $subido = move_uploaded_file($uploadedFile->getPathname(), $archivoDestino);
            if ($subido) {
                $listaArchivos[] = $archivoDestino;
            }
        }
        return $listaArchivos;
    }

    /**
     * Sube un archivo al servidor
     * @param  \Symfony\Component\HttpFoundation\Request $request
     * @return array Lista de archivos que se subieron
     */
    public static function subirAdjunto($request, $idUsuario, $modulo, $tamano = null) {
        $listaArchivos = array();
        $archivoDestino = null;
        foreach ($request->files as $uploadedFile) {
            if (!is_object($uploadedFile)) {
                throw new MyException('Error, Debe seleccionar un archivo.', -1);
            }
            $name = $uploadedFile->getClientOriginalName();
            $rutaArchivo = RUTA_ARCHIVOS . $modulo . '/';
            if (!file_exists($rutaArchivo)) {
                mkdir($rutaArchivo);
            }
            $partesNombreArchivo = explode(".", $name);
            $extension = end($partesNombreArchivo);
            $nombreArchivo = rand(0, 10000) . round(microtime(true) * 1000) . '_' . $idUsuario . '.' . $extension;
            $archivoDestino = $rutaArchivo . $nombreArchivo;
            $tamanoArchivo = $uploadedFile->getClientSize();
            //print_r($uploadedFile);
            if (!empty($tamano)) {
                if ($tamanoArchivo > $tamano) {
                    throw new MyException('El tamaño del archivo no es permitido', -1);
                }
            }
            $subido = move_uploaded_file($uploadedFile->getPathname(), $archivoDestino);
            if ($subido) {
                $archivo['rutaarchivo'] = $archivoDestino;
                $archivo['ruta'] = RUTA_ARCHIVOS_WEB . $modulo . '/' . $nombreArchivo;
                $archivo['nombrearchivo'] = $name;
                $archivo['fileCode'] = $request->get('fileCode');
                $listaArchivos[] = $archivo;
            }
        }
        return $listaArchivos;
    }

    public static function crearComboBox($nombre, $listaEstados) {
        $html = "";
        foreach ($listaEstados as $key => $value) {
            $html .= "<input type='checkbox' value='$key' data-attr='Tipo Suscripcion'/>";
            $html .= "$value";
        }

        return $html;
    }

    public static function crearComboLu($nombre, $listaEstados) {

        $html = "<ul id='$nombre' class='connectedSortable'>";
        foreach ($listaEstados as $key => $value) {
            $html .= "<li class='ui-state-highlight'>$value</li>";
        }
        $html .= "</ul>";
        return $html;
    }

    public static function ponderarConcepto($saldoConcepto, $valorFinanciable, $valorFinanciar) {
        $porcentaje = $saldoConcepto / $valorFinanciable;
        return ($valorFinanciar * $porcentaje);
    }

    public static function cargarScript(array $listaScripts) {
        foreach ($listaScripts as $script) {
            require_once ($script['script']);
        }
    }

    /**
     * Permite enviar un correo
     * @param string $correo correo de la solicitud
     * @param string $body cuerpo de mensaje
     */
    public static function enviarCorreo(&$control, $informacion, $comentario, $subject) {
        try {
            $parametros = array();
            $parametros['fechacambio'] = date('Y-m-d');
            $parametros['nombre'] = $informacion['nombre'];
            $parametros['id_credito'] = $informacion['idcredito'];
            $parametros['etapa'] = $informacion['etapa'];
            $parametros['comentario'] = $comentario;
            $parametros['imgetapa'] = Util::urlImagenEtapa($informacion['codigo']);
            $toke = Util::crearToken($parametros);
            $parametros['url'] = RUTA_WEB_POTENZA;
            $parametros['codigo'] = $toke;
//            print_r($toke);
            $mensaje = \Swift_Message::newInstance();
            $mensaje->setFrom('ele091321@gmail.com');
            $mensaje->setSubject($subject);
            $mensaje->setBody($control->render("LibranzaBundle:Correo:PlantillaCorreo.html.twig", $parametros), 'text/html');
            $mensaje->setTo($informacion['correo']);
            $mailer = $control->get('mailer');
            $mailer->send($mensaje);
            return Util::construyeRespuesta('Proceso terminado...');
        } catch (MyException $ex) {
            throw new MyException('No se puedo enviar el correo', -3);
        }
    }

    /**
     * Permite enviar un correo para la etapa de desembolso
     * @param string $correo correo de la solicitud
     * @param string $body cuerpo de mensaje
     */
    public static function enviarCorreoDese(&$control, $informacion, $subject) {
        try {
            $parametros = array();
            $parametros['fechacambio'] = date('Y-m-d');
            $parametros['nombre'] = $informacion['nombre'];
            $parametros['id_credito'] = $informacion['idcredito'];
            $parametros['valor_credito'] = number_format($informacion['cre_monto'], 2, ',', ' ');
            $parametros['imgetapa'] = Util::urlImagenEtapa($informacion['codigo']);
            $parametros['id_financiacion'] = $informacion['id_financiacion'];
            $toke = Util::crearToken($parametros);
            $parametros['url'] = RUTA_WEB_POTENZA;
            $parametros['codigo'] = $toke;
//            print_r($toke);
            $mensaje = \Swift_Message::newInstance();
            $mensaje->setFrom('ele091321@gmail.com');
            $mensaje->setSubject($subject);
            $mensaje->setBody($control->render("LibranzaBundle:Correo:PlantillaCorreoDesembolsado.html.twig", $parametros), 'text/html');
            $mensaje->setTo($informacion['correo']);
            $mailer = $control->get('mailer');
            $mailer->send($mensaje);
            return Util::construyeRespuesta('Proceso terminado...');
        } catch (MyException $ex) {
            throw new MyException('No se puedo enviar el correo', -3);
        }
    }

    public static function crearToken($parametros) {
        $key = 'APPFutureccCAPSA';
        $iv = 'APPFutureccCAPSA';
        $valor = $parametros['id_credito']; //json_encode($parametros);
        $token = Util::getEncrypt($valor, $key, $iv);
        return bin2hex(utf8_encode($token));  //utf8_encode($token);
    }

    public static function getEncrypt($texto, $sKey, $iv) {
        return base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $sKey, $texto, MCRYPT_MODE_CFB, $iv));
    }

    public static function getDecrypt($texto, $sKey, $iv) {
        return mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $sKey, base64_decode($texto), MCRYPT_MODE_CFB, $iv);
    }

    public static function urlImagenEtapa($etapa) {
        switch ($etapa) {
            case 'RADICA':
                return RUTA_WEB_POTENZA_IMG . 'registrada.png';
            case 'VALIDA':
                return RUTA_WEB_POTENZA_IMG . 'validada.png';
            case 'SCORE':
                return RUTA_WEB_POTENZA_IMG . 'calificada.png';
            case 'APROBA':
                return RUTA_WEB_POTENZA_IMG . 'aprobada.png';
            case 'DESEMB':
                return RUTA_WEB_POTENZA_IMG . 'desembolsada.png';
            case 'NEGACI':
                return RUTA_WEB_POTENZA_IMG . 'negada.png';
            case 'APRNDES':
                return RUTA_WEB_POTENZA_IMG . 'parobado_no_desembolsado.png';
        }
    }

    public static function ejecutarHilo($script) {
        if (PHP_OS == 'WINNT') {
            pclose(popen('start /b "bla" "C:/xampp/php/php.exe" ' . $script . ' ', "r"));
            return;
        }
        if (PHP_OS == 'Darwin') {
            $comando = '/Applications/XAMPP/bin/php ' . $script;
            shell_exec($comando);
            return;
        }
        shell_exec('php ' . $script);
    }

    public static function quitarCaracteresNumero($numero) {
        $numero = trim($numero);
        $numero = str_replace('.', '', $numero);
        return $numero;
    }

    public static function formatoNumeroEntero($numero) {
        return number_format($numero, 0, ',', '.');
    }
    public function validaSuscripcionCarteraNoHomologada($suscripcion)
    {
            $ParametrosSuscripcion['suscripcion']=$suscripcion ; 
            $ParametrosSuscripcion['carteraAseoNoHomologada']=0;
            $prefijoCarteraG = substr($suscripcion, 0, 4);            
            $sizesuscripcion = \strlen($suscripcion) ;             
            if($prefijoCarteraG=='9999' and $sizesuscripcion >4 ){
              $ParametrosSuscripcion['carteraAseoNoHomologada']=1;  
              $ParametrosSuscripcion['suscripcion']= substr($suscripcion, 4, (strlen($suscripcion)-1)); ;     
            }
            
            return $ParametrosSuscripcion; 
        
    }
}
