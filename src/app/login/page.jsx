'use client';
import { useState } from "react";
import styles from "@/app/AuthForm.module.css"
import Link from "next/link";

export default function SignIn() {
  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password: password.trim() }),
      });

      const data = await res.json()

      if (res.ok) {
        // Redirect to dashboard after successful login
        window.location.href = "/dashboard";
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className={styles.container} >
      <form onSubmit={handleSubmit} className={styles.form} >
        <h2>Login</h2>

        <input
          type="text"
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />

        {error && <p className={styles.error}>{error}</p>}  

        <button type="submit"className={styles.button} >
          Login
        </button>
        <p className={styles.toggleText}>
          Already have an account?{" "}
          <Link href="/signup" className={styles.toggleButton}>Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
