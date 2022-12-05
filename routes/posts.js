import express from "express";
import {
  getPosts,
  getPost,
  deletePost,
  /*  createPost,
  updatePost, */
} from "../controllers/post.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.delete("/:id", checkToken, deletePost);
/*router.post("/", createPost);
router.put("/:id", updatePost); */

export default router;
