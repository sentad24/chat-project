'use client'
import { useState } from "react";
import styles from "@/app/AuthForm.module.css"
import Link from "next/link";


export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json()

    if (res.ok) {
      setSuccess("Account created! Redirecting to sign in...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } else {
      setError(data.error || "Signup failed");
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form} >
        <h2>Sign Up</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit" className={styles.button} >
          Sign Up
        </button>
        <p className={styles.toggleText}>
          Already have an account?{" "}
          <Link href="/" className={styles.toggleButton}>Sign In</Link>
        </p>
      </form>
    </div>
  );
}
