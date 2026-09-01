package com.bstek.dorado.core.resource;

import java.util.Locale;

public class EmptyLocaleResolver implements LocaleResolver {

	@Override
	public Locale resolveLocale() throws Exception {
		return null;
	}

}
