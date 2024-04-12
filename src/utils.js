import {fileURLToPath} from 'url';
import path, { dirname } from 'path';
import ProductManager from './dao/ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
const productsFilePath = path.resolve(__dirname,'../data/products.json');
//const productManager = new ProductManager(productsFilePath);

export default __dirname;