
"use client";

import * as React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book as BookType, Student } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/contexts/app-provider";
import {
  PlusCircle,
  Trash,
  Edit,
  Loader2,
  BookOpenCheck,
  MoreVertical,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { departments } from "@/lib/departments";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export function BooksView() {
  const {
    user,
    books: allBooks,
    borrowBook,
    addBook,
    updateBook,
    deleteBook,
    seedDatabase,
    restoreBook,
  } = useApp();

  const isStudent = user?.role === 'student';
  const studentProfile = isStudent ? (user as Student) : null;

  const [selectedDeptId, setSelectedDeptId] = React.useState<string | null>(studentProfile?.department || null);
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(studentProfile?.course || null);
  const [selectedSemesterId, setSelectedSemesterId] = React.useState<string | null>(null);
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingBook, setEditingBook] = React.useState<BookType | null>(null);
  const [formSubject, setFormSubject] = React.useState<string>("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const { toast } = useToast();
  
  const selectedDepartment = React.useMemo(() => departments.find((d) => d.id === selectedDeptId), [selectedDeptId]);
  const selectedCourse = React.useMemo(() => selectedDepartment?.courses.find((c) => c.id === selectedCourseId), [selectedDepartment, selectedCourseId]);
  const selectedSemester = React.useMemo(() => selectedCourse?.semesters.find((s) => s.id === selectedSemesterId), [selectedCourse, selectedSemesterId]);

  React.useEffect(() => {
    if (studentProfile) {
        setSelectedDeptId(studentProfile.department || null);
        setSelectedCourseId(studentProfile.course || null);
    }
  }, [studentProfile]);

  React.useEffect(() => {
    if (selectedSemester && user?.role === "admin") {
      seedDatabase(selectedDeptId!, selectedCourseId!, selectedSemesterId!);
    }
  }, [selectedSemester, selectedDeptId, selectedCourseId, selectedSemesterId, seedDatabase, user]);


  const getPath = (subjectName: string) => {
    if (!selectedDeptId || !selectedCourseId || !selectedSemesterId || !subjectName) return null;
    return `departments/${selectedDeptId}/courses/${selectedCourseId}/semesters/${selectedSemesterId}/subjects/${subjectName}/books`;
  }
  
  const booksForSelectedFilters = React.useMemo(() => {
    return allBooks.filter(book => {
      const deptMatch = !selectedDeptId || book.department === selectedDeptId;
      const courseMatch = !selectedCourseId || book.course === selectedCourseId;
      const semMatch = !selectedSemesterId || book.semester === selectedSemesterId;
      
      const searchMatch = searchTerm.trim() === "" ||
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());

      return deptMatch && courseMatch && semMatch && searchMatch;
    });
  }, [allBooks, selectedDeptId, selectedCourseId, selectedSemesterId, searchTerm]);


  const handleFormSubmit = async (bookData: Partial<BookType>) => {
    if (!user || !formSubject) return;

    if (editingBook && editingBook.path) {
      await updateBook(
        editingBook.path,
        { ...editingBook, ...bookData }
      );
      toast({
        title: "Book Updated",
        description: `${bookData.title} has been updated.`,
      });
    } else {
        const path = getPath(formSubject);
        if(!path) return;

      const newBook: Omit<BookType, "id" | "path"> = {
        title: bookData.title || "",
        author: bookData.author || "",
        subject: formSubject,
        isAvailable: bookData.isAvailable ?? true,
        coverImage:
          bookData.coverImage ||
          `https://picsum.photos/seed/${encodeURIComponent(
            formSubject
          )}/300/450`,
        coverImageHint: formSubject,
        addedBy: user.email || "unknown",
        addedDate: new Date().toISOString(),
        department: selectedDeptId!,
        course: selectedCourseId!,
        semester: selectedSemesterId!
      };
      await addBook(path, newBook);
      toast({
        title: "Book Added",
        description: `${bookData.title} has been added to the catalog.`,
      });
    }
    setIsFormOpen(false);
    setEditingBook(null);
    setFormSubject("");
  };
  
  const handleEditBook = (book: BookType) => {
    setEditingBook(book);
    setFormSubject(book.subject);
    setIsFormOpen(true);
  };
  
  const handleDeleteBook = async (book: BookType) => {
    await deleteBook(book.path);
    toast({
      title: 'Book Deleted',
      description: `${book.title} has been removed.`,
      action: (
        <Button variant="secondary" size="sm" onClick={() => restoreBook(book.path, book)}>
          Undo
        </Button>
      ),
    });
  }

  const openAddBookForm = (subject: string) => {
    setEditingBook(null);
    setFormSubject(subject);
    setIsFormOpen(true);
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'librarian';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Book Catalog
        </h1>
      </div>
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="department-select">Department</Label>
              <Select 
                onValueChange={(value) => { setSelectedDeptId(value); setSelectedCourseId(null); setSelectedSemesterId(null);}}
                value={selectedDeptId || ""}
                disabled={false}
              >
                <SelectTrigger id="department-select" >
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dep) => (
                    <SelectItem key={dep.id} value={dep.id}>
                      {dep.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="course-select">Course</Label>
              <Select
                onValueChange={(value) => { setSelectedCourseId(value); setSelectedSemesterId(null); }}
                disabled={!selectedDepartment}
                value={selectedCourseId || ""}
              >
                <SelectTrigger id="course-select">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDepartment?.courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="semester-select">Semester</Label>
              <Select
                onValueChange={setSelectedSemesterId}
                disabled={!selectedCourse}
                value={selectedSemesterId || ""}
              >
                <SelectTrigger id="semester-select">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCourse?.semesters.map((sem) => (
                    <SelectItem key={sem.id} value={sem.id}>
                      {sem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
           {selectedSemester && (
            <>
              <Separator className="my-4" />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by book title or author..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {selectedSemester && (
         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {selectedSemester.subjects.map((subject) => {
            const subjectBooks = booksForSelectedFilters.filter(
              (book) => book.subject === subject.name
            );
            
            if (searchTerm && subjectBooks.length === 0) {
                return null;
            }

            return (
              <Card key={subject.name} className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-headline text-xl">{subject.name}</CardTitle>
                  {isAdmin && (
                    <Button variant="outline" size="sm" onClick={() => openAddBookForm(subject.name)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Book
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  {subjectBooks.length > 0 ? (
                    <div className="space-y-4">
                      {subjectBooks.map((book) => (
                        <div key={book.id} className="flex items-center gap-4">
                            <div className="relative w-16 h-20 rounded-md overflow-hidden flex-shrink-0">
                                <Image 
                                    src={book.coverImage || `https://picsum.photos/seed/${encodeURIComponent(book.subject)}/300/450`}
                                    alt={book.title}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={book.coverImageHint}
                                />
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold leading-tight">{book.title}</p>
                                <p className="text-sm text-muted-foreground">by {book.author}</p>
                                <Badge variant={book.isAvailable ? "secondary" : "destructive"} className="mt-1">
                                    {book.isAvailable ? "Available" : "Unavailable"}
                                </Badge>
                            </div>
                            <div className="ml-auto">
                                {isAdmin ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEditBook(book)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteBook(book)} className="text-destructive">
                                                <Trash className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Button
                                      size="sm"
                                      disabled={!book.isAvailable}
                                      onClick={() => borrowBook(book.id)}
                                    >
                                      Borrow
                                    </Button>
                                )}
                            </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                      <BookOpenCheck className="mx-auto h-12 w-12" />
                      <p className="mt-4">No books found for this subject.</p>
                      {isAdmin && (
                        <p className="text-xs mt-2">Click 'Add Book' to get started.</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <BookForm
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormOpen(false)}
          book={editingBook}
          subject={formSubject}
        />
      </Dialog>
    </div>
  );
}

const BookForm = ({
  onSubmit,
  book,
  subject,
}: {
  onSubmit: (data: Partial<BookType>) => void;
  onClose: () => void;
  book: BookType | null;
  subject: string;
}) => {
  const [formData, setFormData] = React.useState<Partial<BookType>>(
    book || {
      title: "",
      author: "",
      coverImage: "",
      isAvailable: true,
    }
  );

  React.useEffect(() => {
    if (book) {
      setFormData(book);
    } else {
      setFormData({
        title: "",
        author: "",
        coverImage: "",
        isAvailable: true,
      });
    }
  }, [book]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          {book ? "Edit Book" : "Add New Book"} for '{subject}'
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="author" className="text-right">
            Author
          </Label>
          <Input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="coverImage" className="text-right">
            Cover URL
          </Label>
          <Input
            id="coverImage"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            className="col-span-3"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="isAvailable" className="text-right">
            Available
          </Label>
          <Switch
            id="isAvailable"
            checked={formData.isAvailable}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isAvailable: checked })
            }
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};  

    