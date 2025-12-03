<?php

namespace Llanogas\LlanogasBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\ConceptosUtil;

/**
 * un modelo generico para los procesos de castigo de la cartera
 * @author sergio vargas
 */
class CarteraCastigadaGenericoModel extends AuditoriaServices {

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
     * permmite validar el usuario 
     * @param type $idsuscripcion
     */
    public function validarUsuarioModel($idsuscripcion) {

        $sql = "
                SELECT
                        COUNT (*)
                FROM
                        fin_financiacio
                WHERE
                        fin_sdocapital = 0
                AND dsus_ideregistr = $idsuscripcion
                UNION
                        SELECT
                                COUNT (*) facturas
                        FROM
                                fac_factura fac
                        WHERE
                                fac.fac_sdoreal = 0
                        AND fac.fac_estado = 'A'
                        AND dsus_ideregistr = $idsuscripcion
                ";

        $respuesta = $this->executeQuery($sql);
        return $respuesta[0];
    }

    /**
     * permite obtener la información de una factura especifica, con sus campos originales
     * @param int $idfactura identificador de la factura
     * @return array un solo registron con la información de la factura consultada 
     */
    public function obtenerFacturaModel($idfactura) {

        $sql = "select * from fac_factura where fac_ideregistro = $idfactura ";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException("factura $idfactura no existente", -1);
        }
        return $respuesta[0];
    }

    /**
     * Permite obtener los saldo de las facturas provisionadas para realizar el castigo 
     * esta saldo ya esta calculado 
     * @param int $idfactura identificador de la factura
     */
    public function obtenerSaldoRealCastigoModel($idfactura) {
        $sql = "SELECT
                        fac.fac_sdoreal - COALESCE (
                                (
                                        SELECT
                                                SUM (fac1.fac_sdoreal)
                                        FROM
                                                fac_factura fac1 inner join doc_documento doc 
                                                on fac1.uni_documento = doc.uni_documento
                                        WHERE
                                                fac1.fac_ideorigen = fac.fac_ideregistro
                                        and doc.doc_abreviatura = 'PR'
                                ),
                                0
                        ) saldo
                FROM
                        fac_factura fac
                WHERE
                        fac.fac_ideregistro = $idfactura;";

        $respuesta = $this->executeQuery($sql);
        if ($respuesta[0]['saldo'] <= 0) {
            return 0;
        }

        return $respuesta[0]['saldo'];
    }

    /**
     * Permite obtener los saldo de las facturas provisionadas para realizar el castigo 
     * esta saldo ya esta calculado 
     * @param int $iddetalleFactura identificador de la factura
     */
    public function obtenerSaldoRealCastigoDetalleFacturaModel($iddetalleFactura) {
        $sql = "SELECT
                        dfac.dfac_sdoreal - COALESCE (
                                (
                                        SELECT
                                                SUM (dfac1.dfac_sdoreal)
                                        FROM
                                                fac_factura fac1
                                        INNER JOIN doc_documento doc ON fac1.uni_documento = doc.uni_documento
                                        inner join dfac_detfactura dfac1 on fac1.fac_ideregistro = dfac1.fac_ideregistro
                                        WHERE
                                                fac1.fac_ideorigen =fac.fac_ideregistro
                                        AND fac1.fac_estado = 'P'
                                        AND doc.doc_abreviatura = 'PR'

                                ),
                                0
                        ) saldo
                FROM
                        fac_factura fac inner join dfac_detfactura dfac on fac.fac_ideregistro = dfac.fac_ideregistro

                WHERE
                        dfac.dfac_ideregistr = $iddetalleFactura;";

        $respuesta = $this->executeQuery($sql);
        if ($respuesta[0]['saldo'] <= 0) {
            return 0;
        }

        return $respuesta[0]['saldo'];
    }

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
     * Obtiene la sumatoria de l vlr_unitari del dfac con el fin de tener el valor real de la factura provisionada, evitando que este inflada por provision de financiacion 
     * @param int $idfactura identificador de la factura
     * @return array listado de los detalles de factura existentes
     */
    public function obtenerSumatoriaVlrUnitariModel($idfactura) {
        $sql = "SELECT
                        SUM (dfac_vlrunitari) total
                FROM
                        dfac_detfactura
                WHERE
                        fac_ideregistro = $idfactura";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException("No se encontraron detalles para la factura $idfactura ", -1);
        }
        return $respuesta[0]['total'];
    }

    // <editor-fold desc="Aprovisionar facturas">  

    /**
     * permite validar si una factura ya se encuentra provisionada
     * @param int $idfactura identificador de la factura
     * @return type
     */
    public function validarProvisionFactura($idfactura) {
        $sql = "SELECT
                        COUNT (*) cantidad
                FROM
                        fac_factura fac
                INNER JOIN doti_doctipo doti ON doti.uni_tipdocument = fac.uni_tipdocument
                INNER JOIN ddot_detdoctipo ddot ON ddot.doti_ideregistr = doti.doti_ideregistr
                AND ddot.uni_documento = fac.uni_documento
                WHERE
                        fac_ideorigen = $idfactura
                AND ddot.ddot_tipo = 'PR';";
        $respuesta = $this->executeQuery($sql);
        return $respuesta[0]['cantidad'];
    }

    /**
     * Permite obtener los recaudos a provisionar, se recibe la suscripción para incluir un filtro adicional. 
     * @param int $idsuscripcion identificador de la suscripción 
     * @return Array listado de los recaudos a provisionar
     */
    public function obtenerRecaudosParaRecuperacionModel($idciclo, $idempresa, $idsuscripcion = null) {
        $complemento = '';
        if (!empty($idsuscripcion)) {
            $complemento = " AND fac.dsus_ideregistr = $idsuscripcion";
        }
        $sql = "SELECT DISTINCT
                        rec.rec_ideregistro idrecaudo,
                        fac.fac_ideorigen idfacturaoriginal,
                        fac.fac_ideregistro idfacturaprovision,
                        fac.dsus_ideregistr idsuscripcion,
                        drec.drec_vlrreal pago,
                        drec.drec_fecha fecha,
                        COALESCE (
                                drec.drec_fecha :: TIMESTAMP > (
                                        SELECT
                                                facRecuperacion.fac_fecha
                                        FROM
                                                fac_factura facRecuperacion
                                        INNER JOIN doc_documento doc ON doc.uni_documento = facRecuperacion.uni_documento
                                        WHERE
                                                doc.doc_abreviatura IN ('RP')
                                        AND facRecuperacion.fac_idepadre = fac.fac_ideregistro
                                        AND drec.drec_fecha :: TIMESTAMP < facRecuperacion.fac_fecha
                                        ORDER BY
                                                facRecuperacion.fac_fecha DESC
                                        LIMIT 1
                                ) :: TIMESTAMP,
                                TRUE
                        ) recuperacion
                FROM
                        fac_factura fac
                INNER JOIN drec_detrecaudo drec ON fac.fac_ideorigen = drec.fac_ideregistro
                INNER JOIN rec_recaudo rec ON rec.rec_ideregistro = drec.rec_ideregistro
                INNER JOIN per_periodo per ON per.cic_ideregistro = fac.cic_ideregistro
                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = fac.dsus_ideregistr
                INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                WHERE
                        doc.doc_abreviatura IN ('PR', 'RC')
                AND fac.fac_sdoreal > 0
                AND fac.fac_ideorigen IS NOT NULL
                AND dsus.cic_ideregistro = $idciclo
                AND fac.emp_ideregistro = $idempresa
                AND rec.rec_estado NOT IN ('E', 'D', 'T')
                AND rec.rec_idepadre IS NULL
                AND rec.rec_fecha > fac.fac_fecha
                AND drec.drec_fecha > (per.per_fecfinal-((CAST(EXTRACT('day' FROM per.per_fecfinal) AS TEXT )) || ' day')::INTERVAL)
                AND drec.drec_fecha <= ((per.per_fecfinal + INTERVAL '1 month' )-((CAST(EXTRACT('day' FROM per.per_fecfinal) AS TEXT )) || ' day')::INTERVAL)  " . $complemento;
        return $this->executeQuery($sql);
    }

    /**
     * Crear una nueva provisión a la factura, omitiendo algunos campos en el proceso
     * @param array $factura factura de provisión a insertar
     */
    public function crearRecuperacionProvisionModel($factura) {
        $factura['fac_estado'] = 'C';
        $factura['fac_fecha'] = 'now()';
        $factura['fac_version'] = 1;
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
        if (empty($respuesta)) {
            return 0;
        }
        return $respuesta[0];
    }

    /**
     * actualización del saldo del detalle de la factura que se realizo la provision
     * @param int $iddetallefactura identificador del detalle de la factura para ser actualizada su saldo
     * @param float $recuperacionPonderada valor ponderado para el PR
     */
    public function actualizarSaldoConceptoProvisionModel($iddetallefactura, $saldoDetalleFactura, $recuperacionPonderada, $idconcepto) {
        $data['dfac_sdoreal'] = $saldoDetalleFactura - $recuperacionPonderada;
        $data['dfac_ideregistr'] = $iddetallefactura;
        $data['uni_concepto'] = $idconcepto;
        $conceptoUtil = new ConceptosUtil($this->conexion);
        $conceptoUtil->redondear($data, "dfac_detfactura");
        $this->actualizar($data, "dfac_detfactura", "dfac_ideregistr=:dfac_ideregistr");
    }

    /**
     * Crear un detalle recaudo de provisión a la factura, de tipo nota (saldos negativos)
     * @param array $detallefactura información del detalle a asociar
     */
    public function crearDetalleRecuperacionModel($detallefactura) {
        $detallefactura['dfac_estado'] = 'A';
        $detallefactura['dfac_cantidad'] = 1;
        return $this->insertar($detallefactura, 'dfac_detfactura', 'sq_dfac_ideregistr');
    }

    /**
     * Permite cambiar el estado de la financiacion a C [Estado de castigo]
     * @param int $idfinanciacion identificador de la financiacion
     */
    public function castigarFinanciacionModel($idfinanciacion) {
        $sql = "update fin_financiacio 
                set fin_estado = 'C'
                where fin_ideregistro=$idfinanciacion";
        $this->executeQuery($sql);

        $sqlFact = "update fac_factura 
                set fac_estado = 'C'
                where fin_ideregistro=$idfinanciacion";

        $this->executeQuery($sqlFact);
    }

    /**
     * actualización del saldo de la factura de la provision en curso
     * @param int $idfactura identificador del detalle de la factura para ser actualizada su saldo
     * @param float $valor valor ponderado para el PR
     */
    public function actualizarSaldoFacturaProvisionModel($idfactura, $valor) {
        $parametros['fac_ideregistro'] = $idfactura;
        $parametros['fac_sdoreal'] = $valor;
        $this->actualizar($parametros, "fac_factura", "fac_ideregistro = :fac_ideregistro");
    }

    /**
     * actualización del saldo de la factura de la provision en curso
     * @param int $idfactura identificador del detalle de la factura para ser actualizada su saldo
     */
    public function actualizarSaldoFacturaProvisionCastigoModel($idfactura, $idsuscripcion) {

        /* Se verifica que las facturas que contienen provision tengan alguna reclasificacion si no
          contienen  reclasificación se omite el proceso de saldar las provisiones */
        $sqlValidaRecuperacion = "SELECT
                                            fac.fac_ideregistro
                                    FROM
                                            fac_factura fac
                                    INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                                    WHERE
                                            fac.fac_ideorigen IN (
                                                    SELECT
                                                            fac.fac_ideregistro
                                                    FROM
                                                            fac_factura fac
                                                    INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                                                    WHERE
                                                            fac.fac_ideorigen = $idfactura
                                                    AND doc.doc_abreviatura IN ('PR')
                                                    AND fac.dsus_ideregistr = $idsuscripcion
                                            )
                                    AND doc.doc_abreviatura IN ('RC')
                                    AND fac.dsus_ideregistr = $idsuscripcion";

        $respuestaValidaRecuperacion = $this->executeQuery($sqlValidaRecuperacion);

        if (!empty($respuestaValidaRecuperacion)) {
            $sql = "
                    UPDATE fac_factura
                    SET fac_sdoreal = 0
                    WHERE
                            fac_ideregistro IN (
                                    SELECT
                                            fac.fac_ideregistro
                                    FROM
                                            fac_factura fac
                                    INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                                    WHERE
                                            fac.fac_ideorigen = $idfactura
                                    AND doc.doc_abreviatura IN ('PR')
                                    AND fac.dsus_ideregistr = $idsuscripcion
                            ) RETURNING fac_ideregistro ";
            $this->executeQuery($sql);


            $sqldfac = "UPDATE dfac_detfactura
                    SET dfac_sdoreal = 0
                    WHERE fac_ideregistro IN (  SELECT
                                            fac.fac_ideregistro
                                    FROM
                                            fac_factura fac
                                    INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                                    WHERE
                                            fac.fac_ideorigen = $idfactura
                                    AND doc.doc_abreviatura IN ('PR')
                                    AND fac.dsus_ideregistr = $idsuscripcion)";

            $this->executeQuery($sqldfac);
        }
    }

    //</editor-fold>
    // <editor-fold desc="validacion de recaudos">  
    public function obtenerRecaudosConSaldoAplicarModel($idempresa, $idCiclo = null, $idsuscripcion = null, $isGlobal = false) {
        $parametros['idempresa'] = $idempresa;
        $complemento = "";
        if (!empty($idsuscripcion)) {
            $complemento = " AND dire.dsus_ideregistr = $idsuscripcion ";
        }
        if (!empty($idCiclo)) {
            $complemento .= " and dsus.cic_ideregistro = $idCiclo ";
        }
        $isSQLGlobal = "";
        if ($isGlobal) {
            $isSQLGlobal = " AND age( CURRENT_TIMESTAMP, fac.fac_fecha :: TIMESTAMP ) >= '25 month' :: INTERVAL";
        }
        $sql = "        SELECT  DISTINCT dire.rec_ideregistro idrecaudo,
	                                    dire.dsus_ideregistr idsuscripcion,
	                                   dire.dire_sdorecaudo saldorecaudo
                                 
	                    FROM  dire_disrecaudo dire 
                            INNER JOIN fac_factura fac  on fac.uni_tipdocument = dire.uni_tipdocument and  fac.dsus_ideregistr =  dire.dsus_ideregistr  and fac.fac_idepadre is null
                            INNER JOIN dsus_detsuscrip dsus on dsus.dsus_ideregistr = dire.dsus_ideregistr
                            INNER JOIN rec_recaudo rec on dire.rec_ideregistro = rec.rec_ideregistro             
                            INNER JOIN dfac_detfactura dfac  on dfac.fac_ideregistro = fac.fac_ideregistro and dfac.dfac_sdoreal > 0 
                         
	                    WHERE    
	                             ( CASE  WHEN ( dire.uni_documento is not null )   AND  (dire .uni_concepto is not  null ) 
                                                    THEN  dire.uni_documento = fac.uni_documento  AND dfac.uni_concepto =   dire.uni_concepto                             
                                              WHEN dire.uni_concepto is not null 
                                                    THEN dire.uni_concepto = dfac.uni_concepto
                                              WHEN dire.uni_documento is not null 
                                                    THEN dire.uni_documento = fac.uni_documento    
                                              ELSE 1 = 1 
                                  END 
                                ) 
                            AND     dire.dire_sdorecaudo > 0  AND   fac.emp_ideregistro = :idempresa   AND fac.fac_sdoreal > 0   AND fac.fac_estado ='A'    and 
                                    dfac.dfac_ideregistr  is not null and rec.rec_estado in('A','P','G')   " . $isSQLGlobal . " " . $complemento;

        return $this->executeQuery($sql, $parametros);
    }

    //</editor-fold>
    // <editor-fold desc="Provisionar Facturas">  

    /**
     * Crear una provision encabezado de provisión de la factura
     * @param array $factura recibe la factura para crear la provisión correspondiente
     */
    public function crearProvisionFacturaModel($factura) {

        $factura['fac_estado'] = 'P';
        $factura['fac_fecha'] = 'now()';
        $factura['fac_fecaprobada'] = 'now()';
        $factura['fac_version'] = 1;
        $factura['fac_metgenera'] = 'P';
        unset($factura['mvi_ideregistro']);
        unset($factura['fac_feccastigad']);
        unset($factura['fac_fecfinancia']);
        unset($factura['fac_feceliminad']);
        unset($factura['fac_ideactual']);
        unset($factura['fac_ideregistro']);
        unset($factura['fac_numero']);
        return $this->insertar($factura, 'fac_factura', 'sq_fac_ideregistro');
    }

    /**
     * Crear una factura para el saldo de la financiacion
     * @param array $factura recibe la factura para crear la provisión correspondiente
     */
    public function crearFacturaSaldoFinanciacionModel($factura) {

        $factura['fac_estado'] = 'C';
        $factura['fac_fecha'] = 'now()';
        $factura['fac_fecaprobada'] = 'now()';
        $factura['fac_version'] = 1;
        $factura['fac_metgenera'] = 'P';
        return $this->insertar($factura, 'fac_factura', 'sq_fac_ideregistro');
    }

    /**
     * Crear un detalle de provisión a la factura
     * @param type $detallefactura
     */
    public function crearDetalleProvisionModel($detallefactura) {
        $detallefactura['dfac_estado'] = 'A';
        unset($detallefactura['dfac_ideregistr']);
        return $this->insertar($detallefactura, 'dfac_detfactura', 'sq_dfac_ideregistr');
    }

    public function obtenerDetalleFinanciacionModel($idfinanciacion) {
        $sql = "select * from  dfin_detfinanci where fin_ideregistro= $idfinanciacion";
        return $this->executeQuery($sql);
    }

    /**
     * permite obtener el listado de las facturas correspondientes  a aprovisionar, esto solamente si cumple el lapso de 13 meses exactos, apartir de la fecha
     * @param int $idempresa identificador de la empresa
     * @return listado de facturas a aprovisionar
     */
    public function ObtenerFacturasAProvisonarModel($idempresa, $idciclo, $idsuscripcion = null) {
        $complemento = "";
        if (!empty($idsuscripcion)) {
            $complemento = " AND fac.dsus_ideregistr = $idsuscripcion";
        }
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
                    INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = fac.dsus_ideregistr
                    WHERE
                    fac.emp_ideregistro = $idempresa
                    AND dsus.dsus_estado not in ('E')
                    AND fac.fin_ideregistro IS NULL
                    AND fac.fac_idepadre is null 
                    AND fac.fac_sdoreal > 0
                    AND dsus.cic_ideregistro = $idciclo
                    AND fac.fac_estado = 'A'
                    AND age( CURRENT_TIMESTAMP, 	fac.fac_fecha :: TIMESTAMP ) >= '13 month' :: INTERVAL 
                    and age( CURRENT_TIMESTAMP, 	fac.fac_fecha :: TIMESTAMP ) < '14 month' :: INTERVAL
                    " . $complemento;
        return $this->executeQuery($sql);
    }

    /**
     * permite obtener el listado de las facturas correspondientes  a aprovisionar, esto solamente si cumple el lapso de 13 meses exactos, apartir de la fecha
     * @param int $idfinanciacion identificador de la empresa
     * @return listado de facturas a aprovisionar
     */
    public function ObtenerFacturasAProvisonarFinanciacionModel($idfinanciacion, $idsuscripcion) {
        $sql = "SELECT
                        fac.dsus_ideregistr idsuscripcion,
                        fac.fac_ideregistro idfactura,
                        fac.fac_fecha fecha,
                        fac.uni_documento documento,
                        fac.uni_tipdocument tipodocumento,
                        fac.fac_sdoreal saldo
                FROM
                        fac_factura fac
                INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                WHERE
                        doc.doc_tipo NOT IN ('PR', 'CC', 'RP', 'RC')
                AND fac.fac_estado = 'A'
                AND fac.fac_idepadre IS NULL
                AND fac.fin_ideregistro = $idfinanciacion
                AND fac.dsus_ideregistr = $idsuscripcion";

        return $this->executeQuery($sql);
    }

    /**
     * se obtiene las financiaciones donde existan facturas con saldo y que cumplan con 25 meses de cartera.
     * con el fin de construir una nueva factura a partir de sus saldo
     * @param int $idempresa identificador de la factura
     * @param int $idsuscripcion identificador de la suscripcion 
     * @return array listado de financiaciones que deben aplicarsen como nuevas facturas para castigar
     */
    public function ObtenerSaldoFinanciacionGenerarNuevaFactura($idempresa, $idciclo, $idsuscripcion) {
        $complemento = '';

        if (!empty($idsuscripcion)) {
            $complemento = " and fin.dsus_ideregistr = $idsuscripcion ";
        } else {
            $complemento = " AND fin.fin_ideregistro in (
                                            SELECT
                                                    fin_ideregistro
                                            FROM
                                                    fac_factura fac
                                            WHERE
                                                    fin_ideregistro IS NOT NULL
                                            AND age(
                                                    CURRENT_TIMESTAMP,
                                                    fac.fac_fecha :: TIMESTAMP
                                            ) >= '25 month' :: INTERVAL
                                            AND age(
                                                    CURRENT_TIMESTAMP,
                                                    fac.fac_fecha :: TIMESTAMP
                                            ) < '26 month' :: INTERVAL) ";
        }

        $sql = "SELECT DISTINCT
                        fin.*
                FROM
                        fin_financiacio fin
                INNER JOIN fac_factura fac ON fin.fin_ideregistro = fac.fin_ideregistro
                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = fac.dsus_ideregistr
                INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                WHERE
                        fac.emp_ideregistro = $idempresa
                AND doc.doc_abreviatura NOT IN ('PR', 'RC', 'CC', 'RP')
                AND fac.fac_sdoreal > 0 
                AND dsus.cic_ideregistro = $idciclo
                AND fac.fac_estado = 'A' $complemento";

        return $this->executeQuery($sql);
    }

    /**
     * permite obtener un listado de la sumatoria entre el saldo de la factura y el saldo de la financiación 
     * con el objetivo de conocer el valor de la provision. y asi poder realizar la ponderación en la generación de dicho proceso denominado 
     * ObtenerFacturasAProvisonarFinanciacionModel
     * @param int $idempresa identificador de la empresa
     * @param int $idsuscripcion identificado de la suscripcion
     * @return Arra lisado de financiaoiones con valor de provisión real. 
     */
    public function ObtenerFacturasFinanciacionProvisionarMesFinalModel($idempresa, $idciclo, $idsuscripcion = null) {
        $complemento = "";
        if (!empty($idsuscripcion)) {
            $complemento = " AND fac.dsus_ideregistr = $idsuscripcion";
        }
        $sql = "SELECT
                        (
                                fin.fin_sdocapital + (
                                        SELECT
                                                SUM (famo.fac_sdoreal)
                                        FROM
                                                fac_factura famo
                                        INNER JOIN doc_documento doc ON doc.uni_documento = famo.uni_documento
                                        WHERE
                                                famo.fin_ideregistro = fac.fin_ideregistro
                                        AND doc.doc_abreviatura NOT IN ('RP', 'CC', 'PR', 'RC')
                                )
                        ) * 0.33 valorprovision,
                        (
                                SELECT
                                        SUM (famo.fac_sdoreal)
                                FROM
                                        fac_factura famo
                                INNER JOIN doc_documento doc ON doc.uni_documento = famo.uni_documento
                                WHERE
                                        famo.fin_ideregistro = fac.fin_ideregistro
                                AND doc.doc_abreviatura NOT IN ('RP', 'CC', 'PR', 'RC')
                        ) valoramortizacion,
                        fac.fin_ideregistro idfinanciacion,
                        fac.dsus_ideregistr idsuscripcion
                FROM
                        tmp_facturas_castigar facCastigo
                INNER JOIN fac_factura fac ON fac.fac_ideregistro = facCastigo.idfactura
                INNER JOIN fin_financiacio fin ON fin.fin_ideregistro = fac.fin_ideregistro
                INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                WHERE
                        fac.fin_ideregistro IS NOT NULL
                AND doc.doc_abreviatura NOT IN ('RP', 'CC', 'PR', 'RC')
                AND fac.cic_ideregistro = $idciclo
                AND fac.emp_ideregistro = $idempresa
                AND fac.fac_sdoreal > 0
                AND fac.fac_estado = 'A'
                AND fac.fac_idepadre IS NULL $complemento";

        return $this->executeQuery($sql);
    }

    /**
     * permite obtener un listado de la sumatoria entre el saldo de la factura y el saldo de la financiación 
     * con el objetivo de conocer el valor de la provision. y asi poder realizar la ponderación en la generación de dicho proceso denominado 
     * ObtenerFacturasAProvisonarFinanciacionModel
     * @param int $idempresa identificador de la empresa
     * @param int $idsuscripcion identificado de la suscripcion
     * @return Arra lisado de financiaoiones con valor de provisión real. 
     */
    public function ObtenerFacturasFinanciacionProvisionarModel($idempresa, $idciclo, $idsuscripcion = null) {
        $complemento = "";
        if (!empty($idsuscripcion)) {
            $complemento = " AND fac.dsus_ideregistr = $idsuscripcion";
        }
        $sql = "SELECT
                        (
                                fin.fin_sdocapital + (
                                        SELECT
                                                SUM (famo.fac_sdoreal)
                                        FROM
                                                fac_factura famo
                                        INNER JOIN doc_documento doc ON doc.uni_documento = famo.uni_documento
                                        WHERE
                                                famo.fin_ideregistro = fac.fin_ideregistro
                                        AND doc.doc_abreviatura NOT IN ('RP', 'CC', 'PR', 'RC')
                                )
                        ) * 0.33 valorprovision,
                        (
                                SELECT
                                        SUM (famo.fac_sdoreal)
                                FROM
                                        fac_factura famo
                                INNER JOIN doc_documento doc ON doc.uni_documento = famo.uni_documento
                                WHERE
                                        famo.fin_ideregistro = fac.fin_ideregistro
                                AND doc.doc_abreviatura NOT IN ('RP', 'CC', 'PR', 'RC')
                        ) valoramortizacion,
                        fac.fin_ideregistro idfinanciacion,
                        fac.dsus_ideregistr idsuscripcion
                FROM
                        fac_factura fac
                INNER JOIN fin_financiacio fin ON fin.fin_ideregistro = fac.fin_ideregistro
                INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                WHERE
                fac.fin_ideregistro is not null 
                AND age(
                                CURRENT_TIMESTAMP,
                                fac.fac_fecha :: TIMESTAMP
                        ) >= '13 month' :: INTERVAL
                AND age(
                        CURRENT_TIMESTAMP,
                        fac.fac_fecha :: TIMESTAMP
                ) < '14 month' :: INTERVAL
                AND doc.doc_abreviatura NOT IN ('RP', 'CC', 'PR', 'RC')
                AND fac.cic_ideregistro = $idciclo
                AND fac.emp_ideregistro = $idempresa
                AND fac.fac_sdoreal > 0
                AND fac.fac_estado = 'A'
                AND fac.fac_idepadre IS NULL  $complemento ";

        return $this->executeQuery($sql);
    }

    /**
     * Consulta la información de la amortización
     * @param int $idfinanciacion identificador de la financiacion.
     * @return Array  listado de amortizacion disponibles
     * @throws MyException Error consultando el detalle de la amortización
     */
    public function obtenerArmotizacionActivaModel($idfinanciacion, $estado = 'A') {
        $sql = "SELECT 
                    amfi_ideregistr,
                    amfi_estado,
                    amfi_numcuotas,
                    amfi_cuoamortiz,
                    amfi_fecha,
                    fin_ideregistro,
                    uni_liquidacion,
                    uni_documento,
                    uni_tipdocument,
                    dsus_ideregistr,
                    emp_ideregistro,
                    cic_ideregistro,
                    per_ideregistro,
                    cic_ano,
                    usu_ideregistro
                FROM amfi_amofinanci 
                WHERE  fin_ideregistro= $idfinanciacion and amfi_estado = '$estado'";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('Error consultando el detalle de la amortización (amfi)', -1);
        }
        return $resultado[0];
    }

    /**
     * Permite actualizar el estado de la amortización
     * @param type $idamortizacion
     * @param char $estado recibe el estado de la amortización a incluir C para Finalizar R para reestructurar
     * @throws MyException No se pudo modificar la amortización
     */
    public function actualizarAmortizacionFinanciacion($idamortizacion, $estado) {
        $parametros['amfi_ideregistr'] = $idamortizacion;
        $parametros['amfi_estado'] = $estado;
        $resultado = $this->actualizar($parametros, 'amfi_amofinanci', 'amfi_ideregistr= :amfi_ideregistr');
        if (empty($resultado)) {
            throw new MyException('No se pudo modificar la amortización');
        }
        return $resultado;
    }

    /**
     * Genera un nuevo registro de las amortizaciones
     * @param array $financiacion información de la financiacion que se quiere amortizar
     * @return bool TRUE insertar FALSE error
     */
    public function insertarAmortizacionFactura($financiacion) {
        return $this->insertar($financiacion, 'amo_amortizacio', 'sq_amo_ideregistro');
    }

    /**
     * Genera un nuevo registro de las amortizaciones
     * @param array $financiacion información de la financiacion que se quiere amortizar
     * @return bool TRUE insertar FALSE error
     */
    public function insertarDetalleAmortizacionFactura($financiacion) {
        return $this->insertar($financiacion, 'damo_detamortiz', 'sq_damo_ideregistr');
    }

    /**
     * obtener detalle de la financiacion 
     * @param array $idfinanciacion información de la financiacion que se quiere amortizar
     * @return bool TRUE insertar FALSE error
     */
    public function consultarDetalleFinanciacion($idfinanciacion) {
        $sql = "select * from dfin_detfinanci where fin_ideregistro = $idfinanciacion";
        return $this->executeQuery($sql);
    }

    /**
     * obtener detalle de la financiacion 
     * @param array $idfinanciacion información de la financiacion que se quiere amortizar
     * @return bool TRUE insertar FALSE error
     */
    public function consultarFinanciacion($idfinanciacion) {
        $sql = "select * from fin_financiacio where fin_ideregistro = $idfinanciacion";
        $respuesta = $this->executeQuery($sql);
        if (empty($respuesta)) {
            throw new MyException("No se encontro la Financiación $idfinanciacion", -1);
        }

        return $respuesta[0];
    }

    //</editor-fold>
    // <editor-fold desc="Castigar Cartera">  


    public function crearNotaCastigoFacturaModel($factura) {

        $factura['fac_estado'] = 'C';
        $factura['fac_fecha'] = 'now()';
        $factura['fac_fecaprobada'] = 'now()';
        $factura['fac_version'] = 1;
        $factura['fac_metgenera'] = 'P';
        unset($factura['mvi_ideregistro']);
        unset($factura['fac_feccastigad']);
        unset($factura['fac_fecfinancia']);
        unset($factura['fac_feceliminad']);
        unset($factura['fac_ideactual']);
        unset($factura['fac_ideregistro']);
        unset($factura['fac_numero']);
        return $this->insertar($factura, 'fac_factura', 'sq_fac_ideregistro');
    }

    /**
     * permite cargar las facturas a procesar que se encuentran ya en etapa de castigo
     * @param int $idempresa identificador de la empresa
     * @param int $idsuscripcion parámetro opcional para filtrar por suscripciones
     * @return int cantidad de filas afectadas
     */
    public function cargarFacturasParaCastigarModel($idempresa, $idciclo, $idsuscripcion = null) {
        $complemento = "";
        if (!empty($idsuscripcion)) {
            $complemento = " AND  fac.dsus_ideregistr= $idsuscripcion";
        }
        $parametros['idempresa'] = $idempresa;
        $sql = 'DROP TABLE IF EXISTS tmp_facturas_castigar;';
        $this->executeQuery($sql);
        $sql = "CREATE  TABLE tmp_facturas_castigar  AS SELECT
                                    fac.dsus_ideregistr idsuscripcion,
                                    fac.fac_ideregistro idfactura,
                                    fac.fac_sdoreal saldo,
                                    fac.fac_fecha fecha,
                                    fac.cic_ideregistro ciclo,
                                    fac.fac_estado estado
                            FROM
                                    fac_factura fac
                            INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = fac.dsus_ideregistr
                            INNER JOIN doc_documento doc on doc.uni_documento = fac.uni_documento
                            WHERE
                                    fac.emp_ideregistro =$idempresa
                            AND fac.fac_sdoreal > 0
                            AND dsus.cic_ideregistro = $idciclo
                            AND fac.fac_estado = 'A'
                            AND doc.doc_abreviatura not in ('PR','RP','CC','RC')
                            AND age( CURRENT_TIMESTAMP, fac.fac_fecha :: TIMESTAMP ) >= '25 month' :: INTERVAL 
                            and age( CURRENT_TIMESTAMP, fac.fac_fecha :: TIMESTAMP ) < '26 month' :: INTERVAL " . $complemento;
        return $this->executeQuery($sql, $parametros);
    }

    public function obtenerSuscripcionesCancelarModel() {
        $sql = "SELECT DISTINCT idsuscripcion FROM
                tmp_facturas_castigar tmp";

        return $this->executeQuery($sql);
    }

    /**
     * Permite obtener las facturas aprovisionadas 
     */
    public function obtenerFacturasRecalsificarModel() {
        $sql = "SELECT
                     DISTINCT
                     tmp.idsuscripcion
                    FROM
                     tmp_facturas_castigar tmp
                     INNER JOIN fac_factura fac ON fac.fac_ideorigen = tmp.idfactura
                     INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                    WHERE
                     doc.doc_tipo = 'PR' AND fac.fac_estado NOT IN ('C','E')";
        return $this->executeQuery($sql);
    }

    public function obtenerFacturasSinProvisionSuscripcionModel() {
        $sql = "SELECT DISTINCT
                        idsuscripcion,
                        fac.fac_ideregistro idfactura,
                        fac.fac_sdoreal saldo,
                        fac.fac_fecha fecha,
                        fac.uni_documento documento,
                        fac.cic_ideregistro ciclo,
                        fac.fac_ideorigen idOrigen,
                        fac.fac_idepadre idpadre
                FROM
                        tmp_facturas_castigar tmp
                INNER JOIN fac_factura fac ON tmp.idsuscripcion = fac.dsus_ideregistr
                WHERE fac.fac_estado = 'A'";
        return $this->executeQuery($sql);
    }

    public function obtenerFacturaSuscripcionCastigoMesFinalModel($idsuscripcion) {
        $sql = "SELECT
                        fac.dsus_ideregistr idsuscripcion,
                        fac.fac_ideregistro idfactura,
                        fac.fac_sdoreal saldo,
                        fac.fac_fecha fecha,
                        fac.uni_documento documento,
                        fac.cic_ideregistro ciclo,
                        fac.fac_ideorigen idOrigen,
                        fin_ideregistro idfinanciacion
                FROM
                        fac_factura fac
                INNER JOIN doc_documento doc ON fac.uni_documento = doc.uni_documento
                WHERE
                        fac.fac_sdoreal > 0
                AND fac.fac_estado = 'A'
                AND doc.doc_abreviatura NOT IN ('PR', 'RC', 'CC', 'RP')
                AND fac.fac_idepadre IS NULL
                AND dsus_ideregistr = $idsuscripcion";

        return $this->executeQuery($sql);
    }

    public function obtenerFacturaSuscripcionModel($idsuscripcion) {
        $sql = "SELECT distinct 
                            fac.dsus_ideregistr idsuscripcion,
                            fac.fac_ideregistro idfactura,
                            fac.fac_sdoreal saldo,
                            fac.fac_fecha fecha,
                            fac.uni_documento documento,
                            fac.cic_ideregistro ciclo
                    FROM
                            fac_factura fac
                    WHERE
                            fac.fac_sdoreal > 0
                            AND fac.fac_estado= 'A'
                    AND fac.fac_idepadre IS NULL
                    AND dsus_ideregistr = $idsuscripcion";

        return $this->executeQuery($sql);
    }

    public function obtenerFacturaSuscripcionSuspenderModel($idsuscripcion) {
        $sql = "SELECT distinct 
                            fac.dsus_ideregistr idsuscripcion
                    FROM
                            fac_factura fac  
                    WHERE fac.dsus_ideregistr = $idsuscripcion";

        return $this->executeQuery($sql);
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
     * Crear un detalle recaudo de provisión a la factura
     * @param type $detallefactura
     */
    public function crearDetalleReclasificacionModel($detallefactura) {
        $detallefactura['dfac_estado'] = 'A';
        $detallefactura['dfac_sdoreal'] = abs($detallefactura['dfac_sdoreal']) * -1;

        unset($detallefactura['dfac_ideregistr']);
        return $this->insertar($detallefactura, 'dfac_detfactura', 'sq_dfac_ideregistr');
    }

    /**
     * permite obtener las facturas que son de 25 meses o más en su edad, esta tabla contiene la información ya calculada

     */
    public function obtenerFacturasCastigoUltimaEtapaModel() {
        $sql = "SELECT
                        fac_ideregistro idfactura,
                        dsus_ideregistr idsuscripcion,
                        fin_ideregistro idfinanciacion
                FROM
                        fac_factura fac
                INNER JOIN doc_documento doc ON fac.uni_documento = doc.uni_documento
                WHERE
                        doc.doc_abreviatura NOT IN ('PR', 'RC', 'CC', 'RP')
                AND fac_estado = 'A'
                AND fac_sdoreal > 0
                AND dsus_ideregistr IN (
                        SELECT
                                idsuscripcion
                        FROM
                                tmp_facturas_castigar
                )";
        return $this->executeQuery($sql);
    }

    public function obtenerFacturasProvisionarUltimaEtapaModel($idsuscripcion = null) {
        $complemento = '';
        if (!empty($idsuscripcion)) {
            $complemento = " AND  tmp.idsuscripcion = $idsuscripcion";
        }

        $sql = "SELECT
                        tmp.*, fac.fac_ideregistro idprovision
                FROM
                        tmp_facturas_castigar tmp
                INNER JOIN fac_factura fac ON fac.fac_ideorigen = tmp.idfactura
                INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                WHERE
                fac.fin_ideregistro IS NULL
                AND fac.fac_estado = 'P'
                AND doc.doc_abreviatura = 'PR' $complemento ";
        return $this->executeQuery($sql);
    }

    /**
     * obtener el saldo real de la provisión para castigar
     * @param int $idfactura identificador de la factura
     * @return int 
     */
    public function obtenerSaldoRealProvisionFinanciacion($idfactura) {
        $sql = "SELECT
                        SUM (fac.fac_sdoreal) saldo
                FROM
                        fac_factura fac
                WHERE
                        fac.fac_ideorigen = :idfactura
                AND fac.fac_estado='P'";
        $parametros['idfactura'] = $idfactura;
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            $respuesta["saldo"] = 0;
            return $respuesta;
        }
        return $respuesta[0];
    }

    public function obtenerSaldoRealProvision($idfactura) {
        $sql = "SELECT
                        facOriginal.fac_sdoreal - SUM (fac.fac_sdoreal) saldo
                FROM
                        fac_factura fac
                INNER JOIN ddot_detdoctipo ddot ON ddot.uni_documento = fac.uni_documento
                INNER JOIN fac_factura facOriginal ON facOriginal.fac_ideregistro = fac.fac_ideorigen
                WHERE
                        fac.fac_ideorigen = :idfactura
                AND ddot.ddot_tipo = 'PR'
                GROUP BY
                        facOriginal.fac_sdoreal";
        $parametros['idfactura'] = $idfactura;
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            $respuesta["saldo"] = 0;
            return $respuesta;
        }
        return $respuesta[0];
    }

    /**
     * permite construir una nota cancelando la factura actual 
     * @param fac_factura $factura objeto de tipo fac_factura para creación de nota
     */
    public function generarNotaFacturaModel($factura) {
        $factura['fac_version'] = 1;
        return $this->insertar($factura, 'fac_factura', 'sq_fac_ideregistro');
    }

    /**
     * permite construir una nota cancelando el detalle de factura actual 
     * @param dfac_detfactura $detalleFactura objeto de tipo dfac_detfactura para creación de nota
     */
    public function generarNotaDetalleFacturaModel($detalleFactura) {
        $this->insertar($detalleFactura, 'dfac_detfactura', 'sq_dfac_ideregistr');
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
     * Cancela un detalle de suspension actualizando su estado a "C"
     * @param int $idSuspension id del detalle de suspension a actualizar
     * @return int numero de filas afectadas despues de la actualizacion
     */
    public function cancelarSuspension($idSuspension, $idusuario) {
        $data["ssp_ideregistro"] = $idSuspension;
        $data["ssp_estado"] = "C";
        $data["usu_ideregistro"] = $idusuario;
        $resultado = $this->actualizar($data, "ssp_suspension", "ssp_ideregistro = :ssp_ideregistro");
        return $resultado;
    }

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
    // <editor-fold desc="tabla temporal">

    public function CrearTablaLogModel() {

        $sql = 'DROP TABLE IF EXISTS tmp_log_carteracastigada;';
        $this->executeQuery($sql);

        $sqlTabla = "CREATE TABLE tmp_log_carteracastigada (
                        descripcion text,
                        programa   character varying,
                        estado character varying NOT NULL,
                        suscripcion character varying,
                        filasafectadas int,
                        fecha date) ";
        $this->executeQuery($sqlTabla);
    }

    /**
     * permite insertar un nuevo registro en el modelo
     * @param stirng $descripcion descrpcion
     * @param string $programa nombre programa
     * @param char $estado  estado de programa
     * @param string $suscripcion municipios
     */
    public function InsertarLogModel($descripcion, $programa, $estado, $suscripcion, $filasAfectadas = 0) {

        if (strlen($descripcion) >= 255) {
            $descripcion = substr($descripcion, 0, 250) . " ...";
        }

        if (empty($filasAfectadas)) {
            $filasAfectadas = 0;
        }
        $sql = "INSERT INTO tmp_log_carteracastigada (descripcion,programa,estado,suscripcion,fecha,filasafectadas)
                values ('$descripcion','$programa','$estado','$suscripcion', 'now()', $filasAfectadas)";
        return $this->executeQuery($sql);
    }

    public function ObtenerEstado($idEmpresa) {
        try {
            $sql = "(SELECT
                        *,
                        1 :: BIGINT filasafectadas
                      FROM tmp_log_carteracastigada_$idEmpresa
                      WHERE estado = 'F'
                      ORDER BY  programa)
                     UNION
                     (
                       SELECT
                         0 :: BIGINT                                            idsuscripcion,
                         0 :: BIGINT                                            idfactura,
                         0 :: BIGINT                                            idfinanciacion,
                         tmp.programa                                           programa,
                         tmp.estado                                             estado,
                         'Proceso ejecutado correctamente' :: TEXT              descripcion,
                         tmp.usu_ideregistro                                    usu_ideregistro,
                         (SELECT min(fecha)
                          FROM tmp_log_carteracastigada_$idEmpresa tp
                          WHERE tp.estado = 'G' AND tp.programa = tmp.programa) fecha,
                         count(*)                                               filasafectadas

                       FROM tmp_log_carteracastigada_$idEmpresa tmp
                       WHERE tmp.estado = 'G'
                       GROUP BY tmp.programa, tmp.usu_ideregistro, tmp.estado
                       ORDER BY tmp.programa)";
            return $this->executeQuery($sql);
        } catch (MyException $e) {
            
        }
    }

    /**
     * permite actualizar el proceso 
     * @param int $idprograma identifica el código del programa
     * @param int $cantfilasafectadas ingresar la cantidad de filas afectadas
     */
    public function actualizarFilasAfectadasProcesoModel($idprograma, $cantfilasafectadas) {
        $sql = "UPDATE cpr_ctrproceso
		SET cpr_canregistro = $cantfilasafectadas
                where cpr_ideregistro = $idprograma
		and cpr_estado = 'A'";
        $this->executeQuery($sql);
    }

    public function consultarProcesoPorEmpresaEstadoPrograma($idPrograma, $idEmpresa) {
        $parametros['idEmpresa'] = $idEmpresa;
        $parametros['idPrograma'] = $idPrograma;
        $sql = "SELECT
                        cpr_ideregistro idproceso,
                        cpr_fecinicio fechainicio,
                        cpr_canregistro numeroregistrosprocesados,
                        usu.usuario_nom usuario,
                        cpr_estado estado,
                        cpr_fecfinal fechafinal
                FROM
                        cpr_ctrproceso cpr
                INNER JOIN acc_acceso acc ON cpr.acc_ideregistro = acc.acc_ideregistro
                INNER JOIN usuarios usu ON acc.usu_ideregistro = usu.usu_ideregistro
                WHERE
                        cpr.emp_ideregistro =:idEmpresa
                AND cpr.prg_ideregistro =:idPrograma
                ORDER BY
                        fechafinal DESC
                LIMIT 1";
        $this->setSql($sql);
        $this->setParams($parametros);
        $resultado = $this->execute();
        $datos = array();
        if (count($resultado) > 0) {
            $datos['idProceso'] = $resultado[0]['idproceso'];
            $datos['fechaInicio'] = $resultado[0]['fechainicio'];
            $datos['numeroRegistrosProcesados'] = $resultado[0]['numeroregistrosprocesados'];
            $datos['usuario'] = $resultado[0]['usuario'];
            $datos['estado'] = $resultado[0]['estado'];
            $datos['fechafinal'] = $resultado[0]['fechafinal'];
        }
        return $datos;
    }

    /**
     * Actualiza el proceso en estado finalizado
     * @param int $idControlProceso identificador del proceso.
     * @return array 
     */
    public function finalizarProcesoModel($idControlProceso, $idusuario) {
        $sql = "UPDATE cpr_ctrproceso
            SET cpr_fecfinal = 'now()',
             cpr_estado = 'I',
             usu_ideregistro = $idusuario
            WHERE
                    cpr_ideregistro = $idControlProceso;";
        return $this->executeQuery($sql);
    }

    /**
     * Ingresa una nueva suspensión
     * @param array $data información de la suspensión.
     * @return int identificador de la nueva suspensión.
     */
    public function crearSuspension($idSuscripcion, $idPropiedad, $fechaGen, $fechaApro, $fechaPro, $observaciones, $idCiclo, $idperiodo, $cicloano, $idusuario) {
        $data["syr_estado"] = 'A';
        $data["syr_fecha"] = $fechaGen;
        if (!empty($fechaApro)) {
            $data["syr_fecaprobac"] = $fechaApro;
        }
        if (!empty($fechaPro)) {
            $data["syr_fecprocesad"] = $fechaPro;
        }
        $data["syr_observacion"] = $observaciones;
        $data["dsus_ideregistr"] = $idSuscripcion;
        $data["pro_ideregistro"] = $idPropiedad;
        $data["cic_ideregistro"] = $idCiclo;
        $data["per_ideregistro"] = $idperiodo;
        $data["cic_ano"] = $cicloano;
        $data["usu_ideregistro"] = $idusuario;
        return $this->insertar($data, "syr_susreconex", "sq_syr_ideregistro");
    }

    /**
     * Genera un nuevo detalle de suspensión.
     * @param array $data Información del detalle
     * @return int identificador de la suspensión.
     */
    public function crearNuevoDetalleSuspension($fechaProg, $fechaEjec, $lectura, $observacion, $motivo, $idNovedad, $idTipo, $idSuspension, $idTercero, $fechaApro, $idConcepto, $valorTotal, $idusuario, $idempresa) {
        $data["ssp_estado"] = "A";
        $data["ssp_fecha"] = "now()";
        $data["ssp_realizada"] = "N";
        if (!empty($fechaProg)) {
            $data["ssp_fecprgsuspe"] = $fechaProg;
        }
        if (!empty($fechaEjec)) {
            $data["ssp_fecejesuspe"] = $fechaEjec;
        }
        if (!empty($lectura)) {
            $data["ssp_lectura"] = $lectura;
        }
        if (!empty($observacion)) {
            $data["ssp_observacion"] = $observacion;
        }
        if (!empty($motivo)) {
            $data["uni_motsuspen"] = $motivo;
        }
        if (!empty($idNovedad)) {
            $data["uni_novsuspen"] = $idNovedad;
        }
        if (!empty($idTipo)) {
            $data["uni_tipsuspen"] = $idTipo;
        }
        if (!empty($idSuspension)) {
            $data["syr_ideregistro"] = $idSuspension;
        }
        if (!empty($idTercero)) {
            $data["ter_ejesuspens"] = $idTercero;
        }
        if (!empty($fechaApro)) {
            $data["ssp_fecaprobac"] = $fechaApro;
        }
        if (!empty($idConcepto)) {
            $data["uni_concepto"] = $idConcepto;
        }
        if (!empty($valorTotal)) {
            $data["ssp_vlrtotal"] = $valorTotal;
        }
        $data["usu_ideregistro"] = $idusuario;
        $data["emp_ideregistro"] = $idempresa;
        return $this->insertar($data, "ssp_suspension", "sq_ssp_ideregistro");
    }

    /**
     * metodo para colocar en estado c las suspensiones no ejecutadas anteriores al registro de una nueva suspension
     * @param int $idRegistroDetalle id del registro al que se le debe aplicar el estado C
     * @param int $idDetalle id de la suspension que se escluye del estado C
     * @return int numero de filas afectadas
     */
    public function alterEliminarDetalleSuspension($idRegistroDetalle, $idDetalle, $idusuario) {
        $data["ssp_ideregistro"] = $idRegistroDetalle;
        $data["ssp_feceliminacion"] = "now()";
        $data["ssp_estado"] = "C";
        $data["usu_ideregistro"] = $idusuario;
        $resultado = $this->actualizar($data, "ssp_suspension", "ssp_ideregistro = :ssp_ideregistro AND ssp_ideregistro <> " . $idDetalle . " AND ssp_fecejesuspe IS NULL");
        return $resultado;
    }

    //</editor-fold>
}
