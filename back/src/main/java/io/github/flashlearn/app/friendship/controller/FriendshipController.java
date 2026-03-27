package io.github.flashlearn.app.friendship.controller;

import io.github.flashlearn.app.friendship.dto.*;
import io.github.flashlearn.app.friendship.mapper.FriendshipMapper;
import io.github.flashlearn.app.friendship.service.FriendshipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/friendship")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipService friendshipService;
    private final FriendshipMapper mapper;

    @PostMapping("/send")
    public ResponseEntity<FriendRequestResponseDto> sendRequest(
            @RequestBody @Valid SendFriendRequestDto request) {
        FriendRequestResponseDto response =
                mapper.toFriendRequestResponseDto(
                        friendshipService.sendFriendshipRequest(request.receiver()));
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/accept")
    public ResponseEntity<FriendRequestResponseDto> acceptRequest(
            @RequestBody @Valid AcceptFriendRequestDto request) {
        FriendRequestResponseDto response =
                mapper.toFriendRequestResponseDto(
                        friendshipService.acceptFriendshipRequest(request.id()));
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    @PutMapping("/decline")
    public ResponseEntity<FriendRequestResponseDto> declineRequest(
            @RequestBody @Valid AcceptFriendRequestDto request) {
        FriendRequestResponseDto response =
                mapper.toFriendRequestResponseDto(
                        friendshipService.declineFriendshipRequest(request.id()));
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/requests")
    public ResponseEntity<List<FriendRequestNotificationDto>> incomingRequests() {
        return ResponseEntity.ok(friendshipService.getIncomingRequests());
    }

    @GetMapping("/friends")
    public ResponseEntity<Set<String>> friends() {
        return ResponseEntity.ok(friendshipService.getFriends());
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserSearchResponseDto>> searchUsers(@RequestParam("query") String query) {
        return ResponseEntity.ok(friendshipService.searchUsers(query));
    }
}
