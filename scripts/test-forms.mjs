#!/usr/bin/env node

const API_BASE = 'http://localhost:3000';

// Test 1: Register with correct field names
async function testRegister() {
  console.log('\n=== Testing Register ===');
  try {
    const email = `user${Date.now()}@example.com`;
    const response = await fetch(`${API_BASE}/customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre_cliente: 'Test',
        apellido_cliente: 'User',
        correo_cliente: email,
        contrasena_cliente: 'password123',
        telefono_cliente: '1234567890',
        direccion: 'Test Address',
        estado_cliente: 'activo',
      }),
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      return { email, password: 'password123' };
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  return null;
}

// Test 2: Login with correct field names
async function testLogin(email, password) {
  console.log('\n=== Testing Login ===');
  try {
    const response = await fetch(`${API_BASE}/auth/login/customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        correo_cliente: email,
        contrasena_cliente: password,
      }),
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      const token = data.data?.access_token || data.access_token;
      return token;
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  return null;
}

// Test 3: Get products with token
async function testGetProducts(token) {
  console.log('\n=== Testing Get Products ===');
  try {
    const response = await fetch(`${API_BASE}/all-products`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Number of products:', data.data?.length || data.length || 0);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run tests
async function main() {
  console.log('Starting form validation tests...');
  console.log('API Base:', API_BASE);
  
  const credentials = await testRegister();
  if (credentials) {
    const token = await testLogin(credentials.email, credentials.password);
    if (token) {
      console.log('✓ Login successful, token:', token.substring(0, 20) + '...');
      await testGetProducts(token);
    } else {
      console.log('✗ Login failed');
    }
  } else {
    console.log('✗ Register failed');
  }
  
  console.log('\n=== Test Complete ===');
}

main().catch(console.error);
