import React from 'react';

// Define a type for the client prop
interface ClientReportProps {
  client: any; // Replace 'any' with a more specific type for your client data
}

export const ClientReport: React.FC<ClientReportProps> = ({ client }) => {
  return (
    <html>
      <head>
        <style>
          {`
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
            }
            h1, h2, h3 {
              color: #333;
            }
            .section {
              margin-bottom: 20px;
            }
            .client-info, .evaluation, .diet {
              border: 1px solid #eee;
              padding: 15px;
              border-radius: 5px;
            }
            .client-info h2 {
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .photos {
              display: flex;
              gap: 10px;
              margin-top: 10px;
            }
            .photos img {
              max-width: 200px;
              border: 1px solid #ddd;
            }
          `}
        </style>
      </head>
      <body>
        <h1>Relatório do Paciente</h1>
        
        <div className="section client-info">
          <h2>{client.name}</h2>
          <p><strong>Email:</strong> {client.email}</p>
          {client.phone && <p><strong>Telefone:</strong> {client.phone}</p>}
          {client.birthDate && <p><strong>Data de Nascimento:</strong> {new Date(client.birthDate).toLocaleDateString()}</p>}
          {client.age && <p><strong>Idade:</strong> {client.age}</p>}
          {client.sex && <p><strong>Sexo:</strong> {client.sex}</p>}
          {client.profession && <p><strong>Profissão:</strong> {client.profession}</p>}
          {client.notes && <p><strong>Notas:</strong> {client.notes}</p>}
        </div>

        {client.anamnesis && client.anamnesis.length > 0 && (
          <div className="section">
            <h3>Anamnese</h3>
            {client.anamnesis.map((anamnesis: any, index: number) => (
              <div key={index} className="anamnesis-item">
                <h4>Anamnese #{index + 1} - {new Date(anamnesis.createdAt).toLocaleDateString()}</h4>
                <p><strong>Hora de Acordar:</strong> {anamnesis.wakeTime}</p>
                <p><strong>Hora de Dormir:</strong> {anamnesis.sleepTime}</p>
                <p><strong>Dificuldade para Dormir:</strong> {anamnesis.sleepDifficulty}</p>
                <p><strong>Horário de Treino:</strong> {anamnesis.trainTime}</p>
                <p><strong>Duração do Treino:</strong> {anamnesis.trainDuration} min</p>
                <p><strong>Dias de Treino:</strong> {anamnesis.trainDays}</p>
                <p><strong>Peso:</strong> {anamnesis.weight} kg</p>
                <p><strong>Altura:</strong> {anamnesis.height} cm</p>
                <p><strong>Tendência de Peso:</strong> {anamnesis.weightTrend}</p>
                <p><strong>Alimentos Restritos:</strong> {anamnesis.restrictedFoods}</p>
                <p><strong>Dieta Anterior:</strong> {anamnesis.previousDiet}</p>
                <p><strong>Resultado da Dieta Anterior:</strong> {anamnesis.dietResult}</p>
                <p><strong>Função Intestinal:</strong> {anamnesis.intestineFunction}</p>
                <p><strong>Dias sem ir ao Banheiro:</strong> {anamnesis.daysWithoutBathroom}</p>
                <p><strong>Frequência ao Banheiro:</strong> {anamnesis.bathroomFrequency} vezes/dia</p>
                <p><strong>Ingestão de Água:</strong> {anamnesis.waterIntake} L</p>
                <p><strong>Desejo por Doces (0-10):</strong> {anamnesis.sweetCravings}</p>
                <p><strong>Horários de Fome:</strong> {anamnesis.hungerTimes}</p>
                <p><strong>Preferência de Lanche:</strong> {anamnesis.snackPreference}</p>
                <p><strong>Frutas Favoritas:</strong> {anamnesis.favoriteFruits}</p>
                <p><strong>Histórico Familiar:</strong> {anamnesis.familyHistory}</p>
                <p><strong>Problemas de Saúde:</strong> {anamnesis.healthProblems}</p>
                <p><strong>Detalhes dos Problemas de Saúde:</strong> {anamnesis.healthProblemsDetails}</p>
                <p><strong>Problemas Articulares:</strong> {anamnesis.jointProblems}</p>
                <p><strong>Medicamentos:</strong> {anamnesis.medications}</p>
                <p><strong>Detalhes dos Medicamentos:</strong> {anamnesis.medicationsDetails}</p>
                <p><strong>Fumante:</strong> {anamnesis.smoking}</p>
                <p><strong>Intolerância a Medicamentos:</strong> {anamnesis.medicationIntolerance}</p>
                <p><strong>Detalhes da Intolerância:</strong> {anamnesis.intoleranceDetails}</p>
                <p><strong>Anticoncepcional:</strong> {anamnesis.contraceptive}</p>
                <p><strong>Termogênicos:</strong> {anamnesis.thermogenics}</p>
                <p><strong>Álcool:</strong> {anamnesis.alcohol}</p>
                <p><strong>Frequência de Álcool:</strong> {anamnesis.alcoholFrequency} vezes/semana</p>
                <p><strong>Anabolizantes:</strong> {anamnesis.anabolics}</p>
                <p><strong>Problemas com Anabolizantes:</strong> {anamnesis.anabolicsProblems}</p>
                <p><strong>Anabolizantes Futuros:</strong> {anamnesis.futureAnabolics}</p>
                <p><strong>Objetivo:</strong> {anamnesis.goal}</p>
                <p><strong>Comprometimento:</strong> {anamnesis.commitment}</p>
                <p><strong>Pescoço:</strong> {anamnesis.neck} cm</p>
                <p><strong>Cintura:</strong> {anamnesis.waist} cm</p>
                <p><strong>Quadril:</strong> {anamnesis.hip} cm</p>
                {anamnesis.foto_frente && <p><strong>Foto Frontal:</strong> <img src={anamnesis.foto_frente} alt="Foto Frontal" style={{ maxWidth: '200px' }} /></p>}
              </div>
            ))}
          </div>
        )}

        <div className="section">
          <h3>Histórico de Avaliações</h3>
          {client.evaluations.map((evaluation: any, index: number) => (
            <div key={index} className="evaluation">
              <h4>Avaliação #{index + 1} - {new Date(evaluation.createdAt).toLocaleDateString()}</h4>
              <p><strong>Peso:</strong> {evaluation.weight} kg</p>
              <p><strong>Altura:</strong> {evaluation.height} cm</p>
              <p><strong>Percentual de Gordura:</strong> {evaluation.bodyFatPercentage}%</p>
              <div className="photos">
                {evaluation.photos.map((photo: any, photoIndex: number) => (
                  <img key={photoIndex} src={photo.url} alt={`Foto ${photoIndex + 1}`} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {client.diets && client.diets.length > 0 && (
          <div className="section">
            <h3>Planos Alimentares</h3>
            {client.diets.map((diet: any, index: number) => (
              <div key={index} className="diet">
                <h4>Dieta #{index + 1} - {diet.name} ({new Date(diet.createdAt).toLocaleDateString()})</h4>
                {diet.description && <p><strong>Descrição:</strong> {diet.description}</p>}
                {diet.totalCalories && <p><strong>Total de Calorias:</strong> {diet.totalCalories} kcal</p>}
                {diet.totalProtein && <p><strong>Total de Proteínas:</strong> {diet.totalProtein} g</p>}
                {diet.totalCarbs && <p><strong>Total de Carboidratos:</strong> {diet.totalCarbs} g</p>}
                {diet.totalFat && <p><strong>Total de Gorduras:</strong> {diet.totalFat} g</p>}
                {/* You might want to render mealStructure in a more structured way */}
                {diet.mealStructure && (
                  <div>
                    <h5>Estrutura das Refeições:</h5>
                    <pre>{JSON.stringify(diet.mealStructure, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </body>
    </html>
  );
};
