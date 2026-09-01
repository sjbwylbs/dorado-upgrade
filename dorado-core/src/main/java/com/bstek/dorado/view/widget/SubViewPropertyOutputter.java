package com.bstek.dorado.view.widget;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.core.Context;
import com.bstek.dorado.data.type.DataType;
import com.bstek.dorado.view.View;
import com.bstek.dorado.view.manager.ViewConfig;
import com.bstek.dorado.view.manager.ViewConfigManager;
import com.bstek.dorado.view.output.JsonBuilder;
import com.bstek.dorado.view.output.ObjectOutputterDispatcher;
import com.bstek.dorado.view.output.OutputContext;
import com.bstek.dorado.view.output.VirtualPropertyOutputter;

public class SubViewPropertyOutputter extends ObjectOutputterDispatcher implements VirtualPropertyOutputter {

	private ViewConfigManager viewConfigManager;

	public void setViewConfigManager(ViewConfigManager viewConfigManager) {
		this.viewConfigManager = viewConfigManager;
	}

	@Override
	public void output(Object object, String property, OutputContext context) throws Exception {
		JsonBuilder jsonBuilder = context.getJsonBuilder();

		SubViewHolder subViewHolder = (SubViewHolder) object;
		String viewName = subViewHolder.getSubView();
		Map<String, Object> subContext = subViewHolder.getContext();
		SubViewLoadMode loadMode = subViewHolder.getLoadMode();

		if (StringUtils.isNotEmpty(viewName)) {
			if (loadMode == SubViewLoadMode.preload) {
				Context doradoContext = Context.getCurrent();
				Map<String, Object> oldContextValues = null;
				if (subContext != null && !subContext.isEmpty()) {
					oldContextValues = new HashMap<>();
					for (Map.Entry<String, Object> entry : subContext.entrySet()) {
						String key = entry.getKey();
						oldContextValues.put(key, doradoContext.getAttribute(key));
						doradoContext.setAttribute(key, entry.getValue());
					}
				}

				Map<String, DataType> oldIncludeDataTypes = context.getIncludeDataTypes();
				context.setIncludeDataTypes(null);

				ViewConfig viewConfig = viewConfigManager.getViewConfig(viewName);
				View view = null;
				jsonBuilder.key(property);
				jsonBuilder.beginValue();
				if (viewConfig != null) {
					view = viewConfig.getView();
					if (view != null) {
						super.outputObject(view, context);
					}
				}
				jsonBuilder.endValue();

				context.setIncludeDataTypes(oldIncludeDataTypes);

				// 此功能使问题过度复杂化了，暂时屏蔽并搜集用户反馈
				/*
				 * if (view != null && StringUtils.isNotEmpty(view.getPageTemplate())) {
				 * String calloutId = "subview_" + context.getCalloutId();
				 * context.addCalloutHtml(view, calloutId);
				 *
				 * StringBuffer script = new StringBuffer();
				 * script.append("self.assignDom(document.getElementById(\"")
				 * .append(calloutId).append("\"));");
				 *
				 * view.addClientEventListener("onCreate", new
				 * DefaultClientEvent(script.toString())); }
				 */

				if (oldContextValues != null) {
					for (Map.Entry<String, Object> entry : oldContextValues.entrySet()) {
						String key = entry.getKey();
						doradoContext.setAttribute(key, oldContextValues.get(key));
					}
				}
			}
		}
	}

}
