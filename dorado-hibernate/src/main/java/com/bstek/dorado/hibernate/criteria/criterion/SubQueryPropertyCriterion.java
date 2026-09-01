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
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

public class SubQueryPropertyCriterion extends SingleProperyCriterion {

	private OP op;
	private TopCriteria innerQuery;

	public static enum OP {
		eq {
			@Override
			public String toString() {
				return "=";
			}

			@Override
			public Predicate criterion(CriteriaBuilder cb, Path<?> path,
					Subquery<?> sub) {
				return cb.equal(path, sub);
			}
		},
		eqAll {
			@Override
			public String toString() {
				return "=all";
			}

			@Override
			public Predicate criterion(CriteriaBuilder cb, Path<?> path,
					Subquery<?> sub) {
				return cb.equal(path, cb.all((Subquery<?>) sub));
			}
		},
		ge {
			@Override
			public String toString() {
				return ">=";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaBuilder cb, Path<?> path,
					Subquery<?> sub) {
				return cb.greaterThanOrEqualTo(
						(Expression<Comparable>) path,
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
			public Predicate criterion(CriteriaBuilder cb, Path<?> path,
					Subquery<?> sub) {
				return cb.greaterThanOrEqualTo(
						(Expression<Comparable>) path,
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
			public Predicate criterion(CriteriaBuilder cb, Path<?> path,
					Subquery<?> sub) {
				return cb.greaterThanOrEqualTo(
						(Expression<Comparable>) path,
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
			public Predicate criterion(CriteriaBuilder cb, Path<?> path,
					Subquery<?> sub) {
				return cb.greaterThan(
						(Expression<Comparable>) path,
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
			public Predicate criterion(CriteriaBuilder cb, Path<?> path,
					Subquery<?> sub) {
				return cb.greaterThan(
						(Expression<Comparable>) path,
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
			public Predicate criterion(CriteriaBuilder cb, Path<?> path,
					Subquery<?> sub) {
				return cb.greaterThan(
						(Expression<Comparable>) path,
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
			public Predicate criterion(CriteriaBuilder cb, Path<?> path,
					Subquery<?> sub) {
				return path.in((Subquery) sub);
			}
		},
		le {
			@Override
			public String toString() {
				return "<=";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaBuilder cb, Path<?> path,
					Subquery<?> sub) {
				return cb.lessThanOrEqualTo(
						(Expression<Comparable>) path,
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
			public Predicate criterion(CriteriaBuilder cb, Path<?> path,
					Subquery<?> sub) {
				return cb.lessThanOrEqualTo(
						(Expression<Comparable>) path,
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
			public Predicate criterion(CriteriaBuilder cb, Path<?> path,
					Subquery<?> sub) {
				return cb.lessThanOrEqualTo(
						(Expression<Comparable>) path,
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
			public Predicate criterion(CriteriaBuilder cb, Path<?> path,
					Subquery<?> sub) {
				return cb.lessThan(
						(Expression<Comparable>) path,
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
			public Predicate criterion(CriteriaBuilder cb, Path<?> path,
					Subquery<?> sub) {
				return cb.lessThan(
						(Expression<Comparable>) path,
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
			public Predicate criterion(CriteriaBuilder cb, Path<?> path,
					Subquery<?> sub) {
				return cb.lessThan(
						(Expression<Comparable>) path,
						(Expression<? extends Comparable>) cb.some((Subquery) sub));
			}
		},
		ne {
			@Override
			public String toString() {
				return "<>";
			}

			@Override
			public Predicate criterion(CriteriaBuilder cb, Path<?> path,
					Subquery<?> sub) {
				return cb.notEqual(path, sub);
			}
		},
		notIn {
			@Override
			public String toString() {
				return "!in";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaBuilder cb, Path<?> path,
					Subquery<?> sub) {
				return cb.not(path.in((Subquery) sub));
			}
		};

		@SuppressWarnings({"rawtypes", "unchecked"})
		public abstract Predicate criterion(CriteriaBuilder cb, Path<?> path,
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

	@XmlProperty(parser = "spring:dorado.hibernate.subQueryPropertyCriterionOpParser")
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
		String propertyName = this.getPropertyName();
		TopCriteria innerCriteria = this.getCriteria();

		CriteriaBuilder cb = context.getCriteriaBuilder();
		CriteriaQuery<?> outerQuery = context.getQuery();

		Subquery<Object> sub = outerQuery.subquery(Object.class);
		Root<?> subRoot = sub.from(Object.class);
		sub.select((Expression) subRoot);

		Path<?> path = context.resolvePath(propertyName);

		SubQueryPropertyCriterion.OP op = this.getOp();
		if (op != null) {
			return op.criterion(cb, path, sub);
		} else {
			return null;
		}
	}
}
