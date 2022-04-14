{
  getDocs(q).then((snapshot) => {
    let messages = [];
    snapshot.forEach((doc) => {
      messages.push(doc.data());
    });
    console.log(messages);
    return messages.map((message) => {
      return (
        <div className="message">
          <span className="message-username">{message.uid}</span>
          <span className="message-content">{message.text}</span>
        </div>
      );
    });

    // onSnapshot(q, (snapshot) => {
    //   console.log(snapshot);

    //   let messages = [];
    //   snapshot.forEach((doc) => {
    //     messages.push(doc.data());
    //   });
    //   console.log(messages);
    //   messages.map((message) => {
    //     {
    //       message.text;
    //     }
    //   });
    // })
  });
}

const realTimeMessages = onSnapshot(q, (snapshot) => {
  console.log(snapshot);

  let messages = [];
  snapshot.forEach((doc) => {
    messages.push(doc.data());
  });
  console.log(messages);
  messages.map((message) => {
    return (
      <div className="message">
        <span className="message-username">{message.uid}</span>
        <span className="message-content">{message.text}</span>
      </div>
    );
  });
});

{
  /* {user
            ? getDocs(q).then((snapshot) => {
                let messages = [];
                snapshot.docs.forEach((doc) => {
                  messages.push(doc.data());
                });
                console.log(messages);
                return messages;
              })
            : null} */
}
