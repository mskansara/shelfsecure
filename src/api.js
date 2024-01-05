const API_URL = 'https://world.openfoodfacts.org/api/v1/product'
import { db } from "../firebaseConfig"
import { getFirestore, collection, addDoc, Timestamp, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from "react";

const myCollection = collection(db, 'products')
const timestamp = Timestamp.now();
const data = {
    product_name: '',
    barcode: '',
    expiry_date: timestamp
}

export async function fetchProductName(barcode) {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v1/product/${barcode}.json`)
        if (!response.ok) {
            console.log(response)
        }
        const fetchedData = await(response.json())
        return fetchedData.product.product_name

    } catch(error) {
        console.log(error)
    }
}
export async function addProduct(barcode) {
    try {
        // console.log(barcode)
        const response = await fetch(`https://world.openfoodfacts.org/api/v1/product/${barcode}.json`)
        if (!response.ok) {
            console.log(response)
        }
        
        const fetchedData = await(response.json())

        data.product_name = fetchedData.product.product_name
        data.barcode = barcode
        data.expiry_date = timestamp
        
        const docRef = await addDoc(myCollection, data);

        return await response.json()
    } catch(error) {
        console.log(error)
    }
}

export async function fetchProducts() {
    
    try {
        const querySnapshot = await getDocs(myCollection);
        const fetchedData = [];
        querySnapshot.forEach((doc) => {
          fetchedData.push({ id: doc.id, ...doc.data() });
        });

        return await fetchedData;
        
    } catch (error) {
        console.log(error)
    }

}