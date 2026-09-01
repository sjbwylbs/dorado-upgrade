package com.bstek.dorado.hibernate.criteria.criterion;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.hibernate.criteria.CriteriaContext;
import com.bstek.dorado.hibernate.criteria.HibernateCriteriaTransformer;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;

public class SingleCriterion extends SingleProperyCriterion {

	private Object value;
	private String dataType;
	private OP op;

	public static enum OP {
		eq {
			@Override
			public String toString() {
				return "=";
			}

			@Override
			public Predicate criterion(CriteriaContext context, Path<?> path,
					Object value) {
				return context.getCriteriaBuilder().equal(path, value);
			}
		},
		ne {
			@Override
			public String toString() {
				return "<>";
			}

			@Override
			public Predicate criterion(CriteriaContext context, Path<?> path,
					Object value) {
				return context.getCriteriaBuilder().notEqual(path, value);
			}
		},
		gt {
			@Override
			public String toString() {
				return ">";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaContext context, Path path,
					Object value) {
				return context.getCriteriaBuilder().greaterThan(
						(Expression<Comparable>) path, (Comparable) value);
			}
		},
		lt {
			@Override
			public String toString() {
				return "<";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaContext context, Path path,
					Object value) {
				return context.getCriteriaBuilder().lessThan(
						(Expression<Comparable>) path, (Comparable) value);
			}
		},
		le {
			@Override
			public String toString() {
				return "<=";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaContext context, Path path,
					Object value) {
				return context.getCriteriaBuilder().lessThanOrEqualTo(
						(Expression<Comparable>) path, (Comparable) value);
			}
		},
		ge {
			@Override
			public String toString() {
				return ">=";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaContext context, Path path,
					Object value) {
				return context.getCriteriaBuilder().greaterThanOrEqualTo(
						(Expression<Comparable>) path, (Comparable) value);
			}
		},

		like {
			@Override
			public String toString() {
				return "like";
			}

			@Override
			public Predicate criterion(CriteriaContext context, Path<?> path,
					Object value) {
				if (value != null) {
					String valueStr = String.valueOf(value);
					if (StringUtils.isNotEmpty(valueStr)) {
						return context.getCriteriaBuilder().like(
								path.as(String.class), valueStr);
					}
				}
				return null;
			}
		},
		likeStart {
			@Override
			public String toString() {
				return "like%";
			}

			@Override
			public Predicate criterion(CriteriaContext context, Path<?> path,
					Object value) {
				if (value != null) {
					String valueStr = String.valueOf(value);
					if (StringUtils.isNotEmpty(valueStr)) {
						return context.getCriteriaBuilder().like(
								path.as(String.class), valueStr + "%");
					}
				}
				return null;
			}
		},
		likeEnd {
			@Override
			public String toString() {
				return "%like";
			}

			@Override
			public Predicate criterion(CriteriaContext context, Path<?> path,
					Object value) {
				if (value != null) {
					String valueStr = String.valueOf(value);
					if (StringUtils.isNotEmpty(valueStr)) {
						return context.getCriteriaBuilder().like(
								path.as(String.class), "%" + valueStr);
					}
				}
				return null;
			}
		},
		likeAnyWhere {
			@Override
			public String toString() {
				return "%like%";
			}

			@Override
			public Predicate criterion(CriteriaContext context, Path<?> path,
					Object value) {
				if (value != null) {
					String valueStr = String.valueOf(value);
					if (StringUtils.isNotEmpty(valueStr)) {
						return context.getCriteriaBuilder().like(
								path.as(String.class), "%" + valueStr + "%");
					}
				}
				return null;
			}
		},

		ilike {
			@Override
			public String toString() {
				return "ilike";
			}

			@Override
			public Predicate criterion(CriteriaContext context, Path<?> path,
					Object value) {
				if (value != null) {
					String valueStr = String.valueOf(value);
					if (StringUtils.isNotEmpty(valueStr)) {
						return context.getCriteriaBuilder().like(
								context.getCriteriaBuilder().lower(
										path.as(String.class)),
								valueStr.toLowerCase());
					}
				}
				return null;
			}
		},
		ilikeStart {
			@Override
			public String toString() {
				return "ilike%";
			}

			@Override
			public Predicate criterion(CriteriaContext context, Path<?> path,
					Object value) {
				if (value != null) {
					String valueStr = String.valueOf(value);
					if (StringUtils.isNotEmpty(valueStr)) {
						return context.getCriteriaBuilder().like(
								context.getCriteriaBuilder().lower(
										path.as(String.class)),
								valueStr.toLowerCase() + "%");
					}
				}
				return null;
			}
		},
		ilikeEnd {
			@Override
			public String toString() {
				return "%ilike";
			}

			@Override
			public Predicate criterion(CriteriaContext context, Path<?> path,
					Object value) {
				if (value != null) {
					String valueStr = String.valueOf(value);
					if (StringUtils.isNotEmpty(valueStr)) {
						return context.getCriteriaBuilder().like(
								context.getCriteriaBuilder().lower(
										path.as(String.class)),
								"%" + valueStr.toLowerCase());
					}
				}
				return null;
			}
		},
		ilikeAnyWhere {
			@Override
			public String toString() {
				return "%ilike%";
			}

			@Override
			public Predicate criterion(CriteriaContext context, Path<?> path,
					Object value) {
				if (value != null) {
					String valueStr = String.valueOf(value);
					if (StringUtils.isNotEmpty(valueStr)) {
						return context.getCriteriaBuilder().like(
								context.getCriteriaBuilder().lower(
										path.as(String.class)),
								"%" + valueStr.toLowerCase() + "%");
					}
				}
				return null;
			}
		};

		public abstract Predicate criterion(CriteriaContext context,
				Path<?> path, Object value);

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

	@XmlProperty
	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	@XmlProperty(parser = "spring:dorado.hibernate.singleCriterionOpParser")
	@IdeProperty(enumValues = "=,<>,>,<,<=,>=,like,like%,%like,%like%,ilike,ilike%,%ilike,%ilike%")
	public OP getOp() {
		return op;
	}

	public void setOp(OP op) {
		this.op = op;
	}

	@Override
	public Predicate toPredicate(CriteriaContext context, Object parameter,
			HibernateCriteriaTransformer transformer) throws Exception {
		String dataType = this.getDataType();
		SingleCriterion.OP op = this.getOp();
		String propertyName = this.getPropertyName();
		Object v1 = this.getValue();
		if (v1 != null) {
			Object value = transformer.getValueFromParameter(parameter,
					dataType, v1);
			if (value != null) {
				if (op != null) {
					Path<?> path = context.resolvePath(propertyName);
					return op.criterion(context, path, value);
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
