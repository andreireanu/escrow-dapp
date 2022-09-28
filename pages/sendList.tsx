import React from 'react'
import SendElement from './sendElement'

function sendList( { data  } : {data : Array<String>}) {
     if (typeof data !== 'undefined') {
     return (
       <> {data.map((record: any) => 
            <SendElement key={record} record={record} /> )}
       </>
        );  
     } else {
          return <div> </div>;
     }
}

export default sendList
 