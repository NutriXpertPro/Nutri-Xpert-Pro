
import { pgTable, text, timestamp, integer, real, varchar, json, uuid, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (adaptado para NextAuth)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  image: text("image"), // Para fotos do OAuth
  role: text("role").default("client").notNull(), // client, nutritionist
  emailVerified: timestamp("email_verified"), // Para NextAuth
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Clients table - clientes dos nutricionistas
export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  birthDate: timestamp("birth_date"),
  age: integer("age"),
  sex: text("sex"), // Masculino, Feminino
  profession: text("profession"),
  proId: uuid("pro_id").references(() => users.id).notNull(), // FK para o nutricionista
  notes: text("notes"), // Observações gerais
  active: boolean("active").default(true).notNull(),
  evaluationType: text("evaluation_type").default("virtual").notNull(), // virtual, presencial
  nextEvaluationDate: timestamp("next_evaluation_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Anamnesis table - Ficha de anamnese completa
export const anamnesis = pgTable("anamnesis", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id").references(() => clients.id).notNull(),
  proId: uuid("pro_id").references(() => users.id).notNull(),
  // Dados pessoais
  weight: real("weight"),
  height: real("height"),
  // Rotina
  wakeTime: text("wake_time"),
  sleepTime: text("sleep_time"),
  sleepDifficulty: text("sleep_difficulty"),
  trainTime: text("train_time"),
  trainDuration: integer("train_duration"),
  trainDays: text("train_days"),
  // Histórico de peso
  weightTrend: text("weight_trend"),
  // Alimentação
  restrictedFoods: text("restricted_foods"),
  previousDiet: text("previous_diet"),
  dietResult: text("diet_result"),
  intestineFunction: text("intestine_function"),
  daysWithoutBathroom: integer("days_without_bathroom"),
  bathroomFrequency: integer("bathroom_frequency"),
  waterIntake: real("water_intake"),
  sweetCravings: integer("sweet_cravings"),
  hungerTimes: text("hunger_times"),
  snackPreference: text("snack_preference"),
  favoriteFruits: text("favorite_fruits"),
  // Histórico de saúde
  familyHistory: text("family_history"),
  healthProblems: text("health_problems"),
  healthProblemsDetails: text("health_problems_details"),
  jointProblems: text("joint_problems"),
  medications: text("medications"),
  medicationsDetails: text("medications_details"),
  smoking: text("smoking"),
  medicationIntolerance: text("medication_intolerance"),
  intoleranceDetails: text("intolerance_details"),
  contraceptive: text("contraceptive"),
  thermogenics: text("thermogenics"),
  alcohol: text("alcohol"),
  alcoholFrequency: integer("alcohol_frequency"),
  anabolics: text("anabolics"),
  anabolicsProblems: text("anabolics_problems"),
  futureAnabolics: text("future_anabolics"),
  // Objetivos
  goal: text("goal"),
  commitment: text("commitment"),
  // Medidas iniciais
  neck: real("neck"),
  waist: real("waist"),
  hip: real("hip"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Evaluations table - Avaliações quinzenais
export const evaluations = pgTable("evaluations", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id").references(() => clients.id).notNull(),
  proId: uuid("pro_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // quinzenal, presencial, inicial
  weight: real("weight"),
  neck: real("neck"),
  waist: real("waist"),
  hip: real("hip"),
  bodyFatPercentage: real("body_fat_percentage"),
  leanMass: real("lean_mass"),
  fatMass: real("fat_mass"),
  frontPhotoUrl: text("front_photo_url"),
  sidePhotoUrl: text("side_photo_url"),
  backPhotoUrl: text("back_photo_url"),
  notes: text("notes"),
  status: text("status").default("pending").notNull(), // pending, completed, overdue
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Foods table - Tabela TACO
export const foods = pgTable("foods", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  // Macronutrientes por 100g
  calories: real("calories"),
  protein: real("protein"),
  carbohydrates: real("carbohydrates"),
  fat: real("fat"),
  fiber: real("fiber"),
  sodium: real("sodium"),
  // Micronutrientes
  calcium: real("calcium"),
  iron: real("iron"),
  magnesium: real("magnesium"),
  phosphorus: real("phosphorus"),
  potassium: real("potassium"),
  zinc: real("zinc"),
  // Vitaminas
  vitaminA: real("vitamin_a"),
  vitaminB1: real("vitamin_b1"),
  vitaminB2: real("vitamin_b2"),
  vitaminB3: real("vitamin_b3"),
  vitaminB6: real("vitamin_b6"),
  vitaminB12: real("vitamin_b12"),
  vitaminC: real("vitamin_c"),
  vitaminD: real("vitamin_d"),
  vitaminE: real("vitamin_e"),
  folate: real("folate"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Diets table - Dietas personalizadas
export const diets = pgTable("diets", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id").references(() => clients.id).notNull(),
  proId: uuid("pro_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  totalCalories: real("total_calories"),
  totalProtein: real("total_protein"),
  totalCarbs: real("total_carbs"),
  totalFat: real("total_fat"),
  meals: json("meals").$type<any[]>(), // Array de refeições
  substitutions: json("substitutions").$type<any>(), // Substituições permitidas
  observations: text("observations"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Meal Plans table - Planos de refeição
export const mealPlans = pgTable("meal_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  calories: real("calories"),
  protein: real("protein"),
  carbs: real("carbs"),
  fat: real("fat"),
  ingredients: json("ingredients").$type<any[]>(),
  instructions: text("instructions"),
  tags: json("tags").$type<string[]>(),
  proId: uuid("pro_id").references(() => users.id), // null para templates globais
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notifications table - Sistema de notificações
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  proId: uuid("pro_id").references(() => users.id).notNull(),
  clientId: uuid("client_id").references(() => clients.id),
  type: text("type").notNull(), // evaluation_overdue, evaluation_due, diet_created
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  actionUrl: text("action_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reports table - Relatórios gerados
export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id").references(() => clients.id).notNull(),
  proId: uuid("pro_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // evolution, diet, complete
  title: text("title").notNull(),
  content: json("content").$type<any>(),
  pdfUrl: text("pdf_url"),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

export type Anamnesis = typeof anamnesis.$inferSelect;
export type InsertAnamnesis = typeof anamnesis.$inferInsert;

export type Evaluation = typeof evaluations.$inferSelect;
export type InsertEvaluation = typeof evaluations.$inferInsert;

export type Food = typeof foods.$inferSelect;
export type InsertFood = typeof foods.$inferInsert;

export type Diet = typeof diets.$inferSelect;
export type InsertDiet = typeof diets.$inferInsert;

export type MealPlan = typeof mealPlans.$inferSelect;
export type InsertMealPlan = typeof mealPlans.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
  role: z.enum(["nutritionist", "client"]).optional(),
});

export const createClientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  birthDate: z.coerce.date().optional(),
  age: z.number().min(1).max(120).optional(),
  sex: z.enum(["Masculino", "Feminino"]).optional(),
  profession: z.string().optional(),
  notes: z.string().optional(),
  evaluationType: z.enum(["virtual", "presencial"]).default("virtual"),
});

export const updateClientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  birthDate: z.coerce.date().optional(),
  age: z.number().min(1).max(120).optional(),
  sex: z.enum(["Masculino", "Feminino"]).optional(),
  profession: z.string().optional(),
  notes: z.string().optional(),
  evaluationType: z.enum(["virtual", "presencial"]).optional(),
});

export const createAnamnesisSchema = createInsertSchema(anamnesis, {
  weight: z.number().min(20).max(300).optional(),
  height: z.number().min(50).max(250).optional(),
  wakeTime: z.string().optional(),
  sleepTime: z.string().optional(),
  trainDuration: z.number().min(0).max(480).optional(),
  waterIntake: z.number().min(0).max(10).optional(),
  sweetCravings: z.number().min(1).max(10).optional(),
  daysWithoutBathroom: z.number().min(0).max(30).optional(),
  bathroomFrequency: z.number().min(0).max(20).optional(),
  alcoholFrequency: z.number().min(0).max(7).optional(),
  neck: z.number().min(20).max(60).optional(),
  waist: z.number().min(40).max(200).optional(),
  hip: z.number().min(40).max(200).optional(),
});

export const createEvaluationSchema = createInsertSchema(evaluations, {
  weight: z.number().min(20).max(300).optional(),
  neck: z.number().min(20).max(60).optional(),
  waist: z.number().min(40).max(200).optional(),
  hip: z.number().min(40).max(200).optional(),
  type: z.enum(["quinzenal", "presencial", "inicial"]),
});

export const createFoodSchema = createInsertSchema(foods, {
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  category: z.string().min(2, "Categoria deve ter pelo menos 2 caracteres"),
  calories: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
  carbohydrates: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
});

export const createDietSchema = createInsertSchema(diets, {
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  totalCalories: z.number().min(0).optional(),
  totalProtein: z.number().min(0).optional(),
  totalCarbs: z.number().min(0).optional(),
  totalFat: z.number().min(0).optional(),
});

export const createMealPlanSchema = createInsertSchema(mealPlans, {
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  calories: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
});
