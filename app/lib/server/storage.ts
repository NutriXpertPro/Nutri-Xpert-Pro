import { 
  type User, 
  type InsertUser,
  type UserProfile,
  type InsertUserProfile,
  type WeightEntry,
  type InsertWeightEntry,
  type NutritionCalculation,
  type InsertNutritionCalculation,
  type MealPlan,
  type InsertMealPlan
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User Profiles
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createOrUpdateUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  
  // Weight Entries
  getWeightEntries(userId: string): Promise<WeightEntry[]>;
  createWeightEntry(entry: InsertWeightEntry): Promise<WeightEntry>;
  deleteWeightEntry(id: string): Promise<boolean>;
  
  // Nutrition Calculations
  createNutritionCalculation(calculation: InsertNutritionCalculation): Promise<NutritionCalculation>;
  getNutritionCalculations(userId: string, type?: string): Promise<NutritionCalculation[]>;
  
  // Meal Plans
  getMealPlans(): Promise<MealPlan[]>;
  createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private userProfiles: Map<string, UserProfile>;
  private weightEntries: Map<string, WeightEntry>;
  private nutritionCalculations: Map<string, NutritionCalculation>;
  private mealPlans: Map<string, MealPlan>;

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.weightEntries = new Map();
    this.nutritionCalculations = new Map();
    this.mealPlans = new Map();
    
    // Initialize with sample meal plans
    this.initializeMealPlans();
  }

  private initializeMealPlans() {
    const sampleMealPlans: MealPlan[] = [
      {
        id: randomUUID(),
        name: "Aveia com Frutas e Nozes",
        description: "Café da manhã nutritivo e energético",
        mealType: "breakfast",
        calories: 350,
        tags: ["Baixo carboidrato", "Rica em fibras"],
        ingredients: ["Aveia em flocos", "Banana", "Morangos", "Nozes", "Mel"],
        instructions: "Misture a aveia com frutas picadas e nozes. Adicione mel a gosto.",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Salmão Grelhado com Quinoa",
        description: "Almoço rico em proteínas e ômega-3",
        mealType: "lunch",
        calories: 480,
        tags: ["Rico em ômega-3", "Alto em proteína"],
        ingredients: ["Filé de salmão", "Quinoa", "Brócolis", "Azeite", "Limão"],
        instructions: "Grelhe o salmão e sirva com quinoa cozida e brócolis refogado.",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Salada Mediterrânea com Frango",
        description: "Jantar leve e anti-inflamatório",
        mealType: "dinner",
        calories: 390,
        tags: ["Anti-inflamatório", "Baixa caloria"],
        ingredients: ["Peito de frango", "Folhas verdes", "Tomate cereja", "Pepino", "Azeite extra virgem"],
        instructions: "Monte a salada com vegetais frescos e frango grelhado em cubos.",
        createdAt: new Date(),
      },
    ];

    sampleMealPlans.forEach(plan => {
      this.mealPlans.set(plan.id, plan);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(profile => profile.userId === userId);
  }

  async createOrUpdateUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const existing = await this.getUserProfile(insertProfile.userId);
    
    if (existing) {
      const updated: UserProfile = {
        id: existing.id,
        userId: insertProfile.userId,
        age: insertProfile.age || null,
        gender: insertProfile.gender || null,
        height: insertProfile.height || null,
        activityLevel: insertProfile.activityLevel || null,
        goal: insertProfile.goal || null,
        createdAt: existing.createdAt,
        updatedAt: new Date(),
      };
      this.userProfiles.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const profile: UserProfile = {
        id,
        userId: insertProfile.userId,
        age: insertProfile.age || null,
        gender: insertProfile.gender || null,
        height: insertProfile.height || null,
        activityLevel: insertProfile.activityLevel || null,
        goal: insertProfile.goal || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.userProfiles.set(id, profile);
      return profile;
    }
  }

  async getWeightEntries(userId: string): Promise<WeightEntry[]> {
    return Array.from(this.weightEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createWeightEntry(insertEntry: InsertWeightEntry): Promise<WeightEntry> {
    const id = randomUUID();
    const entry: WeightEntry = {
      id,
      userId: insertEntry.userId,
      weight: insertEntry.weight || null,
      date: insertEntry.date,
      notes: insertEntry.notes || null,
      createdAt: new Date(),
    };
    this.weightEntries.set(id, entry);
    return entry;
  }

  async deleteWeightEntry(id: string): Promise<boolean> {
    return this.weightEntries.delete(id);
  }

  async createNutritionCalculation(insertCalculation: InsertNutritionCalculation): Promise<NutritionCalculation> {
    const id = randomUUID();
    const calculation: NutritionCalculation = {
      id,
      userId: insertCalculation.userId,
      type: insertCalculation.type,
      inputData: insertCalculation.inputData,
      result: insertCalculation.result,
      createdAt: new Date(),
    };
    this.nutritionCalculations.set(id, calculation);
    return calculation;
  }

  async getNutritionCalculations(userId: string, type?: string): Promise<NutritionCalculation[]> {
    return Array.from(this.nutritionCalculations.values())
      .filter(calc => calc.userId === userId && (!type || calc.type === type))
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getMealPlans(): Promise<MealPlan[]> {
    return Array.from(this.mealPlans.values());
  }

  async createMealPlan(insertMealPlan: InsertMealPlan): Promise<MealPlan> {
    const id = randomUUID();
    const mealPlan: MealPlan = {
      id,
      name: insertMealPlan.name,
      description: insertMealPlan.description || null,
      mealType: insertMealPlan.mealType,
      calories: insertMealPlan.calories || null,
      tags: insertMealPlan.tags || null,
      ingredients: insertMealPlan.ingredients || null,
      instructions: insertMealPlan.instructions || null,
      createdAt: new Date(),
    };
    this.mealPlans.set(id, mealPlan);
    return mealPlan;
  }
}

export const storage = new MemStorage();