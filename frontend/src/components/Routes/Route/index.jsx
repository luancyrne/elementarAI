const Route = ({ path = '/', pathOrigin, hash = '', hashOrigin, component, rendering }) => {
    if (path) {
        if (path === pathOrigin) {
            if (hash) {
                if (hash === hashOrigin) {
                    return (component)
                }
                return (<label>error</label>)
            }
            return (component)
        } else if (rendering) {
            return null
        } else {
            return (<label>error</label>)
        }
    } else {
        return (<label>error</label>)
    }
}

export default Route;