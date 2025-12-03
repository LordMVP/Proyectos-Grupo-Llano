<?php

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * Description of CarteraCastigadaModel
 *
 * @author sergio vargas
 */
class CondonarCarteraCastigadaModel extends AuditoriaServices {

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     * Constructor de la clase
     * @param Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($conexion);
    }

    /**
     * actualización del saldo de la factura de la provision en curso
     * @param int $idfactura identificador del detalle de la factura para ser actualizada su saldo
     * @param float $valor valor ponderado para el PR
     */
    public function actualizarSaldoFacturaProvision($idfactura, $valor) {
        $sql = "update fac_factura 
                    set fac_sdoreal =  :valor 
                    where fac_ideregistro = :idfactura";
        $parametros['idfactura'] = $idfactura;
        $parametros['valor'] = $valor;
        $this->executeQuery($sql, $parametros);
    }

    /**
     * Permitre listar las facturas castigadas  EJ. Suscripcion en estado eliminada y facturas con castigadas con saldo
     * @param int $idsuscripcion identificador de la suscripción a la cuál se deberá condonar 
     */
    public function obtenerFacturasCastigadasModel($idsuscripcion) {
        $sql = "SELECT DISTINCT
                                dsus.dsus_ideregistr idsuscripcion,
                                fac.fac_ideregistro idfactura,
                                fac.fac_fecvence fechavencimiento,
                                fac.fac_numero numerofactura,
                                cic.cic_nombre ciclo,
                                per.per_nombre periodo,
                                fac.cic_ano ano,
                                fac.fac_vlrreal valorreal,
                                fac.fac_sdoreal saldo,
                                CASE
                        WHEN fac.fac_sdoreal > fac.fac_vlrreal THEN
                                fac.fac_vlrreal
                        ELSE
                                fac.fac_vlrreal - fac.fac_sdoreal
                        END valorpagado
                        FROM
                                dsus_detsuscrip dsus
                        INNER JOIN fac_factura fac ON fac.dsus_ideregistr = dsus.dsus_ideregistr
                        INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = fac.cic_ideregistro
                        INNER JOIN per_periodo per ON per.per_ideregistro = fac.per_ideregistro
                        inner join dfac_detfactura dfac ON dfac.fac_ideregistro = fac.fac_ideregistro
                        INNER JOIN con_concepto con ON con.uni_concepto = dfac.uni_concepto 
                        WHERE
                                dsus.dsus_estado = 'E'
                        AND fac.fac_sdoreal > 0
                        AND con.con_condonable = 'S'
                        AND dfac.dfac_sdoreal > 0
	           AND fac.uni_documento=30	
                        AND fac.fac_estado = 'C'
                    AND dsus.dsus_ideregistr = :idsuscripcion";
        $parametros['idsuscripcion'] = $idsuscripcion;
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            throw new MyException('No existen conceptos condonables para las facturas ', 0);
        }
        return $respuesta;
    }

    /**
     * permite obtener los conceptos de la factura, si son condonables o no condonables
     * @param int $idfactura identificador de la factura 
     * @param char $esCondonable N para no condonar y S para condonar
     * @return array listado de conceptos condonables o no condonables de la factura
     */
    public function ObtenerConceptosFactura($idfactura, $esCondonable = 'N') {
        $parametros['idfactura'] = $idfactura;
        $parametros['escondonable'] = $esCondonable;

        $sql = "SELECT
                            dfac.uni_concepto idconcepto,
                            con.con_nombre nombre,
                            dfac.dfac_vlrtotal valortotal,
                            drec.drec_fecha ultimopago,
                            dfac.dfac_sdoreal saldo,
                            dfac.dfac_ideregistr iddetallefactura
                    FROM
                            dfac_detfactura dfac
                    INNER JOIN con_concepto con ON con.uni_concepto = dfac.uni_concepto
                    LEFT JOIN drec_detrecaudo drec ON drec.dfac_ideregistr = dfac.dfac_ideregistr
                    WHERE
                            con.con_condonable = :escondonable
                     AND dfac.dfac_sdoreal > 0      
                    AND dfac.fac_ideregistro =:idfactura";
        return $this->executeQuery($sql, $parametros);
    }

    // <editor-fold desc="Procesos Genéricos ">  

    /**
     * permite obtener la información de una factura especifica, con sus campos originales
     * @param int $idfactura identificador de la factura
     * @return array un solo registron con la información de la factura consultada 
     */
    public function obtenerFacturaModel($idfactura) {
        $sql = "select * from fac_factura where fac_ideregistro = $idfactura";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException("La factura $idfactura no se encontró. ", -1);
        }
        return $respuesta[0];
    }

    /**
     * carga la información de del detalle de la factura basado en la factura
     * @param int $idfactura identificador de la factura
     * @return array listado de los detalles de factura existentes
     */
    public function obtenerDetalleFacturaModel($iddetallefactura) {
        $sql = "select * from dfac_detfactura where dfac_ideregistr =  $iddetallefactura";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException("No se encontraron detalles de la factura: $idfactura. ", -1);
        }
        return $respuesta[0];
    }

    //</editor-fold>
    // <editor-fold desc="notas de factura">
    /**
     * Crear una nota para condonación
     * @param type $notas
     */
    public function crearNotaCondonacionModel($notas) {
        $notas['est_motnota'] = ESTRUCTURA_NOTA;
        $notas['uni_motnota'] = UNIDAD_CONDONACION;
        $notas['not_fecha'] = 'now()';
        $notas['not_comentario'] = 'condonación de factura';
        return $this->insertar($notas, 'not_nota', 'sq_not_ideregistro');
    }

    /**
     * permite construir una nota cancelando la factura actual 
     * @param fac_factura $factura objeto de tipo fac_factura para creación de nota
     */
    public function crearNotaFacturaModel($factura) {
        unset($factura['fac_ideregistro']);
        unset($factura['fac_numero']);
        unset($factura['fin_ideregistro']);
        unset($factura['mvi_ideregistro']);
        $factura['fac_version'] = 1;

        return $this->insertar($factura, 'fac_factura', 'sq_fac_ideregistro');
    }

    /**
     * permite construir una nota cancelando el detalle de factura actual 
     * @param dfac_detfactura $detalleFactura objeto de tipo dfac_detfactura para creación de nota
     */
    public function crearNotaDetalleFacturaModel($detalleFactura) {
        unset($detalleFactura['dfac_ideregistr']);
        unset($detalleFactura['dfin_ideregistr']);
        $detalleFactura['damo_ideregistr'] = 0;
        $detalleFactura['dfac_estado'] = 'A';
        $detalleFactura['dfac_cantidad'] = 1;

        $this->insertar($detalleFactura, 'dfac_detfactura', 'sq_dfac_ideregistr');
    }

    /**
     * permite afectar nofa para enlazar las facturas con las notas
     * @param type $infofractura
     */
    public function crearNotaModel($infofractura) {
        $parametros['not_ideregistro'] = $infofractura['idnota'];
        $parametros['fac_ideregistro'] = $infofractura['idfacturanota'];
        $parametros['dfac_ideregistr'] = $infofractura['iddetallefacturanota'];
        $parametros['fac_ideorigen'] = $infofractura['idfacturaoriginal'];
        $parametros['dfac_ideorigen'] = $infofractura['iddetallefacturaoriginal'];
        $parametros['usu_ideregistro'] = $infofractura['idusuario'];
        $this->insertar($parametros, 'nofa_notfactura', 'sq_nofa_ideregistr');
    }

    //</editor-fold>
    // <editor-fold desc="Provisiones">
    public function obtenerFacturaProvisionModel($idfactura) {
        $sql = "select * from  fac_factura fac 
                    where fac_estado = 'P' and fac_ideorigen =$idfactura";
        return $this->executeQuery($sql);
    }

    /**
     * Crear una nueva provisión a la factura, omitiendo algunos campos en el proceso
     * @param array $factura factura de provisión a insertar
     */
    public function crearRecuperacionProvisionModel($factura) {
        $factura['fac_estado'] = 'A';
        $factura['fac_fecha'] = 'now()';
        $factura['fac_sdoreal'] = 0;
        $factura['fac_version'] = 1;
        $factura['fac_vlrreal'] = 0;
        $factura['fac_metgenera'] = 'A';
        $factura['mvi_ideregistro'] = null;
        return $this->insertar($factura, 'fac_factura', 'sq_fac_ideregistro');
    }

    /**
     * permite obtener el valor real de la provision con el fin de realizar el calculo
     * @param type $idfactura
     * @return type
     */
    public function obtenerValorProvisionModel($idfactura) {
        $sql = "SELECT
                            fac_vlrreal valorreal
                    FROM
                            fac_factura
                    WHERE
                            fac_ideregistro = :idfactura";
        $parametros['idfactura'] = $idfactura;
        $respuesta = $this->executeQuery($sql, $parametros);
        return $respuesta[0];
    }

    /**
     * permite obtener el valor real de la provisión por concepto (dfac), obteniendo su identificador de registro
     * @param int $idfactura identificador de la factura
     * @return array un registro con la información del detalle de la factura provision 
     */
    public function obtenerValorTotalProvisionConceptoModel($idfactura) {
        $sql = "SELECT
                            dfac.dfac_vlrreal valortotal,
                            dfac.dfac_ideregistr iddetallefacturaprovision
                    FROM
                            dfac_detfactura dfac
                    WHERE
                            dfac.dfac_ideorigen = :idfactura";
        $parametros['idfactura'] = $idfactura;
        $respuesta = $this->executeQuery($sql, $parametros);
        return $respuesta[0];
    }

    /**
     * actualización del saldo del detalle de la factura que se realizo la provision
     * @param int $iddetallefactura identificador del detalle de la factura para ser actualizada su saldo
     * @param float $valor valor ponderado para el PR
     */
    public function actualizarSaldoConceptoProvisionModel($iddetallefactura, $valor) {
        $sql = "UPDATE      dfac_detfactura 
                                       set dfac_sdoreal = dfac_sdoreal -  :valor 
                    WHERE
                                        dfac_ideregistr =   :iddetallefactura; ";
        $parametros['iddetallefactura'] = $iddetallefactura;
        $parametros['valor'] = $valor;
        $this->executeQuery($sql, $parametros);
    }

    /**
     * Crear un detalle recaudo de provisión a la factura, de tipo nota (saldos negativos)
     * @param array $detallefactura información del detalle a asociar
     */
    public function crearDetalleRecaudoProvisionModel($detallefactura) {
        $detallefactura['dfac_estado'] = 'A';
        $detallefactura['dfac_cantidad'] = 0;
        $detallefactura['dfac_vlrunitari'] = abs($detallefactura['dfac_sdoreal']) * -1;
        $detallefactura['dfac_vlrtotal'] = abs($detallefactura['dfac_sdoreal']);
        $detallefactura['dfac_vlrreal'] = abs($detallefactura['dfac_sdoreal']) * -1;
        return $this->insertar($detallefactura, 'dfac_detfactura', 'sq_dfac_ideregistr');
    }

   /**
     * Obtiene permisos para activar botones de seleccionar facturas de cartera corriente
     * @param array con  $idprograma id del programa, $idestructura ide de la estructura, idusuario e idempresa
     * @return array informacion de las unidades autorizadas al usuario 
     */		
    public function consultarPermisosBotonesFacturas($data) {
        $parametros['ideprograma'] = $data['ideprograma'];
        $parametros['idempresa'] = $data['idempresa'];
        $parametros['idusuario'] = $data['idusuario'];
        $parametros['idestructura'] = $data['idestructura'];
   
        $sql = "select uni.uni_ideregistro idunidad
               from prun_prgunidad  prun 
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = prun.uni_ideregistro and uni.est_ideregistro = :idestructura
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro = uni.est_ideregistro and esem.emp_ideregistro = :idempresa
               INNER JOIN uspu_usuprgunid  uspu on uspu.prun_ideregistr = prun.prun_ideregistr
               where uspu.usu_ideregistro = :idusuario   and prun.prg_ideregistro = :ideprograma";
        $resultado = $this->executeQuery($sql, $parametros);

        return $resultado;
    }

     /**
     * Consulta las facturas con una fecha de vencimiento de al menos 3 meses 
     * @param type $idSuscripcion id de la suscripcion
     * @return type
     */
    public function consultarFacturasCarteraIntCorriente($idSuscripcion) {
        $parametros["dsus_ideregistr"] = $idSuscripcion;
        $sql = "SELECT   DISTINCT fac.fac_fecha,
                    fac.fac_ideregistro idfactura,
                    fac.fac_fecvence fechavencimiento,
                    fac.fac_numero numerofactura,
                    cic.cic_nombre ciclo,
                    per.per_nombre periodo,
                    fac.cic_ano ano,
                    fac.fac_vlrreal valorreal,
                    fac.fac_sdoreal saldo,
                    fac.fac_vlrreal - fac.fac_sdoreal valorpagado
                FROM
                    fac_factura fac
                INNER JOIN dsus_detsuscrip dsus ON fac.dsus_ideregistr = dsus.dsus_ideregistr
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = fac.cic_ideregistro
                INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro = fac.fac_ideregistro
	   INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                INNER JOIN per_periodo per ON per.per_ideregistro = fac.per_ideregistro
                WHERE
                    fac.fac_sdoreal > 0 
                AND fac.uni_documento=85
                AND fac.fac_fecha <= (now() - INTERVAL '1 months')
                AND fac.fac_estado IN ('C')  AND fac.fac_idepadre is null
                AND con.con_condonable = 'S' and dfac.dfac_sdoreal > 0
                AND dsus.dsus_ideregistr = :dsus_ideregistr order by fac.fac_fecha,fac.fac_ideregistro ,
                    fac.fac_fecvence ,
                    fac.fac_numero ,
                    cic.cic_nombre ,
                    per.per_nombre ,
                    fac.cic_ano   asc";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }
  
    /**
     * Consulta los conceptos condonables de una factura
     * @param int $idFactura id de la factura
     * @return array informacion de los conceptos condonables de la factura
     */
    public function consultarConceptosCondonables($idFactura) {
        $parametros["fac_ideregistro"] = $idFactura;
        $complemento = "WHERE con.con_condonable = 'S' and dfac.dfac_sdoreal > 0 and fac.fac_ideregistro = :fac_ideregistro";
        return $this->genericoModel->getConceptosInformacion($complemento, $parametros);
    }

    /**
     * Consulta los conceptos no condonables de una factura
     * @param int $idFactura id de la factura
     * @return array informacion de los conceptos no condonables de la factura
     */
    public function consultarConceptosNoCondonables($idFactura) {
        $parametros["fac_ideregistro"] = $idFactura;
        $complemento = "WHERE con.con_condonable = 'N' and dfac.dfac_sdoreal > 0 and fac.fac_ideregistro = :fac_ideregistro";
        return $this->genericoModel->getConceptosInformacion($complemento, $parametros);
    }  

    //</editor-fold>
}
