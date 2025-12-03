package com.bioagricola.common.repository;

import com.bioagricola.common.entity.ParParametro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ParParametroRepository extends JpaRepository<ParParametro,Long>,JpaSpecificationExecutor<ParParametro> {
	
	public static String esquemaAseo = "aseo";
	Optional<ParParametro> findByEmpIderegistro(Integer empIdregistro);
	
	@Query(value="SELECT par_parametro->>:APP FROM par_parametro WHERE emp_ideregistro = :EMPRESA",nativeQuery=true)
	String getParParametro(@Param("APP")String app,@Param("EMPRESA")Long empresa);
	
	@Query(value="SELECT\n" + 
			"* \n" + 
			"FROM "+esquemaAseo+".fn_getparametroshomosolo(:empresa)\n" + 
			"",nativeQuery = true)
	List<Object[]> parametroValorHomologacion(@Param("empresa") Integer empresa);
	
	@Query(value="SELECT\n" + 
			"* \n" + 
			"FROM "+esquemaAseo+".fn_getparametrosaforossolo(:empresa)\n" + 
			"",nativeQuery = true)
	List<Object[]> parametroValorAforo(@Param("empresa") Integer empresa);
	
	@Query(value="SELECT\n" + 
			"Cast(par_parametro->'CONFIGURACION_GENERAL' as TEXT)\n" + 
			"FROM par_parametro WHERE emp_ideregistro= :empresa" + 
			"",nativeQuery = true)
	List<String> parametrosConfiguracion(@Param("empresa") Integer empresa);

	@Query(value="select cast (par.par_parametro as varchar) from par_parametro par where par.emp_ideregistro=:idempresa", nativeQuery = true)
	String findParametrosByCompany(@Param("idempresa")Integer idempresa);
}
