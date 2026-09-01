package com.bstek.dorado.common.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.LinkedHashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ExposedServiceRegisterTest {

	private ExposedServiceManager manager;
	private ExposedServiceRegister register;

	@BeforeEach
	void setUp() {
		manager = new ExposedServiceManager();
		register = new ExposedServiceRegister();
		register.setExposedServiceManager(manager);
	}

	@Test
	void should_register_service_with_bean_and_method() throws Exception {
		Map<String, String> services = new LinkedHashMap<>();
		services.put("myService", "myBean#myMethod");
		register.setServices(services);

		register.afterPropertiesSet();

		ExposedServiceDefintion def = manager.getService("myService");
		assertThat(def).isNotNull();
		assertThat(def.getName()).isEqualTo("myService");
		assertThat(def.getBean()).isEqualTo("myBean");
		assertThat(def.getMethod()).isEqualTo("myMethod");
	}

	@Test
	void should_register_service_with_bean_only() throws Exception {
		Map<String, String> services = new LinkedHashMap<>();
		services.put("svc", "someBean");
		register.setServices(services);

		register.afterPropertiesSet();

		ExposedServiceDefintion def = manager.getService("svc");
		assertThat(def).isNotNull();
		assertThat(def.getBean()).isEqualTo("someBean");
		assertThat(def.getMethod()).isNull();
	}

	@Test
	void should_register_multiple_services() throws Exception {
		Map<String, String> services = new LinkedHashMap<>();
		services.put("svc1", "bean1#method1");
		services.put("svc2", "bean2#method2");
		register.setServices(services);

		register.afterPropertiesSet();

		assertThat(manager.getServices()).hasSize(2);
		assertThat(manager.getService("svc1").getBean()).isEqualTo("bean1");
		assertThat(manager.getService("svc2").getBean()).isEqualTo("bean2");
	}

	@Test
	void should_do_nothing_when_services_is_null() throws Exception {
		// services not set (null)
		register.afterPropertiesSet();
		assertThat(manager.getServices()).isEmpty();
	}

	@Test
	void should_throw_when_service_name_is_empty() {
		Map<String, String> services = new LinkedHashMap<>();
		services.put("", "someBean#someMethod");
		register.setServices(services);

		assertThatThrownBy(() -> register.afterPropertiesSet()).isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	void should_throw_when_service_value_is_empty() {
		Map<String, String> services = new LinkedHashMap<>();
		services.put("svc", "");
		register.setServices(services);

		assertThatThrownBy(() -> register.afterPropertiesSet()).isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	void should_parse_last_hash_as_method_separator() throws Exception {
		Map<String, String> services = new LinkedHashMap<>();
		services.put("svc", "bean#method#extra");
		register.setServices(services);

		register.afterPropertiesSet();

		ExposedServiceDefintion def = manager.getService("svc");
		// lastIndexOf('#') splits at the last '#'
		assertThat(def.getBean()).isEqualTo("bean#method");
		assertThat(def.getMethod()).isEqualTo("extra");
	}
}
