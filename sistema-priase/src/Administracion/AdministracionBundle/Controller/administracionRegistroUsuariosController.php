<?php

namespace Administracion\AdministracionBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Administracion\AdministracionBundle\Delegado\RegistroUsuariosDelegado;

/**
 * Description of Administracion Registro de Usuarios
 *
 * @author Oscar Baquero
 */
class administracionRegistroUsuariosController extends Controller {

    //put your code here
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $lisParametros['fecha'] = date('Y-m-d');
        $registroUsuariosDelegado = new registroUsuariosDelegado($this, $sesion);
        $response = $this->render('AdministracionAdministracionBundle:Parametrizacion:administracionRegistroUsuarios.html.twig', $lisParametros);
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

    public function getUsuariosAllAction() {

        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $parametros['idedocumento'] = $request->get('idedocumento');
            $parametros['nombre'] = $request->get('nombre');
            $registroUsuariosDelegado = new RegistroUsuariosDelegado($this, $sesion);
            $resultadoUsuario = $registroUsuariosDelegado->getAllUsuariosUnidades($parametros);
            $resultado['data'] = $resultadoUsuario;
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

    public function buscaProgramasUsuarioAsignarAction() {
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $parametros['idusuarioasignar'] = $request->get('idusuarioAsignar');
            $registroUsuariosDelegado = new RegistroUsuariosDelegado($this, $sesion);
            $resultado['programas'] = $registroUsuariosDelegado->buscaProgramasUsuarioAsignar($parametros);
            $resultado['codigoRespuesta'] = 1;
            $resultado['mensaje'] = "Transacción finalizó exitosamente";
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function buscaProgramasUsuarioAsignarProyectoAction() {
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $parametros['idusuarioasignar'] = $request->get('idusuarioAsignar');
            $registroUsuariosDelegado = new RegistroUsuariosDelegado($this, $sesion);
            $resultado['programas'] = $registroUsuariosDelegado->buscaProgramasUsuarioAsignarProyecto($parametros);
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

    public function buscaAllUnidadesAction() {
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $parametros['idprograma'] = $request->get('ideprograma');
            $parametros['idusuarioasignar'] = $request->get('idusuarioAsignar');
            $registroUsuariosDelegado = new RegistroUsuariosDelegado($this, $sesion);
            $resultado['unidades'] = $registroUsuariosDelegado->buscaAllUnidades($parametros);
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

    public function buscaRutasAction() {
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $parametros['idusuarioasignar'] = $request->get('idusuarioAsignar');
            $registroUsuariosDelegado = new RegistroUsuariosDelegado($this, $sesion);
            $resultado['rutas'] = $registroUsuariosDelegado->buscaRutas($parametros);
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

    public function grabarPermisosUsuariosCompletoAction() {
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $parametros['idcolaboradororigen'] = $request->get('ideColaboradorOrigen');
            $parametros['idcolaboradorasignar'] = $request->get('ideColaboradorAsignar');
            $parametros['idPerfil'] = $request->get('idePerfil');
            $accion = $request->get('accion');
            $registroUsuariosDelegado = new RegistroUsuariosDelegado($this, $sesion);
            if ($accion == 1) {
                $registroUsuariosDelegado->eliminaPermisoUsuario($parametros['idcolaboradorasignar'], $parametros['idPerfil']);
            }
            $registroUsuariosDelegado->grabarPermisoUsuario($parametros);
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
            $parametros['idusuarioasignar'] = $request->get('idusuarioAsignar');
            $parametros['unidadesnuevas'] = $request->get('unidadesNuevas');
            $parametros['unidadeseliminadas'] = $request->get('unidadesEliminadas');
            $parametros['proyectosnuevos'] = $request->get('proyectoNuevos');
            $parametros['proyectoseliminados'] = $request->get('proyectosEliminados');
            $parametros['mediospagonuevos'] = $request->get('mediosPagoNuevos');
            $parametros['mediospagoeliminar'] = $request->get('mediosPagoEliminar');
            $parametros['rutasnuevas'] = $request->get('rutasNuevas');
            $parametros['rutaseliminar'] = $request->get('rutasEliminar');
            $registroUsuariosDelegado = new RegistroUsuariosDelegado($this, $sesion);
            $resultado['data'] = $registroUsuariosDelegado->grabarUsuario($parametros);
            $resultado['codigoRespuesta'] = 1;
            $resultado['mensaje'] = "Transacción finalizó exitosamente";
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

}
