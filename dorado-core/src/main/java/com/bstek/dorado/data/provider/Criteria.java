package com.bstek.dorado.data.provider;

import java.util.ArrayList;
import java.util.List;

public class Criteria implements Cloneable {

	List<Criterion> criterions = new ArrayList<>();

	List<Order> orders = new ArrayList<>();

	public void addCriterion(Criterion criterion) {
		criterions.add(criterion);
	}

	public List<Criterion> getCriterions() {
		return criterions;
	}

	public void addOrder(Order order) {
		orders.add(order);
	}

	public List<Order> getOrders() {
		return orders;
	}

}
