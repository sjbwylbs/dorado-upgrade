package com.bstek.dorado.data.type;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DataConvertExceptionTest {

	@Test
	void should_contain_source_and_target_type_in_message() {
		DataConvertException ex = new DataConvertException(String.class, Integer.class);
		assertThat(ex.getMessage()).contains("String").contains("Integer");
	}

	@Test
	void should_contain_source_and_target_type_with_cause() {
		RuntimeException cause = new RuntimeException("cause");
		DataConvertException ex = new DataConvertException(String.class, Integer.class, cause);
		assertThat(ex.getMessage()).contains("String").contains("Integer");
		assertThat(ex.getCause()).isEqualTo(cause);
	}

	@Test
	void should_contain_value_and_target_type_in_message() {
		DataConvertException ex = new DataConvertException("hello", Integer.class);
		assertThat(ex.getMessage()).contains("hello").contains("Integer");
	}

	@Test
	void should_contain_value_and_target_type_with_cause() {
		RuntimeException cause = new RuntimeException("cause");
		DataConvertException ex = new DataConvertException("hello", Integer.class, cause);
		assertThat(ex.getMessage()).contains("hello").contains("Integer");
		assertThat(ex.getCause()).isEqualTo(cause);
	}

	@Test
	void should_be_illegalArgumentException() {
		DataConvertException ex = new DataConvertException(String.class, Integer.class);
		assertThat(ex).isInstanceOf(IllegalArgumentException.class);
	}
}
