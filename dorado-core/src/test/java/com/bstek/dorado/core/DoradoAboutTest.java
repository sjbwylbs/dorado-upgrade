package com.bstek.dorado.core;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DoradoAboutTest {

	@Test
	void should_return_product_title() {
		assertThat(DoradoAbout.getProductTitle()).isEqualTo("dorado");
	}

	@Test
	void should_return_vendor() {
		assertThat(DoradoAbout.getVendor()).isEqualTo("www.BSTEK.com");
	}

	@Test
	void should_return_non_null_version() {
		assertThat(DoradoAbout.getVersion()).isNotNull().isNotEmpty();
	}

	@Test
	void should_return_non_null_instance_id() {
		assertThat(DoradoAbout.getInstanceId()).isNotNull().isNotEmpty();
	}

	@Test
	void should_return_consistent_instance_id() {
		String id1 = DoradoAbout.getInstanceId();
		String id2 = DoradoAbout.getInstanceId();
		assertThat(id1).isEqualTo(id2);
	}

	@Test
	void should_return_instantiation_time_in_past() {
		long time = DoradoAbout.getInstantiationTime();
		assertThat(time).isGreaterThan(0).isLessThanOrEqualTo(System.currentTimeMillis());
	}
}
