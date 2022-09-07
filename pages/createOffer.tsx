import React, { useState } from 'react'
import Card from 'react-bootstrap/Card';
import Dropdown from './dropdown'
import { Form } from 'semantic-ui-react'
import Button from 'react-bootstrap/Button';
import { useForm } from "react-hook-form";

function createOffer( {address} : {address: any}) {

    const [sendAddress, setSendAddress] = useState('');

    function onChangeAddress(sendAddress: String) {
        console.log("AAA : " + sendAddress );
        setSendAddress(sendAddress);
    }

    function onSubmit(){
        console.log("BBB : " + sendAddress);
    }

    return (
        <>
        <Card style={{ width: '45rem', height: '25rem' }} >
        <Card.Header style={{ backgroundColor: 'lightgreen' }} >Create offer  </Card.Header>
        <div>
            <Card.Body style={{ display: 'flex', flexDirection: "row", justifyContent: "space-evenly", paddingBottom: '0rem' }} >
                <Card.Title>&nbsp;&nbsp;Swap From:  
                <Dropdown address={address} display_max={'block'} enforce_max={true}></Dropdown> 
                </Card.Title>
                <Card.Title>&nbsp;&nbsp;Swap To:
                <Dropdown address={address} display_max={'none'} enforce_max={false}></Dropdown> 
                </Card.Title>  
            </Card.Body>
            <Card.Body>
            <Card.Title  style={{ paddingLeft: '4.3rem', paddingTop: '0rem' }} > &nbsp;&nbsp;Make offer for: </Card.Title>
            <Form>
                <Form.Field style={{ paddingLeft: '5.0rem', marginTop: '0rem' }} minLength={62} maxLength={62} onChange={e => onChangeAddress(e.target.value)}   >
                    <input style={{width: '33.5rem', height: '2.4rem', borderColor: 'lightGray', borderWidth: 1, borderRadius: '4px' }}  width={32} placeholder='&nbsp;Enter Address' />
                </Form.Field>
            </Form>
            </Card.Body>
        </div>
        <div  >
            <Card.Body  style={{ display: 'flex', width: '45rem', flexDirection: "row",   justifyContent: "center", paddingTop: '0rem' }} > 
                <Button variant="primary" onClick={onSubmit}> Make offer </Button> 
            </Card.Body>
        </div>
      </Card>
      </> 

    )
}

export default createOffer