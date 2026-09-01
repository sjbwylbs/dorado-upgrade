package com.bstek.dorado.view.resolver;

import java.io.IOException;
import java.io.Writer;

import org.apache.commons.text.StringEscapeUtils;

public abstract class ClientSettingsOutputter {

	protected void writeSetting(Writer writer, String key, Object value, boolean quote) throws IOException {
		writer.append(",\n\"").append(key).append('"').append(':');
		if (quote) {
			writer.append('"');
		}
		writer.append(StringEscapeUtils.escapeEcmaScript(String.valueOf(value)));
		if (quote) {
			writer.append('"');
		}
	}

	public abstract void output(Writer writer) throws IOException;

}
