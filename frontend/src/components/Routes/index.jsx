import { useEffect, useState } from "react";
import DragAndDrop from '../dragAndDrop';
import FusionMobile from '../fusionMobile';
import Route from "./Route";

const VerifyVersion = () => {
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        if (window.screen.width <= 500) {
            setMobile(true)
        } else {
            setMobile(false)
        }
    }, [])

    return (!mobile ? <DragAndDrop /> : <FusionMobile />)
}

const Routes = () => {
    const [path, setPath] = useState('/')
    // eslint-disable-next-line no-unused-vars
    const [hash, setHash] = useState('')
    const [rendering, setRendering] = useState(false)

    useEffect(() => {
        setPath(window.location.pathname)
        window.location.hash ? setHash(window.location.hash) : null
        document.querySelector('#root').childElementCount > 0 ? setRendering(true) : setRendering(false)
    }, [path])

    return (
        <>
            <Route path={'/'} pathOrigin={path} component={<VerifyVersion />} rendering={rendering} />
        </>
    )
}

export default Routes;