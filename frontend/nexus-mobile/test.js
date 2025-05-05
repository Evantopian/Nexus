import axios from 'axios';

export const login = async () => {
    email = "jonathant11001@gmail.com"
    password = "starcrafts1646"
    try {
        const response = await axios.post('/login', { email, password });
        console.log('Login successful:', response.data);
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}