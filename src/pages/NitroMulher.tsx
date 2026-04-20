import { useState } from "react";
import { Leaf, ShieldCheck, Star, BatteryCharging, Brain, Heart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const NitroMulher = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Seus dados foram enviados. Em breve você receberá as informações da farmácia mais próxima.",
        });
        form.reset();
      } else {
        throw new Error('Erro ao enviar');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar o formulário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("capture-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-rose-50 text-slate-900 font-sans selection:bg-rose-200">
      {/* Hero Section */}
      <section className="relative bg-rose-900 text-rose-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518104593124-ac2e82a5eb9b?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-rose-900 to-transparent"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-6 max-w-5xl">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-rose-800/50 border border-rose-700 text-sm font-medium tracking-wider mb-6">
              NATURE FÁCIL APRESENTA
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Pare de funcionar no limite. Encontre o seu equilíbrio.
            </h1>
            <p className="text-lg md:text-xl text-rose-100 mb-8 max-w-xl leading-relaxed">
              O suplemento <strong>Nitro Mulher</strong> foi desenvolvido para mulheres que vivem cansadas e estressadas. Recupere sua energia, foco e estabilidade hormonal no dia a dia.
            </p>
            <Button 
              onClick={scrollToForm}
              size="lg" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            >
              Quero recuperar minha vitalidade
            </Button>
          </div>
        </div>
      </section>

      {/* Value Proposition & Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-rose-900 mb-4">Por que escolher o Nitro Mulher?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Uma fórmula pensada exclusivamente para o corpo feminino, atuando nas raízes do cansaço e do estresse diário.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-rose-50 rounded-2xl p-8 text-center shadow-sm border border-rose-100">
              <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6 text-rose-600">
                <BatteryCharging size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Mais Energia Física</h3>
              <p className="text-slate-600">Combate a fadiga e o cansaço extremo, dando a disposição que você precisa para enfrentar a sua rotina.</p>
            </div>
            
            <div className="bg-rose-50 rounded-2xl p-8 text-center shadow-sm border border-rose-100">
              <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6 text-rose-600">
                <Brain size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Foco e Clareza Mental</h3>
              <p className="text-slate-600">Reduz o estresse e a névoa mental, promovendo mais concentração para suas tarefas diárias.</p>
            </div>

            <div className="bg-rose-50 rounded-2xl p-8 text-center shadow-sm border border-rose-100">
              <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6 text-rose-600">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Estabilidade Emocional</h3>
              <p className="text-slate-600">Auxilia no equilíbrio hormonal e melhora o humor, trazendo mais leveza e bem-estar para os seus dias.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section className="py-20 bg-rose-900 text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Uma fórmula que atua de dentro para fora</h2>
              <p className="text-rose-100 mb-8 text-lg">
                Combinamos ingredientes naturais de alta pureza para entregar resultados reais e duradouros na saúde da mulher.
              </p>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-emerald-500/20 p-2 rounded-full text-emerald-400">
                    <Leaf size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1">Feno Grego</h4>
                    <p className="text-rose-200 text-sm">Auxilia no equilíbrio hormonal, na melhora do desejo e vitalidade feminina.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-emerald-500/20 p-2 rounded-full text-emerald-400">
                    <Leaf size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1">L-Triptofano</h4>
                    <p className="text-rose-200 text-sm">Essencial para a produção de serotonina, melhorando o humor, o sono e reduzindo o estresse.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-emerald-500/20 p-2 rounded-full text-emerald-400">
                    <Leaf size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1">Vitamina B12</h4>
                    <p className="text-rose-200 text-sm">Combate a anemia e a sensação de fraqueza, sendo crucial para a energia celular.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-emerald-500/20 p-2 rounded-full text-emerald-400">
                    <Leaf size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1">Arginina</h4>
                    <p className="text-rose-200 text-sm">Melhora a circulação sanguínea, diminuindo a fadiga muscular e dando mais vigor físico.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square bg-rose-800 rounded-full opacity-50 absolute inset-0 blur-3xl transform scale-90"></div>
              <img 
                src="https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80" 
                alt="Ingredientes naturais" 
                className="relative z-10 rounded-2xl shadow-2xl object-cover w-full h-full max-h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Security & Quality */}
      <section className="py-16 bg-emerald-50 border-b border-emerald-100">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <ShieldCheck size={48} className="mx-auto text-emerald-600 mb-6" />
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Segurança e Qualidade Comprovadas</h2>
          <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
            Produzido em laboratório com alto padrão de segurança, o <strong>Nitro Mulher</strong> possui uma fórmula limpa e é aprovado pelas normas da ANVISA, garantindo que você consuma o que há de melhor e mais seguro.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-emerald-700 font-medium">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-100">
              <CheckCircle2 size={18} /> Fórmula Limpa
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-100">
              <CheckCircle2 size={18} /> Normas da ANVISA
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-100">
              <CheckCircle2 size={18} /> Laboratório Seguro
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-rose-900 mb-4">Mulheres que transformaram suas rotinas</h2>
            <p className="text-lg text-slate-600">Veja o que elas estão dizendo sobre o Nitro Mulher.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-rose-50 p-8 rounded-2xl shadow-sm border border-rose-100 relative">
              <div className="flex text-amber-400 mb-4">
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
              </div>
              <p className="text-slate-700 italic mb-6">"Eu acordava já exausta. Depois de 2 semanas usando o Nitro Mulher, minha disposição mudou completamente. Consigo brincar com meus filhos depois do trabalho!"</p>
              <p className="font-bold text-rose-900">- Mariana S., 34 anos</p>
            </div>

            <div className="bg-rose-50 p-8 rounded-2xl shadow-sm border border-rose-100 relative">
              <div className="flex text-amber-400 mb-4">
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
              </div>
              <p className="text-slate-700 italic mb-6">"O estresse do dia a dia estava acabando com meu humor. Sinto que agora estou muito mais equilibrada e consigo focar melhor nas minhas tarefas do escritório."</p>
              <p className="font-bold text-rose-900">- Camila F., 41 anos</p>
            </div>

            <div className="bg-rose-50 p-8 rounded-2xl shadow-sm border border-rose-100 relative">
              <div className="flex text-amber-400 mb-4">
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
              </div>
              <p className="text-slate-700 italic mb-6">"Sofria com muita névoa mental e cansaço à tarde. O suplemento me ajudou a manter a energia estável ao longo do dia todo. Recomendo muito!"</p>
              <p className="font-bold text-rose-900">- Juliana R., 29 anos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee & Usage */}
      <section className="py-16 bg-rose-100 text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h2 className="text-3xl font-bold text-rose-900 mb-6">Uso Simples, Resultados Reais</h2>
          <p className="text-xl text-slate-700 mb-8">
            Basta ingerir <strong>2 cápsulas ao dia</strong> para começar a sentir a diferença no seu corpo e na sua mente.
          </p>
          <div className="bg-white p-8 rounded-2xl shadow-md border border-rose-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Garantia de Risco Zero</h3>
            <p className="text-slate-600 mb-6">
              Temos tanta confiança na nossa fórmula que oferecemos <strong>30 dias de garantia</strong>. Se você não sentir resultados na sua energia e bem-estar, devolvemos 100% do seu dinheiro. Sem perguntas.
            </p>
            <Button 
              onClick={scrollToForm}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-8 rounded-full shadow transition-colors"
            >
              Quero experimentar agora
            </Button>
          </div>
        </div>
      </section>

      {/* Capture Form (Footer) */}
      <section id="capture-form" className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Dê o primeiro passo para o seu bem-estar</h2>
              <p className="text-slate-300 mb-6 text-lg">
                Preencha o formulário abaixo para encontrar a farmácia mais próxima que revende o <strong>Nitro Mulher</strong> e comece a sua transformação hoje mesmo.
              </p>
              <div className="flex items-center gap-3 text-rose-400">
                <CheckCircle2 size={20} />
                <span>Marca Nature Fácil</span>
              </div>
            </div>
            
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <form 
                name="capture-nitro-mulher" 
                method="POST" 
                data-netlify="true" 
                netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <input type="hidden" name="form-name" value="capture-nitro-mulher" />
                <p style={{ display: 'none' }}>
                  <label>Não preencha isso: <input name="bot-field" /></label>
                </p>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Seu Nome</label>
                  <Input 
                    id="name" 
                    name="name" 
                    required 
                    className="w-full bg-slate-900 border-slate-700 text-white placeholder:text-slate-500" 
                    placeholder="Como gostaria de ser chamada?" 
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Seu E-mail</label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    className="w-full bg-slate-900 border-slate-700 text-white placeholder:text-slate-500" 
                    placeholder="seu.melhor@email.com" 
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-slate-300 mb-1">Sua Cidade e Estado</label>
                  <Input 
                    id="city" 
                    name="city" 
                    required 
                    className="w-full bg-slate-900 border-slate-700 text-white placeholder:text-slate-500" 
                    placeholder="Ex: São Paulo - SP" 
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 rounded-lg text-lg mt-4 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Encontrar farmácia mais próxima"}
                </Button>
                <p className="text-xs text-center text-slate-500 mt-4">
                  Seus dados estão seguros conosco. Não enviamos spam.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Copyright */}
      <footer className="bg-slate-950 py-6 border-t border-slate-800 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Nature Fácil - Nitro Mulher. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default NitroMulher;