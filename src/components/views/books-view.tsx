
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
import { Book as BookType } from "@/types";
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

export function BooksView() {
  const {
    user,
    books: allBooks,
    borrowBook,
    addBook,
    updateBook,
    deleteBook,
    loading: appLoading,
  } = useApp();

  const [selectedDeptId, setSelectedDeptId] = React.useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = React.useState<string | null>(null);
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingBook, setEditingBook] = React.useState<BookType | null>(null);
  const [formSubject, setFormSubject] = React.useState<string>("");
  const { toast } = useToast();
  
  const selectedDepartment = React.useMemo(() => departments.find((d) => d.id === selectedDeptId), [selectedDeptId]);
  const selectedCourse = React.useMemo(() => selectedDepartment?.courses.find((c) => c.id === selectedCourseId), [selectedDepartment, selectedCourseId]);
  const selectedSemester = React.useMemo(() => selectedCourse?.semesters.find((s) => s.id === selectedSemesterId), [selectedCourse, selectedSemesterId]);

  const getPath = (subjectName: string) => {
    if (!selectedDeptId || !selectedCourseId || !selectedSemesterId || !subjectName) return null;
    return `departments/${selectedDeptId}/courses/${selectedCourseId}/semesters/${selectedSemesterId}/subjects/${subjectName}/books`;
  }
  
  const booksForSelectedFilters = React.useMemo(() => {
    if (!selectedSemesterId) return [];
    return allBooks.filter(book => 
      book.department === selectedDeptId &&
      book.course === selectedCourseId &&
      book.semester === selectedSemesterId
    );
  }, [allBooks, selectedDeptId, selectedCourseId, selectedSemesterId]);


  const handleFormSubmit = async (bookData: Partial<BookType>) => {
    const path = getPath(formSubject);
    if (!user || !path || !formSubject) return;

    if (editingBook && "id" in editingBook) {
      await updateBook(
        `${path}/${editingBook.id}`,
        { ...editingBook, ...bookData }
      );
      toast({
        title: "Book Updated",
        description: `${bookData.title} has been updated.`,
      });
    } else {
      const newBook: Omit<Book, "id"> = {
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
      const path = getPath(book.subject);
      if (!path) return;
      await deleteBook(`${path}/${book.id}`);
      toast({ title: "Book Deleted", variant: "destructive" });
  }

  const openAddBookForm = (subject: string) => {
    setEditingBook(null);
    setFormSubject(subject);
    setIsFormOpen(true);
  };

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
              <Select onValueChange={(value) => { setSelectedDeptId(value); setSelectedCourseId(null); setSelectedSemesterId(null);}}>
                <SelectTrigger id="department-select">
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
        </CardContent>
      </Card>

      {appLoading && selectedSemesterId && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!appLoading && selectedSemester && (
        <div className="space-y-8">
          {selectedSemester.subjects.map((subject) => {
            const subjectBooks = booksForSelectedFilters.filter(
              (book) => book.subject === subject.name
            );
            return (
              <div key={subject.name}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-headline text-2xl font-semibold">
                    {subject.name}
                  </h2>
                  {(user?.role === "admin" || user?.role === "librarian") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openAddBookForm(subject.name)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Book to {subject.name}
                    </Button>
                  )}
                </div>
                {subjectBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {subjectBooks.map((book) => (
                      <Card
                        key={book.id}
                        className="flex flex-col overflow-hidden"
                      >
                        <CardHeader className="p-0">
                          <div className="relative aspect-[3/4]">
                            <Image
                              src={book.coverImage || `https://picsum.photos/seed/${encodeURIComponent(book.subject)}/300/450`}
                              alt={book.title}
                              fill
                              className="object-cover"
                              data-ai-hint={book.coverImageHint}
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 flex-grow flex flex-col">
                          <CardTitle className="text-base font-semibold leading-snug tracking-tight mb-1">
                            {book.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            by {book.author}
                          </p>
                          <div className="mt-auto pt-4">
                            <Badge
                              variant={
                                book.isAvailable ? "secondary" : "destructive"
                              }
                            >
                              {book.isAvailable ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          {user?.role === "student" && (
                            <Button
                              className="w-full"
                              disabled={!book.isAvailable}
                              onClick={() => {
                                const bookPath = getPath(book.subject);
                                if(!bookPath) return;
                                borrowBook(`${bookPath}/${book.id}`)
                              }}
                            >
                              Borrow
                            </Button>
                          )}
                          {(user?.role === "admin" ||
                            user?.role === "librarian") && (
                            <div className="w-full flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditBook(book)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive"
                                onClick={() => handleDeleteBook(book)}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                              <div className="flex items-center space-x-2 ml-auto">
                                <Switch
                                    id={`available-${book.id}`}
                                    checked={book.isAvailable}
                                    onCheckedChange={(isAvailable) => {
                                        const bookPath = getPath(book.subject);
                                        if(!bookPath) return;
                                        updateBook(`${bookPath}/${book.id}`, { isAvailable })
                                    }}
                                />
                                <Label htmlFor={`available-${book.id}`} className="text-xs">Available</Label>
                                </div>
                            </div>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                    <BookOpenCheck className="mx-auto h-12 w-12" />
                    <p className="mt-4">No books found for this subject.</p>
                     {(user?.role === "admin" || user?.role === "librarian") && (
                        <Button
                            variant="link"
                            className="mt-2"
                            onClick={() => openAddBookForm(subject.name)}
                        >
                            Add the first book
                        </Button>
                     )}
                  </div>
                )}
              </div>
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
      isAvailable: true,
    }
  );

  React.useEffect(() => {
    if (book) {
      setFormData(book);
    } else {
      setFormData({
        title: subject, // Pre-fill title with subject
        author: "",
        isAvailable: true,
      });
    }
  }, [book, subject]);

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
