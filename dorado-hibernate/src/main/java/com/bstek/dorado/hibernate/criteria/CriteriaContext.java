package com.bstek.dorado.hibernate.criteria;

import java.util.HashMap;
import java.util.Map;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.From;
import jakarta.persistence.criteria.Root;

/**
 * JPA Criteria API的上下文容器，持有查询构建过程中的各种状态对象。
 */
public class CriteriaContext {

	private EntityManager entityManager;
	private CriteriaBuilder cb;
	private CriteriaQuery<?> query;
	private Root<?> root;
	private Map<String, From<?, ?>> aliasMap = new HashMap<>();

	public CriteriaContext(EntityManager entityManager, CriteriaBuilder cb,
			CriteriaQuery<?> query, Root<?> root) {
		this.entityManager = entityManager;
		this.cb = cb;
		this.query = query;
		this.root = root;
	}

	public EntityManager getEntityManager() {
		return entityManager;
	}

	public CriteriaBuilder getCriteriaBuilder() {
		return cb;
	}

	public CriteriaQuery<?> getQuery() {
		return query;
	}

	public Root<?> getRoot() {
		return root;
	}

	public void registerAlias(String alias, From<?, ?> from) {
		aliasMap.put(alias, from);
	}

	public From<?, ?> getAlias(String alias) {
		return aliasMap.get(alias);
	}

	public Map<String, From<?, ?>> getAliasMap() {
		return aliasMap;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public jakarta.persistence.criteria.Path<?> resolvePath(String propertyPath) {
		if (propertyPath == null) {
			return root;
		}

		int dotIndex = propertyPath.indexOf('.');
		if (dotIndex > 0) {
			String firstPart = propertyPath.substring(0, dotIndex);
			String rest = propertyPath.substring(dotIndex + 1);

			From<?, ?> aliased = aliasMap.get(firstPart);
			if (aliased != null) {
				jakarta.persistence.criteria.Path<?> path = aliased;
				if (rest != null && !rest.isEmpty()) {
					for (String part : rest.split("\\.")) {
						path = path.get(part);
					}
				}
				return path;
			}
		}

		jakarta.persistence.criteria.Path<?> path = root;
		for (String part : propertyPath.split("\\.")) {
			path = path.get(part);
		}
		return path;
	}
}
