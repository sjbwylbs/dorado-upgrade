package com.bstek.dorado.data.type;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PrimitiveBooleanDataTypeTest {

	private PrimitiveBooleanDataType dataType;

	@BeforeEach
	void setUp() {
		dataType = new PrimitiveBooleanDataType();
	}

	@Test
	void should_return_false_when_fromText_with_null() {
		assertThat(dataType.fromText(null)).isEqualTo(Boolean.FALSE);
	}

	@Test
	void should_return_true_when_fromText_with_true() {
		assertThat(dataType.fromText("true")).isEqualTo(Boolean.TRUE);
	}

	@Test
	void should_return_false_when_fromText_with_false() {
		assertThat(dataType.fromText("false")).isEqualTo(Boolean.FALSE);
	}

	@Test
	void should_return_false_when_fromObject_with_null() {
		assertThat(dataType.fromObject(null)).isEqualTo(Boolean.FALSE);
	}

	@Test
	void should_return_true_when_fromObject_with_true() {
		assertThat(dataType.fromObject("true")).isEqualTo(Boolean.TRUE);
	}

	@Test
	void should_return_same_boolean_when_fromObject_with_boolean() {
		assertThat(dataType.fromObject(Boolean.TRUE)).isEqualTo(Boolean.TRUE);
	}
}
