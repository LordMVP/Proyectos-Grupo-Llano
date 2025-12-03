<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Externo\FinanciacionesBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\MyException;
use const CLASE_PRODUCTO_FINANCIERO_EXTERNO;

/**
 * Description of FinanciacionExternoModel
 *
 * @author god
 */
class ContratoExternoModel extends AuditoriaServices {

    /**
     * Información del usuario que está en el sistema
     * @var array (
     *              idacceso,idusuario,cedula,
     *              usuario,idempresa,empresa,
     *              idperfil
     *            )
     */
    private $sesion;

    /**
     * 
     * @param Connection $conexion
     * @param array $sesion Información de la sesión 
     */
    public function __construct($conexion, $sesion) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
    }

    public function buscarFirmas($idfirmas) {
        $sql = "SELECT
                        ven.ven_numero,
                        ven.ven_ideregistro idregistro,
                        cofi.ter_ideregistro idfirma,
                        ven.ven_numcontrato numcontrato,
                        ter.ter_nomcompleto nombreTercero,
                        ven.ven_vlrreal valor,
                        ven.ven_fecha fecha,
                        coalesce(maximo.maximonumcontrato, 0) maximonumcontrato
                    FROM ven_venta ven
                        INNER JOIN cofi_comfirmains cofi ON ven.cofi_ideregistr = cofi.cofi_ideregistr
                        INNER JOIN ter_tercero ter ON ter.ter_ideregistro = cofi.ter_ideregistro
                        LEFT JOIN (SELECT ven.cofi_ideregistr, MAX(ven.ven_numcontrato) maximonumcontrato
                    FROM ven_venta ven GROUP BY ven.cofi_ideregistr) as maximo ON cofi.cofi_ideregistr = maximo.cofi_ideregistr
                    WHERE
                        cofi.ter_ideregistro IN (:idsfirmas)
                        AND ven.ven_estado IN ('F','A')
                        AND ven.ven_tipo = 'C'
                        AND ven.ven_numcontrato = 0 
                    ORDER BY idfirma, fecha LIMIT 1
                    ";

        return $this->executeQuery($sql, array(
                    'idsfirmas' => $idfirmas,
        ));
    }

    public function consultarContratos($idfirmas, $numMaximoContratoActual) {
        $sql = "SELECT
                    ter.ter_nomcompleto nombrefirma,
                    ter.ter_documento nitfirma,
                    ven.ven_numcontrato numerocontrato,
                    sum(ven.ven_vlrreal) valorcontrato
                FROM ven_venta ven
                    INNER JOIN cofi_comfirmains cofi on ven.cofi_ideregistr = cofi.cofi_ideregistr
                    INNER JOIN ter_tercero ter ON ter.ter_ideregistro = cofi.ter_ideregistro
                WHERE
                    cofi.ter_ideregistro IN (:idfirmas) 
                    AND ven.ven_numcontrato > :numerocontrato 
                    GROUP BY ter.ter_nomcompleto, ter.ter_documento, ven.ven_numcontrato 
                    ORDER BY ven.ven_numcontrato DESC";

        return $this->executeQuery($sql, array(
                    "idfirmas" => $idfirmas,
                    "numerocontrato" => $numMaximoContratoActual
        ));
    }

    public function ejecutarContrato($idfirmas, $max) {
        $sql = "UPDATE ven_venta
                    SET ven_numcontrato = info.numcontrato
                    FROM (
                        SELECT :max + (DENSE_RANK()
                            OVER (
                              ORDER BY dato.ven_fecha, dato.idre)) numcontrato, *
                              from (SELECT div((row_number()
                                  over (
                                    partition by ven.cofi_ideregistr, ven.ven_fecha :: DATE)), 5.5) idre,
                                           (to_char(ven.ven_fecha, 'YYYYMMDD')) :: integer,
                                           ven.cofi_ideregistr,
                                           ven.ven_fecha :: DATE,
                                           ven.ven_ideregistro
                                    FROM ven_venta ven
                                    INNER JOIN cofi_comfirmains comfirmain on ven.cofi_ideregistr = comfirmain.cofi_ideregistr
                                    INNER JOIN ter_tercero ter ON ter.ter_ideregistro = comfirmain.ter_ideregistro
                                    WHERE
                                        comfirmain.ter_ideregistro IN (:idfirmas)
                                      AND ven.ven_tipo = 'C'
                                      AND ven.ven_fecha :: DATE > '2018-09-01'
                                      AND coalesce(ven.ven_numcontrato, 0) = 0) dato
                              order by dato.ven_fecha) as info
                    WHERE ven_venta.ven_ideregistro = info.ven_ideregistro;";
        return $this->executeQuery($sql, array(
                    'max' => $max,
                    'idfirmas' => $idfirmas,
        ));
    }

    /**
     * Consulta todos los productos financierons que tiene 
     * la empresa de sesión 
     * @return array  Lista de productos
     * 
     * - Agrupar por idfirma.
     * - Agrupar por el día.
     * - Realizar grupos de 5 y actualizar el numfirma dependiendo eso.
     */
//    public function ejecutarContratos($idfirmas) {
//        $sql = "UPDATE ven_venta
//                SET ven_numcontrato = infofirmas.numerocontrato
//                FROM (
//                    SELECT
//                        cofi.cofi_ideregistr idfirma,
//                        max(coalesce(ven.ven_numcontrato, 0)) + 1 numerocontrato
//                    FROM ven_venta ven
//                    INNER JOIN cofi_comfirmains cofi ON ven.cofi_ideregistr = cofi.cofi_ideregistr
//                    WHERE
//                        cofi.ter_ideregistro IN (:idsfirmas)
//                    AND ven.ven_estado = 'F'
//                    AND ven.ven_tipo = 'C'
//                    GROUP BY cofi.cofi_ideregistr
//                ) as infofirmas
//                WHERE ven_venta.cofi_ideregistr = infofirmas.idfirma
//                AND ven_venta.ven_estado = 'F'
//                AND ven_venta.ven_tipo = 'C'
//                AND coalesce(ven_venta.ven_numcontrato, 0) = 0
//                RETURNING ven_ideregistro as idventa;";
//        return $this->executeQuery($sql, array(
//                    'idsfirmas' => $idfirmas,
//        ));
//    }
}
