import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import React, { Suspense } from 'react';

const About = React.lazy(() => import('./pages/About.tsx'));
const Issue = React.lazy(() => import('./pages/Issue.tsx'));

const client = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Suspense fallback='<div>loading...</div>'>
          <Routes>
            <Route path='/' element={<App />}></Route>
            <Route path='/extra/about' element={<About />}></Route>
            <Route path='/extra/issue' element={<Issue />}></Route>
          </Routes>
        </Suspense>
      </ApolloProvider>
    </BrowserRouter>
  </StrictMode>,
)
