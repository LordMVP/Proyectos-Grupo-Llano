package com.bioagricola.hya.config;

import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.Date;

/**
 * Clase que implementa specifications para personalizar filtro de busqueda y parametros
 *
 * @param <T> objeto a filtrar
 */
public class GeneralSpecification<T> implements Specification<T> {

    /**
     * Objeto criterio de busqueda con los parametros
     */
    private SearchCriteria criteria;

    /**
     * Constructor de la clase
     *
     * @param criteria
     */
    public GeneralSpecification(SearchCriteria criteria) {
        this.criteria = criteria;
    }

    /**
     * Constructor de la clase vacio
     */
    public GeneralSpecification() {
    }

    /**
     * Metodo en el que se parametrizan los filtros de busqueda
     *
     * @param root            root
     * @param query           query
     * @param criteriaBuilder builder
     * @return predicate
     */
    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if (criteria.getOperation().equalsIgnoreCase(">")) {
            return criteriaBuilder.greaterThanOrEqualTo(
                    root.get(criteria.getVariable()), criteria.getValue().toString());
        } else if (criteria.getOperation().equalsIgnoreCase("<")) {
            return criteriaBuilder.lessThanOrEqualTo(
                    root.get(criteria.getVariable()), criteria.getValue().toString());
        } else if (criteria.getOperation().equalsIgnoreCase(">::")) {
            return criteriaBuilder.greaterThanOrEqualTo(root.<Date>get(criteria.getVariable()), (Date) criteria.getValue());
        } else if (criteria.getOperation().equalsIgnoreCase("<::")) {
            return criteriaBuilder.lessThanOrEqualTo(root.<Date>get(criteria.getVariable()), (Date) criteria.getValue());
        } else if (criteria.getOperation().equalsIgnoreCase(":")) {
            if (root.get(criteria.getVariable()).getJavaType() == String.class) {
                return criteriaBuilder.like(
                        root.get(criteria.getVariable()), "%" + criteria.getValue() + "%");
            } else {
                return criteriaBuilder.equal(root.get(criteria.getVariable()), criteria.getValue());
            }
        } else if (criteria.getOperation().equalsIgnoreCase("=")) {
            return criteriaBuilder.equal(
                    root.get(criteria.getVariable()), criteria.getValue());
        } else if (criteria.getOperation().equalsIgnoreCase("::")) {
            if (root.get(criteria.getVariable()).getJavaType() == String.class) {
                return criteriaBuilder.like(root.join(criteria.getVariable()).get(criteria.getFieldRef()), "%" + criteria.getValue() + "%");
            } else {
                return criteriaBuilder.equal(root.join(criteria.getVariable()).get(criteria.getFieldRef()), criteria.getValue());
            }
        } else if (criteria.getOperation().equalsIgnoreCase(":::")) {
            if (root.join(criteria.getVariable()).get(criteria.getFieldRef()).getJavaType() == String.class) {
                return criteriaBuilder.like(root.join(criteria.getVariable()).get(criteria.getFieldRef()), "%" + criteria.getValue() + "%");
            } else {
                return criteriaBuilder.equal(root.join(criteria.getVariable()).get(criteria.getFieldRef()), criteria.getValue());
            }
        }
        return null;
    }
}
