package com.bstek.dorado.tageditor.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.bstek.dorado.view.loader.PackagesConfigLoader;
import com.bstek.dorado.view.loader.PackagesConfigManager;
import com.bstek.dorado.view.registry.ComponentTypeRegistry;
import com.bstek.dorado.view.registry.DefaultComponentTypeRegister;

@Configuration
public class TagEditorComponentsConfig {

    @Bean
    public PackagesConfigLoader tagEditorPackagesConfigLoader(
            @Qualifier("dorado.packagesConfigManager") PackagesConfigManager packagesConfigManager) {
        PackagesConfigLoader loader = new PackagesConfigLoader();
        loader.setPackagesConfigManager(packagesConfigManager);
        loader.setConfigLocation("com/bstek/dorado/tageditor/packages-config.xml");
        return loader;
    }

    @Bean("com.bstek.dorado.tageditor.TagEditor")
    public DefaultComponentTypeRegister tagEditorComponentTypeRegister(
            @Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry componentTypeRegistry) {
        DefaultComponentTypeRegister register = new DefaultComponentTypeRegister();
        register.setComponentTypeRegistry(componentTypeRegistry);
        register.setBeanName("com.bstek.dorado.tageditor.TagEditor");
        return register;
    }
}
