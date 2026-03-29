package io.github.flashlearn.app.friendship.controller;

import io.github.flashlearn.app.friendship.dto.*;
import io.github.flashlearn.app.friendship.mapper.FriendshipMapper;
import io.github.flashlearn.app.friendship.service.FriendshipService;
import io.github.flashlearn.app.common.dto.ApiError;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Friendship", description = "Friendship requests and social graph endpoints")
@SecurityRequirement(name = "bearerAuth")
public class FriendshipController {

    private final FriendshipService friendshipService;
    private final FriendshipMapper mapper;

    @PostMapping("/send")
    @Operation(summary = "Send friendship request", description = "Sends a friendship request to another user.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Friendship request processed",
                    content = @Content(schema = @Schema(implementation = FriendRequestResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation error or malformed request",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden action",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Receiver user not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Friendship request already exists or friendship already accepted",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<FriendRequestResponseDto> sendRequest(
            @RequestBody @Valid SendFriendRequestDto request) {
        FriendRequestResponseDto response =
                mapper.toFriendRequestResponseDto(
                        friendshipService.sendFriendshipRequest(request.receiver()));
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/accept")
    @Operation(summary = "Accept friendship request", description = "Accepts incoming friendship request by id.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "202",
                    description = "Friendship request accepted",
                    content = @Content(schema = @Schema(implementation = FriendRequestResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation error or malformed request",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden action",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Friendship request not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Friendship request already processed",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<FriendRequestResponseDto> acceptRequest(
            @RequestBody @Valid AcceptFriendRequestDto request) {
        FriendRequestResponseDto response =
                mapper.toFriendRequestResponseDto(
                        friendshipService.acceptFriendshipRequest(request.id()));
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    @PutMapping("/decline")
    @Operation(summary = "Decline friendship request", description = "Declines incoming friendship request by id.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Friendship request declined",
                    content = @Content(schema = @Schema(implementation = FriendRequestResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation error or malformed request",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden action",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Friendship request not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Friendship request already processed",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<FriendRequestResponseDto> declineRequest(
            @RequestBody @Valid AcceptFriendRequestDto request) {
        FriendRequestResponseDto response =
                mapper.toFriendRequestResponseDto(
                        friendshipService.declineFriendshipRequest(request.id()));
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/requests")
    @Operation(summary = "Get incoming friendship requests", description = "Returns pending incoming friendship requests for authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Incoming requests retrieved",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = FriendRequestNotificationDto.class)))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<List<FriendRequestNotificationDto>> incomingRequests() {
        return ResponseEntity.ok(friendshipService.getIncomingRequests());
    }

    @GetMapping("/friends")
    @Operation(summary = "Get friends usernames", description = "Returns usernames of all accepted friends.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Friends retrieved",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = String.class)))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<Set<String>> friends() {
        return ResponseEntity.ok(friendshipService.getFriends());
    }

    @GetMapping("/search")
    @Operation(summary = "Search users", description = "Searches users by username substring.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Search results returned",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = UserSearchResponseDto.class)))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Missing or malformed query parameter",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<List<UserSearchResponseDto>> searchUsers(@RequestParam("query") String query) {
        return ResponseEntity.ok(friendshipService.searchUsers(query));
    }
}
