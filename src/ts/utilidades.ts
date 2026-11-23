// Urls API
export const UrlPersonajes : string = 'https://rickandmortyapi.com/api/character';
export const UrlLugares : string = 'https://rickandmortyapi.com/api/location?page=1';
export const UrlEpisodios : string = 'https://rickandmortyapi.com/api/episode';

// Interfases.
export interface Objeto {
  id: string;
  idType: string;
  type: string;
};

export interface Info{
    name?: string;
    episode?: string[];
    type?: string;
    dimension?: string;
    residents?: string[];
    origin?: { name: string};
    location?: { name: string};
    characters?: string[];
};

// Variables.
let favoritos : Array<Objeto>= [];

// Array de img de localizaciones.
const imagenesModulos = import.meta.glob('../img/lugares/*.png', { eager: true }) as Record<string, { default: string }>;
export const lugaresImg: string[] = Object.values(imagenesModulos).map(img => img.default);

// Array de img de random para acompañar la info de cada episodio. 
const modulosDeImagenes = import.meta.glob('../img/episodios/*.jpg', { eager: true }) as Record<string, { default: string }>;
export const episodiosImg: string[] = Object.values(modulosDeImagenes).map(img => img.default);

// Svg de img de estrella.
const moduloSvg = import.meta.glob('../img/comun/*.svg', { eager: true }) as Record<string, { default: string }>;
export const svgImg: string[] = Object.values(moduloSvg).map(img => img.default);

// Solicitudes a la API.
export async function getPersonajes(id : string | Array<string>){
    try {
        let response = await fetch(`${UrlPersonajes}/${id}`);
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

export async function getEpisodio(id : string){
    try {
        let response = await fetch(`${UrlEpisodios}/${id}`);
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        };
        const data = await response.json();
        return data;
    }catch (error){
        let newP = document.createElement('p') as HTMLParagraphElement;
        newP.innerText = `Error al obtener los datos: ${error}`;
        return newP;
    };
};

export async function getLocalizaciones(){
    try {
        let response = await fetch(`${UrlLugares}`);
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        };
        const data = await response.json();
        return data.results;
    }catch (error){
        let newP = document.createElement('p') as HTMLParagraphElement;
        newP.innerText = `Error al obtener los datos: ${error}`;
        return newP;
    };
};

// Visualizaciones de información de la API.
export async function visualizarPersonajeRandom(){
    let idRamdon : number = Math.floor(Math.random()*826);
    const personaje = await getPersonajes(String(idRamdon));
    let newArticle = document.createElement('article') as HTMLElement;
    newArticle.classList.add('ficha');
    newArticle.innerHTML = `<figure><img src="${personaje.image}" alt="${personaje.name}" class="interactivo" data-type="character" id="${personaje.id}">
    <button class="btn-fav"><img src="${svgImg}" alt="favorito"></button></figure>
    <div><h3>${personaje.name}</h3><p>${personaje.gender}, ${personaje.status}, ${personaje.species}.</p></div>`;
    let idType = `${personaje.id}character`;
    let button = newArticle.querySelector('.btn-fav') as HTMLButtonElement;
    let elementoImg = button?.children[0] as HTMLElement;
    comprobarFavoritos(idType, button , elementoImg);
    return newArticle;
};

export async function generarLugarRandom(){
    let idRamdon : number = Math.floor((Math.random()*20));
    const lugar = await getLocalizaciones();
    let newArticle = document.createElement('article') as HTMLElement;
    newArticle.classList.add('ficha');
    newArticle.innerHTML = `<figure><img src="${lugaresImg[idRamdon]}" alt="${lugar[idRamdon].name}" class="interactivo" data-type="location" id="${lugar[idRamdon].id}">
    <button class="btn-fav"><img src="${svgImg}" class="btn" alt="favorito"></button></figure>
    <div><h3>${lugar[idRamdon].name}.</h3></div>`;
    let idType = `${lugar[idRamdon].id}location`;
    let button = newArticle.querySelector('.btn-fav') as HTMLButtonElement;
    let elementoImg = button?.children[0] as HTMLElement;
    comprobarFavoritos(idType, button , elementoImg);
    return newArticle;
};

export async function mostrarEpisodioRandom(){
    let idRamdon : number = Math.floor((Math.random()*51) + 1);
    let ramdom : number = Math.floor(Math.random()*30);
    const episodio = await getEpisodio(String(idRamdon));
    let newArticle = document.createElement('article') as HTMLElement;
    newArticle.classList.add('ficha');
    newArticle.innerHTML = `<figure><img src="${episodiosImg[ramdom]}" alt="episodio: ${episodio.name}" class="interactivo" data-type="episode" id="${episodio.id}">
    <button class="btn-fav"><img src="${svgImg}" alt="favorito"></button></figure>
    <div><h3>${episodio.name}.</h3><p>${episodio.air_date}, ${episodio.episode}.</p></div>`;
    let idType = `${episodio.id}episode`;
    let button = newArticle.querySelector('.btn-fav') as HTMLButtonElement;
    let elementoImg = button?.children[0] as HTMLElement;
    comprobarFavoritos(idType, button , elementoImg);
    return newArticle;
};

// Funciones de Favoritos con LocalStorage.
export function getFavoritos(){
    if(localStorage.getItem('favoritos')){
        favoritos = JSON.parse(localStorage.getItem('favoritos') as string);
        return favoritos;
    };
};

export function guardarFavoritos(data : Objeto){
    let existe = false;
    if(favoritos.length === 0){
        favoritos.push(data);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
    }else{
        for(let i = 0; i < favoritos.length; i++){
            if(data.idType === favoritos[i].idType){
                existe = true;
                break;
            };
        };
        if(!existe){
            favoritos.push(data);
            localStorage.setItem('favoritos', JSON.stringify(favoritos));
        };
    };
};

export function comprobarFavoritos(idType : string, button : HTMLButtonElement, elemento : HTMLElement){
    for(let i = 0; i < favoritos.length; i++){
        if(idType === favoritos[i].idType){
            button.classList.add('state-hover')
            elemento.classList.add('state-hover','fav');
        };
    };
};

export function quitarFavoritos(data : Objeto){
    if(favoritos.length >= 1){
        favoritos = favoritos.filter(elemento => elemento.idType !== data.idType );
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
    };
};

// Ampliar informacion segun tipo de elemento.
export async function expandirInformacion(id : string, elemento : HTMLElement, type : string, spinner: HTMLImageElement) {
    let info : Info;
    let newP = document.createElement('p') as HTMLParagraphElement;
    switch (type) {
        case 'character':
            info = await getPersonajes(id);
            const arrayEpisodios = info.episode?.map(url => url.split('/').pop());
            newP.innerHTML = `Origen: ${info.origin?.name}.<br>Localización Actual: ${info.location?.name}.
            <br>Episodios donde aparece: ${arrayEpisodios?.join(', ')}.`;
            elemento.removeChild(spinner);
            elemento.appendChild(newP);
        break;
        case 'location':
            let respuesta = await getLocalizaciones();
            let residentesUrl = respuesta[Number(id)-1].residents as Array<string>;
            let nombreResidentes: Array<string> = [];
            let arrayResidentesId= (residentesUrl?.map(idString  => idString.split('/').pop()) || [0]) as Array<string>;
            let residentesName = await getPersonajes(arrayResidentesId);
            for(let i = 0; i < residentesName?.length; i++){
                nombreResidentes.push(residentesName[i].name);
            };
            newP.innerHTML = `Tipo: ${respuesta[Number(id)-1].type}.<br>Dimensión: ${respuesta[Number(id)-1].dimension}.
            <br>Habitantes: ${nombreResidentes.length ?  nombreResidentes?.join(', ') : 'Desconocido.'}.`;
            elemento.removeChild(spinner);
            elemento.appendChild(newP);
        break;
        case 'episode':
            info = await getEpisodio(id);
            let nombrePersonajes: Array<string> = [];
            let arrayPersonajesId= info.characters?.map(url => url.split('/').pop() || [0]) as Array<string>;
            let personajesName = await getPersonajes(arrayPersonajesId);
            for(let i = 0; i < personajesName?.length; i++){
                nombrePersonajes.push(personajesName[i].name);
            }
            newP.innerHTML = `Personajes: ${nombrePersonajes.length ?  nombrePersonajes?.join(', ') : 'Desconocido.'}.`;
            elemento.removeChild(spinner);
            elemento.appendChild(newP);
        break;
    };
};