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

    setName(id, newName) {
        const storedDataString = localStorage.getItem('records');
    
        if (storedDataString) {
            let storedData = JSON.parse(storedDataString);

            // Encontre o índice do objeto com o ID correspondente
            const index = storedData.findIndex(item => item.id === id);
            
            if (index !== -1) {
                // Remove o item do array
                storedData[index].name = newName;

                // Atualize os dados no localStorage após a alteração
                localStorage.setItem('records', JSON.stringify(storedData));
            }
        }
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
}