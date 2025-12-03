<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * Gestionar Rutas
 *
 * @author oabaquero
 */
class GestionRutasModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    /**
     * Busca las ventas que se encuentra aprobadas
     * @param int $idempresa identificador de la empresa

     * @return int identificador de la Venta 
     */
    public function buscaMunicipiosNuevoModel($idempresa) {

        $data['emp_ideregistro'] = $idempresa;
        $sql = 'Select pry.proyecto_ideregistro idmunicipio, pry.proyecto_nom municipio from proyectos pry inner join empresas emp on emp.empresa_cod=pry.proyecto_codemp where emp.empresa_sevemp  = :emp_ideregistro ';
        return $this->executeQuery($sql, $data);
    }

    public function buscaCiclo($idempresa) {

        $data['idempresa'] = $idempresa;
        $sql = "SELECT cic.cic_ideregistro idciclo, cic.cic_nombre nombre 
                FROM				cic_ciclo cic
                INNER JOIN	ciem_cicempresa ciem ON ciem.cic_ideregistro = cic.cic_ideregistro
                --  INNER JOIN  cipr_cicprograma cipr ON cipr.cic_ideregistro = cic.cic_ideregistro and prg_ideregistro = 60
                WHERE 			ciem.emp_ideregistro = :idempresa and cic.cic_estado ='A'
                ORDER BY 		cic.cic_nombre";
        return $this->executeQuery($sql, $data);
    }

    public function insertarVentaLiquidaciones($liquidaciones) {
        return $this->insertar($liquidaciones, 'hveli_hisvenliquidac', 'sq_hveli_ideregistr');
    }

    public function insertarVentaFinanciada($ventaFinanciada) {
        try {
            $resultado = $this->insertar($ventaFinanciada, 'hvfi_hisvenfinanciacio', 'sq_hvfi_ideregistr');
        } catch (\Exception $e) {
            throw new MyException('Error, No se pudo insertar los Historicos de ventas de Financiaciones', -1);
        }
    }

    public function actualizarVentas($idVenta) {
        $parametros['ven_ideregistro'] = $idVenta;
        $parametros['ven_estado'] = 'P';
        try {
            $resultado = $this->actualizar($parametros, 'ven_venta', 'ven_ideregistro = :ven_ideregistro');
        } catch (\Exception $e) {
            throw new MyException('Error, No se puedo actualizar la Venta, Para editar', -1);
        }
    }

    public function buscarRutas($data, $idEmpresa) {


        $parametros["idempresa"] = $idEmpresa;
        $complementoSql = NULL;
        if (!empty($data['rutnombre'])) {
            $parametros["rut_nombre"] = "%" . strtolower($data['rutnombre']) . "%";
            $complementoSql .= " AND  LOWER(rut_nombre) ilike :rut_nombre ";
        }
        if (!empty($data['ideruta'])) {
            $parametros["rut_ideregistro"] = $data['ideruta'];
            $complementoSql .= " AND rut.rut_ideregistro = :rut_ideregistro";
        }
        if ($data['idciclo'] > 0) {
            $parametros["cic_ideregistro"] = $data['idciclo'];
            $complementoSql .= " AND rut.cic_ideregistro = :cic_ideregistro ";
        }
        $sql = "select rut.rut_ideregistro idruta, rut.rut_nombre nomruta , uni.uni_nombre1 tiporuta, rut.rut_tipo alias
                from rut_ruta rut
                INNER JOIN 	uni_unidad uni on uni.uni_ideregistro = rut.uni_tiporuta
                INNER JOIN  esem_estempresa esem on esem.est_ideregistro = uni.est_ideregistro
                INNER JOIN 		ruem_rutempresa ruem on ruem.rut_ideregistro = rut.rut_ideregistro
                WHERE ruem.emp_ideregistro = :idempresa and esem.emp_ideregistro = :idempresa $complementoSql  ";
        return $this->executeQuery($sql, $parametros);
    }

    public function getMunicipioBarrio($idRuta, $idEmpresa) {
        $parametros['idruta'] = $idRuta;
        $parametros['idempresa'] = $idEmpresa;
        $sql = "select proy.proyecto_nom municipio, barr.barrio_nom barrio , rut.cic_ideregistro idciclo 
                from rut_ruta rut 
                INNER JOIN 		cic_ciclo cic on cic.cic_ideregistro  =  rut.cic_ideregistro
                LEFT JOIN 		mbru_munbarruta mbru  on  mbru.rut_ideregistro = rut.rut_ideregistro
                LEFT JOIN		muba_munbarrio muba on muba.muba_ideregistr = mbru.muba_ideregistr
                LEFT JOIN		barrios barr ON barr.barrio_ideregistro = muba.uni_barrio
                LEFT JOIN		proyectos proy ON proy.proyecto_cod = barr.barrio_codpro
                left  JOIN   empresas emp on emp.empresa_cod = proyecto_codemp and emp.empresa_sevemp = :idempresa
                 WHERE			rut.rut_ideregistro = :idruta and emp.empresa_sevemp is not null
                ORDER BY			barr.barrio_nom;";
        return $this->executeQuery($sql, $parametros);
    }

    public function getPeriodoVencimientos($parametros) {
        $parametros['idruta'] = $parametros['idruta'];
        $idRuta = $parametros['idruta'];
        $parametros['ano'] = $parametros['ano'];
        $sql = "select $idRuta idruta, per.per_ideregistro idperiodo, per.per_nombre nombre, per.per_fecinicial::date fecInicial, per.per_fecfinal::date fecFinal
                , info.* 
                FROM per_periodo per 
                LEFT JOIN (
                            select  rupe.rupe_ideregistr idrupe,
                                    rupe.rupe_fecvence::date fecvencimiento, 
                                    rupe.rupe_fecsuspens::date fecsuspension, rupe.per_ideregistro idperiodorupe,
                                    rut.rut_nombre nomruta
                            from rupe_rutperiodo  rupe 
                            INNER JOIN rut_ruta rut on rut.rut_ideregistro = rupe.rut_ideregistro
                            where rupe.rut_ideregistro = :idruta                            
                )as info on info.idperiodorupe = per.per_ideregistro
                where per.per_estado in ('A','B')
                AND cic_ideregistro in (SELECT cic_ideregistro FROM rut_ruta rut where rut_ideregistro = :idruta) 
                AND date_part('YEAR', per.per_fecinicial) = :ano
                ORDER BY 	per.per_ideorden, per.per_fecfinal";
        return $this->executeQuery($sql, $parametros);
    }

    public function getRutasCiclo($idCiclo, $idEmpresa) {
        $parametros['idciclo'] = $idCiclo;
        $parametros['idempresa'] = $idEmpresa;
        $sql = "select rut.rut_ideregistro idruta, rut.rut_nombre nombre 
                FROM rut_ruta rut 
                INNER JOIN  ruem_rutempresa ruem on ruem.rut_ideregistro  = rut.rut_ideregistro
                WHERE ruem.emp_ideregistro = :idempresa and rut.cic_ideregistro = :idciclo";
        return $this->executeQuery($sql, $parametros);
    }

    public function getAnosPeriodos($idRuta) {
        $parametros['idruta'] = $idRuta;
        $sql = "SELECT distinct (date_part('year', per_fecinicial))ano 
                from per_periodo 
                where cic_ideregistro in (SELECT cic_ideregistro FROM rut_ruta rut where rut_ideregistro = :idruta)  and per_estado <> 'C'";
        return $this->executeQuery($sql, $parametros);
    }

    public function getTipoRutas($idEmpresa) {

        $parametros['idempresa'] = $idEmpresa;
        $sql = "select DISTINCT uni.uni_ideregistro idtipo, uni.uni_nombre1 tiporuta 
                from uni_unidad uni 
                INNER JOIN est_estructura est on est.est_ideregistro = uni.est_ideregistro
                INNER JOIN cla_clase cla on cla.cla_ideregistro = est.cla_ideregistro
                INNER JOIN esem_estempresa esem on esem.est_ideregistro = uni.est_ideregistro
                where cla.cla_ideregistro = 50 and esem.emp_ideregistro = :idempresa";
        return $this->executeQuery($sql, $parametros);
    }

    public function guardaRuta($dataRuta) {
        $parametros = array();
        try {
            $this->setCampo($dataRuta, $parametros, 'nombreRuta', 'rut_nombre');
            $this->setCampo($dataRuta, $parametros, 'aliasRuta', 'rut_tipo');
            $this->setCampo($dataRuta, $parametros, 'idTipoRuta', 'uni_tiporuta');
            $this->setCampo($dataRuta, $parametros, 'idCiclo', 'cic_ideregistro');
            $this->setCampo($dataRuta, $parametros, 'idusuario', 'usu_ideregistro');
            return $this->insertar($parametros, 'rut_ruta', 'sq_rut_ideregistro');
        } catch (\Exception $ex) {
            throw new MyException('Error creando la ruta ', -1);
        }
    }

    public function guardaParametrizacionRuta($dataRuta) {
        $parametros = array();
        try {
            $this->setCampo($dataRuta, $parametros, 'idempresa', 'emp_ideregistro');
            $this->setCampo($dataRuta, $parametros, 'idRuta', 'rut_ideregistro');
            $this->setCampo($dataRuta, $parametros, 'idusuario', 'usu_ideregistro');
            return $this->insertar($parametros, 'ruem_rutempresa', 'sq_ruem_ideregistr');
        } catch (\Exception $ex) {
            throw new MyException('Error creando la ruta por empresa ', -1);
        }
    }

    public function actualizaFechaRutaPeriodo($parametros, $idRutas) {
        try {
            $resultado = $this->actualizar($parametros, 'rupe_rutperiodo', 'rut_ideregistro in  ' . "(" . $idRutas . ")" . ' and per_ideregistro =:per_ideregistro');
            if (empty($resultado)) {
                throw new MyException('No se pudo modificar las fechas de la ruta periodo');
            }
        } catch (\Exception $ex) {
            throw new MyException('Error en la Aplicación; actualizando los datos ', -1);
        }
        return $resultado;
    }

    public function guardaFechaRutaPeriodo($data) {
        try {
            $parametros = array();
            $this->setCampo($data, $parametros, 'estado', 'rupe_estado');
            $this->setCampo($data, $parametros, 'idruta', 'rut_ideregistro');
            $this->setCampo($data, $parametros, 'idperiodo', 'per_ideregistro');
            $this->setCampo($data, $parametros, 'fecvencimiento', 'rupe_fecvence');
            $this->setCampo($data, $parametros, 'fecsuspension', 'rupe_fecsuspens');
            return $this->insertar($parametros, 'rupe_rutperiodo', 'sq_rupe_ideregistr');
        } catch (\Exception $ex) {
            throw new MyException('Error insertando las fechas de vencimiento y suspension ', -1);
        }
    }
    
    public function consultaPeriodoRuta($idPeriodo, $idRuta){
        $parametros['idperiodo'] = $idPeriodo;
        $parametros['idruta'] = $idRuta;
        $sql="select count(*) contador from rupe_rutperiodo where per_ideregistro = :idperiodo and rut_ideregistro = :idruta";
        $resultado =  $this->executeQuery($sql, $parametros);
        return $resultado[0];
    }

}
