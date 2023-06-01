import Head from 'next/head'
import { Inter } from '@next/font/google'
import CommonStyles from '@/styles/Common.module.css'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>air kitchen</title>
        <meta name="description" content="Order management for catering" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className={CommonStyles.navbar}>
        <div className={CommonStyles['navbar-button']}><h3>Nav</h3></div>
        <div className={CommonStyles['navbar-remainder']}><h3>Air Kitchen</h3></div>
      </nav>
      <main className={CommonStyles.main}>
        <div className={CommonStyles.content}>
          <div className={CommonStyles.description}>
            <p>
              air kitchen \n
              wolololo
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
