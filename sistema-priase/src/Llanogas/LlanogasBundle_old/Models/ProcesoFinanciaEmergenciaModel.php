<?php

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\MyException;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * @author mebonilla
 */
class ProcesoFinanciaEmergenciaModel extends AuditoriaServices {

    /**
     *
     * @var SessionInterface 
     */
    private $sesion;

    /**
     *
     * @var GenericoModel
     */
    private $genericoModel;
    private $genericoDelegado;

    /**
     * Constructor de la clase
     * @param Connection $conexion
     */
    public function __construct(&$conexion = null, &$sesion = null) {
        $this->setConexion($conexion);
        if ($sesion != null) {
            $this->sesion = $sesion;
        }
        $this->genericoModel = new GenericoModel($conexion);
        $this->genericoDelegado = new GenericoDelegado($conexion);
    }

    /**
     * Consulta la información de municipios disponibles segun el id del usuario logueado en la 
     * aplicacion y el id de la empresa a la que pertenece, ademas de coincidir con el contenido
     * digitado en el campo de texto
     * @param string $municipio texto del municipio digitado
     * @return array lista de municipios que coinciden con el parametro de busqueda
     */
    public function consultarMunicipios($municipio) {
        $parametros["codempresa"] = $this->sesion->get("idempresa");
        $parametros["codusuario"] = $this->sesion->get("idusuario");
        $parametros["codprograma"] = PROGRAMA_FINANCIA_EMERGENCIA;
        $parametros["municipio"] = "%" . strtoupper($municipio) . "%";
        $sql = "SELECT
                    pry.proyecto_ideregistro idmunicipio, pry.proyecto_nom municipio
                FROM
                    proyectos pry
                INNER JOIN empresas emp ON emp.empresa_cod = pry.proyecto_codemp
                WHERE
                    emp.empresa_sevemp = :codempresa
              
                AND upper(pry.proyecto_nom) LIKE :municipio LIMIT 100";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function getPeriodoPorCiclo($idCiclo) {
        $parametros['idciclo'] = $idCiclo;
        $sql = "SELECT
                    cic.cic_ideregistro idciclo,
                    cic.cic_anoactual cicloanio,
                    per.per_ideregistro idperiodo,
                    per.per_fecvence fechavencimiento,
                    per.per_fecsuspens fechasuspension
                FROM
                    cic_ciclo cic inner join per_periodo per on per.cic_ideregistro = cic.cic_ideregistro
                WHERE
                    cic.cic_ideregistro =:idciclo AND
                    per.per_estado = 'A' ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    public function cargarSuscripcionesFinanciar($parametros) {

        $concatenaTipoDocumento = "";
        $concatenaDocumento = "";
        $concatenaSuscripcion = "";
        $concatenaCiclo = "";
        if ($parametros["idciclo"] > 0) {
            $concatenaCiclo = " and dsus.cic_ideregistro = :idciclo ";
        }
        if (!empty($parametros['idsuscripcion'])) {
            $concatenaSuscripcion = " and dsus. dsus_ideregistr = :idsuscripcion";
        }
        if (!empty($parametros['idtipodocumentos'])) {
            $concatenaTipoDocumento = "  and fac.uni_tipdocument in  ( " . $parametros['idtipodocumentos'] . ")  ";
        }
        if (!empty($parametros['iddocumentos'])) {
            $concatenaDocumento = "  and fac.uni_documento in  ( " . $parametros['iddocumentos'] . ")  ";
        }
        $sql = "INSERT into temp_financiaemergencia (
                    SELECT  'P', dsus.dsus_ideregistr idsuscripcion, 
                    ter.ter_ideregistro idsolicitante, " . $parametros['numerocuotas'] . " numerocuotas, " . $parametros['liquidacionemergancia'] . "  idliquidacion,fac.cic_ideregistro, per.per_ideregistro,
                    dsus.emp_ideregistro, " . $parametros['idusuario'] . " idusuario , (row_number() OVER () % :numeroprocesos) AS  idproceso, dsus.pro_catestrato estrato
                    , fac.fac_ideregistro idfactura , fac.fac_sdoreal saldofactura, fac.fac_vlrreal,
                    round(( ((SELECT   dfac.dfac_vlrtotal   
				FROM     dfac_detfactura dfac                                
                                WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 202)
                                    *
                                    (SELECT   dfac.dfac_vlrtotal   
                                            FROM     dfac_detfactura dfac                                
                                            WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 591))
                                    -		
                                    COALESCE((SELECT   dfac.dfac_vlrtotal   
                                            FROM     dfac_detfactura dfac                                
                                            WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 36),0)
                                            +
                                            COALESCE((SELECT   dfac.dfac_vlrtotal   
                                            FROM     dfac_detfactura dfac                                
                                            WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 266),0)
                            )
                    )valorfinanciar,
                    0 valornofinanciable,
                    fac.fac_version as version,
                    (SELECT   dfac.dfac_vlrtotal   
			FROM     dfac_detfactura dfac                                
                        WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 202) consumobasico,
                    (SELECT   dfac.dfac_vlrtotal   
			FROM     dfac_detfactura dfac                                
                        WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 203) consumosuperior,
                    (SELECT   dfac.dfac_vlrunitari   
			FROM     dfac_detfactura dfac                                
                        WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 591) tarifaconsumobasico,
                    (fac.fac_vlrreal - fac.fac_sdoreal )  valorpagado,
                    (SELECT   dfac.dfac_vlrtotal   
                        FROM     dfac_detfactura dfac                                
                        WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 36) subsidio,
                    (SELECT   dfac.dfac_vlrunitari   
			FROM     dfac_detfactura dfac                                
                        WHERE    dfac.fac_ideregistro =fac.fac_ideregistro and dfac.uni_concepto = 352) tarifaconsumosuperior,
                    round(( ((SELECT   dfac.dfac_vlrtotal   
			FROM     dfac_detfactura dfac                                
			WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 203)
			*
			(SELECT   dfac.dfac_vlrtotal   
			FROM     dfac_detfactura dfac                                
			WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 352))
			)
		)  totalConsumosuperior, 
                '' mensaje,
                (SELECT   dfac.dfac_sdoreal   
			FROM     dfac_detfactura dfac                                
			WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 42)  Cuenta_cobrar_Consumo_Gas,
                       ( select terfin.ter_ideregistro from ter_tercero terfin 
                         INNER JOIN empresas emp on emp.empresa_sevemp = :idempresa and terfin.ter_documento = emp.empresa_cod) ,
                        (SELECT   dfac.dfac_sdoreal   
			FROM     dfac_detfactura dfac                                
			WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 41) tarifabasica,
			0 tipocaso,
                        fac.uni_tipdocument idtipdocument,
                         COALESCE((SELECT   dfac.dfac_vlrtotal   
                                            FROM     dfac_detfactura dfac                                
                                            WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 3134),0) subsidioalcaldia,
                                            
sum((case WHEN dfac.uni_concepto = 3134 and dfac.dfac_vlrtotal >0 
			THEN (
			
						(select COALESCE ((SELECT datos.porcentaje porcentaje from 
						(
							select 
								(datasub.dato::json->> 'idmunicipio')::integer idmunicipio,(datasub.dato::json->> 'porcentaje')::numeric porcentaje,
								(datasub.dato::json->> 'estrato')::smallint estrato, (datasub.dato::json->> 'tipouso')::smallint tipouso
								from														 
									 (SELECT	json_array_elements_text((datajsonsubsidio::JSON)::json) dato
										FROM cvsb_covidsubsidio where emp_ideregistro = dsus.emp_ideregistro and per_ideregistro = (SELECT    perant.per_ideregistro idperiodo
                                                FROM
                                                per_periodo perant WHERE perant.per_ideregistro < per.per_ideregistro and perant.cic_ideregistro = per.cic_ideregistro
                                                and
                                                per.per_estado = 'A'  
                                                and    date_part('YEAR', perant.per_fecfinal) = date_part('YEAR', now()::date) 
                                                order by perant.per_ideregistro desc  limit 1  )	
										)	datasub
						) 	as datos
								where datos.idmunicipio = dsus.uni_municipio
								and  datos.tipouso = dsus.uni_tipusosuscr
						and  datos.estrato = dsus.pro_catestrato ) ,0))::integer 

			) else 0 END)) porcentaje

																
                    FROM		 dsus_detsuscrip dsus 
                    inner join ter_tercero ter on ter.ter_ideregistro=dsus.ter_ideregistro
                    inner join proyectos pry on pry.proyecto_ideregistro=dsus.uni_municipio
                    INNER JOIN per_periodo per on per.cic_ideregistro = dsus.cic_ideregistro and per.per_estado = 'A'
                    inner join fac_factura fac  on fac.dsus_ideregistr=dsus.dsus_ideregistr
                    INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro = fac.fac_ideregistro 
										
                    WHERE  dsus.pro_catestrato in (".$parametros['estrato'].") 
                    AND dsus.uni_tipusosuscr = :tipusosuscr
                    AND dsus.emp_ideregistro = :idempresa 
                    AND fac.fac_sdoreal > :saldobaseemergencia  and fac.fac_estado = 'A' and fac.fac_idepadre is null and fac.fac_ideorigen is null 
                    $concatenaDocumento 
										
                    $concatenaSuscripcion
                    and dsus.dsus_estado = 'A'
										
                    $concatenaTipoDocumento
                    $concatenaCiclo
                    and fac.per_ideregistro  = (SELECT    perant.per_ideregistro idperiodo
                                                FROM
                                                per_periodo perant WHERE perant.per_ideregistro < per.per_ideregistro and perant.cic_ideregistro = per.cic_ideregistro
                                                and
                                                per.per_estado = 'A'  
                                                and    date_part('YEAR', perant.per_fecfinal) = date_part('YEAR', now()::date) 
                                                order by perant.per_ideregistro desc  limit 1  )										
                    GROUP BY dsus.dsus_ideregistr ,fac.fac_ideregistro ,ter.ter_ideregistro ,fac.cic_ideregistro, per.per_ideregistro
                    
union 
	
-- BUSCA LAS SUSCRIPCIONES QUE EN EL PERIODO DE FACTURA SE APLICO ICBF Ó VIP (639,2815)

SELECT  

 'P', dsus.dsus_ideregistr idsuscripcion, 
                    ter.ter_ideregistro idsolicitante, " . $parametros['numerocuotas'] . " numerocuotas, " . $parametros['liquidacionemergancia'] . "  idliquidacion,fac.cic_ideregistro, per.per_ideregistro,
                    dsus.emp_ideregistro, " . $parametros['idusuario'] . " idusuario , (row_number() OVER () % :numeroprocesos ) AS  idproceso, dsus.pro_catestrato estrato
                    , fac.fac_ideregistro idfactura , fac.fac_sdoreal saldofactura, fac.fac_vlrreal,
                    round(( ((SELECT   dfac.dfac_vlrtotal   
				FROM     dfac_detfactura dfac                                
                                WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 202)
                                    *
                                    (SELECT   dfac.dfac_vlrtotal   
                                            FROM     dfac_detfactura dfac                                
                                            WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 591))
                                    -		
                                     COALESCE((SELECT   dfac.dfac_vlrtotal   
                                            FROM     dfac_detfactura dfac                                
                                            WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 36),0)
                                            +
                                            COALESCE((SELECT   dfac.dfac_vlrtotal   
                                            FROM     dfac_detfactura dfac                                
                                            WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 266),0)
                            )
                    )valorfinanciar,
                    0 valornofinanciable,
                    fac.fac_version as version,
                    (SELECT   dfac.dfac_vlrtotal   
			FROM     dfac_detfactura dfac                                
                        WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 202) consumobasico,
                    (SELECT   dfac.dfac_vlrtotal   
			FROM     dfac_detfactura dfac                                
                        WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 203) consumosuperior,
                    (SELECT   dfac.dfac_vlrunitari   
			FROM     dfac_detfactura dfac                                
                        WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 591) tarifaconsumobasico,
                    (fac.fac_vlrreal - fac.fac_sdoreal )  valorpagado,
                    (SELECT   dfac.dfac_vlrtotal   
                        FROM     dfac_detfactura dfac                                
                        WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 36) subsidio,
                    (SELECT   dfac.dfac_vlrunitari   
			FROM     dfac_detfactura dfac                                
                        WHERE    dfac.fac_ideregistro =fac.fac_ideregistro and dfac.uni_concepto = 352) tarifaconsumosuperior,
                    round(( ((SELECT   dfac.dfac_vlrtotal   
			FROM     dfac_detfactura dfac                                
			WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 203)
			*
			(SELECT   dfac.dfac_vlrtotal   
			FROM     dfac_detfactura dfac                                
			WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 352))
			)
		)  totalConsumosuperior, 
                '' mensaje,
                (SELECT   dfac.dfac_sdoreal   
			FROM     dfac_detfactura dfac                                
			WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 42)  Cuenta_cobrar_Consumo_Gas,
                       ( select terfin.ter_ideregistro from ter_tercero terfin 
                        INNER JOIN empresas emp on emp.empresa_sevemp = :idempresa and terfin.ter_documento = emp.empresa_cod) ,
                        (SELECT   dfac.dfac_sdoreal   
			FROM     dfac_detfactura dfac                                
			WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 41) tarifabasica,
			0 tipocaso,
                        fac.uni_tipdocument idtipdocument,
                         COALESCE((SELECT   dfac.dfac_vlrtotal   
                                            FROM     dfac_detfactura dfac                                
                                            WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 3134),0) subsidioalcaldia,
                                            
sum((case WHEN dfac.uni_concepto = 3134 and dfac.dfac_vlrtotal >0 
			THEN (
			
						(select COALESCE ((SELECT datos.porcentaje porcentaje from 
						(
							select 
								(datasub.dato::json->> 'idmunicipio')::integer idmunicipio,(datasub.dato::json->> 'porcentaje')::numeric porcentaje,
								(datasub.dato::json->> 'estrato')::smallint estrato, (datasub.dato::json->> 'tipouso')::smallint tipouso
								from														 
									 (SELECT	json_array_elements_text((datajsonsubsidio::JSON)::json) dato
										FROM cvsb_covidsubsidio where emp_ideregistro = dsus.emp_ideregistro and per_ideregistro = (SELECT    perant.per_ideregistro idperiodo
                                                FROM
                                                per_periodo perant WHERE perant.per_ideregistro < per.per_ideregistro and perant.cic_ideregistro = per.cic_ideregistro
                                                and
                                                per.per_estado = 'A'  
                                                and    date_part('YEAR', perant.per_fecfinal) = date_part('YEAR', now()::date) 
                                                order by perant.per_ideregistro desc  limit 1  )	
										)	datasub
						) 	as datos
								where datos.idmunicipio = dsus.uni_municipio
								and  datos.tipouso = dsus.uni_tipusosuscr
						and  datos.estrato = dsus.pro_catestrato ) ,0))::integer 

			) else 0 END)) porcentaje

																
                    FROM		 dsus_detsuscrip dsus 
                    INNER JOIN cosu_consuscrip cosu on cosu.dsus_ideregistr = dsus.dsus_ideregistr and cosu.uni_concepto in (639,2815)
			inner join ter_tercero ter on ter.ter_ideregistro=dsus.ter_ideregistro
                    inner join proyectos pry on pry.proyecto_ideregistro=dsus.uni_municipio
                    INNER JOIN per_periodo per on per.cic_ideregistro = dsus.cic_ideregistro and per.per_estado = 'A'
                    inner join fac_factura fac  on fac.dsus_ideregistr=dsus.dsus_ideregistr
                    INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro = fac.fac_ideregistro and ((dfac.uni_concepto = 639 and dfac.dfac_vlrtotal >0 ) or (dfac.uni_concepto = 2815 and dfac.dfac_vlrtotal >0 ))
										
                    WHERE  
                     dsus.emp_ideregistro = :idempresa 
                    AND fac.fac_sdoreal > :saldobaseemergencia and fac.fac_estado = 'A' and fac.fac_idepadre is null and fac.fac_ideorigen is null 
                    $concatenaDocumento
                    $concatenaSuscripcion
                    and dsus.dsus_estado = 'A'
                    $concatenaTipoDocumento
                    $concatenaCiclo
                    and fac.per_ideregistro  = (SELECT    perant.per_ideregistro idperiodo
                                                FROM
                                                per_periodo perant WHERE perant.per_ideregistro < per.per_ideregistro and perant.cic_ideregistro = per.cic_ideregistro
                                                and
                                                per.per_estado = 'A'  
                                                and    date_part('YEAR', perant.per_fecfinal) = date_part('YEAR', now()::date) 
                                                order by perant.per_ideregistro desc  limit 1  )	
															
        and dsus.dsus_ideregistr not in (
                    SELECT  dsus.dsus_ideregistr
																
                    FROM		 dsus_detsuscrip dsus 
                    INNER JOIN per_periodo per on per.cic_ideregistro = dsus.cic_ideregistro and per.per_estado = 'A'
                    inner join fac_factura fac  on fac.dsus_ideregistr=dsus.dsus_ideregistr
                    INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro = fac.fac_ideregistro 
										
                    WHERE  dsus.pro_catestrato in (".$parametros['estrato'].") 
                    AND dsus.uni_tipusosuscr =:tipusosuscr
                    AND dsus.emp_ideregistro = :idempresa 
                    AND fac.fac_sdoreal > :saldobaseemergencia  and fac.fac_estado = 'A' and fac.fac_idepadre is null and fac.fac_ideorigen is null 
                    $concatenaDocumento
                    $concatenaSuscripcion
                    and dsus.dsus_estado = 'A'
			$concatenaCiclo
                    and fac.per_ideregistro  = (SELECT    perant.per_ideregistro idperiodo
                                                FROM
                                                per_periodo perant WHERE perant.per_ideregistro < per.per_ideregistro and perant.cic_ideregistro = per.cic_ideregistro
                                                and
                                                per.per_estado = 'A'  
                                                and    date_part('YEAR', perant.per_fecfinal) = date_part('YEAR', now()::date) 
                                                order by perant.per_ideregistro desc  limit 1  )										)									
                    GROUP BY dsus.dsus_ideregistr ,fac.fac_ideregistro ,ter.ter_ideregistro ,fac.cic_ideregistro, per.per_ideregistro
			
UNION

-- Consulta los clientes Residenciales Estrato 3,4 para financiacion a 24 meses  y con interes
            SELECT  'P', dsus.dsus_ideregistr idsuscripcion, 
                    ter.ter_ideregistro idsolicitante, 
										24 numerocuotas, 
										3135  idliquidacion,fac.cic_ideregistro, per.per_ideregistro,
                    dsus.emp_ideregistro, 
										" . $parametros['idusuario'] . " idusuario , 
										
										(row_number() OVER () % :numeroprocesos) AS  idproceso, 
										dsus.pro_catestrato estrato
                    , fac.fac_ideregistro idfactura , fac.fac_sdoreal saldofactura, fac.fac_vlrreal,
                    round(( ((SELECT   dfac.dfac_vlrtotal   
				FROM     dfac_detfactura dfac                                
                                WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 202)
                                    *
                                    (SELECT   dfac.dfac_vlrtotal   
                                            FROM     dfac_detfactura dfac                                
                                            WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 591))
                                    -		
                                     COALESCE((SELECT   dfac.dfac_vlrtotal   
                                            FROM     dfac_detfactura dfac                                
                                            WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 36),0)
                                            +
                                            COALESCE((SELECT   dfac.dfac_vlrtotal   
                                            FROM     dfac_detfactura dfac                                
                                            WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 266),0)
                            )
                    )valorfinanciar,
                    0 valornofinanciable,
                    fac.fac_version as version,
                    (SELECT   dfac.dfac_vlrtotal   
			FROM     dfac_detfactura dfac                                
                        WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 202) consumobasico,
                    (SELECT   dfac.dfac_vlrtotal   
			FROM     dfac_detfactura dfac                                
                        WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 203) consumosuperior,
                    (SELECT   dfac.dfac_vlrunitari   
			FROM     dfac_detfactura dfac                                
                        WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 591) tarifaconsumobasico,
                    (fac.fac_vlrreal - fac.fac_sdoreal )  valorpagado,
                    (SELECT   dfac.dfac_vlrtotal   
                        FROM     dfac_detfactura dfac                                
                        WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 36) subsidio,
                    (SELECT   dfac.dfac_vlrunitari   
			FROM     dfac_detfactura dfac                                
                        WHERE    dfac.fac_ideregistro =fac.fac_ideregistro and dfac.uni_concepto = 352) tarifaconsumosuperior,
                    round(( ((SELECT   dfac.dfac_vlrtotal   
			FROM     dfac_detfactura dfac                                
			WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 203)
			*
			(SELECT   dfac.dfac_vlrtotal   
			FROM     dfac_detfactura dfac                                
			WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 352))
			)
		)  totalConsumosuperior, 
                '' mensaje,
                (SELECT   dfac.dfac_sdoreal   
			FROM     dfac_detfactura dfac                                
			WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 42)  Cuenta_cobrar_Consumo_Gas,
                       ( select terfin.ter_ideregistro from ter_tercero terfin 
                         INNER JOIN empresas emp on emp.empresa_sevemp =  :idempresa 
												 and terfin.ter_documento = emp.empresa_cod) ,
       (SELECT   dfac.dfac_sdoreal   
					FROM     dfac_detfactura dfac                                
						WHERE    dfac.fac_ideregistro = fac.fac_ideregistro 
						and dfac.uni_concepto = 41) tarifabasica,
			1 tipocaso,
                        fac.uni_tipdocument idtipdocument,
                         COALESCE((SELECT   dfac.dfac_vlrtotal   
                                            FROM     dfac_detfactura dfac                                
                                            WHERE    dfac.fac_ideregistro = fac.fac_ideregistro and dfac.uni_concepto = 3134),0) subsidioalcaldia,
                                            
sum((case WHEN dfac.uni_concepto = 3134 and dfac.dfac_vlrtotal >0 
			THEN (
			
						(select COALESCE ((SELECT datos.porcentaje porcentaje from 
						(
							select 
								(datasub.dato::json->> 'idmunicipio')::integer idmunicipio,(datasub.dato::json->> 'porcentaje')::numeric porcentaje,
								(datasub.dato::json->> 'estrato')::smallint estrato, (datasub.dato::json->> 'tipouso')::smallint tipouso
								from														 
									 (SELECT	json_array_elements_text((datajsonsubsidio::JSON)::json) dato
										FROM cvsb_covidsubsidio where emp_ideregistro = dsus.emp_ideregistro and per_ideregistro = (SELECT    perant.per_ideregistro idperiodo
                                                FROM
                                                per_periodo perant WHERE perant.per_ideregistro < per.per_ideregistro and perant.cic_ideregistro = per.cic_ideregistro
                                                and
                                                per.per_estado = 'A'  
                                                and    date_part('YEAR', perant.per_fecfinal) = date_part('YEAR', now()::date) 
                                                order by perant.per_ideregistro desc  limit 1  )	
										)	datasub
						) 	as datos
								where datos.idmunicipio = dsus.uni_municipio
								and  datos.tipouso = dsus.uni_tipusosuscr
						and  datos.estrato = dsus.pro_catestrato ) ,0))::integer 

			) else 0 END)) porcentaje

																
                    FROM		 dsus_detsuscrip dsus 
                    inner join ter_tercero ter on ter.ter_ideregistro=dsus.ter_ideregistro
                    inner join proyectos pry on pry.proyecto_ideregistro=dsus.uni_municipio
                    INNER JOIN per_periodo per on per.cic_ideregistro = dsus.cic_ideregistro and per.per_estado = 'A'
                    inner join fac_factura fac  on fac.dsus_ideregistr=dsus.dsus_ideregistr
                    INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro = fac.fac_ideregistro 
										
										
                    WHERE  dsus.pro_catestrato in (3,4) 
                    AND dsus.uni_tipusosuscr = 6
                    AND dsus.emp_ideregistro = :idempresa 
                    AND fac.fac_sdoreal > 0  
		    and fac.fac_estado = 'A' and fac.fac_idepadre is null and fac.fac_ideorigen is null 
                    and fac.uni_documento = 24 
										
                    $concatenaSuscripcion
                    and dsus.dsus_estado = 'A'
		    and fac.uni_tipdocument = 302
										
                    $concatenaCiclo
										
                    and fac.per_ideregistro  = (SELECT    perant.per_ideregistro idperiodo
                                                FROM
                                                per_periodo perant WHERE perant.per_ideregistro < per.per_ideregistro and perant.cic_ideregistro = per.cic_ideregistro
                                                and
                                                per.per_estado = 'A'  
                                                and    date_part('YEAR', perant.per_fecfinal) = date_part('YEAR', now()::date) 
                                                order by perant.per_ideregistro desc  limit 1  )
                                                
 and dsus.dsus_ideregistr not in (
SELECT dsus.dsus_ideregistr 
FROM		 dsus_detsuscrip dsus 
                    INNER JOIN cosu_consuscrip cosu on cosu.dsus_ideregistr = dsus.dsus_ideregistr and cosu.uni_concepto in (639,2815)
                    INNER JOIN per_periodo per on per.cic_ideregistro = dsus.cic_ideregistro and per.per_estado = 'A'
                    inner join fac_factura fac  on fac.dsus_ideregistr=dsus.dsus_ideregistr
                    INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro = fac.fac_ideregistro and ((dfac.uni_concepto = 639 and dfac.dfac_vlrtotal >0 ) or (dfac.uni_concepto = 2815 and dfac.dfac_vlrtotal >0 ))
										
                    WHERE  
                     dsus.emp_ideregistro = :idempresa  
                    AND fac.fac_sdoreal > :saldobaseemergencia and fac.fac_estado = 'A' and fac.fac_idepadre is null and fac.fac_ideorigen is null 
                    $concatenaDocumento
                    $concatenaSuscripcion
                  and dsus.dsus_estado = 'A'
                    $concatenaTipoDocumento
                    $concatenaCiclo
                    and fac.per_ideregistro  = (SELECT    perant.per_ideregistro idperiodo
                                                FROM
                                                per_periodo perant WHERE perant.per_ideregistro < per.per_ideregistro and perant.cic_ideregistro = per.cic_ideregistro
                                                and
                                                per.per_estado = 'A'  
                                                and    date_part('YEAR', perant.per_fecfinal) = date_part('YEAR', now()::date) 
                                                order by perant.per_ideregistro desc  limit 1  )
)
                    GROUP BY dsus.dsus_ideregistr ,fac.fac_ideregistro ,ter.ter_ideregistro ,fac.cic_ideregistro, per.per_ideregistro
										
			
					
										
										
										
                )";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }
    public function cargarSuscripcionesFinanciarPotenza($parametros) {
        $sql = " INSERT into temp_financiaemergenciapotenza (
                SELECT 'P' estado, fac.dsus_ideregistr idsuscripcion, ter.ter_ideregistro ter_idesolicita ,
                tep.numerocuotas, 3139 idliquidacion, fac.cic_ideregistro, per.per_ideregistro idperiodo, fac.emp_ideregistro, " . $parametros['idusuario'] . " idusuario, (row_number() OVER () % " .$parametros["numeroprocesos"] . " ) AS  idproceso,
                fac.fac_ideregistro idfactura, fac.fac_sdoreal saldo, fac.fac_vlrreal, tep.valorfinanciar valorfinanciar, fac.fac_version versio,
                (fac.fac_vlrreal -fac.fac_sdoreal) valorpagado, '' mensaje,
		( select terfin.ter_ideregistro from ter_tercero terfin 
		 INNER JOIN empresas emp on emp.empresa_sevemp = fac.emp_ideregistro 
		 and terfin.ter_documento = emp.empresa_cod)	 identidadfinanciera,
		 1 tipocaso, fac.uni_tipdocument idtipodocumento
                from temp_archivofinancia tep 
                INNER JOIN  fac_factura fac on fac.fac_ideregistro = tep.fac_ideregistro
                INNER JOIN  ter_tercero ter on ter.ter_ideregistro = fac.ter_ideregistro
                INNER JOIN  per_periodo per on per.cic_ideregistro = fac.cic_ideregistro and per.per_estado = 'A'
                WHERE fac.emp_ideregistro = :idempresa
                )";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function getFacturaPorSuscripcionesDocumentos($parametros) {
        $concatenaDocumento = "";
        if (!empty($parametros['iddocumentos'])) {
            $concatenaDocumento = "  and fac.uni_documento in  ( " . $parametros['iddocumentos'] . ")  ";
        }
        if (!empty($parametros['idtipodocumentos'])) {
            $concatenaTipoDocumento = "  and fac.uni_tipdocument in  ( " . $parametros['idtipodocumentos'] . ")  ";
        }
        $sql = "select 
                fac.uni_tipdocument idtipodocumento
                from fac_factura fac 
                where fac.dsus_ideregistr = :idsuscripcion 
                AND fac.fac_sdoreal >0 and fac.fac_estado = 'A' 
                and fac.fac_idepadre is null 
                $concatenaDocumento
                $concatenaTipoDocumento
                GROUP BY $concatenaDocumento
                $concatenaTipoDocumento";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function getLiquidacionEmergencia($data) {
        $parametros['idtipodocumentoemergencia'] = $data['idtipodocumentoemergencia'];
        $parametros['idempresa'] = $data['idempresa'];
        $sql = " SELECT
                            uni_liquidacion idliquidacion,
                            liq_nombre liquidacion,
                            liq.liq_tipcuota tipocuota,
                            uni_documento iddocumento,
                            liq.uni_tipdocument idtipodocumento,
                            tido.tido_maxcuofinancia maximoplazo,
                            tido.tido_maxcuounifica maximoplazoreunifica,
                            tido.tido_maxcuoreestruc maximoplazoreestructura,
                            tido.tido_finvencido financiarvencidas
                    FROM
                            liq_liquidacion liq
                    INNER JOIN esem_estempresa esem on liq.est_liquidacion = esem.est_ideregistro 
                    INNER JOIN tido_tipdocumen tido ON tido.uni_tipdocument = liq.uni_tipdocument
                    WHERE
                            liq.liq_venclasific = 'EM' AND esem.emp_ideregistro = :idempresa 
                            and liq.uni_tipdocument = :idtipodocumentoemergencia";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['idliquidacion'];
    }

    public function validarExisteTablaProceso() {
        $sql = "SELECT count(*) cantidadtablas
                FROM  information_schema.TABLES
                WHERE TABLE_NAME = 'temp_financiaemergencia';";
        $resultado = $this->executeQuery($sql);
        return $resultado[0]['cantidadtablas'];
    }

    public function vaciarTablaResumen($idEmpresa) {
        $sql = "DELETE FROM temp_financiaemergencia WHERE emp_ideregistro = $idEmpresa";
        $this->executeQuery($sql);
    }
    
    public function validarExisteTablaProcesoPotenza() {
        $sql = "SELECT count(*) cantidadtablas
                FROM  information_schema.TABLES
                WHERE TABLE_NAME = 'temp_financiaemergenciapotenza';";
        $resultado = $this->executeQuery($sql);
        return $resultado[0]['cantidadtablas'];
    }

    public function vaciarTablaResumenPotenza($idEmpresa) {
        $sql = "DELETE FROM temp_financiaemergenciapotenza WHERE emp_ideregistro = $idEmpresa";
        $this->executeQuery($sql);
    }
    

    /**
     * Se crea la tabla del resumen del proceso financia emergencia
     * @param int $empresa id de la empresa del usuario en sesion
     * @return type
     */
    public function crearTablaResumenFinanciaEmergencia() {
        $sql = "CREATE TABLE
                IF NOT EXISTS temp_financiaemergencia (
                    estado char DEFAULT 'P',
  idsuscripcion bigint NOT NULL,
  ter_idesolicita bigint ,
	numerocuotas bigint,
	idliquidacion bigint,
  cic_ideregistro integer NOT NULL,
  per_ideregistro integer NOT NULL,
  emp_ideregistro integer NOT NULL,
  usu_ideregistro integer NOT NULL,
	idproceso integer,
	estrato integer,
	fac_ideregistro bigint,
	fac_sdoreal numeric, 
	fac_vlrreal numeric,
	valorfinanciar numeric,
	valornofinanciable numeric	,
	fac_version  integer,
	consumobasico numeric,
	consumosuperior numeric ,
	tarifaconsumobasico numeric,
	valorpagado numeric,
	subsidio numeric,
	tarifaconsumosuperior numeric,
	totalConsumosuperior numeric ,
        mensaje text,
	totalconsumo numeric,        
	identidadfinanciera BIGINT,
        tarifabasica numeric,
        tipocaso  integer,
        idtipdocument integer,
        subsidoalcaldia numeric,
        porcentaje integer
                );";
        $resultado = $this->executeQuery($sql);
        $sqlIndxidsuscripcion = 'CREATE INDEX "IX_emerg_dsus_ideregistr"  ON public.temp_financiaemergencia  USING btree  (idsuscripcion);';
        $this->executeQuery($sqlIndxidsuscripcion);
        $sqlIndxemp_ideregistro = 'CREATE INDEX "IX_emerg_emp_ideregistro"  ON public.temp_financiaemergencia  USING btree  (emp_ideregistro)';
        $this->executeQuery($sqlIndxemp_ideregistro);
        $sqlIndxestado = 'CREATE INDEX "IX_emerg_estado"  ON public.temp_financiaemergencia  USING btree  (estado COLLATE pg_catalog."default")';
        $this->executeQuery($sqlIndxestado);
        $sqlIndxusu_ideregistro = 'CREATE INDEX "IX_emerg_usu_ideregistro"  ON public.temp_financiaemergencia  USING btree  (usu_ideregistro)';
        $this->executeQuery($sqlIndxusu_ideregistro);
        $sqlIndxidproceso = 'CREATE INDEX "IX_emerg_hilo"  ON public.temp_financiaemergencia  USING btree  (idproceso)';
        $this->executeQuery($sqlIndxidproceso);
        return $resultado;
    }
    /**
     * Se crea la tabla del resumen del proceso financia emergencia
     * @param int $empresa id de la empresa del usuario en sesion
     * @return type
     */
    public function crearTablaResumenFinanciaEmergenciaPotenza() {
        $sql = "CREATE TABLE
                IF NOT EXISTS temp_financiaemergenciapotenza (
                    estado char DEFAULT 'P',
  idsuscripcion bigint NOT NULL,
  ter_idesolicita bigint ,
	numerocuotas bigint,
	idliquidacion bigint,
  cic_ideregistro integer NOT NULL,
  per_ideregistro integer NOT NULL,
  emp_ideregistro integer NOT NULL,
  usu_ideregistro integer NOT NULL,
	idproceso integer,
	fac_ideregistro bigint,
	fac_sdoreal numeric, 
	fac_vlrreal numeric,
	valorfinanciar numeric,
	fac_version  integer,
	valorpagado numeric,
	 mensaje text,
	identidadfinanciera BIGINT,
        tipocaso  integer,
        idtipodocumento integer
				);";
        $resultado = $this->executeQuery($sql);
        $sqlIndxidsuscripcion = 'CREATE INDEX "IX_emergp_dsus_ideregistr"  ON public.temp_financiaemergenciapotenza  USING btree  (idsuscripcion);';
        $this->executeQuery($sqlIndxidsuscripcion);
        $sqlIndxemp_ideregistro = 'CREATE INDEX "IX_emergp_emp_ideregistro"  ON public.temp_financiaemergenciapotenza  USING btree  (emp_ideregistro)';
        $this->executeQuery($sqlIndxemp_ideregistro);
        $sqlIndxestado = 'CREATE INDEX "IX_emergp_estado"  ON public.temp_financiaemergenciapotenza  USING btree  (estado COLLATE pg_catalog."default")';
        $this->executeQuery($sqlIndxestado);
        $sqlIndxusu_ideregistro = 'CREATE INDEX "IX_emergp_usu_ideregistro"  ON public.temp_financiaemergenciapotenza  USING btree  (usu_ideregistro)';
        $this->executeQuery($sqlIndxusu_ideregistro);
        $sqlIndxidproceso = 'CREATE INDEX "IX_emergp_hilo"  ON public.temp_financiaemergenciapotenza  USING btree  (idproceso)';
        $this->executeQuery($sqlIndxidproceso);
        return $resultado;
    }
    
    
     public function setTemporalEstado($data) {
        $parametros['estado'] = $data['estado'];
        $parametros['mensaje'] = $data['mensaje'];
        $parametros['idsuscripcion'] = $data['idsuscripcion'];
        $parametros['idproceso'] = $data['idproceso'];
        $resultado = $this->actualizar($parametros, 'temp_financiaemergencia', 'idsuscripcion= :idsuscripcion and idproceso = :idproceso');
        if (empty($resultado)) {
            throw new MyException('No se pudo modificar la financiación temporal');
        }
    }
    
    public function setTemporalEstadoPotenza($data) {
        $parametros['estado'] = $data['estado'];
        $parametros['mensaje'] = $data['mensaje'];
        $parametros['idsuscripcion'] = $data['idsuscripcion'];
        $parametros['idproceso'] = $data['idproceso'];
        $resultado = $this->actualizar($parametros, 'temp_financiaemergenciapotenza', 'idsuscripcion= :idsuscripcion and idproceso = :idproceso');
        if (empty($resultado)) {
            throw new MyException('No se pudo modificar la financiación temporal');
        }
    }

    /**
     * Consulta la cantidad de facturas que se van a procesar con ese ciclo, usuario y empresa
     * @param type $parametros
     * @return type
     */
    public function consultarCantidadSuscripciones($parametros) {
        $sql = " SELECT COUNT(*) cantidadfacturas FROM temp_financiaemergencia temp
                WHERE temp.estado = 'P' AND temp.usu_ideregistro =:idusuario 
                AND temp.emp_ideregistro =:idempresa  ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['cantidadfacturas'];
    }
    /**
     * Consulta la cantidad de facturas que se van a procesar con ese ciclo, usuario y empresa
     * @param type $parametros
     * @return type
     */
    public function consultarCantidadSuscripcionesPotenza($parametros) {
        $sql = " SELECT COUNT(*) cantidadfacturas FROM temp_financiaemergenciapotenza temp
                WHERE temp.estado = 'P' AND temp.usu_ideregistro =:idusuario 
                AND temp.emp_ideregistro =:idempresa  ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['cantidadfacturas'];
    }

    public function consultarSuscripcionesPorProceso($idEmpresa, $idProceso) {
        $parametros['idproceso'] = $idProceso;
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT * FROM temp_financiaemergencia WHERE idproceso =:idproceso AND emp_ideregistro =:idempresa AND estado = 'P' LIMIT 500";
        return $this->executeQuery($sql, $parametros);
    }
    public function consultarSuscripcionesPorProcesoPotenza($idEmpresa, $idProceso) {
        $parametros['idproceso'] = $idProceso;
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT * FROM temp_financiaemergenciapotenza  WHERE idproceso =:idproceso AND emp_ideregistro =:idempresa AND estado = 'P' LIMIT 500";
        return $this->executeQuery($sql, $parametros);
    }

    // <editor-fold desc="Suscripción">  
    /**
     * Consulta de las facturas de una suscripción
     * @param int $idSuscripcion identificador de la suscripción.
     * @param int $idDocumento identificador del documento.
     * @param int $idTipoDocumento identificador del tipo de documento
     * @return array Listado de las facturas.
     */
    public function consultarFacturasPorSuscripcionDocumentoModel($idSuscripcion, $idTipoDocumento) {
        $complemento = '';
        $parametros = array();
        $parametros['idSuscripcion'] = $idSuscripcion;
        $parametros['idTipoDocumento'] = $idTipoDocumento;
        $sql = "SELECT DISTINCT
                        fac.fac_ideregistro idfactura,
                        fac.fac_numero numerofactura,
                        fac.fac_fecha fechafactura,
                        fac.fac_fecvence fechavencimientofactura,
                        fac.uni_documento iddocumento,
                        doc.doc_nombre documento,
                        fac.uni_tipdocument idtipodocumento,
                        tido.tido_nombre tipodocumento,
                        cic.cic_ideregistro idciclo,
                        cic.cic_nombre ciclo,
                        per.per_ideregistro idperiodo,
                        per.per_nombre periodo,
                        (
                                SELECT
                                        SUM (dfac.dfac_sdoreal)
                                FROM
                                        dfac_detfactura dfac
                                INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                                WHERE
                                        dfac.dfac_sdoreal > 0
                                AND con.con_financiable = 'S'
                                AND dfac.fac_ideregistro = fac.fac_ideregistro
                        ) valorfinanciar,
                        (
                                SELECT
                                        SUM (dfac.dfac_sdoreal)
                                FROM
                                        dfac_detfactura dfac
                                INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                                WHERE
                                        dfac.dfac_sdoreal > 0
                                AND con.con_financiable = 'N'
                                AND dfac.fac_ideregistro = fac.fac_ideregistro
                        ) valornofinanciable,
                        fac.fac_vlrreal - fac.fac_sdoreal valorpagado,
                        fac.fac_vlrreal valorfactura,
                        fac.fac_version as version
                FROM
                      fac_factura fac inner join doc_documento doc on doc.uni_documento = fac.uni_documento
                inner join tido_tipdocumen tido on  tido.uni_tipdocument = fac.uni_tipdocument
                inner join  cic_ciclo cic on cic.cic_ideregistro = fac.cic_ideregistro
                inner join per_periodo per on per.per_ideregistro = fac.per_ideregistro
                WHERE (SELECT
                                        SUM (dfac.dfac_sdoreal)
                                FROM
                                        dfac_detfactura dfac
                                INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                                WHERE
                                        dfac.dfac_sdoreal > 0
                                AND con.con_financiable = 'S'
                                AND dfac.fac_ideregistro = fac.fac_ideregistro) > 0
                AND fac.fac_estado = 'A' AND fac.fac_sdoreal > 0 AND fac.fac_idepadre IS NULL
                AND doc.doc_financiable = 'S' AND fac.dsus_ideregistr = :idSuscripcion
                AND fac.uni_tipdocument in ( " . $idTipoDocumento . "  )  $complemento  $complementoconceptos
                ORDER BY fac.fac_fecvence, fac.fac_numero;";
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException('No existen facturas asociadas a financiar para el suscriptor ' . $idSuscripcion, 0);
        }
        return $respuesta;
    }

    /**
     * Consulta la secuencia de la financiacion
     * @return int secuencia
     */
    public function obtenerSecuenciaFinanciacion() {
        $sql = "SELECT nextval('sq_fin_ideregistro') idfinanciacion";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('No creo la secuencia', -1);
        }
        return $resultado[0];
    }

    // <editor-fold desc="Insertar Financiación">  
    /**
     * Genera un nuevo registro de las financiaciones 
     * @param array $financiacion información de una financiación.
     * @return bool TRUE insertar FALSE error
     */
    public function insertarFinanciacionModel($financiacion) {
        $parametros['fin_ideregistro'] = $financiacion['idfinanciacion'];
        $parametros['fin_inicapital'] = $financiacion['valortotalfinanciar'];
        $parametros['fin_sdocapital'] = $financiacion['valortotalfinanciar'];
        $parametros['fin_estado'] = 'A';
        $parametros['fin_fecha'] = 'now()';
        $parametros['cic_ano'] = $financiacion['cicloanio'];
        $parametros['ter_idesolicita'] = $financiacion['idsolicita'];
        $parametros['uni_parentesco'] = $financiacion['idparentesco'];
        $parametros['dsus_ideregistr'] = $financiacion['idsuscripcion'];
        $parametros['ter_ideentfinan'] = $financiacion['identidad'];
        $parametros['cic_ideregistro'] = $financiacion['idciclo'];
        $parametros['per_ideregistro'] = $financiacion['idperiodo'];
        $parametros['emp_ideregistro'] = $financiacion['idempresa'];
        $parametros['usu_ideregistro'] = $financiacion['idusuario'];
        return $this->insertar($parametros, 'fin_financiacio', NULL);
    }

    /**
     * Genera un nuevo registro de las amortizaciones
     * @param array $financiacion información de la financiacion que se quiere amortizar
     * @return bool TRUE insertar FALSE error
     */
    public function insertarAmortizacionFinanciacionModel(&$financiacion) {
        $parametros['cic_ano'] = $financiacion['cicloanio'];
        $parametros['cic_ideregistro'] = $financiacion['idciclo'];
        $parametros['per_ideregistro'] = $financiacion['idperiodo'];
        $parametros['amfi_estado'] = $financiacion['estado'];
        $parametros['amfi_cuoamortiz'] = $financiacion['cuotasamortizadas'];
        $parametros['amfi_fecha'] = 'now()';
        $parametros['amfi_numcuotas'] = $financiacion['numerocuotas'];
        $parametros['fin_ideregistro'] = $financiacion['idfinanciacion'];
        $parametros['uni_liquidacion'] = $financiacion['idliquidacion'];
        $parametros['uni_documento'] = $financiacion['iddocumento'];
        $parametros['uni_tipdocument'] = $financiacion['idtipodocumento'];
        $parametros['dsus_ideregistr'] = $financiacion['idsuscripcion'];
        $parametros['emp_ideregistro'] = $financiacion['idempresa'];
        $parametros['fin_ideregistro'] = $financiacion['idfinanciacion'];
        $parametros['usu_ideregistro'] = $financiacion['idusuario'];
        return $this->insertar($parametros, 'amfi_amofinanci', 'sq_amfi_ideregistr');
    }

    //-------------------  modelo financiaciones  ---------------------------//


    public function obtenerTopeFinanciacionModel($idusuario) {
        $sql = "SELECT
                        usu_topfinancia topefinanciacion
                FROM
                        usuarios
                WHERE
                        usu_ideregistro =$idusuario";
        $resultado = $this->executeQuery($sql);
        return $resultado[0];
    }

    /**
     * permite consultar por tipo de documento
     * @param int $idSuscripcion
     * @param int $idusuario
     * @param int $idempresa
     * @return array tipos de documentos
     */
    public function consultarTipoDocumentoModel($idSuscripcion, $idusuario, $idempresa) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idusuario'] = $idusuario;
        $parametros['idempresa'] = $idempresa;
        $parametros['idprograma'] = PROGRAMA_FINANCIACION;

        $sql = "SELECT DISTINCT
                        fac.uni_tipdocument idtipodocumento,
                        uni.uni_nombre1 tipodocumento
                FROM
                        fac_factura fac
                INNER JOIN uni_unidad uni ON fac.uni_tipdocument = uni.uni_ideregistro
                INNER JOIN prun_prgunidad prun ON fac.uni_tipdocument = prun.uni_ideregistro
                INNER JOIN uspu_usuprgunid uspu ON prun.prun_ideregistr = uspu.prun_ideregistr
                INNER JOIN esem_estempresa esem ON uni.est_ideregistro = esem.est_ideregistro
                WHERE
                    fac.dsus_ideregistr = :idsuscripcion
                AND prun.prg_ideregistro = :idprograma
                AND uspu.usu_ideregistro = :idusuario
                AND esem.emp_ideregistro = :idempresa
                AND fac.fac_sdoreal > 0";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * lista lños documentos vinculados nal programa de financiaciones
     * @param int $idsuscripcion
     * @param int $idusuario
     * @param int $idempresa
     * @param int $idtipodocumento
     * @return Array listado de documentos
     */
    public function consultarDocumentoModel($idsuscripcion, $idusuario, $idempresa, $idtipodocumento) {
        $parametros['idsuscripcion'] = $idsuscripcion;
        $parametros['idusuario'] = $idusuario;
        $parametros['idempresa'] = $idempresa;
        $parametros['idtipodocumento'] = $idtipodocumento;
        $parametros['programafinanciacion'] = PROGRAMA_FINANCIACION;
        $sql = "SELECT DISTINCT
                        fac.uni_documento iddocumento,
                        doc.doc_nombre documento
                FROM
                        fac_factura fac
                INNER JOIN doc_documento doc ON fac.uni_documento = doc.uni_documento
                INNER JOIN prun_prgunidad prun ON fac.uni_documento = prun.uni_ideregistro
                INNER JOIN uspu_usuprgunid uspu ON prun.prun_ideregistr = uspu.prun_ideregistr
                INNER JOIN esem_estempresa esem ON doc.est_documento = esem.est_ideregistro
                WHERE
                        fac.dsus_ideregistr = :idsuscripcion
                AND prun.prg_ideregistro = :programafinanciacion
                AND uspu.usu_ideregistro = :idusuario
                AND esem.emp_ideregistro = :idempresa
                AND doc.doc_financiable = 'S'
                AND fac.uni_tipdocument = :idtipodocumento
                AND fac.fac_sdoreal > 0;";
        return $this->executeQuery($sql, $parametros);
    }

    // </editor-fold>
    // <editor-fold desc="Financiacion">   
    /**
     * Elimina una financiación.
     * @param int $idFinanciacion identificador de la financiación.
     * @throws MyException Error al modificar
     */
    public function cancelarFinanciacion($idFinanciacion) {
        $parametros['fin_ideregistro'] = $idFinanciacion;
        $parametros['fin_estado'] = 'C';
        $resultado = $this->actualizar($parametros, 'fin_financiacio', 'fin_ideregistro= :fin_ideregistro');
        if (empty($resultado)) {
            throw new MyException('No se pudo modificar la financiación');
        }
    }

    /**
     * Consulta el número de una factura a generar.
     * @param array $infoFactura Información de la factura
     * @return array detalle con el nuevo número a generar.
     * @throws MyException Error al consultar
     */
    public function obtenerNumeroFacturaModel($infoFactura) {
        $infoFactura['tipo'] = "FA";
        return $this->genericoModel->obtenerNumeroFactura($infoFactura);
    }

    /**
     * Consulta los detalles de la financiación.
     * @param int $idFinanciacion Identificador de la financiación
     * @return array Listado de los detalles de la financiación.
     */
    public function consultarDetalleFinanciacion($idFinanciacion) {
        $parametros['idfinanciacion'] = $idFinanciacion;
        $sql = 'select 
                dfin.fin_ideregistro idfinanciacion,
                dfin.dfac_ideregistr iddetallefactura,dfin.fac_ideregistro idfactura,
                dfin.dsus_ideregistr idsuscripcion,dfin.uni_liquidacion idliquidacion,
                dfin.uni_concepto idconcepto,
                dfin.dfin_ideregistr iddetallefinanciacion,
                dfin.emp_ideregistro idempresa,
               dfin.dfin_sdoreal saldo 
              from dfin_detfinanci dfin where dfin.fin_ideregistro=:idfinanciacion and dfin_idepadre is null';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta las liquidaciones de las financiaciones
     * @return array Listado de las financiaciones
     */
    public function consultarLiquidacionFinanciacionModel($iddocumento = null, $idtipodocumento = null, $idempresa) {
        $complemento = '';
        if (!empty($iddocumento)) {
            $complemento .= " and uni_documento = $iddocumento ";
        }
        if (!empty($idtipodocumento)) {
            $complemento .= " and liq.uni_tipdocument = $idtipodocumento ";
        }
        $sql = "    SELECT
                            uni_liquidacion idliquidacion,
                            liq_nombre liquidacion,
                            liq.liq_tipcuota tipocuota,
                            uni_documento iddocumento,
                            liq.uni_tipdocument idtipodocumento,
                            tido.tido_maxcuofinancia maximoplazo,
                            tido.tido_maxcuounifica maximoplazoreunifica,
                            tido.tido_maxcuoreestruc maximoplazoreestructura,
                            tido.tido_finvencido financiarvencidas
                    FROM
                            liq_liquidacion liq
                    INNER JOIN esem_estempresa esem on liq.est_liquidacion = esem.est_ideregistro 
                    INNER JOIN tido_tipdocumen tido ON tido.uni_tipdocument = liq.uni_tipdocument
                    WHERE
                            liq.liq_venclasific = 'FI' AND esem.emp_ideregistro =$idempresa" . $complemento
                . " ORDER BY liq_nombre ";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException('No hay liquidaciones disponibles', 0);
        }
        return $respuesta;
    }

    /**
     * permite obtener el interes de la liquidación 
     * @param int $idliquidacion identificador de liquidacion
     * @return float interes de liquidacion  
     * @throws MyException No se encontro tasa de interes
     */
    public function consultarInteresLiquidacionModel($idliquidacion) {
        $sql = "SELECT
                        con.con_formula formulainteres
                FROM
                coli_conliquida coli 
                INNER JOIN con_concepto con ON coli.uni_concepto = con.uni_concepto
                WHERE
                        coli.uni_liquidacion = :idliquidacion
                AND con.con_intfinanciacion = 'S'";
        $parametros['idliquidacion'] = $idliquidacion;
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException('No se encontró tasa de intéres, debe parametrizarla antes para utilizar esta liquidación', -1);
        }
        return $respuesta[0];
    }

    public function consultarInteresIvaLiquidacion($idliquidacion) {
        $sql = "SELECT
                        con.con_formula formulainteres
                FROM
                        con_concepto con
                INNER JOIN core_conrelacio core ON con.uni_concepto = core.uni_concepto
                WHERE
                        core.uni_conrelacion IN (
                                SELECT
                                        con.uni_concepto
                                FROM
                                        coli_conliquida coli
                                INNER JOIN con_concepto con ON coli.uni_concepto = con.uni_concepto
                                WHERE
                                        coli.uni_liquidacion =$idliquidacion
                                AND con.con_intfinanciacion = 'S'
                        );";
        return $this->executeQuery($sql);
    }

    /**
     * Valida que conceptos hacen base en la tasa de inteŕes    
     * @param int $idLiquidacion  identificador de la liquidación.
     * @param array $facturas Listado de las facturas en las que toca validar los conceptos
     * @return array Listado de los conceptos que no hacen base para la tasa de interés.
     */
    public function validarConceptosFinanciacionModel($idLiquidacion, $facturas) {
        $sql = "SELECT DISTINCT
                        dfac.uni_concepto idconcepto,
                        con.con_nombre concepto
                FROM
                        fac_factura fac,
                        dfac_detfactura dfac,
                        con_concepto con
                WHERE
                        fac.fac_ideregistro IN ($facturas)
                AND fac.fac_idepadre IS NULL
                AND fac.fac_ideregistro = dfac.fac_ideregistro
                AND dfac.uni_concepto = con.uni_concepto
                AND dfac.dfac_sdoreal > 0
                AND dfac.uni_concepto NOT IN (
                        SELECT DISTINCT
                                core.uni_conrelacion
                        FROM
                                coli_conliquida coli
                        INNER JOIN core_conrelacio core ON coli.uni_concepto = core.uni_concepto
                        WHERE
                                coli.uni_liquidacion = $idLiquidacion )";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    /**
     * Consulta los detalles de los conceptos.
     * @param int $idFactura identificador de la factura
     * @param string $financiable 'S' es financiable , 'N' No es financiable
     * @return array Listado de los detalles de los conceptos.
     */
    public function consultarDetallesConceptosModel($idFactura, $financiable) {
        $parametros['idfactura'] = $idFactura;
        $parametros['financiable'] = $financiable;
        $sql = "SELECT
                        con.con_nombre concepto,
                        dfac.dfac_sdoreal valor
                FROM
                        dfac_detfactura dfac
                INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                WHERE
                        dfac.fac_ideregistro =:idfactura AND con.con_financiable =:financiable and dfac.dfac_sdoreal>0";
        return $this->executeQuery($sql, $parametros);
    }

    public function actualizarNumeroFinanciacion($idfinanciacion, $idnumero) {
        $parametros['fin_numero'] = $idnumero;
        $parametros['fin_ideregistro'] = $idfinanciacion;
        return $this->actualizar($parametros, 'fin_financiacio', 'fin_ideregistro=:fin_ideregistro');
    }

    /**
     * Crea una nueva nota
     * @param array $info Información de las nota
     * @return int identificador de las nueva nota
     */
    public function insertarNotaModel($info) {
        $cicloperiodo = $this->genericoModel->getCicloPeriodoSuscripcion($info['idsuscripcion']);
        $parametros['not_fecha'] = 'now()';
        $parametros['not_comentario'] = 'Nota Financiación COVID19';
        $parametros['uni_motnota'] = UNIDAD_FINANCIACION;
        $parametros['dsus_ideregistr'] = $info['idsuscripcion'];
        $parametros['cic_ideregistro'] = $info['idciclo'];
        $parametros['per_ideregistro'] = $info['idperiodo'];
        $parametros['est_motnota'] = ESTRUCTURA_NOTA;
        $parametros['emp_ideregistro'] = $info['idempresa'];
        $parametros['cic_ano'] = $cicloperiodo['cicloanio'];
        $parametros['usu_ideregistro'] = $info['idusuario'];
        return $this->insertar($parametros, 'not_nota', 'sq_not_ideregistro');
    }

    /**
     * Consulta la información de la factura
     * @param int $idFactura identificador de la factura
     * @return array Listado de las facturas.
     * @throws MyException Error al consultar la información.
     */
    public function consultarFacturaModel($idFactura) {
        $complemento = " where fac.fac_ideregistro=:idfactura and fac.fac_estado !='F'";
        $parametros['idfactura'] = $idFactura;
        $resultado = $this->genericoModel->getFacturasInformacion($complemento, $parametros);
        if (empty($resultado)) {
            throw new MyException("Error, No se encontraron facturas que se puedan financiar ");
        }
        return $resultado[0];
    }

    /**
     * Obtiene información detallada de la suscripción.
     * @param int $idSuscripcion identificador de la suscripción.
     * @return array Listado de las suscripciones asociadas 
     * @throws MyException Error al consultar la información.
     */
    public function consultarSuscripcionSuscriptorModel($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = '  SELECT 
                    dsus.uni_tipsuscripc idtiposuscripcion,
                    dsus.uni_tipusosuscr idtipousosuscripcion,
                    dsus.ter_ideregistro idtercero,
                    dsus.est_tipusosuscr idestructuratipousosuscripcion,
                    dsus.est_tipsuscripc idestructuratiposuscripcion,
                    ter.uni_tiptercero idtipotercero,
                    dsus.sus_ideregistro idsuscriptor
                  FROM 
                    dsus_detsuscrip dsus inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
                  WHERE
                    dsus.dsus_ideregistr=:idsuscripcion';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException("Error en la información de los datos");
        }
        return $resultado[0];
    }

    /**
     * Consulta los documentos y tipos de documentos por tipo.
     * @param int $idDocumento identificador de la factura.
     * @param int $idTipoDocumento identificador tipo documento
     * @param string $tipo tipo transacción a generar
     * @return array con el listado de los documentos y tipos de documentos
     * @throws MyException Error la insertar
     */
    public function consultarDetalleDocumentoTipoDocumentoModel($idDocumento, $idTipoDocumento, $tipo = "NF") {
        $sql = "select
                 ddot.uni_documento iddocumento
                from 
                 ddot_detdoctipo ddot inner join doti_doctipo doti on ddot.doti_ideregistr=doti.doti_ideregistr
                 inner join uni_unidad uni on ddot.uni_documento=uni.uni_ideregistro
                where 
                 doti.uni_documento=:idDocumento and doti.uni_tipdocument=:idTipoDocumento 
                 and ddot.ddot_tipo='$tipo' ";
        $parametros['idDocumento'] = $idDocumento;
        $parametros['idTipoDocumento'] = $idTipoDocumento;
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException("Error, falta parametrización de documento $idDocumento y tipo documento $idTipoDocumento - tipo $tipo ", -1);
        }
        return $resultado[0];
    }

    /**
     * Consulta los detalles de una factura con el calculo de los saldos.
     * @param int $idFactura identificador de la factura
     * @return array detalle de la factura.
     */
    public function consultarDetalleFacturaSaldoModel($idFactura, $idEmpresa) {
        $concatena = "";
         if($idEmpresa != 325){
            $concatena = " AND con.con_financiable = 'S' and dfac.uni_concepto in (41,42) ";
        }
        $sql = "SELECT
                            fac.fac_ideregistro idfactura,
                            dfac.dfac_ideregistr iddetallefactura,
                            fac.uni_liquidacion idliquidacion,
                            fac.dsus_ideregistr idsuscripcion,
                            dfac.uni_concepto idconcepto,
                            dfac.dfac_vlrunitari valorunitario,
                            dfac.dfac_cantidad cantidad,
                            dfac.dfac_vlrtotal valortotal,
                            dfac.dfac_sdoreal saldo,
                            con.con_metajuste metodo,
                            con.con_precision as precision
                    FROM
                            fac_factura fac
                    INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro = fac.fac_ideregistro 
                    INNER JOIN con_concepto con ON con.uni_concepto = dfac.uni_concepto
                    WHERE
                            fac.fac_idepadre IS NULL 
                    AND fac.fac_ideregistro = :idFactura
                    AND dfac.dfac_sdoreal > 0
                    $concatena";
        $parametros['idFactura'] = $idFactura;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * se permite generar una nueva factura con los saldos de las notas
     * @param array $infoFacturaNotasSaldo
     * @param array $financiacion
     * @return int numero de factura generado
     */
    public function insertarFacturaSaldoModel(&$infoFacturaInicial, &$infoFacturaInicialActualizada, $infoDocumento, &$financiacion) {
        $suscripcion = $this->genericoModel->consultarInformacionSuscripcion($infoFacturaInicial['idsuscripcion']);
        $suscripcion['idsuscripcion'] = $infoFacturaInicial['idsuscripcion'];
        $fechas = $this->genericoDelegado->getFechaFactura($suscripcion, $financiacion);
        $parametros['fac_metgenera'] = 'P';
        $parametros['fac_estado'] = 'H';
        $parametros['fac_fecha'] = 'now()';
        $parametros['fac_fecaprobada'] = 'now()';
        $parametros['fac_fecvence'] = $fechas['fechavencimiento'];
        $parametros['emp_ideregistro'] = $infoFacturaInicial['idempresa'];
        $parametros['sus_ideregistro'] = $infoFacturaInicial['idsuscriptor'];
        $parametros['dsus_ideregistr'] = $infoFacturaInicial['idsuscripcion'];
        $parametros['cic_ano'] = $financiacion['cicloanio'];
        $parametros['uni_tipsuscripc'] = $infoFacturaInicial['idtiposuscripcion'];
        $parametros['uni_tipusosuscr'] = $infoFacturaInicial['idtipousosuscripcion'];
        $parametros['uni_liquidacion'] = $infoFacturaInicial['idliquidacion'];
        $parametros['ter_ideregistro'] = $infoFacturaInicial['idtercero'];
        $parametros['cic_ideregistro'] = $financiacion['idciclo'];
        $parametros['per_ideregistro'] = $financiacion['idperiodo'];
        $parametros['uni_documento'] = $infoDocumento['iddocumento'];
        $parametros['uni_tipdocument'] = $infoFacturaInicial['idtipodocumento'];
        $parametros['hliq_ideregistr'] = 0;
        $parametros['fac_sdoreal'] = $infoFacturaInicialActualizada['saldofactura'];
        $parametros['fac_ideorigen'] = $infoFacturaInicial["idfactura"];
        $parametros['uni_tiptercero'] = $infoFacturaInicial['idtipotercero'];
        $parametros['fac_vlrreal'] = $infoFacturaInicialActualizada['saldofactura'];
        $parametros['usu_ideregistro'] = $financiacion['idusuario'];
        return $this->insertar($parametros, 'fac_factura', 'sq_fac_ideregistro');
    }

    /**
     * Insertar la nueva factura
     * @param array $infoFacturaInicial información de la factura padre
     * @param array $infoSuscripcion información de la suscripción.
     * @param array $infoNotaTipo información del tipo de nota que se generó.
     * @param array $financiacion información de la financiación.
     * @return int identificador de la factura.
     */
    public function insertarFacturaNotaModel(&$infoFacturaInicial, $infoNotaTipo, $financiacion) {
        $suscripcion = $this->genericoModel->consultarInformacionSuscripcion($infoFacturaInicial['idsuscripcion']);
        $suscripcion['idsuscripcion'] = $infoFacturaInicial['idsuscripcion'];
        $fechas = $this->genericoDelegado->getFechaFactura($suscripcion, $financiacion);
        $parametros['fac_metgenera'] = 'P';
        $parametros['fac_estado'] = 'H';
        $parametros['fac_fecha'] = 'now()';
        $parametros['fac_idepadre'] = $infoFacturaInicial["idfactura"];
        $parametros['fac_fecaprobada'] = 'now()';
        $parametros['fac_fecvence'] = $fechas['fechavencimiento'];
        $parametros['emp_ideregistro'] = $infoFacturaInicial['idempresa'];
        $parametros['sus_ideregistro'] = $suscripcion['idsuscriptor'];
        $parametros['dsus_ideregistr'] = $infoFacturaInicial['idsuscripcion'];
        $parametros['cic_ano'] = $financiacion['cicloanio'];
        $parametros['uni_tipsuscripc'] = $suscripcion['idtiposuscripcion'];
        $parametros['uni_tipusosuscr'] = $suscripcion['idtipousosuscripcion'];
        $parametros['uni_liquidacion'] = $infoFacturaInicial['idliquidacion'];
        $parametros['ter_ideregistro'] = $suscripcion['idtercero'];
        $parametros['cic_ideregistro'] = $financiacion['idciclo'];
        $parametros['per_ideregistro'] = $financiacion['idperiodo'];
        $parametros['uni_documento'] = $infoNotaTipo['iddocumento'];
        $parametros['uni_tipdocument'] = $infoFacturaInicial['idtipodocumento'];
        $parametros['hliq_ideregistr'] = 0;
        $parametros ['fac_sdoreal'] = abs($infoFacturaInicial['valorfinanciar']) * -1;
        $parametros['fac_ideorigen'] = $infoFacturaInicial["idfactura"];
        $parametros['uni_tiptercero'] = $suscripcion['idtipotercero'];
        $parametros['fac_vlrreal'] = $parametros ['fac_sdoreal'];
        $parametros['usu_ideregistro'] = $financiacion['idusuario'];
        return $this->insertar($parametros, 'fac_factura', 'sq_fac_ideregistro');
    }

    /**
     * Inserta un nuevo detalle de la financiación.
     * @param array $detalleFinanciacion información del detalle
     * @return bool TRUE insertar FALSE error
     */
    public function insertarDetalleFinanciacionModel($detalleFinanciacion) {
        $parametros['fin_ideregistro'] = $detalleFinanciacion['idfinanciacion'];
        $parametros['dfac_ideregistr'] = $detalleFinanciacion['iddetallefactura'];
        $parametros['fac_ideregistro'] = $detalleFinanciacion['fac_ideregistro'];
        $parametros['dsus_ideregistr'] = $detalleFinanciacion['idsuscripcion'];
        $parametros['uni_liquidacion'] = $detalleFinanciacion['idliquidacion'];
        $parametros['uni_concepto'] = $detalleFinanciacion['idconcepto'];
        $parametros['dfac_vlrunitari'] = $detalleFinanciacion['valorunitario'];
        $parametros['dfac_vlrtotal'] = $detalleFinanciacion['valortotal'];
        $parametros['dfac_sdoreal'] = $detalleFinanciacion['saldo'];
        $parametros['dfin_vlrreal'] = $detalleFinanciacion['valorreal'];
        $parametros['dfin_sdoreal'] = $detalleFinanciacion['saldo'];
        $parametros['cic_ideregistro'] = $detalleFinanciacion['idciclo'];
        $parametros['per_ideregistro'] = $detalleFinanciacion['idperiodo'];
        $parametros['emp_ideregistro'] = $detalleFinanciacion['idempresa'];
        $parametros['usu_ideregistro'] = $detalleFinanciacion['idusuario'];
        $parametros['cic_ano'] = $detalleFinanciacion['cic_ano'];
        return $this->insertar($parametros, 'dfin_detfinanci', 'sq_dfin_ideregistr');
    }

    /**
     * Ingresa un nuevo detalle de una factura.
     * @param array $detalleFactura detalle de la factura
     * @param array $facturaInicial infroamción de la factura inicial.
     * @param array $infoNotaTipo información del documento y tipo de documento de la nota.
     * @return int identificador del detalle generado
     */
    public function insertarDetalleFacturaSaldosModel($detalleFactura) {
        $parametros['dfac_estado'] = 'A';
        $parametros['dfac_ideorigen'] = $detalleFactura['iddetallefactura'];
        $parametros['dfac_cantidad'] = $detalleFactura['cantidad'];
        $parametros['dfac_vlrunitari'] = $detalleFactura['valorunitario'];
        $parametros['dfac_vlrtotal'] = $detalleFactura['valortotal'];
        $parametros ['dfac_vlrreal'] = $detalleFactura['saldo'];
        $parametros['dfac_sdoreal'] = $detalleFactura['saldo'];
        $parametros['fac_ideregistro'] = $detalleFactura['fac_ideregistro'];
        $parametros['uni_concepto'] = $detalleFactura['idconcepto'];
        $parametros['dfac_idepadre'] = $detalleFactura['iddetallefactura'];
        $parametros['dfin_ideregistr'] = $detalleFactura['idfinanciacion'];
        $parametros['usu_ideregistro'] = $detalleFactura['idusuario'];
        return $this->insertar($parametros, 'dfac_detfactura', 'sq_dfac_ideregistr');
    }

    /**
     * Ingresa un nuevo detalle de una factura.
     * @param array $detalleFactura detalle de la factura
     * @return int identificador del detalle generado
     */
    public function insertarDetalleFacturaNotaModel($detalleFactura, $tipo = 'FF') {
        $parametros['dfac_estado'] = 'A';
        $parametros['dfac_ideorigen'] = $detalleFactura['iddetallefactura'];
        $parametros['dfac_cantidad'] = $detalleFactura['cantidad'];
        $parametros['dfac_vlrunitari'] = $detalleFactura['valortotal'];
        $parametros['dfac_vlrtotal'] = $detalleFactura['valortotal'];
        $parametros ['dfac_vlrreal'] = $detalleFactura['valorreal'];
        $parametros['dfac_sdoreal'] = $detalleFactura['saldo'];
        $parametros['fac_ideregistro'] = $detalleFactura['fac_ideregistro'];
        $parametros['uni_concepto'] = $detalleFactura['idconcepto'];
        $parametros['dfac_idepadre'] = ($tipo == 'FF') ? null : $detalleFactura['iddetallefactura'];
        $parametros['usu_ideregistro'] = $detalleFactura['idusuario'];
        return $this->insertar($parametros, 'dfac_detfactura', 'sq_dfac_ideregistr');
    }

    /**
     * Genera una nota a una factura
     * @param int $idNota identificador de la nota
     * @param int  $idDetalleFacturaNota detalle de la factura
     * @param array $detalleFactura información del detalle de la factura
     * @param int $idFacturaPadre identificador de la factura padre
     * @return bool TRUE insertar FALSE error
     */
    public function insertarNotaFacturaModel($idNota, $idDetalleFacturaNota, $detalleFactura, $idFacturaPadre) {
        $parametros['not_ideregistro'] = $idNota;
        //Detalle de la nota en dfac_detfactura
        $parametros['dfac_ideregistr'] = $idDetalleFacturaNota;
        //Encabezado de la factura padre  consultarlo por medio del dfac_ideorigen
        $parametros['fac_ideorigen'] = $idFacturaPadre;
        //detalle de la factura padre
        $parametros['dfac_ideorigen'] = $detalleFactura['iddetallefactura'];
        $parametros['usu_ideregistro'] = $detalleFactura['idusuario'];
        $parametros['fac_ideregistro'] = $detalleFactura['fac_ideregistro'];
        return $this->insertar($parametros, 'nofa_notfactura', 'sq_nofa_ideregistr');
    }

    /**
     * Actualiza la información de una factura.
     * @param array $parametros información de la nueva factura.
     * @return int número de filas afectadas.
     */
    public function actualizarFacturaModel($parametros) {
        return $this->actualizar($parametros, 'fac_factura', 'fac_ideregistro= :fac_ideregistro');
    }

    /**
     * Obtiene financiacion por financiacion
     * @param array $idfinanciacion
     * @return Array información de un archivos adjunto
     */
    public function obtenerDocumentosAdjuntosFinanciacionModel($idfinanciacion) {
        $sql = "SELECT
                        adfi.adfi_ideregistr idficheroadjunto,
                        adfi.adfi_nomarchivo nombrearchivo,
                        adfi.adfi_ruta rutaarchivo,
                        adfi.adfi_tiparchivo tipoarchivo,
                        adfi.fin_ideregistro idfinanciacion
                FROM
                        adfi_adjfinanciacio adfi
                WHERE
                        fin_ideregistro = :idfinanciacion";
        $parametros['idfinanciacion'] = $idfinanciacion;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Se almacenan los ficheros comom adjuntos en la financiación 
     * @param array $infoSoporte
     * @return array información del archivo adjuntoi
     */
    public function insertarAdjuntoFinanciacionModel($infoSoporte) {
        $parametros = array();
        $this->setCampo($infoSoporte, $parametros, 'tipoarchivo', 'adfi_tiparchivo');
        $this->setCampo($infoSoporte, $parametros, 'ruta', 'adfi_ruta');
        $this->setCampo($infoSoporte, $parametros, 'nombrearchivo', 'adfi_nomarchivo');
        $idAdjuntoConsignacion = $this->insertar($parametros, 'adfi_adjfinanciacio', 'sq_adfi_ideregistr');
        $infoSoporte['idarchivo'] = $idAdjuntoConsignacion;
        return $infoSoporte;
    }

    /**
     * Permite actualizar el archivo adjunto incluyendole la financiación almacenada
     * @param int $idarchivo
     * @param int $idfinanciacion
     */
    public function actualizarAdjuntoFinanciacionModel($idarchivo, $idfinanciacion) {
        $sql = 'UPDATE adfi_adjfinanciacio
                SET fin_ideregistro = :idfinanciacion
                WHERE
                        adfi_ideregistr = :idarchivo';
        $parametros['idarchivo'] = $idarchivo;
        $parametros['idfinanciacion'] = $idfinanciacion;
        $this->executeQuery($sql, $parametros);
    }

    /**
     * Obtiene un fichero especifico de financiación
     * @param array $idarchivo
     * @return FicheroAdjunto información de un archivo adjunto
     */
    public function obtenerAdjuntoFinanciacionModel($idarchivo) {
        $sql = "SELECT
                        adfi.adfi_ideregistr idficheroadjunto,
                        adfi.adfi_nomarchivo nombrearchivo,
                        adfi.adfi_ruta rutaarchivo,
                        adfi.adfi_tiparchivo tipoarchivo,
                        adfi.fin_ideregistro idfinanciacion
                FROM
                        adfi_adjfinanciacio adfi
                WHERE
                        adfi_ideregistr = :idarchivo";
        $parametros['idarchivo'] = $idarchivo;
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException('El archivo seleccionado no existe ', -1);
        }
        return $respuesta[0];
    }

    /**
     * Permite eliminar un archivo de la base de datos
     * @param int $idArchivo identificador de archivo a eliminar
     * @return int cantidad de filas afectadas
     */
    public function eliminarAdjuntosFinanciacionModel($idArchivo) {
        return $this->eliminar('adfi_adjfinanciacio', 'adfi_ideregistr=' . $idArchivo);
    }

    public function getValorFinanciableNoFinanciable($idFactura, $idEmpresa) {
        $concatena = "";
         if($idEmpresa != 325){
            $concatena = " AND con.con_financiable = 'S' and dfac.uni_concepto in (41,42) ";
        }
        $parametros['idfactura'] = $idFactura;
        $sql = "select (SELECT
                          COALESCE(SUM (dfac.dfac_sdoreal),0)
                         FROM
                                 dfac_detfactura dfac
                         INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                         WHERE
                                 dfac.dfac_sdoreal > 0
                         $concatena
                         AND dfac.fac_ideregistro = fac.fac_ideregistro
                       ) valorfinanciable,
                       (
                        SELECT
                         COALESCE(SUM (dfac.dfac_sdoreal),0)
                        FROM
                         dfac_detfactura dfac
                         INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                        WHERE
                         dfac.dfac_sdoreal > 0 AND con.con_financiable = 'N'  
                         AND dfac.fac_ideregistro = fac.fac_ideregistro
                       ) valornofinanciable  from fac_factura fac where fac.fac_ideregistro=:idfactura";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0];
    }

    public function insertarInformacionFinanciera($informacion) {
        $parametros = array();
        $this->setCampo($informacion, $parametros, 'idfinanciacion', 'fin_ideregistro');
        $this->setCampo($informacion, $parametros, 'idtiposociedad', 'uni_tipsociedad');
        $this->setCampo($informacion, $parametros, 'idactividadeconomica', 'uni_actsuscripc');
        $this->setCampo($informacion, $parametros, 'nombreempresalaboral', 'fiif_nomempresa');
        $this->setCampo($informacion, $parametros, 'fechaingreso', 'fiif_fecingreso');
        $this->setCampo($informacion, $parametros, 'cantidadexperiencia', 'fiif_canexperiencia');
        $this->setCampo($informacion, $parametros, 'cargolaboral', 'uni_tipcargo');
        $this->setCampo($informacion, $parametros, 'salariofijo', 'fiif_ingsalario');
        $this->setCampo($informacion, $parametros, 'salariovariable', 'fiif_ingvarsalario');
        $this->setCampo($informacion, $parametros, 'ingresoarriendo', 'fiif_ingarriendo');
        $this->setCampo($informacion, $parametros, 'ingresoventa', 'fiif_ingventa');
        $this->setCampo($informacion, $parametros, 'otroingreso', 'fiif_desingotro');
        $this->setCampo($informacion, $parametros, 'valorotroingreso', 'fiif_ingotro');
        $this->setCampo($informacion, $parametros, 'gastofamiliar', 'fiif_egrfamilia');
        $this->setCampo($informacion, $parametros, 'gastoarriendo', 'fiif_egrarriendo');
        $this->setCampo($informacion, $parametros, 'gastofinanciero', 'fiif_egrfinancie');
        $this->setCampo($informacion, $parametros, 'gastocompra', 'fiif_egrcompra');
        $this->setCampo($informacion, $parametros, 'otrogasto', 'fiif_desegreotros');
        $this->setCampo($informacion, $parametros, 'valorotrogasto', 'fiif_egrotro');
        $this->setCampo($informacion, $parametros, 'efectivo', 'fiif_disefectivo');
        $this->setCampo($informacion, $parametros, 'activocorriente', 'fiif_disactivo');
        $this->setCampo($informacion, $parametros, 'vehiculo', 'fiif_disvehiculo');
        $this->setCampo($informacion, $parametros, 'propiedad', 'fiif_dispropiedad');
        $this->setCampo($informacion, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($informacion, $parametros, 'telefono2', 'fiif_telcelular');
        $this->setCampo($informacion, $parametros, 'telefono1', 'fiif_telfijo');

        return $this->insertar($parametros, 'fiif_fininfinancie', 'sq_fiif_ideregistr');
    }

    public function consultarDiasPeriodo($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT
                        ( per.per_fecfinal :: DATE - now() :: DATE ) diasterminoperiodo
                FROM
                        dsus_detsuscrip dsus
                INNER JOIN per_periodo per ON dsus.cic_ideregistro = per.cic_ideregistro
                WHERE
                        per.per_estado = 'A' AND dsus.dsus_ideregistr =:idsuscripcion ";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Buscan el encabezado de una suscripción
     * @param array $parametros criterios de búsqueda
     * @return array Listado de suscripciones
     */
    public function getSuscripcion(array $parametros, $idusuario) {
        if (!is_array($parametros)) {
            throw new MyException("Error, el parámetro no es un arreglo", -1);
        }
        $complemento = '';

        if ((!empty($parametros['idsuscripcion']) ) && $parametros['idsuscripcion'] != -1) {
            $complemento .= 'and dsus.dsus_ideregistr=:idsuscripcion ';
        }

        if (!empty($parametros['codigoanterior'])) {
            $complemento .= 'and dsus.dsus_pcodigo=:codigoanterior ';
        }
        $complemento .= "and dsus.dsus_estado in ('A') ";
//        print_r($complemento); 
        $parametros['idusuario'] = $idusuario;
        $sql = 'SELECT DISTINCT
                 ter.ter_documento documentotercero,ter.ter_ideregistro idtercero,ter.uni_tiptercero idtipotercero,
                 unitip.uni_codigo1 codtipotercero, unitip.uni_nombre2 tipotercero,
                 ter.ter_nomcompleto nombretercero,dsus.dsus_ideregistr idsuscripcion,
                 dsus.dsus_pcodigo codigoanterior,pro.pro_direccion direccion,
                 pro.pro_idepropieda numeropropiedad,pro.pro_descripcion descripcionpropiedad,
                 ter.ter_documento cedula,pro.pro_numcatastral numerocatastral,
                 rut.rut_nombre ruta,rut.rut_ideregistro idruta, dsus.dsus_estado estadosuscripcion,
                 cnre.cnre_ideregistr idconvenio,cnre.cnre_nombre convenio,
                 dsus.pro_catestrato estrato,dsus.uni_tipsuscripc idtiposuscripcion,
                 dsus.sus_ideregistro idsuscriptor,dsus.uni_tipusosuscr idtipousosuscripcion,
                 dsus.dsus_descripcion tiposuscripcion,ter.ter_telfijo telefonofijo,
                 ter.ter_telcelular telefonocelular,barrio.barrio_nom barrio,
                 ter.ter_correo correo,municipio.proyecto_nom municipio,
                 dsus.emp_ideregistro idempresa,ciu.ciudad_nom lugarexpedicion,
                 dsus.uni_municipio idmunicipio, dsus.uni_liquidacion idliquidacion,
                 dsus.uni_barrio idbarrio,uni.uni_nombre1 tipousosuscripcion,
                 dsus.dsus_iniestado fechainicioestado, dsus.dsus_finestado fechafinestado,
                 dsus.uni_actsuscripc idactividadeconomica, uniact.uni_nombre1 actividadeconomica,
                 liq.liq_nombre liquidacion,dsus.cic_ideregistro idciclo,dsus.pro_ideregistro idpropied,
		 rusu.rusu_rutsecuen  idsecuencia
                FROM
                 dsus_detsuscrip dsus
                 INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro = pro.pro_ideregistro
                 INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
                 INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro = dsus.sus_ideregistro
                 INNER JOIN cnre_cnvrecaudo cnre ON sus.cnre_ideregistr = cnre.cnre_ideregistr
                 INNER JOIN barrios barrio on barrio.barrio_ideregistro = pro.uni_barrio
                 INNER JOIN proyectos municipio on municipio.proyecto_ideregistro = pro.uni_municipio
                 INNER JOIN uni_unidad uni on uni.uni_ideregistro=dsus.uni_tipusosuscr
                 INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion=dsus.uni_liquidacion
                 LEFT JOIN rusu_rutsuscrip rusu ON dsus.dsus_ideregistr = rusu.dsus_ideregistr
                 LEFT JOIN rut_ruta rut ON rut.rut_ideregistro = rusu.rut_ideregistro
                 LEFT JOIN ciudades ciu on ter.ciudad_cod = ciu.ciudad_cod
                 LEFT JOIN uni_unidad uniact on dsus.uni_actsuscripc = uniact.uni_ideregistro
                 LEFT JOIN uni_unidad unitip on ter.uni_tiptercero = unitip.uni_ideregistro
                where
                    pro.uni_municipio in (select distinct uspr.uni_municipio from uspr_usuprgpryto uspr where uspr.usu_ideregistro=:idusuario) ' . $complemento . '

                   limit 1000';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Advertencia, la suscripción no esta activa ó no existe', 0);
        }
        return $resultado;
    }

    // <editor-fold desc="Suscripción">  
    /**
     * Consulta de los conceptos de una suscripción
     * @param int $idSuscripcion identificador de la suscripción.
     * @param int $idDocumento identificador del documento.
     * @param int $idTipoDocumento identificador del tipo de documento
     * @return array Listado de las facturas.
     */
    public function consultarConceptoPorSuscripcionDocumentoModel($idSuscripcion, $idDocumento, $idTipoDocumento) {
        $complemento = '';
        if (!empty($idDocumento)) {
            $complemento = 'and fac.uni_documento = :idDocumento ';
        }
        $parametros = array();
        $parametros['idSuscripcion'] = $idSuscripcion;
        $parametros['idDocumento'] = $idDocumento;
        $parametros['idTipoDocumento'] = $idTipoDocumento;
        $sql = "SELECT DISTINCT
                        con.uni_concepto idconcepto,
                        con.con_nombre concepto
                FROM
                      fac_factura fac inner join doc_documento doc on doc.uni_documento = fac.uni_documento
                inner join tido_tipdocumen tido on  tido.uni_tipdocument = fac.uni_tipdocument
                inner join  cic_ciclo cic on cic.cic_ideregistro = fac.cic_ideregistro
                inner join per_periodo per on per.per_ideregistro = fac.per_ideregistro
                inner join  dfac_detfactura dfaci on dfaci.fac_ideregistro=fac.fac_ideregistro
                INNER JOIN con_concepto con ON dfaci.uni_concepto = con.uni_concepto
                WHERE (SELECT
                                        SUM (dfac.dfac_sdoreal)
                                FROM
                                        dfac_detfactura dfac
                                INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                                WHERE
                                        dfac.dfac_sdoreal > 0
                                AND con.con_financiable = 'S'
                                AND dfac.fac_ideregistro = fac.fac_ideregistro) > 0
                AND fac.fac_estado = 'A' AND fac.fac_sdoreal > 0 AND fac.fac_idepadre IS NULL
                AND doc.doc_financiable = 'S' AND fac.dsus_ideregistr = :idSuscripcion and con.con_financiable = 'S'
                AND fac.uni_tipdocument = :idTipoDocumento  $complemento
                ORDER BY con.con_nombre;";
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException('No existen conceptos asociadas a financiar para el suscriptor ' . $idSuscripcion, 0);
        }
        return $respuesta;
    }
    
    public function getProcesoEjecucionHilos($idEmpresa, $idPrograma, $idUsuario) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idusuario'] = $idUsuario;
        $parametros['idprograma'] = $idPrograma;
        $sql = "SELECT
                   cpr.cpr_ideregistro idprocesocontrol, 
                   cpr.acc_ideregistro idacceso,
                   cpr.cpr_idehilo hilo ,
                   cpr.cpr_fecinicio  fechainicio,
                   usu.usuario_nom usuario,   
                   ( 
                        select count(*) 
                        FROM temp_financiaemergencia  tempfin 
                        WHERE  tempfin.usu_ideregistro = :idusuario  and tempfin.emp_ideregistro = :idempresa  and tempfin.estado <> 'P' 
                   ) cantidad
                FROM cpr_ctrproceso cpr 
                     INNER JOIN acc_acceso acc on cpr.acc_ideregistro=acc.acc_ideregistro
                     INNER JOIN usuarios usu on usu.usu_ideregistro=acc.usu_ideregistro
                WHERE  
                       cpr.prg_ideregistro=:idprograma 
                       AND cpr.cpr_estado='A' 
                       AND cpr.emp_ideregistro =:idempresa
                       AND cpr.usu_ideregistro =:idusuario
                ORDER BY
                     cpr.cpr_ideregistro
                LIMIT 1";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }
    
    public function consultarResumenErrores($idUsuario, $idEmpresa) {
         $tabla = " temp_financiaemergencia " ;
        if($idEmpresa == 325){
            $tabla = " temp_financiaemergenciapotenza " ;
        }
        $sql = "select  estado estado, idsuscripcion idsuscripcion, fac_ideregistro idfactura, mensaje mensaje
                 from $tabla  
                where estado = 'E' AND  usu_ideregistro = $idUsuario and emp_ideregistro = $idEmpresa order by mensaje";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }
    public function consultarResumen($idUsuario, $idEmpresa) {
        
        $tabla = " temp_financiaemergencia " ;
        if($idEmpresa == 325){
            $tabla = " temp_financiaemergenciapotenza " ;
        }
         
        $sql = "select  mensaje mensaje, count(*) totalfacturas
                 from $tabla  
                where estado = 'G' AND  usu_ideregistro = $idUsuario and emp_ideregistro = $idEmpresa  GROUP BY mensaje order by mensaje limit 1";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }
    
     public function getCiclosActivosPrograma($idEmpresa, $idPrograma) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idprograma'] = $idPrograma;
        $sql = " select
                    cic.cic_ideregistro idciclo,
                    cic.cic_nombre ciclo
               from cic_ciclo cic inner join  ciem_cicempresa ciem on ciem.cic_ideregistro=cic.cic_ideregistro
                    inner join cipr_cicprograma cipr on cipr.cic_ideregistro=cic.cic_ideregistro
               where cic_estado = 'A' and ciem.emp_ideregistro=:idempresa and cipr.prg_ideregistro=:idprograma 
               ORDER BY cic.cic_nombre
                ";
        return $this->executeQuery($sql, $parametros);
    }
    
    /**
     * @autor lmrubio
     * @param type $parametros
     * @return type
     */
    public function getCantidadProcesosActivos($parametros) {
        $sql = "SELECT COUNT(*)  procesosactivos 
                from 
                  cpr_ctrproceso 
                where 
                   prg_ideregistro = :idPrograma and acc_ideregistro= :idAcceso and emp_ideregistro = :idEmpresa 
                   and cpr_estado='A' and cpr_idehilo<> :idproceso  ";
        $cantidad = $this->executeQuery($sql, $parametros);
        return $cantidad[0]['procesosactivos'];
    }
    
    public function getFacturasNotasSaldo($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT fac.fac_ideregistro idfactura, fac.uni_documento iddocumento, fac.uni_tipdocument idtipodocumento, fac.fac_version versio, fac.emp_ideregistro idempresa  FROM fac_factura fac WHERE  emp_ideregistro = :idempresa AND fac_estado = 'H'";
        return $this->executeQuery($sql, $parametros);
    }
    public function deleteArchivoTemporal($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "DELETE  FROM temp_archivofinancia ";
        return $this->executeQuery($sql, $parametros);
    }
    
    public function insertarFactura(array $registro) {
        $parametros = array();
        $this->setCampo($registro, $parametros, 'fac_ideregistro', 'fac_ideregistro');
        $this->setCampo($registro, $parametros, 'valorfinanciar', 'valorfinanciar');
        $this->setCampo($registro, $parametros, 'numerocuotas', 'numerocuotas');
        $this->setCampo($registro, $parametros, 'idliquidacion', 'idliquidacion');
        $this->setCampo($registro, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($registro, $parametros, 'idtiposuscripcion', 'usu_ideregistro');
        return $this->insertar($parametros, 'temp_archivofinancia', NULL);
    }

}
