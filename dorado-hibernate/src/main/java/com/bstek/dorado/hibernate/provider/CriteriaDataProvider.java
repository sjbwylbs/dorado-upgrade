package com.bstek.dorado.hibernate.provider;

import java.util.ArrayList;
import java.util.List;

import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.core.Context;
import com.bstek.dorado.data.provider.AbstractDataProvider;
import com.bstek.dorado.data.provider.Page;
import com.bstek.dorado.data.type.DataType;
import com.bstek.dorado.hibernate.HibernateUtils;
import com.bstek.dorado.hibernate.SessionStrategy;
import com.bstek.dorado.hibernate.criteria.CriteriaContext;
import com.bstek.dorado.hibernate.criteria.HibernateCriteriaTransformer;
import com.bstek.dorado.hibernate.criteria.TopCriteria;
import com.bstek.dorado.util.Assert;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;

/**
 * 利用JPA Criteria API实现的DataProvider
 */
@XmlNode(fixedProperties = "type=hibernateCriteria")
public class CriteriaDataProvider extends AbstractDataProvider {
	private String entityManagerFactory;
	private boolean unique = false;
	private boolean autoFilter = false;
	private String resultTransformer;

	private SessionStrategy sessionStrategy = SessionStrategy.DEFAULT;

	public String getEntityManagerFactory() {
		return entityManagerFactory;
	}

	public void setEntityManagerFactory(String entityManagerFactory) {
		this.entityManagerFactory = entityManagerFactory;
	}

	public void setSessionStrategy(SessionStrategy sessionStrategy) {
		this.sessionStrategy = sessionStrategy;
	}

	@ClientProperty(escapeValue = "DEFAULT")
	public SessionStrategy getSessionStrategy() {
		Assert.notNull(sessionStrategy, "[Assertion failed] - this argument 'sessionStrategy' is required; it must not be null");
		return sessionStrategy;
	}

	@ClientProperty(escapeValue = "false")
	public boolean isUnique() {
		return unique;
	}

	public void setUnique(boolean unique) {
		this.unique = unique;
	}

	public void setAutoFilter(boolean autoFilter) {
		this.autoFilter = autoFilter;
	}

	@ClientProperty(escapeValue = "false")
	public boolean isAutoFilter() {
		return this.autoFilter;
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

	private TopCriteria criterita;

	@XmlSubNode(fixed = true)
	public TopCriteria getCriteria() {
		Assert.notNull(criterita, "Criteria must not be null.");
		return criterita;
	}

	public void setCriteria(TopCriteria criterita) {
		this.criterita = criterita;
	}

	protected HibernateCriteriaTransformer getCriteriaTransformer()
			throws Exception {
		return (HibernateCriteriaTransformer) Context.getCurrent()
				.getServiceBean("criteriaTransformer");
	}

	/**
	 * 根据TopCriteria解析实体类。优先使用entityClazz，其次通过entityName从EntityManagerFactory中查找。
	 */
	@SuppressWarnings("rawtypes")
	protected Class<?> resolveEntityClass(TopCriteria topCriteria,
			EntityManagerFactory entityManagerFactory) {
		if (topCriteria.getEntityClazz() != null) {
			return topCriteria.getEntityClazz();
		}
		String entityName = topCriteria.getEntityName();
		if (entityName != null && !entityName.isEmpty()) {
			// 先尝试将 entityName 作为完整类名加载
			try {
				return Class.forName(entityName);
			} catch (Exception ignored) {
			}
			// 再尝试通过 Metamodel 遍历查找
			try {
				jakarta.persistence.metamodel.Metamodel mm = entityManagerFactory
						.getMetamodel();
				for (jakarta.persistence.metamodel.EntityType<?> et : mm
						.getEntities()) {
					if (entityName.equals(et.getName())
							|| entityName.equals(et.getJavaType().getName())) {
						return et.getJavaType();
					}
				}
			} catch (Exception ignored) {
			}
		}
		return Object.class;
	}

	/**
	 * 构建用于数据查询的CriteriaContext与CriteriaQuery。
	 */
	protected CriteriaContext prepareCriteriaContext(EntityManager em,
			Object parameter) throws Exception {
		TopCriteria topCriteria = getCriteria();
		CriteriaBuilder cb = em.getCriteriaBuilder();
		Class<?> entityClass = resolveEntityClass(topCriteria,
				em.getEntityManagerFactory());
		CriteriaQuery<Object> cq = cb.createQuery(Object.class);
		Root<?> root = cq.from(entityClass);
		CriteriaContext context = new CriteriaContext(em, cb, cq, root);

		HibernateCriteriaTransformer transformer = getCriteriaTransformer();
		transformer.buildQuery(context, topCriteria, parameter);

		if (isAutoFilter()) {
			com.bstek.dorado.data.provider.Criteria filterCriteria = HibernateUtils
					.getFilterCriteria(parameter);
			if (filterCriteria != null) {
				HibernateUtils.applyFilter(context, filterCriteria);
			}
		}
		return context;
	}

	/**
	 * 构建用于分页记录总数的CriteriaQuery（独立构建where条件）。
	 */
	protected CriteriaQuery<Long> prepareCountQuery(EntityManager em,
			Object parameter) throws Exception {
		TopCriteria topCriteria = getCriteria();
		CriteriaBuilder cb = em.getCriteriaBuilder();
		Class<?> entityClass = resolveEntityClass(topCriteria,
				em.getEntityManagerFactory());
		CriteriaQuery<Long> countCq = cb.createQuery(Long.class);
		Root<?> countRoot = countCq.from(entityClass);
		countCq.select(cb.count(countRoot));

		CriteriaContext countContext = new CriteriaContext(em, cb, countCq,
				countRoot);
		HibernateCriteriaTransformer transformer = getCriteriaTransformer();
		transformer.buildQuery(countContext, topCriteria, parameter);

		if (isAutoFilter()) {
			com.bstek.dorado.data.provider.Criteria filterCriteria = HibernateUtils
					.getFilterCriteria(parameter);
			if (filterCriteria != null) {
				HibernateUtils.applyFilter(countContext, filterCriteria);
			}
		}
		return countCq;
	}

	@SuppressWarnings("rawtypes")
	@Override
	protected Object internalGetResult(Object parameter, DataType resultDataType)
			throws Exception {
		EntityManagerFactory f = this.getEntityManagerFactoryObject();
		SessionStrategy ss = this.getSessionStrategy();
		Object result = ss.doWork(f, new SessionStrategy.EntityManagerWorker<>() {

			@Override
			public Object doWork(EntityManager em) throws Exception {
				Object realParameter = HibernateUtils
						.getRealParameter(parameter);
				CriteriaContext context = prepareCriteriaContext(em,
						realParameter);
				CriteriaQuery<?> cq = context.getQuery();
				jakarta.persistence.TypedQuery query = em.createQuery(cq);
				if (!isUnique()) {
					return query.getResultList();
				} else {
					return query.getSingleResult();
				}
			}

		});

		return result;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	protected void internalGetPagingResult(Object parameter, final Page<?> page,
			DataType resultDataType) throws Exception {
		EntityManagerFactory f = this.getEntityManagerFactoryObject();
		SessionStrategy ss = this.getSessionStrategy();
		ss.doWork(f, new SessionStrategy.EntityManagerWorker<>() {

			@Override
			public Object doWork(EntityManager em) throws Exception {
				Object realParameter = HibernateUtils
						.getRealParameter(parameter);

				if (!isUnique()) {
					CriteriaContext context = prepareCriteriaContext(em,
							realParameter);
					CriteriaQuery<?> cq = context.getQuery();

					jakarta.persistence.TypedQuery query = em.createQuery(cq);
					query.setFirstResult(page.getFirstEntityIndex());
					query.setMaxResults(page.getPageSize());
					List list = query.getResultList();
					page.setEntities(list);

					CriteriaQuery<Long> countCq = prepareCountQuery(em,
							realParameter);
					Number c = em.createQuery(countCq)
							.getSingleResult();
					page.setEntityCount(c.intValue());
				} else {
					CriteriaContext context = prepareCriteriaContext(em,
							realParameter);
					CriteriaQuery<?> cq = context.getQuery();
					jakarta.persistence.TypedQuery query = em.createQuery(cq);
					Object object = query.getSingleResult();
					if (object != null) {
						List entities = new ArrayList(1);
						entities.add(object);
						page.setEntities(entities);
						page.setEntityCount(entities.size());
					}
				}
				return null;
			}
		});
	}

}
