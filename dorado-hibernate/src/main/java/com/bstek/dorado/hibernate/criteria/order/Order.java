package com.bstek.dorado.hibernate.criteria.order;

import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.hibernate.criteria.CriteriaContext;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;

@XmlNode
public class Order {
	private boolean available = true;
	private String propertyName;
	private boolean ignoreCase;
	private Direction direction;

	public static enum Direction {
		asc, desc
	}

	public Direction getDirection() {
		return direction;
	}

	public void setDirection(Direction d) {
		this.direction = d;
	}

	@ClientProperty(escapeValue = "true")
	public boolean isAvailable() {
		return available;
	}

	public void setAvailable(boolean available) {
		this.available = available;
	}

	public String getPropertyName() {
		return propertyName;
	}

	public void setPropertyName(String propertyName) {
		this.propertyName = propertyName;
	}

	public boolean isIgnoreCase() {
		return ignoreCase;
	}

	public void setIgnoreCase(boolean ignoreCase) {
		this.ignoreCase = ignoreCase;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public jakarta.persistence.criteria.Order toJpaOrder(
			CriteriaContext context) {
		Path<?> path = context.resolvePath(propertyName);

		Expression<?> orderExpr;
		if (ignoreCase) {
			try {
				orderExpr = context.getCriteriaBuilder().lower(
						(Expression<String>) path.as(String.class));
			} catch (Exception e) {
				orderExpr = path;
			}
		} else {
			orderExpr = path;
		}

		if (direction == Direction.asc) {
			return context.getCriteriaBuilder().asc(orderExpr);
		} else {
			return context.getCriteriaBuilder().desc(orderExpr);
		}
	}
}
