import { useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'

interface AnamnesisFormData {
  // Identificação
  name: string
  age: number | ''
  sex: string
  birthDate: string
  profession: string
  email: string
  phone: string

  // Rotina
  wakeTime: string
  sleepTime: string
  sleepDifficulty: string
  trainTime: string
  trainDuration: number | ''
  trainDays: string

  // Nutrição e Hábitos
  weight: number | ''
  height: number | ''
  weightTrend: string
  restrictedFoods: string
  previousDiet: string
  dietResult: string
  intestineFunction: string
  daysWithoutBathroom: number | ''
  bathroomFrequency: number | ''
  waterIntake: number | ''
  sweetCravings: number[]
  hungerTimes: string
  snackPreference: string
  favoriteFruits: string

  // Histórico de Saúde
  familyHistory: string
  healthProblems: string
  healthProblemsDetails: string
  jointProblems: string
  medications: string
  medicationsDetails: string
  smoking: string
  medicationIntolerance: string
  intoleranceDetails: string
  contraceptive: string
  thermogenics: string
  alcohol: string
  alcoholFrequency: number | ''
  anabolics: string
  anabolicsProblems: string
  futureAnabolics: string

  // Objetivos
  goal: string
  commitment: string

  // Medidas
  neck: number | ''
  waist: number | ''
  hip: number | ''
  measureWeight: number | ''
  measureHeight: number | ''

  // Fotos
  frontPhoto: File | null
  sidePhoto: File | null
  backPhoto: File | null
}

export default function AnamnesisForm() {
  const router = useRouter()
  const { id } = router.query
  
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<AnamnesisFormData>({
    // Identificação
    name: '',
    age: '',
    sex: '',
    birthDate: '',
    profession: '',
    email: '',
    phone: '',
    
    // Rotina
    wakeTime: '',
    sleepTime: '',
    sleepDifficulty: '',
    trainTime: '',
    trainDuration: '',
    trainDays: '',
    
    // Nutrição e Hábitos
    weight: '',
    height: '',
    weightTrend: '',
    restrictedFoods: '',
    previousDiet: '',
    dietResult: '',
    intestineFunction: '',
    daysWithoutBathroom: '',
    bathroomFrequency: '',
    waterIntake: '',
    sweetCravings: [5],
    hungerTimes: '',
    snackPreference: '',
    favoriteFruits: '',
    
    // Histórico de Saúde
    familyHistory: '',
    healthProblems: '',
    healthProblemsDetails: '',
    jointProblems: '',
    medications: '',
    medicationsDetails: '',
    smoking: '',
    medicationIntolerance: '',
    intoleranceDetails: '',
    contraceptive: '',
    thermogenics: '',
    alcohol: '',
    alcoholFrequency: '',
    anabolics: '',
    anabolicsProblems: '',
    futureAnabolics: '',
    
    // Objetivos
    goal: '',
    commitment: '',
    
    // Medidas
    neck: '',
    waist: '',
    hip: '',
    measureWeight: '',
    measureHeight: '',
    
    // Fotos
    frontPhoto: null,
    sidePhoto: null,
    backPhoto: null,
  })

  const steps = [
    'Identificação',
    'Rotina',
    'Nutrição e Hábitos',
    'Histórico de Saúde', 
    'Objetivos',
    'Medidas',
    'Fotos'
  ]

  const handleInputChange = (field: keyof AnamnesisFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (field: 'frontPhoto' | 'sidePhoto' | 'backPhoto', file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Prepare form data for submission
      const submitData = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key.endsWith('Photo') && value instanceof File) {
          submitData.append(key, value)
        } else if (Array.isArray(value)) {
          submitData.append(key, JSON.stringify(value))
        } else if (value !== null && value !== '') {
          submitData.append(key, String(value))
        }
      })
      
      const response = await fetch(`/api/anamnesis/create/${id}`, {
        method: 'POST',
        body: submitData,
      })
      
      if (response.ok) {
        router.push(`/anamnesis/success?id=${id}`)
      } else {
        throw new Error('Erro ao enviar anamnese')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao enviar anamnese. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Identificação
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                data-testid="input-name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Idade *</Label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', Number(e.target.value) || '')}
                  required
                  data-testid="input-age"
                />
              </div>
              
              <div>
                <Label>Sexo *</Label>
                <Select value={formData.sex} onValueChange={(value) => handleInputChange('sex', value)}>
                  <SelectTrigger data-testid="select-sex">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="birthDate">Data de Nascimento *</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                required
                data-testid="input-birthdate"
              />
            </div>
            
            <div>
              <Label htmlFor="profession">Profissão</Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => handleInputChange('profession', e.target.value)}
                data-testid="input-profession"
              />
            </div>
            
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                data-testid="input-email"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                data-testid="input-phone"
              />
            </div>
          </div>
        )

      case 1: // Rotina
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wakeTime">Hora que acorda *</Label>
                <Input
                  id="wakeTime"
                  type="time"
                  value={formData.wakeTime}
                  onChange={(e) => handleInputChange('wakeTime', e.target.value)}
                  required
                  data-testid="input-wake-time"
                />
              </div>
              
              <div>
                <Label htmlFor="sleepTime">Que horas dorme *</Label>
                <Input
                  id="sleepTime"
                  type="time"
                  value={formData.sleepTime}
                  onChange={(e) => handleInputChange('sleepTime', e.target.value)}
                  required
                  data-testid="input-sleep-time"
                />
              </div>
            </div>
            
            <div>
              <Label>Dificuldade para dormir *</Label>
              <RadioGroup 
                value={formData.sleepDifficulty} 
                onValueChange={(value) => handleInputChange('sleepDifficulty', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Sim" id="sleep-yes" />
                  <Label htmlFor="sleep-yes">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Não" id="sleep-no" />
                  <Label htmlFor="sleep-no">Não</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="trainTime">Qual horário para o treino *</Label>
              <Input
                id="trainTime"
                type="time"
                value={formData.trainTime}
                onChange={(e) => handleInputChange('trainTime', e.target.value)}
                required
                data-testid="input-train-time"
              />
            </div>
            
            <div>
              <Label htmlFor="trainDuration">Tempo disponível para treino + aeróbico (minutos) *</Label>
              <Input
                id="trainDuration"
                type="number"
                min="1"
                value={formData.trainDuration}
                onChange={(e) => handleInputChange('trainDuration', Number(e.target.value) || '')}
                required
                data-testid="input-train-duration"
              />
            </div>
            
            <div>
              <Label>Quantos dias pode treinar na semana? *</Label>
              <Select value={formData.trainDays} onValueChange={(value) => handleInputChange('trainDays', value)}>
                <SelectTrigger data-testid="select-train-days">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2x">2x por semana</SelectItem>
                  <SelectItem value="3x">3x por semana</SelectItem>
                  <SelectItem value="4x">4x por semana</SelectItem>
                  <SelectItem value="5x">5x por semana</SelectItem>
                  <SelectItem value="6x">6x por semana</SelectItem>
                  <SelectItem value="7x">7x por semana</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 6: // Fotos
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="frontPhoto">Foto de frente *</Label>
              <Input
                id="frontPhoto"
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => handleFileChange('frontPhoto', e.target.files?.[0] || null)}
                required
                data-testid="input-front-photo"
              />
              <p className="text-sm text-gray-500 mt-1">Apenas JPG/PNG, máximo 5MB</p>
            </div>
            
            <div>
              <Label htmlFor="sidePhoto">Foto de lado *</Label>
              <Input
                id="sidePhoto"
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => handleFileChange('sidePhoto', e.target.files?.[0] || null)}
                required
                data-testid="input-side-photo"
              />
              <p className="text-sm text-gray-500 mt-1">Apenas JPG/PNG, máximo 5MB</p>
            </div>
            
            <div>
              <Label htmlFor="backPhoto">Foto de costas *</Label>
              <Input
                id="backPhoto"
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => handleFileChange('backPhoto', e.target.files?.[0] || null)}
                required
                data-testid="input-back-photo"
              />
              <p className="text-sm text-gray-500 mt-1">Apenas JPG/PNG, máximo 5MB</p>
            </div>
          </div>
        )

      default:
        return <div>Seção em desenvolvimento...</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Ficha de Anamnese - Nutri Xpert Pro</CardTitle>
            <CardDescription>
              Passo {currentStep + 1} de {steps.length}: {steps[currentStep]}
            </CardDescription>
            
            {/* Progress bar */}
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
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                data-testid="button-previous"
              >
                Anterior
              </Button>
              
              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  data-testid="button-submit"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Anamnese'}
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                  data-testid="button-next"
                >
                  Próximo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}