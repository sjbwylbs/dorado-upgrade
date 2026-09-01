package com.bstek.dorado.data.config.definition;

import org.springframework.beans.factory.InitializingBean;

import com.bstek.dorado.data.listener.GenericObjectListener;
import com.bstek.dorado.spring.RemovableBean;

public class GenericObjectListenerRegister implements InitializingBean, RemovableBean {

	private GenericObjectListener<?> listener;

	public void setListener(GenericObjectListener<?> listener) {
		this.listener = listener;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		if (listener != null) {
			GenericObjectListenerRegistry.addListener(listener);
		}
	}

}
