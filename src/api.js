const API_URL = 'https://world.openfoodfacts.org/api/v1/product'

export async function fetchProduct(barcode) {
    try {
        // console.log(barcode)
        const response = await fetch(`https://world.openfoodfacts.org/api/v1/product/4056489238829.json`)
        if (!response.ok) {
            console.log(response)
        }
        
        return await response.json()
    } catch(error) {
        console.log(error)
    }
}