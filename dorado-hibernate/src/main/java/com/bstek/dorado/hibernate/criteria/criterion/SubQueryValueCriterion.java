package com.bstek.dorado.hibernate.criteria.criterion;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.hibernate.criteria.CriteriaContext;
import com.bstek.dorado.hibernate.criteria.HibernateCriteriaTransformer;
import com.bstek.dorado.hibernate.criteria.TopCriteria;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

public class SubQueryValueCriterion extends BaseCriterion {
	private Object value;
	private String dataType;
	private OP op;
	private TopCriteria innerQuery;

	public static enum OP {
		eq {
			@Override
			public String toString() {
				return "=";
			}

			@Override
			public Predicate criterion(CriteriaBuilder cb, Object value,
					Subquery<?> sub) {
				return cb.equal(cb.literal(value), sub);
			}
		},
		eqAll {
			@Override
			public String toString() {
				return "=all";
			}

			@Override
			public Predicate criterion(CriteriaBuilder cb, Object value,
					Subquery<?> sub) {
				return cb.equal(cb.literal(value), cb.all((Subquery<?>) sub));
			}
		},
		ge {
			@Override
			public String toString() {
				return ">=";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaBuilder cb, Object value,
					Subquery<?> sub) {
				return cb.greaterThanOrEqualTo(
						(Expression<Comparable>) cb.literal((Comparable) value),
						(Expression<? extends Comparable>) cb.all((Subquery) sub));
			}
		},
		geAll {
			@Override
			public String toString() {
				return ">=all";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaBuilder cb, Object value,
					Subquery<?> sub) {
				return cb.greaterThanOrEqualTo(
						(Expression<Comparable>) cb.literal((Comparable) value),
						(Expression<? extends Comparable>) cb.all((Subquery) sub));
			}
		},
		geSome {
			@Override
			public String toString() {
				return ">=some";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaBuilder cb, Object value,
					Subquery<?> sub) {
				return cb.greaterThanOrEqualTo(
						(Expression<Comparable>) cb.literal((Comparable) value),
						(Expression<? extends Comparable>) cb.some((Subquery) sub));
			}
		},
		gt {
			@Override
			public String toString() {
				return ">";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaBuilder cb, Object value,
					Subquery<?> sub) {
				return cb.greaterThan(
						(Expression<Comparable>) cb.literal((Comparable) value),
						(Expression<? extends Comparable>) cb.all((Subquery) sub));
			}
		},
		gtAll {
			@Override
			public String toString() {
				return ">all";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaBuilder cb, Object value,
					Subquery<?> sub) {
				return cb.greaterThan(
						(Expression<Comparable>) cb.literal((Comparable) value),
						(Expression<? extends Comparable>) cb.all((Subquery) sub));
			}
		},
		gtSome {
			@Override
			public String toString() {
				return ">some";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaBuilder cb, Object value,
					Subquery<?> sub) {
				return cb.greaterThan(
						(Expression<Comparable>) cb.literal((Comparable) value),
						(Expression<? extends Comparable>) cb.some((Subquery) sub));
			}
		},
		in {
			@Override
			public String toString() {
				return "in";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaBuilder cb, Object value,
					Subquery<?> sub) {
				return cb.literal(value).in((Subquery) sub);
			}
		},
		le {
			@Override
			public String toString() {
				return "<=";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaBuilder cb, Object value,
					Subquery<?> sub) {
				return cb.lessThanOrEqualTo(
						(Expression<Comparable>) cb.literal((Comparable) value),
						(Expression<? extends Comparable>) cb.all((Subquery) sub));
			}
		},
		leAll {
			@Override
			public String toString() {
				return "<=all";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaBuilder cb, Object value,
					Subquery<?> sub) {
				return cb.lessThanOrEqualTo(
						(Expression<Comparable>) cb.literal((Comparable) value),
						(Expression<? extends Comparable>) cb.all((Subquery) sub));
			}
		},
		leSome {
			@Override
			public String toString() {
				return "<=some";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaBuilder cb, Object value,
					Subquery<?> sub) {
				return cb.lessThanOrEqualTo(
						(Expression<Comparable>) cb.literal((Comparable) value),
						(Expression<? extends Comparable>) cb.some((Subquery) sub));
			}
		},
		lt {
			@Override
			public String toString() {
				return "<";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaBuilder cb, Object value,
					Subquery<?> sub) {
				return cb.lessThan(
						(Expression<Comparable>) cb.literal((Comparable) value),
						(Expression<? extends Comparable>) cb.all((Subquery) sub));
			}
		},
		ltAll {
			@Override
			public String toString() {
				return "<all";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaBuilder cb, Object value,
					Subquery<?> sub) {
				return cb.lessThan(
						(Expression<Comparable>) cb.literal((Comparable) value),
						(Expression<? extends Comparable>) cb.all((Subquery) sub));
			}
		},
		ltSome {
			@Override
			public String toString() {
				return "<some";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaBuilder cb, Object value,
					Subquery<?> sub) {
				return cb.lessThan(
						(Expression<Comparable>) cb.literal((Comparable) value),
						(Expression<? extends Comparable>) cb.some((Subquery) sub));
			}
		},
		ne {
			@Override
			public String toString() {
				return "<>";
			}

			@Override
			public Predicate criterion(CriteriaBuilder cb, Object value,
					Subquery<?> sub) {
				return cb.notEqual(cb.literal(value), sub);
			}
		},
		notIn {
			@Override
			public String toString() {
				return "!in";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaBuilder cb, Object value,
					Subquery<?> sub) {
				return cb.not(cb.literal(value).in((Subquery) sub));
			}
		};

		@SuppressWarnings({"rawtypes", "unchecked"})
		public abstract Predicate criterion(CriteriaBuilder cb, Object value,
				Subquery<?> sub);

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

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	@XmlProperty(parser = "spring:dorado.hibernate.subQueryValueCriterionOpParser")
	@IdeProperty(enumValues = "=,=all,>=,>=all,>=some,>,>all,>some,in,<=,<=all,<=some,<,<all,<some,<>,!in")
	public OP getOp() {
		return op;
	}

	public void setOp(OP op) {
		this.op = op;
	}

	@XmlSubNode(fixed = true)
	public TopCriteria getCriteria() {
		return innerQuery;
	}

	public void setCriteria(TopCriteria innerQuery) {
		this.innerQuery = innerQuery;
	}

	@Override
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Predicate toPredicate(CriteriaContext context, Object parameter,
			HibernateCriteriaTransformer transformer) throws Exception {
		String dataType = this.getDataType();
		Object v1 = this.getValue();
		Object value = transformer.getValueFromParameter(parameter, dataType,
				v1);

		TopCriteria innerCriteria = this.getCriteria();

		CriteriaBuilder cb = context.getCriteriaBuilder();
		CriteriaQuery<?> outerQuery = context.getQuery();

		Subquery<Object> sub = outerQuery.subquery(Object.class);
		Root<?> subRoot = sub.from(Object.class);
		sub.select((Expression) subRoot);

		SubQueryValueCriterion.OP op = this.getOp();
		if (op != null) {
			return op.criterion(cb, value, sub);
		} else {
			return null;
		}
	}
}
