import React from 'react'
import Card from 'react-bootstrap/Card';
import Dropdown from './dropdown'

function createOffer( {address} : {address: any}) {

    return (
        <Card style={{ width: '45rem', height: '22rem' }}  >
        <Card.Header style={{ backgroundColor : 'LightGreen' }} >Create offer  </Card.Header>
        <Card.Body style={{ display: 'flex', flexDirection: "row", justifyContent: "space-around" }} >
            <Card.Title > Swap From:  
            <Dropdown  address={address} display_max={'block'}></Dropdown> 
            </Card.Title>
            <Card.Title> Swap To:
            <Dropdown address={address} display_max={'none'}></Dropdown> 
            </Card.Title>  
      </Card.Body>
      </Card> 
    )
}

export default createOffer