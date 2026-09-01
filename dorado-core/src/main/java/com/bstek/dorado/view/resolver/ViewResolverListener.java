package com.bstek.dorado.view.resolver;

import com.bstek.dorado.view.View;

public interface ViewResolverListener {

	public void beforeResolveView(String viewName) throws Exception;

	public void afterResolveView(String viewName, View view) throws Exception;

}
