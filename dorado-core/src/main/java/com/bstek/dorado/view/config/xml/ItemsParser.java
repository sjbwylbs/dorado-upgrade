package com.bstek.dorado.view.config.xml;

import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;
import org.w3c.dom.Node;

import com.bstek.dorado.data.config.xml.DataElementParser;
import com.bstek.dorado.data.config.xml.DataParseContext;

public class ItemsParser extends DataElementParser {

	@Override
	protected Object internalParse(Node node, DataParseContext context) throws Exception {
		Object value = super.internalParse(node, context);
		if (value instanceof String) {
			String[] items = StringUtils.split((String) value, ',');
			return (items != null) ? CollectionUtils.arrayToList(items) : null;
		}
		else {
			return value;
		}
	}

}
