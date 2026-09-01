package com.bstek.dorado.config.xml;

import org.w3c.dom.Node;

import com.bstek.dorado.config.ConfigUtils;
import com.bstek.dorado.config.ParseContext;

/**
 * 不做任何实际处理的空属性解析器。
 *
 */
public class IgnoreParser implements XmlParser {

	@Override
	public Object parse(Node node, ParseContext context) throws Exception {
		return ConfigUtils.IGNORE_VALUE;
	}

}
