import React from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {tokensContractAddress} from "../config"; 
import {useTransaction} from "../hooks/useTransaction";
import {chainId} from "../config"; 

function GetTokens() {

  const {makeTransaction} = useTransaction(); 
  const sendTransaction = async (data: string) => {
    await makeTransaction({
        receiver: tokensContractAddress,
        data: data,
        gasLimit: 10000000,
        chainId: chainId,
        webReturnUrl: window.location.origin,
    });
  };

    function handleCancelClick(){
      let data = 'sendTokens';
      sendTransaction(data);
    }

    return (
        <Card style={{ width: '45rem' }} className="border-2 border-dark" >
          <Card.Header className="text-lg" style={{ backgroundColor : 'LightSalmon' }} >*** Instructions for testing ***   </Card.Header>
          <div>
          <Card.Body>
            <Card.Title> Please claim 1 xEgld using this faucet: <a href="https://r3d4.fr/faucet">https://r3d4.fr/faucet</a> <br></br> Once you receive it claim the test tokens. You will receive 1,000,000 tokens of each of the following types:
            PACTA-153996, PACTB-313c12, PACTC-f05a55, PACTD-febac3 and PACTE-1312db which you can use to test the dApp.  </Card.Title>
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

export default GetTokens