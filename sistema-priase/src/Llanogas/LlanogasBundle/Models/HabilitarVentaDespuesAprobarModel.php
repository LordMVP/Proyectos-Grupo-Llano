<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;



/**
 * habilita una venta
 *
 * @author oabaquero
 */
class HabilitarVentaDespuesAprobarModel extends AuditoriaServices {

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
    public function buscaVentasAprobadasModel($idempresa) {
        
        $data['ven_estado'] = 'A';
        $data['emp_ideregistro'] = $idempresa;
        $sql ='Select ven_ideregistro idventa from ven_venta where emp_ideregistro = :emp_ideregistro and ven_estado =:ven_estado order by ven_ideregistro ASC';
        return $this->executeQuery($sql,$data);
    }
    
    public function buscaComentariosModel($empresa,$idVenta){
        $parametros['idEmpresa'] = $empresa;
        $parametros['idVenta'] = $idVenta;
        $sql = "SELECT to_char(hven.hven_fecha::date, 'DD/MM/YYYY') ||' --> '||hven_comentario comentario FROM hven_hisventa  hven WHERE emp_ideregistro =:idEmpresa  and ven_ideregistro =:idVenta ORDER BY hven.hven_fecha asc";
        return $this->executeQuery($sql,$parametros);
    }
    
    public function buscaVentaModel($empresa,$idVenta){
        $parametros['idEmpresa'] = $empresa;
        $parametros['idVenta'] = $idVenta;
        try{
            $sql = "SELECT      ven_ideregistro, ven_numero,
                                ven_fecha, ven_estado , ven_tipo, ven_metpago,
                                ven_observacion ,ven_fecaprobada ,ven_feceliminada,fac_ideregistro ,
                                emp_ideregistro ,uni_documento ,uni_tipdocument ,cofi_ideregistr ,
                                fin_ideregistro ,ven_fecfacturada,dsus_ideregistr ,ter_ideregistro , 
                                agenda_ideregistro,usu_ideregistro,cic_ideregistro, per_ideregistro, 
                                cic_ano  ,ven_vlrreal ,ter_ideorginspeccion,ven_cuoinicial ,fin_numero  
                    FROM ven_venta WHERE ven_ideregistro = :idVenta and emp_ideregistro =:idEmpresa and ven_estado='A' ";
            $respuesta = $this->executeQuery($sql, $parametros);
           
        } catch (\Exception $ex) {
            throw new MyException('No se Encontraron ventas aprobadas',-1);
        }
        return $respuesta;
    }
    
    public function insertaHistoricoVentas($registroVenta,$observacion, $idusuario){
       try{
       $parametros['hven_comentario'] = $observacion;
       $parametros['hven_fecha'] = 'now()';
       $parametros['usu_ideregistro'] = $idusuario;
       $parametros['ven_ideregistro'] = $registroVenta[0]['ven_ideregistro'];
       $parametros['ven_numero'] = $registroVenta[0]['ven_numero'];
       $parametros['ven_fecha'] = $registroVenta[0]['ven_fecha'];
       $parametros['ven_estado'] = $registroVenta[0]['ven_estado'];
       $parametros['ven_tipo'] = $registroVenta[0]['ven_tipo'];
       $parametros['ven_metpago'] = $registroVenta[0]['ven_metpago'];
       $parametros['ven_observacion'] = $registroVenta[0]['ven_observacion'];
       $parametros['ven_fecaprobada'] = $registroVenta[0]['ven_fecaprobada'];
       $parametros['ven_feceliminada'] = $registroVenta[0]['ven_feceliminada'];
       $parametros['fac_ideregistro'] = $registroVenta[0]['fac_ideregistro'];
       $parametros['emp_ideregistro'] = $registroVenta[0]['emp_ideregistro'];
       $parametros['uni_documento'] = $registroVenta[0]['uni_documento'];
       $parametros['uni_tipdocument'] = $registroVenta[0]['uni_tipdocument'];
       $parametros['cofi_ideregistr'] = $registroVenta[0]['cofi_ideregistr'];
       $parametros['fin_ideregistro'] = $registroVenta[0]['fin_ideregistro'];
       $parametros['ven_fecfacturada'] = $registroVenta[0]['ven_fecfacturada'];
       $parametros['dsus_ideregistr'] = $registroVenta[0]['dsus_ideregistr'];
       $parametros['ter_ideregistro'] = $registroVenta[0]['ter_ideregistro'];
       $parametros['agenda_ideregistro'] = $registroVenta[0]['agenda_ideregistro'];
       $parametros['cic_ideregistro'] = $registroVenta[0]['cic_ideregistro'];
       $parametros['per_ideregistro'] = $registroVenta[0]['per_ideregistro'];
       $parametros['cic_ano'] = $registroVenta[0]['cic_ano'];
       $parametros['ven_vlrreal'] = $registroVenta[0]['ven_vlrreal'];
       $parametros['ter_ideorginspeccion'] = $registroVenta[0]['ter_ideorginspeccion'];
       $parametros['ven_cuoinicial'] = $registroVenta[0]['ven_cuoinicial'];
       $parametros['fin_numero'] = $registroVenta[0]['fin_numero'];
       
       
       $resultado = $this->insertar($parametros, 'hven_hisventa', 'sq_hven_ideregistr');
       } catch (\Exception $e){
           throw new MyException('Error, No se insertaron los Historicos de Ventas '.$idVenta, $e);
       }
       return $resultado;
    }

    public function buscarDetalleVenta($idVenta){
        $parametros['idVenta'] = $idVenta;
        try{
            $sql = "SELECT  dven_ideregistr, ven_ideregistro, uni_concepto, dven_cantidad,
                            dven_vlrunitario, dven_vlrtotal, dven_vlrreal, usu_ideregistro,
                            dven_editable, uni_liquidacion
                    FROM dven_detventa dven WHERE ven_ideregistro = :idVenta";
            $resultado = $this->executeQuery($sql, $parametros);
            
        }catch(\Exception $e){
            throw new MyException("Error, No se encontraron detalles de ventas ".$idVenta, $e);
        }
            return $resultado;
    }
    
    public function insertarDettallesHistorico($detalles){
        return $this->insertar($detalles, 'hdven_hisdetventa', 'sq_hdven_ideregistr');
    }
    
    public function buscaVentasLiquidaciones($idVenta){
        $parametros['idVenta'] = $idVenta;
        try{
        $sql="SELECT veli_ideregistr, ven_ideregistro, uni_liquidacion, usu_ideregistro
                FROM veli_venliquidac WHERE ven_ideregistro =:idVenta";
        $resultado = $this->executeQuery($sql, $parametros);
        } catch (\Exception $e){
            throw new MyException ('No se encontraron liquidaciones de la venta '.$idVenta, $e);
        }
        return $resultado;
    }
    
    public function insertarVentaLiquidaciones($liquidaciones){
        return $this->insertar($liquidaciones, 'hveli_hisvenliquidac', 'sq_hveli_ideregistr');
    }
    
    public function buscaVentaFinanciaciones($idVenta){
        $parametros['idVenta'] = $idVenta;
        try {
            $sql = "select  vfi_ideregistro,ven_ideregistro,vfi_inicapital,vfi_estado,vfi_sdocapital,vfi_fecha,ter_idesolicita,ter_ideentfinan,
                            emp_ideregistro,vfi_version,usu_ideregistro,vfi_numcuotas,ter_idecodeudor,uni_parentesco,uni_liquidacion,uni_documento,
                            uni_tipdocument,fin_ideregistro
                    FROM vfi_venfinanciacio  where ven_ideregistro = :idVenta";
            $resultado = $this->executeQuery($sql, $parametros);
        } catch (\Exception $ex) {
            throw new MyException('No se encontraron ventas financiadas', 1);
        }
        return $resultado;
    }
    
    public function insertarVentaFinanciada($ventaFinanciada){
        try{
        $resultado = $this->insertar($ventaFinanciada, 'hvfi_hisvenfinanciacio', 'sq_hvfi_ideregistr');
        } catch (\Exception $e){
            throw new MyException('Error, No se pudo insertar los Historicos de ventas de Financiaciones',-1);
        }
    }
    
    
      public function buscaDetalleVentaFinanciaciones($idVenta){
        $parametros['idVenta'] = $idVenta;
        try {
            $sql = "select  dvfi_ideregistr,ven_ideregistro,dven_ideregistr,uni_concepto,
                            dvfi_vlrreal,dvfi_sdoreal,emp_ideregistro,usu_ideregistro,
                            dvfi_version,vfi_ideregistro
                    FROM dvfi_detvenfinancia  where ven_ideregistro = :idVenta";
            $resultado = $this->executeQuery($sql, $parametros);
        } catch (\Exception $ex) {
            throw new MyException('No se encontraron ventas financiadas', $e);
        }
        return $resultado;
    }
    
    public function insertarDetalleVentaFinanciada($ventaFinanciada){
        return $this->insertar($ventaFinanciada, 'hdvfi_hisdetvenfinancia', 'sq_hdvfi_ideregistr');
    }
    
      public function buscaInformacionFinanciaciones($idVenta){
        $parametros['idVenta'] = $idVenta;
        try {
            $sql = "select  *
                    FROM veif_veninfinancie  where ven_ideregistro = :idVenta";
            $resultado = $this->executeQuery($sql, $parametros);
        } catch (\Exception $ex) {
            throw new MyException('No se encontraron ventas financiadas', $e);
        }
        return $resultado;
    }
    
    public function insertarInformacionFinanciada($ventaFinanciada){
        return $this->insertar($ventaFinanciada, 'hveif_hisveninfinancie', 'sq_hveif_ideregistr');
    }
    
    public function actualizarVentas($idVenta){
        $parametros['ven_ideregistro'] = $idVenta;
        $parametros['ven_estado'] ='P';
        try{
        $resultado = $this->actualizar($parametros, 'ven_venta', 'ven_ideregistro = :ven_ideregistro');
        }catch(\Exception $e){
            throw new MyException('Error, No se puedo actualizar la Venta, Para editar',-1);
        }
    }
    
    public function informacionClienteVenta($idVenta){
        $parametros['ven_ideregistro'] = $idVenta;
        try{
            $sql = "select dsus.dsus_pcodigo pcodigo , dsus.dsus_ideregistr idsuscripcion, dsus.sus_ideregistro suscriptor,
                    ter.ter_documento documento, ter.ter_nomcompleto nombre_completo, uni.uni_nombre1 tipouso

                      from ven_venta  ven 
                    INNER JOIN dsus_detsuscrip  dsus on dsus.dsus_ideregistr = ven.dsus_ideregistr
                    INNER JOIN uni_unidad  uni ON uni.uni_ideregistro = dsus.uni_tipusosuscr
                    INNER JOIN ter_tercero ter on ter.ter_ideregistro = dsus.ter_ideregistro
                    where ven.ven_ideregistro =:ven_ideregistro ";
            $resultado = $this->executeQuery($sql, $parametros);
        } catch (\Exception $e){
            throw new Exception("No se encontro información de la suscripción", -1);
        }
        return $resultado;
    }
    
}
