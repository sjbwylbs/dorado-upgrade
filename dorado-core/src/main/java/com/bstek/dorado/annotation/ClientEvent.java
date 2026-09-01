package com.bstek.dorado.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface ClientEvent {

	public String name();

	public String[] signature() default "";

	boolean deprecated() default false;

	int[] clientTypes() default {};

}
