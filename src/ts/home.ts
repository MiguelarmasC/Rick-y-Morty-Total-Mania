// Elementos del Dom-Home.
const lugares = document.getElementById('lugares') as HTMLDivElement;
const personajes = document.getElementById('personajes') as HTMLDivElement;
const episodios = document.getElementById('episodios') as HTMLDivElement;
const containerHome = document.getElementById('container-home') as HTMLDivElement;

// Funciones e Interfaces importadas.
import {
    visualizarPersonajeRandom, generarLugarRandom, mostrarEpisodioRandom, getFavoritos, 
    guardarFavoritos, quitarFavoritos, expandirInformacion, Objeto
} from './utilidades';
import gif from '../img/comun/Spinnergreen.gif'; 

// Gif de carga de datos.
let spinner = document.createElement('img');
spinner.src = gif;
spinner.classList.add('spinner');

// Eventos.
containerHome.addEventListener('click', (e) =>{
    let elemento = e.target as HTMLElement;
    let btnFav = elemento.closest('.btn-fav') as HTMLButtonElement
    if(btnFav){
        btnFav.classList.add('state-hover');
        let imgFav = elemento.closest('figure')?.children[0] as HTMLImageElement;
        let type = imgFav.dataset.type as string;
        if((!elemento.classList.contains('state-hover')) && (!elemento.classList.contains('fav'))){
            elemento.classList.add('state-hover','fav');
            let objeto: Objeto = {'id': imgFav.id ,'idType': `${imgFav.id+type}`, 'type': type}
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
            padre.classList.add('is-expanded');
            let type = imgIntv.dataset.type as string;
            padre.appendChild(spinner);
            setTimeout(()=> {
                expandirInformacion(id, padre, type, spinner)
            },1000)
            imgIntv.classList.remove('interactivo'); 
        };
    }
});

// llamadas de funciones de visualizacion de elementos de la API al cargar la pg.
// Personajes
let personaje1 = await visualizarPersonajeRandom();
let personaje2 = await visualizarPersonajeRandom();
let personaje3 = await visualizarPersonajeRandom();
let personaje4 = await visualizarPersonajeRandom();

personaje3.classList.add('horizontal');
personaje4.classList.add('desktop');

personajes.appendChild(personaje1);
personajes.appendChild(personaje2);
personajes.appendChild(personaje3);
personajes.appendChild(personaje4);

//Localizaciones
let lugar1 = await generarLugarRandom();
let lugar2 = await generarLugarRandom();
let lugar3 = await generarLugarRandom();
let lugar4 = await visualizarPersonajeRandom();

lugar3.classList.add('horizontal');
lugar4.classList.add('desktop');

lugares.appendChild(lugar1);
lugares.appendChild(lugar2);
lugares.appendChild(lugar3);
lugares.appendChild(lugar4);

//Episodios
let episodio1 = await mostrarEpisodioRandom();
let episodio2 = await mostrarEpisodioRandom();
let episodio3 = await mostrarEpisodioRandom();
let episodio4 = await visualizarPersonajeRandom();

episodio3.classList.add('horizontal');
episodio4.classList.add('desktop');

episodios.appendChild(episodio1);
episodios.appendChild(episodio2);
episodios.appendChild(episodio3);
episodios.appendChild(episodio4);

//Favoritos
getFavoritos();
