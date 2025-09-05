"use server";

import createAuthSession from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/users";
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
    const id = await createUser(email, hashedPassword);
    console.log("ok");

    await createAuthSession(id);
    redirect("/training");
  } catch (error) {
    console.log("hello world");
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email: "that email used before you, select another email please.",
        },
      };
    }
    throw error;
  }
}

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const existingUser = getUserByEmail(email);

  if (!existingUser) {
    return {
      errors: {
        email: "could not authenticate user, please check your credential.",
      },
    };
  }

  const isValidPassword = verifyPassword(existingUser.password, password);

  if (!isValidPassword) {
    return {
      errors: {
        password: "could not authenticate user, please check your credential.",
      },
    };
  }

  await createAuthSession(existingUser.id);
  redirect("/training");
}

export async function auth(mode, prevState, formData) {
  if (mode === "login") {
    return login(prevState, formData);
  }

  return signup(prevState, formData);
}
