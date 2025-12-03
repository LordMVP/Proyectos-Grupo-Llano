package com.bioagricola.homologaciones.controller.generic;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.homologaciones.dto.facade.AbstractDTOFacade;



@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public abstract class AbstractHomogacionesRestController<E,D> {

	private static final Logger LOGGER = LoggerFactory.getLogger(AbstractHomogacionesRestController.class);
	
	
	
	/*@ExceptionHandler(Exception.class)
	@ResponseStatus(HttpStatus.OK)
	public ResponseDTO<Void> tratarErrores(final Exception e) {
		LOGGER.error(String.format("Error en servicio Rest %s", e.toString()));
		final ResponseDTO<Void> response = new ResponseDTO<>();
							 response.setMessage("No se ha podido realizar la operacion. Contacte con el Administrador");
							 response.setSuccess(Boolean.FALSE);
		return response;
	}*/
	
	protected Page<D> convertPageToPageDto(Page<E> page){		
		List<D> contentDto = page.getContent().stream()
				.map(gen-> getFacade().convertToDto(gen))
				.collect(Collectors.toList());
		Page<D> pageDto = new PageImpl<D>(contentDto,page.getPageable(),page.getTotalElements());
		//LOGGER.info("Pagina convertida to dto ");
		return pageDto;
	}
	
	protected abstract AbstractDTOFacade<E, D> getFacade();
	
}
