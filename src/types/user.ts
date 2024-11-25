import * as z from "zod";

export enum UserRole {
  super_admin = "super_admin",
  admin = "admin",
  user = "user",
}

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
  phone_number: z.string().describe("Phone Number"),

  role: z.nativeEnum(UserRole),
});

export const userCreateSchema = userSchema.pick({
  email: true,
  name: true,
  password: true,
  phone_number: true,
});

export const memberUserCreateSchema = userSchema.pick({
  email: true,
  name: true,
  phone_number: true,
});

export const userEditSchema = userSchema.pick({
  name: true,
  phone_number: true,
});
