package com.bstek.dorado.hibernate;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.data.ParameterWrapper;
import com.bstek.dorado.data.provider.Criteria;
import com.bstek.dorado.data.provider.Or;
import com.bstek.dorado.data.provider.filter.FilterOperator;
import com.bstek.dorado.data.provider.filter.PropertyFilterCriterion;
import com.bstek.dorado.data.provider.filter.SingleValueFilterCriterion;
import com.bstek.dorado.data.variant.Record;
import com.bstek.dorado.hibernate.criteria.CriteriaContext;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;

public final class HibernateUtils {
	private HibernateUtils() {
	}

	public static Criteria getFilterCriteria(Object parameter) {
		if (parameter instanceof ParameterWrapper) {
			ParameterWrapper pw = (ParameterWrapper) parameter;
			java.util.Map<String, Object> sysParameter = pw
					.getSysParameter();

			if (sysParameter instanceof Record) {
				Record paraRecord = (Record) sysParameter;
				return (Criteria) paraRecord.get("criteria");
			}
		}

		return null;
	}

	public static Object getRealParameter(Object parameter) {
		if (parameter != null) {
			if (parameter instanceof ParameterWrapper) {
				return ((ParameterWrapper) parameter).getParameter();
			}
		}

		return parameter;
	}

	/**
	 * 将dorado的filterCriteria翻译为JPA Predicate，并附加到context对应的
	 * CriteriaQuery的where条件中（使用AND合并已有条件）。
	 */
	public static void applyFilter(CriteriaContext context,
			Criteria filterCriteria) throws Exception {
		if (filterCriteria == null) {
			return;
		}
		CriteriaImplHelper helper = new CriteriaImplHelper(context);
		mergeFilter(helper, filterCriteria);
	}

	@SuppressWarnings({"rawtypes", "unchecked"})
	public static void mergeFilter(CriteriaImplHelper helper,
			Criteria filterCriteria) throws Exception {
		List<com.bstek.dorado.data.provider.Criterion> filterCriterions = filterCriteria
				.getCriterions();
		List<Predicate> predicates = new ArrayList<>();
		for (com.bstek.dorado.data.provider.Criterion fCriterion : filterCriterions) {
			Predicate predicate = createCriterion(helper, fCriterion);
			if (predicate != null) {
				predicates.add(predicate);
			}
		}

		if (!predicates.isEmpty()) {
			helper.andPredicates(predicates);
		}

		// 处理排序
		List<com.bstek.dorado.data.provider.Order> filterOrders = filterCriteria
				.getOrders();
		if (filterOrders != null && !filterOrders.isEmpty()) {
			CriteriaContext context = helper.getContext();
			CriteriaBuilder cb = context.getCriteriaBuilder();
			CriteriaQuery cq = context.getQuery();
			List<jakarta.persistence.criteria.Order> jpaOrders = new ArrayList<>();
			for (com.bstek.dorado.data.provider.Order fOrder : filterOrders) {
				String property = fOrder.getProperty();
				String propertyPath = StringUtils
						.defaultIfEmpty(fOrder.getPropertyPath(), property);
				Path<?> path = helper.getPath(propertyPath);
				if (fOrder.isDesc()) {
					jpaOrders.add(cb.desc(path));
				} else {
					jpaOrders.add(cb.asc(path));
				}
			}
			cq.orderBy(jpaOrders);
		}
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	private static Predicate createCriterion(CriteriaImplHelper helper,
			com.bstek.dorado.data.provider.Criterion fCriterion) throws Exception {
		CriteriaContext context = helper.getContext();
		CriteriaBuilder cb = context.getCriteriaBuilder();

		if (fCriterion instanceof SingleValueFilterCriterion) {
			SingleValueFilterCriterion filterCriterion = (SingleValueFilterCriterion) fCriterion;
			FilterOperator filterOperator = filterCriterion
					.getFilterOperator();
			Object filterValue = filterCriterion.getValue();
			String property = filterCriterion.getProperty();
			String propertyPath = StringUtils.defaultIfEmpty(
					filterCriterion.getPropertyPath(), property);
			Path path = helper.getPath(propertyPath);

			if (FilterOperator.eq.equals(filterOperator)) {
				return cb.equal(path, filterValue);
			} else if (FilterOperator.ne.equals(filterOperator)) {
				return cb.notEqual(path, filterValue);
			} else if (FilterOperator.gt.equals(filterOperator)) {
				return cb.greaterThan(path, (Comparable) filterValue);
			} else if (FilterOperator.lt.equals(filterOperator)) {
				return cb.lessThan(path, (Comparable) filterValue);
			} else if (FilterOperator.ge.equals(filterOperator)) {
				return cb.greaterThanOrEqualTo(path,
						(Comparable) filterValue);
			} else if (FilterOperator.le.equals(filterOperator)) {
				return cb.lessThanOrEqualTo(path, (Comparable) filterValue);
			} else if (FilterOperator.like.equals(filterOperator)) {
				if (filterValue != null) {
					String strValue = String.valueOf(filterValue);
					if (StringUtils.isNotEmpty(strValue)) {
						return cb.like(path.as(String.class),
								"%" + strValue + "%");
					}
				}
				return null;
			} else if (FilterOperator.likeStart.equals(filterOperator)) {
				if (filterValue != null) {
					String strValue = String.valueOf(filterValue);
					if (StringUtils.isNotEmpty(strValue)) {
						return cb.like(path.as(String.class), strValue + "%");
					}
				}
				return null;
			} else if (FilterOperator.likeEnd.equals(filterOperator)) {
				if (filterValue != null) {
					String strValue = String.valueOf(filterValue);
					if (StringUtils.isNotEmpty(strValue)) {
						return cb.like(path.as(String.class), "%" + strValue);
					}
				}
				return null;
			} else if (FilterOperator.between.equals(filterOperator)) {
				Object[] values = (Object[]) filterValue;
				return cb.between(path, (Comparable) values[0],
						(Comparable) values[1]);
			} else if (FilterOperator.in.equals(filterOperator)) {
				Object[] values = (Object[]) filterValue;
				return path.in(values);
			} else {
				throw new IllegalArgumentException(
						"Unsupported FilterOperator [" + filterOperator + "]");
			}
		} else if (fCriterion instanceof PropertyFilterCriterion) {
			PropertyFilterCriterion filterCriterion = (PropertyFilterCriterion) fCriterion;
			FilterOperator filterOperator = filterCriterion
					.getFilterOperator();
			String property = filterCriterion.getProperty();
			String otherProperty = filterCriterion.getOtherProperty();
			String propertyPath = StringUtils.defaultIfEmpty(
					filterCriterion.getPropertyPath(), property);
			String otherPropertyPath = StringUtils.defaultIfEmpty(
					filterCriterion.getOtherPropertyPath(), otherProperty);
			Path path = helper.getPath(propertyPath);
			Path otherPath = helper.getPath(otherPropertyPath);

			if (FilterOperator.eq.equals(filterOperator)) {
				return cb.equal(path, otherPath);
			} else if (FilterOperator.ne.equals(filterOperator)) {
				return cb.notEqual(path, otherPath);
			} else if (FilterOperator.gt.equals(filterOperator)) {
				return cb.greaterThan(path, otherPath);
			} else if (FilterOperator.lt.equals(filterOperator)) {
				return cb.lessThan(path, otherPath);
			} else if (FilterOperator.ge.equals(filterOperator)) {
				return cb.greaterThanOrEqualTo(path, otherPath);
			} else if (FilterOperator.le.equals(filterOperator)) {
				return cb.lessThanOrEqualTo(path, otherPath);
			} else {
				throw new IllegalArgumentException(
						"Unsupported FilterOperator [" + filterOperator + "]");
			}
		} else if (fCriterion instanceof com.bstek.dorado.data.provider.Junction) {
			com.bstek.dorado.data.provider.Junction fJunction = (com.bstek.dorado.data.provider.Junction) fCriterion;
			if (!fJunction.getCriterions().isEmpty()) {
				List<Predicate> subPredicates = new ArrayList<>();
				for (com.bstek.dorado.data.provider.Criterion c : fJunction
						.getCriterions()) {
					Predicate subPredicate = createCriterion(helper, c);
					if (subPredicate != null) {
						subPredicates.add(subPredicate);
					}
				}
				if (!subPredicates.isEmpty()) {
					Predicate[] arr = subPredicates
							.toArray(new Predicate[subPredicates.size()]);
					if (fCriterion instanceof Or) {
						return cb.or(arr);
					} else {
						return cb.and(arr);
					}
				}
			}
			return null;
		} else {
			throw new IllegalArgumentException("Unsupported Criterion ["
					+ fCriterion + "]");
		}
	}
}
