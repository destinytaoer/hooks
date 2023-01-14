import {useEffect} from "react";

export const useUpdate = (fn: () => any, deps: any[]) => {
    useEffect(() => {
        return fn()
    }, deps);

}
