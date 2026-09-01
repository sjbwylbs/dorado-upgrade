package com.bstek.dorado.hibernate.criteria.projection;

import com.bstek.dorado.hibernate.criteria.CriteriaContext;

import jakarta.persistence.criteria.Selection;

public class RowCountProjection extends BaseProjection {

	@Override
	public Selection<?> toSelection(CriteriaContext context) {
		return context.getCriteriaBuilder().count(context.getRoot());
	}

	@Override
	public boolean isAggregation() {
		return true;
	}
}
