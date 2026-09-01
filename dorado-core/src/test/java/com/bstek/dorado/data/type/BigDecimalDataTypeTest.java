package com.bstek.dorado.data.type;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class BigDecimalDataTypeTest {

	private BigDecimalDataType dataType;

	@BeforeEach
	void setUp() {
		dataType = new BigDecimalDataType();
	}

	@Test
	void should_return_bigDecimal_when_fromText_with_valid_string() {
		Object result = dataType.fromText("123.456");
		assertThat(result).isInstanceOf(BigDecimal.class);
		assertThat(((BigDecimal) result).compareTo(new BigDecimal("123.456"))).isEqualTo(0);
	}

	@Test
	void should_return_null_when_fromText_with_null() {
		assertThat(dataType.fromText(null)).isNull();
	}

	@Test
	void should_return_null_when_fromText_with_empty_string() {
		assertThat(dataType.fromText("")).isNull();
	}

	@Test
	void should_return_null_when_fromObject_with_null() {
		assertThat(dataType.fromObject(null)).isNull();
	}

	@Test
	void should_return_same_bigDecimal_when_fromObject_with_bigDecimal() {
		BigDecimal value = new BigDecimal("99.99");
		assertThat(dataType.fromObject(value)).isSameAs(value);
	}

	@Test
	void should_return_bigDecimal_when_fromObject_with_integer() {
		Object result = dataType.fromObject(42);
		assertThat(result).isInstanceOf(BigDecimal.class);
		assertThat(((BigDecimal) result).compareTo(new BigDecimal("42"))).isEqualTo(0);
	}

	@Test
	void should_return_bigDecimal_when_fromObject_with_long() {
		Object result = dataType.fromObject(42L);
		assertThat(result).isInstanceOf(BigDecimal.class);
		assertThat(((BigDecimal) result).compareTo(new BigDecimal("42"))).isEqualTo(0);
	}

	@Test
	void should_return_bigDecimal_when_fromObject_with_double() {
		assertThat(dataType.fromObject(3.14)).isInstanceOf(BigDecimal.class);
	}

	@Test
	void should_return_bigDecimal_when_fromObject_with_string() {
		Object result = dataType.fromObject("123.456");
		assertThat(result).isInstanceOf(BigDecimal.class);
		assertThat(((BigDecimal) result).compareTo(new BigDecimal("123.456"))).isEqualTo(0);
	}

	@Test
	void should_throw_when_fromObject_with_unsupported_type() {
		assertThatThrownBy(() -> dataType.fromObject(new Object()))
				.isInstanceOf(DataConvertException.class);
	}
}
