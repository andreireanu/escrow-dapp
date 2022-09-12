import React from 'react'
import ReceiveElement from './receiveElement'

function receiveList( { data  } : {data : Array<String>}) {
    return (
        data.map((record: any, id: any) => {
            return <ReceiveElement key={id} record={record} />
        })) 
}

export default receiveList