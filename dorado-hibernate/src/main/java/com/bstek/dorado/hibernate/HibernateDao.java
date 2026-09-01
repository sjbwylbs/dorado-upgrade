package com.bstek.dorado.hibernate;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.bstek.dorado.data.entity.EntityState;
import com.bstek.dorado.data.entity.EntityUtils;
import com.bstek.dorado.data.entity.FilterType;
import com.bstek.dorado.data.provider.Page;
import com.bstek.dorado.util.Assert;
import com.bstek.dorado.util.proxy.ProxyBeanUtils;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class HibernateDao<T, PK extends Serializable> {
    private static final Log logger = LogFactory.getLog(HibernateDao.class);

    protected EntityManagerFactory entityManagerFactory;
    protected Class<T> entityType = getEntityType();

    @Autowired(required = false)
    public void setEntityManagerFactory(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public EntityManagerFactory getEntityManagerFactory() {
        return entityManagerFactory;
    }

    public EntityManager getEntityManager() {
        return getEntityManagerFactory().createEntityManager();
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
    protected Class<T> getEntityType() {
        Class cl = getClass();
        Class<T> resultType = null;
        Type superType = cl.getGenericSuperclass();

        if (superType instanceof ParameterizedType) {
            Type[] paramTypes = ((ParameterizedType) superType)
                    .getActualTypeArguments();
            if (paramTypes.length > 0) {
                resultType = (Class<T>) paramTypes[0];
            } else {
                logger.warn("Can not determine entityType for class ["
                        + cl.getSimpleName() + "].");
            }
        } else {
            logger.warn("[" + cl.getSimpleName()
                    + "] is not a parameterized type.");
        }
        return resultType;
    }

    protected String getIdPropertyName() {
        try {
            jakarta.persistence.metamodel.EntityType<?> entityTypeMeta = getEntityManagerFactory()
                    .getMetamodel().entity(entityType);
            return entityTypeMeta.getId(entityTypeMeta.getIdType().getJavaType())
                    .getName();
        } catch (Exception e) {
            // fallback: return "id"
            return "id";
        }
    }

    public void save(T entity) {
        getEntityManager().persist(entity);
    }

    public void delete(T entity) {
        getEntityManager().remove(entity);
    }

    public void delete(PK id) {
        delete(get(id));
    }

    public EntityState persistEntity(T entity) {
        EntityState state = EntityUtils.getState(entity);
        if (EntityState.DELETED.equals(state)) {
            delete(entity);
        } else if (EntityState.MODIFIED.equals(state)
                || EntityState.NEW.equals(state)
                || EntityState.MOVED.equals(state)) {
            save(entity);
        }
        return state;
    }

    @SuppressWarnings("unchecked")
    public int persistEntities(Collection<T> entities) {
        int i = 0;
        for (Object entity : EntityUtils.getIterable(entities,
                FilterType.DELETED)) {
            delete((T) entity);
            i++;
        }
        for (Object entity : EntityUtils.getIterable(entities,
                FilterType.MODIFIED)) {
            save((T) entity);
            i++;
        }
        for (Object entity : EntityUtils
                .getIterable(entities, FilterType.MOVED)) {
            save((T) entity);
            i++;
        }
        for (Object entity : EntityUtils.getIterable(entities, FilterType.NEW)) {
            save((T) entity);
            i++;
        }
        return i;
    }

    public T get(PK id) {
        return (T) getEntityManager().getReference(entityType, id);
    }

    public List<T> getAll() {
        EntityManager em = getEntityManager();
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<T> cq = (CriteriaQuery<T>) cb.createQuery(entityType);
        cq.from(entityType);
        return em.createQuery(cq).getResultList();
    }

    public Page<T> getAll(Page<T> page) {
        return find(page, (Predicate[]) null);
    }

    public List<T> find(Predicate... predicates) {
        EntityManager em = getEntityManager();
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<T> cq = (CriteriaQuery<T>) cb.createQuery(entityType);
        Root<T> root = cq.from(entityType);
        if (predicates != null && predicates.length > 0) {
            cq.where(predicates);
        }
        return em.createQuery(cq).getResultList();
    }

    public Page<T> find(Page<T> page, Predicate... predicates) {
        notNull(page, "page");
        EntityManager em = getEntityManager();
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<T> cq = (CriteriaQuery<T>) cb.createQuery(entityType);
        Root<T> root = cq.from(entityType);
        if (predicates != null && predicates.length > 0) {
            cq.where(predicates);
        }
        var query = em.createQuery(cq);
        query.setFirstResult(page.getFirstEntityIndex());
        query.setMaxResults(page.getPageSize());
        page.setEntities(query.getResultList());

        CriteriaQuery<Long> countCq = cb.createQuery(Long.class);
        countCq.from(entityType);
        if (predicates != null && predicates.length > 0) {
            countCq.where(predicates);
        }
        countCq.select(cb.count(countCq.from(entityType)));
        long count = em.createQuery(countCq).getSingleResult();
        page.setEntityCount((int) count);
        return page;
    }

    public List<T> find(Predicate[] predicates, Order[] orders) {
        return find(null, predicates, orders);
    }

    public List<T> find(Page<T> page, Predicate[] predicates, Order[] orders) {
        EntityManager em = getEntityManager();
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<T> cq = (CriteriaQuery<T>) cb.createQuery(entityType);
        Root<T> root = cq.from(entityType);
        if (predicates != null && predicates.length > 0) {
            cq.where(predicates);
        }
        if (orders != null && orders.length > 0) {
            cq.orderBy(java.util.Arrays.asList(orders));
        }
        return em.createQuery(cq).getResultList();
    }

    public TypedQuery<T> createQuery(String hql, Object... parameters) {
        TypedQuery<T> q = getEntityManager().createQuery(hql, entityType);
        if (parameters != null) {
            for (int i = 0; i < parameters.length; ++i) {
                q.setParameter(i + 1, parameters[i]);
            }
        }
        return q;
    }

    public TypedQuery<T> createQuery(String queryString, Map<String, ?> parameters) {
        TypedQuery<T> query = getEntityManager().createQuery(queryString, entityType);
        if (parameters != null) {
            for (Map.Entry<String, ?> entry : parameters.entrySet()) {
                query.setParameter(entry.getKey(), entry.getValue());
            }
        }
        return query;
    }

    @SuppressWarnings("unchecked")
    public <X> X findUnique(String hql, Object... parameters) {
        return (X) createQuery(hql, parameters).getSingleResult();
    }

    @SuppressWarnings("unchecked")
    public <X> X findUnique(String hql, Map<String, ?> parameters) {
        return (X) createQuery(hql, parameters).getSingleResult();
    }

    @SuppressWarnings({ "unchecked" })
    public <X> List<X> find(String hql, Object... parameters) {
        return (List<X>) createQuery(hql, parameters).getResultList();
    }

    @SuppressWarnings({ "unchecked" })
    public <X> List<X> find(String hql, Map<String, ?> parameters) {
        return (List<X>) createQuery(hql, parameters).getResultList();
    }

    public Page<T> find(Page<T> page, String hql, Object... parameters) {
        notNull(page, "page");
        TypedQuery<T> q = createQuery(hql, parameters);
        long totalCount = countHqlResult(hql, parameters);
        page.setEntityCount((int) totalCount);
        q.setFirstResult(page.getFirstEntityIndex());
        q.setMaxResults(page.getPageSize());
        page.setEntities(q.getResultList());
        return page;
    }

    public Page<T> find(Page<T> page, String hql, Map<String, ?> parameters) {
        notNull(page, "page");
        TypedQuery<T> q = createQuery(hql, parameters);
        long totalCount = countHqlResult(hql, parameters);
        page.setEntityCount((int) totalCount);
        q.setFirstResult(page.getFirstEntityIndex());
        q.setMaxResults(page.getPageSize());
        page.setEntities(q.getResultList());
        return page;
    }

    protected long countHqlResult(String hql, Object... parameters) {
        String countHql = generateCountHql(hql);
        return ((Number) findUnique(countHql, parameters)).longValue();
    }

    protected long countHqlResult(String hql, Map<String, ?> parameters) {
        String countHql = generateCountHql(hql);
        return ((Number) findUnique(countHql, parameters)).longValue();
    }

    private String generateCountHql(String hql) {
        hql = "from " + StringUtils.substringAfter(hql, "from");
        hql = StringUtils.substringBefore(hql, "order by");
        String countHql = "select count(*) " + hql;
        return countHql;
    }

    protected String getEntityName(Object object) {
        if (object != null) {
            Class<?> cl = ProxyBeanUtils.getProxyTargetType(object);
            return cl.getName();
        } else {
            return null;
        }
    }

    protected void notNull(Object obj, String name) {
        Assert.notNull(obj, "[" + name + "] must not be null.");
    }
}
