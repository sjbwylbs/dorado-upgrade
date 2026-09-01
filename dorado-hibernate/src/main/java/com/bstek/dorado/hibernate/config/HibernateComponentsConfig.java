package com.bstek.dorado.hibernate.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.bstek.dorado.data.provider.manager.DataProviderTypeRegister;
import com.bstek.dorado.data.provider.manager.DataProviderTypeRegistry;
import com.bstek.dorado.hibernate.provider.CriteriaDataProvider;
import com.bstek.dorado.hibernate.provider.HqlDataProvider;

@Configuration
public class HibernateComponentsConfig {

    @Bean
    public DataProviderTypeRegister hibernateHqlDataProviderRegister(
            @Qualifier("dorado.dataProviderTypeRegistry") DataProviderTypeRegistry registry) {
        DataProviderTypeRegister register = new DataProviderTypeRegister();
        register.setDataProviderTypeRegistry(registry);
        register.setType("hibernateHql");
        register.setClassType(HqlDataProvider.class.getName());
        return register;
    }

    @Bean
    public DataProviderTypeRegister hibernateCriteriaDataProviderRegister(
            @Qualifier("dorado.dataProviderTypeRegistry") DataProviderTypeRegistry registry) {
        DataProviderTypeRegister register = new DataProviderTypeRegister();
        register.setDataProviderTypeRegistry(registry);
        register.setType("hibernateCriteria");
        register.setClassType(CriteriaDataProvider.class.getName());
        return register;
    }
}
