package com.bstek.dorado.uploader;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

import org.junit.jupiter.api.Test;

import com.bstek.dorado.uploader.widget.InlineMode;

class DownloadFileTest {

	@Test
	void should_create_with_name_and_input_stream() {
		InputStream is = new ByteArrayInputStream("test".getBytes());
		DownloadFile df = new DownloadFile("test.txt", is);
		assertThat(df.getName()).isEqualTo("test.txt");
		assertThat(df.getInputStream()).isSameAs(is);
	}

	@Test
	void should_have_default_charset_utf8() {
		InputStream is = new ByteArrayInputStream("test".getBytes());
		DownloadFile df = new DownloadFile("test.txt", is);
		assertThat(df.getCharset()).isEqualTo("UTF-8");
	}

	@Test
	void should_have_default_buffer_size_1024() {
		InputStream is = new ByteArrayInputStream("test".getBytes());
		DownloadFile df = new DownloadFile("test.txt", is);
		assertThat(df.getBufferSize()).isEqualTo(1024);
	}

	@Test
	void should_have_default_inline_mode_none() {
		InputStream is = new ByteArrayInputStream("test".getBytes());
		DownloadFile df = new DownloadFile("test.txt", is);
		assertThat(df.getInlineMode()).isEqualTo(InlineMode.none);
	}

	@Test
	void should_set_and_get_file_name() {
		InputStream is = new ByteArrayInputStream("test".getBytes());
		DownloadFile df = new DownloadFile("test.txt", is);
		df.setFileName("custom.txt");
		assertThat(df.getFileName()).isEqualTo("custom.txt");
	}

	@Test
	void should_set_and_get_content_type() {
		InputStream is = new ByteArrayInputStream("test".getBytes());
		DownloadFile df = new DownloadFile("test.txt", is);
		df.setContentType("application/pdf");
		assertThat(df.getContentType()).isEqualTo("application/pdf");
	}

	@Test
	void should_set_and_get_buffer_size() {
		InputStream is = new ByteArrayInputStream("test".getBytes());
		DownloadFile df = new DownloadFile("test.txt", is);
		df.setBufferSize(4096);
		assertThat(df.getBufferSize()).isEqualTo(4096);
	}

	@Test
	void should_set_and_get_charset() {
		InputStream is = new ByteArrayInputStream("test".getBytes());
		DownloadFile df = new DownloadFile("test.txt", is);
		df.setCharset("GBK");
		assertThat(df.getCharset()).isEqualTo("GBK");
	}

	@Test
	void should_set_and_get_inline_mode() {
		InputStream is = new ByteArrayInputStream("test".getBytes());
		DownloadFile df = new DownloadFile("test.txt", is);
		df.setInlineMode(InlineMode.browser);
		assertThat(df.getInlineMode()).isEqualTo(InlineMode.browser);
	}

	@Test
	void should_set_and_get_name() {
		InputStream is = new ByteArrayInputStream("test".getBytes());
		DownloadFile df = new DownloadFile("test.txt", is);
		df.setName("new-name.txt");
		assertThat(df.getName()).isEqualTo("new-name.txt");
	}

	@Test
	void should_set_and_get_input_stream() {
		InputStream is1 = new ByteArrayInputStream("test1".getBytes());
		InputStream is2 = new ByteArrayInputStream("test2".getBytes());
		DownloadFile df = new DownloadFile("test.txt", is1);
		df.setInputStream(is2);
		assertThat(df.getInputStream()).isSameAs(is2);
	}

	@Test
	void should_return_null_file_when_created_with_stream() {
		InputStream is = new ByteArrayInputStream("test".getBytes());
		DownloadFile df = new DownloadFile("test.txt", is);
		assertThat(df.getFile()).isNull();
	}
}
