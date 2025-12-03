package com.bioagricola.homologaciones.dto;

import javax.validation.constraints.NotNull;

/**
 * Clase payload de busqueda basico
 */
public class BasicSearchForm {
    
    @NotNull
    private String search;
    
    public BasicSearchForm() {
    }
    
    public BasicSearchForm(String search) {
        this.search = search;
    }
    
    public String getSearch() {
        return search;
    }
    
    public void setSearch(String search) {
        this.search = search;
    }
}
