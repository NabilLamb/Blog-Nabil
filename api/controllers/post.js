import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
    const { category } = req.query;
    const query = category ? "SELECT * FROM posts WHERE category = ?" : "SELECT * FROM posts";
    db.query(query, [category], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    })
}

export const getPost = (req, res) => {
    const postId = req.params.id;
    const query = `SELECT u.username, u.userImg,
  p.title, p.description, p.img, p.category, p.date, p.id 
  FROM users u JOIN posts p ON u.id = p.userId 
  WHERE p.id = ?`;

    db.query(query, [postId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("Post not found");
        return res.status(200).json(data[0]);
    });
}


export const deletePost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated");

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("JWT verification failed:", err);
            return res.status(403).json("Token is not valid");
        }

        const postId = req.params.id;
        const userId = user.id;

        const query = "DELETE FROM posts WHERE id = ? AND userId = ?";

        db.query(query, [postId, userId], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json("Internal server error");
            }

            if (result.affectedRows === 0) {
                return res.status(403).json("You can delete only your posts");
            }

            return res.status(200).json("Post deleted successfully");
        });
    });
};

export const addPost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated");

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("JWT verification failed:", err);
            return res.status(403).json("Token is not valid");
        }


        const { title, description, img, category, date } = req.body;

        const q = "INSERT INTO posts (`title`, `description`, `img`, `category`, `date`, `userId`) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(q, [title, description, img, category, date, user.id], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(201).json({ message: "Post added successfully", postId: data.insertId });
        });

    });

};

export const updatePost = (req, res) => {

    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated");

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("JWT verification failed:", err);
            return res.status(403).json("Token is not valid");
        }


        const { title, description, img, category } = req.body;
        const postId = req.params.id;

        const q = "UPDATE posts SET `title`=?, `description`=?, `img`=?, `category`=? WHERE id = ? AND userId = ?";

        db.query(q, [title, description, img, category, postId, user.id], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post updated successfully");
        });
    });

};
