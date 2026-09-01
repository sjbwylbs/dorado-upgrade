package com.bstek.dorado.hibernate.provider;

import org.springframework.util.Assert;

import com.bstek.dorado.core.Context;
import com.bstek.dorado.data.provider.AbstractDataProvider;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;

public abstract class HibernateDataProviderSupport extends AbstractDataProvider {
	private String entityManagerFactory;
	private boolean unique = false;
	private boolean autoFilter = false;

	public String getEntityManagerFactory() {
		return entityManagerFactory;
	}

	public void setEntityManagerFactory(String entityManagerFactory) {
		this.entityManagerFactory = entityManagerFactory;
	}

	public boolean isUnique() {
		return unique;
	}

	public void setUnique(boolean unique) {
		this.unique = unique;
	}

	public void setAutoFilter(boolean autoFilter) {
		this.autoFilter = autoFilter;
	}

	public boolean isAutoFilter() {
		return this.autoFilter;
	}

	protected EntityManagerFactory getEntityManagerFactoryObject() throws Exception {
		EntityManagerFactoryManager manager = (EntityManagerFactoryManager) Context
				.getCurrent().getServiceBean("hibernateSessionFactoryManager");
		EntityManagerFactory emf = manager
				.getEntityManagerFactory(entityManagerFactory);
		Assert.notNull(emf, "EntityManagerFactory named [" + entityManagerFactory + "] could not be found.");
		return emf;
	}

	protected EntityManager openEntityManager() throws Exception {
		EntityManagerFactory emf = this.getEntityManagerFactoryObject();
		return emf.createEntityManager();
	}

	protected EntityManager currentEntityManager() throws Exception {
		EntityManagerFactory emf = this.getEntityManagerFactoryObject();
		return emf.createEntityManager();
	}

	protected EntityManager entityManager() throws Exception {
		EntityManager em = null;
		try {
			em = this.currentEntityManager();
		} catch (Exception e) {
			em = this.openEntityManager();
		}
		return em;
	}
}
