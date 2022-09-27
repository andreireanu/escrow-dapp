import React from 'react'
import SendElement from './sendElement'

function sendList( { data  } : {data : Array<String>}) {
    return (
       <> {data.map((record: any) => 
            <SendElement key={record} record={record} /> )}
       </>
        );  
}

export default sendList