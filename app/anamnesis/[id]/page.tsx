// app/anamnesis/[id]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

interface AnamnesisFormData {
  name: string;
  age: number | "";
  sex: string;
  birthDate: string;
  profession: string;
  email: string;
  phone: string;
  wakeTime: string;
  sleepTime: string;
  sleepDifficulty: string;
  trainTime: string;
  trainDuration: number | "";
  trainDays: string;
  weight: number | "";
  height: number | "";
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
  goal: string;
  commitment: string;
  neck: number | "";
  waist: number | "";
  hip: number | "";
  measureWeight: number | "";
  measureHeight: number | "";
  frontPhoto: File | null;
  sidePhoto: File | null;
  backPhoto: File | null;
}

export default function AnamnesisForm() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

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

  const steps = [
    "Identificação",
    "Rotina",
    "Nutrição e Hábitos",
    "Histórico de Saúde",
    "Objetivos",
    "Medidas",
    "Fotos",
  ];

  const handleInputChange = (field: keyof AnamnesisFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (
    field: "frontPhoto" | "sidePhoto" | "backPhoto",
    file: File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async () => {
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

      const response = await fetch(`/api/anamnesis/create/${id}`, {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        router.push(`/anamnesis/success?id=${id}`);
      } else {
        throw new Error("Erro ao enviar anamnese");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao enviar anamnese. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                required
              />
            </div>
            {/* ...demais campos iguais ao código original... */}
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="frontPhoto">Foto de frente *</Label>
              <Input
                id="frontPhoto"
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) =>
                  handleFileChange("frontPhoto", e.target.files?.[0] || null)
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="sidePhoto">Foto de lado *</Label>
              <Input
                id="sidePhoto"
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) =>
                  handleFileChange("sidePhoto", e.target.files?.[0] || null)
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="backPhoto">Foto de costas *</Label>
              <Input
                id="backPhoto"
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) =>
                  handleFileChange("backPhoto", e.target.files?.[0] || null)
                }
                required
              />
            </div>
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
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
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
                <Button
                  onClick={() =>
                    setCurrentStep((prev) =>
                      Math.min(steps.length - 1, prev + 1)
                    )
                  }
                >
                  Próximo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}