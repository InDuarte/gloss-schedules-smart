import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Calendar, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: number;
  category: string;
}

interface Professional {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  avatar: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export const Booking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const { toast } = useToast();

  const services: Service[] = [
    { id: 1, name: "Corte Feminino", description: "Corte moderno e personalizado", duration: "45min", price: 80, category: "Cabelo" },
    { id: 2, name: "Corte Masculino", description: "Corte tradicional ou moderno", duration: "30min", price: 50, category: "Cabelo" },
    { id: 3, name: "Coloração", description: "Tintura completa com produtos premium", duration: "2h", price: 150, category: "Cabelo" },
    { id: 4, name: "Escova", description: "Escova modeladora profissional", duration: "30min", price: 45, category: "Cabelo" },
    { id: 5, name: "Manicure", description: "Cuidado completo das unhas", duration: "45min", price: 35, category: "Unhas" },
    { id: 6, name: "Pedicure", description: "Cuidado completo dos pés", duration: "60min", price: 40, category: "Unhas" },
  ];

  const professionals: Professional[] = [
    { id: 1, name: "Ana Costa", specialty: "Especialista em Cortes Femininos", rating: 4.9, avatar: "AC" },
    { id: 2, name: "Carlos Lima", specialty: "Barbeiro Profissional", rating: 4.8, avatar: "CL" },
    { id: 3, name: "Lucia Mendes", specialty: "Nail Designer", rating: 4.9, avatar: "LM" },
    { id: 4, name: "Pedro Silva", specialty: "Colorista Expert", rating: 4.7, avatar: "PS" },
  ];

  const timeSlots: TimeSlot[] = [
    { time: "09:00", available: true },
    { time: "09:30", available: true },
    { time: "10:00", available: false },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: false },
    { time: "14:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "15:30", available: false },
    { time: "16:00", available: true },
    { time: "16:30", available: true },
  ];

  const handleConfirmBooking = () => {
    toast({
      title: "Agendamento confirmado!",
      description: `Seu horário com ${selectedProfessional?.name} está confirmado para ${selectedDate} às ${selectedTime}.`,
    });
    // Redirect to dashboard or confirmation page
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Escolha seu serviço";
      case 2: return "Escolha o profissional";
      case 3: return "Escolha data e horário";
      case 4: return "Confirme seu agendamento";
      default: return "Agendamento";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Voltar
            </Link>
            <div className="text-2xl font-bold font-display text-foreground">
              Gloss
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
                ${currentStep >= step 
                  ? "bg-accent text-accent-foreground shadow-accent" 
                  : "bg-secondary text-muted-foreground"
                }
              `}>
                {currentStep > step ? <Check className="w-5 h-5" /> : step}
              </div>
              {step < 4 && (
                <div className={`
                  w-16 h-1 mx-2 transition-all duration-300
                  ${currentStep > step ? "bg-accent" : "bg-secondary"}
                `} />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground font-display mb-2">
            {getStepTitle()}
          </h1>
          <p className="text-muted-foreground">
            Passo {currentStep} de 4
          </p>
        </div>

        {/* Step 1: Choose Service */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className={`
                  cursor-pointer shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1
                  ${selectedService?.id === service.id ? "ring-2 ring-accent shadow-accent" : ""}
                `}
                onClick={() => setSelectedService(service)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground font-display">
                        {service.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {service.description}
                      </p>
                    </div>
                    <Badge variant="secondary">{service.category}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration}
                    </div>
                    <div className="text-2xl font-bold text-accent">
                      R$ {service.price}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Step 2: Choose Professional */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {professionals.map((professional) => (
              <Card
                key={professional.id}
                className={`
                  cursor-pointer shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1
                  ${selectedProfessional?.id === professional.id ? "ring-2 ring-accent shadow-accent" : ""}
                `}
                onClick={() => setSelectedProfessional(professional)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-xl">
                      {professional.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground font-display">
                        {professional.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {professional.specialty}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-accent font-semibold">★ {professional.rating}</span>
                        <span className="text-muted-foreground text-sm ml-2">(124 avaliações)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Step 3: Choose Date & Time */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="font-display">Selecione a Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {/* Simplified calendar - in a real app, use a proper calendar component */}
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <button
                      key={day}
                      className={`
                        p-4 rounded-lg border transition-all duration-200
                        ${selectedDate === `2024-01-${day + 14}` 
                          ? "bg-accent text-accent-foreground border-accent" 
                          : "bg-card hover:bg-secondary border-border"
                        }
                      `}
                      onClick={() => setSelectedDate(`2024-01-${day + 14}`)}
                    >
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">
                          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][day - 1]}
                        </div>
                        <div className="font-semibold">{day + 14}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedDate && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="font-display">Horários Disponíveis</CardTitle>
                  <CardDescription>Selecione o melhor horário para você</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        className={`
                          p-3 rounded-lg border transition-all duration-200 font-semibold
                          ${!slot.available 
                            ? "bg-muted text-muted-foreground border-border cursor-not-allowed" 
                            : selectedTime === slot.time
                              ? "bg-accent text-accent-foreground border-accent shadow-accent"
                              : "bg-card hover:bg-secondary border-border hover:border-accent"
                          }
                        `}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <Card className="shadow-strong max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-display">Confirme seu Agendamento</CardTitle>
              <CardDescription>Revise os detalhes antes de confirmar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-secondary p-6 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Serviço</span>
                  <span className="font-semibold text-foreground">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Profissional</span>
                  <span className="font-semibold text-foreground">{selectedProfessional?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Data</span>
                  <span className="font-semibold text-foreground">{selectedDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Horário</span>
                  <span className="font-semibold text-foreground">{selectedTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Duração</span>
                  <span className="font-semibold text-foreground">{selectedService?.duration}</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-accent">R$ {selectedService?.price}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleConfirmBooking}
                variant="accent"
                size="lg"
                className="w-full shadow-accent"
              >
                Confirmar Agendamento
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="minimal"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Voltar
          </Button>

          {currentStep < 4 ? (
            <Button
              variant="accent"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={
                (currentStep === 1 && !selectedService) ||
                (currentStep === 2 && !selectedProfessional) ||
                (currentStep === 3 && (!selectedDate || !selectedTime))
              }
            >
              Continuar
            </Button>
          ) : null}
        </div>
      </main>
    </div>
  );
};