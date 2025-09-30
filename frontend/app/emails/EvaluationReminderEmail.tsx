import React from 'react';

interface EvaluationReminderEmailProps {
  clientName: string;
  evaluationUrl: string;
  validityDays: number;
}

const EvaluationReminderEmail: React.FC<EvaluationReminderEmailProps> = ({
  clientName,
  evaluationUrl,
  validityDays,
}) => {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Lembrete de Avaliação Nutricional</title>
        <style>
          {`
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              background-color: #4CAF50;
              color: #ffffff;
              padding: 10px 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              padding: 20px;
            }
            .button {
              display: inline-block;
              background-color: #4CAF50;
              color: #ffffff;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 0.8em;
              color: #777777;
            }
          `}
        </style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h2>Nutri Xpert Pro</h2>
          </div>
          <div className="content">
            <p>Olá <strong>{clientName}</strong>,</p>
            <p>Este é um lembrete para preencher seu formulário de avaliação nutricional quinzenal.</p>
            <p>Por favor, clique no link abaixo para acessar o formulário:</p>
            <p style={{ textAlign: 'center', margin: '20px 0' }}>
              <a href={evaluationUrl} className="button">
                Acessar Formulário de Avaliação
              </a>
            </p>
            <p>Ou copie e cole o link no seu navegador:</p>
            <p><a href={evaluationUrl}>{evaluationUrl}</a></p>
            <p>Este link é válido por {validityDays} dias.</p>
            <p>Atenciosamente,</p>
            <p>Sua equipe Nutri Xpert Pro</p>
          </div>
          <div className="footer">
            <p>&copy; {new Date().getFullYear()} Nutri Xpert Pro. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default EvaluationReminderEmail;
