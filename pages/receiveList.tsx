import React from 'react'
import ReceiveElement from './receiveElement'



function ReceiveList( { data  } : {data : Array<String>}) {

  if (typeof data !== 'undefined') {
    return (
        <> {data.map((record: any) => 
              <ReceiveElement key={record} record={record} />
            )}
            </>
            );  
    } else {
            return <div> </div>;
    }
}

export default ReceiveList