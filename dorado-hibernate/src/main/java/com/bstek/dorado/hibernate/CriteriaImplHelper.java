package com.bstek.dorado.hibernate;

import java.util.ArrayList;
import java.util.List;

import com.bstek.dorado.hibernate.criteria.CriteriaContext;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;

/**
 * JPA Criteria API辅助工具。替代原基于反射操作 DetachedCriteria 的实现。
 *
 * 新实现基于 {@link CriteriaContext} 持有所有状态。
 */
public class CriteriaImplHelper {

	private CriteriaContext context;

	public CriteriaImplHelper(CriteriaContext context) {
		this.context = context;
	}

	public CriteriaContext getContext() {
		return context;
	}

	/**
	 * 获取属性路径对应的Expression（由CriteriaContext.resolvePath代理实现）。
	 */
	public jakarta.persistence.criteria.Path<?> getPath(String propertyPath) {
		return context.resolvePath(propertyPath);
	}

	/**
	 * 将新的Predicate追加到现有where条件中（使用AND合并）。
	 *
	 * JPA Criteria API的CriteriaQuery.where()是覆盖式的，此处读取现有where，
	 * 与新predicate用AND合并后重新设置。
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public void addPredicate(Predicate predicate) {
		if (predicate == null) {
			return;
		}
		CriteriaBuilder cb = context.getCriteriaBuilder();
		CriteriaQuery cq = context.getQuery();
		Predicate existing = cq.getRestriction();
		if (existing == null) {
			cq.where(predicate);
		} else {
			cq.where(cb.and(existing, predicate));
		}
	}

	/**
	 * 将若干Predicate以AND方式合并并设置为where条件。
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public void andPredicates(List<Predicate> predicates) {
		if (predicates == null || predicates.isEmpty()) {
			return;
		}
		CriteriaBuilder cb = context.getCriteriaBuilder();
		CriteriaQuery cq = context.getQuery();
		Predicate existing = cq.getRestriction();
		List<Predicate> all = new ArrayList<>(predicates.size() + 1);
		if (existing != null) {
			all.add(existing);
		}
		all.addAll(predicates);
		Predicate[] arr = all.toArray(new Predicate[all.size()]);
		cq.where(cb.and(arr));
	}

	/**
	 * 将若干Predicate以OR方式合并并设置为where条件。
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public void orPredicates(List<Predicate> predicates) {
		if (predicates == null || predicates.isEmpty()) {
			return;
		}
		CriteriaBuilder cb = context.getCriteriaBuilder();
		CriteriaQuery cq = context.getQuery();
		Predicate existing = cq.getRestriction();
		List<Predicate> all = new ArrayList<>(predicates.size() + 1);
		if (existing != null) {
			all.add(existing);
		}
		all.addAll(predicates);
		Predicate[] arr = all.toArray(new Predicate[all.size()]);
		cq.where(cb.or(arr));
	}
}
