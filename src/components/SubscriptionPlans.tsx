
import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SubscriptionPlansProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const plans = [
  {
    name: "Básico",
    price: "R$ 29,90",
    period: "/mês",
    popular: false,
    features: [
      "Até 50 clientes",
      "Agendamentos ilimitados",
      "1 usuário",
      "Suporte por email",
    ],
    limitations: [
      "Sem relatórios avançados",
      "Sem integração WhatsApp",
    ],
    paymentLink: "#",
  },
  {
    name: "Profissional",
    price: "R$ 59,90",
    period: "/mês",
    popular: true,
    features: [
      "Clientes ilimitados",
      "Agendamentos ilimitados",
      "Até 3 usuários",
      "Integração WhatsApp",
      "Relatórios avançados",
      "Suporte prioritário",
    ],
    limitations: [],
    paymentLink: "#",
  },
  {
    name: "Premium",
    price: "R$ 99,90",
    period: "/mês",
    popular: false,
    features: [
      "Tudo do Profissional",
      "Usuários ilimitados",
      "API personalizada",
      "Backup automático",
      "Suporte 24/7",
      "Personalização avançada",
    ],
    limitations: [],
    paymentLink: "#",
  },
];

const SubscriptionPlans = ({ open, onOpenChange }: SubscriptionPlansProps) => {
  const handlePayment = (paymentLink: string) => {
    // Aqui você integraria com o sistema de pagamento
    console.log("Redirecionando para pagamento:", paymentLink);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-slate-800 border-slate-700 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Escolha seu Plano
          </DialogTitle>
          <DialogDescription className="text-center text-slate-300">
            Selecione o plano que melhor atende às suas necessidades
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg border p-6 ${
                plan.popular
                  ? "border-blue-500 bg-slate-700"
                  : "border-slate-600 bg-slate-750"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                  Mais Popular
                </Badge>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-blue-400">
                    {plan.price}
                  </span>
                  <span className="text-slate-400 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation) => (
                  <li key={limitation} className="flex items-center">
                    <X className="h-4 w-4 text-red-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-400">{limitation}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handlePayment(plan.paymentLink)}
                className={`w-full ${
                  plan.popular
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-600 hover:bg-slate-500 text-blue-300"
                }`}
              >
                Assinar {plan.name}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionPlans;
