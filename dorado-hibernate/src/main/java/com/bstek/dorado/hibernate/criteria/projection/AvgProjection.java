package com.bstek.dorado.hibernate.criteria.projection;

import com.bstek.dorado.hibernate.criteria.CriteriaContext;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Selection;

public class AvgProjection extends SinglePropertyProjection {

	@Override
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Selection<?> toSelection(CriteriaContext context) {
		String propertyName = this.getPropertyName();
		jakarta.persistence.criteria.Path<?> path = context
				.resolvePath(propertyName);
		return context.getCriteriaBuilder().avg((Expression<Number>) path);
	}

	@Override
	public boolean isAggregation() {
		return true;
	}
}
