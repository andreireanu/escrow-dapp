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
        console.log(txResult);
      };

    const [validAddress, setValidAddress] = useState('none');
    const [validData, setValidData] = useState('none');
    const [sendAddress, setSendAddress] = useState('');
    const [sendData, setSendData] = useState('');
    const [receiveData, setReceiveData] = useState('');

    function onChangeAddress(sendAddress: String) {
        setSendAddress(sendAddress);
    }

    function onMakeOffer(){
        const regex = /erd1/g;
        const found = sendAddress.match(regex);

        if (String(found) === 'erd1' && sendAddress.length == 62){
            setValidAddress('none');
            console.log(sendAddress);
            console.log(sendData[0]);
            console.log(receiveData[0]);
            console.log(sendData[1]);
            console.log(receiveData[1]);
            if (sendData[0] === '0' || receiveData[0] === '0' ||
                sendData[0] === 0 || receiveData[0] === 0 ||
                sendData[1] === undefined || receiveData[1] === undefined)
                {
                    setValidData('inline');
                } else 
                {
                    setValidData('none'); 

                                        
                    let wallet = Address.fromString(sendAddress).hex();
                    console.log("wallet: " + wallet);
                    // let token_to_hex = splt[1]
                    // let token_to = hex2a(token_to_hex);
                    // let amount_to_hex = (splt[2])
                    // let amount_to = parseInt(splt[2], 16);
                    // let token_from_hex = splt[3]
                    // let token_from = hex2a(token_from_hex);
                    // let amount_from_hex = splt[4];
                    // let amount_from = parseInt(splt[4], 16);
                    
                    
                    // let data = 'ESDTTransfer@' + token_to_hex + "@" + amount_to_hex + 
                    //     '@6163636570744f66666572' + // acceptOffer function name in hex         
                    //     '@' + token_to_hex + "@" + amount_to_hex  + 
                    //     '@' + token_from_hex + "@" + amount_from_hex + 
                    //     '@' + wallet_hex;

                    let data = 'ESDTTransfer@' + wallet;
                    console.log(data);


                    // sendTransaction(data);
               

                }
        } else 
        {
            setValidAddress('inline');
        }
    }

    const passDataSend = (data) => {
        setSendData(data);
      };
    
    const passDataReceive = (data) => {
        setReceiveData(data);
      };

    return (
        <>
        <Card style={{ width: '45rem', height: '26rem' }} >
        <Card.Header style={{ backgroundColor: "#86EFAC" }} >Create offer  </Card.Header>
        <div>
            <Card.Body style={{ display: 'flex', flexDirection: "row", justifyContent: "space-evenly", paddingBottom: '0rem' }} >
                <Card.Title>&nbsp;&nbsp;Swap From:  
                <Dropdown passData={passDataSend} address={address} display_max={'block'} enforce_max={true} selected_token={receiveData}></Dropdown> 
                </Card.Title>
                <Card.Title>&nbsp;&nbsp;Swap To:
                <Dropdown passData={passDataReceive} address={address} display_max={'none'} enforce_max={false} selected_token={sendData} ></Dropdown> 
                </Card.Title>  
            </Card.Body>
            <Card.Body>
            <div style={{ display: 'flex',  width: '38.5rem', flexDirection: "row", justifyContent: "space-between"}}>
                <Card.Title  style={{ paddingLeft: '4.3rem', paddingTop: '0rem' }} > &nbsp;&nbsp;Make offer for: </Card.Title>
                <div style={{ display : validAddress, color: 'red'}}> Invalid address </div>
                <div style={{ display : validData, color: 'red'}}> Please check missing swap data </div>
            </div>
            <Form>
                <Form.Field style={{ paddingLeft: '5.0rem', marginTop: '0rem' }} minLength={62} maxLength={62} onChange={e => onChangeAddress(e.target.value)}   >
                    <input style={{ width: '33.5rem', height: '2.4rem', borderWidth: 1, borderRadius: '4px', borderColor: validAddress=='none'? 'lightgray':'red' }}    width={32} placeholder='&nbsp;Enter Address' />
                </Form.Field>
            </Form>
            </Card.Body>
        </div>
        <div>
            <Card.Body  style={{ display: 'flex', width: '45rem', flexDirection: "row",   justifyContent: "center", paddingTop: '0rem' }} > 
                <Button variant="primary" onClick={onMakeOffer}> Make offer </Button> 
            </Card.Body>
        </div>
      </Card>
      </> 

    )
}

export default createOffer