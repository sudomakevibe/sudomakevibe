<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> — RSS Feed</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          body { font-family: "JetBrains Mono", monospace; background: #0a0e1a; color: #cbd5e6; max-width: 720px; margin: 0 auto; padding: 2rem 1rem; }
          h1 { color: #60a5fa; font-size: 1.5rem; margin-bottom: 0.25rem; }
          .subtitle { color: #94a3b8; font-size: 0.875rem; margin-bottom: 2rem; }
          .intro { background: #0f121f; border: 1px solid #2d3a5e; border-radius: 8px; padding: 1rem; margin-bottom: 2rem; font-size: 0.875rem; color: #94a3b8; }
          .intro a { color: #60a5fa; }
          .post { border-left: 3px solid #60a5fa; padding: 1rem 1.25rem; margin-bottom: 1.5rem; background: #0f121f; border-radius: 0 8px 8px 0; }
          .post h2 { margin: 0 0 0.25rem; font-size: 1rem; }
          .post h2 a { color: #60a5fa; text-decoration: none; }
          .post h2 a:hover { text-decoration: underline; }
          .post .meta { color: #94a3b8; font-size: 0.75rem; margin-bottom: 0.5rem; }
          .post p { color: #cbd5e6; font-size: 0.875rem; margin: 0; }
        </style>
      </head>
      <body>
        <h1>&#x25B6; <xsl:value-of select="/rss/channel/title"/></h1>
        <p class="subtitle"><xsl:value-of select="/rss/channel/description"/></p>
        <div class="intro">
          <strong style="color:#60a5fa;">You're viewing the RSS feed.</strong>
          Subscribe by copying <a><xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/>/rss.xml</xsl:attribute>this URL</a> into your RSS reader (Miniflux, Newsboat, Feedly).
        </div>
        <xsl:for-each select="/rss/channel/item">
          <div class="post">
            <h2><a><xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute><xsl:value-of select="title"/></a></h2>
            <p class="meta"><xsl:value-of select="pubDate"/></p>
            <p><xsl:value-of select="description"/></p>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
