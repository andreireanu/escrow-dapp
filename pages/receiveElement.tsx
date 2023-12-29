import React from 'react'
import { Address } from "@multiversx/sdk-core";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {useTransaction} from "../hooks/useTransaction";
// import {useState} from "react";
// import {webWalletTxReturnPath } from '../utils/routes';
import {contractAddress} from "../config"; 
import {tokens} from '../components/Tokens';
import {chainId} from "../config"; 

function hex2a(hexx: String) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substring(i, i+2), 16));
    return str;
}

function ReceiveElement( {record} : {record: String}) {

  let nf = new Intl.NumberFormat('en-US');
  const {makeTransaction} = useTransaction(); 

  let token_to : string;
  let amount_to: number;
  let token_from : string;
  let amount_from : number;
  let wallet : string;
  let token_to_hex : string;
  let amount_to_hex : string;
  let token_from_hex : string;
  let amount_from_hex : string;
  let wallet_hex : string;

  function handleAcceptClick() {
    let data = 'ESDTTransfer@' + token_to_hex + "@" + amount_to_hex + 
                '@6163636570744f66666572' + // acceptOffer function name in hex         
                '@' + token_to_hex + "@" + amount_to_hex  + 
                '@' + token_from_hex + "@" + amount_from_hex + 
                '@' + wallet_hex;
    sendTransaction(data);
    }   

  const sendTransaction = async (data: string) => {
    const txResult = await makeTransaction({
        receiver: contractAddress,
        data: data,
        gasLimit: 10000000,
        chainId: chainId,
        webReturnUrl: window.location.origin,
    });
  };

  try {
    console.log(record);
    const hex = Buffer.from(record, 'base64').toString('hex');
    console.log("HERE");
    console.log(hex);
    let regexConst = new RegExp(/0000000(?!0)./g);
    let splt = hex.replaceAll(regexConst, ',').split(','); 
    console.log(splt);
    wallet_hex = splt[0];
    wallet = Address.fromString(wallet_hex).bech32()
    token_to_hex = splt[1]
    token_to = hex2a(token_to_hex);
    amount_to_hex = (splt[2])
    amount_to = parseInt(splt[2], 16);
    token_from_hex = splt[3]
    token_from = hex2a(token_from_hex);
    amount_from_hex = splt[4];
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
    const amount_from_human = amount_from / ( Math.pow(10,Number(decimal_from)));
 
  return (
     <Card style={{ width: '45rem' }} className="border-2 border-dark" >
      <Card.Header className="text-lg" style={{ backgroundColor : 'PeachPuff' }} >Offer from {wallet}</Card.Header>
      <Card.Body style={{ display: 'flex', flexDirection: "column", justifyContent: "space-evenly", paddingBottom: '0rem' }} >
        <Card.Title> You will send <span style={{ color : 'Coral' }} > {nf.format(amount_to_human)} </span> tokens of type  <span style={{ color : 'Coral' }} >{token_to} </span> to the peer pact smart contract. </Card.Title>
        <Card.Title> You will receive <span style={{ color : 'Coral' }}> {nf.format(amount_from_human)} </span> tokens of type <span style={{ color : 'Coral' }} >{token_from} </span> in exchange immediately. </Card.Title>
        <Card.Text>
        </Card.Text>
      </Card.Body>
      <Card.Body  style={{ display: 'flex', width: '45rem', flexDirection: "row",   justifyContent: "center", paddingTop: '1.5srem'}} > 
        <Button style={{  width: '8rem' }} variant="primary" onClick={handleAcceptClick}>Accept offer</Button>
        </Card.Body>
        </Card>
  )
} catch (error) {
   return (
    <></>
   )
}
}

export default ReceiveElement

 