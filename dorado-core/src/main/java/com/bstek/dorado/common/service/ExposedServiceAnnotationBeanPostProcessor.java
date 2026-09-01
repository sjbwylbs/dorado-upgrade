package com.bstek.dorado.common.service;

import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.support.MergedBeanDefinitionPostProcessor;
import org.springframework.beans.factory.support.RootBeanDefinition;

import com.bstek.dorado.annotation.Expose;
import com.bstek.dorado.annotation.Unexpose;
import com.bstek.dorado.core.EngineStartupListener;

public class ExposedServiceAnnotationBeanPostProcessor extends EngineStartupListener
		implements MergedBeanDefinitionPostProcessor {

	private static final Log logger = LogFactory.getLog(ExposedServiceAnnotationBeanPostProcessor.class);

	private ExposedServiceManager exposedServiceManager;

	private final Set<PendingObject> pendingDataObjects = new HashSet<>();

	public void setExposedServiceManager(ExposedServiceManager exposedServiceManager) {
		this.exposedServiceManager = exposedServiceManager;
	}

	@Override
	@SuppressWarnings({ "unchecked" })
	public void postProcessMergedBeanDefinition(RootBeanDefinition beanDefinition, Class beanType, String beanName) {
		if (beanType == null) {
			return;
		}

		boolean defaultExposed = (beanType.getAnnotation(Expose.class) != null)
				&& (beanType.getAnnotation(Unexpose.class) == null);

		for (Method method : beanType.getMethods()) {
			Expose annotation = method.getAnnotation(Expose.class);
			boolean exposed = defaultExposed
					|| ((annotation != null) && (beanType.getAnnotation(Unexpose.class) == null));
			if (!exposed) {
				continue;
			}
			pendingDataObjects.add(new PendingObject(annotation, beanName, method.getName()));
		}
	}

	@Override
	public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

	@Override
	public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

	private String autoRegisterExposedServices(PendingObject pendingObject) throws Exception {
		String beanName = pendingObject.getBeanName();
		String methodName = pendingObject.getMethodName();

		String serviceBeanName = "spring:" + beanName;
		String serviceName = beanName + '#' + methodName;

		ExposedServiceDefintion exposedService = new ExposedServiceDefintion();
		exposedService.setName(serviceName);
		exposedService.setBean(serviceBeanName);
		exposedService.setMethod(methodName);
		exposedServiceManager.registerService(exposedService);
		return serviceName;
	}

	@Override
	public void onStartup() throws Exception {
		StringBuilder servicesText = new StringBuilder();
		for (PendingObject pendingObject : pendingDataObjects) {
			String serviceName = autoRegisterExposedServices(pendingObject);
			if (StringUtils.isNotEmpty(serviceName)) {
				if (servicesText.length() > 0) {
					servicesText.append(',');
				}
				servicesText.append(serviceName);
			}
		}
		pendingDataObjects.clear();

		if (servicesText.length() > 0) {
			logger.info("Registered ExposedService(via Annotation): [" + servicesText + "]");
		}
	}

}

class PendingObject {

	private final Expose annotation;

	private final String beanName;

	private final String methodName;

	private final String uniqueName;

	public PendingObject(Expose annotation, String beanName, String methodName) {
		this.annotation = annotation;
		this.beanName = beanName;
		this.methodName = methodName;
		uniqueName = beanName + '#' + methodName;
	}

	public Expose getAnnotation() {
		return annotation;
	}

	public String getBeanName() {
		return beanName;
	}

	public String getMethodName() {
		return methodName;
	}

	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof PendingObject)) {
			return false;
		}
		return uniqueName.equals(((PendingObject) obj).uniqueName);
	}

	@Override
	public int hashCode() {
		return uniqueName.hashCode();
	}

}
