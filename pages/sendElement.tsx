import React from 'react'
import {Address} from "@elrondnetwork/erdjs/out"; 
import {ContractFunction} from "@elrondnetwork/erdjs/out"; 
import { AddressValue, BigUIntValue, TokenIdentifierValue } from "@elrondnetwork/erdjs/out";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {useTransaction} from "../hooks/useTransaction";
// import {useState} from "react";
// import {webWalletTxReturnPath } from '../utils/routes';
import {TransactionPayload} from "@elrondnetwork/erdjs/out";
import {contractAddress} from "../config"; 
import {tokens} from '../components/Tokens';

function hex2a(hexx: String) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substring(i, i+2), 16));
    return str;
}


function sendElement( {record} : {record: String}) {

    const {makeTransaction} = useTransaction(); 
    let regexConst = new RegExp(/0000000(?!0)./g);
    const hex = Buffer.from(record, 'base64').toString('hex');
    let splt = hex.replaceAll(regexConst, ',').split(','); 
    let wallet = Address.fromString(splt[0]).bech32()
    let token_to = hex2a(splt[1]);
    let amount_to = parseInt(splt[2], 16);
    let token_from = hex2a(splt[3]);
    let amount_from = parseInt(splt[4], 16);
    let decimal_to = tokens.find(token => {
      if (token.full_name === token_to) {
        return token;
      }})?.decimals ;
    let decimal_from = tokens.find(token => {
      if (token.full_name === token_from) {
        return token;
      }})?.decimals ;
    const amount_to_human = amount_to / ( Math.pow(10,Number(decimal_to))) ;
    const amount_from_human = amount_from / ( Math.pow(10,Number(decimal_from))) ;
  
    const sendTransaction = async () => {
    await makeTransaction({
      receiver: contractAddress,
      gasLimit: 7000000,
      data: 
        TransactionPayload.contractCall()
        .setFunction(new ContractFunction("removeOffer"))
        .addArg(new TokenIdentifierValue(token_to))
        .addArg(new BigUIntValue(amount_to))
        .addArg(new TokenIdentifierValue(token_from))
        .addArg(new BigUIntValue(amount_from))
        .addArg(new AddressValue(new Address(wallet)))
        .build(),
      }); 
    }
    
function handleCancelClick() {
    sendTransaction();
  }   

  return (
    <Card style={{ width: '45rem' }}>
      <Card.Header style={{ backgroundColor : 'lightblue' }} >Offer for {wallet}</Card.Header>
      <Card.Body>
        <Card.Title> You sent <span style={{ color : 'DarkCyan' }} >{amount_to_human} </span> tokens of type  <span style={{ color : 'DarkCyan' }} >{token_to} </span> to the escrow smart contract. </Card.Title>
        <Card.Title> You will receive <span style={{ color : 'DarkCyan' }} > {amount_from_human} </span> tokens of type <span style={{ color : 'DarkCyan' }} > {token_from} </span> in exchange 
          when the peer wallet accepts your offer. </Card.Title>
        <Card.Text>
        </Card.Text>
        <Button variant="primary" onClick={handleCancelClick}>Remove offer</Button>
      </Card.Body>
    </Card>
 
 
  )
}

export default sendElement