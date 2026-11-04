import { Product, Promotion, ChatResponse, HealthStatus } from '../types';

// Base URL for our FastAPI backend
const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Checks the health status of the backend API.
 */
export async function checkApiHealth(): Promise<HealthStatus> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
}

/**
 * Fetches the active musical instruments catalog from the backend.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const data = await response.json();
    // Handles FastAPI response wrapper if products are returned inside an object or array
    return Array.isArray(data) ? data : data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetches active promotions from the backend.
 */
export async function getPromotions(): Promise<Promotion[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/promotions`);
    if (!response.ok) {
      throw new Error(`Failed to fetch promotions: ${response.statusText}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : data.promotions || [];
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }
}

/**
 * Sends a user message to the Gemini AI Agent and returns the response.
 */
export async function sendChatMessage(message: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`AI Chat request failed: ${response.statusText}`);
    }

    const data: ChatResponse = await response.json();
    return data.reply || 'Desculpe, ocorreu um erro ao processar sua resposta.';
  } catch (error) {
    console.error('Error communicating with AI agent:', error);
    throw new Error('Não foi possível conectar ao assistente virtual no momento.');
  }
}