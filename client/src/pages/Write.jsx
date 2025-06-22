// src/pages/Write.jsx
import moment from "moment";
import { useState, useRef, useEffect } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaLink,
  FaListOl,
  FaListUl,
  FaPaperPlane,
  FaImage,
  FaExclamationCircle,
} from "react-icons/fa";
import { MdOutlineUpdate } from "react-icons/md";

import { useLocation, useNavigate } from "react-router-dom";

const Write = () => {
  const state = useLocation().state;
  const [title, setTitle] = useState(state?.title || "");
  const [category, setCategory] = useState(state?.category || "");
  const [file, setFile] = useState(state?.img || null);
  const [content, setContent] = useState(state?.description || "");
  const [isPublishing, setIsPublishing] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    category: "",
    content: "",
  });
  const editorRef = useRef(null);
  const navigate = useNavigate();

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && state?.description) {
      editorRef.current.innerHTML = state.description;
    }
  }, [state]);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const validateForm = () => {
    const newErrors = {
      title: !title.trim() ? "Title is required" : "",
      category: !category ? "Category is required" : "",
      content: !content.replace(/<[^>]*>/g, "").trim()
        ? "Content is required"
        : "",
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const handlePublish = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsPublishing(true);

    try {
      let imgUrl = file;

      // If file is a file object, upload it and get the URL
      if (file && typeof file !== "string") {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:8800/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        imgUrl = data.url;
      }

      const postData = {
        title,
        description: content,
        img: imgUrl || "",
        category,
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
      };

      const requestOptions = {
        method: state ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(postData),
      };

      const endpoint = state
        ? `http://localhost:8800/api/posts/${state.id}`
        : "http://localhost:8800/api/posts";

      const response = await fetch(endpoint, requestOptions);
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Something went wrong");

      alert(state ? "Post updated successfully!" : "Post added successfully!");

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to publish post");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="write">
      <div className="container">
        <div className="content">
          <div className="editor-header">
            <div className="title-input-container">
              <input
                type="text"
                placeholder="Enter post title..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors((prev) => ({ ...prev, title: "" }));
                }}
                className={`title-input ${errors.title ? "error" : ""}`}
              />
              {errors.title && (
                <div className="error-message">
                  <FaExclamationCircle /> {errors.title}
                </div>
              )}
            </div>

            <div className="formatting-toolbar">
              <button onClick={() => formatText("bold")} title="Bold">
                <FaBold />
              </button>
              <button onClick={() => formatText("italic")} title="Italic">
                <FaItalic />
              </button>
              <button onClick={() => formatText("underline")} title="Underline">
                <FaUnderline />
              </button>
              <button
                onClick={() => formatText("insertUnorderedList")}
                title="Bullet List"
              >
                <FaListUl />
              </button>
              <button
                onClick={() => formatText("insertOrderedList")}
                title="Numbered List"
              >
                <FaListOl />
              </button>
              <button
                onClick={() => {
                  const url = prompt("Enter URL:");
                  if (url) formatText("createLink", url);
                }}
                title="Insert Link"
              >
                <FaLink />
              </button>
            </div>
          </div>

          <div className="editor-container">
            <div
              ref={editorRef}
              className={`editor-content ${errors.content ? "error" : ""}`}
              contentEditable="true"
              onInput={(e) => {
                setContent(e.target.innerHTML);
                setErrors((prev) => ({ ...prev, content: "" }));
              }}
              data-placeholder="Start writing your post here..."
              style={{ direction: "ltr", textAlign: "left" }}
            />
            {errors.content && (
              <div className="error-message">
                <FaExclamationCircle /> {errors.content}
              </div>
            )}
          </div>

          <div className="editor-footer">
            <button
              className="publish-btn"
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? (
                "Publishing..."
              ) : state ? (
                <>
                  <MdOutlineUpdate /> Update Post
                </>
              ) : (
                <>
                  <FaPaperPlane /> Publish Post
                </>
              )}
            </button>
            <div className="word-count">
              {content.replace(/<[^>]*>/g, "").length} characters
            </div>
          </div>
        </div>

        <div className="menu">
          <div className="item">
            <h3>
              Featured Image <span className="optional">(Optional)</span>
            </h3>
            <div className="image-upload-container">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              {file ? (
                <div className="image-preview">
                  <img
                    src={
                      typeof file === "string"
                        ? file
                        : URL.createObjectURL(file)
                    }
                    alt="Preview"
                  />
                  <div className="image-actions">
                    <button
                      className="change-btn"
                      onClick={() =>
                        document.getElementById("image-upload").click()
                      }
                    >
                      Change Image
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => setFile(null)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label htmlFor="image-upload" className="upload-area">
                  <FaImage className="upload-icon" />
                  <p>Click to upload featured image</p>
                  <p className="hint">Recommended size: 1200x630px</p>
                </label>
              )}
            </div>
          </div>

          <div className="item">
            <h3>Category</h3>
            <div
              className={`select-container ${errors.category ? "error" : ""}`}
            >
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setErrors((prev) => ({ ...prev, category: "" }));
                }}
              >
                <option value="">Select a category</option>
                <option value="art">Art</option>
                <option value="science">Science</option>
                <option value="technology">Technology</option>
                <option value="cinema">Cinema</option>
                <option value="design">Design</option>
                <option value="food">Food</option>
              </select>
              {errors.category && (
                <div className="error-message">
                  <FaExclamationCircle /> {errors.category}
                </div>
              )}
            </div>
          </div>

          <div className="item preview">
            <h3>Preview</h3>
            <div className="preview-content">
              <h4>{title || "Your post title"}</h4>
              <div
                dangerouslySetInnerHTML={{
                  __html: content || "<p>Your content will appear here</p>",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;
