package com.bstek.dorado.hibernate.criteria.criterion;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class SizeCriterionOpTest {

	@Test
	void should_returnEq_when_valueIsEquals() {
		assertThat(SizeCriterion.OP.value("=")).isEqualTo(SizeCriterion.OP.eq);
	}

	@Test
	void should_returnNe_when_valueIsNotEquals() {
		assertThat(SizeCriterion.OP.value("<>")).isEqualTo(SizeCriterion.OP.ne);
	}

	@Test
	void should_returnGt_when_valueIsGreaterThan() {
		assertThat(SizeCriterion.OP.value(">")).isEqualTo(SizeCriterion.OP.gt);
	}

	@Test
	void should_returnLt_when_valueIsLessThan() {
		assertThat(SizeCriterion.OP.value("<")).isEqualTo(SizeCriterion.OP.lt);
	}

	@Test
	void should_returnLe_when_valueIsLessOrEqual() {
		assertThat(SizeCriterion.OP.value("<=")).isEqualTo(SizeCriterion.OP.le);
	}

	@Test
	void should_returnGe_when_valueIsGreaterOrEqual() {
		assertThat(SizeCriterion.OP.value(">=")).isEqualTo(SizeCriterion.OP.ge);
	}

	@Test
	void should_returnNull_when_valueIsEmpty() {
		assertThat(SizeCriterion.OP.value("")).isNull();
	}

	@Test
	void should_returnNull_when_valueIsNull() {
		assertThat(SizeCriterion.OP.value(null)).isNull();
	}

	@Test
	void should_throwException_when_valueIsUnknown() {
		assertThatThrownBy(() -> SizeCriterion.OP.value("xyz"))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("unknown op");
	}

	@Test
	void should_returnCorrectToString_forAllOps() {
		assertThat(SizeCriterion.OP.eq.toString()).isEqualTo("=");
		assertThat(SizeCriterion.OP.ne.toString()).isEqualTo("<>");
		assertThat(SizeCriterion.OP.gt.toString()).isEqualTo(">");
		assertThat(SizeCriterion.OP.lt.toString()).isEqualTo("<");
		assertThat(SizeCriterion.OP.le.toString()).isEqualTo("<=");
		assertThat(SizeCriterion.OP.ge.toString()).isEqualTo(">=");
	}

	@Test
	void should_haveCorrectNumberOfValues() {
		assertThat(SizeCriterion.OP.values()).hasSize(6);
	}
}
