import Button from '@material-tailwind/react/Button';
import Icon from '@material-tailwind/react/Icon';
import {useRouter} from 'next/dist/client/router';
import {useDocumentOnce} from 'react-firebase-hooks/firestore';
import {getSession, signOut, useSession} from 'next-auth/client';
import Login from "../../Components/Login";
import {db} from '../../firebase';
import TextEditor from '../../Components/TextEditor';
const Doc = (props) => {
  const [session] = useSession();
  if (!session)
    return <Login/>;
  const router = useRouter();
  const {id} = router.query;
  const [snapshot, loadingSnapshot] = useDocumentOnce(db.collection('userDocs').doc(session.user.email).collection('docs').doc(id));
  if (
    !loadingSnapshot && !snapshot
    ?.data()
      ?.filename) {
    router.replace("/");
  }
 const style="cursor-pointer p-2 rounded - lg ease - out hover:bg-gray-100 transition duration-200 "
 return (<div>
    <header className="flex justify-between item-center p-3 pb-1">
      <span onClick={() => router.push('.')} className="cursor-pointer">
        <Icon name="description" size="3xl" color="blue"/>
      </span>
      <div className="flex-grow px-2">
        <h2>{
            snapshot
              ?.data()
                ?.filename
          }</h2>
        <div className="flex items-center text-sm space-x-1 -ml-1 h-8 text-gray-600">
          <p className={style}>File</p>
          <p className={style}>Edit</p>
          <p className={style}>View</p>
          <p className={style}>Insert</p>
          <p className={style}>Format</p>
          <p className={style}>Tools</p>
        </div>
      </div>
      <Button color="lightBlue" buttonType="filled" block={false} className="hidden md:!inline-flex h-10" size="regular" rouded="false"  iconOnly={false} ripper="light">
      <Icon name="people" size="md"/>SHARE
      </Button>

      <img  className="rounded-full cursor-pointer h-10 w-10 ml-2" src={session.user.image} alt=""/>
    </header>
    <TextEditor/>
  </div>)
}

export default Doc;

export async function getSessionSideProps(context) {
  const session = await getSession(context);
  return {
    props:{
      session,
    },
  };
}
