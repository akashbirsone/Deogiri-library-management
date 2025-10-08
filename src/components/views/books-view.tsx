
"use client"

import * as React from "react";
import Image from "next/image";
import { books as allBooks } from "@/lib/data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book as BookType } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/contexts/app-provider";
import { MoreVertical, PlusCircle, Trash, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function BooksView() {
    const { role, borrowBook } = useApp();
    const [searchTerm, setSearchTerm] = React.useState("");
    const [category, setCategory] = React.useState("all");
    const [department, setDepartment] = React.useState("all");
    const [bookList, setBookList] = React.useState(allBooks);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingBook, setEditingBook] = React.useState<BookType | null>(null);

    const handleAddBook = (newBook: BookType) => {
        if (editingBook) {
            setBookList(bookList.map(b => b.id === newBook.id ? newBook : b));
        } else {
            setBookList([...bookList, { ...newBook, id: `book-${Date.now()}` }]);
        }
    };

    const handleEditBook = (book: BookType) => {
        setEditingBook(book);
        setIsFormOpen(true);
    };

    const handleDeleteBook = (bookId: string) => {
        setBookList(bookList.filter(b => b.id !== bookId));
    };
    
    const openAddBookForm = () => {
        setEditingBook(null);
        setIsFormOpen(true);
    }

    const filteredBooks = bookList.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'all' || book.category === category;
        const matchesDepartment = department === 'all' || book.department === department;
        return matchesSearch && matchesCategory && matchesDepartment;
    });
    
    const categories = ['all', ...Array.from(new Set(allBooks.map(b => b.category)))];
    const departments = ['all', ...Array.from(new Set(allBooks.map(b => b.department).filter(Boolean))) as string[]];


  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Book Catalog</h1>
        {(role === 'admin' || role === 'librarian') && (
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                    <Button onClick={openAddBookForm}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Book
                    </Button>
                </DialogTrigger>
                <BookForm 
                    onSubmit={handleAddBook} 
                    onClose={() => setIsFormOpen(false)}
                    book={editingBook}
                />
            </Dialog>
        )}
      </div>
      <Card>
        <CardContent className="p-4 space-y-4">
            <Input 
                placeholder="Search books by title or author…" 
                className="w-full md:w-1/2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="w-full md:w-auto">
                    <p className="text-sm font-medium mb-2">Department</p>
                        <Select onValueChange={setDepartment} defaultValue="all">
                        <SelectTrigger className="w-full md:w-[240px]">
                            <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {departments.filter(d => d !== 'all').map(dep => (
                                <SelectItem key={dep} value={dep} className="capitalize">
                                    {dep}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="w-full md:w-auto">
                    <p className="text-sm font-medium mb-2">Category</p>
                     <Select onValueChange={setCategory} defaultValue="all">
                        <SelectTrigger className="w-full md:w-[240px]">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.filter(c => c !== 'all').map(cat => (
                                <SelectItem key={cat} value={cat} className="capitalize">
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardContent>
      </Card>

        {filteredBooks.length > 0 ? (
             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} onEdit={handleEditBook} onDelete={handleDeleteBook} onBorrow={() => borrowBook(book.id)} />
                ))}
            </div>
        ) : (
            <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No books found.</p>
                <p>Try adjusting your search or filters.</p>
            </div>
        )}
     
    </div>
  );
}


function BookCard({ book, onEdit, onDelete, onBorrow }: { book: BookType; onEdit: (book: BookType) => void; onDelete: (bookId: string) => void; onBorrow: () => void; }) {
  const { role } = useApp();
  
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0 relative">
        <Image
          src={book.coverImage}
          alt={`Cover of ${book.title}`}
          width={300}
          height={450}
          className="w-full h-60 object-cover"
          data-ai-hint={book.coverImageHint}
        />
        <Badge className="absolute top-2 left-2" variant={book.availableCopies > 0 ? 'secondary' : 'destructive'}>
          {book.availableCopies > 0 ? 'Available' : 'Borrowed'}
        </Badge>
        {(role === 'admin' || role === 'librarian') && (
            <div className="absolute top-2 right-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(book)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(book.id)} className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex flex-wrap gap-1 mb-2">
            <Badge variant="outline">{book.category}</Badge>
            {book.department && <Badge variant="outline">{book.department}</Badge>}
        </div>
        <CardTitle className="font-headline text-lg mb-1 leading-tight">{book.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        <p className="text-xs text-muted-foreground mt-2">ISBN: {book.isbn}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" disabled={book.availableCopies === 0} onClick={onBorrow}>
          {book.availableCopies > 0 ? 'Borrow Book' : 'Unavailable'}
        </Button>
      </CardFooter>
    </Card>
  );
}

const BookForm = ({ onSubmit, onClose, book }: { onSubmit: (data: BookType) => void; onClose: () => void; book: BookType | null }) => {
    const [formData, setFormData] = React.useState<Partial<BookType>>(
        book || {
            title: '',
            author: '',
            isbn: '',
            category: '',
            department: '',
            publicationYear: new Date().getFullYear(),
            totalCopies: 1,
            availableCopies: 1,
            coverImage: 'https://picsum.photos/seed/newbook/300/450',
            coverImageHint: 'book cover'
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData as BookType);
        onClose();
    };

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{book ? 'Edit Book' : 'Add New Book'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="author" className="text-right">Author</Label>
                    <Input id="author" name="author" value={formData.author} onChange={handleChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="isbn" className="text-right">ISBN</Label>
                    <Input id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">Category</Label>
                    <Input id="category" name="category" value={formData.category} onChange={handleChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">Department</Label>
                    <Input id="department" name="department" value={formData.department} onChange={handleChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="totalCopies" className="text-right">Total Copies</Label>
                    <Input id="totalCopies" name="totalCopies" type="number" value={formData.totalCopies} onChange={handleChange} className="col-span-3" required />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
};

    
