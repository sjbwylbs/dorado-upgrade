package com.bstek.dorado.view.config.attachment;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ResourceCacheElementTest {

	@Test
	void should_store_value() {
		ResourceCacheElement element = new ResourceCacheElement(null, "cachedValue");
		assertThat(element.getObjectValue()).isEqualTo("cachedValue");
	}

	@Test
	void should_return_null_key_when_resource_is_null() {
		ResourceCacheElement element = new ResourceCacheElement(null, "value");
		assertThat(element.getObjectKey()).isNull();
	}

	@Test
	void should_not_be_expired_when_resource_is_null() {
		ResourceCacheElement element = new ResourceCacheElement(null, "value");
		assertThat(element.isExpired()).isFalse();
	}
}
