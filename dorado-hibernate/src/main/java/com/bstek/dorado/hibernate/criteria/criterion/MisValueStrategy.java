package com.bstek.dorado.hibernate.criteria.criterion;

import com.bstek.dorado.hibernate.criteria.CriteriaContext;

import jakarta.persistence.criteria.Predicate;

public interface MisValueStrategy {
	Predicate criterion(CriteriaContext context, IdEqCriterion defCri);

	Predicate criterion(CriteriaContext context, SingleCriterion defCri);

	Predicate criterion(CriteriaContext context, InCriterion defCri);

	Predicate criterion(CriteriaContext context, SizeCriterion defCri);

	Predicate criterion(CriteriaContext context, BetweenCriterion defCri,
			Object value1, Object value2);
}
