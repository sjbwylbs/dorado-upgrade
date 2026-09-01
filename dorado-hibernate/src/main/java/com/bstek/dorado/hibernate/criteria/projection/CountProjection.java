package com.bstek.dorado.hibernate.criteria.projection;

import com.bstek.dorado.hibernate.criteria.CriteriaContext;

import jakarta.persistence.criteria.Selection;

public class CountProjection extends SinglePropertyProjection {

	private boolean distinct = false;

	public boolean isDistinct() {
		return distinct;
	}

	public void setDistinct(boolean distinct) {
		this.distinct = distinct;
	}

	@Override
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Selection<?> toSelection(CriteriaContext context) {
		String propertyName = this.getPropertyName();
		jakarta.persistence.criteria.Path<?> path = context
				.resolvePath(propertyName);

		if (!distinct) {
			return context.getCriteriaBuilder().count(path);
		} else {
			return context.getCriteriaBuilder().countDistinct(
					path);
		}
	}

	@Override
	public boolean isAggregation() {
		return true;
	}
}
