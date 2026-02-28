import { Router } from "express";
import { noteController } from "../controllers/note.controller";
import { validate } from "../middlewares/validate.middlware";
import {
    createNoteSchema,
    updateNoteSchema,
    noteIdParamSchema,
    notesQuerySchema,
} from "../validators/notes.validator";

const router: Router = Router();

// NOTE ROUTES
// Base path: /api/v1/notes

/**
 * GET /api/notes/tags
 * Must come before "/:id"
 */
router.route("/tags").get(noteController.getAllTags);

/**
 * GET  /api/v1/notes
 * POST /api/v1/notes
 */
router
    .route("/")
    .get(validate(notesQuerySchema, "query"), noteController.getAllNotes)
    .post(validate(createNoteSchema, "body"), noteController.createNote);

/**
 * GET    /api/v1/notes/:id
 * PATCH  /api/v1/notes/:id
 * DELETE /api/v1/notes/:id
 */
router
    .route("/:id")
    .get(validate(noteIdParamSchema, "params"), noteController.getNoteById)
    .patch(
        validate(noteIdParamSchema, "params"),
        validate(updateNoteSchema, "body"),
        noteController.updateNote,
    )
    .delete(validate(noteIdParamSchema, "params"), noteController.deleteNote);

/**
 * PATCH /api/v1/notes/:id/pin
 */
router
    .route("/:id/pin")
    .patch(validate(noteIdParamSchema, "params"), noteController.togglePinNote);

export default router;