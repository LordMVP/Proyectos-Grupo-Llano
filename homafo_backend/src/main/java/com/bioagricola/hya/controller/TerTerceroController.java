package com.bioagricola.hya.controller;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.hya.dto.FiltroTerceroDTO;
import com.bioagricola.hya.dto.TerTerceroDTO;
import com.bioagricola.hya.service.TerTerceroService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(path = "api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TerTerceroController {
    private final TerTerceroService terTerceroService;
    private final AuthenticationFacade autoFacade;

    public TerTerceroController(TerTerceroService terTerceroService, AuthenticationFacade autoFacade) {
        this.terTerceroService = terTerceroService;
        this.autoFacade = autoFacade;
    }

    @PostMapping("tercero")
    public TerTerceroDTO save(@Valid @RequestBody TerTerceroDTO dto) {
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();

        return this.terTerceroService.save(dto, idUsu);
    }

    @PutMapping("tercero/{id}")
    public TerTerceroDTO update(@Valid @RequestBody TerTerceroDTO dto, @PathVariable("id") Integer id) {
        Integer idUsu = autoFacade.getCredentials().getAuditoria().getIdUsuario();

        return this.terTerceroService.update(id, dto, idUsu);
    }

    @PostMapping("/tercero/filtrar")
    public Page<TerTerceroDTO> filter(@Valid @RequestBody FiltroTerceroDTO dto, Pageable pageable) {
        return terTerceroService.filterTerTercero(dto, pageable.getPageNumber(), pageable.getPageSize());
    }
}
