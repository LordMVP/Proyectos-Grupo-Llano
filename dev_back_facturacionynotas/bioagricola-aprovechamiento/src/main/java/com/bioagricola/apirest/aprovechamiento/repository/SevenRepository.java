package com.bioagricola.apirest.aprovechamiento.repository;

import com.bioagricola.apirest.aprovechamiento.model.SevenDataDto;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.math.BigDecimal;

@Repository
public class SevenRepository {
    @PersistenceContext(unitName = "secondarydatasource")
    EntityManager entityManager;

    public SevenDataDto sevenData(int mes, int anio, int codEmpr, int pcodConf) {
        SevenDataDto sevenDataDto = new SevenDataDto();
        String sql = "select " +
            "	cod_empr, ano, mes, cod_concf, nom_concf," +
            "	COALESCE(valor_proyectado, 0) as valor_proyectado," +
            "	COALESCE(valor_ejecutado,0) as valor_ejecutado " +
            "from fn_get_priase_aprov_presupuesto(:mes, :anio, :codEmpr, :pcodConf) ";
        Query query = entityManager
                .createNativeQuery(sql);
        Object[] singleResult = (Object[]) query.setParameter("mes", mes)
                .setParameter("anio", anio)
                .setParameter("codEmpr", codEmpr)
                .setParameter("pcodConf", pcodConf)
                .getSingleResult();

        if (singleResult != null) {
            sevenDataDto.setCodeCompany((Short) singleResult[0]);
            sevenDataDto.setYear((Short) singleResult[1]);
            sevenDataDto.setMonth((Short) singleResult[2]);
            sevenDataDto.setCodeConcf((Integer) singleResult[3]);
            sevenDataDto.setNameConcf((String) singleResult[4]);
            sevenDataDto.setProjectedValue(new BigDecimal(String.valueOf(singleResult[5])));
            sevenDataDto.setExecutedValue(new BigDecimal(String.valueOf(singleResult[6])));
        }

        return sevenDataDto;
    }

}
