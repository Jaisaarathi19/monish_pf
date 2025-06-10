import React, { useEffect, useRef, useState } from 'react';

const App = () => {
  const cursorRef = useRef(null);
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const achievementsRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Debug: Log active section changes
  useEffect(() => {
    console.log('Active section changed to:', activeSection);
  }, [activeSection]);

  // Custom cursor
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };
    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  // Skills chart
  useEffect(() => {
    const initChart = (id, skill, percentage) => {
      const chartDom = document.getElementById(id);
      if (!chartDom) return;
      const option = {
        series: [
          {
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            pointer: { show: false },
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                color: '#000000'
              }
            },
            axisLine: {
              lineStyle: {
                width: 15,
                color: [[1, '#e0e0e0']]
              }
            },
            splitLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            title: {
              offsetCenter: [0, '70%'],
              fontSize: 14,
              color: '#333333'
            },
            detail: {
              offsetCenter: [0, '0%'],
              valueAnimation: true,
              fontSize: 30,
              color: '#333333',
              formatter: '{value}%'
            },
            data: [{ value: percentage, name: skill }]
          }
        ],
        animation: false
      };
      // Dynamically import echarts to avoid SSR issues
      import('echarts').then(echarts => {
        if (!chartDom) return;
        const myChart = echarts.init(chartDom);
        myChart.setOption(option);
        window.addEventListener('resize', () => {
          myChart.resize();
        });
      });
    };
    // Initialize all skill charts
    initChart('python-chart', 'Python', 90);
    initChart('java-chart', 'Java', 85);
    initChart('cpp-chart', 'C++', 75);
    initChart('pandas-chart', 'Pandas', 88);
    initChart('numpy-chart', 'NumPy', 85);
    initChart('matplotlib-chart', 'Matplotlib', 80);
    initChart('trees-chart', 'Trees', 92);
    initChart('graphs-chart', 'Graphs', 85);
    initChart('dp-chart', 'DP', 78);
  }, []);

  // Intersection Observer for sections
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // Adjusted margins for better detection
      threshold: [0.1, 0.3, 0.5, 0.7], // Multiple thresholds for more accurate detection
    };
    
    const observer = new IntersectionObserver((entries) => {
      // Find the entry with the highest intersection ratio
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        const mostVisible = visibleEntries.reduce((prev, current) => 
          prev.intersectionRatio > current.intersectionRatio ? prev : current
        );
        setActiveSection(mostVisible.target.id);
      }
    }, options);
    
    const sections = [
      heroRef.current,
      aboutRef.current,
      achievementsRef.current,
      projectsRef.current,
      contactRef.current
    ];
    
    sections.forEach(section => {
      if (section) observer.observe(section);
    });
    
    return () => {
      sections.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setFormData({ name: '', email: '', message: '' });
    alert('Message sent successfully!');
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Manually set active section immediately for better UX
      setActiveSection(id);
      
      // Calculate offset for better positioning
      const headerOffset = 80; // Adjust based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative bg-white text-black font-sans overflow-x-hidden min-h-screen">
      {/* Custom cursor */}
      <div ref={cursorRef} className="fixed w-6 h-6 rounded-full border-2 border-black pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference"></div>
      
      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://readdy.ai/api/search-image?query=Abstract%20minimalist%20tech%20background%20with%20subtle%20geometric%20shapes%20and%20patterns%20in%20grayscale%2C%20creating%20a%20modern%20and%20sophisticated%20atmosphere%20with%20a%20gradient%20from%20dark%20to%20light%2C%20perfect%20for%20a%20tech%20portfolio%20hero%20section%20background&width=1440&height=800&seq=hero-bg&orientation=landscape"
            alt="Background"
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="container mx-auto px-6 z-10 relative">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight">MONISH E</h1>
            <h2 className="text-xl md:text-2xl font-light mb-8">Data Analysis • Design • Development</h2>
            <p className="text-lg md:text-xl mb-10 max-w-2xl">
              B.Tech Computer Science and Design student at Rajalakshmi Engineering College.
              Class of 2026. Passionate about solving complex problems through data and design.
            </p>
            <button
              onClick={() => scrollToSection('projects')}
              className="bg-black text-white px-8 py-3 text-lg font-medium hover:bg-gray-800 transition-colors cursor-pointer rounded-button whitespace-nowrap"
            >
              Explore My Work
            </button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <i className="fas fa-chevron-down text-2xl"></i>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">About Me</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative group overflow-hidden rounded-lg shadow-xl h-96 md:h-[700px]">
              <img
                src="/1000107030.jpg"
                alt="Monish E"
                className="w-full h-full object-cover object-top transition-all duration-500 filter grayscale group-hover:grayscale-0"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Hello, I'm Monish</h3>
              <p className="text-lg mb-6 leading-relaxed text-justify">
                I'm a 4th year B.Tech Computer Science and Design student at Rajalakshmi Engineering College, graduating in 2026. My academic journey has been focused on combining technical expertise with creative problem-solving. I'm passionate about Data Analysis and have developed strong skills in DSA using Python and Java. My approach combines analytical thinking with design principles to create efficient and elegant solutions.Outside of academics, I enjoy participating in hackathons, contributing to open-source projects, and exploring new technologies that can make a positive impact on society.
              </p>
              
              {/* Internships Section */}
              <div className="mb-8">
                <h4 className="text-xl font-bold mb-4 text-gray-800">Professional Experience</h4>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-gray-800 hover:border-black transition-colors duration-300">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h5 className="font-semibold text-lg">Data Science Intern</h5>
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">Summer 2024</span>
                    </div>
                    <p className="text-gray-800 font-medium mb-2">Tech Solutions Pvt Ltd</p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Worked on developing machine learning models for customer behavior analysis. Implemented data preprocessing pipelines using Python and Pandas, resulting in 25% improvement in model accuracy.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-gray-600 hover:border-black transition-colors duration-300">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h5 className="font-semibold text-lg">Software Development Intern</h5>
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">Winter 2023</span>
                    </div>
                    <p className="text-gray-800 font-medium mb-2">Innovation Labs India</p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Contributed to full-stack web development projects using React and Node.js. Collaborated with cross-functional teams to deliver scalable solutions and gained experience in Agile methodologies.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <i className="fas fa-graduation-cap text-xl mr-2"></i>
                  <span>B.Tech CS & Design</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-code text-xl mr-2"></i>
                  <span>Data Analysis</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-laptop-code text-xl mr-2"></i>
                  <span>Problem Solver</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section integrated into About */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h3 className="text-3xl font-bold mb-12 text-center">My Skills & Expertise</h3>
            
            {/* Programming Languages - Progress Bars */}
            <div className="mb-16">
              <h4 className="text-2xl font-bold mb-8 text-center">Programming Languages</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="bg-gray-50 p-6 rounded-lg shadow-md border-2 border-gray-200 hover:border-black transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-black rounded mr-3 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">Py</span>
                    </div>
                    <span className="font-semibold">Python</span>
                    <span className="ml-auto text-gray-600">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-gray-800 to-black h-3 rounded-full" style={{width: '90%'}}></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg shadow-md border-2 border-gray-200 hover:border-black transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-black rounded mr-3 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">J</span>
                    </div>
                    <span className="font-semibold">Java</span>
                    <span className="ml-auto text-gray-600">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-gray-700 to-gray-900 h-3 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg shadow-md border-2 border-gray-200 hover:border-black transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-black rounded mr-3 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">C++</span>
                    </div>
                    <span className="font-semibold">C++</span>
                    <span className="ml-auto text-gray-600">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-gray-600 to-gray-800 h-3 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tools & Libraries - Skill Cards */}
            <div className="mb-16">
              <h4 className="text-2xl font-bold mb-8 text-center">Tools & Libraries</h4>
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                <div className="group bg-gray-50 px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-gray-200 hover:border-black">
                  <div className="flex items-center">
                    <i className="fas fa-code text-2xl text-black mr-3"></i>
                    <span className="font-semibold group-hover:text-black transition-colors">Pandas</span>
                    <div className="ml-3 flex">
                      {[1,2,3,4,5].map(star => (
                        <i key={star} className={`fas fa-star text-sm ${star <= 4 ? 'text-black' : 'text-gray-300'}`}></i>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="group bg-gray-50 px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-gray-200 hover:border-black">
                  <div className="flex items-center">
                    <i className="fas fa-chart-line text-2xl text-black mr-3"></i>
                    <span className="font-semibold group-hover:text-black transition-colors">NumPy</span>
                    <div className="ml-3 flex">
                      {[1,2,3,4,5].map(star => (
                        <i key={star} className={`fas fa-star text-sm ${star <= 4 ? 'text-black' : 'text-gray-300'}`}></i>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="group bg-gray-50 px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-gray-200 hover:border-black">
                  <div className="flex items-center">
                    <i className="fas fa-chart-bar text-2xl text-black mr-3"></i>
                    <span className="font-semibold group-hover:text-black transition-colors">Matplotlib</span>
                    <div className="ml-3 flex">
                      {[1,2,3,4,5].map(star => (
                        <i key={star} className={`fas fa-star text-sm ${star <= 4 ? 'text-black' : 'text-gray-300'}`}></i>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="group bg-gray-50 px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-gray-200 hover:border-black">
                  <div className="flex items-center">
                    <i className="fas fa-database text-2xl text-black mr-3"></i>
                    <span className="font-semibold group-hover:text-black transition-colors">SQL</span>
                    <div className="ml-3 flex">
                      {[1,2,3,4,5].map(star => (
                        <i key={star} className={`fas fa-star text-sm ${star <= 3 ? 'text-black' : 'text-gray-300'}`}></i>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DSA Concepts - Animated Skill Cards */}
            <div className="mb-16">
              <h4 className="text-2xl font-bold mb-8 text-center">Data Structures & Algorithms</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* Trees Card */}
                <div className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 hover:border-black transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute top-4 right-4 w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg">
                    92
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <i className="fas fa-sitemap text-2xl text-white"></i>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-gray-800">Trees</h5>
                      <p className="text-gray-600 text-sm">Binary Trees, BST, AVL</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-gradient-to-r from-gray-700 to-black h-2 rounded-full transition-all duration-1000 ease-out" style={{width: '92%'}}></div>
                  </div>
                  <p className="text-gray-700 text-xs">Advanced proficiency in tree data structures</p>
                </div>

                {/* Graphs Card */}
                <div className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 hover:border-black transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute top-4 right-4 w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg">
                    85
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <i className="fas fa-project-diagram text-2xl text-white"></i>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-gray-800">Graphs</h5>
                      <p className="text-gray-600 text-sm">DFS, BFS, Dijkstra</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-gradient-to-r from-gray-600 to-gray-800 h-2 rounded-full transition-all duration-1000 ease-out" style={{width: '85%'}}></div>
                  </div>
                  <p className="text-gray-700 text-xs">Strong understanding of graph algorithms</p>
                </div>

                {/* Dynamic Programming Card */}
                <div className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 hover:border-black transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute top-4 right-4 w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg">
                    78
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <i className="fas fa-layer-group text-2xl text-white"></i>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-gray-800">Dynamic Programming</h5>
                      <p className="text-gray-600 text-sm">Memoization, Tabulation</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-gradient-to-r from-gray-500 to-gray-700 h-2 rounded-full transition-all duration-1000 ease-out" style={{width: '78%'}}></div>
                  </div>
                  <p className="text-gray-700 text-xs">Solid grasp of optimization techniques</p>
                </div>

                {/* Sorting Card */}
                <div className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 hover:border-black transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute top-4 right-4 w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg">
                    88
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <i className="fas fa-sort text-2xl text-white"></i>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-gray-800">Sorting</h5>
                      <p className="text-gray-600 text-sm">Quick, Merge, Heap Sort</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-gradient-to-r from-gray-600 to-gray-900 h-2 rounded-full transition-all duration-1000 ease-out" style={{width: '88%'}}></div>
                  </div>
                  <p className="text-gray-700 text-xs">Proficient in various sorting algorithms</p>
                </div>

                {/* Searching Card */}
                <div className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 hover:border-black transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute top-4 right-4 w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg">
                    90
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-black rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <i className="fas fa-search text-2xl text-white"></i>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-gray-800">Searching</h5>
                      <p className="text-gray-600 text-sm">Binary, Linear Search</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-gradient-to-r from-gray-600 to-black h-2 rounded-full transition-all duration-1000 ease-out" style={{width: '90%'}}></div>
                  </div>
                  <p className="text-gray-700 text-xs">Expert in search algorithm implementation</p>
                </div>

                {/* Arrays & Strings Card */}
                <div className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 hover:border-black transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute top-4 right-4 w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg">
                    94
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <i className="fas fa-list text-2xl text-white"></i>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-gray-800">Arrays & Strings</h5>
                      <p className="text-gray-600 text-sm">Manipulation, Processing</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-gradient-to-r from-gray-700 to-black h-2 rounded-full transition-all duration-1000 ease-out" style={{width: '94%'}}></div>
                  </div>
                  <p className="text-gray-700 text-xs">Mastery of fundamental data structures</p>
                </div>
              </div>
            </div>

            {/* Technical Skills - Tag Cloud */}
            <div>
              <h4 className="text-2xl font-bold mb-8 text-center">Technical Skills</h4>
              <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                {[
                  {name: 'Machine Learning', level: 'intermediate', color: 'bg-gray-100 text-gray-800 border-gray-300'},
                  {name: 'Data Visualization', level: 'advanced', color: 'bg-gray-200 text-black border-gray-400'},
                  {name: 'Statistical Analysis', level: 'intermediate', color: 'bg-gray-100 text-gray-800 border-gray-300'},
                  {name: 'Web Development', level: 'beginner', color: 'bg-gray-50 text-gray-700 border-gray-200'},
                  {name: 'Git/GitHub', level: 'intermediate', color: 'bg-gray-100 text-gray-800 border-gray-300'},
                  {name: 'Problem Solving', level: 'advanced', color: 'bg-gray-200 text-black border-gray-400'},
                  {name: 'API Development', level: 'beginner', color: 'bg-gray-50 text-gray-700 border-gray-200'},
                  {name: 'Database Design', level: 'intermediate', color: 'bg-gray-100 text-gray-800 border-gray-300'},
                  {name: 'Jupyter Notebooks', level: 'advanced', color: 'bg-gray-200 text-black border-gray-400'},
                  {name: 'Agile Methodology', level: 'beginner', color: 'bg-gray-50 text-gray-700 border-gray-200'}
                ].map((skill, index) => (
                  <span 
                    key={index}
                    className={`px-4 py-2 rounded-full border-2 font-medium transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-black cursor-default ${skill.color} ${
                      skill.level === 'advanced' ? 'text-lg' : 
                      skill.level === 'intermediate' ? 'text-base' : 'text-sm'
                    }`}
                  >
                    {skill.name}
                    <span className="ml-2 text-xs opacity-70">
                      {skill.level === 'advanced' ? '●●●' : 
                       skill.level === 'intermediate' ? '●●○' : '●○○'}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" ref={achievementsRef} className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">Achievements & Recognition</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Academic Excellence */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl border-2 border-gray-200 hover:border-black transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-black to-gray-800 rounded-bl-3xl flex items-center justify-center">
                <i className="fas fa-trophy text-white text-2xl"></i>
              </div>
              <div className="mb-6 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-graduation-cap text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Academic Excellence</h3>
                <p className="text-gray-600 text-sm mb-4">Consistently maintaining high academic standards</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-gray-800">CGPA</span>
                  <span className="font-bold text-black">8.7/10</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-gray-800">Rank</span>
                  <span className="font-bold text-black">Top 15%</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-gray-800">Honors</span>
                  <span className="font-bold text-black">Dean's List</span>
                </div>
              </div>
            </div>

            {/* Competitive Programming */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl border-2 border-gray-200 hover:border-black transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-bl-3xl flex items-center justify-center">
                <i className="fas fa-code text-white text-2xl"></i>
              </div>
              <div className="mb-6 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-laptop-code text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Competitive Programming</h3>
                <p className="text-gray-600 text-sm mb-4">Strong problem-solving skills demonstrated through competitions</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-gray-800">LeetCode</span>
                  <span className="font-bold text-black">500+ Problems</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-gray-800">CodeChef</span>
                  <span className="font-bold text-black">3 Star</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-gray-800">HackerRank</span>
                  <span className="font-bold text-black">Gold Badge</span>
                </div>
              </div>
            </div>

            {/* Hackathons & Competitions */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl border-2 border-gray-200 hover:border-black transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-bl-3xl flex items-center justify-center">
                <i className="fas fa-medal text-white text-2xl"></i>
              </div>
              <div className="absolute -top-4 -left-4 w-24 h-24 opacity-15 group-hover:opacity-30 transition-opacity duration-300">
                <img
                  src="https://readdy.ai/api/search-image?query=Team%20of%20Indian%20students%20celebrating%20hackathon%20victory%20holding%20trophy%20winner%20certificate%20group%20photo%20excited%20expressions%20coding%20competition%20success%20moment&width=200&height=200&seq=hackathon-victory&orientation=square"
                  alt="Hackathon Victory Moment"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 opacity-10 group-hover:opacity-25 transition-opacity duration-300">
                <img
                  src="https://readdy.ai/api/search-image?query=Smart%20India%20Hackathon%20winner%20certificate%20trophy%20medal%20on%20table%20with%20laptop%20project%20presentation%20slides%20hackathon%20achievement%20documentation&width=150&height=150&seq=hackathon-trophy&orientation=square"
                  alt="Hackathon Trophy"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="mb-6 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-rocket text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Hackathons & Competitions</h3>
                <p className="text-gray-600 text-sm mb-4">Recognition in various coding competitions and hackathons</p>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">Smart India Hackathon</span>
                    <span className="text-xs bg-black text-white px-2 py-1 rounded">1st Place</span>
                  </div>
                  <p className="text-xs text-gray-600">National Level - 2024</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">TechFest CodeRush</span>
                    <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded">2nd Place</span>
                  </div>
                  <p className="text-xs text-gray-600">College Level - 2024</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">Data Science Olympiad</span>
                    <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded">3rd Place</span>
                  </div>
                  <p className="text-xs text-gray-600">State Level - 2023</p>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl border-2 border-gray-200 hover:border-black transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-bl-3xl flex items-center justify-center">
                <i className="fas fa-certificate text-white text-2xl"></i>
              </div>
              <div className="absolute -top-4 -left-4 w-24 h-24 opacity-15 group-hover:opacity-30 transition-opacity duration-300">
                <img
                  src="https://readdy.ai/api/search-image?query=Young%20professional%20Indian%20student%20proudly%20showing%20online%20course%20completion%20certificate%20on%20laptop%20screen%20Google%20Coursera%20AWS%20certification%20achievement%20celebration&width=200&height=200&seq=certification-moment&orientation=square"
                  alt="Certification Achievement"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 opacity-10 group-hover:opacity-25 transition-opacity duration-300">
                <img
                  src="https://readdy.ai/api/search-image?query=Multiple%20professional%20certificates%20spread%20on%20desk%20Google%20AWS%20Coursera%20certification%20badges%20digital%20credentials%20professional%20development%20documents&width=150&height=150&seq=multiple-certs&orientation=square"
                  alt="Multiple Certificates"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="mb-6 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-award text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Professional Certifications</h3>
                <p className="text-gray-600 text-sm mb-4">Industry-recognized certifications and courses</p>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">Python Data Analysis</span>
                    <i className="fas fa-check-circle text-green-600"></i>
                  </div>
                  <p className="text-xs text-gray-600">Google - Coursera</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">Machine Learning</span>
                    <i className="fas fa-check-circle text-green-600"></i>
                  </div>
                  <p className="text-xs text-gray-600">Stanford - Coursera</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">AWS Cloud Practitioner</span>
                    <i className="fas fa-check-circle text-green-600"></i>
                  </div>
                  <p className="text-xs text-gray-600">Amazon Web Services</p>
                </div>
              </div>
            </div>

            {/* Projects & Publications */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl border-2 border-gray-200 hover:border-black transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-bl-3xl flex items-center justify-center">
                <i className="fas fa-project-diagram text-white text-2xl"></i>
              </div>
              <div className="absolute -top-4 -left-4 w-24 h-24 opacity-15 group-hover:opacity-30 transition-opacity duration-300">
                <img
                  src="https://readdy.ai/api/search-image?query=Indian%20computer%20science%20student%20presenting%20research%20project%20at%20conference%20pointing%20to%20data%20visualization%20charts%20academic%20presentation%20innovation%20showcase&width=200&height=200&seq=project-presentation&orientation=square"
                  alt="Project Presentation"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 opacity-10 group-hover:opacity-25 transition-opacity duration-300">
                <img
                  src="https://readdy.ai/api/search-image?query=GitHub%20profile%20showing%20green%20contribution%20graph%20open%20source%20repositories%20code%20commits%20programming%20projects%20developer%20portfolio%20screenshot&width=150&height=150&seq=github-contributions&orientation=square"
                  alt="GitHub Contributions"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="mb-6 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-lightbulb text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Projects & Innovation</h3>
                <p className="text-gray-600 text-sm mb-4">Notable projects and research contributions</p>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">Open Source Contributions</span>
                    <span className="text-xs bg-black text-white px-2 py-1 rounded">15+</span>
                  </div>
                  <p className="text-xs text-gray-600">GitHub Repositories</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">Research Paper</span>
                    <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded">Published</span>
                  </div>
                  <p className="text-xs text-gray-600">Data Analytics Journal</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">Patent Application</span>
                    <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded">Pending</span>
                  </div>
                  <p className="text-xs text-gray-600">ML Algorithm Optimization</p>
                </div>
              </div>
            </div>

            {/* Leadership & Community */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl border-2 border-gray-200 hover:border-black transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-bl-3xl flex items-center justify-center">
                <i className="fas fa-users text-white text-2xl"></i>
              </div>
              <div className="absolute -top-4 -left-4 w-24 h-24 opacity-15 group-hover:opacity-30 transition-opacity duration-300">
                <img
                  src="https://readdy.ai/api/search-image?query=Indian%20student%20leader%20conducting%20coding%20workshop%20teaching%20programming%20to%20junior%20students%20computer%20lab%20mentorship%20session%20tech%20club%20meeting&width=200&height=200&seq=leadership-moment&orientation=square"
                  alt="Leadership in Action"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 opacity-10 group-hover:opacity-25 transition-opacity duration-300">
                <img
                  src="https://readdy.ai/api/search-image?query=Tech%20club%20group%20photo%20students%20with%20president%20badge%20computer%20science%20association%20team%20building%20workshop%20organizing%20committee%20picture&width=150&height=150&seq=tech-club-photo&orientation=square"
                  alt="Tech Club Team"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="mb-6 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-handshake text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Leadership & Community</h3>
                <p className="text-gray-600 text-sm mb-4">Active involvement in student communities and leadership roles</p>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">Tech Club President</span>
                    <span className="text-xs bg-black text-white px-2 py-1 rounded">2024</span>
                  </div>
                  <p className="text-xs text-gray-600">Computer Science Association</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">Coding Mentor</span>
                    <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded">50+ Students</span>
                  </div>
                  <p className="text-xs text-gray-600">Junior Batch Guidance</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">Workshop Organizer</span>
                    <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded">10+ Events</span>
                  </div>
                  <p className="text-xs text-gray-600">Data Science Workshops</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="mt-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl border-2 border-gray-200">
            <h3 className="text-3xl font-bold mb-8 text-center text-gray-800">Achievement Gallery</h3>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">A visual journey through my achievements, capturing moments of success, learning, and growth in my academic and professional career.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Academic Excellence Photos */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <img
                  src="/1000107030.jpg"
                  alt="Academic Achievement Celebration"
                  className="w-full h-48 object-cover object-top transition-all duration-500 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="w-full h-48 hidden items-center justify-center bg-gradient-to-br from-gray-800 to-black relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-black/20"></div>
                  <div className="text-center text-white z-10">
                    <i className="fas fa-graduation-cap text-4xl mb-2 opacity-80"></i>
                    <div className="font-bold text-sm">Academic Excellence</div>
                    <div className="text-xs opacity-90">CGPA: 8.7/10</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white text-black px-2 py-1 rounded-full text-xs font-bold">
                  Dean's List
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-bold text-lg mb-1">Academic Excellence</h4>
                  <p className="text-sm opacity-90">Celebrating academic achievements and Dean's list recognition</p>
                </div>
              </div>

              {/* Competitive Programming Photos */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <img
                  src="/1000107030.jpg"
                  alt="Competitive Programming Session"
                  className="w-full h-48 object-cover object-top transition-all duration-500 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="w-full h-48 hidden items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600/20 to-gray-800/20"></div>
                  <div className="text-center text-white z-10">
                    <i className="fas fa-laptop-code text-4xl mb-2 opacity-80"></i>
                    <div className="font-bold text-sm">Competitive Programming</div>
                    <div className="text-xs opacity-90">500+ Problems</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-gray-300 text-black px-2 py-1 rounded-full text-xs font-bold">
                  3★ CodeChef
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-bold text-lg mb-1">Competitive Programming</h4>
                  <p className="text-sm opacity-90">Late night coding sessions and problem-solving marathons</p>
                </div>
              </div>

              {/* Hackathon Victory Photos */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <img
                  src="/1000107030.jpg"
                  alt="Hackathon Victory Celebration"
                  className="w-full h-48 object-cover object-top transition-all duration-500 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="w-full h-48 hidden items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-gray-700/20"></div>
                  <div className="text-center text-white z-10">
                    <i className="fas fa-trophy text-4xl mb-2 opacity-80"></i>
                    <div className="font-bold text-sm">Hackathon Victory</div>
                    <div className="text-xs opacity-90">Smart India Hackathon</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white text-black px-2 py-1 rounded-full text-xs font-bold">
                  1st Place
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-bold text-lg mb-1">Hackathon Victory</h4>
                  <p className="text-sm opacity-90">Smart India Hackathon 2024 - First Place Winners</p>
                </div>
              </div>

              {/* Certification Achievement Photos */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <img
                  src="/1000107030.jpg"
                  alt="Professional Certification Achievement"
                  className="w-full h-48 object-cover object-top transition-all duration-500 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="w-full h-48 hidden items-center justify-center bg-gradient-to-br from-gray-500 to-gray-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-gray-600/20"></div>
                  <div className="text-center text-white z-10">
                    <i className="fas fa-certificate text-4xl mb-2 opacity-80"></i>
                    <div className="font-bold text-sm">Professional Certifications</div>
                    <div className="text-xs opacity-90">Google • AWS • Coursera</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-gray-300 text-black px-2 py-1 rounded-full text-xs font-bold">
                  5+ Certs
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-bold text-lg mb-1">Professional Certifications</h4>
                  <p className="text-sm opacity-90">Google, AWS, and Coursera certifications completed</p>
                </div>
              </div>

              {/* Project Presentation Photos */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <img
                  src="/1000107030.jpg"
                  alt="Project Presentation at Conference"
                  className="w-full h-48 object-cover object-top transition-all duration-500 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="w-full h-48 hidden items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-gray-700/20"></div>
                  <div className="text-center text-white z-10">
                    <i className="fas fa-presentation text-4xl mb-2 opacity-80"></i>
                    <div className="font-bold text-sm">Research Presentation</div>
                    <div className="text-xs opacity-90">Data Analytics Journal</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-gray-200 text-black px-2 py-1 rounded-full text-xs font-bold">
                  Published
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-bold text-lg mb-1">Research Presentation</h4>
                  <p className="text-sm opacity-90">Presenting data analysis research at tech conference</p>
                </div>
              </div>

              {/* Leadership & Community Photos */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <img
                  src="/1000107030.jpg"
                  alt="Leadership in Tech Club"
                  className="w-full h-48 object-cover object-top transition-all duration-500 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="w-full h-48 hidden items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600/20 to-gray-800/20"></div>
                  <div className="text-center text-white z-10">
                    <i className="fas fa-users text-4xl mb-2 opacity-80"></i>
                    <div className="font-bold text-sm">Leadership & Community</div>
                    <div className="text-xs opacity-90">Tech Club President</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-gray-300 text-black px-2 py-1 rounded-full text-xs font-bold">
                  50+ Students
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-bold text-lg mb-1">Leadership & Mentorship</h4>
                  <p className="text-sm opacity-90">Leading coding workshops and mentoring junior students</p>
                </div>
              </div>

              {/* Additional Achievement Photos */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <img
                  src="/1000107030.jpg"
                  alt="Coding Competition Victory"
                  className="w-full h-48 object-cover object-top transition-all duration-500 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="w-full h-48 hidden items-center justify-center bg-gradient-to-br from-gray-800 to-black relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-black/20"></div>
                  <div className="text-center text-white z-10">
                    <i className="fas fa-medal text-4xl mb-2 opacity-80"></i>
                    <div className="font-bold text-sm">Competition Victory</div>
                    <div className="text-xs opacity-90">Multiple Wins</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white text-black px-2 py-1 rounded-full text-xs font-bold">
                  Winner
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-bold text-lg mb-1">Competition Victory</h4>
                  <p className="text-sm opacity-90">Winning moments from various coding competitions</p>
                </div>
              </div>

              {/* Internship Experience */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <img
                  src="/1000107030.jpg"
                  alt="Internship Experience"
                  className="w-full h-48 object-cover object-top transition-all duration-500 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="w-full h-48 hidden items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-gray-700/20"></div>
                  <div className="text-center text-white z-10">
                    <i className="fas fa-briefcase text-4xl mb-2 opacity-80"></i>
                    <div className="font-bold text-sm">Internship Experience</div>
                    <div className="text-xs opacity-90">Data Science Intern</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-gray-200 text-black px-2 py-1 rounded-full text-xs font-bold">
                  Professional
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-bold text-lg mb-1">Internship Experience</h4>
                  <p className="text-sm opacity-90">Professional growth through data science internships</p>
                </div>
              </div>

              {/* Workshop & Teaching */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <img
                  src="/1000107030.jpg"
                  alt="Workshop Teaching Session"
                  className="w-full h-48 object-cover object-top transition-all duration-500 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="w-full h-48 hidden items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600/20 to-gray-800/20"></div>
                  <div className="text-center text-white z-10">
                    <i className="fas fa-chalkboard-teacher text-4xl mb-2 opacity-80"></i>
                    <div className="font-bold text-sm">Workshop Teaching</div>
                    <div className="text-xs opacity-90">Data Science Workshops</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-gray-300 text-black px-2 py-1 rounded-full text-xs font-bold">
                  Mentor
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-bold text-lg mb-1">Workshop Teaching</h4>
                  <p className="text-sm opacity-90">Conducting data science workshops for fellow students</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="mt-16 bg-gradient-to-r from-gray-900 to-black rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-8 text-center">Achievement Highlights</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">15+</div>
                <div className="text-gray-300 text-sm">Competitions Won</div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
                <div className="text-gray-300 text-sm">Problems Solved</div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">8.7</div>
                <div className="text-gray-300 text-sm">CGPA</div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">5+</div>
                <div className="text-gray-300 text-sm">Certifications</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" ref={projectsRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">My Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 hover:-rotate-1">
              <div className="h-56 overflow-hidden">
                <img
                  src="https://readdy.ai/api/search-image?query=Data%20visualization%20dashboard%20with%20multiple%20charts%20and%20graphs%20displaying%20analytics%20information%2C%20clean%20modern%20UI%20with%20dark%20mode%20theme%2C%20showing%20financial%20or%20business%20metrics%20on%20computer%20screen&width=600&height=400&seq=project1&orientation=landscape"
                  alt="Data Analysis Dashboard"
                  className="w-full h-48 object-cover object-top transition-all duration-500 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Data Analysis Dashboard</h3>
                <p className="text-gray-700 mb-4">
                  An interactive dashboard for visualizing complex datasets using Python, Pandas, and Matplotlib.    
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-200 px-2 py-1 text-sm rounded">Python</span>
                  <span className="bg-gray-200 px-2 py-1 text-sm rounded">Pandas</span>
                  <span className="bg-gray-200 px-2 py-1 text-sm rounded">Matplotlib</span>
                </div>
                <div className="flex space-x-3">
                  <a href="#" className="bg-black text-white px-4 py-2 rounded text-sm font-medium cursor-pointer rounded-button whitespace-nowrap">Live Demo</a>
                  <a href="#" className="border border-black px-4 py-2 rounded text-sm font-medium cursor-pointer rounded-button whitespace-nowrap">Source Code</a>
                </div>
              </div>
            </div>
            {/* Project 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 hover:rotate-1">
              <div className="h-56 overflow-hidden">
                <img
                  src="https://readdy.ai/api/search-image?query=Algorithm%20visualization%20tool%20showing%20graph%20traversal%20with%20nodes%20and%20edges%2C%20interactive%20UI%20with%20step-by-step%20execution%20controls%2C%20educational%20computer%20science%20application%20with%20clean%20design&width=600&height=400&seq=project2&orientation=landscape"
                  alt="Algorithm Visualizer"
                  className="w-full h-48 object-cover object-top transition-all duration-500 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Algorithm Visualizer</h3>
                <p className="text-gray-700 mb-4">
                  A web-based tool for visualizing various algorithms and data structures in action.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-200 px-2 py-1 text-sm rounded">JavaScript</span>
                  <span className="bg-gray-200 px-2 py-1 text-sm rounded">React</span>
                  <span className="bg-gray-200 px-2 py-1 text-sm rounded">DSA</span>
                </div>
                <div className="flex space-x-3">
                  <a href="#" className="bg-black text-white px-4 py-2 rounded text-sm font-medium cursor-pointer rounded-button whitespace-nowrap">Live Demo</a>
                  <a href="#" className="border border-black px-4 py-2 rounded text-sm font-medium cursor-pointer rounded-button whitespace-nowrap">Source Code</a>
                </div>
              </div>
            </div>
            {/* Project 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 hover:-rotate-1">
              <div className="h-56 overflow-hidden">
                <img
                  src="https://readdy.ai/api/search-image?query=Machine%20learning%20model%20prediction%20interface%20showing%20image%20classification%20results%20with%20confidence%20scores%2C%20modern%20UI%20with%20sample%20images%20and%20prediction%20statistics%2C%20tech%20research%20project%20visualization&width=600&height=400&seq=project3&orientation=landscape"
                  alt="ML Image Classifier"
                  className="w-full h-48 object-cover object-top transition-all duration-500 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">ML Image Classifier</h3>
                <p className="text-gray-700 mb-4">
                  A machine learning model that classifies images using convolutional neural networks.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-200 px-2 py-1 text-sm rounded">Python</span>
                  <span className="bg-gray-200 px-2 py-1 text-sm rounded">TensorFlow</span>
                  <span className="bg-gray-200 px-2 py-1 text-sm rounded">CNN</span>
                </div>
                <div className="flex space-x-3">
                  <a href="#" className="bg-black text-white px-4 py-2 rounded text-sm font-medium cursor-pointer rounded-button whitespace-nowrap">Live Demo</a>
                  <a href="#" className="border border-black px-4 py-2 rounded text-sm font-medium cursor-pointer rounded-button whitespace-nowrap">Source Code</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">Get In Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Let's Connect</h3>
              <p className="text-lg mb-8 leading-relaxed">
                I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
              </p>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-envelope text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p>monish.e@example.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-map-marker-alt text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p>Chennai, Tamil Nadu, India</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-university text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-medium">University</h4>
                    <p>Rajalakshmi Engineering College</p>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <h4 className="font-medium mb-4">Find me on</h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                    <i className="fab fa-github"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Send Me a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-6 relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-black outline-none bg-transparent transition-colors"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="mb-6 relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-black outline-none bg-transparent transition-colors"
                    placeholder="Your Email"
                    required
                  />
                </div>
                <div className="mb-6 relative">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-black outline-none bg-transparent transition-colors resize-none"
                    placeholder="Your Message"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-black text-white px-8 py-3 text-lg font-medium hover:bg-gray-800 transition-colors w-full cursor-pointer rounded-button whitespace-nowrap"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Navigation */}
      <div className="fixed bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-[95%] sm:w-11/12 md:w-auto max-w-xs sm:max-w-sm md:max-w-none px-2 sm:px-0">
        <div className="bg-gradient-to-r from-gray-900 to-black bg-opacity-95 backdrop-blur-lg px-2 sm:px-3 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 rounded-xl md:rounded-2xl shadow-2xl flex items-center justify-between md:space-x-6 lg:space-x-10 border border-gray-700">
          <button 
            onClick={() => scrollToSection('hero')} 
            className={`group relative flex flex-col items-center transition-all duration-300 touch-manipulation min-w-0 flex-1 md:flex-none ${activeSection === 'hero' ? 'scale-105 md:scale-110' : 'hover:scale-105 md:hover:scale-110 active:scale-95'}`}
            aria-label="Navigate to Home section"
          >
            <div className={`absolute -top-5 sm:-top-6 md:-top-8 transform -translate-y-full opacity-0 bg-black px-1.5 sm:px-2 md:px-3 py-1 rounded text-xs text-white transition-all duration-300 ${activeSection === 'hero' ? 'opacity-100' : 'group-hover:opacity-100'} whitespace-nowrap pointer-events-none z-10`}>
              Home
            </div>
            <div className={`relative w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl transition-all duration-300 ${activeSection === 'hero' ? 'bg-white text-black shadow-lg' : 'text-white hover:bg-white/10 active:bg-white/20'}`}>
              <i className="fas fa-home text-sm sm:text-base md:text-xl"></i>
            </div>
            <div className={`h-0.5 md:h-1 w-full rounded-full mt-0.5 sm:mt-1 transition-all duration-300 ${activeSection === 'hero' ? 'bg-white' : ''}`}></div>
          </button>

          <button 
            onClick={() => scrollToSection('about')} 
            className={`group relative flex flex-col items-center transition-all duration-300 touch-manipulation min-w-0 flex-1 md:flex-none ${activeSection === 'about' ? 'scale-105 md:scale-110' : 'hover:scale-105 md:hover:scale-110 active:scale-95'}`}
            aria-label="Navigate to About section"
          >
            <div className={`absolute -top-5 sm:-top-6 md:-top-8 transform -translate-y-full opacity-0 bg-black px-1.5 sm:px-2 md:px-3 py-1 rounded text-xs text-white transition-all duration-300 ${activeSection === 'about' ? 'opacity-100' : 'group-hover:opacity-100'} whitespace-nowrap pointer-events-none z-10`}>
              About
            </div>
            <div className={`relative w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl transition-all duration-300 ${activeSection === 'about' ? 'bg-white text-black shadow-lg' : 'text-white hover:bg-white/10 active:bg-white/20'}`}>
              <i className="fas fa-user text-sm sm:text-base md:text-xl"></i>
            </div>
            <div className={`h-0.5 md:h-1 w-full rounded-full mt-0.5 sm:mt-1 transition-all duration-300 ${activeSection === 'about' ? 'bg-white' : ''}`}></div>
          </button>

          <button 
            onClick={() => scrollToSection('achievements')} 
            className={`group relative flex flex-col items-center transition-all duration-300 touch-manipulation min-w-0 flex-1 md:flex-none ${activeSection === 'achievements' ? 'scale-105 md:scale-110' : 'hover:scale-105 md:hover:scale-110 active:scale-95'}`}
            aria-label="Navigate to Achievements section"
          >
            <div className={`absolute -top-5 sm:-top-6 md:-top-8 transform -translate-y-full opacity-0 bg-black px-1.5 sm:px-2 md:px-3 py-1 rounded text-xs text-white transition-all duration-300 ${activeSection === 'achievements' ? 'opacity-100' : 'group-hover:opacity-100'} whitespace-nowrap pointer-events-none z-10`}>
              Achievements
            </div>
            <div className={`relative w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl transition-all duration-300 ${activeSection === 'achievements' ? 'bg-white text-black shadow-lg' : 'text-white hover:bg-white/10 active:bg-white/20'}`}>
              <i className="fas fa-trophy text-sm sm:text-base md:text-xl"></i>
            </div>
            <div className={`h-0.5 md:h-1 w-full rounded-full mt-0.5 sm:mt-1 transition-all duration-300 ${activeSection === 'achievements' ? 'bg-white' : ''}`}></div>
          </button>

          <button 
            onClick={() => scrollToSection('projects')} 
            className={`group relative flex flex-col items-center transition-all duration-300 touch-manipulation min-w-0 flex-1 md:flex-none ${activeSection === 'projects' ? 'scale-105 md:scale-110' : 'hover:scale-105 md:hover:scale-110 active:scale-95'}`}
            aria-label="Navigate to Projects section"
          >
            <div className={`absolute -top-5 sm:-top-6 md:-top-8 transform -translate-y-full opacity-0 bg-black px-1.5 sm:px-2 md:px-3 py-1 rounded text-xs text-white transition-all duration-300 ${activeSection === 'projects' ? 'opacity-100' : 'group-hover:opacity-100'} whitespace-nowrap pointer-events-none z-10`}>
              Projects
            </div>
            <div className={`relative w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl transition-all duration-300 ${activeSection === 'projects' ? 'bg-white text-black shadow-lg' : 'text-white hover:bg-white/10 active:bg-white/20'}`}>
              <i className="fas fa-code text-sm sm:text-base md:text-xl"></i>
            </div>
            <div className={`h-0.5 md:h-1 w-full rounded-full mt-0.5 sm:mt-1 transition-all duration-300 ${activeSection === 'projects' ? 'bg-white' : ''}`}></div>
          </button>

          <button 
            onClick={() => scrollToSection('contact')} 
            className={`group relative flex flex-col items-center transition-all duration-300 touch-manipulation min-w-0 flex-1 md:flex-none ${activeSection === 'contact' ? 'scale-105 md:scale-110' : 'hover:scale-105 md:hover:scale-110 active:scale-95'}`}
            aria-label="Navigate to Contact section"
          >
            <div className={`absolute -top-5 sm:-top-6 md:-top-8 transform -translate-y-full opacity-0 bg-black px-1.5 sm:px-2 md:px-3 py-1 rounded text-xs text-white transition-all duration-300 ${activeSection === 'contact' ? 'opacity-100' : 'group-hover:opacity-100'} whitespace-nowrap pointer-events-none z-10`}>
              Contact
            </div>
            <div className={`relative w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl transition-all duration-300 ${activeSection === 'contact' ? 'bg-white text-black shadow-lg' : 'text-white hover:bg-white/10 active:bg-white/20'}`}>
              <i className="fas fa-envelope text-sm sm:text-base md:text-xl"></i>
            </div>
            <div className={`h-0.5 md:h-1 w-full rounded-full mt-0.5 sm:mt-1 transition-all duration-300 ${activeSection === 'contact' ? 'bg-white' : ''}`}></div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">MONISH E</h3>
              <p className="text-gray-400 mt-2">Data Analysis • Design • Development</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">© {new Date().getFullYear()} Monish E. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
  
export default App;
