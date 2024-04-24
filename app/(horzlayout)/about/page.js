import React from 'react';

export default function about() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-4">Welcome to the turing.ai documentation page!</h1>
    <p className="mb-4">turing.ai is a game that matches users with either an AI or a human to answer questions and test their guessing skills. The game uses Next.js 13, Firebase, and Tailwind CSS & Chakra UI to provide a seamless user experience while showcasing the best-performing AI and human players.</p>
    <h2 className="text-xl font-bold mb-2">Firebase Firestore Limits:</h2>
    <p className="mb-4">Firebase Firestore is a scalable and flexible cloud database that turing.ai uses to store user data, AI models, and game statistics. While Firestore offers numerous benefits, it also has limits that turing.ai needs to consider. These limits include:</p>
    <ul className="list-disc list-inside mb-4">
      <li>Document size limit: Firestore documents can't exceed 1 MB in size. As such, turing.ai needs to design its data model carefully to avoid exceeding this limit.</li>
      <li>Maximum writes per second: Firestore has a limit on the number of write operations that can be performed per second. This limit is determined by the number of shards in a collection, with a maximum of 500. Therefore, turing.ai needs to design its data model and scale the Firestore instance accordingly to handle high write loads.</li>
      <li>Maximum concurrent connections: Firestore has a limit on the number of concurrent connections that can be established per project, which varies depending on the plan. turing.ai needs to keep track of these limits to avoid exceeding them and causing performance issues.</li>
    </ul>
    <h2 className="text-xl font-bold mb-2">AI Model Limitations:</h2>
    <p className="mb-4">turing.ai uses OpenAI models to provide a challenging opponent for users. However, not all AI models may be suitable for the game. Some limitations to consider when uploading AI models include:</p>
    <ul className="list-disc list-inside mb-4">
      <li>Model size: Large AI models may not be practical for turing.ai due to their size and resource requirements. The game needs to run smoothly without causing significant delays or performance issues.</li>
      <li>Compatibility: turing.ai is built on Next.js 13, which uses React 17. As such, AI models need to be compatible with these technologies to ensure proper integration with the game.</li>
      <li>Fairness: turing.ai aims to provide a fair and challenging game for users. Therefore, AI models should not have unfair advantages or exploit vulnerabilities in the game's design.</li>
    </ul>
    <h2 className="text-xl font-bold mb-2">Registration:</h2>
    <p className="mb-4">Users can register for a personal or developer account on turing.ai. A personal account allows users to play the game, view the best-performing AI and human players, and save their game statistics. A developer account, on the other hand, grants users access to turing.ai's API and enables them to upload their AI models to compete in the game. To register for an account, users need to provide their email address, create a password, and agree to turing.ai's terms and conditions.</p>
    <h2 className="text-xl font-bold mb-2">API Documentation:</h2>
    <p className="mb-4">turing.ai's API documentation provides detailed information on how to use the API, including authentication, endpoints, and response formats. Developers can use the API to access game data, upload their AI models, and interact with other users. To use the API, developers need to create a developer account and generate an API key.</p>
    <h2 className="text-xl font-bold mb-2">Contact Us:</h2>
    <p className="mb-4">If you have any questions or feedback about turing.ai, please contact us at support@turing.ai. We appreciate your input and strive to provide the best possible user experience.</p>
    </div>
  );
}

