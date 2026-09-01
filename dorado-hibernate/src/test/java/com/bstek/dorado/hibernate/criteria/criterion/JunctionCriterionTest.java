package com.bstek.dorado.hibernate.criteria.criterion;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class JunctionCriterionTest {

	@Test
	void should_addCriterion_when_addCalled() {
		AndCriterion and = new AndCriterion();
		SingleCriterion criterion = new SingleCriterion();
		and.addCriterion(criterion);
		assertThat(and.getCriterions()).hasSize(1);
		assertThat(and.getCriterions()).containsExactly(criterion);
	}

	@Test
	void should_addMultipleCriterions_when_addCalledMultipleTimes() {
		AndCriterion and = new AndCriterion();
		SingleCriterion c1 = new SingleCriterion();
		SingleCriterion c2 = new SingleCriterion();
		SingleCriterion c3 = new SingleCriterion();
		and.addCriterion(c1);
		and.addCriterion(c2);
		and.addCriterion(c3);
		assertThat(and.getCriterions()).hasSize(3);
	}

	@Test
	void should_returnEmptyList_when_noCriterionsAdded() {
		AndCriterion and = new AndCriterion();
		assertThat(and.getCriterions()).isNotNull().isEmpty();
	}

	@Test
	void should_addCriterion_toOrCriterion() {
		OrCriterion or = new OrCriterion();
		SingleCriterion criterion = new SingleCriterion();
		or.addCriterion(criterion);
		assertThat(or.getCriterions()).hasSize(1);
		assertThat(or.getCriterions()).containsExactly(criterion);
	}

	@Test
	void should_supportMixedCriterionTypes() {
		AndCriterion and = new AndCriterion();
		SingleCriterion single = new SingleCriterion();
		NonValueCriterion nonValue = new NonValueCriterion();
		BetweenCriterion between = new BetweenCriterion();
		and.addCriterion(single);
		and.addCriterion(nonValue);
		and.addCriterion(between);
		assertThat(and.getCriterions()).hasSize(3);
	}

	@Test
	void should_supportNestedJunctions() {
		AndCriterion outer = new AndCriterion();
		OrCriterion inner = new OrCriterion();
		SingleCriterion c1 = new SingleCriterion();
		inner.addCriterion(c1);
		outer.addCriterion(inner);
		assertThat(outer.getCriterions()).hasSize(1);
		assertThat(outer.getCriterions().get(0)).isInstanceOf(OrCriterion.class);
	}
}
