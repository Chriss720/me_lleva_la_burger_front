import axios from 'axios';

(async () => {
  const API = process.env.VITE_API_URL || 'http://localhost:3000';
  console.log('Using API base URL:', API);

  try {
    // 1) Register a new user
    const rand = Date.now();
    const email = `e2e_${rand}@example.com`;
    const password = 'Pass1234!';

    console.log('\n1) Registering user', email);
    const regResp = await axios.post(`${API}/customer`, {
      nombre_cliente: 'E2E',
      apellido_cliente: 'Test',
      correo_cliente: email,
      contrasena_cliente: password,
      telefono_cliente: '00000000',
      direccion: 'Calle E2E 1',
      estado_cliente: 'activo'
    }, { headers: { 'Content-Type': 'application/json' } });

    console.log('  Registration response status:', regResp.status);

    // 2) Login
    console.log('\n2) Logging in');
    // Use the customer-specific login DTO which expects correo_cliente + contrasena_cliente
    const loginResp = await axios.post(`${API}/auth/login/customer`, {
      correo_cliente: email,
      contrasena_cliente: password,
    }, { headers: { 'Content-Type': 'application/json' } });

    console.log('  Login status:', loginResp.status);
    const loginData = loginResp.data && (loginResp.data.data || loginResp.data);
    const token = loginData.token || loginData.access_token || (loginResp.data && (loginResp.data.token || loginResp.data.access_token));
    const user = loginData.usuario || loginData.user || loginResp.data.usuario || loginResp.data.user || loginData;
    if (!token) {
      console.error('  No token returned by login. Full login response:', loginResp.data);
      process.exit(1);
    }
    console.log('  Token received, user id:', user?.id || user?.id_cliente || user?.id_cliente || user?.id || '(unknown)');

    const authHeader = { Authorization: `Bearer ${token}` };

    // 3) Get all products
    console.log('\n3) Fetching products');
    const productsResp = await axios.get(`${API}/all-products`);
    const products = productsResp.data && (productsResp.data.data || productsResp.data) || [];
    console.log('  Found products count:', products.length);
    if (!products.length) {
      console.error('  No products available to add to cart. Aborting E2E.');
      process.exit(1);
    }

    const firstProduct = products[0];
    const productId = firstProduct.id_producto || firstProduct.id || firstProduct.idProduct || firstProduct.id_producto;
    console.log('  Using product id:', productId, 'name:', firstProduct.nombre_producto || firstProduct.name || firstProduct.nombre);

    // 4) Get my cart (may return array or object)
    console.log('\n4) Fetching my cart (/carts/me)');
    const cartResp = await axios.get(`${API}/carts/me`, { headers: authHeader });
    let cartData = cartResp.data && (cartResp.data.data || cartResp.data);
    // handle array case
    if (Array.isArray(cartData)) {
      cartData = cartData[0];
    }
    if (!cartData) {
      console.error('  /carts/me did not return cart data. Full response:', cartResp.data);
      process.exit(1);
    }
    const cartId = cartData.id_carrito || cartData.id || cartData.idCarrito || cartData.id_carrito;
    console.log('  Cart id:', cartId);

    // 5) Add product to cart
    console.log('\n5) Adding product to cart');
    // Endpoint can be POST /carts/:id/add/:productId  or /carts/:id/add with body {id_producto,cantidad}
    let addResp;
    try {
      addResp = await axios.post(`${API}/carts/${cartId}/add/${productId}`, { cantidad: 1 }, { headers: { ...authHeader, 'Content-Type': 'application/json' } });
    } catch (err) {
      // fallback to body-style
      console.log('  Fallback: trying POST /carts/' + cartId + '/add with body');
      addResp = await axios.post(`${API}/carts/${cartId}/add`, { id_producto: productId, cantidad: 1 }, { headers: { ...authHeader, 'Content-Type': 'application/json' } });
    }
    console.log('  Add to cart status:', addResp.status);

    // 6) Inspect cart items
    console.log('\n6) Re-fetching cart to verify item');
    const cartResp2 = await axios.get(`${API}/carts/${cartId}`, { headers: authHeader });
    const cartAfter = cartResp2.data && (cartResp2.data.data || cartResp2.data);
    const items = cartAfter?.items || cartAfter?.cartProducts || cartAfter?.cart_productos || [];
    console.log('  Cart items count:', items.length);

    // 7) Checkout
    console.log('\n7) Performing checkout');
    const checkoutResp = await axios.post(`${API}/carts/${cartId}/checkout`, {}, { headers: authHeader });
    console.log('  Checkout status:', checkoutResp.status);
    console.log('  Checkout response:', checkoutResp.data);

    console.log('\nE2E script completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('\nE2E script failed:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Response data:', err.response.data);
    } else {
      console.error(err.message);
    }
    process.exit(2);
  }
})();
