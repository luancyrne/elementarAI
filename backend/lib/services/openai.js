const { OpenAI } = require('openai');
const { getElement, insertElement } = require('../elements/repository');
const validation = require('../validation');
const elementsSchema = require('../elements/elements-schema.json');
const openaiSchema = require('./openairesponse-schema.json');
require('dotenv').config();

class OPENAI {
  constructor() {
    this.token = process.env.OPEN_TOKEN;
    this.openai = new OpenAI({
      apiKey: this.token,
    });
    this.instructions = `Você esta sendo utilizada em uma API de jogo, onde você recebera uma resposta com dois pares
    no modelo { "primary":"element", "second":"element" } e devera responder somente o resultado desses pares seguindo o seguinte
    modelo { "primary":"element", "second":"element", "result": { "element": "newElement", "emoji":"onlyoneemojiElement" }  }, o resultado de 
    dois elementos deve sempre ser o mesmo caso se repitam. Caso não há mais nenhum resultado coerente com os pares, o resultado
    pode ser repetido com elementos já existentes.
A criação de novos elementos pode ser personalidades, filmes, qualquer coisa no mundo, porém deve apenas ser coisas existentes e que faça sentido com a junção.
(Você deve responder somente um JSON e somente em português)`;
  }

  async generateText(prompt) {
    const validate = validation(elementsSchema, prompt);

    if (!validate) {
      throw new Error('Invalid Schema');
    }

    const result = await getElement(prompt);
    if (result) {
      return result;
    }

    const response = await this.openai.chat.completions.create({
      messages: [
        { role: 'system', content: this.instructions },
        { role: 'user', content: JSON.stringify(prompt) }],
      model: 'gpt-4',
    }).catch((err) => {
      throw new Error(`Fail get response OpenAI -> ${err}`);
    });
    try {
      const res = JSON.parse(response.choices[0].message.content);
      const validateOpenaiResponse = validation(openaiSchema, res);
      if (!validateOpenaiResponse) {
        throw new Error('Invalid Schema OpenAI Response');
      }
      insertElement(res);
      return res;
    } catch (err) {
      throw new Error(`Invalid format response OpenAI -> ${err}`);
    }
  }
}

module.exports = OPENAI;
