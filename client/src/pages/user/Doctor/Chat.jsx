import React, { useEffect } from "react";
import { WeavyClient, WeavyProvider, Chat as WChat } from "@weavy/uikit-react";

const weavyClient = new WeavyClient({
  url: "https://6882e217ef634da6b907351e8f6f5b11.weavy.io",
  tokenFactory: async () => "wys_ifLTtkazw5zBYknpoVV3DVSF4Pvpbf2yKcup",
});

function Chat() {
 
  return (
    <div className="App">
      <WeavyProvider client={weavyClient}>
        <WChat uid="DemoChat" />
      </WeavyProvider>
    </div>
  );
}

export default Chat;
