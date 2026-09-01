package com.bstek.dorado.hibernate.criteria.criterion;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.hibernate.criteria.CriteriaContext;
import com.bstek.dorado.hibernate.criteria.HibernateCriteriaTransformer;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;

public class DoublePropertyCriterion extends BaseCriterion {

	private String propertyName1;
	private String propertyName2;
	private OP op;

	public static enum OP {
		eq {
			@Override
			public String toString() {
				return "=";
			}

			@Override
			public Predicate criterion(CriteriaContext context, String pn1,
					String pn2) {
				Path<?> path1 = context.resolvePath(pn1);
				Path<?> path2 = context.resolvePath(pn2);
				return context.getCriteriaBuilder().equal(path1, path2);
			}
		},
		ne {
			@Override
			public String toString() {
				return "<>";
			}

			@Override
			public Predicate criterion(CriteriaContext context, String pn1,
					String pn2) {
				Path<?> path1 = context.resolvePath(pn1);
				Path<?> path2 = context.resolvePath(pn2);
				return context.getCriteriaBuilder().notEqual(path1, path2);
			}
		},
		gt {
			@Override
			public String toString() {
				return ">";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaContext context, String pn1,
					String pn2) {
				Path path1 = context.resolvePath(pn1);
				Path path2 = context.resolvePath(pn2);
				return context.getCriteriaBuilder().greaterThan(
						(Expression<Comparable>) path1,
						(Expression<Comparable>) path2);
			}
		},
		lt {
			@Override
			public String toString() {
				return "<";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaContext context, String pn1,
					String pn2) {
				Path path1 = context.resolvePath(pn1);
				Path path2 = context.resolvePath(pn2);
				return context.getCriteriaBuilder().lessThan(
						(Expression<Comparable>) path1,
						(Expression<Comparable>) path2);
			}
		},
		le {
			@Override
			public String toString() {
				return "<=";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaContext context, String pn1,
					String pn2) {
				Path path1 = context.resolvePath(pn1);
				Path path2 = context.resolvePath(pn2);
				return context.getCriteriaBuilder().lessThanOrEqualTo(
						(Expression<Comparable>) path1,
						(Expression<Comparable>) path2);
			}
		},
		ge {
			@Override
			public String toString() {
				return ">=";
			}

			@Override
			@SuppressWarnings({ "unchecked", "rawtypes" })
			public Predicate criterion(CriteriaContext context, String pn1,
					String pn2) {
				Path path1 = context.resolvePath(pn1);
				Path path2 = context.resolvePath(pn2);
				return context.getCriteriaBuilder().greaterThanOrEqualTo(
						(Expression<Comparable>) path1,
						(Expression<Comparable>) path2);
			}
		};

		public abstract Predicate criterion(CriteriaContext context,
				String pn1, String pn2);

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

	public String getPropertyName1() {
		return propertyName1;
	}

	public void setPropertyName1(String propertyName1) {
		this.propertyName1 = propertyName1;
	}

	public String getPropertyName2() {
		return propertyName2;
	}

	public void setPropertyName2(String propertyName2) {
		this.propertyName2 = propertyName2;
	}

	@XmlProperty(parser = "spring:dorado.hibernate.doublePropertyCriterionOpParser")
	@IdeProperty(enumValues = "=,<>,>,<,<=,>=")
	public OP getOp() {
		return op;
	}

	public void setOp(OP op) {
		this.op = op;
	}

	@Override
	public Predicate toPredicate(CriteriaContext context, Object parameter,
			HibernateCriteriaTransformer transformer) throws Exception {
		String pn1 = this.getPropertyName1();
		String pn2 = this.getPropertyName2();
		DoublePropertyCriterion.OP op = this.getOp();
		if (op != null) {
			return op.criterion(context, pn1, pn2);
		} else {
			return null;
		}
	}
}
