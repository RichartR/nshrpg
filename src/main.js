import { renderHeader } from './components/header';

//eslint-disable-next-line
//import * as bulma from 'bulma';

document.addEventListener('DOMContentLoaded', () => {
  
  const app = document.querySelector('#app');
  const header = document.querySelector('#header');
  const footer = document.querySelector('#footer');

  const URL = "https://xcaoefgporrjzlirttaz.supabase.co/rest/v1/navigation_menu";
  const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjYW9lZmdwb3JyanpsaXJ0dGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1OTc2NjQsImV4cCI6MjA3NjE3MzY2NH0.Ju9E4JYmn41QrKkmPVaYQq9odhhEDx0JmqtHA_0-NeI";

  /* const data = {
    "name": "Raton",
    "price": 15
  }; */
  renderHeader().then(data => header.innerHTML = data);
  
  //header.innerHTML = renderHeader();

  //obtenerDatos(URL, KEY, header);
  
  //updateDatos(URL, KEY, data, 6);



})

async function obtenerDatos(URL, KEY) {
    try {
        const response = await fetch(URL + "?select=*", {
            method: 'GET',
            headers: {
                "apiKey": KEY,
                "Authorization": "Bearer " + KEY
            }
        });
        
        const data = await response.json();
        console.log(data);
        
        
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        throw error; // Opcional: re-lanzar el error para que lo maneje quien llame a la función
    }
}

function insertDatos(URL, KEY, data){
  (()=>{
    fetch(URL, {
        method: 'POST',
        headers: {
            "apiKey": KEY,
            "Content-Type": "application/json",
            "Authorization": "Bearer " + KEY,
            "Prefer": "return=representation"
        },
        body: JSON.stringify(data)
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
    });
  })();
}

function updateDatos(URL, KEY, data, id){
  (()=>{
    fetch(URL  + `?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
            "apiKey": KEY,
            "Content-Type": "application/json",
            "Authorization": "Bearer " + KEY,
            "Prefer": "return=representation"
        },
        body: JSON.stringify(data)
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
    });
  })();
}

async function uploadImage(projectUrl, KEY, imageBlob, bucket = 'image-test', fileName = 'image.png') {
  const headersFile = {
    apiKey: KEY,
    Authorization: `Bearer ${KEY}`,
    'x-upsert': 'true'
  };

  const formData = new FormData();
  formData.append('file', imageBlob, fileName);

  const response = await fetch(`${projectUrl}/storage/v1/object/${bucket}/${fileName}`, {
    method: 'POST',
    headers: headersFile, // do not set Content-Type when sending FormData
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}