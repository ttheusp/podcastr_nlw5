// Usado para customizar o "index.html", a parte estática do site que serve para qualquer rota da aplicação. É chamado uma única vez.

import Document, {Html, Head, Main, NextScript} from 'next/document';

// Documentação do next pede para fazer por class
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet"></link>
        
          <link rel="shortcut icon" href="/favicon.png" type="image/png"/>
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}