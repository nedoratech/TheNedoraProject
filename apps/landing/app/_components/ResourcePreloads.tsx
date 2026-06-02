const FONTS = [
  '/fonts/futura-book.woff2',
  '/fonts/futura-medium.woff2',
  '/fonts/futura-bold.woff2',
] as const

const LOGOS = ['/svg/nedora-white.png', '/svg/nedora-black.png'] as const

export default function ResourcePreloads() {
  return (
    <>
      {FONTS.map((href) => (
        <link
          key={href}
          rel="preload"
          href={href}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}
      {LOGOS.map((href) => (
        <link key={href} rel="preload" href={href} as="image" />
      ))}
    </>
  )
}
