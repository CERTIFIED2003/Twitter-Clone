import Head from 'next/head'

export default function SEO({ login, postPage }) {
    return (
        <>
            <Head>
                <title>{login ? "Sign In | Twitter Clone" : postPage ? "Post | Twitter Clone" : "Home | Twitter Clone"}</title>
                <meta name="description" content="Awesome fully functional Twitter Clone" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/twitterLogo.png" />
            </Head>
        </>
    )
}
