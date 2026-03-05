export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Política de Privacidade — NexusCRM</h1>
      <p className="text-xs text-muted-foreground mb-8">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-6 text-sm text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">1. Dados Coletados</h2>
          <p>Quando você conecta serviços como Google ou Meta, coletamos apenas os dados que você autoriza expressamente, incluindo: nome, e-mail, contatos, mensagens e eventos de calendário.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">2. Uso dos Dados</h2>
          <p>Seus dados são utilizados exclusivamente para:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Popular seu CRM com contatos e interações</li>
            <li>Fornecer análises de IA sobre seus leads</li>
            <li>Sincronizar comunicações entre canais</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">3. Armazenamento e Segurança</h2>
          <p>Tokens de acesso são armazenados de forma criptografada. Nenhum Client Secret é exposto no frontend. Utilizamos OAuth 2.0 com proteção CSRF (parâmetro <code>state</code>) e renovação automática de tokens.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">4. Compartilhamento</h2>
          <p>Não vendemos, compartilhamos ou transferimos seus dados para terceiros, exceto conforme necessário para operar os serviços integrados (Google, Meta).</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">5. Seus Direitos</h2>
          <p>Você pode revogar o acesso a qualquer integração a qualquer momento pela página de Integrações. Todos os dados sincronizados podem ser excluídos mediante solicitação.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">6. Contato</h2>
          <p>Para dúvidas sobre esta política, entre em contato pela plataforma NexusCRM.</p>
        </section>
      </div>
    </div>
  );
}
