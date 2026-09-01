package com.bstek.dorado.hibernate.criteria.criterion;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class NonValueCriterionOpTest {

	@Test
	void should_returnIsNull_when_valueIsNull() {
		assertThat(NonValueCriterion.OP.value("null")).isEqualTo(NonValueCriterion.OP.isNull);
	}

	@Test
	void should_returnIsNotNull_when_valueIsNotNull() {
		assertThat(NonValueCriterion.OP.value("!null")).isEqualTo(NonValueCriterion.OP.isNotNull);
	}

	@Test
	void should_returnIsEmpty_when_valueIsEmpty() {
		assertThat(NonValueCriterion.OP.value("empty")).isEqualTo(NonValueCriterion.OP.isEmpty);
	}

	@Test
	void should_returnIsNotEmpty_when_valueIsNotEmpty() {
		assertThat(NonValueCriterion.OP.value("!empty")).isEqualTo(NonValueCriterion.OP.isNotEmpty);
	}

	@Test
	void should_returnNull_when_valueIsEmptyString() {
		assertThat(NonValueCriterion.OP.value("")).isNull();
	}

	@Test
	void should_returnNull_when_valueIsNullInput() {
		assertThat(NonValueCriterion.OP.value(null)).isNull();
	}

	@Test
	void should_throwException_when_valueIsUnknown() {
		assertThatThrownBy(() -> NonValueCriterion.OP.value("invalid"))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("unknown op");
	}

	@Test
	void should_returnCorrectToString_forAllOps() {
		assertThat(NonValueCriterion.OP.isNull.toString()).isEqualTo("null");
		assertThat(NonValueCriterion.OP.isNotNull.toString()).isEqualTo("!null");
		assertThat(NonValueCriterion.OP.isEmpty.toString()).isEqualTo("empty");
		assertThat(NonValueCriterion.OP.isNotEmpty.toString()).isEqualTo("!empty");
	}

	@Test
	void should_haveCorrectNumberOfValues() {
		assertThat(NonValueCriterion.OP.values()).hasSize(4);
	}
}
