package com.bstek.dorado.idesupport;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.bstek.dorado.idesupport.initializer.RuleTemplateInitializer;

class RuleConfigLoaderTest {

	private RuleConfigLoader loader;
	private TestRuleTemplateBuilder ruleTemplateBuilder;

	/**
	 * Simple test double for RuleTemplateBuilder to avoid Mockito issues with Java 25.
	 */
	static class TestRuleTemplateBuilder extends RuleTemplateBuilder {
		private List<String> configTemplateFiles;

		@Override
		public void setConfigTemplateFiles(List<String> configTemplateFiles) {
			this.configTemplateFiles = configTemplateFiles;
		}

		@Override
		public List<String> getConfigTemplateFiles() {
			return configTemplateFiles;
		}

		@Override
		public void appendInitializerMap(Map<String, RuleTemplateInitializer> initializerMap) {
			// no-op for testing
		}
	}

	@BeforeEach
	void setUp() {
		loader = new RuleConfigLoader();
		ruleTemplateBuilder = new TestRuleTemplateBuilder();
		loader.setRuleTemplateBuilder(ruleTemplateBuilder);
	}

	@Test
	void should_add_config_location_to_existing_list() throws Exception {
		List<String> existingFiles = new ArrayList<>();
		existingFiles.add("existing-config.xml");
		ruleTemplateBuilder.setConfigTemplateFiles(existingFiles);

		loader.setConfigLocation("new-config.xml");
		loader.afterPropertiesSet();

		assertThat(existingFiles).containsExactly("existing-config.xml", "new-config.xml");
	}

	@Test
	void should_create_new_list_when_config_template_files_is_null() throws Exception {
		ruleTemplateBuilder.setConfigTemplateFiles(null);

		loader.setConfigLocation("new-config.xml");
		loader.afterPropertiesSet();

		assertThat(ruleTemplateBuilder.getConfigTemplateFiles()).containsExactly("new-config.xml");
	}

	@Test
	void should_not_add_config_location_when_null() throws Exception {
		ruleTemplateBuilder.setConfigTemplateFiles(null);

		loader.afterPropertiesSet();

		assertThat(ruleTemplateBuilder.getConfigTemplateFiles()).isNull();
	}

	@Test
	void should_handle_both_config_location_and_initializer_map() throws Exception {
		List<String> existingFiles = new ArrayList<>();
		ruleTemplateBuilder.setConfigTemplateFiles(existingFiles);

		Map<String, RuleTemplateInitializer> initializerMap = new HashMap<>();
		loader.setInitializerMap(initializerMap);
		loader.setConfigLocation("config.xml");
		loader.afterPropertiesSet();

		assertThat(existingFiles).containsExactly("config.xml");
	}

	@Test
	void should_set_config_location() {
		loader.setConfigLocation("test-config.xml");
		// Just verify no exception is thrown
	}

	@Test
	void should_set_initializer_map() {
		Map<String, RuleTemplateInitializer> initializerMap = new HashMap<>();
		loader.setInitializerMap(initializerMap);
		// Just verify no exception is thrown
	}
}
