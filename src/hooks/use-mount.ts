import {useEffect} from 'react'

export const useMount = (fn: () => any) => {
    useEffect(() => {
        return fn()
    }, []);
}
