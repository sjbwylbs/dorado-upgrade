package com.bstek.dorado.hibernate.provider;

import jakarta.persistence.EntityManagerFactory;

public interface EntityManagerFactoryManager {

	/**
	 * @param entityManagerFactory
	 * @return
	 * @throws Exception
	 */
	EntityManagerFactory getEntityManagerFactory(String entityManagerFactory) throws Exception;

}
