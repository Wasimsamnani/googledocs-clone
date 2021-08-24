import Head from 'next/head';
import Header from '../Components/Header';
import Button from '@material-tailwind/react/Button';
import Icon from '@material-tailwind/react/Icon';
import Image from 'next/image';
import {getSession, useSession} from 'next-auth/client';
import Login from "../Components/Login";
import Modal from "@material-tailwind/react/Modal";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import {useState} from 'react';
import {db} from "../firebase";
import firebase from 'firebase';
import { useCollectionOnce } from 'react-firebase-hooks/firestore';
import DocumentRow from '../Components/DocumentRow';

export default function Home() {
  const [session] = useSession();
  const [showmodal, setshowmodal] = useState(false);
  const [input, setInput] = useState("");
  if (!session) return <Login/>;
  const [snapshot] =  useCollectionOnce(db.collection('userDocs').doc(session.user.email).collection('docs').orderBy("timestamp","desc"))


  const createDocument = () => {
    if(!input) return;
    db.collection('userDocs').doc(session.user.email).collection('docs').add({
      filename:input,
      timestamp:firebase.firestore.FieldValue.serverTimestamp()
    });

    setInput("");
    setshowmodal(false);
  };
  const modal = (
    <Modal size="sm" active={showmodal} toggler={()=>setshowmodal(false)}>
        <ModalBody>
          <input value={input} type="text" onChange={(e) => setInput(e.target.value)} className="outline-none w-full" placeholder="Enter name of document..." onKeyDown={(e) => e.key === "Enter" && createDocument()}/>
        </ModalBody>
        <ModalFooter>
          <Button color="blue" buttonType="link" onClick={() => setshowmodal(false)} ripple="dark">
            Cancle
          </Button>

          <Button color="blue" onClick={createDocument} ripple="light">
            Create
          </Button>
        </ModalFooter>
      </Modal>
  );
  return (
    <div>
    <Head>
      <title>Google Docs Clone</title>
      <link rel="icon" href="/favicon.ico"/>
    </Head>
    <Header/>
  {/* for modal popinf in */}
    {modal}

    <section className="bg-gray-100 pb-10 px-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between py-6">
          <h2 className="text-gray-700 text-lg">Start a new Document</h2>
          <Button color="gray" buttonType="outline" iconOnly={true} ripper="dark" className="border-0">
            <Icon name="more_vert" size="3xl"/>
          </Button>
        </div>
        <div>
          <div onClick={() => setshowmodal(true)} className="relative h-52 w-40 border-2 cursor-pointer hover:border-blue-700">
            <Image src="https://links.papareact.com/pju" layout="fill"/>
          </div>
          <p className="ml-2 mt-2 font-semibold text-sm text-gray-700">blank</p>
        </div>
      </div>
    </section>
    {/* icons walal section hai ye */}
    <section className="bg-white px-10 md:px-0">
      <div className="max-w-3xl mx-auto py-8 text-sm text-gray-700">
        <div className="flex item-center justify-between pb-5">
          <h2 className="font-medium flex-grow">My Documents</h2>
          <p className="mr-12">Date Created</p>
          <Icon name="folder" size="3xl" color="gray"/>
        </div>
      {snapshot?.docs.map((doc)=>{
        return <DocumentRow
        key={doc.id}
        id={doc.id}
        filename={doc.data().filename}
        date={doc.data().timestamp}
        />
      })}
    </div>
    </section>
  </div>)
}
export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {props: {
      session
    }};
}
