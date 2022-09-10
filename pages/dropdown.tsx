import React, { useEffect, useRef } from 'react'
import { useState, Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { useLayoutEffect } from "react";
import { network  } from "../config"; 
import divide from 'divide-bigint' 
import Button from 'react-bootstrap/Button';
import InputNumber from 'rc-input-number';

import Image from 'next/image'

import ESC1 from '../tokens/ESC1-492f2b.png'
 
const myLoader = ({ src }) => {
  return `/tokens/${src}.png`
}

function dropdown( props: { display_max: String; address:any; enforce_max: Boolean, handleCallback: any, selected_token: String })  {

    let unavailable_token = String(props.selected_token).split(',')[1];
    console.log(unavailable_token);

    const tokens = [
        { id: 1, name: 'ESC1', full_name : 'ESC1-492f2b', unavailable: false, img: '../tokens/ESC1-492f2b.png' },
        { id: 2, name: 'ESC2', full_name : 'ESC2-83fea1', unavailable: false, img: '../tokens/ESC1-492f2b.png'},
        { id: 3, name: 'ESC3', full_name : 'ESC3-33fea1', unavailable: false, img: '../tokens/ESC1-492f2b.png' },
        { id: 4, name: 'ESC4', full_name : 'ESC4-44fea1', unavailable: false, img: '../tokens/ESC1-492f2b.png' },
        { id: 5, name: 'ESC5', full_name : 'ESC5-55fea1', unavailable: false, img: '../tokens/ESC1-492f2b.png' },
      ]

    let foundIndex = tokens.findIndex(element => element.full_name === unavailable_token);
    console.log(foundIndex);
    if (foundIndex > -1)
      {
        tokens[foundIndex].unavailable = true;
      }

    const [selected, setSelected] = useState('')
    const [balance, setBalance] = useState(0)
    const [balanceHuman, setBalanceHuman] = useState(0)
    const [value, setValue] = useState(0)
    const [valueHuman, setValueHuman] = useState(0)
    
    
    const ref = useRef(null);
    const isMounted = useRef(false);
    useLayoutEffect(() => {
      if (isMounted.current) {
        const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        };
        
        fetch(network['apiAddress'] + '/accounts/' + props.address + '/tokens/' + selected['full_name'], requestOptions)
            .then(response => response.json())
            .then(data => {
              if (data['balance']) {
                let value:  number = divide(BigInt(data['balance']), Math.pow(10,18));
                setBalance(data['balance'])
                setBalanceHuman(value)
              } else {
                setBalance(0);
                setBalanceHuman(0);
              }
              props.passData([value, selected.full_name]);
              });
        } else {
        isMounted.current = true;
      }
      },[selected] );

    function onHandleChange(valueHuman: number) {
      let tempValue = valueHuman * Math.pow(10,18);
      if (tempValue > balance && props.enforce_max == true) {
        setValue(balance);
        setValueHuman(balanceHuman);
      } else {
        setValue(tempValue);
        setValueHuman(valueHuman);
      }
      props.passData([value, selected.full_name]);
      

    }
    function onHandleMax() {
      setValue(balance);
      props.passData(balance);
      setValueHuman(balanceHuman);
    }

    useEffect(() => {
      ref.current.value = balanceHuman;
  }, [value])

 
  return (
    <Listbox style={{width: '14.5rem'}} value={selected} onChange={setSelected}>
    <div  className="relative mt-1">
      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm" >
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <SelectorIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
        {selected ? selected.name : "Select token"}
      </Listbox.Button>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {tokens.map((token, tokenIdx) => (
            <Listbox.Option
              key={tokenIdx}
              className={({ active   }) =>
                `relative cursor-default select-none py-2 pr-20 ${
                  active ? 'bg-green-300' : 'text-gray-900'
                }`
              }
              value={token} 
              disabled={token.unavailable}
       
            >
              {({ selected  }) => (
                <>
                  <span style={{ display: 'flex', flexDirection: "row", justifyContent: "space-evenly", alignItems: "center"}}
                    className={`block truncate ${
                      selected ? 'font-medium' : 'font-normal'
                    }`}
                   >
                    <Image
                          loader={myLoader}
                          src = {token.full_name}
                          width={40}
                          height={40}
                        />
                    <div>
                      {token.name}
                      </div>
                  </span>
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>  
      </Transition>
      <div style={{ paddingTop : '1rem', paddingBottom: '1rem' }} >
        <InputNumber ref={ref} onChange={(value) => onHandleChange(value)} className="form-control" min={0} max={props.enforce_max? balanceHuman: BigInt(Number.MAX_SAFE_INTEGER) } placeholder='Enter Amount'/>                
      </div>
      <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}  >
         <Button style={{ display : props.display_max}}  onClick = {onHandleMax} variant="primary"> Max </Button> 
         <div style={{ display : props.display_max}}>Balance: {balanceHuman.toFixed(2)}</div>
      </div>
      {value} {valueHuman}
    </div>

  </Listbox>
  
  )

}

export default dropdown

 