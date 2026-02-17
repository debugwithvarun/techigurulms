import React from 'react';

const instructors = [
  { name: 'Megan Cade', role: 'UI/UX Expert', img: 'https://i.pravatar.cc/150?u=a' },
  { name: 'Ramon Gibson', role: 'Science Teacher', img: 'https://i.pravatar.cc/150?u=b' },
  { name: 'Stella Robinson', role: 'Math Specialist', img: 'https://i.pravatar.cc/150?u=c' },
  { name: 'Paul Phelan', role: 'Assistant Teacher', img: 'https://i.pravatar.cc/150?u=d' },
];

const Instructors = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Expert Instructors</h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-12">
          Discover a world of knowledge and opportunities with our online education platform pursue a new career.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {instructors.map((inst, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative mb-4 inline-block">
                {/* Image with Border effect from screenshot */}
                <div className="w-48 h-48 rounded-full border-4 border-transparent group-hover:border-purple-600 transition-all p-1">
                  <img src={inst.img} alt={inst.name} className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                </div>
              </div>
              <h3 className="font-bold text-xl">{inst.name}</h3>
              <p className="text-gray-400 text-sm uppercase tracking-wider">{inst.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Instructors;