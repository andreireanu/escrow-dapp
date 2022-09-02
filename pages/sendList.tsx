import React from 'react'
import SendElement from './sendElement'

import {
    EuiCard,
    EuiIcon,
    EuiFlexGroup,
    EuiFlexItem,
  } from '@elastic/eui';

function sendList( { data  } : {data : Array<String>}) {
    return (
        data.map((record: any) => {
            return (
            <>
             <EuiFlexGroup  style={{ maxWidth: 600 }} responsive={false} wrap gutterSize="xl" alignItems="flexEnd" >
                <SendElement key={record} record={record} />  
             </EuiFlexGroup>
            </>
            )
        })) 
}

export default sendList