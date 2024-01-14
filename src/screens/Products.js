import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { fetchProducts } from "../api";
import { Card, Title, Paragraph } from 'react-native-paper';

const Products = () => {
    const [data, setData] = useState([])
    // setData(fetchedData);
    const today = new Date();
    
    const fetchAllProducts = async () => {
        try {
            const fetchedData = await fetchProducts();
            setData(fetchedData)
            

        } catch(error) {
            console.log(error)
        }
    }
    const formatTimestamp = (timestamp) => {
        const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date object
        return date.toDateString(); // Convert Date object to a readable date string
    };
    useEffect(() => {
        fetchAllProducts();
    }, [data])

    return (
        <ScrollView>
            {data.map((doc) => (
                <Card key={doc.id} style={{ margin: 10 }}>
                    <Card.Content>
                    <Title>Product Name: {doc.product_name}</Title>
                    <Paragraph>Expiry Date: {formatTimestamp(doc.expiry_date)}</Paragraph>
                    <Paragraph>Barcode: {doc.barcode}</Paragraph>
                    <Paragraph>Status: {today >= doc.expiry_date.toDate() ? <Paragraph style={{color: 'red'}}>Expired</Paragraph> : <Paragraph style={{color: 'green'}}>Good</Paragraph>}</Paragraph>
                    </Card.Content>
                </Card>
            ))}
        </ScrollView>
    );
};

export default Products;