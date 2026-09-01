package com.bstek.dorado.view.service;

import java.io.Writer;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.core.Configure;
import com.bstek.dorado.data.JsonUtils;
import com.bstek.dorado.view.View;
import com.bstek.dorado.view.ViewCache;
import com.bstek.dorado.view.ViewCacheMode;
import com.bstek.dorado.view.ViewOutputter;
import com.bstek.dorado.view.manager.ViewConfig;
import com.bstek.dorado.view.manager.ViewConfigManager;
import com.bstek.dorado.view.output.ClientOutputHelper;
import com.bstek.dorado.view.output.JsonBuilder;
import com.bstek.dorado.view.output.OutputContext;
import com.bstek.dorado.web.DoradoContext;
import com.bstek.dorado.web.resolver.HttpConstants;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import jakarta.servlet.http.HttpServletResponse;

public class LoadViewServiceProcessor implements ServiceProcessor {

	private ViewConfigManager viewConfigManager;

	private ClientOutputHelper clientOutputHelper;

	public void setViewConfigManager(ViewConfigManager viewConfigManager) {
		this.viewConfigManager = viewConfigManager;
	}

	public void setClientOutputHelper(ClientOutputHelper clientOutputHelper) {
		this.clientOutputHelper = clientOutputHelper;
	}

	protected ViewConfig getViewConfig(DoradoContext context, String viewName, Map<String, Object> viewContext)
			throws Exception {
		Map<String, Object> oldContextValues = null;
		try {
			if (viewContext != null && !viewContext.isEmpty()) {
				oldContextValues = new HashMap<>();
				for (Map.Entry<String, Object> entry : viewContext.entrySet()) {
					String key = entry.getKey();
					oldContextValues.put(key, context.getAttribute(key));
					context.setAttribute(key, entry.getValue());
				}
			}

			return viewConfigManager.getViewConfig(viewName);
		}
		finally {
			if (oldContextValues != null) {
				for (Map.Entry<String, Object> entry : oldContextValues.entrySet()) {
					String key = entry.getKey();
					context.setAttribute(key, oldContextValues.get(key));
				}
			}
		}
	}

	@Override
	public void execute(Writer writer, ObjectNode objectNode, DoradoContext context, HttpServletResponse response)
			throws Exception {
		String viewName = JsonUtils.getString(objectNode, "viewName");

		Map<String, Object> viewContext = new HashMap<>();
		JsonNode rudeContext = objectNode.get("context");
		if (rudeContext != null && !rudeContext.isNull()) {
			for (Entry<String, JsonNode> entry : rudeContext.properties()) {
				String key = entry.getKey();
				JsonNode jsonValue = rudeContext.get(key);
				Object value = null;
				if (jsonValue != null) {
					value = JsonUtils.toJavaObject(jsonValue, null);
				}
				viewContext.put(key, value);
			}
		}

		ViewConfig viewConfig = getViewConfig(context, viewName, viewContext);

		View view = viewConfig.getView();
		if (view != null) {
			ViewCacheMode cacheMode = ViewCacheMode.none;
			ViewCache cache = view.getCache();
			if (cache != null && cache.getMode() != null) {
				cacheMode = cache.getMode();
			}
			if (ViewCacheMode.clientSide.equals(cacheMode)) {
				long maxAge = cache.getMaxAge();
				if (maxAge <= 0) {
					maxAge = Configure.getLong("view.clientSideCache.defaultMaxAge", 300);
				}
				response.addHeader(HttpConstants.CACHE_CONTROL, HttpConstants.MAX_AGE + maxAge);
			}
			else {
				response.addHeader(HttpConstants.CACHE_CONTROL, HttpConstants.NO_CACHE);
				response.addHeader("Pragma", "no-cache");
				response.addHeader("Expires", "0");
			}
		}

		OutputContext outputContext = new OutputContext(writer);
		outputContext.setUsePrettyJson(Configure.getBoolean("view.outputPrettyJson"));

		JsonBuilder jsonBuilder = outputContext.getJsonBuilder();

		jsonBuilder.object();
		jsonBuilder.key("createView");
		jsonBuilder.beginValue();
		if (view != null) {
			writer.append("(function(){\n");

			ViewOutputter outputter = (ViewOutputter) clientOutputHelper.getOutputter(view.getClass());
			outputter.outputView(view, outputContext);

			writer.append("return view;\n").append("})");
		}
		jsonBuilder.endValue();

		Set<String> dependsPackages = outputContext.getDependsPackages();
		if (dependsPackages.size() > 0) {
			jsonBuilder.key("packages").value(StringUtils.join(dependsPackages, ','));
		}

		jsonBuilder.endObject();
	}

}
