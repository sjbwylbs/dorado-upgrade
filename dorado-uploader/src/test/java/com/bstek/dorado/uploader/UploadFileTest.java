package com.bstek.dorado.uploader;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;

import org.junit.jupiter.api.Test;
import org.springframework.web.multipart.MultipartFile;

class UploadFileTest {

	@Test
	void should_create_with_file_name_and_multipart_file() {
		MultipartFile mf = mock(MultipartFile.class);
		UploadFile uf = new UploadFile("test.txt", mf);
		assertThat(uf.getFileName()).isEqualTo("test.txt");
		assertThat(uf.getMultipartFile()).isSameAs(mf);
	}

	@Test
	void should_delegate_get_size_to_multipart_file() throws Exception {
		MultipartFile mf = mock(MultipartFile.class);
		when(mf.getSize()).thenReturn(1024L);
		UploadFile uf = new UploadFile("test.txt", mf);
		assertThat(uf.getSize()).isEqualTo(1024L);
	}

	@Test
	void should_delegate_get_input_stream_to_multipart_file() throws Exception {
		InputStream is = new ByteArrayInputStream("content".getBytes());
		MultipartFile mf = mock(MultipartFile.class);
		when(mf.getInputStream()).thenReturn(is);
		UploadFile uf = new UploadFile("test.txt", mf);
		assertThat(uf.getInputStream()).isSameAs(is);
	}

	@Test
	void should_delegate_transfer_to_to_multipart_file() throws Exception {
		MultipartFile mf = mock(MultipartFile.class);
		File dest = new File("dest.txt");
		UploadFile uf = new UploadFile("test.txt", mf);
		uf.transferTo(dest);
		org.mockito.Mockito.verify(mf).transferTo(dest);
	}

	@Test
	void should_set_and_get_file_name() {
		MultipartFile mf = mock(MultipartFile.class);
		UploadFile uf = new UploadFile("test.txt", mf);
		uf.setFileName("new.txt");
		assertThat(uf.getFileName()).isEqualTo("new.txt");
	}

	@Test
	void should_set_and_get_multipart_file() {
		MultipartFile mf1 = mock(MultipartFile.class);
		MultipartFile mf2 = mock(MultipartFile.class);
		UploadFile uf = new UploadFile("test.txt", mf1);
		uf.setMultipartFile(mf2);
		assertThat(uf.getMultipartFile()).isSameAs(mf2);
	}
}
