package com.example.demo.Controller;

import com.example.demo.Models.NoteState;
import com.example.demo.Models.Notes;
import com.example.demo.Service.NotesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/")
@CrossOrigin(origins = "http://localhost:5173")
public class NotesController {

    @Autowired
    private NotesService notesService;

    // Método para guardar todas las notas
    @PostMapping("/register/")
    public ResponseEntity<Notes> registerNotes(@RequestBody Notes notes) {
        if (notes.getCreateAt() == null) {
            notes.setCreateAt(LocalDateTime.now());  // Establecer la fecha de creación
        }
        if (notes.getState() == null) {
            notes.setState(NoteState.PENDING);  // Si no se especifica, establecer el estado como PENDING por defecto
        }
        Notes savedNotes = notesService.saveNote(notes);
        return ResponseEntity.ok(savedNotes);
    }

    // Método para obtener 1 nota con ID
    @GetMapping("/notes/{id}")
    public ResponseEntity<Notes> getNoteById(@PathVariable Long id) {
        Optional<Notes> noteOptional = notesService.getNoteById(id);
        return noteOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(404).body(null));
    }

    // Método para obtener todas las notas
    @GetMapping("/notes/")
    public ResponseEntity<List<Notes>> getNotes() {
        try {
            List<Notes> notes = notesService.getAllNotes();
            return ResponseEntity.ok(notes);
        } catch (Exception e) {
            e.printStackTrace(); // Muestra el error completo en los logs
            return ResponseEntity.status(500).body(null); // Devuelve una respuesta 500
        }
    }

    // Método para eliminar una nota por ID
    @DeleteMapping("/notes/{id}")
    public ResponseEntity<String> deleteNotes(@PathVariable Long id) {
        boolean deleted = notesService.deleteNote(id);
        if (deleted) {
            return ResponseEntity.ok("Nota eliminada exitosamente");
        } else {
            return ResponseEntity.status(404).body("Nota no encontrada");
        }
    }

    // Método para actualizar una nota
    @PutMapping("/notes/{id}")
    public ResponseEntity<Notes> updateNote(@PathVariable Long id, @RequestBody Notes updatedNote) {
        Optional<Notes> existingNote = notesService.updateNote(id, updatedNote);
        if (existingNote.isPresent()) {
            return ResponseEntity.ok(existingNote.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
