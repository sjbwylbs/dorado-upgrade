package com.bstek.dorado.hibernate.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.bstek.dorado.core.el.ExpressionHandler;
import com.bstek.dorado.hibernate.criteria.ResultTransformerParser;
import com.bstek.dorado.hibernate.criteria.criterion.DoublePropertyCriterionOpParser;
import com.bstek.dorado.hibernate.criteria.criterion.NonValueCriterionOpParser;
import com.bstek.dorado.hibernate.criteria.criterion.SingleCriterionOpParser;
import com.bstek.dorado.hibernate.criteria.criterion.SizeCriterionOpParser;
import com.bstek.dorado.hibernate.criteria.criterion.SubQueryNoValueCriterionOpParser;
import com.bstek.dorado.hibernate.criteria.criterion.SubQueryPropertyCriterionOpParser;
import com.bstek.dorado.hibernate.criteria.criterion.SubQueryValueCriterionOpParser;

@Configuration
public class HibernateParserConfig {

    @Bean("dorado.hibernate.doublePropertyCriterionOpParser")
    public DoublePropertyCriterionOpParser doublePropertyCriterionOpParser(
            @Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
        DoublePropertyCriterionOpParser parser = new DoublePropertyCriterionOpParser();
        parser.setExpressionHandler(expressionHandler);
        return parser;
    }

    @Bean("dorado.hibernate.nonValueCriterionOpParser")
    public NonValueCriterionOpParser nonValueCriterionOpParser(
            @Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
        NonValueCriterionOpParser parser = new NonValueCriterionOpParser();
        parser.setExpressionHandler(expressionHandler);
        return parser;
    }

    @Bean("dorado.hibernate.singleCriterionOpParser")
    public SingleCriterionOpParser singleCriterionOpParser(
            @Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
        SingleCriterionOpParser parser = new SingleCriterionOpParser();
        parser.setExpressionHandler(expressionHandler);
        return parser;
    }

    @Bean("dorado.hibernate.sizeCriterionOpParser")
    public SizeCriterionOpParser sizeCriterionOpParser(
            @Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
        SizeCriterionOpParser parser = new SizeCriterionOpParser();
        parser.setExpressionHandler(expressionHandler);
        return parser;
    }

    @Bean("dorado.hibernate.subQueryNoValueCriterionOpParser")
    public SubQueryNoValueCriterionOpParser subQueryNoValueCriterionOpParser(
            @Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
        SubQueryNoValueCriterionOpParser parser = new SubQueryNoValueCriterionOpParser();
        parser.setExpressionHandler(expressionHandler);
        return parser;
    }

    @Bean("dorado.hibernate.subQueryPropertyCriterionOpParser")
    public SubQueryPropertyCriterionOpParser subQueryPropertyCriterionOpParser(
            @Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
        SubQueryPropertyCriterionOpParser parser = new SubQueryPropertyCriterionOpParser();
        parser.setExpressionHandler(expressionHandler);
        return parser;
    }

    @Bean("dorado.hibernate.subQueryValueCriterionOpParser")
    public SubQueryValueCriterionOpParser subQueryValueCriterionOpParser(
            @Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
        SubQueryValueCriterionOpParser parser = new SubQueryValueCriterionOpParser();
        parser.setExpressionHandler(expressionHandler);
        return parser;
    }

    @Bean("dorado.hibernate.resultTransformerParser")
    public ResultTransformerParser resultTransformerParser(
            @Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
        ResultTransformerParser parser = new ResultTransformerParser();
        parser.setExpressionHandler(expressionHandler);
        return parser;
    }
}
