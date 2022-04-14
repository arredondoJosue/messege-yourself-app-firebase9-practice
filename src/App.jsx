import { useState } from "react";
import "./App.css";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState();
  const [uid, setUid] = useState("");
  const [status, setStatus] = useState(false);

  // const handleChange = (e) => {
  //   setText(e.target.value);
  // };

  const msgRef = collection(db, "messages");
  const q = query(
    msgRef,
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(10)
  );

  function realTimeMessages() {
    onSnapshot(q, (snapshot) => {
      console.log(snapshot);

      let messages = [];
      snapshot.forEach((doc) => {
        messages.push(doc.data());
      });
      messages.map((message) => {
        setMessages([...messages]);
      });
      console.log("MESSAGES FROM APP: ", messages);
    });
  }

  const sendMessage = (e) => {
    e.preventDefault();

    setMessage(text);

    addDoc(msgRef, {
      text: text,
      createdAt: serverTimestamp(db),
      username: user,
      uid: uid,
    })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });

    setText("");
  };

  function signIn(e) {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        console.log("User Signed in");
        setUser(userCredential.user.email);
        setUid(userCredential.user.uid);
        // console.log("UID IS: ", userCredential.user.uid);
        setStatus(true);
        // ...
      })
      .catch((error) => {
        console.error(error);
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    setEmail("");
    setPassword("");
    realTimeMessages();
  }

  function logOut() {
    signOut(auth);
    setUser("");
    setStatus(false);
  }

  // reverses the order of the messages
  let x = [...messages].reverse();

  let messageList = x.map((msg) => {
    return (
      <div className="message-each">
        <span className="message-username">{msg.username}:</span>
        <span className="message-content">{msg.text}</span>
        {/* <span className="message-timestamp">{msg.createdAt}</span> */}
      </div>
    );
  });

  return (
    <div className="App">
      <header className="App-header">
        {status ? <h1>Welcome {user}</h1> : <h1>Please Login</h1>}
        <section className="message">
          {/* Messages: {message} */}
          <br />
          <h3>Your Firebase Messages</h3>{" "}
          <div className="messages">{user ? messageList : null}</div>
          <br />
        </section>
        <form onSubmit={signIn}>
          <input
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Password"
          />
          <button>Login</button>
        </form>
        <button onClick={logOut}>Logout</button>
      </header>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          name="text"
          placeholder="Enter your message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={realTimeMessages}>Send</button>
      </form>
    </div>
  );
}

export default App;
