package com.bstek.dorado.hibernate.criteria.projection;

import com.bstek.dorado.hibernate.criteria.CriteriaContext;

import jakarta.persistence.criteria.Selection;

public class PropertyProjection extends SinglePropertyProjection {

	@Override
	public Selection<?> toSelection(CriteriaContext context) {
		String propertyName = this.getPropertyName();
		return context.resolvePath(propertyName);
	}

	@Override
	public boolean isAggregation() {
		return false;
	}
}
