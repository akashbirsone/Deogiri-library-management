
export interface Subject {
  name: string;
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
              { name: "Environmental Studies" },
              { name: "Communication Skills" },
              { name: "Computer Basics" },
              { name: "Soft Skills Development" },
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
              { name: "Fundamentals of IT" },
              { name: "Programming in C" },
              { name: "Digital Electronics" },
              { name: "Mathematics-I" },
            ],
          },
          {
            id: "sem2",
            name: "Semester 2",
            subjects: [
              { name: "Data Structures" },
              { name: "OOP in C++" },
              { name: "Computer Organization" },
              { name: "Mathematics-II" },
            ],
          },
          {
            id: "sem3",
            name: "Semester 3",
            subjects: [
              { name: "DBMS" },
              { name: "Operating Systems" },
              { name: "Web Technologies (HTML, CSS, JS)" },
              { name: "Networking" },
              { name: "Software Engineering" },
            ],
          },
          {
            id: "sem4",
            name: "Semester 4",
            subjects: [
              { name: "Java Programming" },
              { name: "Computer Graphics" },
              { name: "Microprocessors" },
              { name: "Algorithms" },
              { name: "Numerical Methods" },
            ],
          },
          {
            id: "sem5",
            name: "Semester 5",
            subjects: [
              { name: "Python Programming" },
              { name: "Mobile App Development" },
              { name: "Cloud Computing" },
              { name: "Computer Security" },
              { name: "Project-I" },
            ],
          },
          {
            id: "sem6",
            name: "Semester 6",
            subjects: [
              { name: "AI" },
              { name: "Machine Learning" },
              { name: "Data Analytics" },
              { name: "IoT" },
              { name: "Project-II" },
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
                    { name: "Programming in C" },
                    { name: "Mathematics-I" },
                    { name: "Computer Organization" },
                    { name: "Communication Skills" },
                ],
            },
            {
                id: "sem2-cs",
                name: "Semester 2",
                subjects: [
                    { name: "Data Structures" },
                    { name: "Operating Systems" },
                    { name: "Database Systems" },
                    { name: "Discrete Mathematics" },
                ],
            },
            {
                id: "sem3-cs",
                name: "Semester 3",
                subjects: [
                    { name: "Computer Networks" },
                    { name: "Java Programming" },
                    { name: "Software Engineering" },
                    { name: "Microprocessor" },
                ],
            },
            {
                id: "sem4-cs",
                name: "Semester 4",
                subjects: [
                    { name: "Web Technologies" },
                    { name: "Data Analytics" },
                    { name: "Machine Learning" },
                    { name: "Project-I" },
                ],
            },
            {
                id: "sem5-cs",
                name: "Semester 5",
                subjects: [
                    { name: "Artificial Intelligence" },
                    { name: "Cloud Computing" },
                    { name: "Cyber Security" },
                    { name: "Project-II" },
                ],
            },
            {
                id: "sem6-cs",
                name: "Semester 6",
                subjects: [
                    { name: "Mobile App Development" },
                    { name: "Research Project" },
                    { name: "IoT" },
                    { name: "Big Data" },
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
              { name: "Principles of Management" },
              { name: "Business Communication" },
              { name: "Financial Accounting" },
              { name: "Business Economics" },
              { name: "Computer Applications" },
            ],
          },
          {
            id: "sem2",
            name: "Semester 2",
            subjects: [
              { name: "Marketing Management" },
              { name: "Business Environment" },
              { name: "Cost Accounting" },
              { name: "Business Math" },
              { name: "HR Management" },
            ],
          },
          {
            id: "sem3",
            name: "Semester 3",
            subjects: [
              { name: "Organizational Behaviour" },
              { name: "Research Methodology" },
              { name: "Financial Management" },
              { name: "Operations Management" },
              { name: "Business Law" },
            ],
          },
          {
            id: "sem4",
            name: "Semester 4",
            subjects: [
              { name: "Entrepreneurship" },
              { name: "Consumer Behaviour" },
              { name: "Management Accounting" },
              { name: "E-Commerce" },
              { name: "Environmental Management" },
            ],
          },
          {
            id: "sem5",
            name: "Semester 5",
            subjects: [
              { name: "Strategic Management" },
              { name: "Investment Analysis" },
              { name: "International Business" },
              { name: "Leadership" },
              { name: "Project-I" },
            ],
          },
          {
            id: "sem6",
            name: "Semester 6",
            subjects: [
              { name: "Business Ethics" },
              { name: "Services Marketing" },
              { name: "Digital Marketing" },
              { name: "Innovation & Entrepreneurship" },
              { name: "Project-II" },
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
                    { name: "Financial Accounting" },
                    { name: "Business Organisation" },
                    { name: "Business Economics" },
                    { name: "Business Communication" },
                ],
            },
            {
                id: "sem2",
                name: "Semester 2",
                subjects: [
                    { name: "Corporate Accounting" },
                    { name: "Company Law" },
                    { name: "Business Math" },
                    { name: "Statistics" },
                ],
            },
            {
                id: "sem3",
                name: "Semester 3",
                subjects: [
                    { name: "Cost Accounting" },
                    { name: "Income Tax Law" },
                    { name: "Business Finance" },
                    { name: "Auditing" },
                ],
            },
            {
                id: "sem4",
                name: "Semester 4",
                subjects: [
                    { name: "Advanced Accounting" },
                    { name: "GST" },
                    { name: "Banking & Insurance" },
                    { name: "Management Accounting" },
                ],
            },
            {
                id: "sem5",
                name: "Semester 5",
                subjects: [
                    { name: "Corporate Governance" },
                    { name: "Financial Management" },
                    { name: "International Trade" },
                    { name: "HR Management" },
                ],
            },
            {
                id: "sem6",
                name: "Semester 6",
                subjects: [
                    { name: "Advanced Costing" },
                    { name: "Financial Markets" },
                    { name: "Strategic Management" },
                    { name: "Project Report" },
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
                    { name: "English Literature – I" },
                    { name: "Political Science – I" },
                    { name: "Sociology – I" },
                    { name: "History – I" },
                    { name: "Psychology – I" },
                ],
            },
            {
                id: "sem2",
                name: "Semester 2",
                subjects: [
                    { name: "English Literature – II" },
                    { name: "Political Science – II" },
                    { name: "Sociology – II" },
                    { name: "History – II" },
                    { name: "Psychology – II" },
                ],
            },
            {
                id: "sem3",
                name: "Semester 3",
                subjects: [
                    { name: "English Literature – III" },
                    { name: "Political Science – III" },
                    { name: "Sociology – III" },
                    { name: "History – III" },
                    { name: "Psychology – III" },
                ],
            },
            {
                id: "sem4",
                name: "Semester 4",
                subjects: [
                    { name: "English Literature – IV" },
                    { name: "Political Science – IV" },
                    { name: "Sociology – IV" },
                    { name: "History – IV" },
                    { name: "Psychology – IV" },
                ],
            },
            {
                id: "sem5",
                name: "Semester 5",
                subjects: [
                    { name: "English Literature – V" },
                    { name: "Political Science – V" },
                    { name: "Sociology – V" },
                    { name: "History – V" },
                    { name: "Psychology – V" },
                ],
            },
            {
                id: "sem6",
                name: "Semester 6",
                subjects: [
                    { name: "English Literature – VI" },
                    { name: "Political Science – VI" },
                    { name: "Sociology – VI" },
                    { name: "History – VI" },
                    { name: "Psychology – VI" },
                ],
            },
        ],
      },
    ],
  },
];
