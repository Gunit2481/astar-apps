import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore/lite';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { DappItem, NewDappItem } from 'src/store/dapps-store/state';

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: 'AIzaSyBS6tU69xQAnfWfI4U9vmErJ7qBDnO7MOI',
  authDomain: '',
  databaseURL: '',
  projectId: 'astarnetwork-a4924',
  storageBucket: 'gs://astarnetwork-a4924.appspot.com',
  messagingSenderId: '',
  appId: '',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();

const getDapps = async (collectionName: string): Promise<QuerySnapshot<DocumentData>> => {
  const dbCollection = collection(db, collectionName);
  const docs = await getDocs(dbCollection);
  return docs;
};

const addDapp = async (collectionName: string, dapp: NewDappItem): Promise<DappItem> => {
  const newDapp = {
    name: dapp.name,
    description: dapp.description,
    address: dapp.address,
    url: dapp.url,
    iconUrl: dapp.iconUrl,
  } as DappItem;

  await setDoc(doc(db, collectionName, newDapp.address), newDapp);

  return newDapp;
};

const uploadFile = async (fileName: string, collectionKey: string, base64Content: string) => {
  const imagesRef = ref(storage, `${collectionKey}/${fileName}`);
  const result = await uploadString(imagesRef, base64Content, 'data_url');
  const url = await getDownloadURL(ref(storage, result.metadata.fullPath));

  return url;
};

// export utils/refs
export { db, getDocs, setDoc, doc, uploadFile, addDapp, getDapps };