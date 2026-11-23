// Elementos del Dom-Episodios.
const form = document.getElementById('form') as HTMLFormElement;
const temporadasSelect = document.getElementById('filtroTemporadas') as HTMLSelectElement;
const episodios = document.getElementById('episodios') as HTMLElement;
const containerEpisodios = document.getElementById('container-episodios') as HTMLDivElement;
const btnEpisodios = document.getElementById('btn-episodios') as HTMLButtonElement;

// Funciones y elementos importadas.
import {
    mostrarEpisodioRandom, getFavoritos, guardarFavoritos, quitarFavoritos, 
    expandirInformacion, comprobarFavoritos, Objeto, UrlEpisodios, svgImg, episodiosImg
} from './utilidades';

// Gif de carga de datos.
let spinner = document.createElement('img');
spinner.src = '../src/img/comun/Spinnergreen.gif';
spinner.classList.add('spinner');

// Variables.
let filtro: string = '';
let contador: number = 0;

// Funcion de visualización de episodios al cargar pg.
async function llamarEpisodioRandom() {
    for (let i = 0; i < 4; i++){
        let newArticle = document.createElement('article') as HTMLElement;
        newArticle = await mostrarEpisodioRandom();
        episodios.appendChild(newArticle);
    };
};

// Función generadora de URL para filtrar episodios.
async function urlFiltro(filtro: string){
    let urlFiltro: string = '' ;
    switch(filtro){
        case '1':  
          urlFiltro = Array.from({length:11},(_, i) => i + 1).join(',');
        break;
        case '2':
            urlFiltro = Array.from({length:10},(_, i) => i + 12).join(',');
        break;
        case '3':
            urlFiltro = Array.from({length:10},(_, i) => i + 22).join(',');
        break;
        case '4':
            urlFiltro = Array.from({length:10},(_, i) => i + 32).join(',');
        break;
        case '5':
            urlFiltro = Array.from({length:10},(_, i) => i + 42).join(',');
        break;
    };
    visualizarFiltros(urlFiltro);
};

// Funsion de petición con filtros.
async function getEpisodiosFiltrados(filtro:string){
    try {
        let response = await fetch(`${UrlEpisodios}/${filtro}`);
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

// Funciones de visualización de episodios filtrados.
async function episodiosFiltrados(filtro : string){
    const episodiosObjet = await getEpisodiosFiltrados(filtro);
   if(episodiosObjet.length > 0){
        return episodiosObjet;
    }else{
        let newP = document.createElement('p') as HTMLParagraphElement;
        newP.innerHTML = 'Error, fallo de conexion con la base de datos.';
        return newP;
    };
};

async function visualizarFiltros(filtro : string) {
    let respuesta = await episodiosFiltrados(filtro);
    if (respuesta.tagName === 'P'){
        episodios.appendChild(respuesta);
    }else{
        if(contador < respuesta.length){
            for (let i = contador; i <  Math.min(contador + 4, respuesta.length); i++){
                let ramdom : number = Math.floor(Math.random()*30);
                let newArticle = document.createElement('article') as HTMLElement;
                newArticle.classList.add('ficha');
                newArticle.innerHTML = `<figure><img src="${episodiosImg[ramdom]}" alt="episodio: ${respuesta[i].name}" class="interactivo" data-type="episode" id="${respuesta[i].id}">
                <button class="btn-fav"><img src="${svgImg}" alt="favorito"></button></figure>
                <div><h3>${respuesta[i].name}.</h3><span>${respuesta[i].air_date}, ${respuesta[i].episode}.</span></div>`;;
                let idType = `${respuesta[i].id}episode`;
                let button = newArticle.querySelector('.btn-fav') as HTMLButtonElement;
                let elementoImg = button?.children[0] as HTMLElement;
                comprobarFavoritos(idType, button , elementoImg);
                episodios.appendChild(newArticle);
            };
        };
        if(contador === 0){
            contador +=4;
        }else if(contador >= 4){
            contador +=4;
        };
        if((contador >= respuesta.length)){
            btnEpisodios.disabled = true;
            btnEpisodios.classList.add('disabled');
        };
        if(respuesta.length < 4){
            btnEpisodios.disabled = true;
            btnEpisodios.classList.add('disabled');
        };
    };
}; 

// Eventos.
containerEpisodios.addEventListener('click', (e) =>{
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

btnEpisodios.addEventListener('click', ()=>{
    episodios.appendChild(spinner);
    if(Object.keys(filtro).length === 0){
        setTimeout(() => {
            llamarEpisodioRandom();
            episodios.removeChild(spinner);
        },2000);
    }else if(Object.keys(filtro).length > 0){
        setTimeout(() => {
            urlFiltro(filtro);
            episodios.removeChild(spinner);
        },2000);
    };
});

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    filtro = '';
    contador = 0;
    btnEpisodios.disabled = false;
    btnEpisodios.classList.remove('disabled');
    let valorTemporada = temporadasSelect.value as string;
    if(valorTemporada){
        filtro = valorTemporada;
    };
    if(Object.keys(filtro).length > 0){
        episodios.replaceChildren();
        episodios.appendChild(spinner);
        setTimeout(() => {
            urlFiltro(filtro);
            episodios.removeChild(spinner);
        },2000);
    };
});

// Llamadas de funciones al cargar la pg.
llamarEpisodioRandom();
getFavoritos();