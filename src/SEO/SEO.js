import Head from 'next/head'

export default function SEO({ error, login, postPage, post }) {
    return (
        <>
            <Head>
                <title>
                    {error
                        ? "Page Not Found | Twitter Clone"
                        : login
                            ? "Sign In | Twitter Clone"
                            : postPage
                                ? `${post === undefined ? "Not Found" : post?.username} | Twitter Clone`
                                : "Home | Twitter Clone"
                    }
                </title>
                <meta name="description" content="Awesome fully functional Twitter Clone" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/twitterLogo.png" />
            </Head>
        </>
    )
}
