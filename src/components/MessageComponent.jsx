import React from 'react';

const MessageComponent = ({ content }) => {
  const lines = content.split('<br/>');
  
  return (
    <div>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MessageComponent;
