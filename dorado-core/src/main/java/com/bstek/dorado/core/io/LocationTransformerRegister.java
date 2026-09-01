package com.bstek.dorado.core.io;

import org.springframework.beans.factory.InitializingBean;

import com.bstek.dorado.spring.RemovableBean;

public class LocationTransformerRegister implements InitializingBean, RemovableBean {

	private String protocal;

	private LocationTransformer transformer;

	public void setProtocal(String protocal) {
		this.protocal = protocal;
	}

	public void setTransformer(LocationTransformer transformer) {
		this.transformer = transformer;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		LocationTransformerHolder.getPathTransformers().put(protocal, transformer);
	}

}
