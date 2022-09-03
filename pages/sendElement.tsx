import React from 'react'
import {Address} from "@elrondnetwork/erdjs/out"; 
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {useTransaction} from "../hooks/useTransaction";
import {useState} from "react";
import {webWalletTxReturnPath } from '../utils/routes';

function hex2a(hexx: String) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substring(i, i+2), 16));
    return str;
}


function sendElement( {record} : {record: String}) {

    const {makeTransaction} = useTransaction(); 
    const [txData, setTxData] = useState('');

    const sendTransaction = async (data: string) => {
      const txResult = await makeTransaction({
          receiver: wallet,
          data: data,
          value: 0.01,
          gasLimit: 600000,
          webReturnUrl: window.location.toString() + webWalletTxReturnPath,
      });
      setTxData('');
      console.log(txResult);
  };

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
 
    function handleCancelClick() {
      console.log('RUN')
      let data = 'removeOffer@455343312D343932663262@0DE0B6B3A7640000@455343322D383366656131@1BC16D674EC80000@75D4316BC2F8293CF7D2AFD908966F27592FF4DDF9CE9F56B65060F8EBA321DA'
      sendTransaction(data);
     }   

  return (
    <Card style={{ width: '45rem' }}>
      <Card.Header style={{ backgroundColor : 'lightblue' }} >Offer for {wallet}</Card.Header>
      <Card.Body>
        <Card.Title> You sent <span style={{ color : 'DarkCyan' }} >{amount_to_human} </span> token(s) of type  <span style={{ color : 'DarkCyan' }} >{token_to} </span> to the smart contract </Card.Title>
        <Card.Title> You will receive <span style={{ color : 'DarkCyan' }} > {amount_from_human} </span> tokens of type <span style={{ color : 'DarkCyan' }} > {token_from} </span> in exchange 
          when the wallet you want to escrow with accepts your offer </Card.Title>
        <Card.Text>
        </Card.Text>
        <Button variant="primary" onClick={handleCancelClick}>Cancel offer</Button>
      </Card.Body>
    </Card>
 
 
  )
}

export default sendElement