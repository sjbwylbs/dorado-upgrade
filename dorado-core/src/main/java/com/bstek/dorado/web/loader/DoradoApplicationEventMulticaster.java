package com.bstek.dorado.web.loader;

import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.event.SimpleApplicationEventMulticaster;

public class DoradoApplicationEventMulticaster extends SimpleApplicationEventMulticaster {

	@SuppressWarnings("rawtypes")
	public DoradoApplicationEventMulticaster() {
		addApplicationListener(new ApplicationListener() {
			@Override
			public void onApplicationEvent(ApplicationEvent event) {
				if (event instanceof ContextClosedEvent) {
					DoradoLoader.getInstance().destroy();
				}
			}
		});
	}

}
