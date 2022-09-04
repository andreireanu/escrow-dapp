import React, { useRef } from 'react'
import { useState, Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { useLayoutEffect } from "react";
import { network  } from "../config"; 
import { dateFormatAliases } from '@elastic/eui';

function dropdown({address} : {address: any}) {

    const tokens = [
        { name: 'ESC1-492f2b',   unavailable: false },
        { name: 'ESC2-83fea1' ,   unavailable: false },
      ]
    const [selected, setSelected] = useState()
    const [balance, setBalance] = useState()

    const isMounted = useRef(false);
    useLayoutEffect(() => {
      if (isMounted.current) {
        const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        };
        // let response:any;
        fetch(network['apiAddress'] + '/accounts/' + address + '/tokens/' + selected['name'], requestOptions)
            .then(response => response.json())
            .then(data => {
              // response = data;
              let value = BigInt(data['balance']) / ( Math.pow(10,18))
              console.log(value)
              })
        //     .then(() => console.log(response))
        // let value = BigInt(response['balance'])
        // console.log(value)


        } else {
        isMounted.current = true;
      }
      },[selected] );



      
  return (
    <Listbox style={{width: '20rem'}} value={selected} onChange={setSelected}>
    <div className="relative mt-1">
      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
        {/* <span className="block truncate">{selected.name}</span> */}
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
          {tokens.map((person, personIdx) => (
            <Listbox.Option
              key={personIdx}
              className={({ active }) =>
                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                  active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                }`
              }
              value={person}
              disabled={person.unavailable}
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? 'font-medium' : 'font-normal'
                    }`}
                  >
                    {person.name}
                  </span>
                  {selected ? (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </div>
  </Listbox>
  )
}

export default dropdown

 