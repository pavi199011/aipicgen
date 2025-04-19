
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const TestimonialsSection = ({ testimonials }: TestimonialsSectionProps) => {
  const [loadedAvatars, setLoadedAvatars] = useState<Record<number, boolean>>({});

  const handleAvatarLoad = (index: number) => {
    setLoadedAvatars(prev => ({ ...prev, [index]: true }));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied creators who use our AI image generator daily
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    onLoad={() => handleAvatarLoad(index)}
                    className={loadedAvatars[index] ? 'opacity-100' : 'opacity-0'}
                  />
                  <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                    {getInitials(testimonial.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <h4 className="font-semibold dark:text-white">{testimonial.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
