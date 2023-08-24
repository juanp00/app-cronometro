export default class RecordedTimes {
    constructor(id, name, time, createdAt) {
        this.id        = id;
        this.name      = name;
        this.time      = time;
        this.createdAt = createdAt;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }
    
    getTime() {
        return this.time;
    }

    getCreatedAt() {
        return this.createdAt;
    }

    setName(newName) {
        this.name = newName;
    }

    saveData(data) {
        // Lê os dados do localStorage (se houver)
        const storedDataString = localStorage.getItem('records');
        let storedData = [];

        if (storedDataString) {
            storedData = JSON.parse(storedDataString);
        }

        // Adiciona o novo objeto ao final do array
        storedData.push(data);

        // Salva os dados atualizados no localStorage
        localStorage.setItem('records', JSON.stringify(storedData));
    }

    addRecordedTime(time) {
        this.saveData(time);
    
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


}