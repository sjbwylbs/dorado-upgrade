package com.bstek.dorado.hibernate.provider;

import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.core.Context;
import com.bstek.dorado.data.provider.AbstractDataProvider;
import com.bstek.dorado.data.provider.Page;
import com.bstek.dorado.data.type.DataType;
import com.bstek.dorado.hibernate.HibernateUtils;
import com.bstek.dorado.hibernate.SessionStrategy;
import com.bstek.dorado.hibernate.hql.Hql;
import com.bstek.dorado.hibernate.hql.HqlQuerier;
import com.bstek.dorado.hibernate.hql.HqlUtil;
import com.bstek.dorado.util.Assert;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;

/**
 * 利用JPA HQL功能实现的DataProvider
 *
 */
@XmlNode(fixedProperties = "type=hibernateHql")
public class HqlDataProvider extends AbstractDataProvider {
	private String entityManagerFactory;
	private boolean unique = false;
	private String resultTransformer;

	private SessionStrategy sessionStrategy = SessionStrategy.DEFAULT;

	public String getEntityManagerFactory() {
		return entityManagerFactory;
	}

	public void setEntityManagerFactory(String entityManagerFactory) {
		this.entityManagerFactory = entityManagerFactory;
	}

	@ClientProperty(escapeValue = "false")
	public boolean isUnique() {
		return unique;
	}

	public void setUnique(boolean unique) {
		this.unique = unique;
	}

	public void setSessionStrategy(SessionStrategy sessionStrategy) {
		this.sessionStrategy = sessionStrategy;
	}

	@ClientProperty(escapeValue = "DEFAULT")
	public SessionStrategy getSessionStrategy() {
		Assert.notNull(sessionStrategy, "[Assertion failed] - this argument 'sessionStrategy' is required; it must not be null");
		return sessionStrategy;
	}

	@XmlProperty(parser = "spring:dorado.hibernate.resultTransformerParser")
	@IdeProperty(enumValues = "ALIAS_TO_ENTITY_MAP,ROOT_ENTITY,DISTINCT_ROOT_ENTITY,PROJECTION")
	public String getResultTransformer() {
		return resultTransformer;
	}

	public void setResultTransformer(String resultTransformer) {
		this.resultTransformer = resultTransformer;
	}

	protected EntityManagerFactory getEntityManagerFactoryObject() throws Exception {
		EntityManagerFactoryManager manager = (EntityManagerFactoryManager) Context
				.getCurrent().getServiceBean("hibernateSessionFactoryManager");
		EntityManagerFactory emf = manager
				.getEntityManagerFactory(entityManagerFactory);
		Assert.notNull(emf, "EntityManagerFactory named [" + entityManagerFactory + "] could not be found.");
		return emf;
	}

	private String hql;

	@IdeProperty(editor = "multiLines")
	public String getHql() {
		return hql;
	}

	public void setHql(String hql) {
		this.hql = hql;
	}

	@Override
	protected Object internalGetResult(final Object parameter, final DataType resultDataType)
			throws Exception {
		Assert.notEmpty(this.hql, "Hql must not be empty.");

		EntityManagerFactory f = this.getEntityManagerFactoryObject();
		SessionStrategy ss = this.getSessionStrategy();

		Object result = ss.doWork(f, new SessionStrategy.EntityManagerWorker<>() {

			@Override
			public Object doWork(EntityManager em) throws Exception {
				Object realParameter = HibernateUtils.getRealParameter(parameter);
				Hql hql = createHql(HqlDataProvider.this.hql, realParameter, resultDataType);
				HqlQuerier querier = createHqlQuerier();

				Object result = querier.query(em, parameter, hql, HqlDataProvider.this);
				return result;
			}

		});

		return result;
	}

	@Override
	protected void internalGetPagingResult(final Object parameter, final Page<?> page,
			final DataType resultDataType) throws Exception {
		Assert.notEmpty(this.hql, "Hql must not be empty.");

		EntityManagerFactory f = this.getEntityManagerFactoryObject();
		SessionStrategy ss = this.getSessionStrategy();

		ss.doWork(f, new SessionStrategy.EntityManagerWorker<>() {

			@Override
			public Object doWork(EntityManager em) throws Exception {
				Object realParameter = HibernateUtils.getRealParameter(parameter);
				Hql hql = createHql(HqlDataProvider.this.hql, realParameter, resultDataType);
				HqlQuerier querier = createHqlQuerier();

				querier.query(em, parameter, hql, page, HqlDataProvider.this);
				return null;
			}

		});
	}

	protected HqlQuerier createHqlQuerier() throws Exception {
		HqlQuerier querier = (HqlQuerier) Context.getCurrent().getServiceBean(
				"hqlQuerier");
		return querier;
	}

	protected Hql createHql(String hqlClause, Object realParameter,
			DataType resultDataType) throws Exception {
		Hql hql = HqlUtil.build(hqlClause, realParameter);
		return hql;
	}

}
