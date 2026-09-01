package com.bstek.dorado.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.bstek.dorado.view.task.LongTaskScope;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Inherited
public @interface TaskScheduler {

	String impl() default "";

	LongTaskScope scope() default LongTaskScope.session;

	int maxRunning() default 0;

	int maxWaiting() default Integer.MAX_VALUE;

}
