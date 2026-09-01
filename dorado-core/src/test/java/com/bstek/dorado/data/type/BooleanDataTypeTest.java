package com.bstek.dorado.data.type;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class BooleanDataTypeTest {

	private BooleanDataType dataType;

	@BeforeEach
	void setUp() {
		dataType = new BooleanDataType();
	}

	// fromText tests
	@Test
	void should_return_true_when_fromText_with_true() {
		assertThat(dataType.fromText("true")).isEqualTo(Boolean.TRUE);
	}

	@Test
	void should_return_true_when_fromText_with_TRUE_uppercase() {
		assertThat(dataType.fromText("TRUE")).isEqualTo(Boolean.TRUE);
	}

	@Test
	void should_return_true_when_fromText_with_on() {
		assertThat(dataType.fromText("on")).isEqualTo(Boolean.TRUE);
	}

	@Test
	void should_return_true_when_fromText_with_ON_uppercase() {
		assertThat(dataType.fromText("ON")).isEqualTo(Boolean.TRUE);
	}

	@Test
	void should_return_true_when_fromText_with_yes() {
		assertThat(dataType.fromText("yes")).isEqualTo(Boolean.TRUE);
	}

	@Test
	void should_return_true_when_fromText_with_YES_uppercase() {
		assertThat(dataType.fromText("YES")).isEqualTo(Boolean.TRUE);
	}

	@Test
	void should_return_true_when_fromText_with_1() {
		assertThat(dataType.fromText("1")).isEqualTo(Boolean.TRUE);
	}

	@Test
	void should_return_false_when_fromText_with_false() {
		assertThat(dataType.fromText("false")).isEqualTo(Boolean.FALSE);
	}

	@Test
	void should_return_false_when_fromText_with_off() {
		assertThat(dataType.fromText("off")).isEqualTo(Boolean.FALSE);
	}

	@Test
	void should_return_false_when_fromText_with_no() {
		assertThat(dataType.fromText("no")).isEqualTo(Boolean.FALSE);
	}

	@Test
	void should_return_false_when_fromText_with_0() {
		assertThat(dataType.fromText("0")).isEqualTo(Boolean.FALSE);
	}

	@Test
	void should_return_false_when_fromText_with_random_string() {
		assertThat(dataType.fromText("random")).isEqualTo(Boolean.FALSE);
	}

	@Test
	void should_return_null_when_fromText_with_null() {
		assertThat(dataType.fromText(null)).isNull();
	}

	// fromObject tests
	@Test
	void should_return_null_when_fromObject_with_null() {
		assertThat(dataType.fromObject(null)).isNull();
	}

	@Test
	void should_return_same_boolean_when_fromObject_with_boolean() {
		assertThat(dataType.fromObject(Boolean.TRUE)).isEqualTo(Boolean.TRUE);
		assertThat(dataType.fromObject(Boolean.FALSE)).isEqualTo(Boolean.FALSE);
	}

	@Test
	void should_return_true_when_fromObject_with_true_string() {
		assertThat(dataType.fromObject("true")).isEqualTo(Boolean.TRUE);
	}

	@Test
	void should_return_false_when_fromObject_with_false_string() {
		assertThat(dataType.fromObject("false")).isEqualTo(Boolean.FALSE);
	}

	@Test
	void should_return_false_when_fromObject_with_non_boolean_non_string() {
		assertThat(dataType.fromObject(42)).isEqualTo(Boolean.FALSE);
	}
}
