import { GoogleGenAI } from "@google/genai";
import { Grade, Operation, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateQuestions(grade: Grade, operation: Operation, topic?: string): Promise<Question[]> {
  const model = "gemini-3-flash-preview";
  
  let prompt = "";
  
  if (operation === 'custom_topic' && topic) {
    prompt = `${grade}-sinf o'quvchisi uchun "${topic}" mavzusiga oid 5 ta matematik test savoli tuzing. 
    Har bir savol uchun 4 ta variant bo'lsin. 
    Format JSON: [{ "id": "1", "text": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "...", "explanation": "..." }]
    Faqat JSON qaytaring.`;
  } else if (operation === 'logic_puzzles') {
    prompt = `${grade}-sinf o'quvchisi uchun 5 ta mantiqiy matematik savol (logic puzzles) tuzing. 
    Bu savollar o'quvchining mantiqiy fikrlash qobiliyatini sinashi kerak.
    Har bir savol uchun 4 ta variant (A, B, C, D) bo'lsin. 
    Format JSON: [{ "id": "1", "text": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "...", "explanation": "..." }]
    Faqat JSON qaytaring.`;
  } else if (operation === 'word_problems') {
    prompt = `${grade}-sinf o'quvchisi uchun 5 ta matematik masala (word problems) tuzing. 
    Har bir masala uchun 4 ta variant (A, B, C, D) bo'lsin. 
    Javoblar aniq bo'lsin. 
    Format JSON: [{ "id": "1", "text": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "...", "explanation": "..." }]
    Faqat JSON qaytaring.`;
  } else {
    const opMap: Record<string, string> = {
      addition: "qo'shish (+)",
      subtraction: "ayirish (-)",
      multiplication: "ko'paytirish (*)",
      division: "bo'lish (:)",
      mixed: "aralash amallar (+, -, *, :)"
    };
    
    prompt = `${grade}-sinf darajasiga mos keladigan ${opMap[operation]} amallariga oid 5 ta test savoli tuzing. 
    Har bir savol uchun 4 ta variant bo'lsin. 
    Format JSON: [{ "id": "1", "text": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "...", "explanation": "..." }]
    Faqat JSON qaytaring.`;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating questions:", error);
    // Fallback questions if AI fails
    return [
      {
        id: "fallback-1",
        text: `${grade}-sinf uchun savol yuklashda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.`,
        options: ["A", "B", "C", "D"],
        correctAnswer: "A"
      }
    ];
  }
}
