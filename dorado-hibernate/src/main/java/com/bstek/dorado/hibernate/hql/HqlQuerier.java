package com.bstek.dorado.hibernate.hql;

import com.bstek.dorado.data.provider.Page;
import com.bstek.dorado.hibernate.provider.HqlDataProvider;

import jakarta.persistence.EntityManager;

public interface HqlQuerier {

	HqlParameterResolver getHqlParameterResolver();

	Object query(EntityManager entityManager, Object parameter,
			Hql hql, HqlDataProvider provider) throws Exception;

	void query(EntityManager entityManager, Object parameter,
			Hql hql, Page<?> page, HqlDataProvider provider) throws Exception;

	int count(EntityManager entityManager, Object parameter,
			Hql hql, HqlDataProvider provider) throws Exception;
}
