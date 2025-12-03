<?php

namespace Administracion\AdministracionBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Utiles\DateUtil;

class TercerosModel extends AuditoriaServices {
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

    public function consultarMunicipios($parametros) {
        $sql = 'select proyecto_ideregistro idMunicipio, proyecto_nom nombreMunicipio  
               from proyectos where upper(proyecto_nom)    like  :nombreMunicipio ';
        $this->setSql($sql);
        $parametros['nombreMunicipio'] = '%' . strtoupper($parametros['nombreMunicipio']) . '%';
        $this->setParams($parametros);
        $resultado = $this->execute();
        $datos = array();
        foreach ($resultado as $municipio) {
            $registro['idMunicipio'] = $municipio['idmunicipio'];
            $registro['nombreMunicipio'] = $municipio['nombremunicipio'];
            $datos[] = $registro;
        }
        return $datos;
    }

    public function consultarBarrios($parametros) {

        $sql = 'select mb.uni_barrio idBarrio,b.barrio_nom nombreBarrio from proyectos p, muba_munbarrio mb, barrios b
                where mb.uni_municipio=:idMunicipio and upper(b.barrio_nom) like :nombreBarrio and  
                p.proyecto_ideregistro=mb.uni_municipio and mb.uni_municipio=p.proyecto_ideregistro and 
                mb.uni_barrio=b.barrio_ideregistro and p.proyecto_cod=b.barrio_codpro limit :paginacion';
        $this->setSql($sql);
        $parametros['nombreBarrio'] = '%' . strtoupper($parametros['nombreBarrio']) . '%';
        $parametros['paginacion'] = PAGINACION;
        $this->setParams($parametros);
        $resultado = $this->execute();
        $datos = array();
        foreach ($resultado as $barrio) {
            $registro['idBarrio'] = $barrio['idbarrio'];
            $registro['nombreBarrio'] = $barrio['nombrebarrio'];
            $datos[] = $registro;
        }
        return $datos;
    }

    public function consultarSuscriptoresTercero($IdeTercero) {
        $sql = " SELECT sus_suscripcion.sus_descripcion,sus_suscripcion.ter_ideregistro,
                        cnre_cnvrecaudo.cnre_nombre,sus_suscripcion.sus_ideregistro
                        FROM sus_suscripcion
                        INNER JOIN cnre_cnvrecaudo ON sus_suscripcion.cnre_ideregistr = cnre_cnvrecaudo.cnre_ideregistr  AND
			sus_suscripcion.ter_ideregistro = '$IdeTercero' AND
                        sus_suscripcion.sus_ideregistro not in(select gco_gesconstruc.sus_ideregistro 
                        from gco_gesconstruc where gco_gesconstruc.gco_estado in('A','T')) ";
        $this->setSql($sql);
        $resultado = $this->execute();
        $datos = array();
        foreach ($resultado as $tercerosSuscriptor) {
            $registro['susIderegistro'] = $tercerosSuscriptor['sus_ideregistro'];
            $registro['susconvNombre'] = $tercerosSuscriptor['cnre_nombre'];
            $registro['susDescripcion'] = $tercerosSuscriptor['sus_descripcion'];
            $datos[] = $registro;
        }
        return $datos;
    }

    public function consultarTercero($nombre) {
        $nombre = rtrim($nombre);
        $nombre = ltrim($nombre);
        $parametros["ter_nomcompleto"] = "%" . strtolower($nombre) . "%";
        $sql = "SELECT
                    DISTINCT
                    ter.ter_ideregistro idtercero,
                    ter.ter_documento documento,
                    ter.ter_nomcompleto nombretercero,
                    ter.uni_tiptercero  idtipotercero,uni.uni_nombre1 tipotercero,ter.ter_telfijo telefonofijo,
                    ter.ter_telcelular telefonocelular
                FROM
                    ter_tercero  ter inner join clte_clatercero clte on ter.ter_ideregistro=clte.ter_ideregistro
                    inner join uni_unidad uni on ter.uni_tiptercero=uni.uni_ideregistro
                WHERE
                    lower(ter_nomcompleto) like :ter_nomcompleto
                LIMIT 100";

        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function consultarTerceroPropiedad($parametros) {

        $band = 0;
        $complemento = '';

        if (!empty($parametros['tercero'])) {
            $complemento = ' and ter.ter_ideregistro=:tercero ';
            $band = 1;
        }
        if (!empty($parametros['documento'])) {
            $complemento .= " and ter.ter_documento =:documento ";
            $band = 1;
        }
        if (!empty($parametros['direccion'])) {
            $parametros['direccion'] = " like  %" . strtolower($parametros['direccion']) . "%";
            $complemento .= ' and lower(pro.pro_direccion)  :direccion ';
            $band = 1;
        }
        if (!empty($parametros['nrocatastral'])) {
            $parametros['pro_numcatastral'] = $pro_numcatastral;
            $complemento .= ' and pro.pro_numcatastral =  :nrocatastral ';
            $band = 1;
        }
        if (!empty($parametros['municipio'])) {
            $complemento .= ' and pro.uni_municipio =  :municipio ';
            $band = 1;
        }
        if (!empty($parametros['barrio'])) {
            $complemento .= ' and pro.uni_barrio =  :barrio ';
            $band = 1;
        }

        if (!empty($parametros['propiedad'])) {
            $complemento .= ' and pro.pro_idepropieda =  :propiedad ';
            $band = 1;
        }
        if (!empty($parametros['codigoanterior'])) {
            $complemento .= ' and dsus.dsus_pcodigo =  :codigoanterior ';
            $band = 1;
        }
        if (!empty($parametros['excluirtercero'])) {
            $complemento .= ' and ter.ter_ideregistro <> :excluirtercero ';

            $innerjoin = 'left join pro_propiedad pro on pro.ter_ideregistro=ter.ter_ideregistro
                    left join dsus_detsuscrip dsus on dsus.ter_ideregistro  = ter.ter_ideregistro 
                    left join sus_suscripcion sus on sus.sus_ideregistro = dsus.sus_ideregistro ';
        } else {
            $complemento .= "    
                                and uspr.usu_ideregistro=:usuario
                                and uspr.prg_ideregistro=19
                                and esem.emp_ideregistro=:empresa 
                                and pro.pro_estado ='A' ";
                                
            $innerjoin = 'inner join pro_propiedad pro on pro.ter_ideregistro=ter.ter_ideregistro
                          inner join dsus_detsuscrip dsus on dsus.ter_ideregistro  = ter.ter_ideregistro and pro.pro_ideregistro = dsus.pro_ideregistro 
                          inner join sus_suscripcion sus on sus.sus_ideregistro = dsus.sus_ideregistro 
                          inner join proyectos proy on pro.uni_municipio=proy.proyecto_ideregistro
                          inner join barrios bar on pro.uni_barrio=bar.barrio_ideregistro
                          inner join uspr_usuprgpryto uspr on pro.uni_municipio=uspr.uni_municipio
                          inner join esem_estempresa esem on esem.est_ideregistro=pro.est_tippropieda ' ;
            
        }
        if ($band == 0) {
            throw new MyException("No se ha recibido parametros de filtro para la consulta ", -1);
        }

        $sql = "SELECT
                    DISTINCT
                    ter.ter_ideregistro idtercero,
                    ter.ter_documento documento,
                    ter.ter_nomcompleto nombretercero,
                    ter.uni_tiptercero  idtipotercero,uni.uni_nombre1 tipotercero,ter.ter_telfijo telefonofijo,
                    ter.ter_telcelular telefonocelular,ter.ter_sexo sexo, dsus.dsus_pcodigo codigoanterior,
                    sus.cnre_ideregistr convenio,sus.sus_modconvenio, sus.sus_descripcion , sus.sus_ideregistro suscriptor
                FROM
                    ter_tercero  ter 
                    left join clte_clatercero clte on ter.ter_ideregistro=clte.ter_ideregistro 
                    $innerjoin        
                    left join uni_unidad uni on ter.uni_tiptercero=uni.uni_ideregistro
                WHERE
                    1=1  $complemento limit 1 ";

        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function consultarPropiedad($parametros) {
        $sql = ' SELECT
                        pro.pro_ideregistro,pro.pro_idepropieda	,uni.uni_nombre1,
			pro.pro_numcatastral,pro.pro_descripcion,proy.proyecto_nom,
			bar.barrio_nom,pro.pro_direccion,dsus.dsus_pcodigo codigoanterior ,
                        case 
                        WHEN 
                           dsus.dsus_ideregistr>0 then \'S\'	else \'N\' end as tienesuscr , dsus_ideregistr suscripcion
			FROM 
                                pro_propiedad pro
                                inner join dsus_detsuscrip dsus on dsus.pro_ideregistro=pro.pro_ideregistro
                                inner join proyectos proy on pro."uni_municipio"=proy."proyecto_ideregistro"
                                inner join barrios bar on pro."uni_barrio"=bar."barrio_ideregistro"
                                inner join uni_unidad uni on pro."uni_tippropieda"=uni."uni_ideregistro"
                                inner join uspr_usuprgpryto uspr on pro.uni_municipio=uspr.uni_municipio
                                inner join esem_estempresa esem on esem.est_ideregistro=pro.est_tippropieda
			WHERE 
                                dsus.sus_ideregistro= :suscriptor  and pro.pro_estado=\'A\'
                                and pro.ter_ideregistro= :tercero 
                                and uspr.usu_ideregistro=:usuario
                                and uspr.prg_ideregistro=19
                                and esem.emp_ideregistro=:empresa order by tienesuscr ';

        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function ActualizarSuscripcion($parametros, $suscriptor) {
        $Datos = array();
        $Datos['sus_ideregistro'] = $suscriptor;
        $Datos['ter_ideregistro'] = $parametros['tercero'];
        $condicion = 'dsus_ideregistr =' . $parametros['suscripcion'];
        return $this->actualizar($Datos, 'dsus_detsuscrip', $condicion);
    }
    
    public function ActualizaFacturaSuscripcion($parametros, $suscriptor) {
        $Datos = array();
        $Datos['sus_ideregistro'] = $suscriptor;
        $condicion = 'dsus_ideregistr =' . $parametros['suscripcion'];
        return $this->actualizar($Datos, 'fac_factura', $condicion);
    }

    public function ActualizarPropiedad($parametros) {
        $Datos['ter_ideregistro'] = $parametros['tercero'];
        $condicion = 'pro_ideregistro =' . $parametros['pro_ideregistro'];
        return $this->actualizar($Datos, 'pro_propiedad', $condicion);
    }

    public function crearSuscriptorNuevo($parametros) {
        $Datos = array();
        $Datos['ter_ideregistro'] = $parametros['tercero'];
        $Datos['cnre_ideregistr'] = $parametros['terceroorigen']['convenio'];
        $Datos['sus_modconvenio'] = $parametros['terceroorigen']['sus_modconvenio'];
        $Datos['sus_descripcion'] = $parametros['terceroorigen']['sus_descripcion'];
        $Datos['usu_ideregistro'] = $parametros['usuario'];
        try {
            $suscriptor = $this->insertar($Datos, 'sus_suscripcion', 'sq_sus_ideregistro');
            return $suscriptor;
        } catch (\Exception $ex) {
            throw new MyException("Error creando suscriptor " . $ex->getMessage(), -1);
        }
    }

    public function ValidarSuscriptorDestino($parametros) {
        $sql = "SELECT
	sus.sus_ideregistro
        FROM
                sus_suscripcion sus
        LEFT JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = sus.sus_ideregistro
        WHERE
                sus.cnre_ideregistr = :idconvenio
        AND sus.ter_ideregistro = :tercero
        AND dsus_estado <> 'E' 
        AND dsus.dsus_ideregistr IS NULL ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }
    
    public function actualizarTerceroSuscriptor($tercero, $suscriptor)
    {
        $parametros['ter_ideregistro'] = $tercero ;
        $condicion = " sus_ideregistro = ".$suscriptor ;
        $this->actualizar($parametros, 'sus_suscripcion', $condicion) ; 
        
    } 
    
    public function buscaClienteConstructora($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "select * 
                  from 		sco_susconstruc sco  			
            INNER JOIN		dsus_detsuscrip dsus	ON	dsus.dsus_ideregistr = sco.dsus_ideregistr
            INNER JOIN		gco_gesconstruc gco	ON	gco.gco_ideregistro = sco.gco_ideregistro AND gco.sus_ideregistro = dsus.sus_ideregistro
            where sco.dsus_ideregistr = :idsuscripcion";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }
}
