
export interface Subject {
  name: string;
  coverImage?: string;
}

export interface Semester {
  id: string;
  name: string;
  subjects: Subject[];
}

export interface Course {
  id: string;
  name: string;
  semesters: Semester[];
}

export interface Department {
  id: string;
  name: string;
  courses: Course[];
}

export const departments: Department[] = [
  {
    id: "general",
    name: "General / All Departments",
    courses: [
      {
        id: "common",
        name: "Common Subjects",
        semesters: [
          {
            id: "sem-common",
            name: "All Semesters",
            subjects: [
              { name: "Environmental Studies", coverImage: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7" },
              { name: "Communication Skills", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoncSinVkpstJd8tYf67uN16H9tWtTfOUlsQ&s" },
              { name: "Computer Basics", coverImage: "https://m.media-amazon.com/images/I/61BVzbRQS1L._UF1000,1000_QL80_.jpg" },
              { name: "Soft Skills Development", coverImage: "https://images.unsplash.com/photo-1543269865-cbf427effbad" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "bsc-it-cs",
    name: "BSc IT / Computer Science",
    courses: [
      {
        id: "bsc-it",
        name: "BSc IT",
        semesters: [
          {
            id: "sem1",
            name: "Semester 1",
            subjects: [
              { name: "Fundamentals of IT", coverImage: "https://m.media-amazon.com/images/I/61BVzbRQS1L._UF1000,1000_QL80_.jpg" },
              { name: "Programming in C", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI1_eKa6_5WUCvOPSJuaYRZeynl5JKIAer0g&s" },
              { name: "Digital Electronics", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbs0-V-Jld2SXVM0IGofo5iJ8HOuFpaA3YBw&s" },
              { name: "Mathematics-I", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4vk2sfR4YE4WLz7-8vQBcmfirnMxyHhY_UA&s" },
            ],
          },
          {
            id: "sem2",
            name: "Semester 2",
            subjects: [
              { name: "Data Structures", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqcDoISJYFF5l5N7jPRk53E1Gq-xI8hiASEQ&s" },
              { name: "OOP in C++", coverImage: "https://m.media-amazon.com/images/I/51%2Bte02isFL._AC_SY200_QL15_.jpg" },
              { name: "Computer Organization", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdtdHZQBteyw9RqGGtfKR6d-Q5VFmAV0RAtQ&s" },
              { name: "Mathematics-II", coverImage: "https://media.springernature.com/full/springer-static/cover-hires/book/978-3-319-42105-6" },
            ],
          },
          {
            id: "sem3",
            name: "Semester 3",
            subjects: [
              { name: "DBMS", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJsTK_sfdAE3dBDbPRX5roeM31__mgcAGp5w&s" },
              { name: "Operating Systems", coverImage: "https://bpbonline.com/cdn/shop/products/9789388511711_-_2.jpg?v=1755670145" },
              { name: "Web Technologies (HTML, CSS, JS)", coverImage: "https://m.media-amazon.com/images/I/818dhKbYMLL._UF1000,1000_QL80_.jpg" },
              { name: "Networking", coverImage: "https://m.media-amazon.com/images/I/5139UsCTBeL._UF1000,1000_QL80_.jpg" },
              { name: "Software Engineering", coverImage: "https://novapublishers.com/wp-content/uploads/2020/11/9781536189896-1000x1587.jpg" },
            ],
          },
           {
            id: "sem4",
            name: "Semester 4",
            subjects: [
              { name: "Java Programming", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR76iN8uAsodQGcy_YiwAnoPrKUT5EpIfkHJA&s"},
              { name: "Computer Graphics", coverImage: "https://m.media-amazon.com/images/I/71Y-N1-d93L._AC_UF1000,1000_QL80_.jpg" },
              { name: "Microprocessors", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWRjH6RDW94zorOWr-TSOtjmAT6r1LQmtyhQ&s" },
              { name: "Algorithms", coverImage: "https://m.media-amazon.com/images/I/5139UsCTBeL._UF1000,1000_QL80_.jpg" },
              { name: "Numerical Methods", coverImage: "https://m.media-amazon.com/images/I/61ViPUXS8ZL._UF1000,1000_QL80_.jpg" },
            ],
          },
          {
            id: "sem5",
            name: "Semester 5",
            subjects: [
              { name: "Python Programming", coverImage: "https://m.media-amazon.com/images/I/61ViPUXS8ZL._UF1000,1000_QL80_.jpg" },
              { name: "Mobile App Development", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWRjH6RDW94zorOWr-TSOtjmAT6r1LQmtyhQ&s" },
              { name: "Cloud Computing", coverImage: "https://media.springernature.com/full/springer-static/cover-hires/book/978-3-319-54645-2" },
              { name: "Computer Security", coverImage: "https://m.media-amazon.com/images/I/81C4UK3Jg4L.jpg" },
              { name: "Project-I", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXncMQeDseFMzbs7Byq4F0qzxFHJuKD60Nfw&s" },
            ],
          },
          {
            id: "sem6",
            name: "Semester 6",
            subjects: [
              { name: "AI", coverImage: "https://media.springernature.com/full/springer-static/cover-hires/book/978-1-4842-5028-0" },
              { name: "Machine Learning", coverImage: "https://bpbonline.com/cdn/shop/products/240_Epub.jpg?v=1755669996" },
              { name: "Data Analytics", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU3VhOQZtzMeGS9va2L5vhWKW2TJK0xF3ijw&s" },
              { name: "IoT", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbq-GQs7GPlNRQD-vhsREI6_rFggrFJej9gw&s" },
              { name: "Project-II", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXncMQeDseFMzbs7Byq4F0qzxFHJuKD60Nfw&s" },
            ],
          },
        ],
      },
      {
        id: "cs",
        name: "Computer Science",
        semesters: [
            {
                id: "sem1-cs",
                name: "Semester 1",
                subjects: [
                    { name: "Programming in C", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI1_eKa6_5WUCvOPSJuaYRZeynl5JKIAer0g&s" },
                    { name: "Mathematics-I", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4vk2sfR4YE4WLz7-8vQBcmfirnMxyHhY_UA&s" },
                    { name: "Computer Organization", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdtdHZQBteyw9RqGGtfKR6d-Q5VFmAV0RAtQ&s" },
                    { name: "Communication Skills", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoncSinVkpstJd8tYf67uN16H9tWtTfOUlsQ&s" },
                ],
            },
            {
                id: "sem2-cs",
                name: "Semester 2",
                subjects: [
                    { name: "Data Structures", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqcDoISJYFF5l5N7jPRk53E1Gq-xI8hiASEQ&s" },
                    { name: "Operating Systems", coverImage: "https://bpbonline.com/cdn/shop/products/9789388511711_-_2.jpg?v=1755670145" },
                    { name: "Database Systems", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJsTK_sfdAE3dBDbPRX5roeM31__mgcAGp5w&s" },
                    { name: "Discrete Mathematics", coverImage: "https://m.media-amazon.com/images/I/51H5m24Yy3L._SY445_SX342_.jpg" },
                ],
            },
            {
                id: "sem3-cs",
                name: "Semester 3",
                subjects: [
                    { name: "Computer Networks", coverImage: "https://m.media-amazon.com/images/I/5139UsCTBeL._UF1000,1000_QL80_.jpg" },
                    { name: "Java Programming", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR76iN8uAsodQGcy_YiwAnoPrKUT5EpIfkHJA&s" },
                    { name: "Software Engineering", coverImage: "https://novapublishers.com/wp-content/uploads/2020/11/9781536189896-1000x1587.jpg" },
                    { name: "Microprocessor", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWRjH6RDW94zorOWr-TSOtjmAT6r1LQmtyhQ&s" },
                ],
            },
            {
                id: "sem4-cs",
                name: "Semester 4",
                subjects: [
                    { name: "Web Technologies", coverImage: "https://m.media-amazon.com/images/I/818dhKbYMLL._UF1000,1000_QL80_.jpg" },
                    { name: "Data Analytics", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU3VhOQZtzMeGS9va2L5vhWKW2TJK0xF3ijw&s" },
                    { name: "Machine Learning", coverImage: "https://bpbonline.com/cdn/shop/products/240_Epub.jpg?v=1755669996" },
                    { name: "Project-I", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXncMQeDseFMzbs7Byq4F0qzxFHJuKD60Nfw&s" },
                ],
            },
            {
                id: "sem5-cs",
                name: "Semester 5",
                subjects: [
                    { name: "Artificial Intelligence", coverImage: "https://media.springernature.com/full/springer-static/cover-hires/book/978-1-4842-5028-0" },
                    { name: "Cloud Computing", coverImage: "https://media.springernature.com/full/springer-static/cover-hires/book/978-3-319-54645-2" },
                    { name: "Cyber Security", coverImage: "https://m.media-amazon.com/images/I/81C4UK3Jg4L.jpg" },
                    { name: "Project-II", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXncMQeDseFMzbs7Byq4F0qzxFHJuKD60Nfw&s" },
                ],
            },
            {
                id: "sem6-cs",
                name: "Semester 6",
                subjects: [
                    { name: "Mobile App Development", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWRjH6RDW94zorOWr-TSOtjmAT6r1LQmtyhQ&s" },
                    { name: "Research Project", coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aaa" },
                    { name: "IoT", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbq-GQs7GPlNRQD-vhsREI6_rFggrFJej9gw&s" },
                    { name: "Big Data", coverImage: "https://images.unsplash.com/photo-1599595801223-288a7c29b7a3" },
                ],
            },
        ],
      }
    ],
  },
  {
    id: "bba",
    name: "BBA (Bachelor of Business Administration)",
    courses: [
      {
        id: "bba-course",
        name: "BBA",
        semesters: [
          {
            id: "sem1",
            name: "Semester 1",
            subjects: [
              { name: "Principles of Management", coverImage: "https://m.media-amazon.com/images/I/818Xf2o0MfL._AC_UF1000,1000_QL80_.jpg" },
              { name: "Business Communication", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoncSinVkpstJd8tYf67uN16H9tWtTfOUlsQ&s" },
              { name: "Financial Accounting", coverImage: "https://m.media-amazon.com/images/I/71r5E1p0V0L._AC_UF1000,1000_QL80_.jpg" },
              { name: "Business Economics", coverImage: "https://m.media-amazon.com/images/I/81SozF2T38L._AC_UF1000,1000_QL80_.jpg" },
              { name: "Computer Applications", coverImage: "https://m.media-amazon.com/images/I/61BVzbRQS1L._UF1000,1000_QL80_.jpg" },
            ],
          },
          {
            id: "sem2",
            name: "Semester 2",
            subjects: [
              { name: "Marketing Management", coverImage: "https://m.media-amazon.com/images/I/71D0wL6-r2L._AC_UF1000,1000_QL80_.jpg" },
              { name: "Business Environment", coverImage: "https://m.media-amazon.com/images/I/910gpCo5vNL._AC_UF1000,1000_QL80_.jpg" },
              { name: "Cost Accounting", coverImage: "https://m.media-amazon.com/images/I/815zLGlZtML._AC_UF1000,1000_QL80_.jpg" },
              { name: "Business Math", coverImage: "https://m.media-amazon.com/images/I/71r5m6OF1LL._AC_UF1000,1000_QL80_.jpg" },
              { name: "HR Management", coverImage: "https://m.media-amazon.com/images/I/815zLGlZtML._AC_UF1000,1000_QL80_.jpg" },
            ],
          },
          {
            id: "sem3",
            name: "Semester 3",
            subjects: [
              { name: "Organizational Behaviour", coverImage: "https://m.media-amazon.com/images/I/812A8Iq3gJL._AC_UF1000,1000_QL80_.jpg" },
              { name: "Research Methodology", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
              { name: "Financial Management", coverImage: "https://m.media-amazon.com/images/I/81e-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
              { name: "Operations Management", coverImage: "https://m.media-amazon.com/images/I/81i-Q-c-N-L._AC_UF1000,1000_QL80_.jpg" },
              { name: "Business Law", coverImage: "https://m.media-amazon.com/images/I/81d-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
            ],
          },
          {
            id: "sem4",
            name: "Semester 4",
            subjects: [
              { name: "Entrepreneurship", coverImage: "https://m.media-amazon.com/images/I/71e-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
              { name: "Consumer Behaviour", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
              { name: "Management Accounting", coverImage: "https://m.media-amazon.com/images/I/81b-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
              { name: "E-Commerce", coverImage: "https://m.media-amazon.com/images/I/71e-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
              { name: "Environmental Management", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
            ],
          },
          {
            id: "sem5",
            name: "Semester 5",
            subjects: [
              { name: "Strategic Management", coverImage: "https://m.media-amazon.com/images/I/81b-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
              { name: "Investment Analysis", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
              { name: "International Business", coverImage: "https://m.media-amazon.com/images/I/81e-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
              { name: "Leadership", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
              { name: "Project-I", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXncMQeDseFMzbs7Byq4F0qzxFHJuKD60Nfw&s" },
            ],
          },
          {
            id: "sem6",
            name: "Semester 6",
            subjects: [
              { name: "Business Ethics", coverImage: "https://m.media-amazon.com/images/I/81b-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
              { name: "Services Marketing", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
              { name: "Digital Marketing", coverImage: "https://m.media-amazon.com/images/I/81e-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
              { name: "Innovation & Entrepreneurship", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
              { name: "Project-II", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXncMQeDseFMzbs7Byq4F0qzxFHJuKD60Nfw&s" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "bcom",
    name: "B.Com (Commerce)",
    courses: [
      {
        id: "bcom-course",
        name: "B.Com",
        semesters: [
            {
                id: "sem1",
                name: "Semester 1",
                subjects: [
                    { name: "Financial Accounting", coverImage: "https://m.media-amazon.com/images/I/71r5E1p0V0L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Business Organisation", coverImage: "https://m.media-amazon.com/images/I/818Xf2o0MfL._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Business Economics", coverImage: "https://m.media-amazon.com/images/I/81SozF2T38L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Business Communication", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoncSinVkpstJd8tYf67uN16H9tWtTfOUlsQ&s" },
                ],
            },
            {
                id: "sem2",
                name: "Semester 2",
                subjects: [
                    { name: "Corporate Accounting", coverImage: "https://m.media-amazon.com/images/I/71r5E1p0V0L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Company Law", coverImage: "https://m.media-amazon.com/images/I/81d-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Business Math", coverImage: "https://m.media-amazon.com/images/I/71r5m6OF1LL._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Statistics", coverImage: "https://m.media-amazon.com/images/I/71r5m6OF1LL._AC_UF1000,1000_QL80_.jpg" },
                ],
            },
            {
                id: "sem3",
                name: "Semester 3",
                subjects: [
                    { name: "Cost Accounting", coverImage: "https://m.media-amazon.com/images/I/815zLGlZtML._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Income Tax Law", coverImage: "https://m.media-amazon.com/images/I/81d-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Business Finance", coverImage: "https://m.media-amazon.com/images/I/81e-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Auditing", coverImage: "https://m.media-amazon.com/images/I/81d-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                ],
            },
            {
                id: "sem4",
                name: "Semester 4",
                subjects: [
                    { name: "Advanced Accounting", coverImage: "https://m.media-amazon.com/images/I/71r5E1p0V0L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "GST", coverImage: "https://m.media-amazon.com/images/I/81d-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Banking & Insurance", coverImage: "https://m.media-amazon.com/images/I/81e-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Management Accounting", coverImage: "https://m.media-amazon.com/images/I/81b-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                ],
            },
            {
                id: "sem5",
                name: "Semester 5",
                subjects: [
                    { name: "Corporate Governance", coverImage: "https://m.media-amazon.com/images/I/81d-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Financial Management", coverImage: "https://m.media-amazon.com/images/I/81e-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "International Trade", coverImage: "https://m.media-amazon.com/images/I/81b-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "HR Management", coverImage: "https://m.media-amazon.com/images/I/815zLGlZtML._AC_UF1000,1000_QL80_.jpg" },
                ],
            },
            {
                id: "sem6",
                name: "Semester 6",
                subjects: [
                    { name: "Advanced Costing", coverImage: "https://m.media-amazon.com/images/I/815zLGlZtML._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Financial Markets", coverImage: "https://m.media-amazon.com/images/I/81e-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Strategic Management", coverImage: "https://m.media-amazon.com/images/I/81b-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Project Report", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXncMQeDseFMzbs7Byq4F0qzxFHJuKD60Nfw&s" },
                ],
            },
        ],
      },
    ],
  },
  {
    id: "ba",
    name: "BA (Bachelor of Arts)",
    courses: [
      {
        id: "ba-course",
        name: "BA",
        semesters: [
           {
                id: "sem1",
                name: "Semester 1",
                subjects: [
                    { name: "English Literature – I", coverImage: "https://m.media-amazon.com/images/I/81b-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Political Science – I", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Sociology – I", coverImage: "https://m.media-amazon.com/images/I/81e-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "History – I", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Psychology – I", coverImage: "https://m.media-amazon.com/images/I/81b-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                ],
            },
            {
                id: "sem2",
                name: "Semester 2",
                subjects: [
                    { name: "English Literature – II", coverImage: "https://m.media-amazon.com/images/I/81b-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Political Science – II", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Sociology – II", coverImage: "https://m.media-amazon.com/images/I/81e-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "History – II", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Psychology – II", coverImage: "https://m.media-amazon.com/images/I/81b-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                ],
            },
            {
                id: "sem3",
                name: "Semester 3",
                subjects: [
                    { name: "English Literature – III", coverImage: "https://m.media-amazon.com/images/I/81b-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Political Science – III", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Sociology – III", coverImage: "https://m.media-amazon.com/images/I/81e-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "History – III", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Psychology – III", coverImage: "https://m.media-amazon.com/images/I/81b-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                ],
            },
            {
                id: "sem4",
                name: "Semester 4",
                subjects: [
                    { name: "English Literature – IV", coverImage: "https://m.media-amazon.com/images/I/81b-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Political Science – IV", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Sociology – IV", coverImage: "https://m.media-amazon.com/images/I/81e-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "History – IV", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Psychology – IV", coverImage: "https://m.media-amazon.com/images/I/81b-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                ],
            },
            {
                id: "sem5",
                name: "Semester 5",
                subjects: [
                    { name: "English Literature – V", coverImage: "https://m.media-amazon.com/images/I/81b-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Political Science – V", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Sociology – V", coverImage: "https://m.media-amazon.com/images/I/81e-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "History – V", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Psychology – V", coverImage: "https://m.media-amazon.com/images/I/81b-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                ],
            },
            {
                id: "sem6",
                name: "Semester 6",
                subjects: [
                    { name: "English Literature – VI", coverImage: "https://m.media-amazon.com/images/I/81b-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Political Science – VI", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Sociology – VI", coverImage: "https://m.media-amazon.com/images/I/81e-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                    { name: "History – VI", coverImage: "https://m.media-amazon.com/images/I/81c-d7G5BVL._AC_UF1000,1000_QL80_.jpg" },
                    { name: "Psychology – VI", coverImage: "https://m.media-amazon.com/images/I/81b-N8c-N-L._AC_UF1000,1000_QL80_.jpg" },
                ],
            },
        ],
      },
    ],
  },
];

    