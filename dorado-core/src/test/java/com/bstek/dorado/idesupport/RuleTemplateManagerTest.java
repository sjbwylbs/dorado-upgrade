package com.bstek.dorado.idesupport;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.bstek.dorado.idesupport.template.RuleTemplate;

class RuleTemplateManagerTest {

	private RuleTemplateManager manager;

	@BeforeEach
	void setUp() {
		manager = new RuleTemplateManager();
	}

	@Test
	void should_set_and_get_version() {
		manager.setVersion("1.0");
		assertThat(manager.getVersion()).isEqualTo("1.0");
	}

	@Test
	void should_have_empty_package_infos_by_default() {
		assertThat(manager.getPackageInfos()).isEmpty();
	}

	@Test
	void should_have_empty_rule_templates_by_default() {
		assertThat(manager.getRuleTemplates()).isEmpty();
	}

	@Test
	void should_add_rule_template() throws Exception {
		RuleTemplate rt = new RuleTemplate("testRule");
		manager.addRuleTemplate(rt);
		assertThat(manager.getRuleTemplate("testRule")).isEqualTo(rt);
		assertThat(manager.getRuleTemplates()).hasSize(1);
	}

	@Test
	void should_set_global_true_when_adding_rule_template() throws Exception {
		RuleTemplate rt = new RuleTemplate("testRule");
		rt.setGlobal(false);
		manager.addRuleTemplate(rt);
		assertThat(rt.isGlobal()).isTrue();
	}

	@Test
	void should_remove_rule_template() throws Exception {
		RuleTemplate rt = new RuleTemplate("testRule");
		manager.addRuleTemplate(rt);
		manager.removeRuleTemplate("testRule");
		assertThat(manager.getRuleTemplate("testRule")).isNull();
		assertThat(manager.getRuleTemplates()).isEmpty();
	}

	@Test
	void should_return_null_for_non_existent_rule_template() {
		assertThat(manager.getRuleTemplate("nonExistent")).isNull();
	}

	@Test
	void should_throw_when_adding_rule_template_with_empty_name() {
		RuleTemplate rt = new RuleTemplate("");
		assertThatThrownBy(() -> manager.addRuleTemplate(rt)).isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	void should_notify_listeners_when_rule_template_added() throws Exception {
		List<RuleTemplate> addedTemplates = new ArrayList<>();
		RuleTemplateManagerListener listener = new RuleTemplateManagerListener() {
			@Override
			public void ruleTemplateAdded(RuleTemplateManager manager, RuleTemplate ruleTemplate) {
				addedTemplates.add(ruleTemplate);
			}
		};
		manager.addListener(listener);

		RuleTemplate rt = new RuleTemplate("testRule");
		manager.addRuleTemplate(rt);

		assertThat(addedTemplates).containsExactly(rt);
	}

	@Test
	void should_not_notify_after_listener_removed() throws Exception {
		List<RuleTemplate> addedTemplates = new ArrayList<>();
		RuleTemplateManagerListener listener = new RuleTemplateManagerListener() {
			@Override
			public void ruleTemplateAdded(RuleTemplateManager manager, RuleTemplate ruleTemplate) {
				addedTemplates.add(ruleTemplate);
			}
		};
		manager.addListener(listener);
		manager.removeListener(listener);

		RuleTemplate rt = new RuleTemplate("testRule");
		manager.addRuleTemplate(rt);

		assertThat(addedTemplates).isEmpty();
	}

	@Test
	void should_support_multiple_listeners() throws Exception {
		List<String> notifications = new ArrayList<>();
		RuleTemplateManagerListener listener1 = new RuleTemplateManagerListener() {
			@Override
			public void ruleTemplateAdded(RuleTemplateManager manager, RuleTemplate ruleTemplate) {
				notifications.add("listener1");
			}
		};
		RuleTemplateManagerListener listener2 = new RuleTemplateManagerListener() {
			@Override
			public void ruleTemplateAdded(RuleTemplateManager manager, RuleTemplate ruleTemplate) {
				notifications.add("listener2");
			}
		};
		manager.addListener(listener1);
		manager.addListener(listener2);

		RuleTemplate rt = new RuleTemplate("testRule");
		manager.addRuleTemplate(rt);

		assertThat(notifications).containsExactly("listener1", "listener2");
	}

	@Test
	void should_not_fail_when_removing_listener_with_no_listeners() {
		RuleTemplateManagerListener listener = new RuleTemplateManagerListener() {
			@Override
			public void ruleTemplateAdded(RuleTemplateManager manager, RuleTemplate ruleTemplate) {
			}
		};
		// Should not throw
		manager.removeListener(listener);
	}

	@Test
	void should_add_multiple_rule_templates() throws Exception {
		manager.addRuleTemplate(new RuleTemplate("rule1"));
		manager.addRuleTemplate(new RuleTemplate("rule2"));
		manager.addRuleTemplate(new RuleTemplate("rule3"));
		assertThat(manager.getRuleTemplates()).hasSize(3);
	}

	@Test
	void should_overwrite_rule_template_with_same_name() throws Exception {
		RuleTemplate rt1 = new RuleTemplate("testRule");
		rt1.setLabel("Label1");
		RuleTemplate rt2 = new RuleTemplate("testRule");
		rt2.setLabel("Label2");
		manager.addRuleTemplate(rt1);
		manager.addRuleTemplate(rt2);
		assertThat(manager.getRuleTemplate("testRule").getLabel()).isEqualTo("Label2");
	}
}
