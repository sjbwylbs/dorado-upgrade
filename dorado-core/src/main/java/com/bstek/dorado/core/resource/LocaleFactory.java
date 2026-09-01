package com.bstek.dorado.core.resource;

import java.util.Locale;

import org.springframework.beans.factory.FactoryBean;

public class LocaleFactory implements FactoryBean<Locale> {

	private String language;

	private String country;

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	@Override
	public Locale getObject() throws Exception {
		return Locale.of(language, country);
	}

	@Override
	public Class<Locale> getObjectType() {
		return Locale.class;
	}

	@Override
	public boolean isSingleton() {
		return true;
	}

}
