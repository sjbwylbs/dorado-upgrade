package com.bstek.dorado.hibernate.criteria;

import java.util.List;

import com.bstek.dorado.hibernate.criteria.criterion.BaseCriterion;
import com.bstek.dorado.hibernate.criteria.criterion.MisValueStrategy;

import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;

public interface HibernateCriteriaTransformer {

	CriteriaQuery<?> buildQuery(CriteriaContext context,
			TopCriteria topCriteria, Object parameter) throws Exception;

	List<Predicate> listPredicates(List<BaseCriterion> defCris,
			CriteriaContext context, Object parameter) throws Exception;

	Object getValueFromParameter(Object parameter, String dataType,
			Object value) throws Exception;

	MisValueStrategy getMisValueStrategy();
}
