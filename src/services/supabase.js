import { URL, KEY } from '../environment.js';
export { fetchTech };

async function fetchTech() {
    try {
        const response = await fetch(URL + "technique_details?select=*", {
            method: 'GET',
            headers: {
                "apiKey": KEY,
                "Authorization": "Bearer " + KEY
            }
        });
        
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        throw error;
    }
}
