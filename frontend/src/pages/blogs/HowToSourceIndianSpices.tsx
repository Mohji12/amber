import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import QuoteForm from '../../components/QuoteForm';

const HowToSourceIndianSpices: React.FC = () => {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  useEffect(() => {
    console.log('Blog viewed: How to Source and Sample Authentic Indian Spices: A Practical Guide (2025 Edition)');
  }, []);

  const openQuoteForm = () => setIsQuoteFormOpen(true);
  const closeQuoteForm = () => setIsQuoteFormOpen(false);

  return (
    <>
      <Helmet>
        <title>How to Source and Sample Authentic Indian Spices: A Practical Guide (2025 Edition) | Amber Global</title>
        <meta name="description" content="Complete 2025 guide to sourcing and sampling authentic Indian spices. Learn about quality assessment, compliance, traceability, and avoiding common pitfalls in spice import." />
        <meta name="keywords" content="Indian spices sourcing, spice sampling, spice quality assessment, spice import guide, spice compliance, spice traceability, authentic spices" />
        <meta name="author" content="Amber Global" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="How to Source and Sample Authentic Indian Spices: A Practical Guide (2025 Edition) | Amber Global" />
        <meta property="og:description" content="Complete 2025 guide to sourcing and sampling authentic Indian spices. Learn about quality assessment, compliance, traceability, and avoiding common pitfalls in spice import." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.amberglobal.com/blogs/how-to-source-indian-spices" />
        <meta property="og:site_name" content="Amber Global" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Source and Sample Authentic Indian Spices: A Practical Guide (2025 Edition) | Amber Global" />
        <meta name="twitter:description" content="Complete 2025 guide to sourcing and sampling authentic Indian spices. Learn about quality assessment, compliance, traceability, and avoiding common pitfalls in spice import." />
        <meta name="twitter:site" content="@AmberGlobal" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "How to Source and Sample Authentic Indian Spices: A Practical Guide (2025 Edition)",
              "description": "Complete 2025 guide to sourcing and sampling authentic Indian spices. Learn about quality assessment, compliance, traceability, and avoiding common pitfalls in spice import.",
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
                "@id": "https://www.amberglobal.com/blogs/how-to-source-indian-spices"
              },
              "articleSection": "Agriculture & Food Export",
              "keywords": "Indian spices sourcing, spice sampling, spice quality assessment, spice import guide, spice compliance, spice traceability, authentic spices"
            }
          `}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 pt-24 pb-8 max-w-4xl">
        <article className="blog-content">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-8 bg-gray-50 px-4 py-3 rounded-lg">
            <Link to="/" className="hover:text-green-600 transition-colors duration-200">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/blogs" className="hover:text-green-600 transition-colors duration-200">Blogs</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800 font-medium">Indian Spices Sourcing Guide 2025</span>
          </nav>

          {/* Main Title */}
          <h1 className="text-5xl font-bold text-gray-800 mb-8 leading-tight">
            How to Source and Sample Authentic Indian Spices: A Practical Guide (2025 Edition)
          </h1>

          {/* Introduction */}
          <div className="bg-green-50 p-8 rounded-xl border-l-4 border-green-500 mb-12">
            <p className="text-xl text-gray-700 leading-relaxed font-medium">
              India's spices—turmeric, pepper, cinnamon, cardamom—are sought after worldwide for their aroma and potency. But sheer demand isn't enough. In 2025, successful spice importers and private label brands must prioritize purity, traceability, and compliance throughout every step of sourcing and sampling.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              This guide breaks down each critical phase—so you can build trust, avoid regulatory pitfalls, and safeguard quality.
            </p>
          </div>

          {/* Why Sourcing & Sampling is Essential */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                Why Sourcing & Sampling Spice Is Essential
              </h2>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Sourcing and sampling are the two most critical steps in importing authentic spices. With growing global demand, the risk of adulteration, improper handling, and mislabeled blends has increased. Without a structured approach:
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1 text-xl">●</span>
                  <div>
                    <span className="text-lg text-gray-700">You may receive diluted or contaminated spices.</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1 text-xl">●</span>
                  <div>
                    <span className="text-lg text-gray-700">You risk customs rejection, recalls, or reputation loss.</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1 text-xl">●</span>
                  <div>
                    <span className="text-lg text-gray-700">You could violate food safety laws in importing countries (EU, US, FSSAI, CFIA).</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                <p className="text-lg text-green-800 leading-relaxed">
                  Proper sourcing ensures traceability, certification, and safety, while quality sampling—supported by lab testing—is your low-cost strategy for full confidence before committing to bulk orders.
                </p>
              </div>
            </div>
          </section>

          <hr className="my-16 border-gray-300" />

          {/* Finding Reliable Spice Exporter */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                1. Where to Start: Finding a Reliable Spice Exporter
              </h2>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Finding verified spice suppliers is critical. Selection factors impact quality assurance, consistent delivery, compliance, financial reliability, and long-term credibility.
              </p>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Use these filters to shortlist exporters:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Spice Board of India CRES and FSSAI registration</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">ISO 22000, HACCP, ISO 17025, AGMARK certification</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Export experience of 3–5+ years to regulated markets</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Batch-level traceability and GI-tag documentation</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Verified certificates of analysis and customer testimonials</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                <p className="text-lg text-green-800 leading-relaxed">
                  Some importers partner with trade facilitators who specialize in vetting spice suppliers. At <strong>Amber Global Trade</strong>, our team helps match buyers with trusted, audit-ready spice exporters who meet global compliance requirements.
                </p>
              </div>
            </div>
          </section>

          <hr className="my-16 border-gray-300" />

          {/* Requesting and Receiving Samples */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                2. How to Request and Receive Spice Samples
              </h2>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Requesting spice samples is a professional engagement. Exporters expect clarity on:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700"><strong>Spice variety & origin:</strong> e.g., Tellicherry black pepper, Lakadong turmeric, Ceylon cinnamon</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700"><strong>Sample size:</strong> typical: 0.5 kg–20 kg, based on lab and sensory needs</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700"><strong>Courier payment terms</strong> and timelines</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700"><strong>Documentation requirements:</strong> CoA, pesticide & microbial reports, origin traceability, packaging photos</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ensure the exporter supplies:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">●</span>
                      <span className="text-lg text-gray-700">A valid and batch-wise CoA</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">●</span>
                      <span className="text-lg text-gray-700">Lab test parameters (heavy metals, aflatoxin, microbial, pesticide residues)</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">●</span>
                      <span className="text-lg text-gray-700">Organic or other compliance certificates if applicable</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">●</span>
                      <span className="text-lg text-gray-700">Packaging mockups and specification sheets</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-xl border-l-4 border-orange-500">
                <h4 className="text-xl font-semibold text-orange-800 mb-3">Important Note:</h4>
                <p className="text-orange-800 leading-relaxed">
                  Suppliers unable to provide full documentation present clear red flags.
                </p>
              </div>
            </div>
          </section>

          <hr className="my-16 border-gray-300" />

          {/* Evaluating Sample Quality */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                3. How to Evaluate Spice Sample Quality
              </h2>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                When your spices arrive, assess them using both sensory and laboratory methods.
              </p>
              
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Key Quality Factors:</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-green-50">
                        <th className="border border-gray-300 p-3 text-left font-semibold">Test / Check</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">What to Look For</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium">Aroma &amp; Visual</td>
                        <td className="border border-gray-300 p-3">Natural smell/color; no dust, stones, or debris</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-3 font-medium">Moisture Content</td>
                        <td className="border border-gray-300 p-3">Typically &lt;10–12% depending on the spice</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium">Heavy Metals &amp; Aflatoxin</td>
                        <td className="border border-gray-300 p-3">Must meet or exceed importing country limits</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-3 font-medium">Pesticide Residues</td>
                        <td className="border border-gray-300 p-3">Below EU/FDA/Codex MRLs</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium">Microbiological Load</td>
                        <td className="border border-gray-300 p-3">Low TPC (Total Plate Count), no Salmonella or E. coli</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-3 font-medium">Essential Oil Content</td>
                        <td className="border border-gray-300 p-3">Especially for pepper, clove, cinnamon oils</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium">Sensory Test</td>
                        <td className="border border-gray-300 p-3">Flavor, color, aroma in real preparation contexts</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                <p className="text-lg text-green-800 leading-relaxed">
                  Compare results across at least 3–6 suppliers to benchmark quality. At <strong>Amber Global Trade</strong>, we coordinate accredited lab testing and compile comparative reports for buyers.
                </p>
              </div>
            </div>
          </section>

          <hr className="my-16 border-gray-300" />

          {/* Logistics and Documentation */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                4. Logistics: Shipping & Sample Documentation
              </h2>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Samples are typically shipped via DHL, FedEx, or Aramex. Smooth delivery depends on correct paperwork:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Clearly mark parcels: "Food Sample – Non-commercial"</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Include: nominal invoice, packing list, product specification sheet</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Attach: export license copy, CoA, test reports, and origin docs</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Delivery time: usually 4–8 business days globally if documents are accurate</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className="my-16 border-gray-300" />

          {/* Common Pitfalls */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                5. Common Pitfalls to Avoid
              </h2>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                These mistakes can cost time, reputation, and money:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Choosing a supplier based on price alone (risking adulteration)</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Accepting expired or incomplete documentation</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Skipping microbial or contaminant testing before bulk ordering</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Importing bulk orders based on a single sample cycle</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Ignoring destination-specific MRLs, allergen or packaging labels</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                <p className="text-lg text-green-800 leading-relaxed">
                  A smarter method: obtain multiple samples, use lab results and sensory comparisons, and only then finalize bulk decisions.
                </p>
              </div>
            </div>
          </section>

          <hr className="my-16 border-gray-300" />

          {/* Certifications and Compliance */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                6. Certifications & Compliance You Must Check (2025 Standards)
              </h2>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-green-50">
                      <th className="border border-gray-300 p-3 text-left font-semibold">Certification & Document</th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3 font-medium">CRES (Spice Board of India)</td>
                      <td className="border border-gray-300 p-3">Legal export registration</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3 font-medium">FSSAI licensing</td>
                      <td className="border border-gray-300 p-3">Mandatory food processing compliance in India</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 font-medium">ISO 22000 / HACCP</td>
                      <td className="border border-gray-300 p-3">Comprehensive food safety management systems</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3 font-medium">ISO 17025 lab accreditation</td>
                      <td className="border border-gray-300 p-3">Validates lab testing reliability</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 font-medium">AGMARK (if applicable)</td>
                      <td className="border border-gray-300 p-3">Government grading for certain spices</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3 font-medium">Organic / Halal / Fairtrade</td>
                      <td className="border border-gray-300 p-3">Market-specific quality and ethical claims</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Export documentation to verify includes: phytosanitary certificates, CoA, origin certificates, microbial data, and allergen labeling. Retail/private label brands must follow import-country labeling rules precisely.
              </p>
            </div>
          </section>

          <hr className="my-16 border-gray-300" />

          {/* Pro Tips */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                7. Pro Tips for Sourcing & Sampling Excellence
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Engage only with traceable suppliers—audit records, trace codes, lab-based validation</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Prioritize regular third-party inspections for large or recurring suppliers</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Use blockchain or ERP platforms for batch-level traceability</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Secure trademark registration in export markets early</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Stay updated via <a href="https://food.ec.europa.eu/food-safety/rasff_en" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 underline">RASFF (EU)</a> and <a href="https://www.fda.gov/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 underline">FDA</a> alerts to anticipate contamination issues</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">●</span>
                    <span className="text-lg text-gray-700">Partner with assistance firms like <strong>Amber Global Trade</strong> for streamlined sampling, compliance reviews, and traceability support</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className="my-16 border-gray-300" />

          {/* Conclusion */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                Conclusion: Quality in Spice Sourcing Means Business Integrity
              </h2>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Spice sourcing in 2025 is about building trust: trust in purity, in regulatory compliance, in traceable supply chains—and ultimately, in your brand.
              </p>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                By following structured sourcing and sampling practices, using thorough lab analysis, and working with certified, transparent exporters, you safeguard your product and reputation.
              </p>
              
              <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                <p className="text-lg text-green-800 leading-relaxed">
                  <strong>Amber Global Trade</strong> supports you at every step—from supplier vetting and sample testing to compliance assurance and documentation. Our team helps you source spices with confidence.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="bg-green-50 p-12 rounded-2xl border border-green-200 shadow-2xl">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-gray-800 mb-6">
                Ready to Take the Next Step?
              </h3>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
                Start your spice sourcing journey with expert guidance on quality assessment, compliance, and traceability.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <button
                  onClick={openQuoteForm}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Expert Consultation
                </button>
                <Link
                  to="/contact"
                  className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Action Links */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Link
              to="/contact"
              className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <h4 className="text-xl font-bold mb-2">Register with the Spice Board of India (CRES)</h4>
              <p className="text-green-100">Get export registration guidance</p>
            </Link>

            <Link
              to="/contact"
              className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <h4 className="text-xl font-bold mb-2">Book a Sample Evaluation & Compliance Consultation</h4>
              <p className="text-green-100">Expert advice on quality assessment</p>
            </Link>

            <Link
              to="/contact"
              className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <h4 className="text-xl font-bold mb-2">Get Export Packaging & Labeling Guidance</h4>
              <p className="text-green-100">Compliance and packaging solutions</p>
            </Link>
          </div>
        </article>
      </div>

      {/* Quote Form Modal */}
      <QuoteForm
        isOpen={isQuoteFormOpen}
        onClose={closeQuoteForm}
        productInterest="Indian Spice Sourcing and Sampling"
      />
    </>
  );
};

export default HowToSourceIndianSpices;
