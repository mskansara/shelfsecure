import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Button, Modal, Animated } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { addProduct, fetchProductName } from '../api';

const Barcode = () => {
    const translateY = useRef(new Animated.Value(600)).current;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [data,setData] = useState(null);

    const addProductDetails = async (data) => {
        const fetchedData = await addProduct(data);
        setData(fetchedData);
        console.log(fetchedData.product.product_name);
    }

    const fetchName = async (data) => {
        const name = await fetchProductName(data)
        console.log(name)
        setData(name)
    }
    
    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, [data]);

    const handleBarCodeScanned = ({ type, data }) => {
        fetchName(data);
        openModal();
        setIsModalVisible(true)
        setScanned(true);
        
        // addProductDetails(data);
        // alert(`Bar code with type ${type} and data ${data} has been scanned!`);

    };
    const openModal = () => {
        setIsModalVisible(true);
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
    };
    const closeModal = () => {
        Animated.timing(translateY, {
          toValue: 600,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setIsModalVisible(false));
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Modal transparent={true} visible={isModalVisible} onRequestClose={closeModal}>
                <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                        <Text>Data scanned:</Text>
                        <Text>{data ? `Type: ${data}` : 'No data scanned'}</Text>
                        <Button title="Close Modal" onPress={() => setIsModalVisible(false)} />
                    </View>
                    </View>
                </Animated.View>
            </Modal>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
      },
});

export default Barcode;