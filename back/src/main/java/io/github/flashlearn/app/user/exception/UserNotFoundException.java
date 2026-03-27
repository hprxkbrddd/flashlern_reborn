package io.github.flashlearn.app.user.exception;

import lombok.Getter;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Getter
public class UserNotFoundException extends UsernameNotFoundException {

    private final Object key;

    public UserNotFoundException(String username) {
        super("User with username '" + username + "' not found");
        this.key = username;
    }

    public UserNotFoundException(Long id){
        super("User with id '" + id + "' not found");
        this.key = id;
    }
}
