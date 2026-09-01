package com.bstek.dorado.hibernate.criteria.criterion;

import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.hibernate.criteria.CriteriaContext;
import com.bstek.dorado.hibernate.criteria.HibernateCriteriaTransformer;

import jakarta.persistence.criteria.Predicate;

@XmlNode(implTypes = "com.bstek.dorado.hibernate.criteria.criterion.*")
public abstract class BaseCriterion {

	private boolean available = true;
	private boolean not = false;

	@ClientProperty(escapeValue = "true")
	public boolean isAvailable() {
		return available;
	}

	public void setAvailable(boolean available) {
		this.available = available;
	}

	@ClientProperty(escapeValue = "false")
	public boolean isNot() {
		return not;
	}

	public void setNot(boolean not) {
		this.not = not;
	}

	public abstract Predicate toPredicate(CriteriaContext context,
			Object parameter, HibernateCriteriaTransformer transformer)
			throws Exception;
}
