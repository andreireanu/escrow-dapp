import React from 'react'
import ReceiveElement from './receiveElement'

function receiveList( { data  } : {data : Array<String>}) {
    return (
        data.map((record: any) => {
            return <ReceiveElement key={record} record={record} />  
        })) 
}

export default receiveList