import bcrypt from "bcrypt";
const hashed = await bcrypt.hash(password, 10);
console.log(hashed);
