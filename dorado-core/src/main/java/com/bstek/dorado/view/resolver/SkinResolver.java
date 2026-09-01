package com.bstek.dorado.view.resolver;

import com.bstek.dorado.view.View;
import com.bstek.dorado.web.DoradoContext;

public interface SkinResolver {

	public String determineSkin(DoradoContext context, View view) throws Exception;

}
