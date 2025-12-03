<?php

namespace Administracion\AdministracionBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Administracion\AdministracionBundle\Delegado\RegistroProgramasUsuariosDelegado;

/**
 * Description of Autorización de Programas de Usuarios
 *
 * @author Oscar Baquero
 */
class RegistroProgramasUsuariosController extends Controller {

    //put your code here
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $lisParametros['fecha'] = date('Y-m-d');
        $response = $this->render('AdministracionAdministracionBundle:Parametrizacion:registroProgramasUsuarios.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function consultarUsuarioAction() {

        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $parametros['idedocumento'] = $request->get('idedocumento');
            $parametros['nombre'] = $request->get('nombre');
            $registroUsuariosDelegado = new RegistroUsuariosDelegado($this, $sesion);
            $resultadoUsuario = $registroUsuariosDelegado->consultaUsuarios($parametros);
            $resultado['data'] = $resultadoUsuario;
            $resultado['codigoRespuesta'] = empty($resultadoUsuario) ? 0 : 1;
            $resultado['mensaje'] = empty($resultadoUsuario) ? "No se encontraron resultados con los datos ingresados" : "Consulta Exitosa ";
        } catch (\Exception $ex) {
            $resultado['codigoRespuesta'] = $ex->getCode();
            $resultado['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }
    
    public function buscaPerfilesAction() {

        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $registroUsuariosDelegado = new RegistroProgramasUsuariosDelegado($this, $sesion);
            $resultadoUsuario = $registroUsuariosDelegado->getPerfiles();
            $resultado['perfiles'] = $resultadoUsuario;
            $resultado['codigoRespuesta'] = empty($resultadoUsuario) ? 0 : 1;
            $resultado['mensaje'] = empty($resultadoUsuario) ? "No se encontraron resultados con los datos ingresados" : "Consulta Exitosa ";
        } catch (\Exception $ex) {
            $resultado['codigoRespuesta'] = $ex->getCode();
            $resultado['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function insertaPerfilEmpresaAction() {
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $parametros['ideperfil'] = $request->get('idPerfilAutorizada');
            $parametros['idcolaborador'] = $request->get('idColaborador');
            $registroUsuariosDelegado = new RegistroUsuariosDelegado($this, $sesion);
            $resultado['data'] = $registroUsuariosDelegado->grabarPerfilUsuarioEmpresa($parametros);
            $resultado['codigoRespuesta'] = 1;
            $resultado['mensaje'] = "Transacción finalizó exitosamente";
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function getMenuAction() {
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $parametros['idusuarioasignar'] = $request->get('idusuarioAsignar');
            $registroProgramaUsuariosDelegado = new RegistroProgramasUsuariosDelegado($this, $sesion);
            $resultado['menus'] = $registroProgramaUsuariosDelegado->buscaMenus($parametros);
            $resultado['codigoRespuesta'] = 1;
            $resultado['mensaje'] = "Transacción finalizó exitosamente";
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }
    
    public function getOpcionesMenuAction() {
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $parametros['idpadremenu'] = $request->get('idpadreMenu');
            $registroProgramaUsuariosDelegado = new RegistroProgramasUsuariosDelegado($this, $sesion);
            $resultado['opcionesMenus'] = $registroProgramaUsuariosDelegado->buscaOpcionesMenus($parametros);
            $resultado['codigoRespuesta'] = 1;
            $resultado['mensaje'] = "Transacción finalizó exitosamente";
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function buscaProgramasUsuariosAction() {
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $parametros['idusuarioasignar'] = $request->get('idusuarioAsignar');
            $parametros['ideopcionesmenu'] = $request->get('ideOpcionesMenu');
            $registroProgramaUsuariosDelegado = new RegistroProgramasUsuariosDelegado($this, $sesion);
            $resultado['programas'] = $registroProgramaUsuariosDelegado->buscaProgramasUsuario($parametros);
            $resultado['codigoRespuesta'] = 1;
            $resultado['mensaje'] = "Transacción finalizó exitosamente";
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }
    public function buscaTodosprogramasUsuariosAction() {
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $parametros['idusuarioasignar'] = $request->get('idusuarioAsignar');
            $parametros['ideopcionesmenu'] = $request->get('ideOpcionesMenu');
            $registroProgramaUsuariosDelegado = new RegistroProgramasUsuariosDelegado($this, $sesion);
            $resultado['programas'] = $registroProgramaUsuariosDelegado->buscaTodosProgramasUsuario($parametros);
            $resultado['codigoRespuesta'] = 1;
            $resultado['mensaje'] = "Transacción finalizó exitosamente";
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function buscaEstructuraUsuarioLoginAction() {
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $parametros['idprograma'] = $request->get('idprograma');
            $registroUsuariosDelegado = new RegistroUsuariosDelegado($this, $sesion);
            $resultado['estructuras'] = $registroUsuariosDelegado->buscaEstructuraUsuarioLogin($parametros);
            $resultado['codigoRespuesta'] = 1;
            $resultado['mensaje'] = "Transacción finalizó exitosamente";
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function buscaUnidadesUsuarioxProgramaEstructuraAction() {
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $parametros['idprograma'] = $request->get('idprograma');
            $parametros['idestructura'] = $request->get('idestructura');
            $parametros['idusuarioasignar'] = $request->get('idusuarioAsignar');
            $registroUsuariosDelegado = new RegistroUsuariosDelegado($this, $sesion);
            $resultado['unidades'] = $registroUsuariosDelegado->buscaUnidadesProgramaUsuarioEstructura($parametros);
            $resultado['codigoRespuesta'] = 1;
            $resultado['mensaje'] = "Transacción finalizó exitosamente";
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function buscaMediosPagosAction() {
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $parametros['idusuarioasignar'] = $request->get('idusuarioAsignar');
            $registroUsuariosDelegado = new RegistroUsuariosDelegado($this, $sesion);
            $resultado['mediospagos'] = $registroUsuariosDelegado->getMediosPagos($parametros);
            $resultado['codigoRespuesta'] = 1;
            $resultado['mensaje'] = "Transacción finalizó exitosamente";
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function buscaProyectoUsuarioProgramaAction() {
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $parametros['idusuarioasignar'] = $request->get('idusuarioAsignar');
            $parametros['idprograma'] = $request->get('ideprograma');
            $registroUsuariosDelegado = new RegistroUsuariosDelegado($this, $sesion);
            $resultado['proyectos'] = $registroUsuariosDelegado->buscaProyectosUsuarioPrograma($parametros);
            $resultado['codigoRespuesta'] = 1;
            $resultado['mensaje'] = "Transacción finalizó exitosamente";
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function validacionLoginAction() {
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $parametros['idusuariocorreo'] = $request->get('idusuarioCorreo');
            $registroUsuariosDelegado = new RegistroUsuariosDelegado($this, $sesion);
            $resultado['proyectos'] = $registroUsuariosDelegado->buscaLoginCorreo($parametros);
            $resultado['codigoRespuesta'] = 1;
            $resultado['mensaje'] = "Transacción finalizó exitosamente";
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function grabarPermisoUsuarioAction() {
        
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);          
            $parametros['usuario']['idusuarionit'] = $request->get('ideCedula');
            $parametros['usuario']['nombreUsuario'] = $request->get('nombreUsuario');
            $parametros['usuario']['correo'] = $request->get('correo');
            $parametros['usuario']['topeFinanciar'] = $request->get('topeFinanciar');
            $parametros['usuario']['password'] = $request->get('password');
            $parametros['usuario']['perfil'] = $request->get('perfil');
            $parametros['usuario']['idePerfil'] = $request->get('idePerfil');
            $parametros['usuario']['recaudoExterno'] = $request->get('recaudoExterno');
            $parametros['programaNuevos'] = $request->get('programaNuevos');
            $registroProgramasUsuariosDelegado = new RegistroProgramasUsuariosDelegado($this, $sesion);
            $resultado['data'] = $registroProgramasUsuariosDelegado->grabarProgramaUsuario($parametros);
            $resultado['codigoRespuesta'] = 1;
            $resultado['mensaje'] = "Transacción finalizó exitosamente";
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }
    public function guardaNuevoPerfilAction() {
        
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);          
            $parametros['usuario']['perfil'] = $request->get('perfil');
            $parametros['programaNuevos'] = $request->get('programaNuevos');
            $registroProgramasUsuariosDelegado = new RegistroProgramasUsuariosDelegado($this, $sesion);
            $resultado['data'] = $registroProgramasUsuariosDelegado->grabarPerfilNuevo($parametros);
            $resultado['codigoRespuesta'] = 1;
            $resultado['mensaje'] = "Transacción finalizó exitosamente";
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }
    public function actualizaPermisoProgramaUsuarioAction() {
        
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);          
            $parametros['usuario']['usu_ideregistro'] = $request->get('ideUsuarioColaborador');
            $parametros['usuario']['usuario_nom'] = $request->get('nombreUsuario');
            $parametros['usuario']['usu_topfinancia'] = $request->get('topeFinanciar');
            $parametros['usuario']['usu_modrecexterno'] = $request->get('recaudoExterno');
            $parametros['pfi_ideregistro'] = $request->get('idePerfilColaborador');
            $parametros['ideperfilasignar'] = $request->get('idePerfilAsignar');
            $parametros['programaNuevos'] = $request->get('programaNuevos');
            $parametros['programaElimina'] = $request->get('programaElimina');
            $registroProgramasUsuariosDelegado = new RegistroProgramasUsuariosDelegado($this, $sesion);
            $resultado['data'] = $registroProgramasUsuariosDelegado->actualizarProgramaUsuario($parametros);
            $resultado['codigoRespuesta'] = 1;
            $resultado['mensaje'] = "Transacción finalizó exitosamente";
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

}
