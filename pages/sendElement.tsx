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

function SendElement( {record} : {record: String}) {
    
  let token_to : string;
  let amount_to: number;
  let token_from : string;
  let amount_from: number;
  let wallet: string;
  
  function handleCancelClick() {
    sendTransaction();
  }   
  const {makeTransaction} = useTransaction(); 
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

  try {
    let regexConst = new RegExp(/0000000(?!0)./g);
    const hex = Buffer.from(record, 'base64').toString('hex');
    let splt = hex.replaceAll(regexConst, ',').split(','); 
    wallet = Address.fromString(splt[0]).bech32()
    token_to = hex2a(splt[1]);
    amount_to = parseInt(splt[2], 16);
    token_from = hex2a(splt[3]);
    amount_from = parseInt(splt[4], 16);
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

  return (
    <Card style={{ width: '45rem' , display: 'flex' }} className="border-2 border-dark" >
      <Card.Header className="text-lg" style={{ backgroundColor : 'LightCyan'}} >  Offer for {wallet}  </Card.Header>
      <div>
      <Card.Body>
        <Card.Title> You sent <span style={{ color : 'DarkCyan' }} >{amount_to_human} </span> tokens of type  <span style={{ color : 'DarkCyan' }} >{token_to} </span> to the pact smart contract. </Card.Title>
        <Card.Title> You will receive <span style={{ color : 'DarkCyan' }} > {amount_from_human} </span> tokens of type <span style={{ color : 'DarkCyan' }} > {token_from} </span> in exchange 
          when the peer wallet accepts your offer. </Card.Title>
        <Card.Text>
        </Card.Text>
      </Card.Body>
      <Card.Body  style={{ display: 'flex', width: '45rem', flexDirection: "row",   justifyContent: "center", paddingTop: '0rem', marginTop: '0rem'}} > 
        <Button style={{  width: '8rem' }} variant="primary" onClick={handleCancelClick}>Remove offer</Button>
        </Card.Body>
      </div>
    </Card>
  )
} catch (error) {
   return (
    <></>
   )
}
}
export default SendElement