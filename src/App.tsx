import React, { useState } from 'react';

const Base64 = () => {
  const [regularInput, setRegularInput] = useState('');
  const [base64Input, setBase64Input] = useState('');
  const [binaryBase64, setBinaryBase64] = useState('');
  const [isUtf8, setIsUtf8] = useState(false); // Checkbox for ASCII/UTF-8
  const [isUrlSafe, setIsUrlSafe] = useState(false); // Checkbox for URL-safe Base64
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // State for light/dark mode

  // Convert Base64 to URL-safe Base64
  const toUrlSafeBase64 = (base64: string) => {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  // Convert URL-safe Base64 back to standard Base64
  const fromUrlSafeBase64 = (urlSafeBase64: string) => {
    return urlSafeBase64.replace(/-/g, '+').replace(/_/g, '/');
  };

  // Handle regular input and convert to Base64
  const handleRegularInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setRegularInput(input);
    try {
      let encoded = isUtf8
        ? btoa(new TextEncoder().encode(input).reduce((acc, byte) => acc + String.fromCharCode(byte), '')) // UTF-8 encoding
        : btoa(input); // ASCII encoding

      if (isUrlSafe) {
        encoded = toUrlSafeBase64(encoded); // Make it URL-safe if the checkbox is checked
      }

      setBase64Input(encoded);
    } catch (error) {
      setBase64Input('Invalid input for Base64 encoding');
    }
  };

  // Handle Base64 input and convert to regular text
  const handleBase64InputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setBase64Input(input);
    try {
      let decodedInput = input;
      if (isUrlSafe) {
        decodedInput = fromUrlSafeBase64(decodedInput); // Convert URL-safe Base64 back to standard Base64
      }

      const decoded = isUtf8
        ? new TextDecoder().decode(
            Uint8Array.from(atob(decodedInput), (char) => char.charCodeAt(0))
          ) // UTF-8 decoding
        : atob(decodedInput); // ASCII decoding

      setRegularInput(decoded);
    } catch (error) {
      setRegularInput('Invalid Base64 input');
    }
  };

  // Handle binary file upload and convert to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        let result = reader.result as string;
        let base64 = btoa(result); // Convert binary data to Base64

        if (isUrlSafe) {
          base64 = toUrlSafeBase64(base64); // Make it URL-safe if the checkbox is checked
        }

        setBinaryBase64(base64);
      };
      reader.readAsBinaryString(file); // Read file as binary string
    }
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
        {/* Toggle Light/Dark Mode */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mb-6 px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded-lg shadow hover:bg-blue-600 dark:hover:bg-blue-800 focus:outline-none"
        >
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>

        <h1 className="text-2xl font-bold mb-6">Base64 Encoder/Decoder</h1>
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Regular Input */}
          <div>
            <label htmlFor="regularInput" className="block text-lg font-medium mb-2">
              Regular Input
            </label>
            <textarea
              id="regularInput"
              value={regularInput}
              onChange={handleRegularInputChange}
              className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
              rows={6}
              placeholder="Enter regular text here..."
            ></textarea>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={isUtf8}
                  onChange={(e) => setIsUtf8(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400"
                />
                <span className="ml-2">Use UTF-8 Encoding</span>
              </label>
            </div>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={isUrlSafe}
                  onChange={(e) => setIsUrlSafe(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400"
                />
                <span className="ml-2">Use URL-Safe Base64</span>
              </label>
            </div>
          </div>

          {/* Base64 Input */}
          <div>
            <label htmlFor="base64Input" className="block text-lg font-medium mb-2">
              Base64 Input
            </label>
            <textarea
              id="base64Input"
              value={base64Input}
              onChange={handleBase64InputChange}
              className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
              rows={6}
              placeholder="Enter Base64 text here..."
            ></textarea>
          </div>
        </div>

        {/* Binary File Upload */}
        <div className="w-full max-w-2xl mt-6">
          <label htmlFor="fileUpload" className="block text-lg font-medium mb-2">
            Upload Binary File
          </label>
          <input
            id="fileUpload"
            type="file"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer focus:outline-none dark:bg-gray-800"
          />
          {binaryBase64 && (
            <div className="mt-4">
              <h2 className="text-lg font-medium mb-2">Base64 Output for Uploaded File:</h2>
              <textarea
                className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                rows={6}
                value={binaryBase64}
                readOnly
              ></textarea>
            </div>
          )}
        </div>
        <div className="w-full max-w-2xl mt-8">
        <button
          onClick={() => setSummaryVisible(!summaryVisible)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none"
        >
          {summaryVisible ? 'Hide Summary' : 'Show Summary'}
        </button>
        {summaryVisible && (
          <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">How Base64 Encoding Works</h2>
            <p className="mb-4">
              Base64 encoding is a method of converting binary data into a text format that uses only 64 characters: A-Z, a-z, 0-9, +, and /. URL-safe Base64 replaces + with - and / with _ to make it safe for use in URLs.
            </p>
            <h3 className="text-lg font-semibold mb-2">Step-by-Step Process:</h3>
            <ul className="list-disc list-inside mb-4">
              <li>Binary data is split into 8-bit bytes.</li>
              <li>The bytes are grouped into 24-bit chunks (3 bytes).</li>
              <li>Each 24-bit chunk is divided into 4 groups of 6 bits.</li>
              <li>Each 6-bit group is mapped to a character in the Base64 character set.</li>
              <li>If URL-safe encoding is enabled, + is replaced with - and / with _.</li>
            </ul>
          </div>
        )}
      </div>
      </div>
      
    </div>
  );
};

export default Base64;