import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderDrawer from "@/components/layout/OrderDrawer";
import blogData from "@/data/blog.json";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogData.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = blogData.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Himalayan Jaggery Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://himalayanjaggery.com/blog/${post.slug}`,
      siteName: "Himalayan Jaggery",
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const resolvedParams = await params;
  const post = blogData.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": `https://himalayanjaggery.com${post.image}`,
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "datePublished": post.date,
    "keywords": post.tags.join(', ')
  };

  return (
    <div className="overflow-x-hidden bg-white selection:bg-black selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Navbar />
      <OrderDrawer />
      
      <main className="py-40 px-6 min-h-screen">
        <article className="max-w-[800px] mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-4 text-[10px] font-semibold tracking-[0.2em] uppercase text-black hover:text-black/60 transition-colors mb-24">
            <ArrowLeft className="w-4 h-4 transition-transform duration-500" strokeWidth={1.5}/> Back to Insights
          </Link>

          <header className="mb-16">
            <div className="flex gap-4 items-center mb-8">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-black/50 border border-black/10 px-3 py-1 uppercase">{post.tags[0]}</span>
              <span className="text-[10px] tracking-widest text-black/40 uppercase font-medium">{post.date}</span>
            </div>
            
            <h1 className="font-poppins text-4xl sm:text-5xl font-medium uppercase tracking-[0.1em] text-black leading-tight mb-8">
              {post.title}
            </h1>
            
            <p className="text-black/60 text-lg tracking-wide font-light leading-loose">
              {post.description}
            </p>
          </header>

          <div className="relative aspect-[16/9] w-full overflow-hidden mb-16 bg-[#F4F1ED]">
             <img src={post.image} alt={post.title} loading="eager" className="absolute inset-0 w-full h-full object-cover" />
          </div>

          <div className="prose prose-lg prose-p:font-light prose-p:leading-loose prose-p:text-black/70 prose-headings:font-poppins prose-headings:tracking-[0.1em] prose-headings:uppercase prose-headings:font-medium max-w-none pb-24 border-b border-black/10">
            {post.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-2xl mt-16 mb-8 text-black">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              return (
                <p key={index} className="mb-8">
                  {paragraph}
                </p>
              );
            })}
          </div>
          
          <div className="pt-16 flex flex-col items-center text-center">
            <p className="text-sm font-light tracking-widest text-black/60 uppercase mb-8">Share this article</p>
            <div className="flex gap-6">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-black hover:text-black/50 transition cursor-pointer">Twitter</span>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-black hover:text-black/50 transition cursor-pointer">Facebook</span>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-black hover:text-black/50 transition cursor-pointer">LinkedIn</span>
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
