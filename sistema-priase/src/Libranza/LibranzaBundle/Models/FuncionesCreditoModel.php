<?php

namespace Libranza\LibranzaBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AnularModel
 *
 * @author sergio vargas
 */
class FuncionesCreditoModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    public function obtenerEdad($idcredito) {

        $sql = "SELECT
                        EXTRACT (
                                YEAR
                                FROM
                                        age(crib_fecnacimiento)
                        ) edad
                FROM
                        crib_creinfbasica
                where cre_ideregistro =$idcredito";

        $respuesta = parent::executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException('Error al calcular la edad', -1);
        }
        return $respuesta[0]['edad'];
    }

    public function obtenerEstadoCivil($idcredito) {
        $sql = "SELECT crib.uni_estcivil idestcivil,
                uni.uni_nombre1 nombre 
                FROM crib_creinfbasica crib
                INNER JOIN uni_unidad uni on crib.uni_estcivil = uni.uni_ideregistro
                WHERE crib.cre_ideregistro = $idcredito;";

        $respuesta = parent::executeQuery($sql);

        if (empty($respuesta)) {
            throw new MyException('Error al calcular el estado civil', -1);
        }
        return $respuesta[0];
    }

    public function obtenerMesesLaborales($idcredito) {
        $sql = "SELECT  extract(year from age(now() , crae.crae_ingempresa::date))*12 +
                extract(month from age(now(),crae.crae_ingempresa::date)) fechaingresoempleado 
                FROM  crae_creacteconomica crae WHERE  crae.cre_ideregistro = $idcredito
                ORDER BY crae.crae_ingempresa ASC LIMIT 1;";

        $respuesta = parent::executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException('Error al calcular los meses', -1);
        }
        return $respuesta[0]['fechaingresoempleado'];
    }

    public function obtenerPersonasACargo($idcredito) {
        $sql = "SELECT  crib_percargomayor personasacargo  FROM crib_creinfbasica crib
                WHERE crib.cre_ideregistro=$idcredito;";

        $respuesta = parent::executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException('Error al consultar personas a cargo', -1);
        }
        return $respuesta[0];
    }

    public function obtenerCuota($idcredito) {
        $sql = "SELECT crif_salario ingresos_auxtrasporte,
                crif_salario salario,
		crea.crae_dednomina  dednomina ,
                cre.cre_monto monto,
                cre.cre_plazo plazo
                FROM  crif_creinfinancie crif
                INNER JOIN cre_credito cre ON cre.cre_ideregistro = crif.cre_ideregistro
                INNER JOIN crae_creacteconomica   	crea ON crea.cre_ideregistro = crif.cre_ideregistro
                WHERE  crif.cre_ideregistro = $idcredito;";

        $respuesta = parent::executeQuery($sql);

        if (empty($respuesta)) {
            throw new MyException('Error al calcular la cuota', -1);
        }
        return $respuesta[0];
    }

    public function obtenerPorcentajeCapital($idcredito) {
        $sql = "SELECT
           CASE 
            WHEN round( ( otros.pasivo / activos.activos) * 100, 2 ) > 100 THEN
               100
            WHEN (activos.cre_ideregistro IS NULL OR activos.activos = 0 ) AND otros.pasivo = 0 THEN
               0
            WHEN (activos.cre_ideregistro IS NULL OR activos.activos = 0 ) AND otros.pasivo > 0 THEN
               100
            WHEN activos.cre_ideregistro IS NULL THEN
               100
            ELSE round( (   otros.pasivo / activos.activos) * 100, 2 )
           END AS porcentajecapital
           FROM
               ( SELECT cre_ideregistro,
                 crif_topasivo pasivo,
                 crif_salario + crif_horextra + crif_ingarriendo ingresos
                FROM crif_creinfinancie
                WHERE cre_ideregistro = $idcredito ) otros
           LEFT JOIN ( SELECT  cre_ideregistro,
                 SUM (crac_vlrcomercial) activos
               FROM  crac_creactivo
               WHERE cre_ideregistro = $idcredito
               GROUP BY  cre_ideregistro
           ) activos ON otros.cre_ideregistro = activos.cre_ideregistro ";
        $respuesta = parent::executeQuery($sql);

        if (empty($respuesta)) {
            throw new MyException('Error al calcular el porcentaje capital ', -1);
        }
        return $respuesta[0]['porcentajecapital'];
    }

    // FUNCIONES PARA COMPRA DE CARTERA LLANOGAS  //
    public function obtenerDiasInstalacionGas($idsuscripcion) {
        $sql = "select ( now()::date -  dsus.dsus_fecinicio::date) dias
                from dsus_detsuscrip dsus 
                where dsus.dsus_ideregistr = $idsuscripcion;";
        $respuesta = parent::executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException('Error al calcular los dias', -1);
        }
        return $respuesta[0]['dias'];
    }

    public function obtenerSupensionSemestreCliente($idsuscripcion) {
        $sql = "SELECT count(ssp.ssp_ideregistro) cantidad 
                from syr_susreconex syr
                INNER JOIN ssp_suspension ssp on ssp.syr_ideregistro=syr.syr_ideregistro
                INNER JOIN mosu_motsuspen mosu on mosu.uni_motsuspen = ssp.uni_motsuspen
                inner join dsus_detsuscrip dsus on syr.dsus_ideregistr=dsus.dsus_ideregistr
                where ssp.ssp_fecejesuspe BETWEEN now()::date - 180  and now()::date and ssp.ssp_fecejesuspe is not null and 
                ssp.ssp_estado <> 'C' and ssp.ssp_realizada = 'S' and dsus.dsus_ideregistr= $idsuscripcion and mosu.uni_motsuspen not in (69,262,102,265,506);";

        $respuesta = parent::executeQuery($sql);

        if (empty($respuesta)) {
            throw new MyException('Error al calcular las suspensiones', -1);
        }
        return $respuesta[0]['cantidad'];
    }

    public function obtenerCupoDisponibleCliente($idsuscripcion, $cupopreaprobadotipo, $montosolicitado) {
        $sql = "SELECT 
                ($cupopreaprobadotipo -  
                ( coalesce(sum(fin.fin_sdocapital),0) + 
                 $montosolicitado
                )) cupodisponible
                from fin_financiacio fin 
                where fin.fin_sdocapital>0 and fin.fin_idepadre is null 
                and fin.dsus_ideregistr = $idsuscripcion";
        $respuesta = parent::executeQuery($sql);
        if (empty($respuesta)) {
            return 0;
        }
        return $respuesta[0]['cupodisponible'];
    }

    public function obtenerCupoPreaprobadoTipo($cupopreaprobadotipo) {
        $sql = "SELECT $cupopreaprobadotipo  cupo;";
        $respuesta = parent::executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException('Error al calcular el cupo preaprobado', -1);
        }
        return $respuesta[0]['cupo'];
    }

    public function obtenerEdadCliente($fechanacimiento) {
        $sql = "select date_part('year', now())- date_part('year', '$fechanacimiento'::date) as edad;";
        $respuesta = parent::executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException('Error al calcular fecha nacimiento', -1);
        }
        return $respuesta[0]['edad'];
    }

    public function obtenerHabitoPagoClilente($idSuscripcion) {
        $sql = "SELECT coalesce(sum(resultado.cantidad),0) habito
                from
                  (SELECT DISTINCT
                     drec.fac_ideregistro,
                     1 cantidad
                   from rec_recaudo rec
                     inner join dire_disrecaudo dire on rec.rec_ideregistro = dire.rec_ideregistro
                     inner join drec_detrecaudo drec
                       on drec.rec_ideregistro = rec.rec_ideregistro and drec.dire_ideregistr = dire.dire_ideregistr
                     inner join fac_factura fac on drec.fac_ideregistro = fac.fac_ideregistro
                                                   and fac.fac_fecvence :: date < rec.rec_fecpago :: date and fac.fac_estado = 'A'
                                                   and fac.uni_documento = 24
                   where rec.rec_fecpago :: date BETWEEN now() :: date - 180 and now() :: date
                         and dire.dsus_ideregistr = $idSuscripcion) resultado;";
        $respuesta = parent::executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException('Error al calcular Habito de Pago', -1);
        }
        return $respuesta[0]['habito'];
    }

    public function obtenerPuntajeDatacreditoCliente($idsuscripcion, $datacreditocliente) {
        $sql = "SELECT 
                (case when (select (extract(year from age(now()::date ,dsus.dsus_fecinicio::date))*12 +
                                    extract(month from age(now()::date ,dsus.dsus_fecinicio::date))) 
                            from dsus_detsuscrip dsus 
                                where dsus.dsus_ideregistr = $idsuscripcion ) >= 6 
                then 510 
		else $datacreditocliente end) datacredito ;";

        $respuesta = parent::executeQuery($sql);

        if (empty($respuesta)) {
            throw new MyException('Error al calcular DataCredito', -1);
        }
        return $respuesta[0]['datacredito'];
    }

    public function obtenerSaldoFinanciacionCliente($idsuscripcion, $cupopreaprobadotipo, $montosolicitado) {
        $sql = "SELECT   
                 coalesce(sum(fin.fin_sdocapital),0) saldo
                FROM fin_financiacio fin 
                WHERE fin.fin_sdocapital>0 AND fin.fin_idepadre is null 
                 AND fin.dsus_ideregistr = $idsuscripcion;";
        $respuesta = parent::executeQuery($sql);

        if (empty($respuesta)) {
            throw new MyException('Error al calcular Saldo Financiacion', -1);
        }
        return $respuesta[0]['saldo'];
    }

    public function obtenerScoringCompraCarteraGas($calificacion) {
        $sql = "SELECT 
                {$calificacion['antiguedadInstalacionGas']} *
                {$calificacion['supensionSemestreCliente']} *
                {$calificacion['cupoDisponibleCliente']} *
                {$calificacion['calculaEdadCliente']} *
                {$calificacion['habitoPagoClilente']} *
                {$calificacion['saldoFinanciacionCliente']} *
                {$calificacion['cupoPreaprobadoTipo']} *
                {$calificacion['puntajeDatacreditoCliente']}
                evaluacion ";
        $respuesta = parent::executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException('Error al calcular Evaluación Scoring', -1);
        }
        return $respuesta[0][0];
    }

    public function respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, $tipo, $variable) {
        try {
            switch ($tipo) {
                case 'valorvariable':
                    $sql = "SELECT (case when (dfrm.dfrm_valnivel::json->>'TIPO')::char ='R' 
                    then (SELECT evalua.valor_variable
                                            from (
                                            SELECT
                                            (((ARRAY(SELECT json_array_elements((dato1.dato :: json ->> 'valor_variable') :: json)))[1])::text)::numeric valor1,
                                            (((ARRAY(SELECT json_array_elements((dato1.dato :: json ->> 'valor_variable') :: json)))[2])::text)::numeric valor2,
                                            (dato1.dato :: json ->> 'resultado_variable') valor_variable,
                                            (dato1.dato :: json ->> 'calificacion_variable') scoring,
                                            dato1.*
                                            FROM (SELECT
                                            variables.dfrm_ideregistr as ide,
                                            json_array_elements(variables.dfrm_valnivel :: JSON -> 'EVALUACION') as dato
                                            FROM dfrm_detformulario variables
                                            WHERE variables.dfrm_ideregistr = $idDetalleFormulario
                                            ) dato1) evalua
                                            where  $resultado BETWEEN evalua.valor1 and evalua.valor2)
                    else (SELECT evalua.valor_variable
                                            from (
                                            SELECT
                                            (((ARRAY(SELECT json_array_elements((dato1.dato :: json ->> 'valor_variable') :: json)))[1])::text)::numeric valor1,
                                            (dato1.dato :: json ->> 'resultado_variable') valor_variable,
                                            (dato1.dato :: json ->> 'calificacion_variable') scoring,
                                            dato1.*
                                            FROM (SELECT
                                            variables.dfrm_ideregistr as ide,
                                            json_array_elements(variables.dfrm_valnivel :: JSON -> 'EVALUACION') as dato
                                            FROM dfrm_detformulario variables
                                            WHERE variables.dfrm_ideregistr = $idDetalleFormulario
                                            ) dato1) evalua
                                            where  $resultado = evalua.valor1
                                            ) 
                    end) from dfrm_detformulario dfrm
                            where dfrm.dfrm_ideregistr = $idDetalleFormulario;";
                    break;

                case 'scoring':
                    $sql = "SELECT (case when (dfrm.dfrm_valnivel::json->>'TIPO')::char ='R' 
                    then (SELECT evalua.scoring
                                            from (
                                            SELECT
                                            (((ARRAY(SELECT json_array_elements((dato1.dato :: json ->> 'valor_variable') :: json)))[1])::text)::numeric valor1,
                                            (((ARRAY(SELECT json_array_elements((dato1.dato :: json ->> 'valor_variable') :: json)))[2])::text)::numeric valor2,
                                            (dato1.dato :: json ->> 'resultado_variable') valor_variable,
                                            (dato1.dato :: json ->> 'calificacion_variable') scoring,
                                            dato1.*
                                            FROM (SELECT
                                            variables.dfrm_ideregistr as ide,
                                            json_array_elements(variables.dfrm_valnivel :: JSON -> 'EVALUACION') as dato
                                            FROM dfrm_detformulario variables
                                            WHERE variables.dfrm_ideregistr = $idDetalleFormulario
                                            ) dato1) evalua
                                            where  $resultado BETWEEN evalua.valor1 and evalua.valor2)
                    else (SELECT evalua.scoring
                                            from (
                                            SELECT
                                            (((ARRAY(SELECT json_array_elements((dato1.dato :: json ->> 'valor_variable') :: json)))[1])::text)::integer valor1,
                                            (dato1.dato :: json ->> 'resultado_variable') valor_variable,
                                            (dato1.dato :: json ->> 'calificacion_variable') scoring,
                                            dato1.*
                                            FROM (SELECT
                                            variables.dfrm_ideregistr as ide,
                                            json_array_elements(variables.dfrm_valnivel :: JSON -> 'EVALUACION') as dato
                                            FROM dfrm_detformulario variables
                                            WHERE variables.dfrm_ideregistr = $idDetalleFormulario
                                            ) dato1) evalua
                                            where  $resultado = evalua.valor1
                                            ) 
                            end) from dfrm_detformulario dfrm
                            where dfrm.dfrm_ideregistr = $idDetalleFormulario;";
                    break;
            }
            $respuesta = parent::executeQuery($sql);
            if (empty($respuesta)) {
                throw new MyException('Error al calcular ' . $Tipo . ' ' . $variable, -1);
            }

            if (isset($respuesta[0]['valor_variable'])) {
                return $respuesta[0]['valor_variable'];
            }
            if (isset($respuesta[0]['scoring'])) {
                return $respuesta[0]['scoring'];
            }
            throw new MyException('No se pudo calcular la variable ' . $variable . ' valor: ' . $resultado, -1);
        } catch (\Exception $e) {
            throw new MyException('No se pudo calcular la variable ' . $variable . ' valor: ' . $resultado, -1);
        }
    }

    public function respuestaEvaluaScoringCompraCarteraGas($resultado, $idDetalleFormulario) {

        $sql = "SELECT (case when (frm.frm_evaluascoring::json->>'TIPO')::char ='R' 
            then (SELECT evalua.scoring
                                    from (
                                    SELECT
                                    (((ARRAY(SELECT json_array_elements((dato1.dato :: json ->> 'valor_variable') :: json)))[1])::text)::numeric valor1,
                                    (((ARRAY(SELECT json_array_elements((dato1.dato :: json ->> 'valor_variable') :: json)))[2])::text)::numeric valor2,
                                    (dato1.dato :: json ->> 'calificacion_variable') scoring,
                                    dato1.*
                                    FROM (SELECT
                                    variables.frm_ideregistro as ide,
                                    json_array_elements(variables.frm_evaluascoring :: JSON -> 'EVALUACION') as dato
                                    FROM frm_formulario variables
                                    WHERE variables.frm_ideregistro = dfrm.frm_ideregistro
                                    ) dato1) evalua
                                    where  $resultado
                                     BETWEEN evalua.valor1 and evalua.valor2)
            else (SELECT evalua.scoring
                                    from (
                                    SELECT
                                    (((ARRAY(SELECT json_array_elements((dato1.dato :: json ->> 'valor_variable') :: json)))[1])::text)::integer valor1,
                                    (dato1.dato :: json ->> 'calificacion_variable') scoring,
                                    dato1.*
                                    FROM (SELECT
                                    variables.frm_ideregistro as ide,
                                    json_array_elements(variables.frm_evaluascoring :: JSON -> 'EVALUACION') as dato
                                    FROM frm_formulario variables
                                    WHERE variables.frm_ideregistro = dfrm.frm_ideregistro
                                    ) dato1) evalua
                                    where  $resultado = evalua.valor1
                                    ) 
	end) evaluacion from frm_formulario frm
	INNER JOIN dfrm_detformulario dfrm on frm.frm_ideregistro = dfrm.frm_ideregistro
        where dfrm.dfrm_ideregistr= $idDetalleFormulario;";

        $respuesta = parent::executeQuery($sql);

        if (empty($respuesta)) {
            throw new MyException('Error al calcular Scoring... ', -1);
        }
        return $respuesta[0]['evaluacion'];
    }

    public function obtenerEstadoInstalacionClilente($idSuscripcion) {
        $sql = "SELECT COALESCE((SELECT count(*) from sigueactividad_nuevas sigue
                    inner join dsus_detsuscrip dsus on dsus.dsus_pcodigo=sigue.sigue_codsus
                where dsus.dsus_ideregistr=$idSuscripcion and sigue.sigue_codser='0908'),0) instalacion;";
        $respuesta = parent::executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException('Error al validar Instalacion Clilente', -1);
        }
        return $respuesta[0]['instalacion'];
    }

    public function obtenerEstadoClilente($idSuscripcion) {
        $sql = "SELECT COALESCE((SELECT (case when dsus.dsus_estado='A' then 1 when dsus.dsus_estado='P' then 2 else 0 end) from dsus_detsuscrip dsus 
                where  dsus.dsus_ideregistr=$idSuscripcion),0) estado;";
        $respuesta = parent::executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException('Error al validar Instalacion Clilente', -1);
        }
        return $respuesta[0]['estado'];
    }


}
