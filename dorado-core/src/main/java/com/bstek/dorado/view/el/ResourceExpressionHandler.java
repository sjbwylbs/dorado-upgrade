package com.bstek.dorado.view.el;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.bstek.dorado.config.definition.Definition;
import com.bstek.dorado.core.Context;
import com.bstek.dorado.core.el.ExpressionHandler;
import com.bstek.dorado.data.resource.ModelResourceManager;
import com.bstek.dorado.view.config.definition.ViewConfigDefinition;
import com.bstek.dorado.view.resource.ViewResourceManager;

public class ResourceExpressionHandler implements Map<String, String> {

	private static final Log logger = LogFactory.getLog(ResourceExpressionHandler.class);

	private static final String RESOURCE_RELATIVE_DEFINITION = "resourceRelativeDefinition";

	private static ExpressionHandler expressionHandler;

	private static ModelResourceManager modelResourceManager;

	private static ViewResourceManager viewResourceManager;

	protected static ExpressionHandler getExpressionHandler() throws Exception {
		if (expressionHandler == null) {
			expressionHandler = (ExpressionHandler) Context.getCurrent().getServiceBean("expressionHandler");
		}
		return expressionHandler;
	}

	protected static ModelResourceManager getModelResourceManager() throws Exception {
		if (modelResourceManager == null) {
			modelResourceManager = (ModelResourceManager) Context.getCurrent().getServiceBean("modelResourceManager");
		}
		return modelResourceManager;
	}

	protected static ViewResourceManager getViewResourceManager() throws Exception {
		if (viewResourceManager == null) {
			viewResourceManager = (ViewResourceManager) Context.getCurrent().getServiceBean("viewResourceManager");
		}
		return viewResourceManager;
	}

	protected String doGet(String path, Object... args) {
		String result = null;
		try {
			Definition definition = (Definition) getExpressionHandler().getJexlContext()
				.get(RESOURCE_RELATIVE_DEFINITION);
			if (definition != null) {
				if (definition instanceof ViewConfigDefinition) {
					result = getViewResourceManager().getString((ViewConfigDefinition) definition, path, args);
				}
				else {
					result = getModelResourceManager().getString(definition, path, args);
				}
			}
		}
		catch (Exception e) {
			logger.warn(e, e);
		}
		return (result != null) ? result : "";
	}

	public String get(String path, Object... args) {
		return doGet(path, args);
	}

	@Override
	public String get(Object path) {
		return doGet((String) path);
	}

	@Override
	public int size() {
		throw new UnsupportedOperationException();
	}

	@Override
	public boolean isEmpty() {
		throw new UnsupportedOperationException();
	}

	@Override
	public boolean containsKey(Object key) {
		throw new UnsupportedOperationException();
	}

	@Override
	public boolean containsValue(Object value) {
		throw new UnsupportedOperationException();
	}

	@Override
	public String put(String key, String value) {
		throw new UnsupportedOperationException();
	}

	@Override
	public String remove(Object key) {
		throw new UnsupportedOperationException();
	}

	@Override
	public void putAll(Map<? extends String, ? extends String> m) {
		throw new UnsupportedOperationException();
	}

	@Override
	public void clear() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Set<String> keySet() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Collection<String> values() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Set<java.util.Map.Entry<String, String>> entrySet() {
		throw new UnsupportedOperationException();
	}

}
