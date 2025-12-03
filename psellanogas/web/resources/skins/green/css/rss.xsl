<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    >
<xsl:template match="/rss/channel">
    <html>
    <head>
    <title><xsl:value-of select="title"/> (RSS 1.0 Feed)</title>
    <link rel="stylesheet"><xsl:attribute name="href"><xsl:value-of select="style"/></xsl:attribute></link>
    </head>
    <body>
        <div id="channel">
            <div class="header">
                <h1><xsl:value-of select="title"/></h1>
                <p class="description"><xsl:value-of select="description"/></p>
            </div>
            <ul>
                <xsl:for-each select="item">
                    <li>
                        <h2>
                            <a><xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute><xsl:value-of select="title"/></a>
                        </h2>
                        <p class="category"><xsl:value-of select="category"/></p>
                        <p class="date"><xsl:value-of select="substring(pubDate,1,10)"/></p>
                        <p class="author"><xsl:value-of select="substring(author,1,10)"/></p>
                        <p class="description"><xsl:value-of select="description" disable-output-escaping="yes"/></p>
                        <p class="link"><a><xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute><xsl:value-of select="link"/></a></p>
                    </li>
                </xsl:for-each>
            </ul>
            <p class="copyright"><xsl:value-of select="copyright"/></p>
        </div>
    </body>
    </html>
</xsl:template>
</xsl:stylesheet>
