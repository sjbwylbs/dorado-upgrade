package com.bstek.dorado.view.widget.tree;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class BindingConfigTest {

	private BindingConfig config = new BindingConfig();

	@Test
	void should_have_null_name_by_default() {
		assertThat(config.getName()).isNull();
	}

	@Test
	void should_set_and_get_name() {
		config.setName("departments");
		assertThat(config.getName()).isEqualTo("departments");
	}

	@Test
	void should_set_and_get_children_property() {
		config.setChildrenProperty("children");
		assertThat(config.getChildrenProperty()).isEqualTo("children");
	}

	@Test
	void should_not_be_recursive_by_default() {
		assertThat(config.isRecursive()).isFalse();
	}

	@Test
	void should_set_and_get_recursive() {
		config.setRecursive(true);
		assertThat(config.isRecursive()).isTrue();
	}

	@Test
	void should_have_zero_expand_level_by_default() {
		assertThat(config.getExpandLevel()).isZero();
	}

	@Test
	void should_set_and_get_expand_level() {
		config.setExpandLevel(3);
		assertThat(config.getExpandLevel()).isEqualTo(3);
	}

	@Test
	void should_set_and_get_label_property() {
		config.setLabelProperty("name");
		assertThat(config.getLabelProperty()).isEqualTo("name");
	}

	@Test
	void should_set_and_get_icon() {
		config.setIcon("/icons/folder.png");
		assertThat(config.getIcon()).isEqualTo("/icons/folder.png");
	}

	@Test
	void should_set_and_get_icon_property() {
		config.setIconProperty("iconUrl");
		assertThat(config.getIconProperty()).isEqualTo("iconUrl");
	}

	@Test
	void should_set_and_get_icon_class() {
		config.setIconClass("fa-folder");
		assertThat(config.getIconClass()).isEqualTo("fa-folder");
	}

	@Test
	void should_set_and_get_expanded_icon() {
		config.setExpandedIcon("/icons/open.png");
		assertThat(config.getExpandedIcon()).isEqualTo("/icons/open.png");
	}

	@Test
	void should_not_be_checkable_by_default() {
		assertThat(config.isCheckable()).isFalse();
	}

	@Test
	void should_set_and_get_checkable() {
		config.setCheckable(true);
		assertThat(config.isCheckable()).isTrue();
	}

	@Test
	void should_auto_check_children_by_default() {
		assertThat(config.isAutoCheckChildren()).isTrue();
	}

	@Test
	void should_set_and_get_auto_check_children() {
		config.setAutoCheckChildren(false);
		assertThat(config.isAutoCheckChildren()).isFalse();
	}

	@Test
	void should_not_be_ignored_by_default() {
		assertThat(config.isIgnored()).isFalse();
	}

	@Test
	void should_set_and_get_ignored() {
		config.setIgnored(true);
		assertThat(config.isIgnored()).isTrue();
	}

	@Test
	void should_have_empty_child_binding_configs_by_default() {
		assertThat(config.getChildBindingConfigs()).isEmpty();
	}

	@Test
	void should_add_child_binding_config() {
		BindingConfig child = new BindingConfig();
		child.setName("child");
		config.addChildBindingConfig(child);
		assertThat(config.getChildBindingConfigs()).hasSize(1);
		assertThat(config.getChildBindingConfigs().get(0).getName()).isEqualTo("child");
	}

	@Test
	void should_set_and_get_has_child() {
		config.setHasChild(true);
		assertThat(config.getHasChild()).isTrue();
	}

	@Test
	void should_set_and_get_has_child_property() {
		config.setHasChildProperty("hasSubItems");
		assertThat(config.getHasChildProperty()).isEqualTo("hasSubItems");
	}

	@Test
	void should_set_and_get_tags() {
		config.setTags("important,primary");
		assertThat(config.getTags()).isEqualTo("important,primary");
	}
}
