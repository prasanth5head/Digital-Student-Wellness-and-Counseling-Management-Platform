package com.wellness.repository;

import com.wellness.model.CounselorNote;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CounselorNoteRepository extends MongoRepository<CounselorNote, String> {
    List<CounselorNote> findByStudentIdOrderByCreatedAtDesc(String studentId);
    List<CounselorNote> findByCounselorIdOrderByCreatedAtDesc(String counselorId);
    List<CounselorNote> findByStudentIdAndCounselorIdOrderByCreatedAtDesc(String studentId, String counselorId);
}
