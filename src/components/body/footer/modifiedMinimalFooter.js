import React from 'react'
import clsx from 'clsx'
import Image from 'next/image'

import {ColorModesEnum, Stack, Text} from '@primer/react-brand'
import {useTheme} from '@primer/react'

/**
 * Main Stylesheet (as a CSS Module)
 */
import styles from './MinimalFooter.module.css'

export const MinimalFooterSocialLinks = [
  'twitter',
  'github',
  'linkedin',
  'youtube',
  'facebook',
  'twitch',
  'tiktok',
]

function Root({
  className,
  children,
  copyrightStatement,
  logoHref = 'https://github.com',
  socialLinks,
  logoSVG,
  ...rest
}) {
  // find Footer.Footnotes children
  const footerFootnoteChild = () => {
    const footnotes = React.Children.toArray(children).find(child => {
      if (!React.isValidElement(child)) {
        return false
      }

      if (child.type && child.type === Footnotes) {
        return true
      }
    })
    return footnotes
  }

  /**
   * Renders a maximum of 5 links.
   * If more than 5 links are required, we should encourage usage of Footer instead.
   */
  const LinkChildren = React.Children.toArray(children)
    .filter(child => {
      // if not valid element
      if (React.isValidElement(child)) {
        if (child.type === Link) {
          return child
        }
      }
    })
    .slice(0, 5)

  const currentYear = new Date().getFullYear()

  return (
    <footer className={clsx(styles.Footer, className)} {...rest}>
      {footerFootnoteChild()}
      <SocialLogomarks socialLinks={socialLinks} logoHref={logoHref} logoSVG={logoSVG} />
      <section>
        <div className={styles['Footer__legal-and-links']}>
          <div className={styles['Footer__container']}>
            <Stack
              direction={{narrow: 'vertical', regular: 'horizontal'}}
              gap="normal"
              padding="none"
              justifyContent="space-between"
            >
              <Stack
                padding="none"
                gap="condensed"
                justifyContent={{
                  narrow: 'center',
                  regular: 'flex-end',
                }}
                direction={{
                  narrow: 'vertical',
                  regular: 'horizontal',
                }}
                className={styles['Footer__links']}
              >
                <>{LinkChildren}</>
              </Stack>
              <Text as="p" size="300" variant="muted" className={styles['Footer__copyright']}>
                {copyrightStatement ? copyrightStatement : `\u00A9 ${currentYear} GitHub. All rights reserved.`}
              </Text>
            </Stack>
          </div>
        </div>
      </section>
    </footer>
  )
}

function Footnotes({children, className}) {
  const styledChildren = React.Children.map(children, child => {
    // if not valid element
    if (!React.isValidElement(child)) {
      return child
    }

    if (child.type && child.type === Text) {
      return React.cloneElement(child, {
        as: 'p',
        variant: 'muted',
        size: 200,
        className: clsx(styles['Footer__terms-item'], child.props.className),
        ...child.props, // allow overrides for escape hatch
      })
    }
  })

  return (
    <section className={styles.Footer__container}>
      <div className={clsx(styles.Footer__terms, className)}>{styledChildren}</div>
    </section>
  )
}

function SocialLogomarks({socialLinks, logoHref, logoSVG}) {
  const {colorMode} = useTheme()

  const socialLinkData = [
    {
      name: 'twitter',
      fullName: 'Twitter',
      url: 'https://twitter.com/github',
      icon: 'https://github.githubassets.com/images/modules/site/icons/footer/twitter.svg',
      iconWidth: 22,
      iconHeight: 18,
    },
    {
      name: 'github',
      fullName: 'GitHub',
      url: 'https://github.com/KAIFA-CH',
      icon: 'https://github.githubassets.com/images/modules/site/icons/footer/github-mark.svg',
      iconWidth: 20,
      iconHeight: 20,
    },
    {
      name: 'linkedin',
      fullName: 'LinkedIn',
      url: 'https://www.linkedin.com/company/github',
      icon: 'https://github.githubassets.com/images/modules/site/icons/footer/linkedin.svg',
      iconWidth: 19,
      iconHeight: 18,
    },
    {
      name: 'youtube',
      fullName: 'YouTube',
      url: 'https://www.youtube.com/github',
      icon: 'https://github.githubassets.com/images/modules/site/icons/footer/youtube.svg',
      iconWidth: 23,
      iconHeight: 16,
    },
    {
      name: 'facebook',
      fullName: 'Facebook',
      url: 'https://www.facebook.com/GitHub',
      icon: 'https://github.githubassets.com/images/modules/site/icons/footer/facebook.svg',
      iconWidth: 18,
      iconHeight: 18,
    },
    {
      name: 'twitch',
      fullName: 'Twitch',
      url: 'https://www.twitch.tv/github',
      icon: 'https://github.githubassets.com/images/modules/site/icons/footer/twitch.svg',
      iconWidth: 18,
      iconHeight: 18,
    },
    {
      name: 'tiktok',
      fullName: 'TikTok',
      url: 'https://www.tiktok.com/@github',
      icon: 'https://github.githubassets.com/images/modules/site/icons/footer/tiktok.svg',
      iconWidth: 18,
      iconHeight: 18,
    },
    {
      name: 'instagram',
      fullName: 'Instagram',
      url: 'https://www.instagram.com/github/',
      icon: 'https://github.githubassets.com/images/modules/site/icons/footer/instagram.svg',
      iconWidth: 24,
      iconHeight: 24,
    },
  ]

  const renderLink = (link) => {
    return (
      <li key={link.name}>
        <a
          href={link.url}
        >
          <img
            className={`Brandfoolery ${styles['Footer__social-icon']}`}
            src={link.icon}
            height={link.iconHeight}
            width={link.iconWidth}
            loading="lazy"
            decoding="async"
            alt=""
          />
          <span style={{position: "absolute", width: "1px", height: "1px", padding: 0, overflow: "hidden", clip: "rect(0, 0, 0, 0)", wordWrap: "normal", border: 0}}>rant.lol on {link.fullName}</span>
        </a>
      </li>
    )
  }

  return (
    <section className={clsx(styles['Footer__logomarks'])}>
      <div className={styles['Footer__container']}>
        <Stack
          alignItems="center"
          direction={{narrow: 'vertical', regular: 'horizontal'}}
          gap="normal"
          padding="none"
          justifyContent="space-between"
        >
          <div>
            <a
              href={logoHref}
              aria-label="Go to homepage"
            >
              <Image src={logoSVG} style={{fill: colorMode === ColorModesEnum.DARK ? 'white' : 'black', maxWidth: "100%", display: "block"}} width={90} height={32} />
            </a>
          </div>
          {socialLinks !== false ? (
            <ul className={styles['Footer__social-links']}>
              {socialLinkData.map((link) => {
                if (socialLinks && !socialLinks.includes(link.name)) {
                  return null
                }
                return renderLink(link)
              })}
            </ul>
          ) : (
            <></>
          )}
        </Stack>
      </div>
    </section>
  )
}

const Link = ({as, children, ...rest}) => {
  const Component = as || 'a'
  return (
    <Component
      className={styles['Footer__link']}
      {...rest}
    >
      <Text variant="muted" size="300">
        {children}
      </Text>
    </Component>
  )
}

/**
 * Use MinimalFooter to render a global footer on all GitHub pages.
 * @see https://primer.style/brand/components/MinimalFooter
 */
export const MinimalFooter = Object.assign(Root, {
  Footnotes,
  Link,
})