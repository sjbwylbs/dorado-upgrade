package com.bstek.dorado.spring;

import org.springframework.beans.factory.xml.ParserContext;
import org.w3c.dom.Element;

public interface DoradoAppContextImporter {

	void importDoradoAppContext(Element element, ParserContext parserContext) throws Exception;

}
