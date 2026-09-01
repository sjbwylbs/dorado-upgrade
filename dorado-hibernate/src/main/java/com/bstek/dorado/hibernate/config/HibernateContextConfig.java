package com.bstek.dorado.hibernate.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import com.bstek.dorado.hibernate.criteria.DefaultHibernateCriteriaTransformer;
import com.bstek.dorado.hibernate.criteria.criterion.DefaultMisValueStrategy;
import com.bstek.dorado.hibernate.criteria.parameter.DefaultParameterExtractor;
import com.bstek.dorado.hibernate.hql.DefaultHqlParameterResolver;
import com.bstek.dorado.hibernate.hql.DefaultHqlQuerier;
import com.bstek.dorado.hibernate.provider.SpringWebApplicationEntityManagerFactoryManager;

@Configuration
@Import({HibernateParserConfig.class, HibernateComponentsConfig.class})
public class HibernateContextConfig {

    /**
     * Abstract bean template - not registered as a @Bean.
     * Corresponds to: {@code <bean id="dorado.hibernateEntityPackageRegister" abstract="true" .../>}
     */
    protected EntityPackageRegister hibernateEntityPackageRegister() {
        return new EntityPackageRegister();
    }

    @Bean("dorado.hibernateSessionFactoryManager")
    public SpringWebApplicationEntityManagerFactoryManager hibernateSessionFactoryManager() {
        SpringWebApplicationEntityManagerFactoryManager manager = new SpringWebApplicationEntityManagerFactoryManager();
        manager.setDefaultEntityManagerFactory("entityManagerFactory");
        return manager;
    }

    @Bean("dorado.hqlQuerier")
    public DefaultHqlQuerier hqlQuerier() {
        DefaultHqlQuerier querier = new DefaultHqlQuerier();
        querier.setHqlParameterResolver(new DefaultHqlParameterResolver());
        return querier;
    }

    @Bean("dorado.criteriaTransformer")
    public DefaultHibernateCriteriaTransformer criteriaTransformer() {
        DefaultHibernateCriteriaTransformer transformer = new DefaultHibernateCriteriaTransformer();
        transformer.setParameterExtractor(new DefaultParameterExtractor());
        transformer.setMisValueStrategy(new DefaultMisValueStrategy());
        return transformer;
    }
}
