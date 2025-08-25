"use server";

import { hashUserPassword } from "@/lib/hash";
import { createUser } from "@/lib/users";
import { redirect } from "next/navigation";

export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const errors = {};

  // validations
  if (!email.includes("@")) {
    errors.email = "invalid email, you should use @ in your email";
  }
  if (password.trim().length < 8) {
    errors.password = "password can't less than 8 characters";
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // store it data in database and create new user
  const hashedPassword = hashUserPassword(password);
  try {
    await createUser(email, hashedPassword);
    console.log("ok");
  } catch (error) {
    console.log("hello world");
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email: "that password used before you, select another email please.",
        },
      };
    }
    throw error;
  }

  redirect("/training");
}
