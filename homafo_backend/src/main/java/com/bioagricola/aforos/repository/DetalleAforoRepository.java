package com.bioagricola.aforos.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bioagricola.aforos.entity.DetalleAforo;


@Repository
@Transactional
public interface DetalleAforoRepository  extends CrudRepository<DetalleAforo,Long>,JpaSpecificationExecutor<DetalleAforo>{


	List<DetalleAforo> findByAforo_afoIderegistro(Long afoIderegistro);
}

