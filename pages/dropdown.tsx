import React, { useEffect, useRef } from 'react'
import { useState, Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { SelectorIcon } from '@heroicons/react/solid'
import { useLayoutEffect } from "react";
import { network  } from "../config"; 
import divide from 'divide-bigint' 
import Button from 'react-bootstrap/Button';
import InputNumber from 'rc-input-number';
import Image from 'next/image'
import {tokens} from '../components/Tokens';

const myLoader = ({ src }) => {
  return `/tokens/${src}.png`
}

function dropdown( props: { display_max: String; address:any; enforce_max: Boolean, handleCallback: any, selected_token: String })  {

    let nf = new Intl.NumberFormat('en-US');
    let unavailable_token = String(props.selected_token).split(',')[1];

    tokens.map((token) => {
      if (token.full_name == unavailable_token) {
        token.unavailable = true;
      } else {
        token.unavailable = false;
      }
    });

    const [selected, setSelected] = useState('')
    const [balance, setBalance] = useState(0)
    const [balanceHuman, setBalanceHuman] = useState(0)
    const [value, setValue] = useState(0)
    const [valueHuman, setValueHuman] = useState(0)
    
    const ref = useRef();
    const isMounted = useRef(false);
    useLayoutEffect(() => {
      setValueHuman(0);
      setValue(0);
      setBalanceHuman(0);
      setBalance(0);
      if (props.enforce_max) {
        if (isMounted.current) {
          const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          };
          fetch(network['apiAddress'] + '/accounts/' + props.address + '/tokens/' + selected['full_name'], requestOptions)
              .then( (response) => 
              { 
                if (!response.ok)  
                  {
                    if(response.status === 404) {
                      return Promise.reject('error 404')
                  }
                }
                return response.json();
              })
              .then(data => {
                if (data['balance']) {
                  let tempValue: number = divide(BigInt(data['balance']), Math.pow(10,Number(selected['decimals'])));
                  setBalance(data['balance']);
                  setBalanceHuman(tempValue);
                } 
                }).catch(function() {
                });
          } else {
          isMounted.current = true;
        }
        }},[selected]);

    function onHandleChange(valueHuman: number) {
      let tempValue = valueHuman * Math.pow(10,Number(selected['decimals']));
      if (tempValue >= balance && props.enforce_max == true) {
        setValue(balance);
        setValueHuman(balanceHuman.toLocaleString());
      } else {
        setValue(tempValue);
        setValueHuman(valueHuman);
      }
    }
    
    function onHandleMax() {
      if (selected !== '') {
        let tempValue: number = divide(BigInt(balance), Math.pow(10,Number(selected['decimals'])));
        setValue(balance);
        setValueHuman(tempValue);
      }
    }

    useEffect(() => {
      setValueHuman(valueHuman);
      ref.current.value = valueHuman;
      props.passData([value, selected.full_name]);
    }, [valueHuman])

    useEffect(() => {
      ref.current.value = 0;
      props.passData([value, selected.full_name]);
    }, [selected])

  return (
    <Listbox style={{width: '14.5rem'}} value={selected} onChange={setSelected}>
    <div className="relative mt-1">
      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm h-14" >
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <SelectorIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
        {selected ? 
            <div style={{ display: 'flex', flexDirection: "row", justifyContent: "left", alignItems: "center"}}> 
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                    <Image
                          loader={myLoader}
                          src = {selected.full_name}
                          width={40}
                          height={40}
                        />
                    <div>
                    &nbsp;&nbsp;&nbsp;{selected.name}
                      </div>
            </div> : 
              <div> Select token
                </div>}
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
              className={({ active }) =>
                `relative cursor-pointer select-none py-1 pr-20 ${
                  active ? 'bg-green-300' : 'text-gray-900'
                }`
              }
              value={token} 
              disabled={token.unavailable}
            >
              {({ selected  }) => (
                <>
                  <span style={{ display: 'flex', flexDirection: "row", alignItems: "center"}}
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
                      &nbsp;&nbsp;&nbsp;{token.name}
                      </div>
                  </span>
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>  
      </Transition>
      <div style={{ paddingTop : '1rem', paddingBottom: '1rem' }} >
        <InputNumber ref={ref} value={valueHuman>0? nf.format(valueHuman): null} onChange={(value) => onHandleChange(value)} className="form-control" min={0} max={props.enforce_max? balanceHuman: BigInt(Number.MAX_SAFE_INTEGER) } placeholder='Enter Amount'/>                
      </div>
      <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >
         <Button style={{ display : props.display_max}} onFocus={(e:any) => (e.target.blur())} onClick = {onHandleMax} variant="primary"> Max </Button> 
         <div className="grow" style={{ display: 'flex', flexDirection: "column" }} >
            <div style={{ display : props.display_max}} className="text-lg h-5 text-end mb-0 mb-0" >Balance: </div>
            <div style={{ display : props.display_max}} className="text-lg h-6.3 text-end mt-0 mp-0" >{nf.format(balanceHuman.toFixed(2))} </div>
         </div>
      </div>
      {/* {value} {valueHuman} */}
    </div>
  </Listbox>
  )

}

export default dropdown

 