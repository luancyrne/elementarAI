import axios from 'axios'

const apiElementarAI = (elements) => {
    return axios.post('https://api.elementarai.io/element/elements', { primary: elements.primary, second: elements.second }).then((res) => {
        return res
    })
}

export default apiElementarAI;