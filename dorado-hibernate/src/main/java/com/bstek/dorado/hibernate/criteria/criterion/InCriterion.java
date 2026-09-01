package com.bstek.dorado.hibernate.criteria.criterion;

import java.util.Collection;

import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.hibernate.criteria.CriteriaContext;
import com.bstek.dorado.hibernate.criteria.HibernateCriteriaTransformer;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;

public class InCriterion extends SingleProperyCriterion {

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
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Predicate toPredicate(CriteriaContext context, Object parameter,
			HibernateCriteriaTransformer transformer) throws Exception {
		String dataType = this.getDataType();
		String propertyName = this.getPropertyName();
		Object value = this.getValue();
		if (value != null) {
			Object value2 = transformer.getValueFromParameter(parameter,
					dataType, value);
			if (value2 != null) {
				Path path = context.resolvePath(propertyName);
				jakarta.persistence.criteria.CriteriaBuilder cb = context
						.getCriteriaBuilder();
				if (value2 instanceof Collection) {
					Collection<?> cValue = (Collection<?>) value2;
					if (!cValue.isEmpty()) {
						return path.in(cValue);
					}
				} else if (value2.getClass().isArray()) {
					Object[] aValue = (Object[]) value2;
					if (aValue.length > 0) {
						return path.in((Expression[]) aValue);
					}
				} else {
					return cb.equal(path, value2);
				}
			}
		}

		return transformer.getMisValueStrategy().criterion(context, this);
	}
}
