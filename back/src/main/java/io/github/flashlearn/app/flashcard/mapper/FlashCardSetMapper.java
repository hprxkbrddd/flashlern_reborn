package io.github.flashlearn.app.flashcard.mapper;

import io.github.flashlearn.app.flashcard.dto.EditFlashCardSetRequest;
import io.github.flashlearn.app.flashcard.dto.FlashCardSetResponse;
import io.github.flashlearn.app.flashcard.dto.SaveFlashCardSetResponse;
import io.github.flashlearn.app.flashcard.entity.FlashCardSet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "Spring")
public interface FlashCardSetMapper {
    @Mapping(target = "isSaved", source = "saved")
    FlashCardSetResponse toFlashCardSetResponse(FlashCardSet flashCardSet);
    FlashCardSet toFlashCardSet(EditFlashCardSetRequest flashCardSetResponse);
    @Mapping(target = "isSaved", source = "saved")
    SaveFlashCardSetResponse toSaveFlashCardSetResponse(FlashCardSet flashCardSet);
}
