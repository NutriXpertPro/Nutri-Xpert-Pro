"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // Supondo que você use toast
import { z } from "zod"; // Para validação
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

// Schema de validação com Zod
const anamnesisSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  age: z.number().min(0, "Idade inválida").optional().transform((val) => (val === "" ? undefined : val)),
  weight: z.number().min(0, "Peso inválido").optional().transform((val) => (val === "" ? undefined : val)),
  height: z.number().min(0, "Altura inválida").optional().transform((val) => (val === "" ? undefined : val)),
  wakeTime: z.string().min(1, "Horário de acordar é obrigatório"),
  goal: z.string().min(1, "Objetivo é obrigatório"),
});

type AnamnesisFormData = z.infer<typeof anamnesisSchema> & {
  sex: string;
  birthDate: string;
  profession: string;
  email: string;
  phone: string;
  sleepTime: string;
  sleepDifficulty: string;
  trainTime: string;
  trainDuration: number | "";
  trainDays: string;
  weightTrend: string;
  restrictedFoods: string;
  previousDiet: string;
  dietResult: string;
  intestineFunction: string;
  daysWithoutBathroom: number | "";
  bathroomFrequency: number | "";
  waterIntake: number | "";
  sweetCravings: number[];
  hungerTimes: string;
  snackPreference: string;
  favoriteFruits: string;
  familyHistory: string;
  healthProblems: string;
  healthProblemsDetails: string;
  jointProblems: string;
  medications: string;
  medicationsDetails: string;
  smoking: string;
  medicationIntolerance: string;
  intoleranceDetails: string;
  contraceptive: string;
  thermogenics: string;
  alcohol: string;
  alcoholFrequency: number | "";
  anabolics: string;
  anabolicsProblems: string;
  futureAnabolics: string;
  commitment: string;
  neck: number | "";
  waist: number | "";
  hip: number | "";
  measureWeight: number | "";
  measureHeight: number | "";
  frontPhoto: File | null;
  sidePhoto: File | null;
  backPhoto: File | null;
};

export default function AnamnesisForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AnamnesisFormData>({
    name: "",
    age: "",
    sex: "",
    birthDate: "",
    profession: "",
    email: "",
    phone: "",
    wakeTime: "",
    sleepTime: "",
    sleepDifficulty: "",
    trainTime: "",
    trainDuration: "",
    trainDays: "",
    weight: "",
    height: "",
    weightTrend: "",
    restrictedFoods: "",
    previousDiet: "",
    dietResult: "",
    intestineFunction: "",
    daysWithoutBathroom: "",
    bathroomFrequency: "",
    waterIntake: "",
    sweetCravings: [5],
    hungerTimes: "",
    snackPreference: "",
    favoriteFruits: "",
    familyHistory: "",
    healthProblems: "",
    healthProblemsDetails: "",
    jointProblems: "",
    medications: "",
    medicationsDetails: "",
    smoking: "",
    medicationIntolerance: "",
    intoleranceDetails: "",
    contraceptive: "",
    thermogenics: "",
    alcohol: "",
    alcoholFrequency: "",
    anabolics: "",
    anabolicsProblems: "",
    futureAnabolics: "",
    goal: "",
    commitment: "",
    neck: "",
    waist: "",
    hip: "",
    measureWeight: "",
    measureHeight: "",
    frontPhoto: null,
    sidePhoto: null,
    backPhoto: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
    if (id !== "new") {
      fetchAnamnesisData(id);
    }
  }, [session, status, router, id]);

  const fetchAnamnesisData = async (id: string) => {
    try {
      const res = await fetch(`/api/anamnesis/${id}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Falha ao carregar anamnese");
      const data = await res.json();
      setFormData({
        ...formData,
        ...data, // Preenche com dados existentes
        frontPhoto: null,
        sidePhoto: null,
        backPhoto: null, // Fotos precisam ser recarregadas manualmente
      });
    } catch (error) {
      toast.error("Erro ao carregar dados");
    }
  };

  const handleInputChange = (field: keyof AnamnesisFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (
    field: "frontPhoto" | "sidePhoto" | "backPhoto",
    file: File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSliderChange = (field: "sweetCravings", value: number[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    const stepFields = {
      0: ["name", "age", "sex", "birthDate", "profession", "email", "phone"],
      1: ["wakeTime", "sleepTime", "sleepDifficulty", "trainTime", "trainDuration", "trainDays"],
      2: ["weight", "height", "weightTrend", "restrictedFoods", "previousDiet", "dietResult", "intestineFunction", "daysWithoutBathroom", "bathroomFrequency", "waterIntake", "sweetCravings", "hungerTimes", "snackPreference", "favoriteFruits"],
      3: ["familyHistory", "healthProblems", "healthProblemsDetails", "jointProblems", "medications", "medicationsDetails", "smoking", "medicationIntolerance", "intoleranceDetails", "contraceptive", "thermogenics", "alcohol", "alcoholFrequency", "anabolics", "anabolicsProblems", "futureAnabolics"],
      4: ["goal", "commitment"],
      5: ["neck", "waist", "hip", "measureWeight", "measureHeight"],
      6: ["frontPhoto", "sidePhoto", "backPhoto"],
    };

    const fieldsToValidate = stepFields[currentStep as keyof typeof stepFields];
    const validation = anamnesisSchema.pick(
      fieldsToValidate.reduce((obj, field) => ({ ...obj, [field]: anamnesisSchema.shape[field] }), {})
    ).safeParse(
      fieldsToValidate.reduce((obj, field) => ({
        ...obj,
        [field]: formData[field as keyof AnamnesisFormData],
      }), {})
    );

    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        newErrors[err.path[0] as string] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key.endsWith("Photo") && value instanceof File) {
          submitData.append(key, value);
        } else if (Array.isArray(value)) {
          submitData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== "") {
          submitData.append(key, String(value));
        }
      });
      submitData.append("clientId", session?.user.id || "");

      const response = await fetch(`/api/anamnesis/create/${id}`, {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        toast.success("Anamnese salva com sucesso!");
        router.push(`/anamnesis/success?id=${id}`);
      } else {
        throw new Error("Erro ao enviar anamnese");
      }
    } catch (error) {
      toast.error("Erro ao salvar anamnese");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    "Identificação",
    "Rotina",
    "Nutrição e Hábitos",
    "Histórico de Saúde",
    "Objetivos",
    "Medidas",
    "Fotos",
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                className={errors.age ? "border-red-500" : ""}
              />
              {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
            </div>
            <div>
              <Label>Sexo</Label>
              <RadioGroup
                value={formData.sex}
                onValueChange={(value) => handleInputChange("sex", value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Masculino" id="sex-masculino" />
                  <Label htmlFor="sex-masculino">Masculino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Feminino" id="sex-feminino" />
                  <Label htmlFor="sex-feminino">Feminino</Label>
                </div>
              </RadioGroup>
            </div>
            {/* Adicione birthDate, profession, email, phone de forma semelhante */}
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="wakeTime">Horário de Acordar *</Label>
              <Input
                id="wakeTime"
                type="time"
                value={formData.wakeTime}
                onChange={(e) => handleInputChange("wakeTime", e.target.value)}
                className={errors.wakeTime ? "border-red-500" : ""}
              />
              {errors.wakeTime && <p className="text-red-500 text-sm">{errors.wakeTime}</p>}
            </div>
            {/* Adicione sleepTime, sleepDifficulty, etc. */}
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="frontPhoto">Foto de Frente *</Label>
              <Input
                id="frontPhoto"
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => handleFileChange("frontPhoto", e.target.files?.[0] || null)}
                className={errors.frontPhoto ? "border-red-500" : ""}
              />
              {errors.frontPhoto && <p className="text-red-500 text-sm">{errors.frontPhoto}</p>}
            </div>
            {/* Adicione sidePhoto e backPhoto */}
          </div>
        );
      default:
        return <div>Seção em desenvolvimento...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Ficha de Anamnese - Nutri Xpert Pro</CardTitle>
            <CardDescription>
              Passo {currentStep + 1} de {steps.length}: {steps[currentStep]}
            </CardDescription>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-nutri-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent>
            {renderStep()}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
              >
                Anterior
              </Button>
              {currentStep === steps.length - 1 ? (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar Anamnese"}
                </Button>
              ) : (
                <Button onClick={handleNext}>Próximo</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}