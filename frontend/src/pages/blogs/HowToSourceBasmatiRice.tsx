import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import QuoteForm from '../../components/QuoteForm';

const HowToSourceBasmatiRice: React.FC = () => {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  useEffect(() => {
    console.log('Blog viewed: How to Source and Sample Authentic Basmati Rice');
  }, []);

  const openQuoteForm = () => setIsQuoteFormOpen(true);
  const closeQuoteForm = () => setIsQuoteFormOpen(false);

  return (
    <>
      <Helmet>
        <title>How to Source and Sample Authentic Basmati Rice: A Practical Guide | Amber Global</title>
        <meta name="description" content="A comprehensive guide to sourcing and sampling authentic Basmati rice. Learn how to find reliable exporters, evaluate samples, handle logistics, and avoid common pitfalls in rice import." />
        <meta name="keywords" content="Basmati rice, sourcing, sampling, authentic Basmati, GI certification, rice export, quality control, FSSAI, EU standards, FDA, APEDA, rice importers, supply chain, food safety, rice varieties, 1121 Basmati, Traditional Basmati, Pusa Basmati" />
        <meta name="author" content="Amber Global" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="How to Source and Sample Authentic Basmati Rice: A Practical Guide | Amber Global" />
        <meta property="og:description" content="A comprehensive guide to sourcing and sampling authentic Basmati rice. Learn how to find reliable exporters, evaluate samples, handle logistics, and avoid common pitfalls in rice import." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.amberglobal.com/blogs/how-to-source-basmati-rice" />
        <meta property="og:site_name" content="Amber Global" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Source and Sample Authentic Basmati Rice: A Practical Guide | Amber Global" />
        <meta name="twitter:description" content="A comprehensive guide to sourcing and sampling authentic Basmati rice. Learn how to find reliable exporters, evaluate samples, handle logistics, and avoid common pitfalls in rice import." />
        <meta name="twitter:site" content="@AmberGlobal" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "How to Source and Sample Authentic Basmati Rice: A Practical Guide",
              "description": "A comprehensive guide to sourcing and sampling authentic Basmati rice. Learn how to find reliable exporters, evaluate samples, handle logistics, and avoid common pitfalls in rice import.",
              "image": [
                "/src/assets/rice1.jpg",
                "/src/assets/rice2.jpg",
                "/src/assets/rice3.jpg"
              ],
              "author": {
                "@type": "Organization",
                "name": "Amber Global",
                "url": "https://www.amberglobal.com"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Amber Global",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.amberglobal.com/logo.png"
                }
              },
              "datePublished": "2024-12-19",
              "dateModified": "2024-12-19",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://www.amberglobal.com/blogs/how-to-source-basmati-rice"
              },
              "articleSection": "Agriculture & Food Export",
              "keywords": "Basmati rice, sourcing, sampling, authentic Basmati, GI certification, rice export, quality control"
            }
          `}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 pt-24 pb-8 max-w-4xl">
        <article className="blog-content">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-8 bg-gray-50 px-4 py-3 rounded-lg">
            <Link to="/" className="hover:text-blue-600 transition-colors duration-200">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/blogs" className="hover:text-blue-600 transition-colors duration-200">Blogs</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800 font-medium">How to Source and Sample Authentic Basmati Rice</span>
          </nav>

          {/* Main Title */}
          <h1 className="text-5xl font-bold text-gray-800 mb-8 leading-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            How to Source and Sample Authentic Basmati Rice: A Practical Guide
          </h1>
          
          {/* Introduction */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border-l-4 border-blue-500 mb-12">
            <p className="text-xl text-gray-700 leading-relaxed font-medium">
              Basmati rice isn't just any commodity—it's a premium product known for its distinct aroma, extra-long grains, and GI (Geographical Indication) certification. Sourced mainly from India, authentic Basmati commands strong demand in export markets due to its cooking characteristics and quality.
              For scaling up operations, this guide lays out each critical step.
            </p>
          </div>

          {/* Image 1 */}
          <div className="my-12">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src="/src/assets/rice1.jpg"
                alt="Various forms of rice and rice by-products including raw grains, rice stalks, and processed forms" 
                className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <p className="text-center text-gray-600 text-sm mt-4 font-medium">
              <em>Image 1: Various forms of rice and rice by-products showcasing the versatility of rice from raw grain to processed forms</em>
            </p>
          </div>

          {/* Section 1: Why Sourcing and Sampling is Important */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Why Sourcing and Sampling Basmati Rice Is Important
              </h2>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Sourcing and sampling are the two most critical steps in importing authentic Basmati rice. With increasing global demand, especially for GI-certified Basmati rice from India, the market has seen a rise in mixed or substandard varieties labeled as Basmati. Without a structured sourcing approach and proper quality checks, importers risk receiving rice that doesn't meet export-grade specifications—or worse, violates food safety and labeling laws in the destination country.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="text-2xl font-medium text-gray-800 mb-4">
                  Why Proper Sourcing Matters:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Not all suppliers offer true Basmati varieties—many blend it with inferior rice.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Choosing the right exporter ensures traceability, GI-tag compliance, and food safety certification.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Partnering with verified producers helps meet FSSAI, EU, or FDA standards, avoiding customs or regulatory issues.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-medium text-gray-800 mb-4">
                  Why Sample Testing Is Essential:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Physical appearance alone can't reveal issues like high moisture content, broken grain percentage, or contamination.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Proper sampling allows importers to conduct lab tests (moisture, pesticide, purity) and perform cooking trials to assess aroma and elongation.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">It's the only way to compare suppliers on quality, documentation, and consistency—before committing to bulk orders.</span>
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              In short, sampling is your insurance policy—a low-cost, high-impact way to ensure the rice you're buying meets your expectations and local import laws.
              Whether you're sourcing for retail, private label, or food service, getting these steps right protects both your brand and your bottom line.
            </p>
            </div>
          </section>

          <hr className="my-16 border-gray-300" />

          {/* Section 2: Finding a Reliable Exporter */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                1. Where to Start: Finding a Reliable Basmati Rice Exporter
              </h2>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Finding reliable rice exporters is crucial for anyone looking to import or distribute this premium product. But why is this so important? Everything from quality assurance, consistent supply, and timely delivery to regulatory compliance, brand reputation, and financial security contributes to a company's long-term success.
            </p>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              As such, certain criteria should be considered essential when selecting rice exporters for premium brands.
            </p>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Use these filters to narrow down exporters based on:
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">●</span>
                <span className="text-lg text-gray-700">APEDA registration</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">●</span>
                <span className="text-lg text-gray-700">ISO, HACCP, FSSAI certifications</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">●</span>
                <span className="text-lg text-gray-700">Verified business history and customer reviews</span>
              </li>
            </ul>

            <h3 className="text-2xl font-medium text-gray-800 mb-4">
              What to Check Before Shortlisting:
            </h3>
            
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600">
                    <th className="py-5 px-6 text-left text-lg font-bold text-white">Requirement</th>
                    <th className="py-5 px-6 text-left text-lg font-bold text-white">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200">
                    <td className="py-5 px-6 text-lg text-gray-700 font-semibold">Certifications</td>
                    <td className="py-5 px-6 text-lg text-gray-700">APEDA, ISO 22000, HACCP, FSSAI</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200">
                    <td className="py-5 px-6 text-lg text-gray-700 font-semibold">Export history</td>
                    <td className="py-5 px-6 text-lg text-gray-700">At least 3–5 years in international trade</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200">
                    <td className="py-5 px-6 text-lg text-gray-700 font-semibold">Product traceability</td>
                    <td className="py-5 px-6 text-lg text-gray-700">GI-tag verification, pesticide-free testing</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="py-5 px-6 text-lg text-gray-700 font-semibold">Customer references</td>
                    <td className="py-5 px-6 text-lg text-gray-700">Real reviews, ideally verified ones</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Some buyers choose to work through trade facilitation firms that specialize in this kind of vetting. Amber Global Trade also does this—we assist importers in finding verified, GI-compliant Basmati suppliers, especially when trust and compliance are top concerns.
            </p>
            </div>
          </section>

          <hr className="my-12 border-gray-300" />

          {/* Section 3: Requesting and Receiving Samples */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              2. How to Request and Receive Basmati Rice Samples
            </h2>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Requesting samples is a professional process. Exporters will expect you to be clear about:
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">●</span>
                <span className="text-lg text-gray-700">
                  The exact variety you want (e.g., 1121 Basmati, Traditional Basmati, Pusa Basmati varieties (1509, 1401, 1718, 1637), Taraori Basmati (HBC 19), Sella (Parboiled/Golden Sella), Punjab Basmati, Haryana Basmati, Kashmiri Basmati)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">●</span>
                <span className="text-lg text-gray-700">Sample quantity (usually 5kg–100kg)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">●</span>
                <span className="text-lg text-gray-700">Who pays courier charges</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">●</span>
                <span className="text-lg text-gray-700">Supporting documents (CoA, moisture %, pesticide test reports)</span>
              </li>
            </ul>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Make sure you ask for:
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">●</span>
                <span className="text-lg text-gray-700">Certificate of Analysis (CoA)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">●</span>
                <span className="text-lg text-gray-700">Grain size specs</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">●</span>
                <span className="text-lg text-gray-700">GI-tag verification</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">●</span>
                <span className="text-lg text-gray-700">Photos of packaging</span>
              </li>
            </ul>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-8 rounded-xl shadow-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-blue-800 mb-2">Pro Tip</h4>
                  <p className="text-lg text-blue-800 leading-relaxed">
                    Avoid any supplier who's vague about documentation or unwilling to provide lab reports. That's usually a red flag.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <hr className="my-12 border-gray-300" />

          {/* Section 4: Evaluating Samples */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              3. How to Evaluate the Sample Like a Professional
            </h2>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Once the samples arrive, here's how to assess them:
            </p>

            {/* Image 2 */}
            <div className="my-12">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="/src/assets/rice2.jpg"
                  alt="Professional rice quality testing and evaluation process" 
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-center text-gray-600 text-sm mt-4 font-medium">
                <em>Image 2: Professional rice quality testing and evaluation process</em>
              </p>
            </div>

            <h3 className="text-2xl font-medium text-gray-800 mb-4">
              Key Quality Factors:
            </h3>
            
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full bg-gradient-to-br from-emerald-50 to-green-50 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-600 to-green-600">
                    <th className="py-5 px-6 text-left text-lg font-bold text-white">Test</th>
                    <th className="py-5 px-6 text-left text-lg font-bold text-white">What to Look For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-emerald-50 transition-colors duration-200">
                    <td className="py-5 px-6 text-lg text-gray-700 font-semibold">Grain length</td>
                    <td className="py-5 px-6 text-lg text-gray-700">&gt;6.6 mm (Traditional), &gt;8.4 mm (Pusa 1121)</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-emerald-50 transition-colors duration-200">
                    <td className="py-4 px-6 text-lg text-gray-700 font-medium">Moisture content</td>
                    <td className="py-4 px-6 text-lg text-gray-700">Below 14%</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-emerald-50 transition-colors duration-200">
                    <td className="py-4 px-6 text-lg text-gray-700 font-medium">Broken grain %</td>
                    <td className="py-4 px-6 text-lg text-gray-700">Less than 5% for premium grades</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-emerald-50 transition-colors duration-200">
                    <td className="py-4 px-6 text-lg text-gray-700 font-medium">Aroma</td>
                    <td className="py-4 px-6 text-lg text-gray-700">Should be strong and natural, especially post-cooking</td>
                  </tr>
                  <tr className="hover:bg-emerald-50 transition-colors duration-200">
                    <td className="py-4 px-6 text-lg text-gray-700 font-medium">Purity</td>
                    <td className="py-4 px-6 text-lg text-gray-700">100% single-variety, no mixing with non-Basmati</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <hr className="my-12 border-gray-300" />

          {/* Section 5: Logistics */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              4. Logistics: Shipping and Clearing Sample Basmati Rice
            </h2>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Samples are usually shipped by DHL, FedEx, or Aramex, and the process is simple if paperwork is handled properly:
            </p>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">●</span>
                <span className="text-lg text-gray-700">Declare as "Food Sample – Non-commercial"</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">●</span>
                <span className="text-lg text-gray-700">
                  Include:
                  <ul className="ml-8 mt-2 space-y-1">
                    <li className="flex items-start">
                      <span className="text-gray-500 mr-2">○</span>
                      <span className="text-gray-700">Packing List</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-500 mr-2">○</span>
                      <span className="text-gray-700">Invoice with $0 or nominal value</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-500 mr-2">○</span>
                      <span className="text-gray-700">Product declaration or spec sheet</span>
                    </li>
                  </ul>
                </span>
              </li>
            </ul>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Customs delays are rare for small quantities if documentation is clean. Average delivery time is 4–8 business days, depending on origin and destination.
              <Link to="/blogs/documentation-handling" className="text-blue-600 hover:underline ml-1">
                Know More about how documentation should be handled
              </Link>
            </p>
          </section>

          <hr className="my-12 border-gray-300" />

          {/* Section 6: Common Pitfalls */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              5. Common Pitfalls to Avoid
            </h2>

            {/* Image 3 */}
            <div className="my-12">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="/src/assets/rice3.jpg"
                  alt="Businessman facing challenges and obstacles on the path to success" 
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-center text-gray-600 text-sm mt-4 font-medium">
                <em>Image 3: Businessman facing challenges and obstacles on the path to success</em>
              </p>
            </div>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              These are the mistakes that derail many first-time importers:
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">●</span>
                <span className="text-lg text-gray-700">Choosing a supplier based on price alone</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">●</span>
                <span className="text-lg text-gray-700">Not verifying APEDA or GI status</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">●</span>
                <span className="text-lg text-gray-700">Accepting poor documentation or no lab testing</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">●</span>
                <span className="text-lg text-gray-700">Skipping third-party inspections</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">●</span>
                <span className="text-lg text-gray-700">Rushing into bulk orders after only one sample</span>
              </li>
            </ul>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              A smarter strategy is to sample from at least 3–6 exporters and evaluate them side-by-side with documentation and cooking tests.
            </p>
          </section>

          <hr className="my-12 border-gray-300" />

          {/* Section 7: Helpful Resources */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              6. Helpful Resources for Importers
            </h2>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              To ensure you have access to the most up-to-date information and regulations, here are some essential resources for Basmati rice importers:
            </p>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  APEDA – India's Export Authority for Basmati
                </h3>
                <p className="text-gray-700 mb-3">
                  The Agricultural and Processed Food Products Export Development Authority (APEDA) is the official body responsible for regulating and promoting Basmati rice exports from India. They provide comprehensive information about:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>Official Basmati rice varieties and specifications</li>
                  <li>Export regulations and procedures</li>
                  <li>Quality standards and certifications</li>
                  <li>Registered exporters directory</li>
                </ul>
                <a 
                  href="https://apeda.gov.in/BasmatiRice" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Visit APEDA Basmati Rice Portal
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  FSSAI – Food Safety and Standards Authority of India
                </h3>
                <p className="text-gray-700 mb-3">
                  FSSAI is the regulatory body responsible for food safety standards in India. For Basmati rice importers, they provide:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>Food safety regulations and standards</li>
                  <li>Maximum residue levels (MRLs) for pesticides</li>
                  <li>Import/export food safety guidelines</li>
                  <li>Laboratory testing protocols</li>
                </ul>
                <a 
                  href="https://fssai.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Visit FSSAI Official Website
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-purple-500">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  HowToExportImport.com – Detailed Rice Export Guides
                </h3>
                <p className="text-gray-700 mb-3">
                  A comprehensive resource for international trade, offering detailed guides on:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>Step-by-step export/import procedures</li>
                  <li>Documentation requirements</li>
                  <li>Customs clearance processes</li>
                  <li>Trade regulations and compliance</li>
                </ul>
                <a 
                  href="https://howtoexportimport.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Visit HowToExportImport.com
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </section>

          <hr className="my-12 border-gray-300" />

          {/* Conclusion */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Conclusion: A Structured Sourcing Process Pays Off
            </h2>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Sourcing authentic, GI-certified Basmati rice is a process best approached methodically. From identifying a supplier to testing samples and verifying documentation, every step matters. A bit of homework up front saves time, money, and legal headaches later.
            </p>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              If you're navigating this for the first time or just want a second opinion on a supplier, Amber Global Trade is more than ready to help you at this step of your sourcing journey. Whether it's lab testing, compliance checks, or supplier vetting—we've been on both sides of the table and know where to look.
            </p>
          </section>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-12 rounded-2xl border border-blue-200 shadow-2xl">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Ready to Source Authentic Basmati Rice?
              </h3>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
                Get expert guidance on sourcing and sampling authentic Basmati rice. Our team at Amber Global Trade can help you find verified suppliers and ensure quality compliance.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <button 
                  onClick={openQuoteForm}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get a Quote from Us
                </button>
                <Link 
                  to="/blogs" 
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  View More Blogs
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* Quote Form Modal */}
      <QuoteForm 
        isOpen={isQuoteFormOpen}
        onClose={closeQuoteForm}
        productInterest="Basmati Rice"
      />
    </>
  );
};

export default HowToSourceBasmatiRice;