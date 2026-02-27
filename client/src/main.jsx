import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ApolloClient, HttpLink , InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const link = new HttpLink({
  uri: "http://localhost:8000/graphql",
});

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ApolloProvider client={client}>
      <App />
     </ApolloProvider>
  </StrictMode>,
)
