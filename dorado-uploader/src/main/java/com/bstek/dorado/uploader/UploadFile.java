package com.bstek.dorado.uploader;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.web.multipart.MultipartFile;

public class UploadFile {
	private String fileName;
	private MultipartFile multipartFile;

	public UploadFile(String fileName, MultipartFile multipartFile) {
		this.fileName = fileName;
		this.multipartFile = multipartFile;
	}

	public long getSize() {
		return multipartFile.getSize();
	}

	public InputStream getInputStream() throws IOException {
		return multipartFile.getInputStream();
	}

	public void transferTo(File dest) throws IOException, IllegalStateException {
		multipartFile.transferTo(dest);
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public MultipartFile getMultipartFile() {
		return multipartFile;
	}

	public void setMultipartFile(MultipartFile multipartFile) {
		this.multipartFile = multipartFile;
	}

}
