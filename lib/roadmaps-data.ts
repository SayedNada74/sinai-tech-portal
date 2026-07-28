export interface RoadmapNode {
  id: string;
  label: string;
  labelEn?: string;
  description: string;
  descriptionEn?: string;
  duration: string;
  durationEn?: string;
  courseCodes?: string[];
  resources: { title: string; titleEn?: string; url: string }[];
}

export interface Roadmap {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  duration: string;
  durationEn?: string;
  nodes: RoadmapNode[];
}

export const ROADMAPS: Roadmap[] = [
  {
    id: "frontend",
    title: "تطوير واجهات المستخدم (Frontend Development)",
    titleEn: "Frontend Web Development",
    description: "مسار متكامل يبدأ من أساسيات صفحات الويب إلى بناء تطبيقات تفاعلية متقدمة باستخدام أحدث أطر العمل مثل React و Next.js.",
    descriptionEn: "Comprehensive roadmap starting from web basics to interactive modern apps using React and Next.js.",
    duration: "4 - 6 أشهر",
    durationEn: "4 - 6 Months",
    nodes: [
      {
        id: "fe-1",
        label: "أساسيات الويب HTML & CSS",
        labelEn: "Web Basics: HTML & CSS",
        description: "تعلم كيفية بناء وتصميم هيكل صفحات الويب وتنسيقها بشكل متجاوب مع جميع الشاشات.",
        descriptionEn: "Learn to build web structure and create responsive modern layouts for all screen sizes.",
        duration: "2 أسابيع",
        durationEn: "2 Weeks",
        courseCodes: ["CSW 110", "INT 341"],
        resources: [
          { title: "دورة HTML & CSS كاملة - YouTube", titleEn: "Complete HTML & CSS Course - YouTube", url: "https://youtube.com/html-css-course" },
          { title: "توثيق MDN المعتمد لصفحات الويب", titleEn: "Official MDN Web Documentation", url: "https://developer.mozilla.org" }
        ]
      },
      {
        id: "fe-2",
        label: "برمجة جافا سكريبت JavaScript",
        labelEn: "JavaScript Programming",
        description: "إضافة التفاعل الديناميكي لصفحات الويب، وتعلم منطق البرمجة والمصفوفات ومعالجة البيانات في المتصفح.",
        descriptionEn: "Add dynamic interactivity to web pages, learn programming logic, DOM manipulation, and data handling.",
        duration: "4 أسابيع",
        durationEn: "4 Weeks",
        courseCodes: ["CSW 232", "CSW 337"],
        resources: [
          { title: "شرح JavaScript الأساسيات والمتقدم - YouTube", titleEn: "JS Fundamentals & Advanced - YouTube", url: "https://youtube.com/javascript-playlist" },
          { title: "مستودع تدريبات JS العملي", titleEn: "Practical JS Exercises Repository", url: "https://github.com/exercises/javascript" }
        ]
      },
      {
        id: "fe-3",
        label: "أطر عمل الويب الحديثة (React)",
        labelEn: "Modern Web Frameworks (React)",
        description: "بناء واجهات مستخدم معقدة باستخدام المكونات القابلة لإعادة الاستخدام وإدارة الحالة (State Management).",
        descriptionEn: "Build complex scalable UIs using reusable components, state management, and modern hooks.",
        duration: "6 أسابيع",
        durationEn: "6 Weeks",
        courseCodes: ["INT 343", "CSW 335"],
        resources: [
          { title: "توثيق React الرسمي", titleEn: "Official React Documentation", url: "https://react.dev" },
          { title: "دورة React الشاملة للمشاريع - YouTube", titleEn: "Complete React Projects Course - YouTube", url: "https://youtube.com/react-course" }
        ]
      }
    ]
  },
  {
    id: "backend",
    title: "تطوير الأنظمة الخلفية (Backend Development)",
    titleEn: "Backend Systems Development",
    description: "تعلم كيفية تصميم وبناء خوادم الويب، وقواعد البيانات الكبيرة، وبناء الـ APIs وتأمين وحفظ بيانات المستخدمين.",
    descriptionEn: "Learn to design web servers, large scale databases, RESTful APIs, and secure user data.",
    duration: "5 - 7 أشهر",
    durationEn: "5 - 7 Months",
    nodes: [
      {
        id: "be-1",
        label: "أساسيات لغات خادم الويب (Java / Node.js)",
        labelEn: "Server Languages (Java / Node.js)",
        description: "تعلم كتابة الأكواد التي تعمل على الخادم ومعالجة الطلبات وإدارة الملفات والملفات النصية.",
        descriptionEn: "Write server-side code, handle HTTP requests, routing, and file processing.",
        duration: "4 أسابيع",
        durationEn: "4 Weeks",
        courseCodes: ["CSW 234", "CSW 241"],
        resources: [
          { title: "دورة البرمجة بلغة Java المتقدمة", titleEn: "Advanced Java Backend Programming", url: "https://youtube.com/java-backend" }
        ]
      },
      {
        id: "be-2",
        label: "نظم قواعد البيانات Database & SQL",
        labelEn: "Database Systems & SQL",
        description: "تصميم جداول البيانات والربط بينها وكتابة استعلامات سريعة لاسترجاع وحفظ البيانات بكفاءة.",
        descriptionEn: "Design relational database schemas, write SQL queries, and optimize data fetching.",
        duration: "4 أسابيع",
        durationEn: "4 Weeks",
        courseCodes: ["ISD 242", "CSW 221"],
        resources: [
          { title: "كورس SQL وقواعد البيانات الشامل", titleEn: "Comprehensive SQL & Database Course", url: "https://youtube.com/sql-database" }
        ]
      },
      {
        id: "be-3",
        label: "أمن الخوادم والاتصالات API Security",
        labelEn: "Server & API Security",
        description: "تأمين طلبات الـ HTTP وحفظ كلمات المرور المشفرة وإدارة الجلسات والأمان والشبكات المعقدة.",
        descriptionEn: "Secure HTTP endpoints, implement password hashing, JWT authentication, and session control.",
        duration: "6 أسابيع",
        durationEn: "6 Weeks",
        courseCodes: ["INT 232", "INT 435"],
        resources: [
          { title: "دليل تأمين التطبيقات ويب وحفظ الأمان", titleEn: "OWASP Web Security Guide", url: "https://owasp.org" }
        ]
      }
    ]
  },
  {
    id: "ai",
    title: "الذكاء الاصطناعي وعلوم البيانات (AI & Data Science)",
    titleEn: "AI & Data Science",
    description: "الدخول في عالم تحليل البيانات الضخمة، وخوارزميات تعلم الآلة والتعلم العميق وبناء النماذج الذكية التنبؤية.",
    descriptionEn: "Dive into big data analysis, machine learning algorithms, deep learning models, and AI predictions.",
    duration: "6 - 9 أشهر",
    durationEn: "6 - 9 Months",
    nodes: [
      {
        id: "ai-1",
        label: "الرياضيات والإحصاء للذكاء الاصطناعي",
        labelEn: "Mathematics & Statistics for AI",
        description: "فهم الجبر الخطي، الاحتمالات والإحصاء، والتفاضل الذي يشكل النواة الأساسية لتعلم الآلة.",
        descriptionEn: "Understand linear algebra, probability, statistics, and calculus required for ML models.",
        duration: "6 أسابيع",
        durationEn: "6 Weeks",
        courseCodes: ["Ma 110", "St 120", "Ma 111"],
        resources: [
          { title: "كورس الرياضيات لتعلم الآلة - Coursera", titleEn: "Mathematics for ML - Coursera", url: "https://coursera.org/math-ml" }
        ]
      },
      {
        id: "ai-2",
        label: "خوارزميات البحث والذكاء الاصطناعي",
        labelEn: "AI Search & Decision Algorithms",
        description: "تطبيق خوارزميات البحث التقليدية وحل المشكلات المعقدة والتنبؤ بالأشجار البيانية.",
        descriptionEn: "Implement classical AI search algorithms, constraint satisfaction, and decision trees.",
        duration: "6 أسابيع",
        durationEn: "6 Weeks",
        courseCodes: ["CSW 351", "Ma 212"],
        resources: [
          { title: "سلسلة خوارزميات الذكاء الاصطناعي - YouTube", titleEn: "AI Algorithms Series - YouTube", url: "https://youtube.com/ai-search" }
        ]
      },
      {
        id: "ai-3",
        label: "معالجة الصور والأنماط الرقمية",
        labelEn: "Digital Image Processing & Patterns",
        description: "تطبيق خوارزميات معالجة الصور الرقمية والتعرف على الأنماط والوجوه وتصنيف الأشكال.",
        descriptionEn: "Apply digital image processing algorithms, pattern recognition, face detection, and shape classification.",
        duration: "8 أسابيع",
        durationEn: "8 Weeks",
        courseCodes: ["INT 422", "INT 423", "INT 421"],
        resources: [
          { title: "دورة معالجة الصور باستخدام Python & OpenCV", titleEn: "Image Processing Course (Python & OpenCV)", url: "https://youtube.com/opencv-image" }
        ]
      }
    ]
  }
];
