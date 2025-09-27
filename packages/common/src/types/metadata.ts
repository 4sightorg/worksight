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

// FIX: Make MetadataRecord implement CustomSiteMetadataShape and provide a method to convert to Next.js Metadata
export class MetadataRecord implements CustomSiteMetadataShape {
  title: string;
  description: string;
  metadataBase: URL;
  icons: {
    icon: string;
  };
  openGraph: {
    title: string;
    description: string;
    images: string[];
  };

  constructor(
    title: string,
    description: string,
    icon: string = '/assets/favicon.ico',
    image: string = '/assets/icon.svg',
    baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ) {
    this.title = title;
    this.description = description;
    this.metadataBase = new URL(baseUrl);
    this.icons = { icon: icon };
    this.openGraph = {
      title: title,
      description: description,
      images: [image],
    };
  }

  // FIX: New method to convert this instance into a Next.js Metadata object
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
        url: url, // Optional: pass a specific URL if known at metadata generation time
        type: 'website', // Default type, can be refined based on context
      },
      // You can add other standard Next.js Metadata properties here if MetadataRecord grows
      // For example, if you add 'twitter' data to MetadataRecord:
      // twitter: {
      //   card: 'summary_large_image',
      //   title: this.openGraph.title,
      //   description: this.openGraph.description,
      //   images: this.openGraph.images,
      // },
    };
  }
}
