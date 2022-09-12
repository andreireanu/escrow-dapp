import React from 'react'
import {Address} from "@elrondnetwork/erdjs/out"; 
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {useTransaction} from "../hooks/useTransaction";
import {useState} from "react";
import {webWalletTxReturnPath } from '../utils/routes';
import {contractAddress} from "../config"; 

function hex2a(hexx: String) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substring(i, i+2), 16));
    return str;
}


function receiveElement( {record} : {record: String}) {

  const {makeTransaction} = useTransaction(); 
  const [txData, setTxData] = useState('');

  const sendTransaction = async (data: string) => {
    const txResult = await makeTransaction({
        receiver: contractAddress,
        data: data,
        value: 0.01,
        gasLimit: 10000000,
        // webReturnUrl: window.location.toString() + webWalletTxReturnPath,
        webReturnUrl: window.location.origin,
    });
    setTxData('');
    console.log(txResult);
  };

  const hex = Buffer.from(record, 'base64').toString('hex');
  let splt = hex.replaceAll('0000000b',',').replaceAll('00000008',',').split(',');   
  let wallet_hex = splt[0];
  let wallet = Address.fromString(wallet_hex).bech32()
  let token_to_hex = splt[1]
  let token_to = hex2a(token_to_hex);
  let amount_to_hex = (splt[2])
  let amount_to = parseInt(splt[2], 16);
  let token_from_hex = splt[3]
  let token_from = hex2a(token_from_hex);
  let amount_from_hex = splt[4];
  let amount_from = parseInt(splt[4], 16);
  const amount_to_human = amount_to / ( Math.pow(10,18)) ;
  const amount_from_human = amount_from / ( Math.pow(10,18)) ;
 
  function handleAcceptClick() {
    let data = 'ESDTTransfer@' + token_to_hex + "@" + amount_to_hex + 
                '@657363726F77' + // escrow function name in hex         
                '@' + token_to_hex + "@" + amount_to_hex  + 
                '@' + token_from_hex + "@" + amount_from_hex + 
                '@' + wallet_hex;
    sendTransaction(data);
    }   

  return (
     <Card style={{ width: '45rem' }}>
      <Card.Header style={{ backgroundColor : 'BurlyWood' }} >Offer from {wallet}</Card.Header>
      <Card.Body>
        <Card.Title> You will send <span style={{ color : 'Coral' }} > {amount_to_human} </span> token(s) of type  <span style={{ color : 'Coral' }} >{token_to} </span> to the escrow smart contract </Card.Title>
        <Card.Title> You will receive <span style={{ color : 'Coral' }}> {amount_from_human} </span> token(s) of type <span style={{ color : 'Coral' }} >{token_from} </span> in exchange immediately </Card.Title>
        <Card.Text>
        </Card.Text>
        <Button variant="primary" onClick={handleAcceptClick}>Accept offer</Button>
      </Card.Body>
    </Card>  
  )
}

export default receiveElement