
const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Creating stunning AI-generated images is as easy as 1-2-3
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-purple-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">1</div>
            <h3 className="text-xl font-semibold mb-3">Describe Your Vision</h3>
            <p className="text-gray-600">
              Enter a detailed description of the image you want to create using natural language.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">2</div>
            <h3 className="text-xl font-semibold mb-3">AI Generation</h3>
            <p className="text-gray-600">
              Our advanced AI models process your description and generate multiple image options.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">3</div>
            <h3 className="text-xl font-semibold mb-3">Download & Use</h3>
            <p className="text-gray-600">
              Download your favorite result in high resolution, ready for any project or application.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
