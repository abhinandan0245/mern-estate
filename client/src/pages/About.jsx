import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      bio: "Former real estate developer with 15+ years in property management",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Technology",
      bio: "Tech innovator with expertise in real estate platforms and AI",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    },
    {
      name: "Priya Patel",
      role: "Customer Success Director",
      bio: "Dedicated to ensuring exceptional client experiences",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    },
  ];

  const stats = [
    { number: "50K+", label: "Properties Listed" },
    { number: "25K+", label: "Happy Customers" },
    { number: "150+", label: "Cities Covered" },
    { number: "98%", label: "Customer Satisfaction" },
  ];

  const values = [
    {
      icon: "🔍",
      title: "Transparency",
      description: "Clear pricing, honest listings, and open communication",
    },
    {
      icon: "⚡",
      title: "Efficiency",
      description: "Streamlined processes for faster, smarter decisions",
    },
    {
      icon: "🤝",
      title: "Trust",
      description: "Building lasting relationships through reliability",
    },
    {
      icon: "🌱",
      title: "Innovation",
      description: "Leveraging technology to transform real estate",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              About <span className="text-blue-300">PropZen</span> Estate
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Revolutionizing real estate through technology, transparency, and
              trust. We're making property transactions simpler, faster, and
              more reliable.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                At PropZen Estate, we believe finding your perfect property
                should be an exciting journey, not a stressful chore. We're
                dedicated to transforming the real estate experience through
                innovative technology and unparalleled customer service.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Our platform connects buyers, sellers, and renters in a seamless
                ecosystem where every transaction is transparent, secure, and
                efficient.
              </p>
              <Link
                to="/listings"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Explore Properties
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=300&fit=crop"
                alt="Modern apartment building"
                className="rounded-2xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=500&h=400&fit=crop"
                alt="Happy family moving in"
                className="rounded-2xl shadow-lg mt-8"
              />
            </div>
          </div>
        </div>
      </section>

     

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-slate-600">
              The principles that guide everything we do at PropZen Estate
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-slate-50 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="text-3xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     

     
    </div>
  );
}
