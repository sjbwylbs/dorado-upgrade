package com.bstek.dorado.annotation;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface XmlNodeWrapper {

	String nodeName();

	String label() default "";

	String icon() default "";

	boolean fixed() default true;

}
