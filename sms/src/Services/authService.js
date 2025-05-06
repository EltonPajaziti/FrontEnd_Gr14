const API_URL = "";
const login = async (email, password) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      throw new Error('The credentials are incorrect.');
    }
    const data = await response.json();
    return data.token;
    };
    export default { login };