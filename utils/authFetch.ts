import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/api';

export const authFetch = async (
  path: string,
  options: RequestInit = {}
): Promise<Response> => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log("token is", token);

    const headers = {
      ...(options.headers || {}),
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    return response;
  } catch (err) {
    console.error('authFetch error:', err);
    throw err;
  }
};

// token: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzUwODkzNTI1LCJleHAiOjE3NTE0OTgzMjV9.pepa6MZyflMSDcJ_b52CCdSCrc0pQ8fVMXa31CwYFoE