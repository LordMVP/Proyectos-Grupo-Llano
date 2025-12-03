<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ConstructorasAmortizacionModel
 *
 * @author lmrubio
 * @echa 21/11/2015
 */
class ConstructorasAmortizacionModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    /* Extracción de relacion con ventas, no por idcontrato si no por codigo anterior */

//                        inner join ventas ven on ven.venta_numpag=cast(sco.sco_ideregistro as varchar) 
//                              and ven.venta_codemp=emp.empresa_cod and ven.venta_codsus=dsus.dsus_pcodigo
    public function getSuscripcionesProcesar($empresa) {
        $parametros = array();
        $parametros['empresa'] = $empresa;
        $sql = "select gco.gco_ideregistro ideproyectoConstruc,sco.sco_ideregistro, 
                   dsus.dsus_ideregistr ideSuscripcion, uco.uco_ideregistro, age.agenda_cod,
                   serage.serage_codser codServicio,serage.serage_cod,
                   serv.servicio_nom,age.agenda_nom,src.src_peso, serage.serage_codpro,
                        (select count(*) from sco_susconstruc scoCant where scoCant.uco_ideregistro=uco.uco_ideregistro) canSuscripcion,
                        ((src.src_peso/100)/(select count(*) from sco_susconstruc scoCant where scoCant.uco_ideregistro=uco.uco_ideregistro))*gco.gco_vlrantiva
                   from 
                     gco_gesconstruc gco
                        inner join empresas emp on emp.empresa_sevemp=gco.emp_ideregistro
                        inner join uco_uniconstruc uco on uco.gco_ideregistro=gco.gco_ideregistro
                        inner join sco_susconstruc sco on sco.gco_ideregistro=gco.gco_ideregistro 
                              and sco.uco_ideregistro=uco.uco_ideregistro
                        inner join src_srvcontratad src on src.uco_ideregistro=uco.uco_ideregistro
                        inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=sco.dsus_ideregistr
                        inner join proyectos pry on dsus.uni_municipio=pry.proyecto_ideregistro
                        inner join agendas age on age.agenda_ideregistro=uco.agenda_ideregistro
                        inner join servicios_agenda serage on serage.serage_codage=age.agenda_cod and serage.serage_codpro=pry.proyecto_cod
                              and serage.serage_codemp = age.agenda_codemp and serage.serage_swtact = true  
                        inner join servicios serv on serv.servicio_cod=serage.serage_codser  and serv.servicio_niv=3
                              and serv.servicio_codemp = serage.serage_codemp  
                        inner join thsc_servicioconcep thsc on thsc.serage_cod=serage.serage_cod and src.uni_concepto=thsc.uni_concepto 
                               and dsus.uni_municipio=thsc.uni_municipio and thsc.emp_ideregistro=gco.emp_ideregistro
                        inner join sigueactividad_nuevas siguenue on siguenue.sigue_codage=age.agenda_cod and siguenue.sigue_codsus=dsus.dsus_pcodigo 
                                and siguenue.sigue_codser=serage.serage_codser 
                     where
                        gco.gco_estado='T' and gco.emp_ideregistro = :empresa and siguenue.sigue_swteje=true and siguenue.dfac_ideregistr is null 
                           order by dsus.dsus_ideregistr, uco.uco_ideregistro,servicio_nom";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado))
            throw new MyException("No hay Registros Proyectos de Constructoras listos para Amortizar", -1);

        return $resultado;
    }

    public function ConstruyeEncabezado($suscripcion) {
        $parametros = array();
        $parametros['contrato'] = $suscripcion['ideproyectoconstruc'];
        $parametros['suscripcion'] = $suscripcion['idesuscripcion'];
        $parametros['usuario'] = $suscripcion['usu_ideregistro'];
        $parametros['servicio'] = $suscripcion['codservicio'];
//      Se excuye esta relacion para poder hacer el enlace en la amortizacion no por el identificador de contratos, sino 
//      por la combinacion codigo anterior de la suscripcion , empresa y el codigo de la agenda 
//                        inner join ventas ven on ven.venta_numpag=cast(sco.sco_ideregistro as varchar) 
//                                        and ven.venta_codemp=emp.empresa_cod and ven.venta_codsus=dsus.dsus_pcodigo
        $sql = "               
                select DISTINCT  'P' fac_metgenera,'A' fac_estado,now() fac_fecha,now() fac_fecaprobada,
                  gco.emp_ideregistro  emp_ideregistro ,dsus.sus_ideregistro,dsus.dsus_ideregistr,
                  dsus.uni_tipsuscripc,dsus.uni_tipusosuscr,uco.uni_liquidacion,dsus.ter_ideregistro,
                  dsus.cic_ideregistro,
                  (select per.per_ideregistro from per_periodo per where dsus.cic_ideregistro=per.cic_ideregistro and per.per_estado='A') per_ideregistro,
                  uco.uni_documento,uco.uni_tipdocumento uni_tipdocument,(select cic.cic_anoactual from cic_ciclo cic where dsus.cic_ideregistro=cic.cic_ideregistro) cic_ano,
                  0 fac_sdoreal,
                  (select ter.uni_tiptercero from ter_tercero ter where ter.ter_ideregistro=dsus.ter_ideregistro) uni_tiptercero,
                  1 fac_version, 0 fac_vlrreal, :usuario usu_ideregistro, null mvi_ideregistro
                        from gco_gesconstruc gco
                        inner join empresas emp on emp.empresa_sevemp=gco.emp_ideregistro
                        inner join uco_uniconstruc uco on uco.gco_ideregistro=gco.gco_ideregistro
                        inner join sco_susconstruc sco on sco.gco_ideregistro=gco.gco_ideregistro and sco.uco_ideregistro=uco.uco_ideregistro
                        inner join src_srvcontratad src on src.uco_ideregistro=uco.uco_ideregistro
                        inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=sco.dsus_ideregistr
                        inner join proyectos pry on dsus.uni_municipio=pry.proyecto_ideregistro
                        inner join agendas age on age.agenda_ideregistro=uco.agenda_ideregistro
                        inner join servicios_agenda serage on serage.serage_codage=age.agenda_cod and serage.serage_codpro=pry.proyecto_cod
                                   and serage.serage_codemp = age.agenda_codemp and serage.serage_swtact = true 
                        inner join servicios serv on serv.servicio_cod=serage.serage_codser  and serv.servicio_niv=3
                                   and serv.servicio_codemp = serage.serage_codemp   
                        inner join thsc_servicioconcep thsc on thsc.serage_cod=serage.serage_cod and src.uni_concepto=thsc.uni_concepto 
                                        and dsus.uni_municipio=thsc.uni_municipio and thsc.emp_ideregistro=gco.emp_ideregistro
                        inner join sigueactividad_nuevas siguenue on siguenue.sigue_codage=age.agenda_cod and siguenue.sigue_codsus=dsus.dsus_pcodigo 
                                        and siguenue.sigue_codser=serage.serage_codser 
                        where gco.gco_ideregistro= :contrato 
                        and  dsus.dsus_ideregistr= :suscripcion 
                        and gco.gco_estado='T' 
                        and siguenue.sigue_swteje=true 
                        and siguenue.sigue_codser = :servicio  
                        and siguenue.dfac_ideregistr is null ";

        $resultado = $this->executeQuery($sql, $parametros);
        if (!empty($resultado[0]))
            return $resultado[0];
    }

    public function InsertaEncabezado($Encabezado) {
        $resultado = $this->insertar($Encabezado, 'fac_factura', 'sq_fac_ideregistro');
        if (empty($resultado))
            throw new MyException("Error Insertando Encabezado de Factura ", -1);
        return $resultado;
    }

    public function ConstruyeDetalle($idFactura, $suscripcion) {
//        $parametros['contrato'] = $suscripcion['gco_ideregistro'];
//        $parametros['suscripcion'] = $suscripcion['dsus_ideregistr'];
        $parametros['contrato'] = $suscripcion['ideproyectoconstruc'];
        $parametros['suscripcion'] = $suscripcion['idesuscripcion'];
        $parametros['usuario'] = $suscripcion['usu_ideregistro'];
        $parametros['idefactura'] = $idFactura;
        $parametros['servicio'] = $suscripcion['codservicio'];
//      Se excuye esta relacion para poder hacer el enlace en la amortizacion no por el identificador de contratos, sino 
//      por la combinacion codigo anterior de la suscripcion , empresa y el codigo de la agenda 
//                            inner join ventas ven on ven.venta_numpag=cast(sco.sco_ideregistro as varchar) 
//                                            and ven.venta_codemp=emp.empresa_cod and ven.venta_codsus=dsus.dsus_pcodigo

        $sql = " SELECT
                        'A' dfac_estado, 1 dfac_cantidad,
                        ((src.src_peso/100)/(select count(*) from sco_susconstruc scoCant 
                            where scoCant.uco_ideregistro=uco.uco_ideregistro))*gco.gco_vlrantiva dfac_vlrunitari,
                        ((src.src_peso/100)/(select count(*) from sco_susconstruc scoCant
                            where scoCant.uco_ideregistro=uco.uco_ideregistro))*gco.gco_vlrantiva dfac_vlrtotal,
                        0 dfac_vlrreal ,0 dfac_sdoreal , :idefactura::bigint fac_ideregistro , thsc.uni_concepto,1 dfac_version,
                        sco.sco_ideregistro, :usuario::bigint usu_ideregistro ,siguenue.sigue_codage , siguenue.sigue_codsus , siguenue.sigue_codser
                        from gco_gesconstruc gco
                            inner join empresas emp on emp.empresa_sevemp=gco.emp_ideregistro
                            inner join uco_uniconstruc uco on uco.gco_ideregistro=gco.gco_ideregistro
                            inner join sco_susconstruc sco on sco.gco_ideregistro=gco.gco_ideregistro and sco.uco_ideregistro=uco.uco_ideregistro
                            inner join src_srvcontratad src on src.uco_ideregistro=uco.uco_ideregistro
                            inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=sco.dsus_ideregistr
                            inner join proyectos pry on dsus.uni_municipio=pry.proyecto_ideregistro
                            inner join agendas age on age.agenda_ideregistro=uco.agenda_ideregistro
                            inner join servicios_agenda serage on serage.serage_codage=age.agenda_cod and serage.serage_codpro=pry.proyecto_cod
                                   and serage.serage_codemp = age.agenda_codemp and serage.serage_swtact = true      
                            inner join servicios serv on serv.servicio_cod=serage.serage_codser  and serv.servicio_niv=3
                                   and serv.servicio_codemp = serage.serage_codemp   
                            inner join thsc_servicioconcep thsc on thsc.serage_cod=serage.serage_cod and src.uni_concepto=thsc.uni_concepto 
                                            and dsus.uni_municipio=thsc.uni_municipio and thsc.emp_ideregistro=gco.emp_ideregistro
                            inner join sigueactividad_nuevas siguenue on siguenue.sigue_codage=age.agenda_cod and siguenue.sigue_codsus=dsus.dsus_pcodigo 
                                            and siguenue.sigue_codser=serage.serage_codser 
                            where gco.gco_ideregistro= :contrato 
                            and  dsus.dsus_ideregistr= :suscripcion 
                            and siguenue.sigue_codser = :servicio 
                            and gco.gco_estado='T' and siguenue.sigue_swteje=true and siguenue.dfac_ideregistr is null 
                            order by dsus.dsus_ideregistr, uco.uco_ideregistro,servicio_nom";
        $resultado = array();
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException("Error Construyendo detalle de Factura", -1);
        }
        return $resultado;
    }

    public function InsertaDetalle($Detalle) {
        $resultado = $this->insertar($Detalle, 'dfac_detfactura', 'sq_dfac_ideregistr');
        if (empty($resultado))
            throw new MyException("Error Insertando Detalle de Factura ", -1);
        return $resultado;
    }

    public function ActualizaDetalleFacturaSigueActividades($Detalle, $idDetalle) {
        try {
            $datos = array();
            $datos['dfac_ideregistr'] = $idDetalle;
            $datos['sigue_codser'] = $Detalle['sigue_codser'];
            $datos['sigue_codsus'] = $Detalle['sigue_codsus'];
            $datos['sigue_codage'] = $Detalle['sigue_codage'];
            $condicion = "  sigue_swteje=true and dfac_ideregistr is null
                        and sigue_codser = '" . $datos['sigue_codser'] . "' and  sigue_codsus ='" . $datos['sigue_codsus'] . "' 
                        and sigue_codage = '" . $datos['sigue_codage'] . "' ";
            $resultado = $this->actualizarSinUsuario($datos, 'sigueactividad_nuevas', $condicion);
        } catch (\Exception $Ex) {
            throw new MyException("Error Actualizando Tabla Actividades Tecsoft: " . $Ex->getMessage(), -1);
        }
        return $resultado;
    }

}
