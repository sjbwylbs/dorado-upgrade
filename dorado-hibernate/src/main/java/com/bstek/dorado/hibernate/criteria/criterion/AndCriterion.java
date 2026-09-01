package com.bstek.dorado.hibernate.criteria.criterion;

import java.util.List;

import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.hibernate.criteria.CriteriaContext;
import com.bstek.dorado.hibernate.criteria.HibernateCriteriaTransformer;

import jakarta.persistence.criteria.Predicate;

@XmlNode(nodeName = "And")
public class AndCriterion extends JunctionCriterion {

	@Override
	public Predicate toPredicate(CriteriaContext context, Object parameter,
			HibernateCriteriaTransformer transformer) throws Exception {
		List<BaseCriterion> cris = this.getCriterions();
		if (cris != null && cris.size() > 0) {
			List<Predicate> predicates = transformer.listPredicates(cris,
					context, parameter);
			if (predicates != null && predicates.size() > 0) {
				Predicate[] arr = predicates
						.toArray(new Predicate[predicates.size()]);
				return context.getCriteriaBuilder().and(arr);
			}
		}
		return null;
	}

}
