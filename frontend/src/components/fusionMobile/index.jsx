import { useState, useEffect } from 'react';
import generateId from '../../utils/generateId';
import './index.css'
import apiElementarAI from '../../services/api';
import Logo from '../logo';
import Clear from '../clear';
import FusionIcon from '../fusionIconMobile'
import FusionClearInput from '../fusionClearInput'

const FusionMobile = () => {
    const [elements, setElements] = useState([]);
    const [saveData, setSaveData] = useState(false);
    const [elementsSelected, setElementsSelected] = useState({ primary: 'Insira um elemento', second: 'Insira um elemento' });
    const [resultElement, setResultElement] = useState('Insira elementos para fusão');

    const callAPI = async () => {
        const elementFormatted = {
            primary: String(elementsSelected.primary.split(' ').slice(1)).replaceAll(',', ' '),
            second: String(elementsSelected.second.split(' ').slice(1)).replaceAll(',', ' ')
        }
        try {
            const result = await apiElementarAI(elementFormatted);
            setResultElement(String(result.data.emoji + ' ' + result.data.element))
            setElementsSelected({ primary: 'Insira um elemento', second: 'Insira um elemento' })
            setElements(elements => {
                const isElementExist = elements.some(element => element.element === result.data.element);
                if (!isElementExist) {
                    return [...elements, {
                        emoji: result.data.emoji,
                        element: result.data.element,
                        id: generateId(elements)
                    }];
                }
                return elements;
            });
            localStorage.clear()
            localStorage.setItem('elements', JSON.stringify({ elements }))
        } catch (error) {
            setResultElement('Não foi possível gerar esta fusão')
            throw new Error(`error -> ${error}`)
        }
    }

    const handleInvertPosition = () => {
        const primary = elementsSelected.primary;
        const second = elementsSelected.second;
        setElementsSelected({ primary: second, second: primary })
    }

    const handleFusion = () => {
        let progress = 0
        for (const key in elementsSelected) {
            if (Object.hasOwnProperty.call(elementsSelected, key)) {
                const el = elementsSelected[key];
                if (el !== 'Insira um elemento') {
                    progress = progress + 1
                }
                if (progress === 2) {
                    callAPI()
                }
            }
        }
    }

    const handleClearInput = () => {
        setElementsSelected({ primary: 'Insira um elemento', second: 'Insira um elemento' })
    }

    const handleClick = (e) => {
        for (const key in elementsSelected) {
            if (Object.hasOwnProperty.call(elementsSelected, key)) {
                const el = elementsSelected[key];
                if (el === 'Insira um elemento' || !el) {
                    setElementsSelected({ ...elementsSelected, [key]: e.target.textContent })
                }
            }
        }
    }

    useEffect(() => {
        if (!saveData) {
            if (!localStorage.getItem('elements')) {
                localStorage.setItem('elements', JSON.stringify({
                    elements:
                        [
                            { emoji: '🔥', element: 'Fogo', id: generateId(elements) },
                            { emoji: '💧', element: 'Água', id: generateId(elements) },
                            { emoji: '🍃', element: 'Ar', id: generateId(elements) },
                            { emoji: '🌱', element: 'Terra', id: generateId(elements) }
                        ]
                }))
                setElements(JSON.parse(localStorage.getItem('elements')).elements)
                setSaveData(!saveData)
            } else {
                setElements(JSON.parse(localStorage.getItem('elements')).elements)
                setSaveData(!saveData)
            }
        }
    }, [elements, saveData])

    return (
        <div className="fullsize">

            <div className='table'>
                <div className='options'>
                    <Logo />
                    <Clear size={34} elements={elements} />
                </div>
                <div className="drop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                    <div className='fusionMobile'>
                        <div className='fusao'>
                            <label id='fusao'>FUSÃO</label>
                            <div className='element-result'>{resultElement}</div>
                        </div>
                        <div className='fusionTable'>
                            {
                                !elementsSelected.primary ? <div className='element-result'></div> : <div className='element-result'>
                                    <label className='elementInFusion'>{elementsSelected.primary}</label>
                                </div>
                            }
                            <div style={{ paddingTop: '15px', paddingLeft: '10px', paddingRight: '10px' }} onClick={handleInvertPosition}><FusionIcon /></div>
                            {
                                !elementsSelected.second ? <div className='element-result'></div> : <div className='element-result'>
                                    <label className='elementInFusion'>{elementsSelected.second}</label>
                                </div>
                            }
                        </div>
                        <div className='tools'>
                            <div className='buttonFusion' onClick={handleFusion}>Fazer Fusão</div>
                            <div className='clear' onClick={handleClearInput}><FusionClearInput size={34} /></div>
                        </div>
                    </div>
                </div>
                <div className='footer'>
                    <p>Desenvolvido por <a href="https://luancv.dev">Luan Cyrne</a></p>
                </div>
            </div>
            <div className="elements" >
                {
                    elements.map((element) => (
                        <div key={element.id} value={element.id} className='element-badge' onClick={handleClick}>
                            {element.emoji + ' ' + element.element}
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default FusionMobile;