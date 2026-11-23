// Elementos del Dom-Personajes.
const form = document.getElementById('form') as HTMLFormElement;
const input = document.getElementById('buscar') as HTMLInputElement;
const generoSelect = document.getElementById('filtroGenero') as HTMLSelectElement;
const estadoSelect = document.getElementById('filtroEstado') as HTMLSelectElement;
const personajes = document.getElementById('personajes') as HTMLElement;
const containerPersonajes = document.getElementById('container-personajes') as HTMLDivElement;
const btnPersonajes = document.getElementById('btn-personajes') as HTMLButtonElement;

// Funciones y elementos importadas.
import {
    visualizarPersonajeRandom, getFavoritos, guardarFavoritos, quitarFavoritos, 
    expandirInformacion, comprobarFavoritos, Objeto, UrlPersonajes, svgImg
} from './utilidades';

// Gif de carga de datos.
let spinner = document.createElement('img');
spinner.src = '../src/img/comun/Spinnergreen.gif';
spinner.classList.add('spinner');

// Interface de filtrado.
interface Filtro{
    nombre?: string
    estado?: string;
    genero?: string;
}

// Variables.
let filtro: Filtro = {};
let contador: number = 0;

// Función de visualización de personajes al cargar pg.
async function llamarVisualizacion() {
    for (let i = 0; i < 4; i++){
        let newArticle = document.createElement('article') as HTMLElement;
        newArticle = await visualizarPersonajeRandom();
        personajes.appendChild(newArticle);
    };
};

// Función generadora de URL para filtrar personajes.
async function urlFiltro(filtro : Filtro){
    let urlFiltro  = '';
    let valores = Object.values(filtro);
    let keys = Object.keys(filtro);
    if(Object.keys(filtro).length === 1){
        if(keys[0] === 'nombre'){
            urlFiltro = `?name=${valores[0]}`
        }else if(keys[0] === 'estado'){
            urlFiltro = `?status=${valores[0]}`
        }else{
            urlFiltro = `?gender=${valores[0]}`
        }; 
    }else if(Object.keys(filtro).length === 2){
        if(keys[0] === 'nombre' && keys[1] === 'estado'){
            urlFiltro = `?name=${valores[0]}&status=${valores[1]}`
        }else if(keys[0] === 'nombre' && keys[1] === 'genero'){
            urlFiltro = `?name=${valores[0]}&gender=${valores[1]}`
        }else if(keys[0] === 'estado' && keys[1] === 'genero'){
            urlFiltro = `?status=${valores[0]}&gender=${valores[1]}`
        };
    }else{
        urlFiltro = `?name=${valores[0]}&status=${valores[1]}&gender=${valores[2]}`
    };
    visualizarFiltros(urlFiltro);
};

// Funsión de petición con filtros.
async function getPersonajesFiltrados(filtro:string){
    try {
        let response = await fetch(`${UrlPersonajes}/${filtro}`);
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }catch (error){
        let newP = document.createElement('p') as HTMLParagraphElement;
        newP.innerText = `Error al obtener los datos: ${error}`;
        return newP;
    };
};

// Funciones de visualización de personajes filtrados.
async function personajesFiltrados(filtro : string){
    const personajesObjet = await getPersonajesFiltrados(filtro);
   if(personajesObjet.hasOwnProperty('results')){
        return personajesObjet.results;
    }else{
        let newP = document.createElement('p') as HTMLParagraphElement;
        newP.innerHTML = 'Error en la busqueda, el personaje no existe en la base de datos.';
        return newP;
    };
};

async function visualizarFiltros(filtro : string) {
    let respuesta = await personajesFiltrados(filtro);
    if (respuesta.tagName === 'P'){
        personajes.appendChild(respuesta);
    }else{
        if(contador < respuesta.length){
            for (let i = contador; i <  Math.min(contador + 4, respuesta.length); i++){
                let newArticle = document.createElement('article') as HTMLElement;
                newArticle.classList.add('ficha');
                newArticle.innerHTML = `<figure>
                <img src="${respuesta[i].image}" alt="${respuesta[i].name}" class="interactivo" data-type="character" id="${respuesta[i].id}">
                <button class="btn-fav"><img src="${svgImg}" alt="favorito"></button></figure>
                <div><h3>${respuesta[i].name}</h3><p><span>Género: ${respuesta[i].gender}, Estado: ${respuesta[i].status}, 
                Especie: ${respuesta[i].species}.</span></p></div>`;
                let idType = `${respuesta[i].id}character`;
                let button = newArticle.querySelector('.btn-fav') as HTMLButtonElement;
                let elementoImg = button?.children[0] as HTMLElement;
                comprobarFavoritos(idType, button , elementoImg);
                personajes.appendChild(newArticle);
            };
        };
        if(contador === 0){
            contador +=4;
        }else if(contador >= 4){
            contador +=4;
        };
        console.log(contador)
        if((contador >= respuesta.length)){
            btnPersonajes.disabled = true;
            btnPersonajes.classList.add('disabled');
        };
        if(respuesta.length < 4){
            btnPersonajes.disabled = true;
            btnPersonajes.classList.add('disabled');
        };
    };
};    

// Eventos.
containerPersonajes.addEventListener('click', (e) =>{
    let elemento = e.target as HTMLElement;
    let btnFav = elemento.closest('.btn-fav') as HTMLButtonElement
    if(btnFav){
        btnFav.classList.add('state-hover');
        let imgFav = elemento.closest('figure')?.children[0] as HTMLImageElement;
        let type = imgFav.dataset.type as string;
        if((!elemento.classList.contains('state-hover')) && (!elemento.classList.contains('fav'))){
            elemento.classList.add('state-hover','fav');
            let objeto: Objeto = {id: imgFav.id ,'idType': `${imgFav.id+type}`, 'type': type}
            guardarFavoritos(objeto);
        }else{
            btnFav.classList.remove('state-hover');
            elemento.classList.remove('state-hover','fav');
            let objeto: Objeto = {'id': imgFav.id ,'idType': `${imgFav.id+type}`, 'type': type}
            quitarFavoritos(objeto);
        };
    }else if(elemento.closest('.interactivo')){
        let imgIntv = elemento.closest('.interactivo') as HTMLImageElement;
        if(imgIntv){
            let id : string = imgIntv.id;
            let padre = elemento.closest('.ficha') as HTMLElement;
            let type = imgIntv.dataset.type as string;
            padre.appendChild(spinner);
            setTimeout(()=> {
                expandirInformacion(id, padre, type, spinner)
            },1000)
            imgIntv.classList.remove('interactivo'); 
        };
    }
});

btnPersonajes.addEventListener('click', ()=>{
    personajes.appendChild(spinner);
    if(Object.keys(filtro).length === 0){
        setTimeout(() => {
            llamarVisualizacion();
            personajes.removeChild(spinner);
        },2000);
    }else if(Object.keys(filtro).length > 0){
        setTimeout(() => {
            //contador +=4;
            urlFiltro(filtro);
            personajes.removeChild(spinner);
        },2000);
    };
});

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    filtro = {};
    contador = 0;
    btnPersonajes.disabled = false;
    btnPersonajes.classList.remove('disabled');
    let valorInput = input.value;
    let valorEstado = estadoSelect.value;
    let valorGenero = generoSelect.value;
    if(valorInput.trim()){
        filtro.nombre = valorInput;
    };
    if(valorEstado){
        filtro.estado = valorEstado;
    };
    if(valorGenero){
        filtro.genero = valorGenero;
    };
    if(Object.keys(filtro).length > 0){
        personajes.replaceChildren();
        personajes.appendChild(spinner);
        setTimeout(() => {
            urlFiltro(filtro);
            personajes.removeChild(spinner);
        }, 2000);
    };
});

// Llamadas de funciones al cargar la pg.
llamarVisualizacion();
getFavoritos();