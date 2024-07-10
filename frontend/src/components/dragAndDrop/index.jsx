import { useState, useEffect } from 'react';
import generateId from '../../utils/generateId';
import './index.css'
import apiElementarAI from '../../services/api';
import Logo from '../logo';
import Clear from '../clear';

const DragAndDrop = () => {
    const [elements, setElements] = useState([]);
    const [holdElement, setHoldElement] = useState(null);
    const [elementsOnTable, setElementsOnTable] = useState([]);
    const [elementMoveOnTable, setElementMoveOnTable] = useState(null);
    const [fusion, setFusion] = useState(null);
    const [resultFusion, setResultFusion] = useState(null);
    const [elementWaiting, setElementWaiting] = useState([]);
    const [saveData, setSaveData] = useState(false);

    const callAPI = async (params) => {
        elementWaiting[0].style.display = 'none'
        try {
            elementWaiting[1].textContent = '🔄Fazendo fusão'
            elementWaiting[1].classList.add('rotate-center')
            const result = await apiElementarAI(params);
            setResultFusion(result.data)
        } catch (error) {
            elementWaiting[0].style.display = 'block'
            elementWaiting[1].remove()
            throw new Error(`error -> ${error}`)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragStart = (e) => {
        if (!holdElement) {
            return setHoldElement(e.target)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault();
        const dropArea = document.querySelector('.drop')

        const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);

        if (holdElement) {
            const cloneElement = holdElement.cloneNode(true);
            cloneElement.classList.remove('element-badge');
            cloneElement.classList.add('element-table')
            cloneElement.style.left = `${e.clientX}px`;
            cloneElement.style.top = `${e.clientY}px`;
            cloneElement.ondragstart = (e) => {
                if (!elementMoveOnTable) setElementMoveOnTable(e.target)
                window.externalElement = e.target
            };
            const elementsDropeds = elementsOnTable
            const elementDrop = dropArea.appendChild(cloneElement)
            elementsDropeds.push(elementDrop)
            setElementsOnTable(elementsDropeds)
            setHoldElement(null)
            if (elementUnderCursor && elementUnderCursor !== dropArea && elementUnderCursor !== cloneElement) {
                setFusion({
                    primary: String(cloneElement.textContent.split(' ').slice(1)).replaceAll(',', ' '),
                    second: String(elementUnderCursor.textContent.split(' ').slice(1)).replaceAll(',', ' ')
                })
                setElementWaiting([cloneElement, elementUnderCursor])
            }
        } else if (elementMoveOnTable) {
            elementMoveOnTable.style.left = `${e.clientX}px`;
            elementMoveOnTable.style.top = `${e.clientY}px`;
            setElementMoveOnTable(null)
            if (elementUnderCursor && elementUnderCursor !== dropArea && elementUnderCursor !== elementMoveOnTable) {
                setFusion({
                    primary: String(elementMoveOnTable.textContent.split(' ').slice(1)).replaceAll(',', ' '),
                    second: String(elementUnderCursor.textContent.split(' ').slice(1)).replaceAll(',', ' ')
                })
                setElementWaiting([elementMoveOnTable, elementUnderCursor])
            }
        }

    }

    const handleDropClear = (e) => {
        e.preventDefault()
        window.externalElement.remove()
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
        if (resultFusion) {
            const filt = elements.find(({ element }) => element === resultFusion.element)
            if (filt?.element && elementWaiting.length > 0) {
                elementWaiting[1].classList.remove('rotate-center')
                elementWaiting[1].attributes.value.nodeValue = filt?.id
                elementWaiting[1].textContent = filt?.emoji + ' ' + filt?.element
                localStorage.clear()
                localStorage.setItem('elements', JSON.stringify({ elements }))
                setElementsOnTable([...elementsOnTable, elementWaiting[1]])
                setResultFusion(null);
                setFusion(null);
            } else {
                setElements(elements => {
                    const isElementExist = elements.some(element => element.element === resultFusion.element);
                    if (!isElementExist) {
                        return [...elements, {
                            emoji: resultFusion.emoji,
                            element: resultFusion.element,
                            id: generateId(elements)
                        }];
                    }
                    return elements;
                });
                if (elementWaiting.length > 0) {
                    elementWaiting[1].classList.remove('rotate-center')
                    elementWaiting[1].attributes.value.nodeValue = filt?.id
                    elementWaiting[1].textContent = filt?.emoji + ' ' + filt?.element
                }
                localStorage.clear()
                localStorage.setItem('elements', JSON.stringify({ elements }))
                setElementsOnTable([...elementsOnTable, elementWaiting[1]])
                setResultFusion(null);
                setFusion(null);
            }
        }

        if (fusion) {
            callAPI(fusion)
        }
    }, [resultFusion, fusion, elements, saveData])

    return (
        <div className="fullsize">

            <div className='table'>
                <div className='options'>
                    <Logo />
                    <Clear size={34} elements={elements} />
                </div>
                <div className="drop" onDragOverCapture={handleDragOver} onDropCapture={handleDrop}>
                    {
                        elementsOnTable.map((element, index) => {
                            element.value ? (
                                <div key={index} value={element.id} draggable className='element-table'>
                                    {element.emoji + ' ' + element.element}
                                </div>
                            ) : null
                        })
                    }
                </div>
                <div className='footer'>
                    <p>Desenvolvido por <a href="https://luancv.dev">Luan Cyrne</a></p>
                </div>
            </div>
            <div className="elements" onDragOverCapture={handleDragOver} onDropCapture={handleDropClear}>
                {
                    elements.map((element) => (
                        <div key={element.id} value={element.id} draggable onDragStartCapture={handleDragStart} className='element-badge'>
                            {element.emoji + ' ' + element.element}
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default DragAndDrop;