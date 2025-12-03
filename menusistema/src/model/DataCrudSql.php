<?php

/**
 * UsuariosCrudSql
 *
 * Class that controls add, get, modify and delete
 * 
 * @author      Harold D. Duque
 * @version     1.0
 * @since       7 de Agosto 2014
 */
class DataCrudSql {

    /**
     * @param ConexionPG $conexionPG
     * @param UsuarioVo $usuarioVo
     */
    public function GetDatosPorNitUsuario($conexionPG, $idUsuario, $empresa) {
        $menu = array();
        $indices = array();
        $sql = "
              select 
                opc.*,
                prg.*
              from 
                opc_opcion opc inner join oppf_opcperfil oppf on opc.opc_ideregistro=oppf.opc_ideregistro
                inner join  pfi_perfil pfi on pfi.pfi_ideregistro=oppf.pfi_ideregistro
                inner join usem_usuempresa usem on usem.pfi_ideregistro=pfi.pfi_ideregistro
                inner join prg_programa prg on opc.prg_ideregistro=prg.prg_ideregistro
              where 
                usem.usu_ideregistro=$idUsuario and
                usem.emp_ideregistro=$empresa ";
        try {
            $stmt = $conexionPG->prepare($sql);
            $stmt->execute();
            $resultado = $stmt->fetchAll();
            foreach ($resultado as $row) {
                $value['opc_ideregistro'] = $row['opc_ideregistro'];
                $value['opc_nombre'] = $row['opc_nombre'];
                $value['opc_idepadre'] = $row['opc_idepadre'];
                $value['opc_descripcion'] = $row['opc_descripcion'];
                $value['prg_ideregistro'] = $row['prg_ideregistro'];
                $value['prg_nombre'] = $row['prg_nombre'];
                $value['prg_localiza'] = $row['prg_localiza'];
                $value['prg_abreviatura'] = $row['prg_abreviatura'];
                $this->getFather($value['opc_idepadre'], $conexionPG, $menu, $indices);
                $this->addChild($menu, $value);
            }
            $menu = $this->verificarPadres($menu);
        } catch (Exception $exception) {
            echo $exception;
        }
        return $menu;
    }

    private function verificarPadres(array &$menu) {
        $menuFinal = array();
        foreach ($menu as $opcion) {
            if (empty($opcion['opc_idepadre'])) {
                $menuFinal[] = $opcion;
            }
        }
        return $menuFinal;
    }

    function getFather($idPadre, $conexionPG, &$menuMain, &$indices) {
        $sql = "select * from opc_opcion opc  where opc.opc_ideregistro=$idPadre";
        try {
            $stmt = $conexionPG->prepare($sql);
            $stmt->execute();
            $resultado = $stmt->fetchAll();
            foreach ($resultado as $row) {
                $value['opc_ideregistro'] = $row['opc_ideregistro'];
                $value['opc_idepadre'] = $row['opc_idepadre'];
                $value['opc_nombre'] = $row['opc_nombre'];
                $value['opc_descripcion'] = $row['opc_descripcion'];
                $value['prg_ideregistro'] = $row['prg_ideregistro'];
                $exist = array_search($value['opc_ideregistro'], $indices);
                if (!is_numeric($exist)) {
                    $indices[] = $value['opc_ideregistro'];
                    if (isset($value['opc_idepadre']) && $value['opc_idepadre'] > 0) {
                        $this->getFather($value['opc_idepadre'], $conexionPG, $menuMain, $indices);
                    }
                    if ($this->addChild($menuMain, $value) == 0) {
                        $menuMain[] = $value;
                    }
                }
            }
        } catch (Exception $exception) {
            echo $exception;
        }
    }

    public function addChild(&$menuMain, &$child) {
        $response = 0;
        foreach ($menuMain as $key => &$row) {
            if (($row['opc_ideregistro'] == $child['opc_idepadre'])) {
                $row['menuItem'][] = $child;
                return $response = 1;
            } else if (isset($row['menuItem'])) {
                $response = $this->addChild($row['menuItem'], $child);
            }
        }
        return $response;
    }

    public function regresarDatosLogin($conexionPG, $usuario, $contrasena, $empresa) {
        $sql = "SELECT us.usuario_nit usuarionit, 
                       us.usuario_nom usuario,
                       now() fechasistema , 
                       pp.pfi_ideregistro idperfil, 
                       em.empresa_sevemp idempresa,
                       em.empresa_nom empresa,
                       em.empresa_img logo,
                       uu.usu_ideregistro idusuario,
                       (CASE us.usuario_swtact WHEN TRUE THEN 1 ELSE 0 END) activo
                FROM   usem_usuempresa uu 
                       INNER JOIN pfi_perfil pp 
                       ON pp.pfi_ideregistro = uu.pfi_ideregistro 
                       INNER JOIN usuarios us 
                       ON uu.usu_ideregistro = us.usu_ideregistro 
                       INNER JOIN empresas em 
                       ON uu.emp_ideregistro = em.empresa_sevemp
                WHERE  us.usu_login = '$usuario' 
                       AND us.usuario_pas = '$contrasena'
                       AND em.empresa_sevemp = '$empresa'";
        try {
            $stmt = $conexionPG->prepare($sql);
            $stmt->execute();
            $resultado = $stmt->fetchAll();
        } catch (Exception $exc) {
            echo $exc;
        }
        return $resultado;
    }

    public function datosEmpresa($conexionPG) {
        $sql = "SELECT em.empresa_sevemp, 
                       em.empresa_nom
                  FROM empresas em
                 WHERE em.empresa_sevemp IS NOT NULL";
        try {
            $stmt = $conexionPG->prepare($sql);
            $stmt->execute();
            $resultado = $stmt->fetchAll();
        } catch (Exception $exc) {
            echo $exc;
        }
        return $resultado;
    }

    public function insertaRegistro($conexionPG, $usuario, $perfil, $empresa) {
        $sql = "INSERT INTO acc_acceso
                            (
                                usu_ideregistro,
                                acc_fecingreso,
                                acc_estado,
                                emp_ideregistro,
                                pfi_ideregistro
                            )
                     VALUES (
                                $usuario,
                                now(),
                                'E',
                                $empresa,
                                $perfil
                            )";
        try {
            $stmt = $conexionPG->prepare($sql);
            $stmt->execute();
            $resultado = $conexionPG->lastInsertId('sq_acc_ideregistro');
        } catch (Exception $exc) {
            $resultado = null;
        }
        return $resultado;
    }

    public function registraCierre($conexionPG, $acceso) {
        $sql = "UPDATE acc_acceso
                   SET acc_estado = 'S', acc_fecsalida = now()
                 WHERE acc_ideregistro = $acceso";

        try {
            $stmt = $conexionPG->prepare($sql);
            $stmt->execute();
            $resultado = $stmt->rowCount();
        } catch (Exception $exc) {
            echo $exc;
            $resultado = $exc;
        }
        return $resultado;
    }

    public function validaOpcionUsuario($conexionPG, $idUsuario, $idEmpresa, $url) {
        $urlRedirect = str_replace('/achagua/sistema/web/', '/achagua/sistema/web/app.php/', $url);
        $sql = "select 
                opc.*,
                prg.*
              from 
                opc_opcion opc inner join oppf_opcperfil oppf on opc.opc_ideregistro=oppf.opc_ideregistro
                inner join  pfi_perfil pfi on pfi.pfi_ideregistro=oppf.pfi_ideregistro
                inner join usem_usuempresa usem on usem.pfi_ideregistro=pfi.pfi_ideregistro
                inner join prg_programa prg on opc.prg_ideregistro=prg.prg_ideregistro
              where 
                usem.usu_ideregistro='$idUsuario' and
                usem.emp_ideregistro=$idEmpresa and (
                '$url' like  prg.prg_localiza||'%' or '$urlRedirect' like  prg.prg_localiza||'%'  )";
        try {
            $stmt = $conexionPG->prepare($sql);
            $stmt->execute();
            $resultado = $stmt->fetchAll();
        } catch (Exception $exc) {
            echo $exc;
        }
        return $resultado;
    }

}
