/**
 * Test script para verificar la lógica de login de empleados vs clientes
 * Ejecutar: node scripts/test-login.mjs
 */

// Simular respuestas del servidor
const mockLoginResponses = {
  client: {
    access_token: 'client_token_123',
    usuario: {
      id: 1,
      nombre_cliente: 'Juan',
      apellido_cliente: 'Pérez',
      correo_cliente: 'juan@example.com',
      rol_cliente: 'cliente'
    }
  },
  employee: {
    access_token: 'employee_token_456',
    usuario: {
      id: 2,
      nombre_cliente: 'María',
      apellido_cliente: 'González',
      correo_cliente: 'maria@example.com',
      rol_cliente: 'empleado'
    }
  }
};

// Función para simular el login
function simulateLogin(credentials, userType) {
  console.log(`\n📝 Login attempt with ${userType}:`);
  console.log('Credentials:', credentials);

  const response = mockLoginResponses[userType];
  const data = response;
  const user = data.usuario;

  console.log('✅ Response received:', user);

  // Verificar redirección
  const isEmployee = user && (
    user.rol_cliente === 'empleado' ||
    user.rol === 'empleado' ||
    user.role === 'employee' ||
    user.rol_cliente === 'admin' ||
    user.rol === 'admin'
  );

  console.log('👤 Is Employee:', isEmployee);
  console.log('🔄 Should redirect to:', isEmployee ? '/admin/dashboard' : '/');

  return { isEmployee, user };
}

// Pruebas
console.log('='.repeat(60));
console.log('🧪 TESTING LOGIN LOGIC');
console.log('='.repeat(60));

// Test 1: Cliente normal
const testClient = simulateLogin(
  { correo_cliente: 'juan@example.com', contrasena_cliente: 'pass123' },
  'client'
);

// Test 2: Empleado
const testEmployee = simulateLogin(
  { correo_cliente: 'maria@example.com', contrasena_cliente: 'pass456' },
  'employee'
);

// Verificaciones
console.log('\n' + '='.repeat(60));
console.log('✅ TEST RESULTS');
console.log('='.repeat(60));

const clientTest = testClient.isEmployee === false;
const employeeTest = testEmployee.isEmployee === true;

console.log(`Client should NOT be employee: ${clientTest ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Employee should be employee: ${employeeTest ? '✅ PASS' : '❌ FAIL'}`);

if (clientTest && employeeTest) {
  console.log('\n🎉 ALL TESTS PASSED!');
} else {
  console.log('\n⚠️ SOME TESTS FAILED!');
  process.exit(1);
}
