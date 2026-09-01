package com.bstek.dorado.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Inherited
public @interface ClientProperty {

	String propertyName() default "";

	boolean ignored() default false;

	String outputter() default "";

	String escapeValue() default "";

	boolean alwaysOutput() default false;

	boolean evaluateExpression() default true;

}
