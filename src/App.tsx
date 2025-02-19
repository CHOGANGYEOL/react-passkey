import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  async function authenticatePasskey() {
    if (!window.PublicKeyCredential) {
      alert("이 브라우저는 WebAuthn을 지원하지 않습니다.");
      return;
    }

    try {
      const publicKeyRequest = {
        challenge: new Uint8Array(32), // 서버에서 받아오는 challenge 값
        allowCredentials: [],
        timeout: 60000,
        userVerification: "required",
      };

      const credential = await navigator.credentials.get({
        publicKey: publicKeyRequest,
      });

      console.log("Passkey 인증 성공:", credential);

      return JSON.stringify({
        id: credential.id,
        rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
        response: {
          clientDataJSON: btoa(
            String.fromCharCode(
              ...new Uint8Array(credential.response.clientDataJSON)
            )
          ),
          authenticatorData: btoa(
            String.fromCharCode(
              ...new Uint8Array(credential.response.authenticatorData)
            )
          ),
          signature: btoa(
            String.fromCharCode(
              ...new Uint8Array(credential.response.signature)
            )
          ),
          userHandle: credential.response.userHandle
            ? btoa(
                String.fromCharCode(
                  ...new Uint8Array(credential.response.userHandle)
                )
              )
            : null,
        },
      });
    } catch (error) {
      console.error("Passkey 인증 실패:", error);
      return null;
    }
  }

  const [passkeyData, setPasskeyData] = useState("");

  const handleCreatePasskey = async () => {
    const passkey = await authenticatePasskey();
    if (passkey) setPasskeyData(passkey);
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="flex flex-col items-center gap-4 p-6">
        <button
          onClick={handleCreatePasskey}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg"
        >
          Windows Security 팝업으로 패스키 생성
        </button>

        {passkeyData && (
          <div className="mt-4">
            <p className="text-lg font-semibold">패스키 생성 완료!</p>
            <textarea
              value={passkeyData}
              readOnly
              className="w-full h-40 p-2 border border-gray-300 rounded-lg"
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
