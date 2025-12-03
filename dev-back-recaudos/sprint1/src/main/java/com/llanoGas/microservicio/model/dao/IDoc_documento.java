package com.llanoGas.microservicio.model.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import com.llanoGas.microservicio.Entity.Doc_documento;;

public interface IDoc_documento extends JpaRepository<Doc_documento,Integer>{
	
	//@Query(value = "SELECT con_concepto.con_operacion,con_concepto.con_pagpriori FROM public.usem_usuempresa inner join oppf_opcperfil on usem_usuempresa.pfi_ideregistro=oppf_opcperfil.pfi_ideregistro inner join prun_prgunidad on  oppf_opcperfil.prg_ideregistro=prun_prgunidad.prg_ideregistro inner join uspu_usuprgunid on prun_prgunidad.prun_ideregistr=uspu_usuprgunid.prun_ideregistr inner join uni_unidad on   uspu_usuprgunid.usu_ideregistro=uni_unidad.usu_ideregistro inner join con_concepto on uni_unidad.uni_ideregistro=con_concepto.uni_concepto where usem_usuempresa.usu_ideregistro= :#{#usuario} and usem_usuempresa.emp_ideregistro= :#{#empresa} and oppf_opcperfil.pfi_ideregistro= :#{#perfil} ",nativeQuery = true)
		@Query(value = " SELECT *  FROM public.uni_unidad inner join esem_estempresa  on uni_unidad.est_ideregistro = esem_estempresa.est_ideregistro inner join doc_documento  on uni_unidad.uni_ideregistro = doc_documento.uni_documento inner join prun_prgunidad on doc_documento.uni_documento=prun_prgunidad.uni_ideregistro inner join uspu_usuprgunid on   prun_prgunidad.prun_ideregistr=uspu_usuprgunid.prun_ideregistr where uspu_usuprgunid.usu_ideregistro=:#{#usuario} and esem_estempresa .emp_ideregistro= :#{#empresa} and  prun_prgunidad.prg_ideregistro= :#{#programa} and doc_documento.doc_recaudo= 'S'  order by doc_pagpriori",nativeQuery = true)	
	    public List<Doc_documento> listaDocumento( int usuario, int empresa,  int programa);
	    

}
