package com.sentinel.common.postgresql.user.repository;

import com.sentinel.common.postgresql.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    @Query(
        """
            SELECT DISTINCT u FROM User u
            LEFT JOIN FETCH u.roles r
            LEFT JOIN FETCH r.roleScopes
            WHERE u.id = :id
            """)
    Optional<User> findByIdWithRolesAndPermissions(@Param("id") UUID id);

    @Query(
        """
            SELECT DISTINCT u FROM User u
            LEFT JOIN FETCH u.roles r
            LEFT JOIN FETCH r.roleScopes
            WHERE LOWER(u.email) = LOWER(:email)
            """)
    Optional<User> findByEmailWithRolesAndPermissions(@Param("email") String email);

    @Override
    @EntityGraph(attributePaths = {"tenant"})
    Page<User> findAll(Specification<User> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"tenant", "roles"})
    Optional<User> findWithRolesByIdAndTenantId(UUID id, UUID tenantId);

    List<User> findByTenantIdInAndTenantAdminTrue(Collection<UUID> tenantIds);

    List<User> findByTenantIdAndTenantAdminTrueOrderByEmailAsc(UUID tenantId);
}
