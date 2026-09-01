package com.bstek.dorado.web.resolver;

import org.apache.commons.text.StringEscapeUtils;

public class StringEscapeHelper {

	public String html(String s) {
		return StringEscapeUtils.escapeHtml4(s);
	}

}
