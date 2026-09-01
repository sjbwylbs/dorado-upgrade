package com.bstek.dorado.data;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ConstantsTest {

	@Test
	void should_have_correct_data_type_prefix() {
		assertThat(Constants.SCOPE_DATA_TYPE_PREFIX).isEqualTo("DataType:");
	}

	@Test
	void should_have_correct_data_provider_prefix() {
		assertThat(Constants.SCOPE_DATA_PROVIDER_PREFIX).isEqualTo("DataProvider:");
	}

	@Test
	void should_have_correct_data_resolver_prefix() {
		assertThat(Constants.SCOPE_DATA_RESOLVER_PREFIX).isEqualTo("DataResolver:");
	}

	@Test
	void should_have_correct_private_data_object_prefix() {
		assertThat(Constants.PRIVATE_DATA_OBJECT_PREFIX).isEqualTo('$');
	}

	@Test
	void should_have_correct_private_data_object_subfix() {
		assertThat(Constants.PRIVATE_DATA_OBJECT_SUBFIX).isEqualTo(":");
	}

	@Test
	void should_have_correct_default_collection_type() {
		assertThat(Constants.DEFAULT_COLLECTION_TYPE).isEqualTo("Collection");
	}
}
