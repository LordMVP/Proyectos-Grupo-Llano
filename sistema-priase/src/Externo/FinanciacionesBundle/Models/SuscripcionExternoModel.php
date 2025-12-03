<?php

namespace Externo\FinanciacionesBundle\Models;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use const CLASE_EMPRESAS_EXTERNAS;

/**
 * Description of SeguridadModels
 *
 * @author god
 */
class SuscripcionExternoModel extends AuditoriaServices {

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
     * @param Connection 
     */
    public function __construct(&$conexion, array $sesion) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
    }

    /**
     * Consulta las empresas que prestan el servicio 
     * @return array 
     */
    public function consultarEmpresasServicio() {
        $sql = "(SELECT DISTINCT
                    empfactura.empresa_nom,
                    empfactura.empresa_sevemp,
                    cnrefactura.cnre_ideregistr cnre_ideregistr
                  from cnre_cnvrecaudo cnrefactura
                    inner join dicn_disconven dicnfactura on dicnfactura.cnre_ideregistr = cnrefactura.cnre_ideregistr
                                                             and dicnfactura.dicn_empfactura = 'S'
                    inner join empresas empfactura on dicnfactura.emp_ideregistro = empfactura.empresa_sevemp
                    inner join ter_tercero ter on ter.ter_documento = empfactura.empresa_cod
                    inner join clte_clatercero clte on clte.ter_ideregistro = ter.ter_ideregistro
                  where clte.uni_clatercero = :clase and cnrefactura.cnre_ideregistr in
                                                         (SELECT distinct dicn.cnre_ideregistr
                                                          from cnre_cnvrecaudo cnre
                                                            inner JOIN dicn_disconven dicn on cnre.cnre_ideregistr = dicn.cnre_ideregistr
                                                            inner JOIN dicn_disconven dicnfinancia
                                                              on dicn.cnre_ideregistr = dicnfinancia.cnre_ideregistr
                                                          where dicn.emp_ideregistro = :idempfinancia))
                 UNION
                 (SELECT
                    empfactura.empresa_nom,
                    empfactura.empresa_sevemp,
                    convenio.cnre_ideregistr cnre_ideregistr
                  from empresas empfactura
                    inner join (select DISTINCT
                                  dicn.emp_ideregistro,
                                  dicn.cnre_ideregistr
                                from dicn_disconven dicn)
                      as convenio on convenio.emp_ideregistro = empfactura.empresa_sevemp
                  where empfactura.empresa_sevemp = :idempfinancia
                        and (SELECT count(*)
                             from dicn_disconven dicnempresa
                             where
                               dicnempresa.cnre_ideregistr = convenio.cnre_ideregistr and dicnempresa.emp_ideregistro <> :idempfinancia)
                            = 0
                  ORDER BY cnre_ideregistr
                  limit 1)";
        $parametros = array('clase' => CLASE_EMPRESAS_FACTURA_COMPRA_CARTERA);
        $parametros['idempfinancia'] = $this->sesion['idempresa'];
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta la información del tercero relacionada a una suscripción 
     * 
     * @param int $idSuscripcion identificador de la suscripción 
     * @return array información del tercero
     */
    public function consultarSuscripcionTercero($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $sql = "SELECT DISTINCT
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
                        ciudad.ciudad_nom lugarexpedicion,
                        ter.ter_fecnacimiento fechanacimiento
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
                                SELECT 
                                        uspr.uni_municipio
                                FROM
                                        uspr_usuprgpryto uspr
                                WHERE
                                        uspr.usu_ideregistro =:idusuario
                        )
                        AND dsus.dsus_ideregistr = :idsuscripcion 
                        AND dsus.dsus_estado  in ('A','P')";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error: la suscripción no se encontró', -1);
        }
        return $resultado[0];
    }

    /**
     * Consulta la información de la propiedad
     * @param int $idSuscripcion identificador de la suscripción 
     * @return array información de la propiedad 
     * @throws MyException Error al momento de ejecutar la sentencia  o que la
     * suscripción no exista
     */
    public function consultarSuscripcionPropiedad($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $sql = "SELECT
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
                        pro.pro_altriesgo altoriesgo
                FROM
                        pro_propiedad pro
                INNER JOIN uni_unidad uni ON pro.uni_tippropieda = uni.uni_ideregistro
                INNER JOIN proyectos pry ON pry.proyecto_ideregistro = pro.uni_municipio
                LEFT JOIN departamentos dep ON pry.departamento_ideregistro = dep.departamento_ideregistro
                INNER JOIN barrios bar ON bar.barrio_ideregistro = pro.uni_barrio
                INNER JOIN dsus_detsuscrip dsus ON pro.pro_ideregistro = dsus.pro_ideregistro
                WHERE
                        dsus.dsus_ideregistr =:idsuscripcion 
                        AND dsus.dsus_estado  in ('A','P')
                        AND dsus.uni_municipio IN (
                                SELECT 
                                        uspr.uni_municipio
                                FROM
                                        uspr_usuprgpryto uspr
                                WHERE
                                        uspr.usu_ideregistro =:idusuario
                        )";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error: La suscripción no tiene asociada una propiedad', -1);
        }
        return $resultado[0];
    }

    /**
     * Consulta toda la información de la suscripción 
     * @param type $idSuscripcion identificador o código anterior de la suscripción 
     * 
     * @return array Devuelve la información de la suscripción 
     * @throws MyException
     */
    public function consultarSuscripcionDetalle($idSuscripcion) {

        $parametros['idsuscripcion'] = "" . $idSuscripcion;
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['idusuario'] = $this->sesion['idusuario'];

        $sql = "select dsus.dsus_ideregistr idsuscripcion, rut.rut_ideregistro idruta, rut.rut_nombre ||' - '|| rusu.rusu_rutsecuen ruta,cic.cic_ideregistro idciclo,
                 cic.cic_nombre ciclo,tsu.uni_tipsuscripc idtiposuscripcion,tsu.tsu_nombre tiposuscripcion, 
                 cic.cic_anoactual cicloanio, dsus.dsus_fecinicio fechainicio,dsus.dsus_descripcion descripcion,
                 uni.uni_nombre1 tipousosuscripcion, uni.uni_ideregistro idtipousosuscripcion, sus_ideregistro idsus,
                 dsus.pro_catestrato estrato, dsus.dsus_estado estado,dsus.dsus_factor factorcorreccion,dsus.dsus_pcodigo codigoanterior,
                 liq.uni_liquidacion idliquidacion, liq.liq_nombre liquidacion,per.per_ideregistro idperiodo, per.per_nombre periodo,
                dsus.uni_actsuscripc idactividadeconomica, uniact.uni_nombre1 actividadeconomica,
                ( per.per_fecfinal::Date - now()::Date) diasterminoperiodo , 
                 to_char(dsus.dsus_fecinicio,'YYYY/MM/DD') fecinicio , to_char(now(),'YYYY/MM/DD') fecfinal
              from dsus_detsuscrip dsus left join  rusu_rutsuscrip rusu on dsus.dsus_ideregistr=rusu.dsus_ideregistr
                 left join rut_ruta rut on rusu.rut_ideregistro=rut.rut_ideregistro
                 inner join cic_ciclo cic on dsus.cic_ideregistro=cic.cic_ideregistro
                 inner join tsu_tipsuscripc tsu on dsus.uni_tipsuscripc=tsu.uni_tipsuscripc
                 inner join uni_unidad uni on dsus.uni_tipusosuscr= uni.uni_ideregistro
                 inner join liq_liquidacion liq on liq.uni_liquidacion=dsus.uni_liquidacion 
                 inner join per_periodo per on cic.cic_ideregistro=per.cic_ideregistro
                 left join uni_unidad uniact on dsus.uni_actsuscripc = uniact.uni_ideregistro
              where
                 (dsus.dsus_ideregistr::CHARACTER VARYING = :idsuscripcion OR dsus.dsus_pcodigo = :idsuscripcion )
                 AND per.per_estado = 'A' 
                 AND emp_ideregistro = :idempresa
                 AND dsus.uni_municipio IN (
                                SELECT 
                                        uspr.uni_municipio
                                FROM
                                        uspr_usuprgpryto uspr
                                WHERE
                                        uspr.usu_ideregistro =:idusuario)";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error, No se puede consultar la información de la suscripción', -1);
        }
        return $resultado[0];
    }

    /**
     * Se realiza la consulta de la empresa respecto a una suscripción 
     * @param int $idSuscripcion Identificador de la empresa
     * @return array información de la empresa
     * @throws MyException Si no encuentra la información de la empresa
     */
    public function consultarEmpresa($idSuscripcion) {
        $sql = 'SELECT
                    emp.empresa_sevemp idempresa,
                    emp.empresa_nom    nombreempresa
                FROM
                    dsus_detsuscrip dsus
                    INNER JOIN empresas emp ON dsus.emp_ideregistro = emp.empresa_sevemp
                WHERE dsus.dsus_ideregistr = :idsuscripcion';
        $resultado = $this->executeQuery($sql, array('idsuscripcion' => $idSuscripcion));
        if (empty($resultado)) {
            throw new MyException('Error: No se encontró la información de la empresa', -1);
        }
        return $resultado[0];
    }


}
