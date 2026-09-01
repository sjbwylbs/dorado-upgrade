package com.bstek.dorado.hibernate.criteria;

import jakarta.persistence.criteria.From;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

public enum JoinType {
	INNER_JOIN {
		@Override
		public jakarta.persistence.criteria.JoinType getJpaJoinType() {
			return jakarta.persistence.criteria.JoinType.INNER;
		}
	}, FULL_JOIN {
		@Override
		public jakarta.persistence.criteria.JoinType getJpaJoinType() {
			return jakarta.persistence.criteria.JoinType.LEFT;
		}
	}, LEFT_JOIN {
		@Override
		public jakarta.persistence.criteria.JoinType getJpaJoinType() {
			return jakarta.persistence.criteria.JoinType.LEFT;
		}
	}, RIGHT_JOIN {
		@Override
		public jakarta.persistence.criteria.JoinType getJpaJoinType() {
			return jakarta.persistence.criteria.JoinType.RIGHT;
		}
	};

	public abstract jakarta.persistence.criteria.JoinType getJpaJoinType();

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void alias(CriteriaContext context, String associationPath,
			String aliasName, Predicate withClause) {
		From<?, ?> root = context.getRoot();
		Join<?, ?> joined = root.join(associationPath,
				getJpaJoinType());

		if (withClause != null) {
			joined.on(withClause);
		}

		if (aliasName != null) {
			context.registerAlias(aliasName, joined);
		}
	}
}
