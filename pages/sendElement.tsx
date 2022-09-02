import React from 'react'
import {Address} from "@elrondnetwork/erdjs/out"; 

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
 
 

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
  
 

   
<Card  >
      <Card.Header >Offer for you from {wallet}</Card.Header>
      <Card.Body>
        <Card.Title> Swap {amount_to_human} {token_to} for {amount_from_human} {token_from}</Card.Title>
        <Card.Text>
        </Card.Text>
        <Button variant="primary">Accept offer</Button>
      </Card.Body>
    </Card>


 
  
  
  )
}

export default sendElement