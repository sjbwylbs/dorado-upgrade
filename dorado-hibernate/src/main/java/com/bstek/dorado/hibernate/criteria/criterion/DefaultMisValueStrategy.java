package com.bstek.dorado.hibernate.criteria.criterion;

import com.bstek.dorado.hibernate.criteria.CriteriaContext;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;

public class DefaultMisValueStrategy implements MisValueStrategy {

	@Override
	public Predicate criterion(CriteriaContext context, IdEqCriterion defCri) {
		return null;
	}

	@Override
	public Predicate criterion(CriteriaContext context,
			SingleCriterion defCri) {
		return null;
	}

	@Override
	public Predicate criterion(CriteriaContext context, InCriterion defCri) {
		return null;
	}

	@Override
	public Predicate criterion(CriteriaContext context, SizeCriterion defCri) {
		return null;
	}

	@Override
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Predicate criterion(CriteriaContext context, BetweenCriterion defCri,
			Object value1, Object value2) {
		if (value1 == null && value2 == null) {
			return null;
		}

		String propertyName = defCri.getPropertyName();
		Path<?> path = context.resolvePath(propertyName);
		if (value1 != null) {
			return context.getCriteriaBuilder().greaterThanOrEqualTo(
					(Expression<Comparable>) path, (Comparable) value1);
		}
		if (value2 != null) {
			return context.getCriteriaBuilder().lessThanOrEqualTo(
					(Expression<Comparable>) path, (Comparable) value2);
		}
		return null;
	}

}
