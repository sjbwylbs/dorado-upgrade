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

public class SubQueryNoValueCriterion extends BaseCriterion {
	private OP op;
	private TopCriteria innerCriteria;

	public static enum OP {
		exist {
			@Override
			public String toString() {
				return "exists";
			}

			@Override
			public Predicate criterion(CriteriaBuilder cb, Subquery<?> sub) {
				return cb.exists(sub);
			}
		},
		notExist {
			@Override
			public String toString() {
				return "!exists";
			}

			@Override
			public Predicate criterion(CriteriaBuilder cb, Subquery<?> sub) {
				return cb.not(cb.exists(sub));
			}
		};

		public abstract Predicate criterion(CriteriaBuilder cb, Subquery<?> sub);

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

	@XmlProperty(parser = "spring:dorado.hibernate.subQueryNoValueCriterionOpParser")
	@IdeProperty(enumValues = "exists,!exists")
	public OP getOp() {
		return op;
	}

	public void setOp(OP op) {
		this.op = op;
	}

	@XmlSubNode(fixed = true)
	public TopCriteria getCriteria() {
		return innerCriteria;
	}

	public void setCriteria(TopCriteria innerQuery) {
		this.innerCriteria = innerQuery;
	}

	@Override
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Predicate toPredicate(CriteriaContext context, Object parameter,
			HibernateCriteriaTransformer transformer) throws Exception {
		TopCriteria innerCriteria = this.getCriteria();

		CriteriaBuilder cb = context.getCriteriaBuilder();
		CriteriaQuery<?> outerQuery = context.getQuery();

		Subquery<Object> sub = outerQuery.subquery(Object.class);
		Root<?> subRoot = sub.from(Object.class);
		sub.select((Expression) subRoot);

		SubQueryNoValueCriterion.OP op = this.getOp();
		if (op != null) {
			return op.criterion(cb, sub);
		} else {
			return null;
		}
	}
}
