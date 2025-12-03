<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Utiles\DateUtil;

class ConstructorasModel extends AuditoriaServices {
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
        $sql = 'select proy.proyecto_ideregistro idMunicipio, proy.proyecto_nom nombreMunicipio  
               from proyectos proy 
               inner join empresas emp on emp.empresa_cod = proy.proyecto_codemp 
               where emp.empresa_sevemp = :idempresa and
                upper(proy.proyecto_nom)    like  :nombreMunicipio ';
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

        $sql = 'select mb.uni_barrio idBarrio,b.barrio_nom nombreBarrio 
            from proyectos p, muba_munbarrio mb, barrios b ,empresas e 
                where mb.uni_municipio=:idMunicipio and upper(b.barrio_nom) like :nombreBarrio and  
                p.proyecto_ideregistro=mb.uni_municipio and mb.uni_municipio=p.proyecto_ideregistro and 
                mb.uni_barrio=b.barrio_ideregistro and p.proyecto_cod=b.barrio_codpro
                and e.empresa_cod = p.proyecto_codemp 
                and e.empresa_sevemp = :idempresa  limit :paginacion  ';
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

    public function consultarContratos($parametros) {

        $complemento = '';
        if (!empty($parametros['idTercero'])) {
            $complemento.= 'and t.ter_ideregistro =:idTercero ';
        }
        if (!empty($parametros['idContrato'])) {
            $complemento.= 'and g.gco_numcontrato like :idContrato ';
            $parametros['idContrato'] = '%' . $parametros['idContrato'] . '%';
        }
        if (!empty($parametros['idBarrio'])) {
            $complemento.= 'and g.uni_barrio =:idBarrio ';
        }
        if (!empty($parametros['idMunicipio'])) {
            $complemento.= 'and g.uni_municipio=:idMunicipio ';
        }
        if (!empty($parametros['estado'])) {
            $complemento.= 'and g.gco_estado=:estado ';
        }
        if (!empty($parametros['fechaInicial']) && !empty($parametros['fechaFinal'])) {
            $complemento.= 'and g.gco_fecinicio between :fechaInicial and :fechaFinal ';
        }
        $sql =  "   SELECT      g.gco_ideregistro idregistro, 
                                g.gco_numcontrato contrato, 
                                t.ter_documento nit, 
                                t.ter_nomcompleto nombreConstructora,
                                g.gco_numlicencia licencia, 
                                g.gco_estado estado,
                                pr.proyecto_cod codigoMunicipio,
                                pr.proyecto_nom nombreMunicipio,
                                g.uni_barrio codigoBarrio,
                                b.barrio_nom nombreBarrio, 
                                g.gco_objeto objeto, 
                                g.gco_viginicio vigenciaInicio, 
                                g.gco_vigfinal vigenciaFinal,
                                g.gco_vlrantiva valorProyecto, 
                                g.gco_actinicio actaInicial, 
                                g.gco_fecinicio fechaInicio,
                                g.gco_actfinal actaFinal, 
                                g.gco_fecfinal fechaFinal,
                                t.ter_ideregistro terIderegistro,
                                g.gco_iva ivaProyecto,
                                g.gco_anticipo antproyecto,
                                g.gco_sevfactura sevfactura,
                                g.sus_ideregistro,
                                g.gco_vlrantiva valorantesiva, 
                                g.gco_licfecinicio, 
                                g.gco_licfecfin,
                                g.gco_poranticipo,
                                g.gco_porpagparc,
                                g.gco_porpagofin, 
                                g.gco_pagparcial, 
                                g.gco_pagfinal,
                                g.gco_direccion, 
                                g.gco_ideregistro ||'-' || date_part('year',gco_viginicio) consecutivo, 
                                g.gco_diaactivacion diaactivacion, 
                                g.liq_venclasific
                    FROM 	gco_gesconstruc g
                    INNER JOIN	ter_tercero t ON t.ter_ideregistro = g.ter_ideregistro  
                    INNER JOIN	proyectos pr ON pr.proyecto_ideregistro = g.uni_municipio
                    INNER JOIN	barrios b ON b.barrio_ideregistro = g.uni_barrio
                    INNER JOIN	uni_unidad uni ON uni.uni_codigo2 = g.liq_venclasific
                    INNER JOIN	prun_prgunidad prun ON prun.uni_ideregistro = uni.uni_ideregistro
                        AND 	prg_ideregistro = 48 
                    INNER JOIN	uspu_usuprgunid uspu ON uspu.prun_ideregistr = prun.prun_ideregistr
                        AND 	uspu.usu_ideregistro = :idusuario
                    INNER JOIN	esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro
                        AND 	esem.emp_ideregistro = :empresa
                    INNER JOIN	est_estructura est ON est.est_ideregistro = esem.est_ideregistro
                        AND 	est.cla_ideregistro = 48
                    WHERE       g.emp_ideregistro = :empresa                     
                    " . $complemento;

        $this->setSql($sql);
        $this->setParams($parametros);
        $resultado = $this->execute();
        $datos = array();
        foreach ($resultado as $contratos) {

            $registro['idRegistro'] = $contratos['idregistro'];
            $registro['contrato'] = $contratos['contrato'];
            $registro['nit'] = $contratos['nit'];
            $registro['nombreConstructora'] = $contratos['nombreconstructora'];
            $registro['licencia'] = $contratos['licencia'];
            $registro['estado'] = $contratos['estado'];
            $registro['codigoMunicipio'] = $contratos['codigomunicipio'];
            $registro['nombreMunicipio'] = $contratos['nombremunicipio'];
            $registro['codigoBarrio'] = $contratos['codigobarrio'];
            $registro['nombreBarrio'] = $contratos['nombrebarrio'];
            $registro['objeto'] = $contratos['objeto'];
            $registro['vigenciaInicio'] = DateUtil::timeStamptoDateYMD($contratos['vigenciainicio']);
            $registro['vigenciaFinal'] = DateUtil::timeStamptoDateYMD($contratos['vigenciafinal']);
            $registro['valorAntesIva'] = $contratos['valorantesiva'];
            $registro['actaInicial'] = $contratos['actainicial'];
            $registro['fechaInicio'] = DateUtil::timeStamptoDateYMD($contratos['fechainicio']);
            $registro['actaFinal'] = $contratos['actafinal'];
            $registro['fechaFinal'] = DateUtil::timeStamptoDateYMD($contratos['fechafinal']);
            $registro['ivaProyecto'] = $contratos['ivaproyecto'];
            $registro['antProyecto'] = $contratos['antproyecto'];
            $registro['sevFactura'] = $contratos['sevfactura'];
            $registro['terIderegistro'] = $contratos['terideregistro'];
            $registro['susIderegistro'] = $contratos['sus_ideregistro'];
            $registro['licenciavigentedesde'] = DateUtil::timeStamptoDateYMD($contratos['gco_licfecinicio']);
            $registro['licenciavigentehasta'] = DateUtil::timeStamptoDateYMD($contratos['gco_licfecfin']);
            $registro['porcentajeAnticipo'] = $contratos['gco_poranticipo'];
            $registro['porcentajePagoParcial'] = $contratos['gco_porpagparc'];
            $registro['vlrPagoParcial'] = $contratos['gco_pagparcial'];
            $registro['porcentajePagoFinal'] = $contratos['gco_porpagofin'];
            $registro['vlrPagoFinal'] = $contratos['gco_pagfinal'];
            $registro['Direccion'] = $contratos['gco_direccion'];
            $registro['Consecutivo'] = $contratos['consecutivo'];
            $registro['diaactivacion'] = $contratos['diaactivacion'];
            $informacionSuscriptorConvenio = $this->consultaInformacionSuscriptorConvenio($registro['idRegistro'], $registro['susIderegistro']);
            $registro['susDescripcion'] = $informacionSuscriptorConvenio[0]['susDescripcion'];
            $registro['susConvenio'] = $informacionSuscriptorConvenio[0]['conNombre'];

            $datos[] = $registro;
        }

        return $datos;
    }

    public function consultaInformacionSuscriptorConvenio($Ideregistro, $SusIderegisro) {
        $datos = array();
        $sql = "SELECT
                        sus_suscripcion.sus_descripcion,
                        cnre_cnvrecaudo.cnre_nombre
                        FROM
                        sus_suscripcion
                        INNER JOIN cnre_cnvrecaudo ON sus_suscripcion.cnre_ideregistr = cnre_cnvrecaudo.cnre_ideregistr 
                        INNER JOIN gco_gesconstruc ON sus_suscripcion.sus_ideregistro = gco_gesconstruc.sus_ideregistro and 
                        gco_gesconstruc.gco_ideregistro = '$Ideregistro' and 
                        gco_gesconstruc.sus_ideregistro= '$SusIderegisro'";

        $this->setSql($sql);
        $resultado = $this->execute();
        foreach ($resultado as $suscriptorconvenio) {
            $registro['susDescripcion'] = $suscriptorconvenio['sus_descripcion'];
            $registro['conNombre'] = $suscriptorconvenio['cnre_nombre'];
            $datos[] = $registro;
        }
        return $datos;
    }

    public function consultarContactos($parametros) {

        $sql = ' select c.cco_ideregistro idContacto, c.cco_nomcontacto nombreContacto, c.cco_cargo cargoContacto, 
                c.cco_correo correo, c.cco_telcelular telefonoCelular, c.cco_telfijo telefonoFijo  
                from  cco_conconstruc c  where c.gco_ideregistro=:idRegistro';
        $this->setSql($sql);
        $this->setParams($parametros);
        $resultado = $this->execute();
        $datos = array();
        foreach ($resultado as $contacto) {
            $registro['idContacto'] = $contacto['idcontacto'];
            $registro['nombreContacto'] = $contacto['nombrecontacto'];
            $registro['cargoContacto'] = $contacto['cargocontacto'];
            $registro['correo'] = $contacto['correo'];
            $registro['telefonoCelular'] = $contacto['telefonocelular'];
            $registro['telefonoFijo'] = $contacto['telefonofijo'];
            $datos[] = $registro;
        }
        return $datos;
    }

    public function editarContrato($datos, $detalleTransaccion) {

        $parametros['ter_ideregistro']  = $datos['idConstructora'];
        $parametros['gco_numcontrato']  = $datos['contrato'];
        $parametros['gco_estado']       = $datos['EstadoContrato'];
        $parametros['gco_numlicencia']  = $datos['Licencia'];
        $parametros['cue_ideregistro']  = $datos['proyectoSeven'];
        $parametros['liq_venclasific']  = $datos['clasifiLiq'];

        if (!empty($datos['licfechainicio'])) {
            $parametros['gco_licfecinicio'] = DateUtil::dateToTimeStamp($datos['licfechainicio']);
        }
        if (!empty($datos['licfecchafin'])) {
            $parametros['gco_licfecfin'] = DateUtil::dateToTimeStamp($datos['licfecchafin']);
        }

        $parametros['uni_municipio'] = $datos['Municipio'];
        $parametros['uni_barrio'] = $datos['Barrio'];
        $parametros['gco_direccion'] = $datos['Direccion'];
        $parametros['gco_objeto'] = $datos['Objeto'];
        $parametros['gco_actinicio'] = $datos['NumeroActaInicio'];
        if ( strlen($datos['FechaActaIncio']) > 0) {
            $parametros['gco_fecinicio'] = DateUtil::dateToTimeStamp($datos['FechaActaIncio']);
        }
        $parametros['gco_actfinal'] = $datos['NumeroActaFin'];
        $parametros['usu_ideregistro'] = $datos['idusuario'];
        if ( strlen($datos['FechaActaFin'] ) > 0 ) {
            $parametros['gco_fecfinal'] = DateUtil::dateToTimeStamp($datos['FechaActaFin']);
        }
        $parametros['gco_viginicio'] = DateUtil::dateToTimeStamp($datos['VigenciaDesde']);
        $parametros['gco_vigfinal'] = DateUtil::dateToTimeStamp($datos['VigenciaHasta']);
        $parametros['gco_vlrantiva'] = $datos['vlrAntesIva'];
        $parametros['gco_iva'] = $datos['vlrIva'];
        $parametros['gco_anticipo'] = 0;
        /*
        $parametros['gco_anticipo'] = $datos['vlrAnticipo'];
        $parametros['gco_poranticipo'] = $datos['porcentajeAnticipo'];
        $parametros['gco_porpagparc'] = $datos['porcentajePagoParcial'];
        $parametros['gco_porpagofin'] = $datos['porcentajePagoFinal'];
        $parametros['gco_pagparcial'] = $datos['vlrPagoParcial'];
        $parametros['gco_pagfinal'] = $datos['vlrPagoFinal'];*/

        $parametros['gco_sevfactura'] = $datos['infFacturaSeven'];
        $parametros['sus_ideregistro'] = $datos['susIdeRegistro'];
        $parametros['emp_ideregistro'] = $datos['emp_ideregistro'];
        $parametros['gco_diaactivacion'] = $datos['diaActivacion'];
        $sql = $this->construyeSQL($detalleTransaccion['accion'], 'gco_gesconstruc', $parametros, $detalleTransaccion['condicion']);
        $this->setSql($sql);
        $this->setParams($parametros);
        $this->setsecuencia('sq_gco_ideregistro');
        $this->executeUpdate();
        if ($detalleTransaccion['accion'] == 'update') {
            $idContrato = $detalleTransaccion['idContratoActualizado'];
        } else {
            $idContrato = $this->getlastId();
        }
        return $idContrato;
    }

    public function editarDetallePagoContrato($idContrato, $detalleTransaccion, $datos) {
        
        for($i=0; $i<count($datos); $i++){
            
            $parametros['gco_ideregistro']  = $idContrato;
            $parametros['gcdp_orden']       = $i;
            $parametros['gcdp_porcpago']    = $datos[$i]['porcentajePago'];
            $parametros['gcdp_poravance']   = $datos[$i]['porcentajeAvance'];
            $parametros['gcdp_fecfactura']  = $datos[$i]['fechaFactura'];
            $parametros['gcdp_factseven']   = $datos[$i]['facturaSeven'];
        
             $detalleTransaccion['condicion'] = ' gco_ideregistro ='.$idContrato.' AND gcdp_orden ='.$i;
            
            $sql = $this->construyeSQL($detalleTransaccion['accion'], 'gcdp_gesconstructoradistpagos', 
                $parametros, $detalleTransaccion['condicion']);
        
            $this->setSql($sql);
            $this->setParams($parametros);
            $this->setsecuencia('gcdp_gesconstructoradistpagos_gcdp_ideregistr_seq');
            $this->executeUpdate();
            
        }

        return $idContrato;
    }
    
    public function editarContacto($datos, $detalleTransaccion) {
        $sql = $this->construyeSQL($detalleTransaccion['accion'], 'cco_conconstruc', $datos, $detalleTransaccion['condicion']);
        $this->setSql($sql);
        $this->setParams($datos);
        $this->setsecuencia('sq_cco_ideregistro');
        $this->executeUpdate();
        if ($this->getnumFilas() == 0) {
            throw new MyException('Error al insertar el contacto.');
        }
        $idContacto = $this->getlastId();
        return $idContacto;
    }

    public function eliminarContacto($idContacto, $idContrato) {
        $complemento = '';
        $complemento.=' and  cco_ideregistro = ' . $idContacto;
        $whereDelete = ' WHERE gco_ideregistro =' . $idContrato . ' ' . $complemento;
        $sql = 'DELETE FROM cco_conconstruc ' . $whereDelete;
        $this->setSql($sql);
        $this->executeUpdate();
        return $this->getnumFilas();
    }

    public function consultarTerceroAseguradora($empresa, $AseguradoraNombre) {
        $AseguradoraNombre = rtrim($AseguradoraNombre);
        $AseguradoraNombre = ltrim($AseguradoraNombre);
        $sql = "SELECT DISTINCT
                ter_tercero.ter_documento,
                ter_tercero.ter_nomcompleto,
                ter_tercero.ter_ideregistro
                FROM
                ter_tercero
                INNER JOIN clte_clatercero ON clte_clatercero.ter_ideregistro = ter_tercero.ter_ideregistro
                WHERE
                clte_clatercero.uni_clatercero = 296 and lower(ter_tercero.ter_nomcompleto) like lower('%$AseguradoraNombre%') ";
        $this->setSql($sql);
        $resultado = $this->execute();
        $datos = array();
        foreach ($resultado as $terceroAseguradora) {
            $registro['idtercero'] = $terceroAseguradora['ter_ideregistro'];
            $registro['nombretercero'] = $terceroAseguradora['ter_nomcompleto'];
            $registro['documento'] = $terceroAseguradora['ter_documento'];
            $datos[] = $registro;
        }
        return $datos;
    }

    public function consultarSuscriptoresTercero($IdeTercero) {
        $sql = " SELECT DISTINCT sus_suscripcion.sus_descripcion,sus_suscripcion.ter_ideregistro,
                        cnre_cnvrecaudo.cnre_nombre,sus_suscripcion.sus_ideregistro
                        FROM sus_suscripcion
                        INNER JOIN cnre_cnvrecaudo ON sus_suscripcion.cnre_ideregistr = cnre_cnvrecaudo.cnre_ideregistr  AND
			sus_suscripcion.ter_ideregistro = '$IdeTercero' 
                        INNER JOIN dsus_detsuscrip dsus on dsus.sus_ideregistro = sus_suscripcion.sus_ideregistro and dsus.dsus_estado ='P' ";
//                            AND
//                        sus_suscripcion.sus_ideregistro not in(select gco_gesconstruc.sus_ideregistro 
//                        from gco_gesconstruc where gco_gesconstruc.gco_estado in('A','T')) ";
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

    public function ConsultarSuscripcionesSuscriptor($parametros) {
        $complemento = '';
        if (!empty($parametros['IdeSuscriptor'])) {
            $complemento = ' and sus.sus_ideregistro= :IdeSuscriptor ';
        } else {
            throw new MyException("No se hay Suscriptor Vinculado al Tercero", -1);
        }
        if (!empty($parametros['IdeSuscripcionServicioContratado'])) {
            $complemento = ' and dsus.dsus_ideregistr= :IdeSuscripcionServicioContratado ';
        }

        if (!empty($parametros['suscripcionesrelacionadas'])) {
            $complemento .= "AND  dsus.dsus_ideregistr NOT IN (";
            $band = 0;
            foreach ($parametros['suscripcionesrelacionadas'] as $datos) {
                if ($band > 0) {
                    $complemento .= ',';
                }
                $complemento .= $datos['susidesuscripcion'];
                $band +=1;
            }
            $complemento .= ")";
        }
        $sql = " select  distinct 
                  sus.sus_ideregistro idsuscriptor, ter.ter_ideregistro idtercero, 
                  ter.ter_documento cedula, ter.ter_nomcompleto nombretercero, 
                  dsus.dsus_ideregistr idsuscripcion,dsus.emp_ideregistro idempresa,
                  dsus.dsus_pcodigo codanterior,dsus.dsus_estado estado, 
                  dsus.uni_tipsuscripc idtiposuscripcion, dsus.uni_tipusosuscr idetipousu,
                  sus.sus_ideregistro idsuscriptor,sus.cnre_ideregistr convenio,pro.pro_direccion direccion ,
                  pro.pro_idepropieda idepropiedad ,un.uni_nombre1,
                  (select uni.uni_nombre1 from uni_unidad uni where uni.uni_ideregistro=dsus.uni_tipsuscripc ) tiposuscripcion
                from dsus_detsuscrip dsus inner join sus_suscripcion sus on dsus.sus_ideregistro=sus.sus_ideregistro
                  inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
                  inner join  pro_propiedad pro  on dsus.pro_ideregistro = pro.pro_ideregistro 
                  inner join uni_unidad un on dsus.uni_tipusosuscr = un.uni_ideregistro 
                  where dsus.dsus_estado in('P') " . $complemento . " ";

        // print_r($sql) ;
        $this->setSql($sql);
        $this->setParams($parametros);
        $resultado = $this->execute();
        $datos = array();
        foreach ($resultado as $suscripciones) {
            $registro['IdSuscriptor'] = $suscripciones['idsuscriptor'];
            //   $registro['susconvNombre'] = $suscripciones['nombreconvenio'];
            $registro['susidesuscripcion'] = $suscripciones['idsuscripcion'];
            $registro['susempideregistro'] = $suscripciones['idempresa'];
            $registro['CodAnterior'] = $suscripciones['codanterior'];
            $registro['Estado'] = $suscripciones['estado'];
            $registro['TipSuscripcion'] = $suscripciones['tiposuscripcion'];
            // $registro['susconvCodigo'] = $suscripciones['convenio'];
            $registro['terideregistro'] = $suscripciones['idtercero'];
            $registro['tercedula'] = $suscripciones['cedula'];
            $registro['ternombretercero'] = $suscripciones['nombretercero'];
            $registro['Direccion'] = $suscripciones['direccion'];
            $registro['IdePropiedad'] = $suscripciones['idepropiedad'];
            $registro['TipUso'] = $suscripciones['uni_nombre1'];
            $registro['idetipousu'] = $suscripciones['idetipousu'];
            $datos[] = $registro;
        }
        return $datos;
    }

    /** @Autor : Lmrubio @Fecha : 
     * @Descripcion: Consulta Autoliquidaciones asociadas a las constructoras filtrando por la empresa en sesion y el nombre 
     * de la liquidacion 
     * @return Array lista de registros Ide de la liquidacion, descripcion, dococumento y tipo de documento
     */
    public function autocompletarLiquidacion($liquidacion, $tipoUso, $clasifiLiq) {
        $strTipoUso = implode(",", $tipoUso); 
        
        $parametros["codempresa"] = $this->sesion->get('idempresa');
        $parametros["liquidacion"] = "%" . strtoupper($liquidacion) . "%";
        $parametros["clasifiLiq"] = $clasifiLiq;
        
        $sql = "    SELECT      uni.uni_ideregistro idliquidacion, 
                                uni.uni_nombre1 liquidacion,
                                est.est_ideregistro idestructura ,
                                doc.doc_nombre documento ,
                                tido.tido_nombre tipdocumento ,
                                liq.uni_documento iddocumento ,
                                liq.uni_tipdocument idtipodocumento 
                    FROM        uni_unidad uni
                    INNER JOIN  est_estructura est ON uni.est_ideregistro = est.est_ideregistro
                    INNER JOIN  esem_estempresa esem ON esem.est_ideregistro = est.est_ideregistro 
                    INNER JOIN  liq_liquidacion liq ON liq.uni_liquidacion = uni.uni_ideregistro 
                    INNER JOIN  lius_liquso lius ON lius.uni_liquidacion = liq.uni_liquidacion
                    INNER JOIN  tido_tipdocumen tido ON liq.uni_tipdocument = tido.uni_tipdocument 
                    INNER JOIN  doc_documento doc ON  doc.uni_documento = liq.uni_documento 
                    WHERE       est.cla_ideregistro = 3 
                        AND     liq.liq_venclasific = :clasifiLiq 
                        AND     esem.emp_ideregistro = :codempresa 
                        AND     UPPER(uni.uni_nombre1) LIKE :liquidacion 
                        AND     lius.uni_tipusosuscr in ($strTipoUso) "
                . " LIMIT       100 ";
        
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function ConsultaMetodoConstructivo() {
        $parametros["codempresa"] = $this->sesion->get('idempresa');
        $sql = "SELECT uni.uni_ideregistro idMetodo, uni.uni_nombre1 Metodo
                FROM
                uni_unidad uni
                INNER JOIN est_estructura est ON uni.est_ideregistro = est.est_ideregistro
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = est.est_ideregistro 
                WHERE
                est.cla_ideregistro = 23  AND esem.emp_ideregistro = :codempresa LIMIT 100 ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function ConsultaAgenda($datos) {
        $parametros["liquidacion"] = $datos['liquidacion'];
        $parametros["codempresa"] = $this->sesion->get('idempresa');
        $sql = "  SELECT DISTINCT lia.agenda_ideregistro idagenda,age.agenda_nom agenda 
                  FROM agendas age 
                    INNER JOIN liag_liqagenda lia on lia.agenda_ideregistro = age.agenda_ideregistro
                    INNER JOIN liq_liquidacion liq on liq.uni_liquidacion = lia.uni_liquidacion  
                    INNER JOIN esem_estempresa esem ON esem.est_ideregistro = liq.est_liquidacion 
                    INNER JOIN empresas emp on emp.empresa_sevemp = :codempresa and emp.empresa_cod = age.agenda_codemp               
                  WHERE 
                    lia.uni_liquidacion = :liquidacion AND esem.emp_ideregistro = :codempresa LIMIT 100  ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    public function ConsultaCamposAdicionalesServicios($parametros) {
        $datos = array();
        $parametros["codempresa"] = $this->sesion->get('idempresa');
        $sql = "SELECT uni.uni_ideregistro idliquidacion, tip.inf_ideregistro infoidregistro, tip.tip_tipo tipo ,  tip.tip_restringe restringe,
              tip.tip_obligatorio obligatorio, tip.tip_desarchivo archivo, tip.tip_extarchivo extensionarchivo ,tip.tip_desdirector ubicacion ,
              tip.tip_ideregistro tipoideregistro,tip.tip_nombre tiponombre ,tip.tip_orden
                FROM       uni_unidad uni
                INNER JOIN est_estructura est ON uni.est_ideregistro = est.est_ideregistro
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = est.est_ideregistro 
                INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion = uni.uni_ideregistro 
                INNER JOIN doc_documento doc ON  doc.uni_documento = liq.uni_documento  
                INNER JOIN inun_infunidad inun ON inun.uni_ideregistro = uni.uni_ideregistro 
                INNER JOIN tip_tipifica tip ON tip.inf_ideregistro   = inun.inf_ideregistro  
              WHERE est.cla_ideregistro = 3 AND  liq.liq_venclasific = 'AU' AND esem.emp_ideregistro = :codempresa
                and uni.uni_ideregistro= :liquidacion ORDER BY tip.tip_orden ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (!empty($resultado)) {

            foreach ($resultado as $valores) {
                if ($valores['restringe'] === 'S') {
                    $valores['opciones'] = $this->ConsultaCamposAdicionalesServiciosDetalle($valores['tipoideregistro'], $valores['infoidregistro']);
                }
                $datos[] = $valores;
            }
        }
        return $datos;
    }

    public function ConsultaCamposAdicionalesServiciosDetalle($tipo, $registro) {
        $Datos["tipo"] = $tipo;
        $Datos["registro"] = $registro;
        $sql = "select  dtip_formato,dtip_ideregistr, dtip_valor ,   dtip_vlrdefecto  defecto from dtip_dettipific where 
                inf_ideregistro =:registro and tip_ideregistro = :tipo";
        $resultado = $this->executeQuery($sql, $Datos);
        return $resultado;
    }

    /**
     * 
     * @param type $datos
     * @return type Array listado de Conceptos relacionados con la liquidacion 
     */
    public function ConsultaConceptosLiquidacion($datos) {
        $parametros["liquidacion"] = $datos['liquidacion'];
        $parametros["codempresa"] = $this->sesion->get('idempresa');
        $sql = "select  liq.liq_nombre liquidacion , con.uni_concepto idconcepto, con.con_nombre concepto,'0' peso from coli_conliquida coli
                inner join con_concepto con ON con.uni_concepto = coli.uni_concepto 
                inner join liq_liquidacion liq on liq.uni_liquidacion = coli.uni_liquidacion 
                inner join esem_estempresa esem on esem.est_ideregistro = liq.est_liquidacion 
                where esem.emp_ideregistro = :codempresa and liq.uni_liquidacion = :liquidacion ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Insersion de polizas 
     * @param type $datos 
     * @return type NUmero de Poliza insertada
     * @throws MyException
     */
    public function editarPolizas($datos) {

        $polizas = array();
        $this->setCampo($datos, $polizas, 'terideRegistro', 'ter_ideregistro');
        $this->setCampo($datos, $polizas, 'nroPoliza', 'pco_numpoliza');
        $this->setCampo($datos, $polizas, 'aseguradoraOjbeto', 'pco_objpoliza');
        $this->setCampo($datos, $polizas, 'aseguradoraValor', 'pco_valor');
        $this->setCampo($datos, $polizas, 'usuario', 'usu_ideregistro');
        $this->setCampo($datos, $polizas, 'vigenteDesde', 'pco_vigentedesde');
        $this->setCampo($datos, $polizas, 'vigenteHasta', 'pco_vigentehasta');
        if ($datos['transaccion'] === 'insert') {
            $this->setCampo($datos, $polizas, 'idContrato', 'gco_ideregistro');
            $resultado = $this->insertaPolizas($polizas);
        } else {
            $condicion = " pco_ideregistro = " . $datos['pco_ideregistro'];
            $resultado = $this->ModificarPolizas($polizas, $condicion);
        }
        if (empty($resultado) || $resultado === 0) {
            // print_r($datos);
            throw new MyException('Error editando poliza. ' + $datos['transaccion'], -1);
        }

        return $resultado;
    }

    public function insertaPolizas($datos) {
        $idPoliza = $this->insertar($datos, 'pco_polconstruc', 'sq_pco_ideregistro');
        if (empty($idPoliza)) {
            throw new MyException('Error al insertar poliza.');
        }
        return $idPoliza;
    }

    public function ModificarPolizas($datos, $condicion) {
        $idPoliza = $this->actualizar($datos, 'pco_polconstruc', $condicion);
        if ($idPoliza === 0) {
            throw new MyException('Error al editar Poliza poliza.', -1);
        }
        return $idPoliza;
    }

    public function eliminarPolizas($polizaEliminar) {
        $condicion = " pco_ideregistro = " . $polizaEliminar['pco_ideregistro'];
        return $this->eliminar('pco_polconstruc', $condicion);
    }

    public function eliminarSuscripcionesRelacionadas($suscripcionEliminar) {
        $condicion = " sco_ideregistro = " . $suscripcionEliminar;
        return $this->eliminar('sco_susconstruc', $condicion);
    }

    public function eliminarInformacionServiciosContratados($servicioContratado) {
        $condicion = " uco_ideregistro = " . $servicioContratado;
        // Eliminar SUscripciones Relacionadas 
        $this->eliminar('sco_susconstruc', $condicion);
        // Eliminar Información Adicional
        $this->eliminar('src_srvcontratad', $condicion);
        // Eliminar Conceptos
        $this->eliminar('inuc_infsrvcontratad', $condicion);
        // Eliminar Servicio COntratado  
        $this->eliminar('uco_uniconstruc', $condicion);
    }

    /**
     * 
     * @param type $datos
     * @param type $idConstructora
     * @return type $idServicioContratado
     * @throws MyException
     */
    public function EditarServiciosContratados($datos) {
        $servicios = array();
        $datos['estado'] = 'A';
        $this->setCampo($datos, $servicios, 'idContrato', 'gco_ideregistro');
        $this->setCampo($datos, $servicios, 'liquidacion', 'uni_liquidacion');
        $this->setCampo($datos, $servicios, 'iddocumento', 'uni_documento');
        $this->setCampo($datos, $servicios, 'idtipodocumento', 'uni_tipdocumento');
        $this->setCampo($datos, $servicios, 'metodo', 'uni_metconstruc');
        $this->setCampo($datos, $servicios, 'agenda', 'agenda_ideregistro');
        $this->setCampo($datos, $servicios, 'estado', 'uco_estado');
        $this->setCampo($datos, $servicios, 'usuario', 'usu_ideregistro');
        $this->setCampo($datos, $servicios, 'peso', 'uco_peso');
        //print_r($datos);
        if ($datos['transaccion'] === 'insert') {
            $resultado = $this->InsertaServiciosContratados($servicios);
        } else if ($datos['transaccion'] === 'update') {
            $condicion = " uco_ideregistro = " . $datos['uco_ideregistro'];
            $resultado = $this->ModificaServiciosContratados($servicios, $condicion);
            $resultado = ($resultado === 1 ) ? $datos['uco_ideregistro'] : $resultado;
        }
        if (empty($resultado) || $resultado === 0) {
            throw new MyException('Error editando Servicio Contratado. ' + $datos['transaccion'], -1);
        }
        return $resultado;
    }

    public function InsertaServiciosContratados($datos) {
        try {
            $idServicioContrado = $this->insertar($datos, 'uco_uniconstruc', 'sq_uco_ideregistro');
            return $idServicioContrado;
        } catch (\Exception $e) {
            throw new MyException('Error al insertar Servicio Contratado: Es probable que en los servicios contratados este utilizando la misma liquidacion es mas de un servicio ', -1);
        }
    }

    public function ModificaServiciosContratados($datos, $condicion) {
        $idServicioContrado = $this->actualizar($datos, 'uco_uniconstruc', $condicion);
        if ($idServicioContrado === 0) {
            throw new MyException("Error  Modifcando servicio Contratado " . $idServicioContrado, -1);
        }
        return $idServicioContrado;
    }

    /**
     * Inserta Suscripciones en la relacion de Servicios Contratdos suscripciones 
     * @param type $datos
     * @return type IdSuscripcion que se Inserta 
     * @throws MyException
     */
    public function EditarServiciosContratadosSuscripciones($datos) {
        $suscripciones = array();
        $this->setCampo($datos, $suscripciones, 'susidesuscripcion', 'dsus_ideregistr');
        $this->setCampo($datos, $suscripciones, 'usuario', 'usu_ideregistro');
        if ($datos['transaccion'] === 'insert') {
            $this->setCampo($datos, $suscripciones, 'idServicio', 'uco_ideregistro');
            $this->setCampo($datos, $suscripciones, 'idContrato', 'gco_ideregistro');
            $idSuscripcion = $this->InsertarServiciosContratadosSuscripciones($suscripciones);
        } else {
            $condicion = ' sco_ideregistro =' . $datos['sco_ideregistro'];
            $idSuscripcion = $this->ModificarServiciosContratadosSuscripciones($suscripciones, $condicion);
        }
        return $idSuscripcion;
    }

    public function InsertarServiciosContratadosSuscripciones($datos) {

        try {
            $idSuscripcion = $this->insertar($datos, 'sco_susconstruc', 'sq_sco_ideregistro');
            return $idSuscripcion;
        } catch (\Exception $ex) {

            throw new MyException('Error al insertar Suscripcion Servicio Contratado ' . $ex->getMessage(), -1);
        }
    }

    public function ModificarServiciosContratadosSuscripciones($datos, $condicion) {
        $idSuscripcion = $this->actualizar($datos, 'sco_susconstruc', $condicion);
        if ($idSuscripcion === 0) {
            throw new MyException('Error al modificar Servicio Contratado Suscripcion :' . $idSuscripcion, -1);
        }
        return $idSuscripcion;
    }

    /**
     * Inserta Conceptos relacionados al servicio contratado según la liquidación vinculada al servicio contratado 
     * @param type $datos 
     * @return type Id Registro de Concepto que se inserta 
     * @throws MyException
     */
    public function EditarServiciosContratadosConceptos($datos) {
        $conceptos = array();
        $this->setCampo($datos, $conceptos, 'idconcepto', 'uni_concepto');
        $this->setCampo($datos, $conceptos, 'peso', 'src_peso');
        $this->setCampo($datos, $conceptos, 'usuario', 'usu_ideregistro');
//        print_r($datos);
//        print_r($conceptos);
        if ($datos['transaccion'] === 'insert') {
            $this->setCampo($datos, $conceptos, 'idServicio', 'uco_ideregistro');
            $resultado = $this->InsertaServiciosContratadosConceptos($conceptos);
        } else {
            $condicion = " src_ideregistro =  " . $datos['src_ideregistro'];
            $resultado = $this->ModificarServiciosContratadosConceptos($conceptos, $condicion);
        }
        if (empty($resultado)) {
            throw new MyException('Error al Editar (' . $datos['transaccion'] . ' ) Conceptos en  Servicio Contratado :' . $datos['idServicio'], -1);
        }
        return $resultado;
    }

    /**
     * 
     * @param type $datos
     * @return type
     * @throws MyException
     */
    public function InsertaServiciosContratadosConceptos($datos) {
        $idConcepto = $this->insertar($datos, 'src_srvcontratad', 'sq_src_ideregistro');
        if (empty($idConcepto)) {
            throw new MyException('Error al modificar Conceptos en  Servicio Contratado :' . $datos['idServicio'], -1);
        }
        return $idConcepto;
    }

    /**
     * 
     * @param type $datos
     * @param type $condicion
     * @return type
     * @throws MyException
     */
    public function ModificarServiciosContratadosConceptos($datos, $condicion) {
        $idConcepto = $this->actualizar($datos, 'src_srvcontratad', $condicion);
        if ($idConcepto === 0) {
            throw new MyException('Error al actualizar Conceptos en  Servicio Contratado :' . $datos['idServicio'], -1);
        }
        return $idConcepto;
    }

    /**
     * Guarga información Adicional relacionada con el servicio contratado 
     * @param type $datos
     * @retulrn type Id Información Adicional
     * @throws MyException
     */
    public function InsertaServiciosContratadosInformacionAdicional($datos) {
        $InfoAdicional = array();
        $this->setCampo($datos, $InfoAdicional, 'informacion', 'inuc_informacio');
        $this->setCampo($datos, $InfoAdicional, 'Estado', 'inuc_estado');
        $this->setCampo($datos, $InfoAdicional, 'informacion', 'inuc_descripcio');
        $this->setCampo($datos, $InfoAdicional, 'liquidacion', 'uni_liquidacion');
        $this->setCampo($datos, $InfoAdicional, 'grupo', 'inuc_grpinform');
        $this->setCampo($datos, $InfoAdicional, 'tipoideregistro', 'tip_ideregistro');
        $this->setCampo($datos, $InfoAdicional, 'iddetalle', 'dtip_ideregistr');
        $this->setCampo($datos, $InfoAdicional, 'nombre', 'tip_nombre');
        $this->setCampo($datos, $InfoAdicional, 'usuario', 'usu_ideregistro');
        $InfoAdicional['uco_ideregistro'] = $datos['uco_ideregistro'];
        $idInformacionAdicional = $this->insertar($InfoAdicional, 'inuc_infsrvcontratad', 'sq_inuc_ideregistr');
        if (empty($idInformacionAdicional)) {
            throw new MyException('Error al insertar Información Adicional en Servicio Contratado :' . $datos['uco_ideregistro'], -1);
        }
        return $idInformacionAdicional;
    }

    public function ActualizaServiciosContratadosInformacionAdicional($datos) {
        $InfoAdicional = array();
        $condicion = " uco_ideregistro = " . $datos['uco_ideregistro']
                . " AND tip_ideregistro =" . $datos['tipoideregistro'];
        if (!empty($datos['iddetalle'])) {
            $condicion .= " AND dtip_ideregistr =" . $datos['iddetalle'];
        }
        $this->setCampo($datos, $InfoAdicional, 'informacion', 'inuc_informacio');
        $this->setCampo($datos, $InfoAdicional, 'Estado', 'inuc_estado');
        $this->setCampo($datos, $InfoAdicional, 'informacion', 'inuc_descripcio');
        $this->setCampo($datos, $InfoAdicional, 'liquidacion', 'uni_liquidacion');
        $this->setCampo($datos, $InfoAdicional, 'grupo', 'inuc_grpinform');
        $this->setCampo($datos, $InfoAdicional, 'tipoideregistro', 'tip_ideregistro');
        $this->setCampo($datos, $InfoAdicional, 'iddetalle', 'dtip_ideregistr');
        $this->setCampo($datos, $InfoAdicional, 'nombre', 'tip_nombre');
        $this->setCampo($datos, $InfoAdicional, 'usuario', 'usu_ideregistro');
        try {
            $idInformacionAdicional = $this->actualizar($InfoAdicional, 'inuc_infsrvcontratad', $condicion);
            return $idInformacionAdicional;
        } catch (\Exception $ex) {
            throw new MyException('Error al modificar Información Adicional en Servicio Contratado :' . $ex->getMessage() . $datos['uco_ideregistro']);
        }
    }

    public function DepurarServiciosContratadosInformacionAdicional($datos, $idServicio) {
        $parametros['uco_ideregistro'] = $idServicio;
        $sql = "  select  *
               from 
               inuc_infsrvcontratad 
               where uco_ideregistro = :uco_ideregistro AND inuc_estado ='A' order by  tip_ideregistro ";
        $this->setSql($sql);
        $this->setParametros($parametros);
        $resultinfoAdicional = $this->execute();
        foreach ($resultinfoAdicional as $AdicionalBD) {
            $Existe = 0;
            foreach ($datos as $DatoValidar) {
                if ($AdicionalBD['tip_ideregistro'] == $DatoValidar['tipoideregistro']) {
                    if (!empty(!empty($AdicionalBD['dtip_ideregistr']))) {
                        if ($AdicionalBD['dtip_ideregistr'] == $DatoValidar['iddetalle']) {
                            $Existe = 1;
                            break;
                        }
                    } else {
                        $Existe = 1;
                        break;
                    }
                }
            }
            if ($Existe == 0) {
                $parametrosEnviar = array();
                $parametrosEnviar['inuc_ideregistr'] = $AdicionalBD['inuc_ideregistr'];
                $this->CambiarEstadoServiciosContratadosInformacionAdicional($parametrosEnviar, 'D');
            }
        }
    }

    private function CambiarEstadoServiciosContratadosInformacionAdicional($Datos, $Estado) {
        $parametros = array();
        $parametros['inuc_estado'] = 'D';
        $condicion = " inuc_ideregistr = " . $Datos['inuc_ideregistr'];
        $cambioestado = $this->actualizar($parametros, 'inuc_infsrvcontratad', $condicion);
        return $cambioestado;
    }

    public function consultaInformacionContratoPolizas($contrato) {
        $parametros['idcontrato'] = $contrato;
//        print_r(" parametro de polizas :") ;
//        print_r($parametros['idcontrato']) ;
        $sql = " SELECT  pol.pco_ideregistro,pol.ter_ideregistro,pol.pco_numpoliza ,
                         pol.pco_objpoliza, pol.pco_valor, ter.ter_nomcompleto, pol.pco_vigentedesde , pol.pco_vigentehasta 
                FROM
                 pco_polconstruc  pol 
                 inner join ter_tercero ter ON ter.ter_ideregistro = pol.ter_ideregistro 
               WHERE
                 gco_ideregistro = :idcontrato";

        $this->setSql($sql);
        $this->setParams($parametros);
        $resultado = $this->execute();
        $polizas = array();
        foreach ($resultado as $poliza) {
            $dato = array();
            $this->setCampo($poliza, $dato, 'pco_ideregistro', 'pco_ideregistro');
            $this->setCampo($poliza, $dato, 'pco_numpoliza', 'nroPoliza');
            $this->setCampo($poliza, $dato, 'pco_objpoliza', 'aseguradoraOjbeto');
            $this->setCampo($poliza, $dato, 'pco_valor', 'aseguradoraValor');
            $this->setCampo($poliza, $dato, 'ter_nomcompleto', 'NomAseguradora');
            $this->setCampo($poliza, $dato, 'ter_ideregistro', 'terideRegistro');
            $this->setCampo($poliza, $dato, 'pco_vigentedesde', 'vigenteDesde');
            $this->setCampo($poliza, $dato, 'pco_vigentehasta', 'vigenteHasta');
            $dato['vigenteDesde'] = DateUtil::timeStamptoDateYMD($dato['vigenteDesde']);
            $dato['vigenteHasta'] = DateUtil::timeStamptoDateYMD($dato['vigenteHasta']);
            $polizas[] = $dato;
        }
        return $polizas;
    }

    public function consultarArchivos($contrato) {
        $parametros['idContrato'] = $contrato;
        $sql = " select * from  adgc_adjgesconstruc where gco_ideregistro = :idContrato ";
        $this->setSql($sql);
        $this->setParams($parametros);
        $resultado = $this->execute();
        $Archivos = array();
        foreach ($resultado as $Archivo) {
            $dato = array();
            $this->setCampo($Archivo, $dato, 'adgc_ideregistr', 'idarchivo');
            $this->setCampo($Archivo, $dato, 'adgc_nomarchivo', 'nombrearchivo');
            $this->setCampo($Archivo, $dato, 'adgc_ruta', 'ruta');
            $Archivos[] = $dato;
        }
        return $Archivos;
    }

    public function consultaInformacionContratoServiciosContratados($contrato) {
        $parametros['idcontrato'] = $contrato;
        $sql = " select  uco.* ,uni.uni_nombre1 liquidacionnombre  , age.agenda_nom agendanombre ,doc.doc_nombre documento, 
                         tido.tido_nombre tipdocumento ,met.uni_nombre1 metodonombre
                    FROM uco_uniconstruc  uco 
                        inner join  uni_unidad uni on  uco.uni_liquidacion = uni.uni_ideregistro 
                        inner join agendas  age on uco.agenda_ideregistro = age.agenda_ideregistro
                        inner join doc_documento doc on doc.uni_documento = uco.uni_documento 
                        inner join tido_tipdocumen tido on tido.uni_tipdocument = uco.uni_tipdocumento
                        inner join uni_unidad met on met.uni_ideregistro= uco.uni_metconstruc
                    WHERE 
                        uco.gco_ideregistro = :idcontrato ";
        $this->setSql($sql);
        $this->setParams($parametros);
        $resultado = $this->execute();
        $servicios = array();
        foreach ($resultado as $servicio) {
            $dato = array();
            $this->setCampo($servicio, $dato, 'agenda_ideregistro', 'agenda');
            $this->setCampo($servicio, $dato, 'agendanombre', 'agendatext');
            $this->setCampo($servicio, $dato, 'uni_documento', 'iddocumento');
            $this->setCampo($servicio, $dato, 'documento', 'documento');
            $this->setCampo($servicio, $dato, 'tipdocumento', 'tipoDocumento');
            $this->setCampo($servicio, $dato, 'uni_tipdocumento', 'idtipodocumento');
            $this->setCampo($servicio, $dato, 'uni_liquidacion', 'liquidacion');
            $this->setCampo($servicio, $dato, 'uni_metconstruc', 'metodo');
            $this->setCampo($servicio, $dato, 'metodonombre', 'metodotext');
            $this->setCampo($servicio, $dato, 'uco_peso', 'peso');
            $this->setCampo($servicio, $dato, 'uco_ideregistro', 'uco_ideregistro');
            $this->setCampo($servicio, $dato, 'liquidacionnombre', 'liquidaciontext');

            $dato['suscripciones'] = $this->getServiciosContratadosSuscripciones($servicio['uco_ideregistro']);
            $liquidacioninfo = array();
            $liquidacioninfo['uni_liquidacion'] = $dato['liquidacion'];
            $liquidacioninfo['nom_liquidacion'] = $dato['liquidaciontext'];
            $dato['conceptos'] = $this->getServiciosContratadosConceptos($servicio['uco_ideregistro'], $liquidacioninfo);
            $dato['informacionAdicional'] = $this->getServiciosContratadosInformacionAdicional($servicio['uco_ideregistro'], $liquidacioninfo);
            $servicios[] = $dato;
        }
        return $servicios;
    }

    public function getDetalleDistribucionPago($contrato) {
        
        $parametros['idcontrato'] = $contrato;
        
        $sql = "SELECT      gcdp_orden, 
                            gcdp_porcpago::INTEGER gcdp_porcpago, 
                            gcdp_poravance::INTEGER gcdp_poravance, 
                            gcdp_fecfactura, 
                            gcdp_factseven
                FROM        gcdp_gesconstructoradistpagos gcdp 
                WHERE       gcdp.gco_ideregistro = :idcontrato 
                ORDER BY    gcdp_orden;";
        
        $this->setSql($sql);
        $this->setParams($parametros);
        $resultado = $this->execute();
        $distribucionPagos = array();
        
        foreach ($resultado as $distPago) {
            $dato = array();
            $this->setCampo($distPago, $dato, 'gcdp_porcpago', 'porcentajePago');
            $this->setCampo($distPago, $dato, 'gcdp_poravance', 'porcentajeAvance');
            $this->setCampo($distPago, $dato, 'gcdp_fecfactura', 'fechaFactura');
            $this->setCampo($distPago, $dato, 'gcdp_factseven', 'facturaSeven');

            $distribucionPagos[] = $dato;
        }
        return $distribucionPagos;
    }
    
    private function getServiciosContratadosSuscripciones($ServicioContratado) {
        $parametros['uco_ideregistro'] = $ServicioContratado;
        $sql = " SELECT distinct 
                  sus.sus_ideregistro idsuscriptor, ter.ter_ideregistro idtercero, 
                  ter.ter_documento cedula, ter.ter_nomcompleto nombretercero, 
                  cnre.cnre_ideregistr idconvenio, cnre.cnre_nombre nombreconvenio,
                  dsus.dsus_ideregistr idsuscripcion,dsus.emp_ideregistro idempresa,
                  dsus.dsus_pcodigo codanterior,dsus.dsus_estado estado, 
                  dsus.uni_tipsuscripc idtiposuscripcion,
                  sus.sus_ideregistro idsuscriptor,sus.cnre_ideregistr convenio,pro.pro_direccion direccion ,
                  pro.pro_idepropieda idepropiedad ,un.uni_nombre1,
                  (select uni.uni_nombre1 from uni_unidad uni where uni.uni_ideregistro=dsus.uni_tipsuscripc ) tiposuscripcion,
                  sco.sco_ideregistro idregistro
                FROM dsus_detsuscrip dsus 
                  inner join sus_suscripcion sus on dsus.sus_ideregistro=sus.sus_ideregistro
                  inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
                  inner join cnre_cnvrecaudo cnre on sus.cnre_ideregistr = cnre.cnre_ideregistr
                  inner join  pro_propiedad pro  on dsus.pro_ideregistro = pro.pro_ideregistro 
                  inner join uni_unidad un on dsus.uni_tipusosuscr = un.uni_ideregistro
                  inner join sco_susconstruc sco on sco.dsus_ideregistr = dsus.dsus_ideregistr    
                WHERE  sco.uco_ideregistro = :uco_ideregistro ";
        $this->setSql($sql);
        $this->setParams($parametros);
        $resultado = $this->execute();
        $suscripciones = array();
        foreach ($resultado as $suscripcion) {
            $dato = array();
            $this->setCampo($suscripcion, $dato, 'idsuscriptor', 'IdSuscriptor');
            $this->setCampo($suscripcion, $dato, 'nombreconvenio', 'susconvNombre');
            $this->setCampo($suscripcion, $dato, 'idsuscripcion', 'susidesuscripcion');
            $this->setCampo($suscripcion, $dato, 'idempresa', 'susempideregistro');
            $this->setCampo($suscripcion, $dato, 'codanterior', 'CodAnterior');
            $this->setCampo($suscripcion, $dato, 'estado', 'Estado');
            $this->setCampo($suscripcion, $dato, 'tiposuscripcion', 'TipSuscripcion');
            $this->setCampo($suscripcion, $dato, 'convenio', 'susconvCodigo');
            $this->setCampo($suscripcion, $dato, 'idtercero', 'terideregistro');
            $this->setCampo($suscripcion, $dato, 'cedula', 'tercedula');
            $this->setCampo($suscripcion, $dato, 'nombretercero', 'ternombretercero');
            $this->setCampo($suscripcion, $dato, 'direccion', 'Direccion');
            $this->setCampo($suscripcion, $dato, 'idepropiedad', 'IdePropiedad');
            $this->setCampo($suscripcion, $dato, 'uni_nombre1', 'TipUso');
            $this->setCampo($suscripcion, $dato, 'idregistro', 'sco_ideregistro');
            $suscripciones[] = $dato;
        }
        return $suscripciones;
    }

    private function getServiciosContratadosConceptos($ServicioContratado, $liquidacion) {
        $parametros['uco_ideregistro'] = $ServicioContratado;
        $sql = " select src.src_ideregistro, src.uco_ideregistro ,src.uni_concepto idconcepto,con.con_nombre concepto ,src_peso peso
                    FROM src_srvcontratad src
                     inner join con_concepto con ON con.uni_concepto = src.uni_concepto 
                    WHERE 
                     src.uco_ideregistro = :uco_ideregistro 
                     ";
        $this->setSql($sql);
        $this->setParams($parametros);
        $conceptos = array();
        $resultados = $this->execute();
        foreach ($resultados as $concepto) {
            $concepto['liquidacion'] = $liquidacion['nom_liquidacion'];
            $conceptos[] = $concepto;
        }
        return $conceptos;
    }

    public function getServiciosContratadosInformacionAdicional($ServicioContratado, $liquidacion) {
        $parametros['uco_ideregistro'] = $ServicioContratado;
        $sql = "  select  *
               from 
               inuc_infsrvcontratad 
               where uco_ideregistro = :uco_ideregistro AND inuc_estado ='A'
                order by tip_ideregistro  ";
        $this->setSql($sql);
        $this->setParametros($parametros);
        $resultinfoAdicional = $this->execute();
        $informacionAdicional = array();
        $cont = 0;
        $subvalor = array();
        $valores = '';
        foreach ($resultinfoAdicional as $campo) {
            $dato = array();
            $this->setCampo($campo, $dato, 'inuc_estado', 'estado');
            $this->setCampo($campo, $dato, 'tip_nombre', 'nombre');
            $this->setCampo($campo, $dato, 'tip_ideregistro', 'tipoideregistro');
            $dato['liquidacion'] = $liquidacion['uni_liquidacion'];
            $dato['informacion'] = $campo['inuc_informacio'];
            $dato['iddetalle'] = $campo['dtip_ideregistr'];
            $informacionAdicional[] = $dato;
        }

        return $informacionAdicional;
    }

    public function insertarAdjuntoConstructoras($infoSoporte) {
        $parametros = array();
        $this->setCampo($infoSoporte, $parametros, 'tipoarchivo', 'adgc_tiparchivo');
        $this->setCampo($infoSoporte, $parametros, 'ruta', 'adgc_ruta');
        $this->setCampo($infoSoporte, $parametros, 'nombrearchivo', 'adgc_nomarchivo');
        $idAdjuntoConstructora = $this->insertar($parametros, 'adgc_adjgesconstruc', 'sq_adgc_ideregistr');
        $infoSoporte['idarchivo'] = $idAdjuntoConstructora;
        return $infoSoporte;
    }

    public function relacionarAdjuntoConstructoras($infoSoporte) {
        $parametros = array();
        $condicion = "adgc_ideregistr = " . $infoSoporte['idarchivo'];
        $this->setCampo($infoSoporte, $parametros, 'idContrato', 'gco_ideregistro');
        try {
            return $this->actualizar($parametros, 'adgc_adjgesconstruc', $condicion);
        } catch (\Exception $ex) {
            throw new MyException("Error Editando Archivos Relacionados a Contrato: " . $ex->getMessage(), -1);
        }
    }

    public function eliminarAdjuntos($idArchivo) {
        return $this->eliminar('adgc_adjgesconstruc', 'adgc_ideregistr=' . $idArchivo);
    }

    public function obtenerAdjunto($idarchivo) {
        $sql = "SELECT
                        adgc.adgc_ideregistr idficheroadjunto,
                        adgc.adgc_nomarchivo nombrearchivo,
                        adgc.adgc_ruta rutaarchivo,
                        adgc.adgc_tiparchivo tipoarchivo 
                        
                FROM
                        adgc_adjgesconstruc adgc
                WHERE
                        adgc.adgc_ideregistr = :idarchivo";
        $parametros['idarchivo'] = $idarchivo;

        $respuesta = $this->executeQuery($sql, $parametros);
        //   print_r($respuesta);
        if (empty($respuesta)) {
            throw new MyException('El archivo seleccionado no existe ', -1);
        }
        return $respuesta[0];
    }

    public function getBarrio($idBarrio) {
        $parametros['idbarrio'] = $idBarrio;
        $sql = 'select barrio_cod codigobarrio from barrios  bar where bar.barrio_ideregistro=:idbarrio';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró el código del barrio ' . $idBarrio, -1);
        }
        return $resultado[0];
    }

    public function ActualizarEstadoContrato($idContrato, $estado) {
        $condicion = ' gco_ideregistro = ' . $idContrato;
        $parametros = array();
        $parametros['gco_estado'] = $estado;
        try {
            $this->actualizar($parametros, 'gco_gesconstruc', $condicion);
        } catch (\Exception $ex) {
            throw new MyException('Error cambiando estado de Contrato ' . $ex->getMessage(), -1);
        }
    }

    public function ObtenerContratos($empresa, $estado, $contrato) {
        $parametros = array();
        $parametros['estado'] = $estado;
        $parametros['empresa'] = $empresa;
        $parametros['contrato'] = $contrato;
        $sql = ' SELECT gco.gco_ideregistro idcontrato
                    FROM gco_gesconstruc  gco 
                    WHERE gco.gco_estado =:estado AND gco.emp_ideregistro = :empresa
                          AND gco.gco_ideregistro = :contrato';
        $respuesta = $this->executeQuery($sql, $parametros);
        return $respuesta;
    }

    public function ObtenerAgendas($empresa, $estado, $idContrato) {
        $complemento = '';
        if (!empty($idContrato))
            $complemento = " AND gco.gco_ideregistro = :contrato";
        
        $parametros = array();
        $parametros['estado'] = $estado;
        $parametros['empresa'] = $empresa;
        $parametros['contrato'] = $idContrato;
        
        $sql = 'SELECT      NOW()::DATE fecha,  
                            gco.gco_ideregistro idproyecto, 
                            gco.cue_ideregistro proyseven,
                            sco.sco_ideregistro idventa,
                            uco.uco_ideregistro servicio, 
                            uco.uni_liquidacion liquidacion,
                            sco.dsus_ideregistr idsuscripcion,
                            uco.agenda_ideregistro idagenda,
                            age.agenda_cod codigoagenda,
                            age.agenda_alias agendaalias 
                FROM        sco_susconstruc sco 
                INNER JOIN  uco_uniconstruc uco on uco.uco_ideregistro = sco.uco_ideregistro 
                INNER JOIN  gco_gesconstruc gco on gco.gco_ideregistro = uco.gco_ideregistro  
                INNER JOIN  empresas emp ON emp.empresa_sevemp = gco.emp_ideregistro 
                INNER JOIN  agendas age on age.agenda_ideregistro = uco.agenda_ideregistro and age.agenda_codemp = emp.empresa_cod   
                WHERE       gco.gco_estado =:estado AND gco.emp_ideregistro = :empresa ' . $complemento;
        
        $respuesta = $this->executeQuery($sql, $parametros);
        return $respuesta;
    }

    public function getCodigoServicio($codigoAgenda, $idSuscripcion, $idEmpresa) {
        $parametros['codigoagenda'] = $codigoAgenda;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idempresa'] = $idEmpresa;
        $sql = " select serage.serage_codser codigoservicio
              from agendas age
                INNER JOIN servicios_agenda serage on age.agenda_cod=serage.serage_codage
                INNER JOIN proyectos pry on pry.proyecto_cod=serage.serage_codpro
                INNER JOIN dsus_detsuscrip dsus on dsus.uni_municipio = pry.proyecto_ideregistro
                INNER JOIN empresas emp on emp.empresa_cod=serage.serage_codemp
              where age.agenda_cod=:codigoagenda
                and serage.serage_nivser=3
                and serage.serage_ordser=1
                and emp.empresa_sevemp=:idempresa
                AND dsus.dsus_ideregistr =:idsuscripcion ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró la agenda', -1);
        }
        return $resultado[0]['codigoservicio'];
    }

    public function getCodigoEmpresa($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = 'select empresa_cod codigoempresa from empresas where empresa_sevemp=:idempresa';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se entontró el código de la empresa ' . $idEmpresa, -1);
        }
        return $resultado[0]['codigoempresa'];
    }

    public function getTipoinscripcion($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "select thul.cliente_tipins  tiposuscripcion
              from dsus_detsuscrip dsus inner join thul_tipusoliquida thul on dsus.uni_liquidacion= thul.uni_liquidacion
              where dsus.dsus_ideregistr=27 and thul.thul_tipo='VENTA'";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return;
        }
        return $resultado[0]['tiposuscripcion'];
    }

    public function getCodigoUsuario($idUsuario) {
        $parametros['idusuario'] = $idUsuario;
        $sql = 'select  usuario_nit codigousuario from usuarios where usu_ideregistro=:idusuario';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('No se encontró el codigo del usuario', -1);
        }
        return $resultado[0]['codigousuario'];
    }

        public function getClienteTecsoft($codigoanterior,$idempresa) {
        $parametros["codigoanterior"] = $codigoanterior;
        $parametros["idempresa"] = $this->sesion->get('idempresa');
        $sql = "  select count(*)  existe from clientes  cli
                    inner join empresas emp on emp.empresa_cod = cli.cliente_codemp 
                where cli.cliente_codsus = :codigoanterior and emp.empresa_sevemp = :idempresa  ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['existe'];
    }

    public function getVentaTecsoft($codigoanterior,$idempresa) {
        $parametros["codigoanterior"] = $codigoanterior;
        $parametros["idempresa"] = $this->sesion->get('idempresa');
        $sql = "  select count(*)  existe from ventas  ven
                    inner join empresas emp on emp.empresa_cod = ven.venta_codemp 
                where ven.venta_codsus = :codigoanterior and emp.empresa_sevemp = :idempresa  ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['existe'];
    }
    
    public function buscaContacto($idContacto) {
        $parametros["idcontacto"] = $idContacto;        
        $sql = "  select count(*)  existe from cco_conconstruc 
                where cco_ideregistro = :idcontacto";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['existe'];
    }
    
    public function actualizaContacto($datos){        
        $parametros['cco_cargo'] = $datos['cargoContacto']; 
        $parametros['cco_correo'] = $datos['correo']; 
        $parametros['cco_nomcontacto'] = $datos['nombreContacto']; 
        $parametros['cco_telcelular'] = $datos['telefonoCelular']; 
        $parametros['cco_telfijo'] = $datos['telefonoFijo']; 
        $condicion = "cco_ideregistro = ". $datos['idContacto'];     
        $contactoActualizado = $this->actualizar($parametros, 'cco_conconstruc', $condicion);
        if ($contactoActualizado === 0) {
            throw new MyException("Error  Modifcando los contactos " . $contactoActualizado, -1);
        }
        return $contactoActualizado;
    }
    
    public function buscarArchivo($idArchivo) {
        $parametros["idarchivo"] = $idArchivo;        
        $sql = "  select count(*)  existe from adgc_adjgesconstruc 
                where adgc_ideregistr = :idarchivo";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['existe'];
    }
    
    public function actualizarArchivo($datos, $idContrato){        
        $parametros['gco_ideregistro'] = $idContrato; 
        $condicion = "adgc_ideregistr = ". $datos['idarchivo'];     
        $adjuntoActualizado = $this->actualizar($parametros, 'adgc_adjgesconstruc', $condicion);
        if ($adjuntoActualizado === 0) {
            throw new MyException("Error  Modifcando los Adjuntos " . $adjuntoActualizado, -1);
        }
        return $adjuntoActualizado;
    }
    
    public function buscarContratos($idContarto) {
        $parametros["idcontrato"] = $idContarto;        
        $sql = "  select count(*)  existe from gco_gesconstruc 
                where gco_ideregistro = :idcontrato";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['existe'];
    }
    
    public function actualizarContratos($datos, $idContrato){  
        
        if ( strlen($datos['FechaActaIncio']) > 0) {
            
            $parametros['gco_fecinicio'] = str_replace('/', '-', $datos['FechaActaIncio']);
            $parametros['gco_fecinicio'] = DateUtil::dateToTimeStamp($datos['FechaActaIncio']);
        }
        if ( strlen($datos['FechaActaFin'] ) > 0 ) {
            $parametros['gco_fecfinal'] = str_replace('/', '-', $datos['FechaActaFin']);
            $parametros['gco_fecfinal'] = DateUtil::dateToTimeStamp($datos['FechaActaFin']);
        }
         $parametros['gco_ideregistro'] = $idContrato;
        $condicion = "gco_ideregistro = ".$idContrato;     
        $contratoActualizado = $this->actualizar($parametros, 'gco_gesconstruc', $condicion);
        if ($contratoActualizado === 0) {
            throw new MyException("Error,  Modifcando la fecha del acta del contrato " . $contratoActualizado, -1);
        }
        return $contratoActualizado;
    }
    
    
    public function consultarProyectosPadre($tercero, $empresa, $estado){  
        $parametros['empresa']  = $empresa;
        $parametros['estado']   = $estado;
        $parametros['tercero']  = $tercero;
        
        $sql = 
            "   SELECT      gco.gco_numcontrato, 
                            gco.gco_objeto
                FROM        gco_gesconstruc gco 
                WHERE       gco.emp_ideregistro = :empresa 
                    AND     gco.gco_estado = :estado 
                    AND     gco.ter_ideregistro = :tercero 
                ORDER BY    gco.gco_objeto; ";
        
        $resultado = $this->executeQuery($sql, $parametros);
        
        if (empty($resultado)) {
            return;
        }
        return $resultado;
    }
    
    
    public function consultarVenLiqClasificaProyecto($contrato){  
        
        $parametros['idcontrato']  = $contrato;
       
        $sql = 
            "   SELECT      gco.liq_venclasific,
                            gco.cue_ideregistro proyectoSeven
                FROM        gco_gesconstruc gco 
                WHERE       gco.gco_ideregistro = :idcontrato; ";
        
        $resultado = $this->executeQuery($sql, $parametros);
        
        if (empty($resultado)) {
            return;
        }
        return $resultado;
    }
}
