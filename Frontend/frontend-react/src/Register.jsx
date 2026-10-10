function Register({ onLogin }) {
  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-logo">
          ♻️ WasteAI
        </div>

        <h1>Create Account</h1>

        <p className="login-subtitle">
          Create your WasteAI account
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Account created successfully!");
            onLogin();
          }}
        >
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            required
          />

          <button type="submit">
            Create Account
          </button>
        </form>

        <p className="register-text">
          Already have an account?{" "}
          <a onClick={onLogin}>
            Login
          </a>
        </p>

      </div>
    </div>
  );
}

export default Register;