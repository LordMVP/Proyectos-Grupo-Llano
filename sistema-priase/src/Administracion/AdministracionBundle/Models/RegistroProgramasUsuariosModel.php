<?php

namespace Administracion\AdministracionBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Utiles\DateUtil;

class RegistroProgramasUsuariosModel extends AuditoriaServices {
    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */

    /**
     * Sesión del usuario
     * @var SessionInterface
     */
    private $sesion;

    public function __construct(&$conexion = null, &$sesion) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
    }

    public function consultarUsuarios(array $parametros) {
        $respuesta = array();
        $complemento = "";
        if (!empty($parametros['nombre']) && $parametros['nombre'] != "") {
            $complemento .= "  or usuario_nom ilike'%" . $parametros['nombre'] . "%' ";
        }
        if (!empty($parametros['idedocumento']) && $parametros['idedocumento'] != "") {
            $complemento .= "  or usuario_nit = :idedocumento ";
        }
        $sql = "select usu.usuario_nit  nit , usu.usuario_nom nombrecolaborador , usu.usu_ideregistro ideusuario,
                        usu.usu_login usulogin, usu.usu_modrecexterno externo, usu.usu_topfinancia topefinan,
                        usem.usu_ideregistro usem, pfi.pfi_nombre nombreperfil, pfi.pfi_ideregistro ideperfil, 
                        emp.empresa_nom empresa, emp.empresa_sevemp ideempresa, emp.empresa_codemp
                from 		usuarios usu 
                LEFT JOIN		usem_usuempresa usem on usem.usu_ideregistro = usu.usu_ideregistro  and usem.emp_ideregistro =:empresa
                LEFT JOIN 		empresas emp on emp.empresa_sevemp = usem.emp_ideregistro and emp.empresa_sevemp = :empresa
                LEFT JOIN		pfi_perfil pfi  on pfi.pfi_ideregistro = usem.pfi_ideregistro
                where           (1<>1 " . $complemento . ") and  usu.usuario_swtact = true  order by usu.usuario_nom";
        $respuesta['usuarios'] = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException("No se encontró el Colaborador. ", -1);
        }
        $sqlPerfil = "select pfi_ideregistro ideperfil, pfi_nombre perfilnombre from pfi_perfil ";
        $respuesta['perfiles'] = $this->executeQuery($sqlPerfil);
        return $respuesta;
    }

    public function GrabaPerfilEmpresa($data) {
        $data['estado'] = 'A';
        $parametros = array();
        try {
            $this->setCampo($data, $parametros, 'perfil', 'pfi_nombre');
            $this->setCampo($data, $parametros, 'estado', 'pfi_estado');
            $this->setCampo($data, $parametros, 'idusuario', 'usu_ideregistro');
            return $this->insertar($parametros, "pfi_perfil", "sq_pfi_ideregistro");
        } catch (\Exception $ex) {
            throw new MyException('Error insertando el Perfil ', -1);
        }
    }

    public function autorizaUsuario($data) {
        $parametros = array();
        try {
            $this->setCampo($data, $parametros, 'ideperfilNuevo', 'pfi_ideregistro');
            $this->setCampo($data, $parametros, 'idempresa', 'emp_ideregistro');
            $this->setCampo($data, $parametros, 'idcolaborador', 'usu_ideregistro');
            $this->setCampo($data, $parametros, 'idusuario', 'usu_auditoria');

            $query = $this->construyeSQL("INSERT", "usem_usuempresa", $parametros);
            $this->setSql($query);
            $this->setParams($parametros);
            $this->executeUpdate();
            if ($this->getnumFilas() == 0) {
                throw new MyException('Error al autorizar el Colaborador');
            }
        } catch (\Exception $ex) {
            throw new MyException('Error autorizando el perfil usem ', -1);
        }
    }

    public function getMenus(array $parametros) {

        $sql = "select opcPadre.opc_ideregistro ideopc, opcPadre.opc_nombre nombre 
                from opc_opcion opcPadre 
                where opcPadre.opc_idepadre is null and opcPadre.opc_ideregistro not in (540) ;";
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException("No se encontraron programas. ", -1);
        }
        return $respuesta;
    }

    public function getOpcionesMenus(array $parametros) {

        $sql = "select opcPadre.opc_ideregistro ideopc, opcPadre.opc_nombre nombre  
                from opc_opcion opcPadre 
                where  	opcPadre.opc_idepadre = :idpadremenu";
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException("No se encontraron opciones de Menú ", -1);
        }
        return $respuesta;
    }

    public function getProgramasUsuario(array $parametros) {
        $sql = "select  DISTINCT opc.opc_ideregistro ideopc, opc.opc_nombre nombre, opc.prg_ideregistro ideprograma, oppf.pfi_ideregistro  ideperfil
                from opc_opcion opc
                INNER JOIN		oppf_opcperfil oppf on oppf.prg_ideregistro  = opc.prg_ideregistro 
                INNER JOIN		usem_usuempresa usem on usem.pfi_ideregistro = oppf.pfi_ideregistro  and usem.emp_ideregistro = :empresa and usem.usu_ideregistro = :idusuario
                where  	opc.opc_idepadre = :ideopcionesmenu
                UNION
                select  DISTINCT  opchijo.opc_ideregistro ideopc, opchijo.opc_nombre nombre, opchijo.prg_ideregistro ideprograma, oppf.pfi_ideregistro  ideperfil
                from opc_opcion opc
                INNER	JOIN		opc_opcion opchijo   on  opchijo.opc_idepadre = opc.opc_ideregistro
                INNER JOIN		oppf_opcperfil oppf on oppf.prg_ideregistro  = opchijo.prg_ideregistro 
                INNER JOIN		usem_usuempresa usem on usem.pfi_ideregistro = oppf.pfi_ideregistro  and usem.emp_ideregistro = :empresa and usem.usu_ideregistro = :idusuario
                where  	opc.opc_idepadre = :ideopcionesmenu";
        return $this->executeQuery($sql, $parametros);
    }
    public function getTodosProgramasUsuario(array $parametros) {
        $sql = "select  DISTINCT opc.opc_ideregistro ideopc, opc.opc_nombre nombre, opc.prg_ideregistro ideprograma, oppf.pfi_ideregistro  ideperfil
                from opc_opcion opc
                INNER JOIN		oppf_opcperfil oppf on oppf.prg_ideregistro  = opc.prg_ideregistro 
                INNER JOIN		usem_usuempresa usem on usem.pfi_ideregistro = oppf.pfi_ideregistro  and usem.emp_ideregistro = :empresa and usem.usu_ideregistro = :idusuario
                where  	opc.opc_idepadre IN (
                                    SELECT 	opcPadre.opc_ideregistro ideopc  
                                            from 	opc_opcion opcPadre 
                                     where 	opcPadre.opc_idepadre = :ideopcionesmenu) 
                UNION
                select  DISTINCT  opchijo.opc_ideregistro ideopc, opchijo.opc_nombre nombre, opchijo.prg_ideregistro ideprograma, oppf.pfi_ideregistro  ideperfil
                from opc_opcion opc
                INNER	JOIN		opc_opcion opchijo   on  opchijo.opc_idepadre = opc.opc_ideregistro
                INNER JOIN		oppf_opcperfil oppf on oppf.prg_ideregistro  = opchijo.prg_ideregistro 
                INNER JOIN		usem_usuempresa usem on usem.pfi_ideregistro = oppf.pfi_ideregistro  and usem.emp_ideregistro = :empresa and usem.usu_ideregistro = :idusuario
                where  	opc.opc_idepadre IN (
                                    SELECT 	opcPadre.opc_ideregistro ideopc  
                                            from 	opc_opcion opcPadre 
                                     where 	opcPadre.opc_idepadre = :ideopcionesmenu) ";
        return $this->executeQuery($sql, $parametros);
    }

    public function getLoginUsuario($parametros) {
        $sql = "SELECT *  FROM usuarios WHERE usu_login = :idusuariocorreo";
        return $this->executeQuery($sql, $parametros);
    }

    public function getPerfiles(array $parametros ) {
        $sql = "select distinct  onperfiles.ideperfil, onperfiles.perfilnombre perfilnombre
		from pfi_perfil   pfi
		INNER JOIN  usem_usuempresa usem on usem.pfi_ideregistro = pfi.pfi_ideregistro and usem.emp_ideregistro = :idempresa
		INNER JOIN  oppf_opcperfil oppf  on oppf.pfi_ideregistro = pfi.pfi_ideregistro
		INNER JOIN  (
                            SELECT              oppfperfil.opc_ideregistro ideopc, pfiperfil.pfi_ideregistro ideperfil, pfiperfil.pfi_nombre perfilnombre
                            FROM	 	oppf_opcperfil oppfperfil
                            INNER JOIN          pfi_perfil pfiperfil on pfiperfil.pfi_ideregistro = oppfperfil.pfi_ideregistro						
                            INNER JOIN  	usem_usuempresa usemall on usemall.pfi_ideregistro = pfiperfil.pfi_ideregistro and usemall.emp_ideregistro = :idempresa
                            
						
		) as onperfiles on onperfiles.ideopc = oppf.opc_ideregistro  
		WHERE		usem.usu_ideregistro = :idusuario
		AND
		(select count(*) from oppf_opcperfil where pfi_ideregistro = onperfiles.ideperfil and opc_ideregistro not in (select opc_ideregistro from oppf_opcperfil where pfi_ideregistro = pfi.pfi_ideregistro)) = 0
            UNION 		
		select distinct  onperfiles.ideperfil, onperfiles.perfilnombre
		from pfi_perfil   pfi
		Inner JOIN  usem_usuempresa usem on usem.pfi_ideregistro = pfi.pfi_ideregistro and usem.emp_ideregistro = :idempresa
		INNER JOIN  oppf_opcperfil oppf  on oppf.pfi_ideregistro = pfi.pfi_ideregistro
		INNER JOIN  (
                            SELECT              oppfperfil.opc_ideregistro ideopc, pfiperfil.pfi_ideregistro ideperfil, pfiperfil.pfi_nombre perfilnombre
                            FROM	 	oppf_opcperfil oppfperfil
                            INNER JOIN          pfi_perfil pfiperfil on pfiperfil.pfi_ideregistro = oppfperfil.pfi_ideregistro					
                      			
		) as onperfiles on onperfiles.ideopc = oppf.opc_ideregistro  
		WHERE		usem.usu_ideregistro = :idusuario
		AND
		(select count(*) from oppf_opcperfil where pfi_ideregistro = onperfiles.ideperfil and opc_ideregistro not in (select opc_ideregistro from oppf_opcperfil where pfi_ideregistro = pfi.pfi_ideregistro)) = 0
		
		AND onperfiles.ideperfil not in (select distinct  onperfiles.ideperfil
				from pfi_perfil   pfi
				LEFT JOIN  usem_usuempresa usem on usem.pfi_ideregistro = pfi.pfi_ideregistro and usem.emp_ideregistro = :idempresa
				INNER JOIN  oppf_opcperfil oppf  on oppf.pfi_ideregistro = pfi.pfi_ideregistro
                                INNER JOIN  (
                                        SELECT              oppfperfil.opc_ideregistro ideopc, pfiperfil.pfi_ideregistro ideperfil, pfiperfil.pfi_nombre perfilnombre
                                        FROM	 	oppf_opcperfil oppfperfil
                                        INNER JOIN          pfi_perfil pfiperfil on pfiperfil.pfi_ideregistro = oppfperfil.pfi_ideregistro						
                                        INNER JOIN  	usem_usuempresa usemall on usemall.pfi_ideregistro = pfiperfil.pfi_ideregistro and usemall.emp_ideregistro <> :idempresa
																
								
				) as onperfiles on onperfiles.ideopc = oppf.opc_ideregistro  
				WHERE		usem.usu_ideregistro = :idusuario
				AND
				(select count(*) from oppf_opcperfil where pfi_ideregistro = onperfiles.ideperfil and opc_ideregistro not in (select opc_ideregistro from oppf_opcperfil where pfi_ideregistro = pfi.pfi_ideregistro)) = 0) 	
ORDER BY  perfilnombre";
        return $this->executeQuery($sql, $parametros);
    }

    public function getDataUsuario($parametros) {
        $sql = "SELECT *  FROM usuarios WHERE usuario_nit = :idusuarionit";
        return $this->executeQuery($sql, $parametros);
    }

    public function getEmpresaCodigo($ideEmpresa) {
        $sql = "SELECT empresa_cod empresacod FROM empresas WHERE empresa_sevemp = $ideEmpresa";
        return $this->executeQuery($sql)[0];
    }

    public function getOppfPerfil($ideopc, $idePerfil) {
        $parametros = array();
        $parametros['ideopc'] = $ideopc;
        $parametros['ideperfil'] = $idePerfil;
        $sql = "select * from oppf_opcperfil  where opc_ideregistro = :ideopc	and pfi_ideregistro = :ideperfil";
        return $this->executeQuery($sql, $parametros);
    }

    public function insertarColaborador($data) {
        $parametros = array();
        $data['swtact'] = 't';
        try {
            $this->setCampo($data, $parametros, 'idusuarionit', 'usuario_nit');
            $this->setCampo($data, $parametros, 'nombreUsuario', 'usuario_nom');
            $this->setCampo($data, $parametros, 'password', 'usuario_pas');
            $this->setCampo($data, $parametros, 'empresacod', 'usuario_codemp');
            $this->setCampo($data, $parametros, 'swtact', 'usuario_swtact');
            $this->setCampo($data, $parametros, 'topeFinanciar', 'usu_topfinancia');
            $this->setCampo($data, $parametros, 'correo', 'usu_login');

            $query = $this->construyeSQL("INSERT", "usuarios", $parametros);
            $this->setSql($query);
            $this->setParams($parametros);
            $this->setsecuencia('sq_usu_ideregistro');
            $this->executeUpdate();
            if ($this->getnumFilas() == 0) {
                throw new MyException('Error al insertar el Colaborador');
            }
            $idUsuario = $this->getlastId();
            return $idUsuario;
        } catch (\Exception $ex) {
            throw new MyException('Error al grabar el Colaborador ', -1);
        }
    }

    public function insertarOppfPerfil($data) {
        $parametros = array();
        try {
            $this->setCampo($data, $parametros, 'ideperfilNuevo', 'pfi_ideregistro');
            $this->setCampo($data, $parametros, 'ideopc', 'opc_ideregistro');
            $this->setCampo($data, $parametros, 'ideprograma', 'prg_ideregistro');
            $this->setCampo($data, $parametros, 'idusuario', 'usu_ideregistro');
            return $this->insertar($parametros, "oppf_opcperfil", "sq_oppf_ideregistr");
        } catch (\Exception $ex) {
            throw new MyException('Error al grabar el programa al perfil oppf', -1);
        }
    }

    public function eliminaOppfPerfil($ideOpc, $idePerfil) {
        try {
            $condicion = " opc_ideregistro = " . $ideOpc . "  and pfi_ideregistro = " . $idePerfil;
            return $this->eliminar('oppf_opcperfil', $condicion);
        } catch (\Exception $ex) {
            throw new MyException('Error eliminando programa del perfil" ', -1);
        }
    }

    public function actualizaUsuario($dataUsuario) {
        try {
            $condicion = " usu_ideregistro = " . $dataUsuario['usu_ideregistro'];
            $query = $this->construyeSQL('UPDATE', 'usuarios', $dataUsuario, $condicion);
            $this->setSql($query);
            $this->setParams($dataUsuario);
            $this->executeUpdate();
        } catch (\Exception $ex) {
            throw new MyException('Error Actualizando los datos del Colaborador"  ', -1);
        }
    }

    public function actualizaPerfilEmpresa($ideEmpresa, $idePerfilActual, $ideusuario, $idePerfilNuevo, $idusuarioLogin) {
        $dataPefil = array();
        try {
            $dataPefil['usu_ideregistro'] = $ideusuario;
            $dataPefil['usu_auditoria'] = $idusuarioLogin;
            $dataPefil['emp_ideregistro'] = $ideEmpresa;
            $dataPefil['pfi_ideregistro'] = $idePerfilNuevo;
            $condicion = " usu_ideregistro = " . $ideusuario . " and emp_ideregistro = " . $ideEmpresa . " and pfi_ideregistro = " . $idePerfilActual;
            $query = $this->construyeSQL('UPDATE', 'usem_usuempresa', $dataPefil, $condicion);
            $this->setSql($query);
            $this->setParams($dataPefil);
            $this->executeUpdate();
        } catch (\Exception $ex) {
            throw new MyException('Error Actualizando los datos del Colaborador"  ', -1);
        }
    }

}
