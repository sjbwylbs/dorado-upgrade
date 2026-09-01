package com.bstek.dorado.data.config.xml;

import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Node;

import com.bstek.dorado.config.ParseContext;

public class DataTypePropertyParser extends StaticPropertyParser {

	protected DataObjectParseHelper dataObjectParseHelper;

	@Override
	public void setDataObjectParseHelper(DataObjectParseHelper dataObjectParseHelper) {
		this.dataObjectParseHelper = dataObjectParseHelper;
	}

	@Override
	protected Object doParse(Node node, ParseContext context) throws Exception {
		Object value = super.doParse(node, context);
		if (value instanceof String) {
			String dataTypeName = (String) value;
			if (StringUtils.isNotEmpty(dataTypeName)) {
				value = dataObjectParseHelper.getDataTypeByName(dataTypeName, (DataParseContext) context, true);
			}
		}
		return value;
	}

}
