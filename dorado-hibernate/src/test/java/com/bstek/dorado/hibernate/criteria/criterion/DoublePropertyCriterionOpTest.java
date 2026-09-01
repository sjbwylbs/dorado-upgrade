package com.bstek.dorado.hibernate.criteria.criterion;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class DoublePropertyCriterionOpTest {

	@Test
	void should_returnEq_when_valueIsEquals() {
		assertThat(DoublePropertyCriterion.OP.value("=")).isEqualTo(DoublePropertyCriterion.OP.eq);
	}

	@Test
	void should_returnNe_when_valueIsNotEquals() {
		assertThat(DoublePropertyCriterion.OP.value("<>")).isEqualTo(DoublePropertyCriterion.OP.ne);
	}

	@Test
	void should_returnGt_when_valueIsGreaterThan() {
		assertThat(DoublePropertyCriterion.OP.value(">")).isEqualTo(DoublePropertyCriterion.OP.gt);
	}

	@Test
	void should_returnLt_when_valueIsLessThan() {
		assertThat(DoublePropertyCriterion.OP.value("<")).isEqualTo(DoublePropertyCriterion.OP.lt);
	}

	@Test
	void should_returnLe_when_valueIsLessOrEqual() {
		assertThat(DoublePropertyCriterion.OP.value("<=")).isEqualTo(DoublePropertyCriterion.OP.le);
	}

	@Test
	void should_returnGe_when_valueIsGreaterOrEqual() {
		assertThat(DoublePropertyCriterion.OP.value(">=")).isEqualTo(DoublePropertyCriterion.OP.ge);
	}

	@Test
	void should_returnNull_when_valueIsEmpty() {
		assertThat(DoublePropertyCriterion.OP.value("")).isNull();
	}

	@Test
	void should_returnNull_when_valueIsNull() {
		assertThat(DoublePropertyCriterion.OP.value(null)).isNull();
	}

	@Test
	void should_throwException_when_valueIsUnknown() {
		assertThatThrownBy(() -> DoublePropertyCriterion.OP.value("invalid"))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("unknown op");
	}

	@Test
	void should_returnCorrectToString_forAllOps() {
		assertThat(DoublePropertyCriterion.OP.eq.toString()).isEqualTo("=");
		assertThat(DoublePropertyCriterion.OP.ne.toString()).isEqualTo("<>");
		assertThat(DoublePropertyCriterion.OP.gt.toString()).isEqualTo(">");
		assertThat(DoublePropertyCriterion.OP.lt.toString()).isEqualTo("<");
		assertThat(DoublePropertyCriterion.OP.le.toString()).isEqualTo("<=");
		assertThat(DoublePropertyCriterion.OP.ge.toString()).isEqualTo(">=");
	}

	@Test
	void should_haveCorrectValues_forAllOps() {
		assertThat(DoublePropertyCriterion.OP.values()).hasSize(6);
	}
}
