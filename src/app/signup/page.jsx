'use client'
import { useEffect, useState } from "react";
import styles from "@/app/AuthForm.module.css"
import Link from "next/link";



export default function SignUp({setCurrentUser}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState("");


  useEffect(() => {
    async function fetchAvatars() {
      try {
        const res = await fetch("/api/avatars");
        const data = await res.json();
        
        setAvatars(data.avatars);
      } catch (err) {
        console.error("Failed to load avatars", err);
      }
    }
    fetchAvatars();
  }, []);
  

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, avatarPublicId: selectedAvatar || null }),
    });

    const data = await res.json()

    if (res.ok && data.user) {

      // setCurrentUser(data.user);
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

        <div>
          <p>Choose an avatar (optional):</p>
          <div className={styles.avatarsContainer}>
            {avatars.map((id) => (
              <img
                key={id}
                src={`https://res.cloudinary.com/dmfxx37gi/image/upload/w_50,h_50,c_fill/${id}.png`}
                alt="avatar"
                style={{
                  border: selectedAvatar === id ? "2px solid green" : "2px solid black",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedAvatar(id)}
              />
            ))}
          </div>
        </div>

        {error && <p>{error}</p>}
        {success && <p>{success}</p>}

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
