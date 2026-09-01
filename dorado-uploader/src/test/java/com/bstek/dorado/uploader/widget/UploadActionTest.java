package com.bstek.dorado.uploader.widget;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class UploadActionTest {

	private UploadAction action;

	@BeforeEach
	void setUp() {
		action = new UploadAction();
	}

	@Test
	void should_have_default_runtimes() {
		assertThat(action.getRuntimes()).isEqualTo("html5,flash,silverlight,gears,browserplus,html4");
	}

	@Test
	void should_have_default_url() {
		assertThat(action.getUrl()).isEqualTo(">dorado/uploader/fileupload");
	}

	@Test
	void should_have_auto_upload_true_by_default() {
		assertThat(action.isAutoUpload()).isTrue();
	}

	@Test
	void should_have_single_file_selection_mode_by_default() {
		assertThat(action.getSelectionMode()).isEqualTo(SelectionMode.singleFile);
	}

	@Test
	void should_have_default_max_file_size() {
		assertThat(action.getMaxFileSize()).isEqualTo("100MB");
	}

	@Test
	void should_set_and_get_file_resolver() {
		action.setFileResolver("myResolver#upload");
		assertThat(action.getFileResolver()).isEqualTo("myResolver#upload");
	}

	@Test
	void should_set_and_get_filters() {
		Filter f = new Filter();
		f.setTitle("Images");
		f.setExtensions("*.jpg;*.png");
		List<Filter> filters = Arrays.asList(f);
		action.setFilters(filters);
		assertThat(action.getFilters()).hasSize(1);
		assertThat(action.getFilters().get(0).getTitle()).isEqualTo("Images");
	}

	@Test
	void should_set_and_get_runtimes() {
		action.setRuntimes("html5");
		assertThat(action.getRuntimes()).isEqualTo("html5");
	}

	@Test
	void should_set_and_get_url() {
		action.setUrl("/custom/upload");
		assertThat(action.getUrl()).isEqualTo("/custom/upload");
	}

	@Test
	void should_set_and_get_max_file_size() {
		action.setMaxFileSize("50MB");
		assertThat(action.getMaxFileSize()).isEqualTo("50MB");
	}

	@Test
	void should_set_and_get_auto_upload() {
		action.setAutoUpload(false);
		assertThat(action.isAutoUpload()).isFalse();
	}

	@Test
	void should_set_and_get_selection_mode() {
		action.setSelectionMode(SelectionMode.multiFiles);
		assertThat(action.getSelectionMode()).isEqualTo(SelectionMode.multiFiles);
	}

	@Test
	void should_return_null_hotkey() {
		assertThat(action.getHotkey()).isNull();
	}

	@Test
	void should_return_null_confirm_message() {
		assertThat(action.getConfirmMessage()).isNull();
	}

	@Test
	void should_set_and_get_headers() {
		Map<String, String> headers = new HashMap<>();
		headers.put("X-Custom", "value");
		action.setHeaders(headers);
		assertThat(action.getHeaders()).containsEntry("X-Custom", "value");
	}
}
