package com.bstek.dorado.hibernate.criteria.criterion;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.hibernate.criteria.CriteriaContext;
import com.bstek.dorado.hibernate.criteria.HibernateCriteriaTransformer;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;

public class NonValueCriterion extends SingleProperyCriterion {

	private OP op;

	public static enum OP {
		isNull {
			@Override
			public String toString() {
				return "null";
			}

			@Override
			public Predicate criterion(CriteriaContext context, Path<?> path) {
				return context.getCriteriaBuilder().isNull(path);
			}
		},
		isNotNull {
			@Override
			public String toString() {
				return "!null";
			}

			@Override
			public Predicate criterion(CriteriaContext context, Path<?> path) {
				return context.getCriteriaBuilder().isNotNull(path);
			}
		},
		isEmpty {
			@Override
			public String toString() {
				return "empty";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaContext context, Path<?> path) {
				return context.getCriteriaBuilder().isEmpty(
						(Expression<java.util.Collection>) path);
			}
		},
		isNotEmpty {
			@Override
			public String toString() {
				return "!empty";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaContext context, Path<?> path) {
				return context.getCriteriaBuilder().isNotEmpty(
						(Expression<java.util.Collection>) path);
			}
		};

		public abstract Predicate criterion(CriteriaContext context,
				Path<?> path);

		public static OP value(String str) {
			if (StringUtils.isEmpty(str)) {
				return null;
			}

			for (OP op : OP.values()) {
				if (op.toString().equals(str)) {
					return op;
				}
			}

			throw new IllegalArgumentException("unknown op '" + str + "'.");
		}
	}

	@XmlProperty(parser = "spring:dorado.hibernate.nonValueCriterionOpParser", attributeOnly = true)
	@IdeProperty(enumValues = "null,!null,empty,!empty")
	public OP getOp() {
		return op;
	}

	public void setOp(OP op) {
		this.op = op;
	}

	@Override
	public Predicate toPredicate(CriteriaContext context, Object parameter,
			HibernateCriteriaTransformer transformer) throws Exception {
		String propertyName = this.getPropertyName();
		NonValueCriterion.OP op = this.getOp();
		if (op != null) {
			Path<?> path = context.resolvePath(propertyName);
			return op.criterion(context, path);
		} else {
			return null;
		}
	}
}
