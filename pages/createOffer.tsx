import React, { useState } from 'react'
import Card from 'react-bootstrap/Card';
import Dropdown from './dropdown'
import { Form } from 'semantic-ui-react'
import Button from 'react-bootstrap/Button';
import {contractAddress} from "../config"; 
import {useTransaction} from "../hooks/useTransaction";
import {Address} from "@elrondnetwork/erdjs/out"; 

function a2hex(str: String)
  {
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	 }
	return arr1.join('');
   }

function createOffer( {address} : {address: any}) {

    const {makeTransaction} = useTransaction(); 
    const sendTransaction = async (data: string) => {
        const txResult = await makeTransaction({
            receiver: contractAddress,
            data: data,
            gasLimit: 10000000,
            webReturnUrl: window.location.origin,
        });
      };

    const [validAddress, setValidAddress] = useState('none');
    const [validData, setValidData] = useState('none');
    const [sendAddress, setSendAddress] = useState('');
    const [sendData, setSendData] = useState<[number, string]>([0, '']);
    const [receiveData, setReceiveData] = useState<[number, string]>([0, '']);

    function onChangeAddress(sendAddress: string) {
        setSendAddress(sendAddress);
    }

    function onMakeOffer(){
        const regex = /erd1/g;
        const found = sendAddress.match(regex);

        console.log(sendAddress)
        console.log(sendData[0])
        console.log(sendData[1])
        console.log(receiveData[0])
        console.log(receiveData[1])

        if (String(found) === 'erd1' && sendAddress.length == 62){
            setValidAddress('none');
            if (sendData[0] === 0 || receiveData[0] === 0)
                {
                    setValidData('inline');
                } else 
                {
                    setValidData('none'); 
                    let wallet_hex = Address.fromString(sendAddress).hex();
                    let token_to_hex = a2hex(sendData[1])
                    let amount_to_hex =  sendData[0].toString(16);
                    if (amount_to_hex.length % 2 == 1) {
                        amount_to_hex = "0" + amount_to_hex;
                    }
                    let token_from_hex = a2hex(receiveData[1])
                    let amount_from_hex =  receiveData[0].toString(16);
                    if (amount_from_hex.length % 2 == 1) {
                        amount_from_hex = "0" + amount_from_hex;
                    }
                    let data = 'ESDTTransfer@' + token_to_hex + "@" + amount_to_hex + 
                        '@6164644f66666572' + // addOffer function name in hex         
                        '@' + token_to_hex + "@" + amount_to_hex  + 
                        '@' + token_from_hex + "@" + amount_from_hex + 
                        '@' + wallet_hex;
                    // sendTransaction(data);
                }
        } else 
        {
            setValidAddress('inline');
        }
    }

    const passDataSend = (data: any) => {
        setSendData(data);
      };
    
    const passDataReceive = (data: any ) => {
        setReceiveData(data);
      };

    return (
        <>
        <Card style={{ width: '45rem', height: '26.5rem' }} className="border-2 border-dark" >
        <Card.Header style={{ backgroundColor: "#86EFAC" }} >Add offer  </Card.Header>
        <div>
            <Card.Body style={{ display: 'flex', flexDirection: "row", justifyContent: "space-evenly", paddingBottom: '0rem' }} >
                <Card.Title>&nbsp;&nbsp;Swap From:  
                <Dropdown handleCallback={passDataSend} address={address} display_max={'block'} enforce_max={true} selected_token={receiveData[1]} />
                </Card.Title>
                <Card.Title>&nbsp;&nbsp;Swap To:
                <Dropdown handleCallback={passDataReceive} address={address} display_max={'none'} enforce_max={false} selected_token={sendData[1]} ></Dropdown> 
                </Card.Title>  
            </Card.Body>
            <Card.Body>
            <div style={{ display: 'flex',  width: '38rem', flexDirection: "row", justifyContent: "space-between"}}>
                <Card.Title  style={{ paddingLeft: '4.3rem', paddingTop: '0rem' }} > &nbsp;&nbsp;&nbsp;Offer for: </Card.Title>
                <div style={{ display : validAddress, color: 'red'}}> Invalid address </div>
                <div style={{ display : validData, color: 'red'}}> Please check missing swap data </div>
            </div>
            <Form>
                <Form.Field style={{ paddingLeft: '4.6rem', marginTop: '0rem' }} minLength={62} maxLength={62} onChange={(e: { target: { value: string; }; }) => onChangeAddress(e.target.value)}   >
                    <input className="pl-3" style={{ width: '33.5rem', height: '2.4rem', borderWidth: 1, borderRadius: '4px', borderColor: validAddress=='none'? 'lightgray':'red' }}    width={32} placeholder='Enter Address' />
                </Form.Field>
            </Form>
            </Card.Body>
        </div>
        <div>
            <Card.Body  style={{ display: 'flex', width: '45rem', flexDirection: "row",   justifyContent: "center", paddingTop: '0rem'}} > 
                <Button style={{  width: '8rem' }} variant="primary" onClick={onMakeOffer} onFocus={(e:any) => (e.target.blur())} >Add offer</Button> 
            </Card.Body>
        </div>
      </Card>
      </> 
    )
}

export default createOffer