package com.bstek.dorado.uploader.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DownloadActionTest {

	private DownloadAction action;

	@BeforeEach
	void setUp() {
		action = new DownloadAction();
	}

	@Test
	void should_have_default_url() {
		assertThat(action.getAction()).isEqualTo(">dorado/uploader/filedownload");
	}

	@Test
	void should_have_default_inline_mode_off() {
		assertThat(action.getInlineMode()).isEqualTo(InlineMode.off);
	}

	@Test
	void should_set_and_get_file_provider() {
		action.setFileProvider("myProvider#download");
		assertThat(action.getFileProvider()).isEqualTo("myProvider#download");
	}

	@Test
	void should_set_and_get_inline_mode() {
		action.setInlineMode(InlineMode.browser);
		assertThat(action.getInlineMode()).isEqualTo(InlineMode.browser);
	}

	@Test
	void should_have_null_file_provider_by_default() {
		assertThat(action.getFileProvider()).isNull();
	}
}
