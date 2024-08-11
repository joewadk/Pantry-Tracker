'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import {firestore} from '@/firebase'
import { Box,Typography } from "@mui/material";
import { collection, deleteDoc, getDocs,query, setDoc} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory]= useState([])
  const [open,setOpen]=useState(false)
  const [itemName,setItemName ]=useState('')

  const updateInventory= async () =>{
    const snapshot =query(collection(firestore, 'inventory'))
    const docs= await getDocs(snapshot)
    const inventorylist=[]
    docs.forEach((doc) =>{
      inventorylist.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventorylist)
    console.log(inventorylist)
  }
  const removeItem= async ()=>{
    const docRef= doc(collection(firestore,'inventory'),item)
    const docSnap= await getDoc(docRef)
    if(docSnap.exists()){
      const{quantity}=docSnap.dated()
      if(quantity==1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef,{quantity:quantity-1})
      }
    }
    await updateInventory()
  }
  useEffect(() => {
    updateInventory()
  }, [])

  return (
    <Box>
      <Typography variant='h1'>Inventory Tracker</Typography>
      {inventory.forEach((item)=>{
        console.log(item)
        return(
        <>
        {item.name}
        {item.count}
        </>
        )
        })}
    </Box>);
}
