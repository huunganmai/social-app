'use client'

import { useState, useEffect, useContext, createContext} from 'react'


const ClientWrapper = ({children}: {children: any}) => {
    const [isActive, setIsActive] = useState(false)
    return (
        <>
            {children}
        </>
    )
}

export default ClientWrapper;

