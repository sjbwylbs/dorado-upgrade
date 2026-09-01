package com.bstek.dorado.view.manager;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import com.bstek.dorado.core.Context;
import com.bstek.dorado.util.PathUtils;
import com.bstek.dorado.view.config.ViewConfigDefinitionFactory;
import com.bstek.dorado.view.config.definition.ViewConfigDefinition;
import com.bstek.dorado.web.DoradoContext;
import com.bstek.dorado.web.DoradoContextUtils;

/**
 * 默认的视图管理器实现类。
 *
 */
public abstract class ViewConfigManagerSupport implements ViewConfigManager {

	private static final String DEFAULT_PATTERN = "**";

	private static final Object NULL_VIEW_FACTORY = new Object();

	private Map<String, Object> factoryMap = new LinkedHashMap<>();

	private Map<String, Object> factoryCache = new HashMap<>();

	@Override
	public void registerViewConfigFactory(String viewNamePattern, Object viewConfigFactory) {
		factoryMap.put(viewNamePattern, viewConfigFactory);
		factoryCache.clear();
	}

	@Override
	public Object getViewConfigFactory(String viewName) {
		Object viewConfigFactory = factoryCache.get(viewName);
		if (viewConfigFactory == null) {
			String viewNameForMatching = (viewName.charAt(0) == '/') ? viewName.substring(1) : viewName;
			Object defaultFactory = factoryMap.get(DEFAULT_PATTERN);

			for (Map.Entry<String, Object> entry : factoryMap.entrySet()) {
				String pattern = entry.getKey();
				if (!DEFAULT_PATTERN.equals(pattern) && PathUtils.match(pattern, viewNameForMatching)) {
					viewConfigFactory = entry.getValue();
					break;
				}
			}
			if (viewConfigFactory == null) {
				viewConfigFactory = defaultFactory;
			}

			factoryCache.put(viewName, (viewConfigFactory == null) ? NULL_VIEW_FACTORY : viewConfigFactory);
		}

		if (viewConfigFactory == NULL_VIEW_FACTORY) {
			viewConfigFactory = null;
		}
		return viewConfigFactory;
	}

	@Override
	public ViewConfig getViewConfig(String viewName) throws Exception {
		Context context = Context.getCurrent();
		if (context instanceof DoradoContext) {
			DoradoContextUtils.pushNewViewContextIfNecessary((DoradoContext) context);
		}

		try {
			ViewConfig viewConfig = null;
			Object viewConfigFactory = getViewConfigFactory(viewName);
			if (viewConfigFactory != null) {
				if (viewConfigFactory instanceof ViewConfigFactory) {
					viewConfig = ((ViewConfigFactory) viewConfigFactory).create(viewName);
				}
				else if (viewConfigFactory instanceof ViewConfigDefinitionFactory) {
					ViewConfigDefinitionFactory vcdf = (ViewConfigDefinitionFactory) viewConfigFactory;
					ViewConfigDefinition viewConfigDefinition = vcdf.create(viewName);
					if (viewConfigDefinition != null) {
						viewConfig = (ViewConfig) viewConfigDefinition.create(new ViewCreationContext(),
								new String[] { viewName });
					}
				}
				else if (viewConfigFactory instanceof ViewConfigDefinition) {
					viewConfig = (ViewConfig) ((ViewConfigDefinition) viewConfigFactory)
						.create(new ViewCreationContext(), new String[] { viewName });
				}
				else {
					viewConfig = (ViewConfig) viewConfigFactory;
				}
			}

			if (viewConfig != null && context instanceof DoradoContext) {
				DoradoContextUtils.bindViewContext((DoradoContext) context, viewConfig);
			}
			return viewConfig;
		}
		finally {
			if (context instanceof DoradoContext) {
				DoradoContextUtils.popViewContext((DoradoContext) context);
			}
		}
	}

}
