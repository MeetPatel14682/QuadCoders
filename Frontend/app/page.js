"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  return (
    <div className="bg-gray-50 text-gray-800">

      {/* Hero Section */}
      <section className="pt-24 pb-20 relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Fueling the future
                <br />
                <span className="text-green-600">with Trust!</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                Building a sustainable future through government-backed subsidies for green hydrogen fuel producers. Join the energy revolution today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-300 text-center font-semibold"
              >
                Get Deep here
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border-2 border-green-500 text-green-600 rounded-full hover:bg-green-50 transition-all duration-300 text-center font-semibold"
              >
                Login here
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="hero-illustration-new.png"
              alt="Green Hydrogen Production in Nature"
              className="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
          className="absolute top-20 left-10 w-16 h-16 bg-green-200 rounded-full opacity-70"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute top-40 right-20 w-8 h-8 bg-emerald-300 rounded-full opacity-60"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute bottom-20 left-20 w-12 h-12 bg-green-300 rounded-full opacity-50"
        />
      </section>

      {/* Government Initiative Section */}
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h3 className="text-4xl font-bold text-gray-900 mb-4">Government-Backed Initiative</h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            VerdeChain is supported by government initiatives to accelerate the adoption of clean energy solutions and create a sustainable future.
          </p>
        </div>
      </motion.section>

      {/* How Subsidies Work Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              How Subsidies Work
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our transparent system ensures fairness and accessibility for all
              green hydrogen fuel producers seeking government subsidies.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[ /* Register, Verify, Receive cards */ 
              {
                title: "Register",
                text: "Companies producing green hydrogen fuel can easily register on our platform.",
                iconBg: "bg-green-100",
                iconColor: "text-green-600",
                path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                title: "Verify",
                text: "Our system verifies production capacity and compliance with environmental standards.",
                iconBg: "bg-emerald-100",
                iconColor: "text-emerald-600",
                path: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              },
              {
                title: "Receive",
                text: "Approved companies receive government subsidies directly through our secure platform.",
                iconBg: "bg-yellow-100",
                iconColor: "text-yellow-600",
                path: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div
                  className={`w-16 h-16 ${item.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <svg
                    className={`w-8 h-8 ${item.iconColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={item.path}
                    ></path>
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "70%", label: "Fueling the Future Program" },
              { value: "4+ mt", label: "Production Capacity" },
              { value: "500+", label: "Registered Companies" },
              { value: "$2B+", label: "Subsidies Distributed" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Green Hydrogen Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Why Green Hydrogen?
              </h3>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Green hydrogen represents the future of clean energy. As a
                government-backed initiative, we're committed to supporting
                companies that produce this revolutionary fuel.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { title: "Zero Emissions", desc: "Completely carbon-neutral energy source" },
                  { title: "Scalable", desc: "Suitable for industries and transport" },
                  { title: "Government Support", desc: "Backed by national initiatives" },
                  { title: "Future Ready", desc: "Leading the energy transition" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl p-8 text-white">
                <h4 className="text-2xl font-bold mb-4">Join the Revolution</h4>
                <p className="text-green-100 mb-6">
                  Be part of the sustainable energy future. Register your
                  company today and access government subsidies for green
                  hydrogen production.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/register")}
                  className="px-8 py-3 bg-white text-green-600 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  Start Here
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
