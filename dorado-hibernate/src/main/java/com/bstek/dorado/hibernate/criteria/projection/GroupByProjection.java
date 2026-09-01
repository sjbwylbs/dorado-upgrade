package com.bstek.dorado.hibernate.criteria.projection;

import com.bstek.dorado.hibernate.criteria.CriteriaContext;

import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Selection;

public class GroupByProjection extends SinglePropertyProjection {

	@Override
	public Selection<?> toSelection(CriteriaContext context) {
		String propertyName = this.getPropertyName();
		return context.resolvePath(propertyName);
	}

	@Override
	public boolean isAggregation() {
		return false;
	}

	public void applyGroupBy(CriteriaContext context) {
		String propertyName = this.getPropertyName();
		CriteriaQuery<?> query = context.getQuery();
		jakarta.persistence.criteria.Path<?> path = context
				.resolvePath(propertyName);

		java.util.List<jakarta.persistence.criteria.Expression<?>> existing = new java.util.ArrayList<>(
				query.getGroupList());
		existing.add(path);
		query.groupBy(existing);
	}
}
