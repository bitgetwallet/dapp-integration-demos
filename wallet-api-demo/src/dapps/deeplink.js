import EventSource, {
  EventSourceListener,
  MessageEvent,
} from "react-native-sse";
import {
  AppRequest,
  Base64,
  ConnectEvent,
  ConnectRequest,
  DisconnectEvent,
  hexToByteArray,
  RpcMethod,
  SEND_TRANSACTION_ERROR_CODES,
  SessionCrypto,
  WalletResponse,
  ConnectItemReply
} from "@tonconnect/protocol";
// import debounce from 'lodash/debounce';

const TonConnectBridgeType = {
  Remote: "remote",
  Injected: "injected",
};

const DeeplinkOrigin = {
  DEEPLINK: "DEEPLINK",
  QR_CODE: "QR_CODE",
};

class TonConnectRemoteBridgeService {
  storeKey = "ton-connect-http-bridge-lastEventId";
  bridgeUrl = "https://bridge.tonapi.io/bridge";
  defaultTtl = 300;
  eventSource = null;
  connections = [];
  activeRequests = {};
  origin = null;
  returnStrategy = "back";

  setOrigin(origin) {
    this.origin = origin;
  }

  setReturnStrategy(returnStrategy) {
    if (returnStrategy) {
      this.returnStrategy = returnStrategy;
    }
  }

  async open(connections) {
    console.log('connections', connections);
    this.close();

    this.connections = connections.filter(
      (item) => item.type === TonConnectBridgeType.Remote,
    );

    if (this.connections.length === 0) {
      return;
    }

    const walletSessionIds = this.connections
      .map((item) => new SessionCrypto(item.sessionKeyPair).sessionId)
      .join(",");

    let url = `${this.bridgeUrl}/events?client_id=${walletSessionIds}`;

    const lastEventId = await this.getLastEventId();

    if (lastEventId) {
      url += `&last_event_id=${lastEventId}`;
    }

    console.log("sse connect", url);

    this.eventSource = new EventSource(url);

    this.eventSource.addEventListener(
      "message",
      // debounce(this.handleMessage.bind(this), 200),
      this.handleMessage.bind(this)
    );

    this.eventSource.addEventListener("open", () => {
      console.log("sse connect: opened");
    });

    this.eventSource.addEventListener("error", (event) => {
      console.log("sse connect: error", event);
    });
  }

  close() {
    console.log("this.eventSource", this.eventSource);
    if (this.eventSource) {
      this.eventSource.removeAllEventListeners();
      this.eventSource.close();

      this.eventSource = null;

      console.log("sse close");
    }
  }

  async setLastEventId(lastEventId) {
    try {
      // await AsyncStorage.setItem(this.storeKey, lastEventId);
    } catch {}
  }

  async getLastEventId() {
    try {
      // return await AsyncStorage.getItem(this.storeKey);
    } catch {
      return null;
    }
  }

  async send(response, sessionCrypto, clientSessionId, ttl) {
    try {
      const url = `${this.bridgeUrl}/message?client_id=${
        sessionCrypto.sessionId
      }&to=${clientSessionId}&ttl=${ttl || this.defaultTtl}`;

      const encodedResponse = sessionCrypto.encrypt(
        JSON.stringify(response),
        hexToByteArray(clientSessionId),
      );

      await fetch(url, {
        body: Base64.encode(encodedResponse),
        method: "POST",
      });
    } catch (e) {
      console.log("send fail", e);
    }
  }

  async handleMessage(event) {
    console.log("handleMessage", event);
    try {
      // if (event.lastEventId) {
      //   this.setLastEventId(event.lastEventId);
      // }
      // const { from, message } = JSON.parse(event.data);
      // console.log("handleMessage", from);
      // const connection = this.connections.find(
      //   (item) => item.clientSessionId === from,
      // );
      // if (!connection) {
      //   console.log(`connection with clientId "${from}" not found!`);
      //   return;
      // }
      // const sessionCrypto = new SessionCrypto(
      //   connection.sessionKeyPair,
      // );
      // const request = JSON.parse(
      //   sessionCrypto.decrypt(
      //     Base64.decode(message).toUint8Array(),
      //     hexToByteArray(from),
      //   ),
      // );
      // if (this.activeRequests[from]) {
      //   await this.send(
      //     {
      //       error: {
      //         code: SEND_TRANSACTION_ERROR_CODES.USER_REJECTS_ERROR,
      //         message: "User has already opened the previous request",
      //       },
      //       id: request.id,
      //     },
      //     sessionCrypto,
      //     from,
      //   );
      //   return;
      // }
      // this.activeRequests[from] = request;
      // console.log("handleMessage request", request);
      // const response = await TonConnect.handleRequestFromRemoteBridge(
      //   request,
      //   from,
      //   connection.walletIdentifier,
      // );
      // delete this.activeRequests[from];
      // console.log("handleMessage response", response);
      // await this.send(response, sessionCrypto, from);
      // if (request.method !== "disconnect") {
      //   this.redirectIfNeeded();
      // }
    } catch (e) {
      console.log("handleMessage error");
      console.error(e);
    }
  }

  //   redirectIfNeeded() {
  //     console.log("returnStrategy", this.returnStrategy);
  //     if (this.origin === DeeplinkOrigin.DEEPLINK) {
  //       if (this.returnStrategy === "back") {
  //         Minimizer.goBack();
  //       } else if (this.returnStrategy !== "none") {
  //         const url = this.returnStrategy;

  //         Linking.openURL(url).catch((error) =>
  //           console.log("returnStrategy link error", error),
  //         );
  //       }
  //     }

  //     this.origin = null;
  //     this.returnStrategy = "back";
  //   }

  async handleConnectDeeplink(query) {
    try {
      const protocolVersion = Number(query.v);
      const request = JSON.parse(decodeURIComponent(query.r));
      const clientSessionId = query.id;

      console.log("handleConnectDeeplink request", request);

      const sessionCrypto = new SessionCrypto();

      //   const response = await TonConnect.connect(
      //     protocolVersion,
      //     request,
      //     sessionCrypto,
      //     clientSessionId,
      //   );

      const res = await window.openmask.tonconnect.connect(protocolVersion, request);
      console.log('res', res);

      // console.log("handleConnectDeeplink response", response);

      // await this.send(response, sessionCrypto, clientSessionId);
      await this.send(
        {
          id: 1,
          ...res,
        //   event: "connect",
        //   payload: {
        //     items: [{ name: "ton_addr" }],
        //     device: "tonConnectDeviceInfo",
        //   },
        },
        sessionCrypto,
        clientSessionId,
      );

      // this.redirectIfNeeded();
    } catch (err) {
      console.log("handleConnectDeeplink error", err);

      // Toast.hide();
    }
  }

  //   sendDisconnectEvent(connection) {
  //     const sessionCrypto = new SessionCrypto(connection.sessionKeyPair);

  //     const event = {
  //       id: TCEventID.getId(),
  //       event: "disconnect",
  //       payload: {},
  //     };

  //     this.send(event, sessionCrypto, connection.clientSessionId);
  //   }

  //   async closeOtherTransactions() {
  //     const currentRouteName = getCurrentRoute()?.name;

  //     if (
  //       ["SheetsProvider", AppStackRouteNames.ModalContainer].includes(
  //         currentRouteName,
  //       )
  //     ) {
  //       const returnStrategy = this.returnStrategy;

  //       this.setReturnStrategy("none");
  //       goBack();

  //       this.setReturnStrategy(returnStrategy);

  //       await delay(1000);
  //     }
  //   }
}

export default function Deeplink() {
  return (
    <>
      <button
        onClick={() => {
          const TonConnectRemoteBridge = new TonConnectRemoteBridgeService();
          console.log(TonConnectRemoteBridge);
          TonConnectRemoteBridge.open([]);

          const deeplink =
          'tc://?v=2&id=3614eda84e4b36a13418744565f8847dbfa0ef48bb6e7f778a17b5b2113d2b21&r=%7B%22manifestUrl%22%3A%22https%3A%2F%2Ftonup.io%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%5D%7D&ret=none';
          const url = new URL(deeplink);

          TonConnectRemoteBridge.setOrigin(origin);
          TonConnectRemoteBridge.setReturnStrategy(url.searchParams.get("ret"));

          const params = {
            v: url.searchParams.get("v"),
            r: url.searchParams.get("r"),
            id: url.searchParams.get("id"),
          };
          console.log("params", params);

          TonConnectRemoteBridge.handleConnectDeeplink(params);
        }}
      >
        TonConnect
      </button>
    </>
  );
}
