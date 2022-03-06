import  {useContext,createContext,useState,useMemo,useCallback,useEffect} from 'react';

const ApplicationContext = createContext();

export function useApplicationContext (){
    return useContext(ApplicationContext);
}

export default function Provider({children}) {

    return (
        <ApplicationContext.Provider
            value = {useMemo(()=>({}),[])}
        >
            {children}
        </ApplicationContext.Provider>
    )
}