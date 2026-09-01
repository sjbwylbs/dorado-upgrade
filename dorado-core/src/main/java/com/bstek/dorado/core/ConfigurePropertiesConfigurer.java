package com.bstek.dorado.core;

import java.util.Properties;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

public class ConfigurePropertiesConfigurer extends PropertySourcesPlaceholderConfigurer {

	public ConfigurePropertiesConfigurer() {
		this.setIgnoreUnresolvablePlaceholders(true);
	}

	@Override
	public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
		Properties properties = new Properties();
		ConfigureStore store = Configure.getStore();
		for (String key : store.keySet()) {
			properties.setProperty(key, store.getString(key));
		}
		setProperties(properties);
		super.postProcessBeanFactory(beanFactory);
	}

}
