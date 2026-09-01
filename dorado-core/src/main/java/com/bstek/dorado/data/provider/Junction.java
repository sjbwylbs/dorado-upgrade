package com.bstek.dorado.data.provider;

import java.util.ArrayList;
import java.util.Collection;

public abstract class Junction implements Criterion {

	private Collection<Criterion> criterions;

	public Collection<Criterion> getCriterions() {
		return criterions;
	}

	public void setCriterions(Collection<Criterion> criterions) {
		this.criterions = criterions;
	}

	public void addCriterion(Criterion criterion) {
		if (criterions == null) {
			criterions = new ArrayList<>();
		}
		criterions.add(criterion);
	}

}
