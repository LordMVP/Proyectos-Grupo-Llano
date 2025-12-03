<?php

namespace Administracion\AdministracionBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Administracion\AdministracionBundle\Models\RegistroProgramasUsuariosModel;

/**
 * Administracion Registro usuarios Lógica.
 * @author Oscar Baquero
 */
class RegistroProgramasUsuariosDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;
    private $registroProgramaUsuarioModel;

    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->sesion = $sesion;
        $this->conexion = Util::getConexion($control);
        $this->registroProgramaUsuarioModel = new RegistroProgramasUsuariosModel($this->conexion, $this->sesion);
    }

    public function consultaUsuarios(array $parametros) {
        if (empty($parametros)) {
            throw new MyException('No hay ningún parametro de busqueda ', 0);
        }
        try {
            $parametros['usuario'] = $this->sesion->get('idusuario');
            $parametros['empresa'] = $this->sesion->get('idempresa');
            $resultado = $this->registroProgramaUsuarioModel->consultarUsuarios($parametros);


            if (empty($resultado))
                throw new MyException("No se hay registros según busqueda ingresada ", 0);
            return($resultado);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function buscaMenus($parametros) {
        try {
            $parametros['empresa'] = $this->sesion->get('idempresa');
            $resultado = $this->registroProgramaUsuarioModel->getMenus($parametros);
            if (empty($resultado))
                throw new MyException("No se hay registros según busqueda ingresada ", 0);
            return($resultado);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function buscaOpcionesMenus($parametros) {
        try {
            $parametros['empresa'] = $this->sesion->get('idempresa');
            $resultado = $this->registroProgramaUsuarioModel->getOpcionesMenus($parametros);
            if (empty($resultado))
                throw new MyException("No se hay registros según busqueda ingresada ", 0);
            return($resultado);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function buscaProgramasUsuario($parametros) {
        try {
            $parametros['idusuario'] = $this->sesion->get('idusuario');
            $parametros['empresa'] = $this->sesion->get('idempresa');
            $resultado['programasLogin'] = $this->registroProgramaUsuarioModel->getProgramasUsuario($parametros);
            $parametros['idusuario'] = $parametros['idusuarioasignar'];
            if (empty($parametros['idusuarioasignar'])) {
                $parametros['idusuario'] = 0;
            }
            $resultado['programasAsignados'] = $this->registroProgramaUsuarioModel->getProgramasUsuario($parametros);
            if (empty($resultado))
                throw new MyException("No se hay Programas asignados  ", 0);
            return($resultado);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }
    public function buscaTodosProgramasUsuario($parametros) {
        try {
            $parametros['idusuario'] = $this->sesion->get('idusuario');
            $parametros['empresa'] = $this->sesion->get('idempresa');
            $resultado['programasLogin'] = $this->registroProgramaUsuarioModel->getTodosProgramasUsuario($parametros);
            $parametros['idusuario'] = $parametros['idusuarioasignar'];
            if (empty($parametros['idusuarioasignar'])) {
                $parametros['idusuario'] = 0;
            }
            $resultado['programasAsignados'] = $this->registroProgramaUsuarioModel->getTodosProgramasUsuario($parametros);
            if (empty($resultado))
                throw new MyException("No se hay Programas asignados  ", 0);
            return($resultado);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function buscaLoginCorreo($parametros) {
        $resultado = array();
        try {
            $resultado = $this->registroUsuarioModel->getLoginUsuario($parametros);
            if (empty($resultado))
                throw new MyException("No se encontraron Concidencias según filtro ", 0);
            return($resultado);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function grabarProgramaUsuario($data) {
        try {
            $this->conexion->beginTransaction();

            $data['usuario']['idusuario'] = $this->sesion->get('idusuario');
            $data['usuario']['idempresa'] = $this->sesion->get('idempresa');

            if (empty($data['usuario']['idusuarionit'])) {
                throw new MyException("Por favor digite número de cédula", 0);
            }
            $data['usuario'] += $this->registroProgramaUsuarioModel->getEmpresaCodigo($this->sesion->get('idempresa'));
            $validaColaborador = $this->registroProgramaUsuarioModel->getDataUsuario($data['usuario']);
            if (!empty($validaColaborador)) {
                throw new MyException("Cédula ingresada, ya existe en Prisma", 0);
            }
            $ideUsuario = $this->registroProgramaUsuarioModel->insertarColaborador($data['usuario']);
            $data['usuario']['idcolaborador'] = $ideUsuario;

            if (empty($ideUsuario)) {
                throw new MyException("No se registro el Ide del Colaborador", 0);
            }
            if ($data['usuario']['idePerfil'] == 0) {
                $idePerfil = $this->registroProgramaUsuarioModel->GrabaPerfilEmpresa($data['usuario']);
                if (empty($idePerfil)) {
                    throw new MyException("No se registro el Ide del perfil", 0);
                }
            } else {
                $idePerfil = $data['usuario']['idePerfil'];
            }
            $data['usuario']['ideperfilNuevo'] = $idePerfil;
            $this->registroProgramaUsuarioModel->autorizaUsuario($data['usuario']);
            if ($data['usuario']['idePerfil'] == 0) {
                foreach ($data['programaNuevos'] as $programaNuevos) {
                    $programaNuevos['idusuario'] = $this->sesion->get('idusuario');
                    $resultadoOppf = $this->registroProgramaUsuarioModel->getOppfPerfil($programaNuevos['ideopc'], $idePerfil);
                    if (!empty($resultadoOppf)) {
                        continue;
                    }
                    $programaNuevos['ideperfilNuevo'] = $idePerfil;
                    $this->registroProgramaUsuarioModel->insertarOppfPerfil($programaNuevos);
                }
            }
            $this->conexion->commit();
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException($e->getMessage(), $e->getCode());
        }
    }

    public function actualizarProgramaUsuario($data) {
        try {
            $this->conexion->beginTransaction();
            
            if ($data['ideperfilasignar'] > 0) {
                
                $data['usuario']['pfi_ideregistro'] = $data['ideperfilasignar'];
                $this->registroProgramaUsuarioModel->actualizaPerfilEmpresa($this->sesion->get('idempresa'), $data['pfi_ideregistro'], $data['usuario']['usu_ideregistro'], $data['ideperfilasignar'], $this->sesion->get('idusuario'));
                $this->conexion->commit();
                return;
            }
            $this->registroProgramaUsuarioModel->actualizaUsuario($data['usuario']);
            $ideperfil = $data['pfi_ideregistro'];
            if (!empty($data['programaElimina'])) {
                foreach ($data['programaElimina'] as $programaElimina) {
                    $resultadoOppf = $this->registroProgramaUsuarioModel->getOppfPerfil($programaElimina['ideopc'], $ideperfil);
                    if (!empty($resultadoOppf)) {
                        $this->registroProgramaUsuarioModel->eliminaOppfPerfil($programaElimina['ideopc'], $ideperfil);
                    }
                }
            }
            if (!empty($data['programaNuevos'])) {
                foreach ($data['programaNuevos'] as $programaNuevos) {
                    $programaNuevos['idusuario'] = $this->sesion->get('idusuario');
                    $resultadoOppf = $this->registroProgramaUsuarioModel->getOppfPerfil($programaNuevos['ideopc'], $ideperfil);
                    if (!empty($resultadoOppf)) {
                        continue;
                    }
                    $programaNuevos['ideperfilNuevo'] = $ideperfil;
                    $this->registroProgramaUsuarioModel->insertarOppfPerfil($programaNuevos);
                }
            }
            $this->conexion->commit();
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException($e->getMessage(), $e->getCode());
        }
    }

    public function grabarPerfilNuevo($data) {
        try {
            $this->conexion->beginTransaction();
            $data['usuario']['idusuario'] = $this->sesion->get('idusuario');
            $idePerfil = $this->registroProgramaUsuarioModel->GrabaPerfilEmpresa($data['usuario']);
            if (empty($idePerfil)) {
                throw new MyException("No se registro el Ide del perfil", 0);
            }
            if (!empty($data['programaNuevos'])) {
                foreach ($data['programaNuevos'] as $programaNuevos) {
                    $programaNuevos['idusuario'] = $this->sesion->get('idusuario');
                    $resultadoOppf = $this->registroProgramaUsuarioModel->getOppfPerfil($programaNuevos['ideopc'], $idePerfil);
                    if (!empty($resultadoOppf)) {
                        continue;
                    }
                    $programaNuevos['ideperfilNuevo'] = $idePerfil;
                    $this->registroProgramaUsuarioModel->insertarOppfPerfil($programaNuevos);
                }
            }
            $this->conexion->commit();
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException($e->getMessage(), $e->getCode());
        }
    }

    public function getPerfiles() {
        $data['idusuario'] = $this->sesion->get('idusuario');
            $data['idempresa'] = $this->sesion->get('idempresa');
        return $this->registroProgramaUsuarioModel->getPerfiles($data);
    }

}
