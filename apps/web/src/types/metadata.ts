import { favicon, icon } from '@worksight/assets';
import { Metadata } from 'next';

// FIX: Renamed SiteMetadata to avoid confusion, it's just a shape for MetadataRecord now.
export interface CustomSiteMetadataShape {
  // Renamed for clarity
  title: string;
  description: string;
  icons: {
    icon: string;
  };
  openGraph: {
    title: string;
    description: string;
    images: string[];
  };
}

export class MetadataRecord implements CustomSiteMetadataShape {
  title: string;
  description: string;
  metadataBase: URL;
  icons: { icon: string };
  openGraph: { title: string; description: string; images: string[] };

  constructor(
    title: string,
    description: string,
    iconUrl: string = favicon.src,
    ogImage: string = icon.src,
    baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ) {
    this.title = title;
    this.description = description;
    this.metadataBase = new URL(baseUrl);
    this.icons = { icon: iconUrl };
    this.openGraph = {
      title: title,
      description: description,
      images: [ogImage],
    };
  }

  toNextMetadata(url?: string): Metadata {
    return {
      title: this.title,
      description: this.description,
      metadataBase: this.metadataBase,
      icons: this.icons,
      openGraph: {
        title: this.openGraph.title,
        description: this.openGraph.description,
        images: this.openGraph.images,
        url: url,
        type: 'website',
      },
    };
  }
}
