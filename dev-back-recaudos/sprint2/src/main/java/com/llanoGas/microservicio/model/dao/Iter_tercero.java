package com.llanoGas.microservicio.model.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.llanoGas.microservicio.Entity.Ter_tercero;


public interface Iter_tercero   extends JpaRepository<Ter_tercero,Integer> { 
	 
	@Query(value = "select tt.ter_documento,tt.ter_nomcompleto,tt.ter_ideregistro from ter_tercero tt  inner join clte_clatercero cc  on cc.ter_ideregistro  = tt.ter_ideregistro inner join uni_unidad uu  on uu.uni_ideregistro  = cc.uni_clatercero where   uu.uni_ideregistro in (select uni_unidad.uni_ideregistro from uni_unidad inner join prun_prgunidad on uni_unidad.uni_ideregistro=prun_prgunidad.uni_ideregistro inner join uspu_usuprgunid on  prun_prgunidad.prun_ideregistr=uspu_usuprgunid.prun_ideregistr where   prun_prgunidad.uni_ideregistro = :#{#unidad} and prun_prgunidad.prg_ideregistro = :#{#programa}  and  uspu_usuprgunid.usu_ideregistro= :#{#usuario} ) ",nativeQuery = true)	
    public List<Ter_tercero> TerceroEntidad(int unidad,int programa,int usuario);
    //unidad es la unidad bancaria que tiene como clase

}
