package com.bstek.dorado.hibernate.criteria.criterion;

import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.hibernate.criteria.CriteriaContext;
import com.bstek.dorado.hibernate.criteria.HibernateCriteriaTransformer;

import jakarta.persistence.criteria.Predicate;

public class IdEqCriterion extends BaseCriterion {

	private Object value;
	private String dataType;

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

	@Override
	public Predicate toPredicate(CriteriaContext context, Object parameter,
			HibernateCriteriaTransformer transformer) throws Exception {
		String dataType = this.getDataType();
		Object value = this.getValue();
		if (value != null) {
			Object value2 = transformer.getValueFromParameter(parameter,
					dataType, value);
			if (value2 != null) {
				return context.getCriteriaBuilder().equal(context.getRoot(),
						value2);
			}
		}

		return transformer.getMisValueStrategy().criterion(context, this);
	}

}
