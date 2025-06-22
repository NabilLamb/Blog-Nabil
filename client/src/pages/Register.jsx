import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaCamera } from "react-icons/fa";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid:
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar,
      requirements: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumber,
        hasSpecialChar,
      },
    };
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setProfileImage(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!profileImage) return null;
    
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", profileImage);

      const response = await fetch("http://localhost:8800/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Image upload failed", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Check if passwords match
    if (inputs.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(inputs.password);
    if (!passwordValidation.isValid) {
      setError("Password does not meet requirements");
      return;
    }

    try {
      // Upload profile image if exists
      const profileImg = await uploadImage();
      
      const response = await fetch("http://localhost:8800/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...inputs,
          profileImg: profileImg || null
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      navigate("/login");
    } catch (err) {
      setError("Server connection error");
    }
  };

  return (
    <div className="auth">
      <div className="container">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="profile-image-upload">
            <div 
              className="image-preview"
              onClick={() => fileInputRef.current.click()}
            >
              {previewImage ? (
                <img src={previewImage} alt="Profile preview" />
              ) : (
                <div className="image-placeholder">
                  <FaUserCircle className="icon" />
                  <div className="upload-overlay">
                    <FaCamera />
                  </div>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <p className="hint">Click to upload profile photo (optional)</p>
          </div>
          
          <input
            onChange={handleChange}
            required
            type="text"
            placeholder="Username"
            name="username"
          />
          <input
            onChange={handleChange}
            required
            type="email"
            placeholder="Email"
            name="email"
          />
          <input
            onChange={handleChange}
            required
            type="password"
            name="password"
            placeholder="Password"
          />
          <input
            onChange={handleConfirmPasswordChange}
            required
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
          />

          <div className="password-requirements">
            <p>Password must contain:</p>
            <ul>
              <li>At least 8 characters</li>
              <li>Uppercase letter (A-Z)</li>
              <li>Lowercase letter (a-z)</li>
              <li>Number (0-9)</li>
              <li>Special character (!@#$...)</li>
            </ul>
          </div>

          <button type="submit" disabled={isUploading}>
            {isUploading ? "Creating Account..." : "Register"}
          </button>
          {error && <p className="error">{error}</p>}
          <span className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;