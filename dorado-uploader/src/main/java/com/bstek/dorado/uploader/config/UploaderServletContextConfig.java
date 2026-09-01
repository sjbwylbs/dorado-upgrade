package com.bstek.dorado.uploader.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.bstek.dorado.uploader.resolver.DownloadResolver;
import com.bstek.dorado.uploader.resolver.UploadResolver;
import com.bstek.dorado.web.resolver.ResolverRegister;
import com.bstek.dorado.web.resolver.ResolverRegisterProcessor;

@Configuration
public class UploaderServletContextConfig {

    @Bean
    public ResolverRegister uploadResolverRegister(
            @Qualifier("dorado.resolverRegisterProcessor") ResolverRegisterProcessor resolverRegisterProcessor,
            @Qualifier("dorado.uploadResolver") UploadResolver uploadResolver) {
        ResolverRegister register = new ResolverRegister();
        register.setResolverRegisterProcessor(resolverRegisterProcessor);
        register.setUrl("/dorado/uploader/fileupload");
        register.setResolver(uploadResolver);
        return register;
    }

    @Bean("dorado.uploadResolver")
    public UploadResolver uploadResolver() {
        return new UploadResolver();
    }

    @Bean
    public ResolverRegister downloadResolverRegister(
            @Qualifier("dorado.resolverRegisterProcessor") ResolverRegisterProcessor resolverRegisterProcessor,
            @Qualifier("dorado.downloadResolver") DownloadResolver downloadResolver) {
        ResolverRegister register = new ResolverRegister();
        register.setResolverRegisterProcessor(resolverRegisterProcessor);
        register.setUrl("/dorado/uploader/filedownload");
        register.setResolver(downloadResolver);
        return register;
    }

    @Bean("dorado.downloadResolver")
    public DownloadResolver downloadResolver() {
        return new DownloadResolver();
    }
}
