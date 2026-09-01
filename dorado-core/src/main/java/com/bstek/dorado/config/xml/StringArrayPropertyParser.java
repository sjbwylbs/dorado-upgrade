package com.bstek.dorado.config.xml;

import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Node;

import com.bstek.dorado.config.ParseContext;

public class StringArrayPropertyParser extends StaticPropertyParser {

	private String seperator = ",";

	public String getSeperator() {
		return seperator;
	}

	public void setSeperator(String seperator) {
		this.seperator = seperator;
	}

	@Override
	protected Object doParse(Node node, ParseContext context) throws Exception {
		Object value = super.doParse(node, context);
		if (value == null) {
			return null;
		}

		if (value instanceof String) {
			String text = (String) value;
			if (!StringUtils.isEmpty(text)) {
				return StringUtils.split(text, seperator);
			}
			else {
				return null;
			}
		}
		else if (value instanceof String[]) {
			return value;
		}
		else {
			throw new XmlParseException("String array expected.", node, context);
		}
	}

}
