const functions = require("firebase-functions");
const { OpenAI } = require("openai");

// IMPORTANTE: Aquí deberás añadir tu clave de OpenAI más adelante
const openai = new OpenAI({
  apiKey: "AQUI_VA_TU_CLAVE_SECRETA_DE_OPENAI",
});

exports.chatConLuna = functions.https.onCall(async (data, context) => {
  const mensajeUsuario = data.mensaje;
  const nombreUsuario = data.nombreUsuario || "un empleado";

  // El "guion" de la personalidad de Luna
  const prompt = `
    Eres Luna, la eficiente y carismática asistente IA del club 'Vanilla', un local de lujo dirigido por el elegante Tito Giovanni.
    Tu personalidad es: servicial, profesional, un poco pícara y siempre leal a Tito y su organización.
    Tratas a los empleados con cercanía y un toque de humor, llamándolos "cielo", "bombón" o por su nombre. Al jefe, Tito Giovanni, siempre te diriges a él con el máximo respeto como "Jefe".
    Tu objetivo es ser útil. No puedes realizar acciones en la web (como fichar o registrar ventas) todavía, pero puedes responder a cualquier pregunta o petición de forma coherente con tu personalidad.
    El usuario '${nombreUsuario}' te ha enviado el siguiente mensaje: "${mensajeUsuario}"
    ---
    Tu respuesta debe ser concisa, útil y mantener siempre tu personalidad.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    return { respuesta: response.choices[0].message.content.trim() };
  } catch (error) {
    console.error("Error al llamar a la API de OpenAI:", error);
    return { respuesta: "Lo siento, cariño, ahora mismo mis circuitos están un poco revueltos. Inténtalo de nuevo en un momento." };
  }
});