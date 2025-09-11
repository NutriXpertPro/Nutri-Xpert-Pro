import { pgTable, text, timestamp, integer, real, varchar, json, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  age: integer("age"),
  gender: text("gender"),
  height: real("height"), // em cm
  activityLevel: text("activity_level"),
  goal: text("goal"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const weightEntries = pgTable("weight_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  weight: real("weight"), // em kg
  date: timestamp("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const nutritionCalculations = pgTable("nutrition_calculations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // bmi, calories, etc
  inputData: text("input_data").notNull(), // JSON string
  result: text("result").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mealPlans = pgTable("meal_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  calories: integer("calories"),
  tags: json("tags").$type<string[]>(),
  ingredients: json("ingredients").$type<string[]>(),
  instructions: text("instructions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const anamnesis = pgTable("anamnesis", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  medicalHistory: text("medical_history"),
  medications: json("medications").$type<string[]>(),
  allergies: json("allergies").$type<string[]>(),
  dietaryRestrictions: json("dietary_restrictions").$type<string[]>(),
  eatingHabits: text("eating_habits"),
  physicalActivity: text("physical_activity"),
  sleepPattern: text("sleep_pattern"),
  stressLevel: text("stress_level"),
  observations: text("observations"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

export type WeightEntry = typeof weightEntries.$inferSelect;
export type InsertWeightEntry = typeof weightEntries.$inferInsert;

export type NutritionCalculation = typeof nutritionCalculations.$inferSelect;
export type InsertNutritionCalculation = typeof nutritionCalculations.$inferInsert;

export type MealPlan = typeof mealPlans.$inferSelect;
export type InsertMealPlan = typeof mealPlans.$inferInsert;

export type Anamnesis = typeof anamnesis.$inferSelect;
export type InsertAnamnesis = typeof anamnesis.$inferInsert;

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles, {
  age: z.number().min(1).max(120).optional(),
  height: z.number().min(50).max(250).optional(), // altura em cm
  gender: z.enum(["Masculino", "Feminino", "Outro"]).optional(),
  activityLevel: z.enum([
    "Sedentário",
    "Levemente ativo",
    "Moderadamente ativo", 
    "Muito ativo",
    "Extremamente ativo"
  ]).optional(),
  goal: z.enum([
    "Perder peso",
    "Manter peso",
    "Ganhar peso",
    "Ganhar massa muscular"
  ]).optional(),
});

export const insertWeightEntrySchema = createInsertSchema(weightEntries, {
  weight: z.number().min(20).max(300).optional(), // peso em kg
  date: z.coerce.date(),
  notes: z.string().optional(),
});

export const insertNutritionCalculationSchema = createInsertSchema(nutritionCalculations, {
  type: z.enum(["bmi", "calories", "macros", "hydration"]),
  inputData: z.string(),
  result: z.string(),
});

export const insertMealPlanSchema = createInsertSchema(mealPlans, {
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  calories: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  instructions: z.string().optional(),
});

export const insertAnamnesisSchema = createInsertSchema(anamnesis, {
  medicalHistory: z.string().optional(),
  medications: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  eatingHabits: z.string().optional(),
  physicalActivity: z.string().optional(),
  sleepPattern: z.string().optional(),
  stressLevel: z.enum(["Baixo", "Moderado", "Alto"]).optional(),
  observations: z.string().optional(),
});

export const selectUserSchema = createSelectSchema(users);
export const selectUserProfileSchema = createSelectSchema(userProfiles);
export const selectWeightEntrySchema = createSelectSchema(weightEntries);
export const selectNutritionCalculationSchema = createSelectSchema(nutritionCalculations);
export const selectMealPlanSchema = createSelectSchema(mealPlans);
export const selectAnamnesisSchema = createSelectSchema(anamnesis);