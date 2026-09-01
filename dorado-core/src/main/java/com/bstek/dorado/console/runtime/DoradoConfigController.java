package com.bstek.dorado.console.runtime;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.InitializingBean;

import com.bstek.dorado.annotation.DataResolver;
import com.bstek.dorado.annotation.Expose;
import com.bstek.dorado.console.ConsoleConfigure;
import com.bstek.dorado.core.Configure;
import com.bstek.dorado.core.ConfigureStore;
import com.bstek.dorado.data.variant.Record;
import com.bstek.dorado.view.View;
import com.bstek.dorado.view.widget.Container;
import com.bstek.dorado.view.widget.form.Label;
import com.bstek.dorado.view.widget.form.TextArea;
import com.bstek.dorado.view.widget.form.autoform.AutoForm;
import com.bstek.dorado.view.widget.form.autoform.AutoFormElement;
import com.bstek.dorado.web.DoradoContext;
import com.bstek.dorado.web.WebConfigure;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Dorado Config 控制器
 *
 */
public class DoradoConfigController implements InitializingBean {

	private Set<String> properties;

	private Map<String, Object> cacheWebConfigMap = null;

	private static final String DEFAULT_LOCALE = "zh_CN";

	private static final String VARIABLE_PROPERTIES_KEY = "dorado.console.web.configurations";

	public void onViewInit(Label description, Container buttonsContainer, AutoForm propertiesConfigAutoForm,
			View view) {
		HttpServletRequest req = DoradoContext.getAttachedRequest();
		Locale locale = DoradoContext.getAttachedRequest().getLocale();

		initializeCacheWebConfigMap();
		String type = req.getParameter("type");
		Map<String, Object> map = new HashMap<>();
		AutoFormElement element = null;
		ConfigureStore store = Configure.getStore();

		if (locale.toString().equals(DEFAULT_LOCALE)) {
			description.setText("全局配置项在服务运行时不可编辑和调整");
		}
		else {
			description.setText("Global configuration items in non-editable runtime.");
		}
		if (type.equals("WebConfigure")) {
			buttonsContainer.setVisible(true);
			store = WebConfigure.getStore();
			if (locale.toString().equals(DEFAULT_LOCALE)) {
				description.setText("Web配置项可在运行时进行编辑和调整,作用域为当前Session");
			}
			else {
				description
					.setText("Web configuration can be compiled at run time,  and scope is the current Session.");
			}
		}

		Set<String> keySet = store.keySet();
		for (String key : keySet) {
			if (type.equals("WebConfigure") && !properties.contains(key)) {
				continue;
			}
			String id = key.replace('.', '_');
			Object value = store.get(key);
			element = new AutoFormElement();
			element.setId(id);
			element.setLabel(key);
			element.setLabelWidth(320);
			element.setReadOnly(!(type.equals("WebConfigure") && properties.contains(key)));

			if ("core.contextConfigLocation".equals(key) || "core.servletContextConfigLocation".equals(key)) {
				element.setHeight("100");
				element.setEditor(new TextArea());
				String valueStr = (String) value;

				value = valueStr.replaceAll(";", ";\n");
			}
			propertiesConfigAutoForm.addElement(element);
			map.put(id, value);
		}
		view.setUserData(map);

	}

	private void initializeCacheWebConfigMap() {
		if (cacheWebConfigMap == null) {
			cacheWebConfigMap = new Hashtable<>();
			for (String key : properties) {
				Object value = WebConfigure.getStore().get(key);
				cacheWebConfigMap.put(key, value);
			}
		}
	}

	@DataResolver
	public void saveWebConfig(Record record) {
		@SuppressWarnings("unchecked")
		Map<String, Object> map = (Map<String, Object>) record.get("_map");
		for (String key : map.keySet()) {
			WebConfigure.getStore().set(key, map.get(key));
		}

	}

	@Expose
	public Map<String, Object> reset() {
		Iterator<String> iterator = cacheWebConfigMap.keySet().iterator();
		Map<String, Object> map = new HashMap<>();
		String key, id;
		Object value;
		while (iterator.hasNext()) {
			key = iterator.next();
			id = key.replace('.', '_');
			value = cacheWebConfigMap.get(key);
			WebConfigure.getStore().set(key, cacheWebConfigMap.get(key));
			map.put(id, value);
		}

		return map;

	}

	/**
	 * 获得Dorado 配置项
	 * @return
	 */
	@Expose
	public Map<String, Object> getConfigs() {
		Map<String, Object> map = new HashMap<>();
		ConfigureStore store = Configure.getStore();
		Set<String> keySet = store.keySet();
		for (String key : keySet) {
			map.put(key, store.get(key));
		}
		return map;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		properties = new HashSet<>();
		String value = ConsoleConfigure.getString(VARIABLE_PROPERTIES_KEY);
		if (StringUtils.isNotEmpty(value)) {
			value = value.trim();
			value = value.substring(1, value.length() - 1);
			String[] arry = value.split(",");
			for (String element : arry) {
				properties.add(element);
			}
		}

	}

}