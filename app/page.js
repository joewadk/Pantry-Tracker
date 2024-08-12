'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from '@/firebase'
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, doc, deleteDoc, getDocs, query, setDoc, getDoc, writeBatch } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventorylist = [];
    docs.forEach((doc) => {
      inventorylist.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventorylist);
    console.log(inventorylist);
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity == 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  }

  const emptyCart = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const batch = writeBatch(firestore);
    docs.forEach((doc) => {
      const docRef = doc.ref;
      batch.delete(docRef);
    });
    await batch.commit();
    await updateInventory();
  }

  const searchItem = () => {
    const result = inventory.find(item => item.name.toLowerCase() === searchQuery.toLowerCase());
    setSearchResult(result || null);
  }

  useEffect(() => {
    updateInventory();
  }, [])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSearchOpen = () => setSearchOpen(true);
  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResult(null);
  };

  return (
    <Box width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      {/* Add Item Modal */}
      <Modal
        open={open}
        onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)"
          }}
        >
          <Typography
            variant="h6">
            Add Item
          </Typography>

          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            ></TextField>
            <Button variant="outlined" onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}>
              Add
            </Button>
          </Stack>
        </Box></Modal>

      {/* Search Item Modal */}
      <Modal
        open={searchOpen}
        onClose={handleSearchClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)"
          }}
        >
          <Typography
            variant="h6">
            Search Item
          </Typography>

          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            ></TextField>
            <Button variant="outlined" onClick={() => {
              searchItem();
            }}>
              Search
            </Button>
          </Stack>
          {searchResult ? (
            <Box
              mt={3}
              bgcolor={"#f0f0f0"}
              padding={2}
              borderRadius={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" color='#333'>
                {searchResult.name.charAt(0).toUpperCase() + searchResult.name.slice(1)}
              </Typography>
              <Typography variant="h6" color='#333'>
                Quantity: {searchResult.quantity}
              </Typography>
            </Box>
          ) : (
            searchQuery && <Typography mt={3} color='error'>Item not found</Typography>
          )}
        </Box></Modal>

      <Stack direction='row' spacing={2}>
        <Button variant='contained' onClick={() => {
          handleOpen()
        }}>
          Add New Item
        </Button>
        <Button variant='contained' onClick={() => {
          handleSearchOpen()
        }}>
          Search Item
        </Button>
        <Button variant='contained' onClick={emptyCart}>
          Empty Cart
        </Button>
      </Stack>
      <Box border={"1px solid #333"}>
        <Box width="800px" height="100px" bgcolor={"#ADD8E6"} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Typography variant="h2" color='#333'>Inventory Items</Typography>
        </Box>

        <Stack width='800px' height='300px' spacing={2} overflow={'auto'}>
          {
            inventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width='100%'
                minHeight={"150px"}
                display="flex"
                alignItems={"center"}
                justifyContent={"space-between"}
                bgColor={"#f0f0f0"}
                padding={5}
              >
                <Typography variant='h3'
                  color='#333'
                  textAlign={'center'}
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant='h3'
                  color='#333'
                  textAlign={'center'}
                >
                  {quantity}
                </Typography>
                <Stack direction='row' spacing={2}>
                  <Button variant="contained" onClick={() => (addItem(name))}>
                    Add
                  </Button>
                  <Button variant="contained" onClick={() => (removeItem(name))}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
        </Stack>
      </Box>
    </Box>);
}
