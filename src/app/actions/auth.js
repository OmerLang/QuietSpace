'use server'

import  { signupVaildation, loginVaildation }  from "@/../lib/validations/authSchema";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

export async function handleSignup(data) {
  const result = signupVaildation.safeParse(data);
  if (!result.success) {
    const errorTree = z.treeifyError(result.error);

    return {
      success: false,
      errors: {
        fullName: errorTree.fullName?._errors?.[0],
        email: errorTree.email?._errors?.[0],
        password: errorTree.password?._errors?.[0],
        confirmPassword: errorTree.confirmPassword?._errors?.[0],
      }
    };
  }
  const supabase = await createClient();
  const { email, password, fullName } = result.data;
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }
  return { success: true }
}


export async function handleLogin(data) {
  const result = loginVaildation.safeParse(data);
  if (!result.success) {
    const errorTree = z.treeifyError(result.error);

    return {
      success: false,
      errors: {
        email: errorTree.email?._errors?.[0],
        password: errorTree.password?._errors?.[0]
      }
    };
  }
  const supabase = await createClient();
  const { email, password } = result.data;
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message
    };
  }
  return { success: true }
}