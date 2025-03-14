import {OptimizedImage} from "@/components/ui/optimized-image";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Optimized Image Example - petbar.mk",
  description: "Example of using the OptimizedImage component with Plaiceholder",
};

export default async function OptimizedImageExamplePage() {
  return (
    <div className="container mx-auto py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Optimized Image Examples</h1>
        <p className="text-muted-foreground">Examples of using the OptimizedImage component with Plaiceholder for blur placeholders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Local image example */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Local Image</h2>
          <div className="overflow-hidden rounded-lg">
            <OptimizedImage
              src="/login-bg.png"
              alt="Local image example"
              width={600}
              height={400}
              className="w-full h-auto object-cover transition-all hover:scale-105"
              loadingClassName="animate-pulse"
            />
          </div>
          <p className="text-sm text-muted-foreground">Local image from the public directory with blur placeholder</p>
        </div>

        {/* Remote image example */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Remote Image</h2>
          <div className="overflow-hidden rounded-lg">
            <OptimizedImage
              src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000"
              alt="Remote image example"
              width={600}
              height={400}
              className="w-full h-auto object-cover transition-all hover:scale-105"
              loadingClassName="animate-pulse"
            />
          </div>
          <p className="text-sm text-muted-foreground">Remote image from Unsplash with blur placeholder</p>
        </div>

        {/* Another example */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Another Example</h2>
          <div className="overflow-hidden rounded-lg">
            <OptimizedImage
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000"
              alt="Dog running"
              width={600}
              height={400}
              className="w-full h-auto object-cover transition-all hover:scale-105"
              loadingClassName="animate-pulse"
            />
          </div>
          <p className="text-sm text-muted-foreground">Another remote image example with blur placeholder</p>
        </div>
      </div>

      <div className="prose max-w-none">
        <h2>How to Use the OptimizedImage Component</h2>
        <p>
          The <code>OptimizedImage</code> component is a server component that automatically generates blur placeholders for your images using
          Plaiceholder. It works with both local images from your public directory and remote images from external URLs.
        </p>

        <h3>Basic Usage</h3>
        <pre>
          <code>{`// In a Server Component
import { OptimizedImage } from '@/components/ui/optimized-image';

export default async function MyPage() {
  return (
    <OptimizedImage
      src="/my-image.jpg" // Local image from public directory
      alt="My Image"
      width={800}
      height={600}
      className="w-full h-auto"
      loadingClassName="animate-pulse" // Optional class for loading state
    />
  );
}`}</code>
        </pre>

        <h3>For Client Components</h3>
        <p>If you need to use blur placeholders in a client component, you can pass the blur data URL from a parent server component:</p>
        <pre>
          <code>{`// In a Server Component
import { BlurImage } from '@/components/ui/blur-image';
import { getLocalImagePlaceholder } from '@/lib/image-utils';

export default async function MyPage() {
  // Generate the blur placeholder
  const { blurDataURL } = await getLocalImagePlaceholder('my-image.jpg');
  
  return (
    <ClientComponent blurDataURL={blurDataURL} />
  );
}

// In a Client Component
'use client';

import { BlurImage } from '@/components/ui/blur-image';

export function ClientComponent({ blurDataURL }) {
  return (
    <BlurImage
      src="/my-image.jpg"
      alt="My Image"
      width={800}
      height={600}
      blurDataURL={blurDataURL}
      className="w-full h-auto"
      loadingClassName="animate-pulse"
    />
  );
}`}</code>
        </pre>
      </div>
    </div>
  );
}
