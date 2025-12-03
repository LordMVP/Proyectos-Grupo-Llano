<?php

namespace Administracion\AdministracionBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Administracion\AdministracionBundle\Models\RegistroUsuarioModel;

/**
 * Administracion Registro usuarios Lógica.
 * @author Oscar Baquero
 */
class RegistroUsuariosDelegado {

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
    private $registroUsuarioModel;

    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->sesion = $sesion;
        $this->conexion = Util::getConexion($control);
        $this->registroUsuarioModel = new RegistroUsuarioModel($this->conexion, $this->sesion);
    }

    public function consultaUsuarios(array $parametros) {
        if (empty($parametros)) {
            throw new MyException('No hay ningún parametro de busqueda ', 0);
        }
        try {
            $parametros['usuario'] = $this->sesion->get('idusuario');
            $parametros['empresa'] = $this->sesion->get('idempresa');
            $resultado = $this->registroUsuarioModel->consultarUsuarios($parametros);


            if (empty($resultado))
                throw new MyException("No se hay registros según busqueda ingresada ", 0);
            return($resultado);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function getAllUsuariosUnidades(array $parametros) {
        if (empty($parametros)) {
            throw new MyException('No hay ningún parametro de busqueda ', 0);
        }
        try {
            $parametros['usuario'] = $this->sesion->get('idusuario');
            $parametros['empresa'] = $this->sesion->get('idempresa');
            $resultado = $this->registroUsuarioModel->getUsuariosSegunUnidades($parametros);


            if (empty($resultado))
                throw new MyException("No se hay registros según busqueda ingresada ", 0);
            return($resultado);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function buscaProgramasUsuarioAsignar($parametros) {
        try {
            $parametros['idusuarioasignar'] = $parametros['idusuarioasignar'];
            $parametros['empresa'] = $this->sesion->get('idempresa');
            $resultado = $this->registroUsuarioModel->buscaProgramasUsuarioAsignar($parametros);
            if (empty($resultado))
                throw new MyException("No se hay registros según busqueda ingresada ", 0);
            return($resultado);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function buscaProgramasUsuarioAsignarProyecto($parametros) {
        try {
            $parametros['idusuarioasignar'] = $parametros['idusuarioasignar'];
            $parametros['empresa'] = $this->sesion->get('idempresa');
            $resultado = $this->registroUsuarioModel->buscaProgramasUsuarioAsignarProyecto($parametros);
            if (empty($resultado))
                throw new MyException("No se hay registros según busqueda ingresada ", 0);
            return($resultado);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function buscaEstructuraUsuarioLogin($parametros) {
        try {
            $parametros['idusuariologin'] = $this->sesion->get('idusuario');
            $parametros['idempresa'] = $this->sesion->get('idempresa');
            $resultado = $this->registroUsuarioModel->buscaEstructuraProgramaUsuario($parametros);
            if (empty($resultado))
                throw new MyException("No se hay registros según busqueda ingresada ", 0);
            return($resultado);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function buscaUnidadesProgramaUsuarioEstructura($parametros) {
        $resultado = array();
        try {
            $parametros['idusuario'] = $this->sesion->get('idusuario');
            $parametros['idempresa'] = $this->sesion->get('idempresa');
            $resultado['unidadesLogin'] = $this->registroUsuarioModel->buscaUnidadesProgramaUsuario($parametros);
            $parametros['idusuario'] = $parametros['idusuarioasignar'];
            $resultado['unidadesAsignar'] = $this->registroUsuarioModel->buscaUnidadesProgramaUsuario($parametros);
            if (empty($resultado))
                throw new MyException("No hay Unidades para el programa estructura seleccionada ", 0);
            return($resultado);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function buscaAllUnidades($parametros) {
        $resultado = array();
        try {
            $parametros['idusuario'] = $this->sesion->get('idusuario');
            $parametros['idempresa'] = $this->sesion->get('idempresa');
            $resultado['unidadesLogin'] = $this->registroUsuarioModel->getAllUnidades($parametros);
            $parametros['idusuario'] = $parametros['idusuarioasignar'];
            $resultado['unidadesAsignar'] = $this->registroUsuarioModel->getAllUnidades($parametros);
            if (empty($resultado))
                throw new MyException("No hay Unidades para el programa  seleccionado ", 0);
            return($resultado);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function grabarPerfilUsuarioEmpresa($parametros) {
        try {
            $this->conexion->beginTransaction();
            $parametros['usuario'] = $this->sesion->get('idusuario');
            $parametros['empresa'] = $this->sesion->get('idempresa');
            $resultado = $this->registroUsuarioModel->buscaAutorizaUsuario($parametros);
            $resultado = $this->registroUsuarioModel->autorizaUsuario($parametros);
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function getMediosPagos($parametros) {
        $resultado = array();
        try {
            $parametros['idusuario'] = $this->sesion->get('idusuario');
            $parametros['idempresa'] = $this->sesion->get('idempresa');
            $resultado['mediospagosLogin'] = $this->registroUsuarioModel->getMedioPagos($parametros);
            $parametros['idusuario'] = $parametros['idusuarioasignar'];
            $resultado['mediospagosAsignar'] = $this->registroUsuarioModel->getMedioPagos($parametros);
            if (empty($resultado))
                throw new MyException("No se encontraron medios de pagos ", 0);
            return($resultado);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function buscaRutas($parametros) {
        $resultado = array();
        try {
            $parametros['idusuario'] = $this->sesion->get('idusuario');
            $parametros['idempresa'] = $this->sesion->get('idempresa');
            $resultado['rutasLogin'] = $this->registroUsuarioModel->buscaRutas($parametros);
            $parametros['idusuario'] = $parametros['idusuarioasignar'];
            $resultado['rutasAsignar'] = $this->registroUsuarioModel->buscaRutas($parametros);
            if (empty($resultado))
                throw new MyException("No se encontraron rutas asignadas ", 0);
            return($resultado);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function buscaProyectosUsuarioPrograma($parametros) {
        $resultado = array();
        try {
            $parametros['idusuario'] = $this->sesion->get('idusuario');
            $parametros['idempresa'] = $this->sesion->get('idempresa');
            $resultado['proyectosLogin'] = $this->registroUsuarioModel->getProyectosUsuarioPrograma($parametros);
            $parametros['idusuario'] = $parametros['idusuarioasignar'];
            $resultado['proyectosAsignar'] = $this->registroUsuarioModel->getProyectosUsuarioPrograma($parametros);
            if (empty($resultado))
                throw new MyException("No hay Unidades para el programa estructura seleccionada ", 0);
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

    public function grabarUsuario($data) {
        try {
            $this->conexion->beginTransaction();
            $data['idusuariologin'] = $this->sesion->get('idusuario');
            if (!empty($data['unidadeseliminadas'])) {
                $this->administraUnidadesUsuarioEliminar($data['unidadeseliminadas'], $data['idusuarioasignar']);
            }
            if (!empty($data['proyectoseliminados'])) {
                $this->administraProyectosUsuarioEliminar($data['proyectoseliminados'], $data['idusuarioasignar']);
            }
            if (!empty($data['mediospagoeliminar'])) {
                $this->administraMediosPagoEliminar($data['mediospagoeliminar'], $data['idusuarioasignar']);
            }
            if (!empty($data['rutaseliminar'])) {
                $this->administraRutasEliminar($data['rutaseliminar'], $data['idusuarioasignar']);
            }
            if (!empty($data['unidadesnuevas'])) {
                $this->administraUnidadesUsuarioNuevas($data['unidadesnuevas'], $data['idusuarioasignar'], $data['idusuariologin']);
            }
            if (!empty($data['proyectosnuevos'])) {
                $this->administraProyectosUsuarioNuevas($data['proyectosnuevos'], $data['idusuarioasignar'], $data['idusuariologin']);
            }
            if (!empty($data['mediospagonuevos'])) {
                $this->administraMediosPagoNuevos($data['mediospagonuevos'], $data['idusuarioasignar'], $data['idusuariologin']);
            }
            if (!empty($data['rutasnuevas'])) {
                $this->administraRutasNuevas($data['rutasnuevas'], $data['idusuarioasignar'], $data['idusuariologin']);
            }
            $this->conexion->commit();
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException($e->getMessage(), $e->getCode());
        }
    }

    public function administraUnidadesUsuarioNuevas($unidadesnuevas, $ideUsuario, $idusuariologin) {
        $parametros['idusuario'] = $ideUsuario;
        $parametros['idusuariologin'] = $idusuariologin;
        for ($i = 0; $i < count($unidadesnuevas); $i++) {
            for ($j = 0; $j < count($unidadesnuevas[$i]); $j++) {
                $ideprun = $unidadesnuevas[$i][$j]['ideprun'];
                $parametros['ideprun'] = $ideprun;
                $resultado = $this->registroUsuarioModel->buscaUsuarioProgramauUnidad($parametros);
                if (empty($resultado)) {
                    $this->registroUsuarioModel->guardaUSPU($parametros);
                }
            }
        }
    }

    public function administraUnidadesUsuarioEliminar($unidadesEliminar, $ideUsuario) {
        $parametros['idusuario'] = $ideUsuario;
        for ($i = 0; $i < count($unidadesEliminar); $i++) {
            for ($j = 0; $j < count($unidadesEliminar[$i]); $j++) {
                $ideprun = $unidadesEliminar[$i][$j]['ideprun'];
                $parametros['ideprun'] = $ideprun;
                $resultado = $this->registroUsuarioModel->buscaUsuarioProgramauUnidad($parametros);
                if (!empty($resultado)) {
                    $this->registroUsuarioModel->eliminaUSPU($parametros);
                }
            }
        }
    }

    public function administraProyectosUsuarioNuevas($proyectosnuevas, $ideUsuario, $idusuariologin) {
        $parametros['idusuario'] = $ideUsuario;
        $parametros['idusuariologin'] = $idusuariologin;
        for ($i = 0; $i < count($proyectosnuevas); $i++) {
            for ($j = 0; $j < count($proyectosnuevas[$i]); $j++) {
                $ideproyecto = $proyectosnuevas[$i][$j]['ideproyecto'];
                $ideprograma = $proyectosnuevas[$i][$j]['ideprograma'];
                $parametros['ideprograma'] = $ideprograma;
                $parametros['ideproyecto'] = $ideproyecto;
                $resultado = $this->registroUsuarioModel->buscaProyectoUsuarioPrograma($parametros);
                if (empty($resultado)) {
                    $this->registroUsuarioModel->guardaUSPR($parametros);
                }
            }
        }
    }

    public function administraProyectosUsuarioEliminar($proyectosEliminar, $ideUsuario) {
        $parametros['idusuario'] = $ideUsuario;
        for ($i = 0; $i < count($proyectosEliminar); $i++) {
            for ($j = 0; $j < count($proyectosEliminar[$i]); $j++) {
                $ideproyecto = $proyectosEliminar[$i][$j]['ideproyecto'];
                $ideprograma = $proyectosEliminar[$i][$j]['ideprograma'];
                $parametros['ideprograma'] = $ideprograma;
                $parametros['ideproyecto'] = $ideproyecto;
                $resultado = $this->registroUsuarioModel->buscaProyectoUsuarioPrograma($parametros);
                if (!empty($resultado)) {
                    $this->registroUsuarioModel->eliminaUSPR($parametros);
                }
            }
        }
    }

    public function administraMediosPagoNuevos($mediospagonuevas, $ideUsuario, $idusuariologin) {
        $parametros['idusuario'] = $ideUsuario;
        $parametros['idusuariologin'] = $idusuariologin;
        for ($i = 0; $i < count($mediospagonuevas); $i++) {
            $idemediopago = $mediospagonuevas[$i]['idemediopago'];
            $parametros['idemediopago'] = $idemediopago;
            $resultado = $this->registroUsuarioModel->buscaMedioPago($parametros);
            if (empty($resultado)) {
                $this->registroUsuarioModel->guardaMedioPago($parametros);
            }
        }
    }

    public function administraMediosPagoEliminar($mediospagoEliminar, $ideUsuario) {
        $parametros['idusuario'] = $ideUsuario;
        for ($i = 0; $i < count($mediospagoEliminar); $i++) {
            $idemediopago = $mediospagoEliminar[$i]['idemediopago'];
            $parametros['idemediopago'] = $idemediopago;
            $resultado = $this->registroUsuarioModel->buscaMedioPago($parametros);
            if (!empty($resultado)) {
                $this->registroUsuarioModel->eliminaMedioPago($parametros);
            }
        }
    }

    public function administraRutasNuevas($rutasnuevas, $ideUsuario, $idusuariologin) {
        $parametros['idusuario'] = $ideUsuario;
        $parametros['idusuariologin'] = $idusuariologin;
        for ($i = 0; $i < count($rutasnuevas); $i++) {
            $ideruta = $rutasnuevas[$i]['ideruta'];
            $parametros['ideruta'] = $ideruta;
            $resultado = $this->registroUsuarioModel->getRutaUsuario($parametros);
            if (empty($resultado)) {
                $this->registroUsuarioModel->guardaRutas($parametros);
            }
        }
    }

    public function administraRutasEliminar($rutaseliminar, $ideUsuario) {
        $parametros['idusuario'] = $ideUsuario;
        for ($i = 0; $i < count($rutaseliminar); $i++) {
            $ideruta = $rutaseliminar[$i]['ideruta'];
            $parametros['ideruta'] = $ideruta;
            $resultado = $this->registroUsuarioModel->getRutaUsuario($parametros);
            if (!empty($resultado)) {
                $this->registroUsuarioModel->eliminaRutas($parametros);
            }
        }
    }

    public function grabarPermisoUsuario($parametros) {
        try {
            $this->conexion->beginTransaction();
                $parametros['idusuario'] = $this->sesion->get('idusuario');
                $parametros['idempresa'] = $this->sesion->get('idempresa');
                $resultadoRutas = $this->registroUsuarioModel->buscaRutasUsuarioDestino($parametros);
                if (!empty($resultadoRutas)) {
                    $this->registroUsuarioModel->insertaRutasUsuarioDestino($parametros);
                }
                $resultadoMediosPagos = $this->registroUsuarioModel->buscaMediosPagosUsuarioDestino($parametros);
                if (!empty($resultadoMediosPagos)) {
                    $this->registroUsuarioModel->insertaMediosPagosUsuarioDestino($parametros);
                }
                $resultadoUnidades = $this->registroUsuarioModel->buscaUnidadesUsuarioDestino($parametros);
                if (!empty($resultadoUnidades)) {
                    $this->registroUsuarioModel->insertaUnidadesUsuarioDestino($parametros);
                }
                $resultadoProyectos = $this->registroUsuarioModel->buscaProyectosUsuarioDestino($parametros);
                if (!empty($resultadoProyectos)) {
                    $this->registroUsuarioModel->insertaProyectosUsuarioDestino($parametros);
                }
                $this->registroUsuarioModel->insertaProgramasUsuarioDestino($parametros);
            $this->conexion->commit();            
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }
    public function eliminaPermisoUsuario($usuarioDestino, $idPerfil) {
        try {
            $this->conexion->beginTransaction();
                $resultadoRutas = $this->registroUsuarioModel->eliminaRutasTotal($usuarioDestino);                
                $resultadoMediosPagos = $this->registroUsuarioModel->eliminaMedioPagoTotal($usuarioDestino);                
                $resultadoUnidades = $this->registroUsuarioModel->eliminaUSPUTotal($usuarioDestino);
                $resultadoProyectos = $this->registroUsuarioModel->eliminaUSPRTotal($usuarioDestino);                
                $resultadoProgramas = $this->registroUsuarioModel->eliminaProgramasPerfilTotal($idPerfil);                
            $this->conexion->commit();            
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

}
