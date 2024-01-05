import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { fetchProduct } from './src/api';
import Navigation from './src/components/Navigation';

export default function App() {
  return (
    <Navigation/>
  );
}

