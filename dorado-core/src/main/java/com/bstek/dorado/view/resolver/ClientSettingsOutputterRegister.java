package com.bstek.dorado.view.resolver;

import org.springframework.beans.factory.InitializingBean;

import com.bstek.dorado.spring.RemovableBean;

public class ClientSettingsOutputterRegister implements InitializingBean, RemovableBean {

	private PageHeaderOutputter pageHeaderOutputter;

	private ClientSettingsOutputter clientSettingsOutputter;

	public void setPageHeaderOutputter(PageHeaderOutputter pageHeaderOutputter) {
		this.pageHeaderOutputter = pageHeaderOutputter;
	}

	public void setClientSettingsOutputter(ClientSettingsOutputter clientSettingsOutputter) {
		this.clientSettingsOutputter = clientSettingsOutputter;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		pageHeaderOutputter.addClientSettingsOutputter(clientSettingsOutputter);
	}

}
