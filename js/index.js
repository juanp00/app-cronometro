import RecordedTimes from "./Time.js";
const iconStart    = document.querySelector('.wrapper-control-play');
const iconPause    = document.querySelector('.wrapper-control-pause');
const iconStop     = document.querySelector('.wrapper-control-stop');
const wrapperIcons = document.querySelector('.wrapper-controls');
const currentTimer  = document.querySelector('.current-timer');
var interval

function initPlay(){
    iconStart.style.visibility = "hidden";
    iconPause.style.visibility = "visible";

    var value = parseFloat(currentTimer.innerHTML);
    
    interval = setInterval(() => {
        value += 0.1;

        if (value >= 60) {
            var minutes = Math.floor(value / 60);
            var seconds = (value % 60).toFixed(1);
            currentTimer.innerHTML = `${minutes}m ${seconds}`;
        } else {
            currentTimer.innerHTML = value.toFixed(1);
        }
    }, 100);
}

function pause(){
    iconStart.style.visibility = "visible";
    iconPause.style.visibility = "hidden";
    // para de contar
    clearInterval(interval)
}

function stop(){
    iconStart.style.visibility = "visible";
    iconPause.style.visibility = "visible";
    iconStop.style.visibility  = "visible";
    
    //Chama a função para criar o tempo salvo e cria o objeto do tempo salvo
    const currentTime  = document.querySelector('.current-timer').textContent;
    const dataAtual    = getCurrentDate();
    const newRecord    = new RecordedTimes(generateUniqueID(5), 'Record sem nome', currentTime, dataAtual); //No ID ele chama uma função de gerar id que não existam no localStorage
    newRecord.addRecordedTime(newRecord); 

    // para de contar e reinicia o timer
    clearInterval(interval)
    currentTimer.innerHTML = "00:00";
}

//Gera números para ID's que não existam no localStorage
function generateUniqueID(length) {
    const characters = '0123456789';
    const idLength = length || 8; // Comprimento padrão do ID

    let id = '';
    for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters[randomIndex];
    }

    // Verifica se o ID gerado já existe
    if (localStorage.getItem(id) !== null) {
        // Se já existe, chama a função novamente para gerar outro ID
        return generateUniqueID(idLength);
    }

    return id;
}

//Pega a data atual e formata a saida para dd/mm/aaaa hh:mm
function getCurrentDate() {
    const dataAtual = new Date();

    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();
    const hora = String(dataAtual.getHours()).padStart(2, '0');
    const minuto = String(dataAtual.getMinutes()).padStart(2, '0');

    return dataFormatada = `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

//Cria os records de tempos salvos anteriormente em local Storage toda vez que a página é carregada
function createRecordedSaves() {
    const recordsString = localStorage.getItem('records');
    const records = JSON.parse(recordsString);

    if (records) {
        const section = document.querySelector('#sectionRecord');

        records.forEach(element => {
            const div        = document.createElement('div');
            const title      = document.createElement('h3');
            const recordTime = document.createElement('p');
            const createdAt  = document.createElement('p');

            div.classList.add('d-flex', 'align-items-center', 'justify-content-between');
            title.innerHTML      = element.name;
            recordTime.innerHTML = "Tempo: " + element.time;
            createdAt.innerHTML  = "Criado em: " + element.createdAt;

            div.append(title, recordTime, createdAt);
            section.append(div);
        });
    }
}

iconStart.addEventListener('click', initPlay); 
iconPause.addEventListener('click', pause); 
iconStop.addEventListener('click', stop)

//Cria os tempos salvos anteriormente
document.addEventListener('DOMContentLoaded', function() {
    // Sua função a ser chamada quando a página é iniciada
    createRecordedSaves();
  });