// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  userProfiles;
  weightEntries;
  nutritionCalculations;
  mealPlans;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.userProfiles = /* @__PURE__ */ new Map();
    this.weightEntries = /* @__PURE__ */ new Map();
    this.nutritionCalculations = /* @__PURE__ */ new Map();
    this.mealPlans = /* @__PURE__ */ new Map();
    this.initializeMealPlans();
  }
  initializeMealPlans() {
    const sampleMealPlans = [
      {
        id: randomUUID(),
        name: "Aveia com Frutas e Nozes",
        description: "Caf\xE9 da manh\xE3 nutritivo e energ\xE9tico",
        mealType: "breakfast",
        calories: 350,
        tags: ["Baixo carboidrato", "Rica em fibras"],
        ingredients: ["Aveia em flocos", "Banana", "Morangos", "Nozes", "Mel"],
        instructions: "Misture a aveia com frutas picadas e nozes. Adicione mel a gosto.",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        name: "Salm\xE3o Grelhado com Quinoa",
        description: "Almo\xE7o rico em prote\xEDnas e \xF4mega-3",
        mealType: "lunch",
        calories: 480,
        tags: ["Rico em \xF4mega-3", "Alto em prote\xEDna"],
        ingredients: ["Fil\xE9 de salm\xE3o", "Quinoa", "Br\xF3colis", "Azeite", "Lim\xE3o"],
        instructions: "Grelhe o salm\xE3o e sirva com quinoa cozida e br\xF3colis refogado.",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        name: "Salada Mediterr\xE2nea com Frango",
        description: "Jantar leve e anti-inflamat\xF3rio",
        mealType: "dinner",
        calories: 390,
        tags: ["Anti-inflamat\xF3rio", "Baixa caloria"],
        ingredients: ["Peito de frango", "Folhas verdes", "Tomate cereja", "Pepino", "Azeite extra virgem"],
        instructions: "Monte a salada com vegetais frescos e frango grelhado em cubos.",
        createdAt: /* @__PURE__ */ new Date()
      }
    ];
    sampleMealPlans.forEach((plan) => {
      this.mealPlans.set(plan.id, plan);
    });
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = {
      ...insertUser,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async getUserProfile(userId) {
    return Array.from(this.userProfiles.values()).find((profile) => profile.userId === userId);
  }
  async createOrUpdateUserProfile(insertProfile) {
    const existing = await this.getUserProfile(insertProfile.userId);
    if (existing) {
      const updated = {
        id: existing.id,
        userId: insertProfile.userId,
        age: insertProfile.age || null,
        gender: insertProfile.gender || null,
        height: insertProfile.height || null,
        activityLevel: insertProfile.activityLevel || null,
        goal: insertProfile.goal || null,
        createdAt: existing.createdAt,
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.userProfiles.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const profile = {
        id,
        userId: insertProfile.userId,
        age: insertProfile.age || null,
        gender: insertProfile.gender || null,
        height: insertProfile.height || null,
        activityLevel: insertProfile.activityLevel || null,
        goal: insertProfile.goal || null,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.userProfiles.set(id, profile);
      return profile;
    }
  }
  async getWeightEntries(userId) {
    return Array.from(this.weightEntries.values()).filter((entry) => entry.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  async createWeightEntry(insertEntry) {
    const id = randomUUID();
    const entry = {
      id,
      userId: insertEntry.userId,
      weight: insertEntry.weight || null,
      date: insertEntry.date,
      notes: insertEntry.notes || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.weightEntries.set(id, entry);
    return entry;
  }
  async deleteWeightEntry(id) {
    return this.weightEntries.delete(id);
  }
  async createNutritionCalculation(insertCalculation) {
    const id = randomUUID();
    const calculation = {
      id,
      userId: insertCalculation.userId,
      type: insertCalculation.type,
      inputData: insertCalculation.inputData,
      result: insertCalculation.result,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.nutritionCalculations.set(id, calculation);
    return calculation;
  }
  async getNutritionCalculations(userId, type) {
    return Array.from(this.nutritionCalculations.values()).filter((calc) => calc.userId === userId && (!type || calc.type === type)).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  async getMealPlans() {
    return Array.from(this.mealPlans.values());
  }
  async createMealPlan(insertMealPlan) {
    const id = randomUUID();
    const mealPlan = {
      id,
      name: insertMealPlan.name,
      description: insertMealPlan.description || null,
      mealType: insertMealPlan.mealType,
      calories: insertMealPlan.calories || null,
      tags: insertMealPlan.tags || null,
      ingredients: insertMealPlan.ingredients || null,
      instructions: insertMealPlan.instructions || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.mealPlans.set(id, mealPlan);
    return mealPlan;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  age: integer("age"),
  gender: varchar("gender", { length: 10 }),
  height: varchar("height", { length: 10 }),
  // in cm
  activityLevel: varchar("activity_level", { length: 20 }),
  goal: varchar("goal", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var weightEntries = pgTable("weight_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  weight: varchar("weight", { length: 10 }),
  // in kg
  date: date("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
var nutritionCalculations = pgTable("nutrition_calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type", { length: 20 }).notNull(),
  // 'bmi' or 'calories'
  inputData: text("input_data").notNull(),
  // JSON string of input parameters
  result: varchar("result", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var mealPlans = pgTable("meal_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  mealType: varchar("meal_type", { length: 20 }).notNull(),
  // breakfast, lunch, dinner, snack
  calories: integer("calories"),
  tags: text("tags").array(),
  ingredients: text("ingredients").array(),
  instructions: text("instructions"),
  createdAt: timestamp("created_at").defaultNow()
});
var anamnesis = pgTable("anamnesis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull(),
  medicalHistory: text("medical_history"),
  medications: text("medications"),
  allergies: text("allergies"),
  physicalActivity: text("physical_activity"),
  sleepHours: integer("sleep_hours"),
  stressLevel: integer("stress_level"),
  waterIntake: varchar("water_intake"),
  smokingStatus: varchar("smoking_status"),
  alcoholConsumption: varchar("alcohol_consumption"),
  dietaryRestrictions: text("dietary_restrictions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertWeightEntrySchema = createInsertSchema(weightEntries).omit({
  id: true,
  createdAt: true
});
var insertNutritionCalculationSchema = createInsertSchema(nutritionCalculations).omit({
  id: true,
  createdAt: true
});
var insertMealPlanSchema = createInsertSchema(mealPlans).omit({
  id: true,
  createdAt: true
});
var insertAnamnesisSchema = createInsertSchema(anamnesis).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const profile = await storage.getUserProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/profile", async (req, res) => {
    try {
      const profileData = insertUserProfileSchema.parse(req.body);
      const profile = await storage.createOrUpdateUserProfile(profileData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });
  app2.get("/api/weight/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const entries = await storage.getWeightEntries(userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/weight", async (req, res) => {
    try {
      const entryData = insertWeightEntrySchema.parse(req.body);
      const entry = await storage.createWeightEntry(entryData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid weight entry data" });
    }
  });
  app2.delete("/api/weight/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteWeightEntry(id);
      if (!deleted) {
        return res.status(404).json({ message: "Weight entry not found" });
      }
      res.json({ message: "Weight entry deleted" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/calculations", async (req, res) => {
    try {
      const calculationData = insertNutritionCalculationSchema.parse(req.body);
      const calculation = await storage.createNutritionCalculation(calculationData);
      res.json(calculation);
    } catch (error) {
      res.status(400).json({ message: "Invalid calculation data" });
    }
  });
  app2.get("/api/calculations/:userId/:type", async (req, res) => {
    try {
      const { userId, type } = req.params;
      const calculations = await storage.getNutritionCalculations(userId, type);
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/meal-plans", async (req, res) => {
    try {
      const mealPlans2 = await storage.getMealPlans();
      res.json(mealPlans2);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/calculate/bmi", async (req, res) => {
    try {
      const { height, weight, userId } = req.body;
      if (!height || !weight) {
        return res.status(400).json({ message: "Height and weight are required" });
      }
      const heightInMeters = parseFloat(height) / 100;
      const bmi = parseFloat(weight) / (heightInMeters * heightInMeters);
      let classification = "";
      if (bmi < 18.5) {
        classification = "Abaixo do peso";
      } else if (bmi < 25) {
        classification = "Peso normal";
      } else if (bmi < 30) {
        classification = "Sobrepeso";
      } else {
        classification = "Obesidade";
      }
      const result = {
        bmi: parseFloat(bmi.toFixed(1)),
        classification,
        height: parseFloat(height),
        weight: parseFloat(weight)
      };
      if (userId) {
        await storage.createNutritionCalculation({
          userId,
          type: "bmi",
          inputData: JSON.stringify({ height, weight }),
          result: result.bmi.toString()
        });
      }
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid BMI calculation data" });
    }
  });
  app2.post("/api/calculate/calories", async (req, res) => {
    try {
      const { age, gender, height, weight, activityLevel, goal, userId } = req.body;
      if (!age || !gender || !height || !weight || !activityLevel || !goal) {
        return res.status(400).json({ message: "All fields are required" });
      }
      let bmr;
      if (gender === "Masculino") {
        bmr = 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseInt(age) + 5;
      } else {
        bmr = 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseInt(age) - 161;
      }
      const activityMultipliers = {
        "Sedent\xE1rio": 1.2,
        "Levemente ativo": 1.375,
        "Moderadamente ativo": 1.55,
        "Muito ativo": 1.725,
        "Extremamente ativo": 1.9
      };
      const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);
      let calories = tdee;
      if (goal === "Perder peso") {
        calories = tdee - 500;
      } else if (goal === "Ganhar peso") {
        calories = tdee + 500;
      }
      const protein = Math.round(calories * 0.25 / 4);
      const carbs = Math.round(calories * 0.45 / 4);
      const fat = Math.round(calories * 0.3 / 9);
      const result = {
        calories: Math.round(calories),
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        macros: {
          protein: `${protein}g (25%)`,
          carbs: `${carbs}g (45%)`,
          fat: `${fat}g (30%)`
        },
        goal,
        activityLevel
      };
      if (userId) {
        await storage.createNutritionCalculation({
          userId,
          type: "calories",
          inputData: JSON.stringify({ age, gender, height, weight, activityLevel, goal }),
          result: result.calories.toString()
        });
      }
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid calorie calculation data" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      logLine.length > 80 && (logLine = logLine.slice(0, 79) + "\u2026");
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    const server = await registerRoutes(app);
    app.use((err, req, res, next) => {
      const status = err.status || 500;
      const message = err.message || "Internal Server Error";
      log(`\u274C Erro ${status} em ${req.path}: ${message}`);
      res.status(status).json({
        error: message,
        ...app.get("env") === "development" && { stack: err.stack }
      });
    });
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    const port = parseInt(process.env.PORT || "3001", 10);
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        const newPort = port + 1;
        log(`\u26A0\uFE0F  Porta ${port} ocupada. Tentando ${newPort}...`);
        server.listen(newPort, "0.0.0.0");
      } else {
        log(`\u{1F4A5} Erro cr\xEDtico: ${err.message}`);
        process.exit(1);
      }
    });
    server.listen(port, "0.0.0.0", () => {
      log(`\u2705 NutriXpertPro rodando na porta ${port}`);
      log(`\u{1F310} Acesse: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
    });
  } catch (err) {
    log(`\u{1F4A3} Falha na inicializa\xE7\xE3o: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }
})();
