import React from 'react'
import {Address} from "@elrondnetwork/erdjs/out"; 

import { Button, CardContent, Typography } from '@material-ui/core';
import Card from "@material-ui/core/Card";
import CardMedia from '@mui/material/CardMedia/CardMedia';
 
import {
  EuiCard,
  EuiIcon,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';


function hex2a(hexx: String) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substring(i, i+2), 16));
    return str;
}


function sendElement( {record} : {record: String}) {

    const hex = Buffer.from(record, 'base64').toString('hex');
    let splt = hex.replaceAll('0000000b',',').replaceAll('00000008',',').split(',');   
    let wallet = Address.fromString(splt[0]).bech32()
    // console.log(wallet);  
    let token_to = hex2a(splt[1]);
    // console.log(token_to);  
    let amount_to = parseInt(splt[2], 16);
    // console.log(amount_to);    
    let token_from = hex2a(splt[3]);
    // console.log(token_from);  
    let amount_from = parseInt(splt[4], 16);
    // console.log(amount_from);  
    const amount_to_human = amount_to / ( Math.pow(10,18)) ;
    const amount_from_human = amount_from / ( Math.pow(10,18)) ;
 
     

  return (
    // <label>
    // <input type="checkbox"   />
    // ${wallet}
    // ${token_to}
    // ${amount_to}
    // ${token_from}
    // ${amount_from}
    // </label>
  
  <div>


<EuiFlexItem key={record}>
      <EuiCard
        title={`Swap ${amount_to_human} ${token_to} for ${amount_from_human} ${token_from}`}
        description={`Offer made by ${wallet}`}
     
      />
    </EuiFlexItem>


  {/* <Button variant="contained"  >
      <Card text-gray-800 style={{backgroundColor: "coral"}} >
      <CardContent>
        <Typography  gutterBottom variant="h5" component="h5"> You send: {amount_to_human} {token_to}</Typography>
        <Typography gutterBottom variant="h5" component="h5"> You receive: {amount_from_human} {token_from}  </Typography>
        From: {wallet}
      </CardContent>
    </Card>
  </Button> */}
 
</div>
  
  
  )
}

export default sendElement