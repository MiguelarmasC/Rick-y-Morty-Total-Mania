// Elementos del Dom-Favoritos.
const elementosFavoritos = document.getElementById('elementos-favoritos') as HTMLElement;
const containerFavoritos = document.getElementById('container-favoritos') as HTMLDivElement;

// Funciones y elementos importadas.
import {
    getLocalizaciones, getPersonajes, getEpisodio, getFavoritos, guardarFavoritos, quitarFavoritos, Info,
    expandirInformacion, Objeto, svgImg, lugaresImg, episodiosImg
} from './utilidades';
import gif from '../img/comun/Spinnergreen.gif';

// Gif de carga de datos.
let spinner = document.createElement('img');
spinner.src = gif;
spinner.classList.add('spinner');

// Variables
let favoritosObj = getFavoritos() as Array<Objeto>;

// Función de filtro por tipo de favoritos.
function analizarLista(favoritos : Array<Objeto>) {
    if(favoritos.length === 0){
        let newP = document.createElement('p') as HTMLParagraphElement;
        newP.classList.add('sin-fav');
        newP.innerHTML = 'Aun no haz añadido a tus favoritos¡';
        elementosFavoritos.appendChild(newP);
    };
};

async function filtrarTipo(favoritos : Array<Objeto>) {
    for(let i = 0; i < favoritos?.length; i++){
        let type = favoritos[i].type;
        let id = favoritos[i].id;
        switch(type){
            case 'character':
                await visualizarPersonaje(id);
            break;
            case 'episode':
                await mostrarEpisodio(id);
            break;
            case 'location':
                await generarLocalizacion(Number(id));
            break;
        };
    };
};

// Funciones de visualización de elementos favoritos.
async function visualizarPersonaje(id : string){
    const personaje = await getPersonajes(id);
   if(personaje){
        let newArticle = document.createElement('article') as HTMLElement;
        newArticle.classList.add('ficha');
        newArticle.innerHTML = `<figure><img src="${personaje.image}" alt="${personaje.name}" class="interactivo" data-type="character" id="${personaje.id}">
        <button class="btn-fav state-hover"><img src="${svgImg}" alt="favorito" class="state-hover fav"></button></figure>
        <div><h3>${personaje.name}</h3><p>${personaje.gender}, ${personaje.status}, ${personaje.species}.</p></div>`;
        elementosFavoritos.appendChild(newArticle);
    }else{
        let newP = document.createElement('p') as HTMLParagraphElement;
        newP.innerHTML = 'Error en la busqueda, el personaje no existe en la base de datos.';
        elementosFavoritos.appendChild(newP);
    };
};

async function mostrarEpisodio(id : string){
    const episodio = await getEpisodio(id);
    if(episodio){
        let ramdom : number = Math.floor(Math.random()*30);
        let newArticle = document.createElement('article') as HTMLElement;
        newArticle.classList.add('ficha');
        newArticle.innerHTML = `<figure><img src="${episodiosImg[ramdom]}" alt="${episodio.name}" class="interactivo" data-type="episode" id="${episodio.id}">
        <button class="btn-fav state-hover"><img src="${svgImg}" alt="favorito" class="state-hover fav"></button></figure>
        <div><h3>${episodio.name}.</h3><p>${episodio.air_date}, ${episodio.episode}.</p></div>`;
        elementosFavoritos.appendChild(newArticle);
    }else{
        let newP = document.createElement('p') as HTMLParagraphElement;
        newP.innerHTML = 'Error en la busqueda, el episodio  no existe en la base de datos.';
        elementosFavoritos.appendChild(newP);
    };
};

async function generarLocalizacion(id : Number){
    const localizacion = await getLocalizaciones();
    if(localizacion){
        let newArticle = document.createElement('article') as HTMLElement;
        newArticle.classList.add('ficha');
        newArticle.innerHTML = `<figure><img src="${lugaresImg[Number(id)-1]}" alt="${localizacion[Number(id)-1].name}" class="interactivo" data-type="location" id="${localizacion[Number(id)-1].id}">
        <button class="btn-fav state-hover"><img src="${svgImg}" class="state-hover fav" alt="favorito"></button></figure>
        <div><h3>${localizacion[Number(id)-1].name}.</h3></div>`;
        elementosFavoritos.appendChild(newArticle);
    }else{
        let newP = document.createElement('p') as HTMLParagraphElement;
        newP.innerHTML = 'Error en la busqueda, la localización no existe en la base de datos.';
        elementosFavoritos.appendChild(newP);
    };
};

// Eventos.
containerFavoritos.addEventListener('click', (e) =>{
    let elemento = e.target as HTMLElement;
    let btnFav = elemento.closest('.btn-fav') as HTMLButtonElement;
    if(btnFav){
        let imgFav = elemento.closest('figure')?.children[0] as HTMLImageElement;
        let type = imgFav.dataset.type as string;
        if((elemento.classList.contains('state-hover')) && (elemento.classList.contains('fav'))){
            btnFav.classList.remove('state-hover');
            elemento.classList.remove('state-hover');
            elemento.classList.remove('fav');
            let objeto: Objeto = {'id': imgFav.id ,'idType': `${imgFav.id+type}`, 'type': type}
            quitarFavoritos(objeto);
            let padre = elemento.closest('.ficha') as HTMLElement;
            elementosFavoritos.removeChild(padre);
            favoritosObj = getFavoritos() as Array<Objeto>;
            analizarLista(favoritosObj);
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

// Llamadas de funciones al cargar la pg.
filtrarTipo(favoritosObj);
analizarLista(favoritosObj);
