package com.bstek.dorado.spring;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.AbstractRefreshableApplicationContext;
import org.springframework.context.support.GenericApplicationContext;

public abstract class RemovableBeanUtils {

	private static Log logger = LogFactory.getLog(RemovableBeanUtils.class);

	public static void destroyRemovableBeans(ApplicationContext applicationContext) {
		long start = System.currentTimeMillis();
		int removed = 0;
		removed += doDestroyRemovableBeans(applicationContext);

		ApplicationContext parent = applicationContext.getParent();
		if (parent != null) {
			removed += doDestroyRemovableBeans(parent);
		}

		logger.info(removed + " Bean(s) unregisted in " + (System.currentTimeMillis() - start) + "ms.");
	}

	protected static int doDestroyRemovableBeans(ApplicationContext applicationContext) {
		int removed = 0;
		if (applicationContext instanceof GenericApplicationContext) {
			String[] beanNames = applicationContext.getBeanNamesForType(RemovableBean.class);
			for (String beanName : beanNames) {
				((GenericApplicationContext) applicationContext).removeBeanDefinition(beanName);
			}
			removed = beanNames.length;
		}
		else if (applicationContext instanceof AbstractRefreshableApplicationContext) {
			ConfigurableListableBeanFactory beanFactory = ((AbstractRefreshableApplicationContext) applicationContext)
				.getBeanFactory();
			if (beanFactory instanceof DefaultListableBeanFactory) {
				String[] beanNames = applicationContext.getBeanNamesForType(RemovableBean.class);
				for (String beanName : beanNames) {
					((DefaultListableBeanFactory) beanFactory).removeBeanDefinition(beanName);
				}
				removed = beanNames.length;
			}
		}
		return removed;
	}

}
