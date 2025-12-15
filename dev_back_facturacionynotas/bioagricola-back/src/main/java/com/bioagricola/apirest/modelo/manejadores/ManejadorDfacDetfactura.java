package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.DfacDetfactura;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre la
 * tabla correspondiente a la entidad DfacDetfactura.
 *
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorDfacDetfactura
        extends ManejadorCrud<DfacDetfactura, Long>, IManejadorCrud<DfacDetfactura, Long> {

    @Query(value = "SELECT" + "                  SUM (dfac.dfac_vlrreal) valor" + "                FROM"
            + "                  dfac_detfactura dfac" + "                WHERE"
            + "                  dfac.fac_ideregistro = :idFactura", nativeQuery = true)
    public BigDecimal getValorFactura(Integer idFactura);

    @Modifying
    @Query(value = "INSERT INTO public.dfac_detfactura("
            + " dfac_estado,dfac_cantidad,dfac_vlrunitari,dfac_vlrtotal,dfac_vlrreal,dfac_sdoreal,fac_ideregistro,uni_concepto,dfac_version,"
            + " usu_ideregistro,dfac_ideorigen,damo_ideregistr,dfac_idepadre,dfin_ideregistr)"
            + " VALUES (:dfacestado,:dfaccantidad,:dfacvlrunitari,:dfacvlrtotal,:dfacvlrreal,:dfacsdoreal,:facideregistro,:uniconcepto,:dfacversion,"
            + " :usuideregistro,:dfacideorigen,:damoideregistr,:dfacidepadre,:dfinideregistr)", nativeQuery = true)
    @Transactional
    void insertarDetalleFactura(char dfacestado, Integer dfaccantidad, BigDecimal dfacvlrunitari,
                                BigDecimal dfacvlrtotal, BigDecimal dfacvlrreal, BigDecimal dfacsdoreal, BigInteger facideregistro,
                                Integer uniconcepto, Integer dfacversion, Integer usuideregistro, BigInteger dfacideorigen,
                                BigInteger damoideregistr, BigInteger dfacidepadre, BigInteger dfinideregistr);

    @Modifying
    @Query(value = "Update dfac_detfactura("
            + " dfac_estado,dfac_cantidad,dfac_vlrunitari,dfac_vlrtotal,dfac_vlrreal,dfac_sdoreal,fac_ideregistro,uni_concepto,dfac_version,"
            + " usu_ideregistro,dfac_ideregistr,dfac_ideorigen,damo_ideregistr,dfac_idepadre,dfin_ideregistr)"
            + " VALUES (:dfacestado,:dfaccantidad,:dfacvlrunitari,:dfacvlrtotal,:dfacvlrreal,:dfacsdoreal,:facideregistro,:uniconcepto,:dfacversion,"
            + " :usuideregistro,:dfacideregistr,:dfacideorigen,:damoideregistr,:dfacidepadre,:dfinideregistr)", nativeQuery = true)
    @Transactional
    void actualizarDetalleFactura(char dfacestado, Integer dfaccantidad, BigDecimal dfacvlrunitari,
                                  BigDecimal dfacvlrtotal, BigDecimal dfacvlrreal, BigDecimal dfacsdoreal, BigInteger facideregistro,
                                  Integer uniconcepto, Integer dfacversion, Integer usuideregistro, BigInteger dfacideregistr,
                                  BigInteger dfacideorigen, BigInteger damoideregistr, BigInteger dfacidepadre,
                                  BigInteger dfinideregistr);

    @Modifying
    @Query(value = "INSERT INTO dfci_detcarinforma (SELECT" + "            nextval('sq_dfci_ideregistr'),"
            + "            'A'," + "            :idFacturaCartera," + "            dfac.fac_ideregistro,"
            + "            dfac.dfac_ideregistr," + "            dfac.dfac_cantidad,"
            + "            dfac.dfac_vlrunitari," + "            dfac.dfac_vlrtotal," + "            dfac.dfac_vlrreal,"
            + "            dfac.dfac_sdoreal," + "            dfac.uni_concepto," + "            :idUsuario"
            + "          FROM"
            + "                  dfac_detfactura dfac INNER JOIN con_concepto con ON dfac.uni_concepto=con.uni_concepto"
            + "          WHERE" + "                  con.con_operacion='I' AND  dfac.fac_ideregistro = :idFactura"
            + "            AND dfac.dfac_idepadre is null)", nativeQuery = true)
    @Transactional
    void insertarDetallesInformativos(BigDecimal idFacturaCartera, Integer idUsuario, Integer idFactura);

    @Modifying
    @Query(value = "INSERT INTO dfcs_detcarsuma (SELECT" + "                nextval('sq_dfcs_ideregistr'),"
            + "                'A'," + "                :idFacturaCartera," + "                dfac.fac_ideregistro,"
            + "                dfac.dfac_ideregistr," + "                dfac.dfac_cantidad,"
            + "                dfac.dfac_vlrunitari," + "                dfac.dfac_vlrtotal,"
            + "                dfac.dfac_vlrreal," + "                dfac.dfac_sdoreal,"
            + "                dfac.uni_concepto," + "                :idUsuario" + "              FROM"
            + "                      dfac_detfactura dfac "
            + "                      INNER JOIN fac_factura fac ON fac.fac_ideregistro = dfac.fac_ideregistro"
            + "                      INNER JOIN con_concepto con ON dfac.uni_concepto=con.uni_concepto"
            + "              WHERE" + "                con.con_operacion='S' AND  dfac.fac_ideregistro = :idFactura"
            + "                AND fac.fac_idepadre is null AND dfac.dfac_sdoreal>0 )", nativeQuery = true)
    @Transactional
    void insertarDetallesSuma(BigDecimal idFacturaCartera, Integer idUsuario, Integer idFactura);

    @Query(value = "SELECT dd.dfacVlrtotal FROM DfacDetfactura dd "
            + "WHERE dd.facIderegistro =:facIderegistro and dd.uniConcepto =:uniConcepto ")
    public BigDecimal getValorTotalConcepto(@Param("facIderegistro") Long facIderegistro,
                                            @Param("uniConcepto") Integer uniConcepto);

    @Query("select dd.dfacVlrtotal from DfacDetfactura dd where dd.facIderegistro = :dfacIderegistr and dd.uniConcepto = :uniConcepto")
    List<BigDecimal> findAllVlrTotalByDfacIderegistrAndUniConcepto(@Param("dfacIderegistr") Long dfacIderegistr, @Param("uniConcepto") int uniConcepto);
    
    @Query("select dd.dfacVlrunitari from DfacDetfactura dd where dd.facIderegistro = :dfacIderegistr and dd.uniConcepto = :uniConcepto")
    List<BigDecimal> findAllVlrUnitariByDfacIderegistrAndUniConcepto(@Param("dfacIderegistr") Long dfacIderegistr, @Param("uniConcepto") int uniConcepto);

    @Query("select dd.dfacVlrtotal from DfacDetfactura dd where dd.dfacIderegistr = :dfacIderegistr and dd.uniConcepto = :uniConcepto")
    Optional<BigDecimal> vlrTotalByDfacIderegistrAndUniConcepto(@Param("dfacIderegistr") Long dfacIderegistr, @Param("uniConcepto") int uniConcepto);

    @Query("select dd from DfacDetfactura dd where dd.facIderegistro =:facIderegistro ")
    List<DfacDetfactura> findByFacIderegistro(@Param("facIderegistro") Long facIderegistro);

    @Query("select dd.dfacVlrtotal from DfacDetfactura dd " +
            "where dd.facIderegistro =:facIderegistro and dd.uniConcepto = :uniConcepto ")
    Optional<BigDecimal> getDfacVlrtotal(@Param("facIderegistro") Long facIderegistro, @Param("uniConcepto") Integer uniConcepto);

}
