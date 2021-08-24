import dynamic from 'next/dynamic';
import {useState,useEffect} from 'react';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {db} from '../firebase';
import {useSession} from 'next-auth/client';
import {useRouter} from 'next/dist/client/router';
import {EditorState,convertFromRaw,convertToRaw} from "draft-js";
import {useDocumentOnce} from 'react-firebase-hooks/firestore';

// dynamic import for editor
const Editor = dynamic(() => import ("react-draft-wysiwyg").then((module) => module.Editor), {ssr: false});

const TextEditor = () => {

  const [editorstate,seteditorstate] = useState(EditorState.createEmpty());
  const router = useRouter();
  const {id} = router.query;
  const [session] = useSession();
  const [snapshot] = useDocumentOnce(db.collection('userDocs').doc(session.user.email).collection('docs').doc(id));

  useEffect(() => {
  if(snapshot?.data()?.editorstate){
    seteditorstate(EditorState.createWithContent(
      convertFromRaw(snapshot?.data()?.editorstate))
  )
}
},[snapshot])

    const onEditorStateChange = (editorstate) => {
      seteditorstate(editorstate);
      db.collection("userDocs").doc(session.user.email).collection("docs").doc(id).set({
        editorstate:convertToRaw(editorstate.getCurrentContent())
      },{
        merge:true,
      })
    };

    return (<div className="bg-gray-100 min-h-screen pb-6">
    <Editor
      editorState={editorstate}
      onEditorStateChange={onEditorStateChange}
       toolbarClassName="flex sticky top-0 z-50 !justify-center mx-auto" editorClassName="mt-6 bg-white shadow-lg max-w-5xl mx-auto mb-12 border p-6" />
  </div>)
}

export default TextEditor;
