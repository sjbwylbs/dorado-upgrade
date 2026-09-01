package com.bstek.dorado.hibernate.hql;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.data.provider.Page;
import com.bstek.dorado.hibernate.provider.HqlDataProvider;
import com.bstek.dorado.util.Assert;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

public class DefaultHqlQuerier implements HqlQuerier {

	private HqlParameterResolver parameterResolver;

	@Override
	public HqlParameterResolver getHqlParameterResolver() {
		return parameterResolver;
	}

	public void setHqlParameterResolver(HqlParameterResolver parameterResolver) {
		this.parameterResolver = parameterResolver;
	}

	@Override
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Object query(EntityManager em, Object parameter,
			Hql hql, HqlDataProvider provider) throws Exception {
		TypedQuery<?> query = createQuery(em, parameter, hql);

		if (!provider.isUnique()) {
			List<Object> entities = (List<Object>) query.getResultList();
			return entities;
		} else {
			return query.getSingleResult();
		}
	}

	@Override
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void query(EntityManager em, Object parameter, Hql hql,
			Page<?> page, HqlDataProvider provider) throws Exception {
		TypedQuery<?> query = createQuery(em, parameter, hql);

		if (provider.isUnique()) {
			Object object = query.getSingleResult();
			if (object != null) {
				List list = new ArrayList(1);
				list.add(object);
				page.setEntities(list);
				page.setEntityCount(list.size());
			}
		} else {
			List entities = null;
			if (page.getPageSize() > 0) {
				query.setFirstResult(page.getFirstEntityIndex());
				query.setMaxResults(page.getPageSize());

				entities = query.getResultList();
				page.setEntities(entities);
			} else {
				entities = query.getResultList();
				page.setEntities(entities);
			}

			if (page.getPageSize() > 0) {
				int entityCount = count(em, parameter, hql, provider);
				page.setEntityCount(entityCount);
			} else {
				page.setEntityCount(entities.size());
			}
		}
	}

	@SuppressWarnings("unchecked")
	protected TypedQuery<?> createQuery(EntityManager em, Object parameter, Hql hql)
		throws Exception {
		Assert.notNull(hql, "Hql must not be null.");

		String hqlClause = hql.getClause();
		TypedQuery<?> query = em.createQuery(hqlClause, Object.class);
		List<HqlVarExpr> hqlParameters = hql.getVarExprs();
		if (!hqlParameters.isEmpty()) {
			for (HqlVarExpr hp : hqlParameters) {
				int i = hp.getIndex();
				Object v = parameterResolver.parameterValue(parameter, hp);
				query.setParameter(i, v);
			}
		}
		return query;
	}

	@Override
	@SuppressWarnings("unchecked")
	public int count(EntityManager em, Object parameter, Hql hql,
			HqlDataProvider provider) throws Exception {
		String hqlClause = hql.getClause();
		String fromHql = hqlClause;
		fromHql = "from " + StringUtils.substringAfter(fromHql, "from");
		fromHql = StringUtils.substringBefore(fromHql, "order by");
		String countHqlClause = "select count(*) " + fromHql;

		Hql countHql = new Hql(countHqlClause);
		List<HqlVarExpr> hqlParameters = hql.getVarExprs();
		if (!hqlParameters.isEmpty()) {
			for (HqlVarExpr hp : hqlParameters) {
				countHql.addVarExpr(hp);
			}
		}
		TypedQuery<?> query = createQuery(em, parameter, countHql);
		Number c = (Number) query.getSingleResult();
		return c.intValue();
	}

}
