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
    const elementIdRemove = 'sectionRecord';
    
    //Salva o novo record no local storage
    newRecord.saveData(newRecord); 

    // para de contar e reinicia o timer
    clearInterval(interval)
    currentTimer.innerHTML = "00:00";
    location.reload();
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

    const dataFormatada = `${dia}/${mes}/${ano} ${hora}:${minuto}`;

    return dataFormatada;
}

function removeElementId(elementRemove) {
    const idElementRemove = document.getElementById(elementRemove);
    console.log(idElementRemove);
    if(idElementRemove) {
        idElementRemove.remove();
    }
}

//Cria os records de tempos salvos anteriormente em local Storage toda vez que a página é carregada
function createRecordedSaves() {
    const recordsString = localStorage.getItem('records');
    const records = JSON.parse(recordsString);

    if (records) {
        //Caso tenha chamado essa função através da função stop, onde remove a section de record, aqui cria a seção novamente com os dados atualizados
        if(document.querySelector('#sectionRecord') === null) {
            const sectionReference = document.querySelector('.wrapper-cronometro');
            const createSection = document.createElement('section');
            createSection.classList.add('container','mb-4');
            createSection.setAttribute('id', 'sectionRecord');
            sectionReference.append(createSection);
            addEventIconDelete();
        }

        const section = document.querySelector('#sectionRecord');

        records.forEach(element => {
            const div        = document.createElement('div');
            const divIcons   = document.createElement('div');
            const title      = document.createElement('h3');
            const recordTime = document.createElement('p');
            const createdAt  = document.createElement('p');
            const iconEdit   = document.createElement('i');
            const iconDelete = document.createElement('i');

            iconEdit.setAttribute('data-key', element.id);
            iconDelete.setAttribute('data-key', element.id);
            divIcons.classList.add('wrapper-icons', 'd-flex', 'icon-edit');
            iconEdit.classList.add('fa-solid', 'fa-pen-to-square', 'icon-edit', 'icons-records');
            iconDelete.classList.add('fa-solid', 'fa-trash', 'icon-delete', 'icons-records')
            div.classList.add('d-flex', 'align-items-center', 'justify-content-between', 'wrapper-records');
            title.innerHTML      = element.name;
            recordTime.innerHTML = "Tempo: " + element.time;
            createdAt.innerHTML  = element.createdAt;

            divIcons.append(iconEdit, iconDelete);
            div.append(title, recordTime, createdAt, divIcons);
            section.append(div);
        });
    }
    //Adiciona os eventos de clique nos icones de remover item
    addEventIconDelete();
}

function deleteRecord(id) {
    const elementIdRemove = 'sectionRecord';
    //Remove a seção de records antiga para trazer os records atualizados
    removeElementId(elementIdRemove);

    const storedDataString = localStorage.getItem('records');
    
    if (storedDataString) {
        let storedData = JSON.parse(storedDataString);

        // Encontre o índice do objeto com o ID correspondente
        const index = storedData.findIndex(item => item.id === id);
        
        if (index !== -1) {
            // Remove o item do array
            storedData.splice(index, 1);

            // Atualiza os dados no localStorage
            localStorage.setItem('records', JSON.stringify(storedData));
        }
    }
}

function addEventIconDelete() {
    const iconsDelete = document.querySelectorAll('.icon-delete');
    iconsDelete.forEach(icon => {
        const iconId = icon.dataset.key; 
        icon.addEventListener('click', () => {
            deleteRecord(iconId);
            location.reload();
        });
    });
}

function editRecord(id) {
    const popup     = document.querySelector('.popup-overlay');
    const btnSubmit = document.getElementById('save-btn-popup');
    const inputName = document.querySelector('.input-new-name');
    const btnCancel = document.querySelector('#close-btn-popup');

    let newName
    popup.classList.add('popup-active');

    btnSubmit.addEventListener('click', () => {
        if(inputName.value) {
            newName = inputName.value;
            popup.classList.remove('popup-active');
            popup.classList.add('popup-hidden');

            //Atualiza o nome no local storage
            const recordUpdated = new RecordedTimes();
            recordUpdated.setName(id, newName);
            
            // Recarrega a página após a atualização
            location.reload();
        }
    });

    btnCancel.addEventListener('click', () => {
        popup.classList.remove('popup-active');
        popup.classList.add('popup-hidden');
        location.reload();
    });
}

function addEventIconEdit() {
    const iconsEdit = document.querySelectorAll('.icon-edit');
    iconsEdit.forEach(iconElement => {
        const iconEditId = iconElement.dataset.key; 
        iconElement.addEventListener('click', () => {
            editRecord(iconEditId);
        });
    });
}

iconStart.addEventListener('click', initPlay); 
iconPause.addEventListener('click', pause); 
iconStop.addEventListener('click', stop);


//Lista na página os records salvos anteriormente assim que a página é carregada
document.addEventListener('DOMContentLoaded', function() {
    createRecordedSaves();
    addEventIconDelete();
    addEventIconEdit();
});

