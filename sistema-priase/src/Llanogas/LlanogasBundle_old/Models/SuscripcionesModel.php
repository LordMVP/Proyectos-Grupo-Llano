<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * Consultas genericas del sistema.
 *
 * @author hrey
 */
class SuscripcionesModel extends AuditoriaServices {

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     * @param \Doctrine\DBAL\Connection $sesion
     */
    public function __construct(&$conexion, $sesion) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
    }

    /**
     *  Filtra un suscriptor dependiendo de los parámetros de búsqueda.
     * @param int $idSuscriptor identificador del suscriptor
     * @param string $cedula cedula y/o nit 
     * @param int $idTercero identificador del tercero
     * @param string $idUsuario identificación del usuaro
     * @return array Listado de suscriptores
     */
    public function filtrarSuscriptor($idSuscriptor, $cedula, $idTercero, $idUsuario) {
        $complemento = '';
        $parametros['idusuario'] = $idUsuario;
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        if (is_numeric($idSuscriptor)) {
            $complemento .= ' AND sus.sus_ideregistro=:idsuscriptor ';
            $parametros['idsuscriptor'] = $idSuscriptor;
        }
        if (!empty($cedula)) {
            $complemento .= ' AND ter.ter_documento=:cedula';
            $parametros['cedula'] = $cedula;
        }
        if (is_numeric($idTercero)) {
            $complemento .= ' AND ter.ter_ideregistro=:idtercero';
            $parametros['idtercero'] = $idTercero;
        }
        $sql = 'select
                    distinct
                    ter.ter_documento cedula,ter.ter_nomcompleto nombretercero, ter.ter_ideregistro idtercero,
                    ter.ter_telfijo telefonofijo, ter.ter_telcelular telefonocelular,
                    sus.sus_ideregistro idsuscriptor, cnre.cnre_nombre convenio,sus.cnre_ideregistr idconvenio,
                    sus.sus_descripcion descripcion
                from 
                    ter_tercero ter inner join sus_suscripcion sus on ter.ter_ideregistro=sus.ter_ideregistro
                    inner join dicn_disconven dicn on sus.cnre_ideregistr=dicn.cnre_ideregistr
                    inner join cnre_cnvrecaudo cnre on dicn.cnre_ideregistr=cnre.cnre_ideregistr
                  
                where
                    dicn.emp_ideregistro=:idempresa  '
                . $complemento;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta las propiedades que no estan asigandas a una suscripción,
     * dependiendo de un tercero y el municipio que puede seleccionar el usuario que está en el 
     * sistema
     * @param int $idTercero identificador del tercero
     * @param int $idUsuario identificador del usuario
     * @return array Listado de propiedades
     */
    public function getPropiedadesSinAsignar($idTercero, $idUsuario, $idEmpresa) {
        $parametros['idtercero'] = $idTercero;
        $parametros['idusuario'] = $idUsuario;
        $parametros['idempresa'] = $idEmpresa;
        $sql = "select
                    pro.pro_ideregistro idpropiedad,
                    pro.pro_idepropieda  numeropropiedad,
                    uni.uni_nombre1 tipopropiedad,pro.uni_tippropieda idtipopropiedad,
                    pro.uni_municipio idmunicipio,pry.proyecto_nom municipio,
                    pro.uni_barrio idbarrio,bar.barrio_nom barrio,bar.barrio_factor factorcorreccion,
                    pro.pro_direccion direccion,pro.pro_seccion seccion,
                    pro.pro_manzana manzana, pro.pro_descripcion descripcion,
                    pro.pro_numcatastral numerocatastral,pro.pro_zona zona, pro.pro_altriesgo altoriesgo
                from pro_propiedad pro inner join uni_unidad uni on pro.uni_tippropieda=uni.uni_ideregistro
                    inner join proyectos pry on pry.proyecto_ideregistro=pro.uni_municipio
                    inner join barrios bar on bar.barrio_ideregistro=pro.uni_barrio
                    inner join esem_estempresa esem on uni.est_ideregistro=esem.est_ideregistro
                    left  join dsus_detsuscrip dsus on  dsus.pro_ideregistro =   pro.pro_ideregistro  and dsus.ter_ideregistro = :idtercero
                where esem.emp_ideregistro=:idempresa AND pro.ter_ideregistro= :idtercero AND pro.pro_estado <> 'I' AND pro.pro_estado <> 'E'
                    and dsus.pro_ideregistro is null
                    and pro.uni_municipio in (select distinct uspr.uni_municipio from uspr_usuprgpryto uspr where uspr.usu_ideregistro=:idusuario) ";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta las propiedades que  estan asigandas a una suscripción,
     * dependiendo de un tercero y el municipio que puede seleccionar el usuario que está en el 
     * sistema
     * @param int $idTercero identificador del tercero
     * @param int $idUsuario identificador del usuario
     * @return array Listado de propiedades
     */
    public function getPropiedadesAsignadas($idTercero, $idUsuario, $idEmpresa) {
        $parametros['idtercero'] = $idTercero;
        $parametros['idusuario'] = $idUsuario;
        $parametros['idempresa'] = $idEmpresa;
        $sql = 'select
                    pro.pro_ideregistro idpropiedad,
                    pro.pro_idepropieda  numeropropiedad,
                    uni.uni_nombre1 tipopropiedad,pro.uni_tippropieda idtipopropiedad,
                    pro.uni_municipio idmunicipio,pry.proyecto_nom municipio,
                    pro.uni_barrio idbarrio,bar.barrio_nom barrio,
                    pro.pro_direccion direccion,pro.pro_seccion seccion,
                    pro.pro_manzana manzana, pro.pro_descripcion descripcion,
                    dsus.dsus_ideregistr idsuscripcion, dsus.dsus_pcodigo codigoanterior
               from pro_propiedad pro inner join uni_unidad uni on pro.uni_tippropieda=uni.uni_ideregistro
                    inner join esem_estempresa esem on uni.est_ideregistro=esem.est_ideregistro
                    inner join proyectos pry on pry.proyecto_ideregistro=pro.uni_municipio
                    inner join barrios bar on bar.barrio_ideregistro=pro.uni_barrio
                    inner join dsus_detsuscrip dsus on pro.pro_ideregistro=dsus.pro_ideregistro and dsus.ter_ideregistro = :idtercero
               where esem.emp_ideregistro=:idempresa AND pro.ter_ideregistro=:idtercero 
                     and pro.uni_municipio in (select distinct uspr.uni_municipio from uspr_usuprgpryto uspr where uspr.usu_ideregistro=:idusuario)';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Lista los tipos de suscripcion que existen
     * @param int $idEmpresa identificador de la empresa
     * @param int $idConvenio identificador del convenio
     * @param int $idMunicipio identificador del municipio
     * @return array Listado de tipos de suscripción
     */
    public function getTiposSuscripcion($idEmpresa, $idConvenio, $idMunicipio) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idconvenio'] = $idConvenio;
        $parametros['idmunicipio'] = $idMunicipio;
        $sql = 'select
                    distinct 
                    tsu.uni_tipsuscripc idtiposuscripcion,
                    tsu.tsu_nombre tiposuscripcion
               from
                   tsu_tipsuscripc tsu inner join esem_estempresa esem on tsu.est_tipsuscripc=esem.est_ideregistro
                   inner join dicn_disconven dicn on tsu.uni_tipsuscripc=dicn.uni_tipsuscripc
                   inner join muts_muntipsusc muts on tsu.uni_tipsuscripc=muts.uni_tipsuscripc
               where esem.emp_ideregistro=:idempresa and dicn.cnre_ideregistr=:idconvenio and muts.uni_municipio=:idmunicipio';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta los tipos de uso asociados  a la empresa y cilo
     * @param int $idEmpresa identificador de la empresa
     * @param int $idTipoSuscripcion 
     * @return array Listado de tipos de uso registrados
     */
    public function getTiposUsoSuscripcion($idEmpresa, $idTipoSuscripcion) {
        $parametros['idclasetipouso'] = CLA_TIPO_USO_SUSCRIPCION;
        $parametros['idtiposuscripcion'] = $idTipoSuscripcion;
        $parametros['idempresa'] = $idEmpresa;
        $sql = '  SELECT DISTINCT uni.uni_ideregistro idtipousosuscripcion,uni.uni_nombre1  tipousosuscripcion
                  FROM dtsu_dettipsusc  dtsu inner join uni_unidad uni on dtsu.uni_tipusosuscr=uni.uni_ideregistro
                       inner join esem_estempresa esem on esem.est_ideregistro=uni.est_ideregistro
                  WHERE dtsu.uni_tipsuscripc=:idtiposuscripcion AND
                    esem.emp_ideregistro=:idempresa';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * 
     * @param int $idEmpresa
     * @param int $idCiclo
     * @return array Listado de tipos de uso por el ciclo de la empresa
     */
    public function getTipoUsoPorCiclo($idEmpresa, $idCiclo) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idciclo'] = $idCiclo;
        $sql = ' SELECT DISTINCT uni.uni_ideregistro idtipousosuscripcion,uni.uni_nombre1  tipousosuscripcion
                FROM cic_ciclo cic
                INNER JOIN rut_ruta rut ON rut.cic_ideregistro = cic.cic_ideregistro
                INNER JOIN mbru_munbarruta mbru ON mbru.rut_ideregistro = rut.rut_ideregistro
                INNER JOIN muba_munbarrio muba ON muba.muba_ideregistr = mbru.muba_ideregistr
                INNER JOIN muts_muntipsusc muts ON muts.uni_municipio = muba.uni_municipio
                INNER JOIN dtsu_dettipsusc dtsu ON dtsu.uni_tipsuscripc = muts.uni_tipsuscripc
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = dtsu.uni_tipusosuscr
                INNER JOIN esem_estempresa esem ON esem.est_ideregistro=uni.est_ideregistro
                WHERE cic.cic_ideregistro = :idciclo AND esem.emp_ideregistro=:idempresa ';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta las liquidaciones que se encuentran asociadas a un tipo de uso,
     * ciclo y municipio
     * @param int $idTipoUsoSuscripcion
     * @param int $idCiclo
     * @param int $idMunicipio
     * @return array Listado de liquidaciones
     */
    public function getLiquidaciones($idTipoUsoSuscripcion, $idCiclo, $idMunicipio) {
        $parametros['idtipousosuscripcion'] = $idTipoUsoSuscripcion;
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $parametros['idciclo'] = $idCiclo;
        $parametros['idmunicipio'] = $idMunicipio;
        $parametros['clasificacion'] = 'LI';
        $parametros['estado'] = 'A';
        $sql = 'select 
                  liq.uni_liquidacion idliquidacion,liq.liq_nombre liquidacion
                from 
                  liq_liquidacion liq inner join lius_liquso lius on liq.uni_liquidacion=lius.uni_liquidacion
                  inner join esem_estempresa esem on esem.est_ideregistro=liq.est_liquidacion
                  inner join cili_cicliquida cili on liq.uni_liquidacion=cili.uni_liquidacion
                  inner join limu_liqmunicipio limu on limu.uni_liquidacion=liq.uni_liquidacion
                where
                  lius.uni_tipusosuscr=:idtipousosuscripcion and esem.emp_ideregistro=:idempresa and cili.cic_ideregistro=:idciclo
                  and limu.uni_municipio=:idmunicipio and liq.liq_venclasific=:clasificacion and liq.liq_estado=:estado
                  and liq_inivigencia<now()::date 
                  and (case when liq.liq_finvigencia is null then liq.liq_finvigencia is null else liq.liq_finvigencia>now()::date end) ';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta los terceros asociados a un municipio y el usuario
     * @param string $nombre
     * @return array Lista de terceros 
     */
    public function getTerceros($nombre) {
        $parametros['nombre'] = '%' . $nombre . '%';
        $parametros['idusuario'] = $this->sesion->get('idusuario');
        $sql = 'SELECT
		    distinct 
                    ter.ter_ideregistro idtercero,
                    ter.ter_documento documento,
                    trim(ter.ter_nomcompleto) nombretercero 
                FROM
                    ter_tercero ter inner join pro_propiedad pro on ter.ter_ideregistro=pro.ter_ideregistro
                WHERE
                    pro.uni_municipio in (select distinct uspr.uni_municipio from uspr_usuprgpryto uspr where uspr.usu_ideregistro=:idusuario)
                    and lower(ter_nomcompleto) like lower(:nombre) 
                LIMIT 100';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Devuelve la ruta que más suscripciones tiene asociadas  de un municipio y barrio
     * @param int $idMunicipio
     * @param int $idBarrio
     * @return array Información de la ruta
     */
    public function getRutaSuscripcion($idMunicipio, $idBarrio) {
        $parametros['idmunicipio'] = $idMunicipio;
        $parametros['idbarrio'] = $idBarrio;
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $sql = 'select  idruta,ruta,numerosuscripciones  
               from(
                    select 
                        rusu.rut_ideregistro idruta,rut.rut_nombre ruta, count(rusu.dsus_ideregistr) numerosuscripciones 
                    from 
                       rusu_rutsuscrip  rusu inner join dsus_detsuscrip dsus on rusu.dsus_ideregistr=dsus.dsus_ideregistr
                        inner join rut_ruta rut on rusu.rut_ideregistro=rut.rut_ideregistro
                    where
                       dsus.uni_municipio=:idmunicipio and dsus.uni_barrio=:idbarrio and dsus.emp_ideregistro=:idempresa
                    group by
                       rusu.rut_ideregistro,rut.rut_nombre
                   ) as rutasuscripcion order by numerosuscripciones desc limit 1';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta la primera ruta de un barrio municipio
     * @param int $idMunicipio
     * @param int $idBarrio
     * @return array Informacion de la ruta
     */
    public function getRutaBarrio($idMunicipio, $idBarrio) {
        $parametros['idmunicipio'] = $idMunicipio;
        $parametros['idbarrio'] = $idBarrio;
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $sql = 'select 
                   rut.rut_ideregistro idruta,rut.rut_nombre ruta 
                from 
                   mbru_munbarruta  mbru inner join muba_munbarrio muba on mbru.muba_ideregistr=muba.muba_ideregistr
                   inner join rut_ruta rut on rut.rut_ideregistro=mbru.rut_ideregistro
                   inner join ruem_rutempresa ruem on ruem.rut_ideregistro=mbru.rut_ideregistro
                where
                   muba.uni_municipio=:idmunicipio and muba.uni_barrio=:idbarrio  and ruem.emp_ideregistro=:idempresa
                limit 1';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta el ciclo asociado a una ruta
     * @param int $idRuta
     * * @return array Informacion del ciclo
     */
    public function getCicloPorRuta($idRuta) {
        $parametros['idruta'] = $idRuta;
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $sql = 'select 
                   cic.cic_ideregistro idciclo,
                   cic.cic_nombre ciclo 
                from 
                  rut_ruta rut inner join cic_ciclo cic on rut.cic_ideregistro=cic.cic_ideregistro
                  inner join ciem_cicempresa ciem on ciem.cic_ideregistro=cic.cic_ideregistro
                where 
                  ciem.emp_ideregistro=:idempresa and rut.rut_ideregistro=:idruta';
        return $this->executeQuery($sql, $parametros);
    }

    public function getConceptos($liquidaciones, $idPrograma, $idSuscripcion) {
        $parametros['idprograma'] = $idPrograma;
        $parametros['idclase'] = CLA_CONCEPTO_GRAL_SUSCRIP;
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $sql = "select distinct 
                   con.uni_concepto idconcepto,con.con_nombre concepto, con.con_tipregistro tiporegistro,con.con_valor valor,
                   con.con_valor valorunitario,con.con_tipcalculo tipocalculo,con.con_financiable financiable
              from 
                   con_concepto con inner join coli_conliquida coli on con.uni_concepto=coli.uni_concepto
              where
                 con.prg_ideregistro=:idprograma and coli.uni_liquidacion in ($liquidaciones) 
                 and con.con_estado = 'A' and  (case when con.con_finvigencia is null then con.con_finvigencia is null else con.con_finvigencia>now()::date end)
                 and con.uni_concepto not in (select uni_concepto from cosu_consuscrip where dsus_ideregistr=$idSuscripcion)
                     
                 
            UNION

                SELECT 
                 con.uni_concepto idconcepto,con.con_nombre concepto, con.con_tipregistro tiporegistro,con.con_valor valor,
                                 con.con_valor valorunitario,con.con_tipcalculo tipocalculo,con.con_financiable financiable

                 from con_concepto con
                INNER JOIN est_estructura est on con.est_concepto=est.est_ideregistro
                inner join esem_estempresa esem on esem.est_ideregistro=est.est_ideregistro
                inner join cla_clase cla on cla.cla_ideregistro=est.cla_ideregistro
                where cla.cla_ideregistro =:idclase -- constante
                and esem.emp_ideregistro=:idempresa  -- parametro SESSION
                and con.prg_ideregistro =:idprograma -- parametro GLOBAL

              ";
        return $this->executeQuery($sql, $parametros);
    }

    public function getInfoConceptos($idConcepto) {
        $parametros['idconcepto'] = $idConcepto;
        $sql = "select distinct 
                   con.uni_concepto idconcepto,con.con_nombre concepto, con.con_tipregistro tiporegistro,con.con_valor valor,
                   con.con_valor valorunitario,con.con_tipcalculo tipocalculo,con.con_financiable financiable
              from 
                   con_concepto con inner join coli_conliquida coli on con.uni_concepto=coli.uni_concepto
              where
                 con.uni_concepto = :idconcepto
                 and con.con_estado = 'A' and  (case when con.con_finvigencia is null then con.con_finvigencia is null else con.con_finvigencia>now()::date end)
                  ";
        return $this->executeQuery($sql, $parametros);
    }

    private function getInfoSuscripcion(array $suscripcion) {
        $parametros = array();
        $this->setCampo($suscripcion, $parametros, 'estado', 'dsus_estado');
        $this->setCampo($suscripcion, $parametros, 'descripcion', 'dsus_descripcion');
        $this->setCampo($suscripcion, $parametros, 'codigoanterior', 'dsus_pcodigo');
        $this->setCampo($suscripcion, $parametros, 'idsuscriptor', 'sus_ideregistro');
        $this->setCampo($suscripcion, $parametros, 'idsuscripcion', 'dsus_ideregistr');
        $this->setCampo($suscripcion, $parametros, 'idtercero', 'ter_ideregistro');
        $this->setCampo($suscripcion, $parametros, 'idpropiedad', 'pro_ideregistro');
        $this->setCampo($suscripcion, $parametros, 'idmunicipio', 'uni_municipio');
        $this->setCampo($suscripcion, $parametros, 'idbarrio', 'uni_barrio');
        $this->setCampo($suscripcion, $parametros, 'idestructuratiposuscripcion', 'est_tipsuscripc');
        $this->setCampo($suscripcion, $parametros, 'idtiposuscripcion', 'uni_tipsuscripc');
        $this->setCampo($suscripcion, $parametros, 'idestructuratipousosuscripcion', 'est_tipusosuscr');
        $this->setCampo($suscripcion, $parametros, 'idtipousosuscripcion', 'uni_tipusosuscr');
        $this->setCampo($suscripcion, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($suscripcion, $parametros, 'idestructuraliquidacion', 'est_liquidacion');
        $this->setCampo($suscripcion, $parametros, 'idliquidacion', 'uni_liquidacion');
        $this->setCampo($suscripcion, $parametros, 'idciclo', 'cic_ideregistro');
        $this->setCampo($suscripcion, $parametros, 'fechainicio', 'dsus_fecinicio');
        $this->setCampo($suscripcion, $parametros, 'fechaexpiracion', 'dsus_fecexpira');
        $this->setCampo($suscripcion, $parametros, 'estrato', 'pro_catestrato');
        $this->setCampo($suscripcion, $parametros, 'fechainicioestado', 'dsus_iniestado');
        $this->setCampo($suscripcion, $parametros, 'fechafinestado', 'dsus_finestado');
        $this->setCampo($suscripcion, $parametros, 'factorcorreccion', 'dsus_factor');
        $this->setCampo($suscripcion, $parametros, 'idusuario', 'usu_ideregistro');
        $this->setCampo($suscripcion, $parametros, 'idactividadeconomica', 'uni_actsuscripc');
        return $parametros;
    }

    private function getInfoConceptosSuscripcion(array $conceptos) {
        $parametros = array();
        $this->setCampo($conceptos, $parametros, 'cantidad', 'cosu_cantidad');
        $this->setCampo($conceptos, $parametros, 'valorunitario', 'cosu_vlrunitari');
        $this->setCampo($conceptos, $parametros, 'valortotal', 'cosu_vlrtotal');
        $this->setCampo($conceptos, $parametros, 'fechainicio', 'cosu_fecinicio');
        $this->setCampo($conceptos, $parametros, 'fechafin', 'cosu_fecfinal');
        $this->setCampo($conceptos, $parametros, 'idliquidacion', 'uni_liquidacion');
        $this->setCampo($conceptos, $parametros, 'idconcepto', 'uni_concepto');
        $this->setCampo($conceptos, $parametros, 'estado', 'cosu_estado');
        $this->setCampo($conceptos, $parametros, 'idsuscripcion', 'dsus_ideregistr');
        $this->setCampo($conceptos, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($conceptos, $parametros, 'idusuario', 'usu_ideregistro');
        return $parametros;
    }

    public function nuevaSuscripcion(array $suscripcion) {
        $parametros = $this->getInfoSuscripcion($suscripcion);
        return $this->insertar($parametros, 'dsus_detsuscrip ', 'sq_dsus_ideregistr');
    }

    public function nuevaSuscripcionConceptos(array $conceptos) {
        $parametros = array();
        $this->setCampo($conceptos, $parametros, 'cantidad', 'cosu_cantidad');
        $this->setCampo($conceptos, $parametros, 'valorunitario', 'cosu_vlrunitari');
        $this->setCampo($conceptos, $parametros, 'valortotal', 'cosu_vlrtotal');
        $this->setCampo($conceptos, $parametros, 'fechainicio', 'cosu_fecinicio');
        $this->setCampo($conceptos, $parametros, 'fechafin', 'cosu_fecfinal');
        $this->setCampo($conceptos, $parametros, 'estado', 'cosu_estado');
        $this->setCampo($conceptos, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($conceptos, $parametros, 'idusuario', 'usu_ideregistro');
        $actualizarConcepto = $this->actualizar($parametros, 'cosu_consuscrip', 'uni_concepto=' . $conceptos['idconcepto'] . ' AND dsus_ideregistr=' . $conceptos['idsuscripcion']);
        if (empty($actualizarConcepto)) {
            $parametros = $this->getInfoConceptosSuscripcion($conceptos);
            return $this->insertar($parametros, 'cosu_consuscrip', 'sq_cosu_ideregistr');
        }
        return $actualizarConcepto;
    }

    public function nuevaSuscripcionRuta(array $ruta) {
        $parametros['rut_ideregistro'] = $ruta['idruta'];
        $parametros['rusu_rutanterio'] = '.';
        $parametros['dsus_ideregistr'] = $ruta['idsuscripcion'];
        $parametros['rusu_rutsecuen'] = 0;
        $parametros['usu_ideregistro'] = $this->sesion->get('idusuario');
        return $this->insertar($parametros, 'rusu_rutsuscrip', 'sq_rusu_ideregistr');
    }

    public function nuevaSuscripcionLiquidacion($liquidacion) {
        $parametros = array();
        $this->setCampo($liquidacion, $parametros, 'idliquidacionsuscripcion', 'lids_ideregistr');
        $this->setCampo($liquidacion, $parametros, 'idsuscripcion', 'dsus_ideregistr');
        $this->setCampo($liquidacion, $parametros, 'idliquidacion', 'uni_liquidacion');
        $this->setCampo($liquidacion, $parametros, 'idempresa', 'emp_ideregistro');
        $this->setCampo($liquidacion, $parametros, 'idusuario', 'usu_ideregistro');
        return $this->insertar($parametros, 'lids_liqdetsusc', 'sq_lids_ideregistr');
    }

    public function getSuscripcionTercero($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idusuario'] = $this->sesion->get('idusuario');
        $sql = 'SELECT DISTINCT
                        ter.ter_documento cedula,
                        ter.ter_sexo sexo,
                        ter.ter_nomcompleto nombretercero,
                        unitip.uni_nombre1 tipodocumento,
                        ter.uni_tipidentifica idtipodocumento,
                        ter.ter_nombre nombres,
                        ter.ter_apellido apellidos,
                        ter.ter_ideregistro idtercero,
                        ter.ter_telfijo telefonofijo,
                        ter.ter_telcelular telefonocelular,
                        ter.ter_correo correoelectronico,
                        sus.sus_ideregistro idsuscriptor,
                        cnre.cnre_nombre convenio,
                        sus.cnre_ideregistr idconvenio,
                        sus.sus_descripcion descripcion,
                        dsus.dsus_ideregistr idsuscripcion,
                        ter.uni_tiptercero idtipotercero,
                        uni.uni_codigo1 codtipotercero,
                        uni.uni_nombre2 tipotercero,
                        ciudad.ciudad_nom lugarexpedicion
                FROM
                        ter_tercero ter
                INNER JOIN sus_suscripcion sus ON ter.ter_ideregistro = sus.ter_ideregistro
                INNER JOIN dicn_disconven dicn ON sus.cnre_ideregistr = dicn.cnre_ideregistr
                INNER JOIN cnre_cnvrecaudo cnre ON dicn.cnre_ideregistr = cnre.cnre_ideregistr
                INNER JOIN dsus_detsuscrip dsus ON dsus.sus_ideregistro = sus.sus_ideregistro
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = ter.uni_tiptercero
                INNER JOIN uni_unidad unitip ON unitip.uni_ideregistro = ter.uni_tipidentifica
                LEFT JOIN ciudades ciudad ON ter.ciudad_cod = ciudad.ciudad_cod
                WHERE
                        dsus.uni_municipio IN (
                                SELECT DISTINCT
                                        uspr.uni_municipio
                                FROM
                                        uspr_usuprgpryto uspr
                                WHERE
                                        uspr.usu_ideregistro =:idusuario
                        )
                AND dsus.dsus_ideregistr =:idsuscripcion;';
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0];
    }

    public function getSuscripcionPropiedad($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = 'SELECT
                        pro.pro_ideregistro idpropiedad,
                        pro.pro_idepropieda numeropropiedad,
                        uni.uni_nombre1 tipopropiedad,
                        pro.uni_tippropieda idtipopropiedad,
                        pro.uni_municipio idmunicipio,
                        pry.proyecto_nom municipio,
                        pro.uni_barrio idbarrio,
                        bar.barrio_nom barrio,
                        pro.pro_direccion direccion,
                        pro.pro_seccion seccion,
                        pro.pro_manzana manzana,
                        pro.pro_descripcion descripcion,
                        dep.departamento_nom departamento,
                        dep.departamento_ideregistro iddepartamento,
                        dsus.dsus_ideregistr idsuscripcion,
                        dsus.dsus_pcodigo codigoanterior,
                        pro.pro_numcatastral numerocatastral,
                        pro.pro_zona zona,
                        pro.pro_altriesgo altoriesgo,
                        pro.pro_numcatastralnacional numerocatastralnacional
                FROM
                        pro_propiedad pro
                INNER JOIN uni_unidad uni ON pro.uni_tippropieda = uni.uni_ideregistro
                INNER JOIN proyectos pry ON pry.proyecto_ideregistro = pro.uni_municipio
                LEFT JOIN departamentos dep ON pry.departamento_ideregistro = dep.departamento_ideregistro
                INNER JOIN barrios bar ON bar.barrio_ideregistro = pro.uni_barrio
                INNER JOIN dsus_detsuscrip dsus ON pro.pro_ideregistro = dsus.pro_ideregistro
                WHERE
                        dsus.dsus_ideregistr =:idsuscripcion';
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error, La suscripción no tiene asociada una propiedad', -1);
        }
        return $resultado[0];
    }

    public function getSuscripcionDetalle($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $sql = "select dsus.dsus_ideregistr idsuscripcion, rut.rut_ideregistro idruta, rut.rut_nombre ||' - '|| rusu.rusu_rutsecuen ruta,cic.cic_ideregistro idciclo,
                 cic.cic_nombre ciclo,tsu.uni_tipsuscripc idtiposuscripcion,tsu.tsu_nombre tiposuscripcion, 
                 cic.cic_anoactual cicloanio, dsus.dsus_fecinicio fechainicio,dsus.dsus_descripcion descripcion,
                 uni.uni_nombre1 tipousosuscripcion, uni.uni_ideregistro idtipousosuscripcion, sus_ideregistro idsus,
                 dsus.pro_catestrato estrato, dsus.dsus_estado estado,dsus.dsus_factor factorcorreccion,dsus.dsus_pcodigo codigoanterior,
                 liq.uni_liquidacion idliquidacion, liq.liq_nombre liquidacion,
                (CASE 	WHEN dper.dper_estado = 'C' or dper.dper_fecfinal::date <= now()::date THEN persig.per_ideregistro ELSE per.per_ideregistro END ) idperiodo, per.per_nombre periodo,
                dsus.uni_actsuscripc idactividadeconomica, uniact.uni_nombre1 actividadeconomica,
                ( per.per_fecfinal::Date - now()::Date) diasterminoperiodo , 
                 to_char(NOW() - interval '1 year','YYYY/MM/DD') fecinicio , to_char(now(),'YYYY/MM/DD') fecfinal,
                 rupe.rupe_fecvence::date fechavenciminto, rupe.rupe_fecsuspens::date fechasuspension,
                 qui.quinquenio_fecmin fechaminima,
                 qui.quinquenio_fecmax fechamaxima,
                 qui.quinquenio_fecsus fechasuspension
              from dsus_detsuscrip dsus left join  rusu_rutsuscrip rusu on dsus.dsus_ideregistr=rusu.dsus_ideregistr
                 left join rut_ruta rut on rusu.rut_ideregistro=rut.rut_ideregistro
                 inner join cic_ciclo cic on dsus.cic_ideregistro=cic.cic_ideregistro
                 inner join tsu_tipsuscripc tsu on dsus.uni_tipsuscripc=tsu.uni_tipsuscripc
                 inner join uni_unidad uni on dsus.uni_tipusosuscr= uni.uni_ideregistro
                 inner join liq_liquidacion liq on liq.uni_liquidacion=dsus.uni_liquidacion
                 INNER JOIN per_periodo per ON per.cic_ideregistro = dsus.cic_ideregistro and per.per_estado = 'A' 
                 INNER JOIN per_periodo persig ON persig.cic_ideregistro = dsus.cic_ideregistro and persig.per_estado = 'B' AND persig.per_ideregistro > per.per_ideregistro 
                 left JOIN	dper_detperiodo dper ON dper.per_ideregistro = per.per_ideregistro and dper.prg_ideregistro = 6 
                 left JOIN rupe_rutperiodo rupe ON rupe.rut_ideregistro = rusu.rut_ideregistro AND rupe.per_ideregistro = (CASE WHEN dper.dper_estado = 'C' or dper.dper_fecfinal::date <= now()::date THEN persig.per_ideregistro ELSE per.per_ideregistro	END )
                 left join uni_unidad uniact on dsus.uni_actsuscripc = uniact.uni_ideregistro
                 left join quinquenio_his qui on qui.dsus_ideregistr=dsus.dsus_ideregistr and qui.quinquenio_feccer is null
              where
                 dsus.dsus_ideregistr=:idsuscripcion  AND dsus.emp_ideregistro=:idempresa limit 1";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error, No se puede consultar la información de la suscripción', -1);
        }
        return $resultado[0];
    }

    public function getSuscripcionConceptos($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "select 
                  cosu.uni_concepto idconcepto, con.con_nombre concepto,
                  cosu.cosu_estado estado, cosu.cosu_cantidad cantidad, cosu.cosu_fecfinal fechafin,
                  cosu.cosu_fecinicio fechainicio,cosu.cosu_vlrtotal valortotal,cosu.cosu_vlrunitari valorunitario
                from 
                  cosu_consuscrip cosu inner join con_concepto con on cosu.uni_concepto=con.uni_concepto
                where 
                  cosu.dsus_ideregistr=1 order  by con.con_tipcalculo desc";
        return $this->executeQuery($sql, $parametros);
    }

    public function setSuscripcionCodigoAnterior($idSuscripcion, $idBarrio) {
        $sql = "update dsus_detsuscrip set 
                dsus_pcodigo=(select barrio_codpro||barrio_cod ||$idSuscripcion from barrios where barrio_ideregistro=$idBarrio) 
                where dsus_ideregistr=$idSuscripcion";
        $this->executeQuery($sql);
    }

    public function getConceptosSuscripcion($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = 'select  cosu.uni_concepto idconcepto,con.con_nombre concepto,
                cosu.uni_liquidacion idliquidacion,liq.liq_nombre liquidacion,
                cosu.cosu_cantidad cantidad,cosu.cosu_vlrunitari valorunitario,
                cosu.cosu_vlrtotal valortotal,(cosu.cosu_fecinicio)::date fechainicio,
                (cosu.cosu_fecfinal)::date fechafinal, cosu.dsus_ideregistr idsuscripcion,
                con.con_tipregistro tiporegistro, con.con_valor valor
            from cosu_consuscrip cosu inner join con_concepto con on cosu.uni_concepto=con.uni_concepto
                 inner join liq_liquidacion liq on cosu.uni_liquidacion=liq.uni_liquidacion
            where
               cosu.dsus_ideregistr=:idsuscripcion';
        return $this->executeQuery($sql, $parametros);
    }

    public function getCiclos($idEmpresa, $idCiclo, $idRuta) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['idciclo'] = $idCiclo;
        $parametros['idruta'] = $idRuta;
        $sql = "select distinct per.cic_ideregistro idciclo, cic.cic_nombre ciclo
              from 
                cic_ciclo cic inner join ciem_cicempresa ciem on cic.cic_ideregistro= ciem.cic_ideregistro
                inner join per_periodo per on cic.cic_ideregistro=per.cic_ideregistro
                inner join rut_ruta rut on rut.cic_ideregistro=cic.cic_ideregistro
              where cic.cic_ideregistro=:idciclo or( ciem.emp_ideregistro=:idempresa and rut.rut_ideregistro=:idruta
              and per.per_estado='A' 
              and extract(MONTH from  per.per_fecfinal) in (select extract(MONTH from  per.per_fecfinal) from per_periodo per where  per.cic_ideregistro=:idciclo and per.per_estado='A'))
              order by per.cic_ideregistro ";
        return $this->executeQuery($sql, $parametros);
    }

    public function actualizarSuscripcion($suscripcion) {
        $parametros = $this->getInfoSuscripcion($suscripcion);
        $this->actualizar($parametros, 'dsus_detsuscrip', 'dsus_ideregistr = :dsus_ideregistr');
    }

    public function eliminarSuscripcionConceptos($idSuscripcion, $idsConceptos) {
        $sql = "delete from cosu_consuscrip where dsus_ideregistr=:idsuscripcion AND uni_concepto NOT IN ($idsConceptos)  ";
        $parametrosEliminacion['idsuscripcion'] = $idSuscripcion;
        $this->executeQuery($sql, $parametrosEliminacion);
    }

    public function contarDocumentosConSaldo($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "select 
            (
             select count(fac_ideregistro) numero from fac_factura 
             where dsus_ideregistr=:idsuscripcion and fac_sdoreal>0 and fac_estado='A' AND fac_idepadre IS NULL
            )+
            (
             select count(*)  numero from fin_financiacio 
             where dsus_ideregistr=:idsuscripcion and fin_sdocapital>0 and fin_estado='A'
            )numero";
        /*+
          (
          select count(*) numero from dire_disrecaudo dire INNER JOIN rec_recaudo rec ON dire.rec_ideregistro=rec.rec_ideregistro
          where dsus_ideregistr=:idsuscripcion and dire_sdorecaudo>0 AND rec.rec_estado NOT IN ('T','D','E')
          ) */
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['numero'];
    }

    public function contarDocumentosConSaldoEliminado($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "select 
            (
             select count(fac_ideregistro) numero from fac_factura 
             where dsus_ideregistr=:idsuscripcion and fac_sdoreal>0 and fac_estado='A' AND fac_idepadre IS NULL
            )+
            (
             select count(*)  numero from fin_financiacio 
             where dsus_ideregistr=:idsuscripcion and fin_sdocapital>0 and fin_estado='A'
            )
        +
            (
             select count(*) numero from dire_disrecaudo dire INNER JOIN rec_recaudo rec ON dire.rec_ideregistro=rec.rec_ideregistro
             where dsus_ideregistr=:idsuscripcion and dire_sdorecaudo>0 AND rec.rec_estado NOT IN ('T','D','E')
            ) numero";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['numero'];
    }

    public function contarFacturasConSaldo($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "select count(fac_ideregistro) numero from fac_factura 
             where dsus_ideregistr=:idsuscripcion and fac_sdoreal>0 and fac_estado='A' AND fac_idepadre IS NULL";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['numero'];
    }

    /**
     * Consulta las actividades economicas por clase y la empresa
     * @param type $idclase
     * @param type $idempresa
     * @return type
     */
     public function getActividadEconomica($idclase, $idempresa, $idusuario, $idprograma) {
        $parametros['idclase'] = $idclase;
        $parametros['idempresa'] = $idempresa;
        $parametros['idusuario'] = $idusuario;
        $parametros['idprograma'] = $idprograma;
        $sql = "SELECT
                    uni.uni_ideregistro idunidad,
                    uni.uni_nombre1 nombre,
                    uni.uni_codigo2 codExento
                FROM
                    est_estructura est
                INNER JOIN esem_estempresa esem ON est.est_ideregistro = esem.est_ideregistro
                INNER JOIN cla_clase cla ON est.cla_ideregistro = cla.cla_ideregistro
                INNER JOIN uni_unidad uni ON est.est_ideregistro = uni.est_ideregistro
                WHERE est.cla_ideregistro =:idclase
                AND esem.emp_ideregistro =:idempresa
                ORDER BY uni.uni_nombre1";
        return $this->executeQuery($sql, $parametros);
    }

    public function getRutasEmpresa($idEmpresa) {
        $parametros['idempresa'] = $idEmpresa;
        $sql = "SELECT
                    rut.rut_ideregistro idruta,
                    rut.rut_nombre ruta
                FROM
                    rut_ruta rut
                INNER JOIN ruem_rutempresa ruem ON rut.rut_ideregistro = ruem.rut_ideregistro
                WHERE ruem.emp_ideregistro = :idempresa";
        return $this->executeQuery($sql, $parametros);
    }

    public function consultarLecturaActual($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT count(*) cantidad
                FROM lec_lectura lec
                  INNER JOIN per_periodo per ON lec.per_ideregistro = per.per_ideregistro
                WHERE lec.lec_estado IN ('A', 'G') AND
                      per.per_estado = 'A' AND
                      lec.dsus_ideregistr = :idsuscripcion";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['cantidad'];
    }

    public function nuevoEncabezadoLectura($idUsuario, $idSuscripcion) {
        $desviacion = PARAMETRO_DESVIACION;
        $sql = "INSERT INTO lec_lectura
                (
                  SELECT
                    nextval('sq_lec_ideregistro') , --lec_ideregistro
                    'A', --lec_estado
                    now(), --lec_fecha
                    NULL,--lec_fecaprobac
                    now(),--lec_fecprocesad
                    coalesce((
                        SELECT ssp_lectura
                        FROM ssp_suspension ssp
                          INNER JOIN syr_susreconex syr ON ssp.syr_ideregistro = syr.syr_ideregistro
                          INNER JOIN mosu_motsuspen mosu ON ssp.uni_motsuspen = mosu.uni_motsuspen
                        WHERE syr.syr_estado = 'A' AND
                              syr.dsus_ideregistr = dsus.dsus_ideregistr AND
                              mosu.mosu_proceso='S' AND
                              ssp.ssp_estado = 'A'
                        LIMIT 1
                    ),0) ,--lec_anterior
                    NULL ,--dlec_ideregistr
                    0,--lec_actual,
                    0,--lec_consumo,
                    (Select COALESCE(
                    (select COALESCE(lecpro.lec_conpromedio,0) from lec_lectura lecpro where lecpro.dsus_ideregistr = $idSuscripcion 
                                and lecpro.lec_ideregistro = ( SELECT max(lecmax.lec_ideregistro) from lec_lectura lecmax
                            WHERE lecmax.dsus_ideregistr = lecpro.dsus_ideregistr)),0)),--lec_conpromedio,
                    'Se modifica el estado de la suscripción',--lec_observacion
                    dsus.dsus_ideregistr,--
                    dsus.pro_ideregistro,
                    dsus.cic_ideregistro,
                    per.per_ideregistro,
                    cic.cic_anoactual,
                    dsus.emp_ideregistro,
                    dsus.uni_tipsuscripc,
                    dsus.uni_tipusosuscr,
                    pro.pro_idepropieda,
                    pro.pro_digitos,
                    $desviacion, --desviacion
                    dsus.dsus_factor,
                    $idUsuario
                  FROM dsus_detsuscrip dsus
                      INNER JOIN per_periodo per ON per.cic_ideregistro=dsus.cic_ideregistro
                      INNER JOIN cic_ciclo cic ON cic.cic_ideregistro=dsus.cic_ideregistro
                      INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro=pro.pro_ideregistro
                      LEFT JOIN lec_lectura lec ON dsus.dsus_ideregistr=lec.dsus_ideregistr 
                      AND lec.lec_ideregistro = (SELECT max(le.lec_ideregistro)
                                                          FROM lec_lectura le
                                                          WHERE le.dsus_ideregistr = $idSuscripcion AND le.lec_estado = 'P')
                  WHERE per.per_estado='A' and dsus.dsus_ideregistr= $idSuscripcion
                ) ";
        $this->executeQuery($sql);
    }

    function validarPropiedadSuscripcion($idPropiedad, $idEmpresa) {
        $parametros['propiedad'] = $idPropiedad;
        $parametros['empresa'] = $idEmpresa;

        $sql = " SELECT dsus_ideregistr idsuscripcion
                  FROM dsus_detsuscrip
                 WHERE pro_ideregistro = :propiedad AND emp_ideregistro = :empresa";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0];
    }

    function calcularNuevoPcodigo($idSuscripcion, $idBarrio, $digitosComplemento) {
        $sql = "select barrio_codpro|| barrio_cod  ||$idSuscripcion || '$digitosComplemento' pcodigo from barrios where barrio_ideregistro=$idBarrio";
        $resultado = $this->executeQuery($sql);
        return $resultado[0]['pcodigo'];
    }

    function validaNuevoPcodigo($pCodigo) {
        $sql = " select dsus_ideregistr idsuscripcion from dsus_detsuscrip where dsus_pcodigo = '$pCodigo'";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            return 1;
        }
        return 0;
    }

    public function setSuscripcionCodigoAnteriorFormulado($idSuscripcion, $pCodigo) {
        $sql = "update dsus_detsuscrip set 
                dsus_pcodigo= '$pCodigo' 
                where dsus_ideregistr=$idSuscripcion";
        $this->executeQuery($sql);
    }

    public function actualizarInformacionClientesTecsoft($idsuscripcion){
        $condicion = "dsus.dsus_ideregistr= $idsuscripcion ";
        $sql = "update clientes set cliente_tipins = dataactualizar.tipousoprisma,
                                    cliente_estsus=dataactualizar.estratoprisma,
                                    cliente_nit=dataactualizar.cedula
            FROM (
                    SELECT
                      dsus.dsus_pcodigo pcodigo,
                      dsus.pro_catestrato estratoprisma,
                            cli.cliente_estsus estratotecsoft,
                      trim(tipins.uni_nombre3) tipousoprisma,
                      cli.cliente_tipins tipousotecsoft,
                      emp.empresa_cod empresa,
                      ter.ter_documento cedula
                    FROM dsus_detsuscrip dsus
                            INNER JOIN empresas emp on emp.empresa_sevemp = dsus.emp_ideregistro
                            INNER JOIN uni_unidad tipins ON tipins.uni_ideregistro = dsus.uni_tipusosuscr
                            INNER JOIN clientes cli on cli.cliente_codsus = dsus.dsus_pcodigo
                                                   and cli.cliente_codemp  = emp.empresa_cod
                            INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
                    WHERE $condicion 
                                and (cli.cliente_estsus::int <> dsus.pro_catestrato or
                                                 cli.cliente_tipins <> tipins.uni_nombre3)
                 ) as dataactualizar
               WHERE dataactualizar.pcodigo= cliente_codsus and dataactualizar.empresa= cliente_codemp ";
        $this->executeQuery($sql);
        
    }

    public function actualizarInformacionVentasTecsoft($idsuscripcion){
        $condicion = "dsus.dsus_ideregistr= $idsuscripcion ";
        $sql = "update ventas set venta_tipins = dataactualizar.tipousoprisma,
                              venta_estsus=dataactualizar.estratoprisma
               FROM (
                    SELECT
                      dsus.dsus_pcodigo pcodigo,
                      dsus.pro_catestrato estratoprisma,
                            ven.venta_estsus estratotecsoft,
                      trim(tipins.uni_nombre3) tipousoprisma,
                      ven.venta_tipins tipousotecsoft,
                      emp.empresa_cod empresa
                    FROM dsus_detsuscrip dsus
                      INNER JOIN empresas emp on emp.empresa_sevemp = dsus.emp_ideregistro
                            INNER JOIN uni_unidad tipins ON tipins.uni_ideregistro = dsus.uni_tipusosuscr
                            INNER JOIN ventas ven on ven.venta_codsus = dsus.dsus_pcodigo
                                                                                                     and ven.venta_codemp  = emp.empresa_cod
                    WHERE $condicion 
                                and (ven.venta_estsus::int <> dsus.pro_catestrato or
                                     ven.venta_tipins <> tipins.uni_nombre3)
                  ) as dataactualizar
               WHERE dataactualizar.pcodigo= venta_codsus and dataactualizar.empresa= venta_codemp";
        $this->executeQuery($sql);
    }

    public function getPermisoLineaMatriz($idEmpresa, $idUsuario, $idPrograma, $ideUnidad) {
        $parametros['idusuario'] = $idUsuario;
        $parametros['idprograma'] = $idPrograma;
        $parametros['idunidad'] = $ideUnidad;
        $sql = "SELECT COALESCE( (select prun.uni_ideregistro idunidad
                from prun_prgunidad  prun
                INNER JOIN uspu_usuprgunid  uspu on uspu.prun_ideregistr = prun.prun_ideregistr
                where uspu.usu_ideregistro = :idusuario   and prun.prg_ideregistro = :idprograma and prun.uni_ideregistro = :idunidad) ,0) idunidad";
        $ideUNidad = $this->executeQuery($sql, $parametros);
        return $ideUNidad[0];
    }

    public function getClienteVinculadoLineaMatriz($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT dsus.dsus_ideregistr idsuscripcion, dsus.dsus_ideregistr::varchar||' - '||ter.ter_nomcompleto||' - '||pro.pro_direccion||' '||COALESCE(uni.uni_nombre1,'')||' - '||dsus.dsus_pcodigo  suscripcionesvinculadas, dsma.dsma_porcentaje porcentaje
                from dsma_detsuscripmatriz dsma
                inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=dsma.dsus_ideregistr
                inner join ter_tercero ter on ter.ter_ideregistro=dsus.ter_ideregistro
                inner join pro_propiedad pro on pro.pro_ideregistro=dsus.pro_ideregistro
                left join uni_unidad uni on uni.uni_ideregistro=pro.uni_cmpdireccion
                where dsma.dsus_idematriz= :idsuscripcion and dsma.dsma_estado='A' and dsus.dsus_estado<>'E';";
        return $this->executeQuery($sql, $parametros);
    }
    public function getVinculadoLineaMatriz($idSuscripcion) {
        
        $complemento = "";
        $parametros['idsuscripcionmatriz'] = $idSuscripcion['idSuscripcionMatriz'];
        $parametros['idempresa'] = $idSuscripcion['idempresa'];
        if(!empty($idSuscripcion['ideSuscripcionVinciular'])){
            $complemento =  ' and dsus.dsus_ideregistr = '.$idSuscripcion['ideSuscripcionVinciular']. ' ';
        }
        if(!empty($idSuscripcion['nombreVincular'])){
            $complemento =  " and ter.ter_nomcompleto ilike '%". $idSuscripcion['nombreVincular']. "%' ";
        }
        if(!empty($idSuscripcion['pcodicoVincular'])){
            $complemento =  "and dsus.dsus_pcodigo ilike '%". $idSuscripcion['pcodicoVincular']. "%' "; 
        }
        if(!empty($idSuscripcion['direcionVincular'])){
            $complemento = " and pro.pro_direccion ilike '%". $idSuscripcion['direcionVincular']. "%' ";
        }
       
        $sql = "SELECT distinct dsus.dsus_ideregistr idesuscripcion, ter.ter_nomcompleto||' - '||pro.pro_direccion||' '||COALESCE(uni.uni_nombre1,'')||' - '||dsus.dsus_pcodigo suscripcion
                from dsus_detsuscrip dsus
                inner join ter_tercero ter on ter.ter_ideregistro=dsus.ter_ideregistro
                inner join pro_propiedad pro on pro.pro_ideregistro=dsus.pro_ideregistro
                  left join uni_unidad uni on uni.uni_ideregistro=pro.uni_cmpdireccion
                WHERE  dsus.dsus_estado<>'E' and
                dsus.dsus_ideregistr not in (select dsma.dsus_ideregistr from dsma_detsuscripmatriz dsma where  
                dsma.dsus_idematriz= :idsuscripcionmatriz and dsma.dsma_estado='A') ".$complemento.
                "  and dsus.emp_ideregistro =  :idempresa  limit 100";
        return  $this->executeQuery($sql, $parametros);
    }
    
     public function setRetiraClienteMatriz($idSuscripcion) {
         $parametros['idsuscripcionvinculada'] = $idSuscripcion['idsuscripcionVinculada'];
         $parametros['idsuscripcionmatri'] = $idSuscripcion['idsuscripcionMatriz'];
         $parametros['idusuario'] = $idSuscripcion['idusuario'];
        $sql = "update dsma_detsuscripmatriz dsma
                set dsma_estado = 'I', dsma_fecha = now(), dsma_porcentaje = 0, usu_ideregistro = :idusuario
                where dsma.dsus_ideregistr = :idsuscripcionvinculada and  dsus_idematriz= :idsuscripcionmatri";
        $resultado = $this->executeQuery($sql,$parametros);
        if(empty($resultado)){
            throw new MyException('Error, No se retiro la vinculación', -1);
        }
        return $resultado;
    }
     public function validaSucripcionEstaVinculadaLineaMatriz($idSuscripcion) {
         $parametros['idsuscripcionvincula'] = $idSuscripcion['idsuscripcionVinculada'];
         $parametros['idsuscripcionmatriz'] = $idSuscripcion['idSuscripcionMatriz'];
         $parametros['idusuario'] = $idSuscripcion['idusuario'];
        $sql = "SELECT 'La suscripcion está vinculada a la linea matriz código: ' || 
                dsma.dsus_idematriz || ' Por favor Retirar Suscripción de linea matriz al usuario seleccionado ?...' vinculada
                from dsma_detsuscripmatriz dsma where dsma.dsus_ideregistr= :idsuscripcionvincula and dsma.dsus_idematriz <> :idsuscripcionmatriz";
        return  $this->executeQuery($sql,$parametros);
       
    }
     public function setSucripcionVinculadaLineaMatriz($idSuscripcion) {
         $parametros['idsuscripcionvincula'] = $idSuscripcion['idsuscripcionVinculada'];
         $parametros['idsuscripcionmatriz'] = $idSuscripcion['idSuscripcionMatriz'];
         $parametros['idusuario'] = $idSuscripcion['idusuario'];
        $sql = "update dsma_detsuscripmatriz dsma
                set dsma_estado = 'A', dsma_fecha = now(), dsma_porcentaje = 0, dsus_idematriz= :idsuscripcionmatriz,
                usu_ideregistro = :idusuario
                where dsma.dsus_ideregistr = :idsuscripcionvincula";
        return  $this->executeQuery($sql,$parametros);
       
    }
     public function insertSucripcionVinculadaLineaMatriz($idSuscripcion) {
         $parametros['idsuscripcionvincula'] = $idSuscripcion['idsuscripcionVinculada'];
         $parametros['idsuscripcionmatriz'] = $idSuscripcion['idSuscripcionMatriz'];
         $parametros['idusuario'] = $idSuscripcion['idusuario'];
        $sql = "insert INTO dsma_detsuscripmatriz
                (dsma_ideregistr,dsma_estado,dsma_fecha,dsma_porcentaje,dsus_ideregistr,dsus_idematriz,usu_ideregistro)
                values (nextval('sq_dsma_ideregistr'),'A',now(),0,:idsuscripcionvincula,:idsuscripcionmatriz,:idusuario)";
        $respuesta =   $this->executeQuery($sql,$parametros);
       return $respuesta[0];
    }
    
    public function setSecuenciaCliente($idSuscripcion) {
        $sql = "UPDATE rusu_rutsuscrip set rusu_rutsecuen = 0 WHERE dsus_ideregistr = $idSuscripcion";
        $this->executeQuery($sql);
    }
}
