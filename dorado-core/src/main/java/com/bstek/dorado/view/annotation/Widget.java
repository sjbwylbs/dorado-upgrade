package com.bstek.dorado.view.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Inherited
public @interface Widget {

	String name() default "";

	String category() default "";

	String dependsPackage() default "";

	boolean autoGenerateId() default false;

}
