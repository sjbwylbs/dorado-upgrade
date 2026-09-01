package com.bstek.dorado.data.entity;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.bstek.dorado.data.type.StringDataType;

class NullWrapperTest {

	@Test
	void should_return_dataType_passed_in_constructor() {
		StringDataType dataType = new StringDataType();
		NullWrapper wrapper = new NullWrapper(dataType);
		assertThat(wrapper.getDataType()).isSameAs(dataType);
	}

	@Test
	void should_allow_null_dataType() {
		NullWrapper wrapper = new NullWrapper(null);
		assertThat(wrapper.getDataType()).isNull();
	}
}
