import generateId from "../../utils/generateId";

const Clear = ({ size = 24, color = "#ffffff", elements }) => {
    const handleClear = () => {
        localStorage.setItem('elements', JSON.stringify({
            elements:
                [
                    { emoji: '🔥', element: 'Fogo', id: generateId(elements) },
                    { emoji: '💧', element: 'Água', id: generateId(elements) },
                    { emoji: '🍃', element: 'Ar', id: generateId(elements) },
                    { emoji: '🌱', element: 'Terra', id: generateId(elements) }
                ]
        }))
        window.location.href = '/'
    }

    return (
        <div onClick={handleClear} title="Limpar elementos descobertos" style={{ cursor: 'pointer', marginTop: '5px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6">

                </polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">

                </path>
                <line x1="10" y1="11" x2="10" y2="17">

                </line>
                <line x1="14" y1="11" x2="14" y2="17">

                </line>
            </svg>
        </div>
    );
}

export default Clear;