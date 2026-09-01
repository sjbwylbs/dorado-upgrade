package com.bstek.dorado.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Inherited
public @interface XmlSubNode {

	String nodeName() default "";

	String icon() default "";

	String propertyName() default "";

	String propertyType() default "";

	boolean fixed() default false;

	boolean aggregated() default false;

	boolean deprecated() default false;

	String parser() default "";

	boolean resultProcessed() default false;

	String[] implTypes() default "";

	XmlNodeWrapper wrapper() default @XmlNodeWrapper(nodeName = "");

}
