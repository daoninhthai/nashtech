package com.nashtech.assetmanagementwebservice.repository.impl;

import com.nashtech.assetmanagementwebservice.entity.Assignment;
import com.nashtech.assetmanagementwebservice.repository.AssignmentRepositoryCustom;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class AssignmentRepositoryCustomImpl implements AssignmentRepositoryCustom {
    @PersistenceContext
    EntityManager entityManager;

    @Override
    public List<Assignment> get(String keyword, Integer state, LocalDate date) {
        String sql = "SELECT a FROM Assignment a";
        List<String> conditions = new ArrayList<>();
        if (keyword != null) {
            conditions.add("(a.asset.assetCode LIKE :assetCode OR a.asset.assetName LIKE :assetName OR a.user.username LIKE :username)");
        }
        if (state != null) {
            conditions.add("a.state = :state");
        }
        if (date != null) {
            conditions.add("a.assignedDate = :date");
        }
        conditions.add("a.state != :complete");
        if (!conditions.isEmpty()) {
            String t = conditions.stream().collect(Collectors.joining(" AND "));
            sql = sql + " WHERE " + t;
        }
        Query query = entityManager.createQuery(sql, Assignment.class);
        if (keyword != null) {
            query.setParameter("assetName", "%" + keyword + "%").setParameter("assetCode", "%" + keyword + "%").setParameter("username", "%" + keyword + "%");
        }
        if (state != null) {
            query.setParameter("state", state);
        }
        if (date != null) {
            query.setParameter("date", date);
        }
        query.setParameter("complete", -1);

        return query.getResultList();
    }
}
