
import { FC } from 'react'
import * as config from '@/config';

const PageHead: FC<{
  title?: string,
  description?: string,
  pathname?: string,
}> = ({
  title = config.title,
  description = config.description,
  pathname,
}) => {
  const url = pathname ? `${config.url}${pathname}` : `${config.url}`;
  return (
    <>
      <meta name='robots' content='index,follow' />
      <meta property='og:type' content='website' />

      <meta property='og:site_name' content={config.title} />
      <meta property='twitter:domain' content={config.domain} />

      <meta name='twitter:creator' content={`@${config.instagram}`} />

      {description && (
        <>
          <meta name='description' content={description} />
          <meta property='og:description' content={description} />
          <meta name='twitter:description' content={description} />
        </>
      )}

      {url && (
        <>
          <link rel='canonical' href={url} />
          <meta property='og:url' content={url} />
          <meta property='twitter:url' content={url} />
        </>
      )}

      <meta property='og:title' content={title} />
      <meta name='twitter:title' content={title} />
      <title>{title}</title>
    </>
  );
}

export default PageHead;