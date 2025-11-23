import React from 'react';

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Interview Prep,</span>{' '}
            <span className="bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h2>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6">
            PrepMate combines cutting-edge artificial intelligence with proven interview strategies. 
            Get personalized questions tailored to your role, receive instant feedback on your responses, 
            and track your progress with detailed analytics.
          </p>
          <p className="text-gray-400 text-base md:text-lg">
            Powered by intelligent automation, we help you practice smarter and land your dream job faster.
          </p>
        </div>
      </div>
    </section>
  );
};