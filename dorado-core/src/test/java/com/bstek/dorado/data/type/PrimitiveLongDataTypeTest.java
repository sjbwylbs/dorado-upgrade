package com.bstek.dorado.data.type;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PrimitiveLongDataTypeTest {

	private PrimitiveLongDataType dataType;

	@BeforeEach
	void setUp() {
		dataType = new PrimitiveLongDataType();
	}

	@Test
	void should_return_long_class_as_match_type() {
		assertThat(dataType.getMatchType()).isEqualTo(long.class);
	}

	@Test
	void should_return_zero_when_fromText_with_null() {
		assertThat(dataType.fromText(null)).isEqualTo(0L);
	}

	@Test
	void should_return_long_when_fromText_with_valid_string() {
		assertThat(dataType.fromText("9999999999")).isEqualTo(9999999999L);
	}

	@Test
	void should_return_zero_when_fromObject_with_null() {
		assertThat(dataType.fromObject(null)).isEqualTo(0L);
	}

	@Test
	void should_return_long_when_fromObject_with_long() {
		assertThat(dataType.fromObject(42L)).isEqualTo(42L);
	}

	@Test
	void should_return_long_when_fromObject_with_integer() {
		assertThat(dataType.fromObject(42)).isEqualTo(42L);
	}

	@Test
	void should_return_long_when_fromObject_with_string() {
		assertThat(dataType.fromObject("42")).isEqualTo(42L);
	}
}
