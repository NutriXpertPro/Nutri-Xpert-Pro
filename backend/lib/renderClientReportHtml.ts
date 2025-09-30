// Função utilitária para gerar HTML do relatório do cliente sem JSX
export function renderClientReportHtml(client: any): string {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1, h2, h3 { color: #333; }
          .section { margin-bottom: 20px; }
          .client-info, .evaluation, .diet { border: 1px solid #eee; padding: 15px; border-radius: 5px; }
          .client-info h2 { border-bottom: 2px solid #333; padding-bottom: 10px; }
          .photos { display: flex; gap: 10px; margin-top: 10px; }
          .photos img { max-width: 200px; border: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <h1>Relatório do Paciente</h1>
        <div class="section client-info">
          <h2>${client.name}</h2>
          <p><strong>Email:</strong> ${client.email}</p>
        </div>
        <div class="section">
          <h3>Histórico de Avaliações</h3>
          ${(client.evaluations || []).map((evaluation: any, index: number) => `
            <div class="evaluation">
              <h4>Avaliação #${index + 1} - ${new Date(evaluation.createdAt).toLocaleDateString()}</h4>
              <p><strong>Peso:</strong> ${evaluation.weight} kg</p>
              <p><strong>Altura:</strong> ${evaluation.height} cm</p>
              <p><strong>Percentual de Gordura:</strong> ${evaluation.bodyFatPercentage}%</p>
              <div class="photos">
                ${(evaluation.photos || []).map((photo: any, photoIndex: number) => `<img src="${photo.url}" alt="Foto ${photoIndex + 1}" />`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        ${client.diet ? `
          <div class="section diet">
            <h3>Plano Alimentar</h3>
            <p>${client.diet.content}</p>
          </div>
        ` : ''}
      </body>
    </html>
  `;
}
