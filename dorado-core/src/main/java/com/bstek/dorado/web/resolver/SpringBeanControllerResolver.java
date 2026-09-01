package com.bstek.dorado.web.resolver;

import java.util.Hashtable;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;
import org.springframework.web.servlet.mvc.Controller;

import com.bstek.dorado.core.Configure;
import com.bstek.dorado.util.PathUtils;

public class SpringBeanControllerResolver extends AbstractControllerResolver implements BeanFactoryAware {

	private static byte nameDelimDotOrBackLashMode = 1;

	private static byte nameDelimDotMode = 2;

	private static byte nameDelimBackLashMode = 3;

	private static String nameDelimDot = "dot";

	private static String nameDelimBackLash = "backlash";

	private static String nameDelimDotOrBackLash = "dotOrBacklash";

	private BeanFactory beanFactory;

	private byte nameDelimMode = 0;

	private String namePrefix;

	private Map<String, Controller> controllerCache;

	@Override
	public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
		this.beanFactory = beanFactory;
	}

	public String getNamePrefix() {
		return namePrefix;
	}

	/**
	 * 设置文件路径的前缀。
	 */
	public void setNamePrefix(String namePrefix) {
		if (namePrefix.endsWith(".")) {
			namePrefix = namePrefix.substring(0, namePrefix.length() - 1);
		}
		this.namePrefix = namePrefix;
	}

	private byte getNameDelimMode() {
		if (nameDelimMode == 0) {
			String setting = Configure.getString("web.controllerNameDelim", nameDelimDotOrBackLash);
			if (nameDelimDot.equals(setting)) {
				nameDelimMode = nameDelimDotMode;
			}
			else if (nameDelimBackLash.equals(setting)) {
				nameDelimMode = nameDelimBackLashMode;
			}
			else {
				nameDelimMode = nameDelimDotOrBackLashMode;
			}
		}
		return nameDelimMode;
	}

	@Override
	protected Controller getController(String controllerName) throws Exception {
		byte delimMode = getNameDelimMode();

		if (delimMode != nameDelimDotMode) {
			controllerName = controllerName.replace(PathUtils.PATH_DELIM, '.');
		}

		Controller controller = (controllerCache != null) ? controllerCache.get(controllerName) : null;
		if (controller == null) {
			char firstChar = controllerName.charAt(0);
			if (firstChar >= 'a' && firstChar <= 'z') {
				controller = beanFactory.getBean(controllerName, Controller.class);
			}
			else {
				if (StringUtils.isNotEmpty(namePrefix)) {
					controllerName = namePrefix + '.' + controllerName;
				}

				try {
					Class<?> beanType = Class.forName(controllerName);
					Object bean = beanFactory.getBean(beanType);
					if (bean != null && bean instanceof Controller) {
						controller = (Controller) bean;
					}
				}
				catch (ClassNotFoundException e) {
					// do nothing;
				}
			}

			if (controller != null) {
				synchronized (this) {
					if (controllerCache == null) {
						controllerCache = new Hashtable<>();
					}
					controllerCache.put(controllerName, controller);
				}
			}
		}

		return controller;
	}

}