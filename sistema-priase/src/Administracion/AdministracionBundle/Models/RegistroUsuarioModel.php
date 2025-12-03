<?php

namespace Administracion\AdministracionBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Utiles\DateUtil;

class RegistroUsuarioModel extends AuditoriaServices {
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
                        emp.empresa_nom empresa, emp.empresa_sevemp ideempresa, emp.empresa_cod
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
    public function getUsuariosSegunUnidades(array $parametros) {
        $respuesta = array();
        $complemento = "";
        if (!empty($parametros['nombre']) && $parametros['nombre'] != "") {
            $complemento .= "  or usuario_nom ilike'%" . $parametros['nombre'] . "%' ";
        }
        if (!empty($parametros['idedocumento']) && $parametros['idedocumento'] != "") {
            $complemento .= "  or usuario_nit = :idedocumento ";
        }
        $sql = "select DISTINCT usu.usuario_nit  nit , usu.usuario_nom nombrecolaborador , usu.usu_ideregistro ideusuario,
                        usu.usu_login usulogin
                from 		usuarios usu 
                INNER JOIN		usem_usuempresa usem on usem.usu_ideregistro = usu.usu_ideregistro  and usem.emp_ideregistro =:empresa
                INNER JOIN		uspu_usuprgunid uspu on uspu.usu_ideregistro = usu.usu_ideregistro 
                where           (1<>1 " . $complemento . ") and  usu.usuario_swtact = true  order by usu.usuario_nom";
        $respuesta['usuarios'] = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException("No se encontró el Usuario. ", -1);
        }
        return $respuesta;
    }

    public function GrabaPerfilEmpresa($data) {
        $data['estado'] = 'A';
        $parametros = array();
        try {
            $this->setCampo($data, $parametros, 'idcolaborador', 'pfi_nombre');
            $this->setCampo($data, $parametros, 'estado', 'pfi_estado');
            $this->setCampo($data, $parametros, 'usuario', 'usu_ideregistro');
            return $this->conexion->insert("pfi_perfil", $parametros, "sq_pfi_ideregistro");
        } catch (\Exception $ex) {
            throw new MyException('Error insertando el Perfil ', -1);
        }
    }

    public function autorizaUsuario($data) {
        $data['estado'] = 'A';
        $parametros = array();
        try {
            $this->setCampo($data, $parametros, 'ideperfil', 'pfi_ideregistro');
            $this->setCampo($data, $parametros, 'empresa', 'emp_ideregistro');
            $this->setCampo($data, $parametros, 'idcolaborador', 'usu_ideregistro');
            $this->setCampo($data, $parametros, 'usuario', 'usu_auditoria');
            return $this->conexion->insert("usem_usuempresa", $parametros);
        } catch (\Exception $ex) {
            throw new MyException('Error insertando el Perfil ', -1);
        }
    }
    public function buscaAutorizaUsuario($parametros) {
        
         $sql = "select * from usem_usuempresa WHERE usu_ideregistro = :idcolaborador and emp_ideregistro = :empresa";
        $respuesta = $this->executeQuery($sql, $parametros);
        if (!empty($respuesta)) {
            throw new MyException("Usuario seleccionado ya tiene autorizado un perfil, Por favor actualizar el perfil", -1);
        }
    }

    public function buscaProgramasUsuarioAsignar(array $parametros) {

        $sql = "select DISTINCT opc.opc_ideregistro ideopcion ,opc.prg_ideregistro ideprograma, opc.opc_nombre programa, opc.opc_idepadre
                from 			opc_opcion opc 
                INNER JOIN		oppf_opcperfil oppf ON	oppf.opc_ideregistro = opc.opc_ideregistro
                INNER JOIN		usem_usuempresa usem  ON 	usem.pfi_ideregistro = oppf.pfi_ideregistro and usem.emp_ideregistro = :empresa
                INNER JOIN		prun_prgunidad prun ON prun.prg_ideregistro = opc.prg_ideregistro
                where 			usem.usu_ideregistro = :idusuarioasignar
                ORDER BY 		opc.opc_idepadre";
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException("No se encontraron programas. ", -1);
        }

        return $respuesta;
    }
    public function buscaProgramasUsuarioAsignarProyecto(array $parametros) {

        $sql = "select DISTINCT opc.opc_ideregistro ideopcion ,opc.prg_ideregistro ideprograma, opc.opc_nombre programa, opc.opc_idepadre
                from 			opc_opcion opc 
                INNER JOIN		oppf_opcperfil oppf ON	oppf.opc_ideregistro = opc.opc_ideregistro
                INNER JOIN		usem_usuempresa usem  ON 	usem.pfi_ideregistro = oppf.pfi_ideregistro and usem.emp_ideregistro = :empresa
                INNER JOIN		uspr_usuprgpryto uspr ON uspr.prg_ideregistro = opc.prg_ideregistro
                where 			usem.usu_ideregistro = :idusuarioasignar
                ORDER BY 		opc.opc_idepadre";
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException("No se encontraron programas. ", -1);
        }

        return $respuesta;
    }

    public function buscaEstructuraProgramaUsuario($parametros) {

        $sql = "SELECT  
                DISTINCT            prun.prg_ideregistro ideprograma, est.est_ideregistro ideestructura, est.est_nombre nombre
                    FROM            prun_prgunidad prun 
                INNER JOIN          uspu_usuprgunid uspu on uspu.prun_ideregistr = prun.prun_ideregistr and uspu.usu_ideregistro = :idusuariologin
                INNER JOIN          uni_unidad uni on uni.uni_ideregistro = prun.uni_ideregistro
                INNER JOIN          est_estructura est on est.est_ideregistro = uni.est_ideregistro
                INNER JOIN          esem_estempresa esem  on esem.est_ideregistro = est.est_ideregistro AND esem.emp_ideregistro = :idempresa
                     WHERE          prg_ideregistro = :idprograma
                ORDER BY 		est.est_nombre";
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException("No hay Estructuras para el programa seleccionado. ", 0);
        }

        return $respuesta;
    }

    public function buscaUnidadesProgramaUsuario($parametros) {

        $sql = "select     DISTINCT     prun.prun_ideregistr ideprun, uni.uni_nombre1 nombreunidad, uni.uni_ideregistro ideunidad, prun.prg_ideregistro ideprograma
			from 		uni_unidad uni 
                INNER JOIN		est_estructura est on est.est_ideregistro = uni.est_ideregistro
                INNER JOIN		esem_estempresa esem on esem.est_ideregistro = est.est_ideregistro and esem.emp_ideregistro = :idempresa
                INNER JOIN		prun_prgunidad prun on prun.uni_ideregistro = uni.uni_ideregistro and prun.prg_ideregistro = :idprograma
                INNER JOIN		uspu_usuprgunid uspu on uspu.prun_ideregistr = prun.prun_ideregistr  and uspu.usu_ideregistro = :idusuario
                    WHERE		est.est_ideregistro = :idestructura
                ORDER BY		uni.uni_nombre1";
        return $this->executeQuery($sql, $parametros);
    }
    public function getAllUnidades($parametros) {
        $sql = "select     DISTINCT     prun.prun_ideregistr ideprun, uni.uni_nombre1 nombreunidad, uni.uni_ideregistro ideunidad, prun.prg_ideregistro ideprograma
			from 		uni_unidad uni 
                INNER JOIN		est_estructura est on est.est_ideregistro = uni.est_ideregistro
                INNER JOIN		esem_estempresa esem on esem.est_ideregistro = est.est_ideregistro and esem.emp_ideregistro = :idempresa
                INNER JOIN		prun_prgunidad prun on prun.uni_ideregistro = uni.uni_ideregistro and prun.prg_ideregistro = :idprograma
                INNER JOIN		uspu_usuprgunid uspu on uspu.prun_ideregistr = prun.prun_ideregistr  and uspu.usu_ideregistro = :idusuario
                ORDER BY		uni.uni_nombre1";
        return $this->executeQuery($sql, $parametros);
    }
    
    public function getMedioPagos($parametros) {

        $sql = "select mpa.uni_medpago idemediopago, mpa.mpa_nombre nombreunidad, uni.uni_ideregistro ideunidad 
                from mpa_medpago  mpa 
                INNER JOIN	usmp_usumedpago	usmp 	ON 	usmp.uni_medpago = mpa.uni_medpago
                INNER JOIN	uni_unidad uni		ON	uni.uni_ideregistro = mpa.uni_medpago
                INNER JOIN	esem_estempresa	esem	ON 	esem.est_ideregistro = uni.est_ideregistro and esem.emp_ideregistro =:idempresa
                where 		usmp.usu_ideregistro = :idusuario  ORDER BY  mpa.mpa_nombre;
                ";
        return $this->executeQuery($sql, $parametros);
    }
        public function buscaRutas($parametros) {

        $sql = "select rut.rut_ideregistro ideruta, rut.rut_nombre nombre 
                from rut_ruta rut 
                INNER JOIN		ruem_rutempresa ruem ON	ruem.rut_ideregistro = rut.rut_ideregistro and ruem.emp_ideregistro = :idempresa
                INNER JOIN		usru_usuruta usru  ON usru.rut_ideregistro = rut.rut_ideregistro
                WHERE 				usru.usu_ideregistro = :idusuario ORDER BY rut.rut_nombre";
        return $this->executeQuery($sql, $parametros);
    }
    
    public function getProyectosUsuarioPrograma($parametros){
        $sql="SELECT uspr.prg_ideregistro ideprograma, uspr.uni_municipio ideproyecto,  proy.proyecto_nom nombreproyecto
                from uspr_usuprgpryto uspr 
                INNER JOIN		proyectos	 	proy  ON proy.proyecto_ideregistro = uspr.uni_municipio
                WHERE uspr.usu_ideregistro = :idusuario and uspr.prg_ideregistro = :idprograma
                ORDER BY 	proy.proyecto_nom";
        return  $this->executeQuery($sql, $parametros);
    }
    
    public function getLoginUsuario($parametros){
        $sql="SELECT *  FROM usuarios WHERE usu_login = :idusuariocorreo";
        return  $this->executeQuery($sql, $parametros);
    }
    
    public function buscaUsuarioProgramauUnidad($parametros){       
        $sql="select * from uspu_usuprgunid where usu_ideregistro = :idusuario and prun_ideregistr =:ideprun ";
        return  $this->executeQuery($sql, $parametros);
    }
    
    public function buscaProyectoUsuarioPrograma($parametros){       
        $sql="select * from uspr_usuprgpryto   where uni_municipio = :ideproyecto and prg_ideregistro = :ideprograma and usu_ideregistro = :idusuario";
        return  $this->executeQuery($sql, $parametros);
    }
    public function buscaMedioPago($parametros){       
        $sql="select * from usmp_usumedpago  where uni_medpago = :idemediopago and usu_ideregistro = :idusuario";
        return  $this->executeQuery($sql, $parametros);
    }
    public function getRutaUsuario($parametros){       
        $sql="select * from usru_usuruta where rut_ideregistro = :ideruta and  usu_ideregistro = :idusuario";
        return  $this->executeQuery($sql, $parametros);
    }
    
    public function guardaUSPU($datauspu) {
        $parametros = array();
        try {
            $this->setCampo($datauspu, $parametros, 'ideprun', 'prun_ideregistr');
            $this->setCampo($datauspu, $parametros, 'idusuario', 'usu_ideregistro');
            $this->setCampo($datauspu, $parametros, 'idusuariologin', 'usu_auditoria');
            return $this->insertar($parametros, 'uspu_usuprgunid', 'sq_uspu_ideregistr');
        } catch (\Exception $ex) {
            throw new MyException('Error creando permiso usuario programa unidad "USPU" ', -1);
        }
    }
    public function eliminaUSPU($datauspu) {
        
        try {
            $condicion = " prun_ideregistr = " . $datauspu['ideprun']. "  and usu_ideregistro = " .$datauspu['idusuario'];
            return $this->eliminar('uspu_usuprgunid', $condicion);
        } catch (\Exception $ex) {
            throw new MyException('Error eliminando usuario programa unidad "USPU" ', -1);
        }
    }
    public function eliminaUSPUTotal($usuarioDestino) {
        
        try {
            $condicion = " usu_ideregistro = " .$usuarioDestino;
            return $this->eliminar('uspu_usuprgunid', $condicion);
        } catch (\Exception $ex) {
            throw new MyException('Error eliminando usuario programa unidad "USPU Total" ', -1);
        }
    }
    
    public function guardaUSPR($datauspr) {
        $parametros = array();
        try {
            $this->setCampo($datauspr, $parametros, 'ideprograma', 'prg_ideregistro');
            $this->setCampo($datauspr, $parametros, 'ideproyecto', 'uni_municipio');
            $this->setCampo($datauspr, $parametros, 'idusuario', 'usu_ideregistro');
            $this->setCampo($datauspr, $parametros, 'idusuariologin', 'usu_auditoria');
            return $this->insertar($parametros, 'uspr_usuprgpryto', 'sq_uspr_ideregistr');
        } catch (\Exception $ex) {
            throw new MyException('Error creando permiso Proyecto usuario programa "USPR" ', -1);
        }
    }
    public function eliminaUSPR($datauspr) {
        
        try {
            $condicion = " uni_municipio = " . $datauspr['ideproyecto']. "  and usu_ideregistro = " .$datauspr['idusuario'] . "  and  prg_ideregistro = " . $datauspr['ideprograma'];
            return $this->eliminar('uspr_usuprgpryto', $condicion);
        } catch (\Exception $ex) {
            throw new MyException('Error eliminando Proyecto usuario programa "USPR"  ', -1);
        }
    }
    public function eliminaUSPRTotal($usuarioDestino) {
        
        try {
            $condicion = " usu_ideregistro =  " .$usuarioDestino ;
            return $this->eliminar('uspr_usuprgpryto', $condicion);
        } catch (\Exception $ex) {
            throw new MyException('Error eliminando Proyecto usuario programa "USPR" Total ', -1);
        }
    }
    
    public function guardaMedioPago($dataMedio) {
        $parametros = array();
        try {
            $this->setCampo($dataMedio, $parametros, 'idemediopago', 'uni_medpago');
            $this->setCampo($dataMedio, $parametros, 'idusuario', 'usu_ideregistro');
            $this->setCampo($dataMedio, $parametros, 'idusuariologin', 'usu_auditoria');
            return $this->insertar($parametros, 'usmp_usumedpago', 'sq_usmp_ideregistr');
        } catch (\Exception $ex) {
            throw new MyException('Error creando medios de pago ', -1);
        }
    }
    public function eliminaMedioPago($dataMedio) {
        
        try {
            $condicion = " uni_medpago = " . $dataMedio['idemediopago']. "  and usu_ideregistro = " .$dataMedio['idusuario'] ;
            return $this->eliminar('usmp_usumedpago', $condicion);
        } catch (\Exception $ex) {
            throw new MyException('Error eliminando medios de pago"  ', -1);
        }
    }
    public function eliminaMedioPagoTotal($usuarioDestino) {
        
        try {
            $condicion = " usu_ideregistro = " .$usuarioDestino ;
            return $this->eliminar('usmp_usumedpago', $condicion);
        } catch (\Exception $ex) {
            throw new MyException('Error eliminando medios de pago Total"  ', -1);
        }
    }
    public function guardaRutas($dataRuta) {
        $parametros = array();
        try {
            $this->setCampo($dataRuta, $parametros, 'ideruta', 'rut_ideregistro');
            $this->setCampo($dataRuta, $parametros, 'idusuario', 'usu_ideregistro');
            $this->setCampo($dataRuta, $parametros, 'idusuariologin', 'usu_auditoria');
            return $this->insertar($parametros, 'usru_usuruta', 'sq_usru_ideregistr');
        } catch (\Exception $ex) {
            throw new MyException('Error creando medios de pago ', -1);
        }
    }
    public function eliminaRutas($dataRuta) {
        
        try {
            $condicion = " rut_ideregistro = " . $dataRuta['ideruta']. "  and usu_ideregistro = " .$dataRuta['idusuario'] ;
            return $this->eliminar('usru_usuruta', $condicion);
        } catch (\Exception $ex) {
            throw new MyException('Error eliminando Rutas"  ', -1);
        }
    }
    public function eliminaRutasTotal($usuarioDestino) {
        
        try {
            $condicion = "  usu_ideregistro = " .$usuarioDestino ;
            return $this->eliminar('usru_usuruta', $condicion);
        } catch (\Exception $ex) {
            throw new MyException('Error eliminando Rutas Total"  ', -1);
        }
    }
    public function eliminaProgramasPerfilTotal($idPerfil) {
        
        try {
            $condicion = "  pfi_ideregistro = " .$idPerfil ;
            return $this->eliminar('oppf_opcperfil', $condicion);
        } catch (\Exception $ex) {
            throw new MyException('Error eliminando Los programas "  ', -1);
        }
    }
    
    public function buscaRutasUsuarioDestino($parametros){       
        $sql="SELECT * 
            FROM usru_usuruta usru
            INNER JOIN	rut_ruta rut ON rut.rut_ideregistro = usru.rut_ideregistro
            INNER JOIN	uni_unidad uni on uni.uni_ideregistro = rut.uni_tiporuta
            INNER JOIN	esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro AND esem.emp_ideregistro = :idempresa
            WHERE usru.usu_ideregistro = :idcolaboradororigen  ---Usuario origen
            AND	usru.rut_ideregistro  IN (
                            SELECT usrulogin.rut_ideregistro FROM usru_usuruta usrulogin  WHERE usrulogin.usu_ideregistro = :idusuario -- usuario login
            )
            AND	usru.rut_ideregistro NOT IN (
                            SELECT usruasignar.rut_ideregistro FROM usru_usuruta usruasignar  WHERE usruasignar.usu_ideregistro = :idcolaboradorasignar -- usuario destino
            )";
        return  $this->executeQuery($sql, $parametros);
    }
    
    public function buscaMediosPagosUsuarioDestino($parametros){       
        $sql="SELECT * FROM usmp_usumedpago usmp
                INNER JOIN	uni_unidad uni on uni.uni_ideregistro = usmp.uni_medpago
                INNER JOIN	esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro AND esem.emp_ideregistro = :idempresa
                WHERE usmp.usu_ideregistro = :idcolaboradororigen  ---Usuario origen
                AND	usmp.uni_medpago  IN (
                            SELECT usmplogin.uni_medpago FROM usmp_usumedpago usmplogin  WHERE usmplogin.usu_ideregistro = :idusuario -- usuario login
                )
                AND	usmp.uni_medpago NOT IN (
                            SELECT usmpasignar.uni_medpago FROM usmp_usumedpago usmpasignar  WHERE usmpasignar.usu_ideregistro = :idcolaboradorasignar -- usuario destino
                )";
        return  $this->executeQuery($sql, $parametros);
    }
    
    public function buscaUnidadesUsuarioDestino($parametros){
        $sql="SELECT  *
                FROM uspu_usuprgunid  uspu 
                INNER JOIN	prun_prgunidad prun ON prun.prun_ideregistr = uspu.prun_ideregistr
                INNER JOIN	uni_unidad uni ON uni.uni_ideregistro = prun.uni_ideregistro
                INNER JOIN	esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro AND esem.emp_ideregistro = :idempresa
                WHERE uspu.usu_ideregistro = :idcolaboradororigen   ---Usuario origen
                AND uspu.prun_ideregistr   IN (
                            SELECT uspuLogin.prun_ideregistr FROM uspu_usuprgunid  uspuLogin
                                    WHERE uspuLogin.usu_ideregistro = :idusuario   -- usuario login
                )	
                AND uspu.prun_ideregistr  NOT IN (
                            SELECT uspuasignar.prun_ideregistr FROM uspu_usuprgunid  uspuasignar 
                                    WHERE uspuasignar.usu_ideregistro = :idcolaboradorasignar   -- usuario destino
                )";
        return  $this->executeQuery($sql, $parametros);
    }
    
    public function buscaProyectosUsuarioDestino($parametros){
        $sql="SELECT 
                    uspr.prg_ideregistro, uspr.uni_municipio
                FROM uspr_usuprgpryto uspr 
                INNER JOIN	proyectos proy 	ON proy.proyecto_ideregistro = uspr.uni_municipio
                INNER JOIN	empresas emp ON emp.empresa_cod = proy.proyecto_codemp and emp.empresa_sevemp = :idempresa
                WHERE uspr.usu_ideregistro = :idcolaboradororigen --Usuario origen 
                AND  uspr.prg_ideregistro  IN (
                        SELECT usprasignar.prg_ideregistro FROM uspr_usuprgpryto usprasignar where usprasignar.usu_ideregistro = :idusuario    -- usuario login
                                AND usprasignar.prg_ideregistro = uspr.prg_ideregistro 	AND  usprasignar.uni_municipio = uspr.uni_municipio
                )
                AND  uspr.prg_ideregistro NOT IN (
                        SELECT usprasignar.prg_ideregistro FROM uspr_usuprgpryto usprasignar where usprasignar.usu_ideregistro = :idcolaboradorasignar   -- usuario destino
                                AND usprasignar.prg_ideregistro = uspr.prg_ideregistro 	AND  usprasignar.uni_municipio = uspr.uni_municipio
                )
                GROUP BY  uspr.prg_ideregistro, uspr.uni_municipio";
        return  $this->executeQuery($sql, $parametros);
    }
    
    public function insertaRutasUsuarioDestino($parametros){  
        $idusuario = $parametros['idusuario'] ;
        $idempresa = $parametros['idempresa'] ;
        $idcolaboradororigen = $parametros['idcolaboradororigen'] ;
        $idcolaboradorasignar = $parametros['idcolaboradorasignar'] ;
        try{
            $sql="INSERT INTO usru_usuruta
                    SELECT  nextval('sq_usru_ideregistr'::regclass),
                    usru.rut_ideregistro, 
                    $idcolaboradorasignar, -- usuario destino
                        $idusuario -- usuario login
                    FROM usru_usuruta usru
                    INNER JOIN	rut_ruta rut ON rut.rut_ideregistro = usru.rut_ideregistro
                    INNER JOIN	uni_unidad uni on uni.uni_ideregistro = rut.uni_tiporuta
                    INNER JOIN	esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro AND esem.emp_ideregistro = $idempresa
                    WHERE usru.usu_ideregistro = $idcolaboradororigen  ---Usuario origen
                    AND	usru.rut_ideregistro  IN (
                                    SELECT usrulogin.rut_ideregistro FROM usru_usuruta usrulogin  WHERE usrulogin.usu_ideregistro = $idusuario -- usuario login
                    )
                    AND	usru.rut_ideregistro NOT IN (
                                    SELECT usruasignar.rut_ideregistro FROM usru_usuruta usruasignar  WHERE usruasignar.usu_ideregistro = $idcolaboradorasignar -- usuario destino
                    )";
            return  $this->executeQuery($sql);
         } catch (\Exception $ex) {
            throw new MyException('Error grabando los permisos a las Rutas  ', -1);
        }
    }
    
    public function insertaMediosPagosUsuarioDestino($parametros){  
        $idusuario = $parametros['idusuario'] ;
        $idempresa = $parametros['idempresa'] ;
        $idcolaboradororigen = $parametros['idcolaboradororigen'] ;
        $idcolaboradorasignar = $parametros['idcolaboradorasignar'] ;
        try{
            $sql="INSERT INTO usmp_usumedpago
                    SELECT  nextval('sq_usmp_ideregistr'::regclass), 
                    usmp.uni_medpago, $idcolaboradorasignar , -- usuario destino
                        $idusuario -- usuario login
                    FROM usmp_usumedpago usmp
                    INNER JOIN	uni_unidad uni on uni.uni_ideregistro = usmp.uni_medpago
                    INNER JOIN	esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro AND esem.emp_ideregistro = $idempresa
                    WHERE usmp.usu_ideregistro = $idcolaboradororigen  ---Usuario origen
                    AND	usmp.uni_medpago  IN (
                                    SELECT usmplogin.uni_medpago FROM usmp_usumedpago usmplogin  WHERE usmplogin.usu_ideregistro = $idusuario -- usuario login
                    )
                    AND	usmp.uni_medpago NOT IN (
                                    SELECT usmpasignar.uni_medpago FROM usmp_usumedpago usmpasignar  WHERE usmpasignar.usu_ideregistro = $idcolaboradorasignar -- usuario destino
                    )";
            return  $this->executeQuery($sql);
        } catch (\Exception $ex) {
            throw new MyException('Error grabando los permisos a los Medios de Pago"  ', -1);
        }
    }
    
    public function insertaUnidadesUsuarioDestino($parametros){  
        $idusuario = $parametros['idusuario'] ;
        $idempresa = $parametros['idempresa'] ;
        $idcolaboradororigen = $parametros['idcolaboradororigen'] ;
        $idcolaboradorasignar = $parametros['idcolaboradorasignar'] ;
        try{
            $sql="INSERT INTO uspu_usuprgunid
                    SELECT  nextval('sq_uspu_ideregistr'::regclass),
                            uspu.prun_ideregistr, 
                            $idcolaboradorasignar  , -- usuario destino
                        $idusuario -- usuario login
                    FROM uspu_usuprgunid  uspu 
                    INNER JOIN	prun_prgunidad prun ON prun.prun_ideregistr = uspu.prun_ideregistr
                    INNER JOIN	uni_unidad uni ON uni.uni_ideregistro = prun.uni_ideregistro
                    INNER JOIN	esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro AND esem.emp_ideregistro = $idempresa
                    WHERE uspu.usu_ideregistro = $idcolaboradororigen ---Usuario origen
                    AND uspu.prun_ideregistr   IN (
                                            SELECT uspuLogin.prun_ideregistr FROM uspu_usuprgunid  uspuLogin
                                                    WHERE uspuLogin.usu_ideregistro = $idusuario   -- usuario login
                    )	
                    AND uspu.prun_ideregistr  NOT IN (
                                            SELECT uspuasignar.prun_ideregistr FROM uspu_usuprgunid  uspuasignar 
                                                    WHERE uspuasignar.usu_ideregistro = $idcolaboradorasignar -- usuario destino
                    )	
                    GROUP BY uspu.prun_ideregistr";
            return  $this->executeQuery($sql);
        } catch (\Exception $ex) {
            throw new MyException('Error grabando los permisos a las Unidades (uspu)"  ', -1);
        }
    }
    public function insertaProyectosUsuarioDestino($parametros){  
        $idusuario = $parametros['idusuario'] ;
        $idempresa = $parametros['idempresa'] ;
        $idcolaboradororigen = $parametros['idcolaboradororigen'] ;
        $idcolaboradorasignar = $parametros['idcolaboradorasignar'] ;
        try{
            $sql="INSERT INTO uspr_usuprgpryto
                    SELECT 	nextval('sq_uspr_ideregistr'::regclass),
                            uspr.prg_ideregistro, uspr.uni_municipio, 
                            $idcolaboradorasignar idusuario , -- usuario destino
                        $idusuario -- usuario login
                    FROM uspr_usuprgpryto uspr
                    INNER JOIN	proyectos proy 	ON proy.proyecto_ideregistro = uspr.uni_municipio
                    INNER JOIN	empresas emp ON emp.empresa_cod = proy.proyecto_codemp and emp.empresa_sevemp = $idempresa
                    WHERE uspr.usu_ideregistro = $idcolaboradororigen --Usuario origen
                    AND  uspr.prg_ideregistro  IN (
                                    SELECT usprasignar.prg_ideregistro FROM uspr_usuprgpryto usprasignar where usprasignar.usu_ideregistro = $idusuario    -- usuario login
                                                    AND usprasignar.prg_ideregistro = uspr.prg_ideregistro 	AND  usprasignar.uni_municipio = uspr.uni_municipio
                    )
                    AND  uspr.prg_ideregistro NOT IN (
                                    SELECT usprasignar.prg_ideregistro FROM uspr_usuprgpryto usprasignar where usprasignar.usu_ideregistro = $idcolaboradorasignar   -- usuario destino
                                                    AND usprasignar.prg_ideregistro = uspr.prg_ideregistro 	AND  usprasignar.uni_municipio = uspr.uni_municipio
                    )
                    GROUP BY  uspr.prg_ideregistro, uspr.uni_municipio";
            return  $this->executeQuery($sql);
        } catch (\Exception $ex) {
            throw new MyException('Error grabando los permisos a los Proyectos ó Municipios"  ', -1);
        }
    }
    public function insertaProgramasUsuarioDestino($parametros){  
        $idusuario = $parametros['idusuario'] ;
        $idempresa = $parametros['idempresa'] ;
        $idPerfil = $parametros['idPerfil'];
        $idcolaboradororigen = $parametros['idcolaboradororigen'] ;
        $idcolaboradorasignar = $parametros['idcolaboradorasignar'] ;
        try{
            $sql="INSERT into oppf_opcperfil
                    SELECT    nextval('sq_oppf_ideregistr'::regclass), 
                    $idPerfil usuarioNuevoPerfilDESTINO, oppf.opc_ideregistro, oppf.prg_ideregistro, $idusuario idusuarioLogin
                    FROM oppf_opcperfil oppf where oppf.pfi_ideregistro = (
                                    SELECT pfi_ideregistro FROM usem_usuempresa usemasig WHERE usemasig.usu_ideregistro = $idcolaboradororigen  ---idusuarioOrigen
                                    AND usemasig.emp_ideregistro = $idempresa)
                    AND oppf.prg_ideregistro not in (
                            SELECT oppfdest.prg_ideregistro FROM oppf_opcperfil oppfdest where oppfdest.pfi_ideregistro = $idPerfil --usuarioNuevoPerfilDESTINO
                                    )
                    AND oppf.opc_ideregistro in (select opc_ideregistro from oppf_opcperfil oppflogin where oppflogin.pfi_ideregistro =(
                            SELECT pfi_ideregistro FROM usem_usuempresa usemasig WHERE usemasig.usu_ideregistro = $idusuario  ---idusuarioLogin
                            AND usemasig.emp_ideregistro = $idempresa))";
            return  $this->executeQuery($sql);
        } catch (\Exception $ex) {
            throw new MyException('Error grabando los permisos a los Proyectos ó Municipios"  ', -1);
        }
    }
    
    
}
