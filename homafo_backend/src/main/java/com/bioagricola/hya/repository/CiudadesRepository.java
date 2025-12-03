package com.bioagricola.hya.repository;

import com.bioagricola.common.entity.Ciudades;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Clase repository de la entidad Ciudades
 *
 * @author dsolano
 */
@Repository
public interface CiudadesRepository extends JpaRepository<Ciudades, String> {
    /**
     * Consulta listado de ciudades por parametro nombre
     *
     * @param nombre parametro nombre ciudad
     * @return listado de ciudades que coinciden con la busqueda
     */
    @Query(value = "select ciu.ciudad_cod,concat(ciu.ciudad_nom,' - ', dep.departamento_nom) as name " +
            "from ciudades ciu " +
            "inner join departamentos dep on ciudad_coddep=departamento_cod " +
            "where ciudad_nom ilike :nombre ", nativeQuery = true)
    List<Object[]> buscaCiudadCoincide(@Param("nombre") String nombre);

    /**
     * Consulta nombre ciudad por codigo
     *
     * @param ciudadCod codigo ciudad
     * @return nombre ciudad
     */
    @Query(value = "select concat(ciu.ciudad_nom,' - ', dep.departamento_nom) as name  " +
            "from ciudades ciu  " +
            "inner join departamentos dep on ciudad_coddep=departamento_cod  " +
            "where ciu.ciudad_cod=:ciudadCod ", nativeQuery = true)
    Optional<String> buscaNomCiudadPorId(String ciudadCod);

    @Query(value = "select c from Ciudades c order by c.ciudadNom asc")
    List<Ciudades> findAll();
}
