package io.github.flashlearn.app.flashcard.service;

import io.github.flashlearn.app.auth.security.SecurityUtils;
import io.github.flashlearn.app.flashcard.dto.CreateFlashCardSetRequest;
import io.github.flashlearn.app.flashcard.dto.SaveFlashCardSetRequest;
import io.github.flashlearn.app.flashcard.entity.FlashCard;
import io.github.flashlearn.app.flashcard.entity.FlashCardSet;
import io.github.flashlearn.app.flashcard.exception.FlashCardSetNotFoundException;
import io.github.flashlearn.app.flashcard.repository.FlashCardSetRepository;
import io.github.flashlearn.app.user.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlashCardService {

    private final FlashCardSetRepository flashCardSetRepository;
    private final SecurityUtils securityUtils;

    /**
     * Создает новую флешкарту для текущего аутентифицированного пользователя
     *
     * @param request данные для создания карточки
     * @return созданная флешкарта
     */
    @Transactional
    public FlashCardSet createFlashCardSet(CreateFlashCardSetRequest request) {
        // Получаем текущего аутентифицированного пользователя
        User currentUser = securityUtils.getCurrentUserRef();
        FlashCardSet flashCardSet = new FlashCardSet();

        flashCardSet.setTitle(request.title());
        flashCardSet.setDescription(request.description());
        flashCardSet.setVisibility(request.visibility());
        flashCardSet.setTags(request.tags());
        flashCardSet.setOwner(currentUser);
        flashCardSet.setSaved(false);
        flashCardSet.setCreatedAt(LocalDateTime.now());
        flashCardSet.setUpdatedAt(LocalDateTime.now());

        List<FlashCard> cards = request.flashCards().stream()
                .map(dto -> {
                    FlashCard card = new FlashCard();
                    card.setQuestion(dto.question());
                    card.setAnswer(dto.answer());
                    card.setSet(flashCardSet);
                    return card;
                })
                .toList();

        flashCardSet.setFlashCards(cards);

        return flashCardSetRepository.save(flashCardSet);
    }

    /**
     * Получает все флешкарты пользователя. Пользователь может получить только свои карточки.
     *
     * @return список флешкарт авторизованного в данный момент пользователя
     */
    public List<FlashCardSet> getAllFlashCardSets() {
        // Проверяем, что пользователь запрашивает свои собственные карточки
        return flashCardSetRepository.findAllByOwner_Id(SecurityUtils.getCurrentUserId());
    }

    public List<FlashCardSet> getAllFlashCardSets(Long userId) {
        return flashCardSetRepository.findAllByOwner_Id(userId);
    }

    @Transactional
    public void deleteFlashCardSet(Long id) {
        flashCardSetRepository.deleteById(id);
    }

    @Transactional
    public FlashCardSet editFlashCardSet(FlashCardSet newFlashCardSet, Long id) {
        FlashCardSet flashCardSet = flashCardSetRepository.findById(id)
                .orElseThrow(() -> new FlashCardSetNotFoundException("Flashcard set not found"));
        boolean updated = false;
        if (newFlashCardSet.getTitle() != null && !newFlashCardSet.getTitle().isBlank()) {
            flashCardSet.setTitle(newFlashCardSet.getTitle());
            updated = true;
        }
        if (newFlashCardSet.getDescription() != null && !newFlashCardSet.getDescription().isBlank()) {
            flashCardSet.setDescription(newFlashCardSet.getDescription());
            updated = true;
        }
        if (newFlashCardSet.getVisibility() != null) {
            flashCardSet.setVisibility(newFlashCardSet.getVisibility());
            updated = true;
        }
        if (newFlashCardSet.getTags() != null && !newFlashCardSet.getTags().isEmpty()) {
            flashCardSet.setTags(newFlashCardSet.getTags());
            updated = true;
        }

        if (newFlashCardSet.getFlashCards() != null && !newFlashCardSet.getFlashCards().isEmpty()) {
            flashCardSet.getFlashCards().clear();

            for (FlashCard incomingCard : newFlashCardSet.getFlashCards()) {
                FlashCard flashCard = new FlashCard();
                flashCard.setQuestion(incomingCard.getQuestion());
                flashCard.setAnswer(incomingCard.getAnswer());
                flashCard.setSet(flashCardSet);

                flashCardSet.getFlashCards().add(flashCard);
            }
        }

        if (updated)
            flashCardSet.setUpdatedAt(LocalDateTime.now());

        return flashCardSetRepository.save(flashCardSet);
    }

    public FlashCardSet getFlashCardSet(Long id) {
        return flashCardSetRepository.findById(id)
                .orElseThrow(() -> new FlashCardSetNotFoundException("Flash card set not found"));
    }

    @Transactional
    public FlashCardSet saveFlashCardSet(Long id, SaveFlashCardSetRequest request) {
        FlashCardSet flashCardSet = flashCardSetRepository.findById(id)
                .orElseThrow(() -> new FlashCardSetNotFoundException("Set not found: " + id));

        flashCardSet.setSaved(request.isSaved());
        return flashCardSetRepository.save(flashCardSet);
    }
}
