package com.bstek.dorado.hibernate.provider;

import org.springframework.web.context.WebApplicationContext;

import com.bstek.dorado.web.DoradoContext;

import jakarta.persistence.EntityManagerFactory;

public class SpringWebApplicationEntityManagerFactoryManager implements
		EntityManagerFactoryManager {
	private String defaultEntityManagerFactory;

	public String getDefaultEntityManagerFactory() {
		return defaultEntityManagerFactory;
	}

	public void setDefaultEntityManagerFactory(String defaultEntityManagerFactory) {
		this.defaultEntityManagerFactory = defaultEntityManagerFactory;
	}

	@Override
	public EntityManagerFactory getEntityManagerFactory(String entityManagerFactory)
			throws Exception {
		WebApplicationContext applicationContext = DoradoContext
				.getAttachedWebApplicationContext();
		String beanName = (entityManagerFactory != null) ? entityManagerFactory : defaultEntityManagerFactory;
		return (EntityManagerFactory) applicationContext.getBean(beanName);
	}

}
