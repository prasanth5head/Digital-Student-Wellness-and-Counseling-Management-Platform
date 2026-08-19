package com.wellness.repository;

import com.wellness.model.Appointment;
import com.wellness.model.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByStudentIdOrderByAppointmentDateDescStartTimeDesc(String studentId);
    List<Appointment> findByCounselorIdOrderByAppointmentDateDescStartTimeDesc(String counselorId);
    List<Appointment> findByCounselorIdAndAppointmentDate(String counselorId, LocalDate date);
    
    // Prevent double booking
    List<Appointment> findByCounselorIdAndAppointmentDateAndStartTimeAndStatusNot(
            String counselorId, LocalDate date, String startTime, AppointmentStatus notStatus);

    List<Appointment> findByStudentIdAndAppointmentDateAndStartTimeAndStatusNot(
            String studentId, LocalDate date, String startTime, AppointmentStatus notStatus);

    List<Appointment> findByAppointmentDateAndStatus(LocalDate date, AppointmentStatus status);
    List<Appointment> findByStatus(AppointmentStatus status);
    long countByStatus(AppointmentStatus status);
    Page<Appointment> findAllByOrderByAppointmentDateDescStartTimeDesc(Pageable pageable);
}
