import '../styles/globals.css';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '../firebase';
import Login from './login';
import Loading from '../components/Loading';
import { useEffect } from 'react';
import firebase from 'firebase';

function MyApp({ Component, pageProps }) {
  /**this is to chech if there is a authticated user
   * then pass it to [user]
   * this is a real time authenticate state and will update
   * the user and return the compoent
   */
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      /**when the user logs in for either the first time
       * or every time it updates info and detail and use later on
      */
      db.collection("user").doc(user.uid).set({
        email: user.email,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: user.photoURL,
      },
      { merge: true }
      );
    }
  }, [user])

  /**gives loading feature after logged in */
  if (loading) return <Loading />

  /**if there is no user then return to login page */
  if (!user) return <Login />

  return <Component {...pageProps} />
}

export default MyApp
