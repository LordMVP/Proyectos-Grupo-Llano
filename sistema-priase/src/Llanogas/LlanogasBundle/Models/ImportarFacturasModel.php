<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\MyException;

/**
 * Description of ImportarFacturasModel
 *
 * @author mebonilla
 */
class ImportarFacturasModel extends AuditoriaServices {

    /**
     * Sesión del usuario
     * @var SessionInterface
     */
    private $sesion;

    /**
     * Constructor de la clase
     * @param Connection $conexion
     */
    public function __construct(&$conexion, &$sesion) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
    }

    /**
     * Consulta la lista de otras empresas en la base de datos
     * @return array otras empresas encontradas en la base de datos de la aplicacion
     */
    public function consultarOtrasEmpresas() {
        $parametros["empresa_sevemp"] = $this->sesion->get("idempresa");
        $sql = "SELECT
                    em.empresa_sevemp idempresa,
                    em.empresa_nom empresa
                FROM
                    empresas em
                WHERE
                    em.empresa_sevemp <> :empresa_sevemp";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Obtiene informacion adicional de la liquidacion de una suscripcion
     * @param int $idliquidacion id de la liquidacion
     * @return array informacion de la liquidacion
     */
    public function consultarInfoLiquidacion($idliquidacion) {
        $parametros["uni_liquidacion"] = $idliquidacion;
        $sql = "SELECT
                            liq.uni_documento iddocumento,
                            liq.uni_tipdocument idtipodocumento
                FROM
                            liq_liquidacion liq
                WHERE
                    liq.uni_liquidacion = :uni_liquidacion";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0];
    }
    
    /**
     * Inserta una nueva factura
     * @param array $factura informacion de la nueva factura
     * @return int id de factura insertada
     */
    public function insertarFactura($factura) {
        $parametros = array();
        $this->setCampo($factura, $parametros, "facnumero", "fac_numero");
        $this->setCampo($factura, $parametros, "facmetgenera", "fac_metgenera");
        $this->setCampo($factura, $parametros, "facestado", "fac_estado");
        $this->setCampo($factura, $parametros, "facfecha", "fac_fecha");
        $this->setCampo($factura, $parametros, "facideactual", "fac_ideactual");
        $this->setCampo($factura, $parametros, "facidepadre", "fac_idepadre");
        $this->setCampo($factura, $parametros, "facfecaprobada", "fac_fecaprobada");
        $this->setCampo($factura, $parametros, "facfeceliminad", "fac_feceliminad");
        $this->setCampo($factura, $parametros, "facfecfinancia", "fac_fecfinancia");
        $this->setCampo($factura, $parametros, "facfeccastigad", "fac_feccastigad");
        $this->setCampo($factura, $parametros, "facfecvence", "fac_fecvence");
        $this->setCampo($factura, $parametros, "empideregistro", "emp_ideregistro");
        $this->setCampo($factura, $parametros, "susideregistro", "sus_ideregistro");
        $this->setCampo($factura, $parametros, "dsusideregistr", "dsus_ideregistr");
        $this->setCampo($factura, $parametros, "unitipsuscripc", "uni_tipsuscripc");
        $this->setCampo($factura, $parametros, "unitipusosuscr", "uni_tipusosuscr");
        $this->setCampo($factura, $parametros, "uniliquidacion", "uni_liquidacion");
        $this->setCampo($factura, $parametros, "terideregistro", "ter_ideregistro");
        $this->setCampo($factura, $parametros, "cicideregistro", "cic_ideregistro");
        $this->setCampo($factura, $parametros, "perideregistro", "per_ideregistro");
        $this->setCampo($factura, $parametros, "unidocumento", "uni_documento");
        $this->setCampo($factura, $parametros, "unitipdocument", "uni_tipdocument");
        $this->setCampo($factura, $parametros, "amoideregistro", "amo_ideregistro");
        $this->setCampo($factura, $parametros, "cicano", "cic_ano");
        $this->setCampo($factura, $parametros, "hliqideregistr", "hliq_ideregistr");
        $this->setCampo($factura, $parametros, "facsdoreal", "fac_sdoreal");
        $this->setCampo($factura, $parametros, "facideorigen", "fac_ideorigen");
        $this->setCampo($factura, $parametros, "unitiptercero", "uni_tiptercero");
        $this->setCampo($factura, $parametros, "facfecsuspens", "fac_fecsuspens");
        $this->setCampo($factura, $parametros, "finideregistro", "fin_ideregistro");
        $this->setCampo($factura, $parametros, "facversion", "fac_version");
        $this->setCampo($factura, $parametros, "facvlrreal", "fac_vlrreal");
        $this->setCampo($factura, $parametros, "usuideregistro", "usu_ideregistro");
        $this->setCampo($factura, $parametros, "mviideregistro", "mvi_ideregistro");        
        try{
          $resultado =  $this->insertar($parametros, "fac_factura", "sq_fac_ideregistro");
        } catch (\Exception $ex) {
            throw new MyException('Error, La suscripción ya tiene un número de factura, documento y tipo de documento para la empresa '.$factura['empresa'], -1);
        }
        return $resultado;        
    }

    /**
     * Inserta un nuevo detalle de factura para una factura seleccionada
     * @param array $detalle informacion del detalle de la factura
     * @return int id del detalle de la factura
     */
    public function insertarDetalleFactura($detalle) {
        $parametros = array();
        $this->setCampo($detalle, $parametros, "dfacestado", "dfac_estado");
        $this->setCampo($detalle, $parametros, "dfacideorigen", "dfac_ideorigen");
        $this->setCampo($detalle, $parametros, "dfaccantidad", "dfac_cantidad");
        $this->setCampo($detalle, $parametros, "dfacvlrunitari", "dfac_vlrunitari");
        $this->setCampo($detalle, $parametros, "dfacvlrtotal", "dfac_vlrtotal");
        $this->setCampo($detalle, $parametros, "dfacvlrreal", "dfac_vlrreal");
        $this->setCampo($detalle, $parametros, "dfacsdoreal", "dfac_sdoreal");
        $this->setCampo($detalle, $parametros, "facideregistro", "fac_ideregistro");
        $this->setCampo($detalle, $parametros, "uniconcepto", "uni_concepto");
        $this->setCampo($detalle, $parametros, "damoideregistr", "damo_ideregistr");
        $this->setCampo($detalle, $parametros, "dfacidepadre", "dfac_idepadre");
        $this->setCampo($detalle, $parametros, "dfinideregistr", "dfin_ideregistr");
        $this->setCampo($detalle, $parametros, "dfacversion", "dfac_version");
        $this->setCampo($detalle, $parametros, "usuideregistro", "usu_ideregistro");
        $this->setCampo($detalle, $parametros, "empideregistro", "emp_ideregistro");
        try{
           $resultado=$this->insertar($parametros, "dfac_detfactura", "sq_dfac_ideregistr"); 
        } catch (\Exception $ex) {
            throw  new MyException('Error, Verifique los conceptos Parametrizables',-1);
        }
        return $resultado;
    }

    /**
     * Consulta si ya se encuentra registrada una factura para el ciclo y el
     * periodo activo de la suspension
     * @param array $parametros 
     * @throws MyException
     */
    public function validarFactura(array $parametros) {
        $sql = "SELECT
                    COUNT (*) cantidad
                FROM
                    fac_factura
                WHERE
                    dsus_ideregistr = :idsuscripcion
                    AND emp_ideregistro = :idempresa
                    AND fac_numero = :facnumero
                    AND fac_sdoreal = fac_vlrreal";
        $resultado = $this->executeQuery($sql, $parametros);
        if ($resultado[0]['cantidad'] > 0) {
            $this->eliminarNumeroFactura($parametros);
           // throw new MyException('La suscripción ya tiene cargada una factura para el ciclo, periodo, año actual', -1);
        }
        return $resultado;
    }
    
    
    public function eliminarNumeroFactura(array $parametros){
        $sql="UPDATE fac_factura
                SET fac_numero = NULL, fac_estado='E', fac_sdoreal = 0, fac_feceliminad = now(), usu_ideregistro =:idusuario
                WHERE
                    dsus_ideregistr = :idsuscripcion
                    AND emp_ideregistro = :idempresa
                    AND fac_numero = :facnumero
                    AND fac_sdoreal = fac_vlrreal";
        $this->executeQuery($sql, $parametros);
    }
    
    public function validarFacturaDocumentoEmpresa($datos){
        $parametros['facnumero'] = $datos['facnumero'];
        $parametros['unidocumento'] = $datos['unidocumento'];
        $parametros['unitipdocument'] = $datos['unitipdocument'];
        $parametros['empideregistro'] = $datos['empideregistro'];
        
        $sql="SELECT
                    COUNT (*) cantidad
                FROM
                    fac_factura
                WHERE
                    fac_numero = : facnumero
                    AND uni_documento = :unidocumento
                    AND uni_tipdocument = :unitipdocument
                    AND emp_ideregistro = :empideregistro";
        $resultado = $this->executeQuery($sql, $parametros);
        if($resultado[0]['cantidad']>0){
            throw new MyException('Error, La suscripción ya tiene un número de factura, documento y tipo de documento para la empresa '.$sesion->get('empresa'), -1);
        }
        return $resultado ;
    }
    
    public function consultarTipoConcepto($idConcepto){
        $parametros["idconcepto"] = $idConcepto;
        $sql = "select
                    con.con_operacion operacion
                from
                    con_concepto con
                where
                    con.uni_concepto = :idconcepto";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0];
    }
    
    public function  insertarPropiedadSuscripcion($datosPropiedad){
        $parametros = array();
         
        $this->setCampo($datosPropiedad, $parametros, "numeropropiedad", "pro_idepropieda");
        $this->setCampo($datosPropiedad, $parametros, "estado", "pro_estado");
        $this->setCampo($datosPropiedad, $parametros, "descripcionpropiedad", "pro_descripcion");
        $this->setCampo($datosPropiedad, $parametros, "direccion", "pro_direccion");
        $this->setCampo($datosPropiedad, $parametros, "numeropropiedad", "pro_ideregistro");
        $this->setCampo($datosPropiedad, $parametros, "idtercero", "ter_ideregistro");
        $this->setCampo($datosPropiedad, $parametros, "tipopropiedad", "uni_tippropieda");
        $this->setCampo($datosPropiedad, $parametros, "estructurapropiedad", "est_tippropieda");
        $this->setCampo($datosPropiedad, $parametros, "prodigitos", "pro_digitos");
        $this->setCampo($datosPropiedad, $parametros, "idsector", "muba_sector");
        $this->setCampo($datosPropiedad, $parametros, "idseccion", "pro_seccion");
        $this->setCampo($datosPropiedad, $parametros, "manzana", "pro_manzana");
        $this->setCampo($datosPropiedad, $parametros, "idmunicipio", "uni_municipio");
        $this->setCampo($datosPropiedad, $parametros, "idbarrio", "uni_barrio");
        $this->setCampo($datosPropiedad, $parametros, "altoriesgo", "pro_altriesgo");
        $this->setCampo($datosPropiedad, $parametros, "catastral", "pro_numcatastral");
        $this->setCampo($datosPropiedad, $parametros, "zona", "pro_zona");
        $this->setCampo($datosPropiedad, $parametros, "usuideregistro", "usu_ideregistro");
        try{
            $resultado =$this->insertar($parametros, "pro_propiedad", null);
        }  catch (\Exception $ex){
            throw new MyException('La Propiedad no se pudo Insertar ', -1);
        }
        return $resultado ;
    }
    
    public function  insertarSuscripcion($suscripcion){
        $parametros = array();
         
        $this->setCampo($suscripcion, $parametros, "estadosuscripcion", "dsus_estado");
        $this->setCampo($suscripcion, $parametros, "descripciontiposuscripcion", "dsus_descripcion");
        $this->setCampo($suscripcion, $parametros, "codigoanterior", "dsus_pcodigo");
        $this->setCampo($suscripcion, $parametros, "idsuscriptor", "sus_ideregistro");
        $this->setCampo($suscripcion, $parametros, "idtercero", "ter_ideregistro"); 
        $this->setCampo($suscripcion, $parametros, "numeropropiedad", "pro_ideregistro");
        $this->setCampo($suscripcion, $parametros, "idmunicipio", "uni_municipio");
        $this->setCampo($suscripcion, $parametros, "idbarrio", "uni_barrio");
        $this->setCampo($suscripcion, $parametros, "idesttipsuscripcion", "est_tipsuscripc");
        $this->setCampo($suscripcion, $parametros, "idtiposuscripcion", "uni_tipsuscripc");
        $this->setCampo($suscripcion, $parametros, "idesttipouso", "est_tipusosuscr");
        $this->setCampo($suscripcion, $parametros, "idtipousosuscripcion", "uni_tipusosuscr");
        $this->setCampo($suscripcion, $parametros, "idempresa", "emp_ideregistro");
        $this->setCampo($suscripcion, $parametros, "idestliquidacion", "est_liquidacion");
        $this->setCampo($suscripcion, $parametros, "idliquidacion", "uni_liquidacion");
        $this->setCampo($suscripcion, $parametros, "idciclo", "cic_ideregistro");
        $this->setCampo($suscripcion, $parametros, "fecinicio", "dsus_fecinicio");
        $this->setCampo($suscripcion, $parametros, "estrato", "pro_catestrato");
        $this->setCampo($suscripcion, $parametros, "idfactor", "dsus_factor");
        $this->setCampo($suscripcion, $parametros, "usuideregistro", "usu_ideregistro");
        try{
            $resultado = $this->insertar($parametros, "dsus_detsuscrip", "sq_dsus_ideregistr");
        }  catch (\Exception $ex){
             throw new MyException('Error, Insertando la Suscripcion', -1);
        }
        return $resultado ;
    }
    
    public function insertarRelacionRuta($ruSuscripcion){
        $parametros = array ();
        $this->setCampo($ruSuscripcion, $parametros, "idruta", "rusu_rutanterio");
        $this->setCampo($ruSuscripcion, $parametros, "idruta", "rut_ideregistro");
        $this->setCampo($ruSuscripcion, $parametros, "idsuscripcion", "dsus_ideregistr");
        $this->setCampo($ruSuscripcion, $parametros, "idsecuencia", "rusu_rutsecuen");
        $this->setCampo($ruSuscripcion, $parametros, "usuideregistro", "usu_ideregistro");
        try{
            $resultado =  $this ->insertar($parametros, "rusu_rutsuscrip", "sq_rusu_ideregistr");
        }  catch (\Exception $ex){
             throw new MyException('Error, Insertando la Relacion de Ruta y Suscripcion', -1);
        }
        return $resultado ;
    }

    public function consultarPropiedad($idTercero,$numeroPropiedad){
        $parametros["idtercero"]= $idTercero;
        $parametros["numeropropiedad"]=$numeroPropiedad;
        
        $sql="SELECT
                nextval('sq_pro_ideregistro') numeropropiedad,
                pro_estado estado,
                pro_direccion direccion,
                uni_tippropieda tipopropiedad,
                est_tippropieda estructurapropiedad,
                muba_sector idsector,
                pro_seccion idseccion,
                pro_manzana manzana,
                uni_municipio idmunicipio,
                uni_barrio idbarrio,
                pro_altriesgo altoriesgo,
                pro_numcatastral catastral,
                pro_zona zona
            FROM
                pro_propiedad
            WHERE
                pro_idepropieda = :numeropropiedad
                AND ter_ideregistro = :idtercero";
        
        $resultado = $this->executeQuery($sql,$parametros);
        
        return $resultado[0];
        
    }
    
    
    public function consultarCicloActivo($idEmpresa){
        $parametros["idempresa"]=$idEmpresa;
        $sql="SELECT 
                cic.cic_ideregistro idciclo
              FROM ciem_cicempresa  ciem
              INNER JOIN cic_ciclo cic on cic.cic_ideregistro = ciem.cic_ideregistro
              WHERE emp_ideregistro = :idempresa and cic.cic_estado='A'";
        $resultado = $this->executeQuery($sql,$parametros);
        
        return $resultado[0];
    }
    
    public function actualizaConvenio($idSuscriptor, $idConvenio){
        $parametros["idsuscriptor"]= $idSuscriptor;
        $parametros["idconvenio"]= $idConvenio;
        $sql = "UPDATE 
                    sus_suscripcion 
                SET 
                    cnre_ideregistr = :idconvenio 
                WHERE 
                    sus_ideregistro = :idsuscriptor";
        $resultado = $this->executeQuery($sql,$parametros);
        if(empty($resultado)){
            throw new MyException('Error, No se actualizo el Convenio', -1);
        }
        return $resultado;
    }
    
    public function consultarTipInformacion($idUnidad){
        $parametros["idunidad"] = $idUnidad;
        $sql="SELECT
                    tip.tip_ideregistro idtipodato,  tip.inf_ideregistro idinformacion
                FROM
                        inun_infunidad inun
                INNER JOIN tip_tipifica tip ON tip.inf_ideregistro = inun.inf_ideregistro
                WHERE inun.uni_ideregistro = :idunidad";
        return $this->executeQuery($sql, $parametros);
    }
    
    public function insertarInformacionAdicionalFactura($informacionFactura){
        $parametros = array();
        try{
        $this->setCampo($informacionFactura, $parametros, "idfactura", "fac_ideregistro");
        $this->setCampo($informacionFactura, $parametros, "idtipodato", "tip_ideregistro");
        $this->setCampo($informacionFactura, $parametros, "idinformacion", "inf_ideregistro");
        $this->setCampo($informacionFactura, $parametros, "idtipvlr", "dtip_valor");
        $this->setCampo($informacionFactura, $parametros, "idusuario", "usu_ideregistro");
        $respuesta = $this->insertar($parametros, "infa_infadifactu", "sq_infa_ideregistr");
        } catch (\Exception $ex){
            throw new MyException($ex,-1);
        }
        return $respuesta;
    }
    
    public function actulizaFacturaPeriodoAnteriorNoRecaudo($datos){
        $parametros['estadoactual'] = $datos['estadoactual'];
        $parametros['idempresa'] = $datos['idempresa'];
        $parametros['facsdoreal'] = 0;
        $parametros['idciclo'] = $datos['idciclo'];
        // Se quita el fac_numero = NULL para este metodo ya que no se necesita eliminar el fac_numero de las facturas ya que estas deben ser consecutivas se habla con kelly 26/12/2016 testigo Marina Torres 
        // 10/MARZO/2017 se saldan todas las facturas
        $sql="UPDATE fac_factura
                    SET fac_estado = :estadoactual , 
                        fac_sdoreal = :facsdoreal, fac_feceliminad = now(), fac_vlrreal = :facsdoreal
                WHERE
                    cic_ideregistro =  :idciclo
                    AND emp_ideregistro = :idempresa
                    AND fac_sdoreal > 0";
        // se modifica Query --> update para controlar los recaudos de las facturas realizadas --> fac_sdoreal = fac_vlrreal
        try {
            $resultado = $this->executeQuery($sql,$parametros);
        } catch (\Exception $ex) {
            throw new MyException('Error, No se Actualizarón las facturas Anteriores', -1);
        }
        return $resultado;
    }
    
    
    public function getCicloPeriodoLiquidacionAnterior($idSuscripcion) {
        $resultado = $this->getCicloPeriodoCodigoAnterios($idSuscripcion);
        if (empty($resultado)) {
            throw new MyException('No se encontró el ciclo y periodo para la suscripción ' . $idSuscripcion, -1);
        }
        $datos['idCiclo'] = $resultado[0]['idciclo'];
        $datos['idciclo'] = $resultado[0]['idciclo'];
        $datos['ciclo'] = $resultado[0]['ciclo'];
        $datos['idPeriodo'] = $resultado[0]['idperiodo'];
        $datos['idperiodo'] = $resultado[0]['idperiodo'];
        $datos['periodo'] = $resultado[0]['periodo'];
        $datos['cicloanio'] = $resultado[0]['cicloanio'];
        $datos['orden'] = $resultado[0]['orden'];
        $datos['fechavencimiento'] = $resultado[0]['fechavencimiento'];
        $datos['fechasuspension'] = $resultado[0]['fechasuspension'];
        return $datos;
    }

    public function getCicloPeriodoCodigoAnterios($pcodigo) {
        $parametros['pcodigo'] = $pcodigo;
        $sql = "SELECT
                    cic.cic_ideregistro idciclo,
                    cic.cic_nombre ciclo,
                    per.per_ideregistro idperiodo,
                    per.per_nombre periodo,
                    cic.cic_anoactual cicloanio,
                    per.per_fecvence fechavencimiento,
                    per.per_fecsuspens fechasuspension,
                    per.per_ideorden orden
                FROM
                    cic_ciclo cic inner join per_periodo per on per.cic_ideregistro = cic.cic_ideregistro
		    inner join dsus_detsuscrip dsus on cic.cic_ideregistro=dsus.cic_ideregistro
                WHERE
                    per.per_estado = 'A' and
                    dsus.dsus_pcodigo = :pcodigo";//ojo se cambia logica
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error al consultar el ciclo ', -1);
        }
        return $resultado;
    }
    
    public function actualizaSuscripcion($parametro, $idusuario, $validaSuscripcionGas){
        
        $parametro['idusuario'] = $idusuario ;
        $parametro["codigoanterior"] =  $parametro["codigoanterior"] ;
        //$parametro['idsuscripcion'] = $validaSuscripcionGas['idsuscripcion'] ;
        $parametro['idciclo'] = $validaSuscripcionGas["idciclo"] ; 
        $parametro['idruta'] = $validaSuscripcionGas["idruta"] ; 
        $parametro['idsecuencia'] = $validaSuscripcionGas["idsecuencia"] ; 
        $parametro['idsuscripcion'] = $parametro['idsuscripcion'];
        $parametro['idsuscriptor'] = $validaSuscripcionGas['idsuscriptor'];
        
            $sql="UPDATE dsus_detsuscrip 
                    SET cic_ideregistro = :idciclo, usu_ideregistro = :idusuario, sus_ideregistro = :idsuscriptor
                     WHERE dsus_ideregistr = :idsuscripcion" ;
        $resultado =  $this->executeQuery($sql, $parametro);
        if(empty($resultado)){
             throw new MyException('No se actualizo la suscripción... ' , -1);
        }
        
        $sql = "UPDATE rusu_rutsuscrip SET rut_ideregistro = :idruta , rusu_rutsecuen = :idsecuencia
                WHERE dsus_ideregistr = :idsuscripcion ";
        $resultado =  $this->executeQuery($sql, $parametro);
         if(empty($resultado)){
             throw new MyException('No se actualizo la Ruta de la suscripción... ' , -1);
        }
    }
    
     public function validarFacturaSuscripcionPeriodo($datos) {
         $parametros['idsuscripcion'] = $datos['idsuscripcion'];
         $parametros['idempresa'] = $datos['idempresa'];
         $parametros['idperiodo'] = $datos['idperiodo'];
         $parametros['idempresa'] = $datos['idempresa'];
         $parametros['idciclo'] = $datos['idciclo'];
         $parametros['estado'] = $datos['estado'];
         
        $sql = "SELECT count(*) cantidad FROM fac_factura fac 
                WHERE fac_estado =:estado AND emp_ideregistro =:idempresa AND per_ideregistro = :idperiodo AND fac.cic_ideregistro = :idciclo
                        AND fac.dsus_ideregistr = :idsuscripcion  ;";
        $resultado = $this->executeQuery($sql, $parametros);
        
        return $resultado[0];
    }
    
    public function getCicloPeriodoAnteriorPcodigo($idSuscripcion) {
        $resultado = $this->getCicloPeriodoAnteriorCodigoAnterios($idSuscripcion);
        return $resultado[0];
    }

    public function getCicloPeriodoAnteriorCodigoAnterios($pcodigo) {
        $parametros['pcodigo'] = $pcodigo;
        $sql = "SELECT
                    cic.cic_ideregistro idciclo,
                    cic.cic_nombre ciclo,
                    perant.per_ideregistro idperiodo,
                    perant.per_nombre periodo,
                    cic.cic_anoactual cicloanio,
                    perant.per_fecvence fechavencimiento,
                    perant.per_fecsuspens fechasuspension,
                    perant.per_ideorden orden
                FROM
                    cic_ciclo cic inner join per_periodo per on per.cic_ideregistro = cic.cic_ideregistro
                    inner join per_periodo perant on perant.per_ideregistro < per.per_ideregistro and perant.cic_ideregistro = per.cic_ideregistro
		    inner join dsus_detsuscrip dsus on cic.cic_ideregistro=dsus.cic_ideregistro
                WHERE
                    per.per_estado = 'A' and
                    dsus.dsus_pcodigo = :pcodigo  order by perant.per_ideregistro desc limit 1";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error al consultar el ciclo ', -1);
        }
        return $resultado;
    }
    
    

    
    ///********************************    NUEVO    ***************************////
    
    public function leerTablaTemporal($idproceso,$idempresa,$idusuario){
        $parametros['idproceso'] = $idproceso;
        $parametros['idempresa'] = $idempresa;
        $parametros['idusuario'] = $idusuario;
        
        ///  incluir un inner join para la con el dsus_det
        $sql="SELECT 
                ipfe_ideregistr, impf.fac_numero numfactura,
                impf.fac_sdoreal facsdoreal,
                impf.concepto_bio conceptofinan,
                impf.ipfe_detalles detalles,
                impf.fac_fecha facfecha,
                impf.fac_fecvence facfecvence,
                1 facversion,

                dsusbio.dsus_pcodigo pcodigo_bio ,  
                dsusbio.dsus_ideregistr idsuscripcion_bio,
                dsusbio.uni_tipsuscripc idtiposuscripcion,
                (case WHEN impf.tipouso is null  THEN dsusbio.uni_tipusosuscr
			ELSE impf.tipouso 
                end) tipouso,
                dsusbio.uni_liquidacion idliquidacion_bio,
                terbio.uni_tiptercero idtipotercero,

                dsusgas.dsus_pcodigo codigoanteriorgas,
                dsusgas.dsus_ideregistr idsuscripcion_gas,
                dsusgas.sus_ideregistro idsuscriptor,  
                dsusgas.ter_ideregistro idtercero  
            FROM                temp_impfactura_enc impf
                INNER JOIN 	dsus_detsuscrip dsusbio on dsusbio.dsus_pcodigo = impf.dsus_pcodigo_bio	 and dsusbio.emp_ideregistro = :idempresa
                INNER JOIN      ter_tercero terbio ON terbio.ter_ideregistro = dsusbio.ter_ideregistro
                INNER JOIN 	dsus_detsuscrip dsusgas on dsusgas.dsus_pcodigo = impf.dsus_pcodigo_gas 
            WHERE 		ipfe_estado ='A' and idproceso =:idproceso
            and 		impf.usu_ideregistro =:idusuario and impf.emp_ideregistro = :idempresa
            LIMIT 500" ;
         $resultado = $this->executeQuery($sql, $parametros);
        
        return $resultado;
    }
    
    
     public function existeTablaTempEncabezado() {
         
        $sql = "SELECT count(*) cantidadtablas
                FROM  information_schema.TABLES
                WHERE TABLE_NAME = 'temp_impfactura_enc';";
        $resultado = $this->executeQuery($sql);
        return $resultado[0]['cantidadtablas'];
    }
    
    public function  vaciarTablaTempEncabezado($idEmpresa, $idusuario){
        try {
            $sql = "DELETE FROM temp_impfactura_enc  where emp_ideregistro =  $idEmpresa and usu_ideregistro = $idusuario";
            
            $this->executeQuery($sql);
        } catch (\Exception $ex) {
            print_r($ex);
            throw new MyException('Error eliminando datos de la tabla temporal Encabezado', -1);
            
        }
        
    }
    
    public function crearTablaTempEncabezado() {
        $sql="CREATE TABLE temp_impfactura_enc
                (
                  ipfe_ideregistr bigint NOT NULL DEFAULT nextval('sq_ipfe_ideregistr'::regclass),
                  ipfe_estado character varying(1) NOT NULL,
                  ipfe_mensaje character varying(254),
                  dsus_pcodigo_bio character varying(20) NOT NULL,
                  dsus_pcodigo_gas character varying(20) NOT NULL,
                  fac_numero bigint NOT NULL,
                  tipouso integer,
                  fac_fecha timestamp(6) without time zone,
                  fac_fecvence timestamp(6) without time zone,
                  fac_sdoreal numeric(20,7) NOT NULL,
                  concepto_bio character varying(20),
                  idproceso integer NOT NULL,
                  usu_ideregistro integer NOT NULL,
                  emp_ideregistro integer NOT NULL,
                  ipfe_fecha timestamp(6) without time zone NOT NULL,
                  ipfe_detalles text NOT NULL,
                  CONSTRAINT temp_impfactura_enc_pkey PRIMARY KEY (ipfe_ideregistr))";
        $this->executeQuery($sql);
         $sqlIndxPcodigoBio = 'CREATE INDEX "IX_imfe_dsus_pcodigo_bio"  ON temp_impfactura_enc USING btree  (dsus_pcodigo_bio COLLATE pg_catalog."default")';
        $this->executeQuery($sqlIndxPcodigoBio);        
        $sqlIndxPcodigoGas = 'CREATE INDEX "IX_imfe_dsus_pcodigo_gas"  ON temp_impfactura_enc  USING btree  (dsus_pcodigo_gas COLLATE pg_catalog."default")';
        $this->executeQuery($sqlIndxPcodigoGas);        
        $sqlIndxEmpIderegistro = 'CREATE INDEX "IX_imfe_emp_ideregistro"  ON temp_impfactura_enc  USING btree  (emp_ideregistro)';
        $this->executeQuery($sqlIndxEmpIderegistro);        
        $sqlIndxIdUsuario = 'CREATE INDEX "IX_imfe_usu_ideregistro"  ON temp_impfactura_enc  USING btree  (usu_ideregistro)';
        $this->executeQuery($sqlIndxIdUsuario);
        $sqlIndxEstado = 'CREATE INDEX "IX_imfe_estado"  ON temp_impfactura_enc  USING btree  (ipfe_estado)';
        $this->executeQuery($sqlIndxEstado);
    }

    
    
    
    
      /**
     * Inserta una nueva factura
     * @param array $factura informacion de la nueva factura
     * @return int id de factura insertada
     */
    public function insertarFacturaEncabezado($factura) {
        $parametros = array();
        $this->setCampo($factura, $parametros, "ipfeestado", "ipfe_estado");
        $this->setCampo($factura, $parametros, "facnumero", "fac_numero");
        $this->setCampo($factura, $parametros, "pcodigobio", "dsus_pcodigo_bio");
        $this->setCampo($factura, $parametros, "pcodigogas", "dsus_pcodigo_gas");
        $this->setCampo($factura, $parametros, "tipouso", "tipouso");
        $this->setCampo($factura, $parametros, "facfecha", "fac_fecha");
        $this->setCampo($factura, $parametros, "facfecvence", "fac_fecvence");
        $this->setCampo($factura, $parametros, "facsdoreal", "fac_sdoreal");
        $this->setCampo($factura, $parametros, "conceptofinan", "concepto_bio");
        $this->setCampo($factura, $parametros, "idproceso", "idproceso");
        $this->setCampo($factura, $parametros, "idusuario", "usu_ideregistro");
        $this->setCampo($factura, $parametros, "idempresa", "emp_ideregistro");
        $this->setCampo($factura, $parametros, "ipfefecha", "ipfe_fecha");
        $this->setCampo($factura, $parametros, "detallado", "ipfe_detalles");
        
        try{
          $resultado =  $this->insertar($parametros, "temp_impfactura_enc", "sq_ipfe_ideregistr");
        } catch (\Exception $ex) {
            print_r($ex->getMessage());
            throw new MyException('Error, No se pudo insertar el encabezado Temporal', -1);
        }
        return $resultado;        
    }
    
    public function insertarDetalleFacturaTemporal($factura) {
        $parametros = array();
        $this->setCampo($factura, $parametros, "ipfeideregistr", "ipfe_ideregistr");
        $this->setCampo($factura, $parametros, "uniconcepto", "uni_concepto");
        $this->setCampo($factura, $parametros, "dfacvlrunitari", "dfacvlrunitari");
        $this->setCampo($factura, $parametros, "usuideregistro", "usu_ideregistro");
        try{
          $resultado =  $this->insertar($parametros, "temp_impfactura_det", "sq_ipfd_ideregistr");
        } catch (\Exception $ex) {
            throw new MyException('Error, No se pudo insertar el Detalle Temporal', -1);
        }
        return $resultado;      
    }
    
    
    public function getCicloPeriodoPcodigo($idSuscripcion) {
        $resultado = $this->getCicloPeriodoCodigoAnterios($idSuscripcion);
        return $resultado[0];
    }
    
    public function validaEstadoGasModelo($idusuario, $idProceso){
        $parametros = array();
        $parametros['idusuario'] = $idusuario;
        $parametros['idproceso'] = $idProceso;
        $sql="update temp_impfactura_enc set ipfe_estado ='E', ipfe_mensaje ='Suscripcion Gas No esta Activa' 
                FROM (
                    SELECT   impf.ipfe_ideregistr  idtemp
                    FROM 				temp_impfactura_enc impf
                    INNER JOIN 	dsus_detsuscrip dsusgas on dsusgas.dsus_pcodigo = impf.dsus_pcodigo_gas 
                    WHERE       dsusgas.dsus_estado not in ('A')  and impf.usu_ideregistro =:idusuario and  impf.idproceso =:idproceso 
                )as info
                WHERE 			info.idtemp = temp_impfactura_enc.ipfe_ideregistr";
        $this->executeQuery($sql, $parametros);
    }
    
    public function UsuarioGasNoExistenPrisma($idusuario, $idProceso){
         $parametros = array();
        $parametros['idusuario'] = $idusuario;
        $parametros['idproceso'] = $idProceso;
        $sql="update temp_impfactura_enc set ipfe_estado ='E', ipfe_mensaje ='Suscripcion Gas no Existe en Prisma' 
                FROM (
                select impf.ipfe_ideregistr idtemp
                from temp_impfactura_enc impf 

                LEFT JOIN  dsus_detsuscrip dsus on impf.dsus_pcodigo_gas = dsus.dsus_pcodigo
                where  dsus.dsus_pcodigo IS NULL 
                AND impf.usu_ideregistro =:idusuario
                and  impf.idproceso =:idproceso
                ) as info
                WHERE info.idtemp = temp_impfactura_enc.ipfe_ideregistr";
        $this->executeQuery($sql, $parametros);
    }
    
    public function buscaSuscripcionesHomologar($idusuario, $idProceso){       
         $parametros = array();
        $parametros['idusuario'] = $idusuario;
        $parametros['idproceso'] = $idProceso;
         $sql="SELECT
                        DISTINCT                    impf.ipfe_ideregistr ,impf.dsus_pcodigo_bio dsus_pcodigo_bio,
                                                    impf.tipouso tipouso,
                                                    tergas.ter_ideregistro idtercero,
                                                    dsusgas.dsus_pcodigo codigoanterior,							
                                                    progas.pro_idepropieda numeropropiedad,							
                                                    dsusgas.dsus_estado estadosuscripcion,
                                                    cnre.cnre_ideregistr idconvenio,
                                                    dsusgas.pro_catestrato estrato,
                                                    dsusgas.uni_tipsuscripc idtiposuscripcion,
                                                    dsusgas.sus_ideregistro idsuscriptor,
                                                    dsusgas.uni_tipusosuscr idtipousosuscripcion,
                                                    dsusgas.emp_ideregistro idempresa,
                                                    dsusgas.uni_municipio idmunicipio, 
                                                    dsusgas.uni_barrio idbarrio,
                                                    dsusgas.cic_ideregistro idciclo, 
                                                    dsusgas.pro_ideregistro idpropied,
                                                    rut.rut_ideregistro idruta,
                                                    rusugas.rusu_rutsecuen  idsecuencia,
                                                    tergas.uni_tiptercero idtipotercero
                FROM
                                                    temp_impfactura_enc impf
                LEFT JOIN                           dsus_detsuscrip dsusbio ON impf.dsus_pcodigo_bio = dsusbio.dsus_pcodigo
                INNER JOIN                          dsus_detsuscrip dsusgas ON dsusgas.dsus_pcodigo = impf.dsus_pcodigo_gas
                INNER JOIN                          sus_suscripcion sus ON sus.sus_ideregistro = dsusgas.sus_ideregistro
                INNER JOIN                          cnre_cnvrecaudo cnre ON sus.cnre_ideregistr = cnre.cnre_ideregistr
                INNER JOIN                          pro_propiedad progas ON progas.pro_ideregistro = dsusgas.pro_ideregistro
                INNER JOIN                          ter_tercero tergas ON tergas.ter_ideregistro = dsusgas.ter_ideregistro 
                LEFT JOIN                           rusu_rutsuscrip rusugas ON rusugas.dsus_ideregistr = dsusgas.dsus_ideregistr 
                LEFT JOIN                           rut_ruta rut ON rut.rut_ideregistro = rusugas.rut_ideregistro 
   
                WHERE
                                                dsusbio.dsus_pcodigo IS NULL
                AND 				impf.usu_ideregistro =:idusuario
                AND                             impf.idproceso =:idproceso 
                AND 				impf.ipfe_estado = 'A'";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }
    
    public function actualizarRegistroProceso($idTemporal, $estado, $mensaje) {
        $parametros['ipfe_ideregistr'] = $idTemporal;
        $parametros['ipfe_estado'] = $estado;
        $parametros['ipfe_mensaje'] = $mensaje;
        $this->actualizar($parametros, 'temp_impfactura_enc', 'ipfe_ideregistr=:ipfe_ideregistr');
    }
    
    public function validaEmpresaSuscripcionSession($idEmpresa, $idProceso, $idusuario){
       
        $sql="update temp_impfactura_enc set ipfe_estado ='E', ipfe_mensaje ='Suscripcion no pertenece a la empresa de la Sesion' 
                FROM (
                    select impt.ipfe_ideregistr  idtemp from temp_impfactura_enc impt
                    INNER JOIN dsus_detsuscrip  dsusbio on dsusbio.dsus_pcodigo = impt.dsus_pcodigo_bio
                    where impt.emp_ideregistro = $idEmpresa  AND dsusbio.emp_ideregistro <> $idEmpresa   and impt.usu_ideregistro =$idusuario and  impt.idproceso =$idProceso  
                )as info
                WHERE 			info.idtemp = temp_impfactura_enc.ipfe_ideregistr";
        $this->execute($sql);
    }
    
    public function validarCicloSeleccionado($cicloSelecionado, $idUsuario, $idEmpresa, $idProceso){
        $parametros = array();
        
        $parametros['cicloselecionado'] = $cicloSelecionado;
        $parametros['idusuario'] = $idUsuario;
        $parametros['idproceso'] = $idProceso;
        $parametros['idempresa'] = $idEmpresa;
        $sql="update temp_impfactura_enc set ipfe_estado ='E', ipfe_mensaje ='Error, La suscripción no pertenece al ciclo Seleccionado' 
                FROM (
                    SELECT   impf.ipfe_ideregistr  idtemp 
                    from 				temp_impfactura_enc impf
                    INNER JOIN 	dsus_detsuscrip  dsusgas ON dsusgas.dsus_pcodigo = impf.dsus_pcodigo_gas
                    where impf.ipfe_estado ='A' AND  dsusgas.cic_ideregistro <> :cicloselecionado
                    and impf.usu_ideregistro =:idusuario and  impf.idproceso =:idproceso and impf.emp_ideregistro= :idempresa
                 )as info
                WHERE 	info.idtemp = temp_impfactura_enc.ipfe_ideregistr";
        $this->executeQuery($sql, $parametros);
    }
    
    public function validarCiclosActivos( $idUsuario, $idEmpresa, $idProceso){
        $parametros = array();        
        $parametros['idusuario'] = $idUsuario;
        $parametros['idproceso'] = $idProceso;
        $parametros['idempresa'] = $idEmpresa;
        $sql="update temp_impfactura_enc set ipfe_estado ='E', ipfe_mensaje ='No se encontró el ciclo y periodo para la suscripción' 
                FROM (
                    SELECT   impf.ipfe_ideregistr  idtemp 
                    from 				temp_impfactura_enc impf
                    INNER JOIN 	dsus_detsuscrip  dsusgas ON dsusgas.dsus_pcodigo = impf.dsus_pcodigo_gas
                    where impf.ipfe_estado ='A'  
                    and impf.usu_ideregistro =:idusuario and  impf.idproceso =:idproceso and impf.emp_ideregistro= :idempresa
                    AND  dsusgas.cic_ideregistro not in (SELECT   cic.cic_ideregistro
                                                        from 		temp_impfactura_enc impf1
                                                        INNER JOIN 	dsus_detsuscrip  dsusgas1 ON dsusgas1.dsus_pcodigo = impf1.dsus_pcodigo_gas
                                                        INNER JOIN	cic_ciclo cic	on cic.cic_ideregistro = dsusgas1.cic_ideregistro
                                                        INNER JOIN 	per_periodo  per on per.cic_ideregistro = cic.cic_ideregistro
                                                        where impf1.ipfe_estado ='A'  and per.per_estado ='A'
                                                        group by cic.cic_ideregistro)
  
            )as info
            WHERE   info.idtemp = temp_impfactura_enc.ipfe_ideregistr";
        $this->executeQuery($sql, $parametros);
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
                        FROM temp_impfactura_enc  impf 
                        WHERE  impf.usu_ideregistro = :idusuario  and impf.emp_ideregistro = :idempresa  and impf.ipfe_estado <> 'A' 
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
    
     public function consultarResumen($idUsuario, $idEmpresa) {
         
        $sql = "select  'I' tipo, 
                impf.ipfe_mensaje mensaje,
                 (SELECT COUNT(*) FROM temp_impfactura_enc  impfi WHERE impfi.ipfe_estado = 'I'  AND  impfi.usu_ideregistro = $idUsuario and impfi.emp_ideregistro = $idEmpresa) cantidad_facturas/*Facturas_procesadas*/,
                (SELECT trunc(sum(impfs.fac_sdoreal)) FROM temp_impfactura_enc impfs where impfs.ipfe_estado ='I' AND  impfs.usu_ideregistro = $idUsuario and impfs.emp_ideregistro = $idEmpresa) total_facturacion_cargada
                 from temp_impfactura_enc impf 
                where impf.ipfe_estado = 'I' AND  impf.usu_ideregistro = $idUsuario and impf.emp_ideregistro = $idEmpresa
                GROUP BY tipo,impf.ipfe_mensaje

                UNION ALL

                    select  'E' tipo, 
                    'Facturas con errores' mensaje,
                     (SELECT COUNT(*) FROM temp_impfactura_enc  impfi WHERE impfi.ipfe_estado = 'E' AND  impfi.usu_ideregistro = $idUsuario and impfi.emp_ideregistro = $idEmpresa) cantidad_facturas/*Facturas_procesadas*/,
                    (SELECT trunc(sum(impfs.fac_sdoreal)) FROM temp_impfactura_enc impfs where impfs.ipfe_estado ='E' AND  impfs.usu_ideregistro = $idUsuario and impfs.emp_ideregistro = $idEmpresa) total_facturacion_cargada
                     from temp_impfactura_enc impf 
                    where impf.ipfe_estado = 'E' AND  impf.usu_ideregistro = $idUsuario and impf.emp_ideregistro = $idEmpresa
                    GROUP BY tipo,mensaje   
                    
                UNION ALL

                    select  'U' tipo, 
                    impf.ipfe_mensaje mensaje,
                     (SELECT COUNT(*) FROM temp_impfactura_enc  impfi WHERE impfi.ipfe_estado = 'U' AND  impfi.usu_ideregistro = $idUsuario and impfi.emp_ideregistro = $idEmpresa) cantidad_facturas/*Facturas_procesadas*/,
                    (SELECT trunc(sum(impfs.fac_sdoreal)) FROM temp_impfactura_enc impfs where impfs.ipfe_estado ='U' AND  impfs.usu_ideregistro = $idUsuario and impfs.emp_ideregistro = $idEmpresa) total_facturacion_cargada
                     from temp_impfactura_enc impf 
                    where impf.ipfe_estado = 'U' AND  impf.usu_ideregistro = $idUsuario and impf.emp_ideregistro = $idEmpresa
                    GROUP BY tipo,impf.ipfe_mensaje";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }
    
    public function consultarResumenErrores($idUsuario, $idEmpresa) {
         
        $sql = "select  'E' tipo, 
                impf.ipfe_mensaje mensaje,
                   impf.dsus_pcodigo_gas idgas, impf.dsus_pcodigo_bio idbio
                 from temp_impfactura_enc impf 
                where impf.ipfe_estado = 'E' AND  impf.usu_ideregistro = $idUsuario and impf.emp_ideregistro = $idEmpresa order by mensaje";
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }
    
     public function cancelarFacturacionActionUser($idUsuario, $idEmpresa ) {       
         $sql = "UPDATE   	temp_impfactura_enc 
                SET		ipfe_estado = 'U', ipfe_mensaje = 'Operación cancelada por Usuario'
                where ipfe_estado = 'A'  AND  usu_ideregistro = $idUsuario and emp_ideregistro = $idEmpresa";
        return $this->executeQuery($sql); 
    }
    
    public function actualizaClienteDesHomologado($idUsuario, $idEmpresa, $idProceso ) {       
         $sql = "UPDATE dsus_detsuscrip SET sus_ideregistro =info.idsuscriptorgas
                from(
                    select  dsusbio.dsus_ideregistr idsuscripcionbio, dsusgas.sus_ideregistro idsuscriptorgas
                    from temp_impfactura_enc impf 
                    INNER JOIN dsus_detsuscrip  dsusbio on dsusbio.dsus_pcodigo = impf.dsus_pcodigo_bio
                    INNER JOIN dsus_detsuscrip  dsusgas on dsusgas.dsus_pcodigo = impf.dsus_pcodigo_gas
                    where  impf.ipfe_estado ='A' and impf.usu_ideregistro = $idUsuario and impf.emp_ideregistro = $idEmpresa
                    and impf.idproceso = $idProceso
                    and  dsusbio.sus_ideregistro <> dsusgas.sus_ideregistro                     
                ) as info
                where info.idsuscripcionbio = dsus_detsuscrip.dsus_ideregistr ";
        return $this->executeQuery($sql); 
    }
    
    public function actualizaClienteDesHomologadoTemporal($idUsuario, $idEmpresa, $idProceso ) {       
         $sql = "UPDATE dsus_detsuscrip SET sus_ideregistro =info.idsuscriptorgas
                from(
                    select  dsusbio.dsus_ideregistr idsuscripcionbio, dsusgas.sus_ideregistro idsuscriptorgas
                    from temp_impfactura_enc impf 
                    INNER JOIN dsus_detsuscrip  dsusbio on dsusbio.dsus_pcodigo = impf.dsus_pcodigo_bio
                    INNER JOIN dsus_detsuscrip  dsusgas on dsusgas.dsus_pcodigo = impf.dsus_pcodigo_gas
                    where  impf.ipfe_estado ='A' and impf.usu_ideregistro = $idUsuario and impf.emp_ideregistro = $idEmpresa
                    and impf.idproceso = $idProceso
                    and  dsusbio.sus_ideregistro <> dsusgas.sus_ideregistro 
                    and dsusbio.dsus_ideregistr   in ( select trds.dsus_ideregistr from trds_tradetsuscrip trds  where trds.dsus_ideregistr is not null )
                ) as info
                where info.idsuscripcionbio = dsus_detsuscrip.dsus_ideregistr ";
        return $this->executeQuery($sql); 
    }
    
    public function actualizaClienteDesHomologadoDefenitivo($idUsuario, $idEmpresa, $idProceso ) {       
         $sql = "UPDATE temp_impfactura_enc set ipfe_mensaje ='Factura no Procesada, Cliente desHomologado definitivo', ipfe_estado ='E'
                    from (
                        select  dsusbio.dsus_ideregistr idsuscripcionbio, dsusgas.sus_ideregistro idsuscriptorgas,
                        impf.ipfe_ideregistr idtemporal
                    from temp_impfactura_enc impf 
                    INNER JOIN dsus_detsuscrip  dsusbio on dsusbio.dsus_pcodigo = impf.dsus_pcodigo_bio
                    INNER JOIN dsus_detsuscrip  dsusgas on dsusgas.dsus_pcodigo = impf.dsus_pcodigo_gas
                    where  impf.ipfe_estado ='A' and impf.usu_ideregistro = $idUsuario and impf.emp_ideregistro = $idEmpresa
                    and impf.idproceso = $idProceso
                    and  dsusbio.sus_ideregistro <> dsusgas.sus_ideregistro 
                    and dsusbio.dsus_ideregistr not in ( select trds.dsus_ideregistr from trds_tradetsuscrip trds  where trds.dsus_ideregistr is not null  )
                    ) as info
                    WHERE info.idtemporal = temp_impfactura_enc.ipfe_ideregistr";
        return $this->executeQuery($sql); 
    }
    /**
     *  cuenta si el cliente hmologado tiene mas de dos suscripciones para cambiar 
     * @param type $idUsuario
     * @param type $idEmpresa
     * @return type
     */
      public function cuentaSuscriptores($idUsuario, $idEmpresa, $idProceso) {
        $parametros = array();
        $parametros['idusuario'] = $idUsuario;
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idproceso'] = $idProceso;
        $sql = "SELECT dsusv.dsus_ideregistr idsuscripciones, dsusv.ter_ideregistro idtercero
                from 	dsus_detsuscrip dsusv 
                WHERE 	dsusv.sus_ideregistro in (
                                        select 		dsus.sus_ideregistro 
					from 		temp_impfactura_enc impf
					INNER JOIN 	dsus_detsuscrip dsus on dsus.dsus_pcodigo = impf.dsus_pcodigo_gas
					WHERE 		impf.emp_ideregistro = :idempresa and impf.usu_ideregistro = :idusuario and impf.ipfe_estado = 'A'  AND impf.idproceso =:idproceso					
			)  
                AND 	dsusv.dsus_ideregistr NOT IN (
					select 		dsus.dsus_ideregistr 
					from            temp_impfactura_enc impf
					INNER JOIN 	dsus_detsuscrip dsus on dsus.dsus_pcodigo = impf.dsus_pcodigo_bio
					WHERE 		dsus.emp_ideregistro = :idempresa AND  impf.emp_ideregistro = :idempresa and impf.usu_ideregistro = :idusuario and impf.ipfe_estado = 'A'   
                                     AND           impf.idproceso =:idproceso	
				)		
                AND     dsusv.emp_ideregistro = :idempresa";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }
    
    public function crearSuscriptorNuevo($parametros) {
        $Datos = array();
        $Datos['ter_ideregistro'] = $parametros['tercero'];
        $Datos['cnre_ideregistr'] = $parametros['idconvenio'];
        $Datos['sus_modconvenio'] = $parametros['sus_modconvenio'];
        $Datos['sus_descripcion'] = $parametros['sus_descripcion'];
        $Datos['usu_ideregistro'] = $parametros['idusuario'];
        try {
            $suscriptor = $this->insertar($Datos, 'sus_suscripcion', 'sq_sus_ideregistro');
            return $suscriptor;
        } catch (\Exception $ex) {
            throw new MyException("Error creando suscriptor " . $ex->getMessage(), -1);
        }
    }
    
     public function actualizarSuscripcion($parametros, $suscriptor) {
        $Datos = array();
        $Datos['sus_ideregistro'] = $suscriptor;
        $condicion = 'dsus_ideregistr =' . $parametros['idsuscripciones'];
        return $this->actualizar($Datos, 'dsus_detsuscrip', $condicion);
    }
    
    public function insertarClienteDeshomologadoTemporal($parametros) {
        $Datos = array();
        $Datos['dsus_ideregistr'] = $parametros['idsuscripcion'];
        $Datos['sus_ideregistro'] = $parametros['idsuscriptor'];
        $Datos['usu_ideregistro'] = $parametros['idusuario'];
        try {
            $temporal = $this->insertar($Datos, 'trds_tradetsuscrip', 'sq_trds_ideregistr');
            return $temporal;
        } catch (\Exception $ex) {
            throw new MyException("Error creando Cliente deshomologado Temporal  " . $ex->getMessage(), -1);
        }
    }
    
    public function buscaConvenioActual($idSuscriptor) {
        $parametros["idsuscriptor"] = $idSuscriptor;
        $sql = "SELECT
                        sus.cnre_ideregistr idconvenio
                FROM
                        sus_suscripcion sus
                WHERE   sus_ideregistro = :idsuscriptor";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0];
    }
    
    public function validaFacturasProcesadasPeriodosAnteriores($idEmpresa, $idUsuario, $idProceso){
        $parametros = array();
        $parametros['idusuario'] = $idUsuario;
        $parametros['idproceso'] = $idProceso;
        $parametros['idempresa'] = $idEmpresa;
        $sql="UPDATE temp_impfactura_enc impfac set ipfe_estado = 'E', ipfe_mensaje = 'Factura cargada en periodos anteriores'
                FROM
                        temp_impfactura_enc impf
                        INNER JOIN dsus_detsuscrip dsusbio ON dsusbio.dsus_pcodigo = impf.dsus_pcodigo_bio
                        INNER JOIN fac_factura fac ON fac.fac_numero = impf.fac_numero 
                        AND fac.dsus_ideregistr = dsusbio.dsus_ideregistr and fac.emp_ideregistro = impf.emp_ideregistro
                        INNER JOIN per_periodo perant ON perant.per_ideregistro = fac.per_ideregistro and perant.per_estado = 'C' 
                WHERE
                impfac.ipfe_ideregistr = impf.ipfe_ideregistr
                AND
                        impf.ipfe_estado =  'A' 
                        AND impf.usu_ideregistro = $idUsuario 
                        AND impf.emp_ideregistro = $idEmpresa 
                        AND impf.idproceso =  $idProceso";
        $this->executeQuery($sql); 
    }
       
    public function getConvenioHomologar($idConvenioActual, $idEmpresaSesion) {
        $parametros["idconvenioactual"] = $idConvenioActual;
        $parametros["idempresa"] = $idEmpresaSesion;
        $sql = "select  * from  fn_getconveniosuscriptor( :idconvenioactual,  :idempresa)";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['idconveniohomologar'];
    }
    
}
