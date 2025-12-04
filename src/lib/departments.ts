
export interface Subject {
  name: string;
  coverImage: string;
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
              { name: "Environmental Studies", coverImage: "https://m.media-amazon.com/images/I/616879jQ0bL._UF1000,1000_QL80_.jpg" },
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
    name: " Faculty of Science B.Sc IT / CS",
    courses: [
      {
        id: "bsc-it",
        name: "BSc IT",
        semesters: [
          {
            id: "sem1",
            name: "Semester 1",
            subjects: [
              { name: "Computer Fundamentals", coverImage: "https://m.media-amazon.com/images/I/61BVzbRQS1L._UF1000,1000_QL80_.jpg" },
              { name: "C Programming", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI1_eKa6_5WUCvOPSJuaYRZeynl5JKIAer0g&s" },
              { name: "Digital Electronics", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbs0-V-Jld2SXVM0IGofo5iJ8HOuFpaA3YBw&s" },
              { name: "Mathematics-I", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4vk2sfR4YE4WLz7-8vQBcmfirnMxyHhY_UA&s" },
               { name: "Communication Skills", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoncSinVkpstJd8tYf67uN16H9tWtTfOUlsQ&s" },
            ],
          },
          {
            id: "sem2",
            name: "Semester 2",
            subjects: [
              { name: "Data Structures", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqcDoISJYFF5l5N7jPRk53E1Gq-xI8hiASEQ&s" },
              { name: "Object-Oriented Programming (C++)", coverImage: "https://m.media-amazon.com/images/I/51%2Bte02isFL._AC_SY200_QL15_.jpg" },
              { name: "Database Management System", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJsTK_sfdAE3dBDbPRX5roeM31__mgcAGp5w&s" },
              { name: "Operating Systems", coverImage: "https://bpbonline.com/cdn/shop/products/9789388511711_-_2.jpg?v=1755670145" },
              { name: "Mathematics-II", coverImage: "https://media.springernature.com/full/springer-static/cover-hires/book/978-3-319-42105-6" },
            ],
          },
          {
            id: "sem3",
            name: "Semester 3",
            subjects: [
              { name: "Java Programming", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR76iN8uAsodQGcy_YiwAnoPrKUT5EpIfkHJA&s" },
              { name: "Computer Networks", coverImage: "https://m.media-amazon.com/images/I/5139UsCTBeL._UF1000,1000_QL80_.jpg" },
              { name: "Software Engineering", coverImage: "https://novapublishers.com/wp-content/uploads/2020/11/9781536189896-1000x1587.jpg" },
              { name: "Web Technologies-I (HTML, CSS, JS)", coverImage: "https://m.media-amazon.com/images/I/818dhKbYMLL._UF1000,1000_QL80_.jpg" },
            ],
          },
           {
            id: "sem4",
            name: "Semester 4",
            subjects: [
              { name: "Python Programming", coverImage: "https://m.media-amazon.com/images/I/61ViPUXS8ZL._UF1000,1000_QL80_.jpg"},
              { name: "Computer Architecture", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdtdHZQBteyw9RqGGtfKR6d-Q5VFmAV0RAtQ&s" },
              { name: "Web Technologies-II (React, Node.js)", coverImage: "https://m.media-amazon.com/images/I/81SMVOOWMLL._UF350,350_QL50_.jpg" },
              { name: "Data Communication", coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1347319715i/122060.jpg" },
            ],
          },
          {
            id: "sem5",
            name: "Semester 5",
            subjects: [
              { name: "Data Science with Python", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU3VhOQZtzMeGS9va2L5vhWKW2TJK0xF3ijw&s" },
              { name: "Cloud Computing", coverImage: "https://media.springernature.com/full/springer-static/cover-hires/book/978-3-319-54645-2" },
              { name: "Information Security", coverImage: "https://m.media-amazon.com/images/I/81C4UK3Jg4L.jpg" },
              { name: "Artificial Intelligence", coverImage: "https://media.springernature.com/full/springer-static/cover-hires/book/978-1-4842-5028-0" },
            ],
          },
          {
            id: "sem6",
            name: "Semester 6",
            subjects: [
              { name: "Machine Learning", coverImage: "https://bpbonline.com/cdn/shop/products/240_Epub.jpg?v=1755669996" },
              { name: "Mobile App Development", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWRjH6RDW94zorOWr-TSOtjmAT6r1LQmtyhQ&s" },
              { name: "Internet of Things (IoT)", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbq-GQs7GPlNRQD-vhsREI6_rFggrFJej9gw&s" },
              { name: "Project Management", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXncMQeDseFMzbs7Byq4F0qzxFHJuKD60Nfw&s" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "bba",
    name: "BBA",
    courses: [
      {
        id: "bba-course",
        name: "BBA",
        semesters: [
          {
            id: "sem1",
            name: "Semester 1",
            subjects: [
              { name: "Principles of Management", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4WgmIPX2s3u4tbE9u4lrFrYpq0xSAQ-jJTQ&s" },
              { name: "Business Communication", coverImage: "https://m.media-amazon.com/images/I/81PTPG5atfL._UF1000,1000_QL80_.jpg" },
              { name: "Business Economics", coverImage: "https://m.media-amazon.com/images/I/81HFt6Lo0AL._UF1000,1000_QL80_.jpg" },
              { name: "Financial Accounting", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz7GEuj1NvZMJW6gzlTkfSz9pSbLejc_iWGw&s" },
              { name: "Business Mathematics", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyO3QlgDT081zpo8g98yWXMn2JEhRDizGPPw&s" },
            ],
          },
          {
            id: "sem2",
            name: "Semester 2",
            subjects: [
              { name: "Marketing Management", coverImage: "https://m.media-amazon.com/images/I/31RYsdZrLyL._UF1000,1000_QL80_.jpg" },
              { name: "Business Law", coverImage: "https://m.media-amazon.com/images/I/91NtWHzWWVL._UF1000,1000_QL80_.jpg" },
              { name: "Cost Accounting", coverImage: "https://m.media-amazon.com/images/I/A1CQtCkYT3L.jpg" },
              { name: "Computer Applications", coverImage: "https://m.media-amazon.com/images/I/81CCHS5X88L.jpg" },
              { name: "Environmental Studies", coverImage: "https://m.media-amazon.com/images/I/616879jQ0bL._UF1000,1000_QL80_.jpg" },
            ],
          },
          {
            id: "sem3",
            name: "Semester 3",
            subjects: [
              { name: "Human Resource Management", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJVnMFhEe2Py-aXqx971BR-VYBjkqW4imXBg&s" },
              { name: "Organizational Behavior", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr2SSxTvUoGUJsIjY9YVFtnH-OkWaHVumosQ&s" },
              { name: "Business Statistics", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSotMcto6odZE6EexVGAgoOVklm0-Ul9ZVSgQ&s" },
              { name: "Financial Management", coverImage: "https://m.media-amazon.com/images/I/618uJ+81VNL._UF1000,1000_QL80_.jpg" },
              { name: "Entrepreneurship Development", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFuWYo3FRJlaV4a3EFwacw0wx9zIJpJDFclQ&s" },
            ],
          },
          {
            id: "sem4",
            name: "Semester 4",
            subjects: [
              { name: "Production & Operations Management", coverImage: "https://m.media-amazon.com/images/I/61VETX9CinL.jpg" },
              { name: "Business Research Methods", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfvRlMrHTJf_igJDZ0LVYjb1pM4tRbjgfqAw&s" },
              { name: "Management Information Systems", coverImage: "https://m.media-amazon.com/images/I/81-w3wQfp5L._UF1000,1000_QL80_.jpg" },
              { name: "Advertising & Media Management", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTlZO-52uMQMBfUKUzFfjUhuuLEHPv6QslWA&s" },
            ],
          },
          {
            id: "sem5",
            name: "Semester 5",
            subjects: [
              { name: "Strategic Management", coverImage: "https://m.media-amazon.com/images/I/51wEjthLVxL._UF1000,1000_QL80_.jpg" },
              { name: "International Business", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEQ8mOxgtu-OTBxP7Fy5sGOZA4EciSZt9uDA&s" },
              { name: "Services Marketing", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR894ALfm3Iy28gSxP8au6Ht26Zook1qJYOw&s" },
              { name: "E-Commerce", coverImage: "https://m.media-amazon.com/images/I/61zW7dht8aL._UF1000,1000_QL80_.jpg" },
            ],
          },
          {
            id: "sem6",
            name: "Semester 6",
            subjects: [
              { name: "Business Ethics & Corporate Governance", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOaj2PU9-vz-PztXeEyejt3FZZlv3CeY1ekQ&s" },
              { name: "Digital Marketing", coverImage: "https://www.sultanchandandsons.com/Images/BookImages/FrontImage/TC%20%201292.jpg" },
              { name: "Management Control System", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc7SrTLvAVtmcRgVHKx_QLuQ6GdcxsQ7UBxg&s" },
              { name: "Innovation & Startup Management", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7D-ZCi3MbrZ2fcTnS1FjYQKgJPqv2020AwQ&s" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "bcom",
    name: "B.Com",
    courses: [
      {
        id: "bcom-course",
        name: "B.Com",
        semesters: [
            {
                id: "sem1",
                name: "Semester 1",
                subjects: [
                    { name: "Financial Accounting", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj3x8-Yg5YKkwXQG0iT3wKG-89m9fwXyFzSw&s" },
                    { name: "Business Organization", coverImage: "https://himpub.com/wp-content/uploads/2023/02/BI2546.jpeg" },
                    { name: "Business Economics", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTznHvXeH_iVmWeQPfKVdSSjz8CXEs0HtsUmg&s" },
                    { name: "Business Communication", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQfKacyPrAYKb0vQ5w6r2KES-RQXZ8LmsQ&s" },
                    { name: "Environmental Studies", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfTw4GUm2kQ4vruuj4-tdzV2UOFn-rmHythA&s" },
                ],
            },
            {
                id: "sem2",
                name: "Semester 2",
                subjects: [
                    { name: "Corporate Accounting", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWuolyZYhkBaYMJU0dl7f9nvaH8eXMd3wJEw&s" },
                    { name: "Business Law", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuqJhwTf3Mxd0JfX24gE0x8010wW_jgOfZeg&s" },
                    { name: "Business Statistics", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzjj0uS85sIXgwXsFvMItwbj1QBzjzu9rLpA&s" },
                    { name: "Marketing Principles", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhFEe3r2uCL_Rf3T9UGSxkUwiLceSVPTCZwQ&s" },
                    { name: "Computer Applications in Business", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ2PQHj6GeBb7SIQ2hG6E3bT7Er5R2XFAWHw&s" },
                ],
            },
            {
                id: "sem3",
                name: "Semester 3",
                subjects: [
                    { name: "Cost Accounting", coverImage: "https://m.media-amazon.com/images/I/713+vcxQGIL.jpg" },
                    { name: "Company Law", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvc14z1c2nB8Mrbh6QELkWcw9ZtxfQjs6G6A&s" },
                    { name: "Income Tax-I", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpXxswI9elzSwTF114b38eliM1q1e8vBefIA&s" },
                    { name: "Banking & Insurance", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4-43RaiRdvxahtUlhHkMtisb-XOhPEmrlpQ&s" },
                ],
            },
            {
                id: "sem4",
                name: "Semester 4",
                subjects: [
                    { name: "Auditing", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdAA26hO99zBZUiExc-_K-crOQCJ4o0YQvcA&s" },
                    { name: "Indirect Tax", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnsLcwwKPc9WgQaFWmCvnae9OB2tXlurGS1g&s" },
                    { name: "Financial Management", coverImage: "https://m.media-amazon.com/images/I/618uJ+81VNL._UF1000,1000_QL80_.jpg" },
                ],
            },
            {
                id: "sem5",
                name: "Semester 5",
                subjects: [
                    { name: "Advanced Accounting", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTshB-vRXB2U_g4nxjsPuRis-bxU4pcyy4KKg&s" },
                    { name: "Income Tax-II", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRttPUYld3PMRXUMss0ZN8PDMDnzbfh_BpZ1w&s" },
                    { name: "E-Commerce", coverImage: "https://m.media-amazon.com/images/I/81yFTG9EqBL._UF1000,1000_QL80_.jpg" },
                    { name: "International Trade", coverImage: "https://media.springernature.com/full/springer-static/cover-hires/book/978-3-540-78265-0" },
                ],
            },
            {
                id: "sem6",
                name: "Semester 6",
                subjects: [
                    { name: "Corporate Finance", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh29a5s6wxqyAkPBWSyPAEAiRl3mKa1ZhozA&s" },
                    { name: "Investment Management", coverImage: "https://d1xcofdbxwssh7.cloudfront.net/live/supload/books/55253/processed/Screenshot2024-06-05at3.webp" },
                    { name: "Business Ethics", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaxG9wKjSGpf8jl8RMD_fZgtNH2wndQrjt_w&s" },
                    { name: "Strategic Management", coverImage: "https://m.media-amazon.com/images/I/51wEjthLVxL._UF1000,1000_QL80_.jpg" },
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
                    { name: "Political Science – V", coverImage: "https://m.media-amazon.com/images?q=tbn:ANd9GcQEQ8mOxgtu-OTBxP7Fy5sGOZA4EciSZt9uDA&s" },
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

    