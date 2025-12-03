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
class CarteraCastigadaModel extends AuditoriaServices {

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

// <editor-fold desc="castigar facturas">  

    /**
     * permite obtener la información de la suscripcion 
     * @param int $idsuscripcion identificador de suscripción activa
     */
    public function cancelarReconexionesExistentesModel($idreconexion, $idusuario) {
        $sql = "update rco_reconexion set 
                    rco_estado = 'C', 
                    usu_ideregistro = $idusuario
                    where rco_ideregistro = $idreconexion ";
        $this->executeQuery($sql);
    }

    /**
     * permite obtener la información de la suscripcion 
     * @param int $idsuscripcion identificador de suscripción activa
     */
    public function obtenerSuscripcionModel($idsuscripcion) {
        $sql = "select * from dsus_detsuscrip where dsus_ideregistr = $idsuscripcion";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException("Suscripción no encontrada $idsuscripcion", -1);
        }
        return $respuesta[0];
    }

    /**
     * permite obtener las facturas que son de 25 meses o más en su edad, esta tabla contiene la información ya calculada
     */
    public function obtenerFacturasProvisionarUltimaEtapaModel() {
        $sql = "select  * from tmp_facturas_castigar";
        return $this->executeQuery($sql);
    }

    /**
     * Permite obtener las facturas aprovisionadas 
     * @param $tipo establece el tipo de filtro que deben tener las facturas a procesar.
     * @example  [ T =  { procesa todo  }, A = { solo trae las facturas con provisión}, NA = { obtiene las facturas no provisionadas} ]
     *    @return lista las facturas que ya son para castigar
     */
    public function obtenerFacturasModel($tipo = 'T') {
        $complemento = '';
        if ($tipo === 'A') {
            $complemento = " where ddot.ddot_tipo = 'PR' AND tmp.idOrigen is not null";
        }
        if ($tipo === 'NA') {
            $complemento = "where ddot.ddot_tipo != 'PR' ";
        }
        $sql = "SELECT DISTINCT
                            idsuscripcion,
                            idfactura,
                            saldo,
                            fecha,
                            documento,
                            ciclo,
                            idOrigen
                    FROM
                            tmp_facturas_castigar tmp
                    INNER JOIN ddot_detdoctipo ddot ON ddot.uni_documento = tmp.documento
                     " . $complemento;
        return $this->executeQuery($sql);
    }

    /**
     * permite cargar las facturas a procesar que se encuentran ya en etapa de castigo
     * @param int $idempresa identificador de la empresa
     * @param int $idciclo ciclo a evaluar la antiguedad de las facturas
     * @return int cantidad de filas afectadas
     */
    public function cargarFacturasParaCastigarModel($idempresa) {
        $parametros['idempresa'] = $idempresa;
        $sql = 'DROP TABLE IF EXISTS tmp_facturas_castigar;';
        $this->executeQuery($sql);
        $sql = "CREATE  TABLE tmp_facturas_castigar  AS SELECT
                            fac.dsus_ideregistr idsuscripcion,
                            fac.fac_ideregistro idfactura,
                            fac.fac_sdoreal saldo,
                            fac.fac_fecha fecha,
                            fac.uni_documento documento,
                            fac.cic_ideregistro ciclo,
                            fac.fac_ideorigen idOrigen
                    FROM
                            fac_factura fac
                    WHERE
                            fac.emp_ideregistro = :idempresa                   
                    AND fac.fac_sdoreal > 0
                    AND fac.fac_estado not in ('C','E')
                    AND age(
                            CURRENT_TIMESTAMP,
                            fac.fac_fecha :: TIMESTAMP
                    ) = '25 month' :: INTERVAL;";
        return $this->executeQuery($sql, $parametros);
    }

    //</editor-fold>
// <editor-fold desc="Proceso nota de factura">  

    /**
     * carga la información de del detalle de la factura basado en la factura
     * @param int $idfactura identificador de la factura
     * @return array listado de los detalles de factura existentes
     */
    public function obtenerDetalleFacturaModel($idfactura) {
        $sql = "select * from dfac_detfactura where fac_ideregistro =  $idfactura";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException("No se encontraron detalles para la factura $idfactura ", -1);
        }
        return $respuesta;
    }

    /**
     * carga la información de la factura padre
     * @param int $idfactura identificador de la factura
     * @return type
     */
    public function obtenerFacturaModel($idfactura) {
        $sql = "select * from fac_factura where fac_ideregistro = $idfactura";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException("Factura $idfactura no existente", -1);
        }
        return $respuesta[0];
    }

    /**
     * carga la información de la financiacion padre
     * @param int $idfactura identificador de la factura
     * @return type
     */
    public function obtenerFinanciacionModel($idfinanciacion) {
        $sql = "select * from fin_financiacio where fin_ideregistro = $idfinanciacion";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException("Financiación $idfinanciacion no existente", -1);
        }
        return $respuesta[0];
    }

    /**
     * permite camvbiar el estado de la factura a castigada
     * @param int $idfactura identificador de la factura
     * @return int filas afectadas
     */
    public function castigarFacturaModel($idfactura, $idusuario) {
        $sql = "update fac_factura 
            set fac_estado = 'C' , fac_feccastigad = 'now()', usu_ideregistro= $idusuario where fac_ideregistro = $idfactura";
        return $this->executeQuery($sql);
    }

    /**
     * permite construir una nota cancelando la factura actual 
     * @param fac_factura $factura objeto de tipo fac_factura para creación de nota
     */
    public function generarNotaFactura($factura) {
        $factura['fac_version'] = 1;
        return $this->insertar($factura, 'fac_factura', 'sq_fac_ideregistro');
    }

    /**
     * permite construir una reclasificacion que se genera a pariti de una provisión 
     * @param fac_factura $factura objeto de tipo fac_factura para creación de nota
     */
    public function crearReclasificacionFacturaModel($factura) {
        $factura['fac_version'] = 1;
        $factura['fac_fecha'] = 'now()';
        $factura['fac_estado'] = 'P';
        unset($factura['fac_ideregistro']);
        unset($factura['fac_numero']);
        return $this->insertar($factura, 'fac_factura', 'sq_fac_ideregistro');
    }

    /**
     * permite construir una nota cancelando el detalle de factura actual 
     * @param dfac_detfactura $detalleFactura objeto de tipo dfac_detfactura para creación de nota
     */
    public function generarNotaDetalleFactura($detalleFactura) {
        $this->insertar($detalleFactura, 'dfac_detfactura', 'sq_dfac_ideregistr');
    }

    //</editor-fold>
// <editor-fold desc="proceso de suspensión">

    /**
     * realiza la suspención de una suscripción
     * @param int $idsuscripcion identificador de suscripción
     * @param int $idusuario identificador del usuario que realizao la suspención o genero el proceso
     */
    public function suspenderSuscripcion($idsuscripcion, $idusuario) {
        $sql = " update dsus_detsuscrip 
                    set dsus_estado = 'E' , 
                    usu_ideregistro = $idusuario
                    where dsus_ideregistr =  $idsuscripcion";
        $this->executeQuery($sql);
    }

    //</editor-fold>
    // <editor-fold desc="generar los recaudos de provision">  
    /**
     * @deprecated since version  1.0.0 se debe utilizar el método obtenerRecaudosParaAprovisionarModel en CarteraCastigadaGenericoModel     * 
     * permite obtener los recaudos que han sido pagados despues de una provisión de las facturas que llevan más de 13 meses de mora 
     * @return array listado de  recaudos que deberán ser actualizados sus saldos en la provisión
     */
    public function obtenerRecaudosParaAprovisionar() {
        $sql = "SELECT DISTINCT
                            rec.rec_ideregistro idrecaudo,
                            fac.fac_ideorigen idfacturaoriginal,
                            fac.fac_ideregistro idfacturaprovision,
                            fac.dsus_ideregistr idsuscripcion
                    FROM
                            fac_factura fac
                    INNER JOIN drec_detrecaudo drec ON fac.fac_ideorigen = drec.fac_ideregistro
                    INNER JOIN rec_recaudo rec ON rec.rec_ideregistro = drec.rec_ideregistro
                    WHERE
                            fac.fac_estado = 'P' 
                    AND drec.drec_fecha BETWEEN (now() - INTERVAL '1 month') AND now()
                    AND fac.fac_sdoreal > 0
                    AND fac.fac_ideorigen IS NOT NULL
                    AND rec.rec_estado NOT IN ('E', 'D', 'T')
                    AND rec.rec_idepadre IS NULL;";
        return $this->executeQuery($sql);
    }

    /**
     * permite obtener los recaudos que han sido pagados despues de una provisión de las facturas que llevan más de 13 meses de mora 
     * @return array listado de  recaudos que deberán ser actualizados sus saldos en la provisión
     */
    public function obtenerRecaudosParaAprovisionarFinanciacion() {
        $sql = "SELECT DISTINCT
                        rec.rec_ideregistro idrecaudo,
                        fac.fac_ideorigen idfacturaoriginal,
                        fac.fac_ideregistro idfacturaprovision,
                        fac.dsus_ideregistr idsuscripcion
                FROM
                        fac_factura fac
                INNER JOIN drec_detrecaudo drec ON fac.fac_ideorigen = drec.fac_ideregistro
                INNER JOIN rec_recaudo rec ON rec.rec_ideregistro = drec.rec_ideregistro
                WHERE
                        fac.fac_estado = 'P' AND  fac.fin_ideregistro IS NOT NULL
                AND drec.drec_fecha BETWEEN (now() - INTERVAL '1 month') AND now()
                AND fac.fac_sdoreal > 0
                AND fac.fac_ideorigen IS NOT NULL
                AND rec.rec_estado NOT IN ('E', 'D', 'T')
                AND rec.rec_idepadre IS NULL;";
        return $this->executeQuery($sql);
    }

    /**
     * obtiene el listado de detalles de recaudos pagados 
     * @param int $idrecaudo identificador del recaudo
     * @return array listado de detalles de recaudos 
     */
    public function obtenerDetallesRecaudos($idrecaudo) {
        $sql = "SELECT
                            drec.drec_vlrtotal valorpagado,
                            drec.dfac_ideregistr iddetallefactura,
                            dfac.uni_concepto idconcepto

                    FROM
                            drec_detrecaudo drec inner join dfac_detfactura dfac 
                    on drec.dfac_ideregistr = dfac.dfac_ideregistr              
                WHERE
                        drec.rec_ideregistro = :idrecaudo";
        $parametros['idrecaudo'] = $idrecaudo;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * 
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
     * 
     * @param type $idfactura
     * @return type
     */
    public function obtenerValorTotalProvisionConcepto($idfactura) {
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
     * Crear un recudo de provisión a la factura
     * @param type $facturas
     */
    public function crearRecuperacionProvisionModel($facturas) {
        $facturas['fac_estado'] = 'A';
        $facturas['fac_fecha'] = 'now()';
        $facturas['fac_sdoreal'] = 0;
        $facturas['fac_version'] = 1;
        $facturas['fac_vlrreal'] = 0;
        $facturas['mvi_ideregistro'] = null;
        return $this->insertar($facturas, 'fac_factura', 'sq_fac_ideregistro');
    }

    /**
     * Crear una nota para recuperacion 
     * @param type $notas
     */
    public function crearNotaCondonacionModel($notas) {
        $notas['est_motnota'] = ESTRUCTURA_NOTA;
        $notas['uni_motnota'] = UNIDAD_CONDONACION;
        $notas['not_fecha'] = 'now()';
        $notas['not_comentario'] = 'Condonacion de factura';
        return $this->insertar($notas, 'not_nota', 'sq_not_ideregistro');
    }

    /**
     * Crear una nota para recuperacion 
     * @param type $notaFacturacion
     */
    public function crearNotaFacturaRecuperacionModel($notaFacturacion) {
        return $this->insertar($notaFacturacion, 'nofa_notfactura', 'sq_nofa_ideregistr');
    }

    /**
     * Crear un detalle recaudo de provisión a la factura
     * @param type $detallefactura
     */
    public function crearDetalleRecaudoProvision($detallefactura) {
        $detallefactura['dfac_estado'] = 'A';
        $detallefactura['dfac_cantidad'] = 0;
        $detallefactura['dfac_vlrunitari'] = abs($detallefactura['dfac_sdoreal']) * -1;
        $detallefactura['dfac_vlrtotal'] = $detallefactura['dfac_sdoreal'];
        $detallefactura['dfac_vlrreal'] = abs($detallefactura['dfac_sdoreal']) * -1;
        return $this->insertar($detallefactura, 'dfac_detfactura', 'sq_dfac_ideregistr');
    }

    /**
     * Crear un detalle recaudo de provisión a la factura
     * @param type $detallefactura
     */
    public function crearDetalleReclasificacion($detallefactura) {
        $detallefactura['dfac_estado'] = 'A';
        unset($detallefactura['dfac_ideregistr']);
        return $this->insertar($detallefactura, 'dfac_detfactura', 'sq_dfac_ideregistr');
    }

    /**
     * actualización del saldo de la factura de la provision en curso
     * @param int $iddetallefactura identificador del detalle de la factura para ser actualizada su saldo
     * @param float $valor valor ponderado para el PR
     */
    public function actualizarSaldoConceptoProvision($iddetallefactura, $valor) {
        $sql = "UPDATE      dfac_detfactura 
                                       set dfac_sdoreal = dfac_sdoreal -  :valor 
                    WHERE
                                        dfac_ideregistr =   :iddetallefactura; ";
        $parametros['iddetallefactura'] = $iddetallefactura;
        $parametros['valor'] = $valor;
        $this->executeQuery($sql, $parametros);
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
     * carga la información de del detalle de la factura basado en la factura
     * @param int $iddetallefactura identificador del detalle de factura
     * @return array listado de los detalles de factura existentes
     */
    public function obtenerDetalleFacturaPorIdentificadorModel($iddetallefactura) {
        $sql = "select * from dfac_detfactura where dfac_ideregistr =  $iddetallefactura";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException("No se encontraron detalles para la factura $iddetallefactura ", -1);
        }
        return $respuesta;
    }

    /**
     * permite obtener el listado de las facturas correspondientes  a aprovisionar, esto solamente si cumple el lapso de 13 meses exactos, apartir de la fecha
     * @param int $idempresa identificador de la empresa
     * @return listado de facturas a aprovisionar
     */
    public function ObtenerFacturasAProvisonarModel($idempresa) {
        $sql = "SELECT
                            fac.dsus_ideregistr idsuscripcion,
                            fac.fac_ideregistro idfactura,
                            fac.fac_sdoreal saldo,
                            fac.fac_fecha fecha,
                            fac.uni_documento documento,
                            fac.uni_tipdocument tipodocumento,
                            fac.cic_ideregistro ciclo
                    FROM
                            fac_factura fac
                    WHERE
                            fac.emp_ideregistro = :idempresa
                    --AND fac.fin_ideregistro IS NULL
                    AND fac.fac_idepadre is null 
                    AND fac.fac_sdoreal > 0
                    AND fac.fac_estado NOT IN ('C', 'E', 'P')
                    AND fac.fac_fecvence BETWEEN (now() - INTERVAL '13 month')
                    AND (now() - INTERVAL '12 month');";
        $parametros['idempresa'] = $idempresa;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * permite obtener el listado de las facturas correspondientes  a aprovisionar, esto solamente si cumple el lapso de 13 meses exactos, apartir de la fecha
     * @param int $idempresa identificador de la empresa
     * @return listado de facturas a aprovisionar
     */
    public function ObtenerFacturasAProvisonarFinanciacionModel($idempresa) {

        $sql = "SELECT DISTINCT
                            fin.dsus_ideregistr idsuscripcion,
                            fin.fin_ideregistro idfactura,
                            amfi.uni_documento documento,
                            amfi.uni_tipdocument tipodocumento,
                            fin.cic_ideregistro ciclo,
                            fin.fin_sdocapital + (
                                    SELECT
                                            COALESCE (SUM(dfac.dfac_sdoreal), 0) saldo
                                    FROM
                                            dfac_detfactura dfac
                                    INNER JOIN fac_factura fac ON dfac.fac_ideregistro = fac.fac_ideregistro
                                    WHERE
                                            dfac.dfac_ideregistr = dfin.dfac_ideregistr
                                    AND fac.fac_sdoreal > 0
                                    AND fac.fac_fecvence < now()
                            ) saldo,
                            fin.fin_fecha fecha
                    FROM
                            fin_financiacio fin
                    INNER JOIN dfin_detfinanci dfin ON dfin.fin_ideregistro = fin.fin_ideregistro
                    INNER JOIN amfi_amofinanci amfi ON amfi.fin_ideregistro = fin.fin_ideregistro
                    WHERE
                            fin.fin_sdocapital > 0
                    AND fin.emp_ideregistro = :idempresa
                    AND fin.fin_fecha BETWEEN (now() - INTERVAL '13 month') AND (now() - INTERVAL '12 month')";
        $parametros['idempresa'] = $idempresa;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Crear una provision encabezado de provisión de la factura
     * @param type $factura
     */
    public function crearProvisionFacturaModel($factura) {

        try {
            $factura['fac_estado'] = 'P';
            $factura['fac_fecha'] = 'now()';
            $factura['fac_version'] = 1;

            unset($factura['mvi_ideregistro']);
            unset($factura['fac_feccastigad']);
            unset($factura['fac_fecfinancia']);
            unset($factura['fac_feceliminad']);
            unset($factura['fac_ideactual']);
            unset($factura['fac_ideregistro']);
            unset($factura['fac_numero']);


            return $this->insertar($factura, 'fac_factura', 'sq_fac_ideregistro');
        } catch (\Exception $e) {
            print_r($e->getMessage());
        }
    }

    /**
     * Crear una provision encabezado de provisión de la factura
     * @param type $factura
     */
    public function crearProvisionFacturaFinanciacionModel($factura) {

        try {
            $factura['fac_estado'] = 'P';
            $factura['fac_fecha'] = 'now()';
            $factura['fac_version'] = 1;
            $factura['fac_metgenera'] = 'P';
            $factura['hliq_ideregistr'] = 0;
            return $this->insertar($factura, 'fac_factura', 'sq_fac_ideregistro');
        } catch (\Exception $e) {
            print_r($e->getMessage());
        }
    }

    /**
     * Crear un detalle de provisión a la factura
     * @param type $detallefactura
     */
    public function crearDetalleProvision($detallefactura) {
        $detallefactura['dfac_estado'] = 'A';
        $detallefactura['dfac_cantidad'] = 1;
        unset($detallefactura['dfac_ideregistr']);

        return $this->insertar($detallefactura, 'dfac_detfactura', 'sq_dfac_ideregistr');
    }

    //</editor-fold>
}
