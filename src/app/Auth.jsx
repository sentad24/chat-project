// 'use client';
// import { useState } from "react";
// import styles from "@/app/AuthForm.module.css";

// export default function AuthPage() {
//   const [isSignIn, setIsSignIn] = useState(true);
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     const endpoint = isSignIn ? "/api/auth/login" : "/api/auth/signup";
//     const body = isSignIn
//       ? { identifier: email, password }
//       : { username, email, password };

//     try {
//       const res = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         if (isSignIn) {
//           window.location.href = "/dashboard";
//         } else {
//           setSuccess("Account created! You can now sign in.");
//           setTimeout(() => setIsSignIn(true), 1500);
//         }
//       } else {
//         setError(data.error || "Something went wrong");
//       }
//     } catch {
//       setError("Network error. Try again.");
//     }
//   }

//   return (
//     <div className={styles.container}>
//       <form onSubmit={handleSubmit} className={styles.formWrapper}>
//         <h2>{isSignIn ? "Sign In" : "Sign Up"}</h2>

//         {!isSignIn && (
//           <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//             className={styles.input}
//           />
//         )}

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className={styles.input}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           className={styles.input}
//         />

//         {error && <p className={styles.error}>{error}</p>}
//         {success && <p className={styles.success}>{success}</p>}

//         <button type="submit" className={styles.button}>
//           {isSignIn ? "Sign In" : "Sign Up"}
//         </button>

//         <p className={styles.toggleText}>
//           {isSignIn ? "Don't have an account?" : "Already have an account?"}
//           <button
//             type="button"
//             className={styles.toggleButton}
//             onClick={() => setIsSignIn(!isSignIn)}
//           >
//             {isSignIn ? "Sign Up" : "Sign In"}
//           </button>
//         </p>
//       </form>
//     </div>
//   );
// }
