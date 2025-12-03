package com.bioagricola.homologaciones.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.common.entity.Empresas;

public interface EmpresasRepository extends JpaRepository<Empresas,Long>,JpaSpecificationExecutor<Empresas>
{
	@Query(value = "SELECT\n" + 
			"DISTINCT empresa_sevemp,\n" + 
			"empresa_nom\n" + 
			"FROM dicn_disconven CONVENIOS\n" + 
			"inner join empresas emp on emp.empresa_sevemp = CONVENIOS.emp_ideregistro\n" + 
			"inner join lateral (\n" + 
			"select\n" + 
			"cnre_ideregistr,\n" + 
			"emp_ideregistro\n" + 
			"from dicn_disconven\n" + 
			"where emp_ideregistro = :empresa and CONVENIOS.cnre_ideregistr = cnre_ideregistr\n" + 
			") conveniosempresasesion ON conveniosempresasesion.cnre_ideregistr=CONVENIOS.cnre_ideregistr --conveniosempresasesion on conveniosempresasesion.emp_ideregistro != CONVENIOS.emp_ideregistro",nativeQuery = true)
	List<Object[]> listaEmpresasAlternas(@Param("empresa") Integer empresa);
	
	@Query(value = "SELECT\n" + 
			"DISTINCT empresa_sevemp,\n" + 
			"empresa_nom\n" + 
			"FROM dicn_disconven CONVENIOS\n" + 
			"inner join empresas emp on emp.empresa_sevemp = CONVENIOS.emp_ideregistro\n" + 
			"inner join lateral (\n" + 
			"select\n" + 
			"cnre_ideregistr,\n" + 
			"emp_ideregistro\n" + 
			"from dicn_disconven\n" + 
			"where emp_ideregistro = :empresa and CONVENIOS.cnre_ideregistr = cnre_ideregistr\n" + 
			") conveniosempresasesion on conveniosempresasesion.emp_ideregistro != CONVENIOS.emp_ideregistro WHERE emp.empresa_homaseo=TRUE",nativeQuery = true)
	List<Object[]> listaEmpresasAlternasHomologablesOld(@Param("empresa") Integer empresa);
	
	@Query(value="SELECT\n" + 
			"cnre.cnre_ideregistr,\n" + 
			"cnre.cnre_nombre,\n" + 
			"dicn.dicn_empfactura\n" +
			"FROM cnre_cnvrecaudo cnre\n" + 
			"INNER JOIN dicn_disconven dicn ON dicn.cnre_ideregistr=cnre.cnre_ideregistr\n" + 
			"WHERE emp_ideregistro= :empresa",nativeQuery = true)
	List<Object[]> listaConvenios(@Param("empresa") Integer empresa);
	
	@Query(value="SELECT\n" + 
			"			DISTINCT\n" + 
			"			cnre.cnre_ideregistr,\n" + 
			"			cnre.cnre_nombre,\n" + 
			"			dicn.dicn_empfactura\n" + 
			"			FROM cnre_cnvrecaudo cnre\n" + 
			"			INNER JOIN dicn_disconven dicn ON dicn.cnre_ideregistr=cnre.cnre_ideregistr\n" + 
			"			INNER JOIN LATERAL(\n" + 
			"			SELECT\n" + 
			"			cnre2.cnre_ideregistr as cnreIde,\n" + 
			"			cnre2.cnre_nombre,\n" + 
			"			dicn2.dicn_empfactura\n" + 
			"			FROM cnre_cnvrecaudo cnre2\n" + 
			"			INNER JOIN dicn_disconven dicn2 ON dicn2.cnre_ideregistr=cnre2.cnre_ideregistr\n" + 
			"			WHERE dicn2.emp_ideregistro= :empresaAlterna\n" + 
			"			) alterna ON alterna.cnreIde=cnre.cnre_ideregistr\n" + 
			"			WHERE dicn.emp_ideregistro= :empresa ORDER BY cnre.cnre_ideregistr DESC",nativeQuery = true)
	List<Object[]> listaConveniosHomologables(@Param("empresa") Integer empresa,@Param("empresaAlterna") Integer empresaAlterna);
	
	@Query(value="SELECT\n" + 
			"emp2.empresa_nom\n" + 
			"FROM dsus_detsuscrip dsus2\n" + 
			"INNER JOIN empresas emp2 ON emp2.empresa_sevemp=dsus2.emp_ideregistro\n" + 
			"WHERE dsus2.sus_ideregistro= :suscripcion \n" + 
			"AND dsus2.emp_ideregistro!= :empresa \n" + 
			"ORDER BY dsus2.emp_ideregistro DESC\n" + 
			"LIMIT 1",nativeQuery = true)
	String empresaAlternaDsus(@Param("suscripcion") Integer suscripcion, @Param("empresa") Integer empresa);
	
	Optional<Empresas> findByEmpresaSevemp(Long empresaSevemp);
	
	@Query(value="SELECT\n" + 
			"table_schema,\n" + 
			"  table_name\n" + 
			"FROM\n" + 
			"  information_schema.tables\n" + 
			"WHERE\n" + 
			"  table_schema IN ('public','aseo')\n" + 
			"ORDER BY  table_name ASC",nativeQuery=true)
	List<Object[]> tablasBaseDatos();
	
	@Query(value = "SELECT\n" + 
			"DISTINCT empresa_sevemp,\n" + 
			"empresa_nom\n" + 
			"FROM dicn_disconven CONVENIOS\n" + 
			"inner join empresas emp on emp.empresa_sevemp = CONVENIOS.emp_ideregistro\n" + 
			"inner join lateral (\n" + 
			"select\n" + 
			"cnre_ideregistr,\n" + 
			"emp_ideregistro\n" + 
			"from dicn_disconven\n" + 
			"where emp_ideregistro = :empresa and CONVENIOS.cnre_ideregistr = cnre_ideregistr\n" + 
			") conveniosempresasesion on CONVENIOS.cnre_ideregistr = conveniosempresasesion.cnre_ideregistr WHERE emp.empresa_homaseo=TRUE",nativeQuery = true)
	List<Object[]> listaEmpresasAlternasHomologables(@Param("empresa") Integer empresa);
	
	@Query(value="SELECT  \n" + 
			"									DISTINCT  \n" + 
			"									cnre.cnre_ideregistr,  \n" + 
			"									cnre.cnre_nombre,  \n" + 
			"									dicn.dicn_empfactura,\n" + 
			"									alterna.empresafac\n" + 
			"									FROM cnre_cnvrecaudo cnre  \n" + 
			"									INNER JOIN dicn_disconven dicn ON dicn.cnre_ideregistr=cnre.cnre_ideregistr  \n" + 
			"									INNER JOIN LATERAL(  ---sacamos los convenios de las empresa que facturan para cruzar con la empresa de la sesion\n" + 
			"									SELECT  \n" + 
			"									DISTINCT cnre2.cnre_ideregistr as cnreIde,  \n" + 
			"									cnre2.cnre_nombre,  \n" + 
			"									dicn2.dicn_empfactura ,\n" + 
			"									dicn2.emp_ideregistro as empresafac\n" + 
			"									FROM cnre_cnvrecaudo cnre2  \n" + 
			"									INNER JOIN dicn_disconven dicn2 ON dicn2.cnre_ideregistr=cnre2.cnre_ideregistr  \n" + 
			"									INNER JOIN (---saber que empresas facturan y saber que convenios tomamos\n" + 
			"										SELECT\n" + 
			"											DISTINCT dicn3.emp_ideregistro as ideempresa\n" + 
			"											FROM cnre_cnvrecaudo cnre3\n" + 
			"											INNER JOIN dicn_disconven dicn3 ON dicn3.cnre_ideregistr=cnre3.cnre_ideregistr\n" + 
			"											INNER JOIN sus_suscripcion sus3 ON sus3.cnre_ideregistr=cnre3.cnre_ideregistr\n" + 
			"											WHERE sus3.sus_ideregistro=:suscripcion \n" + 
			"											AND dicn3.dicn_empfactura='S' \n" + 
			"									) empresafactura ON empresafactura.ideempresa=dicn2.emp_ideregistro\n" + 
			"									AND dicn2.dicn_empfactura='S'\n" + 
			"									) alterna ON alterna.cnreIde=cnre.cnre_ideregistr \n" + 
			"									WHERE dicn.emp_ideregistro= :empresa ORDER BY cnre.cnre_ideregistr DESC",nativeQuery = true)
	List<Object[]> listaConveniosHomologablesDsus(@Param("empresa") Integer empresa, @Param("suscripcion") Integer suscripcion);
	
	@Query(value="SELECT   \n" + 
			"												DISTINCT   \n" + 
			"												cnre.cnre_ideregistr,   \n" + 
			"												cnre.cnre_nombre,   \n" + 
			"												dicn.dicn_empfactura, \n" + 
			"												alterna.empresafac \n" + 
			"												FROM cnre_cnvrecaudo cnre   \n" + 
			"												INNER JOIN dicn_disconven dicn ON dicn.cnre_ideregistr=cnre.cnre_ideregistr   \n" + 
			"												INNER JOIN LATERAL(  ---sacamos los convenios de las empresa que facturan para cruzar con la empresa de la sesion \n" + 
			"												SELECT   \n" + 
			"												DISTINCT cnre2.cnre_ideregistr as cnreIde,   \n" + 
			"												cnre2.cnre_nombre,   \n" + 
			"												dicn2.dicn_empfactura , \n" + 
			"												dicn2.emp_ideregistro as empresafac \n" + 
			"												FROM cnre_cnvrecaudo cnre2   \n" + 
			"												INNER JOIN dicn_disconven dicn2 ON dicn2.cnre_ideregistr=cnre2.cnre_ideregistr   \n" + 
			"												INNER JOIN (---saber que empresas facturan y saber que convenios tomamos \n" + 
			"													SELECT\n" + 
			"														emp3.empresa_nom,\n" + 
			"														emp3.empresa_cod,\n" + 
			"														emp3.empresa_sevemp as ideempresa\n" + 
			"														FROM empresas emp3\n" + 
			"														WHERE emp3.empresa_sevemp= :empresa \n" + 
			"												) empresafactura ON empresafactura.ideempresa=dicn2.emp_ideregistro \n" + 
			"												AND dicn2.dicn_empfactura='S' \n" + 
			"												) alterna ON alterna.cnreIde=cnre.cnre_ideregistr  \n" + 
			"												WHERE dicn.emp_ideregistro= :empresa ORDER BY cnre.cnre_ideregistr ASC",nativeQuery = true)
	List<Object[]> listaConveniosDesHomologables(@Param("empresa") Integer empresa);
	
	@Query(value="SELECT\n" + 
			"DISTINCT dsus.emp_ideregistro\n" + 
			"FROM dsus_detsuscrip dsus\n" + 
			"INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro=dsus.sus_ideregistro\n" + 
			"WHERE sus.sus_ideregistro= :suscripcion",nativeQuery = true)
	List<Object[]> listaEmpresasSuscripcion(@Param("suscripcion") Integer suscripcion);

	@Query(value = "select emp.empresa_nom from empresas emp where emp.empresa_sevemp=:sevemp ", nativeQuery = true)
	String findNombreBySevemp(@Param("sevemp")Integer sevemp);
	
	
	
}
