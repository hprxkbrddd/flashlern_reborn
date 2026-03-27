package io.github.flashlearn.app.friendship.repository;

import io.github.flashlearn.app.friendship.entity.Friendship;
import io.github.flashlearn.app.user.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("select f from Friendship f where (f.requester = :u1 and f.receiver = :u2) or (f.requester = :u2 and f.receiver = :u1)")
    Optional<Friendship> findBetween(@Param("u1") User u1, @Param("u2") User u2);

    @Query("select f from Friendship f where (f.requester = :user or f.receiver = :user) and f.status = 'ACCEPTED'")
    List<Friendship> findAcceptedForUser(@Param("user") User user);

    @Query("SELECT f FROM Friendship f WHERE f.receiver = :user AND f.status = 'PENDING'")
    @EntityGraph(attributePaths = {"requester"})
    List<Friendship> findIncomingForUser(@Param("user") User user); // TODO replace entity with projection

    @Query("SELECT f.receiver FROM Friendship f WHERE f.requester = :user and f.status = 'ACCEPTED'")
    @EntityGraph(attributePaths = {"receiver"})
    Set<User> findAcceptedFriendsSentBy(User user); // TODO replace entity with projection

    @Query("SELECT f.requester FROM Friendship f WHERE f.receiver = :user and f.status = 'ACCEPTED'")
    @EntityGraph(attributePaths = {"requester"})
    Set<User> findAcceptedFriendsReceivedBy(User user); // TODO replace entity with projection
}
