package com.bstek.dorado.hibernate.criteria;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.hibernate.criteria.criterion.BaseCriterion;
import com.bstek.dorado.hibernate.criteria.order.Order;
import com.bstek.dorado.hibernate.criteria.projection.BaseProjection;
import com.bstek.dorado.hibernate.criteria.projection.GroupByProjection;

import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.From;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Selection;

public abstract class BaseHibernateCriteriaTransformer implements
		HibernateCriteriaTransformer {

	@Override
	public CriteriaQuery<?> buildQuery(CriteriaContext context,
			TopCriteria topCriteria, Object parameter) throws Exception {
		this.alias(context, topCriteria, parameter);
		this.projection(context, topCriteria);
		this.criterion(context, topCriteria, parameter);
		this.order(context, topCriteria);
		this.fetchMode(context, topCriteria);
		this.subCriteria(context, topCriteria, parameter);
		return context.getQuery();
	}

	// -------------------------- Alias ---------------------------
	protected void alias(CriteriaContext context, BaseCriteria defCriteria,
			Object parameter) throws Exception {
		List<Alias> aliases = defCriteria.getAliases();
		if (aliases == null || aliases.size() == 0) {
			return;
		}

		for (Alias alias : aliases) {
			if (alias.isAvailable()) {
				this.addAlias(context, alias, parameter);
			}
		}
	}

	protected abstract void addAlias(CriteriaContext context, Alias alias,
			Object parameter) throws Exception;

	// -------------------------- Projection ---------------------------
	@SuppressWarnings({ "unchecked", "rawtypes", "deprecation" })
	protected void projection(CriteriaContext context, BaseCriteria defCriteria)
			throws Exception {
		List<BaseProjection> projections = defCriteria.getProjections();
		if (projections == null || projections.size() == 0) {
			return;
		}

		List<Selection<?>> selections = new ArrayList<>();
		List<jakarta.persistence.criteria.Expression<?>> groupByPaths = new ArrayList<>();
		boolean hasAggregation = false;

		for (BaseProjection proj : projections) {
			if (!proj.isAvailable()) {
				continue;
			}

			if (proj instanceof GroupByProjection) {
				GroupByProjection gbp = (GroupByProjection) proj;
				jakarta.persistence.criteria.Path<?> path = context
						.resolvePath(gbp.getPropertyName());
				groupByPaths.add(path);

				Selection<?> sel = gbp.toSelection(context);
				if (sel != null) {
					String alias = proj.getAlias();
					if (StringUtils.isNotEmpty(alias)) {
						sel = sel.alias(alias);
					}
					selections.add(sel);
				}
				continue;
			}

			Selection<?> selection = proj.toSelection(context);
			if (selection != null) {
				String alias = proj.getAlias();
				if (StringUtils.isNotEmpty(alias)) {
					selection = selection.alias(alias);
				}
				selections.add(selection);
			}

			if (proj.isAggregation()) {
				hasAggregation = true;
			}
		}

		if (selections.size() > 0) {
			@SuppressWarnings({"rawtypes", "deprecation"})
			CriteriaQuery query = context.getQuery();
			if (selections.size() == 1) {
				@SuppressWarnings("unchecked")
				Selection sel = selections.get(0);
				query.select(sel);
			} else {
				query.multiselect(selections);
			}
		}

		if (hasAggregation || groupByPaths.size() > 0) {
			CriteriaQuery<?> query = context.getQuery();
			List<Expression<?>> existing = new ArrayList<>(
					query.getGroupList());
			existing.addAll(groupByPaths);
			if (existing.size() > 0) {
				query.groupBy(existing);
			}
		}
	}

	// -------------------------- Criterion ---------------------------
	protected void criterion(CriteriaContext context,
			BaseCriteria defCriteria, Object parameter) throws Exception {
		List<BaseCriterion> criterions = defCriteria.getCriterions();
		if (criterions == null || criterions.size() == 0) {
			return;
		}

		List<Predicate> predicates = listPredicates(criterions, context,
				parameter);
		if (predicates != null && predicates.size() > 0) {
			CriteriaQuery<?> query = context.getQuery();
			Predicate[] arr = predicates
					.toArray(new Predicate[predicates.size()]);
			Predicate existing = query.getRestriction();
			if (existing != null) {
				Predicate[] combined = new Predicate[arr.length + 1];
				combined[0] = existing;
				System.arraycopy(arr, 0, combined, 1, arr.length);
				query.where(combined);
			} else {
				query.where(arr);
			}
		}
	}

	protected Predicate criterion(BaseCriterion cri, CriteriaContext context,
			Object parameter) throws Exception {
		if (!cri.isAvailable()) {
			return null;
		}

		Predicate predicate = cri.toPredicate(context, parameter, this);

		if (predicate != null && cri.isNot()) {
			predicate = context.getCriteriaBuilder().not(predicate);
		}
		return predicate;
	}

	@Override
	public List<Predicate> listPredicates(List<BaseCriterion> defCris,
			CriteriaContext context, Object parameter) throws Exception {
		if (defCris == null || defCris.size() == 0) {
			return null;
		}

		List<Predicate> predicates = new ArrayList<>();
		for (BaseCriterion defCriterion : defCris) {
			Predicate predicate = criterion(defCriterion, context, parameter);
			if (predicate != null) {
				predicates.add(predicate);
			}
		}
		return predicates;
	}

	// -------------------------- Order ---------------------------
	protected void order(CriteriaContext context, BaseCriteria defCriteria) {
		List<Order> defOrders = defCriteria.getOrders();
		if (defOrders == null || defOrders.size() == 0) {
			return;
		}

		List<jakarta.persistence.criteria.Order> jpaOrders = new ArrayList<>();
		for (Order defOrder : defOrders) {
			if (defOrder.isAvailable()) {
				jakarta.persistence.criteria.Order jpaOrder = defOrder
						.toJpaOrder(context);
				if (jpaOrder != null) {
					jpaOrders.add(jpaOrder);
				}
			}
		}

		if (jpaOrders.size() > 0) {
			context.getQuery().orderBy(jpaOrders);
		}
	}

	// -------------------------- FetchMode ---------------------------
	@SuppressWarnings({ "unchecked", "rawtypes" })
	protected void fetchMode(CriteriaContext context,
			BaseCriteria defCriteria) {
		List<FetchMode> fetchModes = defCriteria.getFetchModes();
		if (fetchModes == null || fetchModes.size() == 0) {
			return;
		}

		for (FetchMode fm : fetchModes) {
			if (fm.isAvailable()) {
				String associationPath = fm.getAssociationPath();
				if (StringUtils.isNotEmpty(associationPath)) {
					FetchMode.Mode mode = fm.getMode();
					Root<?> root = context.getRoot();
					if (mode == FetchMode.Mode.JOIN
							|| mode == FetchMode.Mode.DEFAULT) {
						root.fetch(associationPath,
								jakarta.persistence.criteria.JoinType.LEFT);
					}
				}
			}
		}
	}

	// -------------------------- SubCriteria ---------------------------
	@SuppressWarnings({ "unchecked", "rawtypes" })
	protected void subCriteria(CriteriaContext context,
			BaseCriteria defCriteria, Object parameter) throws Exception {
		List<SubCriteria> subCriterias = defCriteria.getSubCriterias();
		if (subCriterias == null || subCriterias.size() == 0) {
			return;
		}

		for (SubCriteria sub : subCriterias) {
			if (sub.isAvailable()) {
				String alias = sub.getAlias();
				String associationPath = sub.getAssociationPath();
				JoinType joinType = sub.getJoinType();

				jakarta.persistence.criteria.JoinType jt = (joinType != null) ? joinType
						.getJpaJoinType()
						: jakarta.persistence.criteria.JoinType.INNER;

				From<?, ?> joined = context.getRoot().join(
						associationPath, jt);
				if (StringUtils.isNotEmpty(alias)) {
					context.registerAlias(alias, joined);
				}

				this.alias(context, sub, parameter);
				this.projection(context, sub);
				this.criterion(context, sub, parameter);
				this.order(context, sub);
				this.fetchMode(context, sub);
			}
		}
	}
}
