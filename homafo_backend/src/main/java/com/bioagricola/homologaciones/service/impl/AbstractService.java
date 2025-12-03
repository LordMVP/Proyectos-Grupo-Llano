package com.bioagricola.homologaciones.service.impl;

import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public abstract class AbstractService<E,ID> {
	
	@SuppressWarnings("unused")
	private Class<E> modelClass;
	public AbstractService(Class<E> modelClass) {
		// TODO Auto-generated constructor stub
		this.modelClass = modelClass;
	}
	
	public E save(E entity) {
		return this.getRepository().save(entity);	
	}
	
	public Optional<E> findByIdOptional(ID id){
		return this.getRepository().findById(id);
	}
	
	public E findById(ID id){
		return this.getRepository().findById(id).orElseThrow(()-> new EntityNotFoundException());
	}
	
	public Page<E> findAll(Pageable pageable){
		return this.getRepository().findAll(pageable);
	}
	
	/*public Page<E> findAll(Specification<E> specification,Pageable pageable){
		return this.getRepository().findAll(specification,pageable);
	}*/
	
	protected abstract JpaRepository<E, ID> getRepository();

}
