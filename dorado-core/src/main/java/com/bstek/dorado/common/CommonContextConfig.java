package com.bstek.dorado.common;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.bstek.dorado.common.service.ExposedServiceAnnotationBeanPostProcessor;
import com.bstek.dorado.common.service.ExposedServiceManager;

@Configuration
public class CommonContextConfig {

	@Bean("dorado.exposedServiceManager")
	public ExposedServiceManager exposedServiceManager() {
		return new ExposedServiceManager();
	}

	@Bean("dorado.exposedServiceAnnotationBeanPostProcessor")
	public ExposedServiceAnnotationBeanPostProcessor exposedServiceAnnotationBeanPostProcessor() {
		ExposedServiceAnnotationBeanPostProcessor processor = new ExposedServiceAnnotationBeanPostProcessor();
		processor.setExposedServiceManager(exposedServiceManager());
		return processor;
	}
}
