package com.bstek.dorado.hibernate.criteria.projection;

import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.hibernate.criteria.CriteriaContext;

import jakarta.persistence.criteria.Selection;

@XmlNode(implTypes = "com.bstek.dorado.hibernate.criteria.projection.*")
public abstract class BaseProjection {
	private boolean available = true;
	private String alias;

	@ClientProperty(escapeValue = "true")
	public boolean isAvailable() {
		return available;
	}

	public void setAvailable(boolean available) {
		this.available = available;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public abstract Selection<?> toSelection(CriteriaContext context)
			throws Exception;

	public abstract boolean isAggregation();
}
