package com.bstek.dorado.uploader.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.bstek.dorado.view.registry.ComponentTypeRegistry;
import com.bstek.dorado.view.registry.DefaultComponentTypeRegister;

@Configuration
public class UploaderComponentsConfig {

    @Bean("com.bstek.dorado.uploader.widget.UploadAction")
    public DefaultComponentTypeRegister uploadActionComponentTypeRegister(
            @Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry componentTypeRegistry) {
        DefaultComponentTypeRegister register = new DefaultComponentTypeRegister();
        register.setComponentTypeRegistry(componentTypeRegistry);
        register.setBeanName("com.bstek.dorado.uploader.widget.UploadAction");
        return register;
    }

    @Bean("com.bstek.dorado.uploader.widget.DownloadAction")
    public DefaultComponentTypeRegister downloadActionComponentTypeRegister(
            @Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry componentTypeRegistry) {
        DefaultComponentTypeRegister register = new DefaultComponentTypeRegister();
        register.setComponentTypeRegistry(componentTypeRegistry);
        register.setBeanName("com.bstek.dorado.uploader.widget.DownloadAction");
        return register;
    }
}
