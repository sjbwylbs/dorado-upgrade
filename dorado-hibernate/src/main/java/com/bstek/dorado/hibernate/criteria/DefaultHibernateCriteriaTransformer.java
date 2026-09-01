package com.bstek.dorado.hibernate.criteria;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.hibernate.criteria.criterion.BaseCriterion;
import com.bstek.dorado.hibernate.criteria.criterion.MisValueStrategy;
import com.bstek.dorado.hibernate.criteria.parameter.ParameterExtractor;

import jakarta.persistence.criteria.Predicate;

public class DefaultHibernateCriteriaTransformer extends
		BaseHibernateCriteriaTransformer {

	private ParameterExtractor parameterExtractor;
	private MisValueStrategy misValueStrategy;

	// -------------------------- Alias ---------------------------
	@Override
	protected void addAlias(CriteriaContext context, Alias alias,
			Object parameter) throws Exception {
		String associationPath = alias.getAssociationPath();
		String aliasName = alias.getAlias();
		JoinType joinType = alias.getJoinType();
		Predicate withClause = null;

		List<BaseCriterion> crs = alias.getCriterions();
		if (crs != null && crs.size() > 0) {
			List<Predicate> predicates = new ArrayList<>(crs.size());
			for (BaseCriterion cr : crs) {
				if (cr.isAvailable()) {
					Predicate p = this.criterion(cr, context, parameter);
					if (p != null) {
						predicates.add(p);
					}
				}
			}
			if (predicates.size() == 1) {
				withClause = predicates.get(0);
			} else if (predicates.size() > 1) {
				Predicate[] arr = predicates
						.toArray(new Predicate[predicates.size()]);
				withClause = context.getCriteriaBuilder().and(arr);
			}
		}

		if (joinType != null) {
			joinType.alias(context, associationPath, aliasName, withClause);
		} else {
			jakarta.persistence.criteria.JoinType jt = jakarta.persistence.criteria.JoinType.INNER;
			jakarta.persistence.criteria.From<?, ?> root = context.getRoot();
			@SuppressWarnings({ "unchecked", "rawtypes" })
			jakarta.persistence.criteria.From<?, ?> joined = root
					.join(associationPath, jt);
			if (withClause != null) {
				((jakarta.persistence.criteria.Join<?, ?>) joined)
						.on(withClause);
			}
			if (StringUtils.isNotEmpty(aliasName)) {
				context.registerAlias(aliasName, joined);
			}
		}
	}

	// -------------------------- Parameter ---------------------------
	public void setParameterExtractor(ParameterExtractor parameterExtractor) {
		this.parameterExtractor = parameterExtractor;
	}

	public ParameterExtractor getParameterExtractor() {
		return parameterExtractor;
	}

	public void setMisValueStrategy(MisValueStrategy misValueStrategy) {
		this.misValueStrategy = misValueStrategy;
	}

	@Override
	public MisValueStrategy getMisValueStrategy() {
		return this.misValueStrategy;
	}

	@Override
	public Object getValueFromParameter(Object parameter, String dataType,
			Object value) throws Exception {
		Object value2 = null;
		String expr = parameterExtractor.getExpr(value);
		if (StringUtils.isNotEmpty(expr)) {
			value2 = parameterExtractor.expr(parameter, expr, dataType);
		} else {
			value2 = parameterExtractor.value(value, dataType);
		}
		return value2;
	}
}
