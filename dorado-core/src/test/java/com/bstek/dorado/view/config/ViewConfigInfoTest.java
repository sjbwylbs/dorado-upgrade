package com.bstek.dorado.view.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ViewConfigInfoTest {

	@Test
	void should_store_view_name() {
		ViewConfigInfo info = new ViewConfigInfo("myView", null, null);
		assertThat(info.getViewName()).isEqualTo("myView");
	}

	@Test
	void should_store_resource() {
		com.bstek.dorado.core.io.Resource resource = null;
		ViewConfigInfo info = new ViewConfigInfo("myView", resource, null);
		assertThat(info.getResource()).isNull();
	}

	@Test
	void should_store_config_model() {
		Object configModel = new Object();
		ViewConfigInfo info = new ViewConfigInfo("myView", null, configModel);
		assertThat(info.getConfigModel()).isSameAs(configModel);
	}

	@Test
	void should_accept_null_values() {
		ViewConfigInfo info = new ViewConfigInfo(null, null, null);
		assertThat(info.getViewName()).isNull();
		assertThat(info.getResource()).isNull();
		assertThat(info.getConfigModel()).isNull();
	}
}
