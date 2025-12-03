<?php

namespace Externo\FinanciacionesBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;

/**
 * Description of SeguridadModels
 *
 * @author god
 */
class SeguridadModel extends AuditoriaServices {

    /**
     * 
     * @param Connection 
     */
    public function __construct(&$conexion) {
        $this->setConexion($conexion);
    }

    /**
     * 
     * @return array Lista de las empresas 
     */
    public function consultarEmpresasFinancian() {
        $sql = "SELECT
                  emp.empresa_nom     nombre,
                  emp.empresa_sevemp  idempresa
                from empresas emp
                  INNER JOIN ter_tercero ter on ter.ter_documento = emp.empresa_cod
                  INNER JOIN clte_clatercero clte on clte.ter_ideregistro = ter.ter_ideregistro
                where clte.uni_clatercero = :claseexterno";
        return $this->executeQuery($sql, array('claseexterno' => CLASE_EMPRESAS_EXTERNAS));
    }

    /**
     * Se realiza la autenticación del sistema
     * @param type $usuario
     * @param type $clave
     * @param type $idEmpresa
     * @param type $ip
     * @return type
     */
    public function autenticar($usuario, $clave, $idEmpresa, $ip) {
        $sql = "
             SELECT DISTINCT
                us.usuario_nit      usuarionit,
                us.usuario_nom      usuario,
                pfi.pfi_ideregistro idperfil,
                em.empresa_sevemp   idempresa,
                em.empresa_nom      empresa,
                em.empresa_img      logo,
                uu.usu_ideregistro  idusuario,
                us.usuario_swtact,
                seguridad.idprograma,
                seguridad.idempresa
              FROM usem_usuempresa uu
                INNER JOIN usuarios us ON uu.usu_ideregistro = us.usu_ideregistro
                INNER JOIN empresas em ON uu.emp_ideregistro = em.empresa_sevemp
                INNER JOIN pfi_perfil pfi ON pfi.pfi_ideregistro = uu.pfi_ideregistro
                INNER JOIN oppf_opcperfil oppf ON pfi.pfi_ideregistro = oppf.pfi_ideregistro
                INNER JOIN usem_usuempresa usem
                  ON usem.pfi_ideregistro = pfi.pfi_ideregistro AND usem.emp_ideregistro = em.empresa_sevemp AND
                     usem.usu_ideregistro = us.usu_ideregistro
                INNER JOIN prg_programa prg ON oppf.prg_ideregistro = prg.prg_ideregistro
                INNER JOIN (SELECT
                                  info.idprograma                                                         idprograma,
                                  empresa ->> 'emp_ideregistro'                                           idempresa,
                                  json_array_elements(empresa -> 'ips_validas') :: text                   ip
                            FROM
                              (SELECT
                                 (par.par_parametro -> 'FICOM_PARAMETROS') ->> 'prg_ideregistro'                idprograma,
                                 (json_array_elements((par.par_parametro -> 'FICOM_PARAMETROS') -> 'empresas')) empresa
                               FROM par_parametro par
                               WHERE par.emp_ideregistro = :idempresa
                              ) as info
                           ) as seguridad
                  ON (seguridad.idempresa) :: INTEGER = usem.emp_ideregistro AND
                     (seguridad.idprograma) :: INTEGER = prg.prg_ideregistro
                INNER JOIN gestion_contratos gcon on gcon.gestioncontrato_codemp = em.empresa_cod AND
                                                     now() :: date BETWEEN gcon.gestioncontrato_fecvigini and gcon.gestioncontrato_fecvigfin
                INNER JOIN empresas empcontrato on empcontrato.empresa_cod = gcon.gestioncontrato_empcon
                    INNER JOIN clte_clatercero clte on clte.ter_ideregistro = empcontrato.ter_idegenerico and clte.uni_clatercero = :claseexterno
                INNER JOIN cofi_comfirmains cofi
                  on cofi.ter_ideregistro = empcontrato.ter_idegenerico and cofi.cofi_nitempleado = us.usuario_nit
              WHERE us.usu_login = :usuario
                    AND us.usuario_pas = :clave
                    AND us.usuario_swtact = TRUE
                    AND em.empresa_sevemp = :idempresa
                    AND prg.prg_ideregistro = :idprograma
                    AND seguridad.ip ILIKE :ip";
        $resultado = $this->executeQuery($sql, array(
            'claseexterno' => CLASE_EMPRESAS_INSTALADORA_PROVEEDOR,
            'idprograma' => PROGRAMA_FINANCIACION_EXTERNA,
            'usuario' => $usuario,
            'clave' => $clave,
            'idempresa' => $idEmpresa,
            'ip' => '%' . $ip . '%'
        ));
        if (empty($resultado)) {
            throw new \Llanogas\LlanogasBundle\MyException('Error en el usuario y/o clave', -1);
        }
        return $resultado[0];
    }

    /**
     * Guarda la información en la tabla de accesos del sistema 
     * @param array $usuario Información del usuario que inicia sesión 
     * @return int Identificador del acceso que se inicia
     */
    public function guardarAcceso($usuario) {
        $info['usu_ideregistro'] = $usuario['idusuario'];
        $info['acc_fecingreso'] = 'now()';
        $info['acc_estado'] = 'I';
        $info['emp_ideregistro'] = $usuario['idempresa'];
        $info['pfi_ideregistro'] = $usuario['idperfil'];
        $info['acc_observacion'] = 'Usuario Externo';
        $query = $this->construyeSQL("INSERT", "acc_acceso", $info);
        $this->setSql($query);
        $this->setParams($info);
        $this->executeUpdate();
        return $this->getlastId();
    }

    /**
     * Finaliza el registro de acceso 
     * @param array $usuario Información de la sesión 
     * @return int Si afectó registros al momento de cerrar la sesión 
     */
    public function actualizarAcceso($usuario) {
        $info['acc_ideregistro'] = $usuario['idacceso'];
        $info['acc_fecsalida'] = 'now()';
        return $this->actualizar($info, 'acc_acceso', 'acc_ideregistro = :acc_ideregistro');
    }

}
