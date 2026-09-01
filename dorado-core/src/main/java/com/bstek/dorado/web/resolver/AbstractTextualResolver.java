package com.bstek.dorado.web.resolver;

import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.util.zip.GZIPOutputStream;
import java.util.zip.ZipOutputStream;

import org.springframework.web.servlet.ModelAndView;

import com.bstek.dorado.core.Constants;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public abstract class AbstractTextualResolver extends AbstractResolver {

	private String contentType = HttpConstants.CONTENT_TYPE_TEXT;

	private String characterEncoding = Constants.DEFAULT_CHARSET;

	private boolean shouldCompress = true;

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public String getCharacterEncoding() {
		return characterEncoding;
	}

	public void setCharacterEncoding(String characterEncoding) {
		this.characterEncoding = characterEncoding;
	}

	public boolean isShouldCompress() {
		return shouldCompress;
	}

	public void setShouldCompress(boolean shouldCompress) {
		this.shouldCompress = shouldCompress;
	}

	protected PrintWriter getWriter(HttpServletRequest request, HttpServletResponse response) throws IOException {
		OutputStream out = getOutputStream(request, response);
		return new PrintWriter(new OutputStreamWriter(out, characterEncoding));
	}

	/**
	 * 返回Response的输出流。
	 * @throws IOException
	 */
	protected OutputStream getOutputStream(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		int encodingType = 0;
		String encoding = request.getHeader(HttpConstants.ACCEPT_ENCODING);
		if (encoding != null) {
			encodingType = (encoding.contains(HttpConstants.GZIP)) ? 1
					: (encoding.contains(HttpConstants.COMPRESS) ? 2 : 0);
		}

		OutputStream out = response.getOutputStream();
		if (encodingType > 0 && isShouldCompress()) {
			try {
				if (encodingType == 1) {
					response.setHeader(HttpConstants.CONTENT_ENCODING, HttpConstants.GZIP);
					out = new GZIPOutputStream(out);
				}
				else {
					response.setHeader(HttpConstants.CONTENT_ENCODING, HttpConstants.COMPRESS);
					out = new ZipOutputStream(out);
				}
			}
			catch (IOException e) {
				// do nothing
			}
		}
		return new BufferedOutputStream(out);
	}

	@Override
	protected final ModelAndView doHandleRequest(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		if (contentType != null) {
			response.setContentType(contentType);
		}
		if (characterEncoding != null) {
			response.setCharacterEncoding(characterEncoding);
		}

		execute(request, response);
		return null;
	}

	public abstract void execute(HttpServletRequest request, HttpServletResponse response) throws Exception;

}
