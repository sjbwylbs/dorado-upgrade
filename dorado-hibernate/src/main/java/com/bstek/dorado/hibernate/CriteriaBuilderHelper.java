package com.bstek.dorado.hibernate;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Selection;

public class CriteriaBuilderHelper {

    public static <T> CriteriaQuery<T> createCriteriaQuery(EntityManager em, Class<T> entityClass) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        return cb.createQuery(entityClass);
    }

    public static <T> List<T> list(EntityManager em, Class<T> entityClass,
                                    List<Predicate> predicates, List<Order> orders,
                                    Integer firstResult, Integer maxResults) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<T> cq = cb.createQuery(entityClass);
        Root<T> root = cq.from(entityClass);

        if (predicates != null && !predicates.isEmpty()) {
            cq.where(predicates.toArray(new Predicate[0]));
        }
        if (orders != null && !orders.isEmpty()) {
            cq.orderBy(orders);
        }

        var query = em.createQuery(cq);
        if (firstResult != null) {
            query.setFirstResult(firstResult);
        }
        if (maxResults != null) {
            query.setMaxResults(maxResults);
        }
        return query.getResultList();
    }

    public static <T> long count(EntityManager em, Class<T> entityClass, List<Predicate> predicates) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<T> root = cq.from(entityClass);
        cq.select(cb.count(root));
        if (predicates != null && !predicates.isEmpty()) {
            cq.where(predicates.toArray(new Predicate[0]));
        }
        return em.createQuery(cq).getSingleResult();
    }

    public static <T> List<T> list(EntityManager em, Class<T> entityClass) {
        return list(em, entityClass, null, null, null, null);
    }

    @SuppressWarnings({"deprecation", "unchecked", "rawtypes"})
    public static <T, R> List<R> listWithProjection(EntityManager em, Class<T> entityClass,
                                                     Selection<?>[] selections,
                                                     List<Predicate> predicates, List<Order> orders,
                                                     Integer firstResult, Integer maxResults) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery cq = cb.createQuery();
        Root<T> root = cq.from(entityClass);
        if (selections != null && selections.length > 0) {
            if (selections.length == 1) {
                cq.select(selections[0]);
            } else {
                cq.multiselect(selections);
            }
        }
        if (predicates != null && !predicates.isEmpty()) {
            cq.where(predicates.toArray(new Predicate[0]));
        }
        if (orders != null && !orders.isEmpty()) {
            cq.orderBy(orders);
        }
        var query = em.createQuery(cq);
        if (firstResult != null) {
            query.setFirstResult(firstResult);
        }
        if (maxResults != null) {
            query.setMaxResults(maxResults);
        }
        @SuppressWarnings("unchecked")
        List<R> results = query.getResultList();
        return results;
    }

    public static CriteriaBuilder getCriteriaBuilder(EntityManager em) {
        return em.getCriteriaBuilder();
    }
}
