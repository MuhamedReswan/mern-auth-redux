import bcrypt from "bcryptjs";

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("Hashed password:", hashedPassword);
  return hashedPassword;
};

const matchPassword = async(password,dbPassword)=>{
  console.log("matchPassword invoked");
  return out = await bcrypt.compare(password, dbPassword);
}



export {
 hashPassword,
 matchPassword
};
