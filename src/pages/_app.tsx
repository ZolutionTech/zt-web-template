import '@mantine/core/styles.css'
import Head from 'next/head'
import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import { Amplify } from 'aws-amplify'
import { theme } from '@/constants'
import awsConfig from '@/aws-exports'

Amplify.configure(awsConfig)

export default function App({ Component, pageProps }: any) {
  return (
    <>
      <ColorSchemeScript defaultColorScheme='dark' />
      <MantineProvider theme={theme} defaultColorScheme='dark'>
        <Head>
          <title>Mantine Template</title>
          <meta
            name='viewport'
            content='minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no'
          />
          <link rel='shortcut icon' href='/favicon.svg' />
        </Head>
        <Component {...pageProps} />
      </MantineProvider>
    </>
  )
}
