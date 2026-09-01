package com.bstek.dorado.view.resource;

import java.util.Locale;

import com.bstek.dorado.core.resource.LocaleResolver;
import com.bstek.dorado.web.DoradoContext;

public class SpringLocaleResolverAdapter implements LocaleResolver {

	private org.springframework.web.servlet.LocaleResolver springLocaleResolver;

	public void setSpringLocaleResolver(org.springframework.web.servlet.LocaleResolver springLocaleResolver) {
		this.springLocaleResolver = springLocaleResolver;
	}

	@Override
	public Locale resolveLocale() throws Exception {
		Locale locale = null;
		if (springLocaleResolver != null) {
			DoradoContext content = DoradoContext.getCurrent();
			if (content instanceof DoradoContext) {
				locale = springLocaleResolver.resolveLocale(DoradoContext.getAttachedRequest());
			}
		}
		return locale;
	}

}
