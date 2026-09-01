package com.bstek.dorado.uploader.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import com.bstek.dorado.view.loader.PackagesConfigLoader;
import com.bstek.dorado.view.loader.PackagesConfigManager;
import com.bstek.dorado.view.resolver.ClientI18NFileRegister;
import com.bstek.dorado.view.resolver.ClientI18NFileRegistry;

@Configuration
@Import(UploaderComponentsConfig.class)
public class UploaderContextConfig {

    @Bean
    public ClientI18NFileRegister uploaderClientI18NFileRegister(
            @Qualifier("dorado.clientI18NFileRegistry") ClientI18NFileRegistry clientI18NFileRegistry) {
        ClientI18NFileRegister register = new ClientI18NFileRegister();
        register.setClientI18NFileRegistry(clientI18NFileRegistry);
        register.setPackageName("dorado.uploader");
        register.setPath("classpath:dorado/resources/i18n/uploader");
        return register;
    }

    @Bean
    public PackagesConfigLoader uploaderPackagesConfigLoader(
            @Qualifier("dorado.packagesConfigManager") PackagesConfigManager packagesConfigManager) {
        PackagesConfigLoader loader = new PackagesConfigLoader();
        loader.setPackagesConfigManager(packagesConfigManager);
        loader.setConfigLocation("com/bstek/dorado/uploader/packages-config.xml");
        return loader;
    }
}
