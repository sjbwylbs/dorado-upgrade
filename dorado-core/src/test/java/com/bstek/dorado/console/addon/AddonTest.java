package com.bstek.dorado.console.addon;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AddonTest {

	private Addon addon;

	@BeforeEach
	void setUp() {
		addon = new Addon();
	}

	@Test
	void should_return_null_name_by_default() {
		assertThat(addon.getName()).isNull();
	}

	@Test
	void should_set_and_get_name() {
		addon.setName("test-addon");
		assertThat(addon.getName()).isEqualTo("test-addon");
	}

	@Test
	void should_set_and_get_version() {
		addon.setVersion("1.0.0");
		assertThat(addon.getVersion()).isEqualTo("1.0.0");
	}

	@Test
	void should_return_false_for_loadUnlicensed_by_default() {
		assertThat(addon.getLoadUnlicensed()).isFalse();
	}

	@Test
	void should_set_and_get_loadUnlicensed() {
		addon.setLoadUnlicensed(true);
		assertThat(addon.getLoadUnlicensed()).isTrue();
	}

	@Test
	void should_set_and_get_homePage() {
		addon.setHomePage("https://example.com");
		assertThat(addon.getHomePage()).isEqualTo("https://example.com");
	}

	@Test
	void should_set_and_get_description() {
		addon.setDescription("A test addon");
		assertThat(addon.getDescription()).isEqualTo("A test addon");
	}

	@Test
	void should_set_and_get_classifier() {
		addon.setClassifier("jdk17");
		assertThat(addon.getClassifier()).isEqualTo("jdk17");
	}

	@Test
	void should_set_and_get_configurerClassName() {
		addon.setConfigurerClassName("com.example.Configurer");
		assertThat(addon.getConfigurerClassName()).isEqualTo("com.example.Configurer");
	}

	@Test
	void should_set_and_get_listenerClassName() {
		addon.setListenerClassName("com.example.Listener");
		assertThat(addon.getListenerClassName()).isEqualTo("com.example.Listener");
	}

	@Test
	void should_replace_commas_with_newlines_in_propertiesLocations() {
		addon.setPropertiesLocations("a.properties,b.properties,c.properties");
		assertThat(addon.getPropertiesLocations()).isEqualTo("a.properties,\nb.properties,\nc.properties");
	}

	@Test
	void should_replace_commas_with_newlines_in_contextLocations() {
		addon.setContextLocations("a.xml,b.xml");
		assertThat(addon.getContextLocations()).isEqualTo("a.xml,\nb.xml");
	}

	@Test
	void should_replace_commas_with_newlines_in_servletContextLocations() {
		addon.setServletContextLocations("c.xml,d.xml");
		assertThat(addon.getServletContextLocations()).isEqualTo("c.xml,\nd.xml");
	}

	@Test
	void should_handle_null_propertiesLocations() {
		addon.setPropertiesLocations(null);
		assertThat(addon.getPropertiesLocations()).isNull();
	}

	@Test
	void should_handle_empty_propertiesLocations() {
		addon.setPropertiesLocations("");
		assertThat(addon.getPropertiesLocations()).isEqualTo("");
	}

	@Test
	void should_handle_null_contextLocations() {
		addon.setContextLocations(null);
		assertThat(addon.getContextLocations()).isNull();
	}

	@Test
	void should_handle_null_servletContextLocations() {
		addon.setServletContextLocations(null);
		assertThat(addon.getServletContextLocations()).isNull();
	}
}
