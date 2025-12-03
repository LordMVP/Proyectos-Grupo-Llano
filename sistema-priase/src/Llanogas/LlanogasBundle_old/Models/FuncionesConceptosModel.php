<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of TerceroModel
 *
 * @author lmrubio
 */
class FuncionesConceptosModel extends AuditoriaServices {

    //put your code here

    private $genericoModel;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($conexion);
    }

    public function lecturaActualCiclo($idSuscripcion) {

        $parametros['idsuscripcion'] = $idSuscripcion;
//        $sql = "
//                SELECT (CASE COALESCE((select COALESCE(lec.lec_actual,0) lecturaactual 
//                                from lec_lectura lec 
//                                INNER JOIN per_periodo per on per.per_ideregistro = lec.per_ideregistro
//                                INNER JOIN fac_factura fac on fac.dsus_ideregistr = lec.dsus_ideregistr  
//                                           and fac.per_ideregistro = lec.per_ideregistro and fac.fac_idepadre is null     
//                                INNER JOIN liq_liquidacion liq on liq.uni_liquidacion = fac.uni_liquidacion                  
//                                where lec.lec_estado='A' and fac.fac_estado ='A' and lec.dsus_ideregistr=:idsuscripcion  and liq.liq_venclasific ='LI'),0) 
//                    WHEN 0 THEN  (SELECT lec_actual from lec_lectura lec
//                                INNER JOIN per_periodo per on per.per_ideregistro = lec.per_ideregistro
//				WHERE lec_estado='A' AND  lec.dsus_ideregistr=:idsuscripcion   and per.per_estado='A')  
//                        ELSE  
//                               COALESCE((select COALESCE(lec.lec_actual,0) lecturaactual  
//                                from lec_lectura lec 
//                                INNER JOIN per_periodo per on per.per_ideregistro = lec.per_ideregistro
//                                INNER JOIN fac_factura fac on fac.dsus_ideregistr = lec.dsus_ideregistr  
//                                           and fac.per_ideregistro = lec.per_ideregistro and fac.fac_idepadre is null     
//                                INNER JOIN liq_liquidacion liq on liq.uni_liquidacion = fac.uni_liquidacion                  
//                                where lec.lec_estado='A' and fac.fac_estado ='A' and lec.dsus_ideregistr=:idsuscripcion  and liq.liq_venclasific ='LI'),0)   
//                   END ) lecturaactual ";
//        $sql = "select COALESCE(lec.lec_actual,0) lecturaactual
//                from lec_lectura lec 
//                INNER JOIN per_periodo per on per.per_ideregistro = lec.per_ideregistro
//                INNER JOIN fac_factura fac on fac.dsus_ideregistr = lec.dsus_ideregistr  
//                           and fac.per_ideregistro = lec.per_ideregistro and fac.fac_idepadre is null     
//                INNER JOIN liq_liquidacion liq on liq.uni_liquidacion = fac.uni_liquidacion                  
//                WHERE lec.lec_estado='A' and fac.fac_estado ='A' and lec.dsus_ideregistr=:idsuscripcion
//                      and liq.liq_venclasific ='LI' and per.per_estado ='A' ";
//        $sql = "SELECT
//                    lec.lec_actual lecturaactual
//                FROM
//                    lec_lectura lec
//                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = lec.dsus_ideregistr
//                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = lec.cic_ideregistro
//                AND cic.cic_anoactual = lec.cic_ano
//                INNER JOIN per_periodo per ON per.per_ideregistro = lec.per_ideregistro
//                WHERE lec.dsus_ideregistr = :idsuscripcion AND per.per_estado = 'A' AND lec.lec_estado ='A' ";
        $sql = "SELECT  COALESCE((select COALESCE(lec.lec_actual,0) 
                                from lec_lectura lec
                                  INNER JOIN per_periodo per on per.per_ideregistro = lec.per_ideregistro
                                 where lec.lec_estado='A' and lec.dsus_ideregistr = :idsuscripcion  
                                   and per.per_ideregistro = lec.per_ideregistro and per.per_estado ='A' ) ,0) as lecturaactual";

        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            $resultado = $this->consumoMtrsUltimoProcesado($idSuscripcion);
            if ($resultado[0]['lecturaactual'] == -1) {
                throw new MyException('No se encontró la lectura actual ' . $idSuscripcion);
            }
        }
        return $resultado[0];
    }

    public function factor_correccion($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT
                    dsus.dsus_factor factor
                FROM
                    dsus_detsuscrip dsus
                 WHERE dsus.dsus_ideregistr = :idsuscripcion ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró la suscripcion ' . $idSuscripcion);
        }
        return $resultado[0];
    }

    public function exento($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT cosu.cosu_vlrtotal exento
				FROM dsus_detsuscrip dsus
					INNER JOIN cosu_consuscrip cosu on cosu.dsus_ideregistr=dsus.dsus_ideregistr
				WHERE dsus.dsus_ideregistr = :idsuscripcion  and cosu.uni_concepto=312  AND  
                                now()::date between cosu.cosu_fecinicio::date AND cosu.cosu_fecfinal::date ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function estrato($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "select (case when (select DISTINCT COALESCE(cosu_vlrtotal,0) from cosu_consuscrip cosu 
                where cosu.dsus_ideregistr=dsus.dsus_ideregistr and cosu.uni_concepto in (639,2815) and 
                now()::date between cosu.cosu_fecinicio::date AND cosu.cosu_fecfinal::date)>0
                then (select DISTINCT cosu_vlrtotal from cosu_consuscrip cosu 
                where cosu.dsus_ideregistr=dsus.dsus_ideregistr and cosu.uni_concepto in (639,2815))
                else (dsus.pro_catestrato )
                end) estrato from dsus_detsuscrip dsus
                where dsus.dsus_ideregistr=:idsuscripcion";
        return $this->executeQuery($sql, $parametros);
    }

    public function consumoMtrs($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT  COALESCE((select COALESCE(lec.lec_consumo,0) 
                                from lec_lectura lec
                                  INNER JOIN per_periodo per on per.per_ideregistro = lec.per_ideregistro
                                 where lec.lec_estado='A' and lec.dsus_ideregistr = :idsuscripcion  
                                   and per.per_ideregistro = lec.per_ideregistro and per.per_estado ='A' ) ,0) as consumo";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['consumo'];
    }

    public function consumoMtrsUltimoProcesado($idSuscripcion) {
        $resultado[0] = 0;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "select COALESCE(lec.lec_consumo,0) consumo , COALESCE(lec.lec_actual ,-1 ) lecturaactual
                from lec_lectura lec 
                where lec.lec_estado='P' and dsus_ideregistr=:idsuscripcion  order by lec_fecha desc limit 1 ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            $resultado[0]['consumo'] = 0;
            $resultado[0]['lecturaactual'] = -1;
        }
        return $resultado;
    }

    public function consultarConsumoModificarLecturas($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "select COALESCE(lec.lec_consumo,0) consumo
                from lec_lectura lec 
                where lec.lec_estado='T' and dsus_ideregistr=:idsuscripcion";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error al encontrar el encabezado');
        }
        return $resultado[0]['consumo'];
    }

    public function suspension_cicloactual($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT
                        COALESCE (SUM(ssp.ssp_vlrtotal), 0) suspension
                FROM
                        syr_susreconex syr
                INNER JOIN ssp_suspension ssp ON ssp.syr_ideregistro = syr.syr_ideregistro
                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = syr.dsus_ideregistr
                INNER JOIN per_periodo per ON per.cic_ideregistro = dsus.cic_ideregistro
                WHERE
                        syr.syr_estado = 'P'
                AND per.per_estado = 'A'
                AND syr.per_ideregistro = per.per_ideregistro
                AND syr.dsus_ideregistr = :idsuscripcion
                AND ssp.uni_concepto in (95)";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['suspension'];
    }
    
    public function suspension_externaActual($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT
                        COALESCE (SUM(ssp.ssp_vlrtotal), 0) suspension
                FROM
                        syr_susreconex syr
                INNER JOIN ssp_suspension ssp ON ssp.syr_ideregistro = syr.syr_ideregistro
                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = syr.dsus_ideregistr
                INNER JOIN per_periodo per ON per.cic_ideregistro = dsus.cic_ideregistro
                WHERE
                        syr.syr_estado = 'P'
                AND per.per_estado = 'A'
                AND syr.per_ideregistro = per.per_ideregistro
                AND syr.dsus_ideregistr = :idsuscripcion
                AND ssp.uni_concepto in (1488)";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['suspension'];
    }

    /* public function suspension_cicloactual($idSuscripcion) {
      $parametros['idsuscripcion'] = $idSuscripcion;
      $sql = "select COALESCE(sum(ssp.ssp_vlrtotal),0) suspension from syr_susreconex syr
      inner JOIN ssp_suspension ssp on ssp.syr_ideregistro=syr.syr_ideregistro
      where syr.syr_estado='A' and syr.dsus_ideregistr=:idsuscripcion";
      $resultado = $this->executeQuery($sql, $parametros);
      if (empty($resultado)) {
      return 0;
      }
      return $resultado[0]['suspension'];
      } */

    public function reconexion_cicloactual($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "    SELECT
                            COALESCE (SUM(rco.rco_vlrtotal), 0) reconexion
                    FROM
                            syr_susreconex syr
                    INNER JOIN rco_reconexion rco ON rco.syr_ideregistro = syr.syr_ideregistro
                    INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = syr.dsus_ideregistr
                    INNER JOIN per_periodo per ON per.cic_ideregistro = dsus.cic_ideregistro
                    WHERE
                            syr.syr_estado = 'P'
                    AND per.per_estado = 'A'
                    AND syr.per_ideregistro = per.per_ideregistro
                    AND syr.dsus_ideregistr =:idsuscripcion";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['reconexion'];
    }
/*
 * Se cambia condición que el periodo del encabezado de lecturas sea el mismo que el periodo activo , 
 * solo se evalua la suscripción y el estado A del encabezado 
 */
    public function corte_acometida($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT
                        COALESCE (SUM(ssp.ssp_vlrtotal), 0) corte
                FROM
                        syr_susreconex syr
                INNER JOIN ssp_suspension ssp ON ssp.syr_ideregistro = syr.syr_ideregistro
                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = syr.dsus_ideregistr
                INNER JOIN per_periodo per ON per.cic_ideregistro = dsus.cic_ideregistro
                WHERE
                        syr.syr_estado = 'A'
                AND per.per_estado = 'A'
                AND syr.dsus_ideregistr =:idsuscripcion
                AND ssp.uni_concepto = 350  limit 1";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['corte'];
    }

    /* public function corte_acometida($idSuscripcion) {
      $parametros['idsuscripcion'] = $idSuscripcion;
      $sql = "select COALESCE(sum(ssp.ssp_vlrtotal),0) corte from syr_susreconex syr
      inner JOIN ssp_suspension ssp on ssp.syr_ideregistro=syr.syr_ideregistro
      where syr.syr_estado='A'  and syr.dsus_ideregistr=:idsuscripcion";
      $resultado = $this->executeQuery($sql, $parametros);
      if (empty($resultado)) {
      return 0;
      }
      return $resultado[0]['corte'];
      } */

    public function ICBF($idSuscripcion) {
        $sql = "select count(*) icbf from cosu_consuscrip cosu where cosu.dsus_ideregistr=$idSuscripcion AND cosu.uni_concepto=639 AND 
                now()::date between cosu.cosu_fecinicio::date AND cosu.cosu_fecfinal::date  ";
        return $this->executeQuery($sql)[0]['icbf'];
    }
    
    public function VIP($idSuscripcion) {
        $sql = "select count(*) vip from cosu_consuscrip cosu where cosu.dsus_ideregistr=$idSuscripcion AND cosu.uni_concepto=2815 AND 
                now()::date between cosu.cosu_fecinicio::date AND cosu.cosu_fecfinal::date  ";
        return $this->executeQuery($sql)[0]['vip'];
    }

    public function valorNovedadConceptoSuscripcion($idSuscripcion, $datos) {
        $idconcepto = $datos['idconcepto'];
        $sql = "
                SELECT 
                        COALESCE (
                                (SELECT
                                       sum(dnov.dnov_vlrtotal)
                                FROM
                                dnov_detnovedad dnov
                                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = dnov.dsus_ideregistr
                                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = dsus.cic_ideregistro
                                INNER JOIN per_periodo per ON per.cic_ideregistro = cic.cic_ideregistro
                                INNER JOIN con_concepto con ON con.uni_concepto = dnov.uni_concepto
                                AND cic.cic_ideregistro = dnov.cic_ideregistro
                                AND dnov.per_ideregistro = per.per_ideregistro
                                WHERE
                                     dsus.dsus_ideregistr = $idSuscripcion
                                AND per.per_estado = 'A'
                                AND dnov.uni_concepto = $idconcepto
                                ) , 0 ) valorfuncion ";
        $respuesta = $this->executeQuery($sql)[0]['valorfuncion'];


        $sqlUpdate = "WITH UPDATED AS (UPDATE dnov_detnovedad 
                        SET dnov_estado = 'P'
                        from dnov_detnovedad dnov
                        INNER JOIN (
                                SELECT
                                        dsus.dsus_ideregistr,
                                        dsus.cic_ideregistro,
                                        per.per_ideregistro,
                                        con.uni_concepto
                                FROM
                                        dnov_detnovedad dnov
                                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = dnov.dsus_ideregistr
                                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = dsus.cic_ideregistro
                                INNER JOIN per_periodo per ON per.cic_ideregistro = cic.cic_ideregistro
                                INNER JOIN con_concepto con ON con.uni_concepto = dnov.uni_concepto
                                AND cic.cic_ideregistro = dnov.cic_ideregistro
                                AND dnov.per_ideregistro = per.per_ideregistro
                                WHERE
                                        dsus.dsus_ideregistr = $idSuscripcion AND
                                        per.per_estado = 'A' 
                                 AND dnov.uni_concepto = $idconcepto 
                        ) AS d ON dnov.cic_ideregistro = d.cic_ideregistro and dnov.per_ideregistro = d.per_ideregistro and dnov.dsus_ideregistr = d.dsus_ideregistr
                        and dnov.uni_concepto = d.uni_concepto RETURNING dnov.nov_ideregistro)
                        UPDATE nov_novedad set nov_estado = 'P' where nov_ideregistro in (select DISTINCT nov_ideregistro from UPDATED);";

        $this->executeQuery($sqlUpdate);
        return $respuesta;
    }

    public function IndicadorConsumoPromedio($idsuscripcion) {
        $parametros = array();
        $parametros['idsuscripcion'] = $idsuscripcion;
        $sql = "select count(*) indicador from cosu_consuscrip cosu where cosu.dsus_ideregistr = :idsuscripcion AND cosu.uni_concepto=1127 
                and now()::date between cosu.cosu_fecinicio::date AND cosu.cosu_fecfinal::date ";
        $resultado = $this->executeQuery($sql, $parametros)[0]['indicador'];
        if (empty($resultado) || $resultado == '')
            return 0;
        return $resultado;
    }

    public function calculoConsumoPromedio($idSuscripcion) {
        $parametros = array();
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "select lec_conpromedio promedio from lec_lectura 
				where  dsus_ideregistr = :idsuscripcion  and lec_estado='P' order by lec_fecha desc limit 1";

        $resultado = $this->executeQuery($sql, $parametros)[0]['promedio'];
        if (empty($resultado) || $resultado == '')
            return 0;
        return $resultado;
    }
    
    /**
     * funcion adicional por emergencia COVID 19
     * @param type $idSuscripcion
     * @return int
     */
    
     //* funcion adicional por emergencia COVID 19

    public function porcentajesubsidioalcaldia($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT subsidioalcaldia.porcentaje  porcentaje
                    from dsus_detsuscrip dsus
                    left join cosu_consuscrip cosu on cosu.dsus_ideregistr=dsus.dsus_ideregistr and cosu.uni_concepto in (639,2815)
                               and now()::date BETWEEN cosu.cosu_fecinicio and cosu.cosu_fecfinal
inner join ( select (val.dato::json->>'idmunicipio')::integer idmunicipio,(val.dato::json->>'porcentaje')::numeric porcentaje,
                            (val.dato::json->>'estrato')::smallint estrato, (val.dato::json->>'tipouso')::smallint tipouso
                         from
                            (SELECT json_array_elements_text((par_parametro::JSON->>'PARAMETROS_CONVENIO_ALCALDIA_MUNICIPIO')::json) dato
                            FROM par_parametro) val) subsidioalcaldia on subsidioalcaldia.idmunicipio=dsus.uni_municipio and
                            subsidioalcaldia.estrato = (case when COALESCE(cosu.cosu_vlrtotal,0) >0 then 1 else dsus.pro_catestrato end)
                            and subsidioalcaldia.tipouso= dsus.uni_tipusosuscr
                            where dsus.dsus_ideregistr = :idsuscripcion limit 1";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['porcentaje'];
    }

    
    //* funcion adicional por emergencia COVID 19

        public function calculoCompartoMiEnergia($idSuscripcion,$datos) {
        $parametros = array();
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idconcepto'] = $datos['idconcepto'];
        $sql = "select COALESCE ((SELECT         aportevoluntario.aporte  
                from dsus_detsuscrip dsus
                left join cosu_consuscrip cosu on cosu.dsus_ideregistr=dsus.dsus_ideregistr and cosu.uni_concepto in(639,2815)
                                                         and now()::date BETWEEN cosu.cosu_fecinicio and cosu.cosu_fecfinal
                left join reclamos rec on rec.reclamo_codsus=dsus.dsus_pcodigo and (rec.reclamo_codrec='668' or rec.reclamo_codrec='670')                                        
                inner join ( select (val.dato::json->>'aporte')::numeric aporte,
                                                (val.dato::json->>'estrato')::smallint estrato, (val.dato::json->>'tipouso')::smallint tipouso
                                                , val.idempresa
                                 from                                                                                                                
                                                (SELECT        json_array_elements_text((par_parametro::JSON->>'PARAMETROS_APORTE_COMPARTO_ENERGIA')::json) dato
                                                 , emp_ideregistro idempresa
                                                FROM par_parametro)        val) aportevoluntario        on
                                                aportevoluntario.estrato = (case when COALESCE(cosu.cosu_vlrtotal,0) >0        then 0 else dsus.pro_catestrato end)
                                                and
                                                aportevoluntario.tipouso= dsus.uni_tipusosuscr
                                                and aportevoluntario.idempresa = dsus.emp_ideregistro
                inner join cosu_consuscrip cosuaporte on cosuaporte.dsus_ideregistr=dsus.dsus_ideregistr and cosuaporte.uni_concepto=3132
                                                         and now()::date BETWEEN cosuaporte.cosu_fecinicio::date and cosuaporte.cosu_fecfinal::date
                where  rec.reclamo_codsus is null and dsus.dsus_ideregistr = :idsuscripcion limit 1), 0) valor";

        $resultado = $this->executeQuery($sql, $parametros)[0]['valor'];
        if (empty($resultado) || $resultado == '')
            return 0;
        return $resultado;
    }
    
     public function calculaVlrAporteVoluntario($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT 	aportevoluntario.aporte  aporte 
		from dsus_detsuscrip dsus
		left join cosu_consuscrip cosu on cosu.dsus_ideregistr=dsus.dsus_ideregistr and cosu.uni_concepto=639 
							 and now()::date BETWEEN cosu.cosu_fecinicio and cosu.cosu_fecfinal
		left join reclamos rec on rec.reclamo_codsus=dsus.dsus_pcodigo and (rec.reclamo_codrec='668' or rec.reclamo_codrec='670')					 
		inner join ( select (val.dato::json->>'aporte')::numeric aporte,
						(val.dato::json->>'estrato')::smallint estrato, (val.dato::json->>'tipouso')::smallint tipouso
                                                , val.idempresa
				 from														 
						(SELECT	json_array_elements_text((par_parametro::JSON->>'PARAMETROS_APORTE_COMPARTO_ENERGIA')::json) dato
                                                , emp_ideregistro idempresa
						FROM par_parametro)	val) aportevoluntario	on 
						aportevoluntario.estrato = (case when COALESCE(cosu.cosu_vlrtotal,0) >0	then 0 else dsus.pro_catestrato end) 
						and aportevoluntario.tipouso= dsus.uni_tipusosuscr
                                                and aportevoluntario.idempresa = dsus.emp_ideregistro
		where rec.reclamo_codsus is null and dsus.dsus_ideregistr = :idsuscripcion limit 1";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['aporte'];
    }
    
    // fin funcion adicional por emergencia COVID 19
    
     // fin funcion adicional por OPCION TARIFARIA
    public function vinculopciontarifaria($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "(SELECT 	1  vinculo 
		from dsus_detsuscrip dsus
			left join cosu_consuscrip cosu on cosu.dsus_ideregistr=dsus.dsus_ideregistr and cosu.uni_concepto in (639,2815)
							 and now()::date BETWEEN cosu.cosu_fecinicio and cosu.cosu_fecfinal
			left join dsfo_detsuscripfuera_opt dsfo on dsfo.dsus_ideregistr=dsus.dsus_ideregistr
		where dsfo.dsfo_fecexpira is null  and dsus.dsus_ideregistr = :idsuscripcion and 		
		dsus.pro_catestrato = (case when dsus.dsus_ideregistr in (375609,375612,375610) then dsus.pro_catestrato  when  
													   COALESCE(cosu.cosu_vlrtotal,0) >0	then dsus.pro_catestrato  when dsus.pro_catestrato in (1,2) then dsus.pro_catestrato else 0  end) 
		and dsus.uni_tipusosuscr = (case when dsus.dsus_ideregistr in (375609,375612,375610) then dsus.uni_tipusosuscr when dsus.uni_tipusosuscr=6 then dsus.uni_tipusosuscr else 0  end) 
	and ( SELECT 	count(*)  
			from dsus_detsuscrip dsus 
			inner join fac_factura fac on fac.dsus_ideregistr=dsus.dsus_ideregistr 
			and fac.fac_estado<>'E' and fac.uni_documento=24 
			and  fac.fac_fecha::date  BETWEEN (date_trunc('month', (now()))::date - 30) and now()::date  and fac.fac_ideorigen is null
			inner join factura_emitida facemi on facemi.facemi_codsus=dsus.dsus_pcodigo 
			and facemi.fac_ideregistro=fac.fac_ideregistro 
			and facemi.facemi_est in ('1','2') --and facemi.facemi_tipins='DOMICILIARIA'
		where dsus.dsus_ideregistr=:idsuscripcion
		) >= 1                 
limit 1)
		
		UNION
		
		
		(	SELECT 	2  vinculo  
			from dsus_detsuscrip dsus 
			inner join fac_factura fac on fac.dsus_ideregistr=dsus.dsus_ideregistr 
			and fac.fac_estado<>'E' and fac.uni_documento=24 
			and  fac.fac_fecha::date  BETWEEN (date_trunc('month', (now()))::date - 30) and now()::date  and fac.fac_ideorigen is null
			inner join factura_emitida facemi on facemi.facemi_codsus=dsus.dsus_pcodigo 
			and facemi.fac_ideregistro=fac.fac_ideregistro 
			and facemi.facemi_est in ('1','2') and facemi.facemi_tipins='DOMICILIARIA'
		where dsus.dsus_ideregistr=:idsuscripcion
		ORDER BY fac.fac_ideregistro desc 
		limit 1
		)
	ORDER BY vinculo asc limit 1";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['vinculo'];
    }
    
    // fin funcion adicional por OPCION TARIFARIA       

// Funcion FECF calcula porcentaje por municipio
    
    public function calculaSubsidioPorcentajeMunicipio($idSuscripcion){
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT coalesce((SELECT  raco.raco_valor FROM dsus_detsuscrip dsus 
                INNER JOIN (
                                ( select (val.dato::json->>'idmunicipio')::INTEGER idemunicipio,
                                                                (val.dato::json->>'uniconcepto')::INTEGER ideconcepto
                                                                , val.idempresa
                                                 from														 
                                                                (SELECT	json_array_elements_text((par_parametro::JSON->>'PARAMETROS_PORCENTAJE_FECF_MUNICIPIO')::json) dato
                                                                , emp_ideregistro idempresa
                                                                FROM par_parametro )	as val )  
                ) as subsidioFECF on subsidioFECF.idemunicipio = dsus.uni_municipio and  subsidioFECF.idempresa = dsus.emp_ideregistro
                INNER JOIN raco_ranconcept raco on raco.uni_concepto = subsidioFECF.ideconcepto and dsus.pro_catestrato BETWEEN raco.raco_raninicial and raco.raco_ranfinal
                where dsus.dsus_ideregistr = :idsuscripcion)
                , 0) porcentaje ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['porcentaje'];
    }
    
      public function ConsumoMtrMesAnterior($idSuscripcion){
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT coalesce((SELECT 	facemi.facemi_con::integer  
					from dsus_detsuscrip dsus 
					inner join fac_factura fac on fac.dsus_ideregistr=dsus.dsus_ideregistr 
					and fac.fac_estado<>'E' and fac.uni_documento=24 
				        and  fac.fac_fecha::date  BETWEEN (date_trunc('month', (now()))::date - 30) and now()::date  and fac.fac_ideorigen is null
					inner join factura_emitida facemi on facemi.facemi_codsus=dsus.dsus_pcodigo 
						and facemi.fac_ideregistro=fac.fac_ideregistro 
					and facemi.facemi_est in ('1','2') and facemi.facemi_tipins='DOMICILIARIA'
				where dsus.dsus_ideregistr= :idsuscripcion
				ORDER BY fac.fac_ideregistro desc   
			limit 1), 0) consumoanterior ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return 0;
        }
        return $resultado[0]['consumoanterior'];
    }
      public function getValorTarifaSuperior($idSuscripcion, $resolucion, $idConcepto){
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT * from fn_restornavlrconcepto_v2( $resolucion, $idConcepto, $idSuscripcion ) ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error al obtener el valor de la Tarifa');
        }
        return $resultado[0]['fn_restornavlrconcepto_v2'];
    }
    public function getEmpresahomologa($idSuscripcion, $idEmpresa) {
        $parametros['idsuscripcion'] = $idSuscripcion ; 
        $parametros['idempresa'] = $idEmpresa ; 
        $sql = "select
                    case
                        when homologa.bandera >= 1 then 1
                        else 0
                    end resultado
                from
                    (
                    select
                        COUNT(*) bandera
                    from
                        dsus_detsuscrip dd
                    inner join sus_suscripcion ss on
                        ss.sus_ideregistro = dd.sus_ideregistro
                    inner join dicn_disconven dd2 on
                        dd2.cnre_ideregistr = ss.cnre_ideregistr
                    where
                        dd2.emp_ideregistro = :idempresa
                        and 
                    dd.dsus_ideregistr = :idsuscripcion
                        and dd2.dicn_empfactura = 'S' ) as homologa
        " ; 
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error validando homologación idempresa:'.$idEmpresa );
        }
        return $resultado[0]['resultado'];

    }
        public function getRelacionConceptoSuscripcion($idSuscripcion,$idconcepto) {
        $parametros['idsuscripcion'] = $idSuscripcion ; 
        $parametros['idconcepto'] = $idconcepto; 

        $sql = " select
                    case
                        when consus.bandera >= 1 then 1
                        else 0
                    end resultado
                from
                    (
                    select
                        COUNT(*) bandera
                    from
                        cosu_consuscrip
                    where
                        dsus_ideregistr = :idsuscripcion
                        and uni_concepto =:idconcepto
                        and now()::date between cosu_fecinicio and cosu_fecfinal ) consus

        " ; 
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error validando Relación Suscripcion concepto idconcepto:'.$idconcepto. ' Suscripcion :'.$idSuscripcion );
        }
        return $resultado[0]['resultado'];

    }

    /**
     * Se descartan Conceptos de Marcación de Deshabitado , puerta a puerta , Aplica DINC 
     */
    
    public function getFacturacionPlena($idSuscripcion){

          $parametros['idsuscripcion'] = $idSuscripcion ; 
        $sql = " select
                    (case
                        when validapleno.resultado = 0 then 1
                        else 0
                    end) resultado
                from
                    (
                    select
                        count(*) resultado
                    from
                        cosu_consuscrip cc
                    where
                        dsus_ideregistr = :idsuscripcion
                        and uni_concepto in(5261 , 5263)
                        and 
                    now()::date between cosu_fecinicio ::date and cosu_fecfinal::date ) validapleno " ; 
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error validando Si aplica Tarifa Plena' );
        }
        return $resultado[0]['resultado'];


    }
    /**
     * 
     */

       public function getTAFNA($idSuscripcion){

        $parametros['idsuscripcion'] = $idSuscripcion ; 
        $sql = "  select coalesce ((
                    select hd.tafna_calculado resultado from aseo.hafo_aforos ha 
                    inner join aseo.hdafo_detaforo hd on 
                    hd.hafo_ideregistro = ha.hafo_ideregistro 
                    and hd.dsus_ideregistr = :idsuscripcion 
                    where ha.hafo_estado <> 'Inactivo'), 0 ) resultado" ; 
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error Obteniendo TAFNA' );
        }
        return $resultado[0]['resultado'];


    }

    
}
