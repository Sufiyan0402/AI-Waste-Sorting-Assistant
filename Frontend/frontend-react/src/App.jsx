
import { useState } from "react";
import "./App.css";
import Register from "./Register";

function App() {
  const [page, setPage] = useState("login");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const analyzeWaste = async () => {
    if (!image) {
      alert("Please upload a waste image first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(
        "https://waste-sorting-backend-z8se.onrender.com/api/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Server error");
      }

      setResult(data);
      setHistory((prev) => [data, ...prev]);
    } catch (error) {
      console.error("ERROR:", error);
      alert(error.message || "Backend connection failed.");
    }
  };

  if (page === "history") {
    return (
      <>
        <header>
          <div className="logo">♻️ WasteAI</div>
          <nav>
            <a onClick={() => setPage("dashboard")}>Home</a>
            <a onClick={() => setPage("history")}>History</a>
            <a onClick={() => setPage("login")}>Logout</a>
          </nav>
        </header>

        <section className="hero">
          <h1>Prediction History</h1>
          <p>View your previous waste analysis results.</p>
        </section>

        <main className="container">
          <div className="upload-card">
            <h2>Recent Predictions</h2>

            {history.length === 0 ? (
              <p>No predictions yet.</p>
            ) : (
              history.map((item, index) => (
                <div className="history-item" key={index}>
                  <h3>♻️ {item.category}</h3>
                  <p>Confidence: {item.confidence}%</p>
                  <p>Disposal: {item.suggestion}</p>
                </div>
              ))
            )}
          </div>
        </main>

        <footer>
          <p>© 2026 AI Waste Sorting Assistant</p>
        </footer>
      </>
    );
  }

  if (page === "register") {
    return <Register onLogin={() => setPage("login")} />;
  }

  if (page === "dashboard") {
    return (
      <>
        <header>
          <div className="logo">♻️ WasteAI</div>
          <nav>
            <a onClick={() => setPage("dashboard")}>Home</a>
            <a onClick={() => setPage("history")}>History</a>
            <a
              onClick={() => {
                setPage("login");
                setImage(null);
                setPreview(null);
                setResult(null);
              }}
            >
              Logout
            </a>
          </nav>
        </header>

        <section className="hero">
          <h1>AI Waste Sorting Assistant</h1>
          <p>
            Upload an image of waste and let AI identify its category.
          </p>
        </section>

        <main className="container">
          <div className="upload-card">
            <h2>Analyze Your Waste</h2>

            <div className="upload-box">
              <p>📷 Upload a waste image</p>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setImage(file);
                    setPreview(URL.createObjectURL(file));
                    setResult(null);
                  }
                }}
              />

              {preview && (
                <img
                  id="preview"
                  src={preview}
                  alt="Waste Preview"
                />
              )}
            </div>

            <button onClick={analyzeWaste} disabled={!image}>
              Analyze Waste
            </button>

            {result && (
              <div className="result">
                <h3>AI Analysis Result</h3>
                <p>Category: {result.category}</p>
                <p>Confidence: {result.confidence}%</p>
                <p>Disposal Suggestion: {result.suggestion}</p>
              </div>
            )}
          </div>
        </main>

        <footer>
          <p>© 2026 AI Waste Sorting Assistant</p>
        </footer>
      </>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">♻️ WasteAI</div>

        <h1>Welcome Back</h1>
        <p className="login-subtitle">
          Login to your WasteAI account
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage("dashboard");
          }}
        >
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="register-text">
          Don't have an account?{" "}
          <a onClick={() => setPage("register")}>
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
