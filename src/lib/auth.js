import jwt from "jsonwebtoken";

export function getCurrentUser(req) {
  try {
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    return decoded;

  } catch (error) {
    console.error("JWT error:", error);
    return null;
  }
}