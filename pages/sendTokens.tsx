import React from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {tokensContractAddress} from "../config"; 
import {useTransaction} from "../hooks/useTransaction";

function sendTokens() {

  const {makeTransaction} = useTransaction(); 
  const sendTransaction = async (data: string) => {
    const txResult = await makeTransaction({
        receiver: tokensContractAddress,
        data: data,
        gasLimit: 10000000,
        webReturnUrl: window.location.origin,
    });
  };

    function handleCancelClick(){
      let data = 'sendTokens';
      sendTransaction(data);
    }


    return (
        <Card style={{ width: '45rem' }} className="border-2 border-dark" >
          <Card.Header style={{ backgroundColor : 'LightSalmon' }} >*** Only for testing purposes ***   </Card.Header>
          <div>
          <Card.Body>
            <Card.Title> Please claim the test tokens. You will receive 1.000.000 tokens of each of the following types:
                PACTA-EAAAAA, PACTB-EAAAAA, PACTC-EAAAAA, PACTD-EAAAAA, PACTE-EAAAAA,  </Card.Title>
            <Card.Text>
            </Card.Text>
          </Card.Body>
          <Card.Body  style={{ display: 'flex', width: '45rem', flexDirection: "row",   justifyContent: "center", paddingTop: '0rem', marginTop: '0rem'}} > 
            <Button style={{  width: '8rem' }} variant="primary" onClick={handleCancelClick}>Claim tokens</Button>
            </Card.Body>
          </div>
        </Card>
    )
}

export default sendTokens