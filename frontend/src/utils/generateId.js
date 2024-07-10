const generateId = (elements) => {
    if (elements.lenght) {
        const id = Math.floor(Math.max(Math.random() * 9999999))
        const element = elements.find(element => element.id === id);
        if (element) {
            return id;
        } else {
            return Math.floor(Math.max(Math.random() * 9999999));
        }
    } else {
        return Math.floor(Math.max(Math.random() * 9999999))
    }
}

export default generateId;  