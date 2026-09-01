package com.bstek.dorado.common.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ExposedServiceManagerTest {

	private ExposedServiceManager manager;

	@BeforeEach
	void setUp() {
		manager = new ExposedServiceManager();
	}

	@Test
	void should_return_empty_map_initially() {
		assertThat(manager.getServices()).isEmpty();
	}

	@Test
	void should_register_and_retrieve_service() {
		ExposedServiceDefintion service = new ExposedServiceDefintion();
		service.setName("testService");
		service.setBean("spring:myBean");
		service.setMethod("doWork");

		manager.registerService(service);

		ExposedServiceDefintion retrieved = manager.getService("testService");
		assertThat(retrieved).isNotNull();
		assertThat(retrieved.getName()).isEqualTo("testService");
		assertThat(retrieved.getBean()).isEqualTo("spring:myBean");
		assertThat(retrieved.getMethod()).isEqualTo("doWork");
	}

	@Test
	void should_return_null_for_unknown_service() {
		assertThat(manager.getService("nonExistent")).isNull();
	}

	@Test
	void should_return_unmodifiable_map() {
		ExposedServiceDefintion service = new ExposedServiceDefintion();
		service.setName("svc1");
		manager.registerService(service);

		Map<String, ExposedServiceDefintion> services = manager.getServices();
		assertThat(services).hasSize(1);

		org.assertj.core.api.Assertions.assertThatThrownBy(() -> services.put("another", new ExposedServiceDefintion()))
				.isInstanceOf(UnsupportedOperationException.class);
	}

	@Test
	void should_register_multiple_services() {
		ExposedServiceDefintion s1 = new ExposedServiceDefintion();
		s1.setName("service1");
		ExposedServiceDefintion s2 = new ExposedServiceDefintion();
		s2.setName("service2");

		manager.registerService(s1);
		manager.registerService(s2);

		assertThat(manager.getServices()).hasSize(2);
		assertThat(manager.getService("service1")).isSameAs(s1);
		assertThat(manager.getService("service2")).isSameAs(s2);
	}

	@Test
	void should_overwrite_service_with_same_name() {
		ExposedServiceDefintion s1 = new ExposedServiceDefintion();
		s1.setName("svc");
		s1.setBean("bean1");
		manager.registerService(s1);

		ExposedServiceDefintion s2 = new ExposedServiceDefintion();
		s2.setName("svc");
		s2.setBean("bean2");
		manager.registerService(s2);

		assertThat(manager.getService("svc")).isSameAs(s2);
		assertThat(manager.getServices()).hasSize(1);
	}
}
