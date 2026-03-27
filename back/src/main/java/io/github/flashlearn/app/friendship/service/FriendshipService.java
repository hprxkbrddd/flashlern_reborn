package io.github.flashlearn.app.friendship.service;

import io.github.flashlearn.app.auth.security.SecurityUtils;
import io.github.flashlearn.app.friendship.dto.FriendRequestNotificationDto;
import io.github.flashlearn.app.friendship.dto.UserSearchResponseDto;
import io.github.flashlearn.app.friendship.entity.Friendship;
import io.github.flashlearn.app.friendship.exception.FiendshipRequestNotFoundException;
import io.github.flashlearn.app.friendship.exception.Forbidden;
import io.github.flashlearn.app.friendship.exception.FriendshipAlreadyExistsException;
import io.github.flashlearn.app.friendship.repository.FriendshipRepository;
import io.github.flashlearn.app.profile.dto.UserProfileResponse;
import io.github.flashlearn.app.user.entity.User;
import io.github.flashlearn.app.user.exception.UserNotFoundException;
import io.github.flashlearn.app.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static io.github.flashlearn.app.friendship.entity.FriendshipStatus.*;

@Service
@RequiredArgsConstructor
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final SecurityUtils securityUtils;
    private final UserRepository userRepository;

    @Transactional
    public Friendship sendFriendshipRequest(String receiverUsername) {
        User requester = securityUtils.getCurrentUser();
        User receiver = userRepository.findByUsername(receiverUsername).
                orElseThrow(() -> new UserNotFoundException(receiverUsername));

        if (requester.getId().equals(receiver.getId())) {
            throw new Forbidden("Нельзя добавить самого себя в друзья");
        }

        Optional<Friendship> existing = friendshipRepository.findBetween(requester, receiver);
        // не оч понял как работает
        if (existing.isPresent()) {
            Friendship friendship = existing.get();
            switch (friendship.getStatus()) {
                case ACCEPTED -> throw new FriendshipAlreadyExistsException("Вы уже друзья");
                case PENDING -> {
                    // Если запрос пришел в обратную сторону — принимаем его автоматически
                    if (friendship.getReceiver().getId().equals(requester.getId())) {
                        friendship.setStatus(ACCEPTED);
                        return friendshipRepository.save(friendship);
                    }
                    throw new FriendshipAlreadyExistsException("Заявка уже отправлена");
                }
                case DECLINED -> {
                    friendship.setRequester(requester); // если запрос был отклонен, его можно отправить заново
                    friendship.setReceiver(receiver);
                    friendship.setStatus(PENDING);
                    friendship.setCreatedAt(LocalDateTime.now());
                    return friendshipRepository.save(friendship);
                }
                case BLOCKED -> throw new FriendshipAlreadyExistsException("Пользователь заблокирован");
                // TODO fetch blocked requests and unblock them
                /* блок - не состояние дружбы, а санкции к пользователю (запрет функционала).
                 * пока из затрагиваемых функций только отправка дружбы, но в будущем будет
                 * правильнее вынести список заблокированных в отдельную сущность (как UserStats)
                 */
            }
        }

        Friendship friendship = new Friendship();
        friendship.setRequester(requester);
        friendship.setReceiver(receiver);
        friendship.setStatus(PENDING);
        friendship.setCreatedAt(LocalDateTime.now());

        return friendshipRepository.save(friendship);
    }

    public Friendship acceptFriendshipRequest(Long requestId) {
        Friendship friendship = friendshipRepository.findById(requestId)
                .orElseThrow(() -> new FiendshipRequestNotFoundException("friendship request not found: " + requestId));

        if (friendship.getStatus() != PENDING) {
            throw new FriendshipAlreadyExistsException("Заявка уже обработана");
        }

        if (!friendship.getReceiver().getId().equals(SecurityUtils.getCurrentUserId())) {
            throw new Forbidden("Нельзя принять чужую заявку");
        }

        friendship.setStatus(ACCEPTED);
        return friendshipRepository.save(friendship);
    }

    public Friendship declineFriendshipRequest(Long requestId) {
        User currentUser = securityUtils.getCurrentUser();
        Friendship friendship = friendshipRepository.findById(requestId)
                .orElseThrow(() -> new FiendshipRequestNotFoundException("friendship request not found: " + requestId));

        if (!friendship.getReceiver().getId().equals(currentUser.getId())) {
            throw new Forbidden("Нельзя отклонить чужую заявку");
        }

        if (friendship.getStatus() != PENDING) {
            throw new FriendshipAlreadyExistsException("Заявка уже обработана");
        }

        friendship.setStatus(DECLINED);
        return friendshipRepository.save(friendship);
    }

    public List<FriendRequestNotificationDto> getIncomingRequests() {
        User current = securityUtils.getCurrentUserRef();
        return friendshipRepository.findIncomingForUser(current).stream()
                .map(f ->
                        new FriendRequestNotificationDto(
                                f.getId(),
                                f.getRequester().getUsername(),
                                f.getStatus().name()
                        ) // TODO use mapper
                )
                .toList();
    }

    public List<UserSearchResponseDto> searchUsers(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }
        return userRepository.findTop5ByUsernameContainingIgnoreCaseAndIdNot(query, SecurityUtils.getCurrentUserId())
                .stream()
                .map(u -> new UserSearchResponseDto(u.getId(), u.getUsername()))
                .toList();
    }

    @Deprecated
    public Set<String> getFriends() {
        User current = securityUtils.getCurrentUser();
        return friendshipRepository.findAcceptedForUser(current).stream()
                .flatMap(f -> {
                    if (f.getRequester().getId().equals(current.getId())) {
                        return Stream.of(f.getReceiver().getUsername());
                    } else {
                        return Stream.of(f.getRequester().getUsername());
                    }
                })
                .collect(Collectors.toSet()); // distinct + list = set
        /* не оч понятно, что делать просто с именами.
         * только, если опять дергать бэк для каждого имени,
         * но тогда лучше сразу вернуть всю нужную инфу,
         * например профили или другие DTO
         */
    }

    public List<UserProfileResponse> getFriendsProfiles() {
        User current = securityUtils.getCurrentUserRef();
        // TODO use mapper
        Set<UserProfileResponse> incomingAccepted = friendshipRepository.findAcceptedFriendsReceivedBy(current)
                .stream().map(u -> new UserProfileResponse(
                        u.getId(),
                        u.getUsername(),
                        u.getAvatarKey(),
                        u.getAboutMe()
                )).collect(Collectors.toSet());

        Set<UserProfileResponse> outcomingAccepted = friendshipRepository.findAcceptedFriendsSentBy(current)
                .stream().map(u -> new UserProfileResponse(
                        u.getId(),
                        u.getUsername(),
                        u.getAvatarKey(),
                        u.getAboutMe()
                )).collect(Collectors.toSet());

        List<UserProfileResponse> res = new ArrayList<>(incomingAccepted);
        res.addAll(outcomingAccepted);

        return res;
    }
}
