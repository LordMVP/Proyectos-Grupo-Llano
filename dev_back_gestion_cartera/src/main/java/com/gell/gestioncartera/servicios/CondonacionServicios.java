package com.gell.gestioncartera.servicios;

import java.util.List;

import org.springframework.data.repository.query.Param;

import com.gell.gestioncartera.entidades.Condonacion;
import com.gell.gestioncartera.entidades.CondonacionDetalle;

/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para condonacion
 */
public interface CondonacionServicios {
	Condonacion findById(Long id);
	CondonacionDetalle findByDetalleId(Long id);
	List<Condonacion> findByAll();
	List<Condonacion> findByEmpresa(@Param("idEmpresa") Long idEmpresa);
	Condonacion save(Condonacion item);
	CondonacionDetalle saveDetale(CondonacionDetalle item);
	List<CondonacionDetalle>  findByUspuideregistr(Long uspuideregistr);
	List<Condonacion> findByUsuarioyProceso(Long idUsuario, Long tipo);
}
