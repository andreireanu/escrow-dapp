import React from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function sendTokens() {

    function handleCancelClick(){
    }


    return (
        <Card style={{ width: '45rem' }} className="border-2 border-dark" >
          <Card.Header style={{ backgroundColor : 'LightSalmon' }} >*** Only for testing purposes ***   </Card.Header>
          <div>
          <Card.Body>
            <Card.Title> Please claim test tokens. You will receive 1.000.000 tokens of each of the following types:
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