import express from "express";
import {
  getPosts,
  getPost,
  /*  createPost,
  deletePost,
  updatePost, */
} from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
/*router.post("/", createPost);
router.delete("/:id", deletePost);
router.put("/:id", updatePost); */

export default router;
