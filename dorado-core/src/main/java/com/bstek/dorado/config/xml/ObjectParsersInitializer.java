package com.bstek.dorado.config.xml;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;

import com.bstek.dorado.core.EngineStartupListener;

public class ObjectParsersInitializer extends EngineStartupListener implements BeanPostProcessor {

	private static Log logger = LogFactory.getLog(ObjectParsersInitializer.class);

	private XmlParserHelper xmlParserHelper;

	private List<ObjectParser> parsers = new ArrayList<>();

	public void setXmlParserHelper(XmlParserHelper xmlParserHelper) {
		this.xmlParserHelper = xmlParserHelper;
	}

	@Override
	public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

	@Override
	public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		if (bean instanceof ObjectParser) {
			parsers.add((ObjectParser) bean);
		}
		return bean;
	}

	@Override
	public int getOrder() {
		return 0;
	}

	@Override
	public void onStartup() throws Exception {
		try {
			for (ObjectParser parser : parsers.toArray(new ObjectParser[0])) {
				xmlParserHelper.initObjectParser(parser);
			}
			parsers.clear();
		}
		catch (Exception e) {
			logger.error(e, e);
		}
	}

}
