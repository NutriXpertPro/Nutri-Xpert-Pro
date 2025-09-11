import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserProfileSchema, 
  insertWeightEntrySchema, 
  insertNutritionCalculationSchema,
  insertAnamnesisSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User profile routes
  app.get("/api/profile/:userId", async (req, res) => {
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

  app.post("/api/profile", async (req, res) => {
    try {
      const profileData = insertUserProfileSchema.parse(req.body);
      const profile = await storage.createOrUpdateUserProfile(profileData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  // Weight tracking routes
  app.get("/api/weight/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const entries = await storage.getWeightEntries(userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/weight", async (req, res) => {
    try {
      const entryData = insertWeightEntrySchema.parse(req.body);
      const entry = await storage.createWeightEntry(entryData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid weight entry data" });
    }
  });

  app.delete("/api/weight/:id", async (req, res) => {
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

  // Nutrition calculation routes
  app.post("/api/calculations", async (req, res) => {
    try {
      const calculationData = insertNutritionCalculationSchema.parse(req.body);
      const calculation = await storage.createNutritionCalculation(calculationData);
      res.json(calculation);
    } catch (error) {
      res.status(400).json({ message: "Invalid calculation data" });
    }
  });

  app.get("/api/calculations/:userId/:type", async (req, res) => {
    try {
      const { userId, type } = req.params;
      const calculations = await storage.getNutritionCalculations(userId, type);
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Meal plans routes
  app.get("/api/meal-plans", async (req, res) => {
    try {
      const mealPlans = await storage.getMealPlans();
      res.json(mealPlans);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // BMI calculation endpoint
  app.post("/api/calculate/bmi", async (req, res) => {
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
        weight: parseFloat(weight),
      };

      // Save calculation if userId provided
      if (userId) {
        await storage.createNutritionCalculation({
          userId,
          type: "bmi",
          inputData: JSON.stringify({ height, weight }),
          result: result.bmi.toString(),
        });
      }

      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid BMI calculation data" });
    }
  });

  // Calorie calculation endpoint
  app.post("/api/calculate/calories", async (req, res) => {
    try {
      const { age, gender, height, weight, activityLevel, goal, userId } = req.body;
      
      if (!age || !gender || !height || !weight || !activityLevel || !goal) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Mifflin-St Jeor Equation
      let bmr;
      if (gender === "Masculino") {
        bmr = 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseInt(age) + 5;
      } else {
        bmr = 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseInt(age) - 161;
      }

      // Activity multipliers
      const activityMultipliers = {
        "Sedentário": 1.2,
        "Levemente ativo": 1.375,
        "Moderadamente ativo": 1.55,
        "Muito ativo": 1.725,
        "Extremamente ativo": 1.9,
      };

      const tdee = bmr * (activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.2);

      // Goal adjustments
      let calories = tdee;
      if (goal === "Perder peso") {
        calories = tdee - 500; // 500 calorie deficit
      } else if (goal === "Ganhar peso") {
        calories = tdee + 500; // 500 calorie surplus
      }

      // Macronutrient breakdown (example ratios)
      const protein = Math.round((calories * 0.25) / 4); // 25% protein (4 cal/g)
      const carbs = Math.round((calories * 0.45) / 4); // 45% carbs (4 cal/g)
      const fat = Math.round((calories * 0.30) / 9); // 30% fat (9 cal/g)

      const result = {
        calories: Math.round(calories),
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        macros: {
          protein: `${protein}g (25%)`,
          carbs: `${carbs}g (45%)`,
          fat: `${fat}g (30%)`,
        },
        goal,
        activityLevel,
      };

      // Save calculation if userId provided
      if (userId) {
        await storage.createNutritionCalculation({
          userId,
          type: "calories",
          inputData: JSON.stringify({ age, gender, height, weight, activityLevel, goal }),
          result: result.calories.toString(),
        });
      }

      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid calorie calculation data" });
    }
  });



  const httpServer = createServer(app);
  return httpServer;
}
