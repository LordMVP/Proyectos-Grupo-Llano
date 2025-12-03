<?php

namespace Administracion\AdministracionBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Utiles\DateUtil;

class EliminarPropiedadModel extends AuditoriaServices {
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
            $complemento .= " and ter.ter_documento like '%" . $parametros['documento'] . "%' ";
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
        if ($band == 0) {
            throw new MyException("No se ha recibido parametros de filtro para la consulta ", -1);
        }

        $sql = "SELECT
                    DISTINCT
                    ter.ter_ideregistro idtercero,
                    ter.ter_documento documento,
                    ter.ter_nomcompleto nombretercero,
                    ter.uni_tiptercero  idtipotercero,uni.uni_nombre1 tipotercero,ter.ter_telfijo telefonofijo,
                    ter.ter_telcelular telefonocelular,ter.ter_sexo sexo
                FROM
                    ter_tercero  ter 
                    left join clte_clatercero clte on ter.ter_ideregistro=clte.ter_ideregistro 
                    inner join pro_propiedad pro on pro.ter_ideregistro=ter.ter_ideregistro
                    left join dsus_detsuscrip dsus on dsus.pro_ideregistro  = pro.pro_ideregistro and dsus.ter_ideregistro = ter.ter_ideregistro 
                    left join uni_unidad uni on ter.uni_tiptercero=uni.uni_ideregistro 
                WHERE
                    1=1 and pro.pro_estado='A' and dsus.pro_ideregistro is null   $complemento  ";

        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function consultarPropiedad($parametros) {
        $sql = " SELECT
                        pro.pro_ideregistro,pro.pro_idepropieda	,uni.uni_nombre1,
			pro.pro_numcatastral,pro.pro_descripcion,proy.proyecto_nom,
			bar.barrio_nom,pro.pro_direccion
			FROM 
                                pro_propiedad pro
                                left join dsus_detsuscrip dsus on dsus.pro_ideregistro=pro.pro_ideregistro
                                inner join proyectos proy on pro.uni_municipio=proy.proyecto_ideregistro
                                inner join barrios bar on pro.uni_barrio=bar.barrio_ideregistro
                                inner join uni_unidad uni on pro.uni_tippropieda=uni.uni_ideregistro
                                inner join uspr_usuprgpryto uspr on pro.uni_municipio=uspr.uni_municipio
                                inner join esem_estempresa esem on esem.est_ideregistro=pro.est_tippropieda
			WHERE 
                                dsus.dsus_ideregistr is null and pro.pro_estado='A' 
                                and pro.ter_ideregistro= :tercero 
                                and uspr.usu_ideregistro=:usuario
                                and uspr.prg_ideregistro=130
                                and esem.emp_ideregistro=:empresa ";
        
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }


    public function EliminarPropiedad($parametros) {
        $Datos['pro_estado'] = 'E';
        $condicion = "pro_ideregistro =".$parametros['pro_ideregistro'] . " and ter_ideregistro = ".$parametros['tercero']['idtercero'];
        return $this->actualizar($Datos, 'pro_propiedad', $condicion);
    }

}
