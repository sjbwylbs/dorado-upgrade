package com.bstek.dorado.hibernate.criteria.criterion;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.hibernate.criteria.CriteriaContext;
import com.bstek.dorado.hibernate.criteria.HibernateCriteriaTransformer;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;

public class SizeCriterion extends SingleProperyCriterion {

	private Object value;
	private OP op;

	public static enum OP {
		eq {
			@Override
			public String toString() {
				return "=";
			}

			@Override
			@SuppressWarnings("unchecked")
			public Predicate criterion(CriteriaContext context, Path<?> path,
					int size) {
				return context.getCriteriaBuilder().equal(
						context.getCriteriaBuilder().size(
								(Expression<java.util.Collection>) path), size);
			}
		},
		ne {
			@Override
			public String toString() {
				return "<>";
			}

			@Override
			@SuppressWarnings("unchecked")
			public Predicate criterion(CriteriaContext context, Path<?> path,
					int size) {
				return context.getCriteriaBuilder().notEqual(
						context.getCriteriaBuilder().size(
								(Expression<java.util.Collection>) path), size);
			}
		},
		gt {
			@Override
			public String toString() {
				return ">";
			}

			@Override
			@SuppressWarnings("unchecked")
			public Predicate criterion(CriteriaContext context, Path<?> path,
					int size) {
				return context.getCriteriaBuilder().greaterThan(
						context.getCriteriaBuilder().size(
								(Expression<java.util.Collection>) path), size);
			}
		},
		lt {
			@Override
			public String toString() {
				return "<";
			}

			@Override
			@SuppressWarnings("unchecked")
			public Predicate criterion(CriteriaContext context, Path<?> path,
					int size) {
				return context.getCriteriaBuilder().lessThan(
						context.getCriteriaBuilder().size(
								(Expression<java.util.Collection>) path), size);
			}
		},
		le {
			@Override
			public String toString() {
				return "<=";
			}

			@Override
			@SuppressWarnings("unchecked")
			public Predicate criterion(CriteriaContext context, Path<?> path,
					int size) {
				return context.getCriteriaBuilder().lessThanOrEqualTo(
						context.getCriteriaBuilder().size(
								(Expression<java.util.Collection>) path), size);
			}
		},
		ge {
			@Override
			public String toString() {
				return ">=";
			}

			@Override
			@SuppressWarnings("unchecked")
			public Predicate criterion(CriteriaContext context, Path<?> path,
					int size) {
				return context.getCriteriaBuilder().greaterThanOrEqualTo(
						context.getCriteriaBuilder().size(
								(Expression<java.util.Collection>) path), size);
			}
		};

		@SuppressWarnings("unchecked")
		public abstract Predicate criterion(CriteriaContext context,
				Path<?> path, int size);

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

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	@XmlProperty(parser = "spring:dorado.hibernate.sizeCriterionOpParser")
	@IdeProperty(enumValues = "=,<>,>,<,>=,<=")
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
		Object sizeObj = this.getValue();
		if (sizeObj != null) {
			Integer size = (Integer) transformer.getValueFromParameter(
					parameter, "Integer", sizeObj);
			if (size != null) {
				SizeCriterion.OP op = this.getOp();
				if (op != null) {
					Path<?> path = context.resolvePath(propertyName);
					return op.criterion(context, path, size);
				} else {
					return null;
				}
			} else {
				return transformer.getMisValueStrategy().criterion(context,
						this);
			}
		} else {
			return transformer.getMisValueStrategy().criterion(context, this);
		}
	}
}
