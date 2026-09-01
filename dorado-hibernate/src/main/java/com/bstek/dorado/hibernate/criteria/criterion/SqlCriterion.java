package com.bstek.dorado.hibernate.criteria.criterion;

import java.util.ArrayList;
import java.util.List;

import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlNodeWrapper;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.hibernate.criteria.CriteriaContext;
import com.bstek.dorado.hibernate.criteria.HibernateCriteriaTransformer;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;

public class SqlCriterion extends BaseCriterion {

	private String clause;
	private List<Parameter> parameters = new ArrayList<>();

	public String getClause() {
		return clause;
	}

	public void setClause(String clause) {
		this.clause = clause;
	}

	@XmlSubNode(wrapper = @XmlNodeWrapper(nodeName = "Parameters"))
	public List<Parameter> getParameters() {
		return parameters;
	}

	public void addParameter(Parameter parameter) {
		parameters.add(parameter);
	}

	@XmlNode
	public static class Parameter {
		private String hibernateType;
		private String dataType;
		private Object value;

		@IdeProperty(enumValues = "integer,long,short,float,double,character,byte,boolean,yes_no,true_false,string,date,time,timestamp,calendar,calendar_date,big_decimal,big_integer")
		public String getHibernateType() {
			return hibernateType;
		}

		public void setHibernateType(String hibernateType) {
			this.hibernateType = hibernateType;
		}

		public String getDataType() {
			return dataType;
		}

		public void setDataType(String dataType) {
			this.dataType = dataType;
		}

		@XmlProperty
		public Object getValue() {
			return value;
		}

		public void setValue(Object value) {
			this.value = value;
		}
	}

	@Override
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Predicate toPredicate(CriteriaContext context, Object parameter,
			HibernateCriteriaTransformer transformer) throws Exception {
		String clause = this.getClause();
		List<SqlCriterion.Parameter> parameters = this.getParameters();

		if (parameters.size() == 0) {
			return context.getCriteriaBuilder().equal(
					context.getCriteriaBuilder().literal(clause),
					context.getCriteriaBuilder().literal(clause));
		}

		List<Object> values = new ArrayList<>(parameters.size());
		for (SqlCriterion.Parameter param : parameters) {
			String dataType = param.getDataType();
			Object v1 = param.getValue();
			Object value1 = transformer.getValueFromParameter(parameter,
					dataType, v1);
			values.add(value1);
		}

		Object[] valueArray = values.toArray(new Object[parameters.size()]);
		jakarta.persistence.criteria.CriteriaBuilder cb = context
				.getCriteriaBuilder();

		Expression<Boolean> boolExpr = (Expression<Boolean>) cb
				.function(clause, Boolean.class, new Expression[0]);
		return cb.isTrue(boolExpr);
	}
}
