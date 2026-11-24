// Elementos del Dom-Localizaciones.
const localizaciones = document.getElementById('localizaciones') as HTMLElement;
const containerLocalizaciones = document.getElementById('container-localizaciones') as HTMLDivElement;
const btnLocalizaciones = document.getElementById('btn-localizaciones') as HTMLButtonElement;

// Funciones y elementos importadas.
import {
    getLocalizaciones, getFavoritos, guardarFavoritos, quitarFavoritos, 
    expandirInformacion, comprobarFavoritos, Objeto, svgImg, lugaresImg
} from './utilidades';
import gif from '../img/comun/Spinnergreen.gif';

// Gif de carga de datos.
let spinner = document.createElement('img');
spinner.src = gif;
spinner.classList.add('spinner');

// Variables.
let contador: number = 0;

// Funcion de vizualización de localizaciones.
async function llamarLocalizacion() {
    let respuesta = await getLocalizaciones();
    if (respuesta.tagName === 'P'){
        localizaciones.appendChild(respuesta);
    }else{
        if(contador < respuesta.length){
            for (let i = contador; i <  Math.min(contador + 4, respuesta.length); i++){
                let newArticle = document.createElement('article') as HTMLElement;
                newArticle.classList.add('ficha');
                newArticle.innerHTML = `<figure><img src="${lugaresImg[i]}" alt="${respuesta[i].name}" class="interactivo" data-type="location" id="${respuesta[i].id}">
                <button class="btn-fav"><img src="${svgImg}" alt="favorito"></button></figure>
                <div><h3>${respuesta[i].name}.</h3></div>`;
                let idType = `${respuesta[i].id}location`;
                let button = newArticle.querySelector('.btn-fav') as HTMLButtonElement;
                let elementoImg = button?.children[0] as HTMLElement;
                console.log(idType, button, elementoImg);
                comprobarFavoritos(idType, button , elementoImg);
                localizaciones.appendChild(newArticle);
            };
        };
        if(contador === 0){
            contador +=4;
        }else if(contador >= 4){
            contador +=4;
        };
        if((contador >= respuesta.length)){
            btnLocalizaciones.disabled = true;
            btnLocalizaciones.classList.add('disabled');
        };
        if(respuesta.length < 4){
            btnLocalizaciones.disabled = true;
            btnLocalizaciones.classList.add('disabled');
        };
    };
};

// Eventos.

containerLocalizaciones.addEventListener('click', (e) =>{
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

btnLocalizaciones.addEventListener('click', ()=>{
    localizaciones.appendChild(spinner)
    setTimeout(() => {
        llamarLocalizacion();
        localizaciones.removeChild(spinner);
    },2000);
});

// Llamadas de funciones al cargar la pg.
llamarLocalizacion();
getFavoritos();