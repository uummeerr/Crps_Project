import { Info } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import BlogList from "@/components/BlogList";
import ContactCta from "@/components/ContactCta";
import { getFields, getPosts, toCard } from "@/lib/blog";
import PageTransition from "@/components/chrome/PageTransition";

export const metadata = {
  title: "Blog: writing on pain and its treatment",
  description:
    "Articles by Dr Tariq Tramboo on pain medicine, CRPS, neuromodulation and rehabilitation, filterable by field.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getPosts();
  const hasSamples = posts.some((post) => post.sample);

  return (
    <PageTransition>
      <PageHeader
        crumb="Blog"
        title="Writing on pain and its treatment."
        accent="pain"
        intro="Articles on CRPS, pain medicine and the parts of the body that pain treatment touches. Filter by field to find what you need."
      />

      <section className="section white tight">
        <div className="wrap">
          {hasSamples ? (
            <p className="sample-note">
              <Info aria-hidden="true" />
              <span>
                The articles marked “Sample” are placeholders for testing the design. They were not
                written by Dr Tramboo and will be replaced before launch.
              </span>
            </p>
          ) : null}
          <BlogList posts={posts.map(toCard)} fields={getFields()} />
        </div>
      </section>

      <ContactCta
        title="Have a question about your pain?"
        accent="your pain"
        text="Send your history and reports on WhatsApp or email."
      />
    </PageTransition>
  );
}
