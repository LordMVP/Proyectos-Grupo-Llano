<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Description of ModificarLecturaModel
 *
 * @author Lord_Nightmare
 */
class ModificarLecturaModel extends AuditoriaServices {

    /**
     *
     * @var SessionInterface
     */
    private $sesion;

    /**
     * constructor de la clase
     */
    public function __construct(&$conexion, &$sesion = null) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
    }

    /**
     * Permite obtener el listado de lecturas suscritas a una subscripcion especifica
     * @param int $idsuscripcion identificador de suscripcion
     * @param string $codigoAnterior codigo anterior
     * @param string $documento documento de identidad
     * @return type
     */
    public function getSuscripciones($idsuscripcion, $codigoAnterior, $documento) {
        $complemento = '';
        $parametros['idusuario'] = $this->sesion->get('idusuario');
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        if (!empty($idsuscripcion)) {
            $complemento = ' and dsus.dsus_ideregistr = :idsuscripcion';
            $parametros['idsuscripcion'] = $idsuscripcion;
        }
        if (!empty($codigoAnterior)) {
            $complemento = ' and dsus.dsus_pcodigo =:codigoanterior';
            $parametros['codigoanterior'] = $codigoAnterior;
        }
        if (!empty($documento)) {
            $complemento = ' and ter.ter_documento = :documento';
            $parametros['documento'] = $documento;
        }
        $sql = "select distinct ter_nomcompleto nombre, ter_documento documento, dsus.dsus_ideregistr idsuscripcion, dsus.dsus_estado estado, dsus_pcodigo codigoanterior, uni.uni_nombre1 tipouso, 
                     pro.pro_idepropieda idmedidor, pro.pro_descripcion descripcionmedidor, cic.cic_ideregistro idciclo,per.per_ideregistro idperiodo,
                     per.per_nombre periodo, cic.cic_nombre ciclo, cic.cic_nombre || ' ' || per.per_nombre cicloperiodo,
                     pro.pro_ideregistro idpropiedad, dsus.uni_tipusosuscr idetipouso
                from sus_suscripcion sus
                    inner join  ter_tercero ter on sus.ter_ideregistro = ter.ter_ideregistro
                    inner join dsus_detsuscrip dsus on  sus.sus_ideregistro = dsus.sus_ideregistro
                    inner join uni_unidad uni on uni.uni_ideregistro = dsus.uni_tipusosuscr  
                    inner join pro_propiedad pro on pro.pro_ideregistro = dsus.pro_ideregistro
                    inner join cic_ciclo cic on dsus.cic_ideregistro=cic.cic_ideregistro
                    inner join per_periodo per on per.cic_ideregistro=dsus.cic_ideregistro
                    inner join uspr_usuprgpryto uspr on dsus.uni_municipio=uspr.uni_municipio
		Where per.per_estado='A' and dsus.dsus_estado not in ('E','P')  and uspr.usu_ideregistro=:idusuario and dsus.emp_ideregistro=:idempresa " . $complemento;
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Obtiene el registro de lectura actual de una suscripcion
     * @param int $suscripcion id de la suscripcion a consultar
     * @return array informacion de la lectura actual de la suscripcion
     */
    public function obtenerLecturaActual($suscripcion) {
        $parametros['idsuscripcion'] = $suscripcion;
        $sql = "SELECT
                    lec.lec_ideregistro idlecturaencabezado,
                    lec.lec_fecha :: DATE fecha
                FROM
                    lec_lectura lec
                WHERE
                    lec_estado IN ('A','G')
                AND dsus_ideregistr = :idsuscripcion;";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta el id de la lectura actual cuyo estado fue modificado a R para
     * la modificacion de lectura
     * @param int $suscripcion id de la suscripcion
     * @return informacion de la lectura actual modificada
     */
    public function obtenerLecturaActualModificada($suscripcion) {
        $parametros['idsuscripcion'] = $suscripcion;
        $sql = "SELECT
                    lec.lec_ideregistro idlecturaencabezado,
                    lec.lec_fecha :: DATE fecha
                FROM
                    lec_lectura lec
                WHERE
                    lec_estado = 'T'
                AND dsus_ideregistr = :idsuscripcion;";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta el ciclo y el periodo anterior de la suscripcion para consultar
     * la lectura anterior
     * @param int $idCiclo id del ciclo actual de la suscripcion
     * @param int $idPeriodo id del periodo actual de la suscripcion
     * @return array informacion del ciclo periodo anterior de la suscripcion
     */
    
    public function obtenerCicloPeriodoAnteriorSuscripcion($idCiclo, $idPeriodo, $orden) {
        $parametros['idciclo'] = $idCiclo;
        $parametros['idperiodo'] = $idPeriodo;
        $sql = '';
        if ($orden == 1) {
            $sql = "SELECT
                    per.per_ideregistro idperiodo,
                    per.cic_ideregistro idciclo
                FROM
                    per_periodo per
                WHERE
                    per.cic_ideregistro = :idciclo
                AND per.per_ideorden = 12 
                and per.per_estado='C'
                order by per_ideregistro desc limit 1 ";
        } else {
            $sql = "SELECT
                    per.per_ideregistro idperiodo,
                    per.cic_ideregistro idciclo
                FROM
                    per_periodo per
                WHERE
                    per.cic_ideregistro = :idciclo
                AND per.per_ideorden IN(
                    SELECT
                        per2.per_ideorden - 1
                    FROM
                        per_periodo per2
                    WHERE
                        per2.per_ideregistro = :idperiodo
                )  and per.per_estado='C'
                   order by per_ideregistro desc limit 1 ";
        }

        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta la informacion de la lectura anterior de la suscripcion
     * @param int $idSuscripcion id de la suscripcion
     * @param int $idPeriodo id del periodo anterior de la suscripcion
     * @param int $idCiclo id del ciclo anterior de la suscripcion
     * @return array informacion de la lectura anterior de una suscripcion
     */
    public function obtenerLecturaAnterior($idSuscripcion, $idPeriodo, $idCiclo, $estado) {

        $sql = "SELECT
                        lec.lec_ideregistro idlecturaencabezado,
                        lec.lec_fecha :: DATE fecha,
                        lec.lec_estado estado
                FROM
                        lec_lectura lec
                WHERE
                        lec.lec_estado = '$estado'
                AND lec.dsus_ideregistr = $idSuscripcion
                AND lec.cic_ideregistro = $idCiclo
                AND lec.per_ideregistro = $idPeriodo
                ORDER BY
                        lec.lec_fecha DESC
                LIMIT 1";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Modifica el estado de una lectura para su modificacion
     * @param int $idLectura id de la lectura a la cual se le cambiara el estado
     * @param string $estado valor del estado que se cambiara a la lectura
     * @return int numero de registros afectados por la actualizacion
     */
    public function cambiarEstadoLectura($idLectura, $estado) {
        $data['lec_estado'] = $estado;
        $data['lec_ideregistro'] = $idLectura;
        $resultado = $this->actualizar($data, 'lec_lectura', 'lec_ideregistro = :lec_ideregistro');
        return $resultado;
    }

    /**
     * Consulta los motivos de las notas que se usaran para el proceso de 
     * modificar una lectura
     * @param int $idPrograma id del programa al que pertenecen los motivos de 
     * las notas
     * @return array informacion de las notas para el programa y el usuario
     */
    public function consultarMotivosNota($idPrograma) {
        /* $parametros['idprograma'] = $idPrograma;
          $parametros['idusuario'] = $this->sesion->get('idusuario');
          $sql = 'SELECT
          uni.uni_ideregistro id,
          mono.mono_nombre nombre
          FROM
          uni_unidad uni
          INNER JOIN mono_motnota mono
          ON uni.uni_ideregistro = mono.uni_motnota
          INNER JOIN prun_prgunidad prun
          ON uni.uni_ideregistro = prun.uni_ideregistro
          INNER JOIN uspr_usuprgpryto uspr
          ON prun.prg_ideregistro = uspr.prg_ideregistro
          WHERE
          uspr.usu_ideregistro = :idusuario
          AND uspr.prg_ideregistro = :idprograma;'; */
        $sql = 'SELECT
                    mono.uni_motnota id,
                    mono.mono_nombre nombre
                FROM
                    mono_motnota mono
                ORDER BY nombre;';
        //$resultado = $this->executeQuery($sql, $parametros);
        $resultado = $this->executeQuery($sql);
        return $resultado;
    }

    /**
     * Consulta la informacion de un encabezado de lectura
     * @param int $idLectura id del encabezado de lectura a consultar
     * @return array informacion del encabezado de la lectura
     */
    public function consultarInformacionLectura($idLectura) {
        $parametros['idlectura'] = $idLectura;
        $sql = 'select
                lec.lec_ideregistro idlecturaencabezado,
                lec.lec_fecha :: date fecha,
                lec.lec_fecaprobac ::date fechaaprobacion,
                lec.lec_anterior lecturaanterior,
                lec.lec_actual lecturaactual,
                lec.lec_consumo consumo,
                lec.lec_observacion observaciones,
                lec.lec_conpromedio consumopromedio,    
                lec.dsus_factor factorcorreccion,
                lec.pro_digitos digitos,
                lec.lec_estado estado,
                lec.cic_ideregistro idciclolectura,
                lec.per_ideregistro idperiodolectura,
                lec.cic_ano aniolectura,
                lec.lec_estado estado,
                lec.dlec_ideregistr iddetallelectura
            from
                lec_lectura lec
            where
                lec_ideregistro = :idlectura';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Actualiza la informacion del encabezado de lectura
     * @param array $encabezado informacion del encabezado
     * @return numero de filas afectadas
     */
    public function actualizarEncabezadoLectura($encabezado) {
        if ($encabezado['estado']=='G'){
            $data['lec_estado'] = 'A';
        }
        $idlectura = $encabezado['idlecturaencabezado'];
        $data['lec_anterior'] = $encabezado['lecturaanterior'];
        $data['lec_actual'] = $encabezado['lecturaactual'];
        $data['lec_consumo'] = $encabezado['consumo'];
        $data['lec_observacion'] = $encabezado['observaciones'];
        $data['lec_conpromedio'] = $encabezado['consumopromedio'];
        $data['dsus_factor'] = $encabezado['factorcorreccion'];
        $data['usu_ideregistro'] = $this->sesion->get('idusuario');
        return $this->actualizar($data, "lec_lectura", "lec_ideregistro = $idlectura");
    }

    /**
     * Consulta los detalles de las lecturas dependiendo del encabezado.
     * @param int $idLecturaEncabezado identificador del encabezado.
     */
    public function detalleLectura($idLecturaEncabezado) {
        $parametros['idlecturaencabezado'] = $idLecturaEncabezado;
        $sql = "SELECT dlec_ideregistr iddetallelectura, dlec_estado estado, 
                    dlec_fecha::date fecha, dlec_fecprogram fechaprograma,
                    dlec_fecaprobac fechaaprobacion,   dlec_lecreal lecturareal,
                    dlec_actual lecturaactual, dlec_consumo consumo, 
                    dlec_fecejecuta fechaejecuta, dlec_observacio observacion, 
                    ter_ideejecuta idempresalectura, lec_ideregistro idencabezadolectura, 
                    lec_anterior lecturaanterior , dlec.uni_anolectura  idanomalia, 
                    dlec.uni_novlectura idnovedad, emp_ideregistro idempresa,
                    nole.nole_nombre novedad,anle.anle_nombre anomalia,
                    ter.ter_nomcompleto empresalectura, dlec.dlec_realizada ejecutado
               FROM 
                    dlec_detlectura dlec left join nole_novlectura nole on dlec.uni_novlectura=nole.uni_novlectura
                    left join anle_anolectura anle on anle.uni_anolectura=dlec.uni_anolectura
                    left join ter_tercero ter on dlec.ter_ideejecuta=ter.ter_ideregistro
               WHERE
                    dlec.lec_ideregistro=:idlecturaencabezado and dlec.dlec_estado IN ('A', 'M','P')
               ORDER BY dlec.dlec_ideregistr";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Crea un nuevo registro en la tabla not_nota al momento de modificar
     * una lectura
     * @param array $parametros parametros de la nota de condonacion
     * @return int id de registro de la nota de condonacion
     */
    public function registrarNotaModificacion($parametros) {
        $data["not_fecha"] = "now()";
        $data["not_comentario"] = $parametros["descripcion"];
        $data["uni_motnota"] = $parametros["idmotivo"];
        $data["dsus_ideregistr"] = $parametros["idsuscripcion"];
        $data["cic_ideregistro"] = $parametros["idciclo"];
        $data["per_ideregistro"] = $parametros["idperiodo"];
        $data["est_motnota"] = ESTRUCTURA_NOTA;
        $data["emp_ideregistro"] = $this->sesion->get("idempresa");
        $data["cic_ano"] = $parametros["cicanio"];
        $data["usu_ideregistro"] = $this->sesion->get("idusuario");
        return $this->insertar($data, "not_nota", "sq_not_ideregistro");
    }

    /**
     * Permite afectar la tabla nofa para enlazar las facturas con las notas
     * @param array $infofactura informacion de la nota
     */
    public function crearNotaModel($infofactura) {
        $parametros['not_ideregistro'] = $infofactura['idnota'];
        $parametros['fac_ideregistro'] = $infofactura['idfacturanota'];
        $parametros['dfac_ideregistr'] = $infofactura['iddetallefacturanota'];
        $parametros['fac_ideorigen'] = $infofactura['idfacturaoriginal'];
        $parametros['dfac_ideorigen'] = $infofactura['iddetallefacturaoriginal'];
        $parametros['usu_ideregistro'] = $infofactura['idusuario'];
        return $this->insertar($parametros, 'nofa_notfactura', 'sq_nofa_ideregistr');
    }

    public function modificarEncabezadoLectura($parametros) {
        $data['lec_ideregistro'] = $parametros['idencabezadolectura'];
        $data['lec_anterior'] = $parametros['lecturaanterior'];
        $data['lec_actual'] = $parametros['lecturaactual'];
        $data['lec_consumo'] = $parametros['consumo'];
        $data['lec_conpromedio'] = $parametros['consumopromedio'];
        $data['dsus_factor'] = $parametros['factorcorrecion'];
        $data['lec_observacion'] = $parametros['observaciones'];
        return $this->actualizar($data, 'lec_lectura', 'lec_ideregistro = :lec_ideregistro');
    }

    /**
     * Consulta la liquidacion de una suscripcion para obtener los conceptos
     * relacionados a la liquidacion
     * @param int $idSuscripcion id de la suscripcion a consultar
     * @return array informacion de la liquidacion
     */
    public function consultarLiquidacionSuscripcion($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = 'select
                    dsus.uni_liquidacion idliquidacion
		from
                    dsus_detsuscrip dsus
		where
                    dsus.dsus_ideregistr = :idsuscripcion';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    /**
     * Consulta la informacion de los conceptos de una liquidacion
     * @param int $idLiquidacion
     * @return array informacion de los conceptos de la liquidacion
     */
    public function consultarConceptosLiquidacion($idLiquidacion) {
        $parametros['idliquidacion'] = $idLiquidacion;
        $sql = 'SELECT
                    con.uni_concepto idconcepto
                FROM
                    con_concepto con
                    INNER JOIN coli_conliquida coli
                on con.uni_concepto = coli.uni_concepto
                WHERE
                    coli.uni_liquidacion = :idliquidacion;';
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta la informacion de la factura segun la informacion del encabezado
     * de la lectura 
     * @param type $idSuscripcion id de la suscripcion de la lectura
     * @param type $cicloLectura id del ciclo del encabezado de la lectura
     * de la suscripcion
     * @param type $periodoLectura id del periodo del encabezado de la lectura
     * de la suscripcion
     * @param type $anioLectura año del encabezado de la lectura
     * @return array informacion de la factura para
     */
    public function consultarFacuraCicloPeriodo($idSuscripcion, $cicloLectura, $periodoLectura, $anioLectura, $idLiquidacion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['ciclolectura'] = $cicloLectura;
        $parametros['periodolectura'] = $periodoLectura;
        $parametros['aniolectura'] = $anioLectura;
        $parametros['idliquidacion'] = $idLiquidacion;
        $sql = "SELECT
                    fac.fac_ideregistro idfactura,
                    fac.fac_numero numero
                FROM
                    fac_factura fac
                WHERE
                    fac.dsus_ideregistr = :idsuscripcion
                AND fac.uni_liquidacion = :idliquidacion
                AND fac.fac_idepadre IS NULL AND fac.fac_estado = 'A'
                AND fac.per_ideregistro = :periodolectura
                AND fac.cic_ideregistro = :ciclolectura
                AND fac.cic_ano = :aniolectura";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }
    
    public function consultaDetalleLecturaEstadoP($encabezado){
        $parametros['dlec_estado'] = "P" ; 
        $parametros['idlectura'] = $encabezado['idlecturaencabezado'] ;      
        $sql="SELECT dlec_ideregistr iddetallelectura FROM dlec_detlectura WHERE  lec_ideregistro =:idlectura and dlec_estado =:dlec_estado";       
        $resultado = $this->executeQuery($sql,$parametros);
        return $resultado;
    }
    
    public function actualizaDetalleAsignadoAlEncabezado($iddetallelectura,$encabezado){
        $data['dlec_ideregistr'] = $iddetallelectura;
        $data['dlec_estado'] = "P";
        $data['dlec_actual'] = $encabezado['lecturaactual'];
        $data['dlec_consumo'] = $encabezado['consumo'];
        $data['usu_ideregistro'] = $encabezado['idusuario'];
        return $this->actualizar($data, 'dlec_detlectura', 'dlec_ideregistr =:dlec_ideregistr');
    }
    
    public function getFactura($idsuscripcion, $idperiodo) {
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $parametros['idsuscripcion'] = $idsuscripcion;
        $parametros['idperiodo'] = $idperiodo;
        $sql = "select fac_estado, uni_tipusosuscr from fac_factura where dsus_ideregistr = :idsuscripcion and per_ideregistro = :idperiodo and  uni_documento = 24 and fac_ideorigen is null  and emp_ideregistro = :idempresa";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

}
