package com.bstek.dorado.tageditor;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TagEditorTest {

	private TagEditor tagEditor;

	@BeforeEach
	void setUp() {
		tagEditor = new TagEditor();
	}

	@Test
	void should_have_default_text_seperator() {
		assertThat(tagEditor.getTextSeperator()).isEqualTo(",");
	}

	@Test
	void should_set_and_get_text_seperator() {
		tagEditor.setTextSeperator(";");
		assertThat(tagEditor.getTextSeperator()).isEqualTo(";");
	}

	@Test
	void should_have_null_available_tags_by_default() {
		assertThat(tagEditor.getAvailableTags()).isNull();
	}

	@Test
	void should_set_and_get_available_tags() {
		String[] tags = { "Java", "Python", "Go" };
		tagEditor.setAvailableTags(tags);
		assertThat(tagEditor.getAvailableTags()).containsExactly("Java", "Python", "Go");
	}

	@Test
	void should_have_null_required_tags_by_default() {
		assertThat(tagEditor.getRequiredTags()).isNull();
	}

	@Test
	void should_set_and_get_required_tags() {
		String[] tags = { "Java" };
		tagEditor.setRequiredTags(tags);
		assertThat(tagEditor.getRequiredTags()).containsExactly("Java");
	}

	@Test
	void should_have_null_available_tags_data_set_by_default() {
		assertThat(tagEditor.getAvailableTagsDataSet()).isNull();
	}

	@Test
	void should_set_and_get_available_tags_data_set() {
		tagEditor.setAvailableTagsDataSet("ds1");
		assertThat(tagEditor.getAvailableTagsDataSet()).isEqualTo("ds1");
	}

	@Test
	void should_have_null_available_tags_data_path_by_default() {
		assertThat(tagEditor.getAvailableTagsDataPath()).isNull();
	}

	@Test
	void should_set_and_get_available_tags_data_path() {
		tagEditor.setAvailableTagsDataPath("path/to/data");
		assertThat(tagEditor.getAvailableTagsDataPath()).isEqualTo("path/to/data");
	}

	@Test
	void should_accept_unknown_tag_by_default() {
		assertThat(tagEditor.isAcceptUnknownTag()).isTrue();
	}

	@Test
	void should_set_accept_unknown_tag_to_false() {
		tagEditor.setAcceptUnknownTag(false);
		assertThat(tagEditor.isAcceptUnknownTag()).isFalse();
	}

	@Test
	void should_show_available_tags_by_default() {
		assertThat(tagEditor.isShowAvailableTags()).isTrue();
	}

	@Test
	void should_set_show_available_tags_to_false() {
		tagEditor.setShowAvailableTags(false);
		assertThat(tagEditor.isShowAvailableTags()).isFalse();
	}

	@Test
	void should_highlight_required_tags_by_default() {
		assertThat(tagEditor.isHighlightRequiredTags()).isTrue();
	}

	@Test
	void should_set_highlight_required_tags_to_false() {
		tagEditor.setHighlightRequiredTags(false);
		assertThat(tagEditor.isHighlightRequiredTags()).isFalse();
	}
}
