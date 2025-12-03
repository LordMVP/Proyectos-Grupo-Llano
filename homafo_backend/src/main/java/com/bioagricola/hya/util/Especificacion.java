package com.bioagricola.hya.util;

import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

/**
 * Clase que implementa specifications para personalizar filtro de busqueda y parametros
 * @param <T> objeto a filtrar
 */
public class Especificacion<T> implements Specification<T> {

    /**
     * Objeto criterio de busqueda con los parametros
     */
    private Criterio criterio;

    /**
     * Constructor de la clase
     * @param criterio
     */
    public Especificacion(Criterio criterio) {
        this.criterio=criterio;
    }

    /**
     * Constructor de la clase vacio
     */
    public Especificacion() {
    }

    /**
     * Metodo en el que se parametrizan los filtros de busqueda
     * @param root root
     * @param query query
     * @param criteriaBuilder builder
     * @return predicate
     */
    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if (criterio.getOperacion().equalsIgnoreCase(":")) {
            if (root.get(criterio.getVariable()).getJavaType() == String.class) {
                return criteriaBuilder.like(
                        root.get(criterio.getVariable()), "%" + criterio.getValor() + "%");
            } else {
                return criteriaBuilder.equal(root.get(criterio.getVariable()), criterio.getValor());
            }
        }
        else if (criterio.getOperacion().equalsIgnoreCase("=")) {
            return criteriaBuilder.equal(
                    root.get(criterio.getVariable()), criterio.getValor());
        }
        else if (criterio.getOperacion().equalsIgnoreCase("::")) {
                return criteriaBuilder.equal(root.join(criterio.getVariable()).get(criterio.getCamporef()), criterio.getValor());
        }
        else if (criterio.getOperacion().equalsIgnoreCase(":::")) {
            if (root.join(criterio.getVariable()).get(criterio.getCamporef()).getJavaType() == String.class) {
                return criteriaBuilder.like(root.join(criterio.getVariable()).get(criterio.getCamporef()), "%" + criterio.getValor() + "%");
            }else{
                return criteriaBuilder.equal(root.join(criterio.getVariable()).get(criterio.getCamporef()), criterio.getValor());
            }
        }
        return null;
    }
}
