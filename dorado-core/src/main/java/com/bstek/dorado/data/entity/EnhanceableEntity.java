package com.bstek.dorado.data.entity;

public interface EnhanceableEntity {

	void setEntityEnhancer(EntityEnhancer entityEnhancer);

	EntityEnhancer getEntityEnhancer();

	Object internalReadProperty(String property) throws Exception;

	void internalWriteProperty(String property, Object value) throws Exception;

}
