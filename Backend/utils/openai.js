 import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages: [{
        role: "user",
        content: message
      }]
    })
  };

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.log(err);
  }
};

// NEW: sends recorded audio (as a Buffer) to Groq's Whisper endpoint
// and returns the transcribed text so the frontend can drop it into the prompt box
export const getGroqTranscription = async (audioBuffer, mimetype) => {
  // FormData is needed here (not JSON) because Whisper expects multipart/form-data,
  // same as if you were uploading a file through an HTML form
  const formData = new FormData();

  // wraps the raw audio bytes into a Blob so FormData can attach it as a file field
  formData.append("file", new Blob([audioBuffer], { type: mimetype }), "audio.webm");
  formData.append("model", "whisper-large-v3-turbo");

  const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
    // NOTE: no "Content-Type" header here — fetch sets the correct
    // multipart boundary automatically when body is a FormData object
    body: formData
  });

  const data = await response.json();
  return data.text;
};

export default getOpenAIAPIResponse;