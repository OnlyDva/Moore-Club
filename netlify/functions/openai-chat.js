// netlify/functions/openai-chat.js
import { OpenAI } from 'openai'; // Usamos 'import' en lugar de 'require'

export async function handler(event) { // Exportamos la función de forma moderna
  // Asegúrate de que solo se acepten peticiones POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  // Asegúrate de que la clave API esté disponible
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    console.error('OPENAI_API_KEY no está configurada en las variables de entorno de Netlify.');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Configuración del servidor incorrecta.' }),
    };
  }

  const openai = new OpenAI({ apiKey: openaiApiKey });

  try {
    const { messages, model } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages) || messages.length === 0 || !model) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Formato de petición inválido. Se requieren "messages" y "model".' }),
      };
    }

    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.7,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ result: completion.choices[0].message.content }),
    };

  } catch (error) {
    console.error('Error al llamar a la API de OpenAI:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Error interno del servidor.' }),
    };
  }
}
