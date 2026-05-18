const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

const apiKey = process.env.GEMINI_API_KEY || 'DUMMY_KEY_FOR_SERVERLESS_BOOT';
const ai = new GoogleGenAI({ apiKey });

/**
 * Extracts expense details from an image buffer or file path.
 * @param {string} imagePath - The path to the uploaded image file.
 * @param {string} mimeType - The mime type of the image.
 * @returns {Promise<Object>} - The extracted expense details.
 */
const extractExpenseDetails = async (fileBuffer, mimeType, originalName) => {
  try {
    const fileBytes = fileBuffer;
    
    // Resolve mimeType unconditionally based on file extension so Gemini can always process it
    const ext = path.extname(originalName).toLowerCase();
    let resolvedMimeType = 'image/jpeg'; // Default fallback
    if (ext === '.webp') resolvedMimeType = 'image/webp';
    else if (ext === '.png') resolvedMimeType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') resolvedMimeType = 'image/jpeg';

    const prompt = `
      Analyze this bill/receipt image and extract the key receipt details.
      Respond only with a JSON object that adheres exactly to the required schema.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: fileBytes.toString("base64"), mimeType: resolvedMimeType } },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            vendorName: { type: 'STRING', description: "Name of the merchant, store, or service provider. If not found, use 'Unknown'" },
            date: { type: 'STRING', description: "Date of transaction in YYYY-MM-DD format. If not found, use today's date" },
            totalAmount: { type: 'NUMBER', description: "The total final amount paid (number). If not found, use 0" },
            category: { 
              type: 'STRING', 
              enum: ['Food', 'Travel', 'Utilities', 'Entertainment', 'Other'],
              description: "The category that best fits the purchase"
            },
            paymentMethod: { 
              type: 'STRING', 
              enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Other'],
              description: "The payment method used" 
            },
            expenseType: { 
              type: 'STRING', 
              enum: ['Personal', 'Business'],
              description: "Whether the expense is Personal or Business related" 
            }
          },
          required: ['vendorName', 'date', 'totalAmount', 'category', 'paymentMethod', 'expenseType']
        }
      }
    });

    const responseText = response.text;
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Error extracting details with Gemini:', error);
    throw new Error('Failed to extract details from image');
  }
};

module.exports = { extractExpenseDetails };
