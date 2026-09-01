package com.bstek.dorado.config.xml;

public interface XmlParserHelperListener {

	public void onInitParser(XmlParserHelper xmlParserHelper, ObjectParser objectParser, Class<?> beanType)
			throws Exception;

}
